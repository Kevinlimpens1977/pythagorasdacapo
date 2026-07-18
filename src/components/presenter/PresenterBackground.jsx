import { getGridLineStyle } from '../../lib/presenterGeometry';

// Achtergronden voor het bord: lijntjes, ruitjes, millimeterpapier en
// assenstelsel. Kleuren passen zich aan de donkere bordmodus aan.

export default function PresenterBackground({ background, scale = 1, theme = 'light' }) {
  if (!background) return null;

  const lineColor = theme === 'dark' ? 'rgba(148, 163, 184, 0.32)' : 'rgba(148, 163, 184, 0.38)';
  const gridColor = theme === 'dark' ? 'rgba(148, 163, 184, 0.26)' : 'rgba(148, 163, 184, 0.3)';
  const fineColor = theme === 'dark' ? 'rgba(148, 163, 184, 0.14)' : 'rgba(148, 163, 184, 0.16)';
  const axisColor = theme === 'dark' ? 'rgba(226, 232, 240, 0.55)' : 'rgba(51, 65, 85, 0.55)';

  if (background.kind === 'lines') {
    const { lineSize } = getGridLineStyle({
      gridSize: background.gridSize || 96,
      scale
    });

    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent calc(100% - 1px), ${lineColor} 1px)`,
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
          backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
          backgroundSize
        }}
      />
    );
  }

  if (background.kind === 'mm') {
    const { backgroundSize, lineSize } = getGridLineStyle({
      gridSize: background.gridSize || 96,
      scale
    });
    const fineSize = Math.max(2, Math.round(lineSize / 4));

    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            `linear-gradient(to right, ${gridColor} 1px, transparent 1px)`,
            `linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
            `linear-gradient(to right, ${fineColor} 1px, transparent 1px)`,
            `linear-gradient(to bottom, ${fineColor} 1px, transparent 1px)`
          ].join(', '),
          backgroundSize: `${backgroundSize}, ${backgroundSize}, ${fineSize}px ${fineSize}px, ${fineSize}px ${fineSize}px`
        }}
      />
    );
  }

  if (background.kind === 'axes') {
    const { backgroundSize } = getGridLineStyle({
      gridSize: background.gridSize || 96,
      scale
    });

    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
            backgroundSize
          }}
        />
        <div className="absolute inset-y-0 left-1/2 w-[2px]" style={{ backgroundColor: axisColor }} />
        <div className="absolute inset-x-0 top-1/2 h-[2px]" style={{ backgroundColor: axisColor }} />
      </div>
    );
  }

  return null;
}
