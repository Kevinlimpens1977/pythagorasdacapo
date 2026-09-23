import { useEffect, useState } from 'react';
import { BarChart3, Brush, Check, Eye, Lightbulb, Loader2, Plus, Trophy, Vote, X } from 'lucide-react';
import {
  afbeeldingUrl, beoordeelInzending, getBeloningMeting, maakStemming, maakWedstrijd,
  subscribeKlasInzendingen, subscribeKlasStemmingen, subscribeKlasWedstrijden, wijzigStemming, wijzigWedstrijd
} from '../../services/fase5Service';
import { createOrUpdateTokenShopItem } from '../../services/tokenService';

// Fase 5 (SPELOPZET-FASE5-EXTRAS.md): meten, stemmingen en de ontwerpwedstrijd.

function Afbeelding({ pad }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    let actief = true;
    afbeeldingUrl(pad).then((gevonden) => { if (actief) setUrl(gevonden); }).catch(() => {});
    return () => { actief = false; };
  }, [pad]);
  return url
    ? <img src={url} alt="" className="h-full w-full object-contain" />
    : <span className="flex h-full items-center justify-center"><Loader2 size={18} className="animate-spin" /></span>;
}

function Meting({ klasId }) {
  const [meting, setMeting] = useState(null);
  const [fout, setFout] = useState('');
  useEffect(() => {
    let actief = true;
    getBeloningMeting(klasId, 6)
      .then((data) => { if (actief) { setMeting(data); setFout(''); } })
      .catch((error) => { if (actief) setFout(error?.message || 'De meting kon niet geladen worden.'); });
    return () => { actief = false; };
  }, [klasId]);

  if (fout) return <p className="text-sm font-bold text-[var(--color-red-ink)]">{fout}</p>;
  if (!meting) return <p className="flex items-center gap-2 text-sm text-[var(--helix-muted)]"><Loader2 size={15} className="animate-spin" /> Meting laden.</p>;
  const advies = meting.weken[0]?.advies || [];
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-[var(--helix-muted)]">
            <tr>
              <th className="py-1 pr-3">Week</th>
              <th className="py-1 pr-3">Actief</th>
              <th className="py-1 pr-3">Weekdoel DV</th>
              <th className="py-1 pr-3">Beheersing</th>
              <th className="py-1 pr-3">Tokens</th>
              <th className="py-1 pr-3">Plafond</th>
              <th className="py-1 pr-3">Gekocht</th>
              <th className="py-1">Privileges</th>
            </tr>
          </thead>
          <tbody>
            {meting.weken.map((week) => (
              <tr key={week.week} className="border-t border-[var(--helix-border)]">
                <td className="py-1.5 pr-3 font-bold">{week.week}</td>
                <td className="py-1.5 pr-3">{week.actief} / {week.leerlingen}</td>
                <td className="py-1.5 pr-3">{week.weekdoelTotaal ? `${week.weekdoelGehaald} / ${week.weekdoelTotaal}` : '-'}</td>
                <td className="py-1.5 pr-3">{week.gemiddeldeBeheersing === null ? '-' : `${week.gemiddeldeBeheersing}%`}</td>
                <td className="py-1.5 pr-3">{week.tokens}</td>
                <td className="py-1.5 pr-3">{week.plafondGeraakt}</td>
                <td className="py-1.5 pr-3">{week.aankopen}</td>
                <td className="py-1.5">{week.privileges}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[var(--helix-muted)]">Gemiddeld saldo nu: {meting.gemiddeldSaldo} tokens. Testaccounts tellen niet mee.</p>
      {advies.length > 0 && (
        <ul className="space-y-1">
          {advies.map((regel) => (
            <li key={regel} className="flex items-start gap-2 rounded-lg bg-[#FFF0B8] px-3 py-2 text-sm font-bold"><Lightbulb size={16} className="mt-0.5 shrink-0" aria-hidden="true" />{regel}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stemmingen({ klasId, doe }) {
  const [stemmingen, setStemmingen] = useState([]);
  const [vraag, setVraag] = useState('');
  const [opties, setOpties] = useState(['', '']);
  useEffect(() => subscribeKlasStemmingen(klasId, setStemmingen, () => {}), [klasId]);
  const geldigeOpties = opties.map((optie) => optie.trim()).filter(Boolean);

  return (
    <div className="space-y-3">
      <form
        className="space-y-2 rounded-xl border border-dashed border-[var(--helix-border)] p-3"
        onSubmit={(event) => {
          event.preventDefault();
          doe(() => maakStemming(klasId, vraag, geldigeOpties), 'Stemming staat open.').then(() => { setVraag(''); setOpties(['', '']); });
        }}
      >
        <input value={vraag} onChange={(e) => setVraag(e.target.value)} maxLength={120} placeholder="Vraag, bijvoorbeeld: welk klasdoel willen we?" className="w-full rounded-lg border border-[var(--helix-border)] px-3 py-2 text-sm" />
        <div className="grid gap-2 sm:grid-cols-2">
          {opties.map((optie, index) => (
            <input key={index} value={optie} maxLength={60} onChange={(e) => setOpties(opties.map((oud, i) => (i === index ? e.target.value : oud)))} placeholder={`Optie ${index + 1}`} className="rounded-lg border border-[var(--helix-border)] px-3 py-2 text-sm" />
          ))}
        </div>
        <div className="flex gap-2">
          {opties.length < 4 && <button type="button" onClick={() => setOpties([...opties, ''])} className="flex items-center gap-1 rounded-lg border border-[var(--helix-border)] px-3 py-1.5 text-sm font-bold"><Plus size={14} /> Optie</button>}
          <button type="submit" disabled={!vraag.trim() || geldigeOpties.length < 2} className="helix-btn-solid">Stemming openen</button>
        </div>
      </form>
      {stemmingen.map((stemming) => {
        const totaal = (stemming.telling || []).reduce((som, aantal) => som + aantal, 0);
        return (
          <div key={stemming.id} className="rounded-xl border border-[var(--helix-border)] p-3 text-sm">
            <p className="font-black">{stemming.vraag} <span className="font-normal text-[var(--helix-muted)]">({stemming.status}, {totaal} stemmen)</span></p>
            <ul className="mt-1 space-y-0.5">
              {(stemming.opties || []).map((optie, index) => <li key={index}>{optie}: <strong>{stemming.telling?.[index] || 0}</strong></li>)}
            </ul>
            <div className="mt-2 flex flex-wrap gap-2">
              {stemming.status === 'open' && <button type="button" onClick={() => doe(() => wijzigStemming(stemming.id, { status: 'gesloten' }), 'Stemming gesloten.')} className="rounded-lg border border-[var(--helix-border)] px-2 py-1 text-xs font-bold">Sluiten</button>}
              <button type="button" onClick={() => doe(() => wijzigStemming(stemming.id, { uitslagZichtbaar: !stemming.uitslagZichtbaar }), stemming.uitslagZichtbaar ? 'Uitslag verborgen.' : 'De klas ziet de uitslag.')} className="flex items-center gap-1 rounded-lg border border-[var(--helix-border)] px-2 py-1 text-xs font-bold">
                <Eye size={13} /> {stemming.uitslagZichtbaar ? 'Uitslag verbergen' : 'Uitslag tonen aan de klas'}
              </button>
              {stemming.status === 'gesloten' && <button type="button" onClick={() => doe(() => wijzigStemming(stemming.id, { status: 'archief' }), 'Weggezet.')} className="rounded-lg border border-[var(--helix-border)] px-2 py-1 text-xs font-bold">Wegzetten</button>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Wedstrijden({ klasId, klasNaam, doe }) {
  const [wedstrijden, setWedstrijden] = useState([]);
  const [inzendingen, setInzendingen] = useState([]);
  const [thema, setThema] = useState('');
  const [uitleg, setUitleg] = useState('');
  const [winnaar, setWinnaar] = useState(null);
  useEffect(() => {
    const stoppen = [
      subscribeKlasWedstrijden(klasId, setWedstrijden, () => {}),
      subscribeKlasInzendingen(klasId, setInzendingen, () => {})
    ];
    return () => stoppen.forEach((stop) => stop?.());
  }, [klasId]);

  const maakItem = async ({ wedstrijd, inzending, itemType, prijs }) => {
    const imageUrl = await afbeeldingUrl(inzending.publiekPad);
    const voornaam = String(inzending.naam || 'een leerling').split(' ')[0];
    await createOrUpdateTokenShopItem({
      itemId: `ontwerp-${inzending.id}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
      title: wedstrijd.thema,
      description: `Ontworpen door ${voornaam} (${klasNaam}).`,
      price: Number(prijs) || 150,
      itemType,
      rarity: 'rare',
      imageUrl,
      imageStoragePath: '',
      enabled: true,
      repeatable: false,
      sortOrder: 700,
      previewStyle: { accent: '#793AC7', ontwerpVan: voornaam }
    });
    await wijzigWedstrijd(wedstrijd.id, { winnaarInzendingId: inzending.id, status: 'gesloten' });
  };

  return (
    <div className="space-y-3">
      <form
        className="space-y-2 rounded-xl border border-dashed border-[var(--helix-border)] p-3"
        onSubmit={(event) => {
          event.preventDefault();
          doe(() => maakWedstrijd(klasId, thema, uitleg), 'Wedstrijd staat open.').then(() => { setThema(''); setUitleg(''); });
        }}
      >
        <input value={thema} onChange={(e) => setThema(e.target.value)} maxLength={60} placeholder="Thema, bijvoorbeeld: een pin voor Binask" className="w-full rounded-lg border border-[var(--helix-border)] px-3 py-2 text-sm" />
        <input value={uitleg} onChange={(e) => setUitleg(e.target.value)} maxLength={200} placeholder="Korte uitleg voor de klas (mag leeg)" className="w-full rounded-lg border border-[var(--helix-border)] px-3 py-2 text-sm" />
        <button type="submit" disabled={!thema.trim()} className="helix-btn-solid">Wedstrijd openen</button>
      </form>

      {wedstrijden.map((wedstrijd) => {
        const eigen = inzendingen.filter((inzending) => inzending.wedstrijdId === wedstrijd.id);
        return (
          <div key={wedstrijd.id} className="rounded-xl border border-[var(--helix-border)] p-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <p className="flex-1 font-black">{wedstrijd.thema} <span className="font-normal text-[var(--helix-muted)]">({wedstrijd.status}, {eigen.length} inzendingen)</span></p>
              {wedstrijd.status === 'open' && <button type="button" onClick={() => doe(() => wijzigWedstrijd(wedstrijd.id, { status: 'gesloten' }), 'Wedstrijd gesloten.')} className="rounded-lg border border-[var(--helix-border)] px-2 py-1 text-xs font-bold">Sluiten</button>}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {eigen.map((inzending) => (
                <figure key={inzending.id} className={`overflow-hidden rounded-lg border ${wedstrijd.winnaarInzendingId === inzending.id ? 'border-[#FFB400] ring-2 ring-[#FFD33D]' : 'border-[var(--helix-border)]'}`}>
                  <div className="aspect-square bg-[var(--helix-surface-soft)]"><Afbeelding pad={inzending.status === 'goedgekeurd' && inzending.publiekPad ? inzending.publiekPad : inzending.storagePath} /></div>
                  <figcaption className="space-y-1 p-1.5 text-xs">
                    <p className="font-bold">{inzending.naam} <span className="font-normal text-[var(--helix-muted)]">{inzending.status}</span></p>
                    <div className="flex flex-wrap gap-1">
                      {inzending.status !== 'goedgekeurd' && <button type="button" onClick={() => doe(() => beoordeelInzending(inzending.id, 'goedgekeurd'), 'Goedgekeurd; de klas ziet het ontwerp.')} className="flex items-center gap-0.5 rounded bg-[var(--color-green-soft)] px-1.5 py-0.5 font-bold text-[var(--color-green-ink)]"><Check size={12} /> Goed</button>}
                      {inzending.status !== 'afgewezen' && <button type="button" onClick={() => doe(() => beoordeelInzending(inzending.id, 'afgewezen'), 'Afgewezen.')} className="flex items-center gap-0.5 rounded bg-[var(--color-red-soft)] px-1.5 py-0.5 font-bold text-[var(--color-red-ink)]"><X size={12} /> Af</button>}
                      {inzending.status === 'goedgekeurd' && !wedstrijd.winnaarInzendingId && (
                        <button type="button" onClick={() => setWinnaar({ wedstrijd, inzending, itemType: 'shopBadge', prijs: 150 })} className="flex items-center gap-0.5 rounded bg-[#FFF0B8] px-1.5 py-0.5 font-bold"><Trophy size={12} /> Winnaar</button>
                      )}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        );
      })}

      {winnaar && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#0B0D0F]/40 p-4" onClick={() => setWinnaar(null)}>
          <div role="dialog" aria-modal="true" aria-label="Winnaar in de shop zetten" onClick={(event) => event.stopPropagation()} className="w-full max-w-sm space-y-3 rounded-2xl bg-white p-5">
            <p className="font-black">Het ontwerp van {winnaar.inzending.naam} in de shop</p>
            <label className="block text-sm font-bold">Soort
              <select value={winnaar.itemType} onChange={(e) => setWinnaar({ ...winnaar, itemType: e.target.value })} className="mt-1 w-full rounded-lg border border-[var(--helix-border)] px-2 py-1.5">
                <option value="shopBadge">Pin</option>
                <option value="profileBanner">Banner</option>
                <option value="titleBadge">Titel</option>
                <option value="avatarFrame">Frame</option>
              </select>
            </label>
            <label className="block text-sm font-bold">Prijs
              <input type="number" min="0" value={winnaar.prijs} onChange={(e) => setWinnaar({ ...winnaar, prijs: e.target.value })} className="mt-1 w-full rounded-lg border border-[var(--helix-border)] px-2 py-1.5" />
            </label>
            <p className="text-xs text-[var(--helix-muted)]">In de shop staat: "Ontworpen door {String(winnaar.inzending.naam).split(' ')[0]} ({klasNaam})". De wedstrijd gaat dicht.</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setWinnaar(null)} className="rounded-lg border border-[var(--helix-border)] px-3 py-1.5 text-sm font-bold">Annuleren</button>
              <button type="button" onClick={() => { const keuze = winnaar; setWinnaar(null); doe(() => maakItem(keuze), 'Het winnende ontwerp staat in de shop.'); }} className="helix-btn-solid">In de shop zetten</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function KlasFase5Beheer({ klasId = '', klasNaam = '' }) {
  const [melding, setMelding] = useState('');
  const [fout, setFout] = useState('');
  const doe = async (actie, tekst) => {
    try {
      await actie();
      setMelding(tekst);
      setFout('');
    } catch (error) {
      setFout(error?.message || 'Dat lukte niet.');
      setMelding('');
    }
  };
  if (!klasId) return null;
  return (
    <section className="helix-card space-y-5 p-5">
      {melding && <p className="rounded-lg bg-[var(--color-green-soft)] px-3 py-2 text-sm font-bold text-[var(--color-green-ink)]">{melding}</p>}
      {fout && <p className="rounded-lg bg-[var(--color-red-soft)] px-3 py-2 text-sm font-bold text-[var(--color-red-ink)]">{fout}</p>}
      <div>
        <h2 className="mb-2 flex items-center gap-2 text-lg font-black text-[var(--helix-navy)]"><BarChart3 size={20} aria-hidden="true" /> Meten: de laatste zes weken</h2>
        <Meting klasId={klasId} />
      </div>
      <div>
        <h2 className="mb-2 flex items-center gap-2 text-lg font-black text-[var(--helix-navy)]"><Vote size={20} aria-hidden="true" /> Stemmingen</h2>
        <Stemmingen klasId={klasId} doe={doe} />
      </div>
      <div>
        <h2 className="mb-2 flex items-center gap-2 text-lg font-black text-[var(--helix-navy)]"><Brush size={20} aria-hidden="true" /> Ontwerpwedstrijd</h2>
        <Wedstrijden klasId={klasId} klasNaam={klasNaam || klasId} doe={doe} />
      </div>
    </section>
  );
}
