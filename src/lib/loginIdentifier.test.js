import test from 'node:test';
import assert from 'node:assert/strict';
import { naarInlogEmail } from './loginIdentifier.js';

test('een kaal leerlingnummer krijgt het leerlingdomein', () => {
  assert.equal(naarInlogEmail('204871'), '204871@leerling.dacapo-college.nl');
  assert.equal(naarInlogEmail('  204871  '), '204871@leerling.dacapo-college.nl');
});

test('een volledig adres blijft ongemoeid', () => {
  assert.equal(naarInlogEmail('204871@leerling.dacapo-college.nl'), '204871@leerling.dacapo-college.nl');
  assert.equal(naarInlogEmail('K.Limpens@stichtinglvo.nl'), 'k.limpens@stichtinglvo.nl');
});

test('iets dat geen nummer en geen adres is blijft staan voor de gewone foutmelding', () => {
  assert.equal(naarInlogEmail('kevin'), 'kevin');
  assert.equal(naarInlogEmail(''), '');
});
