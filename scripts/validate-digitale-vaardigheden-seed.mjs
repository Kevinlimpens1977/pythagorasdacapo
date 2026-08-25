import fs from 'node:fs';
import path from 'node:path';
import { getGameById } from '../src/lib/gameRegistry.js';
import { MEDIA_KINDS, parseYouTubeUrl } from '../src/lib/mediaUtils.js';

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

assertEqual(seed.contentBlocks?.filter((block) => block.type === 'game').length, 30, 'game block count');
assertEqual(seed.contentBlocks?.filter((block) => block.type === 'slidedeck').length, 30, 'slidedeck block count');
assertEqual(seed.contentBlocks?.filter((block) => block.type === 'quiz').length, 25, 'quiz block count');
assertEqual(seed.contentBlocks?.filter((block) => block.type === 'toets').length, 5, 'toets block count');

console.log('Digitale vaardigheden seed valid.');
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
