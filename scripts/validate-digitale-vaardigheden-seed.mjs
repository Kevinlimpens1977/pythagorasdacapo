import fs from 'node:fs';
import path from 'node:path';
import { getGameById } from '../src/lib/gameRegistry.js';
import { MEDIA_KINDS, parseYouTubeUrl } from '../src/lib/mediaUtils.js';
import { normalizeAssessmentItem } from '../src/lib/assessmentBlockUtils.js';
import { gradeAssessmentItemAnswer } from '../src/lib/assessmentItemGrading.js';
import {
  CONTROLE_SOORTEN,
  mechanischeControles,
  telBevindingen
} from '../src/lib/seedMechanischeControles.js';
import { NIVEAUS, hoofdstukPlanVoorNiveau } from './seed-structuur/jaarplan.mjs';

// ---------------------------------------------------------------------------
// DRIE LEERWEGEN NAAST ELKAAR
//
// De seed bevat basis (bb), kader (kb) en theoretisch (tl) onder hetzelfde vak
// en hetzelfde leerjaar. Elke leerweg is een eigen leerroute met eigen
// hoofdstukken, paragrafen, contentblokken en toetsvragen, en wordt hier ook
// als eigen route gecontroleerd en gerapporteerd. Dat is niet alleen netter in
// de uitvoer: sjabloonbewaking (dezelfde zin, hetzelfde kernbegrip, dezelfde
// feedback te vaak) hoort PER leerweg te tellen. Bb, kb en tl zijn dezelfde les
// in andere woorden; dat een zin in alle drie voorkomt is de bedoeling, dat hij
// binnen één leerweg in paragraaf na paragraaf terugkomt niet.
//
// Alle controles uit de eerdere versie staan er nog in; ze draaien nu per
// leerweg en verzamelen hun bevindingen in plaats van te stoppen bij de eerste
// fout, zodat één run laat zien welke leerweg nog werk nodig heeft.
// ---------------------------------------------------------------------------

const seedPath = path.resolve('docs/seeds/digitale-vaardigheden-vmbo1.seed.json');
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

const globalProblems = [];
const noteGlobal = (message) => globalProblems.push(message);

const assertGlobalEqual = (actual, expected, label) => {
  if (actual !== expected) noteGlobal(`${label}: expected ${expected}, got ${actual}`);
};

assertGlobalEqual(seed.vakken?.length, 1, 'vak count');
assertGlobalEqual(seed.leerjaren?.length, 1, 'leerjaar count');
assertGlobalEqual(seed.niveaus?.length, NIVEAUS.length, 'niveau count');

for (const niveau of NIVEAUS) {
  const doc = (seed.niveaus || []).find((item) => item.id === niveau.niveauId);
  if (!doc) {
    noteGlobal(`leerweg ${niveau.id}: ${niveau.niveauId} ontbreekt in seed.niveaus`);
    continue;
  }
  if (doc.label !== niveau.label) {
    noteGlobal(`${niveau.niveauId}: label "${doc.label}" hoort "${niveau.label}" te zijn`);
  }
  if (doc.vakId !== 'vak-digitale-vaardigheden' || doc.leerjaarId !== 'leerjaar-digitale-vaardigheden-vmbo1') {
    noteGlobal(`${niveau.niveauId}: hoort onder hetzelfde vak en leerjaar als de andere leerwegen`);
  }
}

// Documenten die bij geen enkele bekende leerweg horen zijn onzichtbaar in het
// rapport hieronder; die moeten dus apart gemeld worden.
const bekendeNiveauIds = new Set(NIVEAUS.map((niveau) => niveau.niveauId));
for (const [collectie, items] of [
  ['hoofdstukken', seed.hoofdstukken],
  ['paragrafen', seed.paragrafen],
  ['contentBlocks', seed.contentBlocks]
]) {
  const zwevend = (items || []).filter((item) => !bekendeNiveauIds.has(item.niveauId));
  if (zwevend.length) {
    noteGlobal(
      `${zwevend.length} ${collectie} horen bij geen enkele leerweg ` +
        `(bijvoorbeeld ${zwevend[0].id} met niveauId "${zwevend[0].niveauId}")`
    );
  }
}

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

