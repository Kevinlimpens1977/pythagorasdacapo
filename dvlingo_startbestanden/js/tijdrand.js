/* ==========================================================================
   Digitale Vaardigheden Lingo — js/tijdrand.js

   Tekent de tijdlijn langs de buitenrand van het speelveld en houdt hem bij.

   Twee dingen gebeuren hier:

   1. De stand van de tijdbalk wordt overgenomen. js/game.js zet --rest en
      data-staat op #tijdbalk; die worden hier naar #scherm-spel gespiegeld.
      Zo bleef de spellogica onaangeraakt en kan de lijn er zonder risico af:
      één regel uit index.html en hij is weg.

   2. De omtrek wordt als SVG-pad neergezet, niet als conisch verloop. Een
      conisch verloop draait om het middelpunt en loopt bij een breed kader
      ongelijk leeg: de lange zijden gaan snel, de hoeken blijven achter. Met
      pathLength="100" is de streeplengte precies het percentage dat over is,
      dus de lijn krimpt overal even snel.
   ========================================================================== */

(function (window, document) {
  'use strict';

  var DVL = window.DVL = window.DVL || {};
  var NS = 'http://www.w3.org/2000/svg';

  /* Een afgeronde rechthoek die begint op het midden van de bovenkant en met
     de klok mee loopt. Daardoor snoept de lijn vanaf boven op, symmetrisch
     ten opzichte van waar de speler kijkt. */
  function omtrek(breedte, hoogte, straal, dikte) {
    var d = dikte / 2;
    var x0 = d, y0 = d;
    var x1 = breedte - d, y1 = hoogte - d;
    var r = Math.max(0, Math.min(straal - d, (x1 - x0) / 2, (y1 - y0) / 2));
    var midden = (x0 + x1) / 2;

    return 'M' + midden + ' ' + y0 +
           'H' + (x1 - r) +
           'A' + r + ' ' + r + ' 0 0 1 ' + x1 + ' ' + (y0 + r) +
           'V' + (y1 - r) +
           'A' + r + ' ' + r + ' 0 0 1 ' + (x1 - r) + ' ' + y1 +
           'H' + (x0 + r) +
           'A' + r + ' ' + r + ' 0 0 1 ' + x0 + ' ' + (y1 - r) +
           'V' + (y0 + r) +
           'A' + r + ' ' + r + ' 0 0 1 ' + (x0 + r) + ' ' + y0 +
           'Z';
  }

  function getal(waarde, terugval) {
    var n = parseFloat(waarde);
    return isNaN(n) ? terugval : n;
  }

  function start() {
    var balk = document.getElementById('tijdbalk');
    var scherm = document.getElementById('scherm-spel');
    if (!balk || !scherm) { return; }

    /* ---- de lijn neerzetten ---- */

    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'tijdring');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('preserveAspectRatio', 'none');

    var spoor = document.createElementNS(NS, 'path');
    spoor.setAttribute('class', 'tijdring-spoor');
    spoor.setAttribute('pathLength', '100');

    var rest = document.createElementNS(NS, 'path');
    rest.setAttribute('class', 'tijdring-rest');
    rest.setAttribute('pathLength', '100');

    svg.appendChild(spoor);
    svg.appendChild(rest);
    scherm.appendChild(svg);

    function tekenOpnieuw() {
      var b = svg.clientWidth;
      var h = svg.clientHeight;
      if (!b || !h) { return; }

      var stijl = window.getComputedStyle(scherm);
      var dikte = getal(window.getComputedStyle(rest).strokeWidth, 6);

      /* De hoekstraal van het kader. border-radius beschrijft in CSS al de
         BUITENSTE ronding, dus de randdikte hoort er niet bij opgeteld. Dat
         gebeurde eerder wel, waardoor de boog van de lijn te wijd liep en de
         hoek afsneed: bij elke hoek piepte een wit boogje van het kader onder
         de lijn vandaan.

         De lijn ligt bovendien een paar pixels buiten het kader; die overhang
         wordt hier uit de werkelijke maten afgeleid in plaats van uit een
         tweede plek in de CSS, zodat de twee niet uit elkaar kunnen lopen. */
      var uit = Math.max(0, (b - scherm.offsetWidth) / 2);
      var straal = getal(stijl.borderTopLeftRadius, 28) + uit;

      svg.setAttribute('viewBox', '0 0 ' + b + ' ' + h);
      var d = omtrek(b, h, straal, dikte);
      spoor.setAttribute('d', d);
      rest.setAttribute('d', d);
    }

    /* ---- de stand bijhouden ---- */

    var laatsteRest = null;
    var stilTimer = null;

    /* De overlays die het spel onderbreken. Zolang er een openstaat, staat de
       klok stil en hoort de lijn weg te zijn. */
    var overlays = ['pauzescherm', 'woordkaart', 'uitlegscherm']
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    function ietsOpen() {
      for (var i = 0; i < overlays.length; i++) {
        if (!overlays[i].hidden) { return true; }
      }
      return false;
    }

    /* Eerder werd afgeleid dat de klok stilstond zodra de restwaarde 700ms niet
       veranderde. Dat raadde stelselmatig mis: js/game.js rondt --rest af op
       twee decimalen, dus bij een woord van ruim een minuut verandert de waarde
       maar zo'n vier keer per drie seconden. De lijn dipte daardoor om de paar
       tellen weg terwijl er niets aan de hand was.

       Nu wordt er niet meer geraden maar gekeken: het scherm moet actief zijn
       en er mag geen overlay openstaan. De ruime tijdslimiet is alleen nog een
       vangnet voor gevallen die we niet zien aankomen. */
    function werkZichtbaarheidBij() {
      var zichtbaar = scherm.classList.contains('is-actief') && !ietsOpen();
      if (zichtbaar) {
        scherm.setAttribute('data-tijd', 'loopt');
      } else {
        scherm.removeAttribute('data-tijd');
      }
    }

    function meldBeweging() {
      werkZichtbaarheidBij();
      window.clearTimeout(stilTimer);
      stilTimer = window.setTimeout(function () {
        scherm.removeAttribute('data-tijd');
      }, 4000);
    }

    for (var o = 0; o < overlays.length; o++) {
      new MutationObserver(werkZichtbaarheidBij)
        .observe(overlays[o], { attributes: true, attributeFilter: ['hidden', 'class'] });
    }

    function neemOver() {
      var waarde = balk.style.getPropertyValue('--rest');
      var staat = balk.getAttribute('data-staat');

      if (waarde !== '') {
        scherm.style.setProperty('--rest', waarde);
        /* Van 0 tot 1 naar een streeplengte op een pad van 100 lang. */
        var deel = Math.max(0, Math.min(1, getal(waarde, 1)));
        scherm.style.setProperty('--tijdring-lengte', String(Math.round(deel * 1000) / 10));

        if (waarde !== laatsteRest) {
          laatsteRest = waarde;
          meldBeweging();
        }
      }

      if (staat) {
        scherm.setAttribute('data-staat', staat);
      } else {
        scherm.removeAttribute('data-staat');
      }
    }

    var kijker = new MutationObserver(neemOver);
    kijker.observe(balk, { attributes: true, attributeFilter: ['style', 'data-staat'] });

    /* Bij het verlaten van het spelscherm hoort de lijn meteen weg, ook als de
       klok toevallig net stilstond. */
    var schermKijker = new MutationObserver(function () {
      if (!scherm.classList.contains('is-actief')) {
        scherm.removeAttribute('data-tijd');
        window.clearTimeout(stilTimer);
      } else {
        tekenOpnieuw();
        werkZichtbaarheidBij();
      }
    });
    schermKijker.observe(scherm, { attributes: true, attributeFilter: ['class'] });

    if (window.ResizeObserver) {
      new window.ResizeObserver(tekenOpnieuw).observe(scherm);
    } else {
      window.addEventListener('resize', tekenOpnieuw);
    }

    tekenOpnieuw();
    neemOver();

    DVL.Tijdrand = {
      hertekenen: tekenOpnieuw,
      uit: function () {
        kijker.disconnect();
        schermKijker.disconnect();
        if (svg.parentNode) { svg.parentNode.removeChild(svg); }
        scherm.removeAttribute('data-tijd');
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

})(window, document);
