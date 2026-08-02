// Pure spellogica voor Wachtwoord Detective. Geen React, geen Firebase.
// Score-opbouw: 4 zaken x 2 punten (kraken) + 4 debriefvragen x 1 punt + finale 3 punten = 15.

export const CASE_MODES = {
  MULTIPLE_CHOICE: 'multipleChoice',
  COMBINE: 'combine'
};

export const CRACK_POINTS_FIRST_TRY = 2;
export const CRACK_POINTS_LATER_TRY = 1;
export const DEBRIEF_POINTS = 1;
export const FINALE_MAX_POINTS = 3;
export const FINALE_CARD_COUNT = 4;

export const WACHTWOORD_DETECTIVE_CASES = [
  {
    id: 'daan',
    name: 'Daan',
    age: 12,
    role: 'De gamer',
    emoji: '🎮',
    intro: 'Daan denkt dat zijn account superveilig is. Bekijk zijn profiel en kraak zijn wachtwoord.',
    profile: [
      { emoji: '🕹️', text: 'Gamertag: DaanDestroyer' },
      { emoji: '🐕', text: 'Post: "Mijn hond Bello is de liefste!"' },
      { emoji: '🎂', text: 'Post: "12 geworden! Beste verjaardag ooit."' },
      { emoji: '🎮', text: 'Favoriete game: Fortnite' }
    ],
    mode: CASE_MODES.MULTIPLE_CHOICE,
    password: 'bello123',
    choices: ['Xk9!pQ2z', 'bello123', 'fortnite', 'daan2020'],
    maxAttempts: 2,
    crackedExplanation: 'Daan gebruikte de naam van zijn hond plus 123. Zijn hond staat gewoon op zijn profiel!',
    debrief: {
      question: 'Wat verraadde Daans wachtwoord?',
      options: [
        { id: 'a', text: 'Zijn wachtwoord was te kort' },
        { id: 'b', text: 'Hij gebruikte zijn huisdiernaam + makkelijke cijfers', correct: true },
        { id: 'c', text: 'Hij vertelde zijn wachtwoord aan een vriend' }
      ],
      explanation: 'Een huisdiernaam met 123 erachter is een van de eerste dingen die een hacker probeert.'
    }
  },
  {
    id: 'sofia',
    name: 'Sofia',
    age: 13,
    role: 'De voetbalster',
    emoji: '⚽',
    intro: 'Sofia speelt in het eerste team. Haar profiel staat vol voetbal. Kraak haar wachtwoord.',
    profile: [
      { emoji: '👕', text: 'Teamfoto VV De Leeuwen, shirt met rugnummer 10' },
      { emoji: '⭐', text: 'Bio: "Messi is mijn held!"' },
      { emoji: '🏆', text: 'Post: "Toernooi gewonnen in 2024!"' },
      { emoji: '⚽', text: 'Traint elke dinsdag en donderdag' }
    ],
    mode: CASE_MODES.MULTIPLE_CHOICE,
    password: 'Messi10',
    choices: ['Leeuwen2024', 'Messi10', 'sofia13', 'voetbal!'],
    maxAttempts: 2,
    crackedExplanation: 'Sofia combineerde haar idool met haar rugnummer. Allebei staan gewoon op haar profiel.',
    debrief: {
      question: 'Waarom is een idool + rugnummer onveilig als wachtwoord?',
      options: [
        { id: 'a', text: 'Iedereen kan die informatie op je profiel zien', correct: true },
        { id: 'b', text: 'Namen van voetballers mogen niet in wachtwoorden' },
        { id: 'c', text: 'Er zitten geen letters in' }
      ],
      explanation: 'Alles wat openbaar op je profiel staat, kan een hacker gebruiken om je wachtwoord te raden.'
    }
  },
  {
    id: 'truus',
    name: 'Oma Truus',
    age: 68,
    role: 'De oma',
    emoji: '🧶',
    intro: 'Oma Truus deelt graag over haar leven. Combineer aanwijzingen uit haar profiel tot haar wachtwoord.',
    profile: [
      { emoji: '🐱', text: 'Post: "Mijn lieve kat Minoes woont vandaag precies 8 jaar bij mij! (sinds 2018)"' },
      { emoji: '🥧', text: 'Deelt elke week een recept' },
      { emoji: '👧', text: 'Foto met kleindochter Lisa' },
      { emoji: '🐦', text: 'Profielfoto met vogelhuisje' }
    ],
    mode: CASE_MODES.COMBINE,
    password: 'Minoes2018',
    fragments: [
      { id: 'minoes', label: 'Minoes' },
      { id: 'lisa', label: 'Lisa' },
      { id: '2018', label: '2018' },
      { id: 'recept', label: 'recept' },
      { id: 'vogel', label: 'vogel' },
      { id: 'uitroep', label: '!' }
    ],
    solutionFragmentIds: ['minoes', '2018'],
    maxAttempts: 3,
    crackedExplanation: 'Oma Truus koos haar kat + het jaar dat Minoes kwam. Ze vertelde het zelf in een post!',
    debrief: {
      question: 'Oma dacht dat niemand haar wachtwoord kon raden. Waarom kon jij het wel?',
      options: [
        { id: 'a', text: 'Omdat oude mensen slechte wachtwoorden kiezen' },
        { id: 'b', text: 'Omdat ze de informatie zelf openbaar online zette', correct: true },
        { id: 'c', text: 'Omdat katten populaire wachtwoorden zijn' }
      ],
      explanation: 'Wat je online deelt, kan tegen je gebruikt worden. Kies dus een wachtwoord dat nérgens op je profiel staat.'
    }
  },
  {
    id: 'jayden',
    name: 'Jayden',
    age: 13,
    role: 'De influencer',
    emoji: '📱',
    intro: 'Jayden deelt ALLES online: 2.000 volgers zien zijn hele leven. Dit wordt een makkie... toch?',
    profile: [
      { emoji: '📸', text: '2.000 volgers, alles openbaar' },
      { emoji: '🐶', text: 'Hond Rocky komt in elke video' },
      { emoji: '🏫', text: 'Post: "Eerste dag op mijn nieuwe school!"' },
      { emoji: '🎉', text: 'Verjaardagsvlog: "13 jaar!"' }
    ],
    mode: CASE_MODES.COMBINE,
    password: 'KoalaDanstOp7Wolken!',
    fragments: [
      { id: 'rocky', label: 'Rocky' },
      { id: 'jayden', label: 'Jayden' },
      { id: '2012', label: '2012' },
      { id: 'school', label: 'school' },
      { id: '13', label: '13' },
      { id: 'tiktok', label: 'tiktok' }
    ],
    solutionFragmentIds: null,
    uncrackable: true,
    giveUpAfterAttempts: 2,
    maxAttempts: 4,
    crackedExplanation: '',
    giveUpExplanation:
      'Goed gezien, detective! Jaydens wachtwoord is "KoalaDanstOp7Wolken!" — een lange, willekeurige wachtwoordzin. Er zit níéts uit zijn leven in, dus je kunt op zijn profiel zoeken wat je wilt: je vindt het nooit.',
    debrief: {
      question: 'Jayden deelt alles online en tóch is zijn account veilig. Hoe kan dat?',
      options: [
        { id: 'a', text: 'Zijn wachtwoord verklapt niets over wie hij is', correct: true },
        { id: 'b', text: 'Influencers krijgen extra beveiliging van TikTok' },
        { id: 'c', text: 'Hij verandert zijn wachtwoord elke dag' }
      ],
      explanation: 'Dit is de gouden regel: een sterk wachtwoord is lang én heeft niets met jou te maken.'
    }
  }
];

