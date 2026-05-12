/**
 * CreateContentModal - Unified Modal for All Content Levels
 * Creates: Vak, Leerjaar, Niveau, Hoofdstuk, Paragraaf
 */

import React, { useState } from 'react';
import { X, Loader } from 'lucide-react';
import * as cmsService from '../../services/cmsService';
import { auth } from '../../services/firebase';

export default function CreateContentModal({
  type, // 'vak' | 'leerjaar' | 'niveau' | 'hoofdstuk' | 'paragraaf'
  parentId, // parent ID for leerjaar, niveau, etc.
  onCreated, // callback with (newId, type)
  onClose
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState(1);
  const [label, setLabel] = useState('');
  const [number, setNumber] = useState('');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!auth.currentUser?.uid) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let newId;

      switch (type) {
        case 'vak':
          newId = await cmsService.createVak(
            { name, description },
            auth.currentUser.uid
          );
          break;

        case 'leerjaar':
          newId = await cmsService.createLeerjaar(
            parentId,
            { year: parseInt(year), label: label || `Jaar ${year}` },
            auth.currentUser.uid
          );
          break;

        case 'niveau':
          newId = await cmsService.createNiveau(
            parentId,
            { label, name: label, description },
            auth.currentUser.uid
          );
          break;

        case 'hoofdstuk':
          newId = await cmsService.createHoofdstuk(
            parentId,
            { number: parseInt(number), title, description },
            auth.currentUser.uid
          );
          break;

        case 'paragraaf':
          newId = await cmsService.createParagraaf(
            parentId,
            { code, title, beschrijving: description },
            auth.currentUser.uid
          );
          break;

        default:
          throw new Error('Unknown type');
      }

      onCreated?.(newId, type);
      onClose();
    } catch (err) {
      console.error('Error creating content:', err);
      setError(err.message || 'Error creating content');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    const titles = {
      vak: 'Nieuw vak aanmaken',
      leerjaar: 'Nieuw schooljaar aanmaken',
      niveau: 'Nieuw niveau aanmaken',
      hoofdstuk: 'Nieuw hoofdstuk aanmaken',
      paragraaf: 'Nieuwe paragraaf aanmaken'
    };
    return titles[type] || 'Create New Content';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">{getTitle()}</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          {type === 'vak' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vak naam
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="bijv. Wiskunde"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschrijving (optioneel)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschrijving van het vak"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {type === 'leerjaar' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schooljaar
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6].map(y => (
                    <option key={y} value={y}>Jaar {y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label (optioneel)
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="bijv. Eerste Jaar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {type === 'niveau' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label
                </label>
                <select
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecteer...</option>
                  <option value="VMBO-B">VMBO-B (Basis)</option>
                  <option value="VMBO-K">VMBO-K (Kader)</option>
                  <option value="VMBO-GT">VMBO-GT (Gemengd)</option>
                  <option value="HAVO">HAVO</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschrijving (optioneel)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschrijving van het niveau"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {type === 'hoofdstuk' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nummer
                  </label>
                  <input
                    type="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="bijv. 7"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titel
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="bijv. Stelling van Pythagoras"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschrijving (optioneel)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschrijving van het hoofdstuk"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {type === 'paragraaf' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="bijv. 7.1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titel
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="bijv. Rechthoekige driehoeken"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschrijving (optioneel)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschrijving van de paragraaf"
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              {loading ? 'Aanmaken...' : 'Aanmaken'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
