// Het oefenblad na elke dichtheidsmissie (SPELOPZET-DICHTHEID.md §8): drie
// omrekeningen en vijf verhaalsommen, elke keer andere getallen. Een som met
// `afronden` kijkt na zoals de dichtheid in het spel: op één decimaal, of één
// decimaal meer mits goed afgerond.

import { leesGetal } from '../volumeBerekenen/volumeLogic.js';
import { beoordeelUitkomst, f, fRho, STOFFEN, stof, zoekStof } from './dichtheidLogic.js';

export const AANTAL_OEFENVRAGEN = 8;

const maakRekenaar = (rng) => ({
  heel: (min, max) => min + Math.floor(rng() * (max - min + 1)),
  kies: (lijst) => lijst[Math.floor(rng() * lijst.length)]
});

const rond = (getal, decimalen = 4) => Math.round(getal * 10 ** decimalen) / 10 ** decimalen;
const som = (vraag, eenheid, antwoord, uitwerking, afronden = false) => ({
  vraag, eenheid, antwoord: afronden ? antwoord : rond(antwoord), uitwerking, afronden
});

const ANTWOORDEN = STOFFEN.filter((item) => item.antwoord && item.rho > 1);

// Een massa die bij deze stof en dit volume terugrekent naar precies ρ.
const massa = (rho, V) => rond(rho * V, 1);

// ---------- omrekeningen ----------

const kgNaarG = ({ heel }) => {
  const kg = heel(3, 48) / 4;
  return som(`${f(kg)} kg = ... g`, 'g', kg * 1000, `1 kg = 1000 g, dus ${f(kg)} × 1000 = ${f(kg * 1000)} g.`);
};
const dm3NaarCm3 = ({ heel }) => {
  const dm3 = heel(1, 16) / 4;
  return som(`${f(dm3)} dm³ = ... cm³`, 'cm³', dm3 * 1000, `1 dm³ = 1 liter = 1000 cm³, dus ${f(dm3)} × 1000 = ${f(dm3 * 1000)} cm³.`);
};
const mlNaarCm3 = ({ heel }) => {
  const ml = heel(12, 480);
  return som(`${f(ml)} ml = ... cm³`, 'cm³', ml, `1 ml = 1 cm³, dus ${f(ml)} ml = ${f(ml)} cm³.`);
};
const gNaarKg = ({ heel }) => {
  const g = heel(2, 45) * 50;
  return som(`${f(g)} g = ... kg`, 'kg', g / 1000, `1 kg = 1000 g, dus ${f(g)} : 1000 = ${f(g / 1000)} kg.`);
};

// ---------- missie 1: meten ----------

const rhoUitMenV = ({ heel, kies }) => {
  const s = kies(ANTWOORDEN);
  const V = heel(3, 30);
  const m = massa(s.rho, V);
  return som(
    `Een blokje heeft een massa van ${f(m)} g en een volume van ${V} cm³. Bereken de dichtheid. Rond af op één decimaal.`,
    'g/cm³', m / V,
    `ρ = m : V = ${f(m)} : ${V} = ${fRho(m / V)} g/cm³.`, true
  );
};
const rhoUitBalk = ({ heel, kies }) => {
  const s = kies(ANTWOORDEN);
  const l = heel(2, 6);
  const b = heel(1, 4);
  const h = heel(1, 3);
  const V = l * b * h;
  const m = massa(s.rho, V);
  return som(
    `Een balkje is ${l} cm lang, ${b} cm breed en ${h} cm hoog. Het weegt ${f(m)} g. Bereken de dichtheid.`,
    'g/cm³', m / V,
    `V = ${l} × ${b} × ${h} = ${V} cm³. ρ = m : V = ${f(m)} : ${V} = ${fRho(m / V)} g/cm³.`, true
  );
};
const welkeStof = ({ heel, kies }) => {
  const s = kies(ANTWOORDEN);
  const V = heel(4, 25);
  const m = massa(s.rho, V);
  return som(
    `Een ring heeft een volume van ${V} cm³ en weegt ${f(m)} g. Van welke stof is hij? Vul de dichtheid in; zoek de stof op in het boekje.`,
    'g/cm³', m / V,
    `ρ = ${f(m)} : ${V} = ${fRho(m / V)} g/cm³. In het boekje: ${zoekStof(m / V)?.naam || s.naam}.`, true
  );
};
const massaInKg = ({ heel, kies }) => {
  const s = kies(ANTWOORDEN.filter((item) => item.rho < 12));
  const V = heel(2, 9) * 100;
  const m = massa(s.rho, V);
  return som(
    `Een blok van ${V} cm³ heeft een massa van ${f(m / 1000)} kg. Bereken de dichtheid in g/cm³.`,
    'g/cm³', m / V,
    `Eerst omrekenen: ${f(m / 1000)} kg = ${f(m)} g. ρ = ${f(m)} : ${V} = ${fRho(m / V)} g/cm³.`, true
  );
};
const kubusMeten = ({ heel, kies }) => {
  const s = kies(ANTWOORDEN);
  const z = heel(2, 4);
  const V = z * z * z;
  const m = massa(s.rho, V);
  return som(
    `Een kubus heeft ribben van ${z} cm. Hij weegt ${f(m)} g. Wat is de dichtheid?`,
    'g/cm³', m / V,
    `V = ${z} × ${z} × ${z} = ${V} cm³. ρ = ${f(m)} : ${V} = ${fRho(m / V)} g/cm³.`, true
  );
};

