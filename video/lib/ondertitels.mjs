// Tijdlijn -> WebVTT. Eén of meer cues per regel, hooguit twee regels van
// 42 tekens per cue, met de spreker als voice-tag.
const MAX_TEKENS = 42;
const MAX_REGELS = 2;
const SPREKERS = { docent: 'Docent', sami: 'Sami' };

const twee = (n) => String(n).padStart(2, '0');

export function tijdcode(seconden) {
  const ms = Math.round(seconden * 1000);
  const uren = Math.floor(ms / 3600000);
  const minuten = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const rest = ms % 1000;
  return `${twee(uren)}:${twee(minuten)}:${twee(sec)}.${String(rest).padStart(3, '0')}`;
}

const ontsnap = (tekst) => tekst.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

// Bidi-isolaten: in de Arabische ondertitels staan formules en getal plus
// eenheid tussen LRI (U+2066) en PDI (U+2069), zodat "25 − 15 = 10" niet
// omdraait. Zo'n stuk is één woord, ook met spaties erin: een regelbreuk
// binnen het isolaat zou de formule kapotmaken. RLI en FSI openen net zo.
const ISOLAAT_OPEN = new Set(['\u2066', '\u2067', '\u2068']);
const ISOLAAT_DICHT = '\u2069';
const WITRUIMTE = /\s/;

// Splitst op witruimte, behalve binnen een isolaat. Zonder isolaten geeft dit
// precies hetzelfde als tekst.split(/\s+/).filter(Boolean).
function splitsWoorden(tekst) {
  const woorden = [];
  let woord = '';
  let diepte = 0;
  for (const teken of tekst) {
    if (ISOLAAT_OPEN.has(teken)) diepte += 1;
    else if (teken === ISOLAAT_DICHT && diepte > 0) diepte -= 1;
    if (diepte === 0 && WITRUIMTE.test(teken)) {
      if (woord) woorden.push(woord);
      woord = '';
    } else {
      woord += teken;
    }
  }
  if (woord) woorden.push(woord);
  return woorden;
}

// Vervangt binnen een gesloten isolaat elke witruimte door een harde spatie
// (U+00A0). breekTekst houdt het isolaat al op één regel; maar de browser breekt
// zelf nog af als de video smal is, en zou dan "25 − 15 = 10" over twee regels
// verdelen. Met harde spaties kan dat niet. Een isolaat zonder sluitteken en
// tekst zonder isolaten blijven precies zoals ze waren.
function maakIsolatenOnbreekbaar(tekst) {
  let uit = '';
  let isolaat = '';
  let diepte = 0;
  for (const teken of tekst) {
    if (ISOLAAT_OPEN.has(teken)) diepte += 1;
    if (diepte === 0) {
      uit += teken;
      continue;
    }
    isolaat += teken;
    if (teken === ISOLAAT_DICHT) {
      diepte -= 1;
      if (diepte === 0) {
        uit += isolaat.replace(/\s/g, ' ');
        isolaat = '';
      }
    }
  }
  return uit + isolaat;
}

export function breekTekst(tekst, max = MAX_TEKENS) {
  const regels = [];
  let huidig = '';
  for (const woord of splitsWoorden(tekst)) {
    const kandidaat = huidig ? `${huidig} ${woord}` : woord;
    if (kandidaat.length <= max || !huidig) {
      huidig = kandidaat;
    } else {
      regels.push(huidig);
      huidig = woord;
    }
  }
  if (huidig) regels.push(huidig);
  return regels;
}

// teksten: optioneel { [regelId]: tekst }, de vertaling per regel. Staat er
// voor een regel een tekst, dan komt die in de cue in plaats van regel.tekst.
// Tijden, splitsen en sprekers blijven gelijk aan de Nederlandse versie.
export function maakVtt(tijdlijn, { teksten } = {}) {
  const blokken = ['WEBVTT'];
  for (const scene of tijdlijn.scenes) {
    for (const regel of scene.regels) {
      const naam = SPREKERS[regel.spreker] || 'Docent';
      const vertaald = teksten?.[regel.id];
      const regels = breekTekst(typeof vertaald === 'string' && vertaald.trim() ? vertaald : regel.tekst)
        .map(maakIsolatenOnbreekbaar);
      const groepen = [];
      for (let i = 0; i < regels.length; i += MAX_REGELS) groepen.push(regels.slice(i, i + MAX_REGELS));
      const totaal = groepen.reduce((som, g) => som + g.join(' ').length, 0);
      let start = regel.start;
      groepen.forEach((groep, index) => {
        const aandeel = groep.join(' ').length / totaal;
        const eind = index === groepen.length - 1 ? regel.eind : start + regel.duur * aandeel;
        blokken.push(`${tijdcode(start)} --> ${tijdcode(eind)}\n<v ${naam}>${groep.map(ontsnap).join('\n')}`);
        start = eind;
      });
    }
  }
  return `${blokken.join('\n\n')}\n`;
}
