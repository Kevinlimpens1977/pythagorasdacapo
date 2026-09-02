import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getBoardScale,
  getPointerRotationDegrees,
  mapClientPointToBoard,
  snapPointToGrid,
  snapRotationDegrees
} from '../../lib/presenterGeometry';
import {
  AXES_DEFAULT_GRID_SIZE,
  getAxesMoveSnap,
  isAxesDoubleTap,
  planAxesResize,
  planAxesUpdate,
  snapAxesPositionToGrid
} from '../../lib/presenterAxes';
import { buildStrokeRenderPath, constrainLineEnd } from '../../lib/presenterInk';
import {
  appendStrokePoint,
  getCoalescedPointerSamples,
  isPalmContact,
  resolvePointerIntent
} from '../../lib/presenterPointer';
import {
  getInstrumentEdgeLine,
  isPointNearInstrumentEdge,
  PRESENTER_PAGE_BAR_RESERVE_PX,
  PRESENTER_TOOLBAR_PEEK_PX,
  PRESENTER_TOOLBAR_RESERVE_PX,
  projectPointOntoEdge
} from '../../lib/presenterInstruments';
import { getAlignmentSnap } from '../../lib/presenterAlignment';
import {
  getPresenterObjectBounds,
  getPresenterObjectIdsInRect,
  getPresenterSelectionBounds,
  getPresenterStrokeStyle
} from '../../lib/presenterModel';
import { canRotatePresenterObject, isPresenterMathToolObject } from '../../lib/presenterObjects';
import PresenterBackground from './PresenterBackground';
import { PresenterFocusLayer } from './PresenterFocusTools';
import PresenterInkLayer from './PresenterInkLayer';
import PresenterInstrumentOverlay from './PresenterInstrumentOverlay';
import PresenterObjectLayer from './PresenterObjectLayer';
import PresenterAxesPanel from './PresenterAxesPanel';

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

const getRotationPreviewValue = (interaction) => {
  const currentAngle = getPointerRotationDegrees(interaction.center, interaction.current);
  return snapRotationDegrees(interaction.baseRotation + currentAngle - interaction.startAngle);
};

