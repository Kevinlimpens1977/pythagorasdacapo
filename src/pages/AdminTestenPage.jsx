import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithCustomToken } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { AlertTriangle, Coins, House, Loader2, RefreshCw } from 'lucide-react';

import { auth, db } from '../services/firebase';
import * as cmsService from '../services/cmsService';
import * as klasService from '../services/klasService';
import * as voortgangService from '../services/voortgangService';
import { startTestleerlingSessieCall } from '../lib/api';
import { bouwKlasTestbeeld, bouwTestdataOverzicht, groepeerOpLesstof, hoofdstukkenVanLessen, problemenVanGroep } from '../lib/testleerlingOverzicht';
import { aantalTekst, bewaarTestsessieDoel, hoofdstukOnderregel, splitsParagraafLabel, testsessieDoelRoute } from '../lib/leeromgeving';
import { HoofdstukRij, Kaart, KaartKop, Keuzeknoppen, Label, PaginaKop, ParagraafRij, StartKnop } from '../components/leeromgeving';
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
  const [gekozenPerGroep, setGekozenPerGroep] = useState({});
  const [openHoofdstuk, setOpenHoofdstuk] = useState({});
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

      // De naam van het vak boven een groepskaart ("Digitale vaardigheden · 8 klassen").
      const vakIds = [...new Set(Object.values(hoofdstukkenById).map((hoofdstuk) => hoofdstuk.vakId).filter(Boolean))];
      const vakDocs = await Promise.all(vakIds.map((id) => getDoc(doc(db, 'vak', id)).catch(() => null)));
      const vakNaamById = Object.fromEntries(
        vakDocs.filter((vakDoc) => vakDoc?.exists?.()).map((vakDoc) => [vakDoc.id, vakDoc.data().name || vakDoc.data().naam || vakDoc.id])
      );

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

        const vakNaam = vakNaamById[hoofdstukkenById[beeld.lessen[0]?.hoofdstukId]?.vakId] || '';
        return { klas, testaccount, beeld, testdata, tokens, vakNaam };
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

  const startTestsessie = async (testaccount, doelRoute = '/') => {
    if (!testaccount) return;
    setFout('');
    setStartBezigUid(testaccount.uid);

    try {
      const resultaat = await startTestleerlingSessieCall({ uid: testaccount.uid });
      if (!resultaat.success) {
        setFout(resultaat.error || 'De testsessie kon niet gestart worden.');
        return;
      }
      // De gekozen plek eerst bewaren: na het wisselen van aanmelding stuurt de
      // beveiliging van deze beheerpagina naar de startpagina. AppShell springt
      // daarna naar de plek zodra de testleerling binnen is.
      bewaarTestsessieDoel(window.sessionStorage, testaccount.uid, doelRoute);
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
  const groepen = useMemo(() => groepeerOpLesstof(kaarten), [kaarten]);
  const bezig = startBezigUid !== '';

  return (
    <div className="helix-page lo-tekst">
      <div className="helix-container flex flex-col gap-6 py-10 md:py-12">
        <PaginaKop
          eyebrow="Testen"
          titel="Testen als leerling"
          uitleg="Klassen die precies dezelfde lesstof zien, staan samen in één kaart. Kies een klas en start als testleerling op de startpagina, bij een hoofdstuk of meteen in een paragraaf. Wat je maakt, telt nergens mee."
          acties={(
            <button type="button" onClick={laden} className="lo-knop-tweede" disabled={loading}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
              Verversen
            </button>
          )}
        />

        {fout && <p className="lo-melding lo-melding--fout" role="alert">{fout}</p>}

        {zonderTestaccount > 0 && !loading && (
          <p className="lo-melding lo-melding--info">
            <span>
              {zonderTestaccount === 1 ? 'Eén klas heeft' : `${zonderTestaccount} klassen hebben`} nog geen testleerling.
              Draai <code className="font-mono">node scripts/maak-testleerlingen.mjs --apply</code> om ze aan te maken.
            </span>
          </p>
        )}

        {loading ? (
          <p className="lo-melding lo-melding--info">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Bezig met laden...
          </p>
        ) : (
          <div className="lo-kaartenraster">
            {groepen.map((groep) => {
              const kaart = groep.kaarten.find((item) => item.klas.id === gekozenPerGroep[groep.sleutel])
                || groep.kaarten.find((item) => item.testaccount)
                || groep.kaarten[0];
              const { klas, testaccount, beeld, testdata, tokens, vakNaam } = kaart;
              const hoofdstukken = hoofdstukkenVanLessen(beeld.lessen);
              const meer = groep.kaarten.length > 1;
              const inclusie = hoofdstukken.some((hoofdstuk) => hoofdstuk.inclusie);
              const groepProblemen = problemenVanGroep(groep, klasNaam);
              const startUit = !testaccount || bezig;
              const start = (doel) => startTestsessie(testaccount, testsessieDoelRoute(doel));

              return (
                <Kaart key={groep.sleutel} inclusie={inclusie}>
                  {meer ? (
                    <KaartKop
                      titel={`${vakNaam ? `${vakNaam} · ` : ''}${groep.kaarten.length} klassen`}
                      uitleg="Deze klassen zien precies dezelfde lesstof. Elke klas heeft wel een eigen testleerling."
                    />
                  ) : (
                    <KaartKop
                      kolf
                      titel={klasNaam(klas)}
                      uitleg={inclusie
                        ? 'Inclusieklas: krijgt de inclusieversie van elk hoofdstuk.'
                        : `${vakNaam ? `${vakNaam} · ` : ''}leerroute ${beeld.route || 'geen'}`}
                    />
                  )}

                  {meer && (
                    <Keuzeknoppen
                      label="Log in als testleerling van"
                      opties={groep.kaarten.map((item) => ({ id: item.klas.id, naam: klasNaam(item.klas) }))}
                      gekozen={klas.id}
                      onKies={(id) => setGekozenPerGroep((stand) => ({ ...stand, [groep.sleutel]: id }))}
                    />
                  )}

                  {!testaccount && (
                    <p className="lo-melding lo-melding--fout">Nog geen testleerling voor {klasNaam(klas)}.</p>
                  )}

                  {hoofdstukken.length === 0 ? (
                    <p className="lo-melding lo-melding--info">Voor deze klas staat geen lesstof klaar.</p>
                  ) : (
                    <div className="lo-lijst">
                      {hoofdstukken.map((hoofdstuk) => {
                        const sleutel = `${groep.sleutel}|${hoofdstuk.id}`;
                        return (
                          <HoofdstukRij
                            key={hoofdstuk.id || sleutel}
                            nummer={hoofdstuk.nummer}
                            titel={hoofdstuk.titel}
                            onderregel={hoofdstukOnderregel({ paragrafen: hoofdstuk.lessen.length, lesblokken: hoofdstuk.aantalBlokken })}
                            labels={hoofdstuk.inclusie ? <Label kleur="paars">inclusie</Label> : null}
                            opSlot={hoofdstuk.opSlot}
                            open={openHoofdstuk[sleutel] === true}
                            onWissel={() => setOpenHoofdstuk((stand) => ({ ...stand, [sleutel]: !stand[sleutel] }))}
                            onStart={() => start({ soort: 'hoofdstuk', id: hoofdstuk.id })}
                            startUit={startUit}
                          >
                            {hoofdstuk.lessen.map((les) => {
                              const { code, naam } = splitsParagraafLabel(les.label);
                              const regel = testdata?.regels.find((item) => item.paragraafId === les.id);
                              const onderregel = [
                                aantalTekst(les.aantalBlokken, 'lesblok', 'lesblokken'),
                                regel?.afgerond ? `testleerling ${regel.afgerond} van ${regel.totaal} af` : ''
                              ].filter(Boolean).join(' · ');
                              return (
                                <ParagraafRij
                                  key={les.id}
                                  code={code}
                                  naam={naam}
                                  onderregel={onderregel}
                                  onStart={() => start({ soort: 'paragraaf', id: les.id })}
                                  startUit={startUit || les.opSlot}
                                />
                              );
                            })}
                          </HoofdstukRij>
                        );
                      })}
                    </div>
                  )}

                  {groepProblemen.length > 0 && (
                    <ul className="flex flex-col gap-2">
                      {groepProblemen.map((probleem) => (
                        <li key={`${probleem.klas}-${probleem.soort}-${probleem.paragraafId}`} className="lo-melding lo-melding--fout">
                          <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                          <span>{meer ? `${probleem.klas}: ${probleem.tekst}` : probleem.tekst}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="lo-kaart-voet">
                    <span className="inline-flex flex-wrap items-center gap-2">
                      {testdata?.totaalRecords
                        ? <Label kleur="blauw">{aantalTekst(testdata.totaalRecords, 'testrecord', 'testrecords')}</Label>
                        : <span>Nog geen testdata</span>}
                      <span className="lo-tokens"><Coins size={15} aria-hidden="true" />{tokens ?? 0}</span>
                      {testdata?.laatsteActiviteitMs ? <span>Laatste activiteit: {datumLabel(testdata.laatsteActiviteitMs)}</span> : null}
                    </span>
                    <StartKnop icoon={House} bezig={startBezigUid === testaccount?.uid} onClick={() => start({ soort: 'start' })} disabled={startUit}>
                      Start op de startpagina
                    </StartKnop>
                  </div>
                </Kaart>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
