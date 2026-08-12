/* =====================================================================
 * js/bonuswoord.js — het bonuswoord van Digitale Vaardigheden Lingo
 *
 * Pure logica onder DVL.Bonus: geen DOM, geen timers, geen netwerk.
 * Het scherm (js/bonusscherm.js) vraagt hier wat het moet tonen.
 *
 * Wat dit bestand doet:
 *   - het houdt de pool met Nederlandse woorden van precies elf letters
 *     over digitale geletterdheid vast;
 *   - het kiest per spel willekeurig één woord, met uitsluiting van de
 *     woorden die deze speler al eerder heeft gehad (localStorage
 *     "dvl.bonus.gehad");
 *   - het bepaalt per spel willekeurig welke posities worden vrijgegeven:
 *     3 na level 1, 6 na level 2, 8 na level 3, waarbij eerder
 *     vrijgegeven posities blijven staan;
 *   - het levert de losse letters die nog geplaatst moeten worden,
 *     geschud, zodat het scherm ze als voorraad kan tonen;
 *   - het keurt een gok, hoofdletterongevoelig en zonder spaties.
 *
 * Herkomst van de woorden: alle woorden hieronder zijn gecontroleerd
 * tegen de volledige open woordenlijst van OpenTaal
 * (https://github.com/OpenTaal/opentaal-wordlist, CC BY 3.0 / BSD):
 * zonder eigennamen (woorden met een hoofdletter tellen niet mee) en
 * met accenten weggehaald. Wie een woord toevoegt, controleert het daar
 * eerst tegen; js/bonuswoord.test.html draagt die lijst bij zich en
 * meldt het meteen als een woord er niet in staat.
 * ===================================================================== */

