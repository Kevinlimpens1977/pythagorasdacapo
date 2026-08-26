import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { getDownloadURL, ref as storageRef, uploadString } from 'firebase/storage';
import { db, storage } from './firebase';

/**
 * Alle Firestore- en Storage-toegang van het meldingensysteem (de bel
 * rechtsonder) op een plek. De bel, het telbolletje en het beheerscherm praten
 * hier doorheen en niet zelf met Firestore, zodat het datamodel van een
 * melding op een plaats beschreven staat.
 *
 * De grenzen liggen in firestore.rules: status en reactie zijn van het beheer,
 * en een melder leest alleen zijn eigen meldingen.
 */

const MELDINGEN_COLLECTIE = 'meldingen';

export const MELDING_STATUSSEN = {
  nieuw: { label: 'Nieuw', kleur: '#2860E0', achtergrond: '#EBF1FF' },
  opgepakt: { label: 'Wordt aan gewerkt', kleur: '#b45309', achtergrond: '#fef3c7' },
  opgelost: { label: 'Opgelost', kleur: '#166534', achtergrond: '#dcfce7' },
  afgewezen: { label: 'Afgehandeld', kleur: '#64748b', achtergrond: '#f1f5f9' }
};

const mapMeldingen = (snapshot) => snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

/** De eigen meldingen van een melder, nieuwste eerst. */
export const subscribeToEigenMeldingen = (uid, onMeldingen, onError) =>
  onSnapshot(
    query(collection(db, MELDINGEN_COLLECTIE), where('melder.uid', '==', uid), orderBy('aangemaakt', 'desc')),
    (snapshot) => onMeldingen(mapMeldingen(snapshot)),
    onError
  );

/** Alle meldingen, nieuwste eerst — het beheerscherm. */
export const subscribeToAlleMeldingen = (onMeldingen, onError) =>
  onSnapshot(
    query(collection(db, MELDINGEN_COLLECTIE), orderBy('aangemaakt', 'desc')),
    (snapshot) => onMeldingen(mapMeldingen(snapshot)),
    onError
  );

/**
 * Het aantal meldingen dat het beheer nog niet bekeken heeft — het rode
 * bolletje in de navigatie. Er wordt op gelezenDoorBeheer geteld en niet op
 * status, zodat een melding die bewust op "wordt aan gewerkt" staat niet
 * eeuwig als ongelezen blijft roepen.
 */
export const subscribeToNieuweMeldingenAantal = (onAantal, onError) =>
  onSnapshot(
    query(collection(db, MELDINGEN_COLLECTIE), where('gelezenDoorBeheer', '==', false)),
    (snapshot) => onAantal(snapshot.size),
    onError
  );

/** De schermafbeelding bij een melding; geeft de leesbare URL terug. */
export const uploadMeldingSchermafbeelding = async (uid, dataUrl) => {
  const verwijzing = storageRef(storage, `meldingen/${uid}/${Date.now()}.jpg`);
  await uploadString(verwijzing, dataUrl, 'data_url');
  return getDownloadURL(verwijzing);
};

/**
 * Een nieuwe melding. De vaste velden staan hier en niet in het formulier: een
 * melding begint altijd als 'nieuw', zonder reactie, ongelezen voor het beheer
 * en gelezen door de melder zelf.
 */
export const createMelding = async (melding) => {
  const docRef = await addDoc(collection(db, MELDINGEN_COLLECTIE), {
    ...melding,
    status: 'nieuw',
    reactie: '',
    gelezenDoorBeheer: false,
    gelezenDoorMelder: true,
    aangemaakt: serverTimestamp(),
    bijgewerkt: serverTimestamp()
  });
  return docRef.id;
};

/** Antwoord gelezen: het rode bolletje mag uit voor deze melding. */
export const markMeldingGelezenDoorMelder = (meldingId) =>
  updateDoc(doc(db, MELDINGEN_COLLECTIE, meldingId), { gelezenDoorMelder: true });

/** Melding bekeken door het beheer: telt niet langer mee als nieuw. */
export const markMeldingGelezenDoorBeheer = (meldingId) =>
  updateDoc(doc(db, MELDINGEN_COLLECTIE, meldingId), { gelezenDoorBeheer: true });

/**
 * Status en antwoord van het beheer. gelezenDoorMelder gaat hier bewust op
 * false: dat zet het rode bolletje bij de melder aan. Zonder dat zou het
 * antwoord stilletjes verschijnen en zou niemand het zien.
 */
export const saveMeldingAfhandeling = (meldingId, velden) =>
  updateDoc(doc(db, MELDINGEN_COLLECTIE, meldingId), {
    ...velden,
    gelezenDoorMelder: false,
    gelezenDoorBeheer: true,
    bijgewerkt: serverTimestamp()
  });
