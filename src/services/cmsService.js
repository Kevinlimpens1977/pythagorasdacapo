/**
 * CMS Service Layer
 * Handles all CRUD operations for CMS content
 * Uses Firestore as backend
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * ==================== READ OPERATIONS ====================
 */

/**
 * Get all subjects (vakken)
 * @returns {Promise<Array>} Array of vak documents
 */
export const getVakken = async () => {
  try {
    console.log('🔍 [CMS] Fetching vakken from "vak" collection...');
    const q = query(
      collection(db, 'vak'),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    console.log(`✅ [CMS] Fetched ${querySnapshot.docs.length} vakken`);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ [CMS] Error fetching vakken:', {
      code: error.code,
      message: error.message,
      fullError: error,
    });
    return [];
  }
};

/**
 * Get single subject by ID
 * @param {string} vakId
 * @returns {Promise<Object|null>}
 */
export const getVak = async (vakId) => {
  try {
    const docSnap = await getDoc(doc(db, 'vak', vakId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching vak ${vakId}:`, error);
    return null;
  }
};

/**
 * Get all grade years for a subject
 * @param {string} vakId
 * @returns {Promise<Array>}
 */
export const getLeerjaren = async (vakId) => {
  try {
    const q = query(
      collection(db, 'leerjaar'),
      where('vakId', '==', vakId),
      where('isActive', '==', true),
      orderBy('year', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching leerjaren for ${vakId}:`, error);
    return [];
  }
};

/**
 * Get single grade year by ID
 * @param {string} leerjaarId
 * @returns {Promise<Object|null>}
 */
export const getLeerjaar = async (leerjaarId) => {
  try {
    const docSnap = await getDoc(doc(db, 'leerjaar', leerjaarId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching leerjaar ${leerjaarId}:`, error);
    return null;
  }
};

/**
 * Get all levels for a grade year
 * @param {string} leerjaarId
 * @returns {Promise<Array>}
 */
export const getNiveaus = async (leerjaarId) => {
  try {
    const q = query(
      collection(db, 'niveau'),
      where('leerjaarId', '==', leerjaarId),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching niveaus for ${leerjaarId}:`, error);
    return [];
  }
};

/**
 * Get single level by ID
 * @param {string} niveauId
 * @returns {Promise<Object|null>}
 */
export const getNiveau = async (niveauId) => {
  try {
    const docSnap = await getDoc(doc(db, 'niveau', niveauId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching niveau ${niveauId}:`, error);
    return null;
  }
};

/**
 * Get all chapters for a level
 * @param {string} niveauId
 * @returns {Promise<Array>}
 */
export const getHoofdstukken = async (niveauId) => {
  try {
    const q = query(
      collection(db, 'hoofdstuk'),
      where('niveauId', '==', niveauId),
      where('isArchived', '==', false),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching hoofdstukken for ${niveauId}:`, error);
    return [];
  }
};

/**
 * Get single chapter by ID
 * @param {string} hoofdstukId
 * @returns {Promise<Object|null>}
 */
export const getHoofdstuk = async (hoofdstukId) => {
  try {
    const docSnap = await getDoc(doc(db, 'hoofdstuk', hoofdstukId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching hoofdstuk ${hoofdstukId}:`, error);
    return null;
  }
};

/**
 * Get all paragraphs for a chapter
 * @param {string} hoofdstukId
 * @returns {Promise<Array>}
 */
export const getParagrafen = async (hoofdstukId) => {
  try {
    const q = query(
      collection(db, 'paragraaf'),
      where('hoofdstukId', '==', hoofdstukId),
      where('isArchived', '==', false),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching paragrafen for ${hoofdstukId}:`, error);
    return [];
  }
};

/**
 * Get single paragraph by ID
 * @param {string} paragraafId
 * @returns {Promise<Object|null>}
 */
export const getParagraaf = async (paragraafId) => {
  try {
    const docSnap = await getDoc(doc(db, 'paragraaf', paragraafId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching paragraaf ${paragraafId}:`, error);
    return null;
  }
};

/**
 * Get all questions for a paragraph
 * @param {string} paragraafId
 * @returns {Promise<Array>}
 */
export const getVragen = async (paragraafId) => {
  try {
    // Simplified query - no orderBy to avoid index requirement
    // We'll sort in JavaScript instead
    const q = query(
      collection(db, 'vraag'),
      where('paragraafId', '==', paragraafId),
      where('isArchived', '==', false)
    );
    const querySnapshot = await getDocs(q);

    // Sort by order field in memory
    const vragen = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return vragen;
  } catch (error) {
    console.error(`Error fetching vragen for ${paragraafId}:`, error);
    return [];
  }
};

/**
 * Get single question by ID
 * @param {string} vraagId
 * @returns {Promise<Object|null>}
 */
export const getVraag = async (vraagId) => {
  try {
    const docSnap = await getDoc(doc(db, 'vraag', vraagId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching vraag ${vraagId}:`, error);
    return null;
  }
};

/**
 * ==================== WRITE OPERATIONS ====================
 */

/**
 * Create a new paragraph
 * @param {string} hoofdstukId - Parent chapter ID
 * @param {Object} data - Paragraph data
 * @param {string} userId - Admin user ID
 * @returns {Promise<string>} New paragraph ID
 */
export const createParagraaf = async (hoofdstukId, data, userId) => {
  try {
    const hoofdstuk = await getHoofdstuk(hoofdstukId);
    if (!hoofdstuk) throw new Error('Hoofdstuk not found');

    const paragraafId = `para-${data.code.replace('.', '')}-${Date.now()}`;

    // Get next order
    const paragrafen = await getParagrafen(hoofdstukId);
    const nextOrder = Math.max(...paragrafen.map(p => p.order || 0), 0) + 1;

    await setDoc(doc(db, 'paragraaf', paragraafId), {
      vakId: hoofdstuk.vakId,
      leerjaarId: hoofdstuk.leerjaarId,
      niveauId: hoofdstuk.niveauId,
      hoofdstukId,
      code: data.code,
      title: data.title,
      beschrijving: data.beschrijving || '',
      order: nextOrder,
      published: data.published !== false,
      createdBy: userId,
      createdAt: serverTimestamp(),
      aiCompanionEnabled: true,
      cropCount: 0,
      isArchived: false
    });

    return paragraafId;
  } catch (error) {
    console.error('Error creating paragraaf:', error);
    throw error;
  }
};

/**
 * Create a new question
 * @param {string} paragraafId - Parent paragraph ID
 * @param {Object} data - Question data
 * @param {string} userId - Admin user ID
 * @returns {Promise<string>} New question ID
 */
export const createVraag = async (paragraafId, data, userId) => {
  try {
    const paragraaf = await getParagraaf(paragraafId);
    if (!paragraaf) throw new Error('Paragraaf not found');

    const vraagId = `vraag-${paragraaf.code.replace('.', '')}-${data.number}-${Date.now()}`;

    // Get next order
    const vragen = await getVragen(paragraafId);
    const nextOrder = Math.max(...vragen.map(v => v.order || 0), 0) + 1;

    await setDoc(doc(db, 'vraag', vraagId), {
      vakId: paragraaf.vakId,
      leerjaarId: paragraaf.leerjaarId,
      niveauId: paragraaf.niveauId,
      hoofdstukId: paragraaf.hoofdstukId,
      paragraafId,
      number: data.number,
      title: data.title,
      vraagtype: data.vraagtype || 'open',
      order: nextOrder,
      status: data.status || 'draft',
      createdBy: userId,
      createdAt: serverTimestamp(),
      content: {
        text: data.content?.text || '',
        images: data.content?.images || []
      },
      vraagMetadata: {
        difficulty: data.vraagMetadata?.difficulty || 3,
        hints: data.vraagMetadata?.hints || [],
        showCalculator: data.vraagMetadata?.showCalculator || false,
        calculatorMode: data.vraagMetadata?.calculatorMode || 'standard'
      },
      antwoord: data.antwoord || {},
      isArchived: false
    });

    return vraagId;
  } catch (error) {
    console.error('Error creating vraag:', error);
    throw error;
  }
};

/**
 * Update a paragraph
 * @param {string} paragraafId
 * @param {Object} data - Fields to update
 * @returns {Promise<void>}
 */
export const updateParagraaf = async (paragraafId, data) => {
  try {
    await updateDoc(doc(db, 'paragraaf', paragraafId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error updating paragraaf ${paragraafId}:`, error);
    throw error;
  }
};

/**
 * Update a question
 * @param {string} vraagId
 * @param {Object} data - Fields to update
 * @returns {Promise<void>}
 */
export const updateVraag = async (vraagId, data) => {
  try {
    await updateDoc(doc(db, 'vraag', vraagId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error updating vraag ${vraagId}:`, error);
    throw error;
  }
};

/**
 * Archive a paragraph (soft delete)
 * @param {string} paragraafId
 * @returns {Promise<void>}
 */
export const archiveParagraaf = async (paragraafId) => {
  try {
    await updateParagraaf(paragraafId, {
      isArchived: true,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error archiving paragraaf ${paragraafId}:`, error);
    throw error;
  }
};

/**
 * Archive a question (soft delete)
 * @param {string} vraagId
 * @returns {Promise<void>}
 */
export const archiveVraag = async (vraagId) => {
  try {
    await updateVraag(vraagId, {
      isArchived: true,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error archiving vraag ${vraagId}:`, error);
    throw error;
  }
};

/**
 * ==================== NEW WRITE OPERATIONS: VAK, LEERJAAR, NIVEAU, HOOFDSTUK ====================
 */

/**
 * Create a new subject (vak)
 * @param {Object} data - { name, description, order }
 * @param {string} userId - Admin user ID
 * @returns {Promise<string>} New vak ID
 */
export const createVak = async (data, userId) => {
  try {
    const vakId = `vak-${data.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;

    // Get next order
    const vakken = await getVakken();
    const nextOrder = Math.max(...vakken.map(v => v.order || 0), 0) + 1;

    await setDoc(doc(db, 'vak', vakId), {
      id: vakId,
      name: data.name,
      description: data.description || '',
      order: data.order || nextOrder,
      isActive: true,
      createdBy: userId,
      createdAt: serverTimestamp()
    });

    return vakId;
  } catch (error) {
    console.error('Error creating vak:', error);
    throw error;
  }
};

/**
 * Update a subject (vak)
 * @param {string} vakId
 * @param {Object} data - Fields to update
 * @returns {Promise<void>}
 */
export const updateVak = async (vakId, data) => {
  try {
    await updateDoc(doc(db, 'vak', vakId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error updating vak ${vakId}:`, error);
    throw error;
  }
};

/**
 * Archive a subject (soft delete)
 * @param {string} vakId
 * @returns {Promise<void>}
 */
export const archiveVak = async (vakId) => {
  try {
    await updateVak(vakId, { isActive: false });
  } catch (error) {
    console.error(`Error archiving vak ${vakId}:`, error);
    throw error;
  }
};

/**
 * Create a new school year (leerjaar)
 * @param {string} vakId - Parent vak ID
 * @param {Object} data - { year, label }
 * @param {string} userId - Admin user ID
 * @returns {Promise<string>} New leerjaar ID
 */
export const createLeerjaar = async (vakId, data, userId) => {
  try {
    const vak = await getVak(vakId);
    if (!vak) throw new Error('Vak not found');

    const leerjaarId = `leerjaar-${vakId}-jaar${data.year}-${Date.now()}`;

    // Get next order
    const leerjaren = await getLeerjaren(vakId);
    const nextOrder = Math.max(...leerjaren.map(l => l.order || 0), 0) + 1;

    await setDoc(doc(db, 'leerjaar', leerjaarId), {
      id: leerjaarId,
      vakId,
      year: data.year,
      label: data.label || `Jaar ${data.year}`,
      order: nextOrder,
      isActive: true,
      createdBy: userId,
      createdAt: serverTimestamp()
    });

    return leerjaarId;
  } catch (error) {
    console.error('Error creating leerjaar:', error);
    throw error;
  }
};

/**
 * Update a school year (leerjaar)
 * @param {string} leerjaarId
 * @param {Object} data - Fields to update
 * @returns {Promise<void>}
 */
export const updateLeerjaar = async (leerjaarId, data) => {
  try {
    await updateDoc(doc(db, 'leerjaar', leerjaarId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error updating leerjaar ${leerjaarId}:`, error);
    throw error;
  }
};

/**
 * Archive a school year (soft delete)
 * @param {string} leerjaarId
 * @returns {Promise<void>}
 */
export const archiveLeerjaar = async (leerjaarId) => {
  try {
    await updateLeerjaar(leerjaarId, { isActive: false });
  } catch (error) {
    console.error(`Error archiving leerjaar ${leerjaarId}:`, error);
    throw error;
  }
};

/**
 * Create a new level (niveau)
 * @param {string} leerjaarId - Parent leerjaar ID
 * @param {Object} data - { label, name, description }
 * @param {string} userId - Admin user ID
 * @returns {Promise<string>} New niveau ID
 */
export const createNiveau = async (leerjaarId, data, userId) => {
  try {
    const leerjaar = await getLeerjaar(leerjaarId);
    if (!leerjaar) throw new Error('Leerjaar not found');

    const niveauId = `niveau-${leerjaarId}-${data.label.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;

    // Get next order
    const niveaus = await getNiveaus(leerjaarId);
    const nextOrder = Math.max(...niveaus.map(n => n.order || 0), 0) + 1;

    await setDoc(doc(db, 'niveau', niveauId), {
      id: niveauId,
      leerjaarId,
      vakId: leerjaar.vakId,
      label: data.label,
      name: data.name || data.label,
      description: data.description || '',
      order: nextOrder,
      isActive: true,
      createdBy: userId,
      createdAt: serverTimestamp()
    });

    return niveauId;
  } catch (error) {
    console.error('Error creating niveau:', error);
    throw error;
  }
};

/**
 * Update a level (niveau)
 * @param {string} niveauId
 * @param {Object} data - Fields to update
 * @returns {Promise<void>}
 */
export const updateNiveau = async (niveauId, data) => {
  try {
    await updateDoc(doc(db, 'niveau', niveauId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error updating niveau ${niveauId}:`, error);
    throw error;
  }
};

/**
 * Archive a level (soft delete)
 * @param {string} niveauId
 * @returns {Promise<void>}
 */
export const archiveNiveau = async (niveauId) => {
  try {
    await updateNiveau(niveauId, { isActive: false });
  } catch (error) {
    console.error(`Error archiving niveau ${niveauId}:`, error);
    throw error;
  }
};

/**
 * Create a new chapter (hoofdstuk)
 * @param {string} niveauId - Parent niveau ID
 * @param {Object} data - { number, title, description }
 * @param {string} userId - Admin user ID
 * @returns {Promise<string>} New hoofdstuk ID
 */
export const createHoofdstuk = async (niveauId, data, userId) => {
  try {
    const niveau = await getNiveau(niveauId);
    if (!niveau) throw new Error('Niveau not found');

    const hoofdstukId = `hoofdstuk-${niveauId}-${data.number}-${Date.now()}`;

    // Get next order
    const hoofdstukken = await getHoofdstukken(niveauId);
    const nextOrder = Math.max(...hoofdstukken.map(h => h.order || 0), 0) + 1;

    await setDoc(doc(db, 'hoofdstuk', hoofdstukId), {
      id: hoofdstukId,
      niveauId,
      leerjaarId: niveau.leerjaarId,
      vakId: niveau.vakId,
      number: data.number,
      title: data.title,
      description: data.description || '',
      order: data.order || nextOrder,
      published: false,  // Draft by default
      isArchived: false,
      createdBy: userId,
      createdAt: serverTimestamp()
    });

    return hoofdstukId;
  } catch (error) {
    console.error('Error creating hoofdstuk:', error);
    throw error;
  }
};

/**
 * Update a chapter (hoofdstuk)
 * @param {string} hoofdstukId
 * @param {Object} data - Fields to update
 * @returns {Promise<void>}
 */
export const updateHoofdstuk = async (hoofdstukId, data) => {
  try {
    await updateDoc(doc(db, 'hoofdstuk', hoofdstukId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error updating hoofdstuk ${hoofdstukId}:`, error);
    throw error;
  }
};

/**
 * Archive a chapter (soft delete)
 * @param {string} hoofdstukId
 * @returns {Promise<void>}
 */
export const archiveHoofdstuk = async (hoofdstukId) => {
  try {
    await updateHoofdstuk(hoofdstukId, { isArchived: true });
  } catch (error) {
    console.error(`Error archiving hoofdstuk ${hoofdstukId}:`, error);
    throw error;
  }
};

/**
 * Get all chapters for admin (without published filter)
 * @param {string} niveauId
 * @returns {Promise<Array>} Array of hoofdstuk documents
 */
export const getHoofdstukkenForAdmin = async (niveauId) => {
  try {
    const q = query(
      collection(db, 'hoofdstuk'),
      where('niveauId', '==', niveauId),
      where('isArchived', '==', false),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching hoofdstukken for admin:`, error);
    return [];
  }
};

/**
 * Get all chapters across all niveaus (for klassen page)
 * @returns {Promise<Array>} Array of all hoofdstuk documents
 */
export const getAllHoofdstukken = async () => {
  try {
    const q = query(
      collection(db, 'hoofdstuk'),
      where('isArchived', '==', false),
      orderBy('vakId', 'asc'),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching all hoofdstukken:', error);
    return [];
  }
};

export default {
  // Read
  getVakken,
  getVak,
  getLeerjaren,
  getLeerjaar,
  getNiveaus,
  getNiveau,
  getHoofdstukken,
  getHoofdstuk,
  getHoofdstukkenForAdmin,
  getAllHoofdstukken,
  getParagrafen,
  getParagraaf,
  getVragen,
  getVraag,
  // Write - Vak
  createVak,
  updateVak,
  archiveVak,
  // Write - Leerjaar
  createLeerjaar,
  updateLeerjaar,
  archiveLeerjaar,
  // Write - Niveau
  createNiveau,
  updateNiveau,
  archiveNiveau,
  // Write - Hoofdstuk
  createHoofdstuk,
  updateHoofdstuk,
  archiveHoofdstuk,
  // Write - Paragraaf & Vraag
  createParagraaf,
  createVraag,
  updateParagraaf,
  updateVraag,
  archiveParagraaf,
  archiveVraag
};
