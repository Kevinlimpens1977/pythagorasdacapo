import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { html, gameIdForTitle, mediaKindForUrl } from './seed-structuur/helpers.mjs';
import { NIVEAUS, hoofdstukPlanVoorNiveau } from './seed-structuur/jaarplan.mjs';

const outputPath = path.resolve('docs/seeds/digitale-vaardigheden-vmbo1.seed.json');

// DRIE LEERWEGEN NAAST ELKAAR
// ---------------------------
// Digitale geletterdheid wordt gevuld voor basis (bb), kader (kb) en
// theoretisch (tl): dezelfde onderwerpen, een ander taalniveau en een andere
// vorm. Elke leerweg heeft een eigen map met hoofdstukbestanden en een eigen map
// met verrijking:
//
//   scripts/seed-structuur/<niveau>/h<n>.mjs   structuur en lesstof
//   scripts/seed-verrijking/<niveau>/*.mjs     leerdoelen, voorbeelden, vragen
//
// Per leerweg wordt ALLES geladen wat er in de map staat, gesorteerd op
// hoofdstuknummer. Een ontbrekend hoofdstukbestand wordt overgeslagen met een
// waarschuwing; de generator stopt daar niet op. Zo kunnen meerdere mensen
// tegelijk aan verschillende hoofdstukken en leerwegen werken.
//
// Welke paragrafen bij welke leerweg horen staat in
// scripts/seed-structuur/jaarplan.mjs. Die lijst dient alleen om te melden wat
// er nog ontbreekt; wat er in de seed komt, komt uit de bestanden zelf.
const structureRoot = path.resolve('scripts/seed-structuur');
const enrichmentRoot = path.resolve('scripts/seed-verrijking');

const VAK_ID = 'vak-digitale-vaardigheden';
const LEERJAAR_ID = 'leerjaar-digitale-vaardigheden-vmbo1';

// Alle id's dragen de leerweg in hun sleutel, anders botsen bb, kb en tl op
// elkaar: drie keer een paragraaf 2.3 in hetzelfde vak en hetzelfde leerjaar.
const niveauDocId = (niveau) => `niveau-dv-vmbo1-${niveau}`;
const hoofdstukDocId = (niveau, chapter) => `hoofdstuk-dv-${niveau}-h${chapter}`;
const paragraafDocId = (niveau, code) => `paragraaf-dv-${niveau}-${String(code).replace('.', '-')}`;
const blockIdPrefix = (niveau, code) => `dv-${niveau}-${String(code).replace('.', '-')}`;
const badgeDocId = (niveau, chapter) => `badge-dv-${niveau}-h${chapter}`;

const waarschuwingen = [];
const waarschuw = (niveau, message) => {
  waarschuwingen.push(`[${niveau}] ${message}`);
  console.warn(`[${niveau}] ${message}`);
};

// Alleen h<cijfers>.mjs in de map van de leerweg zelf. Onderliggende mappen en
// losse hulpbestanden vallen er dus buiten.
const chapterFiles = (niveau) => {
  const dir = path.join(structureRoot, niveau);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .map((name) => ({ name, match: /^h(\d+)\.mjs$/.exec(name) }))
    .filter((entry) => entry.match && fs.statSync(path.join(dir, entry.name)).isFile())
    .map((entry) => ({ number: Number(entry.match[1]), name: entry.name, file: path.join(dir, entry.name) }))
    .sort((a, b) => a.number - b.number);
};

const loadChapters = async (niveau) => {
  const files = chapterFiles(niveau);
  const gevonden = new Set(files.map((entry) => entry.number));
  const plan = hoofdstukPlanVoorNiveau(niveau);
  const chapters = [];

  // Is er nog helemaal niets voor deze leerweg, dan is één regel genoeg; acht
  // losse waarschuwingen zeggen dan niet meer dan die ene.
  if (files.length === 0) {
    waarschuw(
      niveau,
      `Nog geen enkel hoofdstukbestand in scripts/seed-structuur/${niveau}/; het jaarplan noemt ` +
        `${plan.length} hoofdstukken met ${plan.reduce((sum, item) => sum + item.codes.length, 0)} paragrafen.`
    );
  } else {
    for (const planned of plan) {
      if (gevonden.has(planned.chapter)) continue;
      waarschuw(
        niveau,
        `Hoofdstuk ${planned.chapter} (${planned.title}, ${planned.codes.length} paragrafen) overgeslagen: ` +
          `scripts/seed-structuur/${niveau}/h${planned.chapter}.mjs bestaat nog niet.`
      );
    }
  }

  for (const entry of files) {
    try {
      const module = await import(pathToFileURL(entry.file).href);
      const chapter = module.default;
      if (!chapter || typeof chapter !== 'object' || !Array.isArray(chapter.paragraphs)) {
        waarschuw(niveau, `Hoofdstuk ${entry.name} overgeslagen: default export is geen hoofdstukobject met paragraphs.`);
        continue;
      }

      const nummer = Number(chapter.chapter ?? entry.number);
      if (nummer !== entry.number) {
        waarschuw(
          niveau,
          `Hoofdstuk ${entry.name} overgeslagen: het bestand zegt chapter ${chapter.chapter}, de bestandsnaam zegt ${entry.number}.`
        );
        continue;
      }

      const planned = plan.find((item) => item.chapter === nummer);
      if (planned) {
        if (chapter.paragraphs.length !== planned.codes.length) {
          waarschuw(
            niveau,
            `Hoofdstuk ${entry.name} heeft ${chapter.paragraphs.length} paragrafen, het jaarplan noemt er ${planned.codes.length} ` +
              `(${planned.codes.join(', ')}).`
          );
        }

        for (const paragraph of chapter.paragraphs) {
          const planParagraph = planned.paragrafen.find((item) => item.code === paragraph.code);
          if (!planParagraph) {
            waarschuw(niveau, `Hoofdstuk ${entry.name}: paragraaf ${paragraph.code} staat niet in het jaarplan van deze leerweg.`);
            continue;
          }
          // Een plusparagraaf die niet als optioneel gemarkeerd is telt gewoon
          // mee in het hoofdstuk, en dat is precies niet de bedoeling.
          if (planParagraph.optioneel && paragraph.optioneel !== true) {
            waarschuw(
              niveau,
              `Hoofdstuk ${entry.name}: ${paragraph.code} is volgens het jaarplan een vrijwillige plusparagraaf, ` +
                'maar staat niet op { optioneel: true }.'
            );
          }
          if (!planParagraph.optioneel && paragraph.optioneel === true) {
            waarschuw(
              niveau,
              `Hoofdstuk ${entry.name}: ${paragraph.code} staat op { optioneel: true }, maar hoort volgens het jaarplan ` +
                'gewoon bij de leerlijn.'
            );
          }
        }
      }

      const laatsteVerplichte = chapter.paragraphs.findLastIndex((paragraph) => paragraph.optioneel !== true);
      const eersteOptionele = chapter.paragraphs.findIndex((paragraph) => paragraph.optioneel === true);
      if (eersteOptionele >= 0 && eersteOptionele < laatsteVerplichte) {
        waarschuw(
          niveau,
          `Hoofdstuk ${entry.name}: ${chapter.paragraphs[eersteOptionele].code} is optioneel maar staat vóór verplichte ` +
            'paragrafen; een plusparagraaf hoort achteraan, na het checkpoint.'
        );
      }

      chapters.push({ ...chapter, chapter: nummer, niveau });
    } catch (error) {
      waarschuw(niveau, `Hoofdstuk ${entry.name} overgeslagen: ${error.message}`);
    }
  }

  return chapters;
};

