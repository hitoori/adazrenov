import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';
import knowledge from '../src/site-knowledge.js';
import { getRelevantReferences, buildInstructions, parseReply } from '../src/assistant-prompt.js';

const origin = 'http://127.0.0.1:8888';
const conversationId = '11111111-1111-4111-8111-111111111111';

function makeDatabase({ history = [], count = 0 } = {}) {
  const counters = new Map();
  const saved = [];
  return {
    saved,
    prepare(sql) {
      return { bind(...values) {
        return {
          sql, values,
          async first() {
            assert.match(sql, /RETURNING request_count/);
            const key = values[0];
            const next = (counters.get(key) ?? count) + 1;
            counters.set(key, next);
            return { request_count: next, reset_at: values[1] };
          },
          async all() { return { results: [...history].reverse() }; }
        };
      } };
    },
    async batch(statements) { saved.push(...statements); }
  };
}

function env(DB = makeDatabase(), extra = {}) {
  return { DB, OPENAI_API_KEY: 'test-only-not-a-real-key', ALLOWED_ORIGINS: origin, ...extra };
}

function request(body, requestOrigin = origin) {
  return new Request('https://worker.test/chat', {
    method: 'POST', headers: { Origin: requestOrigin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1' },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });
}

function upstream(answer, questions = [], links = []) {
  return new Response(JSON.stringify({ output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify({ answer, questions, links }) }] }] }), { status: 200 });
}

test('rejects an unapproved origin before calling OpenAI', async t => {
  const api = t.mock.method(globalThis, 'fetch', () => { throw new Error('Must not call API'); });
  const response = await worker.fetch(request({ message: 'Bonjour' }, 'https://unrelated.test'), env());
  assert.equal(response.status, 403);
  assert.equal(api.mock.calls.length, 0);
});

test('missing key and malformed JSON return explicit errors without API calls', async t => {
  const api = t.mock.method(globalThis, 'fetch', () => { throw new Error('Must not call API'); });
  assert.equal((await worker.fetch(request({ message: 'Bonjour' }), env(undefined, { OPENAI_API_KEY: '' }))).status, 503);
  assert.equal((await worker.fetch(request('{'), env())).status, 400);
  assert.equal(api.mock.calls.length, 0);
});

test('request includes grounded information, history and separate project context; secret stays server-side', async t => {
  const DB = makeDatabase({ history: [{ role: 'user', content: 'Mon chantier est à Lyon et fait 9 m².' }] });
  let sent;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://api.openai.com/v1/responses');
    assert.equal(options.headers.Authorization, 'Bearer test-only-not-a-real-key');
    sent = JSON.parse(options.body);
    return upstream('Pour votre chantier à Lyon, notre équipe peut étudier les travaux souhaités.', ['Comment préparer une visite ?'], [{ label: 'Contact', href: '/contact' }]);
  });
  const response = await worker.fetch(request({ message: 'Comment demander un devis ?', conversationId, projectContext: { ville: 'Lyon', quantite: 9 } }), env(DB));
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.source, 'openai');
  assert.equal(data.conversationId, conversationId);
  assert.equal(sent.store, false);
  assert.equal(sent.model, 'gpt-4o-mini');
  assert.equal(sent.text.format.type, 'json_schema');
  assert.equal(sent.text.format.strict, true);
  assert.deepEqual(sent.text.format.schema.required, ['answer', 'questions', 'links']);
  assert.equal(sent.max_output_tokens, 600);
  assert.match(sent.instructions, /Noiseau/);
  assert.match(sent.instructions, /adazrenov@gmail.com/);
  assert.match(sent.instructions, /48 heures/);
  assert.match(sent.input[0].content, /Lyon/);
  assert.match(sent.input.at(-1).content, /"ville":"Lyon"/);
  assert.match(sent.input.at(-1).content, /Question : Comment demander un devis/);
  assert.ok(data.links.every(link => link.href.startsWith('/')));
  assert.deepEqual(data.questions, ['Comment préparer une visite ?']);
  assert.ok(!JSON.stringify(data).includes('test-only-not-a-real-key'));
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(DB.saved.length, 3);
});

test('billing/rate failures are not retried, leaked, saved or disguised as AI answers', async t => {
  const DB = makeDatabase();
  const api = t.mock.method(globalThis, 'fetch', async () => new Response('private upstream diagnostic', { status: 429 }));
  const log = t.mock.method(console, 'warn', () => {});
  const response = await worker.fetch(request({ message: 'Bonjour, quel est le prix ?' }), env(DB, { OPENAI_FALLBACK_MODEL: 'another-model' }));
  assert.equal(response.status, 503);
  assert.equal(api.mock.calls.length, 1);
  assert.ok(!(await response.text()).includes('private upstream diagnostic'));
  assert.ok(!JSON.stringify(log.mock.calls).includes('private upstream diagnostic'));
  assert.equal(DB.saved.length, 0);
});

