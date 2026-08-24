import { useCallback, useEffect, useId, useRef } from 'react';
import PresenterImportedObjectCard from './PresenterImportedObjectCard';
import PresenterMathToolObject from './PresenterMathToolObject';
import { isPresenterImportedObject } from './presenterContentObjectUtils.js';
import { isPresenterMathToolObject } from '../../lib/presenterObjects';
import { getAngleFrameGeometry } from '../../lib/presenterAngleTool';
import { AXES_ARROW, AXES_DEFAULT_GRID_SIZE, AXES_FONT_STACK, getAxesGeometry } from '../../lib/presenterAxes';
import PresenterAngleShape from './PresenterAngleShape';

const DEFAULT_PAGE_WIDTH = 1920;
const DEFAULT_PAGE_HEIGHT = 1400;
const DEFAULT_STROKE = '#111827';
const DEFAULT_FILL = 'rgba(255, 255, 255, 0.72)';
const SELECTION_COLOR = '#2563eb';
const DELETE_COLOR = '#dc2626';
const MIN_TOUCH_STROKE_WIDTH = 44;

const isFiniteNumber = (value) => Number.isFinite(value);
const isFinitePositiveNumber = (value) => Number.isFinite(value) && value > 0;

const getNumber = (value, fallback = 0) => (isFiniteNumber(value) ? value : fallback);

const getObjectFrame = (object) => ({
  x: getNumber(object?.x),
  y: getNumber(object?.y),
  width: getNumber(object?.width, 120),
  height: getNumber(object?.height, 80),
  rotation: getNumber(object?.rotation)
});

const getObjectStyle = (object) => ({
  fill: object?.fill || object?.style?.fill || DEFAULT_FILL,
  stroke: object?.stroke || object?.style?.stroke || DEFAULT_STROKE,
  strokeWidth: isFinitePositiveNumber(object?.strokeWidth) ? object.strokeWidth : 5
});

export const PRESENTER_TEXT_PLACEHOLDER = 'Typ je tekst...';

const getTextContent = (object) => {
  const value = object?.content?.text ?? object?.text ?? '';
  return typeof value === 'string' ? value : String(value ?? '');
};

const getTextStyle = (object) => ({
  bold: Boolean(object?.textStyle?.bold),
  italic: Boolean(object?.textStyle?.italic),
  color: object?.textStyle?.color || DEFAULT_STROKE,
  fontSize: isFinitePositiveNumber(object?.textStyle?.fontSize) ? object.textStyle.fontSize : 48,
  fontFamily: object?.textStyle?.fontFamily || 'helix',
  align: object?.textStyle?.align || 'left'
});

const getTextFontFamily = (fontFamily) => {
  if (fontFamily === 'dyslexia') {
    return 'Atkinson Hyperlegible, Verdana, Arial, sans-serif';
  }

  if (fontFamily === 'handwriting') {
    return '"Comic Sans MS", "Segoe Print", cursive';
  }

  return 'Sora, Inter, system-ui, sans-serif';
};

const moveCaretToEnd = (element) => {
  if (!element || typeof window === 'undefined') return;

  const selection = window.getSelection?.();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};

const getTextSelectionOffsets = (element) => {
  if (!element || typeof window === 'undefined' || typeof document === 'undefined') return null;

  const selection = window.getSelection?.();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const isInsideElement = (node) => node === element || (node && element.contains(node));
  if (!isInsideElement(range.startContainer) || !isInsideElement(range.endContainer)) return null;

  const start = getInnerTextOffsetForDomPosition(element, range.startContainer, range.startOffset);
  const end = getInnerTextOffsetForDomPosition(element, range.endContainer, range.endOffset);
  if (!isFiniteNumber(start) || !isFiniteNumber(end)) return null;

  return { start, end };
};

const getNodePath = (root, node) => {
  if (node === root) return [];
  if (!node || !root.contains(node)) return null;

  const path = [];
  let current = node;
  while (current && current !== root) {
    const parent = current.parentNode;
    if (!parent) return null;
    path.unshift(Array.prototype.indexOf.call(parent.childNodes, current));
    current = parent;
  }

  return current === root ? path : null;
};

const getNodeByPath = (root, path) => {
  let current = root;

  for (const index of path) {
    current = current?.childNodes?.[index] ?? null;
    if (!current) return null;
  }

  return current;
};

