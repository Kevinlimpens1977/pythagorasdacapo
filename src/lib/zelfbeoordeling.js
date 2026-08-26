/**
 * Zelfbeoordeling bij oefenopgaven: de leerling levert eerst zelf in, ziet
 * daarna pas de uitwerking, en geeft zichzelf een oordeel. Dit bestand is het
 * contract tussen de leerlingflow en het docentoverzicht: wat er wordt
 * opgeslagen en welke signalen daar "controleer even"-vlaggen uit rekenen.
 *
 * Ontwerpprincipe: tokens en voortgang belonen het AFRONDEN van de drie fasen
 * (proberen, vergelijken, beoordelen), nooit het oordeel zelf. Wie eerlijk
 * "nog niet" kiest mag daar niets voor mislopen, anders leert iedereen binnen
 * een week dat "goed" klikken loont en is de data waardeloos.
 */

export const ZELFOORDELEN = {
  goed: { label: 'Goed', kleur: '#166534', achtergrond: '#dcfce7' },
  bijna: { label: 'Bijna', kleur: '#b45309', achtergrond: '#fef3c7' },
  nog_niet: { label: 'Nog niet', kleur: '#b91c1c', achtergrond: '#fee2e2' }
};

export const isGeldigZelfoordeel = (waarde) =>
  Object.prototype.hasOwnProperty.call(ZELFOORDELEN, waarde);

/** Onder deze denktijd is een serieuze poging op een open vraag onwaarschijnlijk. */
export const MIN_SERIEUZE_DENKTIJD_MS = 10_000;

/** Korter dan dit is geen antwoord maar een toetsaanslag. */
export const MIN_ANTWOORD_TEKENS = 5;

export const magInleveren = (antwoord = '') =>
  String(antwoord).trim().length >= MIN_ANTWOORD_TEKENS;

/**
 * Het record dat per opgave bij de voortgang wordt opgeslagen.
 * Tijden komen uit de flow zelf (gestart = veld in beeld, ingeleverd = klik).
 */
export const buildZelfbeoordelingRecord = ({
  fieldId = '',
  antwoord = '',
  zelfoordeel = '',
  aiCorrect = null,
  aiFeedback = '',
  gestartOpMs = 0,
  ingeleverdOpMs = 0,
  beoordeeldOpMs = 0
} = {}) => {
  if (!isGeldigZelfoordeel(zelfoordeel)) {
    throw new Error(`Ongeldig zelfoordeel: "${zelfoordeel}"`);
  }
  const denktijdMs = Math.max(0, (ingeleverdOpMs || 0) - (gestartOpMs || 0));
  return {
    fieldId,
    antwoord: String(antwoord).trim(),
    antwoordLengte: String(antwoord).trim().length,
    zelfoordeel,
    aiCorrect: typeof aiCorrect === 'boolean' ? aiCorrect : null,
    aiFeedback: String(aiFeedback || ''),
    gestartOpMs,
    ingeleverdOpMs,
    beoordeeldOpMs,
    denktijdMs
  };
};

/**
 * Serieus-signalen over een lijst records van een leerling binnen een
 * paragraaf. Elke vlag draagt zijn reden, zodat de docent niet hoeft te raden
 * waarom er een uitroepteken staat.
 */
export const berekenSerieusSignalen = (records = []) => {
  const bruikbaar = (Array.isArray(records) ? records : []).filter(
    (r) => r && isGeldigZelfoordeel(r.zelfoordeel)
  );
  if (!bruikbaar.length) {
    return { serieus: true, vlaggen: [] };
  }

  const vlaggen = [];

  const teSnel = bruikbaar.filter((r) => (r.denktijdMs || 0) < MIN_SERIEUZE_DENKTIJD_MS);
  if (teSnel.length >= 2 || (bruikbaar.length === 1 && teSnel.length === 1)) {
    vlaggen.push({
      code: 'te_snel',
      reden: `${teSnel.length} ${teSnel.length === 1 ? 'antwoord' : 'antwoorden'} binnen ${MIN_SERIEUZE_DENKTIJD_MS / 1000} seconden ingeleverd`
    });
  }

  // Zegt "goed" terwijl de Digidocent het antwoord afkeurde: dat is precies
  // het patroon van doorklikken. Een keer kan een meningsverschil zijn; vanaf
  // een keer is het al het bekijken waard, dus de drempel ligt op 1.
  const afwijkend = bruikbaar.filter((r) => r.zelfoordeel === 'goed' && r.aiCorrect === false);
  if (afwijkend.length >= 1) {
    vlaggen.push({
      code: 'oordeel_wijkt_af',
      reden: `${afwijkend.length} keer "goed" gekozen waar de Digidocent het antwoord afkeurde`
    });
  }

  const kaal = bruikbaar.filter((r) => (r.antwoordLengte || 0) < MIN_ANTWOORD_TEKENS * 2);
  if (kaal.length > bruikbaar.length / 2) {
    vlaggen.push({
      code: 'korte_antwoorden',
      reden: 'meer dan de helft van de antwoorden is opvallend kort'
    });
  }

  return { serieus: vlaggen.length === 0, vlaggen };
};