(function (global) {
  "use strict";

  var DVL = global.DVL = global.DVL || {};

  /* ------------------------------------------------------------------
   * De pool
   * ------------------------------------------------------------------
   * Nederlandse woorden van precies elf letters over digitale
   * geletterdheid, ICT, mediawijsheid, internet, online veiligheid,
   * apparaten, software, data en digitale communicatie.
   * ------------------------------------------------------------------ */
  var POOL = [
    /* apparaten en randapparatuur */
    "BEELDSCHERM",
    "TOETSENBORD",
    "TOETSENBLOK",
    "LUIDSPREKER",
    "KOPTELEFOON",
    "ZAKTELEFOON",
    "TELEFOONTJE",
    "SMARTPHONES",
    "TOUCHSCREEN",
    "APPARAATJES",
    "MUISKNOPPEN",
    "MUISKLIKKEN",
    "MUISWIELTJE",
    "VIDEOCAMERA",
    "GAMECONSOLE",
    "ELEKTRONICA",
    "KABELMODEMS",
    "WIFINETWERK",
    "WIFIHOTSPOT",
    "LAADSTATION",
    "STROOMKABEL",
    "PRINTERINKT",
    "MEDIASPELER",
    "VIDEOSPELER",
    "MOEDERKAART",
    "GELUIDKAART",
    "FOTOPRINTER",
    "PRINTSERVER",
    "HOOFDCAMERA",
    "FRONTCAMERA",
    "IRISSCANNER",
    "HANDSCANNER",
    "ZELFSCANNER",
    "FAXAPPARAAT",
    "PINAPPARAAT",
    "COMPUTERTJE",
    "TELEFOONNET",

    /* software, bedienen en bestanden */
    "APPLICATIES",
    "ZOEKMACHINE",
    "ZOEKFUNCTIE",
    "ZOEKWOORDEN",
    "ZOEKVENSTER",
    "SNELTOETSEN",
    "INVOERTOETS",
    "CIJFERTOETS",
    "LETTERTOETS",
    "DELETETOETS",
    "CURSORTOETS",
    "MENUTOETSEN",
    "INLOGSCHERM",
    "INLOGPAGINA",
    "BEGINSCHERM",
    "HOOFDSCHERM",
    "KEUZESCHERM",
    "SCHERMBEELD",
    "SCHERMLEZER",
    "BESTANDSMAP",
    "DATABESTAND",
    "BRONBESTAND",
    "FOTOBESTAND",
    "FILMBESTAND",
    "SPREADSHEET",
    "PRESENTATIE",
    "INSTALLEREN",
    "NOTIFICATIE",
    "PROGRAMMEUR",
    "ALGORITMIEK",
    "DOWNLOADERS",
    "LIVESTREAMS",
    "CODEWOORDEN",
    "CODESLEUTEL",
    "FAXSOFTWARE",
    "COMPUTERLES",
    "SPATIETOETS",
    "DRUKTOETSEN",
    "CAMERATOETS",
    "EFFECTTOETS",
    "STARTSCHERM",
    "INVULSCHERM",
    "TEKSTSCHERM",
    "VIDEOSCHERM",
    "GROENSCHERM",
    "MUISGEBRUIK",
    "DOORKLIKKEN",
    "FOUTBERICHT",
    "PRINTOPTIES",
    "PRINTERFOUT",
    "CODESYSTEEM",
    "ROBOTISEREN",
    "BEELDOPSLAG",

    /* internet en het web */
    "INTERNETTEN",
    "INTERNETTER",
    "WEBBROWSERS",
    "WEBADRESSEN",
    "WEBDIENSTEN",
    "WEBWINKELEN",
    "WEBDESIGNER",
    "WEBREDACTIE",
    "WEBMAGAZINE",
    "NIEUWSSITES",
    "PORTAALSITE",
    "NETWERKSITE",
    "ONLINEVIDEO",
    "CLOUDDIENST",
    "CLOUDOPSLAG",
    "THUISSERVER",
    "HOOFDSERVER",
    "HUISNETWERK",
    "ONLINEMARKT",
    "TECHWEBSITE",
    "KRANTENSITE",
    "CONTACTSITE",
    "VERKOOPSITE",
    "VEILINGSITE",
    "BETAALSITES",
    "KINDERSITES",
    "MUZIEKSITES",

    /* digitale communicatie */
    "VIDEOBELLEN",
    "BEELDBELLEN",
    "CHATBERICHT",
    "CHATVENSTER",
    "CHATFUNCTIE",
    "CHATKANALEN",
    "MAILACCOUNT",
    "MAILBERICHT",
    "MAILSERVERS",
    "MAILSYSTEEM",
    "ACCOUNTNAAM",
    "PUSHBERICHT",
    "CHATCONTACT",
    "CHATSESSIES",
    "CHATVERKEER",
    "MAILVERKEER",
    "MAILCONTACT",
    "MAILSERVICE",
    "MAILLIJSTEN",
    "MAILBESTAND",
    "NIEUWSMAILS",
    "PERSBERICHT",
    "CODEBERICHT",
    "DATABERICHT",

    /* online veiligheid en mediawijsheid */
    "CYBERPESTEN",
    "CYBERAANVAL",
    "CYBERWERELD",
    "SPAMFILTERS",
    "SPAMBERICHT",
    "NEPMAILTJES",
    "NEPACCOUNTS",
    "NAMAAKSITES",
    "HAATBERICHT",
    "VIRUSAANVAL",
    "VIRUSMAKERS",
    "BEVEILIGING",
    "ONBEVEILIGD",
    "MEDIAWIJZER",
    "MEDIAGEDRAG",
    "KETTINGMAIL",
    "RECLAMEMAIL",
    "NIEUWSMEDIA",
    "PROFIELFOTO",
    "HERSTELCODE",
    "AANMELDCODE",
    "INLOGNUMMER",
    "INLOGSESSIE",
    "CYBERNAUTEN",
    "MEDIAKANAAL",
    "MEDIAWERELD",

    /* data en opslag */
    "DATAVERKEER",
    "DATAVERLIES",
    "DATACENTRUM",
    "DATANETWERK",
    "DATABUNDELS",
    "DATAGEBRUIK",
    "DATASYSTEEM",
    "OPSLAGMEDIA",
    "PROXYSERVER",
    "FILESERVERS",
    "GAMESERVERS",
    "MEDIASERVER",
    "SCHIJFKOPIE",
    "DATACENTERS",
    "DATASTROMEN"
  ];

  /* Elk bonuswoord is precies elf letters lang. */
  var LENGTE = 11;

  /* Hoeveel letters er vrij zijn ná level 1, 2 en 3. De eerder
     vrijgegeven posities blijven staan, dus dit loopt cumulatief op. */
  var STAPPEN = [3, 6, 8];

  /* De sleutel waaronder de al gehad woorden van deze speler staan. */
  var SLEUTEL = "dvl.bonus.gehad";

  /* ------------------------------------------------------------------
   * Toeval
   * ------------------------------------------------------------------ */

  /* Een klein, voorspelbaar toevalsrad op basis van één zaadgetal.
     Gebruikt om de voorraadletters per spel altijd in dezelfde volgorde
     te schudden: het scherm mag opnieuw tekenen zonder dat de letters
     ineens verspringen, en toch krijgt elk spel een eigen volgorde. */
  function maakRad(zaad) {
    var stand = (zaad >>> 0) || 1;
    return function () {
      stand = (stand + 0x6D2B79F5) >>> 0;
      var t = stand;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function kiesRad(opties) {
    if (opties && typeof opties.toeval === "function") return opties.toeval;
    return Math.random;
  }

  function trekGetal(toeval, aantal) {
    var n = Math.floor(toeval() * aantal);
    if (!(n >= 0)) n = 0;
    if (n >= aantal) n = aantal - 1;
    return n;
  }

  /* Fisher-Yates, op een kopie: de meegegeven rij blijft ongemoeid. */
  function schud(rij, toeval) {
    var uit = rij.slice();
    for (var i = uit.length - 1; i > 0; i--) {
      var j = trekGetal(toeval, i + 1);
      var hulp = uit[i];
      uit[i] = uit[j];
      uit[j] = hulp;
    }
    return uit;
  }

  /* ------------------------------------------------------------------
   * Opslag
   * ------------------------------------------------------------------
   * Werkt met localStorage, maar valt terug op geheugen zodra dat
   * geblokkeerd is (privémodus, file:// met strenge instellingen).
   * Tests geven hun eigen opslag mee via opties.opslag.
   * ------------------------------------------------------------------ */

  var geheugenOpslag = (function () {
    var doos = {};
    return {
      getItem: function (sleutel) {
        return Object.prototype.hasOwnProperty.call(doos, sleutel) ? doos[sleutel] : null;
      },
      setItem: function (sleutel, waarde) { doos[sleutel] = String(waarde); },
      removeItem: function (sleutel) { delete doos[sleutel]; }
    };
  })();

  function kiesOpslag(opties) {
    if (opties && opties.opslag) return opties.opslag;
    try {
      var echt = global.localStorage;
      if (!echt) return geheugenOpslag;
      echt.setItem("dvl.bonus.proef", "1");
      echt.removeItem("dvl.bonus.proef");
      return echt;
    } catch (fout) {
      return geheugenOpslag;
    }
  }

  function normaliseerPool(rij) {
    var uit = [];
    var gezien = {};
    if (!rij || !rij.length) return uit;
    for (var i = 0; i < rij.length; i++) {
      var woord = String(rij[i] || "").toUpperCase();
      if (!woord) continue;
      if (Object.prototype.hasOwnProperty.call(gezien, woord)) continue;
      gezien[woord] = true;
      uit.push(woord);
    }
    return uit;
  }

  function bevat(rij, waarde) {
    for (var i = 0; i < rij.length; i++) if (rij[i] === waarde) return true;
    return false;
  }

  /* De al gehad woorden, ontdaan van rommel en van woorden die niet
     (meer) in de pool zitten — anders zou een verwijderd woord de
     geschiedenis voor altijd vol houden. */
  function leesGehad(opslag, pool) {
    var ruw = null;
    try { ruw = opslag.getItem(SLEUTEL); } catch (fout) { ruw = null; }
    if (!ruw) return [];
    var rij;
    try { rij = JSON.parse(ruw); } catch (fout) { return []; }
    if (!rij || Object.prototype.toString.call(rij) !== "[object Array]") return [];
    var uit = [];
    for (var i = 0; i < rij.length; i++) {
      var woord = String(rij[i] || "").toUpperCase();
      if (!woord || bevat(uit, woord)) continue;
      if (pool && !bevat(pool, woord)) continue;
      uit.push(woord);
    }
    return uit;
  }

  function schrijfGehad(opslag, rij) {
    try {
      if (!rij || !rij.length) opslag.removeItem(SLEUTEL);
      else opslag.setItem(SLEUTEL, JSON.stringify(rij));
    } catch (fout) { /* niets aan te doen; het spel loopt gewoon door */ }
  }

  /* ------------------------------------------------------------------
   * De staat van het bonuswoord
   * ------------------------------------------------------------------
   * {
   *   woord:    "BEELDSCHERM",
   *   posities: [7, 0, 4, 10, 2, 9, 1, 5],  // vrijgeefvolgorde, 8 stuks
   *   stap:     0,        // 0 = nog niets vrij, 1..3 = na level 1..3
   *   geraden:  false,
   *   zaad:     1234567   // schudvolgorde van de voorraadletters
   * }
   * Alle functies hieronder laten de meegegeven staat ongemoeid en
   * geven waar nodig een nieuwe staat terug.
   * ------------------------------------------------------------------ */

  function maakStaat(woord, toeval) {
    var alle = [];
    for (var i = 0; i < LENGTE; i++) alle.push(i);
    var meeste = STAPPEN[STAPPEN.length - 1];
    return {
      woord: woord,
      posities: schud(alle, toeval).slice(0, meeste),
      stap: 0,
      geraden: false,
      zaad: 1 + trekGetal(toeval, 2147483646)
    };
  }

  function kopieerStaat(staat) {
    return {
      woord: staat.woord,
      posities: staat.posities.slice(),
      stap: staat.stap,
      geraden: staat.geraden,
      zaad: staat.zaad
    };
  }

  /* Kies een woord voor een nieuw spel.
     opties: { toeval, opslag, pool, sluitUit } — allemaal optioneel. */
  function nieuwSpel(opties) {
    opties = opties || {};
    var pool = normaliseerPool(opties.pool || POOL);
    if (!pool.length) throw new Error("De bonuswoordenpool is leeg.");
    var opslag = kiesOpslag(opties);
    var toeval = kiesRad(opties);

    var gehadLijst = leesGehad(opslag, pool);
    var over = [];
    var i;
    for (i = 0; i < pool.length; i++) {
      if (!bevat(gehadLijst, pool[i])) over.push(pool[i]);
    }

    /* Pas als de pool op is mag de geschiedenis worden gewist. */
    if (!over.length) {
      gehadLijst = [];
      schrijfGehad(opslag, gehadLijst);
      over = pool.slice();
    }

    /* Wat de aanroeper expliciet uitsluit (bijvoorbeeld het woord dat
       zojuist geraden is) valt af, maar nooit zo ver dat er niets
       overblijft. */
    if (opties.sluitUit && opties.sluitUit.length) {
      var rest = [];
      for (i = 0; i < over.length; i++) {
        if (!bevat(opties.sluitUit, String(over[i]).toUpperCase())) rest.push(over[i]);
      }
      if (rest.length) over = rest;
    }

    var woord = over[trekGetal(toeval, over.length)];
    schrijfGehad(opslag, gehadLijst.concat([woord]));
    return maakStaat(woord, toeval);
  }

  /* Eén level verder. Was het woord al geraden, dan komt er een nieuw
     woord dat weer met drie letters begint; anders schuift dezelfde
     staat een stap op. */
  function volgendeStap(staat, opties) {
    if (!staat) {
      var eerste = nieuwSpel(opties);
      eerste.stap = 1;
      return eerste;
    }
    if (staat.geraden) {
      var extra = {};
      var sleutel;
      if (opties) for (sleutel in opties) {
        if (Object.prototype.hasOwnProperty.call(opties, sleutel)) extra[sleutel] = opties[sleutel];
      }
      extra.sluitUit = (extra.sluitUit || []).concat([staat.woord]);
      var verse = nieuwSpel(extra);
      verse.stap = 1;
      return verse;
    }
    var volgende = kopieerStaat(staat);
    volgende.stap = Math.min(staat.stap + 1, STAPPEN.length);
    return volgende;
  }

  function stapVan(staat, stap) {
    var n = (stap === undefined || stap === null) ? staat.stap : stap;
    n = Math.floor(n);
    if (!(n > 0)) return 0;
    return Math.min(n, STAPPEN.length);
  }

  /* De vrijgegeven posities, oplopend gesorteerd. Eerdere posities
     blijven staan: stap 2 bevat alles van stap 1. */
  function vrijgegeven(staat, stap) {
    var n = stapVan(staat, stap);
    if (!n) return [];
    var lijst = staat.posities.slice(0, STAPPEN[n - 1]);
    return lijst.sort(function (a, b) { return a - b; });
  }

  /* Elf plekken: de letter als die vrijgegeven is, anders null. */
  function masker(staat, stap) {
    var vrij = vrijgegeven(staat, stap);
    var uit = [];
    for (var i = 0; i < LENGTE; i++) uit.push(null);
    for (var j = 0; j < vrij.length; j++) uit[vrij[j]] = staat.woord.charAt(vrij[j]);
    return uit;
  }

  /* De letters die nog geplaatst moeten worden, geschud. Dezelfde staat
     en stap leveren altijd dezelfde volgorde, zodat het scherm rustig
     opnieuw kan tekenen. */
  function voorraad(staat, stap) {
    var n = stapVan(staat, stap);
    var vrij = vrijgegeven(staat, n);
    var letters = [];
    for (var i = 0; i < LENGTE; i++) {
      if (!bevat(vrij, i)) letters.push(staat.woord.charAt(i));
    }
    return schud(letters, maakRad(staat.zaad + n * 7919));
  }

  /* Hoofdletterongevoelig, spaties eromheen weg. Spaties binnenin
     tellen ook niet mee: geen enkel bonuswoord bevat er een, dus een
     losse spatie van het schermtoetsenbord mag geen goede gok kosten. */
  function normaliseerGok(gok) {
    return String(gok === undefined || gok === null ? "" : gok)
      .replace(/\s+/g, "")
      .toUpperCase();
  }

  function keur(staat, gok) {
    if (!staat || !staat.woord) return false;
    var schoon = normaliseerGok(gok);
    if (!schoon) return false;
    return schoon === staat.woord;
  }

  /* Een gok verwerken: geeft de uitslag én de staat terug. */
  function raad(staat, gok) {
    var goed = keur(staat, gok);
    var volgende = kopieerStaat(staat);
    if (goed) volgende.geraden = true;
    return { goed: goed, staat: volgende };
  }

  /* De woorden die deze speler al heeft gehad. */
  function gehad(opties) {
    opties = opties || {};
    return leesGehad(kiesOpslag(opties), normaliseerPool(opties.pool || POOL));
  }

  /* De woorden die nog niet aan de beurt zijn geweest. */
  function beschikbaar(opties) {
    opties = opties || {};
    var pool = normaliseerPool(opties.pool || POOL);
    var al = leesGehad(kiesOpslag(opties), pool);
    var uit = [];
    for (var i = 0; i < pool.length; i++) {
      if (!bevat(al, pool[i])) uit.push(pool[i]);
    }
    return uit;
  }

  function wisGeschiedenis(opties) {
    schrijfGehad(kiesOpslag(opties || {}), []);
  }

  DVL.Bonus = {
    POOL: POOL,
    LENGTE: LENGTE,
    STAPPEN: STAPPEN,
    SLEUTEL: SLEUTEL,

    nieuwSpel: nieuwSpel,
    volgendeStap: volgendeStap,
    vrijgegeven: vrijgegeven,
    masker: masker,
    voorraad: voorraad,
    keur: keur,
    raad: raad,
    normaliseerGok: normaliseerGok,

    gehad: gehad,
    beschikbaar: beschikbaar,
    wisGeschiedenis: wisGeschiedenis
  };
})(typeof window !== "undefined" ? window : this);
