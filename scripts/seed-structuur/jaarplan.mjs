// Het jaarplan Digitale Geletterdheid, vmbo leerjaar 1, schooljaar 2026-2027.
//
// Deze lijst is de enige plek waar staat WELKE paragrafen er per leerweg horen
// te zijn. De generator gebruikt hem om te melden welk hoofdstukbestand nog
// ontbreekt, en de validator om per leerweg te controleren of de seed compleet
// is. Wat er daadwerkelijk in de seed komt, komt altijd uit de
// hoofdstukbestanden zelf: dit plan verzint geen lesstof.
//
// Drie leerwegen, dezelfde onderwerpen, ander taalniveau en andere vorm:
//   bb  laat vier paragrafen vallen (2.4, 4.4, 6.1 en 7.4).
//   kb  doet alle gewone paragrafen.
//   tl  doet daarnaast per hoofdstuk een VRIJWILLIGE plusparagraaf.
//
// De plusparagraaf staat na het checkpoint, telt niet mee in de hoofdstuktoets
// en is geen voorwaarde om verder te mogen. Hij levert wel tokens op. In de
// hoofdstukbestanden markeer je hem met p(..., { optioneel: true }).

export const NIVEAUS = [
  {
    id: "bb",
    niveauId: "niveau-dv-vmbo1-bb",
    label: "Basisberoepsgerichte leerweg",
    omvang: "alle paragrafen behalve 2.4, 4.4, 6.1 en 7.4",
    taal: "Zinnen van maximaal 10 tot 12 woorden, een idee per zin. Alleen alledaagse woorden. Elk begrip krijgt een concreet voorbeeld uit hun eigen wereld. Elke handeling stap voor stap voorgedaan. Zwaartepunt op ik doe voor en samen oefenen.",
    didactiek: "VORM IS HIER BELANGRIJKER DAN INHOUD. Geen lange leesteksten: knip theorie op in blokjes van hooguit 4 of 5 zinnen, met daartussen steeds iets te doen. Werk met veel korte goed/fout-vragen in plaats van een paar grote vragen; een leerling moet elke minuut iets kunnen aanklikken. Zet waar mogelijk een kort filmpje of een infographic in plaats van uitleg in tekst (mediablok met kijkvraag). Geef doe-opdrachtjes: kleine concrete taakjes die af zijn in twee minuten. Verdeel de tokens over veel kleine momenten in plaats van een grote beloning aan het eind, zodat een leerling snel en vaak succes voelt. Feedback is kort, positief en benoemt wat er goed ging."
  },
  {
    id: "kb",
    niveauId: "niveau-dv-vmbo1-kb",
    label: "Kaderberoepsgerichte leerweg",
    omvang: "alle paragrafen",
    taal: "Zinnen van 12 tot 15 woorden. Elk begrip eerst uitleggen met een voorbeeld, daarna pas gebruiken. Meer hoe dan waarom. Wissel voordoen en zelf proberen af.",
    didactiek: "Wissel theorie en doen af: hooguit 6 of 7 zinnen achter elkaar lezen. Mix goed/fout-vragen met meerkeuze en een enkele open vraag. Media met kijkvraag waar het uitleg scheelt."
  },
  {
    id: "tl",
    niveauId: "niveau-dv-vmbo1-tl",
    label: "Theoretische leerweg",
    omvang: "alle paragrafen",
    taal: "Zinnen van 15 tot 20 woorden. Begrippen mogen abstract blijven. Leg verbanden en het waarom uit, niet alleen het hoe. Zwaartepunt op zelf proberen en bewijs leveren.",
    didactiek: "Langere theorieblokken mogen, maar altijd met een uitgewerkt voorbeeld ervoor. Meer open vragen waarin de leerling iets moet uitleggen of vergelijken. Verdiepingsvragen die verbanden leggen tussen paragrafen."
  }
];

export const NIVEAU_IDS = NIVEAUS.map((niveau) => niveau.id);

