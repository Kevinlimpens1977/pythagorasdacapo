// De avatar als eigen tekenset (Shop 2.0, deel 2B). Alleen gegevens, geen
// tekeningen: de SVG staat in src/components/avatar/HelixAvatar.jsx. Dit
// bestand gaat ook naar functions/shared, zodat de server weet wat gratis is,
// wat een onderdeel kost en wanneer een set compleet is.

export const AVATAR_SLOTS = ['kapsel', 'kleding', 'accessoire', 'achtergrond'];

export const HUIDSKLEUREN = [
  { id: 'huid-1', kleur: '#F9D9C3', schaduw: '#E8B99B' },
  { id: 'huid-2', kleur: '#F0C29C', schaduw: '#D9A277' },
  { id: 'huid-3', kleur: '#D9A273', schaduw: '#BD8455' },
  { id: 'huid-4', kleur: '#B87B4F', schaduw: '#9A6038' },
  { id: 'huid-5', kleur: '#8C5A3A', schaduw: '#714428' },
  { id: 'huid-6', kleur: '#5E3B27', schaduw: '#4A2C1B' }
];

export const HAARKLEUREN = [
  { id: 'haar-zwart', kleur: '#1E1B19' },
  { id: 'haar-bruin', kleur: '#5A3A22' },
  { id: 'haar-kastanje', kleur: '#8A4B24' },
  { id: 'haar-blond', kleur: '#E2B75A' },
  { id: 'haar-rood', kleur: '#B8461F' },
  { id: 'haar-blauw', kleur: '#2F7FD1' },
  { id: 'haar-roze', kleur: '#E86AA6' },
  { id: 'haar-grijs', kleur: '#B9B9B9' }
];

// Kleur van hoofddoek en kleding: vrij te kiezen, gratis.
export const STOFKLEUREN = [
  { id: 'stof-blauw', kleur: '#087EB5' },
  { id: 'stof-teal', kleur: '#0D8F93' },
  { id: 'stof-geel', kleur: '#FFD33D' },
  { id: 'stof-rood', kleur: '#D83A2E' },
  { id: 'stof-paars', kleur: '#793AC7' },
  { id: 'stof-groen', kleur: '#2E9D63' },
  { id: 'stof-zwart', kleur: '#2A2D31' },
  { id: 'stof-wit', kleur: '#F4F1EA' },
  { id: 'stof-roze', kleur: '#F29BC0' },
  { id: 'stof-beige', kleur: '#D8C3A0' }
];

// prijs 0 = gratis en altijd beschikbaar. set = hoort bij een set met bonus.
export const AVATAR_DELEN = [
  // Kapsels
  { id: 'kapsel-kort', slot: 'kapsel', titel: 'Kort', prijs: 0, zeldzaam: 'common' },
  { id: 'kapsel-lang', slot: 'kapsel', titel: 'Lang', prijs: 0, zeldzaam: 'common' },
  { id: 'kapsel-hoofddoek', slot: 'kapsel', titel: 'Hoofddoek', prijs: 0, zeldzaam: 'common', stof: true },
  { id: 'kapsel-geen', slot: 'kapsel', titel: 'Kaal', prijs: 0, zeldzaam: 'common' },
  { id: 'kapsel-stekels', slot: 'kapsel', titel: 'Stekels', prijs: 90, zeldzaam: 'common' },
  { id: 'kapsel-krullen', slot: 'kapsel', titel: 'Krullen', prijs: 90, zeldzaam: 'common' },
  { id: 'kapsel-staart', slot: 'kapsel', titel: 'Paardenstaart', prijs: 110, zeldzaam: 'common' },
  { id: 'kapsel-knot', slot: 'kapsel', titel: 'Knot', prijs: 110, zeldzaam: 'common' },
  { id: 'kapsel-kuif', slot: 'kapsel', titel: 'Kuif', prijs: 220, zeldzaam: 'rare' },
  { id: 'kapsel-afro', slot: 'kapsel', titel: 'Afro', prijs: 220, zeldzaam: 'rare' },
  { id: 'kapsel-vlechten', slot: 'kapsel', titel: 'Vlechten', prijs: 260, zeldzaam: 'rare' },
  { id: 'kapsel-buzz', slot: 'kapsel', titel: 'Buzzcut met streep', prijs: 300, zeldzaam: 'rare' },

  // Kleding
  { id: 'kleding-shirt', slot: 'kleding', titel: 'T-shirt', prijs: 0, zeldzaam: 'common', stof: true },
  { id: 'kleding-hoodie', slot: 'kleding', titel: 'Hoodie', prijs: 120, zeldzaam: 'common', stof: true },
  { id: 'kleding-trui', slot: 'kleding', titel: 'Trui met streep', prijs: 120, zeldzaam: 'common', stof: true },
  { id: 'kleding-sport', slot: 'kleding', titel: 'Sportshirt', prijs: 200, zeldzaam: 'rare', stof: true },
  { id: 'kleding-jas', slot: 'kleding', titel: 'Puffer-jas', prijs: 320, zeldzaam: 'rare', stof: true },
  { id: 'kleding-labjas', slot: 'kleding', titel: 'Labjas', prijs: 240, zeldzaam: 'rare', set: 'labset' },
  { id: 'kleding-hacker', slot: 'kleding', titel: 'Hacker-hoodie', prijs: 240, zeldzaam: 'rare', set: 'hackerset' },

  // Accessoires
  { id: 'accessoire-geen', slot: 'accessoire', titel: 'Niets', prijs: 0, zeldzaam: 'common' },
  { id: 'accessoire-bril', slot: 'accessoire', titel: 'Bril', prijs: 80, zeldzaam: 'common' },
  { id: 'accessoire-zonnebril', slot: 'accessoire', titel: 'Zonnebril', prijs: 150, zeldzaam: 'common' },
  { id: 'accessoire-pet', slot: 'accessoire', titel: 'Pet', prijs: 150, zeldzaam: 'common', stof: true },
  { id: 'accessoire-koptelefoon', slot: 'accessoire', titel: 'Koptelefoon', prijs: 260, zeldzaam: 'rare' },
  { id: 'accessoire-veiligheidsbril', slot: 'accessoire', titel: 'Veiligheidsbril', prijs: 160, zeldzaam: 'rare', set: 'labset' },
  { id: 'accessoire-headset', slot: 'accessoire', titel: 'Headset met microfoon', prijs: 160, zeldzaam: 'rare', set: 'hackerset' },
  { id: 'accessoire-kroon', slot: 'accessoire', titel: 'Kroon', prijs: 700, zeldzaam: 'epic' },

  // Achtergronden
  { id: 'achtergrond-effen', slot: 'achtergrond', titel: 'Effen', prijs: 0, zeldzaam: 'common', stof: true },
  { id: 'achtergrond-strepen', slot: 'achtergrond', titel: 'Snelheidslijnen', prijs: 100, zeldzaam: 'common' },
  { id: 'achtergrond-sterren', slot: 'achtergrond', titel: 'Sterrenhemel', prijs: 250, zeldzaam: 'rare' },
  { id: 'achtergrond-zonsondergang', slot: 'achtergrond', titel: 'Zonsondergang', prijs: 250, zeldzaam: 'rare' },
  { id: 'achtergrond-lab', slot: 'achtergrond', titel: 'Laboratorium', prijs: 200, zeldzaam: 'rare', set: 'labset' },
  { id: 'achtergrond-code', slot: 'achtergrond', titel: 'Coderegen', prijs: 200, zeldzaam: 'rare', set: 'hackerset' }
];

