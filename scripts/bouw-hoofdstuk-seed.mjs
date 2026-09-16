/**
 * Zet één aangeleverd hoofdstuk (het lichte formaat uit
 * docs/LESBLOKKEN-AANLEVERFORMAAT.md) om naar de documenten die de bibliotheek
 * kent, en voegt ze toe aan de seed van dat vak.
 *
 * Dit is de plek waar "een hoofdstuk van Kevin" een hoofdstuk in HELIX wordt.
 * Er is met opzet geen tweede importweg: wat hier uit komt gaat door dezelfde
 * seed-importer als al het andere lesmateriaal.
 *
 *   node scripts/bouw-hoofdstuk-seed.mjs --bron docs/seeds/<bestand>.json
 *   node scripts/bouw-hoofdstuk-seed.mjs --bron <bestand> --toon   # niets schrijven, alleen tonen
 *
 * Het bronbestand:
 *
 *   {
 *     "meta": {
 *       "vak": "Binask",                                  // label, voor de leesbaarheid
 *       "bron": "H3_Warmte_bron.pdf (Kevin, 3 oktober)",  // waar de inhoud vandaan komt
 *       "vakId": "vak-binask-eoa",
 *       "leerjaarId": "leerjaar-binask-eoa-1",
 *       "niveauId": "niveau-binask-eoa-1-lr3",
 *       "seedBestand": "docs/seeds/binask-eoa.seed.json",
 *       "blokPrefix": "binask-eoa-1",                     // bepaalt de id's
 *       "controleerTeksten": ["Q = m × c × ΔT"]           // optioneel: moet letterlijk voorkomen
 *     },
 *     "hoofdstuk":  { "nummer": 3, "titel": "...", "beschrijving": "..." },
 *     "paragrafen": [ { "code": "3.1", "titel": "...", "leerdoelen": [], "slidedeck": {...}, "blokken": [...] } ]
 *   }
 *
 * Id's zijn afleidbaar en dus stabiel: nogmaals draaien werkt hetzelfde
 * bestand bij in plaats van een tweede hoofdstuk te maken. Het hoofdstuk wordt
 * in de seed vervangen op id; aan andere hoofdstukken verandert niets.
 *
 * Slidedeck-blokken worden hier NIET gemaakt. Die hebben een PDF in Storage
 * nodig en komen van scripts/plaats-hoofdstuk-slidedecks.mjs, dat hetzelfde
 * bronbestand leest en volgnummer 1 inneemt. Daarom beginnen de tekstblokken
 * van een paragraaf mét deck bij volgnummer 2.
 */

import fs from 'node:fs';
import path from 'node:path';

import { normalizeAssessmentItems } from '../src/lib/assessmentBlockUtils.js';
import { normalizeContentBlockSettings } from '../src/lib/contentBlockUtils.js';
import { mediaKindForUrl } from './seed-structuur/helpers.mjs';
import { bouwVraagItems } from './lib/vraagItems.mjs';

const SCRIPT_NAAM = 'scripts/bouw-hoofdstuk-seed.mjs';

const argumenten = process.argv.slice(2);
const toon = argumenten.includes('--toon');
const optie = (naam, standaard = '') => {
  const index = argumenten.indexOf(naam);
  return index >= 0 && argumenten[index + 1] ? argumenten[index + 1] : standaard;
};

const bronPad = optie('--bron');
if (!bronPad) {
  console.error('Geef het bronbestand op: --bron docs/seeds/<bestand>.json');
  process.exit(1);
}

const bron = JSON.parse(fs.readFileSync(path.resolve(bronPad), 'utf8'));
const meta = bron.meta || {};

for (const veld of ['vakId', 'leerjaarId', 'niveauId', 'seedBestand', 'blokPrefix']) {
  if (!meta[veld]) {
    console.error(`meta.${veld} ontbreekt in ${bronPad}. Zonder dat veld weet ik niet waar dit hoofdstuk hoort.`);
    process.exit(1);
  }
}

const TEKSTTYPEN = new Set(['theory', 'example', 'summary']);
const VRAAGTYPEN = new Set(['quiz', 'toets']);
const BEKENDE_TYPEN = new Set([...TEKSTTYPEN, ...VRAAGTYPEN, 'media', 'question']);

// Per vak een eigen beleid, gelijk aan wat er nu in de bibliotheek staat.
// Binask: één poging en Digidocent uit, zoals Kevin voor die klassen vroeg.
// Digitale vaardigheden: oefenen mag vaker, de toets één keer.
const QUIZBELEID = {
  'vak-binask-eoa': {
    quiz: { maxAttempts: 1, tokens: 15, allowAiHelp: false },
    toets: { maxAttempts: 1, tokens: 30, allowAiHelp: false }
  },
  'vak-digitale-vaardigheden': {
    quiz: { maxAttempts: null, tokens: 30, allowAiHelp: true },
    toets: { maxAttempts: 1, tokens: 60, allowAiHelp: false }
  }
};
const beleidVoor = (type) => ({
  ...(QUIZBELEID[meta.vakId]?.[type] || { maxAttempts: 1, tokens: 20, allowAiHelp: type === 'quiz' }),
  ...(meta.quizBeleid?.[type] || {})
});

