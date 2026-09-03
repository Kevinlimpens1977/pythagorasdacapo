/**
 * Persoonlijk startprofiel uit de nulmeting digitale vaardigheden (deel A en B).
 *
 * Puur en zonder Firebase: de Cloud Function `buildNulmetingProfiel` en de
 * tests draaien precies deze regels. Bron van de regels: analysemodel.json
 * uit het nulmetingspakket (docs/seeds/nulmeting-dv/). Het profiel is
 * diagnostisch: geen cijfer, geen tokens, geen leerwegadvies.
 *
 * Invoer:
 *   analysemodel   het analysemodel (deelvaardigheden + vraagmapping)
 *   mapping        { [itemId]: { les: 'A'|'B', nr, deelvaardigheidId, vaardigheid } }
 *                  (staat als privéveld `content.nulmeting.mapping` op elk blok)
 *   itemRecords    { [itemId]: { completed, isCorrect } } voor A en B samen
 */

const DOMEINEN = [
  'Praktische kennis en vaardigheden',
  'Ontwerpen en maken',
  'De gedigitaliseerde wereld'
];

export const NULMETING_PROFIEL_VERSIE = 1;

/** Vervolgadvies per deelvaardigheid: positief, concreet, zonder oordeel. */
export const VERVOLGADVIEZEN = {
  systemen: 'Oefen met de onderdelen van je device: wat is invoer, wat is uitvoer en waar sla je iets op.',
  informatie: 'Oefen met zoeken en beoordelen van informatie: wie schreef het, wanneer, en klopt het?',
  data: 'Oefen met tabellen en grafieken: wat staat er precies, en welke conclusie mag je trekken?',
  ai: 'Ontdek wat AI wel en niet kan, en wanneer je een AI-antwoord moet controleren.',
  producten: 'Maak stap voor stap een digitaal product: doel, ontwerp, testen, verbeteren.',
  programmeren: 'Oefen met programmeerstappen: volgorde, herhaling en wat een variabele doet.',
  veiligheid: 'Oefen met veilige wachtwoorden, phishing herkennen en wat je online deelt.',
  sociaal: 'Denk na over hoe jij en anderen online met elkaar omgaan en wat je van jezelf laat zien.',
  samenleving: 'Kijk naar wat digitale technologie verandert in werk, samenleving en wereld.'
};

const percentage = (goed, van) => (van > 0 ? Math.round((goed / van) * 100) : 0);

/** Het label bij een score op een deelvaardigheid, uit de niveaus van het model. */
export const bepaalNiveauLabel = (goed, analysemodel = {}) => {
  const niveaus = analysemodel?.regels?.deelvaardigheid?.niveaus || [];
  const treffer = niveaus.find((niveau) => goed >= niveau.min && goed <= niveau.max);
  return treffer?.label || '';
};

/**
 * Bouwt de mapping itemId -> deelvaardigheid uit het analysemodel, voor de
 * items van blok A en B. Item-id's volgen de bouwer: `${slug}-${nr, 2 cijfers}`.
 */
export const bouwNulmetingMapping = ({ analysemodel = {}, slugA = '', slugB = '' } = {}) => {
  const perNaam = new Map((analysemodel.deelvaardigheden || []).map((d) => [d.onderdeel, d.id]));
  const mapping = {};
  (analysemodel.vraagmapping || []).forEach((regel) => {
    const slug = regel.les === 'A' ? slugA : slugB;
    if (!slug) return;
    const itemId = `${slug}-${String(regel.nr).padStart(2, '0')}`;
    mapping[itemId] = {
      les: regel.les,
      nr: regel.nr,
      deelvaardigheidId: perNaam.get(regel.deelvaardigheid) || '',
      vaardigheid: regel.vaardigheid || '',
      niveau: regel.niveau || ''
    };
  });
  return mapping;
};

const isInconsistent = (perLes) => {
  const a = perLes.A;
  const b = perLes.B;
  if (!a || !b || a.van === 0 || b.van === 0) return false;
  return (a.goed === 0 && b.goed === b.van) || (b.goed === 0 && a.goed === a.van);
};

/**
 * Het profiel zelf.
 *
 * `status` is 'compleet' als alle vragen van A en B een afgerond record hebben,
 * anders 'voorlopig' (er wordt dan wel gerekend met wat er is, zodat de docent
 * na deel A al iets ziet).
 */