// Verrijkingslaag: leerdoelen, kernbegrippen, uitgewerkte voorbeelden,
// samenvattingen en toetsvragen staan per leerweg in
// scripts/seed-verrijking/<niveau>/, zodat de lesinhoud los van de
// routestructuur gevuld kan worden. Alles wat daar als .mjs staat wordt geladen
// - niet een vaste lijst. Ontbreekt of faalt een bestand, dan bouwt de seed
// gewoon door zonder die verrijking.
const chapterNumberOf = (name) => {
  const match = /^h(\d+)\./.exec(name);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
};

const enrichmentFiles = (niveau) => {
  const dir = path.join(enrichmentRoot, niveau);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.mjs') && fs.statSync(path.join(dir, name)).isFile())
    .sort((a, b) => chapterNumberOf(a) - chapterNumberOf(b) || a.localeCompare(b))
    .map((name) => ({ name, file: path.join(dir, name) }));
};

const loadEnrichment = async (niveau) => {
  const map = new Map();

  for (const entry of enrichmentFiles(niveau)) {
    try {
      const module = await import(pathToFileURL(entry.file).href);
      const entries = module.default;
      if (!entries || typeof entries !== 'object') continue;
      for (const [code, value] of Object.entries(entries)) {
        if (value && typeof value === 'object') map.set(code, value);
      }
    } catch (error) {
      waarschuw(niveau, `Verrijking ${entry.name} overgeslagen: ${error.message}`);
    }
  }

  return map;
};

const cleanStringList = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => String(item || '').trim())
    .filter(Boolean);

const blockSettings = (type) => ({
  allowAiHelp: ['question', 'quiz'].includes(type),
  allowMathToolbox: false
});

const tokenConfig = (totalTokens) => ({
  enabled: totalTokens > 0,
  totalTokens
});

const block = ({ id, type, order, title, content, tokens = 0, status = 'published', sourceBasis = ['lessenserie-md', 'ai-aanvulling'], settings = null }) => ({
  id,
  type,
  order,
  title,
  status,
  tokenConfig: tokenConfig(tokens),
  tokenTotal: tokens,
  settings: settings ? { ...blockSettings(type), ...settings } : blockSettings(type),
  content: {
    ...content,
    sourceBasis,
    sourceNotes: 'Interne bronmetadata voor docent/CMS; niet tonen in leerlingweergave.'
  },
  isArchived: false
});

// ---------------------------------------------------------------------------
// Toetsvragen
//
// Een quiz- of toetsvraag komt UITSLUITEND uit de verrijkingslaag, onder de
// sleutel `vragen` bij de paragraafcode. De generator verzint geen opties, geen
// feedback en geen vraagtype meer. Ontbreekt `vragen`, dan komt er geen quiz in
// de leerlingroute: het blok gaat op status 'draft' en wordt onderaan de run
// opgesomd. Liever geen quiz dan een quiz die iedereen haalt.
//
// FORMAAT per vraag (zie scripts/seed-verrijking/PATROON.md):
//
//   {
//     prompt:   'De vraag of stelling zoals de leerling hem leest.'  (verplicht)
//     type:     'meerkeuze' | 'waar-niet-waar' | 'open'              (optioneel)
//     options:  [ { text, correct, explanation?, misconception? } ]  (gesloten)
//     waar:     true | false        korte vorm voor een waar-niet-waar-stelling
//     feedback: 'Wat de leerling na het antwoorden leest.'           (verplicht)
//     modelAnswer:   'Wat er in een goed antwoord staat.'            (open)
//     nakijkpunten:  ['...', '...']  2 of 3 punten waar de docent op let (open)
//     leerdoel: 'Je kunt ...'   optioneel; koppelt de vraag aan een leerdoel
//   }
//
// De veldnamen zijn dezelfde als die de CMS-editor schrijft, zodat een vraag die
// in de app is gemaakt hier ongewijzigd in geplakt kan worden.
//
// Regels die de generator afdwingt (fout = build stopt, geen stille nepvraag):
//   - type wordt afgeleid uit de vraag zelf, nooit uit de volgorde. Een prompt
//     die begint met wat/waarom/hoe/welke/wanneer/wie of eindigt op een
//     vraagteken kan geen waar-niet-waar-stelling zijn.
//   - meerkeuze: 3 of 4 opties, minstens een goede en minstens een foute.
//   - waar-niet-waar: precies de twee opties Waar en Niet waar, een correct.
//   - open: modelAnswer plus 2 of 3 nakijkpunten.
//   - elke vraag heeft eigen feedback; dezelfde feedbackzin mag niet in twee
//     vragen van hetzelfde blok en in hoogstens twee paragrafen van dezelfde
//     leerweg staan.
//   - het goede antwoord staat niet in elke vraag van een blok op dezelfde plek.
//   - een quiz heeft minstens 3 vragen, een toets minstens 6.
//   - een hoofdstuktoets stelt geen vraag over een optionele paragraaf.
// ---------------------------------------------------------------------------

const MIN_ITEMS = { quiz: 3, toets: 6 };
const MAX_PARAGRAFEN_PER_FEEDBACK = 2;

const VRAAGWOORDEN = /^(wat|waarom|hoe|welke|welk|wanneer|wie|waar|waardoor|waarmee|waarvoor|noem|leg|beschrijf|geef|vergelijk|verklaar|kies)\b/i;

const inferItemType = (vraag, label) => {
  if (vraag.type) return String(vraag.type);
  if (typeof vraag.waar === 'boolean') return 'waar-niet-waar';
  if (Array.isArray(vraag.options) && vraag.options.length > 0) return 'meerkeuze';
  if (vraag.modelAnswer || vraag.nakijkpunten) return 'open';
  throw new Error(`${label}: vraagtype niet af te leiden; zet type, options, waar of modelAnswer`);
};

// Het vraagtype moet bij de vraag passen. Een vraag die om uitleg vraagt is
// geen ja/nee-knop, ook niet als het toevallig de eerste vraag van de quiz is.
const assertTypeFitsPrompt = (type, prompt, label) => {
  const text = prompt.trim();
  if (type !== 'waar-niet-waar') return;
  if (VRAAGWOORDEN.test(text)) {
    throw new Error(`${label}: "${text.slice(0, 48)}..." begint met een vraagwoord en kan geen waar-niet-waar zijn`);
  }
  if (text.endsWith('?')) {
    throw new Error(`${label}: een waar-niet-waar-vraag is een stelling, geen vraagzin`);
  }
};