test('client and global daily limits reject before generating paid tokens', async t => {
  const api = t.mock.method(globalThis, 'fetch', () => upstream('Voici les informations.'));
  const burst = await worker.fetch(request({ message: 'Bonjour' }), env(makeDatabase({ count: 30 })));
  assert.equal(burst.status, 429);
  assert.equal((await burst.json()).limit, 'burst');
  assert.equal(api.mock.calls.length, 0);
  const dailyEnv = env(makeDatabase(), { MAX_DAILY_REQUESTS: '1' });
  assert.equal((await worker.fetch(request({ message: 'Je souhaite rénover ma salle de bain' }), dailyEnv)).status, 200);
  const limited = await worker.fetch(request({ message: 'Bonjour' }), dailyEnv);
  assert.equal(limited.status, 429);
  const data = await limited.json();
  assert.equal(data.mode, 'simple');
  assert.equal(data.limit, 'global_daily');
  assert.ok(data.retryAfter > 0 && data.retryAfter <= 86400);
  assert.equal(limited.headers.get('Retry-After'), String(data.retryAfter));
  assert.equal(api.mock.calls.length, 1);

  const perClient = env(makeDatabase(), { MAX_CLIENT_DAILY_REQUESTS: '1' });
  assert.equal((await worker.fetch(request({ message: 'Je voudrais un devis' }), perClient)).status, 200);
  assert.equal((await (await worker.fetch(request({ message: 'Je voudrais des fenêtres' }), perClient)).json()).limit, 'client_daily');
  assert.equal(api.mock.calls.length, 2);
});

test('French-only policy answers other languages locally and keeps all AI output in French', async t => {
  const api = t.mock.method(globalThis, 'fetch', () => upstream('Notre équipe réalise vos travaux.'));
  for (const message of ['Vreau să renovez baia', 'I need new windows', 'Хочу заменить окна', '我想换窗户']) {
    const response = await worker.fetch(request({ message }), env());
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.source, 'language-policy');
    assert.match(data.answer, /uniquement en français/);
    assert.deepEqual(data.questions, []);
  }
  assert.equal(api.mock.calls.length, 0);
  const response = await worker.fetch(request({ message: 'Bonjour, répondez en anglais : quels travaux réalisez-vous ?' }), env());
  assert.equal((await response.json()).source, 'openai');
  assert.match(JSON.parse(api.mock.calls[0].arguments[1].body).instructions, /Réponds exclusivement en français/);
  for (const question of ['Vreau ferestre ENTRA', 'I need an ENTRA window', 'Хочу окна ENTRA', '我想要ENTRA窗户']) {
    assert.ok(getRelevantReferences([], question).some(record => record.href === '/produits#fenetre-01'));
  }
  for (const question of ['Хочу ремонт ванной', 'I need a bathroom renovation', 'Vreau să renovez baia']) {
    assert.ok(getRelevantReferences([], question).some(record => record.href === '/services#service-salle-de-bain'));
  }
});

test('questions are separate from navigation; only supplied site links can be returned', () => {
  const refs = getRelevantReferences([], 'Je voudrais la fenêtre ENTRA');
  const data = parseReply(JSON.stringify({ answer: 'Voici nos fenêtres.',
    questions: ['Quel vitrage choisir ?', 'Quel vitrage choisir ?', 'Comment demander un devis ?', 'Autre question'],
    links: [
      { label: 'Unsafe', href: 'javascript:alert(1)' },
      { label: 'External', href: '//unrelated.test' },
      { label: 'Unknown', href: '/unknown' },
      { label: 'ENTRA', href: '/produits#fenetre-01' }
    ]
  }), refs);
  assert.deepEqual(data.questions, ['Quel vitrage choisir ?', 'Comment demander un devis ?']);
  assert.deepEqual(data.links, [{ label: 'ENTRA', href: '/produits#fenetre-01' }]);
  assert.deepEqual(parseReply(JSON.stringify({ answer: 'Merci.', questions: [], links: [] }), refs).links, []);
  assert.throws(() => parseReply('not JSON', refs));
});

test('catalogue, FAQ and project references are current and do not include forms or configuration', () => {
  assert.equal(knowledge.length, 90);
  const window = knowledge.find(record => record.href === '/produits#fenetre-01');
  assert.match(window.content, /ENTRA/);
  assert.match(window.content, /70 mm/);
  const refs = getRelevantReferences([], 'Je voudrais la fenêtre ENTRA');
  assert.ok(refs.some(record => record.href === window.href));
  const prompt = buildInstructions(refs);
  assert.match(prompt, /Les prix du catalogue sont indicatifs et hors pose/);
  assert.ok(!JSON.stringify(knowledge).includes('RESEND_API_KEY'));
  assert.ok(!JSON.stringify(knowledge).includes('access_key'));
  assert.ok(!JSON.stringify(knowledge).includes('OPENAI_API_KEY'));
});
