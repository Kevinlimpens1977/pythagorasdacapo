import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';
import { getMediaKindFromFile } from '../lib/mediaUtils';

const sanitizeFileName = (name = 'media') =>
  String(name)
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);

export const buildMediaAssetPath = (blockId, file) => {
  if (!blockId) throw new Error('blockId is verplicht voor media upload.');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const safeName = sanitizeFileName(file?.name || 'media');
  return `mediaBlocks/${blockId}/${timestamp}-${safeName}`;
};

export const uploadMediaAsset = async (blockId, file, userId = 'unknown-admin') => {
  const mediaKind = getMediaKindFromFile(file);
  if (!mediaKind) {
    throw new Error('Dit bestandstype wordt niet ondersteund. Gebruik afbeelding, video of PDF.');
  }

  const storagePath = buildMediaAssetPath(blockId, file);
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file, {
    contentType: file.type || 'application/octet-stream',
    cacheControl: 'public, max-age=86400',
    customMetadata: {
      uploadedBy: userId
    }
  });

  const downloadURL = await getDownloadURL(storageRef);
  return {
    mediaKind,
    storagePath,
    downloadURL,
    mediaUrl: downloadURL,
    videoUrl: mediaKind === 'video' ? downloadURL : '',
    imageUrl: mediaKind === 'image' ? downloadURL : '',
    pdfUrl: mediaKind === 'pdf' ? downloadURL : '',
    uploadedAt: new Date().toISOString()
  };
};

export default {
  buildMediaAssetPath,
  uploadMediaAsset
};