export const HOOFDSTUKKEN = [
  {
    nummer: 1,
    titel: "Startklaar op je nieuwe school",
    paragrafen: [
      { code: "1.1", titel: "De digitale systemen van school", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "1.2", titel: "Een sterk wachtwoord maken en bewaren", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "1.3", titel: "Netjes mailen met Outlook", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "1.4", titel: "Digitale geletterdheid: jouw digitale wereld", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "1.5", titel: "Checkpoint: klaar voor het digitale schooljaar", checkpoint: true, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "1.6", titel: "Plus: hoe beschermt een wachtwoord jou eigenlijk?", checkpoint: false, optioneel: true, nietVoorBasis: true, alleenVoor: ["tl"] }
    ]
  },
  {
    nummer: 2,
    titel: "Je device en hoe het werkt",
    paragrafen: [
      { code: "2.1", titel: "Hardware: de onderdelen van je device", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "2.2", titel: "Software, besturingssysteem en updates", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "2.3", titel: "Bestanden ordenen: Verkenner, OneDrive en sneltoetsen", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "2.4", titel: "Internet en data: hoe reist jouw informatie?", checkpoint: false, optioneel: false, nietVoorBasis: true, alleenVoor: [] },
      { code: "2.5", titel: "Checkpoint: mijn device onder controle", checkpoint: true, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "2.6", titel: "Plus: hoe voert een computer jouw opdracht uit?", checkpoint: false, optioneel: true, nietVoorBasis: true, alleenVoor: ["tl"] }
    ]
  },
  {
    nummer: 3,
    titel: "Veilig internet en jouw gegevens",
    paragrafen: [
      { code: "3.1", titel: "Veilig internetten: risico's en twee-staps-verificatie", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "3.2", titel: "Phishing, cybercriminelen en identiteitsfraude", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "3.3", titel: "Voor altijd op internet: jouw digitale voetafdruk", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "3.4", titel: "Checkpoint: digitaal weerbaar", checkpoint: true, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "3.5", titel: "Plus: het slotje ontrafeld, versleuteling en https", checkpoint: false, optioneel: true, nietVoorBasis: true, alleenVoor: ["tl"] }
    ]
  },
  {
    nummer: 4,
    titel: "Werken met Word, Excel en PowerPoint",
    paragrafen: [
      { code: "4.1", titel: "Word: je eerste document met voorblad, opmaak en paginanummers", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "4.2", titel: "Koppen en een automatische inhoudsopgave", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "4.3", titel: "Afbeeldingen invoegen en beeld dat je mag gebruiken", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "4.4", titel: "Gegevens in Excel: tabel, formule en grafiek", checkpoint: false, optioneel: false, nietVoorBasis: true, alleenVoor: [] },
      { code: "4.5", titel: "PowerPoint: dia's, tekst, ontwerp en overgangen", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "4.6", titel: "Je eigen presentatie maken en presenteren", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "4.7", titel: "Checkpoint: eindtoets basisvaardigheden ICT", checkpoint: true, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "4.8", titel: "Plus: gegevens analyseren met Excel", checkpoint: false, optioneel: true, nietVoorBasis: true, alleenVoor: ["tl"] }
    ]
  },
  {
    nummer: 5,
    titel: "Jouw digitale wereld: normen, waarden en online kopen",
    paragrafen: [
      { code: "5.1", titel: "Jouw digitale wereld: normen, waarden en gedragsregels", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "5.2", titel: "Privacy beschermen en berichten rapporteren", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "5.3", titel: "Veilig online shoppen: is deze webshop te vertrouwen?", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "5.4", titel: "Betalen en kopen uit het buitenland", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "5.5", titel: "Checkpoint: bewust online kopen en delen", checkpoint: true, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "5.6", titel: "Plus: jouw rechten als online koper", checkpoint: false, optioneel: true, nietVoorBasis: true, alleenVoor: ["tl"] }
    ]
  },
  {
    nummer: 6,
    titel: "Mediawijs: social media, welzijn en betrouwbaar nieuws",
    paragrafen: [
      { code: "6.1", titel: "Social media en het algoritme", checkpoint: false, optioneel: false, nietVoorBasis: true, alleenVoor: [] },
      { code: "6.2", titel: "FOMO, druk en je zelfbeeld", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "6.3", titel: "Cyberpesten: wat het is en wat het doet", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "6.4", titel: "Wat doe jij bij cyberpesten?", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "6.5", titel: "Digitaal gezond blijven", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "6.6", titel: "Nepnieuws, deepfake en betrouwbare bronnen", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "6.7", titel: "Checkpoint: eindtoets mediawijsheid", checkpoint: true, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "6.8", titel: "Plus: hoe een aanbevelingsalgoritme jou leert kennen", checkpoint: false, optioneel: true, nietVoorBasis: true, alleenVoor: ["tl"] }
    ]
  },
  {
    nummer: 7,
    titel: "Kunstmatige intelligentie en chatbots",
    paragrafen: [
      { code: "7.1", titel: "Wat is kunstmatige intelligentie?", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "7.2", titel: "Voordelen, gevaren en AI-beeld", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "7.3", titel: "Een chatbot gebruiken: een goede prompt schrijven", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "7.4", titel: "Kritisch met chatbots: hallucinatie en veilig gebruik", checkpoint: false, optioneel: false, nietVoorBasis: true, alleenVoor: [] },
      { code: "7.5", titel: "Checkpoint: slim en veilig met AI", checkpoint: true, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "7.6", titel: "Plus: waar haalt AI zijn antwoorden vandaan?", checkpoint: false, optioneel: true, nietVoorBasis: true, alleenVoor: ["tl"] }
    ]
  },
  {
    nummer: 8,
    titel: "Zelf maken: programmeren, ontwerpen en terugblikken",
    paragrafen: [
      { code: "8.1", titel: "Algoritmes: een stappenplan voor de computer", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "8.2", titel: "Zelf programmeren met blokken", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "8.3", titel: "Testen en verbeteren: fouten uit je programma halen", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "8.4", titel: "Zelf ontwerpen in Canva", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "8.5", titel: "Eindopdracht: poster met Canva en AI", checkpoint: false, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "8.6", titel: "Checkpoint: terugblik en jouw digitale creatie", checkpoint: true, optioneel: false, nietVoorBasis: false, alleenVoor: [] },
      { code: "8.7", titel: "Plus: van blokken naar echte code", checkpoint: false, optioneel: true, nietVoorBasis: true, alleenVoor: ["tl"] }
    ]
  }
];

