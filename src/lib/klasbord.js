/**
 * Klasbord: per klas een raster met leerlingen in rijen en lesblokken in
 * kolommen, de weergave van het klasbord-artifact in HELIX (/admin/klasborden).
 *
 * De stand van een vakje (Kevin, 15 okt 2026):
 *   top    donkergroen  gemaakt, alle vragen in één keer goed
 *   goed   groen        gemaakt (een blok zonder vragen, of een paar fouten)
 *   zwak   lichtgroen   gemaakt, maar minder dan 70% goed
 *   rood   rood         afgevinkt zonder alle vragen te maken (`isBlokStriktAf`)
 *   open   lichtgeel    nog te maken
 *   slot   lichtgeel    nog te maken en op slot (klasslot of paragraafslot)
 *
 * De score is die van de eerste ronde (`eersteScore`), zodat een herkansing
 * het beeld niet mooier maakt dan hoe de leerling het eerst deed.
 *
 * Puur en zonder Firebase: de pagina haalt de documenten op, deze functies
 * rekenen. Zo is het bord testbaar en ziet het er in elke klas hetzelfde uit.
 */

import { aantalVragenInBlok, isBlokStriktAf } from './studentLessonProgress.js';
import { filterLesstofOpKlasRoute, getKlasNiveauId } from './klasRoute.js';
import { isTestaccount } from './testaccounts.js';
import { isBlokVergrendeld, isParagraafVergrendeld } from './hoofdstukSlot.js';
import { isAntwoordenParagraaf, isNaVoorgaandeParagraaf } from './antwoordenSlot.js';
import { isOptionalParagraph } from './paragraphMetadata.js';

/** Onder deze fractie goed heet een gemaakte quiz "veel fouten" (lichtgroen). */
export const ZWAK_GRENS = 0.7;

export const AF_STANDEN = new Set(['top', 'goed', 'zwak']);

const schoon = (waarde) => String(waarde ?? '').trim();

/** "2.1" voor "2.A" voor "2.T": cijfers eerst, daarna letters op alfabet. */
export const vergelijkParagraafCodes = (a = '', b = '') => {
  const [ah = '', ap = ''] = schoon(a).split('.');
  const [bh = '', bp = ''] = schoon(b).split('.');
  const hoofd = (Number(ah) || 0) - (Number(bh) || 0);
  if (hoofd) return hoofd;
  const aGetal = /^\d+$/.test(ap);
  const bGetal = /^\d+$/.test(bp);
  if (aGetal && bGetal) return Number(ap) - Number(bp);
  if (aGetal !== bGetal) return aGetal ? -1 : 1;
  return ap.localeCompare(bp);
};

const paragraafNaam = (paragraaf = {}) =>
  schoon(paragraaf.title).replace(/^\d+(\.\w+)?\s+/, '') || schoon(paragraaf.code);

const tijdVan = (waarde) => {
  if (!waarde) return 0;
  if (typeof waarde.toMillis === 'function') return waarde.toMillis();
  if (typeof waarde.seconds === 'number') return waarde.seconds * 1000;
  const getal = new Date(waarde).getTime();
  return Number.isFinite(getal) ? getal : 0;
};

// Kevins eigen leerlingaccount staat in ER3L1A om mee te kijken. Het
// klasbord-artifact liet het al weg; het hoort niet tussen de leerlingen.
const isDocentAlsLeerling = (gebruiker) => /kevin limpens/i.test(schoon(gebruiker.displayName));

/**
 * Korte namen voor de rijen: de voornaam, en bij twee dezelfde voornamen in
 * één klas de eerste letter van de achternaam erachter.
 */
export const maakRijLabels = (leerlingen = []) => {
  const voornaam = (leerling) =>
    schoon(leerling.firstName) || schoon(leerling.displayName).split(/\s+/)[0] || 'Leerling';
  const telling = new Map();
  leerlingen.forEach((leerling) => {
    const naam = voornaam(leerling).toLowerCase();
    telling.set(naam, (telling.get(naam) || 0) + 1);
  });
  return leerlingen.map((leerling) => {
    const naam = voornaam(leerling);
    if (telling.get(naam.toLowerCase()) < 2) return naam;
    const achternaam = schoon(leerling.lastName) || schoon(leerling.displayName).split(/\s+/).slice(1).join(' ');
    return achternaam ? `${naam} ${achternaam[0].toUpperCase()}.` : naam;
  });
};

