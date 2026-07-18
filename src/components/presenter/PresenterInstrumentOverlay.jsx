import { useRef, useState } from 'react';
import { Circle, RotateCw, X } from 'lucide-react';
import { getPointerRotationDegrees, snapRotationDegrees } from '../../lib/presenterGeometry';
import {
  getInstrumentAngleLabel,
  PRESENTER_INSTRUMENT_DEFS
} from '../../lib/presenterInstruments';
import {
  advanceCompassSweep,
  buildCompassArcPoints,
  buildCompassCirclePoints,
  formatCompassRadius,
  getCompassPencilPoint,
  getCompassPointerAngle,
  snapCompassRadius
} from '../../lib/presenterCompass';

// Meetinstrumenten als echte bordobjecten: sleepbaar, roteerbaar en met een
// tekenrand waar de pen op vastklikt (edge-snap zit in PresenterBoard). De
// passer is een tekenend instrument: het potloodbeen trekt bogen als inkt.

const RulerVisual = () => (
  <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 760 110" preserveAspectRatio="none">
    <rect x="2" y="2" width="756" height="106" rx="10" fill="rgba(253, 230, 138, 0.88)" stroke="#92400e" strokeWidth="4" />
    {Array.from({ length: 39 }).map((_, index) => (
      <line
        key={index}
        stroke="#78350f"
        strokeWidth={index % 4 === 0 ? 3 : 1.6}
        x1={20 + index * 19}
        x2={20 + index * 19}
        y1="4"
        y2={index % 4 === 0 ? 44 : index % 2 === 0 ? 32 : 22}
      />
    ))}
    {Array.from({ length: 10 }).map((_, index) => (
      <text key={index} x={16 + index * 76} y="64" fontSize="20" fontWeight="700" fill="#78350f">
        {index}
      </text>
    ))}
  </svg>
);

const TriangleVisual = () => (
  <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 560 300" preserveAspectRatio="none">
    <path d="M 6 294 L 554 294 L 280 12 Z" fill="rgba(186, 230, 253, 0.66)" stroke="#0f172a" strokeWidth="6" />
    <path d="M 120 250 L 440 250 L 280 86 Z" fill="rgba(248, 250, 252, 0.55)" stroke="#0f172a" strokeWidth="3" />
    {Array.from({ length: 27 }).map((_, index) => (
      <line
        key={index}
        stroke="#334155"
        strokeWidth={index % 4 === 0 ? 2.6 : 1.4}
        x1={20 + index * 20}
        x2={20 + index * 20}
        y1="294"
        y2={index % 4 === 0 ? 262 : 274}
      />
    ))}
  </svg>
);

const ProtractorVisual = () => (
  <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 560 300" preserveAspectRatio="none">
    <path
      d="M 32 288 A 248 248 0 0 1 528 288 L 442 288 A 162 162 0 0 0 118 288 Z"
      fill="rgba(186, 230, 253, 0.68)"
      stroke="#0f172a"
      strokeWidth="7"
    />
    <line x1="32" x2="528" y1="288" y2="288" stroke="#0f172a" strokeLinecap="round" strokeWidth="7" />
    {Array.from({ length: 19 }).map((_, index) => {
      const angle = Math.PI - (Math.PI * index) / 18;
      const outerRadius = 232;
      const innerRadius = index % 3 === 0 ? 190 : 208;

      return (
        <line
          key={index}
          stroke="#334155"
          strokeLinecap="round"
          strokeWidth={index % 3 === 0 ? 4 : 2}
          x1={280 + Math.cos(angle) * innerRadius}
          x2={280 + Math.cos(angle) * outerRadius}
          y1={288 - Math.sin(angle) * innerRadius}
          y2={288 - Math.sin(angle) * outerRadius}
        />
      );
    })}
    <circle cx="280" cy="288" fill="#0f172a" r="8" />
  </svg>
);

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

