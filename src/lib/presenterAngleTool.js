// Hoekconstructie met de geodriehoek.
//
// De docent bouwt een hoek in twee handelingen:
//  1. een been vanaf het hoekpunt langs de basislijn, naar rechts of naar links;
//  2. een aantal graden, aangetikt op de schaalverdeling of ingetypt bij het
//     hoekpunt. Daaruit volgt het tweede been, een boogje in de hoek en het
//     aantal graden klein bij dat boogje.
//
// Alles hier is pure rekenwerk zonder React: van een klikpunt naar graden, van
// graden naar twee beenrichtingen, en van daaruit naar de maten van een
// hoekobject waarvan het hoekpunt precies op het draaipunt van de geodriehoek
// landt.
//
// Hoekconventies (dezelfde als in de rest van het Presenter-bord):
// - "boardgraden" lopen MET de klok mee, want de y-as van het bord wijst omlaag
//   en `rotate()` in SVG draait dezelfde kant op;
// - de hoekmaat zelf loopt TEGEN de klok in vanaf het eerste been, net als de
//   schaalverdeling van de geodriehoek (0 rechts, 180 links).
// Een been op boardrichting `base` en een hoek van `size` geeft dus een tweede
// been op boardrichting `base - size`.

import { getScaleLabelBox, segmentHitsBox } from './presenterInstruments.js';

const isFiniteNumber = (value) => Number.isFinite(value);
const round2 = (value) => Math.round(value * 100) / 100;
const clampNumber = (value, min, max) => (max < min ? min : Math.min(Math.max(value, min), max));
const toRadians = (degrees) => (degrees * Math.PI) / 180;

export const ANGLE_MIN_DEGREES = 0;
export const ANGLE_MAX_DEGREES = 360;

// Beenlengte van een nieuwe hoek, in boardunits bij maatfactor 1. Ruim buiten de
// cijferring van de geodriehoek (straal 124) en ruim binnen de basislijn
// (halve lengte 308), zodat de hoek naast het instrument zichtbaar blijft.
export const ANGLE_LEG_BASE_LENGTH = 240;

// Het gradenlabel gebruikt dezelfde letter als de tekstobjecten op het bord, en
// wordt op beide plekken (preview op het instrument, definitieve hoek op het
// bord) met exact dezelfde maat getekend.
export const ANGLE_LABEL_FONT_STACK = 'Sora, Inter, system-ui, sans-serif';

// Verhoudingen van het boogje en het label ten opzichte van de beenlengte.
export const ANGLE_MARKER = {
  // Het boogje zit dicht bij het hoekpunt: klein genoeg om binnen de vrije
  // binnenring van de geodriehoek te vallen, groot genoeg om vanaf vier meter
  // als boogje te lezen.
  arcRatio: 0.26,
  minArcRadius: 12,
  maxArcRadius: 96,
  // Het rechte-hoekteken: een vierkantje in plaats van een boogje bij precies
  // 90 graden, zoals dat in de wiskunde hoort.
  rightAngleRatio: 0.78,
  // Het label is klein ten opzichte van een tekstobject (48), maar op een
  // digibord vanaf vier meter nog leesbaar.
  labelRatio: 0.14,
  minLabelFontSize: 20,
  maxLabelFontSize: 34,
  // Hoeveel lucht het label minimaal om zich heen houdt, en in welke stappen
  // het naar buiten schuift zolang het nog een been raakt.
  labelClearanceRatio: 0.3,
  labelStepRatio: 0.4,
  labelMaxSteps: 48
};

export const normalizeAngleDegrees = (value) => {
  const degrees = isFiniteNumber(value) ? value : 0;
  return ((degrees % 360) + 360) % 360;
};

// Hele graden, 0 tot en met 360. Geeft null terug bij onzin, zodat aanroepers
// het verschil zien tussen "niets gekozen" en "nul graden".
export const clampAngleDegrees = (value) => {
  if (!isFiniteNumber(value)) return null;
  return clampNumber(Math.round(value), ANGLE_MIN_DEGREES, ANGLE_MAX_DEGREES);
};

