// Lokale voortgang voor Data Koerier (localStorage, per apparaat).
// Zelfde patroon als andere lokale HELIX-opslag: defensief lezen/schrijven,
// nooit crashen als storage ontbreekt of corrupt is.
const OPSLAG_SLEUTEL = 'helix-data-koerier-voortgang-v1';

const leegModel = () => ({ routes: {}, geluidAan: true });

const veiligeStorage = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
};

export const leesVoortgang = () => {
  const storage = veiligeStorage();
  if (!storage) return leegModel();
  try {
    const ruw = storage.getItem(OPSLAG_SLEUTEL);
    if (!ruw) return leegModel();
    const data = JSON.parse(ruw);
    return {
      routes: data && typeof data.routes === 'object' && data.routes ? data.routes : {},
      geluidAan: data?.geluidAan !== false
    };
  } catch {
    return leegModel();
  }
};

const schrijfVoortgang = (model) => {
  const storage = veiligeStorage();
  if (!storage) return;
  try {
    storage.setItem(OPSLAG_SLEUTEL, JSON.stringify(model));
  } catch {
    // Vol of geblokkeerd: voortgang is nice-to-have, nooit blokkerend.
  }
};

// Verwerkt een afgeronde sessie in de lokale records.
// Geeft { model, isRecord } terug; isRecord = nieuwe beste score voor de route.
export const registreerResultaat = ({ routeId, score, accuracy, wpm, gehaald }) => {
  const model = leesVoortgang();
  const huidig = model.routes[routeId] || {
    besteScore: 0,
    besteAccuracy: 0,
    besteWpm: 0,
    gehaald: false,
    pogingen: 0
  };

  const isRecord = huidig.pogingen > 0 && score > huidig.besteScore;
  const bijgewerkt = {
    besteScore: Math.max(huidig.besteScore, score),
    besteAccuracy: Math.max(huidig.besteAccuracy, accuracy),
    besteWpm: Math.max(huidig.besteWpm, wpm),
    gehaald: huidig.gehaald || Boolean(gehaald),
    pogingen: huidig.pogingen + 1
  };

  const nieuwModel = { ...model, routes: { ...model.routes, [routeId]: bijgewerkt } };
  schrijfVoortgang(nieuwModel);
  return { model: nieuwModel, isRecord };
};

export const leesGeluidAan = () => leesVoortgang().geluidAan;

export const bewaarGeluidAan = (geluidAan) => {
  const model = leesVoortgang();
  schrijfVoortgang({ ...model, geluidAan: Boolean(geluidAan) });
};