// Sjabloonbewaking. Twee dingen mogen niet gebeuren:
// 1. hetzelfde kernbegrip in blok na blok vet zetten (dan leert vet niets meer);
// 2. dezelfde volzin in paragraaf na paragraaf laten terugkomen.
// Daarom tellen we per kernbegrip in hoeveel blokken het staat en per volzin in
// hoeveel paragrafen die voorkomt. Alleen de leesstappen tellen mee: theorie
// (inclusief het uitgewerkte voorbeeld) en de samenvatting. De vaste
// instructieregels bij quiz, toets, game en opdracht zijn geen leesstof.
const MAX_BLOCKS_PER_KEY_TERM = 2;
const MAX_PARAGRAFEN_PER_SENTENCE = 3;

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
// Hetzelfde geldt voor de LANGSTE knop, en die truc is verraderlijker: een
// bouwer die het goede antwoord de volledige verklarende zin geeft ("..., want
// het opslaggeheugen hoort bij dat ene apparaat") en de afleiders kort laat
// ("Ctrl+C"), maakt zijn toets te halen zonder de stof te kennen. De
// positiecontrole hierboven ziet dat niet, want de posities kunnen prima
// gespreid zijn. Vandaar deze tweede blinde proef, met dezelfde beoordelaar.
// Bij vier opties is 25% toeval; 45% laat ruimte voor de gevallen waarin het
// goede antwoord nu eenmaal een woord langer uitvalt.
const MAX_BLIND_LONGEST_OPTION_SHARE = 0.45;
// Binnen één quiz of toets mag het nooit oplopen tot de 6-van-de-6 die dit
// ooit was: een leerling maakt één blok tegelijk, niet het gemiddelde.
const MAX_BLIND_LONGEST_OPTION_SHARE_PER_BLOCK = 0.6;
const MIN_MEERKEUZE_FOR_LENGTH_CHECK_PER_BLOCK = 5;
// Een losse vraag waarin het goede antwoord meer dan de helft langer is dan de
// langste afleider verklapt zichzelf, ook als het gemiddelde nog netjes is.
const MAX_CORRECT_OPTION_LENGTH_RATIO = 1.5;
const MIN_OPTION_LENGTH_FOR_RATIO_CHECK = 25;

const VRAAGWOORDEN =
  /^(wat|waarom|hoe|welke|welk|wanneer|wie|waardoor|waarmee|waarvoor|noem|leg|beschrijf|geef|vergelijk|verklaar|kies)\b/i;

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

// ---------------------------------------------------------------------------
// Eén leerweg controleren
// ---------------------------------------------------------------------------

