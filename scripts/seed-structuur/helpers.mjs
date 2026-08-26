// Bouwstenen voor de curriculumstructuur van Digitale vaardigheden.
//
// DRIE LEERWEGEN NAAST ELKAAR
// ---------------------------
// Het vak wordt gevuld voor basis (bb), kader (kb) en theoretisch (tl):
// dezelfde onderwerpen, een ander taalniveau en een andere vorm. Elke leerweg
// heeft een eigen map:
//
//   scripts/seed-structuur/bb/h<n>.mjs
//   scripts/seed-structuur/kb/h<n>.mjs
//   scripts/seed-structuur/tl/h<n>.mjs
//
// Elk van die bestanden exporteert default één hoofdstukobject. De generator
// (scripts/generate-digitale-vaardigheden-seed.mjs) leest per leerweg ALLES wat
// er als h<n>.mjs in de bijbehorende map staat, gesorteerd op hoofdstuknummer.
// Ontbreekt een hoofdstukbestand, dan slaat hij het over met een waarschuwing
// in plaats van te stoppen. Zo kunnen meerdere mensen tegelijk aan verschillende
// hoofdstukken en verschillende leerwegen werken zonder elkaars werk te
// overschrijven.
//
// Welke paragrafen bij welke leerweg horen staat in
// scripts/seed-structuur/jaarplan.mjs. Basis laat vier paragrafen vallen (2.4,
// 4.4, 6.1 en 7.4); de theoretische leerweg heeft er per hoofdstuk een
// vrijwillige plusparagraaf bij.
//
// VORM VAN EEN HOOFDSTUKBESTAND
// -----------------------------
//   import { p, checkpoint, media } from '../helpers.mjs';
//
//   export default {
//     chapter: 3,
//     chapterTitle: 'Veilig internet en jouw gegevens',
//     badge: 'Naam van de hoofdstukbadge',
//     paragraphs: [
//       p('3.1', ...),
//       ...
//       checkpoint('3.4', ...),
//       p('3.5', ..., { optioneel: true })   // alleen in tl/
//     ]
//   };
//
// De hoofdstuktoets (checkpoint) sluit de leerlijn van het hoofdstuk af; in het
// laatste hoofdstuk staat die op final = true (dan wordt het de eindtoets). In
// de theoretische leerweg staat daarna nog de vrijwillige plusparagraaf.
//
// p(code, title, kerndoelen, product, tokens, gameTitle,
//   theoryA, theoryB, mediaBlock, checks, assignment, quizItems,
//   gameDescription, opties)
//
//   code           '3.1'. Bepaalt de id's: paragraaf-dv-tl-3-1, dv-tl-3-1-theory-1 enz.
//   title          De paragraaftitel zoals de leerling hem leest.
//   kerndoelen     Array met kerndoelcodes, bijvoorbeeld ['21A', '23A'].
//   product        Wat de leerling aan het eind af heeft; komt in de
//                  paragraafbeschrijving en in de standaardsamenvatting.
//   tokens         Het totaal aan tokens van de paragraaf. Dit MOET kloppen met
//                  de som van het tokenplan in de generator, anders stopt de
//                  generator met een foutmelding. Gewone paragraaf: 100,
//                  checkpoint: 120.
//   gameTitle      Titel van het gameblok; hieruit volgt de gameId.
//   theoryA/B      [titel, tekst]-paar. HIER staat de eigenlijke lesstof: twee
//                  theorieblokken per paragraaf, elk één alinea lopende tekst.
//   mediaBlock     media(url, label, kijkvraag), een ARRAY daarvan, of null.
//                  Meerdere fragmenten worden meerdere mediablokken; ze delen
//                  het tokenbudget van de media. Een tweede video hoeft dus niet
//                  als kale URL in de opdrachttekst te blijven staan.
//   checks         De STARTCHECK: startvragen die VOOR de theorie komen, een per
//                  leerdoel. Een kale string blijft werken en levert een korte
//                  open check op. Beter is een object:
//                    { vraag, antwoord, uitleg, leerdoel }
//                  Met antwoord en uitleg erbij zet de generator die uitleg in
//                  een <details> die de leerling zelf openklapt, en gaat de
//                  Digidocent op dat blok uit: eerst zelf denken, dan pas hulp.
//   assignment     De praktijkopdracht. Mag een tekst zijn, maar liever een
//                  object:
//                    { tekst, label, modelAnswer, nakijkpunten }
//                  Zonder modelantwoord kan de docent het bewijsproduct niet
//                  nakijken. De nakijkpunten komen ook als succescriteria bij de
//                  leerling in beeld.
//   quizItems      VraagIDEEËN voor de afsluitquiz. Dit zijn GEEN vragen: de
//                  echte vragen staan in scripts/seed-verrijking/<niveau>/h<n>.mjs
//                  onder `vragen`. Ontbreken die, dan blijft het quizblok draft
//                  en komen deze ideeën als pendingPrompts in de CMS te staan.
//   gameDescription Wat de game doet; wordt de placeholdertekst van het gameblok.
//   opties         Optiesobject, mag weg. Zie hieronder.
//
// OPTIES
// ------
//   { optioneel: true }
//     Markeert de paragraaf als VRIJWILLIG. Zo staat de plusparagraaf van de
//     theoretische leerweg erin: een aanrader voor leerlingen die naar de havo
//     willen, geen voorwaarde om verder te mogen.
//
//     Wat de generator ermee doet:
//       - het paragraafdocument krijgt optioneel: true en verplicht: false;
//       - de hoofdstukbadge eist de paragraaf niet;
//       - de hoofdstuktoets mag er geen vraag over stellen (een toetsvraag die
//         aan een leerdoel van een optionele paragraaf hangt is een fout);
//       - de app telt hem niet mee in het percentage van het hoofdstuk
//         (src/lib/chapterOutline.js en src/lib/progressSummary.js).
//     Tokens levert hij gewoon op, want er moet iets tegenover staan.
//
//     Een checkpoint kan niet optioneel zijn: dat is de hoofdstuktoets.
//
//   { oefenen: [ { groep, vraag, antwoord, uitleg, leerdoel }, ... ] }
//     Het OEFENBLOK tussen de theorie en de bewijsopdracht: samen oefenen, zelf
//     oefenen en steun of plus. Zonder dit blok is de eerste opgave met feedback
//     die de leerling ziet meteen de afsluitquiz.
//       groep    'samen' | 'zelf' | 'steun' | 'plus'; bepaalt het kopje.
//       antwoord + uitleg komen in een <details> die pas na de eigen poging
//       opengaat, net als bij de startcheck.
//     Het blok haalt zijn tokens uit het budget van de praktijkopdracht (15 in
//     een gewone paragraaf, 10 in een checkpoint), dus het paragraaftotaal
//     verandert niet. Laat je `oefenen` weg, dan komt er geen blok.
//
// checkpoint(...) heeft dezelfde parameters, met toetsItems in plaats van
// quizItems en daarachter gameDescription, final (standaard false) en opties.

