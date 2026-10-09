const navItems = [
  { page: "home", href: "index.html", label: "Accueil" },
  { page: "services", href: "services.html", label: "Services" },
  { page: "products", href: "produits.html", label: "Produits" },
  { page: "projects", href: "projets.html", label: "Projets" },
  { page: "about", href: "a-propos.html", label: "À propos" },
  { page: "ai", href: "ia-travaux.html", label: "Assistant IA" },
  { page: "contact", href: "contact.html", label: "Contact" },
];

const brandLogoPath = "assets/brand/adaz-renov-wordmark.png";
const adazSiteSearchUrl = "site-search.json";
const headerLogoPath = "assets/brand/adaz-renov-logo.png";
const companyPhoneDisplay = "+33 1 86 04 74 68";
const companyPhoneHref = "tel:+33186047468";
const companyEmail = "adazrenov@gmail.com";
const socialLinks = {
  facebook: "https://www.facebook.com/profile.php?id=61562185566929#",
  instagram: "https://www.instagram.com/adaz_renov?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  tiktok: "https://www.tiktok.com/@adaz_renov?is_from_webapp=1&sender_device=pc",
};

function getConfiguredFunctionUrl(functionName, explicitUrl = "") {
  if (explicitUrl) return String(explicitUrl);
  const baseUrl = String(window.AI_AISSTEN_FUNCTIONS_BASE_URL || "").replace(/\/$/, "");
  return baseUrl ? `${baseUrl}/${functionName}` : "";
}

async function submitAdazForm(form, apiUrl, payload) {
  // Reuse the identifier after an uncertain response; Resend deduplicates retries.
  const fingerprint = JSON.stringify(payload);
  if (form.adazSubmission?.fingerprint !== fingerprint) {
    form.adazSubmission = { fingerprint, id: crypto.randomUUID() };
  }
  const response = await fetch(apiUrl, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, requestId: form.adazSubmission.id, website: String(form.elements.website?.value || "") }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.ok !== true) {
    throw new Error([400, 429, 503].includes(response.status) && typeof result.error === "string"
      ? result.error : "L’envoi est momentanément indisponible. Réessayez ou contactez-nous directement.");
  }
  form.adazSubmission = null;
}

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
        <a class="brand" href="index.html" aria-label="ADAZ RENOV Renovation &amp; Construction - Accueil">
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
  const description = "Rénovation, construction et menuiserie depuis 2021. Basés à Noiseau, nous intervenons à Paris, en Île-de-France et dans toute la France.";
  return `
    <footer class="footer-shell">
      <div class="container footer-grid">
        <div class="footer-block footer-brand">
          <a class="brand" href="index.html" aria-label="ADAZ RENOV, accueil">
            <img class="brand-logo" src="${brandLogoPath}" alt="Logo ADAZ RENOV">
          </a>
          <p>
            ${description}
          </p>
          <div class="social-row" aria-label="Réseaux sociaux">
            <a class="social-pill" href="${socialLinks.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Facebook ADAZ RENOV"><svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M80 299.3l0 212.7 116 0 0-212.7 86.5 0 18-97.8-104.5 0 0-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4 .4 37 1.2l0-88.7C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4l0 42.1-66 0 0 97.8 66 0z"/></svg></a>
            <a class="social-pill" href="${socialLinks.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram ADAZ RENOV"><svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224.3 141a115 115 0 1 0 -.6 230 115 115 0 1 0 .6-230zm-.6 40.4a74.6 74.6 0 1 1 .6 149.2 74.6 74.6 0 1 1 -.6-149.2zm93.4-45.1a26.8 26.8 0 1 1 53.6 0 26.8 26.8 0 1 1 -53.6 0zm129.7 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM399 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg></a>
            <a class="social-pill" href="${socialLinks.tiktok}" target="_blank" rel="noopener noreferrer" aria-label="TikTok ADAZ RENOV"><svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M448.5 209.9c-44 .1-87-13.6-122.8-39.2l0 178.7c0 33.1-10.1 65.4-29 92.6s-45.6 48-76.6 59.6-64.8 13.5-96.9 5.3-60.9-25.9-82.7-50.8-35.3-56-39-88.9 2.9-66.1 18.6-95.2 40-52.7 69.6-67.7 62.9-20.5 95.7-16l0 89.9c-15-4.7-31.1-4.6-46 .4s-27.9 14.6-37 27.3-14 28.1-13.9 43.9 5.2 31 14.5 43.7 22.4 22.1 37.4 26.9 31.1 4.8 46-.1 28-14.4 37.2-27.1 14.2-28.1 14.2-43.8l0-349.4 88 0c-.1 7.4 .6 14.9 1.9 22.2 3.1 16.3 9.4 31.9 18.7 45.7s21.3 25.6 35.2 34.6c19.9 13.1 43.2 20.1 67 20.1l0 87.4z"/></svg></a>
          </div>
        </div>
        <nav class="footer-block footer-navigation" aria-label="Navigation du pied de page">
          <h3>Navigation</h3>
          <div class="footer-links">
            <a href="index.html">Accueil</a>
            <a href="services.html">Services</a>
            <a href="produits.html">Produits</a>
            <a href="projets.html">Projets</a>
            <a href="a-propos.html">À propos</a>
            <a href="ia-travaux.html">Assistant IA</a>
            <a href="contact.html">Contact</a>
          </div>
        </nav>
        <div class="footer-block footer-services">
          <h3>Services</h3>
          <ul class="footer-links">
            <li><a href="services.html#service-fenetres">Fourniture et pose de fenêtres</a></li>
            <li><a href="services.html#service-salle-de-bain">Rénovation de salle de bain</a></li>
            <li><a href="services.html#service-interphone">Interphone et visiophone</a></li>
            <li><a href="services.html#service-electricite">Installation électrique</a></li>
            <li><a href="services.html#service-maconnerie">Travaux de maçonnerie</a></li>
            <li><a href="services.html#service-peinture">Peinture et décoration</a></li>
          </ul>
        </div>
        <div class="footer-block footer-contact-block">
          <h3>Contact</h3>
          <dl class="footer-contact">
            <div><dt>Adresse</dt><dd><address>1 Place du Vieux Pays<br>94880 Noiseau, France</address></dd></div>
            <div><dt>Téléphone</dt><dd><a href="${companyPhoneHref}">${companyPhoneDisplay}</a></dd></div>
            <div><dt>E-mail</dt><dd><a href="mailto:${companyEmail}">${companyEmail}</a></dd></div>
          </dl>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>&copy; <span id="year"></span> ADAZ RENOV. Tous droits réservés.</span>
        <div class="footer-legal">
          <a href="mentions-legales.html">Mentions légales</a>
          <a href="politique-confidentialite.html">Politique de confidentialité</a>
          <button type="button" class="footer-cookie-settings" data-cookie-settings>Préférences cookies</button>
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
    const selects = group.querySelectorAll("[data-filter-select]");
    const emptyState = document.querySelector(`[data-empty="${key}"]`);

    function apply(filter) {
      let visible = 0;

      buttons.forEach((button) => {
        const active = button.dataset.filter === filter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      selects.forEach((select) => {
        select.value = filter;
      });

      document.querySelectorAll(`[data-group="${key}"]`).forEach((card) => {
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

    selects.forEach((select) => {
      select.addEventListener("change", () => apply(select.value || "all"));
    });

    document.addEventListener("productcataloguechange", () => {
      const active = group.querySelector('[data-filter][aria-pressed="true"]');
      apply(active?.dataset.filter || "all");
    });
    apply("all");
  });
}

function setupProductSubfilters() {
  const root = document.querySelector("[data-product-subfilters]");
  if (!root) return;

  const panels = root.querySelectorAll("[data-subfilter-panel]");
  const buttons = root.querySelectorAll("[data-subfilter]");
  const selects = root.querySelectorAll("[data-subfilter-select]");
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

    selects.forEach((select) => {
      if (select.dataset.subfilterSelect === activeMain) {
        select.value = activeSub;
      } else {
        select.value = "all";
      }
    });
  }

  function applySubfilter(nextSub = activeSub) {
    activeSub = nextSub;
    let visible = 0;
    const needsSubfilter = activeMain === "doors" || activeMain === "windows";

    document.querySelectorAll('[data-group="products"]').forEach((card) => {
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

  selects.forEach((select) => {
    select.addEventListener("change", () => applySubfilter(select.value || "all"));
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
    imagePath: "assets/catalogue/panneaux/panneau-01/porte.png",
    schemaPath: "assets/catalogue/panneaux/panneau-01/schema.png",
  },
  {
    id: 2,
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-02/porte.png",
    schemaPath: "assets/catalogue/panneaux/panneau-02/schema.png",
  },
  {
    id: 3,
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-03/porte.png",
    schemaPath: "assets/catalogue/panneaux/panneau-03/schema.png",
  },
  {
    id: 4,
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-04/porte.png",
    schemaPath: "assets/catalogue/panneaux/panneau-04/schema.png",
  },
  {
    id: 5,
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-05/porte.png",
    schemaPath: "assets/catalogue/panneaux/panneau-05/schema.png",
  },
  {
    id: 6,
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-06/porte.png",
    schemaPath: "assets/catalogue/panneaux/panneau-06/schema.png",
  },
  {
    id: 7,
    title: "Porte d'entrée métallique modèle 07",
    material: "metal",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-07/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-07/schema.webp",
  },
  {
    id: 8,
    title: "Porte d'entrée métallique modèle 08",
    material: "metal",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-08/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-08/schema.webp",
  },
  {
    id: 9,
    title: "Porte d'entrée métallique modèle 09",
    material: "metal",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-09/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-09/schema.webp",
  },
  {
    id: 10,
    title: "Porte d'entrée métallique modèle 10",
    material: "metal",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-10/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-10/schema.webp",
  },
  {
    id: 11,
    title: "Porte d'entrée métallique modèle 11",
    material: "metal",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-11/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-11/schema.webp",
  },
  {
    id: 12,
    title: "Porte d'entrée métallique modèle 12",
    material: "metal",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-12/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-12/schema.webp",
  },
  {
    id: 13,
    title: "Porte d'entrée métallique modèle 13",
    material: "metal",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-13/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-13/schema.webp",
  },
  {
    id: 14,
    title: "Porte d'entrée métallique modèle 14",
    material: "metal",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-14/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-14/schema.webp",
  },
  {
    id: 15,
    title: "Porte en bois vitrée modèle 15",
    material: "glass",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-15/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-15/schema.webp",
  },
  {
    id: 16,
    title: "Porte en bois vitrée modèle 16",
    material: "glass",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-16/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-16/schema.webp",
  },
  {
    id: 17,
    title: "Porte en bois vitrée modèle 17",
    material: "glass",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-17/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-17/schema.webp",
  },
  {
    id: 18,
    title: "Porte en bois vitrée modèle 18",
    material: "glass",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-18/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-18/schema.webp",
  },
  {
    id: 19,
    title: "Porte en bois vitrée modèle 19",
    material: "glass",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-19/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-19/schema.webp",
  },
  {
    id: 20,
    title: "Porte en bois vitrée modèle 20",
    material: "glass",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-20/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-20/schema.webp",
  },
  {
    id: 21,
    title: "Porte d'entrée MDF/XPS modèle 21",
    material: "wood",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-21/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-21/schema.webp",
  },
  {
    id: 22,
    title: "Porte d'entrée MDF/XPS modèle 22",
    material: "wood",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-22/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-22/schema.webp",
  },
  {
    id: 23,
    title: "Porte d'entrée MDF/XPS modèle 23",
    material: "wood",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-23/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-23/schema.webp",
  },
  {
    id: 24,
    title: "Porte d'entrée MDF/XPS modèle 24",
    material: "wood",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-24/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-24/schema.webp",
  },
  {
    id: 25,
    title: "Porte d'entrée MDF/XPS modèle 25",
    material: "wood",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-25/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-25/schema.webp",
  },
  {
    id: 26,
    title: "Porte d'entrée MDF/XPS modèle 26",
    material: "wood",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-26/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-26/schema.webp",
  },
  {
    id: 27,
    title: "Porte d'entrée MDF/XPS modèle 27",
    material: "wood",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-27/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-27/schema.webp",
  },
  {
    id: 28,
    title: "Porte d'entrée MDF/XPS modèle 28",
    material: "wood",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-28/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-28/schema.webp",
  },
  {
    id: 29,
    title: "Porte d'entrée MDF/XPS modèle 29",
    material: "wood",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-29/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-29/schema.webp",
  },
  {
    id: 30,
    title: "Porte d'entrée PVC modèle 30",
    material: "pvc",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-30/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-30/schema.webp",
  },
  {
    id: 31,
    title: "Porte d'entrée PVC modèle 31",
    material: "pvc",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-31/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-31/schema.webp",
  },
  {
    id: 32,
    title: "Porte d'entrée PVC modèle 32",
    material: "pvc",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-32/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-32/schema.webp",
  },
  {
    id: 33,
    title: "Porte d'entrée PVC modèle 33",
    material: "pvc",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-33/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-33/schema.webp",
  },
  {
    id: 34,
    title: "Porte d'entrée PVC modèle 34",
    material: "pvc",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-34/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-34/schema.webp",
  },
  {
    id: 35,
    title: "Porte d'entrée PVC modèle 35",
    material: "pvc",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-35/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-35/schema.webp",
  },
  {
    id: 36,
    title: "Porte d'entrée PVC modèle 36",
    material: "pvc",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-36/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-36/schema.webp",
  },
  {
    id: 37,
    title: "Porte d'entrée PVC modèle 37",
    material: "pvc",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-37/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-37/schema.webp",
  },
  {
    id: 38,
    title: "Porte d'entrée PVC modèle 38",
    material: "pvc",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-38/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-38/schema.webp",
  },
  {
    id: 39,
    title: "Porte d'entrée PVC modèle 39",
    material: "pvc",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-39/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-39/schema.webp",
  },
  {
    id: 40,
    title: "Porte d'entrée PVC modèle 40",
    material: "pvc",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-40/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-40/schema.webp",
  },
  {
    id: 41,
    title: "Porte d'entrée PVC modèle 41",
    material: "pvc",
    colors: ["Noir mat"],
    imagePath: "assets/catalogue/panneaux/panneau-41/porte.webp",
    schemaPath: "assets/catalogue/panneaux/panneau-41/schema.webp",
  },
];

let windowCatalogue = [
  {
    id: 1,
    title: "Fenêtre en aluminium ENTRA",
    description: "Profil aluminium moderne avec isolation renforcee et finition personnalisable.",
    specs: "Aluminium, 3 joints, 3 chambres, Uw 0,85 pour Ug = 0,5.",
    hasTechSheet: true,
  },
  {
    id: 2,
    title: "Fenêtre en bois ESPERIA LIFE",
    description: "Menuiserie bois chaleureuse avec profil isolant pour renovation premium.",
    specs: "Bois, fiche technique disponible, Uw 0,83 pour Ug = 0,5.",
    hasTechSheet: true,
  },
  {
    id: 3,
    title: "Fenêtre en PVC — modèle 03",
    description: "Profil PVC blanc avec vitrage isolant et lignes sobres pour facade contemporaine.",
  },
  {
    id: 4,
    title: "Baie coulissante en PVC EKOSUN HST",
    description: "Systeme coulissant PVC pour grandes ouvertures avec performance thermique elevee.",
    specs: "PVC coulissant, fiche technique disponible, Uw 0,63 pour Ug = 0,5.",
    hasTechSheet: true,
  },
  {
    id: 5,
    title: "Fenêtre en PVC IDEAL 8000",
    description: "Profil PVC performant pour isolation, etancheite et confort au quotidien.",
    specs: "PVC, 3 joints, 6 chambres, Uw 0,74 pour Ug = 0,5.",
    hasTechSheet: true,
  },
  {
    id: 6,
    title: "Fenêtre en PVC — modèle 06",
    description: "Menuiserie PVC blanche avec double vitrage et coloris disponibles sur demande.",
  },
  {
    id: 7,
    title: "Fenêtre en aluminium — modèle 07",
    description: "Profil aluminium fin, adapte aux projets modernes et aux finitions foncees.",
  },
  {
    id: 8,
    title: "Fenêtre en aluminium anthracite",
    description: "Menuiserie aluminium foncee avec vitrage isolant et style contemporain.",
  },
  {
    id: 9,
    title: "Fenêtre en bois avec appui",
    description: "Profil bois robuste avec finition protectrice et rendu naturel.",
    specs: "Fenetres en bois avec couches de vernis pour garantir une utilisation durable.",
    hasTechSheet: true,
  },
  {
    id: 10,
    title: "Fenêtre en PVC à isolation renforcée",
    description: "Profil PVC blanc concu pour une bonne isolation thermique et acoustique.",
  },
  {
    id: 11,
    title: "Fenêtre en PVC à double vitrage",
    description: "Solution PVC compacte pour renovation avec vitrage isolant.",
  },
  {
    id: 12,
    title: "Fenêtre en PVC haute performance",
    description: "Profil PVC blanc avec structure renforcie pour confort et durabilite.",
  },
  {
    id: 13,
    title: "Fenêtre en aluminium — modèle 13",
    description: "Profil aluminium epure avec choix de coloris pour s'adapter a la facade.",
  },
];

let shutterCatalogue = [
  { id: 1, title: "Volet roulant — modèle 01", feature: "Coffre apparent" },
  { id: 2, title: "Volet roulant — modèle 02", feature: "Sous linteau" },
  { id: 3, title: "Volet roulant — modèle 03", feature: "Coffre droit" },
  { id: 4, title: "Volet roulant — modèle 04", feature: "Coffre arrondi" },
  { id: 5, title: "Volet roulant — modèle 05", feature: "Accès technique" },
  { id: 6, title: "Volet roulant — modèle 06", feature: "Finition blanche" },
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
  const productsApiUrl = getConfiguredFunctionUrl("getProducts", config.apiUrl || "");

  try {
    const payload = productsApiUrl
      ? await loadProductCataloguesFromApi(productsApiUrl)
      : await loadProductCataloguesFromFirestore();

    if (payload && applyRemoteProductCatalogue(payload)) {
      document.documentElement.dataset.productsSource = productsApiUrl ? "api" : "firestore";
      return true;
    }
  } catch (error) {
    console.warn("Products database unavailable, using local catalogue.", error);
  }
  return false;
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

function getOptimizedImagePath(path) {
  return window.ADAZ_OPTIMIZED_MEDIA?.[String(path).split("?")[0]] || path;
}

function getDoorImagePath(model, variantIndex) {
  if (model.imagePath && variantIndex === 0) {
    return getOptimizedImagePath(model.imagePath);
  }

  const modelSlug = getDoorModelSlug(model.id);
  const colorSlug = slugifyDoorColor(model.colors[variantIndex] || model.colors[0]);
  return getOptimizedImagePath(`assets/catalogue/usi/${modelSlug}/${modelSlug}-${colorSlug}.webp?v=white-bg`);
}

function getDoorSchemaImagePath(model) {
  return model.schemaPath ? getOptimizedImagePath(model.schemaPath) : "";
}

function getWindowModelSlug(modelId) {
  return `fenetre-modele-${String(modelId).padStart(2, "0")}`;
}

function getWindowImagePath(model, slideKey) {
  if (model.imagePath) return getOptimizedImagePath(model.imagePath);
  const modelSlug = getWindowModelSlug(model.id);
  return getOptimizedImagePath(`assets/catalogue/geamuri/${modelSlug}/${modelSlug}-${slideKey}.webp?v=20260503`);
}

function getShutterModelSlug(modelId) {
  return `volet-roulant-exterieur-modele-${String(modelId).padStart(2, "0")}`;
}

function getShutterImagePath(model) {
  if (model.imagePath) return getOptimizedImagePath(model.imagePath);
  const modelSlug = getShutterModelSlug(model.id);
  return getOptimizedImagePath(`assets/catalogue/volets/${modelSlug}/${modelSlug}.webp?v=20260503`);
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
  if (model.material) return normalizeProductMaterial(model.material, ["metal", "glass", "wood", "pvc"], "metal");
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
  if (material === "glass") return "Bois avec vitrage";
  if (material === "wood") return "Bois";
  if (material === "pvc") return "PVC";
  return "Acier";
}

function getDoorBasePrice(material) {
  if (material === "glass") return 1550;
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
  return `${rounded.toLocaleString("fr-FR")} €`;
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
    .map((size) => `<option value="${size}">${size.replace(" x ", " × ").replace(" double", " — 2 vantaux")}</option>`)
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
            <button class="image-toggle-button is-active" type="button" data-door-media="photo" aria-pressed="true" aria-label="Vue produit"></button>
            <span>Vue produit</span>
          </div>
          <div class="door-image-option">
            <button class="image-toggle-button" type="button" data-door-media="schema" aria-pressed="false" aria-label="Dessin technique"></button>
            <span>Dessin technique</span>
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
              <label for="door-size-${domId}">Dimensions (L × H)</label>
              <select id="door-size-${domId}" data-door-size>
                ${sizeOptions}
              </select>
            </div>
          </div>
          <div class="door-panel door-custom-panel" data-door-panel="custom" hidden>
            <div class="tool-field">
              <label for="door-width-${domId}">Largeur (cm)</label>
              <input id="door-width-${domId}" type="number" min="70" max="160" step="1" value="90" inputmode="numeric" data-door-width>
            </div>
            <div class="tool-field">
              <label for="door-height-${domId}">Hauteur (cm)</label>
              <input id="door-height-${domId}" type="number" min="190" max="240" step="1" value="210" inputmode="numeric" data-door-height>
            </div>
            <p class="door-measure-note">Dimensions à confirmer après prise de mesures.</p>
          </div>
        </div>
        <p class="product-note door-summary" data-door-note>
          <span class="door-price-line"><span class="door-price-material">${materialLabel}</span><strong data-door-price>${formatDoorPrice(defaultPrice)}</strong></span>
          <span>Prix indicatif, hors pose.</span>
        </p>
        <div class="product-footer"><a class="button product-request-link" href="contact.html">Demander un devis <span aria-hidden="true">→</span></a></div>
      </div>
    </article>
  `;
}

