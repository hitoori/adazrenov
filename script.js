const navItems = [
  { page: "home", href: "index.html", label: "Accueil" },
  { page: "services", href: "services.html", label: "Services" },
  { page: "products", href: "produits.html", label: "Produits" },
  { page: "projects", href: "projets.html", label: "Projets" },
  { page: "about", href: "a-propos.html", label: "À propos" },
  { page: "ai", href: "ia-travaux.html", label: "IA Travaux" },
  { page: "contact", href: "contact.html", label: "Contact" },
];

const brandLogoPath = "Pozelogo+altele/Original%20on%20Transparent.png";
const headerLogoPath = "Pozelogo+altele/LOGOADAZNOU-transparent.png";
const companyPhoneDisplay = "+33 1 86 04 74 68";
const companyPhoneHref = "tel:+33186047468";
const companyEmail = "adazrenov@gmail.com";
const socialLinks = {
  facebook: "https://www.facebook.com/profile.php?id=61562185566929#",
  instagram: "https://www.instagram.com/adaz_renov?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  tiktok: "https://www.tiktok.com/@adaz_renov?is_from_webapp=1&sender_device=pc",
};

function buildHeader(currentPage) {
  const links = navItems
    .map((item) => {
      const active = item.page === currentPage ? "is-active" : "";
      return `<a class="${active}" href="${item.href}">${item.label}</a>`;
    })
    .join("");

  return `
    <div class="site-header-shell">
      <div class="container site-nav">
        <a class="brand" href="index.html" aria-label="ADAZ RENOV Accueil">
          <span class="logo-mark" aria-hidden="true">
            <img src="${headerLogoPath}" alt="">
          </span>
          <div class="logo-word">
            <strong>
              ADAZ RENOV
            </strong>
            <span>Renovation &amp; Construction</span>
          </div>
        </a>
        <nav class="nav-links" aria-label="Navigation principale">
          ${links}
        </nav>
        <div class="nav-cta">
          <a class="contact-chip" href="${companyPhoneHref}">${companyPhoneDisplay}</a>
          <a class="button small" href="contact.html">Devis gratuit</a>
        </div>
        <button class="nav-toggle" type="button" aria-label="Ouvrir le menu de navigation" aria-expanded="false" aria-controls="mobile-nav">
          Menu
        </button>
      </div>
      <div class="mobile-nav" id="mobile-nav">
        <div class="container mobile-nav-inner">
          ${links}
          <a href="${companyPhoneHref}">${companyPhoneDisplay}</a>
          <a href="contact.html">Devis gratuit</a>
        </div>
      </div>
    </div>
  `;
}

function buildFooter() {
  return `
    <footer class="footer-shell">
      <div class="container footer-grid">
        <div class="footer-block">
          <div class="brand">
            <img class="brand-logo" src="${brandLogoPath}" alt="Logo ADAZ RENOV">
          </div>
          <p>
            Votre partenaire de confiance pour tous vos projets de renovation et construction en France.
          </p>
          <div class="social-row" aria-label="Reseaux sociaux">
            <a class="social-pill" href="${socialLinks.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Facebook ADAZ RENOV">Fb</a>
            <a class="social-pill" href="${socialLinks.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram ADAZ RENOV">Ig</a>
            <a class="social-pill" href="${socialLinks.tiktok}" target="_blank" rel="noopener noreferrer" aria-label="TikTok ADAZ RENOV">Tk</a>
          </div>
        </div>
        <div class="footer-block">
          <h3>Navigation</h3>
          <div class="footer-links">
            <a href="index.html">Accueil</a>
            <a href="services.html">Services</a>
            <a href="produits.html">Produits</a>
            <a href="projets.html">Projets</a>
            <a href="a-propos.html">À propos</a>
            <a href="ia-travaux.html">IA Travaux</a>
            <a href="contact.html">Contact</a>
          </div>
        </div>
        <div class="footer-block">
          <h3>Services</h3>
          <ul class="footer-links">
            <li>Renovation interieure</li>
            <li>Renovation exterieure</li>
            <li>Construction generale</li>
            <li>Amenagement sur mesure</li>
            <li>Vente de matériaux</li>
            <li>Outils IA chantier</li>
          </ul>
        </div>
        <div class="footer-block">
          <h3>Contact</h3>
          <div class="footer-contact">
            <span>1 Place du Vieux Pays<br>94880 Noiseau, France</span>
            <a href="${companyPhoneHref}">${companyPhoneDisplay}</a>
            <a href="mailto:${companyEmail}">${companyEmail}</a>
          </div>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>&copy; <span id="year"></span> ADAZ RENOV. Tous droits reserves.</span>
        <div class="footer-legal">
          <a href="#">Mentions legales</a>
          <a href="politique-confidentialite.html">Politique de confidentialite</a>
          <a href="#">CGV</a>
        </div>
      </div>
    </footer>
  `;
}

function setupFilters() {
  const groups = document.querySelectorAll("[data-filter-group]");

  groups.forEach((group) => {
    const key = group.dataset.filterGroup;
    const buttons = group.querySelectorAll("[data-filter]");
    const cards = document.querySelectorAll(`[data-group="${key}"]`);
    const emptyState = document.querySelector(`[data-empty="${key}"]`);

    function apply(filter) {
      let visible = 0;

      buttons.forEach((button) => {
        const active = button.dataset.filter === filter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      cards.forEach((card) => {
        const tags = (card.dataset.tags || "").split(" ");
        const show = filter === "all" || tags.includes(filter);
        card.hidden = !show;
        if (show) visible += 1;
      });

      if (emptyState) {
        emptyState.hidden = visible !== 0;
      }

      if (key === "products") {
        document.dispatchEvent(new CustomEvent("productsfilterchange", { detail: { filter } }));
      }
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => apply(button.dataset.filter || "all"));
    });

    apply("all");
  });
}

function setupProductSubfilters() {
  const root = document.querySelector("[data-product-subfilters]");
  if (!root) return;

  const panels = root.querySelectorAll("[data-subfilter-panel]");
  const buttons = root.querySelectorAll("[data-subfilter]");
  const cards = document.querySelectorAll('[data-group="products"]');
  const emptyState = document.querySelector('[data-empty="products"]');
  let activeMain = "all";
  let activeSub = "all";

  function renderPanels() {
    const showSubfilters = activeMain === "doors" || activeMain === "windows";
    root.hidden = !showSubfilters;

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.subfilterPanel !== activeMain;
    });
  }

  function updateButtons() {
    buttons.forEach((button) => {
      const panel = button.closest("[data-subfilter-panel]");
      const panelKey = panel?.dataset.subfilterPanel || "";
      const active = panelKey === activeMain && button.dataset.subfilter === activeSub;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function applySubfilter(nextSub = activeSub) {
    activeSub = nextSub;
    let visible = 0;
    const needsSubfilter = activeMain === "doors" || activeMain === "windows";

    cards.forEach((card) => {
      const tags = (card.dataset.tags || "").split(" ");
      const matchesMain = activeMain === "all" || tags.includes(activeMain);
      const matchesSub = !needsSubfilter || activeSub === "all" || card.dataset.subcategory === activeSub;
      const show = matchesMain && matchesSub;
      card.hidden = !show;
      if (show) visible += 1;
    });

    updateButtons();

    if (emptyState) {
      emptyState.hidden = visible !== 0;
    }
  }

  function setMainFilter(filter) {
    if (filter !== activeMain) {
      activeSub = "all";
    }

    activeMain = filter;
    renderPanels();
    applySubfilter(activeSub);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => applySubfilter(button.dataset.subfilter || "all"));
  });

  document.addEventListener("productsfilterchange", (event) => {
    setMainFilter(event.detail?.filter || "all");
  });

  const activeButton = document.querySelector('[data-filter-group="products"] .filter-chip.is-active');
  setMainFilter(activeButton?.dataset.filter || "all");
}

const doorStandardSizes = [
  "80 x 200 cm",
  "90 x 200 cm",
  "90 x 210 cm",
  "100 x 210 cm",
  "140 x 210 cm double",
];

let doorCatalogue = [
  {
    id: 1,
    colors: ["Noir mat"],
    imagePath: "usiproduse/Panneau01/Panneau01.png",
    schemaPath: "usiproduse/Panneau01/Panneau01schema.png",
  },
  {
    id: 2,
    colors: ["Noir mat"],
    imagePath: "usiproduse/Panneau02/Panneau02.png",
    schemaPath: "usiproduse/Panneau02/Panneau02schema.png",
  },
  {
    id: 3,
    colors: ["Noir mat"],
    imagePath: "usiproduse/Panneau03/Panneau03.png",
    schemaPath: "usiproduse/Panneau03/Panneau03SCHEMA.png",
  },
  {
    id: 4,
    colors: ["Noir mat"],
    imagePath: "usiproduse/Panneau04/Panneau04.png",
    schemaPath: "usiproduse/Panneau04/Panneau04schema.png",
  },
  {
    id: 5,
    colors: ["Noir mat"],
    imagePath: "usiproduse/Panneau05/Panneau05.png",
    schemaPath: "usiproduse/Panneau05/Panneau05schema.png",
  },
  {
    id: 6,
    colors: ["Noir mat"],
    imagePath: "usiproduse/Panneau06/Panneau06.png",
    schemaPath: "usiproduse/Panneau06/Panneau06schema.png",
  },
];

let windowCatalogue = [
  {
    id: 1,
    title: "Fenetre aluminium ENTRA",
    description: "Profil aluminium moderne avec isolation renforcee et finition personnalisable.",
    specs: "Aluminium, 3 joints, 3 chambres, Uw 0,85 pour Ug = 0,5.",
    hasTechSheet: true,
  },
  {
    id: 2,
    title: "Fenetre bois ESPERIA LIFE",
    description: "Menuiserie bois chaleureuse avec profil isolant pour renovation premium.",
    specs: "Bois, fiche technique disponible, Uw 0,83 pour Ug = 0,5.",
    hasTechSheet: true,
  },
  {
    id: 3,
    title: "Fenetre PVC modele 03",
    description: "Profil PVC blanc avec vitrage isolant et lignes sobres pour facade contemporaine.",
  },
  {
    id: 4,
    title: "Baie coulissante PVC EKOSUN HST",
    description: "Systeme coulissant PVC pour grandes ouvertures avec performance thermique elevee.",
    specs: "PVC coulissant, fiche technique disponible, Uw 0,63 pour Ug = 0,5.",
    hasTechSheet: true,
  },
  {
    id: 5,
    title: "Fenetre PVC IDEAL 8000",
    description: "Profil PVC performant pour isolation, etancheite et confort au quotidien.",
    specs: "PVC, 3 joints, 6 chambres, Uw 0,74 pour Ug = 0,5.",
    hasTechSheet: true,
  },
  {
    id: 6,
    title: "Fenetre PVC modele 06",
    description: "Menuiserie PVC blanche avec double vitrage et coloris disponibles sur demande.",
  },
  {
    id: 7,
    title: "Fenetre aluminium modele 07",
    description: "Profil aluminium fin, adapte aux projets modernes et aux finitions foncees.",
  },
  {
    id: 8,
    title: "Fenetre aluminium anthracite",
    description: "Menuiserie aluminium foncee avec vitrage isolant et style contemporain.",
  },
  {
    id: 9,
    title: "Fenetre bois avec appui",
    description: "Profil bois robuste avec finition protectrice et rendu naturel.",
    specs: "Fenetres en bois avec couches de vernis pour garantir une utilisation durable.",
    hasTechSheet: true,
  },
  {
    id: 10,
    title: "Fenetre PVC isolation renforcee",
    description: "Profil PVC blanc concu pour une bonne isolation thermique et acoustique.",
  },
  {
    id: 11,
    title: "Fenetre PVC double vitrage",
    description: "Solution PVC compacte pour renovation avec vitrage isolant.",
  },
  {
    id: 12,
    title: "Fenetre PVC haute performance",
    description: "Profil PVC blanc avec structure renforcie pour confort et durabilite.",
  },
  {
    id: 13,
    title: "Fenetre aluminium modele 13",
    description: "Profil aluminium epure avec choix de coloris pour s'adapter a la facade.",
  },
];

let shutterCatalogue = [
  { id: 1, title: "Volet roulant exterieur modele 01", feature: "Coffre apparent" },
  { id: 2, title: "Volet roulant exterieur modele 02", feature: "Sous linteau" },
  { id: 3, title: "Volet roulant exterieur modele 03", feature: "Coffre droit" },
  { id: 4, title: "Volet roulant exterieur modele 04", feature: "Coffre arrondi" },
  { id: 5, title: "Volet roulant exterieur modele 05", feature: "Acces technique" },
  { id: 6, title: "Volet roulant exterieur modele 06", feature: "Finition blanche" },
];

function getAiProductsConfig() {
  return window.AI_AISSTEN_PRODUCTS_CONFIG || {};
}

function normalizeCatalogueKind(value) {
  const normalized = String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (["door", "doors", "porte", "portes", "portes-entree", "portes-d-entree"].includes(normalized)) return "doors";
  if (["window", "windows", "fenetre", "fenetres", "geamuri"].includes(normalized)) return "windows";
  if (["shutter", "shutters", "volet", "volets", "rulouri"].includes(normalized)) return "shutters";
  return "";
}

function normalizeProductRecord(record, fallbackKind = "") {
  const kind = normalizeCatalogueKind(record.category || record.kind || record.type || fallbackKind);
  const id = record.id ?? record.modelId ?? record.order ?? record.databaseId ?? "";
  const normalized = {
    ...record,
    id,
    order: Number(record.order ?? record.position ?? id ?? 0) || 0,
    category: kind,
  };

  if (kind === "doors") {
    normalized.colors = Array.isArray(record.colors) && record.colors.length ? record.colors : ["Noir mat"];
  }

  return normalized;
}

function groupProductRecords(records) {
  return records.reduce(
    (groups, record) => {
      const normalized = normalizeProductRecord(record);
      if (!normalized.category) return groups;
      if (!isVisibleProduct(normalized)) return groups;
      groups[normalized.category].push(normalized);
      return groups;
    },
    { doors: [], windows: [], shutters: [] }
  );
}

function sortProductRecords(records) {
  return records.sort((left, right) => {
    const orderDiff = (Number(left.order) || 0) - (Number(right.order) || 0);
    if (orderDiff) return orderDiff;
    return String(left.title || left.id).localeCompare(String(right.title || right.id), "fr");
  });
}

function isVisibleProduct(record) {
  return record.active !== false && record.status !== "hidden" && record.status !== "draft";
}

function applyRemoteProductCatalogue(payload) {
  const source = Array.isArray(payload)
    ? groupProductRecords(payload)
    : {
        doors: (payload?.doors || []).map((item) => normalizeProductRecord(item, "doors")).filter(isVisibleProduct),
        windows: (payload?.windows || []).map((item) => normalizeProductRecord(item, "windows")).filter(isVisibleProduct),
        shutters: (payload?.shutters || []).map((item) => normalizeProductRecord(item, "shutters")).filter(isVisibleProduct),
      };

  if (source.doors?.length) doorCatalogue = sortProductRecords(source.doors);
  if (source.windows?.length) windowCatalogue = sortProductRecords(source.windows);
  if (source.shutters?.length) shutterCatalogue = sortProductRecords(source.shutters);

  return Boolean(source.doors?.length || source.windows?.length || source.shutters?.length);
}

