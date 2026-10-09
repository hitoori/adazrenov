import { renderContactEmail } from './email-template.js';

const EMAIL = /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function field(body, key, max, required = true, multiline = false) {
  const value = body[key] ?? '';
  if (typeof value !== 'string' || value.length > max || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value)
    || (!multiline && /[\r\n]/.test(value)) || (required && !value.trim())) throw new Error('invalid');
  return value.trim();
}

function makeEmail(body) {
  const email = field(body, 'email', 254);
  if (!EMAIL.test(email)) throw new Error('invalid');
  const phone = field(body, 'phone', 40);
  if (!/^[+\d().\s-]{6,40}$/.test(phone) || phone.replace(/\D/g, '').length < 6) throw new Error('invalid');
  const name = field(body, 'name', 200);
  const service = field(body, 'subject', 200);
  const message = field(body, 'message', 10000, true, true);
  const title = 'Nouvelle demande de devis';
  return {
    subject: `ADAZ RENOV — ${title} : ${name}`,
    reply_to: email,
    text: `${title}\n\nÀ traiter : appeler le client pour préciser sa demande.\n\nNom : ${name}\nTéléphone : ${phone}\nE-mail : ${email}\nTravaux : ${service}\n\nDemande du client :\n${message}`,
    html: renderContactEmail({ title, name, email, phone, service, message }),
  };
}

// Mail bodies go directly to Resend. Only anti-abuse counters are stored in D1.
export async function handleContactEmail(request, env, headers, { json, getClientKey, allowRequest }) {
  try {
    if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) return json({ error: 'Format non pris en charge.' }, 415, headers);
    const raw = await request.text();
    if (raw.length > 24000) return json({ error: 'Demande trop longue.' }, 413, headers);
    let body;
    try { body = JSON.parse(raw); } catch { return json({ error: 'Demande invalide.' }, 400, headers); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ error: 'Demande invalide.' }, 400, headers);
    if (body.website) return json({ ok: true }, 200, headers);
    let email;
    try { email = makeEmail(body); }
    catch { return json({ error: 'Vérifiez les informations du formulaire.' }, 400, headers); }
    if (!UUID.test(body.requestId || '')) return json({ error: 'Demande invalide.' }, 400, headers);
    if (!env.RESEND_API_KEY || !env.DB || !env.RESEND_FROM || !EMAIL.test(env.CONTACT_TO || '')) return json({ error: 'L’envoi est momentanément indisponible.' }, 503, headers);
    const clientKey = await getClientKey(request);
    const burst = await allowRequest(env.DB, `mail-burst:${clientKey}`, 3, 10 * 60000);
    const daily = await allowRequest(env.DB, `mail-client:${clientKey}`, 10, 24 * 3600000);
    if (!burst.allowed || !daily.allowed) {
      const retryAfter = !burst.allowed ? burst.retryAfter : daily.retryAfter;
      return json({ error: 'Plusieurs demandes ont déjà été envoyées. Réessayez plus tard ou appelez-nous.' }, 429, { ...headers, 'Retry-After': String(retryAfter) });
    }
    const global = await allowRequest(env.DB, 'mail-global', 50, 24 * 3600000);
    if (!global.allowed) return json({ error: 'L’envoi est momentanément indisponible. Contactez-nous par téléphone.' }, 429, { ...headers, 'Retry-After': String(global.retryAfter) });
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `adaz-form-${body.requestId}` },
      body: JSON.stringify({ from: env.RESEND_FROM, to: [env.CONTACT_TO], ...email }),
      signal: AbortSignal.timeout(15000)
    });
    const result = await response.json().catch(() => null);
    // Never return or log provider errors, credentials or the customer's content.
    if (!response.ok || !result?.id) return json({ error: 'Votre demande n’a pas pu être transmise. Réessayez ou contactez-nous directement.' }, 503, headers);
    return json({ ok: true }, 200, headers);
  } catch {
    return json({ error: 'L’envoi est momentanément indisponible.' }, 503, headers);
  }
}
