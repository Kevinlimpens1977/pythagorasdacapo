// Smart guides voor het verslepen van objecten: snap op linker-/midden-/
// rechterkant (en boven/midden/onder) van andere objecten binnen tolerantie.

const DEFAULT_TOLERANCE = 6;

const isFiniteNumber = (value) => Number.isFinite(value);

const getEdges = (bounds) => ({
  startEdge: bounds.x,
  center: bounds.x + bounds.width / 2,
  endEdge: bounds.x + bounds.width
});

const getEdgesY = (bounds) => ({
  startEdge: bounds.y,
  center: bounds.y + bounds.height / 2,
  endEdge: bounds.y + bounds.height
});

const findBestSnap = (movingEdges, otherEdgesList, tolerance) => {
  let best = null;

  for (const otherEdges of otherEdgesList) {
    for (const movingValue of Object.values(movingEdges)) {
      for (const otherValue of Object.values(otherEdges)) {
        const diff = otherValue - movingValue;
        if (Math.abs(diff) <= tolerance && (!best || Math.abs(diff) < Math.abs(best.diff))) {
          best = { diff, guide: otherValue };
        }
      }
    }
  }

  return best;
};

// movingBounds: bounds van de selectie op de (ruwe) doelplek.
// otherBoundsList: bounds van de overige objecten op de pagina.
// Resultaat: extra correctie {dx,dy} plus hulplijnen om te renderen.
export const getAlignmentSnap = (movingBounds, otherBoundsList = [], { tolerance = DEFAULT_TOLERANCE } = {}) => {
  if (!movingBounds || !isFiniteNumber(movingBounds.x) || !isFiniteNumber(movingBounds.y)) {
    return { dx: 0, dy: 0, guides: [] };
  }

  const others = otherBoundsList.filter(
    (bounds) => bounds && isFiniteNumber(bounds.x) && isFiniteNumber(bounds.y)
  );
  if (others.length === 0) return { dx: 0, dy: 0, guides: [] };

  const snapX = findBestSnap(getEdges(movingBounds), others.map(getEdges), tolerance);
  const snapY = findBestSnap(getEdgesY(movingBounds), others.map(getEdgesY), tolerance);

  const guides = [];
  if (snapX) guides.push({ axis: 'vertical', position: snapX.guide });
  if (snapY) guides.push({ axis: 'horizontal', position: snapY.guide });

  return {
    dx: snapX ? snapX.diff : 0,
    dy: snapY ? snapY.diff : 0,
    guides
  };
};
