import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
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
