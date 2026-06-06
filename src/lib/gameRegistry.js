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
    description: 'Speelbare trainer rond rechthoekige driehoeken, score en nauwkeurigheid.',
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
    componentKey: 'pythagorasTrainer',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: {
      min: 0,
      max: 25,
      basis: 'score_accuracy_completion'
    },
    status: GAME_STATUSES.PROTOTYPE
  },
  {
    gameId: 'dv-account-escape',
    title: 'Account Escape',
    description: 'Speelbare schoolstart-escape rond HELIX, OneDrive, Outlook, bestanden terugvinden en veilig uitloggen.',
    subject: 'Digitale vaardigheden',
    topic: 'Schoolaccount en digitale schooltas',
    level: 'VMBO leerjaar 1',
    learningGoals: [
      'HELIX herkennen als startplek voor de lesroute',
      'Schoolwerk veilig en overzichtelijk in OneDrive plaatsen',
      'Duidelijke bestandsnamen herkennen',
      'Outlook gebruiken voor schoolmail zonder wachtwoorden te delen',
      'Een gedeeld apparaat veilig afsluiten'
    ],
    skills: ['navigeren', 'accountveiligheid', 'bestanden organiseren', 'veilig handelen'],
    estimatedMinutes: 5,
    route: '/admin/spellen/dv-account-escape',
    componentKey: 'accountEscape',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: { min: 0, max: 10, basis: 'score_accuracy_completion' },
    status: GAME_STATUSES.PROTOTYPE
  },
  {
    gameId: 'dv-password-lab',
    title: 'Password Lab',
    description: 'Placeholder waarin leerlingen nepwachtwoorden rangschikken van zwak naar sterk.',
    subject: 'Digitale vaardigheden',
    topic: 'Wachtwoorden',
    level: 'VMBO leerjaar 1',
    learningGoals: ['Sterke wachtwoordzinnen herkennen', 'Onveilige patronen vermijden', 'Accountregels toepassen'],
    skills: ['veilig handelen', 'classificeren'],
    estimatedMinutes: 5,
    route: '/admin/spellen/dv-password-lab',
    componentKey: 'placeholder',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: { min: 0, max: 10, basis: 'accuracy_completion' },
    status: GAME_STATUSES.PLANNED
  },
  ...[
    ['dv-hardware-hunt', 'Hardware Hunt', 'Koppel hardware, software, invoer en uitvoer aan de juiste functie.', 'Device, hardware en software'],
    ['dv-bestandenrace', 'Bestandenrace', 'Kies per schoolvoorbeeld de beste map en bestandsnaam.', 'Bestanden organiseren'],
    ['dv-phishing-detective', 'Phishing Detective', 'Klik verdachte plekken aan in fictieve berichten.', 'Phishing herkennen'],
    ['dv-schoolstart-escape', 'Schoolstart Escape', 'Los vijf kamers op: account, OneDrive, Outlook, bestanden en phishing.', 'Checkpoint veilig starten'],
    ['dv-opmaakdokter', 'Opmaakdokter', 'Verbeter veelvoorkomende opmaakfouten in een schooldocument.', 'Word-documenten'],
    ['dv-plagiaatpolitie', 'Plagiaatpolitie', 'Beoordeel zinnen als eigen woorden, citaat of kopie zonder bron.', 'Bronnen en plagiaat'],
    ['dv-dia-dokter', 'Dia Dokter', 'Kies verbeteringen voor drukke of onduidelijke dia’s.', 'PowerPoint'],
    ['dv-pitchtimer', 'Pitchtimer', 'Oefen een korte uitleg zonder alles voor te lezen.', 'Presenteren'],
    ['dv-deelrechten-duel', 'Deelrechten Duel', 'Kies per situatie de juiste deelrechten.', 'Samenwerken met OneDrive'],
    ['dv-microsoft-maker-challenge', 'Microsoft Maker Challenge', 'Vind fouten in document, dia, mail en deelinstelling.', 'Checkpoint Microsoft tools'],
    ['dv-privacy-thermometer', 'Privacy Thermometer', 'Sorteer privacy-scenario’s in groen, oranje of rood.', 'Privacy'],
    ['dv-feed-sorteerspel', 'Feed Sorteerspel', 'Stuur een fictieve feed en zie hoe keuzes aanbevelingen veranderen.', 'Social media algoritmes'],
    ['dv-bronbattle', 'Bronbattle', 'Rangschik bronnen op betrouwbaarheid en bewijs.', 'Bronnen beoordelen'],
    ['dv-grenzenkompas', 'Grenzenkompas', 'Kies bij online scenario’s: oké, twijfel, niet oké of hulp nodig.', 'Cyberpesten en grenzen'],
    ['dv-webshop-inspecteur', 'Webshop Inspecteur', 'Vind signalen in fictieve webshops en bepaal veilig, twijfel of niet kopen.', 'Online shoppen'],
    ['dv-mediawijs-boss', 'Mediawijs Boss', 'Combineer privacy, broncheck, groepschat en kooplink in één boss-level.', 'Checkpoint mediawijsheid'],
    ['dv-tabel-tetris', 'Tabel Tetris', 'Sleep gegevens naar de juiste Excel-kolommen.', 'Excel-tabellen'],
    ['dv-formule-fixer', 'Formule Fixer', 'Repareer foute Excel-formules.', 'Excel-formules'],
    ['dv-grafiek-judge', 'Grafiek Judge', 'Beoordeel grafieken op duidelijkheid en eerlijkheid.', 'Grafieken'],
    ['dv-data-spoorzoeker', 'Data Spoorzoeker', 'Volg dataspuren door een gewone schooldag.', 'Data en privacy'],
    ['dv-claim-checker', 'Claim Checker', 'Sorteer claims in sterk bewijs, twijfel of zwak bewijs.', 'Claims en data'],
    ['dv-dashboard-dash', 'Dashboard Dash', 'Kies de beste visualisatie bij een onderzoeksvraag.', 'Data-dashboard'],
    ['dv-prompt-duel', 'Prompt Duel', 'Kies en verbeter prompts voor een AI-chatbot.', 'AI en prompts'],
    ['dv-echt-nep-of-twijfel', 'Echt, nep of twijfel?', 'Verzamel bewijschecks bij AI-beelden en deepfakes.', 'AI-beelden'],
    ['dv-algoritme-estafette', 'Algoritme Estafette', 'Leg stappenkaarten in de juiste volgorde en test het algoritme.', 'Algoritmes'],
    ['dv-debug-sprint', 'Debug Sprint', 'Vind fouten in mini-programma’s en verbeter de stap.', 'Programmeren en debuggen'],
    ['dv-portfolio-quest', 'Portfolio Quest', 'Verzamel bewijsstukken voor badges en herstel ontbrekende onderdelen.', 'Portfolio'],
    ['dv-certificaat-quest-finale', 'Certificaat Quest Finale', 'Beantwoord portfoliovragen en geef feedback tijdens de eindexpo.', 'Eindexpo']
  ].map(([gameId, title, description, topic]) => ({
    gameId,
    title,
    description: `Placeholder: ${description}`,
    subject: 'Digitale vaardigheden',
    topic,
    level: 'VMBO leerjaar 1',
    learningGoals: ['Begrippen toepassen', 'Keuzes uitleggen', 'Lesstof actief herhalen'],
    skills: ['digitale geletterdheid', 'kritisch denken', 'feedback verwerken'],
    estimatedMinutes: 5,
    route: `/admin/spellen/${gameId}`,
    componentKey: 'placeholder',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: { min: 0, max: gameId.includes('checkpoint') || gameId.includes('boss') || gameId.includes('finale') ? 20 : 10, basis: 'completion' },
    status: GAME_STATUSES.PLANNED
  }))
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
