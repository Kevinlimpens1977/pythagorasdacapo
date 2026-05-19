import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Search, UserRound, Users } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import * as klasService from '../services/klasService';
import {
  enrichStudentsWithClassName,
  filterStudentAccounts
} from '../lib/studentAccountUtils';

const formatLastActive = (value) => {
  if (!value) return 'Onbekend';
  const date = value.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Onbekend';
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export default function AdminLeerlingenPage() {
  const [students, setStudents] = useState([]);
  const [queryText, setQueryText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        const [klassen, studentSnapshot] = await Promise.all([
          klasService.getAvailableKlassen(),
          getDocs(query(collection(db, 'users'), where('role', '==', 'student')))
        ]);

        const rawStudents = studentSnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data()
        }));

        if (isMounted) {
          setStudents(enrichStudentsWithClassName(rawStudents, klassen));
        }
      } catch (err) {
        console.error('Kon leerlingen niet laden:', err);
        if (isMounted) {
          setError('Leerlingaccounts konden niet worden geladen.');
          setStudents([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredStudents = useMemo(
    () => filterStudentAccounts(students, queryText),
    [students, queryText]
  );

  const withoutClassCount = students.filter((student) => !student.klasId).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-blue-600">Werkplek</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Leerlingen</h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
              Bekijk leerlingaccounts, gekoppelde klassen en accountstatus. Wachtwoordbeheer volgt later via een veilige backendstap.
            </p>
          </div>

          {error && (
            <div className="flex max-w-md items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Leerlingen" value={students.length} description="Accounts met leerlingrol" />
          <StatCard label="Zonder klas" value={withoutClassCount} description="Nog niet gekoppeld aan klas" />
          <StatCard label="Gefilterd" value={filteredStudents.length} description="Zichtbaar in dit overzicht" />
        </section>

        <section className="mt-8 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100">
              <Search size={18} className="text-slate-400" />
              <input
                value={queryText}
                onChange={(event) => setQueryText(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                placeholder="Zoek op naam, e-mail of klas..."
              />
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-slate-500">Leerlingen laden...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-10 text-center">
              <Users size={36} className="mx-auto text-slate-300" />
              <p className="mt-3 font-black text-slate-900">Geen leerlingen gevonden</p>
              <p className="mt-1 text-sm text-slate-500">Pas je zoekterm aan of laat leerlingen eerst een account maken.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <div key={student.uid} className="grid gap-4 px-5 py-4 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <UserRound size={21} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{student.displayName || 'Naam ontbreekt'}</p>
                      <p className="text-sm text-slate-500">{student.email || 'Geen e-mail'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">Klas</p>
                    <p className="mt-1 text-sm font-bold text-slate-700">{student.klasName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">Laatst actief</p>
                    <p className="mt-1 text-sm font-bold text-slate-700">{formatLastActive(student.lastActive)}</p>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-slate-500">
                    Leerling
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, description }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-bold text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
    <p className="mt-4 text-sm leading-5 text-slate-500">{description}</p>
  </div>
);
