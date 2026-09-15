import { getFunctions, httpsCallable } from 'firebase/functions';
import app from './firebase';

const functions = getFunctions(app, 'europe-west1');

/**
 * De vertaling van één lesblok. Mislukt het, dan geeft dit null terug en blijft
 * de Nederlandse tekst staan: een leerling mag hier nooit op vastlopen.
 */
export const haalVertaling = async (blockId, taal) => {
  if (!blockId || !taal) return null;
  try {
    const aanroep = httpsCallable(functions, 'vertaalLesblok');
    const antwoord = await aanroep({ blockId, taal });
    return antwoord?.data?.vertaling || null;
  } catch (error) {
    console.error('Vertaling ophalen mislukt:', error);
    return null;
  }
};