const escapeHtml = (tekst = '') =>
  String(tekst)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Kernbegrippen staan in de html zelf, als begrippenlijst: de leerlingpagina
// toont content.keyTerms niet, en .lesson-prose heeft wel opmaak voor <dl>.
const kernbegrippenHtml = (kernbegrippen = []) => {
  if (!kernbegrippen.length) return '';
  const items = kernbegrippen
    .map(({ begrip, uitleg }) => `<dt>${escapeHtml(begrip)}</dt><dd>${escapeHtml(uitleg)}</dd>`)
    .join('');
  return `<h3>Kernbegrippen</h3><dl>${items}</dl>`;
};

const codeKort = (code) => String(code).replace(/\./g, '');
const hoofdstukId = bron.hoofdstuk.id || `hoofdstuk-${meta.blokPrefix}-h${bron.hoofdstuk.nummer}`;
const paragraafId = (paragraaf) => paragraaf.id || `paragraaf-${meta.blokPrefix}-${codeKort(paragraaf.code)}`;
const blokId = (paragraaf, type, volgnummer) =>
  `block-${meta.blokPrefix}-${codeKort(paragraaf.code)}-${type}-${volgnummer}`;

const gedeeldeVelden = (paragraaf) => ({
  vakId: meta.vakId,
  leerjaarId: meta.leerjaarId,
  niveauId: meta.niveauId,
  hoofdstukId,
  paragraafId: paragraafId(paragraaf)
});

const bronNotitie = (blok) => {
  if (blok.schriftopdracht) {
    return `Bron: ${meta.bron}. Schriftopdracht: in het schrift maken, geen invoer en geen nakijken in Helix.`;
  }
  return `Bron: ${meta.bron}.`;
};

/* ---------- de blokken ---------- */

const bouwTekstblok = (paragraaf, blok, volgnummer) => {
  if (!blok.html || !blok.html.trim()) {
    throw new Error(`${paragraaf.code} "${blok.titel}": een ${blok.type}-blok zonder html toont de leerling een lege kaart.`);
  }
  const kernbegrippen = blok.kernbegrippen || [];
  return {
    id: blokId(paragraaf, blok.type, volgnummer),
    ...gedeeldeVelden(paragraaf),
    type: blok.type,
    order: volgnummer,
    title: blok.titel,
    status: 'published',
    content: {
      html: `${blok.html}${kernbegrippenHtml(kernbegrippen)}`,
      ...(kernbegrippen.length ? { keyTerms: kernbegrippen.map((item) => item.begrip) } : {}),
      crops: [],
      sourceBasis: ['docent-bron'],
      sourceNotes: bronNotitie(blok)
    },
    settings: normalizeContentBlockSettings({}, blok.type),
    linkedVraagId: null,
    createdBy: SCRIPT_NAAM,
    isArchived: false
  };
};

const bouwMediablok = (paragraaf, blok, volgnummer) => {
  if (!blok.url) throw new Error(`${paragraaf.code} "${blok.titel}": een mediablok heeft een url nodig.`);
  const kijkvraag = String(blok.kijkvraag || '').trim();
  return {
    id: blokId(paragraaf, 'media', volgnummer),
    ...gedeeldeVelden(paragraaf),
    type: 'media',
    order: volgnummer,
    title: blok.titel,
    status: 'published',
    content: {
      html: kijkvraag ? `<p>Kijkvraag: ${escapeHtml(kijkvraag)}</p>` : '',
      mediaKind: mediaKindForUrl(blok.url),
      mediaUrl: blok.url,
      caption: kijkvraag,
      altText: blok.titel || '',
      crops: [],
      sourceBasis: ['docent-bron'],
      sourceNotes: bronNotitie(blok)
    },
    settings: normalizeContentBlockSettings({}, 'media'),
    linkedVraagId: null,
    createdBy: SCRIPT_NAAM,
    isArchived: false
  };
};

