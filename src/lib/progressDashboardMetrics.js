import { normalizeResultTier } from './learningResultUtils.js';

const emptyQualityCounts = () => ({
  independent: 0,
  guided: 0,
  failed: 0,
  pendingTeacherReview: 0,
  inProgress: 0
});

const FAILED_PARAGRAPH_SIGNAL_THRESHOLD = 0.4;
const MIN_ASSESSED_QUESTIONS_FOR_FAILED_SIGNAL = 3;

const normalizeSummary = (summary = {}) => ({
  assignedItems: Number(summary.assignedItems || 0),
  startedItems: Number(summary.startedItems || 0),
  completedItems: Number(summary.completedItems || 0),
  percentage: Number(summary.percentage || 0),
  startedPercentage: Number(summary.startedPercentage || 0)
});

const isQuestionLikeRecord = (record = {}) => {
  if (record.blockType === 'vraag') return true;
  if (record.progressType === 'question' || record.progressType === 'contentBlockQuestion') return true;
  if (record.vraagType || record.vraagTitle || record.questionPlainText) return true;
  if (record.resultTier || record.helpTier || record.scoreWeight !== undefined) return true;
  return record.isCorrect !== undefined && record.blockType !== 'theorie';
};

const getTierBucket = (record = {}) => {
  const tier = normalizeResultTier({
    completed: record.completed === true,
    isCorrect: record.isCorrect === true,
    aiHelpCount: record.aiHelpCount || 0,
    resultTier: record.resultTier || '',
    helpTier: record.helpTier || ''
  });

  if (tier === 'pending_teacher_review') return 'pendingTeacherReview';
  if (tier === 'failed') return 'failed';
  if (tier === 'guided') return 'guided';
  if (tier === 'independent') return 'independent';
  return 'inProgress';
};

export const summarizeLearningQuality = (records = []) => {
  const counts = emptyQualityCounts();
  const questionRecords = records.filter(isQuestionLikeRecord);

  questionRecords.forEach((record) => {
    counts[getTierBucket(record)] += 1;
  });

  return {
    counts,
    questionRecordCount: questionRecords.length,
    signalCount: counts.failed + counts.pendingTeacherReview
  };
};

const getParagraphSignalKey = (record = {}) =>
  record.paragraafId ||
  record.paragraphId ||
  record.paragraafDocId ||
  record.paragraafTitle ||
  '__single_paragraph__';

const getFailedParagraphSignalCount = (records = [], { allowCompletedShortcut = false, summary = {} } = {}) => {
  const normalizedSummary = normalizeSummary(summary);
  const paragraphBuckets = new Map();

  records
    .filter(isQuestionLikeRecord)
    .forEach((record) => {
      const bucket = getTierBucket(record);
      const isAssessed = bucket === 'failed' || bucket === 'guided' || bucket === 'independent';
      if (!isAssessed) return;

      const key = getParagraphSignalKey(record);
      const current = paragraphBuckets.get(key) || { assessed: 0, failed: 0 };
      current.assessed += 1;
      if (bucket === 'failed') current.failed += 1;
      paragraphBuckets.set(key, current);
    });

  return [...paragraphBuckets.values()].filter(({ assessed, failed }) => {
    if (!assessed) return false;
    const enoughEvidence = assessed >= MIN_ASSESSED_QUESTIONS_FOR_FAILED_SIGNAL ||
      (allowCompletedShortcut && normalizedSummary.percentage === 100);
    return enoughEvidence && failed / assessed > FAILED_PARAGRAPH_SIGNAL_THRESHOLD;
  }).length;
};

const buildStableSignalId = (...parts) =>
  parts
    .filter((part) => part !== undefined && part !== null && String(part).trim() !== '')
    .map((part) => String(part).trim().replace(/[^a-zA-Z0-9_-]+/g, '_'))
    .join('__');

const getRecordSignalKey = (record = {}, index = 0) =>
  record.id ||
  record.blockId ||
  record.vraagId ||
  record.questionId ||
  record.blockTitle ||
  record.vraagTitle ||
  `record_${index}`;

