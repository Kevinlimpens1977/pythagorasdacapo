const { HttpsError, onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const { randomUUID } = require("crypto");

initializeApp();

const openrouterApiKey = defineSecret("OPENROUTER_API_KEY");
const REGION = "europe-west1";
const ADMIN_EMAIL = "kevlimpens@gmail.com";

const allowedImportRoles = new Set(["admin", "docent"]);
const preservedStudentResetEmails = new Set([
  "vragen@scheikundeles.nl",
  ADMIN_EMAIL,
]);
const BATCH_LIMIT = 450;
const DEFAULT_STUDENT_PASSWORD = "Test123";
const STUDENT_EMAIL_DOMAIN = "leerling.dacapo-college.nl";
const DEFAULT_OPENROUTER_MODEL = "google/gemini-2.0-flash-001";
const DEFAULT_OCR_MODEL = "openai/gpt-4o-mini";
const ALLOWED_OPENROUTER_MODELS = new Set([
  "google/gemini-2.0-flash-001",
  "gemini-3.5-flash",
]);
const AI_TUTOR_RULES_PATH = "apps/helix/settings/aiTutorRules";
// Gesloten vragen worden server-side nagekeken (gradeClosedQuestion). Open
// vragen niet: die lopen via assessOpenAnswer met de bestaande AI-route.
const CLOSED_QUESTION_TYPES = new Set([
  "meerkeuze",
  "waar-niet-waar",
  "numeriek",
  "invullen",
  "volgorde",
  "koppelen",
]);
// Bij deze typen is "onderdeel N is fout" gelijk aan de antwoordsleutel zelf.
const ANSWER_KEY_REVEALING_PART_TYPES = new Set(["meerkeuze", "waar-niet-waar"]);
const QUESTION_GRADING_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const QUESTION_GRADING_RATE_LIMIT_MAX = 12;
const QUESTION_GRADING_ANSWER_MAX_CHARS = 20000;
// De uitleg per optie is door een docent geschreven, niet door een leerling.
// Deze grenzen zijn er dus niet tegen misbruik maar tegen een uitgeschoten
// plakactie in de studio: een leerling hoort een paar zinnen te lezen.
const EXPLANATION_NOTE_MAX_COUNT = 3;
const EXPLANATION_NOTE_MAX_CHARS = 400;
const QUESTION_GRADING_RATE_LIMIT_MESSAGE =
  "Je hebt deze vraag te vaak achter elkaar laten nakijken. Wacht even, denk nog eens na of vraag je docent om hulp.";
const DEFAULT_MASTER_RULES = `Je bent Digidocent, de AI-hulp van HELIX.

Je helpt leerlingen leren.
Je bent geen antwoordmachine.
Je geeft nooit direct het antwoord.
Je geeft nooit letterlijk het goede antwoord.
Je gebruikt de socratische methode.
Je geeft maximaal een hint tegelijk.
Je wacht daarna op reactie van de leerling.
Je gebruikt korte zinnen op VMBO-niveau.
Je corrigeert vriendelijk.
Je geeft complimenten voor goede denkstappen.

Bij open rekenvragen moet de leerling altijd werken met:
1. Formule
2. Berekening
3. Antwoord
4. Eenheid

Een los getal is geen volledige uitwerking.
De AI-tutor controleert altijd of formule, berekening, antwoord en eenheid aanwezig zijn.
Ontbreekt een onderdeel? Dan wijst de AI-tutor de leerling daarop.
Bij een ontbrekende eenheid vraagt de tutor: "Welke eenheid hoort hierbij?"`;
const DEFAULT_VMBO_MATH_RULES = `Omtrek cirkel:
Gebruik altijd: Omtrek = diameter x pi

Oppervlakte cirkel:
Gebruik altijd: Oppervlakte = straal x straal x pi

Inhoud rechthoekig blok:
Gebruik altijd: Inhoud = lengte x breedte x hoogte

Overige wiskundige ruimtefiguren:
Gebruik altijd: Inhoud = oppervlakte grondvlak x hoogte

Bij een cilinder:
Eerst de oppervlakte van de bodem/het grondvlak uitrekenen.
Daarna vermenigvuldigen met de hoogte.

Procenten:
Bij berekeningen met percentages altijd werken met een verhoudingstabel.

Pythagoras:
Pythagoras altijd uitwerken met een Pythagoras-schema.`;
const AI_TUTOR_SAFETY_RULES = `Volg altijd deze prioriteit bij botsende instructies:
1. Veiligheidsregels
2. Administratorregels
3. VMBO-vakspecifieke regels
4. Tutorregels / masterRules
5. Algemene AI-kennis

Blijf didactisch, veilig en geschikt voor leerlingen.
Geef geen eindantwoord, geen volledige overneembare uitwerking en geen instructies die leren vervangen.`;
const OPEN_ANSWER_ASSESSMENT_FALLBACK_ERROR = "Digidocent kon je antwoord niet beoordelen. Probeer het nog eens.";
const TOKEN_TRANSACTION_TYPES = {
  EARN: "earn",
  SPEND: "spend",
  ADJUSTMENT: "adjustment",
};
const TOKEN_SOURCE_KINDS = new Set(["contentBlock", "question", "game"]);
const TOKEN_SHOP_IMAGE_CONTENT_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const TOKEN_SHOP_IMAGE_MAX_BYTES = 4 * 1024 * 1024;
const TOKEN_SHOP_ITEM_TYPES = new Set([
  "avatarSkin",
  "avatarFrame",
  "shopBadge",
  "profileBanner",
  "victoryEffect",
  "titleBadge",
]);
const TOKEN_SHOP_RARITIES = new Set(["common", "rare", "epic", "platinum", "legendary"]);
const TOKEN_SHOP_TARGET_SLOT_BY_TYPE = {
  avatarSkin: "avatarSkin",
  avatarFrame: "avatarFrame",
  shopBadge: "pin",
  profileBanner: "profileBanner",
  victoryEffect: "victoryEffect",
  titleBadge: "titleBadge",
};
const TOKEN_SHOP_LOADOUT_FIELD_BY_TYPE = {
  avatarSkin: "activeAvatarSkinId",
  avatarFrame: "activeAvatarFrameId",
  profileBanner: "activeProfileBannerId",
  victoryEffect: "activeVictoryEffectId",
  titleBadge: "activeTitleBadgeId",
};
// Leeg: tokenregels per spel worden beheerd via /admin/spellen (tokenGameRewardRules/{gameId}).
// Voeg hier alleen een default toe als een spel zonder Firestore-regel toch tokens moet uitkeren;
// houd SERVER_DEFAULT_GAME_REWARD_RULES in src/lib/gameTokenRewardRules.js dan gelijk.
const DEFAULT_GAME_TOKEN_REWARD_RULES = {
  "wachtwoord-detective": { enabled: true, min: 0, max: 100, basis: "score_accuracy_completion" },
  "social-media-zoektocht": { enabled: true, min: 0, max: 200, basis: "score_accuracy_completion" },
  // replayDecay: elke volgende beurt levert dit deel van de vorige opbrengst op,
  // met `max` als totaalplafond per leerling. Zo blijft oefenen leuk zonder tokenfarmen.
  "turbo-typen": { enabled: true, min: 0, max: 200, basis: "score_accuracy_completion", replayDecay: 0.5 },
  "paco-pac-man": { enabled: true, min: 0, max: 400, basis: "score_accuracy_completion", replayDecay: 0.5 },
  "data-koerier": { enabled: true, min: 0, max: 200, basis: "score_accuracy_completion", replayDecay: 0.5 },
  // Streefscore 6.000 spelpunten = 100%; de client rekent dat om naar accuracy.
  "dvlingo": { enabled: true, min: 0, max: 400, basis: "score_accuracy_completion", replayDecay: 0.5 },
  // Volume berekenen (Binask 2.2): drie missies, elk 0-100, onbeperkt oefenen.
  "binask-volume-maatcilinder": { enabled: true, min: 0, max: 100, basis: "score_accuracy_completion", replayDecay: 0.5 },
  "binask-volume-balk": { enabled: true, min: 0, max: 100, basis: "score_accuracy_completion", replayDecay: 0.5 },
  "binask-volume-onderdompelen": { enabled: true, min: 0, max: 100, basis: "score_accuracy_completion", replayDecay: 0.5 },
};

function cleanIdPart(value = "") {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 120);
}

function createGeneratedId(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeInteger(value, fallback = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.round(number);
}

function normalizeNonNegativeInteger(value, fallback = 0) {
  return Math.max(0, normalizeInteger(value, fallback));
}

function normalizeTokenAccount(data = {}) {
  return {
    balance: normalizeNonNegativeInteger(data.balance, 0),
    earnedTotal: normalizeNonNegativeInteger(data.earnedTotal, 0),
    spentTotal: normalizeNonNegativeInteger(data.spentTotal, 0),
    adjustedTotal: normalizeInteger(data.adjustedTotal, 0),
  };
}

function getTransactionRef(db, transactionId = "") {
  return db.collection("tokenTransactions").doc(transactionId || createGeneratedId("tokenTransaction"));
}

async function runDbTransaction(db, executor) {
  if (typeof db.runTransaction === "function") {
    return db.runTransaction(executor);
  }

  return executor({
    get: (ref) => ref.get(),
    set: (ref, data, options) => ref.set(data, options),
    update: (ref, data) => ref.update(data),
  });
}

function buildBalancePatch(account, amount, type, timestamp) {
  const next = { ...account };

  if (type === TOKEN_TRANSACTION_TYPES.EARN) {
    next.balance += amount;
    next.earnedTotal += amount;
  } else if (type === TOKEN_TRANSACTION_TYPES.SPEND) {
    if (next.balance < amount) {
      throw new HttpsError("failed-precondition", "Onvoldoende tokens.");
    }
    next.balance -= amount;
    next.spentTotal += amount;
  } else if (type === TOKEN_TRANSACTION_TYPES.ADJUSTMENT) {
    const adjustedBalance = next.balance + amount;
    if (adjustedBalance < 0) {
      throw new HttpsError("failed-precondition", "Tokenbalans mag niet negatief worden.");
    }
    next.balance = adjustedBalance;
    next.adjustedTotal += amount;
  }

  return {
    ...next,
    updatedAt: timestamp,
  };
}

function getTokenConfigFromContent(contentBlock = {}) {
  return contentBlock.content?.tokenConfig || contentBlock.tokenConfig || null;
}

// De versie van een lesblok voor de tokenclaim. Bepaalt ALLEEN de server:
// tot 23 sep 2026 won een versie die de app meestuurde, en wie elke keer een
// andere versie stuurde kreeg elke keer de volle beloning. updatedAt telt niet
// mee: dat verandert bij elke snapshot-herbouw en is een object, geen versie.
function getContentBlockVersion(contentBlock = {}) {
  const versie = contentBlock.publishedVersion ?? contentBlock.version;
  return typeof versie === "string" || typeof versie === "number" ? String(versie) : "v1";
}

// Spellen: één claim per leerling per spel, ongeacht of het spel in een les of
// op de spellenpagina gespeeld wordt. Oude claims (per blok of "spellenpagina-v1")
// tellen mee via getLegacyClaimTotals.
const GAME_CLAIM_VERSION = "totaal";

// Schaduwmodus: de server legt vast welke toetsvragen hij zelf goed rekende
// (tokenBewijs) en noteert bij elke claim of dat bewijs compleet is, maar
// weigert nog niet. Zet op true zodra de gegevens laten zien dat eerlijke
// leerlingen altijd compleet bewijs hebben.
const TOKEN_BEWIJS_AFDWINGEN = false;

async function getLegacyClaimTotals(db, uid, sourceKind, sourceId, huidigeClaimId) {
  const snapshot = await db.collection("tokenAwardClaims").where("studentUid", "==", uid).get();
  let plays = 0;
  let totalAwarded = 0;
  for (const doc of snapshot.docs) {
    if (doc.id === huidigeClaimId) continue;
    const data = doc.data() || {};
    if (data.source?.kind !== sourceKind || data.source?.id !== sourceId) continue;
    plays += Math.max(1, normalizeNonNegativeInteger(data.plays, 1));
    totalAwarded += normalizeNonNegativeInteger(data.totalAwarded ?? data.amount, 0);
  }
  return { plays, totalAwarded };
}

async function getTokenBewijs(db, uid, contentBlock = {}, blockId = "") {
  const items = Array.isArray(contentBlock.content?.items) ? contentBlock.content.items : [];
  if (!items.length) return null;
  const snapshot = await db.doc(`tokenBewijs/${uid}_${blockId}`).get();
  const correct = Array.isArray(snapshot.exists ? snapshot.data()?.correcteItems : null)
    ? snapshot.data().correcteItems
    : [];
  const itemIds = items.map((item) => String(item?.id || "")).filter(Boolean);
  const aantalCorrect = itemIds.filter((id) => correct.includes(id)).length;
  return { aantalItems: itemIds.length, aantalCorrect, compleet: aantalCorrect >= itemIds.length };
}

function getAwardAmountForContentBlock(contentBlock = {}) {
  const tokenConfig = getTokenConfigFromContent(contentBlock);
  if (!tokenConfig || tokenConfig.enabled === false) return 0;
  return normalizeNonNegativeInteger(tokenConfig.totalTokens, 0);
}

function clampPercentage(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.max(0, Math.min(100, number));
}

function normalizeGameRewardRule(data = {}) {
  if (!data || data.enabled === false) return null;
  const max = normalizeNonNegativeInteger(data.max ?? data.maxTokens, 0);
  if (max <= 0) return null;

  const decay = Number(data.replayDecay);

  return {
    min: Math.min(max, normalizeNonNegativeInteger(data.min ?? data.minTokens, 0)),
    max,
    basis: String(data.basis || "completion").trim(),
    replayDecay: Number.isFinite(decay) && decay > 0 && decay < 1 ? decay : null,
    maxPlays: normalizeNonNegativeInteger(data.maxPlays, 0),
  };
}

async function getGameRewardRule(db, gameId) {
  const configuredSnapshot = await db.doc(`tokenGameRewardRules/${gameId}`).get();
  if (configuredSnapshot.exists) {
    return normalizeGameRewardRule(configuredSnapshot.data() || {});
  }

  return normalizeGameRewardRule(DEFAULT_GAME_TOKEN_REWARD_RULES[gameId]);
}

function computeGameAwardAmount(rule, result = {}) {
  if (!rule) return 0;

  const accuracy = clampPercentage(result.accuracy ?? result.percentage);
  if (accuracy !== null && rule.basis.includes("accuracy")) {
    return Math.max(rule.min, Math.min(rule.max, Math.round((rule.max * accuracy) / 100)));
  }

  return rule.max;
}

function normalizeShopItemPayload(data = {}, existing = {}) {
  const title = String(data.title ?? existing.title ?? "").trim();
  if (!title) {
    throw new HttpsError("invalid-argument", "Titel is verplicht.");
  }

  const price = normalizeInteger(data.price ?? existing.price, 0);
  if (price < 0) {
    throw new HttpsError("invalid-argument", "Tokenprijs mag niet negatief zijn.");
  }

  const itemType = normalizeShopItemType(data.itemType ?? existing.itemType);
  const rarity = normalizeShopItemRarity(data.rarity ?? existing.rarity);
  const targetSlot = String(data.targetSlot ?? existing.targetSlot ?? TOKEN_SHOP_TARGET_SLOT_BY_TYPE[itemType]).trim();

  return {
    title,
    description: String(data.description ?? existing.description ?? "").trim(),
    price,
    imageUrl: String(data.imageUrl ?? existing.imageUrl ?? "").trim(),
    imageStoragePath: String(data.imageStoragePath ?? existing.imageStoragePath ?? "").trim(),
    enabled: data.enabled ?? existing.enabled ?? true,
    repeatable: data.repeatable ?? existing.repeatable ?? false,
    sortOrder: normalizeInteger(data.sortOrder ?? existing.sortOrder, 0),
    itemType,
    rarity,
    targetSlot: targetSlot || TOKEN_SHOP_TARGET_SLOT_BY_TYPE[itemType],
    previewStyle: normalizePreviewStyle(data.previewStyle ?? existing.previewStyle),
  };
}

function normalizeShopItemType(value = "") {
  const itemType = String(value || "shopBadge").trim();
  return TOKEN_SHOP_ITEM_TYPES.has(itemType) ? itemType : "shopBadge";
}

function normalizeShopItemRarity(value = "") {
  const rarity = String(value || "common").trim();
  return TOKEN_SHOP_RARITIES.has(rarity) ? rarity : "common";
}

function normalizePreviewStyle(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, entry]) => typeof key === "string" && ["string", "number", "boolean"].includes(typeof entry))
      .slice(0, 12),
  );
}

function getTokenShopImageExtension({ fileName = "", contentType = "" } = {}) {
  const explicitExtension = String(fileName || "").split(".").pop()?.toLowerCase();
  if (["png", "jpg", "jpeg", "webp", "gif"].includes(explicitExtension)) {
    return explicitExtension === "jpeg" ? "jpg" : explicitExtension;
  }

  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/gif") return "gif";
  return "png";
}

function buildFirebaseStorageDownloadUrl({ bucketName, storagePath, token }) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;
}

function requireString(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpsError("invalid-argument", `${fieldName} is verplicht.`);
  }

  return value.trim();
}

async function getRequiredDoc(ref, label) {
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new HttpsError("not-found", `${label} bestaat niet.`);
  }

  return {
    id: snapshot.id,
    ref,
    data: snapshot.data() || {},
  };
}

function getServerTimestamp(now) {
  return typeof now === "function" ? now() : FieldValue.serverTimestamp();
}

function normalizeEmail(email = "") {
  return String(email || "").trim().toLowerCase();
}

function isConfiguredAdminEmail(email = "") {
  return normalizeEmail(email) === ADMIN_EMAIL;
}

function assertCanManageKlas(caller, klasId) {
  if (!allowedImportRoles.has(caller.role)) {
    throw new HttpsError("permission-denied", "Alleen admins en docenten mogen leerlingfoto-imports goedkeuren.");
  }

  if (caller.role === "admin") {
    return;
  }

  const callerKlasIds = Array.isArray(caller.klasIds)
    ? caller.klasIds
    : [caller.klasId].filter(Boolean);

  if (!callerKlasIds.includes(klasId)) {
    throw new HttpsError("permission-denied", "Je hebt geen toegang tot deze klas.");
  }
}

function assertAdminRole(caller) {
  if (caller.role !== "admin") {
    throw new HttpsError("permission-denied", "Alleen admins mogen deze actie uitvoeren.");
  }
}

function assertAdminOrSupervisorRole(caller) {
  const role = String(caller?.role || "").trim().toLowerCase();
  if (!["admin", "supervisor"].includes(role)) {
    throw new HttpsError("permission-denied", "Alleen admins en supervisors mogen deze actie uitvoeren.");
  }
}

function maskSecret(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (raw.length <= 12) return `${raw.slice(0, 3)}...${raw.slice(-2)}`;
  return `${raw.slice(0, 8)}...${raw.slice(-4)}`;
}

function normalizeOpenRouterConfig(data = {}, existing = {}) {
  const apiKey = String(data.apiKey || existing.apiKey || "").trim();
  const model = String(data.model || existing.model || DEFAULT_OPENROUTER_MODEL).trim();
  const enabled = data.enabled ?? existing.enabled ?? true;

  if (!apiKey) {
    throw new HttpsError("invalid-argument", "OpenRouter API-key is verplicht.");
  }

  if (!apiKey.startsWith("sk-or-")) {
    throw new HttpsError("invalid-argument", "OpenRouter API-key moet beginnen met sk-or-.");
  }

  if (!model) {
    throw new HttpsError("invalid-argument", "Model is verplicht.");
  }

  if (!ALLOWED_OPENROUTER_MODELS.has(model)) {
    throw new HttpsError("invalid-argument", "Kies een ondersteund Digidocent model.");
  }

  return { apiKey, model, enabled: Boolean(enabled) };
}

function buildOpenRouterConfigStatus(config = {}) {
  const apiKey = String(config.apiKey || "").trim();
  return {
    configured: Boolean(apiKey),
    enabled: config.enabled !== false,
    model: config.model || DEFAULT_OPENROUTER_MODEL,
    apiKeyMasked: maskSecret(apiKey),
    updatedAt: config.updatedAt || null,
    updatedBy: config.updatedBy || null,
  };
}

function buildOcrMessages(base64Image, mimeType = "image/jpeg") {
  return [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Lees alle zichtbare tekst in deze afbeelding. Geef alleen de herkende tekst terug. Behoud regels, opsommingen, formules en getallen zo goed mogelijk. Als er geen tekst zichtbaar is, antwoord dan met: [geen tekst gevonden]",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${base64Image}`,
          },
        },
      ],
    },
  ];
}

function isOcrRefusalText(text = "") {
  const normalized = String(text).toLowerCase();
  return [
    "can't view",
    "can't extract",
    "unable to extract",
    "unable to view",
    "as a text-based model",
    "i'm sorry",
    "i apologize",
  ].some((fragment) => normalized.includes(fragment));
}

