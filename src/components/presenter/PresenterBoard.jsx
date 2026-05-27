import { useEffect, useMemo, useRef, useState } from 'react';
import { getBoardScale, mapClientPointToBoard, snapPointToGrid } from '../../lib/presenterGeometry';
import PresenterBackground from './PresenterBackground';
import PresenterInkLayer from './PresenterInkLayer';
import PresenterObjectLayer from './PresenterObjectLayer';

const DEFAULT_VIEWPORT_WIDTH = 1920;
const DEFAULT_PAGE_WIDTH = 1920;
const DEFAULT_PAGE_HEIGHT = 1400;

const createStrokeId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `stroke-${crypto.randomUUID()}`;
  }

  return `stroke-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

export default function PresenterBoard({
  page,
  viewportWidth = DEFAULT_VIEWPORT_WIDTH,
  tool = { id: 'select' },
  selectedObjectId = null,
  onStrokeComplete,
  onSelectObject,
  onDeleteObject
}) {
  const surfaceRef = useRef(null);
  const boardRef = useRef(null);
  const activeStrokeRef = useRef(null);
  const [measuredViewportWidth, setMeasuredViewportWidth] = useState(viewportWidth);
  const [previewStroke, setPreviewStroke] = useState(null);

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

  const inkPage = useMemo(() => {
    if (!previewStroke) return page;

    return {
      ...page,
      strokes: [...(Array.isArray(page?.strokes) ? page.strokes : []), previewStroke]
    };
  }, [page, previewStroke]);

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

  const completeActiveStroke = (event) => {
    const activeStroke = activeStrokeRef.current;
    if (!activeStroke || (event?.pointerId != null && event.pointerId !== activeStroke.pointerId)) return;

    activeStrokeRef.current = null;
    setPreviewStroke(null);
    onStrokeComplete?.(activeStroke.stroke);
  };

  const handlePointerDown = (event) => {
    if (!onStrokeComplete || tool?.id === 'select' || event.button !== 0) return;

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

  const touchAction = tool?.id === 'select' ? 'pan-y' : 'none';

  return (
    <div
      ref={surfaceRef}
      className="flex min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-slate-200 px-4 py-5"
      style={{ touchAction }}
    >
      <div
        ref={boardRef}
        className="relative mx-auto shrink-0 overflow-hidden bg-slate-50 shadow-sm ring-1 ring-slate-300"
        onLostPointerCapture={completeActiveStroke}
        onPointerCancel={completeActiveStroke}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={completeActiveStroke}
        style={{
          width: `${board.scaledWidth}px`,
          height: `${board.scaledHeight}px`,
          touchAction
        }}
      >
        <PresenterBackground background={page?.background} scale={board.scale} />
        <PresenterObjectLayer
          page={page}
          selectedObjectId={selectedObjectId}
          interactive={tool?.id === 'select'}
          onSelectObject={onSelectObject}
          onDeleteObject={onDeleteObject}
        />
        <PresenterInkLayer page={inkPage} />
        <div className="pointer-events-none absolute left-4 top-4 rounded bg-slate-900/75 px-2.5 py-1 text-xs font-semibold text-slate-50">
          {page?.title || 'Pagina'}
        </div>
      </div>
    </div>
  );
}
