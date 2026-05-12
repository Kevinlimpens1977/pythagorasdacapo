/**
 * Admin Crop Tool - Main Page
 * Manages image upload, rectangle selection, and crop metadata saving
 */

import React, { useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../components/auth/AuthProvider';
import ImageCanvasEditor from '../components/admin/ImageCanvasEditor';
import FloatingCropPanel from '../components/admin/FloatingCropPanel';

// DEPRECATED: This page previously used hardcoded slide data
// Now all crop management is done via the CMS (DualPanelEditor with integrated crop tool)
// Legacy paragraph data imports removed
const PARAGRAPH_DATA = {
  // Crop tool now integrated into CMS DualPanelEditor
  // Use Admin → CMS → select paragraaf → create vraag → use built-in crop tool
};

export default function AdminCropToolPage() {
  const { currentUser } = useAuth();

  // UI State
  const [selectedParagraphId, setSelectedParagraphId] = useState('7.3');
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [selections, setSelections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Get available questions for selected paragraph
  const availableQuestions = PARAGRAPH_DATA[selectedParagraphId]?.filter(
    slide => ['exercise', 'evaluation'].includes(slide.type)
  ) || [];

  // Handle image loaded from canvas
  const handleImageLoaded = useCallback((newImageData) => {
    setImageData(newImageData);
    setNotification({
      type: 'success',
      message: `Image loaded: ${newImageData.width}×${newImageData.height}px`
    });
  }, []);

  // Handle selections updated from canvas
  const handleSelectionsChanged = useCallback((newSelections) => {
    setSelections(newSelections);
  }, []);

  // Handle save crops with retry logic and detailed error reporting
  const handleSaveCrops = useCallback(async () => {
    if (!selectedQuestionId) {
      setNotification({
        type: 'error',
        message: 'Selecteer eerst een vraag'
      });
      return;
    }

    if (selections.length === 0) {
      setNotification({
        type: 'error',
        message: 'Teken minstens één rechthoek'
      });
      return;
    }

    if (!imageData) {
      setNotification({
        type: 'error',
        message: 'Geen afbeelding geladen'
      });
      return;
    }

    if (!currentUser?.uid) {
      setNotification({
        type: 'error',
        message: 'Niet geverifieerd'
      });
      return;
    }

    setIsLoading(true);
    setNotification({
      type: 'loading',
      message: '⏳ Stap 1/3: Crops uitsnijden...'
    });

    try {
      const { batchCropRectangles, validateAndClipCoordinates } = await import('../services/cropService');
      const { batchUploadCrops } = await import('../services/storageService');
      const { saveCropMetadata } = await import('../services/firestoreService');

      // Step 1: Validate and extract crops
      let cropResults;
      try {
        // Validate coordinates before extraction
        const validSelections = selections.map(sel =>
          validateAndClipCoordinates(sel.cropCoordinates, imageData.width, imageData.height)
            ? sel
            : null
        ).filter(Boolean);

        if (validSelections.length !== selections.length) {
          console.warn(`${selections.length - validSelections.length} selections had invalid coordinates`);
        }

        cropResults = await batchCropRectangles(
          imageData.src,
          validSelections,
          'image/jpeg',
          0.85
        );
      } catch (error) {
        throw new Error(`Crop extraction failed: ${error.message}`);
      }

      const failedCrops = cropResults.filter(r => r.status === 'error');
      if (failedCrops.length === cropResults.length) {
        throw new Error(`Could not extract any crops from image`);
      }

      if (failedCrops.length > 0) {
        console.warn(`Failed to extract ${failedCrops.length}/${cropResults.length} crops:`, failedCrops);
      }

      // Step 2: Upload to Firebase Storage with progress
      setNotification({
        type: 'loading',
        message: '⏳ Stap 2/3: Uploading naar Firebase (0%)'
      });

      const uploadPayload = cropResults
        .filter(r => r.status === 'success')
        .map((result, idx) => ({
          cropId: result.cropId,
          blob: result.blob,
          paragraphId: selectedParagraphId,
          questionId: selectedQuestionId,
          order: idx + 1,
          format: 'image/jpeg'
        }));

      if (uploadPayload.length === 0) {
        throw new Error('No valid crops to upload');
      }

      let uploadedCount = 0;
      const uploadResults = await batchUploadCrops(uploadPayload, (current, total, cropId, status, errorMsg) => {
        if (status === 'success') {
          uploadedCount++;
          const percent = Math.round((uploadedCount / total) * 100);
          setNotification({
            type: 'loading',
            message: `⏳ Stap 2/3: Uploading (${percent}%) - Crop ${current}/${total}`
          });
        } else if (status === 'error') {
          console.error(`Upload failed for crop ${cropId}:`, errorMsg);
        }
      });

      const failedUploads = uploadResults.filter(r => r.status === 'error');
      if (failedUploads.length === uploadResults.length) {
        throw new Error(`All uploads failed:\n${failedUploads.map(f => `- ${f.cropId}: ${f.error}`).join('\n')}`);
      }

      if (failedUploads.length > 0) {
        setNotification({
          type: 'error',
          message: `⚠️ ${failedUploads.length} crop(s) failed to upload, but continuing...`
        });
        // Continue with successful uploads
      }

      // Step 3: Save metadata to Firestore
      setNotification({
        type: 'loading',
        message: '⏳ Stap 3/3: Opslaan in database...'
      });

      const successfulUploads = uploadResults.filter(r => r.status === 'success');
      const cropsWithMetadata = successfulUploads.map((upload, idx) => ({
        cropId: upload.cropId,
        type: 'image',
        label: `${idx + 1}`,
        sourceImageId: `image_${Date.now()}`,
        storagePath: upload.storagePath,
        downloadURL: upload.downloadURL,
        order: upload.index + 1,
        uploadedAt: upload.uploadedAt,
        uploadedBy: currentUser.email
      }));

      try {
        await saveCropMetadata(
          selectedParagraphId,
          selectedQuestionId,
          cropsWithMetadata,
          currentUser.uid
        );
      } catch (error) {
        throw new Error(`Database save failed: ${error.message}`);
      }

      // Success
      const successCount = successfulUploads.length;
      setNotification({
        type: 'success',
        message: `✅ ${successCount} crop(s) opgeslagen!`
      });

      // Reset after delay
      setTimeout(() => {
        setSelections([]);
      }, 2000);
    } catch (error) {
      console.error('Save crops error:', error);

      // Format error message for display
      const errorMsg = error.message.includes('\n')
        ? error.message
        : `Failed to save crops: ${error.message}`;

      setNotification({
        type: 'error',
        message: errorMsg
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedQuestionId, selectedParagraphId, selections, imageData, currentUser]);

  // Dismiss notification
  const dismissNotification = () => {
    setNotification(null);
  };

  // Handle delete crop (used by ExistingCropsManager)
  const handleDeleteCrop = useCallback(async (crop) => {
    try {
      const { deleteCropFromQuestion } = await import('../services/firestoreService');
      const { deleteCropFromStorage } = await import('../services/storageService');

      // Delete from Firestore
      await deleteCropFromQuestion(selectedParagraphId, selectedQuestionId, crop);

      // Clean up Storage (non-blocking, warns on failure)
      if (crop.storagePath) {
        await deleteCropFromStorage(crop.storagePath);
      }

      setNotification({
        type: 'success',
        message: `🗑️ Crop "${crop.label}" verwijderd`
      });
    } catch (error) {
      console.error('Delete crop error:', error);
      throw error;
    }
  }, [selectedParagraphId, selectedQuestionId]);

  return (
    <div className="flex h-screen bg-white">
      {/* Main canvas area */}
      <div className="flex-1 overflow-hidden">
        <ImageCanvasEditor
          onImageLoaded={handleImageLoaded}
          onSelectionsChanged={handleSelectionsChanged}
          selections={selections}
          imageData={imageData}
        />
      </div>

      {/* Floating panel */}
      <FloatingCropPanel
        paragraphId={selectedParagraphId}
        onParagraphChange={setSelectedParagraphId}
        selectedQuestionId={selectedQuestionId}
        onQuestionChange={setSelectedQuestionId}
        availableQuestions={availableQuestions}
        selections={selections}
        onSelectionsChanged={setSelections}
        onSave={handleSaveCrops}
        isLoading={isLoading}
        imageData={imageData}
        onDeleteCrop={handleDeleteCrop}
      />

      {/* Notification toast */}
      {notification && (
        <div className={`fixed bottom-6 left-6 p-4 rounded-lg shadow-lg flex gap-3 max-w-md animate-in fade-in slide-in-from-bottom-4 ${
          notification.type === 'error'
            ? 'bg-red-50 text-red-900'
            : notification.type === 'success'
            ? 'bg-emerald-50 text-emerald-900'
            : 'bg-blue-50 text-blue-900'
        }`}>
          <div className="flex-shrink-0 mt-1">
            {notification.type === 'error' && <AlertCircle size={20} />}
            {notification.type === 'success' && <CheckCircle size={20} />}
            {notification.type === 'loading' && <Loader size={20} className="animate-spin" />}
          </div>
          <div className="flex-1 whitespace-pre-wrap text-sm">{notification.message}</div>
          <button
            onClick={dismissNotification}
            className="text-current opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-gray-100 p-2 rounded text-xs text-gray-600 max-w-xs">
          <p>User: {currentUser?.email}</p>
          <p>Para: {selectedParagraphId}</p>
          <p>Question: {selectedQuestionId || 'none'}</p>
          <p>Selections: {selections.length}</p>
          <p>Image: {imageData ? `${imageData.width}×${imageData.height}` : 'none'}</p>
        </div>
      )}
    </div>
  );
}
