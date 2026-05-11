/**
 * NavigationTree Component
 * Expandable hierarchy: Vak → Leerjaar → Niveau → Hoofdstuk → Paragraaf → Vraag
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, BarChart3, Layers, FileText, HelpCircle } from 'lucide-react';

const TreeNode = ({
  label,
  id,
  icon: Icon,
  level,
  children = [],
  isSelected,
  onSelect,
  expandedIds,
  onToggleExpand
}) => {
  const isExpanded = expandedIds.includes(id);
  const hasChildren = children.length > 0;

  return (
    <div className="select-none">
      {/* Node Row */}
      <div
        className={`
          flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg transition-colors
          ${isSelected
            ? 'bg-blue-500 text-white font-semibold'
            : 'hover:bg-gray-100 text-gray-800'
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
          <div className="w-4" /> // Spacer
        )}

        {/* Icon */}
        <Icon size={16} className="flex-shrink-0" />

        {/* Label */}
        <span className="flex-1 truncate text-sm font-medium">{label}</span>

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
              isSelected={child.id === (typeof child.isSelected === 'function' ? child.isSelected(child.id) : child.isSelected)}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
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
  onSelectVak,
  onSelectLeerjaar,
  onSelectNiveau,
  onSelectHoofdstuk,
  onSelectParagraaf,
  onSelectVraag,
  loading
}) {
  const [expandedIds, setExpandedIds] = useState([]);

  const handleToggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // Build tree structure
  const buildTree = () => {
    return vakken.map((vak) => {
      const vakLeerjaren = leerjaren.filter((l) => l.vakId === vak.id);
      const vakNiveaus = niveaus.filter((n) =>
        vakLeerjaren.find((l) => l.id === n.leerjaarId)
      );
      const vakHoofdstukken = hoofdstukken.filter((h) =>
        vakNiveaus.find((n) => n.id === h.niveauId)
      );
      const vakParagrafen = paragrafen.filter((p) =>
        vakHoofdstukken.find((h) => h.id === p.hoofdstukId)
      );

      const leerjaarNodes = vakLeerjaren.map((leerjaar) => {
        const leerjaarNiveaus = niveaus.filter((n) => n.leerjaarId === leerjaar.id);
        const leerjaarHoofdstukken = hoofdstukken.filter((h) =>
          leerjaarNiveaus.find((n) => n.id === h.niveauId)
        );

        const niveauNodes = leerjaarNiveaus.map((niveau) => {
          const niveauHoofdstukken = hoofdstukken.filter(
            (h) => h.niveauId === niveau.id
          );

          const hoofdstukNodes = niveauHoofdstukken.map((hoofdstuk) => {
            const hoofdstukParagrafen = paragrafen.filter(
              (p) => p.hoofdstukId === hoofdstuk.id
            );

            const paragraafNodes = hoofdstukParagrafen.map((paragraaf) => {
              const paragraafVragen = vragen.filter(
                (v) => v.paragraafId === paragraaf.id
              );

              return {
                id: paragraaf.id,
                label: `${paragraaf.code} ${paragraaf.title}`,
                icon: FileText,
                level: 4,
                isSelected: paragraaf.id === selectedParagraafId,
                onSelect: onSelectParagraaf,
                children: paragraafVragen.map((vraag) => ({
                  id: vraag.id,
                  label: `${vraag.number} ${vraag.title}`,
                  icon: HelpCircle,
                  level: 5,
                  isSelected: vraag.id === selectedVraagId,
                  onSelect: onSelectVraag,
                  children: []
                }))
              };
            });

            return {
              id: hoofdstuk.id,
              label: `${hoofdstuk.number}. ${hoofdstuk.title}`,
              icon: BookOpen,
              level: 3,
              isSelected: hoofdstuk.id === selectedHoofdstukId,
              onSelect: onSelectHoofdstuk,
              children: paragraafNodes
            };
          });

          return {
            id: niveau.id,
            label: niveau.label,
            icon: Layers,
            level: 2,
            isSelected: niveau.id === selectedNiveauId,
            onSelect: onSelectNiveau,
            children: hoofdstukNodes
          };
        });

        return {
          id: leerjaar.id,
          label: leerjaar.label,
          icon: BarChart3,
          level: 1,
          isSelected: leerjaar.id === selectedLeerjaarId,
          onSelect: onSelectLeerjaar,
          children: niveauNodes
        };
      });

      return {
        id: vak.id,
        label: vak.name,
        icon: BookOpen,
        level: 0,
        isSelected: vak.id === selectedVakId,
        onSelect: onSelectVak,
        children: leerjaarNodes
      };
    });
  };

  const tree = buildTree();

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Loading navigation...</p>
      </div>
    );
  }

  if (vakken.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No subjects found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-3 space-y-1">
        {tree.map((vakNode) => (
          <TreeNode
            key={vakNode.id}
            {...vakNode}
            expandedIds={expandedIds}
            onToggleExpand={handleToggleExpand}
          />
        ))}
      </div>
    </div>
  );
}
