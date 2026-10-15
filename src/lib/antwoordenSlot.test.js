import test from 'node:test';
import assert from 'node:assert/strict';

import { buildChapterOutline, buildResumePointer } from './chapterOutline.js';
import {
  SLOT_REDEN_HOOFDSTUK_EERST_AF,
  SLOT_REDEN_VOORGAANDE_EERST_AF,
  antwoordenSlotTekst,
  antwoordenSlotVoorParagraaf,
  isAntwoordenParagraaf,
  isNaVoorgaandeParagraaf,
  markeerAntwoordenSlot,
  markeerParagraafSloten,
  paragraafSlotTekst,
  telNogTeGaanVoorAntwoorden,
  telNogTeGaanVoorVoorgaande,
  voorgaandeSlotTekst,
  voorgaandeSlotVoorParagraaf
} from './antwoordenSlot.js';
import { aantalVragenInBlok, isBlokStriktAf } from './studentLessonProgress.js';

const blok = (id, type = 'theory') => ({ id, type, title: id });
const af = (blockId) => ({ blockId, completed: true });

// Een hoofdstuk zoals de leerling het ziet: twee gewone paragrafen, een
// plusparagraaf en de antwoordenparagraaf 1.A.
const bouwHoofdstuk = (voortgangMap = {}, extra = {}) => buildChapterOutline({
  hoofdstuk: { id: 'h1', number: 1, title: 'Hoofdstuk 1' },
  paragrafen: [
    { id: 'p1', hoofdstukId: 'h1', code: '1.1', title: 'Massa', order: 1, contentBlocks: [blok('a1'), blok('a2')] },
    { id: 'p2', hoofdstukId: 'h1', code: '1.2', title: 'Volume', order: 2, contentBlocks: [blok('b1'), blok('b2', 'quiz')] },
    { id: 'plus', hoofdstukId: 'h1', code: '1.3', title: 'Plus', order: 3, optioneel: true, contentBlocks: [blok('c1')] },
    { id: 'antw', hoofdstukId: 'h1', code: '1.A', title: 'Uitwerkingen en antwoorden', order: 9, ontgrendelNaHoofdstuk: true, contentBlocks: [blok('d1')] },
    ...(extra.paragrafen || [])
  ],
  voortgangMap
});

test('isAntwoordenParagraaf kijkt alleen naar ontgrendelNaHoofdstuk === true', () => {
  assert.equal(isAntwoordenParagraaf({ ontgrendelNaHoofdstuk: true }), true);
  assert.equal(isAntwoordenParagraaf({ ontgrendelNaHoofdstuk: 'ja' }), false);
  assert.equal(isAntwoordenParagraaf({}), false);
  assert.equal(isAntwoordenParagraaf(null), false);
});

test('telt open onderdelen zonder plusstof en zonder de antwoorden zelf', () => {
  const hoofdstuk = bouwHoofdstuk({ p1: [af('a1')] });
  // a2, b1 en b2 staan nog open; c1 (plus) en d1 (antwoorden) tellen niet.
  assert.equal(telNogTeGaanVoorAntwoorden(hoofdstuk), 3);
});

test('een gearchiveerde paragraaf telt niet mee', () => {
  const hoofdstuk = bouwHoofdstuk({}, {
    paragrafen: [{ id: 'oud', hoofdstukId: 'h1', code: '1.4', title: 'Oud', order: 4, isArchived: true, contentBlocks: [blok('e1')] }]
  });
  assert.equal(telNogTeGaanVoorAntwoorden(hoofdstuk), 4);
});

test('antwoordenparagraaf staat op slot zolang er iets openstaat', () => {
  const [hoofdstuk] = markeerAntwoordenSlot([bouwHoofdstuk({ p1: [af('a1')] })]);
  const antwoorden = hoofdstuk.paragraphRows.find((rij) => rij.id === 'antw');
  assert.equal(antwoorden.vergrendeld, true);
  assert.equal(antwoorden.slotReden, SLOT_REDEN_HOOFDSTUK_EERST_AF);
  assert.equal(antwoorden.nogTeGaan, 3);
  // Andere rijen blijven open.
  assert.equal(hoofdstuk.paragraphRows.find((rij) => rij.id === 'p1').vergrendeld, undefined);
});

