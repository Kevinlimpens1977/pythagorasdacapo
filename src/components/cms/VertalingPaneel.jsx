import { useEffect, useState } from 'react';
import { AlertTriangle, Check, Languages, Loader2, Trash2 } from 'lucide-react';
import { beschikbareTalen, bronVingerafdruk, taalLabel, taalNederlands } from '../../lib/lesTaal';
import { bewaarDocentVertaling, haalOpgeslagenVertaling, verwijderVertaling } from '../../services/lesTaalService';
import { haalVertaling } from '../../services/vertaalService';

/**
 * Bron en vertaling naast elkaar, zodat de docent een machinevertaling kan
 * bijsturen. Wat hier opgeslagen wordt, overschrijft de machine daarna niet
 * meer; bij een gewijzigde Nederlandse tekst komt er een seintje.
 *
 * Twee dingen zijn hier belangrijk:
 * - Vastzetten bewaart ook de vertaalde vraagteksten en antwoordopties. Die
 *   staan daarom hieronder in beeld: de docent moet kunnen zien wat hij
 *   vastzet, niet alleen de titel en de theorietekst.
 * - Vastzetten is niet het einde. Weggooien is de weg terug, want daarna maakt
 *   de machine bij de eerstvolgende aanvraag een nieuwe vertaling.
 */
