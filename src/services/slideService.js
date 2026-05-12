/**
 * Slide Service
 * Loads slides from Firestore and maps them to slide schema
 * CMS content is LEADING - chapters that should be migrated must be in Firestore
 */

import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Get all slides for a chapter
 * All chapters load from Firestore (CMS database)
 *
 * @param {string} chapterId - Chapter ID (e.g., 'para_71')
 * @returns {Promise<Array>} Array of slide objects
 */
export const getSlidesForChapter = async (chapterId) => {
  try {
    console.log(`📖 [SlideService] Loading slides for chapter "${chapterId}"`);

    // Load paragraph to get hoofdstukId
    let paragraaf = null;
    try {
      const paragraafRef = doc(db, 'paragraaf', chapterId);
      const paragraafSnap = await getDoc(paragraafRef);
      if (paragraafSnap.exists()) {
        paragraaf = { id: paragraafSnap.id, ...paragraafSnap.data() };
      }
    } catch (error) {
      console.warn(`⚠️ [SlideService] Could not load paragraph ${chapterId}:`, error.message);
    }

    // Query Firestore for slides in this chapter
    const q = query(
      collection(db, 'vraag'),
      where('paragraafId', '==', chapterId)
    );

    const snapshot = await getDocs(q);

    // Sort by number field in JavaScript
    const docs = snapshot.docs.sort((a, b) => {
      const numA = a.data().number || 0;
      const numB = b.data().number || 0;
      return numA - numB;
    });

    if (snapshot.size > 0) {
      console.log(`✅ [SlideService] Loaded ${snapshot.size} slides for "${chapterId}"`);
      return docs.map(vraagDoc =>
        mapVraagToSlide(vraagDoc.data(), chapterId, paragraaf?.hoofdstukId)
      );
    }

    console.warn(`⚠️ [SlideService] No slides found for chapter "${chapterId}"`);
    return [];
  } catch (error) {
    console.error(`❌ [SlideService] Error loading slides for "${chapterId}":`, error.message);
    return [];
  }
};

/**
 * Map a Firestore vraag document to slide schema
 * @param {Object} vraagDoc - Firestore vraag document
 * @param {string} paragraafId - Parent paragraph ID
 * @param {string} hoofdstukId - Parent chapter ID
 * @returns {Object} Slide object compatible with SlideRenderer
 * @private
 */
export const mapVraagToSlide = (vraagDoc, paragraafId = null, hoofdstukId = null) => {
  return {
    // Identity
    id: vraagDoc.id,
    type: vraagDoc.slideType || 'theory',
    heading: vraagDoc.heading || vraagDoc.title || '',
    order: vraagDoc.number || vraagDoc.order || 1,

    // Content
    content: vraagDoc.content?.text || '',
    image: vraagDoc.content?.images?.[0] || null,
    images: vraagDoc.content?.images || [],

    // Exercise data (if applicable)
    exercise: mapExerciseData(vraagDoc.antwoord, vraagDoc.slideType),

    // Metadata
    questionNumber: vraagDoc.evaluationMeta?.questionNumber || null,
    totalQuestions: vraagDoc.evaluationMeta?.totalQuestions || null,

    // Presentation metadata (if applicable)
    pdfPath: vraagDoc.presentationMeta?.pdfPath || null,
    totalPages: vraagDoc.presentationMeta?.totalPages || null,
    duration: vraagDoc.presentationMeta?.duration || null,
    subtitle: vraagDoc.presentationMeta?.subtitle || null,
    notes: vraagDoc.presentationMeta?.notes || null,

    // Hints and settings
    hints: vraagDoc.vraagMetadata?.hints || [],

    // Progress tracking (for voortgangService)
    paragraafId: paragraafId || vraagDoc.paragraafId || null,
    hoofdstukId: hoofdstukId || null,

    // Raw Firestore data (for reference)
    _firestoreId: vraagDoc.id,
    _vraagtype: vraagDoc.vraagtype,
  };
};

/**
 * Map antwoord (answer) data to exercise format
 * @private
 */
const mapExerciseData = (antwoordData, slideType) => {
  if (!antwoordData) return null;

  const { exerciseType, fields, steps, proofSteps, maxAttempts } = antwoordData;

  if (exerciseType === 'multi_input' && fields) {
    return {
      type: 'multi_input',
      maxAttempts: maxAttempts || 3,
      fields: fields.map(f => ({
        id: f.id,
        label: f.label,
        answer: f.answer,
        hint: f.hint || null,
        tolerance: f.tolerance || null,
      })),
    };
  }

  if (exerciseType === 'demo' && steps) {
    return {
      type: 'demo',
      maxAttempts: null,
      steps: steps,
    };
  }

  if (exerciseType === 'pythagoras_proof' && proofSteps) {
    return {
      type: 'pythagoras_proof',
      maxAttempts: null,
      steps: proofSteps.map(step => ({
        id: step.id,
        type: step.type,
        heading: step.heading || '',
        instruction: step.instruction || '',
        inputLabel: step.inputLabel || null,
        answer: step.answer || null,
        tolerance: step.tolerance || null,
        hint: step.hint || null,
        image: step.image || null,
      })),
    };
  }

  return null;
};

export default {
  getSlidesForChapter,
  mapVraagToSlide,
};
