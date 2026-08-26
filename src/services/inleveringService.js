/**
 * Inleveringen in Firebase Storage.
 *
 * Pad: inleveringen/{uid}/{blockId}/{timestamp}-{bestandsnaam}
 * De storage.rules staan al live: de eigenaar mag create/update/delete,
 * beheer mag lezen. De beslisregels (mag dit bestand, mag vervangen) staan
 * puur in src/lib/inleveringUtils.js.
 */

import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';
import { buildInleveringStoragePath } from '../lib/inleveringUtils';

/**
 * Upload één inleverbestand en lever het `inlevering`-veld voor het
 * voortgangsrecord op. Een eerder bestand wordt daarna pas opgeruimd
 * (eerst het nieuwe veiligstellen, dan het oude weggooien).
 *
 * @param {Object} params
 * @param {string} params.uid - Eigenaar (Firebase uid)
 * @param {string} params.blockId - Lesblok waar de opdracht bij hoort
 * @param {File|Blob} params.file - Het gekozen bestand
 * @param {string} [params.vorigeStoragePath] - Pad van de vorige inlevering
 * @returns {Promise<{bestandsnaam: string, url: string, storagePath: string, ingeleverdOpMs: number}>}
 */
export const uploadInlevering = async ({ uid, blockId, file, vorigeStoragePath = '' }) => {
  if (!uid || !blockId || !file) {
    throw new Error('uid, blockId en file zijn verplicht');
  }

  const nuMs = Date.now();
  const bestandsnaam = String(file.name || 'inlevering');
  const storagePath = buildInleveringStoragePath({ uid, blockId, bestandsnaam, nuMs });
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file, {
    contentType: file.type || 'application/octet-stream'
  });
  const url = await getDownloadURL(storageRef);

  // Het oude bestand mag pas weg als het nieuwe er echt staat. Mislukt het
  // opruimen, dan is dat een weesbestand, geen kapotte inlevering.
  if (vorigeStoragePath && vorigeStoragePath !== storagePath) {
    await verwijderInleverBestand(vorigeStoragePath);
  }

  return {
    bestandsnaam,
    url,
    storagePath,
    ingeleverdOpMs: nuMs
  };
};

/** Verwijder een inleverbestand; een al verdwenen bestand is geen fout. */
export const verwijderInleverBestand = async (storagePath) => {
  if (!storagePath) return;

  try {
    await deleteObject(ref(storage, storagePath));
  } catch (error) {
    console.warn(`Inleverbestand kon niet worden verwijderd (${storagePath}):`, error?.message || error);
  }
};

export default {
  uploadInlevering,
  verwijderInleverBestand
};