const getElementText = (element) => element?.innerText ?? element?.textContent ?? '';

const getInnerTextOffsetForDomPosition = (element, container, offset) => {
  if (!element || !container || typeof document === 'undefined' || typeof window === 'undefined') return null;

  const path = getNodePath(element, container);
  if (!path) return null;

  const nodeTypes = window.Node;
  if (!nodeTypes) return null;

  const marker = `\uE000presenter-caret-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}\uE001`;
  const clone = element.cloneNode(true);
  const cloneContainer = getNodeByPath(clone, path);
  if (!cloneContainer) return null;

  try {
    if (cloneContainer.nodeType === nodeTypes.TEXT_NODE) {
      const text = cloneContainer.textContent ?? '';
      const safeOffset = Math.max(0, Math.min(text.length, getNumber(offset)));
      cloneContainer.textContent = `${text.slice(0, safeOffset)}${marker}${text.slice(safeOffset)}`;
    } else {
      const childOffset = Math.max(0, Math.min(cloneContainer.childNodes?.length ?? 0, getNumber(offset)));
      cloneContainer.insertBefore(document.createTextNode(marker), cloneContainer.childNodes?.[childOffset] ?? null);
    }

    clone.setAttribute('aria-hidden', 'true');
    clone.setAttribute('tabindex', '-1');
    clone.style.position = 'fixed';
    clone.style.left = '-10000px';
    clone.style.top = '0';
    clone.style.opacity = '0';
    clone.style.pointerEvents = 'none';

    if (document.body) {
      document.body.appendChild(clone);
    }

    const text = getElementText(clone);
    const markerIndex = text.indexOf(marker);
    clone.remove();

    return markerIndex >= 0 ? markerIndex : null;
  } catch {
    clone.remove?.();
    return null;
  }
};

const findTextPosition = (root, offset) => {
  if (!root || typeof document === 'undefined' || typeof window === 'undefined') return null;

  const nodeFilter = window.NodeFilter;
  const nodeTypes = window.Node;
  if (!nodeFilter || !nodeTypes) return { node: root, offset: 0 };

  const targetOffset = Math.max(0, Math.min(getElementText(root).length, isFiniteNumber(offset) ? offset : 0));
  const candidates = [];
  const seenCandidates = new Set();

  const addCandidate = (node, candidateOffset) => {
    if (!node) return;
    const path = getNodePath(root, node);
    if (!path) return;

    const key = `${path.join('.')}:${candidateOffset}`;
    if (seenCandidates.has(key)) return;

    seenCandidates.add(key);
    candidates.push({ node, offset: candidateOffset });
  };

  const addElementBoundaries = (element) => {
    const childCount = element.childNodes?.length ?? 0;
    for (let index = 0; index <= childCount; index += 1) {
      addCandidate(element, index);
    }
  };

  addElementBoundaries(root);

  const elementWalker = document.createTreeWalker(root, nodeFilter.SHOW_ELEMENT);
  while (elementWalker.nextNode()) {
    const node = elementWalker.currentNode;
    if (node !== root) {
      addElementBoundaries(node);
    }
  }

  const textWalker = document.createTreeWalker(root, nodeFilter.SHOW_TEXT);
  while (textWalker.nextNode()) {
    const node = textWalker.currentNode;
    const length = node.textContent?.length ?? 0;
    for (let index = 0; index <= length; index += 1) {
      addCandidate(node, index);
    }
  }

  let fallback = { node: root, offset: root.childNodes?.length ?? 0 };
  let fallbackDistance = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    const measuredOffset = getInnerTextOffsetForDomPosition(root, candidate.node, candidate.offset);
    if (!isFiniteNumber(measuredOffset)) continue;
    if (measuredOffset === targetOffset) return candidate;

    const distance = Math.abs(measuredOffset - targetOffset);
    if (distance < fallbackDistance) {
      fallback = candidate;
      fallbackDistance = distance;
    }
  }

  return fallback;
};

const moveCaretToOffset = (element, offset) => {
  if (!element || typeof window === 'undefined' || typeof document === 'undefined') return;

  const selection = window.getSelection?.();
  if (!selection || typeof document.createRange !== 'function') return;

  const position = findTextPosition(element, offset);
  if (!position) return;

  const range = document.createRange();
  element.focus?.();
  range.setStart(position.node, position.offset);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};

