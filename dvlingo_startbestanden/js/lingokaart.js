/*
 * Digitale Vaardigheden Lingo - js/lingokaart.js
 * ------------------------------------------------------------------
 * De lingokaart en de ballenbak, puur: geen DOM, geen timers, geen
 * geluid, geen localStorage, en geen willekeur die je niet kunt
 * vastzetten. Alles is los te testen (zie js/lingokaart.test.html).
 *
 * De toevalsbron wordt net als in js/core.js meegegeven: elke functie
 * die iets trekt neemt een rng (een functie die 0 <= x < 1 geeft). Laat
 * je hem weg, dan wordt er een verse gemaakt. Met DVL.Kaart.maakWillekeur(zaad)
 * krijg je bij hetzelfde zaad altijd dezelfde reeks.
 *
 * Onderscheid dat je scherp moet houden:
 *
 *   SESSIE (blijft het hele spel bestaan)
 *     - de kaart zelf, en welke vakjes zijn doorgestreept
 *     - groenVerzameld en groenBonusUitgekeerd
 *     - het aantal behaalde LINGO's
 *     - de trekkingen die nog over zijn in de lopende ballenfase
 *
 *   KAART (wordt bij LINGO in zijn geheel vervangen)
 *     - de 25 getallen
 *     - de 8 startvakjes
 *     - de bak: de nummerballen, de vraagbal en de drie rode ballen
 *       (de groene ballen liggen in dezelfde bak, maar hoeveel het er
 *        zijn volgt uit de groene teller van de sessie: 3 - groenVerzameld)
 *
 * nieuweKaart(sessie) vervangt dus uitsluitend sessie.kaart. De groene
 * teller, de al uitgekeerde groene bonus, het aantal LINGO's en de
 * resterende trekkingen blijven staan.
 *
 * Alles in een sessie is platte data (getallen, teksten, lijsten,
 * ja/nee), dus JSON.stringify en JSON.parse volstaan om te bewaren.
 */
