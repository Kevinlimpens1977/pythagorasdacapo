import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  Layers3,
  Loader2,
  X
} from 'lucide-react';
import cmsService from '../../services/cmsService';
import { getPublishedPresenterContentBlocks } from '../../lib/presenterContentImport';

const sortByOrder = (items = []) =>
  [...items].sort((a, b) => (a.order || a.year || 0) - (b.order || b.year || 0));

const getChapterLabel = (chapter) =>
  [chapter.number ? `H${chapter.number}` : '', chapter.title || chapter.label || chapter.name || 'Hoofdstuk']
    .filter(Boolean)
    .join(' ');

const getParagraphLabel = (paragraph) =>
  [paragraph.code || paragraph.number || '', paragraph.title || paragraph.label || paragraph.name || 'Paragraaf']
    .filter(Boolean)
    .join(' ');

const buildChapterRows = ({ vakken, leerjaren, niveaus, hoofdstukken }) => {
  const vakById = new Map(vakken.map((vak) => [vak.id, vak]));
  const leerjaarById = new Map(leerjaren.map((leerjaar) => [leerjaar.id, leerjaar]));
  const niveauById = new Map(niveaus.map((niveau) => [niveau.id, niveau]));

  return sortByOrder(hoofdstukken).map((chapter) => {
    const niveau = niveauById.get(chapter.niveauId) || null;
    const leerjaar = leerjaarById.get(chapter.leerjaarId || niveau?.leerjaarId) || null;
    const vak = vakById.get(chapter.vakId || niveau?.vakId || leerjaar?.vakId) || null;

    return {
      ...chapter,
      displayTitle: getChapterLabel(chapter),
      context: [vak?.name, leerjaar?.label || (leerjaar?.year ? `Jaar ${leerjaar.year}` : ''), niveau?.label || niveau?.name]
        .filter(Boolean)
        .join(' / ')
    };
  });
};