function setupDoorCatalogue() {
  const root = document.querySelector("#door-products");
  if (!root) return;

  if (root.dataset.prerendered !== "true") {
    root.innerHTML = doorCatalogue.map(buildDoorCatalogueCard).join("");
  }

  root.querySelectorAll("[data-door-card]").forEach((card, cardIndex) => {
    const model = doorCatalogue[cardIndex];
    const material = getDoorMaterial(model);
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

      const price = note?.querySelector("[data-door-price]");
      if (price) price.textContent = formatDoorPrice(priceValue);
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
    // The card renderer already supplies the initial view, dimensions and price.
  });
}

function getWindowTechDetails(model) {
  const material = getWindowMaterial(model);
  const defaults = {
    aluminium: { joints: 3, chambers: 3, depth: "70 mm", glazing: "Jusqu’à 48 mm", uw: "0,85", ug: "0,5" },
    wood: { joints: 2, chambers: 4, depth: "78 mm", glazing: "Jusqu’à 44 mm", uw: "0,83", ug: "0,5" },
    pvc: { joints: 3, chambers: 5, depth: "70 mm", glazing: "Jusqu’à 41 mm", uw: "1,0", ug: "0,7" },
  };
  const premium = {
    4: { joints: 3, chambers: 6, depth: "197 mm", glazing: "Jusqu’à 52 mm", uw: "0,63", ug: "0,5" },
    5: { joints: 3, chambers: 6, depth: "85 mm", glazing: "Jusqu’à 51 mm", uw: "0,74", ug: "0,5" },
    12: { joints: 3, chambers: 6, depth: "85 mm", glazing: "Jusqu’à 51 mm", uw: "0,74", ug: "0,5" },
  };

  const databaseDetails = model.tech || model.technical || model.technicalDetails || {};
  return {
    ...(premium[model.id] || defaults[material] || defaults.pvc),
    ...databaseDetails,
  };
}

function buildWindowSpecs(model) {
  const details = getWindowTechDetails(model);

  return `
    <div class="window-spec-card" aria-label="Caractéristiques techniques">
      <div class="window-spec-highlights">
        <div><strong>${escapeHtml(details.joints)}</strong><span>Joints d’étanchéité</span></div>
        <div><strong>${escapeHtml(details.chambers)}</strong><span>Chambres du profil</span></div>
        <div><strong>${escapeHtml(details.depth)}</strong><span>Profondeur du profil</span></div>
      </div>
      <dl class="window-spec-details">
        <div><dt>Isolation thermique (Uw)</dt><dd>${escapeHtml(details.uw)} pour Ug = ${escapeHtml(details.ug)}</dd></div>
        <div><dt>Épaisseur de vitrage</dt><dd>${escapeHtml(details.glazing)}</dd></div>
        <div><dt>Vitrage standard</dt><dd>24 mm</dd></div>
        <div><dt>Coloris</dt><dd>Au choix</dd></div>
      </dl>
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
        <div class="project-topline">Fenêtres</div>
        <h3>${title}</h3>
        ${buildWindowSpecs(model)}
        <div class="product-note door-summary window-price-note">
          <strong>Prix sur devis</strong>
          <span>Selon les dimensions et les options.</span>
        </div>
        <div class="product-footer window-footer"><a class="button product-request-link" href="contact.html">Demander un devis <span aria-hidden="true">→</span></a></div>
      </div>
    </article>
  `;
}

function setupWindowCatalogue() {
  const root = document.querySelector("#window-products");
  if (!root) return;

  if (root.dataset.prerendered !== "true") {
    root.innerHTML = windowCatalogue.map(buildWindowCatalogueCard).join("");
  }
}

function buildShutterCatalogueCard(model) {
  const feature = escapeHtml(model.feature || model.description || "Modele disponible sur devis");
  const title = escapeHtml(model.title || `Volet roulant — modèle ${String(model.id).padStart(2, "0")}`);
  const imagePath = escapeHtml(getShutterImagePath(model));

  return `
    <article class="card product-card catalogue-card shutter-card" data-group="products" data-tags="shutters volets protection" data-shutter-card>
      <div class="media-top catalogue-media shutter-media">
        <img src="${imagePath}" alt="${title}" loading="lazy" decoding="async">
      </div>
      <div class="card-body">
        <div class="project-topline">Volets roulants extérieurs</div>
        <h3>${title}</h3>
        <p class="product-note shutter-short">${feature}</p>
        <div class="product-footer"><span class="price-row">Prix sur devis</span><a class="button product-request-link" href="contact.html">Demander un devis <span aria-hidden="true">→</span></a></div>
      </div>
    </article>
  `;
}

function setupShutterCatalogue() {
  const root = document.querySelector("#shutter-products");
  if (!root) return;

  if (root.dataset.prerendered !== "true") {
    root.innerHTML = shutterCatalogue.map(buildShutterCatalogueCard).join("");
  }
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

function setupContactProjectPicker(form) {
  const select = form.querySelector("#subject");
  const label = form.querySelector('label[for="subject"]');
  if (!select || !label) return;

  const picker = document.createElement("div");
  picker.className = "contact-project-picker";
  picker.innerHTML = `<button type="button" id="subject-trigger" class="contact-project-trigger" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-controls="subject-options" aria-required="true" aria-labelledby="subject-label subject-display"><span id="subject-display"></span><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg></button><div id="subject-options" class="contact-project-options" role="listbox" aria-labelledby="subject-label" hidden></div><span id="subject-error" class="contact-project-error" hidden>Choisissez un type de projet.</span>`;
  select.before(picker);
  label.id = "subject-label";
  label.htmlFor = "subject-trigger";
  select.classList.add("contact-project-native");
  select.tabIndex = -1;
  select.setAttribute("aria-hidden", "true");

  const trigger = picker.querySelector("button");
  const display = picker.querySelector("#subject-display");
  const list = picker.querySelector("[role=listbox]");
  const error = picker.querySelector("#subject-error");
  const options = Array.from(select.options).filter((option) => option.value);
  const items = options.map((option, index) => {
    const item = document.createElement("button");
    item.type = "button";
    item.id = `subject-option-${index}`;
    item.className = "contact-project-option";
    item.setAttribute("role", "option");
    item.tabIndex = -1;
    item.textContent = option.textContent;
    item.addEventListener("click", () => choose(index));
    list.append(item);
    return item;
  });
  let active = 0;
  let search = "";
  let searchTimer;

  const sync = () => {
    display.textContent = select.selectedOptions[0].textContent;
    trigger.classList.toggle("is-placeholder", !select.value);
    items.forEach((item, index) => item.setAttribute("aria-selected", String(options[index].value === select.value)));
    if (select.value) {
      error.hidden = true;
      trigger.removeAttribute("aria-invalid");
      trigger.removeAttribute("aria-describedby");
    }
  };
  const highlight = (index) => {
    active = (index + items.length) % items.length;
    items.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === active));
    trigger.setAttribute("aria-activedescendant", items[active].id);
    items[active].scrollIntoView({ block: "nearest" });
  };
  const close = () => {
    list.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    trigger.removeAttribute("aria-activedescendant");
  };
  const open = () => {
    list.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    highlight(Math.max(0, options.findIndex((option) => option.value === select.value)));
  };
  function choose(index) {
    select.value = options[index].value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    close();
    trigger.focus();
  }

  trigger.addEventListener("click", () => list.hidden ? open() : close());
  trigger.addEventListener("keydown", (event) => {
    if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " ", "Escape"].includes(event.key)) {
      event.preventDefault();
      if (event.key === "Escape") return close();
      if (event.key === "Enter" || event.key === " ") return list.hidden ? open() : choose(active);
      const wasClosed = list.hidden;
      if (wasClosed) open();
      if (event.key === "Home") highlight(0);
      else if (event.key === "End") highlight(items.length - 1);
      else if (!wasClosed) highlight(active + (event.key === "ArrowDown" ? 1 : -1));
      return;
    }
    if (event.key === "Tab") return close();
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      search += event.key.toLocaleLowerCase("fr");
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { search = ""; }, 600);
      const match = options.findIndex((option) => option.textContent.toLocaleLowerCase("fr").startsWith(search));
      if (match !== -1) {
        if (list.hidden) open();
        highlight(match);
      }
    }
  });
  picker.addEventListener("focusout", (event) => {
    if (!picker.contains(event.relatedTarget)) close();
  });
  document.addEventListener("pointerdown", (event) => {
    if (!picker.contains(event.target)) close();
  });
  select.addEventListener("change", sync);
  select.addEventListener("invalid", (event) => {
    event.preventDefault();
    error.hidden = false;
    trigger.setAttribute("aria-invalid", "true");
    trigger.setAttribute("aria-describedby", error.id);
    trigger.focus();
  });
  form.addEventListener("reset", () => {
    close();
    error.hidden = true;
    trigger.removeAttribute("aria-invalid");
    trigger.removeAttribute("aria-describedby");
    queueMicrotask(sync);
  });
  sync();
}

