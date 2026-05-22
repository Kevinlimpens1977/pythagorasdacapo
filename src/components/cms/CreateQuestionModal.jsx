/**
 * CreateQuestionModal Component
 * Modal for creating a new vraag (question)
 */

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { auth } from '../../services/firebase';
import * as cmsService from '../../services/cmsService';

const getNextQuestionNumber = (vragen = []) => {
  if (!vragen.length) return '1';
  const maxNumber = Math.max(...vragen.map(v => v.number || 0));
  return (maxNumber + 1).toString();
};

export default function CreateQuestionModal({
  paragraafId,
  existingVragen = [],
  onQuestionCreated,
  onClose
}) {
  // Form state
  const [number, setNumber] = useState(() => getNextQuestionNumber(existingVragen));
  const [title, setTitle] = useState('');
  const [vraagtype, setVraagtype] = useState('open');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  // Create question
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!number.trim()) {
      setError('Vraag nummer is verplicht');
      return;
    }

    if (!title.trim()) {
      setError('Titel is verplicht');
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      setError('User ID not found. Please refresh and try again.');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      const vraagId = await cmsService.createVraag(
        paragraafId,
        {
          number: parseInt(number, 10),
          title: title.trim(),
          vraagtype,
          status: 'draft',
          content: {
            text: '<p></p>',
            images: []
          },
          vraagMetadata: {
            difficulty: 3,
            hints: [],
            showCalculator: false
          }
        },
        userId
      );

      console.log('✅ [CMS] Vraag created:', vraagId);
      onQuestionCreated?.(vraagId);
      onClose?.();
    } catch (err) {
      console.error('Error creating vraag:', err);
      setError(err.message || 'Er is een fout opgetreden');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--helix-navy)]/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-[var(--helix-border)] bg-white shadow-2xl">
        {/* Header */}
        <div className="helix-gradient flex items-center justify-between p-6 text-white">
          <h2 className="font-display text-xl font-extrabold">
            ➕ Nieuwe Vraag
          </h2>
          <button
            onClick={onClose}
            className="rounded-2xl p-2 transition-colors hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Number */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[var(--helix-navy)]">
              Vraag Nummer
            </label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="input-standard w-full"
              placeholder="1"
              min="1"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[var(--helix-navy)]">
              Titel
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-standard w-full"
              placeholder="Vraag titel"
              required
            />
          </div>

          {/* Vraagtype */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[var(--helix-navy)]">
              Vraagtype
            </label>
            <select
              value={vraagtype}
              onChange={(e) => setVraagtype(e.target.value)}
              className="input-standard w-full"
            >
              <option value="open">Open vraag</option>
              <option value="meerkeuze">Meerkeuze</option>
              <option value="numeriek">Numeriek</option>
              <option value="koppelen">Koppelen</option>
              <option value="invullen">Invullen</option>
              <option value="volgorde">Volgorde</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-[var(--helix-border)] bg-white px-4 py-2 font-extrabold text-[var(--helix-navy)] transition hover:bg-[var(--helix-bg)]"
            >
              Annuleer
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
            >
              <Plus size={18} />
              {isCreating ? 'Aanmaken...' : 'Aanmaken'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