// Een open vraag die de leerling intypt. Het modelantwoord is docentdata en
// staat in het invulveld, niet in de html: anders leest de leerling het
// antwoord voordat hij nadenkt.
const bouwVraagblok = (paragraaf, blok, volgnummer) => {
  const vragen = Array.isArray(blok.vragen) ? blok.vragen : [blok];
  const velden = vragen.map((vraag, index) => {
    const tekst = String(vraag.vraag || vraag.prompt || '').trim();
    if (!tekst) throw new Error(`${paragraaf.code} "${blok.titel}": open vraag ${index + 1} heeft geen tekst.`);
    return {
      id: `vraag-${index + 1}`,
      label: tekst,
      answer: '',
      ...(vraag.modelantwoord ? { modelAnswer: vraag.modelantwoord, explanation: vraag.uitleg || '' } : {}),
      ...(vraag.leerdoel ? { learningGoal: vraag.leerdoel } : {})
    };
  });

  return {
    id: blokId(paragraaf, 'question', volgnummer),
    ...gedeeldeVelden(paragraaf),
    type: 'question',
    order: volgnummer,
    title: blok.titel || 'Korte check',
    status: 'published',
    content: {
      html: [
        blok.inleiding ? `<p>${escapeHtml(blok.inleiding)}</p>` : '<p>Beantwoord de vraag in gewone zinnen.</p>',
        ...velden.map((veld, index) => `<p><strong>${index + 1}. ${escapeHtml(veld.label)}</strong></p>`)
      ].join('\n'),
      exercise: { fields: velden },
      crops: [],
      sourceBasis: ['docent-bron'],
      sourceNotes: bronNotitie(blok)
    },
    settings: normalizeContentBlockSettings({ allowAiHelp: blok.digidocent !== false }, 'question'),
    linkedVraagId: null,
    createdBy: SCRIPT_NAAM,
    isArchived: false
  };
};

const bouwToetsblok = (paragraaf, blok, volgnummer) => {
  const beleid = beleidVoor(blok.type);
  const tokens = Number.isFinite(blok.tokens) ? blok.tokens : beleid.tokens;
  const items = bouwVraagItems({
    vragen: blok.vragen || [],
    type: blok.type,
    label: `${paragraaf.code} ${blok.titel || blok.type}`,
    tokens,
    idPrefix: blok.type
  });

  return {
    id: blokId(paragraaf, blok.type, volgnummer),
    ...gedeeldeVelden(paragraaf),
    type: blok.type,
    order: volgnummer,
    title: blok.titel || (blok.type === 'toets' ? 'Toets' : 'Oefenquiz'),
    status: 'published',
    tokenTotal: tokens,
    content: {
      html: blok.inleiding ? `<p>${escapeHtml(blok.inleiding)}</p>` : '',
      assessmentType: blok.type,
      items: normalizeAssessmentItems(items),
      attemptPolicy: { maxAttempts: beleid.maxAttempts, scoring: 'best', allowTeacherReset: true },
      tokenConfig: { enabled: tokens > 0, totalTokens: tokens },
      crops: [],
      sourceBasis: ['docent-bron'],
      sourceNotes: bronNotitie(blok)
    },
    settings: normalizeContentBlockSettings({ allowAiHelp: beleid.allowAiHelp }, blok.type),
    linkedVraagId: null,
    createdBy: SCRIPT_NAAM,
    isArchived: false
  };
};

const bouwBlok = (paragraaf, blok, volgnummer) => {
  if (!BEKENDE_TYPEN.has(blok.type)) {
    throw new Error(`${paragraaf.code}: bloktype "${blok.type}" bestaat niet. Bekend: ${[...BEKENDE_TYPEN].join(', ')}.`);
  }
  if (TEKSTTYPEN.has(blok.type)) return bouwTekstblok(paragraaf, blok, volgnummer);
  if (blok.type === 'media') return bouwMediablok(paragraaf, blok, volgnummer);
  if (blok.type === 'question') return bouwVraagblok(paragraaf, blok, volgnummer);
  return bouwToetsblok(paragraaf, blok, volgnummer);
};

/* ---------- hoofdstuk, paragrafen, blokken ---------- */

const hoofdstuk = {
  id: hoofdstukId,
  vakId: meta.vakId,
  leerjaarId: meta.leerjaarId,
  niveauId: meta.niveauId,
  number: bron.hoofdstuk.nummer,
  title: bron.hoofdstuk.titel,
  description: bron.hoofdstuk.beschrijving || '',
  order: bron.hoofdstuk.nummer,
  published: true,
  isArchived: false
};

const paragrafen = [];
const contentBlocks = [];

