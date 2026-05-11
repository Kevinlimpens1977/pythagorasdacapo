/**
 * Floating Crop Panel Component
 * Right-side panel with paragraph/question selection, crop preview, and save button
 * Includes tabs for creating new crops and managing existing crops
 */

import React, { useState } from 'react';
import { Save, Loader, ChevronDown } from 'lucide-react';
import ExistingCropsManager from './ExistingCropsManager';

const PARAGRAPHS = ['7.1', '7.3'];

export default function FloatingCropPanel({
  paragraphId,
  onParagraphChange,
  selectedQuestionId,
  onQuestionChange,
  availableQuestions,
  selections,
  onSelectionsChanged,
  onSave,
  isLoading,
  imageData,
  onDeleteCrop
}) {
  const [activeTab, setActiveTab] = useState('nieuw');
  const [existingCount, setExistingCount] = useState(0);
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-lg">
      {/* Header with tabs */}
      <div className="border-b border-gray-200">
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Crop Tool</h2>
          {/* Tab buttons */}
          <div className="flex rounded-lg bg-gray-100 p-1 gap-1">
            {['nieuw', 'beheer'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'nieuw' ? 'Nieuw' : `Beheer${existingCount > 0 ? ` (${existingCount})` : ''}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable content - tabs */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'nieuw' ? (
          // NEW CROPS TAB
          <div className="p-4 space-y-6">
            {/* Paragraph selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Paragraaf
              </label>
              <div className="relative">
                <select
                  value={paragraphId}
                  onChange={(e) => onParagraphChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                >
                  {PARAGRAPHS.map(para => (
                    <option key={para} value={para}>7.{para}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Question selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vraag
              </label>
              {availableQuestions.length === 0 ? (
                <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                  Geen vragen in deze paragraaf
                </p>
              ) : (
                <div className="relative">
                  <select
                    value={selectedQuestionId || ''}
                    onChange={(e) => onQuestionChange(e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                  >
                    <option value="">-- Selecteer een vraag --</option>
                    {availableQuestions.map(question => (
                      <option key={question.id} value={question.id}>
                        {question.heading}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                </div>
              )}
            </div>

            {/* Crop type selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Selectie type
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input type="radio" name="cropType" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-700">📷 Afbeelding</span>
                </label>
                <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input type="radio" name="cropType" className="w-4 h-4" />
                  <span className="text-sm text-gray-700">📝 Tekst (OCR-ready)</span>
                </label>
              </div>
            </div>

            {/* Selections preview */}
            {selections.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Geselecteerde rechthoeken ({selections.length})
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selections.map((sel, idx) => (
                    <div key={sel.id} className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-xs flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Rechthoek {idx + 1}</p>
                        <p className="text-gray-600">
                          {sel.cropCoordinates.width} × {sel.cropCoordinates.height}px
                        </p>
                        <p className="text-gray-600">
                          Type: {sel.type === 'text' ? '📝 Tekst' : '📷 Afbeelding'}
                        </p>
                      </div>
                      <button
                        onClick={() => onSelectionsChanged(selections.filter((_, i) => i !== idx))}
                        className="flex-shrink-0 text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors font-bold text-sm"
                        title="Rechthoek verwijderen"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image info */}
            {imageData && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                <p className="font-semibold">📊 Afbeelding geladen</p>
                <p className="text-xs text-blue-800 mt-1">
                  {imageData.width} × {imageData.height}px
                </p>
              </div>
            )}
          </div>
        ) : (
          // MANAGE CROPS TAB
          <ExistingCropsManager
            paragraphId={paragraphId}
            questionId={selectedQuestionId}
            onDeleteCrop={onDeleteCrop}
            onCountChange={setExistingCount}
          />
        )}
      </div>

      {/* Action buttons - only show on Nieuw tab */}
      {activeTab === 'nieuw' && (
        <div className="border-t border-gray-200 p-4 space-y-2">
          <button
            onClick={onSave}
            disabled={isLoading || !selectedQuestionId || selections.length === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" size={18} />
                Bezig...
              </>
            ) : (
              <>
                <Save size={18} />
                Opslaan crops
              </>
            )}
          </button>

          {selectedQuestionId && selections.length === 0 && (
            <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
              ⚠️ Teken minstens één rechthoek op de afbeelding
            </p>
          )}

          {!selectedQuestionId && (
            <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
              ⚠️ Selecteer eerst een vraag
            </p>
          )}
        </div>
      )}

      {/* Info footer - only show on Nieuw tab */}
      {activeTab === 'nieuw' && (
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 text-xs text-gray-600">
          <p className="font-semibold mb-1">💡 Tips:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Sleep om rechthoeken te tekenen</li>
            <li>Klik rechthoek om te selecteren</li>
            <li>Sleep hoek om te resizen</li>
            <li>Rood × voor verwijderen</li>
          </ul>
        </div>
      )}
    </div>
  );
}
