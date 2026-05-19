/**
 * Crop Selection Overlay Component
 * SVG layer for drawing, moving and resizing crop rectangles.
 */

import { useRef, useState } from 'react';
import { validateAndClipCoordinates } from '../../services/cropService';

const MIN_RECTANGLE_SIZE = 6;
const HANDLE_SIZE = 10;

const resizeHandles = [
  { id: 'nw', cursor: 'nwse-resize', x: 0, y: 0 },
  { id: 'n', cursor: 'ns-resize', x: 0.5, y: 0 },
  { id: 'ne', cursor: 'nesw-resize', x: 1, y: 0 },
  { id: 'e', cursor: 'ew-resize', x: 1, y: 0.5 },
  { id: 'se', cursor: 'nwse-resize', x: 1, y: 1 },
  { id: 's', cursor: 'ns-resize', x: 0.5, y: 1 },
  { id: 'sw', cursor: 'nesw-resize', x: 0, y: 1 },
  { id: 'w', cursor: 'ew-resize', x: 0, y: 0.5 }
];

export default function CropSelectionOverlay({
  imageData,
  selections,
  onSelectionsChanged,
  interactionMode = 'select',
  isTemporaryHandMode = false
}) {
  const svgRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentRectangle, setCurrentRectangle] = useState(null);
  const [activeSelectionId, setActiveSelectionId] = useState(null);
  const [editAction, setEditAction] = useState(null);

  if (!imageData) return null;

  const isSelectionMode = interactionMode === 'select' && !isTemporaryHandMode;

  const displayToOriginal = (x, y) => ({
    x: Math.round(x / imageData.canvasWidth * imageData.width),
    y: Math.round(y / imageData.canvasHeight * imageData.height)
  });

  const originalToDisplay = (origX, origY) => ({
    x: origX / imageData.width * imageData.canvasWidth,
    y: origY / imageData.height * imageData.canvasHeight
  });

  const originalDeltaFromDisplay = (deltaX, deltaY) => ({
    x: deltaX / imageData.canvasWidth * imageData.width,
    y: deltaY / imageData.canvasHeight * imageData.height
  });

  const getMousePos = (event) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) return { x: 0, y: 0 };

    const svgPoint = point.matrixTransform(screenCTM.inverse());
    return { x: svgPoint.x, y: svgPoint.y };
  };

  const updateSelectionCoordinates = (selectionId, cropCoordinates) => {
    const clipped = validateAndClipCoordinates(cropCoordinates, {
      width: imageData.width,
      height: imageData.height
    });

    if (!clipped) return;

    onSelectionsChanged(
      selections.map((selection) =>
        selection.id === selectionId
          ? {
              ...selection,
              cropCoordinates: clipped,
              originalImageSize: { width: imageData.width, height: imageData.height }
            }
          : selection
      )
    );
  };

  const handleMouseDown = (event) => {
    if (!isSelectionMode || event.button !== 0) return;

    setActiveSelectionId(null);
    const pos = getMousePos(event);
    setIsDrawing(true);
    setCurrentRectangle({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0
    });
  };

  const handleSelectionMouseDown = (event, selection, actionType = 'select') => {
    if (!isSelectionMode || event.button !== 0) return;

    event.stopPropagation();
    setActiveSelectionId(selection.id);

    if (actionType === 'select') return;

    setEditAction({
      type: actionType,
      handle: event.currentTarget.dataset.handle || null,
      selectionId: selection.id,
      startPos: getMousePos(event),
      startCoordinates: { ...selection.cropCoordinates }
    });
  };

  const resizeCoordinates = (startCoordinates, delta, handle) => {
    let { x, y, width, height } = startCoordinates;
    const right = x + width;
    const bottom = y + height;

    if (handle.includes('w')) {
      x += delta.x;
      width = right - x;
    }
    if (handle.includes('e')) {
      width += delta.x;
    }
    if (handle.includes('n')) {
      y += delta.y;
      height = bottom - y;
    }
    if (handle.includes('s')) {
      height += delta.y;
    }

    if (width < 0) {
      x += width;
      width = Math.abs(width);
    }
    if (height < 0) {
      y += height;
      height = Math.abs(height);
    }

    return {
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height)
    };
  };

  const handleMouseMove = (event) => {
    if (!isSelectionMode) return;

    if (editAction) {
      const pos = getMousePos(event);
      const displayDelta = {
        x: pos.x - editAction.startPos.x,
        y: pos.y - editAction.startPos.y
      };
      const delta = originalDeltaFromDisplay(displayDelta.x, displayDelta.y);

      if (editAction.type === 'move') {
        const { width, height } = editAction.startCoordinates;
        updateSelectionCoordinates(editAction.selectionId, {
          ...editAction.startCoordinates,
          x: Math.round(Math.max(0, Math.min(imageData.width - width, editAction.startCoordinates.x + delta.x))),
          y: Math.round(Math.max(0, Math.min(imageData.height - height, editAction.startCoordinates.y + delta.y)))
        });
      }

      if (editAction.type === 'resize') {
        updateSelectionCoordinates(
          editAction.selectionId,
          resizeCoordinates(editAction.startCoordinates, delta, editAction.handle)
        );
      }

      return;
    }

    if (!isDrawing || !currentRectangle) return;

    const pos = getMousePos(event);
    setCurrentRectangle((previous) => ({
      ...previous,
      width: pos.x - previous.x,
      height: pos.y - previous.y
    }));
  };

  const handleMouseUp = () => {
    if (editAction) {
      setEditAction(null);
      return;
    }

    if (!isDrawing || !currentRectangle) {
      setIsDrawing(false);
      return;
    }

    const rect = { ...currentRectangle };
    if (rect.width < 0) {
      rect.x += rect.width;
      rect.width = Math.abs(rect.width);
    }
    if (rect.height < 0) {
      rect.y += rect.height;
      rect.height = Math.abs(rect.height);
    }

    if (rect.width > MIN_RECTANGLE_SIZE && rect.height > MIN_RECTANGLE_SIZE) {
      const topLeft = displayToOriginal(rect.x, rect.y);
      const bottomRight = displayToOriginal(rect.x + rect.width, rect.y + rect.height);
      const originalCoords = validateAndClipCoordinates(
        {
          x: Math.min(topLeft.x, bottomRight.x),
          y: Math.min(topLeft.y, bottomRight.y),
          width: Math.abs(bottomRight.x - topLeft.x),
          height: Math.abs(bottomRight.y - topLeft.y)
        },
        { width: imageData.width, height: imageData.height }
      );

      if (originalCoords) {
        onSelectionsChanged([
          ...selections,
          {
            id: `sel_${Date.now()}`,
            type: 'image',
            label: `${selections.length + 1}`,
            cropCoordinates: originalCoords,
            originalImageSize: { width: imageData.width, height: imageData.height }
          }
        ]);
      }
    }

    setIsDrawing(false);
    setCurrentRectangle(null);
  };

  const renderRectangle = (selection) => {
    const topLeft = originalToDisplay(selection.cropCoordinates.x, selection.cropCoordinates.y);
    const bottomRight = originalToDisplay(
      selection.cropCoordinates.x + selection.cropCoordinates.width,
      selection.cropCoordinates.y + selection.cropCoordinates.height
    );
    const x = topLeft.x;
    const y = topLeft.y;
    const width = bottomRight.x - topLeft.x;
    const height = bottomRight.y - topLeft.y;
    const color = selection.type === 'text' ? '#3b82f6' : '#10b981';
    const isActive = activeSelectionId === selection.id;

    return (
      <g key={selection.id}>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={isActive ? `${color}18` : 'transparent'}
          stroke={color}
          strokeWidth={isActive ? 3 : 2}
          pointerEvents={isActive ? 'all' : 'stroke'}
          style={{ cursor: isActive ? 'move' : 'pointer' }}
          onMouseDown={(event) => handleSelectionMouseDown(event, selection, isActive ? 'move' : 'select')}
        />
        <text
          x={x + 6}
          y={y + 18}
          fontSize="14"
          fontWeight="bold"
          fill={color}
          pointerEvents="none"
        >
          {selection.label}
        </text>

        {isActive && (
          <>
            <rect
              x={x}
              y={y - 28}
              width={Math.max(86, Math.min(width, 120))}
              height={24}
              rx={6}
              fill={color}
              style={{ cursor: 'move' }}
              onMouseDown={(event) => handleSelectionMouseDown(event, selection, 'move')}
            />
            <text
              x={x + 10}
              y={y - 12}
              fontSize="12"
              fontWeight="bold"
              fill="white"
              pointerEvents="none"
            >
              Verplaats
            </text>
            {resizeHandles.map((handle) => (
              <rect
                key={handle.id}
                data-handle={handle.id}
                x={x + width * handle.x - HANDLE_SIZE / 2}
                y={y + height * handle.y - HANDLE_SIZE / 2}
                width={HANDLE_SIZE}
                height={HANDLE_SIZE}
                rx={3}
                fill="white"
                stroke={color}
                strokeWidth={2}
                style={{ cursor: handle.cursor }}
                onMouseDown={(event) => handleSelectionMouseDown(event, selection, 'resize')}
              />
            ))}
          </>
        )}
      </g>
    );
  };

  const renderDrawingRectangle = () => {
    if (!currentRectangle) return null;

    const width = Math.abs(Math.round(currentRectangle.width / imageData.canvasWidth * imageData.width));
    const height = Math.abs(Math.round(currentRectangle.height / imageData.canvasHeight * imageData.height));

    return (
      <g pointerEvents="none">
        <rect
          x={currentRectangle.x}
          y={currentRectangle.y}
          width={currentRectangle.width}
          height={currentRectangle.height}
          fill="rgba(16, 185, 129, 0.1)"
          stroke="#10b981"
          strokeWidth={2}
          strokeDasharray="5,5"
        />
        <text
          x={currentRectangle.x + 8}
          y={currentRectangle.y + 22}
          fontSize="13"
          fontWeight="bold"
          fill="#047857"
        >
          {width} x {height}px
        </text>
      </g>
    );
  };

  return (
    <svg
      ref={svgRef}
      width={imageData.canvasWidth}
      height={imageData.canvasHeight}
      className="absolute inset-0"
      style={{ pointerEvents: isSelectionMode ? 'auto' : 'none', cursor: 'crosshair' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {selections.map((selection) => renderRectangle(selection))}
      {renderDrawingRectangle()}
    </svg>
  );
}
