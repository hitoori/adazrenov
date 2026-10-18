const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { transform } = require('esbuild');
const { createRuntime, prerender, structuredData, compileWidget, compilePage } = require('./site-build-runtime.cjs');
const { DOMAIN, canonicalUrl, allowsIndexing, createSitemap, createHeaders } = require('./site-policy.cjs');

const { buildSearchIndex } = require('./site-search-index.cjs');
const { buildAssistantKnowledge } = require('./assistant-knowledge.cjs');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'dist');
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const STATIC_FILES = ['ai-config.js', 'robots.txt', '_redirects', '404.html', 'favicon.ico', 'favicon.png'];
const LOCAL_FONT = 'assets/fonts/manrope-latin.e310b55a7fd9.woff2';

function publicRoute(name) {
  return name === 'index' ? '/' : '/' + name;
}

function normalizeLinks(source) {
  return source.replace(/(["'])(index|services|produits|projets|a-propos|ia-travaux|contact|politique-confidentialite|mentions-legales)\.html(#[^"']*)?\1/g,
    (_, quote, name, fragment = '') => `${quote}${publicRoute(name)}${fragment}${quote}`);
}

function fingerprint(content) {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
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
  // Keep stable, crawlable favicon URLs and declare the files' actual dimensions.
  html = html.replace(/<link\b[^>]*rel="(?:icon|shortcut icon|apple-touch-icon)"[^>]*>\s*/g, '');
  html = html.replace('</head>', [
    '<link rel="icon" type="image/png" sizes="180x180" href="/favicon.png">',
    '<link rel="icon" type="image/x-icon" sizes="16x16 32x32 48x48" href="/favicon.ico">',
    `<link rel="apple-touch-icon" sizes="180x180" href="/${icons['apple-touch-icon.png']}">`,
    '</head>',
  ].join('\n'));
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
  if (!html.includes('property="og:site_name"')) {
    html = html.replace('</head>', '<meta property="og:site_name" content="ADAZ RENOV">\n</head>');
  }
  if (html.includes('property="og:image"') && !html.includes('property="og:image:alt"')) {
    html = html.replace('</head>', '<meta property="og:image:alt" content="Logo ADAZ RENOV, rénovation et menuiserie">\n</head>');
  }
  const socialImage = attribute(html.match(/<meta\b[^>]*property="og:image"[^>]*>/)?.[0] || '', 'content');
  if (socialImage) {
    const imageInfo = metadata.get(socialImage.replace(`${DOMAIN}/`, ''));
    const socialTags = [
      ['name', 'twitter:card', 'summary'],
      ...['title', 'description', 'image', 'image:alt'].map(field => {
        const tag = html.match(new RegExp(`<meta\\b[^>]*property="og:${field}"[^>]*>`))?.[0];
        return ['name', `twitter:${field}`, attribute(tag || '', 'content')];
      }),
      ['property', 'og:image:width', imageInfo?.width],
      ['property', 'og:image:height', imageInfo?.height],
    ];
    for (const [type, name, value] of socialTags) {
      if (value && !html.includes(`${type}="${name}"`)) html = html.replace('</head>', `<meta ${type}="${name}" content="${value}">\n</head>`);
    }
  }
  if (allowsIndexing(html)) {
    html = html.replace(/<meta\b(?=[^>]*name="robots")([^>]*)>/i, tag => {
      const content = attribute(tag, 'content') || 'index, follow';
      return setAttribute(tag, 'content', /max-image-preview:/i.test(content) ? content : `${content}, max-image-preview:large`);
    });
  }

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
  const verificationFiles = entries.filter(name => /^google[a-f0-9]+\.html$/.test(name));
  const pages = entries.filter(name => name.endsWith('.html') && name !== '404.html' && !verificationFiles.includes(name)).sort();
  const replacements = Object.fromEntries(Object.entries(manifest.media).map(([original, record]) => [original, record.path]));
  const sourceJs = normalizeLinks(replaceMedia(await fs.readFile(path.join(ROOT, 'script.js'), 'utf8'), manifest.media)
    .replace(/const headerLogoPath = "[^"]+";/, `const headerLogoPath = "${manifest.icons['header-logo.webp']}";`));
  const sourceCss = replaceMedia(await fs.readFile(path.join(ROOT, 'styles.css'), 'utf8'), manifest.media);
  const publicConfig = await fs.readFile(path.join(ROOT, 'ai-config.js'), 'utf8');
  const configFile = `assets/runtime/config.${fingerprint(publicConfig)}.js`;
  const runtime = createRuntime(sourceJs, replacements);
  const pageSources = new Map(await Promise.all(pages.map(async page => [page, await fs.readFile(path.join(ROOT, page), 'utf8')])));
  const searchRecords = buildSearchIndex(pageSources, runtime.catalogues);
  const searchJson = JSON.stringify(searchRecords);
  const knowledge = buildAssistantKnowledge(pageSources, runtime.catalogues, searchRecords);
  await fs.writeFile(path.join(ROOT, 'cloudflare/adazai-worker/src/site-knowledge.js'),
    '// Generated from public site content by npm run build. Do not edit manually.\nexport default ' + JSON.stringify(knowledge, null, 2) + ';\n');
  const searchFile = `assets/runtime/site-search.${fingerprint(searchJson)}.json`;
  const loader = await fs.readFile(path.join(__dirname, 'browser-runtime.js'), 'utf8');
  const [widget, css] = await Promise.all([
    compileWidget(runtime, searchFile),
    transform(sourceCss, { loader: 'css', minify: true, target: 'es2020', legalComments: 'none' }),
  ]);
  const widgetFile = `assets/runtime/assistant.${fingerprint(widget.code)}.js`;
  const cssFile = `styles.${fingerprint(css.code)}.css`;

  // Never publish the repository root: it also contains backend code and local configuration.
  await fs.rm(OUTPUT, { recursive: true, force: true });
  await fs.mkdir(OUTPUT, { recursive: true });
  await fs.mkdir(path.join(OUTPUT, 'assets/runtime'), { recursive: true });
  await fs.mkdir(path.join(OUTPUT, '.well-known'), { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(OUTPUT, configFile), publicConfig),
    fs.copyFile(path.join(ROOT, '.well-known/security.txt'), path.join(OUTPUT, '.well-known/security.txt')),
    fs.writeFile(path.join(OUTPUT, widgetFile), widget.code),
    fs.writeFile(path.join(OUTPUT, searchFile), searchJson),
    fs.writeFile(path.join(OUTPUT, cssFile), css.code),
    ...STATIC_FILES.map(name => fs.copyFile(path.join(ROOT, name), path.join(OUTPUT, name))),
    // Ownership files must retain Google's exact content and stay out of the sitemap.
    ...verificationFiles.map(name => fs.copyFile(path.join(ROOT, name), path.join(OUTPUT, name))),
  ]);
  const emittedSources = [sourceJs, sourceCss];
  const pageBytes = {};
  for (const page of pages) {
    const source = replaceMedia(pageSources.get(page), manifest.media);
    const js = await compilePage(runtime, loader, page, widgetFile, replacements);
    const jsFile = `assets/runtime/page.${fingerprint(js.code)}.js`;
    await fs.writeFile(path.join(OUTPUT, jsFile), js.code);
    pageBytes[page] = Buffer.byteLength(js.code);
    let html = optimizeHtml(prerender(source, runtime, page), page, metadata, manifest.icons, cssFile, jsFile)
      .replace('src="ai-config.js"', `src="${configFile}"`);
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

  await fs.writeFile(path.join(OUTPUT, '_headers'), createHeaders());
  const sitemapPages = pages.filter(page => allowsIndexing(pageSources.get(page)));
  await fs.writeFile(path.join(OUTPUT, 'sitemap.xml'), createSitemap(sitemapPages));

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
