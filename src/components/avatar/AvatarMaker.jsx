import { useMemo, useState } from 'react';
import { Check, Coins, Gift, Loader2, Lock, RotateCcw, Save, ShoppingBag } from 'lucide-react';
import HelixAvatar from './HelixAvatar';
import {
  AVATAR_BONUSDELEN, AVATAR_DELEN, AVATAR_SETS, avatarDeel, HAARKLEUREN, HUIDSKLEUREN, magDeelDragen,
  normaliseerAvatar, shopItemIdVoorDeel, STOFKLEUREN
} from '../../lib/avatarDelen';

// De avatarmaker in de tokenshop (Shop 2.0 deel 2B). Kleuren zijn altijd
// gratis. Onderdelen die je nog niet hebt, kun je passen; opslaan kan pas als
// alles wat je draagt van jou is.

const TABS = [
  { id: 'huid', label: 'Huid' },
  { id: 'kapsel', label: 'Kapsel' },
  { id: 'kleding', label: 'Kleding' },
  { id: 'accessoire', label: 'Accessoire' },
  { id: 'achtergrond', label: 'Achtergrond' }
];

const SLOTS = ['kapsel', 'kleding', 'accessoire', 'achtergrond'];

function Kleurrij({ titel, lijst, waarde, onKies }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-black uppercase tracking-wide text-[var(--helix-muted)]">{titel}</p>
      <div className="flex flex-wrap gap-2">
        {lijst.map((optie) => (
          <button
            key={optie.id}
            type="button"
            onClick={() => onKies(optie.id)}
            aria-label={`${titel} ${optie.id.split('-').slice(1).join(' ')}`}
            aria-pressed={waarde === optie.id}
            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0B0D0F] ${waarde === optie.id ? 'ring-4 ring-[#087EB5]/50' : ''}`}
            style={{ background: optie.kleur }}
          >
            {waarde === optie.id && <Check size={16} strokeWidth={3} className="text-white drop-shadow-[0_0_2px_#0B0D0F]" aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AvatarMaker({ opgeslagen, getekendActief, bezit, itemsById, saldo, bezig, onOpslaan, onKoop }) {
  const basis = useMemo(() => normaliseerAvatar(opgeslagen || {}), [opgeslagen]);
  const [concept, setConcept] = useState(null);
  const [tab, setTab] = useState('huid');
  const huidig = concept || basis;

  const zet = (veld, waarde) => setConcept({ ...huidig, [veld]: waarde });
  const heeftDeel = (deelId) => magDeelDragen(deelId, bezit);
  const nietVanJou = SLOTS.map((slot) => avatarDeel(huidig[slot])).filter((deel) => deel && !heeftDeel(deel.id));
  const gewijzigd = Boolean(concept) && JSON.stringify(concept) !== JSON.stringify(basis);
  const kanOpslaan = nietVanJou.length === 0 && (gewijzigd || !getekendActief);

  const delenVoorTab = [
    ...AVATAR_DELEN.filter((deel) => deel.slot === tab && (deel.prijs === 0 || itemsById.has(shopItemIdVoorDeel(deel.id)) || heeftDeel(deel.id))),
    ...AVATAR_BONUSDELEN.filter((deel) => deel.slot === tab)
  ];
  const kapselDeel = avatarDeel(huidig.kapsel);
  const kledingDeel = avatarDeel(huidig.kleding);
  const achtergrondDeel = avatarDeel(huidig.achtergrond);

  return (
    <section className="overflow-hidden rounded-2xl border-[3px] border-[#0B0D0F] bg-white shadow-[3px_3px_0_#0B0D0F]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#0B0D0F] bg-[#FFF0B8] px-4 py-2">
        <h2 className="ds-display text-[26px]">Mijn avatar</h2>
        <p className="text-sm font-bold">Kleuren zijn gratis. Onderdelen kun je eerst passen.</p>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-[200px_minmax(0,1fr)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-44 w-44 overflow-hidden rounded-full border-4 border-[#0B0D0F]">
            <HelixAvatar avatar={huidig} className="h-full w-full" titel="Jouw avatar" />
          </div>
          {nietVanJou.length > 0 ? (
            <div className="w-full space-y-2">
              {nietVanJou.map((deel) => {
                const item = itemsById.get(shopItemIdVoorDeel(deel.id));
                if (deel.bonusVan || !item) {
                  const set = AVATAR_SETS.find((kandidaat) => kandidaat.id === deel.bonusVan);
                  return <p key={deel.id} className="rounded-lg bg-[var(--helix-surface-soft)] px-2 py-1.5 text-center text-xs font-bold">{deel.titel}: maak de {set?.titel || 'set'} compleet.</p>;
                }
                const prijs = Math.max(0, Number(item.price) || 0);
                return (
                  <button
                    key={deel.id}
                    type="button"
                    onClick={() => onKoop(item)}
                    disabled={saldo < prijs || bezig}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-[#0B0D0F] bg-[#087EB5] px-3 py-2 text-sm font-extrabold text-white disabled:bg-[var(--helix-surface-soft)] disabled:text-[var(--helix-muted)]"
                  >
                    <ShoppingBag size={15} aria-hidden="true" />
                    {saldo >= prijs ? `${deel.titel} kopen (${prijs})` : `${deel.titel}: nog ${prijs - saldo}`}
                  </button>
                );
              })}
            </div>
          ) : (
            <button
              type="button"
              onClick={async () => { await onOpslaan(huidig); setConcept(null); }}
              disabled={!kanOpslaan || bezig}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#0B0D0F] bg-[#2E9D63] px-4 py-2 font-extrabold text-white shadow-[3px_3px_0_#0B0D0F] disabled:bg-[var(--helix-surface-soft)] disabled:text-[var(--helix-muted)] disabled:shadow-none"
            >
              {bezig ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} aria-hidden="true" />}
              {getekendActief || gewijzigd ? 'Opslaan' : 'Deze avatar gebruiken'}
            </button>
          )}
          {gewijzigd && (
            <button type="button" onClick={() => setConcept(null)} className="flex items-center gap-1 text-sm font-bold text-[var(--helix-muted)] underline">
              <RotateCcw size={14} aria-hidden="true" /> Terug naar opgeslagen
            </button>
          )}
        </div>

        <div className="min-w-0">
          <nav className="mb-3 flex gap-1.5 overflow-x-auto rounded-xl border-2 border-[#0B0D0F] bg-white p-1.5" aria-label="Avatar onderdelen">
            {TABS.map((optie) => (
              <button
                key={optie.id}
                type="button"
                onClick={() => setTab(optie.id)}
                className={`min-h-9 shrink-0 rounded-lg px-3 text-sm font-extrabold ${tab === optie.id ? 'bg-[#0B0D0F] text-[#FFD33D]' : 'hover:bg-[var(--helix-surface-soft)]'}`}
              >
                {optie.label}
              </button>
            ))}
          </nav>

          <div className="space-y-4">
            {tab === 'huid' && <Kleurrij titel="Huidskleur" lijst={HUIDSKLEUREN} waarde={huidig.huid} onKies={(id) => zet('huid', id)} />}
            {tab === 'kapsel' && (kapselDeel?.stof
              ? <Kleurrij titel="Kleur hoofddoek" lijst={STOFKLEUREN} waarde={huidig.stofkleur} onKies={(id) => zet('stofkleur', id)} />
              : huidig.kapsel !== 'kapsel-geen' && <Kleurrij titel="Haarkleur" lijst={HAARKLEUREN} waarde={huidig.haarkleur} onKies={(id) => zet('haarkleur', id)} />)}
            {tab === 'kleding' && kledingDeel?.stof && <Kleurrij titel="Kleur" lijst={STOFKLEUREN} waarde={huidig.kledingkleur} onKies={(id) => zet('kledingkleur', id)} />}
            {tab === 'accessoire' && huidig.accessoire === 'accessoire-pet' && <Kleurrij titel="Kleur pet" lijst={STOFKLEUREN} waarde={huidig.stofkleur} onKies={(id) => zet('stofkleur', id)} />}
            {tab === 'achtergrond' && achtergrondDeel?.stof && <Kleurrij titel="Kleur" lijst={STOFKLEUREN} waarde={huidig.achtergrondkleur} onKies={(id) => zet('achtergrondkleur', id)} />}

            {tab !== 'huid' && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
                {delenVoorTab.map((deel) => {
                  const van = heeftDeel(deel.id);
                  const gekozen = huidig[tab] === deel.id;
                  const item = itemsById.get(shopItemIdVoorDeel(deel.id));
                  const prijs = Math.max(0, Number(item?.price ?? deel.prijs) || 0);
                  return (
                    <button
                      key={deel.id}
                      type="button"
                      onClick={() => zet(tab, deel.id)}
                      aria-pressed={gekozen}
                      className={`relative flex flex-col items-center gap-1 rounded-xl border-2 p-1.5 text-center ${gekozen ? 'border-[#087EB5] bg-[#DCEFFA]' : 'border-[#0B0D0F] bg-white hover:bg-[var(--helix-surface-soft)]'}`}
                    >
                      <span className={`block aspect-square w-full overflow-hidden rounded-lg border border-[#0B0D0F] ${van ? '' : 'opacity-80'}`}>
                        <HelixAvatar avatar={{ ...huidig, [tab]: deel.id }} className="h-full w-full" titel={deel.titel} />
                      </span>
                      <span className="line-clamp-2 text-[11px] font-extrabold leading-tight">{deel.titel.replace(' (setbonus)', '')}</span>
                      {!van && (
                        <span className="absolute right-1 top-1 flex items-center gap-0.5 rounded-full border border-[#0B0D0F] bg-[#FFF0B8] px-1.5 text-[10px] font-black">
                          {deel.bonusVan
                            ? <><Gift size={10} aria-hidden="true" /> bonus</>
                            : <><Lock size={10} aria-hidden="true" /><Coins size={10} aria-hidden="true" />{prijs}</>}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