async function loadProductCataloguesFromApi(apiUrl) {
  const response = await fetch(apiUrl, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Products API unavailable: ${response.status}`);
  return response.json();
}

async function loadProductCataloguesFromFirestore() {
  const config = getAiProductsConfig();
  const firebase = await getFirebaseBookingApi();
  if (!firebase) return null;

  const collectionName = config.collection || "siteProducts";
  const snapshot = await firebase.getDocs(firebase.collection(firebase.db, collectionName));
  const records = [];

  snapshot.forEach((documentSnapshot) => {
    records.push({
      databaseId: documentSnapshot.id,
      ...documentSnapshot.data(),
    });
  });

  return records;
}

async function loadProductCatalogues() {
  const config = getAiProductsConfig();

  try {
    const payload = config.apiUrl
      ? await loadProductCataloguesFromApi(config.apiUrl)
      : await loadProductCataloguesFromFirestore();

    if (payload && applyRemoteProductCatalogue(payload)) {
      document.documentElement.dataset.productsSource = config.apiUrl ? "api" : "firestore";
    }
  } catch (error) {
    console.warn("Products database unavailable, using local catalogue.", error);
  }
}

function slugifyDoorColor(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getDoorModelSlug(modelId) {
  return `porte-entree-modele-${String(modelId).padStart(2, "0")}`;
}

function getDoorImagePath(model, variantIndex) {
  if (model.imagePath && variantIndex === 0) {
    return model.imagePath;
  }

  const modelSlug = getDoorModelSlug(model.id);
  const colorSlug = slugifyDoorColor(model.colors[variantIndex] || model.colors[0]);
  return `assets/catalogue/usi/${modelSlug}/${modelSlug}-${colorSlug}.webp?v=white-bg`;
}

function getDoorSchemaImagePath(model) {
  return model.schemaPath || "";
}

function getWindowModelSlug(modelId) {
  return `fenetre-modele-${String(modelId).padStart(2, "0")}`;
}

function getWindowImagePath(model, slideKey) {
  if (model.imagePath) return model.imagePath;
  const modelSlug = getWindowModelSlug(model.id);
  return `assets/catalogue/geamuri/${modelSlug}/${modelSlug}-${slideKey}.webp?v=20260503`;
}

function getShutterModelSlug(modelId) {
  return `volet-roulant-exterieur-modele-${String(modelId).padStart(2, "0")}`;
}

function getShutterImagePath(model) {
  if (model.imagePath) return model.imagePath;
  const modelSlug = getShutterModelSlug(model.id);
  return `assets/catalogue/volets/${modelSlug}/${modelSlug}.webp?v=20260503`;
}

function normalizeProductMaterial(value, allowed, fallback) {
  const normalized = String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return allowed.includes(normalized) ? normalized : fallback;
}

function getDoorMaterial(model) {
  if (model.material) return normalizeProductMaterial(model.material, ["metal", "wood", "pvc"], "metal");
  const modelId = Number(model.id);
  if ([11, 12, 16].includes(modelId)) return "wood";
  if ([13, 14, 15, 17, 18, 19, 20, 21, 23, 24, 25].includes(modelId)) return "pvc";
  return "metal";
}

function getWindowMaterial(model) {
  if (model.material) return normalizeProductMaterial(model.material, ["aluminium", "wood", "pvc"], "pvc");
  const modelId = Number(model.id);
  if ([1, 7, 8, 13].includes(modelId)) return "aluminium";
  if ([2, 9].includes(modelId)) return "wood";
  return "pvc";
}

function getDoorMaterialLabel(material) {
  if (material === "wood") return "Bois";
  if (material === "pvc") return "PVC";
  return "Acier";
}

function getDoorBasePrice(material) {
  if (material === "wood") return 1650;
  if (material === "pvc") return 1150;
  return 1450;
}

function parseDoorSize(value) {
  const match = String(value || "").match(/(\d+)\s*x\s*(\d+)/i);
  return {
    width: match ? Number.parseInt(match[1], 10) : 90,
    height: match ? Number.parseInt(match[2], 10) : 200,
  };
}

function formatDoorPrice(value) {
  const rounded = Math.round(value / 10) * 10;
  return `${rounded.toLocaleString("fr-FR")} EUR`;
}

function estimateDoorPrice(material, mode, width, height, sizeLabel) {
  const basePrice = getDoorBasePrice(material);
  const areaRatio = Math.max((width * height) / (90 * 200), 0.82);
  let price = basePrice * areaRatio;

  if (mode === "custom") {
    price += 320;
  } else {
    if (String(sizeLabel || "").includes("double")) price += 520;
    if (width >= 100) price += 180;
    if (height >= 210) price += 120;
  }

  return price;
}

function buildDoorCatalogueCard(model) {
  const modelLabel = escapeHtml(`Porte d'entree modele ${String(model.id).padStart(2, "0")}`);
  const displayModelLabel = escapeHtml(model.title || `Porte d'entrée modèle ${String(model.id).padStart(2, "0")}`);
  const material = getDoorMaterial(model);
  const materialLabel = getDoorMaterialLabel(material);
  const schemaImage = getDoorSchemaImagePath(model);
  const photoImage = escapeHtml(getDoorImagePath(model, 0));
  const safeSchemaImage = escapeHtml(schemaImage);
  const domId = String(model.databaseId || model.id || "").replace(/[^a-zA-Z0-9_-]/g, "-");
  const sizeOptions = doorStandardSizes
    .map((size) => `<option value="${size}">${size}</option>`)
    .join("");
  const defaultSize = parseDoorSize(doorStandardSizes[0]);
  const defaultPrice = estimateDoorPrice(material, "standard", defaultSize.width, defaultSize.height, doorStandardSizes[0]);

  return `
    <article class="card product-card catalogue-card door-card" data-group="products" data-tags="doors ${material} premium" data-subcategory="${material}" data-door-card>
      <div class="media-top catalogue-media door-media">
        <div class="door-view is-active" data-door-view="photo">
          <img src="${photoImage}" alt="${modelLabel}" loading="lazy" decoding="async">
        </div>
        <div class="door-view door-schema-view" data-door-view="schema" hidden>
          ${schemaImage
            ? `<img class="door-schema-image" src="${safeSchemaImage}" alt="${modelLabel} - schema technique" loading="lazy" decoding="async">`
            : `<div class="door-schema">
                <span class="schema-frame"></span>
                <span class="schema-panel"></span>
                <span class="schema-handle"></span>
                <span class="schema-arc"></span>
              </div>`}
        </div>
      </div>
      <div class="card-body">
        <div class="image-toggle door-image-toggle" aria-label="Changer la vue du produit">
          <div class="door-image-option">
            <button class="image-toggle-button is-active" type="button" data-door-media="photo" aria-pressed="true" aria-label="Vue standard"></button>
            <span>Standard</span>
          </div>
          <div class="door-image-option">
            <button class="image-toggle-button" type="button" data-door-media="schema" aria-pressed="false" aria-label="Vue sur mesure"></button>
            <span>Sur mesure</span>
          </div>
        </div>
        <div class="project-topline">Portes d'entrée</div>
        <h3>${displayModelLabel}</h3>
        <div class="door-choice-tabs" aria-label="Type de commande">
          <button class="door-choice-button is-active" type="button" data-door-mode="standard" aria-pressed="true">Standard</button>
          <button class="door-choice-button" type="button" data-door-mode="custom" aria-pressed="false">Sur mesure</button>
        </div>
        <div class="door-panels">
          <div class="door-panel" data-door-panel="standard">
            <div class="tool-field">
              <label for="door-size-${domId}">Dimension standard</label>
              <select id="door-size-${domId}" data-door-size>
                ${sizeOptions}
              </select>
            </div>
          </div>
          <div class="door-panel door-custom-panel" data-door-panel="custom" hidden>
            <div class="tool-field">
              <label for="door-width-${domId}">Largeur en cm</label>
              <input id="door-width-${domId}" type="number" min="70" max="160" step="1" value="90" inputmode="numeric" data-door-width>
            </div>
            <div class="tool-field">
              <label for="door-height-${domId}">Hauteur en cm</label>
              <input id="door-height-${domId}" type="number" min="190" max="240" step="1" value="210" inputmode="numeric" data-door-height>
            </div>
          </div>
        </div>
        <p class="product-note door-summary" data-door-note>
          <span>${materialLabel}. Dimension standard : ${doorStandardSizes[0]}.</span>
          <span>Prix estimatif : <strong data-door-price>${formatDoorPrice(defaultPrice)}</strong>, hors pose.</span>
        </p>
        <div class="product-footer"><span class="price-row">Sur devis</span><a class="button small light" href="contact.html">Demander</a></div>
      </div>
    </article>
  `;
}

function setupDoorCatalogue() {
  const root = document.querySelector("#door-products");
  if (!root) return;

  root.innerHTML = doorCatalogue.map(buildDoorCatalogueCard).join("");

  root.querySelectorAll("[data-door-card]").forEach((card, cardIndex) => {
    const model = doorCatalogue[cardIndex];
    const material = getDoorMaterial(model);
    const materialLabel = getDoorMaterialLabel(material);
    const mediaButtons = card.querySelectorAll("[data-door-media]");
    const views = card.querySelectorAll("[data-door-view]");
    const modeButtons = card.querySelectorAll("[data-door-mode]");
    const panels = card.querySelectorAll("[data-door-panel]");
    const sizeSelect = card.querySelector("[data-door-size]");
    const widthInput = card.querySelector("[data-door-width]");
    const heightInput = card.querySelector("[data-door-height]");
    const note = card.querySelector("[data-door-note]");
    let activeMode = "standard";

    const updateMedia = (nextView) => {
      views.forEach((view) => {
        const active = view.dataset.doorView === nextView;
        view.hidden = !active;
        view.classList.toggle("is-active", active);
      });

      mediaButtons.forEach((button) => {
        const active = button.dataset.doorMedia === nextView;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    };

    const updateDoor = () => {
      const standardSize = sizeSelect?.value || doorStandardSizes[0];
      const parsedStandard = parseDoorSize(standardSize);
      const customWidth = Number.parseInt(widthInput?.value || "90", 10) || 90;
      const customHeight = Number.parseInt(heightInput?.value || "210", 10) || 210;
      const width = activeMode === "custom" ? customWidth : parsedStandard.width;
      const height = activeMode === "custom" ? customHeight : parsedStandard.height;
      const priceValue = estimateDoorPrice(material, activeMode, width, height, standardSize);

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.doorPanel !== activeMode;
      });

      modeButtons.forEach((button) => {
        const active = button.dataset.doorMode === activeMode;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      if (note) {
        const detail = activeMode === "custom"
          ? `Sur mesure : ${width} x ${height} cm.`
          : `Dimension standard : ${standardSize}.`;
        note.innerHTML = `
          <span>${materialLabel}. ${detail}</span>
          <span>Prix estimatif : <strong data-door-price>${formatDoorPrice(priceValue)}</strong>, hors pose.</span>
        `;
      }
    };

    mediaButtons.forEach((button) => {
      button.addEventListener("click", () => updateMedia(button.dataset.doorMedia || "photo"));
    });

    modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeMode = button.dataset.doorMode || "standard";
        updateDoor();
      });
    });

    sizeSelect?.addEventListener("change", updateDoor);
    widthInput?.addEventListener("input", updateDoor);
    heightInput?.addEventListener("input", updateDoor);
    updateMedia("photo");
    updateDoor();
  });
}

function getWindowTechDetails(model) {
  const material = getWindowMaterial(model);
  const defaults = {
    aluminium: { joints: 3, chambers: 3, depth: "70 mm", glazing: "jusqu'a 48 mm", uw: "0,85", ug: "0,5" },
    wood: { joints: 2, chambers: 4, depth: "78 mm", glazing: "jusqu'a 44 mm", uw: "0,83", ug: "0,5" },
    pvc: { joints: 3, chambers: 5, depth: "70 mm", glazing: "jusqu'a 41 mm", uw: "1,0", ug: "0,7" },
  };
  const premium = {
    4: { joints: 3, chambers: 6, depth: "197 mm", glazing: "jusqu'a 52 mm", uw: "0,63", ug: "0,5" },
    5: { joints: 3, chambers: 6, depth: "85 mm", glazing: "jusqu'a 51 mm", uw: "0,74", ug: "0,5" },
    12: { joints: 3, chambers: 6, depth: "85 mm", glazing: "jusqu'a 51 mm", uw: "0,74", ug: "0,5" },
  };

  const databaseDetails = model.tech || model.technical || model.technicalDetails || {};
  return {
    ...(premium[model.id] || defaults[material] || defaults.pvc),
    ...databaseDetails,
  };
}

function buildWindowSpecs(model) {
  const details = getWindowTechDetails(model);
  const materialLabel = getWindowMaterial(model) === "aluminium"
    ? "Aluminium"
    : getWindowMaterial(model) === "wood"
      ? "Bois"
      : "PVC";

  return `
    <div class="window-spec-card" aria-label="Caracteristiques techniques">
      <p class="window-spec-lead">${escapeHtml(materialLabel)}, ${escapeHtml(details.joints)} joints, ${escapeHtml(details.chambers)} chambres, Uw ${escapeHtml(details.uw)} pour Ug = ${escapeHtml(details.ug)}.</p>
      <div class="window-spec-pair">
        <strong>${escapeHtml(details.joints)}</strong>
        <span>Joints</span>
      </div>
      <div class="window-spec-pair">
        <strong>${escapeHtml(details.chambers)}</strong>
        <span>Chambres</span>
      </div>
      <p>Profondeur de construction : ${escapeHtml(details.depth)}</p>
      <p>Epaisseur de vitrage : ${escapeHtml(details.glazing)} (standard 24 mm)</p>
      <p class="window-custom-color">Coloris : sur mesure au choix</p>
    </div>
  `;
}

function buildWindowCatalogueCard(model) {
  const material = getWindowMaterial(model);
  const title = escapeHtml(model.title || `Fenetre modele ${String(model.id).padStart(2, "0")}`);
  const imagePath = escapeHtml(getWindowImagePath(model, "vue"));

  return `
    <article class="card product-card catalogue-card window-card" data-group="products" data-tags="windows fenetres ${material}" data-subcategory="${material}" data-window-card>
      <div class="media-top catalogue-media window-media">
        <img src="${imagePath}" alt="${title} - vue du modele" loading="lazy" decoding="async">
      </div>
      <div class="card-body">
        <div class="project-topline">Fenetres</div>
        <h3>${title}</h3>
        ${buildWindowSpecs(model)}
        <div class="product-footer window-footer"><span class="price-row">Sur devis</span><a class="window-request-link" href="contact.html">Demander <span aria-hidden="true">-&gt;</span></a></div>
      </div>
    </article>
  `;
}

function setupWindowCatalogue() {
  const root = document.querySelector("#window-products");
  if (!root) return;

  root.innerHTML = windowCatalogue.map(buildWindowCatalogueCard).join("");
}

function buildShutterCatalogueCard(model) {
  const feature = escapeHtml(model.feature || model.description || "Modele disponible sur devis");
  const title = escapeHtml(model.title || `Volet roulant exterieur modele ${String(model.id).padStart(2, "0")}`);
  const imagePath = escapeHtml(getShutterImagePath(model));

  return `
    <article class="card product-card catalogue-card shutter-card" data-group="products" data-tags="shutters volets protection" data-shutter-card>
      <div class="media-top catalogue-media shutter-media">
        <img src="${imagePath}" alt="${title}" loading="lazy" decoding="async">
      </div>
      <div class="card-body">
        <div class="project-topline">Volets roulants exterieurs</div>
        <h3>${title}</h3>
        <p class="product-note shutter-short">${feature}</p>
        <div class="product-footer"><span class="price-row">Sur devis</span><a class="button small light" href="contact.html">Demander</a></div>
      </div>
    </article>
  `;
}

function setupShutterCatalogue() {
  const root = document.querySelector("#shutter-products");
  if (!root) return;

  root.innerHTML = shutterCatalogue.map(buildShutterCatalogueCard).join("");
}

function orderProductCatalogueCards() {
  const doors = document.querySelectorAll("[data-door-card]");
  const windows = document.querySelectorAll("[data-window-card]");
  const shutters = document.querySelectorAll("[data-shutter-card]");

  doors.forEach((card, index) => {
    card.style.order = String(index + 1);
  });
  windows.forEach((card, index) => {
    card.style.order = String(doors.length + index + 1);
  });
  shutters.forEach((card, index) => {
    card.style.order = String(doors.length + windows.length + index + 1);
  });
}

function inferProductPreviewKind(title) {
  const normalized = String(title || "").toLowerCase();
  if (normalized.includes("fenetre") || normalized.includes("porte-fenetre") || normalized.includes("porte fenetre")) {
    return "window";
  }
  if (normalized.includes("porte")) {
    return "door";
  }
  return "material";
}

function resolveSwatchColor(option) {
  const label = String(option?.dataset?.label || option?.textContent || option?.value || "").toLowerCase();

  if (label.includes("noir et vert")) return "linear-gradient(135deg, #1f2024 0 50%, #1f4f38 50% 100%)";
  if (label.includes("noir et blanc")) return "linear-gradient(135deg, #1f2024 0 50%, #f6f7f8 50% 100%)";
  if (label.includes("noir et bleu")) return "linear-gradient(135deg, #1f2024 0 50%, #1f5fa8 50% 100%)";
  if (label.includes("noir et gris")) return "linear-gradient(135deg, #1f2024 0 50%, #8a929b 50% 100%)";
  if (label.includes("anthracite")) return "#3c4047";
  if (label.includes("noir")) return "#1f2024";
  if (label.includes("blanc casse")) return "#f2eee7";
  if (label.includes("blanc")) return "#f6f7f8";
  if (label.includes("gris perle")) return "#c8cdd4";
  if (label.includes("gris")) return "#8a929b";
  if (label.includes("orange")) return "#f26a21";
  if (label.includes("beige") || label.includes("sable") || label.includes("lin")) return "#d9c8a7";
  if (label.includes("naturel") || label.includes("chene")) return "#b78354";
  if (label.includes("acajou")) return "#9f3e25";
  if (label.includes("wenge")) return "#33221b";
  if (label.includes("noyer")) return "#6f4a2f";
  if (label.includes("bronze")) return "#8b6a45";
  if (label.includes("vert")) return "#728a56";
  if (label.includes("champagne")) return "#d4c59d";
  if (label.includes("bleu")) return "#355a8a";
  if (label.includes("ocre")) return "#c47a3a";
  if (label.includes("terre") || label.includes("brun") || label.includes("rouge")) return "#b96a46";
  if (label.includes("sauge")) return "#90a57c";
  if (label.includes("bois")) return "#9a6a40";
  return "#8a929b";
}

