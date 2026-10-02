import test from 'node:test';
import assert from 'node:assert/strict';
import { bouwExplainerPlan, explainerBlokId, explainerTitel, ondertitelSporen, verouderdeOndertitels } from './explainerPlaatsing.mjs';

const basis = { vakId: 'vak', leerjaarId: 'lj', niveauId: 'nv', hoofdstukId: 'hoofdstuk-binask-eoa-1-h2', paragraafId: 'p24' };
const blokken = [
  { ...basis, id: 'b-theorie', type: 'theory', order: 1 },
  { ...basis, id: 'b-voorbeeld', type: 'example', order: 2 },
  { ...basis, id: 'b-samenvatting', type: 'summary', order: 3 },
  { ...basis, id: 'b-check', type: 'theory', order: 4 }
];
const invoer = {
  hoofdstukId: 'hoofdstuk-binask-eoa-1-h2',
  paragraaf: { id: 'p24', hoofdstukId: 'hoofdstuk-binask-eoa-1-h2' },
  blokken,
  titel: 'Uitlegvideo: massa, volume en dichtheid',
  kijkvraag: 'Hoe meet je het volume van een steen?',
  tokens: { video: 't1', poster: 't3' },
  ondertitels: [{ taal: 'nl', label: 'Nederlands', token: 't2' }],
  maker: 'scripts/plaats-explainer-video.mjs'
};

test('bouwExplainerPlan zet de video vóór de Samenvatting en schuift de rest op', () => {
  const plan = bouwExplainerPlan(invoer);
  assert.equal(plan.blok.id, explainerBlokId('hoofdstuk-binask-eoa-1-h2'));
  assert.equal(plan.blok.id, 'block-binask-eoa-1-h2-explainer-video');
  assert.equal(plan.blok.order, 3);
  assert.equal(plan.nieuw, true);
  assert.equal(plan.blok.type, 'media');
  assert.equal(plan.blok.status, 'published');
  assert.deepEqual(plan.verschuivingen, [{ id: 'b-samenvatting', van: 3, naar: 4 }, { id: 'b-check', van: 4, naar: 5 }]);
  assert.equal(plan.blok.content.mediaKind, 'video');
  assert.match(plan.blok.content.mediaUrl, /explainers%2Fhoofdstuk-binask-eoa-1-h2%2Fexplainer\.mp4\?alt=media&token=t1$/);
  assert.equal(plan.blok.content.ondertitels[0].taal, 'nl');
  assert.match(plan.blok.content.ondertitels[0].url, /token=t2$/);
  assert.equal(plan.blok.content.ondertitels[0].storagePath, 'explainers/hoofdstuk-binask-eoa-1-h2/ondertitels.nl.vtt');
  assert.deepEqual(plan.paden.ondertitels, { nl: 'explainers/hoofdstuk-binask-eoa-1-h2/ondertitels.nl.vtt' });
  assert.equal(plan.snapshot.content.ondertitels.length, 1);
  assert.deepEqual(plan.fouten, []);
});

test('bouwExplainerPlan is idempotent: een bestaand videoblok houdt zijn plek', () => {
  const metVideo = [...blokken.map((b) => (b.order >= 3 ? { ...b, order: b.order + 1 } : b)), { ...basis, id: 'block-binask-eoa-1-h2-explainer-video', type: 'media', order: 3 }];
  const plan = bouwExplainerPlan({ ...invoer, blokken: metVideo });
  assert.equal(plan.blok.order, 3);
  assert.equal(plan.nieuw, false);
  assert.deepEqual(plan.verschuivingen, []);
});

test('bouwExplainerPlan weigert een paragraaf zonder Samenvatting of uit een ander hoofdstuk', () => {
  assert.throws(() => bouwExplainerPlan({ ...invoer, blokken: blokken.filter((b) => b.type !== 'summary') }), /geen Samenvatting/);
  assert.throws(() => bouwExplainerPlan({ ...invoer, paragraaf: { id: 'p24', hoofdstukId: 'ander' } }), /hoort niet bij/);
});

test('bouwExplainerPlan ontsnapt html in de kijkvraag', () => {
  const plan = bouwExplainerPlan({ ...invoer, kijkvraag: 'Is 5 < 7 & waar?' });
  assert.match(plan.blok.content.html, /5 &lt; 7 &amp; waar/);
});

