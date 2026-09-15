import { getFunctions, httpsCallable } from 'firebase/functions';
import app from './firebase';

const functions = getFunctions(app, 'europe-west1');

/**
 * De vertaling van één lesblok.
 *
 * Geeft altijd `{ vertaling, mislukt }` terug en werpt nooit: een leerling mag
 * hier nooit op vastlopen, de Nederlandse tekst blijft gewoon staan. Maar een
 * mislukking mag ook niet stil blijven - dan kijkt de leerling naar een
 * opgelichte knop boven een Nederlandse pagina - dus wie dit aanroept kan aan
 * `mislukt` zien dat er een melding hoort te komen.
 */
export const haalVertaling = async (blockId, taal) => {
  if (!blockId || !taal) return { vertaling: null, mislukt: false };
  try {
    const aanroep = httpsCallable(functions, 'vertaalLesblok');
    const antwoord = await aanroep({ blockId, taal });
    const vertaling = antwoord?.data?.vertaling || null;
    // Een leeg antwoord telt net zo goed als mislukt: er valt niets te tonen.
    return vertaling ? { vertaling, mislukt: false } : { vertaling: null, mislukt: true };
  } catch (error) {
    console.error('Vertaling ophalen mislukt:', error);
    return { vertaling: null, mislukt: true };
  }
};
