/**
 * CmsShell Component
 * Main layout for CMS
 * Left: Navigation tree
 * Right: Content editor or detail panel
 */

import React, { useState } from 'react';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import NavigationTree from './NavigationTree';
import DualPanelEditor from './DualPanelEditor';
import CreateQuestionModal from './CreateQuestionModal';
import CreateContentModal from './CreateContentModal';
import InlineEdit from './InlineEdit';
import useCms from '../../hooks/useCms';
import * as cmsService from '../../services/cmsService';
import { auth } from '../../services/firebase';

export default function CmsShell() {
  const cms = useCms();
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModal, setCreateModal] = useState(null); // { type, parentId }
  const [archiveLoading, setArchiveLoading] = useState(false);

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
      localStorage.setItem('cms-sidebar-open', JSON.stringify(newState));
      return newState;
    });
  };

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
        cms.setParagraaf(selection.id);
        break;
      case 'vraag':
        cms.setVraag(selection.id);
        break;
      default:
        break;
    }
  };

  // Handle archiving
  const handleArchive = async (type, id) => {
    if (!window.confirm(`Are you sure you want to archive this ${type}?`)) {
      return;
    }

    try {
      setArchiveLoading(true);
      switch (type) {
        case 'vak':
          await cmsService.archiveVak(id);
          cms.loadVakken();
          break;
        case 'leerjaar':
          await cmsService.archiveLeerjaar(id);
          cms.loadLeerjaren(cms.selectedVakId);
          break;
        case 'niveau':
          await cmsService.archiveNiveau(id);
          cms.loadNiveaus(cms.selectedLeerjaarId);
          break;
        case 'hoofdstuk':
          await cmsService.archiveHoofdstuk(id);
          cms.loadHoofdstukken(cms.selectedNiveauId);
          break;
        default:
          break;
      }
    } catch (err) {
      alert('Error archiving: ' + err.message);
    } finally {
      setArchiveLoading(false);
    }
  };

  // Build breadcrumb
  const breadcrumbItems = [
    cms.currentVak && { label: cms.currentVak.name, id: cms.selectedVakId },
    cms.currentLeerjaar && { label: `Jaar ${cms.currentLeerjaar.year}`, id: cms.selectedLeerjaarId },
    cms.currentNiveau && { label: cms.currentNiveau.label, id: cms.selectedNiveauId },
    cms.currentHoofdstuk && { label: `${cms.currentHoofdstuk.number}. ${cms.currentHoofdstuk.title}`, id: cms.selectedHoofdstukId },
    cms.currentParagraaf && { label: `${cms.currentParagraaf.code} ${cms.currentParagraaf.title}`, id: cms.selectedParagraafId },
    cms.currentVraag && { label: `Vraag ${cms.currentVraag.number}`, id: cms.selectedVraagId }
  ].filter(Boolean);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex items-start justify-between">
        <div className="flex-1 flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">📚 CMS Platform</h1>

          {/* Header Toggle - Visible when sidebar open */}
          {sidebarOpen && (
            <button
              onClick={handleToggleSidebar}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              title="Collapse sidebar"
            >
              ◄
            </button>
          )}
        </div>

        {/* Breadcrumb */}
        {breadcrumbItems.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {breadcrumbItems.map((item, idx) => (
              <React.Fragment key={item.id}>
                <span className="truncate max-w-xs">{item.label}</span>
                {idx < breadcrumbItems.length - 1 && (
                  <ChevronRight size={16} className="flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Toggle Button - Fixed Left Edge (when sidebar closed) */}
        {!sidebarOpen && (
          <button
            onClick={handleToggleSidebar}
            className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-r-lg transition-all"
            title="Expand sidebar"
          >
            ►
          </button>
        )}

        {/* Left Sidebar - Navigation Tree (Collapsible) */}
        <div className={`
          border-r border-gray-200 bg-white overflow-y-auto transition-all duration-300 ease-in-out flex-shrink-0
          ${sidebarOpen ? 'w-80' : 'w-0'}
        `}>
          <NavigationTree
            vakken={cms.vakken}
            leerjaren={cms.leerjaren}
            niveaus={cms.niveaus}
            hoofdstukken={cms.hoofdstukken}
            paragrafen={cms.paragrafen}
            vragen={cms.vragen}
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
            onCreateVraag={(paragraafId) => {
              cms.setParagraaf(paragraafId);
              setShowCreateModal(true);
            }}
          />
        </div>

        {/* Right Panel - Content Editor or Detail Panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {cms.loading && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading...</p>
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">📚 {cms.currentVak.name}</h2>
                <p className="text-gray-600 text-sm mb-6">{cms.currentVak.description || 'No description'}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCreateModal({ type: 'leerjaar', parentId: cms.selectedVakId })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">📅 Jaar {cms.currentLeerjaar.year}</h2>
                <p className="text-gray-600 text-sm mb-6">{cms.currentLeerjaar.label || ''}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCreateModal({ type: 'niveau', parentId: cms.selectedLeerjaarId })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">📊 {cms.currentNiveau.label}</h2>
                <p className="text-gray-600 text-sm mb-6">{cms.currentNiveau.description || 'No description'}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCreateModal({ type: 'hoofdstuk', parentId: cms.selectedNiveauId })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex items-start gap-3 mb-6">
                  <span className="text-3xl">📖</span>
                  <InlineEdit
                    value={`${cms.currentHoofdstuk.number}. ${cms.currentHoofdstuk.title}`}
                    onSave={async (newValue) => {
                      // Parse number and title from input (format: "7. Stelling van Pythagoras")
                      const parts = newValue.match(/^(\d+)\.\s*(.+)$/);
                      if (parts) {
                        await cmsService.updateHoofdstuk(cms.selectedHoofdstukId, {
                          number: parseInt(parts[1]),
                          title: parts[2]
                        });
                        await cms.loadHoofdstukken(cms.selectedNiveauId);
                      }
                    }}
                  />
                </div>
                <p className="text-gray-600 text-sm mb-6">{cms.currentHoofdstuk.description || 'No description'}</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-900"><strong>Paragrafen:</strong> {cms.paragrafen.length}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCreateModal({ type: 'paragraaf', parentId: cms.selectedHoofdstukId })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
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

          {/* PARAGRAAF Detail Panel with Questions */}
          {!cms.loading && !cms.error && cms.selectedParagraafId && !cms.selectedVraagId && cms.currentParagraaf && (
            <div className="max-w-4xl">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
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
                    onClick={() => setShowCreateModal(true)}
                    className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
                    <Plus size={16} />
                    Add Question
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VRAAG Edit/View Mode */}
          {!cms.loading && !cms.error && cms.selectedVraagId && cms.currentVraag && (
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
                  }}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                // Read-only mode
                <div className="max-w-4xl">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
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
                      className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm">
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
                <p className="text-gray-500 text-lg">Select content from the tree to get started</p>
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

      {/* Create Question Modal */}
      {showCreateModal && (
        <CreateQuestionModal
          paragraafId={cms.selectedParagraafId}
          existingVragen={cms.vragen}
          onQuestionCreated={async (vraagId) => {
            // Wait for vragen to load before selecting
            await cms.loadVragen(cms.selectedParagraafId);
            cms.setVraag(vraagId);
            // Auto-open editor for new question
            setShowCreateModal(false);
            setIsEditing(true);
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
