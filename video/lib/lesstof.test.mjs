import test from 'node:test';
import assert from 'node:assert/strict';
import { htmlNaarTekst, vatLesstofSamen, stelDoelParagraafVoor } from './lesstof.mjs';

test('htmlNaarTekst maakt leesbare tekst van lesstof-html', () => {
  assert.equal(
    htmlNaarTekst('<p>Je meet massa met een <strong>weegschaal</strong>.</p><ul><li>1 kg = 1000 g</li><li>a &amp; b</li></ul>'),
    'Je meet massa met een weegschaal.\n- 1 kg = 1000 g\n- a & b'
  );
});

const invoer = {
  nu: '2026-10-02T10:00:00.000Z',
  hoofdstuk: { id: 'h2', title: 'Massa, volume en dichtheid', vakId: 'vak-binask-eoa' },
  paragrafen: [
    { id: 'p5', code: '2.5', title: 'Plusopdrachten', order: 5 },
    { id: 'p1', code: '2.1', title: 'Massa', order: 1 },
    { id: 'p4', code: '2.4', title: 'Herhalingsopdrachten', order: 4 }
  ],
  blokken: [
    { id: 'b1', paragraafId: 'p1', type: 'theory', order: 2, title: 'Wat is massa?', content: { html: '<p>Massa is...</p>', kernbegrippen: [{ begrip: 'massa', uitleg: 'hoeveel gram' }] } },
    { id: 'b2', paragraafId: 'p1', type: 'theory', order: 3, title: 'Schriftopdracht 2.1', content: { html: '<p>Maak</p>' } },
    { id: 'b3', paragraafId: 'p1', type: 'summary', order: 4, title: 'Samenvatting', content: { html: '<ul><li>m</li></ul>' } },
    { id: 'b4', paragraafId: 'p4', type: 'summary', order: 3, title: 'Samenvatting', content: { html: '' } },
    { id: 'b5', paragraafId: 'p5', type: 'summary', order: 3, title: 'Samenvatting', content: { html: '' } },
    { id: 'b6', paragraafId: 'p1', type: 'game', order: 5, title: 'Spel', content: {} }
  ]
};

test('vatLesstofSamen sorteert, filtert opdrachten en spellen, en markeert samenvattingen', () => {
  const l = vatLesstofSamen(invoer);
  assert.deepEqual(l.paragrafen.map((p) => p.code), ['2.1', '2.4', '2.5']);
  assert.deepEqual(l.paragrafen[0].blokken.map((b) => b.id), ['b1', 'b3']);
  assert.deepEqual(l.paragrafen[0].blokken[0].kernbegrippen, ['massa: hoeveel gram']);
  assert.equal(l.paragrafen[1].heeftSamenvatting, true);
  assert.equal(l.gelezenOp, '2026-10-02T10:00:00.000Z');
});

test('stelDoelParagraafVoor kiest de herhalingsparagraaf, niet de plus', () => {
  assert.equal(stelDoelParagraafVoor(vatLesstofSamen(invoer)), 'p4');
  const zonderHerhaling = vatLesstofSamen({ ...invoer, paragrafen: invoer.paragrafen.filter((p) => p.id !== 'p4') });
  assert.equal(stelDoelParagraafVoor(zonderHerhaling), 'p1');
});
