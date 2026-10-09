// Search only public page content; never include scripts, forms or configuration.
function text(html = '') {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ').replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (_, value) => String.fromCodePoint(value[0].toLowerCase() === 'x' ? parseInt(value.slice(1), 16) : Number(value)))
    .replace(/&(amp|quot|apos|nbsp|lt|gt|rsquo|lsquo|eacute);/g, (_, name) => ({amp:'&',quot:'"',apos:"'",nbsp:' ',lt:'<',gt:'>',rsquo:'’',lsquo:'‘',eacute:'é'}[name]))
    .replace(/\s+/g, ' ').trim();
}

function addSearchAnchors(html, page) {
  let project = 0;
  let faq = 0;
  if (page === 'projets.html') html = html.replace(/<article\b[^>]*data-group="projects"[^>]*>/g, tag => {
    project += 1;
    return /\bid="/.test(tag) ? tag : tag.replace('<article', `<article id="projet-${project}"`);
  });
  if (page === 'contact.html') html = html.replace(/<details\b[^>]*>/g, tag => {
    faq += 1;
    return /\bid="/.test(tag) ? tag : tag.replace('<details', `<details id="question-${faq}"`);
  });
  return html;
}

function buildSearchIndex(pages, catalogues) {
  const records = [];
  const names = {'index.html':'Accueil', 'services.html':'Services', 'produits.html':'Produits', 'projets.html':'Projets', 'a-propos.html':'À propos d’ADAZ RENOV', 'ia-travaux.html':'Estimer mes travaux', 'contact.html':'Contact et devis gratuit'};
  for (const [page, source] of pages) {
    if (!names[page]) continue;
    const href = page === 'index.html' ? '/' : '/' + page.replace('.html', '');
    const html = addSearchAnchors(source, page);
    const description = text(html.match(/<meta name="description" content="([^"]*)"/)?.[1]);
    records.push({title:names[page], type:'Page', href, description, keywords:text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1])});
    if (['services.html', 'projets.html'].includes(page)) {
      for (const match of html.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)) {
        const id = match[1].match(/\bid="([^"]+)"/)?.[1];
        const title = text(match[2].match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/)?.[1]);
        if (!id || !title) continue;
        records.push({title, type:page === 'services.html'?'Service':'Projet', href:`${href}#${id}`, description:text(match[2].match(/<p\b[^>]*>([\s\S]*?)<\/p>/)?.[1]), keywords:text(match[2].match(/<div class="project-topline">([\s\S]*?)<\/div>/)?.[1])});
      }
    }
    if (page === 'contact.html') {
      for (const match of html.matchAll(/<details\b([^>]*)>([\s\S]*?)<\/details>/g)) {
        const id = match[1].match(/\bid="([^"]+)"/)?.[1];
        const title = text(match[2].match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/)?.[1]);
        const answer = text(match[2].replace(/<summary[\s\S]*?<\/summary>/, ''));
        records.push({title, type:'FAQ', href:`${href}#${id}`, description:answer, answer, keywords:'questions fréquentes'});
      }
    }
  }
  const labels = {'door-products':'Porte d’entrée', 'window-products':'Fenêtre', 'shutter-products':'Volet roulant'};
  for (const catalogue of catalogues) for (const item of catalogue.records) {
    const title = text(item.html.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/)?.[1]) || item.name;
    records.push({title, type:'Produit', href:`/produits#${item.id}`, description:labels[catalogue.root]+' — découvrez le modèle et demandez un devis.', keywords:text(item.html).slice(0,1800)});
  }
  return records;
}

module.exports = {addSearchAnchors, buildSearchIndex, text};
