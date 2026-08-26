import { collection, doc, getDoc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { toggleSpelVoorKlas } from '../lib/klasSpellen';

/**
 * Spellen klaarzetten per klas, los van de lesstof. Het veld enabledGames op
 * het klasdocument is de bron; de leerlingpagina Spellen leest hetzelfde veld.
 * Bewust een eigen module naast klasService: dit raakt geen lesstoftoewijzing.
 */

export const getAlleKlassenMetSpellen = async () => {
  const snapshot = await getDocs(collection(db, 'klassen'));
  return snapshot.docs
    .map((d) => ({ klasId: d.id, ...d.data() }))
    .sort((a, b) => String(a.name).localeCompare(String(b.name), 'nl'));
};

export const zetSpelVoorKlas = async ({ klasId, gameId, enabledGames }) => {
  await updateDoc(doc(db, 'klassen', klasId), {
    enabledGames: toggleSpelVoorKlas(enabledGames, gameId),
    updatedAt: serverTimestamp()
  });
};

/** De klas van een leerling, alleen voor de spellenlijst. */
export const getKlasVoorSpellen = async (klasId) => {
  if (!klasId) return null;
  const snapshot = await getDoc(doc(db, 'klassen', klasId));
  return snapshot.exists() ? { klasId: snapshot.id, ...snapshot.data() } : null;
};
