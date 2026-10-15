export const getCompletedBlockIds = (progressRecords = []) =>
  new Set(
    progressRecords
      .filter((record) => record.completed === true)
      .map((record) => record.blockId || record.vraagId)
      .filter(Boolean)
  );

/**
 * Hoeveel vragen heeft dit blok NU? Een quiz of toets telt de vragen in
 * `content.items` (de publieke snapshot die de leerling-app al laadt), een los
 * vraagblok is één vraag. Elk ander blok heeft geen vragen.
 */
export const aantalVragenInBlok = (block = null) => {
  if (block?.type === 'quiz' || block?.type === 'toets') {
    return Array.isArray(block.content?.items) ? block.content.items.length : 0;
  }
  return block?.type === 'question' ? 1 : 0;
};

const heeftAntwoord = (record = {}) =>
  Number(record.attempts) > 0 || (record.lastAnswer !== null && record.lastAnswer !== undefined);

/**
 * Hoeveel vragen van dit blok zijn volgens het blokrecord beantwoord? Een quiz
 * of toets houdt dat bij in `itemsCompleted`. Een los vraagblok niet: daar is
 * het ingeleverde antwoord zelf de ene vraag.
 */
const beantwoordeVragen = (record = {}, block = null) => {
  const geteld = Math.max(0, Number(record.itemsCompleted) || 0);
  if (block?.type === 'question') return heeftAntwoord(record) ? Math.max(1, geteld) : geteld;
  return geteld;
};

/**
 * Is dit blok strikt af? Strenger dan `getCompletedBlockIds`: het record moet
 * afgerond zijn ÉN alle vragen van het blok zoals het nu is moeten beantwoord
 * zijn. Zo telt een oud record van een blok dat later een quiz werd
 * (completed, maar itemsCompleted 0) niet meer als af. Een blok zonder vragen
 * is af als zijn record afgerond is, net als overal.
 */
export const isBlokStriktAf = (block = null, progressRecords = []) => {
  const id = block?.id;
  if (!id) return false;
  const afgerond = (Array.isArray(progressRecords) ? progressRecords : [])
    .filter((record) => (record?.blockId || record?.vraagId) === id && record?.completed === true);
  if (!afgerond.length) return false;
  const nodig = aantalVragenInBlok(block);
  if (nodig === 0) return true;
  return afgerond.some((record) => beantwoordeVragen(record, block) >= nodig);
};

export const calculateLessonProgress = (blocks = [], progressRecords = []) => {
  const completedIds = getCompletedBlockIds(progressRecords);
  const totalBlocks = blocks.length;
  const completedBlocks = blocks.filter((block) => completedIds.has(block.id)).length;

  return {
    totalBlocks,
    completedBlocks,
    percentage: totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0,
    isCompleted: totalBlocks > 0 && completedBlocks === totalBlocks
  };
};

export const findResumeBlockIndex = (blocks = [], progressRecords = []) => {
  if (!blocks.length) return 0;

  const completedIds = getCompletedBlockIds(progressRecords);
  const firstIncompleteIndex = blocks.findIndex((block) => !completedIds.has(block.id));

  return firstIncompleteIndex === -1 ? blocks.length - 1 : firstIncompleteIndex;
};

// De lesstofpagina kan rechtstreeks naar één onderdeel starten (?stap=blokId).
// Dat mag de route niet openbreken: staat er nog een onafgeronde kernvraag vóór
// dat blok, dan komt de leerling gewoon uit waar hij gebleven was.
export const resolveRequestedBlockIndex = ({
  blocks = [],
  progressRecords = [],
  requestedBlockId = ''
} = {}) => {
  const resumeIndex = findResumeBlockIndex(blocks, progressRecords);
  const requestedId = String(requestedBlockId || '').trim();
  if (!requestedId) return resumeIndex;

  const requestedIndex = blocks.findIndex((block) => block?.id === requestedId);
  if (requestedIndex === -1) return resumeIndex;

  const completedIds = getCompletedBlockIds(progressRecords);
  const isBlocked = blocks
    .slice(0, requestedIndex)
    .some((block) => block?.type === 'question' && !completedIds.has(block?.id));

  return isBlocked ? resumeIndex : requestedIndex;
};

// Blokken die hun eigen afronding kennen: een vraag via het antwoord, een quiz
// of toets via de vragen erin (summarizeAssessmentItemProgress). Die mogen
// nooit stilletjes op afgerond springen omdat de leerling doorklikt; anders
// staat na drie vragen de hele paragraaf op "afgesloten".
const SELF_COMPLETING_BLOCK_TYPES = new Set(['question', 'quiz', 'toets']);

export const shouldSaveBlockProgressBeforeNavigation = ({ block = null, completedIds = new Set() } = {}) => {
  if (!block?.id) return false;
  if (SELF_COMPLETING_BLOCK_TYPES.has(block.type)) return false;
  return !completedIds.has(block.id);
};

export const getLessonBlockRenderKey = (block = null) =>
  `lesson-block:${block?.id || 'missing'}`;

/**
 * Opent het afrondscherm vanzelf zodra een paragraaf geladen wordt?
 *
 * Tot 14 september 2026 gebeurde dat bij elke afgeronde paragraaf. Wie iets kwam
 * nalezen kreeg dus eerst het slotscherm en moest terugklikken voor hij bij zijn
 * eigen antwoorden was. Het slotscherm hoort bij het MOMENT van afronden - de
 * Verder-knop zet het dan zelf - en bij herstelwerk dat nog openstaat.
 *
 * Alleen `remediation` telt als herstelwerk. `challenge` staat ook op
 * `required`, maar dat is de bonus voor wie alles goed had; die hoeft niemand
 * bij het openen van een oude paragraaf voor de voeten te krijgen. Hij blijft
 * bereikbaar via "Les afronden" op de laatste stap.
 *
 * Vraagt de leerling om een bepaalde stap (de `stap`-parameter in de URL), dan
 * wint die altijd: hij wil daar zijn, niet op het slotscherm.
 */
export const opentAfrondschermBijLaden = ({
  isCompleted = false,
  afrondschermAfgerond = false,
  eindPlanKind = '',
  gevraagdeStapId = ''
} = {}) => {
  if (gevraagdeStapId) return false;
  if (!isCompleted || afrondschermAfgerond) return false;
  return eindPlanKind === 'remediation';
};
