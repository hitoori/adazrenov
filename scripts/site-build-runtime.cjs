const vm = require('node:vm');
const { transform } = require('esbuild');
const { addSearchAnchors } = require('./site-search-index.cjs');

const STARTUP = 'document.addEventListener("DOMContentLoaded", () => {';
const PAGE_LABELS = {
  'index.html': 'Accueil',
  'services.html': 'Services',
  'produits.html': 'Produits',
  'projets.html': 'Projets',
  'a-propos.html': 'À propos',
  'ia-travaux.html': 'Assistant IA',
  'contact.html': 'Contact',
  'politique-confidentialite.html': 'Politique de confidentialité',
  'mentions-legales.html': 'Mentions légales',
};

function createRuntime(source, replacements) {
  const marker = source.indexOf(STARTUP);
  if (marker < 0 || marker !== source.lastIndexOf(STARTUP)) throw new Error('Unexpected site startup: update the build runtime.');
  const definitions = source.slice(0, marker);
  // Run only our own declarations. No DOM, network, user data or form code is executed.
  const context = vm.createContext({ window: { ADAZ_OPTIMIZED_MEDIA: replacements } });
  vm.runInContext(definitions, context, { timeout: 1000 });
  const evaluate = expression => vm.runInContext(expression, context, { timeout: 1000 });
  const catalogues = [
    ['door-products', 'doorCatalogue', 'buildDoorCatalogueCard', 'getDoorImagePath(model, 0)', 'porte'],
    ['window-products', 'windowCatalogue', 'buildWindowCatalogueCard', 'getWindowImagePath(model, "vue")', 'fenetre'],
    ['shutter-products', 'shutterCatalogue', 'buildShutterCatalogueCard', 'getShutterImagePath(model)', 'volet'],
  ].map(([root, catalogue, card, image, prefix]) => ({
    root,
    records: evaluate(`${catalogue}.map(model => ({
      id: ${JSON.stringify(prefix)} + '-' + String(model.id).padStart(2, '0'),
      name: model.title || ${JSON.stringify(prefix)} + ' ' + model.id,
      image: ${image},
      html: ${card}(model),
    }))`),
  }));
  const launcher = source.match(/<button class="adazai-floating-cta"[\s\S]*?<\/button>/)?.[0]
    .replace(/ aria-controls="[^"]+"/, '');
  const launcherHtml = launcher?.replaceAll('${headerLogoPath}', evaluate('headerLogoPath'));
  if (!launcher) throw new Error('Assistant launcher not found.');
  return {
    definitions, catalogues,
    launcher: `<div data-adazai-launcher>${launcherHtml}</div>`,
    header: page => evaluate(`buildHeader(${JSON.stringify(page)})`),
    footer: evaluate('buildFooter()').replace('<span id="year"></span>', `<span id="year">${new Date().getFullYear()}</span>`),
  };
}

function prerender(html, runtime, page) {
  html = addSearchAnchors(html, page);
  const currentPage = html.match(/data-page="([^"]+)"/)?.[1] || 'home';
  html = html.replace('<div class="site-header"></div>', `<div class="site-header">${runtime.header(currentPage)}</div>`)
    .replace('<div class="site-footer"></div>', `<div class="site-footer">${runtime.footer}</div>`)
    .replace(/<a class="is-active"/g, '<a class="is-active" aria-current="page"');
  for (const catalogue of runtime.catalogues) {
    const pattern = new RegExp(`(<div id="${catalogue.root}"[^>]*)(>)(</div>)`);
    if (!pattern.test(html)) continue;
    const cards = catalogue.records.map(record => record.html.replace('<article ', `<article id="${record.id}" `)).join('');
    html = html.replace(pattern, (_, opening) => `${opening} data-prerendered="true">${cards}</div>`);
  }
  return html.replace('</body>', `${runtime.launcher}\n</body>`);
}

