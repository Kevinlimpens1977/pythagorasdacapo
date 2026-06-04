import { useEffect, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  ChevronRight,
  Clapperboard,
  FileText,
  Layers
} from 'lucide-react';
import DigibordViewer from '../components/digibord/DigibordViewer';
import {
  getDigibordCardMeta,
  getDigibordContextTitle,
  getDigibordItemLabel
} from '../lib/digibordNavigationUtils';
import { getColorStyle } from '../lib/paletColors';
import cmsService from '../services/cmsService';

const iconMap = {
  vak: BookOpen,
  leerjaar: BarChart3,
  niveau: Layers,
  hoofdstuk: FileText,
  paragraaf: Clapperboard
};

const DigibordCard = ({ type, item, childCount = 0, onClick }) => {
  const style = getColorStyle(item?.color);
  const Icon = iconMap[type] || BookOpen;
  const meta = getDigibordCardMeta(type, { childCount });
  const label = getDigibordItemLabel(type, item);

  return (
    <button
      onClick={onClick}
      className="group helix-action-card relative overflow-hidden p-5 text-left"
    >
      <div className="flex min-h-[9rem] flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-lg"
              style={{ backgroundColor: style.bg, color: style.text }}
            >
              <Icon size={22} />
            </div>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-slate-500">
              {meta.eyebrow}
            </span>
          </div>
          <h3 className="mt-4 text-xl font-black leading-tight text-slate-950">{label}</h3>
          <p className="mt-2 text-sm font-medium text-slate-500">{meta.subtitle}</p>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-blue-600">{meta.action}</span>
          <ChevronRight size={18} className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
        </div>
      </div>
    </button>
  );
};

