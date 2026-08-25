import test from 'node:test';
import assert from 'node:assert/strict';

import { buildPublicQuestionSnapshot } from './publicQuestionView.js';
import { buildPublicContentBlockSnapshot } from './publicContentBlockView.js';

// WAAROM DEZE TEST BESTAAT
//
// `explanation` en `misconception` leggen per optie uit waarom een antwoord
// goed of fout is. Dat is prachtige feedback NA het beoordelen, maar vooraf is
// het letterlijk de antwoordsleutel: wie de zin "Wat in OneDrive staat, staat op
// elk apparaat waar je inlogt" naast optie 3 ziet staan, hoeft niet meer na te
// denken. Een leerling kan de netwerkrespons in de browser openen, dus die
// zinnen mogen NIET in de publieke snapshot terechtkomen.
//
// publicQuestionView.test.js borgt dit per veld voor een losse vraag. Deze test
// is de vangrail eromheen: hij scant de VOLLEDIGE snapshot - losse vraag en
// toets- of quizblok - op de zinnen zelf en op de veldnamen, zodat het niet
// stilletjes kan terugsluipen via een nieuw vraagtype of een extra veld.
//
// De uitleg hoort terug te komen via het server-side nakijkpad
// (gradeClosedQuestion -> answerExplanationFeedback.js), pas na het antwoorden.

const GEHEIME_UITLEG = 'UITLEG_MAG_NIET_VOORAF_LEKKEN';
const GEHEIME_DENKFOUT = 'DENKFOUT_MAG_NIET_VOORAF_LEKKEN';

const opties = () => [
  { id: 'optie-1', text: 'Op een USB-stick in je etui.', correct: false, misconception: GEHEIME_DENKFOUT },
  { id: 'optie-2', text: 'In je OneDrive van je schoolaccount.', correct: true, explanation: GEHEIME_UITLEG }
];

const collectKeys = (value, keys = new Set()) => {
  if (Array.isArray(value)) {
    value.forEach((entry) => collectKeys(entry, keys));
    return keys;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, entry]) => {
      keys.add(key);
      collectKeys(entry, keys);
    });
  }
  return keys;
};

const assertGeenSleutel = (snapshot, label) => {
  const serialized = JSON.stringify(snapshot);
  [GEHEIME_UITLEG, GEHEIME_DENKFOUT].forEach((secret) => {
    assert.equal(serialized.includes(secret), false, `${label}: de uitleg lekte via ${secret}`);
  });

  const keys = collectKeys(snapshot);
  assert.equal(keys.has('explanation'), false, `${label}: veld explanation staat in de snapshot`);
  assert.equal(keys.has('misconception'), false, `${label}: veld misconception staat in de snapshot`);
  assert.equal(keys.has('correct'), false, `${label}: veld correct staat in de snapshot`);
};

test('de publieke snapshot van een losse meerkeuzevraag draagt geen uitleg per optie', () => {
  const snapshot = buildPublicQuestionSnapshot({
    id: 'vraag-1',
    status: 'published',
    vraagtype: 'meerkeuze',
    content: { text: '<p>Waar zet je het bestand neer?</p>' },
    antwoord: { type: 'meerkeuze', options: opties() }
  });

  assertGeenSleutel(snapshot, 'losse vraag');
  assert.deepEqual(snapshot.antwoord.options, [
    { id: 'optie-1', text: 'Op een USB-stick in je etui.' },
    { id: 'optie-2', text: 'In je OneDrive van je schoolaccount.' }
  ]);
});

test('de publieke snapshot van een toets- of quizblok draagt geen uitleg per optie', () => {
  ['quiz', 'toets'].forEach((blockType) => {
    const snapshot = buildPublicContentBlockSnapshot({
      id: `block-${blockType}`,
      type: blockType,
      status: 'published',
      paragraafId: 'paragraaf-dv-1-1',
      content: {
        assessmentType: blockType,
        items: [
          {
            id: 'item-1',
            type: 'meerkeuze',
            prompt: 'Waar zet je het bestand neer?',
            feedback: 'Schoolwerk hoort in je OneDrive.',
            answer: { type: 'meerkeuze', options: opties() }
          },
          {
            id: 'item-2',
            type: 'waar-niet-waar',
            prompt: 'De map Downloads is een bewaarplek.',
            answer: { type: 'meerkeuze', options: opties() }
          }
        ]
      }
    });

    assertGeenSleutel(snapshot, `${blockType}-blok`);
    assert.equal(snapshot.content.items.length, 2);
    assert.deepEqual(
      snapshot.content.items[0].answer.options.map((option) => option.text),
      ['Op een USB-stick in je etui.', 'In je OneDrive van je schoolaccount.']
    );
  });
});

test('ook het losse options-veld naast answer.options blijft schoon', () => {
  const snapshot = buildPublicContentBlockSnapshot({
    id: 'block-legacy',
    type: 'quiz',
    status: 'published',
    content: {
      items: [
        {
          id: 'item-legacy',
          type: 'meerkeuze',
          prompt: 'Oude vorm met options naast answer.',
          options: opties()
        }
      ]
    }
  });

  assertGeenSleutel(snapshot, 'legacy options');
  assert.equal(snapshot.content.items[0].options.length, 2);
});
