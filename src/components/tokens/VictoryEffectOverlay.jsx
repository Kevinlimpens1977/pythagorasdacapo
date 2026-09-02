import { useEffect, useMemo } from 'react';

const CONFETTI_COLORS = ['#D83A2E', '#F47A20', '#2E9D63', '#087EB5', '#793AC7', '#FFD33D'];

// Vaste pseudo-random spreiding zodat het effect rustig en reproduceerbaar blijft.
const buildPieces = (variant) => {
  const count = variant === 'full' ? 18 : 8;
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: `${(7 + index * 97) % 100}%`,
    delay: `${(index % 6) * 0.12}s`,
    duration: `${1.7 + ((index * 37) % 10) / 9}s`,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    drift: index % 2 === 0 ? 1 : -1
  }));
};

export default function VictoryEffectOverlay({ playback, onDone }) {
  useEffect(() => {
    if (!playback) return undefined;
    const timeout = window.setTimeout(() => onDone?.(), playback.durationMs || 3000);
    return () => window.clearTimeout(timeout);
  }, [playback, onDone]);

  const pieces = useMemo(
    () => (playback ? buildPieces(playback.variant) : []),
    [playback]
  );

  if (!playback) return null;

  return (
    <div
      className={`victory-overlay victory-overlay-${playback.variant} victory-effect-${playback.effect}`}
      style={{ '--victory-accent': playback.accent }}
      aria-hidden="true"
    >
      {playback.effect === 'aurora' ? (
        <div className="victory-aurora" />
      ) : (
        <div className="victory-pieces">
          {pieces.map((piece) => (
            playback.effect === 'confetti' ? (
              <span
                key={piece.id}
                className="victory-confetti"
                style={{
                  left: piece.left,
                  animationDelay: piece.delay,
                  animationDuration: piece.duration,
                  background: piece.color,
                  '--victory-drift': piece.drift
                }}
              />
            ) : (
              <span
                key={piece.id}
                className="victory-star"
                style={{
                  left: piece.left,
                  animationDelay: piece.delay,
                  animationDuration: piece.duration
                }}
              >
                ✦
              </span>
            )
          ))}
        </div>
      )}
      <div className="victory-chip">
        <p className="victory-chip-heading">{playback.heading}</p>
        {playback.title ? <p className="victory-chip-title">{playback.title}</p> : null}
      </div>
    </div>
  );
}
