/**
 * Floating Crop Panel Component
 * Right-side panel with paragraph/question selection, crop preview, and save button
 * Includes tabs for creating new crops and managing existing crops
 */

import { useState } from 'react';
import { Save, Loader, ChevronDown, FileText, Image, Lightbulb, TriangleAlert, X } from 'lucide-react';
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
    <div className="lo-kaart w-80 gap-0 rounded-none p-0">
      {/* Header with tabs */}
      <div className="border-b border-[var(--lo-lijn)]">
        <div className="p-4">
          <h2 className="lo-kaart-titel mb-3">Crop Tool</h2>
          {/* Tab buttons */}
          <div className="lo-keuzes">
            {['nieuw', 'beheer'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                aria-pressed={activeTab === tab}
                className="lo-keuze flex-1 justify-center capitalize"
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
              <label className="lo-veldlabel">
                Paragraaf
              </label>
              <div className="relative">
                <select
                  value={paragraphId}
                  onChange={(e) => onParagraphChange(e.target.value)}
                  className="lo-invoer appearance-none pr-8"
                >
                  {PARAGRAPHS.map(para => (
                    <option key={para} value={para}>7.{para}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--lo-grijs)] pointer-events-none" size={18} />
              </div>
            </div>

            {/* Question selector */}
            <div>
              <label className="lo-veldlabel">
                Vraag
              </label>
              {availableQuestions.length === 0 ? (
                <p className="lo-melding lo-melding--info">
                  Geen vragen in deze paragraaf
                </p>
              ) : (
                <div className="relative">
                  <select
                    value={selectedQuestionId || ''}
                    onChange={(e) => onQuestionChange(e.target.value || null)}
                    className="lo-invoer appearance-none pr-8"
                  >
                    <option value="">-- Selecteer een vraag --</option>
                    {availableQuestions.map(question => (
                      <option key={question.id} value={question.id}>
                        {question.heading}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--lo-grijs)] pointer-events-none" size={18} />
                </div>
              )}
            </div>

            {/* Crop type selector */}
            <div>
              <label className="lo-veldlabel">
                Selectie type
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2 hover:bg-[var(--lo-papier)] rounded-[var(--lo-hoek-m)] cursor-pointer">
                  <input type="radio" name="cropType" defaultChecked className="w-4 h-4" />
                  <span className="inline-flex items-center gap-1.5 text-sm text-[var(--lo-inkt)]"><Image size={15} aria-hidden="true" /> Afbeelding</span>
                </label>
                <label className="flex items-center gap-2 p-2 hover:bg-[var(--lo-papier)] rounded-[var(--lo-hoek-m)] cursor-pointer">
                  <input type="radio" name="cropType" className="w-4 h-4" />
                  <span className="inline-flex items-center gap-1.5 text-sm text-[var(--lo-inkt)]"><FileText size={15} aria-hidden="true" /> Tekst (OCR-ready)</span>
                </label>
              </div>
            </div>

            {/* Selections preview */}
            {selections.length > 0 && (
              <div>
                <label className="lo-veldlabel">
                  Geselecteerde rechthoeken ({selections.length})
                </label>
                <div className="lo-lijst max-h-48 overflow-y-auto">
                  {selections.map((sel, idx) => (
                    <div key={sel.id} className="p-2 text-xs flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-bold text-[var(--lo-inkt)]">Rechthoek {idx + 1}</p>
                        <p className="text-[var(--lo-grijs)]">
                          {sel.cropCoordinates.width} × {sel.cropCoordinates.height}px
                        </p>
                        <p className="inline-flex items-center gap-1 text-[var(--lo-grijs)]">
                          Type: {sel.type === 'text' ? <FileText size={13} aria-hidden="true" /> : <Image size={13} aria-hidden="true" />} {sel.type === 'text' ? 'Tekst' : 'Afbeelding'}
                        </p>
                      </div>
                      <button
                        onClick={() => onSelectionsChanged(selections.filter((_, i) => i !== idx))}
                        className="flex-shrink-0 text-[var(--lo-rood-inkt)] hover:bg-[var(--lo-rood-zacht)] p-1 rounded-[var(--lo-hoek-m)] transition-colors"
                        title="Rechthoek verwijderen"
                      >
                        <X size={16} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image info */}
            {imageData && (
              <div className="lo-melding lo-melding--info flex-col gap-0">
                <p className="font-bold text-[var(--lo-inkt)]">Afbeelding geladen</p>
                <p className="text-xs mt-1">
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
        <div className="border-t border-[var(--lo-lijn)] p-4 space-y-2">
          <button
            onClick={onSave}
            disabled={isLoading || !selectedQuestionId || selections.length === 0}
            className="lo-knop w-full justify-center"
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
            <p className="lo-melding lo-melding--info text-xs">
              <TriangleAlert size={15} className="shrink-0" aria-hidden="true" /> Teken minstens één rechthoek op de afbeelding
            </p>
          )}

          {!selectedQuestionId && (
            <p className="lo-melding lo-melding--info text-xs">
              <TriangleAlert size={15} className="shrink-0" aria-hidden="true" /> Selecteer eerst een vraag
            </p>
          )}
        </div>
      )}

      {/* Info footer - only show on Nieuw tab */}
      {activeTab === 'nieuw' && (
        <div className="bg-[var(--lo-papier)] border-t border-[var(--lo-lijn)] px-4 py-3 text-xs text-[var(--lo-grijs)]">
          <p className="mb-1 inline-flex items-center gap-1.5 font-bold"><Lightbulb size={14} aria-hidden="true" /> Tips:</p>
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
