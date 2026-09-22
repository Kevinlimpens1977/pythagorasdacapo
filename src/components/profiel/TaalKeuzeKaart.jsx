import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { Check, Languages, Loader2 } from 'lucide-react';

import { db } from '../../services/firebase';
import { useAuth } from '../auth/AuthProvider';
import { beschikbareTalen, getLesTaal } from '../../lib/lesTaal';
import { uiTekst } from '../../lib/uiTaal';

/**
 * De leerling kiest zelf in welke taal hij de uitleg leest.
 *
 * Dit stond eerst alleen in het beheer: één taal per leerling, door de docent
 * ingesteld. In een EOA-klas zitten leerlingen met verschillende moedertalen
 * naast elkaar, en die kunnen nu zelf kiezen zonder te wachten tot iemand het
 * voor ze doet. De docent kan het in Leerlingbeheer nog steeds zetten.
 *
 * Wat de keuze NIET verandert: het nakijken. Een leerling schrijft zijn
 * antwoord altijd in het Nederlands; dat staat zo in de vraag en die zin komt
 * uit `lesTaal.js`, niet uit een model.
 *
 * De kaart schrijft één veld (`lesTaal`) op het eigen gebruikersdocument. De
 * beveiligingsregels laten dat toe zolang rol en testvlag gelijk blijven.
 */
export default function TaalKeuzeKaart() {
  const { currentUser, userData } = useAuth();
  const huidig = getLesTaal(userData);
  const [bezigMet, setBezigMet] = useState(null);
  const [melding, setMelding] = useState('');
  const [fout, setFout] = useState('');

  if (!currentUser?.uid) return null;

  const kies = async (code) => {
    if (code === huidig || bezigMet) return;
    setBezigMet(code);
    setMelding('');
    setFout('');

    try {
      await setDoc(doc(db, 'users', currentUser.uid), { lesTaal: code }, { merge: true });
      // De melding staat in de taal die de leerling net koos: dat is meteen het
      // eerste bewijs dat de keuze is aangekomen.
      setMelding(uiTekst('profiel.taal.opgeslagen', code));
    } catch (error) {
      console.error('Taal opslaan mislukt:', error);
      setFout(uiTekst('profiel.taal.mislukt', huidig));
    } finally {
      setBezigMet(null);
    }
  };

  const knop = (code, label) => {
    const actief = code === huidig;
    return (
      <button
        key={code || 'nl'}
        type="button"
        onClick={() => kies(code)}
        aria-pressed={actief}
        className={`inline-flex items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-black transition-colors ${
          actief
            ? 'border-[var(--helix-purple)] bg-[var(--helix-purple)] text-white'
            : 'border-[var(--helix-border)] bg-white text-[var(--helix-navy)] hover:border-[var(--helix-purple)]'
        }`}
      >
        {bezigMet === code ? <Loader2 size={15} className="animate-spin" /> : actief ? <Check size={15} /> : null}
        {label}
      </button>
    );
  };

  return (
    <section className="helix-card p-6">
      <p className="helix-eyebrow inline-flex items-center gap-2">
        <Languages size={15} />
        {uiTekst('profiel.taal.kop', huidig)}
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[var(--helix-muted)]">
        {uiTekst('profiel.taal.uitleg', huidig)}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {knop('', uiTekst('profiel.taal.nederlands', huidig))}
        {beschikbareTalen().map((taal) => knop(taal.code, taal.label))}
      </div>

      {melding && (
        <p className="mt-3 text-sm font-bold text-[var(--helix-success)]">{melding}</p>
      )}
      {fout && (
        <p className="mt-3 text-sm font-bold text-[var(--helix-danger)]">{fout}</p>
      )}
    </section>
  );
}
