/*
 * Digitale Vaardigheden Lingo - js/helix-brug.js
 * ------------------------------------------------------------------
 * De brug tussen het spel en het HELIX-leerplatform. Dit bestand is de
 * ENIGE toevoeging aan het spel: het leest mee via het DOM-contract uit
 * SPEC.md en via DVL.Game.staat(), en raakt de spellogica niet aan.
 * Weghalen van de scripttag in index.html haalt de hele brug weg en
 * laat het spel precies als de standalone versie draaien.
 *
 * Berichten naar het platform (postMessage naar window.parent):
 *   { bron: 'dvlingo', soort: 'gereed'  }
 *   { bron: 'dvlingo', soort: 'gestart', op: ISO-string }
 *   { bron: 'dvlingo', soort: 'bezig',   bezig: true|false }
 *   { bron: 'dvlingo', soort: 'klaar',   punten, details, op }
 *
 * Het platform bepaalt zelf wat die punten aan tokens waard zijn; het
 * spel kent geen tokens en schrijft nergens naar Firebase.
 */
(function (window, document) {
  "use strict";

  var BRON = "dvlingo";

  /* Buiten een iframe (het spel los openen) doet de brug niets. */
  if (!window.parent || window.parent === window) return;

  var gestartOp = null;
  var laatsteBezig = null;
  var uitslagGemeld = false;

  function stuur(bericht) {
    bericht.bron = BRON;
    try {
      window.parent.postMessage(bericht, window.location.origin);
    } catch (fout) {
      /* Het platform luistert niet (meer). Het spel speelt gewoon door. */
    }
  }

  function meldBezig(bezig) {
    if (bezig === laatsteBezig) return;
    laatsteBezig = bezig;
    stuur({ soort: "bezig", bezig: bezig });
  }

  /* Het scherm dat op dit moment actief is, volgens het DOM-contract. */
  function actiefScherm() {
    var actief = document.querySelector("main > .scherm.is-actief");
    return actief ? actief.id : "";
  }

  /* De eindstand zoals het spel hem zelf toont: het element .eindscore is
     door game.js gevuld met totaalVan(speler). Dat is de enige bron van
     waarheid voor de score, zodat de brug de formule niet nabouwt. */
  function eindscoreUitScherm() {
    var vak = document.querySelector("#uitslag-inhoud .eindscore");
    if (!vak) return null;
    var getal = parseInt(String(vak.textContent).replace(/[^0-9-]/g, ""), 10);
    return isFinite(getal) ? getal : null;
  }

  /* Compacte statistieken voor de voortgangsopslag van het platform.
     Alles defensief: ontbreekt er iets, dan blijft het veld gewoon weg. */
  function details() {
    var uit = {};
    var alles = null;
    try {
      alles = window.DVL && DVL.Game && typeof DVL.Game.staat === "function"
        ? DVL.Game.staat()
        : null;
    } catch (fout) {
      alles = null;
    }
    if (!alles || !alles.spel) return uit;

    var spel = alles.spel;
    var speler = spel.deelnemers && spel.deelnemers[0] ? spel.deelnemers[0] : null;

    if (typeof spel.level === "number") uit.level = spel.level;
    if (typeof spel.extraPunten === "number") uit.extraPunten = spel.extraPunten;

    if (speler && speler.woorden && speler.woorden.length) {
      var goed = 0;
      for (var i = 0; i < speler.woorden.length; i++) {
        if (speler.woorden[i].gewonnen) goed++;
      }
      uit.woordenGoed = goed;
      uit.woordenTotaal = speler.woorden.length;
    }

    if (spel.ballenRondes && spel.ballenRondes.length) {
      var lingos = 0;
      for (var b = 0; b < spel.ballenRondes.length; b++) {
        lingos += Number(spel.ballenRondes[b].lingos) || 0;
      }
      uit.lingos = lingos;
      uit.ballenfases = spel.ballenRondes.length;
    }

    if (spel.bonusRondes && spel.bonusRondes.length) {
      var geraden = 0;
      for (var n = 0; n < spel.bonusRondes.length; n++) {
        if (spel.bonusRondes[n].geraden) geraden++;
      }
      uit.bonuswoordenGeraden = geraden;
      uit.bonuswoordenKansen = spel.bonusRondes.length;
    }

    return uit;
  }

  function meldUitslag() {
    if (uitslagGemeld) return;
    uitslagGemeld = true;

    var punten = eindscoreUitScherm();
    if (punten === null) punten = 0;

    meldBezig(false);
    stuur({
      soort: "klaar",
      punten: Math.max(0, punten),
      details: details(),
      gestartOp: gestartOp,
      op: new Date().toISOString()
    });
  }

  /* Elke schermwisseling loopt via toonScherm(), dat is-actief omzet. Eén
     observer op main volstaat dus om het hele verloop te volgen. */
  function volgSchermen() {
    var doel = document.querySelector("main");
    if (!doel) return;

    var observer = new MutationObserver(function (lijst) {
      /* Tijdens het spelen wisselen tegels voortdurend van klasse. Alleen
         een wissel op een .scherm zelf is interessant; de rest slaan we
         meteen over zodat de brug het spel niet afremt. */
      var raakt = false;
      for (var i = 0; i < lijst.length; i++) {
        var doelwit = lijst[i].target;
        if (doelwit && doelwit.classList && doelwit.classList.contains("scherm")) {
          raakt = true;
          break;
        }
      }
      if (!raakt) return;

      var scherm = actiefScherm();

      if (scherm === "scherm-uitslag") {
        meldUitslag();
        return;
      }

      if (scherm === "scherm-menu") {
        meldBezig(false);
        return;
      }

      /* Startscherm, spel, ballenfase of bonuswoord: er loopt een potje. */
      if (scherm) {
        if (!gestartOp) {
          gestartOp = new Date().toISOString();
          stuur({ soort: "gestart", op: gestartOp });
        }
        /* Na 'Nog een keer' mag een volgend potje opnieuw gemeld worden. */
        uitslagGemeld = false;
        meldBezig(true);
      }
    });

    observer.observe(doel, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  function start() {
    volgSchermen();
    stuur({ soort: "gereed" });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})(window, document);
