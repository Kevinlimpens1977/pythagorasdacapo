import test from 'node:test';
import assert from 'node:assert/strict';

import { bordVoorHoofdstuk, bouwKlasbord, maakRijLabels, vergelijkParagraafCodes } from './klasbord.js';

const quiz = (id, paragraafId, order, aantal) => ({
  id, paragraafId, order, type: 'quiz', status: 'published', title: id,
  content: { items: Array.from({ length: aantal }, (_, i) => ({ id: `q${i}` })) }
});
const tekst = (id, paragraafId, order) => ({ id, paragraafId, order, type: 'theory', status: 'published', title: id });

const opzet = () => ({
  klas: { id: 'k1', name: 'Klas 1', enabledParagrafen: ['p21', 'p11', 'p2a', 'p-weg'] },
  paragrafen: new Map([
    ['p11', { id: 'p11', code: '1.1', title: '1.1 Start', hoofdstukId: 'h1' }],
    ['p21', { id: 'p21', code: '2.1', title: '2.1 Massa', hoofdstukId: 'h2' }],
    ['p2a', { id: 'p2a', code: '2.A', title: '2.A Antwoorden', hoofdstukId: 'h2' }],
    ['p-weg', { id: 'p-weg', code: '2.9', title: 'Weg', hoofdstukId: 'h2', isArchived: true }]
  ]),
  hoofdstukken: new Map([
    ['h1', { id: 'h1', number: 1, title: 'Een' }],
    ['h2', { id: 'h2', number: 2, title: 'Twee' }]
  ]),
  blokken: new Map([
    ['p11', [tekst('b11', 'p11', 1)]],
    ['p21', [quiz('b21q', 'p21', 2, 3), tekst('b21t', 'p21', 1), { ...tekst('b21x', 'p21', 3), status: 'draft' }]],
    ['p2a', [tekst('b2a', 'p2a', 1)]]
  ]),
  gebruikers: [
    { id: 'u1', klasId: 'k1', role: 'student', firstName: 'Sam', lastName: 'Bakker' },
    { id: 'u2', klasId: 'k1', role: 'student', firstName: 'Sam', lastName: 'Visser' },
    { id: 'u3', klasId: 'k1', role: 'student', firstName: 'Ali', isTestaccount: true },
    { id: 'u4', klasId: 'k2', role: 'student', firstName: 'Noor' },
    { id: 'u5', klasId: 'k1', role: 'student', displayName: 'Kevin Limpens' }
  ],
  voortgang: [
    { userId: 'u1', blockId: 'b11', completed: true, updatedAt: '2026-10-14T10:00:00Z' },
    { userId: 'u1', blockId: 'b21q', completed: true, itemsCompleted: 3, eersteScore: { itemCount: 3, itemsCorrect: 3 }, updatedAt: '2026-10-15T10:00:00Z' },
    { userId: 'u2', blockId: 'b21q', completed: true, itemsCompleted: 1, updatedAt: '2026-10-13T10:00:00Z' }
  ]
});

test('vergelijkParagraafCodes zet cijfers voor letters', () => {
  assert.deepEqual(['2.T', '2.10', '2.A', '2.2'].sort(vergelijkParagraafCodes), ['2.2', '2.10', '2.A', '2.T']);
});

test('maakRijLabels voegt bij dezelfde voornaam een letter toe', () => {
  assert.deepEqual(
    maakRijLabels([{ firstName: 'Sam', lastName: 'Bakker' }, { firstName: 'Sam', lastName: 'Visser' }, { firstName: 'Ivy' }]),
    ['Sam B.', 'Sam V.', 'Ivy']
  );
});

test('bouwKlasbord: kolommen op volgorde, alleen gepubliceerd en toegewezen', () => {
  const bord = bouwKlasbord(opzet());
  assert.deepEqual(bord.kolommen.map((k) => k.blockId), ['b11', 'b21t', 'b21q', 'b2a']);
  assert.deepEqual(bord.nummers, [1, 2]);
  assert.equal(bord.kolommen[2].vragen, 3);
});

test('bouwKlasbord: alleen leerlingen van de klas, geen testaccount', () => {
  const bord = bouwKlasbord(opzet());
  assert.deepEqual(bord.rijen.map((r) => r.label), ['Sam B.', 'Sam V.']);
});

test('bouwKlasbord: gemaakt, rood en open', () => {
  const bord = bouwKlasbord(opzet());
  const [sam1, sam2] = bord.rijen;
  assert.deepEqual(sam1.cellen.map((c) => c.status), ['goed', 'open', 'top', 'open']);
  assert.equal(sam2.cellen[2].status, 'rood');
  assert.equal(sam2.cellen[2].detail, 'afgevinkt, 1 van 3 vragen beantwoord');
});

test('bouwKlasbord: veel fouten is zwak, een paar fouten goed, telt de eerste ronde', () => {
  const data = opzet();
  data.voortgang[1] = { ...data.voortgang[1], itemsCorrect: 3, eersteScore: { itemCount: 3, itemsCorrect: 1 } };
  assert.equal(bouwKlasbord(data).rijen[0].cellen[2].status, 'zwak');
  data.blokken.set('p21', [quiz('b21q', 'p21', 2, 10), tekst('b21t', 'p21', 1)]);
  data.voortgang[1] = { ...data.voortgang[1], itemsCompleted: 10, eersteScore: { itemCount: 10, itemsCorrect: 8 } };
  const cel = bouwKlasbord(data).rijen[0].cellen[2];
  assert.equal(cel.status, 'goed');
  assert.equal(cel.detail, '8 van 10 goed');
});

test('bouwKlasbord: open vakjes van een hoofdstuk op slot zijn slot', () => {
  const data = opzet();
  data.klas.vergrendeldeHoofdstukken = ['h2'];
  const [sam1] = bouwKlasbord(data).rijen;
  assert.deepEqual(sam1.cellen.map((c) => c.status), ['goed', 'slot', 'top', 'slot']);
});

test('bouwKlasbord: antwoordenparagraaf op slot tot de rest van het hoofdstuk af is', () => {
  const data = opzet();
  data.paragrafen.get('p2a').ontgrendelNaHoofdstuk = true;
  assert.equal(bouwKlasbord(data).rijen[0].cellen[3].status, 'slot');
  data.voortgang.push({ userId: 'u1', blockId: 'b21t', completed: true });
  assert.equal(bouwKlasbord(data).rijen[0].cellen[3].status, 'open');
});

test('bouwKlasbord: standaard het hoofdstuk van de laatste activiteit', () => {
  assert.equal(bouwKlasbord(opzet()).standaardNummer, 2);
  const zonder = { ...opzet(), voortgang: [] };
  assert.equal(bouwKlasbord(zonder).standaardNummer, 1);
});

test('bouwKlasbord: een klasroute laat lesstof van een ander niveau weg', () => {
  const data = opzet();
  data.klas.niveauId = 'n1';
  data.paragrafen.get('p11').niveauId = 'n2';
  data.paragrafen.get('p21').niveauId = 'n1';
  const bord = bouwKlasbord(data);
  assert.equal(bord.kolommen.some((k) => k.blockId === 'b11'), false);
});

test('bordVoorHoofdstuk telt af per leerling', () => {
  const deel = bordVoorHoofdstuk(bouwKlasbord(opzet()), 2);
  assert.equal(deel.totaal, 3);
  assert.deepEqual(deel.rijen.map((r) => r.af), [1, 0]);
  assert.deepEqual(deel.hoofdstukTitels, ['Twee']);
});