test('antwoordenparagraaf gaat open als alles af is, ook zonder de plusparagraaf', () => {
  const [hoofdstuk] = markeerAntwoordenSlot([
    bouwHoofdstuk({ p1: [af('a1'), af('a2')], p2: [af('b1'), af('b2')] })
  ]);
  const antwoorden = hoofdstuk.paragraphRows.find((rij) => rij.id === 'antw');
  assert.notEqual(antwoorden.vergrendeld, true);
});

test('een beheerder ziet de antwoorden altijd open', () => {
  const invoer = [bouwHoofdstuk()];
  const [hoofdstuk] = markeerAntwoordenSlot(invoer, { beheerder: true });
  assert.notEqual(hoofdstuk.paragraphRows.find((rij) => rij.id === 'antw').vergrendeld, true);
});

test('een klasslot op de rij gaat voor en houdt zijn eigen reden', () => {
  const hoofdstuk = bouwHoofdstuk();
  const metKlasslot = {
    ...hoofdstuk,
    paragraphRows: hoofdstuk.paragraphRows.map((rij) => (rij.id === 'antw' ? { ...rij, vergrendeld: true } : rij))
  };
  const [uit] = markeerAntwoordenSlot([metKlasslot]);
  const antwoorden = uit.paragraphRows.find((rij) => rij.id === 'antw');
  assert.equal(antwoorden.vergrendeld, true);
  assert.equal(antwoorden.slotReden, undefined);
});

test('verder waar je was slaat de antwoorden over zolang ze op slot staan', () => {
  // Alles af behalve de antwoorden: zonder slot zou "verder" naar 1.A wijzen.
  const open = bouwHoofdstuk({ p1: [af('a1'), af('a2')], p2: [af('b1')] });
  const [opSlot] = markeerAntwoordenSlot([open]);
  assert.equal(buildResumePointer([opSlot]).paragraafId, 'p2');
  // Een quiz uit de antwoorden zou ook niet bij de toetsen mogen staan.
  assert.ok(opSlot.oefentoetsRows.every((rij) => rij.paragraafId !== 'antw'));
});

test('antwoordenSlotVoorParagraaf geeft de stand voor de lespagina', () => {
  const chapters = markeerAntwoordenSlot([bouwHoofdstuk({ p1: [af('a1')] })]);
  assert.deepEqual(antwoordenSlotVoorParagraaf(chapters, 'antw'), {
    gevonden: true,
    vergrendeld: true,
    nogTeGaan: 3,
    hoofdstukId: 'h1'
  });
  assert.equal(antwoordenSlotVoorParagraaf(chapters, 'p1').vergrendeld, false);
});

test('antwoordenSlotTekst noemt hoeveel er nog te gaan is', async () => {
  const { uiAantal, uiTekst } = await import('./uiTaal.js');
  const taal = { tekst: (sleutel) => uiTekst(sleutel, ''), aantal: (basis, n) => uiAantal(basis, n, '') };
  assert.equal(antwoordenSlotTekst(5, taal), 'Maak eerst alle onderdelen van dit hoofdstuk af. Nog 5 te gaan.');
  assert.equal(antwoordenSlotTekst(1, taal), 'Maak eerst alle onderdelen van dit hoofdstuk af. Nog 1 te gaan.');
  assert.equal(antwoordenSlotTekst(null, taal), 'Maak eerst alle onderdelen van dit hoofdstuk af.');
  assert.equal(antwoordenSlotTekst(3, null), 'Maak eerst alle onderdelen van dit hoofdstuk af.');
});

test('een paragraaf die niet in het overzicht staat blijft dicht', () => {
  assert.deepEqual(antwoordenSlotVoorParagraaf([], 'antw'), {
    gevonden: false,
    vergrendeld: true,
    nogTeGaan: null,
    hoofdstukId: ''
  });
});