// Wat de docent intypt bij het hoekpunt. Alleen 0 tot en met 360 wordt
// geaccepteerd; alles daarbuiten (en alles wat geen getal is) geeft null, zodat
// het veld kan laten zien dat er niets mee gedaan is.
export const parseAngleInput = (value) => {
  if (typeof value === 'number') return clampAngleDegrees(value);

  const text = String(value ?? '')
    .trim()
    .replace(/°/g, '')
    .replace(',', '.')
    .trim();
  if (!/^\d+(\.\d+)?$/.test(text)) return null;

  const rounded = Math.round(Number(text));
  if (!isFiniteNumber(rounded) || rounded < ANGLE_MIN_DEGREES || rounded > ANGLE_MAX_DEGREES) return null;

  return rounded;
};

export const formatAngleDegrees = (degrees) => `${clampAngleDegrees(degrees) ?? 0}°`;

// Beenlengte bij de huidige maat van het instrument: een kleinere geodriehoek
// tekent een kleinere hoek, zodat boogje en label in dezelfde verhouding op het
// instrument blijven vallen.
export const getAngleLegLength = (sizeScale = 1) => {
  const scale = isFiniteNumber(sizeScale) && sizeScale > 0 ? sizeScale : 1;
  return round2(ANGLE_LEG_BASE_LENGTH * scale);
};

// Een tik op de schaalverdeling wijst een richting aan; de hoek wordt gemeten
// vanaf het gekozen eerste been. Ligt dat been naar links (op de 180), dan is de
// hoek bij aflezing `reading` dus 180 - reading.
export const getAngleDegreesFromReading = (reading, legDirection = 'right') => {
  if (!isFiniteNumber(reading)) return null;

  const clamped = clampNumber(Math.round(reading), 0, 180);
  return legDirection === 'left' ? 180 - clamped : clamped;
};

// De twee beenrichtingen in boardgraden (met de klok mee), gegeven de rotatie
// van de geodriehoek, de gekozen kant en de hoekmaat.
//
// `first` is het been langs de basislijn, `second` het been dat uit de hoekmaat
// volgt. De hoek opent ALTIJD naar de kant waar het lichaam van de geodriehoek
// ligt (boven de basislijn), ook als het eerste been naar links wijst: een
// hoek die onder de basislijn wegduikt, verdwijnt onder het instrument en is
// niet wat de docent aanwijst op de schaal.
export const getAngleLegDirections = ({ instrumentRotation = 0, legDirection = 'right', degrees = 0 } = {}) => {
  const toLeft = legDirection === 'left';
  const base = normalizeAngleDegrees(
    (isFiniteNumber(instrumentRotation) ? instrumentRotation : 0) + (toLeft ? 180 : 0)
  );
  const size = clampAngleDegrees(degrees) ?? 0;

  return {
    size,
    legDirection: toLeft ? 'left' : 'right',
    first: round2(base),
    second: round2(normalizeAngleDegrees(toLeft ? base + size : base - size))
  };
};

const rotateVector = (vector, degrees) => {
  const radians = toRadians(isFiniteNumber(degrees) ? degrees : 0);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return { x: vector.x * cos - vector.y * sin, y: vector.x * sin + vector.y * cos };
};

const buildAngleMarker = ({ originX, originY, arcRadius, degrees }) => {
  if (degrees <= 0) return { kind: 'none', d: '', reach: 0 };

  if (degrees >= 360) {
    // Een volledige cirkel kan niet in één A-segment: begin- en eindpunt zouden
    // samenvallen en dan slaat SVG het segment over.
    const left = round2(originX - arcRadius);
    const right = round2(originX + arcRadius);
    return {
      kind: 'full',
      reach: arcRadius,
      d: `M ${right} ${round2(originY)} A ${arcRadius} ${arcRadius} 0 1 0 ${left} ${round2(originY)} A ${arcRadius} ${arcRadius} 0 1 0 ${right} ${round2(originY)}`
    };
  }

  if (degrees === 90) {
    const side = round2(arcRadius * ANGLE_MARKER.rightAngleRatio);
    return {
      kind: 'right',
      reach: round2(side * Math.SQRT2),
      d: `M ${round2(originX + side)} ${round2(originY)} L ${round2(originX + side)} ${round2(originY - side)} L ${round2(originX)} ${round2(originY - side)}`
    };
  }

  const radians = toRadians(degrees);
  const startX = round2(originX + arcRadius);
  const startY = round2(originY);
  const endX = round2(originX + Math.cos(radians) * arcRadius);
  const endY = round2(originY - Math.sin(radians) * arcRadius);
  // Boven de 180 graden is het boogje de grote boog: die ligt automatisch aan de
  // buitenkant, precies aan de kant van de hoek die bedoeld is.
  const largeArcFlag = degrees > 180 ? 1 : 0;

  return {
    kind: 'arc',
    reach: arcRadius,
    d: `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 0 ${endX} ${endY}`
  };
};

