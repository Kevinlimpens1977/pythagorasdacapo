import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { bouwKlasbord } from '../lib/klasbord';
import KlasbordTabel, { KlasbordLegenda } from '../components/klasbord/KlasbordTabel';
import { PaginaKop } from '../components/leeromgeving';
import { HelixLaden } from '../components/merk/HelixLogo';

const MINI_BREEDTE = 1600;

const tijdLabel = (tijd) =>
  tijd
    ? new Date(tijd).toLocaleString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '';

const metId = (snapshot) => snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

/**
 * Klasborden: per klas een kaart met een verkleind klasbord (de weergave van
 * het klasbord-artifact), live bijgewerkt. Klik op een kaart voor het hele
 * scherm, met wisselen van klas en hoofdstuk.
 */
export default function AdminKlasbordenPage() {
  const [klassen, setKlassen] = useState(null);
  const [gebruikers, setGebruikers] = useState([]);
  const [voortgang, setVoortgang] = useState([]);
  const [lesstof, setLesstof] = useState(null);
  const [fout, setFout] = useState('');
  const [open, setOpen] = useState(null); // { klasId, nummer }

  useEffect(() => onSnapshot(collection(db, 'klassen'), (snap) => setKlassen(metId(snap)), (err) => setFout(err.message)), []);
  useEffect(() => onSnapshot(query(collection(db, 'users'), where('role', '==', 'student')), (snap) => setGebruikers(metId(snap)), (err) => setFout(err.message)), []);
  useEffect(() => onSnapshot(collection(db, 'voortgang'), (snap) => setVoortgang(snap.docs.map((doc) => doc.data())), (err) => setFout(err.message)), []);

  // De lesstof van alle toegewezen paragrafen; opnieuw als de toewijzing verandert.
  const paragraafSleutel = useMemo(() => {
    const ids = new Set();
    (klassen || []).forEach((klas) => (klas.enabledParagrafen || []).forEach((id) => ids.add(id)));
    return [...ids].sort().join('|');
  }, [klassen]);

  useEffect(() => {
    if (klassen === null) return undefined;
    let levend = true;
    (async () => {
      try {
        const [hoofdstukSnap, paragraafSnap] = await Promise.all([
          getDocs(collection(db, 'hoofdstuk')),
          getDocs(collection(db, 'paragraaf'))
        ]);
        const ids = paragraafSleutel ? paragraafSleutel.split('|') : [];
        const blokken = new Map();
        for (let i = 0; i < ids.length; i += 30) {
          const snap = await getDocs(query(collection(db, 'contentBlocks'), where('paragraafId', 'in', ids.slice(i, i + 30))));
          metId(snap).forEach((blok) => {
            if (!blokken.has(blok.paragraafId)) blokken.set(blok.paragraafId, []);
            blokken.get(blok.paragraafId).push(blok);
          });
        }
        if (!levend) return;
        setLesstof({
          hoofdstukken: new Map(metId(hoofdstukSnap).map((h) => [h.id, h])),
          paragrafen: new Map(metId(paragraafSnap).map((p) => [p.id, p])),
          blokken
        });
      } catch (err) {
        if (levend) setFout(err.message);
      }
    })();
    return () => { levend = false; };
  }, [klassen === null, paragraafSleutel]); // eslint-disable-line react-hooks/exhaustive-deps

  const borden = useMemo(() => {
    if (!klassen || !lesstof) return [];
    return klassen
      .map((klas) => bouwKlasbord({ klas, ...lesstof, gebruikers, voortgang }))
      .sort((a, b) => a.naam.localeCompare(b.naam, 'nl', { numeric: true }));
  }, [klassen, lesstof, gebruikers, voortgang]);

  const geladen = klassen !== null && lesstof !== null;
  const openBord = open ? borden.find((bord) => bord.klasId === open.klasId) : null;

  return (
    <div className="helix-page beheer-stijl">
      <div className="helix-container py-10 md:py-12">
        <PaginaKop
          eyebrow="Voortgang"
          titel="Klasborden"
          uitleg="Per klas in één oogopslag hoe ver iedereen is, live bijgewerkt. Elke kaart toont het hoofdstuk waar de klas nu in werkt. Klik op een kaart voor het hele scherm."
          acties={<KlasbordLegenda />}
        />
        {fout && <p className="lo-melding mt-6" role="alert">Laden lukte niet: {fout}</p>}
        {!geladen && !fout && <HelixLaden tekst="Klasborden laden" />}
        {geladen && (
          <div className="kb-raster mt-8">
            {borden.map((bord) => (
              <KlasKaart key={bord.klasId} bord={bord} onOpen={() => setOpen({ klasId: bord.klasId, nummer: bord.standaardNummer })} />
            ))}
          </div>
        )}
      </div>
      {openBord && (
        <VolledigBord
          bord={openBord}
          borden={borden}
          nummer={open.nummer}
          onKies={(klasId, nummer) => setOpen({ klasId, nummer })}
          onSluit={() => setOpen(null)}
        />
      )}
    </div>
  );
}

