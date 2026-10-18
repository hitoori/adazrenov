// Validate the actual deployment artifact; no network requests or external services.
const fs = require('node:fs');
const path = require('node:path');
const { DOMAIN } = require('./site-policy.cjs');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const errors = [];
const warnings = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const decode = text => text.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'gi'))].map(match => match[0]);
function attr(tag, name) {
  const value = tag.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return value ? decode(value[2]) : undefined;
}
function meta(html, name) {
  return attr(tags(html, 'meta').find(tag => (attr(tag, 'name') || attr(tag, 'property')) === name) || '', 'content');
}
const isVerification = name => /^google[a-f0-9]+\.html$/.test(name);
const pageNames = fs.readdirSync(root).filter(name => name.endsWith('.html') && name !== '404.html' && !isVerification(name));
const pages = new Map();
const titles = new Set();
const descriptions = new Set();
const indexable = new Set();
let imageCount = 0;
let internalLinkCount = 0;

for (const name of [...pageNames, '404.html']) {
  const file = path.join(dist, name);
  if (!fs.existsSync(file)) { errors.push(`Missing page: ${name}`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  check(ids.length === new Set(ids).size, `${name}: duplicate element IDs`);
  pages.set(name, { html, ids: new Set(ids) });
  check(attr(tags(html, 'html')[0] || '', 'lang') === 'fr', `${name}: missing French language`);
  check(tags(html, 'h1').length === 1, `${name}: must have exactly one H1`);
  const robots = meta(html, 'robots') || '';
  if (name === '404.html') { check(/\bnoindex\b/i.test(robots), '404 page must be noindex'); continue; }

  const canonical = attr(tags(html, 'link').find(tag => attr(tag, 'rel') === 'canonical') || '', 'href');
  const expected = DOMAIN + (name === 'index.html' ? '/' : `/${name.replace(/\.html$/, '')}`);
  check(canonical === expected, `${name}: canonical must be ${expected}`);
  const title = decode(html.match(/<title>([^<]+)<\/title>/i)?.[1] || '').trim();
  const description = (meta(html, 'description') || '').trim();
  check(title && !titles.has(title), `${name}: title missing or duplicated`);
  check(description && !descriptions.has(description), `${name}: description missing or duplicated`);
  titles.add(title); descriptions.add(description);
  if (title.length > 65) warnings.push(`${name}: title exceeds 65 characters; review its search appearance`);
  if (description.length > 170) warnings.push(`${name}: long description; review its search appearance`);
  const blocked = /\b(?:noindex|none)\b/i.test(`${robots} ${meta(html, 'googlebot') || ''}`);
  if (!blocked) {
    indexable.add(expected);
    check(robots.includes('max-image-preview:large'), `${name}: large search-image previews missing`);
    for (const field of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt', 'og:image:width', 'og:image:height', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']) {
      check(Boolean(meta(html, field)), `${name}: missing ${field}`);
    }
    check(meta(html, 'og:url') === canonical, `${name}: Open Graph URL differs from canonical`);
    check(meta(html, 'og:title') === title, `${name}: Open Graph title differs from title`);
    check(meta(html, 'twitter:description') === description, `${name}: social description differs from page description`);
  }
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  check(schemas.length > 0, `${name}: missing structured data`);
  for (const [, json] of schemas) {
    try { JSON.parse(json); } catch { errors.push(`${name}: malformed JSON-LD`); }
  }
  check(tags(html, 'link').some(tag => attr(tag, 'rel') === 'icon' && attr(tag, 'href') === '/favicon.png'), `${name}: missing crawlable favicon`);
  check(html.includes('class="site-header"') && html.includes('aria-label="Navigation principale"'), `${name}: missing prerendered navigation`);

  for (const tag of tags(html, 'img')) {
    imageCount++;
    check(attr(tag, 'alt') !== undefined, `${name}: image without alt attribute`);
    check(Number(attr(tag, 'width')) > 0 && Number(attr(tag, 'height')) > 0, `${name}: image without intrinsic dimensions`);
  }
}

// Check links against the generated pages, including fragments and all referenced local assets.
for (const [name, { html }] of pages) {
  for (const tag of tags(html, '(?:a|link|script|img|source|video)')) {
    const value = attr(tag, 'href') || attr(tag, 'src') || attr(tag, 'poster');
    if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) continue;
    const url = new URL(value, `${DOMAIN}/${name === 'index.html' ? '' : name.replace(/\.html$/, '')}`);
    let relative = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html';
    if (!path.extname(relative)) relative += '.html';
    const file = path.resolve(dist, relative);
    check(file.startsWith(dist + path.sep) && fs.existsSync(file), `${name}: broken local reference ${value}`);
    if (/^<a\b/i.test(tag)) {
      internalLinkCount++;
      if (url.hash && pages.has(relative)) check(pages.get(relative).ids.has(decodeURIComponent(url.hash.slice(1))), `${name}: broken anchor ${value}`);
    }
  }
}

