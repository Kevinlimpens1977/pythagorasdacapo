/**
 * Existing Crops Manager Component
 * View, preview, and delete crops already saved for a question
 */

import React, { useState, useEffect } from 'react';
import { Trash2, Loader, AlertCircle } from 'lucide-react';
import { fetchQuestionMetadata } from '../../services/firestoreService';

export default function ExistingCropsManager({
  paragraphId,
  questionId,
  onDeleteCrop,
  onCountChange
}) {
  const [crops, setCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  // Load crops when question changes
  useEffect(() => {
    if (!questionId) {
      setCrops([]);
      onCountChange?.(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchQuestionMetadata(paragraphId, questionId)
      .then(data => {
        const c = data?.crops || [];
        // Sort by order field
        const sorted = c.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCrops(sorted);
        onCountChange?.(sorted.length);
      })
      .catch(err => {
        console.error('Failed to load crops:', err);
        setError('Kon crops niet laden');
      })
      .finally(() => setIsLoading(false));
  }, [paragraphId, questionId, onCountChange]);

  const handleDelete = async (crop) => {
    if (!window.confirm(`Crop "${crop.label}" verwijderen?`)) return;

    setDeletingId(crop.cropId);
    try {
      await onDeleteCrop(crop);
      // Remove from local state
      const updated = crops.filter(c => c.cropId !== crop.cropId);
      setCrops(updated);
      onCountChange?.(updated.length);
      setError(null);
    } catch (err) {
      console.error('Delete error:', err);
      setError(`Verwijderen mislukt: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Render states
  if (!questionId) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Selecteer eerst een vraag</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader size={20} className="animate-spin text-blue-600" />
        <p className="text-gray-600">Crops laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (crops.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Geen crops opgeslagen voor deze vraag</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-gray-700 px-4 pt-4">
        {crops.length} crop{crops.length !== 1 ? 's' : ''} opgeslagen
      </p>

      <div className="space-y-3 px-4 max-h-96 overflow-y-auto">
        {crops.map(crop => (
          <div
            key={crop.cropId}
            className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex gap-3 items-start"
          >
            {/* Thumbnail */}
            {crop.downloadURL && (
              <div className="flex-shrink-0 bg-gray-100 rounded border border-gray-200 overflow-hidden">
                <img
                  src={crop.downloadURL}
                  alt={`Crop ${crop.label}`}
                  className="w-16 h-12 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="text-sm font-semibold text-gray-900">
                  Crop {crop.label || crop.order || '?'}
                </p>
                {crop.type && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {crop.type === 'text' ? '📝 Tekst' : '📷 Afbeelding'}
                  </span>
                )}
              </div>

              {crop.cropCoordinates && (
                <p className="text-xs text-gray-600 mt-1">
                  {crop.cropCoordinates.width} × {crop.cropCoordinates.height}px
                </p>
              )}

              {crop.uploadedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(crop.uploadedAt).toLocaleDateString('nl-NL', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>

            {/* Delete button */}
            <button
              onClick={() => handleDelete(crop)}
              disabled={deletingId === crop.cropId}
              className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Verwijderen"
            >
              {deletingId === crop.cropId ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
