import { getPresenterStrokeStyle } from '../../lib/presenterModel';
import { getAxesModel, getAxesOriginRatio } from '../../lib/presenterAxes';
import {
  getPresenterImportedObjectKind,
  getPresenterImportedObjectModel
} from './presenterContentObjectUtils.js';

const DEFAULT_PAGE_WIDTH = 1920;
const DEFAULT_PAGE_HEIGHT = 1400;
const DEFAULT_GRID_SIZE = 96;
const MAX_GRID_LINES = 36;
const MAX_STROKES = 42;
const MAX_OBJECTS = 24;
const MAX_POINTS_PER_STROKE = 80;

const isFinitePositiveNumber = (value) => Number.isFinite(value) && value > 0;
const isFiniteNumber = (value) => Number.isFinite(value);
const getNumber = (value, fallback = 0) => (isFiniteNumber(value) ? value : fallback);

const getPageSize = (page) => ({
  width: isFinitePositiveNumber(page?.width) ? page.width : DEFAULT_PAGE_WIDTH,
  height: isFinitePositiveNumber(page?.height) ? page.height : DEFAULT_PAGE_HEIGHT
});

const getPathData = (points = []) => {
  const validPoints = points.filter((point) => isFiniteNumber(point?.x) && isFiniteNumber(point?.y));
  if (validPoints.length === 0) return '';

  const step = Math.max(1, Math.ceil(validPoints.length / MAX_POINTS_PER_STROKE));
  const sampledPoints = validPoints.filter((_, index) => index % step === 0);
  const visiblePoints = sampledPoints.at(-1) === validPoints.at(-1) ? sampledPoints : [...sampledPoints, validPoints.at(-1)];
  const [firstPoint, ...restPoints] = visiblePoints;

  return [`M ${firstPoint.x} ${firstPoint.y}`, ...restPoints.map((point) => `L ${point.x} ${point.y}`)].join(' ');
};

const getObjectFrame = (object) => ({
  x: getNumber(object?.x),
  y: getNumber(object?.y),
  width: getNumber(object?.width, 140),
  height: getNumber(object?.height, 90),
  rotation: getNumber(object?.rotation)
});

const getObjectStyle = (object) => ({
  fill: object?.fill || object?.style?.fill || 'rgba(255,255,255,0.78)',
  stroke: object?.stroke || object?.style?.stroke || '#334155',
  strokeWidth: isFinitePositiveNumber(object?.strokeWidth) ? object.strokeWidth : 7
});

const getPolygonPoints = (object, width, height) => {
  const points = Array.isArray(object?.points) ? object.points : [];
  const validPoints = points.filter((point) => isFiniteNumber(point?.x) && isFiniteNumber(point?.y));

  if (validPoints.length > 0) {
    return validPoints.map((point) => `${point.x},${point.y}`).join(' ');
  }

  return `0,${height} ${width * 0.5},0 ${width},${height}`;
};

const getImportedObjectLabel = (object) => {
  const model = getPresenterImportedObjectModel(object);
  const kind = getPresenterImportedObjectKind(object);

  if (model?.label) return model.label;
  if (kind === 'question') return 'Vraag';
  if (kind === 'media') return 'Media';
  if (kind === 'slidedeck') return 'Deck';
  return 'Lesstof';
};

function ThumbnailBackground({ background, width, height }) {
  if (background?.kind !== 'grid' && background?.kind !== 'lines') return null;

  const gridSize = isFinitePositiveNumber(background?.gridSize) ? background.gridSize : DEFAULT_GRID_SIZE;
  const lineStep = Math.max(gridSize, height / MAX_GRID_LINES);
  const rowCount = Math.min(MAX_GRID_LINES, Math.floor(height / lineStep));
  const columnStep = Math.max(gridSize, width / MAX_GRID_LINES);
  const columnCount = Math.min(MAX_GRID_LINES, Math.floor(width / columnStep));
  const rows = Array.from({ length: rowCount }, (_, index) => (index + 1) * lineStep);
  const columns = Array.from({ length: columnCount }, (_, index) => (index + 1) * columnStep);

  return (
    <g stroke="#cbd5e1" strokeWidth={3} vectorEffect="non-scaling-stroke">
      {background.kind === 'grid'
        ? columns.map((x) => <line key={`grid-x-${x}`} x1={x} x2={x} y1={0} y2={height} />)
        : null}
      {rows.map((y) => <line key={`grid-y-${y}`} x1={0} x2={width} y1={y} y2={y} />)}
    </g>
  );
}

