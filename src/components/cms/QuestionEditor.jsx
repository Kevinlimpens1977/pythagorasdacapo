/**
 * QuestionEditor Component
 * Edit vraag (question) content, metadata, and status
 * Uses TipTap for rich text editing
 */

import React, { useState, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { auth } from '../../services/firebase';
import * as cmsService from '../../services/cmsService';

const QuestionEditorInner = forwardRef(function QuestionEditor(
  {
    vraag,
    onEditorReady,
    userId: providedUserId
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
  const [error, setError] = useState(null);

  // Antwoord state (per vraagtype)
  const [antwoordExpected, setAntwoordExpected] = useState(vraag?.antwoord?.expected || '');
  const [antwoordTolerance, setAntwoordTolerance] = useState(vraag?.antwoord?.tolerance || 0.5);
  const [antwoordUnit, setAntwoordUnit] = useState(vraag?.antwoord?.unit || '');
  const [antwoordHint, setAntwoordHint] = useState(vraag?.antwoord?.hintBijFout || '');

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
        antwoord: vraagtype === 'numeriek'
          ? {
              type: 'numeriek',
              expected: parseFloat(antwoordExpected) || 0,
              tolerance: parseFloat(antwoordTolerance) || 0.5,
              unit: antwoordUnit,
              hintBijFout: antwoordHint
            }
          : { type: vraagtype }
      }),
    }),
    [editor, title, vraagtype, status, difficulty, showCalculator, hints, antwoordExpected, antwoordTolerance, antwoordUnit, antwoordHint]
  );

  useEffect(() => {
    if (editor) onEditorReady?.(editor);
  }, [editor, onEditorReady]);

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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="open">Open vraag</option>
            <option value="meerkeuze">Meerkeuze</option>
            <option value="numeriek">Numeriek</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  ? 'bg-blue-500 text-white'
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
                  ? 'bg-blue-500 text-white'
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
                  ? 'bg-blue-500 text-white'
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
                  ? 'bg-blue-500 text-white'
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
                  ? 'bg-blue-500 text-white'
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
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3"
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Voeg een hint toe..."
          />
          <button
            onClick={handleAddHint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
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
        ) : null}
      </div>
    </div>
  );
});

export default QuestionEditorInner;
