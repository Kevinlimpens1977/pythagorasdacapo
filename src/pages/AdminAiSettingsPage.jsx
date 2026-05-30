import { useEffect, useState } from 'react';
import { Bot, CheckCircle2, KeyRound, Loader2, Save } from 'lucide-react';
import { getOpenRouterConfigStatusCall, updateOpenRouterConfigCall } from '../lib/api';

const DEFAULT_MODEL = 'google/gemini-2.0-flash-001';

export default function AdminAiSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [enabled, setEnabled] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    getOpenRouterConfigStatusCall()
      .then((configStatus) => {
        if (cancelled) return;
        setStatus(configStatus);
        setEnabled(configStatus.enabled !== false);
        setModel(configStatus.model || DEFAULT_MODEL);
      })
      .catch(() => {
        if (!cancelled) setError('AI-instellingen konden niet worden geladen.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const nextStatus = await updateOpenRouterConfigCall({
        enabled,
        apiKey,
        model
      });
      setStatus(nextStatus);
      setApiKey('');
      setMessage('AI-instellingen opgeslagen. De volledige key blijft alleen server-side bewaard.');
    } catch (saveError) {
      console.error('AI-instellingen opslaan mislukt:', saveError);
      setError(saveError.message || 'AI-instellingen opslaan is mislukt.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="helix-page flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-[var(--helix-muted)]">
          <Loader2 className="animate-spin" size={22} />
          AI-instellingen laden...
        </div>
      </div>
    );
  }

  return (
    <div className="helix-page min-h-screen">
      <div className="helix-container max-w-5xl">
        <div className="mb-8">
          <p className="helix-eyebrow">Beheer</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold text-[var(--helix-navy)]">P-AI-co instellingen</h1>
          <p className="mt-3 max-w-2xl text-[var(--helix-muted)]">
            Stel hier de OpenRouter-koppeling in. De API-key wordt server-side opgeslagen en nooit volledig teruggestuurd naar de browser.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <form onSubmit={handleSave} className="helix-surface space-y-5 p-6">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
                {message}
              </div>
            )}

            <label className="flex items-start gap-3 rounded-2xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-4">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(event) => setEnabled(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--helix-purple)]"
              />
              <span>
                <span className="block font-black text-[var(--helix-navy)]">P-AI-co globaal inschakelen</span>
                <span className="mt-1 block text-sm text-[var(--helix-muted)]">
                  Per klas en per lesblok blijft daarnaast bepaald of leerlingen de knop zien.
                </span>
              </span>
            </label>

            <div>
              <label className="mb-2 block text-sm font-black text-[var(--helix-navy)]">OpenRouter API-key</label>
              <input
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                className="input-standard w-full"
                placeholder={status?.configured ? `${status.apiKeyMasked} behouden of nieuwe key plakken` : 'sk-or-v1-...'}
                type="password"
                autoComplete="off"
              />
              <p className="mt-2 text-xs font-semibold text-[var(--helix-muted)]">
                Laat dit veld leeg alleen als er al een key is ingesteld en je alleen model/aan-uit wijzigt.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[var(--helix-navy)]">Model</label>
              <input
                value={model}
                onChange={(event) => setModel(event.target.value)}
                className="input-standard w-full"
                placeholder={DEFAULT_MODEL}
              />
            </div>

            <button type="submit" disabled={saving} className="btn-primary px-5 py-3 text-sm disabled:cursor-wait disabled:opacity-60">
              {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
              AI-instellingen opslaan
            </button>
          </form>

          <aside className="helix-card h-fit p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
              <Bot size={24} />
            </div>
            <h2 className="mt-4 font-display text-xl font-extrabold text-[var(--helix-navy)]">Status</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-[var(--helix-surface-soft)] px-3 py-2">
                <span className="font-bold text-[var(--helix-muted)]">Key</span>
                <span className="inline-flex items-center gap-1 font-black text-[var(--helix-navy)]">
                  <KeyRound size={15} />
                  {status?.configured ? status.apiKeyMasked : 'Niet ingesteld'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-[var(--helix-surface-soft)] px-3 py-2">
                <span className="font-bold text-[var(--helix-muted)]">Globaal</span>
                <span className={`inline-flex items-center gap-1 font-black ${status?.enabled ? 'text-emerald-700' : 'text-red-700'}`}>
                  <CheckCircle2 size={15} />
                  {status?.enabled ? 'Aan' : 'Uit'}
                </span>
              </div>
              <div className="rounded-xl bg-[var(--helix-surface-soft)] px-3 py-2">
                <span className="block font-bold text-[var(--helix-muted)]">Model</span>
                <span className="mt-1 block break-words font-black text-[var(--helix-navy)]">{status?.model || model}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
