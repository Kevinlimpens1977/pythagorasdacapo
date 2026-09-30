// Het oefenblad van het Vloeistoffenlab: acht verhaalsommen over vloeistoffen
// wegen, tarra, drijven en zweven, en de gemiddelde dichtheid. Elke keer andere
// getallen. Een dichtheid mag op één of op twee decimalen, mits goed afgerond.

import { leesGetal, rondAf } from '../volumeBerekenen/volumeLogic.js';
import { beoordeelUitkomst } from '../dichtheid/dichtheidLogic.js';
import { f2, fRho2, VLOEISTOFFEN } from './vloeistofLogic.js';

export const AANTAL_OEFENVRAGEN = 8;

const heel = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));
const kies = (rng, lijst) => lijst[Math.floor(rng() * lijst.length)];
const som = (vraag, eenheid, antwoord, uitwerking, afronden = false) => ({
  vraag, eenheid, antwoord: afronden ? antwoord : rondAf(antwoord, 4), uitwerking, afronden
});

const aftrekken = (rng) => {
  const v = kies(rng, VLOEISTOFFEN);
  const leeg = heel(rng, 550, 780) / 10;
  const V = heel(rng, 3, 8) * 10;
  const m = rondAf(v.rho * V, 1);
  return som(
    `Een lege maatcilinder weegt ${f2(leeg)} g. Met ${V} ml vloeistof erin weegt hij ${f2(rondAf(leeg + m, 1))} g. Bereken de dichtheid van de vloeistof.`,
    'g/cm³', m / V,
    `m = ${f2(rondAf(leeg + m, 1))} - ${f2(leeg)} = ${f2(m)} g. ρ = ${f2(m)} : ${V} = ${fRho2(m / V)} g/cm³. Dat is ${v.naam}.`, true
  );
};
const tarra = (rng) => {
  const v = kies(rng, VLOEISTOFFEN);
  const V = heel(rng, 2, 8) * 10;
  return som(
    `Je zet een lege maatcilinder op de weegschaal en drukt op NUL. Daarna schenk je er ${V} ml ${v.naam} in (ρ = ${fRho2(v.rho)} g/cm³). Wat staat er op het scherm?`,
    'g', v.rho * V,
    `Na NUL telt alleen de vloeistof. m = ρ × V = ${fRho2(v.rho)} × ${V} = ${f2(v.rho * V)} g.`
  );
};
const hoeveelMl = (rng) => {
  const v = kies(rng, VLOEISTOFFEN.filter((x) => x.id !== 'water'));
  const V = heel(rng, 2, 9) * 10;
  const m = rondAf(v.rho * V, 2);
  return som(
    `Je hebt ${f2(m)} g ${v.naam} nodig (ρ = ${fRho2(v.rho)} g/cm³). Hoeveel ml moet je afmeten?`,
    'ml', V,
    `V = m : ρ = ${f2(m)} : ${fRho2(v.rho)} = ${V} cm³ = ${V} ml.`
  );
};
const zweeft = (rng) => {
  const v = kies(rng, VLOEISTOFFEN);
  const V = heel(rng, 2, 9) * 5;
  return som(
    `Een voorwerp van ${V} cm³ zweeft in ${v.naam} (ρ = ${fRho2(v.rho)} g/cm³). Hoe groot is de massa van het voorwerp?`,
    'g', v.rho * V,
    `Zweven: ρ voorwerp = ρ vloeistof = ${fRho2(v.rho)} g/cm³. m = ${fRho2(v.rho)} × ${V} = ${f2(v.rho * V)} g.`
  );
};
const bootje = (rng) => {
  const m = heel(rng, 2, 9) * 100;
  const V = m * kies(rng, [2, 4, 5]);
  return som(
    `Een stalen bootje weegt ${m} g. Het totale volume, met de lucht erin, is ${V} cm³. Bereken de gemiddelde dichtheid.`,
    'g/cm³', m / V,
    `ρ gemiddeld = ${m} : ${V} = ${fRho2(m / V)} g/cm³. Dat is kleiner dan 1,00: het bootje drijft.`, true
  );
};
const maxLading = (rng) => {
  const leeg = heel(rng, 2, 6) * 100;
  const V = heel(rng, 8, 15) * 100;
  return som(
    `Een bootje van ${leeg} g heeft een totaal volume van ${V} cm³. Het zinkt als de gemiddelde dichtheid groter wordt dan 1,00 g/cm³. Hoeveel gram lading kan er maximaal in?`,
    'g', V - leeg,
    `Bij ρ = 1,00 is de totale massa ${V} g. Lading = ${V} - ${leeg} = ${V - leeg} g.`
  );
};
const druif = (rng) => {
  const V = heel(rng, 4, 8);
  const rho = kies(rng, [1.03, 1.05, 1.08]);
  const m = rondAf(rho * V, 2);
  return som(
    `Een druif heeft een massa van ${f2(m)} g en een volume van ${V} cm³. Bereken de dichtheid. (Zinkt hij in water, en drijft hij in zout water?)`,
    'g/cm³', m / V,
    `ρ = ${f2(m)} : ${V} = ${fRho2(m / V)} g/cm³. Groter dan water (1,00): zinkt. Kleiner dan zout water (1,20): drijft.`, true
  );
};
const ijsInOlie = (rng) => {
  const V = heel(rng, 2, 6) * 10;
  return som(
    `Een ijsblokje heeft een volume van ${V} cm³ en een massa van ${f2(0.92 * V)} g. Bereken de dichtheid. (In olie zweeft het, want olie heeft dezelfde dichtheid.)`,
    'g/cm³', 0.92,
    `ρ = ${f2(0.92 * V)} : ${V} = 0,92 g/cm³. Even groot als olie: het zweeft.`, true
  );
};

const SOMMEN = [aftrekken, tarra, hoeveelMl, zweeft, druif, ijsInOlie, bootje, maxLading];

export function maakOefenblad(rng = Math.random) {
  return SOMMEN.map((maak, index) => ({ id: `oefen-${index + 1}`, soort: 'verhaal', ...maak(rng) }));
}

export function oefenAntwoordGoed(invoer, antwoord, vraag = {}) {
  if (vraag.afronden) return beoordeelUitkomst(invoer, antwoord).goed;
  const getal = leesGetal(invoer);
  return getal !== null && Math.abs(getal - antwoord) < 0.001;
}

export const toonAntwoord = (vraag) => (vraag.afronden ? fRho2(vraag.antwoord) : f2(vraag.antwoord));