// Het label staat op de deellijn van de hoek, net buiten het boogje: daar is de
// afstand tot beide benen het grootst. Bij een scherpe hoek is dat nog niet
// genoeg, en schuift het label naar buiten tot zijn inktdoos geen been meer
// raakt - dezelfde meting waarmee de schaalcijfers van de instrumenten op
// leesbaarheid worden gecontroleerd.
const buildAngleLabel = ({ originX, originY, degrees, fontSize, markerReach, legs }) => {
  const text = `${degrees}°`;
  const clearance = Math.max(4, fontSize * ANGLE_MARKER.labelClearanceRatio);
  const step = Math.max(2, fontSize * ANGLE_MARKER.labelStepRatio);

  // Bij 0 graden vallen de benen samen: dan is er geen deellijn om op uit te
  // wijken en gaat het label naast het been staan.
  if (degrees <= 0) {
    const x = round2(originX + markerReach + clearance + fontSize);
    const y = round2(originY - clearance - fontSize * 0.5);
    return { text, fontSize: round2(fontSize), x, y, distance: 0, box: getScaleLabelBox({ text, x, y, fontSize }) };
  }

  const bisector = toRadians(degrees / 2);
  const cos = Math.cos(bisector);
  const sin = Math.sin(bisector);
  let distance = markerReach + clearance + fontSize * 0.5;
  let x = originX + cos * distance;
  let y = originY - sin * distance;
  let box = getScaleLabelBox({ text, x, y, fontSize });

  for (let attempt = 0; attempt < ANGLE_MARKER.labelMaxSteps; attempt += 1) {
    if (!legs.some((leg) => segmentHitsBox(leg, box, clearance))) break;

    distance += step;
    x = originX + cos * distance;
    y = originY - sin * distance;
    box = getScaleLabelBox({ text, x, y, fontSize });
  }

  return { text, fontSize: round2(fontSize), x: round2(x), y: round2(y), distance: round2(distance), box };
};

// De hele meetkunde van een hoekobject in zijn eigen kader (linksboven = 0,0).
// Het hoekpunt ligt op (beenlengte, hoogte); het eerste been loopt langs +x en
// het tweede been draait daar tegen de klok in vandaan.
export const getAngleFrameGeometry = ({ width, height, angleDegrees } = {}) => {
  const degrees = clampAngleDegrees(angleDegrees) ?? 90;
  const frameWidth = Math.abs(isFiniteNumber(width) ? width : 0);
  const frameHeight = Math.abs(isFiniteNumber(height) ? height : 0);
  const legLength = Math.max(1, Math.min(frameWidth / 2, frameHeight));
  const originX = round2(legLength);
  const originY = round2(isFiniteNumber(height) ? height : 0);
  const radians = toRadians(degrees);

  const leg1End = { x: round2(originX + legLength), y: originY };
  const leg2End = {
    x: round2(originX + Math.cos(radians) * legLength),
    y: round2(originY - Math.sin(radians) * legLength)
  };
  const legs = [
    { x1: originX, y1: originY, x2: leg1End.x, y2: leg1End.y },
    { x1: originX, y1: originY, x2: leg2End.x, y2: leg2End.y }
  ];

  const arcRadius = round2(
    clampNumber(legLength * ANGLE_MARKER.arcRatio, ANGLE_MARKER.minArcRadius, Math.min(ANGLE_MARKER.maxArcRadius, legLength * 0.9))
  );
  const fontSize = clampNumber(
    legLength * ANGLE_MARKER.labelRatio,
    ANGLE_MARKER.minLabelFontSize,
    ANGLE_MARKER.maxLabelFontSize
  );

  const marker = buildAngleMarker({ originX, originY, arcRadius, degrees });
  const label = buildAngleLabel({ originX, originY, degrees, fontSize, markerReach: marker.reach, legs });

  return {
    angleDegrees: degrees,
    legLength: round2(legLength),
    originX,
    originY,
    arcRadius,
    leg1End,
    leg2End,
    legs,
    marker,
    label
  };
};

