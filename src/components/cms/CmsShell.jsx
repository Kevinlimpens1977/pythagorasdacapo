/**
 * CmsShell Component
 * Main layout for CMS
 * Left: Navigation tree
 * Right: Content editor (placeholder for now)
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';
import NavigationTree from './NavigationTree';
import useCms from '../../hooks/useCms';

export default function CmsShell() {
  const cms = useCms();

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
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">📚 CMS Platform</h1>

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
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Navigation Tree */}
        <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
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
            onSelectVak={cms.setVak}
            onSelectLeerjaar={cms.setLeerjaar}
            onSelectNiveau={cms.setNiveau}
            onSelectHoofdstuk={cms.setHoofdstuk}
            onSelectParagraaf={cms.setParagraaf}
            onSelectVraag={cms.setVraag}
            loading={cms.loading}
          />
        </div>

        {/* Right Panel - Content Editor */}
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

          {!cms.loading && !cms.error && cms.selectedVraagId && cms.currentVraag && (
            <div className="max-w-4xl">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {cms.currentVraag.number}. {cms.currentVraag.title}
                </h2>

                <div className="text-sm text-gray-600 mb-6">
                  <p>Type: <span className="font-semibold text-gray-900">{cms.currentVraag.vraagtype}</span></p>
                  <p>Status: <span className="font-semibold text-gray-900">{cms.currentVraag.status || 'draft'}</span></p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Question Content</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm">
                    {cms.currentVraag.content?.text ? (
                      <div dangerouslySetInnerHTML={{ __html: cms.currentVraag.content.text }} />
                    ) : (
                      <p className="text-gray-500">No content yet</p>
                    )}
                  </div>
                </div>

                {cms.currentVraag.vraagMetadata && (
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Metadata</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Difficulty</p>
                        <p className="font-semibold text-gray-900">
                          {'⭐'.repeat(cms.currentVraag.vraagMetadata.difficulty || 3)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Calculator</p>
                        <p className="font-semibold text-gray-900">
                          {cms.currentVraag.vraagMetadata.showCalculator ? '✓ Yes' : '✗ No'}
                        </p>
                      </div>
                      {cms.currentVraag.vraagMetadata.hints?.length > 0 && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600">Hints ({cms.currentVraag.vraagMetadata.hints.length})</p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {cms.currentVraag.vraagMetadata.hints.map((hint, idx) => (
                              <li key={idx} className="text-gray-600">• {hint}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Edit Question
                  </button>
                </div>
              </div>
            </div>
          )}

          {!cms.loading && !cms.error && cms.selectedParagraafId && !cms.selectedVraagId && cms.currentParagraaf && (
            <div className="max-w-4xl">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {cms.currentParagraaf.code}. {cms.currentParagraaf.title}
                </h2>
                <p className="text-gray-600 mb-6">{cms.currentParagraaf.beschrijving}</p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900">
                    <span className="font-semibold">Questions in this paragraph:</span> {cms.vragen.length}
                  </p>
                </div>

                <div className="mt-6">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    + Add Question
                  </button>
                </div>
              </div>
            </div>
          )}

          {!cms.loading && !cms.error && !cms.selectedParagraafId && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-500 text-lg">Select a paragraph to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
