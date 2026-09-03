import { useCallback, useMemo, useState, useEffect } from 'react';
import { Users, AlertTriangle, Search, CheckCircle, ClipboardCheck, Clock, ArrowUpDown, CheckSquare, Square, Star } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, collectionGroup, query, where, onSnapshot } from 'firebase/firestore';

import { isAnswerCorrect } from '../../lib/answerNormalization';
import { useAuth } from '../auth/AuthProvider';
import * as cmsService from '../../services/cmsService';
import * as klasService from '../../services/klasService';
import {
  acknowledgeProgressSignals,
  listenToAcknowledgedProgressSignals
} from '../../services/progressSignalService';
import {
  calculateAssignedProgress,
  getAssignedProgressRecords
} from '../../lib/assignmentUtils';
import { getLearningResultTone } from '../../lib/learningResultUtils';
import {
  buildClassProgressSignalItems,
  buildClassMetricCards,
  buildClassProgressMetrics,
  buildDashboardLensTabs,
  buildKlasFilterOptions,
  filterStudentsByKlas,
  buildParagraphProgressSummary,
  buildStudentMetricCards,
  buildStudentProgressMetrics,
  getVisibleStudentProgressParagraphs
} from '../../lib/progressDashboardMetrics';
import { isOptionalParagraph } from '../../lib/paragraphMetadata';
import { formatProgressAnswer } from '../../lib/progressAnswerFormatter';
import { groupProgressRecordsByStudent } from '../../lib/progressRecordUtils';
import {
  PLUS_PRESENTATIE,
  STAP_STATUS,
  buildAandachtsLijst,
  buildKlasStatusTelling,
  buildKlasVoortgangRijen,
  buildMatrixRijen,
  buildParagraafKolommen,
  buildPlusOverzicht,
  buildStapKolommen,
  buildStapMatrixRijen,
  getPlusSamenvattingLabel,
  getStatusPresentatie,
  groepeerParagrafenPerHoofdstuk,
  resolveStudentAssignments
} from '../../lib/klasVoortgangOverzicht';
import {
  beschrijfItemLeesfout,
  buildNakijkOpdrachten,
  getBesluitPresentatie,
  telNakijkPerLeerling
} from '../../lib/nakijkOpdrachten';
import { beoordeelOpenAntwoord } from '../../services/voortgangService';
import KlasVoortgangMatrix, { PlusChip, StatusLegenda, StatusChip } from './KlasVoortgangMatrix';
import AandachtsLijst from './AandachtsLijst';
import PlusOverzicht from './PlusOverzicht';
import NakijkPaneel from './NakijkPaneel';
import LeerlingStappen, { StappenSpoor } from './LeerlingStappen';
import StudentAvatar from '../common/StudentAvatar';
import HelixBrandBanner from '../common/HelixBrandBanner';

// Helper functie voor relatieve tijd
function getRelativeTime(timestamp) {
  if (!timestamp) return "Nog niet";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 0) return "Nu";
  if (diffInSeconds < 60) return "Nu";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min geleden`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} uur geleden`;

  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
}

// Helper functie voor voortgangskleur
function getProgressColor(percentage) {
  if (percentage < 40) return 'bg-emerald-200';
  if (percentage < 75) return 'bg-emerald-500';
  return 'bg-emerald-700';
}

function SupportMiniBar({ records = [], paragraafId = null }) {
  const completedRecords = records.filter((record) =>
    record.completed === true &&
    (!paragraafId || record.paragraafId === paragraafId)
  );

  if (!completedRecords.length) return null;

  return (
    <div className="mt-2 flex max-w-[160px] flex-wrap gap-1" aria-label="Resultaatkwaliteit">
      {completedRecords.slice(0, 12).map((record) => {
        const tone = getLearningResultTone({
          completed: record.completed,
          isCorrect: record.isCorrect,
          aiHelpCount: record.aiHelpCount || 0,
          resultTier: record.resultTier,
          helpTier: record.helpTier
        });
        return (
          <span
            key={record.id || record.blockId || record.vraagId}
            className={`h-3 w-5 rounded-full border ${tone.borderClass} ${tone.fillClass} ${tone.ringClass}`}
            title={tone.label}
          />
        );
      })}
      {completedRecords.length > 12 && (
        <span className="text-[10px] font-black text-slate-400">+{completedRecords.length - 12}</span>
      )}
    </div>
  );
}

