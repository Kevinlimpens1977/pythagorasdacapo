// Het oefenblad aan het eind van elk volumespel (Kevin, 24 sep 2026): drie
// omrekeningen en vijf verhaalsommen, met elke keer andere getallen. Na het
// nakijken ziet de leerling bij elke som de uitwerking.

import { AANTAL_OEFENVRAGEN, formatGetal, leesGetal, rondAf } from './volumeLogic.js';

export { AANTAL_OEFENVRAGEN };

const maakRekenaar = (rng) => ({
  heel: (min, max) => min + Math.floor(rng() * (max - min + 1)),
  kies: (lijst) => lijst[Math.floor(rng() * lijst.length)]
});

const f = (getal) => formatGetal(rondAf(getal, 4));

// Een som: { vraag, eenheid, antwoord, uitwerking }.
const som = (vraag, eenheid, antwoord, uitwerking) => ({ vraag, eenheid, antwoord: rondAf(antwoord, 4), uitwerking });

// ---------- omrekeningen ----------

const gNaarKg = ({ heel }) => {
  const g = heel(2, 45) * 50;
  return som(`${f(g)} g = ... kg`, 'kg', g / 1000, `1 kg = 1000 g, dus ${f(g)} : 1000 = ${f(g / 1000)} kg.`);
};
const kgNaarG = ({ heel }) => {
  const kg = heel(3, 48) / 4;
  return som(`${f(kg)} kg = ... g`, 'g', kg * 1000, `1 kg = 1000 g, dus ${f(kg)} × 1000 = ${f(kg * 1000)} g.`);
};
const mlNaarL = ({ heel }) => {
  const ml = heel(1, 38) * 50;
  return som(`${f(ml)} ml = ... l`, 'l', ml / 1000, `1 l = 1000 ml, dus ${f(ml)} : 1000 = ${f(ml / 1000)} l.`);
};
const lNaarMl = ({ heel }) => {
  const l = heel(1, 16) / 4;
  return som(`${f(l)} l = ... ml`, 'ml', l * 1000, `1 l = 1000 ml, dus ${f(l)} × 1000 = ${f(l * 1000)} ml.`);
};
const cm3NaarMl = ({ heel }) => {
  const cm3 = heel(12, 480);
  return som(`${f(cm3)} cm³ = ... ml`, 'ml', cm3, `1 cm³ = 1 ml, dus ${f(cm3)} cm³ = ${f(cm3)} ml.`);
};
const cm3NaarL = ({ heel }) => {
  const cm3 = heel(1, 12) * 250;
  return som(`${f(cm3)} cm³ = ... l`, 'l', cm3 / 1000, `1000 cm³ = 1 l, dus ${f(cm3)} : 1000 = ${f(cm3 / 1000)} l.`);
};

// ---------- verhaalsommen ----------

