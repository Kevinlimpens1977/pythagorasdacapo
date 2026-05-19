/**
 * CropEditorPanel Component
 * Right-side panel for crop tool in dual-panel editor
 * Allows uploading images, drawing crop regions, and toggling crop type (image/text)
 */

import { useState } from 'react';
import { ImageIcon, Trash2, Type } from 'lucide-react';
import ImageCanvasEditor from '../admin/ImageCanvasEditor';

export default function CropEditorPanel({
  imageData,
  onImageLoaded,
  selections = [],
  onSelectionsChanged,
  onCropTypeChange
}) {
  const [hoveredSelectionId, setHoveredSelectionId] = useState(null);

  const handleDeleteSelection = (selectionId) => {
    const nextSelections = selections
      .filter((selection) => selection.id !== selectionId)
      .map((selection, index) => ({
        ...selection,
        label: `${index + 1}`
      }));

    onSelectionsChanged?.(nextSelections);
  };

  if (!imageData) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 border-l border-gray-200 p-6">
        <ImageCanvasEditor
          onImageLoaded={onImageLoaded}
          onSelectionsChanged={onSelectionsChanged}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 border-l border-gray-200 overflow-hidden">
      {/* Image Canvas - Main editing area */}
      <div className="flex-1 overflow-hidden bg-white">
        <ImageCanvasEditor
          onImageLoaded={onImageLoaded}
          onSelectionsChanged={onSelectionsChanged}
          imageData={imageData}
          selections={selections}
        />
      </div>

      {/* Crop Type Controls - Bottom panel */}
      {selections.length > 0 && (
        <div className="bg-white border-t border-gray-200 p-4 max-h-48 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Crop Type per Selectie
          </p>

          <div className="space-y-2">
            {selections.map((selection) => (
              <div
                key={selection.id}
                onMouseEnter={() => setHoveredSelectionId(selection.id)}
                onMouseLeave={() => setHoveredSelectionId(null)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${
                  hoveredSelectionId === selection.id
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {/* Selection label */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-4 h-4 rounded border-2 ${
                      selection.type === 'text'
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-green-100 border-green-500'
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Crop {selection.label}
                  </span>
                </div>

                {/* Type toggle buttons */}
                <div className="flex gap-1">
                  <button
                    onClick={() => onCropTypeChange?.(selection.id, 'image')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                      selection.type === 'image'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <ImageIcon size={14} />
                    Afb
                  </button>
                  <button
                    onClick={() => onCropTypeChange?.(selection.id, 'text')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                      selection.type === 'text'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Type size={14} />
                    OCR
                  </button>
                  <button
                    onClick={() => handleDeleteSelection(selection.id)}
                    className="flex items-center gap-1 rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                    title={`Crop ${selection.label} verwijderen`}
                  >
                    <Trash2 size={14} />
                    Wis
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-3">
            💡 <strong>Afb</strong> = sla crop op als afbeelding | <strong>OCR</strong> = extraheer tekst
          </p>
        </div>
      )}
    </div>
  );
}
