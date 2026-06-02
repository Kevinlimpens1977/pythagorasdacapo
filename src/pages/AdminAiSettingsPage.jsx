import { useEffect, useState } from 'react';
import { Bot, CheckCircle2, FileText, KeyRound, Loader2, Save } from 'lucide-react';
import {
  getAiTutorRulesCall,
  getOpenRouterConfigStatusCall,
  updateAiTutorRulesCall,
  updateOpenRouterConfigCall
} from '../lib/api';

const DEFAULT_MODEL = 'google/gemini-2.0-flash-001';
const AI_MODEL_OPTIONS = [
  {
    id: 'google/gemini-2.0-flash-001',
    label: 'Gemini 2.0 Flash',
    description: 'Stabiel en snel voor Digidocent hulp en open-vraagbeoordeling.'
  },
  {
    id: 'gemini-3.5-flash',
    label: 'Gemini 3.5 Flash',
    description: 'Nieuwere Flash-optie om te testen met dezelfde veilige server-side key.'
  }
];

const isAllowedModel = (value) => AI_MODEL_OPTIONS.some((option) => option.id === value);

export default function AdminAiSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [savingRules, setSavingRules] = useState(false);
  const [status, setStatus] = useState(null);
  const [enabled, setEnabled] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [masterRules, setMasterRules] = useState('');
  const [vmboRules, setVmboRules] = useState('');
  const [adminRules, setAdminRules] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getOpenRouterConfigStatusCall(),
      getAiTutorRulesCall()
    ])
      .then(([configStatus, rules]) => {
        if (cancelled) return;
        setStatus(configStatus);
        setEnabled(configStatus.enabled !== false);
        setModel(isAllowedModel(configStatus.model) ? configStatus.model : DEFAULT_MODEL);
        setMasterRules(rules.masterRules || '');
        setVmboRules(rules.vmboRules || '');
        setAdminRules(rules.adminRules || '');
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

  const handleSaveConfig = async (event) => {
    event?.preventDefault?.();
    setSavingConfig(true);
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
      setSavingConfig(false);
    }
  };

  const handleSaveRules = async () => {
    setSavingRules(true);
    setError('');
    setMessage('');

    try {
      const nextRules = await updateAiTutorRulesCall({
        masterRules,
        vmboRules,
        adminRules
      });
      setMasterRules(nextRules.masterRules || '');
      setVmboRules(nextRules.vmboRules || '');
      setAdminRules(nextRules.adminRules || '');
      setMessage('Digidocent regels opgeslagen. Deze regels worden bij iedere Digidocent interactie meegestuurd.');
    } catch (saveError) {
      console.error('Digidocent regels opslaan mislukt:', saveError);
      setError(saveError.message || 'Digidocent regels opslaan is mislukt.');
    } finally {
      setSavingRules(false);
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
          <h1 className="mt-2 font-display text-4xl font-extrabold text-[var(--helix-navy)]">Digidocent instellingen</h1>
          <p className="mt-3 max-w-2xl text-[var(--helix-muted)]">
            Stel hier de OpenRouter-koppeling in. De API-key wordt server-side opgeslagen en nooit volledig teruggestuurd naar de browser.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <form onSubmit={handleSaveConfig} className="helix-surface space-y-5 p-6">
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
                <span className="block font-black text-[var(--helix-navy)]">Digidocent globaal inschakelen</span>
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
              <div className="grid gap-3 md:grid-cols-2">
                {AI_MODEL_OPTIONS.map((option) => {
                  const selected = model === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                        selected
                          ? 'border-[var(--helix-purple)] bg-[var(--helix-soft-lavender)] text-[var(--helix-navy)]'
                          : 'border-[var(--helix-border)] bg-white text-[var(--helix-muted)] hover:border-fuchsia-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => setModel(option.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--helix-purple)]"
                      />
                      <span>
                        <span className="block font-black">{option.label}</span>
                        <span className="mt-1 block break-words text-xs font-bold">{option.id}</span>
                        <span className="mt-2 block text-sm">{option.description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button type="submit" disabled={savingConfig} className="btn-primary px-5 py-3 text-sm disabled:cursor-wait disabled:opacity-60">
              {savingConfig ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
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
              <div className="rounded-xl bg-[var(--helix-surface-soft)] px-3 py-2">
                <span className="block font-bold text-[var(--helix-muted)]">Tutorregels</span>
                <span className="mt-1 inline-flex items-center gap-1 font-black text-[var(--helix-navy)]">
                  <FileText size={15} />
                  Actief
                </span>
              </div>
            </div>
          </aside>
        </div>

        <section className="helix-surface mt-6 p-6">
          <div className="mb-5">
            <p className="helix-eyebrow">Digidocent Beheer</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-[var(--helix-navy)]">Digidocent regels</h2>
            <p className="mt-2 text-sm font-semibold text-[var(--helix-muted)]">
              Deze regels worden altijd meegegeven aan Digidocent voordat hij leerlingen helpt.
            </p>
          </div>

          <div className="grid gap-5">
            <label>
              <span className="mb-2 block text-sm font-black text-[var(--helix-navy)]">Administratorregels</span>
              <textarea
                value={adminRules}
                onChange={(event) => setAdminRules(event.target.value)}
                className="input-standard min-h-44 w-full resize-y leading-6"
                placeholder="Voeg hier schoolspecifieke of docentafspraken toe die Digidocent altijd moet volgen."
              />
            </label>

            <details className="rounded-2xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-4">
              <summary className="cursor-pointer font-black text-[var(--helix-navy)]">Masterregels en VMBO-regels bekijken of aanpassen</summary>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-black text-[var(--helix-navy)]">Masterregels</span>
                  <textarea
                    value={masterRules}
                    onChange={(event) => setMasterRules(event.target.value)}
                    className="input-standard min-h-72 w-full resize-y leading-6"
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-black text-[var(--helix-navy)]">VMBO wiskunde regels</span>
                  <textarea
                    value={vmboRules}
                    onChange={(event) => setVmboRules(event.target.value)}
                    className="input-standard min-h-72 w-full resize-y leading-6"
                  />
                </label>
              </div>
            </details>

            <button type="button" onClick={handleSaveRules} disabled={savingRules} className="btn-primary w-fit px-5 py-3 text-sm disabled:cursor-wait disabled:opacity-60">
              {savingRules ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
              Digidocent regels opslaan
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
