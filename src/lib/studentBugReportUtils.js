export const BUG_REPORT_CATEGORIES = [
  { id: 'answer_model', label: 'Antwoordmodel klopt niet' },
  { id: 'text_error', label: 'Schrijffout of taal' },
  { id: 'unclear_assignment', label: 'Opdracht is onduidelijk' },
  { id: 'technical_problem', label: 'Technisch probleem' },
  { id: 'broken_media', label: 'Afbeelding/video/link werkt niet' },
  { id: 'other', label: 'Anders' }
];

export const BUG_REPORT_STATUSES = [
  { id: 'new', label: 'Nieuw' },
  { id: 'in_progress', label: 'In behandeling' },
  { id: 'resolved', label: 'Opgelost' },
  { id: 'rejected', label: 'Afgewezen' }
];

export const BUG_REPORT_RATE_LIMIT_MAX = 3;
export const BUG_REPORT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const categoryIds = new Set(BUG_REPORT_CATEGORIES.map((item) => item.id));
const statusIds = new Set(BUG_REPORT_STATUSES.map((item) => item.id));
const openStatusIds = new Set(['new', 'in_progress']);

export const normalizeBugReportCategory = (category = '') =>
  categoryIds.has(category) ? category : 'other';

export const normalizeBugReportStatus = (status = '') =>
  statusIds.has(status) ? status : 'new';

export const isOpenBugReportStatus = (status = '') =>
  openStatusIds.has(normalizeBugReportStatus(status));

const cleanText = (value = '', maxLength = 1600) =>
  String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);

const pickDisplayName = ({ currentUser = {}, userData = {} } = {}) =>
  cleanText(
    userData.displayName ||
    [userData.firstName, userData.lastName].filter(Boolean).join(' ') ||
    currentUser.displayName ||
    currentUser.email ||
    'Leerling',
    160
  );

export const getStudentBugReportRateLimitState = ({
  existingTimestamps = [],
  nowMs = Date.now(),
  windowMs = BUG_REPORT_RATE_LIMIT_WINDOW_MS,
  maxReports = BUG_REPORT_RATE_LIMIT_MAX
} = {}) => {
  const recentTimestamps = existingTimestamps
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && nowMs - value < windowMs);

  return {
    allowed: recentTimestamps.length < maxReports,
    recentCount: recentTimestamps.length,
    remaining: Math.max(0, maxReports - recentTimestamps.length),
    recentTimestamps
  };
};

export const buildStudentBugReportRecentQuerySpec = ({
  studentUid = '',
  sinceMs = 0,
  maxResults = 80
} = {}) => {
  const safeStudentUid = cleanText(studentUid, 160);
  const safeSinceMs = Number.isFinite(Number(sinceMs)) ? Number(sinceMs) : 0;
  const safeLimit = Math.min(Math.max(Math.round(Number(maxResults) || 80), 1), 300);

  return {
    filters: [
      { field: 'student.uid', operator: '==', value: safeStudentUid },
      { field: 'clientCreatedAtMs', operator: '>=', value: safeSinceMs }
    ],
    orderBy: { field: 'clientCreatedAtMs', direction: 'desc' },
    limit: safeLimit
  };
};

export const buildStudentBugReportPayload = ({
  category = 'other',
  description = '',
  details = '',
  currentUser = {},
  userData = {},
  klasData = {},
  context = {},
  location = {},
  now = new Date()
} = {}) => {
  const timestamp = now instanceof Date ? now : new Date(now);
  const safeCategory = normalizeBugReportCategory(category);
  const displayName = pickDisplayName({ currentUser, userData });
  const href = cleanText(location.href || '', 1200);
  const pathname = cleanText(location.pathname || '', 400);

  return {
    status: 'new',
    category: safeCategory,
    categoryLabel: BUG_REPORT_CATEGORIES.find((item) => item.id === safeCategory)?.label || 'Anders',
    description: cleanText(description, 1600),
    details: cleanText(details, 1600),
    student: {
      uid: cleanText(currentUser.uid || userData.uid || '', 160),
      displayName,
      email: cleanText(currentUser.email || userData.email || '', 240),
      firstName: cleanText(userData.firstName || '', 120),
      lastName: cleanText(userData.lastName || '', 120),
      studentNumber: cleanText(userData.studentNumber || userData.leerlingnummer || userData.studentnummer || '', 80)
    },
    klas: {
      id: cleanText(userData.klasId || klasData.id || klasData.klasId || '', 160),
      name: cleanText(klasData.name || klasData.naam || userData.klasNaam || '', 160)
    },
    context: {
      paragraafId: cleanText(context.paragraafId || '', 160),
      paragraafTitle: cleanText(context.paragraafTitle || '', 240),
      hoofdstukId: cleanText(context.hoofdstukId || '', 160),
      hoofdstukTitle: cleanText(context.hoofdstukTitle || '', 240),
      blockId: cleanText(context.blockId || '', 160),
      blockTitle: cleanText(context.blockTitle || '', 240),
      blockType: cleanText(context.blockType || '', 120),
      vraagId: cleanText(context.vraagId || '', 160),
      vraagTitle: cleanText(context.vraagTitle || '', 240),
      vraagType: cleanText(context.vraagType || '', 120)
    },
    page: {
      href,
      pathname,
      title: cleanText(location.title || '', 240)
    },
    adminNote: '',
    clientCreatedAt: timestamp.toISOString(),
    clientCreatedAtMs: timestamp.getTime(),
    updatedAtMs: timestamp.getTime()
  };
};
