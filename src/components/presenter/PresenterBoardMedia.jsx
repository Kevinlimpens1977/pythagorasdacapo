import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import { parseYouTubeUrl } from '../../lib/mediaUtils.js';
import {
  BOARD_MEDIA_MODES,
  BOARD_MEDIA_SEEK_SECONDS,
  buildPlaybackHandoff,
  formatMediaTime,
  getBoardMediaMode,
  getSeekTarget
} from '../../lib/presenterMediaControls.js';
import PdfSlideDeckPresenter from '../digibord/PdfSlideDeckPresenter.jsx';

// Grote transportknoppen: de dunne strook van <video controls> is met een
// vinger op 86 inch niet te raken. Alles hier is minstens 64 px hoog en
// altijd zichtbaar; geen hover, geen tooltip-only bediening.
const transportButtonClass =
  'inline-flex h-16 min-w-16 items-center justify-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-5 text-[18px] font-black text-slate-900 active:bg-slate-100';

// De kaart hangt in een <foreignObject> binnen de board-SVG. `position: fixed`
// en requestFullscreen gedragen zich daar per engine anders, dus de grote
// weergave gaat via een portal naar document.body: buiten de SVG, en daarmee
// voorspelbaar op elk digibord.
function BoardOverlay({ title, eyebrow = 'Media', externalUrl = '', onClose, children }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[1200] flex flex-col bg-slate-950 text-white">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-800 px-6 py-4">
        <div className="min-w-0">
          <p className="text-[13px] font-black uppercase tracking-[0.22em] text-blue-300">{eyebrow}</p>
          <h2 className="mt-1 truncate text-[26px] font-black">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-14 items-center gap-2 rounded-2xl border-2 border-slate-700 px-5 text-[18px] font-black text-slate-100"
            >
              <ExternalLink size={22} />
              Apart openen
            </a>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-14 items-center gap-2 rounded-2xl bg-white px-6 text-[18px] font-black text-slate-950"
          >
            <X size={22} />
            Sluiten
          </button>
        </div>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </div>,
    document.body
  );
}

function VideoTransport({ videoRef, onOpenLarge }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [position, setPosition] = useState({ current: 0, duration: 0 });

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return undefined;

    const syncState = () => {
      setPlaying(!element.paused);
      setMuted(element.muted);
    };
    const syncTime = () => setPosition({ current: element.currentTime, duration: element.duration });

    element.addEventListener('play', syncState);
    element.addEventListener('pause', syncState);
    element.addEventListener('volumechange', syncState);
    element.addEventListener('timeupdate', syncTime);
    element.addEventListener('loadedmetadata', syncTime);

    return () => {
      element.removeEventListener('play', syncState);
      element.removeEventListener('pause', syncState);
      element.removeEventListener('volumechange', syncState);
      element.removeEventListener('timeupdate', syncTime);
      element.removeEventListener('loadedmetadata', syncTime);
    };
  }, [videoRef]);

  const togglePlay = () => {
    const element = videoRef.current;
    if (!element) return;
    if (element.paused) element.play?.().catch(() => {});
    else element.pause?.();
  };

  const seek = (delta) => {
    const element = videoRef.current;
    if (!element) return;
    element.currentTime = getSeekTarget(element.currentTime, delta, element.duration);
  };

  const toggleMute = () => {
    const element = videoRef.current;
    if (!element) return;
    element.muted = !element.muted;
  };

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-3 pt-3" data-presenter-interactive="true">
      <button type="button" className={transportButtonClass} onClick={togglePlay} aria-label={playing ? 'Pauzeer' : 'Speel af'}>
        {playing ? <Pause size={26} /> : <Play size={26} />}
        {playing ? 'Pauze' : 'Speel'}
      </button>
      <button type="button" className={transportButtonClass} onClick={() => seek(-BOARD_MEDIA_SEEK_SECONDS)} aria-label="Tien seconden terug">
        <RotateCcw size={24} />
        {BOARD_MEDIA_SEEK_SECONDS}s
      </button>
      <button type="button" className={transportButtonClass} onClick={() => seek(BOARD_MEDIA_SEEK_SECONDS)} aria-label="Tien seconden vooruit">
        <RotateCw size={24} />
        {BOARD_MEDIA_SEEK_SECONDS}s
      </button>
      <button type="button" className={transportButtonClass} onClick={toggleMute} aria-label={muted ? 'Geluid aan' : 'Geluid uit'}>
        {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        {muted ? 'Geluid aan' : 'Geluid uit'}
      </button>
      <span className="ml-auto text-[20px] font-black tabular-nums text-slate-600">
        {formatMediaTime(position.current)} / {formatMediaTime(position.duration)}
      </span>
      {onOpenLarge ? (
        <button type="button" className={transportButtonClass} onClick={onOpenLarge} aria-label="Groot tonen">
          <Maximize2 size={24} />
          Groot
        </button>
      ) : null}
    </div>
  );
}

