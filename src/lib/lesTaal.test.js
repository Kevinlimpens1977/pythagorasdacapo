import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LES_TALEN,
  antwoordInstructie,
  bronVingerafdruk,
  controleerTalenCompleet,
  getLesTaal,
  isLesTaal,
  isVertaalbaarBlok,
  taalLabel,
  taalNederlands,
  voegVertalingSamen
} from './lesTaal.js';

const blok = {
  id: 'blok-1',
  type: 'quiz',
  title: 'Stoffen',
  content: {
    html: '<p>Een stof heeft eigenschappen.</p>',
    items: [
      {
        id: 'v1',
        type: 'meerkeuze',
        prompt: 'Wat is een stof?',
        options: [
          { id: 'a', text: 'Iets wat je kunt aanraken' },
          { id: 'b', text: 'Een kleur' }
        ],
        answer: { multiple: false },
        tokens: 5
      },
      { id: 'v2', type: 'open', prompt: 'Noem twee stoffen.', answer: {} }
    ]
  }
};

const vertaling = {
  titel: 'Ουσίες',
  html: '<p>Μια ουσία έχει ιδιότητες.</p>',
  items: [
    {
      id: 'v1',
      prompt: 'Τι είναι μια ουσία;',
      options: [{ id: 'a', text: 'Κάτι που μπορείς να αγγίξεις' }, { id: 'b', text: 'Ένα χρώμα' }]
    }
  ]
};

test('een taal geldt alleen als hij in de lijst staat', () => {
  assert.equal(isLesTaal('el'), true);
  assert.equal(isLesTaal('it'), true);
  assert.equal(isLesTaal('nl'), false);
  assert.equal(isLesTaal(''), false);
  assert.equal(isLesTaal(undefined), false);
  assert.equal(taalLabel('el'), 'Ελληνικά');
  assert.equal(taalLabel('xx'), '');
});

test('getLesTaal leest de taal van de leerling en weigert onzin', () => {
  assert.equal(getLesTaal({ lesTaal: 'it' }), 'it');
  assert.equal(getLesTaal({ lesTaal: ' el ' }), 'el');
  assert.equal(getLesTaal({ lesTaal: 'klingon' }), '');
  assert.equal(getLesTaal({}), '');
  assert.equal(getLesTaal(null), '');
});

test('alleen tekstblokken zijn vertaalbaar', () => {
  assert.equal(isVertaalbaarBlok({ type: 'theory' }), true);
  assert.equal(isVertaalbaarBlok({ type: 'question' }), true);
  assert.equal(isVertaalbaarBlok({ type: 'quiz' }), true);
  assert.equal(isVertaalbaarBlok({ type: 'toets' }), true);
  assert.equal(isVertaalbaarBlok({ type: 'summary' }), true);
  assert.equal(isVertaalbaarBlok({ type: 'slidedeck' }), false);
  assert.equal(isVertaalbaarBlok({ type: 'media' }), false);
  assert.equal(isVertaalbaarBlok({ type: 'game' }), false);
  assert.equal(isVertaalbaarBlok(null), false);
});

test('een vraagblok met linkedVraagId is niet vertaalbaar', () => {
  // De tekst van zo'n blok komt uit het losse vraagdocument (linkedVraag),
  // dat voegVertalingSamen niet raakt. Alleen de titel zou vertaald worden
  // en de rest Nederlands blijven - dus behandelen we het blok als geheel
  // niet vertaalbaar.
  assert.equal(isVertaalbaarBlok({ type: 'question', linkedVraagId: 'vraag-1' }), false);
  assert.equal(isVertaalbaarBlok({ type: 'question', linkedVraagId: '' }), true);
  assert.equal(isVertaalbaarBlok({ type: 'question' }), true);
});

test('de vingerafdruk volgt de zichtbare tekst en niets anders', () => {
  const zelfde = JSON.parse(JSON.stringify(blok));
  assert.equal(bronVingerafdruk(blok), bronVingerafdruk(zelfde));

  // Een gewijzigde vraagtekst levert een andere vingerafdruk.
  const gewijzigd = JSON.parse(JSON.stringify(blok));
  gewijzigd.content.items[0].prompt = 'Wat is precies een stof?';
  assert.notEqual(bronVingerafdruk(blok), bronVingerafdruk(gewijzigd));

  // Iets dat de leerling niet leest, verandert de vingerafdruk niet.
  const zelfdeTekst = JSON.parse(JSON.stringify(blok));
  zelfdeTekst.content.items[0].tokens = 99;
  assert.equal(bronVingerafdruk(blok), bronVingerafdruk(zelfdeTekst));
});

test('samenvoegen vervangt tekst en laat kenmerken en antwoordgegevens staan', () => {
  const samen = voegVertalingSamen(blok, vertaling);

  assert.equal(samen.title, 'Ουσίες');
  assert.equal(samen.content.html, '<p>Μια ουσία έχει ιδιότητες.</p>');
  assert.equal(samen.content.items[0].prompt, 'Τι είναι μια ουσία;');
  assert.equal(samen.content.items[0].options[0].text, 'Κάτι που μπορείς να αγγίξεις');

  // Kenmerken, antwoordgegevens en volgorde blijven ongemoeid.
  assert.equal(samen.content.items[0].id, 'v1');
  assert.equal(samen.content.items[0].options[0].id, 'a');
  assert.equal(samen.content.items[0].tokens, 5);
  assert.deepEqual(samen.content.items[0].answer, { multiple: false });
  assert.equal(samen.content.items.length, 2);

  // Een vraag zonder vertaling houdt zijn Nederlandse tekst.
  assert.equal(samen.content.items[1].prompt, 'Noem twee stoffen.');

  // Het origineel is niet aangeraakt.
  assert.equal(blok.title, 'Stoffen');
});

test('samenvoegen zonder vertaling geeft het blok ongewijzigd terug', () => {
  assert.equal(voegVertalingSamen(blok, null), blok);
});

test('de antwoordinstructie staat vast in de code, niet in het model', () => {
  assert.match(antwoordInstructie('el'), /ολλανδικά|Ολλανδικά/);
  assert.match(antwoordInstructie('it'), /olandese/i);
  assert.equal(antwoordInstructie('nl'), '');
  assert.equal(antwoordInstructie(''), '');
});

test('de Nederlandse naam van een taal komt uit LES_TALEN', () => {
  assert.equal(taalNederlands('el'), 'Grieks');
  assert.equal(taalNederlands(' it '), 'Italiaans');
  assert.equal(taalNederlands('nl'), '');
  assert.equal(taalNederlands(''), '');
});

test('elke taal in de lijst heeft een Nederlandse naam en een antwoordinstructie', () => {
  assert.equal(controleerTalenCompleet(), true);
  LES_TALEN.forEach((taal) => {
    assert.ok(taalNederlands(taal.code), `${taal.code} mist een Nederlandse naam`);
    assert.ok(antwoordInstructie(taal.code), `${taal.code} mist een antwoordinstructie`);
  });
});

test('een taal zonder antwoordinstructie of Nederlandse naam faalt hard, niet stil', () => {
  assert.throws(
    // Een taal die nog niet in LES_TALEN staat: die heeft dus ook nog geen
    // antwoordinstructie, en dat hoort hard te falen.
    () => controleerTalenCompleet([{ code: 'fr', label: 'Français', nederlands: 'Frans' }]),
    /antwoordinstructie/i
  );
  assert.throws(
    () => controleerTalenCompleet([{ code: 'el', label: 'Ελληνικά' }]),
    /Nederlandse naam/i
  );
});