// ---------------------------------------------------------------------------
// Oefentoets achteraan: pas open als alles ervoor strikt af is.
// ---------------------------------------------------------------------------

const quiz = (id, aantalVragen) => ({
  id,
  type: 'quiz',
  title: id,
  content: { items: Array.from({ length: aantalVragen }, (_, index) => ({ id: `${id}-v${index + 1}` })) }
});
const quizAf = (blockId, itemsCompleted) => ({ blockId, completed: true, blockType: 'quiz', itemsCompleted });
const vraagAf = (blockId) => ({ blockId, completed: true, blockType: 'question', attempts: 1, lastAnswer: { value: 'a' } });

// Een hoofdstuk zoals Binask H2: twee paragrafen (de tweede met een quiz van
// drie vragen), een plusparagraaf, de antwoorden (90), de oefentoets (95) en
// voor de test nog een paragraaf erachter (99).
const toetsParagrafen = [
  { id: 'q1', hoofdstukId: 'h2', code: '2.1', title: 'Massa', order: 1, contentBlocks: [blok('a1'), blok('v1', 'question')] },
  { id: 'q2', hoofdstukId: 'h2', code: '2.2', title: 'Volume', order: 2, contentBlocks: [blok('b1'), quiz('bq', 3)] },
  { id: 'plus', hoofdstukId: 'h2', code: '2.6', title: 'Plus', order: 6, optioneel: true, contentBlocks: [blok('c1')] },
  { id: 'antw', hoofdstukId: 'h2', code: '2.A', title: 'Uitwerkingen en antwoorden', order: 90, ontgrendelNaHoofdstuk: true, contentBlocks: [blok('d1')] },
  { id: 'toets', hoofdstukId: 'h2', code: '2.T', title: 'Oefentoets', order: 95, ontgrendelNaVoorgaande: true, contentBlocks: [quiz('tq', 10)] },
  { id: 'na', hoofdstukId: 'h2', code: '2.Z', title: 'Erna', order: 99, contentBlocks: [blok('z1')] }
];

const bouwToetsHoofdstuk = (voortgangMap = {}, { zonder = [] } = {}) => buildChapterOutline({
  hoofdstuk: { id: 'h2', number: 2, title: 'Hoofdstuk 2' },
  paragrafen: toetsParagrafen.filter((paragraaf) => !zonder.includes(paragraaf.id)),
  voortgangMap
});

const alleVoortgangVoorToets = (extra = {}) => ({
  q1: [af('a1'), vraagAf('v1')],
  q2: [af('b1'), quizAf('bq', 3)],
  antw: [af('d1')],
  ...extra
});

const rijVan = (hoofdstuk, id) => [hoofdstuk.introRow, ...hoofdstuk.voorkennisRows, ...hoofdstuk.paragraphRows]
  .find((rij) => rij?.id === id);

test('isBlokStriktAf: quiz pas af als alle vragen van nu beantwoord zijn', () => {
  const blokNu = quiz('block-binask-eoa-1-25-theory-5', 10);
  // Hasan: oud record uit de tijd dat dit een theorieblok was.
  const hasan = { blockId: blokNu.id, completed: true, blockType: 'theory', itemsCompleted: 0 };
  assert.equal(isBlokStriktAf(blokNu, [hasan]), false);
  assert.equal(isBlokStriktAf(blokNu, [quizAf(blokNu.id, 9)]), false);
  assert.equal(isBlokStriktAf(blokNu, [quizAf(blokNu.id, 10)]), true);
  // Alle vragen beantwoord maar het record staat niet op afgerond: niet af.
  assert.equal(isBlokStriktAf(blokNu, [{ blockId: blokNu.id, completed: false, itemsCompleted: 10 }]), false);
  assert.equal(isBlokStriktAf(blokNu, []), false);
});