const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
check(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'), 'Sitemap namespace missing');
check(locations.length === new Set(locations).size, 'Duplicate sitemap URLs');
check(locations.length === indexable.size && locations.every(url => indexable.has(url)), 'Sitemap must include exactly the indexable canonical pages');
const sourceLocations = [...fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
check(JSON.stringify([...sourceLocations].sort()) === JSON.stringify([...locations].sort()), 'Source sitemap differs from deployment; update sitemap.xml');
const robots = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
check(/^Sitemap: https:\/\/adazrenov\.fr\/sitemap\.xml$/m.test(robots), 'robots.txt points at the wrong sitemap');
check(!/^Disallow:\s*\/\s*$/m.test(robots), 'robots.txt blocks the site');

const security = fs.readFileSync(path.join(dist, '.well-known/security.txt'), 'utf8');
check(/^Contact: mailto:adazrenov@gmail\.com$/m.test(security), 'security.txt contact missing');
check(/^Canonical: https:\/\/adazrenov\.fr\/\.well-known\/security\.txt$/m.test(security), 'security.txt canonical missing');
check(/^Preferred-Languages: fr$/m.test(security), 'security.txt language missing');
const expiry = Date.parse(security.match(/^Expires:\s*(\S+)$/m)?.[1] || '');
const daysLeft = (expiry - Date.now()) / 86400000;
check(Number.isFinite(expiry) && daysLeft > 0 && daysLeft <= 366, 'security.txt must expire in the next year');
if (daysLeft <= 30) warnings.push('security.txt expires within 30 days; verify the contact and renew it');
const redirects = fs.readFileSync(path.join(dist, '_redirects'), 'utf8');
check(/^\/security\.txt\s+\/\.well-known\/security\.txt\s+301$/m.test(redirects), 'Missing legacy security.txt redirect');

const headers = fs.readFileSync(path.join(dist, '_headers'), 'utf8');
for (const name of ['Content-Security-Policy', 'X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy']) check(headers.includes(`  ${name}: `), `Missing ${name}`);
check(headers.split('\n').every(line => line.length <= 2000), 'Cloudflare header line exceeds 2000 characters');
check(headers.includes("frame-src https://challenges.cloudflare.com https://www.google.com"), 'CSP must allow Turnstile and Maps frames');
check(headers.includes("frame-ancestors 'none'"), 'CSP framing protection missing');
check(!/script-src[^;\n]*'unsafe-(?:inline|eval)'/.test(headers), 'CSP permits unsafe scripts');
check((headers.match(/X-Robots-Tag: noindex/g) || []).length === 2, 'Preview domains must remain noindex');
for (const name of ['.env', '.dev.vars', '.git', 'node_modules', 'firebase', 'cloudflare', 'scripts', 'README.md', 'ai-context.txt']) check(!fs.existsSync(path.join(dist, name)), `Private source published: ${name}`);
for (const name of fs.readdirSync(root).filter(isVerification)) check(fs.readFileSync(path.join(root, name), 'utf8') === fs.readFileSync(path.join(dist, name), 'utf8'), `${name}: Google ownership file changed`);

warnings.forEach(message => console.warn(`Warning: ${message}`));
if (errors.length) {
  errors.forEach(message => console.error(`FAIL: ${message}`));
  process.exitCode = 1;
} else {
  console.log(`Site checks passed: ${pageNames.length} pages, ${locations.length} sitemap URLs, ${imageCount} images, ${internalLinkCount} internal links. SEO metadata, structured data, security.txt, headers and deployment boundaries verified.`);
}