export const PLUSREGELS = "Plusparagrafen zijn ALLEEN voor de theoretische leerweg en zijn VRIJWILLIG. Ze staan aan het eind van het hoofdstuk, na het checkpoint, en zijn bedoeld als aanrader voor leerlingen die naar de havo willen. Regels: de hoofdstuktoets bevraagt ze NOOIT, ze zijn geen voorwaarde om verder te mogen, en een leerling die ze overslaat mist niets van de leerlijn. In de app zijn ze herkenbaar als bonus en de docent kan in de voortgang zien wie ze vrijwillig gemaakt heeft. Tokens leveren ze wel op, zodat er iets tegenover staat.";

export const niveauById = (id) => NIVEAUS.find((niveau) => niveau.id === String(id)) || null;

// Hoort deze paragraaf bij deze leerweg? Een plusparagraaf staat op alleenVoor
// ['tl']; de vier paragrafen die basis laat vallen staan op nietVoorBasis.
export const paragraafHoortBij = (paragraaf, niveauId) => {
  const alleenVoor = Array.isArray(paragraaf?.alleenVoor) ? paragraaf.alleenVoor : [];
  if (alleenVoor.length > 0 && !alleenVoor.includes(niveauId)) return false;
  if (niveauId === 'bb' && paragraaf?.nietVoorBasis === true) return false;
  return true;
};

// Het plan van één leerweg: per hoofdstuk de paragrafen die er horen te staan.
export const hoofdstukPlanVoorNiveau = (niveauId) =>
  HOOFDSTUKKEN.map((hoofdstuk) => {
    const paragrafen = hoofdstuk.paragrafen.filter((paragraaf) => paragraafHoortBij(paragraaf, niveauId));
    return {
      chapter: hoofdstuk.nummer,
      title: hoofdstuk.titel,
      paragrafen,
      codes: paragrafen.map((paragraaf) => paragraaf.code),
      optioneleCodes: paragrafen.filter((paragraaf) => paragraaf.optioneel).map((paragraaf) => paragraaf.code),
      checkpointCodes: paragrafen.filter((paragraaf) => paragraaf.checkpoint).map((paragraaf) => paragraaf.code)
    };
  });

export const planParagraaf = (code) => {
  for (const hoofdstuk of HOOFDSTUKKEN) {
    const gevonden = hoofdstuk.paragrafen.find((paragraaf) => paragraaf.code === String(code));
    if (gevonden) return gevonden;
  }
  return null;
};