// ---------- missie 2: de formuledriehoek ----------

const mUitRhoV = ({ heel, kies }) => {
  const s = kies(ANTWOORDEN);
  const V = heel(2, 30);
  return som(
    `Een voorwerp heeft een dichtheid van ${fRho(s.rho)} g/cm³ en een volume van ${V} cm³. Bereken de massa.`,
    'g', s.rho * V,
    `m = ρ × V = ${fRho(s.rho)} × ${V} = ${f(s.rho * V)} g.`
  );
};
const vUitMRho = ({ heel, kies }) => {
  const s = kies(ANTWOORDEN);
  const V = heel(2, 30);
  const m = massa(s.rho, V);
  return som(
    `Een voorwerp heeft een massa van ${f(m)} g en een dichtheid van ${fRho(s.rho)} g/cm³. Bereken het volume.`,
    'cm³', V,
    `V = m : ρ = ${f(m)} : ${fRho(s.rho)} = ${V} cm³.`
  );
};
const mMetStof = ({ heel, kies }) => {
  const s = kies(ANTWOORDEN);
  const V = heel(2, 25);
  return som(
    `Een blokje ${s.naam} heeft een volume van ${V} cm³. Hoe groot is de massa? Zoek de dichtheid op in het boekje.`,
    'g', s.rho * V,
    `ρ van ${s.naam} = ${fRho(s.rho)} g/cm³. m = ρ × V = ${fRho(s.rho)} × ${V} = ${f(s.rho * V)} g.`
  );
};
const vMetStof = ({ heel, kies }) => {
  const s = kies(ANTWOORDEN);
  const V = heel(2, 25);
  const m = massa(s.rho, V);
  return som(
    `Een sleutel van ${s.naam} weegt ${f(m)} g. Hoe groot is het volume? Zoek de dichtheid op in het boekje.`,
    'cm³', V,
    `ρ van ${s.naam} = ${fRho(s.rho)} g/cm³. V = m : ρ = ${f(m)} : ${fRho(s.rho)} = ${V} cm³.`
  );
};
const eenKubieke = ({ kies }) => {
  const s = kies(ANTWOORDEN);
  return som(
    `Een kubusje ${s.naam} van precies 1 cm³. Hoe zwaar is het?`,
    'g', s.rho,
    `Dat is precies de betekenis van dichtheid: 1 cm³ ${s.naam} weegt ${fRho(s.rho)} g.`
  );
};

// ---------- missie 3: practicum ----------

