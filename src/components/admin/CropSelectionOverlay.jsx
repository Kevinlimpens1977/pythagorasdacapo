/**
 * Crop Selection Overlay Component
 * SVG layer for drawing and manipulating rectangles on canvas
 */

import { useState, useRef } from 'react';

const MIN_RECTANGLE_SIZE = 20;
const HANDLE_SIZE = 8;

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
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!imageData) return null;

  // Convert display coordinates to original image space
  const displayToOriginal = (x, y) => ({
    x: Math.round((x - panOffset.x) / zoom / imageData.canvasWidth * imageData.width),
    y: Math.round((y - panOffset.y) / zoom / imageData.canvasHeight * imageData.height)
  });

  // Convert original image space to SVG coordinates (NOT including zoom - zoom is applied by CSS transform)
  const originalToDisplay = (origX, origY) => ({
    x: origX / imageData.width * imageData.canvasWidth + panOffset.x / zoom,
    y: origY / imageData.height * imageData.canvasHeight + panOffset.y / zoom
  });

  // Get mouse position relative to SVG (accounting for zoom, pan, and browser zoom)
  const getMousePos = (e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };

    // Use SVG's native point transformation to handle all zoom levels correctly
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;

    // Get the CTM (Current Transformation Matrix) of the SVG
    // This accounts for all CSS transforms including browser zoom
    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) return { x: 0, y: 0 };

    // Invert the transformation to get SVG coordinates
    const svgPoint = point.matrixTransform(screenCTM.inverse());

    return {
      x: svgPoint.x,
      y: svgPoint.y
    };
  };

  // Start drawing rectangle
  const handleMouseDown = (e) => {
    if (selectedIndex !== null) return;

    const pos = getMousePos(e);
    setIsDrawing(true);
    setCurrentRectangle({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0
    });
  };

  // Continue drawing rectangle
  const handleMouseMove = (e) => {
    if (!isDrawing || !currentRectangle) return;

    const pos = getMousePos(e);
    const width = pos.x - currentRectangle.x;
    const height = pos.y - currentRectangle.y;

    setCurrentRectangle(prev => ({
      ...prev,
      width,
      height
    }));
  };

  // Finish drawing rectangle
  const handleMouseUp = () => {
    if (!isDrawing || !currentRectangle) {
      setIsDrawing(false);
      return;
    }

    // Ensure width/height are positive
    let rect = { ...currentRectangle };
    if (rect.width < 0) {
      rect.x += rect.width;
      rect.width = Math.abs(rect.width);
    }
    if (rect.height < 0) {
      rect.y += rect.height;
      rect.height = Math.abs(rect.height);
    }

    // Check minimum size
    if (rect.width > MIN_RECTANGLE_SIZE && rect.height > MIN_RECTANGLE_SIZE) {
      // Convert to original image space
      const topLeft = displayToOriginal(rect.x, rect.y);
      const bottomRight = displayToOriginal(rect.x + rect.width, rect.y + rect.height);

      const originalCoords = {
        x: Math.min(topLeft.x, bottomRight.x),
        y: Math.min(topLeft.y, bottomRight.y),
        width: Math.abs(bottomRight.x - topLeft.x),
        height: Math.abs(bottomRight.y - topLeft.y)
      };

      // Create new selection
      const newSelection = {
        id: `sel_${Date.now()}`,
        type: 'image', // Default type
        label: `${selections.length + 1}`,
        cropCoordinates: originalCoords,
        originalImageSize: { width: imageData.width, height: imageData.height }
      };

      onSelectionsChanged([...selections, newSelection]);
    }

    setIsDrawing(false);
    setCurrentRectangle(null);
  };

  // Delete selection
  const handleDelete = (index) => {
    onSelectionsChanged(selections.filter((_, i) => i !== index));
    setSelectedIndex(null);
  };

  // Render rectangle in display space
  const renderRectangle = (selection, index) => {
    const topLeft = originalToDisplay(selection.cropCoordinates.x, selection.cropCoordinates.y);
    const bottomRight = originalToDisplay(
      selection.cropCoordinates.x + selection.cropCoordinates.width,
      selection.cropCoordinates.y + selection.cropCoordinates.height
    );

    const x = topLeft.x;
    const y = topLeft.y;
    const width = bottomRight.x - topLeft.x;
    const height = bottomRight.y - topLeft.y;

    const isSelected = selectedIndex === index;
    const color = selection.type === 'text' ? '#3b82f6' : '#10b981';
    const strokeWidth = isSelected ? 3 : 2;

    return (
      <g key={selection.id}>
        {/* Rectangle outline */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          className="cursor-pointer hover:stroke-current"
          onClick={() => setSelectedIndex(index)}
        />

        {/* Label */}
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

        {/* Resize handles (only if selected) */}
        {isSelected && (
          <>
            {/* Corner handles */}
            {[
              { x: x - HANDLE_SIZE / 2, y: y - HANDLE_SIZE / 2, pos: 'nw' },
              { x: x + width - HANDLE_SIZE / 2, y: y - HANDLE_SIZE / 2, pos: 'ne' },
              { x: x - HANDLE_SIZE / 2, y: y + height - HANDLE_SIZE / 2, pos: 'sw' },
              { x: x + width - HANDLE_SIZE / 2, y: y + height - HANDLE_SIZE / 2, pos: 'se' }
            ].map(handle => (
              <rect
                key={handle.pos}
                x={handle.x}
                y={handle.y}
                width={HANDLE_SIZE}
                height={HANDLE_SIZE}
                fill={color}
                stroke="white"
                strokeWidth={1}
                className="cursor-move"
                data-handle={handle.pos}
              />
            ))}

            {/* Delete button */}
            <circle
              cx={x + width + 15}
              cy={y - 15}
              r={12}
              fill="#ef4444"
              className="cursor-pointer hover:fill-red-600"
              onClick={() => handleDelete(index)}
            />
            <text
              x={x + width + 15}
              y={y - 10}
              textAnchor="middle"
              fontSize="16"
              fill="white"
              pointerEvents="none"
              fontWeight="bold"
            >
              ×
            </text>
          </>
        )}
      </g>
    );
  };

  // Render current drawing rectangle
  const renderDrawingRectangle = () => {
    if (!currentRectangle) return null;

    const x = currentRectangle.x;
    const y = currentRectangle.y;
    const width = currentRectangle.width;
    const height = currentRectangle.height;

    return (
      <g key="drawing">
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="rgba(16, 185, 129, 0.1)"
          stroke="#10b981"
          strokeWidth={2}
          strokeDasharray="5,5"
        />
      </g>
    );
  };

  return (
    <svg
      ref={svgRef}
      width={imageData.canvasWidth}
      height={imageData.canvasHeight}
      className="absolute inset-0"
      style={{
        pointerEvents: 'auto',
        cursor: 'crosshair'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* All selections */}
      {selections.map((selection, index) => renderRectangle(selection, index))}

      {/* Current drawing */}
      {renderDrawingRectangle()}
    </svg>
  );
}