function setupContactForm() {
  const form = document.querySelector("#contact-form");
  const success = document.querySelector("#contact-success");

  if (!form || !success) return;
  setupContactProjectPicker(form);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalLabel = submitButton?.textContent || "Envoyer ma demande";
    const contactConfig = window.AI_AISSTEN_CONTACT_CONFIG || {};
    const apiUrl = String(contactConfig.apiUrl || "").trim();
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      privacy_consent: formData.get("privacy_consent") === "on",
      page: window.location.href,
    };

    if (!apiUrl) {
      success.innerHTML = "<strong>Envoi indisponible</strong> Appelez-nous ou écrivez à adazrenov@gmail.com.";
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Envoi...";
    }

    try {
      await submitAdazForm(form, apiUrl, payload);

      form.reset();
      success.innerHTML = "<strong>Demande envoyée !</strong> Merci. Notre équipe vous recontactera pour faire le point sur vos travaux.";
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "nearest" });

      window.setTimeout(() => {
        success.hidden = true;
      }, 4500);
    } catch (error) {
      console.warn("Contact submit failed.", error);
      success.innerHTML = `<strong>Envoi indisponible</strong> ${escapeHtml(error.message || "Merci de nous appeler ou de nous écrire directement à adazrenov@gmail.com.")}`;
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      }
    }
  });
}

function setupReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((element) => element.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          entry.target.classList.remove("reveal-pending");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.01, rootMargin: "0px 0px 80px 0px" }
  );

  const positions = Array.from(elements, (element) => ({ element, top: element.getBoundingClientRect().top }));
  positions.forEach(({ element, top }) => {
    if (top < window.innerHeight + 80) {
      element.classList.add("revealed");
    } else {
      element.classList.add("reveal-pending");
      observer.observe(element);
    }
  });
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