const practicumRho = ({ heel, kies }) => {
  const s = kies(ANTWOORDEN);
  const begin = heel(4, 8) * 5;
  const V = heel(4, 20);
  const m = massa(s.rho, V);
  return som(
    `V begin = ${begin} ml en V eind = ${begin + V} ml. Het voorwerp weegt ${f(m)} g. Bereken de dichtheid.`,
    'g/cm³', m / V,
    `V = ${begin + V} - ${begin} = ${V} cm³. ρ = ${f(m)} : ${V} = ${fRho(m / V)} g/cm³.`, true
  );
};
const eindVoorspellen = ({ heel, kies }) => {
  const s = kies(ANTWOORDEN);
  const V = heel(3, 15);
  const m = massa(s.rho, V);
  const begin = heel(6, 12) * 5;
  return som(
    `Een blokje ${s.naam} van ${f(m)} g gaat in een maatcilinder met ${begin} ml water. Waar staat het water daarna? Zoek ρ op in het boekje.`,
    'ml', begin + V,
    `V = m : ρ = ${f(m)} : ${fRho(s.rho)} = ${V} cm³ = ${V} ml. V eind = ${begin} + ${V} = ${begin + V} ml.`
  );
};
const massaUitDompelen = ({ heel, kies }) => {
  const s = kies(ANTWOORDEN);
  const begin = heel(4, 10) * 5;
  const V = heel(3, 18);
  return som(
    `Een schroef van ${s.naam} laat het water stijgen van ${begin} ml naar ${begin + V} ml. Hoe zwaar is de schroef?`,
    'g', s.rho * V,
    `V = ${begin + V} - ${begin} = ${V} cm³. ρ van ${s.naam} = ${fRho(s.rho)}. m = ${fRho(s.rho)} × ${V} = ${f(s.rho * V)} g.`
  );
};
const knikkersRho = ({ heel, kies }) => {
  const s = kies(ANTWOORDEN.filter((item) => item.rho < 12));
  const aantal = heel(3, 6);
  const per = heel(2, 5);
  const begin = heel(4, 8) * 5;
  const m = massa(s.rho, aantal * per);
  return som(
    `${aantal} gelijke blokjes wegen samen ${f(m)} g. In de maatcilinder stijgt het water van ${begin} ml naar ${begin + aantal * per} ml. Wat is de dichtheid?`,
    'g/cm³', m / (aantal * per),
    `V = ${begin + aantal * per} - ${begin} = ${aantal * per} cm³. ρ = ${f(m)} : ${aantal * per} = ${fRho(m / (aantal * per))} g/cm³.`, true
  );
};
const drijftHet = ({ kies, heel }) => {
  const s = kies(STOFFEN.filter((item) => item.rho < 1 && item.antwoord));
  const V = heel(2, 8) * 5;
  const m = massa(s.rho, V);
  return som(
    `Een blokje van ${V} cm³ weegt ${f(m)} g. Bereken de dichtheid. Drijft het in water?`,
    'g/cm³', m / V,
    `ρ = ${f(m)} : ${V} = ${fRho(m / V)} g/cm³. Dat is kleiner dan 1,0 (water), dus het drijft.`, true
  );
};

const SETS = {
  meten: { omrekenen: [kgNaarG, mlNaarCm3, gNaarKg], verhaal: [rhoUitMenV, rhoUitBalk, welkeStof, massaInKg, kubusMeten] },
  driehoek: { omrekenen: [kgNaarG, dm3NaarCm3, mlNaarCm3], verhaal: [mUitRhoV, vUitMRho, mMetStof, vMetStof, eenKubieke] },
  practicum: { omrekenen: [mlNaarCm3, dm3NaarCm3, gNaarKg], verhaal: [practicumRho, eindVoorspellen, massaUitDompelen, knikkersRho, drijftHet] }
};

export function maakOefenblad(missie, rng = Math.random) {
  const set = SETS[missie] || SETS.meten;
  const rekenaar = maakRekenaar(rng);
  return [...set.omrekenen, ...set.verhaal].map((maak, index) => ({
    id: `oefen-${index + 1}`,
    soort: index < set.omrekenen.length ? 'omrekenen' : 'verhaal',
    ...maak(rekenaar)
  }));
}

export function oefenAntwoordGoed(invoer, antwoord, vraag = {}) {
  if (vraag.afronden) return beoordeelUitkomst(invoer, antwoord).goed;
  const getal = leesGetal(invoer);
  return getal !== null && Math.abs(getal - antwoord) < 0.0001;
}

// Zo staat het antwoord onder de som na twee fouten.
export const toonAntwoord = (vraag) => (vraag.afronden ? fRho(vraag.antwoord) : f(vraag.antwoord));

export { stof };
