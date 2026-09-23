/**
 * Wat een leerling van een klas werkelijk ziet, berekend met dezelfde functies
 * als de leerlingroute zelf.
 *
 * Het beheerscherm "Testen" gebruikt dit om per klas te tonen wat klaarstaat en
 * wat er scheef zit. De drie dingen die in de praktijk misgaan, staan hier los
 * benoemd, want ze zien er in de database hetzelfde uit (een lege les) terwijl
 * de oorzaak elke keer anders is:
 *
 *   1. de paragraaf is toegewezen maar bestaat niet meer;
 *   2. de paragraaf is toegewezen maar de leerroute van de klas laat hem niet
 *      door, dus de leerling ziet hem niet;
 *   3. de paragraaf is zichtbaar, maar er staat geen enkel lesblok klaar - meestal
 *      een blok zonder publieke snapshot, of een blokselectie die alles wegfiltert.
 */

import { getEffectiveContentBlocks, getStudentEffectiveParagrafen } from './assignmentUtils.js';
import { filterLesstofOpKlasRoute, getKlasNiveauId } from './klasRoute.js';
import { paragraafLabel } from './chapterOutline.js';
import { isParagraafVergrendeld } from './hoofdstukSlot.js';

// Volgorde zoals de leerling hem ziet: eerst het hoofdstuk, dan de paragraaf.
// `order` telt per hoofdstuk opnieuw vanaf 1; alleen daarop sorteren gaf
// 1.1, 2.1, 1.2, 2.2.
const hoofdstukNummer = (paragraaf, hoofdstukkenById) => {
  const nummer = Number(hoofdstukkenById[paragraaf.hoofdstukId]?.number);
  if (Number.isFinite(nummer)) return nummer;
  const uitCode = Number(String(paragraaf.code || '').split('.')[0]);
  return Number.isFinite(uitCode) ? uitCode : 999;
};

export const bouwKlasTestbeeld = ({
  klasData = null,
  leerlingId = '',
  paragrafenById = {},
  blokkenPerParagraaf = {},
  hoofdstukkenById = {}
} = {}) => {
  const toegewezenIds = klasData ? getStudentEffectiveParagrafen(klasData, leerlingId) : [];
  const route = getKlasNiveauId(klasData);

  const bestaande = toegewezenIds
    .map((id) => paragrafenById[id])
    .filter(Boolean);

  const ontbrekendeIds = toegewezenIds.filter((id) => !paragrafenById[id]);
  const zichtbaar = filterLesstofOpKlasRoute(bestaande, route);
  const zichtbareIds = new Set(zichtbaar.map((paragraaf) => paragraaf.id));
  const geblokkeerd = bestaande.filter((paragraaf) => !zichtbareIds.has(paragraaf.id));

  const lessen = zichtbaar
    .slice()
    .sort((a, b) => hoofdstukNummer(a, hoofdstukkenById) - hoofdstukNummer(b, hoofdstukkenById)
      || String(a.hoofdstukId || '').localeCompare(String(b.hoofdstukId || ''))
      || (a.order || 0) - (b.order || 0))
    .map((paragraaf) => {
      const alleBlokken = blokkenPerParagraaf[paragraaf.id] || [];
      const zichtbareBlokken = getEffectiveContentBlocks(klasData || {}, leerlingId, paragraaf.id, alleBlokken);
      return {
        id: paragraaf.id,
        label: paragraafLabel(paragraaf),
        hoofdstukId: paragraaf.hoofdstukId || '',
        hoofdstukTitel: hoofdstukkenById[paragraaf.hoofdstukId]?.title || paragraaf.hoofdstukTitle || paragraaf.hoofdstukTitel || '',
        hoofdstukNummer: hoofdstukNummer(paragraaf, hoofdstukkenById),
        // Staat het hoofdstuk op slot, dan ziet de leerling de paragraaf nog niet open.
        opSlot: isParagraafVergrendeld(klasData, paragraaf),
        aantalBlokken: zichtbareBlokken.length,
        aantalBeschikbaar: alleBlokken.length,
        blokken: zichtbareBlokken
      };
    });

  const problemen = [
    ...ontbrekendeIds.map((id) => ({
      soort: 'paragraafWeg',
      paragraafId: id,
      tekst: `Toegewezen paragraaf ${id} bestaat niet meer.`
    })),
    ...geblokkeerd.map((paragraaf) => ({
      soort: 'routeBlokkeert',
      paragraafId: paragraaf.id,
      tekst: `${paragraafLabel(paragraaf)} is toegewezen, maar de leerroute van de klas laat hem niet door.`
    })),
    ...lessen
      .filter((les) => les.aantalBlokken === 0)
      .map((les) => ({
        soort: 'geenBlokken',
        paragraafId: les.id,
        tekst: les.aantalBeschikbaar === 0
          ? `${les.label} is zichtbaar, maar er staat geen enkel gepubliceerd lesblok klaar.`
          : `${les.label} heeft ${les.aantalBeschikbaar} lesblokken, maar de blokselectie van de klas laat er geen door.`
      })),
    ...lessen
      .filter((les) => les.aantalBlokken > 0 && les.aantalBlokken < les.aantalBeschikbaar)
      .map((les) => ({
        soort: 'blokselectie',
        paragraafId: les.id,
        tekst: `${les.label}: de klas ziet ${les.aantalBlokken} van de ${les.aantalBeschikbaar} lesblokken.`
      }))
  ];

  return {
    route,
    lessen,
    problemen,
    aantalToegewezen: toegewezenIds.length,
    aantalZichtbaar: lessen.filter((les) => !les.opSlot).length,
    aantalOpSlot: lessen.filter((les) => les.opSlot).length,
    aantalBlokken: lessen.filter((les) => !les.opSlot).reduce((som, les) => som + les.aantalBlokken, 0)
  };
};

/** De testdata van één testleerling, per paragraaf opgeteld. */
export const bouwTestdataOverzicht = ({ records = [], lessen = [] } = {}) => {
  const perParagraaf = new Map();
  (Array.isArray(records) ? records : []).forEach((record) => {
    const paragraafId = record?.paragraafId || '';
    if (!paragraafId) return;
    if (!perParagraaf.has(paragraafId)) perParagraaf.set(paragraafId, []);
    perParagraaf.get(paragraafId).push(record);
  });

  const tijdstip = (record) => {
    const waarde = record?.updatedAt || record?.completedAt || null;
    const datum = waarde?.toDate ? waarde.toDate() : waarde ? new Date(waarde) : null;
    return datum && !Number.isNaN(datum.valueOf()) ? datum.getTime() : 0;
  };

  const regels = lessen.map((les) => {
    const eigen = perParagraaf.get(les.id) || [];
    return {
      paragraafId: les.id,
      label: les.label,
      gemaakt: eigen.length,
      afgerond: eigen.filter((record) => record.completed === true).length,
      totaal: les.aantalBlokken,
      laatsteActiviteitMs: eigen.reduce((hoogste, record) => Math.max(hoogste, tijdstip(record)), 0)
    };
  });

  const losseParagrafen = [...perParagraaf.keys()].filter(
    (paragraafId) => !lessen.some((les) => les.id === paragraafId)
  );

  return {
    regels,
    losseParagrafen,
    totaalRecords: (Array.isArray(records) ? records : []).length,
    laatsteActiviteitMs: regels.reduce((hoogste, regel) => Math.max(hoogste, regel.laatsteActiviteitMs), 0)
  };
};