const createDomIdPart = (value) => String(value || 'object').replace(/[^a-zA-Z0-9_-]/g, '-');

const getHitStrokeWidth = (strokeWidth) => Math.max(MIN_TOUCH_STROKE_WIDTH, strokeWidth);

const isPresenterInteractiveTarget = (target) =>
  target instanceof Element && Boolean(target.closest('[data-presenter-interactive="true"]'));

// Hoekmarkering: 0 tot en met 360 graden, want een geodriehoek leest 0 tot 180
// en de docent kan zelf een inspringende hoek intypen. De meetkunde zelf staat
// in presenterAngleTool, zodat de preview op de geodriehoek en de geplaatste
// hoek uit dezelfde bron komen.
const getAngleGeometry = (object, width, height) =>
  getAngleFrameGeometry({ width, height, angleDegrees: object?.angleDegrees });

const getSelectionFrame = ({ width, height }) => {
  const minX = Math.min(0, width);
  const minY = Math.min(0, height);
  const rawWidth = Math.abs(width);
  const rawHeight = Math.abs(height);

  return {
    x: minX - 12,
    y: minY - (rawHeight === 0 ? 18 : 12),
    width: Math.max(rawWidth, 28) + 24,
    height: Math.max(rawHeight, 28) + 24
  };
};

const getPolygonPoints = (object, width, height) => {
  const points = Array.isArray(object?.points) ? object.points : [];
  const validPoints = points.filter((point) => isFiniteNumber(point?.x) && isFiniteNumber(point?.y));

  if (validPoints.length > 0) {
    return validPoints.map((point) => `${point.x},${point.y}`).join(' ');
  }

  return `0,${height} ${width * 0.5},0 ${width},${height}`;
};

const renderTable = (object, width, height, style) => {
  const rows = Math.max(1, Math.round(getNumber(object?.rows, 4)));
  const columns = Math.max(1, Math.round(getNumber(object?.columns, 5)));
  const lines = [];

  for (let index = 1; index < columns; index += 1) {
    const x = (width / columns) * index;
    lines.push(<line key={`column-${index}`} x1={x} y1={0} x2={x} y2={height} />);
  }

  for (let index = 1; index < rows; index += 1) {
    const y = (height / rows) * index;
    lines.push(<line key={`row-${index}`} x1={0} y1={y} x2={width} y2={y} />);
  }

  return (
    <g fill="none" stroke={style.stroke} strokeWidth={style.strokeWidth}>
      <rect width={width} height={height} fill={style.fill} />
      {lines}
    </g>
  );
};

const getPageGridSize = (page) =>
  isFinitePositiveNumber(page?.background?.gridSize) ? page.background.gridSize : AXES_DEFAULT_GRID_SIZE;

const getAxesRenderGeometry = (object, page) =>
  getAxesGeometry({
    object,
    gridSize: getPageGridSize(page),
    pageWidth: page?.width,
    pageHeight: page?.height
  });

