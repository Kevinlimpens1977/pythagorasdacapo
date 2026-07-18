import { useEffect, useRef, useState } from 'react';
import { Loader2, Shuffle, TimerReset, X } from 'lucide-react';
import { getSpotlightRadius } from '../../lib/presenterFocus';
import { getAvailableKlassen, getKlasStudents } from '../../services/klasService';
import StudentAvatar from '../common/StudentAvatar';

// Focus-gereedschap voor klassikale regie: spotlight, schermgordijn en
// laserpointer op het bord, plus een grote timer en een leerlingkiezer.

function SpotlightLayer({ focus, scale, onFocusChange }) {
  const dragRef = useRef(null);
  const radius = getSpotlightRadius(focus.radiusId) * scale;
  const centerX = focus.x * scale;
  const centerY = focus.y * scale;

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: focus.x,
      startY: focus.y
    };
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;

    event.preventDefault();
    onFocusChange?.({
      x: drag.startX + (event.clientX - drag.startClientX) / scale,
      y: drag.startY + (event.clientY - drag.startClientY) / scale
    });
  };

  const handlePointerUp = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
  };

  return (
    <div
      className="absolute inset-0 z-40 cursor-move touch-none"
      style={{
        background: `radial-gradient(circle ${radius}px at ${centerX}px ${centerY}px, rgba(2, 6, 23, 0) ${radius - 2}px, rgba(2, 6, 23, 0.82) ${radius + 2}px)`
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="presentation"
    />
  );
}

function CurtainLayer({ focus, onFocusChange }) {
  const dragRef = useRef(null);
  const progress = Math.max(0.06, Math.min(1, focus.progress ?? 1));
  const horizontal = focus.direction === 'left';

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const surface = event.currentTarget.parentElement.getBoundingClientRect();
    dragRef.current = { pointerId: event.pointerId, surface };
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;

    event.preventDefault();
    const ratio = horizontal
      ? (event.clientX - drag.surface.left) / drag.surface.width
      : (event.clientY - drag.surface.top) / drag.surface.height;
    onFocusChange?.({ progress: Math.max(0.06, Math.min(1, ratio)) });
  };

  const handlePointerUp = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
  };

  return (
    <div className="absolute inset-0 z-40">
      <div
        className="absolute bg-slate-950/95 shadow-2xl"
        style={horizontal
          ? { top: 0, bottom: 0, left: 0, width: `${progress * 100}%` }
          : { left: 0, right: 0, top: 0, height: `${progress * 100}%` }}
      />
      <button
        type="button"
        aria-label="Gordijn verschuiven"
        title="Sleep om het gordijn te openen of te sluiten"
        className="absolute z-10 flex touch-none items-center justify-center rounded-full border-2 border-white bg-slate-800 text-white shadow-lg"
        style={horizontal
          ? { left: `calc(${progress * 100}% - 22px)`, top: '50%', height: '44px', width: '44px', transform: 'translateY(-50%)', cursor: 'ew-resize' }
          : { top: `calc(${progress * 100}% - 22px)`, left: '50%', height: '44px', width: '44px', transform: 'translateX(-50%)', cursor: 'ns-resize' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span className={`block rounded bg-white ${horizontal ? 'h-5 w-1' : 'h-1 w-5'}`} />
      </button>
    </div>
  );
}

const LASER_FADE_MS = 650;

function LaserLayer() {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const frameRef = useRef(0);

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      const now = performance.now();
      pointsRef.current = pointsRef.current.filter((point) => now - point.at < LASER_FADE_MS);

      context.clearRect(0, 0, canvas.width, canvas.height);
      for (const point of pointsRef.current) {
        const age = (now - point.at) / LASER_FADE_MS;
        context.beginPath();
        context.arc(point.x, point.y, 7 * (1 - age * 0.6), 0, Math.PI * 2);
        context.fillStyle = `rgba(220, 38, 38, ${0.85 * (1 - age)})`;
        context.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const registerPoint = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    pointsRef.current.push({
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
      at: performance.now()
    });
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-40 h-full w-full cursor-crosshair touch-none"
      width={1920}
      height={1400}
      onPointerMove={registerPoint}
      onPointerDown={registerPoint}
    />
  );
}

export function PresenterFocusLayer({ focus, scale = 1, onFocusChange }) {
  if (!focus) return null;
  if (focus.kind === 'spotlight') return <SpotlightLayer focus={focus} scale={scale} onFocusChange={onFocusChange} />;
  if (focus.kind === 'curtain') return <CurtainLayer focus={focus} onFocusChange={onFocusChange} />;
  if (focus.kind === 'laser') return <LaserLayer />;
  return null;
}

export function PresenterTimerOverlay({ timer, onStop }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, (timer?.endsAt || 0) - Date.now()));

  useEffect(() => {
    if (!timer) return undefined;

    const interval = window.setInterval(() => {
      setRemaining(Math.max(0, timer.endsAt - Date.now()));
    }, 250);
    return () => window.clearInterval(interval);
  }, [timer]);

  if (!timer) return null;

  const totalSeconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const finished = remaining <= 0;

  return (
    <div
      className={`pointer-events-auto absolute right-6 top-6 z-50 flex items-center gap-4 rounded-2xl border-2 px-6 py-4 shadow-2xl ${
        finished ? 'border-red-300 bg-red-600 text-white' : 'border-white/70 bg-slate-950/90 text-white'
      }`}
      role="timer"
    >
      <span className="font-mono text-5xl font-black tabular-nums">
        {minutes}:{String(seconds).padStart(2, '0')}
      </span>
      <button
        type="button"
        aria-label="Timer stoppen"
        title="Timer stoppen"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/40 transition hover:bg-white/10"
        onClick={onStop}
      >
        <TimerReset size={22} />
      </button>
    </div>
  );
}

