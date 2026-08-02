import test from 'node:test';
import assert from 'node:assert/strict';
import { DATA_KOERIER_ROUTES, TOPRIT } from './dataKoerierRoutes.js';
import { buildSessie, buildTopritSessie, valideerRoutes, valideerToprit } from './dataKoerierLogic.js';

test('er zijn precies 13 routes in vaste volgorde', () => {
  assert.equal(DATA_KOERIER_ROUTES.length, 13);
  DATA_KOERIER_ROUTES.forEach((route, index) => {
    assert.equal(route.nummer, index + 1, `route ${route.id} heeft verkeerd nummer`);
    assert.ok(route.id && route.titel && route.uitleg && route.tip, `route ${index + 1} mist velden`);
    assert.ok(Array.isArray(route.blokken) && route.blokken.length >= 3, `route ${route.id} heeft te weinig blokken`);
  });
});

test('hoofdletters pas vanaf route 7', () => {
  DATA_KOERIER_ROUTES.forEach((route) => {
    assert.equal(Boolean(route.hoofdletters), route.nummer >= 7, `route ${route.id}`);
  });
});

test('alle routecontent gebruikt alleen geintroduceerde tekens (geen dubbele regels, pools groot genoeg)', () => {
  const problemen = valideerRoutes(DATA_KOERIER_ROUTES);
  assert.deepEqual(problemen, []);
});

test('topritwoorden passen binnen de volledige tekenset', () => {
  const problemen = valideerToprit(TOPRIT, DATA_KOERIER_ROUTES);
  assert.deepEqual(problemen, []);
});

test('sessiebudgetten blijven binnen speelbare grenzen', () => {
  DATA_KOERIER_ROUTES.forEach((route) => {
    const sessie = buildSessie(route, () => 0.5);
    assert.ok(
      sessie.totaalTekens >= 100 && sessie.totaalTekens <= 400,
      `route ${route.id}: sessie van ${sessie.totaalTekens} tekens valt buiten 100-400`
    );
    assert.ok(sessie.maxScore > 0);
  });
  const toprit = buildTopritSessie(TOPRIT, () => 0.5);
  assert.ok(toprit.totaalTekens >= 100 && toprit.totaalTekens <= 400, `toprit: ${toprit.totaalTekens} tekens`);
});

test('zinnen-routes hebben echte zinnen met hoofdletter en eindteken', () => {
  DATA_KOERIER_ROUTES.filter((route) => route.nummer >= 11).forEach((route) => {
    route.blokken.filter((blok) => blok.type === 'zinnen').forEach((blok) => {
      blok.pool.forEach((zin) => {
        assert.match(zin, /^[A-Z0-9]/, `${route.id}: zin begint niet met hoofdletter: '${zin}'`);
        assert.match(zin, /[.?!]$/, `${route.id}: zin eindigt niet op .?!: '${zin}'`);
      });
    });
  });
});
