import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Circle, Move, Palette, RotateCw, X } from 'lucide-react';
import { getPointerRotationDegrees, snapRotationDegrees } from '../../lib/presenterGeometry';
import {
  buildProtractorScale,
  buildRulerTicks,
  buildTriangleMoveArea,
  buildTriangleScale,
  buildTriangleScaleBand,
  formatProtractorReading,
  formatRulerLength,
  getInstrumentAngleLabel,
  getInstrumentControlBarWidthPx,
  getInstrumentMetrics,
  getInstrumentPivot,
  getInstrumentSizeScale,
  getProtractorReadingFromPoint,
  PRESENTER_INSTRUMENT_CHROME_PX,
  PRESENTER_INSTRUMENT_DEFS,
  PROTRACTOR_LABEL_FONT_SIZE
} from '../../lib/presenterInstruments';
import {
  clampAngleDegrees,
  formatAngleDegrees,
  getAngleDegreesFromReading,
  getAngleFrameGeometry,
  getAngleLegLength,
  isInstrumentTap,
  parseAngleInput,
  planAngleObjectPlacement
} from '../../lib/presenterAngleTool';
import PresenterAngleShape from './PresenterAngleShape';
import {
  advanceCompassSweep,
  buildCompassArcPoints,
  buildCompassCirclePoints,
  formatCompassRadius,
  getCompassGeometry,
  getCompassPointerAngle,
  snapCompassRadius
} from '../../lib/presenterCompass';

// Meetinstrumenten als echte bordobjecten: sleepbaar, roteerbaar en met een
// tekenrand waar de pen op vastklikt (edge-snap zit in PresenterBoard). Elk
// instrument is getekend als voorwerp (materiaal, verloop, schaduw) en heeft
// een eigen zwevende knoppenrij die rechtop meebeweegt.
//
// Hitbox-afspraak: de instrument-wrapper staat op pointerEvents 'none'; alleen
// SVG-vormen met `data-instrument-grab` vangen pointers. Zo blijft er ruimte om
// langs de tekenrand en binnen het instrument gewoon te tekenen.

const FONT_STACK = "ui-sans-serif, system-ui, 'Segoe UI', Roboto, sans-serif";

const PEN_COLORS = [
  { label: 'Zwart', value: '#111827' },
  { label: 'Blauw', value: '#2563eb' },
  { label: 'Rood', value: '#dc2626' },
  { label: 'Groen', value: '#16a34a' },
  { label: 'Oranje', value: '#ea580c' },
  { label: 'Paars', value: '#7c3aed' }
];

const PEN_WIDTHS = [
  { label: 'Dun', value: 3 },
  { label: 'Normaal', value: 6 },
  { label: 'Dik', value: 10 },
  { label: 'Extra dik', value: 16 }
];

const clamp = (value, min, max) => (max < min ? min : Math.min(Math.max(value, min), max));

// Het gradenveldje hangt boven het hoekpunt: hoog genoeg om het rode
// dradenkruis, de middenlijn en de getekende benen vrij te laten, laag genoeg om
// nog "midden op de geodriehoek" te staan.
const ANGLE_FIELD_OFFSET_PX = 56;

const getNow = () =>
  typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : Date.now();

const rotatePoint = (point, pivot, degrees) => {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = point.x - pivot.x;
  const dy = point.y - pivot.y;

  return { x: pivot.x + dx * cos - dy * sin, y: pivot.y + dx * sin + dy * cos };
};

// Alles wat in de overlay een pointer opvangt moet die tegenhouden: de overlay
// hangt binnen de board-div, en die start bij elke pointerdown een penstreek.
const stopBoardPointer = (event) => event.stopPropagation();

const CONTROL_BUTTON_CLASS =
  'flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-blue-500 hover:text-blue-700 active:scale-95';

