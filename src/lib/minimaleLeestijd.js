/**
 * Minimale tijd voordat de leerling een leesstap mag afvinken.
 *
 * Bij "Uitwerkingen en antwoorden" vinkte een leerling anders binnen een
 * seconde af, zonder dat hij zijn werk had nagekeken. Een lesblok kan daarom in
 * `content.minimaleTijdSeconden` zeggen hoe lang de afvinkknop uit blijft, en in
 * `content.bevestigLabel` wat er op de knop staat ("Ik heb mijn werk nagekeken").
 *
 * De klok start op het eerste moment dat de leerling het blok in deze sessie
 * opent. Die starttijd staat in sessionStorage, per gebruiker en per blok, zodat
 * verversen de klok niet terugzet. Het is een duwtje, geen beveiliging: wie
 * een nieuw tabblad opent, begint opnieuw te tellen.
 */

const schoon = (waarde) => String(waarde ?? '').trim();

/** De minimale tijd van een blok in hele seconden; 0 als er geen is. */
export const getMinimaleTijdSeconden = (block = null) => {
  const waarde = Number(block?.content?.minimaleTijdSeconden);
  return Number.isFinite(waarde) && waarde > 0 ? Math.round(waarde) : 0;
};

/** De tekst op de afvinkknop: het eigen label van het blok, anders de standaard. */
export const getBevestigLabel = (block = null, standaard = '') =>
  schoon(block?.content?.bevestigLabel) || standaard;

/** Hoeveel hele seconden moet de leerling nog wachten? Nooit minder dan 0. */
export const resterendeSeconden = ({ minimaleTijdSeconden = 0, startMs = 0, nuMs = 0 } = {}) => {
  const minimum = Math.max(0, Number(minimaleTijdSeconden) || 0);
  if (!minimum) return 0;
  const start = Number(startMs) || 0;
  const nu = Number(nuMs) || 0;
  if (!start || !nu) return minimum;
  const verstreken = Math.max(0, (nu - start) / 1000);
  return Math.max(0, Math.ceil(minimum - verstreken));
};

/** 42 wordt "0:42", 125 wordt "2:05". */
export const formatAftelling = (seconden = 0) => {
  const totaal = Math.max(0, Math.ceil(Number(seconden) || 0));
  const minuten = Math.floor(totaal / 60);
  const rest = totaal % 60;
  return `${minuten}:${String(rest).padStart(2, '0')}`;
};

export const aftelTekst = (seconden = 0) =>
  `Nakijken kost tijd. Over ${formatAftelling(seconden)} kun je afvinken.`;

export const starttijdSleutel = (userId = '', blockId = '') =>
  `helix.leestijdStart.${schoon(userId) || 'anoniem'}.${schoon(blockId)}`;

/**
 * Leest de starttijd van dit blok uit de opslag, of zet hem nu. Een opslag die
 * ontbreekt of weigert (privévenster, geblokkeerde site-data) is geen fout: dan
 * telt de klok vanaf nu. Een starttijd in de toekomst (klok verzet) telt niet.
 */
export const leesOfZetStarttijd = (opslag = null, sleutel = '', nuMs = 0) => {
  if (!sleutel) return nuMs;
  try {
    const bestaand = Number(opslag?.getItem?.(sleutel));
    if (Number.isFinite(bestaand) && bestaand > 0 && bestaand <= nuMs) return bestaand;
    opslag?.setItem?.(sleutel, String(nuMs));
  } catch {
    // sessionStorage is een gemak; zonder telt de klok vanaf nu.
  }
  return nuMs;
};
