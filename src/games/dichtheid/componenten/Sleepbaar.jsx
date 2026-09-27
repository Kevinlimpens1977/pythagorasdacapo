import { useRef, useState } from 'react';

// Iets dat je met muis, vinger of pen naar een doel sleept (pointer events).
// `doelen`: [{ id, ref }] met refs naar de neerzetzones. Laat je los boven een
// doel, dan volgt onDrop(id); anders schiet het terug. Met het toetsenbord:
// Enter of spatie legt het op het eerste doel. Elke sleepactie heeft daarnaast
// in het paneel een gewone knop.
export default function Sleepbaar({ doelen = [], onDrop, label, disabled = false, className = '', children }) {
  const [verschuiving, setVerschuiving] = useState(null);
  const start = useRef(null);

  const binnen = (x, y) => doelen.find((doel) => {
    const rect = doel.ref.current?.getBoundingClientRect();
    return rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  });

  const omlaag = (event) => {
    if (disabled) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    start.current = { x: event.clientX, y: event.clientY };
    setVerschuiving({ x: 0, y: 0 });
  };
  const beweeg = (event) => {
    if (!start.current) return;
    setVerschuiving({ x: event.clientX - start.current.x, y: event.clientY - start.current.y });
  };
  const los = (event) => {
    if (!start.current) return;
    start.current = null;
    setVerschuiving(null);
    const doel = binnen(event.clientX, event.clientY);
    if (doel) onDrop?.(doel.id);
  };
  const toets = (event) => {
    if (disabled || !doelen.length) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onDrop?.(doelen[0].id);
    }
  };

  const sleept = verschuiving !== null;
  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-disabled={disabled}
      onPointerDown={omlaag}
      onPointerMove={beweeg}
      onPointerUp={los}
      onPointerCancel={() => { start.current = null; setVerschuiving(null); }}
      onKeyDown={toets}
      className={`touch-none select-none outline-none focus-visible:[filter:drop-shadow(0_0_6px_#087EB5)] ${disabled ? '' : sleept ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
      style={{
        transform: sleept ? `translate(${verschuiving.x}px, ${verschuiving.y}px) scale(1.04)` : undefined,
        transition: sleept ? 'none' : 'transform 180ms ease-out',
        zIndex: sleept ? 30 : undefined,
        position: 'relative'
      }}
    >
      {children}
    </div>
  );
}
