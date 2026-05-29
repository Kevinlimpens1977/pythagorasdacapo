import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildStudentNumberAccountPatch,
  buildStudentEmail,
  buildStudentDocumentIdFromNumber,
  createStudentNumberImportRows,
  normalizeDutchLastName,
  parseStudentNumberCsv,
  validateStudentNumberImportRow
} from './studentNumberImportUtils.js';

const csvFixture = `Roepnaam;Achternaam;Leerlingnummer;
Damian;Bijlsma;50121049;
Dewi;Wilde, de;50119828;`;

test('parseStudentNumberCsv reads semicolon exports and derives student e-mail', () => {
  const rows = parseStudentNumberCsv(csvFixture);

  assert.equal(rows.length, 2);
  assert.deepEqual(rows[0], {
    id: 'csv-1',
    sourceRow: 2,
    firstName: 'Damian',
    lastName: 'Bijlsma',
    displayName: 'Damian Bijlsma',
    studentNumber: '50121049',
    email: '50121049@leerling.dacapo-college.nl',
    raw: {
      Roepnaam: 'Damian',
      Achternaam: 'Bijlsma',
      Leerlingnummer: '50121049'
    }
  });
  assert.equal(rows[1].lastName, 'de Wilde');
  assert.equal(rows[1].displayName, 'Dewi de Wilde');
});

test('normalizeDutchLastName moves comma suffixes before surname', () => {
  assert.equal(normalizeDutchLastName('Wilde, de'), 'de Wilde');
  assert.equal(normalizeDutchLastName('Balan'), 'Balan');
});

test('buildStudentEmail derives DaCapo learner address from number only', () => {
  assert.equal(buildStudentEmail(' 501.21049 '), '50121049@leerling.dacapo-college.nl');
});

test('createStudentNumberImportRows prefers existing matches before creating', () => {
  const rows = createStudentNumberImportRows(parseStudentNumberCsv(csvFixture), [
    { uid: 'student-1', displayName: 'Damian Bijlsma', role: 'student' },
    { uid: 'student-2', studentNumber: '50119828', displayName: 'Dewi de Wilde', role: 'student' }
  ]);

  assert.equal(rows[0].decision, 'update');
  assert.equal(rows[0].matchedUserId, 'student-1');
  assert.equal(rows[0].matchType, 'naam');
  assert.equal(rows[1].decision, 'update');
  assert.equal(rows[1].matchedUserId, 'student-2');
  assert.equal(rows[1].matchType, 'leerlingnummer');
});

test('validateStudentNumberImportRow requires account fields for create/update rows', () => {
  assert.deepEqual(
    validateStudentNumberImportRow({
      firstName: 'Dewi',
      lastName: 'Wilde, de',
      studentNumber: '50119828',
      decision: 'create'
    }).row,
    {
      firstName: 'Dewi',
      lastName: 'de Wilde',
      studentNumber: '50119828',
      decision: 'create',
      email: '50119828@leerling.dacapo-college.nl',
      displayName: 'Dewi de Wilde'
    }
  );

  assert.deepEqual(
    validateStudentNumberImportRow({ firstName: '', lastName: '', studentNumber: '', decision: 'create' }).errors,
    ['missing_first_name', 'missing_last_name', 'missing_student_number', 'missing_email']
  );
});

test('buildStudentNumberAccountPatch creates deterministic student documents', () => {
  assert.equal(buildStudentDocumentIdFromNumber('50121049'), 'student_50121049');
  assert.deepEqual(
    buildStudentNumberAccountPatch(
      {
        firstName: 'Damian',
        lastName: 'Bijlsma',
        studentNumber: '50121049',
        decision: 'create'
      },
      { klasId: 'klas-1', adminUid: 'admin-1' }
    ),
    {
      uid: 'student_50121049',
      email: '50121049@leerling.dacapo-college.nl',
      displayName: 'Damian Bijlsma',
      firstName: 'Damian',
      lastName: 'Bijlsma',
      studentNumber: '50121049',
      leerlingnummer: '50121049',
      role: 'student',
      klasId: 'klas-1',
      needsNameSetup: false,
      isImportedStudent: true,
      importedBy: 'admin-1',
      mustChangePassword: true,
      passwordStatus: 'default'
    }
  );
});
