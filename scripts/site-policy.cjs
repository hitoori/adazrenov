// Shared by the deployment build and the local preview so browser checks use the same policy.
const DOMAIN = 'https://adazrenov.fr';

function canonicalUrl(page) {
  return DOMAIN + (page === 'index.html' ? '/' : '/' + page.replace(/\.html$/, ''));
}

function allowsIndexing(source) {
  return ![...source.matchAll(/<meta\b[^>]*>/gi)].some(([tag]) => {
    if (!/\bname\s*=\s*["'](?:robots|googlebot)["']/i.test(tag)) return false;
    const content = tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1] || '';
    return /\b(?:noindex|none)\b/i.test(content);
  });
}

function createSitemap(pages) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    [...pages].sort().map(page => `  <url><loc>${canonicalUrl(page)}</loc></url>`).join('\n') + '\n</urlset>\n';
}

// Inline styles remain necessary for the existing layouts and image previews.
// Executable inline scripts and eval are deliberately not allowed.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' https://challenges.cloudflare.com https://www.googletagmanager.com https://static.cloudflareinsights.com https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://www.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self'",
  "media-src 'self' blob:",
  "connect-src 'self' https://adazai-api.adazrenov.workers.dev https://challenges.cloudflare.com https://www.googletagmanager.com https://*.google-analytics.com https://*.google.com https://cloudflareinsights.com https://firestore.googleapis.com",
  "frame-src https://challenges.cloudflare.com https://www.google.com",
].join('; ');

const securityHeaders = {
  'Content-Security-Policy': contentSecurityPolicy,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
};

function createHeaders() {
  return [
    '/*', ...Object.entries(securityHeaders).map(([name, value]) => `  ${name}: ${value}`), '',
    '/assets/optimized/*', '  Cache-Control: public, max-age=31536000, immutable', '',
    '/assets/runtime/*', '  Cache-Control: public, max-age=31536000, immutable', '',
    '/assets/fonts/*', '  Cache-Control: public, max-age=31536000, immutable', '',
    '/styles.*.css', '  Cache-Control: public, max-age=31536000, immutable', '',
    '/ai-config.js', '  Cache-Control: no-cache', '',
    '/.well-known/security.txt', '  Content-Type: text/plain; charset=utf-8', '  Cache-Control: public, max-age=3600', '',
    'https://:project.pages.dev/*', '  X-Robots-Tag: noindex', '',
    'https://:version.:project.pages.dev/*', '  X-Robots-Tag: noindex', '',
  ].join('\n');
}

module.exports = { DOMAIN, canonicalUrl, allowsIndexing, createSitemap, securityHeaders, createHeaders };
