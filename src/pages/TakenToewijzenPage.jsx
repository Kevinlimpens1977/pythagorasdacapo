/* eslint-disable react-hooks/set-state-in-effect */
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  BookOpenCheck,
  CheckCircle2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers3,
  ListChecks,
  Route,
  Star,
  UsersRound
} from 'lucide-react';
import { Label, PaginaKop } from '../components/leeromgeving';
import { HelixLaden } from '../components/merk/HelixLogo';
import klasService from '../services/klasService';
import { openHelp } from '../lib/helpInhoud';
import cmsService from '../services/cmsService';
import { getColorStyle } from '../lib/paletColors';
import { CONTENT_BLOCK_LABELS, buildContentBlockPreview, normalizeContentBlocks } from '../lib/contentBlockUtils';
import { buildCmsNavigationTree, getCmsItemLabel } from '../lib/cmsNavigationUtils';
import { PLUS_LABEL, PLUS_UITLEG_DOCENT, isOptionalParagraph } from '../lib/paragraphMetadata';

const showLegacyCardBrowser = false;

const flowSteps = [
  {
    number: '1',
    title: 'Kies klas',
    description: 'Bepaal voor welke klas je lesmateriaal klaarzet.',
    icon: UsersRound
  },
  {
    number: '2',
    title: 'Kies lesmateriaal',
    description: 'Navigeer naar vak, hoofdstuk, paragraaf en lesblokken.',
    icon: Route
  },
  {
    number: '3',
    title: 'Zet klaar',
    description: 'Kies klasbreed of extra materiaal voor een leerling.',
    icon: Layers3
  },
  {
    number: '4',
    title: 'Volg voortgang',
    description: 'Bekijk daarna in Voortgang wat gestart en afgerond is.',
    icon: CheckCircle2
  }
];