const buildOptions = (type, vraag, label) => {
  if (type === 'waar-niet-waar') {
    if (typeof vraag.waar !== 'boolean' && !Array.isArray(vraag.options)) {
      throw new Error(`${label}: waar-niet-waar heeft waar: true of waar: false nodig`);
    }
    if (typeof vraag.waar === 'boolean') {
      return [
        { id: 'waar', text: 'Waar', correct: vraag.waar === true, explanation: '', misconception: '' },
        { id: 'niet-waar', text: 'Niet waar', correct: vraag.waar === false, explanation: '', misconception: '' }
      ];
    }
  }

  const raw = Array.isArray(vraag.options) ? vraag.options : [];
  if (type === 'meerkeuze' && (raw.length < 3 || raw.length > 4)) {
    throw new Error(`${label}: meerkeuze heeft 3 of 4 opties nodig, kreeg ${raw.length}`);
  }
  if (type === 'waar-niet-waar' && raw.length !== 2) {
    throw new Error(`${label}: waar-niet-waar heeft precies 2 opties`);
  }

  const options = raw.map((option, index) => {
    const text = String(option?.text || '').trim();
    if (!text) throw new Error(`${label}: optie ${index + 1} heeft geen tekst`);
    return {
      id: `optie-${index + 1}`,
      text,
      correct: option.correct === true,
      explanation: String(option.explanation || option.uitleg || '').trim(),
      misconception: String(option.misconception || option.misvatting || '').trim()
    };
  });

  const correctCount = options.filter((option) => option.correct).length;
  if (correctCount === 0) throw new Error(`${label}: geen enkele optie is correct`);
  if (correctCount === options.length) throw new Error(`${label}: alle opties zijn correct`);

  const texts = new Set(options.map((option) => option.text.toLowerCase()));
  if (texts.size !== options.length) throw new Error(`${label}: dubbele antwoordoptie`);

  return options;
};

const buildOpenAnswer = (vraag, label) => {
  const modelAnswer = String(vraag.modelAnswer || '').trim();
  if (!modelAnswer) throw new Error(`${label}: open vraag zonder modelAnswer`);

  // De CMS-editor bewaart de nakijkpunten als een tekstvak met regels. Een vraag
  // die daar vandaan geplakt is mag dus ook een string zijn.
  const bron = vraag.nakijkpunten ?? vraag.rubric;
  const nakijkpunten = cleanStringList(
    typeof bron === 'string' ? bron.split('\n').map((regel) => regel.replace(/^[-*]\s*/, '')) : bron
  );
  if (nakijkpunten.length < 2 || nakijkpunten.length > 3) {
    throw new Error(`${label}: open vraag heeft 2 of 3 nakijkpunten nodig, kreeg ${nakijkpunten.length}`);
  }

  return {
    type: 'open',
    modelAnswer,
    rubric: nakijkpunten.map((punt) => `- ${punt}`).join('\n'),
    teacherNotes: ''
  };
};

// ---------------------------------------------------------------------------
// Blauwdruk: startcheck, oefenblok en bewijsopdracht
//
// De blauwdruk (docs/blauwdruk lesstof) zet tien stappen op een rij. Drie
// daarvan waren met een kale lijst losse zinnen niet te maken, en die zijn hier
// alsnog mogelijk gemaakt. ALLES is achterwaarts compatibel: een hoofdstuk dat
// gewoon strings meegeeft krijgt precies wat het altijd kreeg.
//
//   checks      Stap 1, de STARTCHECK. Startvragen horen VOOR de uitleg te
//               staan, een per leerdoel, met de uitleg pas NA het antwoord.
//               Daarom staat dit blok nu direct achter het slidedeck en mag een
//               check een object zijn:
//                 { vraag, antwoord, uitleg, leerdoel }
//               Met een antwoord erbij zet de generator de uitleg in een
//               <details> die de leerling zelf openklapt, en gaat de Digidocent
//               op dit blok uit. Een kale string blijft de oude korte check.
//
//   oefenen     Stap 4, 5 en 6: samen oefenen, zelf oefenen en steun of plus.
//               Optioneel; een array van
//                 { groep: 'samen' | 'zelf' | 'steun' | 'plus',
//                   vraag, antwoord, uitleg, leerdoel }
//               Het blok komt tussen de theorie en de bewijsopdracht en haalt
//               zijn tokens uit het tokenbudget van die bewijsopdracht.
//
//   assignment  Stap 8, het bewijs. Mag een object zijn:
//                 { tekst, label, modelAnswer, nakijkpunten }
//               Zonder modelAnswer kan de docent niet nakijken en levert de
//               opdracht gratis punten op; de nakijkpunten komen ook als
//               succescriteria in beeld bij de leerling.
//
//   media       Mag nu ook een ARRAY van media(...) zijn. Een les met twee
//               video's hoeft er dan geen een als kale URL in de opdrachttekst
//               te laten staan.
// ---------------------------------------------------------------------------

const GROEP_KOPPEN = {
  samen: 'Samen oefenen — de Digidocent mag met je meedenken',
  zelf: 'Zelf oefenen — probeer het eerst zonder hulp',
  steun: 'Extra steun — nog even rustig langs de basis',
  plus: 'Extra plus — voor wie meer wil'
};

// Elke groep krijgt zijn eigen blok (stap 4, 5 en 6 van de blauwdruk staan daar
// ook als aparte rijen). De bloktitel zegt meteen of de Digidocent meekijkt.
const OEFEN_BLOKTITELS = {
  samen: 'Samen oefenen (Digidocent aan)',
  zelf: 'Zelf oefenen (Digidocent uit)',
  steun: 'Extra steun (Digidocent aan)',
  plus: 'Extra plus (Digidocent uit)'
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// Startvragen en oefenopgaven hebben hetzelfde formaat: een vraag, en optioneel
// het antwoord met de uitleg die de leerling pas na zijn eigen poging leest.
const leesOpgave = (entry, label) => {
  if (typeof entry === 'string') {
    const vraag = entry.trim();
    if (!vraag) throw new Error(`${label}: lege vraag`);
    return { vraag, antwoord: '', uitleg: '', leerdoel: '', groep: 'zelf' };
  }
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    throw new Error(`${label}: een vraag is een tekst of een object { vraag, antwoord, uitleg, leerdoel }`);
  }

  const vraag = String(entry.vraag || '').trim();
  if (!vraag) throw new Error(`${label}: object zonder vraagtekst`);
  const antwoord = String(entry.antwoord || '').trim();
  const uitleg = String(entry.uitleg || '').trim();
  if (antwoord && uitleg.length < 20) {
    throw new Error(`${label}: bij een antwoord hoort uitleg van minstens 20 tekens; de leerling leest die na zijn poging`);
  }
  if (!antwoord && uitleg) {
    throw new Error(`${label}: uitleg zonder antwoord; zet er ook het goede antwoord bij`);
  }

  const groep = String(entry.groep || 'zelf').trim();
  if (!Object.prototype.hasOwnProperty.call(GROEP_KOPPEN, groep)) {
    throw new Error(`${label}: onbekende groep "${groep}"; kies ${Object.keys(GROEP_KOPPEN).join(', ')}`);
  }

  return { vraag, antwoord, uitleg, leerdoel: String(entry.leerdoel || '').trim(), groep };
};

// De uitleg staat in een <details>: dichtgeklapt tot de leerling hem zelf
// opent. Zo staat het antwoord wel in het blok, maar leest niemand het per
// ongeluk voordat hij zelf iets bedacht heeft.
const opgaveHtml = (opgave, nummer, opengeklaptLabel) => {
  const kop = `<p><strong>${nummer}. ${escapeHtml(opgave.vraag)}</strong></p>`;
  if (!opgave.antwoord) return kop;
  return (
    `${kop}<details><summary>${opengeklaptLabel}</summary>` +
    `<p><strong>Antwoord.</strong> ${escapeHtml(opgave.antwoord)}</p>` +
    `<p>${escapeHtml(opgave.uitleg)}</p></details>`
  );
};

const opgaveVeld = (opgave, index) => ({
  id: `check-${index + 1}`,
  label: opgave.vraag,
  answer: '',
  ...(opgave.antwoord ? { modelAnswer: opgave.antwoord, explanation: opgave.uitleg } : {}),
  ...(opgave.leerdoel ? { learningGoal: opgave.leerdoel } : {})
});

