/**
 * Lesstof in de taal van de leerling.
 *
 * Puur en zonder React of Firebase, zodat de leerlingroute, de Cloud Function
 * en de tests dezelfde regels delen. Deze laag bepaalt WELKE tekst vertaald
 * wordt en hoe een vertaling over een blok heen gaat; het vertalen zelf gebeurt
 * server-side.
 */

const schoon = (waarde) => String(waarde ?? '').trim();

export const LES_TALEN = [
  { code: 'el', label: 'Ελληνικά', nederlands: 'Grieks' },
  { code: 'uk', label: 'Українська', nederlands: 'Oekraïens' },
  { code: 'ar', label: 'العربية', nederlands: 'Arabisch' },
  { code: 'tr', label: 'Türkçe', nederlands: 'Turks' },
  { code: 'pl', label: 'Polski', nederlands: 'Pools' },
  { code: 'ro', label: 'Română', nederlands: 'Roemeens' },
  { code: 'es', label: 'Español', nederlands: 'Spaans' },
  { code: 'it', label: 'Italiano', nederlands: 'Italiaans' },
  { code: 'en', label: 'English', nederlands: 'Engels' }
];

export const beschikbareTalen = () => LES_TALEN;

export const isLesTaal = (code) => LES_TALEN.some((taal) => taal.code === schoon(code));

/** De taal van een leerling, of '' als er niets geldigs staat. */
export const getLesTaal = (user) => {
  const code = schoon(user?.lesTaal);
  return isLesTaal(code) ? code : '';
};

export const taalLabel = (code) => LES_TALEN.find((taal) => taal.code === schoon(code))?.label || '';

/**
 * De Nederlandse naam van een taal ('Grieks', 'Italiaans'), voor de opdracht
 * aan het vertaalmodel en voor schermteksten in het beheer. Hij komt uit
 * LES_TALEN, zodat een taal toevoegen alleen dit bestand raakt en de Cloud
 * Function niet ergens een tweede lijstje hoeft bij te houden.
 */
export const taalNederlands = (code) =>
  LES_TALEN.find((taal) => taal.code === schoon(code))?.nederlands || '';

/**
 * Welke bloktypen hebben tekst die we kunnen omzetten? Slidedecks, media en
 * spellen zijn beeld; daar valt niets te vertalen zonder het materiaal zelf te
 * verbouwen.
 */
export const VERTAALBARE_BLOKTYPEN = new Set(['theory', 'question', 'quiz', 'toets', 'summary']);

/**
 * Een vraagblok dat naar de vragenbank verwijst (linkedVraagId) haalt zijn
 * tekst uit dat losse vraagdocument, niet uit dit blok. voegVertalingSamen
 * raakt dat document niet, dus zou alleen de bloktitel vertalen en de rest
 * Nederlands laten staan. Zo'n blok behandelen we daarom als niet
 * vertaalbaar: geen halfvertaald scherm en geen overbodige aanroep.
 */
export const isVertaalbaarBlok = (block) => {
  if (!VERTAALBARE_BLOKTYPEN.has(schoon(block?.type))) return false;
  if (schoon(block?.type) === 'question' && schoon(block?.linkedVraagId)) return false;
  return true;
};

/**
 * De tekst waar de vingerafdruk over gaat: precies wat de leerling leest, in
 * een vaste volgorde. Tokens, kenmerken en instellingen blijven erbuiten, zodat
 * een gewijzigde tokenwaarde geen nieuwe vertaling uitlokt.
 */
export const bronTekstVanBlok = (block) => {
  const content = block?.content || {};
  const delen = [schoon(block?.title), schoon(content.html)];

  (Array.isArray(content.items) ? content.items : []).forEach((item) => {
    delen.push(schoon(item?.id), schoon(item?.prompt));
    (Array.isArray(item?.options) ? item.options : []).forEach((optie) => {
      delen.push(schoon(optie?.id), schoon(optie?.text));
    });
  });

  return delen.join('');
};

/**
 * FNV-1a, 32 bits, als hex. Bewust geen cryptografische hash: dit is een
 * cachesleutel, geen beveiliging. Het voordeel is dat hij synchroon is en in de
 * browser en in Node hetzelfde antwoord geeft, zonder afhankelijkheden.
 */
const fnv1a = (tekst) => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < tekst.length; i += 1) {
    hash ^= tekst.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
};

export const bronVingerafdruk = (block) => fnv1a(bronTekstVanBlok(block));

/**
 * Dezelfde vingerafdruk voor een stuk losse tekst, zoals de titel, de
 * beschrijving en de leerdoelen van een paragraaf. Die staan niet in een
 * lesblok maar in het CMS-document, en worden apart vertaald voor de
 * lesstofpagina, de hoofdstukpagina en het startvenster van een paragraaf.
 */
