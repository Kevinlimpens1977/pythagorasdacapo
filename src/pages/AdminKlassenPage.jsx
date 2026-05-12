import React, { useEffect, useState } from 'react';
import { Plus, Settings, Trash2, Users, BookMarked } from 'lucide-react';
import * as klasService from '../services/klasService';
import { useAuth } from '../components/auth/AuthProvider';
import { CHAPTERS } from '../data/chapters';

export default function AdminKlassenPage() {
  const { currentUser } = useAuth();
  const [klassen, setKlassen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newClassName, setNewClassName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedKlasId, setSelectedKlasId] = useState(null);
  const [klassesWithStudents, setKlassesWithStudents] = useState({});

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

  const handleToggleChapter = async (klasId, chapterId) => {
    try {
      const klas = klassen.find(k => k.id === klasId);
      if (!klas) return;

      const newEnabledChapters = {
        ...klas.enabledChapters,
        [chapterId]: !klas.enabledChapters[chapterId]
      };

      await klasService.updateKlasChapters(klasId, newEnabledChapters);
      await loadKlassen();
    } catch (err) {
      console.error('Error updating chapters:', err);
      setError(err.message || 'Kon chapters niet bijwerken');
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

                {/* Beschikbare Chapters */}
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BookMarked size={16} /> Beschikbare Chapters
                  </h4>

                  <div className="space-y-2">
                    {CHAPTERS.map(chapter => (
                      <label
                        key={chapter.id}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedKlas.enabledChapters?.[chapter.id] || false}
                          onChange={() => handleToggleChapter(selectedKlas.id, chapter.id)}
                          className="w-5 h-5 rounded cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{chapter.title}</div>
                        </div>
                      </label>
                    ))}
                  </div>
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
                        <div
                          key={student.uid}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-gray-900">
                              {student.displayName || 'Geen naam'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      ))}
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
