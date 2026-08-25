import { getFunctions, httpsCallable } from 'firebase/functions';
import app from '../services/firebase';
import { sanitizeOpenAnswerAssessmentFeedback } from './openAnswerAssessmentFeedback';

// Get functions instance
const functions = getFunctions(app, 'europe-west1');

// If testing locally against an emulator
if (window.location.hostname === 'localhost') {
  // connectFunctionsEmulator(functions, 'localhost', 5001);
}

export const askAiTutorCall = async (message, contextHeading, previousMessages, hints = [], studentAnswer = '', blockId = '', lessonContext = '') => {
  try {
    const askTutor = httpsCallable(functions, 'askAiTutor');
    const result = await askTutor({ message, contextHeading, previousMessages, hints, studentAnswer, blockId, lessonContext });
    return result.data;
  } catch (error) {
    console.error("Digidocent API Error:", error);
    return { success: false, error: "Er is een fout opgetreden bij het verbinden met Digidocent." };
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
    const data = result.data || {};
    return {
      ...data,
      feedback: sanitizeOpenAnswerAssessmentFeedback(data.feedback),
      error: sanitizeOpenAnswerAssessmentFeedback(data.error)
    };
  } catch (error) {
    console.error('Open answer assessment error:', error);
    return { success: false, error: 'Digidocent kon je antwoord niet beoordelen.' };
  }
};

/**
 * Laat een gesloten vraag server-side nakijken.
 *
 * De antwoordsleutel staat niet in de leerlingbrowser en hoort daar ook niet:
 * de callable haalt de volledige vraag met de Admin SDK op, draait de gedeelde
 * beoordelingslaag en geeft alleen het oordeel terug.
 *
 * Faalt de aanroep (functie nog niet gedeployed, offline, throttle), dan komt er
 * `{ success: false, unavailable: true, code }` terug. De leerlingroute valt dan
 * zichtbaar terug op de oude situatie; de leerling loopt nooit vast.
 */
let closedQuestionGradingMissing = false;

export const gradeClosedQuestionCall = async ({ vraagId = '', blockId = '', itemId = '', answers = {} } = {}) => {
  // Een toetsitem heeft geen eigen vraag-document: dat wordt met blockId +
  // itemId opgezocht in het lesblok. Dezelfde callable, dezelfde grenzen.
  if (!vraagId && !(blockId && itemId)) {
    return { success: false, unavailable: true, code: 'missing-vraag-id' };
  }

  // Zolang de functie nog niet gedeployed is, hoeft niet elke vraag opnieuw
  // tegen een 404 aan te lopen: een keer is genoeg om terug te vallen.
  if (closedQuestionGradingMissing) {
    return { success: false, unavailable: true, code: 'functions/not-found' };
  }

  try {
    const gradeClosedQuestion = httpsCallable(functions, 'gradeClosedQuestion');
    const result = await gradeClosedQuestion({ vraagId, blockId, itemId, answers });
    const data = result.data || {};
    return { ...data, success: data.success === true };
  } catch (error) {
    if (error?.code === 'functions/not-found') {
      closedQuestionGradingMissing = true;
    }
    console.error('Closed question grading error:', error);
    return {
      success: false,
      unavailable: true,
      code: error?.code || 'functions/internal',
      error: sanitizeOpenAnswerAssessmentFeedback(error?.message || '')
    };
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
