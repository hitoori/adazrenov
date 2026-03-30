const navItems = [
  { page: "home", href: "index.html", label: "Accueil" },
  { page: "services", href: "services.html", label: "Services" },
  { page: "products", href: "produits.html", label: "Produits" },
  { page: "projects", href: "projets.html", label: "Projets" },
  { page: "about", href: "a-propos.html", label: "A propos" },
  { page: "ai", href: "ia-travaux.html", label: "IA Travaux" },
  { page: "contact", href: "contact.html", label: "Contact" },
];

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
          <span class="logo-mark">AR</span>
          <span class="logo-word">
            <strong>ADAZ RENOV</strong>
            <span>Renovation & Construction</span>
          </span>
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
            <span class="logo-mark">AR</span>
            <span class="logo-word">
              <strong>ADAZ RENOV</strong>
              <span>Votre partenaire de confiance</span>
            </span>
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

  const responses = [
    {
      keywords: ["devis", "prix", "cout", "combien"],
      answer:
        "Nous proposons un devis gratuit. Pour une estimation rapide, utilisez l'estimateur IA ci-dessous, puis envoyez votre demande via la page Contact pour recevoir une proposition precise.",
    },
    {
      keywords: ["delai", "duree", "combien de temps", "temps"],
      answer:
        "Le delai depend surtout de la surface, de la complexite du chantier et des finitions. En general, une salle de bain se traite en quelques semaines et une renovation complete en plusieurs mois.",
    },
    {
      keywords: ["garantie", "assurance", "decennale"],
      answer:
        "ADAZ RENOV met en avant une garantie decennale et une assurance responsabilite civile professionnelle sur ses travaux.",
    },
    {
      keywords: ["paris", "france", "zone", "intervention", "ville"],
      answer:
        "Le site indique une intervention principale en Ile-de-France et dans les grandes villes francaises. Pour votre localisation exacte, le plus simple est de nous l'envoyer dans la demande de devis.",
    },
    {
      keywords: ["fenetre", "porte", "materiau", "produit", "catalogue"],
      answer:
        "Nous pouvons vous orienter vers les fenetres, portes et materiaux du catalogue. Le recommandateur IA produits est justement la pour filtrer selon budget, style et performance.",
    },
    {
      keywords: ["cuisine", "salle de bain", "facade", "toiture", "renovation"],
      answer:
        "Pour ce type de projet, je vous conseille de commencer par l'analyse photo IA si vous avez une image, puis de lancer l'estimateur pour cadrer budget et delai.",
    },
    {
      keywords: ["contact", "telephone", "mail", "rendez-vous"],
      answer:
        "Vous pouvez nous joindre via la page Contact, par telephone au 01 23 45 67 89 ou par email a contact@adazrenov.fr.",
    },
  ];

  function appendMessage(role, text) {
    const bubble = document.createElement("div");
    bubble.className = `chat-message ${role}`;
    bubble.innerHTML = `<p>${text}</p>`;
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
  }

  function getAnswer(question) {
    const normalized = question.toLowerCase();
    const match = responses.find((item) => item.keywords.some((keyword) => normalized.includes(keyword)));
    return (
      match?.answer ||
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
});
