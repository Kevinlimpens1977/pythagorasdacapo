import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTENT_BLOCK_TYPES } from './contentBlockUtils.js';
import { buildCmsNavigationTree } from './cmsNavigationUtils.js';
import {
  buildBouwPad,
  flattenNavigationTree,
  getBlockTypeChoices,
  getTreeCreateAction,
  isParagraafKlaargezet,
  isParagraafZichtbaarVoorLeerlingen,
  sortKlassenByName
} from './lesmateriaalStudio.js';

const fixtures = {
  vakken: [{ id: 'vak-1', name: 'Digitale vaardigheden' }],
  leerjaren: [{ id: 'jaar-1', vakId: 'vak-1', year: 1, label: 'Leerjaar 1' }],
  niveaus: [{ id: 'niveau-1', leerjaarId: 'jaar-1', label: 'Standaard', name: 'Standaard' }],
  hoofdstukken: [{ id: 'h-1', niveauId: 'niveau-1', title: 'H1 Aan de slag' }],
  paragrafen: [{ id: 'p-1', hoofdstukId: 'h-1', title: '1.1 Inloggen' }],
  vragen: [],
  contentBlocks: []
};

test('getBlockTypeChoices levert voor elk bloktype een kaart met label en één zin uitleg', () => {
  const choices = getBlockTypeChoices();

  assert.equal(choices.length, CONTENT_BLOCK_TYPES.length);
  for (const choice of choices) {
    assert.ok(CONTENT_BLOCK_TYPES.includes(choice.type), `onbekend type ${choice.type}`);
    assert.ok(choice.label.length > 0, `label ontbreekt voor ${choice.type}`);
    assert.ok(choice.description.length > 0, `omschrijving ontbreekt voor ${choice.type}`);
  }
});

test('flattenNavigationTree hangt hoofdstukken direct onder een vak met één leerjaar en één niveau', () => {
  const [vak] = flattenNavigationTree(buildCmsNavigationTree(fixtures));

  assert.equal(vak.flattened, true);
  assert.equal(vak.flatLeerjaarId, 'jaar-1');
  assert.equal(vak.flatNiveauId, 'niveau-1');
  assert.equal(vak.counts.hoofdstukken, 1);
  assert.equal(vak.children[0].type, 'hoofdstuk');
  assert.equal(vak.children[0].id, 'h-1');
  assert.equal(vak.children[0].children[0].id, 'p-1');
});

test('flattenNavigationTree laat een vak met meerdere leerjaren of niveaus ongemoeid', () => {
  const meerLeerjaren = buildCmsNavigationTree({
    ...fixtures,
    leerjaren: [
      ...fixtures.leerjaren,
      { id: 'jaar-2', vakId: 'vak-1', year: 2, label: 'Leerjaar 2' }
    ]
  });
  const [vakMetTweeJaren] = flattenNavigationTree(meerLeerjaren);
  assert.equal(vakMetTweeJaren.flattened, undefined);
  assert.equal(vakMetTweeJaren.children[0].type, 'leerjaar');

  const meerNiveaus = buildCmsNavigationTree({
    ...fixtures,
    niveaus: [
      ...fixtures.niveaus,
      { id: 'niveau-2', leerjaarId: 'jaar-1', label: 'Plus', name: 'Plus' }
    ]
  });
  const [vakMetTweeNiveaus] = flattenNavigationTree(meerNiveaus);
  assert.equal(vakMetTweeNiveaus.flattened, undefined);
  assert.equal(vakMetTweeNiveaus.children[0].type, 'leerjaar');
});

test('getTreeCreateAction geeft per niveau een benoemde plus-actie', () => {
  assert.deepEqual(getTreeCreateAction({ type: 'vak', id: 'vak-1' }), {
    type: 'leerjaar',
    parentId: 'vak-1',
    label: '+ Leerjaar'
  });
  assert.deepEqual(
    getTreeCreateAction({ type: 'vak', id: 'vak-1', flattened: true, flatNiveauId: 'niveau-1' }),
    { type: 'hoofdstuk', parentId: 'niveau-1', label: '+ Hoofdstuk' }
  );
  assert.deepEqual(getTreeCreateAction({ type: 'leerjaar', id: 'jaar-1' }), {
    type: 'niveau',
    parentId: 'jaar-1',
    label: '+ Niveau'
  });
  assert.deepEqual(getTreeCreateAction({ type: 'niveau', id: 'niveau-1' }), {
    type: 'hoofdstuk',
    parentId: 'niveau-1',
    label: '+ Hoofdstuk'
  });
  assert.deepEqual(getTreeCreateAction({ type: 'hoofdstuk', id: 'h-1' }), {
    type: 'paragraaf',
    parentId: 'h-1',
    label: '+ Paragraaf'
  });
  assert.equal(getTreeCreateAction({ type: 'paragraaf', id: 'p-1' }), null);
  assert.equal(getTreeCreateAction(), null);
});

