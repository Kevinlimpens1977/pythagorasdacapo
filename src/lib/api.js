import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import app from '../services/firebase';

// Get functions instance
const functions = getFunctions(app, 'europe-west1');

// If testing locally against an emulator
if (window.location.hostname === 'localhost') {
  // connectFunctionsEmulator(functions, 'localhost', 5001);
}

export const askAiTutorCall = async (message, contextHeading, previousMessages) => {
  try {
    const askTutor = httpsCallable(functions, 'askAiTutor');
    const result = await askTutor({ message, contextHeading, previousMessages });
    return result.data;
  } catch (error) {
    console.error("AI Tutor API Error:", error);
    return { success: false, error: "Er is een fout opgetreden bij het verbinden met de tutor." };
  }
};
