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

const enrichment = { goals: 0, keyTerms: 0, examples: 0 };

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
      if (!Array.isArray(keyTerms) || keyTerms.length === 0) {
        fail(`${block.id} has an empty or non-array keyTerms`);
      }
      if (keyTerms.length > 4) {
        fail(`${block.id} has ${keyTerms.length} keyTerms; maximaal 4 per theorieblok`);
      }
      const text = plainText(block.content?.html);
      for (const term of keyTerms) {
        if (!containsTerm(text, term)) {
          fail(`${block.id} keyTerm "${term}" komt niet als los woord in de theorietekst voor`);
        }
      }
      enrichment.keyTerms += 1;
    }

    const exampleHtml = block.content?.exampleHtml;
    if (exampleHtml !== undefined) {
      if (typeof exampleHtml !== 'string' || !plainText(exampleHtml)) {
        fail(`${block.id} has an exampleHtml without readable text`);
      }
      enrichment.examples += 1;
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

assertEqual(seed.contentBlocks?.filter((block) => block.type === 'game').length, 30, 'game block count');
assertEqual(seed.contentBlocks?.filter((block) => block.type === 'slidedeck').length, 30, 'slidedeck block count');
assertEqual(seed.contentBlocks?.filter((block) => block.type === 'quiz').length, 25, 'quiz block count');
assertEqual(seed.contentBlocks?.filter((block) => block.type === 'toets').length, 5, 'toets block count');

console.log('Digitale vaardigheden seed valid.');
console.log(`${seed.contentBlocks.length} blocks checked across ${seed.paragrafen.length} paragrafen.`);
console.log(
  `Verrijking: ${enrichment.goals}/30 paragrafen met leerdoelen, ` +
    `${enrichment.keyTerms}/60 theorieblokken met kernbegrippen, ` +
    `${enrichment.examples}/60 met uitgewerkt voorbeeld.`
);