bron.paragrafen.forEach((paragraaf, positie) => {
  paragrafen.push({
    id: paragraafId(paragraaf),
    vakId: meta.vakId,
    leerjaarId: meta.leerjaarId,
    niveauId: meta.niveauId,
    hoofdstukId,
    code: paragraaf.code,
    // De leerlingpagina haalt de code zelf van de titel af; hem hier meeschrijven
    // houdt de lijst in het beheerscherm leesbaar.
    title: `${paragraaf.code} ${paragraaf.titel}`,
    beschrijving: paragraaf.beschrijving || '',
    order: positie + 1,
    published: true,
    aiCompanionEnabled: true,
    cropCount: 0,
    isArchived: false,
    optioneel: false,
    verplicht: true,
    learningGoals: paragraaf.leerdoelen || [],
    leerdoelen: paragraaf.leerdoelen || []
  });

  // Volgnummer 1 is van het deck (plaats-hoofdstuk-slidedecks.mjs).
  let volgnummer = paragraaf.slidedeck ? 2 : 1;
  (paragraaf.blokken || []).forEach((blok) => {
    contentBlocks.push(bouwBlok(paragraaf, blok, volgnummer));
    volgnummer += 1;
  });
});

/* ---------- controles vóór het schrijven ---------- */

const fouten = [];

const dubbeleIds = contentBlocks.map((blok) => blok.id).filter((id, index, lijst) => lijst.indexOf(id) !== index);
if (dubbeleIds.length) fouten.push(`Dubbele blok-id's: ${[...new Set(dubbeleIds)].join(', ')}`);

const codes = paragrafen.map((paragraaf) => paragraaf.code);
if (new Set(codes).size !== codes.length) fouten.push(`Dubbele paragraafcodes: ${codes.join(', ')}`);

const alleHtml = contentBlocks.map((blok) => blok.content?.html || '').join('\n');

// Wat de leerling leest mag geen eigen invoervelden bevatten: een schriftopdracht
// hoort in het schrift, en een echt invulveld hoort bij een question- of
// quizblok, waar de app het zelf neerzet.
if (/<input|<textarea|<form|contenteditable/i.test(alleHtml)) {
  fouten.push('Er staat een invoerveld in de lesstof-html; laat de app die zelf maken.');
}

// Antwoorden in de leerlingtekst maken elke opdracht zinloos.
contentBlocks
  .filter((blok) => /Antwoord:|Antwoorden:|Uitwerking:/i.test(blok.content?.html || ''))
  .forEach((blok) => fouten.push(`${blok.id}: er staat een antwoord in de tekst die de leerling leest.`));

// Formules en eenheden die de bron noemt moeten letterlijk overkomen; een ρ die
// onderweg een p wordt maakt de hele paragraaf fout.
(meta.controleerTeksten || []).forEach((tekst) => {
  if (!alleHtml.includes(tekst)) fouten.push(`"${tekst}" komt niet letterlijk voor in de lesstof.`);
});

if (fouten.length) {
  console.error(`Het hoofdstuk is niet opgebouwd; ${fouten.length} probleem(en):`);
  fouten.forEach((fout) => console.error(`- ${fout}`));
  process.exit(1);
}

/* ---------- in de seed zetten ---------- */

const perType = contentBlocks.reduce((totalen, blok) => {
  totalen[blok.type] = (totalen[blok.type] || 0) + 1;
  return totalen;
}, {});
const samenvatting =
  `Hoofdstuk ${hoofdstuk.number} "${hoofdstuk.title}" (${hoofdstukId}): ` +
  `${paragrafen.length} paragrafen, ${contentBlocks.length} blokken ` +
  `(${Object.entries(perType).map(([type, aantal]) => `${aantal}x ${type}`).join(', ')}).`;

if (toon) {
  console.log(JSON.stringify({ hoofdstuk, paragrafen, contentBlocks }, null, 2));
  console.error(samenvatting);
  process.exit(0);
}

const seedPad = path.resolve(meta.seedBestand);
const seed = JSON.parse(fs.readFileSync(seedPad, 'utf8'));

// Vervangen op id, zodat nogmaals draaien bijwerkt in plaats van verdubbelt.
const zonderDitHoofdstuk = (lijst = [], sleutel) =>
  lijst.filter((item) => item[sleutel] !== hoofdstukId && item.id !== hoofdstukId);
seed.hoofdstukken = [...zonderDitHoofdstuk(seed.hoofdstukken, 'id'), hoofdstuk];
seed.paragrafen = [...zonderDitHoofdstuk(seed.paragrafen, 'hoofdstukId'), ...paragrafen];
seed.contentBlocks = [...zonderDitHoofdstuk(seed.contentBlocks, 'hoofdstukId'), ...contentBlocks];

fs.writeFileSync(seedPad, `${JSON.stringify(seed, null, 2)}\n`, 'utf8');

console.log(samenvatting);
console.log(`Bijgewerkt: ${path.relative(process.cwd(), seedPad)}`);
const metDeck = bron.paragrafen.filter((paragraaf) => paragraaf.slidedeck).map((paragraaf) => paragraaf.code);
if (metDeck.length) {
  console.log(`Decks volgen via scripts/plaats-hoofdstuk-slidedecks.mjs --bron ${bronPad}: ${metDeck.join(', ')}.`);
}
