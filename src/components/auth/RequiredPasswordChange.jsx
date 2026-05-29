import { useState } from 'react';
import { AlertCircle, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { changeCurrentUserPassword, DEFAULT_STUDENT_PASSWORD } from '../../services/studentPasswordService';

export default function RequiredPasswordChange({ currentUser, displayName = 'Leerling' }) {
  const [currentPassword, setCurrentPassword] = useState(DEFAULT_STUDENT_PASSWORD);
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Kies een nieuw wachtwoord van minimaal 6 tekens.');
      return;
    }
    if (newPassword === DEFAULT_STUDENT_PASSWORD) {
      setError('Kies een ander wachtwoord dan het standaardwachtwoord.');
      return;
    }
    if (newPassword !== repeatPassword) {
      setError('De nieuwe wachtwoorden zijn niet gelijk.');
      return;
    }

    setSaving(true);
    try {
      await changeCurrentUserPassword({
        user: currentUser,
        currentPassword,
        newPassword
      });
    } catch (err) {
      console.error('Wachtwoord wijzigen mislukt:', err);
      setError('Wachtwoord wijzigen lukt niet. Controleer je huidige wachtwoord en probeer opnieuw.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="helix-page flex min-h-screen items-center justify-center p-4">
      <section className="w-full max-w-xl rounded-[var(--helix-radius-xl)] border border-[var(--helix-border)] bg-white p-7 shadow-[var(--helix-shadow-soft)]">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--helix-radius-lg)] bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
            <KeyRound size={28} />
          </div>
          <div>
            <p className="helix-eyebrow">Eerste keer inloggen</p>
            <h1 className="mt-1 text-3xl font-black text-[var(--helix-navy)]">Stel je wachtwoord in</h1>
            <p className="helix-muted mt-2 text-sm leading-6">
              Welkom {displayName}. Je account start met een standaardwachtwoord. Kies nu je eigen wachtwoord voordat je verdergaat.
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-5 flex items-start gap-3 rounded-[var(--helix-radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-black text-[var(--helix-navy)]">Huidig wachtwoord</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="input-auth mt-1"
              autoComplete="current-password"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-black text-[var(--helix-navy)]">Nieuw wachtwoord</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="input-auth mt-1"
              autoComplete="new-password"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-black text-[var(--helix-navy)]">Herhaal nieuw wachtwoord</span>
            <input
              type="password"
              value={repeatPassword}
              onChange={(event) => setRepeatPassword(event.target.value)}
              className="input-auth mt-1"
              autoComplete="new-password"
              required
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
            Wachtwoord opslaan
          </button>
        </form>
      </section>
    </div>
  );
}