export const buildNulmetingProfiel = ({
  analysemodel = {},
  mapping = {},
  itemRecords = {},
  leerlingId = '',
  naam = '',
  afgenomenOp = ''
} = {}) => {
  const deelvaardigheden = analysemodel.deelvaardigheden || [];
  const perId = new Map(deelvaardigheden.map((d) => [d.id, {
    id: d.id,
    onderdeel: d.onderdeel,
    domein: d.domein,
    goed: 0,
    van: 0,
    gemaakt: 0,
    toepassenGoed: 0,
    perLes: {}
  }]));

  let totaalGoed = 0;
  let totaalVan = 0;
  let totaalGemaakt = 0;
  const gemaaktPerLes = { A: 0, B: 0 };
  const vanPerLes = { A: 0, B: 0 };

  Object.entries(mapping).forEach(([itemId, regel]) => {
    const stand = perId.get(regel.deelvaardigheidId);
    if (!stand) return;
    const record = itemRecords[itemId] || null;
    const gemaakt = Boolean(record && record.completed === true);
    const goed = gemaakt && record.isCorrect === true;
    stand.van += 1;
    totaalVan += 1;
    vanPerLes[regel.les] = (vanPerLes[regel.les] || 0) + 1;
    const les = stand.perLes[regel.les] || (stand.perLes[regel.les] = { goed: 0, van: 0 });
    les.van += 1;
    if (gemaakt) {
      stand.gemaakt += 1;
      totaalGemaakt += 1;
      gemaaktPerLes[regel.les] = (gemaaktPerLes[regel.les] || 0) + 1;
    }
    if (goed) {
      stand.goed += 1;
      totaalGoed += 1;
      les.goed += 1;
      if (regel.vaardigheid === 'toepassen') stand.toepassenGoed += 1;
    }
  });

  const scores = [...perId.values()].map((stand) => ({
    id: stand.id,
    onderdeel: stand.onderdeel,
    domein: stand.domein,
    goed: stand.goed,
    van: stand.van,
    gemaakt: stand.gemaakt,
    percentage: percentage(stand.goed, stand.van),
    label: bepaalNiveauLabel(stand.goed, analysemodel),
    toepassenGoed: stand.toepassenGoed,
    inconsistent: isInconsistent(stand.perLes),
    perLes: stand.perLes
  }));

  const domeinen = DOMEINEN
    .filter((domein) => scores.some((score) => score.domein === domein))
    .map((domein) => {
      const eigen = scores.filter((score) => score.domein === domein);
      return {
        domein,
        percentage: Math.round(eigen.reduce((som, score) => som + score.percentage, 0) / eigen.length)
      };
    });

  // Sterk: hoogste scores, alleen als de basis op orde is (>= 4). Ontwikkel:
  // laagste scores onder de 4, maximaal drie. Bij gelijke score beslist het
  // aantal goede toepassingsvragen (minder goed = eerder aan de beurt).
  const gesorteerdLaag = [...scores].sort((a, b) =>
    a.goed - b.goed || a.toepassenGoed - b.toepassenGoed || a.onderdeel.localeCompare(b.onderdeel, 'nl'));
  const gesorteerdHoog = [...scores].sort((a, b) =>
    b.goed - a.goed || b.toepassenGoed - a.toepassenGoed || a.onderdeel.localeCompare(b.onderdeel, 'nl'));
  const sterkePunten = gesorteerdHoog.filter((score) => score.goed >= 4).slice(0, 3).map((score) => score.onderdeel);
  const ontwikkel = gesorteerdLaag.filter((score) => score.goed < 4).slice(0, 3);
  const ontwikkelpunten = ontwikkel.map((score) => score.onderdeel);
  const adviezen = ontwikkel.map((score) => ({
    deelvaardigheidId: score.id,
    onderdeel: score.onderdeel,
    label: score.label,
    advies: VERVOLGADVIEZEN[score.id] || ''
  }));

  const docentSignalen = scores
    .filter((score) => score.inconsistent)
    .map((score) => ({
      type: 'inconsistentie',
      deelvaardigheidId: score.id,
      tekst: `${score.onderdeel}: deel A ${score.perLes.A?.goed ?? 0}/${score.perLes.A?.van ?? 0} en deel B ${score.perLes.B?.goed ?? 0}/${score.perLes.B?.van ?? 0}. Controleer of de vragen goed gelezen zijn.`
    }));

  const status = totaalVan > 0 && totaalGemaakt === totaalVan ? 'compleet' : 'voorlopig';
  const ontbrekend = ['A', 'B'].filter((les) => (vanPerLes[les] || 0) > 0 && (gemaaktPerLes[les] || 0) < (vanPerLes[les] || 0));

  return {
    versie: NULMETING_PROFIEL_VERSIE,
    leerlingId,
    naam,
    afgenomenOp,
    status,
    ontbrekendeDelen: ontbrekend,
    totaal: { goed: totaalGoed, van: totaalVan, gemaakt: totaalGemaakt, percentage: percentage(totaalGoed, totaalVan) },
    domeinen,
    deelvaardigheden: scores.map(({ id, onderdeel, domein, goed, van, gemaakt, percentage: pct, label, inconsistent }) => ({
      id, onderdeel, domein, goed, van, gemaakt, percentage: pct, label, inconsistent
    })),
    sterkePunten,
    ontwikkelpunten,
    adviezen,
    leerlingTekst: bouwLeerlingTekst({ sterkePunten, ontwikkelpunten, status }),
    docentSignalen
  };
};

/** Korte, positieve tekst voor de leerling. */
export const bouwLeerlingTekst = ({ sterkePunten = [], ontwikkelpunten = [], status = 'compleet' } = {}) => {
  const laag = (naam) => String(naam || '').toLowerCase();
  const delen = [];
  if (status === 'voorlopig') {
    delen.push('Dit is een voorlopig beeld; maak ook het andere deel van de nulmeting voor het volledige profiel.');
  }
  if (sterkePunten.length) {
    delen.push(`Je bent al goed in ${sterkePunten.map(laag).join(', ')}.`);
  }
  if (ontwikkelpunten.length) {
    delen.push(`De komende lessen ga je verder met ${ontwikkelpunten.map(laag).join(', ')}.`);
  } else if (sterkePunten.length) {
    delen.push('Je basis is op orde; je kunt in de lessen extra uitdaging kiezen.');
  }
  if (!delen.length) {
    delen.push('Je startprofiel wordt gevuld zodra je de nulmeting hebt gemaakt.');
  }
  return delen.join(' ');
};
