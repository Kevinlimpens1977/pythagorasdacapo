import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COMPLIMENTEN, complimentTitel, KLASDOEL_MAX_PER_WEEK, klasdoelNaPunt, klasdoelProcent, teltVoorKlasdoel
} from './klasSamen.js';

test('klasdoel: alleen de eerste keer, blokken vanaf 60%, spellen altijd', () => {
  assert.equal(teltVoorKlasdoel({ eersteKeer: true, soort: 'contentBlock', percentage: 60 }), true);
  assert.equal(teltVoorKlasdoel({ eersteKeer: true, soort: 'contentBlock', percentage: 59 }), false);
  assert.equal(teltVoorKlasdoel({ eersteKeer: false, soort: 'contentBlock', percentage: 100 }), false);
  assert.equal(teltVoorKlasdoel({ eersteKeer: true, soort: 'game', percentage: 0 }), true);
});

test('klasdoel: telt op tot het doel, met een weekgrens per leerling', () => {
  const doel = { status: 'actief', doel: 3, stand: 1 };
  assert.deepEqual(klasdoelNaPunt(doel, 0), { stand: 2, gehaald: false });
  assert.deepEqual(klasdoelNaPunt({ ...doel, stand: 2 }, 0), { stand: 3, gehaald: true });
  assert.equal(klasdoelNaPunt({ ...doel, stand: 3 }, 0), null, 'vol is vol');
  assert.equal(klasdoelNaPunt(doel, KLASDOEL_MAX_PER_WEEK), null, 'weekgrens');
  assert.equal(klasdoelNaPunt({ ...doel, status: 'gehaald' }, 0), null);
  assert.equal(klasdoelProcent({ doel: 4, stand: 1 }), 25);
});

test('complimenten: vaste lijst met unieke ids', () => {
  assert.equal(new Set(COMPLIMENTEN.map((compliment) => compliment.id)).size, COMPLIMENTEN.length);
  assert.equal(complimentTitel('geholpen'), 'Goed geholpen');
  assert.equal(complimentTitel('onzin'), '');
});
