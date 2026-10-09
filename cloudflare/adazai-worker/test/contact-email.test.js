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
function sent() { return Response.json({ id: 'provider-email-id' }); }

test('contact mail uses server recipient, verified sender and visitor reply address, without OpenAI', async t => {
  const api = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(options.headers.Authorization, 'Bearer test-only-resend');
    assert.equal(options.headers['Idempotency-Key'], `adaz-form-${contact.requestId}`);
    const mail = JSON.parse(options.body);
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

test('visitor content is escaped in the HTML email and line breaks remain readable', async t => {
  let mail;
  t.mock.method(globalThis, 'fetch', async (_, options) => { mail = JSON.parse(options.body); return sent(); });
  const name = 'Jean <img src=x onerror=alert(1)>';
  const message = '<script>alert(1)</script>\nSalle de bain & cuisine';
  const response = await worker.fetch(request({ ...contact, name, message }), env());
  assert.equal(response.status, 200);
  assert.ok(!mail.html.includes('<script>'));
  assert.ok(!mail.html.includes('<img src=x'));
  assert.match(mail.html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(mail.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;<br>Salle de bain &amp; cuisine/);
  assert.ok(mail.text.includes(message));
  assert.deepEqual(mail.to, ['owner@example.fr']);
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
