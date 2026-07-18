import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Maximize2, Minimize2, X } from 'lucide-react';
import {
  FULLSCREEN_SURFACE_ROOT_CLASS,
  resolveFullscreenEscapeAction,
  shouldExitNativeFullscreenOnDeactivate
} from '../../lib/fullscreenSurfaceState';

// Gedeelde fullscreen-laag voor media-, slidedeck- en gameweergave: eerst een
// donkere overlay, met daarbovenop optioneel echte native fullscreen. De
// children blijven bij het schakelen gemount, zodat video's en games niet
// herstarten.
export default function FullscreenSurface({
  active,
  onActiveChange,
  eyebrow = 'Weergave',
  title = '',
  externalUrl = '',
  externalLabel = 'Open apart',
  footer = null,
  inactiveClassName = '',
  children
}) {
  const rootRef = useRef(null);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);

  const toggleNativeFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen?.();
      } else {
        await rootRef.current?.requestFullscreen?.();
      }
    } catch (fullscreenError) {
      console.warn('Fullscreen schakelen is mislukt:', fullscreenError);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsNativeFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!active) return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      const action = resolveFullscreenEscapeAction({ hasNativeFullscreen: Boolean(document.fullscreenElement) });
      if (action === 'exit-native') return;
      event.preventDefault();
      onActiveChange?.(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, onActiveChange]);

  useEffect(() => {
    if (shouldExitNativeFullscreenOnDeactivate({
      active,
      nativeFullscreenElement: document.fullscreenElement,
      rootElement: rootRef.current
    })) {
      document.exitFullscreen?.().catch?.(() => {});
    }
  }, [active]);

  return (
    <div ref={rootRef} className={active ? FULLSCREEN_SURFACE_ROOT_CLASS : inactiveClassName || 'contents'}>
      <header className={active ? 'flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-950 px-5 py-4' : 'hidden'}>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">{eyebrow}</p>
          <h2 className="mt-1 truncate text-xl font-black">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-black text-slate-100 transition hover:bg-slate-900 md:inline-flex"
            >
              <ExternalLink size={16} />
              {externalLabel}
            </a>
          )}
          <button
            type="button"
            onClick={toggleNativeFullscreen}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-black text-slate-100 transition hover:bg-slate-900"
          >
            {isNativeFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            {isNativeFullscreen ? 'Venster' : 'Fullscreen'}
          </button>
          <button
            type="button"
            onClick={() => onActiveChange?.(false)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-black text-slate-100 transition hover:bg-slate-900"
          >
            <X size={17} />
            Sluit
          </button>
        </div>
      </header>

      <div className={active ? 'min-h-0 flex-1 overflow-hidden p-4' : 'contents'}>
        {typeof children === 'function' ? children({ active }) : children}
      </div>

      <div className={active && footer ? 'border-t border-slate-800 bg-slate-950' : 'hidden'}>
        {footer}
      </div>
    </div>
  );
}
