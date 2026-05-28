import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Boxes,
  ChevronDown,
  ChevronRight,
  FileQuestion,
  FileText,
  GraduationCap,
  Layers3,
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

const typeConfig = {
  vak: { icon: BookOpen, accent: 'text-[var(--helix-purple)]', childLabel: 'jaren' },
  leerjaar: { icon: GraduationCap, accent: 'text-[var(--helix-pink)]', childLabel: 'niveaus' },
  niveau: { icon: Layers3, accent: 'text-violet-600', childLabel: 'hoofdstukken' },
  hoofdstuk: { icon: FileText, accent: 'text-[var(--helix-purple)]', childLabel: 'paragrafen' },
  paragraaf: { icon: Boxes, accent: 'text-[var(--helix-purple)]', childLabel: 'lesblokken' },
  vraag: { icon: FileQuestion, accent: 'text-[var(--helix-pink)]', childLabel: 'vraag' }
};

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

  return ['theory', 'example', 'question', 'media', 'summary', 'game', 'slidedeck']
    .map((type) => ({ type, count: node.counts.blocks[type] || 0 }))
    .filter((item) => item.count > 0)
    .map((item) => `${CONTENT_BLOCK_LABELS[item.type][0]}${item.count}`);
};

const getNodeBadgeLabel = (node) => {
  if (node.type !== 'paragraaf') return null;
  return node.code || node.number || null;
};

const getNodeDisplayLabel = (node) => {
  const label = node.label || '';
  const badge = getNodeBadgeLabel(node);
  if (!badge) return label;
  return label.replace(new RegExp(`^${String(badge).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+`), '');
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
  const config = typeConfig[node.type] || typeConfig.vak;
  const Icon = config.icon;
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
  const badgeLabel = getNodeBadgeLabel(node);
  const displayLabel = getNodeDisplayLabel(node);
  const isChapterBand = node.type === 'hoofdstuk';

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
    <div>
      <div
        className={[
          'group grid min-h-10 cursor-pointer grid-cols-[1.5rem_1.75rem_minmax(0,1fr)_6.75rem] items-center gap-2 rounded-xl border px-2.5 py-2 text-sm transition-all',
          isChapterBand ? 'border-l-4 border-l-[var(--helix-purple)]' : '',
          isActiveParagraaf
            ? 'border-fuchsia-100 bg-[#f5edff] text-[var(--helix-navy)] shadow-sm ring-1 ring-fuchsia-100'
            : isActivePath
              ? isChapterBand
                ? 'border-[var(--helix-border)] bg-[#fbf7ff] text-[var(--helix-navy)]'
                : 'border-[var(--helix-border)] bg-white text-[var(--helix-navy)]'
              : 'border-transparent text-[var(--helix-muted)] hover:border-[var(--helix-border)] hover:bg-white hover:text-[var(--helix-navy)]'
          ,
          isArchived ? 'opacity-55 grayscale' : ''
        ].join(' ')}
        style={{ paddingLeft: `${10 + level * 14}px` }}
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

        <span
          className={[
            'relative flex h-7 w-7 items-center justify-center rounded-lg',
            node.type === 'paragraaf'
              ? 'bg-white text-[var(--helix-purple)] ring-1 ring-fuchsia-100'
              : isActivePath
                ? `bg-[var(--helix-surface-soft)] ${config.accent} ring-1 ring-[var(--helix-border)]`
                : `bg-white ${config.accent} ring-1 ring-[var(--helix-border)]`
          ].join(' ')}
          onDoubleClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onOpenActions(node.id);
          }}
          title="Dubbelklik voor bewerkingsopties"
        >
          {badgeLabel ? <span className="text-[13px] font-black leading-none">{badgeLabel}</span> : <Icon size={15} />}
          {actionsOpen && (
            <span
              className="absolute bottom-full left-1/2 z-50 mb-2 w-40 -translate-x-1/2 rounded-2xl border border-[var(--helix-border)] bg-white p-1.5 text-left shadow-xl"
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
                Verwijderen
              </button>
            </span>
          )}
        </span>

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

        <span className="flex min-w-0 items-center justify-end gap-1.5">
          {mutedCount && (
            <span
              className={[
                'inline-flex w-[6.1rem] shrink-0 justify-center rounded-md px-1.5 py-1 text-[11px] font-bold leading-none',
                isActiveParagraaf
                  ? 'bg-white/80 text-[var(--helix-purple)]'
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
                'flex h-7 w-7 items-center justify-center rounded-lg opacity-0 transition-all group-hover:opacity-100',
                isActiveParagraaf ? 'bg-white/80 text-[var(--helix-purple)] hover:bg-white' : 'text-[var(--helix-purple)] hover:bg-[var(--helix-soft-lavender)]'
              ].join(' ')}
              title={`Nieuw onderdeel toevoegen`}
            >
              <Plus size={15} />
            </button>
          )}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
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
      vragen: vragen.length,
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
