import { useCallback, useEffect, useMemo, useState } from 'react';

import * as cmsService from '../services/cmsService';
import * as klasService from '../services/klasService';
import * as voortgangService from '../services/voortgangService';
import { getEffectiveContentBlocks } from '../lib/assignmentUtils';
import { buildChapterOutlines } from '../lib/chapterOutline';
import { filterLesstofOpKlasRoute, getKlasNiveauId } from '../lib/klasRoute';
import { getEffectiveKlasId } from '../lib/classIdUtils';
import { useAuth } from '../components/auth/AuthProvider';

/**
 * De lesstof van deze leerling, als hoofdstukoverzichten.
 *
 * De lesstofpagina en de hoofdstukpagina tonen hetzelfde materiaal op een ander
 * niveau, dus ze halen het ook op dezelfde manier op. Zonder deze hook zou die
 * ophaalcode twee keer bestaan en vroeg of laat uit elkaar lopen.
 *
 * De voortgang komt in ÉÉN query binnen en wordt hier per paragraaf gesorteerd.
 * Dat was eerder een lus met een losse query per paragraaf; met elf paragrafen
 * stonden er zo ruim twintig rondreizen tussen het openen van de pagina en de
 * eerste letter op het scherm, en dat groeide mee met elk nieuw hoofdstuk.
 */
export const useStudentOutline = () => {
  const { klasData, currentUser, userData, klasId: authKlasId } = useAuth();
  const [paragrafen, setParagrafen] = useState([]);
  const [hoofdstukkenMap, setHoofdstukkenMap] = useState({});
  const [voortgangMap, setVoortgangMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [herlaadTeller, setHerlaadTeller] = useState(0);

  const herlaad = useCallback(() => setHerlaadTeller((teller) => teller + 1), []);

  useEffect(() => {
    let gestopt = false;

    const laden = async () => {
      setLoading(true);

      try {
        const enabledParagraafIds = currentUser?.uid
          ? klasService.getStudentEffectiveParagrafen(klasData, currentUser.uid)
          : klasData?.enabledParagrafen || [];

        if (!enabledParagraafIds?.length) {
          if (!gestopt) {
            setParagrafen([]);
            setHoofdstukkenMap({});
            setVoortgangMap({});
            setLoading(false);
          }
          return;
        }

        const paragraafDetails = await Promise.all(
          enabledParagraafIds.map((id) => cmsService.getParagraaf(id).catch(() => null))
        );

        // Heeft de klas een route (niveauId), dan ziet de leerling alleen de
        // paragrafen van dat niveau; zonder route blijft alles zichtbaar.
        const validParagrafen = filterLesstofOpKlasRoute(
          paragraafDetails.filter(Boolean),
          getKlasNiveauId(klasData)
        );

        const effectiveKlasId = getEffectiveKlasId({ authKlasId, userData, klasData });

        // Lesstof en voortgang tegelijk, niet na elkaar: de voortgang hangt niet
        // van de blokken af, dus hij hoeft er ook niet op te wachten.
        const [paragraafWithContent, alleVoortgang] = await Promise.all([
          Promise.all(
            validParagrafen.map(async (paragraaf) => {
              const [vragen, contentBlocks] = await Promise.all([
                cmsService.getPublicVragen(paragraaf.id).catch(() => []),
                cmsService.getAssignedPublicContentBlocks({
                  paragraafId: paragraaf.id,
                  klasData,
                  userId: currentUser?.uid || ''
                }).catch(() => [])
              ]);
              const visibleContentBlocks = currentUser?.uid
                ? getEffectiveContentBlocks(klasData, currentUser.uid, paragraaf.id, contentBlocks)
                : contentBlocks;

              return {
                ...paragraaf,
                vragen,
                vragenCount: vragen.length,
                contentBlocks: visibleContentBlocks,
                lesblokCount: visibleContentBlocks.length
              };
            })
          ),
          currentUser?.uid
            ? voortgangService.getStudentVoortgang(currentUser.uid, effectiveKlasId).catch(() => [])
            : Promise.resolve([])
        ]);

        const progressMap = {};
        alleVoortgang.forEach((record) => {
          const paragraafId = record?.paragraafId;
          if (!paragraafId) return;
          if (!progressMap[paragraafId]) progressMap[paragraafId] = [];
          progressMap[paragraafId].push(record);
        });

        const hoofdstukIds = [...new Set(paragraafWithContent.map((paragraaf) => paragraaf.hoofdstukId))];
        const hoofdstukken = await Promise.all(
          hoofdstukIds.map((id) => cmsService.getHoofdstuk(id).catch(() => null))
        );

        if (gestopt) return;

        const hoofdstukMap = {};
        hoofdstukken.forEach((hoofdstuk) => {
          if (hoofdstuk) hoofdstukMap[hoofdstuk.id] = hoofdstuk;
        });

        setParagrafen(paragraafWithContent);
        setHoofdstukkenMap(hoofdstukMap);
        setVoortgangMap(progressMap);
      } catch (laadFout) {
        console.error('Lesstof laden mislukt:', laadFout);
        if (!gestopt) {
          setParagrafen([]);
          setHoofdstukkenMap({});
          setVoortgangMap({});
        }
      } finally {
        if (!gestopt) setLoading(false);
      }
    };

    laden();
    return () => { gestopt = true; };
  }, [authKlasId, currentUser, klasData, userData, herlaadTeller]);

  const chapters = useMemo(
    () => buildChapterOutlines({ hoofdstukken: hoofdstukkenMap, paragrafen, voortgangMap }),
    [hoofdstukkenMap, paragrafen, voortgangMap]
  );

  return { chapters, paragrafen, loading, herlaad };
};

export default useStudentOutline;
