import test from 'node:test';
import assert from 'node:assert/strict';
import {
  bouwControleContext,
  controleerAntwoordlengte,
  controleerOefenlaag,
  controleerStartvragenPerLeerdoel,
  controleerTerugkeervragen,
  controleerToetsdekking,
  controleerVragenIntegriteit,
  mechanischeControles,
  normaliseerPrompt,
  promptGelijkenis,
  telBevindingen
} from './seedMechanischeControles.js';

// ---------------------------------------------------------------------------
// Bouwstenen: een miniatuurseed van één leerweg, precies rijk genoeg om de zes
// mechanische controles te laten aanslaan of te laten zwijgen.
// ---------------------------------------------------------------------------

const DOEL_A = 'Je kunt uitleggen wat phishing is.';
const DOEL_B = 'Je weet waaraan je een verdachte mail herkent.';
const DOEL_C = 'Je kunt vertellen wat je doet na een verdachte mail.';

const veld = (label, learningGoal) => ({ id: `check-${label.length}`, label, answer: '', learningGoal });

const checkBlock = (code, velden, extra = {}) => ({
  id: `dv-tl-${code.replace('.', '-')}-question-check`,
  type: 'question',
  order: 2,
  paragraafId: `paragraaf-${code}`,
  hoofdstukId: 'hoofdstuk-h3',
  content: { html: '<p>Startcheck</p>', exercise: { fields: velden } },
  ...extra
});

const theoryBlock = (code, order = 3) => ({
  id: `dv-tl-${code.replace('.', '-')}-theory-1`,
  type: 'theory',
  order,
  paragraafId: `paragraaf-${code}`,
  hoofdstukId: 'hoofdstuk-h3',
  content: { html: '<p>Uitleg</p>' }
});

const oefenBlock = (code, groep, aantal = 2, order = 4) => ({
  id: `dv-tl-${code.replace('.', '-')}-question-oefenen-${groep}`,
  type: 'question',
  order,
  paragraafId: `paragraaf-${code}`,
  hoofdstukId: 'hoofdstuk-h3',
  content: {
    html: '<p>Oefenen</p>',
    exercise: { fields: Array.from({ length: aantal }, (_, i) => veld(`${groep} opgave ${i + 1}`, DOEL_A)) }
  }
});

const optie = (text, correct = false) => ({ id: `optie-${text.slice(0, 6)}`, text, correct });

const meerkeuze = (prompt, opties, learningGoal) => ({
  id: `vraag-${prompt.slice(0, 8)}`,
  type: 'meerkeuze',
  prompt,
  options: opties,
  answer: { type: 'meerkeuze', options: opties },
  feedback: 'Dit is de uitleg bij deze vraag, lang genoeg om te tellen.',
  taxonomy: { learningGoal }
});

const assessmentBlock = (code, type, items, order = 8) => ({
  id: `dv-tl-${code.replace('.', '-')}-${type}`,
  type,
  order,
  paragraafId: `paragraaf-${code}`,
  hoofdstukId: 'hoofdstuk-h3',
  status: 'published',
  content: { items }
});

const paragraaf = (code, learningGoals, extra = {}) => ({
  id: `paragraaf-${code}`,
  code,
  hoofdstukId: 'hoofdstuk-h3',
  niveauId: 'niveau-dv-vmbo1-tl',
  optioneel: false,
  verplicht: true,
  learningGoals,
  ...extra
});

// Drie afleiders die alle drie langer zijn dan het goede antwoord: zo is er op
// lengte niets te raden.
const goedeVraag = (prompt, learningGoal) =>
  meerkeuze(
    prompt,
    [
      optie('Een mailtje dat je bank je stuurt met een nieuw rekeningoverzicht erbij'),
      optie('Een nepbericht dat je gegevens wil', true),
      optie('Een reclame die je op je telefoon ziet terwijl je een filmpje kijkt'),
      optie('Een update van je besturingssysteem die je zelf hebt aangezet')
    ],
    learningGoal
  );

const bouw = ({ paragrafen, contentBlocks, checkpointCodes = [] }) =>
  bouwControleContext({ niveau: 'tl', paragrafen, contentBlocks, checkpointCodes });

// ---------------------------------------------------------------------------
// 1. Startvraag per leerdoel
// ---------------------------------------------------------------------------

