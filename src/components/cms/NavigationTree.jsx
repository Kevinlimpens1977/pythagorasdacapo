/**
 * NavigationTree Component (ENHANCED)
 * Expandable hierarchy with inline "+ Create" buttons
 * Vak → Leerjaar → Niveau → Hoofdstuk → Paragraaf → Vraag
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, BarChart3, Layers, FileText, HelpCircle, Plus } from 'lucide-react';

const TreeNode = ({
  label,
  id,
  icon: Icon,
  level,
  children = [],
  isSelected,
  onSelect,
  expandedIds,
  onToggleExpand,
  onCreateChild
}) => {
  const isExpanded = expandedIds.includes(id);
  const hasChildren = children.length > 0;

  return (
    <div className="select-none">
      {/* Node Row */}
      <div
        className={`
          flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md transition-all border-l-3 group
          ${isSelected
            ? 'bg-gray-50 text-gray-900 font-semibold border-l-blue-500'
            : 'hover:bg-gray-50 text-gray-700 border-l-transparent'
          }
        `}
        onClick={() => onSelect(id)}
      >
        {/* Expand/Collapse button */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(id);
            }}
            className="p-0 flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        {/* Icon */}
        <Icon size={16} className="flex-shrink-0" />

        {/* Label */}
        <span className="flex-1 truncate text-sm font-medium">{label}</span>

        {/* Create button (hover) */}
        {onCreateChild && level < 5 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateChild(id);
            }}
            className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:bg-blue-50 rounded"
            title="Create child"
          >
            <Plus size={14} />
          </button>
        )}

        {/* Level indicator (badge) */}
        <span className="text-xs opacity-60 flex-shrink-0">
          {level === 0 && '📚'}
          {level === 1 && '📅'}
          {level === 2 && '📊'}
          {level === 3 && '📖'}
          {level === 4 && '📝'}
          {level === 5 && '❓'}
        </span>
      </div>

      {/* Children (collapsed by default) */}
      {hasChildren && isExpanded && (
        <div className="ml-4 border-l border-gray-200">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              {...child}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
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
  onCreateVraag
}) {
  const [expandedIds, setExpandedIds] = useState([]);

  const toggleExpand = (id) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCreateChild = (parentId) => {
    // Determine parent type and call appropriate handler
    const vak = vakken.find(v => v.id === parentId);
    if (vak) {
      onCreateLeerjaar?.(parentId);
      return;
    }

    const leerjaar = leerjaren.find(l => l.id === parentId);
    if (leerjaar) {
      onCreateNiveau?.(parentId);
      return;
    }

    const niveau = niveaus.find(n => n.id === parentId);
    if (niveau) {
      onCreateHoofdstuk?.(parentId);
      return;
    }

    const hoofdstuk = hoofdstukken.find(h => h.id === parentId);
    if (hoofdstuk) {
      onCreateParagraaf?.(parentId);
      return;
    }

    const paragraaf = paragrafen.find(p => p.id === parentId);
    if (paragraaf) {
      onCreateVraag?.(parentId);
    }
  };

  // Build tree structure
  const tree = vakken.map(vak => {
    const vakLeerjaren = leerjaren.filter(l => l.vakId === vak.id);
    return {
      ...vak,
      icon: BookOpen,
      level: 0,
      isSelected: selectedVakId === vak.id,
      onSelect: (id) => onSelect({ type: 'vak', id }),
      children: vakLeerjaren.map(leerjaar => {
        const leerjaarniveaus = niveaus.filter(n => n.leerjaarId === leerjaar.id);
        return {
          ...leerjaar,
          icon: BarChart3,
          level: 1,
          isSelected: selectedLeerjaarId === leerjaar.id,
          onSelect: (id) => onSelect({ type: 'leerjaar', id }),
          children: leerjaarniveaus.map(niveau => {
            const niveauHoofdstukken = hoofdstukken.filter(h => h.niveauId === niveau.id);
            return {
              ...niveau,
              label: `${niveau.label} - ${niveau.name}`,
              icon: Layers,
              level: 2,
              isSelected: selectedNiveauId === niveau.id,
              onSelect: (id) => onSelect({ type: 'niveau', id }),
              children: niveauHoofdstukken.map(hoofdstuk => {
                const hoofdstukParagrafen = paragrafen.filter(p => p.hoofdstukId === hoofdstuk.id);
                return {
                  ...hoofdstuk,
                  label: `${hoofdstuk.number}. ${hoofdstuk.title}`,
                  icon: FileText,
                  level: 3,
                  isSelected: selectedHoofdstukId === hoofdstuk.id,
                  onSelect: (id) => onSelect({ type: 'hoofdstuk', id }),
                  children: hoofdstukParagrafen.map(paragraaf => {
                    const paragraafVragen = vragen.filter(v => v.paragraafId === paragraaf.id);
                    return {
                      ...paragraaf,
                      label: `${paragraaf.code}. ${paragraaf.title}`,
                      icon: HelpCircle,
                      level: 4,
                      isSelected: selectedParagraafId === paragraaf.id,
                      onSelect: (id) => onSelect({ type: 'paragraaf', id }),
                      children: paragraafVragen.map(vraag => ({
                        ...vraag,
                        label: `Q${vraag.number}: ${vraag.title || 'Untitled'}`,
                        icon: HelpCircle,
                        level: 5,
                        isSelected: selectedVraagId === vraag.id,
                        onSelect: (id) => onSelect({ type: 'vraag', id }),
                        children: []
                      }))
                    };
                  })
                };
              })
            };
          })
        };
      })
    };
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen size={18} />
          Inhoud
        </h3>
        {onCreateVak && (
          <button
            onClick={() => onCreateVak()}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Create new subject"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {tree.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            <p className="mb-3">Nog geen vakken aangemaakt</p>
            {onCreateVak && (
              <button
                onClick={() => onCreateVak()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
                Maak eerste vak aan
              </button>
            )}
          </div>
        ) : (
          tree.map(vak => (
            <TreeNode
              key={vak.id}
              {...vak}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
              onCreateChild={handleCreateChild}
            />
          ))
        )}
      </div>
    </div>
  );
}
