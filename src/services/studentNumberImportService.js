import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import {
  buildStudentNumberAccountPatch,
  validateStudentNumberImportRow
} from '../lib/studentNumberImportUtils.js';

const BATCH_LIMIT = 450;

const commitOperations = async (operations = []) => {
  for (let index = 0; index < operations.length; index += BATCH_LIMIT) {
    const batch = writeBatch(db);
    operations.slice(index, index + BATCH_LIMIT).forEach((operation) => {
      batch.set(operation.ref, operation.data, { merge: true });
    });
    await batch.commit();
  }
};

export const importStudentNumbers = async ({ rows = [], klasId = '', adminUid = '' } = {}) => {
  const operations = [];
  const skippedRows = [];
  const invalidRows = [];
  let updatedCount = 0;
  let createdCount = 0;

  rows.forEach((row) => {
    if (row.decision === 'skip') {
      skippedRows.push(row);
      return;
    }

    const validation = validateStudentNumberImportRow(row);
    if (!validation.isValid) {
      invalidRows.push({ row, errors: validation.errors });
      return;
    }

    const patch = buildStudentNumberAccountPatch(validation.row, { klasId, adminUid });
    const uid = validation.row.decision === 'update' ? validation.row.matchedUserId : patch.uid;
    operations.push({
      ref: doc(db, 'users', uid),
      data: {
        ...patch,
        uid,
        updatedAt: serverTimestamp(),
        ...(validation.row.decision === 'create' ? { createdAt: serverTimestamp() } : {})
      }
    });

    if (validation.row.decision === 'update') updatedCount += 1;
    if (validation.row.decision === 'create') createdCount += 1;
  });

  if (invalidRows.length) {
    const first = invalidRows[0];
    throw new Error(`CSV bevat ${invalidRows.length} onvolledige rij(en). Controleer rij ${first.row.sourceRow || first.row.id}.`);
  }

  await commitOperations(operations);

  return {
    success: true,
    updatedCount,
    createdCount,
    skippedCount: skippedRows.length,
    total: rows.length
  };
};

export default {
  importStudentNumbers
};
