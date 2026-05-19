export const GAME_MODES = {
  STANDALONE: 'standalone',
  CMS_BLOCK: 'cmsBlock'
};

export const GAME_RESULT_HANDLING = {
  LOCAL_ONLY: 'localOnly',
  SUBMIT_TO_BACKEND: 'submitToBackend'
};

export const GAME_STATUSES = {
  PLANNED: 'planned',
  PROTOTYPE: 'prototype',
  ACTIVE: 'active'
};

export const GAME_REGISTRY = [
  {
    gameId: 'pythagoras-trainer',
    title: 'Pythagoras Trainer',
    description: 'Placeholder voor een korte trainer rond rechthoekige driehoeken, score en nauwkeurigheid.',
    subject: 'Wiskunde',
    topic: 'Stelling van Pythagoras',
    level: 'VMBO-GT jaar 1',
    learningGoals: [
      'Herkennen wanneer de stelling van Pythagoras gebruikt kan worden',
      'Ontbrekende rechthoekszijde berekenen',
      'Antwoorden controleren op realistische uitkomst'
    ],
    skills: ['rekenen', 'ruimtelijk inzicht', 'formule toepassen'],
    estimatedMinutes: 6,
    route: '/admin/spellen/pythagoras-trainer',
    componentKey: 'placeholder',
    cmsEmbeddable: false,
    supportedModes: [GAME_MODES.STANDALONE],
    tokenRewardPotential: {
      min: 0,
      max: 25,
      basis: 'score_accuracy_completion'
    },
    status: GAME_STATUSES.PLANNED
  },
  {
    gameId: 'breuken-sprint',
    title: 'Breuken Sprint',
    description: 'Placeholder voor een snelle oefenvorm rond breuken vereenvoudigen en vergelijken.',
    subject: 'Wiskunde',
    topic: 'Breuken',
    level: 'VMBO leerjaar 1',
    learningGoals: [
      'Breuken herkennen en vergelijken',
      'Eenvoudige breuken vereenvoudigen',
      'Snelheid combineren met nauwkeurigheid'
    ],
    skills: ['hoofdrekenen', 'patroonherkenning', 'tempo'],
    estimatedMinutes: 4,
    route: '/admin/spellen/breuken-sprint',
    componentKey: 'placeholder',
    cmsEmbeddable: false,
    supportedModes: [GAME_MODES.STANDALONE],
    tokenRewardPotential: {
      min: 0,
      max: 15,
      basis: 'accuracy'
    },
    status: GAME_STATUSES.PLANNED
  },
  {
    gameId: 'begrippen-match',
    title: 'Begrippen Match',
    description: 'Placeholder voor een koppelspel waarin leerlingen begrippen aan voorbeelden verbinden.',
    subject: 'Algemeen',
    topic: 'Begrippen oefenen',
    level: 'VMBO onderbouw',
    learningGoals: [
      'Belangrijke begrippen actief ophalen',
      'Voorbeelden aan definities koppelen',
      'Misvattingen zichtbaar maken'
    ],
    skills: ['begrijpend lezen', 'classificeren', 'feedback verwerken'],
    estimatedMinutes: 5,
    route: '/admin/spellen/begrippen-match',
    componentKey: 'placeholder',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: {
      min: 0,
      max: 20,
      basis: 'completion'
    },
    status: GAME_STATUSES.PLANNED
  }
];

export const getGameById = (gameId) => {
  return GAME_REGISTRY.find((game) => game.gameId === gameId) || null;
};

export const getCmsEmbeddableGames = () => {
  return GAME_REGISTRY.filter((game) => game.supportedModes.includes(GAME_MODES.CMS_BLOCK));
};

export const isSerializableGameRegistryItem = (game) => {
  try {
    return JSON.stringify(game) !== undefined;
  } catch {
    return false;
  }
};

export const createLocalGameResult = ({
  game,
  context,
  score = 0,
  maxScore = 0,
  startedAt,
  completedAt,
  attemptId
}) => {
  const safeMaxScore = Number(maxScore) > 0 ? Number(maxScore) : 0;
  const safeScore = Math.max(0, Number(score) || 0);
  const accuracy = safeMaxScore > 0 ? Math.round((Math.min(safeScore, safeMaxScore) / safeMaxScore) * 100) : 0;
  const startedDate = startedAt ? new Date(startedAt) : new Date();
  const completedDate = completedAt ? new Date(completedAt) : new Date();
  const timeSpentSeconds = Math.max(0, Math.round((completedDate.getTime() - startedDate.getTime()) / 1000));

  return {
    attemptId: attemptId || createAttemptId(game.gameId),
    gameId: game.gameId,
    studentId: context?.studentId,
    lessonId: context?.lessonId,
    blockId: context?.blockId,
    score: safeScore,
    maxScore: safeMaxScore,
    accuracy,
    timeSpentSeconds,
    startedAt: startedDate.toISOString(),
    completedAt: completedDate.toISOString(),
    suggestedTokenReward: calculateSuggestedTokenReward(game, accuracy)
  };
};

const createAttemptId = (gameId) => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${gameId}-${crypto.randomUUID()}`;
  }

  return `${gameId}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const calculateSuggestedTokenReward = (game, accuracy) => {
  const potential = game.tokenRewardPotential || { min: 0, max: 0 };
  const min = Number(potential.min) || 0;
  const max = Number(potential.max) || 0;
  const estimated = Math.round((max * Math.max(0, Math.min(accuracy, 100))) / 100);

  return Math.max(min, Math.min(max, estimated));
};
