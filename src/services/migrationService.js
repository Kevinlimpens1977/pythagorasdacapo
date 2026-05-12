/**
 * Migration Service
 * DEPRECATED: Legacy migration tool
 *
 * This service previously migrated hardcoded Pythagoras slides from JS files to Firestore.
 * With the new CMS system (Phase 2026-05), all content is created directly via the CMS interface.
 *
 * All functions below are deprecated and will throw errors if called.
 * Use the CMS Platform instead: Admin Dashboard → CMS Platform
 */

import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Delete ALL CMS content (vakken, leerjaren, niveaus, hoofdstukken, paragrafen, vragen)
 * Used for "Alles Wissen" (Full Reset) button
 * @returns {Promise<boolean>}
 */
export const deleteAllCmsContent = async () => {
  try {
    console.log('🗑️ [CLEANUP] Deleting ALL CMS content...');

    const collections = ['vak', 'leerjaar', 'niveau', 'hoofdstuk', 'paragraaf', 'vraag', 'klassen'];

    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      console.log(`🗑️ [CLEANUP] Deleting ${snapshot.size} documents from ${collectionName}...`);

      for (const doc_ of snapshot.docs) {
        await deleteDoc(doc(db, collectionName, doc_.id));
      }
    }

    console.log('✅ [CLEANUP] ALL CMS content deleted');
    return true;
  } catch (error) {
    console.error('❌ [CLEANUP] Error deleting content:', error);
    throw error;
  }
};

/**
 * Check if Pythagoras content has been migrated to Firestore
 * DEPRECATED: Always returns false now (legacy system removed)
 */
export const isPythagorasMigrated = async () => {
  console.warn('⚠️ [MIGRATE] isPythagorasMigrated() is deprecated!');
  return false; // Legacy system removed, return false
};

/**
 * Delete entire Pythagoras hierarchy (soft delete via archive flag)
 * DEPRECATED: Use deleteAllCmsContent instead
 */
export const deletePythagorasMigration = async () => {
  console.warn('⚠️ [MIGRATE] deletePythagorasMigration() is deprecated!');
  console.warn('Use deleteAllCmsContent() instead');
  return deleteAllCmsContent();
};

/**
 * DEPRECATED: Legacy migration function
 *
 * This function previously migrated hardcoded Pythagoras slides to Firestore.
 * With the new CMS system, all content is created directly via the CMS interface.
 *
 * @deprecated Use CMS Platform (Admin → CMS) to create new chapters
 */
export const migratePythagorasToFirestore = async (adminUid) => {
  console.warn('⚠️ [MIGRATE] migratePythagorasToFirestore() is deprecated!');
  console.warn('Use the CMS Platform instead: Admin → CMS Platform → "+ Vak"');
  throw new Error('Legacy migration no longer supported. Use CMS Platform to create content.');
};

export default {
  deleteAllCmsContent,
  migratePythagorasToFirestore,
  deletePythagorasMigration,
};
