/**
 * Migration Service
 * Imports hardcoded Pythagoras slides from JS files to Firestore
 */

import { setDoc, doc, serverTimestamp, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { voorkennisSlides } from '../data/voorkennis';
import { para71Slides } from '../data/para71';
import { para72Slides } from '../data/para72';
import { para73Slides } from '../data/para73';

const PYTHAGORAS_VAK_ID = 'pythagoras';
const PYTHAGORAS_LEERJAAR_ID = 'pythagoras_jaar1';
const PYTHAGORAS_NIVEAU_ID = 'pythagoras_vmbo';
const PYTHAGORAS_HOOFDSTUK_ID = 'pythagoras_h7';

/**
 * Migreer alle Pythagoras content naar Firestore
 * @param {string} adminUid - Admin user ID
 * @returns {Promise<{success: boolean, count: number}>}
 */
export const migratePythagorasToFirestore = async (adminUid) => {
  if (!adminUid) throw new Error('Admin UID is required');

  try {
    console.log('🚀 [MIGRATE] Starting Pythagoras migration...');

    // Step 1: Create/ensure vak exists
    console.log('📌 [MIGRATE] Setting up Pythagoras vak...');
    await setDoc(doc(db, 'vak', PYTHAGORAS_VAK_ID), {
      id: PYTHAGORAS_VAK_ID,
      name: 'Stelling van Pythagoras',
      description: 'Compleet wiskundecurriculum over Pythagoras',
      order: 1,
      isActive: true,
      createdAt: serverTimestamp(),
      migratedAt: serverTimestamp(),
      migratedBy: adminUid,
    });

    // Step 2: Create/ensure leerjaar exists
    console.log('📌 [MIGRATE] Setting up leerjaar...');
    await setDoc(doc(db, 'leerjaar', PYTHAGORAS_LEERJAAR_ID), {
      id: PYTHAGORAS_LEERJAAR_ID,
      vakId: PYTHAGORAS_VAK_ID,
      year: 1,
      name: 'Jaar 1',
      order: 1,
      isActive: true,
      createdAt: serverTimestamp(),
    });

    // Step 3: Create/ensure niveau exists
    console.log('📌 [MIGRATE] Setting up niveau...');
    await setDoc(doc(db, 'niveau', PYTHAGORAS_NIVEAU_ID), {
      id: PYTHAGORAS_NIVEAU_ID,
      leerjaarId: PYTHAGORAS_LEERJAAR_ID,
      vakId: PYTHAGORAS_VAK_ID,
      label: 'VMBO-B',
      name: 'Basis',
      order: 1,
      isActive: true,
      createdAt: serverTimestamp(),
    });

    // Step 4: Create/ensure hoofdstuk exists
    console.log('📌 [MIGRATE] Setting up hoofdstuk...');
    await setDoc(doc(db, 'hoofdstuk', PYTHAGORAS_HOOFDSTUK_ID), {
      id: PYTHAGORAS_HOOFDSTUK_ID,
      niveauId: PYTHAGORAS_NIVEAU_ID,
      leerjaarId: PYTHAGORAS_LEERJAAR_ID,
      vakId: PYTHAGORAS_VAK_ID,
      number: 7,
      title: 'Stelling van Pythagoras',
      order: 1,
      published: true,
      isArchived: false,
      createdAt: serverTimestamp(),
    });

    // Step 5: Migrate each chapter
    let totalSlides = 0;
    const chapters = [
      { id: 'voorkennis', slides: voorkennisSlides, title: 'Voorkennis' },
      { id: 'para_71', slides: para71Slides, title: '7.1 Rechthoekige driehoeken' },
      { id: 'para_72', slides: para72Slides, title: '7.2 Het Pythagoras-schema' },
      { id: 'para_73', slides: para73Slides, title: '7.3 Langste zijde berekenen' },
    ];

    for (const chapter of chapters) {
      console.log(`📝 [MIGRATE] Migrating ${chapter.title}...`);
      const count = await migrateChapter(
        chapter.id,
        chapter.slides,
        chapter.title,
        adminUid
      );
      totalSlides += count;
      console.log(`✅ [MIGRATE] ${chapter.title}: ${count} slides`);
    }

    console.log(`🎉 [MIGRATE] Migration complete! Total slides: ${totalSlides}`);
    return { success: true, count: totalSlides };
  } catch (error) {
    console.error('❌ [MIGRATE] Migration failed:', error);
    throw error;
  }
};

/**
 * Migrate a single chapter
 * @private
 */
const migrateChapter = async (chapterId, slides, chapterTitle, adminUid) => {
  // Create/ensure paragraaf exists
  const paragraafId = chapterId;
  await setDoc(doc(db, 'paragraaf', paragraafId), {
    id: paragraafId,
    hoofdstukId: PYTHAGORAS_HOOFDSTUK_ID,
    niveauId: PYTHAGORAS_NIVEAU_ID,
    leerjaarId: PYTHAGORAS_LEERJAAR_ID,
    vakId: PYTHAGORAS_VAK_ID,
    title: chapterTitle,
    code: chapterId,
    beschrijving: chapterTitle,
    order: 1,
    published: true,
    isArchived: false,
    createdAt: serverTimestamp(),
  });

  // Migrate each slide in the chapter
  let slideCount = 0;
  for (let idx = 0; idx < slides.length; idx++) {
    await mapSlideToVraag(slides[idx], paragraafId, idx, adminUid);
    slideCount++;
  }

  return slideCount;
};

/**
 * Map a single JS slide to Firestore vraag document
 * @private
 */
const mapSlideToVraag = async (slide, paragraafId, slideIndex, adminUid) => {
  const vraagId = slide.id;

  // Build images array - handle both single image and images array
  let images = [];
  if (slide.images && Array.isArray(slide.images)) {
    images = [...slide.images];
  } else if (slide.image && typeof slide.image === 'string') {
    images = [slide.image];
  }

  const vraagDoc = {
    id: vraagId,
    slideId: vraagId,
    vakId: PYTHAGORAS_VAK_ID,
    leerjaarId: PYTHAGORAS_LEERJAAR_ID,
    niveauId: PYTHAGORAS_NIVEAU_ID,
    hoofdstukId: PYTHAGORAS_HOOFDSTUK_ID,
    paragraafId,

    // Slide identity - UNIQUE number per slide
    slideType: slide.type,
    heading: slide.heading,
    order: (slideIndex + 1),
    number: (slideIndex + 1),
    title: slide.heading,
    status: 'published',

    // Content - properly map images
    content: {
      text: slide.content || '',
      images: images,
    },

    // Exercise/answer data
    antwoord: buildAnswerObject(slide),

    // Evaluation metadata (null for non-evaluation slides)
    evaluationMeta: {
      questionNumber: slide.questionNumber || null,
      totalQuestions: slide.totalQuestions || null,
    },

    // Presentation metadata (null for non-presentation slides)
    presentationMeta: {
      pdfPath: slide.pdfPath || null,
      totalPages: slide.totalPages || null,
      duration: slide.duration || null,
      subtitle: slide.subtitle || null,
      notes: slide.notes || null,
    },

    // Metadata
    vraagtype: mapVraagtype(slide.type),
    vraagMetadata: {
      difficulty: 3,
      hints: slide.hints || [],
      showCalculator: slide.exercise?.type === 'multi_input' ? false : false,
      calculatorMode: 'standard',
    },

    isArchived: false,
    createdBy: adminUid,
    createdAt: serverTimestamp(),
    migratedFrom: 'hardcoded_js',
  };

  await setDoc(doc(db, 'vraag', vraagId), vraagDoc);
};

/**
 * Build antwoord object from JS slide exercise
 * @private
 */
const buildAnswerObject = (slide) => {
  if (!slide.exercise) {
    return {
      exerciseType: null,
      maxAttempts: null,
      fields: [],
      steps: null,
      proofSteps: null,
    };
  }

  const exercise = slide.exercise;

  // Handle multi_input exercises
  if (exercise.type === 'multi_input' && exercise.fields) {
    return {
      exerciseType: 'multi_input',
      maxAttempts: exercise.maxAttempts || 3,
      fields: exercise.fields.map(f => ({
        id: f.id,
        label: f.label,
        answer: f.answer, // Can be string or string[]
        hint: f.hint || null,
        tolerance: f.tolerance || null,
      })),
      steps: null,
      proofSteps: null,
    };
  }

  // Handle demo exercises
  if (exercise.type === 'demo' && exercise.steps) {
    return {
      exerciseType: 'demo',
      maxAttempts: null,
      fields: [],
      steps: exercise.steps,
      proofSteps: null,
    };
  }

  // Handle pythagoras_proof exercises
  if (exercise.type === 'pythagoras_proof' && exercise.steps) {
    return {
      exerciseType: 'pythagoras_proof',
      maxAttempts: null,
      fields: [],
      steps: null,
      proofSteps: exercise.steps.map(step => ({
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

  // Default
  return {
    exerciseType: exercise.type || null,
    maxAttempts: exercise.maxAttempts || null,
    fields: [],
    steps: null,
    proofSteps: null,
  };
};

/**
 * Map JS slide type to vraagtype
 * @private
 */
const mapVraagtype = (slideType) => {
  const typeMap = {
    theory: 'theory',
    exercise: 'open',
    evaluation: 'evaluation',
    summary: 'summary',
    evaluation_summary: 'evaluation_summary',
    demo_exercise: 'demo',
    presentation: 'presentation',
  };
  return typeMap[slideType] || 'open';
};

/**
 * Check if migration has already been done
 * @returns {Promise<boolean>}
 */
export const isPythagorasMigrated = async () => {
  try {
    const q = query(
      collection(db, 'vraag'),
      where('migratedFrom', '==', 'hardcoded_js')
    );
    const snapshot = await getDocs(q);
    return snapshot.size > 0;
  } catch (error) {
    console.error('Error checking migration status:', error);
    return false;
  }
};

/**
 * Delete all migrated Pythagoras slides from Firestore (FIXED: now deletes entire hierarchy)
 * @returns {Promise<{success: boolean, count: number}>}
 */
export const deletePythagorasMigration = async () => {
  try {
    console.log('🗑️ [MIGRATE] Starting deletion of Pythagoras data (including hierarchy)...');

    let totalCount = 0;

    // Delete all vragen where migratedFrom = 'hardcoded_js'
    console.log('  📋 Deleting vragen...');
    const vraagQuery = query(
      collection(db, 'vraag'),
      where('migratedFrom', '==', 'hardcoded_js')
    );
    const vraagSnapshot = await getDocs(vraagQuery);
    for (const docSnap of vraagSnapshot.docs) {
      await deleteDoc(docSnap.ref);
      totalCount++;
    }
    console.log(`  ✅ Deleted ${vraagSnapshot.docs.length} vragen`);

    // Delete all paragrafen where vakId = PYTHAGORAS_VAK_ID
    console.log('  📋 Deleting paragrafen...');
    const paraQuery = query(
      collection(db, 'paragraaf'),
      where('vakId', '==', PYTHAGORAS_VAK_ID)
    );
    const paraSnapshot = await getDocs(paraQuery);
    for (const docSnap of paraSnapshot.docs) {
      await deleteDoc(docSnap.ref);
      totalCount++;
    }
    console.log(`  ✅ Deleted ${paraSnapshot.docs.length} paragrafen`);

    // Delete all hoofdstukken where vakId = PYTHAGORAS_VAK_ID
    console.log('  📋 Deleting hoofdstukken...');
    const hQuery = query(
      collection(db, 'hoofdstuk'),
      where('vakId', '==', PYTHAGORAS_VAK_ID)
    );
    const hSnapshot = await getDocs(hQuery);
    for (const docSnap of hSnapshot.docs) {
      await deleteDoc(docSnap.ref);
      totalCount++;
    }
    console.log(`  ✅ Deleted ${hSnapshot.docs.length} hoofdstukken`);

    // Delete all niveaus where vakId = PYTHAGORAS_VAK_ID
    console.log('  📋 Deleting niveaus...');
    const nQuery = query(
      collection(db, 'niveau'),
      where('vakId', '==', PYTHAGORAS_VAK_ID)
    );
    const nSnapshot = await getDocs(nQuery);
    for (const docSnap of nSnapshot.docs) {
      await deleteDoc(docSnap.ref);
      totalCount++;
    }
    console.log(`  ✅ Deleted ${nSnapshot.docs.length} niveaus`);

    // Delete all leerjaren where vakId = PYTHAGORAS_VAK_ID
    console.log('  📋 Deleting leerjaren...');
    const ljQuery = query(
      collection(db, 'leerjaar'),
      where('vakId', '==', PYTHAGORAS_VAK_ID)
    );
    const ljSnapshot = await getDocs(ljQuery);
    for (const docSnap of ljSnapshot.docs) {
      await deleteDoc(docSnap.ref);
      totalCount++;
    }
    console.log(`  ✅ Deleted ${ljSnapshot.docs.length} leerjaren`);

    // Delete the vak itself by ID
    console.log('  📋 Deleting vak...');
    await deleteDoc(doc(db, 'vak', PYTHAGORAS_VAK_ID));
    totalCount++;
    console.log(`  ✅ Deleted vak "${PYTHAGORAS_VAK_ID}"`);

    console.log(`🎉 [MIGRATE] Pythagoras deletion complete! Total docs deleted: ${totalCount}`);
    return { success: true, count: totalCount };
  } catch (error) {
    console.error('❌ [MIGRATE] Deletion failed:', error);
    throw error;
  }
};

/**
 * Delete ALL CMS content from Firestore (vak, leerjaar, niveau, hoofdstuk, paragraaf, vraag, klassen)
 * WARNING: This is destructive and permanent. Users are NOT deleted.
 * @returns {Promise<{success: boolean, count: number}>}
 */
export const deleteAllCmsContent = async () => {
  try {
    console.log('🗑️ [MIGRATE] Starting FULL CMS content deletion...');

    let totalCount = 0;

    // Delete all vragen
    console.log('  📋 Deleting all vragen...');
    const vraagQuery = query(collection(db, 'vraag'));
    const vraagSnapshot = await getDocs(vraagQuery);
    for (const docSnap of vraagSnapshot.docs) {
      await deleteDoc(docSnap.ref);
      totalCount++;
    }
    console.log(`  ✅ Deleted ${vraagSnapshot.docs.length} vragen`);

    // Delete all paragrafen
    console.log('  📋 Deleting all paragrafen...');
    const paraQuery = query(collection(db, 'paragraaf'));
    const paraSnapshot = await getDocs(paraQuery);
    for (const docSnap of paraSnapshot.docs) {
      await deleteDoc(docSnap.ref);
      totalCount++;
    }
    console.log(`  ✅ Deleted ${paraSnapshot.docs.length} paragrafen`);

    // Delete all hoofdstukken
    console.log('  📋 Deleting all hoofdstukken...');
    const hQuery = query(collection(db, 'hoofdstuk'));
    const hSnapshot = await getDocs(hQuery);
    for (const docSnap of hSnapshot.docs) {
      await deleteDoc(docSnap.ref);
      totalCount++;
    }
    console.log(`  ✅ Deleted ${hSnapshot.docs.length} hoofdstukken`);

    // Delete all niveaus
    console.log('  📋 Deleting all niveaus...');
    const nQuery = query(collection(db, 'niveau'));
    const nSnapshot = await getDocs(nQuery);
    for (const docSnap of nSnapshot.docs) {
      await deleteDoc(docSnap.ref);
      totalCount++;
    }
    console.log(`  ✅ Deleted ${nSnapshot.docs.length} niveaus`);

    // Delete all leerjaren
    console.log('  📋 Deleting all leerjaren...');
    const ljQuery = query(collection(db, 'leerjaar'));
    const ljSnapshot = await getDocs(ljQuery);
    for (const docSnap of ljSnapshot.docs) {
      await deleteDoc(docSnap.ref);
      totalCount++;
    }
    console.log(`  ✅ Deleted ${ljSnapshot.docs.length} leerjaren`);

    // Delete all vakken
    console.log('  📋 Deleting all vakken...');
    const vQuery = query(collection(db, 'vak'));
    const vSnapshot = await getDocs(vQuery);
    for (const docSnap of vSnapshot.docs) {
      await deleteDoc(docSnap.ref);
      totalCount++;
    }
    console.log(`  ✅ Deleted ${vSnapshot.docs.length} vakken`);

    // Delete all klassen
    console.log('  📋 Deleting all klassen...');
    const kQuery = query(collection(db, 'klassen'));
    const kSnapshot = await getDocs(kQuery);
    for (const docSnap of kSnapshot.docs) {
      await deleteDoc(docSnap.ref);
      totalCount++;
    }
    console.log(`  ✅ Deleted ${kSnapshot.docs.length} klassen`);

    console.log(`🎉 [MIGRATE] FULL CMS deletion complete! Total docs deleted: ${totalCount}`);
    return { success: true, count: totalCount };
  } catch (error) {
    console.error('❌ [MIGRATE] Full deletion failed:', error);
    throw error;
  }
};

export default {
  migratePythagorasToFirestore,
  isPythagorasMigrated,
  deletePythagorasMigration,
  deleteAllCmsContent,
};