const FlowSteps = ({ currentStep }) => (
  <div className="grid gap-3 md:grid-cols-4">
    {flowSteps.map((step, index) => {
      const stepNumber = index + 1;
      const isActive = stepNumber === currentStep;
      const isDone = stepNumber < currentStep;
      const StepIcon = step.icon;

      return (
        <div
          key={step.number}
          className={`helix-action-card p-4 ${isActive || isDone ? 'helix-action-card-active' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div className={`lo-hblok ${stepNumber > currentStep ? 'lo-hblok--dicht' : ''}`}>
              <StepIcon size={17} />
            </div>
            <h2 className="font-extrabold text-[var(--lo-inkt)]">{step.title}</h2>
          </div>
          <p className="mt-2 text-sm leading-5 text-[var(--lo-grijs)]">{step.description}</p>
        </div>
      );
    })}
  </div>
);

const AssignmentTreeNode = ({
  node,
  level = 0,
  expandedIds,
  selectedIds,
  assignedParagrafen,
  assignedContentBlocks,
  studentOverrides,
  studentContentBlockOverrides,
  selectedStudentId,
  contentBlocksByParagraaf,
  allParagrafen,
  saving,
  onToggleExpand,
  onSelectNode,
  onToggleParagraaf,
  onToggleStudentParagraaf,
  onToggleHoofdstuk,
  onToggleContentBlock,
  onClearContentBlocks
}) => {
  const hasChildren = node.children?.length > 0;
  const isExpanded = expandedIds.includes(node.id);
  const isSelected = selectedIds[node.type] === node.id;
  const isParagraaf = node.type === 'paragraaf';
  const isPlus = isParagraaf && isOptionalParagraph(node);
  const blocks = isParagraaf ? (contentBlocksByParagraaf[node.id] || []) : [];
  const isInClassDefault = isParagraaf && assignedParagrafen.includes(node.id);
  const studentExtras = studentOverrides[selectedStudentId] || [];
  const isInStudentOverride = isParagraaf && studentExtras.includes(node.id);
  const isChecked = isParagraaf && (selectedStudentId ? (isInClassDefault || isInStudentOverride) : isInClassDefault);
  const isDisabled = isParagraaf && selectedStudentId && isInClassDefault;
  const chapterParagrafen = node.type === 'hoofdstuk'
    ? allParagrafen.filter((paragraaf) => paragraaf.hoofdstukId === node.id)
    : [];
  const rowLabel = getCmsItemLabel(node.type, node);

  const handleRowClick = () => {
    onSelectNode(node);
    if (hasChildren && !isExpanded) onToggleExpand(node.id);
  };

  return (
    <div>
      <div
        className={[
          'group grid min-h-[44px] grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border px-3 py-2 text-sm transition',
          isSelected
            ? 'border-[var(--lo-blauw)] bg-white text-[var(--lo-inkt)] shadow-sm'
            : isParagraaf
              ? 'border-[var(--lo-lijn)] bg-white text-[var(--lo-grijs)] hover:border-[var(--lo-blauw)] hover:bg-white'
              : 'border-transparent bg-white text-[var(--lo-inkt)] hover:border-[var(--lo-lijn)] hover:bg-[var(--lo-papier-2)]'
        ].join(' ')}
        style={{ paddingLeft: `${12 + level * 18}px` }}
        onClick={handleRowClick}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            if (hasChildren) onToggleExpand(node.id);
          }}
          disabled={!hasChildren}
          className={[
            'flex h-6 w-6 items-center justify-center rounded-md text-[var(--lo-grijs)] transition hover:bg-[var(--lo-papier-2)]',
            hasChildren ? '' : 'opacity-25'
          ].join(' ')}
          title={isExpanded ? 'Inklappen' : 'Uitklappen'}
        >
          {hasChildren && (
            <ChevronRight
              size={16}
              className={isExpanded ? 'rotate-90 transition-transform' : 'transition-transform'}
            />
          )}
        </button>

        <div className="min-w-0">
          <div className={['flex min-w-0 items-center gap-2', isParagraaf ? 'font-medium' : 'font-bold'].join(' ')}>
            <span className="truncate">{rowLabel}</span>
            {/* Een plusparagraaf is vrijwillig. Dat moet de docent zien vóór hij
                hem aanvinkt, anders zet hij ongemerkt bonusstof klaar als eis. */}
            {isPlus && (
              <Label kleur="paars" icoon={Star} title={PLUS_UITLEG_DOCENT} className="shrink-0">
                {PLUS_LABEL}
              </Label>
            )}
          </div>
          {isParagraaf && (
            <div className="text-xs text-[var(--lo-grijs)]">
              {blocks.length} lesblokken
              {isPlus && <span className="ml-2 font-bold text-[var(--lo-paars-inkt)]">vrijwillig - telt niet mee</span>}
              {Array.isArray(assignedContentBlocks[node.id]) && (
                <Label kleur="blauw" className="ml-2">
                  {assignedContentBlocks[node.id].length} geselecteerd
                </Label>
              )}
            </div>
          )}
        </div>

        {isParagraaf ? (
          <div className="flex items-center gap-2">
            {isChecked && <CheckSquare size={17} className="text-[var(--lo-groen-inkt)]" />}
            <input
              type="checkbox"
              checked={isChecked}
              disabled={saving || isDisabled}
              onClick={(event) => event.stopPropagation()}
              onChange={() => selectedStudentId ? onToggleStudentParagraaf(node.id) : onToggleParagraaf(node.id)}
              className="h-5 w-5 cursor-pointer rounded accent-[var(--lo-blauw)]"
              title={isDisabled ? 'Al in klassestandaard' : ''}
            />
          </div>
        ) : (
          <span className="text-xs font-semibold text-[var(--lo-grijs)]">
            {node.type === 'hoofdstuk' ? `${chapterParagrafen.length} paragrafen` : ''}
          </span>
        )}
      </div>

      {node.type === 'hoofdstuk' && isSelected && (
        <div
          className="my-2 rounded-xl border border-[var(--lo-lijn)] bg-[var(--lo-papier-2)] p-4"
          style={{ marginLeft: `${level * 18 + 34}px` }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[var(--lo-inkt)]">Hoofdstuk klaarzetten</h3>
              <p className="text-xs text-[var(--lo-grijs)]">
                Zet alle paragrafen uit dit hoofdstuk in een keer klaar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onToggleHoofdstuk(node.id)}
              disabled={saving || selectedStudentId || chapterParagrafen.length === 0}
              className="btn-secondary w-auto px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              title={selectedStudentId ? 'Bulkactie is alleen voor de klas. Kies losse extra paragrafen voor een leerling.' : ''}
            >
              Hoofdstuk aan/uit
            </button>
          </div>
        </div>
      )}

      {isParagraaf && isChecked && blocks.length > 0 && (
        <div className="mb-2 mt-1 space-y-2 border-l border-[var(--lo-lijn)] pl-4" style={{ marginLeft: `${level * 18 + 34}px` }}>
          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="lo-onderregel font-bold">
              Onderdelen van deze paragraaf
            </span>
            {!selectedStudentId && Array.isArray(assignedContentBlocks[node.id]) && (
              <button
                type="button"
                onClick={() => onClearContentBlocks(node.id)}
                className="text-xs font-bold text-[var(--lo-blauw-inkt)] hover:text-[var(--lo-inkt)]"
              >
                Alle blokken tonen
              </button>
            )}
          </div>
          {blocks.map((block) => {
            const classSelection = assignedContentBlocks[node.id];
            const classHasExplicitSelection = Array.isArray(classSelection);
            const isClassBlockSelected = classHasExplicitSelection
              ? classSelection.includes(block.id)
              : true;
            const studentBlockExtras = studentContentBlockOverrides[selectedStudentId]?.[node.id] || [];
            const isStudentBlockSelected = studentBlockExtras.includes(block.id);
            const blockChecked = selectedStudentId ? isStudentBlockSelected : isClassBlockSelected;
            const blockDisabled = selectedStudentId && isClassBlockSelected;

            return (
              <label
                key={block.id}
                className={[
                  'flex items-start gap-3 rounded-lg border px-3 py-2 text-sm',
                  blockDisabled
                    ? 'border-[var(--lo-lijn)] bg-[var(--lo-papier-2)] opacity-60'
                    : 'border-[var(--lo-lijn)] bg-white hover:border-[var(--lo-blauw)]'
                ].join(' ')}
              >
                <input
                  type="checkbox"
                  checked={blockChecked}
                  disabled={saving || blockDisabled}
                  onChange={() => onToggleContentBlock(node.id, block.id)}
                  className="mt-1 h-4 w-4 cursor-pointer rounded accent-[var(--lo-blauw)]"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-[var(--lo-inkt)]">
                    Stap {block.order || '-'} - {CONTENT_BLOCK_LABELS[block.type] || 'Lesblok'} - {block.title || 'Naamloos'}
                  </span>
                  <span className="line-clamp-1 text-xs text-[var(--lo-grijs)]">
                    {buildContentBlockPreview(block)}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      )}

      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {node.children.map((child) => (
            <AssignmentTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              selectedIds={selectedIds}
              assignedParagrafen={assignedParagrafen}
              assignedContentBlocks={assignedContentBlocks}
              studentOverrides={studentOverrides}
              studentContentBlockOverrides={studentContentBlockOverrides}
              selectedStudentId={selectedStudentId}
              contentBlocksByParagraaf={contentBlocksByParagraaf}
              allParagrafen={allParagrafen}
              saving={saving}
              onToggleExpand={onToggleExpand}
              onSelectNode={onSelectNode}
              onToggleParagraaf={onToggleParagraaf}
              onToggleStudentParagraaf={onToggleStudentParagraaf}
              onToggleHoofdstuk={onToggleHoofdstuk}
              onToggleContentBlock={onToggleContentBlock}
              onClearContentBlocks={onClearContentBlocks}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function TakenToewijzenPage() {
  const navigate = useNavigate();

  // Klas selection
  const [klassen, setKlassen] = useState([]);
  const [selectedKlasId, setSelectedKlasId] = useState(null);
  const [selectedKlas, setSelectedKlas] = useState(null);
  const [klasStudents, setKlasStudents] = useState([]);

  // CMS hierarchy
  const [vakken, setVakken] = useState([]);
  const [leerjaren, setLeerjaren] = useState([]);
  const [niveaus, setNiveaus] = useState([]);
  const [hoofdstukken, setHoofdstukken] = useState([]);
  const [paragrafen, setParagrafen] = useState([]);
  const [contentLeerjaren, setContentLeerjaren] = useState([]);
  const [contentNiveaus, setContentNiveaus] = useState([]);
  const [contentHoofdstukken, setContentHoofdstukken] = useState([]);
  const [contentParagrafen, setContentParagrafen] = useState([]);

  // Navigation state
  const [selectedVakId, setSelectedVakId] = useState(null);
  const [selectedLeerjaarId, setSelectedLeerjaarId] = useState(null);
  const [selectedNiveauId, setSelectedNiveauId] = useState(null);
  const [selectedHoofdstukId, setSelectedHoofdstukId] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // UI state
  const [assignedParagrafen, setAssignedParagrafen] = useState([]);
  const [assignedContentBlocks, setAssignedContentBlocks] = useState({});
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentOverrides, setStudentOverrides] = useState({});
  const [studentContentBlockOverrides, setStudentContentBlockOverrides] = useState({});
  const [contentBlocksByParagraaf, setContentBlocksByParagraaf] = useState({});
  const [contentTreeLoading, setContentTreeLoading] = useState(false);
  const [expandedTreeIds, setExpandedTreeIds] = useState([]);
  const [activeTab, setActiveTab] = useState('klas'); // 'klas' or 'leerlingen'
  const [, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load vakken on mount (CMS data, no auth needed)
  useEffect(() => {
    const loadVakken = async () => {
      try {
        const v = await cmsService.getVakken();
        setVakken(v);
      } catch (error) {
        console.error('Error loading vakken:', error);
      }
    };
    loadVakken();
  }, []);

  useEffect(() => {
    if (!selectedKlasId || vakken.length === 0) return;

    let cancelled = false;

    const loadContentTree = async () => {
      try {
        setContentTreeLoading(true);
        const leerjaarLists = await Promise.all(vakken.map((vak) => cmsService.getLeerjaren(vak.id)));
        const allLeerjaren = leerjaarLists.flat();
        const niveauLists = await Promise.all(allLeerjaren.map((leerjaar) => cmsService.getNiveaus(leerjaar.id)));
        const allNiveaus = niveauLists.flat();
        const hoofdstukLists = await Promise.all(allNiveaus.map((niveau) => cmsService.getHoofdstukken(niveau.id)));
        const allHoofdstukken = hoofdstukLists.flat();
        const paragraafLists = await Promise.all(allHoofdstukken.map((hoofdstuk) => cmsService.getParagrafen(hoofdstuk.id)));
        const allParagrafen = paragraafLists.flat();
        const blockEntries = await Promise.all(
          allParagrafen.map(async (paragraaf) => {
            const blocks = await cmsService.getContentBlocks(paragraaf.id, false).catch(() => []);
            return [paragraaf.id, normalizeContentBlocks(blocks)];
          })
        );

        if (cancelled) return;
        setContentLeerjaren(allLeerjaren);
        setContentNiveaus(allNiveaus);
        setContentHoofdstukken(allHoofdstukken);
        setContentParagrafen(allParagrafen);
        setContentBlocksByParagraaf(Object.fromEntries(blockEntries));
        setExpandedTreeIds((current) => current.length > 0 ? current : vakken.map((vak) => vak.id));
      } catch (error) {
        console.error('Error loading assignment content tree:', error);
        if (!cancelled) {
          setContentLeerjaren([]);
          setContentNiveaus([]);
          setContentHoofdstukken([]);
          setContentParagrafen([]);
          setContentBlocksByParagraaf({});
        }
      } finally {
        if (!cancelled) setContentTreeLoading(false);
      }
    };

    loadContentTree();

    return () => {
      cancelled = true;
    };
  }, [selectedKlasId, vakken]);

  // Load all klassen on mount
  useEffect(() => {
    const loadKlassen = async () => {
      try {
        setLoading(true);
        const allKlassen = await klasService.getAvailableKlassen();
        setKlassen(allKlassen);
      } catch (error) {
        console.error('Error loading klassen:', error);
      } finally {
        setLoading(false);
      }
    };
    loadKlassen();
  }, []);

  // When klas is selected, load its data and students
  useEffect(() => {
    if (!selectedKlasId) return;

    const loadKlasData = async () => {
      try {
        const klas = await klasService.getKlas(selectedKlasId);
        setSelectedKlas(klas);
        setAssignedParagrafen(klas?.enabledParagrafen || []);
        setAssignedContentBlocks(klas?.enabledContentBlocks || {});

        // Load student overrides
        setStudentOverrides(klas?.studentOverrides
          ? Object.fromEntries(Object.entries(klas.studentOverrides).map(([uid, v]) => [uid, v.extraParagrafen || []]))
          : {}
        );
        setStudentContentBlockOverrides(klas?.studentOverrides
          ? Object.fromEntries(Object.entries(klas.studentOverrides).map(([uid, v]) => [uid, v.extraContentBlocks || {}]))
          : {}
        );

        const students = await klasService.getKlasStudents(selectedKlasId);
        setKlasStudents(students);
      } catch (error) {
        console.error('Error loading klas data:', error);
      }
    };

    loadKlasData();
  }, [selectedKlasId]);

  // Load leerjaren when vak is selected
  useEffect(() => {
    if (!selectedVakId) {
      setLeerjaren([]);
      setSelectedLeerjaarId(null);
      setBreadcrumbs([]);
      return;
    }

    const loadLeerjaren = async () => {
      try {
        const lj = await cmsService.getLeerjaren(selectedVakId);
        setLeerjaren(lj);
        const vakData = vakken.find(v => v.id === selectedVakId);
        setBreadcrumbs([{ label: getCmsItemLabel('vak', vakData), id: selectedVakId, type: 'vak' }]);
      } catch (error) {
        console.error('Error loading leerjaren:', error);
      }
    };

    loadLeerjaren();
  }, [selectedVakId, vakken]);

  // Load niveaus when leerjaar is selected
  useEffect(() => {
    if (!selectedLeerjaarId) {
      setNiveaus([]);
      setSelectedNiveauId(null);
      return;
    }

    const loadNiveaus = async () => {
      try {
        const n = await cmsService.getNiveaus(selectedLeerjaarId);
        setNiveaus(n);
        const ljData = leerjaren.find(l => l.id === selectedLeerjaarId);
        setBreadcrumbs(prev => [...prev, { label: getCmsItemLabel('leerjaar', ljData), id: selectedLeerjaarId, type: 'leerjaar' }]);
      } catch (error) {
        console.error('Error loading niveaus:', error);
      }
    };

    loadNiveaus();
  }, [selectedLeerjaarId, leerjaren]);

  // Load hoofdstukken when niveau is selected
  useEffect(() => {
    if (!selectedNiveauId) {
      setHoofdstukken([]);
      setSelectedHoofdstukId(null);
      return;
    }

    const loadHoofdstukken = async () => {
      try {
        const h = await cmsService.getHoofdstukken(selectedNiveauId);
        setHoofdstukken(h);
        const nData = niveaus.find(n => n.id === selectedNiveauId);
        setBreadcrumbs(prev => [...prev, { label: getCmsItemLabel('niveau', nData), id: selectedNiveauId, type: 'niveau' }]);
      } catch (error) {
        console.error('Error loading hoofdstukken:', error);
      }
    };

    loadHoofdstukken();
  }, [selectedNiveauId, niveaus]);

  // Load paragrafen when hoofdstuk is selected
  useEffect(() => {
    if (!selectedHoofdstukId) {
      setParagrafen([]);
      return;
    }

    const loadParagrafen = async () => {
      try {
        const p = await cmsService.getParagrafen(selectedHoofdstukId);
        setParagrafen(p);
        const hData = hoofdstukken.find(h => h.id === selectedHoofdstukId);
        setBreadcrumbs(prev => [...prev, { label: getCmsItemLabel('hoofdstuk', hData), id: selectedHoofdstukId, type: 'hoofdstuk' }]);
      } catch (error) {
        console.error('Error loading paragrafen:', error);
      }
    };

    loadParagrafen();
  }, [selectedHoofdstukId, hoofdstukken]);

  useEffect(() => {
    let cancelled = false;

    const loadContentBlocks = async () => {
      if (paragrafen.length === 0) {
        return;
      }

      try {
        const entries = await Promise.all(
          paragrafen.map(async (paragraaf) => {
            const blocks = await cmsService.getContentBlocks(paragraaf.id, false).catch(() => []);
            return [paragraaf.id, normalizeContentBlocks(blocks)];
          })
        );
        if (!cancelled) {
          setContentBlocksByParagraaf((current) => ({
            ...current,
            ...Object.fromEntries(entries)
          }));
        }
      } catch (error) {
        console.error('Error loading content blocks:', error);
      }
    };

    loadContentBlocks();

    return () => {
      cancelled = true;
    };
  }, [paragrafen]);

  const assignmentTree = useMemo(
    () =>
      buildCmsNavigationTree({
        vakken,
        leerjaren: contentLeerjaren,
        niveaus: contentNiveaus,
        hoofdstukken: contentHoofdstukken,
        paragrafen: contentParagrafen,
        contentBlocks: Object.values(contentBlocksByParagraaf).flat()
      }),
    [vakken, contentLeerjaren, contentNiveaus, contentHoofdstukken, contentParagrafen, contentBlocksByParagraaf]
  );

  const selectedIds = {
    vak: selectedVakId,
    leerjaar: selectedLeerjaarId,
    niveau: selectedNiveauId,
    hoofdstuk: selectedHoofdstukId
  };

  const toggleTreeExpand = (id) => {
    setExpandedTreeIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const expandAncestors = (...ids) => {
    setExpandedTreeIds((current) => [...new Set([...current, ...ids.filter(Boolean)])]);
  };

  const handleTreeNodeSelect = (node) => {
    if (node.type === 'vak') {
      setSelectedVakId(node.id);
      setSelectedLeerjaarId(null);
      setSelectedNiveauId(null);
      setSelectedHoofdstukId(null);
      setBreadcrumbs([{ label: getCmsItemLabel('vak', node), id: node.id, type: 'vak' }]);
      expandAncestors(node.id);
      return;
    }

    if (node.type === 'leerjaar') {
      const vak = vakken.find((item) => item.id === node.vakId);
      setSelectedVakId(node.vakId);
      setSelectedLeerjaarId(node.id);
      setSelectedNiveauId(null);
      setSelectedHoofdstukId(null);
      setBreadcrumbs([
        { label: getCmsItemLabel('vak', vak), id: node.vakId, type: 'vak' },
        { label: getCmsItemLabel('leerjaar', node), id: node.id, type: 'leerjaar' }
      ]);
      expandAncestors(node.vakId, node.id);
      return;
    }

    if (node.type === 'niveau') {
      const leerjaar = contentLeerjaren.find((item) => item.id === node.leerjaarId);
      const vakId = node.vakId || leerjaar?.vakId;
      const vak = vakken.find((item) => item.id === vakId);
      setSelectedVakId(vakId);
      setSelectedLeerjaarId(node.leerjaarId);
      setSelectedNiveauId(node.id);
      setSelectedHoofdstukId(null);
      setBreadcrumbs([
        { label: getCmsItemLabel('vak', vak), id: vakId, type: 'vak' },
        { label: getCmsItemLabel('leerjaar', leerjaar), id: node.leerjaarId, type: 'leerjaar' },
        { label: getCmsItemLabel('niveau', node), id: node.id, type: 'niveau' }
      ]);
      expandAncestors(vakId, node.leerjaarId, node.id);
      return;
    }

    if (node.type === 'hoofdstuk') {
      const niveau = contentNiveaus.find((item) => item.id === node.niveauId);
      const leerjaar = contentLeerjaren.find((item) => item.id === niveau?.leerjaarId);
      const vakId = node.vakId || niveau?.vakId || leerjaar?.vakId;
      const vak = vakken.find((item) => item.id === vakId);
      setSelectedVakId(vakId);
      setSelectedLeerjaarId(niveau?.leerjaarId || null);
      setSelectedNiveauId(node.niveauId);
      setSelectedHoofdstukId(node.id);
      setBreadcrumbs([
        { label: getCmsItemLabel('vak', vak), id: vakId, type: 'vak' },
        { label: getCmsItemLabel('leerjaar', leerjaar), id: niveau?.leerjaarId, type: 'leerjaar' },
        { label: getCmsItemLabel('niveau', niveau), id: node.niveauId, type: 'niveau' },
        { label: getCmsItemLabel('hoofdstuk', node), id: node.id, type: 'hoofdstuk' }
      ]);
      expandAncestors(vakId, niveau?.leerjaarId, node.niveauId, node.id);
      return;
    }

    if (node.type === 'paragraaf') {
      const hoofdstuk = contentHoofdstukken.find((item) => item.id === node.hoofdstukId);
      if (hoofdstuk) handleTreeNodeSelect(hoofdstuk);
    }
  };

  const handleBreadcrumbClick = (index) => {
    if (index === 0) {
      setSelectedVakId(null);
      setSelectedLeerjaarId(null);
      setSelectedNiveauId(null);
      setSelectedHoofdstukId(null);
    } else if (index === 1) {
      setSelectedLeerjaarId(null);
      setSelectedNiveauId(null);
      setSelectedHoofdstukId(null);
    } else if (index === 2) {
      setSelectedNiveauId(null);
      setSelectedHoofdstukId(null);
    } else if (index === 3) {
      setSelectedHoofdstukId(null);
    }
  };

  const toggleParagraafAssignment = async (paragraafId) => {
    if (!selectedKlasId || !selectedKlas) return;

    try {
      setSaving(true);
      const newAssignments = assignedParagrafen.includes(paragraafId)
        ? assignedParagrafen.filter(id => id !== paragraafId)
        : [...assignedParagrafen, paragraafId];

      setAssignedParagrafen(newAssignments);
      await klasService.updateKlasEnabledParagrafen(selectedKlasId, newAssignments);
    } catch (error) {
      console.error('Error updating assignments:', error);
      setAssignedParagrafen(selectedKlas.enabledParagrafen || []);
    } finally {
      setSaving(false);
    }
  };

  const toggleHoofdstukAssignment = async (hoofdstukId = selectedHoofdstukId) => {
    const chapterParagrafen = contentParagrafen.filter((p) => p.hoofdstukId === hoofdstukId);
    const targetParagrafen = chapterParagrafen.length > 0 ? chapterParagrafen : paragrafen;
    if (!selectedKlasId || targetParagrafen.length === 0) return;

    try {
      setSaving(true);
      const chapterParagraafIds = targetParagrafen.map((p) => p.id);
      const allAssigned = chapterParagraafIds.every((id) => assignedParagrafen.includes(id));
      const newAssignments = allAssigned
        ? assignedParagrafen.filter((id) => !chapterParagraafIds.includes(id))
        : [...new Set([...assignedParagrafen, ...chapterParagraafIds])];

      setAssignedParagrafen(newAssignments);
      await klasService.updateKlasEnabledParagrafen(selectedKlasId, newAssignments);
    } catch (error) {
      console.error('Error updating chapter assignments:', error);
      setAssignedParagrafen(selectedKlas?.enabledParagrafen || []);
    } finally {
      setSaving(false);
    }
  };

  const toggleContentBlockAssignment = async (paragraafId, blockId) => {
    if (!selectedKlasId || !paragraafId || !blockId) return;

    try {
      setSaving(true);
      const blocks = contentBlocksByParagraaf[paragraafId] || [];

      if (selectedStudentId) {
        const studentBlocksByParagraaf = studentContentBlockOverrides[selectedStudentId] || {};
        const current = studentBlocksByParagraaf[paragraafId] || [];
        const next = current.includes(blockId)
          ? current.filter((id) => id !== blockId)
          : [...current, blockId];
        const nextStudentOverrides = {
          ...studentBlocksByParagraaf,
          [paragraafId]: next
        };

        setStudentContentBlockOverrides((prev) => ({
          ...prev,
          [selectedStudentId]: nextStudentOverrides
        }));
        await klasService.setStudentContentBlockOverride(selectedKlasId, selectedStudentId, paragraafId, next);
        return;
      }

      const hasExplicitSelection = Array.isArray(assignedContentBlocks[paragraafId]);
      const current = hasExplicitSelection
        ? assignedContentBlocks[paragraafId]
        : blocks.map((block) => block.id);
      const next = current.includes(blockId)
        ? current.filter((id) => id !== blockId)
        : [...current, blockId];

      setAssignedContentBlocks((prev) => ({ ...prev, [paragraafId]: next }));
      await klasService.updateKlasEnabledContentBlocks(selectedKlasId, paragraafId, next);
    } catch (error) {
      console.error('Error updating content block assignment:', error);
      setAssignedContentBlocks(selectedKlas?.enabledContentBlocks || {});
    } finally {
      setSaving(false);
    }
  };

  const clearContentBlockSelection = async (paragraafId) => {
    if (!selectedKlasId || !paragraafId) return;

    try {
      setSaving(true);
      setAssignedContentBlocks((prev) => {
        const next = { ...prev };
        delete next[paragraafId];
        return next;
      });
      await klasService.clearKlasEnabledContentBlocks(selectedKlasId, paragraafId);
    } catch (error) {
      console.error('Error clearing content block selection:', error);
    } finally {
      setSaving(false);
    }
  };

  const removeAssignment = async (paragraafId) => {
    if (!selectedKlasId) return;
    await toggleParagraafAssignment(paragraafId);
  };

  const toggleStudentOverride = async (paragraafId) => {
    if (!selectedKlasId || !selectedStudentId) return;

    try {
      setSaving(true);
      const current = studentOverrides[selectedStudentId] || [];
      const newExtras = current.includes(paragraafId)
        ? current.filter(id => id !== paragraafId)
        : [...current, paragraafId];

      setStudentOverrides(prev => ({ ...prev, [selectedStudentId]: newExtras }));
      await klasService.setStudentOverride(selectedKlasId, selectedStudentId, newExtras);
    } catch (error) {
      console.error('Error updating student override:', error);
    } finally {
      setSaving(false);
    }
  };

  const getAssignedBlockCount = () => Object.values(assignedContentBlocks)
    .reduce((total, ids) => total + (Array.isArray(ids) ? ids.length : 0), 0);

  const currentFlowStep = selectedHoofdstukId
    ? 3
    : selectedKlasId
      ? 2
      : 1;

  // Check if no klas is selected
  if (!selectedKlasId) {
    return (
      <div className="beheer-stijl lo-tekst helix-page min-h-screen">
        <div className="helix-container max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <PaginaKop
              eyebrow="Lesstof"
              titel="Lesmateriaal klaarzetten"
              uitleg="Koppel gemaakte hoofdstukken, paragrafen of lesblokken aan een klas of individuele leerling."
              acties={(
                <div className="lo-knoppenbalk">
                  <button
                    onClick={() => navigate('/admin/lesstof')}
                    className="lo-knop-tweede lo-knop--klein"
                  >
                    Terug naar Lesstof
                  </button>
                </div>
              )}
            />
          </div>

          <div className="mb-6">
            <FlowSteps currentStep={currentFlowStep} />
          </div>

          {/* Klas Selector */}
          <div className="helix-card p-8">
            <div className="mb-5">
              <h2 className="text-xl font-extrabold text-[var(--lo-inkt)]">Start met een klas</h2>
              <p className="mt-1 text-sm text-[var(--lo-grijs)]">
                Daarna kies je welk lesmateriaal je klaarzet.
              </p>
            </div>
            <label className="mb-3 block text-sm font-extrabold text-[var(--lo-inkt)]">Klas selecteren</label>
            <select
              value={selectedKlasId || ''}
              onChange={(e) => setSelectedKlasId(e.target.value)}
              className="lo-invoer"
            >
              <option value="">Kies een klas...</option>
              {klassen.map(klas => (
                <option key={klas.klasId} value={klas.klasId}>
                  {klas.name} ({klas.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="beheer-stijl lo-tekst helix-page min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-[var(--lo-lijn)] bg-[var(--lo-kaart)]">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/lesstof')}
              className="btn-secondary w-auto px-3 py-2"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-[var(--lo-inkt)]">Lesmateriaal klaarzetten</h1>
              <p className="text-sm font-medium text-[var(--lo-grijs)]">
                {selectedKlas?.name} ({selectedKlas?.code})
              </p>
            </div>
            <button
              type="button"
              onClick={() => openHelp('inclusie')}
              className="text-sm font-bold text-[var(--lo-blauw-inkt)] underline-offset-2 hover:underline"
            >
              Hoe zet ik inclusie klaar?
            </button>
          </div>

          {/* Klas Selector */}
          <select
            value={selectedKlasId}
            onChange={(e) => setSelectedKlasId(e.target.value)}
            className="input-standard w-auto py-2 text-sm"
          >
            {klassen.map(klas => (
              <option key={klas.klasId} value={klas.klasId}>
                {klas.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="mb-6">
          <FlowSteps currentStep={currentFlowStep} />
        </div>

        <div className="helix-card mb-6 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="helix-eyebrow">Klaarzetstudio</p>
              <h2 className="mt-1 text-xl font-extrabold text-[var(--lo-inkt)]">Kies links het lesmateriaal, zet rechts de bestemming klaar</h2>
              <p className="mt-1 text-sm text-[var(--lo-grijs)]">
                Je kunt een heel hoofdstuk klaarzetten, losse paragrafen kiezen of binnen een paragraaf specifieke lesblokken selecteren.
              </p>
            </div>
            <div className="lo-knoppenbalk">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="lo-knop-tweede lo-knop--klein"
              >
                Bekijk voortgang
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Left panel: Content Browser */}
          <div className="helix-card col-span-2 flex flex-col overflow-hidden">
            {/* Breadcrumb */}
            {breadcrumbs.length > 0 && (
              <div className="px-6 py-4 border-b border-[var(--lo-lijn)] flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => {
                    setSelectedVakId(null);
                    setSelectedLeerjaarId(null);
                    setSelectedNiveauId(null);
                    setSelectedHoofdstukId(null);
                  }}
                  className="text-sm text-[var(--lo-grijs)] hover:text-[var(--lo-inkt)] font-medium whitespace-nowrap"
                >
                  Home
                </button>
                {breadcrumbs.map((crumb, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <ChevronRight size={16} className="text-[var(--lo-grijs)]" />
                    <button
                      onClick={() => handleBreadcrumbClick(i)}
                      className="text-sm text-[var(--lo-grijs)] hover:text-[var(--lo-inkt)] font-medium whitespace-nowrap"
                    >
                      {crumb.label}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Student override mode banner */}
            {selectedStudentId && (
              <div className="lo-melding lo-melding--info items-center justify-between rounded-none px-6">
                <span className="font-bold text-[var(--lo-inkt)]">
                  Extra lesmateriaal voor: {klasStudents.find(s => s.uid === selectedStudentId)?.displayName}
                </span>
                <div className="lo-knoppenbalk">
                  <button
                    onClick={() => setSelectedStudentId(null)}
                    className="lo-knop-tweede lo-knop--klein"
                  >
                    Terug naar klas
                  </button>
                </div>
              </div>
            )}

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {contentTreeLoading ? (
                <HelixLaden tekst="Lesmateriaal laden..." className="min-h-0 py-12" />
              ) : assignmentTree.length === 0 ? (
                <div className="text-center text-[var(--lo-grijs)] py-12">
                  <AlertCircle size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Geen lesmateriaal beschikbaar</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {assignmentTree.map((node) => (
                    <AssignmentTreeNode
                      key={node.id}
                      node={node}
                      expandedIds={expandedTreeIds}
                      selectedIds={selectedIds}
                      assignedParagrafen={assignedParagrafen}
                      assignedContentBlocks={assignedContentBlocks}
                      studentOverrides={studentOverrides}
                      studentContentBlockOverrides={studentContentBlockOverrides}
                      selectedStudentId={selectedStudentId}
                      contentBlocksByParagraaf={contentBlocksByParagraaf}
                      allParagrafen={contentParagrafen}
                      saving={saving}
                      onToggleExpand={toggleTreeExpand}
                      onSelectNode={handleTreeNodeSelect}
                      onToggleParagraaf={toggleParagraafAssignment}
                      onToggleStudentParagraaf={toggleStudentOverride}
                      onToggleHoofdstuk={toggleHoofdstukAssignment}
                      onToggleContentBlock={toggleContentBlockAssignment}
                      onClearContentBlocks={clearContentBlockSelection}
                    />
                  ))}
                </div>
              )}

              {/* Vakken */}
              {showLegacyCardBrowser && !selectedVakId && (
                <>
                  {vakken.length === 0 ? (
                    <div className="text-center text-[var(--lo-grijs)] py-12">
                      <AlertCircle size={48} className="mx-auto mb-3 opacity-50" />
                      <p>Geen vakken beschikbaar</p>
                    </div>
                  ) : (
                    vakken.map(vak => {
                      const style = getColorStyle(vak.color);
                      return (
                        <div
                          key={vak.id}
                          onClick={() => setSelectedVakId(vak.id)}
                          className="p-4 border rounded-lg hover:opacity-80 cursor-pointer transition-colors flex items-center gap-3"
                          style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}
                        >
                          <span className="flex-shrink-0"><BookOpenCheck size={18} /></span>
                          <span className="font-medium">{vak.naam}</span>
                          <ChevronRight size={16} className="ml-auto flex-shrink-0" style={{ opacity: 0.6 }} />
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* Leerjaren */}
              {showLegacyCardBrowser && selectedVakId && !selectedLeerjaarId && (
                <>
                  {leerjaren.length === 0 ? (
                    <div className="text-center text-[var(--lo-grijs)] py-12">
                      <p>Geen leerjaren beschikbaar</p>
                    </div>
                  ) : (
                    leerjaren.map(lj => {
                      const style = getColorStyle(lj.color);
                      return (
                        <div
                          key={lj.id}
                          onClick={() => setSelectedLeerjaarId(lj.id)}
                          className="p-4 border rounded-lg hover:opacity-80 cursor-pointer transition-colors flex items-center gap-3"
                          style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}
                        >
                          <span className="flex-shrink-0"><GraduationCap size={18} /></span>
                          <span className="font-medium">{lj.name}</span>
                          <ChevronRight size={16} className="ml-auto flex-shrink-0" style={{ opacity: 0.6 }} />
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* Niveaus */}
              {showLegacyCardBrowser && selectedLeerjaarId && !selectedNiveauId && (
                <>
                  {niveaus.length === 0 ? (
                    <div className="text-center text-[var(--lo-grijs)] py-12">
                      <p>Geen niveaus beschikbaar</p>
                    </div>
                  ) : (
                    niveaus.map(niveau => {
                      const style = getColorStyle(niveau.color);
                      return (
                        <div
                          key={niveau.id}
                          onClick={() => setSelectedNiveauId(niveau.id)}
                          className="p-4 border rounded-lg hover:opacity-80 cursor-pointer transition-colors flex items-center gap-3"
                          style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}
                        >
                          <span className="flex-shrink-0"><ListChecks size={18} /></span>
                          <div className="flex-1">
                            <div className="font-medium">{niveau.label}</div>
                            <div className="text-xs" style={{ opacity: 0.7 }}>{niveau.name}</div>
                          </div>
                          <ChevronRight size={16} className="flex-shrink-0" style={{ opacity: 0.6 }} />
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* Hoofdstukken */}
              {showLegacyCardBrowser && selectedNiveauId && !selectedHoofdstukId && (
                <>
                  {hoofdstukken.length === 0 ? (
                    <div className="text-center text-[var(--lo-grijs)] py-12">
                      <p>Geen hoofdstukken beschikbaar</p>
                    </div>
                  ) : (
                    hoofdstukken.map(h => {
                      const style = getColorStyle(h.color);
                      return (
                        <div
                          key={h.id}
                          onClick={() => setSelectedHoofdstukId(h.id)}
                          className="p-4 border rounded-lg hover:opacity-80 cursor-pointer transition-colors flex items-center gap-3"
                          style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}
                        >
                          <span className="flex-shrink-0"><BookOpenCheck size={18} /></span>
                          <span className="font-medium">{h.title || (h.number ? `Hoofdstuk ${h.number}` : 'Hoofdstuk zonder naam')}</span>
                          <ChevronRight size={16} className="ml-auto flex-shrink-0" style={{ opacity: 0.6 }} />
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* Paragrafen */}
              {showLegacyCardBrowser && selectedHoofdstukId && (
                <>
                  <div className="rounded-xl border border-[var(--lo-lijn)] bg-[var(--lo-papier-2)] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold text-[var(--lo-inkt)]">Hoofdstuk klaarzetten</h3>
                        <p className="text-xs text-[var(--lo-grijs)]">
                          Zet alle paragrafen uit dit hoofdstuk in een keer klaar.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={toggleHoofdstukAssignment}
                        disabled={saving || selectedStudentId || paragrafen.length === 0}
                        className="btn-secondary w-auto px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        title={selectedStudentId ? 'Bulkactie is alleen voor de klas. Kies losse extra paragrafen voor een leerling.' : ''}
                      >
                        Hoofdstuk aan/uit
                      </button>
                    </div>
                  </div>

                  {paragrafen.length === 0 ? (
                    <div className="text-center text-[var(--lo-grijs)] py-12">
                      <p>Geen paragrafen beschikbaar</p>
                    </div>
                  ) : (
                    paragrafen.map(para => {
                      const isInClassDefault = assignedParagrafen.includes(para.id);
                      const studentExtras = studentOverrides[selectedStudentId] || [];
                      const isInStudentOverride = studentExtras.includes(para.id);
                      const isChecked = selectedStudentId ? (isInClassDefault || isInStudentOverride) : isInClassDefault;
                      const isDisabled = selectedStudentId && isInClassDefault;

                      return (
                        <div
                          key={para.id}
                          className={`p-4 border border-[var(--lo-lijn)] rounded-lg transition-colors group ${
                            isDisabled ? 'opacity-50' : 'hover:bg-[var(--lo-papier-2)]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => selectedStudentId ? toggleStudentOverride(para.id) : toggleParagraafAssignment(para.id)}
                              disabled={saving || isDisabled}
                              className="mt-1 h-5 w-5 cursor-pointer rounded accent-[var(--lo-blauw)]"
                              title={isDisabled ? "Al in klassestandaard" : ""}
                            />
                            <div className="flex-1">
                              <div className="font-medium text-[var(--lo-inkt)]">{para.title || 'Paragraaf zonder naam'}</div>
                              {para.beschrijving && (
                                <div className="text-xs text-[var(--lo-grijs)] line-clamp-1">{para.beschrijving}</div>
                              )}
                              <div className="mt-1 text-xs text-[var(--lo-grijs)]">
                                {(contentBlocksByParagraaf[para.id] || []).length} lesblokken
                                {Array.isArray(assignedContentBlocks[para.id]) && (
                                  <Label kleur="blauw" className="ml-2">
                                    {assignedContentBlocks[para.id].length} geselecteerd
                                  </Label>
                                )}
                              </div>
                            </div>
                            {isChecked && (
                              <CheckSquare size={18} className="mt-1 flex-shrink-0 text-[var(--lo-groen-inkt)]" />
                            )}
                          </div>

                          {isChecked && (contentBlocksByParagraaf[para.id] || []).length > 0 && (
                            <div className="mt-4 border-t border-[var(--lo-lijn)] pt-3">
                              <div className="mb-2 flex items-center justify-between gap-3">
                                <span className="lo-onderregel font-bold">
                                  Onderdelen van deze paragraaf
                                </span>
                                {!selectedStudentId && Array.isArray(assignedContentBlocks[para.id]) && (
                                  <button
                                    type="button"
                                    onClick={() => clearContentBlockSelection(para.id)}
                                    className="text-xs font-bold text-[var(--lo-blauw-inkt)] hover:text-[var(--lo-inkt)]"
                                  >
                                    Alle blokken tonen
                                  </button>
                                )}
                              </div>
                              <div className="space-y-2">
                                {(contentBlocksByParagraaf[para.id] || []).map((block) => {
                                  const classSelection = assignedContentBlocks[para.id];
                                  const classHasExplicitSelection = Array.isArray(classSelection);
                                  const isClassBlockSelected = classHasExplicitSelection
                                    ? classSelection.includes(block.id)
                                    : true;
                                  const studentBlockExtras = studentContentBlockOverrides[selectedStudentId]?.[para.id] || [];
                                  const isStudentBlockSelected = studentBlockExtras.includes(block.id);
                                  const blockChecked = selectedStudentId ? isStudentBlockSelected : isClassBlockSelected;
                                  const blockDisabled = selectedStudentId && isClassBlockSelected;

                                  return (
                                    <label
                                      key={block.id}
                                      className={`flex items-start gap-3 rounded-lg border px-3 py-2 text-sm ${
                                        blockDisabled
                                          ? 'border-[var(--lo-lijn)] bg-[var(--lo-papier-2)] opacity-60'
                                          : 'border-[var(--lo-lijn)] bg-white hover:border-[var(--lo-blauw)]'
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={blockChecked}
                                        disabled={saving || blockDisabled}
                                        onChange={() => toggleContentBlockAssignment(para.id, block.id)}
                                        className="mt-1 h-4 w-4 cursor-pointer rounded accent-[var(--lo-blauw)]"
                                      />
                                      <span className="flex-1">
                                        <span className="block font-bold text-[var(--lo-inkt)]">
                                          Stap {block.order || '-'} - {CONTENT_BLOCK_LABELS[block.type] || 'Lesblok'} - {block.title || 'Naamloos'}
                                        </span>
                                        <span className="line-clamp-1 text-xs text-[var(--lo-grijs)]">
                                          {buildContentBlockPreview(block)}
                                        </span>
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right panel: Assignment Overview */}
          <div className="helix-card flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-[var(--lo-lijn)] p-3">
              <button
                onClick={() => setActiveTab('klas')}
                className={`dashboard-lens-tab flex-1 ${activeTab === 'klas' ? 'dashboard-lens-tab-active' : ''}`}
              >
                Klaargezet ({assignedParagrafen.length})
              </button>
              <button
                onClick={() => setActiveTab('leerlingen')}
                className={`dashboard-lens-tab flex-1 ${activeTab === 'leerlingen' ? 'dashboard-lens-tab-active' : ''}`}
              >
                Per leerling ({klasStudents.length})
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'klas' && (
                <div className="space-y-2">
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <div className="lo-kaart gap-0 p-3">
                      <div className="text-2xl font-extrabold tabular-nums text-[var(--lo-inkt)]">{assignedParagrafen.length}</div>
                      <div className="lo-onderregel font-bold">Paragrafen</div>
                    </div>
                    <div className="lo-kaart gap-0 p-3">
                      <div className="text-2xl font-extrabold tabular-nums text-[var(--lo-inkt)]">{getAssignedBlockCount()}</div>
                      <div className="lo-onderregel font-bold">Gekozen blokken</div>
                    </div>
                  </div>
                  {assignedParagrafen.length === 0 ? (
                    <p className="text-[var(--lo-grijs)] text-sm text-center py-8">
                      Nog geen lesmateriaal klaargezet
                    </p>
                  ) : (
                    assignedParagrafen.map(paragraafId => {
                      const foundParagraaf = contentParagrafen.find(p => p.id === paragraafId) || paragrafen.find(p => p.id === paragraafId);
                      const displayName = foundParagraaf
                        ? getCmsItemLabel('paragraaf', foundParagraaf)
                        : `Para ${paragraafId}`;

                      return (
                        <div
                          key={paragraafId}
                          className="p-2 bg-[var(--lo-papier-2)] rounded border border-[var(--lo-lijn)] flex items-center justify-between text-sm"
                        >
                          <span className="font-medium text-[var(--lo-inkt)]">{displayName}</span>
                          <button
                            onClick={() => removeAssignment(paragraafId)}
                            aria-label="Klaargezet lesmateriaal verwijderen"
                            className="text-[var(--lo-rood-inkt)] hover:text-[var(--lo-rood)] font-bold"
                          >
                            x
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === 'leerlingen' && (
                <div className="space-y-2">
                  {klasStudents.length === 0 ? (
                    <p className="text-[var(--lo-grijs)] text-sm text-center py-8">
                      Geen leerlingen in klas
                    </p>
                  ) : (
                    klasStudents.map(student => {
                      const extras = studentOverrides[student.uid] || [];
                      const isSelected = selectedStudentId === student.uid;

                      return (
                        <div
                          key={student.uid}
                          className={`border rounded-lg transition-colors ${
                            isSelected ? 'border-[var(--lo-lijn)] bg-[var(--lo-oranje-zacht)]' : 'border-[var(--lo-lijn)]'
                          }`}
                        >
                          {/* Header row - clickable */}
                          <div
                            onClick={() => setSelectedStudentId(isSelected ? null : student.uid)}
                            className="lo-rij justify-between cursor-pointer hover:bg-[var(--lo-oranje-zacht)]"
                          >
                            <div>
                              <div className="lo-rij-titel">{student.displayName}</div>
                              <div className="lo-onderregel">{student.email}</div>
                            </div>
                            {extras.length > 0 && (
                              <Label kleur="oranje" className="ml-2">
                                +{extras.length}
                              </Label>
                            )}
                          </div>

                          {/* Expanded: list of overrides */}
                          {isSelected && (
                            <div className="border-t border-[var(--lo-lijn)] px-3 pb-3 pt-2 space-y-1">
                              {extras.length === 0 ? (
                                <p className="text-xs text-[var(--lo-grijs)] py-2">Geen extra lesmateriaal. Selecteer links een paragraaf of lesblok.</p>
                              ) : (
                                extras.map(paraId => {
                                  const para = contentParagrafen.find(p => p.id === paraId) || paragrafen.find(p => p.id === paraId);
                                  return (
                                    <div key={paraId} className="flex items-center justify-between text-xs bg-white border border-[var(--lo-lijn)] rounded px-2 py-1">
                                      <span className="font-medium text-[var(--lo-inkt)]">{para ? getCmsItemLabel('paragraaf', para) : paraId}</span>
                                      <button
                                        onClick={() => toggleStudentOverride(paraId)}
                                        aria-label="Extra lesmateriaal verwijderen"
                                        className="text-[var(--lo-rood-inkt)] hover:text-[var(--lo-rood)] font-bold ml-2"
                                      >
                                        x
                                      </button>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
