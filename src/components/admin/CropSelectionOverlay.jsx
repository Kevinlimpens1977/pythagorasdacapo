/**
 * Crop Selection Overlay Component
 * SVG layer for drawing rectangles on canvas.
 */

import { useRef, useState } from 'react';
import { validateAndClipCoordinates } from '../../services/cropService';

const MIN_RECTANGLE_SIZE = 20;

export default function CropSelectionOverlay({
  imageData,
  selections,
  onSelectionsChanged,
  zoom = 1,
  panOffset = { x: 0, y: 0 }
}) {
  const svgRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentRectangle, setCurrentRectangle] = useState(null);

  if (!imageData) return null;

  const displayToOriginal = (x, y) => ({
    x: Math.round((x - panOffset.x) / zoom / imageData.canvasWidth * imageData.width),
    y: Math.round((y - panOffset.y) / zoom / imageData.canvasHeight * imageData.height)
  });

  const originalToDisplay = (origX, origY) => ({
    x: origX / imageData.width * imageData.canvasWidth + panOffset.x / zoom,
    y: origY / imageData.height * imageData.canvasHeight + panOffset.y / zoom
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

  const handleMouseDown = (event) => {
    const pos = getMousePos(event);
    setIsDrawing(true);
    setCurrentRectangle({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0
    });
  };

  const handleMouseMove = (event) => {
    if (!isDrawing || !currentRectangle) return;

    const pos = getMousePos(event);
    setCurrentRectangle((previous) => ({
      ...previous,
      width: pos.x - previous.x,
      height: pos.y - previous.y
    }));
  };

  const handleMouseUp = () => {
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
    const color = selection.type === 'text' ? '#3b82f6' : '#10b981';

    return (
      <g key={selection.id} pointerEvents="none">
        <rect
          x={topLeft.x}
          y={topLeft.y}
          width={bottomRight.x - topLeft.x}
          height={bottomRight.y - topLeft.y}
          fill="none"
          stroke={color}
          strokeWidth={2}
        />
        <text
          x={topLeft.x + 6}
          y={topLeft.y + 18}
          fontSize="14"
          fontWeight="bold"
          fill={color}
          pointerEvents="none"
        >
          {selection.label}
        </text>
      </g>
    );
  };

  const renderDrawingRectangle = () => {
    if (!currentRectangle) return null;

    return (
      <rect
        x={currentRectangle.x}
        y={currentRectangle.y}
        width={currentRectangle.width}
        height={currentRectangle.height}
        fill="rgba(16, 185, 129, 0.1)"
        stroke="#10b981"
        strokeWidth={2}
        strokeDasharray="5,5"
        pointerEvents="none"
      />
    );
  };

  return (
    <svg
      ref={svgRef}
      width={imageData.canvasWidth}
      height={imageData.canvasHeight}
      className="absolute inset-0"
      style={{ pointerEvents: 'auto', cursor: 'crosshair' }}
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
