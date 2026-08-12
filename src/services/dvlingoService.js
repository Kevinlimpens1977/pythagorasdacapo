import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { bouwSpelLijst } from '../games/dvlingo/dvlingoWoordenlijst';

// Instellingen van DVLingo die de docent op /admin/spellen klaarzet: welke
// woordenlijst de leerlingen spelen. Lezen mag iedereen die is ingelogd;
// schrijven alleen een admin (zie firestore.rules).
//
// Let op: het spel zelf praat nooit met Firestore. Het platform leest deze
// instellingen en zet ze klaar in de opslag die het spel al gebruikt.
const PAD = 'gameInstellingen/dvlingo';

export const DVLINGO_INSTELLINGEN_PAD = PAD;

export const LEGE_DVLINGO_INSTELLINGEN = {
  gebruikEigenLijst: false,
  schud: false,
  woorden: []
};

export const fetchDvlingoInstellingen = async () => {
  const snapshot = await getDoc(doc(db, PAD));
  if (!snapshot.exists()) return { ...LEGE_DVLINGO_INSTELLINGEN };

  return bouwSpelLijst(snapshot.data());
};

export const saveDvlingoInstellingen = async (instellingen) => {
  const schoon = bouwSpelLijst(instellingen);

  await setDoc(
    doc(db, PAD),
    { ...schoon, updatedAt: serverTimestamp() },
    { merge: true }
  );

  return schoon;
};
