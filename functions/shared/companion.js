// De companion (fase 5, SPELOPZET-FASE5-EXTRAS.md): een maatje dat meegroeit
// met sterren, dus met beheersing. Hij gaat nooit dood, verwelkt niet en
// krimpt niet. Dit bestand gaat ook naar functions/shared.

export const COMPANION_SOORTEN = [
  { id: 'robot', titel: 'Robotje' },
  { id: 'draak', titel: 'Draakje' },
  { id: 'atoom', titel: 'Atoompje' }
];

export const COMPANION_KLEUREN = [
  { id: 'comp-blauw', kleur: '#2F8FE0' },
  { id: 'comp-groen', kleur: '#3DBA6F' },
  { id: 'comp-paars', kleur: '#8A55D6' },
  { id: 'comp-oranje', kleur: '#F28A2E' },
  { id: 'comp-roze', kleur: '#EC6FA8' },
  { id: 'comp-teal', kleur: '#17A5A8' }
];

// Stadium 1 is een ei. Vanaf zoveel sterren groeit hij door.
export const COMPANION_STADIA = [
  { stadium: 1, titel: 'Ei', vanaf: 0 },
  { stadium: 2, titel: 'Uit het ei', vanaf: 3 },
  { stadium: 3, titel: 'Klein', vanaf: 10 },
  { stadium: 4, titel: 'Groot', vanaf: 25 },
  { stadium: 5, titel: 'Volgroeid', vanaf: 50 }
];

export const STANDAARD_COMPANION = { soort: '', kleur: 'comp-blauw' };

export function normaliseerCompanion(companion = {}) {
  return {
    soort: COMPANION_SOORTEN.some((soort) => soort.id === companion?.soort) ? companion.soort : '',
    kleur: COMPANION_KLEUREN.some((kleur) => kleur.id === companion?.kleur) ? companion.kleur : STANDAARD_COMPANION.kleur
  };
}

// Het stadium bij een aantal sterren, en hoeveel sterren er nog nodig zijn.
export function companionStadium(sterren = 0) {
  const aantal = Math.max(0, Number(sterren) || 0);
  const huidig = [...COMPANION_STADIA].reverse().find((stadium) => aantal >= stadium.vanaf) || COMPANION_STADIA[0];
  const volgende = COMPANION_STADIA.find((stadium) => stadium.stadium === huidig.stadium + 1) || null;
  return {
    stadium: huidig.stadium,
    titel: huidig.titel,
    volgendeTitel: volgende?.titel || '',
    nogSterren: volgende ? volgende.vanaf - aantal : 0
  };
}