// De bewijsopdracht: tekst plus, als het goed is, een modelantwoord en
// nakijkpunten. De nakijkpunten zijn succescriteria en mogen de leerling wel
// vooraf onder ogen komen; het modelantwoord blijft docentdata.
const leesOpdracht = (assignment, label) => {
  if (typeof assignment === 'string') {
    const tekst = assignment.trim();
    if (!tekst) throw new Error(`${label}: lege praktijkopdracht`);
    return { tekst, label: 'Beschrijf of lever je bewijs in volgens de opdracht.', modelAnswer: '', nakijkpunten: [] };
  }
  if (!assignment || typeof assignment !== 'object' || Array.isArray(assignment)) {
    throw new Error(`${label}: een praktijkopdracht is een tekst of een object { tekst, label, modelAnswer, nakijkpunten }`);
  }

  const tekst = String(assignment.tekst || '').trim();
  if (!tekst) throw new Error(`${label}: praktijkopdracht zonder tekst`);
  const modelAnswer = String(assignment.modelAnswer || '').trim();
  const nakijkpunten = cleanStringList(assignment.nakijkpunten);
  if (modelAnswer && (nakijkpunten.length < 2 || nakijkpunten.length > 4)) {
    throw new Error(`${label}: een bewijsopdracht met modelantwoord heeft 2 tot 4 nakijkpunten, kreeg ${nakijkpunten.length}`);
  }

  return {
    tekst,
    label: String(assignment.label || '').trim() || 'Beschrijf of lever je bewijs in volgens de opdracht.',
    modelAnswer,
    nakijkpunten
  };
};

// Stap 1 van de blauwdruk is expliciet: bij de startcheck hoort GEEN cijfer en
// GEEN tokens. Een beloning op een blok waar fout antwoorden juist de bedoeling
// is, maakt er een prestatie van in plaats van een peiling. De vrijgekomen
// tokens gaan naar de afsluitquiz en de hoofdstuktoets, precies zoals de
// blauwdruk aanraadt: beloon wat gemeten wordt. De paragraaftotalen blijven
// ongewijzigd (100 gewoon, 120 checkpoint, 150 eindtoets).
const tokenPlan = (paragraph) => {
  if (paragraph.final) {
    return { slidedeck: 0, theory: [10, 10], media: 0, check: 0, practice: 55, summary: 10, assessment: 40, game: 25 };
  }
  if (paragraph.checkpoint) {
    return { slidedeck: 0, theory: [5, 5], media: 0, check: 0, practice: 20, summary: 10, assessment: 60, game: 20 };
  }
  return { slidedeck: 0, theory: [5, 5], media: 5, check: 0, practice: 35, summary: 10, assessment: 30, game: 10 };
};

// ---------------------------------------------------------------------------
// Eén leerweg bouwen
// ---------------------------------------------------------------------------

