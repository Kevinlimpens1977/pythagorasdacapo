import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, Search, CheckCircle, Clock } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { CHAPTERS, getChapterSlides } from '../../data/chapters';

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

export default function ClassOverview() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewingExercise, setViewingExercise] = useState(null);
  const [showPythagorasMeasurements, setShowPythagorasMeasurements] = useState(false);

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

      // Update selected student if they were already open
      if (selectedStudent) {
        const updated = studentData.find(s => s.id === selectedStudent.id);
        if (updated) setSelectedStudent(updated);
      }
    }, (error) => {
      console.error("Error fetching students:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredStudents = students.filter(s => 
    (s.displayName || "Naamloos").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = students.filter(s => {
    if (!s.lastActive) return false;
    const date = s.lastActive.toDate ? s.lastActive.toDate() : new Date(s.lastActive);
    const diffInMinutes = (new Date() - date) / (1000 * 60);
    return diffInMinutes < 15;
  }).length;

  const warningCount = students.filter(s => s.warning).length;
  const avgProgress = students.length > 0 
    ? Math.round(students.reduce((acc, curr) => acc + (curr.progress || 0), 0) / students.length)
    : 0;

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 text-slate-500">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="font-medium">Leerlinggegevens laden...</p>
      </div>
    );
  }

  if (selectedStudent) {
    return (
      <div className="w-full animate-in fade-in slide-in-from-right-8 duration-500 pb-20">
        <button 
          onClick={() => setSelectedStudent(null)}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors"
        >
          <Search className="rotate-180" size={20} /> Terug naar overzicht
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8">
          <div className="p-8 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-blue-500 flex items-center justify-center text-3xl font-black">
                {(selectedStudent.displayName || "N").charAt(0)}
              </div>
              <div>
                <h2 className="text-4xl font-black">{selectedStudent.displayName || "Naamloos"}</h2>
                <p className="text-slate-400 text-lg">{selectedStudent.email}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10">
                <div className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Voortgang</div>
                <div className="text-2xl font-black text-blue-400">{selectedStudent.progress || 0}%</div>
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10">
                <div className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Laatst Actief</div>
                <div className="text-2xl font-black">{getRelativeTime(selectedStudent.lastActive)}</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-2xl font-black text-slate-800 mb-8">Gemaakte opdrachten</h3>
            
            <div className="space-y-12">
              {CHAPTERS.map(chapter => {
                const chapterSlides = getChapterSlides(chapter.id);
                const exercises = chapterSlides.filter(s => s.type === 'exercise');
                if (exercises.length === 0) return null;

                return (
                  <div key={chapter.id} className="bg-slate-50 rounded-[2.5rem] p-8 border-2 border-slate-100">
                    <h4 className="text-xl font-black text-slate-600 mb-6 flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      {chapter.title}
                    </h4>
                    
                    <div className="grid gap-6">
                      {exercises.map(ex => {
                        // Handle both nested object structure and flat dot-notation structure
                        let result = selectedStudent.exerciseData?.[chapter.id]?.[ex.id];

                        // If not found as nested object, check for flat structure with dot notation
                        if (!result) {
                          const flatKey = `${chapter.id}.${ex.id}`;
                          const exerciseDataObj = selectedStudent.exerciseData;
                          if (exerciseDataObj && exerciseDataObj[flatKey]) {
                            result = exerciseDataObj[flatKey];
                          }
                        }

                        return (
                          <div key={ex.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex-1">
                              <h5 className="text-lg font-black text-slate-800 mb-1">{ex.heading}</h5>
                              <p className="text-slate-500 text-sm italic">{ex.content.substring(0, 100)}...</p>
                            </div>
                            
                            <div className="flex items-center gap-8">
                              {result ? (
                                <>
                                  <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Pogingen</span>
                                    <span className={`text-xl font-black ${result.attempts >= 3 ? 'text-amber-500' : 'text-slate-700'}`}>
                                      {result.attempts}
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</span>
                                    {result.isCorrect ? (
                                      <CheckCircle className="text-green-500" size={32} />
                                    ) : (
                                      <AlertTriangle className="text-amber-500" size={32} />
                                    )}
                                  </div>
                                  <div className="border-l border-slate-100 pl-8 h-12 flex flex-col justify-center">
                                     <button 
                                       className="text-blue-600 font-bold hover:underline"
                                       onClick={() => setViewingExercise({ ex, result })}
                                      >
                                       Bekijk details
                                     </button>
                                  </div>
                                </>
                              ) : (
                                <span className="text-slate-300 font-bold italic">Nog niet gemaakt</span>
                              )}
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
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
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
              
              <div className="p-8 max-h-[60vh] overflow-y-auto">
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
                              isCorrect: (result.answers?.[field.id]?.toString().toLowerCase().trim() === field.answer.toString().toLowerCase().trim())
                            });
                          });
                        });
                      } else if (ex.exercise.fields) {
                        ex.exercise.fields.forEach(field => {
                          rows.push({
                            label: field.label || field.id,
                            student: result.answers?.[field.id] || "—",
                            correct: field.answer,
                            isCorrect: (result.answers?.[field.id]?.toString().toLowerCase().trim() === field.answer.toString().toLowerCase().trim())
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
    <div className="w-full">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-blue-500" /> Klas Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Real-time overzicht van je leerlingen</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="text-slate-500 text-sm font-medium mb-2">Actief (laatste 15m)</div>
          <div className="text-3xl font-bold text-slate-800">{activeCount}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="text-slate-500 text-sm font-medium mb-2">Gemiddelde Voortgang</div>
          <div className="text-3xl font-bold text-blue-600">{avgProgress}%</div>
        </div>
        <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-200 p-6 flex flex-col">
          <div className="text-amber-700 text-sm font-medium mb-2 flex items-center gap-2">
            <AlertTriangle size={16} /> Aandacht Nodig
          </div>
          <div className="text-3xl font-bold text-amber-700">{warningCount}</div>
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="font-semibold text-slate-700">Leerlingenoverzicht ({students.length})</h2>
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Zoek leerling..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none text-sm transition-all"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="py-4 px-6 font-medium text-slate-500 text-sm">Naam</th>
                <th className="py-4 px-6 font-medium text-slate-500 text-sm">Voortgang</th>
                <th className="py-4 px-6 font-medium text-slate-500 text-sm">Laatst Actief</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
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
                        {student.warning && (
                          <div className="relative group/tooltip cursor-help">
                            <AlertTriangle size={18} className="text-amber-500" />
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-slate-800 text-white text-xs rounded py-2 px-3 text-center z-10 shadow-xl border border-slate-700">
                              {student.warning}
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                            </div>
                          </div>
                        )}
                        {student.progress === 100 && (
                          <CheckCircle size={18} className="text-green-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-full max-w-[120px] h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${student.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${student.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-600">{student.progress || 0}%</span>
                      </div>
                    </td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-12 text-center text-slate-500">
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
  );
}

