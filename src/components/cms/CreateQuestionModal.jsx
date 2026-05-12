/**
 * CreateQuestionModal Component
 * Modal for creating a new vraag (question)
 */

import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { auth } from '../../services/firebase';
import * as cmsService from '../../services/cmsService';

export default function CreateQuestionModal({
  paragraafId,
  existingVragen = [],
  onQuestionCreated,
  onClose
}) {
  // Form state
  const [number, setNumber] = useState('');
  const [title, setTitle] = useState('');
  const [vraagtype, setVraagtype] = useState('open');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Get userId from Firebase
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
    }
  }, []);

  // Auto-suggest next question number
  useEffect(() => {
    if (existingVragen && existingVragen.length > 0) {
      const maxNumber = Math.max(...existingVragen.map(v => v.number || 0));
      setNumber((maxNumber + 1).toString());
    } else {
      setNumber('1');
    }
  }, [existingVragen]);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            ➕ Nieuwe Vraag
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vraag Nummer
            </label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1"
              min="1"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Titel
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Vraag titel"
              required
            />
          </div>

          {/* Vraagtype */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vraagtype
            </label>
            <select
              value={vraagtype}
              onChange={(e) => setVraagtype(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="open">Open vraag</option>
              <option value="meerkeuze">Meerkeuze</option>
              <option value="numeriek">Numeriek</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Annuleer
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
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