export default function AdminDigibordPage() {
  const [selectedVakId, setSelectedVakId] = useState(null);
  const [selectedLeerjaarId, setSelectedLeerjaarId] = useState(null);
  const [selectedNiveauId, setSelectedNiveauId] = useState(null);
  const [selectedHoofdstukId, setSelectedHoofdstukId] = useState(null);
  const [selectedParagraafId, setSelectedParagraafId] = useState(null);

  const [vakken, setVakken] = useState([]);
  const [leerjaren, setLeerjaren] = useState([]);
  const [niveaus, setNiveaus] = useState([]);
  const [hoofdstukken, setHoofdstukken] = useState([]);
  const [paragrafen, setParagrafen] = useState([]);

  const [loading, setLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const loadVakken = async () => {
      try {
        setLoading(true);
        const data = await cmsService.getVakken();
        const withCounts = await Promise.all(
          data.map(async (vak) => {
            const children = await cmsService.getLeerjaren(vak.id);
            return { ...vak, leerjarenCount: children.length };
          })
        );
        setVakken(withCounts);
      } catch (error) {
        console.error('Error loading vakken:', error);
      } finally {
        setLoading(false);
      }
    };
    loadVakken();
  }, []);

  useEffect(() => {
    if (!selectedVakId) {
      return;
    }

    const loadLeerjaren = async () => {
      try {
        setLoading(true);
        const data = await cmsService.getLeerjaren(selectedVakId);
        const withCounts = await Promise.all(
          data.map(async (leerjaar) => {
            const children = await cmsService.getNiveaus(leerjaar.id);
            return { ...leerjaar, niveausCount: children.length };
          })
        );
        setLeerjaren(withCounts);
        setBreadcrumbs([
          {
            label: getDigibordItemLabel('vak', vakken.find((vak) => vak.id === selectedVakId)),
            id: selectedVakId,
            type: 'vak'
          }
        ]);
      } catch (error) {
        console.error('Error loading leerjaren:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeerjaren();
  }, [selectedVakId, vakken]);

  useEffect(() => {
    if (!selectedLeerjaarId) {
      return;
    }

    const loadNiveaus = async () => {
      try {
        setLoading(true);
        const data = await cmsService.getNiveaus(selectedLeerjaarId);
        const withCounts = await Promise.all(
          data.map(async (niveau) => {
            const children = await cmsService.getHoofdstukken(niveau.id);
            return { ...niveau, hoofdstukkenCount: children.length };
          })
        );
        setNiveaus(withCounts);
        setBreadcrumbs((prev) => [
          ...prev.filter((crumb) => crumb.type !== 'leerjaar' && crumb.type !== 'niveau' && crumb.type !== 'hoofdstuk'),
          {
            label: getDigibordItemLabel('leerjaar', leerjaren.find((leerjaar) => leerjaar.id === selectedLeerjaarId)),
            id: selectedLeerjaarId,
            type: 'leerjaar'
          }
        ]);
      } catch (error) {
        console.error('Error loading niveaus:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNiveaus();
  }, [selectedLeerjaarId, leerjaren]);

  useEffect(() => {
    if (!selectedNiveauId) {
      return;
    }

    const loadHoofdstukken = async () => {
      try {
        setLoading(true);
        const data = await cmsService.getHoofdstukken(selectedNiveauId);
        const withCounts = await Promise.all(
          data.map(async (hoofdstuk) => {
            const children = await cmsService.getParagrafen(hoofdstuk.id);
            return { ...hoofdstuk, paragrafenCount: children.length };
          })
        );
        setHoofdstukken(withCounts);
        setBreadcrumbs((prev) => [
          ...prev.filter((crumb) => crumb.type !== 'niveau' && crumb.type !== 'hoofdstuk'),
          {
            label: getDigibordItemLabel('niveau', niveaus.find((niveau) => niveau.id === selectedNiveauId)),
            id: selectedNiveauId,
            type: 'niveau'
          }
        ]);
      } catch (error) {
        console.error('Error loading hoofdstukken:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHoofdstukken();
  }, [selectedNiveauId, niveaus]);

  useEffect(() => {
    if (!selectedHoofdstukId) {
      return;
    }

    const loadParagrafen = async () => {
      try {
        setLoading(true);
        const data = await cmsService.getParagrafen(selectedHoofdstukId);
        setParagrafen(data);
        setBreadcrumbs((prev) => [
          ...prev.filter((crumb) => crumb.type !== 'hoofdstuk'),
          {
            label: getDigibordItemLabel('hoofdstuk', hoofdstukken.find((hoofdstuk) => hoofdstuk.id === selectedHoofdstukId)),
            id: selectedHoofdstukId,
            type: 'hoofdstuk'
          }
        ]);
      } catch (error) {
        console.error('Error loading paragrafen:', error);
      } finally {
        setLoading(false);
      }
    };

    loadParagrafen();
  }, [selectedHoofdstukId, hoofdstukken]);

  const selectedVak = vakken.find((vak) => vak.id === selectedVakId);
  const selectedLeerjaar = leerjaren.find((leerjaar) => leerjaar.id === selectedLeerjaarId);
  const selectedNiveau = niveaus.find((niveau) => niveau.id === selectedNiveauId);
  const selectedHoofdstuk = hoofdstukken.find((hoofdstuk) => hoofdstuk.id === selectedHoofdstukId);
  const selectedParagraaf = paragrafen.find((paragraaf) => paragraaf.id === selectedParagraafId);

  const contextTitle = getDigibordContextTitle({
    selectedVak,
    selectedLeerjaar,
    selectedNiveau,
    selectedHoofdstuk
  });

  const resetToHome = () => {
    setSelectedVakId(null);
    setSelectedLeerjaarId(null);
    setSelectedNiveauId(null);
    setSelectedHoofdstukId(null);
    setSelectedParagraafId(null);
    setLeerjaren([]);
    setNiveaus([]);
    setHoofdstukken([]);
    setParagrafen([]);
    setBreadcrumbs([]);
  };

  const selectVak = (vakId) => {
    setSelectedVakId(vakId);
    setSelectedLeerjaarId(null);
    setSelectedNiveauId(null);
    setSelectedHoofdstukId(null);
    setLeerjaren([]);
    setNiveaus([]);
    setHoofdstukken([]);
    setParagrafen([]);
  };

  const selectLeerjaar = (leerjaarId) => {
    setSelectedLeerjaarId(leerjaarId);
    setSelectedNiveauId(null);
    setSelectedHoofdstukId(null);
    setNiveaus([]);
    setHoofdstukken([]);
    setParagrafen([]);
  };

  const selectNiveau = (niveauId) => {
    setSelectedNiveauId(niveauId);
    setSelectedHoofdstukId(null);
    setHoofdstukken([]);
    setParagrafen([]);
  };

  const selectHoofdstuk = (hoofdstukId) => {
    setSelectedHoofdstukId(hoofdstukId);
    setParagrafen([]);
  };

  const handleBreadcrumbClick = (index) => {
    if (index === 0) {
      setSelectedLeerjaarId(null);
      setSelectedNiveauId(null);
      setSelectedHoofdstukId(null);
      setNiveaus([]);
      setHoofdstukken([]);
      setParagrafen([]);
    } else if (index === 1) {
      setSelectedNiveauId(null);
      setSelectedHoofdstukId(null);
      setHoofdstukken([]);
      setParagrafen([]);
    } else if (index === 2) {
      setSelectedHoofdstukId(null);
      setParagrafen([]);
    }
  };

  if (selectedParagraafId) {
    return (
      <DigibordViewer
        chapterId={selectedParagraafId}
        title={getDigibordItemLabel('paragraaf', selectedParagraaf)}
        onExit={() => setSelectedParagraafId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-8 py-6">
          <h1 className="mb-2 flex items-center gap-3 text-4xl font-black text-slate-900">
            <Clapperboard size={38} className="text-violet-600" />
            Digibord
          </h1>
          <p className="text-slate-600">Kies een lesfase om fullscreen te presenteren</p>

          {breadcrumbs.length > 0 && (
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={resetToHome}
                className="whitespace-nowrap rounded px-3 py-1 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Home
              </button>
              {breadcrumbs.map((crumb, index) => (
                <div key={`${crumb.type}-${crumb.id}`} className="flex items-center gap-2">
                  <ChevronRight size={16} className="flex-shrink-0 text-slate-400" />
                  <button
                    onClick={() => handleBreadcrumbClick(index)}
                    className="whitespace-nowrap rounded px-3 py-1 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    {crumb.label}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-8">
        {!loading && (
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Selectie</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">{contextTitle}</h2>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 inline-block rounded-full bg-slate-200 p-2 animate-pulse">
                <ChevronRight size={32} className="text-slate-600" />
              </div>
              <p className="text-slate-600">Content laden...</p>
            </div>
          </div>
        )}

        {!loading && !selectedVakId && (
          vakken.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm">
              <AlertCircle size={48} className="mx-auto mb-3 text-slate-400" />
              <p className="text-lg text-slate-600">Geen vakken beschikbaar in CMS</p>
              <p className="mt-2 text-sm text-slate-500">Voeg vakken toe via Admin Hub, CMS Platform.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {vakken.map((vak) => (
                <DigibordCard
                  key={vak.id}
                  type="vak"
                  item={vak}
                  childCount={vak.leerjarenCount || 0}
                  onClick={() => selectVak(vak.id)}
                />
              ))}
            </div>
          )
        )}

        {!loading && selectedVakId && !selectedLeerjaarId && (
          leerjaren.length === 0 ? (
            <EmptyState message="Geen leerjaren beschikbaar" />
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {leerjaren.map((leerjaar) => (
                <DigibordCard
                  key={leerjaar.id}
                  type="leerjaar"
                  item={leerjaar}
                  childCount={niveaus.filter((niveau) => niveau.leerjaarId === leerjaar.id).length || leerjaar.niveausCount || 0}
                  onClick={() => selectLeerjaar(leerjaar.id)}
                />
              ))}
            </div>
          )
        )}

        {!loading && selectedLeerjaarId && !selectedNiveauId && (
          niveaus.length === 0 ? (
            <EmptyState message="Geen niveaus beschikbaar" />
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {niveaus.map((niveau) => (
                <DigibordCard
                  key={niveau.id}
                  type="niveau"
                  item={niveau}
                  childCount={hoofdstukken.filter((hoofdstuk) => hoofdstuk.niveauId === niveau.id).length || niveau.hoofdstukkenCount || 0}
                  onClick={() => selectNiveau(niveau.id)}
                />
              ))}
            </div>
          )
        )}

        {!loading && selectedNiveauId && !selectedHoofdstukId && (
          hoofdstukken.length === 0 ? (
            <EmptyState message="Geen hoofdstukken beschikbaar" />
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {hoofdstukken.map((hoofdstuk) => (
                <DigibordCard
                  key={hoofdstuk.id}
                  type="hoofdstuk"
                  item={hoofdstuk}
                  childCount={paragrafen.filter((paragraaf) => paragraaf.hoofdstukId === hoofdstuk.id).length || hoofdstuk.paragrafenCount || 0}
                  onClick={() => selectHoofdstuk(hoofdstuk.id)}
                />
              ))}
            </div>
          )
        )}

        {!loading && selectedHoofdstukId && (
          paragrafen.length === 0 ? (
            <EmptyState message="Geen paragrafen beschikbaar" />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {paragrafen.map((paragraaf) => (
                <DigibordCard
                  key={paragraaf.id}
                  type="paragraaf"
                  item={paragraaf}
                  onClick={() => setSelectedParagraafId(paragraaf.id)}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

const EmptyState = ({ message }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm">
    <p className="text-lg text-slate-600">{message}</p>
  </div>
);
