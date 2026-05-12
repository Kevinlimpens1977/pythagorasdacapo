import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import app from '../services/firebase';

// Get functions instance
const functions = getFunctions(app, 'europe-west1');

// If testing locally against an emulator
if (window.location.hostname === 'localhost') {
  // connectFunctionsEmulator(functions, 'localhost', 5001);
}

export const askAiTutorCall = async (message, contextHeading, previousMessages, hints = []) => {
  try {
    const askTutor = httpsCallable(functions, 'askAiTutor');
    const result = await askTutor({ message, contextHeading, previousMessages, hints });
    return result.data;
  } catch (error) {
    console.error("AI Tutor API Error:", error);
    return { success: false, error: "Er is een fout opgetreden bij het verbinden met de tutor." };
  }
};

/**
 * Extract text from image via OpenRouter Vision API
 * Used for OCR in CMS crop editor
 * @param {Blob} imageBlob - Image blob to extract text from
 * @returns {Promise<string>} Extracted text
 */
export const extractTextViaOCR = async (imageBlob) => {
  try {
    console.log('🔍 [OCR] Starting text extraction via OpenRouter...');
    console.log('📋 [OCR] Image blob size:', imageBlob?.size, 'bytes');

    // Convert blob to base64
    console.log('⏳ [OCR] Converting blob to base64...');
    const reader = new FileReader();
    const base64Promise = new Promise((resolve, reject) => {
      reader.onload = () => {
        console.log('✔️ [OCR] Blob converted to base64');
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (err) => {
        console.error('❌ [OCR] FileReader error:', err);
        reject(err);
      };
    });
    reader.readAsDataURL(imageBlob); // START reading the blob!
    const base64Image = await base64Promise;

    console.log('🔑 [OCR] Checking API key...');
    const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
    console.log('🔑 [OCR] API key present:', !!OPENROUTER_API_KEY);
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key not configured. Set VITE_OPENROUTER_API_KEY in .env.local');
    }

    console.log('📤 [OCR] Sending request to OpenRouter with model: gpt-4o');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'Stelling van Pythagoras CMS'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract all text from this image. Return ONLY the text, nothing else. Preserve formatting and structure as much as possible.'
              },
              {
                type: 'image',
                image: `data:image/jpeg;base64,${base64Image}`
              }
            ]
          }
        ],
        max_tokens: 2000
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('✅ [OCR] Response received:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [OCR] OpenRouter API error response:', errorText);
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📦 [OCR] API response full:', JSON.stringify(data, null, 2));

    // Check for API error in response
    if (data.error) {
      console.error('❌ [OCR] API returned error:', data.error);
      throw new Error(`OpenRouter API error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    const extractedText = data.choices?.[0]?.message?.content || '';

    if (!extractedText) {
      console.warn('⚠️ [OCR] No text extracted from response:', data);
      throw new Error('OCR API returned empty text');
    }

    // Check if the response is an error message instead of actual text
    if (extractedText.includes("can't view or extract") || extractedText.includes("I'm sorry")) {
      console.error('❌ [OCR] API returned error as text:', extractedText);
      throw new Error(`OCR service refused: ${extractedText}`);
    }

    console.log('✅ [OCR] Text extracted successfully:', extractedText.substring(0, 100) + '...');
    return extractedText;
  } catch (error) {
    console.error('❌ [OCR] Error extracting text:', error);
    throw new Error(`OCR failed: ${error.message}`);
  }
};