function getSavedAiProject() {
  try {
    return window.adazAiProject || JSON.parse(window.localStorage.getItem("adazrenov-ai-project-v4") || "{}");
  } catch (error) {
    return {};
  }
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

  const zoneProfiles = {
    interieur: {
      label: "rénovation intérieure",
      solutions: [
        { name: "Préparation durable des supports", priorities: ["budget", "durabilite"], budgets: ["eco", "moyen", "premium"], strengths: ["fissures traitées", "finition régulière", "meilleure tenue"] },
        { name: "Peinture lessivable à faibles émissions", priorities: ["budget", "confort", "design"], budgets: ["eco", "moyen"], strengths: ["entretien simple", "air intérieur", "large choix de teintes"] },
        { name: "Sol adapté à l'usage de la pièce", priorities: ["confort", "design", "durabilite"], budgets: ["moyen", "premium"], strengths: ["résistance", "confort acoustique", "cohérence visuelle"] },
      ],
    },
    "salle-de-bain": {
      label: "salle de bain",
      solutions: [
        { name: "Étanchéité complète sous carrelage", priorities: ["durabilite", "confort"], budgets: ["eco", "moyen", "premium"], strengths: ["protection des supports", "zones humides sécurisées", "durée de vie"] },
        { name: "Ventilation et plomberie vérifiées", priorities: ["confort", "durabilite", "budget"], budgets: ["eco", "moyen", "premium"], strengths: ["moins d'humidité", "réseaux fiables", "prévention des dégâts"] },
        { name: "Grès cérame antidérapant", priorities: ["design", "durabilite", "confort"], budgets: ["moyen", "premium"], strengths: ["entretien facile", "sécurité", "nombreuses finitions"] },
      ],
    },
    cuisine: {
      label: "cuisine",
      solutions: [
        { name: "Implantation ergonomique et rangements utiles", priorities: ["confort", "design", "budget"], budgets: ["eco", "moyen", "premium"], strengths: ["circulation fluide", "rangement optimisé", "usage quotidien"] },
        { name: "Plan de travail adapté à l'utilisation", priorities: ["durabilite", "design"], budgets: ["moyen", "premium"], strengths: ["résistance", "entretien", "finition cohérente"] },
        { name: "Réseaux électriques et plomberie préparés", priorities: ["durabilite", "budget", "confort"], budgets: ["eco", "moyen", "premium"], strengths: ["sécurité", "implantation fiable", "pose sans reprise"] },
      ],
    },
    fenetres: {
      label: "fenêtres",
      solutions: [
        { name: "PVC double vitrage performant", priorities: ["budget", "isolation", "confort"], budgets: ["eco", "moyen"], strengths: ["bon rapport qualité/prix", "isolation thermique", "entretien réduit"] },
        { name: "Aluminium à rupture de pont thermique", priorities: ["design", "durabilite", "isolation"], budgets: ["moyen", "premium"], strengths: ["profils fins", "grandes dimensions", "finition contemporaine"] },
        { name: "Bois — finition et entretien à prévoir", priorities: ["design", "isolation"], budgets: ["moyen", "premium"], strengths: ["aspect naturel", "choix des finitions", "entretien régulier à prévoir"] },
        { name: "Pose avec traitement de l'étanchéité", priorities: ["isolation", "durabilite", "confort"], budgets: ["eco", "moyen", "premium"], strengths: ["moins d'infiltrations d'air", "meilleure acoustique", "performance réelle"] },
      ],
    },
    portes: {
      label: "portes",
      solutions: [
        { name: "Bloc-porte isolant adapté au passage", priorities: ["confort", "isolation", "budget"], budgets: ["eco", "moyen"], strengths: ["isolation acoustique", "fermeture fiable", "entretien simple"] },
        { name: "Porte d'entrée renforcée", priorities: ["durabilite", "isolation"], budgets: ["moyen", "premium"], strengths: ["sécurité", "étanchéité", "valorisation du logement"] },
        { name: "Quincaillerie et réglages durables", priorities: ["durabilite", "budget", "confort"], budgets: ["eco", "moyen", "premium"], strengths: ["usage fluide", "moins d'usure", "finition propre"] },
      ],
    },
    facade: {
      label: "façade",
      solutions: [
        { name: "Diagnostic et réparation des supports", priorities: ["durabilite", "budget"], budgets: ["eco", "moyen", "premium"], strengths: ["fissures contrôlées", "adhérence", "base saine"] },
        { name: "Enduit de façade compatible", priorities: ["design", "durabilite", "budget"], budgets: ["eco", "moyen"], strengths: ["protection", "uniformité", "résistance aux intempéries"] },
        { name: "Isolation thermique par l'extérieur", priorities: ["isolation", "confort", "durabilite"], budgets: ["moyen", "premium"], strengths: ["économies d'énergie", "confort", "ponts thermiques réduits"] },
      ],
    },
    toiture: {
      label: "toiture",
      solutions: [
        { name: "Contrôle couverture et points singuliers", priorities: ["durabilite", "budget"], budgets: ["eco", "moyen", "premium"], strengths: ["fuites localisées", "priorités claires", "réparation ciblée"] },
        { name: "Écran, ventilation et évacuation des eaux", priorities: ["durabilite", "confort"], budgets: ["moyen", "premium"], strengths: ["condensation limitée", "structure protégée", "meilleure longévité"] },
        { name: "Isolation de toiture adaptée", priorities: ["isolation", "confort"], budgets: ["moyen", "premium"], strengths: ["déperditions réduites", "confort été/hiver", "performance énergétique"] },
      ],
    },
    electricite: {
      label: "installation électrique",
      solutions: [
        { name: "Diagnostic du tableau et des protections", priorities: ["durabilite", "budget", "confort"], budgets: ["eco", "moyen", "premium"], strengths: ["sécurité", "priorités identifiées", "mise en conformité"] },
        { name: "Circuits dédiés selon les usages", priorities: ["confort", "durabilite"], budgets: ["moyen", "premium"], strengths: ["installation fiable", "équipements protégés", "évolution facilitée"] },
        { name: "Appareillage fonctionnel et sobre", priorities: ["design", "budget"], budgets: ["eco", "moyen", "premium"], strengths: ["usage pratique", "finition propre", "gammes coordonnées"] },
      ],
    },
  };

  const constraintAdvice = {
    standard: "Aucune contrainte majeure déclarée : privilégiez une solution équilibrée et facile à entretenir.",
    humidite: "Traitez d'abord la cause de l'humidité. Une finition appliquée avant le diagnostic risque de se dégrader rapidement.",
    ancien: "Prévoyez une marge pour la dépose et la remise à niveau des supports avant les finitions.",
    occupe: "Choisissez des travaux phasés, des matériaux à séchage rapide et une protection renforcée des zones habitées.",
    urgence: "Sécurisez et stabilisez la zone avant les choix esthétiques ou les optimisations de budget.",
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const zone = String(formData.get("zone") || "interieur");
    const priority = getSavedAiProject().priority || "budget";
    const budget = String(formData.get("budget") || "moyen");
    const constraint = getSavedAiProject().constraint || "standard";
    const notes = getSavedAiProject().notes || "";
    const profile = zoneProfiles[zone];
    const savedProject = getSavedAiProject();
    if (savedProject.workType === "construction" || savedProject.workType === "amenagement") {
      result.innerHTML = `<div class="tool-result-card"><h3>Les choix à préparer avec notre équipe</h3><p>Précisez l’usage, les matériaux souhaités et les contraintes du lieu. Nous examinerons les solutions techniques et leur coût après relevés.</p>${notes ? `<p>Votre besoin : ${escapeHtml(notes)}</p>` : ""}</div>`;
      result.hidden = false;
      return;
    }
    if (!profile) return;

    const scored = profile.solutions
      .map((item) => {
        let score = 0;
        const reasons = [];

        if (savedProject.details?.material && savedProject.details.material !== "inconnu" && item.name.toLowerCase().includes(savedProject.details.material)) score += 10;
        if (item.priorities.includes(priority)) {
          score += 3;
          reasons.push("répond à votre priorité principale");
        }

        if (item.budgets.includes(budget)) {
          score += 2;
          reasons.push("cohérent avec votre investissement");
        }

        return { ...item, score, reasons };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    const strategy =
      priority === "isolation"
        ? "Mesurez la performance de l'ensemble : le produit seul ne compense pas une pose ou un support défaillant."
      : priority === "durabilite"
          ? "Investissez d'abord dans les supports, l'étanchéité et la qualité de pose."
          : priority === "confort"
            ? "Traitez les causes techniques avant d'améliorer les finitions visibles."
          : priority === "budget"
            ? "Conservez les éléments en bon état et concentrez le budget sur les postes techniques indispensables."
            : "Définissez une palette courte et coordonnez les matériaux avant les achats.";
    const projectContext = [
      savedProject.projectState === "mauvais" ? "prévoir une dépose et une préparation renforcées" : "",
      savedProject.occupancy === "occupe" ? "organiser les travaux par zones pour maintenir le logement utilisable" : "",
      savedProject.finish === "premium" || savedProject.finish === "prestige"
        ? "réserver les finitions haut de gamme aux éléments les plus visibles"
        : "",
    ].filter(Boolean);

    result.innerHTML = `
      <div class="tool-result-card">
        <span class="result-kicker">Stratégie recommandée</span>
        <h3>Les options pour ${["fenetres","portes"].includes(savedProject.workType)?"vos":"votre"} ${profile.label}</h3>
        <p>${strategy}</p>
        <div class="recommendation-list">
          ${scored
            .map(
              (item, index) => `
                <article class="recommendation-card">
                  <div class="recommendation-rank">0${index + 1}</div>
                  <div>
                    <span class="result-kicker">${/PVC|Aluminium|Bois|Grès|Peinture|Sol |Enduit|Porte|Bloc-porte|Appareillage|Plan de travail/.test(item.name) ? "Matériau ou équipement" : "Intervention à prévoir"}</span>
                    <h4>${item.name}</h4>
                    <p>À envisager si vous privilégiez : ${item.strengths.slice(0, 2).join(" et ")}.</p>
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
          <strong>Point de vigilance :</strong> ${constraintAdvice[constraint] || constraintAdvice.standard}
          ${projectContext.length ? `<br><strong>Adaptation au projet mémorisé :</strong> ${projectContext.join(" ; ")}.` : ""}
          ${notes ? `<br><strong>Votre besoin :</strong> ${escapeHtml(notes)}.` : ""}
          <br>La référence exacte sera choisie après vérification des dimensions et des supports.
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
  if (!root || typeof root !== "object" || root.enablePageChat !== true) return null;
  return {
    apiUrl: getConfiguredFunctionUrl("adazChat", root.apiUrl || ""),
  };
}

  let conversationId = "";

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
          conversationId,
          context: "ADAZ RENOV chantier assistant",
          page: document.body.dataset.page || "",
          url: window.location.href,
        }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      const text = String(data.answer || data.message || data.output || "").trim();
      const nextConversationId = String(data.conversationId || "").trim();
      if (nextConversationId) conversationId = nextConversationId;
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
      scrollToTool("#outil-conseil");
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
      scrollToTool("#outil-conseil");
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
    bubble.innerHTML = `${source}<p>${formatChatMessage(text)}</p>${actionHtml}`;
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

function formatAiQuantity(type, quantity) {
  const count = Number(quantity);
  if (!Number.isFinite(count)) return "À préciser";
  const unit = type === "fenetres" ? (count === 1 ? "fenêtre" : "fenêtres")
    : type === "portes" ? (count === 1 ? "porte" : "portes") : "m²";
  return `${count.toLocaleString("fr-FR")} ${unit}`;
}

function setupAiEstimator() {
  const form = document.querySelector("#ai-estimator-form");
  const result = document.querySelector("#ai-estimator-result");
  const typeSelect = form?.querySelector('[name="work_type"]');
  const measureInput = form?.querySelector('[name="surface"]');
  const measureLabel = document.querySelector("#ai-est-measure-label");

  if (!form || !result) return;

  const profiles = {
    interieur: { label: "rénovation intérieure", unit: "m²", min: 650, max: 1450, daysPerUnit: 0.42, minimum: 3500 },
    "salle-de-bain": { label: "salle de bain", unit: "m²", min: 1100, max: 2300, daysPerUnit: 1.45, minimum: 6500 },
    cuisine: { label: "cuisine", unit: "m²", min: 1000, max: 2400, daysPerUnit: 1.1, minimum: 7000 },
    fenetres: { label: "remplacement de fenêtres", unit: "fenêtre(s)", min: 650, max: 1450, daysPerUnit: 0.65, minimum: 900 },
    portes: { label: "remplacement de portes", unit: "porte(s)", min: 550, max: 1800, daysPerUnit: 0.55, minimum: 700 },
    electricite: { label: "installation électrique", unit: "m²", min: 95, max: 210, daysPerUnit: 0.28, minimum: 2200 },
    facade: { label: "rénovation de façade", unit: "m²", min: 90, max: 240, daysPerUnit: 0.25, minimum: 2800 },
    toiture: { label: "rénovation de toiture", unit: "m²", min: 170, max: 390, daysPerUnit: 0.34, minimum: 4500 },
    construction: { label: "construction ou extension", unit: "m²", min: 1900, max: 3300, daysPerUnit: 1.2, minimum: 28000 },
    amenagement: { label: "aménagement sur mesure", unit: "m²", min: 500, max: 1200, daysPerUnit: 0.5, minimum: 3000 },
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

  const stateFactors = {
    bon: 0.92,
    moyen: 1,
    mauvais: 1.22,
  };

  const budgetRanges = {
    "moins-5000": { max: 5000 },
    "5000-15000": { max: 15000 },
    "15000-40000": { max: 40000 },
    "plus-40000": { max: Infinity },
  };

  function updateMeasureField() {
    const profile = profiles[typeSelect?.value] || profiles.interieur;
    const usesUnits = ["fenetres", "portes"].includes(typeSelect?.value);
    if (measureLabel) measureLabel.textContent = usesUnits ? `Nombre de ${typeSelect?.value === "fenetres" ? "fenêtres" : "portes"}` : "Surface concernée (m²)";
    if (measureInput) {
      measureInput.min = "1";
      measureInput.step = "1";
      measureInput.placeholder = usesUnits ? "4" : "80";
    }
  }

  typeSelect?.addEventListener("change", updateMeasureField);
  updateMeasureField();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const cityField=form.elements.city;
    cityField.setCustomValidity(cityField.value.trim()?"":"Indiquez la ville du chantier.");
    if(!form.reportValidity())return;
    const data=new FormData(form);
    const type=String(data.get("work_type"));
    const area=Number(data.get("surface"));
    const profile=profiles[type];
    if(!profile||!Number.isFinite(area)||area<=0)return;
    const project=getSavedAiProject();
    const factor=(complexityFactors[data.get("complexity")]||1)*(finishFactors[data.get("finish")]||1)*(occupancyFactors[data.get("occupancy")]||1)*(stateFactors[data.get("project_state")]||1);
    const min=Math.max(profile.minimum,Math.round(profile.min*area*factor));
    const max=Math.max(Math.round(profile.minimum*1.35),Math.round(profile.max*area*factor));
    const cap=budgetRanges[data.get("desired_budget")]?.max??Infinity;
    const durationMin=Math.max(1,Math.round(Math.max(2,profile.daysPerUnit*area)*.85));
    const durationMax=Math.max(durationMin+2,Math.round(Math.max(2,profile.daysPerUnit*area)*factor*1.12));
    const manual=type==="construction"||(type==="salle-de-bain"&&project.details?.scope==="partielle")||(["fenetres","portes"].includes(type)&&project.details?.installation==="neuf")||(type==="cuisine"&&project.details?.furniture==="non");
    const scope={
      interieur:["Préparation et protection du chantier","Travaux intérieurs à préciser selon votre demande","Finitions et contrôle"],
      'salle-de-bain':["Dépose et préparation des supports","Plomberie, étanchéité et revêtements","Installation des équipements et finitions"],
      cuisine:["Relevés et préparation de l’implantation","Mobilier et plan de travail à définir","Pose, raccordements et finitions — électroménager à préciser"],
      fenetres:[`Fourniture de ${formatAiQuantity(type, area)} — dimensions et vitrage à confirmer`,"Dépose, pose, étanchéité et réglages","Finitions et évacuation à préciser après relevés"],
      portes:[`Fourniture de ${formatAiQuantity(type, area)} — modèle et dimensions à confirmer`,"Dépose, pose et réglages","Finitions et évacuation à préciser après relevés"],
      electricite:["Vérification des installations existantes","Tableau, circuits et appareillage selon les besoins","Contrôle et finitions"],
      facade:["Diagnostic et préparation des supports","Réparations et revêtement à définir","Finitions et nettoyage"],
      toiture:["Diagnostic et sécurisation","Couverture, étanchéité et isolation à préciser","Contrôle et évacuation des déchets"],
      construction:["Étude du projet et des contraintes du terrain","Autorisations et choix techniques à vérifier","Chiffrage des travaux par notre équipe"],
      amenagement:["Relevés et conception","Fabrication et pose à définir","Réglages et finitions"]
    }[type];
    const details=[...form.querySelectorAll('.ai-project-details input,.ai-project-details select')].map(e=>`${form.querySelector(`label[for="${e.id}"]`).textContent} : ${e.tagName==="SELECT"?e.selectedOptions[0]?.textContent:e.value||"à préciser"}`);
    const assumptions=[...form.querySelectorAll('select[name="project_state"],select[name="complexity"],select[name="occupancy"],select[name="finish"]')].map(e=>`${form.querySelector(`label[for="${e.id}"]`).textContent} : ${e.selectedOptions[0]?.textContent}`);
    const alternativeQuantity=["fenetres","portes"].includes(type)&&Number.isFinite(cap)&&max>cap?Math.floor(cap/(profile.max*factor)):0;
    const canOffer=alternativeQuantity>=1&&alternativeQuantity<area&&Math.round(profile.minimum*1.35)<=cap;
    const budgetNote=!Number.isFinite(cap)?"Vous pourrez préciser votre budget avec notre équipe.":min>cap?`La fourchette du projet complet commence ${formatCurrency(min-cap)} au-dessus de votre budget de ${formatCurrency(cap)}.`:max>cap?`La partie haute de cette estimation dépasse votre budget de ${formatCurrency(cap)} de ${formatCurrency(max-cap)}.`:"Cette fourchette indicative se situe dans le budget envisagé. Le prix sera confirmé par un devis.";
    result.innerHTML=`<div class="tool-result-card"><span class="result-kicker">${project.originalQuantity?"Intervention prioritaire choisie":"Projet complet"}</span><h3>${escapeHtml(profile.label.charAt(0).toUpperCase()+profile.label.slice(1))}</h3><div class="estimate-strip"><div class="estimate-box"><span>Budget estimé</span><strong>${manual?"Étude avec notre équipe":`${formatCurrency(min)} – ${formatCurrency(max)}`}</strong></div><div class="estimate-box"><span>Durée estimée des travaux</span><strong>${manual?"À confirmer":`${durationMin} à ${durationMax} jours ouvrés`}</strong></div></div><p>${manual?"Les informations et la grille actuelle ne permettent pas un chiffrage automatique adapté à ce projet. Notre équipe étudiera votre demande.":"Fourchette issue de la grille indicative actuelle. Les prestations et quantités seront vérifiées avant devis."}</p><h4>Travaux envisagés — à confirmer</h4><ul class="feature-list">${scope.map(x=>`<li><span class="check">✓</span><span>${escapeHtml(x)}</span></li>`).join("")}</ul><div class="result-tags"><span class="badge">${formatAiQuantity(type, area)}</span><span class="badge">${escapeHtml(cityField.value.trim())}</span></div><h4>Hypothèses de l’estimation</h4><ul class="feature-list">${[...assumptions,...details].map(x=>`<li><span>${escapeHtml(x)}</span></li>`).join("")}</ul>${manual?"":`<div class="budget-fit-note">${budgetNote}</div>`}${canOffer&&!manual?`<div class="ai-budget-alternative"><h4>Une intervention en plusieurs fois ?</h4><p>Vous pouvez retenir ${formatAiQuantity(type, alternativeQuantity)} prioritaires maintenant et prévoir le reste plus tard. Fourchette indicative : ${formatCurrency(Math.max(profile.minimum,Math.round(profile.min*alternativeQuantity*factor)))} – ${formatCurrency(Math.max(Math.round(profile.minimum*1.35),Math.round(profile.max*alternativeQuantity*factor)))}.</p><button class="button small secondary" type="button" data-ai-alternative="${alternativeQuantity}">Choisir cette alternative</button></div>`:""}${project.originalQuantity?`<button class="button small light" type="button" data-ai-original="${Number(project.originalQuantity)}">Revenir au projet complet (${formatAiQuantity(type, project.originalQuantity)})</button>`:""}<div class="result-note">Estimation indicative, hors délais de fabrication et de livraison. Notre équipe confirme les prestations, le prix et le calendrier après étude du projet.</div></div>`;
    result.hidden=false;
    document.dispatchEvent(new CustomEvent("adaz:estimate",{detail:{type,quantity:area,min:manual?null:min,max:manual?null:max,durationMin:manual?null:durationMin,durationMax:manual?null:durationMax,manual}}));
  });
  result.addEventListener("click",event=>{
    const button=event.target.closest("[data-ai-alternative],[data-ai-original]");
    if(!button)return;
    const state=getSavedAiProject();
    const original=state.originalQuantity||Number(form.elements.surface.value);
    form.elements.surface.value=button.dataset.aiAlternative||button.dataset.aiOriginal;
    form.elements.surface.dispatchEvent(new Event("input",{bubbles:true}));
    state.originalQuantity=button.dataset.aiOriginal?null:original;
    // Recalculation uses the selected quantity for every downstream result.
    form.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));
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
  const form=document.querySelector("#ai-roadmap-form"),result=document.querySelector("#ai-roadmap-result");
  if(!form||!result)return;
  const phases={
    fenetres:[["Relevés et choix des menuiseries","Vérifier les dimensions, le vitrage et les contraintes de pose."],["Commande et fabrication","Confirmer les délais auprès du fournisseur avant de prévoir la pose."],["Dépose et pose","Protéger les pièces, remplacer les fenêtres et réaliser l’étanchéité."],["Finitions et contrôle","Vérifier les réglages, les joints et le fonctionnement."]],
    portes:[["Relevés et choix des portes","Vérifier les dimensions, le sens d’ouverture et les supports."],["Commande et fabrication","Confirmer les délais avant l’intervention."],["Dépose et pose","Protéger les lieux, poser les blocs-portes et régler la quincaillerie."],["Finitions et contrôle","Contrôler l’ouverture, la fermeture et les finitions."]],
    'salle-de-bain':[["Relevés et choix des équipements","Vérifier la plomberie, l’implantation et les supports."],["Dépose et préparation","Protéger les lieux et préparer les réseaux et l’étanchéité."],["Revêtements et équipements","Respecter les temps de séchage et poser les équipements."],["Contrôle et réception","Vérifier l’étanchéité, la ventilation et les finitions."]],
    cuisine:[["Relevés et implantation","Valider les dimensions, le mobilier et les équipements."],["Commande et préparation des réseaux","Coordonner les livraisons, la plomberie et l’électricité."],["Pose et raccordements","Installer le mobilier, le plan de travail et les équipements retenus."],["Réglages et contrôle","Vérifier les raccordements et le fonctionnement."]],
    interieur:[["Relevés et choix des travaux","Définir les pièces et les interventions."],["Protection et préparation","Protéger le logement et vérifier les supports et réseaux."],["Travaux et finitions","Coordonner les corps de métier et les temps de séchage."],["Contrôle et réception","Vérifier les travaux et nettoyer les zones d’intervention."]],
    facade:[["Diagnostic des supports","Identifier les fissures, l’humidité et les accès."],["Protection et préparation","Sécuriser les lieux et réparer les supports."],["Travaux de façade","Appliquer les solutions retenues en tenant compte de la météo."],["Contrôle et nettoyage","Vérifier les finitions et libérer le chantier."]],
    toiture:[["Diagnostic et sécurisation","Vérifier la couverture et les causes des désordres."],["Approvisionnement et préparation","Confirmer les matériaux et prévoir les protections."],["Travaux de toiture","Intervenir sur la couverture et l’étanchéité selon le diagnostic."],["Contrôle et évacuation","Vérifier les points sensibles et nettoyer le chantier."]],
    electricite:[["Diagnostic et besoins","Repérer les installations existantes et les circuits nécessaires."],["Préparation et mise en sécurité","Organiser les coupures et le passage des réseaux."],["Installation","Poser les circuits, protections et appareillages retenus."],["Vérifications finales","Contrôler l’installation et les finitions."]],
    construction:[["Étude et relevés","Examiner le terrain et les contraintes du projet."],["Autorisations et choix techniques","Vérifier les démarches et définir les prestations."],["Devis et organisation","Valider le chiffrage, les commandes et le calendrier avec l’équipe."],["Travaux et réception","Réaliser les étapes définies après étude et contrôler leur exécution."]],
    amenagement:[["Relevés et conception","Définir l’usage et les dimensions."],["Choix et fabrication","Valider les matériaux et les délais de fabrication."],["Pose","Installer les éléments et protéger les surfaces existantes."],["Réglages et réception","Vérifier le fonctionnement et les finitions."]]
  };
  form.addEventListener("submit",event=>{
    event.preventDefault();const state=getSavedAiProject(),estimate=state.lastEstimate;
    if(!estimate)return;
    result.innerHTML=`<div class="tool-result-card"><p>${formatAiQuantity(estimate.type, estimate.quantity)} — ${state.originalQuantity?"intervention prioritaire choisie":"projet complet"}.</p><p><strong>Durée de l’intervention :</strong> ${estimate.manual?"à confirmer après étude":`${estimate.durationMin} à ${estimate.durationMax} jours ouvrés`}.</p><div class="phase-list">${phases[estimate.type].map(([label,note])=>`<div class="phase-step"><strong>${label}</strong><div class="phase-meta">${note}</div></div>`).join("")}</div><div class="result-note">Les délais de fabrication, de livraison et de séchage sont distincts du temps d’intervention. Le calendrier sera confirmé avec notre équipe.</div></div>`;
    result.hidden=false;
  });
}

function setupAiToolsNavigation() {
  const menu = document.querySelector(".ai-tool-menu");
  const form = document.querySelector("#ai-estimator-form");
  if (!menu || !form) return;
  const estimate = form.closest(".tool-panel");
  const advice = document.querySelector("#outil-conseil");
  const plan = document.querySelector("#outil-plan");
  const booking = document.querySelector("#outil-programmation");
  const project = document.createElement("article");
  project.id = "outil-projet";
  project.className = "tool-panel is-current";
  project.innerHTML = '<div class="tool-heading"><span class="tool-heading-number">01</span><div><h3>Votre projet</h3></div></div><p>Précisez vos travaux et la ville du chantier. Vous pouvez laisser les questions techniques à « Je ne sais pas ».</p>';
  project.append(form);
  estimate.id = "outil-estimateur";
  estimate.querySelector(".tool-heading-number").textContent = "02";
  const workspace = document.createElement("section");
  workspace.className = "section section-muted ai-configurator";
  workspace.innerHTML = `<div class="container ai-configurator-shell"><aside class="ai-project-summary" aria-live="polite"><h2>Votre projet en bref</h2><div class="ai-summary-list" data-ai-summary></div><p class="ai-progress-message" data-ai-status>Précisez vos travaux pour commencer.</p><button class="ai-summary-reset" type="button" data-ai-reset>Recommencer le projet</button></aside><div class="ai-configurator-content"></div></div>`;
  menu.closest("section").insertAdjacentElement("afterend",workspace);
  const panels = {project, estimate, booking};
  Object.entries(panels).forEach(([key,panel]) => {
    panel.dataset.aiStep = key;
    workspace.querySelector(".ai-configurator-content").append(panel);
    const nav = document.createElement("div"); nav.className = "ai-step-actions";
    nav.innerHTML = key === "project" ? '' : key === "estimate"
      ? '<button class="button light" type="button" data-ai-go="project">Modifier mon projet</button><button class="button secondary" type="button" data-ai-go="booking">Échanger avec l’équipe</button>'
      : '<button class="button light" type="button" data-ai-go="estimate">Voir mon estimation</button>';
    panel.append(nav);
  });
  advice.querySelector("form").hidden = true;
  plan.querySelector("form").hidden = true;
  [advice,plan].forEach(panel => {
    panel.querySelector(".tool-heading-number").remove();
    panel.classList.add("ai-result-section");
    estimate.insertBefore(panel, estimate.querySelector(".ai-step-actions"));
  });
  // These preferences belong to the project, not to another form after the result.
  ["#ai-priority", "#ai-finish", "#ai-project-notes"].forEach(selector => {
    const field = document.querySelector(selector).closest(".tool-field");
    form.insertBefore(field,form.querySelector('button[type="submit"]'));
  });
  const details = document.createElement("div"); details.className = "ai-project-details";
  form.insertBefore(details, form.querySelector(".tool-form-row:nth-child(3)"));
  const storageKey = "adazrenov-ai-project-v4";
  const fields = {work_type:"workType",surface:"surface",city:"city",project_state:"projectState",complexity:"complexity",finish:"finish",occupancy:"occupancy",deadline:"deadline",desired_budget:"desiredBudget",priority:"priority",notes:"notes"};
  // The moved constraint selector used the same name as the finish selector.
  document.querySelector("#ai-finish").name = "constraint";
  fields.constraint = "constraint";
  let restored = {};
  try { restored = JSON.parse(localStorage.getItem(storageKey)||"{}"); } catch (_) {}
  const defaults = {workType:"",surface:"",city:"",projectState:"inconnu",complexity:"inconnu",finish:"equilibre",occupancy:"inconnu",deadline:"1-3-mois",desiredBudget:"a-definir",priority:"budget",constraint:"standard",notes:""};
  const state = {...defaults, details:{}, ...restored, lastEstimate:null, originalQuantity:Number(restored.originalQuantity)||null};
  window.adazAiProject = state;
  const types = {interieur:"Rénovation intérieure","salle-de-bain":"Salle de bain",cuisine:"Cuisine",fenetres:"Fenêtres",portes:"Portes",electricite:"Installation électrique",facade:"Façade",toiture:"Toiture",construction:"Construction / extension",amenagement:"Aménagement sur mesure"};
  const budgets = {"a-definir":"À définir","moins-5000":"Maximum 5 000 €","5000-15000":"Maximum 15 000 €","15000-40000":"Maximum 40 000 €","plus-40000":"Plus de 40 000 €"};
  const priorities = {budget:"Maîtriser le budget",confort:"Améliorer le confort",isolation:"Isolation / économies",design:"Moderniser le design",durabilite:"Durabilité / entretien"};
  const typeSelect = form.elements.work_type;
  typeSelect.insertAdjacentHTML("afterbegin",'<option value="">Choisissez le type de travaux</option>');
  Object.entries(fields).forEach(([name,key]) => { if(form.elements[name]) form.elements[name].value=state[key]??""; });
  const questionSets = {
    fenetres:[['installation','Intervention souhaitée',[['remplacement','Remplacement de fenêtres'],['neuf','Montage neuf'],['inconnu','Je ne sais pas']]],['material','Matériau souhaité',[['inconnu','Je ne sais pas'],['pvc','PVC'],['aluminium','Aluminium'],['bois','Bois']]],['dimensions','Dimensions approximatives — facultatif',null]],
    portes:[['installation','Intervention souhaitée',[['remplacement','Remplacement'],['neuf','Montage neuf'],['inconnu','Je ne sais pas']]],['dimensions','Dimensions approximatives — facultatif',null]],
    'salle-de-bain':[['scope','Travaux souhaités',[['complete','Rénovation complète'],['partielle','Rénovation partielle'],['inconnu','Je ne sais pas']]],['networks','Plomberie',[['inconnu','Je ne sais pas'],['conserver','Conserver l’implantation'],['deplacer','Déplacer les installations']]]],
    cuisine:[['furniture','Mobilier à prévoir',[['inconnu','Je ne sais pas'],['oui','Nouveau mobilier'],['non','Conserver le mobilier']]],['appliances','Électroménager',[['inconnu','Je ne sais pas'],['oui','À prévoir'],['non','Déjà disponible']]],['networks','Installations',[['inconnu','Je ne sais pas'],['conserver','Conserver l’implantation'],['deplacer','Modifier les installations']]]],
    interieur:[['works','Travaux souhaités — peinture, sols, cloisons, électricité…',null]],
    facade:[['works','Intervention souhaitée et problèmes connus',null]],
    toiture:[['works','Intervention souhaitée et problèmes connus',null]],
    construction:[['works','Description de la construction ou de l’extension',null]],
    amenagement:[['works','Aménagement souhaité',null]],electricite:[['works','Installation ou travaux souhaités',null]]
  };
  function renderQuestions() {
    const unit=["fenetres","portes"].includes(state.workType);
    document.querySelector("#ai-est-measure-label").textContent=unit?`Nombre de ${state.workType==="fenetres"?"fenêtres":"portes"}`:"Surface concernée (m²)";
    form.elements.surface.step=unit?"1":"any";
    form.elements.surface.placeholder=unit?"4":"80";
    const finishField=document.querySelector("#ai-est-finish").closest(".tool-field");
    finishField.hidden=unit;
    if(unit) {state.finish="equilibre";form.elements.finish.value="equilibre";}
    details.innerHTML=(questionSets[state.workType]||[]).map(([key,label,options])=>`<div class="tool-field"><label for="ai-detail-${key}">${label}</label>${options?`<select id="ai-detail-${key}" name="detail_${key}">${options.map(([value,text])=>`<option value="${value}">${text}</option>`).join("")}</select>`:`<input id="ai-detail-${key}" name="detail_${key}" type="text" ${state.workType==="construction"?'required':''}>`}</div>`).join("");
    details.querySelectorAll("input,select").forEach(e=>{const key=e.name.slice(7); if(state.details[key])e.value=state.details[key];state.details[key]=e.value;});
  }
  function persist() {try {localStorage.setItem(storageKey,JSON.stringify({...state,lastEstimate:null}));} catch (_) {}}
  function value(selector,val) { const e=document.querySelector(selector);if(e)e.value=val; }
  function sync() {
    value("#ai-zone",["construction","amenagement"].includes(state.workType)?"interieur":state.workType);
    value("#ai-budget",state.desiredBudget==="moins-5000"?"eco":["15000-40000","plus-40000"].includes(state.desiredBudget)?"premium":"moyen");
    value("#ai-roadmap-type",state.workType==="construction"?"extension":state.workType==="amenagement"?"interieur":state.workType);
    value("#ai-roadmap-surface",state.surface);
    value("#ai-roadmap-occupancy",state.occupancy);
    value("#ai-roadmap-scope",state.details.scope==="partielle"?"rafraichissement":"renovation");
    value("#ai-roadmap-urgency",state.deadline==="urgent"?"haute":"normale");
    const service = types[state.workType] || "Rénovation intérieure";
    const serviceSelect = document.querySelector("#ai-booking-service");
    if (![...serviceSelect.options].some(option => option.value === service)) serviceSelect.add(new Option(service, service));
    value("#ai-booking-service", service);
  }
  function summary() {
    const range=state.lastEstimate;
    const rows=[["Projet",types[state.workType]||"À définir"],["Mesure",state.surface?formatAiQuantity(state.workType,state.surface):"À définir"],["Ville",state.city||"À définir"],["Budget envisagé",budgets[state.desiredBudget]],["Priorité",priorities[state.priority]],["Variante",state.originalQuantity?"Intervention prioritaire choisie":"Projet complet"]];
    if(range)rows.push(["Estimation",range.manual?"À étudier avec l’équipe":`${formatCurrency(range.min)} – ${formatCurrency(range.max)}`]);
    const html=rows.map(([label,text])=>`<div><span>${label}</span><strong>${escapeHtml(text)}</strong></div>`).join("");
    workspace.querySelector("[data-ai-summary]").innerHTML=html;
    document.querySelector("#ai-booking-summary").innerHTML=`<h4>Votre projet en bref</h4><div class="ai-summary-list">${html}</div>`;
    workspace.querySelector("[data-ai-status]").textContent=range?"Vous pouvez comparer les options et échanger avec notre équipe.":"Renseignez votre projet, puis calculez votre estimation.";
  }
  function invalidate() {
    const hadResult=Boolean(state.lastEstimate)||!document.querySelector("#ai-estimator-result").hidden;
    state.lastEstimate=null;
    ["#ai-material-result","#ai-roadmap-result","#ai-booking-result"].forEach(id=>{document.querySelector(id).hidden=true;});
    if(hadResult){const result=document.querySelector("#ai-estimator-result");result.innerHTML='<div class="ai-stale-notice" role="status">Votre projet a changé. Recalculez votre estimation.<button class="button small" type="button" data-ai-recalculate>Mettre à jour mon estimation</button></div>';result.hidden=false;}
    form.querySelector('button[type="submit"]').textContent=hadResult?"Mettre à jour mon estimation":"Obtenir mon estimation";
    persist();sync();summary();
  }
  function show(key,scroll=true) {
    if(key!=="project"&&!state.lastEstimate){show("project",false);const city=form.elements.city;city.setCustomValidity(city.value.trim()?"":"Indiquez la ville du chantier.");if(form.reportValidity())form.requestSubmit();return;}
    Object.entries(panels).forEach(([id,panel])=>{panel.hidden=id!==key;panel.classList.toggle("is-current",id===key);});
    menu.querySelectorAll("[data-ai-tab]").forEach(link=>{const active=link.dataset.aiTab===key;link.classList.toggle("is-active",active);link.setAttribute("aria-current",active?"step":"false");});
    if(scroll)workspace.scrollIntoView({behavior:"smooth",block:"start"});
  }
  document.querySelector('.hero-actions a[href="#outil-projet"]')?.addEventListener("click",e=>{e.preventDefault();show("project");});
  menu.addEventListener("click",e=>{const link=e.target.closest("[data-ai-tab]");if(link){e.preventDefault();show(link.dataset.aiTab);}});
  workspace.addEventListener("click",e=>{const go=e.target.closest("[data-ai-go]");if(go)show(go.dataset.aiGo);if(e.target.closest("[data-ai-recalculate]")){show("project",false);form.requestSubmit();}});
  form.addEventListener("input",e=>{
    if(e.target.name.startsWith("detail_"))state.details[e.target.name.slice(7)]=e.target.value;
    else if(fields[e.target.name])state[fields[e.target.name]]=e.target.value;
    if(e.target.name==="city")e.target.setCustomValidity("");
    if(e.target.name==="work_type"){state.details={};state.originalQuantity=null;renderQuestions();}
    if(e.target.name==="surface")state.originalQuantity=null;
    invalidate();
  });
  document.addEventListener("adaz:estimate",e=>{
    state.lastEstimate=e.detail;
    sync();summary();persist();
    document.querySelector("#ai-material-form").requestSubmit();
    document.querySelector("#ai-roadmap-form").dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));
    show("estimate");
  });
  workspace.querySelector("[data-ai-reset]").addEventListener("click", () => {
    Object.assign(state, defaults, {details:{}, lastEstimate:null, originalQuantity:null});
    form.reset();
    Object.entries(fields).forEach(([name,key]) => { form.elements[name].value = state[key]; });
    form.elements.city.setCustomValidity("");
    form.querySelector('button[type="submit"]').textContent = "Obtenir mon estimation";
    document.querySelector("#ai-booking-form").reset();
    aiBookingState.selectedSlotId = "";
    document.querySelector("#ai-booking-slot").value = "";
    document.querySelectorAll(".slot-pill").forEach(button => button.classList.remove("is-active"));
    document.querySelector("[data-ai-slot-field]").hidden = false;
    ["#ai-estimator-result", "#ai-material-result", "#ai-roadmap-result", "#ai-booking-result"].forEach(id => {
      const result = document.querySelector(id); result.hidden = true; result.replaceChildren();
    });
    renderQuestions(); sync(); summary(); show("project");
    try { localStorage.removeItem(storageKey); } catch (_) {}
  });
  const bookingService=document.querySelector("#ai-booking-service");bookingService.closest(".tool-field").hidden=true;
  document.querySelectorAll(".ai-tool-stack").forEach(stack=>{if(!stack.children.length)stack.closest("section")?.remove();});
  renderQuestions();sync();summary();show("project",false);
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

