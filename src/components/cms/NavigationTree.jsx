import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  Boxes,
  ChevronDown,
  ChevronRight,
  FileQuestion,
  FileText,
  Layers3,
  Plus,
  Search,
  Sparkles,
  X
} from 'lucide-react';
import { CONTENT_BLOCK_LABELS } from '../../lib/contentBlockUtils';
import { buildCmsNavigationTree } from '../../lib/cmsNavigationUtils';

const STORAGE_KEY = 'cms-tree-expanded-ids';

const typeConfig = {
  vak: { icon: BookOpen, accent: 'text-blue-600', childLabel: 'jaren' },
  leerjaar: { icon: BarChart3, accent: 'text-slate-600', childLabel: 'niveaus' },
  niveau: { icon: Layers3, accent: 'text-violet-600', childLabel: 'hoofdstukken' },
  hoofdstuk: { icon: FileText, accent: 'text-emerald-600', childLabel: 'paragrafen' },
  paragraaf: { icon: Boxes, accent: 'text-amber-600', childLabel: 'lesblokken' },
  vraag: { icon: FileQuestion, accent: 'text-rose-500', childLabel: 'vraag' }
};

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

const TreeNode = ({
  node,
  level,
  selectedIds,
  expandedIds,
  forceExpanded,
  onToggleExpand,
  onSelect,
  onCreateChild
}) => {
  const config = typeConfig[node.type] || typeConfig.vak;
  const Icon = config.icon;
  const isExpanded = forceExpanded || expandedIds.includes(node.id);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedIds[node.type] === node.id;
  const pills = blockTypePills(node);
  const mutedCount = countLabel(node);
  const canCreateChild = ['vak', 'leerjaar', 'niveau', 'hoofdstuk'].includes(node.type);

  return (
    <div>
      <div
        className={[
          'group grid min-h-10 cursor-pointer grid-cols-[1.5rem_1.75rem_minmax(0,1fr)_auto] items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-all',
          isSelected
            ? 'bg-slate-900 text-white shadow-sm'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
        ].join(' ')}
        style={{ paddingLeft: `${10 + level * 14}px` }}
        onClick={() => onSelect({ type: node.type, id: node.id })}
      >
        <button
          onClick={(event) => {
            event.stopPropagation();
            if (hasChildren) onToggleExpand(node.id);
          }}
          className={[
            'flex h-6 w-6 items-center justify-center rounded-md transition-colors',
            hasChildren ? 'hover:bg-white/70' : 'opacity-30'
          ].join(' ')}
          disabled={!hasChildren}
          title={isExpanded ? 'Inklappen' : 'Uitklappen'}
        >
          {hasChildren && (isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />)}
        </button>

        <span
          className={[
            'flex h-7 w-7 items-center justify-center rounded-lg',
            isSelected ? 'bg-white/15 text-white' : `bg-white ${config.accent} ring-1 ring-slate-200`
          ].join(' ')}
        >
          <Icon size={15} />
        </span>

        <span className="min-w-0">
          <span className="block truncate font-semibold leading-5">{node.label}</span>
          {pills.length > 0 && (
            <span className={['mt-1 flex flex-wrap gap-1 text-[10px] font-black uppercase tracking-wide', isSelected ? 'text-slate-200' : 'text-slate-400'].join(' ')}>
              {pills.map((pill) => (
                <span key={pill}>{pill}</span>
              ))}
            </span>
          )}
        </span>

        <span className="flex items-center gap-1.5">
          {mutedCount && (
            <span
              className={[
                'hidden rounded-md px-2 py-1 text-[11px] font-bold lg:inline-flex',
                isSelected ? 'bg-white/10 text-slate-100' : 'bg-slate-100 text-slate-500'
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
                isSelected ? 'bg-white/10 text-white hover:bg-white/20' : 'text-blue-600 hover:bg-blue-50'
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
              onSelect={onSelect}
              onCreateChild={onCreateChild}
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
  onCreateParagraaf
}) {
  const [query, setQuery] = useState('');
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
        { query }
      ),
    [vakken, leerjaren, niveaus, hoofdstukken, paragrafen, vragen, contentBlocks, query]
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
    <aside className="flex h-full flex-col overflow-hidden border-r border-slate-200 bg-slate-50/95">
      <div className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">CMS</p>
            <h3 className="mt-1 flex items-center gap-2 text-lg font-black text-slate-950">
              <BookOpen size={18} />
              Inhoud
            </h3>
          </div>
          <button
            onClick={() => onCreateVak?.()}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700"
            title="Nieuw vak"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {Object.entries(totals).map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-center">
              <p className="text-sm font-black text-slate-900">{value}</p>
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Zoek lesmateriaal..."
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-700" title="Zoekopdracht wissen">
              <X size={15} />
            </button>
          )}
        </div>

        {expandedIds.length > 0 && !query && (
          <button
            onClick={() => setExpandedIds([])}
            className="mt-3 text-xs font-bold text-slate-500 hover:text-slate-900"
          >
            Alles inklappen
          </button>
        )}
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-3">
        {tree.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-center">
            <Sparkles className="mx-auto text-blue-500" size={24} />
            <p className="mt-3 text-sm font-black text-slate-900">
              {query ? 'Geen resultaten' : 'Nog geen lesmateriaal'}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {query ? 'Probeer een andere zoekterm.' : 'Start met een vak en bouw daarna je hoofdstukken op.'}
            </p>
            {!query && onCreateVak && (
              <button
                onClick={() => onCreateVak()}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
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
                onSelect={onSelect}
                onCreateChild={handleCreateChild}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
