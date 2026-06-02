const clampTasks = (tasks = [], minimum = 2, maximum = 4) => {
  const cleanTasks = tasks
    .map((task) => ({
      title: String(task.title || '').trim(),
      prompt: String(task.prompt || '').trim()
    }))
    .filter((task) => task.prompt);

  const fallbackTasks = [
    {
      title: 'Stap opnieuw opbouwen',
      prompt: 'Schrijf eerst op wat er gevraagd wordt, welke gegevens je hebt en welke eerste stap daarbij hoort.'
    },
    {
      title: 'Controleer je antwoord',
      prompt: 'Maak een vergelijkbare oefening en controleer of je antwoord past bij de vraag en eventuele eenheid.'
    }
  ];

  return [...cleanTasks, ...fallbackTasks].slice(0, Math.max(minimum, Math.min(maximum, cleanTasks.length || minimum)));
};

const stripHtml = (value = '') =>
  String(value || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const getRecordLabel = (record = {}, index = 0) =>
  record.vraagTitle || record.blockTitle || `Vraag ${index + 1}`;

const getQuestionText = (record = {}) =>
  stripHtml(record.questionPlainText || record.questionPrompt || record.questionPromptHtml || record.promptHtml || '');

const getExpectedAnswer = (record = {}) =>
  String(record.expectedAnswer || record.modelAnswer || record.modelAnswerSnapshot || record.correctAnswer || '').trim();

const getLearnerAnswer = (record = {}) => {
  const answer = record.lastAnswer || {};
  if (answer.expectedValue) return String(answer.expectedValue).trim();
  if (answer.openAnswer) return String(answer.openAnswer).trim();
  const filled = Object.entries(answer)
    .filter(([, value]) => typeof value !== 'object' && String(value || '').trim())
    .map(([, value]) => String(value).trim());
  return filled.join(', ');
};

const getRecordFeedback = (record = {}) =>
  record.teacherFeedbackSummary ||
  record.lastAssessment?.feedback ||
  record.openAnswerAssessment?.feedback ||
  'de denkstappen bij deze vraag';

const parseBinaryOperation = (text = '') => {
  const match = String(text || '').match(/(-?\d+(?:[.,]\d+)?)\s*([+x*])\s*(-?\d+(?:[.,]\d+)?)/i);
  if (!match) return null;
  const left = Number(String(match[1]).replace(',', '.'));
  const operator = match[2].toLowerCase() === 'x' ? '*' : match[2];
  const right = Number(String(match[3]).replace(',', '.'));
  if (!Number.isFinite(left) || !Number.isFinite(right)) return null;
  return { left, operator, right };
};

const buildParallelPractice = (questionText = '') => {
  const operation = parseBinaryOperation(questionText);
  if (operation?.operator === '+') {
    return {
      diagnosis: 'Je lijkt de bewerking te verwisselen. Bij een plusteken tel je de getallen bij elkaar op.',
      tasks: [
        `Maak nu een vergelijkbare optelsom: ${operation.left + 1} + ${operation.right + 1} = ...`,
        `Maak nog een optelsom: ${operation.left + 2} + ${operation.right} = ...`
      ],
      check: 'Leg bij een van de sommen uit waaraan je ziet dat je moet optellen.'
    };
  }

  const sqrtMatch = String(questionText || '').match(/(?:\u221a|wortel\s+van\s+)(\d+)/i);
  if (sqrtMatch) {
    return {
      diagnosis: 'Bij een wortel zoek je het getal dat met zichzelf vermenigvuldigd het getal onder de wortel maakt.',
      tasks: [
        'Maak nu: wortel van 81 = ...',
        'Controleer je antwoord met de omgekeerde bewerking: welk getal keer zichzelf is 81?'
      ],
      check: 'Schrijf kort op hoe je je antwoord controleert.'
    };
  }

  return {
    diagnosis: 'Herbouw de vraag met dezelfde aanpak, maar in kleinere stappen.',
    tasks: [
      'Maak een vergelijkbare oefening met andere getallen.',
      'Controleer of je antwoord past bij de vraag en eventuele eenheid.'
    ],
    check: 'Schrijf op welke stap je nu anders doet.'
  };
};

const buildRemediationPrompt = (record = {}, index = 0) => {
  const label = getRecordLabel(record, index);
  const questionText = getQuestionText(record);
  const learnerAnswer = getLearnerAnswer(record);
  const expectedAnswer = getExpectedAnswer(record);
  const feedback = getRecordFeedback(record)
    .replace(/Deze vraag wordt geparkeerd voor herstel\.?\s*/gi, '')
    .trim();
  const practice = buildParallelPractice(questionText || label);

  return [
    questionText ? `Oorspronkelijke vraag: ${questionText}` : `Oorspronkelijke vraag: ${label}`,
    learnerAnswer ? `Jouw laatste antwoord: ${learnerAnswer}` : '',
    expectedAnswer ? `Waar je naartoe werkt: ${expectedAnswer}` : '',
    feedback ? `Feedback: ${feedback}` : '',
    `Let op: ${practice.diagnosis}`,
    ...practice.tasks,
    practice.check
  ].filter(Boolean).join('\n');
};

export const buildParagraphEndActivity = ({
  kind = '',
  paragraaf = {},
  records = []
} = {}) => {
  const paragraphTitle = paragraaf?.title || 'deze paragraaf';

  if (kind === 'challenge') {
    return {
      assignmentKind: 'challenge',
      required: true,
      maxAttempts: 1,
      title: 'Uitdaging',
      explanation: `Je basisvragen bij ${paragraphTitle} zijn groen. Laat nu zien dat je dezelfde aanpak in een nieuwe situatie kunt gebruiken.`,
      tasks: [
        {
          title: 'Uitdagende vraag',
          prompt: `Bedenk een nieuw voorbeeld bij ${paragraphTitle}, los het uit en leg kort uit waarom je aanpak klopt.`
        }
      ]
    };
  }

  if (kind === 'remediation') {
    const tasks = records.map((record, index) => ({
      title: `Herstel bij ${getRecordLabel(record, index)}`,
      prompt: buildRemediationPrompt(record, index)
    }));

    return {
      assignmentKind: 'remediation',
      required: true,
      maxAttempts: 1,
      title: 'Herstelopdracht',
      explanation: `Je krijgt kort herstelwerk bij ${paragraphTitle}, gericht op de vragen die nog rood staan.`,
      tasks: clampTasks(tasks)
    };
  }

  return {
    assignmentKind: '',
    required: false,
    maxAttempts: 0,
    title: '',
    explanation: '',
    tasks: []
  };
};

export const buildParagraphEndProgressPayload = ({
  activity = {},
  answer = '',
  assessment = {}
} = {}) => {
  const assignmentKind = activity.assignmentKind || '';
  const isChallenge = assignmentKind === 'challenge';
  const isRemediation = assignmentKind === 'remediation';
  const aiFailed = isChallenge && assessment?.success === false;

  return {
    progressType: 'paragraphEnd',
    assignmentKind,
    completed: true,
    isCorrect: isChallenge ? Boolean(assessment?.success && assessment?.isCorrect) : true,
    attempts: 1,
    maxAttempts: activity.maxAttempts || 1,
    resultTier: aiFailed
      ? 'pending_teacher_review'
      : (isChallenge ? (assessment?.isCorrect === false ? 'failed' : 'independent') : 'guided'),
    attemptStatus: aiFailed ? 'pending_teacher_review' : 'completed',
    completionReason: isRemediation ? 'remediation_completed' : 'challenge_completed',
    teacherSignal: aiFailed ? 'ai_assessment_failed' : (isChallenge ? 'challenge_feedback' : 'remediation_completed'),
    teacherFeedbackSummary: assessment?.feedback || '',
    lastAnswer: { paragraphEndAnswer: answer },
    lastAssessment: {
      source: isChallenge ? 'ai' : 'local',
      status: aiFailed ? 'failed_to_assess' : (assessment?.isCorrect === false ? 'incorrect' : 'correct'),
      feedback: assessment?.feedback || '',
      missing: Array.isArray(assessment?.missing) ? assessment.missing : []
    }
  };
};
