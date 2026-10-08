const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { transform } = require('esbuild');
const { createRuntime, prerender, structuredData, compileWidget, compilePage } = require('./site-build-runtime.cjs');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'dist');
const DOMAIN = 'https://adazrenov.fr';
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const STATIC_FILES = ['ai-config.js', 'robots.txt', '404.html'];
const LOCAL_FONT = 'assets/fonts/manrope-latin.e310b55a7fd9.woff2';

function publicRoute(name) {
  return name === 'index' ? '/' : '/' + name;
}

function normalizeLinks(source) {
  return source.replace(/(["'])(index|services|produits|projets|a-propos|ia-travaux|contact|politique-confidentialite)\.html\1/g,
    (_, quote, name) => `${quote}${publicRoute(name)}${quote}`);
}

function fingerprint(content) {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
}

function canonicalUrl(page) {
  return DOMAIN + (page === 'index.html' ? '/' : '/' + page.replace(/\.html$/, ''));
}

function replaceMedia(source, media) {
  // Only replace complete filenames, so prefixes cannot change another asset.
  for (const [original, record] of Object.entries(media)) {
    source = source.split(original).join(record.path);
  }
  return source;
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

function setAttribute(tag, name, value) {
  const pattern = new RegExp(`\\s${name}="[^"]*"`);
  return pattern.test(tag)
    ? tag.replace(pattern, ` ${name}="${value}"`)
    : tag.replace(/\s*>$/, ` ${name}="${value}">`);
}

function optimizeHtml(html, page, metadata, icons, cssFile, jsFile) {
  html = normalizeLinks(html);
  html = html.replace(/href="styles\.css(?:\?[^"]*)?"/, `href="${cssFile}"`)
    .replace(/src="script\.js(?:\?[^"]*)?"/, `src="${jsFile}"`);
  html = html.replace(/<link\b[^>]*rel="(?:icon|apple-touch-icon)"[^>]*>/g, tag =>
    setAttribute(tag, 'href', icons[tag.includes('apple-touch-icon') ? 'apple-touch-icon.png' : 'favicon.png']));
  html = html.replace(/<link\b[^>]*href="https:\/\/fonts\.(?:googleapis|gstatic)\.com[^\"]*"[^>]*>\s*/g, '');
  html = html.replace('</head>', `<link rel="preload" href="${LOCAL_FONT}" as="font" type="font/woff2" crossorigin>\n</head>`);

  const canonical = canonicalUrl(page);
  if (!html.includes('rel="canonical"')) {
    html = html.replace('</title>', `</title>\n    <link rel="canonical" href="${canonical}">\n    <meta property="og:url" content="${canonical}">`);
  }
  html = html.replace(/<meta\b[^>]*property="og:image"[^>]*>/g, tag => {
    const value = attribute(tag, 'content');
    return setAttribute(tag, 'content', value?.startsWith('assets/') ? `${DOMAIN}/${value.split('?')[0]}` : value);
  });

  html = html.replace(/<img\b[^>]*>/g, tag => {
    const src = attribute(tag, 'src');
    if (!src) return tag;
    const local = metadata.get(src.split('?')[0]);
    tag = setAttribute(tag, 'decoding', 'async');
    if (local) {
      tag = setAttribute(tag, 'width', local.width);
      tag = setAttribute(tag, 'height', local.height);
      if (local.variants?.length) {
        const candidates = [...local.variants, { path: local.path, width: local.width }]
          .map(item => `${item.path} ${item.width}w`).join(', ');
        const sizes = attribute(tag, 'fetchpriority') === 'high' ? '100vw' : /hero|office/.test(src)
          ? '(max-width: 640px) 100vw, (max-width: 1120px) 90vw, 1180px'
          : /team/.test(src)
            ? '(max-width: 640px) 100vw, (max-width: 920px) 50vw, 400px'
            : '(max-width: 640px) 100vw, (max-width: 920px) 50vw, 600px';
        tag = setAttribute(tag, 'srcset', candidates);
        tag = setAttribute(tag, 'sizes', sizes);
      }
    } else if (src.startsWith('https://images.unsplash.com/')) {
      const url = new URL(src.replaceAll('&amp;', '&'));
      url.searchParams.set('fm', 'webp');
      url.searchParams.set('q', '75');
      tag = setAttribute(tag, 'src', url.toString().replaceAll('&', '&amp;'));
      const maxWidth = Number(url.searchParams.get('w') || 1600);
      const candidates = [640, 960, maxWidth].filter((width, index, all) => all.indexOf(width) === index)
        .map(width => { const candidate = new URL(url); candidate.searchParams.set('w', width); return `${candidate.toString().replaceAll('&', '&amp;')} ${width}w`; });
      tag = setAttribute(tag, 'srcset', candidates.join(', '));
      tag = setAttribute(tag, 'sizes', attribute(tag, 'fetchpriority') === 'high' ? '100vw' : '(max-width: 640px) 100vw, 600px');
    }
    return tag;
  });
  if (html.includes('images.unsplash.com')) {
    html = html.replace('</head>', '    <link rel="preconnect" href="https://images.unsplash.com">\n  </head>');
  }
  // The regular navigation and content are already rendered; expose mobile links without JS.
  const fallback = '<noscript><style>.reveal{opacity:1;transform:none}.nav-toggle,[data-adazai-launcher]{display:none}@media(max-width:920px){.mobile-nav{display:block}}</style></noscript>';
  html = html.replace(/(<body\b[^>]*>)/, `$1\n${fallback}`);
  return html;
}

async function listFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  }));
  return nested.flat();
}