const transformObjectsForPreview = (page, interaction, axesResize = null) => {
  if (!interaction || !page) return page;

  // Slepen aan een handvat van een assenstelsel verandert het BEREIK: er komen
  // hele ruitjes bij of af. De preview rekent met precies dezelfde functie als
  // het commit-pad, zodat de figuur bij loslaten niet verspringt.
  if (interaction.type === 'resize' && axesResize) {
    return {
      ...page,
      objects: (Array.isArray(page.objects) ? page.objects : []).map((object) =>
        object?.id === axesResize.objectId ? { ...object, ...axesResize.patch } : object
      )
    };
  }

  if (interaction.type === 'rotate') {
    const rotation = getRotationPreviewValue(interaction);

    return {
      ...page,
      objects: (Array.isArray(page.objects) ? page.objects : []).map((object) =>
        object?.id === interaction.objectId ? { ...object, rotation } : object
      )
    };
  }

  if (interaction.type !== 'move' && interaction.type !== 'resize') return page;

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

      // In een groepsselectie schuift een assenstelsel wel mee, maar schaalt
      // hij niet: één eenheid blijft één ruitje, en zijn nieuwe plek valt weer
      // op een roosterlijn. Zelfde regel als in resizePresenterObjectsOnPage,
      // zodat preview en commit gelijk lopen.
      if (object.type === 'axes') {
        const pageGridSize = page?.background?.gridSize;

        return {
          ...object,
          x: snapAxesPositionToGrid(resizeBounds.x + (getNumber(object.x) - interaction.bounds.x) * scaleX, pageGridSize),
          y: snapAxesPositionToGrid(resizeBounds.y + (getNumber(object.y) - interaction.bounds.y) * scaleY, pageGridSize)
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

// Pointer-events dragen een tijdstempel uit dezelfde klok als performance.now.
const getEventTime = (event) => {
  if (Number.isFinite(event?.timeStamp)) return event.timeStamp;
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') return performance.now();
  return Date.now();
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

function SelectionTransformBox({ bounds, scale, allowInteriorInteraction = false, showRotate = false, showMeasureToggle = false, measureActive = false, showRangeToggle = false, rangeActive = false, onDelete, onMovePointerDown, onResizePointerDown, onRotatePointerDown, onBringForward, onSendBackward, onToggleMeasure, onToggleRange }) {
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
      {showRotate ? (
        <>
          <span
            className="absolute w-[3px] rounded bg-blue-600"
            style={{
              height: '26px',
              left: `${scaledBounds.x + scaledBounds.width / 2 - 1.5}px`,
              top: `${scaledBounds.y - 26}px`
            }}
          />
          <button
            aria-label="Selectie roteren"
            title="Roteren (snapt op 15°)"
            className="pointer-events-auto absolute rounded-full border-[3px] border-blue-700 bg-white shadow-sm"
            onPointerDown={onRotatePointerDown}
            style={{
              cursor: 'grab',
              height: `${handleSize}px`,
              left: `${scaledBounds.x + scaledBounds.width / 2 - handleSize / 2}px`,
              top: `${scaledBounds.y - 26 - handleSize}px`,
              touchAction: 'none',
              width: `${handleSize}px`
            }}
            type="button"
          >
            <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600" />
          </button>
        </>
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
      <div
        className="pointer-events-auto absolute flex gap-1"
        style={{
          left: `${scaledBounds.x}px`,
          top: `${scaledBounds.y + scaledBounds.height + 10}px`
        }}
      >
        <button
          aria-label="Naar voren"
          title="Naar voren"
          className="rounded-md border-2 border-blue-700 bg-white px-2 py-1 text-xs font-black text-blue-800 shadow-sm"
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onBringForward?.();
          }}
          type="button"
        >
          Voorgrond
        </button>
        <button
          aria-label="Naar achteren"
          title="Naar achteren"
          className="rounded-md border-2 border-blue-700 bg-white px-2 py-1 text-xs font-black text-blue-800 shadow-sm"
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onSendBackward?.();
          }}
          type="button"
        >
          Achtergrond
        </button>
        {showMeasureToggle ? (
          <button
            aria-label="Meetlabel aan of uit"
            title="Toon de lengte in ruitjes"
            className={`rounded-md border-2 px-2 py-1 text-xs font-black shadow-sm ${
              measureActive ? 'border-emerald-700 bg-emerald-600 text-white' : 'border-blue-700 bg-white text-blue-800'
            }`}
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onToggleMeasure?.();
            }}
            type="button"
          >
            Meet
          </button>
        ) : null}
        {/* Zichtbare route naar het bewerkpaneel; dubbelklikken op het
            assenstelsel doet hetzelfde, maar een verborgen dubbelklik mag nooit
            de enige weg zijn - op een aanraakscherm is hij onbetrouwbaar. */}
        {showRangeToggle ? (
          <button
            aria-label="Bereik en asnamen van het assenstelsel"
            aria-pressed={rangeActive}
            title="Bereik en asnamen instellen (of dubbelklik op het assenstelsel)"
            className={`rounded-md border-2 px-2 py-1 text-xs font-black shadow-sm ${
              rangeActive ? 'border-emerald-700 bg-emerald-600 text-white' : 'border-blue-700 bg-white text-blue-800'
            }`}
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onToggleRange?.();
            }}
            type="button"
          >
            Bereik
          </button>
        ) : null}
      </div>
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
  onEraseBrush,
  onRotateObject,
  onSelectObject,
  onSelectObjects,
  onMoveObjects,
  onResizeObjects,
  onDeleteObject,
  onDeleteObjects,
  onReorderObjects,
  onTextChange,
  textCaretRequest,
  onTextCursorChange,
  onMathToolChange,
  onImportedObjectClassroomLog,
  allowFingerDrawing = true,
  instrument = null,
  onInstrumentChange,
  onInstrumentClose,
  focus = null,
  onFocusChange,
  boardTheme = 'light',
  compassPenStyle,
  onCompassStroke,
  onPlaceInstrumentObject,
  onPenStyle,
  boardViewportRef,
  onToggleObjectMeasure,
  onAxesChange,
  onEnableGrid,
  axesPanelRequest = null
}) {
  const surfaceRef = useRef(null);
  const boardRef = useRef(null);
  const canvasRef = useRef(null);
  const previewFrameRef = useRef(0);
  const activeStrokeRef = useRef(null);
  const touchPanRef = useRef(null);
  const interactionRef = useRef(null);
  const eraserGestureRef = useRef(null);
  // Vorige tik op een assenstelsel, om een dubbele tik zelf te herkennen.
  const axesTapRef = useRef(null);
  // Wanneer de pen voor het laatst gezien is (ook zwevend), en welke pointers
  // bij het neerkomen geweigerd zijn. Samen vormen ze de palm rejection die
  // voor pen, gum én selectie geldt.
  const lastPenAtRef = useRef(null);
  const rejectedPointersRef = useRef(new Set());
  const [measuredViewportWidth, setMeasuredViewportWidth] = useState(viewportWidth);
  const [interaction, setInteraction] = useState(null);
  const [eraserCursor, setEraserCursor] = useState(null);
  // Welk assenstelsel zijn bewerkpaneel open heeft staan, en op welke pagina de
  // docent het ruitjesvoorstel heeft weggeklikt. Allebei bewust alleen in dit
  // scherm: er hoeft niets aan opslag of herstel te veranderen.
  const [axesPanel, setAxesPanel] = useState({ objectId: null, requestId: null });
  const [gridSuggestionDismissedPageId, setGridSuggestionDismissedPageId] = useState(null);

  // Een nieuw geplaatst assenstelsel doet zijn paneel meteen open, zodat de
  // docent nooit hoeft te raden hoe hij het bereik instelt.
  if (axesPanelRequest?.requestId && axesPanelRequest.requestId !== axesPanel.requestId) {
    setAxesPanel({ objectId: axesPanelRequest.objectId, requestId: axesPanelRequest.requestId });
  }

  const isEraserTool = tool?.id === 'eraser';
  const eraserRadius = Number.isFinite(tool?.radius) && tool.radius > 0 ? tool.radius : 30;


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

  // Het zichtbare, vrije deel van het bord in boardunits: de werkbalk onderin
  // en de paginabalk bovenin zijn er al af getrokken, en horizontaal is het
  // geknipt op wat er van het bord in het scrollvenster past. Nieuwe
  // instrumenten worden hierbinnen gepast (zie handleInstrument in
  // PresenterShell) en vallen dus nooit half buiten beeld of achter de balken.
  useEffect(() => {
    if (!boardViewportRef) return undefined;

    boardViewportRef.current = () => {
      const surface = surfaceRef.current;
      const boardElement = boardRef.current;
      if (!surface || !boardElement || !(board.scale > 0)) return null;

      const surfaceRect = surface.getBoundingClientRect();
      const boardRect = boardElement.getBoundingClientRect();
      // De werkbalk hangt vast onderin. Ingeklapt bedekt hij alleen zijn eigen
      // randje; hij klapt open bij hover en sluit daarna vanzelf weer. Alleen
      // een vastgezette werkbalk blijft staan, dus alleen die telt als
      // permanent bezet. Een tijdelijk open paneel mag geen instrumenten
      // kleiner maken.
      const toolbarElement =
        typeof document !== 'undefined' ? document.querySelector('[data-presenter-toolbar]') : null;
      const toolbarRect = toolbarElement?.getBoundingClientRect();
      const peekTop = surfaceRect.bottom - PRESENTER_TOOLBAR_PEEK_PX;
      const toolbarTop = !toolbarRect
        ? surfaceRect.bottom - PRESENTER_TOOLBAR_RESERVE_PX
        : toolbarElement.dataset.presenterToolbarPinned === 'true'
          ? Math.min(toolbarRect.top, peekTop)
          : peekTop;

      const visibleTop = Math.max(surfaceRect.top, boardRect.top) + PRESENTER_PAGE_BAR_RESERVE_PX;
      const visibleBottom = Math.min(toolbarTop, boardRect.bottom);
      const visibleLeft = Math.max(surfaceRect.left, boardRect.left);
      const visibleRight = Math.min(surfaceRect.right, boardRect.right);

      return {
        x: Math.max(0, (visibleLeft - boardRect.left) / board.scale),
        y: Math.max(0, (visibleTop - boardRect.top) / board.scale),
        width: Math.max(120, (visibleRight - visibleLeft) / board.scale),
        height: Math.max(120, (visibleBottom - visibleTop) / board.scale),
        scale: board.scale
      };
    };

    return () => {
      boardViewportRef.current = null;
    };
  }, [board.scale, board.width, boardViewportRef]);

  const activeSelectedObjectIds = useMemo(() => {
    const ids = normalizeIds(selectedObjectIds);
    return ids.length > 0 ? ids : normalizeIds(selectedObjectId);
  }, [selectedObjectId, selectedObjectIds]);

  const gridSize = Number.isFinite(page?.background?.gridSize) && page.background.gridSize > 0
    ? page.background.gridSize
    : AXES_DEFAULT_GRID_SIZE;

  // Het enige geselecteerde object, als dat een assenstelsel is. Alle
  // uitzonderingen hieronder hangen hieraan; alle andere objecttypen blijven
  // precies doen wat ze deden.
  const singleAxesObject = useMemo(() => {
    if (activeSelectedObjectIds.length !== 1) return null;

    const object = (Array.isArray(page?.objects) ? page.objects : []).find(
      (candidate) => candidate?.id === activeSelectedObjectIds[0]
    );
    return object?.type === 'axes' ? object : null;
  }, [activeSelectedObjectIds, page]);

  // Smart guides: bij verslepen licht snappen op randen/middens van andere
  // objecten, met hulplijnen in beeld. Een assenstelsel snapt in plaats daarvan
  // op de ruitjes, want anders komen de assen naast de roosterlijnen te liggen.
  const computeMoveSnap = useCallback((objectIds, rawDx, rawDy) => {
    const baseBounds = getPresenterSelectionBounds(page, objectIds);
    if (!baseBounds) return { dx: 0, dy: 0, guides: [] };

    const ids = normalizeIds(objectIds);
    const objects = Array.isArray(page?.objects) ? page.objects : [];
    const axesSnap = getAxesMoveSnap({
      objects,
      objectIds: ids,
      bounds: baseBounds,
      dx: rawDx,
      dy: rawDy,
      gridSize
    });
    if (axesSnap) return axesSnap;

    const selectedIds = new Set(ids);
    const otherBounds = objects
      .filter((object) => !selectedIds.has(object?.id))
      .map(getPresenterObjectBounds)
      .filter(Boolean);

    return getAlignmentSnap({ ...baseBounds, x: baseBounds.x + rawDx, y: baseBounds.y + rawDy }, otherBounds);
  }, [gridSize, page]);

  const moveSnap = useMemo(() => {
    if (interaction?.type !== 'move' || !page) return null;

    return computeMoveSnap(
      interaction.objectIds,
      interaction.current.x - interaction.start.x,
      interaction.current.y - interaction.start.y
    );
  }, [computeMoveSnap, interaction, page]);

  // Aan een handvat slepen verandert bij een assenstelsel het bereik in plaats
  // van de schaal. Preview en commit lopen allebei langs deze functie, met
  // hetzelfde eindpunt, zodat er bij loslaten niets verspringt.
  const computeAxesResize = useCallback((activeInteraction, point) => {
    if (activeInteraction?.type !== 'resize' || !point) return null;

    const ids = normalizeIds(activeInteraction.objectIds);
    if (ids.length !== 1) return null;

    const object = (Array.isArray(page?.objects) ? page.objects : []).find((candidate) => candidate?.id === ids[0]);
    if (object?.type !== 'axes') return null;

    return {
      objectId: object.id,
      patch: planAxesResize({
        object,
        gridSize,
        pageWidth: page?.width,
        pageHeight: page?.height,
        handle: activeInteraction.handle,
        dx: point.x - activeInteraction.start.x,
        dy: point.y - activeInteraction.start.y
      })
    };
  }, [gridSize, page]);

  const axesResizePreview = useMemo(
    () => computeAxesResize(interaction, interaction?.current),
    [computeAxesResize, interaction]
  );

  const snappedInteraction = useMemo(() => {
    if (!interaction || interaction.type !== 'move' || !moveSnap || (moveSnap.dx === 0 && moveSnap.dy === 0)) {
      return interaction;
    }

    return {
      ...interaction,
      current: {
        x: interaction.current.x + moveSnap.dx,
        y: interaction.current.y + moveSnap.dy
      }
    };
  }, [interaction, moveSnap]);

  const previewPage = useMemo(
    () => transformObjectsForPreview(page, snappedInteraction, axesResizePreview),
    [axesResizePreview, snappedInteraction, page]
  );

  // Live inkt gaat naar een canvas-laag via requestAnimationFrame; React
  // re-rendert dus niet per pointer-sample. Pas bij het loslaten wordt de
  // stroke gecommit en rendert de SVG-inktlaag hem definitief.
  const drawPreviewStroke = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    const active = activeStrokeRef.current;
    if (!active) return;

    const style = getPresenterStrokeStyle(active.stroke);
    // Zelfde bron als de definitieve SVG-inktlaag (zie PresenterInkLayer),
    // dus preview en resultaat zijn per constructie hetzelfde pad.
    const render = buildStrokeRenderPath(active.stroke, style.width);
    if (!render.d) return;

    const devicePixels = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
    context.setTransform(board.scale * devicePixels, 0, 0, board.scale * devicePixels, 0, 0);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.globalAlpha = style.opacity;

    const path = new Path2D(render.d);
    if (render.mode === 'fill') {
      context.fillStyle = style.color;
      context.fill(path);
      return;
    }

    context.strokeStyle = style.color;
    context.lineWidth = render.width;
    context.stroke(path);
  };

  const schedulePreviewDraw = () => {
    if (previewFrameRef.current) return;

    previewFrameRef.current = requestAnimationFrame(() => {
      previewFrameRef.current = 0;
      drawPreviewStroke();
    });
  };

  useEffect(() => () => {
    if (previewFrameRef.current) cancelAnimationFrame(previewFrameRef.current);
  }, []);

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
    schedulePreviewDraw();
    onStrokeComplete?.(activeStroke.stroke);
  };

  const cancelActiveStroke = () => {
    activeStrokeRef.current = null;
    schedulePreviewDraw();
  };

  const startTouchPan = (event) => {
    const current = touchPanRef.current || { pointers: new Map() };
    current.pointers.set(event.pointerId, event.clientY);
    touchPanRef.current = current;
  };

  const applyTouchPan = (event) => {
    const pan = touchPanRef.current;
    if (!pan) return false;

    if (!pan.pointers.has(event.pointerId)) {
      if (event.pointerType === 'touch') {
        pan.pointers.set(event.pointerId, event.clientY);
        return true;
      }
      return false;
    }

    const previousY = pan.pointers.get(event.pointerId);
    pan.pointers.set(event.pointerId, event.clientY);

    const surface = surfaceRef.current;
    if (surface) surface.scrollTop -= event.clientY - previousY;
    return true;
  };

  const endTouchPan = (event) => {
    const pan = touchPanRef.current;
    if (!pan) return;

    pan.pointers.delete(event.pointerId);
    if (pan.pointers.size === 0) touchPanRef.current = null;
  };

  // Loslaten: de pointer is niet langer geweigerd, en na een pen begint de
  // nawerktijd waarin touch nog even genegeerd wordt te lopen.
  const releasePointer = (event) => {
    if (event?.pointerId != null) rejectedPointersRef.current.delete(event.pointerId);
    if (event?.pointerType === 'pen') lastPenAtRef.current = getEventTime(event);
  };

  const completeEraserGesture = (event) => {
    const gesture = eraserGestureRef.current;
    if (!gesture || (event?.pointerId != null && event.pointerId !== gesture.pointerId)) return;

    eraserGestureRef.current = null;
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

    if (nextInteraction.type === 'rotate') {
      onRotateObject?.(nextInteraction.objectId, getRotationPreviewValue(nextInteraction));
      return;
    }

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
      if (!hasMoved) return;

      // Exact dezelfde snap als in de preview, anders springt het object bij
      // loslaten alsnog van de roosterlijn af.
      const snap = computeMoveSnap(nextInteraction.objectIds, dx, dy);

      onMoveObjects?.(nextInteraction.objectIds, { dx: dx + snap.dx, dy: dy + snap.dy });
      return;
    }

    if (nextInteraction.type === 'resize' && hasMoved) {
      const axesResize = computeAxesResize(nextInteraction, point);
      if (axesResize) {
        onAxesChange?.(axesResize.objectId, axesResize.patch);
        return;
      }

      onResizeObjects?.(
        nextInteraction.objectIds,
        nextInteraction.bounds,
        getResizeBounds(nextInteraction.bounds, nextInteraction.start, point, nextInteraction.handle)
      );
    }
  };

  const eraseAlongSegment = (from, to) => {
    onEraseBrush?.({ from, to, radius: eraserRadius }, eraserGestureRef.current?.gestureId);
  };

  // Eén afweging vóór de gereedschapskeuze: pen, vinger en handpalm worden
  // voor tekenen, gummen en selecteren op dezelfde manier gewogen.
  const handlePointerDown = (event) => {
    onInteract?.();

    const pointerType = event.pointerType || 'mouse';
    if (pointerType === 'pen') lastPenAtRef.current = getEventTime(event);

    const activeStroke = activeStrokeRef.current;
    const decision = resolvePointerIntent({
      pointerType,
      pointerWidth: event.width,
      pointerHeight: event.height,
      button: event.button,
      toolId: isEraserTool ? 'eraser' : tool?.id === 'select' ? 'select' : 'draw',
      canDraw: Boolean(onStrokeComplete),
      allowFingerDrawing,
      activeStrokePointerType: activeStroke?.pointerType || null,
      touchPanActive: Boolean(touchPanRef.current),
      lastPenAt: lastPenAtRef.current,
      now: getEventTime(event)
    });

    if (decision.intent === 'ignore') {
      // Onthouden, zodat de bijbehorende bewegingen ook genegeerd worden.
      rejectedPointersRef.current.add(event.pointerId);
      return;
    }

    rejectedPointersRef.current.delete(event.pointerId);
    if (decision.cancelActiveStroke) cancelActiveStroke();

    if (decision.intent === 'pan') {
      startTouchPan(event);
      return;
    }

    if (decision.intent === 'erase') {
      const point = getBoardPoint(event);
      if (!point) return;

      event.preventDefault();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      eraserGestureRef.current = {
        pointerId: event.pointerId,
        gestureId: `erase-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        lastPoint: point
      };
      setEraserCursor(point);
      eraseAlongSegment(point, point);
      return;
    }

    if (decision.intent === 'select') {
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

    const point = getBoardPoint(event);
    if (!point) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);

    const pressure = pointerType === 'pen' && Number.isFinite(event.pressure) && event.pressure > 0
      ? Math.round(event.pressure * 100) / 100
      : undefined;

    // Start de streek op de tekenrand van een actief instrument (liniaal/
    // geodriehoek) wanneer de pen daar dichtbij neerkomt: edge-snap.
    const edgeLine = instrument && isPointNearInstrumentEdge(point, instrument)
      ? getInstrumentEdgeLine(instrument)
      : null;
    const startPoint = edgeLine ? projectPointOntoEdge(point, edgeLine) : point;

    const stroke = {
      id: createStrokeId(),
      variant: tool?.variant || tool?.id || 'pen',
      color: tool?.color || '#0B0D0F',
      width: Number.isFinite(tool?.width) && tool.width > 0 ? tool.width : 5,
      pointerType,
      // Langs een instrumentrand is de streek per definitie kaarsrecht; die
      // hoort geen aanzet- en afzetdunte te krijgen, ook niet nadat de gum hem
      // in stukken heeft geknipt.
      ...(edgeLine ? { straight: true } : {}),
      points: [pressure === undefined ? startPoint : { ...startPoint, p: pressure }]
    };

    activeStrokeRef.current = {
      pointerId: event.pointerId,
      pointerType,
      edgeLine,
      stroke
    };
    schedulePreviewDraw();
  };

  const handlePointerMove = (event) => {
    // Een pointer die bij het neerkomen geweigerd is (handpalm, of touch vlak
    // na de pen) blijft geweigerd tot hij loslaat.
    if (rejectedPointersRef.current.has(event.pointerId)) return;

    if (event.pointerType === 'pen') {
      // Ook zwevend: de hand die de pen vasthoudt landt vaak net iets eerder
      // op het bord dan de punt zelf.
      lastPenAtRef.current = getEventTime(event);
    } else if (isPalmContact({ pointerType: event.pointerType, width: event.width, height: event.height })) {
      rejectedPointersRef.current.add(event.pointerId);
      return;
    }

    if (isEraserTool) {
      const point = getBoardPoint(event);
      if (!point) return;

      setEraserCursor(point);

      const gesture = eraserGestureRef.current;
      if (gesture && event.pointerId === gesture.pointerId) {
        event.preventDefault();
        eraseAlongSegment(gesture.lastPoint, point);
        eraserGestureRef.current = { ...gesture, lastPoint: point };
      }
      return;
    }

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

    if (applyTouchPan(event)) {
      event.preventDefault();
      return;
    }

    const activeStroke = activeStrokeRef.current;
    if (!activeStroke || event.pointerId !== activeStroke.pointerId) return;

    event.preventDefault();

    // Alle tussenliggende samples meenemen: een pen die sneller rapporteert
    // dan het scherm ververst levert er meerdere per beweging, en zonder die
    // punten wordt een snelle haal hoekig.
    const samples = getCoalescedPointerSamples(event);
    const firstPoint = activeStroke.stroke.points[0];
    const isSinglePointStroke = Boolean(activeStroke.edgeLine) || activeStroke.stroke.variant === 'geometry-pen';
    let nextPoints = activeStroke.stroke.points;
    let lastPoint = null;

    for (const sample of samples) {
      const point = getBoardPoint(sample);
      if (!point) continue;

      const pressure = activeStroke.pointerType === 'pen' && Number.isFinite(sample.pressure) && sample.pressure > 0
        ? Math.round(sample.pressure * 100) / 100
        : undefined;
      const projectedPoint = activeStroke.edgeLine ? projectPointOntoEdge(point, activeStroke.edgeLine) : point;
      const nextPoint = pressure === undefined ? projectedPoint : { ...projectedPoint, p: pressure };

      lastPoint = nextPoint;
      if (!isSinglePointStroke) nextPoints = appendStrokePoint(nextPoints, nextPoint);
    }

    if (!lastPoint) return;

    // Ligt de streek op de tekenrand van een instrument, dan is die rand de
    // bron van waarheid: de 45°-snap van de lijnpen mag hem niet wegtrekken.
    if (activeStroke.edgeLine) {
      nextPoints = [firstPoint, lastPoint];
    } else if (activeStroke.stroke.variant === 'geometry-pen') {
      nextPoints = [firstPoint, constrainLineEnd(firstPoint, lastPoint, { angleSnap: event.shiftKey })];
    } else if (nextPoints === activeStroke.stroke.points) {
      // Niets nieuws: alle samples lagen op het vorige punt.
      return;
    }

    activeStrokeRef.current = {
      ...activeStroke,
      stroke: {
        ...activeStroke.stroke,
        points: nextPoints
      }
    };
    schedulePreviewDraw();
  };

  // Twee keer kort achter elkaar op een assenstelsel tikken opent het
  // bewerkpaneel. Dit wordt bij ELKE tik gemeten, ook die op de selectiebox:
  // na de eerste tik ligt die box over de figuur heen, en dan komt de tweede
  // tik daar terecht in plaats van op de as zelf.
  const registerAxesTap = (event, objectId, point) => {
    if (!objectId || !point) return;

    const object = (Array.isArray(page?.objects) ? page.objects : []).find(
      (candidate) => candidate?.id === objectId
    );
    if (object?.type !== 'axes') return;

    const tap = { objectId, x: point.x, y: point.y, time: getEventTime(event) };

    if (isAxesDoubleTap(axesTapRef.current, tap)) {
      axesTapRef.current = null;
      setAxesPanel((current) => ({ objectId, requestId: current.requestId }));
      return;
    }

    axesTapRef.current = tap;
  };

  const handleObjectPointerDown = (event, objectId) => {
    if (tool?.id !== 'select' || event.button !== 0) return;

    const point = getBoardPoint(event);
    if (!point) return;

    registerAxesTap(event, objectId, point);

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

    if (activeSelectedObjectIds.length === 1) {
      registerAxesTap(event, activeSelectedObjectIds[0], point);
    }

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

  const measurableSelectedObject = useMemo(() => {
    if (activeSelectedObjectIds.length !== 1) return null;

    const object = (Array.isArray(page?.objects) ? page.objects : []).find(
      (candidate) => candidate?.id === activeSelectedObjectIds[0]
    );
    return object && (object.type === 'line' || object.type === 'arrow') ? object : null;
  }, [activeSelectedObjectIds, page]);

  const rotatableSelectedObject = useMemo(() => {
    if (activeSelectedObjectIds.length !== 1) return null;

    const object = (Array.isArray(page?.objects) ? page.objects : []).find(
      (candidate) => candidate?.id === activeSelectedObjectIds[0]
    );
    return object && canRotatePresenterObject(object) ? object : null;
  }, [activeSelectedObjectIds, page]);

  const handleRotatePointerDown = (event) => {
    if (tool?.id !== 'select' || event.button !== 0 || !rotatableSelectedObject || !selectionBounds) return;

    const point = getBoardPoint(event);
    if (!point) return;

    const center = {
      x: selectionBounds.x + selectionBounds.width / 2,
      y: selectionBounds.y + selectionBounds.height / 2
    };

    event.preventDefault();
    event.stopPropagation();
    boardRef.current?.setPointerCapture?.(event.pointerId);
    updateInteraction({
      type: 'rotate',
      pointerId: event.pointerId,
      objectId: rotatableSelectedObject.id,
      center,
      baseRotation: getNumber(rotatableSelectedObject.rotation),
      startAngle: getPointerRotationDegrees(center, point),
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

  const axesPanelVisible = Boolean(
    singleAxesObject && axesPanel.objectId === singleAxesObject.id && tool?.id === 'select' && selectionBounds
  );
  const backgroundKind = page?.background?.kind || 'white';
  const showGridSuggestion =
    backgroundKind !== 'grid' && backgroundKind !== 'mm' && gridSuggestionDismissedPageId !== (page?.id ?? null);

  const toggleAxesPanel = () => {
    if (!singleAxesObject) return;

    setAxesPanel((current) => ({
      objectId: current.objectId === singleAxesObject.id ? null : singleAxesObject.id,
      requestId: current.requestId
    }));
  };

  const applyAxesUpdate = ({ range, labels }) => {
    if (!singleAxesObject) return;

    const patch = planAxesUpdate({
      object: singleAxesObject,
      range,
      labels,
      gridSize,
      pageWidth: page?.width,
      pageHeight: page?.height,
      // Een groter bereik mag de figuur niet onder de werkbalk of buiten beeld
      // duwen: past hij nog in het zichtbare deel, dan schuift hij terug.
      visibleRect: boardViewportRef?.current?.() || null
    });
    if (!patch) return;

    onAxesChange?.(singleAxesObject.id, patch);
  };

  const handleEnableGrid = () => {
    setGridSuggestionDismissedPageId(page?.id ?? null);
    onEnableGrid?.();
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
      className={`flex min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-28 pt-5 ${
        boardTheme === 'dark' ? 'bg-slate-950' : 'bg-slate-200'
      }`}
      style={{ touchAction }}
    >
      <div
        key={page?.id || 'presenter-page'}
        ref={boardRef}
        data-presenter-board="true"
        className={`presenter-page-enter relative mx-auto shrink-0 overflow-hidden shadow-sm ring-1 ${
          boardTheme === 'dark' ? 'bg-slate-900 ring-slate-700' : 'bg-slate-50 ring-slate-300'
        }`}
        onLostPointerCapture={(event) => {
          completeActiveStroke(event);
          completeSelectionInteraction(event);
          completeEraserGesture(event);
          endTouchPan(event);
          releasePointer(event);
        }}
        onPointerCancel={(event) => {
          completeActiveStroke(event);
          completeSelectionInteraction(event);
          completeEraserGesture(event);
          endTouchPan(event);
          releasePointer(event);
        }}
        onPointerDown={handlePointerDown}
        onPointerLeave={() => {
          if (isEraserTool && !eraserGestureRef.current) setEraserCursor(null);
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => {
          completeActiveStroke(event);
          completeSelectionInteraction(event);
          completeEraserGesture(event);
          endTouchPan(event);
          releasePointer(event);
        }}
        style={{
          width: `${board.scaledWidth}px`,
          height: `${board.scaledHeight}px`,
          touchAction: boardTouchAction
        }}
      >
        <PresenterBackground background={page?.background} scale={board.scale} theme={boardTheme} />
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
          onImportedObjectClassroomLog={onImportedObjectClassroomLog}
        />
        <PresenterInkLayer page={page} theme={boardTheme} />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          width={Math.max(1, Math.round(board.scaledWidth * ((typeof window !== 'undefined' && window.devicePixelRatio) || 1)))}
          height={Math.max(1, Math.round(board.scaledHeight * ((typeof window !== 'undefined' && window.devicePixelRatio) || 1)))}
        />
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
        {interaction?.type === 'move' && moveSnap?.guides?.length
          ? moveSnap.guides.map((guide) => (
              <div
                key={`${guide.axis}-${guide.position}`}
                className="pointer-events-none absolute bg-fuchsia-500/70"
                style={
                  guide.axis === 'vertical'
                    ? { left: `${guide.position * board.scale}px`, top: 0, bottom: 0, width: '2px' }
                    : { top: `${guide.position * board.scale}px`, left: 0, right: 0, height: '2px' }
                }
              />
            ))
          : null}
        {selectionBounds ? (
          <SelectionTransformBox
            bounds={selectionBounds}
            allowInteriorInteraction={selectedObjectAllowsInteriorInteraction}
            showRotate={Boolean(rotatableSelectedObject)}
            scale={board.scale}
            onDelete={handleSelectionDelete}
            onMovePointerDown={handleSelectionPointerDown}
            onResizePointerDown={handleResizePointerDown}
            onRotatePointerDown={handleRotatePointerDown}
            onBringForward={() => onReorderObjects?.(activeSelectedObjectIds, 'front')}
            onSendBackward={() => onReorderObjects?.(activeSelectedObjectIds, 'back')}
            showMeasureToggle={Boolean(measurableSelectedObject)}
            measureActive={Boolean(measurableSelectedObject?.showMeasure)}
            onToggleMeasure={() => onToggleObjectMeasure?.(measurableSelectedObject?.id)}
            showRangeToggle={Boolean(singleAxesObject)}
            rangeActive={axesPanelVisible}
            onToggleRange={toggleAxesPanel}
          />
        ) : null}
        {axesPanelVisible ? (
          <PresenterAxesPanel
            object={singleAxesObject}
            bounds={selectionBounds}
            scale={board.scale}
            boardWidth={board.width}
            boardHeight={board.height}
            showGridSuggestion={showGridSuggestion}
            onApplyRange={(range) => applyAxesUpdate({ range })}
            onApplyLabels={(labels) => applyAxesUpdate({ labels })}
            onEnableGrid={handleEnableGrid}
            onDismissGridSuggestion={() => setGridSuggestionDismissedPageId(page?.id ?? null)}
            onClose={() => setAxesPanel((current) => ({ objectId: null, requestId: current.requestId }))}
          />
        ) : null}
        {instrument ? (
          <PresenterInstrumentOverlay
            instrument={instrument}
            scale={board.scale}
            gridSize={page?.background?.gridSize || 96}
            penStyle={compassPenStyle}
            boardWidth={board.width}
            boardHeight={board.height}
            onChange={onInstrumentChange}
            onClose={onInstrumentClose}
            onDrawStroke={onCompassStroke}
            onPlaceObject={onPlaceInstrumentObject}
            onPenStyle={onPenStyle}
          />
        ) : null}
        {(Array.isArray(previewPage?.objects) ? previewPage.objects : [])
          .filter((object) => object?.showMeasure && (object.type === 'line' || object.type === 'arrow'))
          .map((object) => {
            const gridSize = page?.background?.gridSize || 96;
            const length = Math.hypot(getNumber(object.width, 0), getNumber(object.height, 0));
            const units = Math.round((length / gridSize) * 10) / 10;
            const midX = (getNumber(object.x) + getNumber(object.width, 0) / 2) * board.scale;
            const midY = (getNumber(object.y) + getNumber(object.height, 0) / 2) * board.scale;

            return (
              <span
                key={`measure-${object.id}`}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-[130%] rounded-md bg-slate-950/85 px-2 py-0.5 text-sm font-black text-white"
                style={{ left: `${midX}px`, top: `${midY}px` }}
              >
                {String(units).replace('.', ',')} ruitjes
              </span>
            );
          })}
        <PresenterFocusLayer focus={focus} scale={board.scale} onFocusChange={onFocusChange} />
        {isEraserTool && eraserCursor ? (
          <div
            className="pointer-events-none absolute rounded-full border-2 border-slate-500/80 bg-white/40"
            style={{
              height: `${eraserRadius * 2 * board.scale}px`,
              left: `${(eraserCursor.x - eraserRadius) * board.scale}px`,
              top: `${(eraserCursor.y - eraserRadius) * board.scale}px`,
              width: `${eraserRadius * 2 * board.scale}px`
            }}
          />
        ) : null}
        <div className="pointer-events-none absolute left-4 top-4 rounded bg-slate-900/75 px-2.5 py-1 text-xs font-semibold text-slate-50">
          {page?.title || 'Pagina'}
        </div>
      </div>
    </div>
  );
}
