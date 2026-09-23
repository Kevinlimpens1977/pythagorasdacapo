import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app, { db } from './firebase';

// Fase 3, samen: Mijn klas, complimenten en het klasdoel.
const functions = getFunctions(app, 'europe-west1');

const roep = async (naam, data = {}) => {
  const result = await httpsCallable(functions, naam)(data);
  return result.data;
};

// De kaarten van de klas; de server geeft alleen terug wat zichtbaar mag zijn.
export const getMijnKlas = (klasId = '') => roep('getMijnKlas', klasId ? { klasId } : {});
export const updateVitrine = (vitrine) => roep('updateVitrine', vitrine);
export const geefCompliment = (aanUid, soort) => roep('geefCompliment', { aanUid, soort });
export const verbergCompliment = (id, verborgen = true) => roep('verbergCompliment', { id, verborgen });

export const subscribeKlasDoel = (klasId, onNext, onError) => {
  if (!klasId) {
    onNext?.(null);
    return () => {};
  }
  return onSnapshot(
    doc(db, 'klasDoel', klasId),
    (snapshot) => onNext?.(snapshot.exists() ? snapshot.data() : null),
    onError
  );
};

// Alleen voor de docent (firestore.rules): alle complimenten van een klas.
export const subscribeKlasComplimenten = (klasId, onNext, onError) => {
  if (!klasId) {
    onNext?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, 'complimenten'), where('klasId', '==', klasId)),
    (snapshot) => onNext?.(snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort((a, b) => String(b.week).localeCompare(String(a.week)))),
    onError
  );
};

// Een nieuw klasdoel begint altijd bij nul.
export const startKlasDoel = (klasId, { titel, doel }) => setDoc(doc(db, 'klasDoel', klasId), {
  klasId,
  titel: String(titel || '').trim(),
  doel: Math.max(1, Math.round(Number(doel) || 0)),
  stand: 0,
  status: 'actief',
  gestartOp: serverTimestamp(),
  gehaaldOp: null,
  afgeslotenOp: null,
  updatedAt: serverTimestamp()
});

// "Klasmoment gehouden": het doel is klaar en de balk verdwijnt.
export const sluitKlasDoel = (klasId) => setDoc(doc(db, 'klasDoel', klasId), {
  status: 'afgesloten',
  afgeslotenOp: serverTimestamp(),
  updatedAt: serverTimestamp()
}, { merge: true });
