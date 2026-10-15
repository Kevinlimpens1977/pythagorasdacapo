/**
 * Rekenwerk voor de digitale nulmeting van Diff rekenen. Puur: geen Firestore,
 * geen bestanden. Het script scripts/diff-rekenen-nulmeting-overzicht.mjs haalt
 * de data op en geeft die hier door.
 *
 * Per domein (paragraaf) is er één quizblok met twaalf vragen. Elke vraag heeft
 * een niveau in item.taxonomy.masteryLevel: basis (1-4), plus (5-8) of
 * verdieping (9-12).
 *
 * Een itemrecord is het document voortgang/{uid}_{blockId}/items/{itemId}
 * (zie buildAssessmentItemVoortgangUpdate in src/lib/voortgangPayload.js).
 * Hier tellen deze velden:
 *   itemId, blockId, userId    welke vraag, welk blok, welke leerling
 *   completed, attempts        of de vraag gemaakt is
 *   isCorrect                  goed of fout
 *   ronde1.isCorrect           stand van de eerste ronde; telt voor een
 *                              nulmeting zwaarder dan een latere herkansing
 *   lastAnswer.value           het antwoord: een getal/tekst, of een optie-id
 *
 * Geschat niveau per domein. De regel, van hoog naar laag:
 *   verdieping   minstens 3 van de 4 verdiepingsvragen goed;
 *   plus         anders: minstens 3 van de 4 plusvragen goed;
 *   basis        anders: minstens 3 van de 4 basisvragen goed;
 *   onder basis  anders, als er wel iets gemaakt is;
 *   niet gemaakt als er in dat domein geen enkele vraag gemaakt is.
 * Een domein dat half gemaakt is krijgt wel een niveau, maar `volledig: false`.
 *
 * Volgorde van sterk naar zwak: eerst op percentage goed (van 12). Bij gelijk
 * percentage telt wie meer verdiepingsvragen goed had, dan plus, dan basis.
 * Daarna de domeincode, zodat de volgorde altijd vastligt.
 */

import { formatItemAntwoord } from '../../src/lib/klasVoortgangOverzicht.js';

export const NIVEAUS = ['basis', 'plus', 'verdieping'];
export const DREMPEL_GOED = 3;

/** Niveau van een vraag; zonder taxonomie volgt het uit de plek (1-4, 5-8, 9-12). */
export const niveauVanItem = (item = {}, index = 0) => {
  const niveau = String(item?.taxonomy?.masteryLevel || '').trim().toLowerCase();
  if (NIVEAUS.includes(niveau)) return niveau;
  return NIVEAUS[Math.min(2, Math.floor(index / 4))];
};

const heeftAntwoord = (record) => {
  const antwoord = record?.lastAnswer;
  if (antwoord === null || antwoord === undefined) return false;
  if (typeof antwoord === 'object' && !Array.isArray(antwoord) && 'value' in antwoord) {
    return antwoord.value !== null && antwoord.value !== undefined && antwoord.value !== '';
  }
  return antwoord !== '';
};

/** Gemaakt: ingeleverd (completed) of minstens één poging met een antwoord. */
export const isGemaakt = (record) => {
  if (!record) return false;
  if (record.completed === true) return true;
  return Number(record.attempts) > 0 && heeftAntwoord(record);
};

/** Goed: de eerste ronde telt als die er is, anders de huidige stand. */
export const isGoed = (record) => {
  if (!isGemaakt(record)) return false;
  if (record.ronde1 && typeof record.ronde1 === 'object' && typeof record.ronde1.isCorrect === 'boolean') {
    return record.ronde1.isCorrect;
  }
  return record.isCorrect === true;
};

export const schatNiveau = (perNiveau, gemaakt) => {
  if (!gemaakt) return 'niet gemaakt';
  for (const niveau of [...NIVEAUS].reverse()) {
    if ((perNiveau[niveau]?.goed || 0) >= DREMPEL_GOED) return niveau;
  }
  return 'onder basis';
};

const recordSleutel = (record) => String(record?.itemId || record?.id || '');

