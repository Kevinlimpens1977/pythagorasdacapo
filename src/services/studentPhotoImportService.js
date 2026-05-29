import { getFunctions, httpsCallable } from 'firebase/functions';
import {
  collection,
  doc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import app, { db, storage } from './firebase';
import { PHOTO_IMPORT_DECISIONS, normalizePhotoImportDecision, sanitizeImportFileName } from '../lib/studentPhotoImportUtils';

const functions = getFunctions(app, 'europe-west1');

const getImageExtension = (contentType = 'image/jpeg') => {
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  return 'jpg';
};

export const dataUrlToBlob = async (dataUrl) => {
  const response = await fetch(dataUrl);
  return response.blob();
};

export const createPhotoImportId = () => doc(collection(db, 'photoImports')).id;

export const buildPhotoImportSourcePath = ({ klasId = 'zonder-klas', importId, fileName = 'source.jpg' }) =>
  `photo-imports/${klasId}/${importId}/source/${sanitizeImportFileName(fileName)}`;

export const buildPhotoImportCropPath = ({ klasId = 'zonder-klas', importId, cropId, contentType = 'image/webp' }) =>
  `photo-imports/${klasId}/${importId}/crops/${sanitizeImportFileName(cropId)}.${getImageExtension(contentType)}`;

export const uploadPhotoImportBlob = async ({ storagePath, blob, contentType, userId }) => {
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, blob, {
    contentType: contentType || blob?.type || 'image/jpeg',
    cacheControl: 'private, max-age=3600',
    customMetadata: {
      uploadedBy: userId || 'unknown-admin'
    }
  });

  return {
    storagePath,
    downloadURL: await getDownloadURL(storageRef),
    uploadedAt: new Date().toISOString()
  };
};

export const createPhotoImportRecord = async ({
  importId,
  klasId = null,
  sourceStoragePath,
  originalFileName,
  contentType,
  fileSize,
  createdBy,
  cropCount = 0
}) => {
  await setDoc(doc(db, 'photoImports', importId), {
    klasId,
    status: 'review',
    sourceStoragePath,
    originalFileName,
    contentType,
    fileSize,
    createdBy,
    cropCount,
    approvedCount: 0,
    pendingCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
  }, { merge: true });
};

export const savePhotoImportCropRecord = async ({ importId, cropId, data }) => {
  await setDoc(doc(db, 'photoImports', importId, 'crops', cropId), {
    ...data,
    createdAt: serverTimestamp()
  }, { merge: true });
};

export const approveStudentPhotoImportCrop = async ({ importId, klasId, row }) => {
  const approve = httpsCallable(functions, 'approveStudentPhotoImportCrop');
  const normalizedDecision = normalizePhotoImportDecision(row.decision);
  const decision = normalizedDecision === PHOTO_IMPORT_DECISIONS.REJECT ? 'reject' : normalizedDecision || PHOTO_IMPORT_DECISIONS.APPROVE;
  const result = await approve({
    importId,
    klasId,
    cropId: row.cropId,
    matchedUserId: row.matchedUserId || null,
    displayNameProposed: row.proposedName || '',
    firstName: row.firstName || '',
    lastName: row.lastName || '',
    decision,
    reviewNote: row.decision === 'skip' ? 'Overgeslagen in leerlingfoto-import.' : ''
  });
  return result.data;
};

export const approveStudentPhotoImport = async ({ importId, klasId, rows }) => {
  const results = [];
  for (const row of rows) {
    results.push({
      rowId: row.rowId || row.cropId,
      ...(await approveStudentPhotoImportCrop({ importId, klasId, row }))
    });
  }

  return {
    success: true,
    linkedCount: results.filter((result) => result.status === 'approved').length,
    pendingCount: results.filter((result) => result.status === 'pending_new').length,
    rejectedCount: results.filter((result) => result.status === 'rejected').length,
    results
  };
};

export const getStudentPhotoUrl = async (student = {}) => {
  if (student.photoURL) return student.photoURL;
  const storagePath = student.photo?.thumbStoragePath || student.photo?.storagePath || student.photoPath;
  if (!storagePath) return '';
  return getDownloadURL(ref(storage, storagePath));
};

export default {
  approveStudentPhotoImport,
  approveStudentPhotoImportCrop,
  buildPhotoImportCropPath,
  buildPhotoImportSourcePath,
  createPhotoImportId,
  createPhotoImportRecord,
  dataUrlToBlob,
  getStudentPhotoUrl,
  savePhotoImportCropRecord,
  uploadPhotoImportBlob
};