// Echte passer: naald op het middelpunt, potloodbeen dat bogen tekent.
// - naald slepen = passer verplaatsen
// - armhandvat slepen = straal instellen (snapt op halve ruitjes)
// - potlood slepen = boog tekenen (wordt inkt bij loslaten)
function CompassOverlay({ instrument, scale = 1, gridSize = 96, penStyle, onChange, onClose, onDrawStroke }) {
  const dragRef = useRef(null);
  // De boog-in-wording leeft in een ref (bron van waarheid) en spiegelt naar
  // state voor de preview-render; zo blijven setState-updaters puur.
  const arcRef = useRef(null);
  const [arc, setArc] = useState(null);

  const radius = instrument.radius || 200;
  const angle = Number.isFinite(instrument.angle) ? instrument.angle : -35;
  const center = { x: instrument.x, y: instrument.y };
  const pencil = getCompassPencilPoint({ x: center.x, y: center.y, radius, angle });
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
    dragRef.current = {
      mode,
      pointerId: event.pointerId,
      startCenter: center,
      startClient: { x: event.clientX, y: event.clientY }
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

    if (drag.mode === 'radius') {
      const nextRadius = snapCompassRadius(Math.hypot(point.x - center.x, point.y - center.y), gridSize);
      onChange?.({
        radius: nextRadius,
        angle: getCompassPointerAngle(center, point)
      });
      return;
    }

    if (drag.mode === 'draw') {
      const pointerAngle = getCompassPointerAngle(center, point);
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
  const mid = { x: (center.x + pencil.x) / 2, y: (center.y + pencil.y) / 2 };
  const legLength = Math.max(radius * 0.72, 150);
  const halfSpan = radius / 2;
  const hingeHeight = Math.sqrt(Math.max(legLength * legLength - halfSpan * halfSpan, 3600));
  const direction = { x: (pencil.x - center.x) / radius, y: (pencil.y - center.y) / radius };
  const perpendicular = direction.y <= 0
    ? { x: direction.y, y: -direction.x }
    : { x: -direction.y, y: direction.x };
  const hinge = { x: mid.x + perpendicular.x * hingeHeight, y: mid.y + perpendicular.y * hingeHeight };

  const previewArcPoints = arc && Math.abs(arc.sweep) >= 2
    ? buildCompassArcPoints({ cx: center.x, cy: center.y, radius, startAngle: arc.startAngle, sweep: arc.sweep })
    : null;

  const scaled = (point) => ({ x: point.x * scale, y: point.y * scale });
  const scaledCenter = scaled(center);
  const scaledPencil = scaled(pencil);
  const scaledHinge = scaled(hinge);

  return (
    <div className="absolute inset-0 z-30" style={{ pointerEvents: 'none' }}>
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
        <circle
          cx={scaledCenter.x}
          cy={scaledCenter.y}
          r={radius * scale}
          fill="none"
          stroke="rgba(37, 99, 235, 0.45)"
          strokeDasharray="7 9"
          strokeWidth="2"
        />
        {previewArcPoints ? (
          <path
            d={buildArcPathData(previewArcPoints.map(scaled))}
            fill="none"
            stroke={penColor}
            strokeWidth={penWidth * scale}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
        <line x1={scaledCenter.x} y1={scaledCenter.y} x2={scaledHinge.x} y2={scaledHinge.y} stroke="#0f172a" strokeWidth={9 * Math.max(scale, 0.6)} strokeLinecap="round" />
        <line x1={scaledPencil.x} y1={scaledPencil.y} x2={scaledHinge.x} y2={scaledHinge.y} stroke="#0f172a" strokeWidth={9 * Math.max(scale, 0.6)} strokeLinecap="round" />
        <circle cx={scaledHinge.x} cy={scaledHinge.y} r={13 * Math.max(scale, 0.6)} fill="#f8fafc" stroke="#0f172a" strokeWidth="5" />
        <circle cx={scaledCenter.x} cy={scaledCenter.y} r={5} fill="#0f172a" />
        <line
          x1={scaledPencil.x}
          y1={scaledPencil.y}
          x2={scaledPencil.x + (scaledPencil.x - scaledHinge.x) * 0.1}
          y2={scaledPencil.y + (scaledPencil.y - scaledHinge.y) * 0.1}
          stroke={penColor}
          strokeWidth={6 * Math.max(scale, 0.6)}
          strokeLinecap="round"
        />
      </svg>

      <span
        className="absolute -translate-x-1/2 rounded-md bg-slate-950/85 px-2 py-0.5 text-sm font-black text-white"
        style={{ left: `${scaledHinge.x}px`, top: `${scaledHinge.y - 42}px` }}
      >
        {formatCompassRadius(radius, gridSize)}
      </span>

      <button
        type="button"
        aria-label="Passer verplaatsen"
        title="Sleep de naald om de passer te verplaatsen"
        className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-move touch-none items-center justify-center rounded-full border-2 border-slate-700 bg-white/95 shadow-md"
        style={{ left: `${scaledCenter.x}px`, top: `${scaledCenter.y}px`, pointerEvents: 'auto' }}
        onPointerDown={(event) => startDrag(event, 'move')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span className="block h-2 w-2 rounded-full bg-slate-900" />
      </button>

      <button
        type="button"
        aria-label="Passerstraal instellen"
        title="Sleep om de straal in te stellen (snapt op halve ruitjes)"
        className="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center rounded-full border-2 border-blue-700 bg-white text-blue-700 shadow-md"
        style={{
          left: `${scaledCenter.x + (scaledPencil.x - scaledCenter.x) * 0.55}px`,
          top: `${scaledCenter.y + (scaledPencil.y - scaledCenter.y) * 0.55}px`,
          pointerEvents: 'auto'
        }}
        onPointerDown={(event) => startDrag(event, 'radius')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span className="block h-2.5 w-2.5 rounded-full bg-blue-600" />
      </button>

      <button
        type="button"
        aria-label="Boog tekenen met de passer"
        title="Sleep het potlood rond de naald om een boog te tekenen"
        className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none items-center justify-center rounded-full border-2 shadow-lg"
        style={{
          left: `${scaledPencil.x}px`,
          top: `${scaledPencil.y}px`,
          borderColor: penColor,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          pointerEvents: 'auto'
        }}
        onPointerDown={(event) => startDrag(event, 'draw')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: penColor }} />
      </button>

      <div
        className="absolute flex -translate-x-1/2 gap-2"
        style={{ left: `${scaledCenter.x}px`, top: `${scaledCenter.y + radius * scale + 18}px`, pointerEvents: 'auto' }}
      >
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border-2 border-blue-700 bg-white px-3 py-1.5 text-sm font-black text-blue-800 shadow-md"
          onClick={drawFullCircle}
          title="Teken de volledige cirkel als inkt"
        >
          <Circle size={15} />
          Hele cirkel
        </button>
        <button
          type="button"
          aria-label="Passer sluiten"
          title="Passer sluiten"
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-500 bg-white text-slate-700 shadow-md"
          onClick={onClose}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default function PresenterInstrumentOverlay({ instrument, scale = 1, gridSize = 96, penStyle, onChange, onClose, onDrawStroke }) {
  const def = PRESENTER_INSTRUMENT_DEFS[instrument?.id];
  const dragRef = useRef(null);

  if (!instrument || !def) return null;

  if (instrument.id === 'compass') {
    return (
      <CompassOverlay
        instrument={instrument}
        scale={scale}
        gridSize={gridSize}
        penStyle={penStyle}
        onChange={onChange}
        onClose={onClose}
        onDrawStroke={onDrawStroke}
      />
    );
  }

  const Visual = instrumentVisuals[instrument.id];
  if (!Visual) return null;

  const width = def.width * scale;
  const height = def.height * scale;
  const left = instrument.x * scale;
  const top = instrument.y * scale;

  const handleDragPointerDown = (event) => {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = {
      mode: 'move',
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: instrument.x,
      startY: instrument.y
    };
  };

  const handleRotatePointerDown = (event) => {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);

    const wrapper = event.currentTarget.closest('[data-presenter-instrument]');
    const rect = wrapper?.getBoundingClientRect();
    if (!rect) return;

    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    dragRef.current = {
      mode: 'rotate',
      pointerId: event.pointerId,
      center,
      startAngle: getPointerRotationDegrees(center, { x: event.clientX, y: event.clientY }),
      baseRotation: instrument.rotation || 0
    };
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

    const currentAngle = getPointerRotationDegrees(drag.center, { x: event.clientX, y: event.clientY });
    onChange?.({ rotation: snapRotationDegrees(drag.baseRotation + currentAngle - drag.startAngle) });
  };

  const handlePointerUp = (event) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    dragRef.current = null;
  };

  return (
    <div
      data-presenter-instrument={instrument.id}
      className="absolute z-30"
      style={{
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`,
        transform: `rotate(${instrument.rotation || 0}deg)`,
        width: `${width}px`
      }}
    >
      <div
        className="absolute inset-0 cursor-move touch-none"
        onPointerDown={handleDragPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="presentation"
      >
        <Visual />
      </div>
      {instrument.id === 'protractor' || instrument.id === 'triangle' ? (
        <span className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 rounded-md bg-slate-950/80 px-2 py-0.5 text-sm font-black text-white">
          {getInstrumentAngleLabel(instrument)}
        </span>
      ) : null}
      <button
        type="button"
        aria-label={`${def.label} roteren`}
        title="Roteren (snapt op 15°)"
        className="absolute -right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 translate-x-full cursor-grab touch-none items-center justify-center rounded-full border-2 border-blue-700 bg-white text-blue-700 shadow-md"
        onPointerDown={handleRotatePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <RotateCw size={18} />
      </button>
      <button
        type="button"
        aria-label={`${def.label} sluiten`}
        title="Instrument sluiten"
        className="absolute -top-4 right-0 flex h-9 w-9 -translate-y-full items-center justify-center rounded-full border-2 border-slate-500 bg-white text-slate-700 shadow-md"
        onClick={onClose}
      >
        <X size={16} />
      </button>
    </div>
  );
}
