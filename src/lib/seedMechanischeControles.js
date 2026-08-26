import { normalizeAssessmentItem } from './assessmentBlockUtils.js';

// ---------------------------------------------------------------------------
// De zes MECHANISCHE controles op de seed van Digitale vaardigheden.
//
// Uit 34 kritiekrondes over de theoretische leerweg kwamen 618 gebreken. Ruim
// veertig procent daarvan is telbaar met code: een leerdoel zonder startvraag,
// een goed antwoord dat altijd het langste is, een quiz die nooit terugkijkt,
// een hoofdstuktoets die een leerdoel overslaat, een vraag zonder goed antwoord
// en een paragraaf zonder oefenstof. Dat door een lezer laten opmerken is
// verspilling: het staat er of het staat er niet.
//
// Daarom staan die zes hier als losse, pure functies. Ze krijgen één leerweg
// mee (paragrafen + contentblokken) en geven BEVINDINGEN terug:
//
//   { soort, niveau, hoofdstuk, code, melding }
//
// De validator (scripts/validate-digitale-vaardigheden-seed.mjs) telt ze per
// leerweg en per hoofdstuk en stopt met een foutcode zodra er één is. Dat ze
// hier los staan en niet in de validator, heeft één reden: zo zijn ze te
// testen met `node --test src/lib/` zonder eerst een seed van 3,7 MB te bouwen.
// ---------------------------------------------------------------------------

export const CONTROLE_SOORTEN = {
  startvraag: 'startvraag per leerdoel',
  antwoordlengte: 'goed antwoord te raden op lengte',
  terugkeervraag: 'terugkeervraag in de afsluitquiz',
  toetsdekking: 'dekking van de hoofdstuktoets',
  vraagintegriteit: 'kapotte of dubbele vraag',
  oefenlaag: 'oefenlaag gevuld'
};

// Blind de langste knop klikken hoort niet te lonen. Binnen ÉÉN blok is meer
// dan 40% van de gesloten vragen met het goede antwoord als langste optie een
// fout: een leerling maakt één quiz tegelijk, niet het gemiddelde van een
// leerweg.
export const MAX_LANGSTE_GOED_AANDEEL = 0.4;
// Onder de drie meetbare vragen zegt een percentage niets: één van de twee is
// al 50%. Een quiz heeft er minstens drie en een toets minstens zes, dus dit
// slaat in de praktijk alleen blokken over die vooral waar-niet-waar zijn.
export const MIN_GESLOTEN_VOOR_LENGTEMETING = 3;
// Twee prompts die na normalisatie voor 85% uit dezelfde woorden bestaan zijn
// dezelfde vraag in andere volgorde. Onder de zes woorden is die maat te grof.
export const MIN_WOORDEN_VOOR_GELIJKENIS = 6;
export const MAX_PROMPT_GELIJKENIS = 0.85;
export const MIN_CLOSED_OPTIONS = 3;

const bevinding = (soort, context, melding) => ({
  soort,
  niveau: context.niveau,
  hoofdstuk: context.hoofdstuk,
  code: context.code,
  melding: `${context.niveau} ${context.code}: ${melding}`
});

const bevindingHoofdstuk = (soort, niveau, hoofdstuk, code, melding) => ({
  soort,
  niveau,
  hoofdstuk,
  code,
  melding: `${niveau} ${code}: ${melding}`
});

export const normaliseerLeerdoel = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.;:!?]+$/, '');