function formatChatMessage(text) {
  return escapeHtml(text).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
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
        service: "Créneau souhaité",
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

  const availabilityApiUrl = getConfiguredFunctionUrl("getAvailability", config.availabilityApiUrl || "");
  if (availabilityApiUrl) {
    try {
      const response = await fetch(`${availabilityApiUrl}?limit=${maxSlots}`);
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
  const form=document.querySelector("#ai-booking-form"),slotList=document.querySelector("#ai-slot-list"),slotInput=document.querySelector("#ai-booking-slot"),result=document.querySelector("#ai-booking-result");
  if(!form||!slotList||!result)return;
  const preference=form.elements.contact_preference;
  function renderSlots(){
    const slots=aiBookingState.slots;
    if(!slots.some(s=>s.id===aiBookingState.selectedSlotId))aiBookingState.selectedSlotId="";
    slotInput.value=aiBookingState.selectedSlotId;
    slotList.innerHTML=slots.map(slot=>`<button type="button" class="slot-pill ${slot.id===aiBookingState.selectedSlotId?"is-active":""}" data-slot-id="${escapeHtml(slot.id)}"><strong>${escapeHtml(formatBookingDateOnly(slot.start))}</strong><span>${escapeHtml(formatBookingSlot(slot.start))}</span><small>Créneau souhaité — à confirmer</small></button>`).join("");
    slotList.querySelectorAll("button").forEach(button=>button.addEventListener("click",()=>{aiBookingState.selectedSlotId=button.dataset.slotId;renderSlots();}));
  }
  loadAiBookingSlots().then(slots=>{aiBookingState.slots=slots;renderSlots();});
  watchAiBookingSlots(slots=>{aiBookingState.slots=slots;renderSlots();}).then(unsubscribe=>{if(typeof unsubscribe==="function")window.addEventListener("beforeunload",unsubscribe,{once:true});});
  preference.addEventListener("change",()=>{document.querySelector("[data-ai-slot-field]").hidden=preference.value==="callback";result.hidden=true;});
  form.addEventListener("submit", event => {
    event.preventDefault();
    result.innerHTML = '<div class="tool-result-card"><p>Pour transmettre votre demande à notre équipe, utilisez le formulaire Contact.</p><a class="button small" href="contact.html#contact-devis">Ouvrir le formulaire Contact</a></div>';
    result.hidden = false;
  });
}

function normalizeSiteSearch(value) {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/œ/g, "oe").replace(/[^a-z0-9]+/g, " ")
    .replace(/\b([a-z]{4,})s\b/g, "$1").trim();
}

function rankSiteSearch(records, query) {
  const tokens = normalizeSiteSearch(query).split(/\s+/).filter(token => token && !["de", "du", "des", "la", "le", "les", "a", "en", "et", "un", "une", "pour", "d", "l"].includes(token));
  if (!tokens.length) return [];
  return records.map(record => {
    const title = normalizeSiteSearch(record.title);
    const description = normalizeSiteSearch(record.description);
    const keywords = normalizeSiteSearch(record.keywords);
    const matches = tokens.every(token => `${title} ${description} ${keywords}`.includes(token));
    const score = matches ? tokens.reduce((total, token) => total + (title.includes(token) ? 12 : description.includes(token) ? 4 : 1), 0) : 0;
    return { record, score };
  }).filter(result => result.score).sort((a, b) => b.score - a.score).map(result => result.record);
}

function setupSearchTarget() {
  function reveal() {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    const group = target.dataset.group;
    if (group === "products" || group === "projects") {
      const filter = group === "products" ? (target.dataset.tags || "").split(" ")[0] : "all";
      document.querySelector(`[data-filter-group="${group}"] [data-filter="${filter}"]`)?.click();
      if (group === "products") document.querySelector(`[data-subfilter-panel="${filter}"] [data-subfilter="all"]`)?.click();
    } else if (target.tagName === "DETAILS") {
      target.open = true;
    } else return;
    window.requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "instant" }));
  }
  reveal();
  window.addEventListener("hashchange", reveal);
  document.addEventListener("productcataloguechange", reveal);
}