export default function VertalingPaneel({ blok }) {
  const [taal, setTaal] = useState(beschikbareTalen()[0].code);
  const [vertaling, setVertaling] = useState(null);
  const [bezig, setBezig] = useState(false);
  const [maken, setMaken] = useState(false);
  const [weggooien, setWeggooien] = useState(false);
  // Opgehoogd na het maken of weggooien van een vertaling, zodat het effect
  // hieronder het document opnieuw ophaalt en het paneel de nieuwe stand toont.
  const [herlaad, setHerlaad] = useState(0);
  // Beide onthouden de blockId__taal-sleutel waar ze bij horen (niet zomaar
  // true/false), zodat "Opgeslagen." of een foutmelding nooit blijft hangen
  // na het wisselen van taal of blok: zie huidigeSleutel hieronder.
  const [bewaard, setBewaard] = useState(null);
  const [fout, setFout] = useState(null);

  useEffect(() => {
    let gestopt = false;
    haalOpgeslagenVertaling(blok.id, taal).then((gevonden) => {
      if (!gestopt) setVertaling(gevonden);
    });
    return () => { gestopt = true; };
  }, [blok.id, taal, herlaad]);

  // Geen setState vooraf om de vorige vertaling weg te halen (dat mag niet
  // synchroon in een effect): het opgehaalde document draagt zijn eigen
  // blockId__taal-sleutel, dus een vertaling die niet bij de huidige keuze
  // hoort telt hier gewoon als "nog niet geladen". Dezelfde sleutel filtert
  // hieronder ook "Opgeslagen." en de foutmelding, zodat die meteen (zonder
  // op een nieuwe ophaalbeurt te wachten) verdwijnen zodra de docent van taal
  // of blok wisselt.
  const huidigeSleutel = `${blok.id}__${taal}`;
  const weergave = vertaling && vertaling.id === huidigeSleutel ? vertaling : null;
  const opgeslagen = bewaard === huidigeSleutel;
  const foutmelding = fout && fout.sleutel === huidigeSleutel ? fout.bericht : null;

  const verouderd = Boolean(weergave) && weergave.bronVingerafdruk !== bronVingerafdruk(blok);

  // De Nederlandse vragen uit het blok zelf, met de vertaalde tekst ernaast.
  // Koppelen gaat op id, precies zoals voegVertalingSamen dat bij de leerling
  // doet, zodat hier hetzelfde in beeld staat als wat de leerling straks leest.
  const bronItems = Array.isArray(blok.content?.items) ? blok.content.items : [];
  const vertaaldePerId = new Map(
    (Array.isArray(weergave?.items) ? weergave.items : [])
      .filter((item) => String(item?.id || '').trim())
      .map((item) => [String(item.id).trim(), item])
  );

  const opslaan = async () => {
    setBezig(true);
    setBewaard(null);
    setFout(null);
    try {
      await bewaarDocentVertaling(blok.id, taal, {
        titel: weergave?.titel || '',
        html: weergave?.html || '',
        items: weergave?.items || [],
        bronVingerafdruk: bronVingerafdruk(blok)
      });
      setBewaard(huidigeSleutel);
    } catch (err) {
      console.error('Vertaling opslaan mislukt:', err);
      setFout({ sleutel: huidigeSleutel, bericht: 'Opslaan is niet gelukt. Probeer het opnieuw.' });
    } finally {
      setBezig(false);
    }
  };

  // De vertaling nu laten maken, in plaats van te wachten tot een leerling op
  // de knop drukt. Zonder dit is de eerste nieuwkomer de proefpersoon: hij
  // wacht op het model en ziet als eerste wat er uitkomt.
  const nuVertalen = async () => {
    setMaken(true);
    setBewaard(null);
    setFout(null);
    try {
      const { mislukt } = await haalVertaling(blok.id, taal);
      if (mislukt) {
        setFout({
          sleutel: huidigeSleutel,
          bericht: 'Vertalen is niet gelukt. Probeer het opnieuw. Staat het blok nog op concept, publiceer het dan eerst.'
        });
      }
      setHerlaad((teller) => teller + 1);
    } finally {
      setMaken(false);
    }
  };

  const nuWeggooien = async () => {
    const zeker = window.confirm(
      `De opgeslagen vertaling in het ${taalNederlands(taal)} wordt weggegooid.`
      + ' Heb je hem zelf nagekeken of aangepast, dan is dat werk weg.'
      + ' Daarna maakt de machine bij de eerstvolgende aanvraag een nieuwe vertaling. Doorgaan?'
    );
    if (!zeker) return;

    setWeggooien(true);
    setBewaard(null);
    setFout(null);
    try {
      await verwijderVertaling(blok.id, taal);
      setHerlaad((teller) => teller + 1);
    } catch (err) {
      console.error('Vertaling weggooien mislukt:', err);
      setFout({ sleutel: huidigeSleutel, bericht: 'Weggooien is niet gelukt. Probeer het opnieuw.' });
    } finally {
      setWeggooien(false);
    }
  };

  return (
    <section className="helix-surface mt-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-black text-[var(--helix-navy)]">Vertaling nakijken</h2>
        <select
          value={taal}
          onChange={(event) => setTaal(event.target.value)}
          aria-label="Taal van de vertaling"
          className="rounded-xl border border-[var(--helix-border)] bg-white px-3 py-2 text-sm font-bold"
        >
          {beschikbareTalen().map((optie) => (
            <option key={optie.code} value={optie.code}>{optie.nederlands}</option>
          ))}
        </select>
      </div>

      {!weergave && (
        <p className="helix-muted mt-3 text-sm">
          Er is nog geen vertaling in het {taalLabel(taal)}. Maak hem nu, dan hoeft de eerste
          leerling er niet op te wachten en zie je zelf eerst wat eruit komt.
        </p>
      )}

      {verouderd && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">
          <AlertTriangle size={16} aria-hidden="true" />
          De Nederlandse tekst is gewijzigd sinds deze vertaling is nagekeken.
        </p>
      )}

      {weergave && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="helix-eyebrow">Nederlands</p>
            <p className="mt-2 font-black">{blok.title}</p>
            <div className="lesson-prose mt-2 text-sm" dangerouslySetInnerHTML={{ __html: blok.content?.html || '' }} />
          </div>
          <div>
            <p className="helix-eyebrow">{taalLabel(taal)}</p>
            <input
              value={weergave.titel || ''}
              onChange={(event) => setVertaling({ ...weergave, titel: event.target.value })}
              aria-label="Vertaalde bloktitel"
              className="mt-2 w-full rounded-xl border border-[var(--helix-border)] px-3 py-2 font-black"
            />
            <textarea
              value={weergave.html || ''}
              onChange={(event) => setVertaling({ ...weergave, html: event.target.value })}
              aria-label="Vertaalde tekst van dit blok"
              rows={10}
              className="mt-2 w-full rounded-xl border border-[var(--helix-border)] px-3 py-2 font-mono text-xs"
            />
          </div>
        </div>
      )}

      {/* De vraagteksten en antwoordopties gaan bij het vastzetten mee. Ze
          staan daarom in beeld: anders zet de docent tekst vast die hij nooit
          gezien heeft, en vertaalt de machine dit blok in deze taal daarna
          nooit meer opnieuw. */}
      {weergave && bronItems.length > 0 && (
        <div className="mt-6">
          <p className="helix-eyebrow">Vragen en antwoordopties</p>
          <p className="helix-muted mt-1 text-sm">
            Deze tekst wordt bij het vastzetten mee opgeslagen. Alleen wat de leerling leest is
            vertaald; de antwoorden zelf en de volgorde blijven ongewijzigd.
          </p>
          <div className="mt-3 space-y-3">
            {bronItems.map((bronItem, index) => {
              const vertaald = vertaaldePerId.get(String(bronItem?.id || '').trim());
              const bronOpties = Array.isArray(bronItem?.options) ? bronItem.options : [];
              const vertaaldeOpties = new Map(
                (Array.isArray(vertaald?.options) ? vertaald.options : [])
                  .filter((optie) => String(optie?.id || '').trim())
                  .map((optie) => [String(optie.id).trim(), String(optie?.text || '')])
              );

              return (
                <div
                  key={bronItem?.id || `vraag-${index}`}
                  className="grid gap-4 rounded-xl border border-[var(--helix-border)] bg-white p-3 lg:grid-cols-2"
                >
                  <div>
                    <p className="helix-eyebrow">Vraag {index + 1} - Nederlands</p>
                    <p className="mt-1 text-sm font-bold text-[var(--helix-navy)]">{bronItem?.prompt || ''}</p>
                    {bronOpties.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm">
                        {bronOpties.map((optie, optieIndex) => (
                          <li key={optie?.id || `optie-${optieIndex}`} className="helix-muted">
                            {optie?.text || ''}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <p className="helix-eyebrow">Vraag {index + 1} - {taalLabel(taal)}</p>
                    {vertaald ? (
                      <>
                        <p className="mt-1 text-sm font-bold text-[var(--helix-navy)]">{vertaald.prompt || ''}</p>
                        {bronOpties.length > 0 && (
                          <ul className="mt-2 space-y-1 text-sm">
                            {bronOpties.map((optie, optieIndex) => (
                              <li key={optie?.id || `optie-${optieIndex}`} className="helix-muted">
                                {vertaaldeOpties.get(String(optie?.id || '').trim()) || (optie?.text || '')}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <p className="helix-muted mt-1 text-sm">
                        Geen vertaling voor deze vraag. De leerling leest hier de Nederlandse tekst.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!weergave && (
          <button
            type="button"
            onClick={nuVertalen}
            disabled={maken}
            className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm"
          >
            {maken ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Languages size={16} aria-hidden="true" />}
            {maken ? 'Bezig met vertalen...' : 'Vertaling nu maken'}
          </button>
        )}

        {weergave && (
          <>
            <button
              type="button"
              onClick={opslaan}
              disabled={bezig}
              className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm"
            >
              {bezig ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
              Vastzetten als nagekeken
            </button>
            <button
              type="button"
              onClick={nuWeggooien}
              disabled={weggooien}
              className="btn-secondary inline-flex items-center gap-2 px-5 py-3 text-sm"
            >
              {weggooien ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Trash2 size={16} aria-hidden="true" />}
              Vertaling weggooien
            </button>
          </>
        )}
      </div>

      {maken && (
        <p className="helix-muted mt-2 text-sm">
          Het model vertaalt dit blok. Bij een lang blok duurt dat een paar tellen.
        </p>
      )}

      {opgeslagen && <p className="mt-2 text-sm font-bold text-emerald-700">Opgeslagen.</p>}

      {foutmelding && (
        <p className="mt-2 inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
          <AlertTriangle size={16} aria-hidden="true" />
          {foutmelding}
        </p>
      )}
    </section>
  );
}