// Het assenstelsel zoals het in een wiskundeboek staat: twee zwarte assen die
// precies over roosterlijnen lopen en met een pijlpunt voorbij het laatste
// ruitje steken, een maatstreepje bij elke eenheid, de getallen op de
// roosterlijn waar ze bij horen, een O bij de oorsprong en de naam van de as
// aan het uiteinde. Alle maten komen uit presenterAxes; hier wordt alleen nog
// getekend.
const renderAxes = (object, style, markerId, page) => {
  const geometry = getAxesRenderGeometry(object, page);
  const axisWidth = Math.max(3, style.strokeWidth);
  const tickWidth = Math.max(2, axisWidth * 0.62);
  const { fontSize } = geometry;
  const nameFontSize = Math.round(fontSize * 1.05);

  return (
    <g>
      <g fill="none" stroke={style.stroke} strokeLinecap="round">
        <g strokeWidth={tickWidth}>
          {geometry.ticks.map((tick) => (
            <line key={tick.key} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} />
          ))}
        </g>
        <line
          markerEnd={`url(#${markerId})`}
          strokeWidth={axisWidth}
          x1={geometry.xAxis.x1}
          y1={geometry.xAxis.y1}
          x2={geometry.xAxis.x2}
          y2={geometry.xAxis.y2}
        />
        <line
          markerEnd={`url(#${markerId})`}
          strokeWidth={axisWidth}
          x1={geometry.yAxis.x1}
          y1={geometry.yAxis.y1}
          x2={geometry.yAxis.x2}
          y2={geometry.yAxis.y2}
        />
      </g>
      {/* Een witte rand om de cijfers, onder de letter door getekend: zo loopt
          er nooit een rooster- of aslijn dwars door een getal heen. */}
      <g
        fill={style.stroke}
        fontFamily={AXES_FONT_STACK}
        fontWeight={700}
        paintOrder="stroke"
        stroke="#ffffff"
        strokeLinejoin="round"
        strokeWidth={Math.max(3, fontSize * 0.24)}
      >
        {geometry.numbers.map((number) => (
          <text fontSize={fontSize} key={number.key} textAnchor={number.anchor} x={number.x} y={number.y}>
            {number.text}
          </text>
        ))}
        {geometry.originLabel ? (
          <text
            fontSize={fontSize}
            textAnchor={geometry.originLabel.anchor}
            x={geometry.originLabel.x}
            y={geometry.originLabel.y}
          >
            {geometry.originLabel.text}
          </text>
        ) : null}
        {geometry.axisNames.x ? (
          <text
            fontSize={nameFontSize}
            fontStyle="italic"
            textAnchor={geometry.axisNames.x.anchor}
            x={geometry.axisNames.x.x}
            y={geometry.axisNames.x.y}
          >
            {geometry.axisNames.x.text}
          </text>
        ) : null}
        {geometry.axisNames.y ? (
          <text
            fontSize={nameFontSize}
            fontStyle="italic"
            textAnchor={geometry.axisNames.y.anchor}
            x={geometry.axisNames.y.x}
            y={geometry.axisNames.y.y}
          >
            {geometry.axisNames.y.text}
          </text>
        ) : null}
      </g>
    </g>
  );
};

const renderAngle = (object, width, height, style) => (
  <PresenterAngleShape
    geometry={getAngleGeometry(object, width, height)}
    stroke={style.stroke}
    strokeWidth={style.strokeWidth}
  />
);

const renderHitTarget = (object, page) => {
  const { width, height } = getObjectFrame(object);
  const style = getObjectStyle(object);
  const hitStrokeWidth = getHitStrokeWidth(style.strokeWidth);
  const hitProps = {
    fill: 'none',
    pointerEvents: 'stroke',
    stroke: 'transparent',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: hitStrokeWidth
  };

  switch (object?.type) {
    case 'line':
    case 'arrow':
      return <line {...hitProps} x1={0} y1={0} x2={width} y2={height} />;
    case 'axes': {
      // Allebei de assen met een vingerbrede greep: een docent pakt het
      // assenstelsel bij een as vast, niet bij een haarlijn.
      const { xAxis, yAxis } = getAxesRenderGeometry(object, page);

      return (
        <g {...hitProps}>
          <line x1={xAxis.x1} y1={xAxis.y1} x2={xAxis.x2} y2={xAxis.y2} />
          <line x1={yAxis.x1} y1={yAxis.y1} x2={yAxis.x2} y2={yAxis.y2} />
        </g>
      );
    }
    case 'angle': {
      const { angleDegrees, originX, originY, leg1End, leg2End, marker } = getAngleGeometry(object, width, height);

      return (
        <g {...hitProps}>
          <line x1={originX} y1={originY} x2={leg1End.x} y2={leg1End.y} />
          {angleDegrees > 0 && angleDegrees < 360 ? (
            <line x1={originX} y1={originY} x2={leg2End.x} y2={leg2End.y} />
          ) : null}
          {marker.d ? <path d={marker.d} /> : null}
        </g>
      );
    }
    default:
      if (isPresenterImportedObject(object)) {
        return <rect width={width} height={height} fill="transparent" pointerEvents="all" />;
      }
      return null;
  }
};

