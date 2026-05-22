/**
 * QuestionEditor Component
 * Edit vraag (question) content, metadata, and status
 * Uses TipTap for rich text editing
 */

import { useState, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2, Star } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';

const createVolgordeItem = (text = '') => ({
  id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  text
});

const QuestionEditorInner = forwardRef(function QuestionEditor(
  {
    vraag,
    onEditorReady
  },
  ref
) {
  // Form state
  const [title, setTitle] = useState(vraag?.title || '');
  const [vraagtype, setVraagtype] = useState(vraag?.vraagtype || 'open');
  const [status, setStatus] = useState(vraag?.status || 'draft');
  const [difficulty, setDifficulty] = useState(vraag?.vraagMetadata?.difficulty || 3);
  const [showCalculator, setShowCalculator] = useState(vraag?.vraagMetadata?.showCalculator || false);
  const [hints, setHints] = useState(vraag?.vraagMetadata?.hints || []);
  const [newHint, setNewHint] = useState('');
  const [error] = useState(null);

  // Antwoord state (per vraagtype)
  const [antwoordExpected, setAntwoordExpected] = useState(vraag?.antwoord?.expected || '');
  const [antwoordTolerance, setAntwoordTolerance] = useState(vraag?.antwoord?.tolerance || 0.5);
  const [antwoordUnit, setAntwoordUnit] = useState(vraag?.antwoord?.unit || '');
  const [antwoordHint, setAntwoordHint] = useState(vraag?.antwoord?.hintBijFout || '');
  const [koppelenPairs, setKoppelenPairs] = useState(() => (
    vraag?.antwoord?.type === 'koppelen' && Array.isArray(vraag?.antwoord?.pairs)
      ? vraag.antwoord.pairs
      : [{ left: '', right: '' }]
  ));
  const [invullenText, setInvullenText] = useState(() => (
    vraag?.antwoord?.type === 'invullen' ? vraag.antwoord.text || '' : ''
  ));
  const [invullenGaps, setInvullenGaps] = useState(() => (
    vraag?.antwoord?.type === 'invullen' && Array.isArray(vraag?.antwoord?.gaps)
      ? vraag.antwoord.gaps
      : []
  ));
  const [volgordeItems, setVolgordeItems] = useState(() => (
    vraag?.antwoord?.type === 'volgorde' && Array.isArray(vraag?.antwoord?.items)
      ? vraag.antwoord.items.map((item) => ({
          id: item.id || createVolgordeItem().id,
          text: item.text || ''
        }))
      : [createVolgordeItem()]
  ));

  // TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Typ je vraag hier... Je kunt tekst formatteren, lijsten maken, en meer.',
      }),
      Image.configure({
        allowBase64: true,
      }),
      Color,
      FontFamily,
    ],
    content: vraag?.content?.text || '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none p-3 border border-gray-300 rounded-md min-h-64 bg-white',
      },
    },
  });

  const getAntwoordState = useCallback(() => {
    if (vraagtype === 'numeriek') {
      return {
        type: 'numeriek',
        expected: parseFloat(antwoordExpected) || 0,
        tolerance: parseFloat(antwoordTolerance) || 0.5,
        unit: antwoordUnit,
        hintBijFout: antwoordHint
      };
    }

    if (vraagtype === 'koppelen') {
      return {
        type: 'koppelen',
        pairs: koppelenPairs.map((pair) => ({
          left: pair.left || '',
          right: pair.right || ''
        }))
      };
    }

    if (vraagtype === 'invullen') {
      return {
        type: 'invullen',
        text: invullenText,
        gaps: invullenGaps.map((gap, index) => ({
          id: gap.id || `gap-${index + 1}`,
          answer: gap.answer || ''
        }))
      };
    }

    if (vraagtype === 'volgorde') {
      return {
        type: 'volgorde',
        items: volgordeItems.map((item) => ({
          id: item.id,
          text: item.text || ''
        }))
      };
    }

    return { type: vraagtype };
  }, [
    vraagtype,
    antwoordExpected,
    antwoordTolerance,
    antwoordUnit,
    antwoordHint,
    koppelenPairs,
    invullenText,
    invullenGaps,
    volgordeItems
  ]);

  // Expose editor instance and form state to parent
  useImperativeHandle(
    ref,
    () => ({
      editor,
      getFormState: () => ({
        title,
        vraagtype,
        status,
        difficulty,
        showCalculator,
        hints,
        antwoord: getAntwoordState()
      }),
    }),
    [editor, title, vraagtype, status, difficulty, showCalculator, hints, getAntwoordState]
  );

  useEffect(() => {
    if (editor) onEditorReady?.(editor);
  }, [editor, onEditorReady]);

  useEffect(() => {
    const gapCount = (invullenText.match(/\[GAP\]/g) || []).length;

    setInvullenGaps((currentGaps) => {
      const nextGaps = Array.from({ length: gapCount }, (_, index) => {
        const existingGap = currentGaps[index];
        return {
          id: existingGap?.id || `gap-${index + 1}`,
          answer: existingGap?.answer || ''
        };
      });

      const isSame =
        nextGaps.length === currentGaps.length &&
        nextGaps.every((gap, index) =>
          gap.id === currentGaps[index]?.id && gap.answer === currentGaps[index]?.answer
        );

      return isSame ? currentGaps : nextGaps;
    });
  }, [invullenText]);

  // Add hint
  const handleAddHint = useCallback(() => {
    if (newHint.trim()) {
      setHints([...hints, newHint.trim()]);
      setNewHint('');
    }
  }, [hints, newHint]);

  // Remove hint
  const handleRemoveHint = useCallback((index) => {
    setHints(hints.filter((_, i) => i !== index));
  }, [hints]);

  const handleUpdatePair = useCallback((index, field, value) => {
    setKoppelenPairs((pairs) =>
      pairs.map((pair, pairIndex) =>
        pairIndex === index ? { ...pair, [field]: value } : pair
      )
    );
  }, []);

  const handleRemovePair = useCallback((index) => {
    setKoppelenPairs((pairs) => pairs.filter((_, pairIndex) => pairIndex !== index));
  }, []);

  const handleUpdateGap = useCallback((index, value) => {
    setInvullenGaps((gaps) =>
      gaps.map((gap, gapIndex) =>
        gapIndex === index ? { ...gap, answer: value } : gap
      )
    );
  }, []);

  const handleUpdateVolgordeItem = useCallback((index, value) => {
    setVolgordeItems((items) =>
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, text: value } : item
      )
    );
  }, []);

  const handleMoveVolgordeItem = useCallback((index, direction) => {
    setVolgordeItems((items) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= items.length) return items;

      const nextItems = [...items];
      const currentItem = nextItems[index];
      nextItems[index] = nextItems[targetIndex];
      nextItems[targetIndex] = currentItem;
      return nextItems;
    });
  }, []);

  const handleRemoveVolgordeItem = useCallback((index) => {
    setVolgordeItems((items) => items.filter((_, itemIndex) => itemIndex !== index));
  }, []);

  if (!editor) {
    return <div className="p-4 text-gray-500">Loading editor...</div>;
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Titel
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-standard w-full"
          placeholder="Vraag titel"
        />
      </div>

      {/* Row: Vraagtype, Status */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-standard w-full"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Vraag Content
        </label>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex gap-1 flex-wrap items-center">
            {/* Text Formatting */}
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
                editor.isActive('bold')
                  ? 'helix-gradient text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              title="Vet (Ctrl+B)"
            >
              B
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={`px-3 py-1 rounded text-sm italic transition-colors ${
                editor.isActive('italic')
                  ? 'helix-gradient text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              title="Cursief (Ctrl+I)"
            >
              I
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
              className={`px-3 py-1 rounded text-sm underline transition-colors ${
                editor.isActive('underline')
                  ? 'helix-gradient text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              title="Onderstreept (Ctrl+U)"
            >
              U
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Font Family */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  editor.chain().focus().setFontFamily(e.target.value).run();
                  e.target.value = '';
                }
              }}
              className="px-2 py-1 rounded text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
              title="Lettertype"
              defaultValue=""
            >
              <option value="">Lettertype</option>
              <option value="serif">Serif</option>
              <option value="sans-serif">Sans-serif</option>
              <option value="monospace">Monospace</option>
            </select>

            {/* Text Color */}
            <div className="flex items-center gap-1">
              <label className="text-xs font-medium text-gray-600">Kleur:</label>
              <input
                type="color"
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                title="Tekstkleur"
              />
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Lists */}
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                editor.isActive('bulletList')
                  ? 'helix-gradient text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              title="Opsomming"
            >
              •
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                editor.isActive('orderedList')
                  ? 'helix-gradient text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              title="Genummerde lijst"
            >
              1.
            </button>
          </div>
          {/* Editor */}
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Moeilijkheid
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`p-2 rounded-lg transition-all ${
                difficulty >= level
                  ? 'bg-yellow-400 text-yellow-900'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              <Star size={20} fill={difficulty >= level ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
      </div>

      {/* Calculator Toggle */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showCalculator}
            onChange={(e) => setShowCalculator(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--helix-border)] text-[var(--helix-purple)] focus:ring-fuchsia-100"
          />
          <span className="text-sm font-medium text-gray-700">
            Rekenmachine beschikbaar
          </span>
        </label>
      </div>

      {/* Hints */}
      <div className="mb-8 pb-8 border-b border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Hints
        </label>

        {/* Hint List */}
        {hints.length > 0 && (
          <div className="mb-4 space-y-2">
            {hints.map((hint, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl border border-fuchsia-100 bg-[var(--helix-soft-lavender)] p-3"
              >
                <span className="text-sm text-gray-700">{hint}</span>
                <button
                  onClick={() => handleRemoveHint(idx)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Hint */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newHint}
            onChange={(e) => setNewHint(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddHint()}
            className="input-standard flex-1"
            placeholder="Voeg een hint toe..."
          />
          <button
            onClick={handleAddHint}
            className="btn-primary px-4 py-2 text-sm"
          >
            <Plus size={18} />
            Toevoegen
          </button>
        </div>
      </div>

      {/* Antwoord Section (per vraagtype) */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          ✅ Antwoord
        </label>

        {vraagtype === 'numeriek' ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Definieer het verwachte antwoord. Studenten krijgen directe feedback.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Verwacht getal
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={antwoordExpected}
                  onChange={(e) => setAntwoordExpected(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="bijv. 42"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Tolerantie (±)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={antwoordTolerance}
                  onChange={(e) => setAntwoordTolerance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="bijv. 0.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Eenheid (optioneel)
              </label>
              <input
                type="text"
                value={antwoordUnit}
                onChange={(e) => setAntwoordUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="bijv. cm, m, kg, etc."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Hint bij fout (optioneel)
              </label>
              <input
                type="text"
                value={antwoordHint}
                onChange={(e) => setAntwoordHint(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="bijv. Gebruik de formule a² + b² = c²"
              />
            </div>
          </div>
        ) : vraagtype === 'open' ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              📝 <strong>Open vraag</strong> – Leerling typt vrij antwoord. Geen automatische controle. Docent beoordeelt.
            </p>
          </div>
        ) : vraagtype === 'meerkeuze' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              🎯 <strong>Meerkeuze</strong> – Antwoord-schema wordt later uitgebouwd.
            </p>
          </div>
        ) : vraagtype === 'koppelen' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
            <p className="text-sm text-gray-600">
              Maak koppelparen. De linker- en rechterkant vormen samen het correcte antwoord.
            </p>

            <div className="space-y-3">
              {koppelenPairs.map((pair, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Links
                    </label>
                    <input
                      type="text"
                      value={pair.left}
                      onChange={(e) => handleUpdatePair(index, 'left', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Begrip"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Rechts
                    </label>
                    <input
                      type="text"
                      value={pair.right}
                      onChange={(e) => handleUpdatePair(index, 'right', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Omschrijving"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemovePair(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Verwijder paar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setKoppelenPairs((pairs) => [...pairs, { left: '', right: '' }])}
              className="btn-primary px-4 py-2 text-sm"
            >
              <Plus size={18} />
              Voeg paar toe
            </button>
          </div>
        ) : vraagtype === 'invullen' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Typ de volledige tekst en plaats <strong>[GAP]</strong> waar een invulvak moet komen.
              </p>
              <textarea
                value={invullenText}
                onChange={(e) => setInvullenText(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Bijvoorbeeld: Fotosynthese gebeurt in de [GAP] van een plant."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-gray-700">
                  Gaps gevonden: {invullenGaps.length}
                </p>
                {invullenGaps.length === 0 && (
                  <p className="text-xs text-gray-500">Voeg [GAP] toe in de tekst om antwoordvelden te maken.</p>
                )}
              </div>

              {invullenGaps.map((gap, index) => (
                <div key={gap.id} className="grid grid-cols-[7rem_1fr] gap-3 items-center">
                  <label className="text-xs font-semibold text-gray-700">
                    Gap {index + 1}
                  </label>
                  <input
                    type="text"
                    value={gap.answer}
                    onChange={(e) => handleUpdateGap(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Correct antwoord"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : vraagtype === 'volgorde' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
            <p className="text-sm text-gray-600">
              Zet de items in de correcte volgorde. Deze volgorde wordt opgeslagen als antwoordmodel.
            </p>

            <div className="space-y-3">
              {volgordeItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-2 items-center">
                  <span className="text-xs font-bold text-gray-500 w-6 text-right">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => handleUpdateVolgordeItem(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Item"
                  />
                  <button
                    type="button"
                    onClick={() => handleMoveVolgordeItem(index, -1)}
                    disabled={index === 0}
                    className="p-2 text-gray-600 hover:bg-white rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Omhoog"
                  >
                    <ArrowUp size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveVolgordeItem(index, 1)}
                    disabled={index === volgordeItems.length - 1}
                    className="p-2 text-gray-600 hover:bg-white rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Omlaag"
                  >
                    <ArrowDown size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveVolgordeItem(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Verwijder item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setVolgordeItems((items) => [...items, createVolgordeItem()])}
              className="btn-primary px-4 py-2 text-sm"
            >
              <Plus size={18} />
              Voeg item toe
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
});

export default QuestionEditorInner;
