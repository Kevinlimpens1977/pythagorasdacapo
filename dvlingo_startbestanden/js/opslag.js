/*
 * Digitale Vaardigheden Lingo - js/opslag.js
 * ------------------------------------------------------------------
 * De localStorage-laag die het spel en de quizmasterpagina delen.
 * Sleutel: dvl.lijst.v1 (JSON).
 *
 * Deze laag moet ook overeind blijven als localStorage er niet is of
 * dichtstaat: bij een browser die opslag blokkeert op file:// of in een
 * priveevenster valt alles terug op een lijst in het geheugen, zodat de
 * pagina blijft werken in plaats van stuk te lopen op een exception.
 *
 * Wijzigingen worden doorgegeven aan iedereen die luister(cb) heeft
 * aangeroepen: zowel binnen dit tabblad als vanuit een ander tabblad
 * (het storage-event), zodat het spel meteen meebeweegt als de
 * quizmaster in het andere venster iets aanpast.
 */
(function (window) {
  "use strict";

  var DVL = (window.DVL = window.DVL || {});

  var SLEUTEL = "dvl.lijst.v1";
  var INSTELLING_VOORVOEGSEL = "dvl.";

  var MIN_LENGTE = 3;
  var MAX_LENGTE = 9;

  /* ================================================================
   * Veilige toegang tot localStorage
   * ================================================================ */

  var noodOpslag = {}; /* valt hier op terug als de echte opslag dichtzit */
  var echteOpslag = null;
  var opslagWerkt = false;

  (function bepaalOpslag() {
    try {
      var kandidaat = window.localStorage;
      var proef = "dvl.proef." + Date.now();
      kandidaat.setItem(proef, "1");
      kandidaat.removeItem(proef);
      echteOpslag = kandidaat;
      opslagWerkt = true;
    } catch (fout) {
      echteOpslag = null;
      opslagWerkt = false;
    }
  })();

  function lees(sleutel) {
    if (opslagWerkt) {
      try {
        return echteOpslag.getItem(sleutel);
      } catch (fout) {
        opslagWerkt = false;
      }
    }
    return Object.prototype.hasOwnProperty.call(noodOpslag, sleutel) ? noodOpslag[sleutel] : null;
  }

  /** -> { gelukt, reden }  reden: '' | 'vol' | 'geblokkeerd' */
  function schrijf(sleutel, waarde) {
    noodOpslag[sleutel] = waarde;
    if (!opslagWerkt) return { gelukt: false, reden: "geblokkeerd" };
    try {
      echteOpslag.setItem(sleutel, waarde);
      return { gelukt: true, reden: "" };
    } catch (fout) {
      var vol =
        fout &&
        (fout.name === "QuotaExceededError" ||
          fout.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
          fout.code === 22 ||
          fout.code === 1014);
      if (!vol) opslagWerkt = false;
      return { gelukt: false, reden: vol ? "vol" : "geblokkeerd" };
    }
  }

  function verwijder(sleutel) {
    delete noodOpslag[sleutel];
    if (!opslagWerkt) return;
    try {
      echteOpslag.removeItem(sleutel);
    } catch (fout) {
      opslagWerkt = false;
    }
  }

  /* ================================================================
   * Woorden opschonen en keuren
   * ================================================================ */

  /** Alleen letters A-Z, hoofdletters, zonder accenten. */
  function normaliseerWoord(tekst) {
    if (DVL.Core && typeof DVL.Core.normaliseer === "function") {
      return DVL.Core.normaliseer(tekst);
    }
    if (tekst === null || tekst === undefined) return "";
    return String(tekst)
      .toUpperCase()
      .replace(/[^A-Z]/g, "");
  }

  /**
   * Keurt een woord voor de quizmasterlijst.
   * -> { geldig, woord, reden }
   * reden: '' | 'leeg' | 'tekens' | 'kort' | 'lang'
   */
  /* Letters, spaties en streepjes mogen in de invoer staan; spaties en
     streepjes vallen weg (BACK-UP wordt BACKUP). Alles daarbuiten, zoals
     cijfers en leestekens, keuren we af in plaats van stil weg te poetsen. */
  var TOEGESTAAN = /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\s-]+$/;

  function keurWoord(ruw) {
    var origineel = ruw === null || ruw === undefined ? "" : String(ruw).trim();
    if (!origineel) return { geldig: false, woord: "", reden: "leeg" };
    if (!TOEGESTAAN.test(origineel)) {
      return { geldig: false, woord: normaliseerWoord(origineel), reden: "tekens" };
    }
    var woord = normaliseerWoord(origineel);
    if (!woord) return { geldig: false, woord: "", reden: "tekens" };
    if (woord.length < MIN_LENGTE) return { geldig: false, woord: woord, reden: "kort" };
    if (woord.length > MAX_LENGTE) return { geldig: false, woord: woord, reden: "lang" };
    return { geldig: true, woord: woord, reden: "" };
  }

  /**
   * Maakt van willekeurige invoer een nette lijst {woord, uitleg}.
   * Dubbelen worden overgeslagen en apart teruggemeld.
   * -> { woorden, dubbel, afgekeurd }
   */
  function normaliseerWoorden(ruweLijst) {
    var woorden = [];
    var dubbel = [];
    var afgekeurd = [];
    var gezien = Object.create(null);
    if (!ruweLijst || !ruweLijst.length) {
      return { woorden: woorden, dubbel: dubbel, afgekeurd: afgekeurd };
    }
    for (var i = 0; i < ruweLijst.length; i++) {
      var item = ruweLijst[i];
      var ruw = typeof item === "string" ? item : item && item.woord;
      var keuring = keurWoord(ruw);
      if (!keuring.geldig) {
        afgekeurd.push({ invoer: ruw, reden: keuring.reden });
        continue;
      }
      if (gezien[keuring.woord]) {
        dubbel.push(keuring.woord);
        continue;
      }
      gezien[keuring.woord] = true;
      var uitleg = "";
      if (item && typeof item === "object" && typeof item.uitleg === "string") {
        uitleg = item.uitleg.trim();
      }
      woorden.push({ woord: keuring.woord, uitleg: uitleg });
    }
    return { woorden: woorden, dubbel: dubbel, afgekeurd: afgekeurd };
  }

  /** Zorgt dat een geladen of te bewaren lijst altijd de juiste vorm heeft. */
  function normaliseerLijst(ruw) {
    var lijst = ruw && typeof ruw === "object" ? ruw : {};
    var schoon = normaliseerWoorden(lijst.woorden);
    var uit = {
      gebruikEigenLijst: lijst.gebruikEigenLijst === true,
      schud: lijst.schud === true,
      woorden: schoon.woorden
    };
    /* Extra velden die de quizmaster later toevoegt blijven bewaard. */
    for (var sleutel in lijst) {
      if (!Object.prototype.hasOwnProperty.call(lijst, sleutel)) continue;
      if (sleutel === "gebruikEigenLijst" || sleutel === "schud" || sleutel === "woorden") continue;
      uit[sleutel] = lijst[sleutel];
    }
    return uit;
  }

  function legeLijst() {
    return { gebruikEigenLijst: false, schud: false, woorden: [] };
  }

  /* ================================================================
   * Luisteraars
   * ================================================================ */

  var luisteraars = [];
  var eventGekoppeld = false;

  function meldAan(lijst, bron) {
    for (var i = luisteraars.length - 1; i >= 0; i--) {
      try {
        luisteraars[i](lijst, bron);
      } catch (fout) {
        /* een kapotte luisteraar mag de rest niet meeslepen */
        if (window.console && window.console.error) window.console.error(fout);
      }
    }
  }

  function koppelEvent() {
    if (eventGekoppeld || !window.addEventListener) return;
    eventGekoppeld = true;
    window.addEventListener("storage", function (e) {
      /* e.key is null als iemand de hele opslag wist: ook dan bijwerken. */
      if (e && e.key && e.key !== SLEUTEL) return;
      meldAan(laadLijst(), "ander-tabblad");
    });
  }

  /* ================================================================
   * De openbare laag
   * ================================================================ */

  /** -> { gebruikEigenLijst, schud, woorden: [{woord, uitleg}] } */
  function laadLijst() {
    var ruw = lees(SLEUTEL);
    if (!ruw) return legeLijst();
    try {
      return normaliseerLijst(JSON.parse(ruw));
    } catch (fout) {
      /* Onleesbare inhoud gooien we niet weg maar negeren we; de
         quizmaster kan gewoon opnieuw bewaren. */
      return legeLijst();
    }
  }

  /**
   * Bewaart de lijst en waarschuwt alle luisteraars.
   * -> { gelukt, reden, lijst }  reden: '' | 'vol' | 'geblokkeerd'
   */
  function bewaarLijst(lijst) {
    var net = normaliseerLijst(lijst);
    var uitkomst = schrijf(SLEUTEL, JSON.stringify(net));
    meldAan(net, "dit-tabblad");
    return { gelukt: uitkomst.gelukt, reden: uitkomst.reden, lijst: net };
  }

  /** Gooit de eigen lijst weg; het spel valt daarmee terug op de standaardlijst. */
  function wisLijst() {
    verwijder(SLEUTEL);
    meldAan(legeLijst(), "dit-tabblad");
  }

  /** De woorden die het spel echt afspeelt: eigen lijst als die aan staat en gevuld is. */
  function actieveWoorden() {
    var lijst = laadLijst();
    if (lijst.gebruikEigenLijst && lijst.woorden.length) {
      return lijst.woorden.slice();
    }
    return (DVL.STANDAARDWOORDEN || []).slice();
  }

  /** Speelt het spel op dit moment de eigen lijst van de quizmaster af? */
  function gebruiktEigenLijst() {
    var lijst = laadLijst();
    return lijst.gebruikEigenLijst === true && lijst.woorden.length > 0;
  }

  /**
   * Meldt cb aan voor wijzigingen. cb(lijst, bron) met bron
   * 'dit-tabblad' of 'ander-tabblad'. Geeft een functie terug om weer
   * af te melden.
   */
  function luister(cb) {
    if (typeof cb !== "function") return function () {};
    koppelEvent();
    luisteraars.push(cb);
    return function stop() {
      var i = luisteraars.indexOf(cb);
      if (i !== -1) luisteraars.splice(i, 1);
    };
  }

  /* ================================================================
   * Kleine instellingen (geluid, demper, laatste moeilijkheid, ...)
   * ================================================================ */

  function leesInstelling(naam, standaard) {
    var ruw = lees(INSTELLING_VOORVOEGSEL + naam);
    if (ruw === null) return standaard;
    try {
      return JSON.parse(ruw);
    } catch (fout) {
      return standaard;
    }
  }

  function schrijfInstelling(naam, waarde) {
    return schrijf(INSTELLING_VOORVOEGSEL + naam, JSON.stringify(waarde));
  }

  /* ================================================================
   * Brug voor de knop "test dit woord" op de quizmasterpagina
   * ================================================================ */

  var TEST_SLEUTEL = "dvl.testwoord.v1";

  /** Zet een woord klaar dat het spel als eerste moet afspelen. */
  function zetTestWoord(woord, uitleg) {
    var keuring = keurWoord(woord);
    if (!keuring.geldig) return { gelukt: false, reden: keuring.reden };
    var uitkomst = schrijf(
      TEST_SLEUTEL,
      JSON.stringify({ woord: keuring.woord, uitleg: uitleg || "", tijd: Date.now() })
    );
    return { gelukt: uitkomst.gelukt, reden: uitkomst.reden, woord: keuring.woord };
  }

  /**
   * Haalt het testwoord op en ruimt het meteen op, zodat het maar een
   * keer gespeeld wordt. Ook ?test=WOORD in het adres werkt, want dat
   * blijft ook op file:// gewoon overeind.
   */
  function haalTestWoord() {
    var uitAdres = "";
    try {
      var zoek = window.location && (window.location.search || "");
      var hash = window.location && (window.location.hash || "");
      var treffer = /[?&#]test=([A-Za-z]+)/.exec(zoek + hash);
      if (treffer) uitAdres = normaliseerWoord(treffer[1]);
    } catch (fout) {
      uitAdres = "";
    }
    if (uitAdres) return { woord: uitAdres, uitleg: "" };

    var ruw = lees(TEST_SLEUTEL);
    if (!ruw) return null;
    verwijder(TEST_SLEUTEL);
    try {
      var data = JSON.parse(ruw);
      if (!data || !data.woord) return null;
      return { woord: normaliseerWoord(data.woord), uitleg: data.uitleg || "" };
    } catch (fout) {
      return null;
    }
  }

  /* ================================================================
   * Naar buiten
   * ================================================================ */

  DVL.Opslag = {
    SLEUTEL: SLEUTEL,
    MIN_LENGTE: MIN_LENGTE,
    MAX_LENGTE: MAX_LENGTE,

    laadLijst: laadLijst,
    bewaarLijst: bewaarLijst,
    wisLijst: wisLijst,
    actieveWoorden: actieveWoorden,
    gebruiktEigenLijst: gebruiktEigenLijst,
    luister: luister,

    keurWoord: keurWoord,
    normaliseerWoord: normaliseerWoord,
    normaliseerWoorden: normaliseerWoorden,
    normaliseerLijst: normaliseerLijst,

    leesInstelling: leesInstelling,
    schrijfInstelling: schrijfInstelling,

    zetTestWoord: zetTestWoord,
    haalTestWoord: haalTestWoord,

    /** Werkt de echte localStorage? Zo niet, dan draait alles in het geheugen. */
    beschikbaar: function () {
      return opslagWerkt;
    }
  };
})(window);