test('isBlokStriktAf: losse vraag telt als één vraag, theorie alleen op afgerond', () => {
  const vraag = blok('v', 'question');
  assert.equal(isBlokStriktAf(vraag, [vraagAf('v')]), true);
  // Afgerond zonder antwoord (bijvoorbeeld een oud theorierecord): niet af.
  assert.equal(isBlokStriktAf(vraag, [{ blockId: 'v', completed: true, blockType: 'theory' }]), false);
  assert.equal(isBlokStriktAf(blok('t'), [af('t')]), true);
  assert.equal(isBlokStriktAf(blok('t'), []), false);
  assert.equal(aantalVragenInBlok(quiz('q', 4)), 4);
  assert.equal(aantalVragenInBlok({ type: 'toets', content: {} }), 0);
  assert.equal(aantalVragenInBlok(blok('x', 'question')), 1);
  assert.equal(aantalVragenInBlok(blok('x')), 0);
});

test('chapterOutline zet isStriktAf naast isDone', () => {
  const hoofdstuk = bouwToetsHoofdstuk({ q2: [af('b1'), quizAf('bq', 2)] });
  const quizOnderdeel = rijVan(hoofdstuk, 'q2').onderdelen.find((onderdeel) => onderdeel.id === 'bq');
  assert.equal(quizOnderdeel.isDone, true);
  assert.equal(quizOnderdeel.isStriktAf, false);
});

test('isNaVoorgaandeParagraaf kijkt alleen naar ontgrendelNaVoorgaande === true', () => {
  assert.equal(isNaVoorgaandeParagraaf({ ontgrendelNaVoorgaande: true }), true);
  assert.equal(isNaVoorgaandeParagraaf({ ontgrendelNaVoorgaande: 'ja' }), false);
  assert.equal(isNaVoorgaandeParagraaf(null), false);
});

test('oefentoets open als alles ervoor strikt af is; plusstof en wat erna komt tellen niet', () => {
  // De plusparagraaf en 2.Z (erna) zijn helemaal niet gemaakt.
  const [hoofdstuk] = markeerParagraafSloten([bouwToetsHoofdstuk(alleVoortgangVoorToets())]);
  assert.equal(rijVan(hoofdstuk, 'na').progress.done, 0);
  assert.equal(telNogTeGaanVoorVoorgaande(hoofdstuk, 'toets'), 0);
  assert.notEqual(rijVan(hoofdstuk, 'toets').vergrendeld, true);
});

test('oefentoets dicht zolang een quiz ervoor niet alle vragen heeft', () => {
  const voortgang = alleVoortgangVoorToets({ q2: [af('b1'), quizAf('bq', 2)] });
  const [hoofdstuk] = markeerParagraafSloten([bouwToetsHoofdstuk(voortgang, { zonder: ['na'] })]);
  const toets = rijVan(hoofdstuk, 'toets');
  assert.equal(toets.vergrendeld, true);
  assert.equal(toets.slotReden, SLOT_REDEN_VOORGAANDE_EERST_AF);
  assert.equal(toets.nogTeGaan, 1);
  // De gewone telling vindt de quiz wel af: de antwoorden gaan dus open.
  assert.notEqual(rijVan(hoofdstuk, 'antw').vergrendeld, true);
  // De quiz van de oefentoets staat nog niet bij de oefentoetsen.
  assert.ok(hoofdstuk.oefentoetsRows.every((rij) => rij.paragraafId !== 'toets'));
  assert.ok(hoofdstuk.oefentoetsRows.some((rij) => rij.paragraafId === 'q2'));
  // Verder waar je was wijst niet naar de oefentoets.
  assert.notEqual(buildResumePointer([hoofdstuk])?.paragraafId, 'toets');
});

test('oefentoets dicht bij een oud theorierecord op een blok dat nu een quiz is', () => {
  const voortgang = alleVoortgangVoorToets({
    q2: [af('b1'), { blockId: 'bq', completed: true, blockType: 'theory', itemsCompleted: 0 }]
  });
  const [hoofdstuk] = markeerParagraafSloten([bouwToetsHoofdstuk(voortgang)]);
  assert.equal(rijVan(hoofdstuk, 'toets').nogTeGaan, 1);
});

