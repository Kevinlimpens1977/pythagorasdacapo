/* ==========================================================================
   Digitale Vaardigheden Lingo — js/startscherm.js
   Het startscherm dat voor elk level verschijnt.

   Eén scherm, drie invullingen. DVL.Startscherm.toon(1, opStart) vult
   #scherm-start met de teksten van dat level en roept opStart aan zodra de
   speler op START drukt.
   ========================================================================== */

(function (window, document) {
  'use strict';

  var DVL = window.DVL = window.DVL || {};

  /* De drie levels. De naam en de regel eronder volgen de moeilijkheidsgraden
     van het spel; de lengtes bepalen welke woorden er in dat level langskomen. */
  var LEVELS = {
    1: {
      naam: 'MAKKELIJK',
      regel: 'Woorden van 5 letters',
      uitleg: 'Je begint rustig. Elk woord heeft 5 letters en de eerste letter krijg je cadeau.',
      lengtes: [5],
      rondes: 3
    },
    2: {
      naam: 'MOEILIJK',
      regel: 'Woorden van 5 en 6 letters',
      uitleg: 'De woorden worden langer. Dezelfde tijd, meer letters om te vinden.',
      lengtes: [5, 6],
      rondes: 4
    },
    3: {
      naam: 'EXPERT',
      regel: 'Woorden van 5, 6 en 7 letters',
      uitleg: 'Alles komt langs, tot en met 7 letters. Haal de finale en speel om LINGO.',
      lengtes: [5, 6, 7],
      rondes: 5
    }
  };

  var MERK = 'assets/dvlingo-merk.png';
  var MERK_ALT = 'Digitale Vaardigheden Lingo: een lachende jongen achter een laptop, ' +
                 'omringd door tekens voor wifi, chatten, internet en de muisaanwijzer.';

  function tekst(el, waarde) {
    if (el) { el.textContent = waarde; }
  }

  /* Bouwt de opmaak één keer op. Daarna wordt alleen de tekst nog ververst,
     zodat het beeld tussen twee levels niet opnieuw hoeft te laden. */
  function bouw(scherm) {
    if (scherm.querySelector('.start-doos')) { return; }

    var doos = document.createElement('div');
    doos.className = 'start-doos';
    doos.innerHTML =
      '<figure class="start-merk">' +
        '<img src="' + MERK + '" alt="' + MERK_ALT + '">' +
        '<figcaption class="start-lint"><span class="start-lint-tekst"></span></figcaption>' +
      '</figure>' +
      '<h2 class="start-naam"></h2>' +
      '<p class="start-regel"></p>' +
      '<p class="start-uitleg"></p>' +
      '<button type="button" class="start-knop">START</button>' +
      '<p class="start-voet"></p>';

    scherm.appendChild(doos);
  }

  /* Zet de animaties opnieuw in gang bij een volgend level. */
  function herstart(scherm) {
    var lopers = scherm.querySelectorAll(
      '.start-merk,.start-lint,.start-naam,.start-regel,.start-uitleg,.start-knop,.start-voet'
    );
    for (var i = 0; i < lopers.length; i++) {
      var el = lopers[i];
      el.style.animation = 'none';
      /* Een gedwongen herberekening; anders slaat de browser de herstart over. */
      void el.offsetWidth;
      el.style.animation = '';
    }
  }

  var Startscherm = {

    LEVELS: LEVELS,

    /* Geeft de gegevens van een level terug, of die van level 1 bij onzin. */
    level: function (nummer) {
      return LEVELS[nummer] || LEVELS[1];
    },

    /* De voetregel onder de knop. Het aantal rondes staat hier niet vast:
       speelt de quizmaster zijn eigen lijst, dan volgt het aantal die lijst
       en geeft game.js het echte aantal mee. Zonder opgegeven aantal blijft
       het getal uit LEVELS staan. */
    voetregel: function (level, aantalRondes) {
      var aantal = level.rondes;
      if (typeof aantalRondes === 'number' && isFinite(aantalRondes) && aantalRondes > 0) {
        aantal = Math.round(aantalRondes);
      }
      return aantal + (aantal === 1 ? ' ronde' : ' rondes') + ' · 5 pogingen per woord';
    },

    /* Vult #scherm-start met de teksten van dit level en wacht op START.
       opStart wordt hoogstens één keer aangeroepen per aanroep van toon().
       aantalRondes is optioneel; laat je het weg, dan houdt het startscherm
       het vaste aantal van dit level aan. */
    toon: function (nummer, opStart, aantalRondes) {
      var scherm = document.getElementById('scherm-start');
      if (!scherm) { return null; }

      var level = this.level(nummer);
      var sleutel = LEVELS[nummer] ? String(nummer) : '1';

      bouw(scherm);
      scherm.setAttribute('data-level', sleutel);

      tekst(scherm.querySelector('.start-lint-tekst'), 'LEVEL ' + sleutel);
      tekst(scherm.querySelector('.start-naam'), level.naam);
      tekst(scherm.querySelector('.start-regel'), level.regel);
      tekst(scherm.querySelector('.start-uitleg'), level.uitleg);
      tekst(scherm.querySelector('.start-voet'), this.voetregel(level, aantalRondes));

      var knop = scherm.querySelector('.start-knop');
      if (knop) {
        /* De knop wordt vervangen door een kloon, zodat luisteraars van een
           vorig level niet blijven hangen. */
        var nieuw = knop.cloneNode(true);
        /* De kloon erft de uit-stand van de vorige druk; zonder deze regel
           doet START bij een tweede potje niets meer. */
        nieuw.disabled = false;
        knop.parentNode.replaceChild(nieuw, knop);

        nieuw.addEventListener('click', function () {
          nieuw.disabled = true;
          if (typeof opStart === 'function') { opStart(sleutel, level); }
        });

        /* Enter en spatie werken zo meteen, ook zonder muis. */
        window.setTimeout(function () {
          try { nieuw.focus({ preventScroll: true }); } catch (e) { nieuw.focus(); }
        }, 60);
      }

      herstart(scherm);
      return level;
    }
  };

  DVL.Startscherm = Startscherm;

})(window, document);
