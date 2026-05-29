import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import * as klasService from '../../services/klasService';

export default function ClassSelectionModal() {
  const { currentUser, userData, isStudent, isDevUser } = useAuth();
  const [klassen, setKlassen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedKlasId, setSelectedKlasId] = useState(null);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);

  // Load available classes
  useEffect(() => {
    if (!currentUser || !isStudent || userData?.klasId || isDevUser) {
      return;
    }

    const loadKlassen = async () => {
      try {
        setLoading(true);
        const data = await klasService.getAvailableKlassen();
        setKlassen(data);
      } catch (err) {
        console.error('Error loading classes:', err);
        setError('Kon klassen niet laden');
      } finally {
        setLoading(false);
      }
    };

    loadKlassen();
  }, [currentUser, isStudent, isDevUser, userData?.klasId]);

  // Only show if student and no klasId
  if (!currentUser || !isStudent || userData?.klasId || isDevUser) {
    return null;
  }

  const handleJoinClass = async (klasId) => {
    if (!currentUser?.uid) return;

    try {
      setJoining(true);
      setError(null);
      setSelectedKlasId(klasId);
      await klasService.joinKlas(currentUser.uid, klasId);
      // Modal will disappear automatically when userData.klasId updates via onSnapshot
    } catch (err) {
      console.error('Error joining class:', err);
      setError(err.message || 'Kon niet deelnemen aan klas');
      setSelectedKlasId(null);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welkom!</h2>
        <p className="text-gray-600 mb-6">
          Selecteer je klas om aan de slag te gaan.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : klassen.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            <p>Geen klassen beschikbaar.</p>
            <p className="text-sm">Neem contact op met je docent.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {klassen.map(klas => (
              <button
                key={klas.id}
                onClick={() => handleJoinClass(klas.id)}
                disabled={joining || selectedKlasId === klas.id}
                className={`w-full p-4 border-2 rounded-lg font-semibold text-left transition-colors ${
                  selectedKlasId === klas.id
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-200 text-gray-900 hover:border-blue-400 hover:bg-blue-50'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{klas.name}</div>
                    <div className="text-xs text-gray-500">Code: {klas.code}</div>
                  </div>
                  {selectedKlasId === klas.id && joining && (
                    <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
