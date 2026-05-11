import { db } from './firebase';
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
 * Does NOT touch existing chapter data (h7, etc.)
 */
export async function createDummyData() {
  try {
    // Create dummy Vak
    await setDoc(doc(db, 'vakken', DUMMY_VAK_ID), {
      id: DUMMY_VAK_ID,
      name: DUMMY_VAK_NAME,
      description: 'Temporary test data for CMS development. Safe to delete.',
      order: 999,
      createdAt: new Date(),
      isDummyData: true,
    });

    // Create dummy Leerjaar (Year 1)
    const leerjaarId = `${DUMMY_VAK_ID}_jaar1`;
    await setDoc(
      doc(db, 'vakken', DUMMY_VAK_ID, 'leerjaren', leerjaarId),
      {
        id: leerjaarId,
        year: 1,
        name: 'Jaar 1',
        order: 1,
        isDummyData: true,
      }
    );

    // Create dummy Niveau (Level)
    const niveauId = `${DUMMY_VAK_ID}_niveau_basis`;
    await setDoc(
      doc(
        db,
        'vakken',
        DUMMY_VAK_ID,
        'leerjaren',
        leerjaarId,
        'niveaus',
        niveauId
      ),
      {
        id: niveauId,
        name: 'Basis',
        description: 'Basic level',
        order: 1,
        isDummyData: true,
      }
    );

    // Create dummy Hoofdstuk (Chapter)
    const hoofdstukId = `${DUMMY_VAK_ID}_hoofdstuk_1`;
    await setDoc(
      doc(
        db,
        'vakken',
        DUMMY_VAK_ID,
        'leerjaren',
        leerjaarId,
        'niveaus',
        niveauId,
        'hoofdstukken',
        hoofdstukId
      ),
      {
        id: hoofdstukId,
        title: 'Test Hoofdstuk',
        description: 'A test chapter for CMS development',
        order: 1,
        isDummyData: true,
      }
    );

    // Create 3 dummy Paragrafen (Paragraphs)
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

    for (const para of paragraphs) {
      await setDoc(
        doc(
          db,
          'vakken',
          DUMMY_VAK_ID,
          'leerjaren',
          leerjaarId,
          'niveaus',
          niveauId,
          'hoofdstukken',
          hoofdstukId,
          'paragrafen',
          para.id
        ),
        {
          id: para.id,
          title: para.title,
          content: para.description,
          order: paragraphs.indexOf(para) + 1,
          status: 'published',
          isDummyData: true,
        }
      );

      // Create 2 dummy Vragen (Questions) per paragraph
      for (let i = 1; i <= 2; i++) {
        const vraagId = `${para.id}_q${i}`;
        await setDoc(
          doc(
            db,
            'vakken',
            DUMMY_VAK_ID,
            'leerjaren',
            leerjaarId,
            'niveaus',
            niveauId,
            'hoofdstukken',
            hoofdstukId,
            'paragrafen',
            para.id,
            'vragen',
            vraagId
          ),
          {
            id: vraagId,
            title: `Question ${i}`,
            content: `Test question ${i} for paragraph ${para.title}`,
            type: 'text',
            answer: `Answer ${i}`,
            difficulty: 'medium',
            hints: [`Hint for question ${i}`],
            order: i,
            status: 'published',
            isDummyData: true,
          }
        );
      }
    }

    return {
      success: true,
      message: `Dummy data created: 1 Vak, 1 Leerjaar, 1 Niveau, 1 Hoofdstuk, 3 Paragrafen, 6 Vragen`,
      vakId: DUMMY_VAK_ID,
    };
  } catch (error) {
    console.error('Error creating dummy data:', error);
    throw error;
  }
}

/**
 * Delete all dummy test data safely
 * Only deletes data marked with isDummyData flag
 */
export async function deleteDummyData() {
  try {
    // Delete all subcollections and documents recursively
    const vakRef = doc(db, 'vakken', DUMMY_VAK_ID);
    const leerjaarSnapshot = await getDocs(
      collection(vakRef, 'leerjaren')
    );

    for (const leerjaarDoc of leerjaarSnapshot.docs) {
      const niveauSnapshot = await getDocs(
        collection(leerjaarDoc.ref, 'niveaus')
      );

      for (const niveauDoc of niveauSnapshot.docs) {
        const hoofdstukSnapshot = await getDocs(
          collection(niveauDoc.ref, 'hoofdstukken')
        );

        for (const hoofdstukDoc of hoofdstukSnapshot.docs) {
          const paragraafSnapshot = await getDocs(
            collection(hoofdstukDoc.ref, 'paragrafen')
          );

          for (const paragraafDoc of paragraafSnapshot.docs) {
            // Delete all vragen under this paragraph
            const vraagSnapshot = await getDocs(
              collection(paragraafDoc.ref, 'vragen')
            );
            for (const vraagDoc of vraagSnapshot.docs) {
              await deleteDoc(vraagDoc.ref);
            }
            // Delete the paragraph
            await deleteDoc(paragraafDoc.ref);
          }

          // Delete the hoofdstuk
          await deleteDoc(hoofdstukDoc.ref);
        }

        // Delete the niveau
        await deleteDoc(niveauDoc.ref);
      }

      // Delete the leerjaar
      await deleteDoc(leerjaarDoc.ref);
    }

    // Delete the vak itself
    await deleteDoc(vakRef);

    return {
      success: true,
      message: 'Dummy data deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting dummy data:', error);
    throw error;
  }
}

/**
 * Check if dummy data exists
 */
export async function dummyDataExists() {
  try {
    const vakRef = doc(db, 'vakken', DUMMY_VAK_ID);
    const docSnapshot = await getDocs(
      query(collection(db, 'vakken'), where('id', '==', DUMMY_VAK_ID))
    );
    return docSnapshot.size > 0;
  } catch (error) {
    console.error('Error checking dummy data:', error);
    return false;
  }
}