test('geen kringslot: de antwoorden wachten niet op de oefentoets, de oefentoets wel op de antwoorden', () => {
  // Alles af behalve 2.A en 2.T (en 2.Z, die er hier niet is).
  const ruw = bouwToetsHoofdstuk(alleVoortgangVoorToets({ antw: [] }), { zonder: ['na'] });
  // De oefentoets (10 open vragen) telt niet mee voor de antwoorden.
  assert.equal(telNogTeGaanVoorAntwoorden(ruw), 0);
  const [hoofdstuk] = markeerParagraafSloten([ruw]);
  assert.notEqual(rijVan(hoofdstuk, 'antw').vergrendeld, true);
  const toets = rijVan(hoofdstuk, 'toets');
  assert.equal(toets.vergrendeld, true);
  assert.equal(toets.nogTeGaan, 1);

  // Zodra 2.A gelezen is, gaat de oefentoets open.
  const [daarna] = markeerParagraafSloten([bouwToetsHoofdstuk(alleVoortgangVoorToets(), { zonder: ['na'] })]);
  assert.notEqual(rijVan(daarna, 'toets').vergrendeld, true);
});

test('een 2.A op slot telt mee voor de oefentoets', () => {
  const [hoofdstuk] = markeerParagraafSloten([bouwToetsHoofdstuk({})]);
  assert.equal(rijVan(hoofdstuk, 'antw').slotReden, SLOT_REDEN_HOOFDSTUK_EERST_AF);
  // a1, v1, b1, bq en d1: vijf onderdelen. c1 (plus) en z1 (erna) tellen niet.
  assert.equal(rijVan(hoofdstuk, 'toets').slotReden, SLOT_REDEN_VOORGAANDE_EERST_AF);
  assert.equal(rijVan(hoofdstuk, 'toets').nogTeGaan, 5);
});

test('een beheerder ziet de oefentoets altijd open', () => {
  const [hoofdstuk] = markeerParagraafSloten([bouwToetsHoofdstuk({})], { beheerder: true });
  assert.notEqual(rijVan(hoofdstuk, 'toets').vergrendeld, true);
  assert.notEqual(rijVan(hoofdstuk, 'antw').vergrendeld, true);
});

test('voorgaandeSlotVoorParagraaf en de slottekst voor de lespagina', async () => {
  const chapters = markeerParagraafSloten([bouwToetsHoofdstuk({})]);
  assert.deepEqual(voorgaandeSlotVoorParagraaf(chapters, 'toets'), {
    gevonden: true,
    vergrendeld: true,
    nogTeGaan: 5,
    hoofdstukId: 'h2'
  });
  // De antwoorden staan dicht om een andere reden: dat is niet dit slot.
  assert.equal(voorgaandeSlotVoorParagraaf(chapters, 'antw').vergrendeld, false);
  assert.equal(voorgaandeSlotVoorParagraaf([], 'toets').vergrendeld, true);

  const { uiAantal, uiTekst } = await import('./uiTaal.js');
  const taal = { tekst: (sleutel) => uiTekst(sleutel, ''), aantal: (basis, n) => uiAantal(basis, n, '') };
  assert.equal(
    voorgaandeSlotTekst(4, taal),
    'Maak eerst alle paragrafen hierboven helemaal af, ook alle toetsvragen. Nog 4 te gaan.'
  );
  assert.equal(
    voorgaandeSlotTekst(null, taal),
    'Maak eerst alle paragrafen hierboven helemaal af, ook alle toetsvragen.'
  );
  assert.equal(
    paragraafSlotTekst(rijVan(chapters[0], 'toets'), taal),
    'Maak eerst alle paragrafen hierboven helemaal af, ook alle toetsvragen. Nog 5 te gaan.'
  );
  assert.equal(
    paragraafSlotTekst(rijVan(chapters[0], 'antw'), taal),
    antwoordenSlotTekst(rijVan(chapters[0], 'antw').nogTeGaan, taal)
  );
  assert.equal(paragraafSlotTekst(rijVan(chapters[0], 'q1'), taal), '');
});
