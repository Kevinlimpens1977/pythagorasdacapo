import { getFunctions, httpsCallable } from 'firebase/functions';
import app from '../services/firebase';

// Get functions instance
const functions = getFunctions(app, 'europe-west1');

// If testing locally against an emulator
if (window.location.hostname === 'localhost') {
  // connectFunctionsEmulator(functions, 'localhost', 5001);
}

export const askAiTutorCall = async (message, contextHeading, previousMessages, hints = [], studentAnswer = '', blockId = '') => {
  try {
    const askTutor = httpsCallable(functions, 'askAiTutor');
    const result = await askTutor({ message, contextHeading, previousMessages, hints, studentAnswer, blockId });
    return result.data;
  } catch (error) {
    console.error("AI Tutor API Error:", error);
    return { success: false, error: "Er is een fout opgetreden bij het verbinden met de tutor." };
  }
};

export const assessOpenAnswerCall = async ({
  blockId = '',
  questionTitle = '',
  questionPrompt = '',
  modelAnswer = '',
  studentAnswer = ''
} = {}) => {
  try {
    const assessOpenAnswer = httpsCallable(functions, 'assessOpenAnswer');
    const result = await assessOpenAnswer({
      blockId,
      questionTitle,
      questionPrompt,
      modelAnswer,
      studentAnswer
    });
    return result.data;
  } catch (error) {
    console.error('Open answer assessment error:', error);
    return { success: false, error: 'P-AI-co kon je antwoord niet beoordelen.' };
  }
};

export const getOpenRouterConfigStatusCall = async () => {
  try {
    const getStatus = httpsCallable(functions, 'getOpenRouterConfigStatus');
    const result = await getStatus({});
    return result.data;
  } catch (error) {
    console.error('OpenRouter config status error:', error);
    return { configured: false, enabled: false, error: 'AI-instellingen konden niet worden geladen.' };
  }
};

export const updateOpenRouterConfigCall = async ({ enabled, apiKey, model }) => {
  const updateConfig = httpsCallable(functions, 'updateOpenRouterConfig');
  const result = await updateConfig({ enabled, apiKey, model });
  return result.data;
};

export const getAiTutorRulesCall = async () => {
  const getRules = httpsCallable(functions, 'getAiTutorRules');
  const result = await getRules({});
  return result.data;
};

export const updateAiTutorRulesCall = async ({ masterRules, vmboRules, adminRules }) => {
  const updateRules = httpsCallable(functions, 'updateAiTutorRules');
  const result = await updateRules({ masterRules, vmboRules, adminRules });
  return result.data;
};

/**
 * Extract text from image via a server-side callable.
 * OpenRouter keys must never be exposed through Vite/browser env vars.
 * @param {Blob} imageBlob - Image blob to extract text from
 * @returns {Promise<string>} Extracted text
 */
export const extractTextViaOCR = async (imageBlob) => {
  try {
    console.log('[OCR] Starting server-side text extraction...');
    console.log('[OCR] Image blob size:', imageBlob?.size, 'bytes');

    const reader = new FileReader();
    const base64Promise = new Promise((resolve, reject) => {
      reader.onload = () => {
        const base64 = String(reader.result || '').split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
    reader.readAsDataURL(imageBlob);
    const base64Image = await base64Promise;

    const extractText = httpsCallable(functions, 'extractTextViaOcr');
    const result = await extractText({
      imageBase64: base64Image,
      mimeType: imageBlob?.type || 'image/jpeg'
    });

    const extractedText = result.data?.text || '';
    if (!result.data?.success || !extractedText) {
      throw new Error(result.data?.error || 'OCR API returned empty text');
    }

    console.log('[OCR] Text extracted successfully:', extractedText.substring(0, 100) + '...');
    return extractedText;
  } catch (error) {
    console.error('[OCR] Error extracting text:', error);
    throw new Error(`OCR failed: ${error.message}`, { cause: error });
  }
};
