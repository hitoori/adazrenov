import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

const origin = 'https://adazrenov.fr';
const contact = { name: 'Jean Dupont', phone: '+33 6 12 34 56 78', email: 'jean@example.fr', subject: 'Salle de bain', message: 'Travaux à Paris, 8 m².', requestId: '11111111-1111-4111-8111-111111111111' };
function env(initialCount = 0) {
  const counts = new Map();
  return { ALLOWED_ORIGINS: origin, RESEND_API_KEY: 'test-only-resend', RESEND_FROM: 'ADAZ RENOV <contact@adazrenov.fr>', CONTACT_TO: 'owner@example.fr',
    DB: { prepare() { return { bind(key, reset) { return { async first() {
      const count = (counts.get(key) ?? initialCount) + 1; counts.set(key, count);
      return { request_count: count, reset_at: reset };
    } }; } }; } } };
}
function request(body = contact, path = '/contact', requestOrigin = origin, type = 'application/json') {
  return new Request(`https://worker.test${path}`, { method: 'POST', headers: { Origin: requestOrigin, 'Content-Type': type, 'CF-Connecting-IP': '192.0.2.5' }, body: typeof body === 'string' ? body : JSON.stringify(body) });
}
function sent() { return Response.json({ data: [{ id: 'staff-email-id' }, { id: 'confirmation-email-id' }] }); }

test('contact mail uses server recipient, verified sender and visitor reply address, without OpenAI', async t => {
  const api = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails/batch');
    assert.equal(options.headers.Authorization, 'Bearer test-only-resend');
    assert.equal(options.headers['Idempotency-Key'], `adaz-contact-v2-${contact.requestId}`);
    const [mail, confirmation] = JSON.parse(options.body);
    assert.deepEqual(mail.to, ['owner@example.fr']);
    assert.equal(mail.from, 'ADAZ RENOV <contact@adazrenov.fr>');
    assert.equal(mail.reply_to, contact.email);
    assert.match(mail.text, /Travaux à Paris/);
    assert.match(mail.subject, /Jean Dupont/);
    assert.match(mail.html, /Appeler le client/);
    assert.match(mail.html, /href="tel:\+33612345678"/);
    assert.match(mail.html, /Travaux à Paris/);
    assert.equal(mail.cc, undefined);
    assert.equal(mail.bcc, undefined);
    assert.deepEqual(confirmation.to, [contact.email]);
    assert.equal(confirmation.from, mail.from);
    assert.equal(confirmation.reply_to, 'adazrenov@gmail.com');
    assert.match(confirmation.subject, /Nous avons reçu votre demande/);
    assert.match(confirmation.html, /Bonjour Jean Dupont/);
    assert.match(confirmation.html, /24 heures/);
    assert.match(confirmation.html, /Travaux à Paris/);
    assert.ok(!confirmation.html.includes('owner@example.fr'));
    assert.ok(!JSON.stringify(confirmation).includes('attacker@example.fr'));
    assert.equal(confirmation.cc, undefined);
    assert.equal(confirmation.bcc, undefined);
    return sent();
  });
  const response = await worker.fetch(request({ ...contact, to: 'attacker@example.fr', from: 'spoof@example.fr', html: '<script>' }), env());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(api.mock.calls.length, 1);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('Assistant booking endpoint is disabled and cannot send emails', async t => {
  const api = t.mock.method(globalThis, 'fetch', () => { throw new Error('Must not send'); });
  const booking = { firstname: 'Jean', lastname: 'Dupont', phone: contact.phone, email: contact.email, service: 'Rénovation', notes: 'Projet de rénovation.', contactPreference: 'callback', requestId: contact.requestId };
  assert.equal((await worker.fetch(request(booking, '/booking'), env())).status, 404);
  assert.equal((await worker.fetch(request(contact, '/booking'), env())).status, 404);
  assert.equal((await worker.fetch(request(booking, '/contact'), env())).status, 400);
  assert.equal(api.mock.calls.length, 0);
});

test('visitor content is escaped in both emails and line breaks remain readable', async t => {
  let mails;
  t.mock.method(globalThis, 'fetch', async (_, options) => { mails = JSON.parse(options.body); return sent(); });
  const name = 'Jean <img src=x onerror=alert(1)>';
  const message = '<script>alert(1)</script>\r\nSalle de bain & cuisine\rDeuxième pièce';
  const response = await worker.fetch(request({ ...contact, name, message }), env());
  assert.equal(response.status, 200);
  assert.equal(mails.length, 2);
  for (const mail of mails) {
    assert.ok(!mail.html.includes('<script>'));
    assert.ok(!mail.html.includes('<img src=x'));
    assert.ok(mail.html.includes('&lt;img src=x onerror=alert(1)&gt;'));
    assert.ok(mail.html.includes('&lt;script&gt;alert(1)&lt;/script&gt;<br>Salle de bain &amp; cuisine'));
    assert.ok(mail.html.includes('Salle de bain &amp; cuisine<br>Deuxième pièce'));
    assert.ok(mail.text.includes(message));
  }
  assert.deepEqual(mails[0].to, ['owner@example.fr']);
  assert.deepEqual(mails[1].to, [contact.email]);
});

