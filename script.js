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
              A<span class="crown-letter">D<span class="crown-glyph" aria-hidden="true">&#9819;</span></span>A<span class="crown-letter">Z<span class="crown-glyph" aria-hidden="true">&#9819;</span></span>
            </strong>
            <span>RENOV</span>
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

  if (!form || !input || !log) return;

  const intents = [
    {
      keywords: ["devis", "prix", "cout", "combien", "tarif", "budget", "estimation"],
      answer:
        "Nous proposons un devis gratuit. Donnez-moi le type de travaux et une surface approximative, et je vous donne une premiere fourchette avant le devis detaille.",
    },
    {
      keywords: ["delai", "duree", "combien de temps", "temps", "planning", "date"],
      answer:
        "Le delai depend de la surface, de la complexite et des finitions. Pour une salle de bain, on est souvent sur quelques semaines, et pour une renovation complete sur plusieurs mois.",
    },
    {
      keywords: ["garantie", "assurance", "decennale", "sav", "qualite"],
      answer:
        "ADAZ RENOV met en avant la garantie decennale et une assurance responsabilite civile professionnelle sur les travaux realises.",
    },
    {
      keywords: ["paris", "france", "zone", "intervention", "ville", "deplacement"],
      answer:
        "Nous intervenons principalement en Ile-de-France et dans plusieurs grandes villes. Envoyez votre ville et je vous confirme rapidement la disponibilite.",
    },
    {
      keywords: ["fenetre", "porte", "materiau", "produit", "catalogue", "isolation"],
      answer:
        "Nous pouvons vous orienter vers les fenetres, portes et materiaux adaptes. Si vous voulez, je peux vous recommander une option selon votre budget et votre besoin d'isolation.",
    },
    {
      keywords: ["cuisine", "salle de bain", "facade", "toiture", "renovation", "maconnerie", "peinture", "electrique"],
      answer:
        "Parfait. Pour ce type de projet, donnez-moi la surface, votre priorite (budget, delai ou finition) et je vous propose une premiere orientation claire.",
    },
    {
      keywords: ["contact", "telephone", "mail", "email", "numero"],
      answer:
        "Vous pouvez nous joindre via la page Contact, par telephone au 01 23 45 67 89 ou par email a contact@adazrenov.fr.",
    },
    {
      keywords: ["program", "programm", "consultation", "calendrier", "rendez-vous", "reservation", "rdv"],
      answer:
        "Oui. Je peux vous proposer des dates libres dans la section programmation. Entrez votre nom, prenom et telephone, puis choisissez un créneau.",
    },
  ];

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function appendMessage(role, text) {
    const bubble = document.createElement("div");
    bubble.className = `chat-message ${role}`;
    bubble.innerHTML = `<p>${text}</p>`;
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
  }

  function getAnswer(question) {
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

    return (
      (match && match.score > 0 ? match.answer : null) ||
      "Je peux vous aider sur les devis, delais, garanties, produits, cuisines, salles de bain, facades et zones d'intervention. Posez-moi une question plus precise ou utilisez les outils IA de cette page."
    );
  }

  function submitQuestion(question) {
    const clean = question.trim();
    if (!clean) return;
    appendMessage("user", clean);
    const answer = getAnswer(clean);
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
