import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  PanelLeftClose,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import { CONTENT_BLOCK_LABELS } from '../../lib/contentBlockUtils';
import { buildCmsNavigationTree } from '../../lib/cmsNavigationUtils';

const STORAGE_KEY = 'cms-tree-expanded-ids';

const ArchiveToggleButton = ({ showArchived, onToggleShowArchived }) => (
  <button
    onClick={() => onToggleShowArchived?.()}
    className={[
      'rounded-full px-2.5 py-1 text-xs font-black transition',
      showArchived
        ? 'bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]'
        : 'bg-[var(--helix-surface-soft)] text-slate-500 hover:text-slate-900'
    ].join(' ')}
  >
    Archief tonen
  </button>
);

const countLabel = (node) => {
  if (node.type === 'vak') return `${node.counts.leerjaren} ${node.counts.leerjaren === 1 ? 'jaar' : 'jaren'}`;
  if (node.type === 'leerjaar') return `${node.counts.niveaus} ${node.counts.niveaus === 1 ? 'niveau' : 'niveaus'}`;
  if (node.type === 'niveau') return `${node.counts.hoofdstukken} ${node.counts.hoofdstukken === 1 ? 'hoofdstuk' : 'hoofdstukken'}`;
  if (node.type === 'hoofdstuk') return `${node.counts.paragrafen} ${node.counts.paragrafen === 1 ? 'paragraaf' : 'paragrafen'}`;
  if (node.type === 'paragraaf') {
    const total = node.counts.blocks.total || node.counts.vragen || 0;
    return `${total} ${total === 1 ? 'blok' : 'blokken'}`;
  }
  return null;
};

const blockTypePills = (node) => {
  if (node.type !== 'paragraaf' || !node.counts.blocks?.total) return [];

  return ['theory', 'example', 'question', 'media', 'summary', 'quiz', 'toets', 'game', 'slidedeck']
    .map((type) => ({ type, count: node.counts.blocks[type] || 0 }))
    .filter((item) => item.count > 0)
    .map((item) => `${CONTENT_BLOCK_LABELS[item.type][0]}${item.count}`);
};

const getNodeDisplayLabel = (node) => {
  return node.label || '';
};

const getIndent = (level) => {
  const indents = [0, 8, 14, 18, 22];
  return indents[Math.min(level, indents.length - 1)];
};