test('1 slaagt: elk leerdoel heeft een eigen startvraag in het eerste checkblok', () => {
  const context = bouw({
    paragrafen: [paragraaf('3.1', [DOEL_A, DOEL_B, DOEL_C])],
    contentBlocks: [
      checkBlock('3.1', [veld('Wat denk jij dat phishing is?', DOEL_A), veld('Waaraan zie je dat?', DOEL_B), veld('En dan?', DOEL_C)]),
      theoryBlock('3.1')
    ]
  });
  assert.deepEqual(controleerStartvragenPerLeerdoel(context), []);
});

test('1 faalt: twee steekproefvragen voor drie leerdoelen, en de melding noemt het derde leerdoel', () => {
  const context = bouw({
    paragrafen: [paragraaf('3.1', [DOEL_A, DOEL_B, DOEL_C])],
    contentBlocks: [
      checkBlock('3.1', [veld('Wat denk jij dat phishing is?', DOEL_A), veld('Waaraan zie je dat?', DOEL_B)]),
      theoryBlock('3.1')
    ]
  });
  const bevindingen = controleerStartvragenPerLeerdoel(context);
  assert.equal(bevindingen.length, 1);
  assert.equal(bevindingen[0].soort, 'startvraag');
  assert.equal(bevindingen[0].code, '3.1');
  assert.equal(bevindingen[0].niveau, 'tl');
  assert.match(bevindingen[0].melding, /^tl 3\.1: /);
  assert.match(bevindingen[0].melding, /1 van de 3 leerdoelen/);
  assert.ok(bevindingen[0].melding.includes(DOEL_C));
});

test('1 faalt ook zonder startcheckblok en zonder leerdoel op de velden', () => {
  const zonderBlok = bouw({
    paragrafen: [paragraaf('3.1', [DOEL_A, DOEL_B])],
    contentBlocks: [theoryBlock('3.1')]
  });
  assert.match(controleerStartvragenPerLeerdoel(zonderBlok)[0].melding, /geen startcheckblok/);

  const zonderLeerdoel = bouw({
    paragrafen: [paragraaf('3.1', [DOEL_A, DOEL_B])],
    contentBlocks: [
      checkBlock('3.1', [{ id: 'check-1', label: 'Wat weet je al?', answer: '' }]),
      theoryBlock('3.1')
    ]
  });
  assert.match(controleerStartvragenPerLeerdoel(zonderLeerdoel)[0].melding, /geen enkele noemt een leerdoel/);
});

// ---------------------------------------------------------------------------
// 2. Antwoord niet te raden op lengte
// ---------------------------------------------------------------------------

const lengteContext = (langsteGoed) => {
  const items = [];
  for (let i = 0; i < 5; i += 1) {
    const kort = optie(`Kort antwoord ${i}`, true);
    const lang = optie(`Een veel langer antwoord dat de hele uitleg al weggeeft nummer ${i}`, true);
    const goede = i < langsteGoed ? lang : kort;
    const rest = i < langsteGoed
      ? [optie(`Kort fout ${i}a`), optie(`Kort fout ${i}b`), optie(`Kort fout ${i}c`)]
      : [
          optie(`Een veel langer fout antwoord dat je meteen doorziet nummer ${i}a`),
          optie(`Een veel langer fout antwoord dat je meteen doorziet nummer ${i}b`),
          optie(`Een veel langer fout antwoord dat je meteen doorziet nummer ${i}c`)
        ];
    items.push(meerkeuze(`Vraag nummer ${i} over phishing en verdachte berichten`, [goede, ...rest], DOEL_A));
  }
  return bouw({
    paragrafen: [paragraaf('3.1', [DOEL_A])],
    contentBlocks: [assessmentBlock('3.1', 'quiz', items)]
  });
};

test('2 slaagt: in 2 van de 5 vragen (40%) is het goede antwoord het langste', () => {
  assert.deepEqual(controleerAntwoordlengte(lengteContext(2)), []);
});

test('2 faalt: in 3 van de 5 vragen (60%) is het goede antwoord het langste, met percentage in de melding', () => {
  const bevindingen = controleerAntwoordlengte(lengteContext(3));
  assert.equal(bevindingen.length, 1);
  assert.equal(bevindingen[0].soort, 'antwoordlengte');
  assert.match(bevindingen[0].melding, /^tl 3\.1: /);
  assert.match(bevindingen[0].melding, /3 van de 5 keer het langste \(60%\)/);
});

// ---------------------------------------------------------------------------
// 3. Terugkeervragen
// ---------------------------------------------------------------------------