export default function PresenterImportDialog({
  open = false,
  onClose,
  onImport
}) {
  const [loadingTree, setLoadingTree] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [vakken, setVakken] = useState([]);
  const [leerjaren, setLeerjaren] = useState([]);
  const [niveaus, setNiveaus] = useState([]);
  const [hoofdstukken, setHoofdstukken] = useState([]);
  const [paragrafen, setParagrafen] = useState([]);
  const [selectedHoofdstukId, setSelectedHoofdstukId] = useState('');
  const [selectedParagraafId, setSelectedParagraafId] = useState('');

  useEffect(() => {
    if (!open) return undefined;

    const loadTree = async () => {
      setLoadingTree(true);
      setError('');

      try {
        const vakList = await cmsService.getVakken(false);
        const leerjaarLists = await Promise.all(vakList.map((vak) => cmsService.getLeerjaren(vak.id, false)));
        const leerjaarList = leerjaarLists.flat();
        const niveauLists = await Promise.all(leerjaarList.map((leerjaar) => cmsService.getNiveaus(leerjaar.id, false)));
        const niveauList = niveauLists.flat();
        const hoofdstukLists = await Promise.all(niveauList.map((niveau) => cmsService.getHoofdstukken(niveau.id, false)));
        const hoofdstukList = hoofdstukLists.flat();
        const paragraafLists = await Promise.all(
          hoofdstukList.map((hoofdstuk) => cmsService.getParagrafen(hoofdstuk.id, false))
        );

        setVakken(vakList);
        setLeerjaren(leerjaarList);
        setNiveaus(niveauList);
        setHoofdstukken(hoofdstukList);
        setParagrafen(paragraafLists.flat());

        if (hoofdstukList.length > 0) {
          const firstChapterId = hoofdstukList[0].id;
          const firstParagraph = sortByOrder(paragraafLists.flat()).find(
            (paragraph) => paragraph.hoofdstukId === firstChapterId
          );
          setSelectedHoofdstukId(firstChapterId);
          setSelectedParagraafId(firstParagraph?.id || '');
        }
      } catch (err) {
        console.error('Error loading presenter import tree:', err);
        setError('De CMS-inhoud kon niet worden geladen.');
      } finally {
        setLoadingTree(false);
      }
    };

    loadTree();
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !importing) onClose?.();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [importing, onClose, open]);

  const chapterRows = useMemo(
    () => buildChapterRows({ vakken, leerjaren, niveaus, hoofdstukken }),
    [hoofdstukken, leerjaren, niveaus, vakken]
  );

  const selectedChapter = chapterRows.find((chapter) => chapter.id === selectedHoofdstukId) || null;
  const paragraphRows = useMemo(
    () => sortByOrder(paragrafen.filter((paragraph) => paragraph.hoofdstukId === selectedHoofdstukId)),
    [paragrafen, selectedHoofdstukId]
  );
  const selectedParagraph = paragraphRows.find((paragraph) => paragraph.id === selectedParagraafId) || null;

  if (!open) return null;

  const handleImport = async () => {
    if (!selectedParagraph) return;

    setImporting(true);
    setError('');

    try {
      const contentBlocks = await cmsService.getContentBlocks(selectedParagraph.id, false);
      const publishedBlocks = getPublishedPresenterContentBlocks(contentBlocks);
      if (publishedBlocks.length === 0) {
        setError('Deze paragraaf heeft geen gepubliceerde lesblokken om te importeren.');
        return;
      }

      const canConfirm = typeof window !== 'undefined' && typeof window.confirm === 'function';
      if (canConfirm) {
        const confirmed = window.confirm(
          `Deze paragraaf maakt ${publishedBlocks.length} Presenter-pagina${publishedBlocks.length === 1 ? '' : "'s"}. Importeren?`
        );
        if (!confirmed) return;
      }

      const questionIds = [
        ...new Set(
          contentBlocks
            .filter((block) => block.type === 'question' && block.linkedVraagId)
            .map((block) => block.linkedVraagId)
        )
      ];
      const linkedQuestions = await Promise.all(
        questionIds.map((questionId) => cmsService.getVraag(questionId).catch(() => null))
      );
      const imported = onImport?.({
        paragraaf: selectedParagraph,
        hoofdstuk: selectedChapter,
        contentBlocks,
        linkedQuestions: linkedQuestions.filter(Boolean)
      });

      if (imported === false) {
        setError('Importeren is niet gelukt. Probeer het opnieuw.');
        return;
      }

      onClose?.();
    } catch (err) {
      console.error('Error importing presenter content:', err);
      setError('Importeren is niet gelukt. Probeer het opnieuw.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <section
        aria-modal="true"
        className="flex h-[min(48rem,calc(100dvh-2rem))] w-[min(76rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-[#eadcff] bg-white shadow-2xl"
        role="dialog"
      >
        <header className="flex items-center justify-between gap-4 border-b border-[#eadcff] bg-[#fbf7ff] px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--helix-purple)]">
              Lesstof importeren
            </p>
            <h2 className="mt-1 truncate font-display text-2xl font-extrabold text-[var(--helix-navy)]">
              Kies hoofdstuk en paragraaf
            </h2>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#eadcff] bg-white text-[var(--helix-navy)] transition hover:bg-[#f7f0ff]"
            onClick={onClose}
            disabled={importing}
            aria-label="Importvenster sluiten"
          >
            <X size={20} />
          </button>
        </header>

        {error ? (
          <div className="mx-5 mt-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-950">
            <AlertCircle className="mt-0.5 shrink-0" size={17} />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-hidden md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="flex min-h-0 flex-col border-r border-[#eadcff]">
            <div className="flex items-center gap-2 border-b border-[#eadcff] px-5 py-3 text-sm font-black text-[var(--helix-navy)]">
              <BookOpen size={18} className="text-[var(--helix-purple)]" />
              Hoofdstukken
            </div>
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
              {loadingTree ? (
                <div className="flex h-full items-center justify-center gap-2 text-sm font-black text-[var(--helix-muted)]">
                  <Loader2 className="animate-spin" size={18} />
                  CMS-inhoud laden
                </div>
              ) : chapterRows.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#eadcff] p-5 text-center text-sm font-bold text-[var(--helix-muted)]">
                  Geen hoofdstukken gevonden.
                </div>
              ) : (
                <div className="space-y-2">
                  {chapterRows.map((chapter) => {
                    const isSelected = chapter.id === selectedHoofdstukId;

                    return (
                      <button
                        key={chapter.id}
                        type="button"
                        className={[
                          'grid w-full grid-cols-[2.25rem_minmax(0,1fr)_1.5rem] items-center gap-3 rounded-lg border px-3 py-3 text-left transition',
                          isSelected
                            ? 'border-[#d9c3ff] bg-[#f5edff] text-[var(--helix-navy)]'
                            : 'border-[#f1edfb] bg-white text-[var(--helix-navy)] hover:border-[#eadcff] hover:bg-[#fbf7ff]'
                        ].join(' ')}
                        onClick={() => {
                          setSelectedHoofdstukId(chapter.id);
                          setSelectedParagraafId(
                            sortByOrder(paragrafen.filter((paragraph) => paragraph.hoofdstukId === chapter.id))[0]?.id ||
                              ''
                          );
                        }}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[var(--helix-purple)] ring-1 ring-[#eadcff]">
                          <Layers3 size={17} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-black">{chapter.displayTitle}</span>
                          {chapter.context ? (
                            <span className="mt-1 block truncate text-xs font-semibold text-[var(--helix-muted)]">
                              {chapter.context}
                            </span>
                          ) : null}
                        </span>
                        <ChevronRight size={17} className={isSelected ? 'text-[var(--helix-purple)]' : 'text-slate-300'} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-col">
            <div className="flex items-center gap-2 border-b border-[#eadcff] px-5 py-3 text-sm font-black text-[var(--helix-navy)]">
              <FileText size={18} className="text-[var(--helix-purple)]" />
              Paragrafen
            </div>
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
              {loadingTree ? null : paragraphRows.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#eadcff] p-5 text-center text-sm font-bold text-[var(--helix-muted)]">
                  Selecteer een hoofdstuk met paragrafen.
                </div>
              ) : (
                <div className="space-y-2">
                  {paragraphRows.map((paragraph) => {
                    const isSelected = paragraph.id === selectedParagraafId;

                    return (
                      <button
                        key={paragraph.id}
                        type="button"
                        className={[
                          'grid w-full grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 rounded-lg border px-3 py-3 text-left transition',
                          isSelected
                            ? 'border-[#d9c3ff] bg-[#f5edff] text-[var(--helix-navy)]'
                            : 'border-[#f1edfb] bg-white text-[var(--helix-navy)] hover:border-[#eadcff] hover:bg-[#fbf7ff]'
                        ].join(' ')}
                        onClick={() => setSelectedParagraafId(paragraph.id)}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-xs font-black text-[var(--helix-purple)] ring-1 ring-[#eadcff]">
                          {paragraph.code || paragraph.number || 'P'}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-black">{getParagraphLabel(paragraph)}</span>
                          {paragraph.beschrijving || paragraph.description ? (
                            <span className="mt-1 block truncate text-xs font-semibold text-[var(--helix-muted)]">
                              {paragraph.beschrijving || paragraph.description}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eadcff] bg-white px-5 py-4">
          <div className="min-w-0 text-sm font-bold text-[var(--helix-muted)]">
            {selectedParagraph ? (
              <span className="flex min-w-0 items-center gap-2">
                <CheckCircle2 size={17} className="shrink-0 text-[var(--helix-purple)]" />
                <span className="truncate">{getParagraphLabel(selectedParagraph)}</span>
              </span>
            ) : (
              'Kies een paragraaf om gepubliceerde lesblokken te importeren.'
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border border-[#eadcff] bg-white px-4 py-2 text-sm font-black text-[var(--helix-navy)] transition hover:bg-[#fbf7ff]"
              onClick={onClose}
              disabled={importing}
            >
              Annuleren
            </button>
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[var(--helix-purple)] px-4 py-2 text-sm font-black text-white transition hover:bg-[#5f2c84] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleImport}
              disabled={!selectedParagraph || importing || loadingTree}
            >
              {importing ? <Loader2 className="animate-spin" size={17} /> : null}
              Importeren
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