export const tekstVingerafdruk = (tekst) => fnv1a(schoon(tekst));

/**
 * De brontekst van de lesstofgegevens die buiten de lesblokken vallen. Vaste
 * volgorde, zodat de vingerafdruk alleen verandert als de tekst verandert.
 */
export const bronTekstVanLesstofInfo = (info = {}) => [
  schoon(info.titel),
  schoon(info.beschrijving),
  ...(Array.isArray(info.leerdoelen) ? info.leerdoelen : []).map((doel) => schoon(doel))
].join('|');

/**
 * De vertaalde tekst over het blok heen. Alleen zichtbare tekst wordt
 * vervangen; kenmerken, antwoordgegevens, volgorde en instellingen blijven
 * staan, want daar draait het nakijken op. Een vraag zonder vertaling houdt
 * zijn Nederlandse tekst.
 */
export const voegVertalingSamen = (block, vertaling) => {
  if (!block || !vertaling) return block;

  const perItemId = new Map(
    (Array.isArray(vertaling.items) ? vertaling.items : [])
      .filter((item) => schoon(item?.id))
      .map((item) => [schoon(item.id), item])
  );

  const items = (Array.isArray(block.content?.items) ? block.content.items : []).map((item) => {
    const vertaald = perItemId.get(schoon(item?.id));
    if (!vertaald) return item;

    const perOptieId = new Map(
      (Array.isArray(vertaald.options) ? vertaald.options : [])
        .filter((optie) => schoon(optie?.id))
        .map((optie) => [schoon(optie.id), schoon(optie.text)])
    );

    return {
      ...item,
      prompt: schoon(vertaald.prompt) || item.prompt,
      options: (Array.isArray(item.options) ? item.options : []).map((optie) => {
        const tekst = perOptieId.get(schoon(optie?.id));
        return tekst ? { ...optie, text: tekst } : optie;
      })
    };
  });

  return {
    ...block,
    title: schoon(vertaling.titel) || block.title,
    content: {
      ...(block.content || {}),
      html: schoon(vertaling.html) || block.content?.html || '',
      items
    }
  };
};

/**
 * Bij een open vraag schrijft de leerling zijn antwoord in het Nederlands, want
 * het nakijken zet het af tegen een Nederlands modelantwoord. Deze zin staat
 * vast in de code en komt niet uit het vertaalmodel, zodat hij altijd klopt.
 */
const ANTWOORD_INSTRUCTIE = {
  el: 'Γράψε την απάντησή σου στα ολλανδικά.',
  uk: 'Пиши свою відповідь нідерландською.',
  ar: 'اكتب إجابتك بالهولندية.',
  tr: 'Cevabını Felemenkçe yaz.',
  pl: 'Odpowiedź napisz po niderlandzku.',
  ro: 'Scrie răspunsul în olandeză.',
  es: 'Escribe tu respuesta en neerlandés.',
  it: 'Scrivi la tua risposta in olandese.',
  en: 'Write your answer in Dutch.'
};

/**
 * Een lege taal betekent "gewoon Nederlands": dan hoort er geen extra zin bij
 * de vraag. Een taal die wél in LES_TALEN staat, heeft altijd een instructie;
 * daar zorgt controleerTalenCompleet hieronder voor.
 */
export const antwoordInstructie = (taal) => {
  const code = schoon(taal);
  if (!isLesTaal(code)) return '';
  return ANTWOORD_INSTRUCTIE[code];
};

/**
 * Een taal toevoegen raakt alleen dit bestand - maar dan moet hij hier ook
 * compleet zijn. Ontbreekt de Nederlandse naam, dan krijgt het vertaalmodel
 * geen doeltaal te horen; ontbreekt de antwoordinstructie, dan verdwijnt de
 * zin "schrijf je antwoord in het Nederlands" geruisloos terwijl het nakijken
 * Nederlands blijft. Beide zijn stille fouten die pas bij een leerling
 * opvallen, dus faalt het hier hard, bij het laden van de module.
 */
export const controleerTalenCompleet = (talen = LES_TALEN) => {
  talen.forEach((taal) => {
    const code = schoon(taal?.code);
    if (!code) throw new Error('lesTaal: een taal in LES_TALEN heeft geen code.');
    if (!schoon(taal?.nederlands)) {
      throw new Error(`lesTaal: taal ${code} mist de Nederlandse naam (veld "nederlands").`);
    }
    if (!ANTWOORD_INSTRUCTIE[code]) {
      throw new Error(`lesTaal: taal ${code} mist een antwoordinstructie in ANTWOORD_INSTRUCTIE.`);
    }
  });
  return true;
};

controleerTalenCompleet();
