import test from 'node:test';
import assert from 'node:assert/strict';
import { isLeerlingnummer, naarInlogEmail, toonInlogEmail } from './loginIdentifier.js';

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

test('toonInlogEmail laat het hele adres pas zien bij een compleet nummer', () => {
  assert.equal(toonInlogEmail('50122920'), '50122920@leerling.dacapo-college.nl');
  assert.equal(toonInlogEmail('501'), '');
  assert.equal(toonInlogEmail(''), '');
});

test('toonInlogEmail herhaalt een getypt adres niet', () => {
  assert.equal(toonInlogEmail('50122920@leerling.dacapo-college.nl'), '');
  assert.equal(toonInlogEmail('k.limpens@stichtinglvo.nl'), '');
});

test('isLeerlingnummer accepteert alleen cijfers van vier tot tien lang', () => {
  assert.equal(isLeerlingnummer('50122920'), true);
  assert.equal(isLeerlingnummer('204871'), true);
  assert.equal(isLeerlingnummer('123'), false);
  assert.equal(isLeerlingnummer('50122920a'), false);
  assert.equal(isLeerlingnummer(''), false);
});
