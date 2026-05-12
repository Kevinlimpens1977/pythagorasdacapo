import React, { useEffect, useState } from 'react';
import { Plus, Settings, Trash2, Users, BookMarked, ChevronDown } from 'lucide-react';
import * as klasService from '../services/klasService';
import * as cmsService from '../services/cmsService';
import { useAuth } from '../components/auth/AuthProvider';

export default function AdminKlassenPage() {
  const { currentUser } = useAuth();
  const [klassen, setKlassen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newClassName, setNewClassName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedKlasId, setSelectedKlasId] = useState(null);
  const [klassesWithStudents, setKlassesWithStudents] = useState({});
  const [cmsContent, setCmsContent] = useState({});
  const [contentLoading, setContentLoading] = useState(false);
  const [expandedHoofdstukken, setExpandedHoofdstukken] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Load all classes
  const loadKlassen = async () => {
    try {
      setLoading(true);
      const data = await klasService.getAvailableKlassen();
      setKlassen(data);

      // Load student counts
      const studentsMap = {};
      for (const klas of data) {
        const students = await klasService.getKlasStudents(klas.id);
        studentsMap[klas.id] = students;
      }
      setKlassesWithStudents(studentsMap);
    } catch (err) {
      console.error('Error loading classes:', err);
      setError('Kon klassen niet laden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKlassen();
    loadCmsContent();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim() || !currentUser?.uid) return;

    try {
      setCreating(true);
      setError(null);
      await klasService.createKlas(newClassName.trim(), currentUser.uid);
      setNewClassName('');
      await loadKlassen();
    } catch (err) {
      console.error('Error creating class:', err);
      setError(err.message || 'Kon klas niet aanmaken');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClass = async (klasId) => {
    if (!window.confirm('Weet je zeker dat je deze klas wilt verwijderen?')) return;

    try {
      await klasService.deleteKlas(klasId);
      if (selectedKlasId === klasId) {
        setSelectedKlasId(null);
      }
      await loadKlassen();
    } catch (err) {
      console.error('Error deleting class:', err);
      setError(err.message || 'Kon klas niet verwijderen');
    }
  };

  const handleToggleSetting = async (klasId, setting) => {
    try {
      const klas = klassen.find(k => k.id === klasId);
      if (!klas) return;

      const newSettings = {
        ...klas.settings,
        [setting]: !klas.settings[setting]
      };

      await klasService.updateKlasSettings(klasId, newSettings);
      await loadKlassen();
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err.message || 'Kon instelling niet bijwerken');
    }
  };

  // Load CMS content hierarchy (Vak > Leerjaar > Niveau > Hoofdstuk > Paragraaf)
  const loadCmsContent = async () => {
    try {
      setContentLoading(true);
      const vakken = await cmsService.getVakken();

      const content = {};
      for (const vak of vakken) {
        const leerjaren = await cmsService.getLeerjaren(vak.id);
        content[vak.id] = { vak, leerjaren: {} };

        for (const leerjaar of leerjaren) {
          const niveaus = await cmsService.getNiveaus(leerjaar.id);
          content[vak.id].leerjaren[leerjaar.id] = { leerjaar, niveaus: {} };

          for (const niveau of niveaus) {
            const hoofdstukken = await cmsService.getHoofdstukken(niveau.id);
            content[vak.id].leerjaren[leerjaar.id].niveaus[niveau.id] = { niveau, hoofdstukken: {} };

            for (const hoofdstuk of hoofdstukken) {
              const paragrafen = await cmsService.getParagrafen(hoofdstuk.id);
              content[vak.id].leerjaren[leerjaar.id].niveaus[niveau.id].hoofdstukken[hoofdstuk.id] = {
                hoofdstuk,
                paragrafen: paragrafen || []
              };
            }
          }
        }
      }
      setCmsContent(content);
    } catch (err) {
      console.error('Error loading CMS content:', err);
      setError('Kon content niet laden');
    } finally {
      setContentLoading(false);
    }
  };

  // Toggle paragraph for class
  const handleToggleParagraaf = async (klasId, paragraafId) => {
    try {
      const klas = klassen.find(k => k.id === klasId);
      if (!klas) return;

      const currentParagrafen = klas.enabledParagrafen || [];
      const newParagrafen = currentParagrafen.includes(paragraafId)
        ? currentParagrafen.filter(id => id !== paragraafId)
        : [...currentParagrafen, paragraafId];

      await klasService.updateKlasEnabledParagrafen(klasId, newParagrafen);
      await loadKlassen();
    } catch (err) {
      console.error('Error updating paragraaf:', err);
      setError(err.message || 'Kon paragraaf niet bijwerken');
    }
  };

  // Toggle all paragraphs in a chapter
  const handleToggleHoofdstuk = async (klasId, hoofdstukId) => {
    try {
      const klas = klassen.find(k => k.id === klasId);
      if (!klas) return;

      const paragraafIds = getAllParagrafenForHoofdstuk(hoofdstukId);
      const currentParagrafen = klas.enabledParagrafen || [];

      const allEnabled = paragraafIds.every(id => currentParagrafen.includes(id));

      let newParagrafen;
      if (allEnabled) {
        // Disable all
        newParagrafen = currentParagrafen.filter(id => !paragraafIds.includes(id));
      } else {
        // Enable all
        newParagrafen = [...new Set([...currentParagrafen, ...paragraafIds])];
      }

      await klasService.updateKlasEnabledParagrafen(klasId, newParagrafen);
      await loadKlassen();
    } catch (err) {
      console.error('Error updating hoofdstuk:', err);
      setError(err.message || 'Kon hoofdstuk niet bijwerken');
    }
  };

  // Get all paragraph IDs for a chapter
  const getAllParagrafenForHoofdstuk = (hoofdstukId) => {
    const result = [];
    Object.values(cmsContent).forEach(vak => {
      Object.values(vak.leerjaren).forEach(leerjaar => {
        Object.values(leerjaar.niveaus).forEach(niveau => {
          if (niveau.hoofdstukken[hoofdstukId]?.paragrafen) {
            result.push(...niveau.hoofdstukken[hoofdstukId].paragrafen.map(p => p.id));
          }
        });
      });
    });
    return result;
  };

  // Set student override for extra content
  const handleSetStudentOverride = async (klasId, studentUid, extraParagraafIds) => {
    try {
      if (extraParagraafIds.length === 0) {
        await klasService.removeStudentOverride(klasId, studentUid);
      } else {
        await klasService.setStudentOverride(klasId, studentUid, extraParagraafIds);
      }
      await loadKlassen();
      setSelectedStudent(null);
    } catch (err) {
      console.error('Error setting student override:', err);
      setError(err.message || 'Kon student override niet bijwerken');
    }
  };

  const selectedKlas = klassen.find(k => k.id === selectedKlasId);
  const selectedStudents = selectedKlasId ? klassesWithStudents[selectedKlasId] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
        <h1 className="text-2xl font-bold text-gray-900">📚 Klassen Beheer</h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {/* Create Class Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus size={20} /> Nieuwe Klas Aanmaken
          </h2>
          <form onSubmit={handleCreateClass} className="flex gap-3">
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Bijv. VMBO 1A"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              disabled={creating}
            />
            <button
              type="submit"
              disabled={creating || !newClassName.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? 'Aanmaken...' : 'Aanmaken'}
            </button>
          </form>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-3 gap-8">
          {/* Classes List */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">
                  Klassen ({klassen.length})
                </h3>
              </div>

              {loading ? (
                <div className="p-6 space-y-2">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="h-12 bg-gray-200 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : klassen.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Geen klassen aangemaakt
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {klassen.map(klas => (
                    <button
                      key={klas.id}
                      onClick={() => setSelectedKlasId(klas.id)}
                      className={`w-full text-left px-6 py-4 transition-colors ${
                        selectedKlasId === klas.id
                          ? 'bg-blue-50 border-l-4 border-blue-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{klas.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {klassesWithStudents[klas.id]?.length || 0} studenten
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Class Details */}
          <div className="col-span-2">
            {selectedKlas ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedKlas.name}
                    </h3>
                    <p className="text-sm text-gray-500">Code: {selectedKlas.code}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteClass(selectedKlas.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Klas verwijderen"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Settings */}
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Settings size={16} /> Instellingen
                  </h4>

                  <div className="space-y-3">
                    {[
                      {
                        key: 'hintsEnabled',
                        label: '💡 Hints beschikbaar',
                        description: 'Studenten kunnen hints zien'
                      },
                      {
                        key: 'aiEnabled',
                        label: '🤖 AI Hulp beschikbaar',
                        description: 'Studenten kunnen AI tutor gebruiken'
                      },
                      {
                        key: 'calculatorEnabled',
                        label: '🧮 Rekenmachine beschikbaar',
                        description: 'Studenten kunnen rekenmachine gebruiken'
                      }
                    ].map(setting => (
                      <label
                        key={setting.key}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedKlas.settings[setting.key]}
                          onChange={() => handleToggleSetting(selectedKlas.id, setting.key)}
                          className="w-5 h-5 rounded cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{setting.label}</div>
                          <div className="text-sm text-gray-500">
                            {setting.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Beschikbare Content (CMS) */}
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BookMarked size={16} /> Lesstof Toewijzing
                  </h4>

                  {contentLoading ? (
                    <div className="text-sm text-gray-500">Content laden...</div>
                  ) : Object.keys(cmsContent).length === 0 ? (
                    <div className="text-sm text-gray-500">Geen content beschikbaar</div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {Object.entries(cmsContent).map(([vakId, vakData]) => (
                        <div key={vakId} className="border border-gray-200 rounded-lg">
                          {/* Vak Header */}
                          <div className="bg-gray-50 px-4 py-3 font-semibold text-gray-900">
                            {vakData.vak?.title || 'Vak'}
                          </div>

                          {/* Leerjaren */}
                          <div className="divide-y">
                            {Object.entries(vakData.leerjaren).map(([leerjaargId, leerjaargData]) => (
                              <div key={leerjaargId} className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-700 mb-3">
                                  📚 {leerjaargData.leerjaar?.title || `Leerjaar ${leerjaargData.leerjaar?.year}`}
                                </div>

                                {/* Niveaus */}
                                <div className="space-y-3 ml-4">
                                  {Object.entries(leerjaargData.niveaus).map(([niveauId, niveauData]) => (
                                    <div key={niveauId}>
                                      <div className="text-xs font-semibold text-gray-600 mb-2">
                                        {niveauData.niveau?.title || 'Niveau'}
                                      </div>

                                      {/* Hoofdstukken */}
                                      <div className="space-y-2 ml-3">
                                        {Object.entries(niveauData.hoofdstukken).map(([hoofdstukId, { hoofdstuk, paragrafen }]) => {
                                          const currentParagrafen = selectedKlas?.enabledParagrafen || [];
                                          const paragraafIds = paragrafen.map(p => p.id);
                                          const allEnabled = paragraafIds.every(id => currentParagrafen.includes(id));
                                          const someEnabled = paragraafIds.some(id => currentParagrafen.includes(id));

                                          return (
                                            <div key={hoofdstukId}>
                                              {/* Hoofdstuk Toggle */}
                                              <div className="flex items-center gap-2 mb-2">
                                                <button
                                                  onClick={() => setExpandedHoofdstukken(prev => ({
                                                    ...prev,
                                                    [hoofdstukId]: !prev[hoofdstukId]
                                                  }))}
                                                  className="p-1 hover:bg-gray-100 rounded"
                                                >
                                                  <ChevronDown
                                                    size={16}
                                                    className={`transition-transform ${expandedHoofdstukken[hoofdstukId] ? 'rotate-180' : ''}`}
                                                  />
                                                </button>
                                                <label className="flex items-center gap-2 flex-1 cursor-pointer">
                                                  <input
                                                    type="checkbox"
                                                    checked={allEnabled}
                                                    onChange={() => handleToggleHoofdstuk(selectedKlas.id, hoofdstukId)}
                                                    className="w-4 h-4 rounded"
                                                  />
                                                  <span className="text-sm font-medium text-gray-800">
                                                    {hoofdstuk?.number && `${hoofdstuk.number}. `}{hoofdstuk?.title}
                                                  </span>
                                                </label>
                                              </div>

                                              {/* Paragrafen */}
                                              {expandedHoofdstukken[hoofdstukId] && (
                                                <div className="ml-6 space-y-1 mb-3">
                                                  {paragrafen.map(paragraaf => {
                                                    const isEnabled = currentParagrafen.includes(paragraaf.id);
                                                    return (
                                                      <label
                                                        key={paragraaf.id}
                                                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded text-sm"
                                                      >
                                                        <input
                                                          type="checkbox"
                                                          checked={isEnabled}
                                                          onChange={() => handleToggleParagraaf(selectedKlas.id, paragraaf.id)}
                                                          className="w-4 h-4 rounded"
                                                        />
                                                        <span className="text-gray-700">
                                                          {paragraaf.number && `${paragraaf.number}. `}{paragraaf.title}
                                                        </span>
                                                      </label>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Students */}
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users size={16} /> Studenten ({selectedStudents.length})
                  </h4>

                  {selectedStudents.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      Nog geen studenten in deze klas
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {selectedStudents.map(student => (
                        <button
                          key={student.uid}
                          onClick={() => setSelectedStudent(selectedStudent?.uid === student.uid ? null : student)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                            selectedStudent?.uid === student.uid
                              ? 'bg-blue-50 border-2 border-blue-300'
                              : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                          }`}
                        >
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              {student.displayName || 'Geen naam'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {student.email}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {selectedStudent?.uid === student.uid ? '👇' : '👉'}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Student Override Panel */}
                  {selectedStudent && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <h5 className="font-semibold text-gray-900 mb-3">
                        Extra taken voor {selectedStudent.displayName}
                      </h5>
                      <p className="text-xs text-gray-600 mb-3">
                        Selecteer aanvullende taken boven op de klasinstelling
                      </p>

                      <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                        {Object.entries(cmsContent).flatMap(([vakId, vakData]) =>
                          Object.entries(vakData.leerjaren).flatMap(([leerjaargId, leerjaargData]) =>
                            Object.entries(leerjaargData.niveaus).flatMap(([niveauId, niveauData]) =>
                              Object.entries(niveauData.hoofdstukken).flatMap(([hoofdstukId, { paragrafen }]) =>
                                paragrafen.map(paragraaf => {
                                  const classDefault = selectedKlas?.enabledParagrafen?.includes(paragraaf.id) || false;
                                  const override = selectedKlas?.studentOverrides?.[selectedStudent.uid]?.extraParagrafen?.includes(paragraaf.id) || false;

                                  return (
                                    <label
                                      key={paragraaf.id}
                                      className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer text-sm"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={override}
                                        onChange={(e) => {
                                          const current = selectedKlas?.studentOverrides?.[selectedStudent.uid]?.extraParagrafen || [];
                                          let updated;
                                          if (e.target.checked) {
                                            updated = [...new Set([...current, paragraaf.id])];
                                          } else {
                                            updated = current.filter(id => id !== paragraaf.id);
                                          }
                                          handleSetStudentOverride(selectedKlas.id, selectedStudent.uid, updated);
                                        }}
                                        className="w-4 h-4 rounded"
                                      />
                                      <span className={override ? 'font-medium text-gray-900' : 'text-gray-700'}>
                                        {paragraaf.number && `${paragraaf.number}. `}{paragraaf.title}
                                      </span>
                                      {classDefault && <span className="text-xs bg-gray-300 px-2 py-0.5 rounded">Klas</span>}
                                    </label>
                                  );
                                })
                              )
                            )
                          )
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedStudent(null)}
                        className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium text-gray-900 transition-colors"
                      >
                        Gereed
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
                Selecteer een klas om details te zien
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
