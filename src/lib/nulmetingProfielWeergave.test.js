import test from 'node:test';
import assert from 'node:assert/strict';
import { korteOnderdeelNaam } from './nulmetingProfielWeergave.js';

test('elk SLO-onderdeel krijgt een eigen, korte kolomkop', () => {
  const namen = [
    'Digitale systemen', 'Digitale media en informatie', 'Data', 'Artificiële Intelligentie (AI)',
    'Creëren met digitale technologie', 'Programmeren', 'Veiligheid en privacy',
    'Digitale technologie, jezelf en de ander', 'Digitale technologie, samenleving en wereld'
  ].map(korteOnderdeelNaam);
  assert.deepEqual(namen, ['Systemen', 'Media en info', 'Data', 'AI', 'Creëren', 'Programmeren', 'Veiligheid', 'Jij en de ander', 'Samenleving']);
  assert.equal(new Set(namen).size, namen.length);
  assert.equal(korteOnderdeelNaam('Iets anders hier'), 'Iets anders');
});