// Een volle set geeft een onderdeel dat je niet kunt kopen.
export const AVATAR_SETS = [
  { id: 'labset', titel: 'Labset', vak: 'Binask', bonus: 'accessoire-erlenmeyer' },
  { id: 'hackerset', titel: 'Hackerset', vak: 'Digitale vaardigheden', bonus: 'accessoire-code-bril' }
];

export const AVATAR_BONUSDELEN = [
  { id: 'accessoire-erlenmeyer', slot: 'accessoire', titel: 'Gouden erlenmeyer (setbonus)', prijs: 0, zeldzaam: 'epic', bonusVan: 'labset' },
  { id: 'accessoire-code-bril', slot: 'accessoire', titel: 'Codebril (setbonus)', prijs: 0, zeldzaam: 'epic', bonusVan: 'hackerset' }
];

export const STANDAARD_AVATAR = {
  huid: 'huid-3',
  haarkleur: 'haar-bruin',
  kapsel: 'kapsel-kort',
  kleding: 'kleding-shirt',
  kledingkleur: 'stof-blauw',
  accessoire: 'accessoire-geen',
  achtergrond: 'achtergrond-effen',
  achtergrondkleur: 'stof-geel',
  stofkleur: 'stof-teal'
};

const ALLE_DELEN = [...AVATAR_DELEN, ...AVATAR_BONUSDELEN];

export function avatarDeel(id) {
  return ALLE_DELEN.find((deel) => deel.id === id) || null;
}

// Het shopitem-id van een te koop onderdeel (zie scripts/seed-avatar-onderdelen.mjs).
export const shopItemIdVoorDeel = (deelId) => `avatar-${deelId}`;

// Mag deze leerling dit onderdeel dragen? Gratis delen altijd; anders moet hij het
// shopitem hebben gekocht (of de setbonus hebben gekregen).
export function magDeelDragen(deelId, bezitteShopItemIds = new Set()) {
  const deel = avatarDeel(deelId);
  if (!deel) return false;
  if (deel.prijs === 0 && !deel.bonusVan) return true;
  return bezitteShopItemIds.has(shopItemIdVoorDeel(deelId));
}

const KEUZE_LIJST = {
  huid: HUIDSKLEUREN, haarkleur: HAARKLEUREN, kledingkleur: STOFKLEUREN,
  achtergrondkleur: STOFKLEUREN, stofkleur: STOFKLEUREN
};

// Een avatar veilig maken: onbekende waarden terug naar de standaard.
export function normaliseerAvatar(avatar = {}) {
  const uit = { ...STANDAARD_AVATAR };
  for (const [veld, lijst] of Object.entries(KEUZE_LIJST)) {
    if (lijst.some((optie) => optie.id === avatar?.[veld])) uit[veld] = avatar[veld];
  }
  for (const slot of AVATAR_SLOTS) {
    const deel = avatarDeel(avatar?.[slot]);
    if (deel && deel.slot === slot) uit[slot] = deel.id;
  }
  return uit;
}

// Welke sets zijn compleet met deze aankopen?
export function completeSets(bezitteShopItemIds = new Set()) {
  return AVATAR_SETS.filter((set) => AVATAR_DELEN
    .filter((deel) => deel.set === set.id)
    .every((deel) => bezitteShopItemIds.has(shopItemIdVoorDeel(deel.id))));
}

export function kleurVan(lijst, id) {
  return (lijst.find((optie) => optie.id === id) || lijst[0]).kleur;
}