const getRecordLabel = (record = {}, fallback = 'Onderdeel') =>
  record.blockTitle ||
  record.vraagTitle ||
  record.questionPlainText ||
  record.paragraafTitle ||
  fallback;

const getFailedParagraphSignalItems = ({ student = {}, records = [], summary = {} } = {}) => {
  const normalizedSummary = normalizeSummary(summary);
  const paragraphBuckets = new Map();

  records
    .filter(isQuestionLikeRecord)
    .forEach((record) => {
      const bucket = getTierBucket(record);
      const isAssessed = bucket === 'failed' || bucket === 'guided' || bucket === 'independent';
      if (!isAssessed) return;

      const key = getParagraphSignalKey(record);
      const current = paragraphBuckets.get(key) || {
        assessed: 0,
        failed: 0,
        paragraafId: record.paragraafId || record.paragraphId || '',
        paragraafTitle: record.paragraafTitle || record.chapterTitle || 'Paragraaf',
        lastUpdatedAt: record.updatedAt || record.completedAt || record.firstAttemptAt || null
      };
      current.assessed += 1;
      if (bucket === 'failed') current.failed += 1;
      if (record.updatedAt || record.completedAt || record.firstAttemptAt) {
        current.lastUpdatedAt = record.updatedAt || record.completedAt || record.firstAttemptAt;
      }
      paragraphBuckets.set(key, current);
    });

  return [...paragraphBuckets.entries()].flatMap(([key, bucket]) => {
    if (!bucket.assessed) return [];
    const enoughEvidence = bucket.assessed >= MIN_ASSESSED_QUESTIONS_FOR_FAILED_SIGNAL ||
      normalizedSummary.percentage === 100;
    if (!enoughEvidence || bucket.failed / bucket.assessed <= FAILED_PARAGRAPH_SIGNAL_THRESHOLD) return [];

    return [{
      id: buildStableSignalId('progressSignal', student.id || student.uid, 'failedParagraph', key),
      type: 'failedParagraph',
      label: 'Herstel nodig',
      detail: `${bucket.failed}/${bucket.assessed} beoordeelde vragen gingen mis`,
      studentId: student.id || student.uid || '',
      studentName: student.displayName || student.email || 'Naamloos',
      klasId: student.klasId || '',
      paragraafId: bucket.paragraafId,
      paragraafTitle: bucket.paragraafTitle,
      priority: 1,
      updatedAt: bucket.lastUpdatedAt
    }];
  });
};

export const buildStudentProgressSignalItems = ({ student = {}, summary = {}, records = [] } = {}) => {
  const studentId = student.id || student.uid || '';
  const failedParagraphSignals = getFailedParagraphSignalItems({ student, summary, records });
  const recordSignals = records.flatMap((record, index) => {
    const recordKey = getRecordSignalKey(record, index);
    const base = {
      studentId,
      studentName: student.displayName || student.email || 'Naamloos',
      klasId: student.klasId || record.klasId || '',
      paragraafId: record.paragraafId || record.paragraphId || '',
      paragraafTitle: record.paragraafTitle || record.chapterTitle || 'Paragraaf',
      recordId: record.id || '',
      updatedAt: record.updatedAt || record.completedAt || record.firstAttemptAt || null
    };
    const signals = [];

    if (getTierBucket(record) === 'pendingTeacherReview') {
      signals.push({
        ...base,
        id: buildStableSignalId('progressSignal', studentId, 'teacherReview', recordKey),
        type: 'teacherReview',
        label: 'Antwoord beoordelen',
        detail: getRecordLabel(record, `Onderdeel ${index + 1}`),
        priority: 2
      });
    }

    if (record.completed !== true) {
      const attempts = Number(record.attempts || 0);
      const maxAttempts = Number(record.maxAttempts || 0);
      if (attempts >= 3 || (maxAttempts > 0 && attempts >= maxAttempts - 1)) {
        signals.push({
          ...base,
          id: buildStableSignalId('progressSignal', studentId, 'stuck', recordKey),
          type: 'stuck',
          label: 'Bijna vast',
          detail: `${getRecordLabel(record, `Onderdeel ${index + 1}`)}: ${attempts} poging${attempts === 1 ? '' : 'en'}`,
          priority: 3
        });
      }

      if (record.draftSaved === true) {
        signals.push({
          ...base,
          id: buildStableSignalId('progressSignal', studentId, 'staleDraft', recordKey),
          type: 'staleDraft',
          label: 'Concept open',
          detail: getRecordLabel(record, `Onderdeel ${index + 1}`),
          priority: 5
        });
      }
    }

    return signals;
  });

  return [...failedParagraphSignals, ...recordSignals].sort((a, b) => (
    a.priority - b.priority || a.studentName.localeCompare(b.studentName, 'nl-NL')
  ));
};

