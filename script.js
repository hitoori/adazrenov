const navItems = [
  { page: "home", href: "index.html", label: "Accueil" },
  { page: "services", href: "services.html", label: "Services" },
  { page: "products", href: "produits.html", label: "Produits" },
  { page: "projects", href: "projets.html", label: "Projets" },
  { page: "about", href: "a-propos.html", label: "A propos" },
  { page: "ai", href: "ia-travaux.html", label: "IA Travaux" },
  { page: "contact", href: "contact.html", label: "Contact" },
];

const brandLogoPath = "Pozelogo+altele/Original%20on%20Transparent.png";

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
          <div class="logo-mark" aria-hidden="true">AR</div>
          <div class="logo-word">
            <strong>
              A<span class="crown-letter">D<span class="crown-glyph" aria-hidden="true"></span></span>A<span class="crown-letter">Z<span class="crown-glyph" aria-hidden="true"></span></span> RENOV
            </strong>
            <span>Renovation &amp; Construction</span>
          </div>
        </a>
        <nav class="nav-links" aria-label="Navigation principale">
          ${links}
        </nav>
        <div class="nav-cta">
          <a class="contact-chip" href="tel:+33123456789">01 23 45 67 89</a>
          <a class="button small" href="contact.html">Devis gratuit</a>
        </div>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav">
          Menu
        </button>
      </div>
      <div class="mobile-nav" id="mobile-nav">
        <div class="container mobile-nav-inner">
          ${links}
          <a href="tel:+33123456789">01 23 45 67 89</a>
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
            <a class="social-pill" href="#" aria-label="Facebook">Fb</a>
            <a class="social-pill" href="#" aria-label="Instagram">Ig</a>
            <a class="social-pill" href="#" aria-label="LinkedIn">In</a>
          </div>
        </div>
        <div class="footer-block">
          <h3>Navigation</h3>
          <div class="footer-links">
            <a href="index.html">Accueil</a>
            <a href="services.html">Services</a>
            <a href="produits.html">Produits</a>
            <a href="projets.html">Projets</a>
            <a href="a-propos.html">A propos</a>
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
            <li>Vente de materiaux</li>
            <li>Outils IA chantier</li>
          </ul>
        </div>
        <div class="footer-block">
          <h3>Contact</h3>
          <div class="footer-contact">
            <span>123 Rue de la Renovation<br>75001 Paris, France</span>
            <a href="tel:+33123456789">01 23 45 67 89</a>
            <a href="mailto:contact@adazrenov.fr">contact@adazrenov.fr</a>
          </div>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>&copy; <span id="year"></span> ADAZ RENOV. Tous droits reserves.</span>
        <div class="footer-legal">
          <a href="#">Mentions legales</a>
          <a href="#">Politique de confidentialite</a>
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
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => apply(button.dataset.filter || "all"));
    });

    apply("all");
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

  if (label.includes("anthracite")) return "#3c4047";
  if (label.includes("noir")) return "#1f2024";
  if (label.includes("blanc casse")) return "#f2eee7";
  if (label.includes("blanc")) return "#f6f7f8";
  if (label.includes("gris perle")) return "#c8cdd4";
  if (label.includes("gris")) return "#8a929b";
  if (label.includes("beige") || label.includes("sable") || label.includes("lin")) return "#d9c8a7";
  if (label.includes("naturel") || label.includes("chene")) return "#b78354";
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

    const severityScore =
      issues.length + (urgency === "haute" ? 2 : urgency === "normale" ? 1 : 0) + (area > 80 ? 1 : 0);

    const priority =
      severityScore >= 5
        ? "Priorite elevee"
        : severityScore >= 3
          ? "Priorite moyenne"
          : "Priorite de confort";

    const observations = issues.length
      ? issues.map((issue) => issueMap[issue] || issue).join(", ")
      : "aucun symptome majeur coche, nous partons sur une lecture preventive";

    const recommendations = [
      `Verifier en premier ${profile.zones[0]} et ${profile.zones[1]}.`,
      `Votre objectif indique plutot ${objectiveText[objective]}.`,
      `Le niveau d'urgence correspond a ${urgencyText[urgency]}.`,
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
        <h3>Pre-analyse IA pour votre ${profile.label}</h3>
        <p>
          D'apres les informations transmises, la zone semble relever de
          <strong>${objectiveText[objective]}</strong>, avec ${observations}.
        </p>
        <div class="tool-result-grid">
          <div>
            <h4>Points a verifier</h4>
            <ul class="feature-list">${recommendations
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
          Surface indiquee: <strong>${area || "non precisee"}${area ? " m2" : ""}</strong>.
          Pour une analyse vision reelle sur image, la prochaine etape sera de brancher un backend IA.
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
        if (item.usage.includes(zone)) score += 3;
        if (item.priorities.includes(priority)) score += 2;
        if (item.budgets.includes(budget)) score += 2;
        if (finish === "premium" && item.budgets.includes("premium")) score += 1;
        if (finish === "equilibre" && item.budgets.includes("moyen")) score += 1;
        if (finish === "essentiel" && item.budgets.includes("eco")) score += 1;
        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

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
                    <p>Pourquoi ce choix: ${item.strengths.slice(0, 2).join(", ")}.</p>
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
          Conseil de suite: consultez le <a href="produits.html">catalogue produits</a> puis demandez un chiffrage avec pose.
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

  if (!form || !input || !log) return;

  const intents = [
    {
      keywords: ["devis", "prix", "cout", "combien", "tarif", "budget", "estimation"],
      answer:
        "Je peux vous donner une estimation rapide. Ecrivez par exemple: 'salle de bain 8m2' ou 'cuisine 20m2' et je vous calcule une fourchette budget + delai.",
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
        "Vous pouvez nous joindre via la page Contact, par telephone au 01 23 45 67 89 ou par email a contact@adazrenov.fr.",
    },
    {
      keywords: ["consultation", "programmation", "programmer", "rendez vous", "rdv", "reservation", "reserver"],
      answer:
        "Pour planifier une consultation, ecrivez le type de travaux + la surface + la ville, puis je vous guide pas a pas vers la section de reservation.",
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
        }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      const text = String(data.answer || data.message || data.output || "").trim();
      return text || null;
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
      return "Salut! Ravi de vous rencontrer. Je suis ADAZAI et je peux vous aider pour l'estimation de budget, les recommandations materiaux et la programmation de consultation. Dites-moi votre projet.";
    }

    return "Salut! Avec plaisir. Donnez-moi le type de travaux et la surface approximative, et je vous donne rapidement un budget indicatif et les prochaines etapes.";
  }

  function appendMessage(role, text) {
    const bubble = document.createElement("div");
    bubble.className = `chat-message ${role}`;
    bubble.innerHTML = `<p>${text}</p>`;
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
  }

  function getAnswer(question, isFirstUserMessage) {
    const greetingAnswer = getGreetingAnswer(question, isFirstUserMessage);
    if (greetingAnswer) return greetingAnswer;

    const gptIntegrationAnswer = getChatGptIntegrationAnswer(question);
    if (gptIntegrationAnswer) return gptIntegrationAnswer;

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
      "Je peux vous aider sur: 1) estimation budget par service, 2) programmation consultation, 3) recommandations materiaux (ex: salle de bain avec fenetre ou cabine en verre), 4) delais et garanties."
    );
  }

  async function submitQuestion(question) {
    const clean = question.trim();
    if (!clean) return;
    const isFirstUserMessage = userMessageCount === 0;
    userMessageCount += 1;
    appendMessage("user", clean);

    const localAnswer = getAnswer(clean, isFirstUserMessage);
    const remoteAnswer = await getRemoteChatAnswer(clean);
    const answer = remoteAnswer || localAnswer;

    window.setTimeout(() => appendMessage("assistant", answer), 180);
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
    facade: { label: "renovation de facade", min: 130, max: 260, daysPer100: 24 },
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const type = String(formData.get("work_type") || "interieur");
    const area = Number(formData.get("surface") || 0);
    const complexity = String(formData.get("complexity") || "standard");
    const finish = String(formData.get("finish") || "equilibre");
    const occupancy = String(formData.get("occupancy") || "libre");

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
        <ul class="feature-list">
          <li><span class="check">&#10003;</span><span>Complexite chantier: <strong>${complexity}</strong></span></li>
          <li><span class="check">&#10003;</span><span>Niveau de finition: <strong>${finish}</strong></span></li>
          <li><span class="check">&#10003;</span><span>Logement: <strong>${occupancy === "occupe" ? "occupe pendant travaux" : "libre pendant travaux"}</strong></span></li>
        </ul>
        <div class="result-note">
          Cette estimation reste indicative. Pour une vraie offre commerciale, il faut une visite technique et un devis detaille.
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
          <li><span class="check">&#10003;</span><span>Critical path: ${criticalRisks}.</span></li>
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
        const data = documentSnapshot.data();
        const rawStart = data.startAt || data.start || data.date;
        const rawEnd = data.endAt || data.end;
        const start = rawStart?.toDate ? rawStart.toDate() : new Date(rawStart);
        const end = rawEnd?.toDate ? rawEnd.toDate() : new Date(rawEnd || start.getTime() + 60 * 60 * 1000);

        if (!Number.isNaN(start.getTime())) {
          slots.push({
            id: documentSnapshot.id,
            start,
            end: Number.isNaN(end.getTime()) ? new Date(start.getTime() + 60 * 60 * 1000) : end,
            service: data.service || data.label || "Consultation",
            advisor: data.advisor || data.name || "ADAZ RENOV",
            source: "firebase",
          });
        }
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
    let bookingSource = slot.source === "firebase" ? "Firebase" : "demo local";

    if (bookingConfig.bookingApiUrl) {
      try {
        const response = await fetch(bookingConfig.bookingApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          bookingSource = "API calendrier";
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
          await firebase.addDoc(firebase.collection(firebase.db, collectionName), {
            ...payload,
            status: "pending",
            createdAt: firebase.serverTimestamp(),
          });
          bookingSource = "Firebase";
        } catch (error) {
          console.warn("Could not save booking to Firebase.", error);
          bookingSource = "local preview";
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
          <button class="button small light" type="button" data-download-ics>Telecharger Apple Calendar</button>
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

document.addEventListener("DOMContentLoaded", () => {
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

  setupFilters();
  setupProductVariants();
  setupContactForm();
  setupReveal();
  setupAiPhotoAnalyzer();
  setupAiMaterialAdvisor();
  setupAiChatbot();
  setupAiEstimator();
  setupAiConceptIdeator();
  setupAiRoadmapPlanner();
  setupAiBookingPlanner();
});
