import { useCallback, useState, useEffect } from 'react';
import { Users, AlertTriangle, Search, CheckCircle, Clock, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { isAnswerCorrect } from '../../lib/answerNormalization';
import * as cmsService from '../../services/cmsService';
import * as klasService from '../../services/klasService';
import * as voortgangService from '../../services/voortgangService';
import {
  calculateAssignedProgress,
  getEffectiveContentBlocks,
  getStudentEffectiveParagrafen
} from '../../lib/assignmentUtils';
import { getLearningResultTone } from '../../lib/learningResultUtils';

// Helper functie voor relatieve tijd
function getRelativeTime(timestamp) {
  if (!timestamp) return "Nog niet";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 0) return "Nu";
  if (diffInSeconds < 60) return "Nu";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min geleden`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} uur geleden`;

  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
}

// Helper functie voor voortgangskleur
function getProgressColor(percentage) {
  if (percentage < 40) return 'bg-emerald-200';
  if (percentage < 75) return 'bg-emerald-500';
  return 'bg-emerald-700';
}

function SupportMiniBar({ records = [], paragraafId = null }) {
  const completedRecords = records.filter((record) =>
    record.completed === true &&
    (!paragraafId || record.paragraafId === paragraafId)
  );

  if (!completedRecords.length) return null;

  return (
    <div className="mt-2 flex max-w-[160px] flex-wrap gap-1" aria-label="Resultaatkwaliteit">
      {completedRecords.slice(0, 12).map((record) => {
        const tone = getLearningResultTone({
          isCorrect: record.isCorrect,
          aiHelpCount: record.aiHelpCount || 0
        });
        return (
          <span
            key={record.id || record.blockId || record.vraagId}
            className={`h-3 w-5 rounded-full border ${tone.borderClass} ${tone.fillClass}`}
            title={tone.label}
          />
        );
      })}
      {completedRecords.length > 12 && (
        <span className="text-[10px] font-black text-slate-400">+{completedRecords.length - 12}</span>
      )}
    </div>
  );
}

// Helper functie om te checken of presentatie bekeken is
function hasPresentationViewed(student, chapterId) {
  return student.presentationViewed?.[chapterId]?.hasViewed || false;
}

// Helper functie om viewedAt time te krijgen
function getPresentationViewedTime(student, chapterId) {
  const viewed = student.presentationViewed?.[chapterId];
  if (!viewed?.firstViewedAt) return null;
  return viewed.firstViewedAt.toDate ? viewed.firstViewedAt.toDate() : new Date(viewed.firstViewedAt);
}

// Helper functie voor evaluatiescore
function getEvaluationScore(student, chapterId) {
  const evalData = student.evaluationData?.[chapterId];
  if (!evalData) return null;
  const results = Object.values(evalData);
  if (results.length === 0) return null;
  const correct = results.filter(r => r.isCorrect).length;
  return { correct, total: results.length };
}

