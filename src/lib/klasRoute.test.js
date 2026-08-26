import test from 'node:test';
import assert from 'node:assert/strict';
import {
  KLAS_ROUTE_GEEN_LABEL,
  buildKlasRouteOptieLabel,
  buildKlasRouteOpties,
  filterLesstofOpKlasRoute,
  getKlasNiveauId,
  getKlasRouteLabel,
  isLesstofInKlasRoute
} from './klasRoute.js';

const paragrafen = [
  { id: 'p-bb', title: 'Basis', niveauId: 'niveau-dv-vmbo1-bb' },
  { id: 'p-kb', title: 'Kader', niveauId: 'niveau-dv-vmbo1-kb' },
  { id: 'p-legacy', title: 'Zonder niveau' }
];

test('zonder klasroute blijft alles zichtbaar (het bestaande gedrag)', () => {
  assert.deepEqual(filterLesstofOpKlasRoute(paragrafen, ''), paragrafen);
  assert.deepEqual(filterLesstofOpKlasRoute(paragrafen, null), paragrafen);
  assert.equal(getKlasNiveauId(null), '');
  assert.equal(getKlasNiveauId({ niveauId: null }), '');
});

test('met een klasroute ziet de leerling alleen lesstof van dat niveau', () => {
  const zichtbaar = filterLesstofOpKlasRoute(paragrafen, 'niveau-dv-vmbo1-bb');
  assert.deepEqual(zichtbaar.map((p) => p.id), ['p-bb', 'p-legacy']);
});

// Bewust: inhoud zonder eigen niveauId is legacy en verdwijnt niet zodra een
// klas een route krijgt - de docent heeft die stof wel degelijk toegewezen.
test('lesstof zonder eigen niveauId blijft bij elke route zichtbaar', () => {
  assert.equal(isLesstofInKlasRoute({ id: 'x' }, 'niveau-dv-vmbo1-bb'), true);
  assert.equal(isLesstofInKlasRoute({ id: 'x', niveauId: '' }, 'niveau-dv-vmbo1-bb'), true);
});

test('lesstof van een ander niveau hoort niet bij de route', () => {
  assert.equal(
    isLesstofInKlasRoute({ niveauId: 'niveau-dv-vmbo1-kb' }, 'niveau-dv-vmbo1-bb'),
    false
  );
  assert.equal(
    isLesstofInKlasRoute({ niveauId: 'niveau-dv-vmbo1-bb' }, 'niveau-dv-vmbo1-bb'),
    true
  );
});

test('een kapotte lijst filtert naar een lege lijst, niet naar een crash', () => {
  assert.deepEqual(filterLesstofOpKlasRoute(null, 'niveau-dv-vmbo1-bb'), []);
  assert.deepEqual(filterLesstofOpKlasRoute(undefined, ''), []);
});

test('routelabels krijgen de leerweg tussen haakjes', () => {
  assert.equal(buildKlasRouteOptieLabel({ title: 'Blauwe route' }), 'Blauwe route (basis)');
  assert.equal(buildKlasRouteOptieLabel({ title: 'Groene route' }), 'Groene route (kader)');
  assert.equal(buildKlasRouteOptieLabel({ title: 'Paarse route' }), 'Paarse route (TL)');
  // Een titel die de leerweg al noemt, wordt niet dubbel gelabeld.
  assert.equal(buildKlasRouteOptieLabel({ title: 'Blauwe route (basis)' }), 'Blauwe route (basis)');
  // Onbekende namen blijven gewoon zichzelf.
  assert.equal(buildKlasRouteOptieLabel({ title: 'Havo route' }), 'Havo route');
});

test('de keuzelijst begint met Geen route en dedupliceert niveaus', () => {
  const opties = buildKlasRouteOpties([
    { id: 'niveau-bb', title: 'Blauwe route' },
    { id: 'niveau-bb', title: 'Blauwe route' },
    { id: 'niveau-kb', title: 'Groene route' },
    { id: '', title: 'Kapot niveau zonder id' }
  ]);

  assert.deepEqual(opties, [
    { id: '', label: KLAS_ROUTE_GEEN_LABEL },
    { id: 'niveau-bb', label: 'Blauwe route (basis)' },
    { id: 'niveau-kb', label: 'Groene route (kader)' }
  ]);
});

test('het routelabel van een klas valt leesbaar terug', () => {
  const niveaus = [{ id: 'niveau-bb', title: 'Blauwe route' }];

  assert.equal(getKlasRouteLabel({ niveauId: 'niveau-bb' }, niveaus), 'Blauwe route (basis)');
  assert.equal(getKlasRouteLabel({ niveauId: null }, niveaus), KLAS_ROUTE_GEEN_LABEL);
  assert.equal(getKlasRouteLabel(null, niveaus), KLAS_ROUTE_GEEN_LABEL);
  // Een route die niet meer bestaat wordt kaal getoond, niet verstopt.
  assert.equal(getKlasRouteLabel({ niveauId: 'niveau-weg' }, niveaus), 'niveau-weg');
});
