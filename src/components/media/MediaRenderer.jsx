import { useEffect, useRef, useState } from 'react';
import { ExternalLink, FileText, Link as LinkIcon, Maximize2 } from 'lucide-react';
import FullscreenSurface from '../common/FullscreenSurface';
import { useOndertitelTaal } from '../../hooks/useLesstofTaal';
import { MEDIA_KINDS, kiesOndertitelTaal, normalizeMediaContent, parseYouTubeUrl } from '../../lib/mediaUtils';

const getYoutubeEmbedUrl = (url) => parseYouTubeUrl(url)?.embedUrl || '';

export default function MediaRenderer({ media = {}, title = 'Media', variant = 'lesson' }) {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const voorkeurTaal = useOndertitelTaal();
  const isPresenter = variant === 'presenter';
  const normalizedMedia = normalizeMediaContent(media);
  const mediaKind = normalizedMedia.mediaKind;
  const mediaUrl = normalizedMedia.mediaUrl || '';
  const caption = normalizedMedia.caption || '';
  const altText = normalizedMedia.altText || title;
  const ondertitels = normalizedMedia.ondertitels;
  // De taal waarin de ondertitels staan: die van de leerling als de taalknop aan
  // staat en dit blok dat spoor heeft, anders Nederlands. Op het digibord (de
  // hele klas kijkt mee) negeren we de voorkeur: daar altijd Nederlands.
  const toonTaal = kiesOndertitelTaal(ondertitels, isPresenter ? '' : voorkeurTaal);
  const poster = normalizedMedia.thumbnailUrl || '';
  const canOpen = Boolean(mediaUrl);

  if (!mediaUrl) {
    return (
      <div className="rounded-3xl border border-dashed border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-8 text-center">
        <FileText className="mx-auto text-[var(--helix-muted)]" size={38} />
        <p className="mt-3 font-black text-[var(--helix-navy)]">Geen media gekoppeld</p>
      </div>
    );
  }

  return (
    <figure className={isPresenter ? 'h-full w-full' : 'space-y-3'}>
      <FullscreenSurface
        active={fullscreenOpen}
        onActiveChange={setFullscreenOpen}
        eyebrow="Media"
        title={title}
        externalUrl={mediaUrl}
        inactiveClassName={`relative overflow-hidden rounded-3xl border border-[var(--helix-border)] bg-white shadow-[var(--helix-shadow-soft)] ${isPresenter ? 'flex h-full min-h-0 items-center justify-center' : ''}`}
      >
        {({ active }) => (
          <>
            <MediaSurface
              mediaKind={mediaKind}
              mediaUrl={mediaUrl}
              title={title}
              altText={altText}
              ondertitels={ondertitels}
              toonTaal={toonTaal}
              poster={poster}
              presenter={isPresenter && !active}
              fullscreen={active}
            />
            {canOpen && !active && (
              <button
                type="button"
                onClick={() => setFullscreenOpen(true)}
                className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm font-black text-[var(--helix-navy)] shadow-lg backdrop-blur transition hover:bg-white"
              >
                <Maximize2 size={16} />
                Open groot
              </button>
            )}
          </>
        )}
      </FullscreenSurface>

      {caption && !isPresenter && (
        <figcaption className="px-1 text-sm font-semibold leading-6 text-[var(--helix-muted)]">{caption}</figcaption>
      )}
    </figure>
  );
}