const renderObjectShape = (object, markerId, page, onClassroomLog) => {
  const { width, height } = getObjectFrame(object);
  const style = getObjectStyle(object);

  switch (object?.type) {
    case 'rectangle':
      return <rect width={width} height={height} fill={style.fill} stroke={style.stroke} strokeWidth={style.strokeWidth} />;
    case 'ellipse':
      return (
        <ellipse
          cx={width / 2}
          cy={height / 2}
          fill={style.fill}
          rx={Math.abs(width) / 2}
          ry={Math.abs(height) / 2}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
        />
      );
    case 'line':
      return (
        <line
          x1={0}
          y1={0}
          x2={width}
          y2={height}
          stroke={style.stroke}
          strokeLinecap="round"
          strokeWidth={style.strokeWidth}
        />
      );
    case 'arrow':
      return (
        <line
          x1={0}
          y1={0}
          x2={width}
          y2={height}
          stroke={style.stroke}
          strokeLinecap="round"
          strokeWidth={style.strokeWidth}
          markerEnd={`url(#${markerId})`}
        />
      );
    case 'triangle':
      return (
        <polygon
          fill={style.fill}
          points={`0,${height} ${width / 2},0 ${width},${height}`}
          stroke={style.stroke}
          strokeLinejoin="round"
          strokeWidth={style.strokeWidth}
        />
      );
    case 'polygon':
      return (
        <polygon
          fill={style.fill}
          points={getPolygonPoints(object, width, height)}
          stroke={style.stroke}
          strokeLinejoin="round"
          strokeWidth={style.strokeWidth}
        />
      );
    case 'axes':
      return renderAxes(object, style, markerId, page);
    case 'table':
      return renderTable(object, width, height, style);
    case 'angle':
      return renderAngle(object, width, height, style);
    case 'text':
      return null;
    default:
      if (isPresenterImportedObject(object)) {
        return (
          <foreignObject height={Math.max(1, Math.abs(height))} width={Math.max(1, Math.abs(width))} x={Math.min(0, width)} y={Math.min(0, height)}>
            <div className="h-full w-full" xmlns="http://www.w3.org/1999/xhtml">
              <PresenterImportedObjectCard object={object} onClassroomLog={onClassroomLog} />
            </div>
          </foreignObject>
        );
      }
      return null;
  }
};

function PresenterTextObject({
  object,
  interactive,
  selected = false,
  textCaretRequest,
  onInteract,
  onSelectObject,
  onTextChange,
  onTextCursorChange
}) {
  const editorRef = useRef(null);
  const focusAtEndRef = useRef(false);
  const { width, height } = getObjectFrame(object);
  const textStyle = getTextStyle(object);
  const text = getTextContent(object);

  const reportCursor = useCallback(() => {
    const selection = getTextSelectionOffsets(editorRef.current);
    if (selection) {
      onTextCursorChange?.(object.id, selection);
    }
  }, [object.id, onTextCursorChange]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || document.activeElement === editor) return;
    if (editor.innerText !== text) {
      editor.innerText = text;
    }
  }, [text]);

  useEffect(() => {
    if (textCaretRequest?.objectId !== object.id) return;

    const editor = editorRef.current;
    if (!editor || typeof window === 'undefined') return;

    const restoreCaret = () => {
      moveCaretToOffset(editor, textCaretRequest.offset);
      reportCursor();
    };

    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(restoreCaret);
      return;
    }

    restoreCaret();
  }, [object.id, reportCursor, textCaretRequest]);

  const handleInput = (event) => {
    onTextChange?.(object.id, event.currentTarget.innerText);
    reportCursor();
  };

  const handleFocus = () => {
    onInteract?.();
    onSelectObject?.(object.id);
    if (focusAtEndRef.current) {
      focusAtEndRef.current = false;
      const focusAtEnd = () => {
        moveCaretToEnd(editorRef.current);
        reportCursor();
      };

      if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(focusAtEnd);
      } else {
        focusAtEnd();
      }
      return;
    }

    reportCursor();
  };

  const handlePointerDown = (event) => {
    if (!interactive) return;

    focusAtEndRef.current = document.activeElement !== event.currentTarget;
    event.stopPropagation();
    onInteract?.();
    onSelectObject?.(object.id);
  };

  return (
    <foreignObject height={Math.max(1, Math.abs(height))} width={Math.max(1, Math.abs(width))} x={Math.min(0, width)} y={Math.min(0, height)}>
      <div className="h-full w-full" xmlns="http://www.w3.org/1999/xhtml">
        <div
          className="h-full w-full whitespace-pre-wrap break-words rounded-md border border-transparent px-4 py-3 leading-tight outline-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)] focus:border-blue-500 focus:bg-white/40 focus:ring-4 focus:ring-blue-500/15"
          contentEditable={interactive}
          data-placeholder={PRESENTER_TEXT_PLACEHOLDER}
          data-presenter-interactive="true"
          dir="ltr"
          onBlur={reportCursor}
          onFocus={handleFocus}
          onInput={handleInput}
          onKeyUp={reportCursor}
          onMouseUp={reportCursor}
          onPointerDown={handlePointerDown}
          onPointerUp={reportCursor}
          ref={editorRef}
          role="textbox"
          suppressContentEditableWarning
          style={{
            color: textStyle.color,
            cursor: interactive ? 'text' : 'default',
            direction: 'ltr',
            fontFamily: getTextFontFamily(textStyle.fontFamily),
            fontSize: `${textStyle.fontSize}px`,
            fontStyle: textStyle.italic ? 'italic' : 'normal',
            fontWeight: textStyle.bold ? 900 : 700,
            height: '100%',
            overflow: 'hidden',
            backgroundColor: selected ? 'rgba(255,255,255,0.12)' : 'transparent',
            textAlign: textStyle.align,
            unicodeBidi: 'plaintext',
            width: '100%'
          }}
        />
      </div>
    </foreignObject>
  );
}

