// Fasetoestand van een oefenblok volgens het "probeer eerst"-contract:
// de leerling ziet EEN opgave tegelijk en doorloopt per opgave drie fasen.
//
//   1. PROBEREN    - alleen vraag + invulveld; inleveren kan pas bij een echt
//                    antwoord (magInleveren uit zelfbeoordeling.js).
//   2. VERGELIJKEN - het eigen antwoord staat op slot, de uitwerking en de
//                    Digidocent-feedback komen in beeld.
//   3. BEOORDEELD  - de leerling heeft zichzelf een oordeel gegeven; pas nu
//                    ontgrendelt "Volgende opgave".
//
// De uitwerking komt van de server en pas NA het inleveren. Faalt de
// Digidocent, dan is er geen uitwerking om mee te vergelijken en wordt er dus
// ook geen zelfoordeel afgedwongen: de opgave springt direct naar BEOORDEELD
// met een overgeslagen-record (aiCorrect null, geen zelfoordeel).
//
// Alles hier is puur en zonder React, zodat de overgangen los van de component
// getest kunnen worden. De component houdt alleen het flow-object in state.

import {
  buildZelfbeoordelingRecord,
  isGeldigZelfoordeel,
  magInleveren
} from './zelfbeoordeling.js';

export const OEFEN_FASEN = {
  PROBEREN: 'proberen',
  VERGELIJKEN: 'vergelijken',
  BEOORDEELD: 'beoordeeld'
};

export const createOefenFlow = (velden = [], nowMs = Date.now()) => {
  const lijst = Array.isArray(velden) ? velden : [];
  return {
    velden: lijst,
    index: 0,
    fase: OEFEN_FASEN.PROBEREN,
    // Het moment dat de huidige opgave in beeld kwam; basis voor de denktijd.
    gestartOpMs: nowMs,
    ingeleverdOpMs: 0,
    // Het beoordelingsresultaat van de huidige opgave (server-response).
    assessment: null,
    records: [],
    afgerond: lijst.length === 0
  };
};

export const huidigeOpgave = (flow) => flow?.velden?.[flow.index] || null;

/** Inleveren mag alleen in de probeerfase en alleen met een echt antwoord. */
export const magOefenInleveren = (flow, antwoord = '') =>
  Boolean(flow) &&
  !flow.afgerond &&
  flow.fase === OEFEN_FASEN.PROBEREN &&
  magInleveren(antwoord);

// Zelfde vorm als buildZelfbeoordelingRecord, maar zonder oordeel: de
// Digidocent faalde, dus er was geen uitwerking om jezelf mee te vergelijken.
const buildOvergeslagenRecord = ({
  fieldId = '',
  antwoord = '',
  aiFeedback = '',
  gestartOpMs = 0,
  ingeleverdOpMs = 0
} = {}) => ({
  fieldId,
  antwoord: String(antwoord).trim(),
  antwoordLengte: String(antwoord).trim().length,
  zelfoordeel: '',
  zelfoordeelOvergeslagen: true,
  aiCorrect: null,
  aiFeedback: String(aiFeedback || ''),
  gestartOpMs,
  ingeleverdOpMs,
  beoordeeldOpMs: 0,
  denktijdMs: Math.max(0, (ingeleverdOpMs || 0) - (gestartOpMs || 0))
});

/**
 * Verwerkt de server-beoordeling van het zojuist ingeleverde antwoord.
 * Geslaagd: door naar VERGELIJKEN. Mislukt: overgeslagen-record vastleggen en
 * direct naar BEOORDEELD, zodat de leerling niet vastloopt.
 */
export const verwerkInlevering = (flow, { antwoord = '', assessment = null, nowMs = Date.now() } = {}) => {
  if (!flow || flow.afgerond || flow.fase !== OEFEN_FASEN.PROBEREN) return flow;

  if (assessment?.success === true) {
    return {
      ...flow,
      fase: OEFEN_FASEN.VERGELIJKEN,
      ingeleverdOpMs: nowMs,
      assessment
    };
  }

  const veld = huidigeOpgave(flow);
  return {
    ...flow,
    fase: OEFEN_FASEN.BEOORDEELD,
    ingeleverdOpMs: nowMs,
    assessment: assessment || { success: false },
    records: [
      ...flow.records,
      buildOvergeslagenRecord({
        fieldId: veld?.id || '',
        antwoord,
        aiFeedback: assessment?.feedback || assessment?.error || '',
        gestartOpMs: flow.gestartOpMs,
        ingeleverdOpMs: nowMs
      })
    ]
  };
};

/** De verplichte keuze uit Goed / Bijna / Nog niet. */
export const kiesZelfoordeel = (flow, { zelfoordeel = '', antwoord = '', nowMs = Date.now() } = {}) => {
  if (!flow || flow.fase !== OEFEN_FASEN.VERGELIJKEN) return flow;
  if (!isGeldigZelfoordeel(zelfoordeel)) return flow;

  const veld = huidigeOpgave(flow);
  const assessment = flow.assessment || {};
  const record = buildZelfbeoordelingRecord({
    fieldId: veld?.id || '',
    antwoord,
    zelfoordeel,
    aiCorrect: typeof assessment.isCorrect === 'boolean' ? assessment.isCorrect : null,
    aiFeedback: assessment.feedback || '',
    gestartOpMs: flow.gestartOpMs,
    ingeleverdOpMs: flow.ingeleverdOpMs,
    beoordeeldOpMs: nowMs
  });

  return {
    ...flow,
    fase: OEFEN_FASEN.BEOORDEELD,
    records: [...flow.records, record]
  };
};

/** Na het oordeel: door naar de volgende opgave, of het blok afronden. */
export const volgendeOpgave = (flow, nowMs = Date.now()) => {
  if (!flow || flow.afgerond || flow.fase !== OEFEN_FASEN.BEOORDEELD) return flow;

  if (flow.index >= flow.velden.length - 1) {
    return { ...flow, afgerond: true };
  }

  return {
    ...flow,
    index: flow.index + 1,
    fase: OEFEN_FASEN.PROBEREN,
    gestartOpMs: nowMs,
    ingeleverdOpMs: 0,
    assessment: null
  };
};

export const isLaatsteOpgave = (flow) =>
  Boolean(flow) && flow.velden.length > 0 && flow.index >= flow.velden.length - 1;
