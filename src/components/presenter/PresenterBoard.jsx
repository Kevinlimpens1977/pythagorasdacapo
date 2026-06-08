import { useEffect, useMemo, useRef, useState } from 'react';
import { getBoardScale, mapClientPointToBoard, snapPointToGrid } from '../../lib/presenterGeometry';
import { getPresenterObjectIdsInRect, getPresenterSelectionBounds } from '../../lib/presenterModel';
import { isPresenterMathToolObject } from '../../lib/presenterObjects';
import PresenterBackground from './PresenterBackground';
import PresenterInkLayer from './PresenterInkLayer';
import PresenterObjectLayer from './PresenterObjectLayer';

const DEFAULT_VIEWPORT_WIDTH = 1920;
const DEFAULT_PAGE_WIDTH = 1920;
const DEFAULT_PAGE_HEIGHT = 1400;
const MIN_TRANSFORM_SIZE = 32;
const CLICK_TOLERANCE = 5;
const MARQUEE_TOLERANCE = 8;

const normalizeIds = (ids) =>
  [...new Set((Array.isArray(ids) ? ids : [ids]).filter((id) => typeof id === 'string' && id.length > 0))];

const getNumber = (value, fallback = 0) => (Number.isFinite(value) ? value : fallback);

const createRectFromPoints = (start, end) => {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const right = Math.max(start.x, end.x);
  const bottom = Math.max(start.y, end.y);

  return {
    x,
    y,
    width: right - x,
    height: bottom - y,
    right,
    bottom
  };
};

const getResizeBounds = (bounds, start, current, handle) => {
  const dx = current.x - start.x;
  const dy = current.y - start.y;
  const next = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height
  };

  if (handle.includes('w')) {
    next.x = Math.min(bounds.right - MIN_TRANSFORM_SIZE, bounds.x + dx);
    next.width = bounds.right - next.x;
  }

  if (handle.includes('e')) {
    next.width = Math.max(MIN_TRANSFORM_SIZE, bounds.width + dx);
  }

  if (handle.includes('n')) {
    next.y = Math.min(bounds.bottom - MIN_TRANSFORM_SIZE, bounds.y + dy);
    next.height = bounds.bottom - next.y;
  }

  if (handle.includes('s')) {
    next.height = Math.max(MIN_TRANSFORM_SIZE, bounds.height + dy);
  }

  return {
    ...next,
    right: next.x + next.width,
    bottom: next.y + next.height
  };
};

const transformObjectsForPreview = (page, interaction) => {
  if (!interaction || !page || (interaction.type !== 'move' && interaction.type !== 'resize')) return page;

  const selectedIds = new Set(normalizeIds(interaction.objectIds));
  if (selectedIds.size === 0) return page;

  const objects = Array.isArray(page.objects) ? page.objects : [];
  const dx = interaction.current.x - interaction.start.x;
  const dy = interaction.current.y - interaction.start.y;
  const resizeBounds =
    interaction.type === 'resize'
      ? getResizeBounds(interaction.bounds, interaction.start, interaction.current, interaction.handle)
      : null;
  const scaleX = resizeBounds && interaction.bounds.width > 0 ? resizeBounds.width / interaction.bounds.width : 1;
  const scaleY = resizeBounds && interaction.bounds.height > 0 ? resizeBounds.height / interaction.bounds.height : 1;

  return {
    ...page,
    objects: objects.map((object) => {
      if (!selectedIds.has(object?.id)) return object;

      if (interaction.type === 'move') {
        return {
          ...object,
          x: getNumber(object.x) + dx,
          y: getNumber(object.y) + dy
        };
      }

      const objectScale = Math.max(0.1, Math.min(Math.abs(scaleX), Math.abs(scaleY)));
      const nextTextStyle = object.type === 'text' && object.textStyle
        ? {
            ...object.textStyle,
            fontSize: Math.max(8, getNumber(object.textStyle.fontSize, 48) * objectScale)
          }
        : object.textStyle;

      return {
        ...object,
        x: resizeBounds.x + (getNumber(object.x) - interaction.bounds.x) * scaleX,
        y: resizeBounds.y + (getNumber(object.y) - interaction.bounds.y) * scaleY,
        width: getNumber(object.width, 120) * scaleX,
        height: getNumber(object.height, 80) * scaleY,
        ...(nextTextStyle ? { textStyle: nextTextStyle } : {})
      };
    })
  };
};