export function PresenterStudentPicker({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [klassen, setKlassen] = useState([]);
  const [selectedKlasId, setSelectedKlasId] = useState('');
  const [students, setStudents] = useState([]);
  const [picked, setPicked] = useState(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- laadstatus hoort bij deze externe fetch
    setLoading(true);
    setError('');

    getAvailableKlassen()
      .then((list) => {
        if (cancelled) return;
        setKlassen(list);
        if (list.length > 0) setSelectedKlasId((current) => current || list[0].id);
      })
      .catch(() => {
        if (!cancelled) setError('Klassen konden niet worden geladen. Log in met een echt beheerdersaccount.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !selectedKlasId) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset hoort bij de klaswissel-fetch
    setStudents([]);
    setPicked(null);

    getKlasStudents(selectedKlasId)
      .then((list) => {
        if (!cancelled) setStudents(list);
      })
      .catch(() => {
        if (!cancelled) setError('Leerlingen konden niet worden geladen.');
      });

    return () => {
      cancelled = true;
    };
  }, [open, selectedKlasId]);

  if (!open) return null;

  const pickStudent = () => {
    if (students.length === 0 || spinning) return;

    setSpinning(true);
    let ticks = 0;
    const spin = window.setInterval(() => {
      ticks += 1;
      setPicked(students[Math.floor(Math.random() * students.length)]);
      if (ticks >= 14) {
        window.clearInterval(spin);
        setSpinning(false);
      }
    }, 90);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-6">
      <section className="w-[min(30rem,calc(100vw-3rem))] rounded-2xl border border-white/20 bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-label="Leerlingkiezer">
        <header className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-extrabold text-[var(--helix-navy)]">Leerlingkiezer</h2>
          <button
            type="button"
            aria-label="Leerlingkiezer sluiten"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        {error ? (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">{error}</p>
        ) : null}

        <div className="mt-4">
          <label className="text-xs font-black uppercase tracking-[0.14em] text-[var(--helix-muted)]" htmlFor="focus-klas-select">
            Klas
          </label>
          <select
            id="focus-klas-select"
            className="input-standard mt-2 w-full"
            value={selectedKlasId}
            onChange={(event) => setSelectedKlasId(event.target.value)}
            disabled={loading || klassen.length === 0}
          >
            {klassen.map((klas) => (
              <option key={klas.id} value={klas.id}>{klas.name || klas.id}</option>
            ))}
          </select>
        </div>

        <div className="mt-5 flex min-h-36 items-center justify-center rounded-2xl bg-[var(--helix-surface-soft)] p-5">
          {loading ? (
            <Loader2 className="animate-spin text-[var(--helix-purple)]" size={28} />
          ) : picked ? (
            <div className="flex items-center gap-4">
              <StudentAvatar student={picked} size="lg" />
              <p className="text-2xl font-black text-[var(--helix-navy)]">{picked.displayName || picked.email || 'Leerling'}</p>
            </div>
          ) : (
            <p className="text-sm font-bold text-[var(--helix-muted)]">
              {students.length === 0 ? 'Geen leerlingen in deze klas.' : `${students.length} leerlingen klaar voor de trekking.`}
            </p>
          )}
        </div>

        <button
          type="button"
          className="btn-primary mt-5 w-full justify-center px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          onClick={pickStudent}
          disabled={students.length === 0 || spinning}
        >
          <Shuffle size={17} />
          {spinning ? 'Kiezen...' : 'Kies willekeurige leerling'}
        </button>
      </section>
    </div>
  );
}
