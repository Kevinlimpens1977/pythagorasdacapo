/**
 * CreateContentModal - Unified Modal for All Content Levels
 * Creates: Vak, Leerjaar, Niveau, Hoofdstuk, Paragraaf
 */

import { useState } from 'react';
import { X, Loader } from 'lucide-react';
import * as cmsService from '../../services/cmsService';
import { auth } from '../../services/firebase';
import ColorEmojiPicker from './ColorEmojiPicker';
import HelixBrandBanner from '../common/HelixBrandBanner';

const showColorEmojiPicker = false;

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
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(null);
  const [emoji, setEmoji] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const inputClass = 'input-standard w-full';
  const labelClass = 'mb-2 block text-sm font-bold text-[var(--helix-navy)]';

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
        case 'vak': {
          newId = await cmsService.createVak(
            { name, description },
            auth.currentUser.uid
          );
          // Auto-aanmaak tussenlagen: elk nieuw vak krijgt direct één leerjaar
          // ("Leerjaar 1") met één niveau ("Standaard"). De navigatieboom toont
          // zo'n vak plat (vak › hoofdstuk › paragraaf), dus de docent kan
          // meteen een hoofdstuk toevoegen zonder vier lagen te klikken.
          // Meer leerjaren of niveaus toevoegen kan later altijd nog via de boom.
          const leerjaarId = await cmsService.createLeerjaar(
            newId,
            { year: 1, label: 'Leerjaar 1' },
            auth.currentUser.uid
          );
          await cmsService.createNiveau(
            leerjaarId,
            { label: 'Standaard', name: 'Standaard' },
            auth.currentUser.uid
          );
          break;
        }

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
            { title, description },
            auth.currentUser.uid
          );
          break;

        case 'paragraaf':
          newId = await cmsService.createParagraaf(
            parentId,
            { title, beschrijving: description },
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
      leerjaar: 'Nieuw leerjaar aanmaken',
      niveau: 'Nieuw niveau aanmaken',
      hoofdstuk: 'Nieuw hoofdstuk aanmaken',
      paragraaf: 'Nieuwe paragraaf aanmaken'
    };
    return titles[type] || 'Create New Content';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--helix-navy)]/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-[var(--helix-border)] bg-white shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative">
          <HelixBrandBanner
            variant="modal"
            className="rounded-none border-x-0 border-t-0 shadow-none"
            contentClassName="pr-12"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--helix-purple)]">HELIX CMS</p>
            <h2 className="mt-1 font-display text-xl font-extrabold leading-tight text-[var(--helix-navy)]">{getTitle()}</h2>
          </HelixBrandBanner>
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute right-4 top-4 rounded-2xl border border-[var(--helix-border)] bg-white/80 p-2 text-[var(--helix-navy)] shadow-sm transition hover:bg-[var(--helix-soft-lavender)] hover:text-[var(--helix-purple)] disabled:opacity-50"
            aria-label="Sluiten"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="border-b border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          {type === 'vak' && (
            <>
              <div>
                <label className={labelClass}>
                  Vak naam
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="bijv. Wiskunde"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Beschrijving (optioneel)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschrijving van het vak"
                  rows="3"
                  className={inputClass}
                />
              </div>
            </>
          )}

          {type === 'leerjaar' && (
            <>
              <div>
                <label className={labelClass}>
                  Leerjaar (Klas)
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className={inputClass}
                >
                  {[1, 2, 3, 4, 5, 6].map(y => (
                    <option key={y} value={y}>Jaar {y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Label (optioneel)
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="bijv. VMBO Jaar 1"
                  className={inputClass}
                />
              </div>
            </>
          )}

          {type === 'niveau' && (
            <>
              <div>
                <label className={labelClass}>
                  Label
                </label>
                <select
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Selecteer...</option>
                  <option value="VMBO">VMBO</option>
                  <option value="VMBO-B">VMBO-B (Basis)</option>
                  <option value="VMBO-K">VMBO-K (Kader)</option>
                  <option value="VMBO-GT">VMBO-GT (Gemengd)</option>
                  <option value="HAVO">HAVO</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Beschrijving (optioneel)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschrijving van het niveau"
                  rows="3"
                  className={inputClass}
                />
              </div>
            </>
          )}

          {type === 'hoofdstuk' && (
            <>
              <div>
                <label className={labelClass}>
                  Titel
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="bijv. H1 Introductie digitale geletterdheid"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Beschrijving (optioneel)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschrijving van het hoofdstuk"
                  rows="3"
                  className={inputClass}
                />
              </div>
            </>
          )}

          {type === 'paragraaf' && (
            <>
              <div>
                <label className={labelClass}>
                  Paragraafnaam
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="bijv. 1.1. Rechthoekige driehoeken"
                  required
                  className={inputClass}
                />
                <p className="mt-2 text-xs leading-5 text-[var(--helix-muted)]">
                  Zet nummering zoals 1.1 of 1.2 direct in de naam als je die wilt tonen.
                </p>
              </div>
              <div>
                <label className={labelClass}>
                  Beschrijving (optioneel)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschrijving van de paragraaf"
                  rows="2"
                  className={inputClass}
                />
              </div>
            </>
          )}

          {/* Color & Emoji Picker (for vak, leerjaar, niveau, hoofdstuk) */}
          {showColorEmojiPicker && ['vak', 'leerjaar', 'niveau', 'hoofdstuk'].includes(type) && (
            <div className="border-t border-[var(--helix-border)] pt-4">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="mb-2 rounded-xl px-2 py-1 text-sm font-bold text-[var(--helix-purple)] transition hover:bg-[var(--helix-lavender)] hover:text-[var(--helix-pink)]"
              >
                {showColorPicker ? '▼ Verberg kleur & emoji' : '▶ Kies kleur & emoji'}
              </button>
              {showColorPicker && (
                <div className="mt-3">
                  <ColorEmojiPicker
                    colorId={color}
                    emoji={emoji}
                    itemName={name || label || title || ''}
                    onChange={({ colorId, emoji: newEmoji }) => {
                      setColor(colorId);
                      setEmoji(newEmoji);
                    }}
                    onClose={() => setShowColorPicker(false)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-2xl border border-[var(--helix-border)] bg-white px-4 py-3 font-extrabold text-[var(--helix-navy)] transition hover:bg-[var(--helix-bg)] disabled:opacity-50"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 justify-center px-4 py-3 disabled:opacity-50"
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
