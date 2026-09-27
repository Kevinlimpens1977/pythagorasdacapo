// Snelronde: 60 seconden sommen met de formuledriehoek. Telt niet voor tokens.

import { leesGetal } from '../volumeBerekenen/volumeLogic.js';
import { beoordeelUitkomst, EENHEID_VAN, f, fRho, STOFFEN, SYMBOOL } from './dichtheidLogic.js';

const RHO = STOFFEN.filter((stof) => stof.antwoord).map((stof) => stof.rho);

export function maakSnelOpgave(rng = Math.random, vorige = null) {
  for (let poging = 0; poging < 20; poging += 1) {
    const rho = RHO[Math.floor(rng() * RHO.length)];
    const V = 2 + Math.floor(rng() * 19);
    const m = Math.round(rho * V * 10) / 10;
    const gezocht = ['m', 'V', 'rho'][Math.floor(rng() * 3)];
    const waarden = { m, V, rho };
    const gegeven = ['m', 'rho', 'V'].filter((letter) => letter !== gezocht)
      .map((letter) => `${SYMBOOL[letter]} = ${letter === 'rho' ? fRho(waarden[letter]) : f(waarden[letter])} ${EENHEID_VAN[letter]}`);
    const opgave = { gezocht, juist: waarden[gezocht], gegeven, sleutel: `${gezocht}-${rho}-${V}` };
    if (!vorige || vorige.sleutel !== opgave.sleutel) return opgave;
  }
  return maakSnelOpgave(rng, null);
}

export function beoordeelSnel(opgave, invoer) {
  const getal = leesGetal(invoer);
  if (getal === null) return null;
  if (opgave.gezocht === 'rho') return beoordeelUitkomst(invoer, opgave.juist).goed;
  return Math.abs(getal - opgave.juist) < 0.001;
}

export const juistTekst = (opgave) => `${opgave.gezocht === 'rho' ? fRho(opgave.juist) : f(opgave.juist)} ${EENHEID_VAN[opgave.gezocht]}`;