test('bad origin, payload, header injection, oversize and honeypot cannot send emails', async t => {
  const api = t.mock.method(globalThis, 'fetch', () => { throw new Error('Must not send'); });
  assert.equal((await worker.fetch(request(contact, '/contact', 'https://attacker.test'), env())).status, 403);
  assert.equal((await worker.fetch(request(contact, '/contact', origin, 'text/plain'), env())).status, 415);
  for (const body of ['{', null, [], { ...contact, name: '' }, { ...contact, phone: 'not-a-number' }, { ...contact, email: 'a@b.fr\r\nBcc:other@b.fr' }, { ...contact, subject: 'Travaux\nBcc:other@b.fr' }, { ...contact, requestId: 'invalid' }]) {
    assert.equal((await worker.fetch(request(body), env())).status, 400);
  }
  assert.equal((await worker.fetch(request('a'.repeat(24001)), env())).status, 413);
  assert.deepEqual(await (await worker.fetch(request({ ...contact, website: 'spam.test' }), env())).json(), { ok: true });
  assert.equal(api.mock.calls.length, 0);
});

test('missing key and provider failure never report success or reveal diagnostics', async t => {
  const api = t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'private vendor diagnostic test-only-resend' }, { status: 403 }));
  const missing = { ...env(), RESEND_API_KEY: '' };
  assert.equal((await worker.fetch(request(), missing)).status, 503);
  assert.equal(api.mock.calls.length, 0);
  const response = await worker.fetch(request(), env());
  assert.equal(response.status, 503);
  assert.ok(!(await response.text()).includes('private vendor'));
  assert.equal(api.mock.calls.length, 1);
});

test('mail quotas are separate from chat quotas and block repeated sends', async t => {
  const api = t.mock.method(globalThis, 'fetch', async () => sent());
  const settings = env();
  for (let i = 0; i < 3; i++) assert.equal((await worker.fetch(request(), settings)).status, 200);
  const blocked = await worker.fetch(request(), settings);
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.headers.get('Retry-After')) > 0);
  assert.equal(api.mock.calls.length, 3);
});

test('Turnstile permits email only after successful validation for the Contact action on our domain', async t => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push(url);
    if (url.includes('/siteverify')) {
      assert.deepEqual(JSON.parse(options.body), { secret: 'test-only-turnstile', response: 'valid-test-token' });
      return Response.json({ success: true, hostname: 'adazrenov.fr', action: 'contact' });
    }
    assert.equal(url, 'https://api.resend.com/emails/batch');
    return sent();
  });
  const response = await worker.fetch(request({ ...contact, turnstileToken: 'valid-test-token' }), {
    ...env(), TURNSTILE_REQUIRED: 'true', TURNSTILE_SECRET_KEY: 'test-only-turnstile',
  });
  assert.equal(response.status, 200);
  assert.equal(calls.length, 2);
  assert.match(calls[0], /siteverify$/);
});

test('missing protection secret or malformed tokens cannot send an email', async t => {
  const api = t.mock.method(globalThis, 'fetch', () => { throw new Error('Must not send'); });
  assert.equal((await worker.fetch(request(), { ...env(), TURNSTILE_REQUIRED: 'true' })).status, 503);
  for (const turnstileToken of [undefined, '', 42, 'x'.repeat(2049)]) {
    assert.equal((await worker.fetch(request({ ...contact, turnstileToken }), {
      ...env(), TURNSTILE_REQUIRED: 'true', TURNSTILE_SECRET_KEY: 'test-only-turnstile',
    })).status, 400);
  }
  assert.equal(api.mock.calls.length, 0);
});

test('rejected, replayed, foreign hostname and wrong-action tokens cannot reach Resend', async t => {
  let result;
  const api = t.mock.method(globalThis, 'fetch', async url => {
    assert.match(url, /siteverify$/);
    return Response.json(result);
  });
  for (const invalid of [
    { success: false, 'error-codes': ['invalid-input-response'] },
    { success: false, 'error-codes': ['timeout-or-duplicate'] },
    { success: true, hostname: 'attacker.example', action: 'contact' },
    { success: true, hostname: 'adazrenov.fr', action: 'login' },
    { success: true },
  ]) {
    result = invalid;
    const response = await worker.fetch(request({ ...contact, turnstileToken: 'test-token' }), {
      ...env(), TURNSTILE_SECRET_KEY: 'test-only-turnstile',
    });
    assert.equal(response.status, 400);
  }
  assert.equal(api.mock.calls.length, 5);
});

