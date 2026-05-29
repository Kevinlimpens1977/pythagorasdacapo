import { getFunctions, httpsCallable } from 'firebase/functions';
import app from './firebase';
import { validateStudentNumberImportRow } from '../lib/studentNumberImportUtils.js';

const functions = getFunctions(app, 'europe-west1');

export const importStudentNumbers = async ({ rows = [], klasId = '' } = {}) => {
  const skippedRows = [];
  const invalidRows = [];
  const importRows = [];

  rows.forEach((row) => {
    if (row.decision === 'skip') {
      skippedRows.push(row);
      importRows.push({ ...row, decision: 'skip' });
      return;
    }

    const validation = validateStudentNumberImportRow(row);
    if (!validation.isValid) {
      invalidRows.push({ row, errors: validation.errors });
      return;
    }

    importRows.push(validation.row);
  });

  if (invalidRows.length) {
    const first = invalidRows[0];
    throw new Error(`CSV bevat ${invalidRows.length} onvolledige rij(en). Controleer rij ${first.row.sourceRow || first.row.id}.`);
  }

  const importAccounts = httpsCallable(functions, 'importStudentNumberAccounts');
  const result = await importAccounts({
    rows: importRows,
    klasId,
    defaultPassword: 'Test123'
  });

  return {
    success: true,
    updatedCount: result.data?.updatedCount || 0,
    createdCount: result.data?.createdCount || 0,
    skippedCount: result.data?.skippedCount ?? skippedRows.length,
    total: result.data?.total ?? rows.length
  };
};

export default {
  importStudentNumbers
};