function DashboardLensSwitch({ activeLens = 'class', onSelect, signalCount = 0, nakijkCount = 0 }) {
  const badgeCount = { signals: signalCount, nakijken: nakijkCount };
  const badgeClass = {
    signals: 'bg-red-100 text-red-700',
    nakijken: 'bg-amber-100 text-amber-800'
  };

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Voortgangsweergave">
      {buildDashboardLensTabs(activeLens).map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={tab.active}
          onClick={() => onSelect(tab.key)}
          className={`dashboard-lens-tab ${tab.active ? 'dashboard-lens-tab-active' : ''}`}
        >
          {tab.label}
          {badgeCount[tab.key] > 0 && (
            <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none ${badgeClass[tab.key]}`}>
              {badgeCount[tab.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function StudentProgressRecordList({ records = [], paragraafId }) {
  const paragraphRecords = records
    .filter((record) => !paragraafId || record.paragraafId === paragraafId)
    .sort((a, b) => String(a.blockId || a.vraagId || '').localeCompare(String(b.blockId || b.vraagId || '')));

  if (!paragraphRecords.length) return null;

  return (
    <div className="mt-3 space-y-2">
      {paragraphRecords.map((record, index) => {
        const tone = getLearningResultTone({
          completed: record.completed,
          isCorrect: record.isCorrect,
          aiHelpCount: record.aiHelpCount || 0,
          resultTier: record.resultTier,
          helpTier: record.helpTier
        });
        return (
          <div
            key={record.id || record.blockId || record.vraagId || index}
            className={`rounded-xl border ${tone.borderClass} ${tone.fillClass} ${tone.ringClass} px-3 py-2 text-xs`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-black text-slate-800">
                {record.blockTitle || record.vraagTitle || `Onderdeel ${index + 1}`}
              </span>
              <span className="font-black text-slate-700">
                {record.completed ? tone.label : 'Nog bezig'}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-3 font-semibold text-slate-600">
              <span>Pogingen: {record.attempts || 0}</span>
              <span>AI-vragen: {record.aiHelpCount || 0}</span>
              <span>Status: {record.resultTier || tone.tier}</span>
              <span>Scorefactor: {record.scoreWeight ?? 0}</span>
            </div>
            <p className="mt-1 line-clamp-2 break-all font-medium text-slate-500">
              Antwoord: {formatProgressAnswer(record.lastAnswer)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// Helper functie om te checken of presentatie bekeken is
function hasPresentationViewed(student, chapterId) {
  return student.presentationViewed?.[chapterId]?.hasViewed || false;
}

// Helper functie om viewedAt time te krijgen
function getPresentationViewedTime(student, chapterId) {
  const viewed = student.presentationViewed?.[chapterId];
  if (!viewed?.firstViewedAt) return null;
  return viewed.firstViewedAt.toDate ? viewed.firstViewedAt.toDate() : new Date(viewed.firstViewedAt);
}

// Helper functie voor evaluatiescore
function getEvaluationScore(student, chapterId) {
  const evalData = student.evaluationData?.[chapterId];
  if (!evalData) return null;
  const results = Object.values(evalData);
  if (results.length === 0) return null;
  const correct = results.filter(r => r.isCorrect).length;
  return { correct, total: results.length };
}

export default function ClassOverview() {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewingExercise, setViewingExercise] = useState(null);
  const [activeLens, setActiveLens] = useState('class');
  const [expandedEvidence, setExpandedEvidence] = useState({});
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedChapterForClass, setSelectedChapterForClass] = useState(null);
  const [selectedHoofdstukId, setSelectedHoofdstukId] = useState('');
  const [selectedKlasId, setSelectedKlasId] = useState('');
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [paragraphen, setParagraphen] = useState([]);
  const [contentBlocksByParagraaf, setContentBlocksByParagraaf] = useState({});
  const [klassenMap, setKlassenMap] = useState({});
  const [studentVoortgang, setStudentVoortgang] = useState({});
  // De losse toets- en quizantwoorden. Die staan in de subcollectie
  // voortgang/{uid}_{blockId}/items en komen dus NIET mee met de listener op de
  // collectie `voortgang` hierboven; daarvoor is een collectionGroup nodig.
  const [itemVoortgang, setItemVoortgang] = useState({});
  const [itemsBlokkade, setItemsBlokkade] = useState('');
  const [acknowledgedProgressSignals, setAcknowledgedProgressSignals] = useState([]);
  const [selectedSignalIds, setSelectedSignalIds] = useState([]);
  const [acknowledgingSignals, setAcknowledgingSignals] = useState(false);
  // Nakijken is de enige schrijfactie van dit dashboard, dus de stand ervan
  // (welke kaart is bezig, wat is er net gelukt, wat ging er mis) staat hier
  // en wordt gedeeld door de nakijkstapel en het leerlingoverzicht.
  const [nakijkBezigId, setNakijkBezigId] = useState('');
  const [nakijkMelding, setNakijkMelding] = useState('');
  const [nakijkFout, setNakijkFout] = useState('');

  // Load all paragraphs from CMS hierarchy
  useEffect(() => {
    const loadParagraphen = async () => {
      try {
        const vakken = await cmsService.getVakken();
        const allParagraphen = [];

        for (const vak of vakken) {
          const leerjaren = await cmsService.getLeerjaren(vak.id);
          for (const leerjaar of leerjaren) {
            const niveaus = await cmsService.getNiveaus(leerjaar.id);
            for (const niveau of niveaus) {
              const hoofdstukken = await cmsService.getHoofdstukken(niveau.id);
              for (const hoofdstuk of hoofdstukken) {
                const paragrafen = await cmsService.getParagrafen(hoofdstuk.id);
                allParagraphen.push(...paragrafen.map(p => ({
                  ...p,
                  vakId: vak.id,
                  leerjaarId: leerjaar.id,
                  niveauId: niveau.id,
                  hoofdstukId: hoofdstuk.id,
                  hoofdstukTitle: hoofdstuk.title
                })));
              }
            }
          }
        }

        setParagraphen(allParagraphen);
        const blockEntries = await Promise.all(
          allParagraphen.map(async (paragraaf) => {
            const blocks = await cmsService.getContentBlocks(paragraaf.id, false).catch(() => []);
            return [paragraaf.id, blocks];
          })
        );
        setContentBlocksByParagraaf(Object.fromEntries(blockEntries));
      } catch (error) {
        console.error('Error loading paragraphen:', error);
      }
    };

    loadParagraphen();
  }, []);

  useEffect(() => {
    const loadKlassen = async () => {
      try {
        const klassen = await klasService.getAvailableKlassen();
        setKlassenMap(Object.fromEntries(klassen.map((klas) => [klas.id || klas.klasId, klas])));
      } catch (error) {
        console.error('Error loading klassen for dashboard:', error);
        setKlassenMap({});
      }
    };

    loadKlassen();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'voortgang'),
      (snapshot) => {
        const records = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setStudentVoortgang(groupProgressRecordsByStudent(records));
      },
      (error) => {
        console.error('Error listening to voortgang:', error);
        setStudentVoortgang({});
      }
    );

    return () => unsubscribe();
  }, []);

  /**
   * De antwoorden op losse toets- en quizvragen.
   *
   * Een listener op `collection(db, 'voortgang')` levert alleen de
   * blokdocumenten op; subcollecties komen daar per definitie niet in mee.
   * Zonder deze collectionGroup ziet de nakijkstapel van een toets alleen de
   * opgetelde stand, zonder vraag en zonder antwoord.
   *
   * Het filter op `progressType` hoort bij de Firestore-regel: die staat de
   * groepslezing alleen toe voor documenten die dit veld hebben, en zo'n
   * voorwaarde kan Firestore alleen waarmaken als de query er zelf op filtert.
   * Mislukt de lezing (regel nog niet uitgerold, index ontbreekt), dan wordt dat
   * bewaard als blokkade: de docent krijgt dan geen knoppen te zien die het
   * wachten toch niet kunnen wegnemen.
   */
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collectionGroup(db, 'items'), where('progressType', '==', 'assessmentItem')),
      (snapshot) => {
        const records = snapshot.docs.map((itemDoc) => {
          const data = itemDoc.data();
          // De documentnaam IS het itemId; een leeg veld mag die sleutel niet
          // overschrijven, want zonder itemId is de vraag niet te beoordelen.
          return { ...data, id: itemDoc.id, itemId: data?.itemId || itemDoc.id };
        });
        setItemVoortgang(groupProgressRecordsByStudent(records));
        setItemsBlokkade('');
      },
      (error) => {
        console.error('Error listening to assessment item voortgang:', error);
        setItemVoortgang({});
        setItemsBlokkade(beschrijfItemLeesfout(error));
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = listenToAcknowledgedProgressSignals(
      setAcknowledgedProgressSignals,
      () => setAcknowledgedProgressSignals([])
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Query only students (no orderBy to avoid composite index requirement)
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'student')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by lastActive in JavaScript instead of Firebase query
      studentData.sort((a, b) => {
        const dateA = a.lastActive?.toDate ? a.lastActive.toDate() : new Date(a.lastActive || 0);
        const dateB = b.lastActive?.toDate ? b.lastActive.toDate() : new Date(b.lastActive || 0);
        return dateB - dateA;
      });

      setStudents(studentData);
      setLoading(false);
      setSelectedStudent((current) => {
        if (!current) return current;
        return studentData.find(s => s.id === current.id) || current;
      });
    }, (error) => {
      console.error("Error fetching students:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Welke paragrafen en lesblokken tellen mee voor deze leerling. Staat er een
   * klasselectie klaar, dan is die leidend; zonder klas valt het overzicht
   * terug op de volledige gepubliceerde lesstof, zodat de docent niet naar een
   * leeg scherm kijkt terwijl er wel gewerkt wordt.
   */
  const getStudentScope = useCallback((student, paragraafFilterId = null) => resolveStudentAssignments({
    student,
    klasData: klassenMap[student.klasId] || null,
    paragrafen: paragraphen,
    contentBlocksByParagraaf,
    paragraafFilterId
  }), [contentBlocksByParagraaf, klassenMap, paragraphen]);

  const getStudentParagraafAssignments = useCallback(
    (student, paragraafFilterId = null) => getStudentScope(student, paragraafFilterId).assignments,
    [getStudentScope]
  );

  const getStudentAssignmentSummary = useCallback((student, paragraafFilterId = null) => {
    const assignments = getStudentParagraafAssignments(student, paragraafFilterId);

    return calculateAssignedProgress({
      assignments,
      progressRecords: studentVoortgang[student.id] || []
    });
  }, [getStudentParagraafAssignments, studentVoortgang]);

  const klasFilterOptions = buildKlasFilterOptions({ students, klassenMap });
  const scopedStudents = useMemo(
    () => filterStudentsByKlas(students, selectedKlasId),
    [students, selectedKlasId]
  );
  const selectedKlasOption = klasFilterOptions.find((option) => option.value === selectedKlasId) || klasFilterOptions[0];

  // Stap-voor-stap beeld van de klas: per leerling per paragraaf per lesblok.
  const scopesByStudentId = useMemo(
    () => Object.fromEntries(scopedStudents.map((student) => [student.id, getStudentScope(student)])),
    [scopedStudents, getStudentScope]
  );
  const voortgangRijen = useMemo(
    () => buildKlasVoortgangRijen({
      students: scopedStudents,
      scopesByStudentId,
      recordsByStudentId: studentVoortgang,
      itemRecordsByStudentId: itemVoortgang,
      contentBlocksByParagraaf
    }),
    [scopedStudents, scopesByStudentId, studentVoortgang, itemVoortgang, contentBlocksByParagraaf]
  );
  const voortgangRijPerStudentId = useMemo(
    () => Object.fromEntries(voortgangRijen.map((rij) => [rij.studentId, rij])),
    [voortgangRijen]
  );
  const aandachtsLijst = useMemo(() => buildAandachtsLijst(voortgangRijen), [voortgangRijen]);
  // De werkvoorraad van de docent. Komt uit dezelfde rijen als de matrix, dus
  // het getal op het tabblad en de kaarten eronder kunnen niet uiteenlopen.
  const nakijkOpdrachten = useMemo(
    () => buildNakijkOpdrachten(voortgangRijen, { itemsBlokkade }),
    [voortgangRijen, itemsBlokkade]
  );
  const nakijkPerLeerling = useMemo(() => telNakijkPerLeerling(nakijkOpdrachten), [nakijkOpdrachten]);

  /**
   * De vragen van een toetsblok uit de lesstof, plus de bekende antwoorden per
   * vraag. Nodig om na één beoordeling de opgetelde stand van het blok bij te
   * werken; zonder die twee blijft het blok "wacht op nakijken" melden.
   */
  const getBlokContext = useCallback((opdracht) => {
    if (!opdracht?.itemId) return { blokItems: [], itemRecords: {} };

    const blok = (contentBlocksByParagraaf[opdracht.paragraafId] || [])
      .find((kandidaat) => kandidaat.id === opdracht.blockId) || null;
    const blokItems = Array.isArray(blok?.content?.items) ? blok.content.items : [];
    const itemRecords = Object.fromEntries(
      (itemVoortgang[opdracht.studentId] || [])
        .filter((record) => record.blockId === opdracht.blockId && record.itemId)
        .map((record) => [record.itemId, record])
    );

    return { blokItems, itemRecords };
  }, [contentBlocksByParagraaf, itemVoortgang]);

  /**
   * Het besluit van de docent wegschrijven. De voortganglistener hierboven
   * ververst het scherm vanzelf, dus na een geslaagde schrijfactie verdwijnt de
   * kaart uit de stapel; de melding blijft kort staan als bevestiging.
   */
  const beoordeelStap = useCallback(async (opdracht, besluit, opmerking = '') => {
    if (!opdracht || nakijkBezigId) return false;

    setNakijkBezigId(opdracht.id);
    setNakijkFout('');
    setNakijkMelding('');

    try {
      const { blokItems, itemRecords } = getBlokContext(opdracht);

      await beoordeelOpenAntwoord({
        record: opdracht.record,
        besluit,
        opmerking,
        docent: {
          uid: currentUser?.uid || '',
          displayName: currentUser?.displayName || '',
          email: currentUser?.email || ''
        },
        blokItems,
        itemRecords
      });
      const presentatie = getBesluitPresentatie(besluit);
      const waar = opdracht.itemId
        ? `stap ${opdracht.stapNummer} vraag ${opdracht.vraagNummer}`
        : `stap ${opdracht.stapNummer}`;
      setNakijkMelding(
        `${presentatie?.voltooidLabel || 'Beoordeeld'}: ${opdracht.studentNaam}, ${waar} van ${opdracht.paragraafLabel}. ${presentatie?.gevolg || ''}`.trim()
      );
      return true;
    } catch (error) {
      console.error('Beoordelen is mislukt:', error);
      setNakijkFout(error?.message || 'Beoordelen is mislukt. Probeer het opnieuw.');
      return false;
    } finally {
      setNakijkBezigId('');
    }
  }, [currentUser, getBlokContext, nakijkBezigId]);
  const klasStatusTelling = useMemo(() => buildKlasStatusTelling(voortgangRijen), [voortgangRijen]);
  const hoofdstukGroepen = useMemo(() => groepeerParagrafenPerHoofdstuk(paragraphen), [paragraphen]);
  const actiefHoofdstuk = hoofdstukGroepen.find((groep) => groep.hoofdstukId === selectedHoofdstukId)
    || hoofdstukGroepen[0]
    || null;
  const matrixKolommen = useMemo(
    () => buildParagraafKolommen(actiefHoofdstuk?.paragrafen || []),
    [actiefHoofdstuk]
  );
  const matrixRijen = useMemo(
    () => buildMatrixRijen({ rijen: voortgangRijen, kolommen: matrixKolommen }),
    [voortgangRijen, matrixKolommen]
  );
  // Vrijwillig werk krijgt een eigen lijst naast de matrix. Zie PlusOverzicht:
  // in de matrix zou het als achterstand lezen, hier als winst.
  const plusOverzicht = useMemo(
    () => buildPlusOverzicht(voortgangRijen, { hoofdstukId: actiefHoofdstuk?.hoofdstukId || '' }),
    [voortgangRijen, actiefHoofdstuk]
  );
  const heeftPlusKolommen = matrixKolommen.some((kolom) => kolom.optioneel);
  // De chips boven de matrix tellen hetzelfde hoofdstuk als de kolommen eronder.
  const hoofdstukTelling = useMemo(() => buildKlasStatusTelling(matrixRijen), [matrixRijen]);
  const zonderKlasselectie = voortgangRijen.some((rij) => rij.scopeSource === 'volledigeLesstof');

  // Paragraafweergave: dezelfde matrix, maar dan per stap binnen één paragraaf.
  const stapParagraaf = paragraphen.find((paragraaf) => paragraaf.id === selectedChapterForClass) || null;
  const stapKolommen = useMemo(
    () => (stapParagraaf ? buildStapKolommen(contentBlocksByParagraaf[stapParagraaf.id] || []) : []),
    [stapParagraaf, contentBlocksByParagraaf]
  );
  // Een plusparagraaf onder de loep: de kop vertelt erbij dat deze stof
  // vrijwillig is, anders leest een rij lege vakjes als klassikale achterstand.
  const stapParagraafIsPlus = Boolean(stapParagraaf && isOptionalParagraph(stapParagraaf));
  const stapRijen = useMemo(
    () => (stapParagraaf
      ? buildStapMatrixRijen({ rijen: voortgangRijen, paragraafId: stapParagraaf.id, kolommen: stapKolommen })
      : []),
    [stapParagraaf, voortgangRijen, stapKolommen]
  );

  const summariesByStudentId = Object.fromEntries(
    scopedStudents.map((student) => [student.id, getStudentAssignmentSummary(student)])
  );
  const acknowledgedSignalIds = acknowledgedProgressSignals.map((signal) => signal.signalId || signal.id);
  const openProgressSignals = buildClassProgressSignalItems({
    students: scopedStudents,
    summariesByStudentId,
    recordsByStudentId: studentVoortgang,
    acknowledgedSignalIds
  });
  const openSignalStudentIds = new Set(openProgressSignals.map((signal) => signal.studentId));
  const classMetrics = buildClassProgressMetrics({
    students: scopedStudents,
    summariesByStudentId,
    recordsByStudentId: studentVoortgang
  });
  const displayClassMetrics = {
    ...classMetrics,
    attention: {
      ...classMetrics.attention,
      studentCount: openSignalStudentIds.size,
      recordCount: openProgressSignals.length
    }
  };
  const classMetricCards = buildClassMetricCards(displayClassMetrics);
  const lensFilteredStudents = activeLens === 'signals'
    ? scopedStudents.filter((student) => openSignalStudentIds.has(student.id))
    : scopedStudents;
  const filteredProgressSignals = openProgressSignals.filter((signal) => {
    const haystack = [
      signal.studentName,
      signal.paragraafTitle,
      signal.label,
      signal.detail
    ].join(' ').toLowerCase();
    return haystack.includes(searchQuery.toLowerCase());
  });
  const filteredProgressSignalIds = filteredProgressSignals.map((signal) => signal.id);
  const selectedSignals = filteredProgressSignals.filter((signal) => selectedSignalIds.includes(signal.id));
  const allFilteredSignalsSelected = filteredProgressSignals.length > 0 &&
    filteredProgressSignals.every((signal) => selectedSignalIds.includes(signal.id));

  const toggleSignalSelection = (signalId) => {
    setSelectedSignalIds((current) => (
      current.includes(signalId)
        ? current.filter((id) => id !== signalId)
        : [...current, signalId]
    ));
  };

  const toggleAllFilteredSignals = () => {
    setSelectedSignalIds((current) => {
      if (allFilteredSignalsSelected) {
        return current.filter((id) => !filteredProgressSignalIds.includes(id));
      }
      return [...new Set([...current, ...filteredProgressSignalIds])];
    });
  };

  const acknowledgeSelectedSignals = async () => {
    if (!selectedSignals.length || acknowledgingSignals) return;

    try {
      setAcknowledgingSignals(true);
      await acknowledgeProgressSignals(selectedSignals, {
        actorId: currentUser?.uid || '',
        actorName: currentUser?.displayName || currentUser?.email || ''
      });
      const acknowledgedIds = new Set(selectedSignals.map((signal) => signal.id));
      setSelectedSignalIds((current) => current.filter((id) => !acknowledgedIds.has(id)));
    } catch (error) {
      console.error('Signalen afvinken is mislukt:', error);
      alert('Signalen afvinken is mislukt. Probeer het opnieuw.');
    } finally {
      setAcknowledgingSignals(false);
    }
  };

  const filteredStudents = lensFilteredStudents
    .filter(s =>
      (s.displayName || "Naamloos").toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let compareValue = 0;

      if (sortBy === "name") {
        const nameA = (a.displayName || "Naamloos").toLowerCase();
        const nameB = (b.displayName || "Naamloos").toLowerCase();
        compareValue = nameA.localeCompare(nameB);
      } else if (sortBy === "total") {
        compareValue = getStudentAssignmentSummary(a).percentage - getStudentAssignmentSummary(b).percentage;
      } else if (sortBy === "chapter") {
        compareValue = getStudentAssignmentSummary(a, selectedChapterForClass).percentage - getStudentAssignmentSummary(b, selectedChapterForClass).percentage;
      }

      return sortDirection === "asc" ? compareValue : -compareValue;
    });

  const activeCount = scopedStudents.filter(s => {
    if (!s.lastActive) return false;
    const date = s.lastActive.toDate ? s.lastActive.toDate() : new Date(s.lastActive);
    const diffInMinutes = (new Date() - date) / (1000 * 60);
    return diffInMinutes < 15;
  }).length;
  if (loading) {
    return (
      <div className="mx-auto flex h-64 w-full max-w-7xl flex-col items-center justify-center gap-4 px-6 text-[var(--helix-muted)] md:px-8">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-fuchsia-100 border-t-[var(--helix-purple)]"></div>
        <p className="font-medium">Leerlinggegevens laden...</p>
      </div>
    );
  }

  if (selectedStudent) {
    const studentParagraphSummaries = Object.fromEntries(
      paragraphen.map((paragraaf) => [paragraaf.id, getStudentAssignmentSummary(selectedStudent, paragraaf.id)])
    );
    const visibleStudentParagraphen = getVisibleStudentProgressParagraphs({
      paragraphen,
      summariesByParagraafId: studentParagraphSummaries
    });

    // Group assigned paragraphs by hoofdstuk.
    const paragraafsByHoofdstuk = {};
    visibleStudentParagraphen.forEach(paragraaf => {
      const key = paragraaf.hoofdstukId;
      if (!paragraafsByHoofdstuk[key]) {
        paragraafsByHoofdstuk[key] = [];
      }
      paragraafsByHoofdstuk[key].push(paragraaf);
    });

    const effectiveSelectedChapter = selectedChapter && paragraafsByHoofdstuk[selectedChapter] ? selectedChapter : null;

    // Filter by selected chapter if set and assigned to this student.
    const filteredHoofdstukken = effectiveSelectedChapter
      ? Object.fromEntries(Object.entries(paragraafsByHoofdstuk).filter(([key]) => key === effectiveSelectedChapter))
      : paragraafsByHoofdstuk;

    const overallAssignmentSummary = getStudentAssignmentSummary(selectedStudent);
    const selectedStudentRecords = studentVoortgang[selectedStudent.id] || [];
    const selectedStudentMetrics = buildStudentProgressMetrics({
      summary: overallAssignmentSummary,
      records: selectedStudentRecords
    });
    const selectedStudentMetricCards = buildStudentMetricCards(selectedStudentMetrics);
    // Stap-voor-stap stand van deze leerling, uit hetzelfde overzicht als de klasmatrix.
    const selectedStudentRij = voortgangRijPerStudentId[selectedStudent.id]
      || buildKlasVoortgangRijen({
        students: [selectedStudent],
        scopesByStudentId: { [selectedStudent.id]: getStudentScope(selectedStudent) },
        recordsByStudentId: { [selectedStudent.id]: selectedStudentRecords },
        itemRecordsByStudentId: { [selectedStudent.id]: itemVoortgang[selectedStudent.id] || [] },
        contentBlocksByParagraaf
      })[0];
    const selectedStudentAandacht = selectedStudentRij?.aandacht?.redenen || [];
    // Alleen de open beoordelingen van deze leerling, gegroepeerd op lesblok,
    // zodat de knoppen bij de juiste stap in de lijst terechtkomen. Een toets
    // levert meerdere beoordelingen op hetzelfde blok, dus dit is een lijst.
    const leerlingOpdrachten = buildNakijkOpdrachten(
      selectedStudentRij ? [selectedStudentRij] : [],
      { itemsBlokkade }
    );
    const nakijkPerBlockId = leerlingOpdrachten.reduce((verzameld, opdracht) => {
      const bestaand = verzameld[opdracht.blockId] || [];
      return { ...verzameld, [opdracht.blockId]: [...bestaand, opdracht] };
    }, {});
    const openNakijkVoorLeerling = leerlingOpdrachten.length;

    return (
      <div className="helix-container animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <DashboardLensSwitch
            activeLens="student"
            nakijkCount={nakijkOpdrachten.length}
            onSelect={(lens) => {
              if (lens === 'student') {
                setActiveLens('student');
                return;
              }
              setSelectedStudent(null);
              setSelectedChapter(null);
              setActiveLens(lens);
              setExpandedEvidence({});
            }}
          />
        </div>
        <button
          onClick={() => {
            setSelectedStudent(null);
            setSelectedChapter(null);
            setActiveLens('class');
            setExpandedEvidence({});
          }}
          className="mb-8 flex items-center gap-2 font-bold text-[var(--helix-muted)] transition-colors hover:text-[var(--helix-navy)]"
        >
          <Search className="rotate-180" size={20} /> Terug naar overzicht
        </button>

        <div className="helix-surface mb-8 overflow-hidden">
          <HelixBrandBanner
            variant="compact"
            className="border-0 border-b border-[var(--helix-border)] shadow-none"
            logoClassName="hidden"
          >
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-5">
                <StudentAvatar
                  student={selectedStudent}
                  size="xl"
                  shape="square"
                  fallback="initial"
                  fallbackClassName="bg-blue-500 text-white"
                />
                <div>
                  <h2 className="font-display text-3xl font-extrabold text-[var(--helix-navy)] md:text-4xl">
                    {selectedStudent.displayName || "Naamloos"}
                  </h2>
                  <p className="mt-1 text-lg font-semibold text-[var(--helix-muted)]">{selectedStudent.email}</p>
                  <p className="mt-2 text-sm font-bold text-[var(--helix-purple)]">
                    Laatst actief: {getRelativeTime(selectedStudent.lastActive)}
                  </p>
                  {selectedStudentRij && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <StatusChip status={selectedStudentRij.status}>
                        {selectedStudentRij.afgerondeStappen}/{selectedStudentRij.totaalStappen} stappen -
                        {' '}{selectedStudentRij.statusLabel}
                      </StatusChip>
                      {selectedStudentRij.huidigeParagraaf?.stap && (
                        <span className="text-xs font-bold text-[var(--helix-muted)]">
                          Nu bij {selectedStudentRij.huidigeParagraaf.paragraafLabel}, stap{' '}
                          {selectedStudentRij.huidigeParagraaf.stap.nummer}
                        </span>
                      )}
                      {/* De stappenteller links gaat over de verplichte stof;
                          vrijwillig werk krijgt zijn eigen chip ernaast. */}
                      {selectedStudentRij.plus?.totaalParagrafen > 0 && (
                        <PlusChip titel={PLUS_PRESENTATIE.uitleg}>
                          {getPlusSamenvattingLabel(selectedStudentRij.plus)}
                        </PlusChip>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid w-full gap-3 md:w-auto md:grid-cols-3">
                {selectedStudentMetricCards.map((card) => (
                  <div key={card.key} className="min-w-40 rounded-2xl border border-[var(--helix-border)] bg-white/90 px-5 py-3 shadow-[0_10px_24px_rgba(11,19,43,0.05)]">
                    <div className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--helix-muted)]">{card.label}</div>
                    <div className={`text-xl font-black ${card.tone === 'warning' ? 'text-orange-600' : card.tone === 'quality' ? 'text-emerald-600' : 'text-blue-600'}`}>
                      {card.value}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-[var(--helix-muted)]">{card.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </HelixBrandBanner>

          <div className="pad-content">
            {(nakijkMelding || nakijkFout || openNakijkVoorLeerling > 0) && (
              <div className="mb-6 space-y-2">
                {openNakijkVoorLeerling > 0 && (
                  <p className="flex items-center gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-warning)] bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">
                    <ClipboardCheck size={16} />
                    {openNakijkVoorLeerling} antwoord{openNakijkVoorLeerling === 1 ? '' : 'en'} wacht op je oordeel.
                    Open de stappen van de paragraaf om goed te keuren of af te keuren.
                  </p>
                )}
                {nakijkMelding && (
                  <p className="flex items-center gap-2 rounded-[var(--helix-radius-md)] border border-emerald-600 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">
                    <CheckCircle size={16} />
                    {nakijkMelding}
                  </p>
                )}
                {nakijkFout && (
                  <p className="flex items-start gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-danger)] bg-rose-50 px-3 py-2 text-sm font-bold text-rose-800">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    {nakijkFout}
                  </p>
                )}
              </div>
            )}

            {selectedStudentAandacht.length > 0 && (
              <div className="mb-6 rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] border-l-4 border-l-[var(--helix-danger)] bg-white p-4">
                <p className="flex items-center gap-2 font-black text-[var(--helix-navy)]">
                  <AlertTriangle size={18} className="text-[var(--helix-danger)]" />
                  Deze leerling vraagt aandacht
                </p>
                <ul className="mt-2 space-y-1">
                  {selectedStudentAandacht.map((reden) => (
                    <li key={reden.type} className="text-sm font-semibold text-[var(--helix-muted)]">
                      <span className="font-black text-[var(--helix-navy)]">{reden.label}:</span> {reden.detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vrijwillig werk apart, en bewust in de accentkleur en niet in
                rood of oranje: hier valt niets te repareren. */}
            {selectedStudentRij?.plus?.totaalParagrafen > 0 && (
              <div className="mb-6 rounded-[var(--helix-radius-lg)] border border-[rgba(122,60,255,0.3)] border-l-4 border-l-[var(--helix-purple)] bg-[var(--helix-soft-lavender)]/40 p-4">
                <p className="flex items-center gap-2 font-black text-[var(--helix-purple)]">
                  <Star size={18} />
                  Vrijwillig extra: {getPlusSamenvattingLabel(selectedStudentRij.plus)}
                </p>
                <ul className="mt-2 space-y-1">
                  {selectedStudentRij.plus.paragrafen.map((paragraaf) => (
                    <li key={paragraaf.paragraafId} className="text-sm font-semibold text-[var(--helix-navy)]">
                      <span className="font-black">{paragraaf.paragraafLabel}:</span>{' '}
                      {paragraaf.afgerond
                        ? 'af'
                        : paragraaf.gestart
                          ? `${paragraaf.afgerondeStappen} van ${paragraaf.totaalStappen} stappen`
                          : 'niet gedaan'}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs font-bold text-[var(--helix-muted)]">
                  {PLUS_PRESENTATIE.uitleg} Wat hier niet af is, is geen achterstand.
                </p>
              </div>
            )}

            <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <h3 className="heading-lg">Voortgang per Paragraaf</h3>

              <div className="w-full md:w-64">
                <label className="block text-sm font-bold text-slate-600 mb-2">Filteren op Hoofdstuk</label>
                <select
                  value={effectiveSelectedChapter || ""}
                  onChange={(e) => setSelectedChapter(e.target.value || null)}
                  className="input-standard w-full"
                >
                  <option value="">Alles tonen</option>
                  {Object.entries(paragraafsByHoofdstuk).map(([hId, paras]) => {
                    const title = paras[0]?.hoofdstukTitle || `Hoofdstuk ${hId}`;
                    return (
                      <option key={hId} value={hId}>
                        {title}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="space-y-8">
              {Object.keys(filteredHoofdstukken).length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-semibold text-slate-500">
                  Er staan nog geen onderdelen open voor deze leerling.
                </div>
              )}
              {Object.entries(filteredHoofdstukken).map(([hoofdstukId, paragrafen]) => {
                const firstPara = paragrafen[0];
                const hoofdstukTitle = firstPara?.hoofdstukTitle || `Hoofdstuk`;

                return (
                  <div key={hoofdstukId}>
                    <h4 className="text-xl font-black text-slate-600 mb-4 flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      {hoofdstukTitle}
                    </h4>

                    <div className="space-y-3 ml-4">
                      {paragrafen.map(paragraaf => {
                        const paraSummary = studentParagraphSummaries[paragraaf.id] || getStudentAssignmentSummary(selectedStudent, paragraaf.id);
                        const progressPercent = paraSummary.percentage;
                        const records = studentVoortgang[selectedStudent.id] || [];
                        const paragraphAssignments = getStudentParagraafAssignments(selectedStudent, paragraaf.id);
                        const assignedRecords = getAssignedProgressRecords({
                          assignments: paragraphAssignments,
                          progressRecords: records
                        });
                        const paragraphProgress = buildParagraphProgressSummary({
                          summary: paraSummary,
                          records: assignedRecords
                        });
                        const evidenceOpen = expandedEvidence[paragraaf.id] === true;
                        const stapRapport = selectedStudentRij?.rapportByParagraafId?.[paragraaf.id] || null;
                        const stapStatus = stapRapport?.status || STAP_STATUS.NIET_GESTART;
                        const stapPresentatie = getStatusPresentatie(stapStatus);
                        const isPlus = stapRapport
                          ? stapRapport.optioneel === true
                          : isOptionalParagraph(paragraaf);
                        // Niets gedaan aan de plusstof is geen status om te
                        // melden; dan blijft alleen het plusmerkteken staan.
                        const toonStatusChip = !isPlus || stapStatus !== STAP_STATUS.NIET_GESTART;

                        return (
                          <div
                            key={paragraaf.id}
                            className={`rounded-2xl border p-4 ${
                              isPlus
                                ? 'border-[rgba(122,60,255,0.3)] bg-[var(--helix-soft-lavender)]/35'
                                : 'border-[var(--helix-border)] bg-[var(--helix-surface-soft)]'
                            }`}
                          >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h5 className="font-bold text-[var(--helix-navy)]">
                                    {(paragraaf.code || paragraaf.number) && `${paragraaf.code || paragraaf.number}. `}{paragraaf.title}
                                  </h5>
                                  {isPlus && <PlusChip />}
                                  {toonStatusChip && (
                                    <StatusChip status={stapStatus}>{stapPresentatie.label}</StatusChip>
                                  )}
                                  {paragraphProgress.signalCount > 0 && (
                                    <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-black text-orange-700">
                                      {paragraphProgress.signalCount} signalen
                                    </span>
                                  )}
                                </div>
                                <div className="mt-2 flex flex-wrap gap-3 text-sm font-semibold text-[var(--helix-muted)]">
                                  <span>
                                    {stapRapport
                                      ? `${stapRapport.afgerondeStappen} / ${stapRapport.totaalStappen} stappen afgerond`
                                      : `${paraSummary.completedItems} / ${paraSummary.assignedItems} onderdelen afgerond`}
                                    {isPlus && ' - telt niet mee voor het hoofdstuk'}
                                  </span>
                                  {stapRapport?.huidigeStap && (
                                    <span>
                                      Nu bij stap {stapRapport.huidigeStap.nummer}: {stapRapport.huidigeStap.titel}
                                    </span>
                                  )}
                                  <span>{paragraphProgress.qualityLabel}</span>
                                </div>
                                {stapRapport && (
                                  <div className="mt-3">
                                    <StappenSpoor
                                      stappen={stapRapport.stappen}
                                      onSelectStap={() => {
                                        setExpandedEvidence((current) => ({ ...current, [paragraaf.id]: true }));
                                      }}
                                    />
                                  </div>
                                )}
                                <SupportMiniBar records={assignedRecords} />
                              </div>

                              <div className="flex flex-wrap items-center gap-4 lg:ml-4">
                                <div className="w-32">
                                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                                    <div
                                      className={`h-full rounded-full transition-all ${stapPresentatie.balkClass}`}
                                      style={{ width: `${stapRapport ? stapRapport.percentage : progressPercent}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="min-w-[60px] text-right">
                                  <div className="font-bold text-[var(--helix-navy)]">
                                    {stapRapport ? stapRapport.percentage : progressPercent}%
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExpandedEvidence((current) => ({
                                      ...current,
                                      [paragraaf.id]: !current[paragraaf.id]
                                    }));
                                  }}
                                  className="rounded-xl border border-[var(--helix-border)] bg-white px-3 py-2 text-xs font-black text-[var(--helix-muted)] transition hover:border-[var(--helix-purple)] hover:text-[var(--helix-navy)]"
                                >
                                  {evidenceOpen
                                    ? 'Verberg stappen'
                                    : `Toon stappen (${stapRapport ? stapRapport.totaalStappen : paragraphProgress.evidenceCount})`}
                                </button>
                              </div>
                            </div>
                            {evidenceOpen && (
                              stapRapport
                                ? (
                                  <LeerlingStappen
                                    rapport={stapRapport}
                                    nakijkOpdrachtenPerBlockId={nakijkPerBlockId}
                                    onBeoordeel={beoordeelStap}
                                    bezigId={nakijkBezigId}
                                  />
                                )
                                : <StudentProgressRecordList records={assignedRecords} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {viewingExercise && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="pad-compact border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h4 className="text-2xl font-black text-slate-800">{viewingExercise.ex.heading}</h4>
                  <p className="text-slate-500 font-medium">Gedetailleerde antwoorden</p>
                </div>
                <button 
                  onClick={() => setViewingExercise(null)}
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-400 transition-all shadow-sm"
                >
                  <Search size={24} className="rotate-45" />
                </button>
              </div>
              
              <div className="pad-compact max-h-[60vh] overflow-y-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                      <th className="pb-4">Vraag / Onderdeel</th>
                      <th className="pb-4">Antwoord Leerling</th>
                      <th className="pb-4">Correct Antwoord</th>
                      <th className="pb-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(() => {
                      const { ex, result } = viewingExercise;
                      const rows = [];
                      
                      if (ex.exercise.type === 'table') {
                        ex.exercise.rows.forEach(row => {
                          row.fields.forEach(field => {
                            rows.push({
                              label: `${row.label} - ${field.id.split('_').pop().toUpperCase()}`,
                              student: result.answers?.[field.id] || "—",
                              correct: field.answer,
                              isCorrect: isAnswerCorrect(result.answers?.[field.id], field.answer)
                            });
                          });
                        });
                      } else if (ex.exercise.fields) {
                        ex.exercise.fields.forEach(field => {
                          rows.push({
                            label: field.label || field.id,
                            student: result.answers?.[field.id] || "—",
                            correct: field.answer,
                            isCorrect: isAnswerCorrect(result.answers?.[field.id], field.answer)
                          });
                        });
                      }
                      
                      return rows.map((row, idx) => (
                        <tr key={idx} className="group">
                          <td className="py-4 font-bold text-slate-700">{row.label}</td>
                          <td className={`py-4 font-black ${row.isCorrect ? 'text-green-600' : 'text-rose-500'}`}>
                            {row.student}
                          </td>
                          <td className="py-4 font-medium text-slate-400 italic">{row.correct}</td>
                          <td className="py-4 text-center">
                            {row.isCorrect ? (
                              <CheckCircle className="text-green-500 mx-auto" size={20} />
                            ) : (
                              <AlertTriangle className="text-rose-500 mx-auto" size={20} />
                            )}
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
              
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Totaal Pogingen</div>
                    <div className="text-xl font-black text-slate-700">{viewingExercise.result.attempts}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Resultaat</div>
                    <div className={`text-xl font-black ${viewingExercise.result.isCorrect ? 'text-green-600' : 'text-amber-500'}`}>
                      {viewingExercise.result.isCorrect ? 'Correct' : 'Incompleet'}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingExercise(null)}
                  className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black hover:bg-slate-800 transition-colors"
                >
                  Sluiten
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="helix-page min-h-screen">
      <div className="helix-container">
      <HelixBrandBanner variant="compact" className="mb-8 rounded-[var(--helix-radius-xl)]">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-[var(--helix-navy)]">
              <Users className="text-[var(--helix-purple)]" /> Klas Dashboard
            </h1>
            <p className="mt-1 text-[var(--helix-muted)]">Real-time overzicht van je leerlingen</p>
          </div>
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
            Nu actief: {activeCount}/{scopedStudents.length}
          </div>
        </div>
      </HelixBrandBanner>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <DashboardLensSwitch
            activeLens={activeLens}
            onSelect={setActiveLens}
            signalCount={openProgressSignals.length}
            nakijkCount={nakijkOpdrachten.length}
          />
          <div className="min-w-56">
            <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[var(--helix-muted)]">Klas</label>
            <select
              value={selectedKlasId}
              onChange={(event) => setSelectedKlasId(event.target.value)}
              className="input-standard w-full py-2 text-sm font-black text-[var(--helix-navy)]"
            >
              {klasFilterOptions.map((option) => (
                <option key={option.value || 'all'} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-sm font-bold text-[var(--helix-muted)]">
          {activeLens === 'signals' && (
            <p>Toont open signalen binnen {selectedKlasOption?.label || 'alle klassen'}.</p>
          )}
          {activeLens === 'nakijken' && (
            <p className="text-amber-700">
              Handelt open beoordelingen af binnen {selectedKlasOption?.label || 'alle klassen'}.
            </p>
          )}
          {activeLens === 'paragraph' && (
            <p className="text-blue-700">Vergelijkt paragrafen binnen {selectedKlasOption?.label || 'alle klassen'}.</p>
          )}
          {activeLens === 'student' && (
            <p>Klik op een leerling binnen {selectedKlasOption?.label || 'alle klassen'}.</p>
          )}
          {activeLens === 'class' && (
            <p>Toont klasdata voor {selectedKlasOption?.label || 'alle klassen'}.</p>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {classMetricCards.map((card) => (
          <div
            key={card.key}
            className={`${card.tone === 'warning' ? 'helix-card border-orange-100 bg-orange-50/45' : 'helix-card'} flex flex-col p-6`}
          >
            <div className={`mb-2 flex items-center gap-2 text-sm font-medium ${card.tone === 'warning' ? 'text-orange-700' : 'text-[var(--helix-muted)]'}`}>
              {card.tone === 'warning' && <AlertTriangle size={16} />}
              {card.label}
            </div>
            <div className={`font-display text-3xl font-extrabold ${card.tone === 'warning' ? 'text-orange-700' : card.tone === 'quality' ? 'text-emerald-700' : 'text-[var(--helix-purple)]'}`}>
              {card.value}
            </div>
            <div className="mt-2 text-xs font-bold text-[var(--helix-muted)]">{card.detail}</div>
          </div>
        ))}
      </div>

      {/* Nakijken: de enige weergave waar de docent de status van een stap wijzigt */}
      {activeLens === 'nakijken' && (
        <NakijkPaneel
          opdrachten={nakijkOpdrachten}
          onBeoordeel={beoordeelStap}
          bezigId={nakijkBezigId}
          melding={nakijkMelding}
          fout={nakijkFout}
          itemsBlokkade={itemsBlokkade}
        />
      )}

      {/* Klasoverzicht: waar staat iedere leerling, en wie heeft nu hulp nodig */}
      {activeLens === 'class' && (
        <div className="mb-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="helix-surface order-2 p-5 xl:order-1">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-display text-lg font-extrabold text-[var(--helix-navy)]">
                  Klasoverzicht per paragraaf
                </h2>
                <p className="text-sm font-semibold text-[var(--helix-muted)]">
                  Elk vakje toont afgeronde stappen van die paragraaf. Klik door naar de leerling.
                </p>
              </div>
              {hoofdstukGroepen.length > 0 && (
                <div className="w-full lg:w-72">
                  <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[var(--helix-muted)]">
                    Hoofdstuk
                  </label>
                  <select
                    value={actiefHoofdstuk?.hoofdstukId || ''}
                    onChange={(event) => setSelectedHoofdstukId(event.target.value)}
                    className="input-standard w-full py-2 text-sm font-bold text-[var(--helix-navy)]"
                  >
                    {hoofdstukGroepen.map((groep) => (
                      <option key={groep.hoofdstukId} value={groep.hoofdstukId}>
                        {groep.hoofdstukTitel} ({groep.paragrafen.length})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <StatusChip status={STAP_STATUS.AFGEROND}>
                {hoofdstukTelling[STAP_STATUS.AFGEROND]} afgerond
              </StatusChip>
              <StatusChip status={STAP_STATUS.BEZIG}>
                {hoofdstukTelling[STAP_STATUS.BEZIG]} bezig
              </StatusChip>
              <StatusChip status={STAP_STATUS.VASTGELOPEN}>
                {hoofdstukTelling[STAP_STATUS.VASTGELOPEN]} vastgelopen
              </StatusChip>
              <StatusChip status={STAP_STATUS.NAKIJKEN}>
                {hoofdstukTelling[STAP_STATUS.NAKIJKEN]} nakijken
              </StatusChip>
              <StatusChip status={STAP_STATUS.NIET_GESTART}>
                {hoofdstukTelling[STAP_STATUS.NIET_GESTART]} niet gestart
              </StatusChip>
              <span className="ml-auto text-xs font-bold text-[var(--helix-muted)]">
                Mediaan {hoofdstukTelling.mediaanPercentage}% van dit hoofdstuk
              </span>
            </div>

            {zonderKlasselectie && (
              <p className="mb-4 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-3 py-2 text-xs font-bold text-[var(--helix-muted)]">
                Voor leerlingen zonder klasselectie telt de volledige gepubliceerde lesstof mee.
                Zet lesstof klaar bij Klassen om de omvang te beperken.
              </p>
            )}

            <KlasVoortgangMatrix
              rijen={matrixRijen}
              kolommen={matrixKolommen}
              kolomKopLabel="Paragraaf"
              totaalKopLabel="Dit hoofdstuk"
              onSelectLeerling={(rij) => {
                setSelectedStudent(rij.student);
                setActiveLens('student');
                setExpandedEvidence({});
              }}
              leegTekst="Nog geen leerlingen in deze klas."
            />

            <StatusLegenda className="mt-4" toonPlus={heeftPlusKolommen} />
          </section>

          <div className="order-1 space-y-6 xl:order-2">
            <AandachtsLijst
              items={aandachtsLijst}
              totaalLeerlingen={klasStatusTelling.leerlingen}
              nakijkTelling={nakijkPerLeerling}
              onSelectLeerling={(item) => {
                setSelectedStudent(item.student);
                setActiveLens('student');
                setExpandedEvidence({});
              }}
            />

            <PlusOverzicht
              overzicht={plusOverzicht}
              hoofdstukTitel={actiefHoofdstuk?.hoofdstukTitel || ''}
              onSelectLeerling={(leerling) => {
                setSelectedStudent(leerling.student);
                setSelectedChapter(actiefHoofdstuk?.hoofdstukId || null);
                setActiveLens('student');
                setExpandedEvidence({});
              }}
            />
          </div>
        </div>
      )}

      {/* Paragraaffocus: dezelfde klas, maar per stap in de lesroute */}
      {activeLens === 'paragraph' && (
        <section className="helix-surface mb-8 p-5">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-lg font-extrabold text-[var(--helix-navy)]">
                Paragraaffocus per stap
              </h2>
              <p className="text-sm font-semibold text-[var(--helix-muted)]">
                {stapParagraaf
                  ? `${stapKolommen.length} stappen in ${stapParagraaf.code || stapParagraaf.number || ''} ${stapParagraaf.title}`
                  : 'Kies een paragraaf om de stappen naast elkaar te zetten.'}
              </p>
              {stapParagraafIsPlus && (
                <p className="mt-2 inline-flex items-center gap-2 rounded-[var(--helix-radius-md)] border border-[rgba(122,60,255,0.3)] bg-[var(--helix-soft-lavender)]/60 px-3 py-1.5 text-xs font-bold text-[var(--helix-navy)]">
                  <Star size={13} className="text-[var(--helix-purple)]" />
                  {PLUS_PRESENTATIE.uitleg} Een leeg vakje is hier dus geen achterstand.
                </p>
              )}
            </div>
            <div className="w-full lg:w-80">
              <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[var(--helix-muted)]">
                Paragraaf
              </label>
              <select
                value={selectedChapterForClass || ''}
                onChange={(event) => setSelectedChapterForClass(event.target.value || null)}
                className="input-standard w-full py-2 text-sm font-bold text-[var(--helix-navy)]"
              >
                <option value="">Kies een paragraaf</option>
                {paragraphen.map((paragraaf) => (
                  <option key={paragraaf.id} value={paragraaf.id}>
                    {paragraaf.code || paragraaf.number ? `${paragraaf.code || paragraaf.number}. ` : ''}{paragraaf.title}
                    {isOptionalParagraph(paragraaf) ? ` (${PLUS_PRESENTATIE.label})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {stapParagraaf ? (
            <>
              <KlasVoortgangMatrix
                rijen={stapRijen}
                kolommen={stapKolommen}
                kolomKopLabel="Stap"
                totaalKopLabel="Deze paragraaf"
                onSelectLeerling={(rij) => {
                  setSelectedStudent(rij.student);
                  setSelectedChapter(stapParagraaf.hoofdstukId || null);
                  setActiveLens('student');
                  setExpandedEvidence({ [stapParagraaf.id]: true });
                }}
                leegTekst="Nog geen leerlingen in deze klas."
              />
              <StatusLegenda className="mt-4" toonPlus={stapParagraafIsPlus} />
            </>
          ) : (
            <p className="rounded-[var(--helix-radius-lg)] border border-dashed border-[var(--helix-border)] bg-white/70 p-6 text-sm font-semibold text-[var(--helix-muted)]">
              Kies hierboven een paragraaf. Je ziet dan per leerling welke stap af is, welke loopt en waar het vastloopt.
            </p>
          )}
        </section>
      )}

      {/* Live Pythagorean Theorem Measurements Table */}
      {(() => {
        const bcMeasurements = scopedStudents
          .filter(s => {
            const bcValue = s.exerciseData?.['para_72']?.['p72_03']?.['bc_measurement'];
            return bcValue !== undefined && bcValue !== null;
          })
          .map(s => ({
            name: s.displayName || 'Naamloos',
            bc: s.exerciseData?.['para_72']?.['p72_03']?.['bc_measurement'],
            timestamp: s.exerciseData?.['para_72']?.['p72_03']?.['timestamp']
          }))
          .sort((a, b) => {
            const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
            const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
            return dateB - dateA;
          });

        return bcMeasurements.length > 0 ? (
          <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-slate-700 text-lg flex items-center gap-2">
                  <ClipboardCheck size={18} aria-hidden="true" />
                  Pythagoras Metingen (BC-lengte)
                </h2>
                <p className="text-slate-500 text-sm mt-1">Live updates van leerlingen</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-blue-600">{bcMeasurements.length}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Gemeten</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bcMeasurements.map((measurement, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm animate-in fade-in zoom-in-95"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-800">{measurement.name}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {measurement.timestamp
                          ? new Date(
                              measurement.timestamp.toDate ? measurement.timestamp.toDate() : measurement.timestamp
                            ).toLocaleTimeString('nl-NL')
                          : '—'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-indigo-600">{measurement.bc.toFixed(2)}</div>
                      <div className="text-xs text-slate-400">cm</div>
                    </div>
                  </div>
                  {/* Visual indicator: expected value is ~4.24 cm */}
                  <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        Math.abs(measurement.bc - 5) < 0.2 ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min((measurement.bc / 6) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      })()}

      {/* Students Table */}
      <div className="helix-surface overflow-hidden">
        <div className="space-y-4 border-b border-[var(--helix-border)] bg-[var(--helix-surface-soft)]/72 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="font-display font-extrabold text-[var(--helix-navy)]">
              {activeLens === 'signals'
                ? `Signalen (${filteredProgressSignals.length})`
                : activeLens === 'paragraph'
                  ? 'Paragraaffocus'
                  : `Leerlingenoverzicht (${scopedStudents.length})`}
            </h2>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder={activeLens === 'signals' ? 'Zoek signaal...' : 'Zoek leerling...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-standard w-full py-2 pl-9 pr-4 text-sm"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            </div>
          </div>

          {activeLens === 'signals' ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-[var(--helix-border)] bg-white/78 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[var(--helix-navy)]">
                  {selectedSignals.length} van {filteredProgressSignals.length} signaal{filteredProgressSignals.length === 1 ? '' : 'en'} geselecteerd
                </p>
                <p className="text-xs font-semibold text-[var(--helix-muted)]">Afvinken betekent: gezien door docent.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={toggleAllFilteredSignals}
                  disabled={!filteredProgressSignals.length}
                  className="btn-secondary w-auto px-4 py-2 text-sm disabled:opacity-50"
                >
                  {allFilteredSignalsSelected ? 'Selectie wissen' : 'Alle signalen selecteren'}
                </button>
                <button
                  type="button"
                  onClick={acknowledgeSelectedSignals}
                  disabled={!selectedSignals.length || acknowledgingSignals}
                  className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                >
                  <CheckCircle size={16} />
                  {acknowledgingSignals ? 'Afvinken...' : 'Geselecteerde afvinken'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className={`flex-1 ${activeLens === 'paragraph' ? 'hidden' : ''}`}>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--helix-muted)]">Paragraaf selecteren</label>
                <select
                  value={selectedChapterForClass || ""}
                  onChange={(e) => setSelectedChapterForClass(e.target.value || null)}
                  className="input-standard w-full py-2 text-sm font-medium"
                >
                  <option value="">Alle paragrafen (totaal voortgang)</option>
                  {paragraphen.map((para) => (
                    <option key={para.id} value={para.id}>
                      {para.number && `${para.number}. `}{para.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 items-end">
                <button
                  onClick={() => {
                    setSortBy("name");
                    setSortDirection(sortBy === "name" && sortDirection === "asc" ? "desc" : "asc");
                  }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === "name" ? "bg-blue-100 text-blue-700 border border-blue-300" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  Naam <ArrowUpDown size={14} />
                </button>
                <button
                  onClick={() => {
                    setSortBy("total");
                    setSortDirection(sortBy === "total" && sortDirection === "asc" ? "desc" : "asc");
                  }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === "total" ? "bg-blue-100 text-blue-700 border border-blue-300" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  Totaal <ArrowUpDown size={14} />
                </button>
                {selectedChapterForClass && (
                  <button
                    onClick={() => {
                      setSortBy("chapter");
                      setSortDirection(sortBy === "chapter" && sortDirection === "asc" ? "desc" : "asc");
                    }}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      sortBy === "chapter" ? "bg-blue-100 text-blue-700 border border-blue-300" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    Paragraaf <ArrowUpDown size={14} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          {activeLens === 'signals' ? (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-white">
                  <th className="px-6 py-4 text-sm font-medium text-slate-500">Leerling</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500">Signaal</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500">Paragraaf</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-slate-500">Selecteer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProgressSignals.length > 0 ? (
                  filteredProgressSignals.map((signal) => {
                    const selected = selectedSignalIds.includes(signal.id);
                    const student = students.find((item) => item.id === signal.studentId);

                    return (
                      <tr key={signal.id} className="group transition-colors hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => {
                              if (student) {
                                setSelectedStudent(student);
                                setActiveLens('student');
                                setExpandedEvidence({});
                              }
                            }}
                            className="flex items-center gap-3 text-left"
                          >
                            <StudentAvatar
                              student={student || { displayName: signal.studentName }}
                              size="sm"
                              shape="circle"
                              fallback="initial"
                              fallbackClassName="bg-blue-100 text-blue-600"
                            />
                            <span className="flex flex-col">
                              <span className="font-bold text-slate-800">{signal.studentName}</span>
                              <span className="text-[10px] font-semibold text-slate-400">{signal.klasId || 'Geen klas'}</span>
                            </span>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-black text-[var(--helix-navy)]">{signal.label}</span>
                            <span className="text-sm font-medium text-[var(--helix-muted)]">{signal.detail}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                          {signal.paragraafTitle || 'Paragraaf'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => toggleSignalSelection(signal.id)}
                              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm transition-all ${
                                selected
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                  : 'border-[var(--helix-border)] bg-white text-slate-400 hover:border-[var(--helix-purple)] hover:text-[var(--helix-purple)]'
                              }`}
                              aria-label={selected ? 'Signaal deselecteren' : 'Signaal selecteren'}
                              title={selected ? 'Signaal deselecteren' : 'Signaal selecteren'}
                            >
                              {selected ? <CheckSquare size={19} /> : <Square size={19} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle size={32} className="mb-2 text-emerald-400" />
                        <p className="font-medium">Geen open signalen.</p>
                        <p className="text-xs">Alles wat zichtbaar was, is afgehandeld of er zijn geen directe signalen.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="py-4 px-6 font-medium text-slate-500 text-sm">Naam</th>
                <th className="py-4 px-6 font-medium text-slate-500 text-sm">Totale Voortgang</th>
                {selectedChapterForClass && (
                  <>
                    <th className="py-4 px-6 font-medium text-slate-500 text-sm">
                      {paragraphen.find(para => para.id === selectedChapterForClass)?.title || 'Paragraaf'}
                    </th>
                    <th className="py-4 px-6 font-medium text-slate-500 text-sm">
                      Presentatie
                    </th>
                    <th className="py-4 px-6 font-medium text-slate-500 text-sm">
                      Evaluatie
                    </th>
                  </>
                )}
                <th className="py-4 px-6 font-medium text-slate-500 text-sm">Laatst Actief</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => {
                  const totalSummary = getStudentAssignmentSummary(student);
                  const totalProgress = totalSummary.percentage;

                  // Calculate progress for selected paragraph if applicable
                  const paraProgress = selectedChapterForClass
                    ? getStudentAssignmentSummary(student, selectedChapterForClass).percentage
                    : null;

                  return (
                    <tr
                      key={student.id}
                      onClick={() => {
                        setSelectedStudent(student);
                        setActiveLens('student');
                        setExpandedEvidence({});
                      }}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <StudentAvatar
                            student={student}
                            size="sm"
                            shape="circle"
                            fallback="initial"
                            fallbackClassName="bg-blue-100 text-blue-600"
                          />
                          <div className="flex flex-col">
                            <span className={`font-medium ${!student.displayName ? 'text-amber-600 italic' : 'text-slate-800'}`}>
                              {student.displayName && student.displayName.trim() ? student.displayName : (
                                <span className="inline-flex items-center gap-1"><AlertTriangle size={14} aria-hidden="true" /> Naam ontbreekt</span>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{student.email}</span>
                          </div>
                          {paragraphen.length > 0 && student.warning && (
                            <div className="relative group/tooltip cursor-help">
                              <AlertTriangle size={18} className="text-amber-500" />
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-slate-800 text-white text-xs rounded py-2 px-3 text-center z-10 shadow-xl border border-slate-700">
                                {student.warning}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                              </div>
                            </div>
                          )}
                          {totalProgress === 100 && (
                            <CheckCircle size={18} className="text-green-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-full max-w-[120px] h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(totalProgress)}`}
                              style={{ width: `${totalProgress}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-600">{totalProgress}%</span>
                        </div>
                        <SupportMiniBar records={studentVoortgang[student.id] || []} />
                      </td>
                      {selectedChapterForClass && (
                        <>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-full max-w-[120px] h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(paraProgress)}`}
                                  style={{ width: `${paraProgress}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-slate-600">{paraProgress}%</span>
                            </div>
                            <SupportMiniBar records={studentVoortgang[student.id] || []} paragraafId={selectedChapterForClass} />
                          </td>
                          <td className="py-4 px-6 text-sm">
                            {hasPresentationViewed(student, selectedChapterForClass) ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-500" />
                                <span className="text-green-600 font-medium text-xs">
                                  {getRelativeTime(getPresentationViewedTime(student, selectedChapterForClass))}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded border-2 border-slate-300" />
                                <span className="text-slate-400 text-xs">Nog niet</span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6 text-sm">
                            {(() => {
                              const evalScore = getEvaluationScore(student, selectedChapterForClass);
                              if (!evalScore) {
                                return (
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded border-2 border-slate-300" />
                                    <span className="text-slate-400 text-xs">—</span>
                                  </div>
                                );
                              }
                              return (
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-700">{evalScore.correct}/{evalScore.total}</span>
                                  <span className={`text-xs font-medium ${evalScore.correct === evalScore.total ? 'text-green-600' : 'text-amber-600'}`}>
                                    {Math.round((evalScore.correct / evalScore.total) * 100)}%
                                  </span>
                                </div>
                              );
                            })()}
                          </td>
                        </>
                      )}
                      <td className="py-4 px-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          {getRelativeTime(student.lastActive) === 'Nu' ? (
                            <span className="flex items-center gap-1.5 text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wider">
                              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                              Live
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <Clock size={14} className="text-slate-400" />
                              {getRelativeTime(student.lastActive)}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={selectedChapterForClass ? "4" : "3"} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="text-slate-300 mb-2" />
                      <p className="font-medium">Geen leerlingen gevonden.</p>
                      <p className="text-xs">Zorg dat leerlingen een account hebben aangemaakt.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