function normalizeAiTutorRules(data = {}, existing = {}) {
  return {
    masterRules: String(data.masterRules ?? existing.masterRules ?? DEFAULT_MASTER_RULES).trim() || DEFAULT_MASTER_RULES,
    vmboRules: String(data.vmboRules ?? existing.vmboRules ?? DEFAULT_VMBO_MATH_RULES).trim() || DEFAULT_VMBO_MATH_RULES,
    adminRules: String(data.adminRules ?? existing.adminRules ?? "").trim(),
  };
}

function buildAiTutorRulesStatus(rules = {}) {
  const normalized = normalizeAiTutorRules({}, rules);
  return {
    ...normalized,
    updatedAt: rules.updatedAt || null,
    updatedBy: rules.updatedBy || null,
  };
}

async function getAiTutorRulesRuntime(db) {
  const snapshot = await db.doc(AI_TUTOR_RULES_PATH).get();
  return buildAiTutorRulesStatus(snapshot.exists ? snapshot.data() || {} : {});
}

async function getAiTutorRulesCore({ auth, db }) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om Digidocent regels te bekijken.");
  }

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Caller");
  assertAdminOrSupervisorRole(caller.data);

  return getAiTutorRulesRuntime(db);
}

async function updateAiTutorRulesCore({ auth, data, db, now }) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om Digidocent regels op te slaan.");
  }

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Caller");
  assertAdminOrSupervisorRole(caller.data);

  const rulesRef = db.doc(AI_TUTOR_RULES_PATH);
  const existingSnapshot = await rulesRef.get();
  const existing = existingSnapshot.exists ? existingSnapshot.data() || {} : {};
  const timestamp = getServerTimestamp(now);
  const rules = {
    ...normalizeAiTutorRules(data || {}, existing),
    updatedAt: timestamp,
    updatedBy: auth.uid,
  };

  await rulesRef.set(rules, { merge: true });
  return buildAiTutorRulesStatus(rules);
}

async function getOpenRouterConfigStatusCore({ auth, db }) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om AI-instellingen te bekijken.");
  }

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Caller");
  assertAdminRole(caller.data);

  const snapshot = await db.doc("privateConfig/openrouter").get();
  return buildOpenRouterConfigStatus(snapshot.exists ? snapshot.data() || {} : {});
}

async function updateOpenRouterConfigCore({ auth, data, db, now }) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om AI-instellingen op te slaan.");
  }

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Caller");
  assertAdminRole(caller.data);

  const configRef = db.doc("privateConfig/openrouter");
  const existingSnapshot = await configRef.get();
  const existing = existingSnapshot.exists ? existingSnapshot.data() || {} : {};
  const normalized = normalizeOpenRouterConfig(data || {}, existing);
  const timestamp = getServerTimestamp(now);
  const config = {
    ...normalized,
    updatedAt: timestamp,
    updatedBy: auth.uid,
  };

  await configRef.set(config, { merge: true });
  return buildOpenRouterConfigStatus(config);
}

async function getOpenRouterRuntimeConfig(db, openrouterApiKeyProvider) {
  const snapshot = await db.doc("privateConfig/openrouter").get();
  const stored = snapshot.exists ? snapshot.data() || {} : {};
  const fallbackKey = typeof openrouterApiKeyProvider === "function" ? openrouterApiKeyProvider() : "";
  const apiKey = String(stored.apiKey || fallbackKey || "").trim();
  const model = String(stored.model || DEFAULT_OPENROUTER_MODEL).trim();
  const enabled = stored.enabled !== false;

  if (!enabled) {
    throw new HttpsError("failed-precondition", "Digidocent staat uit in beheer.");
  }

  if (!apiKey) {
    throw new HttpsError("failed-precondition", "OpenRouter API-key ontbreekt.");
  }

  return { apiKey, model };
}

function getFirstName(user = {}) {
  const fromFirstName = String(user.firstName || "").trim();
  if (fromFirstName) return fromFirstName.split(/\s+/)[0];
  const fromDisplayName = String(user.displayName || "").trim();
  if (fromDisplayName) return fromDisplayName.split(/\s+/)[0];
  const fromEmail = String(user.email || "").split("@")[0].trim();
  return fromEmail || "leerling";
}

async function assertAiTutorAllowed({ auth, db }) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om Digidocent te gebruiken.");
  }

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Gebruiker");
  const callerData = caller.data || {};
  const role = String(callerData.role || "").toLowerCase();

  if (role === "admin") {
    return { user: callerData, firstName: getFirstName(callerData) };
  }

  const klasId = callerData.klasId;
  if (!klasId) {
    throw new HttpsError("failed-precondition", "Je bent nog niet aan een klas gekoppeld.");
  }

  const klas = await getRequiredDoc(db.doc(`klassen/${klasId}`), "Klas");
  if (klas.data?.settings?.aiEnabled === false) {
    throw new HttpsError("permission-denied", "Digidocent staat uit voor jouw klas.");
  }

  return { user: callerData, firstName: getFirstName(callerData), klas: klas.data };
}

async function assertSignedInUserProfile({ auth, db }) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om je antwoord te laten beoordelen.");
  }

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Gebruiker");
  const callerData = caller.data || {};
  return { user: callerData, firstName: getFirstName(callerData) };
}

async function assertAiTutorBlockAllowed({ db, blockId, itemId = "" }) {
  const cleanBlockId = String(blockId || "").trim();
  if (!cleanBlockId) return null;

  const block = await getRequiredDoc(db.doc(`contentBlocks/${cleanBlockId}`), "Lesblok");
  const blockData = block.data || {};
  const cleanItemId = String(itemId || "").trim();

  // Herkansing van een toets- of quizvraag: Digidocent mag helpen zodra de
  // herkansingsronde van het blok aanstaat, ook als de gewone Digidocent-hulp
  // op het blok uit staat (die geldt voor de eerste ronde).
  if (cleanItemId && (blockData.type === "quiz" || blockData.type === "toets")) {
    const retryPolicy = blockData.content?.retryPolicy || {};
    if (retryPolicy.enabled === false || retryPolicy.aiHelp === false) {
      throw new HttpsError("permission-denied", "Digidocent staat uit bij de herkansing van dit lesblok.");
    }
    const items = Array.isArray(blockData.content?.items) ? blockData.content.items : [];
    const item = items.find((entry) => String(entry?.id || "") === cleanItemId) || null;
    if (!item) {
      throw new HttpsError("invalid-argument", "Deze toetsvraag bestaat niet in dit lesblok.");
    }
    return { block: blockData, item };
  }

  if (blockData.settings?.allowAiHelp !== true) {
    throw new HttpsError("permission-denied", "Digidocent staat uit voor dit lesblok.");
  }
  return { block: blockData, item: null };
}

/**
 * Foutdiagnose voor de herkansing van een toets- of quizvraag, uit de
 * VOLLEDIGE vraagdefinitie (met sleutel) die alleen hier op de server ligt.
 * Levert de richting voor Digidocent ("de leerling koos X, daar zit de
 * denkfout") en de teksten van de juiste opties, zodat het antwoord van het
 * model daarop gefilterd kan worden.
 */
function buildAssessmentRetryDiagnosis({ item = null, itemAnswer = null } = {}) {
  if (!item) return null;
  const type = String(item.type || item.vraagtype || item.answer?.type || "").trim();
  const answer = item.answer || {};
  const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
  const chosen = Array.isArray(itemAnswer) ? itemAnswer : (itemAnswer === null || itemAnswer === undefined ? [] : [itemAnswer]);
  const lines = [];
  const correctTexts = [];

  if (type === "meerkeuze" || type === "waar-niet-waar") {
    const options = Array.isArray(answer.options) && answer.options.length ? answer.options : (item.options || []);
    options.forEach((option) => {
      if (option?.correct === true && clean(option.text)) correctTexts.push(clean(option.text));
    });
    const gekozen = options.filter((option) => chosen.map(String).includes(String(option?.id || "")));
    gekozen.forEach((option) => {
      const status = option.correct === true ? "die optie was op zich juist" : "die optie is onjuist";
      const note = clean(option.explanation || option.misconception);
      lines.push(`De leerling koos "${clean(option.text)}" (${status}).${note ? ` Docentnotitie bij die keuze: ${note}` : ""}`);
    });
    const gemist = options.filter((option) => option?.correct === true && !chosen.map(String).includes(String(option?.id || "")));
    if (gemist.length && gekozen.length && gekozen.every((option) => option.correct === true)) {
      lines.push("De gekozen optie(s) klopten, maar er ontbraken nog juiste opties. Laat de leerling de andere opties opnieuw langslopen.");
    }
  } else if (type === "koppelen") {
    const pairs = Array.isArray(answer.pairs) ? answer.pairs : [];
    const submitted = itemAnswer && typeof itemAnswer === "object" && !Array.isArray(itemAnswer) ? itemAnswer : {};
    pairs.forEach((pair) => {
      const keuze = submitted[pair.id];
      const gekozenTekst = clean(typeof keuze === "object" ? keuze?.text : keuze);
      if (gekozenTekst && gekozenTekst !== clean(pair.right)) {
        lines.push(`Bij "${clean(pair.left)}" koos de leerling "${gekozenTekst}"; dat hoort er niet bij.`);
      }
      if (clean(pair.right)) correctTexts.push(clean(pair.right));
    });
  } else if (type === "volgorde") {
    lines.push("De leerling zette de stappen in een verkeerde volgorde. Laat de leerling per stap benoemen wat er eerst moet gebeuren en waarom.");
  } else if (type === "numeriek") {
    lines.push(`De leerling gaf ${clean(chosen[0])} als getal; dat wijkt af van het verwachte antwoord${answer.unit ? ` (eenheid: ${clean(answer.unit)})` : ""}. Laat de leerling de berekening stap voor stap uitspreken.`);
    if (answer.expected !== undefined) correctTexts.push(clean(answer.expected));
  } else if (type === "invullen") {
    lines.push("Een of meer invulwoorden klopten niet. Laat de leerling de zin hardop lezen en per gat bedenken welk begrip uit de les erin past.");
    (Array.isArray(answer.gaps) ? answer.gaps : []).forEach((gap) => {
      if (clean(gap.answer)) correctTexts.push(clean(gap.answer));
    });
  }

  const feedback = clean(item.feedback);
  if (feedback) {
    lines.push(`Docentuitleg bij deze vraag (kan het antwoord bevatten, gebruik alleen de redenering): ${feedback}`);
  }

  if (!lines.length) return null;

  return {
    promptText: [
      "Dit is een herkansing: de leerling had deze vraag in de eerste ronde fout.",
      ...lines,
      "Gebruik deze diagnose om precies één gerichte denkvraag of hint te geven over de gemaakte fout.",
      "Noem NOOIT de tekst van de juiste optie of het juiste antwoord, ook niet omschreven; de leerling moet het zelf vinden."
    ].join("\n"),
    correctTexts: [...new Set(correctTexts.filter((text) => text.length >= 3))],
  };
}

/**
 * Laatste slot op de deur: als het model toch de tekst van een juiste optie
 * noemt, vervangt die zin een neutrale denkvraag. Korte woorden (< 3 tekens)
 * en getallen die ook in de vraag staan worden bewust niet gefilterd.
 */
function stripAssessmentAnswerLeaks(content = "", correctTexts = []) {
  const text = String(content || "");
  if (!text || !correctTexts.length) return text;
  const sentences = text.split(/(?<=[.!?])\s+/u);
  let leaked = false;
  const kept = sentences.filter((sentence) => {
    const hit = correctTexts.some((correct) => correct && sentence.toLowerCase().includes(correct.toLowerCase()));
    if (hit) leaked = true;
    return !hit;
  });
  if (!leaked) return text;
  const rest = kept.join(" ").trim();
  return `${rest ? `${rest} ` : ""}Kijk nog eens goed naar wat de vraag precies vraagt: welke keuze past daar het beste bij, en waarom?`.trim();
}

function buildAiTutorRuleSections(rules = {}) {
  const normalized = normalizeAiTutorRules({}, rules);
  const extraMasterRules = normalized.masterRules !== DEFAULT_MASTER_RULES ? normalized.masterRules : "";
  const extraVmboRules = normalized.vmboRules !== DEFAULT_VMBO_MATH_RULES ? normalized.vmboRules : "";
  return [
    "## Veiligheidsregels",
    AI_TUTOR_SAFETY_RULES,
    "",
    "## Administratorregels uit Firestore",
    normalized.adminRules || "Er zijn nog geen extra administratorregels ingesteld.",
    "",
    "## Vaste VMBO-vakspecifieke regels",
    DEFAULT_VMBO_MATH_RULES,
    ...(extraVmboRules ? ["", "## Aanvullende VMBO-regels uit beheer", extraVmboRules] : []),
    "",
    "## Vaste Tutorregels / masterRules",
    DEFAULT_MASTER_RULES,
    ...(extraMasterRules ? ["", "## Aanvullende masterRules uit beheer", extraMasterRules] : []),
  ].join("\n");
}