export const html = (parts) => parts.map((part) => `<p>${part}</p>`).join('\n');

export const slug = (value) => String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const gameIdForTitle = (title) => `dv-${slug(title)}`;

export const media = (url, label, kijkvraag) => ({ url, label, kijkvraag });

export const mediaKindForUrl = (url = '') => {
  const value = String(url || '').trim();
  if (!value) return 'image';
  if (/youtube\.com|youtu\.be/i.test(value)) return 'youtube';
  if (/\.pdf($|[?#])/i.test(value)) return 'pdf';
  if (/\.(png|jpe?g|webp|gif)($|[?#])/i.test(value)) return 'image';
  if (/\.(mp4|webm|ogg|ogv|mov|m4v)($|[?#])/i.test(value)) return 'video';
  return 'link';
};

// Een typefout in het optiesobject mag niet stil verdwijnen: dan denkt de
// bouwer dat zijn plusparagraaf vrijwillig is terwijl hij gewoon meetelt.
const BEKENDE_OPTIES = new Set(['optioneel', 'oefenen']);

export const leesOpties = (opties, label) => {
  if (opties === undefined || opties === null) return { optioneel: false, oefenen: [] };
  if (typeof opties !== 'object' || Array.isArray(opties)) {
    throw new Error(`${label}: opties moet een object zijn, bijvoorbeeld { optioneel: true }`);
  }

  for (const sleutel of Object.keys(opties)) {
    if (!BEKENDE_OPTIES.has(sleutel)) {
      throw new Error(`${label}: onbekende optie "${sleutel}"; bekend is ${[...BEKENDE_OPTIES].join(', ')}`);
    }
  }

  if (opties.optioneel !== undefined && typeof opties.optioneel !== 'boolean') {
    throw new Error(`${label}: optioneel is true of false, geen ${typeof opties.optioneel}`);
  }

  if (opties.oefenen !== undefined && !Array.isArray(opties.oefenen)) {
    throw new Error(`${label}: oefenen is een array met oefenopgaven, geen ${typeof opties.oefenen}`);
  }

  return { optioneel: opties.optioneel === true, oefenen: Array.isArray(opties.oefenen) ? opties.oefenen : [] };
};

export function p(code, title, kerndoelen, product, tokens, gameTitle, theoryA, theoryB, mediaBlock, checks, assignment, quizItems, gameDescription, opties) {
  const { optioneel, oefenen } = leesOpties(opties, `paragraaf ${code}`);
  return { code, title, kerndoelen, product, tokens, gameTitle, theory: [theoryA, theoryB], media: mediaBlock, checks, oefenen, assignment, assessmentItems: quizItems, gameDescription, checkpoint: false, optioneel };
}

export function checkpoint(code, title, kerndoelen, product, tokens, gameTitle, theoryA, theoryB, mediaBlock, checks, assignment, toetsItems, gameDescription, final = false, opties) {
  // Valkuil: final staat voor opties. Wie opties meegeeft en final vergeet, schuift
  // zijn optiesobject in final, en een object is waar. Dat gaf stilzwijgend de
  // eindtoetsverdeling (150 tokens) in plaats van de checkpointverdeling (120).
  // We vangen dat hier op in plaats van het in elk hoofdstukbestand te laten misgaan.
  if (final !== null && typeof final === 'object') {
    if (opties !== undefined) {
      throw new Error(`checkpoint ${code}: zowel final als opties zijn een object; geef final als true of false mee`);
    }
    opties = final;
    final = false;
  }
  if (typeof final !== 'boolean') {
    throw new Error(`checkpoint ${code}: final moet true of false zijn, kreeg ${typeof final}`);
  }
  const { optioneel, oefenen } = leesOpties(opties, `checkpoint ${code}`);
  if (optioneel) {
    throw new Error(`checkpoint ${code}: een hoofdstuktoets kan niet optioneel zijn`);
  }
  return { code, title, kerndoelen, product, tokens, gameTitle, theory: [theoryA, theoryB], media: mediaBlock, checks, oefenen, assignment, assessmentItems: toetsItems, gameDescription, checkpoint: true, final, optioneel: false };
}