function PresenterMathObject({ object, interactive, onInteract, onSelectObject, onMathToolChange }) {
  const { width, height } = getObjectFrame(object);

  const handlePointerDown = (event) => {
    if (!interactive) return;

    event.stopPropagation();
    onInteract?.();
    onSelectObject?.(object.id);
  };

  const handleChange = (mathTool) => {
    onInteract?.();
    onMathToolChange?.(object.id, mathTool);
  };

  return (
    <foreignObject height={Math.max(1, Math.abs(height))} width={Math.max(1, Math.abs(width))} x={Math.min(0, width)} y={Math.min(0, height)}>
      <div className="h-full w-full" xmlns="http://www.w3.org/1999/xhtml">
        <div data-presenter-interactive="true" onPointerDown={handlePointerDown}>
          <PresenterMathToolObject disabled={!interactive} object={object} onChange={handleChange} />
        </div>
      </div>
    </foreignObject>
  );
}

const renderSelection = (object, onDeleteObject, onInteract) => {
  const { width, height } = getObjectFrame(object);
  const selection = getSelectionFrame({ width, height });
  const deleteX = selection.x + selection.width;
  const deleteY = selection.y;

  const handleDeletePointerDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onInteract?.();
    onDeleteObject?.(object.id);
  };

  const handleDeleteKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    event.stopPropagation();
    onInteract?.();
    onDeleteObject?.(object.id);
  };

  return (
    <g>
      <rect
        fill="none"
        height={selection.height}
        pointerEvents="none"
        stroke={SELECTION_COLOR}
        strokeDasharray="14 10"
        strokeWidth={4}
        width={selection.width}
        x={selection.x}
        y={selection.y}
      />
      <g
        aria-label="Object verwijderen"
        onKeyDown={handleDeleteKeyDown}
        onPointerDown={handleDeletePointerDown}
        role="button"
        tabIndex={0}
      >
        <circle cx={deleteX} cy={deleteY} fill={DELETE_COLOR} r={17} stroke="#ffffff" strokeWidth={4} />
        <line x1={deleteX - 7} y1={deleteY - 7} x2={deleteX + 7} y2={deleteY + 7} stroke="#ffffff" strokeLinecap="round" strokeWidth={4} />
        <line x1={deleteX + 7} y1={deleteY - 7} x2={deleteX - 7} y2={deleteY + 7} stroke="#ffffff" strokeLinecap="round" strokeWidth={4} />
      </g>
    </g>
  );
};