export const filterAcknowledgedProgressSignals = (signals = [], acknowledgedSignalIds = []) => {
  const acknowledged = new Set(acknowledgedSignalIds);
  return signals.filter((signal) => !acknowledged.has(signal.id));
};

export const buildClassProgressSignalItems = ({
  students = [],
  summariesByStudentId = {},
  recordsByStudentId = {},
  acknowledgedSignalIds = []
} = {}) => {
  const signals = students.flatMap((student) => {
    const studentId = student.id || student.uid;
    return buildStudentProgressSignalItems({
      student,
      summary: summariesByStudentId[studentId] || {},
      records: recordsByStudentId[studentId] || []
    });
  });

  return filterAcknowledgedProgressSignals(signals, acknowledgedSignalIds);
};

const summarizeAttention = ({ summary = {}, records = [] } = {}) => {
  const normalizedSummary = normalizeSummary(summary);
  const quality = summarizeLearningQuality(records);
  const failed = getFailedParagraphSignalCount(records, { summary: normalizedSummary });
  const stuck = records.filter((record) => {
    if (record.completed === true) return false;
    const attempts = Number(record.attempts || 0);
    const maxAttempts = Number(record.maxAttempts || 0);
    return attempts >= 3 || (maxAttempts > 0 && attempts >= maxAttempts - 1);
  }).length;
  const staleDraft = records.filter((record) => record.draftSaved === true && record.completed !== true).length;
  const notStarted = normalizedSummary.assignedItems > 0 && normalizedSummary.startedItems === 0 ? 1 : 0;

  return {
    failed,
    pendingTeacherReview: quality.counts.pendingTeacherReview,
    stuck,
    staleDraft,
    notStarted,
    total: failed + quality.counts.pendingTeacherReview + stuck + staleDraft
  };
};

const getNextAction = (attention) => {
  if (attention.failed > 0) {
    return { type: 'remediation', label: 'Herstel begeleiden', priority: 1 };
  }
  if (attention.pendingTeacherReview > 0) {
    return { type: 'review', label: 'Antwoord beoordelen', priority: 2 };
  }
  if (attention.stuck > 0) {
    return { type: 'help_now', label: 'Kort helpen', priority: 3 };
  }
  if (attention.staleDraft > 0) {
    return { type: 'check_later', label: 'Check later', priority: 5 };
  }
  return { type: 'continue', label: 'Laat doorwerken', priority: 9 };
};

export const buildStudentProgressMetrics = ({ summary = {}, records = [] } = {}) => {
  const route = normalizeSummary(summary);
  const quality = summarizeLearningQuality(records);
  const attention = summarizeAttention({ summary: route, records });

  return {
    route: {
      ...route,
      label: `${route.completedItems}/${route.assignedItems} afgerond`
    },
    quality,
    attention,
    nextAction: getNextAction(attention)
  };
};

const median = (values = []) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const midpoint = Math.floor(sorted.length / 2);
  if (sorted.length % 2) return sorted[midpoint];
  return Math.round((sorted[midpoint - 1] + sorted[midpoint]) / 2);
};

