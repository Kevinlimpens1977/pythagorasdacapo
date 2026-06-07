import { useCallback, useEffect, useId, useRef } from 'react';
import PresenterImportedObjectCard from './PresenterImportedObjectCard';
import PresenterMathToolObject from './PresenterMathToolObject';
import { isPresenterImportedObject } from './presenterContentObjectUtils.js';
import { isPresenterMathToolObject } from '../../lib/presenterObjects';

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

  try {
    const startRange = range.cloneRange();
    startRange.selectNodeContents(element);
    startRange.setEnd(range.startContainer, range.startOffset);

    const endRange = range.cloneRange();
    endRange.selectNodeContents(element);
    endRange.setEnd(range.endContainer, range.endOffset);

    return {
      start: startRange.toString().length,
      end: endRange.toString().length
    };
  } catch {
    return null;
  }
};

const findTextPosition = (root, offset) => {
  if (!root || typeof document === 'undefined' || typeof window === 'undefined') return null;

  const nodeFilter = window.NodeFilter;
  if (!nodeFilter) return { node: root, offset: 0 };

  const targetOffset = isFiniteNumber(offset) ? Math.max(0, offset) : 0;
  const walker = document.createTreeWalker(root, nodeFilter.SHOW_TEXT);
  let remaining = targetOffset;
  let lastTextNode = null;

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const length = node.textContent?.length ?? 0;
    lastTextNode = node;

    if (remaining <= length) {
      return { node, offset: remaining };
    }

    remaining -= length;
  }

  if (lastTextNode) {
    return { node: lastTextNode, offset: lastTextNode.textContent?.length ?? 0 };
  }

  return { node: root, offset: root.childNodes?.length ?? 0 };
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

const getAngleGeometry = (object, width, height) => {
  const angleDegrees = Math.max(10, Math.min(170, getNumber(object?.angleDegrees, 90)));
  const radius = Math.min(Math.abs(width) / 2, Math.abs(height), 96);
  const safeRadius = Math.max(radius, 1);
  const originX = safeRadius;
  const originY = height;
  const radians = (angleDegrees * Math.PI) / 180;

  return {
    angleDegrees,
    radius: safeRadius,
    originX,
    originY,
    endX: originX + Math.cos(radians) * safeRadius,
    endY: originY - Math.sin(radians) * safeRadius
  };
};

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

const renderAxes = (width, height, style, markerId) => {
  const xAxisY = height * 0.78;
  const yAxisX = width * 0.18;

  return (
    <g fill="none" stroke={style.stroke} strokeLinecap="round" strokeWidth={style.strokeWidth}>
      <line x1={yAxisX} y1={height} x2={yAxisX} y2={0} markerEnd={`url(#${markerId})`} />
      <line x1={0} y1={xAxisY} x2={width} y2={xAxisY} markerEnd={`url(#${markerId})`} />
      <line x1={yAxisX} y1={xAxisY} x2={yAxisX + 22} y2={xAxisY} strokeWidth={Math.max(2, style.strokeWidth * 0.7)} />
      <line x1={yAxisX} y1={xAxisY} x2={yAxisX} y2={xAxisY - 22} strokeWidth={Math.max(2, style.strokeWidth * 0.7)} />
    </g>
  );
};

const renderAngle = (object, width, height, style) => {
  const { angleDegrees, radius, originX, originY, endX, endY } = getAngleGeometry(object, width, height);
  const largeArcFlag = angleDegrees > 180 ? 1 : 0;

  return (
    <g fill="none" stroke={style.stroke} strokeLinecap="round" strokeWidth={style.strokeWidth}>
      <line x1={originX} y1={originY} x2={width} y2={originY} />
      <line x1={originX} y1={originY} x2={endX} y2={endY} />
      <path d={`M ${originX + radius} ${originY} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${endX} ${endY}`} />
    </g>
  );
};

const renderHitTarget = (object) => {
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
      const xAxisY = height * 0.78;
      const yAxisX = width * 0.18;

      return (
        <g {...hitProps}>
          <line x1={yAxisX} y1={height} x2={yAxisX} y2={0} />
          <line x1={0} y1={xAxisY} x2={width} y2={xAxisY} />
        </g>
      );
    }
    case 'angle': {
      const { radius, originX, originY, endX, endY } = getAngleGeometry(object, width, height);

      return (
        <g {...hitProps}>
          <line x1={originX} y1={originY} x2={width} y2={originY} />
          <line x1={originX} y1={originY} x2={endX} y2={endY} />
          <path d={`M ${originX + radius} ${originY} A ${radius} ${radius} 0 0 0 ${endX} ${endY}`} />
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

const renderObjectShape = (object, markerId) => {
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
      return renderAxes(width, height, style, markerId);
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
              <PresenterImportedObjectCard object={object} />
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
  showObjects = true,
  showSelection = true,
  onInteract,
  onSelectObject,
  onObjectPointerDown,
  onDeleteObject,
  onTextChange,
  textCaretRequest,
  onTextCursorChange,
  onMathToolChange
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
          : isPresenterMathToolObject(object)
            ? (
                <PresenterMathObject
                  object={object}
                  interactive={interactive}
                  onInteract={onInteract}
                  onSelectObject={onSelectObject}
                  onMathToolChange={onMathToolChange}
                />
              )
          : renderObjectShape(object, markerId);
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
            style={{ pointerEvents: interactive ? 'auto' : 'none' }}
            transform={`translate(${x} ${y}) rotate(${rotation} ${centerX} ${centerY})`}
          >
            {showObjects ? renderHitTarget(object) : null}
            {showObjects ? shape : null}
            {showSelection && isSelected ? renderSelection(object, onDeleteObject, onInteract) : null}
          </g>
        );
      })}
    </svg>
  );
}