const adazChatCacheKey = "adazrenov-chat-session";
const adazChatIdleMs = 60 * 1000;

function readAdazChatCache() {
  try {
    const raw = sessionStorage.getItem(adazChatCacheKey);
    if (!raw) return null;
    if (raw.length > 200000) throw new Error("Conversation too large");
    const saved = JSON.parse(raw);
    if (saved.version !== 1 || !Number.isFinite(saved.expiresAt) || !Array.isArray(saved.messages)) {
      sessionStorage.removeItem(adazChatCacheKey);
      return null;
    }
    if (saved.expiresAt <= Date.now()) {
      sessionStorage.removeItem(adazChatCacheKey);
      window.dispatchEvent(new Event("adazchatcacheexpired"));
      return null;
    }
    const messages = saved.messages.slice(-60).filter(record =>
      ["user", "assistant"].includes(record?.role) && typeof record.text === "string" && record.text.length <= 5000 &&
      typeof record.timestamp === "string" && Number.isFinite(Date.parse(record.timestamp)) &&
      !(record.role === "assistant" && /^La limite de réponses personnalisées est atteinte/.test(record.text))
    );
    return messages.length ? { ...saved, messages, conversationId: String(saved.conversationId || "").slice(0, 80) } : null;
  } catch {
    try { sessionStorage.removeItem(adazChatCacheKey); } catch {}
    return null;
  }
}

function writeAdazChatCache(saved) {
  try {
    if (saved) sessionStorage.setItem(adazChatCacheKey, JSON.stringify(saved));
    else sessionStorage.removeItem(adazChatCacheKey);
  } catch {}
  window.dispatchEvent(new Event("adazchatcachechange"));
}

// Runs on every page, including when the assistant bundle has not been opened.
function setupAdazChatCacheExpiry() {
  if (window.ADAZ_CHAT_EXPIRY_READY) return;
  window.ADAZ_CHAT_EXPIRY_READY = true;
  let timer;
  function schedule() {
    window.clearTimeout(timer);
    const saved = readAdazChatCache();
    if (saved) timer = window.setTimeout(schedule, Math.min(adazChatIdleMs, Math.max(1, saved.expiresAt - Date.now())) + 10);
  }
  window.addEventListener("adazchatcachechange", schedule);
  window.addEventListener("pageshow", schedule);
  schedule();
}