export default function PresenterObjectLayer({
  page,
  selectedObjectId = null,
  selectedObjectIds = [],
  interactive = false,
  mathInteractive = false,
  showObjects = true,
  showSelection = true,
  onInteract,
  onSelectObject,
  onObjectPointerDown,
  onDeleteObject,
  onTextChange,
  textCaretRequest,
  onTextCursorChange,
  onMathToolChange,
  onImportedObjectClassroomLog
}) {
  const layerId = createDomIdPart(useId());
  const width = isFinitePositiveNumber(page?.width) ? page.width : DEFAULT_PAGE_WIDTH;
  const height = isFinitePositiveNumber(page?.height) ? page.height : DEFAULT_PAGE_HEIGHT;
  const objects = Array.isArray(page?.objects) ? page.objects : [];
  const viewBox = `0 0 ${width} ${height}`;
  const renderedObjects = objects.filter((object) => object?.id);
  const markerObjects = renderedObjects.filter((object) => object?.type === 'arrow' || object?.type === 'axes');
  const selectedIds = new Set(
    (Array.isArray(selectedObjectIds) && selectedObjectIds.length > 0 ? selectedObjectIds : [selectedObjectId])
      .filter(Boolean)
  );

  return (
    <svg
      aria-label="Presenter objecten"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      style={{ pointerEvents: 'none' }}
      viewBox={viewBox}
    >
      <defs>
        {markerObjects.map((object) => {
          const style = getObjectStyle(object);
          const markerId = `presenter-object-arrow-${layerId}-${createDomIdPart(object.id)}`;

          // Elk object heeft zijn eigen marker-id; alleen de VORM verschilt. Een
          // as krijgt een slanke punt van vaste maat, zodat hij netjes voorbij
          // het laatste ruitje eindigt in plaats van over het laatste getal
          // heen te vallen zoals de lijndikte-gebonden pijl van een pijlobject.
          if (object.type === 'axes') {
            const { length, width } = AXES_ARROW;

            return (
              <marker
                key={markerId}
                id={markerId}
                markerHeight={width}
                markerUnits="userSpaceOnUse"
                markerWidth={length}
                orient="auto"
                refX={length - 2}
                refY={width / 2}
                viewBox={`0 0 ${length} ${width}`}
              >
                <path d={`M 0 0 L ${length} ${width / 2} L 0 ${width} z`} fill={style.stroke} />
              </marker>
            );
          }

          return (
            <marker
              key={markerId}
              id={markerId}
              markerHeight="10"
              markerWidth="10"
              orient="auto"
              refX="8"
              refY="5"
              viewBox="0 0 10 10"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={style.stroke} />
            </marker>
          );
        })}
      </defs>
      {renderedObjects.map((object, index) => {
        const markerId = `presenter-object-arrow-${layerId}-${createDomIdPart(object.id)}`;
        const isSelected = selectedIds.has(object.id);
        const isMathObject = isPresenterMathToolObject(object);
        const objectInteractive = interactive || (mathInteractive && isMathObject);
        const shape = object.type === 'text'
          ? (
              <PresenterTextObject
                object={object}
                interactive={interactive}
                selected={isSelected}
                onInteract={onInteract}
                onSelectObject={onSelectObject}
                onTextChange={onTextChange}
                textCaretRequest={textCaretRequest}
                onTextCursorChange={onTextCursorChange}
              />
            )
          : isMathObject
            ? (
                <PresenterMathObject
                  object={object}
                  interactive={objectInteractive}
                  onInteract={onInteract}
                  onSelectObject={onSelectObject}
                  onMathToolChange={onMathToolChange}
                />
              )
          : renderObjectShape(object, markerId, page, onImportedObjectClassroomLog);
        if (!shape) return null;

        const { x, y, width: objectWidth, height: objectHeight, rotation } = getObjectFrame(object);
        const centerX = objectWidth / 2;
        const centerY = objectHeight / 2;

        const handlePointerDown = (event) => {
          if (!interactive) return;
          if (isPresenterInteractiveTarget(event.target)) return;

          event.preventDefault();
          event.stopPropagation();
          onInteract?.();
          onObjectPointerDown?.(event, object.id);
          if (!onObjectPointerDown) {
            onSelectObject?.(object.id);
          }
        };

        return (
          <g
            key={object.id || `${object.type}-${index}`}
            onPointerDown={handlePointerDown}
            style={{ pointerEvents: objectInteractive ? 'auto' : 'none' }}
            transform={`translate(${x} ${y}) rotate(${rotation} ${centerX} ${centerY})`}
          >
            {showObjects ? renderHitTarget(object, page) : null}
            {showObjects ? shape : null}
            {showSelection && isSelected ? renderSelection(object, onDeleteObject, onInteract) : null}
          </g>
        );
      })}
    </svg>
  );
}