export const buildClassProgressMetrics = ({
  students = [],
  summariesByStudentId = {},
  recordsByStudentId = {}
} = {}) => {
  const studentMetrics = students.map((student) => {
    const studentId = student.id || student.uid;
    return {
      student,
      studentId,
      metrics: buildStudentProgressMetrics({
        summary: summariesByStudentId[studentId] || {},
        records: recordsByStudentId[studentId] || []
      })
    };
  });
  const percentages = studentMetrics.map(({ metrics }) => metrics.route.percentage);
  const qualityCounts = emptyQualityCounts();

  studentMetrics.forEach(({ metrics }) => {
    Object.entries(metrics.quality.counts).forEach(([key, value]) => {
      qualityCounts[key] += value;
    });
  });

  return {
    students: studentMetrics,
    attention: {
      studentCount: studentMetrics.filter(({ metrics }) => metrics.attention.total > 0).length,
      recordCount: studentMetrics.reduce((total, { metrics }) => (
        total + metrics.attention.failed + metrics.attention.pendingTeacherReview + metrics.attention.stuck
      ), 0)
    },
    progress: {
      averagePercentage: percentages.length
        ? Math.round(percentages.reduce((total, percentage) => total + percentage, 0) / percentages.length)
        : 0,
      medianPercentage: median(percentages),
      belowFortyCount: percentages.filter((percentage) => percentage < 40).length
    },
    quality: {
      counts: qualityCounts,
      questionRecordCount: studentMetrics.reduce((total, { metrics }) => total + metrics.quality.questionRecordCount, 0),
      signalCount: qualityCounts.failed + qualityCounts.pendingTeacherReview
    }
  };
};

const attentionDetail = (attention = {}) => {
  if (!attention.recordCount) return 'Geen directe signalen';
  return `${attention.recordCount} signalen om te bekijken`;
};

export const buildClassMetricCards = (metrics = {}) => {
  const qualityCounts = metrics.quality?.counts || emptyQualityCounts();
  const qualityTotal = metrics.quality?.questionRecordCount || 0;
  const attentionStudents = metrics.attention?.studentCount || 0;
  const belowForty = metrics.progress?.belowFortyCount || 0;

  return [
    {
      key: 'attention',
      label: 'Nu aandacht',
      value: String(attentionStudents),
      detail: attentionDetail(metrics.attention || {}),
      tone: attentionStudents > 0 ? 'warning' : 'neutral'
    },
    {
      key: 'quality',
      label: 'Klasbeheersing',
      value: `${qualityCounts.independent}/${qualityTotal}`,
      detail: `${qualityCounts.guided} met Digidocent, ${metrics.attention?.recordCount || 0} signalen`,
      tone: 'quality'
    },
    {
      key: 'progress',
      label: 'Lesvoortgang',
      value: `${metrics.progress?.medianPercentage || 0}%`,
      detail: `Gem. ${metrics.progress?.averagePercentage || 0}%, ${belowForty} onder 40%`,
      tone: 'progress'
    }
  ];
};

export const buildStudentMetricCards = (metrics = {}) => {
  const qualityCounts = metrics.quality?.counts || emptyQualityCounts();
  const route = metrics.route || normalizeSummary();
  const attentionTotal = metrics.attention?.total || 0;

  return [
    {
      key: 'nextAction',
      label: 'Volgende actie',
      value: metrics.nextAction?.label || 'Laat doorwerken',
      detail: attentionTotal > 0 ? `${attentionTotal} signalen` : 'Geen directe signalen',
      tone: attentionTotal > 0 ? 'warning' : 'neutral'
    },
    {
      key: 'route',
      label: 'Routepositie',
      value: `${route.completedItems || 0}/${route.assignedItems || 0}`,
      detail: `${route.percentage || 0}% van toegewezen werk`,
      tone: 'progress'
    },
    {
      key: 'quality',
      label: 'Leerkwaliteit',
      value: `${qualityCounts.independent} zelfstandig`,
      detail: `${qualityCounts.guided} met Digidocent, ${attentionTotal} signalen`,
      tone: 'quality'
    }
  ];
};

