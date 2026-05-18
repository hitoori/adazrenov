const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { google } = require("googleapis");

admin.initializeApp();
const db = admin.firestore();
const REGION = "europe-west1";
const DEFAULT_AVAILABILITY_COLLECTION = "aiAvailabilitySlots";
const DEFAULT_APPOINTMENTS_COLLECTION = "aiAppointments";
const DEFAULT_CONVERSATIONS_COLLECTION = "aiConversations";
const DEFAULT_PRODUCTS_COLLECTION = "siteProducts";

function setCorsHeaders(res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

function parseIntSafe(value, fallback) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function asIso(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
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

function normalizeCatalogueKind(value) {
  const normalized = normalizeText(value).replace(/\s+/g, "-");
  if (["door", "doors", "porte", "portes", "portes-entree", "portes-d-entree"].includes(normalized)) return "doors";
  if (["window", "windows", "fenetre", "fenetres", "geamuri"].includes(normalized)) return "windows";
  if (["shutter", "shutters", "volet", "volets", "rulouri"].includes(normalized)) return "shutters";
  return "";
}

function hasAny(normalized, keywords) {
  return keywords.some((keyword) => normalized.includes(normalizeText(keyword)));
}

function formatMoney(value) {
  return `${Math.round(value).toLocaleString("fr-FR")} EUR`;
}

function productFromDoc(documentSnapshot) {
  const data = documentSnapshot.data() || {};
  const category = normalizeCatalogueKind(data.category || data.kind || data.type);
  if (!category) return null;
  if (data.active === false || data.status === "hidden" || data.status === "draft") return null;

  return {
    databaseId: documentSnapshot.id,
    ...data,
    category,
    id: data.id || data.modelId || data.order || documentSnapshot.id,
    order: Number(data.order || data.position || data.id || 0) || 0,
  };
}

function groupProducts(records) {
  return records.reduce(
    (groups, product) => {
      groups[product.category].push(product);
      return groups;
    },
    { doors: [], windows: [], shutters: [] }
  );
}

function sortProducts(records) {
  return records.sort((left, right) => {
    const orderDiff = (Number(left.order) || 0) - (Number(right.order) || 0);
    if (orderDiff) return orderDiff;
    return String(left.title || left.id).localeCompare(String(right.title || right.id), "fr");
  });
}

function detectSurface(message) {
  const match = normalizeText(message).match(/(\d{1,4})\s*(m2|m\s?2|m²|mp|metre|metres|metres carres)/);
  if (!match) return null;
  const value = Number.parseInt(match[1], 10);
  return Number.isFinite(value) ? value : null;
}

function detectCity(message) {
  const raw = String(message || "");
  const patterns = [
    /\b(?:a|à|sur|dans|ville|localite|localité|zone)\s+([A-Za-zÀ-ÿ' -]{3,40})/i,
    /\b(Paris|Noiseau|Creteil|Créteil|Lyon|Marseille|Versailles|Saint-Maur|Champigny|Sucy|Orly|Antony|Massy)\b/i,
  ];

  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match?.[1]) return match[1].trim().replace(/[,.!?].*$/, "");
  }

  return "";
}

const serviceProfiles = [
  {
    id: "salle-de-bain",
    name: "salle de bain",
    keywords: ["salle de bain", "bain", "douche", "sanitaire"],
    minPerM2: 900,
    maxPerM2: 1800,
    minBase: 2800,
    maxBase: 5200,
    duration: "2 a 5 semaines",
    materials: ["carrelage gres cerame antiderapant", "etancheite sous carrelage", "ventilation efficace", "meuble hydrofuge"],
  },
  {
    id: "cuisine",
    name: "cuisine",
    keywords: ["cuisine", "ilot", "plan de travail", "meuble cuisine"],
    minPerM2: 1200,
    maxPerM2: 2500,
    minBase: 3000,
    maxBase: 6000,
    duration: "3 a 6 semaines",
    materials: ["plan de travail compact ou quartz", "carrelage gres cerame", "peinture lessivable", "eclairage LED"],
  },
  {
    id: "fenetres",
    name: "fenetres",
    keywords: ["fenetre", "fenetres", "double vitrage", "menuiserie"],
    minPerM2: 420,
    maxPerM2: 980,
    minBase: 900,
    maxBase: 2800,
    duration: "1 a 7 jours selon quantite",
    materials: ["PVC double vitrage", "aluminium sur mesure", "joints performants", "volets associes si besoin"],
  },
  {
    id: "portes",
    name: "portes",
    keywords: ["porte", "portes", "entree", "blindee"],
    minPerM2: 520,
    maxPerM2: 1300,
    minBase: 1200,
    maxBase: 3200,
    duration: "1 a 5 jours selon preparation",
    materials: ["porte isolante", "quincaillerie securisee", "seuil etanche", "habillage de finition"],
  },
  {
    id: "electricite",
    name: "installation electrique",
    keywords: ["electric", "electrique", "tableau", "prise", "disjoncteur"],
    minPerM2: 90,
    maxPerM2: 220,
    minBase: 1500,
    maxBase: 4200,
    duration: "4 a 14 jours",
    materials: ["tableau modulaire", "protections differentielles", "prises adaptees", "circuits dedies zones humides"],
  },
  {
    id: "facade",
    name: "facade",
    keywords: ["facade", "ravalement", "enduit", "exterieur"],
    minPerM2: 130,
    maxPerM2: 260,
    minBase: 2000,
    maxBase: 4800,
    duration: "1 a 3 semaines",
    materials: ["fixateur de fond", "enduit respirant", "trame d'armature", "peinture exterieure UV"],
  },
  {
    id: "toiture",
    name: "toiture",
    keywords: ["toiture", "toit", "couverture", "tuile"],
    minPerM2: 180,
    maxPerM2: 420,
    minBase: 2600,
    maxBase: 6500,
    duration: "1 a 4 semaines",
    materials: ["controle etancheite", "sous-couche", "evacuation eaux", "isolation si necessaire"],
  },
  {
    id: "interieur",
    name: "renovation interieure",
    keywords: ["renovation", "interieur", "appartement", "maison", "piece"],
    minPerM2: 700,
    maxPerM2: 1400,
    minBase: 3500,
    maxBase: 9000,
    duration: "1 a 4 mois",
    materials: ["preparation supports", "peinture premium", "revetements durables", "coordination corps d'etat"],
  },
];

function findServiceProfile(message) {
  const normalized = normalizeText(message);
  const scored = serviceProfiles
    .map((profile) => ({
      profile,
      score: profile.keywords.reduce((sum, keyword) => (normalized.includes(normalizeText(keyword)) ? sum + 1 : sum), 0),
    }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.score > 0 ? scored[0].profile : null;
}

function buildChatActions(normalized, serviceProfile) {
  const actions = [];

  if (hasAny(normalized, ["prix", "cout", "budget", "estimation", "tarif"]) || serviceProfile) {
    actions.push({ label: "Ouvrir estimateur", action: "estimate" });
  }
  if (hasAny(normalized, ["materiau", "materiaux", "recommande", "produit", "isolation", "fenetre", "porte", "carrelage"])) {
    actions.push({ label: "Choisir materiaux", action: "materials" });
  }
  if (hasAny(normalized, ["rendez vous", "rdv", "visite", "program", "calendrier", "consultation", "creneau"])) {
    actions.push({ label: "Programmer visite", action: "booking" });
  }
  if (hasAny(normalized, ["plan", "delai", "duree", "phase", "chantier"])) {
    actions.push({ label: "Creer plan", action: "roadmap" });
  }
  if (hasAny(normalized, ["consultant", "conseiller", "telephone", "appel", "humain"])) {
    actions.push({ label: "Contacter consultant", action: "consultant" });
  }

  if (!actions.length) {
    actions.push(
      { label: "Faire estimation", action: "estimate" },
      { label: "Voir services", action: "services" },
      { label: "Programmer visite", action: "booking" }
    );
  }

  return actions.slice(0, 3);
}

function buildLocalAdazChat({ message }) {
  const normalized = normalizeText(message);
  const serviceProfile = findServiceProfile(message);
  const surface = detectSurface(message);
  const city = detectCity(message);
  const isGreeting = hasAny(normalized, ["bonjour", "salut", "hello", "bonsoir"]);
  const isEstimate = hasAny(normalized, ["prix", "cout", "combien", "budget", "estimation", "tarif"]);
  const isBooking = hasAny(normalized, ["rendez vous", "rdv", "visite", "program", "reservation", "calendrier", "creneau"]);
  const isUrgent = hasAny(normalized, ["urgent", "fuite", "coule", "electricite", "prise", "disjoncteur", "danger", "casse"]);
  const isMaterials = hasAny(normalized, ["materiau", "materiaux", "recommande", "choisir", "produit", "catalogue"]);
  const isWarranty = hasAny(normalized, ["garantie", "assurance", "decennale", "sav"]);
  const isContact = hasAny(normalized, ["contact", "telephone", "email", "mail", "consultant", "conseiller"]);
  let intent = "general";
  let answer = "";
  let nextQuestions = [];

  if (isGreeting) {
    intent = "greeting";
    answer =
      "Bonjour ! Je suis ADAZAI, votre assistant personnel. Je peux vous aider avec :\n- une estimation orientative de budget ;\n- le choix des matériaux ;\n- les étapes de votre chantier ;\n- les services Adazrenov ;\n- la préparation d'une visite technique.\n\nDites-moi simplement quel projet vous souhaitez réaliser.";
    nextQuestions = ["Quel type de travaux voulez-vous faire ?", "Quelle est la surface approximative ?", "Dans quelle ville se trouve le projet ?"];
  } else if (isUrgent) {
    intent = "support-urgent";
    answer =
      "Pour un probleme urgent, commencez par la securite: coupez l'eau si fuite, coupez le courant si zone humide ou probleme electrique, puis evitez de demonter si vous n'etes pas sur. ADAZ RENOV peut aider a preparer l'intervention travaux, plomberie, electricite, sol ou finition autour du probleme.";
    nextQuestions = ["Le probleme concerne l'eau, l'electricite ou une structure ?", "Depuis quand le probleme existe ?", "Souhaitez-vous être rappelé ?"];
  } else if (isEstimate || (serviceProfile && surface)) {
    intent = "estimate";
    if (serviceProfile && surface) {
      const minBudget = serviceProfile.minBase + surface * serviceProfile.minPerM2;
      const maxBudget = serviceProfile.maxBase + surface * serviceProfile.maxPerM2;
      answer =
        `Estimation orientative pour ${serviceProfile.name}${city ? ` a ${city}` : ""} (${surface} m2): entre ${formatMoney(minBudget)} et ${formatMoney(maxBudget)}. ` +
        `Delai indicatif: ${serviceProfile.duration}. Cette fourchette dependra des materiaux, de l'acces, de l'etat actuel et des mesures exactes. Pour un prix final, une visite technique est recommandee.`;
      nextQuestions = ["Quel niveau de finition voulez-vous: essentiel, equilibre ou premium ?", "Voulez-vous programmer une visite ?", "Souhaitez-vous être rappelé ?"];
    } else {
      answer =
        "Je peux calculer une estimation orientative. Pour etre utile, il me faut: type de travaux, surface en m2, ville, etat actuel, budget approximatif et delai souhaite.";
      nextQuestions = ["Quel service souhaitez-vous ?", "Quelle surface approximative en m2 ?", "Dans quelle ville se trouve le chantier ?"];
    }
  } else if (isBooking) {
    intent = "booking";
    answer =
      "Je peux vous guider vers une visite technique. Choisissez un creneau disponible dans la section Programmation, puis indiquez nom, telephone, service et message. La demande sera sauvegardee dans Firebase et l'equipe pourra vous confirmer.";
    nextQuestions = ["Quel service voulez-vous reserver ?", "Quel est votre telephone ?", "Avez-vous une preference de jour ou d'heure ?"];
  } else if (isMaterials && serviceProfile) {
    intent = "materials";
    answer =
      `Pour ${serviceProfile.name}, je recommanderais d'etudier: ${serviceProfile.materials.join(", ")}. Le bon choix depend du budget, de l'humidite, de l'isolation souhaitee et du rendu visuel.`;
    nextQuestions = ["Votre priorite est budget, design, isolation ou durabilite ?", "Quel niveau de finition souhaitez-vous ?", "Souhaitez-vous être rappelé ?"];
  } else if (isMaterials) {
    intent = "materials";
    answer =
      "Je peux recommander des materiaux si vous precisez la zone: salle de bain, cuisine, fenetres, portes, facade, toiture ou renovation interieure. Je tiendrai compte du budget, de la durabilite et du style.";
    nextQuestions = ["Pour quelle piece ou quel service ?", "Votre priorite est budget, isolation, design ou durabilite ?", "Quel niveau de finition souhaitez-vous ?"];
  } else if (isWarranty) {
    intent = "warranty";
    answer =
      "Les garanties dependent du type de travaux et du devis signe. Pour les travaux concernes, ADAZ RENOV peut vous informer sur les garanties applicables et l'assurance. Le detail exact doit etre confirme dans l'offre finale.";
    nextQuestions = ["Quel type de travaux voulez-vous garantir ?", "Le projet est-il neuf ou renovation ?", "Souhaitez-vous une visite technique ?"];
  } else if (isContact) {
    intent = "contact";
    answer =
      "Vous pouvez laisser vos coordonnees dans la programmation de consultation. ADAZAI transmettra la demande avec le service, le creneau choisi et votre message pour que l'equipe puisse revenir vers vous.";
    nextQuestions = ["Quel service vous interesse ?", "Quel est votre telephone ?", "Voulez-vous choisir un creneau maintenant ?"];
  } else {
    answer =
      "Je peux vous aider a avancer. Decrivez simplement votre projet avec: type de travaux, ville, surface, etat actuel, budget et delai. Ensuite je propose une estimation orientative, des materiaux et une option de visite.";
    nextQuestions = ["Quel type de travaux souhaitez-vous ?", "Quelle est la surface approximative ?", "Souhaitez-vous être rappelé ?"];
  }

  return {
    answer,
    intent,
    actions: buildChatActions(normalized, serviceProfile),
    nextQuestions,
    extracted: {
      service: serviceProfile?.id || "",
      serviceLabel: serviceProfile?.name || "",
      surface,
      city,
    },
  };
}

async function saveChatExchange({ conversationId, message, reply, req }) {
  const collectionName = process.env.CONVERSATIONS_COLLECTION || DEFAULT_CONVERSATIONS_COLLECTION;
  const conversationRef = conversationId
    ? db.collection(collectionName).doc(String(conversationId))
    : db.collection(collectionName).doc();
  const now = admin.firestore.FieldValue.serverTimestamp();
  const client = {
    userAgent: req.get("user-agent") || "",
    origin: req.get("origin") || "",
    referer: req.get("referer") || "",
  };
  const conversationPayload = {
    status: "active",
    source: "adazai-web",
    lastIntent: reply.intent,
    extracted: reply.extracted || {},
    updatedAt: now,
    client,
  };

  if (!conversationId) {
    conversationPayload.createdAt = now;
  }

  await conversationRef.set(conversationPayload, { merge: true });

  const messages = conversationRef.collection("messages");
  await messages.add({
    role: "user",
    content: String(message || ""),
    createdAt: now,
  });
  await messages.add({
    role: "assistant",
    content: reply.answer,
    intent: reply.intent,
    actions: reply.actions || [],
    nextQuestions: reply.nextQuestions || [],
    extracted: reply.extracted || {},
    createdAt: now,
  });

  return conversationRef.id;
}

async function callOpenAiChat({ message, model }) {
  const apiKey = process.env.OPENAI_API_KEY || "";
  if (!apiKey) {
    return null;
  }

  const systemPrompt =
    [
      "You are ADAZAI, the intelligent assistant for ADAZ RENOV construction and renovation services in France.",
      "Answer like a practical renovation advisor: concise, confident, warm, and action-oriented.",
      "You can help with budget ranges, work duration, materials, project phases, services, guarantees, and booking guidance.",
      "Use the website offer when recommending products: PVC/aluminium windows, entrance doors, shutters, interior finishes, ceramic tiles, premium interior paint, insulation, facade and renovation services.",
      "For kitchen requests, generate practical ideas: layout, storage, lighting, materials, appliance placement, budget level, and next steps.",
      "For customer support or broken items, give safe first steps. If water is involved, advise shutting off water. If electricity is involved, advise cutting power. Do not pretend to repair appliances internally; distinguish appliance repair from renovation, plumbing, electrical, flooring, and furniture work.",
      "When a user asks for a price, ask for or infer: work type, surface in m2, finish level, complexity, occupancy, and city. Give indicative ranges only.",
      "When a user wants booking, guide them to provide name, phone, service, notes, and a preferred slot. Never claim a booking is confirmed unless the backend confirms it.",
      "Do not invent legal guarantees or exact prices. Recommend a technical visit before any definitive quote.",
    ].join(" ");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: String(message || "") },
      ],
      temperature: 0.4,
      max_tokens: 420,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  return typeof content === "string" ? content.trim() : null;
}

async function getGoogleCalendarClient() {
  const serviceAccountEmail = process.env.GCAL_SERVICE_ACCOUNT_EMAIL || "";
  const privateKeyRaw = process.env.GCAL_PRIVATE_KEY || "";
  const calendarId = process.env.GCAL_CALENDAR_ID || "";

  if (!serviceAccountEmail || !privateKeyRaw || !calendarId) {
    return null;
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  await auth.authorize();

  return {
    calendar: google.calendar({ version: "v3", auth }),
    calendarId,
  };
}

function generateFallbackSlots(limit) {
  const results = [];
  const now = new Date();
  now.setDate(now.getDate() + 1);
  now.setHours(0, 0, 0, 0);

  for (let dayOffset = 0; results.length < limit && dayOffset < 14; dayOffset += 1) {
    const day = new Date(now);
    day.setDate(now.getDate() + dayOffset);

    if (day.getDay() === 0) continue;

    [9, 11, 14, 16].forEach((hour) => {
      if (results.length >= limit) return;

      const start = new Date(day);
      start.setHours(hour, 0, 0, 0);
      const end = addMinutes(start, 60);

      results.push({
        id: `fallback-${start.toISOString()}`,
        start: start.toISOString(),
        end: end.toISOString(),
        service: "Consultation",
        advisor: "ADAZ RENOV",
      });
    });
  }

  return results;
}

function timestampFromDate(date) {
  return admin.firestore.Timestamp.fromDate(date);
}

function toDateSafe(value) {
  if (!value) return null;
  if (value.toDate) return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function firestoreSlotFromDoc(documentSnapshot) {
  const data = documentSnapshot.data() || {};
  const start = toDateSafe(data.startAt || data.start || data.date);
  if (!start) return null;
  const end = toDateSafe(data.endAt || data.end) || addMinutes(start, 60);

  return {
    id: documentSnapshot.id,
    start: start.toISOString(),
    end: end.toISOString(),
    service: data.service || data.label || "Consultation",
    advisor: data.advisor || data.name || "ADAZ RENOV",
    source: data.source || "firebase",
  };
}

async function loadFirestoreAvailability(limit) {
  const collectionName = process.env.AVAILABILITY_COLLECTION || DEFAULT_AVAILABILITY_COLLECTION;
  const now = new Date();
  const snapshot = await db.collection(collectionName).where("status", "==", "open").get();
  const slots = [];

  snapshot.forEach((documentSnapshot) => {
    const slot = firestoreSlotFromDoc(documentSnapshot);
    if (!slot) return;
    if (new Date(slot.start) <= now) return;
    slots.push(slot);
  });

  return slots
    .sort((left, right) => new Date(left.start).getTime() - new Date(right.start).getTime())
    .slice(0, limit);
}

function unfoldIcs(icsText) {
  return String(icsText || "").replace(/\r?\n[ \t]/g, "");
}

function readIcsLine(block, key) {
  const lines = block.split(/\r?\n/);
  const prefix = `${key.toUpperCase()}`;
  const line = lines.find((entry) => entry.toUpperCase().startsWith(prefix));
  if (!line) return "";
  const colonIndex = line.indexOf(":");
  return colonIndex >= 0 ? line.slice(colonIndex + 1).trim() : "";
}

function parseIcsDate(value) {
  const raw = String(value || "").trim();
  const match = raw.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/);
  if (!match) return null;

  const [, year, month, day, hour = "09", minute = "00", second = "00", isUtc] = match;
  const iso = `${year}-${month}-${day}T${hour}:${minute}:${second || "00"}${isUtc ? "Z" : ""}`;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sanitizeDocId(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 120);
}

function parseAppleAvailabilityIcs(icsText) {
  const unfolded = unfoldIcs(icsText);
  const eventBlocks = unfolded.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || [];
  const keywordConfig = String(process.env.APPLE_CALENDAR_FREE_KEYWORDS || "").trim();
  const keywords = keywordConfig
    ? keywordConfig.split(",").map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const now = new Date();

  return eventBlocks
    .map((block) => {
      const uid = readIcsLine(block, "UID") || `${readIcsLine(block, "DTSTART")}-${readIcsLine(block, "SUMMARY")}`;
      const summary = readIcsLine(block, "SUMMARY") || "Disponible";
      const normalizedSummary = normalizeText(summary);
      if (keywords.length && !keywords.some((keyword) => normalizedSummary.includes(keyword))) return null;

      const start = parseIcsDate(readIcsLine(block, "DTSTART"));
      const end = parseIcsDate(readIcsLine(block, "DTEND")) || (start ? addMinutes(start, 60) : null);
      if (!start || !end || end <= now || end <= start) return null;

      return {
        id: `apple-${sanitizeDocId(uid || start.toISOString())}`,
        uid,
        summary,
        start,
        end,
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.start.getTime() - right.start.getTime());
}

async function syncAppleAvailabilityFromUrl() {
  const icsUrl = process.env.APPLE_CALENDAR_ICS_URL || process.env.ICLOUD_CALENDAR_ICS_URL || "";
  if (!icsUrl) {
    return { ok: false, reason: "APPLE_CALENDAR_ICS_URL is not configured", imported: 0 };
  }

  const response = await fetch(icsUrl);
  if (!response.ok) {
    throw new Error(`Apple Calendar ICS fetch failed ${response.status}`);
  }

  const icsText = await response.text();
  const slots = parseAppleAvailabilityIcs(icsText);
  const collectionName = process.env.AVAILABILITY_COLLECTION || DEFAULT_AVAILABILITY_COLLECTION;
  const existingSnapshot = await db.collection(collectionName).where("source", "==", "apple-calendar").where("status", "==", "open").get();
  let batch = db.batch();
  let operations = 0;

  function commitIfNeeded(force = false) {
    if (!operations && !force) return Promise.resolve();
    const currentBatch = batch;
    batch = db.batch();
    operations = 0;
    return currentBatch.commit();
  }

  for (const documentSnapshot of existingSnapshot.docs) {
    batch.set(
      documentSnapshot.ref,
      {
        status: "closed",
        closedReason: "apple-calendar-resync",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    operations += 1;
    if (operations >= 450) await commitIfNeeded(true);
  }

  for (const slot of slots) {
    const ref = db.collection(collectionName).doc(slot.id);
    batch.set(
      ref,
      {
        status: "open",
        source: "apple-calendar",
        calendarUid: slot.uid,
        service: "Consultation",
        advisor: "ADAZ RENOV",
        label: slot.summary || "Disponible",
        startAt: timestampFromDate(slot.start),
        endAt: timestampFromDate(slot.end),
        importedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    operations += 1;
    if (operations >= 450) await commitIfNeeded(true);
  }

  await commitIfNeeded();
  return { ok: true, imported: slots.length, source: "apple-calendar" };
}

exports.getProducts = onRequest({ region: REGION }, async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const collectionName = process.env.PRODUCTS_COLLECTION || DEFAULT_PRODUCTS_COLLECTION;
    const limit = Math.min(200, Math.max(1, parseIntSafe(req.query.limit, 100)));
    const snapshot = await db.collection(collectionName).limit(limit).get();
    const products = [];

    snapshot.forEach((documentSnapshot) => {
      const product = productFromDoc(documentSnapshot);
      if (product) products.push(product);
    });

    const grouped = groupProducts(products);
    res.json({
      source: "firestore",
      collection: collectionName,
      doors: sortProducts(grouped.doors),
      windows: sortProducts(grouped.windows),
      shutters: sortProducts(grouped.shutters),
    });
  } catch (error) {
    logger.error("getProducts failed", error);
    res.status(500).json({ error: "Failed to load products" });
  }
});

exports.getAvailability = onRequest({ region: REGION }, async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const limit = Math.min(20, Math.max(1, parseIntSafe(req.query.limit, 6)));

  try {
    let firestoreSlots = await loadFirestoreAvailability(limit);
    if (!firestoreSlots.length && (process.env.APPLE_CALENDAR_ICS_URL || process.env.ICLOUD_CALENDAR_ICS_URL)) {
      await syncAppleAvailabilityFromUrl();
      firestoreSlots = await loadFirestoreAvailability(limit);
    }

    if (firestoreSlots.length) {
      res.json({ slots: firestoreSlots, source: "firestore" });
      return;
    }

    const calendarClient = await getGoogleCalendarClient();
    if (!calendarClient) {
      res.json({ slots: generateFallbackSlots(limit), source: "fallback" });
      return;
    }

    const now = new Date();
    const endRange = new Date(now);
    endRange.setDate(endRange.getDate() + 21);

    const busyResp = await calendarClient.calendar.freebusy.query({
      requestBody: {
        timeMin: now.toISOString(),
        timeMax: endRange.toISOString(),
        items: [{ id: calendarClient.calendarId }],
      },
    });

    const busyRanges = (busyResp.data?.calendars?.[calendarClient.calendarId]?.busy || []).map((range) => ({
      start: new Date(range.start),
      end: new Date(range.end),
    }));

    const slots = [];
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);

    for (let offset = 1; slots.length < limit && offset <= 21; offset += 1) {
      const day = new Date(dayStart);
      day.setDate(dayStart.getDate() + offset);
      if (day.getDay() === 0) continue;

      [9, 11, 14, 16].forEach((hour) => {
        if (slots.length >= limit) return;

        const start = new Date(day);
        start.setHours(hour, 0, 0, 0);
        const end = addMinutes(start, 60);

        const overlapsBusy = busyRanges.some((busy) => start < busy.end && end > busy.start);
        if (!overlapsBusy) {
          slots.push({
            id: `gcal-${start.toISOString()}`,
            start: start.toISOString(),
            end: end.toISOString(),
            service: "Consultation",
            advisor: "ADAZ RENOV",
          });
        }
      });
    }

    res.json({ slots, source: "google-calendar" });
  } catch (error) {
    logger.error("getAvailability failed", error);
    res.status(500).json({ error: "Failed to load availability" });
  }
});

exports.createBooking = onRequest({ region: REGION }, async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = req.body || {};
    const slotId = String(body.slotId || "");
    const booking = {
      firstname: String(body.firstname || "").trim(),
      lastname: String(body.lastname || "").trim(),
      phone: String(body.phone || "").trim(),
      email: String(body.email || "").trim(),
      service: String(body.service || "Consultation"),
      notes: String(body.notes || "").trim(),
      calendarMode: String(body.calendarMode || body.calendar_mode || "site"),
      slotId,
      slotStart: asIso(body.slotStart),
      slotEnd: asIso(body.slotEnd),
      status: "pending",
      source: "web-ai-assistant",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (!booking.firstname || !booking.lastname || !booking.phone || !booking.slotStart || !booking.slotEnd) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const appointmentsCollection = process.env.APPOINTMENTS_COLLECTION || DEFAULT_APPOINTMENTS_COLLECTION;
    const availabilityCollection = process.env.AVAILABILITY_COLLECTION || DEFAULT_AVAILABILITY_COLLECTION;
    const firestoreRef = db.collection(appointmentsCollection).doc();
    const slotRef =
      slotId && !slotId.startsWith("fallback-") && !slotId.startsWith("gcal-") && !slotId.startsWith("demo-")
        ? db.collection(availabilityCollection).doc(slotId)
        : null;

    await db.runTransaction(async (transaction) => {
      if (slotRef) {
        const slotSnapshot = await transaction.get(slotRef);
        if (slotSnapshot.exists) {
          const slotData = slotSnapshot.data() || {};
          if (slotData.status && slotData.status !== "open") {
            throw new Error("Selected slot is no longer available");
          }
        }
      }

      transaction.set(firestoreRef, booking);
      if (slotRef) {
        transaction.set(
          slotRef,
          {
            status: "booked",
            appointmentId: firestoreRef.id,
            bookedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }
    });

    const calendarClient = await getGoogleCalendarClient();
    let calendarEventId = null;

    if (calendarClient) {
      const eventResp = await calendarClient.calendar.events.insert({
        calendarId: calendarClient.calendarId,
        requestBody: {
          summary: `Consultation ADAZ RENOV - ${booking.service}`,
          description: `Client: ${booking.firstname} ${booking.lastname}\nTelephone: ${booking.phone}\nEmail: ${booking.email || "non precise"}\nNotes: ${booking.notes || "Aucune"}`,
          start: { dateTime: booking.slotStart },
          end: { dateTime: booking.slotEnd },
        },
      });

      calendarEventId = eventResp.data?.id || null;
      if (calendarEventId) {
        await firestoreRef.update({
          status: "calendar-confirmed",
          calendarEventId,
        });
      }
    }

    res.status(201).json({
      ok: true,
      id: firestoreRef.id,
      calendarEventId,
    });
  } catch (error) {
    logger.error("createBooking failed", error);
    if (String(error?.message || "").includes("no longer available")) {
      res.status(409).json({ error: "Selected slot is no longer available" });
      return;
    }
    res.status(500).json({ error: "Failed to create booking" });
  }
});

exports.syncAppleAvailability = onRequest({ region: REGION }, async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (!["GET", "POST"].includes(req.method)) {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const result = await syncAppleAvailabilityFromUrl();
    if (!result.ok) {
      res.status(400).json(result);
      return;
    }
    res.json(result);
  } catch (error) {
    logger.error("syncAppleAvailability failed", error);
    res.status(500).json({ error: "Failed to sync Apple Calendar availability" });
  }
});

exports.scheduledAppleAvailabilitySync = onSchedule(
  {
    region: REGION,
    schedule: "every 15 minutes",
    timeZone: "Europe/Paris",
  },
  async () => {
    try {
      const result = await syncAppleAvailabilityFromUrl();
      logger.info("scheduledAppleAvailabilitySync", result);
    } catch (error) {
      logger.error("scheduledAppleAvailabilitySync failed", error);
    }
  }
);

exports.adazChat = onRequest({ region: REGION }, async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = req.body || {};
    const message = String(body.message || "").trim();
    const model = String(body.model || "").trim();
    const conversationId = String(body.conversationId || "").trim();

    if (!message) {
      res.status(400).json({ error: "Missing message" });
      return;
    }

    let reply = buildLocalAdazChat({ message });
    let source = "local-intent-engine";

    if (process.env.OPENAI_API_KEY) {
      try {
        const openAiAnswer = await callOpenAiChat({ message, model });
        if (openAiAnswer) {
          reply = {
            ...reply,
            answer: openAiAnswer,
          };
          source = "openai";
        }
      } catch (error) {
        logger.warn("OpenAI unavailable, using local ADAZAI engine", error);
      }
    }

    const savedConversationId = await saveChatExchange({
      conversationId,
      message,
      reply,
      req,
    });

    res.json({
      answer: reply.answer,
      conversationId: savedConversationId,
      source,
      intent: reply.intent,
      actions: reply.actions,
      nextQuestions: reply.nextQuestions,
      extracted: reply.extracted,
    });
  } catch (error) {
    logger.error("adazChat failed", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});