export default function ClassOverview() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewingExercise, setViewingExercise] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedChapterForClass, setSelectedChapterForClass] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [paragraphen, setParagraphen] = useState([]);
  const [contentBlocksByParagraaf, setContentBlocksByParagraaf] = useState({});
  const [klassenMap, setKlassenMap] = useState({});
  const [studentVoortgang, setStudentVoortgang] = useState({});

  // Load all paragraphs from CMS hierarchy
  useEffect(() => {
    const loadParagraphen = async () => {
      try {
        const vakken = await cmsService.getVakken();
        const allParagraphen = [];

        for (const vak of vakken) {
          const leerjaren = await cmsService.getLeerjaren(vak.id);
          for (const leerjaar of leerjaren) {
            const niveaus = await cmsService.getNiveaus(leerjaar.id);
            for (const niveau of niveaus) {
              const hoofdstukken = await cmsService.getHoofdstukken(niveau.id);
              for (const hoofdstuk of hoofdstukken) {
                const paragrafen = await cmsService.getParagrafen(hoofdstuk.id);
                allParagraphen.push(...paragrafen.map(p => ({
                  ...p,
                  vakId: vak.id,
                  leerjaarId: leerjaar.id,
                  niveauId: niveau.id,
                  hoofdstukId: hoofdstuk.id,
                  hoofdstukTitle: hoofdstuk.title
                })));
              }
            }
          }
        }

        setParagraphen(allParagraphen);
        const blockEntries = await Promise.all(
          allParagraphen.map(async (paragraaf) => {
            const blocks = await cmsService.getContentBlocks(paragraaf.id, false).catch(() => []);
            return [paragraaf.id, blocks];
          })
        );
        setContentBlocksByParagraaf(Object.fromEntries(blockEntries));
      } catch (error) {
        console.error('Error loading paragraphen:', error);
      }
    };

    loadParagraphen();
  }, []);

  useEffect(() => {
    const loadKlassen = async () => {
      try {
        const klassen = await klasService.getAvailableKlassen();
        setKlassenMap(Object.fromEntries(klassen.map((klas) => [klas.id || klas.klasId, klas])));
      } catch (error) {
        console.error('Error loading klassen for dashboard:', error);
        setKlassenMap({});
      }
    };

    loadKlassen();
  }, []);

  // Load voortgang data for all students
  const loadVoortgangForStudents = useCallback(async (studentList) => {
    try {
      const voortgangMap = {};
      for (const student of studentList) {
        if (paragraphen.length > 0) {
          const voortgang = await voortgangService.getStudentVoortgang(student.id, student.klasId);
          voortgangMap[student.id] = voortgang;
        }
      }
      setStudentVoortgang(voortgangMap);
    } catch (error) {
      console.error('Error loading voortgang:', error);
    }
  }, [paragraphen]);

  useEffect(() => {
    // Query only students (no orderBy to avoid composite index requirement)
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'student')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by lastActive in JavaScript instead of Firebase query
      studentData.sort((a, b) => {
        const dateA = a.lastActive?.toDate ? a.lastActive.toDate() : new Date(a.lastActive || 0);
        const dateB = b.lastActive?.toDate ? b.lastActive.toDate() : new Date(b.lastActive || 0);
        return dateB - dateA;
      });

      setStudents(studentData);
      setLoading(false);
      loadVoortgangForStudents(studentData);
      setSelectedStudent((current) => {
        if (!current) return current;
        return studentData.find(s => s.id === current.id) || current;
      });
    }, (error) => {
      console.error("Error fetching students:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadVoortgangForStudents]);

  const getStudentAssignmentSummary = useCallback((student, paragraafFilterId = null) => {
    const klasData = klassenMap[student.klasId];
    if (!klasData) {
      return {
        assignedItems: 0,
        startedItems: 0,
        completedItems: 0,
        percentage: 0,
        startedPercentage: 0
      };
    }

    const effectiveParagraafIds = getStudentEffectiveParagrafen(klasData, student.id);
    const targetParagrafen = paragraphen.filter((paragraaf) =>
      effectiveParagraafIds.includes(paragraaf.id) &&
      (!paragraafFilterId || paragraaf.id === paragraafFilterId)
    );
    const assignments = targetParagrafen.map((paragraaf) => ({
      paragraafId: paragraaf.id,
      blocks: getEffectiveContentBlocks(
        klasData,
        student.id,
        paragraaf.id,
        contentBlocksByParagraaf[paragraaf.id] || []
      )
    }));

    return calculateAssignedProgress({
      assignments,
      progressRecords: studentVoortgang[student.id] || []
    });
  }, [contentBlocksByParagraaf, klassenMap, paragraphen, studentVoortgang]);

  const filteredStudents = students
    .filter(s =>
      (s.displayName || "Naamloos").toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let compareValue = 0;

      if (sortBy === "name") {
        const nameA = (a.displayName || "Naamloos").toLowerCase();
        const nameB = (b.displayName || "Naamloos").toLowerCase();
        compareValue = nameA.localeCompare(nameB);
      } else if (sortBy === "total") {
        compareValue = getStudentAssignmentSummary(a).percentage - getStudentAssignmentSummary(b).percentage;
      } else if (sortBy === "chapter") {
        compareValue = getStudentAssignmentSummary(a, selectedChapterForClass).percentage - getStudentAssignmentSummary(b, selectedChapterForClass).percentage;
      }

      return sortDirection === "asc" ? compareValue : -compareValue;
    });

  const activeCount = students.filter(s => {
    if (!s.lastActive) return false;
    const date = s.lastActive.toDate ? s.lastActive.toDate() : new Date(s.lastActive);
    const diffInMinutes = (new Date() - date) / (1000 * 60);
    return diffInMinutes < 15;
  }).length;

  const warningCount = students.filter((student) => {
    const summary = getStudentAssignmentSummary(student);
    return summary.assignedItems > 0 && summary.completedItems === 0;
  }).length;

  // Calculate average progress from assigned work, not from loose progress records.
  const avgProgress = students.length > 0
    ? Math.round(
        students.reduce((acc, student) => {
          return acc + getStudentAssignmentSummary(student).percentage;
        }, 0) / students.length
      )
    : 0;

  if (loading) {
    return (
      <div className="mx-auto flex h-64 w-full max-w-7xl flex-col items-center justify-center gap-4 px-6 text-[var(--helix-muted)] md:px-8">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-fuchsia-100 border-t-[var(--helix-purple)]"></div>
        <p className="font-medium">Leerlinggegevens laden...</p>
      </div>
    );
  }

  if (selectedStudent) {
    // Group paragraphs by hoofdstuk
    const paragraafsByHoofdstuk = {};
    paragraphen.forEach(paragraaf => {
      const key = paragraaf.hoofdstukId;
      if (!paragraafsByHoofdstuk[key]) {
        paragraafsByHoofdstuk[key] = [];
      }
      paragraafsByHoofdstuk[key].push(paragraaf);
    });

    // Filter by selected chapter if set
    const filteredHoofdstukken = selectedChapter
      ? Object.fromEntries(Object.entries(paragraafsByHoofdstuk).filter(([key]) => key === selectedChapter))
      : paragraafsByHoofdstuk;

    // Calculate overall progress from assigned work.
    const overallAssignmentSummary = getStudentAssignmentSummary(selectedStudent);
    const overallProgress = overallAssignmentSummary.percentage;

    return (
      <div className="helix-container animate-in fade-in slide-in-from-right-8 duration-500">
        <button
          onClick={() => {
            setSelectedStudent(null);
            setSelectedChapter(null);
          }}
          className="mb-8 flex items-center gap-2 font-bold text-[var(--helix-muted)] transition-colors hover:text-[var(--helix-navy)]"
        >
          <Search className="rotate-180" size={20} /> Terug naar overzicht
        </button>

        <div className="helix-surface mb-8 overflow-hidden">
          <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden bg-[var(--helix-navy)] pad-content text-white md:flex-row md:items-center">
            <div className="helix-login-visual-bg absolute inset-0 opacity-70" />
            <div className="relative flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-blue-500 flex items-center justify-center text-3xl font-black">
                {(selectedStudent.displayName || "N").charAt(0)}
              </div>
              <div>
                <h2 className="font-display text-4xl font-extrabold">{selectedStudent.displayName || "Naamloos"}</h2>
                <p className="text-slate-400 text-lg">{selectedStudent.email}</p>
              </div>
            </div>
            <div className="relative flex gap-4">
              <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10">
                <div className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Voortgang</div>
                <div className="text-2xl font-black text-blue-400">{overallProgress}%</div>
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10">
                <div className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Laatst Actief</div>
                <div className="text-2xl font-black">{getRelativeTime(selectedStudent.lastActive)}</div>
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10">
                <div className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Klaar</div>
                <div className="text-2xl font-black text-emerald-400">
                  {overallAssignmentSummary.completedItems}/{overallAssignmentSummary.assignedItems}
                </div>
              </div>
            </div>
          </div>

          <div className="pad-content">
            <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <h3 className="heading-lg">Voortgang per Paragraaf</h3>

              <div className="w-full md:w-64">
                <label className="block text-sm font-bold text-slate-600 mb-2">Filteren op Hoofdstuk</label>
                <select
                  value={selectedChapter || ""}
                  onChange={(e) => setSelectedChapter(e.target.value || null)}
                  className="input-standard w-full"
                >
                  <option value="">Alles tonen</option>
                  {Object.entries(paragraafsByHoofdstuk).map(([hId, paras]) => {
                    const title = paras[0]?.hoofdstukTitle || `Hoofdstuk ${hId}`;
                    return (
                      <option key={hId} value={hId}>
                        {title}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="space-y-8">
              {Object.entries(filteredHoofdstukken).map(([hoofdstukId, paragrafen]) => {
                const firstPara = paragrafen[0];
                const hoofdstukTitle = firstPara?.hoofdstukTitle || `Hoofdstuk`;

                return (
                  <div key={hoofdstukId}>
                    <h4 className="text-xl font-black text-slate-600 mb-4 flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      {hoofdstukTitle}
                    </h4>

                    <div className="space-y-3 ml-4">
                      {paragrafen.map(paragraaf => {
                        const paraSummary = getStudentAssignmentSummary(selectedStudent, paragraaf.id);
                        const progressPercent = paraSummary.percentage;
                        const records = studentVoortgang[selectedStudent.id] || [];

                        return (
                          <div key={paragraaf.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
                            <div className="flex-1">
                              <h5 className="font-bold text-slate-800">
                                {paragraaf.number && `${paragraaf.number}. `}{paragraaf.title}
                              </h5>
                              <p className="text-sm text-slate-500 mt-1">
                                {paraSummary.completedItems} / {paraSummary.assignedItems} onderdelen afgerond
                              </p>
                              <SupportMiniBar records={records} paragraafId={paragraaf.id} />
                            </div>

                            <div className="flex items-center gap-6 ml-4">
                              <div className="w-32">
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      progressPercent === 100 ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${progressPercent}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-right min-w-[60px]">
                                <div className="font-bold text-slate-800">{progressPercent}%</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {viewingExercise && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="pad-compact border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h4 className="text-2xl font-black text-slate-800">{viewingExercise.ex.heading}</h4>
                  <p className="text-slate-500 font-medium">Gedetailleerde antwoorden</p>
                </div>
                <button 
                  onClick={() => setViewingExercise(null)}
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-400 transition-all shadow-sm"
                >
                  <Search size={24} className="rotate-45" />
                </button>
              </div>
              
              <div className="pad-compact max-h-[60vh] overflow-y-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                      <th className="pb-4">Vraag / Onderdeel</th>
                      <th className="pb-4">Antwoord Leerling</th>
                      <th className="pb-4">Correct Antwoord</th>
                      <th className="pb-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(() => {
                      const { ex, result } = viewingExercise;
                      const rows = [];
                      
                      if (ex.exercise.type === 'table') {
                        ex.exercise.rows.forEach(row => {
                          row.fields.forEach(field => {
                            rows.push({
                              label: `${row.label} - ${field.id.split('_').pop().toUpperCase()}`,
                              student: result.answers?.[field.id] || "—",
                              correct: field.answer,
                              isCorrect: isAnswerCorrect(result.answers?.[field.id], field.answer)
                            });
                          });
                        });
                      } else if (ex.exercise.fields) {
                        ex.exercise.fields.forEach(field => {
                          rows.push({
                            label: field.label || field.id,
                            student: result.answers?.[field.id] || "—",
                            correct: field.answer,
                            isCorrect: isAnswerCorrect(result.answers?.[field.id], field.answer)
                          });
                        });
                      }
                      
                      return rows.map((row, idx) => (
                        <tr key={idx} className="group">
                          <td className="py-4 font-bold text-slate-700">{row.label}</td>
                          <td className={`py-4 font-black ${row.isCorrect ? 'text-green-600' : 'text-rose-500'}`}>
                            {row.student}
                          </td>
                          <td className="py-4 font-medium text-slate-400 italic">{row.correct}</td>
                          <td className="py-4 text-center">
                            {row.isCorrect ? (
                              <CheckCircle className="text-green-500 mx-auto" size={20} />
                            ) : (
                              <AlertTriangle className="text-rose-500 mx-auto" size={20} />
                            )}
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
              
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Totaal Pogingen</div>
                    <div className="text-xl font-black text-slate-700">{viewingExercise.result.attempts}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Resultaat</div>
                    <div className={`text-xl font-black ${viewingExercise.result.isCorrect ? 'text-green-600' : 'text-amber-500'}`}>
                      {viewingExercise.result.isCorrect ? 'Correct' : 'Incompleet'}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingExercise(null)}
                  className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black hover:bg-slate-800 transition-colors"
                >
                  Sluiten
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="helix-page min-h-screen">
      <div className="helix-container">
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin')}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-[var(--helix-muted)] transition-colors hover:text-[var(--helix-navy)]"
        >
          ← Terug naar Admin Hub
        </button>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="text-[var(--helix-purple)]" /> Klas Dashboard
            </h1>
            <p className="mt-1 text-[var(--helix-muted)]">Real-time overzicht van je leerlingen</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="helix-card flex flex-col p-6">
          <div className="mb-2 text-sm font-medium text-[var(--helix-muted)]">Actief (laatste 15m)</div>
          <div className="font-display text-3xl font-extrabold text-[var(--helix-navy)]">{activeCount}</div>
        </div>
        <div className="helix-card flex flex-col p-6">
          <div className="mb-2 text-sm font-medium text-[var(--helix-muted)]">Gemiddelde Voortgang</div>
          <div className="font-display text-3xl font-extrabold text-[var(--helix-purple)]">{avgProgress}%</div>
        </div>
        <div className="helix-alert flex flex-col p-6">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-orange-700">
            <AlertTriangle size={16} /> Aandacht Nodig
          </div>
          <div className="font-display text-3xl font-extrabold text-orange-700">{warningCount}</div>
        </div>
      </div>

      {/* Live Pythagorean Theorem Measurements Table */}
      {(() => {
        const bcMeasurements = students
          .filter(s => {
            const bcValue = s.exerciseData?.['para_72']?.['p72_03']?.['bc_measurement'];
            return bcValue !== undefined && bcValue !== null;
          })
          .map(s => ({
            name: s.displayName || 'Naamloos',
            bc: s.exerciseData?.['para_72']?.['p72_03']?.['bc_measurement'],
            timestamp: s.exerciseData?.['para_72']?.['p72_03']?.['timestamp']
          }))
          .sort((a, b) => {
            const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
            const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
            return dateB - dateA;
          });

        return bcMeasurements.length > 0 ? (
          <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-slate-700 text-lg flex items-center gap-2">
                  📏 Pythagoras Metingen (BC-lengte)
                </h2>
                <p className="text-slate-500 text-sm mt-1">Live updates van leerlingen</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-blue-600">{bcMeasurements.length}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Gemeten</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bcMeasurements.map((measurement, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm animate-in fade-in zoom-in-95"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-800">{measurement.name}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {measurement.timestamp
                          ? new Date(
                              measurement.timestamp.toDate ? measurement.timestamp.toDate() : measurement.timestamp
                            ).toLocaleTimeString('nl-NL')
                          : '—'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-indigo-600">{measurement.bc.toFixed(2)}</div>
                      <div className="text-xs text-slate-400">cm</div>
                    </div>
                  </div>
                  {/* Visual indicator: expected value is ~4.24 cm */}
                  <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        Math.abs(measurement.bc - 5) < 0.2 ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min((measurement.bc / 6) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      })()}

      {/* Students Table */}
      <div className="helix-surface overflow-hidden">
        <div className="space-y-4 border-b border-[var(--helix-border)] bg-[var(--helix-surface-soft)]/72 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="font-display font-extrabold text-[var(--helix-navy)]">Leerlingenoverzicht ({students.length})</h2>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Zoek leerling..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-standard w-full py-2 pl-9 pr-4 text-sm"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--helix-muted)]">Paragraaf selecteren</label>
              <select
                value={selectedChapterForClass || ""}
                onChange={(e) => setSelectedChapterForClass(e.target.value || null)}
                className="input-standard w-full py-2 text-sm font-medium"
              >
                <option value="">Alle paragrafen (totaal voortgang)</option>
                {paragraphen.map((para) => (
                  <option key={para.id} value={para.id}>
                    {para.number && `${para.number}. `}{para.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 items-end">
              <button
                onClick={() => {
                  setSortBy("name");
                  setSortDirection(sortBy === "name" && sortDirection === "asc" ? "desc" : "asc");
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  sortBy === "name" ? "bg-blue-100 text-blue-700 border border-blue-300" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                }`}
              >
                Naam <ArrowUpDown size={14} />
              </button>
              <button
                onClick={() => {
                  setSortBy("total");
                  setSortDirection(sortBy === "total" && sortDirection === "asc" ? "desc" : "asc");
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  sortBy === "total" ? "bg-blue-100 text-blue-700 border border-blue-300" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                }`}
              >
                Totaal <ArrowUpDown size={14} />
              </button>
              {selectedChapterForClass && (
                <button
                  onClick={() => {
                    setSortBy("chapter");
                    setSortDirection(sortBy === "chapter" && sortDirection === "asc" ? "desc" : "asc");
                  }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === "chapter" ? "bg-blue-100 text-blue-700 border border-blue-300" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  Paragraaf <ArrowUpDown size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="py-4 px-6 font-medium text-slate-500 text-sm">Naam</th>
                <th className="py-4 px-6 font-medium text-slate-500 text-sm">Totale Voortgang</th>
                {selectedChapterForClass && (
                  <>
                    <th className="py-4 px-6 font-medium text-slate-500 text-sm">
                      {paragraphen.find(para => para.id === selectedChapterForClass)?.title || 'Paragraaf'}
                    </th>
                    <th className="py-4 px-6 font-medium text-slate-500 text-sm">
                      Presentatie
                    </th>
                    <th className="py-4 px-6 font-medium text-slate-500 text-sm">
                      📋 Evaluatie
                    </th>
                  </>
                )}
                <th className="py-4 px-6 font-medium text-slate-500 text-sm">Laatst Actief</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => {
                  const totalSummary = getStudentAssignmentSummary(student);
                  const totalProgress = totalSummary.percentage;

                  // Calculate progress for selected paragraph if applicable
                  const paraProgress = selectedChapterForClass
                    ? getStudentAssignmentSummary(student, selectedChapterForClass).percentage
                    : null;

                  return (
                    <tr
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {(student.displayName || student.email || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className={`font-medium ${!student.displayName ? 'text-amber-600 italic' : 'text-slate-800'}`}>
                              {student.displayName && student.displayName.trim() ? student.displayName : '⚠️ Naam ontbreekt'}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{student.email}</span>
                          </div>
                          {paragraphen.length > 0 && student.warning && (
                            <div className="relative group/tooltip cursor-help">
                              <AlertTriangle size={18} className="text-amber-500" />
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-slate-800 text-white text-xs rounded py-2 px-3 text-center z-10 shadow-xl border border-slate-700">
                                {student.warning}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                              </div>
                            </div>
                          )}
                          {totalProgress === 100 && (
                            <CheckCircle size={18} className="text-green-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-full max-w-[120px] h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(totalProgress)}`}
                              style={{ width: `${totalProgress}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-600">{totalProgress}%</span>
                        </div>
                        <SupportMiniBar records={studentVoortgang[student.id] || []} />
                      </td>
                      {selectedChapterForClass && (
                        <>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-full max-w-[120px] h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(paraProgress)}`}
                                  style={{ width: `${paraProgress}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-slate-600">{paraProgress}%</span>
                            </div>
                            <SupportMiniBar records={studentVoortgang[student.id] || []} paragraafId={selectedChapterForClass} />
                          </td>
                          <td className="py-4 px-6 text-sm">
                            {hasPresentationViewed(student, selectedChapterForClass) ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-500" />
                                <span className="text-green-600 font-medium text-xs">
                                  {getRelativeTime(getPresentationViewedTime(student, selectedChapterForClass))}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded border-2 border-slate-300" />
                                <span className="text-slate-400 text-xs">Nog niet</span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6 text-sm">
                            {(() => {
                              const evalScore = getEvaluationScore(student, selectedChapterForClass);
                              if (!evalScore) {
                                return (
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded border-2 border-slate-300" />
                                    <span className="text-slate-400 text-xs">—</span>
                                  </div>
                                );
                              }
                              return (
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-700">{evalScore.correct}/{evalScore.total}</span>
                                  <span className={`text-xs font-medium ${evalScore.correct === evalScore.total ? 'text-green-600' : 'text-amber-600'}`}>
                                    {Math.round((evalScore.correct / evalScore.total) * 100)}%
                                  </span>
                                </div>
                              );
                            })()}
                          </td>
                        </>
                      )}
                      <td className="py-4 px-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          {getRelativeTime(student.lastActive) === 'Nu' ? (
                            <span className="flex items-center gap-1.5 text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wider">
                              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                              Live
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <Clock size={14} className="text-slate-400" />
                              {getRelativeTime(student.lastActive)}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={selectedChapterForClass ? "4" : "3"} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="text-slate-300 mb-2" />
                      <p className="font-medium">Geen leerlingen gevonden.</p>
                      <p className="text-xs">Zorg dat leerlingen een account hebben aangemaakt.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}