test('buildBouwPad verbergt leerjaar en niveau bij een plat pad', () => {
  const crumbs = buildBouwPad({
    vak: { id: 'vak-1', name: 'Digitale vaardigheden' },
    leerjaar: { id: 'jaar-1', year: 1, label: 'Leerjaar 1' },
    niveau: { id: 'niveau-1', label: 'Standaard', name: 'Standaard' },
    hoofdstuk: { id: 'h-1', title: 'H1 Aan de slag' },
    paragraaf: { id: 'p-1', title: '1.1 Inloggen' },
    leerjaarCount: 1,
    niveauCount: 1
  });

  assert.deepEqual(crumbs.map((crumb) => crumb.type), ['vak', 'hoofdstuk', 'paragraaf']);
  assert.deepEqual(crumbs.map((crumb) => crumb.label), [
    'Digitale vaardigheden',
    'H1 Aan de slag',
    '1.1 Inloggen'
  ]);
});

test('buildBouwPad toont het volledige pad zodra er meerdere leerjaren of niveaus zijn', () => {
  const crumbs = buildBouwPad({
    vak: { id: 'vak-1', name: 'Wiskunde' },
    leerjaar: { id: 'jaar-1', year: 1, label: 'Leerjaar 1' },
    niveau: { id: 'niveau-1', label: 'VMBO-GT', name: 'VMBO-GT' },
    hoofdstuk: { id: 'h-1', title: 'Pythagoras' },
    paragraaf: { id: 'p-1', title: '1.1 Rechthoekige driehoeken' },
    leerjaarCount: 2,
    niveauCount: 1
  });

  assert.deepEqual(crumbs.map((crumb) => crumb.type), [
    'vak',
    'leerjaar',
    'niveau',
    'hoofdstuk',
    'paragraaf'
  ]);
});

test('buildBouwPad slaat ontbrekende niveaus gewoon over', () => {
  const crumbs = buildBouwPad({ vak: { id: 'vak-1', name: 'Wiskunde' }, leerjaarCount: 3 });
  assert.deepEqual(crumbs.map((crumb) => crumb.type), ['vak']);
  assert.deepEqual(buildBouwPad(), []);
});

test('sortKlassenByName sorteert alfabetisch en numeriek op klasnaam', () => {
  const klassen = [
    { id: 'k-3', name: 'Klas 10' },
    { id: 'k-1', name: 'brugklas B' },
    { id: 'k-2', name: 'Klas 2' },
    { id: 'k-4' }
  ];

  assert.deepEqual(sortKlassenByName(klassen).map((klas) => klas.id), ['k-4', 'k-1', 'k-2', 'k-3']);
  // De invoer blijft ongemoeid.
  assert.equal(klassen[0].id, 'k-3');
});

test('isParagraafKlaargezet kijkt naar enabledParagrafen van de klas', () => {
  assert.equal(isParagraafKlaargezet({ enabledParagrafen: ['p-1', 'p-2'] }, 'p-1'), true);
  assert.equal(isParagraafKlaargezet({ enabledParagrafen: ['p-2'] }, 'p-1'), false);
  assert.equal(isParagraafKlaargezet({}, 'p-1'), false);
  assert.equal(isParagraafKlaargezet({ enabledParagrafen: ['p-1'] }, undefined), false);
});

test('isParagraafZichtbaarVoorLeerlingen verbergt alleen een expliciete published:false', () => {
  assert.equal(isParagraafZichtbaarVoorLeerlingen({ published: true }), true);
  assert.equal(isParagraafZichtbaarVoorLeerlingen({}), true);
  assert.equal(isParagraafZichtbaarVoorLeerlingen({ published: false }), false);
});