/**
 * Bouwt het bord van één klas.
 *
 * @param klas          klasdocument met id, name, enabledParagrafen, niveauId
 * @param paragrafen    Map paragraafId -> paragraafdocument
 * @param hoofdstukken  Map hoofdstukId -> hoofdstukdocument
 * @param blokken       Map paragraafId -> lesblokken (contentBlocks)
 * @param gebruikers    alle leerlingen (wordt gefilterd op deze klas)
 * @param voortgang     voortgangsrecords (userId, blockId, completed, itemsCompleted, updatedAt)
 */
export const bouwKlasbord = ({
  klas = {},
  paragrafen = new Map(),
  hoofdstukken = new Map(),
  blokken = new Map(),
  gebruikers = [],
  voortgang = []
} = {}) => {
  const route = getKlasNiveauId(klas);
  const toegewezen = (Array.isArray(klas.enabledParagrafen) ? klas.enabledParagrafen : [])
    .map((id) => paragrafen.get(id))
    .filter((paragraaf) => paragraaf && paragraaf.published !== false && !paragraaf.isArchived);
  const zichtbaar = filterLesstofOpKlasRoute(toegewezen, route);

  const kolommen = [];
  const paragraafLijst = zichtbaar
    .map((paragraaf) => {
      const hoofdstuk = hoofdstukken.get(paragraaf.hoofdstukId) || {};
      return {
        id: paragraaf.id,
        code: schoon(paragraaf.code),
        naam: paragraafNaam(paragraaf),
        hoofdstukId: paragraaf.hoofdstukId,
        hoofdstukNr: Number(hoofdstuk.number) || 0,
        hoofdstuk: schoon(hoofdstuk.title),
        klasSlot: isParagraafVergrendeld(klas, paragraaf),
        naHoofdstuk: isAntwoordenParagraaf(paragraaf),
        naVoorgaande: isNaVoorgaandeParagraaf(paragraaf),
        plus: isOptionalParagraph(paragraaf)
      };
    })
    .sort((a, b) => a.hoofdstukNr - b.hoofdstukNr
      || schoon(a.hoofdstukId).localeCompare(schoon(b.hoofdstukId))
      || vergelijkParagraafCodes(a.code, b.code));

  const paragrafenPerId = new Map(paragraafLijst.map((paragraaf) => [paragraaf.id, paragraaf]));

  paragraafLijst.forEach((paragraaf) => {
    const lijst = (blokken.get(paragraaf.id) || [])
      .filter((blok) => blok.status === 'published' && !blok.isArchived)
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    lijst.forEach((blok, index) => {
      kolommen.push({
        blok,
        blockId: blok.id,
        nr: index + 1,
        titel: schoon(blok.title) || `Onderdeel ${index + 1}`,
        vragen: aantalVragenInBlok(blok),
        paragraafId: paragraaf.id,
        code: paragraaf.code,
        paragraaf: paragraaf.naam,
        hoofdstukId: paragraaf.hoofdstukId,
        hoofdstukNr: paragraaf.hoofdstukNr,
        hoofdstuk: paragraaf.hoofdstuk,
        klasSlot: paragraaf.klasSlot || isBlokVergrendeld(klas, blok.id)
      });
    });
  });

  const leerlingen = gebruikers
    .filter((gebruiker) => gebruiker.klasId === klas.id && gebruiker.role === 'student'
      && !isTestaccount(gebruiker) && !gebruiker.isDevUser && !isDocentAlsLeerling(gebruiker))
    .sort((a, b) => schoon(a.firstName || a.displayName).localeCompare(schoon(b.firstName || b.displayName), 'nl'));
  const labels = maakRijLabels(leerlingen);
  const uids = new Set(leerlingen.map((leerling) => leerling.id));
  const blockIds = new Set(kolommen.map((kolom) => kolom.blockId));

  const perLeerling = new Map();
  let laatste = { tijd: 0, hoofdstukNr: 0 };
  const nrVanBlok = new Map(kolommen.map((kolom) => [kolom.blockId, kolom.hoofdstukNr]));
  voortgang.forEach((record) => {
    if (!uids.has(record.userId) || !blockIds.has(record.blockId)) return;
    if (!perLeerling.has(record.userId)) perLeerling.set(record.userId, []);
    perLeerling.get(record.userId).push(record);
    const tijd = Math.max(tijdVan(record.updatedAt), tijdVan(record.completedAt));
    if (tijd > laatste.tijd) laatste = { tijd, hoofdstukNr: nrVanBlok.get(record.blockId) };
  });

  const rijen = leerlingen.map((leerling, index) => {
    const records = perLeerling.get(leerling.id) || [];
    const recordVan = (blockId) => records.find((record) => record.blockId === blockId && record.completed === true)
      || records.find((record) => record.blockId === blockId) || null;
    const afgevinkt = (kolom) => recordVan(kolom.blockId)?.completed === true;
    const striktAf = (kolom) => afgevinkt(kolom) && isBlokStriktAf(kolom.blok, records);

    // Paragraafsloten per leerling, dezelfde regels als antwoordenSlot.js.
    const paragraafOpen = (paragraaf, kolomVoorwaarde, filter) => kolommen
      .filter((kolom) => kolom.hoofdstukId === paragraaf.hoofdstukId && filter(paragrafenPerId.get(kolom.paragraafId)))
      .every(kolomVoorwaarde);
    const slotPerParagraaf = new Map(paragraafLijst.map((paragraaf, pIndex) => {
      if (paragraaf.naHoofdstuk) {
        return [paragraaf.id, !paragraafOpen(paragraaf, afgevinkt,
          (ander) => !ander.plus && !ander.naHoofdstuk && !ander.naVoorgaande)];
      }
      if (paragraaf.naVoorgaande) {
        const ervoor = new Set(paragraafLijst.slice(0, pIndex).map((ander) => ander.id));
        return [paragraaf.id, !paragraafOpen(paragraaf, striktAf,
          (ander) => ervoor.has(ander.id) && !ander.plus)];
      }
      return [paragraaf.id, false];
    }));

    const cellen = kolommen.map((kolom) => {
      const record = recordVan(kolom.blockId);
      if (record?.completed !== true) {
        const opSlot = kolom.klasSlot || slotPerParagraaf.get(kolom.paragraafId);
        return opSlot ? { status: 'slot', detail: 'op slot' } : { status: 'open', detail: '' };
      }
      if (!isBlokStriktAf(kolom.blok, records)) {
        const gemaakt = Math.max(0, Number(record.itemsCompleted) || 0);
        return { status: 'rood', detail: `afgevinkt, ${gemaakt} van ${kolom.vragen} vragen beantwoord` };
      }
      if (!kolom.vragen || kolom.blok?.type === 'question') return { status: 'goed', detail: 'af' };
      const eerste = record.eersteScore;
      const totaal = Number(eerste?.itemCount) || kolom.vragen;
      const goed = Number(eerste?.itemsCorrect ?? record.itemsCorrect) || 0;
      const fractie = totaal ? goed / totaal : 0;
      const detail = `${goed} van ${totaal} goed`;
      if (goed >= totaal) return { status: 'top', detail };
      return { status: fractie < ZWAK_GRENS ? 'zwak' : 'goed', detail };
    });
    return { uid: leerling.id, label: labels[index], cellen };
  });

  const nummers = [...new Set(kolommen.map((kolom) => kolom.hoofdstukNr))].sort((a, b) => a - b);
  const standaardNummer = nummers.includes(laatste.hoofdstukNr) ? laatste.hoofdstukNr : (nummers[0] ?? null);

  return {
    klasId: klas.id,
    naam: schoon(klas.name) || klas.id,
    // eslint-disable-next-line no-unused-vars
    kolommen: kolommen.map(({ blok, ...rest }) => rest),
    rijen,
    nummers,
    standaardNummer,
    laatsteActiviteit: laatste.tijd || null
  };
};

/**
 * Het deel van het bord voor één hoofdstuknummer: de kolommen, per leerling de
 * cellen van die kolommen en het aantal af.
 */
export const bordVoorHoofdstuk = (bord, nummer) => {
  const indexen = [];
  bord.kolommen.forEach((kolom, index) => {
    if (kolom.hoofdstukNr === nummer) indexen.push(index);
  });
  const kolommen = indexen.map((index) => bord.kolommen[index]);
  const rijen = bord.rijen.map((rij) => {
    const cellen = indexen.map((index) => rij.cellen[index]);
    return { ...rij, cellen, af: cellen.filter((cel) => AF_STANDEN.has(cel.status)).length };
  });
  const hoofdstukTitels = [...new Map(kolommen.map((kolom) => [kolom.hoofdstukId, kolom.hoofdstuk])).values()];
  return { kolommen, rijen, totaal: kolommen.length, hoofdstukTitels };
};
