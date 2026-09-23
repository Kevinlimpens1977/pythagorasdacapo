// Fase 4 (SPELOPZET-FASE4-PRIVILEGES.md): echte privileges, events en de
// grenzen daarvoor. Dit bestand gaat ook naar functions/shared.

// De eerste lijst, zoals Kevin die op 23 september 2026 koos.
export const STANDAARD_PRIVILEGES = [
  { id: 'privilege-muziek', titel: 'Muziek met oortjes (1 les)', prijs: 250, voorraadPerWeek: 3, maxPerSchooljaar: 0,
    beschrijving: 'Eén les muziek met je eigen oortjes tijdens zelfstandig werken.' },
  { id: 'privilege-plek', titel: 'Zelf je plek kiezen (1 les)', prijs: 200, voorraadPerWeek: 3, maxPerSchooljaar: 0,
    beschrijving: 'Eén les zit je waar jij wilt, zolang je gewoon doorwerkt.' },
  { id: 'privilege-dj', titel: 'DJ van de week', prijs: 1400, voorraadPerWeek: 1, maxPerSchooljaar: 2,
    beschrijving: 'Een week lang kies jij de muziek bij zelfstandig werken. De docent heeft het laatste woord.' },
  { id: 'privilege-bericht', titel: 'Een positief bericht naar huis', prijs: 800, voorraadPerWeek: 2, maxPerSchooljaar: 2,
    beschrijving: 'Je docent stuurt thuis een bericht over wat je goed doet.' }
];

export const PRIVILEGES_PER_LEERLING_PER_WEEK = 1;

// Een verzoek telt mee voor de grenzen, tenzij het is afgewezen.
export const telt = (verzoek) => verzoek?.status !== 'afgewezen';

// Het schooljaar van een datum: van 1 augustus tot en met 31 juli.
export function schooljaarSleutel(datum = new Date()) {
  const delen = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit' })
    .formatToParts(datum);
  const jaar = Number(delen.find((deel) => deel.type === 'year')?.value);
  const maand = Number(delen.find((deel) => deel.type === 'month')?.value);
  const start = maand >= 8 ? jaar : jaar - 1;
  return `${start}-${start + 1}`;
}

// Mag deze leerling dit privilege nu aanvragen? `eigen` zijn al zijn verzoeken,
// `klasDezeWeek` de verzoeken van zijn klas voor dit privilege in deze week.
export function magPrivilegeAanvragen({ item, eigen = [], klasDezeWeek = [], week, schooljaar }) {
  const eigenTellend = eigen.filter(telt);
  if (eigenTellend.filter((verzoek) => verzoek.week === week).length >= PRIVILEGES_PER_LEERLING_PER_WEEK) {
    return { mag: false, reden: 'Je hebt deze week al een privilege. Volgende week mag je weer.' };
  }
  const voorraad = Math.max(0, Number(item?.voorraadPerWeek) || 0);
  if (voorraad > 0 && klasDezeWeek.filter(telt).length >= voorraad) {
    return { mag: false, reden: 'Deze week is dit privilege op. Maandag is het er weer.' };
  }
  const max = Math.max(0, Number(item?.maxPerSchooljaar) || 0);
  if (max > 0 && eigenTellend.filter((verzoek) => verzoek.itemId === item.id && verzoek.schooljaar === schooljaar).length >= max) {
    return { mag: false, reden: `Dit privilege kun je hooguit ${max} keer per schooljaar krijgen.` };
  }
  return { mag: true, reden: '' };
}

// Een event (bijvoorbeeld een dubbele-XP-week) loopt van `van` tot en met `tot`,
// als datums "2026-09-28", in Nederlandse tijd.
export function eventActief(event, datum = new Date()) {
  if (!event || event.soort !== 'dubbeleXp' || !event.van || !event.tot) return false;
  const vandaag = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(datum);
  return vandaag >= event.van && vandaag <= event.tot;
}
