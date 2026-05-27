const DEFAULT_PAGE_WIDTH = 1920;
const DEFAULT_PAGE_HEIGHT = 1400;

const isFinitePositiveNumber = (value) => Number.isFinite(value) && value > 0;

const getPathData = (points = []) => {
  const validPoints = points.filter((point) => Number.isFinite(point?.x) && Number.isFinite(point?.y));
  if (validPoints.length === 0) return '';

  const [firstPoint, ...restPoints] = validPoints;
  const commands = [`M ${firstPoint.x} ${firstPoint.y}`];

  if (restPoints.length === 0) {
    commands.push(`L ${firstPoint.x} ${firstPoint.y}`);
  } else {
    commands.push(...restPoints.map((point) => `L ${point.x} ${point.y}`));
  }

  return commands.join(' ');
};

const renderStroke = (stroke, opacity) => {
  const pathData = getPathData(Array.isArray(stroke?.points) ? stroke.points : []);
  if (!pathData) return null;

  return (
    <path
      key={stroke.id || pathData}
      d={pathData}
      fill="none"
      stroke={stroke.color || '#111827'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={opacity}
      strokeWidth={isFinitePositiveNumber(stroke.width) ? stroke.width : 5}
    />
  );
};

export default function PresenterInkLayer({ page }) {
  const width = isFinitePositiveNumber(page?.width) ? page.width : DEFAULT_PAGE_WIDTH;
  const height = isFinitePositiveNumber(page?.height) ? page.height : DEFAULT_PAGE_HEIGHT;
  const strokes = Array.isArray(page?.strokes) ? page.strokes : [];
  const highlighterStrokes = strokes.filter((stroke) => stroke?.variant === 'highlighter');
  const penStrokes = strokes.filter((stroke) => stroke?.variant !== 'highlighter');
  const viewBox = `0 0 ${width} ${height}`;

  return (
    <>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox={viewBox}
      >
        {highlighterStrokes.map((stroke) => renderStroke(stroke, 0.36))}
      </svg>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox={viewBox}
      >
        {penStrokes.map((stroke) => renderStroke(stroke, 1))}
      </svg>
    </>
  );
}
