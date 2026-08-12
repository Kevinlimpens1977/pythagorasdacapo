/* ==========================================================================
   Digitale Vaardigheden Lingo — js/toegang.js

   Het slot voor de pagina Woordenbeheer. De pagina staat in de opmaak al op
   slot (<html class="is-vergrendeld">); dit bestand haalt dat slot eraf zodra
   het juiste wachtwoord is ingevoerd.

   Eerlijk over wat dit is: dit is een deurbel, geen slot. Het wachtwoord wordt
   in de browser gecontroleerd, dus wie de broncode opent kan er omheen. Het
   houdt leerlingen uit de woordenlijst; het beschermt niets tegen iemand die
   echt binnen wil. Sla er dus nooit iets gevoeligs achter op.

   Het wachtwoord staat er niet leesbaar in maar als getal, zodat het niet in
   het oog springt bij het doorbladeren van de code.
   ========================================================================== */

(function (window, document) {
  'use strict';

  var DVL = window.DVL = window.DVL || {};

  /* FNV-1a, 32 bits. Klein en genoeg voor dit doel.

     Math.imul is hier geen opsmuk maar noodzaak: een gewone vermenigvuldiging
     van twee grote getallen loopt in JavaScript boven de grens waar gehele
     getallen nog exact zijn, waarna de onderste bits wegvallen en er nooit een
     kloppende uitkomst uitrolt. Math.imul rekent wel echt met 32 bits. */
  function vermaal(tekst) {
    var h = 0x811c9dc5;
    for (var i = 0; i < tekst.length; i++) {
      h ^= tekst.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h;
  }

  var JUIST = 4224014146;          /* het afgesproken wachtwoord */
  var SLEUTEL = 'dvl.toegang';     /* onthouden binnen deze browsersessie */

  function klopt(ingevoerd) {
    return vermaal(String(ingevoerd).trim().toLowerCase()) === JUIST;
  }

  function alBinnen() {
    try {
      return window.sessionStorage.getItem(SLEUTEL) === '1';
    } catch (e) {
      return false;   /* privémodus of geblokkeerde opslag: gewoon vragen */
    }
  }

  function onthoud() {
    try {
      window.sessionStorage.setItem(SLEUTEL, '1');
    } catch (e) {
      /* Niet kunnen onthouden is geen ramp; dan vraagt hij het opnieuw. */
    }
  }

  function ontgrendel(scherm) {
    document.documentElement.classList.remove('is-vergrendeld');
    if (scherm) {
      scherm.classList.add('is-open');
      window.setTimeout(function () {
        if (scherm.parentNode) scherm.parentNode.removeChild(scherm);
      }, 320);
    }
    /* De beheerpagina bouwt zichzelf pas op als hij zichtbaar is; sommige
       maten kloppen anders niet. */
    window.dispatchEvent(new Event('resize'));
  }

  function bouwScherm() {
    var scherm = document.createElement('div');
    scherm.className = 'slot';
    scherm.id = 'slot';
    scherm.innerHTML =
      '<div class="slot-doos" role="dialog" aria-modal="true" aria-labelledby="slot-kop">' +
        '<img class="slot-merk" src="assets/dvlingo-merk.png" alt="" aria-hidden="true">' +
        '<h1 class="slot-kop" id="slot-kop">Woordenbeheer</h1>' +
        '<p class="slot-uitleg">Hier zet de quizmaster de woorden klaar die in het spel ' +
          'geraden moeten worden. Voer het wachtwoord in om verder te gaan.</p>' +
        '<form class="slot-form" novalidate>' +
          '<label class="slot-label" for="slot-woord">Wachtwoord</label>' +
          '<input class="slot-invoer" id="slot-woord" type="password" ' +
                 'autocomplete="current-password" spellcheck="false" ' +
                 'aria-describedby="slot-melding">' +
          '<button class="slot-knop" type="submit">Openen</button>' +
        '</form>' +
        '<p class="slot-melding" id="slot-melding" role="alert"></p>' +
        '<p class="slot-terug"><a href="index.html">Terug naar het spel</a></p>' +
      '</div>';
    return scherm;
  }

  function start() {
    /* Staat de pagina niet op slot, dan hoort dit bestand hier niet te werken. */
    if (!document.documentElement.classList.contains('is-vergrendeld')) return;

    if (alBinnen()) {
      ontgrendel(null);
      return;
    }

    var scherm = bouwScherm();
    document.body.appendChild(scherm);

    var form = scherm.querySelector('.slot-form');
    var invoer = scherm.querySelector('.slot-invoer');
    var melding = scherm.querySelector('.slot-melding');
    var pogingen = 0;

    invoer.focus();

    invoer.addEventListener('input', function () {
      melding.textContent = '';
      scherm.classList.remove('is-mis');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (klopt(invoer.value)) {
        onthoud();
        ontgrendel(scherm);
        return;
      }

      pogingen++;
      scherm.classList.remove('is-mis');
      /* Een gedwongen herberekening, anders speelt het schudden niet opnieuw. */
      void scherm.offsetWidth;
      scherm.classList.add('is-mis');

      melding.textContent = pogingen >= 3
        ? 'Nog steeds niet goed. Vraag het wachtwoord aan de docent.'
        : 'Dat wachtwoord klopt niet.';

      invoer.select();
    });
  }

  /* Deze pagina wordt met defer geladen, maar we vangen beide gevallen af. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  DVL.Toegang = {
    /* Handig om het slot weer aan te zetten zonder de browser te sluiten. */
    vergrendelOpnieuw: function () {
      try { window.sessionStorage.removeItem(SLEUTEL); } catch (e) {}
      window.location.reload();
    }
  };

})(window, document);
