import { useEffect, useState } from 'react';
import { Bot, CheckCircle2, FileText, KeyRound, Loader2, Save } from 'lucide-react';
import { HelixLaden } from '../components/merk/HelixLogo';
import { PaginaKop } from '../components/leeromgeving';
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
      <div className="helix-page beheer-stijl lo-tekst flex min-h-[60vh] items-center justify-center">
        <HelixLaden tekst="AI-instellingen laden..." />
      </div>
    );
  }

  return (
    <div className="helix-page beheer-stijl lo-tekst min-h-screen">
      <div className="helix-container flex max-w-5xl flex-col gap-6 py-10 md:py-12">
        <PaginaKop
          eyebrow="Instellingen"
          titel="Digidocent instellingen"
          uitleg="Stel hier de OpenRouter-koppeling in. De API-key wordt server-side opgeslagen en nooit volledig teruggestuurd naar de browser."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <form onSubmit={handleSaveConfig} className="lo-kaart gap-5">
            {error && (
              <div className="lo-melding lo-melding--fout">
                {error}
              </div>
            )}
            {message && (
              <div className="lo-melding lo-melding--goed">
                {message}
              </div>
            )}

            <label className="flex items-start gap-3 rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-papier)] p-4">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(event) => setEnabled(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[var(--lo-lijn)] accent-[var(--lo-blauw)]"
              />
              <span>
                <span className="block font-extrabold text-[var(--lo-inkt)]">Digidocent globaal inschakelen</span>
                <span className="mt-1 block text-sm text-[var(--lo-grijs)]">
                  Per klas en per lesblok blijft daarnaast bepaald of leerlingen de knop zien.
                </span>
              </span>
            </label>

            <div>
              <label className="lo-veldlabel">OpenRouter API-key</label>
              <input
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                className="input-standard w-full"
                placeholder={status?.configured ? `${status.apiKeyMasked} behouden of nieuwe key plakken` : 'sk-or-v1-...'}
                type="password"
                autoComplete="off"
              />
              <p className="lo-onderregel mt-2">
                Laat dit veld leeg alleen als er al een key is ingesteld en je alleen model/aan-uit wijzigt.
              </p>
            </div>

            <div>
              <label className="lo-veldlabel">Model</label>
              <div className="grid gap-3 md:grid-cols-2">
                {AI_MODEL_OPTIONS.map((option) => {
                  const selected = model === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-[var(--lo-hoek-m)] border p-4 transition ${
                        selected
                          ? 'border-[var(--lo-blauw)] bg-[var(--lo-blauw-zacht)] text-[var(--lo-inkt)]'
                          : 'border-[var(--lo-lijn)] bg-[var(--lo-kaart)] text-[var(--lo-grijs)] hover:border-[var(--lo-blauw)]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => setModel(option.id)}
                        className="mt-1 h-4 w-4 rounded border-[var(--lo-lijn)] accent-[var(--lo-blauw)]"
                      />
                      <span>
                        <span className="block font-extrabold">{option.label}</span>
                        <span className="mt-1 block break-words text-xs font-bold">{option.id}</span>
                        <span className="mt-2 block text-sm">{option.description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button type="submit" disabled={savingConfig} className="lo-knop w-fit disabled:cursor-wait">
              {savingConfig ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
              AI-instellingen opslaan
            </button>
          </form>

          <aside className="lo-kaart h-fit">
            <div className="flex h-12 w-12 items-center justify-center rounded-[var(--lo-hoek-m)] bg-[var(--lo-blauw-zacht)] text-[var(--lo-blauw-inkt)]">
              <Bot size={24} />
            </div>
            <h2 className="lo-kaart-titel">Status</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3 rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] px-3 py-2">
                <span className="font-bold text-[var(--lo-grijs)]">Key</span>
                <span className="inline-flex items-center gap-1 font-extrabold text-[var(--lo-inkt)]">
                  <KeyRound size={15} />
                  {status?.configured ? status.apiKeyMasked : 'Niet ingesteld'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] px-3 py-2">
                <span className="font-bold text-[var(--lo-grijs)]">Globaal</span>
                <span className={`inline-flex items-center gap-1 font-extrabold ${status?.enabled ? 'text-[var(--lo-groen-inkt)]' : 'text-[var(--lo-rood-inkt)]'}`}>
                  <CheckCircle2 size={15} />
                  {status?.enabled ? 'Aan' : 'Uit'}
                </span>
              </div>
              <div className="rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] px-3 py-2">
                <span className="block font-bold text-[var(--lo-grijs)]">Model</span>
                <span className="mt-1 block break-words font-extrabold text-[var(--lo-inkt)]">{status?.model || model}</span>
              </div>
              <div className="rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] px-3 py-2">
                <span className="block font-bold text-[var(--lo-grijs)]">Tutorregels</span>
                <span className="mt-1 inline-flex items-center gap-1 font-extrabold text-[var(--lo-inkt)]">
                  <FileText size={15} />
                  Actief
                </span>
              </div>
            </div>
          </aside>
        </div>

        <section className="lo-kaart">
          <div>
            <p className="lo-eyebrow">Digidocent</p>
            <h2 className="lo-kaart-titel">Digidocent regels</h2>
            <p className="lo-kaart-uitleg">
              Deze regels worden altijd meegegeven aan Digidocent voordat hij leerlingen helpt.
            </p>
          </div>

          <div className="grid gap-5">
            <label>
              <span className="lo-veldlabel">Administratorregels</span>
              <textarea
                value={adminRules}
                onChange={(event) => setAdminRules(event.target.value)}
                className="input-standard min-h-44 w-full resize-y leading-6"
                placeholder="Voeg hier schoolspecifieke of docentafspraken toe die Digidocent altijd moet volgen."
              />
            </label>

            <details className="rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-papier)] p-4">
              <summary className="cursor-pointer font-extrabold text-[var(--lo-inkt)]">Masterregels en VMBO-regels bekijken of aanpassen</summary>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <label>
                  <span className="lo-veldlabel">Masterregels</span>
                  <textarea
                    value={masterRules}
                    onChange={(event) => setMasterRules(event.target.value)}
                    className="input-standard min-h-72 w-full resize-y leading-6"
                  />
                </label>
                <label>
                  <span className="lo-veldlabel">VMBO wiskunde regels</span>
                  <textarea
                    value={vmboRules}
                    onChange={(event) => setVmboRules(event.target.value)}
                    className="input-standard min-h-72 w-full resize-y leading-6"
                  />
                </label>
              </div>
            </details>

            <button type="button" onClick={handleSaveRules} disabled={savingRules} className="lo-knop w-fit disabled:cursor-wait">
              {savingRules ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
              Digidocent regels opslaan
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
