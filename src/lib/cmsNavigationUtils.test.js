import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCmsNavigationTree,
  getAssessmentItemCount,
  getCmsItemLabel,
  getContentBlockPublicationOverview,
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
    { id: 'b-4', paragraafId: 'p-1', type: 'media', isArchived: true },
    { id: 'b-5', paragraafId: 'p-1', type: 'game', status: 'draft' },
    { id: 'b-6', paragraafId: 'p-1', type: 'slidedeck', status: 'published' },
    { id: 'b-7', paragraafId: 'p-1', type: 'quiz', status: 'published', content: { items: [{ id: 'q1' }, { id: 'q2' }] } }
  ]
};

test('getContentBlockTypeCounts ignores archived blocks and counts types', () => {
  assert.deepEqual(getContentBlockTypeCounts(fixtures.contentBlocks), {
    total: 6,
    theory: 1,
    example: 1,
    question: 1,
    quiz: 1,
    toets: 0,
    media: 0,
    summary: 0,
    game: 1,
    slidedeck: 1,
    published: 3,
    draft: 3
  });
});

test('getContentBlockPublicationOverview counts visible blocks by normalized publication status', () => {
  assert.deepEqual(getContentBlockPublicationOverview([
    { id: 'b-1', status: 'draft' },
    { id: 'b-2', status: 'needs_review' },
    { id: 'b-3', status: 'ready' },
    { id: 'b-4', status: 'published' },
    { id: 'b-5', status: 'unknown' },
    { id: 'b-6', status: 'published', isArchived: true },
    { id: 'b-7', status: 'archived' }
  ]), {
    total: 5,
    counts: {
      draft: 2,
      needs_review: 1,
      ready: 1,
      published: 1
    },
    items: [
      { status: 'draft', label: 'Concept', count: 2 },
      { status: 'needs_review', label: 'Review nodig', count: 1 },
      { status: 'ready', label: 'Klaar', count: 1 },
      { status: 'published', label: 'Gepubliceerd', count: 1 }
    ]
  });
});

test('getAssessmentItemCount counts questions stored inside quiz and toets blocks', () => {
  assert.equal(getAssessmentItemCount(fixtures.contentBlocks), 2);
});

test('getCmsItemLabel uses text fields and readable fallbacks for the content hierarchy', () => {
  assert.equal(getCmsItemLabel('vak', { name: 'Digitale Vaardigheden' }), 'Digitale Vaardigheden');
  assert.equal(getCmsItemLabel('vak', { naam: 'Wiskunde legacy' }), 'Wiskunde legacy');
  assert.equal(getCmsItemLabel('vak', {}), 'Vak zonder naam');
  assert.equal(getCmsItemLabel('leerjaar', { year: 1, label: 'leerjaar 1' }), 'leerjaar 1');
  assert.equal(getCmsItemLabel('leerjaar', { year: 2 }), 'Jaar 2');
  assert.equal(getCmsItemLabel('leerjaar', {}), 'Leerjaar');
  assert.equal(getCmsItemLabel('niveau', { label: 'VMBO-GT', name: 'VMBO-GT' }), 'VMBO-GT');
  assert.equal(getCmsItemLabel('niveau', { label: 'VMBO-GT', name: 'Gemengd theoretisch' }), 'VMBO-GT - Gemengd theoretisch');
  // Naam bevat het label al (Binask-seed): niet nog eens voorvoegen, ook niet
  // als een boomknoop met het samengestelde label een tweede keer langskomt.
  assert.equal(getCmsItemLabel('niveau', { label: 'Leerroute 3', name: 'Leerroute 3 - leerjaar 1' }), 'Leerroute 3 - leerjaar 1');
  assert.equal(getCmsItemLabel('niveau', { label: 'Leerroute 3 - leerjaar 1', name: 'Leerroute 3 - leerjaar 1' }), 'Leerroute 3 - leerjaar 1');
  assert.equal(getCmsItemLabel('niveau', {}), 'Niveau');
  assert.equal(getCmsItemLabel('hoofdstuk', { title: 'H1 Inleiding' }), 'H1 Inleiding');
  assert.equal(getCmsItemLabel('hoofdstuk', { number: 2 }), 'Hoofdstuk 2');
  assert.equal(getCmsItemLabel('hoofdstuk', {}), 'Hoofdstuk zonder naam');
  assert.equal(getCmsItemLabel('paragraaf', { title: '1.1 Rechthoekige driehoeken' }), '1.1 Rechthoekige driehoeken');
  assert.equal(getCmsItemLabel('paragraaf', {}), 'Paragraaf zonder naam');
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
  assert.equal(paragraaf.label, 'Rechthoekige driehoeken');
  assert.equal(paragraaf.counts.vragen, 4);
  assert.equal(paragraaf.counts.blocks.total, 6);
  assert.deepEqual(paragraaf.children, []);
});

