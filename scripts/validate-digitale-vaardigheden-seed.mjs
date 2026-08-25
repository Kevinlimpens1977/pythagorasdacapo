import fs from 'node:fs';
import path from 'node:path';
import { getGameById } from '../src/lib/gameRegistry.js';
import { MEDIA_KINDS, parseYouTubeUrl } from '../src/lib/mediaUtils.js';
import { normalizeAssessmentItem } from '../src/lib/assessmentBlockUtils.js';
import { gradeAssessmentItemAnswer } from '../src/lib/assessmentItemGrading.js';

const seedPath = path.resolve('docs/seeds/digitale-vaardigheden-vmbo1.seed.json');
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

const fail = (message) => {
  throw new Error(message);
};

const assertEqual = (actual, expected, label) => {
  if (actual !== expected) fail(`${label}: expected ${expected}, got ${actual}`);
};

assertEqual(seed.vakken?.length, 1, 'vak count');
assertEqual(seed.leerjaren?.length, 1, 'leerjaar count');
assertEqual(seed.niveaus?.length, 1, 'niveau count');
assertEqual(seed.hoofdstukken?.length, 5, 'hoofdstuk count');
assertEqual(seed.paragrafen?.length, 30, 'paragraaf count');

// Zelfde woordgrens als de leesopmaak in src/lib/lessonProseFormatting.js: een
// kernbegrip telt alleen als het als los woord in de theorietekst staat.
const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const plainText = (html) =>
  String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const containsTerm = (text, term) =>
  new RegExp(`(^|[^\\p{L}\\p{N}-])(${escapeRegExp(term)})(?![\\p{L}\\p{N}-])`, 'iu').test(text);

const enrichment = { goals: 0, keyTerms: 0, examples: 0, summaries: 0, templateSummaries: 0 };

// Sjabloonbewaking. Twee dingen mogen niet gebeuren:
// 1. hetzelfde kernbegrip in blok na blok vet zetten (dan leert vet niets meer);
// 2. dezelfde volzin in paragraaf na paragraaf laten terugkomen.
// Daarom tellen we per kernbegrip in hoeveel blokken het staat en per volzin in
// hoeveel paragrafen die voorkomt. Alleen de leesstappen tellen mee: theorie
// (inclusief het uitgewerkte voorbeeld) en de samenvatting. De vaste
// instructieregels bij quiz, toets, game en opdracht zijn geen leesstof.
const MAX_BLOCKS_PER_KEY_TERM = 2;
const MAX_PARAGRAFEN_PER_SENTENCE = 3;
const keyTermBlocks = new Map();
const sentenceParagrafen = new Map();

const paragraafById = new Map((seed.paragrafen || []).map((item) => [item.id, item]));

const registerKeyTerm = (term, blockId) => {
  const key = String(term).trim().toLowerCase();
  if (!keyTermBlocks.has(key)) keyTermBlocks.set(key, []);
  keyTermBlocks.get(key).push(blockId);
};

const registerSentences = (html, paragraafCode) => {
  for (const sentence of plainText(html).split(/(?<=[.!?])\s+/)) {
    const value = sentence.trim();
    if (value.split(/\s+/).length < 3) continue;
    if (!sentenceParagrafen.has(value)) sentenceParagrafen.set(value, new Set());
    sentenceParagrafen.get(value).add(paragraafCode);
  }
};

// Zelfde eisen voor theorie- en samenvattingskernbegrippen: 1 tot 4 stuks en
// elk begrip staat letterlijk als los woord in de eigen bloktekst.
const checkKeyTerms = (block, keyTerms, text) => {
  if (!Array.isArray(keyTerms) || keyTerms.length === 0) {
    fail(`${block.id} has an empty or non-array keyTerms`);
  }
  if (keyTerms.length > 4) {
    fail(`${block.id} has ${keyTerms.length} keyTerms; maximaal 4 per blok`);
  }
  for (const term of keyTerms) {
    if (!containsTerm(text, term)) {
      fail(`${block.id} keyTerm "${term}" komt niet als los woord in de eigen bloktekst voor`);
    }
    registerKeyTerm(term, block.id);
  }
};

