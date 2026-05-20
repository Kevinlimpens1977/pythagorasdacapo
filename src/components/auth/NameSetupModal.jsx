import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from './AuthProvider';

export default function NameSetupModal({ onComplete }) {
  const { currentUser, userData, isDevUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Only show if user needs name setup
  if (!userData?.needsNameSetup || isDevUser) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('Vul alsjeblieft je voor- en achternaam in.');
      return;
    }

    setLoading(true);
    try {
      const displayName = `${firstName.trim()} ${lastName.trim()}`;

      // Update Firebase Auth profile
      await updateProfile(currentUser, { displayName });

      // Update Firestore document
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: displayName,
        needsNameSetup: false
      });

      // Call completion callback
      if (onComplete) onComplete();
    } catch (err) {
      console.error('Error setting name:', err);
      setError('Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Welkom! 👋</h2>
          <p className="text-slate-600">Voer je volledige naam in om te beginnen</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Voornaam
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Bijv. Jan"
              className="input-auth text-lg"
              disabled={loading}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Achternaam
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Bijv. Jansen"
              className="input-auth text-lg"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-lg !py-3 text-lg"
          >
            {loading ? 'Bezig...' : 'Verder'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          {currentUser?.email}
        </p>
      </div>
    </div>
  );
}