// Kadermaten van een nieuwe hoek: twee keer de beenlengte breed en één keer
// hoog, zodat het hoekpunt onderaan in het midden ligt en getAngleFrameGeometry
// precies deze beenlengte teruggeeft.
export const getAngleObjectFrame = (legLength = ANGLE_LEG_BASE_LENGTH) => {
  const length = Math.max(1, isFiniteNumber(legLength) ? legLength : ANGLE_LEG_BASE_LENGTH);
  return { width: round2(length * 2), height: round2(length) };
};

// Waar een lokaal punt van het hoekobject op het bord terechtkomt. Dit is exact
// dezelfde afbeelding als de transform in PresenterObjectLayer
// (`translate(x y) rotate(rotation centerX centerY)`), zodat de preview op het
// instrument en de geplaatste hoek gegarandeerd samenvallen.
export const getAngleObjectBoardPoint = (point, placement) => {
  if (!point || !placement) return null;

  const centerX = placement.width / 2;
  const centerY = placement.height / 2;
  const rotated = rotateVector({ x: point.x - centerX, y: point.y - centerY }, placement.rotation);

  return { x: round2(placement.x + centerX + rotated.x), y: round2(placement.y + centerY + rotated.y) };
};

// Plaats een hoekobject zo dat zijn hoekpunt precies op het draaipunt van de
// geodriehoek valt en het eerste been langs de basislijn ligt.
//
// Het object draait om het MIDDEN van zijn kader, niet om zijn hoekpunt; de
// verschuiving hieronder rekent dat verschil terug.
export const planAngleObjectPlacement = ({
  pivot,
  instrumentRotation = 0,
  legDirection = 'right',
  degrees = 0,
  legLength = ANGLE_LEG_BASE_LENGTH
} = {}) => {
  if (!pivot || !isFiniteNumber(pivot.x) || !isFiniteNumber(pivot.y)) return null;

  const angleDegrees = clampAngleDegrees(degrees);
  if (angleDegrees === null) return null;

  const length = Math.max(1, isFiniteNumber(legLength) ? legLength : ANGLE_LEG_BASE_LENGTH);
  const { width, height } = getAngleObjectFrame(length);
  // Het hoekobject opent altijd tegen de klok in vanaf zijn eigen eerste been.
  // Bij een been naar links moet de hoek de andere kant op openen (naar boven,
  // waar het instrument ligt); dat lukt zonder spiegeling door het object zo te
  // draaien dat zijn TWEEDE been langs de basislijn valt. Beide benen worden
  // hetzelfde getekend, dus welke van de twee "de eerste" heet is alleen
  // rekenwerk.
  const rotation = round2(
    normalizeAngleDegrees(
      (isFiniteNumber(instrumentRotation) ? instrumentRotation : 0) +
        (legDirection === 'left' ? 180 + angleDegrees : 0)
    )
  );

  const centerX = width / 2;
  const centerY = height / 2;
  const rotated = rotateVector({ x: length - centerX, y: height - centerY }, rotation);

  return {
    x: round2(pivot.x - centerX - rotated.x),
    y: round2(pivot.y - centerY - rotated.y),
    width,
    height,
    rotation,
    angleDegrees
  };
};

// Was dit een tik of een sleep? De geodriehoek moet ook aan de schaalverdeling
// versleepbaar blijven, dus een pointer die te ver of te lang onderweg was telt
// niet als het aanwijzen van een aantal graden.
export const ANGLE_TAP_SLOP_PX = 8;
export const ANGLE_TAP_MAX_MS = 700;

export const isInstrumentTap = ({
  startClient,
  client,
  startTime = 0,
  time = 0,
  slop = ANGLE_TAP_SLOP_PX,
  maxDurationMs = ANGLE_TAP_MAX_MS
} = {}) => {
  if (!startClient || !client) return false;
  if (!isFiniteNumber(startClient.x) || !isFiniteNumber(startClient.y)) return false;
  if (!isFiniteNumber(client.x) || !isFiniteNumber(client.y)) return false;

  const moved = Math.hypot(client.x - startClient.x, client.y - startClient.y);
  if (moved > slop) return false;

  const elapsed = (isFiniteNumber(time) ? time : 0) - (isFiniteNumber(startTime) ? startTime : 0);
  return elapsed >= 0 && elapsed <= maxDurationMs;
};
