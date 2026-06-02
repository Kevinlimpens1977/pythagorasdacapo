const { HttpsError, onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

initializeApp();

const openrouterApiKey = defineSecret("OPENROUTER_API_KEY");
const REGION = "europe-west1";

const allowedImportRoles = new Set(["admin", "docent"]);
const preservedStudentResetEmails = new Set([
  "vragen@scheikundeles.nl",
  "kevlimpens@gmail.com",
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

function buildAiTutorFallbackHint({ firstName = "leerling", studentAnswer = "" } = {}) {
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
    content: normalizeAiTutorContent(responseData.choices?.[0]?.message?.content, { firstName, studentAnswer }),
    helpCounted: true,
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
  approveStudentPhotoImportCropCore,
  assessOpenAnswerCore,
  askAiTutorCore,
  deleteAllStudentDataCore,
  extractTextViaOcrCore,
  importStudentNumberAccountsCore,
  getAiTutorRulesCore,
  getOpenRouterConfigStatusCore,
  resetStudentPasswordCore,
  syncAllStudentAuthAccountsCore,
  updateAiTutorRulesCore,
  updateOpenRouterConfigCore,
  buildAiTutorSystemPrompt,
  buildAiTutorMistakeDiagnosis,
  normalizeReadableMathText,
  normalizeAiTutorContent,
  buildOpenAnswerAssessmentMessages,
  shouldPreserveUserDuringStudentReset,
};