const buildNiveau = ({ niveau, chapters, enrichment }) => {
  const niveauId = niveauDocId(niveau);

  // Paragraafcodes zonder vragen; onderaan de run per leerweg opgesomd.
  const missingAssessments = [];
  // Feedbackzin -> paragraafcodes, om sjabloonfeedback binnen deze leerweg te
  // vangen. Bb, kb en tl zijn dezelfde les in andere woorden, dus dezelfde
  // feedback in twee leerwegen is geen sjabloon; binnen één leerweg wel.
  const feedbackParagrafen = new Map();

  const learningGoalsFor = (code) => cleanStringList(enrichment.get(code)?.learningGoals);

  // Kernbegrippen en uitgewerkt voorbeeld voor theorieblok `index` (0 of 1).
  // Lege waarden worden weggelaten, zodat de blokinhoud niet met lege velden
  // vervuilt.
  const theoryEnrichmentFor = (code, index) => {
    const blocks = enrichment.get(code)?.theorie;
    const entry = Array.isArray(blocks) ? blocks[index] : null;
    if (!entry || typeof entry !== 'object') return {};

    const extra = {};
    const keyTerms = cleanStringList(entry.keyTerms);
    if (keyTerms.length) extra.keyTerms = keyTerms;
    const exampleHtml = String(entry.exampleHtml || '').trim();
    if (exampleHtml) extra.exampleHtml = exampleHtml;

    return extra;
  };

  // Samenvattingstekst en kernbegrippen voor het samenvattingsblok. Ontbreekt de
  // verrijking, dan valt het blok terug op de sjabloonregel in buildBlocks.
  // Een samenvatting zonder kernbegrippen is een fout: dan blijft er een
  // leesstap over die niets vet kan zetten.
  const samenvattingFor = (code) => {
    const entry = enrichment.get(code)?.samenvatting;
    if (!entry || typeof entry !== 'object') return null;

    const summaryHtml = String(entry.html || '').trim();
    const keyTerms = cleanStringList(entry.keyTerms);
    if (!summaryHtml) return null;
    if (!keyTerms.length) {
      throw new Error(`${niveau} ${code}: samenvatting heeft html maar geen keyTerms`);
    }

    return { html: summaryHtml, keyTerms };
  };

  const questionsFor = (code) => {
    const entries = enrichment.get(code)?.vragen;
    if (!Array.isArray(entries) || entries.length === 0) return null;
    return entries;
  };

  const makeQuestionItems = (code, vragen, totalTokens, type, verbodenLeerdoelen) => {
    if (vragen.length < MIN_ITEMS[type]) {
      throw new Error(`${niveau} ${code}: een ${type} heeft minstens ${MIN_ITEMS[type]} vragen nodig, kreeg ${vragen.length}`);
    }

    const base = Math.floor(totalTokens / vragen.length);
    let rest = totalTokens - base * vragen.length;

    const feedbackInBlock = new Set();
    const correctPositions = [];

    const items = vragen.map((vraag, index) => {
      const label = `${niveau} ${code} vraag ${index + 1}`;
      const tokens = base + (rest > 0 ? 1 : 0);
      rest -= 1;

      const prompt = String(vraag.prompt || '').trim();
      if (!prompt) throw new Error(`${label}: lege prompt`);

      const itemType = inferItemType(vraag, label);
      if (!['meerkeuze', 'waar-niet-waar', 'open'].includes(itemType)) {
        throw new Error(`${label}: onbekend vraagtype ${itemType}`);
      }
      assertTypeFitsPrompt(itemType, prompt, label);

      const leerdoel = String(vraag.leerdoel || '').trim();

      // De vrijwillige plusparagraaf is geen voorwaarde om verder te mogen. Een
      // hoofdstuktoets die hem tóch bevraagt maakt hem alsnog verplicht.
      if (leerdoel && verbodenLeerdoelen.has(leerdoel.toLowerCase())) {
        const bron = verbodenLeerdoelen.get(leerdoel.toLowerCase());
        throw new Error(
          `${label}: hangt aan het leerdoel "${leerdoel}" van de optionele paragraaf ${bron}; ` +
            'een hoofdstuktoets mag niet over een vrijwillige plusparagraaf gaan'
        );
      }

      const feedback = String(vraag.feedback || '').trim();
      if (feedback.length < 20) {
        throw new Error(`${label}: feedback ontbreekt of is te kort om iets uit te leggen`);
      }
      const feedbackKey = feedback.toLowerCase();
      if (feedbackInBlock.has(feedbackKey)) {
        throw new Error(`${label}: dezelfde feedbackzin staat al bij een andere vraag in dit blok`);
      }
      feedbackInBlock.add(feedbackKey);
      if (!feedbackParagrafen.has(feedbackKey)) feedbackParagrafen.set(feedbackKey, new Set());
      feedbackParagrafen.get(feedbackKey).add(code);

      const taxonomy = {
        learningGoal: leerdoel,
        cognitiveSkill: vraag.denkniveau || (itemType === 'open' ? 'uitleggen' : 'begrijpen'),
        masteryLevel: vraag.niveau || 'basis',
        scaffoldingRole: vraag.rol || 'zelf_proberen'
      };

      if (itemType === 'open') {
        return {
          id: `${type}-${index + 1}`,
          type: 'open',
          vraagtype: 'open',
          prompt,
          answer: buildOpenAnswer(vraag, label),
          options: [],
          feedback,
          tokens,
          taxonomy
        };
      }

      const options = buildOptions(itemType, vraag, label);
      correctPositions.push(options.findIndex((option) => option.correct));

      return {
        id: `${type}-${index + 1}`,
        type: itemType,
        vraagtype: itemType,
        prompt,
        answer: { type: 'meerkeuze', options: options.map((option) => ({ ...option })) },
        options: options.map((option) => ({ ...option })),
        feedback,
        tokens,
        taxonomy
      };
    });

    // Staat het goede antwoord elke keer op dezelfde knop, dan is de quiz te
    // halen zonder de vraag te lezen.
    if (correctPositions.length >= 3 && new Set(correctPositions).size === 1) {
      throw new Error(`${niveau} ${code}: het goede antwoord staat in elke gesloten vraag op positie ${correctPositions[0] + 1}`);
    }

    const openCount = items.filter((item) => item.type === 'open').length;
    if (openCount === items.length) {
      throw new Error(`${niveau} ${code}: alleen open vragen; een quiz of toets heeft ook gesloten vragen nodig`);
    }

    return items;
  };

  const buildBlocks = (chapter, paragraph, verbodenLeerdoelen) => {
    const plan = tokenPlan(paragraph);
    const idPrefix = blockIdPrefix(niveau, paragraph.code);
    const blocks = [];
    let order = 1;

    blocks.push(block({
      id: `${idPrefix}-slidedeck`,
      type: 'slidedeck',
      order: order++,
      title: `${paragraph.code} Startpresentatie`,
      content: {
        html: `<p>Slidedeck-placeholder voor ${paragraph.title}. De docent vult deze presentatie later.</p>`,
        slidedeckPackageId: '',
        deckTitle: `${paragraph.code} ${paragraph.title}`,
        generatedDeckUrl: '',
        generatedDeckStoragePath: '',
        sourcePdfUrl: '',
        sourcePdfStoragePath: ''
      },
      tokens: plan.slidedeck,
      sourceBasis: ['lessenserie-md']
    }));

    // STAP 1 VAN DE BLAUWDRUK: de startcheck, en die hoort VOOR de uitleg.
    // Startvragen leveren winst op de bevraagde stof (g=0,66; bij kinderen en
    // tieners g≈0,51), maar het effect straalt niet uit naar stof waar niet
    // naar gevraagd is (g=0,01 tot 0,04). Daarom een vraag per leerdoel, en
    // daarom staat dit blok hier en niet achter de theorie: een vraag na de
    // uitleg is een navraag, geen startvraag.
    const startvragen = paragraph.checks.map((entry, index) =>
      leesOpgave(entry, `${niveau} ${paragraph.code} startvraag ${index + 1}`)
    );
    const startcheckVerrijkt = startvragen.some((opgave) => opgave.antwoord);
    blocks.push(block({
      id: `${idPrefix}-question-check`,
      type: 'question',
      order: order++,
      title: startcheckVerrijkt ? 'Startcheck: wat weet je al?' : 'Korte check',
      content: {
        html: [
          startcheckVerrijkt
            ? '<p>Dit is de startcheck. Je beantwoordt de vragen <strong>voordat</strong> je de uitleg leest, in gewone zinnen. ' +
              'Je krijgt er geen cijfer voor en fout antwoorden mag: het gaat erom dat je eerst zelf nadenkt. ' +
              'De Digidocent helpt hier niet mee. Klap de uitleg pas open als je je antwoord hebt opgeschreven.</p>'
            : '<p>Beantwoord de korte vragen in gewone zinnen.</p>',
          ...startvragen.map((opgave, index) =>
            opgaveHtml(opgave, index + 1, 'Uitleg — pas openklappen als je je antwoord hebt opgeschreven')
          )
        ].join('\n'),
        exercise: { fields: startvragen.map((opgave, index) => opgaveVeld(opgave, index)) }
      },
      tokens: plan.check,
      // Digidocent uit bij de startcheck: hulp tijdens de poging kan precies
      // het mechanisme ondermijnen dat de winst oplevert. De uitleg komt na het
      // antwoord, uit het blok zelf.
      ...(startcheckVerrijkt ? { settings: { allowAiHelp: false } } : {})
    }));

    paragraph.theory.forEach(([title, text], index) => {
      blocks.push(block({
        id: `${idPrefix}-theory-${index + 1}`,
        type: 'theory',
        order: order++,
        title,
        content: { html: html([text]), ...theoryEnrichmentFor(paragraph.code, index) },
        tokens: plan.theory[index] || 0,
        sourceBasis: ['wikiwijs', 'lessenserie-md', 'ai-aanvulling']
      }));
    });

    // STAP 4, 5 en 6: samen oefenen, zelf oefenen en steun of plus. Zonder deze
    // blokken is de eerste opgave met feedback die de leerling ziet meteen de
    // afsluitquiz, en dan is er tussen voordoen en beoordelen niets geoefend.
    //
    // De blauwdruk zet stap 4, 5 en 6 als APARTE rijen neer, en niet voor de
    // sier: bij stap 4 staat de Digidocent AAN en bij stap 5 staat hij UIT.
    // Eén samengevoegd blok kan die twee niet allebei zijn, en dan wordt van
    // zelfstandig ophalen alsnog begeleid oefenen - precies het mechanisme dat
    // de winst van ophalen levert. Daarom krijgt elke groep zijn eigen blok, in
    // de vaste volgorde samen -> zelf -> steun -> plus, met hulp aan bij samen
    // en steun en hulp uit bij zelf en plus. Een deeltoets of diagnoseblok
    // hoort dus in de groep 'zelf'; het herstelmateriaal erna in 'steun'.
    const oefeningen = (Array.isArray(paragraph.oefenen) ? paragraph.oefenen : [])
      .filter(Boolean)
      .map((entry, index) => leesOpgave(entry, `${niveau} ${paragraph.code} oefening ${index + 1}`));
    const oefenTokens = oefeningen.length ? (paragraph.checkpoint ? 10 : 15) : 0;
    const practiceTokens = plan.practice - oefenTokens;
    if (practiceTokens < 0) {
      throw new Error(`${niveau} ${paragraph.code}: het oefenblok past niet in het tokenbudget van de praktijkopdracht`);
    }

    if (oefeningen.length) {
      const groepVolgorde = ['samen', 'zelf', 'steun', 'plus'];
      const groepBlokken = groepVolgorde
        .map((groep) => ({ groep, opgaven: oefeningen.filter((opgave) => opgave.groep === groep) }))
        .filter((entry) => entry.opgaven.length);

      // De tokens van het oefenen worden over de aanwezige blokken verdeeld, net
      // als bij de media. Het paragraaftotaal verandert daardoor niet.
      const tokenBasis = Math.floor(oefenTokens / groepBlokken.length);
      let tokenRest = oefenTokens - tokenBasis * groepBlokken.length;

      groepBlokken.forEach(({ groep, opgaven }) => {
        const metHulp = groep === 'samen' || groep === 'steun';
        const stukken = [
          `<p><strong>${GROEP_KOPPEN[groep]}</strong></p>`,
          metHulp
            ? '<p>Hier oefen je met wat je net gelezen hebt. De Digidocent mag met je meedenken. Werk elke opgave eerst zelf uit en klap daarna de uitwerking open.</p>'
            : '<p>Dit deel doe je zonder hulp: de Digidocent staat hier uit. Maak elke opgave eerst helemaal zelf en klap de uitwerking pas daarna open. Fout antwoorden mag; je ziet meteen waar je nog moet oefenen.</p>'
        ];
        opgaven.forEach((opgave, index) => {
          stukken.push(opgaveHtml(opgave, index + 1, 'Uitwerking — pas openklappen na je eigen poging'));
        });

        const tokens = tokenBasis + (tokenRest > 0 ? 1 : 0);
        tokenRest -= 1;

        blocks.push(block({
          id: `${idPrefix}-question-oefenen-${groep}`,
          type: 'question',
          order: order++,
          title: OEFEN_BLOKTITELS[groep],
          content: {
            html: stukken.join('\n'),
            exercise: { fields: opgaven.map((opgave, index) => opgaveVeld(opgave, index)) }
          },
          tokens,
          // Stap 5 van de blauwdruk: zelf oefenen gebeurt met de Digidocent uit.
          // Hulp tijdens de poging kan het ophaalmechanisme ondermijnen, en een
          // deeltoets of diagnose met hulp meet niet meer wat de leerling weet.
          ...(metHulp ? {} : { settings: { allowAiHelp: false } })
        }));
      });
    }

    // STAP 7: media. Die staat hier BEWUST na het oefenblok en niet achter de
    // theorie. Een filmpje vóór de eigen poging wordt een tweede uitlegmoment;
    // erna is het een verrijking die iets toevoegt wat tekst niet kan, en de
    // kijkvraag toetst dan meteen wat de leerling zelf al bedacht had.
    // Een paragraaf mag meer dan een fragment hebben: twee video's uit dezelfde
    // les horen allebei een speler met een kijkvraag te zijn, en niet een als
    // kale URL midden in de opdrachttekst.
    const mediaLijst = (Array.isArray(paragraph.media) ? paragraph.media : [paragraph.media])
      .filter((entry) => entry && (entry.url || entry.label));
    if (mediaLijst.length) {
      const mediaBase = Math.floor(plan.media / mediaLijst.length);
      let mediaRest = plan.media - mediaBase * mediaLijst.length;
      mediaLijst.forEach((entry, index) => {
        const tokens = mediaBase + (mediaRest > 0 ? 1 : 0);
        mediaRest -= 1;
        blocks.push(block({
          id: mediaLijst.length === 1 ? `${idPrefix}-media` : `${idPrefix}-media-${index + 1}`,
          type: 'media',
          order: order++,
          title: entry.label || 'Media',
          content: {
            html: html([`Kijkvraag: ${entry.kijkvraag}`]),
            mediaKind: mediaKindForUrl(entry.url),
            mediaUrl: entry.url || '',
            caption: entry.kijkvraag,
            altText: entry.label || ''
          },
          tokens,
          sourceBasis: ['lessenserie-md', 'schooltv-kennisnet-microsoft']
        }));
      });
    }

    // STAP 8: het bewijsproduct. Met een modelantwoord, anders kan de docent
    // niet nakijken en leveren de tokens zichzelf uit.
    const opdracht = leesOpdracht(paragraph.assignment, `${niveau} ${paragraph.code} praktijkopdracht`);
    blocks.push(block({
      id: `${idPrefix}-question-practice`,
      type: 'question',
      order: order++,
      title: 'Praktijkopdracht',
      content: {
        html: [
          `<p>${opdracht.tekst}</p>`,
          ...(opdracht.nakijkpunten.length
            ? [
                '<p><strong>Je bewijs is af als:</strong></p>',
                `<ul>${opdracht.nakijkpunten.map((punt) => `<li>${escapeHtml(punt)}</li>`).join('')}</ul>`
              ]
            : [])
        ].join('\n'),
        exercise: {
          fields: [
            {
              id: 'bewijs',
              label: opdracht.label,
              answer: '',
              ...(opdracht.modelAnswer ? { modelAnswer: opdracht.modelAnswer } : {}),
              ...(opdracht.nakijkpunten.length
                ? { rubric: opdracht.nakijkpunten.map((punt) => `- ${punt}`).join('\n') }
                : {})
            }
          ]
        }
      },
      tokens: practiceTokens
    }));

    // Samenvatting: de laatste leestekst vóór de quiz of toets. De kerndoelcodes
    // zijn docentmetadata en staan daarom naast sourceBasis/sourceNotes in de
    // blokinhoud, niet in de leestekst; sanitizeContent laat ze niet door naar
    // de leerlingweergave.
    const samenvatting = samenvattingFor(paragraph.code);
    blocks.push(block({
      id: `${idPrefix}-summary`,
      type: 'summary',
      order: order++,
      title: 'Samenvatting',
      content: {
        html: samenvatting ? samenvatting.html : html([`Je werkte aan: ${paragraph.product}.`]),
        ...(samenvatting ? { keyTerms: samenvatting.keyTerms } : {}),
        kerndoelen: paragraph.kerndoelen
      },
      tokens: plan.summary
    }));

    const assessmentType = paragraph.checkpoint ? 'toets' : 'quiz';
    const vragen = questionsFor(paragraph.code);
    if (!vragen) missingAssessments.push({ code: paragraph.code, type: assessmentType, ideas: paragraph.assessmentItems.length });

    blocks.push(block({
      id: `${idPrefix}-${assessmentType}`,
      type: assessmentType,
      order: order++,
      title: paragraph.final ? 'Eindtoets' : paragraph.checkpoint ? 'Hoofdstuktoets' : 'Afsluitquiz',
      // Zonder vragen blijft het blok op 'draft'. Het staat dan wel in de CMS,
      // zodat de docent ziet wat er nog moet gebeuren, maar contentBlockUtils
      // filtert draft weg uit de leerlingroute. De tokens blijven op het blok
      // staan en zijn dus onbereikbaar tot de vragen er zijn.
      status: vragen ? 'published' : 'draft',
      content: {
        html: html([
          vragen
            ? paragraph.checkpoint
              ? 'Maak deze toets zelfstandig. De Digidocent staat hier uit.'
              : 'Maak deze korte quiz om te controleren of je de paragraaf begrepen hebt.'
            : `Deze ${assessmentType} heeft nog geen vragen. Vul ze aan in scripts/seed-verrijking/${niveau} en zet het blok daarna op gepubliceerd.`
        ]),
        assessmentType,
        items: vragen
          ? makeQuestionItems(paragraph.code, vragen, plan.assessment, assessmentType, paragraph.checkpoint ? verbodenLeerdoelen : new Map())
          : [],
        // Docentmetadata: de vraagideeën uit de lessenserie, als startpunt voor
        // wie de vragen gaat schrijven. sanitizeContent laat dit veld niet door
        // naar de leerlingweergave.
        ...(vragen ? {} : { pendingPrompts: paragraph.assessmentItems }),
        attemptPolicy: {
          maxAttempts: paragraph.final || paragraph.checkpoint ? 1 : null,
          scoring: 'best',
          allowTeacherReset: true
        },
        tokenConfig: tokenConfig(plan.assessment)
      },
      tokens: plan.assessment
    }));

    blocks.push(block({
      id: `${idPrefix}-game`,
      type: 'game',
      order: order++,
      title: paragraph.gameTitle,
      content: {
        html: html([`Gameplaceholder: ${paragraph.gameDescription}`, 'Deze game wordt later gebouwd. Je docent kan dit blok nu al in de lesroute laten staan.']),
        gameId: gameIdForTitle(paragraph.gameTitle),
        gameTitle: paragraph.gameTitle,
        settings: { estimatedMinutes: paragraph.checkpoint ? 7 : 5 },
        tokenConfig: tokenConfig(plan.game)
      },
      tokens: plan.game,
      sourceBasis: ['lessenserie-md']
    }));

    const total = blocks.reduce((sum, item) => sum + (item.tokenTotal || 0), 0);
    if (total !== paragraph.tokens) {
      // Melding met de opbouw erbij: zonder die uitsplitsing is dit niet te repareren.
      const opbouw = blocks
        .filter((item) => item.tokenTotal)
        .map((item) => `${item.type}:${item.tokenTotal}`)
        .join(' + ');
      throw new Error(
        `${niveau} ${paragraph.code} telt ${total} tokens maar declareert ${paragraph.tokens}.
` +
        `  opbouw: ${opbouw}
` +
        `  verschil: ${total - paragraph.tokens}`
      );
    }

    return blocks.map((item) => ({
      ...item,
      vakId: VAK_ID,
      leerjaarId: LEERJAAR_ID,
      niveauId,
      hoofdstukId: hoofdstukDocId(niveau, chapter.chapter),
      paragraafId: paragraafDocId(niveau, paragraph.code)
    }));
  };

  // Per hoofdstuk: de leerdoelen die bij een optionele paragraaf horen. Een
  // hoofdstuktoets mag daar geen vraag aan hangen.
  const verbodenLeerdoelenPerHoofdstuk = new Map();
  for (const chapter of chapters) {
    const verboden = new Map();
    for (const paragraph of chapter.paragraphs) {
      if (paragraph.optioneel !== true) continue;
      for (const goal of learningGoalsFor(paragraph.code)) {
        verboden.set(goal.toLowerCase(), paragraph.code);
      }
    }
    verbodenLeerdoelenPerHoofdstuk.set(chapter.chapter, verboden);
  }

  const hoofdstukken = chapters.map((chapter) => ({
    id: hoofdstukDocId(niveau, chapter.chapter),
    vakId: VAK_ID,
    leerjaarId: LEERJAAR_ID,
    niveauId,
    number: chapter.chapter,
    title: `H${chapter.chapter}: ${chapter.chapterTitle}`,
    description: `Hoofdstuk ${chapter.chapter} van Digitale vaardigheden.`,
    order: chapter.chapter,
    published: true,
    isArchived: false,
    badge: chapter.badge
  }));

  const paragrafen = chapters.flatMap((chapter) =>
    chapter.paragraphs.map((paragraph, index) => {
      const learningGoals = learningGoalsFor(paragraph.code);
      const optioneel = paragraph.optioneel === true;

      return {
        id: paragraafDocId(niveau, paragraph.code),
        vakId: VAK_ID,
        leerjaarId: LEERJAAR_ID,
        niveauId,
        hoofdstukId: hoofdstukDocId(niveau, chapter.chapter),
        code: paragraph.code,
        title: paragraph.title,
        beschrijving: paragraph.product,
        kerndoelen: paragraph.kerndoelen,
        product: paragraph.product,
        totalTokens: paragraph.tokens,
        order: index + 1,
        published: true,
        aiCompanionEnabled: true,
        cropCount: 0,
        isArchived: false,
        // Een optionele paragraaf is een aanrader, geen voorwaarde. De app telt
        // hem niet mee in het percentage van het hoofdstuk.
        optioneel,
        verplicht: !optioneel,
        // normalizeParagraphMetadata leest learningGoals; leerdoelen staat erbij
        // omdat de CMS-editor dat veld schrijft. Leeg blijft leeg.
        ...(learningGoals.length ? { learningGoals, leerdoelen: learningGoals } : {})
      };
    })
  );

  const contentBlocks = chapters.flatMap((chapter) =>
    chapter.paragraphs.flatMap((paragraph) =>
      buildBlocks(chapter, paragraph, verbodenLeerdoelenPerHoofdstuk.get(chapter.chapter) || new Map())
    )
  );

  const badges = chapters.map((chapter) => ({
    id: badgeDocId(niveau, chapter.chapter),
    title: chapter.badge,
    niveauId,
    hoofdstukId: hoofdstukDocId(niveau, chapter.chapter),
    // Een vrijwillige plusparagraaf hoort niet in de eisen van de badge: wie hem
    // overslaat mist niets van de leerlijn.
    requiredParagrafen: chapter.paragraphs
      .filter((paragraph) => paragraph.optioneel !== true)
      .map((paragraph) => paragraafDocId(niveau, paragraph.code)),
    tokenIndependent: true
  }));

  const certificates = badges.length
    ? [
        {
          id: `basis-certificaat-dv-${niveau}`,
          niveauId,
          title: 'Basis-certificaat',
          requirement: `${Math.max(1, badges.length - 1)} van ${badges.length} badges + herstelportfolio + eindreflectie`,
          tokenIndependent: true
        },
        {
          id: `volledig-certificaat-dv-${niveau}`,
          niveauId,
          title: 'Volledig certificaat',
          requirement: `${badges.length} van ${badges.length} badges + portfolio + eindreflectie`,
          tokenIndependent: true
        }
      ]
    : [];

  // Dezelfde feedbackzin in paragraaf na paragraaf is sjabloontekst, geen uitleg.
  const hergebruikteFeedback = [...feedbackParagrafen.entries()].filter(([, codes]) => codes.size > MAX_PARAGRAFEN_PER_FEEDBACK);
  if (hergebruikteFeedback.length) {
    const details = hergebruikteFeedback
      .map(([feedback, codes]) => `"${feedback.slice(0, 60)}..." in ${[...codes].join(', ')}`)
      .join('; ');
    throw new Error(`${niveau}: feedbackzin mag in maximaal ${MAX_PARAGRAFEN_PER_FEEDBACK} paragrafen staan: ${details}`);
  }

  return { niveau, niveauId, hoofdstukken, paragrafen, contentBlocks, badges, certificates, missingAssessments };
};

