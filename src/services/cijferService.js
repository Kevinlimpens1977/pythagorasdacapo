import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app, { db } from './firebase';

// Cijfers uit spellen (Binask 2.2 Volume, 24 sep 2026).
const functions = getFunctions(app, 'europe-west1');

// Na een spel: de server legt de eerste ronde vast als het blok in een open cijfergroep zit.
export const registreerSpelRonde = async (blockId, telling) => {
  const result = await httpsCallable(functions, 'registreerSpelRonde')({ blockId, telling });
  return result.data;
};

// Alleen voor de docent (firestore.rules): de cijfergroepen en cijfers van een klas.
export const subscribeKlasCijfers = (klasId, onNext, onError) => {
  if (!klasId) {
    onNext?.({ groepen: [], cijfers: [] });
    return () => {};
  }
  let groepen = [];
  let cijfers = [];
  const stuur = () => onNext?.({ groepen, cijfers });
  const stoppen = [
    onSnapshot(query(collection(db, 'cijferGroepen'), where('klasIds', 'array-contains', klasId)), (snapshot) => {
      groepen = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      stuur();
    }, onError),
    onSnapshot(query(collection(db, 'paragraafCijfers'), where('klasId', '==', klasId)), (snapshot) => {
      cijfers = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      stuur();
    }, onError)
  ];
  return () => stoppen.forEach((stop) => stop());
};