export const DASHBOARD_LENSES = [
  { key: 'class', label: 'Klas' },
  { key: 'signals', label: 'Signalen' },
  // Nakijken staat naast Signalen omdat het het enige tabblad is waar de docent
  // niet kijkt maar handelt: hier verandert een besluit de status van een stap.
  { key: 'nakijken', label: 'Nakijken' },
  { key: 'paragraph', label: 'Paragraaf' },
  { key: 'student', label: 'Leerling' }
];

export const buildDashboardLensTabs = (activeLens = 'class') =>
  DASHBOARD_LENSES.map((lens) => ({
    ...lens,
    active: lens.key === activeLens
  }));

const getKlasLabel = (klas = {}, klasId = '') =>
  String(
    klas.name ||
      klas.naam ||
      klas.klasNaam ||
      klas.title ||
      klas.label ||
      klasId ||
      'Onbekende klas'
  ).trim();

export const buildKlasFilterOptions = ({ students = [], klassenMap = {} } = {}) => {
  const countsByKlasId = students.reduce((counts, student = {}) => {
    if (!student.klasId) return counts;
    counts[student.klasId] = (counts[student.klasId] || 0) + 1;
    return counts;
  }, {});

  const klasIds = new Set([
    ...Object.keys(klassenMap || {}),
    ...Object.keys(countsByKlasId)
  ]);

  const classOptions = [...klasIds]
    .map((klasId) => ({
      value: klasId,
      label: getKlasLabel(klassenMap[klasId] || {}, klasId),
      count: countsByKlasId[klasId] || 0
    }))
    .filter((option) => option.count > 0)
    .sort((a, b) => a.label.localeCompare(b.label, 'nl-NL', { numeric: true }));

  return [
    { value: '', label: 'Alle klassen', count: students.length },
    ...classOptions
  ];
};

export const filterStudentsByKlas = (students = [], selectedKlasId = '') => {
  if (!selectedKlasId) return students;
  return students.filter((student = {}) => student.klasId === selectedKlasId);
};

export const buildParagraphProgressSummary = ({ summary = {}, records = [], paragraafId = null } = {}) => {
  const paragraphRecords = paragraafId
    ? records.filter((record) => record.paragraafId === paragraafId)
    : records;
  const route = normalizeSummary(summary);
  const quality = summarizeLearningQuality(paragraphRecords);
  const attention = summarizeAttention({ summary: route, records: paragraphRecords });
  const failed = getFailedParagraphSignalCount(paragraphRecords, {
    allowCompletedShortcut: true,
    summary: route
  });
  const statusLabel = (() => {
    if (failed > 0) return 'Herstel nodig';
    if (attention.pendingTeacherReview > 0) return 'Docent kijkt mee';
    if (attention.stuck > 0) return 'Bijna vast';
    if (route.percentage === 100) return 'Afgerond';
    if (route.startedItems > 0) return 'Bezig';
    return 'Nog niet gestart';
  })();

  return {
    statusLabel,
    signalCount: failed + attention.pendingTeacherReview + attention.stuck,
    evidenceCount: paragraphRecords.length,
    qualityLabel: `${quality.counts.independent} zelfstandig, ${quality.counts.guided} met Digidocent`,
    quality,
    attention: {
      ...attention,
      failed
    }
  };
};

export const getVisibleStudentProgressParagraphs = ({
  paragraphen = [],
  summariesByParagraafId = {}
} = {}) =>
  paragraphen.filter((paragraaf) => {
    const summary = summariesByParagraafId[paragraaf.id] || {};
    // `totaal` telt verplicht en vrijwillig samen: een plusparagraaf mag nooit
    // uit de lijst vallen omdat hij niet meetelt voor het percentage.
    const toegewezen = summary.totaal
      ? Number(summary.totaal.assignedItems || 0)
      : Number(summary.assignedItems || 0);
    return toegewezen > 0;
  });
