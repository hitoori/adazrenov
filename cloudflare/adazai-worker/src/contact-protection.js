const HOSTNAMES = new Set(['adazrenov.fr', 'www.adazrenov.fr']);

// The secret stays in the Worker. Never log tokens or provider diagnostics.
export async function verifyContactToken(token, env) {
  if (!env.TURNSTILE_SECRET_KEY && env.TURNSTILE_REQUIRED !== 'true') return 200;
  if (!env.TURNSTILE_SECRET_KEY) return 503;
  if (typeof token !== 'string' || !token.trim() || token.length > 2048) return 400;
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return 503;
    const result = await response.json();
    if (result.success !== true) {
      return result['error-codes']?.some(code => ['internal-error', 'invalid-input-secret', 'missing-input-secret'].includes(code)) ? 503 : 400;
    }
    return HOSTNAMES.has(result.hostname) && result.action === 'contact' ? 200 : 400;
  } catch {
    return 503;
  }
}
