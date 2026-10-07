/**
 * Existing Crops Manager Component
 * View, preview, and delete crops already saved for a question
 */

import { useState, useEffect } from 'react';
import { Trash2, Loader, AlertCircle, FileText, Image } from 'lucide-react';
import { fetchQuestionMetadata } from '../../services/firestoreService';
import { HelixLaden } from '../merk/HelixLogo';

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
      <div className="flex items-center justify-center h-64 text-[var(--lo-grijs)]">
        <p>Selecteer eerst een vraag</p>
      </div>
    );
  }

  if (isLoading) {
    return <HelixLaden tekst="Crops laden..." className="min-h-0 py-10" />;
  }

  if (error) {
    return (
      <div className="p-4 space-y-4">
        <div className="lo-melding lo-melding--fout gap-3 p-4">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (crops.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--lo-grijs)]">
        <p>Geen crops opgeslagen voor deze vraag</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-[var(--lo-inkt)] px-4 pt-4">
        {crops.length} crop{crops.length !== 1 ? 's' : ''} opgeslagen
      </p>

      <div className="lo-lijst mx-4 max-h-96 overflow-y-auto">
        {crops.map(crop => (
          <div
            key={crop.cropId}
            className="p-3 flex gap-3 items-start"
          >
            {/* Thumbnail */}
            {crop.downloadURL && (
              <div className="flex-shrink-0 bg-[var(--lo-papier-2)] rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] overflow-hidden">
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
                <p className="text-sm font-bold text-[var(--lo-inkt)]">
                  Crop {crop.label || crop.order || '?'}
                </p>
                {crop.type && (
                  <span className="lo-label lo-label--blauw">
                    {crop.type === 'text' ? <FileText size={13} aria-hidden="true" /> : <Image size={13} aria-hidden="true" />}
                    {crop.type === 'text' ? 'Tekst' : 'Afbeelding'}
                  </span>
                )}
              </div>

              {crop.cropCoordinates && (
                <p className="lo-onderregel mt-1">
                  {crop.cropCoordinates.width} × {crop.cropCoordinates.height}px
                </p>
              )}

              {crop.uploadedAt && (
                <p className="lo-onderregel mt-1">
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
              className="flex-shrink-0 p-2 text-[var(--lo-rood-inkt)] hover:bg-[var(--lo-rood-zacht)] rounded-[var(--lo-hoek-m)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
