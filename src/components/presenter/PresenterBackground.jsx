import { getGridLineStyle } from '../../lib/presenterGeometry';

export default function PresenterBackground({ background, scale = 1 }) {
  if (!background) return null;

  if (background.kind === 'lines') {
    const lineSize = Math.max(1, Math.round((background.gridSize || 96) * scale));

    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(to bottom, transparent calc(100% - 1px), rgba(148, 163, 184, 0.38) 1px)',
          backgroundSize: `100% ${lineSize}px`
        }}
      />
    );
  }

  if (background.kind === 'grid') {
    const { backgroundSize } = getGridLineStyle({
      gridSize: background.gridSize || 96,
      scale
    });

    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(148, 163, 184, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.3) 1px, transparent 1px)',
          backgroundSize
        }}
      />
    );
  }

  return null;
}
