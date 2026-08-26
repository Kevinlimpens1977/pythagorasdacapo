import test from 'node:test';
import assert from 'node:assert/strict';
import { isToegestaanSchoolEmail } from './allowedEmailDomains.js';

test('schoolmail van beide domeinen wordt geaccepteerd', () => {
  assert.equal(isToegestaanSchoolEmail('204871@leerling.dacapo-college.nl'), true);
  assert.equal(isToegestaanSchoolEmail('k.limpens@stichtinglvo.nl'), true);
  assert.equal(isToegestaanSchoolEmail('  K.Limpens@StichtingLVO.nl  '), true);
});

test('andere adressen worden geweigerd', () => {
  assert.equal(isToegestaanSchoolEmail('test.test@gmail.com'), false);
  assert.equal(isToegestaanSchoolEmail('iemand@dacapo-college.nl'), false);
  assert.equal(isToegestaanSchoolEmail('iemand@leerling.dacapo-college.nl.evil.com'), false);
  assert.equal(isToegestaanSchoolEmail('nep@stichtinglvo.nl@gmail.com'), false);
});

test('rommel breekt de check niet', () => {
  assert.equal(isToegestaanSchoolEmail(''), false);
  assert.equal(isToegestaanSchoolEmail('@stichtinglvo.nl'), false);
  assert.equal(isToegestaanSchoolEmail('iemand@'), false);
  assert.equal(isToegestaanSchoolEmail(null), false);
  assert.equal(isToegestaanSchoolEmail(undefined), false);
});
