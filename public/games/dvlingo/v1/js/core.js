/*
 * Digitale Vaardigheden Lingo - js/core.js
 * ------------------------------------------------------------------
 * De volledige spellogica, puur: geen DOM, geen timers, geen
 * localStorage, geen willekeur die je niet kunt vastzetten. Alles is
 * los te testen (zie js/core.test.html).
 *
 * De klok wordt buiten deze laag bijgehouden; het spel meldt hier
 * alleen het resultaat, met tijdOp(staat) of met de resterende
 * milliseconden bij scoor(staat, ms).
 *
 * Afspraak over de staat: doeZet, gebruikHint, tijdOp en volgendWoord
 * werken de meegegeven staat bij en geven diezelfde staat ook terug.
 * Wie liever onveranderlijk werkt, geeft er DVL.Core.kopieer(staat) in.
 */
(function (window) {
  "use strict";

  var DVL = (window.DVL = window.DVL || {});

  /* ================================================================
   * Hulpstukken
   * ================================================================ */

  /* Letters met een accent terugbrengen tot A-Z, zodat een speler die
     KOPIEE of CAFE typt niet onnodig wordt afgestraft. */
  var ACCENTEN = {
    "\u00C0": "A", "\u00C1": "A", "\u00C2": "A", "\u00C3": "A", "\u00C4": "A", "\u00C5": "A",
    "\u00C7": "C",
    "\u00C8": "E", "\u00C9": "E", "\u00CA": "E", "\u00CB": "E",
    "\u00CC": "I", "\u00CD": "I", "\u00CE": "I", "\u00CF": "I",
    "\u00D1": "N",
    "\u00D2": "O", "\u00D3": "O", "\u00D4": "O", "\u00D5": "O", "\u00D6": "O",
    "\u00D9": "U", "\u00DA": "U", "\u00DB": "U", "\u00DC": "U",
    "\u00DD": "Y"
  };

  /** Maakt van willekeurige invoer een schoon woord in hoofdletters A-Z. */
  function normaliseer(tekst) {
    if (tekst === null || tekst === undefined) return "";
    var boven = String(tekst).toUpperCase();
    var uit = "";
    for (var i = 0; i < boven.length; i++) {
      var teken = boven.charAt(i);
      if (ACCENTEN[teken]) teken = ACCENTEN[teken];
      if (teken >= "A" && teken <= "Z") uit += teken;
    }
    return uit;
  }

  /**
   * Kleine, vastzetbare toevalsgenerator (mulberry32). Met hetzelfde
   * zaad krijg je altijd dezelfde reeks, zodat tests herhaalbaar zijn.
   */
  function maakWillekeur(zaad) {
    var t = (typeof zaad === "number" ? zaad : Date.now()) >>> 0;
    return function () {
      t = (t + 0x6d2b79f5) >>> 0;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** Fisher-Yates; geeft een nieuwe lijst terug, laat het origineel staan. */
  function schud(lijst, rng) {
    var kopie = lijst.slice();
    var toeval = rng || maakWillekeur();
    for (var i = kopie.length - 1; i > 0; i--) {
      var j = Math.floor(toeval() * (i + 1));
      var t = kopie[i];
      kopie[i] = kopie[j];
      kopie[j] = t;
    }
    return kopie;
  }

  /** Diepe kopie van een spelstaat (alleen platte data, dus dit volstaat). */
  function kopieer(staat) {
    return JSON.parse(JSON.stringify(staat));
  }

  /* ================================================================
   * Beoordelen van een poging
   * ================================================================ */

  /**
   * Vergelijkt een poging met het doelwoord en geeft per letterpositie
   * 'goed', 'aanwezig' of 'fout' terug.
   *
   * Dubbele letters gaan in twee ronden, precies zoals het contract eist:
   *   1. eerst alle letters die op de juiste plek staan (rood);
   *   2. pas daarna wordt de overgebleven voorraad letters uit het
   *      doelwoord verdeeld over de gele.
   * Zo krijgt een poging met twee keer een E nooit twee gele vakken als
   * het doelwoord die E maar een keer heeft.
   */
  function beoordeel(poging, doelwoord) {
    var p = normaliseer(poging);
    var d = normaliseer(doelwoord);
    var n = p.length;
    var m = d.length;
    var uit = new Array(n);
    var i;

    for (i = 0; i < n; i++) uit[i] = "fout";
    if (m === 0) return uit;

    /* Ronde 1: de goede posities, en tegelijk de voorraad opbouwen uit
       alle doelletters die nog niet vastgepind zijn. */
    var voorraad = Object.create(null);
    for (i = 0; i < m; i++) {
      var doelLetter = d.charAt(i);
      if (i < n && p.charAt(i) === doelLetter) {
        uit[i] = "goed";
      } else {
        voorraad[doelLetter] = (voorraad[doelLetter] || 0) + 1;
      }
    }

    /* Ronde 2: wat er over is verdelen over de gele, van links naar rechts. */
    for (i = 0; i < n; i++) {
      if (uit[i] === "goed") continue;
      var letter = p.charAt(i);
      if (voorraad[letter] > 0) {
        uit[i] = "aanwezig";
        voorraad[letter]--;
      }
    }
    return uit;
  }

  /** Is elke positie goed? Dan is het woord geraden. */
  function allesGoed(resultaat) {
    if (!resultaat || !resultaat.length) return false;
    for (var i = 0; i < resultaat.length; i++) {
      if (resultaat[i] !== "goed") return false;
    }
    return true;
  }

  /* ================================================================
   * Woordenboek
   * ================================================================ */

  /** Kent het woordenboek dit woord? Zonder woordenboek keuren we alles goed. */
  function kentWoord(woord, woordenboek) {
    var w = normaliseer(woord);
    if (!w) return false;
    if (woordenboek) {
      if (typeof woordenboek.has === "function") return woordenboek.has(w);
      if (Object.prototype.toString.call(woordenboek) === "[object Array]") {
        return woordenboek.indexOf(w) !== -1;
      }
      return woordenboek[w] === true;
    }
    if (DVL.WOORDENBOEKSET) return DVL.WOORDENBOEKSET[w] === true;
    if (typeof DVL.kentWoord === "function") return DVL.kentWoord(w);
    return true;
  }

  /**
   * Bevat het woordenboek uberhaupt woorden van deze lengte?
   *
   * De quizmaster mag woorden van 3 tot en met 9 letters invoeren,
   * terwijl ons woordenboek 5 tot en met 7 letters kent. Zonder deze
   * controle zou bij een woord van acht letters elke gok als onbekend
   * worden geweigerd en was het woord onraadbaar. Dekt het woordenboek
   * die lengte niet, dan laten we elke nette letterreeks toe.
   */
  var lengteBron = null;
  var lengteKaart = null;

  function dektLengte(lengte, woordenboek) {
    var bron = woordenboek || DVL.WOORDENBOEK || null;
    if (!bron) return false;
    if (lengteBron !== bron) {
      lengteBron = bron;
      lengteKaart = Object.create(null);
      var alle = [];
      if (Object.prototype.toString.call(bron) === "[object Array]") {
        alle = bron;
      } else if (typeof bron.forEach === "function") {
        bron.forEach(function (w) { alle.push(w); });
      } else {
        alle = Object.keys(bron);
      }
      for (var i = 0; i < alle.length; i++) lengteKaart[String(alle[i]).length] = true;
    }
    return lengteKaart[lengte] === true;
  }

  /** Staat dit woord ergens in de afspeellijst van dit spel? */
  function staatInAfspeellijst(staat, woord) {
    for (var i = 0; i < staat.woorden.length; i++) {
      if (staat.woorden[i].woord === woord) return true;
    }
    return false;
  }

  /* ================================================================
   * Een nieuw spel opzetten
   * ================================================================ */

  var MOEILIJKHEDEN = {
    makkelijk: { naam: "Makkelijk", lengtes: [5] },
    moeilijk: { naam: "Moeilijk", lengtes: [5, 6] },
    expert: { naam: "Expert", lengtes: [5, 6, 7] }
  };

  /* Elk woord krijgt evenveel tijd, ongeacht de lengte. Dat verving de
     oude tijd per woordlengte. */
  var TIJD_PER_WOORD = 60000;

  /**
   * De drie levels van een heel spel. Een level loopt niet tot een vast
   * aantal rondes maar tot een aantal goede woorden; fout geraden of
   * verlopen woorden tellen als gemist en het level gaat door met een
   * volgend woord.
   *
   * ballen = maxBallen - gemist, met een ondergrens van 1.
   */
  var LEVELS = {
    1: { level: 1, moeilijkheid: "makkelijk", lengtes: [5], nodig: 4, maxBallen: 4 },
    2: { level: 2, moeilijkheid: "moeilijk", lengtes: [5, 6], nodig: 3, maxBallen: 5 },
    3: { level: 3, moeilijkheid: "expert", lengtes: [5, 6, 7], nodig: 2, maxBallen: 5 }
  };

  /* Zoveel woorden zetten we boven het doel klaar, zodat een level ook
     doorspeelt als de speler er een paar mist. */
  var RESERVEWOORDEN = 20;

  var STANDAARD = {
    moeilijkheid: "expert",
    maxPogingen: 5,
    hints: 3,
    tijdPerWoord: TIJD_PER_WOORD,
    aantalWoorden: 6,
    schud: false,
    eigenLijst: false,
    nodig: 0,
    minimumWoorden: 0
  };

  /** Zet losse invoer om naar nette {woord, uitleg}-paren. */
  function schoonLijst(woorden) {
    var uit = [];
    if (!woorden || !woorden.length) return uit;
    for (var i = 0; i < woorden.length; i++) {
      var item = woorden[i];
      var woord = normaliseer(typeof item === "string" ? item : item && item.woord);
      if (woord.length < 2) continue;
      var uitleg = "";
      if (item && typeof item === "object" && typeof item.uitleg === "string") {
        uitleg = item.uitleg;
      }
      uit.push({ woord: woord, uitleg: uitleg });
    }
    return uit;
  }

  /**
   * De woordlengtes die bij het gekozen level horen, of null als er geen
   * level gekozen is.
   *
   * o.lengtes gaat voor: een lijst met lengtes is het level, en een
   * uitdrukkelijke null betekent "geen level". nieuwSpel zet dat veld
   * altijd zelf klaar, want daar is niet meer te zien of de aanroeper
   * moeilijkheid heeft meegegeven of dat de standaardwaarde is ingevuld.
   * Wie bouwAfspeellijst rechtstreeks aanroept, mag ook o.moeilijkheid
   * gebruiken.
   */
  function lengtesVoor(opties) {
    var o = opties || {};
    if (o.lengtes === null) return null;
    if (o.lengtes && o.lengtes.length) return o.lengtes.slice();
    if (MOEILIJKHEDEN[o.moeilijkheid]) return MOEILIJKHEDEN[o.moeilijkheid].lengtes.slice();
    return null;
  }

  /**
   * Houdt alleen de woorden over met een lengte die bij het level hoort.
   * Blijft er niets over, dan is een leeg spel de slechtste uitkomst: dan
   * geven we de hele lijst terug, ongefilterd.
   */
  function filterOpLengte(lijst, lengtes) {
    if (!lengtes || !lengtes.length) return lijst;
    var uit = [];
    for (var i = 0; i < lijst.length; i++) {
      if (lengtes.indexOf(lijst[i].woord.length) !== -1) uit.push(lijst[i]);
    }
    return uit.length ? uit : lijst;
  }

  /**
   * Bouwt de afspeellijst.
   *  - Een eigen lijst van de quizmaster wordt precies zo afgespeeld, in
   *    precies die volgorde. Het enige dat eraf gaat zijn de woorden die
   *    niet bij het gekozen level passen; schudden gebeurt alleen als de
   *    quizmaster daarom vraagt (o.schud). Het aantal rondes volgt dan dus
   *    de lijst en niet het level: alleen een uitdrukkelijke
   *    o.aantalWoorden groter dan nul kapt er nog iets vanaf, en nieuwSpel
   *    zet dat veld bij een eigen lijst zelf op nul.
   *  - De standaardlijst loopt op in woordlengte: 5, 6, 7, 5, 6, 7 ...
   *    binnen de gekozen moeilijkheid. Ook daar wordt o.schud gevolgd.
   *  - Levert het filteren op lengte niets op, dan spelen we de volledige
   *    lijst af in plaats van een leeg spel.
   */
  function bouwAfspeellijst(woorden, opties) {
    var o = opties || {};
    var lijst = schoonLijst(woorden);
    var rng = o.rng || maakWillekeur(o.zaad);
    var i;

    if (o.eigenLijst) {
      var eigen = filterOpLengte(lijst, lengtesVoor(o));
      if (o.schud) eigen = schud(eigen, rng);
      if (o.aantalWoorden > 0) eigen = eigen.slice(0, o.aantalWoorden);
      return vulAan(eigen, o, rng);
    }

    var lengtes = lengtesVoor(o) || MOEILIJKHEDEN.expert.lengtes;
    var bakken = {};
    for (i = 0; i < lengtes.length; i++) bakken[lengtes[i]] = [];
    for (i = 0; i < lijst.length; i++) {
      var bak = bakken[lijst[i].woord.length];
      if (bak) bak.push(lijst[i]);
    }
    /* De standaardlijst wordt altijd geschud. Hij heeft geen betekenisvolle
       volgorde - het is een voorraad van ruim vijftig woorden per lengte - en
       twee leerlingen naast elkaar horen niet dezelfde woorden in dezelfde
       volgorde te krijgen. De schudknop van de quizmaster gaat dus alleen over
       zijn eigen lijst, waar de volgorde wel iets betekent.
       Met een vast zaad blijft het schudden volledig herhaalbaar. */
    for (i = 0; i < lengtes.length; i++) {
      var l = lengtes[i];
      bakken[l] = schud(bakken[l], rng);
    }

    var uit = [];
    var beurt = 0;
    var maximum = o.aantalWoorden > 0 ? o.aantalWoorden : 1000;
    var leeg = false;
    while (uit.length < maximum && !leeg) {
      leeg = true;
      for (i = 0; i < lengtes.length && uit.length < maximum; i++) {
        var stapel = bakken[lengtes[i]];
        if (stapel.length > beurt) {
          uit.push(stapel[beurt]);
          leeg = false;
        }
      }
      beurt++;
    }
    /* Geen enkel woord van de juiste lengte? Dan liever de hele lijst dan
       een spel zonder woorden. */
    if (!uit.length) {
      uit = o.schud ? schud(lijst, rng) : lijst.slice();
      if (o.aantalWoorden > 0) uit = uit.slice(0, o.aantalWoorden);
    }
    return vulAan(uit, o, rng);
  }

  /**
   * Vult een te korte afspeellijst stil aan uit een reservelijst.
   *
   * Een level loopt tot een aantal goede woorden, dus een lijst van vier
   * woorden is te kort zodra de speler er een mist. De lijst van de
   * quizmaster wordt daarom aangevuld met de standaardlijst zodra hij
   * opraakt: zijn eigen woorden komen eerst en in zijn eigen volgorde, de
   * aanvulling komt er geschud achteraan en alleen in de woordlengtes van
   * dit level. Woorden die al in de lijst staan komen niet nog een keer.
   *
   * Zonder o.minimumWoorden of zonder o.aanvulling gebeurt er niets.
   */
  function vulAan(lijst, opties, rng) {
    var o = opties || {};
    var minimum = o.minimumWoorden > 0 ? o.minimumWoorden : 0;
    if (!minimum || lijst.length >= minimum) return lijst;

    var reserve = schoonLijst(o.aanvulling || []);
    if (!reserve.length) return lijst;

    var lengtes = lengtesVoor(o);
    if (lengtes && lengtes.length) {
      var passend = [];
      for (var p = 0; p < reserve.length; p++) {
        if (lengtes.indexOf(reserve[p].woord.length) !== -1) passend.push(reserve[p]);
      }
      reserve = passend;
    }
    reserve = schud(reserve, rng || maakWillekeur(o.zaad));

    var uit = lijst.slice();
    var gezien = Object.create(null);
    var i;
    for (i = 0; i < uit.length; i++) gezien[uit[i].woord] = true;
    for (i = 0; i < reserve.length && uit.length < minimum; i++) {
      if (gezien[reserve[i].woord]) continue;
      gezien[reserve[i].woord] = true;
      uit.push(reserve[i]);
    }
    return uit;
  }

  /* ================================================================
   * Levels: spelen tot een aantal goede woorden
   * ================================================================ */

  /** De gegevens van een level; een onbekend level wordt level 1. */
  function levelInfo(nummer) {
    return LEVELS[parseInt(nummer, 10)] || LEVELS[1];
  }

  /**
   * Hoeveel ballen levert dit level op? Het maximum van het level min het
   * aantal gemiste woorden, maar altijd minstens één: wie doorspeelt tot
   * het doel gehaald is, mag altijd trekken.
   */
  function verdiendeBallen(nummer, gemist) {
    var info = levelInfo(nummer);
    var kwijt = gemist > 0 ? Math.floor(gemist) : 0;
    return Math.max(1, info.maxBallen - kwijt);
  }

  /** Is het doel van dit level gehaald? */
  function levelGehaald(staat) {
    if (!staat || !(staat.nodig > 0)) return false;
    return staat.geraden >= staat.nodig;
  }

  /**
   * Een spelstaat voor één level: de woordlengtes van dat level, spelen
   * tot het aantal goede woorden van dat level, en 60 seconden per woord.
   * De lijst wordt ruim genomen (doel plus reserve) zodat gemiste woorden
   * het level niet vroegtijdig kunnen beëindigen.
   *
   * opties: alles wat nieuwSpel kent, plus aanvulling (de standaardlijst).
   */
  function nieuwLevel(nummer, opties) {
    var info = levelInfo(nummer);
    var o = opties || {};
    var samen = {};
    var sleutel;
    for (sleutel in o) {
      if (Object.prototype.hasOwnProperty.call(o, sleutel)) samen[sleutel] = o[sleutel];
    }
    samen.level = info.level;
    samen.moeilijkheid = info.moeilijkheid;
    samen.lengtes = info.lengtes.slice();
    samen.nodig = info.nodig;
    samen.tijdPerWoord = TIJD_PER_WOORD;
    samen.aantalWoorden = 0;                       /* geen dak: het doel telt, niet de rondes */
    if (!(samen.minimumWoorden > 0)) samen.minimumWoorden = info.nodig + RESERVEWOORDEN;
    if (!samen.aanvulling) samen.aanvulling = DVL.STANDAARDWOORDEN || [];
    return nieuwSpel(samen);
  }

  /**
   * Hoeveel rondes levert deze lijst echt op bij deze opties?
   *
   * Dit is met opzet dezelfde bouwAfspeellijst als het spel gebruikt, zodat
   * een scherm dat een aantal rondes belooft (het startscherm, de
   * quizmasterpagina) nooit iets anders kan zeggen dan wat er straks
   * gespeeld wordt. Ook de terugval "geen enkel woord van deze lengte, dan
   * de hele lijst" zit er dus vanzelf in.
   */
  function telRondes(woorden, opties) {
    return bouwAfspeellijst(woorden, opties).length;
  }

  /** Hoeveel tijd krijgt een woord van deze lengte? */
  function tijdVoor(opties, lengte) {
    var t = typeof opties.tijdFunctie === "function" ? opties.tijdFunctie : opties.tijdPerWoord;
    if (typeof t === "function") return Math.max(1000, Math.round(t(lengte)));
    if (t && typeof t === "object") {
      return Math.max(1000, Math.round(t[lengte] || STANDAARD.tijdPerWoord));
    }
    if (typeof t === "number" && t > 0) return Math.round(t);
    return STANDAARD.tijdPerWoord;
  }

  /** Zet de staat klaar voor het woord waar de index nu op staat. */
  function startWoord(staat) {
    var huidig = staat.woorden[staat.index];
    if (!huidig) {
      staat.status = "klaar";
      staat.afgelopen = true;
      staat.doel = "";
      staat.uitleg = "";
      staat.lengte = 0;
      staat.bekend = [];
      staat.pogingen = [];
      staat.rij = 0;
      return staat;
    }
    staat.doel = huidig.woord;
    staat.uitleg = huidig.uitleg || "";
    staat.lengte = huidig.woord.length;
    staat.ronde = staat.index + 1;
    staat.rij = 0;
    staat.pogingen = [];
    staat.hintsGebruikt = 0;
    staat.hintPosities = [];
    staat.mislukReden = "";
    staat.status = "bezig";
    staat.tijdPerWoord = tijdVoor(staat.opties, staat.lengte);

    /* De eerste letter staat altijd voor in de eerste rij. */
    staat.bekend = [];
    for (var i = 0; i < staat.lengte; i++) staat.bekend.push(null);
    staat.bekend[0] = staat.doel.charAt(0);
    return staat;
  }

  /**
   * Maakt een verse spelstaat.
   * opties: { woorden, moeilijkheid, eigenLijst, schud, zaad, rng,
   *           maxPogingen, hints, tijdPerWoord, aantalWoorden, woordenboek }
   */
  function nieuwSpel(opties) {
    var o = opties || {};
    var samen = {};
    var sleutel;
    for (sleutel in STANDAARD) {
      if (Object.prototype.hasOwnProperty.call(STANDAARD, sleutel)) samen[sleutel] = STANDAARD[sleutel];
    }
    for (sleutel in o) {
      if (Object.prototype.hasOwnProperty.call(o, sleutel) && o[sleutel] !== undefined) {
        samen[sleutel] = o[sleutel];
      }
    }
    /* Welk level is er echt gekozen? Dat moeten we hier vastleggen, want
       samen.moeilijkheid staat straks sowieso op de standaardwaarde en dan
       is niet meer te zien of de aanroeper een level noemde. Zonder level
       wordt een eigen lijst niet op woordlengte gefilterd. */
    samen.lengtes = lengtesVoor(o);
    if (!MOEILIJKHEDEN[samen.moeilijkheid]) samen.moeilijkheid = STANDAARD.moeilijkheid;
    if (samen.eigenLijst && o.aantalWoorden === undefined) samen.aantalWoorden = 0;
    if (!(samen.maxPogingen > 0)) samen.maxPogingen = STANDAARD.maxPogingen;
    if (!(samen.hints >= 0)) samen.hints = STANDAARD.hints;

    var bron = samen.woorden && samen.woorden.length ? samen.woorden : DVL.STANDAARDWOORDEN || [];
    var lijst = bouwAfspeellijst(bron, samen);

    /* In de staat bewaren we alleen wat we later nog nodig hebben, zodat
       de staat platte data blijft en gewoon te kopieren en te loggen is. */
    var bewaarde = {
      moeilijkheid: samen.moeilijkheid,
      maxPogingen: samen.maxPogingen,
      hints: samen.hints,
      tijdPerWoord: typeof samen.tijdPerWoord === "function" ? STANDAARD.tijdPerWoord : samen.tijdPerWoord,
      aantalWoorden: samen.aantalWoorden,
      eigenLijst: !!samen.eigenLijst,
      schud: !!samen.schud,
      nodig: samen.nodig > 0 ? Math.floor(samen.nodig) : 0,
      level: samen.level > 0 ? Math.floor(samen.level) : 0
    };
    /* De tijd per woord mag ook als functie van de woordlengte komen,
       via tijdPerWoord of via de kortere naam tijdFunctie. */
    if (typeof samen.tijdFunctie === "function") bewaarde.tijdFunctie = samen.tijdFunctie;
    else if (typeof samen.tijdPerWoord === "function") bewaarde.tijdFunctie = samen.tijdPerWoord;

    var staat = {
      opties: bewaarde,
      woordenboek: samen.woordenboek || null,
      woorden: lijst,
      totaal: lijst.length,
      index: 0,
      ronde: 1,
      doel: "",
      uitleg: "",
      lengte: 0,
      maxPogingen: samen.maxPogingen,
      tijdPerWoord: bewaarde.tijdPerWoord,
      moeilijkheid: samen.moeilijkheid,
      rij: 0,
      pogingen: [],
      bekend: [],
      hints: samen.hints,
      hintsGebruikt: 0,
      hintsTotaal: 0,
      hintPosities: [],
      status: "bezig",
      mislukReden: "",
      afgelopen: false,
      /* Een level loopt tot nodig goede woorden; nodig 0 betekent: gewoon
         de hele lijst afspelen, zoals de testmodus van de quizmaster. */
      level: bewaarde.level,
      nodig: bewaarde.nodig,
      levelKlaar: false,
      score: 0,
      rondeScores: [],
      geraden: 0,
      gemist: 0,
      ballen: 0,
      ongeldigePogingen: 0,
      opgelost: []
    };

    if (!lijst.length) {
      staat.status = "klaar";
      staat.afgelopen = true;
      return staat;
    }
    return startWoord(staat);
  }

  /* ================================================================
   * Spelen
   * ================================================================ */

  /** Het woord waar nu op geraden wordt, met zijn uitleg. */
  function huidigWoord(staat) {
    return staat.woorden[staat.index] || null;
  }

  /** De letters die al vaststaan; null betekent nog onbekend (witte stip). */
  function voorvulling(staat) {
    return (staat.bekend || []).slice();
  }

  /** Hoeveel pogingen heeft de speler nog over voor dit woord? */
  function pogingenOver(staat) {
    return Math.max(0, staat.maxPogingen - staat.rij);
  }

  /**
   * Keurt een poging zonder hem te spelen.
   * -> { geldig, reden, woord }
   * reden: '' | 'niet-bezig' | 'lengte' | 'onbekend'
   */
  function controleerPoging(staat, poging) {
    var w = normaliseer(poging);
    if (staat.status !== "bezig") return { geldig: false, reden: "niet-bezig", woord: w };
    if (w.length !== staat.lengte) return { geldig: false, reden: "lengte", woord: w };
    /* Het doelwoord zelf en de andere woorden uit deze lijst zijn altijd
       geldig, ook als de quizmaster iets invoerde dat wij niet kennen. */
    if (w === staat.doel || staatInAfspeellijst(staat, w)) {
      return { geldig: true, reden: "", woord: w };
    }
    if (dektLengte(staat.lengte, staat.woordenboek) && !kentWoord(w, staat.woordenboek)) {
      return { geldig: false, reden: "onbekend", woord: w };
    }
    return { geldig: true, reden: "", woord: w };
  }

  /**
   * Speelt een poging.
   * -> { staat, resultaat, geldig, reden, gewonnen, mislukt, woord }
   *
   * Een woord dat niet in de lijst staat kost geen poging: geldig is dan
   * false met reden 'onbekend', en de rij blijft staan (het spel laat de
   * rij schudden en de klok gewoon doorlopen).
   */
  function doeZet(staat, poging) {
    var keuring = controleerPoging(staat, poging);
    if (!keuring.geldig) {
      if (keuring.reden === "onbekend") staat.ongeldigePogingen++;
      return {
        staat: staat,
        resultaat: null,
        geldig: false,
        reden: keuring.reden,
        gewonnen: false,
        mislukt: false,
        woord: keuring.woord
      };
    }

    var woord = keuring.woord;
    var resultaat = beoordeel(woord, staat.doel);
    staat.pogingen.push({ woord: woord, resultaat: resultaat });
    staat.rij++;

    /* Goed geraden letters blijven staan en worden voorgevuld in de
       volgende rij; ze kunnen nooit meer verdwijnen. */
    for (var i = 0; i < resultaat.length; i++) {
      if (resultaat[i] === "goed") staat.bekend[i] = woord.charAt(i);
    }

    var gewonnen = allesGoed(resultaat);
    var mislukt = false;
    if (gewonnen) {
      staat.status = "gewonnen";
      staat.geraden++;
      staat.ballen++;
      staat.opgelost.push({ woord: staat.doel, uitleg: staat.uitleg, pogingen: staat.rij });
      if (levelGehaald(staat)) staat.levelKlaar = true;
    } else if (staat.rij >= staat.maxPogingen) {
      staat.status = "mislukt";
      staat.mislukReden = "pogingen";
      staat.gemist++;
      mislukt = true;
    }

    return {
      staat: staat,
      resultaat: resultaat,
      geldig: true,
      reden: "",
      gewonnen: gewonnen,
      mislukt: mislukt,
      woord: woord
    };
  }

  /**
   * De tijd is op: het woord is mislukt. Geen timer hier, alleen het
   * gevolg ervan, zodat het ook te testen is.
   */
  function tijdOp(staat) {
    if (staat.status !== "bezig") return staat;
    staat.status = "mislukt";
    staat.mislukReden = "tijd";
    staat.gemist++;
    return staat;
  }

  /**
   * Zet een hint in: onthult een letter die nog niet vaststaat.
   * Standaard de meest linkse onbekende positie; met een eigen kiezer
   * (posities, staat) -> positie kan het spel er iets anders van maken.
   * -> { staat, gelukt, positie, letter, reden }
   */
  function gebruikHint(staat, kiezer) {
    if (staat.status !== "bezig") {
      return { staat: staat, gelukt: false, positie: -1, letter: "", reden: "niet-bezig" };
    }
    if (staat.hints <= 0) {
      return { staat: staat, gelukt: false, positie: -1, letter: "", reden: "geen-hints" };
    }
    var open = [];
    for (var i = 0; i < staat.lengte; i++) {
      if (!staat.bekend[i]) open.push(i);
    }
    if (open.length === 0) {
      return { staat: staat, gelukt: false, positie: -1, letter: "", reden: "niets-te-onthullen" };
    }
    /* De laatste onbekende letter onthullen zou het hele woord weggeven;
       dat laten we niet toe. */
    if (open.length === 1) {
      return { staat: staat, gelukt: false, positie: -1, letter: "", reden: "laatste-letter" };
    }

    var positie = open[0];
    if (typeof kiezer === "function") {
      var keuze = kiezer(open.slice(), staat);
      if (open.indexOf(keuze) !== -1) positie = keuze;
    }

    staat.bekend[positie] = staat.doel.charAt(positie);
    staat.hintPosities.push(positie);
    staat.hints--;
    staat.hintsGebruikt++;
    staat.hintsTotaal++;
    return {
      staat: staat,
      gelukt: true,
      positie: positie,
      letter: staat.bekend[positie],
      reden: ""
    };
  }

  /* ================================================================
   * Score
   * ================================================================ */

  /**
   * Punten voor het woord dat zojuist is opgelost.
   * msResterend = de tijd die er nog op de balk stond.
   *
   * Minder pogingen levert meer op, meer resterende tijd levert meer op,
   * en elke ingezette hint kost punten. Een opgelost woord is altijd
   * minstens 10 punten waard.
   */
  function scoor(staat, msResterend) {
    if (!staat || staat.status !== "gewonnen") return 0;

    var maxTijd = staat.tijdPerWoord > 0 ? staat.tijdPerWoord : STANDAARD.tijdPerWoord;
    var ms = typeof msResterend === "number" && isFinite(msResterend) ? msResterend : 0;
    if (ms < 0) ms = 0;
    if (ms > maxTijd) ms = maxTijd;

    var basis = staat.lengte * 100;
    var gebruikt = staat.rij > 0 ? staat.rij : 1;
    var pogingBonus = (staat.maxPogingen - gebruikt + 1) * 60;
    var tijdBonus = Math.round((ms / maxTijd) * 300);
    var hintStraf = staat.hintsGebruikt * 75;

    return Math.max(10, Math.round(basis + pogingBonus + tijdBonus - hintStraf));
  }

  /** Telt de punten van dit woord op bij de spelscore en bewaart ze per ronde. */
  function verwerkScore(staat, msResterend) {
    var punten = scoor(staat, msResterend);
    staat.rondeScores.push({ ronde: staat.ronde, woord: staat.doel, punten: punten });
    staat.score += punten;
    return punten;
  }

  /* ================================================================
   * Doorschakelen
   * ================================================================ */

  /**
   * Naar het volgende woord. Is het doel van het level gehaald, of is er
   * geen woord meer, dan is dit level afgelopen.
   */
  function volgendWoord(staat) {
    if (staat.levelKlaar) {
      staat.status = "klaar";
      staat.afgelopen = true;
      return staat;
    }
    if (staat.index + 1 >= staat.woorden.length) {
      staat.index = staat.woorden.length;
      staat.status = "klaar";
      staat.afgelopen = true;
      return staat;
    }
    staat.index++;
    return startWoord(staat);
  }

  /* ================================================================
   * Bordmodel - puur, zodat het tekenen in game.js triviaal wordt
   * ================================================================ */

  /**
   * Het hele bord als data: maxPogingen rijen van lengte tegels, met per
   * tegel een letter en een van de klassen leeg/open/goed/aanwezig/fout.
   * De rij waar de speler nu in bezig is krijgt de voorgevulde letters.
   */
  function bordModel(staat, invoer) {
    var rijen = [];
    var getypt = normaliseer(invoer || "");
    for (var r = 0; r < staat.maxPogingen; r++) {
      var tegels = [];
      for (var k = 0; k < staat.lengte; k++) {
        if (r < staat.pogingen.length) {
          tegels.push({
            letter: staat.pogingen[r].woord.charAt(k),
            staat: staat.pogingen[r].resultaat[k]
          });
        } else if (r === staat.rij && staat.status === "bezig") {
          if (k < getypt.length) {
            tegels.push({ letter: getypt.charAt(k), staat: "open" });
          } else if (staat.bekend[k]) {
            tegels.push({ letter: staat.bekend[k], staat: "open" });
          } else {
            tegels.push({ letter: "", staat: "leeg" });
          }
        } else {
          tegels.push({ letter: "", staat: "leeg" });
        }
      }
      rijen.push(tegels);
    }
    return rijen;
  }

  /**
   * De stand van elke letter op het toetsenbord: 'goed' wint van
   * 'aanwezig', en 'aanwezig' wint van 'fout'.
   */
  function toetsenbordStand(staat) {
    var rang = { fout: 1, aanwezig: 2, goed: 3 };
    var stand = {};
    for (var p = 0; p < staat.pogingen.length; p++) {
      var poging = staat.pogingen[p];
      for (var i = 0; i < poging.woord.length; i++) {
        var letter = poging.woord.charAt(i);
        var nieuw = poging.resultaat[i];
        if (!stand[letter] || rang[nieuw] > rang[stand[letter]]) stand[letter] = nieuw;
      }
    }
    return stand;
  }

  /* ================================================================
   * Finale - bingokaart en ballen (ook puur)
   * ================================================================ */

  /** Een kaart van 5 kolommen van 5 getallen, zoals bij bingo. */
  function maakBingokaart(rng) {
    var toeval = rng || maakWillekeur();
    var kaart = [];
    for (var kolom = 0; kolom < 5; kolom++) {
      var pot = [];
      for (var n = kolom * 15 + 1; n <= kolom * 15 + 15; n++) pot.push(n);
      pot = schud(pot, toeval);
      for (var rij = 0; rij < 5; rij++) {
        kaart.push({ getal: pot[rij], rij: rij, kolom: kolom, aangekruist: false });
      }
    }
    kaart[12].aangekruist = true; /* het midden is altijd vrij */
    return kaart;
  }

  /** Trekt een bal die nog niet getrokken is en kruist hem eventueel aan. */
  function trekBal(kaart, getrokken, rng) {
    var toeval = rng || maakWillekeur();
    var al = getrokken || [];
    var pot = [];
    for (var n = 1; n <= 75; n++) {
      if (al.indexOf(n) === -1) pot.push(n);
    }
    if (!pot.length) return { getal: 0, raak: false };
    var getal = pot[Math.floor(toeval() * pot.length)];
    var raak = false;
    for (var i = 0; i < kaart.length; i++) {
      if (kaart[i].getal === getal) {
        kaart[i].aangekruist = true;
        raak = true;
      }
    }
    return { getal: getal, raak: raak };
  }

  /** Is er een volle rij, kolom of diagonaal? Dat is LINGO. */
  function heeftLingo(kaart) {
    function vak(rij, kolom) {
      for (var i = 0; i < kaart.length; i++) {
        if (kaart[i].rij === rij && kaart[i].kolom === kolom) return kaart[i].aangekruist;
      }
      return false;
    }
    var r, k, vol;
    for (r = 0; r < 5; r++) {
      vol = true;
      for (k = 0; k < 5; k++) if (!vak(r, k)) vol = false;
      if (vol) return true;
    }
    for (k = 0; k < 5; k++) {
      vol = true;
      for (r = 0; r < 5; r++) if (!vak(r, k)) vol = false;
      if (vol) return true;
    }
    vol = true;
    for (r = 0; r < 5; r++) if (!vak(r, r)) vol = false;
    if (vol) return true;
    vol = true;
    for (r = 0; r < 5; r++) if (!vak(r, 4 - r)) vol = false;
    return vol;
  }

  /* ================================================================
   * Naar buiten
   * ================================================================ */

  DVL.Core = {
    VERSIE: "1.1",
    MOEILIJKHEDEN: MOEILIJKHEDEN,
    STANDAARDOPTIES: STANDAARD,
    LEVELS: LEVELS,
    TIJD_PER_WOORD: TIJD_PER_WOORD,
    RESERVEWOORDEN: RESERVEWOORDEN,

    normaliseer: normaliseer,
    maakWillekeur: maakWillekeur,
    schud: schud,
    kopieer: kopieer,

    beoordeel: beoordeel,
    allesGoed: allesGoed,
    kentWoord: kentWoord,
    dektLengte: dektLengte,

    schoonLijst: schoonLijst,
    lengtesVoor: lengtesVoor,
    filterOpLengte: filterOpLengte,
    bouwAfspeellijst: bouwAfspeellijst,
    vulAan: vulAan,
    telRondes: telRondes,
    nieuwSpel: nieuwSpel,
    levelInfo: levelInfo,
    verdiendeBallen: verdiendeBallen,
    levelGehaald: levelGehaald,
    nieuwLevel: nieuwLevel,
    huidigWoord: huidigWoord,
    voorvulling: voorvulling,
    pogingenOver: pogingenOver,
    controleerPoging: controleerPoging,
    doeZet: doeZet,
    tijdOp: tijdOp,
    gebruikHint: gebruikHint,
    scoor: scoor,
    verwerkScore: verwerkScore,
    volgendWoord: volgendWoord,

    bordModel: bordModel,
    toetsenbordStand: toetsenbordStand,

    maakBingokaart: maakBingokaart,
    trekBal: trekBal,
    heeftLingo: heeftLingo
  };
})(window);
