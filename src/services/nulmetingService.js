import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { buildNulmetingProfielCall } from '../lib/api';

/**
 * Startprofielen uit de nulmeting digitale vaardigheden.
 *
 * Lezen gaat rechtstreeks uit `nulmetingProfielen` (regels: eigenaar of
 * docent). Berekenen gaat altijd via de Cloud Function, want de mapping van
 * vraag naar deelvaardigheid staat alleen in het privé-lesblok.
 */
export const getNulmetingProfiel = async (uid) => {
  if (!uid) return null;
  const snapshot = await getDoc(doc(db, 'nulmetingProfielen', uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const getNulmetingProfielenVoorKlas = async (klasId) => {
  if (!klasId) return {};
  const snapshot = await getDocs(query(collection(db, 'nulmetingProfielen'), where('klasId', '==', klasId)));
  return Object.fromEntries(snapshot.docs.map((docSnap) => [docSnap.id, { id: docSnap.id, ...docSnap.data() }]));
};

/** Eigen profiel (laten) berekenen; geeft het nieuwe profiel terug of null. */
export const berekenEigenNulmetingProfiel = async () => {
  const result = await buildNulmetingProfielCall();
  return result.success ? result.profiel || null : null;
};

/** Docent: profiel van één leerling berekenen. */
export const berekenNulmetingProfielVoorLeerling = async (leerlingUid) => buildNulmetingProfielCall({ leerlingUid });

/** Docent: alle profielen van een klas berekenen. */
export const berekenNulmetingProfielenVoorKlas = async (klasId) => buildNulmetingProfielCall({ klasId });

export default {
  getNulmetingProfiel,
  getNulmetingProfielenVoorKlas,
  berekenEigenNulmetingProfiel,
  berekenNulmetingProfielVoorLeerling,
  berekenNulmetingProfielenVoorKlas
};
