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

const getRecordLabel = (record = {}, index = 0) =>
  record.vraagTitle || record.blockTitle || `Vraag ${index + 1}`;

const getRecordFeedback = (record = {}) =>
  record.teacherFeedbackSummary ||
  record.lastAssessment?.feedback ||
  record.openAnswerAssessment?.feedback ||
  'de denkstappen bij deze vraag';

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
      prompt: `Bekijk ${getRecordLabel(record, index)} opnieuw. Werk in kleine stappen: wat is gegeven, wat wordt gevraagd, welke tussenstap hoort erbij? Let vooral op: ${getRecordFeedback(record)}.`
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