export const FINALE_CARDS = [
  { id: 'pannenkoek', label: 'Pannenkoek', type: 'strong' },
  { id: 'raket', label: 'Raket', type: 'strong' },
  { id: 'fluistert', label: 'Fluistert', type: 'strong' },
  { id: 'blauw', label: 'Blauw', type: 'strong' },
  { id: 'negen', label: '9', type: 'strong' },
  { id: 'teken', label: '!', type: 'strong' },
  { id: 'eigennaam', label: 'Je eigen naam', type: 'trap', reason: 'Je naam is het eerste wat een hacker probeert.' },
  { id: '123', label: '123', type: 'trap', reason: '123 is het meest geraden cijferrijtje ter wereld.' },
  { id: 'geboortejaar', label: 'Je geboortejaar', type: 'trap', reason: 'Je geboortejaar staat vaak gewoon online.' },
  { id: 'welkom', label: 'welkom', type: 'trap', reason: '"welkom" staat in elke lijst met veelgebruikte wachtwoorden.' }
];

const normalizeAttempt = (value) => String(value || '').replace(/\s+/g, '').toLowerCase();

export const isCaseCracked = (caseItem, attempt) => {
  if (!caseItem || caseItem.uncrackable) return false;
  return normalizeAttempt(attempt) === normalizeAttempt(caseItem.password);
};

export const buildAttemptFromFragments = (caseItem, fragmentIds = []) => {
  const byId = new Map((caseItem.fragments || []).map((fragment) => [fragment.id, fragment.label]));
  return fragmentIds.map((id) => byId.get(id) || '').join('');
};

export const crackPointsForAttempt = (attemptNumber) => {
  if (attemptNumber <= 1) return CRACK_POINTS_FIRST_TRY;
  return CRACK_POINTS_LATER_TRY;
};

export const canGiveUp = (caseItem, attemptsUsed) => {
  if (!caseItem?.uncrackable) return false;
  return attemptsUsed >= (caseItem.giveUpAfterAttempts || 2);
};

export const giveUpPoints = (attemptsUsed) => {
  // Opgeven bij een onkraakbaar wachtwoord is het juiste antwoord: volle punten
  // zolang de leerling niet eerst alle pogingen heeft verspild.
  return attemptsUsed <= 2 ? CRACK_POINTS_FIRST_TRY : CRACK_POINTS_LATER_TRY;
};

export const isDebriefCorrect = (caseItem, optionId) => {
  const option = (caseItem?.debrief?.options || []).find((entry) => entry.id === optionId);
  return option?.correct === true;
};

export const evaluateFinaleSelection = (cardIds = []) => {
  const cards = FINALE_CARDS.filter((card) => cardIds.includes(card.id));
  const traps = cards.filter((card) => card.type === 'trap');
  const strongCount = cards.length - traps.length;
  const complete = cards.length >= FINALE_CARD_COUNT;
  const score = complete ? Math.max(0, FINALE_MAX_POINTS - traps.length) : 0;
  const strengthPercent = Math.round(
    (Math.min(strongCount, FINALE_CARD_COUNT) / FINALE_CARD_COUNT) * 100
  );

  return {
    complete,
    score,
    strengthPercent,
    trapCards: traps,
    passwordPreview: cards.map((card) => card.label).join('')
  };
};

export const calculateMaxScore = () => {
  const crackMax = WACHTWOORD_DETECTIVE_CASES.length * CRACK_POINTS_FIRST_TRY;
  const debriefMax = WACHTWOORD_DETECTIVE_CASES.length * DEBRIEF_POINTS;
  return crackMax + debriefMax + FINALE_MAX_POINTS;
};
