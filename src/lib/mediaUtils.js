export const MEDIA_KINDS = {
  IMAGE: 'image',
  YOUTUBE: 'youtube',
  VIDEO: 'video',
  PDF: 'pdf',
  LINK: 'link'
};

export const MEDIA_KIND_LABELS = {
  [MEDIA_KINDS.IMAGE]: 'Afbeelding',
  [MEDIA_KINDS.YOUTUBE]: 'YouTube',
  [MEDIA_KINDS.VIDEO]: 'Video',
  [MEDIA_KINDS.PDF]: 'PDF',
  [MEDIA_KINDS.LINK]: 'Link'
};

const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const videoTypes = new Set([
  'video/mp4',
  'video/m4v',
  'video/webm',
  'video/ogg',
  'video/ogv',
  'video/quicktime'
]);

const getExtension = (value = '') => {
  const clean = String(value || '').split('?')[0].split('#')[0].toLowerCase();
  const match = clean.match(/\.([a-z0-9]+)$/);
  return match?.[1] || '';
};

export const inferMediaKind = ({ mediaKind, contentType, url } = {}) => {
  if (Object.values(MEDIA_KINDS).includes(mediaKind)) return mediaKind;

  const type = String(contentType || '').toLowerCase();
  if (type.startsWith('image/')) return MEDIA_KINDS.IMAGE;
  if (type.startsWith('video/')) return MEDIA_KINDS.VIDEO;
  if (type === 'application/pdf') return MEDIA_KINDS.PDF;

  const parsedYoutube = parseYouTubeUrl(url);
  if (parsedYoutube) return MEDIA_KINDS.YOUTUBE;

  const extension = getExtension(url);
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) return MEDIA_KINDS.IMAGE;
  if (['mp4', 'webm', 'ogg', 'ogv', 'mov', 'm4v'].includes(extension)) return MEDIA_KINDS.VIDEO;
  if (extension === 'pdf') return MEDIA_KINDS.PDF;

  return url ? MEDIA_KINDS.LINK : MEDIA_KINDS.IMAGE;
};

export const getMediaKindFromFile = (file = {}) => {
  const type = file.type || '';
  if (imageTypes.has(type)) return MEDIA_KINDS.IMAGE;
  if (videoTypes.has(type)) return MEDIA_KINDS.VIDEO;
  if (type === 'application/pdf') return MEDIA_KINDS.PDF;

  const extension = getExtension(file.name || '');
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) return MEDIA_KINDS.IMAGE;
  if (['mp4', 'webm', 'ogg', 'ogv', 'mov', 'm4v'].includes(extension)) return MEDIA_KINDS.VIDEO;
  if (extension === 'pdf') return MEDIA_KINDS.PDF;

  return '';
};

export const isSupportedMediaFile = (file = {}, mediaKind = '') => {
  const detectedKind = getMediaKindFromFile(file);
  if (!detectedKind) return false;
  return mediaKind ? detectedKind === mediaKind : true;
};

export const normalizeMediaContent = (content = {}) => {
  const legacyUrl =
    content.mediaUrl ||
    content.imageUrl ||
    content.videoUrl ||
    content.pdfUrl ||
    content.fileUrl ||
    content.downloadURL ||
    content.url ||
    '';
  const mediaKind = inferMediaKind({
    mediaKind: content.mediaKind,
    contentType: content.contentType,
    url: legacyUrl
  });

  return {
    mediaKind,
    mediaUrl: legacyUrl,
    storagePath: content.storagePath || content.mediaStoragePath || '',
    fileName: content.fileName || '',
    contentType: content.contentType || '',
    size: content.size || 0,
    caption: content.caption || '',
    altText: content.altText || '',
    thumbnailUrl: content.thumbnailUrl || '',
    html: content.html || '',
    crops: Array.isArray(content.crops) ? content.crops : []
  };
};

export const parseYouTubeUrl = (value = '') => {
  const raw = String(value || '').trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id ? { id, embedUrl: `https://www.youtube.com/embed/${id}` } : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname.startsWith('/watch')) {
        const id = url.searchParams.get('v');
        return id ? { id, embedUrl: `https://www.youtube.com/embed/${id}` } : null;
      }

      if (url.pathname.startsWith('/embed/') || url.pathname.startsWith('/shorts/')) {
        const id = url.pathname.split('/').filter(Boolean)[1];
        return id ? { id, embedUrl: `https://www.youtube.com/embed/${id}` } : null;
      }
    }
  } catch {
    return null;
  }

  return null;
};

export const buildMediaFromUpload = (upload, file, mediaKind) => ({
  mediaKind,
  mediaUrl: upload.mediaUrl || upload.downloadURL || '',
  videoUrl: mediaKind === MEDIA_KINDS.VIDEO ? upload.videoUrl || upload.downloadURL || '' : '',
  imageUrl: mediaKind === MEDIA_KINDS.IMAGE ? upload.imageUrl || upload.downloadURL || '' : '',
  pdfUrl: mediaKind === MEDIA_KINDS.PDF ? upload.pdfUrl || upload.downloadURL || '' : '',
  storagePath: upload.storagePath,
  fileName: file.name || MEDIA_KIND_LABELS[mediaKind],
  contentType: file.type || '',
  size: file.size || 0
});
