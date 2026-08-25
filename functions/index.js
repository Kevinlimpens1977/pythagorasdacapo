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

function getContentBlockVersion(contentBlock = {}, fallback = "") {
  return String(
    fallback ||
      contentBlock.publishedVersion ||
      contentBlock.version ||
      contentBlock.updatedAt ||
      contentBlock.publishedAt ||
      "v1",
  );
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

async function assertAiTutorBlockAllowed({ db, blockId }) {
  const cleanBlockId = String(blockId || "").trim();
  if (!cleanBlockId) return;

  const block = await getRequiredDoc(db.doc(`contentBlocks/${cleanBlockId}`), "Lesblok");
  if (block.data?.settings?.allowAiHelp !== true) {
    throw new HttpsError("permission-denied", "Digidocent staat uit voor dit lesblok.");
  }
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
} = {}) {
  const answerText = String(studentAnswer || "").trim();
  const lessonContextText = String(lessonContext || "").trim().slice(0, 6000);
  const diagnosis = buildAiTutorMistakeDiagnosis({ studentAnswer: answerText });
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
  const runtimeConfig = await getOpenRouterRuntimeConfig(db, openrouterApiKeyProvider);
  const aiTutorRules = await getAiTutorRulesRuntime(db);
  const messages = buildOpenAnswerAssessmentMessages({
    questionTitle: data?.questionTitle,
    questionPrompt: data?.questionPrompt,
    modelAnswer: data?.modelAnswer,
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
  await assertAiTutorBlockAllowed({ db, blockId: data?.blockId });
  const runtimeConfig = await getOpenRouterRuntimeConfig(db, openrouterApiKeyProvider);
  const contextHeading = String(data?.contextHeading || "deze vraag").trim();
  const previousMessages = Array.isArray(data?.previousMessages) ? data.previousMessages : [];
  const hints = Array.isArray(data?.hints) ? data.hints : [];
  const studentAnswer = data?.studentAnswer || "";
  const lessonContext = data?.lessonContext || "";
  const aiTutorRules = await getAiTutorRulesRuntime(db);

  if (!hasMeaningfulAiTutorStudentAttempt(studentAnswer)) {
    return {
      success: true,
      content: buildAiTutorTryFirstHint({ firstName }),
      helpCounted: false,
    };
  }

  const systemPrompt = buildAiTutorSystemPrompt({ contextHeading, firstName, studentAnswer, lessonContext, rules: aiTutorRules });

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
  return {
    success: true,
    content: normalizeAiTutorContent(responseData.choices?.[0]?.message?.content, { firstName, studentAnswer, lessonContext }),
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
    throw new HttpsError("failed-precondition", "Dit toetsblok staat niet klaar om nagekeken te worden.");
  }

  const paragraafId = String(block.paragraafId || "").trim();
  const klasId = String(callerData.klasId || "").trim();
  if (!klasId) {
    throw new HttpsError("failed-precondition", "Je bent nog niet aan een klas gekoppeld.");
  }

  const klas = await getRequiredDoc(db.doc(`klassen/${klasId}`), "Klas");
  if (!isParagraphAssignedToStudent(klas.data, uid, paragraafId)) {
    throw new HttpsError("permission-denied", "Dit toetsblok hoort niet bij jouw lesstof.");
  }

  if (!isContentBlockAssignedToStudent(klas.data, uid, paragraafId, blockId)) {
    throw new HttpsError("permission-denied", "Dit toetsblok hoort niet bij jouw lesstof.");
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

async function awardTokensForActivityCore({ auth, data = {}, db, now = FieldValue.serverTimestamp }) {
  const caller = await getCallerDoc({ auth, db, label: "Leerling" });
  if (caller.data.role !== "student") {
    throw new HttpsError("permission-denied", "Alleen leerlingen kunnen tokens verdienen.");
  }

  const sourceKind = String(data.sourceKind || "").trim();
  const sourceId = requireString(data.sourceId, "sourceId");
  if (!TOKEN_SOURCE_KINDS.has(sourceKind)) {
    throw new HttpsError("invalid-argument", "Onbekende tokenbron.");
  }

  const result = data.result || {};
  const completed = result.completed === true;
  const isCorrect = result.isCorrect === true || result.passed === true || result.resultTier === "independent" || result.resultTier === "guided";
  if (!completed || !isCorrect) {
    const accountSnapshot = await db.doc(`tokenAccounts/${auth.uid}`).get();
    const account = normalizeTokenAccount(accountSnapshot.exists ? accountSnapshot.data() : {});
    return { awarded: false, amount: 0, balance: account.balance, reason: "not-correct" };
  }

  let sourceVersion = String(data.sourceVersion || "").trim();
  let amount = 0;
  let sourceTitle = String(data.sourceTitle || "").trim();
  let gameRule = null;

  if (sourceKind === "contentBlock" || sourceKind === "question") {
    const contentPath = sourceKind === "contentBlock" ? `publicContentBlocks/${sourceId}` : `publicQuestions/${sourceId}`;
    const contentDoc = await getRequiredDoc(db.doc(contentPath), sourceKind === "contentBlock" ? "Lesblok" : "Vraag");
    sourceVersion = getContentBlockVersion(contentDoc.data, sourceVersion);
    amount = getAwardAmountForContentBlock(contentDoc.data);
    sourceTitle = sourceTitle || contentDoc.data.title || contentDoc.data.content?.title || "";
  } else if (sourceKind === "game") {
    sourceVersion = sourceVersion || "v1";
    gameRule = await getGameRewardRule(db, sourceId);
    amount = computeGameAwardAmount(gameRule, result);
  }

  if (amount <= 0) {
    const accountSnapshot = await db.doc(`tokenAccounts/${auth.uid}`).get();
    const account = normalizeTokenAccount(accountSnapshot.exists ? accountSnapshot.data() : {});
    return { awarded: false, amount: 0, balance: account.balance, reason: "no-token-value" };
  }

  const claimId = [
    cleanIdPart(auth.uid),
    cleanIdPart(sourceKind),
    cleanIdPart(sourceId),
    cleanIdPart(sourceVersion),
  ].join("_");
  const timestamp = getServerTimestamp(now);
  const accountRef = db.doc(`tokenAccounts/${auth.uid}`);
  const claimRef = db.doc(`tokenAwardClaims/${claimId}`);
  const transactionRef = getTransactionRef(db, `earn_${claimId}`);

  const source = {
    kind: sourceKind,
    id: sourceId,
    version: sourceVersion,
    title: sourceTitle,
    paragraafId: String(data.paragraafId || "").trim(),
    blockId: String(data.blockId || "").trim(),
    gameId: String(data.gameId || (sourceKind === "game" ? sourceId : "")).trim(),
  };

  return runDbTransaction(db, async (transaction) => {
    const [accountSnapshot, claimSnapshot] = await Promise.all([
      transaction.get(accountRef),
      transaction.get(claimRef),
    ]);
    const account = normalizeTokenAccount(accountSnapshot.exists ? accountSnapshot.data() : {});

    if (claimSnapshot.exists) {
      const decay = gameRule?.replayDecay;
      if (!decay) {
        return { awarded: false, amount: 0, balance: account.balance, reason: "already-awarded" };
      }

      // Herhaalbeurt met verval: elke beurt levert decay^beurten van het basisbedrag op,
      // tot het totaalplafond (rule.max) per leerling bereikt is.
      const claim = claimSnapshot.data() || {};
      const plays = Math.max(1, normalizeNonNegativeInteger(claim.plays, 1));
      const totalAwarded = normalizeNonNegativeInteger(claim.totalAwarded ?? claim.amount, 0);
      const vervallenBedrag = Math.round(amount * Math.pow(decay, plays));
      const beschikbaar = Math.max(0, gameRule.max - totalAwarded);
      const herhaalBedrag = Math.max(0, Math.min(vervallenBedrag, beschikbaar));

      if (herhaalBedrag <= 0) {
        return { awarded: false, amount: 0, balance: account.balance, reason: "replay-limit" };
      }

      const nextAccount = buildBalancePatch(account, herhaalBedrag, TOKEN_TRANSACTION_TYPES.EARN, timestamp);
      const herhaalTransactionRef = getTransactionRef(db, `earn_${claimId}_p${plays + 1}`);

      transaction.set(accountRef, nextAccount, { merge: true });
      transaction.set(herhaalTransactionRef, {
        studentUid: auth.uid,
        type: TOKEN_TRANSACTION_TYPES.EARN,
        amount: herhaalBedrag,
        source,
        reason: "activity-replay",
        createdBy: auth.uid,
        createdAt: timestamp,
        balanceAfter: nextAccount.balance,
      });
      transaction.set(claimRef, {
        plays: plays + 1,
        totalAwarded: totalAwarded + herhaalBedrag,
        updatedAt: timestamp,
      }, { merge: true });

      return { awarded: true, amount: herhaalBedrag, balance: nextAccount.balance };
    }

    const nextAccount = buildBalancePatch(account, amount, TOKEN_TRANSACTION_TYPES.EARN, timestamp);
    const transactionData = {
      studentUid: auth.uid,
      type: TOKEN_TRANSACTION_TYPES.EARN,
      amount,
      source,
      reason: "activity-correct",
      createdBy: auth.uid,
      createdAt: timestamp,
      balanceAfter: nextAccount.balance,
    };

    transaction.set(accountRef, nextAccount, { merge: true });
    transaction.set(transactionRef, transactionData);
    transaction.set(claimRef, {
      studentUid: auth.uid,
      amount,
      plays: 1,
      totalAwarded: amount,
      source,
      transactionId: transactionRef.path.split("/").at(-1),
      createdAt: timestamp,
    });

    return { awarded: true, amount, balance: nextAccount.balance };
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
  loadSharedGradingLayer,
  importStudentNumberAccountsCore,
  getAiTutorRulesCore,
  getOpenRouterConfigStatusCore,
  purchaseTokenShopItemCore,
  resetStudentPasswordCore,
  syncAllStudentAuthAccountsCore,
  updateAiTutorRulesCore,
  updateOpenRouterConfigCore,
  uploadTokenShopItemImageCore,
  buildAiTutorSystemPrompt,
  buildAiTutorMistakeDiagnosis,
  normalizeReadableMathText,
  normalizeAiTutorContent,
  buildOpenAnswerAssessmentMessages,
  shouldPreserveUserDuringStudentReset,
  QUESTION_GRADING_RATE_LIMIT_MAX,
  QUESTION_GRADING_RATE_LIMIT_WINDOW_MS,
};
