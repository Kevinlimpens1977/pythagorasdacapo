// Pure logica voor de koppeling met KlimBit. Geen React, geen DOM, geen Firebase.
//
// Het berichtcontract (spel -> platform), zie public/games/klimbit/v1/:
//   { bron: 'klimbit', soort: 'gereed', op }
//   { bron: 'klimbit', soort: 'gestart', details: { pogingNr }, op }
//   { bron: 'klimbit', soort: 'klaar', punten, details: { piekHoogte, duurMs, pogingNr }, op }
// `op` is een tijdstip in milliseconden. Een speler kan in één bezoek meerdere
// pogingen doen; elke poging heeft een eigen pogingNr.

export const KLIMBIT_BRON = 'klimbit';
const SOORTEN = new Set(['gereed', 'gestart', 'klaar']);

const eindigGetal = (waarde) => {
  const getal = Number(waarde);
  return typeof waarde === 'number' && Number.isFinite(getal) ? getal : null;
};

/**
 * Leest een bericht uit het spel en geeft alleen de velden terug die we
 * gebruiken. Een onbekend of rommelig bericht levert null op.
 */
export const leesKlimbitBericht = (data) => {
  if (!data || typeof data !== 'object' || data.bron !== KLIMBIT_BRON) return null;
  const soort = String(data.soort || '').trim();
  if (!SOORTEN.has(soort)) return null;

  const details = data.details && typeof data.details === 'object' ? data.details : {};
  const pogingNr = Number.isInteger(details.pogingNr) && details.pogingNr > 0 ? details.pogingNr : null;
  const op = eindigGetal(data.op);
  const bericht = { soort, pogingNr, op };

  if (soort !== 'klaar') return bericht;

  // De piekhoogte uit de details is het preciest; punten (de afgeronde
  // piekhoogte) is de terugvaloptie.
  const piek = eindigGetal(details.piekHoogte) ?? eindigGetal(data.punten);
  if (piek === null || piek < 0) return null;
  return {
    ...bericht,
    piekHoogte: piek,
    duurMs: Math.max(0, eindigGetal(details.duurMs) ?? 0)
  };
};

/** Tekst bij de erkende hoogte als de server minder telde dan het spel meldde. */
export const afgekaptTekst = ({ hoogte = 0, ingestuurdeHoogte = 0 } = {}) => {
  const gemeld = Math.floor(Number(ingestuurdeHoogte) || 0);
  if (gemeld <= hoogte) return '';
  return `Het spel meldde ${gemeld} m, maar zo snel kan niemand klimmen. HELIX telt ${hoogte} m.`;
};