// Kevins voorbeeld: vier blokjes van 100 g en één blokje van 2× die vier samen.
const blokjesMassa = ({ heel, kies }) => {
  const aantal = heel(3, 5);
  const gram = kies([50, 100, 150, 200]);
  const keer = kies([2, 3]);
  const samen = aantal * gram;
  const groot = keer * samen;
  return som(
    `Je hebt ${aantal} blokjes van ${gram} gram en 1 blokje dat ${keer}× zo zwaar is als die ${aantal} blokjes bij elkaar. Hoeveel kg aan blokjes heb je?`,
    'kg',
    (samen + groot) / 1000,
    `${aantal} × ${gram} = ${samen} g. Het grote blokje: ${keer} × ${samen} = ${groot} g. Samen ${samen + groot} g = ${f((samen + groot) / 1000)} kg.`
  );
};
const zakAppels = ({ heel }) => {
  const appels = heel(5, 9);
  const gram = heel(3, 5) * 40;
  const totaal = appels * gram;
  return som(
    `Een appel weegt ${gram} g. Je koopt ${appels} appels. Hoeveel kg weegt je zak appels?`,
    'kg',
    totaal / 1000,
    `${appels} × ${gram} = ${totaal} g = ${f(totaal / 1000)} kg.`
  );
};
const flesVerdelen = ({ heel, kies }) => {
  const liter = kies([1, 1.5, 2]);
  const glazen = heel(4, 8);
  const ml = liter * 1000;
  const per = rondAf(ml / glazen, 1);
  const juist = Number.isInteger(ml / glazen) ? ml / glazen : null;
  const glas = juist ?? 250;
  const aantal = juist ? glazen : Math.floor(ml / 250);
  return juist
    ? som(`Je verdeelt een fles van ${f(liter)} l limonade eerlijk over ${glazen} glazen. Hoeveel ml komt er in elk glas?`, 'ml', per,
      `${f(liter)} l = ${ml} ml. ${ml} : ${glazen} = ${f(per)} ml per glas.`)
    : som(`Een glas bevat ${glas} ml. Hoeveel volle glazen schenk je uit een fles van ${f(liter)} l?`, 'glazen', aantal,
      `${f(liter)} l = ${ml} ml. ${ml} : ${glas} = ${f(ml / glas)}, dus ${aantal} volle glazen.`);
};
const maatcilinderBijschenken = ({ heel }) => {
  const begin = heel(12, 40);
  const erbij = heel(5, 30);
  return som(
    `In een maatcilinder staat ${begin} ml water. Je schenkt er ${erbij} ml bij. Hoeveel ml staat er nu in?`,
    'ml',
    begin + erbij,
    `${begin} + ${erbij} = ${begin + erbij} ml.`
  );
};
const schaalStreepje = ({ kies }) => {
  const [van, tot, stappen] = kies([[10, 20, 10], [20, 30, 5], [50, 100, 10], [0, 1, 5], [100, 200, 20]]);
  const per = (tot - van) / stappen;
  return som(
    `Op een maatcilinder staat ${van} ml en ${tot} ml. Daartussen zitten ${stappen} stappen. Hoeveel ml is één streepje?`,
    'ml',
    per,
    `(${tot} - ${van}) : ${stappen} = ${f(per)} ml per streepje.`
  );
};
const doosVolume = ({ heel }) => {
  const l = heel(10, 30);
  const b = heel(5, 20);
  const h = heel(4, 15);
  return som(
    `Een schoenendoos is ${l} cm lang, ${b} cm breed en ${h} cm hoog. Wat is het volume in cm³?`,
    'cm³',
    l * b * h,
    `V = l × b × h = ${l} × ${b} × ${h} = ${l * b * h} cm³.`
  );
};
const aquariumLiter = ({ heel }) => {
  const l = heel(4, 8) * 10;
  const b = heel(2, 4) * 10;
  const h = heel(3, 5) * 10;
  const v = l * b * h;
  return som(
    `Een aquarium is ${l} cm lang, ${b} cm breed en ${h} cm hoog. Hoeveel liter water past erin?`,
    'l',
    v / 1000,
    `V = ${l} × ${b} × ${h} = ${v} cm³. 1000 cm³ = 1 l, dus ${f(v / 1000)} l.`
  );
};
const kubusjes = ({ heel }) => {
  const rib = heel(2, 5);
  const aantal = heel(3, 8);
  const een = rib ** 3;
  return som(
    `Een kubusje heeft ribben van ${rib} cm. Je stapelt er ${aantal} op elkaar. Hoeveel cm³ is dat samen?`,
    'cm³',
    een * aantal,
    `Eén kubusje: ${rib} × ${rib} × ${rib} = ${een} cm³. ${aantal} × ${een} = ${een * aantal} cm³.`
  );
};
const pakMelk = ({ heel }) => {
  const pakken = heel(3, 8);
  const ml = 1000;
  return som(
    `Een pak melk is 10 cm lang, 10 cm breed en 10 cm hoog. Hoeveel liter is ${pakken} pakken melk samen?`,
    'l',
    (pakken * ml) / 1000,
    `Eén pak: 10 × 10 × 10 = 1000 cm³ = 1 l. ${pakken} pakken = ${pakken} l.`
  );
};
const hoogteZoeken = ({ heel }) => {
  const l = heel(4, 10);
  const b = heel(2, 6);
  const h = heel(2, 8);
  return som(
    `Een blok heeft een volume van ${l * b * h} cm³. Het is ${l} cm lang en ${b} cm breed. Hoe hoog is het blok?`,
    'cm',
    h,
    `Bodem: ${l} × ${b} = ${l * b} cm². Hoogte: ${l * b * h} : ${l * b} = ${h} cm.`
  );
};
// Kevins voorbeeld: Vbegin 45 ml, koper van 13 cm³ erin, wat wordt Veind?
const eindVolume = ({ heel, kies }) => {
  const begin = heel(8, 18) * 5;
  const metaal = kies(['koper', 'ijzer', 'aluminium', 'lood']);
  const v = heel(6, 25);
  return som(
    `Je doet de onderdompelmethode. V begin is ${begin} ml. Je laat een blokje ${metaal} van ${v} cm³ in de maatcilinder zakken. Wat wordt het eindvolume?`,
    'ml',
    begin + v,
    `${v} cm³ = ${v} ml. V eind = V begin + V blokje = ${begin} + ${v} = ${begin + v} ml.`
  );
};
const voorwerpVolume = ({ heel, kies }) => {
  const begin = heel(10, 30) * 2;
  const v = heel(4, 30);
  const ding = kies(['steen', 'sleutelbos', 'knikker', 'schelp']);
  return som(
    `Je leest bij de onderdompelmethode V begin = ${begin} ml en V eind = ${begin + v} ml af. Hoeveel cm³ is het volume van de ${ding}?`,
    'cm³',
    v,
    `V ${ding} = V eind - V begin = ${begin + v} - ${begin} = ${v} ml = ${v} cm³.`
  );
};
const beginZoeken = ({ heel }) => {
  const v = heel(5, 20);
  const eind = heel(12, 30) * 2 + v;
  return som(
    `Na het onderdompelen van een steen van ${v} cm³ staat het water op ${eind} ml. Hoeveel ml water stond er in het begin in?`,
    'ml',
    eind - v,
    `V begin = V eind - V steen = ${eind} - ${v} = ${eind - v} ml.`
  );
};
const knikkers = ({ heel }) => {
  const aantal = heel(3, 6);
  const per = heel(2, 5);
  const begin = heel(4, 8) * 5;
  const eind = begin + aantal * per;
  return som(
    `V begin is ${begin} ml. Je doet ${aantal} gelijke knikkers in de maatcilinder. V eind is ${eind} ml. Wat is het volume van één knikker?`,
    'cm³',
    per,
    `Alle knikkers samen: ${eind} - ${begin} = ${aantal * per} cm³. Eén knikker: ${aantal * per} : ${aantal} = ${per} cm³.`
  );
};

