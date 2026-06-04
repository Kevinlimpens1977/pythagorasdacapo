import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'progressSignalAcknowledgements';

export const listenToAcknowledgedProgressSignals = (onChange, onError) => {
  return onSnapshot(
    collection(db, COLLECTION_NAME),
    (snapshot) => {
      const acknowledgements = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      onChange?.(acknowledgements);
    },
    (error) => {
      console.error('Progress signal acknowledgements konden niet worden geladen:', error);
      onError?.(error);
    }
  );
};

export const acknowledgeProgressSignals = async (signals = [], { actorId = '', actorName = '' } = {}) => {
  const uniqueSignals = [...new Map(
    signals
      .filter((signal) => signal?.id)
      .map((signal) => [signal.id, signal])
  ).values()];

  if (!uniqueSignals.length) return;

  const batch = writeBatch(db);
  uniqueSignals.forEach((signal) => {
    batch.set(doc(db, COLLECTION_NAME, signal.id), {
      signalId: signal.id,
      signalType: signal.type || '',
      studentId: signal.studentId || '',
      studentName: signal.studentName || '',
      klasId: signal.klasId || '',
      paragraafId: signal.paragraafId || '',
      paragraafTitle: signal.paragraafTitle || '',
      status: 'seen',
      acknowledgedAt: serverTimestamp(),
      acknowledgedAtMs: Date.now(),
      acknowledgedBy: actorId || '',
      acknowledgedByName: actorName || ''
    }, { merge: true });
  });

  await batch.commit();
};

export default {
  acknowledgeProgressSignals,
  listenToAcknowledgedProgressSignals
};
