import { useRef } from 'react';
import { RotateCw, X } from 'lucide-react';
import { getPointerRotationDegrees, snapRotationDegrees } from '../../lib/presenterGeometry';
import {
  getInstrumentAngleLabel,
  PRESENTER_INSTRUMENT_DEFS
} from '../../lib/presenterInstruments';

// Meetinstrumenten als echte bordobjecten: sleepbaar, roteerbaar en met een
// tekenrand waar de pen op vastklikt (edge-snap zit in PresenterBoard).
// Het instrument leeft in boardcoordinaten en schaalt mee met het bord.

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

const CompassVisual = () => (
  <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 380 420" preserveAspectRatio="none">
    <circle cx="190" cy="52" fill="#f8fafc" r="30" stroke="#0f172a" strokeWidth="9" />
    <path d="M 184 82 L 124 372" fill="none" stroke="#0f172a" strokeLinecap="round" strokeWidth="16" />
    <path d="M 196 82 L 266 372" fill="none" stroke="#0f172a" strokeLinecap="round" strokeWidth="16" />
    <path d="M 123 372 L 104 408 L 144 380 Z" fill="#0f172a" />
    <path d="M 266 372 L 279 408 L 246 380 Z" fill="#475569" />
    <circle cx="190" cy="100" fill="#2563eb" r="10" />
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
  compass: CompassVisual,
  protractor: ProtractorVisual
};

export default function PresenterInstrumentOverlay({ instrument, scale = 1, onChange, onClose }) {
  const def = PRESENTER_INSTRUMENT_DEFS[instrument?.id];
  const Visual = instrumentVisuals[instrument?.id];
  const dragRef = useRef(null);

  if (!instrument || !def || !Visual) return null;

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
      {instrument.id === 'protractor' ? (
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
