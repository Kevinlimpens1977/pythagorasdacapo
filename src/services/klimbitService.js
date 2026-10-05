import { doc, getDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app, { db } from './firebase';

// KlimBit praat alleen via deze twee callables met de server. Het spel zelf
// schrijft nooit naar Firestore en kent nooit zelf tokens toe.
const functions = getFunctions(app, 'europe-west1');

export const startKlimbitPoging = async ({ pogingNr } = {}) => {
  const start = httpsCallable(functions, 'startKlimbitPoging');
  const result = await start(Number.isInteger(pogingNr) ? { pogingNr } : {});
  return result.data;
};

export const rondKlimbitPogingAf = async ({ pogingId, piekHoogte }) => {
  const afronden = httpsCallable(functions, 'rondKlimbitPogingAf');
  const result = await afronden({ pogingId, piekHoogte });
  return result.data;
};

/** Het persoonlijk record van deze speler, of null als er nog geen is. */
export const leesKlimbitRecord = async (uid) => {
  if (!uid) return null;
  const snapshot = await getDoc(doc(db, 'spelRecords', `klimbit_${uid}`));
  return snapshot.exists() ? snapshot.data() : null;
};