test('Turnstile network and service errors fail closed without exposing credentials', async t => {
  let providerResponse;
  const api = t.mock.method(globalThis, 'fetch', async url => {
    assert.match(url, /siteverify$/);
    if (providerResponse instanceof Error) throw providerResponse;
    return providerResponse;
  });
  for (const unavailable of [new Error('test-only-turnstile'), Response.json({}, { status: 500 }),
    Response.json({ success: false, 'error-codes': ['invalid-input-secret'] }), new Response('invalid JSON')]) {
    providerResponse = unavailable;
    const response = await worker.fetch(request({ ...contact, turnstileToken: 'test-token' }), {
      ...env(), TURNSTILE_SECRET_KEY: 'test-only-turnstile',
    });
    assert.equal(response.status, 503);
    assert.ok(!(await response.text()).includes('test-only-turnstile'));
  }
  assert.equal(api.mock.calls.length, 4);
});

test('staff recipients come only from server configuration, with duplicates removed', async t => {
  let mails;
  t.mock.method(globalThis, 'fetch', async (_, options) => { mails = JSON.parse(options.body); return sent(); });
  const settings = { ...env(), CONTACT_TO: 'owner@example.fr, company@example.fr, OWNER@example.fr' };
  const response = await worker.fetch(request({ ...contact, CONTACT_TO: 'attacker@example.fr', cc: 'attacker@example.fr', bcc: 'attacker@example.fr' }), settings);
  assert.equal(response.status, 200);
  assert.deepEqual(mails[0].to, ['OWNER@example.fr', 'company@example.fr']);
  assert.deepEqual(mails[1].to, [contact.email]);
  assert.equal(mails[1].reply_to, 'adazrenov@gmail.com');
  assert.ok(!JSON.stringify(mails).includes('attacker@example.fr'));
  assert.ok(!JSON.stringify(mails[1]).includes('company@example.fr'));
});

test('invalid staff address lists fail before contacting any provider', async t => {
  const api = t.mock.method(globalThis, 'fetch', () => { throw new Error('Must not send'); });
  for (const CONTACT_TO of ['', undefined, ['owner@example.fr'], 'owner@example.fr,', 'owner@example.fr,invalid', 'owner@example.fr\r\nBcc:other@example.fr']) {
    assert.equal((await worker.fetch(request(), { ...env(), CONTACT_TO })).status, 503);
  }
  assert.equal(api.mock.calls.length, 0);
});

test('a batch succeeds only when both emails have provider identifiers', async t => {
  let result;
  t.mock.method(globalThis, 'fetch', async () => Response.json(result));
  for (const incomplete of [null, {}, { id: 'single-id' }, { data: [] }, { data: [{ id: 'staff-id' }] }, { data: [{ id: 'staff-id' }, {}] }, { data: [{ id: 'staff-id' }, { id: '' }] }]) {
    result = incomplete;
    const response = await worker.fetch(request(), env());
    assert.equal(response.status, 503);
    assert.equal((await response.json()).ok, undefined);
  }
});

test('retries preserve the batch key and payload for both emails', async t => {
  let fail = true;
  const api = t.mock.method(globalThis, 'fetch', async () => fail ? Response.json({}, { status: 503 }) : sent());
  const settings = env();
  assert.equal((await worker.fetch(request(), settings)).status, 503);
  fail = false;
  assert.equal((await worker.fetch(request(), settings)).status, 200);
  const [first, second] = api.mock.calls.map(call => call.arguments[1]);
  assert.equal(first.headers['Idempotency-Key'], second.headers['Idempotency-Key']);
  assert.equal(first.body, second.body);
  assert.equal(JSON.parse(first.body).length, 2);
});

test('templates retain the approved content order and absolute PNG image URLs', async t => {
  let mails;
  t.mock.method(globalThis, 'fetch', async (_, options) => { mails = JSON.parse(options.body); return sent(); });
  assert.equal((await worker.fetch(request(), env())).status, 200);
  const [staff, client] = mails;
  assert.ok(client.html.indexOf('Bonjour Jean Dupont') < client.html.indexOf('Votre demande'));
  assert.ok(client.html.indexOf('Travaux à Paris') < client.html.indexOf('Vous préférez nous appeler'));
  assert.ok(client.html.indexOf('Vous préférez nous appeler') < client.html.indexOf('Instagram ADAZ RENOV'));
  assert.ok(staff.html.indexOf('Travaux à Paris') < staff.html.indexOf('Appeler le client'));
  for (const mail of mails) {
    const imageSources = [...mail.html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(match => match[1]);
    assert.equal(imageSources.length, 4);
    assert.ok(imageSources.every(source => /^https:\/\/adazrenov\.fr\/assets\/email\/v1\/[a-z]+\.png$/.test(source)));
    assert.match(mail.html, /instagram\.com\/adaz_renov/);
    assert.match(mail.html, /tiktok\.com\/@adaz_renov/);
    assert.match(mail.html, /facebook\.com\/profile\.php\?id=61562185566929/);
  }
});