const terugkeerContext = (leerdoelVanTweedeVraag) =>
  bouw({
    paragrafen: [paragraaf('3.1', [DOEL_A]), paragraaf('3.2', [DOEL_B, DOEL_C])],
    contentBlocks: [
      assessmentBlock('3.1', 'quiz', [goedeVraag('Wat is phishing eigenlijk precies?', DOEL_A)]),
      {
        ...assessmentBlock('3.2', 'quiz', [
          goedeVraag('Waaraan herken je een verdachte mail van een onbekende afzender?', DOEL_B),
          goedeVraag('Wat doe je meteen nadat je zo een bericht binnenkrijgt?', leerdoelVanTweedeVraag)
        ]),
        paragraafId: 'paragraaf-3.2'
      }
    ]
  });

test('3 slaagt: de quiz van 3.2 haalt een leerdoel uit 3.1 op', () => {
  const bevindingen = controleerTerugkeervragen(terugkeerContext(DOEL_A));
  assert.deepEqual(bevindingen, []);
});

test('3 faalt: de quiz van 3.2 blijft volledig bij de eigen leerdoelen', () => {
  const bevindingen = controleerTerugkeervragen(terugkeerContext(DOEL_C));
  assert.equal(bevindingen.length, 1);
  assert.equal(bevindingen[0].soort, 'terugkeervraag');
  assert.equal(bevindingen[0].code, '3.2');
  assert.match(bevindingen[0].melding, /geen enkel leerdoel uit een eerdere paragraaf/);
});

test('3 slaat de eerste paragraaf van een hoofdstuk over', () => {
  const context = bouw({
    paragrafen: [paragraaf('3.1', [DOEL_A])],
    contentBlocks: [assessmentBlock('3.1', 'quiz', [goedeVraag('Wat is phishing eigenlijk precies?', DOEL_A)])]
  });
  assert.deepEqual(controleerTerugkeervragen(context), []);
});

// ---------------------------------------------------------------------------
// 4. Toetsdekking
// ---------------------------------------------------------------------------

const toetsContext = (toetsLeerdoelen) =>
  bouw({
    paragrafen: [
      paragraaf('3.1', [DOEL_A]),
      paragraaf('3.2', [DOEL_B]),
      paragraaf('3.3', [DOEL_C]),
      paragraaf('3.4', ['Je kunt een verdacht bericht herkennen en zeggen wat je dan doet.']),
      paragraaf('3.5', ['Je kunt uitleggen wat versleuteling is met een voorbeeld.'], { optioneel: true, verplicht: false })
    ],
    contentBlocks: [
      assessmentBlock(
        '3.4',
        'toets',
        toetsLeerdoelen.map((leerdoel, index) => goedeVraag(`Toetsvraag ${index + 1} over veilig internetten`, leerdoel))
      )
    ],
    checkpointCodes: ['3.4']
  });

test('4 slaagt: de toets bevraagt elk verplicht leerdoel en laat de plusparagraaf met rust', () => {
  const context = toetsContext([DOEL_A, DOEL_B, DOEL_C, 'Je kunt een verdacht bericht herkennen en zeggen wat je dan doet.']);
  assert.deepEqual(controleerToetsdekking(context), []);
});

test('4 faalt: een leerdoel ontbreekt en een plusleerdoel staat er ten onrechte in', () => {
  const context = toetsContext([
    DOEL_A,
    DOEL_B,
    'Je kunt een verdacht bericht herkennen en zeggen wat je dan doet.',
    'Je kunt uitleggen wat versleuteling is met een voorbeeld.'
  ]);
  const bevindingen = controleerToetsdekking(context);
  assert.equal(bevindingen.length, 2);
  assert.ok(bevindingen.every((item) => item.soort === 'toetsdekking'));

  const ontbreekt = bevindingen.find((item) => /bevraagt 1 van de 4 verplichte leerdoelen/.test(item.melding));
  assert.ok(ontbreekt, 'de ontbrekende dekking wordt gemeld');
  assert.ok(ontbreekt.melding.includes(DOEL_C));

  const teveel = bevindingen.find((item) => /vrijwillige plusparagraaf/.test(item.melding));
  assert.ok(teveel, 'het plusleerdoel wordt gemeld');
  assert.match(teveel.melding, /3\.5/);
});

// ---------------------------------------------------------------------------
// 5. Kapotte en dubbele vragen
// ---------------------------------------------------------------------------

