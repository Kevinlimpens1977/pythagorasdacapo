import { db } from './firebase';
import { auth } from './firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

const DUMMY_VAK_ID = 'dummy_test_vak';
const DUMMY_VAK_NAME = '🧪 Dummy Test Data';

/**
 * Create comprehensive dummy test data structure for CMS testing
 * Uses FLAT collections (vak, leerjaar, niveau, etc.) to match cmsService.js expectations
 */
export async function createDummyData() {
  try {
    // DEBUG: Log auth state
    const currentUser = auth.currentUser;
    console.log('🔐 [DUMMY DATA] Auth State:', {
      isAuthenticated: !!currentUser,
      uid: currentUser?.uid,
      email: currentUser?.email,
    });

    if (!currentUser) {
      throw new Error('User not authenticated! Cannot create dummy data.');
    }

    console.log('📝 [DUMMY DATA] Starting creation with FLAT collections...');

    // Create dummy Vak
    console.log('📌 [DUMMY DATA] Creating Vak...');
    await setDoc(doc(db, 'vak', DUMMY_VAK_ID), {
      id: DUMMY_VAK_ID,
      name: DUMMY_VAK_NAME,
      description: 'Temporary test data for CMS development. Safe to delete.',
      order: 999,
      isActive: true,
      createdAt: new Date(),
      isDummyData: true,
    });
    console.log('✅ [DUMMY DATA] Vak created');

    // Create dummy Leerjaar
    const leerjaarId = `${DUMMY_VAK_ID}_jaar1`;
    console.log('📌 [DUMMY DATA] Creating Leerjaar...');
    await setDoc(doc(db, 'leerjaar', leerjaarId), {
      id: leerjaarId,
      vakId: DUMMY_VAK_ID,
      year: 1,
      name: 'Jaar 1',
      order: 1,
      isActive: true,
      isDummyData: true,
    });
    console.log('✅ [DUMMY DATA] Leerjaar created');

    // Create dummy Niveau
    const niveauId = `${DUMMY_VAK_ID}_niveau_basis`;
    console.log('📌 [DUMMY DATA] Creating Niveau...');
    await setDoc(doc(db, 'niveau', niveauId), {
      id: niveauId,
      leerjaarId: leerjaarId,
      vakId: DUMMY_VAK_ID,
      label: 'VMBO-B',
      name: 'Basis',
      description: 'Basic level',
      order: 1,
      isActive: true,
      isDummyData: true,
    });
    console.log('✅ [DUMMY DATA] Niveau created');

    // Create dummy Hoofdstuk
    const hoofdstukId = `${DUMMY_VAK_ID}_hoofdstuk_1`;
    console.log('📌 [DUMMY DATA] Creating Hoofdstuk...');
    await setDoc(doc(db, 'hoofdstuk', hoofdstukId), {
      id: hoofdstukId,
      niveauId: niveauId,
      leerjaarId: leerjaarId,
      vakId: DUMMY_VAK_ID,
      number: 7,
      title: 'Test Hoofdstuk',
      description: 'A test chapter for CMS development',
      order: 1,
      published: true,
      isArchived: false,
      isDummyData: true,
    });
    console.log('✅ [DUMMY DATA] Hoofdstuk created');

    // Create 3 dummy Paragrafen
    const paragraphs = [
      {
        id: `${DUMMY_VAK_ID}_para_1`,
        title: 'Paragraaf 1: Intro',
        description: 'Introduction paragraph',
      },
      {
        id: `${DUMMY_VAK_ID}_para_2`,
        title: 'Paragraaf 2: Concepts',
        description: 'Concepts paragraph',
      },
      {
        id: `${DUMMY_VAK_ID}_para_3`,
        title: 'Paragraaf 3: Practice',
        description: 'Practice paragraph',
      },
    ];

    console.log('📌 [DUMMY DATA] Creating Paragrafen...');
    for (const para of paragraphs) {
      await setDoc(doc(db, 'paragraaf', para.id), {
        id: para.id,
        hoofdstukId: hoofdstukId,
        niveauId: niveauId,
        leerjaarId: leerjaarId,
        vakId: DUMMY_VAK_ID,
        title: para.title,
        code: `para.${paragraphs.indexOf(para) + 1}`,
        beschrijving: para.description,
        order: paragraphs.indexOf(para) + 1,
        published: true,
        isArchived: false,
        isDummyData: true,
      });

      // Create 2 dummy Vragen per paragraph
      for (let i = 1; i <= 2; i++) {
        const vraagId = `${para.id}_q${i}`;
        await setDoc(doc(db, 'vraag', vraagId), {
          id: vraagId,
          paragraafId: para.id,
          hoofdstukId: hoofdstukId,
          niveauId: niveauId,
          leerjaarId: leerjaarId,
          vakId: DUMMY_VAK_ID,
          number: i,
          title: `Question ${i}`,
          content: {
            text: `Test question ${i} for paragraph ${para.title}`,
            images: [],
          },
          vraagtype: 'open',
          order: i,
          status: 'draft',
          isArchived: false,
          isDummyData: true,
        });
      }
    }

    // Create dummy Klassen
    const klassenIds = [];
    const klasNames = ['VMBO 1A', 'VMBO 1B'];
    const klasCodes = ['VMB1A', 'VMB1B'];

    console.log('📌 [DUMMY DATA] Creating Klassen...');
    for (let i = 0; i < klasNames.length; i++) {
      const klasId = `klas_dummy_${i + 1}`;
      klassenIds.push(klasId);
      await setDoc(doc(db, 'klassen', klasId), {
        klasId,
        name: klasNames[i],
        code: klasCodes[i],
        createdBy: currentUser.uid,
        createdAt: new Date(),
        settings: {
          hintsEnabled: true,
          aiEnabled: true,
          calculatorEnabled: true,
        },
        // Default: only voorkennis enabled
        enabledChapters: {
          voorkennis: true,
          para_71: false,
          para_72: false,
          para_73: false,
          para_74: false,
          para_75: false,
          para_76: false,
        },
        isDummyData: true,
      });
    }
    console.log('✅ [DUMMY DATA] Klassen created');

    console.log('🎉 [DUMMY DATA] All dummy data created successfully!');
    return {
      success: true,
      message: `Dummy data created: 1 Vak, 1 Leerjaar, 1 Niveau, 1 Hoofdstuk, 3 Paragrafen, 6 Vragen, 2 Klassen`,
      vakId: DUMMY_VAK_ID,
    };
  } catch (error) {
    console.error('❌ [DUMMY DATA] Error creating dummy data:', {
      code: error.code,
      message: error.message,
      fullError: error,
    });
    throw error;
  }
}