// ---------------------------------------------------------------------------
// Alle leerwegen achter elkaar
// ---------------------------------------------------------------------------

const resultaten = [];
for (const niveau of NIVEAUS) {
  const chapters = await loadChapters(niveau.id);
  const enrichment = await loadEnrichment(niveau.id);
  if (chapters.length) {
    console.log(`[${niveau.id}] Hoofdstukken geladen: ${chapters.map((chapter) => `h${chapter.chapter}`).join(', ')}.`);
  }
  // Een ontbrekend of kapot hoofdstukbestand is een waarschuwing, maar inhoud
  // die de regels breekt (een toetsvraag over een vrijwillige plusparagraaf,
  // een tokentotaal dat niet klopt) stopt de build. Wat er dan misging hoort
  // leesbaar in beeld te staan en niet als stacktrace: de bouwers van de
  // hoofdstukken zijn geen JavaScript-programmeurs.
  try {
    resultaten.push(buildNiveau({ niveau: niveau.id, chapters, enrichment }));
  } catch (error) {
    console.error('');
    console.error(`[${niveau.id}] Bouwen gestopt: ${error.message}`);
    console.error(`De bestaande seed op ${outputPath} is niet aangeraakt; herstel het gemelde punt en draai opnieuw.`);
    console.error('Zet SEED_DEBUG=1 voor de volledige stacktrace.');
    if (process.env.SEED_DEBUG) console.error(error.stack);
    process.exit(1);
  }
}

