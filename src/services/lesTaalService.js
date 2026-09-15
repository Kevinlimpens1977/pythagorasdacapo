import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { isLesTaal } from '../lib/lesTaal';

/**
 * De moedertaal van een leerling. Leeg zetten haalt de vertaalknop weg.
 * Een onbekende code wordt geweigerd in plaats van stil opgeslagen: anders
 * staat er een taal bij de leerling waar niets mee gebeurt.
 */
export const zetLesTaal = async (studentUid, taal) => {
  const code = String(taal || '').trim();
  if (!studentUid) throw new Error('studentUid is verplicht');
  if (code && !isLesTaal(code)) throw new Error(`Onbekende taal: ${code}`);

  await updateDoc(doc(db, 'users', studentUid), {
    lesTaal: code,
    updatedAt: serverTimestamp()
  });
};

/**
 * Een vertaling die de docent heeft nagekeken. Vanaf nu overschrijft de machine
 * deze tekst niet meer; bij een gewijzigde bron komt hij terug met een seintje
 * dat hij nagelopen moet worden. setDoc met merge: true, zodat paragraafId en
 * blockId - waar de beveiligingsregel op leunt - op het document blijven staan.
 */
export const bewaarDocentVertaling = async (blockId, taal, velden) => {
  await setDoc(doc(db, 'vertalingen', `${blockId}__${taal}`), {
    ...velden,
    blockId,
    taal,
    bron: 'docent',
    gecontroleerd: true,
    bijgewerktOp: serverTimestamp()
  }, { merge: true });
};

export const haalOpgeslagenVertaling = async (blockId, taal) => {
  const snapshot = await getDoc(doc(db, 'vertalingen', `${blockId}__${taal}`));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};
