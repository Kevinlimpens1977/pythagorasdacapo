/**
 * CropEditorPanel Component
 * Right-side panel for crop/OCR source material.
 */

import { useState } from 'react';
import { ImageIcon, Maximize2, Scissors, Trash2, Type, X } from 'lucide-react';
import ImageCanvasEditor from '../admin/ImageCanvasEditor';

export default function CropEditorPanel({
  imageData,
  onImageLoaded,
  selections = [],
  onSelectionsChanged,
  onCropTypeChange,
  onProcessCrops,
  processing = false
}) {
  const [hoveredSelectionId, setHoveredSelectionId] = useState(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [interactionMode, setInteractionMode] = useState('select');
  const [fullscreenInteractionMode, setFullscreenInteractionMode] = useState('hand');
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const handleDeleteSelection = (selectionId) => {
    const nextSelections = selections
      .filter((selection) => selection.id !== selectionId)
      .map((selection, index) => ({
        ...selection,
        label: `${index + 1}`
      }));

    onSelectionsChanged?.(nextSelections);
  };

  const openFullscreen = () => {
    setFullscreenInteractionMode('hand');
    setIsFullscreenOpen(true);
  };

  const renderSelectionList = (dense = false) => (
    <div className="space-y-2">
      {selections.map((selection) => (
        <div
          key={selection.id}
          onMouseEnter={() => setHoveredSelectionId(selection.id)}
          onMouseLeave={() => setHoveredSelectionId(null)}
          className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-colors ${
            hoveredSelectionId === selection.id
              ? 'border-gray-300 bg-gray-50'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={`inline-block h-4 w-4 shrink-0 rounded border-2 ${
                selection.type === 'text'
                  ? 'border-blue-500 bg-blue-100'
                  : 'border-green-500 bg-green-100'
              }`}
            />
            <span className="truncate text-sm font-medium text-gray-700">
              Crop {selection.label}
            </span>
          </div>

          <div className="flex shrink-0 gap-1">
            <button
              onClick={() => onCropTypeChange?.(selection.id, 'image')}
              className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                selection.type === 'image'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ImageIcon size={14} />
              {!dense && 'Afb'}
            </button>
            <button
              onClick={() => onCropTypeChange?.(selection.id, 'text')}
              className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                selection.type === 'text'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Type size={14} />
              {!dense && 'OCR'}
            </button>
            <button
              onClick={() => handleDeleteSelection(selection.id)}
              className="flex items-center gap-1 rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
              title={`Crop ${selection.label} verwijderen`}
            >
              <Trash2 size={14} />
              {!dense && 'Wis'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCanvas = (fullscreen = false) => (
    <ImageCanvasEditor
      onImageLoaded={onImageLoaded}
      onSelectionsChanged={onSelectionsChanged}
      imageData={imageData}
      selections={selections}
      interactionMode={fullscreen ? fullscreenInteractionMode : interactionMode}
      onInteractionModeChange={fullscreen ? setFullscreenInteractionMode : setInteractionMode}
      zoom={zoom}
      onZoomChange={setZoom}
      panOffset={panOffset}
      onPanOffsetChange={setPanOffset}
      compact={!fullscreen}
      showTopActions
    />
  );

  if (!imageData) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 border-l border-gray-200 p-6">
        {renderCanvas()}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 border-l border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Broncanvas</p>
          <p className="text-sm font-bold text-slate-700">Gebruik groot beeld voor precieze A4-crops.</p>
        </div>
        <button
          onClick={openFullscreen}
          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100"
        >
          <Maximize2 size={16} />
          Open groot
        </button>
      </div>

      <div className="flex-1 overflow-hidden bg-white">
        {renderCanvas()}
      </div>

      {selections.length > 0 && (
        <div className="max-h-48 overflow-y-auto border-t border-gray-200 bg-white p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
            Crop type per selectie
          </p>
          {renderSelectionList()}
          <p className="mt-3 text-xs text-gray-500">
            <strong>Afb</strong> = sla crop op als afbeelding | <strong>OCR</strong> = extraheer tekst
          </p>
        </div>
      )}

      {isFullscreenOpen && (
        <div className="fixed inset-0 z-[1000] flex flex-col bg-slate-950">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-950 px-5 py-3 text-white">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">Crop/OCR studio</p>
              <h2 className="text-lg font-black">Bronmateriaal groot bewerken</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onProcessCrops}
                disabled={processing || selections.length === 0 || !onProcessCrops}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Scissors size={16} />
                {processing ? 'Verwerken...' : 'Crops verwerken'}
              </button>
              <button
                onClick={() => setIsFullscreenOpen(false)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-bold text-slate-100 transition-colors hover:bg-slate-900"
              >
                <X size={16} />
                Sluit
              </button>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_22rem]">
            <div className="min-w-0">
              {renderCanvas(true)}
            </div>
            <aside className="flex min-h-0 flex-col border-l border-slate-800 bg-white">
              <div className="border-b border-slate-200 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Selecties</p>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  Start in Hand-modus om te schuiven. Kies Selectie om crops te tekenen. Spatie ingedrukt is tijdelijk Hand.
                </p>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                {selections.length > 0 ? (
                  renderSelectionList()
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                    Nog geen crops. Schakel naar Selectie en sleep over de afbeelding.
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