async function build() {
  const manifest = JSON.parse(await fs.readFile(path.join(__dirname, 'media-manifest.json'), 'utf8'));
  const metadata = new Map(Object.values(manifest.media).filter(record => record.width).map(record => [record.path, record]));
  metadata.set(manifest.icons['header-logo.webp'], { width: 144, height: 162 });
  const entries = await fs.readdir(ROOT);
  const pages = entries.filter(name => name.endsWith('.html') && name !== '404.html').sort();
  const replacements = Object.fromEntries(Object.entries(manifest.media).map(([original, record]) => [original, record.path]));
  const sourceJs = normalizeLinks(replaceMedia(await fs.readFile(path.join(ROOT, 'script.js'), 'utf8'), manifest.media)
    .replace(/const headerLogoPath = "[^"]+";/, `const headerLogoPath = "${manifest.icons['header-logo.webp']}";`));
  const sourceCss = replaceMedia(await fs.readFile(path.join(ROOT, 'styles.css'), 'utf8'), manifest.media);
  const runtime = createRuntime(sourceJs, replacements);
  const loader = await fs.readFile(path.join(__dirname, 'browser-runtime.js'), 'utf8');
  const [widget, css] = await Promise.all([
    compileWidget(runtime),
    transform(sourceCss, { loader: 'css', minify: true, target: 'es2020', legalComments: 'none' }),
  ]);
  const widgetFile = `assets/runtime/assistant.${fingerprint(widget.code)}.js`;
  const cssFile = `styles.${fingerprint(css.code)}.css`;

  // Never publish the repository root: it also contains backend code and local configuration.
  await fs.rm(OUTPUT, { recursive: true, force: true });
  await fs.mkdir(OUTPUT, { recursive: true });
  await fs.mkdir(path.join(OUTPUT, 'assets/runtime'), { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(OUTPUT, widgetFile), widget.code),
    fs.writeFile(path.join(OUTPUT, cssFile), css.code),
    ...STATIC_FILES.map(name => fs.copyFile(path.join(ROOT, name), path.join(OUTPUT, name))),
  ]);
  const emittedSources = [sourceJs, sourceCss];
  const pageBytes = {};
  for (const page of pages) {
    const source = replaceMedia(await fs.readFile(path.join(ROOT, page), 'utf8'), manifest.media);
    const js = await compilePage(runtime, loader, page, widgetFile, replacements);
    const jsFile = `assets/runtime/page.${fingerprint(js.code)}.js`;
    await fs.writeFile(path.join(OUTPUT, jsFile), js.code);
    pageBytes[page] = Buffer.byteLength(js.code);
    let html = optimizeHtml(prerender(source, runtime), page, metadata, manifest.icons, cssFile, jsFile);
    html = structuredData(html, page, canonicalUrl(page), DOMAIN, runtime);
    emittedSources.push(html);
    await fs.writeFile(path.join(OUTPUT, page), html);
  }

  const assets = new Set([...Object.values(manifest.icons), 'assets/fonts/OFL-Manrope.txt']);
  for (const record of Object.values(manifest.media)) {
    assets.add(record.path);
    for (const variant of record.variants || []) assets.add(variant.path);
  }
  for (const source of emittedSources) {
    for (const match of source.matchAll(/assets\/[\w./-]+\.(?:png|jpe?g|webp|mp4|woff2)/g)) assets.add(match[0]);
  }
  for (const relative of assets) {
    const source = path.resolve(ROOT, relative);
    if (!source.startsWith(path.join(ROOT, 'assets') + path.sep)) throw new Error(`Invalid asset path: ${relative}`);
    const stat = await fs.stat(source);
    if (stat.size >= MAX_FILE_BYTES) throw new Error(`Cloudflare Pages asset exceeds 25 MiB: ${relative}`);
    const destination = path.join(OUTPUT, relative);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(source, destination);
  }

  const headers = [
    '/*', '  X-Content-Type-Options: nosniff', '  Referrer-Policy: strict-origin-when-cross-origin', '',
    '/assets/optimized/*', '  Cache-Control: public, max-age=31536000, immutable', '',
    '/assets/runtime/*', '  Cache-Control: public, max-age=31536000, immutable', '',
    '/assets/fonts/*', '  Cache-Control: public, max-age=31536000, immutable', '',
    '/styles.*.css', '  Cache-Control: public, max-age=31536000, immutable', '',
    '/ai-config.js', '  Cache-Control: no-cache', '',
    'https://:project.pages.dev/*', '  X-Robots-Tag: noindex', '',
    'https://:version.:project.pages.dev/*', '  X-Robots-Tag: noindex', '',
  ].join('\n');
  await fs.writeFile(path.join(OUTPUT, '_headers'), headers);
  await fs.writeFile(path.join(OUTPUT, '_redirects'), `https://www.adazrenov.fr/* ${DOMAIN}/:splat 301\n`);
  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    pages.map(page => `  <url><loc>${canonicalUrl(page)}</loc></url>`).join('\n') + '\n</urlset>\n';
  await fs.writeFile(path.join(OUTPUT, 'sitemap.xml'), sitemap);

  const files = await listFiles(OUTPUT);
  const stats = await Promise.all(files.map(file => fs.stat(file)));
  for (let index = 0; index < files.length; index++) {
    if (stats[index].size >= MAX_FILE_BYTES) throw new Error(`Oversized deployment file: ${files[index]}`);
  }
  if (files.length > 20000) throw new Error('Deployment exceeds the free Pages file count limit.');
  const totalBytes = stats.reduce((sum, stat) => sum + stat.size, 0);
  console.log(`Built ${pages.length} pages, ${files.length} files, ${(totalBytes / 1e6).toFixed(2)} MB in dist/.`);
  console.log(`Initial JavaScript by page (KB): ${Object.entries(pageBytes).map(([page, bytes]) => `${page.replace('.html', '')} ${(bytes / 1000).toFixed(1)}`).join('; ')}.`);
  console.log(`Assistant loaded on interaction: ${(Buffer.byteLength(widget.code) / 1000).toFixed(1)} KB; CSS: ${(Buffer.byteLength(css.code) / 1000).toFixed(1)} KB.`);
  console.log('All files are below the Cloudflare Pages 25 MiB limit.');
}

build().catch(error => { console.error(error.message); process.exitCode = 1; });
