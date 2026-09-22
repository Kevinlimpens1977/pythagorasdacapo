import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from '../components/auth/AuthProvider';
import { stripChapterTitlePrefix, stripParagraphTitlePrefix } from '../lib/chapterOutline';
import { vertaalLesstofInfoCall } from '../lib/api';
import { getLesTaal } from '../lib/lesTaal';
import { uiAantal, uiStudieduur, uiTekst } from '../lib/uiTaal';

/**
 * De taalkeuze van een leerling buiten de les om: op de lesstofpagina, op de
 * hoofdstukpagina en in het startvenster van een paragraaf.
 *
 * Eén keuze voor de hele route. Hij staat in localStorage onder dezelfde
 * sleutel die de lespagina gebruikt (`helix-lestaal-<uid>`), zodat een leerling
 * die in de les op zijn taal staat ook zijn hoofdstukken in die taal terugziet,
 * en andersom. Het is een weergavekeuze, geen voortgang; hij hoort dus niet in
 * Firestore.
 *
 * De vaste schermteksten komen uit het woordenboek (`uiTaal.js`); de titels,
 * beschrijvingen en leerdoelen komen van de Cloud Function `vertaalLesstofInfo`
 * en worden per sessie onthouden, zodat het wisselen van pagina niets extra's
 * kost.
 */

export const lesTaalOpslagSleutel = (uid = '') => `helix-lestaal-${uid || ''}`;

/**
 * De Nederlandse variant van wat de hook teruggeeft. Componenten die geen
 * taalkeuze meekrijgen (of buiten de leerlingroute staan) tonen daarmee precies
 * de Nederlandse tekst die er eerst hard in stond.
 */
export const nederlandseTaalhulp = {
  lesTaal: '',
  taalActief: false,
  wisselTaal: () => {},
  bezig: false,
  tekst: (sleutel, waarden) => uiTekst(sleutel, '', waarden),
  aantal: (basis, hoeveel, extra) => uiAantal(basis, hoeveel, '', extra),
  studieduur: (minuten) => uiStudieduur(minuten, ''),
  paragraafInfo: () => null,
  hoofdstukInfo: () => null
};

const leesKeuze = (uid) => {
  try {
    return window.localStorage.getItem(lesTaalOpslagSleutel(uid)) === 'aan';
  } catch {
    return false;
  }
};

const schrijfKeuze = (uid, aan) => {
  try {
    window.localStorage.setItem(lesTaalOpslagSleutel(uid), aan ? 'aan' : 'uit');
  } catch {
    // Een browser die opslag weigert mag de lesstof niet breken.
  }
};

