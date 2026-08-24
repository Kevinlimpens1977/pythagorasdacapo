// Bedieningslogica voor media op het digibord. Pure functies, zodat het
// spring-, klem- en weergavegedrag in src/lib getest kan worden zonder DOM.

import { MEDIA_KINDS } from './mediaUtils.js';

export const BOARD_MEDIA_SEEK_SECONDS = 10;

export const BOARD_MEDIA_MODES = {
  EMPTY: 'empty',
  VIDEO: 'video',
  EMBED: 'embed',
  IMAGE: 'image',
  PDF: 'pdf',
  LINK: 'link'
};

export const getBoardMediaMode = (mediaKind, mediaUrl) => {
  if (!mediaUrl) return BOARD_MEDIA_MODES.EMPTY;
  if (mediaKind === MEDIA_KINDS.VIDEO) return BOARD_MEDIA_MODES.VIDEO;
  if (mediaKind === MEDIA_KINDS.YOUTUBE) return BOARD_MEDIA_MODES.EMBED;
  if (mediaKind === MEDIA_KINDS.PDF) return BOARD_MEDIA_MODES.PDF;
  if (mediaKind === MEDIA_KINDS.LINK) return BOARD_MEDIA_MODES.LINK;
  return BOARD_MEDIA_MODES.IMAGE;
};

export const getSeekTarget = (currentTime, delta, duration) => {
  const start = Number.isFinite(Number(currentTime)) ? Number(currentTime) : 0;
  const step = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const next = start + step;
  if (next < 0) return 0;

  const total = Number(duration);
  if (Number.isFinite(total) && total > 0 && next > total) return total;
  return next;
};

export const formatMediaTime = (seconds) => {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value < 0) return '0:00';

  const whole = Math.floor(value);
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
};

// Bij het openen van de grote weergave krijgt de video een nieuw element.
// Deze functie bewaart de kijkpositie, zodat de klas niet opnieuw begint.
export const buildPlaybackHandoff = (element) => ({
  currentTime: Number.isFinite(Number(element?.currentTime)) ? Number(element.currentTime) : 0,
  wasPlaying: Boolean(element && element.paused === false),
  muted: Boolean(element?.muted)
});
