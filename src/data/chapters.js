/**
 * CHAPTERS Constant (CMS-driven)
 *
 * This file provides compatibility for components that reference CHAPTERS.
 * In the new system, chapters are loaded from Firestore (CMS database).
 * This fallback returns an empty array when no chapters exist.
 *
 * Legacy: Previously loaded from hardcoded para71.js, para72.js, etc.
 * New: All chapter data comes from CMS via Firestore 'hoofdstuk' collection
 */

export const CHAPTERS = [];

/**
 * Legacy function - kept for backwards compatibility
 * Returns empty array as all chapters now come from CMS
 */
export const getChapterSlides = (chapterId) => {
  console.warn(`getChapterSlides() is deprecated. Chapters should be loaded from CMS/Firestore.`);
  return [];
};