(function (window) {
  "use strict";

  var DVL = (window.DVL = window.DVL || {});

  /* ================================================================
   * Vaste maten
   * ================================================================ */

  var ZIJDE = 5;                 /* de kaart is 5 bij 5 */
  var AANTAL_VAKJES = 25;
  var AANTAL_STARTVAKJES = 8;    /* vooraf doorgestreept bij een nieuwe kaart */
  var AANTAL_ROOD = 3;
  var GROEN_NODIG = 3;           /* bij drie groene ballen valt de bonus */
  var PER_GROEP_MINSTENS = 3;    /* elke getalgroep levert er minstens drie */
  var GROEPEN_MET_VIER = 4;      /* en vier willekeurige groepen een vierde */

  /* De zeven getalgroepen van de kaart. Let op de laatste: die loopt
     tot en met 70 en is dus een getal groter dan de andere. */
  var GROEPEN = [
    { van: 1, tot: 9 },
    { van: 10, tot: 19 },
    { van: 20, tot: 29 },
    { van: 30, tot: 39 },
    { van: 40, tot: 49 },
    { van: 50, tot: 59 },
    { van: 60, tot: 70 }
  ];

  /* De soorten ballen die in de bak kunnen liggen. */
  var BAL_NUMMER = "nummer";
  var BAL_VRAAG = "vraag";
  var BAL_GROEN = "groen";
  var BAL_ROOD = "rood";

  /* ================================================================
   * Hulpstukken
   * ================================================================ */

  /**
   * Kleine, vastzetbare toevalsgenerator (mulberry32), dezelfde als in
   * js/core.js. Staat core.js al geladen, dan gebruiken we die, zodat er
   * maar een bron van willekeur is; anders staat hier een gelijke kopie
   * zodat lingokaart.js ook op zichzelf werkt.
   */
  function eigenWillekeur(zaad) {
    var t = (typeof zaad === "number" ? zaad : Date.now()) >>> 0;
    return function () {
      t = (t + 0x6d2b79f5) >>> 0;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function maakWillekeur(zaad) {
    if (DVL.Core && typeof DVL.Core.maakWillekeur === "function") {
      return DVL.Core.maakWillekeur(zaad);
    }
    return eigenWillekeur(zaad);
  }

  /** Zorgt dat er altijd een bruikbare toevalsbron is. */
  function bron(rng) {
    return typeof rng === "function" ? rng : maakWillekeur();
  }

  /** Fisher-Yates; geeft een nieuwe lijst terug, laat het origineel staan. */
  function schud(lijst, rng) {
    var toeval = bron(rng);
    var kopie = lijst.slice();
    for (var i = kopie.length - 1; i > 0; i--) {
      var j = Math.floor(toeval() * (i + 1));
      var tussen = kopie[i];
      kopie[i] = kopie[j];
      kopie[j] = tussen;
    }
    return kopie;
  }

  /** De lijst [van, van+1, ... tot]. */
  function reeks(van, tot) {
    var uit = [];
    for (var n = van; n <= tot; n++) uit.push(n);
    return uit;
  }

  /** Diepe kopie van platte data. */
  function kopieer(waarde) {
    return JSON.parse(JSON.stringify(waarde));
  }

  function oplopend(a, b) { return a - b; }

  /** In welke van de zeven groepen valt dit getal? -1 als het er buiten valt. */
  function groepVan(getal) {
    for (var i = 0; i < GROEPEN.length; i++) {
      if (getal >= GROEPEN[i].van && getal <= GROEPEN[i].tot) return i;
    }
    return -1;
  }

  /* ================================================================
   * LINGO herkennen
   * ================================================================ */

  /** De twaalf lijnen van de kaart: 5 rijen, 5 kolommen, 2 diagonalen. */
  function alleLijnen() {
    var lijnen = [];
    var r, k, vakjes;
    for (r = 0; r < ZIJDE; r++) {
      vakjes = [];
      for (k = 0; k < ZIJDE; k++) vakjes.push(r * ZIJDE + k);
      lijnen.push({ soort: "rij", index: r, vakjes: vakjes });
    }
    for (k = 0; k < ZIJDE; k++) {
      vakjes = [];
      for (r = 0; r < ZIJDE; r++) vakjes.push(r * ZIJDE + k);
      lijnen.push({ soort: "kolom", index: k, vakjes: vakjes });
    }
    vakjes = [];
    for (r = 0; r < ZIJDE; r++) vakjes.push(r * ZIJDE + r);
    lijnen.push({ soort: "diagonaal", index: 0, vakjes: vakjes });
    vakjes = [];
    for (r = 0; r < ZIJDE; r++) vakjes.push(r * ZIJDE + (ZIJDE - 1 - r));
    lijnen.push({ soort: "diagonaal", index: 1, vakjes: vakjes });
    return lijnen;
  }

  var LIJNEN = alleLijnen();

  /** Maakt van een lijst vakjenummers een rij van 25 keer waar of onwaar. */
  function naarVlaggen(indexen) {
    var vlaggen = [];
    for (var i = 0; i < AANTAL_VAKJES; i++) vlaggen.push(false);
    for (var j = 0; j < indexen.length; j++) {
      var v = indexen[j];
      if (v >= 0 && v < AANTAL_VAKJES) vlaggen[v] = true;
    }
    return vlaggen;
  }

  /**
   * Zoekt de eerste volle lijn. Geeft { soort, index, vakjes } terug, of
   * null als er geen LINGO is. Werkt op een rij van 25 keer waar/onwaar,
   * of op een lijst met vakjenummers.
   */
  function vindLingo(doorgestreept) {
    var vlaggen = doorgestreept;
    if (!vlaggen) return null;
    /* Een lijst met vakjenummers mag ook. */
    if (vlaggen.length !== AANTAL_VAKJES || typeof vlaggen[0] === "number") {
      vlaggen = naarVlaggen(vlaggen);
    }
    for (var i = 0; i < LIJNEN.length; i++) {
      var vol = true;
      for (var j = 0; j < ZIJDE; j++) {
        if (!vlaggen[LIJNEN[i].vakjes[j]]) { vol = false; break; }
      }
      if (vol) {
        return { soort: LIJNEN[i].soort, index: LIJNEN[i].index, vakjes: LIJNEN[i].vakjes.slice() };
      }
    }
    return null;
  }

  /** Kort ja of nee: is er een LINGO? */
  function heeftLingo(doorgestreept) {
    return vindLingo(doorgestreept) !== null;
  }

  /* ================================================================
   * De getallen van een kaart
   * ================================================================ */

  /**
   * 25 unieke getallen van 1 t/m 70: elke groep minstens drie, en vier
   * willekeurig gekozen groepen krijgen er een vierde bij. Daarna alles
   * schudden, zodat de volgorde op de kaart niets over de groep verraadt.
   */
  function kiesGetallen(rng) {
    var toeval = bron(rng);
    var i;

    var perGroep = [];
    for (i = 0; i < GROEPEN.length; i++) perGroep.push(PER_GROEP_MINSTENS);
    var extra = schud(reeks(0, GROEPEN.length - 1), toeval).slice(0, GROEPEN_MET_VIER);
    for (i = 0; i < extra.length; i++) perGroep[extra[i]] = perGroep[extra[i]] + 1;

    var alle = [];
    for (i = 0; i < GROEPEN.length; i++) {
      var pot = schud(reeks(GROEPEN[i].van, GROEPEN[i].tot), toeval);
      alle = alle.concat(pot.slice(0, perGroep[i]));
    }
    return schud(alle, toeval);
  }

  /**
   * Acht startvakjes die samen nooit al een LINGO vormen. Lukt dat wel,
   * dan trekken we opnieuw. De kans daarop is ruim een procent, dus dit
   * is na een paar pogingen klaar; de bovengrens is er alleen zodat een
   * kapotte toevalsbron nooit tot een eindeloze lus leidt.
   */
  function kiesStartvakjes(rng) {
    var toeval = bron(rng);
    var VEILIG = [0, 1, 2, 3, 5, 6, 7, 8]; /* laatste redmiddel, vormt geen lijn */
    for (var poging = 0; poging < 500; poging++) {
      var gekozen = schud(reeks(0, AANTAL_VAKJES - 1), toeval).slice(0, AANTAL_STARTVAKJES);
      if (!heeftLingo(gekozen)) return gekozen.slice().sort(oplopend);
    }
    return VEILIG.slice();
  }

  /* ================================================================
   * De ballenbak
   * ================================================================ */

  /** De getallen van de vakjes die nog niet zijn doorgestreept. */
  function openNummers(kaart) {
    var uit = [];
    for (var i = 0; i < kaart.getallen.length; i++) {
      if (!kaart.doorgestreept[i]) uit.push(kaart.getallen[i]);
    }
    return uit;
  }

  /**
   * Vult de bak van een kaart: de nog open nummers (dat zijn er 17 bij
   * een verse kaart), een vraagbal, drie rode ballen en zoveel groene
   * ballen als er nog te verzamelen zijn.
   */
  function maakBak(kaart, groenVerzameld, rng) {
    var ballen = [];
    var open = openNummers(kaart);
    var i;
    for (i = 0; i < open.length; i++) ballen.push({ soort: BAL_NUMMER, getal: open[i] });
    ballen.push({ soort: BAL_VRAAG, getal: 0 });
    for (i = 0; i < AANTAL_ROOD; i++) ballen.push({ soort: BAL_ROOD, getal: 0 });
    var groen = GROEN_NODIG - (groenVerzameld || 0);
    if (groen < 0) groen = 0;
    for (i = 0; i < groen; i++) ballen.push({ soort: BAL_GROEN, getal: 0 });
    return schud(ballen, rng);
  }

  /** Hoeveel ballen van een soort liggen er nog in de bak? */
  function telSoort(sessie, soort) {
    var ballen = sessie.kaart.ballen;
    var aantal = 0;
    for (var i = 0; i < ballen.length; i++) if (ballen[i].soort === soort) aantal++;
    return aantal;
  }

  /* ================================================================
   * Kaart en sessie maken
   * ================================================================ */

  /**
   * Een verse kaart: getallen, acht doorgestreepte startvakjes en een
   * volle bak. groenVerzameld bepaalt alleen hoeveel groene ballen er
   * nog in de bak gaan.
   */
  function maakKaart(groenVerzameld, rng) {
    var toeval = bron(rng);
    var kaart = {
      getallen: kiesGetallen(toeval),
      doorgestreept: naarVlaggen([]),
      startvakjes: [],
      ballen: []
    };
    kaart.startvakjes = kiesStartvakjes(toeval);
    for (var i = 0; i < kaart.startvakjes.length; i++) {
      kaart.doorgestreept[kaart.startvakjes[i]] = true;
    }
    kaart.ballen = maakBak(kaart, groenVerzameld, toeval);
    return kaart;
  }

  /**
   * Een nieuwe sessie: een kaart, een lege groene teller en nul LINGO's.
   * opties: { zaad, rng }.
   */
  function nieuweSessie(opties) {
    var o = opties || {};
    var toeval = o.rng || maakWillekeur(o.zaad);
    return {
      versie: 1,
      kaart: maakKaart(0, toeval),
      groenVerzameld: 0,
      groenBonusUitgekeerd: false,
      lingos: 0,
      trekkingenOver: 0,
      faseGestopt: false,
      keuzeOpen: false
    };
  }

  /**
   * Vervangt uitsluitend de kaart: nieuwe getallen, nieuwe startvakjes
   * en een nieuwe bak. De groene teller, de al uitgekeerde groene bonus,
   * het aantal LINGO's en de resterende trekkingen blijven staan, zodat
   * een fase gewoon doorloopt op de nieuwe kaart.
   */
  function nieuweKaart(sessie, rng) {
    sessie.kaart = maakKaart(sessie.groenVerzameld, rng);
    sessie.keuzeOpen = false;
    return sessie;
  }

  /* ================================================================
   * De ballenfase
   * ================================================================ */

  /** Begint een ballenfase met een aantal trekkingen. */
  function startFase(sessie, trekkingen) {
    sessie.trekkingenOver = Math.max(0, trekkingen | 0);
    sessie.faseGestopt = false;
    sessie.keuzeOpen = false;
    return sessie;
  }

  /** Loopt de fase nog? */
  function faseLoopt(sessie) {
    return !sessie.faseGestopt && sessie.trekkingenOver > 0 && sessie.kaart.ballen.length > 0;
  }

  /** De vakjenummers die nog open staan (bruikbaar bij de vraagbal). */
  function openVakjes(sessie) {
    var uit = [];
    for (var i = 0; i < AANTAL_VAKJES; i++) if (!sessie.kaart.doorgestreept[i]) uit.push(i);
    return uit;
  }

  /** Op welk vakje staat dit getal? -1 als het er niet op staat. */
  function vakVanGetal(sessie, getal) {
    for (var i = 0; i < sessie.kaart.getallen.length; i++) {
      if (sessie.kaart.getallen[i] === getal) return i;
    }
    return -1;
  }

  /** Een leeg antwoord, zodat elk antwoord dezelfde velden heeft. */
  function leegAntwoord(soort) {
    return {
      ok: false,
      soort: soort,
      getal: 0,
      vak: -1,
      geraakt: false,
      alDoorgestreept: false,
      kostteTrekking: false,
      trekkingenOver: 0,
      lingo: false,
      lijn: null,
      groenVerzameld: 0,
      groenBonus: false,
      gestopt: false,
      kiezen: false
    };
  }

  /**
   * Streept een vakje door en kijkt of dat LINGO oplevert. Was het al
   * doorgestreept, dan gebeurt er niets (geraakt blijft onwaar).
   */
  function markeerVak(sessie, vak, antwoord) {
    antwoord.vak = vak;
    if (vak < 0 || vak >= AANTAL_VAKJES) return antwoord;
    antwoord.getal = sessie.kaart.getallen[vak];
    if (sessie.kaart.doorgestreept[vak]) {
      antwoord.alDoorgestreept = true;
      return antwoord;
    }
    sessie.kaart.doorgestreept[vak] = true;
    antwoord.geraakt = true;
    var lijn = vindLingo(sessie.kaart.doorgestreept);
    if (lijn) {
      antwoord.lingo = true;
      antwoord.lijn = lijn;
      sessie.lingos = sessie.lingos + 1;
    }
    return antwoord;
  }

  /**
   * Trekt een bal uit de bak en verwerkt hem meteen.
   *
   *   nummer  het vakje wordt doorgestreept; stond het er al door, dan
   *           gebeurt er niets, maar de trekking is wel gebruikt
   *   vraag   de speler mag zelf een open vakje kiezen (kiezen: waar);
   *           de echte bal van dat nummer blijft in de bak
   *   groen   de teller loopt op en bij drie valt de bonus, maar het
   *           kost geen trekking
   *   rood    de fase stopt onmiddellijk en de rest van de trekkingen
   *           vervalt
   *
   * Het antwoord vertelt precies wat er gebeurde; de sessie is bijgewerkt.
   */
  function trek(sessie, rng) {
    var antwoord;

    if (sessie.keuzeOpen) {
      antwoord = leegAntwoord("wacht");
      antwoord.kiezen = true;
      antwoord.trekkingenOver = sessie.trekkingenOver;
      return antwoord;
    }
    if (sessie.faseGestopt) {
      antwoord = leegAntwoord("gestopt");
      antwoord.gestopt = true;
      return antwoord;
    }
    if (sessie.trekkingenOver <= 0 || !sessie.kaart.ballen.length) {
      antwoord = leegAntwoord(sessie.kaart.ballen.length ? "op" : "leeg");
      antwoord.trekkingenOver = sessie.trekkingenOver;
      return antwoord;
    }

    var toeval = bron(rng);
    var plek = Math.floor(toeval() * sessie.kaart.ballen.length);
    if (plek < 0) plek = 0;
    if (plek >= sessie.kaart.ballen.length) plek = sessie.kaart.ballen.length - 1;
    var bal = sessie.kaart.ballen.splice(plek, 1)[0];

    antwoord = leegAntwoord(bal.soort);
    antwoord.ok = true;

    if (bal.soort === BAL_GROEN) {
      /* Groen kost geen trekking. */
      sessie.groenVerzameld = sessie.groenVerzameld + 1;
      if (sessie.groenVerzameld >= GROEN_NODIG && !sessie.groenBonusUitgekeerd) {
        sessie.groenBonusUitgekeerd = true;
        antwoord.groenBonus = true;
      }
    } else if (bal.soort === BAL_ROOD) {
      /* Rood beeindigt de fase; wat er nog aan trekkingen over was vervalt. */
      sessie.faseGestopt = true;
      sessie.trekkingenOver = 0;
      antwoord.gestopt = true;
    } else if (bal.soort === BAL_VRAAG) {
      sessie.trekkingenOver = sessie.trekkingenOver - 1;
      antwoord.kostteTrekking = true;
      sessie.keuzeOpen = true;
      antwoord.kiezen = true;
    } else {
      sessie.trekkingenOver = sessie.trekkingenOver - 1;
      antwoord.kostteTrekking = true;
      markeerVak(sessie, vakVanGetal(sessie, bal.getal), antwoord);
      antwoord.getal = bal.getal; /* ook als het getal niet op de kaart staat */
    }

    antwoord.trekkingenOver = sessie.trekkingenOver;
    antwoord.groenVerzameld = sessie.groenVerzameld;
    return antwoord;
  }

  /**
   * Het vakje dat de speler na een vraagbal aanwijst. Alleen een nog
   * open vakje mag; een dichtgestreept vakje of een onzinnig nummer
   * wordt geweigerd en de keuze blijft dan gewoon openstaan.
   * De echte bal van dat nummer blijft in de bak liggen.
   */
  function kiesVak(sessie, vak) {
    var antwoord = leegAntwoord("keuze");
    antwoord.trekkingenOver = sessie.trekkingenOver;
    antwoord.groenVerzameld = sessie.groenVerzameld;

    if (!sessie.keuzeOpen) {
      antwoord.vak = -1;
      return antwoord;
    }
    if (typeof vak !== "number" || vak < 0 || vak >= AANTAL_VAKJES) {
      antwoord.kiezen = true;
      return antwoord;
    }
    if (sessie.kaart.doorgestreept[vak]) {
      /* Niet toegestaan: de speler mag het opnieuw proberen. */
      antwoord.vak = vak;
      antwoord.alDoorgestreept = true;
      antwoord.kiezen = true;
      return antwoord;
    }

    antwoord.ok = true;
    markeerVak(sessie, vak, antwoord);
    sessie.keuzeOpen = false;
    return antwoord;
  }

  /* ================================================================
   * Voor het scherm
   * ================================================================ */

  /** De kaart als 25 vakjes met alles erbij wat een scherm nodig heeft. */
  function kaartModel(sessie) {
    var uit = [];
    for (var i = 0; i < AANTAL_VAKJES; i++) {
      uit.push({
        index: i,
        rij: Math.floor(i / ZIJDE),
        kolom: i % ZIJDE,
        getal: sessie.kaart.getallen[i],
        doorgestreept: !!sessie.kaart.doorgestreept[i],
        start: sessie.kaart.startvakjes.indexOf(i) !== -1
      });
    }
    return uit;
  }

  /** Hoeveel vakjes staan er doorgestreept? */
  function telDoorgestreept(sessie) {
    var aantal = 0;
    for (var i = 0; i < AANTAL_VAKJES; i++) if (sessie.kaart.doorgestreept[i]) aantal++;
    return aantal;
  }

  /* ================================================================
   * Naar buiten
   * ================================================================ */

  DVL.Kaart = {
    VERSIE: "1.0",

    ZIJDE: ZIJDE,
    AANTAL_VAKJES: AANTAL_VAKJES,
    AANTAL_STARTVAKJES: AANTAL_STARTVAKJES,
    AANTAL_ROOD: AANTAL_ROOD,
    GROEN_NODIG: GROEN_NODIG,
    GROEPEN: GROEPEN,
    LIJNEN: LIJNEN,
    BAL_NUMMER: BAL_NUMMER,
    BAL_VRAAG: BAL_VRAAG,
    BAL_GROEN: BAL_GROEN,
    BAL_ROOD: BAL_ROOD,

    maakWillekeur: maakWillekeur,
    schud: schud,
    kopieer: kopieer,
    groepVan: groepVan,

    vindLingo: vindLingo,
    heeftLingo: heeftLingo,
    naarVlaggen: naarVlaggen,

    kiesGetallen: kiesGetallen,
    kiesStartvakjes: kiesStartvakjes,
    maakKaart: maakKaart,
    maakBak: maakBak,
    openNummers: openNummers,
    telSoort: telSoort,

    nieuweSessie: nieuweSessie,
    nieuweKaart: nieuweKaart,
    startFase: startFase,
    faseLoopt: faseLoopt,
    openVakjes: openVakjes,
    vakVanGetal: vakVanGetal,
    trek: trek,
    kiesVak: kiesVak,

    kaartModel: kaartModel,
    telDoorgestreept: telDoorgestreept
  };
})(window);
