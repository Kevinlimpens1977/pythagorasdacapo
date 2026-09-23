import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithCustomToken } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { AlertTriangle, ChevronDown, ChevronRight, Coins, FlaskConical, Loader2, LogIn, RefreshCw } from 'lucide-react';

import { auth, db } from '../services/firebase';
import * as cmsService from '../services/cmsService';
import * as klasService from '../services/klasService';
import * as voortgangService from '../services/voortgangService';
import { startTestleerlingSessieCall } from '../lib/api';
import { bouwKlasTestbeeld, bouwTestdataOverzicht } from '../lib/testleerlingOverzicht';
import { getStudentEffectiveParagrafen } from '../lib/assignmentUtils';

/**
 * Testen als leerling, per klas.
 *
 * Deze pagina laat zien wat een leerling van een klas werkelijk ziet, met
 * dezelfde functies als de leerlingroute zelf, en start een echte sessie als de
 * testleerling van die klas. Dat testen gebeurt met echte opslag: wat je hier
 * maakt, staat daarna gewoon in de testdata van dat account.
 *
 * De pagina leest alleen; alleen de startknop doet iets.
 */

const datumLabel = (ms) => {
  if (!ms) return 'nog niets gedaan';
  return new Date(ms).toLocaleString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const klasNaam = (klas) => klas?.naam || klas?.name || klas?.id || 'Klas';

export default function AdminTestenPage() {
  const [kaarten, setKaarten] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fout, setFout] = useState('');
  const [startBezigUid, setStartBezigUid] = useState('');
  const [openTestdata, setOpenTestdata] = useState({});
  const navigate = useNavigate();

  const laden = useCallback(async () => {
    setLoading(true);
    setFout('');

    try {
      const [klassen, testaccountSnapshot] = await Promise.all([
        klasService.getAvailableKlassen(),
        getDocs(query(collection(db, 'users'), where('isTestaccount', '==', true)))
      ]);

      const testaccounts = testaccountSnapshot.docs.map((item) => ({ uid: item.id, ...item.data() }));
      const testaccountPerKlas = Object.fromEntries(
        testaccounts.filter((account) => account.klasId).map((account) => [account.klasId, account])
      );

      // Elke paragraaf en elk blok één keer ophalen, ook als drie klassen
      // dezelfde lesstof hebben.
      const paragraafIds = [...new Set(klassen.flatMap((klas) => {
        const testaccount = testaccountPerKlas[klas.id];
        return getStudentEffectiveParagrafen(klas, testaccount?.uid || '');
      }))];

      const paragraafDocs = await Promise.all(paragraafIds.map((id) => cmsService.getParagraaf(id).catch(() => null)));
      const paragrafenById = Object.fromEntries(
        paragraafDocs.filter(Boolean).map((paragraaf) => [paragraaf.id, paragraaf])
      );

      const hoofdstukIds = [...new Set(Object.values(paragrafenById).map((paragraaf) => paragraaf.hoofdstukId).filter(Boolean))];
      const hoofdstukDocs = await Promise.all(hoofdstukIds.map((id) => cmsService.getHoofdstuk(id).catch(() => null)));
      const hoofdstukkenById = Object.fromEntries(hoofdstukDocs.filter(Boolean).map((hoofdstuk) => [hoofdstuk.id, hoofdstuk]));

      const blokkenParen = await Promise.all(
        Object.keys(paragrafenById).map(async (id) => [id, await cmsService.getPublicContentBlocks(id).catch(() => [])])
      );
      const blokkenPerParagraaf = Object.fromEntries(blokkenParen);

      const rijen = await Promise.all(klassen.map(async (klas) => {
        const testaccount = testaccountPerKlas[klas.id] || null;
        const beeld = bouwKlasTestbeeld({
          klasData: klas,
          leerlingId: testaccount?.uid || '',
          paragrafenById,
          blokkenPerParagraaf,
          hoofdstukkenById
        });

        let testdata = null;
        let tokens = null;
        if (testaccount) {
          const [records, tokenDoc] = await Promise.all([
            voortgangService.getStudentVoortgang(testaccount.uid).catch(() => []),
            getDoc(doc(db, 'tokenAccounts', testaccount.uid)).catch(() => null)
          ]);
          testdata = bouwTestdataOverzicht({ records, lessen: beeld.lessen });
          tokens = tokenDoc?.exists?.() ? (tokenDoc.data()?.balance ?? tokenDoc.data()?.saldo ?? 0) : 0;
        }

        return { klas, testaccount, beeld, testdata, tokens };
      }));

      rijen.sort((a, b) => klasNaam(a.klas).localeCompare(klasNaam(b.klas), 'nl-NL', { numeric: true }));
      setKaarten(rijen);
    } catch (error) {
      console.error('Testpagina laden mislukt:', error);
      setFout('De klassen konden niet geladen worden.');
      setKaarten([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    laden();
  }, [laden]);

  const startTestsessie = async (testaccount) => {
    setFout('');
    setStartBezigUid(testaccount.uid);

    try {
      const resultaat = await startTestleerlingSessieCall({ uid: testaccount.uid });
      if (!resultaat.success) {
        setFout(resultaat.error || 'De testsessie kon niet gestart worden.');
        return;
      }
      await signInWithCustomToken(auth, resultaat.token);
      navigate('/');
    } catch (error) {
      console.error('Inloggen als testleerling mislukt:', error);
      setFout('Inloggen als testleerling lukte niet. Start de testsessie opnieuw.');
    } finally {
      setStartBezigUid('');
    }
  };

  const zonderTestaccount = useMemo(() => kaarten.filter((kaart) => !kaart.testaccount).length, [kaarten]);

  return (
    <div className="helix-page">
      <div className="helix-container py-10 md:py-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="helix-eyebrow">Testen</p>
            <h1 className="helix-heading-xl mt-2">Testen als leerling</h1>
            <p className="helix-muted mt-3 max-w-2xl text-lg leading-8">
              Per klas zie je wat een leerling werkelijk ziet, en je kunt als testleerling van die
              klas inloggen. Wat je dan maakt, wordt opgeslagen bij dat testaccount en telt nergens mee.
            </p>
          </div>
          <button type="button" onClick={laden} className="btn-secondary inline-flex items-center gap-2" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Verversen
          </button>
        </div>

        {fout && (
          <div className="mt-6 rounded-[var(--helix-radius-md)] border border-[var(--helix-danger)]/35 bg-[var(--helix-soft-pink)] p-4 text-sm font-semibold text-[var(--helix-danger)]">
            {fout}
          </div>
        )}

        {zonderTestaccount > 0 && !loading && (
          <div className="mt-6 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-4 text-sm text-[var(--helix-muted)]">
            {zonderTestaccount === 1 ? 'Eén klas heeft' : `${zonderTestaccount} klassen hebben`} nog geen testleerling.
            Draai <code className="font-mono">node scripts/maak-testleerlingen.mjs --apply</code> om ze aan te maken.
          </div>
        )}

        {loading ? (
          <div className="mt-10 flex items-center gap-3 text-[var(--helix-muted)]">
            <Loader2 size={18} className="animate-spin" />
            Bezig met laden...
          </div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {kaarten.map(({ klas, testaccount, beeld, testdata, tokens }) => {
              const open = openTestdata[klas.id] === true;

              return (
                <section key={klas.id} className="helix-surface p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="helix-heading-md flex items-center gap-2">
                        <FlaskConical size={18} className="text-[var(--helix-purple)]" />
                        {klasNaam(klas)}
                      </h2>
                      <p className="helix-muted mt-1 text-sm">
                        Leerroute: {beeld.route || 'geen route'} &middot; {beeld.aantalZichtbaar} paragrafen open, {beeld.aantalBlokken} lesblokken{beeld.aantalOpSlot > 0 ? ` · ${beeld.aantalOpSlot} op slot` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => testaccount && startTestsessie(testaccount)}
                      className="btn-primary inline-flex items-center gap-2"
                      disabled={!testaccount || startBezigUid === testaccount?.uid}
                    >
                      {startBezigUid === testaccount?.uid ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                      Start testsessie
                    </button>
                  </div>

                  {!testaccount && (
                    <p className="mt-4 text-sm font-semibold text-[var(--helix-danger)]">
                      Nog geen testleerling voor deze klas.
                    </p>
                  )}

                  {beeld.lessen.length === 0 ? (
                    <p className="mt-4 text-sm text-[var(--helix-muted)]">
                      Voor deze klas staat geen lesstof klaar.
                    </p>
                  ) : (
                    <ul className="mt-4 flex flex-col gap-1.5">
                      {beeld.lessen.map((les, index) => (
                        <li key={les.id} className="flex flex-col gap-1.5">
                          {/* Een kopje per hoofdstuk, zoals de leerling het ziet. */}
                          {les.hoofdstukId !== beeld.lessen[index - 1]?.hoofdstukId && (
                            <p className={`text-xs font-black uppercase tracking-wide text-[var(--helix-muted)] ${index > 0 ? 'mt-2' : ''}`}>
                              Hoofdstuk {les.hoofdstukNummer < 999 ? les.hoofdstukNummer : '?'}{les.hoofdstukTitel ? ` · ${les.hoofdstukTitel}` : ''}
                              {les.opSlot && ' · op slot'}
                            </p>
                          )}
                          <span className={`flex items-baseline justify-between gap-3 text-sm ${les.opSlot ? 'opacity-60' : ''}`}>
                            <span className="font-semibold text-[var(--helix-navy)]">{les.label}</span>
                            <span className="shrink-0 text-[var(--helix-muted)]">
                              {les.opSlot ? 'op slot' : `${les.aantalBlokken} ${les.aantalBlokken === 1 ? 'lesblok' : 'lesblokken'}`}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {beeld.problemen.length > 0 && (
                    <ul className="mt-4 flex flex-col gap-2">
                      {beeld.problemen.map((probleem) => (
                        <li key={`${probleem.soort}-${probleem.paragraafId}`} className="flex items-start gap-2 rounded-[var(--helix-radius-md)] bg-[var(--helix-soft-pink)] p-3 text-sm text-[var(--helix-danger)]">
                          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                          <span>{probleem.tekst}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {testaccount && testdata && (
                    <div className="mt-5 border-t border-[var(--helix-border)] pt-4">
                      <button
                        type="button"
                        onClick={() => setOpenTestdata((stand) => ({ ...stand, [klas.id]: !open }))}
                        className="flex w-full items-center justify-between gap-3 text-sm font-bold text-[var(--helix-navy)]"
                        aria-expanded={open}
                      >
                        <span className="inline-flex items-center gap-2">
                          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          Testdata ({testdata.totaalRecords} {testdata.totaalRecords === 1 ? 'record' : 'records'})
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--helix-muted)]">
                          <Coins size={15} />
                          {tokens ?? 0}
                        </span>
                      </button>

                      {open && (
                        <div className="mt-3 flex flex-col gap-2 text-sm">
                          <p className="text-[var(--helix-muted)]">
                            Laatste activiteit: {datumLabel(testdata.laatsteActiviteitMs)}
                          </p>
                          {testdata.regels.map((regel) => (
                            <div key={regel.paragraafId} className="flex items-baseline justify-between gap-3">
                              <span className="text-[var(--helix-navy)]">{regel.label}</span>
                              <span className="shrink-0 text-[var(--helix-muted)]">
                                {regel.afgerond} van {regel.totaal} af
                              </span>
                            </div>
                          ))}
                          {testdata.losseParagrafen.length > 0 && (
                            <p className="text-[var(--helix-muted)]">
                              Ook werk in lesstof die deze klas niet meer heeft: {testdata.losseParagrafen.join(', ')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