function buildAiTutorSystemPrompt({
  contextHeading = "deze vraag",
  firstName = "leerling",
  studentAnswer = "",
  lessonContext = "",
  rules = {},
  retryDiagnosis = null,
} = {}) {
  const answerText = String(studentAnswer || "").trim();
  const lessonContextText = String(lessonContext || "").trim().slice(0, 6000);
  const diagnosis = retryDiagnosis || buildAiTutorMistakeDiagnosis({ studentAnswer: answerText });
  return `${buildAiTutorRuleSections(rules)}

## Actuele lescontext
Je helpt ${firstName} met het vakgebied van de opdracht: "${contextHeading}".
${lessonContextText ? `\n## Scherm- en paragraafcontext\n${lessonContextText}` : ""}

## Vraagcontext en leerlingantwoord
Huidige leerlingpoging: ${answerText || "[nog geen poging]"}
${diagnosis ? `\n## Automatische foutdiagnose\n${diagnosis.promptText}` : ""}

## Interactieregels voor dit antwoord
Als de leerling nog geen antwoord of beginpoging heeft gegeven, zeg dan tegen ${firstName} dat die eerst zelf moet nadenken en een eerste antwoord of aanpak moet invullen.
Als er wel een poging is, analyseer dan die poging kort en stel precies een volgende helpende vraag.
Gebruik de scherm- en paragraafcontext om verbanden tussen fouten, herhaalde missers, ontbrekende berekeningen, antwoord, formule en eenheid te herkennen.
Als de pogingcontext aangeeft dat het gekozen antwoord onjuist is, benoem vriendelijk dat de keuze nog niet klopt en stel een denkstapvraag.
Als er een automatische foutdiagnose staat, gebruik die richting expliciet: benoem de vermoedelijke denkfout, verwijs naar het teken of de bewerking in de vraag, en stel een korte controlevraag.
Verklap daarbij nooit de juiste optie, het juiste antwoord of de tekst van de correcte keuze.
Houd je antwoord kort: maximaal 2 tot 3 volledige zinnen.
Schrijf wiskunde altijd als gewone leesbare tekst, zonder LaTeX, markdown of dollartekens. Gebruik bijvoorbeeld "3 keer 3", "3 + 3" en "wortel van 9".
Eindig altijd met een volledige zin en een eindteken.`;
}

function isCompleteAiTutorSentence(content = "") {
  const text = String(content || "").trim();
  if (!text) return false;
  if (!/[.!?]$/u.test(text)) return false;
  return !/(?:,\s*|\b(?:en|of|om|als|want|maar|dat|die|kun je|kun jij|met))$/iu.test(text);
}

function extractAiTutorOpenAnswer(studentAnswer = "") {
  const attemptMatch = String(studentAnswer || "").match(/Leerlingpoging:\s*(\{.*\})/isu);
  if (!attemptMatch) return "";

  try {
    const parsed = JSON.parse(attemptMatch[1]);
    return String(parsed.openAnswer || parsed.expectedValue || "").trim();
  } catch {
    return "";
  }
}

function buildAiTutorPercentFallbackHint({ firstName = "leerling", studentAnswer = "", lessonContext = "" } = {}) {
  const contextText = normalizeReadableMathText(`${studentAnswer}\n${lessonContext}`);
  const percentQuestion = contextText.match(/\b\d+(?:[,.]\d+)?\s*%\s+van\s+\d+(?:[,.]\d+)?\b/iu)?.[0] || "";
  if (!percentQuestion) return "";

  const openAnswer = extractAiTutorOpenAnswer(studentAnswer);
  const answerPart = openAnswer ? ` Je schreef "${openAnswer}".` : "";
  return `${firstName}, kijk nog eens naar "${percentQuestion}".${answerPart} Vraagt de opdracht om een percentage of om een hoeveelheid, en welke berekening laat dat zien?`;
}

function buildAiTutorFallbackHint({ firstName = "leerling", studentAnswer = "", lessonContext = "" } = {}) {
  const percentHint = buildAiTutorPercentFallbackHint({ firstName, studentAnswer, lessonContext });
  if (percentHint) {
    return percentHint;
  }

  const diagnosis = buildAiTutorMistakeDiagnosis({ studentAnswer });
  if (diagnosis?.hintText) {
    return `${firstName}, ${diagnosis.hintText}`;
  }

  const answerText = String(studentAnswer || "").toLowerCase();
  if (answerText.includes("onjuist") || answerText.includes("incorrect")) {
    return `${firstName}, je gekozen antwoord lijkt nog niet te kloppen. Kijk nog eens naar de vraag en bedenk welke stap of berekening je keuze kan controleren.`;
  }

  return `${firstName}, ik kan nu geen goede hint maken. Kijk nog eens naar je eigen antwoord en vertel welke stap je hebt gebruikt.`;
}

function hasMeaningfulAiTutorStudentAttempt(studentAnswer = "") {
  const answerText = String(studentAnswer || "").trim();
  if (!answerText) return false;

  if (/leerling heeft nog geen optie gekozen|nog geen leerlingantwoord|nog geen poging|laat de leerling eerst zelf/iu.test(answerText)) {
    return false;
  }

  if (/antwoordstatus:\s*gekozen antwoord is/iu.test(answerText)) {
    return true;
  }

  if (/gekozen optie\(s\):/iu.test(answerText)) {
    return true;
  }

  if (/(?:pythagoras schema:\s*[1-9]\d*\s+ingevulde velden|verhoudingstabel:\s*\d+\s+kolommen,\s*[1-9]\d*\s+ingevulde velden)/iu.test(answerText)) {
    return true;
  }

  const attemptMatch = answerText.match(/Leerlingpoging:\s*(\{.*\})/isu);
  if (!attemptMatch) {
    return true;
  }

  try {
    const parsed = JSON.parse(attemptMatch[1]);
    return Object.entries(parsed).some(([key, value]) => {
      if (key === "mathTools") return false;
      if (key === "orderTouched") return value === true;
      if (Array.isArray(value)) return value.length > 0;
      if (value && typeof value === "object") return Object.keys(value).length > 0;
      return String(value || "").trim().length > 0;
    });
  } catch {
    return true;
  }
}

function buildAiTutorTryFirstHint({ firstName = "leerling" } = {}) {
  return `${firstName}, probeer eerst zelf een antwoord of aanpak in te vullen. Daarna help ik je met een denkstap, zonder het antwoord voor te zeggen.`;
}

function normalizeReadableMathText(content = "") {
  return String(content || "")
    .replace(/\\\(([\s\S]*?)\\\)/g, "$1")
    .replace(/\\\[([\s\S]*?)\\\]/g, "$1")
    .replace(/\$+\s*([\s\S]*?)\s*\$+/g, "$1")
    .replace(/\\\s*times\b/giu, " keer ")
    .replace(/\\\s*cdot\b/giu, " keer ")
    .replace(/\\\s*div\b/giu, " gedeeld door ")
    .replace(/\\\s*sqrt\s*\{([^{}]+)\}/giu, "wortel van $1")
    .replace(/\\\s*sqrt\b/giu, "wortel")
    .replace(/\\\s*frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/giu, "$1 gedeeld door $2")
    .replace(/\\\s+(keer|gedeeld door|wortel)/giu, "$1")
    .replace(/\^\s*\{?2\}?/g, " kwadraat")
    .replace(/\\(?:left|right)\b/g, "")
    .replace(/[{}]/g, "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function normalizeAiTutorContent(content, options = {}) {
  const text = normalizeReadableMathText(content);
  if (/\b(?:geen goede hint|kan nu geen hint|kan geen goede hint|geen hint maken)\b/iu.test(text)) {
    return buildAiTutorFallbackHint(options);
  }

  if (isCompleteAiTutorSentence(text)) {
    return text;
  }

  return buildAiTutorFallbackHint(options);
}

function extractAiTutorQuestionText(studentAnswer = "") {
  const match = String(studentAnswer || "").match(/^Vraag:\s*(.+)$/imu);
  return match ? match[1].trim() : "";
}

function extractAiTutorAttemptValues(studentAnswer = "") {
  const attemptMatch = String(studentAnswer || "").match(/Leerlingpoging:\s*(\{.*\})/isu);
  if (!attemptMatch) return [];

  try {
    const parsed = JSON.parse(attemptMatch[1]);
    return Object.entries(parsed)
      .filter(([key]) => !["mathTools", "orderTouched", "orderItems"].includes(key))
      .map(([, value]) => value)
      .filter((value) => value !== null && value !== undefined && typeof value !== "object")
      .map((value) => String(value).trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

const arithmeticOperatorLabels = {
  "+": "optellen",
  "-": "aftrekken",
  "x": "vermenigvuldigen",
  "*": "vermenigvuldigen",
  "\u00d7": "vermenigvuldigen",
  ":": "delen",
  "/": "delen",
};

const arithmeticOperatorNames = {
  "+": "plus-teken",
  "-": "min-teken",
  "x": "keer-teken",
  "*": "keer-teken",
  "\u00d7": "keer-teken",
  ":": "deel-teken",
  "/": "deel-teken",
};

function calculateSimpleOperation(left, operator, right) {
  switch (operator) {
    case "+": return left + right;
    case "-": return left - right;
    case "x":
    case "*":
    case "\u00d7": return left * right;
    case ":":
    case "/": return right === 0 ? null : left / right;
    default: return null;
  }
}

function findArithmeticExpressions(text = "") {
  const expressions = [];
  const regex = /(-?\d+(?:[,.]\d+)?)\s*([+\-x\u00d7*:/])\s*(-?\d+(?:[,.]\d+)?)/giu;
  let match = regex.exec(String(text || ""));
  while (match) {
    expressions.push({
      raw: match[0],
      left: Number(String(match[1]).replace(",", ".")),
      operator: match[2],
      right: Number(String(match[3]).replace(",", ".")),
    });
    match = regex.exec(String(text || ""));
  }
  return expressions;
}

function numbersEqual(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  return Math.abs(a - b) < 0.000001;
}

function buildAiTutorMistakeDiagnosis({ studentAnswer = "" } = {}) {
  const questionText = extractAiTutorQuestionText(studentAnswer);
  const attemptValues = extractAiTutorAttemptValues(studentAnswer);
  if (!questionText || !attemptValues.length) return null;

  const expressions = findArithmeticExpressions(questionText);
  const operators = ["+", "-", "x", "*", "\u00d7", ":", "/"];

  for (let index = 0; index < expressions.length; index += 1) {
    const expression = expressions[index];
    const rawAttempt = attemptValues[index] ?? attemptValues[0];
    const numericAttempt = Number(String(rawAttempt).replace(",", "."));
    if (!Number.isFinite(numericAttempt)) continue;

    const expectedValue = calculateSimpleOperation(expression.left, expression.operator, expression.right);
    if (numbersEqual(numericAttempt, expectedValue)) continue;

    const mistakenOperator = operators.find((operator) =>
      operator !== expression.operator &&
      numbersEqual(numericAttempt, calculateSimpleOperation(expression.left, operator, expression.right))
    );

    if (!mistakenOperator) continue;

    const expectedLabel = arithmeticOperatorLabels[expression.operator] || "de bewerking uit de vraag";
    const mistakenLabel = arithmeticOperatorLabels[mistakenOperator] || "een andere bewerking";
    const signName = arithmeticOperatorNames[expression.operator] || "rekenteken";

    return {
      type: "wrong_arithmetic_operation",
      promptText: [
        `Vermoedelijke fout: de leerling heeft bij "${expression.raw}" waarschijnlijk ${mistakenLabel} gebruikt in plaats van ${expectedLabel}.`,
        `Didactische richting: verwijs naar het ${signName} in de vraag en laat de leerling zelf benoemen welke bewerking gevraagd wordt.`,
        "Geef het eindantwoord niet."
      ].join("\n"),
      hintText: `je lijkt bij "${expression.raw}" ${mistakenLabel} te hebben gebruikt. Kijk naar het teken tussen de getallen: welke bewerking vraagt de vraag?`,
    };
  }

  return null;
}

function stripHtml(value = "") {
  return String(value || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractJsonObject(text = "") {
  const raw = String(text || "").trim();
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced ? fenced[1].trim() : raw;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found");
  }

  return JSON.parse(source.slice(start, end + 1));
}

function normalizeOpenAnswerAssessment(rawAssessment = {}) {
  const feedback = String(rawAssessment.feedback || rawAssessment.message || "").trim();
  return {
    isCorrect: rawAssessment.isCorrect === true,
    feedback: feedback || (rawAssessment.isCorrect === true
      ? "Mooi, je antwoord is voldoende. Je kunt verder."
      : "Je bent er nog niet helemaal. Vul je antwoord aan en probeer opnieuw."),
    missing: Array.isArray(rawAssessment.missing)
      ? rawAssessment.missing.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 5)
      : [],
  };
}

function buildOpenAnswerAssessmentMessages({
  questionTitle = "Open vraag",
  questionPrompt = "",
  modelAnswer = "",
  studentAnswer = "",
  firstName = "leerling",
  rules = {},
} = {}) {
  const promptText = stripHtml(questionPrompt);
  const modelText = stripHtml(modelAnswer);

  return [
    {
      role: "system",
      content: `${buildAiTutorRuleSections(rules)}

## Beoordelingsopdracht
Je beoordeelt open antwoorden voor HELIX, een Nederlands leerplatform.
Geef alleen geldig JSON terug, zonder markdown.
Schema: {"isCorrect": boolean, "feedback": "korte socratische feedback", "missing": ["maximaal 3 korte punten"]}.
Beoordeel ruim maar inhoudelijk: kleine taalfouten zijn geen probleem.
Als het antwoord onvoldoende is, geef geen volledig modelantwoord en verklap geen eindantwoord. Stel een korte denkvragen-hint aan ${firstName}.
Als het antwoord voldoende is, zet isCorrect op true en geef een korte bevestiging.`,
    },
    {
      role: "user",
      content: [
        `Vraag: ${questionTitle}`,
        promptText ? `Vraagtekst: ${promptText}` : "",
        modelText ? `Modelantwoord of beoordelingsrichting: ${modelText}` : "Er is geen modelantwoord ingevuld; beoordeel of het antwoord de vraag logisch en volledig beantwoordt.",
        `Leerlingantwoord: ${studentAnswer}`,
      ].filter(Boolean).join("\n"),
    },
  ];
}

async function assessOpenAnswerCore({
  auth,
  data,
  db,
  openrouterApiKeyProvider,
  fetchImpl = fetch,
}) {
  const studentAnswer = String(data?.studentAnswer || "").trim();
  if (!studentAnswer) {
    throw new HttpsError("invalid-argument", "Vul eerst een antwoord in.");
  }

  const { firstName } = await assertSignedInUserProfile({ auth, db });

  // Het modelantwoord komt van de server, niet van de client. Een leerling
  // stuurt blockId en fieldId mee; het antwoord en de uitleg staan in het
  // private lesblok (exercise.fields) en gaan pas in de response terug NADAT
  // hier beoordeeld is. Zo staat de uitwerking nooit vooraf in de browser.
  // De client-parameter modelAnswer blijft bestaan voor gegenereerde opdrachten
  // (uitdaging en herstel aan het paragraafeinde) die geen lesblokveld hebben.
  let modelAnswer = String(data?.modelAnswer || "");
  let explanation = "";
  const fieldId = String(data?.fieldId || "").trim();
  const blockIdForField = String(data?.blockId || "").trim();
  if (fieldId && blockIdForField) {
    const blockDoc = await getRequiredDoc(db.doc(`contentBlocks/${blockIdForField}`), "Lesblok");
    const fields = blockDoc.data?.content?.exercise?.fields || [];
    const field = fields.find((entry) => String(entry?.id || "") === fieldId);
    if (!field) {
      throw new HttpsError("not-found", "Deze opgave bestaat niet (meer) in het lesblok.");
    }
    modelAnswer = String(field.modelAnswer || "");
    explanation = String(field.explanation || "");
  }

  const runtimeConfig = await getOpenRouterRuntimeConfig(db, openrouterApiKeyProvider);
  const aiTutorRules = await getAiTutorRulesRuntime(db);
  const messages = buildOpenAnswerAssessmentMessages({
    questionTitle: data?.questionTitle,
    questionPrompt: data?.questionPrompt,
    modelAnswer,
    studentAnswer,
    firstName,
    rules: aiTutorRules,
  });

  const response = await fetchImpl("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${runtimeConfig.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://stellingvanpythagoras.nl",
      "X-Title": "HELIX App",
    },
    body: JSON.stringify({
      model: runtimeConfig.model,
      messages,
      max_tokens: 350,
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("OpenRouter assessment API Error:", response.status, errText);
    throw new HttpsError("internal", OPEN_ANSWER_ASSESSMENT_FALLBACK_ERROR);
  }

  const responseData = await response.json();
  const content = responseData.choices?.[0]?.message?.content || "";
  try {
    return {
      success: true,
      ...normalizeOpenAnswerAssessment(extractJsonObject(content)),
      // Na de beoordeling mag de uitwerking mee terug: de leerling heeft dan
      // ingeleverd en gaat zichzelf ermee vergelijken en beoordelen.
      ...(fieldId ? { modelAnswer, explanation } : {}),
    };
  } catch {
    console.error("Open answer assessment returned non-JSON content.");
    return {
      success: false,
      error: OPEN_ANSWER_ASSESSMENT_FALLBACK_ERROR,
    };
  }
}

async function extractTextViaOcrCore({
  auth,
  data,
  db,
  openrouterApiKeyProvider,
  fetchImpl = fetch,
}) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om OCR te gebruiken.");
  }

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Caller");
  assertAdminRole(caller.data);

  const imageBase64 = String(data?.imageBase64 || "").trim();
  const mimeType = String(data?.mimeType || "image/jpeg").trim();

  if (!imageBase64) {
    throw new HttpsError("invalid-argument", "Afbeelding ontbreekt.");
  }

  if (!/^image\/(jpeg|jpg|png|webp)$/i.test(mimeType)) {
    throw new HttpsError("invalid-argument", "Alleen JPEG, PNG en WebP afbeeldingen worden ondersteund.");
  }

  if (imageBase64.length > 9_000_000) {
    throw new HttpsError("invalid-argument", "Afbeelding is te groot voor OCR.");
  }

  const runtimeConfig = await getOpenRouterRuntimeConfig(db, openrouterApiKeyProvider);
  const response = await fetchImpl("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${runtimeConfig.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://stellingvanpythagoras.nl",
      "X-Title": "HELIX CMS OCR",
    },
    body: JSON.stringify({
      model: DEFAULT_OCR_MODEL,
      messages: buildOcrMessages(imageBase64, mimeType),
      max_tokens: 2000,
      temperature: 0,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("OpenRouter OCR API Error:", response.status, errText);
    throw new HttpsError("internal", "OCR kon OpenRouter niet bereiken.");
  }

  const responseData = await response.json();
  const extractedText = String(responseData.choices?.[0]?.message?.content || "").trim();

  if (!extractedText) {
    throw new HttpsError("internal", "OCR gaf geen tekst terug.");
  }

  if (isOcrRefusalText(extractedText)) {
    throw new HttpsError("internal", "OCR kon deze afbeelding niet lezen.");
  }

  return {
    success: true,
    text: extractedText,
  };
}

async function askAiTutorCore({
  auth,
  data,
  db,
  openrouterApiKeyProvider,
  fetchImpl = fetch,
}) {
  const message = String(data?.message || "").trim();
  if (!message) {
    throw new HttpsError("invalid-argument", "Bericht is verplicht.");
  }

  const { firstName } = await assertAiTutorAllowed({ auth, db });
  const blockAccess = await assertAiTutorBlockAllowed({ db, blockId: data?.blockId, itemId: data?.itemId });
  const runtimeConfig = await getOpenRouterRuntimeConfig(db, openrouterApiKeyProvider);
  const contextHeading = String(data?.contextHeading || "deze vraag").trim();
  const previousMessages = Array.isArray(data?.previousMessages) ? data.previousMessages : [];
  const hints = Array.isArray(data?.hints) ? data.hints : [];
  const studentAnswer = data?.studentAnswer || "";
  const lessonContext = data?.lessonContext || "";
  const aiTutorRules = await getAiTutorRulesRuntime(db);
  // Herkansing van een toetsvraag: de foutdiagnose komt uit de vraagdefinitie
  // met sleutel, die alleen hier ligt.
  const retryDiagnosis = blockAccess?.item
    ? buildAssessmentRetryDiagnosis({ item: blockAccess.item, itemAnswer: data?.itemAnswer ?? null })
    : null;

  if (!retryDiagnosis && !hasMeaningfulAiTutorStudentAttempt(studentAnswer)) {
    return {
      success: true,
      content: buildAiTutorTryFirstHint({ firstName }),
      helpCounted: false,
    };
  }

  const systemPrompt = buildAiTutorSystemPrompt({
    contextHeading,
    firstName,
    studentAnswer,
    lessonContext,
    rules: aiTutorRules,
    retryDiagnosis,
  });

  const messages = [
    { role: "system", content: systemPrompt },
    ...previousMessages.map((item) => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: String(item.content || "").slice(0, 2000),
    })),
    ...(hints.length ? [{ role: "system", content: `Beschikbare docent-hints: ${hints.join(" | ")}` }] : []),
    { role: "user", content: message },
  ];

  const response = await fetchImpl("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${runtimeConfig.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://stellingvanpythagoras.nl",
      "X-Title": "HELIX App",
    },
    body: JSON.stringify({
      model: runtimeConfig.model,
      messages,
      max_tokens: 450,
      temperature: 0.35,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("OpenRouter API Error:", response.status, errText);
    throw new HttpsError("internal", "Digidocent kon OpenRouter niet bereiken.");
  }

  const responseData = await response.json();
  const normalized = normalizeAiTutorContent(responseData.choices?.[0]?.message?.content, { firstName, studentAnswer, lessonContext });
  return {
    success: true,
    content: retryDiagnosis ? stripAssessmentAnswerLeaks(normalized, retryDiagnosis.correctTexts) : normalized,
    helpCounted: true,
  };
}

// ---------------------------------------------------------------------------
// Nakijken van gesloten vragen (server-side)
//
// De antwoordsleutel hoort niet in de leerlingbrowser: buildPublicQuestionView
// strijkt hem er bewust uit. Daardoor kan de leerlingroute niet zelf nakijken.
// Deze callable haalt de VOLLEDIGE vraag uit de private collectie `vraag` met
// de Admin SDK, draait daar de gedeelde beoordelingslaag op (byte-identieke
// kopie van src/lib in functions/shared, zie scripts/sync-functions-shared.mjs)
// en geeft alleen het oordeel terug. Nooit de sleutel, nooit het modelantwoord,
// nooit welke optie de juiste was.
// ---------------------------------------------------------------------------

let sharedGradingLayerPromise = null;

function loadSharedGradingLayer() {
  if (!sharedGradingLayerPromise) {
    // De gedeelde laag is ESM; functions is CommonJS. Een dynamische import
    // over die grens is precies waarom functions/shared een eigen
    // package.json met `type: module` heeft.
    sharedGradingLayerPromise = Promise.all([
      import("./shared/questionGrading.js"),
      import("./shared/questionPreviewUtils.js"),
      import("./shared/assessmentItemGrading.js"),
      import("./shared/answerExplanationFeedback.js"),
    ]).then(([grading, previewUtils, assessmentGrading, explanationFeedback]) => ({
      gradeQuestionAnswer: grading.gradeQuestionAnswer,
      GRADE_REASONS: grading.GRADE_REASONS,
      buildQuestionPreviewModel: previewUtils.buildQuestionPreviewModel,
      gradeAssessmentItemAnswer: assessmentGrading.gradeAssessmentItemAnswer,
      getAssessmentGradingType: assessmentGrading.getAssessmentGradingType,
      buildAssessmentItemExplanationFeedback:
        assessmentGrading.buildAssessmentItemExplanationFeedback,
      buildQuestionExplanationFeedback: explanationFeedback.buildQuestionExplanationFeedback,
    }));
  }

  return sharedGradingLayerPromise;
}

function normalizeSubmittedAnswers(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const serialized = JSON.stringify(value);
  if (typeof serialized !== "string") return {};
  if (serialized.length > QUESTION_GRADING_ANSWER_MAX_CHARS) {
    throw new HttpsError("invalid-argument", "Dit antwoord is te groot om na te kijken.");
  }

  return JSON.parse(serialized);
}

function getStudentOverride(klasData = {}, uid = "") {
  const overrides = klasData?.studentOverrides;
  if (!overrides || typeof overrides !== "object") return {};
  const override = overrides[uid];
  return override && typeof override === "object" ? override : {};
}

function asIdList(value) {
  return Array.isArray(value) ? value.map((item) => String(item || "")) : [];
}

// Spiegelt isAssignedParagraph() uit firestore.rules.
function isParagraphAssignedToStudent(klasData = {}, uid = "", paragraafId = "") {
  if (!paragraafId) return false;
  const override = getStudentOverride(klasData, uid);
  return (
    asIdList(klasData?.enabledParagrafen).includes(paragraafId) ||
    asIdList(override.extraParagrafen).includes(paragraafId)
  );
}

// Spiegelt isAssignedContentBlock() uit firestore.rules.
function isContentBlockAssignedToStudent(klasData = {}, uid = "", paragraafId = "", blockId = "") {
  if (!blockId) return false;
  const classSelection = klasData?.enabledContentBlocks?.[paragraafId];
  const override = getStudentOverride(klasData, uid);
  const studentExtra = asIdList(override.extraContentBlocks?.[paragraafId]);

  if (!Array.isArray(classSelection)) return true;
  return asIdList(classSelection).includes(blockId) || studentExtra.includes(blockId);
}

/**
 * Mag deze aanroeper deze vraag laten nakijken?
 *
 * Zonder deze controle kan een leerling willekeurige vraag-ids langslopen en
 * met geraden antwoorden de sleutel aftasten. De regels hier zijn dezelfde als
 * die van publicQuestions/publicContentBlocks in firestore.rules: gepubliceerd,
 * niet gearchiveerd, en toegewezen aan de klas of aan deze leerling.
 */
async function assertQuestionAssignedToCaller({ db, uid, callerData = {}, vraag = {}, blockId = "" }) {
  const role = String(callerData.role || "").trim().toLowerCase();
  if (role === "admin" || role === "supervisor" || isConfiguredAdminEmail(callerData.email)) {
    return { role: role || "admin", rateLimited: false };
  }

  if (vraag.status !== "published" || vraag.isArchived === true) {
    throw new HttpsError("failed-precondition", "Deze vraag staat niet klaar om nagekeken te worden.");
  }

  const paragraafId = String(vraag.paragraafId || "").trim();
  const klasId = String(callerData.klasId || "").trim();
  if (!klasId) {
    throw new HttpsError("failed-precondition", "Je bent nog niet aan een klas gekoppeld.");
  }

  const klas = await getRequiredDoc(db.doc(`klassen/${klasId}`), "Klas");
  if (!isParagraphAssignedToStudent(klas.data, uid, paragraafId)) {
    throw new HttpsError("permission-denied", "Deze vraag hoort niet bij jouw lesstof.");
  }

  const blockSnapshot = blockId ? await db.doc(`contentBlocks/${blockId}`).get() : null;

  // Een onbekend lesblok geeft geen extra rechten: dan geldt alleen de
  // paragraafcontrole hierboven, net alsof er geen blockId was meegestuurd.
  if (blockSnapshot?.exists) {
    const blockData = blockSnapshot.data() || {};

    if (String(blockData.linkedVraagId || "") !== String(vraag.id || "")) {
      throw new HttpsError("permission-denied", "Dit lesblok hoort niet bij deze vraag.");
    }

    if (String(blockData.paragraafId || "") !== paragraafId) {
      throw new HttpsError("permission-denied", "Dit lesblok hoort niet bij deze paragraaf.");
    }

    if (!isContentBlockAssignedToStudent(klas.data, uid, paragraafId, blockId)) {
      throw new HttpsError("permission-denied", "Dit lesblok hoort niet bij jouw lesstof.");
    }
  }

  return { role: role || "student", rateLimited: true };
}

/**
 * Rem tegen aftasten: een leerling die dezelfde vraag twintig keer achter
 * elkaar laat nakijken is aan het raden, niet aan het leren. Vier pogingen is
 * de didactische grens; dit venster laat ruimte voor herstel en dubbelklikken
 * en zet daarna de deur dicht.
 */
async function assertQuestionGradingRateLimit({ db, uid, subjectId, nowMs }) {
  const limitRef = db.doc(`questionGradingRateLimits/${cleanIdPart(uid)}__${cleanIdPart(subjectId)}`);

  await runDbTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(limitRef);
    const existing = snapshot.exists ? snapshot.data() || {} : {};
    const windowStartedAt = Number(existing.windowStartedAt);
    const withinWindow =
      Number.isFinite(windowStartedAt) && nowMs - windowStartedAt < QUESTION_GRADING_RATE_LIMIT_WINDOW_MS;
    const count = withinWindow ? normalizeNonNegativeInteger(existing.count, 0) : 0;

    if (count >= QUESTION_GRADING_RATE_LIMIT_MAX) {
      throw new HttpsError("resource-exhausted", QUESTION_GRADING_RATE_LIMIT_MESSAGE);
    }

    transaction.set(
      limitRef,
      {
        uid,
        subjectId,
        count: count + 1,
        windowStartedAt: withinWindow ? windowStartedAt : nowMs,
        updatedAt: nowMs,
      },
      { merge: true },
    );
  });
}

/**
 * Deelscores zijn nuttige feedback, maar bij meerkeuze is "optie 3 is fout
 * aangevinkt" letterlijk de sleutel: een leerling die niets aanvinkt zou uit de
 * deelstatus kunnen aflezen welke opties correct zijn. Daarom bij die typen
 * alleen deelstatus als het geheel al goed is - dan valt er niets te verklappen.
 */
function buildSafeGradeParts(grade = {}, questionType = "") {
  if (ANSWER_KEY_REVEALING_PART_TYPES.has(questionType) && grade.isCorrect !== true) {
    return { parts: [], partsRedacted: true };
  }

  const parts = Array.isArray(grade.parts) ? grade.parts : [];
  return {
    parts: parts.map((part, index) => ({
      id: String(part?.id || `part-${index + 1}`),
      label: String(part?.label || `Onderdeel ${index + 1}`),
      isCorrect: part?.isCorrect === true,
    })),
    partsRedacted: false,
  };
}

/**
 * De uitleg bij het gegeven antwoord, klaar om over de lijn te gaan.
 *
 * Dit is de ENIGE plek waar `explanation` en `misconception` de leerling
 * bereiken, en dan pas NA het beoordelen. De leerlingsnapshot draagt ze niet
 * (publicQuestionView / publicContentBlockView strippen ze), dus vóór het
 * antwoorden staat er niets over de sleutel in de browser.
 *
 * `chosen` gaat over de optie die de leerling zelf aanwees en verklapt niets.
 * `correct` beschrijft het juiste antwoord en gaat alleen mee bij een fout
 * antwoord; de leerlingroute toont hem pas als de vraag klaar is
 * (selectAnswerExplanation in closedQuestionGradingRoute.js).
 *
 * Bij een vraag zonder oordeel (docent kijkt na) gaat er niets mee: er valt
 * dan ook niets uit te leggen.
 */
function buildSafeExplanationFeedback(explanation = null) {
  const take = (value) =>
    (Array.isArray(value) ? value : [])
      .map((note) => String(note ?? "").trim())
      .filter(Boolean)
      .slice(0, EXPLANATION_NOTE_MAX_COUNT)
      .map((note) => note.slice(0, EXPLANATION_NOTE_MAX_CHARS));

  return {
    chosen: take(explanation?.chosen),
    correct: take(explanation?.correct),
  };
}

/**
 * Mag deze aanroeper dit toets- of quizitem laten nakijken?
 *
 * Zelfde grenzen als bij een losse vraag: gepubliceerd, niet gearchiveerd, en
 * toegewezen aan de klas of aan deze leerling. Een toetsitem staat niet in de
 * collectie `vraag` maar in het contentBlock zelf, dus de controle hangt hier
 * volledig aan het blok.
 */
async function assertAssessmentBlockAssignedToCaller({ db, uid, callerData = {}, block = {}, blockId = "" }) {
  const role = String(callerData.role || "").trim().toLowerCase();
  if (role === "admin" || role === "supervisor" || isConfiguredAdminEmail(callerData.email)) {
    return { role: role || "admin", rateLimited: false };
  }

  if (block.status !== "published" || block.isArchived === true) {
    throw new HttpsError("failed-precondition", "Dit lesblok staat niet klaar.");
  }

  const paragraafId = String(block.paragraafId || "").trim();
  const klasId = String(callerData.klasId || "").trim();
  if (!klasId) {
    throw new HttpsError("failed-precondition", "Je bent nog niet aan een klas gekoppeld.");
  }

  const klas = await getRequiredDoc(db.doc(`klassen/${klasId}`), "Klas");
  if (!isParagraphAssignedToStudent(klas.data, uid, paragraafId)) {
    throw new HttpsError("permission-denied", "Dit lesblok hoort niet bij jouw lesstof.");
  }

  if (!isContentBlockAssignedToStudent(klas.data, uid, paragraafId, blockId)) {
    throw new HttpsError("permission-denied", "Dit lesblok hoort niet bij jouw lesstof.");
  }

  return { role: role || "student", rateLimited: true };
}

/**
 * Nakijken van een vraag BINNEN een toets of quiz.
 *
 * Bewust geen tweede functie naast gradeClosedQuestion: het is dezelfde
 * beveiligingsbelofte (nooit de sleutel terug, deelstatussen bij meerkeuze pas
 * als het geheel goed is, een rem tegen aftasten) en dezelfde beoordelingslaag.
 * Alleen de vindplaats van de vraag verschilt.
 */
async function gradeAssessmentItemCore({
  auth,
  data,
  db,
  loadGradingLayer,
  nowMs,
  callerData,
}) {
  const blockId = requireString(data?.blockId, "blockId");
  const itemId = requireString(data?.itemId, "itemId");
  const answers = normalizeSubmittedAnswers(data?.answers);

  const blockDoc = await getRequiredDoc(db.doc(`contentBlocks/${blockId}`), "Lesblok");
  const block = { ...blockDoc.data, id: blockDoc.id };

  if (block.type !== "quiz" && block.type !== "toets") {
    throw new HttpsError("invalid-argument", "Dit lesblok is geen toets of quiz.");
  }

  const access = await assertAssessmentBlockAssignedToCaller({
    db,
    uid: auth.uid,
    callerData,
    block,
    blockId,
  });

  if (access.rateLimited) {
    await assertQuestionGradingRateLimit({
      db,
      uid: auth.uid,
      subjectId: `${blockId}__${itemId}`,
      nowMs,
    });
  }

  const items = Array.isArray(block.content?.items) ? block.content.items : [];
  const item = items.find((entry) => String(entry?.id || "") === itemId);

  // Bewust geen "not-found": de client zet daarop de hele serverroute uit voor
  // de rest van de sessie. Een onbekend item is een verkeerde aanvraag, geen
  // ontbrekende functie.
  if (!item) {
    throw new HttpsError("invalid-argument", "Deze toetsvraag bestaat niet in dit lesblok.");
  }

  const {
    gradeAssessmentItemAnswer,
    getAssessmentGradingType,
    buildAssessmentItemExplanationFeedback,
  } = await loadGradingLayer();
  const questionType = getAssessmentGradingType(item);
  const grade = gradeAssessmentItemAnswer({ item, answer: answers.itemAnswer });
  const canGrade = grade?.canGrade === true;
  const isCorrect = canGrade && grade.isCorrect === true;

  // Bewijs voor de tokenbeloning: alleen de server kan hier schrijven
  // (tokenBewijs staat niet in firestore.rules, dus de app mag er niet bij).
  if (isCorrect && access.role === "student") {
    try {
      await db.doc(`tokenBewijs/${auth.uid}_${blockId}`).set({
        userId: auth.uid,
        blockId,
        correcteItems: FieldValue.arrayUnion(itemId),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.warn("tokenBewijs niet opgeslagen:", error?.message || error);
    }
  }

  return {
    success: true,
    blockId,
    itemId,
    questionType,
    canGrade,
    isCorrect,
    reason: String(grade?.reason || ""),
    ...buildSafeGradeParts(grade || {}, questionType),
    explanation: buildSafeExplanationFeedback(
      canGrade
        ? buildAssessmentItemExplanationFeedback({ item, answer: answers.itemAnswer, isCorrect })
        : null,
    ),
    source: "server",
  };
}

async function gradeClosedQuestionCore({
  auth,
  data,
  db,
  loadGradingLayer = loadSharedGradingLayer,
  nowMs = Date.now(),
}) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om je antwoord te laten nakijken.");
  }

  // Een toetsitem heeft geen vraagId: het woont in het contentBlock.
  if (data?.itemId) {
    const itemCaller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Gebruiker");
    return gradeAssessmentItemCore({
      auth,
      data,
      db,
      loadGradingLayer,
      nowMs,
      callerData: itemCaller.data,
    });
  }

  const vraagId = requireString(data?.vraagId, "vraagId");
  const blockId = String(data?.blockId || "").trim();
  const answers = normalizeSubmittedAnswers(data?.answers);

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Gebruiker");
  const vraagDoc = await getRequiredDoc(db.doc(`vraag/${vraagId}`), "Vraag");
  const vraag = { ...vraagDoc.data, id: vraagDoc.id };

  const access = await assertQuestionAssignedToCaller({
    db,
    uid: auth.uid,
    callerData: caller.data,
    vraag,
    blockId,
  });

  if (access.rateLimited) {
    await assertQuestionGradingRateLimit({ db, uid: auth.uid, subjectId: vraagId, nowMs });
  }

  const questionType = String(vraag.vraagtype || vraag.antwoord?.type || "open").trim();

  // Open vragen blijven bij assessOpenAnswer; hier wordt niets stilzwijgend fout.
  if (!CLOSED_QUESTION_TYPES.has(questionType)) {
    return {
      success: true,
      vraagId,
      questionType,
      canGrade: false,
      isCorrect: false,
      reason: "needs-human",
      parts: [],
      partsRedacted: false,
      explanation: buildSafeExplanationFeedback(null),
      source: "server",
    };
  }

  const { gradeQuestionAnswer, buildQuestionPreviewModel, buildQuestionExplanationFeedback } =
    await loadGradingLayer();
  const grade = gradeQuestionAnswer({
    vraag,
    preview: buildQuestionPreviewModel(vraag),
    answers,
  });

  const canGrade = grade?.canGrade === true;
  const isCorrect = canGrade && grade.isCorrect === true;

  return {
    success: true,
    vraagId,
    questionType,
    canGrade,
    isCorrect,
    reason: String(grade?.reason || ""),
    ...buildSafeGradeParts(grade || {}, questionType),
    explanation: buildSafeExplanationFeedback(
      canGrade ? buildQuestionExplanationFeedback({ vraag, answers, isCorrect }) : null,
    ),
    source: "server",
  };
}

function shouldPreserveUserDuringStudentReset(user = {}) {
  const role = String(user.role || "").trim().toLowerCase();
  const email = String(user.email || "").trim().toLowerCase();

  return role === "admin" || preservedStudentResetEmails.has(email);
}

function buildImportedStudentId(importId, cropId) {
  return `photo_import_${importId}_${cropId}`
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 140);
}

function normalizeStudentNumber(value = "") {
  return String(value || "").replace(/\D+/g, "").trim();
}

function buildStudentEmail(studentNumber = "") {
  const normalized = normalizeStudentNumber(studentNumber);
  return normalized ? `${normalized}@${STUDENT_EMAIL_DOMAIN}` : "";
}

function buildStudentIdFromNumber(studentNumber = "") {
  const normalized = normalizeStudentNumber(studentNumber);
  return normalized ? `student_${normalized}` : "";
}

function normalizeDutchLastName(value = "") {
  const raw = String(value || "").trim().replace(/\s+/g, " ");
  const commaParts = raw.split(",").map((part) => part.trim()).filter(Boolean);
  if (commaParts.length < 2) return raw;

  return `${commaParts.slice(1).join(" ")} ${commaParts[0]}`.trim().replace(/\s+/g, " ");
}

function normalizeImportStudentRow(row = {}) {
  const firstName = String(row.firstName || "").trim();
  const lastName = normalizeDutchLastName(row.lastName || "");
  const studentNumber = normalizeStudentNumber(row.studentNumber);
  const email = String(row.email || buildStudentEmail(studentNumber)).trim().toLowerCase();
  const displayName = [firstName, lastName].filter(Boolean).join(" ");
  const decision = row.decision || "create";
  const matchedUserId = String(row.matchedUserId || "").trim();

  const errors = [];
  if (!firstName) errors.push("missing_first_name");
  if (!lastName) errors.push("missing_last_name");
  if (!studentNumber) errors.push("missing_student_number");
  if (!email) errors.push("missing_email");
  if (!["create", "update", "skip"].includes(decision)) errors.push("invalid_decision");
  if (decision === "update" && !matchedUserId) errors.push("missing_matched_student");

  return {
    row: {
      ...row,
      firstName,
      lastName,
      studentNumber,
      email,
      displayName,
      decision,
      matchedUserId,
    },
    errors,
  };
}

function getStudentImportUid(row = {}) {
  if (row.decision === "update") return row.matchedUserId;
  return row.uid || buildStudentIdFromNumber(row.studentNumber);
}

function requirePassword(value = DEFAULT_STUDENT_PASSWORD) {
  const password = String(value || "").trim() || DEFAULT_STUDENT_PASSWORD;
  if (password.length < 6) {
    throw new HttpsError("invalid-argument", "Wachtwoord moet minimaal 6 tekens bevatten.");
  }
  return password;
}

async function upsertAuthUser(authAdmin, { uid, email, password, displayName }) {
  try {
    await authAdmin.getUser(uid);
    return authAdmin.updateUser(uid, {
      email,
      password,
      displayName,
      disabled: false,
      emailVerified: false,
    });
  } catch (error) {
    if (error?.code !== "auth/user-not-found") {
      throw error;
    }

    return authAdmin.createUser({
      uid,
      email,
      password,
      displayName,
      disabled: false,
      emailVerified: false,
    });
  }
}

async function importStudentNumberAccountsCore({ auth, data, db, authAdmin, now }) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om leerlingnummers te importeren.");
  }

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Caller");
  assertAdminRole(caller.data);

  const klasId = requireString(data?.klasId, "klasId");
  const rows = Array.isArray(data?.rows) ? data.rows : [];
  const timestamp = getServerTimestamp(now);
  const invalidRows = [];
  let updatedCount = 0;
  let createdCount = 0;
  let skippedCount = 0;

  for (const sourceRow of rows) {
    if (sourceRow?.decision === "skip") {
      skippedCount += 1;
      continue;
    }

    const validation = normalizeImportStudentRow(sourceRow);
    if (validation.errors.length) {
      invalidRows.push({ row: sourceRow, errors: validation.errors });
      continue;
    }

    const row = validation.row;
    const uid = getStudentImportUid(row);
    if (!uid) {
      invalidRows.push({ row: sourceRow, errors: ["missing_uid"] });
      continue;
    }

    const password = requirePassword(data?.defaultPassword || DEFAULT_STUDENT_PASSWORD);
    await upsertAuthUser(authAdmin, {
      uid,
      email: row.email,
      password,
      displayName: row.displayName,
    });

    const studentRef = db.doc(`users/${uid}`);
    const existingDoc = await studentRef.get();
    const isCreate = !existingDoc.exists || row.decision === "create";

    await studentRef.set({
      uid,
      email: row.email,
      displayName: row.displayName,
      firstName: row.firstName,
      lastName: row.lastName,
      studentNumber: row.studentNumber,
      leerlingnummer: row.studentNumber,
      role: "student",
      klasId,
      needsNameSetup: false,
      isImportedStudent: true,
      importedBy: auth.uid,
      mustChangePassword: true,
      passwordStatus: "default",
      defaultPasswordSetAt: timestamp,
      lastPasswordResetBy: auth.uid,
      updatedAt: timestamp,
      ...(isCreate ? { createdAt: timestamp } : {}),
    }, { merge: true });

    if (row.decision === "update") updatedCount += 1;
    if (row.decision === "create") createdCount += 1;
  }

  if (invalidRows.length) {
    const first = invalidRows[0];
    throw new HttpsError(
      "invalid-argument",
      `CSV bevat ${invalidRows.length} onvolledige rij(en). Controleer rij ${first.row?.sourceRow || first.row?.id || "onbekend"}.`,
    );
  }

  return {
    success: true,
    updatedCount,
    createdCount,
    skippedCount,
    total: rows.length,
  };
}

// Verwijdert een gearchiveerde leerling definitief: voortgang, het
// users-document en het Auth-account. Alleen voor gearchiveerde leerlingen,
// zodat een tikfout in het beheer nooit direct een actieve leerling wist.
async function deleteStudentAccountCore({ auth, data, db, authAdmin }) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om een leerling te verwijderen.");
  }

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Caller");
  const callerRole = caller.data?.role;
  if (callerRole !== "admin" && callerRole !== "supervisor" && !isConfiguredAdminEmail(caller.data?.email)) {
    throw new HttpsError("permission-denied", "Alleen admins en supervisors mogen leerlingen verwijderen.");
  }

  const studentUid = requireString(data?.studentUid, "studentUid");
  const studentDoc = await getRequiredDoc(db.doc(`users/${studentUid}`), "Leerling");

  if (studentDoc.data.role !== "student") {
    throw new HttpsError("failed-precondition", "Deze gebruiker is geen leerling.");
  }
  if (studentDoc.data.isArchived !== true) {
    throw new HttpsError("failed-precondition", "Archiveer de leerling eerst; alleen gearchiveerde leerlingen kunnen definitief verwijderd worden.");
  }

  const deletedProgress = await deleteStudentProgress(db, [studentUid]);
  await studentDoc.ref.delete();

  let authDeleted = false;
  try {
    await authAdmin.deleteUser(studentUid);
    authDeleted = true;
  } catch (error) {
    if (error?.code !== "auth/user-not-found") {
      throw error;
    }
  }

  return { success: true, studentUid, deletedProgress, authDeleted };
}

async function resetStudentPasswordCore({ auth, data, db, authAdmin, now }) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om een leerlingwachtwoord te resetten.");
  }

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Caller");
  assertAdminRole(caller.data);

  const studentUid = requireString(data?.studentUid, "studentUid");
  const password = requirePassword(data?.password || DEFAULT_STUDENT_PASSWORD);
  const timestamp = getServerTimestamp(now);
  const studentDoc = await getRequiredDoc(db.doc(`users/${studentUid}`), "Leerling");

  if (studentDoc.data.role !== "student") {
    throw new HttpsError("failed-precondition", "Deze gebruiker is geen leerling.");
  }

  const email = requireString(studentDoc.data.email, "email");
  const displayName = studentDoc.data.displayName || [studentDoc.data.firstName, studentDoc.data.lastName].filter(Boolean).join(" ");
  await upsertAuthUser(authAdmin, {
    uid: studentUid,
    email,
    password,
    displayName,
  });

  await studentDoc.ref.update({
    mustChangePassword: true,
    passwordStatus: "reset",
    passwordResetAt: timestamp,
    lastPasswordResetBy: auth.uid,
    updatedAt: timestamp,
  });

  return {
    success: true,
    studentUid,
  };
}

async function syncAllStudentAuthAccountsCore({ auth, data, db, authAdmin, now }) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om leerlingaccounts naar Auth te synchroniseren.");
  }

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Caller");
  assertAdminRole(caller.data);

  const password = requirePassword(data?.password || DEFAULT_STUDENT_PASSWORD);
  const timestamp = getServerTimestamp(now);
  const studentSnapshot = await db.collection("users").where("role", "==", "student").get();
  let syncedCount = 0;
  let skippedCount = 0;

  for (const documentSnapshot of studentSnapshot.docs) {
    const student = documentSnapshot.data() || {};
    const email = String(student.email || "").trim().toLowerCase();

    if (!email) {
      skippedCount += 1;
      continue;
    }

    const displayName = student.displayName || [student.firstName, student.lastName].filter(Boolean).join(" ");
    await upsertAuthUser(authAdmin, {
      uid: documentSnapshot.id,
      email,
      password,
      displayName,
    });

    await documentSnapshot.ref.update({
      uid: documentSnapshot.id,
      email,
      mustChangePassword: true,
      passwordStatus: "default",
      defaultPasswordSetAt: timestamp,
      lastPasswordResetBy: auth.uid,
      updatedAt: timestamp,
    });
    syncedCount += 1;
  }

  return {
    success: true,
    syncedCount,
    skippedCount,
    total: studentSnapshot.size,
  };
}

async function commitInChunks(db, operations) {
  for (let index = 0; index < operations.length; index += BATCH_LIMIT) {
    const chunk = operations.slice(index, index + BATCH_LIMIT);
    const batch = db.batch();

    chunk.forEach((operation) => {
      if (operation.type === "delete") {
        batch.delete(operation.ref);
      } else if (operation.type === "update") {
        batch.update(operation.ref, operation.data);
      }
    });

    await batch.commit();
  }
}

async function deleteQuerySnapshot(db, snapshot) {
  await commitInChunks(db, snapshot.docs.map((documentSnapshot) => ({
    type: "delete",
    ref: documentSnapshot.ref,
  })));

  return snapshot.size;
}

async function deleteStudentProgress(db, studentIds) {
  let deleted = 0;

  for (const studentId of studentIds) {
    const snapshot = await db.collection("voortgang").where("userId", "==", studentId).get();

    // Firestore verwijdert subcollecties NIET mee met het ouderdocument. Zonder
    // deze lus blijft de itemvoortgang van elke toets als wees achter: onzichtbaar
    // in de console, maar wel bewaarde leerlingdata.
    for (const progressDoc of snapshot.docs) {
      if (typeof progressDoc.ref?.collection !== "function") continue;
      const itemsSnapshot = await progressDoc.ref.collection("items").get();
      deleted += await deleteQuerySnapshot(db, itemsSnapshot);
    }

    deleted += await deleteQuerySnapshot(db, snapshot);
  }

  return deleted;
}

async function clearClassStudentOverrides(db, now) {
  const snapshot = await db.collection("klassen").get();
  await commitInChunks(db, snapshot.docs.map((documentSnapshot) => ({
    type: "update",
    ref: documentSnapshot.ref,
    data: {
      studentOverrides: {},
      updatedAt: getServerTimestamp(now),
    },
  })));

  return snapshot.size;
}

/**
 * Een beheerder laat een leerling één lesblok opnieuw maken: het blokrecord en
 * alle itemvoortgang (toets- en quizvragen, concepten, herkansing) gaan weg.
 *
 * Tokens blijven bewust staan: de claim in tokenAwardClaims blijft bestaan,
 * dus bij het opnieuw maken komen er geen tokens meer bij voor hetzelfde blok.
 * Bij een nulmetingblok gaat ook het startprofiel weg; dat wordt opnieuw
 * berekend zodra de leerling het deel weer afrondt.
 */
async function resetLeerlingBlokWerkCore({ auth, data = {}, db }) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om werk te resetten.");
  }

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Caller");
  assertAdminRole(caller.data);

  const leerlingUid = requireString(data.leerlingUid, "leerlingUid");
  const blockId = requireString(data.blockId, "blockId");

  const leerling = await getRequiredDoc(db.doc(`users/${leerlingUid}`), "Leerling");
  if (String(leerling.data.role || "").toLowerCase() !== "student") {
    throw new HttpsError("failed-precondition", "Alleen het werk van een leerling kan gereset worden.");
  }

  const blokRef = db.doc(`voortgang/${leerlingUid}_${blockId}`);
  const blokSnapshot = await blokRef.get();
  const itemsSnapshot = await blokRef.collection("items").get();

  const verwijderdeItems = await deleteQuerySnapshot(db, itemsSnapshot);
  let blokRecordVerwijderd = false;
  if (blokSnapshot.exists) {
    await commitInChunks(db, [{ type: "delete", ref: blokRef }]);
    blokRecordVerwijderd = true;
  }

  // Nulmeting: het startprofiel is een afgeleide van dit werk en klopt niet meer.
  let profielVerwijderd = false;
  const blokDoc = await db.doc(`contentBlocks/${blockId}`).get();
  const isNulmeting = Boolean(blokDoc.exists && blokDoc.data()?.content?.nulmeting?.deel);
  if (isNulmeting) {
    const profielRef = db.doc(`nulmetingProfielen/${leerlingUid}`);
    const profielSnapshot = await profielRef.get();
    if (profielSnapshot.exists) {
      await commitInChunks(db, [{ type: "delete", ref: profielRef }]);
      profielVerwijderd = true;
    }
  }

  return {
    success: true,
    leerlingUid,
    blockId,
    verwijderdeItems,
    blokRecordVerwijderd,
    profielVerwijderd,
  };
}

async function deleteAllStudentDataCore({ auth, db, now }) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om leerlingen te verwijderen.");
  }

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Caller");
  assertAdminRole(caller.data);

  const studentSnapshot = await db.collection("users").where("role", "==", "student").get();
  const deletableStudentDocs = studentSnapshot.docs.filter((documentSnapshot) =>
    !shouldPreserveUserDuringStudentReset(documentSnapshot.data() || {})
  );
  const studentIds = deletableStudentDocs.map((documentSnapshot) => documentSnapshot.id);
  const pendingStudentsSnapshot = await db.collection("pendingStudents").get();

  const deletedProgress = await deleteStudentProgress(db, studentIds);
  const deletedPendingStudents = await deleteQuerySnapshot(db, pendingStudentsSnapshot);
  await commitInChunks(db, deletableStudentDocs.map((documentSnapshot) => ({
    type: "delete",
    ref: documentSnapshot.ref,
  })));
  const cleanedClasses = await clearClassStudentOverrides(db, now);

  return {
    success: true,
    deletedStudents: deletableStudentDocs.length,
    deletedProgress,
    deletedPendingStudents,
    cleanedClasses,
    preservedEmails: [...preservedStudentResetEmails],
  };
}

function normalizeDecision(rawDecision) {
  const decision = rawDecision || "approve";
  const allowed = new Set(["approve", "pending_new", "reject"]);

  if (!allowed.has(decision)) {
    throw new HttpsError("invalid-argument", "decision moet approve, pending_new of reject zijn.");
  }

  return decision;
}

function assertImportCropPath(cropStoragePath, klasId, importId) {
  const expectedPrefix = `photo-imports/${klasId}/${importId}/crops/`;

  if (typeof cropStoragePath !== "string" || !cropStoragePath.startsWith(expectedPrefix)) {
    throw new HttpsError("failed-precondition", "Crop staat niet in het verwachte tijdelijke importpad.");
  }
}

async function copyCropToStudentPhoto({ bucket, cropStoragePath, klasId, uid }) {
  const sourceFile = bucket.file(cropStoragePath);
  const [sourceExists] = await sourceFile.exists();

  if (!sourceExists) {
    throw new HttpsError("not-found", "Tijdelijke crop is niet gevonden in Storage.");
  }

  const avatarPath = `student-photos/${klasId}/${uid}/avatar_256.webp`;
  const thumbPath = `student-photos/${klasId}/${uid}/thumb_96.webp`;

  // Beperking V1: de client maakt al een veilige WebP-crop. Zonder Sharp/Jimp
  // kunnen Functions nu niet betrouwbaar resizen; daarom kopieren we dezelfde
  // crop naar avatar en thumb totdat resize bewust als dependency wordt toegevoegd.
  await sourceFile.copy(bucket.file(avatarPath));
  await sourceFile.copy(bucket.file(thumbPath));

  return { avatarPath, thumbPath };
}

async function approveMatchedCrop({ auth, data, db, bucket, now }) {
  const importId = requireString(data.importId, "importId");
  const cropId = requireString(data.cropId, "cropId");
  const klasId = requireString(data.klasId, "klasId");
  const importRef = db.doc(`photoImports/${importId}`);
  const cropRef = importRef.collection("crops").doc(cropId);
  const timestamp = getServerTimestamp(now);
  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Caller");

  assertCanManageKlas(caller.data, klasId);

  const importDoc = await getRequiredDoc(importRef, "Import");
  if (importDoc.data.klasId !== klasId) {
    throw new HttpsError("failed-precondition", "Import hoort niet bij deze klas.");
  }

  const cropDoc = await getRequiredDoc(cropRef, "Crop");
  const matchedUserId = requireString(data.matchedUserId || cropDoc.data.matchedUserId, "matchedUserId");
  const studentDoc = await getRequiredDoc(db.doc(`users/${matchedUserId}`), "Gematchte leerling");

  if (studentDoc.data.role !== "student") {
    throw new HttpsError("failed-precondition", "Gematchte gebruiker is geen leerling.");
  }

  const allowKlasOverride = data.allowKlasOverride === true && caller.data.role === "admin";
  if (studentDoc.data.klasId !== klasId && !allowKlasOverride) {
    throw new HttpsError("failed-precondition", "Gematchte leerling zit niet in dezelfde klas.");
  }

  const cropStoragePath = requireString(cropDoc.data.cropStoragePath, "cropStoragePath");
  assertImportCropPath(cropStoragePath, klasId, importId);

  const { avatarPath, thumbPath } = await copyCropToStudentPhoto({
    bucket,
    cropStoragePath,
    klasId,
    uid: matchedUserId,
  });

  const photo = {
    storagePath: avatarPath,
    thumbStoragePath: thumbPath,
    status: "approved",
    sourceImportId: importId,
    cropId,
    approvedBy: auth.uid,
    approvedAt: timestamp,
    updatedAt: timestamp,
  };

  await studentDoc.ref.update({ photo });
  await cropRef.update({
    status: "approved",
    matchedUserId,
    approvedBy: auth.uid,
    approvedAt: timestamp,
    updatedAt: timestamp,
  });
  await importRef.update({
    approvedCount: FieldValue.increment(1),
    updatedAt: timestamp,
  });

  return {
    success: true,
    status: "approved",
    matchedUserId,
    photo,
  };
}

async function createStudentFromImportCrop({ auth, data, db, bucket, now }) {
  const importId = requireString(data.importId, "importId");
  const cropId = requireString(data.cropId, "cropId");
  const klasId = requireString(data.klasId, "klasId");
  const importRef = db.doc(`photoImports/${importId}`);
  const cropRef = importRef.collection("crops").doc(cropId);
  const timestamp = getServerTimestamp(now);
  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Caller");

  assertCanManageKlas(caller.data, klasId);

  const importDoc = await getRequiredDoc(importRef, "Import");
  if (importDoc.data.klasId !== klasId) {
    throw new HttpsError("failed-precondition", "Import hoort niet bij deze klas.");
  }

  const cropDoc = await getRequiredDoc(cropRef, "Crop");
  const cropStoragePath = requireString(cropDoc.data.cropStoragePath, "cropStoragePath");
  assertImportCropPath(cropStoragePath, klasId, importId);

  const displayNameProposed = data.displayNameProposed || cropDoc.data.proposedName || cropDoc.data.matchedDisplayName || "";
  const firstName = data.firstName || cropDoc.data.firstName || "";
  const lastName = data.lastName || cropDoc.data.lastName || "";
  const displayName = [firstName, lastName].map((part) => String(part || "").trim()).filter(Boolean).join(" ") ||
    String(displayNameProposed || "").trim();
  const studentId = buildImportedStudentId(importId, cropId);
  const studentRef = db.collection("users").doc(studentId);

  if (!displayName) {
    throw new HttpsError("invalid-argument", "Voornaam of achternaam is verplicht om een leerling aan te maken.");
  }

  const { avatarPath, thumbPath } = await copyCropToStudentPhoto({
    bucket,
    cropStoragePath,
    klasId,
    uid: studentId,
  });

  const photo = {
    storagePath: avatarPath,
    thumbStoragePath: thumbPath,
    status: "approved",
    sourceImportId: importId,
    cropId,
    approvedBy: auth.uid,
    approvedAt: timestamp,
    updatedAt: timestamp,
  };

  await studentRef.set({
    uid: studentId,
    email: "",
    displayName,
    firstName,
    lastName,
    role: "student",
    klasId,
    importId,
    cropId,
    photo,
    needsNameSetup: false,
    isImportedStudent: true,
    createdBy: auth.uid,
    createdAt: timestamp,
    updatedAt: timestamp,
  }, { merge: true });
  await cropRef.update({
    status: "approved",
    matchedUserId: studentId,
    matchedDisplayName: displayName,
    approvedBy: auth.uid,
    approvedAt: timestamp,
    updatedAt: timestamp,
  });
  await importRef.update({
    approvedCount: FieldValue.increment(1),
    updatedAt: timestamp,
  });

  return {
    success: true,
    status: "approved",
    createdUserId: studentId,
    matchedUserId: studentId,
    photo,
  };
}

async function rejectImportCrop({ auth, data, db, now }) {
  const importId = requireString(data.importId, "importId");
  const cropId = requireString(data.cropId, "cropId");
  const klasId = requireString(data.klasId, "klasId");
  const importRef = db.doc(`photoImports/${importId}`);
  const cropRef = importRef.collection("crops").doc(cropId);
  const timestamp = getServerTimestamp(now);
  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Caller");

  assertCanManageKlas(caller.data, klasId);

  const importDoc = await getRequiredDoc(importRef, "Import");
  if (importDoc.data.klasId !== klasId) {
    throw new HttpsError("failed-precondition", "Import hoort niet bij deze klas.");
  }

  await getRequiredDoc(cropRef, "Crop");
  await cropRef.update({
    status: "rejected",
    reviewNote: data.reviewNote || null,
    approvedBy: auth.uid,
    approvedAt: timestamp,
    updatedAt: timestamp,
  });
  await importRef.update({ updatedAt: timestamp });

  return {
    success: true,
    status: "rejected",
  };
}

async function approveStudentPhotoImportCropCore({ auth, data, db, bucket, now }) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om leerlingfoto-imports goed te keuren.");
  }

  const decision = normalizeDecision(data?.decision);

  if (decision === "pending_new") {
    return createStudentFromImportCrop({ auth, data, db, bucket, now });
  }

  if (decision === "reject") {
    return rejectImportCrop({ auth, data, db, now });
  }

  return approveMatchedCrop({ auth, data, db, bucket, now });
}

async function getCallerDoc({ auth, db, label = "Caller" }) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om deze actie uit te voeren.");
  }

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), label);
  if (isConfiguredAdminEmail(auth.token?.email || caller.data.email)) {
    return {
      ...caller,
      data: {
        ...caller.data,
        role: "admin",
      },
    };
  }

  return caller;
}

let beloningLayerPromise = null;

function loadBeloningLayer() {
  if (!beloningLayerPromise) {
    beloningLayerPromise = import("./shared/beloning.js");
  }
  return beloningLayerPromise;
}

async function getLegacyContentClaim(db, uid, sourceKind, sourceId, huidigeClaimId) {
  const snapshot = await db.collection("tokenAwardClaims").where("studentUid", "==", uid).get();
  let gevonden = null;
  for (const doc of snapshot.docs) {
    if (doc.id === huidigeClaimId) continue;
    const data = doc.data() || {};
    if (data.source?.kind !== sourceKind || data.source?.id !== sourceId) continue;
    // Claims van vóór fase 1 werden alleen bij een volledig goed resultaat gemaakt.
    const tokens = normalizeNonNegativeInteger(data.totalAwarded ?? data.amount, 0);
    const bestePercentage = Number.isFinite(Number(data.bestePercentage)) ? Number(data.bestePercentage) : 100;
    if (!gevonden || tokens > gevonden.tokens) {
      gevonden = { tokens, bestePercentage, xp: normalizeNonNegativeInteger(data.xp, 0) };
    }
  }
  return gevonden;
}

function tijdstipNaarDatum(waarde) {
  if (!waarde) return null;
  if (typeof waarde.toDate === "function") return waarde.toDate();
  if (waarde instanceof Date) return waarde;
  if (typeof waarde === "string" || typeof waarde === "number") {
    const datum = new Date(waarde);
    return Number.isNaN(datum.getTime()) ? null : datum;
  }
  const seconden = waarde._seconds ?? waarde.seconds;
  return Number.isFinite(seconden) ? new Date(seconden * 1000) : null;
}

const isDvHoofdstuk = (hoofdstukId = "") => /(^|-)dv(-|$)/.test(String(hoofdstukId));

// De weken waarin de klas een DV-hoofdstuk kreeg (voor de weekreeks).
function dvDoelWeken(klasData = {}, regels) {
  const vrijgaven = klasData?.hoofdstukVrijgaven || {};
  return Object.entries(vrijgaven)
    .filter(([hoofdstukId]) => isDvHoofdstuk(hoofdstukId))
    .map(([, tijdstip]) => tijdstipNaarDatum(tijdstip))
    .filter(Boolean)
    .map((datum) => regels.isoWeekSleutel(datum));
}

// Is dit blok deel van het DV-hoofdstuk van deze week, en hoeveel is er af?
async function bepaalDvWeekdoel({ db, uid, klasData, hoofdstukId, weekSleutel, regels }) {
  if (!klasData || !hoofdstukId || !isDvHoofdstuk(hoofdstukId)) return null;
  const vrijgave = tijdstipNaarDatum(klasData.hoofdstukVrijgaven?.[hoofdstukId]);
  if (!vrijgave || regels.isoWeekSleutel(vrijgave) !== weekSleutel) return null;

  const snapshot = await db.collection("publicContentBlocks").where("hoofdstukId", "==", hoofdstukId).get();
  const blokken = snapshot.docs
    .map((doc) => ({ id: doc.id, ...(doc.data() || {}) }))
    .filter((blok) =>
      blok.status === "published" &&
      blok.isArchived !== true &&
      isParagraphAssignedToStudent(klasData, uid, blok.paragraafId) &&
      isContentBlockAssignedToStudent(klasData, uid, blok.paragraafId, blok.id));
  if (!blokken.length) return null;

  const voortgang = await Promise.all(blokken.map((blok) => db.doc(`voortgang/${uid}_${blok.id}`).get()));
  const gedaan = voortgang.filter((doc) => doc.exists && doc.data()?.completed === true).length;
  return { hoofdstukId, gedaan, totaal: blokken.length, compleet: gedaan >= blokken.length };
}

function vandaagSleutel(datum = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam" }).format(datum);
}

async function awardTokensForActivityCore({ auth, data = {}, db, now = FieldValue.serverTimestamp, nuDatum = new Date() }) {
  const caller = await getCallerDoc({ auth, db, label: "Leerling" });
  if (caller.data.role !== "student") {
    throw new HttpsError("permission-denied", "Alleen leerlingen kunnen tokens verdienen.");
  }

  const sourceKind = String(data.sourceKind || "").trim();
  const sourceId = requireString(data.sourceId, "sourceId");
  if (!TOKEN_SOURCE_KINDS.has(sourceKind)) {
    throw new HttpsError("invalid-argument", "Onbekende tokenbron.");
  }

  const huidigSaldo = async () => {
    const accountSnapshot = await db.doc(`tokenAccounts/${auth.uid}`).get();
    return normalizeTokenAccount(accountSnapshot.exists ? accountSnapshot.data() : {}).balance;
  };
  const niets = async (reason) => ({ awarded: false, amount: 0, balance: await huidigSaldo(), reason });

  const result = data.result || {};
  if (result.completed !== true) return niets("not-completed");

  const regels = await loadBeloningLayer();

  // De versie komt nooit meer van de app (zie getContentBlockVersion).
  let sourceVersion = "";
  let sourceTitle = String(data.sourceTitle || "").trim();
  let gameRule = null;
  let bewijs = null;
  let vak = "overig";
  let blokType = "";
  let blokTokens = 0;
  let percentage = 0;

  if (sourceKind === "contentBlock" || sourceKind === "question") {
    const contentPath = sourceKind === "contentBlock" ? `publicContentBlocks/${sourceId}` : `publicQuestions/${sourceId}`;
    const contentDoc = await getRequiredDoc(db.doc(contentPath), sourceKind === "contentBlock" ? "Lesblok" : "Vraag");

    // Alleen lesstof die echt aan deze leerling is toegewezen levert iets op.
    try {
      if (sourceKind === "contentBlock") {
        await assertAssessmentBlockAssignedToCaller({
          db, uid: auth.uid, callerData: caller.data, block: contentDoc.data, blockId: sourceId,
        });
      } else {
        await assertQuestionAssignedToCaller({
          db, uid: auth.uid, callerData: caller.data, vraag: contentDoc.data, blockId: String(data.blockId || "").trim(),
        });
      }
    } catch (error) {
      if (!(error instanceof HttpsError)) throw error;
      return niets("not-assigned");
    }

    sourceVersion = getContentBlockVersion(contentDoc.data);
    sourceTitle = sourceTitle || contentDoc.data.title || contentDoc.data.content?.title || "";
    blokType = String(contentDoc.data.type || (sourceKind === "question" ? "question" : ""));
    blokTokens = getAwardAmountForContentBlock(contentDoc.data);
    vak = regels.vakSleutel({ vakId: contentDoc.data.vakId });
    percentage = regels.percentageVanResultaat(result);

    if (sourceKind === "contentBlock" && (blokType === "quiz" || blokType === "toets")) {
      bewijs = await getTokenBewijs(db, auth.uid, contentDoc.data, sourceId);
      if (TOKEN_BEWIJS_AFDWINGEN && bewijs) {
        percentage = Math.round((bewijs.aantalCorrect / Math.max(1, bewijs.aantalItems)) * 100);
      }
    }
  } else if (sourceKind === "game") {
    const isGehaald = result.isCorrect === true || result.passed === true;
    if (!isGehaald) return niets("not-correct");
    sourceVersion = GAME_CLAIM_VERSION;
    gameRule = await getGameRewardRule(db, sourceId);
    // Alleen bekende spellen (met een tokenregel) leveren iets op; anders kon
    // een verzonnen spel-id eindeloos XP opleveren.
    if (!gameRule) return niets("no-token-value");
    let vakId = "";
    const blockId = String(data.blockId || "").trim();
    if (blockId) {
      const blok = await db.doc(`publicContentBlocks/${blockId}`).get();
      vakId = blok.exists ? String(blok.data()?.vakId || "") : "";
    }
    vak = regels.vakSleutel({ vakId, gameId: sourceId });
  }

  const claimId = [
    cleanIdPart(auth.uid),
    cleanIdPart(sourceKind),
    cleanIdPart(sourceId),
    cleanIdPart(sourceVersion),
  ].join("_");
  const timestamp = getServerTimestamp(now);
  const weekSleutel = regels.isoWeekSleutel(nuDatum);
  const dag = vandaagSleutel(nuDatum);
  const accountRef = db.doc(`tokenAccounts/${auth.uid}`);
  const claimRef = db.doc(`tokenAwardClaims/${claimId}`);
  const weekRef = db.doc(`leerlingWeek/${auth.uid}_${vak}_${weekSleutel}`);
  const voortgangRef = db.doc(`leerlingVoortgang/${auth.uid}`);
  const niveauRef = db.doc(`leerlingNiveau/${auth.uid}`);

  const source = {
    kind: sourceKind,
    id: sourceId,
    version: sourceVersion,
    title: sourceTitle,
    paragraafId: String(data.paragraafId || "").trim(),
    blockId: String(data.blockId || "").trim(),
    gameId: String(data.gameId || (sourceKind === "game" ? sourceId : "")).trim(),
    vak,
    ...(bewijs ? { bewijs } : {}),
  };

  // DV-weekdoel: het hoofdstuk dat de klas deze week kreeg (deel B).
  let klasData = null;
  let weekdoel = null;
  if (vak === "dv") {
    const klasId = String(caller.data.klasId || "").trim();
    if (klasId) {
      const klas = await db.doc(`klassen/${klasId}`).get();
      klasData = klas.exists ? (klas.data() || {}) : null;
    }
    if (sourceKind === "contentBlock") {
      const blok = await db.doc(`publicContentBlocks/${sourceId}`).get();
      weekdoel = await bepaalDvWeekdoel({
        db, uid: auth.uid, klasData, hoofdstukId: String(blok.data()?.hoofdstukId || ""), weekSleutel, regels,
      });
    }
  }

  // Claims van vóór 23 sep 2026 stonden onder een andere sleutel (andere versie).
  const legacyGame = sourceKind === "game"
    ? await getLegacyClaimTotals(db, auth.uid, sourceKind, sourceId, claimId)
    : null;
  const legacyContent = sourceKind === "game"
    ? null
    : await getLegacyContentClaim(db, auth.uid, sourceKind, sourceId, claimId);

  return runDbTransaction(db, async (transaction) => {
    const [accountSnapshot, claimSnapshot, weekSnapshot, voortgangSnapshot] = await Promise.all([
      transaction.get(accountRef),
      transaction.get(claimRef),
      transaction.get(weekRef),
      transaction.get(voortgangRef),
    ]);
    const account = normalizeTokenAccount(accountSnapshot.exists ? accountSnapshot.data() : {});
    const claim = claimSnapshot.exists ? (claimSnapshot.data() || {}) : null;
    const week = weekSnapshot.exists ? (weekSnapshot.data() || {}) : {};
    const voortgang = voortgangSnapshot.exists ? (voortgangSnapshot.data() || {}) : {};

    // 1. Wat levert deze activiteit op, vóór het weekplafond?
    let xp = 0;
    let tokensVoorPlafond = 0;
    let ster = false;
    let eersteKeerHonderd = false;
    let claimPatch = {};
    let reden = "";

    if (sourceKind === "game") {
      const eerder = claim || (legacyGame.plays > 0 ? { plays: legacyGame.plays, totalAwarded: legacyGame.totalAwarded } : null);
      const basis = computeGameAwardAmount(gameRule, result);
      if (!eerder) {
        tokensVoorPlafond = basis;
        xp = regels.XP_SPEL;
        claimPatch = { plays: 1, totalAwarded: basis };
      } else {
        const decay = gameRule?.replayDecay;
        const plays = Math.max(1, normalizeNonNegativeInteger(eerder.plays, 1));
        const totalAwarded = normalizeNonNegativeInteger(eerder.totalAwarded ?? eerder.amount, 0);
        if (!decay) return { awarded: false, amount: 0, balance: account.balance, reason: "already-awarded" };
        if (gameRule.maxPlays > 0 && plays >= gameRule.maxPlays) {
          return { awarded: false, amount: 0, balance: account.balance, reason: "play-limit" };
        }
        const vervallen = Math.round(basis * Math.pow(decay, plays));
        tokensVoorPlafond = Math.max(0, Math.min(vervallen, (gameRule?.max || 0) - totalAwarded));
        if (tokensVoorPlafond <= 0) return { awarded: false, amount: 0, balance: account.balance, reason: "replay-limit" };
        xp = regels.XP_SPEL;
        claimPatch = { plays: plays + 1, totalAwarded: totalAwarded + tokensVoorPlafond };
      }
      reden = "spel uitgespeeld";
    } else {
      const eerder = claim
        ? {
          bestePercentage: Number.isFinite(Number(claim.bestePercentage)) ? Number(claim.bestePercentage) : 100,
          tokens: normalizeNonNegativeInteger(claim.totalAwarded ?? claim.amount, 0),
          xp: normalizeNonNegativeInteger(claim.xp, 0),
        }
        : legacyContent;
      const beloning = regels.beloningVoorBlok({ blokType, blokTokens, percentage, eerder });
      const weekdoelNuGehaald = Boolean(weekdoel?.compleet && !week.weekdoel?.gehaald);
      if (beloning.xp <= 0 && beloning.tokens <= 0 && !weekdoelNuGehaald) {
        return { awarded: false, amount: 0, balance: account.balance, reason: "already-awarded" };
      }
      xp = beloning.xp;
      tokensVoorPlafond = beloning.tokens;
      ster = beloning.ster;
      eersteKeerHonderd = beloning.eersteKeerHonderd;
      claimPatch = {
        bestePercentage: Math.max(percentage, eerder?.bestePercentage ?? 0),
        totalAwarded: (eerder?.tokens || 0) + beloning.tokens,
        xp: (eerder?.xp || 0) + beloning.xp,
        plays: normalizeNonNegativeInteger(claim?.plays, 0) + 1,
      };
      reden = regels.redenVoorPercentage(percentage);
    }

    // 2. Weekplafond per vak (spellen tellen mee).
    const alDezeWeek = normalizeNonNegativeInteger(week.tokens, 0);
    const tokens = regels.binnenWeekplafond(tokensVoorPlafond, alDezeWeek);
    const plafondBereikt = tokens < tokensVoorPlafond;

    // 2b. DV: huiswerkbonus (tweede dag in de week, binnen het plafond),
    // weekdoel, weekkist en weekreeks (buiten het plafond).
    const dagenVoor = Array.isArray(week.dagen) ? week.dagen : [];
    const dagenNa = dagenVoor.includes(dag) ? dagenVoor : [...dagenVoor, dag];
    let huiswerkTokens = 0;
    let kistTokens = 0;
    let mijlpaalTokens = 0;
    let reeks = null;
    let weekdoelStand = week.weekdoel || null;
    if (vak === "dv") {
      if (dagenNa.length >= 2 && !week.huiswerkBonus) {
        huiswerkTokens = regels.binnenWeekplafond(regels.HUISWERK_BONUS_TOKENS, alDezeWeek + tokens);
      }
      if (weekdoel) {
        const alGehaald = week.weekdoel?.gehaald === true;
        weekdoelStand = {
          hoofdstukId: weekdoel.hoofdstukId,
          gedaan: weekdoel.gedaan,
          totaal: weekdoel.totaal,
          gehaald: alGehaald || weekdoel.compleet,
        };
        if (weekdoel.compleet && !alGehaald) {
          reeks = regels.volgendeWeekreeks({
            reeks: voortgang.dvReeks || null,
            week: weekSleutel,
            doelWeken: dvDoelWeken(klasData, regels),
          });
          kistTokens = regels.weekkistTokens({ uid: auth.uid, week: weekSleutel, comeback: reeks.comeback });
          mijlpaalTokens = reeks.mijlpaal?.tokens || 0;
          weekdoelStand.kistTokens = kistTokens;
        }
      }
    }

    // 3. XP en niveau.
    const xpVoor = normalizeNonNegativeInteger(voortgang.xp, 0);
    const xpNa = xpVoor + xp;
    const niveauVoor = regels.niveauVoorXp(xpVoor).niveau;
    const niveauNa = regels.niveauVoorXp(xpNa);
    const niveausErbij = Math.max(0, niveauNa.niveau - niveauVoor);
    const niveauTokens = niveausErbij * regels.NIVEAU_BELONING_TOKENS;

    const totaalTokens = tokens + niveauTokens + huiswerkTokens + kistTokens + mijlpaalTokens;
    const nextAccount = totaalTokens > 0
      ? buildBalancePatch(account, totaalTokens, TOKEN_TRANSACTION_TYPES.EARN, timestamp)
      : account;

    // 4. Schrijven.
    const betaling = normalizeNonNegativeInteger(claim?.betalingen, 0) + 1;
    if (tokens > 0) {
      const txRef = getTransactionRef(db, betaling === 1 ? `earn_${claimId}` : `earn_${claimId}_u${betaling}`);
      transaction.set(txRef, {
        studentUid: auth.uid,
        type: TOKEN_TRANSACTION_TYPES.EARN,
        amount: tokens,
        source,
        reason: betaling === 1 ? "activity-correct" : "activity-improved",
        detail: { percentage, reden, plafondBereikt },
        createdBy: auth.uid,
        createdAt: timestamp,
        balanceAfter: account.balance + tokens,
      });
    }
    if (niveauTokens > 0) {
      transaction.set(getTransactionRef(db, `earn_niveau_${auth.uid}_${niveauNa.niveau}`), {
        studentUid: auth.uid,
        type: TOKEN_TRANSACTION_TYPES.EARN,
        amount: niveauTokens,
        source: { kind: "niveau", id: String(niveauNa.niveau), title: `Niveau ${niveauNa.niveau}` },
        reason: "level-up",
        createdBy: auth.uid,
        createdAt: timestamp,
        balanceAfter: nextAccount.balance,
      });
    }
    const extraRegels = [
      [huiswerkTokens, `earn_huiswerk_${auth.uid}_${weekSleutel}`, "homework-bonus", "Huiswerkbonus"],
      [kistTokens, `earn_weekkist_${auth.uid}_${weekSleutel}`, "weekly-chest", "Weekkist"],
      [mijlpaalTokens, `earn_reeks_${auth.uid}_${weekSleutel}`, "streak-milestone", `Weekreeks ${reeks?.aantal || ""}`.trim()],
    ];
    for (const [bedrag, id, reden2, titel] of extraRegels) {
      if (bedrag <= 0) continue;
      transaction.set(getTransactionRef(db, id), {
        studentUid: auth.uid,
        type: TOKEN_TRANSACTION_TYPES.EARN,
        amount: bedrag,
        source: { kind: "week", id: weekSleutel, title: titel, vak },
        reason: reden2,
        createdBy: auth.uid,
        createdAt: timestamp,
        balanceAfter: nextAccount.balance,
      });
    }
    if (totaalTokens > 0) transaction.set(accountRef, nextAccount, { merge: true });

    transaction.set(claimRef, {
      ...(claim ? {} : { studentUid: auth.uid, source, createdAt: timestamp }),
      ...claimPatch,
      amount: normalizeNonNegativeInteger(claim?.amount, 0) || tokens,
      betalingen: betaling,
      updatedAt: timestamp,
    }, { merge: true });

    transaction.set(weekRef, {
      studentUid: auth.uid,
      klasId: String(caller.data.klasId || ""),
      vak,
      week: weekSleutel,
      tokens: alDezeWeek + tokens + huiswerkTokens,
      xp: normalizeNonNegativeInteger(week.xp, 0) + xp,
      dagen: dagenNa,
      ...(huiswerkTokens > 0 ? { huiswerkBonus: huiswerkTokens } : {}),
      ...(weekdoelStand ? { weekdoel: weekdoelStand } : {}),
      updatedAt: timestamp,
    }, { merge: true });

    const sterren = normalizeNonNegativeInteger(voortgang.sterren, 0) + (ster ? 1 : 0);
    transaction.set(voortgangRef, {
      studentUid: auth.uid,
      xp: xpNa,
      niveau: niveauNa.niveau,
      sterren,
      ...(reeks ? {
        dvReeks: { aantal: reeks.aantal, laatsteWeek: reeks.laatsteWeek, bevriezingWeek: reeks.bevriezingWeek || null },
      } : {}),
      updatedAt: timestamp,
    }, { merge: true });
    transaction.set(niveauRef, {
      studentUid: auth.uid,
      klasId: String(caller.data.klasId || ""),
      niveau: niveauNa.niveau,
      updatedAt: timestamp,
    }, { merge: true });

    return {
      awarded: totaalTokens > 0 || xp > 0,
      amount: totaalTokens,
      huiswerkTokens,
      weekdoel: weekdoelStand,
      kistTokens,
      reeks: reeks ? { aantal: reeks.aantal, bevroren: reeks.bevroren, comeback: reeks.comeback } : null,
      mijlpaalTokens,
      balance: nextAccount.balance,
      xp,
      xpTotaal: xpNa,
      niveau: niveauNa.niveau,
      xpInNiveau: niveauNa.xpInNiveau,
      xpNodig: niveauNa.xpNodig,
      niveauOmhoog: niveausErbij > 0,
      niveauTokens,
      ster,
      eersteKeerHonderd,
      percentage,
      reden,
      plafondBereikt,
    };
  });
}

async function purchaseTokenShopItemCore({ auth, data = {}, db, now = FieldValue.serverTimestamp }) {
  const caller = await getCallerDoc({ auth, db, label: "Leerling" });
  if (caller.data.role !== "student") {
    throw new HttpsError("permission-denied", "Alleen leerlingen kunnen tokens uitgeven.");
  }

  const itemId = requireString(data.itemId, "itemId");
  const timestamp = getServerTimestamp(now);
  const itemRef = db.doc(`tokenShopItems/${itemId}`);
  const accountRef = db.doc(`tokenAccounts/${auth.uid}`);
  const transactionRef = getTransactionRef(db, `spend_${cleanIdPart(auth.uid)}_${cleanIdPart(itemId)}_${Date.now().toString(36)}`);
  const purchaseRef = db.collection("tokenPurchases").doc(createGeneratedId("purchase"));

  return runDbTransaction(db, async (transaction) => {
    const [itemSnapshot, accountSnapshot] = await Promise.all([
      transaction.get(itemRef),
      transaction.get(accountRef),
    ]);

    if (!itemSnapshot.exists) {
      throw new HttpsError("not-found", "Shopitem bestaat niet.");
    }

    const item = itemSnapshot.data() || {};
    if (item.enabled === false) {
      throw new HttpsError("failed-precondition", "Dit shopitem is niet beschikbaar.");
    }

    if (item.repeatable !== true && await hasPurchasedTokenShopItem({ db, studentUid: auth.uid, itemId })) {
      throw new HttpsError("already-exists", "Je bezit dit shopitem al.");
    }

    const price = normalizeNonNegativeInteger(item.price, 0);
    const account = normalizeTokenAccount(accountSnapshot.exists ? accountSnapshot.data() : {});
    const nextAccount = buildBalancePatch(account, price, TOKEN_TRANSACTION_TYPES.SPEND, timestamp);
    const itemSnapshotData = {
      id: itemId,
      title: item.title || "",
      description: item.description || "",
      price,
      imageUrl: item.imageUrl || "",
      imageStoragePath: item.imageStoragePath || "",
      itemType: normalizeShopItemType(item.itemType),
      rarity: normalizeShopItemRarity(item.rarity),
      targetSlot: item.targetSlot || TOKEN_SHOP_TARGET_SLOT_BY_TYPE[normalizeShopItemType(item.itemType)],
    };
    const transactionData = {
      studentUid: auth.uid,
      type: TOKEN_TRANSACTION_TYPES.SPEND,
      amount: -price,
      source: { kind: "shopItem", id: itemId, title: itemSnapshotData.title },
      reason: "shop-purchase",
      createdBy: auth.uid,
      createdAt: timestamp,
      balanceAfter: nextAccount.balance,
    };
    const purchaseData = {
      studentUid: auth.uid,
      itemId,
      item: itemSnapshotData,
      price,
      transactionId: transactionRef.path.split("/").at(-1),
      createdAt: timestamp,
    };

    transaction.set(accountRef, nextAccount, { merge: true });
    transaction.set(transactionRef, transactionData);
    transaction.set(purchaseRef, purchaseData);

    return {
      purchased: true,
      itemId,
      price,
      balance: nextAccount.balance,
      transactionPath: transactionRef.path,
      purchasePath: purchaseRef.path,
    };
  });
}

async function hasPurchasedTokenShopItem({ db, studentUid, itemId }) {
  const purchaseSnapshot = await db.collection("tokenPurchases").where("studentUid", "==", studentUid).get();
  return purchaseSnapshot.docs.some((purchase) => {
    const data = purchase.data() || {};
    return data.itemId === itemId;
  });
}

async function equipTokenShopItemCore({ auth, data = {}, db, now = FieldValue.serverTimestamp }) {
  const caller = await getCallerDoc({ auth, db, label: "Leerling" });
  if (caller.data.role !== "student") {
    throw new HttpsError("permission-denied", "Alleen leerlingen kunnen shopitems activeren.");
  }

  const itemId = requireString(data.itemId, "itemId");
  const itemSnapshot = await db.doc(`tokenShopItems/${itemId}`).get();
  if (!itemSnapshot.exists) {
    throw new HttpsError("not-found", "Shopitem bestaat niet.");
  }

  const item = itemSnapshot.data() || {};
  if (item.enabled === false) {
    throw new HttpsError("failed-precondition", "Dit shopitem is niet beschikbaar.");
  }

  const purchased = await hasPurchasedTokenShopItem({ db, studentUid: auth.uid, itemId });
  if (!purchased) {
    throw new HttpsError("failed-precondition", "Je kunt alleen gekochte shopitems activeren.");
  }

  const itemType = normalizeShopItemType(item.itemType);
  const targetSlot = item.targetSlot || TOKEN_SHOP_TARGET_SLOT_BY_TYPE[itemType];
  const timestamp = getServerTimestamp(now);
  const loadoutRef = db.doc(`studentTokenLoadouts/${auth.uid}`);
  const loadoutSnapshot = await loadoutRef.get();
  const currentLoadout = loadoutSnapshot.exists ? loadoutSnapshot.data() || {} : {};
  const patch = {
    studentUid: auth.uid,
    updatedAt: timestamp,
  };

  if (itemType === "shopBadge") {
    const activePinIds = Array.isArray(currentLoadout.activePinIds)
      ? currentLoadout.activePinIds.filter(Boolean)
      : [];
    patch.activePinIds = [...activePinIds.filter((id) => id !== itemId), itemId].slice(-3);
  } else {
    const fieldName = TOKEN_SHOP_LOADOUT_FIELD_BY_TYPE[itemType];
    if (!fieldName) {
      throw new HttpsError("invalid-argument", "Dit shopitem kan niet worden geactiveerd.");
    }
    patch[fieldName] = itemId;
  }

  await loadoutRef.set(patch, { merge: true });

  return {
    equipped: true,
    itemId,
    targetSlot,
  };
}

async function adjustStudentTokensCore({ auth, data = {}, db, now = FieldValue.serverTimestamp }) {
  const caller = await getCallerDoc({ auth, db });
  assertAdminRole(caller.data);

  const studentUid = requireString(data.studentUid, "studentUid");
  const amount = normalizeInteger(data.amount, 0);
  if (amount === 0) {
    throw new HttpsError("invalid-argument", "Correctiebedrag mag niet nul zijn.");
  }

  const reason = requireString(data.reason, "reden");
  await getRequiredDoc(db.doc(`users/${studentUid}`), "Leerling");

  const timestamp = getServerTimestamp(now);
  const accountRef = db.doc(`tokenAccounts/${studentUid}`);
  const transactionRef = getTransactionRef(db, `adjust_${cleanIdPart(studentUid)}_${Date.now().toString(36)}`);

  return runDbTransaction(db, async (transaction) => {
    const accountSnapshot = await transaction.get(accountRef);
    const account = normalizeTokenAccount(accountSnapshot.exists ? accountSnapshot.data() : {});
    const nextAccount = buildBalancePatch(account, amount, TOKEN_TRANSACTION_TYPES.ADJUSTMENT, timestamp);
    const transactionData = {
      studentUid,
      type: TOKEN_TRANSACTION_TYPES.ADJUSTMENT,
      amount,
      source: { kind: "adminAdjustment" },
      reason,
      createdBy: auth.uid,
      createdAt: timestamp,
      balanceAfter: nextAccount.balance,
    };

    transaction.set(accountRef, nextAccount, { merge: true });
    transaction.set(transactionRef, transactionData);

    return { adjusted: true, amount, balance: nextAccount.balance };
  });
}

async function createOrUpdateTokenShopItemCore({ auth, data = {}, db, now = FieldValue.serverTimestamp }) {
  const caller = await getCallerDoc({ auth, db });
  assertAdminRole(caller.data);

  const itemId = cleanIdPart(data.itemId || createGeneratedId("tokenShopItem"));
  if (!itemId) {
    throw new HttpsError("invalid-argument", "itemId is ongeldig.");
  }

  const itemRef = db.doc(`tokenShopItems/${itemId}`);
  const existing = await itemRef.get();
  const timestamp = getServerTimestamp(now);
  const item = normalizeShopItemPayload(data, existing.exists ? existing.data() : {});
  const payload = {
    ...item,
    updatedAt: timestamp,
    updatedBy: auth.uid,
    ...(existing.exists ? {} : { createdAt: timestamp, createdBy: auth.uid }),
  };

  await itemRef.set(payload, { merge: true });
  return { itemId, saved: true };
}

async function uploadTokenShopItemImageCore({
  auth,
  data = {},
  db,
  bucket,
  now = () => Date.now(),
  tokenFactory = randomUUID,
}) {
  const caller = await getCallerDoc({ auth, db });
  assertAdminRole(caller.data);

  const itemId = cleanIdPart(data.itemId || "");
  if (!itemId) {
    throw new HttpsError("invalid-argument", "itemId is ongeldig.");
  }

  const contentType = String(data.contentType || "image/png").trim().toLowerCase();
  if (!TOKEN_SHOP_IMAGE_CONTENT_TYPES.has(contentType)) {
    throw new HttpsError("invalid-argument", "Alleen PNG, JPG, WebP of GIF-afbeeldingen zijn toegestaan.");
  }

  const imageBase64 = requireString(data.imageBase64, "imageBase64");
  const imageBuffer = Buffer.from(imageBase64, "base64");
  if (!imageBuffer.length || imageBuffer.length > TOKEN_SHOP_IMAGE_MAX_BYTES) {
    throw new HttpsError("invalid-argument", "Afbeelding moet kleiner zijn dan 4 MB.");
  }

  const timestamp = typeof now === "function" ? now() : Date.now();
  const extension = getTokenShopImageExtension({
    fileName: data.fileName || "",
    contentType,
  });
  const downloadToken = tokenFactory();
  const storagePath = `token-shop-items/${itemId}/image_${cleanIdPart(timestamp)}.${extension}`;

  await bucket.file(storagePath).save(imageBuffer, {
    contentType,
    resumable: false,
    metadata: {
      cacheControl: "public,max-age=3600",
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
        itemId,
        uploadedBy: auth.uid,
      },
    },
  });

  return {
    storagePath,
    downloadURL: buildFirebaseStorageDownloadUrl({
      bucketName: bucket.name,
      storagePath,
      token: downloadToken,
    }),
  };
}

exports.approveStudentPhotoImportCrop = onCall({
  region: REGION,
}, async (request) => {
  return approveStudentPhotoImportCropCore({
    auth: request.auth,
    data: request.data || {},
    db: getFirestore(),
    bucket: getStorage().bucket(),
  });
});

exports.awardTokensForActivity = onCall({
  region: REGION,
}, async (request) => {
  return awardTokensForActivityCore({
    auth: request.auth,
    data: request.data || {},
    db: getFirestore(),
  });
});

exports.purchaseTokenShopItem = onCall({
  region: REGION,
}, async (request) => {
  return purchaseTokenShopItemCore({
    auth: request.auth,
    data: request.data || {},
    db: getFirestore(),
  });
});

exports.equipTokenShopItem = onCall({
  region: REGION,
}, async (request) => {
  return equipTokenShopItemCore({
    auth: request.auth,
    data: request.data || {},
    db: getFirestore(),
  });
});

exports.adjustStudentTokens = onCall({
  region: REGION,
}, async (request) => {
  return adjustStudentTokensCore({
    auth: request.auth,
    data: request.data || {},
    db: getFirestore(),
  });
});

exports.createOrUpdateTokenShopItem = onCall({
  region: REGION,
}, async (request) => {
  return createOrUpdateTokenShopItemCore({
    auth: request.auth,
    data: request.data || {},
    db: getFirestore(),
  });
});

exports.uploadTokenShopItemImage = onCall({
  region: REGION,
}, async (request) => {
  return uploadTokenShopItemImageCore({
    auth: request.auth,
    data: request.data || {},
    db: getFirestore(),
    bucket: getStorage().bucket(),
  });
});

exports.deleteAllStudentData = onCall({
  region: REGION,
}, async (request) => {
  return deleteAllStudentDataCore({
    auth: request.auth,
    db: getFirestore(),
  });
});

/**
 * Een inlogtoken voor een testleerling, zodat de beheerder kan zien en doen wat
 * een leerling van een bepaalde klas ziet en doet.
 *
 * De derde controle hieronder is het hart van deze functie: er komt alleen een
 * token voor een account met `isTestaccount === true`. Een echte leerling kan
 * hiermee dus niet geopend worden, ook niet als iemand de aanroep namaakt. De
 * functie schrijft niets; ze logt alleen wie welke testsessie startte.
 */
async function startTestleerlingSessieCore({ auth, data = {}, db, createCustomToken }) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om een testsessie te starten.");
  }

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Caller");
  const rol = String(caller.data.role || "").trim().toLowerCase();
  if (rol !== "admin" && !isConfiguredAdminEmail(caller.data.email)) {
    throw new HttpsError("permission-denied", "Alleen de beheerder kan als testleerling inloggen.");
  }

  const doelUid = requireString(data.uid, "uid");
  const doel = await getRequiredDoc(db.doc(`users/${doelUid}`), "Testleerling");
  if (doel.data.isTestaccount !== true) {
    throw new HttpsError(
      "permission-denied",
      "Dit is geen testaccount. Inloggen als een echte leerling kan niet.",
    );
  }

  const token = await createCustomToken(doelUid, { testleerling: true });
  console.log(`Testsessie gestart door ${auth.uid} voor ${doelUid}`);

  return {
    token,
    uid: doelUid,
    displayName: doel.data.displayName || "Testleerling",
    klasId: doel.data.klasId || "",
  };
}

// Deze functie ondertekent een inlogtoken, en dat mag alleen een serviceaccount
// met de rol Service Account Token Creator. Het standaard compute-account van
// Cloud Functions heeft die rol niet (roles/editor bevat signBlob niet meer),
// dus draait deze ene functie als het Firebase Admin SDK-account, dat hem al
// heeft.
exports.startTestleerlingSessie = onCall({
  region: REGION,
  serviceAccount: "firebase-adminsdk-fbsvc@pythagoras-eoa.iam.gserviceaccount.com",
}, async (request) => {
  try {
    return await startTestleerlingSessieCore({
      auth: request.auth,
      data: request.data || {},
      db: getFirestore(),
      createCustomToken: (uid, claims) => getAuth().createCustomToken(uid, claims),
    });
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }
    console.error("Error in startTestleerlingSessie:", error);
    throw new HttpsError("internal", "De testsessie kon nu niet gestart worden.");
  }
});

exports.resetLeerlingBlokWerk = onCall({
  region: REGION,
}, async (request) => {
  try {
    return await resetLeerlingBlokWerkCore({
      auth: request.auth,
      data: request.data || {},
      db: getFirestore(),
    });
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }
    console.error("Error in resetLeerlingBlokWerk:", error);
    throw new HttpsError("internal", "Het werk kon nu niet gereset worden.");
  }
});

exports.importStudentNumberAccounts = onCall({
  region: REGION,
}, async (request) => {
  return importStudentNumberAccountsCore({
    auth: request.auth,
    data: request.data || {},
    db: getFirestore(),
    authAdmin: getAuth(),
  });
});

exports.deleteStudentAccount = onCall({
  region: REGION,
}, async (request) => {
  return deleteStudentAccountCore({
    auth: request.auth,
    data: request.data || {},
    db: getFirestore(),
    authAdmin: getAuth(),
  });
});

exports.resetStudentPassword = onCall({
  region: REGION,
}, async (request) => {
  return resetStudentPasswordCore({
    auth: request.auth,
    data: request.data || {},
    db: getFirestore(),
    authAdmin: getAuth(),
  });
});

exports.syncAllStudentAuthAccounts = onCall({
  region: REGION,
}, async (request) => {
  return syncAllStudentAuthAccountsCore({
    auth: request.auth,
    data: request.data || {},
    db: getFirestore(),
    authAdmin: getAuth(),
  });
});

exports.getOpenRouterConfigStatus = onCall({
  region: REGION,
}, async (request) => {
  return getOpenRouterConfigStatusCore({
    auth: request.auth,
    db: getFirestore(),
  });
});

exports.updateOpenRouterConfig = onCall({
  region: REGION,
}, async (request) => {
  return updateOpenRouterConfigCore({
    auth: request.auth,
    data: request.data || {},
    db: getFirestore(),
  });
});

exports.getAiTutorRules = onCall({
  region: REGION,
}, async (request) => {
  return getAiTutorRulesCore({
    auth: request.auth,
    db: getFirestore(),
  });
});

exports.updateAiTutorRules = onCall({
  region: REGION,
}, async (request) => {
  return updateAiTutorRulesCore({
    auth: request.auth,
    data: request.data || {},
    db: getFirestore(),
  });
});

// ---------------------------------------------------------------------------
// Nulmeting digitale vaardigheden: persoonlijk startprofiel
//
// De mapping vraag -> deelvaardigheid en het analysemodel staan als privéveld
// `content.nulmeting` op de twee toetsblokken (niet in de publieke snapshot).
// Deze callable leest de itemrecords van de leerling, rekent het profiel uit
// met de gedeelde laag (functions/shared/nulmetingProfiel.js) en schrijft het
// naar nulmetingProfielen/{uid}. Leerlingen mogen alleen hun eigen profiel
// laten berekenen; admin en supervisor elk profiel of een hele klas.
// ---------------------------------------------------------------------------

let sharedNulmetingLayerPromise = null;

function loadSharedNulmetingLayer() {
  if (!sharedNulmetingLayerPromise) {
    sharedNulmetingLayerPromise = import("./shared/nulmetingProfiel.js").then((layer) => ({
      buildNulmetingProfiel: layer.buildNulmetingProfiel,
    }));
  }
  return sharedNulmetingLayerPromise;
}

function chunk(list, size) {
  const out = [];
  for (let index = 0; index < list.length; index += size) out.push(list.slice(index, index + size));
  return out;
}

async function findNulmetingBlocksForKlas({ db, klasData }) {
  const paragraafIds = Array.isArray(klasData?.enabledParagrafen) ? klasData.enabledParagrafen.map(String) : [];
  const blocks = [];
  for (const deel of chunk(paragraafIds, 30)) {
    if (!deel.length) continue;
    const snapshot = await db.collection("contentBlocks").where("paragraafId", "in", deel).get();
    snapshot.docs.forEach((doc) => {
      const data = doc.data() || {};
      if (data.type === "toets" && data.content?.nulmeting?.mapping && data.isArchived !== true) {
        blocks.push({ id: doc.id, ...data });
      }
    });
  }
  return blocks.sort((a, b) => String(a.content.nulmeting.deel).localeCompare(String(b.content.nulmeting.deel)));
}

async function computeNulmetingProfielForStudent({ db, uid, userData, klasData, layer, now }) {
  const blocks = await findNulmetingBlocksForKlas({ db, klasData });
  if (!blocks.length) {
    throw new HttpsError("failed-precondition", "Er is geen nulmeting toegewezen aan deze klas.");
  }

  const mapping = {};
  blocks.forEach((block) => Object.assign(mapping, block.content.nulmeting.mapping || {}));
  const analysemodel = blocks.find((block) => block.content.nulmeting.analysemodel)?.content.nulmeting.analysemodel || {};

  const itemRecords = {};
  let laatsteActiviteit = null;
  for (const block of blocks) {
    const items = await db.collection("voortgang").doc(`${uid}_${block.id}`).collection("items").get();
    items.docs.forEach((doc) => {
      const data = doc.data() || {};
      itemRecords[doc.id] = { completed: data.completed === true, isCorrect: data.isCorrect === true };
      const moment = data.completedAt?.toDate ? data.completedAt.toDate() : null;
      if (moment && (!laatsteActiviteit || moment > laatsteActiviteit)) laatsteActiviteit = moment;
    });
  }

  const profiel = layer.buildNulmetingProfiel({
    analysemodel,
    mapping,
    itemRecords,
    leerlingId: uid,
    naam: String(userData.displayName || ""),
    afgenomenOp: (laatsteActiviteit || now).toISOString().slice(0, 10),
  });

  const document = {
    ...profiel,
    userId: uid,
    klasId: String(userData.klasId || ""),
    blokIds: blocks.map((block) => block.id),
    berekendOp: now.toISOString(),
  };
  await db.collection("nulmetingProfielen").doc(uid).set(document, { merge: false });
  return document;
}

async function buildNulmetingProfielCore({ auth, data, db, loadLayer = loadSharedNulmetingLayer, now = new Date() }) {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Log in om je startprofiel te bekijken.");
  }

  const caller = await getRequiredDoc(db.doc(`users/${auth.uid}`), "Gebruiker");
  const callerData = caller.data || {};
  const role = String(callerData.role || "").trim().toLowerCase();
  const isStaff = role === "admin" || role === "supervisor" || isConfiguredAdminEmail(callerData.email);
  const layer = await loadLayer();

  // Hele klas in één keer: alleen voor docenten.
  const klasId = String(data?.klasId || "").trim();
  if (klasId) {
    if (!isStaff) {
      throw new HttpsError("permission-denied", "Alleen een docent kan profielen voor een klas berekenen.");
    }
    const klas = await getRequiredDoc(db.doc(`klassen/${klasId}`), "Klas");
    const students = await db.collection("users").where("klasId", "==", klasId).get();
    const profielen = [];
    for (const doc of students.docs) {
      const userData = doc.data() || {};
      if (String(userData.role || "student") !== "student") continue;
      // Een testleerling hoort niet in een klasberekening: zijn profiel zou
      // meetellen in het beeld dat de docent van de klas krijgt.
      if (userData.isTestaccount === true) continue;
      try {
        profielen.push(await computeNulmetingProfielForStudent({ db, uid: doc.id, userData, klasData: klas.data, layer, now }));
      } catch (error) {
        if (error instanceof HttpsError && error.code === "failed-precondition") break;
        throw error;
      }
    }
    return { success: true, klasId, aantal: profielen.length, profielen };
  }

  const targetUid = String(data?.leerlingUid || auth.uid).trim();
  if (targetUid !== auth.uid && !isStaff) {
    throw new HttpsError("permission-denied", "Je kunt alleen je eigen startprofiel bekijken.");
  }
  const target = targetUid === auth.uid ? caller : await getRequiredDoc(db.doc(`users/${targetUid}`), "Leerling");
  const targetData = target.data || {};
  const targetKlasId = String(targetData.klasId || "").trim();
  if (!targetKlasId) {
    throw new HttpsError("failed-precondition", "Deze leerling is nog niet aan een klas gekoppeld.");
  }
  const klas = await getRequiredDoc(db.doc(`klassen/${targetKlasId}`), "Klas");
  const profiel = await computeNulmetingProfielForStudent({ db, uid: targetUid, userData: targetData, klasData: klas.data, layer, now });
  return { success: true, profiel };
}

exports.buildNulmetingProfiel = onCall({
  region: REGION,
}, async (request) => {
  try {
    return await buildNulmetingProfielCore({
      auth: request.auth,
      data: request.data || {},
      db: getFirestore(),
    });
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }
    console.error("Error in buildNulmetingProfiel:", error);
    throw new HttpsError("internal", "Het startprofiel kon nu niet berekend worden.");
  }
});

exports.assessOpenAnswer = onCall({
  region: REGION,
  secrets: [openrouterApiKey],
}, async (request) => {
  try {
    return await assessOpenAnswerCore({
      auth: request.auth,
      data: request.data || {},
      db: getFirestore(),
      openrouterApiKeyProvider: () => openrouterApiKey.value(),
    });
  } catch (error) {
    console.error("Error in assessOpenAnswer:", error);
    return {
      success: false,
      error: error instanceof HttpsError ? error.message : OPEN_ANSWER_ASSESSMENT_FALLBACK_ERROR
    };
  }
});

exports.gradeClosedQuestion = onCall({
  region: REGION,
}, async (request) => {
  try {
    return await gradeClosedQuestionCore({
      auth: request.auth,
      data: request.data || {},
      db: getFirestore(),
    });
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }

    console.error("Error in gradeClosedQuestion:", error);
    throw new HttpsError("internal", "Het nakijken lukte nu niet. Je docent kan meekijken.");
  }
});

exports.extractTextViaOcr = onCall({
  region: REGION,
  secrets: [openrouterApiKey],
}, async (request) => {
  try {
    return await extractTextViaOcrCore({
      auth: request.auth,
      data: request.data || {},
      db: getFirestore(),
      openrouterApiKeyProvider: () => openrouterApiKey.value(),
    });
  } catch (error) {
    console.error("Error in extractTextViaOcr:", error);
    return {
      success: false,
      error: error.message || "OCR kon de afbeelding niet lezen."
    };
  }
});

exports.askAiTutor = onCall({
  region: REGION,
  secrets: [openrouterApiKey],
}, async (request) => {
  try {
    return await askAiTutorCore({
      auth: request.auth,
      data: request.data || {},
      db: getFirestore(),
      openrouterApiKeyProvider: () => openrouterApiKey.value(),
    });
  } catch (error) {
    console.error("Error in askAiTutor:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het verbinden met de tutor. Probeer het later opnieuw."
    };
  }
});

// ---------------------------------------------------------------------------
// Vertaling van lesstof naar de taal van de leerling
//
// Leest uitsluitend publicContentBlocks: dat is de leerlingversie zonder
// antwoordsleutel, dus dat is de enige content die hier het model in mag. Een
// vertaling wordt bewaard op de vingerafdruk van de brontekst
// (functions/shared/lesTaal.js), zodat een ongewijzigd blok nooit opnieuw
// langs het model hoeft.
// ---------------------------------------------------------------------------

// functions/shared is ESM en dit bestand is CommonJS, dus de laag komt binnen
// met een dynamische import in een gecachete promise. Exact hetzelfde patroon
// als sharedNulmetingLayerPromise verderop in dit bestand; require() zou hier
// bij de eerste aanroep stukgaan.
let sharedLesTaalLayerPromise = null;
function getLesTaalLayer() {
  if (!sharedLesTaalLayerPromise) {
    sharedLesTaalLayerPromise = import("./shared/lesTaal.js").then((layer) => ({
      bronTekstVanLesstofInfo: layer.bronTekstVanLesstofInfo,
      bronVingerafdruk: layer.bronVingerafdruk,
      isLesTaal: layer.isLesTaal,
      isVertaalbaarBlok: layer.isVertaalbaarBlok,
      taalNederlands: layer.taalNederlands,
      tekstVingerafdruk: layer.tekstVingerafdruk,
    }));
  }
  return sharedLesTaalLayerPromise;
}

// Hoeveel tokens het antwoord mag kosten. Een vaste grens werkte niet: Grieks
// kost bij de gangbare tokenizers al gauw twee tot drie keer zoveel tokens per
// teken als Nederlands (Latijnse woorden vallen vaak in één token, Griekse
// worden per paar tekens gehakt). Bij 3000 liep een lang theorieblok halverwege
// af, kwam er onafgemaakte JSON terug, faalde het parsen en zag de leerling
// stil niets. Daarom schalen we mee met de lengte van de brontekst:
// - VERTAAL_TOKENS_PER_TEKEN is ruim genomen, zodat ook de duurste taal past;
// - VERTAAL_MIN_TOKENS houdt korte blokken royaal boven de ondergrens;
// - VERTAAL_TOKEN_PLAFOND voorkomt dat één uitzonderlijk blok een onbeperkte
//   rekening oplevert. Een blok dat daar tegenaan loopt hoort gesplitst te
//   worden, niet stilletjes duurder te worden.
const VERTAAL_TOKENS_PER_TEKEN = 3;
const VERTAAL_MIN_TOKENS = 3000;
const VERTAAL_TOKEN_PLAFOND = 16000;

function vertaalTokenBudget(bronLengte) {
  const geschat = Math.ceil((Number(bronLengte) || 0) * VERTAAL_TOKENS_PER_TEKEN);
  return Math.min(VERTAAL_TOKEN_PLAFOND, Math.max(VERTAAL_MIN_TOKENS, geschat));
}

/**
 * Het aantal afbeeldingen in een stuk html. De vertaling gaat later met
 * dangerouslySetInnerHTML het scherm op; het praktische risico daarbij is niet
 * een aanval maar verlies: een model dat een <img> of een link "opruimt". Een
 * leerling die de vertaling aanzet zou dan juist het beeld kwijtraken waar de
 * vraag naar verwijst.
 */
function telAfbeeldingen(html) {
  return (String(html || "").match(/<img\b/gi) || []).length;
}

// Zelfde tekens als cleanIdPart() elders in dit bestand toelaat voor id's.
const BLOCK_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

/**
 * Dezelfde vorm voor uitgaande en binnenkomende tekst: alleen id, prompt en
 * per optie id/text, allemaal door String(). Dit is de enige plek die bepaalt
 * welke itemvelden het systeem in en uit mogen, dus wat het model teruggeeft
 * kan hier nooit een antwoordsleutel of ander veld binnensmokkelen dat er bij
 * het versturen niet in zat. `maxAantal` begrenst het aantal items op wat het
 * bronblok werkelijk heeft, zodat een model geen extra items kan verzinnen.
 */
function vormItemsVoorLeerling(items, maxAantal = Infinity) {
  return (Array.isArray(items) ? items : []).slice(0, maxAantal).map((item) => ({
    id: String(item?.id || ""),
    prompt: String(item?.prompt || ""),
    options: (Array.isArray(item?.options) ? item.options : []).map((optie) => ({
      id: String(optie?.id || ""),
      text: String(optie?.text || "")
    }))
  }));
}

/**
 * Alleen de zichtbare tekst gaat mee. Wat hier niet in staat, kan het model ook
 * niet lekken: de leerlingversie draagt geen antwoordsleutel, en we sturen
 * expliciet alleen de velden die vertaald moeten worden. Apart van
 * bouwVertaalBericht, omdat de lengte van deze JSON ook het tokenbudget bepaalt.
 */
function bouwVertaalInvoer(blok) {
  return {
    titel: String(blok.title || ""),
    html: String(blok.content?.html || ""),
    items: vormItemsVoorLeerling(blok.content?.items)
  };
}

function bouwVertaalBericht({ teVertalen, taalNaam }) {
  return [
    {
      role: "system",
      content: [
        `Je vertaalt lesmateriaal voor het voortgezet onderwijs van het Nederlands naar het ${taalNaam}.`,
        "Regels:",
        "- Vertaal uitsluitend de zichtbare tekst in de velden titel, html, prompt en text.",
        "- Laat elke id ongewijzigd.",
        "- Behoud de HTML-structuur en alle attributen precies zoals ze zijn.",
        "- Laat elke afbeelding (<img>) en elke link staan; verwijder er nooit een.",
        "- Beantwoord geen vragen en voeg niets toe.",
        "- Gebruik taal die een leerling van twaalf tot vijftien jaar begrijpt.",
        "- Antwoord met uitsluitend geldige JSON in exact dezelfde vorm als de invoer."
      ].join("\n")
    },
    { role: "user", content: JSON.stringify(teVertalen) }
  ];
}

async function vertaalLesblokCore({ auth, data, db, fetchImpl = fetch, openrouterApiKeyProvider, nowMs = Date.now() }) {
  const { bronVingerafdruk, isLesTaal, isVertaalbaarBlok, taalNederlands } = await getLesTaalLayer();

  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Je moet ingelogd zijn.");
  }

  const blockId = String(data?.blockId || "").trim();
  const taal = String(data?.taal || "").trim();

  if (!blockId) {
    throw new HttpsError("invalid-argument", "blockId ontbreekt.");
  }
  if (!BLOCK_ID_PATTERN.test(blockId)) {
    throw new HttpsError("invalid-argument", "blockId bevat ongeldige tekens.");
  }
  if (!isLesTaal(taal)) {
    throw new HttpsError("invalid-argument", `Onbekende taal: ${taal}`);
  }

  const callerSnapshot = await db.doc(`users/${auth.uid}`).get();
  const callerData = callerSnapshot.exists ? callerSnapshot.data() || {} : {};

  // Uitsluitend de leerlingversie. Het blok uit contentBlocks draagt de
  // antwoordsleutel en hoort niet bij een vertaler.
  const blokSnapshot = await db.doc(`publicContentBlocks/${blockId}`).get();
  if (!blokSnapshot.exists) {
    throw new HttpsError("not-found", "Dit lesblok bestaat niet.");
  }
  const blok = { id: blockId, ...blokSnapshot.data() };

  if (!isVertaalbaarBlok(blok)) {
    throw new HttpsError("failed-precondition", "Dit soort lesblok heeft geen tekst om te vertalen.");
  }

  const access = await assertAssessmentBlockAssignedToCaller({ db, uid: auth.uid, callerData, block: blok, blockId });

  const vingerafdruk = bronVingerafdruk(blok);
  const vertalingRef = db.doc(`vertalingen/${blockId}__${taal}`);
  const bestaand = await vertalingRef.get();

  if (bestaand.exists) {
    const opgeslagen = bestaand.data() || {};
    if (opgeslagen.bronVingerafdruk === vingerafdruk) {
      return { success: true, vertaling: opgeslagen, verouderd: false };
    }
    // Werk van de docent overschrijven we niet stil: teruggeven met een vlag.
    if (opgeslagen.bron === "docent") {
      return { success: true, vertaling: opgeslagen, verouderd: true };
    }
  }

  // De rem geldt pas hier, vlak voor de betaalde modelaanroep: een cache-hit
  // hierboven kost niets en mag dus niet van het budget van de leerling af.
  if (access.rateLimited) {
    await assertQuestionGradingRateLimit({ db, uid: auth.uid, subjectId: `${blockId}__${taal}`, nowMs });
  }

  const runtimeConfig = await getOpenRouterRuntimeConfig(db, openrouterApiKeyProvider);
  // De doeltaal komt uit LES_TALEN (shared/lesTaal.js), niet uit een lijstje
  // hier. Zo raakt een derde taal toevoegen alleen dat ene bestand.
  const taalNaam = taalNederlands(taal);
  if (!taalNaam) {
    // Onbereikbaar zolang LES_TALEN compleet is - die module faalt bij het
    // laden als een taal geen Nederlandse naam heeft - maar nooit stil
    // doorgaan met een lege doeltaal in de opdracht aan het model.
    throw new HttpsError("internal", `Geen Nederlandse naam voor taal ${taal}.`);
  }

  const teVertalen = bouwVertaalInvoer(blok);

  const response = await fetchImpl("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${runtimeConfig.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://stellingvanpythagoras.nl",
      "X-Title": "HELIX App"
    },
    body: JSON.stringify({
      model: runtimeConfig.model,
      messages: bouwVertaalBericht({ teVertalen, taalNaam }),
      // De vertaling heeft dezelfde vorm als de invoer, dus de lengte van die
      // invoer is hier de beste maat voor wat het antwoord mag kosten.
      max_tokens: vertaalTokenBudget(JSON.stringify(teVertalen).length),
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new HttpsError("unavailable", "Vertalen lukt nu even niet.");
  }

  const payload = await response.json();
  const rauw = payload?.choices?.[0]?.message?.content || "";
  let vertaald;
  try {
    vertaald = JSON.parse(rauw);
  } catch {
    throw new HttpsError("internal", "De vertaling kwam niet in het juiste formaat terug.");
  }

  // Afbeeldingen tellen vóór het opslaan. Laat het model er een weg, dan is de
  // vertaling onbruikbaar: de tekst verwijst naar een plaatje dat er niet meer
  // is. Liever niets bewaren en de Nederlandse tekst laten staan dan een
  // vertaling vastleggen waar de helft van de les uit verdwenen is.
  const bronAfbeeldingen = telAfbeeldingen(teVertalen.html);
  const vertaaldeAfbeeldingen = telAfbeeldingen(vertaald.html);
  if (vertaaldeAfbeeldingen !== bronAfbeeldingen) {
    throw new HttpsError(
      "internal",
      `De vertaling miste afbeeldingen uit de lesstof (${vertaaldeAfbeeldingen} in plaats van ${bronAfbeeldingen}) en is niet bewaard.`
    );
  }

  const vertaling = {
    blockId,
    paragraafId: String(blok.paragraafId || ""),
    taal,
    bronVingerafdruk: vingerafdruk,
    titel: String(vertaald.titel || ""),
    html: String(vertaald.html || ""),
    // Zelfde filter als bij het versturen (vormItemsVoorLeerling): wat het
    // model erbij verzint of extra teruggeeft, komt zo nooit in het bewaarde
    // document terecht.
    items: vormItemsVoorLeerling(vertaald.items, (blok.content?.items || []).length),
    bron: "ai",
    gecontroleerd: false,
    model: runtimeConfig.model
  };

  // FieldValue.serverTimestamp() is een schrijf-sentinel: die los houden van
  // het object dat we teruggeven. Precies zoals createOrUpdateTokenShopItemCore
  // en awardTokensForActivityCore elders in dit bestand het doen, komt de
  // sentinel alleen in het geschreven document terecht, nooit in het
  // antwoord aan de client.
  //
  // gemaaktOp hoort volgens het ontwerp bij de herkomst van een vertaling. Dit
  // pad is het enige dat een vertaling aanmaakt; het nakijkpaneel schrijft met
  // merge: true en laat het veld dus staan.
  await vertalingRef.set({
    ...vertaling,
    gemaaktOp: FieldValue.serverTimestamp(),
    bijgewerktOp: FieldValue.serverTimestamp()
  }, { merge: false });

  return { success: true, vertaling, verouderd: false };
}

/**
 * De lesstofgegevens buiten de lesblokken: de titel, de beschrijving en de
 * leerdoelen van een paragraaf, en de titel en beschrijving van een hoofdstuk.
 *
 * Waarom apart van vertaalLesblok: die teksten staan niet in een lesblok maar
 * in de CMS-documenten, en een leerling ziet ze voordat hij een les opent - op
 * de lesstofpagina, op de hoofdstukpagina en in het startvenster "Wat je gaat
 * leren". Zonder deze functie doet de taalknop daar niets.
 *
 * Er gaan alleen titels, beschrijvingen en leerdoelen mee. In die documenten
 * staat geen antwoordsleutel, en elke ingelogde leerling mag ze al lezen
 * (firestore.rules: paragraaf en hoofdstuk zijn leesbaar voor wie is ingelogd),
 * dus deze functie ontsluit niets nieuws.
 */
const LESSTOF_INFO_MAX = 60;

/**
 * Het eerste complete JSON-object uit een modelantwoord.
 *
 * Het model levert meestal keurig JSON, maar niet altijd: bij een lijst in een
 * omhullend object plakt het er soms een extra accolade achter, en soms staat
 * het antwoord in een ```json-blok. Dan faalt JSON.parse en zag de leerling
 * alleen Nederlands, terwijl de vertaling er gewoon was. Daarom lezen we tot de
 * accolade die het openingsteken sluit, met de tekens binnen aanhalingstekens
 * overgeslagen.
 */
function leesJsonObject(rauw) {
  const tekst = String(rauw || "").replace(/^\s*```(?:json)?/i, "").replace(/```\s*$/i, "").trim();
  if (!tekst) return null;

  try {
    return JSON.parse(tekst);
  } catch {
    // Verderop nog een poging met alleen het eerste complete object.
  }

  const start = tekst.indexOf("{");
  if (start < 0) return null;

  let diepte = 0;
  let inString = false;
  let ontsnapt = false;

  for (let i = start; i < tekst.length; i += 1) {
    const teken = tekst[i];

    if (inString) {
      if (ontsnapt) ontsnapt = false;
      else if (teken === "\\") ontsnapt = true;
      else if (teken === '"') inString = false;
      continue;
    }

    if (teken === '"') inString = true;
    else if (teken === "{") diepte += 1;
    else if (teken === "}") {
      diepte -= 1;
      if (diepte === 0) {
        try {
          return JSON.parse(tekst.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }

  return null;
}
const LESSTOF_INFO_SOORTEN = { paragraaf: "paragraaf", hoofdstuk: "hoofdstuk" };

function bouwLesstofInfoBron(soort, data = {}) {
  const tekst = (waarde) => String(waarde ?? "").trim();
  const regels = (waarde) => {
    if (Array.isArray(waarde)) return waarde.map((item) => tekst(item)).filter(Boolean);
    return tekst(waarde).split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  };

  // Het nummer gaat er eerst af: het scherm zet "Hoofdstuk 2" of "2.1" er zelf
  // al voor. Stuurden we "h1 Stoffen" mee, dan kwam er "Hoofdstuk 1. Stoffen"
  // terug en stond het nummer twee keer op de kaart.
  const zonderNummer = (waarde) => tekst(waarde)
    .replace(/^[hH]\s*\d+\s*[.:\-]?\s*/, "")
    .replace(/^\d+(?:\.\d+)*\s*[.:)\-]?\s*/, "");

  const basis = {
    titel: zonderNummer(data.title ?? data.titel),
    beschrijving: tekst(data.description ?? data.beschrijving),
  };

  if (soort !== LESSTOF_INFO_SOORTEN.paragraaf) return { ...basis, leerdoelen: [] };

  return {
    ...basis,
    leerdoelen: regels(data.learningGoals ?? data.leerdoelen ?? data.goals ?? data.doelen),
  };
}

function bouwLesstofInfoBericht({ teVertalen, taalNaam }) {
  return [
    {
      role: "system",
      content: [
        `Je vertaalt de namen en leerdoelen van lesmateriaal voor het voortgezet onderwijs van het Nederlands naar het ${taalNaam}.`,
        "Regels:",
        "- Vertaal uitsluitend de velden titel, beschrijving en leerdoelen.",
        "- Laat elke id en elk nummer (zoals 2.1) ongewijzigd staan.",
        "- Houd het aantal leerdoelen precies gelijk en in dezelfde volgorde.",
        "- Voeg niets toe en laat niets weg.",
        "- Gebruik taal die een leerling van twaalf tot vijftien jaar begrijpt.",
        "- Antwoord met uitsluitend geldige JSON in exact dezelfde vorm als de invoer.",
      ].join("\n"),
    },
    { role: "user", content: JSON.stringify(teVertalen) },
  ];
}

/** Zelfde vorm in en uit: wat het model erbij verzint, komt er hier niet door. */
function vormLesstofInfo(vertaald, bron) {
  const leerdoelen = (Array.isArray(vertaald?.leerdoelen) ? vertaald.leerdoelen : [])
    .slice(0, bron.leerdoelen.length)
    .map((doel) => String(doel || ""));

  return {
    titel: String(vertaald?.titel || bron.titel),
    beschrijving: String(vertaald?.beschrijving || bron.beschrijving),
    // Een model dat leerdoelen laat vallen levert een half startvenster op.
    // Dan liever de Nederlandse doelen dan een lijst die niet meer klopt.
    leerdoelen: leerdoelen.length === bron.leerdoelen.length ? leerdoelen : bron.leerdoelen,
  };
}

async function vertaalLesstofInfoCore({ auth, data, db, fetchImpl = fetch, openrouterApiKeyProvider, nowMs = Date.now() }) {
  const { bronTekstVanLesstofInfo, isLesTaal, taalNederlands, tekstVingerafdruk } = await getLesTaalLayer();

  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Je moet ingelogd zijn.");
  }

  const taal = String(data?.taal || "").trim();
  if (!isLesTaal(taal)) {
    throw new HttpsError("invalid-argument", `Onbekende taal: ${taal}`);
  }

  const verzamel = (waarde) => (Array.isArray(waarde) ? waarde : [])
    .map((id) => String(id || "").trim())
    .filter((id) => id && BLOCK_ID_PATTERN.test(id));

  const gevraagd = [
    ...verzamel(data?.paragraafIds).map((id) => ({ soort: LESSTOF_INFO_SOORTEN.paragraaf, id })),
    ...verzamel(data?.hoofdstukIds).map((id) => ({ soort: LESSTOF_INFO_SOORTEN.hoofdstuk, id })),
  ].slice(0, LESSTOF_INFO_MAX);

  if (!gevraagd.length) {
    return { success: true, paragrafen: {}, hoofdstukken: {} };
  }

  const uitkomst = { paragraaf: {}, hoofdstuk: {} };
  const teVertalen = [];

  for (const { soort, id } of gevraagd) {
    const snapshot = await db.doc(`${soort}/${id}`).get();
    if (!snapshot.exists) continue;

    const bron = bouwLesstofInfoBron(soort, snapshot.data() || {});
    if (!bron.titel && !bron.beschrijving && !bron.leerdoelen.length) continue;

    const vingerafdruk = tekstVingerafdruk(bronTekstVanLesstofInfo(bron));
    const bestaand = await db.doc(`vertalingen/info-${soort}-${id}__${taal}`).get();
    if (bestaand.exists && (bestaand.data() || {}).bronVingerafdruk === vingerafdruk) {
      const opgeslagen = bestaand.data() || {};
      uitkomst[soort][id] = {
        titel: opgeslagen.titel || "",
        beschrijving: opgeslagen.beschrijving || "",
        leerdoelen: Array.isArray(opgeslagen.leerdoelen) ? opgeslagen.leerdoelen : [],
      };
      continue;
    }

    teVertalen.push({ soort, id, bron, vingerafdruk });
  }

  if (!teVertalen.length) {
    return { success: true, paragrafen: uitkomst.paragraaf, hoofdstukken: uitkomst.hoofdstuk };
  }

  // De rem geldt pas hier: alles wat uit de cache kwam, kostte niets.
  await assertQuestionGradingRateLimit({ db, uid: auth.uid, subjectId: `lesstofinfo__${taal}`, nowMs });

  const runtimeConfig = await getOpenRouterRuntimeConfig(db, openrouterApiKeyProvider);
  const taalNaam = taalNederlands(taal);
  if (!taalNaam) {
    throw new HttpsError("internal", `Geen Nederlandse naam voor taal ${taal}.`);
  }

  const invoer = teVertalen.map((regel) => ({ id: `${regel.soort}-${regel.id}`, ...regel.bron }));

  const response = await fetchImpl("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${runtimeConfig.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://stellingvanpythagoras.nl",
      "X-Title": "HELIX App",
    },
    body: JSON.stringify({
      model: runtimeConfig.model,
      messages: bouwLesstofInfoBericht({ teVertalen: { onderdelen: invoer }, taalNaam }),
      max_tokens: vertaalTokenBudget(JSON.stringify(invoer).length),
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new HttpsError("unavailable", "Vertalen lukt nu even niet.");
  }

  const payload = await response.json();
  const vertaald = leesJsonObject(payload?.choices?.[0]?.message?.content);
  if (!vertaald) {
    throw new HttpsError("internal", "De vertaling kwam niet in het juiste formaat terug.");
  }

  // Het model mag de lijst onder "onderdelen" zetten of rechtstreeks teruggeven.
  const lijst = Array.isArray(vertaald) ? vertaald
    : Array.isArray(vertaald.onderdelen) ? vertaald.onderdelen
      : Array.isArray(vertaald.items) ? vertaald.items : [];
  const perId = new Map(lijst.map((item) => [String(item?.id || ""), item]));

  for (const regel of teVertalen) {
    const vertaling = vormLesstofInfo(perId.get(`${regel.soort}-${regel.id}`), regel.bron);
    uitkomst[regel.soort][regel.id] = vertaling;

    await db.doc(`vertalingen/info-${regel.soort}-${regel.id}__${taal}`).set({
      soort: regel.soort,
      documentId: regel.id,
      taal,
      bronVingerafdruk: regel.vingerafdruk,
      ...vertaling,
      bron: "ai",
      model: runtimeConfig.model,
      bijgewerktOp: FieldValue.serverTimestamp(),
    }, { merge: false });
  }

  return { success: true, paragrafen: uitkomst.paragraaf, hoofdstukken: uitkomst.hoofdstuk };
}

exports.vertaalLesstofInfo = onCall({
  region: REGION,
  secrets: [openrouterApiKey],
}, async (request) => {
  return await vertaalLesstofInfoCore({
    auth: request.auth,
    data: request.data || {},
    db: getFirestore(),
    openrouterApiKeyProvider: () => openrouterApiKey.value(),
  });
});

exports.vertaalLesblok = onCall({
  region: REGION,
  secrets: [openrouterApiKey],
}, async (request) => {
  return await vertaalLesblokCore({
    auth: request.auth,
    data: request.data || {},
    db: getFirestore(),
    openrouterApiKeyProvider: () => openrouterApiKey.value(),
  });
});

exports.__test = {
  adjustStudentTokensCore,
  approveStudentPhotoImportCropCore,
  assessOpenAnswerCore,
  askAiTutorCore,
  awardTokensForActivityCore,
  createOrUpdateTokenShopItemCore,
  deleteAllStudentDataCore,
  equipTokenShopItemCore,
  extractTextViaOcrCore,
  gradeClosedQuestionCore,
  buildNulmetingProfielCore,
  loadSharedGradingLayer,
  loadSharedNulmetingLayer,
  importStudentNumberAccountsCore,
  getAiTutorRulesCore,
  getOpenRouterConfigStatusCore,
  purchaseTokenShopItemCore,
  resetLeerlingBlokWerkCore,
  startTestleerlingSessieCore,
  resetStudentPasswordCore,
  syncAllStudentAuthAccountsCore,
  updateAiTutorRulesCore,
  updateOpenRouterConfigCore,
  uploadTokenShopItemImageCore,
  vertaalLesblokCore,
  vertaalLesstofInfoCore,
  leesJsonObject,
  vertaalTokenBudget,
  telAfbeeldingen,
  buildAiTutorSystemPrompt,
  buildAiTutorMistakeDiagnosis,
  buildAssessmentRetryDiagnosis,
  stripAssessmentAnswerLeaks,
  normalizeReadableMathText,
  normalizeAiTutorContent,
  buildOpenAnswerAssessmentMessages,
  shouldPreserveUserDuringStudentReset,
  QUESTION_GRADING_RATE_LIMIT_MAX,
  QUESTION_GRADING_RATE_LIMIT_WINDOW_MS,
};
