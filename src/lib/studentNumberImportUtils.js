import { normalizeStudentName, splitStudentFullName } from './studentPhotoImportUtils.js';

export const STUDENT_EMAIL_DOMAIN = 'leerling.dacapo-college.nl';

const stripBom = (value = '') => String(value || '').replace(/^\uFEFF/, '');

export const normalizeStudentNumber = (value = '') =>
  String(value || '').replace(/\D+/g, '').trim();

export const buildStudentEmail = (studentNumber = '') => {
  const normalized = normalizeStudentNumber(studentNumber);
  return normalized ? `${normalized}@${STUDENT_EMAIL_DOMAIN}` : '';
};

export const normalizeDutchLastName = (value = '') => {
  const raw = String(value || '').trim().replace(/\s+/g, ' ');
  const commaParts = raw.split(',').map((part) => part.trim()).filter(Boolean);
  if (commaParts.length < 2) return raw;

  return `${commaParts.slice(1).join(' ')} ${commaParts[0]}`.trim().replace(/\s+/g, ' ');
};

const splitCsvLine = (line = '', delimiter = ';') => {
  const cells = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const next = line[index + 1];

    if (character === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === delimiter && !quoted) {
      cells.push(cell.trim());
      cell = '';
    } else {
      cell += character;
    }
  }

  cells.push(cell.trim());
  return cells;
};

const getColumnValue = (record, aliases = []) => {
  const keys = Object.keys(record);
  const normalizedAliases = aliases.map((alias) => normalizeStudentName(alias));
  const key = keys.find((candidate) => normalizedAliases.includes(normalizeStudentName(candidate)));
  return key ? record[key] : '';
};

export const parseStudentNumberCsv = (csvText = '') => {
  const lines = String(csvText || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = splitCsvLine(stripBom(lines[0]))
    .map((header) => stripBom(header).trim())
    .filter(Boolean);

  return lines.slice(1).map((line, index) => {
    const cells = splitCsvLine(line);
    const record = Object.fromEntries(headers.map((header, cellIndex) => [header, cells[cellIndex] || '']));
    const firstName = getColumnValue(record, ['Roepnaam', 'Voornaam', 'First name']);
    const rawLastName = getColumnValue(record, ['Achternaam', 'Tussenvoegsel achternaam', 'Last name']);
    const lastName = normalizeDutchLastName(rawLastName);
    const studentNumber = normalizeStudentNumber(getColumnValue(record, ['Leerlingnummer', 'Leerling nummer', 'Studentnummer']));
    const displayName = [firstName, lastName].map((part) => String(part || '').trim()).filter(Boolean).join(' ');

    return {
      id: `csv-${index + 1}`,
      sourceRow: index + 2,
      firstName,
      lastName,
      displayName,
      studentNumber,
      email: buildStudentEmail(studentNumber),
      raw: record
    };
  }).filter((row) => row.firstName || row.lastName || row.studentNumber);
};

const studentNumberOf = (student = {}) =>
  normalizeStudentNumber(student.studentNumber || student.leerlingnummer || student.studentnummer || '');

export const getStudentDisplayName = (student = {}) =>
  student.displayName || [student.firstName, student.lastName].filter(Boolean).join(' ') || '';

export const findStudentForNumberImportRow = (students = [], row = {}) => {
  const rowNumber = normalizeStudentNumber(row.studentNumber);
  const rowEmail = buildStudentEmail(rowNumber).toLowerCase();
  const rowName = normalizeStudentName(row.displayName || [row.firstName, row.lastName].filter(Boolean).join(' '));

  const byNumber = rowNumber
    ? students.find((student) => studentNumberOf(student) === rowNumber)
    : null;
  if (byNumber) return { student: byNumber, matchType: 'leerlingnummer', confidence: 1 };

  const byEmail = rowEmail
    ? students.find((student) => String(student.email || '').trim().toLowerCase() === rowEmail)
    : null;
  if (byEmail) return { student: byEmail, matchType: 'email', confidence: 1 };

  const byName = rowName
    ? students.find((student) => normalizeStudentName(getStudentDisplayName(student)) === rowName)
    : null;
  if (byName) return { student: byName, matchType: 'naam', confidence: 0.95 };

  return { student: null, matchType: 'nieuw', confidence: 0 };
};

export const createStudentNumberImportRows = (csvRows = [], students = []) =>
  csvRows.map((row) => {
    const match = findStudentForNumberImportRow(students, row);
    return {
      ...row,
      matchedUserId: match.student?.uid || match.student?.id || '',
      matchedDisplayName: match.student ? getStudentDisplayName(match.student) : '',
      matchType: match.matchType,
      confidence: match.confidence,
      decision: match.student ? 'update' : 'create'
    };
  });

export const normalizeImportedStudentFromManualFields = (row = {}) => {
  const firstName = String(row.firstName || '').trim();
  const lastName = normalizeDutchLastName(row.lastName || '');
  const studentNumber = normalizeStudentNumber(row.studentNumber);
  const email = String(row.email || buildStudentEmail(studentNumber)).trim().toLowerCase();
  const displayName = [firstName, lastName].filter(Boolean).join(' ');

  return {
    ...row,
    firstName,
    lastName,
    studentNumber,
    email,
    displayName
  };
};

export const validateStudentNumberImportRow = (row = {}) => {
  const normalized = normalizeImportedStudentFromManualFields(row);
  const errors = [];

  if (!normalized.firstName) errors.push('missing_first_name');
  if (!normalized.lastName) errors.push('missing_last_name');
  if (!normalized.studentNumber) errors.push('missing_student_number');
  if (!normalized.email) errors.push('missing_email');
  if (!['update', 'create', 'skip'].includes(normalized.decision)) errors.push('invalid_decision');
  if (normalized.decision === 'update' && !normalized.matchedUserId) errors.push('missing_matched_student');

  return {
    isValid: errors.length === 0,
    errors,
    row: normalized
  };
};

export const splitNameForManualStudent = (value = '') => {
  const parts = splitStudentFullName(value);
  return {
    firstName: parts.firstName,
    lastName: normalizeDutchLastName(parts.lastName)
  };
};

export const buildStudentDocumentIdFromNumber = (studentNumber = '') => {
  const normalized = normalizeStudentNumber(studentNumber);
  return normalized ? `student_${normalized}` : '';
};

export const buildStudentNumberAccountPatch = (row = {}, { klasId = '', adminUid = '' } = {}) => {
  const normalized = normalizeImportedStudentFromManualFields(row);
  return {
    uid: row.matchedUserId || buildStudentDocumentIdFromNumber(normalized.studentNumber),
    email: normalized.email,
    displayName: normalized.displayName,
    firstName: normalized.firstName,
    lastName: normalized.lastName,
    studentNumber: normalized.studentNumber,
    leerlingnummer: normalized.studentNumber,
    role: 'student',
    klasId: row.klasId || klasId || null,
    needsNameSetup: false,
    isImportedStudent: true,
    importedBy: adminUid || null,
    mustChangePassword: true,
    passwordStatus: 'default'
  };
};
