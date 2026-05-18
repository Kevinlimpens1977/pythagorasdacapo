/**
 * ColorEmojiPicker Component
 * Allows selection of pastel color + emoji for hierarchy items
 */

import React, { useState } from 'react';
import { PASTEL_COLORS, EMOJI_SET, getColorStyle } from '../../lib/paletColors';
import { X } from 'lucide-react';

export default function ColorEmojiPicker({ colorId, emoji, itemName, onChange, onClose }) {
  const [selectedColor, setSelectedColor] = useState(colorId || null);
  const [selectedEmoji, setSelectedEmoji] = useState(emoji || '');

  const handleColorSelect = (id) => {
    setSelectedColor(id);
  };

  const handleEmojiSelect = (e) => {
    setSelectedEmoji(e);
  };

  const handleSave = () => {
    onChange({ colorId: selectedColor, emoji: selectedEmoji });
    if (onClose) onClose();
  };

  const previewStyle = selectedColor ? getColorStyle(selectedColor) : getColorStyle(null);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-4 space-y-4 max-w-md w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Kleur & Emoji</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Color Palette */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-2">Kleur</label>
        <div className="grid grid-cols-6 gap-2">
          {PASTEL_COLORS.map(color => (
            <button
              key={color.id}
              onClick={() => handleColorSelect(color.id)}
              className={`w-10 h-10 rounded-lg border-2 transition-all ${
                selectedColor === color.id
                  ? 'border-slate-900 ring-2 ring-slate-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              style={{
                backgroundColor: color.bg,
                cursor: 'pointer'
              }}
              title={color.id}
            />
          ))}
        </div>
      </div>

      {/* Emoji Picker */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-2">Emoji</label>
        <div className="grid grid-cols-8 gap-1 max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-slate-50">
          {EMOJI_SET.map((e, idx) => (
            <button
              key={idx}
              onClick={() => handleEmojiSelect(e)}
              className={`text-lg h-8 w-8 rounded flex items-center justify-center transition-colors ${
                selectedEmoji === e
                  ? 'bg-slate-300 ring-2 ring-slate-400'
                  : 'hover:bg-slate-200'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
        <p className="text-xs text-slate-600 mb-2">Preview:</p>
        <div
          className="p-3 rounded-lg flex items-center gap-2"
          style={{
            backgroundColor: previewStyle.bg,
            color: previewStyle.text,
            borderColor: previewStyle.border,
          }}
        >
          {selectedEmoji && <span className="text-xl">{selectedEmoji}</span>}
          <span className="font-medium text-sm truncate">{itemName || 'Naam'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
        >
          Opslaan
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          >
            Annuleren
          </button>
        )}
      </div>
    </div>
  );
}