// Zonder hoofdstukbestanden valt er niets te genereren. De bestaande seed blijft
// dan staan: hem overschrijven met een lege seed zou de leeromgeving leeghalen.
if (resultaten.every((resultaat) => resultaat.hoofdstukken.length === 0)) {
  console.log('');
  console.log('Geen hoofdstukken gevonden in scripts/seed-structuur/{bb,kb,tl}/ - er valt niets te genereren.');
  console.log('Zet per leerweg en per hoofdstuk een bestand h<n>.mjs neer dat een hoofdstukobject default exporteert;');
  console.log('zie de kop van scripts/seed-structuur/helpers.mjs en scripts/seed-verrijking/PATROON.md.');
  console.log(`De bestaande seed op ${outputPath} is niet aangeraakt.`);
  process.exit(0);
}

const seed = {
  meta: {
    seedId: 'digitale-vaardigheden-vmbo1',
    generatedAt: new Date().toISOString(),
    status: 'published',
    sourceDocuments: [
      'docs/LessenserieDigitaleVaardigheden30Lessen.md',
      'docs/wikiwijs_dacapo_huidige lessen.json',
      'docs/superpowers/specs/2026-06-04-digitale-vaardigheden-seed-design.md'
    ],
    internalSourceFieldsHiddenFromStudents: ['sourceBasis', 'sourceNotes'],
    leerwegen: NIVEAUS.map((niveau) => niveau.id)
  },
  vakken: [{
    id: VAK_ID,
    name: 'Digitale vaardigheden',
    code: 'DV',
    description: 'Digitale vaardigheden voor VMBO leerjaar 1',
    order: 99,
    isActive: true,
    color: '#2563eb',
    emoji: 'DV'
  }],
  leerjaren: [{
    id: LEERJAAR_ID,
    vakId: VAK_ID,
    year: 1,
    label: 'Leerjaar 1',
    order: 1,
    isActive: true
  }],
  // Drie leerwegen naast elkaar, onder hetzelfde vak en hetzelfde leerjaar.
  niveaus: NIVEAUS.map((niveau, index) => ({
    id: niveauDocId(niveau.id),
    vakId: VAK_ID,
    leerjaarId: LEERJAAR_ID,
    leerweg: niveau.id,
    label: niveau.label,
    name: niveau.label,
    description: `${niveau.label} van Digitale vaardigheden, VMBO leerjaar 1.`,
    order: index + 1,
    isActive: true
  })),
  hoofdstukken: resultaten.flatMap((resultaat) => resultaat.hoofdstukken),
  paragrafen: resultaten.flatMap((resultaat) => resultaat.paragrafen),
  contentBlocks: resultaten.flatMap((resultaat) => resultaat.contentBlocks),
  badges: resultaten.flatMap((resultaat) => resultaat.badges),
  certificates: resultaten.flatMap((resultaat) => resultaat.certificates)
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(seed, null, 2)}\n`);
console.log('');
console.log(`Generated ${outputPath}`);
console.log(`${seed.contentBlocks.length} content blocks for ${seed.paragrafen.length} paragrafen in ${seed.niveaus.length} leerwegen.`);

for (const resultaat of resultaten) {
  const label = NIVEAUS.find((niveau) => niveau.id === resultaat.niveau)?.label || resultaat.niveau;
  const plan = hoofdstukPlanVoorNiveau(resultaat.niveau);
  const geplandeParagrafen = plan.reduce((sum, chapter) => sum + chapter.codes.length, 0);

  console.log('');
  console.log(`${resultaat.niveau} - ${label}`);

  if (!resultaat.hoofdstukken.length) {
    console.log(`  nog geen hoofdstukken; het jaarplan noemt er ${plan.length} met ${geplandeParagrafen} paragrafen.`);
    continue;
  }

  const optioneleParagrafen = resultaat.paragrafen.filter((paragraaf) => paragraaf.optioneel === true);
  console.log(
    `  ${resultaat.hoofdstukken.length}/${plan.length} hoofdstukken, ` +
      `${resultaat.paragrafen.length}/${geplandeParagrafen} paragrafen ` +
      `(${optioneleParagrafen.length} vrijwillig), ${resultaat.contentBlocks.length} contentblokken.`
  );

  const theoryBlocks = resultaat.contentBlocks.filter((item) => item.type === 'theory');
  const summaryBlocks = resultaat.contentBlocks.filter((item) => item.type === 'summary');
  console.log(
    `  Verrijking: ${resultaat.paragrafen.filter((item) => item.learningGoals?.length).length}/${resultaat.paragrafen.length} paragrafen met leerdoelen, ` +
      `${theoryBlocks.filter((item) => item.content?.keyTerms?.length).length}/${theoryBlocks.length} theorieblokken met kernbegrippen, ` +
      `${theoryBlocks.filter((item) => item.content?.exampleHtml).length}/${theoryBlocks.length} met uitgewerkt voorbeeld, ` +
      `${summaryBlocks.filter((item) => item.content?.keyTerms?.length).length}/${summaryBlocks.length} samenvattingen verrijkt.`
  );

  const assessmentBlocks = resultaat.contentBlocks.filter((item) => item.type === 'quiz' || item.type === 'toets');
  const publishedAssessments = assessmentBlocks.filter((item) => item.status === 'published');
  const questionCount = publishedAssessments.reduce((sum, item) => sum + (item.content?.items?.length || 0), 0);
  const closedCount = publishedAssessments.reduce(
    (sum, item) => sum + (item.content?.items || []).filter((entry) => entry.type !== 'open').length,
    0
  );
  console.log(
    `  Toetsvragen: ${publishedAssessments.length}/${assessmentBlocks.length} quiz- en toetsblokken gepubliceerd, ` +
      `${questionCount} vragen (${closedCount} gesloten, ${questionCount - closedCount} open).`
  );

  if (resultaat.missingAssessments.length) {
    console.log(`  Nog geen toetsvragen (${resultaat.missingAssessments.length} van ${assessmentBlocks.length} blokken staan op draft):`);
    for (const entry of resultaat.missingAssessments) {
      console.log(`    ${entry.code}  ${entry.type.padEnd(5)}  ${entry.ideas} vraagideeën in content.pendingPrompts`);
    }
    console.log(`  Vul scripts/seed-verrijking/${resultaat.niveau}/h<n>.mjs aan onder de sleutel \`vragen\`; zie PATROON.md.`);
  } else {
    console.log('  Alle quiz- en toetsblokken hebben eigen vragen.');
  }
}

if (waarschuwingen.length) {
  console.log('');
  console.log(`${waarschuwingen.length} waarschuwing(en) hierboven; de seed is wel geschreven.`);
}