function MediaSurface({ mediaKind, mediaUrl, title, altText, ondertitels = [], toonTaal = '', poster = '', fullscreen = false, presenter = false }) {
  const frameClass = fullscreen || presenter ? 'h-full w-full' : 'aspect-video w-full';
  const videoRef = useRef(null);
  const vorigeTaal = useRef(toonTaal);

  // Zet het spoor van de gekozen taal aan en de rest uit, maar alleen als die
  // taal verandert NA het laden. Zo wisselt de ondertitel mee als de leerling in
  // de les de taalknop omzet. Een gewone re-render raakt de tracks niet aan, dus
  // een leerling die via de CC-knop de ondertitels uitzette ziet ze niet
  // terugkomen.
  //
  // De eerste keer slaan we over: de beginkeuze is het default-attribuut op de
  // <track>. Zetten we de modes al bij het laden, dan ziet Chrome en Edge de
  // andere sporen als ongeconfigureerd (disabled op iets dat al disabled is
  // verandert niets) en zet zijn eigen automatische keuze er een aan: twee
  // ondertitels tegelijk.
  useEffect(() => {
    if (vorigeTaal.current === toonTaal) return;
    vorigeTaal.current = toonTaal;
    const tracks = videoRef.current?.textTracks;
    if (!tracks) return;
    const sporen = Array.from({ length: tracks.length }, (_, index) => tracks[index])
      .filter((spoor) => spoor.kind === 'subtitles' || spoor.kind === 'captions');
    // Eerst alles uit, dan pas het gekozen spoor aan; Chromium let op die volgorde.
    sporen.forEach((spoor) => { spoor.mode = 'disabled'; });
    sporen
      .filter((spoor) => toonTaal && spoor.language === toonTaal)
      .forEach((spoor) => { spoor.mode = 'showing'; });
  }, [toonTaal]);

  if (mediaKind === MEDIA_KINDS.YOUTUBE) {
    const embedUrl = getYoutubeEmbedUrl(mediaUrl);
    if (!embedUrl) {
      return <UnsupportedMedia message="Deze YouTube-link is niet geldig." />;
    }

    return (
      <iframe
        src={`${embedUrl}?rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className={`${frameClass} border-0 bg-black`}
      />
    );
  }

  if (mediaKind === MEDIA_KINDS.VIDEO) {
    // crossOrigin alleen bij ondertitels: een .vtt van Storage is een ander
    // domein en wordt anders geblokkeerd. Zonder ondertitels blijft alles zoals
    // het was, zodat video's van sites zonder CORS blijven spelen.
    const heeftOndertitels = ondertitels.length > 0;
    return (
      <video
        ref={videoRef}
        src={mediaUrl}
        controls
        playsInline
        poster={poster || undefined}
        crossOrigin={heeftOndertitels ? 'anonymous' : undefined}
        className={`${frameClass} bg-black object-contain`}
      >
        {ondertitels.map((spoor) => (
          <track
            key={`${spoor.taal}-${spoor.url}`}
            kind="subtitles"
            srcLang={spoor.taal}
            label={spoor.label}
            src={spoor.url}
            default={spoor.taal === toonTaal}
          />
        ))}
      </video>
    );
  }

  if (mediaKind === MEDIA_KINDS.PDF) {
    return (
      <iframe
        src={mediaUrl}
        title={title}
        className={`${frameClass} border-0 bg-white`}
      />
    );
  }

  if (mediaKind === MEDIA_KINDS.LINK) {
    return (
      <div className={`${frameClass} flex flex-col items-center justify-center gap-3 bg-[var(--helix-surface-soft)] p-6 text-center`}>
        <LinkIcon className="text-[var(--helix-purple)]" size={38} />
        <p className="max-w-xl text-sm font-bold leading-6 text-[var(--helix-navy)]">
          Deze media staat op een externe website.
        </p>
        <a
          href={mediaUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--helix-border)] bg-white px-4 py-2 text-sm font-black text-[var(--helix-navy)] shadow-sm transition hover:border-[var(--helix-purple)]/30 hover:bg-[var(--helix-soft-lavender)]"
        >
          <ExternalLink size={16} />
          Open link
        </a>
      </div>
    );
  }

  return (
    <div className={`${frameClass} flex items-center justify-center bg-[var(--helix-surface-soft)] p-3`}>
      <img src={mediaUrl} alt={altText} className="max-h-full max-w-full rounded-2xl object-contain" />
    </div>
  );
}

function UnsupportedMedia({ message }) {
  return (
    <div className="flex aspect-video w-full items-center justify-center bg-red-50 p-6 text-center text-sm font-bold text-red-700">
      {message}
    </div>
  );
}
