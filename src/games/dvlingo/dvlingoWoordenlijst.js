// Pure logica voor de woordenlijst van DVLingo. Spiegelt bewust de keuring uit
// het spel zelf (js/opslag.js: keurWoord en normaliseerWoorden), zodat de
// docent in het admin-paneel precies dezelfde afkeuringen ziet als het spel
// zou geven. Wijzigt daar iets, dan hoort dit bestand mee te veranderen.

export const DVLINGO_MIN_LENGTE = 3;
export const DVLINGO_MAX_LENGTE = 9;

// Letters, spaties en streepjes mogen; spaties en streepjes vallen weg
// (BACK-UP wordt BACKUP). Cijfers en leestekens worden afgekeurd.
const TOEGESTAAN = /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/;

const ACCENTLOOS = (tekst) => (
  String(tekst).normalize('NFD').replace(/[̀-ͯ]/g, '')
);

export const normaliseerWoord = (tekst) => {
  if (tekst === null || tekst === undefined) return '';
  return ACCENTLOOS(tekst).toUpperCase().replace(/[^A-Z]/g, '');
};

// -> { geldig, woord, reden }  met reden: '' | 'leeg' | 'tekens' | 'kort' | 'lang'
export const keurWoord = (ruw) => {
  const origineel = ruw === null || ruw === undefined ? '' : String(ruw).trim();
  if (!origineel) return { geldig: false, woord: '', reden: 'leeg' };
  if (!TOEGESTAAN.test(origineel)) {
    return { geldig: false, woord: normaliseerWoord(origineel), reden: 'tekens' };
  }

  const woord = normaliseerWoord(origineel);
  if (!woord) return { geldig: false, woord: '', reden: 'tekens' };
  if (woord.length < DVLINGO_MIN_LENGTE) return { geldig: false, woord, reden: 'kort' };
  if (woord.length > DVLINGO_MAX_LENGTE) return { geldig: false, woord, reden: 'lang' };
  return { geldig: true, woord, reden: '' };
};

export const beschrijfAfkeuring = (reden) => {
  if (reden === 'leeg') return 'lege regel';
  if (reden === 'tekens') return 'alleen letters, spaties en streepjes';
  if (reden === 'kort') return `korter dan ${DVLINGO_MIN_LENGTE} letters`;
  if (reden === 'lang') return `langer dan ${DVLINGO_MAX_LENGTE} letters`;
  return 'afgekeurd';
};

// Leest de tekst uit het admin-paneel. Eén woord per regel, met optioneel een
// uitleg achter een puntkomma: WACHTWOORD; Iets wat alleen jij weet.
export const leesWoordenTekst = (tekst) => {
  const regels = String(tekst || '').split(/\r?\n/);
  const woorden = [];
  const afgekeurd = [];
  const dubbel = [];
  const gezien = new Set();

  regels.forEach((regel) => {
    if (!regel.trim()) return;

    const scheiding = regel.indexOf(';');
    const ruwWoord = scheiding >= 0 ? regel.slice(0, scheiding) : regel;
    const uitleg = scheiding >= 0 ? regel.slice(scheiding + 1).trim() : '';

    const keuring = keurWoord(ruwWoord);
    if (!keuring.geldig) {
      afgekeurd.push({ invoer: regel.trim(), reden: keuring.reden });
      return;
    }
    if (gezien.has(keuring.woord)) {
      dubbel.push(keuring.woord);
      return;
    }

    gezien.add(keuring.woord);
    woorden.push({ woord: keuring.woord, uitleg });
  });

  return { woorden, afgekeurd, dubbel };
};

export const schrijfWoordenTekst = (woorden = []) => (
  (Array.isArray(woorden) ? woorden : [])
    .map((item) => (item?.uitleg ? `${item.woord}; ${item.uitleg}` : String(item?.woord || '')))
    .filter(Boolean)
    .join('\n')
);

// De vorm die het spel in localStorage verwacht (sleutel dvl.lijst.v1).
// Slikt bewust ook null en rommel: dit is de terugvalroute als de instellingen
// niet gelezen kunnen worden, en die mag nooit zelf omvallen.
export const bouwSpelLijst = (invoer) => {
  const lijst = invoer && typeof invoer === 'object' ? invoer : {};
  const woorden = Array.isArray(lijst.woorden) ? lijst.woorden : [];

  return {
    gebruikEigenLijst: lijst.gebruikEigenLijst === true,
    schud: lijst.schud === true,
    woorden: woorden
      .map((item) => ({
        woord: normaliseerWoord(item?.woord),
        uitleg: typeof item?.uitleg === 'string' ? item.uitleg.trim() : ''
      }))
      .filter((item) => item.woord.length >= DVLINGO_MIN_LENGTE && item.woord.length <= DVLINGO_MAX_LENGTE)
  };
};

// Een eigen lijst mag het spel alleen overnemen als er genoeg woorden in staan;
// anders valt het spel terug op de ingebouwde lijst digitale vaardigheden.
export const DVLINGO_MIN_EIGEN_WOORDEN = 9;

export const isBruikbareEigenLijst = (lijst) => {
  const schoon = bouwSpelLijst(lijst);
  return schoon.gebruikEigenLijst && schoon.woorden.length >= DVLINGO_MIN_EIGEN_WOORDEN;
};
