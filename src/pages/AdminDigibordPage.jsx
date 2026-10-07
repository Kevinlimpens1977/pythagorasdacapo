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
import { HelixLaden } from '../components/merk/HelixLogo';
import { Kaart, PaginaKop } from '../components/leeromgeving';
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
      className="group lo-kaart relative w-full cursor-pointer overflow-hidden border-0 text-left focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[color:var(--lo-blauw)]"
    >
      <div className="flex min-h-[9rem] flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[var(--lo-hoek-m)]"
              style={{ backgroundColor: style.bg, color: style.text }}
            >
              <Icon size={22} aria-hidden="true" />
            </div>
            <span className="lo-eyebrow">
              {meta.eyebrow}
            </span>
          </div>
          <h3 className="mt-4 text-xl font-extrabold leading-tight text-[var(--lo-inkt)]">{label}</h3>
          <p className="mt-2 text-sm font-medium text-[var(--lo-grijs)]">{meta.subtitle}</p>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-[13px] font-extrabold text-[var(--lo-blauw-inkt)]">{meta.action}</span>
          <ChevronRight size={18} aria-hidden="true" className="text-[var(--lo-lijn)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--lo-blauw)]" />
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
    <div className="beheer-stijl helix-page lo-tekst min-h-screen w-full">
      <div className="helix-container flex flex-col gap-6 py-10 md:py-12">
        <PaginaKop
          titel="Digibord"
          uitleg="Kies een lesfase om fullscreen te presenteren"
        />

        {breadcrumbs.length > 0 && (
          <div className="lo-knoppenbalk">
            <button
              onClick={resetToHome}
              className="lo-knop-start"
            >
              Home
            </button>
            {breadcrumbs.map((crumb, index) => (
              <div key={`${crumb.type}-${crumb.id}`} className="flex items-center gap-2">
                <ChevronRight size={16} aria-hidden="true" className="flex-shrink-0 text-[var(--lo-grijs)]" />
                <button
                  onClick={() => handleBreadcrumbClick(index)}
                  className="lo-knop-start"
                >
                  {crumb.label}
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div>
            <p className="lo-eyebrow">Selectie</p>
            <h2 className="mt-1 text-2xl font-extrabold text-[var(--lo-inkt)]">{contextTitle}</h2>
          </div>
        )}

        {loading && (
          <HelixLaden tekst="Content laden..." className="min-h-0 py-10" />
        )}

        {!loading && !selectedVakId && (
          vakken.length === 0 ? (
            <Kaart as="div" className="items-center p-12 text-center">
              <AlertCircle size={48} aria-hidden="true" className="mx-auto text-[var(--lo-grijs)]" />
              <p className="m-0 text-lg text-[var(--lo-grijs)]">Geen vakken beschikbaar in CMS</p>
              <p className="m-0 text-sm text-[var(--lo-grijs)]">Voeg vakken toe via Admin Hub, CMS Platform.</p>
            </Kaart>
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
  <Kaart as="div" className="items-center p-12 text-center">
    <p className="m-0 text-lg text-[var(--lo-grijs)]">{message}</p>
  </Kaart>
);
