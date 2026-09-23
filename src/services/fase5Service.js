import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import app, { db, storage } from './firebase';

// Fase 5 (SPELOPZET-FASE5-EXTRAS.md): companion, meten, stemmen en de ontwerpwedstrijd.
const functions = getFunctions(app, 'europe-west1');

const roep = async (naam, data = {}) => {
  const result = await httpsCallable(functions, naam)(data);
  return result.data;
};

export const updateCompanion = (companion) => roep('updateCompanion', companion);
export const getBeloningMeting = (klasId, weken = 6) => roep('getBeloningMeting', { klasId, weken });
export const stem = (stemmingId, keuze) => roep('stem', { stemmingId, keuze });
export const getStemmingen = () => roep('getStemmingen');
export const getWedstrijden = () => roep('getWedstrijden');
export const beoordeelInzending = (id, besluit) => roep('beoordeelInzending', { id, besluit });

export const ONTWERP_MAX_BYTES = 4 * 1024 * 1024;
const ONTWERP_TYPES = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

// Een ontwerp uploaden naar de eigen map en daarna inleveren.
export const leverOntwerpIn = async ({ uid, wedstrijdId, bestand }) => {
  const extensie = ONTWERP_TYPES[bestand?.type];
  if (!extensie) throw new Error('Kies een afbeelding: png, jpg of webp.');
  if (bestand.size > ONTWERP_MAX_BYTES) throw new Error('Deze afbeelding is groter dan 4 MB. Maak hem kleiner.');
  const pad = `ontwerpen/${uid}/${wedstrijdId}-${Date.now()}.${extensie}`;
  await uploadBytes(storageRef(storage, pad), bestand, { contentType: bestand.type });
  return roep('dienOntwerpIn', { wedstrijdId, storagePath: pad });
};

export const afbeeldingUrl = (pad) => getDownloadURL(storageRef(storage, pad));

// Docent: stemmingen en wedstrijden van een klas (firestore.rules: alleen admin).
const volgKlas = (collectie, klasId, onNext, onError) => {
  if (!klasId) {
    onNext?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, collectie), where('klasId', '==', klasId)),
    (snapshot) => onNext?.(snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))),
    onError
  );
};

export const subscribeKlasStemmingen = (klasId, onNext, onError) => volgKlas('stemmingen', klasId, onNext, onError);
export const subscribeKlasWedstrijden = (klasId, onNext, onError) => volgKlas('wedstrijden', klasId, onNext, onError);
export const subscribeKlasInzendingen = (klasId, onNext, onError) => volgKlas('inzendingen', klasId, onNext, onError);

export const maakStemming = (klasId, vraag, opties) => addDoc(collection(db, 'stemmingen'), {
  klasId,
  vraag: String(vraag || '').trim(),
  opties: opties.map((optie) => String(optie).trim()).filter(Boolean).slice(0, 4),
  telling: opties.filter((optie) => String(optie).trim()).slice(0, 4).map(() => 0),
  status: 'open',
  uitslagZichtbaar: false,
  createdAt: serverTimestamp()
});

export const wijzigStemming = (id, velden) => updateDoc(doc(db, 'stemmingen', id), { ...velden, updatedAt: serverTimestamp() });

export const maakWedstrijd = (klasId, thema, uitleg) => addDoc(collection(db, 'wedstrijden'), {
  klasId,
  thema: String(thema || '').trim(),
  uitleg: String(uitleg || '').trim(),
  status: 'open',
  winnaarInzendingId: '',
  createdAt: serverTimestamp()
});

export const wijzigWedstrijd = (id, velden) => setDoc(doc(db, 'wedstrijden', id), { ...velden, updatedAt: serverTimestamp() }, { merge: true });
