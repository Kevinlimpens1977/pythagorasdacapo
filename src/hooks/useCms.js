/**
 * useCms Hook
 * Centralized state management for CMS navigation & data
 */

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import * as cmsService from '../services/cmsService';

export const useCms = (includeArchived = false) => {
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
  const [contentBlocks, setContentBlocks] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearBelowVak = useCallback(() => {
    setLeerjaren([]);
    setNiveaus([]);
    setHoofdstukken([]);
    setParagrafen([]);
    setVragen([]);
    setContentBlocks([]);
    setSelectedLeerjaarId(null);
    setSelectedNiveauId(null);
    setSelectedHoofdstukId(null);
    setSelectedParagraafId(null);
    setSelectedVraagId(null);
  }, []);

  const clearBelowLeerjaar = useCallback(() => {
    setNiveaus([]);
    setHoofdstukken([]);
    setParagrafen([]);
    setVragen([]);
    setContentBlocks([]);
    setSelectedNiveauId(null);
    setSelectedHoofdstukId(null);
    setSelectedParagraafId(null);
    setSelectedVraagId(null);
  }, []);

  const clearBelowNiveau = useCallback(() => {
    setHoofdstukken([]);
    setParagrafen([]);
    setVragen([]);
    setContentBlocks([]);
    setSelectedHoofdstukId(null);
    setSelectedParagraafId(null);
    setSelectedVraagId(null);
  }, []);

  const clearBelowHoofdstuk = useCallback(() => {
    setParagrafen([]);
    setVragen([]);
    setContentBlocks([]);
    setSelectedParagraafId(null);
    setSelectedVraagId(null);
  }, []);

  const clearBelowParagraaf = useCallback(() => {
    setVragen([]);
    setContentBlocks([]);
    setSelectedVraagId(null);
  }, []);

  const loadVakken = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cmsService.getVakken(includeArchived);
      setVakken(data);
      if (data.length > 0) {
        setSelectedVakId((current) => current && data.some((item) => item.id === current) ? current : data[0].id);
      } else {
        setSelectedVakId(null);
        clearBelowVak();
      }
    } catch (err) {
      setError('Failed to load vakken: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [clearBelowVak, includeArchived]);

  const loadLeerjaren = useCallback(async (vakId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cmsService.getLeerjaren(vakId, includeArchived);
      setLeerjaren(data);
      if (data.length > 0) {
        setSelectedLeerjaarId((current) => current && data.some((item) => item.id === current) ? current : data[0].id);
      } else {
        clearBelowLeerjaar();
      }
    } catch (err) {
      setError('Failed to load leerjaren: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [clearBelowLeerjaar, includeArchived]);

  const loadNiveaus = useCallback(async (leerjaarId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cmsService.getNiveaus(leerjaarId, includeArchived);
      setNiveaus(data);
      if (data.length > 0) {
        setSelectedNiveauId((current) => current && data.some((item) => item.id === current) ? current : data[0].id);
      } else {
        clearBelowNiveau();
      }
    } catch (err) {
      setError('Failed to load niveaus: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [clearBelowNiveau, includeArchived]);

  const loadHoofdstukken = useCallback(async (niveauId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cmsService.getHoofdstukken(niveauId, includeArchived);
      setHoofdstukken(data);
      if (data.length > 0) {
        setSelectedHoofdstukId((current) => current && data.some((item) => item.id === current) ? current : data[0].id);
      } else {
        clearBelowHoofdstuk();
      }
    } catch (err) {
      setError('Failed to load hoofdstukken: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [clearBelowHoofdstuk, includeArchived]);

  const loadParagrafen = useCallback(async (hoofdstukId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cmsService.getParagrafen(hoofdstukId, includeArchived);
      setParagrafen(data);
      if (data.length > 0) {
        setSelectedParagraafId((current) => current && data.some((item) => item.id === current) ? current : data[0].id);
      } else {
        clearBelowParagraaf();
      }
    } catch (err) {
      setError('Failed to load paragrafen: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [clearBelowParagraaf, includeArchived]);

  const loadAllVragenForHoofdstuk = useCallback(async (paragraafList) => {
    try {
      const allVragen = [];
      for (const paragraaf of paragraafList) {
        const data = await cmsService.getVragen(paragraaf.id, includeArchived);
        allVragen.push(...data);
      }
      setVragen(allVragen);
    } catch (err) {
      console.error('Failed to load all vragen for hoofdstuk:', err);
    }
  }, [includeArchived]);

  const loadVragen = useCallback(async (paragraafId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cmsService.getVragen(paragraafId, includeArchived);
      setVragen(data);
      setSelectedVraagId(null);
    } catch (err) {
      setError('Failed to load vragen: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [includeArchived]);

  const loadContentBlocks = useCallback(async (paragraafId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cmsService.getContentBlocks(paragraafId, true, includeArchived);
      setContentBlocks(data);
    } catch (err) {
      setError('Failed to load content blocks: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [includeArchived]);

  useEffect(() => {
    loadVakken();
  }, [loadVakken]);

  useEffect(() => {
    if (selectedVakId) loadLeerjaren(selectedVakId);
  }, [loadLeerjaren, selectedVakId]);

  useEffect(() => {
    if (selectedLeerjaarId) loadNiveaus(selectedLeerjaarId);
  }, [loadNiveaus, selectedLeerjaarId]);

  useEffect(() => {
    if (selectedNiveauId) loadHoofdstukken(selectedNiveauId);
  }, [loadHoofdstukken, selectedNiveauId]);

  useEffect(() => {
    if (selectedHoofdstukId) loadParagrafen(selectedHoofdstukId);
  }, [loadParagrafen, selectedHoofdstukId]);

  useEffect(() => {
    if (selectedHoofdstukId && paragrafen.length > 0) {
      loadAllVragenForHoofdstuk(paragrafen);
    }
  }, [loadAllVragenForHoofdstuk, paragrafen, selectedHoofdstukId]);

  useEffect(() => {
    if (selectedParagraafId) {
      loadVragen(selectedParagraafId);
      loadContentBlocks(selectedParagraafId);
    }
  }, [loadContentBlocks, loadVragen, selectedParagraafId]);

  const setVak = useCallback((vakId) => {
    setSelectedVakId(vakId);
    clearBelowVak();
  }, [clearBelowVak]);

  const setLeerjaar = useCallback((leerjaarId) => {
    setSelectedLeerjaarId(leerjaarId);
    clearBelowLeerjaar();
  }, [clearBelowLeerjaar]);

  const setNiveau = useCallback((niveauId) => {
    setSelectedNiveauId(niveauId);
    clearBelowNiveau();
  }, [clearBelowNiveau]);

  const setHoofdstuk = useCallback((hoofdstukId) => {
    setSelectedHoofdstukId(hoofdstukId);
    clearBelowHoofdstuk();
  }, [clearBelowHoofdstuk]);

  const setParagraaf = useCallback((paragraafId) => {
    setSelectedParagraafId(paragraafId);
    clearBelowParagraaf();
  }, [clearBelowParagraaf]);

  const setVraag = useCallback((vraagId) => {
    setSelectedVraagId(vraagId);
  }, []);

  const breadcrumb = {
    vak: vakken.find(v => v.id === selectedVakId),
    leerjaar: leerjaren.find(l => l.id === selectedLeerjaarId),
    niveau: niveaus.find(n => n.id === selectedNiveauId),
    hoofdstuk: hoofdstukken.find(h => h.id === selectedHoofdstukId),
    paragraaf: paragrafen.find(p => p.id === selectedParagraafId),
    vraag: vragen.find(v => v.id === selectedVraagId)
  };

  return {
    selectedVakId,
    selectedLeerjaarId,
    selectedNiveauId,
    selectedHoofdstukId,
    selectedParagraafId,
    selectedVraagId,
    setVak,
    setLeerjaar,
    setNiveau,
    setHoofdstuk,
    setParagraaf,
    setVraag,
    vakken,
    leerjaren,
    niveaus,
    hoofdstukken,
    paragrafen,
    vragen,
    contentBlocks,
    currentVak: breadcrumb.vak,
    currentLeerjaar: breadcrumb.leerjaar,
    currentNiveau: breadcrumb.niveau,
    currentHoofdstuk: breadcrumb.hoofdstuk,
    currentParagraaf: breadcrumb.paragraaf,
    currentVraag: breadcrumb.vraag,
    breadcrumb,
    loading,
    error,
    loadVakken,
    loadLeerjaren,
    loadNiveaus,
    loadHoofdstukken,
    loadParagrafen,
    loadVragen,
    loadContentBlocks
  };
};

export default useCms;
