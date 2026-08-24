// Pointer-afweging voor het Presenter-bord.
//
// Eén plek waar pen, vinger, muis en handpalm worden gewogen — en dus voor
// tekenen, gummen én selecteren op precies dezelfde manier. Dat is geen
// schoonheidsfoutje: een docent die met de gum over het bord veegt laat bijna
// altijd zijn hand rusten, en zonder deze afweging wist die handpalm mee.
//
// Puur rekenwerk op de eigenschappen van een pointer-event; geen DOM, geen
// state. Zo is de afweging los te testen.

const isFiniteNumber = (value) => Number.isFinite(value);
const isValidPoint = (point) => isFiniteNumber(point?.x) && isFiniteNumber(point?.y);

// Een contactvlak (event.width/height, in CSS-pixels) zo groot als dit is geen
// vingertop maar een muis van een hand. Vingers melden op touchschermen
// doorgaans 15-35 px; schermen die niets weten melden 1x1 en vallen dus nooit
// per ongeluk af.
export const PRESENTER_PALM_CONTACT_PX = 55;

// Nawerktijd: zolang de pen zo kort geleden nog gezien is, is elke aanraking
// verdacht. De hand die de pen vasthoudt landt namelijk vlak voor of vlak na
// de punt op het bord.
export const PRESENTER_PEN_HOLD_OFF_MS = 700;

// Kleiner dan dit (boardunits) voegt een nieuw sample niets toe aan de streek;
// het houdt de puntenlijst kort zonder dat de haal hoekig wordt.
export const PRESENTER_MIN_SAMPLE_DISTANCE = 1;

export const isPalmContact = ({ pointerType, width, height, maxContactPx = PRESENTER_PALM_CONTACT_PX } = {}) => {
  if (pointerType !== 'touch') return false;

  const contactWidth = isFiniteNumber(width) ? width : 0;
  const contactHeight = isFiniteNumber(height) ? height : 0;

  return Math.max(contactWidth, contactHeight) >= maxContactPx;
};

export const isWithinPenHoldOff = ({ lastPenAt, now, holdOffMs = PRESENTER_PEN_HOLD_OFF_MS } = {}) => {
  if (!isFiniteNumber(lastPenAt) || !isFiniteNumber(now) || !isFiniteNumber(holdOffMs) || holdOffMs <= 0) {
    return false;
  }

  const elapsed = now - lastPenAt;
  return elapsed >= 0 && elapsed < holdOffMs;
};

const deny = (reason) => ({ intent: 'ignore', cancelActiveStroke: false, reason });

// Bepaalt wat een neerkomende pointer mag doen: 'ignore', 'erase', 'select',
// 'draw' of 'pan'. `cancelActiveStroke` geeft aan dat de streek die nu loopt
// eerst weggegooid moet worden (tweede vinger, of een pen die het overneemt
// van een vinger).
export const resolvePointerIntent = ({
  pointerType = 'mouse',
  pointerWidth,
  pointerHeight,
  button = 0,
  toolId = 'draw',
  canDraw = true,
  allowFingerDrawing = true,
  activeStrokePointerType = null,
  touchPanActive = false,
  lastPenAt = null,
  now = null,
  penHoldOffMs = PRESENTER_PEN_HOLD_OFF_MS,
  maxContactPx = PRESENTER_PALM_CONTACT_PX
} = {}) => {
  if (isFiniteNumber(button) && button !== 0) return deny('secondary-button');

  const type = typeof pointerType === 'string' && pointerType ? pointerType : 'mouse';

  // Deze drie weigeringen gelden vóór de gereedschapskeuze en dus voor pen,
  // gum en selectie tegelijk.
  if (type === 'touch') {
    if (isPalmContact({ pointerType: type, width: pointerWidth, height: pointerHeight, maxContactPx })) {
      return deny('palm');
    }
    if (activeStrokePointerType === 'pen') return deny('pen-active');
    if (isWithinPenHoldOff({ lastPenAt, now, holdOffMs: penHoldOffMs })) return deny('pen-hold-off');
  }

  if (toolId === 'eraser') return { intent: 'erase', cancelActiveStroke: false, reason: 'eraser' };
  if (toolId === 'select') return { intent: 'select', cancelActiveStroke: false, reason: 'select' };
  if (!canDraw) return deny('no-draw-handler');

  if (type === 'touch') {
    // Tweede vinger tijdens tekenen: streek annuleren en overschakelen op pan.
    if (activeStrokePointerType === 'touch') {
      return { intent: 'pan', cancelActiveStroke: true, reason: 'second-finger' };
    }
    if (touchPanActive) return { intent: 'pan', cancelActiveStroke: false, reason: 'pan-active' };
    if (!allowFingerDrawing) return { intent: 'pan', cancelActiveStroke: false, reason: 'finger-drawing-off' };

    return { intent: 'draw', cancelActiveStroke: false, reason: 'finger' };
  }

  if (type === 'pen') {
    return { intent: 'draw', cancelActiveStroke: activeStrokePointerType === 'touch', reason: 'pen' };
  }

  return { intent: 'draw', cancelActiveStroke: false, reason: 'mouse' };
};

// Alle tussenliggende samples van één pointermove. Pennen rapporteren vaak
// sneller dan het scherm verversen kan; zonder deze events mist een snelle
// haal zijn tussenpunten en wordt hij hoekig.
export const getCoalescedPointerSamples = (event) => {
  const native = event?.nativeEvent || event;
  if (!native) return [];

  let coalesced = null;
  try {
    if (typeof native.getCoalescedEvents === 'function') {
      coalesced = native.getCoalescedEvents();
    }
  } catch {
    coalesced = null;
  }

  const samples = coalesced ? Array.from(coalesced) : [];
  return samples.length > 0 ? samples : [native];
};

// Voegt een sample toe, tenzij het praktisch op het vorige punt ligt.
// Geeft dezelfde array terug wanneer er niets verandert, zodat de aanroeper
// een overbodige hertekening kan overslaan.
export const appendStrokePoint = (points, point, minDistance = PRESENTER_MIN_SAMPLE_DISTANCE) => {
  const list = Array.isArray(points) ? points : [];
  if (!isValidPoint(point)) return list;

  const last = list[list.length - 1];
  const gap = isFiniteNumber(minDistance) && minDistance > 0 ? minDistance : 0;
  if (last && Math.hypot(point.x - last.x, point.y - last.y) < gap) return list;

  return [...list, point];
};
