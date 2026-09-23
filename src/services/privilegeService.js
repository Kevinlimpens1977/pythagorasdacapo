import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app, { db } from './firebase';

// Fase 4: privileges, de klasbonus en events.
const functions = getFunctions(app, 'europe-west1');

const roep = async (naam, data = {}) => {
  const result = await httpsCallable(functions, naam)(data);
  return result.data;
};

export const getMijnPrivileges = () => roep('getMijnPrivileges');
export const vraagPrivilegeAan = (itemId) => roep('vraagPrivilegeAan', { itemId });
export const beoordeelPrivilege = (id, besluit, reden = '') => roep('beoordeelPrivilege', { id, besluit, reden });
export const geefKlasBonus = (klasId, bedrag, reden) => roep('geefKlasBonus', { klasId, bedrag, reden });

// Alleen voor de docent (firestore.rules): de verzoeken van een klas.
export const subscribeKlasPrivileges = (klasId, onNext, onError) => {
  if (!klasId) {
    onNext?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, 'privilegeVerzoeken'), where('klasId', '==', klasId)),
    (snapshot) => onNext?.(snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort((a, b) => String(b.week).localeCompare(String(a.week)))),
    onError
  );
};

export const subscribeKlasEvent = (klasId, onNext, onError) => {
  if (!klasId) {
    onNext?.(null);
    return () => {};
  }
  return onSnapshot(
    doc(db, 'klasEvents', klasId),
    (snapshot) => onNext?.(snapshot.exists() ? snapshot.data() : null),
    onError
  );
};

// Een dubbele-XP-week: van en tot als "2026-09-28", beide dagen tellen mee.
export const zetKlasEvent = (klasId, { van, tot, titel = 'Dubbele XP' }) => setDoc(doc(db, 'klasEvents', klasId), {
  klasId,
  soort: 'dubbeleXp',
  titel,
  van,
  tot,
  updatedAt: serverTimestamp()
});

export const stopKlasEvent = (klasId) => deleteDoc(doc(db, 'klasEvents', klasId));