function BoardVideo({ mediaUrl, handoff, onOpenLarge, className = '' }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !handoff) return;
    element.muted = handoff.muted;
    element.currentTime = handoff.currentTime;
    if (handoff.wasPlaying) element.play?.().catch(() => {});
  }, [handoff]);

  return (
    <div className={`flex h-full min-h-0 flex-col ${className}`}>
      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl bg-slate-950">
        <video
          ref={videoRef}
          src={mediaUrl}
          playsInline
          className="h-full w-full bg-slate-950 object-contain"
          data-presenter-interactive="true"
        />
      </div>
      <VideoTransport
        videoRef={videoRef}
        onOpenLarge={onOpenLarge ? () => onOpenLarge(buildPlaybackHandoff(videoRef.current)) : null}
      />
    </div>
  );
}

export default function PresenterBoardMedia({ media = {}, title = 'Media' }) {
  const [largeOpen, setLargeOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [handoff, setHandoff] = useState(null);

  const mediaUrl = media.mediaUrl || '';
  const mode = getBoardMediaMode(media.mediaKind, mediaUrl);

  if (mode === BOARD_MEDIA_MODES.EMPTY) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-slate-500">
        <ImageIcon size={56} />
        <p className="text-[24px] font-black text-slate-800">Geen media gekoppeld</p>
      </div>
    );
  }

  if (mode === BOARD_MEDIA_MODES.VIDEO) {
    return (
      <>
        <BoardVideo
          mediaUrl={mediaUrl}
          onOpenLarge={(nextHandoff) => {
            setHandoff(nextHandoff);
            setLargeOpen(true);
          }}
          className="p-3"
        />
        {largeOpen ? (
          <BoardOverlay title={title} externalUrl={mediaUrl} onClose={() => setLargeOpen(false)}>
            <BoardVideo mediaUrl={mediaUrl} handoff={handoff} className="p-4" />
          </BoardOverlay>
        ) : null}
      </>
    );
  }

  if (mode === BOARD_MEDIA_MODES.EMBED) {
    const embedUrl = parseYouTubeUrl(mediaUrl)?.embedUrl;
    if (!embedUrl) {
      return (
        <div className="flex h-full items-center justify-center p-6 text-center text-[22px] font-black text-red-700">
          Deze YouTube-link is niet geldig.
        </div>
      );
    }

    const frame = (
      <iframe
        src={`${embedUrl}?rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full border-0 bg-slate-950"
        data-presenter-interactive="true"
      />
    );

    return (
      <>
        <div className="flex h-full min-h-0 flex-col p-3">
          <div className="min-h-0 flex-1 overflow-hidden rounded-2xl bg-slate-950">{frame}</div>
          <div className="flex shrink-0 items-center gap-3 pt-3" data-presenter-interactive="true">
            <button type="button" className={transportButtonClass} onClick={() => setLargeOpen(true)}>
              <Maximize2 size={24} />
              Groot tonen
            </button>
            <p className="text-[18px] font-bold text-slate-500">Afspelen doe je in de speler zelf.</p>
          </div>
        </div>
        {largeOpen ? (
          <BoardOverlay title={title} eyebrow="Video" externalUrl={mediaUrl} onClose={() => setLargeOpen(false)}>
            <iframe
              src={`${embedUrl}?rel=0&autoplay=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full border-0 bg-slate-950"
            />
          </BoardOverlay>
        ) : null}
      </>
    );
  }

  if (mode === BOARD_MEDIA_MODES.PDF) {
    return (
      <>
        <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
          <FileText className="text-slate-500" size={72} />
          <p className="max-w-[36rem] text-[26px] font-black leading-tight text-slate-950">{title}</p>
          <button
            type="button"
            onClick={() => setPdfOpen(true)}
            className="inline-flex h-16 items-center gap-3 rounded-2xl bg-slate-950 px-7 text-[20px] font-black text-slate-50"
            data-presenter-interactive="true"
          >
            <Maximize2 size={24} />
            Op het bord tonen
          </button>
        </div>
        {pdfOpen
          ? createPortal(
              <PdfSlideDeckPresenter
                slide={{ title, imageUrl: mediaUrl }}
                onClose={() => setPdfOpen(false)}
              />,
              document.body
            )
          : null}
      </>
    );
  }

  if (mode === BOARD_MEDIA_MODES.LINK) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
        <LinkIcon className="text-slate-500" size={60} />
        <p className="max-w-[36rem] text-[22px] font-bold leading-tight text-slate-700">
          Deze media staat op een externe website.
        </p>
        <a
          href={mediaUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-16 items-center gap-3 rounded-2xl bg-slate-950 px-7 text-[20px] font-black text-slate-50"
          data-presenter-interactive="true"
        >
          <ExternalLink size={24} />
          Link openen
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full min-h-0 flex-col p-3">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <img src={mediaUrl} alt={media.altText || title} className="max-h-full max-w-full rounded-xl object-contain" />
        </div>
        <div className="shrink-0 pt-3" data-presenter-interactive="true">
          <button type="button" className={transportButtonClass} onClick={() => setLargeOpen(true)}>
            <Maximize2 size={24} />
            Groot tonen
          </button>
        </div>
      </div>
      {largeOpen ? (
        <BoardOverlay title={title} eyebrow="Afbeelding" externalUrl={mediaUrl} onClose={() => setLargeOpen(false)}>
          <div className="flex h-full items-center justify-center p-6">
            <img src={mediaUrl} alt={media.altText || title} className="max-h-full max-w-full object-contain" />
          </div>
        </BoardOverlay>
      ) : null}
    </>
  );
}
