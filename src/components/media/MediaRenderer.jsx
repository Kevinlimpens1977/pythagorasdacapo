import { useState } from 'react';
import { ExternalLink, FileText, Link as LinkIcon, Maximize2 } from 'lucide-react';
import FullscreenSurface from '../common/FullscreenSurface';
import { MEDIA_KINDS, normalizeMediaContent, parseYouTubeUrl } from '../../lib/mediaUtils';

const getYoutubeEmbedUrl = (url) => parseYouTubeUrl(url)?.embedUrl || '';

export default function MediaRenderer({ media = {}, title = 'Media', variant = 'lesson' }) {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const normalizedMedia = normalizeMediaContent(media);
  const mediaKind = normalizedMedia.mediaKind;
  const mediaUrl = normalizedMedia.mediaUrl || '';
  const caption = normalizedMedia.caption || '';
  const altText = normalizedMedia.altText || title;
  const canOpen = Boolean(mediaUrl);
  const isPresenter = variant === 'presenter';

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

function MediaSurface({ mediaKind, mediaUrl, title, altText, fullscreen = false, presenter = false }) {
  const frameClass = fullscreen || presenter ? 'h-full w-full' : 'aspect-video w-full';

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
    return (
      <video
        src={mediaUrl}
        controls
        playsInline
        className={`${frameClass} bg-black object-contain`}
      />
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