const blocksByParagraaf = new Map();
for (const block of seed.contentBlocks || []) {
  if (!blocksByParagraaf.has(block.paragraafId)) blocksByParagraaf.set(block.paragraafId, []);
  blocksByParagraaf.get(block.paragraafId).push(block);

  if (block.settings?.allowMathToolbox !== false) {
    fail(`${block.id} enables math toolbox`);
  }

  if (['question', 'quiz'].includes(block.type) && block.settings?.allowAiHelp !== true) {
    fail(`${block.id} should enable Digidocent`);
  }

  if (block.type === 'toets' && block.settings?.allowAiHelp !== false) {
    fail(`${block.id} should disable Digidocent for toets/eindtoets`);
  }

  if (block.type === 'media') {
    const mediaKind = block.content?.mediaKind;
    const mediaUrl = block.content?.mediaUrl || '';
    if (!Object.values(MEDIA_KINDS).includes(mediaKind)) {
      fail(`${block.id} has unsupported mediaKind ${mediaKind}`);
    }
    if (mediaKind === MEDIA_KINDS.YOUTUBE && !parseYouTubeUrl(mediaUrl)) {
      fail(`${block.id} marks a non-YouTube URL as youtube`);
    }
    if (mediaUrl && mediaKind === MEDIA_KINDS.IMAGE && !/\.(png|jpe?g|webp|gif)($|[?#])/i.test(mediaUrl)) {
      fail(`${block.id} marks a non-image URL as image`);
    }
  }

  if (block.type === 'theory') {
    const keyTerms = block.content?.keyTerms;
    if (keyTerms !== undefined) {
      checkKeyTerms(block, keyTerms, plainText(block.content?.html));
      enrichment.keyTerms += 1;
    }

    const exampleHtml = block.content?.exampleHtml;
    if (exampleHtml !== undefined) {
      if (typeof exampleHtml !== 'string' || !plainText(exampleHtml)) {
        fail(`${block.id} has an exampleHtml without readable text`);
      }
      enrichment.examples += 1;
    }

    const paragraafCode = paragraafById.get(block.paragraafId)?.code || block.paragraafId;
    registerSentences(block.content?.html, paragraafCode);
    registerSentences(block.content?.exampleHtml, paragraafCode);
  }

  if (block.type === 'summary') {
    const paragraaf = paragraafById.get(block.paragraafId);
    const text = plainText(block.content?.html);
    if (!text) fail(`${block.id} has an empty summary`);

    // Kerndoelcodes zijn docentmetadata en horen op het blok, niet in de
    // leestekst die de leerling vlak voor de quiz of toets leest.
    if (/kerndoel/i.test(text)) {
      fail(`${block.id} noemt kerndoelen in de leerlingtekst; die horen in content.kerndoelen`);
    }
    if (!Array.isArray(block.content?.kerndoelen) || block.content.kerndoelen.length === 0) {
      fail(`${block.id} mist content.kerndoelen als docentmetadata`);
    }

    // Zolang de verrijking van een hoofdstuk nog niet gevuld is, blijft de ene
    // sjabloonregel staan. Elke samenvatting die daarvan afwijkt is verrijkte
    // lesstof en moet dus ook kernbegrippen hebben.
    const templateText = `Je werkte aan: ${paragraaf?.product || ''}.`;
    if (text === templateText) {
      if (block.content?.keyTerms !== undefined) {
        fail(`${block.id} heeft kernbegrippen maar nog wel de sjabloontekst`);
      }
      enrichment.templateSummaries += 1;
    } else {
      checkKeyTerms(block, block.content?.keyTerms, text);
      enrichment.summaries += 1;
      registerSentences(block.content?.html, paragraaf?.code || block.paragraafId);
    }
  }

  const visibleContent = JSON.stringify({
    title: block.title,
    html: block.content?.html,
    items: block.content?.items,
    gameTitle: block.content?.gameTitle,
    caption: block.content?.caption
  });
  if (visibleContent.includes('sourceBasis') || visibleContent.includes('sourceNotes')) {
    fail(`${block.id} leaks internal source metadata to visible content`);
  }
}

const checkpointCodes = new Set(['1.6', '2.6', '3.6', '4.6', '5.6']);
for (const paragraaf of seed.paragrafen) {
  const blocks = (blocksByParagraaf.get(paragraaf.id) || []).sort((a, b) => a.order - b.order);
  if (blocks.length === 0) fail(`${paragraaf.code} has no blocks`);
  assertEqual(blocks[0].type, 'slidedeck', `${paragraaf.code} first block`);

  const lastTypes = blocks.slice(-3).map((block) => block.type).join(' -> ');
  const expectedAssessment = checkpointCodes.has(paragraaf.code) ? 'toets' : 'quiz';
  assertEqual(lastTypes, `summary -> ${expectedAssessment} -> game`, `${paragraaf.code} final route`);

  const assessmentBlocks = blocks.filter((block) => block.type === 'quiz' || block.type === 'toets');
  assertEqual(assessmentBlocks.length, 1, `${paragraaf.code} assessment block count`);
  assertEqual(assessmentBlocks[0].type, expectedAssessment, `${paragraaf.code} assessment type`);

  const learningGoals = paragraaf.learningGoals;
  if (learningGoals !== undefined) {
    if (!Array.isArray(learningGoals) || learningGoals.length < 2 || learningGoals.length > 3) {
      fail(`${paragraaf.code} needs 2 or 3 learningGoals, got ${learningGoals?.length}`);
    }
    for (const goal of learningGoals) {
      if (!/^Je (weet|kunt) /.test(String(goal || ''))) {
        fail(`${paragraaf.code} learningGoal moet met "Je weet" of "Je kunt" beginnen: "${goal}"`);
      }
    }
    enrichment.goals += 1;
  }

  const totalTokens = blocks.reduce((sum, block) => sum + Number(block.tokenTotal || 0), 0);
  assertEqual(totalTokens, paragraaf.totalTokens, `${paragraaf.code} token total`);

  const gameBlock = blocks.at(-1);
  if (!gameBlock.content?.gameId) fail(`${paragraaf.code} missing gameId`);
  if (gameBlock.type !== 'game') fail(`${paragraaf.code} last block is not game`);
  if (!getGameById(gameBlock.content.gameId)) {
    fail(`${paragraaf.code} gameId ${gameBlock.content.gameId} is missing from GAME_REGISTRY`);
  }
}

// Een kernbegrip dat overal terugkomt is geen kernbegrip meer, maar een
// gewoon woord dat toevallig vet staat.
const overusedTerms = [...keyTermBlocks.entries()].filter(([, blockIds]) => blockIds.length > MAX_BLOCKS_PER_KEY_TERM);
if (overusedTerms.length) {
  const details = overusedTerms
    .map(([term, blockIds]) => `"${term}" in ${blockIds.length} blokken (${blockIds.join(', ')})`)
    .join('; ');
  fail(`kernbegrip mag in maximaal ${MAX_BLOCKS_PER_KEY_TERM} blokken staan: ${details}`);
}

// Dezelfde zin in paragraaf na paragraaf is sjabloontekst, geen lesstof.
const repeatedSentences = [...sentenceParagrafen.entries()]
  .filter(([, codes]) => codes.size > MAX_PARAGRAFEN_PER_SENTENCE);
if (repeatedSentences.length) {
  const details = repeatedSentences
    .map(([sentence, codes]) => `"${sentence}" in ${codes.size} paragrafen (${[...codes].join(', ')})`)
    .join('; ');
  fail(`dezelfde volzin mag in maximaal ${MAX_PARAGRAFEN_PER_SENTENCE} paragrafen staan: ${details}`);
}

// ---------------------------------------------------------------------------
// Toetsvragen
//
// Tot nu toe keek deze validator alleen naar de route en de leesstof, nooit naar
// de vragen zelf. Daardoor meldde hij "seed valid" terwijl elke quiz twee vaste
// opties had ("Beste keuze" en "Twijfel of onveilig") met het goede antwoord
// altijd bovenaan: 116 van de 116 vragen waren te halen zonder lezen.
//
// De generator dwingt deze regels al af, maar hij is niet de enige schrijver:
// een vraag kan ook uit de CMS-editor komen of met de hand in de seed-JSON
// gezet zijn. Daarom controleert de validator ze hier nog een keer, en wel op
// het GENORMALISEERDE item (normalizeAssessmentItem) - precies het item dat de
// leerlingroute en de beoordelaar te zien krijgen. Staat er onzin in
// `answer.options` terwijl `options` er netjes uitziet, dan valt dat hier om.
//
// Deze controles stoppen niet bij de eerste fout: alles wordt verzameld en
// onderaan als lijst gerapporteerd, zodat een run laat zien welke paragrafen
// nog werk nodig hebben in plaats van alleen de eerste.
// ---------------------------------------------------------------------------

const MIN_ASSESSMENT_ITEMS = { quiz: 3, toets: 6 };
const MIN_CLOSED_OPTIONS = 3;
const MAX_ITEMS_PER_OPTION_TEXT = 3;
const MAX_SAME_POSITION_SHARE = 0.4;
const MIN_MEERKEUZE_FOR_POSITION_CHECK = 10;
const MIN_NAKIJKPUNTEN = 2;
const MIN_FEEDBACK_LENGTH = 20;
// Blind steeds de bovenste knop klikken hoort niet te lonen. 60% laat ruimte
// voor toeval bij weinig vragen, maar vangt de oude 100%-bug ruim af.
const MAX_BLIND_TOP_BUTTON_SHARE = 0.6;

const VRAAGWOORDEN =
  /^(wat|waarom|hoe|welke|welk|wanneer|wie|waardoor|waarmee|waarvoor|noem|leg|beschrijf|geef|vergelijk|verklaar|kies)\b/i;

const questionProblems = [];
const noteProblem = (message) => questionProblems.push(message);

const feedbackItems = new Map(); // feedbackzin -> itemlabels
const optionTextItems = new Map(); // optietekst -> itemlabels
const correctPositions = new Map(); // positie (1-based) -> aantal meerkeuzevragen
const blindResults = { closed: 0, correct: 0 };
const questionStats = { blocks: 0, drafts: 0, items: 0, closed: 0, open: 0, waarNietWaar: 0 };
const draftParagrafen = [];

// Waar/Niet waar is per definitie hetzelfde tweetal opties. Die twee teksten
// tellen dus niet mee in de hergebruikcontrole - maar alleen als het echt dat
// vaste paar is. "Beste keuze"/"Twijfel of onveilig" is geen waar-niet-waar.
const isWaarNietWaarPair = (options) =>
  options.length === 2 &&
  ['waar', 'niet waar'].every((text) => options.some((option) => option.text.trim().toLowerCase() === text));

const countNakijkpunten = (rubric) =>
  String(rubric || '')
    .split('\n')
    .map((line) => line.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean).length;

const registerToMap = (map, key, label) => {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(label);
};

// Een sjabloonfout raakt al snel tientallen vragen. De melding noemt er een
// paar bij naam en telt de rest, anders is het rapport onleesbaar.
const summarizeLabels = (labels, max = 5) =>
  labels.length <= max ? labels.join(', ') : `${labels.slice(0, max).join(', ')} en ${labels.length - max} meer`;

for (const block of seed.contentBlocks || []) {
  if (block.type !== 'quiz' && block.type !== 'toets') continue;

  const code = paragraafById.get(block.paragraafId)?.code || block.paragraafId;
  const blockLabel = `${code} ${block.type}`;
  const rawItems = Array.isArray(block.content?.items) ? block.content.items : [];

  // Nog geen echte vragen: dat is geen detail dat je stil laat passeren. Het
  // blok hoort dan op draft te staan, zodat de leerlingroute het overslaat en
  // de tokens onbereikbaar blijven.
  if (rawItems.length === 0) {
    questionStats.drafts += 1;
    const ideas = Array.isArray(block.content?.pendingPrompts) ? block.content.pendingPrompts.length : 0;
    draftParagrafen.push(`${blockLabel}: nog geen vragen, ${ideas} vraagideeën in content.pendingPrompts`);
    if (block.status !== 'draft') {
      noteProblem(`${blockLabel}: staat op status "${block.status}" zonder vragen; een leeg toetsblok hoort op draft`);
    }
    continue;
  }

  questionStats.blocks += 1;
  if (block.status !== 'published') {
    noteProblem(`${blockLabel}: heeft ${rawItems.length} vragen maar staat op status "${block.status}"`);
  }

  const minItems = MIN_ASSESSMENT_ITEMS[block.type] ?? MIN_ASSESSMENT_ITEMS.quiz;
  if (rawItems.length < minItems) {
    noteProblem(`${blockLabel}: een ${block.type} heeft minstens ${minItems} vragen nodig, kreeg ${rawItems.length}`);
  }

  const items = rawItems.map((item, index) => normalizeAssessmentItem(item, index));
  if (items.length > 0 && items.every((item) => item.type === 'open')) {
    noteProblem(`${blockLabel}: alleen open vragen; een quiz of toets heeft ook nakijkbare gesloten vragen nodig`);
  }

  items.forEach((item, index) => {
    const label = `${blockLabel} vraag ${index + 1}`;
    questionStats.items += 1;

    const prompt = String(item.prompt || '').trim();
    if (!prompt) noteProblem(`${label}: lege vraagtekst`);

    // Elke vraag legt zijn eigen ding uit. Een sjabloonzin die overal onder
    // staat leert niets; dat was de "Bespreek kort waarom..."-regel.
    const feedback = String(item.feedback || '').trim();
    if (feedback.length < MIN_FEEDBACK_LENGTH) {
      noteProblem(
        `${label}: feedback ontbreekt of is te kort (${feedback.length} tekens, minstens ${MIN_FEEDBACK_LENGTH} nodig)`
      );
    } else {
      registerToMap(feedbackItems, feedback.toLowerCase(), label);
    }

    if (item.type === 'open') {
      questionStats.open += 1;
      const modelAnswer = String(item.answer?.modelAnswer || '').trim();
      if (!modelAnswer) noteProblem(`${label}: open vraag zonder modelAnswer, dus niet na te kijken`);
      const nakijkpunten = countNakijkpunten(item.answer?.rubric);
      if (nakijkpunten < MIN_NAKIJKPUNTEN) {
        noteProblem(
          `${label}: open vraag heeft minstens ${MIN_NAKIJKPUNTEN} nakijkpunten nodig in answer.rubric, kreeg ${nakijkpunten}`
        );
      }
      return;
    }

    const options = (item.options || []).map((option) => ({ ...option, text: String(option.text || '').trim() }));
    questionStats.closed += 1;
    if (item.type === 'waar-niet-waar') questionStats.waarNietWaar += 1;

    const vastPaar = isWaarNietWaarPair(options);
    if (item.type === 'waar-niet-waar' && !vastPaar) {
      noteProblem(
        `${label}: staat als waar-niet-waar in de seed maar heeft niet de twee opties Waar en Niet waar (${options
          .map((option) => `"${option.text}"`)
          .join(', ')})`
      );
    }
    if (!vastPaar && options.length < MIN_CLOSED_OPTIONS) {
      noteProblem(
        `${label}: een gesloten vraag heeft minstens ${MIN_CLOSED_OPTIONS} antwoordopties nodig, kreeg ${options.length}`
      );
    }

    // Een vraagzin is geen stelling. "Welk onderdeel is software?" met alleen
    // Waar/Niet waar eronder is niet te beantwoorden.
    if (item.type === 'waar-niet-waar') {
      if (VRAAGWOORDEN.test(prompt)) {
        noteProblem(`${label}: "${prompt.slice(0, 48)}..." begint met een vraagwoord en kan geen waar-niet-waar zijn`);
      } else if (prompt.endsWith('?')) {
        noteProblem(`${label}: een waar-niet-waar-vraag is een stelling, geen vraagzin`);
      }
    }

    // De sleutel wordt op de RUWE seedopties gecontroleerd, niet op de
    // genormaliseerde. normalizeChoiceAnswer repareert een item zonder goed
    // antwoord namelijk stilletjes door optie 1 goed te rekenen
    // (assessmentBlockUtils.js). Precies het patroon dat we willen vangen zou
    // dus onzichtbaar zijn als we alleen naar het genormaliseerde item keken.
    // Een lege optietekst wordt op dezelfde manier stil aangevuld tot
    // "Antwoord N", dus ook die telling gaat over de ruwe opties.
    const rawItem = rawItems[index] || {};
    const rawOptions = (Array.isArray(rawItem.answer?.options) && rawItem.answer.options.length > 0
      ? rawItem.answer.options
      : Array.isArray(rawItem.options)
        ? rawItem.options
        : []
    ).map((option) => ({ text: String(option?.text ?? '').trim(), correct: option?.correct === true }));

    const correctCount = rawOptions.filter((option) => option.correct).length;
    if (rawOptions.length > 0 && correctCount === 0) {
      noteProblem(
        `${label}: geen enkele optie staat als goed antwoord gemarkeerd; de app rekent dan stil de bovenste goed`
      );
    }
    if (rawOptions.length > 0 && correctCount === rawOptions.length) {
      noteProblem(`${label}: alle opties staan als goed antwoord gemarkeerd`);
    }
    for (const [optionIndex, option] of rawOptions.entries()) {
      if (!option.text) noteProblem(`${label}: antwoordoptie ${optionIndex + 1} heeft geen tekst`);
    }

    const texts = options.map((option) => option.text.toLowerCase());
    if (new Set(texts).size !== texts.length) noteProblem(`${label}: dezelfde antwoordoptie staat er twee keer in`);
    for (const text of new Set(texts)) {
      if (!text || vastPaar) continue;
      registerToMap(optionTextItems, text, label);
    }

    // `options` en `answer.options` moeten hetzelfde zeggen. De beoordelaar
    // leest `answer`; wie alleen `options` bijwerkt, verandert niets aan wat er
    // fout of goed gerekend wordt.
    const legacyOptions = Array.isArray(rawItem.options) ? rawItem.options : [];
    if (legacyOptions.length > 0) {
      const spiegel =
        legacyOptions.length === options.length &&
        legacyOptions.every(
          (option, optionIndex) =>
            String(option?.text || '').trim() === options[optionIndex].text &&
            (option?.correct === true) === (options[optionIndex].correct === true)
        );
      if (!spiegel) {
        noteProblem(`${label}: item.options en answer.options verschillen; de beoordelaar gebruikt answer.options`);
      }
    }

    if (options.length >= MIN_CLOSED_OPTIONS) {
      const position = options.findIndex((option) => option.correct === true) + 1;
      if (position > 0) correctPositions.set(position, (correctPositions.get(position) || 0) + 1);
    }

    // De echte proef: het item door dezelfde beoordelaar halen als de app, met
    // de bovenste knop als antwoord.
    if (options.length > 0) {
      blindResults.closed += 1;
      const result = gradeAssessmentItemAnswer({ item, answer: options[0].id });
      if (result?.isCorrect === true) blindResults.correct += 1;
    }
  });
}

const duplicateFeedback = [...feedbackItems.entries()].filter(([, labels]) => labels.length > 1);
for (const [feedback, labels] of duplicateFeedback) {
  noteProblem(
    `dezelfde feedbackzin staat bij ${labels.length} vragen (${summarizeLabels(labels)}): ` +
      `"${feedback.slice(0, 60)}${feedback.length > 60 ? '...' : ''}"`
  );
}

const overusedOptions = [...optionTextItems.entries()].filter(
  ([, labels]) => labels.length > MAX_ITEMS_PER_OPTION_TEXT
);
for (const [text, labels] of overusedOptions) {
  noteProblem(
    `antwoordoptie "${text}" staat in ${labels.length} vragen; ` +
      `maximaal ${MAX_ITEMS_PER_OPTION_TEXT} (${summarizeLabels(labels)})`
  );
}

const positionTotal = [...correctPositions.values()].reduce((sum, count) => sum + count, 0);
if (positionTotal >= MIN_MEERKEUZE_FOR_POSITION_CHECK) {
  for (const [position, count] of [...correctPositions.entries()].sort((a, b) => a[0] - b[0])) {
    const share = count / positionTotal;
    if (share > MAX_SAME_POSITION_SHARE) {
      noteProblem(
        `het goede antwoord staat in ${count} van de ${positionTotal} meerkeuzevragen op positie ${position} ` +
          `(${Math.round(share * 100)}%); maximaal ${Math.round(MAX_SAME_POSITION_SHARE * 100)}%`
      );
    }
  }
}

// Waar/Niet waar heeft maar twee knoppen, dus daar is 40% rekenkundig
// onhaalbaar; die balans wordt hieronder alleen gerapporteerd.
const blindShare = blindResults.closed > 0 ? blindResults.correct / blindResults.closed : 0;
if (blindResults.closed > 0 && blindShare > MAX_BLIND_TOP_BUTTON_SHARE) {
  noteProblem(
    `blind de bovenste knop klikken levert ${blindResults.correct}/${blindResults.closed} goed ` +
      `(${Math.round(blindShare * 100)}%); een gesloten vraag hoort gelezen te moeten worden`
  );
}

assertEqual(seed.contentBlocks?.filter((block) => block.type === 'game').length, 30, 'game block count');
assertEqual(seed.contentBlocks?.filter((block) => block.type === 'slidedeck').length, 30, 'slidedeck block count');
assertEqual(seed.contentBlocks?.filter((block) => block.type === 'quiz').length, 25, 'quiz block count');
assertEqual(seed.contentBlocks?.filter((block) => block.type === 'toets').length, 5, 'toets block count');

console.log(`${seed.contentBlocks.length} blocks checked across ${seed.paragrafen.length} paragrafen.`);
console.log(
  `Verrijking: ${enrichment.goals}/30 paragrafen met leerdoelen, ` +
    `${enrichment.keyTerms}/60 theorieblokken met kernbegrippen, ` +
    `${enrichment.examples}/60 met uitgewerkt voorbeeld, ` +
    `${enrichment.summaries}/30 verrijkte samenvattingen ` +
    `(${enrichment.templateSummaries} nog sjabloon).`
);
console.log(
  `${keyTermBlocks.size} unieke kernbegrippen, ` +
    `hoogste hergebruik ${Math.max(0, ...[...keyTermBlocks.values()].map((blockIds) => blockIds.length))} blokken.`
);

const positieVerdeling = [...correctPositions.entries()]
  .sort((a, b) => a[0] - b[0])
  .map(([position, count]) => `pos${position}: ${count}`)
  .join(', ');
console.log(
  `Toetsvragen: ${questionStats.blocks}/30 blokken met vragen (${questionStats.drafts} nog draft), ` +
    `${questionStats.items} vragen (${questionStats.closed} gesloten waarvan ${questionStats.waarNietWaar} waar-niet-waar, ` +
    `${questionStats.open} open).`
);
console.log(
  `Goed antwoord in meerkeuzevragen: ${positieVerdeling || 'geen'}; ` +
    `blind de bovenste knop klikken geeft ${blindResults.correct}/${blindResults.closed} goed ` +
    `(${Math.round(blindShare * 100)}%, grens ${Math.round(MAX_BLIND_TOP_BUTTON_SHARE * 100)}%); ` +
    `${feedbackItems.size} unieke feedbackzinnen op ${questionStats.items} vragen.`
);

if (questionProblems.length > 0 || draftParagrafen.length > 0) {
  console.error('');
  console.error(
    `Digitale vaardigheden seed NIET valid: ${questionProblems.length} fout(en) in bestaande vragen, ` +
      `${draftParagrafen.length} blok(ken) zonder vragen.`
  );
  if (questionProblems.length > 0) {
    console.error('');
    console.error(`Fout in bestaande vragen (${questionProblems.length}):`);
    for (const problem of questionProblems) console.error(`  - ${problem}`);
  }
  if (draftParagrafen.length > 0) {
    console.error('');
    console.error(`Nog geen toetsvragen (${draftParagrafen.length}):`);
    for (const draft of draftParagrafen) console.error(`  - ${draft}`);
  }
  process.exit(1);
}

console.log('Digitale vaardigheden seed valid.');
