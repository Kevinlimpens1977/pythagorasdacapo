/**
 * CmsShell Component
 * Main layout for CMS
 * Left: Navigation tree
 * Right: Content editor or detail panel
 */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Eye, PanelLeftOpen, Palette, Plus, Trash2 } from 'lucide-react';
import NavigationTree from './NavigationTree';
import DualPanelEditor from './DualPanelEditor';
import CreateContentModal from './CreateContentModal';
import InlineEdit from './InlineEdit';
import ColorEmojiPicker from './ColorEmojiPicker';
import ContentBlockBuilder from './ContentBlockBuilder';
import useCms from '../../hooks/useCms';
import * as cmsService from '../../services/cmsService';

const DEFAULT_SIDEBAR_WIDTH = 400;
const MIN_SIDEBAR_WIDTH = 300;
const MAX_SIDEBAR_WIDTH = 560;

export default function CmsShell() {
  const [showArchived, setShowArchived] = useState(false);
  const cms = useCms(showArchived);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [createModal, setCreateModal] = useState(null); // { type, parentId }
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [editingColor, setEditingColor] = useState(null); // { type, id } when editing color/emoji
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const shellRef = useRef(null);
  const showLegacyParagraafPanel = false;
  const showLegacyQuestionPanel = false;

  // Sidebar state (load from localStorage)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('cms-sidebar-open');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Persist sidebar state
  const handleToggleSidebar = () => {
    setSidebarOpen(prev => {
      const newState = !prev;
      if (newState) setSidebarWidth(DEFAULT_SIDEBAR_WIDTH);
      localStorage.setItem('cms-sidebar-open', JSON.stringify(newState));
      return newState;
    });
  };

  useEffect(() => {
    if (!isResizingSidebar) return undefined;

    const handleMouseMove = (event) => {
      const shellLeft = shellRef.current?.getBoundingClientRect().left || 0;
      const nextWidth = Math.min(
        MAX_SIDEBAR_WIDTH,
        Math.max(MIN_SIDEBAR_WIDTH, event.clientX - shellLeft)
      );
      setSidebarWidth(nextWidth);
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar]);

  // Unified selection handler for tree
  const handleSelect = (selection) => {
    switch (selection.type) {
      case 'vak':
        cms.setVak(selection.id);
        break;
      case 'leerjaar':
        cms.setLeerjaar(selection.id);
        break;
      case 'niveau':
        cms.setNiveau(selection.id);
        break;
      case 'hoofdstuk':
        cms.setHoofdstuk(selection.id);
        break;
      case 'paragraaf':
        cms.setVraag(null);
        cms.setParagraaf(selection.id);
        setIsEditing(false);
        break;
      default:
        break;
    }
  };

  // Handle archiving
  const handleArchive = async (type, id) => {
    if (!window.confirm(`Weet je zeker dat je dit onderdeel wilt archiveren? Alles onder deze tak wordt ook gearchiveerd.`)) {
      return;
    }

    try {
      setArchiveLoading(true);
      await cmsService.archiveContentBranch(type, id);
      await reloadCmsContext();
    } catch (err) {
      alert('Archiveren is mislukt: ' + err.message);
    } finally {
      setArchiveLoading(false);
    }
  };

  const reloadCmsContext = async () => {
    await cms.loadVakken();
    if (cms.selectedVakId) await cms.loadLeerjaren(cms.selectedVakId);
    if (cms.selectedLeerjaarId) await cms.loadNiveaus(cms.selectedLeerjaarId);
    if (cms.selectedNiveauId) await cms.loadHoofdstukken(cms.selectedNiveauId);
    if (cms.selectedHoofdstukId) await cms.loadParagrafen(cms.selectedHoofdstukId);
    if (cms.selectedParagraafId) {
      await cms.loadVragen(cms.selectedParagraafId);
      await cms.loadContentBlocks(cms.selectedParagraafId);
    }
  };

  const handleRenameTreeNode = async (node, nextName) => {
    switch (node.type) {
      case 'vak':
        await cmsService.updateVak(node.id, { name: nextName });
        break;
      case 'leerjaar':
        await cmsService.updateLeerjaar(node.id, { label: nextName });
        break;
      case 'niveau':
        await cmsService.updateNiveau(node.id, { label: nextName, name: nextName });
        break;
      case 'hoofdstuk':
        await cmsService.updateHoofdstuk(node.id, { title: nextName, number: null });
        break;
      case 'paragraaf':
        await cmsService.updateParagraaf(node.id, { title: nextName });
        break;
      default:
        return;
    }

    await reloadCmsContext();
  };

  const handleArchiveTreeNode = async (node) => {
    const confirmed = window.confirm(
      `Weet je zeker dat je "${node.label}" wilt archiveren?\n\nAlles onder deze tak wordt ook gearchiveerd. Je kunt het terugzien via "Archief tonen".`
    );
    if (!confirmed) return;

    try {
      setArchiveLoading(true);
      await cmsService.archiveContentBranch(node.type, node.id);
      await reloadCmsContext();
    } catch (err) {
      alert('Archiveren is mislukt: ' + err.message);
    } finally {
      setArchiveLoading(false);
    }
  };

  // Handle saving color/emoji
  const handleSaveColorEmoji = async (type, id, { colorId, emoji }) => {
    try {
      const updateMap = { color: colorId, emoji };
      switch (type) {
        case 'vak':
          await cmsService.updateVak(id, updateMap);
          await cms.loadVakken();
          break;
        case 'leerjaar':
          await cmsService.updateLeerjaar(id, updateMap);
          await cms.loadLeerjaren(cms.selectedVakId);
          break;
        case 'niveau':
          await cmsService.updateNiveau(id, updateMap);
          await cms.loadNiveaus(cms.selectedLeerjaarId);
          break;
        case 'hoofdstuk':
          await cmsService.updateHoofdstuk(id, updateMap);
          await cms.loadHoofdstukken(cms.selectedNiveauId);
          break;
        default:
          break;
      }
      setEditingColor(null);
    } catch (err) {
      alert('Error saving color/emoji: ' + err.message);
    }
  };

  // Build breadcrumb
  const breadcrumbItems = [
    cms.currentVak && { label: cms.currentVak.name, id: cms.selectedVakId },
    cms.currentLeerjaar && { label: `Jaar ${cms.currentLeerjaar.year}`, id: cms.selectedLeerjaarId },
    cms.currentNiveau && { label: cms.currentNiveau.label, id: cms.selectedNiveauId },
    cms.currentHoofdstuk && { label: cms.currentHoofdstuk.title, id: cms.selectedHoofdstukId },
    cms.currentParagraaf && { label: cms.currentParagraaf.title, id: cms.selectedParagraafId },
  ].filter(Boolean);

  const currentContextLabel =
    cms.currentParagraaf?.title ||
    cms.currentHoofdstuk?.title ||
    cms.currentNiveau?.label ||
    cms.currentLeerjaar?.label ||
    cms.currentVak?.name ||
    'Contentstudio';

  const currentContextMeta = [
    cms.vakken.length && `${cms.vakken.length} vakken`,
    cms.paragrafen.length && `${cms.paragrafen.length} paragrafen`,
    cms.vragen.length && `${cms.vragen.length} vragen`,
    cms.contentBlocks.length && `${cms.contentBlocks.length} lesblokken`
  ].filter(Boolean);
  const visibleBreadcrumbItems = breadcrumbItems.length > 1 ? breadcrumbItems.slice(0, -1) : breadcrumbItems;

  return (
    <>
      <div ref={shellRef} className="relative flex h-[calc(100dvh-5rem)] min-h-[calc(100dvh-5rem)] overflow-hidden bg-[var(--helix-bg)]">
        {/* Toggle Button - Fixed Left Edge (when sidebar closed) */}
        {!sidebarOpen && (
          <button
            onClick={handleToggleSidebar}
            className="absolute left-0 top-6 z-40 flex items-center gap-2 rounded-r-2xl border border-l-0 border-[var(--helix-border)] bg-white px-3 py-2 text-sm font-bold text-[var(--helix-muted)] shadow-sm transition-all hover:bg-[var(--helix-surface-soft)] hover:text-[var(--helix-navy)]"
            title="Inhoud tonen"
          >
            <PanelLeftOpen size={18} />
            Inhoud
          </button>
        )}

        {/* Left Sidebar - Navigation Tree (Collapsible) */}
        <div
          className={[
            'relative flex-shrink-0 self-stretch overflow-hidden border-r border-[var(--helix-border)] bg-white/95 backdrop-blur-xl',
            isResizingSidebar ? '' : 'transition-[width,opacity] duration-300 ease-in-out',
            sidebarOpen ? 'opacity-100' : 'w-0 border-r-0 opacity-0'
          ].join(' ')}
          style={sidebarOpen ? { width: `${sidebarWidth}px` } : undefined}
        >
          <NavigationTree
            vakken={cms.vakken}
            leerjaren={cms.leerjaren}
            niveaus={cms.niveaus}
            hoofdstukken={cms.hoofdstukken}
            paragrafen={cms.paragrafen}
            vragen={cms.vragen}
            contentBlocks={cms.navigationContentBlocks}
            selectedVakId={cms.selectedVakId}
            selectedLeerjaarId={cms.selectedLeerjaarId}
            selectedNiveauId={cms.selectedNiveauId}
            selectedHoofdstukId={cms.selectedHoofdstukId}
            selectedParagraafId={cms.selectedParagraafId}
            selectedVraagId={cms.selectedVraagId}
            onSelect={handleSelect}
            onCreateVak={() => setCreateModal({ type: 'vak', parentId: null })}
            onCreateLeerjaar={(vakId) => setCreateModal({ type: 'leerjaar', parentId: vakId })}
            onCreateNiveau={(leerjaarId) => setCreateModal({ type: 'niveau', parentId: leerjaarId })}
            onCreateHoofdstuk={(niveauId) => setCreateModal({ type: 'hoofdstuk', parentId: niveauId })}
            onCreateParagraaf={(hoofdstukId) => setCreateModal({ type: 'paragraaf', parentId: hoofdstukId })}
            onRenameNode={handleRenameTreeNode}
            onArchiveNode={handleArchiveTreeNode}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={handleToggleSidebar}
            showArchived={showArchived}
            onToggleShowArchived={() => setShowArchived((current) => !current)}
          />
          {sidebarOpen && (
            <button
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                setIsResizingSidebar(true);
              }}
              className="absolute right-0 top-0 z-30 h-full w-2 cursor-col-resize border-r border-transparent bg-transparent transition-colors hover:border-[var(--helix-purple)]/50 hover:bg-[var(--helix-soft-lavender)]/70"
              title="Zijbalk breder of smaller maken"
              aria-label="Zijbalk breder of smaller maken"
            />
          )}
        </div>

        {/* Right Panel - Content Editor or Detail Panel */}
        <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
          <div className="helix-surface mb-5 px-5 py-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--helix-muted)]">
                  {visibleBreadcrumbItems.length > 0 ? (
                    visibleBreadcrumbItems.map((item, idx) => (
                      <React.Fragment key={item.id}>
                        <span className="max-w-[16rem] truncate">{item.label}</span>
                        {idx < visibleBreadcrumbItems.length - 1 && (
                          <ChevronRight size={14} className="flex-shrink-0 text-slate-300" />
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <span className="uppercase tracking-[0.18em]">Werkvlak</span>
                  )}
                </div>
                <h2 className="mt-1 font-display text-xl font-extrabold text-[var(--helix-navy)]">{currentContextLabel}</h2>
                {currentContextMeta.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentContextMeta.map((item) => (
                      <span key={item} className="helix-badge normal-case tracking-normal">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => cms.selectedParagraafId && navigate(`/chapter/${cms.selectedParagraafId}?preview=published`)}
                  disabled={!cms.selectedParagraafId}
                  className="inline-flex items-center gap-2 rounded-2xl border border-[var(--helix-border)] bg-white px-3 py-2 text-sm font-bold text-[var(--helix-muted)] transition-colors hover:bg-[var(--helix-surface-soft)] disabled:cursor-not-allowed disabled:opacity-40"
                  title="Preview met gepubliceerde lesblokken"
                >
                  <Eye size={16} />
                  Gepubliceerd
                </button>
                <button
                  onClick={() => cms.selectedParagraafId && navigate(`/chapter/${cms.selectedParagraafId}?preview=draft`)}
                  disabled={!cms.selectedParagraafId}
                  className="inline-flex items-center gap-2 rounded-2xl border border-fuchsia-200 bg-fuchsia-50 px-3 py-2 text-sm font-bold text-fuchsia-700 transition-colors hover:bg-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-40"
                  title="Preview inclusief conceptblokken"
                >
                  <Eye size={16} />
                  Conceptpreview
                </button>
                <button
                  onClick={() => {
                    if (cms.selectedHoofdstukId) setCreateModal({ type: 'paragraaf', parentId: cms.selectedHoofdstukId });
                    else setCreateModal({ type: 'vak', parentId: null });
                  }}
                  className="btn-primary px-3 py-2 text-sm"
                >
                  <Plus size={16} />
                  {cms.selectedHoofdstukId ? 'Nieuwe paragraaf' : 'Nieuw vak'}
                </button>
              </div>
            </div>
          </div>
          {cms.loading && (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm font-bold text-[var(--helix-muted)]">Lesstof laden...</p>
            </div>
          )}

          {cms.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{cms.error}</p>
            </div>
          )}

          {/* VAK Detail Panel */}
          {!cms.loading && !cms.error && cms.selectedVakId && !cms.selectedLeerjaarId && cms.currentVak && (
            <div className="max-w-2xl">
              <div className="helix-surface p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{cms.currentVak.emoji || '📚'}</span>
                  <h2 className="text-3xl font-bold text-gray-900">{cms.currentVak.name}</h2>
                  <button
                    onClick={() => setEditingColor({ type: 'vak', id: cms.selectedVakId })}
                    className="ml-auto p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit color & emoji"
                  >
                    <Palette size={20} />
                  </button>
                </div>

                {/* Color/Emoji Picker (inline) */}
                {editingColor?.type === 'vak' && editingColor?.id === cms.selectedVakId && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <ColorEmojiPicker
                      colorId={cms.currentVak.color}
                      emoji={cms.currentVak.emoji}
                      itemName={cms.currentVak.name}
                      onChange={(data) => handleSaveColorEmoji('vak', cms.selectedVakId, data)}
                      onClose={() => setEditingColor(null)}
                    />
                  </div>
                )}

                <p className="mb-6 text-sm text-[var(--helix-muted)]">{cms.currentVak.description || 'Geen beschrijving'}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCreateModal({ type: 'leerjaar', parentId: cms.selectedVakId })}
                    className="btn-primary px-4 py-2 text-sm">
                    <Plus size={16} />
                    Voeg Leerjaar toe
                  </button>
                  <button
                    onClick={() => handleArchive('vak', cms.selectedVakId)}
                    disabled={archiveLoading}
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
                    <Trash2 size={16} />
                    Archiveren
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LEERJAAR Detail Panel */}
          {!cms.loading && !cms.error && cms.selectedLeerjaarId && !cms.selectedNiveauId && cms.currentLeerjaar && (
            <div className="max-w-2xl">
              <div className="helix-surface p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{cms.currentLeerjaar.emoji || '📅'}</span>
                  <h2 className="text-3xl font-bold text-gray-900">Jaar {cms.currentLeerjaar.year}</h2>
                  <button
                    onClick={() => setEditingColor({ type: 'leerjaar', id: cms.selectedLeerjaarId })}
                    className="ml-auto p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit color & emoji"
                  >
                    <Palette size={20} />
                  </button>
                </div>

                {/* Color/Emoji Picker (inline) */}
                {editingColor?.type === 'leerjaar' && editingColor?.id === cms.selectedLeerjaarId && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <ColorEmojiPicker
                      colorId={cms.currentLeerjaar.color}
                      emoji={cms.currentLeerjaar.emoji}
                      itemName={`Jaar ${cms.currentLeerjaar.year}`}
                      onChange={(data) => handleSaveColorEmoji('leerjaar', cms.selectedLeerjaarId, data)}
                      onClose={() => setEditingColor(null)}
                    />
                  </div>
                )}

                <p className="text-gray-600 text-sm mb-6">{cms.currentLeerjaar.label || ''}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCreateModal({ type: 'niveau', parentId: cms.selectedLeerjaarId })}
                    className="btn-primary px-4 py-2 text-sm">
                    <Plus size={16} />
                    Voeg Niveau toe
                  </button>
                  <button
                    onClick={() => handleArchive('leerjaar', cms.selectedLeerjaarId)}
                    disabled={archiveLoading}
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
                    <Trash2 size={16} />
                    Archiveren
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NIVEAU Detail Panel */}
          {!cms.loading && !cms.error && cms.selectedNiveauId && !cms.selectedHoofdstukId && cms.currentNiveau && (
            <div className="max-w-2xl">
              <div className="helix-surface p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{cms.currentNiveau.emoji || '📊'}</span>
                  <h2 className="text-3xl font-bold text-gray-900">{cms.currentNiveau.label}</h2>
                  <button
                    onClick={() => setEditingColor({ type: 'niveau', id: cms.selectedNiveauId })}
                    className="ml-auto p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit color & emoji"
                  >
                    <Palette size={20} />
                  </button>
                </div>

                {/* Color/Emoji Picker (inline) */}
                {editingColor?.type === 'niveau' && editingColor?.id === cms.selectedNiveauId && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <ColorEmojiPicker
                      colorId={cms.currentNiveau.color}
                      emoji={cms.currentNiveau.emoji}
                      itemName={cms.currentNiveau.label}
                      onChange={(data) => handleSaveColorEmoji('niveau', cms.selectedNiveauId, data)}
                      onClose={() => setEditingColor(null)}
                    />
                  </div>
                )}

                <p className="mb-6 text-sm text-[var(--helix-muted)]">{cms.currentNiveau.description || 'Geen beschrijving'}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCreateModal({ type: 'hoofdstuk', parentId: cms.selectedNiveauId })}
                    className="btn-primary px-4 py-2 text-sm">
                    <Plus size={16} />
                    Voeg Hoofdstuk toe
                  </button>
                  <button
                    onClick={() => handleArchive('niveau', cms.selectedNiveauId)}
                    disabled={archiveLoading}
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
                    <Trash2 size={16} />
                    Archiveren
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* HOOFDSTUK Detail Panel */}
          {!cms.loading && !cms.error && cms.selectedHoofdstukId && !cms.selectedParagraafId && cms.currentHoofdstuk && (
            <div className="max-w-2xl">
              <div className="helix-surface p-8">
                <div className="flex items-start gap-3 mb-6">
                  <span className="text-3xl">{cms.currentHoofdstuk.emoji || '📖'}</span>
                  <InlineEdit
                    value={cms.currentHoofdstuk.title}
                    onSave={async (newValue) => {
                      await cmsService.updateHoofdstuk(cms.selectedHoofdstukId, {
                        title: newValue,
                        number: null
                      });
                      await cms.loadHoofdstukken(cms.selectedNiveauId);
                    }}
                  />
                  <button
                    onClick={() => setEditingColor({ type: 'hoofdstuk', id: cms.selectedHoofdstukId })}
                    className="ml-auto p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    title="Edit color & emoji"
                  >
                    <Palette size={20} />
                  </button>
                </div>

                {/* Color/Emoji Picker (inline) */}
                {editingColor?.type === 'hoofdstuk' && editingColor?.id === cms.selectedHoofdstukId && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <ColorEmojiPicker
                      colorId={cms.currentHoofdstuk.color}
                      emoji={cms.currentHoofdstuk.emoji}
                      itemName={cms.currentHoofdstuk.title}
                      onChange={(data) => handleSaveColorEmoji('hoofdstuk', cms.selectedHoofdstukId, data)}
                      onClose={() => setEditingColor(null)}
                    />
                  </div>
                )}
                <p className="mb-6 text-sm text-[var(--helix-muted)]">{cms.currentHoofdstuk.description || 'Geen beschrijving'}</p>
                <div className="helix-alert mb-6 p-4">
                  <p className="text-sm"><strong>Paragrafen:</strong> {cms.paragrafen.length}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCreateModal({ type: 'paragraaf', parentId: cms.selectedHoofdstukId })}
                    className="btn-primary px-4 py-2 text-sm">
                    <Plus size={16} />
                    Voeg Paragraaf toe
                  </button>
                  <button
                    onClick={() => handleArchive('hoofdstuk', cms.selectedHoofdstukId)}
                    disabled={archiveLoading}
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
                    <Trash2 size={16} />
                    Archiveren
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PARAGRAAF Detail Panel with Lesson Route Builder */}
          {!cms.loading && !cms.error && cms.selectedParagraafId && (!cms.selectedVraagId || !showLegacyQuestionPanel) && cms.currentParagraaf && (
            <ContentBlockBuilder
              paragraaf={cms.currentParagraaf}
              blocks={cms.contentBlocks}
              vragen={cms.vragen}
              sidebarOpen={sidebarOpen}
              onRefresh={async () => {
                await cms.loadContentBlocks(cms.selectedParagraafId);
                await cms.loadVragen(cms.selectedParagraafId);
              }}
              onEditVraag={(vraagId) => {
                cms.setVraag(vraagId);
                setIsEditing(true);
              }}
            />
          )}

          {!showLegacyQuestionPanel && isEditing && cms.selectedVraagId && cms.currentVraag && (
            <div className="fixed inset-0 z-[950] bg-white">
              <DualPanelEditor
                vraag={cms.currentVraag}
                paragraafId={cms.selectedParagraafId}
                paragraafCode={cms.currentParagraaf?.code}
                onSave={() => {
                  setIsEditing(false);
                  cms.setVraag(null);
                  cms.loadVragen(cms.selectedParagraafId);
                  cms.loadContentBlocks(cms.selectedParagraafId);
                }}
                onCancel={() => {
                  setIsEditing(false);
                  cms.setVraag(null);
                }}
              />
            </div>
          )}

          {/* Legacy paragraaf question panel (replaced by lesson route builder) */}
          {showLegacyParagraafPanel && !cms.loading && !cms.error && cms.selectedParagraafId && !cms.selectedVraagId && cms.currentParagraaf && (
            <div className="max-w-4xl">
              <div className="helix-surface p-8">
                <InlineEdit
                  value={`${cms.currentParagraaf.code}. ${cms.currentParagraaf.title}`}
                  onSave={async (newValue) => {
                    // Parse code and title from input (format: "7.1. Rechthoekige driehoeken")
                    const parts = newValue.match(/^([\d.]+)\.\s*(.+)$/);
                    if (parts) {
                      await cmsService.updateParagraaf(cms.selectedParagraafId, {
                        code: parts[1],
                        title: parts[2]
                      });
                      await cms.loadParagrafen(cms.selectedHoofdstukId);
                    }
                  }}
                />
                <p className="text-gray-500 text-sm mb-8">{cms.currentParagraaf.beschrijving}</p>

                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-8 border border-gray-100">
                  <div>
                    <p className="text-sm text-gray-600">Questions in this paragraph</p>
                    <p className="text-2xl font-bold text-gray-900">{cms.vragen.length}</p>
                  </div>
                  <div className="text-4xl text-gray-300">❓</div>
                </div>

                <div>
                  <button
                    onClick={() => {}}
                    className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
                    <Plus size={16} />
                    Add Question
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VRAAG Edit/View Mode */}
          {showLegacyQuestionPanel && !cms.loading && !cms.error && cms.selectedVraagId && cms.currentVraag && (
            <>
              {isEditing ? (
                // Dual-panel edit mode
                <DualPanelEditor
                  vraag={cms.currentVraag}
                  paragraafId={cms.selectedParagraafId}
                  paragraafCode={cms.currentParagraaf?.code}
                  onSave={() => {
                    setIsEditing(false);
                    cms.loadVragen(cms.selectedParagraafId);
                    cms.loadContentBlocks(cms.selectedParagraafId);
                  }}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                // Read-only mode
                <div className="max-w-4xl">
                  <div className="helix-surface p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-1">
                        Vraag {cms.currentVraag.number}
                      </h2>
                      <p className="text-gray-500 text-sm">{cms.currentVraag.title}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                        {cms.currentVraag.vraagtype}
                      </span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        cms.currentVraag.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {cms.currentVraag.status || 'draft'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-8 pb-8 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Question Content</h3>
                    <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none">
                      {cms.currentVraag.content?.text ? (
                        <div dangerouslySetInnerHTML={{ __html: cms.currentVraag.content.text }} />
                      ) : (
                        <p className="text-gray-400 italic">No content added yet</p>
                      )}
                    </div>
                  </div>

                  {cms.currentVraag.vraagMetadata && (
                    <div className="mb-8 pb-8 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Settings</h3>
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Difficulty</p>
                          <p className="text-lg">{'⭐'.repeat(cms.currentVraag.vraagMetadata.difficulty || 3)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Calculator</p>
                          <p className="text-sm font-medium text-gray-900">
                            {cms.currentVraag.vraagMetadata.showCalculator ? '✓ Enabled' : '✗ Disabled'}
                          </p>
                        </div>
                        {cms.currentVraag.vraagMetadata.hints?.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Hints</p>
                            <p className="text-sm font-medium text-gray-900">{cms.currentVraag.vraagMetadata.hints.length} hint{cms.currentVraag.vraagMetadata.hints.length !== 1 ? 's' : ''}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-primary px-6 py-2 text-sm">
                      ✏️ Edit Question
                    </button>
                  </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!cms.loading && !cms.error && !cms.selectedVakId && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-lg font-bold text-[var(--helix-muted)]">Kies links lesstof om te starten</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Content Modal (for vak, leerjaar, niveau, hoofdstuk, paragraaf) */}
      {createModal && (
        <CreateContentModal
          type={createModal.type}
          parentId={createModal.parentId}
          onCreated={async (newId, type) => {
            // Refresh parent data and auto-select new item
            switch (type) {
              case 'vak':
                await cms.loadVakken();
                cms.setVak(newId);
                break;
              case 'leerjaar':
                await cms.loadLeerjaren(createModal.parentId);
                cms.setLeerjaar(newId);
                break;
              case 'niveau':
                await cms.loadNiveaus(createModal.parentId);
                cms.setNiveau(newId);
                break;
              case 'hoofdstuk':
                await cms.loadHoofdstukken(createModal.parentId);
                cms.setHoofdstuk(newId);
                break;
              case 'paragraaf':
                await cms.loadParagrafen(createModal.parentId);
                cms.setParagraaf(newId);
                break;
              default:
                break;
            }
            setCreateModal(null);
          }}
          onClose={() => setCreateModal(null)}
        />
      )}

    </>
  );
}
