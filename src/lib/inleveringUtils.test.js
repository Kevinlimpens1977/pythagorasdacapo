import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INLEVERING_MAX_BYTES,
  buildInleveringStoragePath,
  heeftAfgerondeBeoordeling,
  isToegestaanInleverBestandstype,
  magInleveringVervangen,
  normalizeInlevering,
  schoonBestandsnaam,
  valideerInleverBestand
} from './inleveringUtils.js';

test('Word, PDF en afbeeldingen mogen ingeleverd worden', () => {
  assert.equal(isToegestaanInleverBestandstype({ name: 'verslag.docx' }), true);
  assert.equal(isToegestaanInleverBestandstype({ name: 'VERSLAG.DOC' }), true);
  assert.equal(isToegestaanInleverBestandstype({ name: 'poster.pdf' }), true);
  assert.equal(isToegestaanInleverBestandstype({ name: 'foto.jpg' }), true);
  assert.equal(isToegestaanInleverBestandstype({ name: 'foto.PNG' }), true);
  // Een camera-afbeelding zonder herkenbare extensie mag op zijn mimetype.
  assert.equal(isToegestaanInleverBestandstype({ name: 'IMG0001', type: 'image/jpeg' }), true);
});

test('andere bestandstypes worden geweigerd met een leesbare reden', () => {
  assert.equal(isToegestaanInleverBestandstype({ name: 'virus.exe' }), false);
  assert.equal(isToegestaanInleverBestandstype({ name: 'werk.zip', type: 'application/zip' }), false);
  assert.equal(isToegestaanInleverBestandstype({ name: 'blad.xlsx' }), false);

  const uitslag = valideerInleverBestand({ name: 'werk.zip', size: 100, type: 'application/zip' });
  assert.equal(uitslag.ok, false);
  assert.ok(uitslag.reden.includes('Word'));
});

test('de maat is maximaal 15 MB en een leeg bestand telt niet', () => {
  assert.equal(INLEVERING_MAX_BYTES, 15 * 1024 * 1024);

  const teGroot = valideerInleverBestand({ name: 'verslag.pdf', size: INLEVERING_MAX_BYTES + 1 });
  assert.equal(teGroot.ok, false);
  assert.ok(teGroot.reden.includes('15 MB'));

  const opDeGrens = valideerInleverBestand({ name: 'verslag.pdf', size: INLEVERING_MAX_BYTES });
  assert.deepEqual(opDeGrens, { ok: true, reden: '' });

  assert.equal(valideerInleverBestand({ name: 'leeg.pdf', size: 0 }).ok, false);
  assert.equal(valideerInleverBestand({ name: '', size: 10 }).ok, false);
});

test('vervangen mag zolang een docent niet definitief beoordeeld heeft', () => {
  assert.equal(magInleveringVervangen(null), true);
  assert.equal(magInleveringVervangen({}), true);
  assert.equal(magInleveringVervangen({ teacherReview: null }), true);
  // Een AI-oordeel of "wacht op nakijken" is geen docentbeoordeling.
  assert.equal(magInleveringVervangen({ attemptStatus: 'pending_teacher_review' }), true);
});

test('na een docentbesluit staat de inlevering vast, behalve bij "opnieuw"', () => {
  assert.equal(heeftAfgerondeBeoordeling({ teacherReview: { besluit: 'goedgekeurd' } }), true);
  assert.equal(heeftAfgerondeBeoordeling({ teacherReview: { besluit: 'afgekeurd' } }), true);
  assert.equal(magInleveringVervangen({ teacherReview: { besluit: 'goedgekeurd' } }), false);
  assert.equal(magInleveringVervangen({ teacherReview: { besluit: 'afgekeurd' } }), false);
  // "Opnieuw" zet de stap weer open; dan mag het bestand ook opnieuw.
  assert.equal(magInleveringVervangen({ teacherReview: { besluit: 'opnieuw' } }), true);
});

test('het storagepad volgt inleveringen/{uid}/{blockId}/{timestamp}-{bestandsnaam}', () => {
  assert.equal(
    buildInleveringStoragePath({
      uid: 'leerling-1',
      blockId: 'blok-7',
      bestandsnaam: 'mijn verslag.docx',
      nuMs: 1724650000000
    }),
    'inleveringen/leerling-1/blok-7/1724650000000-mijn_verslag.docx'
  );

  // Zonder eigenaar of blok is er geen geldig pad.
  assert.equal(buildInleveringStoragePath({ uid: '', blockId: 'blok-7' }), '');
  assert.equal(buildInleveringStoragePath({ uid: 'leerling-1', blockId: '' }), '');
});

test('bestandsnamen worden veilig gemaakt zonder de extensie te verliezen', () => {
  assert.equal(schoonBestandsnaam('mijn verslag (v2).docx'), 'mijn_verslag_(v2).docx');
  assert.equal(schoonBestandsnaam('../../geheim.pdf'), 'geheim.pdf');
  assert.equal(schoonBestandsnaam('   '), 'inlevering');
});

test('normalizeInlevering levert een compleet object of expliciet null', () => {
  assert.equal(normalizeInlevering(null), null);
  assert.equal(normalizeInlevering({}), null);
  assert.equal(normalizeInlevering({ bestandsnaam: 'x.pdf' }), null);

  assert.deepEqual(
    normalizeInlevering({
      bestandsnaam: 'verslag.pdf',
      url: 'https://voorbeeld/verslag.pdf',
      storagePath: 'inleveringen/u/b/1-verslag.pdf',
      ingeleverdOpMs: 1724650000000
    }),
    {
      bestandsnaam: 'verslag.pdf',
      url: 'https://voorbeeld/verslag.pdf',
      storagePath: 'inleveringen/u/b/1-verslag.pdf',
      ingeleverdOpMs: 1724650000000
    }
  );
});
