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

// Leeg: het eerste echte spel wordt opgebouwd volgens STARTGIDS-NIEUW-SPEL.md.
// Voorbeeldvorm van een registry-item:
// {
//   gameId: 'mijn-spel',
//   title: 'Mijn Spel',
//   description: 'Korte omschrijving voor docenten.',
//   subject: 'Digitale vaardigheden',
//   topic: 'Onderwerp',
//   level: 'VMBO leerjaar 1',
//   learningGoals: ['...'],
//   skills: ['...'],
//   estimatedMinutes: 5,
//   route: '/admin/spellen/mijn-spel',
//   componentKey: 'mijnSpel',
//   cmsEmbeddable: true,
//   supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
//   tokenRewardPotential: { min: 0, max: 10, basis: 'score_accuracy_completion' },
//   maxPlays: 0, // 0 = onbeperkt; kennisspel bijv. 3, behendigheidsspel 0
//   status: GAME_STATUSES.PROTOTYPE
// }
export const GAME_REGISTRY = [
  {
    gameId: 'wachtwoord-detective',
    title: 'Wachtwoord Detective',
    description:
      'Kraak als detective de wachtwoorden van vier personages via hun online profiel, en leer waarom een sterk wachtwoord niets over jou mag verklappen.',
    subject: 'Digitale vaardigheden',
    topic: 'Veilige wachtwoorden',
    level: 'VMBO kader-TL leerjaar 1',
    learningGoals: [
      'Herkennen waarom persoonlijke informatie in wachtwoorden onveilig is',
      'Zwakke en sterke wachtwoorden van elkaar onderscheiden',
      'Zelf een sterke wachtwoordzin samenstellen'
    ],
    skills: ['veilig handelen', 'kritisch denken', 'accountveiligheid'],
    estimatedMinutes: 6,
    route: '/admin/spellen/wachtwoord-detective',
    componentKey: 'wachtwoordDetective',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: { min: 0, max: 100, basis: 'score_accuracy_completion' },
    // Default speellimiet (0 = onbeperkt). Kennisspel: na 3 keer kennen ze de antwoorden.
    // Kan per spel overschreven worden op /admin/spellen.
    maxPlays: 3,
    status: GAME_STATUSES.PROTOTYPE
  },
  {
    gameId: 'social-media-zoektocht',
    title: 'Social Media Zoektocht',
    description:
      'Zoek-en-vindspel in drie levels plus bonuslevel: speur als digitale detective apparaten, symbolen en gevaren op in een klaslokaal, influencerkamer, social media studio en op het grote mediafestival.',
    subject: 'Digitale vaardigheden',
    topic: 'Sociale media, privacy en veilig internet',
    level: 'VMBO basis/kader/TL leerjaar 1-2',
    learningGoals: [
      'Digitale apparaten en socialmedia-symbolen herkennen',
      'Veilig omgaan met vergrendelen, locatie delen en verdachte berichten',
      'Signalen van phishing en nepnieuws herkennen'
    ],
    skills: ['waarnemen', 'veilig handelen', 'mediawijsheid'],
    estimatedMinutes: 12,
    route: '/admin/spellen/social-media-zoektocht',
    componentKey: 'socialMediaZoektocht',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: { min: 0, max: 200, basis: 'score_accuracy_completion' },
    maxPlays: 3,
    status: GAME_STATUSES.PROTOTYPE
  },
  {
    gameId: 'turbo-typen',
    title: 'Turbo Typen',
    description:
      'Sneltypspel in vijf levels: digitale woorden razen naar de firewall en jij typt ze weg. Elk level worden de woorden langer en sneller.',
    subject: 'Digitale vaardigheden',
    topic: 'Sneltypen en digitale woordenschat',
    level: 'VMBO basis/kader/TL leerjaar 1-2',
    learningGoals: [
      'Sneller en foutloos leren typen',
      'Digitale kernbegrippen herkennen en spellen',
      'Onder tijdsdruk nauwkeurig blijven werken'
    ],
    skills: ['typvaardigheid', 'concentratie', 'digitale woordenschat'],
    estimatedMinutes: 8,
    route: '/admin/spellen/turbo-typen',
    componentKey: 'turboTypen',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: { min: 0, max: 200, basis: 'score_accuracy_completion' },
    // Onbeperkt oefenen mag: de tokenopbrengst halveert server-side per beurt (replayDecay).
    maxPlays: 0,
    status: GAME_STATUSES.PROTOTYPE
  },
  {
    gameId: 'paco-pac-man',
    title: 'PacoPacMan',
    description:
      'Doolhof-arcadespel in vier levels: eet datapunten, ontwijk de virussen en beantwoord powervragen over digitale vaardigheden om de virussen op te eten. Finale met teleports en de Virus-Koning.',
    subject: 'Digitale vaardigheden',
    topic: 'De hele leerlijn: basis ICT, Office, mediawijsheid en AI',
    level: 'VMBO basis/kader/TL leerjaar 1-2',
    learningGoals: [
      'Kernbegrippen uit de hele cursus herhalen in spelvorm',
      'Sterke wachtwoorden, phishing en nepnieuws herkennen',
      'Slim omgaan met AI, algoritmes en schermtijd'
    ],
    skills: ['reactievermogen', 'kennis toepassen', 'digitale geletterdheid'],
    estimatedMinutes: 15,
    route: '/admin/spellen/paco-pac-man',
    componentKey: 'pacoPacMan',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: { min: 0, max: 400, basis: 'score_accuracy_completion' },
    // Onbeperkt oefenen; tokens vervallen per beurt via replayDecay (plafond 400).
    maxPlays: 0,
    status: GAME_STATUSES.PROTOTYPE
  },
  {
    gameId: 'data-koerier',
    title: 'Data Koerier',
    description:
      'Leer blind typen met tien vingers: bezorg datapakketjes door foutloos te typen. Dertien routes van basisrij tot volledige zinnen, plus een snelheids-Toprit.',
    subject: 'Digitale vaardigheden',
    topic: 'Blind typen met tien vingers',
    level: 'VMBO basis/kader/TL leerjaar 1-2',
    learningGoals: [
      'Blind typen met de juiste vinger per toets',
      'Eerst nauwkeurig, daarna sneller leren typen',
      'Digitale kernwoorden en zinnen foutloos typen'
    ],
    skills: ['typvaardigheid', 'vingerzetting', 'concentratie'],
    estimatedMinutes: 5,
    route: '/admin/spellen/data-koerier',
    componentKey: 'dataKoerier',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: { min: 0, max: 200, basis: 'score_accuracy_completion' },
    // Onbeperkt oefenen mag: de tokenopbrengst halveert server-side per beurt (replayDecay).
    maxPlays: 0,
    status: GAME_STATUSES.PROTOTYPE
  },
  {
    gameId: 'dvlingo',
    title: 'DVLingo',
    description:
      'Digitale Vaardigheden Lingo: raad woorden over veilig en slim online zijn in drie levels, met na elk level de ballenfase en een bonuswoord van elf letters.',
    subject: 'Digitale vaardigheden',
    topic: 'Digitale woordenschat: veiligheid, internet en apparaten',
    level: 'VMBO basis/kader/TL leerjaar 1-2',
    learningGoals: [
      'Kernbegrippen over digitale veiligheid herkennen en spellen',
      'Woorden ontleden op letters en posities onder tijdsdruk',
      'Doorzetten en slim gokken bij onvolledige informatie'
    ],
    skills: ['digitale woordenschat', 'logisch redeneren', 'spelling'],
    estimatedMinutes: 20,
    route: '/admin/spellen/dvlingo',
    componentKey: 'dvlingo',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: { min: 0, max: 400, basis: 'score_accuracy_completion' },
    // Onbeperkt spelen; de opbrengst halveert server-side per beurt (replayDecay).
    maxPlays: 0,
    status: GAME_STATUSES.PROTOTYPE
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
  attemptId,
  details = null
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
    suggestedTokenReward: calculateSuggestedTokenReward(game, accuracy),
    // Optionele spel-specifieke details (bijv. per-level statistieken);
    // reizen mee naar de voortgangsopslag, server negeert onbekende velden.
    ...(details ? { details } : {})
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
