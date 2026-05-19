import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCmsNavigationTree,
  getContentBlockTypeCounts
} from './cmsNavigationUtils.js';

const fixtures = {
  vakken: [{ id: 'vak-1', name: 'Wiskunde' }],
  leerjaren: [{ id: 'jaar-1', vakId: 'vak-1', year: 1, label: 'Jaar 1' }],
  niveaus: [{ id: 'niveau-1', leerjaarId: 'jaar-1', label: 'VMBO-GT', name: 'VMBO-GT' }],
  hoofdstukken: [{ id: 'h-1', niveauId: 'niveau-1', number: 1, title: 'Pythagoras' }],
  paragrafen: [{ id: 'p-1', hoofdstukId: 'h-1', code: '1.1', title: 'Rechthoekige driehoeken' }],
  vragen: [
    { id: 'v-1', paragraafId: 'p-1', number: 1, title: 'Zijde berekenen' },
    { id: 'v-2', paragraafId: 'p-1', number: 2, title: 'Controleer formule' }
  ],
  contentBlocks: [
    { id: 'b-1', paragraafId: 'p-1', type: 'theory', status: 'published' },
    { id: 'b-2', paragraafId: 'p-1', type: 'example', status: 'draft' },
    { id: 'b-3', paragraafId: 'p-1', type: 'question', status: 'draft' },
    { id: 'b-4', paragraafId: 'p-1', type: 'media', isArchived: true }
  ]
};

test('getContentBlockTypeCounts ignores archived blocks and counts types', () => {
  assert.deepEqual(getContentBlockTypeCounts(fixtures.contentBlocks), {
    total: 3,
    theory: 1,
    example: 1,
    question: 1,
    media: 0,
    summary: 0,
    published: 1,
    draft: 2
  });
});

test('buildCmsNavigationTree adds useful child and block counts', () => {
  const [vak] = buildCmsNavigationTree(fixtures);
  const [leerjaar] = vak.children;
  const [niveau] = leerjaar.children;
  const [hoofdstuk] = niveau.children;
  const [paragraaf] = hoofdstuk.children;

  assert.equal(vak.counts.leerjaren, 1);
  assert.equal(niveau.counts.hoofdstukken, 1);
  assert.equal(hoofdstuk.counts.paragrafen, 1);
  assert.equal(paragraaf.counts.vragen, 2);
  assert.equal(paragraaf.counts.blocks.total, 3);
});

test('buildCmsNavigationTree filters by search query while keeping ancestors', () => {
  const tree = buildCmsNavigationTree(fixtures, { query: 'zijde' });
  const vraag = tree[0].children[0].children[0].children[0].children[0].children[0];

  assert.equal(tree.length, 1);
  assert.equal(vraag.id, 'v-1');
  assert.equal(vraag.label, 'Q1: Zijde berekenen');
});