test('buildCmsNavigationTree keeps paragraph block counts independent for sibling paragraphs', () => {
  const tree = buildCmsNavigationTree({
    ...fixtures,
    paragrafen: [
      { id: 'p-1', hoofdstukId: 'h-1', code: '1.1', title: 'Rechthoekige driehoeken' },
      { id: 'p-2', hoofdstukId: 'h-1', code: '1.2', title: 'Kwadraten' }
    ],
    contentBlocks: [
      { id: 'p1-b1', paragraafId: 'p-1', type: 'theory', status: 'published' },
      { id: 'p1-b2', paragraafId: 'p-1', type: 'example', status: 'draft' },
      { id: 'p1-b3', paragraafId: 'p-1', type: 'question', status: 'draft' },
      { id: 'p1-b4', paragraafId: 'p-1', type: 'media', status: 'draft' },
      { id: 'p1-b5', paragraafId: 'p-1', type: 'summary', status: 'published' },
      { id: 'p2-b1', paragraafId: 'p-2', type: 'theory', status: 'published' },
      { id: 'p2-b2', paragraafId: 'p-2', type: 'example', status: 'draft' },
      { id: 'p2-b3', paragraafId: 'p-2', type: 'question', status: 'draft' }
    ]
  });
  const paragrafen = tree[0].children[0].children[0].children[0].children;

  assert.equal(paragrafen.find((paragraaf) => paragraaf.id === 'p-1').counts.blocks.total, 5);
  assert.equal(paragrafen.find((paragraaf) => paragraaf.id === 'p-2').counts.blocks.total, 3);
});

test('buildCmsNavigationTree filters by question search text while keeping ancestors', () => {
  const tree = buildCmsNavigationTree(fixtures, { query: 'zijde' });
  const paragraaf = tree[0].children[0].children[0].children[0].children[0];

  assert.equal(tree.length, 1);
  assert.equal(paragraaf.id, 'p-1');
  assert.deepEqual(paragraaf.children, []);
});

test('buildCmsNavigationTree hides archived items unless archive mode is enabled', () => {
  const archivedFixtures = {
    ...fixtures,
    hoofdstukken: [
      ...fixtures.hoofdstukken,
      { id: 'h-archived', niveauId: 'niveau-1', title: 'Gearchiveerd hoofdstuk', isArchived: true }
    ]
  };

  const normalTree = buildCmsNavigationTree(archivedFixtures);
  const normalHoofdstukken = normalTree[0].children[0].children[0].children;
  assert.equal(normalHoofdstukken.some((hoofdstuk) => hoofdstuk.id === 'h-archived'), false);

  const archiveTree = buildCmsNavigationTree(archivedFixtures, { includeArchived: true });
  const archiveHoofdstukken = archiveTree[0].children[0].children[0].children;
  const archivedHoofdstuk = archiveHoofdstukken.find((hoofdstuk) => hoofdstuk.id === 'h-archived');
  assert.equal(archivedHoofdstuk.archived, true);
});
