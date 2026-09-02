import { getPresenterStrokeStyle } from '../../lib/presenterModel';
import { buildStrokeRenderPath } from '../../lib/presenterInk';

const DEFAULT_PAGE_WIDTH = 1920;
const DEFAULT_PAGE_HEIGHT = 1400;

const isFinitePositiveNumber = (value) => Number.isFinite(value) && value > 0;

// In de donkere bordmodus worden donkere inktkleuren automatisch licht,
// zodat bestaand werk leesbaar blijft.
const DARK_THEME_COLOR_MAP = {
  '#0B0D0F': '#F5EDDB',
  '#0b132b': '#F5EDDB'
};

const resolveStrokeColor = (color, theme) =>
  (theme === 'dark' && DARK_THEME_COLOR_MAP[String(color || '').toLowerCase()]) || color;

const renderStroke = (stroke, opacity, theme) => {
  const style = getPresenterStrokeStyle(stroke);
  const baseWidth = isFinitePositiveNumber(style.width) ? style.width : 5;
  // Zelfde bron als de live preview op canvas (zie PresenterBoard), zodat wat
  // je tijdens het tekenen ziet exact is wat er blijft staan.
  const render = buildStrokeRenderPath(stroke, baseWidth);
  if (!render.d) return null;

  const color = resolveStrokeColor(style.color, theme);

  if (render.mode === 'fill') {
    return (
      <path
        key={stroke.id || render.d}
        d={render.d}
        fill={color}
        fillOpacity={opacity ?? style.opacity}
        stroke="none"
      />
    );
  }

  return (
    <path
      key={stroke.id || render.d}
      d={render.d}
      fill="none"
      stroke={color}
      strokeLinecap={style.lineCap}
      strokeLinejoin={style.lineJoin}
      strokeOpacity={opacity ?? style.opacity}
      strokeWidth={render.width}
    />
  );
};

export default function PresenterInkLayer({ page, theme = 'light' }) {
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
        {highlighterStrokes.map((stroke) => renderStroke(stroke, 0.36, theme))}
      </svg>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox={viewBox}
      >
        {penStrokes.map((stroke) => renderStroke(stroke, 1, theme))}
      </svg>
    </>
  );
}