function structuredData(html, page, canonical, domain, runtime) {
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || PAGE_LABELS[page];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  const pageType = page === 'a-propos.html' ? 'AboutPage' : page === 'contact.html' ? 'ContactPage'
    : ['produits.html', 'projets.html', 'services.html'].includes(page) ? 'CollectionPage' : 'WebPage';
  const graph = [{
    '@type': pageType, '@id': `${canonical}#webpage`, url: canonical,
    name: title.replaceAll('&amp;', '&'), description, inLanguage: 'fr-FR',
    isPartOf: { '@id': `${domain}/#website` }, about: { '@id': `${domain}/#business` },
  }];
  if (page === 'index.html') {
    graph.push({ '@type': 'WebSite', '@id': `${domain}/#website`, name: 'ADAZ RENOV', url: `${domain}/`, inLanguage: 'fr-FR', publisher: { '@id': `${domain}/#business` } });
    // Enrich the existing business with a stable ID; retain its verified contact details.
    html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (tag, text) => {
      const business = JSON.parse(text);
      business['@id'] = `${domain}/#business`;
      const image = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
      if (image) business.logo = image;
      return jsonLd(business);
    });
  } else {
    const breadcrumbId = `${canonical}#breadcrumb`;
    graph[0].breadcrumb = { '@id': breadcrumbId };
    graph.push({
      '@type': 'BreadcrumbList', '@id': breadcrumbId,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${domain}/` },
        { '@type': 'ListItem', position: 2, name: PAGE_LABELS[page], item: canonical },
      ],
    });
  }
  if (page === 'produits.html') {
    const records = runtime.catalogues.flatMap(catalogue => catalogue.records);
    const listId = `${canonical}#catalogue`;
    graph[0].mainEntity = { '@id': listId };
    graph.push({
      '@type': 'ItemList', '@id': listId, name: 'Portes, fenêtres et volets ADAZ RENOV',
      numberOfItems: records.length,
      itemListElement: records.map((record, index) => ({ '@type': 'ListItem', position: index + 1, name: record.name, url: `${canonical}#${record.id}` })),
    });
  }
  return html.replace('</head>', `${jsonLd({ '@context': 'https://schema.org', '@graph': graph })}\n</head>`);
}

function jsonLd(value) {
  return `<script type="application/ld+json">${JSON.stringify(value).replaceAll('<', '\\u003c')}</script>`;
}

async function compileWidget(runtime, searchFile) {
  const definitions = runtime.definitions.replace('const adazSiteSearchUrl = "site-search.json";', `const adazSiteSearchUrl = "/${searchFile}";`);
  return transform(`${definitions}\nwindow.ADAZ_INIT_WIDGET = setupGlobalAdazaiWidget;`, {
    loader: 'js', format: 'iife', minify: true, treeShaking: true, target: 'es2020', legalComments: 'none',
  });
}

async function compilePage(runtime, loader, page, widgetFile, replacements) {
  let calls = ['setupSiteShell()', 'setupCookieConsent()', 'setupReveal()', `setupLazyAdazaiWidget(${JSON.stringify(widgetFile)})`];
  if (page === 'produits.html') calls.push('setupProductCatalogue()');
  if (['index.html', 'projets.html'].includes(page)) calls.push('setupProjectVideoPreviews()', 'setupProjectVideoModal()');
  if (page === 'projets.html') calls.push('setupFilters()');
  if (['produits.html', 'projets.html', 'contact.html'].includes(page)) calls.push('setupSearchTarget()');
  if (page === 'contact.html') calls.push('setupContactForm()');
  if (page === 'ia-travaux.html') calls.push(
    'setupAiToolsNavigation()', 'setupAiPhotoAnalyzer()', 'setupAiMaterialAdvisor()', 'setupAiChatbot()',
    'setupAiEstimator()', 'setupAiConceptIdeator()', 'setupAiRoadmapPlanner()', 'setupAiBookingPlanner()',
  );
  const media = ['produits.html', 'ia-travaux.html'].includes(page)
    ? `window.ADAZ_OPTIMIZED_MEDIA = ${JSON.stringify(Object.fromEntries(Object.entries(replacements).filter(([key]) => key.startsWith('assets/catalogue/'))))};` : '';
  const startup = `document.addEventListener('DOMContentLoaded', () => { ${calls.join(';')}; });`;
  return transform(`${runtime.definitions}\n${loader}\n${media}\n${startup}`, {
    loader: 'js', format: 'iife', minify: true, treeShaking: true, target: 'es2020', legalComments: 'none',
  });
}

module.exports = { createRuntime, prerender, structuredData, compileWidget, compilePage };
