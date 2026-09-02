/**
 * Image Canvas Editor Component
 * Handles image upload/paste and canvas rendering with rectangle selection overlay
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { GripVertical, Hand, MousePointer2, RotateCcw, Upload, ZoomIn, ZoomOut, Trash2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { loadImageData } from '../../services/cropService';
import CropSelectionOverlay from './CropSelectionOverlay';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';

const ZOOM_STEP = 0.2;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5;

const renderFirstPdfPageToDataUrl = async (file) => {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport }).promise;
  return canvas.toDataURL('image/jpeg', 0.9);
};

export default function ImageCanvasEditor({
  onImageLoaded,
  onSelectionsChanged,
  selections = [],
  imageData = null,
  interactionMode = 'select',
  onInteractionModeChange,
  zoom,
  onZoomChange,
  panOffset,
  onPanOffsetChange,
  compact = false,
  showTopActions = true,
  activeSelectionId,
  onActiveSelectionChange
}) {
  const canvasContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [internalZoom, setInternalZoom] = useState(1);
  const [internalPanOffset, setInternalPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const toolbarRef = useRef(null);
  const [toolbarPosition, setToolbarPosition] = useState({ x: compact ? 16 : 24, y: null });
  const [toolbarDrag, setToolbarDrag] = useState(null);

  const currentZoom = zoom ?? internalZoom;
  const currentPanOffset = panOffset ?? internalPanOffset;
  const setCurrentZoom = onZoomChange ?? setInternalZoom;
  const setCurrentPanOffset = onPanOffsetChange ?? setInternalPanOffset;
  const effectiveMode = isSpacePressed ? 'hand' : interactionMode;

  // Handle file upload
  const handleFileUpload = useCallback(async (file) => {
    if (!file || (!file.type.startsWith('image/') && file.type !== 'application/pdf')) {
      setError('Kies een afbeelding of PDF-bestand.');
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
      const source = file.type === 'application/pdf'
        ? await renderFirstPdfPageToDataUrl(file)
        : file;
      const data = await loadImageData(source);
      onImageLoaded(data);
      setCurrentZoom(1);
      setCurrentPanOffset({ x: 0, y: 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [onImageLoaded, setCurrentPanOffset, setCurrentZoom]);

  // Handle paste from clipboard
  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        handleFileUpload(file);
        break;
      }
    }
  }, [handleFileUpload]);

  // Handle input change
  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Zoom in/out
  const handleZoom = (direction, focalPoint = null) => {
    const nextZoom = Math.max(
      MIN_ZOOM,
      Math.min(MAX_ZOOM, direction === 'in' ? currentZoom + ZOOM_STEP : currentZoom - ZOOM_STEP)
    );

    if (nextZoom === currentZoom) return;

    if (focalPoint && canvasContainerRef.current) {
      const rect = canvasContainerRef.current.getBoundingClientRect();
      const relativePoint = {
        x: focalPoint.clientX - rect.left - rect.width / 2,
        y: focalPoint.clientY - rect.top - rect.height / 2
      };
      const scaleRatio = nextZoom / currentZoom;

      setCurrentPanOffset({
        x: relativePoint.x - (relativePoint.x - currentPanOffset.x) * scaleRatio,
        y: relativePoint.y - (relativePoint.y - currentPanOffset.y) * scaleRatio
      });
    }

    setCurrentZoom(nextZoom);
  };

  const handleFitToView = () => {
    setCurrentZoom(1);
    setCurrentPanOffset({ x: 0, y: 0 });
  };

  // Pan (drag to move canvas)
  const handleMouseDown = useCallback((e) => {
    if (e.target?.closest?.('[data-floating-toolbar]')) return;
    if (e.button === 2) e.preventDefault();
    const shouldPan = effectiveMode === 'hand' ? e.button === 0 || e.button === 1 || e.button === 2 : e.button === 1 || e.button === 2;
    if (!shouldPan) return;

    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [effectiveMode]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !dragStart) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setCurrentPanOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [dragStart, isDragging, setCurrentPanOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  const handleToolbarMouseDown = (event) => {
    if (event.button !== 0 || !canvasContainerRef.current || !toolbarRef.current) return;

    event.preventDefault();
    event.stopPropagation();

    const containerRect = canvasContainerRef.current.getBoundingClientRect();
    const toolbarRect = toolbarRef.current.getBoundingClientRect();
    const currentPosition = {
      x: toolbarRect.left - containerRect.left,
      y: toolbarRect.top - containerRect.top
    };

    setToolbarPosition(currentPosition);
    setToolbarDrag({
      startMouse: { x: event.clientX, y: event.clientY },
      startPosition: currentPosition
    });
  };

  // Setup paste listener
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    container.addEventListener('paste', handlePaste);
    return () => container.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  // Setup mouse listeners for panning
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;
    const preventContextMenu = (event) => event.preventDefault();

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (!toolbarDrag) return;

    const handleMove = (event) => {
      if (!canvasContainerRef.current || !toolbarRef.current) return;

      const containerRect = canvasContainerRef.current.getBoundingClientRect();
      const toolbarRect = toolbarRef.current.getBoundingClientRect();
      const nextX = toolbarDrag.startPosition.x + event.clientX - toolbarDrag.startMouse.x;
      const nextY = toolbarDrag.startPosition.y + event.clientY - toolbarDrag.startMouse.y;

      setToolbarPosition({
        x: Math.max(8, Math.min(containerRect.width - toolbarRect.width - 8, nextX)),
        y: Math.max(8, Math.min(containerRect.height - toolbarRect.height - 8, nextY))
      });
    };

    const handleUp = () => setToolbarDrag(null);

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [toolbarDrag]);

  useEffect(() => {
    const isEditableTarget = (target) => {
      if (!(target instanceof HTMLElement)) return false;
      return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
    };

    const handleKeyDown = (event) => {
      if (!imageData || isEditableTarget(event.target)) return;

      if (event.key === ' ') {
        setIsSpacePressed(true);
        event.preventDefault();
      }
      if (event.key === '+' || event.key === '=') handleZoom('in');
      if (event.key === '-') handleZoom('out');
      if (event.key === '0') handleFitToView();
    };

    const handleKeyUp = (event) => {
      if (isEditableTarget(event.target)) return;

      if (event.key === ' ') {
        setIsSpacePressed(false);
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  const handleWheel = (event) => {
    if (!imageData) return;
    event.preventDefault();
    const direction = event.deltaY < 0 ? 'in' : 'out';
    handleZoom(direction, event);
  };

  // Reset
  const handleReset = () => {
    onImageLoaded(null);
    onSelectionsChanged([]);
    setCurrentZoom(1);
    setCurrentPanOffset({ x: 0, y: 0 });
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      ref={canvasContainerRef}
      className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden focus:outline-none"
      tabIndex={0}
      onPaste={handlePaste}
      onWheel={handleWheel}
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(90deg, #E8DCC3 1px, transparent 1px), linear-gradient(#E8DCC3 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Image container with zoom/pan */}
      {imageData ? (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            cursor: effectiveMode === 'hand' ? (isDragging ? 'grabbing' : 'grab') : 'crosshair'
          }}
        >
          <div
            style={{
              transform: `translate(${currentPanOffset.x}px, ${currentPanOffset.y}px) scale(${currentZoom})`,
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
              interactionMode={interactionMode}
              isTemporaryHandMode={isSpacePressed}
              activeSelectionId={activeSelectionId}
              onActiveSelectionChange={onActiveSelectionChange}
            />
          </div>
        </div>
      ) : (
        /* Empty state - upload prompt */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload bronmateriaal</h2>
            <p className="text-gray-600 mb-4">
              Selecteer een JPG, PNG, WebP of PDF. Plakken vanaf je klembord kan ook.
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            <Upload size={20} />
            {isLoading ? 'Laden...' : 'Upload bestand'}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Zoom controls */}
      {imageData && (
        <div
          ref={toolbarRef}
          data-floating-toolbar
          className="absolute flex items-center gap-2 rounded-lg bg-white p-2 shadow-lg"
          style={
            toolbarPosition.y === null
              ? { left: toolbarPosition.x, bottom: compact ? 16 : 24 }
              : { left: toolbarPosition.x, top: toolbarPosition.y }
          }
        >
          <button
            onMouseDown={handleToolbarMouseDown}
            className="cursor-grab rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:cursor-grabbing"
            title="Toolbar verplaatsen"
          >
            <GripVertical size={18} />
          </button>
          <button
            onClick={() => onInteractionModeChange?.('hand')}
            className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-bold transition-colors ${interactionMode === 'hand' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-gray-100'}`}
            title="Hand-tool: afbeelding verschuiven"
          >
            <Hand size={18} />
            {!compact && 'Hand'}
          </button>
          <button
            onClick={() => onInteractionModeChange?.('select')}
            className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-bold transition-colors ${interactionMode === 'select' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-gray-100'}`}
            title="Selectie-tool: crop tekenen"
          >
            <MousePointer2 size={18} />
            {!compact && 'Selectie'}
          </button>
          <div className="mx-1 h-7 w-px bg-slate-200" />
          <button
            onClick={() => handleZoom('out')}
            disabled={currentZoom <= MIN_ZOOM}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            title="Zoom uit (-)"
          >
            <ZoomOut size={20} />
          </button>
          <div className="px-3 py-2 text-sm font-medium text-gray-600 min-w-[60px] text-center">
            {Math.round(currentZoom * 100)}%
          </div>
          <button
            onClick={() => handleZoom('in')}
            disabled={currentZoom >= MAX_ZOOM}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            title="Zoom in (+)"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={handleFitToView}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Passend maken (0)"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      )}

      {imageData && showTopActions && (
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-gray-700 shadow-lg transition-colors hover:bg-gray-100"
            title="Nieuwe referentie uploaden"
          >
            <Upload size={18} />
            Nieuwe upload
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-white hover:bg-gray-100 rounded-lg shadow-lg transition-colors text-gray-700"
            title="Reset image and selections"
          >
            <Trash2 size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
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
