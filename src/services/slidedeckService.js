import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { getBytes, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';
import {
  DEFAULT_NOTEBOOK_PROMPT,
  DEFAULT_NOTEBOOK_PROMPT_NAME
} from '../lib/notebookPromptTemplates';
import {
  buildInitialSlidedeckReviewMetadata,
  buildSlidedeckDeckUploadMetadata,
  canUseSlidedeckPackageInCms,
  normalizeSlidedeckReviewStatus
} from '../lib/slidedeckReview';

export const SLIDEDECK_STATUSES = {
  SOURCE_READY: 'sourceReady',
  DECK_UPLOADED: 'deckUploaded'
};

const asIso = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  return '';
};

const mapDoc = (docSnap) => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAtIso: asIso(data.createdAt),
    updatedAtIso: asIso(data.updatedAt)
  };
};

export const getPromptTemplates = async () => {
  const snapshot = await getDocs(query(collection(db, 'promptTemplates'), orderBy('createdAt', 'desc')));
  return snapshot.docs.map(mapDoc).filter((template) => template.status !== 'archived');
};

export const ensureDefaultPromptTemplate = async (userId = 'system') => {
  const templates = await getPromptTemplates().catch(() => []);
  if (templates.length > 0) return templates;

  const templateRef = doc(collection(db, 'promptTemplates'));
  await setDoc(templateRef, {
    name: DEFAULT_NOTEBOOK_PROMPT_NAME,
    description: 'Standaardprompt voor klassikale NotebookLM digibordlessen.',
    body: DEFAULT_NOTEBOOK_PROMPT,
    isDefault: true,
    status: 'active',
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return getPromptTemplates();
};

export const createPromptTemplate = async (data, userId) => {
  const templateRef = doc(collection(db, 'promptTemplates'));
  await setDoc(templateRef, {
    name: data.name,
    description: data.description || '',
    body: data.body,
    isDefault: Boolean(data.isDefault),
    status: data.status || 'active',
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return templateRef.id;
};

export const getSlidedeckPackages = async () => {
  const snapshot = await getDocs(query(collection(db, 'slidedeckPackages'), orderBy('createdAt', 'desc')));
  return snapshot.docs.map(mapDoc);
};

export const getSlidedeckPackage = async (packageId) => {
  if (!packageId) return null;
  const snapshot = await getDoc(doc(db, 'slidedeckPackages', packageId));
  if (!snapshot.exists()) return null;
  return mapDoc(snapshot);
};

export const getDeckReadySlidedeckPackages = async () => {
  const packages = await getSlidedeckPackages();
  return packages.filter(canUseSlidedeckPackageInCms);
};

export const getSlidedeckPdfBytes = async ({ storagePath, downloadURL }) => {
  if (storagePath) {
    return getBytes(ref(storage, storagePath));
  }

  if (!downloadURL) {
    throw new Error('Geen PDF-bron beschikbaar.');
  }

  const response = await fetch(downloadURL);
  if (!response.ok) {
    throw new Error(`PDF kon niet worden opgehaald (${response.status}).`);
  }

  return response.arrayBuffer();
};

const uploadBlob = async (storagePath, blob, contentType) => {
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, blob, {
    contentType,
    cacheControl: 'public, max-age=86400'
  });
  const downloadURL = await getDownloadURL(storageRef);
  return {
    storagePath,
    downloadURL,
    uploadedAt: new Date().toISOString()
  };
};

export const uploadSlidedeckAsset = async (packageId, assetId, file) => {
  const extension = file.name?.split('.').pop() || 'jpg';
  const storagePath = `slidedecks/${packageId}/assets/${assetId}.${extension}`;
  return uploadBlob(storagePath, file, file.type || 'application/octet-stream');
};

export const createSlidedeckPackage = async ({
  title,
  learningGoals,
  sourceText,
  linkedContext,
  promptTemplateId,
  promptTemplateName,
  promptSnapshot,
  sourcePdfBlob,
  imageFiles = [],
  userId
}) => {
  const packageRef = doc(collection(db, 'slidedeckPackages'));
  const packageId = packageRef.id;

  const uploadedAssets = [];
  for (let index = 0; index < imageFiles.length; index += 1) {
    const file = imageFiles[index];
    const asset = await uploadSlidedeckAsset(packageId, `asset-${index + 1}`, file);
    uploadedAssets.push({
      fileName: file.name || `Afbeelding ${index + 1}`,
      contentType: file.type || '',
      size: file.size || 0,
      ...asset
    });
  }

  const sourcePdf = await uploadBlob(
    `slidedecks/${packageId}/source.pdf`,
    sourcePdfBlob,
    'application/pdf'
  );
  const reviewMetadata = buildInitialSlidedeckReviewMetadata({
    learningGoals,
    sourceText,
    imageFiles,
    promptTemplateId,
    promptTemplateName,
    promptSnapshot
  });

  await setDoc(packageRef, {
    title,
    learningGoals,
    sourceText,
    linkedContext: linkedContext || null,
    promptTemplateId: promptTemplateId || null,
    promptTemplateName: promptTemplateName || '',
    promptSnapshot,
    sourcePdf,
    sourceAssets: uploadedAssets,
    generatedDeckPdf: null,
    status: SLIDEDECK_STATUSES.SOURCE_READY,
    ...reviewMetadata,
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return packageId;
};

export const uploadGeneratedDeckPdf = async (packageId, file, userId) => {
  const generatedDeckPdf = await uploadBlob(
    `slidedecks/${packageId}/generated-deck.pdf`,
    file,
    'application/pdf'
  );
  const existingPackage = await getSlidedeckPackage(packageId);
  const uploadMetadata = buildSlidedeckDeckUploadMetadata({ file, userId });

  await updateDoc(doc(db, 'slidedeckPackages', packageId), {
    generatedDeckPdf: {
      fileName: file.name || 'notebooklm-slidedeck.pdf',
      size: file.size || 0,
      ...generatedDeckPdf
    },
    status: SLIDEDECK_STATUSES.DECK_UPLOADED,
    reviewStatus: uploadMetadata.reviewStatus,
    generationManifest: {
      ...(existingPackage?.generationManifest || {}),
      ...uploadMetadata.generationManifest
    },
    teacherDecisionLog: [
      ...(Array.isArray(existingPackage?.teacherDecisionLog) ? existingPackage.teacherDecisionLog : []),
      ...uploadMetadata.teacherDecisionLog
    ],
    deckUploadedBy: userId,
    updatedAt: serverTimestamp()
  });

  return generatedDeckPdf;
};

export const updateSlidedeckReview = async (packageId, data = {}, userId = 'unknown-admin') => {
  const existingPackage = await getSlidedeckPackage(packageId);
  const reviewStatus = normalizeSlidedeckReviewStatus(data.reviewStatus);
  const teacherDecisionNote = String(data.teacherDecisionNote || '').trim();
  const teacherDecisionLog = [
    ...(Array.isArray(existingPackage?.teacherDecisionLog) ? existingPackage.teacherDecisionLog : []),
    {
      action: 'review_status_updated',
      reviewStatus,
      note: teacherDecisionNote,
      userId,
      createdAt: new Date().toISOString()
    }
  ];

  await updateDoc(doc(db, 'slidedeckPackages', packageId), {
    reviewStatus,
    teacherDecisionNote,
    teacherDecisionLog,
    updatedAt: serverTimestamp()
  });
};

export default {
  ensureDefaultPromptTemplate,
  getPromptTemplates,
  createPromptTemplate,
  getSlidedeckPackage,
  getSlidedeckPackages,
  getDeckReadySlidedeckPackages,
  getSlidedeckPdfBytes,
  createSlidedeckPackage,
  uploadGeneratedDeckPdf,
  updateSlidedeckReview
};