export const normaliseerPrompt = (value) =>
  String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .normalize('NFD')
    .replace(new RegExp('[\u0300-\u036f]', 'g'), '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const woordenVan = (genormaliseerd) => (genormaliseerd ? genormaliseerd.split(' ') : []);

// Jaccard over de woordverzamelingen: hoeveel van alle gebruikte woorden delen
// de twee prompts? Onafhankelijk van woordvolgorde, dus "Wat is phishing?" en
// "Phishing, wat is dat?" vallen samen.
export const promptGelijkenis = (a, b) => {
  const linker = new Set(woordenVan(a));
  const rechter = new Set(woordenVan(b));
  if (linker.size === 0 || rechter.size === 0) return 0;
  let gedeeld = 0;
  for (const woord of linker) if (rechter.has(woord)) gedeeld += 1;
  return gedeeld / (linker.size + rechter.size - gedeeld);
};

const hoofdstukVanCode = (code) => {
  const eerste = String(code || '').split('.')[0];
  const nummer = Number(eerste);
  return Number.isFinite(nummer) ? nummer : 0;
};

const paragraafVolgnummer = (code) => {
  const delen = String(code || '').split('.');
  const nummer = Number(delen[1]);
  return Number.isFinite(nummer) ? nummer : 0;
};

const tekstVanVeld = (veld) => String(veld?.label || '').trim();

const oefenveldenVan = (block) => {
  const velden = block?.content?.exercise?.fields;
  return Array.isArray(velden) ? velden.filter((veld) => tekstVanVeld(veld)) : [];
};

// Waar/Niet waar is per definitie hetzelfde tweetal opties; die lengtes zeggen
// niets over de bouwer en tellen dus niet mee in de lengtemeting.
const isWaarNietWaarPaar = (options) =>
  options.length === 2 &&
  ['waar', 'niet waar'].every((tekst) => options.some((optie) => String(optie.text || '').trim().toLowerCase() === tekst));

// De sleutel wordt op de RUWE seedopties gelezen, niet op de genormaliseerde.
// normalizeChoiceAnswer repareert een item zonder goed antwoord namelijk
// stilletjes door optie 1 goed te rekenen (assessmentBlockUtils.js), en vult
// een lege optietekst aan tot "Antwoord N". Precies de patronen die we willen
// vangen zouden dus onzichtbaar zijn als we alleen naar het genormaliseerde
// item keken.
const ruweOptiesVan = (rawItem = {}) =>
  (Array.isArray(rawItem.answer?.options) && rawItem.answer.options.length > 0
    ? rawItem.answer.options
    : Array.isArray(rawItem.options)
      ? rawItem.options
      : []
  ).map((optie) => ({ text: String(optie?.text ?? '').trim(), correct: optie?.correct === true }));

const leerdoelVanVraag = (rawItem = {}) =>
  normaliseerLeerdoel(rawItem?.taxonomy?.learningGoal || rawItem?.leerdoel || '');

// ---------------------------------------------------------------------------
// Context: één leerweg, klaargelegd zodat elke controle er direct in kan lezen.
// ---------------------------------------------------------------------------

export const bouwControleContext = ({ niveau = '', paragrafen = [], contentBlocks = [], checkpointCodes = [] } = {}) => {
  const checkpointSet = new Set(checkpointCodes);
  const blokkenPerParagraaf = new Map();
  for (const block of contentBlocks) {
    if (!blokkenPerParagraaf.has(block.paragraafId)) blokkenPerParagraaf.set(block.paragraafId, []);
    blokkenPerParagraaf.get(block.paragraafId).push(block);
  }

  const rijen = paragrafen
    .map((paragraaf) => {
      const blocks = (blokkenPerParagraaf.get(paragraaf.id) || [])
        .slice()
        .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

      const assessmentBlock = blocks.find((block) => block.type === 'quiz' || block.type === 'toets') || null;
      const isCheckpoint = checkpointSet.has(paragraaf.code)
        ? true
        : checkpointCodes.length > 0
          ? false
          : blocks.some((block) => block.type === 'toets');

      // Het EERSTE checkblok: het blok met de startvragen, dat vóór de theorie
      // staat. Een vraag ná de uitleg is een navraag en telt niet.
      const eersteTheorie = blocks.findIndex((block) => block.type === 'theory');
      const checkBlock =
        blocks.find((block) => block.type === 'question' && /-question-check$/.test(String(block.id))) ||
        blocks.find(
          (block, index) => block.type === 'question' && (eersteTheorie === -1 || index < eersteTheorie)
        ) ||
        null;

      const oefenBlokken = new Map();
      for (const block of blocks) {
        const match = /-question-oefenen-([a-z]+)$/.exec(String(block.id));
        if (match) oefenBlokken.set(match[1], block);
      }

      const vragen = (Array.isArray(assessmentBlock?.content?.items) ? assessmentBlock.content.items : []).map(
        (raw, index) => ({
          index,
          raw,
          item: normalizeAssessmentItem(raw, index),
          label: `${paragraaf.code} ${assessmentBlock.type} vraag ${index + 1}`
        })
      );

      return {
        niveau,
        id: paragraaf.id,
        code: paragraaf.code,
        hoofdstuk: hoofdstukVanCode(paragraaf.code),
        hoofdstukId: paragraaf.hoofdstukId,
        volgnummer: paragraafVolgnummer(paragraaf.code),
        optioneel: paragraaf.optioneel === true,
        checkpoint: isCheckpoint,
        learningGoals: Array.isArray(paragraaf.learningGoals) ? paragraaf.learningGoals.filter(Boolean) : [],
        blocks,
        checkBlock,
        oefenBlokken,
        assessmentBlock,
        vragen
      };
    })
    .sort((a, b) => a.hoofdstuk - b.hoofdstuk || a.volgnummer - b.volgnummer);

  const perHoofdstuk = new Map();
  for (const rij of rijen) {
    if (!perHoofdstuk.has(rij.hoofdstuk)) perHoofdstuk.set(rij.hoofdstuk, []);
    perHoofdstuk.get(rij.hoofdstuk).push(rij);
  }

  return { niveau, paragrafen: rijen, perHoofdstuk };
};

// ---------------------------------------------------------------------------
// 1. STARTVRAAG PER LEERDOEL (95 keer gemeld)
//
// Startvragen leveren winst op de bevraagde stof, maar dat effect straalt niet
// uit naar stof waar niet naar gevraagd is. Twee steekproefvragen voor drie
// leerdoelen laten er dus één onbevraagd. Elk leerdoel krijgt zijn eigen vraag,
// en die vraag hangt aan dat leerdoel zodat het aanwijsbaar is.
// ---------------------------------------------------------------------------

export const controleerStartvragenPerLeerdoel = (context) => {
  const bevindingen = [];
  for (const paragraaf of context.paragrafen) {
    if (paragraaf.learningGoals.length === 0) continue;

    if (!paragraaf.checkBlock) {
      bevindingen.push(
        bevinding(
          'startvraag',
          paragraaf,
          `geen startcheckblok vóór de theorie; de ${paragraaf.learningGoals.length} leerdoelen krijgen dus geen enkele startvraag`
        )
      );
      continue;
    }

    const velden = oefenveldenVan(paragraaf.checkBlock);
    if (velden.length === 0) {
      bevindingen.push(
        bevinding('startvraag', paragraaf, `startcheck ${paragraaf.checkBlock.id} bevat geen enkele startvraag`)
      );
      continue;
    }

    const bevraagd = new Set(velden.map((veld) => normaliseerLeerdoel(veld.learningGoal)).filter(Boolean));
    if (bevraagd.size === 0) {
      bevindingen.push(
        bevinding(
          'startvraag',
          paragraaf,
          `${velden.length} startvragen maar geen enkele noemt een leerdoel; ` +
            'zet in elk veld learningGoal op het leerdoel dat die vraag ophaalt'
        )
      );
      continue;
    }

    const zonderStartvraag = paragraaf.learningGoals.filter((goal) => !bevraagd.has(normaliseerLeerdoel(goal)));
    if (zonderStartvraag.length) {
      bevindingen.push(
        bevinding(
          'startvraag',
          paragraaf,
          `${zonderStartvraag.length} van de ${paragraaf.learningGoals.length} leerdoelen heeft geen eigen startvraag ` +
            `(${paragraaf.checkBlock.id} heeft er ${velden.length}): ` +
            zonderStartvraag.map((goal) => `"${goal}"`).join(' en ')
        )
      );
    }
  }
  return bevindingen;
};

// ---------------------------------------------------------------------------
// 2. ANTWOORD NIET TE RADEN OP LENGTE (58 keer gemeld)
//
// Een bouwer die het goede antwoord de volledige verklarende zin geeft en de
// afleiders kort laat, maakt zijn quiz te halen zonder de stof te kennen. Per
// blok geteld, want een leerling maakt één blok tegelijk.
// ---------------------------------------------------------------------------

export const controleerAntwoordlengte = (context) => {
  const bevindingen = [];
  for (const paragraaf of context.paragrafen) {
    if (!paragraaf.assessmentBlock || paragraaf.vragen.length === 0) continue;

    let meetbaar = 0;
    let langste = 0;
    const verklappers = [];

    for (const { item, label } of paragraaf.vragen) {
      if (item.type === 'open') continue;
      const options = (item.options || []).map((optie) => ({ ...optie, text: String(optie.text || '').trim() }));
      if (options.length < MIN_CLOSED_OPTIONS || isWaarNietWaarPaar(options)) continue;

      const goede = options.find((optie) => optie.correct === true);
      if (!goede) continue;

      meetbaar += 1;
      const afleiders = options.filter((optie) => optie !== goede).map((optie) => optie.text.length);
      const langsteAfleider = Math.max(0, ...afleiders);
      // Alleen STRIKT langer telt: bij gelijke lengte kun je er niets uit raden.
      if (goede.text.length > langsteAfleider) {
        langste += 1;
        verklappers.push(label);
      }
    }

    if (meetbaar < MIN_GESLOTEN_VOOR_LENGTEMETING) continue;
    const aandeel = langste / meetbaar;
    if (aandeel > MAX_LANGSTE_GOED_AANDEEL) {
      bevindingen.push(
        bevinding(
          'antwoordlengte',
          paragraaf,
          `in de ${paragraaf.assessmentBlock.type} is het goede antwoord ${langste} van de ${meetbaar} keer het langste ` +
            `(${Math.round(aandeel * 100)}%); maximaal ${Math.round(MAX_LANGSTE_GOED_AANDEEL * 100)}%. ` +
            `Te raden zonder lezen bij: ${verklappers.join(', ')}. ` +
            'Zet de redengevende bijzin in explanation of maak de afleiders even lang.'
        )
      );
    }
  }
  return bevindingen;
};

// ---------------------------------------------------------------------------
// 3. TERUGKEERVRAGEN (42 keer gemeld)
//
// Spreiden is een van de twee technieken waar de blauwdruk hard bewijs voor
// heeft. Elke afsluitquiz vanaf de tweede paragraaf van een hoofdstuk haalt
// daarom minstens één leerdoel uit een EERDERE paragraaf op.
// ---------------------------------------------------------------------------

export const controleerTerugkeervragen = (context) => {
  const bevindingen = [];
  for (const [hoofdstuk, rijen] of context.perHoofdstuk.entries()) {
    // Per leerdoel: het laagste volgnummer van de paragraaf waar het bij hoort.
    const eigenaarVan = new Map();
    for (const rij of rijen) {
      for (const goal of rij.learningGoals) {
        const sleutel = normaliseerLeerdoel(goal);
        if (!sleutel) continue;
        const bestaand = eigenaarVan.get(sleutel);
        if (bestaand === undefined || rij.volgnummer < bestaand) eigenaarVan.set(sleutel, rij.volgnummer);
      }
    }

    for (const paragraaf of rijen) {
      if (paragraaf.checkpoint) continue; // de hoofdstuktoets valt onder controle 4
      if (!paragraaf.assessmentBlock || paragraaf.vragen.length === 0) continue;
      const eerdere = rijen.filter((rij) => rij.volgnummer < paragraaf.volgnummer && !rij.checkpoint);
      if (eerdere.length === 0) continue; // de eerste paragraaf heeft niets om op terug te kijken

      const eigenDoelen = new Set(paragraaf.learningGoals.map((goal) => normaliseerLeerdoel(goal)));
      const terugkeer = paragraaf.vragen.filter(({ raw }) => {
        const leerdoel = leerdoelVanVraag(raw);
        if (!leerdoel || eigenDoelen.has(leerdoel)) return false;
        const eigenaar = eigenaarVan.get(leerdoel);
        return eigenaar !== undefined && eigenaar < paragraaf.volgnummer;
      });

      if (terugkeer.length === 0) {
        bevindingen.push(
          bevinding(
            'terugkeervraag',
            paragraaf,
            `de afsluit${paragraaf.assessmentBlock.type} van deze paragraaf haalt geen enkel leerdoel uit een eerdere ` +
              `paragraaf van hoofdstuk ${hoofdstuk} op (${eerdere.map((rij) => rij.code).join(', ')}); ` +
              'spreiden vraagt minstens één terugkeervraag'
          )
        );
      }
    }
  }
  return bevindingen;
};

// ---------------------------------------------------------------------------
// 4. TOETSDEKKING (32 keer gemeld)
//
// Een hoofdstuktoets bevraagt elk leerdoel van het hoofdstuk minstens één keer.
// De leerdoelen van de vrijwillige plusparagraaf horen er juist NIET in: wie de
// plus overslaat mag niets missen dat later getoetst wordt.
// ---------------------------------------------------------------------------

export const controleerToetsdekking = (context) => {
  const bevindingen = [];
  for (const [hoofdstuk, rijen] of context.perHoofdstuk.entries()) {
    const toetsParagraaf = rijen.find((rij) => rij.checkpoint && rij.assessmentBlock);
    if (!toetsParagraaf || toetsParagraaf.vragen.length === 0) continue;

    const verplicht = new Map(); // genormaliseerd leerdoel -> originele tekst
    const verboden = new Map(); // genormaliseerd leerdoel -> paragraafcode
    for (const rij of rijen) {
      for (const goal of rij.learningGoals) {
        const sleutel = normaliseerLeerdoel(goal);
        if (!sleutel) continue;
        if (rij.optioneel) verboden.set(sleutel, rij.code);
        else if (!verplicht.has(sleutel)) verplicht.set(sleutel, goal);
      }
    }

    const bevraagd = new Set(toetsParagraaf.vragen.map(({ raw }) => leerdoelVanVraag(raw)).filter(Boolean));

    const ontbreekt = [...verplicht.entries()].filter(([sleutel]) => !bevraagd.has(sleutel));
    if (ontbreekt.length) {
      bevindingen.push(
        bevindingHoofdstuk(
          'toetsdekking',
          context.niveau,
          hoofdstuk,
          toetsParagraaf.code,
          `de hoofdstuktoets bevraagt ${ontbreekt.length} van de ${verplicht.size} verplichte leerdoelen van hoofdstuk ` +
            `${hoofdstuk} niet: ${ontbreekt.map(([, tekst]) => `"${tekst}"`).join(' | ')}`
        )
      );
    }

    const tenOnrechte = [...bevraagd].filter((sleutel) => verboden.has(sleutel));
    if (tenOnrechte.length) {
      bevindingen.push(
        bevindingHoofdstuk(
          'toetsdekking',
          context.niveau,
          hoofdstuk,
          toetsParagraaf.code,
          `de hoofdstuktoets bevraagt ${tenOnrechte.length} leerdoel(en) van de vrijwillige plusparagraaf ` +
            `${[...new Set(tenOnrechte.map((sleutel) => verboden.get(sleutel)))].join(', ')}: ` +
            `${tenOnrechte.map((sleutel) => `"${sleutel}"`).join(' | ')}. ` +
            'Een plusparagraaf is geen voorwaarde om verder te mogen.'
        )
      );
    }
  }
  return bevindingen;
};

// ---------------------------------------------------------------------------
// 5. KAPOTTE EN DUBBELE VRAGEN (12 keer gemeld)
//
// Een gesloten vraag zonder goed antwoord wordt door de app stil gerepareerd
// door optie 1 goed te rekenen; een lege optietekst wordt stil aangevuld tot
// "Antwoord N". Beide kijken we daarom op de RUWE seedopties na. En binnen een
// hoofdstuk mogen twee vragen niet vrijwel hetzelfde vragen: dan is de tweede
// geen tweede meetmoment maar dezelfde vraag opnieuw.
// ---------------------------------------------------------------------------

export const controleerVragenIntegriteit = (context) => {
  const bevindingen = [];

  for (const paragraaf of context.paragrafen) {
    for (const { raw, item, label } of paragraaf.vragen) {
      const prompt = String(item.prompt || '').trim();
      if (!prompt) bevindingen.push(bevinding('vraagintegriteit', paragraaf, `${label}: lege vraagtekst`));

      if (item.type === 'open') {
        const modelAnswer = String(item.answer?.modelAnswer || '').trim();
        if (!modelAnswer) {
          bevindingen.push(
            bevinding('vraagintegriteit', paragraaf, `${label}: open vraag zonder modelAnswer, dus niet na te kijken`)
          );
        }
        continue;
      }

      const ruw = ruweOptiesVan(raw);
      const goed = ruw.filter((optie) => optie.correct).length;
      if (ruw.length > 0 && goed === 0) {
        bevindingen.push(
          bevinding(
            'vraagintegriteit',
            paragraaf,
            `${label}: geen enkele optie staat als goed antwoord gemarkeerd; de app rekent dan stil de bovenste goed`
          )
        );
      }
      if (ruw.length > 0 && goed === ruw.length) {
        bevindingen.push(
          bevinding('vraagintegriteit', paragraaf, `${label}: alle opties staan als goed antwoord gemarkeerd`)
        );
      }
      for (const [index, optie] of ruw.entries()) {
        if (!optie.text) {
          bevindingen.push(
            bevinding('vraagintegriteit', paragraaf, `${label}: antwoordoptie ${index + 1} heeft geen tekst`)
          );
        }
      }
    }
  }

  // Dubbele vragen binnen één hoofdstuk. De hoofdstuktoets mag een leerdoel uit
  // een eerdere paragraaf ophalen, maar niet met exact dezelfde vraagzin.
  for (const [hoofdstuk, rijen] of context.perHoofdstuk.entries()) {
    const prompts = [];
    for (const paragraaf of rijen) {
      for (const { item, label } of paragraaf.vragen) {
        const genormaliseerd = normaliseerPrompt(item.prompt);
        if (!genormaliseerd) continue;
        prompts.push({ paragraaf, label, genormaliseerd, woorden: woordenVan(genormaliseerd).length });
      }
    }

    for (let i = 0; i < prompts.length; i += 1) {
      for (let j = i + 1; j < prompts.length; j += 1) {
        const links = prompts[i];
        const rechts = prompts[j];
        if (links.genormaliseerd === rechts.genormaliseerd) {
          bevindingen.push(
            bevindingHoofdstuk(
              'vraagintegriteit',
              context.niveau,
              hoofdstuk,
              rechts.paragraaf.code,
              `${rechts.label} stelt woordelijk dezelfde vraag als ${links.label}`
            )
          );
          continue;
        }
        if (links.woorden < MIN_WOORDEN_VOOR_GELIJKENIS || rechts.woorden < MIN_WOORDEN_VOOR_GELIJKENIS) continue;
        const gelijkenis = promptGelijkenis(links.genormaliseerd, rechts.genormaliseerd);
        if (gelijkenis >= MAX_PROMPT_GELIJKENIS) {
          bevindingen.push(
            bevindingHoofdstuk(
              'vraagintegriteit',
              context.niveau,
              hoofdstuk,
              rechts.paragraaf.code,
              `${rechts.label} is voor ${Math.round(gelijkenis * 100)}% dezelfde vraag als ${links.label}`
            )
          );
        }
      }
    }
  }

  return bevindingen;
};

// ---------------------------------------------------------------------------
// 6. OEFENLAAG GEVULD (7 keer gemeld)
//
// Zonder oefenblok is de eerste opgave met feedback die de leerling ziet meteen
// de afsluitquiz, en dan is er tussen voordoen en beoordelen niets geoefend.
// Samen oefenen (Digidocent aan) en zelf oefenen (Digidocent uit) zijn twee
// aparte stappen; beide moeten gevuld zijn.
// ---------------------------------------------------------------------------

export const controleerOefenlaag = (context) => {
  const bevindingen = [];
  for (const paragraaf of context.paragrafen) {
    if (paragraaf.checkpoint) continue;

    const leeg = [];
    for (const groep of ['samen', 'zelf']) {
      const block = paragraaf.oefenBlokken.get(groep);
      if (!block || oefenveldenVan(block).length === 0) leeg.push(groep);
    }

    if (leeg.length) {
      bevindingen.push(
        bevinding(
          'oefenlaag',
          paragraaf,
          `de oefenlaag is leeg voor ${leeg.join(' en ')}; een gewone paragraaf heeft naast de quiz ook opgaven om ` +
            'samen te oefenen en om zelf te oefenen (opties.oefenen in het structuurbestand)'
        )
      );
    }
  }
  return bevindingen;
};

// ---------------------------------------------------------------------------
// Alles in één keer, in de volgorde waarin de zes hierboven staan.
// ---------------------------------------------------------------------------

export const CONTROLES = [
  controleerStartvragenPerLeerdoel,
  controleerAntwoordlengte,
  controleerTerugkeervragen,
  controleerToetsdekking,
  controleerVragenIntegriteit,
  controleerOefenlaag
];

export const mechanischeControles = (invoer) => {
  const context = invoer && invoer.paragrafen && invoer.perHoofdstuk ? invoer : bouwControleContext(invoer);
  return CONTROLES.flatMap((controle) => controle(context));
};

// Per hoofdstuk en per soort tellen, zodat een bouwer in het rapport meteen
// ziet waar het misgaat in plaats van een lijst van honderd losse regels.
export const telBevindingen = (bevindingen = []) => {
  const perSoort = new Map();
  const perHoofdstuk = new Map();
  for (const item of bevindingen) {
    perSoort.set(item.soort, (perSoort.get(item.soort) || 0) + 1);
    if (!perHoofdstuk.has(item.hoofdstuk)) perHoofdstuk.set(item.hoofdstuk, new Map());
    const rij = perHoofdstuk.get(item.hoofdstuk);
    rij.set(item.soort, (rij.get(item.soort) || 0) + 1);
  }
  return { totaal: bevindingen.length, perSoort, perHoofdstuk };
};
