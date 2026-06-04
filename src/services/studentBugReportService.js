import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from './firebase';
import {
  buildStudentBugReportPayload,
  buildStudentBugReportRecentQuerySpec,
  normalizeBugReportStatus
} from '../lib/studentBugReportUtils';

const COLLECTION_NAME = 'studentBugReports';

const mapReportDoc = (docSnap) => ({
  id: docSnap.id,
  ...docSnap.data()
});

export const createStudentBugReport = async (payload = {}) => {
  const studentUid = payload.student?.uid;
  if (!studentUid) {
    throw new Error('student uid is required');
  }

  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return docRef.id;
};

export const createStudentBugReportFromContext = async (data = {}) => {
  const payload = buildStudentBugReportPayload(data);
  return createStudentBugReport(payload);
};

export const getRecentStudentBugReportTimestamps = async ({
  studentUid = '',
  sinceMs = 0,
  maxResults = 80
} = {}) => {
  if (!studentUid) return [];
  const recentQuerySpec = buildStudentBugReportRecentQuerySpec({
    studentUid,
    sinceMs,
    maxResults
  });

  const reportsQuery = query(
    collection(db, COLLECTION_NAME),
    ...recentQuerySpec.filters.map((filter) => where(filter.field, filter.operator, filter.value)),
    orderBy(recentQuerySpec.orderBy.field, recentQuerySpec.orderBy.direction),
    limit(recentQuerySpec.limit)
  );
  const snapshot = await getDocs(reportsQuery);
  return snapshot.docs
    .map((item) => item.data())
    .map((item) => Number(item?.clientCreatedAtMs))
    .filter(Number.isFinite);
};

export const getStudentBugReports = async ({ status = '', category = '', maxResults = 100 } = {}) => {
  const reportsQuery = query(
    collection(db, COLLECTION_NAME),
    orderBy('clientCreatedAtMs', 'desc'),
    limit(Math.min(Math.max(maxResults * 3, maxResults), 300))
  );
  const snapshot = await getDocs(reportsQuery);
  const safeStatus = status ? normalizeBugReportStatus(status) : '';
  return snapshot.docs
    .map(mapReportDoc)
    .filter((report) => !safeStatus || report.status === safeStatus)
    .filter((report) => !category || report.category === category)
    .slice(0, maxResults);
};

export const getOpenStudentBugReportCount = async () => {
  const reportsQuery = query(
    collection(db, COLLECTION_NAME),
    where('status', 'in', ['new', 'in_progress'])
  );

  const snapshot = await getCountFromServer(reportsQuery);
  return snapshot.data().count;
};

export const updateStudentBugReport = async (reportId, updates = {}) => {
  if (!reportId) {
    throw new Error('reportId is required');
  }

  const safeUpdates = {};
  if (updates.status !== undefined) {
    safeUpdates.status = normalizeBugReportStatus(updates.status);
  }
  if (updates.adminNote !== undefined) {
    safeUpdates.adminNote = String(updates.adminNote || '').slice(0, 1600);
  }

  await updateDoc(doc(db, COLLECTION_NAME, reportId), {
    ...safeUpdates,
    updatedAt: serverTimestamp(),
    updatedAtMs: Date.now()
  });
};

export default {
  createStudentBugReport,
  createStudentBugReportFromContext,
  getOpenStudentBugReportCount,
  getRecentStudentBugReportTimestamps,
  getStudentBugReports,
  updateStudentBugReport
};