test('explainerTitel maakt alleen de eerste letter klein en laat afkortingen staan', () => {
  assert.equal(explainerTitel('Massa, volume en dichtheid'), 'Uitlegvideo: massa, volume en dichtheid');
  assert.equal(explainerTitel('DNS en IP-adressen'), 'Uitlegvideo: DNS en IP-adressen');
  assert.equal(explainerTitel('Wi-Fi thuis en op school'), 'Uitlegvideo: Wi-Fi thuis en op school');
  assert.equal(explainerTitel('Veilig wachtwoord met DNS'), 'Uitlegvideo: veilig wachtwoord met DNS');
  assert.equal(explainerTitel('IJzer en staal'), 'Uitlegvideo: ijzer en staal');
});

test('bouwExplainerPlan zet een spoor per taal: nl eerst, daarna de volgorde van LES_TALEN', () => {
  const plan = bouwExplainerPlan({
    ...invoer,
    ondertitels: [
      { taal: 'en', label: 'English', token: 'ten' },
      { taal: 'nl', label: 'Nederlands', token: 'tnl' },
      { taal: 'ar', label: 'العربية', token: 'tar' },
      { taal: 'el', label: 'Ελληνικά', token: 'tel' }
    ]
  });
  const sporen = plan.blok.content.ondertitels;
  assert.deepEqual(sporen.map((s) => s.taal), ['nl', 'el', 'ar', 'en']);
  assert.deepEqual(sporen.map((s) => s.label), ['Nederlands', 'Ελληνικά', 'العربية', 'English']);
  for (const spoor of sporen) {
    assert.equal(spoor.storagePath, `explainers/hoofdstuk-binask-eoa-1-h2/ondertitels.${spoor.taal}.vtt`);
    assert.ok(spoor.url.endsWith(`ondertitels.${spoor.taal}.vtt?alt=media&token=t${spoor.taal}`), spoor.url);
    assert.equal(plan.paden.ondertitels[spoor.taal], spoor.storagePath);
  }
  assert.equal(plan.snapshot.content.ondertitels.length, 4);
  assert.deepEqual(plan.snapshot.content.ondertitels.map((s) => s.taal), ['nl', 'el', 'ar', 'en']);
  assert.deepEqual(plan.fouten, []);
});

test('bouwExplainerPlan weigert ondertitels zonder nl, met een onbekende of een dubbele taal', () => {
  assert.throws(() => bouwExplainerPlan({ ...invoer, ondertitels: [{ taal: 'en', label: 'English', token: 'x' }] }), /Nederlandse ondertitels/);
  assert.throws(() => bouwExplainerPlan({ ...invoer, ondertitels: [...invoer.ondertitels, { taal: 'fr', label: 'Français', token: 'x' }] }), /onbekende taal fr/i);
  assert.throws(() => bouwExplainerPlan({ ...invoer, ondertitels: [...invoer.ondertitels, { taal: 'nl', label: 'Nederlands', token: 'x' }] }), /dubbel/i);
});

test('ondertitelSporen kiest de ondertitelbestanden uit een map: nl verplicht, alleen talen van de taalknop', () => {
  const { sporen, overgeslagen } = ondertitelSporen([
    'explainer.mp4', 'poster.png', 'ondertitels.en.vtt', 'ondertitels.nl.vtt', 'ondertitels.ar.vtt',
    'ondertitels.fr.vtt', 'ondertitels.nl.vtt.bak', 'qa-1.png'
  ]);
  assert.deepEqual(sporen, [
    { taal: 'nl', label: 'Nederlands', naam: 'ondertitels.nl.vtt' },
    { taal: 'ar', label: 'العربية', naam: 'ondertitels.ar.vtt' },
    { taal: 'en', label: 'English', naam: 'ondertitels.en.vtt' }
  ]);
  assert.deepEqual(overgeslagen, ['ondertitels.fr.vtt']);
  assert.throws(() => ondertitelSporen(['explainer.mp4', 'ondertitels.en.vtt']), /ondertitels\.nl\.vtt/);
});

test('verouderdeOndertitels meldt vertaalde sporen die ouder zijn dan ondertitels.nl.vtt', () => {
  const bestanden = [
    { taal: 'nl', mtimeMs: 2000 },
    { taal: 'el', mtimeMs: 2001 },
    { taal: 'ar', mtimeMs: 1999 },
    { taal: 'tr', mtimeMs: 2000 },
    { taal: 'en', mtimeMs: 1000 }
  ];
  // Gelijk of nieuwer is goed; strikt ouder is verouderd. nl zelf telt nooit mee.
  assert.deepEqual(verouderdeOndertitels(bestanden), ['ar', 'en']);
  assert.deepEqual(verouderdeOndertitels([{ taal: 'nl', mtimeMs: 5 }]), []);
  assert.deepEqual(verouderdeOndertitels([{ taal: 'el', mtimeMs: 1 }]), []);
  assert.deepEqual(verouderdeOndertitels([]), []);
});