const TreeNode = ({
  node,
  level,
  selectedIds,
  expandedIds,
  forceExpanded,
  onToggleExpand,
  onCollapseTree,
  onSelect,
  onCreateChild,
  onRenameNode,
  onArchiveNode,
  actionNodeId,
  onOpenActions,
  onCloseActions
}) => {
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(node.label || '');
  const isExpanded = forceExpanded || expandedIds.includes(node.id);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedIds[node.type] === node.id;
  const isActiveParagraaf = node.type === 'paragraaf' && isSelected;
  const isActivePath = isSelected && !isActiveParagraaf;
  const pills = blockTypePills(node);
  const mutedCount = countLabel(node);
  const canCreateChild = ['vak', 'leerjaar', 'niveau', 'hoofdstuk'].includes(node.type);
  const actionsOpen = actionNodeId === node.id;
  const isArchived = node.archived === true;
  const displayLabel = getNodeDisplayLabel(node);
  const isChapterBand = node.type === 'hoofdstuk';
  const hasActiveChapterRail = isChapterBand && isSelected;

  const startRename = () => {
    setDraftName(node.label || '');
    setEditingName(true);
    onCloseActions?.();
  };

  const saveRename = async () => {
    const nextName = draftName.trim();
    if (!nextName || nextName === node.label) {
      setEditingName(false);
      return;
    }

    await onRenameNode?.(node, nextName);
    setEditingName(false);
  };

  return (
    <div className={isChapterBand ? 'mt-2' : undefined}>
      <div
        className={[
          'group grid min-h-[42px] cursor-pointer grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border-y border-r border-l-4 px-2 py-2 text-sm transition-colors',
          isActiveParagraaf
            ? 'border-y-fuchsia-100 border-r-fuchsia-100 border-l-[var(--helix-purple)] bg-[#f5edff] text-[var(--helix-navy)]'
            : isActivePath
              ? isChapterBand
                ? 'border-y-[#eadcff] border-r-[#eadcff] border-l-[var(--helix-purple)] bg-[#f7f0ff] text-[var(--helix-navy)]'
                : 'border-y-[var(--helix-border)] border-r-[var(--helix-border)] border-l-transparent bg-white text-[var(--helix-navy)]'
              : isChapterBand
                ? [
                    'border-y-[#eadcff] border-r-[#eadcff] bg-[#fbf7ff] text-[var(--helix-navy)] hover:bg-[#f7f0ff]',
                    hasActiveChapterRail ? 'border-l-[var(--helix-purple)]' : 'border-l-transparent'
                  ].join(' ')
                : node.type === 'paragraaf'
                  ? 'border-y-[#f1edfb] border-r-[#f1edfb] border-l-transparent bg-[#fbfaff] text-[var(--helix-muted)] hover:border-y-[#eadcff] hover:border-r-[#eadcff] hover:bg-[#f7f0ff] hover:text-[var(--helix-navy)]'
                  : 'border-y-transparent border-r-transparent border-l-transparent text-[var(--helix-muted)] hover:border-y-[var(--helix-border)] hover:border-r-[var(--helix-border)] hover:bg-white hover:text-[var(--helix-navy)]'
          ,
          isArchived ? 'opacity-55 grayscale' : ''
        ].join(' ')}
        style={{ paddingLeft: `${8 + getIndent(level)}px` }}
        onClick={() => {
          onSelect({ type: node.type, id: node.id });
          if (node.type === 'vak') onCollapseTree?.();
        }}
      >
        <button
          onClick={(event) => {
            event.stopPropagation();
            if (hasChildren) onToggleExpand(node.id);
          }}
          className={[
            'flex h-6 w-6 items-center justify-center rounded-md transition-colors',
            hasChildren ? 'hover:bg-[var(--helix-surface-soft)]' : 'opacity-30'
          ].join(' ')}
          disabled={!hasChildren}
          title={isExpanded ? 'Inklappen' : 'Uitklappen'}
        >
          {hasChildren && (isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />)}
        </button>

        <span className="min-w-0">
          {editingName ? (
            <input
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key === 'Enter') saveRename();
                if (event.key === 'Escape') setEditingName(false);
              }}
              onBlur={saveRename}
              className="block w-full rounded-lg border border-fuchsia-200 bg-white px-2 py-1 text-sm font-bold text-[var(--helix-navy)] outline-none focus:ring-2 focus:ring-[var(--helix-purple)]/20"
              autoFocus
            />
          ) : (
            <span className="block truncate font-semibold leading-5">
              {displayLabel}
              {isArchived && <span className="ml-2 text-[10px] font-black uppercase tracking-wide text-slate-400">Archief</span>}
            </span>
          )}
          {pills.length > 0 && (
            <span className={['mt-1 flex flex-wrap gap-1 text-[10px] font-black uppercase tracking-wide', isActiveParagraaf ? 'text-[var(--helix-purple)]' : 'text-slate-400'].join(' ')}>
              {pills.map((pill) => (
                <span key={pill}>{pill}</span>
              ))}
            </span>
          )}
        </span>

        <span className="relative flex min-w-0 items-center justify-end gap-1">
          {mutedCount && (
            <span
              className={[
                'inline-flex w-[5.5rem] shrink-0 justify-center whitespace-nowrap rounded-lg px-2 py-1 text-[10px] font-extrabold leading-none',
                isActiveParagraaf
                  ? 'bg-white text-[var(--helix-purple)]'
                  : isChapterBand
                    ? 'bg-white/85 text-[var(--helix-purple)]'
                    : 'bg-[var(--helix-surface-soft)] text-[var(--helix-muted)]'
              ].join(' ')}
            >
              {mutedCount}
            </span>
          )}
          {onCreateChild && canCreateChild && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                onCreateChild(node.id);
              }}
              className={[
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--helix-border)] transition-colors',
                isChapterBand || isActiveParagraaf ? 'bg-white text-[var(--helix-purple)] hover:bg-white' : 'bg-white text-[var(--helix-purple)] hover:bg-[var(--helix-soft-lavender)]'
              ].join(' ')}
              title={`Nieuw onderdeel toevoegen`}
            >
              <Plus size={15} />
            </button>
          )}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (actionsOpen) onCloseActions?.();
              else onOpenActions(node.id);
            }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--helix-border)] bg-white text-[var(--helix-muted)] transition hover:border-[var(--helix-purple)]/30 hover:bg-[var(--helix-soft-lavender)] hover:text-[var(--helix-purple)]"
            title="Bewerkingsopties"
            aria-label={`Bewerkingsopties voor ${displayLabel}`}
          >
            <MoreHorizontal size={15} />
          </button>
          {actionsOpen && (
            <span
              className="absolute right-0 top-full z-50 mt-2 w-40 rounded-2xl border border-[var(--helix-border)] bg-white p-1.5 text-left shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={startRename}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold text-[var(--helix-navy)] transition hover:bg-[var(--helix-surface-soft)]"
              >
                <Pencil size={14} />
                Naam wijzigen
              </button>
              <button
                type="button"
                onClick={() => {
                  onCloseActions?.();
                  onArchiveNode?.(node);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={14} />
                Archiveren
              </button>
            </span>
          )}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-0.5 space-y-0.5">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              forceExpanded={forceExpanded}
              onToggleExpand={onToggleExpand}
              onCollapseTree={onCollapseTree}
              onSelect={onSelect}
              onCreateChild={onCreateChild}
              onRenameNode={onRenameNode}
              onArchiveNode={onArchiveNode}
              actionNodeId={actionNodeId}
              onOpenActions={onOpenActions}
              onCloseActions={onCloseActions}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function NavigationTree({
  vakken = [],
  leerjaren = [],
  niveaus = [],
  hoofdstukken = [],
  paragrafen = [],
  vragen = [],
  contentBlocks = [],
  selectedVakId,
  selectedLeerjaarId,
  selectedNiveauId,
  selectedHoofdstukId,
  selectedParagraafId,
  selectedVraagId,
  onSelect,
  onCreateVak,
  onCreateLeerjaar,
  onCreateNiveau,
  onCreateHoofdstuk,
  onCreateParagraaf,
  onRenameNode,
  onArchiveNode,
  sidebarOpen = true,
  onToggleSidebar,
  showArchived = false,
  onToggleShowArchived
}) {
  const [query, setQuery] = useState('');
  const [actionNodeId, setActionNodeId] = useState(null);
  const [expandedIds, setExpandedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Error loading expanded state:', err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expandedIds));
    } catch (err) {
      console.error('Error saving expanded state:', err);
    }
  }, [expandedIds]);

  const selectedIds = {
    vak: selectedVakId,
    leerjaar: selectedLeerjaarId,
    niveau: selectedNiveauId,
    hoofdstuk: selectedHoofdstukId,
    paragraaf: selectedParagraafId,
    vraag: selectedVraagId
  };

  const tree = useMemo(
    () =>
      buildCmsNavigationTree(
        { vakken, leerjaren, niveaus, hoofdstukken, paragrafen, vragen, contentBlocks },
        { query, includeArchived: showArchived }
      ),
    [vakken, leerjaren, niveaus, hoofdstukken, paragrafen, vragen, contentBlocks, query, showArchived]
  );

  const totals = useMemo(
    () => ({
      vakken: vakken.length,
      paragrafen: paragrafen.length,
      vragen: vragen.length + contentBlocks.reduce((total, block) => {
        if (block.isArchived === true || (block.type !== 'quiz' && block.type !== 'toets')) return total;
        return total + (Array.isArray(block.content?.items) ? block.content.items.length : 0);
      }, 0),
      blokken: contentBlocks.filter((block) => block.isArchived !== true).length
    }),
    [vakken.length, paragrafen.length, vragen.length, contentBlocks]
  );

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((expandedId) => expandedId !== id) : [...prev, id]
    );
  };

  const handleCreateChild = (parentId) => {
    if (vakken.some((vak) => vak.id === parentId)) return onCreateLeerjaar?.(parentId);
    if (leerjaren.some((leerjaar) => leerjaar.id === parentId)) return onCreateNiveau?.(parentId);
    if (niveaus.some((niveau) => niveau.id === parentId)) return onCreateHoofdstuk?.(parentId);
    if (hoofdstukken.some((hoofdstuk) => hoofdstuk.id === parentId)) return onCreateParagraaf?.(parentId);
    return null;
  };

  return (
    <aside className="flex h-full flex-col overflow-hidden border-r border-[var(--helix-border)] bg-white/92">
      <div className="border-b border-[var(--helix-border)] bg-white px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <h3 className="flex min-w-0 items-center gap-2 font-display text-lg font-extrabold text-[var(--helix-navy)]">
              <BookOpen size={18} />
              <span className="truncate">Inhoud</span>
            </h3>
          </div>
          <button
            onClick={() => onCreateVak?.()}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-fuchsia-100 bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)] shadow-sm transition-colors hover:bg-white"
            title="Nieuw vak"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {Object.entries(totals).map(([label, value]) => (
            <div key={label} className="rounded-xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-2 py-2 text-center">
              <p className="text-sm font-black text-[var(--helix-navy)]">{value}</p>
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-[var(--helix-muted)]">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-3 py-2 focus-within:border-fuchsia-200">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--helix-navy)] outline-none placeholder:text-slate-400"
            placeholder="Zoek lesmateriaal..."
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-700" title="Zoekopdracht wissen">
              <X size={15} />
            </button>
          )}
        </div>

        {!query && (
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              onClick={() => onToggleSidebar?.()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] text-[var(--helix-muted)] transition-colors hover:bg-white hover:text-[var(--helix-navy)]"
              title={sidebarOpen ? 'Inhoud verbergen' : 'Inhoud tonen'}
            >
              <PanelLeftClose size={17} />
            </button>
            <ArchiveToggleButton showArchived={showArchived} onToggleShowArchived={onToggleShowArchived} />
          </div>
        )}
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-3">
        {tree.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[var(--helix-border)] bg-white p-5 text-center">
            <Sparkles className="mx-auto text-[var(--helix-purple)]" size={24} />
            <p className="mt-3 text-sm font-black text-[var(--helix-navy)]">
              {query ? 'Geen resultaten' : 'Nog geen lesmateriaal'}
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--helix-muted)]">
              {query ? 'Probeer een andere zoekterm.' : 'Start met een vak en bouw daarna je hoofdstukken op.'}
            </p>
            {!query && onCreateVak && (
              <button
                onClick={() => onCreateVak()}
                className="btn-primary mt-4 px-4 py-2 text-sm"
              >
                <Plus size={16} />
                Nieuw vak
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {tree.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                level={0}
                selectedIds={selectedIds}
                expandedIds={expandedIds}
                forceExpanded={Boolean(query)}
                onToggleExpand={toggleExpand}
                onCollapseTree={() => setExpandedIds([])}
                onSelect={onSelect}
                onCreateChild={handleCreateChild}
                onRenameNode={onRenameNode}
                onArchiveNode={onArchiveNode}
                actionNodeId={actionNodeId}
                onOpenActions={setActionNodeId}
                onCloseActions={() => setActionNodeId(null)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
