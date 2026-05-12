/**
 * Slide Service
 * Loads slides from Firestore and maps them to slide schema
 * CMS content is LEADING - chapters that should be migrated must be in Firestore
 */

import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { getChapterSlides } from '../data/chapters';

// Chapters that have been migrated to Firestore (no fallback)
const MIGRATED_CHAPTERS = ['voorkennis', 'para_71', 'para_72', 'para_73'];

// Chapters that still use hardcoded data (with fallback allowed)
const HARDCODED_CHAPTERS = ['para_74', 'para_75', 'para_76'];

/**
 * Get all slides for a chapter
 * MIGRATED chapters: Load from Firestore ONLY (no fallback)
 * HARDCODED chapters: Load from Firestore if available, fallback to hardcoded
 *
 * @param {string} chapterId - Chapter ID (e.g., 'voorkennis', 'para_71')
 * @returns {Promise<Array>} Array of slide objects
 */
export const getSlidesForChapter = async (chapterId) => {
  const isMigrated = MIGRATED_CHAPTERS.includes(chapterId);
  const isHardcoded = HARDCODED_CHAPTERS.includes(chapterId);

  try {
    console.log(`📖 [SlideService] Loading slides for chapter "${chapterId}"${isMigrated ? ' [MIGRATED - no fallback]' : isHardcoded ? ' [HARDCODED - fallback allowed]' : ''}`);

    // Query Firestore for slides in this chapter (no orderBy to avoid composite index requirement)
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
      console.log(`✅ [SlideService] Loaded ${snapshot.size} slides for "${chapterId}" from Firestore`);
      return docs.map(doc => mapVraagToSlide(doc.data()));
    }

    // No Firestore slides found
    if (isMigrated) {
      console.error(`❌ [SlideService] MIGRATED chapter "${chapterId}" has NO Firestore slides! This is an error.`);
      console.error(`Check Firestore 'vraag' collection - should have documents with paragraafId="${chapterId}"`);
      return [];
    }

    if (isHardcoded) {
      console.warn(`⚠️ [SlideService] No Firestore slides for hardcoded chapter "${chapterId}", using fallback...`);
      return getChapterSlides(chapterId);
    }

    // Unknown chapter
    console.warn(`⚠️ [SlideService] Unknown chapter "${chapterId}" - not in MIGRATED or HARDCODED lists`);
    return [];
  } catch (error) {
    console.error(`❌ [SlideService] Firestore query failed for "${chapterId}":`, error.message);

    if (isHardcoded) {
      console.warn(`⚠️ [SlideService] Falling back to hardcoded for "${chapterId}"`);
      return getChapterSlides(chapterId);
    }

    return [];
  }
};

/**
 * Map a Firestore vraag document to slide schema
 * @param {Object} vraagDoc - Firestore vraag document
 * @returns {Object} Slide object compatible with SlideRenderer
 * @private
 */
export const mapVraagToSlide = (vraagDoc) => {
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
