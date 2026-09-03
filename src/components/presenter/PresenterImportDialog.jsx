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
import { CONTENT_BLOCK_LABELS } from '../../lib/contentBlockUtils';
import {
  countPresenterImportPages,
  getPresenterAssessmentItems,
  getPublishedPresenterContentBlocks,
  isPresenterAssessmentBlock
} from '../../lib/presenterContentImport';

// Standaard gaan alle vragen van een quiz of toets mee; de docent vinkt uit
// wat niet op het bord hoeft (bijvoorbeeld alleen de vragen voor de nabespreking).
const buildDefaultItemSelections = (blocks = []) =>
  Object.fromEntries(
    blocks
      .filter(isPresenterAssessmentBlock)
      .map((block) => [block.id, getPresenterAssessmentItems(block).map((item) => item.id)])
  );

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
  const [importPreview, setImportPreview] = useState(null);
  const [selectedBlockIds, setSelectedBlockIds] = useState([]);
  const [itemSelections, setItemSelections] = useState({});

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

  // Stap 1: blokken ophalen en eerst een overzicht tonen, zodat de docent weet
  // hoeveel pagina's er bij komen en per blok kan kiezen.
  const handlePrepareImport = async () => {
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

      const questionIds = [
        ...new Set(
          publishedBlocks
            .filter((block) => block.type === 'question' && block.linkedVraagId)
            .map((block) => block.linkedVraagId)
        )
      ];
      const linkedQuestions = await Promise.all(
        questionIds.map((questionId) => cmsService.getVraag(questionId).catch(() => null))
      );

      setImportPreview({
        paragraaf: selectedParagraph,
        hoofdstuk: selectedChapter,
        blocks: publishedBlocks,
        linkedQuestions: linkedQuestions.filter(Boolean)
      });
      setSelectedBlockIds(publishedBlocks.map((block) => block.id));
      setItemSelections(buildDefaultItemSelections(publishedBlocks));
    } catch (err) {
      console.error('Error loading presenter import preview:', err);
      setError('De lesblokken konden niet worden geladen. Probeer het opnieuw.');
    } finally {
      setImporting(false);
    }
  };

  const toggleBlockSelection = (blockId) => {
    setSelectedBlockIds((current) =>
      current.includes(blockId) ? current.filter((id) => id !== blockId) : [...current, blockId]
    );
  };

  const toggleItemSelection = (blockId, itemId) => {
    setItemSelections((current) => {
      const chosen = current[blockId] || [];
      return {
        ...current,
        [blockId]: chosen.includes(itemId) ? chosen.filter((id) => id !== itemId) : [...chosen, itemId]
      };
    });
  };

  const setAllItems = (block, everything) => {
    setItemSelections((current) => ({
      ...current,
      [block.id]: everything ? getPresenterAssessmentItems(block).map((item) => item.id) : []
    }));
  };

  const chosenBlocks = importPreview
    ? importPreview.blocks.filter((block) => selectedBlockIds.includes(block.id))
    : [];
  const pageCount = importPreview
    ? countPresenterImportPages({ contentBlocks: chosenBlocks, itemSelections })
    : 0;
  const pageWord = pageCount === 1 ? 'pagina' : "pagina's";

  const handleConfirmImport = () => {
    if (!importPreview || chosenBlocks.length === 0 || pageCount === 0) return;

    const imported = onImport?.({
      paragraaf: importPreview.paragraaf,
      hoofdstuk: importPreview.hoofdstuk,
      contentBlocks: chosenBlocks,
      linkedQuestions: importPreview.linkedQuestions,
      itemSelections
    });

    if (imported === false) {
      setError('Importeren is niet gelukt. Probeer het opnieuw.');
      return;
    }

    setImportPreview(null);
    setSelectedBlockIds([]);
    setItemSelections({});
    onClose?.();
  };

  const handleBackToSelection = () => {
    setImportPreview(null);
    setSelectedBlockIds([]);
    setItemSelections({});
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <section
        aria-modal="true"
        className="flex h-[min(48rem,calc(100dvh-2rem))] w-[min(76rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-[#E1F0F8] bg-white shadow-2xl"
        role="dialog"
      >
        <header className="flex items-center justify-between gap-4 border-b border-[#E1F0F8] bg-[#FBF5E8] px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--helix-purple)]">
              Lesstof importeren
            </p>
            <h2 className="mt-1 truncate font-display text-2xl font-extrabold text-[var(--helix-navy)]">
              {importPreview ? 'Controleer de import' : 'Kies hoofdstuk en paragraaf'}
            </h2>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#E1F0F8] bg-white text-[var(--helix-navy)] transition hover:bg-[#FBF5E8]"
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

        {importPreview ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="border-b border-[#E1F0F8] bg-[#FBF5E8] px-5 py-3 text-sm font-black text-[var(--helix-navy)]">
              Deze import maakt {pageCount} {pageWord}
              {' '}van {getParagraphLabel(importPreview.paragraaf)}. Vink blokken uit die je niet op het bord wilt.
              Bij een quiz of toets kies je welke vragen meegaan.
            </div>
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {importPreview.blocks.map((block, index) => {
                  const checked = selectedBlockIds.includes(block.id);
                  const assessmentItems = isPresenterAssessmentBlock(block) ? getPresenterAssessmentItems(block) : [];
                  const chosenItemIds = itemSelections[block.id] || [];
                  const blockPages = checked
                    ? countPresenterImportPages({ contentBlocks: [block], itemSelections })
                    : 0;

                  return (
                    <div key={block.id}>
                      <label
                        className={[
                          'flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-left transition',
                          checked
                            ? 'border-[#BED8EA] bg-[#F5EDDB] text-[var(--helix-navy)]'
                            : 'border-[#F5EDDB] bg-white text-[var(--helix-muted)] hover:border-[#E1F0F8]'
                        ].join(' ')}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleBlockSelection(block.id)}
                          className="h-4 w-4 shrink-0 accent-[var(--helix-purple)]"
                        />
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-black text-[var(--helix-purple)] ring-1 ring-[#E1F0F8]">
                          {index + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-black">
                            {block.title || CONTENT_BLOCK_LABELS[block.type] || 'Lesblok'}
                          </span>
                          <span className="mt-0.5 block truncate text-xs font-semibold text-[var(--helix-muted)]">
                            {CONTENT_BLOCK_LABELS[block.type] || block.type}
                            {assessmentItems.length > 0
                              ? ` - ${chosenItemIds.length} van ${assessmentItems.length} vragen, ${blockPages} ${blockPages === 1 ? 'pagina' : "pagina's"}`
                              : ''}
                          </span>
                        </span>
                      </label>

                      {checked && assessmentItems.length > 0 && (
                        <div className="ml-6 mt-1 rounded-lg border border-[#F5EDDB] bg-white px-3 py-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--helix-purple)]">
                              Vragen op het bord
                            </p>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => setAllItems(block, true)}
                                className="rounded-md border border-[#E1F0F8] px-2 py-1 text-[11px] font-black text-[var(--helix-navy)] transition hover:bg-[#FBF5E8]"
                              >
                                Alles
                              </button>
                              <button
                                type="button"
                                onClick={() => setAllItems(block, false)}
                                className="rounded-md border border-[#E1F0F8] px-2 py-1 text-[11px] font-black text-[var(--helix-navy)] transition hover:bg-[#FBF5E8]"
                              >
                                Geen
                              </button>
                            </div>
                          </div>
                          <ol className="mt-2 grid gap-1 sm:grid-cols-2">
                            {assessmentItems.map((item) => {
                              const itemChecked = chosenItemIds.includes(item.id);
                              return (
                                <li key={item.id}>
                                  <label
                                    className={[
                                      'flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-left transition',
                                      itemChecked ? 'bg-[#F5EDDB] text-[var(--helix-navy)]' : 'text-[var(--helix-muted)] hover:bg-[#FBF5E8]'
                                    ].join(' ')}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={itemChecked}
                                      onChange={() => toggleItemSelection(block.id, item.id)}
                                      className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--helix-purple)]"
                                    />
                                    <span className="min-w-0">
                                      <span className="block text-xs font-black">
                                        {item.nummer}. <span className="font-semibold text-[var(--helix-muted)]">{item.typeLabel}</span>
                                      </span>
                                      <span className="block truncate text-xs font-semibold" title={item.prompt}>{item.prompt}</span>
                                    </span>
                                  </label>
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-hidden md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="flex min-h-0 flex-col border-r border-[#E1F0F8]">
            <div className="flex items-center gap-2 border-b border-[#E1F0F8] px-5 py-3 text-sm font-black text-[var(--helix-navy)]">
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
                <div className="rounded-lg border border-dashed border-[#E1F0F8] p-5 text-center text-sm font-bold text-[var(--helix-muted)]">
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
                            ? 'border-[#BED8EA] bg-[#F5EDDB] text-[var(--helix-navy)]'
                            : 'border-[#F5EDDB] bg-white text-[var(--helix-navy)] hover:border-[#E1F0F8] hover:bg-[#FBF5E8]'
                        ].join(' ')}
                        onClick={() => {
                          setSelectedHoofdstukId(chapter.id);
                          setSelectedParagraafId(
                            sortByOrder(paragrafen.filter((paragraph) => paragraph.hoofdstukId === chapter.id))[0]?.id ||
                              ''
                          );
                        }}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[var(--helix-purple)] ring-1 ring-[#E1F0F8]">
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
            <div className="flex items-center gap-2 border-b border-[#E1F0F8] px-5 py-3 text-sm font-black text-[var(--helix-navy)]">
              <FileText size={18} className="text-[var(--helix-purple)]" />
              Paragrafen
            </div>
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
              {loadingTree ? null : paragraphRows.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#E1F0F8] p-5 text-center text-sm font-bold text-[var(--helix-muted)]">
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
                            ? 'border-[#BED8EA] bg-[#F5EDDB] text-[var(--helix-navy)]'
                            : 'border-[#F5EDDB] bg-white text-[var(--helix-navy)] hover:border-[#E1F0F8] hover:bg-[#FBF5E8]'
                        ].join(' ')}
                        onClick={() => setSelectedParagraafId(paragraph.id)}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-xs font-black text-[var(--helix-purple)] ring-1 ring-[#E1F0F8]">
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
        )}

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E1F0F8] bg-white px-5 py-4">
          <div className="min-w-0 text-sm font-bold text-[var(--helix-muted)]">
            {importPreview ? (
              <span className="flex min-w-0 items-center gap-2">
                <CheckCircle2 size={17} className="shrink-0 text-[var(--helix-purple)]" />
                <span className="truncate">
                  {selectedBlockIds.length} van {importPreview.blocks.length} blokken geselecteerd, {pageCount} {pageWord}
                </span>
              </span>
            ) : selectedParagraph ? (
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
              className="rounded-md border border-[#E1F0F8] bg-white px-4 py-2 text-sm font-black text-[var(--helix-navy)] transition hover:bg-[#FBF5E8]"
              onClick={importPreview ? handleBackToSelection : onClose}
              disabled={importing}
            >
              {importPreview ? 'Terug' : 'Annuleren'}
            </button>
            {importPreview ? (
              <button
                type="button"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[var(--helix-purple)] px-4 py-2 text-sm font-black text-white transition hover:bg-[#5F2C9E] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleConfirmImport}
                disabled={pageCount === 0}
              >
                Importeer {pageCount} {pageWord}
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[var(--helix-purple)] px-4 py-2 text-sm font-black text-white transition hover:bg-[#5F2C9E] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handlePrepareImport}
                disabled={!selectedParagraph || importing || loadingTree}
              >
                {importing ? <Loader2 className="animate-spin" size={17} /> : null}
                Verder
              </button>
            )}
          </div>
        </footer>
      </section>
    </div>
  );
}