const validateNiveau = (niveau) => {
  const problems = [];
  const gaps = [];
  const note = (message) => problems.push(message);
  const assertEqual = (actual, expected, label) => {
    if (actual !== expected) note(`${label}: expected ${expected}, got ${actual}`);
  };

  const plan = hoofdstukPlanVoorNiveau(niveau.id);
  const planParagrafen = new Map();
  const planHoofdstukVanCode = new Map();
  for (const chapter of plan) {
    for (const paragraaf of chapter.paragrafen) {
      planParagrafen.set(paragraaf.code, paragraaf);
      planHoofdstukVanCode.set(paragraaf.code, chapter.chapter);
    }
  }

  const hoofdstukken = (seed.hoofdstukken || []).filter((item) => item.niveauId === niveau.niveauId);
  const paragrafen = (seed.paragrafen || []).filter((item) => item.niveauId === niveau.niveauId);
  const contentBlocks = (seed.contentBlocks || []).filter((item) => item.niveauId === niveau.niveauId);
  const badges = (seed.badges || []).filter((item) => item.niveauId === niveau.niveauId);

  const geplandeParagrafen = plan.reduce((sum, chapter) => sum + chapter.codes.length, 0);
  const stats = {
    hoofdstukken: hoofdstukken.length,
    paragrafen: paragrafen.length,
    contentBlocks: contentBlocks.length,
    geplandeHoofdstukken: plan.length,
    geplandeParagrafen,
    optioneel: paragrafen.filter((item) => item.optioneel === true).length
  };

  if (paragrafen.length === 0) {
    gaps.push(
      `nog geen enkele paragraaf; het jaarplan noemt ${plan.length} hoofdstukken met ${geplandeParagrafen} paragrafen.`
    );
    return { niveau, problems, bevindingen: [], gaps, stats, enrichment: null, questionStats: null, leeg: true };
  }

  // Wat er nog ontbreekt volgens het jaarplan. Dat is geen fout in wat er staat,
  // maar wel een reden om de seed nog niet af te noemen.
  const aanwezigeChapters = new Set(hoofdstukken.map((item) => Number(item.number)));
  const ontbrekendeChapters = plan.filter((chapter) => !aanwezigeChapters.has(chapter.chapter));
  if (ontbrekendeChapters.length) {
    gaps.push(
      `${ontbrekendeChapters.length} van de ${plan.length} hoofdstukken ontbreekt nog ` +
        `(h${ontbrekendeChapters.map((chapter) => chapter.chapter).join(', h')}).`
    );
  }

  const aanwezigeCodes = new Set(paragrafen.map((item) => item.code));
  const ontbrekendeCodes = [...planParagrafen.keys()].filter(
    (code) => aanwezigeChapters.has(planHoofdstukVanCode.get(code)) && !aanwezigeCodes.has(code)
  );
  if (ontbrekendeCodes.length) {
    gaps.push(
      `${ontbrekendeCodes.length} paragra${ontbrekendeCodes.length === 1 ? 'af' : 'fen'} uit een bestaand hoofdstuk ` +
        `ontbreekt nog (${ontbrekendeCodes.join(', ')}).`
    );
  }

  const enrichment = { goals: 0, keyTerms: 0, examples: 0, summaries: 0, templateSummaries: 0 };
  const keyTermBlocks = new Map();
  const sentenceParagrafen = new Map();

  const paragraafById = new Map(paragrafen.map((item) => [item.id, item]));

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
      note(`${block.id} has an empty or non-array keyTerms`);
      return;
    }
    if (keyTerms.length > 4) {
      note(`${block.id} has ${keyTerms.length} keyTerms; maximaal 4 per blok`);
    }
    for (const term of keyTerms) {
      if (!containsTerm(text, term)) {
        note(`${block.id} keyTerm "${term}" komt niet als los woord in de eigen bloktekst voor`);
      }
      registerKeyTerm(term, block.id);
    }
  };

  const blocksByParagraaf = new Map();
  for (const block of contentBlocks) {
    if (!blocksByParagraaf.has(block.paragraafId)) blocksByParagraaf.set(block.paragraafId, []);
    blocksByParagraaf.get(block.paragraafId).push(block);

    if (block.settings?.allowMathToolbox !== false) {
      note(`${block.id} enables math toolbox`);
    }

    // De startcheck is de uitzondering. Startvragen horen vóór de uitleg, en de
    // blauwdruk zet de Digidocent daar bewust uit: hulp tijdens de poging kan
    // precies het mechanisme ondermijnen dat de winst oplevert. De uitleg komt
    // uit het blok zelf, ná het antwoord. Een startcheck zonder eigen antwoorden
    // is nog gewoon een oefenblok en houdt de Digidocent dus wel aan.
    // Sinds het oefenen in aparte blokken per groep staat geldt hetzelfde voor
    // stap 5 en 6 van de blauwdruk: bij `samen` en `steun` mag de Digidocent
    // meedenken, bij `zelf` en `plus` staat hij uit. Een diagnose of deeltoets
    // met hulp meet niet meer wat de leerling zelf weet, dus dat is geen
    // vergeten instelling maar het punt van dat blok.
    const zonderDigidocent =
      block.type === 'question' && /-question-(check|oefenen-(zelf|plus))$/.test(String(block.id));
    if (['question', 'quiz'].includes(block.type) && block.settings?.allowAiHelp !== true && !zonderDigidocent) {
      note(`${block.id} should enable Digidocent`);
    }

    if (block.type === 'toets' && block.settings?.allowAiHelp !== false) {
      note(`${block.id} should disable Digidocent for toets/eindtoets`);
    }

    if (block.type === 'media') {
      const mediaKind = block.content?.mediaKind;
      const mediaUrl = block.content?.mediaUrl || '';
      if (!Object.values(MEDIA_KINDS).includes(mediaKind)) {
        note(`${block.id} has unsupported mediaKind ${mediaKind}`);
      }
      if (mediaKind === MEDIA_KINDS.YOUTUBE && !parseYouTubeUrl(mediaUrl)) {
        note(`${block.id} marks a non-YouTube URL as youtube`);
      }
      if (mediaUrl && mediaKind === MEDIA_KINDS.IMAGE && !/\.(png|jpe?g|webp|gif)($|[?#])/i.test(mediaUrl)) {
        note(`${block.id} marks a non-image URL as image`);
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
          note(`${block.id} has an exampleHtml without readable text`);
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
      if (!text) note(`${block.id} has an empty summary`);

      // Kerndoelcodes zijn docentmetadata en horen op het blok, niet in de
      // leestekst die de leerling vlak voor de quiz of toets leest.
      if (/kerndoel/i.test(text)) {
        note(`${block.id} noemt kerndoelen in de leerlingtekst; die horen in content.kerndoelen`);
      }
      if (!Array.isArray(block.content?.kerndoelen) || block.content.kerndoelen.length === 0) {
        note(`${block.id} mist content.kerndoelen als docentmetadata`);
      }

      // Zolang de verrijking van een hoofdstuk nog niet gevuld is, blijft de ene
      // sjabloonregel staan. Elke samenvatting die daarvan afwijkt is verrijkte
      // lesstof en moet dus ook kernbegrippen hebben.
      const templateText = `Je werkte aan: ${paragraaf?.product || ''}.`;
      if (text === templateText) {
        if (block.content?.keyTerms !== undefined) {
          note(`${block.id} heeft kernbegrippen maar nog wel de sjabloontekst`);
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
      note(`${block.id} leaks internal source metadata to visible content`);
    }
  }

  // De leerdoelen van een vrijwillige plusparagraaf, per hoofdstuk. Een
  // hoofdstuktoets mag daar geen vraag aan hangen: wie de plus overslaat mag
  // niets missen dat later getoetst wordt.
  const optioneleLeerdoelenPerHoofdstuk = new Map();
  for (const paragraaf of paragrafen) {
    if (paragraaf.optioneel !== true) continue;
    if (!optioneleLeerdoelenPerHoofdstuk.has(paragraaf.hoofdstukId)) {
      optioneleLeerdoelenPerHoofdstuk.set(paragraaf.hoofdstukId, new Map());
    }
    for (const goal of paragraaf.learningGoals || []) {
      optioneleLeerdoelenPerHoofdstuk.get(paragraaf.hoofdstukId).set(String(goal).trim().toLowerCase(), paragraaf.code);
    }
  }

  let checkpointCount = 0;
  const checkpointCodes = [];
  // Ontbrekende games worden gebundeld: één regel per leerweg leest beter dan
  // vijftig losse regels die allemaal hetzelfde zeggen.
  const ontbrekendeGames = [];

  for (const paragraaf of paragrafen) {
    const blocks = (blocksByParagraaf.get(paragraaf.id) || []).sort((a, b) => a.order - b.order);
    if (blocks.length === 0) {
      note(`${paragraaf.code} has no blocks`);
      continue;
    }
    assertEqual(blocks[0].type, 'slidedeck', `${paragraaf.code} first block`);

    const planParagraaf = planParagrafen.get(paragraaf.code);
    if (!planParagraaf) {
      note(`${paragraaf.code} staat niet in het jaarplan van deze leerweg`);
    }
    const isCheckpoint = planParagraaf ? planParagraaf.checkpoint === true : blocks.some((block) => block.type === 'toets');
    if (isCheckpoint) {
      checkpointCount += 1;
      checkpointCodes.push(paragraaf.code);
    }

    // Optioneel en verplicht zijn elkaars tegendeel; twee velden die iets
    // anders zeggen laten de app raden wat er telt.
    const optioneel = paragraaf.optioneel === true;
    if (paragraaf.optioneel === undefined || paragraaf.verplicht === undefined) {
      note(`${paragraaf.code} mist optioneel/verplicht; elke paragraaf zegt of hij meetelt`);
    } else if (paragraaf.verplicht === optioneel) {
      note(`${paragraaf.code} heeft optioneel: ${paragraaf.optioneel} én verplicht: ${paragraaf.verplicht}`);
    }
    if (optioneel && isCheckpoint) {
      note(`${paragraaf.code} is een hoofdstuktoets en kan niet optioneel zijn`);
    }
    if (planParagraaf && planParagraaf.optioneel !== optioneel) {
      note(
        `${paragraaf.code} staat op optioneel: ${optioneel}, het jaarplan zegt ${planParagraaf.optioneel} ` +
          '(alleen de plusparagraaf van de theoretische leerweg is vrijwillig)'
      );
    }

    const lastTypes = blocks.slice(-3).map((block) => block.type).join(' -> ');
    const expectedAssessment = isCheckpoint ? 'toets' : 'quiz';
    assertEqual(lastTypes, `summary -> ${expectedAssessment} -> game`, `${paragraaf.code} final route`);

    const assessmentBlocks = blocks.filter((block) => block.type === 'quiz' || block.type === 'toets');
    assertEqual(assessmentBlocks.length, 1, `${paragraaf.code} assessment block count`);
    if (assessmentBlocks[0]) assertEqual(assessmentBlocks[0].type, expectedAssessment, `${paragraaf.code} assessment type`);

    const learningGoals = paragraaf.learningGoals;
    if (learningGoals !== undefined) {
      if (!Array.isArray(learningGoals) || learningGoals.length < 2 || learningGoals.length > 3) {
        note(`${paragraaf.code} needs 2 or 3 learningGoals, got ${learningGoals?.length}`);
      } else {
        for (const goal of learningGoals) {
          if (!/^Je (weet|kunt) /.test(String(goal || ''))) {
            note(`${paragraaf.code} learningGoal moet met "Je weet" of "Je kunt" beginnen: "${goal}"`);
          }
        }
      }
      enrichment.goals += 1;
    }

    const totalTokens = blocks.reduce((sum, block) => sum + Number(block.tokenTotal || 0), 0);
    assertEqual(totalTokens, paragraaf.totalTokens, `${paragraaf.code} token total`);

    const gameBlock = blocks.at(-1);
    if (gameBlock.type !== 'game') {
      note(`${paragraaf.code} last block is not game`);
    } else if (!gameBlock.content?.gameId) {
      note(`${paragraaf.code} missing gameId`);
    } else if (!getGameById(gameBlock.content.gameId)) {
      ontbrekendeGames.push(`${paragraaf.code} -> ${gameBlock.content.gameId}`);
    }
  }

  if (ontbrekendeGames.length) {
    note(
      `${ontbrekendeGames.length} gameId('s) staan niet in GAME_REGISTRY (src/lib/gameRegistry.js): ` +
        `${summarizeLabels(ontbrekendeGames, 8)}`
    );
  }

  // Een badge hoort de vrijwillige plusparagraaf niet te eisen: dan is hij niet
  // vrijwillig meer.
  const optioneleIds = new Set(paragrafen.filter((item) => item.optioneel === true).map((item) => item.id));
  for (const badge of badges) {
    const verplichtGemaakt = (badge.requiredParagrafen || []).filter((id) => optioneleIds.has(id));
    if (verplichtGemaakt.length) {
      note(`${badge.id} eist de optionele paragra(a)f(en) ${verplichtGemaakt.join(', ')}`);
    }
  }

  // Een kernbegrip dat overal terugkomt is geen kernbegrip meer, maar een
  // gewoon woord dat toevallig vet staat.
  const overusedTerms = [...keyTermBlocks.entries()].filter(([, blockIds]) => blockIds.length > MAX_BLOCKS_PER_KEY_TERM);
  for (const [term, blockIds] of overusedTerms) {
    note(
      `kernbegrip mag in maximaal ${MAX_BLOCKS_PER_KEY_TERM} blokken staan: ` +
        `"${term}" in ${blockIds.length} blokken (${summarizeLabels(blockIds)})`
    );
  }

  // Dezelfde zin in paragraaf na paragraaf is sjabloontekst, geen lesstof.
  const repeatedSentences = [...sentenceParagrafen.entries()].filter(([, codes]) => codes.size > MAX_PARAGRAFEN_PER_SENTENCE);
  for (const [sentence, codes] of repeatedSentences) {
    note(
      `dezelfde volzin mag in maximaal ${MAX_PARAGRAFEN_PER_SENTENCE} paragrafen staan: ` +
        `"${sentence}" in ${codes.size} paragrafen (${[...codes].join(', ')})`
    );
  }

  // -------------------------------------------------------------------------
  // Toetsvragen
  //
  // De generator dwingt deze regels al af, maar hij is niet de enige schrijver:
  // een vraag kan ook uit de CMS-editor komen of met de hand in de seed-JSON
  // gezet zijn. Daarom controleert de validator ze hier nog een keer, en wel op
  // het GENORMALISEERDE item (normalizeAssessmentItem) - precies het item dat de
  // leerlingroute en de beoordelaar te zien krijgen. Staat er onzin in
  // `answer.options` terwijl `options` er netjes uitziet, dan valt dat hier om.
  // -------------------------------------------------------------------------

  const feedbackItems = new Map(); // feedbackzin -> itemlabels
  const optionTextItems = new Map(); // optietekst -> itemlabels
  const correctPositions = new Map(); // positie (1-based) -> aantal meerkeuzevragen
  const blindResults = { closed: 0, correct: 0 };
  // Tweede blinde proef: steeds de LANGSTE knop klikken. Per blok geteld, zodat
  // één quiz die volledig op tekstlengte te raden is niet wegvalt tegen het
  // gemiddelde van de hele leerweg.
  const langsteResults = { closed: 0, correct: 0 };
  const langstePerBlock = new Map(); // bloklabel -> { closed, correct }
  const questionStats = { blocks: 0, drafts: 0, items: 0, closed: 0, open: 0, waarNietWaar: 0 };
  const draftParagrafen = [];

  for (const block of contentBlocks) {
    if (block.type !== 'quiz' && block.type !== 'toets') continue;

    const paragraaf = paragraafById.get(block.paragraafId);
    const code = paragraaf?.code || block.paragraafId;
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
        note(`${blockLabel}: staat op status "${block.status}" zonder vragen; een leeg toetsblok hoort op draft`);
      }
      continue;
    }

    questionStats.blocks += 1;
    if (block.status !== 'published') {
      note(`${blockLabel}: heeft ${rawItems.length} vragen maar staat op status "${block.status}"`);
    }

    const minItems = MIN_ASSESSMENT_ITEMS[block.type] ?? MIN_ASSESSMENT_ITEMS.quiz;
    if (rawItems.length < minItems) {
      note(`${blockLabel}: een ${block.type} heeft minstens ${minItems} vragen nodig, kreeg ${rawItems.length}`);
    }

    const verbodenLeerdoelen =
      block.type === 'toets' ? optioneleLeerdoelenPerHoofdstuk.get(block.hoofdstukId) || new Map() : new Map();

    const items = rawItems.map((item, index) => normalizeAssessmentItem(item, index));
    if (items.length > 0 && items.every((item) => item.type === 'open')) {
      note(`${blockLabel}: alleen open vragen; een quiz of toets heeft ook nakijkbare gesloten vragen nodig`);
    }

    items.forEach((item, index) => {
      const label = `${blockLabel} vraag ${index + 1}`;
      questionStats.items += 1;

      // Een lege vraagtekst, een open vraag zonder modelAnswer en een gesloten
      // vraag zonder (of met alleen maar) goede antwoorden zijn MECHANISCHE
      // fouten; die staan sinds deze ronde in src/lib/seedMechanischeControles.js
      // (controle 5) zodat ze los te testen zijn. Ze worden daar even hard
      // gemeld als hier; hier is alleen de dubbele melding weg.
      const prompt = String(item.prompt || '').trim();

      // De vrijwillige plusparagraaf is geen voorwaarde om verder te mogen; een
      // hoofdstuktoets die hem bevraagt maakt hem alsnog verplicht.
      const leerdoel = String(rawItems[index]?.taxonomy?.learningGoal || rawItems[index]?.leerdoel || '')
        .trim()
        .toLowerCase();
      if (leerdoel && verbodenLeerdoelen.has(leerdoel)) {
        note(
          `${label}: hangt aan een leerdoel van de optionele paragraaf ${verbodenLeerdoelen.get(leerdoel)}; ` +
            'een hoofdstuktoets gaat nooit over een vrijwillige plusparagraaf'
        );
      }

      // Elke vraag legt zijn eigen ding uit. Een sjabloonzin die overal onder
      // staat leert niets; dat was de "Bespreek kort waarom..."-regel.
      const feedback = String(item.feedback || '').trim();
      if (feedback.length < MIN_FEEDBACK_LENGTH) {
        note(`${label}: feedback ontbreekt of is te kort (${feedback.length} tekens, minstens ${MIN_FEEDBACK_LENGTH} nodig)`);
      } else {
        registerToMap(feedbackItems, feedback.toLowerCase(), label);
      }

      if (item.type === 'open') {
        questionStats.open += 1;
        // Het ontbrekende modelAnswer meldt controle 5 in
        // src/lib/seedMechanischeControles.js; de nakijkpunten staan hier.
        const nakijkpunten = countNakijkpunten(item.answer?.rubric);
        if (nakijkpunten < MIN_NAKIJKPUNTEN) {
          note(
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
        note(
          `${label}: staat als waar-niet-waar in de seed maar heeft niet de twee opties Waar en Niet waar (${options
            .map((option) => `"${option.text}"`)
            .join(', ')})`
        );
      }
      if (!vastPaar && options.length < MIN_CLOSED_OPTIONS) {
        note(`${label}: een gesloten vraag heeft minstens ${MIN_CLOSED_OPTIONS} antwoordopties nodig, kreeg ${options.length}`);
      }

      // Een vraagzin is geen stelling. "Welk onderdeel is software?" met alleen
      // Waar/Niet waar eronder is niet te beantwoorden.
      if (item.type === 'waar-niet-waar') {
        if (VRAAGWOORDEN.test(prompt)) {
          note(`${label}: "${prompt.slice(0, 48)}..." begint met een vraagwoord en kan geen waar-niet-waar zijn`);
        } else if (prompt.endsWith('?')) {
          note(`${label}: een waar-niet-waar-vraag is een stelling, geen vraagzin`);
        }
      }

      // Een vraag zonder goed antwoord, met alleen maar goede antwoorden of met
      // een lege optietekst wordt door de app stil gerepareerd. Die drie leest
      // controle 5 in src/lib/seedMechanischeControles.js op de RUWE seedopties
      // na; hier blijft alleen wat daar niet in past.
      const rawItem = rawItems[index] || {};

      const texts = options.map((option) => option.text.toLowerCase());
      if (new Set(texts).size !== texts.length) note(`${label}: dezelfde antwoordoptie staat er twee keer in`);
      for (const text of new Set(texts)) {
        if (!text || vastPaar) continue;
        registerToMap(optionTextItems, text, label);
      }

      // `options` en `answer.options` moeten hetzelfde zeggen. De beoordelaar
      // leest `answer`; wie alleen `options` bijwerkt, verandert niets aan wat
      // er fout of goed gerekend wordt.
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
          note(`${label}: item.options en answer.options verschillen; de beoordelaar gebruikt answer.options`);
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

      // Dezelfde proef, maar nu met de LANGSTE knop. Waar-niet-waar valt hier
      // buiten: die twee teksten liggen vast en zeggen niets over de bouwer.
      if (!vastPaar && options.length >= MIN_CLOSED_OPTIONS) {
        const lengtes = options.map((option) => option.text.length);
        const langsteLengte = Math.max(...lengtes);
        const langste = options[lengtes.indexOf(langsteLengte)];
        langsteResults.closed += 1;
        const blokScore = langstePerBlock.get(blockLabel) || { closed: 0, correct: 0 };
        blokScore.closed += 1;
        const langsteResult = gradeAssessmentItemAnswer({ item, answer: langste.id });
        if (langsteResult?.isCorrect === true) {
          langsteResults.correct += 1;
          blokScore.correct += 1;
        }
        langstePerBlock.set(blockLabel, blokScore);

        // En de vraag op zichzelf: is het goede antwoord meer dan de helft
        // langer dan de langste afleider, dan verklapt de vraag zichzelf.
        const goede = options.find((option) => option.correct === true);
        if (goede) {
          const afleiders = options.filter((option) => option !== goede).map((option) => option.text.length);
          const langsteAfleider = Math.max(0, ...afleiders);
          if (
            goede.text.length >= MIN_OPTION_LENGTH_FOR_RATIO_CHECK &&
            langsteAfleider > 0 &&
            goede.text.length / langsteAfleider > MAX_CORRECT_OPTION_LENGTH_RATIO
          ) {
            note(
              `${label}: het goede antwoord is ${goede.text.length} tekens en de langste afleider ${langsteAfleider}; ` +
                `dat verklapt zichzelf op lengte (grens ${MAX_CORRECT_OPTION_LENGTH_RATIO}x). ` +
                'Zet de redengevende bijzin in explanation of maak de afleiders even lang.'
            );
          }
        }
      }
    });
  }

  const duplicateFeedback = [...feedbackItems.entries()].filter(([, labels]) => labels.length > 1);
  for (const [feedback, labels] of duplicateFeedback) {
    note(
      `dezelfde feedbackzin staat bij ${labels.length} vragen (${summarizeLabels(labels)}): ` +
        `"${feedback.slice(0, 60)}${feedback.length > 60 ? '...' : ''}"`
    );
  }

  const overusedOptions = [...optionTextItems.entries()].filter(([, labels]) => labels.length > MAX_ITEMS_PER_OPTION_TEXT);
  for (const [text, labels] of overusedOptions) {
    note(
      `antwoordoptie "${text}" staat in ${labels.length} vragen; ` +
        `maximaal ${MAX_ITEMS_PER_OPTION_TEXT} (${summarizeLabels(labels)})`
    );
  }

  const positionTotal = [...correctPositions.values()].reduce((sum, count) => sum + count, 0);
  if (positionTotal >= MIN_MEERKEUZE_FOR_POSITION_CHECK) {
    for (const [position, count] of [...correctPositions.entries()].sort((a, b) => a[0] - b[0])) {
      const share = count / positionTotal;
      if (share > MAX_SAME_POSITION_SHARE) {
        note(
          `het goede antwoord staat in ${count} van de ${positionTotal} meerkeuzevragen op positie ${position} ` +
            `(${Math.round(share * 100)}%); maximaal ${Math.round(MAX_SAME_POSITION_SHARE * 100)}%`
        );
      }
    }
  }

  const langsteShare = langsteResults.closed > 0 ? langsteResults.correct / langsteResults.closed : 0;
  if (langsteResults.closed > 0 && langsteShare > MAX_BLIND_LONGEST_OPTION_SHARE) {
    note(
      `blind de langste knop klikken levert ${langsteResults.correct}/${langsteResults.closed} goed ` +
        `(${Math.round(langsteShare * 100)}%); maximaal ${Math.round(MAX_BLIND_LONGEST_OPTION_SHARE * 100)}%. ` +
        'Het goede antwoord krijgt te vaak de volledige verklarende zin terwijl de afleiders kort blijven.'
    );
  }
  for (const [blokLabel, score] of langstePerBlock.entries()) {
    if (score.closed < MIN_MEERKEUZE_FOR_LENGTH_CHECK_PER_BLOCK) continue;
    const share = score.correct / score.closed;
    if (share > MAX_BLIND_LONGEST_OPTION_SHARE_PER_BLOCK) {
      note(
        `${blokLabel}: blind de langste knop klikken levert hier ${score.correct}/${score.closed} goed ` +
          `(${Math.round(share * 100)}%); maximaal ${Math.round(MAX_BLIND_LONGEST_OPTION_SHARE_PER_BLOCK * 100)}% per blok`
      );
    }
  }

  // Waar/Niet waar heeft maar twee knoppen, dus daar is 40% rekenkundig
  // onhaalbaar; die balans wordt alleen gerapporteerd.
  const blindShare = blindResults.closed > 0 ? blindResults.correct / blindResults.closed : 0;
  if (blindResults.closed > 0 && blindShare > MAX_BLIND_TOP_BUTTON_SHARE) {
    note(
      `blind de bovenste knop klikken levert ${blindResults.correct}/${blindResults.closed} goed ` +
        `(${Math.round(blindShare * 100)}%); een gesloten vraag hoort gelezen te moeten worden`
    );
  }

  // Elke paragraaf heeft precies één slidedeck, één game en één quiz of toets.
  assertEqual(contentBlocks.filter((block) => block.type === 'game').length, paragrafen.length, 'game block count');
  assertEqual(contentBlocks.filter((block) => block.type === 'slidedeck').length, paragrafen.length, 'slidedeck block count');
  assertEqual(contentBlocks.filter((block) => block.type === 'toets').length, checkpointCount, 'toets block count');
  assertEqual(
    contentBlocks.filter((block) => block.type === 'quiz').length,
    paragrafen.length - checkpointCount,
    'quiz block count'
  );
  assertEqual(badges.length, hoofdstukken.length, 'badge count');

  if (draftParagrafen.length) {
    gaps.push(`${draftParagrafen.length} quiz- of toetsblok(ken) zonder vragen:`);
    for (const draft of draftParagrafen) gaps.push(`  ${draft}`);
  }

  // -------------------------------------------------------------------------
  // De zes mechanische controles. Ze staan in src/lib/seedMechanischeControles.js
  // zodat ze los te testen zijn (src/lib/seedMechanischeControles.test.js), maar
  // ze tellen hier gewoon als fout mee: de validator eindigt met exit 1 zodra er
  // één bevinding is.
  // -------------------------------------------------------------------------
  const bevindingen = mechanischeControles({
    niveau: niveau.id,
    paragrafen,
    contentBlocks,
    checkpointCodes
  });

  return {
    niveau,
    problems,
    bevindingen,
    gaps,
    stats,
    enrichment,
    questionStats,
    keyTermBlocks,
    feedbackItems,
    correctPositions,
    blindResults,
    blindShare,
    langsteResults,
    langsteShare,
    leeg: false
  };
};

// ---------------------------------------------------------------------------
// Rapport per leerweg
// ---------------------------------------------------------------------------

const resultaten = NIVEAUS.map((niveau) => validateNiveau(niveau));

console.log(
  `${(seed.contentBlocks || []).length} blocks checked across ${(seed.paragrafen || []).length} paragrafen ` +
    `in ${(seed.niveaus || []).length} leerwegen.`
);

for (const resultaat of resultaten) {
  const { niveau, stats } = resultaat;
  console.log('');
  console.log(`${niveau.id} - ${niveau.label}`);

  if (resultaat.leeg) {
    console.log(`  ${resultaat.gaps[0]}`);
    continue;
  }

  console.log(
    `  ${stats.hoofdstukken}/${stats.geplandeHoofdstukken} hoofdstukken, ` +
      `${stats.paragrafen}/${stats.geplandeParagrafen} paragrafen (${stats.optioneel} vrijwillig), ` +
      `${stats.contentBlocks} contentblokken.`
  );
  console.log(
    `  Verrijking: ${resultaat.enrichment.goals}/${stats.paragrafen} paragrafen met leerdoelen, ` +
      `${resultaat.enrichment.keyTerms}/${stats.paragrafen * 2} theorieblokken met kernbegrippen, ` +
      `${resultaat.enrichment.examples}/${stats.paragrafen * 2} met uitgewerkt voorbeeld, ` +
      `${resultaat.enrichment.summaries}/${stats.paragrafen} verrijkte samenvattingen ` +
      `(${resultaat.enrichment.templateSummaries} nog sjabloon).`
  );
  console.log(
    `  ${resultaat.keyTermBlocks.size} unieke kernbegrippen, ` +
      `hoogste hergebruik ${Math.max(0, ...[...resultaat.keyTermBlocks.values()].map((blockIds) => blockIds.length))} blokken.`
  );

  const positieVerdeling = [...resultaat.correctPositions.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([position, count]) => `pos${position}: ${count}`)
    .join(', ');
  console.log(
    `  Toetsvragen: ${resultaat.questionStats.blocks}/${stats.paragrafen} blokken met vragen ` +
      `(${resultaat.questionStats.drafts} nog draft), ${resultaat.questionStats.items} vragen ` +
      `(${resultaat.questionStats.closed} gesloten waarvan ${resultaat.questionStats.waarNietWaar} waar-niet-waar, ` +
      `${resultaat.questionStats.open} open).`
  );
  console.log(
    `  Goed antwoord in meerkeuzevragen: ${positieVerdeling || 'geen'}; ` +
      `blind de bovenste knop klikken geeft ${resultaat.blindResults.correct}/${resultaat.blindResults.closed} goed ` +
      `(${Math.round(resultaat.blindShare * 100)}%, grens ${Math.round(MAX_BLIND_TOP_BUTTON_SHARE * 100)}%); ` +
      `blind de langste knop klikken geeft ${resultaat.langsteResults.correct}/${resultaat.langsteResults.closed} goed ` +
      `(${Math.round(resultaat.langsteShare * 100)}%, grens ${Math.round(MAX_BLIND_LONGEST_OPTION_SHARE * 100)}%); ` +
      `${resultaat.feedbackItems.size} unieke feedbackzinnen op ${resultaat.questionStats.items} vragen.`
  );

  // De zes mechanische controles, per hoofdstuk. Een bouwer die hoofdstuk 4
  // onder handen heeft, moet niet door honderd regels van andere hoofdstukken
  // hoeven te lezen om te zien wat zijn hoofdstuk mankeert.
  const telling = telBevindingen(resultaat.bevindingen);
  const soortSleutels = Object.keys(CONTROLE_SOORTEN);
  console.log(
    `  Mechanische controles: ${telling.totaal} bevinding(en) ` +
      `(${soortSleutels.map((soort) => `${CONTROLE_SOORTEN[soort]} ${telling.perSoort.get(soort) || 0}`).join(', ')}).`
  );

  if (telling.totaal) {
    for (const hoofdstuk of [...telling.perHoofdstuk.keys()].sort((a, b) => a - b)) {
      const perSoort = telling.perHoofdstuk.get(hoofdstuk);
      const totaalHoofdstuk = [...perSoort.values()].reduce((sum, aantal) => sum + aantal, 0);
      console.log(
        `    h${hoofdstuk}: ${totaalHoofdstuk} ` +
          `(${soortSleutels
            .filter((soort) => perSoort.get(soort))
            .map((soort) => `${CONTROLE_SOORTEN[soort]} ${perSoort.get(soort)}`)
            .join(', ')})`
      );
      for (const bevinding of resultaat.bevindingen.filter((item) => item.hoofdstuk === hoofdstuk)) {
        console.log(`      - ${bevinding.melding}`);
      }
    }
  }

  if (resultaat.problems.length) {
    console.log(`  Fout in bestaande inhoud (${resultaat.problems.length}):`);
    for (const problem of resultaat.problems) console.log(`    - ${problem}`);
  }
  if (resultaat.gaps.length) {
    console.log(`  Nog niet af:`);
    for (const gap of resultaat.gaps) console.log(`    - ${gap}`);
  }
}

// De zes mechanische controles zijn HARD: één bevinding is één fout, en de
// validator eindigt dan met een foutcode. Ze tellen apart van `problems` zodat
// het rapport ze per hoofdstuk kan groeperen, maar in het eindoordeel wegen ze
// precies even zwaar.
const totaalMechanisch = resultaten.reduce((sum, resultaat) => sum + resultaat.bevindingen.length, 0);
const totaalProblemen =
  globalProblems.length +
  totaalMechanisch +
  resultaten.reduce((sum, resultaat) => sum + resultaat.problems.length, 0);
const totaalGaten = resultaten.reduce((sum, resultaat) => sum + resultaat.gaps.length, 0);

if (globalProblems.length) {
  console.error('');
  console.error(`Over alle leerwegen heen (${globalProblems.length}):`);
  for (const problem of globalProblems) console.error(`  - ${problem}`);
}

if (totaalProblemen > 0 || totaalGaten > 0) {
  console.error('');
  console.error(
    `Digitale vaardigheden seed NIET valid: ${totaalProblemen} fout(en) waarvan ${totaalMechanisch} mechanisch, ` +
      `${totaalGaten} onderde(e)l(en) nog niet af. ` +
      `Per leerweg: ${resultaten
        .map(
          (resultaat) =>
            `${resultaat.niveau.id} ${resultaat.problems.length}+${resultaat.bevindingen.length}/${resultaat.gaps.length}`
        )
        .join(', ')} (fouten+mechanisch/nog niet af).`
  );
  process.exit(1);
}

console.log('');
console.log('Digitale vaardigheden seed valid voor alle drie de leerwegen.');