function hexToRgba(hex, alpha) {
  const normalized = String(hex || "").replace("#", "");
  if (normalized.length !== 6) return `rgba(138, 146, 155, ${alpha})`;
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function escapeSvgText(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function svgToDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildProductPreview(kind, colorHex, colorLabel, sizeLabel) {
  const safeColor = colorHex || "#8a929b";
  const safeLabel = escapeSvgText(colorLabel);
  const safeSize = escapeSvgText(sizeLabel);

  if (kind === "window") {
    return svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="Fenetre ${safeLabel}">
        <defs>
          <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#eef4f9"/>
            <stop offset="100%" stop-color="#d8e1ea"/>
          </linearGradient>
          <linearGradient id="glass" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#eff9ff" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="#cfe6f8" stop-opacity="0.9"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#bg)"/>
        <rect x="170" y="78" width="460" height="352" rx="30" fill="${safeColor}"/>
        <rect x="205" y="112" width="390" height="286" rx="16" fill="url(#glass)"/>
        <rect x="367" y="112" width="36" height="286" fill="rgba(255,255,255,0.3)"/>
        <rect x="205" y="245" width="390" height="36" fill="rgba(255,255,255,0.34)"/>
        <rect x="150" y="440" width="500" height="34" rx="16" fill="rgba(20, 34, 52, 0.12)"/>
        <text x="400" y="520" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="28" font-weight="800" fill="#203047">${safeLabel}${safeSize ? ` · ${safeSize}` : ""}</text>
      </svg>
    `);
  }

  if (kind === "door") {
    return svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="Porte ${safeLabel}">
        <defs>
          <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#f2efe8"/>
            <stop offset="100%" stop-color="#dfd9cf"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#bg)"/>
        <rect x="244" y="72" width="312" height="456" rx="24" fill="${safeColor}"/>
        <rect x="270" y="98" width="260" height="404" rx="16" fill="rgba(255,255,255,0.14)"/>
        <rect x="304" y="152" width="192" height="88" rx="10" fill="rgba(255,255,255,0.18)"/>
        <rect x="304" y="268" width="192" height="140" rx="10" fill="rgba(255,255,255,0.1)"/>
        <circle cx="494" cy="340" r="11" fill="#f2d49a"/>
        <rect x="164" y="486" width="472" height="30" rx="15" fill="rgba(20, 34, 52, 0.12)"/>
        <text x="400" y="548" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="28" font-weight="800" fill="#203047">${safeLabel}</text>
      </svg>
    `);
  }

  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="Produit ${safeLabel}">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f5f1ea"/>
          <stop offset="100%" stop-color="#e4ddd1"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bg)"/>
      <rect x="150" y="138" width="500" height="244" rx="28" fill="${safeColor}" opacity="0.92"/>
      <rect x="178" y="166" width="444" height="188" rx="18" fill="rgba(255,255,255,0.35)"/>
      <rect x="206" y="194" width="388" height="132" rx="12" fill="rgba(255,255,255,0.18)"/>
      <rect x="176" y="428" width="448" height="34" rx="17" fill="rgba(20, 34, 52, 0.12)"/>
      <text x="400" y="510" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="28" font-weight="800" fill="#203047">${safeLabel}</text>
    </svg>
  `);
}

function setupProductVariants() {
  const cards = document.querySelectorAll(".product-card[data-base-price]");

  if (!cards.length) return;

  const parseNumber = (value, fallback) => {
    const parsed = Number.parseFloat(String(value || ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const formatPrice = (value, suffix) => {
    const rounded = Math.round(value / 5) * 5;
    return `A partir de ${rounded.toLocaleString("fr-FR")}EUR${suffix}`;
  };

  cards.forEach((card) => {
    const basePrice = parseNumber(card.dataset.basePrice, 0);
    const priceMode = card.dataset.priceMode || "fixed";
    const priceSuffix = card.dataset.priceSuffix || "";
    const colorSelect = card.querySelector("[data-product-color]");
    const sizeSelect = card.querySelector("[data-product-size]");
    const priceOutput = card.querySelector("[data-price-output]");
    const priceNote = card.querySelector("[data-price-note]");
    const productImage = card.querySelector(".media-top img");
    const productTitle = card.querySelector("h3")?.textContent || "Produit";
    const previewKind = card.dataset.previewKind || inferProductPreviewKind(productTitle);
    let swatchContainer = null;

    if (colorSelect) {
      colorSelect.classList.add("variant-select");
      swatchContainer = document.createElement("div");
      swatchContainer.className = "variant-swatches";
      swatchContainer.setAttribute("role", "listbox");
      swatchContainer.setAttribute("aria-label", `Couleurs disponibles pour ${productTitle}`);

      Array.from(colorSelect.options).forEach((option, index) => {
        const swatchButton = document.createElement("button");
        swatchButton.type = "button";
        swatchButton.className = "color-swatch";
        swatchButton.dataset.swatchValue = option.value;
        swatchButton.dataset.swatchColor = resolveSwatchColor(option);
        swatchButton.title = option.dataset.label || option.textContent || option.value;
        swatchButton.setAttribute("aria-label", swatchButton.title);
        swatchButton.style.setProperty("--swatch-color", swatchButton.dataset.swatchColor);
        if (index === 0 || option.selected) {
          swatchButton.classList.add("is-active");
        }

        swatchButton.addEventListener("click", () => {
          colorSelect.value = option.value;
          colorSelect.dispatchEvent(new Event("change", { bubbles: true }));
          swatchContainer.querySelectorAll(".color-swatch").forEach((button) => {
            button.classList.toggle("is-active", button === swatchButton);
          });
        });

        swatchContainer.appendChild(swatchButton);
      });

      colorSelect.insertAdjacentElement("afterend", swatchContainer);
    }

    const updatePrice = () => {
      const colorOption = colorSelect?.selectedOptions?.[0] || null;
      const colorLabel = colorOption?.dataset.label || colorSelect?.value || "Standard";
      const colorSurcharge = parseNumber(colorOption?.dataset.surcharge, 0);
      const colorHex = resolveSwatchColor(colorOption);

      let computedPrice = basePrice + colorSurcharge;
      let detailLine = `Couleur choisie: ${colorLabel}`;
      let previewSizeLabel = "";

      if (priceMode === "window") {
        const sizeOption = sizeSelect?.selectedOptions?.[0] || null;
        const area = parseNumber(sizeOption?.dataset.area, 0.96);
        const normalizedArea = area / 0.96;
        computedPrice = basePrice * normalizedArea + colorSurcharge;
        detailLine = `Couleur ${colorLabel}${sizeSelect?.value ? ` · Dimension ${sizeSelect.value}` : ""}`;
        previewSizeLabel = sizeOption ? String(sizeOption.textContent || sizeSelect?.value || "") : "";
      }

      if (priceOutput) {
        priceOutput.textContent = formatPrice(computedPrice, priceSuffix);
      }

      if (priceNote) {
        priceNote.textContent = `${detailLine}. Les variantes plus techniques coûtent plus cher.`;
      }

      if (productImage) {
        productImage.src = buildProductPreview(
          previewKind,
          colorHex,
          colorLabel,
          previewSizeLabel,
        );
      }

      card.style.setProperty("--preview-accent", colorHex);
      card.style.setProperty("--preview-accent-soft", hexToRgba(colorHex, 0.16));
    };

    colorSelect?.addEventListener("change", updatePrice);
    sizeSelect?.addEventListener("change", updatePrice);
    updatePrice();
  });
}

function setupContactForm() {
  const form = document.querySelector("#contact-form");
  const success = document.querySelector("#contact-success");

  if (!form || !success) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.reset();
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "nearest" });

    window.setTimeout(() => {
      success.hidden = true;
    }, 3500);
  });
}

function setupReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((element) => observer.observe(element));
}

function setupProjectVideoModal() {
  const modal = document.querySelector("[data-project-video-modal]");
  const player = document.querySelector("[data-project-video-player]");
  const title = document.querySelector("[data-project-video-title]");
  const triggers = document.querySelectorAll("[data-video-src]");
  const closeButtons = document.querySelectorAll("[data-project-video-close]");

  if (!modal || !player || !title || !triggers.length) return;

  function closeModal() {
    player.pause();
    player.removeAttribute("src");
    player.load();
    modal.hidden = true;
    document.body.classList.remove("video-modal-open");
  }

  function openModal(trigger) {
    const src = trigger.dataset.videoSrc || "";
    const videoTitle = trigger.dataset.videoTitle || "Projet réalisé";
    if (!src) return;

    title.textContent = videoTitle;
    player.src = src;
    modal.hidden = false;
    document.body.classList.add("video-modal-open");
    player.play().catch(() => {});
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openModal(trigger));
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
}

function setupProjectVideoPreviews() {
  document.querySelectorAll(".project-video-trigger video:not([poster])").forEach((video) => {
    video.addEventListener(
      "loadedmetadata",
      () => {
        const targetTime = Math.min(1, Math.max(video.duration * 0.08, 0.2));
        if (Number.isFinite(targetTime)) {
          video.currentTime = targetTime;
        }
      },
      { once: true }
    );
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function setupAiPhotoAnalyzer() {
  const form = document.querySelector("#ai-photo-form");
  const previewWrap = document.querySelector("#ai-photo-preview-wrap");
  const preview = document.querySelector("#ai-photo-preview");
  const result = document.querySelector("#ai-photo-result");
  const fileInput = document.querySelector("#ai-photo-file");

  if (!form || !previewWrap || !preview || !result || !fileInput) return;

  const profiles = {
    cuisine: {
      label: "cuisine",
      zones: ["circulation", "eclairage", "rangements", "surfaces de travail"],
      services: ["Amenagement cuisine", "Renovation interieure"],
      materials: ["carrelage gres cerame premium", "peinture interieure premium"],
    },
    "salle-de-bain": {
      label: "salle de bain",
      zones: ["etancheite", "ventilation", "sanitaires", "finitions murales"],
      services: ["Amenagement salle de bain", "Renovation interieure"],
      materials: ["carrelage gres cerame premium", "isolation thermique ecologique"],
    },
    facade: {
      label: "facade",
      zones: ["microfissures", "etancheite", "isolation exterieure", "uniformite des finitions"],
      services: ["Renovation exterieure", "Ravalement de facade"],
      materials: ["enduit de facade", "isolation thermique ecologique"],
    },
    toiture: {
      label: "toiture",
      zones: ["points d'infiltration", "sous-couche", "ventilation de toiture", "vieillissement des tuiles"],
      services: ["Renovation exterieure", "Couverture et etancheite"],
      materials: ["tuiles terre cuite", "isolation thermique ecologique"],
    },
    fenetres: {
      label: "fenetres",
      zones: ["ponts thermiques", "joints", "acoustique", "performance de fermeture"],
      services: ["Renovation exterieure", "Pose de fenetres"],
      materials: ["fenetre PVC double vitrage", "fenetre aluminium sur mesure"],
    },
    autre: {
      label: "zone a diagnostiquer",
      zones: ["etat des supports", "finitions", "coherence technique", "priorites de securite"],
      services: ["Renovation interieure", "Diagnostic chantier"],
      materials: ["peinture interieure premium", "enduit de facade"],
    },
  };

  const issueMap = {
    humidite: "traces d'humidite ou de condensation",
    fissures: "fissures ou mouvements visibles",
    energie: "pertes de chaleur et confort thermique faible",
    finition: "finitions vieillissantes ou heterogenes",
    circulation: "implantation peu fonctionnelle",
    vieillissement: "materiaux en fin de cycle",
  };

  const issueWeights = {
    humidite: 2,
    fissures: 3,
    energie: 2,
    finition: 1,
    circulation: 1,
    vieillissement: 2,
  };

  fileInput.addEventListener("change", () => {
    const [file] = fileInput.files || [];
    if (!file) {
      previewWrap.hidden = true;
      preview.removeAttribute("src");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      preview.src = String(reader.result);
      previewWrap.hidden = false;
    });
    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const projectType = String(formData.get("project_type") || "autre");
    const objective = String(formData.get("objective") || "diagnostic");
    const urgency = String(formData.get("urgency") || "normale");
    const area = Number(formData.get("surface") || 0);
    const issues = formData.getAll("issues");
    const profile = profiles[projectType] || profiles.autre;

    const urgencyText = {
      basse: "planification souple sur quelques mois",
      normale: "demarrage souhaitable dans les prochaines semaines",
      haute: "traitement prioritaire recommande",
    };

    const objectiveText = {
      rafraichissement: "un rafraichissement cible avec impact visuel rapide",
      renovation: "une renovation plus complete et structuree",
      diagnostic: "un diagnostic technique avant arbitrage budgetaire",
    };

    const weightedIssues = issues.reduce((sum, key) => sum + (issueWeights[key] || 1), 0);
    const severityScore =
      weightedIssues + (urgency === "haute" ? 3 : urgency === "normale" ? 1 : 0) + (area > 100 ? 2 : area > 60 ? 1 : 0);

    const priority =
      severityScore >= 8
        ? "Priorite elevee"
        : severityScore >= 5
          ? "Priorite moyenne"
          : "Priorite de confort";

    const confidence = Math.max(62, Math.min(95, 66 + Math.round(severityScore * 2.8) + (issues.length >= 3 ? 5 : 0)));

    const observations = issues.length
      ? issues.map((issue) => issueMap[issue] || issue).join(", ")
      : "aucun symptome majeur coche, nous partons sur une lecture preventive";

    const recommendations = [
      `Verifier en premier ${profile.zones[0]} et ${profile.zones[1]}.`,
      `Votre objectif indique plutot ${objectiveText[objective]}.`,
      `Le niveau d'urgence correspond a ${urgencyText[urgency]}.`,
    ];

    const timeline = [
      "Phase 1 (0-7 jours): visite technique et validation des points critiques.",
      "Phase 2 (1-3 semaines): chiffrage detaille + choix techniques et materiaux.",
      "Phase 3: execution chantier selon priorites et planning valide.",
    ];

    if (issues.includes("humidite")) {
      recommendations.push("Prevoir un controle de ventilation, d'etancheite et des supports avant toute finition.");
    }
    if (issues.includes("energie")) {
      recommendations.push("Donner la priorite a l'isolation et au remplacement des menuiseries si necessaire.");
    }
    if (issues.includes("fissures")) {
      recommendations.push("Faire valider les fissures par une visite technique avant estimation definitive.");
    }

    const nextServices = profile.services
      .map((service) => `<li><span class="check">&#10003;</span><span>${service}</span></li>`)
      .join("");

    const nextMaterials = profile.materials
      .map((material) => `<li><span class="check">&#10003;</span><span>${material}</span></li>`)
      .join("");

    result.innerHTML = `
      <div class="tool-result-card">
        <span class="result-kicker">${priority}</span>
        <h3>Orientation pour votre ${profile.label}</h3>
        <p>
          D'apres les informations transmises, la zone semble relever de
          <strong>${objectiveText[objective]}</strong>, avec ${observations}.
        </p>
        <div class="result-tags">
          <span class="badge">Indice de confiance: ${confidence}%</span>
          <span class="badge">Niveau de risque: ${priority}</span>
          <span class="badge">Surface analysee: ${area || "non precisee"}${area ? " m2" : ""}</span>
        </div>
        <div class="tool-result-grid">
          <div>
            <h4>Points a verifier</h4>
            <ul class="feature-list">${recommendations
              .map((item) => `<li><span class="check">&#10003;</span><span>${item}</span></li>`)
              .join("")}</ul>
            <h4>Plan d'action propose</h4>
            <ul class="feature-list">${timeline
              .map((item) => `<li><span class="check">&#10003;</span><span>${item}</span></li>`)
              .join("")}</ul>
          </div>
          <div>
            <h4>Services ADAZ RENOV recommandes</h4>
            <ul class="feature-list">${nextServices}</ul>
            <h4>Materiaux a etudier</h4>
            <ul class="feature-list">${nextMaterials}</ul>
          </div>
        </div>
        <div class="result-note">
          Plus les informations sont precises (surface, contraintes, budget, delais), plus l'orientation devient fiable.
        </div>
      </div>
    `;

    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function setupAiMaterialAdvisor() {
  const form = document.querySelector("#ai-material-form");
  const result = document.querySelector("#ai-material-result");

  if (!form || !result) return;

  const catalog = [
    {
      name: "Fenetre PVC double vitrage",
      usage: ["fenetres"],
      priorities: ["budget", "isolation"],
      budgets: ["eco", "moyen"],
      strengths: ["isolation thermique", "rapport qualite/prix", "pose rapide"],
    },
    {
      name: "Fenetre aluminium sur mesure",
      usage: ["fenetres"],
      priorities: ["design", "durabilite"],
      budgets: ["moyen", "premium"],
      strengths: ["finesse des profils", "resistance", "look contemporain"],
    },
    {
      name: "Porte d'entree blindee",
      usage: ["portes"],
      priorities: ["durabilite", "isolation"],
      budgets: ["moyen", "premium"],
      strengths: ["protection", "isolation", "valorisation du bien"],
    },
    {
      name: "Porte interieure design",
      usage: ["portes", "interieur"],
      priorities: ["design", "budget"],
      budgets: ["eco", "moyen"],
      strengths: ["finitions variees", "integration simple", "cout contenu"],
    },
    {
      name: "Isolation thermique ecologique",
      usage: ["facade", "toiture"],
      priorities: ["isolation", "durabilite"],
      budgets: ["moyen", "premium"],
      strengths: ["performance thermique", "confort", "approche responsable"],
    },
    {
      name: "Enduit de facade",
      usage: ["facade"],
      priorities: ["design", "durabilite"],
      budgets: ["eco", "moyen"],
      strengths: ["protection exterieure", "uniformite", "resistance aux UV"],
    },
    {
      name: "Carrelage gres cerame premium",
      usage: ["interieur", "salle-de-bain", "cuisine"],
      priorities: ["durabilite", "design"],
      budgets: ["moyen", "premium"],
      strengths: ["resistance", "facilite d'entretien", "finitions premium"],
    },
    {
      name: "Parquet chene massif",
      usage: ["interieur"],
      priorities: ["design", "premium"],
      budgets: ["premium"],
      strengths: ["cachet", "durabilite", "valeur percue"],
    },
    {
      name: "Peinture interieure premium",
      usage: ["interieur", "cuisine", "salle-de-bain"],
      priorities: ["budget", "design"],
      budgets: ["eco", "moyen"],
      strengths: ["rafraichissement rapide", "large palette", "faibles emissions"],
    },
    {
      name: "Tuiles terre cuite",
      usage: ["toiture"],
      priorities: ["durabilite", "design"],
      budgets: ["moyen", "premium"],
      strengths: ["longue duree de vie", "esthetique traditionnelle", "fiabilite"],
    },
  ];

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const zone = String(formData.get("zone") || "interieur");
    const priority = String(formData.get("priority") || "design");
    const budget = String(formData.get("budget") || "moyen");
    const finish = String(formData.get("finish") || "equilibre");

    const scored = catalog
      .map((item) => {
        let score = 0;
        const reasons = [];

        if (item.usage.includes(zone)) {
          score += 3;
          reasons.push("compatible avec la zone du projet");
        }

        if (item.priorities.includes(priority)) {
          score += 2;
          reasons.push("aligne sur votre priorite technique");
        }

        if (item.budgets.includes(budget)) {
          score += 2;
          reasons.push("coherent avec votre niveau de budget");
        }

        if (finish === "premium" && item.budgets.includes("premium")) {
          score += 1;
          reasons.push("adapte a une finition premium");
        }

        if (finish === "equilibre" && item.budgets.includes("moyen")) {
          score += 1;
          reasons.push("equilibre cout / performance");
        }

        if (finish === "essentiel" && item.budgets.includes("eco")) {
          score += 1;
          reasons.push("optimise pour une finition essentielle");
        }

        const fit = Math.max(45, Math.min(98, 45 + score * 7));
        return { ...item, score, reasons, fit };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const strategy =
      priority === "isolation"
        ? "Priorisez les performances thermiques avant les finitions decoratives."
        : priority === "durabilite"
          ? "Favorisez des materiaux robustes avec entretien faible et cycle long."
          : priority === "budget"
            ? "Concentrez le budget sur les postes visibles et gardez des references fiables pour le reste."
            : "Misez sur la coherence visuelle entre revetements, menuiseries et quincaillerie.";

    result.innerHTML = `
      <div class="tool-result-card">
        <span class="result-kicker">Selection IA produits</span>
        <h3>Voici les produits les plus pertinents pour votre besoin</h3>
        <div class="recommendation-list">
          ${scored
            .map(
              (item, index) => `
                <article class="recommendation-card">
                  <div class="recommendation-rank">0${index + 1}</div>
                  <div>
                    <h4>${item.name}</h4>
                    <p>Indice de pertinence: <strong>${item.fit}%</strong>. ${item.reasons.slice(0, 2).join(" · ")}.</p>
                    <div class="tag-row">
                      ${item.strengths.map((strength) => `<span class="tag">${strength}</span>`).join("")}
                    </div>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
        <div class="result-note">
          Conseil IA: ${strategy} Ensuite, consultez le <a href="produits.html">catalogue produits</a> puis demandez un chiffrage avec pose.
        </div>
      </div>
    `;

    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function setupAiChatbot() {
  const form = document.querySelector("#ai-chat-form");
  const input = document.querySelector("#ai-chat-input");
  const log = document.querySelector("#ai-chat-log");
  const quickQuestions = document.querySelectorAll("[data-chat-question]");
  let userMessageCount = 0;
  let typingBubble = null;

  if (!form || !input || !log) return;

  const intents = [
    {
      keywords: ["devis", "prix", "cout", "combien", "tarif", "budget", "estimation"],
      answer:
        "Je peux vous guider vers une estimation orientative. Indiquez le service, la ville, la surface, l'etat actuel, le budget et le delai souhaite. Le prix final sera toujours confirme apres visite technique.",
    },
    {
      keywords: ["delai", "duree", "combien de temps", "temps", "planning", "date"],
      answer:
        "Le delai depend de la surface, de la complexite et des finitions. Dites-moi votre service + surface et je vous donne un delai indicatif realiste.",
    },
    {
      keywords: ["garantie", "assurance", "decennale", "sav", "qualite"],
      answer:
        "ADAZ RENOV met en avant la garantie decennale et une assurance responsabilite civile professionnelle sur les travaux realises.",
    },
    {
      keywords: ["paris", "france", "zone", "intervention", "ville", "deplacement"],
      answer:
        "Nous intervenons principalement en Ile-de-France. Envoyez votre ville/commune et je vous confirme rapidement la disponibilite.",
    },
    {
      keywords: ["contact", "telephone", "mail", "email", "numero"],
      answer:
        "Vous pouvez nous joindre via la page Contact, par telephone au +33 1 86 04 74 68 ou par email a adazrenov@gmail.com.",
    },
    {
      keywords: ["consultation", "programmation", "programmer", "rendez vous", "rdv", "reservation", "reserver"],
      answer:
        "Pour planifier une consultation, indiquez le type de travaux, la ville, la surface et un telephone. Je vous guide ensuite vers les dates disponibles.",
    },
    {
      keywords: ["materiau", "materiaux", "recommande", "recommandation", "fenetre", "cabine", "verre", "isolation"],
      answer:
        "Je peux recommander les materiaux selon votre projet (salle de bain, cuisine, facade, isolation), y compris les combinaisons salle de bain avec fenetre et cabine en verre.",
    },
  ];

  const serviceProfiles = [
    {
      name: "salle de bain",
      keywords: ["salle de bain", "bain"],
      minPerM2: 700,
      maxPerM2: 1400,
      minBase: 2800,
      maxBase: 5200,
      duration: "2 a 5 semaines",
    },
    {
      name: "cuisine",
      keywords: ["cuisine", "ilot", "plan de travail"],
      minPerM2: 650,
      maxPerM2: 1300,
      minBase: 3000,
      maxBase: 6000,
      duration: "3 a 6 semaines",
    },
    {
      name: "renovation interieure",
      keywords: ["renovation complete", "renovation", "interieur", "appartement"],
      minPerM2: 450,
      maxPerM2: 980,
      minBase: 3500,
      maxBase: 9000,
      duration: "1 a 4 mois",
    },
    {
      name: "facade",
      keywords: ["facade", "ravalement", "enduit"],
      minPerM2: 120,
      maxPerM2: 260,
      minBase: 2000,
      maxBase: 4800,
      duration: "1 a 3 semaines",
    },
    {
      name: "peinture",
      keywords: ["peinture", "peindre", "deco"],
      minPerM2: 45,
      maxPerM2: 120,
      minBase: 900,
      maxBase: 2200,
      duration: "3 a 10 jours",
    },
    {
      name: "installation electrique",
      keywords: ["electrique", "installation electrique", "tableau"],
      minPerM2: 90,
      maxPerM2: 220,
      minBase: 1500,
      maxBase: 4200,
      duration: "4 a 14 jours",
    },
  ];

  const siteProductKnowledge = [
    {
      name: "Fenetres PVC double vitrage",
      category: "fenetres",
      keywords: ["fenetre", "fenetres", "pvc", "isolation", "thermique", "bruit", "double vitrage"],
      bestFor: "isolation thermique, budget maitrise et remplacement rapide",
      pairsWith: ["volets roulants", "porte d'entree isolante", "isolation interieure"],
      sitePath: "produits.html",
    },
    {
      name: "Fenetres aluminium sur mesure",
      category: "fenetres",
      keywords: ["fenetre", "aluminium", "alu", "moderne", "baie", "sur mesure", "design"],
      bestFor: "style moderne, grands vitrages et profils fins",
      pairsWith: ["volets aluminium", "porte aluminium", "facade modernisee"],
      sitePath: "produits.html",
    },
    {
      name: "Portes d'entree",
      category: "portes",
      keywords: ["porte", "entree", "securite", "blindee", "isolation", "maison"],
      bestFor: "securite, isolation et premiere impression de la maison",
      pairsWith: ["fenetres assorties", "visiophone", "eclairage exterieur"],
      sitePath: "produits.html",
    },
    {
      name: "Volets",
      category: "volets",
      keywords: ["volet", "volets", "occultation", "soleil", "securite", "confort"],
      bestFor: "confort d'ete, securite et occultation",
      pairsWith: ["fenetres PVC ou aluminium", "motorisation", "isolation thermique"],
      sitePath: "produits.html",
    },
    {
      name: "Carrelage gres cerame",
      category: "interieur",
      keywords: ["carrelage", "sol", "cuisine", "salle de bain", "gres", "cerame"],
      bestFor: "cuisine, salle de bain, entretien facile et rendu durable",
      pairsWith: ["peinture lessivable", "plinthes assorties", "meuble sur mesure"],
      sitePath: "produits.html",
    },
    {
      name: "Peinture interieure premium",
      category: "interieur",
      keywords: ["peinture", "mur", "couleur", "deco", "decoration", "rafraichir"],
      bestFor: "rafraichissement rapide, finition propre et ambiance moderne",
      pairsWith: ["eclairage LED", "carrelage ou parquet", "portes interieures"],
      sitePath: "produits.html",
    },
    {
      name: "Isolation thermique",
      category: "isolation",
      keywords: ["isolation", "froid", "chaud", "energie", "thermique", "facade", "toiture"],
      bestFor: "confort, economie d'energie et valorisation du logement",
      pairsWith: ["fenetres double vitrage", "volets", "ravalement de facade"],
      sitePath: "services.html",
    },
  ];

  function formatMoney(value) {
    return `${Math.round(value).toLocaleString("fr-FR")} EUR`;
  }

  function detectSurface(question) {
    const match = normalizeText(question).match(/(\d{1,4})\s*(m2|m\s?2|m²|mp|metre|metres|metres carres)/);
    if (!match) return null;
    const value = Number.parseInt(match[1], 10);
    return Number.isFinite(value) ? value : null;
  }

  function getMaterialByServiceAnswer(question) {
    const normalized = normalizeText(question);
    const asksMaterial = ["materiau", "materiaux", "recommande", "recommandation", "que choisir", "que utiliser"].some((key) =>
      normalized.includes(key)
    );

    if (!asksMaterial) return null;

    if (normalized.includes("cuisine")) {
      return "Pour la cuisine, je recommande: carrelage gres cerame premium, plan de travail quartz ou granit, mobilier hydrofuge, peinture lavable premium et menuiserie performante si necessaire.";
    }

    if (normalized.includes("electri")) {
      return "Pour l'installation electrique, je recommande: cables certifies, tableau modulaire neuf, protections differentielles, prises IP44 pour zones humides et verification finale de securite.";
    }

    if (normalized.includes("facade") || normalized.includes("ravalement")) {
      return "Pour la facade, je recommande: enduit respirant, fixateur de fond, trame d'armature sur zones sensibles et peinture exterieure resistante aux UV.";
    }

    if (normalized.includes("renovation") || normalized.includes("interieur")) {
      return "Pour une renovation interieure, je recommande un mix equilibre: isolation thermique selon les besoins, carrelage/parquet premium selon la piece, et finitions lavables faciles a entretenir.";
    }

    return null;
  }

  function getSiteProductRecommendationAnswer(question) {
    const normalized = normalizeText(question);
    const asksProducts = [
      "produit",
      "produits",
      "recommande",
      "recommandes",
      "materiau",
      "materiaux",
      "site",
      "catalogue",
      "choisir",
      "changer",
      "isoler",
      "isolation",
      "fenetre",
      "porte",
      "volet",
      "carrelage",
    ].some((key) => normalized.includes(key));

    if (!asksProducts) return null;

    const scored = siteProductKnowledge
      .map((product) => {
        const score = product.keywords.reduce((acc, keyword) => (normalized.includes(normalizeText(keyword)) ? acc + 1 : acc), 0);
        return { ...product, score };
      })
      .filter((product) => product.score > 0)
      .sort((a, b) => b.score - a.score);

    const matches = scored.length ? scored.slice(0, 3) : siteProductKnowledge.slice(0, 3);

    const intro = scored.length
      ? "Je peux te recommander des produits deja coherents avec le site ADAZ RENOV:"
      : "Pour demarrer, je partirais sur ces produits ADAZ RENOV selon les besoins les plus frequents:";

    return `${intro}
${matches
  .map(
    (product, index) =>
      `${index + 1}. ${product.name}: ideal pour ${product.bestFor}. A combiner avec ${product.pairsWith.slice(0, 2).join(" + ")}.`
  )
  .join("\n")}
Prochaine etape: si tu me donnes la piece, la surface, le style et le budget, je peux transformer ca en selection plus precise.`;
  }

  function getKitchenIdeaAnswer(question) {
    const normalized = normalizeText(question);
    const isKitchen =
      normalized.includes("cuisine") ||
      normalized.includes("bucatarie") ||
      normalized.includes("bucătărie") ||
      normalized.includes("ilot") ||
      normalized.includes("plan de travail");

    const asksIdeas = ["idee", "idees", "idea", "design", "modern", "modifier", "modification", "changer", "renover", "refaire", "amenager"].some((key) =>
      normalized.includes(key)
    );

    if (!isKitchen || (!asksIdeas && !normalized.includes("ancienne"))) return null;

    const smallKitchen = ["petite", "mic", "mica", "etroit", "etroite", "studio"].some((key) => normalized.includes(key));
    const premium = ["premium", "haut de gamme", "luxe", "quartz", "marbre"].some((key) => normalized.includes(key));
    const storage = ["rangement", "depozitare", "placard", "dulap", "spatiu"].some((key) => normalized.includes(key));
    const appliance = ["machine a laver", "masina de spalat", "lave linge", "electromenager", "four", "frigo"].some((key) => normalized.includes(key));

    const layout = smallKitchen
      ? "implantation en L ou lineaire avec meubles hauts jusqu'au plafond, colonnes fines et table rabattable"
      : "implantation en L, U ou avec ilot selon les arrivées d'eau/electricite et la circulation";
    const materials = premium
      ? "plan de travail quartz ou compact, facades mates anti-traces, credence gres cerame grand format"
      : "plan de travail stratifié compact ou bois traite, credence facile a nettoyer, peinture lessivable";
    const storageIdea = storage
      ? "ajouter tiroirs casseroliers, colonne epicerie, meubles d'angle extractibles et niches ouvertes uniquement la ou c'est utile"
      : "garder une ligne simple: bas fermes, hauts legerement plus clairs, peu d'ouvertures pour eviter l'effet encombre";
    const applianceIdea = appliance
      ? "prevoir une vraie zone technique pour lave-linge/lave-vaisselle: arrivee d'eau accessible, siphon propre, prise protegee et ventilation"
      : "anticiper les appareils avant le design: frigo, plaque, hotte, four, lave-vaisselle et prises du plan de travail";

    return `Oui. Pour ta cuisine, je proposerais 3 pistes:
1. Fonctionnelle: ${layout}.
2. Moderne: couleurs claires, lignes droites, LED sous meubles hauts, poignees discretes ou gorges.
3. Durable: ${materials}.

Points importants:
- ${storageIdea}.
- ${applianceIdea}.
- Produits a regarder sur le site: carrelage gres cerame, peinture interieure premium, menuiseries/fenetres si la cuisine manque d'isolation.

Si tu m'ecris la surface, la forme de la cuisine, la couleur souhaitee et ce que tu veux garder, je peux te generer une idee beaucoup plus precise avec budget + etapes.`;
  }

  function getRepairSupportAnswer(question) {
    const normalized = normalizeText(question);
    const hasProblem = ["fuite", "coule", "panne", "casse", "stricat", "stricat", "reparer", "repare", "urgent", "ne marche", "nu merge", "bloque"].some((key) =>
      normalized.includes(key)
    );
    const washingMachine = ["machine a laver", "masina de spalat", "lave linge", "lave-linge", "vidange", "tambour"].some((key) =>
      normalized.includes(key)
    );
    const sink = ["evier", "chiuveta", "robinet", "siphon", "canalisation", "plomberie"].some((key) => normalized.includes(key));
    const electrical = ["prise", "courant", "electric", "disjoncteur", "siguranta", "scurt"].some((key) => normalized.includes(key));

    if (!hasProblem && !washingMachine && !sink && !electrical) return null;

    if (washingMachine || sink) {
      return `D'abord securite:
1. Coupe l'eau si ca fuit.
2. Debranche la machine si la zone est humide.
3. Ne relance pas un cycle tant que la fuite ou la vidange n'est pas comprise.

Diagnostic rapide:
- Si l'eau sort dessous: verifier tuyau d'arrivee, joint, filtre, evacuation et siphon.
- Si la machine ne vidange plus: verifier filtre de pompe, tuyau plie ou evacuation bouchee.
- Si l'evier refoule: probleme probable de siphon/canalisation, pas seulement machine.

ADAZAI peut aider a preparer l'intervention: plomberie, evacuation, prise protegee, meuble cuisine abime, sol/carrelage touche par l'eau. Pour la reparation interne de l'electromenager, il faut un technicien appareil; pour l'installation et les degats autour, ADAZ RENOV peut orienter les travaux.`;
    }

    if (electrical) {
      return `Attention securite electrique: coupe le disjoncteur de la zone si une prise chauffe, sent le brule, saute ou se trouve pres d'eau. Ne demonte pas sous tension.

ADAZAI recommande:
1. Identifier la piece et l'appareil concerne.
2. Noter si le disjoncteur saute immediatement ou apres utilisation.
3. Verifier s'il y a humidite, rallonge surchargee ou prise abimee.
4. Demander une verification electrique si le probleme revient.

Pour une cuisine ou salle de bain, on peut aussi proposer une mise aux normes des prises, circuits dedies et protections.`;
    }

    return `Je peux t'aider a faire un premier tri. Dis-moi: quelle piece, quel element est casse, depuis quand, s'il y a eau/electricite, et si le probleme est urgent. Je te donnerai les premiers gestes, les risques et le type d'intervention a prevoir.`;
  }

  function getChatGptIntegrationAnswer(question) {
    const normalized = normalizeText(question);
    const asksGpt = ["chatgpt", "gpt", "openai", "ai real", "integra", "integration"].some((key) => normalized.includes(key));
    if (!asksGpt) return null;

    return "Oui, on peut integrer ChatGPT en production. La bonne architecture est un backend securise (pas de cle OpenAI dans le navigateur): endpoint API + cle cote serveur + fallback local.";
  }

  function getChatConfig() {
    const root = window.AI_AISSTEN_CHAT_CONFIG || null;
    if (!root || typeof root !== "object") return null;
    return {
      apiUrl: String(root.apiUrl || ""),
      model: String(root.model || "gpt-4o-mini"),
    };
  }

  async function getRemoteChatAnswer(question) {
    const config = getChatConfig();
    if (!config || !config.apiUrl) return null;

    try {
      const response = await fetch(config.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
          model: config.model,
          context: "ADAZ RENOV chantier assistant",
          page: document.body.dataset.page || "",
          url: window.location.href,
        }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      const text = String(data.answer || data.message || data.output || "").trim();
      const nextConversationId = String(data.conversationId || "").trim();
      return text
        ? {
            answer: text,
            actions: Array.isArray(data.actions) ? data.actions : [],
            source: String(data.source || "backend"),
            conversationId: nextConversationId,
          }
        : null;
    } catch (error) {
      console.warn("Remote chat API unavailable, using local intents.", error);
      return null;
    }
  }

  function findServiceProfile(question) {
    const normalized = normalizeText(question);
    const scored = serviceProfiles
      .map((profile) => ({
        profile,
        score: profile.keywords.reduce((acc, keyword) => (normalized.includes(normalizeText(keyword)) ? acc + 1 : acc), 0),
      }))
      .sort((a, b) => b.score - a.score);

    return scored[0]?.score > 0 ? scored[0].profile : null;
  }

  function getBudgetEstimationAnswer(question) {
    const profile = findServiceProfile(question);
    if (!profile) return null;

    const surface = detectSurface(question);
    const minBudget = surface ? profile.minBase + surface * profile.minPerM2 : profile.minBase + 12 * profile.minPerM2;
    const maxBudget = surface ? profile.maxBase + surface * profile.maxPerM2 : profile.maxBase + 20 * profile.maxPerM2;

    return `Estimation rapide pour ${profile.name}${surface ? ` (${surface} m2)` : ""}: entre ${formatMoney(minBudget)} et ${formatMoney(maxBudget)}. Delai indicatif: ${profile.duration}. Si vous voulez, je vous aide ensuite a programmer une consultation.`;
  }

  function getBookingAnswer(question) {
    const normalized = normalizeText(question);
    const isBookingIntent = ["consultation", "program", "programm", "rendez vous", "rdv", "reservation", "calendrier"].some((key) => normalized.includes(key));
    if (!isBookingIntent) return null;

    const onAiPage = document.body.dataset.page === "ai";
    if (onAiPage) {
      return `Pour programmer une consultation: 1) ouvrez la section 'Programmation de consultation', 2) saisissez nom, telephone, service, 3) choisissez le creneau, 4) validez. Je peux aussi vous proposer quel service choisir avant la reservation.`;
    }

    return `Pour programmer une consultation, ouvrez la page IA Travaux puis la section programmation: ia-travaux.html#outil-programmation. Vous pourrez choisir un creneau libre et confirmer en 1 minute.`;
  }

  function getBathroomMaterialAnswer(question) {
    const normalized = normalizeText(question);
    const mentionsBathroom = normalized.includes("salle de bain");
    if (!mentionsBathroom) return null;

    const mentionsWindow = normalized.includes("fenetre");
    const mentionsGlassCabin =
      normalized.includes("cabine") || normalized.includes("verre");

    if (mentionsWindow && mentionsGlassCabin) {
      return "Pour une salle de bain avec fenetre + cabine en verre: fenetre PVC ou aluminium a isolation renforcee, vitrage securise anticalcaire pour la cabine, carrelage gres cerame antiderapant, peinture hydrofuge, et joints epoxy pour durabilite.";
    }

    if (mentionsWindow) {
      return "Pour une salle de bain avec fenetre: fenetre PVC double vitrage ou aluminium sur mesure, profil anti-condensation, carrelage gres cerame, peinture hydrofuge, ventilation efficace et etancheite premium.";
    }

    if (mentionsGlassCabin) {
      return "Pour une salle de bain avec cabine en verre: verre securise 8-10 mm, profil inox anti-corrosion, robinetterie thermostatique, sol antiderapant R10-R11 et murs avec finition hydrofuge.";
    }

    return "Pour la salle de bain, je recommande: carrelage gres cerame antiderapant, peinture hydrofuge, mobilier resistant a l'humidite, robinetterie economique et ventilation performante.";
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getGreetingAnswer(question, isFirstUserMessage) {
    const normalized = normalizeText(question);
    const greetingTokens = ["hey", "salut", "hello", "bonjour", "bonsoir"];
    const isGreeting = greetingTokens.some((token) => normalized.includes(token));
    if (!isGreeting) return null;

    if (isFirstUserMessage) {
      return "Bonjour ! Je suis ADAZAI, votre assistant personnel. Je peux vous aider avec :\n- une estimation orientative de budget ;\n- le choix des matériaux ;\n- les étapes de votre chantier ;\n- les services Adazrenov ;\n- la préparation d'une visite technique.\n\nDites-moi simplement quel projet vous souhaitez réaliser.";
    }

    return "Salut! Avec plaisir. Donnez-moi le type de travaux et la surface approximative, et je vous donne rapidement un budget indicatif et les prochaines etapes.";
  }

  function scrollToTool(selector) {
    const target = document.querySelector(selector);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.classList.add("tool-panel-pulse");
    window.setTimeout(() => target.classList.remove("tool-panel-pulse"), 1200);
  }

  function prefillEstimatorFromQuestion(question) {
    const normalized = normalizeText(question);
    const surface = detectSurface(question);
    const estimatorForm = document.querySelector("#ai-estimator-form");
    if (!estimatorForm) return;

    const typeSelect = estimatorForm.querySelector('[name="work_type"]');
    const surfaceInput = estimatorForm.querySelector('[name="surface"]');
    const finishSelect = estimatorForm.querySelector('[name="finish"]');

    if (typeSelect) {
      if (normalized.includes("salle de bain") || normalized.includes("bain")) typeSelect.value = "salle-de-bain";
      else if (normalized.includes("cuisine")) typeSelect.value = "cuisine";
      else if (normalized.includes("fenetre") || normalized.includes("fenetres")) typeSelect.value = "fenetres";
      else if (normalized.includes("porte")) typeSelect.value = "portes";
      else if (normalized.includes("electri")) typeSelect.value = "electricite";
      else if (normalized.includes("facade") || normalized.includes("ravalement")) typeSelect.value = "facade";
      else if (normalized.includes("toiture") || normalized.includes("toit")) typeSelect.value = "toiture";
      else if (normalized.includes("extension") || normalized.includes("construction")) typeSelect.value = "construction";
      else if (normalized.includes("amenagement")) typeSelect.value = "amenagement";
      else typeSelect.value = "interieur";
    }

    if (surfaceInput && surface) surfaceInput.value = String(surface);
    if (finishSelect) {
      if (normalized.includes("prestige")) finishSelect.value = "prestige";
      else if (normalized.includes("premium") || normalized.includes("haut de gamme")) finishSelect.value = "premium";
      else if (normalized.includes("essentiel") || normalized.includes("budget")) finishSelect.value = "essentiel";
    }
  }

  function runChatAction(action, question) {
    if (action === "estimate") {
      prefillEstimatorFromQuestion(question);
      scrollToTool("#outil-estimateur");
      return;
    }

    if (action === "materials") {
      scrollToTool("#outil-materiaux");
      return;
    }

    if (action === "roadmap") {
      scrollToTool("#outil-plan");
      return;
    }

    if (action === "booking") {
      scrollToTool("#outil-programmation");
      return;
    }

    if (action === "consultant") {
      scrollToTool("#outil-programmation");
      return;
    }

    if (action === "ideas") {
      scrollToTool("#outil-idees");
      return;
    }

    if (action === "products") {
      window.location.href = "produits.html";
    }

    if (action === "services") {
      window.location.href = "services.html";
    }
  }

  function getRecommendedActions(question) {
    const normalized = normalizeText(question);
    const actions = [];

    if (["prix", "cout", "combien", "budget", "estimation", "tarif"].some((key) => normalized.includes(key))) {
      actions.push({ label: "Ouvrir estimateur", action: "estimate" });
    }

    if (["cuisine", "bucatarie", "design", "idee", "idees", "modifier", "renover"].some((key) => normalized.includes(key))) {
      actions.push({ label: "Générer des idées", action: "ideas" });
    }

    if (["materiau", "materiaux", "fenetre", "carrelage", "isolation", "premium", "verre"].some((key) => normalized.includes(key))) {
      actions.push({ label: "Choisir materiaux", action: "materials" });
    }

    if (["produit", "produits", "catalogue", "porte", "volet"].some((key) => normalized.includes(key))) {
      actions.push({ label: "Voir produits", action: "products" });
    }

    if (["plan", "planning", "phase", "chantier", "delai", "duree"].some((key) => normalized.includes(key))) {
      actions.push({ label: "Creer plan", action: "roadmap" });
    }

    if (["rendez vous", "rdv", "consultation", "reservation", "reserver", "program"].some((key) => normalized.includes(key))) {
      actions.push({ label: "Programmer", action: "booking" });
    }

    if (["consultant", "conseiller", "parler", "telephone", "appel"].some((key) => normalized.includes(key))) {
      actions.push({ label: "Contacter consultant", action: "consultant" });
    }

    return actions.slice(0, 3);
  }

  function appendMessage(role, text, actions = [], sourceLabel = "", actionContext = text) {
    const bubble = document.createElement("div");
    bubble.className = `chat-message ${role}`;
    const source = sourceLabel ? `<span class="chat-source">${escapeHtml(sourceLabel)}</span>` : "";
    const actionHtml = actions.length
      ? `<div class="chat-action-row">${actions
          .map(
            (item) =>
              `<button type="button" data-chat-action="${escapeHtml(item.action)}" data-chat-context="${escapeHtml(actionContext)}">${escapeHtml(item.label)}</button>`
          )
          .join("")}</div>`
      : "";
    bubble.innerHTML = `${source}<p>${escapeHtml(text)}</p>${actionHtml}`;
    log.appendChild(bubble);
    bubble.querySelectorAll("[data-chat-action]").forEach((button) => {
      button.addEventListener("click", () => runChatAction(button.dataset.chatAction || "", button.dataset.chatContext || ""));
    });
    log.scrollTop = log.scrollHeight;
    return bubble;
  }

  function showTyping() {
    hideTyping();
    typingBubble = document.createElement("div");
    typingBubble.className = "chat-message assistant is-typing";
    typingBubble.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    log.appendChild(typingBubble);
    log.scrollTop = log.scrollHeight;
  }

  function hideTyping() {
    if (typingBubble) {
      typingBubble.remove();
      typingBubble = null;
    }
  }

  function getAnswer(question, isFirstUserMessage) {
    const greetingAnswer = getGreetingAnswer(question, isFirstUserMessage);
    if (greetingAnswer) return greetingAnswer;

    const gptIntegrationAnswer = getChatGptIntegrationAnswer(question);
    if (gptIntegrationAnswer) return gptIntegrationAnswer;

    const repairSupportAnswer = getRepairSupportAnswer(question);
    if (repairSupportAnswer) return repairSupportAnswer;

    const kitchenIdeaAnswer = getKitchenIdeaAnswer(question);
    if (kitchenIdeaAnswer) return kitchenIdeaAnswer;

    const productRecommendationAnswer = getSiteProductRecommendationAnswer(question);
    if (productRecommendationAnswer) return productRecommendationAnswer;

    const budgetAnswer = getBudgetEstimationAnswer(question);
    if (budgetAnswer) return budgetAnswer;

    const bookingAnswer = getBookingAnswer(question);
    if (bookingAnswer) return bookingAnswer;

    const bathroomMaterialAnswer = getBathroomMaterialAnswer(question);
    if (bathroomMaterialAnswer) return bathroomMaterialAnswer;

    const serviceMaterialAnswer = getMaterialByServiceAnswer(question);
    if (serviceMaterialAnswer) return serviceMaterialAnswer;

    const normalized = normalizeText(question);

    const scored = intents
      .map((intent) => {
        let score = 0;
        intent.keywords.forEach((keyword) => {
          const key = normalizeText(keyword);
          if (!key) return;
          if (normalized.includes(key)) {
            const occurrences = normalized.split(key).length - 1;
            score += key.includes(" ") ? 4 : 2;
            score += Math.min(occurrences - 1, 2);
          }
        });
        return { ...intent, score };
      })
      .sort((a, b) => b.score - a.score);

    const match = scored[0];
    const extraMatches = scored.filter((entry) => entry.score >= 2).slice(0, 3);

    if (extraMatches.length > 1) {
      const uniqueAnswers = [];
      extraMatches.forEach((entry) => {
        if (!uniqueAnswers.includes(entry.answer)) {
          uniqueAnswers.push(entry.answer);
        }
      });

      return uniqueAnswers.join(" ");
    }

    return (
      (match && match.score > 0 ? match.answer : null) ||
      "Je peux vous aider sur: 1) estimation orientative, 2) programmation de visite, 3) recommandations materiaux, 4) questions sur les services. Choisissez une action ou donnez-moi type de travaux + ville + surface."
    );
  }

  async function submitQuestion(question) {
    const clean = question.trim();
    if (!clean) return;
    const isFirstUserMessage = userMessageCount === 0;
    userMessageCount += 1;
    appendMessage("user", clean);
    showTyping();

    const localAnswer = getAnswer(clean, isFirstUserMessage);
    const remoteReply = await getRemoteChatAnswer(clean);
    const answer = remoteReply?.answer || localAnswer;
    const sourceLabel = remoteReply ? "Assistant ADAZAI" : "Mode assistant local";
    const remoteActions = Array.isArray(remoteReply?.actions)
      ? remoteReply.actions
          .filter((item) => item && item.label && item.action)
          .filter((item) => !["photo", "image"].includes(String(item.action).toLowerCase()))
          .map((item) => ({ label: String(item.label), action: String(item.action) }))
      : [];
    const actions = remoteActions.length ? remoteActions.slice(0, 3) : getRecommendedActions(clean);

    window.setTimeout(() => {
      hideTyping();
      appendMessage("assistant", answer, actions, sourceLabel, clean);
    }, 240);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitQuestion(input.value);
    input.value = "";
  });

  quickQuestions.forEach((button) => {
    button.addEventListener("click", () => {
      submitQuestion(button.dataset.chatQuestion || "");
    });
  });
}

function setupAiEstimator() {
  const form = document.querySelector("#ai-estimator-form");
  const result = document.querySelector("#ai-estimator-result");

  if (!form || !result) return;

  const profiles = {
    interieur: { label: "renovation interieure", min: 700, max: 1400, daysPer100: 42 },
    "salle-de-bain": { label: "salle de bain", min: 900, max: 1800, daysPer100: 60 },
    cuisine: { label: "cuisine sur mesure", min: 1200, max: 2500, daysPer100: 70 },
    fenetres: { label: "remplacement de fenetres", min: 420, max: 980, daysPer100: 18 },
    portes: { label: "remplacement de portes", min: 520, max: 1300, daysPer100: 16 },
    electricite: { label: "installation electrique", min: 90, max: 220, daysPer100: 28 },
    facade: { label: "renovation de facade", min: 130, max: 260, daysPer100: 24 },
    toiture: { label: "renovation de toiture", min: 180, max: 420, daysPer100: 34 },
    construction: { label: "construction ou extension", min: 1800, max: 3000, daysPer100: 120 },
    amenagement: { label: "amenagement sur mesure", min: 450, max: 980, daysPer100: 38 },
  };

  const complexityFactors = {
    simple: 0.92,
    standard: 1,
    complexe: 1.18,
  };

  const finishFactors = {
    essentiel: 0.93,
    equilibre: 1,
    premium: 1.2,
    prestige: 1.38,
  };

  const occupancyFactors = {
    libre: 1,
    occupe: 1.12,
  };

  const packageProfiles = {
    interieur: [
      { label: "Preparation & protection", share: 0.12 },
      { label: "Corps d'etat techniques", share: 0.38 },
      { label: "Finitions", share: 0.5 },
    ],
    "salle-de-bain": [
      { label: "Demolition & supports", share: 0.2 },
      { label: "Plomberie / etancheite", share: 0.42 },
      { label: "Finitions & equipements", share: 0.38 },
    ],
    cuisine: [
      { label: "Preparation reseaux", share: 0.22 },
      { label: "Mobilier & plan de travail", share: 0.48 },
      { label: "Pose & finitions", share: 0.3 },
    ],
    fenetres: [
      { label: "Releves & preparation", share: 0.18 },
      { label: "Menuiseries", share: 0.62 },
      { label: "Pose & finitions d'etancheite", share: 0.2 },
    ],
    portes: [
      { label: "Depose & preparation", share: 0.2 },
      { label: "Bloc porte / securite", share: 0.58 },
      { label: "Pose & reglages", share: 0.22 },
    ],
    electricite: [
      { label: "Diagnostic & securite", share: 0.2 },
      { label: "Tableau / circuits", share: 0.5 },
      { label: "Appareillage & verification", share: 0.3 },
    ],
    facade: [
      { label: "Preparation supports", share: 0.24 },
      { label: "Isolation / enduits", share: 0.52 },
      { label: "Finitions", share: 0.24 },
    ],
    toiture: [
      { label: "Diagnostic & securisation", share: 0.18 },
      { label: "Couverture / etancheite", share: 0.58 },
      { label: "Finitions & evacuation eaux", share: 0.24 },
    ],
    construction: [
      { label: "Gros oeuvre", share: 0.45 },
      { label: "Second oeuvre", share: 0.35 },
      { label: "Finitions", share: 0.2 },
    ],
    amenagement: [
      { label: "Conception / releves", share: 0.2 },
      { label: "Fabrication / pose", share: 0.55 },
      { label: "Reglages finaux", share: 0.25 },
    ],
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const type = String(formData.get("work_type") || "interieur");
    const area = Number(formData.get("surface") || 0);
    const complexity = String(formData.get("complexity") || "standard");
    const finish = String(formData.get("finish") || "equilibre");
    const occupancy = String(formData.get("occupancy") || "libre");
    const city = String(formData.get("city") || "").trim();
    const projectState = String(formData.get("project_state") || "renovation-complete");
    const deadline = String(formData.get("deadline") || "1-3-mois");
    const desiredBudget = String(formData.get("desired_budget") || "a-definir");

    const profile = profiles[type];
    const factor =
      (complexityFactors[complexity] || 1) *
      (finishFactors[finish] || 1) *
      (occupancyFactors[occupancy] || 1);

    const minBudget = Math.round(profile.min * area * factor);
    const maxBudget = Math.round(profile.max * area * factor);
    const baseDays = Math.max(8, Math.round((profile.daysPer100 / 100) * area));
    const durationMin = Math.max(1, Math.round(baseDays * 0.85));
    const durationMax = Math.max(durationMin + 3, Math.round(baseDays * factor * 1.12));
    const confidence = Math.max(64, Math.min(96, 70 + Math.round((area >= 40 ? 8 : 3) + (complexity === "standard" ? 4 : 1) - (occupancy === "occupe" ? 2 : 0))));

    const packs = (packageProfiles[type] || packageProfiles.interieur).map((pack) => ({
      ...pack,
      min: Math.round(minBudget * pack.share),
      max: Math.round(maxBudget * pack.share),
    }));

    const stateLabels = {
      "renovation-complete": "renovation complete",
      reparation: "reparation",
      montage: "montage / pose",
      remplacement: "remplacement",
    };

    const deadlineLabels = {
      urgent: "urgent",
      mois: "ce mois-ci",
      "1-3-mois": "dans 1 a 3 mois",
      "plus-tard": "plus tard",
    };

    const budgetLabels = {
      "a-definir": "a definir",
      "moins-5000": "moins de 5 000 EUR",
      "5000-15000": "5 000 - 15 000 EUR",
      "15000-40000": "15 000 - 40 000 EUR",
      "plus-40000": "plus de 40 000 EUR",
    };

    result.innerHTML = `
      <div class="tool-result-card">
        <span class="result-kicker">Estimation indicative</span>
        <h3>${profile.label.charAt(0).toUpperCase() + profile.label.slice(1)}</h3>
        <div class="estimate-strip">
          <div class="estimate-box">
            <span>Budget estime</span>
            <strong>${formatCurrency(minBudget)} - ${formatCurrency(maxBudget)}</strong>
          </div>
          <div class="estimate-box">
            <span>Duree probable</span>
            <strong>${durationMin} a ${durationMax} jours ouvres</strong>
          </div>
        </div>
        <div class="result-tags">
          <span class="badge">Indice de confiance: ${confidence}%</span>
          <span class="badge">Surface: ${area} m2</span>
          ${city ? `<span class="badge">Zone: ${escapeHtml(city)}</span>` : ""}
        </div>
        <h4>Repartition budgetaire proposee</h4>
        <ul class="feature-list">
          ${packs
            .map(
              (pack) =>
                `<li><span class="check">&#10003;</span><span>${pack.label}: <strong>${formatCurrency(pack.min)} - ${formatCurrency(pack.max)}</strong></span></li>`
            )
            .join("")}
        </ul>
        <ul class="feature-list">
          <li><span class="check">&#10003;</span><span>Complexite chantier: <strong>${complexity}</strong></span></li>
          <li><span class="check">&#10003;</span><span>Niveau de finition: <strong>${finish}</strong></span></li>
          <li><span class="check">&#10003;</span><span>Etat actuel: <strong>${escapeHtml(stateLabels[projectState] || projectState)}</strong></span></li>
          <li><span class="check">&#10003;</span><span>Budget client: <strong>${escapeHtml(budgetLabels[desiredBudget] || desiredBudget)}</strong></span></li>
          <li><span class="check">&#10003;</span><span>Delai souhaite: <strong>${escapeHtml(deadlineLabels[deadline] || deadline)}</strong></span></li>
          <li><span class="check">&#10003;</span><span>Logement: <strong>${occupancy === "occupe" ? "occupe pendant travaux" : "libre pendant travaux"}</strong></span></li>
        </ul>
        <div class="result-note">
          Cette estimation reste indicative. Pour une vraie offre commerciale, il faut une visite technique, des mesures, la verification de l'acces et un devis detaille.
        </div>
      </div>
    `;

    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function setupAiConceptIdeator() {
  const form = document.querySelector("#ai-concept-form");
  const result = document.querySelector("#ai-concept-result");

  if (!form || !result) return;

  const roomProfiles = {
    cuisine: {
      label: "cuisine",
      focus: ["ilot et plan de travail", "rangements haut/bas", "eclairage fonctionnel"],
    },
    "salle-de-bain": {
      label: "salle de bain",
      focus: ["etancheite + douche italienne", "rangements suspendus", "lumiere chaude"],
    },
    salon: {
      label: "salon / sejour",
      focus: ["mise en valeur du mur principal", "zones de circulation", "acoustique"],
    },
    facade: {
      label: "facade",
      focus: ["homogeneite des enduits", "menuiseries", "eclairage exterieur"],
    },
    chambre: {
      label: "chambre",
      focus: ["tete de lit", "rangement integre", "cloisonnement doux"],
    },
  };

  const styleProfiles = {
    moderne: {
      label: "moderne lumineux",
      signature: "lignes epurees, finitions mates, contrastes doux",
      materials: ["noir mat ou laiton", "bois clair", "beton cire / micro-mortier"],
      palette: ["#0f1f3a", "#1e3a5f", "#d4af7a", "#f1e4cf", "#f7f4ee"],
    },
    naturel: {
      label: "naturel / boise",
      signature: "textures vegetales, tons chauds, formes arrondies",
      materials: ["chene clair", "chanvre / lin", "gres cerame sable"],
      palette: ["#1f2c24", "#3d5a40", "#d4af7a", "#f2eadf", "#f7f4ee"],
    },
    haussmann: {
      label: "haussmann chic",
      signature: "moulures reinterpretees, laiton, marbre clair",
      materials: ["parquet chevron", "marbre clair", "laiton brosse"],
      palette: ["#1c2236", "#2f3f5e", "#d9c1a3", "#f6efe5", "#ede8dd"],
    },
    minimal: {
      label: "minimal / zen",
      signature: "volumes sobres, joints affleurants, alignements stricts",
      materials: ["bois blond", "acier fin", "peinture minérale mate"],
      palette: ["#111820", "#3a4a60", "#d5dbe6", "#eef2f6", "#f8f8f5"],
    },
  };

  const moodProfiles = {
    lumineux: { label: "lumineuse", accent: "blancs chauds et laiton clair" },
    chaleureux: { label: "chaleureuse", accent: "bois miel et textiles doux" },
    contrast: { label: "contrastee", accent: "accents noir carbone / bronze" },
    spa: { label: "apaisante", accent: "sauge, pierre claire et eclairage diffuse" },
  };

  const lightingProfiles = {
    lumineux: "spots encastres + rubans led chauds sous meubles", // quick lighting guidance per mood
    chaleureux: "appliques murales, temperature 3000K, dimmable",
    contrast: "mix rails noirs et suspensions graphiques",
    spa: "lumiere indirecte, niches led, etancheite IP44 en zone humide",
  };

  const budgetMaterials = {
    essentiel: "gamme standard durable (peinture lessivable, carrelage entry, robinetterie chrome)",
    equilibre: "mix premium sur les zones visibles, standard ailleurs (laiton brosse, gres cerame 60x60)",
    premium: "finition haut de gamme (pierre reconstituee, robinetterie design, quincaillerie laiton)",
  };

  const budgetProfiles = {
    essentiel: "solutions efficaces: facades peintes, revetements durables, mix gamme standard",
    equilibre: "mix produits premium sur les zones visibles et standard pour le reste",
    premium: "finitions haut de gamme, ferronnerie sur mesure et quincaillerie premium",
  };

  function renderPalette(colors) {
    return `
      <div class="palette-row">
        ${colors.map((color) => `<span class="palette-chip" style="background:${color}"></span>`).join("")}
      </div>
    `;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const room = String(formData.get("room") || "cuisine");
    const style = String(formData.get("style") || "moderne");
    const mood = String(formData.get("mood") || "lumineux");
    const budget = String(formData.get("budget") || "equilibre");
    const notes = String(formData.get("notes") || "").trim();

    const roomProfile = roomProfiles[room];
    const styleProfile = styleProfiles[style];
    const moodProfile = moodProfiles[mood];
    const budgetNote = budgetProfiles[budget];
    const lighting = lightingProfiles[mood];
    const materialNote = budgetMaterials[budget];

    if (!roomProfile || !styleProfile || !moodProfile || !budgetNote || !lighting || !materialNote) return;

    const ideas = [
      {
        title: "Piste fonctionnelle",
        points: [
          `Priorite: ${roomProfile.focus[0]} et ${roomProfile.focus[1]}.`,
          `Signature: ${styleProfile.signature}.`,
          `Ambiance ${moodProfile.label} avec ${moodProfile.accent}.`,
        ],
      },
      {
        title: "Piste signature",
        points: [
          `Materiaux phares: ${styleProfile.materials.join(", ")}.`,
          `Accent ${moodProfile.label}: ${roomProfile.focus[2]}.`,
          `Palette proposee adaptee au budget ${budget}.`,
        ],
      },
      {
        title: "Piste rapide",
        points: [
          `Travaux a fort impact visuel en ${roomProfile.label}: peinture / luminaire / quincaillerie modernisee.`,
          `${budgetNote} (${materialNote}).`,
          notes ? `A integrer: ${notes}.` : "Ajoutez vos envies pour affiner.",
        ],
      },
    ];

    result.innerHTML = `
      <div class="tool-result-card">
        <span class="result-kicker">Idees IA</span>
        <h3>3 pistes pour votre ${roomProfile.label}</h3>
        <p>Style ${styleProfile.label} · ambiance ${moodProfile.label} · budget ${budget}</p>
        <div class="result-tags">
          <span class="badge">${lighting}</span>
          <span class="badge">${materialNote}</span>
        </div>
        <div class="recommendation-list">
          ${ideas
            .map(
              (idea, index) => `
                <article class="recommendation-card">
                  <div class="recommendation-rank">0${index + 1}</div>
                  <div>
                    <h4>${idea.title}</h4>
                    <ul class="feature-list">${idea.points
                      .map((point) => `<li><span class="check">&#10003;</span><span>${point}</span></li>`)
                      .join("")}</ul>
                    <div class="tag-row">
                      ${styleProfile.materials
                        .slice(0, 3)
                        .map((material) => `<span class="tag">${material}</span>`)
                        .join("")}
                    </div>
                    ${renderPalette(styleProfile.palette)}
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
        <div class="result-note">Accent recommande: ${moodProfile.accent}. ${notes ? `Vos contraintes: ${notes}.` : "Ajoutez vos contraintes pour affiner."}</div>
      </div>
    `;

    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function setupAiRoadmapPlanner() {
  const form = document.querySelector("#ai-roadmap-form");
  const result = document.querySelector("#ai-roadmap-result");

  if (!form || !result) return;

  const profiles = {
    interieur: { label: "renovation interieure", baseDaysPer100: 42, risks: ["reseaux / electricite", "phases poussiereuses", "sequencage des corps d'etat"] },
    "salle-de-bain": { label: "salle de bain", baseDaysPer100: 58, risks: ["etancheite", "delai de livraison sanitaires", "coordination plomberie / elec"] },
    cuisine: { label: "cuisine", baseDaysPer100: 60, risks: ["reseaux cuisine", "ajustage mobilier", "ventilation"] },
    facade: { label: "facade", baseDaysPer100: 30, risks: ["meteo", "isolation exterieure", "finition uniforme"] },
    extension: { label: "extension / construction", baseDaysPer100: 120, risks: ["fondations", "structures porteuses", "coordination etancheite / isolation"] },
  };

  const scopeFactors = {
    rafraichissement: 0.8,
    renovation: 1,
    lourd: 1.22,
  };

  const urgencyFactors = {
    basse: 1,
    normale: 0.95,
    haute: 0.88,
  };

  const occupancyFactors = {
    libre: 1,
    occupe: 1.12,
  };

  const urgencyNotes = {
    basse: "planification souple, fenetre de lancement modulable",
    normale: "demarrage sous quelques semaines, planning standard",
    haute: "priorisation des phases critiques et chevauchement possible",
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const type = String(formData.get("type") || "interieur");
    const scope = String(formData.get("scope") || "renovation");
    const urgency = String(formData.get("urgency") || "normale");
    const occupancy = String(formData.get("occupancy") || "libre");
    const surface = Number(formData.get("surface") || 0);

    const profile = profiles[type];
    if (!profile || !surface) return;

    const factor = (scopeFactors[scope] || 1) * (occupancyFactors[occupancy] || 1);
    const base = Math.max(8, Math.round((profile.baseDaysPer100 / 100) * surface * factor));
    const adjusted = Math.max(8, Math.round(base * (urgencyFactors[urgency] || 1)));
    const buffer = Math.max(2, Math.round(adjusted * 0.08));

    const phases = [
      { label: "Diagnostic & planning", weight: 0.16, note: "releves, planning corps d'etat, jalons" },
      { label: "Reseaux / gros oeuvre", weight: 0.32, note: profile.risks[0] },
      { label: "Second oeuvre", weight: 0.28, note: profile.risks[1] },
      { label: "Finitions & controles", weight: 0.24, note: profile.risks[2] },
    ];

    const timeline = phases.map((phase) => {
      const days = Math.max(2, Math.round(adjusted * phase.weight));
      return { ...phase, days };
    });

    const totalDays = timeline.reduce((acc, item) => acc + item.days, 0);
    const criticalRisks = profile.risks.slice(0, 2).join(" · ");

    result.innerHTML = `
      <div class="tool-result-card">
        <span class="result-kicker">Plan IA</span>
        <h3>${profile.label.charAt(0).toUpperCase() + profile.label.slice(1)}</h3>
        <div class="estimate-strip">
          <div class="estimate-box">
            <span>Duree indicative</span>
            <strong>${totalDays} jours ouvres</strong>
          </div>
          <div class="estimate-box">
            <span>Mode chantier</span>
            <strong>${scope} · ${occupancy === "occupe" ? "occupe" : "libre"}</strong>
          </div>
          <div class="estimate-box">
            <span>Marge securite</span>
            <strong>${buffer} jours (imprevus)</strong>
          </div>
        </div>
        <div class="phase-list">
          ${timeline
            .map(
              (phase) => `
                <div class="phase-step">
                  <strong>${phase.label}</strong>
                  <div class="phase-meta">${phase.days} jours · ${phase.note}</div>
                </div>
              `
            )
            .join("")}
        </div>
        <ul class="feature-list" style="margin-top:16px;">
          <li><span class="check">&#10003;</span><span>Urgence: ${urgencyNotes[urgency]}</span></li>
          <li><span class="check">&#10003;</span><span>Risques prioritaires: ${profile.risks.join(", ")}.</span></li>
          <li><span class="check">&#10003;</span><span>Étape critique: ${criticalRisks}.</span></li>
          <li><span class="check">&#10003;</span><span>Surface declaree: ${surface} m2, a ajuster apres visite.</span></li>
        </ul>
        <div class="result-note">Ce plan est indicatif. Une visite technique permettra de verrouiller les jalons, les acces et la logistique.</div>
      </div>
    `;

    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

const aiBookingState = {
  firebase: null,
  firebaseLoading: null,
  slots: [],
  selectedSlotId: "",
};

function getAiBookingConfig() {
  return window.AI_AISSTEN_BOOKING_CONFIG || {};
}

function getAiFirebaseConfig() {
  return window.AI_AISSTEN_FIREBASE_CONFIG || null;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatBookingSlot(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatBookingDateOnly(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(date);
}

function toIcsStamp(date) {
  return new Date(date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function buildFallbackBookingSlots(count = 6) {
  const slots = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);
  startDate.setHours(0, 0, 0, 0);

  for (let offset = 0; slots.length < count && offset < 14; offset += 1) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + offset);

    if (day.getDay() === 0) continue;

    [9, 11, 14, 16].forEach((hour, index) => {
      if (slots.length >= count) return;

      const start = new Date(day);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 60);

      slots.push({
        id: `demo-${start.toISOString()}`,
        start,
        end,
        service: index === 0 ? "Consultation" : "Disponible",
        advisor: "ADAZ RENOV",
        source: "demo",
      });
    });
  }

  return slots;
}

async function getFirebaseBookingApi() {
  const config = getAiFirebaseConfig();
  if (!config) return null;

  if (aiBookingState.firebase) return aiBookingState.firebase;
  if (aiBookingState.firebaseLoading) return aiBookingState.firebaseLoading;

  aiBookingState.firebaseLoading = (async () => {
    const appModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
    const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");

    const app = appModule.getApps().length ? appModule.getApp() : appModule.initializeApp(config);

    aiBookingState.firebase = {
      app,
      db: firestoreModule.getFirestore(app),
      collection: firestoreModule.collection,
      getDocs: firestoreModule.getDocs,
      addDoc: firestoreModule.addDoc,
      doc: firestoreModule.doc,
      setDoc: firestoreModule.setDoc,
      onSnapshot: firestoreModule.onSnapshot,
      query: firestoreModule.query,
      where: firestoreModule.where,
      orderBy: firestoreModule.orderBy,
      limit: firestoreModule.limit,
      serverTimestamp: firestoreModule.serverTimestamp,
    };

    return aiBookingState.firebase;
  })();

  return aiBookingState.firebaseLoading;
}

function buildAvailabilitySlotFromDoc(documentSnapshot) {
  const data = documentSnapshot.data();
  const rawStart = data.startAt || data.start || data.date;
  const rawEnd = data.endAt || data.end;
  const start = rawStart?.toDate ? rawStart.toDate() : new Date(rawStart);
  const end = rawEnd?.toDate ? rawEnd.toDate() : new Date(rawEnd || start.getTime() + 60 * 60 * 1000);

  if (Number.isNaN(start.getTime())) return null;

  return {
    id: documentSnapshot.id,
    start,
    end: Number.isNaN(end.getTime()) ? new Date(start.getTime() + 60 * 60 * 1000) : end,
    service: data.service || data.label || "Consultation",
    advisor: data.advisor || data.name || "ADAZ RENOV",
    source: data.source || "firebase",
  };
}

async function loadAiBookingSlots() {
  const config = getAiBookingConfig();
  const maxSlots = Math.max(3, Number(config.slotCount || 6));
  const slots = [];

  if (config.availabilityApiUrl) {
    try {
      const response = await fetch(`${config.availabilityApiUrl}?limit=${maxSlots}`);
      if (response.ok) {
        const payload = await response.json();
        const apiSlots = Array.isArray(payload?.slots) ? payload.slots : [];
        apiSlots.forEach((slot) => {
          const start = new Date(slot.start);
          const end = new Date(slot.end || new Date(start).getTime() + 60 * 60 * 1000);
          if (!Number.isNaN(start.getTime())) {
            slots.push({
              id: String(slot.id || `api-${start.toISOString()}`),
              start,
              end,
              service: String(slot.service || "Consultation"),
              advisor: String(slot.advisor || "ADAZ RENOV"),
              source: "api",
            });
          }
        });
      }
    } catch (error) {
      console.warn("Availability API unavailable, falling back to Firebase/demo slots.", error);
    }
  }

  const firebase = slots.length ? null : await getFirebaseBookingApi();

  if (firebase) {
    try {
      const collectionName = config.availabilityCollection || "aiAvailabilitySlots";
      const snapshot = await firebase.getDocs(
        firebase.query(firebase.collection(firebase.db, collectionName), firebase.where("status", "==", "open"))
      );

      snapshot.forEach((documentSnapshot) => {
        const slot = buildAvailabilitySlotFromDoc(documentSnapshot);
        if (slot) slots.push(slot);
      });
    } catch (error) {
      console.warn("Firebase slots unavailable, falling back to demo slots.", error);
    }
  }

  if (!slots.length) {
    slots.push(...buildFallbackBookingSlots(maxSlots));
  }

  return slots
    .sort((left, right) => left.start.getTime() - right.start.getTime())
    .slice(0, maxSlots);
}

async function watchAiBookingSlots(onSlots) {
  const config = getAiBookingConfig();
  const firebase = await getFirebaseBookingApi();
  if (!firebase || typeof firebase.onSnapshot !== "function") return null;

  const maxSlots = Math.max(3, Number(config.slotCount || 6));
  const collectionName = config.availabilityCollection || "aiAvailabilitySlots";
  const queryRef = firebase.query(firebase.collection(firebase.db, collectionName), firebase.where("status", "==", "open"));

  return firebase.onSnapshot(
    queryRef,
    (snapshot) => {
      const slots = [];
      snapshot.forEach((documentSnapshot) => {
        const slot = buildAvailabilitySlotFromDoc(documentSnapshot);
        if (slot && slot.start > new Date()) slots.push(slot);
      });

      onSlots(
        slots
          .sort((left, right) => left.start.getTime() - right.start.getTime())
          .slice(0, maxSlots)
      );
    },
    (error) => {
      console.warn("Realtime Firebase availability unavailable.", error);
    }
  );
}

function buildGoogleCalendarUrl(slot, data) {
  const start = toIcsStamp(slot.start).replace(/[-:]/g, "");
  const end = toIcsStamp(slot.end).replace(/[-:]/g, "");
  const text = encodeURIComponent(`ADAZ RENOV - Consultation ${data.service}`);
  const details = encodeURIComponent(
    `Client: ${data.firstname} ${data.lastname}\nTelephone: ${data.phone}\nEmail: ${data.email || "non precise"}\nNotes: ${data.notes || "Aucune"}`
  );
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${encodeURIComponent("ADAZ RENOV")}`;
}

function buildIcsContent(slot, data) {
  const uid = `${slot.id || slot.start.getTime()}@adazrenov.fr`;
  const summary = `ADAZ RENOV - Consultation ${data.service}`;
  const description = [`Client: ${data.firstname} ${data.lastname}`, `Telephone: ${data.phone}`, `Email: ${data.email || "non precise"}`, `Notes: ${data.notes || "Aucune"}`].join("\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ADAZ RENOV//Assistant ADAZ RENOV//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsStamp(new Date())}`,
    `DTSTART:${toIcsStamp(slot.start)}`,
    `DTEND:${toIcsStamp(slot.end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    "LOCATION:ADAZ RENOV",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function setupAiBookingPlanner() {
  const form = document.querySelector("#ai-booking-form");
  const slotList = document.querySelector("#ai-slot-list");
  const slotInput = document.querySelector("#ai-booking-slot");
  const result = document.querySelector("#ai-booking-result");

  if (!form || !slotList || !slotInput || !result) return;

  async function renderSlots() {
    const slots = aiBookingState.slots.length ? aiBookingState.slots : await loadAiBookingSlots();
    aiBookingState.slots = slots;
    if (!aiBookingState.selectedSlotId || !slots.some((slot) => slot.id === aiBookingState.selectedSlotId)) {
      aiBookingState.selectedSlotId = slots[0]?.id || "";
    }
    slotInput.value = aiBookingState.selectedSlotId;

    slotList.innerHTML = slots
      .map((slot) => {
        const active = slot.id === aiBookingState.selectedSlotId ? "is-active" : "";
        return `
          <button type="button" class="slot-pill ${active}" data-slot-id="${escapeHtml(slot.id)}">
            <strong>${escapeHtml(formatBookingDateOnly(slot.start))}</strong>
            <span>${escapeHtml(formatBookingSlot(slot.start))}</span>
            <small>${escapeHtml(slot.service)} · ${escapeHtml(slot.advisor)}</small>
          </button>
        `;
      })
      .join("");

    slotList.querySelectorAll("[data-slot-id]").forEach((button) => {
      button.addEventListener("click", () => {
        aiBookingState.selectedSlotId = button.dataset.slotId || "";
        slotInput.value = aiBookingState.selectedSlotId;
        renderSlots();
      });
    });
  }

  loadAiBookingSlots().then((slots) => {
    aiBookingState.slots = slots;
    renderSlots();
  });

  watchAiBookingSlots((slots) => {
    if (!slots.length) return;
    aiBookingState.slots = slots;
    if (!slots.some((slot) => slot.id === aiBookingState.selectedSlotId)) {
      aiBookingState.selectedSlotId = slots[0]?.id || "";
    }
    renderSlots();
  }).then((unsubscribe) => {
    if (typeof unsubscribe === "function") {
      window.addEventListener("beforeunload", unsubscribe, { once: true });
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const slotId = String(formData.get("slot") || aiBookingState.selectedSlotId || "");
    const slot = aiBookingState.slots.find((entry) => entry.id === slotId) || aiBookingState.slots[0];

    if (!slot) {
      result.innerHTML = `<div class="tool-result-card"><h3>Aucun créneau disponible</h3><p>Rechargez la liste des dates ou ajoutez des disponibilités dans Firebase.</p></div>`;
      result.hidden = false;
      return;
    }

    const payload = {
      firstname: String(formData.get("firstname") || "").trim(),
      lastname: String(formData.get("lastname") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      service: String(formData.get("service") || ""),
      calendarMode: String(formData.get("calendar_mode") || "google"),
      notes: String(formData.get("notes") || "").trim(),
      slotId: slot.id,
      slotStart: slot.start.toISOString(),
      slotEnd: slot.end.toISOString(),
    };

    const bookingConfig = getAiBookingConfig();
    let bookingSource = slot.source === "firebase" ? "Firebase" : "aperçu local";

    if (bookingConfig.bookingApiUrl) {
      try {
        const response = await fetch(bookingConfig.bookingApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          bookingSource = "API calendrier";
        } else if (response.status === 409) {
          result.innerHTML = `<div class="tool-result-card"><h3>Creneau deja reserve</h3><p>Ce creneau n'est plus disponible. Choisissez une autre date dans la liste.</p></div>`;
          result.hidden = false;
          aiBookingState.slots = [];
          renderSlots();
          return;
        }
      } catch (error) {
        console.warn("Booking API unavailable, trying Firebase fallback.", error);
      }
    }

    if (bookingSource !== "API calendrier") {
      const firebase = await getFirebaseBookingApi();
      if (firebase) {
        try {
          const collectionName = bookingConfig.appointmentsCollection || "aiAppointments";
          const appointmentRef = await firebase.addDoc(firebase.collection(firebase.db, collectionName), {
            ...payload,
            status: "pending",
            createdAt: firebase.serverTimestamp(),
          });
          if (slot.source === "firebase" && firebase.doc && firebase.setDoc) {
            const slotRef = firebase.doc(firebase.db, bookingConfig.availabilityCollection || "aiAvailabilitySlots", slot.id);
            await firebase.setDoc(
              slotRef,
              {
                status: "booked",
                appointmentId: appointmentRef.id,
                bookedAt: firebase.serverTimestamp(),
              },
              { merge: true }
            );
          }
          bookingSource = "Firebase";
        } catch (error) {
          console.warn("Could not save booking to Firebase.", error);
          bookingSource = "aperçu local";
        }
      }
    }

    const googleUrl = buildGoogleCalendarUrl(slot, payload);
    const icsContent = buildIcsContent(slot, payload);

    result.innerHTML = `
      <div class="tool-result-card">
        <span class="result-kicker">Demande de consultation</span>
        <h3>Programmation preparee</h3>
        <p>
          Merci ${escapeHtml(payload.firstname)} ${escapeHtml(payload.lastname)}. Nous avons prepare
          votre demande pour ${escapeHtml(payload.service)} le ${escapeHtml(formatBookingSlot(slot.start))}.
        </p>
        <div class="estimate-strip">
          <div class="estimate-box">
            <span>Telephone</span>
            <strong>${escapeHtml(payload.phone)}</strong>
          </div>
          <div class="estimate-box">
            <span>Source de reservation</span>
            <strong>${escapeHtml(bookingSource)}</strong>
          </div>
          <div class="estimate-box">
            <span>Canal calendrier</span>
            <strong>${escapeHtml(payload.calendarMode)}</strong>
          </div>
        </div>
        <div class="booking-actions">
          <a class="button small secondary" href="${googleUrl}" target="_blank" rel="noreferrer">Ouvrir Google Calendar</a>
          <button class="button small light" type="button" data-download-ics>Télécharger Apple Calendar</button>
        </div>
        <div class="result-note">Votre demande peut ensuite etre reliee a Firebase, puis synchronisee avec Google Calendar et importee dans Apple Calendar via le fichier .ics.</div>
      </div>
    `;

    result.hidden = false;

    const downloadButton = result.querySelector("[data-download-ics]");
    if (downloadButton) {
      downloadButton.addEventListener("click", () => {
        const safeDate = slot.start.toISOString().slice(0, 10);
        downloadTextFile(`adaz-renov-consultation-${safeDate}.ics`, icsContent, "text/calendar;charset=utf-8");
      });
    }

    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function setupGlobalAdazaiWidget() {
  if (document.querySelector(".adazai-widget")) return;

  const CHAT_CONFIG = {
    links: {
      // Update these paths if the site routes change.
      services: "services.html",
      realisations: "projets.html",
      produits: "produits.html",
      aPropos: "a-propos.html",
      contact: "contact.html",
    },
    estimateRanges: {
      salleDeBain: "4 500 € à 18 000 € ou plus",
      cuisine: "5 000 € à 25 000 € ou plus",
      renovationInterieure: "80 € à 900 € par m²",
      renovationExterieure: "à partir de 1 500 €",
      fenetresSupply: "350 € à 900 € par fenêtre",
      fenetresSupplyPose: "600 € à 1 500 € ou plus par fenêtre",
      portesInterieures: "250 € à 800 € par porte intérieure",
      portesEntreePremium: "plus de 1 500 € par porte d’entrée premium ou sur mesure avec pose",
    },
    disclaimer:
      "Le prix indiqué est une estimation indicative. Le tarif final dépend de l’état actuel du chantier, des dimensions exactes, des matériaux choisis et des contraintes techniques.",
    menuMessage:
      "Bonjour 👋 Je suis Assistant Construction, l’assistant virtuel Adazrenov.\n\nJe peux vous aider à découvrir nos projets, nos produits premium, obtenir une estimation de budget ou trouver les bonnes informations pour votre chantier en France.\n\nQue souhaitez-vous faire ?",
    menuReplies: [
      { label: "Obtenir une estimation", action: "estimate" },
      { label: "Voir nos services", action: "services" },
      { label: "Voir nos réalisations", action: "realisations" },
      { label: "Produits premium", action: "products" },
      { label: "Découvrir Adazrenov", action: "about" },
      { label: "Demander un rappel", action: "lead" },
    ],
  };

  const estimateFlows = {
    bathroom: {
      selectedCategory: "Salle de bain",
      intro:
        "Très bon choix. Pour estimer une rénovation de salle de bain, nous allons préciser la surface, le type de travaux et le niveau de finition souhaité.",
      questions: [
        {
          key: "selectedSurface",
          text: "Quelle est la surface approximative de votre salle de bain ?",
          options: ["Moins de 4 m²", "4 à 6 m²", "6 à 10 m²", "10 à 15 m²", "Plus de 15 m²"],
        },
        {
          key: "selectedWorkType",
          text: "Quel type de rénovation souhaitez-vous ?",
          options: ["Rafraîchissement simple", "Rénovation standard", "Rénovation complète", "Salle de bain premium", "Je ne sais pas encore"],
        },
        {
          key: "selectedServiceType",
          text: "Souhaitez-vous modifier la plomberie ou garder l’emplacement actuel ?",
          options: ["Garder l’emplacement actuel", "Modifier la plomberie", "Ajouter une douche italienne", "Ajouter baignoire / meuble / WC", "Je ne sais pas"],
        },
      ],
      result: () =>
        `Merci pour vos réponses. Pour ce type de salle de bain, le budget estimatif peut commencer autour de ${CHAT_CONFIG.estimateRanges.salleDeBain} selon les matériaux, la plomberie et les finitions.\n\nLe prix exact pourra être confirmé après analyse du projet et des détails techniques.\n\n${CHAT_CONFIG.disclaimer}\n\nSouhaitez-vous que l’équipe Adazrenov vous contacte pour une estimation personnalisée ?`,
      replies: [
        { label: "Oui, je souhaite être rappelé", action: "lead" },
        { label: "Voir des réalisations salle de bain", action: "link", url: "realisations" },
        { label: "Retour au menu", action: "menu" },
      ],
    },
    kitchen: {
      selectedCategory: "Cuisine",
      intro:
        "Parfait 😊 Pour une cuisine, l’estimation dépend surtout de la surface, des finitions, des meubles, du plan de travail et des éventuelles modifications techniques.",
      questions: [
        {
          key: "selectedSurface",
          text: "Quelle est la surface approximative de votre cuisine ?",
          options: ["Moins de 6 m²", "6 à 10 m²", "10 à 15 m²", "15 à 25 m²", "Plus de 25 m²"],
        },
        {
          key: "selectedWorkType",
          text: "Quel type de projet souhaitez-vous ?",
          options: ["Rafraîchir la cuisine", "Remplacer les meubles", "Rénovation complète", "Cuisine premium sur mesure", "Je ne sais pas encore"],
        },
        {
          key: "selectedServiceType",
          text: "Faut-il modifier l’électricité, la plomberie ou l’agencement ?",
          options: ["Non, juste les finitions", "Oui, électricité", "Oui, plomberie", "Oui, agencement complet", "Je ne sais pas"],
        },
      ],
      result: () =>
        `Merci. Pour une cuisine de ce type, le budget estimatif peut commencer autour de ${CHAT_CONFIG.estimateRanges.cuisine} pour une cuisine premium ou sur mesure.\n\nLe montant final dépendra du mobilier, du plan de travail, des matériaux, des raccordements et du niveau de finition.\n\n${CHAT_CONFIG.disclaimer}\n\nSouhaitez-vous être rappelé par notre équipe pour affiner cette estimation ?`,
      replies: [
        { label: "Oui, je souhaite être rappelé", action: "lead" },
        { label: "Voir des réalisations cuisine", action: "link", url: "realisations" },
        { label: "Retour au menu", action: "menu" },
      ],
    },
    interior: {
      selectedCategory: "Rénovation intérieure",
      intro:
        "Très bien. Nous pouvons vous accompagner pour des travaux intérieurs : peinture, sols, carrelage, cloisons, finitions, électricité, plomberie ou rénovation complète.",
      questions: [
        {
          key: "selectedServiceType",
          text: "Quel espace souhaitez-vous rénover ?",
          options: ["Une chambre", "Un salon", "Un appartement", "Une maison", "Plusieurs pièces"],
        },
        {
          key: "selectedSurface",
          text: "Quelle est la surface approximative à rénover ?",
          options: ["Moins de 20 m²", "20 à 50 m²", "50 à 80 m²", "80 à 120 m²", "Plus de 120 m²"],
        },
        {
          key: "selectedFinishLevel",
          text: "Quel niveau de travaux souhaitez-vous ?",
          options: ["Peinture uniquement", "Sols et peinture", "Rénovation standard", "Rénovation complète", "Projet premium"],
        },
      ],
      result: () =>
        `Merci. Pour une rénovation intérieure, le budget estimatif peut varier entre ${CHAT_CONFIG.estimateRanges.renovationInterieure} selon le niveau de travaux, les matériaux et les finitions.\n\nPour une estimation plus précise, notre équipe peut vous recontacter et analyser votre projet en détail.\n\n${CHAT_CONFIG.disclaimer}`,
      replies: [
        { label: "Oui, je souhaite être rappelé", action: "lead" },
        { label: "Voir nos services intérieurs", action: "link", url: "services" },
        { label: "Retour au menu", action: "menu" },
      ],
    },
    exterior: {
      selectedCategory: "Rénovation extérieure",
      intro:
        "Pour les travaux extérieurs, chaque projet dépend beaucoup de l’état actuel, de l’accès au chantier et du type de finition souhaité. Je vais vous guider rapidement.",
      questions: [
        {
          key: "selectedWorkType",
          text: "Quel type de travaux extérieurs souhaitez-vous ?",
          options: ["Façade", "Terrasse", "Entrée / allée", "Mur / clôture", "Autre extérieur"],
        },
        {
          key: "selectedSurface",
          text: "Quelle est la surface approximative ?",
          options: ["Moins de 20 m²", "20 à 50 m²", "50 à 100 m²", "100 à 200 m²", "Plus de 200 m²"],
        },
        {
          key: "selectedFinishLevel",
          text: "Quel niveau de finition recherchez-vous ?",
          options: ["Simple et efficace", "Standard durable", "Finition premium", "Projet sur mesure", "Je ne sais pas"],
        },
      ],
      result: () =>
        `Merci. Pour ce type de travaux extérieurs, le budget estimatif peut commencer autour de ${CHAT_CONFIG.estimateRanges.renovationExterieure} et varier fortement selon la surface, l’accès, les matériaux et l’état actuel.\n\nPour ce type de projet, nous vous recommandons un échange avec notre équipe afin de vérifier les détails techniques.\n\n${CHAT_CONFIG.disclaimer}`,
      replies: [
        { label: "Être rappelé", action: "lead" },
        { label: "Voir les réalisations", action: "link", url: "realisations" },
        { label: "Retour au menu", action: "menu" },
      ],
    },
    windows: {
      selectedCategory: "Fenêtres",
      intro:
        "Très bien. Pour les fenêtres, l’estimation dépend du nombre de fenêtres, des dimensions, du type d’ouverture, de la couleur et de la pose.",
      questions: [
        {
          key: "selectedQuantity",
          text: "Combien de fenêtres souhaitez-vous remplacer ou installer ?",
          options: ["1 fenêtre", "2 à 3 fenêtres", "4 à 6 fenêtres", "7 à 10 fenêtres", "Plus de 10 fenêtres"],
        },
        {
          key: "selectedWorkType",
          text: "Souhaitez-vous des fenêtres standard ou sur mesure ?",
          options: ["Standard", "Sur mesure", "Je ne sais pas"],
        },
        {
          key: "selectedServiceType",
          text: "Quel type de service souhaitez-vous ?",
          options: ["Fourniture uniquement", "Fourniture et pose", "Remplacement ancien modèle", "Fenêtres premium", "Je ne sais pas"],
        },
      ],
      result: () =>
        `Merci. Pour des fenêtres, le budget estimatif peut commencer autour de ${CHAT_CONFIG.estimateRanges.fenetresSupply} en fourniture, et de ${CHAT_CONFIG.estimateRanges.fenetresSupplyPose} avec la pose, selon les dimensions, la couleur et les options.\n\nPour un chiffrage plus juste, notre équipe peut vous recontacter et vérifier les dimensions avec vous.\n\n${CHAT_CONFIG.disclaimer}`,
      replies: [
        { label: "Oui, je souhaite être rappelé", action: "lead" },
        { label: "Voir nos fenêtres", action: "link", url: "produits" },
        { label: "Retour au menu", action: "menu" },
      ],
    },
    doors: {
      selectedCategory: "Portes",
      intro:
        "Très bien. Pour les portes, le prix dépend du type de porte, des dimensions, des finitions et de la pose.",
      questions: [
        {
          key: "selectedWorkType",
          text: "Quel type de porte souhaitez-vous ?",
          options: ["Porte intérieure", "Porte d’entrée", "Porte vitrée", "Porte sur mesure", "Je ne sais pas"],
        },
        {
          key: "selectedQuantity",
          text: "Combien de portes souhaitez-vous installer ou remplacer ?",
          options: ["1 porte", "2 à 3 portes", "4 à 6 portes", "7 à 10 portes", "Plus de 10 portes"],
        },
        {
          key: "selectedServiceType",
          text: "Souhaitez-vous la fourniture, la pose ou les deux ?",
          options: ["Fourniture uniquement", "Pose uniquement", "Fourniture et pose", "Projet premium", "Je ne sais pas"],
        },
      ],
      result: () =>
        `Merci. Pour les portes, le budget estimatif peut commencer autour de ${CHAT_CONFIG.estimateRanges.portesInterieures}, et peut dépasser ${CHAT_CONFIG.estimateRanges.portesEntreePremium}.\n\nLe prix final dépendra du modèle, des dimensions, des finitions et des contraintes de pose.\n\n${CHAT_CONFIG.disclaimer}`,
      replies: [
        { label: "Être rappelé", action: "lead" },
        { label: "Voir nos portes", action: "link", url: "produits" },
        { label: "Retour au menu", action: "menu" },
      ],
    },
  };

  const widget = document.createElement("div");
  widget.className = "adazai-widget";
  widget.innerHTML = `
    <button class="adazai-floating-cta" type="button" aria-label="Ouvrir AI Assistant" aria-expanded="false" aria-controls="adazai-widget-panel">
      <span class="adazai-floating-cta-icon" aria-hidden="true">AI</span>
      <span class="adazai-floating-cta-title">Assistant</span>
    </button>
    <aside class="adazai-widget-panel" id="adazai-widget-panel" aria-label="AI Assistant Adazrenov" hidden>
      <div class="adazai-chat-head">
        <img class="adazai-chat-logo" src="${headerLogoPath}" alt="">
        <div class="adazai-chat-title">
          <strong>ADAZRENOV</strong>
          <span>AI Assistant</span>
        </div>
        <div class="adazai-head-actions">
          <button class="adazai-chat-new" type="button" data-new-conversation>Retour au menu</button>
          <button class="adazai-widget-close" type="button" aria-label="Fermer AI Assistant">×</button>
        </div>
      </div>
      <div class="adazai-widget-log" aria-live="polite"></div>
      <div class="adazai-quick-replies" aria-label="Choix rapides"></div>
      <form class="adazai-widget-form">
        <input type="text" autocomplete="off" placeholder="Écrivez votre question...">
        <button class="button small" type="submit" aria-label="Envoyer">→</button>
      </form>
    </aside>
  `;

  document.body.appendChild(widget);

  const toggle = widget.querySelector(".adazai-floating-cta");
  const panel = widget.querySelector(".adazai-widget-panel");
  const closeButton = widget.querySelector(".adazai-widget-close");
  const newButton = widget.querySelector("[data-new-conversation]");
  const form = widget.querySelector(".adazai-widget-form");
  const input = widget.querySelector(".adazai-widget-form input");
  const log = widget.querySelector(".adazai-widget-log");
  const quickRepliesRoot = widget.querySelector(".adazai-quick-replies");
  let typingBubble = null;

  function createDefaultState() {
    return {
      messages: [],
      currentStep: "menu",
      activeEstimateFlow: null,
      estimateQuestionIndex: 0,
      selectedCategory: "",
      selectedSurface: "",
      selectedQuantity: "",
      selectedWorkType: "",
      selectedFinishLevel: "",
      selectedServiceType: "",
      leadName: "",
      leadPhone: "",
      quickReplies: [],
      leadFormVisible: false,
    };
  }

  let state = createDefaultState();

  function normalizeWidgetText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s@.+-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function renderMessages() {
    log.innerHTML = "";
    state.messages.forEach((message) => appendMessage(message.role, message.text, false));
    renderQuickReplies();
    scrollLog();
  }

  function scrollLog() {
    log.scrollTop = log.scrollHeight;
  }

  function appendMessage(role, text, persist = true, type = "message") {
    const row = document.createElement("div");
    row.className = `adazai-message-row ${role}`;
    row.innerHTML = `<div class="adazai-message-stack"><div class="chat-message ${role}"><p>${escapeHtml(text)}</p></div></div>`;
    log.appendChild(row);
    scrollLog();

    if (persist) {
      state.messages.push({ role, text, type, timestamp: new Date().toISOString() });
    }
  }

  function addBotMessage(text, replies = null, after = null) {
    state.quickReplies = [];
    renderQuickReplies();
    showTyping();
    window.setTimeout(() => {
      hideTyping();
      appendMessage("assistant", text);
      if (Array.isArray(replies)) {
        state.quickReplies = replies;
        renderQuickReplies();
      }
      if (typeof after === "function") after();
    }, 220);
  }

  function addUserMessage(text) {
    appendMessage("user", text);
  }

  function showTyping() {
    hideTyping();
    typingBubble = document.createElement("div");
    typingBubble.className = "adazai-message-row assistant is-typing-row";
    typingBubble.innerHTML = '<div class="adazai-message-stack"><div class="chat-message assistant is-typing"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div></div>';
    log.appendChild(typingBubble);
    scrollLog();
  }

  function hideTyping() {
    if (typingBubble) {
      typingBubble.remove();
      typingBubble = null;
    }
  }

  function detectIntent(message) {
    const normalized = normalizeWidgetText(message);
    if (/(salle de bain|bain|douche|baignoire|carrelage salle de bain)/.test(normalized)) return "bathroom";
    if (/(cuisine|meubles cuisine|plan de travail)/.test(normalized)) return "kitchen";
    if (/(appartement|maison|chambre|salon|peinture|sol|parquet|carrelage|interieur|interieure)/.test(normalized)) return "interior";
    if (/(facade|terrasse|exterieur|exterieure|cloture|allee|jardin|mur)/.test(normalized)) return "exterior";
    if (/(fenetre|fenetres|vitrage|pvc|alu|aluminium)/.test(normalized)) return "windows";
    if (/(porte|portes|porte d entree|porte interieure)/.test(normalized)) return "doors";
    if (/(prix|tarif|devis|estimation|budget)/.test(normalized)) return "estimate";
    if (/(services|travaux|prestations)/.test(normalized)) return "services";
    if (/(realisations|projets|galerie|photos|exemples)/.test(normalized)) return "realisations";
    if (/(produits|premium|materiaux|qualite|sur mesure)/.test(normalized)) return "products";
    if (/(adazrenov|adaz renov|qui etes vous|entreprise|a propos|nous)/.test(normalized)) return "about";
    if (/(contact|telephone|rappel|formulaire|appeler|conseil)/.test(normalized)) return "lead";
    return "unknown";
  }

  function renderQuickReplies() {
    quickRepliesRoot.innerHTML = "";
    quickRepliesRoot.hidden = !state.quickReplies.length || state.leadFormVisible;
    state.quickReplies.forEach((reply) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = reply.label;
      button.addEventListener("click", () => handleQuickReply(reply));
      quickRepliesRoot.appendChild(button);
    });
  }

  function resetChat() {
    state = createDefaultState();
    resetToMenu();
  }

  function resetToMenu() {
    state.currentStep = "menu";
    state.activeEstimateFlow = null;
    state.estimateQuestionIndex = 0;
    state.leadFormVisible = false;
    quickRepliesRoot.hidden = false;
    renderLeadForm(false);
    if (!state.messages.length) {
      appendMessage("assistant", CHAT_CONFIG.menuMessage);
      state.quickReplies = CHAT_CONFIG.menuReplies;
      renderQuickReplies();
    } else {
      addBotMessage(CHAT_CONFIG.menuMessage, CHAT_CONFIG.menuReplies);
    }
  }

  function startEstimate() {
    state.currentStep = "estimate_category";
    addBotMessage(
      "Bien sûr 😊 Pour vous donner une estimation plus juste, j’ai besoin de quelques réponses rapides. Vous pouvez simplement choisir les options ci-dessous.\n\nQuel type de projet souhaitez-vous réaliser ?",
      [
        { label: "Salle de bain", action: "estimateFlow", flow: "bathroom" },
        { label: "Cuisine", action: "estimateFlow", flow: "kitchen" },
        { label: "Rénovation intérieure", action: "estimateFlow", flow: "interior" },
        { label: "Rénovation extérieure", action: "estimateFlow", flow: "exterior" },
        { label: "Fenêtres", action: "estimateFlow", flow: "windows" },
        { label: "Portes", action: "estimateFlow", flow: "doors" },
        { label: "Projet personnalisé", action: "customProject" },
      ]
    );
  }

  function startEstimateFlow(flowKey) {
    const flow = estimateFlows[flowKey];
    if (!flow) return startCustomProjectFlow();
    state.activeEstimateFlow = flowKey;
    state.estimateQuestionIndex = 0;
    state.selectedCategory = flow.selectedCategory;
    state.selectedSurface = "";
    state.selectedQuantity = "";
    state.selectedWorkType = "";
    state.selectedFinishLevel = "";
    state.selectedServiceType = "";
    state.currentStep = "estimate_questions";
    addBotMessage(`${flow.intro}\n\n${flow.questions[0].text}`, flow.questions[0].options.map((label) => ({ label, action: "estimateAnswer" })));
  }

  function handleEstimateAnswer(label) {
    const flow = estimateFlows[state.activeEstimateFlow];
    const question = flow?.questions[state.estimateQuestionIndex];
    if (!flow || !question) return resetToMenu();
    state[question.key] = label;
    state.estimateQuestionIndex += 1;
    const nextQuestion = flow.questions[state.estimateQuestionIndex];
    if (nextQuestion) {
      return addBotMessage(nextQuestion.text, nextQuestion.options.map((option) => ({ label: option, action: "estimateAnswer" })));
    }
    state.currentStep = "estimate_result";
    return addBotMessage(flow.result(), flow.replies);
  }

  function startBathroomFlow() {
    startEstimateFlow("bathroom");
  }

  function startKitchenFlow() {
    startEstimateFlow("kitchen");
  }

  function startInteriorFlow() {
    startEstimateFlow("interior");
  }

  function startExteriorFlow() {
    startEstimateFlow("exterior");
  }

  function startWindowsFlow() {
    startEstimateFlow("windows");
  }

  function startDoorsFlow() {
    startEstimateFlow("doors");
  }

  function startCustomProjectFlow() {
    state.selectedCategory = "Projet personnalisé";
    state.currentStep = "lead";
    addBotMessage(
      "Votre projet semble spécifique, et c’est justement le type de demande qui mérite un échange direct avec notre équipe.\n\nPour mieux comprendre vos besoins, nous vous proposons de vous rappeler et de voir ensemble les détails : type de travaux, contraintes, budget, délais et solutions possibles.\n\nPouvez-vous laisser votre nom et votre numéro de téléphone ?",
      null,
      () => showLeadForm()
    );
  }

  function showServices() {
    state.currentStep = "services";
    addBotMessage(
      "Adazrenov vous accompagne pour des projets de rénovation, construction, aménagement et installation, avec une approche claire, professionnelle et adaptée à vos besoins.\n\nQuel service souhaitez-vous découvrir ?",
      [
        { label: "Salle de bain", action: "serviceInfo", service: "Salle de bain" },
        { label: "Cuisine", action: "serviceInfo", service: "Cuisine" },
        { label: "Rénovation intérieure", action: "serviceInfo", service: "Rénovation intérieure" },
        { label: "Rénovation extérieure", action: "serviceInfo", service: "Rénovation extérieure" },
        { label: "Fenêtres et portes", action: "serviceInfo", service: "Fenêtres et portes" },
        { label: "Projet personnalisé", action: "customProject" },
        { label: "Voir les services", action: "link", url: "services" },
      ]
    );
  }

  function showServiceDetail(service) {
    const descriptions = {
      "Salle de bain": "Nous pouvons vous accompagner pour une salle de bain plus confortable, moderne et durable : douche, baignoire, carrelage, meubles, plomberie et finitions.",
      Cuisine: "Pour la cuisine, Adazrenov peut intervenir sur les finitions, meubles, plan de travail, raccordements, agencement et solutions sur mesure.",
      "Rénovation intérieure": "Pour l’intérieur, nous pouvons vous orienter sur peinture, sols, carrelage, cloisons, finitions, électricité, plomberie et rénovation complète.",
      "Rénovation extérieure": "Pour l’extérieur, nous pouvons étudier façade, terrasse, entrée, allée, mur, clôture et finitions adaptées à votre chantier.",
      "Fenêtres et portes": "Nous proposons des solutions pour fenêtres et portes standard ou sur mesure, avec fourniture, pose et finitions premium selon votre projet.",
    };
    addBotMessage(
      `${descriptions[service] || "Nous pouvons vous orienter selon votre besoin et votre chantier."}\n\nSouhaitez-vous obtenir une estimation ou voir des exemples de réalisations ?\n\nVous pouvez découvrir plus de détails sur notre page services.`,
      [
        { label: "Obtenir une estimation", action: "estimate" },
        { label: "Voir des réalisations", action: "realisations" },
        { label: "Être rappelé", action: "lead" },
        { label: "Voir les services", action: "link", url: "services" },
      ]
    );
  }

  function showRealisations() {
    state.currentStep = "realisations";
    addBotMessage(
      "Bien sûr 😊 Vous pouvez découvrir plusieurs projets réalisés par Adazrenov : salles de bain, cuisines, rénovations intérieures, extérieures, fenêtres, portes et projets sur mesure.\n\nQuel type de réalisation souhaitez-vous voir ?",
      [
        { label: "Salles de bain", action: "realisationsDetail" },
        { label: "Cuisines", action: "realisationsDetail" },
        { label: "Rénovations intérieures", action: "realisationsDetail" },
        { label: "Fenêtres et portes", action: "realisationsDetail" },
        { label: "Tous les projets", action: "realisationsDetail" },
      ]
    );
  }

  function showRealisationsLink() {
    addBotMessage("Vous pouvez consulter cette page pour voir des exemples similaires.", [{ label: "Voir la galerie", action: "link", url: "realisations" }]);
  }

  function showPremiumProducts() {
    state.currentStep = "products";
    addBotMessage(
      "Chez Adazrenov, nous privilégions des produits fiables, durables et esthétiques pour obtenir un résultat propre, moderne et adapté à votre projet.\n\nQuel type de produit vous intéresse ?",
      [
        { label: "Fenêtres premium", action: "productDetail" },
        { label: "Portes premium", action: "productDetail" },
        { label: "Finitions salle de bain", action: "productDetail" },
        { label: "Finitions cuisine", action: "productDetail" },
        { label: "Solutions sur mesure", action: "productDetail" },
      ]
    );
  }

  function showProductDetail() {
    addBotMessage(
      "Nous pouvons vous orienter vers des solutions standard ou sur mesure, avec différentes finitions, couleurs et options selon votre projet.",
      [
        { label: "Demander un conseil", action: "lead" },
        { label: "Voir les produits", action: "link", url: "produits" },
        { label: "Être rappelé", action: "lead" },
      ]
    );
  }

  function showAboutAdazrenov() {
    state.currentStep = "about";
    addBotMessage(
      "Adazrenov accompagne ses clients en France dans leurs projets de rénovation, construction et aménagement, avec une approche professionnelle, claire et orientée vers la qualité.\n\nNous travaillons sur des projets intérieurs et extérieurs : salles de bain, cuisines, rénovations complètes, fenêtres, portes, produits premium et solutions personnalisées.\n\nNotre objectif est simple : vous aider à concrétiser votre projet avec des conseils adaptés, des finitions soignées et un accompagnement sérieux.\n\nSouhaitez-vous découvrir davantage notre entreprise sur le site ?",
      [
        { label: "Voir la page À propos", action: "link", url: "aPropos" },
        { label: "Voir nos réalisations", action: "realisations" },
        { label: "Obtenir une estimation", action: "estimate" },
        { label: "Retour au menu", action: "menu" },
      ]
    );
  }

  function showLeadForm() {
    state.currentStep = "lead";
    state.leadFormVisible = true;
    state.quickReplies = [];
    renderQuickReplies();
    renderLeadForm(true);
  }

  function renderLeadForm(show) {
    const existing = widget.querySelector(".adazai-lead-form");
    if (existing) existing.remove();
    if (!show) return;

    const leadForm = document.createElement("form");
    leadForm.className = "adazai-lead-form";
    leadForm.innerHTML = `
      <label>
        <span>Nom</span>
        <input name="leadName" type="text" autocomplete="name" value="${escapeHtml(state.leadName)}">
      </label>
      <label>
        <span>Téléphone</span>
        <input name="leadPhone" type="tel" autocomplete="tel" value="${escapeHtml(state.leadPhone)}">
      </label>
      <p class="adazai-lead-error" hidden></p>
      <button class="button" type="submit">Envoyer ma demande</button>
      <a class="adazai-contact-link" href="${CHAT_CONFIG.links.contact}" target="_blank" rel="noopener noreferrer">Ouvrir le formulaire</a>
    `;
    form.before(leadForm);
    leadForm.addEventListener("submit", submitLead);
    const contactLink = leadForm.querySelector(".adazai-contact-link");
    if (contactLink) {
      contactLink.addEventListener("click", (event) => {
        event.preventDefault();
        openAssistantLink(contactLink.href);
      });
    }
  }

  function showLeadRequest() {
    addBotMessage(
      "Avec plaisir 😊 Pour que l’équipe Adazrenov puisse vous recontacter, merci de laisser simplement votre nom et votre numéro de téléphone.",
      null,
      () => showLeadForm()
    );
  }

  function buildLeadPayload() {
    return {
      name: state.leadName,
      phone: state.leadPhone,
      projectType: state.selectedCategory,
      selections: {
        selectedCategory: state.selectedCategory,
        selectedSurface: state.selectedSurface,
        selectedQuantity: state.selectedQuantity,
        selectedWorkType: state.selectedWorkType,
        selectedFinishLevel: state.selectedFinishLevel,
        selectedServiceType: state.selectedServiceType,
      },
      page: window.location.href,
    };
  }

  async function onLeadSubmit(payload) {
    const leadApiUrl = window.AI_AISSTEN_CHAT_CONFIG?.leadApiUrl || "";
    if (!leadApiUrl) {
      console.info("ADAZRENOV lead stub:", payload);
      return { ok: true, source: "stub" };
    }

    const response = await fetch(leadApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { ok: response.ok, source: "api" };
  }

  async function submitLead(event) {
    event.preventDefault();
    const leadForm = event.currentTarget;
    const error = leadForm.querySelector(".adazai-lead-error");
    const name = leadForm.elements.leadName.value.trim();
    const phone = leadForm.elements.leadPhone.value.trim();
    const phoneDigits = phone.replace(/\D/g, "");

    error.hidden = true;
    if (!name) {
      error.textContent = "Merci d’indiquer votre nom.";
      error.hidden = false;
      return;
    }
    if (!phone || phoneDigits.length < 8) {
      error.textContent = "Merci d’indiquer un numéro de téléphone valide.";
      error.hidden = false;
      return;
    }

    state.leadName = name;
    state.leadPhone = phone;
    const submitButton = leadForm.querySelector("button");
    submitButton.disabled = true;
    submitButton.textContent = "Envoi...";

    try {
      await onLeadSubmit(buildLeadPayload());
    } catch (errorSubmit) {
      console.warn("Assistant lead submit unavailable.", errorSubmit);
    }

    state.leadFormVisible = false;
    renderLeadForm(false);
    addBotMessage(
      "Merci. Votre demande a bien été envoyée. L’équipe Adazrenov vous contactera prochainement pour discuter de votre projet et vous proposer la meilleure solution.\n\nVous pouvez aussi remplir notre formulaire de contact pour être rappelé plus facilement.",
      [
        { label: "Voir nos réalisations", action: "realisations" },
        { label: "Retour au menu", action: "menu" },
        { label: "Ouvrir le formulaire", action: "link", url: "contact" },
      ]
    );
  }

  function handleFallback() {
    addBotMessage(
      "Je peux vous aider 😊 Pour mieux vous orienter, pouvez-vous choisir le type de projet qui correspond le mieux à votre demande ?",
      [
        { label: "Salle de bain", action: "estimateFlow", flow: "bathroom" },
        { label: "Cuisine", action: "estimateFlow", flow: "kitchen" },
        { label: "Rénovation intérieure", action: "estimateFlow", flow: "interior" },
        { label: "Rénovation extérieure", action: "estimateFlow", flow: "exterior" },
        { label: "Fenêtres / Portes", action: "services" },
        { label: "Projet personnalisé", action: "customProject" },
      ]
    );
  }

  function routeIntent(intent) {
    switch (intent) {
      case "bathroom":
        return startBathroomFlow();
      case "kitchen":
        return startKitchenFlow();
      case "interior":
        return startInteriorFlow();
      case "exterior":
        return startExteriorFlow();
      case "windows":
        return startWindowsFlow();
      case "doors":
        return startDoorsFlow();
      case "estimate":
        return startEstimate();
      case "services":
        return showServices();
      case "realisations":
        return showRealisations();
      case "products":
        return showPremiumProducts();
      case "about":
        return showAboutAdazrenov();
      case "lead":
        return showLeadRequest();
      default:
        return handleFallback();
    }
  }

  function handleQuickReply(reply) {
    addUserMessage(reply.label);
    if (reply.action === "link") {
      const targetUrl = CHAT_CONFIG.links[reply.url] || reply.url || CHAT_CONFIG.links.contact;
      openAssistantLink(targetUrl);
      return;
    }
    if (reply.action === "menu") return resetToMenu();
    if (reply.action === "estimate") return startEstimate();
    if (reply.action === "estimateFlow") return startEstimateFlow(reply.flow);
    if (reply.action === "estimateAnswer") return handleEstimateAnswer(reply.label);
    if (reply.action === "customProject") return startCustomProjectFlow();
    if (reply.action === "services") return showServices();
    if (reply.action === "serviceInfo") return showServiceDetail(reply.service);
    if (reply.action === "realisations") return showRealisations();
    if (reply.action === "realisationsDetail") return showRealisationsLink();
    if (reply.action === "products") return showPremiumProducts();
    if (reply.action === "productDetail") return showProductDetail();
    if (reply.action === "about") return showAboutAdazrenov();
    if (reply.action === "lead") return showLeadRequest();
  }

  function openAssistantLink(url) {
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => window.focus(), 0);
  }

  function handleFreeText(message) {
    const clean = String(message || "").trim();
    if (!clean) return;
    addUserMessage(clean);
    routeIntent(detectIntent(clean));
  }

  function handleUserMessage(message) {
    handleFreeText(message);
  }

  function openWidget() {
    panel.hidden = false;
    widget.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    window.setTimeout(() => input.focus(), 40);
  }

  function closeWidget() {
    panel.hidden = true;
    widget.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    if (panel.hidden) openWidget();
    else closeWidget();
  });

  closeButton.addEventListener("click", closeWidget);
  newButton.addEventListener("click", resetToMenu);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleUserMessage(input.value);
    input.value = "";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) closeWidget();
  });

  document.querySelectorAll("[data-open-adazai-widget]").forEach((button) => {
    button.addEventListener("click", openWidget);
  });

  resetChat();
  renderMessages();
}

document.addEventListener("DOMContentLoaded", async () => {
  const currentPage = document.body.dataset.page || "home";
  const headerRoot = document.querySelector(".site-header");
  const footerRoot = document.querySelector(".site-footer");

  if (headerRoot) headerRoot.innerHTML = buildHeader(currentPage);
  if (footerRoot) footerRoot.innerHTML = buildFooter();

  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  });

  const year = document.querySelector("#year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  await loadProductCatalogues();
  setupDoorCatalogue();
  setupWindowCatalogue();
  setupShutterCatalogue();
  orderProductCatalogueCards();
  setupFilters();
  setupProductSubfilters();
  setupProductVariants();
  setupContactForm();
  setupReveal();
  setupProjectVideoPreviews();
  setupProjectVideoModal();
  setupAiPhotoAnalyzer();
  setupAiMaterialAdvisor();
  setupAiChatbot();
  setupAiEstimator();
  setupAiConceptIdeator();
  setupAiRoadmapPlanner();
  setupAiBookingPlanner();
  setupGlobalAdazaiWidget();
});