export const useLesstofTaal = ({ paragraafIds = [], hoofdstukIds = [] } = {}) => {
  const { currentUser, userData } = useAuth();
  const uid = currentUser?.uid || '';
  const lesTaal = getLesTaal(userData);

  const [taalActief, setTaalActief] = useState(() => leesKeuze(uid));
  const [info, setInfo] = useState({ paragrafen: {}, hoofdstukken: {} });
  const [bezig, setBezig] = useState(false);
  // Wat al is opgehaald of al onderweg is. Zonder dit vraagt elke render met
  // een nieuwe lijst opnieuw dezelfde titels op.
  const opgehaaldRef = useRef(new Set());
  // Leeft dit scherm nog? Bewust een ref en geen vlag per effect: React draait
  // in ontwikkelmodus elk effect twee keer (mount, opruimen, mount). Met een
  // vlag per effect gooide de eerste aanroep zijn eigen antwoord weg terwijl de
  // tweede aanroep dacht dat alles al was opgehaald - en bleef het scherm
  // Nederlands.
  const levendRef = useRef(true);

  useEffect(() => {
    levendRef.current = true;
    return () => { levendRef.current = false; };
  }, []);

  const wisselTaal = useCallback((aan) => {
    setTaalActief(aan);
    schrijfKeuze(uid, aan);
  }, [uid]);

  const actief = Boolean(taalActief && lesTaal);

  // De id-lijsten komen uit een render en zijn elke keer een nieuw array; op de
  // inhoud vergelijken houdt het effect rustig.
  const paragraafSleutel = useMemo(() => [...new Set(paragraafIds.filter(Boolean))].sort().join(','), [paragraafIds]);
  const hoofdstukSleutel = useMemo(() => [...new Set(hoofdstukIds.filter(Boolean))].sort().join(','), [hoofdstukIds]);

  useEffect(() => {
    if (!actief) return undefined;

    const nodigParagrafen = paragraafSleutel ? paragraafSleutel.split(',') : [];
    const nodigHoofdstukken = hoofdstukSleutel ? hoofdstukSleutel.split(',') : [];
    const nieuw = [
      ...nodigParagrafen.map((id) => ({ soort: 'paragraaf', id })),
      ...nodigHoofdstukken.map((id) => ({ soort: 'hoofdstuk', id }))
    ].filter(({ soort, id }) => !opgehaaldRef.current.has(`${lesTaal}:${soort}:${id}`));

    if (!nieuw.length) return undefined;

    nieuw.forEach(({ soort, id }) => opgehaaldRef.current.add(`${lesTaal}:${soort}:${id}`));
    setBezig(true);

    vertaalLesstofInfoCall({
      taal: lesTaal,
      paragraafIds: nieuw.filter((regel) => regel.soort === 'paragraaf').map((regel) => regel.id),
      hoofdstukIds: nieuw.filter((regel) => regel.soort === 'hoofdstuk').map((regel) => regel.id)
    })
      .then((resultaat) => {
        if (!resultaat.success) {
          // Mislukt: de sleutels weer vrijgeven, zodat een volgend scherm het
          // opnieuw mag proberen in plaats van voorgoed Nederlands te blijven.
          nieuw.forEach(({ soort, id }) => opgehaaldRef.current.delete(`${lesTaal}:${soort}:${id}`));
          return;
        }
        if (!levendRef.current) return;
        setInfo((stand) => ({
          paragrafen: { ...stand.paragrafen, ...(resultaat.paragrafen || {}) },
          hoofdstukken: { ...stand.hoofdstukken, ...(resultaat.hoofdstukken || {}) }
        }));
      })
      .finally(() => {
        if (levendRef.current) setBezig(false);
      });

    return undefined;
  }, [actief, lesTaal, paragraafSleutel, hoofdstukSleutel]);

  const tekst = useCallback(
    (sleutel, waarden) => uiTekst(sleutel, actief ? lesTaal : '', waarden),
    [actief, lesTaal]
  );

  const aantal = useCallback(
    (basis, hoeveel, extra) => uiAantal(basis, hoeveel, actief ? lesTaal : '', extra),
    [actief, lesTaal]
  );

  const studieduur = useCallback(
    (minuten) => uiStudieduur(minuten, actief ? lesTaal : ''),
    [actief, lesTaal]
  );

  // De vertaling komt van het CMS-document, en daar staat het nummer vaak nog
  // vóór de titel ("1.1 Natuurwetenschappen"). Het scherm zet dat nummer er zelf
  // al voor; zonder deze opschoning leest een leerling "1.1 1.1 ...".
  const paragraafInfo = useCallback(
    (id) => {
      const vertaling = actief ? info.paragrafen[id] || null : null;
      if (!vertaling) return null;
      return { ...vertaling, titel: stripParagraphTitlePrefix(vertaling.titel) || vertaling.titel };
    },
    [actief, info.paragrafen]
  );

  const hoofdstukInfo = useCallback(
    (id) => {
      const vertaling = actief ? info.hoofdstukken[id] || null : null;
      if (!vertaling) return null;
      return { ...vertaling, titel: stripChapterTitlePrefix(vertaling.titel) || vertaling.titel };
    },
    [actief, info.hoofdstukken]
  );

  return {
    lesTaal,
    taalActief: actief,
    wisselTaal,
    bezig,
    tekst,
    aantal,
    studieduur,
    paragraafInfo,
    hoofdstukInfo
  };
};

export default useLesstofTaal;