/**
 * Eén domein voor één leerling.
 * @param {object} p
 * @param {string} p.code       bijv. "1.1"
 * @param {string} p.titel      bijv. "Getallen"
 * @param {string} p.blockId    id van het quizblok
 * @param {Array}  p.blockItems de vragen uit block.content.items
 * @param {Array}  p.itemRecords itemrecords uit de subcollectie items
 * @param {string} [p.userId]   records van een andere leerling of ander blok
 *                              worden genegeerd
 */
export const beoordeelDomein = ({ code = '', titel = '', blockId = '', blockItems = [], itemRecords = [], userId = '' } = {}) => {
  const records = new Map();
  (Array.isArray(itemRecords) ? itemRecords : []).forEach((record) => {
    if (!record) return;
    if (blockId && record.blockId && record.blockId !== blockId) return;
    if (userId && record.userId && record.userId !== userId) return;
    const sleutel = recordSleutel(record);
    if (sleutel) records.set(sleutel, record);
  });

  const items = Array.isArray(blockItems) ? blockItems : [];
  const perNiveau = Object.fromEntries(NIVEAUS.map((niveau) => [niveau, { totaal: 0, gemaakt: 0, goed: 0 }]));

  const vragen = items.map((item, index) => {
    const niveau = niveauVanItem(item, index);
    const record = records.get(String(item?.id || '')) || null;
    const gemaakt = isGemaakt(record);
    const goed = isGoed(record);
    perNiveau[niveau].totaal += 1;
    if (gemaakt) perNiveau[niveau].gemaakt += 1;
    if (goed) perNiveau[niveau].goed += 1;
    return {
      nummer: index + 1,
      itemId: item?.id || '',
      niveau,
      type: item?.type || item?.answer?.type || '',
      vraag: String(item?.prompt || '').replace(/<[^>]*>/g, '').trim(),
      gemaakt,
      goed: gemaakt ? goed : null,
      antwoord: gemaakt ? formatItemAntwoord(item, record?.lastAnswer) : ''
    };
  });

  const totaal = items.length;
  const gemaakt = vragen.filter((vraag) => vraag.gemaakt).length;
  const goed = vragen.filter((vraag) => vraag.goed === true).length;

  return {
    code,
    titel,
    blockId,
    totaal,
    gemaakt,
    goed,
    percentage: totaal ? Math.round((goed / totaal) * 100) : 0,
    volledig: totaal > 0 && gemaakt === totaal,
    perNiveau,
    geschatNiveau: schatNiveau(perNiveau, gemaakt),
    vragen
  };
};

/** Van sterk naar zwak; zie de regel bovenin. */
export const vergelijkDomeinen = (a, b) => {
  if (b.percentage !== a.percentage) return b.percentage - a.percentage;
  for (const niveau of [...NIVEAUS].reverse()) {
    const verschil = (b.perNiveau?.[niveau]?.goed || 0) - (a.perNiveau?.[niveau]?.goed || 0);
    if (verschil) return verschil;
  }
  return String(a.code).localeCompare(String(b.code), 'nl', { numeric: true });
};

export const sorteerDomeinen = (domeinen = []) => [...domeinen].sort(vergelijkDomeinen);

/**
 * Alle domeinen van één leerling.
 * @param {object} p
 * @param {Array}  p.domeinen       [{ code, titel, blockId, blockItems }]
 * @param {object} p.recordsPerBlok blockId -> itemrecords
 * @param {string} [p.userId]
 */
export const beoordeelLeerling = ({ domeinen = [], recordsPerBlok = {}, userId = '' } = {}) => {
  const uitslag = domeinen.map((domein) => beoordeelDomein({
    ...domein,
    userId,
    itemRecords: recordsPerBlok[domein.blockId] || []
  }));
  return {
    domeinen: uitslag,
    volgorde: sorteerDomeinen(uitslag.filter((domein) => domein.gemaakt > 0)).map((domein) => domein.code),
    nietGemaakt: uitslag.filter((domein) => domein.gemaakt === 0).map((domein) => domein.code),
    gemaakt: uitslag.reduce((som, domein) => som + domein.gemaakt, 0),
    goed: uitslag.reduce((som, domein) => som + domein.goed, 0)
  };
};