const integriteitContext = (items) =>
  bouw({
    paragrafen: [paragraaf('3.1', [DOEL_A])],
    contentBlocks: [assessmentBlock('3.1', 'quiz', items)]
  });

test('5 slaagt: drie hele vragen zonder dubbelen', () => {
  const context = integriteitContext([
    goedeVraag('Wat is phishing eigenlijk precies voor iets?', DOEL_A),
    goedeVraag('Welke afzender hoort bij een betrouwbaar bericht van school?', DOEL_A),
    {
      id: 'vraag-open',
      type: 'open',
      prompt: 'Leg in je eigen woorden uit waarom phishing werkt.',
      answer: { type: 'open', modelAnswer: 'Omdat het bericht op een echt bericht lijkt en haast maakt.' },
      feedback: 'Een goed antwoord noemt de gelijkenis en de haast in het bericht.'
    }
  ]);
  assert.deepEqual(controleerVragenIntegriteit(context), []);
});

test('5 faalt: geen goed antwoord, alles goed, lege optie, lege prompt en een open vraag zonder modelAnswer', () => {
  const context = integriteitContext([
    meerkeuze('Welke van deze berichten is phishing volgens jou?', [optie('Eerste'), optie('Tweede'), optie('Derde')], DOEL_A),
    meerkeuze(
      'Welke kenmerken horen bij een phishingbericht van een onbekende?',
      [optie('Eerste', true), optie('Tweede', true), optie('Derde', true)],
      DOEL_A
    ),
    meerkeuze('Welk woord hoort hier niet bij volgens de uitleg?', [optie('Eerste', true), optie('Tweede'), optie('')], DOEL_A),
    { id: 'vraag-leeg', type: 'meerkeuze', prompt: '   ', options: [optie('Eerste', true), optie('Tweede'), optie('Derde')], answer: { type: 'meerkeuze', options: [optie('Eerste', true), optie('Tweede'), optie('Derde')] } },
    { id: 'vraag-open-leeg', type: 'open', prompt: 'Leg uit waarom je nooit op zo een link klikt.', answer: { type: 'open', modelAnswer: '' } }
  ]);
  const meldingen = controleerVragenIntegriteit(context).map((item) => item.melding);
  assert.equal(meldingen.length, 5);
  assert.ok(meldingen.some((melding) => /geen enkele optie staat als goed antwoord/.test(melding)));
  assert.ok(meldingen.some((melding) => /alle opties staan als goed antwoord/.test(melding)));
  assert.ok(meldingen.some((melding) => /antwoordoptie 3 heeft geen tekst/.test(melding)));
  assert.ok(meldingen.some((melding) => /lege vraagtekst/.test(melding)));
  assert.ok(meldingen.some((melding) => /open vraag zonder modelAnswer/.test(melding)));
});

test('5 faalt: twee vrijwel gelijke prompts binnen hetzelfde hoofdstuk', () => {
  const context = bouw({
    paragrafen: [paragraaf('3.1', [DOEL_A]), paragraaf('3.2', [DOEL_B])],
    contentBlocks: [
      assessmentBlock('3.1', 'quiz', [goedeVraag('Waaraan herken je een verdachte mail van een onbekende afzender?', DOEL_A)]),
      {
        ...assessmentBlock('3.2', 'quiz', [
          goedeVraag('Waaraan herken je een verdachte mail van een onbekende afzender!', DOEL_B)
        ]),
        paragraafId: 'paragraaf-3.2'
      }
    ]
  });
  const bevindingen = controleerVragenIntegriteit(context);
  assert.equal(bevindingen.length, 1);
  assert.equal(bevindingen[0].soort, 'vraagintegriteit');
  assert.match(bevindingen[0].melding, /woordelijk dezelfde vraag/);
});

test('5 telt twee prompts met 85% woordoverlap als vrijwel gelijk', () => {
  const a = normaliseerPrompt('Waaraan herken je een verdachte mail van een onbekende afzender?');
  const b = normaliseerPrompt('Waaraan herken je vandaag een verdachte mail van een onbekende afzender?');
  assert.ok(promptGelijkenis(a, b) >= 0.85);
  assert.ok(promptGelijkenis(normaliseerPrompt('Wat is een sterk wachtwoord?'), a) < 0.85);
});

// ---------------------------------------------------------------------------
// 6. Oefenlaag gevuld
// ---------------------------------------------------------------------------