const createStrokeId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `stroke-${crypto.randomUUID()}`;
  }

  return `stroke-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

function SelectionMarquee({ rect, scale }) {
  return (
    <div
      className="pointer-events-none absolute border-2 border-blue-600 bg-blue-500/10"
      style={{
        left: `${rect.x * scale}px`,
        top: `${rect.y * scale}px`,
        width: `${rect.width * scale}px`,
        height: `${rect.height * scale}px`
      }}
    />
  );
}

function SelectionTransformBox({ bounds, scale, allowInteriorInteraction = false, onDelete, onMovePointerDown, onResizePointerDown }) {
  const handleSize = 28;
  const scaledBounds = {
    x: bounds.x * scale,
    y: bounds.y * scale,
    width: bounds.width * scale,
    height: bounds.height * scale
  };
  const handles = [
    ['nw', scaledBounds.x, scaledBounds.y, 'nwse-resize'],
    ['ne', scaledBounds.x + scaledBounds.width, scaledBounds.y, 'nesw-resize'],
    ['sw', scaledBounds.x, scaledBounds.y + scaledBounds.height, 'nesw-resize'],
    ['se', scaledBounds.x + scaledBounds.width, scaledBounds.y + scaledBounds.height, 'nwse-resize']
  ];

  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className={`absolute border-[3px] border-blue-600 bg-blue-500/5 ${allowInteriorInteraction ? 'pointer-events-none' : 'pointer-events-auto'}`}
        onPointerDown={onMovePointerDown}
        style={{
          cursor: 'move',
          left: `${scaledBounds.x}px`,
          top: `${scaledBounds.y}px`,
          width: `${scaledBounds.width}px`,
          height: `${scaledBounds.height}px`,
          touchAction: 'none'
        }}
      />
      {allowInteriorInteraction ? (
        <button
          aria-label="Selectie verplaatsen"
          className="pointer-events-auto absolute rounded-md border-[3px] border-blue-700 bg-white px-3 py-1 text-xs font-black text-blue-800 shadow-sm"
          onPointerDown={onMovePointerDown}
          style={{
            cursor: 'move',
            left: `${scaledBounds.x}px`,
            top: `${Math.max(0, scaledBounds.y - 36)}px`,
            touchAction: 'none'
          }}
          type="button"
        >
          Verplaats
        </button>
      ) : null}
      {handles.map(([handle, x, y, cursor]) => (
        <button
          aria-label={`Selectie ${handle} schalen`}
          className="pointer-events-auto absolute rounded-md border-[3px] border-blue-700 bg-white shadow-sm"
          key={handle}
          onPointerDown={(event) => onResizePointerDown(event, handle)}
          style={{
            cursor,
            height: `${handleSize}px`,
            left: `${x - handleSize / 2}px`,
            top: `${y - handleSize / 2}px`,
            touchAction: 'none',
            width: `${handleSize}px`
          }}
          type="button"
        />
      ))}
      <button
        aria-label="Selectie verwijderen"
        className="pointer-events-auto absolute rounded-full border-4 border-white bg-red-600 shadow-sm"
        onPointerDown={onDelete}
        style={{
          height: '34px',
          left: `${scaledBounds.x + scaledBounds.width + 10}px`,
          top: `${scaledBounds.y - 17}px`,
          touchAction: 'none',
          width: '34px'
        }}
        type="button"
      >
        <span className="absolute left-1/2 top-1/2 h-1 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded bg-white" />
        <span className="absolute left-1/2 top-1/2 h-1 w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded bg-white" />
      </button>
    </div>
  );
}

export default function PresenterBoard({
  page,
  viewportWidth = DEFAULT_VIEWPORT_WIDTH,
  tool = { id: 'select' },
  selectedObjectId = null,
  selectedObjectIds = [],
  onInteract,
  onStrokeComplete,
  onSelectObject,
  onSelectObjects,
  onMoveObjects,
  onResizeObjects,
  onDeleteObject,
  onDeleteObjects,
  onTextChange,
  textCaretRequest,
  onTextCursorChange,
  onMathToolChange
}) {
  const surfaceRef = useRef(null);
  const boardRef = useRef(null);
  const activeStrokeRef = useRef(null);
  const interactionRef = useRef(null);
  const [measuredViewportWidth, setMeasuredViewportWidth] = useState(viewportWidth);
  const [previewStroke, setPreviewStroke] = useState(null);
  const [interaction, setInteraction] = useState(null);

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return undefined;

    const measureSurface = () => {
      const styles = window.getComputedStyle(surface);
      const paddingX = Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight);
      const availableWidth = surface.clientWidth - paddingX;

      if (Number.isFinite(availableWidth) && availableWidth > 0) {
        setMeasuredViewportWidth(availableWidth);
      }
    };

    measureSurface();

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(measureSurface);
      resizeObserver.observe(surface);

      return () => resizeObserver.disconnect();
    }

    window.addEventListener('resize', measureSurface);
    return () => window.removeEventListener('resize', measureSurface);
  }, []);

  const board = useMemo(() => {
    const width = Number.isFinite(page?.width) && page.width > 0 ? page.width : DEFAULT_PAGE_WIDTH;
    const height = Number.isFinite(page?.height) && page.height > 0 ? page.height : DEFAULT_PAGE_HEIGHT;
    const scale = getBoardScale({ viewportWidth: measuredViewportWidth, boardWidth: width });

    return {
      width,
      height,
      scale,
      scaledWidth: Math.round(width * scale),
      scaledHeight: Math.round(height * scale)
    };
  }, [measuredViewportWidth, page?.height, page?.width]);

  const activeSelectedObjectIds = useMemo(() => {
    const ids = normalizeIds(selectedObjectIds);
    return ids.length > 0 ? ids : normalizeIds(selectedObjectId);
  }, [selectedObjectId, selectedObjectIds]);

  const previewPage = useMemo(() => transformObjectsForPreview(page, interaction), [interaction, page]);

  const inkPage = useMemo(() => {
    if (!previewStroke) return page;

    return {
      ...page,
      strokes: [...(Array.isArray(page?.strokes) ? page.strokes : []), previewStroke]
    };
  }, [page, previewStroke]);

  const selectionBounds = useMemo(
    () => getPresenterSelectionBounds(previewPage, activeSelectedObjectIds),
    [activeSelectedObjectIds, previewPage]
  );

  const selectedObjectAllowsInteriorInteraction = useMemo(() => {
    if (activeSelectedObjectIds.length !== 1) return false;

    const selectedId = activeSelectedObjectIds[0];
    return (Array.isArray(previewPage?.objects) ? previewPage.objects : []).some(
      (object) => object?.id === selectedId && (object?.type === 'text' || isPresenterMathToolObject(object))
    );
  }, [activeSelectedObjectIds, previewPage]);

  const allowMathToolInteraction = tool?.id !== 'select';

  const getBoardPoint = (event) => {
    const boardElement = boardRef.current;
    if (!boardElement) return null;

    const point = mapClientPointToBoard({
      clientX: event.clientX,
      clientY: event.clientY,
      rect: boardElement.getBoundingClientRect(),
      scale: board.scale
    });

    if (tool?.variant !== 'geometry-pen' || page?.background?.kind !== 'grid') return point;

    return snapPointToGrid(point, {
      enabled: true,
      gridSize: page.background.gridSize || 96
    });
  };

  const updateInteraction = (nextInteraction) => {
    interactionRef.current = nextInteraction;
    setInteraction(nextInteraction);
  };

  const completeActiveStroke = (event) => {
    const activeStroke = activeStrokeRef.current;
    if (!activeStroke || (event?.pointerId != null && event.pointerId !== activeStroke.pointerId)) return;

    activeStrokeRef.current = null;
    setPreviewStroke(null);
    onStrokeComplete?.(activeStroke.stroke);
  };

  const completeSelectionInteraction = (event) => {
    const activeInteraction = interactionRef.current;
    if (!activeInteraction || (event?.pointerId != null && event.pointerId !== activeInteraction.pointerId)) return;

    const point = getBoardPoint(event) || activeInteraction.current;
    const nextInteraction = {
      ...activeInteraction,
      current: point
    };
    updateInteraction(null);

    if (nextInteraction.type === 'marquee') {
      const rect = createRectFromPoints(nextInteraction.start, point);
      if (rect.width < MARQUEE_TOLERANCE && rect.height < MARQUEE_TOLERANCE) {
        onSelectObjects?.([]);
        return;
      }

      onSelectObjects?.(getPresenterObjectIdsInRect(page, rect));
      return;
    }

    const dx = point.x - nextInteraction.start.x;
    const dy = point.y - nextInteraction.start.y;
    const hasMoved = Math.abs(dx) > CLICK_TOLERANCE || Math.abs(dy) > CLICK_TOLERANCE;

    if (nextInteraction.type === 'move') {
      if (hasMoved) onMoveObjects?.(nextInteraction.objectIds, { dx, dy });
      return;
    }

    if (nextInteraction.type === 'resize' && hasMoved) {
      onResizeObjects?.(
        nextInteraction.objectIds,
        nextInteraction.bounds,
        getResizeBounds(nextInteraction.bounds, nextInteraction.start, point, nextInteraction.handle)
      );
    }
  };

  const handlePointerDown = (event) => {
    onInteract?.();

    if (tool?.id === 'select') {
      if (event.button !== 0) return;

      const point = getBoardPoint(event);
      if (!point) return;

      event.preventDefault();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      updateInteraction({
        type: 'marquee',
        pointerId: event.pointerId,
        start: point,
        current: point
      });
      return;
    }

    if (!onStrokeComplete || event.button !== 0) return;

    const point = getBoardPoint(event);
    if (!point) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);

    const stroke = {
      id: createStrokeId(),
      variant: tool?.variant || tool?.id || 'pen',
      color: tool?.color || '#111827',
      width: Number.isFinite(tool?.width) && tool.width > 0 ? tool.width : 5,
      points: [point]
    };

    activeStrokeRef.current = {
      pointerId: event.pointerId,
      stroke
    };
    setPreviewStroke(stroke);
  };

  const handlePointerMove = (event) => {
    const activeInteraction = interactionRef.current;
    if (activeInteraction && event.pointerId === activeInteraction.pointerId) {
      const point = getBoardPoint(event);
      if (!point) return;

      event.preventDefault();
      updateInteraction({
        ...activeInteraction,
        current: point
      });
      return;
    }

    const activeStroke = activeStrokeRef.current;
    if (!activeStroke || event.pointerId !== activeStroke.pointerId) return;

    const point = getBoardPoint(event);
    if (!point) return;

    event.preventDefault();

    const nextStroke = {
      ...activeStroke.stroke,
      points: [...activeStroke.stroke.points, point]
    };

    activeStrokeRef.current = {
      ...activeStroke,
      stroke: nextStroke
    };
    setPreviewStroke(nextStroke);
  };

  const handleObjectPointerDown = (event, objectId) => {
    if (tool?.id !== 'select' || event.button !== 0) return;

    const point = getBoardPoint(event);
    if (!point) return;

    const objectIds = activeSelectedObjectIds.includes(objectId) ? activeSelectedObjectIds : [objectId];
    onSelectObjects?.(objectIds);
    onSelectObject?.(objectId);
    boardRef.current?.setPointerCapture?.(event.pointerId);
    updateInteraction({
      type: 'move',
      pointerId: event.pointerId,
      objectIds,
      start: point,
      current: point
    });
  };

  const handleSelectionPointerDown = (event) => {
    if (tool?.id !== 'select' || event.button !== 0 || activeSelectedObjectIds.length === 0) return;

    const point = getBoardPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    boardRef.current?.setPointerCapture?.(event.pointerId);
    updateInteraction({
      type: 'move',
      pointerId: event.pointerId,
      objectIds: activeSelectedObjectIds,
      start: point,
      current: point
    });
  };

  const handleResizePointerDown = (event, handle) => {
    if (tool?.id !== 'select' || event.button !== 0 || !selectionBounds) return;

    const point = getBoardPoint(event);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    boardRef.current?.setPointerCapture?.(event.pointerId);
    updateInteraction({
      type: 'resize',
      pointerId: event.pointerId,
      objectIds: activeSelectedObjectIds,
      bounds: selectionBounds,
      handle,
      start: point,
      current: point
    });
  };

  const handleSelectionDelete = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (activeSelectedObjectIds.length <= 1) {
      onDeleteObject?.(activeSelectedObjectIds[0]);
      return;
    }

    onDeleteObjects?.(activeSelectedObjectIds);
  };

  const touchAction = tool?.id === 'select' ? 'pan-y' : 'none';
  const boardTouchAction = 'none';

  return (
    <div
      ref={surfaceRef}
      className="flex min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-slate-200 px-4 pb-28 pt-5"
      style={{ touchAction }}
    >
      <div
        ref={boardRef}
        className="relative mx-auto shrink-0 overflow-hidden bg-slate-50 shadow-sm ring-1 ring-slate-300"
        onLostPointerCapture={(event) => {
          completeActiveStroke(event);
          completeSelectionInteraction(event);
        }}
        onPointerCancel={(event) => {
          completeActiveStroke(event);
          completeSelectionInteraction(event);
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => {
          completeActiveStroke(event);
          completeSelectionInteraction(event);
        }}
        style={{
          width: `${board.scaledWidth}px`,
          height: `${board.scaledHeight}px`,
          touchAction: boardTouchAction
        }}
      >
        <PresenterBackground background={page?.background} scale={board.scale} />
        <PresenterObjectLayer
          page={previewPage}
          selectedObjectId={selectedObjectId}
          selectedObjectIds={activeSelectedObjectIds}
          interactive={tool?.id === 'select'}
          mathInteractive={allowMathToolInteraction}
          showSelection={false}
          onInteract={onInteract}
          onObjectPointerDown={handleObjectPointerDown}
          onSelectObject={onSelectObject}
          onDeleteObject={onDeleteObject}
          onTextChange={onTextChange}
          textCaretRequest={textCaretRequest}
          onTextCursorChange={onTextCursorChange}
          onMathToolChange={onMathToolChange}
        />
        <PresenterInkLayer page={inkPage} />
        <PresenterObjectLayer
          page={previewPage}
          selectedObjectId={selectedObjectId}
          selectedObjectIds={activeSelectedObjectIds}
          interactive={tool?.id === 'select'}
          showObjects={false}
          showSelection={false}
          onInteract={onInteract}
          onSelectObject={onSelectObject}
          onDeleteObject={onDeleteObject}
          onMathToolChange={onMathToolChange}
        />
        {interaction?.type === 'marquee' ? (
          <SelectionMarquee rect={createRectFromPoints(interaction.start, interaction.current)} scale={board.scale} />
        ) : null}
        {selectionBounds ? (
          <SelectionTransformBox
            bounds={selectionBounds}
            allowInteriorInteraction={selectedObjectAllowsInteriorInteraction}
            scale={board.scale}
            onDelete={handleSelectionDelete}
            onMovePointerDown={handleSelectionPointerDown}
            onResizePointerDown={handleResizePointerDown}
          />
        ) : null}
        <div className="pointer-events-none absolute left-4 top-4 rounded bg-slate-900/75 px-2.5 py-1 text-xs font-semibold text-slate-50">
          {page?.title || 'Pagina'}
        </div>
      </div>
    </div>
  );
}