function hoofdstukLabel(bord, nummer) {
  const kolom = bord.kolommen.find((k) => k.hoofdstukNr === nummer);
  return kolom ? `H${nummer} ${kolom.hoofdstuk}` : 'geen lesstof';
}

function KlasKaart({ bord, onOpen }) {
  const vakRef = useRef(null);
  const [schaal, setSchaal] = useState(0.25);

  useLayoutEffect(() => {
    const vak = vakRef.current;
    if (!vak) return undefined;
    const meet = () => setSchaal(vak.clientWidth / MINI_BREEDTE);
    meet();
    const waarnemer = new ResizeObserver(meet);
    waarnemer.observe(vak);
    return () => waarnemer.disconnect();
  }, []);

  return (
    <button type="button" className="kb-kaart" onClick={onOpen} aria-label={`Klasbord ${bord.naam} openen`}>
      <div className="kb-mini" ref={vakRef}>
        <div className="kb-mini-binnen" style={{ transform: `scale(${schaal})` }}>
          <div className="kb-bord">
            <KlasbordTabel bord={bord} nummer={bord.standaardNummer} />
          </div>
        </div>
      </div>
      <div>
        <div className="kb-kaartnaam">{bord.naam}</div>
        <div className="kb-kaartsub">
          {hoofdstukLabel(bord, bord.standaardNummer)} · {bord.rijen.length} leerling{bord.rijen.length === 1 ? '' : 'en'}
        </div>
      </div>
    </button>
  );
}

function VolledigBord({ bord, borden, nummer, onKies, onSluit }) {
  const sluitRef = useRef(null);

  useEffect(() => {
    const vorige = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sluitRef.current?.focus();
    const toets = (event) => { if (event.key === 'Escape') onSluit(); };
    window.addEventListener('keydown', toets);
    return () => {
      document.body.style.overflow = vorige;
      window.removeEventListener('keydown', toets);
    };
  }, [onSluit]);

  const actief = bord.nummers.includes(nummer) ? nummer : bord.standaardNummer;

  // Via een portal naar <body>: anders ligt de vaste menubalk van HELIX
  // (sticky, z-index 100) over het bord heen.
  return createPortal(
    <div className="kb-vol" role="dialog" aria-modal="true" aria-label={`Klasbord ${bord.naam}`}>
      <button type="button" ref={sluitRef} className="kb-sluit" onClick={onSluit} aria-label="Sluiten en terug naar het overzicht">
        <X size={28} aria-hidden="true" />
      </button>
      <header className="kb-volkop">
        <div className="kb-groep" role="group" aria-label="Klas">
          {borden.map((ander) => (
            <button
              key={ander.klasId}
              type="button"
              className="kb-knop kb-klasknop"
              aria-pressed={ander.klasId === bord.klasId}
              onClick={() => onKies(ander.klasId, ander.standaardNummer)}
            >
              {ander.naam}
            </button>
          ))}
        </div>
      </header>
      <header className="kb-volkop" style={{ paddingRight: 0 }}>
        <h1 className="kb-voltitel">{bord.naam} · {hoofdstukLabel(bord, actief)}</h1>
        <div className="kb-groep" style={{ alignItems: 'center', gap: 16 }}>
          <KlasbordLegenda />
          <span className="kb-groep" role="group" aria-label="Hoofdstuk">
            {bord.nummers.map((nr) => (
              <button key={nr} type="button" className="kb-knop kb-hknop" aria-pressed={nr === actief} onClick={() => onKies(bord.klasId, nr)}>
                H{nr}
              </button>
            ))}
          </span>
        </div>
      </header>
      <div className="kb-bord" style={{ flex: 1, minHeight: 0 }}>
        <KlasbordTabel bord={bord} nummer={actief} />
      </div>
      <p className="kb-voet">
        Donkergroen is alles goed, groen af, lichtgroen af met veel fouten (minder dan 70% goed in de eerste ronde), rood afgevinkt zonder de vragen te maken, lichtgeel nog te maken, met slotje op slot. Wijs een vakje aan voor de titel en de score.
        {bord.laatsteActiviteit ? ` Laatste activiteit: ${tijdLabel(bord.laatsteActiviteit)}.` : ''} Werkt live bij.
      </p>
    </div>,
    document.body
  );
}
