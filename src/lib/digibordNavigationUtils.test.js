import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getDigibordCardMeta,
  getDigibordContextTitle,
  getDigibordItemLabel
} from './digibordNavigationUtils.js';

test('getDigibordItemLabel uses CMS field names for each hierarchy level', () => {
  assert.equal(getDigibordItemLabel('vak', { name: 'Wiskunde' }), 'Wiskunde');
  assert.equal(getDigibordItemLabel('leerjaar', { year: 1, label: 'Jaar 1' }), 'Jaar 1');
  assert.equal(getDigibordItemLabel('niveau', { label: 'VMBO-GT', name: 'VMBO-GT' }), 'VMBO-GT');
  assert.equal(getDigibordItemLabel('hoofdstuk', { number: 2, title: 'H2 testttt' }), 'H2 testttt');
  assert.equal(getDigibordItemLabel('paragraaf', { code: '1.1', title: 'Pythagoras' }), 'Pythagoras');
});

test('getDigibordCardMeta returns useful counts for overview cards', () => {
  assert.deepEqual(getDigibordCardMeta('vak', { childCount: 2 }), {
    eyebrow: 'Vak',
    subtitle: '2 leerjaren beschikbaar',
    action: 'Kies leerjaar'
  });
  assert.equal(getDigibordCardMeta('hoofdstuk', { childCount: 1 }).subtitle, '1 paragraaf beschikbaar');
  assert.equal(getDigibordCardMeta('paragraaf', {}).action, 'Presenteer');
});

test('getDigibordContextTitle reflects the next selection step', () => {
  assert.equal(getDigibordContextTitle({ selectedVak: null }), 'Kies een vak');
  assert.equal(getDigibordContextTitle({ selectedVak: { name: 'Wiskunde' } }), 'Kies een leerjaar binnen Wiskunde');
  assert.equal(
    getDigibordContextTitle({
      selectedVak: { name: 'Wiskunde' },
      selectedLeerjaar: { label: 'Jaar 1' },
      selectedNiveau: { label: 'VMBO-GT', name: 'VMBO-GT' }
    }),
    'Kies een hoofdstuk binnen VMBO-GT'
  );
});
