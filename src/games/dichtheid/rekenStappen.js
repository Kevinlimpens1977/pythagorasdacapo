import { beoordeelUitkomst, f, FORMULES, fRho, stof, UITKOMST_FEEDBACK, zoekStof } from './dichtheidLogic.js';

// Dezelfde stappen als bij het rekenen met ρ in missie 3: hand, invullen, berekenen, eenheid, stof.
export function rekenStappenRho(w, vooraf = []) {
  const exact = w.m / w.V;
  return [
    {
      id: 'hand', soort: 'hand', regel: 'formule', juist: 'rho', vooraf: vooraf.includes('hand'),
      opdracht: 'Je zoekt de dichtheid. Leg de hand op ρ in de driehoek.',
      tip: 'Wat je zoekt, dek je af met de hand. Wat overblijft is de formule.',
      foutTekst: () => 'Je zoekt de dichtheid, en die heeft de letter ρ (rho).',
      oplossing: () => 'Hand op ρ. Wat overblijft: ρ = m : V.'
    },
    {
      id: 'invullen', soort: 'getal', regel: 'invullen', vooraf: vooraf.includes('invullen'),
      opdracht: 'Vul de formule in: ρ = m : V.',
      tip: 'Zet de massa voor het deelteken en het volume erachter.',
      velden: [
        { key: 'invulM', label: 'ρ =', juist: w.m, fout: 'Zet eerst de massa m neer, dan het volume V.' },
        { key: 'invulV', label: ':', juist: w.V, fout: 'Zet eerst de massa m neer, dan het volume V.' }
      ],
      oplossing: () => `ρ = ${f(w.m)} : ${f(w.V)}`
    },
    {
      id: 'rho', soort: 'getal', regel: 'berekenen', rekenmachine: true, vooraf: vooraf.includes('rho'),
      opdracht: 'Reken uit met de rekenmachine. Rond af op één decimaal.',
      tip: `Tik ${f(w.m)} : ${f(w.V)} = in op de rekenmachine. Kijk naar het tweede cijfer achter de komma om af te ronden.`,
      velden: [{
        key: 'rho', label: 'ρ =', juist: Math.round(exact * 10) / 10,
        beoordeel: (invoer) => {
          const uitslag = beoordeelUitkomst(invoer, exact);
          return { goed: uitslag.goed, tekst: UITKOMST_FEEDBACK[uitslag.soort] };
        }
      }],
      oplossing: () => `ρ = ${f(w.m)} : ${f(w.V)} = ${f(exact, 3)}… ≈ ${fRho(exact)}`
    },
    {
      id: 'eenheid', soort: 'eenheid', regel: 'eenheid', juist: 'g/cm³', vooraf: vooraf.includes('eenheid'),
      opdracht: 'Kies de eenheid van de dichtheid.',
      tip: 'Massa in gram gedeeld door volume in cm³.',
      foutTekst: () => 'Je deelt gram door cm³. Welke eenheid hoort daarbij?',
      oplossing: () => 'De eenheid is g/cm³: gram per kubieke centimeter.'
    },
    {
      id: 'stof', soort: 'stof', regel: 'eenheid', vooraf: vooraf.includes('stof'),
      juist: (waarden) => zoekStof(waarden.rho)?.id,
      isGoed: (id, waarden) => stof(id)?.rho === Math.round(waarden.rho * 10) / 10,
      opdracht: `Welke stof is het? Zoek ρ = ${w.rho !== undefined ? fRho(w.rho) : '…'} g/cm³ op in het boekje.`,
      tip: 'Sorteer het boekje op dichtheid, dan vind je hem snel.',
      foutTekst: () => `Die stof heeft een andere dichtheid. Zoek precies ${fRho(w.rho)} g/cm³.`,
      oplossing: (waarden) => `ρ = ${fRho(waarden.rho)} g/cm³ hoort bij ${zoekStof(waarden.rho)?.naam}.`
    }
  ];
}

export function kladbladRho(w, gegeven) {
  return {
    gegeven,
    gevraagd: 'ρ = ? g/cm³',
    formule: w.hand ? FORMULES[w.hand].tekst : '',
    invullen: w.invulM !== undefined ? `ρ = ${f(w.invulM)} : ${f(w.invulV)}` : '',
    berekenen: w.rho !== undefined ? `ρ = ${f(w.rho)}` : '',
    eenheid: w.eenheid ? `ρ = ${f(w.rho)} ${w.eenheid}${w.stof ? `  (${stof(w.stof).naam})` : ''}` : ''
  };
}