/**
 * Delete all dummy test data safely
 * Only deletes data marked with isDummyData flag
 */
export async function deleteDummyData() {
  try {
    console.log('🗑️ [DUMMY DATA] Starting deletion...');

    // Delete vragen
    const vragenQuery = query(
      collection(db, 'vraag'),
      where('isDummyData', '==', true)
    );
    const vragenDocs = await getDocs(vragenQuery);
    for (const doc of vragenDocs.docs) {
      await deleteDoc(doc.ref);
    }
    console.log(`✅ [DUMMY DATA] Deleted ${vragenDocs.docs.length} vragen`);

    // Delete paragrafen
    const paragraafQuery = query(
      collection(db, 'paragraaf'),
      where('isDummyData', '==', true)
    );
    const paragraafDocs = await getDocs(paragraafQuery);
    for (const doc of paragraafDocs.docs) {
      await deleteDoc(doc.ref);
    }
    console.log(`✅ [DUMMY DATA] Deleted ${paragraafDocs.docs.length} paragrafen`);

    // Delete hoofdstukken
    const hoofdstukQuery = query(
      collection(db, 'hoofdstuk'),
      where('isDummyData', '==', true)
    );
    const hoofdstukDocs = await getDocs(hoofdstukQuery);
    for (const doc of hoofdstukDocs.docs) {
      await deleteDoc(doc.ref);
    }
    console.log(`✅ [DUMMY DATA] Deleted ${hoofdstukDocs.docs.length} hoofdstukken`);

    // Delete niveaus
    const niveauQuery = query(
      collection(db, 'niveau'),
      where('isDummyData', '==', true)
    );
    const niveauDocs = await getDocs(niveauQuery);
    for (const doc of niveauDocs.docs) {
      await deleteDoc(doc.ref);
    }
    console.log(`✅ [DUMMY DATA] Deleted ${niveauDocs.docs.length} niveaus`);

    // Delete leerjaren
    const leerjaarQuery = query(
      collection(db, 'leerjaar'),
      where('isDummyData', '==', true)
    );
    const leerjaarDocs = await getDocs(leerjaarQuery);
    for (const doc of leerjaarDocs.docs) {
      await deleteDoc(doc.ref);
    }
    console.log(`✅ [DUMMY DATA] Deleted ${leerjaarDocs.docs.length} leerjaren`);

    // Delete vak
    const vakQuery = query(
      collection(db, 'vak'),
      where('isDummyData', '==', true)
    );
    const vakDocs = await getDocs(vakQuery);
    for (const doc of vakDocs.docs) {
      await deleteDoc(doc.ref);
    }
    console.log(`✅ [DUMMY DATA] Deleted ${vakDocs.docs.length} vakken`);

    // Delete klassen
    const klassenQuery = query(
      collection(db, 'klassen'),
      where('isDummyData', '==', true)
    );
    const klassenDocs = await getDocs(klassenQuery);
    for (const doc of klassenDocs.docs) {
      await deleteDoc(doc.ref);
    }
    console.log(`✅ [DUMMY DATA] Deleted ${klassenDocs.docs.length} klassen`);

    console.log('🎉 [DUMMY DATA] All dummy data deleted successfully!');
    return {
      success: true,
      message: 'Dummy data deleted successfully',
    };
  } catch (error) {
    console.error('❌ [DUMMY DATA] Error deleting dummy data:', error);
    throw error;
  }
}

/**
 * Check if dummy data exists
 */
export async function dummyDataExists() {
  try {
    const vakQuery = query(
      collection(db, 'vak'),
      where('isDummyData', '==', true)
    );
    const docSnapshot = await getDocs(vakQuery);
    return docSnapshot.size > 0;
  } catch (error) {
    console.error('❌ [DUMMY DATA] Error checking dummy data:', error);
    return false;
  }
}