function ThumbnailStroke({ stroke }) {
  const pathData = getPathData(Array.isArray(stroke?.points) ? stroke.points : []);
  if (!pathData) return null;

  const style = getPresenterStrokeStyle(stroke);

  return (
    <path
      d={pathData}
      fill="none"
      stroke={style.color}
      strokeLinecap={style.lineCap}
      strokeLinejoin={style.lineJoin}
      strokeOpacity={stroke?.variant === 'highlighter' ? 0.38 : style.opacity}
      strokeWidth={Math.max(style.width, stroke?.variant === 'highlighter' ? 18 : 7)}
    />
  );
}

function ThumbnailObject({ object }) {
  if (!object?.id && !object?.type) return null;

  const { x, y, width, height, rotation } = getObjectFrame(object);
  const style = getObjectStyle(object);
  const centerX = width / 2;
  const centerY = height / 2;
  const rectX = Math.min(0, width);
  const rectY = Math.min(0, height);
  const rectWidth = Math.max(1, Math.abs(width));
  const rectHeight = Math.max(1, Math.abs(height));
  const importedKind = getPresenterImportedObjectKind(object);
  const shapeProps = {
    fill: style.fill,
    stroke: style.stroke,
    strokeWidth: style.strokeWidth,
    vectorEffect: 'non-scaling-stroke'
  };

  const renderShape = () => {
    if (importedKind) {
      const fill = importedKind === 'question' ? '#eff6ff' : '#f8fafc';
      const stroke = importedKind === 'question' ? '#2563eb' : '#64748b';

      return (
        <>
          <rect fill={fill} height={rectHeight} rx={18} stroke={stroke} strokeWidth={8} width={rectWidth} x={rectX} y={rectY} />
          <line x1={rectX + 36} x2={rectX + rectWidth - 36} y1={rectY + 48} y2={rectY + 48} stroke={stroke} strokeOpacity="0.45" strokeWidth={7} />
          <line x1={rectX + 36} x2={rectX + rectWidth * 0.72} y1={rectY + 86} y2={rectY + 86} stroke={stroke} strokeOpacity="0.28" strokeWidth={7} />
          <text
            fill={stroke}
            fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
            fontSize={44}
            fontWeight={900}
            textLength={Math.max(120, rectWidth - 70)}
            x={rectX + 36}
            y={rectY + rectHeight - 32}
          >
            {getImportedObjectLabel(object)}
          </text>
        </>
      );
    }

    switch (object?.type) {
      case 'ellipse':
        return (
          <ellipse
            cx={width / 2}
            cy={height / 2}
            fill={style.fill}
            rx={Math.max(1, Math.abs(width) / 2)}
            ry={Math.max(1, Math.abs(height) / 2)}
            stroke={style.stroke}
            strokeWidth={style.strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        );
      case 'line':
      case 'arrow':
        return (
          <line
            stroke={style.stroke}
            strokeLinecap="round"
            strokeWidth={style.strokeWidth}
            vectorEffect="non-scaling-stroke"
            x1={0}
            x2={width}
            y1={0}
            y2={height}
          />
        );
      case 'triangle':
        return <polygon {...shapeProps} points={`0,${height} ${width / 2},0 ${width},${height}`} strokeLinejoin="round" />;
      case 'polygon':
        return <polygon {...shapeProps} points={getPolygonPoints(object, width, height)} strokeLinejoin="round" />;
      case 'axes': {
        // Alleen de twee assen op de plek waar het bereik ze legt. Getallen en
        // maatstreepjes horen niet in een miniatuur: het paginapaneel tekent
        // alle pagina's tegelijk en moet goedkoop blijven.
        const origin = getAxesOriginRatio(getAxesModel(object, DEFAULT_GRID_SIZE).range);

        return (
          <g fill="none" stroke={style.stroke} strokeLinecap="round" strokeWidth={style.strokeWidth} vectorEffect="non-scaling-stroke">
            <line x1={width * origin.x} x2={width * origin.x} y1={height} y2={0} />
            <line x1={0} x2={width} y1={height * origin.y} y2={height * origin.y} />
          </g>
        );
      }
      case 'table':
        return (
          <g {...shapeProps} fill={style.fill}>
            <rect height={rectHeight} width={rectWidth} x={rectX} y={rectY} />
            <line x1={rectX + rectWidth / 2} x2={rectX + rectWidth / 2} y1={rectY} y2={rectY + rectHeight} />
            <line x1={rectX} x2={rectX + rectWidth} y1={rectY + rectHeight / 2} y2={rectY + rectHeight / 2} />
          </g>
        );
      case 'angle':
        return (
          <g fill="none" stroke={style.stroke} strokeLinecap="round" strokeWidth={style.strokeWidth} vectorEffect="non-scaling-stroke">
            <line x1={0} x2={width} y1={height} y2={height} />
            <line x1={0} x2={width * 0.7} y1={height} y2={0} />
            <path d={`M ${width * 0.28} ${height} A ${width * 0.28} ${height * 0.28} 0 0 0 ${width * 0.2} ${height * 0.62}`} />
          </g>
        );
      case 'rectangle':
      default:
        return <rect {...shapeProps} height={rectHeight} width={rectWidth} x={rectX} y={rectY} />;
    }
  };

  return <g transform={`translate(${x} ${y}) rotate(${rotation} ${centerX} ${centerY})`}>{renderShape()}</g>;
}

export default function PresenterPageThumbnail({ page, pageNumber, active = false }) {
  const { width, height } = getPageSize(page);
  const strokes = Array.isArray(page?.strokes) ? page.strokes : [];
  const objects = Array.isArray(page?.objects) ? page.objects : [];
  const highlighterStrokes = strokes.filter((stroke) => stroke?.variant === 'highlighter').slice(-MAX_STROKES);
  const penStrokes = strokes.filter((stroke) => stroke?.variant !== 'highlighter').slice(-MAX_STROKES);
  const visibleObjects = objects.slice(-MAX_OBJECTS);

  return (
    <div
      aria-hidden="true"
      className={`relative aspect-[16/11] w-24 shrink-0 overflow-hidden rounded border bg-slate-50 shadow-sm ${
        active ? 'border-slate-950 ring-2 ring-slate-950/15' : 'border-slate-300'
      }`}
    >
      <svg className="h-full w-full" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
        <rect fill="#f8fafc" height={height} width={width} />
        <ThumbnailBackground background={page?.background} height={height} width={width} />
        {visibleObjects.map((object, index) => (
          <ThumbnailObject key={object?.id || `${object?.type || 'object'}-${index}`} object={object} />
        ))}
        {highlighterStrokes.map((stroke, index) => (
          <ThumbnailStroke key={stroke?.id || `highlighter-${index}`} stroke={stroke} />
        ))}
        {penStrokes.map((stroke, index) => (
          <ThumbnailStroke key={stroke?.id || `pen-${index}`} stroke={stroke} />
        ))}
      </svg>
      <span className="absolute left-1 top-1 flex h-6 min-w-6 items-center justify-center rounded bg-slate-950 px-1 text-xs font-black text-slate-50">
        {pageNumber}
      </span>
    </div>
  );
}
