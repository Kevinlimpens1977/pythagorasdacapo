/**
 * Image Canvas Editor Component
 * Handles image upload/paste and canvas rendering with rectangle selection overlay
 */

import React, { useState, useRef, useEffect } from 'react';
import { Upload, ZoomIn, ZoomOut, Trash2 } from 'lucide-react';
import { loadImageData, validateAndClipCoordinates } from '../../services/cropService';
import CropSelectionOverlay from './CropSelectionOverlay';

const ZOOM_STEP = 0.2;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

export default function ImageCanvasEditor({
  onImageLoaded,
  onSelectionsChanged,
  selections = [],
  imageData = null
}) {
  const canvasContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP)');
      return;
    }

    // Check file size (warn if > 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image is larger than 5MB; may load slowly');
      // Don't return - let user proceed at their own risk
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await loadImageData(file);
      onImageLoaded(data);
      setZoom(1);
      setPanOffset({ x: 0, y: 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle paste from clipboard
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        handleFileUpload(file);
        break;
      }
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Zoom in/out
  const handleZoom = (direction) => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev + ZOOM_STEP : prev - ZOOM_STEP;
      return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    });
  };

  // Pan (drag to move canvas)
  const handleMouseDown = (e) => {
    if (e.button !== 1 && e.button !== 2) return; // Middle or right mouse button
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setPanOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  // Setup paste listener
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    container.addEventListener('paste', handlePaste);
    return () => container.removeEventListener('paste', handlePaste);
  }, []);

  // Setup mouse listeners for panning
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // Reset
  const handleReset = () => {
    onImageLoaded(null);
    onSelectionsChanged([]);
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      ref={canvasContainerRef}
      className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden focus:outline-none"
      tabIndex={0}
      onPaste={handlePaste}
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(90deg, #e5e7eb 1px, transparent 1px), linear-gradient(#e5e7eb 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Image container with zoom/pan */}
      {imageData ? (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          <div
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
              transformOrigin: 'center',
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
          >
            {/* Canvas image */}
            <img
              src={imageData.src}
              alt="Canvas"
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-xl select-none"
              style={{
                width: imageData.canvasWidth,
                height: imageData.canvasHeight,
                pointerEvents: 'none'
              }}
            />

            {/* Selection overlay */}
            <CropSelectionOverlay
              imageData={imageData}
              selections={selections}
              onSelectionsChanged={onSelectionsChanged}
              zoom={zoom}
              panOffset={panOffset}
            />
          </div>
        </div>
      ) : (
        /* Empty state - upload prompt */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload or Paste Image</h2>
            <p className="text-gray-600 mb-4">
              Select a JPG/PNG from your computer or paste from clipboard (Ctrl+V / Cmd+V)
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            <Upload size={20} />
            {isLoading ? 'Loading...' : 'Upload Image'}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Zoom controls */}
      {imageData && (
        <div className="absolute bottom-6 left-6 flex gap-2 bg-white rounded-lg shadow-lg p-2">
          <button
            onClick={() => handleZoom('out')}
            disabled={zoom <= MIN_ZOOM}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            title="Zoom out (-),"
          >
            <ZoomOut size={20} />
          </button>
          <div className="px-3 py-2 text-sm font-medium text-gray-600 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={() => handleZoom('in')}
            disabled={zoom >= MAX_ZOOM}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            title="Zoom in (+)"
          >
            <ZoomIn size={20} />
          </button>
        </div>
      )}

      {/* Reset button */}
      {imageData && (
        <button
          onClick={handleReset}
          className="absolute top-6 right-6 p-2 bg-white hover:bg-gray-100 rounded-lg shadow-lg transition-colors text-gray-700"
          title="Reset image and selections"
        >
          <Trash2 size={20} />
        </button>
      )}

      {/* Info overlay */}
      {imageData && (
        <div className="absolute top-6 left-6 bg-white rounded-lg shadow-lg p-3 text-sm text-gray-700">
          <p className="font-medium">{imageData.width} × {imageData.height}px</p>
          <p className="text-xs text-gray-600">Scale: 1:{imageData.scale.toFixed(1)}</p>
          <p className="text-xs text-gray-600">Selections: {selections.length}</p>
        </div>
      )}
    </div>
  );
}