function setupGlobalAdazaiWidget() {
  if (document.querySelector(".adazai-widget")) return;
  setupAdazChatCacheExpiry();

  const widget = document.createElement("div");
  widget.className = "adazai-widget";
  widget.innerHTML = `
    <button class="adazai-floating-cta" type="button" aria-label="Ouvrir l’assistant ADAZRENOV" aria-expanded="false" aria-controls="adazai-widget-panel">
      <span class="adazai-floating-cta-icon" aria-hidden="true"><img src="${headerLogoPath}" alt=""></span>
      <span class="adazai-floating-cta-title">Ask ADAZRENOV</span>
    </button>
    <aside class="adazai-widget-panel" id="adazai-widget-panel" aria-label="Votre assistant ADAZRENOV" hidden>
      <div class="adazai-widget-header">
      <div class="adazai-chat-head">
        <img class="adazai-chat-logo" src="${headerLogoPath}" alt="">
        <div class="adazai-chat-title">
          <strong>ADAZRENOV</strong>
          <span>Votre assistant personnel · 24/7</span>
        </div>
        <div class="adazai-head-actions">
          <button class="adazai-chat-clear" type="button" title="Effacer la conversation" aria-label="Effacer la conversation et recommencer">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10a9 9 0 1 1 2.7 8.4M3 4v6h6"/></svg>
          </button>
          <button class="adazai-widget-close" type="button" aria-label="Fermer votre assistant ADAZRENOV">×</button>
        </div>
      </div>
      <div class="adazai-mode-bar">
        <button type="button" class="adazai-open-search">Rechercher sur le site</button>
        <button type="button" class="adazai-back-chat" hidden>Retour à la conversation</button>
      </div>
      </div>
      <section class="adazai-site-search" aria-label="Recherche sur le site" hidden>
        <form class="adazai-search-form" role="search">
          <input type="search" aria-label="Rechercher dans le site" placeholder="Fenêtres, salle de bain, devis…" autocomplete="off" maxlength="160">
          <button type="button" class="adazai-search-clear" aria-label="Effacer la recherche">Effacer</button>
        </form>
        <div class="adazai-search-results">
          <button type="button" class="adazai-ask-search">
            <img src="${headerLogoPath}" alt="">
            <span><strong>Demander à ADAZRENOV</strong><small>Posez votre question à notre assistant.</small></span>
          </button>
          <p class="adazai-search-status" role="status" aria-live="polite"></p>
          <div class="adazai-search-matches"></div>
        </div>
        <p class="adazai-search-help">↑ ↓ pour naviguer · Échap pour revenir au chat</p>
      </section>
      <div class="adazai-widget-log" role="log" aria-label="Conversation avec ADAZAI" aria-live="polite" tabindex="0"></div>
      <form class="adazai-widget-form">
        <input type="text" autocomplete="off" aria-label="Votre message" placeholder="Écrivez votre question...">
        <button class="button small" data-chat-send type="submit" aria-label="Envoyer" disabled>→</button>
        <button class="button small adazai-stop" type="button" aria-label="Arrêter la réponse" hidden>Stop</button>
      </form>
    </aside>
  `;

  document.body.appendChild(widget);

  const toggle = widget.querySelector(".adazai-floating-cta");
  const panel = widget.querySelector(".adazai-widget-panel");
  const closeButton = widget.querySelector(".adazai-widget-close");
  const clearChatButton = widget.querySelector(".adazai-chat-clear");
  const form = widget.querySelector(".adazai-widget-form");
  const input = widget.querySelector(".adazai-widget-form input");
  const log = widget.querySelector(".adazai-widget-log");
  const sendButton = form.querySelector("[data-chat-send]");
  const stopButton = form.querySelector(".adazai-stop");
  const searchView = widget.querySelector(".adazai-site-search");
  const searchButton = widget.querySelector(".adazai-open-search");
  const backButton = widget.querySelector(".adazai-back-chat");
  const searchInput = widget.querySelector(".adazai-search-form input");
  const clearSearch = widget.querySelector(".adazai-search-clear");
  const matchesRoot = widget.querySelector(".adazai-search-matches");
  const searchStatus = widget.querySelector(".adazai-search-status");
  const askSearch = widget.querySelector(".adazai-ask-search");
  let searchPromise = null;
  let searchVersion = 0;
  let searchTimer = null;
  let typingBubble = null;
  let activeTurn = null;
  let followTail = true;

  const state = { messages: [], conversationId: "" };
  let conversationVersion = 0;
  let heartbeat = null;
  const localTime = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  function focusInputOnDesktop(field) {
    if (!window.matchMedia("(max-width: 640px), (pointer: coarse)").matches) {
      field.focus({ preventScroll: true });
    }
  }

  function showConversation(focus = true) {
    searchVersion += 1;
    window.clearTimeout(searchTimer);
    searchView.hidden = true;
    log.hidden = false;
    form.hidden = false;
    searchButton.hidden = false;
    backButton.hidden = true;
    if (focus && !input.disabled) focusInputOnDesktop(input);
    scrollLog();
  }

  function showSearch() {
    if (activeTurn) return;
    log.hidden = true;
    form.hidden = true;
    searchView.hidden = false;
    searchButton.hidden = true;
    backButton.hidden = false;
    renderSearch();
    focusInputOnDesktop(searchInput);
  }

  function loadSearchIndex() {
    if (!searchPromise) searchPromise = fetch(adazSiteSearchUrl)
      .then(response => {
        if (!response.ok) throw new Error("Search index unavailable");
        return response.json();
      }).then(records => {
        if (!Array.isArray(records)) throw new Error("Invalid search index");
        return records.filter(record => typeof record.title === "string" && typeof record.href === "string" && record.href.startsWith("/") && !record.href.startsWith("//"));
      }).catch(error => { searchPromise = null; throw error; });
    return searchPromise;
  }

  function renderSearchLink(record) {
    const result = document.createElement("article");
    result.className = "adazai-search-result";
    const link = document.createElement("a");
    link.className = "adazai-search-result-link";
    link.href = record.href;
    link.addEventListener("click", persistConversation);
    const heading = document.createElement("div");
    heading.className = "adazai-search-result-heading";
    const title = document.createElement("strong");
    title.textContent = record.title;
    const type = document.createElement("span");
    type.className = "adazai-search-type";
    type.textContent = record.type;
    link.appendChild(title);
    heading.append(link, type);
    result.appendChild(heading);
    if (!record.question) {
      const description = document.createElement("p");
      const full = String(record.description || "");
      description.textContent = full.length > 145 ? full.slice(0, 142) + "…" : full;
      result.appendChild(description);
    }
    const question = record.question || (record.type === "FAQ" ? record.title : `Que pouvez-vous me dire sur « ${record.title} » ?`);
    const ask = document.createElement("button");
    ask.type = "button";
    ask.className = "adazai-search-question";
    ask.setAttribute("aria-label", `Poser la question : ${question}`);
    const text = document.createElement("span");
    text.textContent = question;
    ask.appendChild(text);
    ask.addEventListener("click", () => {
      showConversation(false);
      sendMessage(question);
    });
    result.appendChild(ask);
    matchesRoot.appendChild(result);
  }

  async function renderSearch() {
    const version = ++searchVersion;
    const query = searchInput.value.trim();
    clearSearch.hidden = !query;
    askSearch.querySelector("strong").textContent = query ? `Demander à ADAZRENOV : ${query}` : "Demander à ADAZRENOV";
    matchesRoot.replaceChildren();
    if (!query) {
      searchStatus.textContent = "Accès rapides";
      [
        { title: "Nos services", type: "Service", href: "/services", question: "Quels travaux réalisez-vous ?" },
        { title: "Portes, fenêtres et volets", type: "Produit", href: "/produits", question: "Que trouve-t-on dans votre catalogue ?" },
        { title: "Nos réalisations", type: "Projet", href: "/projets", question: "Quels projets avez-vous réalisés ?" },
        { title: "Demander un devis gratuit", type: "Contact", href: "/contact#contact-devis", question: "Comment demander un devis ?" },
      ].forEach(renderSearchLink);
      return;
    }
    searchStatus.textContent = "Recherche en cours…";
    try {
      const records = await loadSearchIndex();
      if (version !== searchVersion || searchView.hidden) return;
      const results = rankSiteSearch(records, query);
      results.slice(0, 8).forEach(renderSearchLink);
      searchStatus.textContent = results.length ? `${results.length} résultat${results.length > 1 ? "s" : ""}${results.length > 8 ? " — les 8 plus pertinents" : ""}` : "Aucun résultat. Essayez un autre mot ou posez votre question à ADAZRENOV.";
    } catch {
      if (version !== searchVersion || searchView.hidden) return;
      searchStatus.textContent = "La recherche est momentanément indisponible.";
      const retry = document.createElement("button");
      retry.type = "button";
      retry.className = "adazai-search-retry";
      retry.textContent = "Réessayer";
      retry.addEventListener("click", renderSearch);
      matchesRoot.appendChild(retry);
    }
  }

  searchButton.addEventListener("click", showSearch);
  backButton.addEventListener("click", () => showConversation());
  searchInput.addEventListener("input", () => {
    searchVersion += 1;
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(renderSearch, 120);
  });
  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    renderSearch();
    focusInputOnDesktop(searchInput);
  });
  askSearch.addEventListener("click", () => {
    const query = searchInput.value.trim();
    showConversation();
    if (query) sendMessage(query);
  });
  widget.querySelector(".adazai-search-form").addEventListener("submit", event => {
    event.preventDefault();
    askSearch.click();
  });
  searchView.addEventListener("keydown", event => {
    if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
    const items = [askSearch, ...matchesRoot.querySelectorAll("a, button")];
    const current = items.indexOf(document.activeElement);
    const next = current < 0 ? (event.key === "ArrowDown" ? 0 : items.length - 1) : (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    event.preventDefault();
    items[next].focus();
  });

  function scrollLog() {
    if (followTail) log.scrollTop = log.scrollHeight;
  }

  log.addEventListener("scroll", () => {
    followTail = log.scrollHeight - log.scrollTop - log.clientHeight < 48;
  }, { passive: true });

  function appendMessage(role, text, saved = null) {
    const sentAt = new Date(saved?.timestamp || Date.now());
    const row = document.createElement("div");
    row.className = `adazai-message-row ${role}`;
    const stack = document.createElement("div");
    stack.className = "adazai-message-stack";
    const bubble = document.createElement("div");
    bubble.className = `chat-message ${role}`;
    const paragraph = document.createElement("p");
    paragraph.innerHTML = formatChatMessage(text);
    bubble.appendChild(paragraph);
    const timestamp = document.createElement("time");
    timestamp.className = "adazai-message-time";
    timestamp.dateTime = sentAt.toISOString();
    timestamp.textContent = localTime.format(sentAt);
    timestamp.title = sentAt.toLocaleString();
    stack.append(bubble, timestamp);
    row.appendChild(stack);
    log.appendChild(row);
    scrollLog();
    const record = { ...saved, role, text, timestamp: sentAt.toISOString() };
    state.messages.push(record);
    return { row, stack, paragraph, record };
  }

  function waitForTurn(ms, signal) {
    return new Promise((resolve, reject) => {
      if (signal.aborted) return reject(new DOMException("Interrupted", "AbortError"));
      const onAbort = () => {
        window.clearTimeout(timer);
        reject(new DOMException("Interrupted", "AbortError"));
      };
      const timer = window.setTimeout(() => {
        signal.removeEventListener("abort", onAbort);
        resolve();
      }, ms);
      signal.addEventListener("abort", onAbort, { once: true });
    });
  }

  async function animateMessage(role, text, turn) {
    const signal = turn.controller.signal;
    if (signal.aborted) throw new DOMException("Interrupted", "AbortError");
    if (role === "user") {
      const message = appendMessage(role, text);
      turn.userMessage = message;
      return message;
    }
    const message = appendMessage(role, "");
    if (role === "user") turn.userMessage = message;
    else turn.assistantMessage = message;
    message.row.setAttribute("aria-busy", "true");
    const characters = Array.from(text);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chunkSize = Math.max(3, Math.ceil(characters.length / 220));
    try {
      if (reducedMotion) {
        message.record.text = text;
        message.paragraph.textContent = text;
      } else {
        for (let end = chunkSize; end < characters.length + chunkSize; end += chunkSize) {
          if (signal.aborted) throw new DOMException("Interrupted", "AbortError");
          message.record.text = characters.slice(0, end).join("");
          message.paragraph.textContent = message.record.text;
          scrollLog();
          if (end < characters.length) await waitForTurn(24, signal);
        }
      }
      return message;
    } finally {
      message.paragraph.innerHTML = formatChatMessage(message.record.text);
      message.row.setAttribute("aria-busy", "false");
      scrollLog();
    }
  }

  function addAnswerActions(message, links = [], interrupted = false, questions = []) {
    if (message.actionsAdded) return;
    message.actionsAdded = true;
    links = (Array.isArray(links) ? links : []).filter(link => {
      if (typeof link?.label !== "string" || typeof link?.href !== "string" || link.href.includes("\\")) return false;
      try { return ["http:", "https:"].includes(new URL(link.href, window.location.href).protocol); } catch { return false; }
    }).slice(0, 3);
    questions = (Array.isArray(questions) ? questions : []).filter(question => typeof question === "string" && question.trim() && question.length <= 180).slice(0, 2);
    message.record.links = links;
    message.record.questions = questions;
    message.record.interrupted = interrupted;
    if (interrupted) {
      const note = document.createElement("span");
      note.className = "adazai-interrupted-note";
      note.textContent = "Réponse interrompue.";
      message.stack.appendChild(note);
    }
    if (links.length && !interrupted) {
      const usefulLinks = document.createElement("nav");
      usefulLinks.className = "adazai-answer-links";
      usefulLinks.setAttribute("aria-label", "Liens utiles pour cette réponse");
      links.forEach(({ label, href }) => {
        const link = document.createElement("a");
        link.textContent = label;
        link.href = href;
        link.addEventListener("click", persistConversation);
        usefulLinks.appendChild(link);
      });
      message.stack.appendChild(usefulLinks);
    }
    if (questions.length && !interrupted) {
      appendQuestionButtons(message.stack, questions.map(question => ({ question })), true);
    }
    scrollLog();
  }

  function setBusy(busy) {
    input.disabled = busy;
    sendButton.hidden = busy;
    sendButton.disabled = busy || !input.value.trim();
    stopButton.hidden = !busy;
    log.setAttribute("aria-busy", String(busy));
    searchButton.disabled = busy;
  }

  function cancelTurn(silent = false) {
    if (!activeTurn) return;
    activeTurn.controller.abort();
    if (silent) {
      conversationVersion += 1;
      activeTurn = null;
      hideTyping();
      setBusy(false);
    }
  }

  function getPreparedQuestions() {
    return [
      {
        question: "Quels travaux réalisez-vous ?",
        links: [{ label: "Voir nos services", href: "/services" }, { label: "Voir nos produits", href: "/produits" }],
        answer: "ADAZ RENOV réalise des travaux de rénovation intérieure et extérieure : fourniture et pose de fenêtres, rénovation de salles de bain, installation électrique, interphones et visiophones, maçonnerie, peinture et décoration.\n\nQuel type de travaux envisagez-vous ? Vous pouvez découvrir notre offre sur la page Services.",
      },
      {
        question: "Comment demander un devis ?",
        links: [{ label: "Demander un devis", href: "/contact#contact-devis" }],
        answer: "Vous pouvez utiliser le formulaire de la page Contact ou appeler notre équipe au +33 1 86 04 74 68. Indiquez les travaux souhaités, la ville du chantier et, si vous la connaissez, la surface concernée. Le devis est gratuit et sans engagement.",
      },
      {
        question: "Où intervenez-vous ?",
        links: [{ label: "Contacter notre équipe", href: "/contact" }],
        answer: "Notre entreprise est située à Noiseau, dans le Val-de-Marne. Nous intervenons principalement à Paris et en Île-de-France. Pour un chantier dans une autre ville, contactez notre équipe afin de vérifier notre disponibilité.",
      },
      {
        question: "Comment estimer mes travaux ?",
        links: [{ label: "Estimer mes travaux", href: "/ia-travaux#outil-projet" }],
        answer: "Oui. L’outil de la page Assistant IA vous permet de renseigner le type de travaux, la surface ou le nombre d’éléments et la ville du chantier pour obtenir une première fourchette indicative. Cette estimation ne remplace pas un devis : notre équipe confirme les travaux et le prix après étude de votre projet.",
      },
    ];
  }

  const allowanceStorageKey = "adazrenov-chat-simple-until";
  let simpleUntil = 0;
  function isSimpleMode() {
    try { simpleUntil = Math.max(simpleUntil, Number(localStorage.getItem(allowanceStorageKey)) || 0); } catch {}
    return Date.now() < simpleUntil;
  }

  function enterSimpleMode(retryAfter) {
    simpleUntil = Date.now() + Math.max(1, Math.min(86400, Number(retryAfter) || 600)) * 1000;
    try { localStorage.setItem(allowanceStorageKey, String(simpleUntil)); } catch {}
  }

  function getPreparedAnswer(message, suggestion) {
    return (suggestion?.answer ? suggestion : getPreparedQuestions().find(item => item.question === message)) || {
      answer: "Choisissez une question ci-dessous pour obtenir des informations sur nos services, les devis ou notre zone d’intervention. Pour une demande précise, contactez notre équipe.",
      links: [{ label: "Contacter notre équipe", href: "/contact" }],
    };
  }

  function appendQuestionButtons(root, questions, followUp = false) {
    const suggestions = document.createElement("div");
    suggestions.className = `adazai-suggestions${followUp ? " adazai-followup-questions" : ""}`;
    suggestions.setAttribute("role", "group");
    suggestions.setAttribute("aria-label", followUp ? "Continuer la conversation" : "Questions pour commencer");
    questions.forEach(({ question, answer, links }, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "adazai-suggestion";
      button.style.setProperty("--question-delay", `${180 + index * 130}ms`);
      const text = document.createElement("span");
      text.textContent = question;
      const arrow = document.createElement("span");
      arrow.className = "adazai-suggestion-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "→";
      button.append(text, arrow);
      button.addEventListener("click", () => sendMessage(question, answer ? { answer, links } : null));
      suggestions.appendChild(button);
    });
    root.appendChild(suggestions);
  }

  function showSuggestedQuestions(resetScroll = true) {
    appendQuestionButtons(log, getPreparedQuestions());
    if (resetScroll) log.scrollTop = 0;
    else scrollLog();
  }

  function showTyping() {
    hideTyping();
    typingBubble = document.createElement("div");
    typingBubble.className = "adazai-message-row assistant is-typing-row";
    typingBubble.innerHTML = '<div class="adazai-message-stack"><div class="chat-message assistant is-typing"><span class="adazai-typing-label">ADAZRENOV écrit…</span><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div></div>';
    log.appendChild(typingBubble);
    scrollLog();
  }

  function hideTyping() {
    if (typingBubble) {
      typingBubble.remove();
      typingBubble = null;
    }
  }

  function persistConversation() {
    if (!state.messages.length) return;
    writeAdazChatCache({
      version: 1,
      expiresAt: Date.now() + adazChatIdleMs,
      messages: state.messages.slice(-60),
      conversationId: state.conversationId,
      scrollTop: log.scrollTop,
      followTail
    });
  }

  function stopPersistence() {
    window.clearInterval(heartbeat);
    heartbeat = null;
  }

  function startPersistence() {
    stopPersistence();
    persistConversation();
    heartbeat = window.setInterval(() => {
      if (!panel.hidden && document.visibilityState !== "hidden") persistConversation();
    }, 10000);
  }

  function suspendConversation() {
    stopPersistence();
    if (panel.hidden) return;
    if (activeTurn) {
      const partial = activeTurn.assistantMessage;
      cancelTurn(true);
      if (partial?.record.text) addAnswerActions(partial, [], true);
      else appendMessage("assistant", "Réponse interrompue. Vous pouvez poser une autre question.");
    }
    persistConversation();
  }

  function resetConversationDisplay() {
    conversationVersion += 1;
    cancelTurn(true);
    hideTyping();
    state.messages = [];
    state.conversationId = "";
    log.replaceChildren();
    form.reset();
    searchInput.value = "";
    setBusy(false);
    followTail = true;
  }

  function showWelcomeMessage() {
    appendMessage(
      "assistant",
      document.body.dataset.page === "ai"
        ? "Bonjour et bienvenue ! Je suis l’assistant virtuel d’ADAZ RENOV. Je peux vous aider à comprendre votre estimation et à préparer vos travaux.\n\nÉcrivez-moi ou choisissez une question ci-dessous 👇"
        : "Bonjour et bienvenue ! Je suis l’assistant virtuel d’ADAZ RENOV. Une question sur notre entreprise ou vos travaux ? Je suis là pour vous aider.\n\nÉcrivez-moi ou choisissez une question ci-dessous 👇"
    );
    showSuggestedQuestions();
  }

  function showSimpleAnswerLabel(message) {
    message.record.simpleAnswer = true;
    const label = document.createElement("span");
    label.className = "adazai-interrupted-note";
    label.textContent = "Réponse prédéfinie · sans IA";
    message.stack.appendChild(label);
  }

  function restoreConversation(saved) {
    state.conversationId = saved.conversationId;
    saved.messages.forEach((record, index) => {
      const message = appendMessage(record.role, record.text, record);
      if (record.role === "assistant") {
        addAnswerActions(message, record.links, record.interrupted, index === saved.messages.length - 1 ? record.questions : []);
        if (record.simpleAnswer) showSimpleAnswerLabel(message);
      }
    });
    if (!state.messages.some(record => record.role === "user") || isSimpleMode()) showSuggestedQuestions(false);
    followTail = saved.followTail !== false;
    log.scrollTop = Number(saved.scrollTop) || 0;
    if (followTail) scrollLog();
  }

  function resumeConversation() {
    const saved = readAdazChatCache();
    resetConversationDisplay();
    showConversation(false);
    if (saved) restoreConversation(saved);
    else showWelcomeMessage();
    startPersistence();
  }

  async function getRemoteWidgetAnswer(message, signal) {
    const apiUrl = getConfiguredFunctionUrl("adazChat", window.AI_AISSTEN_CHAT_CONFIG?.apiUrl || "");
    if (!apiUrl) throw new Error("Chat API is not configured.");
    const project = document.body.dataset.page === "ai" ? getSavedAiProject() : null;

    const response = await fetch(apiUrl, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        ...(project?.workType ? { projectContext: { type: project.workType, quantite: project.surface, ville: project.city, priorite: project.priority, details: project.details, estimation: project.lastEstimate, estimationARecalculer: !project.lastEstimate } } : {}),
        conversationId: state.conversationId,
        context: "ADAZ RENOV global website assistant",
        page: document.body.dataset.page || "",
        url: window.location.href,
      }),
    });

    if (!response.ok) {
      let details = {};
      try { details = await response.json(); } catch {}
      throw Object.assign(new Error(`Chat API unavailable: ${response.status}`), {
        simpleMode: response.status === 429 && details.mode === "simple",
        retryAfter: details.retryAfter
      });
    }
    const data = await response.json();
    const answer = String(data.answer || "").trim();
    if (!answer) throw new Error("Chat API returned an empty answer.");
    const links = (Array.isArray(data.links) ? data.links : []).filter(link =>
      typeof link?.label === "string" && typeof link?.href === "string" && link.href.startsWith("/") && !link.href.startsWith("//") && !link.href.includes("\\")
    ).slice(0, 3);
    const questions = [...new Set((Array.isArray(data.questions) ? data.questions : [])
      .filter(question => typeof question === "string" && question.trim() && question.length <= 180)
      .map(question => question.trim()))].slice(0, 2);
    return { answer, links, questions, conversationId: String(data.conversationId || "") };
  }

  function openWidget() {
    if (!panel.hidden) return;
    panel.hidden = false;
    widget.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    resumeConversation();
    window.setTimeout(() => {
      if (!panel.hidden) focusInputOnDesktop(input);
    }, 40);
  }

  function closeWidget() {
    suspendConversation();
    panel.hidden = true;
    widget.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus({ preventScroll: true });
  }

  toggle.addEventListener("click", () => {
    if (panel.hidden) openWidget();
    else closeWidget();
  });

  closeButton.addEventListener("click", closeWidget);
  clearChatButton.addEventListener("click", () => {
    stopPersistence();
    writeAdazChatCache(null);
    resetConversationDisplay();
    showConversation(false);
    showWelcomeMessage();
    startPersistence();
  });
  window.addEventListener("adazchatcacheexpired", () => {
    stopPersistence();
    resetConversationDisplay();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") suspendConversation();
    else if (!panel.hidden) resumeConversation();
  });
  window.addEventListener("pagehide", () => {
    suspendConversation();
    panel.hidden = true;
    widget.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
  async function sendMessage(text, suggestion = null) {
    const message = text.trim();
    if (!message || activeTurn || panel.hidden) return;
    log.querySelectorAll(".adazai-suggestions").forEach(questions => questions.remove());
    state.messages.forEach(record => { record.questions = []; });
    input.value = "";
    followTail = true;
    const turn = { controller: new AbortController(), version: conversationVersion };
    activeTurn = turn;
    setBusy(true);
    try {
      await animateMessage("user", message, turn);
      showTyping();
      let answer;
      let answerLinks = suggestion?.links || [];
      let answerQuestions = [];
      if (isSimpleMode()) {
        const prepared = getPreparedAnswer(message, suggestion);
        await waitForTurn(280, turn.controller.signal);
        answer = prepared.answer;
        answerLinks = prepared.links;
      } else {
        try {
          const response = await getRemoteWidgetAnswer(message, turn.controller.signal);
          if (turn.version !== conversationVersion) return;
          state.conversationId = response.conversationId || state.conversationId;
          answer = response.answer;
          answerLinks = response.links;
          answerQuestions = response.questions;
        } catch (error) {
          if (!error.simpleMode) throw error;
          enterSimpleMode(error.retryAfter);
          const prepared = getPreparedAnswer(message, suggestion);
          answer = prepared.answer;
          answerLinks = prepared.links;
        }
      }
      if (turn.version !== conversationVersion) return;
      hideTyping();
      const responseMessage = await animateMessage("assistant", answer, turn);
      addAnswerActions(responseMessage, answerLinks, false, answerQuestions);
      if (isSimpleMode()) {
        showSimpleAnswerLabel(responseMessage);
        showSuggestedQuestions(false);
      }
    } catch (error) {
      if (turn.version !== conversationVersion) return;
      hideTyping();
      if (error.name === "AbortError") {
        if (turn.userMessage) {
          turn.userMessage.record.text = message;
          turn.userMessage.paragraph.textContent = message;
        }
        if (turn.assistantMessage?.record.text) addAnswerActions(turn.assistantMessage, [], true);
        else appendMessage("assistant", "Réponse interrompue. Vous pouvez poser une autre question.");
      } else {
        console.warn("ADAZAI chat unavailable.", error);
        const failure = appendMessage("assistant", "Le chat est momentanément indisponible. Vous pouvez réessayer ou contacter notre équipe au +33 1 86 04 74 68 ou à adazrenov@gmail.com.");
        addAnswerActions(failure, [{ label: "Contacter notre équipe", href: "/contact" }]);
      }
    } finally {
      if (activeTurn === turn) {
        activeTurn = null;
        setBusy(false);
        persistConversation();
        if (!panel.hidden) focusInputOnDesktop(input);
      }
    }
  }

  stopButton.addEventListener("click", () => cancelTurn());
  input.addEventListener("input", () => { sendButton.disabled = !input.value.trim() || !!activeTurn; });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage(input.value);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      event.preventDefault();
      if (!searchView.hidden) showConversation();
      else closeWidget();
    }
  });

  document.querySelectorAll("[data-open-adazai-widget]").forEach((button) => {
    button.addEventListener("click", openWidget);
  });

}

