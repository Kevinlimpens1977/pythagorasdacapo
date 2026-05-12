/**
 * useCms Hook
 * Centralized state management for CMS navigation & data
 */

import { useState, useEffect, useCallback } from 'react';
import * as cmsService from '../services/cmsService';

export const useCms = () => {
  // ============ STATE ============

  // Selections
  const [selectedVakId, setSelectedVakId] = useState(null);
  const [selectedLeerjaarId, setSelectedLeerjaarId] = useState(null);
  const [selectedNiveauId, setSelectedNiveauId] = useState(null);
  const [selectedHoofdstukId, setSelectedHoofdstukId] = useState(null);
  const [selectedParagraafId, setSelectedParagraafId] = useState(null);
  const [selectedVraagId, setSelectedVraagId] = useState(null);

  // Data arrays
  const [vakken, setVakken] = useState([]);
  const [leerjaren, setLeerjaren] = useState([]);
  const [niveaus, setNiveaus] = useState([]);
  const [hoofdstukken, setHoofdstukken] = useState([]);
  const [paragrafen, setParagrafen] = useState([]);
  const [vragen, setVragen] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============ LOAD VAKKEN (on mount) ============
  useEffect(() => {
    loadVakken();
  }, []);

  const loadVakken = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cmsService.getVakken();
      setVakken(data);
      // Auto-select first vak
      if (data.length > 0) {
        setSelectedVakId(data[0].id);
      }
    } catch (err) {
      setError('Failed to load vakken: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============ LOAD LEERJAREN (when vak changes) ============
  useEffect(() => {
    if (selectedVakId) {
      loadLeerjaren(selectedVakId);
    } else {
      setLeerjaren([]);
      setSelectedLeerjaarId(null);
    }
  }, [selectedVakId]);

  const loadLeerjaren = useCallback(async (vakId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cmsService.getLeerjaren(vakId);
      setLeerjaren(data);
      // Auto-select first leerjaar
      if (data.length > 0) {
        setSelectedLeerjaarId(data[0].id);
      } else {
        setSelectedLeerjaarId(null);
      }
    } catch (err) {
      setError('Failed to load leerjaren: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============ LOAD NIVEAUS (when leerjaar changes) ============
  useEffect(() => {
    if (selectedLeerjaarId) {
      loadNiveaus(selectedLeerjaarId);
    } else {
      setNiveaus([]);
      setSelectedNiveauId(null);
    }
  }, [selectedLeerjaarId]);

  const loadNiveaus = useCallback(async (leerjaarId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cmsService.getNiveaus(leerjaarId);
      setNiveaus(data);
      // Auto-select first niveau
      if (data.length > 0) {
        setSelectedNiveauId(data[0].id);
      } else {
        setSelectedNiveauId(null);
      }
    } catch (err) {
      setError('Failed to load niveaus: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============ LOAD HOOFDSTUKKEN (when niveau changes) ============
  useEffect(() => {
    if (selectedNiveauId) {
      loadHoofdstukken(selectedNiveauId);
    } else {
      setHoofdstukken([]);
      setSelectedHoofdstukId(null);
    }
  }, [selectedNiveauId]);

  const loadHoofdstukken = useCallback(async (niveauId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cmsService.getHoofdstukken(niveauId);
      setHoofdstukken(data);
      // Auto-select first hoofdstuk
      if (data.length > 0) {
        setSelectedHoofdstukId(data[0].id);
      } else {
        setSelectedHoofdstukId(null);
      }
    } catch (err) {
      setError('Failed to load hoofdstukken: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============ LOAD PARAGRAFEN (when hoofdstuk changes) ============
  useEffect(() => {
    if (selectedHoofdstukId) {
      loadParagrafen(selectedHoofdstukId);
    } else {
      setParagrafen([]);
      setSelectedParagraafId(null);
    }
  }, [selectedHoofdstukId]);

  const loadParagrafen = useCallback(async (hoofdstukId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cmsService.getParagrafen(hoofdstukId);
      setParagrafen(data);
      // Auto-select first paragraaf
      if (data.length > 0) {
        setSelectedParagraafId(data[0].id);
      } else {
        setSelectedParagraafId(null);
      }
    } catch (err) {
      setError('Failed to load paragrafen: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============ LOAD ALL VRAGEN FOR ENTIRE HOOFDSTUK (for tree rendering) ============
  useEffect(() => {
    if (selectedHoofdstukId && paragrafen.length > 0) {
      loadAllVragenForHoofdstuk(paragrafen);
    }
  }, [selectedHoofdstukId, paragrafen]);

  const loadAllVragenForHoofdstuk = useCallback(async (paragraafList) => {
    try {
      // Load vragen for all paragrafen in this hoofdstuk
      const allVragen = [];
      for (const paragraaf of paragraafList) {
        const data = await cmsService.getVragen(paragraaf.id);
        allVragen.push(...data);
      }
      setVragen(allVragen);
    } catch (err) {
      console.error('Failed to load all vragen for hoofdstuk:', err);
    }
  }, []);

  // ============ LOAD VRAGEN (when paragraaf changes) ============
  useEffect(() => {
    if (selectedParagraafId) {
      loadVragen(selectedParagraafId);
    } else {
      setVragen([]);
      setSelectedVraagId(null);
    }
  }, [selectedParagraafId]);

  const loadVragen = useCallback(async (paragraafId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cmsService.getVragen(paragraafId);
      setVragen(data);
      // DON'T auto-select first vraag - show paragraaf overview instead
      // User can click on a specific vraag in the tree if needed
      setSelectedVraagId(null);
    } catch (err) {
      setError('Failed to load vragen: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============ MANUAL SELECTORS ============
  const setVak = useCallback((vakId) => {
    setSelectedVakId(vakId);
  }, []);

  const setLeerjaar = useCallback((leerjaarId) => {
    setSelectedLeerjaarId(leerjaarId);
  }, []);

  const setNiveau = useCallback((niveauId) => {
    setSelectedNiveauId(niveauId);
  }, []);

  const setHoofdstuk = useCallback((hoofdstukId) => {
    setSelectedHoofdstukId(hoofdstukId);
  }, []);

  const setParagraaf = useCallback((paragraafId) => {
    setSelectedParagraafId(paragraafId);
  }, []);

  const setVraag = useCallback((vraagId) => {
    setSelectedVraagId(vraagId);
  }, []);

  // ============ BREADCRUMB DATA ============
  const breadcrumb = {
    vak: vakken.find(v => v.id === selectedVakId),
    leerjaar: leerjaren.find(l => l.id === selectedLeerjaarId),
    niveau: niveaus.find(n => n.id === selectedNiveauId),
    hoofdstuk: hoofdstukken.find(h => h.id === selectedHoofdstukId),
    paragraaf: paragrafen.find(p => p.id === selectedParagraafId),
    vraag: vragen.find(v => v.id === selectedVraagId)
  };

  // ============ RETURN ============
  return {
    // Selections (IDs)
    selectedVakId,
    selectedLeerjaarId,
    selectedNiveauId,
    selectedHoofdstukId,
    selectedParagraafId,
    selectedVraagId,

    // Setters
    setVak,
    setLeerjaar,
    setNiveau,
    setHoofdstuk,
    setParagraaf,
    setVraag,

    // Data arrays
    vakken,
    leerjaren,
    niveaus,
    hoofdstukken,
    paragrafen,
    vragen,

    // Current selections (objects)
    currentVak: breadcrumb.vak,
    currentLeerjaar: breadcrumb.leerjaar,
    currentNiveau: breadcrumb.niveau,
    currentHoofdstuk: breadcrumb.hoofdstuk,
    currentParagraaf: breadcrumb.paragraaf,
    currentVraag: breadcrumb.vraag,

    // Breadcrumb helper
    breadcrumb,

    // UI state
    loading,
    error,

    // Refetch
    loadVakken,
    loadLeerjaren,
    loadNiveaus,
    loadHoofdstukken,
    loadParagrafen,
    loadVragen
  };
};

export default useCms;