const SETS = {
  maatcilinder: { omrekenen: [mlNaarL, lNaarMl, gNaarKg], verhaal: [maatcilinderBijschenken, schaalStreepje, flesVerdelen, blokjesMassa, zakAppels] },
  balk: { omrekenen: [cm3NaarMl, cm3NaarL, kgNaarG], verhaal: [doosVolume, aquariumLiter, kubusjes, blokjesMassa, hoogteZoeken] },
  onderdompelen: { omrekenen: [cm3NaarMl, mlNaarL, gNaarKg], verhaal: [eindVolume, voorwerpVolume, beginZoeken, knikkers, pakMelk] }
};

// Acht sommen voor deze missie: drie omrekeningen, dan vijf verhaalsommen.
export function maakOefenblad(missie, rng = Math.random) {
  const set = SETS[missie] || SETS.maatcilinder;
  const rekenaar = maakRekenaar(rng);
  return [...set.omrekenen, ...set.verhaal].map((maak, index) => ({
    id: `oefen-${index + 1}`,
    soort: index < set.omrekenen.length ? 'omrekenen' : 'verhaal',
    ...maak(rekenaar)
  }));
}

// Goed als het getal klopt; komma en punt mogen allebei.
export function oefenAntwoordGoed(invoer, antwoord) {
  const getal = leesGetal(invoer);
  return getal !== null && Math.abs(getal - antwoord) < 0.0001;
}