function setAdazAnalyticsConsent(allowed) {
  const measurementId = "G-BHFBX11D7X";
  const state = window.ADAZ_ANALYTICS_STATE ||= { enabled: false, configured: false };
  // Keep local development out of the production property's reports.
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
  const enabled = allowed === true && !local;
  window[`ga-disable-${measurementId}`] = !enabled;

  if (!enabled) {
    state.enabled = false;
    const domains = window.location.hostname.split(".");
    const cookieNames = ["_ga", "_ga_BHFBX11D7X"];
    cookieNames.forEach(name => {
      document.cookie = `${name}=; Max-Age=0; path=/`;
      for (let i = 0; i < domains.length - 1; i += 1) {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=${domains.slice(i).join(".")}`;
      }
    });
    return;
  }
  if (state.enabled) return;
  state.enabled = true;
  window.dataLayer ||= [];
  window.gtag ||= function () { window.dataLayer.push(arguments); };
  const deniedAds = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
  const pageLocation = window.location.origin + window.location.pathname;
  let pageReferrer = "";
  try {
    const referrer = new URL(document.referrer);
    pageReferrer = referrer.origin + referrer.pathname;
  } catch {}

  if (!state.configured) {
    window.gtag("consent", "default", { analytics_storage: "denied", ...deniedAds });
    window.gtag("consent", "update", { analytics_storage: "granted", ...deniedAds });
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 365 * 86400,
      cookie_update: false,
      page_location: pageLocation,
      page_referrer: pageReferrer,
    });
    state.configured = true;
    const tag = document.createElement("script");
    tag.id = "adaz-google-analytics";
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    tag.onerror = () => {
      tag.remove();
      state.configured = false;
      state.enabled = false;
    };
    document.head.appendChild(tag);
  } else {
    window.gtag("event", "page_view", { send_to: measurementId, page_location: pageLocation, page_referrer: pageReferrer });
  }
}

function setupCookieConsent() {
  if (document.querySelector(".cookie-banner")) return;
  const storageKey = "adazrenov-cookie-preferences-v1";
  let preferences = null;
  let returnFocus = null;
  function readPreferences() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      const now = Date.now();
      if (saved?.version === 2 && typeof saved.external === "boolean" && typeof saved.analytics === "boolean" &&
          Number.isFinite(saved.savedAt) && Number.isFinite(saved.expiresAt) &&
          saved.savedAt <= now && saved.expiresAt > now &&
          saved.expiresAt <= saved.savedAt + 184 * 86400000) return saved;
      localStorage.removeItem(storageKey);
    } catch {}
    return null;
  }
  preferences = readPreferences();
  const banner = document.createElement("section");
  banner.className = "cookie-banner";
  banner.setAttribute("aria-label", "Préférences de confidentialité");
  banner.innerHTML = `
    <div class="cookie-banner-intro">
      <img src="${headerLogoPath}" width="38" height="44" alt="">
      <div><h2>Cookies : vous avez le choix</h2>
        <p>Les cookies nécessaires permettent au site de fonctionner. Avec votre accord, Google Analytics mesure les visites et Google Maps affiche notre adresse. Vous pouvez les refuser et continuer à utiliser le site.
          <a href="politique-confidentialite.html#cookies">Comprendre l’utilisation des cookies</a></p></div>
    </div>
    <div class="cookie-actions">
      <button type="button" class="cookie-button cookie-reject" data-cookie-refuse>Tout refuser</button>
      <button type="button" class="cookie-button cookie-accept" data-cookie-accept>Tout accepter</button>
    </div>
    <button type="button" class="cookie-personalize" data-cookie-settings>Choisir mes préférences</button>`;
  const dialog = document.createElement("dialog");
  dialog.id = "cookie-preferences";
  dialog.className = "cookie-dialog";
  dialog.hidden = true;
  dialog.setAttribute("aria-labelledby", "cookie-dialog-title");
  dialog.setAttribute("aria-describedby", "cookie-dialog-description");
  dialog.innerHTML = `
    <div class="cookie-dialog-body">
      <button type="button" class="cookie-dialog-close" aria-label="Fermer sans modifier mes choix">Fermer</button>
      <span class="eyebrow">ADAZ RENOV · CONFIDENTIALITÉ</span>
      <h2 id="cookie-dialog-title">Choisissez ce que vous autorisez</h2>
      <p id="cookie-dialog-description">Les fonctions nécessaires restent actives. Vous choisissez séparément si vous autorisez les statistiques Google Analytics et la carte Google Maps.</p>
      <p>Votre refus n’empêche pas de consulter le site, de demander un devis ou d’utiliser l’assistant.</p>
      <a href="politique-confidentialite.html#cookies">Voir les données utilisées et leur durée de conservation</a>
      <h3>Mes choix pour ce site</h3>
      <div class="cookie-category">
        <details><summary>Fonctions nécessaires du site</summary>
          <p>Ces fonctions restent disponibles lorsque vous refusez la carte Google Maps. Elles utilisent le stockage de votre navigateur pour les besoins suivants :</p>
          <p><strong>Vos préférences :</strong> conserver votre acceptation ou votre refus pendant six mois, afin de ne pas vous redemander à chaque page.</p>
          <p><strong>Votre estimation :</strong> retrouver les travaux, la surface, la ville et les autres informations que vous avez saisies. Elles restent dans ce navigateur jusqu’à la réinitialisation du projet ou à l’effacement des données du site.</p>
          <p><strong>Votre chat :</strong> reprendre la conversation après un changement de page. La copie locale est effacée après une minute sans rouvrir le chat une fois celui-ci fermé. Cela ne supprime pas les échanges enregistrés côté serveur.</p>
          <p><strong>La protection de l’assistant :</strong> mémoriser une limite temporaire de demandes pour éviter les abus, pendant le délai indiqué, au maximum 24 heures.</p>
          <p>Ce stockage ne sert pas à vous adresser de la publicité.</p>
        </details>
        <span class="cookie-always-active">Toujours actif</span>
      </div>
      <div class="cookie-category">
        <details><summary>Statistiques Google Analytics · facultatives</summary>
          <p>Avec votre accord, Google Analytics mesure les visites et les pages consultées pour nous aider à améliorer le site. Google reçoit des informations de navigation et de connexion. Les cookies de statistiques ont une durée maximale d’un an.</p>
          <p>Sans votre accord, Google Analytics ne se charge pas. Vous pouvez retirer cet accord ici à tout moment. Les fonctions publicitaires sont désactivées.</p>
          <a href="https://policies.google.com/privacy?hl=fr" target="_blank" rel="noopener noreferrer">Confidentialité chez Google</a>
        </details>
        <input type="checkbox" role="switch" class="cookie-switch cookie-analytics-switch" aria-label="Autoriser les statistiques Google Analytics">
      </div>
      <div class="cookie-category">
        <details><summary>Carte Google Maps · facultative</summary>
          <p><strong>Si vous l’autorisez :</strong> la carte de notre adresse à Noiseau peut se charger sur la page Contact. Votre navigateur contacte Google, qui reçoit notamment votre adresse IP et des informations techniques sur votre navigateur. Google peut aussi déposer ou lire ses propres cookies.</p>
          <p><strong>Si vous la refusez :</strong> la carte intégrée reste bloquée. Notre adresse reste visible et le lien « Ouvrir Google Maps » permet de consulter la carte directement sur le site de Google.</p>
          <p>Vous pouvez retirer votre accord ici à tout moment. La carte intégrée est alors désactivée ; ce retrait n’efface pas les données ou cookies déjà reçus par Google.</p>
          <a href="https://policies.google.com/privacy?hl=fr" target="_blank" rel="noopener noreferrer">Comment Google utilise vos données</a>
        </details>
        <input type="checkbox" role="switch" class="cookie-switch cookie-external-switch" aria-label="Autoriser la carte intégrée Google Maps sur la page Contact">
      </div>
      <p class="cookie-dialog-note">« Tout accepter » autorise les statistiques et la carte. « Tout refuser » les bloque. « Enregistrer mes choix » applique vos réglages. Fermer la fenêtre ne modifie pas vos choix. Ils sont conservés six mois et peuvent être modifiés via « Préférences cookies » en bas du site.</p>
    </div>
    <div class="cookie-dialog-actions">
      <button type="button" class="cookie-button cookie-reject" data-cookie-refuse>Tout refuser</button>
      <button type="button" class="cookie-button cookie-accept" data-cookie-accept>Tout accepter</button>
      <button type="button" class="cookie-button cookie-confirm">Enregistrer mes choix</button>
    </div>`;
  document.body.append(banner, dialog);
  const externalSwitch = dialog.querySelector(".cookie-external-switch");
  const analyticsSwitch = dialog.querySelector(".cookie-analytics-switch");
  function applyPreferences() {
    setAdazAnalyticsConsent(preferences?.analytics === true);
    document.querySelectorAll("iframe[data-consent-src]").forEach(frame => {
      const allowed = preferences?.external === true;
      if (allowed) {
        if (!frame.hasAttribute("src")) frame.src = frame.dataset.consentSrc;
      } else frame.removeAttribute("src");
      frame.hidden = !allowed;
      frame.parentElement.classList.toggle("is-consent-blocked", !allowed);
      const placeholder = frame.parentElement.querySelector(".map-consent-placeholder");
      if (placeholder) placeholder.hidden = allowed;
    });
    banner.hidden = !!preferences || dialog.open;
  }
  function closePreferences() {
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
    dialog.hidden = true;
    applyPreferences();
    if (returnFocus?.isConnected && !returnFocus.closest("[hidden]")) returnFocus.focus({ preventScroll: true });
  }
  function openPreferences(event) {
    returnFocus = event?.currentTarget || document.activeElement;
    preferences = readPreferences();
    externalSwitch.checked = preferences?.external === true;
    analyticsSwitch.checked = preferences?.analytics === true;
    banner.hidden = true;
    dialog.hidden = false;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    dialog.querySelector(".cookie-dialog-close").focus({ preventScroll: true });
  }
  function savePreferences(external, analytics) {
    const now = new Date();
    const expiry = new Date(now);
    expiry.setMonth(expiry.getMonth() + 6);
    preferences = { version: 2, external, analytics, savedAt: now.getTime(), expiresAt: expiry.getTime() };
    try { localStorage.setItem(storageKey, JSON.stringify(preferences)); } catch {}
    closePreferences();
    applyPreferences();
  }
  document.querySelectorAll("[data-cookie-settings]").forEach(button => {
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-controls", dialog.id);
    button.addEventListener("click", openPreferences);
  });
  document.querySelectorAll("[data-cookie-refuse]").forEach(button => button.addEventListener("click", () => savePreferences(false, false)));
  document.querySelectorAll("[data-cookie-accept]").forEach(button => button.addEventListener("click", () => savePreferences(true, true)));
  dialog.querySelector(".cookie-confirm").addEventListener("click", () => savePreferences(externalSwitch.checked, analyticsSwitch.checked));
  dialog.querySelector(".cookie-dialog-close").addEventListener("click", closePreferences);
  dialog.addEventListener("cancel", event => { event.preventDefault(); closePreferences(); });
  window.addEventListener("storage", event => {
    if (event.key !== storageKey && event.key !== null) return;
    preferences = readPreferences();
    externalSwitch.checked = preferences?.external === true;
    analyticsSwitch.checked = preferences?.analytics === true;
    applyPreferences();
  });
  applyPreferences();
}

function setupSiteShell() {
  const currentPage = document.body.dataset.page || "home";
  const headerRoot = document.querySelector(".site-header");
  const footerRoot = document.querySelector(".site-footer");

  if (headerRoot && !headerRoot.children.length) headerRoot.innerHTML = buildHeader(currentPage);
  if (footerRoot && !footerRoot.children.length) footerRoot.innerHTML = buildFooter();

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
}

function setupProductCatalogue() {
  const roots = document.querySelectorAll("#door-products, #window-products, #shutter-products");
  if (!roots.length) return;

  const render = () => {
    setupDoorCatalogue();
    setupWindowCatalogue();
    setupShutterCatalogue();
    orderProductCatalogueCards();
  };
  render();
  setupFilters();
  setupProductSubfilters();
  setupProductVariants();

  // Keep the local catalogue interactive while an optional remote source loads.
  loadProductCatalogues().then((changed) => {
    if (!changed) return;
    roots.forEach((root) => delete root.dataset.prerendered);
    render();
    document.dispatchEvent(new CustomEvent("productcataloguechange"));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupSiteShell();
  setupCookieConsent();
  if (document.querySelector("#door-products, #window-products, #shutter-products")) {
    setupProductCatalogue();
  } else {
    setupFilters();
    setupProductVariants();
  }
  setupContactForm();
  setupReveal();
  setupProjectVideoPreviews();
  setupProjectVideoModal();
  setupAiToolsNavigation();
  setupAiPhotoAnalyzer();
  setupAiMaterialAdvisor();
  setupAiChatbot();
  setupAiEstimator();
  setupAiConceptIdeator();
  setupAiRoadmapPlanner();
  setupAiBookingPlanner();
  setupGlobalAdazaiWidget();
});
