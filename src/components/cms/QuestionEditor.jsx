/**
 * QuestionEditor Component
 * Edit vraag (question) content, metadata, and status
 * Uses TipTap for rich text editing
 */

import { useState, useCallback, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2, Star } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import {
  QUESTION_TYPES,
  buildDefaultAnswerForQuestionType,
  buildDefaultTokenConfigForQuestionType,
  getQuestionTypeDefinition,
  normalizeQuestionAnswerIds,
  normalizeQuestionTokenConfig
} from '../../lib/questionTypeRegistry';
import { QUESTION_STATUS_OPTIONS } from '../../lib/questionStatusUtils';
import {
  buildFillBlankTextFromSegments,
  buildSegmentsFromLegacyFillBlank,
  getFillBlankGapsFromSegments
} from '../../lib/fillBlankUtils';

const createVolgordeItem = (text = '') => ({
  id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  text
});

const createChoiceOption = (text = '', correct = false) => ({
  id: `option-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  text,
  correct,
  explanation: '',
  misconception: ''
});

const createFillBlankGap = () => ({
  type: 'gap',
  id: `gap-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  answer: '',
  smartCheck: true
});

const QuestionEditorInner = forwardRef(function QuestionEditor(
  {
    vraag,
    onEditorReady
  },
  ref
) {
  const initialVraagtype = vraag?.vraagtype || vraag?.antwoord?.type || 'open';
  const initialAntwoord = normalizeQuestionAnswerIds(initialVraagtype, vraag?.antwoord || {});

  // Form state
  const [title, setTitle] = useState(vraag?.title || '');
  const [vraagtype, setVraagtype] = useState(initialVraagtype);
  const [status, setStatus] = useState(vraag?.status || 'draft');
  const [difficulty, setDifficulty] = useState(vraag?.vraagMetadata?.difficulty || 3);
  const [showCalculator, setShowCalculator] = useState(vraag?.vraagMetadata?.showCalculator || false);
  const [hints, setHints] = useState(vraag?.vraagMetadata?.hints || []);
  const [newHint, setNewHint] = useState('');
  const [error] = useState(null);
  const textSegmentRefs = useRef({});
  const gapInputRefs = useRef({});
  const [activeTextSegmentIndex, setActiveTextSegmentIndex] = useState(0);

  // Antwoord state (per vraagtype)
  const [openModelAnswer, setOpenModelAnswer] = useState(initialAntwoord.modelAnswer || '');
  const [meerkeuzeOptions, setMeerkeuzeOptions] = useState(() => (
    initialAntwoord.type === 'meerkeuze' && Array.isArray(initialAntwoord.options)
      ? initialAntwoord.options.map((option, index) => ({
          id: option.id || `option-${index + 1}`,
          text: option.text || '',
          correct: Boolean(option.correct),
          explanation: option.explanation || option.feedback || '',
          misconception: option.misconception || option.misconceptie || ''
        }))
      : buildDefaultAnswerForQuestionType('meerkeuze').options
  ));
  const [antwoordExpected, setAntwoordExpected] = useState(vraag?.antwoord?.expected ?? vraag?.antwoord?.correctValue ?? '');
  const [antwoordTolerance, setAntwoordTolerance] = useState(vraag?.antwoord?.tolerance || 0.5);
  const [antwoordUnit, setAntwoordUnit] = useState(vraag?.antwoord?.unit || '');
  const [antwoordHint, setAntwoordHint] = useState(vraag?.antwoord?.hintBijFout || '');
  const [koppelenPairs, setKoppelenPairs] = useState(() => (
    initialAntwoord.type === 'koppelen' && Array.isArray(initialAntwoord.pairs)
      ? initialAntwoord.pairs.map((pair, index) => ({
          id: pair.id || `pair-${index + 1}`,
          left: pair.left || '',
          right: pair.right || ''
        }))
      : [{ id: `pair-${Date.now()}`, left: '', right: '' }]
  ));
  const [invullenSegments, setInvullenSegments] = useState(() => {
    if (initialAntwoord.type !== 'invullen') return [{ type: 'text', text: '' }];
    if (Array.isArray(initialAntwoord.segments) && initialAntwoord.segments.length > 0) {
      return initialAntwoord.segments;
    }
    return buildSegmentsFromLegacyFillBlank(initialAntwoord.text || '', initialAntwoord.gaps || []);
  });
  const [volgordeItems, setVolgordeItems] = useState(() => (
    initialAntwoord.type === 'volgorde' && Array.isArray(initialAntwoord.items)
      ? initialAntwoord.items.map((item) => ({
          id: item.id || createVolgordeItem().id,
          text: item.text || ''
        }))
      : [createVolgordeItem()]
  ));
  const [tokenConfig, setTokenConfig] = useState(() => (
    normalizeQuestionTokenConfig(
      initialVraagtype,
      initialAntwoord || buildDefaultAnswerForQuestionType(initialVraagtype),
      vraag?.vraagMetadata?.tokenConfig
    )
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
    if (vraagtype === 'open') {
      return {
        type: 'open',
        modelAnswer: openModelAnswer
      };
    }

    if (vraagtype === 'meerkeuze') {
      return normalizeQuestionAnswerIds(vraagtype, {
        type: 'meerkeuze',
        options: meerkeuzeOptions.map((option, index) => ({
          id: option.id || `option-${index + 1}`,
          text: option.text || '',
          correct: Boolean(option.correct),
          explanation: option.explanation || '',
          misconception: option.misconception || ''
        }))
      });
    }

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
      return normalizeQuestionAnswerIds(vraagtype, {
        type: 'koppelen',
        pairs: koppelenPairs.map((pair) => ({
          id: pair.id,
          left: pair.left || '',
          right: pair.right || ''
        }))
      });
    }

    if (vraagtype === 'invullen') {
      const gaps = getFillBlankGapsFromSegments(invullenSegments);
      return normalizeQuestionAnswerIds(vraagtype, {
        type: 'invullen',
        text: buildFillBlankTextFromSegments(invullenSegments),
        segments: invullenSegments,
        gaps
      });
    }

    if (vraagtype === 'volgorde') {
      return normalizeQuestionAnswerIds(vraagtype, {
        type: 'volgorde',
        items: volgordeItems.map((item) => ({
          id: item.id,
          text: item.text || ''
        }))
      });
    }

    return { type: vraagtype };
  }, [
    vraagtype,
    openModelAnswer,
    meerkeuzeOptions,
    antwoordExpected,
    antwoordTolerance,
    antwoordUnit,
    antwoordHint,
    koppelenPairs,
    invullenSegments,
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
        tokenConfig,
        antwoord: getAntwoordState()
      }),
    }),
    [editor, title, vraagtype, status, difficulty, showCalculator, hints, tokenConfig, getAntwoordState]
  );

  useEffect(() => {
    if (editor) onEditorReady?.(editor);
  }, [editor, onEditorReady]);

  useEffect(() => {
    setTokenConfig((currentConfig) =>
      normalizeQuestionTokenConfig(vraagtype, getAntwoordState(), currentConfig)
    );
  }, [vraagtype, getAntwoordState]);

  const applyQuestionType = useCallback((nextType) => {
    const defaultAnswer = buildDefaultAnswerForQuestionType(nextType);
    setVraagtype(nextType);
    setOpenModelAnswer(defaultAnswer.modelAnswer || '');
    setMeerkeuzeOptions(defaultAnswer.options || []);
    setAntwoordExpected(defaultAnswer.expected ?? '');
    setAntwoordTolerance(defaultAnswer.tolerance ?? 0.5);
    setAntwoordUnit(defaultAnswer.unit || '');
    setAntwoordHint(defaultAnswer.hintBijFout || '');
    setKoppelenPairs(defaultAnswer.pairs || [{ id: `pair-${Date.now()}`, left: '', right: '' }]);
    setInvullenSegments(defaultAnswer.segments || buildSegmentsFromLegacyFillBlank(defaultAnswer.text || '', defaultAnswer.gaps || []));
    setVolgordeItems(defaultAnswer.items || [createVolgordeItem()]);
    setTokenConfig(buildDefaultTokenConfigForQuestionType(nextType, defaultAnswer));
  }, []);

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

  const handleUpdateOption = useCallback((index, field, value) => {
    setMeerkeuzeOptions((options) =>
      options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, [field]: value } : option
      )
    );
  }, []);

  const handleRemoveOption = useCallback((index) => {
    setMeerkeuzeOptions((options) => options.filter((_, optionIndex) => optionIndex !== index));
  }, []);

  const handleRemovePair = useCallback((index) => {
    setKoppelenPairs((pairs) => pairs.filter((_, pairIndex) => pairIndex !== index));
  }, []);

  const handleUpdateTextSegment = useCallback((index, value) => {
    setInvullenSegments((segments) =>
      segments.map((segment, segmentIndex) =>
        segmentIndex === index ? { ...segment, text: value } : segment
      )
    );
  }, []);

  const handleUpdateGap = useCallback((segmentIndex, value) => {
    setInvullenSegments((segments) =>
      segments.map((segment, currentIndex) =>
        currentIndex === segmentIndex ? { ...segment, answer: value } : segment
      )
    );
  }, []);

  const handleCreateFillBlankGap = useCallback(() => {
    setInvullenSegments((segments) => {
      const segmentIndex = Math.max(0, Math.min(activeTextSegmentIndex, segments.length - 1));
      const segment = segments[segmentIndex];
      if (!segment || segment.type !== 'text') return segments;

      const textarea = textSegmentRefs.current[segmentIndex];
      const cursorPosition = textarea?.selectionStart ?? segment.text.length;
      const before = segment.text.slice(0, cursorPosition);
      const after = segment.text.slice(cursorPosition);
      const gap = createFillBlankGap();
      const nextSegments = [
        ...segments.slice(0, segmentIndex),
        { type: 'text', text: before },
        gap,
        { type: 'text', text: after },
        ...segments.slice(segmentIndex + 1)
      ];

      window.requestAnimationFrame(() => {
        gapInputRefs.current[gap.id]?.focus();
      });

      return nextSegments;
    });
  }, [activeTextSegmentIndex]);

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

  const handleUpdateToken = useCallback((partId, value) => {
    const nextTokens = Math.max(0, Math.round(Number(value) || 0));
    setTokenConfig((currentConfig) => {
      const distribution = currentConfig.distribution.map((part) =>
        part.id === partId ? { ...part, tokens: nextTokens } : part
      );
      return {
        ...currentConfig,
        totalTokens: distribution.reduce((sum, part) => sum + part.tokens, 0),
        distribution
      };
    });
  }, []);

  const handleSetTotalTokens = useCallback((value) => {
    const totalTokens = Math.max(0, Math.round(Number(value) || 0));
    setTokenConfig((currentConfig) => {
      const normalized = normalizeQuestionTokenConfig(
        vraagtype,
        getAntwoordState(),
        { ...currentConfig, totalTokens }
      );
      const base = Math.floor(totalTokens / Math.max(normalized.distribution.length, 1));
      let remainder = totalTokens - base * normalized.distribution.length;
      return {
        ...normalized,
        totalTokens,
        distribution: normalized.distribution.map((part) => {
          const tokens = base + (remainder > 0 ? 1 : 0);
          remainder -= 1;
          return { ...part, tokens };
        })
      };
    });
  }, [getAntwoordState, vraagtype]);

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
            onChange={(e) => applyQuestionType(e.target.value)}
            className="input-standard w-full"
          >
            {QUESTION_TYPES.map((type) => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
          <p className="mt-2 text-xs leading-5 text-gray-500">
            {getQuestionTypeDefinition(vraagtype).description}
          </p>
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
            {QUESTION_STATUS_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
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
          Antwoordtemplate
        </label>

        <div className="mb-4 rounded-2xl border border-fuchsia-100 bg-[var(--helix-soft-lavender)] px-4 py-3">
          <p className="text-sm font-black text-[var(--helix-navy)]">
            {getQuestionTypeDefinition(vraagtype).label}
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--helix-muted)]">
            {getQuestionTypeDefinition(vraagtype).template}
          </p>
        </div>

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
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <p className="text-sm text-gray-600">
              Leerling typt vrij antwoord. Het modelantwoord maakt latere docentbeoordeling of AI-feedback eenvoudiger.
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Modelantwoord
              </label>
              <textarea
                value={openModelAnswer}
                onChange={(e) => setOpenModelAnswer(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--helix-purple)] focus:border-transparent"
                placeholder="Beschrijf wat een goed antwoord bevat."
              />
            </div>
          </div>
        ) : vraagtype === 'meerkeuze' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
            <p className="text-sm text-gray-600">
              Voeg opties toe en markeer welke correct zijn. Per optie kun je alvast feedback noteren.
            </p>
            <div className="space-y-3">
              {meerkeuzeOptions.map((option, index) => (
                <div key={option.id} className="grid gap-3 items-end xl:grid-cols-[auto_1fr_1fr_1fr_auto]">
                  <label className="flex items-center gap-2 pb-2 text-xs font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={option.correct}
                      onChange={(e) => handleUpdateOption(index, 'correct', e.target.checked)}
                      className="h-4 w-4 rounded border-[var(--helix-border)] text-[var(--helix-purple)] focus:ring-fuchsia-100"
                    />
                    Correct
                  </label>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Optie {index + 1}
                    </label>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleUpdateOption(index, 'text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Antwoordoptie"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Feedback
                    </label>
                    <input
                      type="text"
                      value={option.explanation}
                      onChange={(e) => handleUpdateOption(index, 'explanation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Waarom wel/niet?"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Misconceptie
                    </label>
                    <input
                      type="text"
                      value={option.misconception || ''}
                      onChange={(e) => handleUpdateOption(index, 'misconception', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Welke denkfout hoort hierbij?"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Verwijder optie"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMeerkeuzeOptions((options) => [...options, createChoiceOption()])}
              className="btn-primary px-4 py-2 text-sm"
            >
              <Plus size={18} />
              Voeg optie toe
            </button>
          </div>
        ) : vraagtype === 'koppelen' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
            <p className="text-sm text-gray-600">
              Maak koppelparen. De linker- en rechterkant vormen samen het correcte antwoord.
            </p>

            <div className="space-y-3">
              {koppelenPairs.map((pair, index) => (
                <div key={pair.id || index} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
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
              onClick={() => setKoppelenPairs((pairs) => [...pairs, { id: `pair-${Date.now()}`, left: '', right: '' }])}
              className="btn-primary px-4 py-2 text-sm"
            >
              <Plus size={18} />
              Voeg paar toe
            </button>
          </div>
        ) : vraagtype === 'invullen' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
            <div>
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600">
                  Typ de tekst. Zet je cursor op de gewenste plek en klik op <strong>Maak gat</strong>.
                </p>
                <button
                  type="button"
                  onClick={handleCreateFillBlankGap}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  <Plus size={18} />
                  Maak gat
                </button>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-white p-3">
                {invullenSegments.map((segment, index) => (
                  segment.type === 'gap' ? (
                    <input
                      key={segment.id}
                      ref={(element) => {
                        gapInputRefs.current[segment.id] = element;
                      }}
                      type="text"
                      value={segment.answer || ''}
                      onChange={(e) => handleUpdateGap(index, e.target.value)}
                      className="my-2 inline-flex min-w-36 rounded-xl border-2 border-amber-300 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-950 outline-none transition focus:border-[var(--helix-purple)] focus:bg-white"
                      placeholder="Juist antwoord"
                      aria-label={`Correct antwoord voor invulveld ${getFillBlankGapsFromSegments(invullenSegments).findIndex((gap) => gap.id === segment.id) + 1}`}
                    />
                  ) : (
                    <textarea
                      key={`text-${index}`}
                      ref={(element) => {
                        textSegmentRefs.current[index] = element;
                      }}
                      value={segment.text || ''}
                      onFocus={() => setActiveTextSegmentIndex(index)}
                      onClick={() => setActiveTextSegmentIndex(index)}
                      onChange={(e) => handleUpdateTextSegment(index, e.target.value)}
                      rows={Math.max(2, Math.ceil((segment.text || '').length / 80))}
                      className="my-1 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-800 outline-none transition focus:border-[var(--helix-purple)] focus:ring-2 focus:ring-fuchsia-100"
                      placeholder={index === 0 ? 'Typ hier de tekst van de vraag...' : 'Tekst na het invulveld...'}
                    />
                  )
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-gray-700">
                  Invulvelden: {getFillBlankGapsFromSegments(invullenSegments).length}
                </p>
                {getFillBlankGapsFromSegments(invullenSegments).length === 0 && (
                  <p className="text-xs text-gray-500">Klik op Maak gat om een antwoordveld toe te voegen.</p>
                )}
              </div>
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

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Tokens
            </label>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Deze instellingen worden alvast opgeslagen voor het toekomstige tokensysteem.
            </p>
          </div>
          <div className="w-full sm:w-36">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Totaal
            </label>
            <input
              type="number"
              min="0"
              value={tokenConfig.totalTokens}
              onChange={(e) => handleSetTotalTokens(e.target.value)}
              className="input-standard w-full"
            />
          </div>
        </div>

        {tokenConfig.distribution.length > 0 ? (
          <div className="mt-4 space-y-2">
            {tokenConfig.distribution.map((part) => (
              <div key={part.id} className="grid grid-cols-[1fr_7rem] items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
                <span className="text-sm font-semibold text-gray-700">{part.label}</span>
                <input
                  type="number"
                  min="0"
                  value={part.tokens}
                  onChange={(e) => handleUpdateToken(part.id, e.target.value)}
                  className="input-standard w-full"
                  aria-label={`Tokens voor ${part.label}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-gray-500">
            Voeg eerst antwoordonderdelen toe om tokens te verdelen.
          </p>
        )}
      </div>
    </div>
  );
});

export default QuestionEditorInner;