test('6 slaagt: samen oefenen en zelf oefenen zijn allebei gevuld', () => {
  const context = bouw({
    paragrafen: [paragraaf('3.1', [DOEL_A])],
    contentBlocks: [theoryBlock('3.1'), oefenBlock('3.1', 'samen'), oefenBlock('3.1', 'zelf', 2, 5)]
  });
  assert.deepEqual(controleerOefenlaag(context), []);
});

test('6 faalt: zelf oefenen ontbreekt en samen oefenen is een leeg blok', () => {
  const context = bouw({
    paragrafen: [paragraaf('3.1', [DOEL_A])],
    contentBlocks: [theoryBlock('3.1'), oefenBlock('3.1', 'samen', 0)]
  });
  const bevindingen = controleerOefenlaag(context);
  assert.equal(bevindingen.length, 1);
  assert.equal(bevindingen[0].soort, 'oefenlaag');
  assert.match(bevindingen[0].melding, /^tl 3\.1: /);
  assert.match(bevindingen[0].melding, /leeg voor samen en zelf/);
});

test('6 laat een checkpoint met rust: een hoofdstuktoets heeft geen oefenlaag', () => {
  const context = bouw({
    paragrafen: [paragraaf('3.4', [DOEL_A])],
    contentBlocks: [theoryBlock('3.4')],
    checkpointCodes: ['3.4']
  });
  assert.deepEqual(controleerOefenlaag(context), []);
});

// ---------------------------------------------------------------------------
// Samenspel: mechanischeControles en telBevindingen
// ---------------------------------------------------------------------------

test('mechanischeControles bundelt de zes en telBevindingen groepeert per hoofdstuk en per soort', () => {
  const bevindingen = mechanischeControles({
    niveau: 'tl',
    paragrafen: [paragraaf('3.1', [DOEL_A, DOEL_B])],
    contentBlocks: [
      checkBlock('3.1', [veld('Wat denk jij dat phishing is?', DOEL_A)]),
      theoryBlock('3.1'),
      assessmentBlock('3.1', 'quiz', [goedeVraag('Wat is phishing eigenlijk precies?', DOEL_A)])
    ]
  });

  const soorten = new Set(bevindingen.map((item) => item.soort));
  assert.ok(soorten.has('startvraag'), 'het tweede leerdoel mist een startvraag');
  assert.ok(soorten.has('oefenlaag'), 'er is geen oefenblok');

  const telling = telBevindingen(bevindingen);
  assert.equal(telling.totaal, bevindingen.length);
  assert.equal(telling.perHoofdstuk.get(3).get('oefenlaag'), 1);
  assert.equal(telling.perSoort.get('startvraag'), 1);
});

test('een volledig in orde paragraafpaar levert geen enkele bevinding op', () => {
  const bevindingen = mechanischeControles({
    niveau: 'tl',
    paragrafen: [paragraaf('3.1', [DOEL_A]), paragraaf('3.2', [DOEL_B])],
    contentBlocks: [
      checkBlock('3.1', [veld('Wat denk jij dat phishing is?', DOEL_A)]),
      theoryBlock('3.1'),
      oefenBlock('3.1', 'samen'),
      oefenBlock('3.1', 'zelf', 2, 5),
      assessmentBlock('3.1', 'quiz', [
        goedeVraag('Wat is phishing eigenlijk precies voor iets?', DOEL_A),
        goedeVraag('Welke afzender hoort bij een betrouwbaar bericht?', DOEL_A)
      ]),
      { ...checkBlock('3.2', [veld('Waaraan zie je dat een mail niet klopt?', DOEL_B)]), paragraafId: 'paragraaf-3.2' },
      { ...theoryBlock('3.2'), paragraafId: 'paragraaf-3.2' },
      { ...oefenBlock('3.2', 'samen'), paragraafId: 'paragraaf-3.2' },
      { ...oefenBlock('3.2', 'zelf', 2, 5), paragraafId: 'paragraaf-3.2' },
      {
        ...assessmentBlock('3.2', 'quiz', [
          goedeVraag('Waaraan herken je een nepmail in je inbox?', DOEL_B),
          goedeVraag('Waarom noemen we zo een bericht een vorm van oplichting?', DOEL_A)
        ]),
        paragraafId: 'paragraaf-3.2'
      }
    ]
  });
  assert.deepEqual(bevindingen, []);
});
