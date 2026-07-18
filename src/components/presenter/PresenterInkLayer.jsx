import { getPresenterStrokeStyle } from '../../lib/presenterModel';
import { buildSmoothedStrokePath, getStrokePressureWidth } from '../../lib/presenterInk';

const DEFAULT_PAGE_WIDTH = 1920;
const DEFAULT_PAGE_HEIGHT = 1400;

const isFinitePositiveNumber = (value) => Number.isFinite(value) && value > 0;

const renderStroke = (stroke, opacity) => {
  const pathData = buildSmoothedStrokePath(Array.isArray(stroke?.points) ? stroke.points : []);
  if (!pathData) return null;
  const style = getPresenterStrokeStyle(stroke);
  const baseWidth = isFinitePositiveNumber(style.width) ? style.width : 5;

  return (
    <path
      key={stroke.id || pathData}
      d={pathData}
      fill="none"
      stroke={style.color}
      strokeLinecap={style.lineCap}
      strokeLinejoin={style.lineJoin}
      strokeOpacity={opacity ?? style.opacity}
      strokeWidth={getStrokePressureWidth(stroke, baseWidth)}
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
