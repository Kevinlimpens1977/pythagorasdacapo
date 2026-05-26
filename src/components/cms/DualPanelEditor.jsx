/**
 * DualPanelEditor Component
 * Two-column layout: Question Editor (left) + Crop Tool (right)
 * Handles unified save of both crops and question content
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Save } from 'lucide-react';
import { auth } from '../../services/firebase';
import QuestionEditor from './QuestionEditor';
import CropEditorPanel from './CropEditorPanel';
import * as cmsService from '../../services/cmsService';
import * as cropService from '../../services/cropService';
import * as storageService from '../../services/storageService';
import * as firestoreService from '../../services/firestoreService';
import { extractTextViaOCR } from '../../lib/api';

export default function DualPanelEditor({
  vraag,
  paragraafCode,
  onSave,
  onCancel
}) {
  // Layout state
  const [leftWidthPct, setLeftWidthPct] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Editor references
  const editorRef = useRef(null);
  const questionEditorRef = useRef(null);
  const userId = auth.currentUser?.uid || null;

  // Crop state
  const [imageData, setImageData] = useState(null);
  const [selections, setSelections] = useState([]);

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Unsaved changes warning
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Handle drag divider
  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      // Clamp between 30% and 70%
      setLeftWidthPct(Math.max(30, Math.min(70, newLeftWidth)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Update crop type
  const handleCropTypeChange = useCallback((selectionId, newType) => {
    setSelections((prev) =>
      prev.map((sel) =>
        sel.id === selectionId ? { ...sel, type: newType } : sel
      )
    );
    setIsDirty(true);
  }, []);

  // Process crops only
  const handleProcessCrops = useCallback(async () => {
    if (!editorRef.current) {
      setError('Editor not initialized');
      return;
    }

    if (!userId) {
      setError('User not authenticated');
      return;
    }

    if (selections.length === 0 || !imageData) {
      setError('Geen crops geselecteerd');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      console.log('📦 [CMS] Extracting crops...');
      const cropResults = await cropService.batchCropRectangles(imageData.src, selections);

      console.log('📤 [CMS] Uploading crops to Storage...');
      const uploadPayload = cropResults.map((result, idx) => ({
        blob: result.blob,
        paragraphId: paragraafCode,
        questionId: vraag.id,
        order: idx,
        format: 'image/jpeg',
        cropId: `crop_${Date.now()}_${idx}`,
      }));

      const uploadResults = await storageService.batchUploadCrops(
        uploadPayload,
        (progress) => console.log('Upload progress:', progress)
      );

      console.log('💾 [CMS] Saving crop metadata to Firestore...');
      const cropsWithMetadata = uploadResults.map((upload, idx) => ({
        cropId: `crop_${Date.now()}_${idx}`,
        type: selections[idx].type,
        label: selections[idx].label,
        sourceImageId: `source_${Date.now()}`,
        storagePath: upload.storagePath,
        downloadURL: upload.downloadURL,
        cropCoordinates: selections[idx].cropCoordinates,
        originalImageSize: selections[idx].originalImageSize,
        order: idx,
        createdAt: new Date(),
        createdBy: userId,
      }));

      await firestoreService.saveCropMetadata(
        paragraafCode,
        vraag.id,
        cropsWithMetadata,
        userId
      );

      // Process all OCR requests in parallel (for speed), then insert in order
      const textCropIndices = cropsWithMetadata
        .map((crop, idx) => crop.type === 'text' ? idx : null)
        .filter(idx => idx !== null);

      const ocrResults = {};
      if (textCropIndices.length > 0) {
        console.log(`🚀 [CMS] Starting ${textCropIndices.length} OCR extractions in parallel...`);
        const ocrPromises = textCropIndices.map(idx =>
          extractTextViaOCR(cropResults[idx].blob)
            .then(text => {
              console.log(`✅ [CMS] OCR completed for crop ${idx + 1}`);
              return { idx, text, success: true };
            })
            .catch(err => {
              console.error(`❌ [CMS] OCR failed for crop ${idx + 1}:`, err);
              return { idx, text: null, success: false, error: err };
            })
        );

        const results = await Promise.all(ocrPromises);
        results.forEach(result => {
          ocrResults[result.idx] = result;
        });
      }

      // Get the actual editor from QuestionEditor component
      const editor = questionEditorRef.current?.editor;
      if (!editor) {
        throw new Error('Editor niet beschikbaar. Zorg dat de vraag-editor is geladen.');
      }

      // Insert crops into editor in order
      for (let idx = 0; idx < cropsWithMetadata.length; idx++) {
        const crop = cropsWithMetadata[idx];
        if (crop.type === 'image') {
          editor
            .chain()
            .focus()
            .insertContent({
              type: 'image',
              attrs: {
                src: crop.downloadURL,
                alt: crop.label,
              },
            })
            .run();
        } else if (crop.type === 'text') {
          if (ocrResults[idx]?.success) {
            // Insert extracted text as paragraph
            editor
              .chain()
              .focus()
              .insertContent(`<p><strong>[OCR: ${crop.label}]</strong></p><p>${ocrResults[idx].text}</p>`)
              .run();
          } else {
            editor
              .chain()
              .focus()
              .insertContent(`<p><strong>[OCR mislukt: ${crop.label}]</strong></p>`)
              .run();
          }
        }
      }

      console.log('✅ [CMS] Crops verwerkt en ingevoegd');
      setSelections([]);
      setIsDirty(false);
    } catch (err) {
      console.error('Error processing crops:', err);
      setError(err.message || 'Er is een fout opgetreden bij crop verwerking');
    } finally {
      setIsSaving(false);
    }
  }, [vraag, imageData, selections, userId, paragraafCode]);

  // Save question to Firebase
  const handleSaveQuestion = useCallback(async () => {
    if (!editorRef.current) {
      setError('Editor not initialized');
      return;
    }

    if (!userId) {
      setError('User not authenticated');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      console.log('💾 [CMS] Updating vraag content...');

      const formState = questionEditorRef.current?.getFormState?.() || {};
      const editor = questionEditorRef.current?.editor;
      if (!editor) {
        throw new Error('Editor niet beschikbaar voor opslaan');
      }

      await cmsService.updateVraag(vraag.id, {
        title: formState.title || vraag.title,
        vraagtype: formState.vraagtype || vraag.vraagtype,
        status: formState.status || vraag.status,
        content: {
          text: editor.getHTML(),
          images: vraag?.content?.images || [],
        },
        vraagMetadata: {
          difficulty: formState.difficulty || vraag.vraagMetadata?.difficulty || 3,
          hints: formState.hints || vraag.vraagMetadata?.hints || [],
          showCalculator: formState.showCalculator || vraag.vraagMetadata?.showCalculator || false,
          calculatorMode: 'standard',
          tokenConfig: formState.tokenConfig || vraag.vraagMetadata?.tokenConfig || null,
        },
        antwoord: formState.antwoord || vraag?.antwoord || { type: formState.vraagtype || vraag.vraagtype },
      });

      console.log('✅ [CMS] Vraag opgeslagen');
      setIsDirty(false);
      setSelections([]);
      setImageData(null);
      onSave?.(); // Close editor
    } catch (err) {
      console.error('Error saving question:', err);
      setError(err.message || 'Er is een fout opgetreden bij opslaan');
    } finally {
      setIsSaving(false);
    }
  }, [vraag, userId, onSave]);

  return (
    <div
      ref={containerRef}
      className="h-full flex flex-col bg-gray-50"
      style={{ cursor: isDragging ? 'col-resize' : 'default' }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          ✏️ Edit Vraag {vraag?.number}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Annuleer
          </button>

          {selections.length > 0 && (
            <button
              onClick={handleProcessCrops}
              disabled={isSaving}
              className="btn-primary px-6 py-2 disabled:opacity-50"
            >
              📐 {isSaving ? 'Verwerken...' : 'Crop Verwerken'}
            </button>
          )}

          <button
            onClick={handleSaveQuestion}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Save size={18} />
            {isSaving ? 'Opslaan...' : 'Opslaan'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 text-red-700">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Two-Panel Layout */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel - Question Editor */}
        <div style={{ width: `${leftWidthPct}%`, minWidth: '30%' }} className="overflow-hidden">
          <QuestionEditor
            ref={questionEditorRef}
            vraag={vraag}
            onEditorReady={(editor) => {
              editorRef.current = editor;
            }}
          />
        </div>

        {/* Resizable Divider */}
        <div
          onMouseDown={handleMouseDown}
          className="w-1 cursor-col-resize select-none bg-[var(--helix-border)] transition-colors hover:bg-[var(--helix-purple)]"
          style={{ flex: '0 0 auto' }}
        />

        {/* Right Panel - Crop Editor */}
        <div style={{ width: `${100 - leftWidthPct}%`, minWidth: '30%' }} className="overflow-hidden">
          <CropEditorPanel
            imageData={imageData}
            onImageLoaded={(data) => {
              setImageData(data);
              setSelections([]);
              setIsDirty(true);
            }}
            selections={selections}
            onSelectionsChanged={(newSelections) => {
              setSelections(newSelections);
              setIsDirty(true);
            }}
            onCropTypeChange={handleCropTypeChange}
            onProcessCrops={handleProcessCrops}
            processing={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