// Zwevende knoppenrij: staat altijd rechtop, beweegt mee met het instrument en
// wordt binnen het bord geklemd zodat hij nooit half wegvalt.
function InstrumentControlBar({
  anchor,
  bounds,
  instrumentId,
  label,
  badges = [],
  penStyle,
  onPenStyle,
  onClose,
  onMovePointerDown,
  onRotatePointerDown,
  onPointerMove,
  onPointerUp,
  extraButtons = null
}) {
  const [penOpen, setPenOpen] = useState(false);
  const penColor = penStyle?.color || '#111827';
  const penWidth = Number.isFinite(penStyle?.width) && penStyle.width > 0 ? penStyle.width : 6;

  // Zelfde breedte als getInstrumentControlBarWidthPx aanneemt; die maat zit in
  // de bounding box waarmee een instrument wordt ingepast.
  const estimatedWidth = getInstrumentControlBarWidthPx(instrumentId);
  const minTop = badges.length > 0 ? PRESENTER_INSTRUMENT_CHROME_PX.badgeHeight + 8 : 8;
  const left = clamp(anchor.x, estimatedWidth / 2 + 8, Math.max(estimatedWidth / 2 + 8, bounds.width - estimatedWidth / 2 - 8));
  const top = clamp(anchor.y, minTop, Math.max(minTop, bounds.height - 84));
  const openUpward = top > bounds.height - 260;

  return (
    <div
      className="absolute z-40 -translate-x-1/2"
      style={{ left: `${left}px`, top: `${top}px`, pointerEvents: 'none' }}
    >
      {badges.length > 0 ? (
        <div className="mb-1 flex justify-center gap-1.5">
          {badges.map((badge) => (
            <span
              key={badge.key}
              className="rounded-md bg-slate-950/85 px-2 py-0.5 text-sm font-black text-white shadow"
              style={{ pointerEvents: 'none' }}
            >
              {badge.text}
            </span>
          ))}
        </div>
      ) : null}

      {/* De knoppenrij hangt binnen het bord: zonder deze rem bubbelt een tik op
          een knop door naar de tekenlogica en zet die een stip op het bord. */}
      <div
        className="flex items-center gap-2 rounded-3xl border border-slate-300 bg-white/95 p-2 shadow-xl backdrop-blur"
        style={{ pointerEvents: 'auto' }}
        onPointerDown={stopBoardPointer}
      >
        <button
          type="button"
          aria-label={`${label} verplaatsen`}
          title="Sleep om te verplaatsen"
          className={`${CONTROL_BUTTON_CLASS} cursor-move touch-none`}
          onPointerDown={onMovePointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <Move size={24} />
        </button>

        {onPenStyle ? (
          <button
            type="button"
            aria-label="Penkleur en dikte"
            title="Penkleur en dikte kiezen"
            aria-expanded={penOpen}
            className={`${CONTROL_BUTTON_CLASS} relative`}
            onClick={() => setPenOpen((open) => !open)}
          >
            <Palette size={24} />
            <span
              className="absolute bottom-1.5 right-1.5 block rounded-full border border-white shadow"
              style={{
                backgroundColor: penColor,
                height: `${clamp(penWidth, 6, 14)}px`,
                width: `${clamp(penWidth, 6, 14)}px`
              }}
            />
          </button>
        ) : null}

        {extraButtons}

        {onRotatePointerDown ? (
          <button
            type="button"
            aria-label={`${label} roteren`}
            title="Sleep om te draaien (snapt op 15°)"
            className={`${CONTROL_BUTTON_CLASS} cursor-grab touch-none`}
            onPointerDown={onRotatePointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <RotateCw size={24} />
          </button>
        ) : null}

        <button
          type="button"
          aria-label={`${label} sluiten`}
          title="Instrument sluiten (of Esc)"
          className={`${CONTROL_BUTTON_CLASS} border-slate-400 text-slate-600 hover:border-red-500 hover:text-red-600`}
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </div>

      {penOpen && onPenStyle ? (
        <div
          className={`absolute left-1/2 w-64 -translate-x-1/2 rounded-2xl border border-slate-300 bg-white p-3 shadow-2xl ${
            openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          style={{ pointerEvents: 'auto' }}
          onPointerDown={stopBoardPointer}
        >
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Penkleur</p>
          <div className="mb-3 grid grid-cols-6 gap-1.5">
            {PEN_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                aria-label={color.label}
                title={color.label}
                className={`h-9 w-9 rounded-full border-2 shadow-sm ${
                  penColor === color.value ? 'border-slate-900 ring-2 ring-blue-400' : 'border-white'
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => onPenStyle({ id: 'pen', variant: 'pen', color: color.value })}
              />
            ))}
          </div>
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Dikte</p>
          <div className="flex items-center gap-2">
            {PEN_WIDTHS.map((width) => (
              <button
                key={width.value}
                type="button"
                aria-label={width.label}
                title={width.label}
                className={`flex h-10 flex-1 items-center justify-center rounded-xl border-2 ${
                  penWidth === width.value ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'
                }`}
                onClick={() => onPenStyle({ id: 'pen', variant: 'pen', width: width.value })}
              >
                <span
                  className="block rounded-full"
                  style={{
                    backgroundColor: penColor,
                    height: `${clamp(width.value, 3, 14)}px`,
                    width: `${clamp(width.value, 3, 14)}px`
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Liniaal: houten liniaal met geblokte rand, rode segmenten en een schaal die
// exact op het ruitjespapier past (1 eenheid = 1 ruitje).
// ---------------------------------------------------------------------------
// `gridSize` is hier de ruitjesmaat in lokale instrumentunits: de aanroeper
// deelt de echte ruitjesmaat door de maatfactor, zodat een kleinere liniaal nog
// steeds precies op het ruitjespapier past (alleen met minder cijfers erop).
const RulerVisual = ({ width, height, gridSize }) => {
  const { ticks, labels, unit } = buildRulerTicks({ length: width, gridSize });
  const bandHeight = 26;
  const redBandTop = bandHeight;
  const redBandHeight = 9;
  const tickTop = bandHeight + redBandHeight;
  const tickLength = { major: 52, mid: 34, minor: 20 };
  const labelBaseline = height - 12;
  const checkerCount = Math.ceil((width / unit) * 2);

  return (
    <svg aria-hidden="true" className="h-full w-full" viewBox={`0 0 ${width} ${height}`} style={{ pointerEvents: 'none', overflow: 'visible' }}>
      <defs>
        <linearGradient id="rulerWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdf0d0" />
          <stop offset="38%" stopColor="#f7d99b" />
          <stop offset="72%" stopColor="#eabb6b" />
          <stop offset="100%" stopColor="#d99f4c" />
        </linearGradient>
        <linearGradient id="rulerGloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="100%" stopColor="rgba(120,60,10,0.14)" />
        </linearGradient>
        <filter id="rulerShadow" x="-6%" y="-40%" width="112%" height="200%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#1f2937" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter="url(#rulerShadow)">
        <rect x="0" y="0" width={width} height={height} rx="12" fill="url(#rulerWood)" stroke="#8a5a1c" strokeWidth="3" />
      </g>
      <rect x="0" y="0" width={width} height={height} rx="12" fill="url(#rulerGloss)" />

      {/* houtnerf */}
      {[0.22, 0.44, 0.66, 0.86].map((ratio, index) => (
        <path
          key={`grain-${ratio}`}
          d={`M 6 ${height * ratio} Q ${width * 0.25} ${height * ratio - (index % 2 ? 5 : -5)} ${width * 0.5} ${height * ratio} T ${width - 6} ${height * ratio}`}
          fill="none"
          stroke="rgba(129,74,19,0.22)"
          strokeWidth="1.6"
        />
      ))}

      {/* zwart-wit geblokte rand langs de tekenrand */}
      <clipPath id="rulerBandClip">
        <rect x="0" y="0" width={width} height={bandHeight} rx="12" />
      </clipPath>
      <g clipPath="url(#rulerBandClip)">
        <rect x="0" y="0" width={width} height={bandHeight} fill="#f8fafc" />
        {Array.from({ length: checkerCount }).map((_, index) =>
          index % 2 === 0 ? (
            <rect key={`checker-${index}`} x={(index * unit) / 2} y="0" width={unit / 2} height={bandHeight} fill="#111827" />
          ) : null
        )}
      </g>
      <line x1="0" y1={bandHeight} x2={width} y2={bandHeight} stroke="#78350f" strokeWidth="2" />

      {/* rode segmentmarkeringen */}
      {labels.map((label) =>
        label.x + unit / 2 <= width ? (
          <rect
            key={`segment-${label.value}`}
            x={label.x}
            y={redBandTop + 1}
            width={unit / 2}
            height={redBandHeight - 2}
            fill="rgba(220,38,38,0.85)"
          />
        ) : null
      )}

      {/* maatstreepjes */}
      {ticks.map((tick) => (
        <line
          key={`tick-${tick.index}`}
          x1={tick.x}
          x2={tick.x}
          y1={tickTop}
          y2={tickTop + tickLength[tick.kind]}
          stroke={tick.kind === 'major' ? '#5b3a12' : '#7c5220'}
          strokeWidth={tick.kind === 'major' ? 3.4 : tick.kind === 'mid' ? 2.2 : 1.4}
          strokeLinecap="round"
        />
      ))}

      {/* grote leesbare cijfers */}
      {labels.map((label) => {
        if (label.value <= 0) return null;
        // Het laatste cijfer valt tegen de rand: dat schuift naar binnen.
        const nearEnd = label.x > width - 30;

        return (
          <text
            key={`label-${label.value}`}
            x={nearEnd ? width - 10 : label.x}
            y={labelBaseline}
            fill="#4a2f0d"
            fontFamily={FONT_STACK}
            fontSize="42"
            fontWeight="800"
            textAnchor={nearEnd ? 'end' : 'middle'}
          >
            {label.value}
          </text>
        );
      })}
      <text x="10" y={labelBaseline} fill="#7c5220" fontFamily={FONT_STACK} fontSize="26" fontWeight="800">
        0
      </text>

      {/* sleepvlak: laat de tekenrand bovenaan vrij voor de pen */}
      <rect
        data-instrument-grab="move"
        x="0"
        y={bandHeight}
        width={width}
        height={height - bandHeight}
        fill="transparent"
        style={{ cursor: 'move', pointerEvents: 'all' }}
      />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Geodriehoek: doorzichtig plastic met hoekschaal en maatverdeling op de basis.
// ---------------------------------------------------------------------------
const TriangleVisual = ({ width, height, gridSize }) => {
  const baseY = 330;
  const cx = width / 2;
  const apex = { x: cx, y: 26 };
  // Eén bron voor de hele schaal: hoekcijfers, boogstreepjes en de maatverdeling
  // langs de basis worden samen uitgerekend, zodat er gegarandeerd geen streepje
  // door een cijfer loopt (zie buildTriangleScale en de tests daarop).
  const { arcRadius, arcTicks, baseTicks, labels } = buildTriangleScale({ cx, baseY, gridSize });
  const moveArea = buildTriangleMoveArea({ width, baseY, apexY: apex.y });
  // Aanraakband over de hoekschaal: een tik leest een aantal graden af, een
  // sleep verplaatst gewoon. De band ligt binnen het sleepvlak, dus voor de pen
  // verandert er niets.
  const scaleBand = buildTriangleScaleBand({ cx, baseY });

  return (
    <svg aria-hidden="true" className="h-full w-full" viewBox={`0 0 ${width} ${height}`} style={{ pointerEvents: 'none', overflow: 'visible' }}>
      <defs>
        <linearGradient id="triangleBody" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="rgba(214,240,255,0.80)" />
          <stop offset="55%" stopColor="rgba(176,214,246,0.62)" />
          <stop offset="100%" stopColor="rgba(140,186,226,0.62)" />
        </linearGradient>
        <linearGradient id="triangleGloss" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.28)" />
        </linearGradient>
        <filter id="triangleShadow" x="-10%" y="-10%" width="120%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#0f172a" floodOpacity="0.32" />
        </filter>
      </defs>

      <g filter="url(#triangleShadow)">
        <path
          d={`M 12 ${baseY} L ${width - 12} ${baseY} L ${apex.x} ${apex.y} Z`}
          fill="url(#triangleBody)"
          stroke="#1e3a5f"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </g>
      <path d={`M 12 ${baseY} L ${width - 12} ${baseY} L ${apex.x} ${apex.y} Z`} fill="url(#triangleGloss)" />

      {/* hoekschaal rond het midden van de basis */}
      <path
        d={`M ${cx - arcRadius} ${baseY} A ${arcRadius} ${arcRadius} 0 0 1 ${cx + arcRadius} ${baseY}`}
        fill="none"
        stroke="rgba(15,23,42,0.55)"
        strokeWidth="2"
      />
      {arcTicks.map((tick) => (
        <line
          key={`angle-${tick.degrees}`}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          stroke="rgba(15,23,42,0.7)"
          strokeWidth={tick.major ? 2.6 : 1.4}
          strokeLinecap="round"
        />
      ))}
      {/* Hoekcijfers. 0 en 180 zouden op de basislijn tussen de maatstreepjes
          belanden; die staan daarom opgetild in de vrije band erboven. */}
      {labels.map((label) => (
        <text
          key={`angle-label-${label.degrees}`}
          x={label.x}
          y={label.y}
          fill="#12304f"
          fontFamily={FONT_STACK}
          fontSize={label.fontSize}
          fontWeight="800"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label.degrees}
        </text>
      ))}

      {/* maatverdeling langs de basis */}
      {baseTicks.map((tick) => (
        <line
          key={`base-tick-${tick.index}`}
          x1={tick.x}
          x2={tick.x}
          y1={tick.y1}
          y2={tick.y2}
          stroke="#12304f"
          strokeWidth={tick.kind === 'major' ? 2.6 : 1.4}
          strokeLinecap="round"
        />
      ))}

      <line x1="12" y1={baseY} x2={width - 12} y2={baseY} stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
      <line x1={cx} y1={baseY} x2={cx} y2={baseY - 52} stroke="#dc2626" strokeWidth="3" />
      <circle cx={cx} cy={baseY} r="7" fill="none" stroke="#dc2626" strokeWidth="3" />

      {/* sleepvlak: basisstrook blijft vrij om langs te tekenen */}
      <path
        data-instrument-grab="move"
        d={moveArea.pathData}
        fill="transparent"
        style={{ cursor: 'move', pointerEvents: 'all' }}
      />
      {/* Na het sleepvlak getekend: in SVG wint de laatste vorm de raakproef, en
          alleen daardoor krijgt een tik op de schaal voorrang op verslepen. */}
      <polygon
        data-instrument-grab="scale"
        points={scaleBand.pointsAttribute}
        fill="transparent"
        style={{ cursor: 'pointer', pointerEvents: 'all' }}
      />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Gradenboog: halve schijf met dubbele schaal 0-180, fijne maatstreepjes,
// radiale hulplijnen en een verstelbare wijzer om een hoek af te lezen.
// ---------------------------------------------------------------------------
const ProtractorVisual = ({ width, height, reading }) => {
  const def = PRESENTER_INSTRUMENT_DEFS.protractor;
  const cx = def.pivot.x;
  const cy = def.pivot.y;
  const radius = 284;
  const innerRadius = 150;
  const scale = buildProtractorScale({ cx, cy, radius, guideRadius: innerRadius });
  const readingRadians = (clamp(reading, 0, 180) * Math.PI) / 180;
  const armEnd = {
    x: cx + Math.cos(readingRadians) * (radius - 14),
    y: cy - Math.sin(readingRadians) * (radius - 14)
  };

  return (
    <svg aria-hidden="true" className="h-full w-full" viewBox={`0 0 ${width} ${height}`} style={{ pointerEvents: 'none', overflow: 'visible' }}>
      <defs>
        <linearGradient id="protractorBody" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="rgba(226,243,255,0.86)" />
          <stop offset="55%" stopColor="rgba(186,221,250,0.66)" />
          <stop offset="100%" stopColor="rgba(150,192,231,0.6)" />
        </linearGradient>
        <linearGradient id="protractorBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="45%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <radialGradient id="protractorGloss" cx="0.32" cy="0.18" r="0.7">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id="protractorShadow" x="-10%" y="-10%" width="120%" height="150%">
          <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#0f172a" floodOpacity="0.32" />
        </filter>
      </defs>

      {/* basislijn die buiten het instrument doorloopt als stippellijn */}
      <line
        x1={-width}
        y1={cy}
        x2={0}
        y2={cy}
        stroke="rgba(15,23,42,0.55)"
        strokeDasharray="14 12"
        strokeWidth="3"
      />
      <line
        x1={width}
        y1={cy}
        x2={width * 2}
        y2={cy}
        stroke="rgba(15,23,42,0.55)"
        strokeDasharray="14 12"
        strokeWidth="3"
      />

      <g filter="url(#protractorShadow)">
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy} Z`}
          fill="url(#protractorBody)"
          stroke="#1e3a5f"
          strokeWidth="4"
        />
        <rect x={cx - radius} y={cy} width={radius * 2} height={height - cy} rx="6" fill="url(#protractorBase)" stroke="#1e3a5f" strokeWidth="3" />
      </g>
      <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy} Z`} fill="url(#protractorGloss)" />
      <path
        d={`M ${cx - innerRadius} ${cy} A ${innerRadius} ${innerRadius} 0 0 1 ${cx + innerRadius} ${cy} Z`}
        fill="rgba(255,255,255,0.34)"
        stroke="rgba(15,23,42,0.35)"
        strokeWidth="2"
      />

      {/* radiale hulplijnen naar het midden */}
      {scale.guides.map((guide) => (
        <line
          key={`guide-${guide.degrees}`}
          x1={guide.x1}
          y1={guide.y1}
          x2={guide.x2}
          y2={guide.y2}
          stroke="rgba(30,58,95,0.26)"
          strokeWidth="1.4"
        />
      ))}

      {/* dubbele schaalverdeling: 181 streepjes van 1 graad */}
      {scale.ticks.map((tick) => (
        <line
          key={`tick-${tick.degrees}`}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          stroke={tick.kind === 'major' ? '#0f172a' : 'rgba(15,23,42,0.7)'}
          strokeWidth={tick.kind === 'major' ? 3.2 : tick.kind === 'mid' ? 2 : 1.1}
          strokeLinecap="butt"
        />
      ))}

      {scale.labels.map((label) => (
        <g key={`label-${label.degrees}`}>
          <text
            x={label.outerX}
            y={label.outerY}
            fill="#0f172a"
            fontFamily={FONT_STACK}
            fontSize={PROTRACTOR_LABEL_FONT_SIZE.outer}
            fontWeight="800"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${label.rotation} ${label.outerX} ${label.outerY})`}
          >
            {label.outer}
          </text>
          <text
            x={label.innerX}
            y={label.innerY}
            fill="#b91c1c"
            fontFamily={FONT_STACK}
            fontSize={PROTRACTOR_LABEL_FONT_SIZE.inner}
            fontWeight="800"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${label.rotation} ${label.innerX} ${label.innerY})`}
          >
            {label.inner}
          </text>
        </g>
      ))}

      {/* de vlakke basislijn zelf */}
      <line x1={cx - radius} y1={cy} x2={cx + radius} y2={cy} stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />

      {/* meetpunt met dradenkruis */}
      <line x1={cx - 26} y1={cy} x2={cx + 26} y2={cy} stroke="#dc2626" strokeWidth="2.5" />
      <line x1={cx} y1={cy - 26} x2={cx} y2={cy + 12} stroke="#dc2626" strokeWidth="2.5" />
      <circle cx={cx} cy={cy} r="10" fill="none" stroke="#dc2626" strokeWidth="3" />
      <circle cx={cx} cy={cy} r="3" fill="#dc2626" />

      {/* sleepvlak: alleen de band met de schaal, het midden blijft vrij */}
      <path
        data-instrument-grab="move"
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy} L ${cx + innerRadius} ${cy} A ${innerRadius} ${innerRadius} 0 0 0 ${cx - innerRadius} ${cy} Z`}
        fill="transparent"
        style={{ cursor: 'move', pointerEvents: 'all' }}
      />
      <rect
        data-instrument-grab="move"
        x={cx - radius}
        y={cy + 3}
        width={radius * 2}
        height={height - cy - 3}
        fill="transparent"
        style={{ cursor: 'move', pointerEvents: 'all' }}
      />

      {/* verstelbare wijzer om een hoek af te lezen */}
      <line x1={cx} y1={cy} x2={armEnd.x} y2={armEnd.y} stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
      <circle
        data-instrument-grab="arm"
        cx={armEnd.x}
        cy={armEnd.y}
        r="22"
        fill="rgba(255,255,255,0.94)"
        stroke="#dc2626"
        strokeWidth="4"
        style={{ cursor: 'grab', pointerEvents: 'all' }}
      />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Gradenveldje midden op de geodriehoek, bij het hoekpunt.
//
// Bewust een DOM-element en geen foreignObject in de instrument-SVG: die zou
// meedraaien en bij een gedraaid instrument op zijn kop staan. Het draaipunt is
// zelf het rotatiecentrum, dus het veld hoeft alleen verschoven te worden.
//
// Ook bewust een echte <input>: de globale sneltoetsen van de shell laten
// invoervelden met rust (isEditableShortcutTarget), zodat Backspace hier geen
// geselecteerd object wist en de pijltjes geen pagina omslaan.
// ---------------------------------------------------------------------------
function AngleDegreeField({ left, top, degrees, onPreview, onCommit }) {
  const [text, setText] = useState('');
  const parsed = parseAngleInput(text);
  const invalid = text.trim() !== '' && parsed === null;

  const handleChange = (event) => {
    const next = event.target.value;
    setText(next);
    onPreview?.(parseAngleInput(next));
  };

  const handleKeyDown = (event) => {
    // Nooit doorlaten naar de sneltoetsen van de shell.
    event.stopPropagation();

    if (event.key === 'Enter') {
      event.preventDefault();
      const value = parseAngleInput(text);
      if (value === null) return;

      onCommit?.(value);
      setText('');
      event.currentTarget.blur();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setText('');
      onPreview?.(null);
      event.currentTarget.blur();
    }
  };

  return (
    <div
      className="absolute z-40 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${left}px`, top: `${top}px`, pointerEvents: 'none' }}
    >
      <div
        className="flex flex-col items-center gap-1"
        style={{ pointerEvents: 'auto' }}
        onPointerDown={stopBoardPointer}
      >
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          aria-label="Aantal graden voor de hoek (0 tot 360)"
          title="Typ het aantal graden en druk op Enter"
          placeholder="0-360"
          className={`h-12 w-28 rounded-xl border-2 bg-white/95 text-center text-2xl font-black shadow-lg outline-none ${
            invalid ? 'border-red-500 text-red-700' : 'border-blue-600 text-slate-900'
          }`}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {Number.isFinite(degrees) ? (
          <span className="rounded-md bg-slate-950/85 px-2 py-0.5 text-sm font-black text-white shadow">
            {formatAngleDegrees(degrees)}
          </span>
        ) : null}
      </div>
    </div>
  );
}

const instrumentVisuals = {
  ruler: RulerVisual,
  triangle: TriangleVisual,
  protractor: ProtractorVisual
};

const buildArcPathData = (points) => {
  if (!Array.isArray(points) || points.length === 0) return '';
  const [first, ...rest] = points;
  return `M ${first.x} ${first.y} ${rest.map((point) => `L ${point.x} ${point.y}`).join(' ')}`;
};

// ---------------------------------------------------------------------------
// Passer: kop met draaiknop, twee benen met scharnier, een naald met greep en
// een echt houten potlood. Alles in boardunits binnen een scale()-groep.
// ---------------------------------------------------------------------------
const CompassLeg = ({ from, to, baseWidth, tipWidth, children }) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const degrees = (Math.atan2(dy, dx) * 180) / Math.PI;

  return (
    <g transform={`translate(${from.x} ${from.y}) rotate(${degrees})`}>
      <path
        d={`M 0 ${-baseWidth / 2} L ${length} ${-tipWidth / 2} L ${length} ${tipWidth / 2} L 0 ${baseWidth / 2} Z`}
        fill="url(#compassMetal)"
        stroke="#475569"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d={`M 8 ${-baseWidth * 0.26} L ${length - 10} ${-tipWidth * 0.26}`}
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth={Math.max(1.6, baseWidth * 0.12)}
        strokeLinecap="round"
      />
      {children ? children(length) : null}
    </g>
  );
};

const CompassVisual = ({ needle, pencil, hinge, penColor, partScale = 1 }) => {
  // Zelfde ondergrens als getCompassGeometry: de getekende onderdelen en de
  // berekende omvang moeten dezelfde maat aanhouden.
  const s = clamp(partScale, 0.5, 1.8);
  const mid = { x: (needle.x + pencil.x) / 2, y: (needle.y + pencil.y) / 2 };
  const headAngle = (Math.atan2(hinge.y - mid.y, hinge.x - mid.x) * 180) / Math.PI;
  const legWidth = 26 * s;
  const legTip = 13 * s;

  return (
    <g>
      <defs>
        <linearGradient id="compassMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="30%" stopColor="#cbd5e1" />
          <stop offset="62%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="compassHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="35%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="compassKnob" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="compassWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde8bd" />
          <stop offset="35%" stopColor="#f0c27b" />
          <stop offset="75%" stopColor="#d99a4e" />
          <stop offset="100%" stopColor="#b97b33" />
        </linearGradient>
        <linearGradient id="compassGrip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="45%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <filter id="compassShadow" x="-30%" y="-30%" width="180%" height="180%">
          <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#0f172a" floodOpacity="0.38" />
        </filter>
      </defs>

      <g filter="url(#compassShadow)">
        {/* naaldbeen */}
        <CompassLeg from={hinge} to={needle} baseWidth={legWidth} tipWidth={legTip}>
          {(length) => (
            <g>
              <rect
                x={length - 120 * s}
                y={-19 * s}
                width={62 * s}
                height={38 * s}
                rx={17 * s}
                fill="url(#compassGrip)"
                stroke="#0f172a"
                strokeWidth="1.4"
              />
              {[0, 1, 2, 3].map((index) => (
                <line
                  key={`grip-${index}`}
                  x1={length - (110 - index * 14) * s}
                  x2={length - (110 - index * 14) * s}
                  y1={-14 * s}
                  y2={14 * s}
                  stroke="rgba(148,163,184,0.55)"
                  strokeWidth={2 * s}
                  strokeLinecap="round"
                />
              ))}
              <rect x={length - 58 * s} y={-6 * s} width={30 * s} height={12 * s} rx={3 * s} fill="url(#compassMetal)" stroke="#475569" strokeWidth="1" />
              <path
                d={`M ${length - 28 * s} ${-5.5 * s} L ${length} 0 L ${length - 28 * s} ${5.5 * s} Z`}
                fill="#e2e8f0"
                stroke="#334155"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <circle cx={length} cy={0} r={2.6 * s} fill="#0f172a" />
            </g>
          )}
        </CompassLeg>

        {/* tekenbeen met potlood */}
        <CompassLeg from={hinge} to={pencil} baseWidth={legWidth} tipWidth={legTip}>
          {(length) => (
            <g>
              <rect
                x={length - 196 * s}
                y={-20 * s}
                width={54 * s}
                height={40 * s}
                rx={7 * s}
                fill="url(#compassMetal)"
                stroke="#475569"
                strokeWidth="1.4"
              />
              {[0, 1, 2].map((index) => (
                <line
                  key={`clamp-${index}`}
                  x1={length - (186 - index * 15) * s}
                  x2={length - (186 - index * 15) * s}
                  y1={-16 * s}
                  y2={16 * s}
                  stroke="rgba(71,85,105,0.7)"
                  strokeWidth={1.8 * s}
                  strokeLinecap="round"
                />
              ))}
              {/* houten zeshoekig potlood */}
              <rect
                x={length - 146 * s}
                y={-16 * s}
                width={100 * s}
                height={32 * s}
                fill="url(#compassWood)"
                stroke="#8a5a1c"
                strokeWidth="1.4"
              />
              <line x1={length - 146 * s} x2={length - 46 * s} y1={-6 * s} y2={-6 * s} stroke="rgba(255,255,255,0.5)" strokeWidth={1.6 * s} />
              <line x1={length - 146 * s} x2={length - 46 * s} y1={6 * s} y2={6 * s} stroke="rgba(120,53,15,0.45)" strokeWidth={1.6 * s} />
              <line x1={length - 132 * s} x2={length - 60 * s} y1={-11 * s} y2={-11 * s} stroke="rgba(120,53,15,0.3)" strokeWidth={1.2 * s} />
              {/* geslepen punt met houtnerf */}
              <path
                d={`M ${length - 46 * s} ${-16 * s} L ${length - 12 * s} ${-5 * s} L ${length - 12 * s} ${5 * s} L ${length - 46 * s} ${16 * s} Z`}
                fill="#f7e3bb"
                stroke="#c8a163"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <line x1={length - 44 * s} x2={length - 14 * s} y1={-7 * s} y2={-2.5 * s} stroke="rgba(160,110,40,0.5)" strokeWidth={1.1 * s} />
              <line x1={length - 44 * s} x2={length - 14 * s} y1={7 * s} y2={2.5 * s} stroke="rgba(160,110,40,0.5)" strokeWidth={1.1 * s} />
              {/* grafietpunt in de penkleur */}
              <path
                d={`M ${length - 12 * s} ${-5 * s} L ${length} 0 L ${length - 12 * s} ${5 * s} Z`}
                fill={penColor}
                stroke="rgba(15,23,42,0.6)"
                strokeWidth="0.9"
                strokeLinejoin="round"
              />
            </g>
          )}
        </CompassLeg>

        {/* kop met draaiknop */}
        <g transform={`translate(${hinge.x} ${hinge.y}) rotate(${headAngle})`}>
          <rect x={-16 * s} y={-32 * s} width={92 * s} height={64 * s} rx={26 * s} fill="url(#compassHead)" stroke="#475569" strokeWidth="2" />
          <path
            d={`M ${-4 * s} ${-22 * s} L ${58 * s} ${-20 * s}`}
            stroke="rgba(255,255,255,0.8)"
            strokeWidth={6 * s}
            strokeLinecap="round"
          />
          <rect x={68 * s} y={-11 * s} width={16 * s} height={22 * s} rx={4 * s} fill="url(#compassMetal)" stroke="#475569" strokeWidth="1.2" />
          <circle cx={100 * s} cy={0} r={26 * s} fill="url(#compassKnob)" stroke="#334155" strokeWidth="2" />
          {Array.from({ length: 10 }).map((_, index) => {
            const radians = (index * Math.PI) / 5;

            return (
              <line
                key={`knurl-${index}`}
                x1={100 * s + Math.cos(radians) * 18 * s}
                y1={Math.sin(radians) * 18 * s}
                x2={100 * s + Math.cos(radians) * 25 * s}
                y2={Math.sin(radians) * 25 * s}
                stroke="rgba(15,23,42,0.45)"
                strokeWidth={2.2 * s}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={100 * s} cy={0} r={8 * s} fill="rgba(248,250,252,0.85)" stroke="#475569" strokeWidth="1.4" />
        </g>

        {/* scharnierbout */}
        <circle cx={hinge.x} cy={hinge.y} r={15 * s} fill="url(#compassKnob)" stroke="#334155" strokeWidth="2" />
        <line
          x1={hinge.x - 8 * s}
          y1={hinge.y}
          x2={hinge.x + 8 * s}
          y2={hinge.y}
          stroke="rgba(15,23,42,0.65)"
          strokeWidth={2.4 * s}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
};

// Echte passer: naald op het middelpunt, potloodbeen dat bogen tekent.
// - naald slepen = passer verplaatsen
// - knop op de kop = straal instellen (snapt op halve ruitjes)
// - potlood slepen = boog tekenen (wordt inkt bij loslaten)
function CompassOverlay({ instrument, scale = 1, gridSize = 96, penStyle, bounds, onChange, onClose, onDrawStroke, onPenStyle }) {
  const dragRef = useRef(null);
  // De boog-in-wording leeft in een ref (bron van waarheid) en spiegelt naar
  // state voor de preview-render; zo blijven setState-updaters puur.
  const arcRef = useRef(null);
  const [arc, setArc] = useState(null);

  // Eén bron voor de meetkunde: dezelfde functie waarmee de plaatsingslogica
  // de omvang van de passer uitrekent.
  const geometry = getCompassGeometry({
    x: instrument.x,
    y: instrument.y,
    radius: instrument.radius,
    angle: instrument.angle,
    sizeScale: getInstrumentSizeScale(instrument)
  });
  const radius = geometry.radius;
  const angle = geometry.angle;
  const center = geometry.needle;
  const pencil = geometry.pencil;
  const penColor = penStyle?.color || '#111827';
  const penWidth = Number.isFinite(penStyle?.width) && penStyle.width > 0 ? penStyle.width : 6;

  const toBoardPoint = (event) => {
    const boardElement = event.currentTarget.closest('[data-presenter-board]');
    const rect = boardElement?.getBoundingClientRect();
    if (!rect) return null;

    return {
      x: (event.clientX - rect.left) / scale,
      y: (event.clientY - rect.top) / scale
    };
  };

  const startDrag = (event, mode) => {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);

    const point = toBoardPoint(event);
    dragRef.current = {
      mode,
      pointerId: event.pointerId,
      startCenter: center,
      startClient: { x: event.clientX, y: event.clientY },
      // Grip-offset: het potlood volgt je hand, niet de ruwe pointerhoek.
      gripOffset: point ? getCompassPointerAngle(center, point) - angle : 0
    };

    if (mode === 'draw') {
      const startArc = { startAngle: angle, sweep: 0, lastAngle: angle };
      arcRef.current = startArc;
      setArc(startArc);
    }
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;

    event.preventDefault();
    event.stopPropagation();

    if (drag.mode === 'move') {
      onChange?.({
        x: drag.startCenter.x + (event.clientX - drag.startClient.x) / scale,
        y: drag.startCenter.y + (event.clientY - drag.startClient.y) / scale
      });
      return;
    }

    const point = toBoardPoint(event);
    if (!point) return;

    const distance = Math.hypot(point.x - center.x, point.y - center.y);

    if (drag.mode === 'radius') {
      // Straal instellen draait het tekenbeen niet weg: alleen de opening.
      onChange?.({ radius: snapCompassRadius(distance, gridSize) });
      return;
    }

    // Wilde sprongen vlak bij de naald negeren.
    if (distance < Math.max(24, radius * 0.25)) return;
    const pointerAngle = getCompassPointerAngle(center, point) - drag.gripOffset;

    if (drag.mode === 'angle') {
      onChange?.({ angle: pointerAngle });
      return;
    }

    if (drag.mode === 'draw') {
      const current = arcRef.current;
      if (current) {
        const next = advanceCompassSweep(current.lastAngle, current.sweep, pointerAngle);
        const nextArc = { ...current, sweep: next.sweep, lastAngle: next.angle };
        arcRef.current = nextArc;
        setArc(nextArc);
      }
      onChange?.({ angle: pointerAngle });
    }
  };

  const handlePointerUp = (event) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;

    dragRef.current = null;

    if (drag.mode === 'draw') {
      const current = arcRef.current;
      arcRef.current = null;
      setArc(null);

      if (current && Math.abs(current.sweep) >= 2) {
        onDrawStroke?.(buildCompassArcPoints({
          cx: center.x,
          cy: center.y,
          radius,
          startAngle: current.startAngle,
          sweep: current.sweep
        }));
      }
    }
  };

  const drawFullCircle = () => {
    onDrawStroke?.(buildCompassCirclePoints({ x: center.x, y: center.y, radius, angle }));
  };

  // Scharnier boven het midden tussen naald en potlood, zodat de benen als een
  // echte passer meebewegen met straal en hoek.
  const { headUp, hinge, knob, partScale } = geometry;

  const previewArcPoints = arc && Math.abs(arc.sweep) >= 2
    ? buildCompassArcPoints({ cx: center.x, cy: center.y, radius, startAngle: arc.startAngle, sweep: arc.sweep })
    : null;

  const scaled = (point) => ({ x: point.x * scale, y: point.y * scale });
  const scaledCenter = scaled(center);
  const scaledPencil = scaled(pencil);
  const scaledKnob = scaled(knob);

  // Het straallabel hangt onder de naald, aan de kant tegenover de kop: dus
  // altijd ver weg van de knoppenrij en de draaiknop, die allebei boven het
  // scharnier zitten. Verticaal is 52 px genoeg (knopstraal 28 + halve
  // labelhoogte + marge); staat het label eerder zijwaarts, dan wordt de
  // afstand groter zodat het naast de knop uitkomt in plaats van erop. Bij een
  // hele kleine straal liggen naald en potlood zo dicht bij elkaar dat het
  // label nog een stap verder moet: dat is wat de lus hieronder doet.
  const labelDown = { x: -headUp.x, y: -headUp.y };
  const labelHalf = { x: 64, y: 14 };
  const touches = (point, other, half) =>
    Math.abs(point.x - other.x) < labelHalf.x + half && Math.abs(point.y - other.y) < labelHalf.y + half;

  let labelDistance = 52 / Math.max(0.35, Math.abs(labelDown.y));
  let radiusLabel = { x: 0, y: 0 };
  for (let step = 0; step < 8; step += 1) {
    radiusLabel = {
      x: scaledCenter.x + labelDown.x * labelDistance,
      y: scaledCenter.y + labelDown.y * labelDistance
    };
    if (!touches(radiusLabel, scaledCenter, 26) && !touches(radiusLabel, scaledPencil, 30)) break;
    labelDistance += 16;
  }

  return (
    <div className="absolute inset-0 z-30" style={{ pointerEvents: 'none' }}>
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
        <g transform={`scale(${scale})`}>
          <circle
            cx={center.x}
            cy={center.y}
            r={radius}
            fill="none"
            stroke="rgba(37, 99, 235, 0.45)"
            strokeDasharray={`${9 / scale} ${11 / scale}`}
            strokeWidth={2 / scale}
          />
          {previewArcPoints ? (
            <path
              d={buildArcPathData(previewArcPoints)}
              fill="none"
              stroke={penColor}
              strokeWidth={penWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
          <CompassVisual needle={center} pencil={pencil} hinge={hinge} penColor={penColor} partScale={partScale} />
        </g>
      </svg>

      <button
        type="button"
        aria-label="Passer verplaatsen"
        title="Sleep de naald om de passer te verplaatsen"
        className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-move touch-none rounded-full border-2 border-slate-500/70 bg-white/25"
        style={{ left: `${scaledCenter.x}px`, top: `${scaledCenter.y}px`, pointerEvents: 'auto' }}
        onPointerDown={(event) => startDrag(event, 'move')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span className="sr-only">Verplaatsen</span>
      </button>

      <button
        type="button"
        aria-label="Passerstraal instellen"
        title="Draai aan de knop om de straal in te stellen (snapt op halve ruitjes)"
        className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none rounded-full border-2 border-blue-600/60 bg-blue-500/10"
        style={{ left: `${scaledKnob.x}px`, top: `${scaledKnob.y}px`, pointerEvents: 'auto' }}
        onPointerDown={(event) => startDrag(event, 'radius')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span className="sr-only">Straal</span>
      </button>

      <button
        type="button"
        aria-label="Boog tekenen met de passer"
        title="Sleep het potlood rond de naald om een boog te tekenen"
        className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border-2"
        style={{
          left: `${scaledPencil.x}px`,
          top: `${scaledPencil.y}px`,
          borderColor: penColor,
          backgroundColor: 'rgba(255,255,255,0.18)',
          pointerEvents: 'auto'
        }}
        onPointerDown={(event) => startDrag(event, 'draw')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span className="sr-only">Boog tekenen</span>
      </button>

      <div
        aria-hidden="true"
        className="absolute z-30 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-950/85 px-2 py-0.5 text-sm font-black text-white shadow"
        style={{ left: `${radiusLabel.x}px`, top: `${radiusLabel.y}px`, pointerEvents: 'none' }}
      >
        {formatCompassRadius(radius, gridSize)}
      </div>

      <InstrumentControlBar
        anchor={{ x: scaledKnob.x, y: scaledKnob.y - PRESENTER_INSTRUMENT_CHROME_PX.compassOffset }}
        bounds={bounds}
        instrumentId="compass"
        label="Passer"
        badges={[]}
        penStyle={penStyle}
        onPenStyle={onPenStyle}
        onClose={onClose}
        onMovePointerDown={(event) => startDrag(event, 'move')}
        onRotatePointerDown={(event) => startDrag(event, 'angle')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        extraButtons={
          <button
            type="button"
            aria-label="Hele cirkel tekenen"
            title="Teken de volledige cirkel als inkt"
            className={`${CONTROL_BUTTON_CLASS} border-blue-600 text-blue-700`}
            onClick={drawFullCircle}
          >
            <Circle size={24} />
          </button>
        }
      />
    </div>
  );
}

export default function PresenterInstrumentOverlay({
  instrument,
  scale = 1,
  gridSize = 96,
  penStyle,
  boardWidth = 1920,
  boardHeight = 1400,
  onChange,
  onClose,
  onDrawStroke,
  onPlaceObject,
  onPenStyle
}) {
  const def = PRESENTER_INSTRUMENT_DEFS[instrument?.id];
  const dragRef = useRef(null);

  if (!instrument || !def) return null;

  const bounds = { width: boardWidth * scale, height: boardHeight * scale };

  if (instrument.id === 'compass') {
    return (
      <CompassOverlay
        instrument={instrument}
        scale={scale}
        gridSize={gridSize}
        penStyle={penStyle}
        bounds={bounds}
        onChange={onChange}
        onClose={onClose}
        onDrawStroke={onDrawStroke}
        onPenStyle={onPenStyle}
      />
    );
  }

  const Visual = instrumentVisuals[instrument.id];
  if (!Visual) return null;

  const rotation = instrument.rotation || 0;
  const metrics = getInstrumentMetrics(instrument);
  const sizeScale = metrics.sizeScale;
  // De tekening blijft in lokale units (def.width x def.height); de maatfactor
  // zit in het kader eromheen. De schaalverdeling wordt tegengeschaald zodat
  // een kleiner instrument nog steeds klopt met het ruitjespapier.
  const localGridSize = gridSize / sizeScale;
  const width = metrics.width * scale;
  const height = metrics.height * scale;
  const left = instrument.x * scale;
  const top = instrument.y * scale;
  const pivot = getInstrumentPivot(instrument);
  const reading = Number.isFinite(instrument.reading) ? instrument.reading : 60;

  // De knoppenrij hangt onder het instrument en draait mee zonder zelf te
  // kantelen: het ankerpunt wordt geroteerd, de knoppen blijven rechtop.
  const anchorLocal = {
    x: instrument.x + metrics.width / 2,
    y: instrument.y + metrics.height + PRESENTER_INSTRUMENT_CHROME_PX.frameOffset
  };
  const anchorBoard = rotatePoint(anchorLocal, pivot, rotation);
  const anchor = { x: anchorBoard.x * scale, y: anchorBoard.y * scale };

  const getPivotClientPoint = (event) => {
    const boardElement = event.currentTarget.closest('[data-presenter-board]');
    const rect = boardElement?.getBoundingClientRect();
    if (!rect) return null;

    return { x: rect.left + pivot.x * scale, y: rect.top + pivot.y * scale };
  };

  const startMove = (event) => {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    (event.target.setPointerCapture ? event.target : event.currentTarget).setPointerCapture?.(event.pointerId);
    dragRef.current = {
      mode: 'move',
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: instrument.x,
      startY: instrument.y
    };
  };

  const startRotate = (event) => {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);

    const center = getPivotClientPoint(event);
    if (!center) return;

    dragRef.current = {
      mode: 'rotate',
      pointerId: event.pointerId,
      center,
      startAngle: getPointerRotationDegrees(center, { x: event.clientX, y: event.clientY }),
      baseRotation: rotation
    };
  };

  // -------------------------------------------------------------------------
  // Hoekconstructie op de geodriehoek
  // -------------------------------------------------------------------------
  const isTriangle = instrument.id === 'triangle';
  const legDirection = instrument.legDirection === 'left' ? 'left' : instrument.legDirection === 'right' ? 'right' : null;
  const legDegrees = clampAngleDegrees(instrument.legDegrees);
  const legLength = getAngleLegLength(sizeScale);

  const getBoardPoint = (event) => {
    const boardElement = event.currentTarget.closest('[data-presenter-board]');
    const rect = boardElement?.getBoundingClientRect();
    if (!rect) return null;

    return { x: (event.clientX - rect.left) / scale, y: (event.clientY - rect.top) / scale };
  };

  // Een tik op de schaalverdeling wijst een richting aan; die wordt tot een
  // hoekmaat gerekend vanaf het gekozen eerste been.
  const readScaleDegrees = (event) => {
    const point = getBoardPoint(event);
    if (!point) return null;

    return getAngleDegreesFromReading(
      getProtractorReadingFromPoint({ pivot, rotation, point }),
      legDirection || 'right'
    );
  };

  const placeAngle = (degrees) => {
    const value = clampAngleDegrees(degrees);
    if (value === null) return;

    const placement = planAngleObjectPlacement({
      pivot,
      instrumentRotation: rotation,
      legDirection: legDirection || 'right',
      degrees: value,
      legLength
    });
    if (!placement) return;

    onPlaceObject?.({ type: 'angle', ...placement });
    // De hoek staat op het bord; het instrument is weer leeg voor de volgende.
    onChange?.({ legDirection: null, legDegrees: null });
  };

  const startScale = (event) => {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    (event.target.setPointerCapture ? event.target : event.currentTarget).setPointerCapture?.(event.pointerId);

    dragRef.current = {
      mode: 'scale',
      pointerId: event.pointerId,
      startClient: { x: event.clientX, y: event.clientY },
      startTime: getNow(),
      startX: instrument.x,
      startY: instrument.y,
      dragging: false
    };

    const degrees = readScaleDegrees(event);
    if (degrees !== null) onChange?.({ legDegrees: degrees });
  };

  const startArm = (event) => {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    (event.target.setPointerCapture ? event.target : event.currentTarget).setPointerCapture?.(event.pointerId);

    const center = getPivotClientPoint(event);
    if (!center) return;

    dragRef.current = { mode: 'arm', pointerId: event.pointerId, center };
  };

  // Pointerdown op het instrument zelf: het sleepvlak bepaalt wat er gebeurt.
  const handleInstrumentPointerDown = (event) => {
    const grab = event.target?.closest?.('[data-instrument-grab]')?.getAttribute('data-instrument-grab');
    if (grab === 'arm') {
      startArm(event);
      return;
    }
    if (grab === 'scale') {
      startScale(event);
      return;
    }
    if (grab === 'move') startMove(event);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;

    event.preventDefault();
    event.stopPropagation();

    if (drag.mode === 'move') {
      onChange?.({
        x: drag.startX + (event.clientX - drag.startClientX) / scale,
        y: drag.startY + (event.clientY - drag.startClientY) / scale
      });
      return;
    }

    // Op de schaalverdeling wordt pas bij het loslaten beslist of dit een tik
    // was (graden aanwijzen) of een sleep (instrument verplaatsen). Zodra de
    // pointer te ver is, blijft het een sleep.
    if (drag.mode === 'scale') {
      if (!drag.dragging && !isInstrumentTap({
        startClient: drag.startClient,
        client: { x: event.clientX, y: event.clientY },
        startTime: drag.startTime,
        time: getNow()
      })) {
        drag.dragging = true;
        onChange?.({ legDegrees: null });
      }

      if (drag.dragging) {
        onChange?.({
          x: drag.startX + (event.clientX - drag.startClient.x) / scale,
          y: drag.startY + (event.clientY - drag.startClient.y) / scale
        });
        return;
      }

      const degrees = readScaleDegrees(event);
      if (degrees !== null) onChange?.({ legDegrees: degrees });
      return;
    }

    if (drag.mode === 'arm') {
      const boardElement = event.currentTarget.closest('[data-presenter-board]');
      const rect = boardElement?.getBoundingClientRect();
      if (!rect) return;

      const nextReading = getProtractorReadingFromPoint({
        pivot,
        rotation,
        point: { x: (event.clientX - rect.left) / scale, y: (event.clientY - rect.top) / scale }
      });
      if (Number.isFinite(nextReading)) onChange?.({ reading: nextReading });
      return;
    }

    const currentAngle = getPointerRotationDegrees(drag.center, { x: event.clientX, y: event.clientY });
    onChange?.({ rotation: snapRotationDegrees(drag.baseRotation + currentAngle - drag.startAngle) });
  };

  const handlePointerUp = (event) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    dragRef.current = null;

    if (drag.mode !== 'scale') return;

    const tapped = !drag.dragging && isInstrumentTap({
      startClient: drag.startClient,
      client: { x: event.clientX, y: event.clientY },
      startTime: drag.startTime,
      time: getNow()
    });

    if (tapped) {
      placeAngle(readScaleDegrees(event));
      return;
    }

    onChange?.({ legDegrees: null });
  };

  const badges = [{ key: 'angle', text: getInstrumentAngleLabel(instrument) }];
  if (instrument.id === 'protractor') {
    badges.unshift({ key: 'reading', text: `meet ${formatProtractorReading(reading)}` });
  }
  if (instrument.id === 'ruler') {
    badges.unshift({ key: 'length', text: formatRulerLength(metrics.width, gridSize) });
  }
  if (isTriangle && (legDirection || legDegrees !== null)) {
    badges.unshift({
      key: 'leg',
      text: legDegrees === null
        ? `been ${legDirection === 'left' ? 'links' : 'rechts'}`
        : `hoek ${formatAngleDegrees(legDegrees)}`
    });
  }

  // Preview van de hoek-in-wording. Die leeft alleen op het instrument: niet in
  // de sessie, niet in de history, en weg zodra het instrument sluit.
  //
  // De preview wordt met exact dezelfde plaatsing en dezelfde tekenfunctie
  // getekend als het object dat straks op het bord komt, zodat er tussen "wat je
  // ziet" en "wat je krijgt" niets kan verschuiven.
  const anglePreview = isTriangle && (legDirection || legDegrees !== null)
    ? (() => {
        const placement = planAngleObjectPlacement({
          pivot,
          instrumentRotation: rotation,
          legDirection: legDirection || 'right',
          degrees: legDegrees ?? 0,
          legLength
        });
        if (!placement) return null;

        return {
          placement,
          geometry: getAngleFrameGeometry({
            width: placement.width,
            height: placement.height,
            angleDegrees: placement.angleDegrees
          }),
          showSecondLeg: legDegrees !== null
        };
      })()
    : null;

  const handleLegDirection = (direction) => {
    onChange?.({ legDirection: legDirection === direction ? null : direction });
  };

  const pivotPx = { x: pivot.x * scale, y: pivot.y * scale };

  return (
    <>
      {anglePreview ? (
        <svg
          aria-hidden="true"
          className="absolute inset-0 z-30 h-full w-full"
          style={{ pointerEvents: 'none', overflow: 'visible' }}
        >
          <g transform={`scale(${scale})`}>
            <g
              transform={`translate(${anglePreview.placement.x} ${anglePreview.placement.y}) rotate(${anglePreview.placement.rotation} ${anglePreview.placement.width / 2} ${anglePreview.placement.height / 2})`}
              opacity="0.9"
            >
              {anglePreview.showSecondLeg ? (
                <PresenterAngleShape geometry={anglePreview.geometry} stroke="#2563eb" strokeWidth={5} />
              ) : (
                <line
                  x1={anglePreview.geometry.originX}
                  y1={anglePreview.geometry.originY}
                  x2={anglePreview.geometry.leg1End.x}
                  y2={anglePreview.geometry.leg1End.y}
                  stroke="#2563eb"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              )}
            </g>
          </g>
        </svg>
      ) : null}

      <div
        data-presenter-instrument={instrument.id}
        className="absolute z-30"
        style={{
          height: `${height}px`,
          left: `${left}px`,
          pointerEvents: 'none',
          top: `${top}px`,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: `${metrics.pivot.x * scale}px ${metrics.pivot.y * scale}px`,
          width: `${width}px`
        }}
        onPointerDown={handleInstrumentPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <Visual width={def.width} height={def.height} gridSize={localGridSize} reading={reading} />
      </div>

      {isTriangle ? (
        <AngleDegreeField
          left={pivotPx.x}
          top={pivotPx.y - ANGLE_FIELD_OFFSET_PX}
          degrees={legDegrees}
          onPreview={(degrees) => onChange?.({ legDegrees: degrees })}
          onCommit={placeAngle}
        />
      ) : null}

      <InstrumentControlBar
        anchor={anchor}
        bounds={bounds}
        instrumentId={instrument.id}
        label={def.label}
        badges={badges}
        penStyle={penStyle}
        onPenStyle={onPenStyle}
        onClose={onClose}
        onMovePointerDown={startMove}
        onRotatePointerDown={startRotate}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        extraButtons={
          isTriangle ? (
            <>
              <button
                type="button"
                aria-label="Eerste been naar links"
                aria-pressed={legDirection === 'left'}
                title="Teken het eerste been vanaf het hoekpunt naar links"
                className={`${CONTROL_BUTTON_CLASS} ${
                  legDirection === 'left' ? 'border-blue-600 bg-blue-50 text-blue-700' : ''
                }`}
                onClick={() => handleLegDirection('left')}
              >
                <ArrowLeft size={24} />
              </button>
              <button
                type="button"
                aria-label="Eerste been naar rechts"
                aria-pressed={legDirection === 'right'}
                title="Teken het eerste been vanaf het hoekpunt naar rechts"
                className={`${CONTROL_BUTTON_CLASS} ${
                  legDirection === 'right' ? 'border-blue-600 bg-blue-50 text-blue-700' : ''
                }`}
                onClick={() => handleLegDirection('right')}
              >
                <ArrowRight size={24} />
              </button>
            </>
          ) : null
        }
      />
    </>
  );
}
