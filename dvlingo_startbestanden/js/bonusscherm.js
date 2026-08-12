/* ==========================================================================
   Digitale Vaardigheden Lingo — js/bonusscherm.js
   Het scherm van het bonuswoord.

   Dit bestand is alleen het scherm. Alle logica — welk woord, welke letters
   vrijgegeven zijn, welke letters er nog los liggen en of een gok klopt —
   komt uit DVL.Bonus (js/bonuswoord.js). De opmaak komt uit css/bonuswoord.css
   en staat al in index.html; hier wordt hij alleen gevuld.

   API (SPEC, "API van de twee nieuwe schermen"):

     DVL.Bonusscherm.start({
       stap,        // 1, 2 of 3: 3, 6 of 8 letters staan er al
       seconden,    // 18
       opKlaar      // functie({ geraden, woord, punten })
     });

   Extra opties, buiten het contract om en alleen voor proef- en testpagina's:
     woord      een vast bonuswoord in plaats van een willekeurig woord
     opnieuw    vergeet het lopende woord en kies een nieuw
     pool,      toeval, opslag   worden doorgegeven aan DVL.Bonus

   Het woord blijft het hele spel hetzelfde: het scherm onthoudt de staat van
   DVL.Bonus tussen de drie kansen door. Raadt de speler het woord na kans 1
   of 2, dan komt er bij de volgende kans een nieuw woord dat weer met drie
   letters begint — precies zoals de SPEC het beschrijft.

   Invullen kan op drie manieren, en alle drie werken ze naast elkaar:
     1. typen: de letter valt in de eerstvolgende open plek;
     2. een schijf aanklikken en dan een vakje aanklikken;
     3. een schijf naar een vakje slepen, met de muis of met een vinger.
   Verder: Backspace neemt terug, Enter bevestigt, en met de pijltjestoetsen
   loop je langs de schijven en de vakjes, zodat het ook zonder muis gaat.

   De klok loopt achttien seconden. Loopt hij af, dan is de kans voorbij: dat
   is een gemiste kans en geen fout, dus geen rood en geen strafgeluid.
   ========================================================================== */

(function (window, document) {
  'use strict';

  var DVL = window.DVL = window.DVL || {};

  /* ------------------------------------------------------------------ maten */

  var SECONDEN = 18;          /* de tijd per kans, uit de SPEC */
  var KRITIEK = 5;            /* vanaf hier tikt de klok rood */
  var PUNTEN_BASIS = 150;     /* punten voor een goed geraden bonuswoord */
  var PUNTEN_SECONDE = 10;    /* en dit per hele seconde die overblijft */
  var SLEEPGRENS = 6;         /* px voordat een druk een sleep wordt */
  var WACHT_GOED = 2600;      /* hoelang het feestje na een goede gok duurt */
  var WACHT_OP = 2600;        /* en hoelang het woord na de tijd blijft staan */

  /* --------------------------------------------------------------- gereedschap */

  function zoek(kies, binnen) {
    return (binnen || document).querySelector(kies);
  }

  function rustig() {
    return !!(window.matchMedia &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* Geluid mag ontbreken; het spel loopt dan gewoon door. */
  function klink(naam, extra) {
    var audio = DVL.Audio;
    if (!audio || typeof audio[naam] !== 'function') return false;
    try { return audio[naam](extra); } catch (fout) { return false; }
  }

  function tussen(waarde, laag, hoog) {
    waarde = Math.floor(Number(waarde));
    if (!isFinite(waarde)) return laag;
    if (waarde < laag) return laag;
    if (waarde > hoog) return hoog;
    return waarde;
  }

  function stapGrens(stap) {
    return tussen(stap, 1, (DVL.Bonus && DVL.Bonus.STAPPEN ? DVL.Bonus.STAPPEN.length : 3));
  }

  /* Een korte beweging zonder eigen CSS: css/bonuswoord.css is niet van dit
     bestand, dus schudden gaat via de animatie-API van de browser. */
  function schud(el) {
    if (!el || typeof el.animate !== 'function' || rustig()) return;
    try {
      el.animate([
        { translate: '0' }, { translate: '-11px' }, { translate: '11px' },
        { translate: '-7px' }, { translate: '5px' }, { translate: '0' }
      ], { duration: 420, easing: 'cubic-bezier(.36,.07,.19,.97)' });
    } catch (fout) { /* zonder beweging is het scherm nog steeds te spelen */ }
  }

  /* --------------------------------------------------------------- de opmaak */

  /* De opmaak staat in index.html. Ontbreekt er een onderdeel — in een
     proefpagina, of omdat iemand het weghaalde — dan wordt het hier alsnog
     aangemaakt, zodat het scherm nooit half werkt. */
  function zorgVoorOpmaak() {
    var scherm = document.getElementById('scherm-bonus');
    if (!scherm) return null;

    function zorg(kies, maak) {
      var el = zoek(kies, scherm);
      if (!el) { el = maak(); scherm.appendChild(el); }
      return el;
    }

    var rij = zorg('.bonus-rij', function () {
      var el = document.createElement('div');
      el.className = 'bonus-rij';
      el.setAttribute('role', 'group');
      el.setAttribute('aria-label', 'Het bonuswoord');
      return el;
    });

    var voorraad = zorg('.bonus-voorraad', function () {
      var el = document.createElement('div');
      el.className = 'bonus-voorraad';
      el.setAttribute('role', 'group');
      el.setAttribute('aria-label', 'Letters die nog geplaatst moeten worden');
      return el;
    });

    var klok = zorg('.bonus-klok', function () {
      var el = document.createElement('p');
      el.className = 'bonus-klok';
      el.innerHTML = '<span class="bonus-klok-label">Tijd</span><span class="bonus-klok-getal"></span>';
      return el;
    });

    var melding = zorg('.bonus-melding', function () {
      var el = document.createElement('p');
      el.className = 'bonus-melding';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      return el;
    });

    /* Het getal in de klok staat los van het opschrift "Tijd"; is er geen
       apart vakje, dan schrijft de klok zelf. */
    var getal = zoek('#bonus-klok-getal', klok) || zoek('.bonus-klok-getal', klok);
    if (!getal) {
      getal = document.createElement('span');
      getal.className = 'bonus-klok-getal';
      klok.appendChild(getal);
    }

    return {
      scherm: scherm,
      rij: rij,
      voorraad: voorraad,
      klok: klok,
      klokGetal: getal,
      melding: melding,
      uitleg: zoek('#bonus-uitleg', scherm) || zoek('.ondertitel', scherm)
    };
  }

  function toonScherm(scherm) {
    var alle = document.querySelectorAll('.scherm');
    for (var i = 0; i < alle.length; i++) {
      alle[i].classList.toggle('is-actief', alle[i] === scherm);
    }
    if (window.scrollTo) { try { window.scrollTo(0, 0); } catch (fout) { /* ok */ } }
  }

  /* ------------------------------------------------------- staat over levels */

  /* De staat van DVL.Bonus blijft tussen de drie kansen bestaan; alleen na een
     goede gok komt er een nieuw woord. `stapVerschuiving` onthoudt hoeveel
     stappen dat nieuwe woord achterloopt op het level dat game.js meegeeft:
     raadt de speler het woord na level 1, dan is level 2 voor het verse woord
     weer stap 1. */
  var staat = null;
  var stapVerschuiving = 0;
  var ronde = null;           /* alles van de kans die nu op het scherm staat */

  function bonusOpties(opties) {
    var uit = {};
    if (opties.toeval) uit.toeval = opties.toeval;
    if (opties.opslag) uit.opslag = opties.opslag;
    if (opties.pool) uit.pool = opties.pool;
    return uit;
  }

  /* Een vast woord (proefpagina en tests) gaat buiten de geschiedenis om: het
     zou zonde zijn als een proefronde een woord uit de pool opbrandt. */
  function losseOpslag() {
    var doos = {};
    return {
      getItem: function (s) { return Object.prototype.hasOwnProperty.call(doos, s) ? doos[s] : null; },
      setItem: function (s, w) { doos[s] = String(w); },
      removeItem: function (s) { delete doos[s]; }
    };
  }

  function bepaalStaat(opties) {
    var gevraagd = stapGrens(opties.stap);
    var vast = opties.woord ? String(opties.woord).toUpperCase() : '';

    /* Een vers potje: er is nog niets, of de aanroeper vraagt er om. Dan telt
       de stap van game.js gewoon één op één. */
    var versPotje = !staat || opties.opnieuw === true || (vast && staat.woord !== vast);
    /* Midden in een potje het woord al geraden: er komt een nieuw woord dat
       weer met drie letters begint, dus vanaf hier loopt de stap achter op het
       level dat game.js meegeeft. */
    var naRaden = !versPotje && staat.geraden;

    if (versPotje || naRaden) {
      var extra = bonusOpties(opties);
      if (vast) {
        extra.pool = [vast];
        if (!opties.opslag) extra.opslag = losseOpslag();
      }
      if (naRaden && !vast) {
        /* volgendeStap kiest zelf een vers woord én sluit het geraden woord uit */
        staat = DVL.Bonus.volgendeStap(staat, extra);
      } else {
        staat = DVL.Bonus.nieuwSpel(extra);
      }
      stapVerschuiving = versPotje ? 0 : (gevraagd - 1);
    }

    staat.stap = stapGrens(gevraagd - stapVerschuiving);
    return staat;
  }

  /* --------------------------------------------------------------- opbouwen */

  function maakVak(index, letter) {
    var vast = letter !== null && letter !== undefined;
    var el;

    if (vast) {
      /* Een vrijgegeven letter is geen knop: er valt niets aan te doen. */
      el = document.createElement('div');
      el.className = 'bonus-vak is-vrij';
      el.textContent = letter;
      el.setAttribute('data-letter', letter);
    } else {
      el = document.createElement('button');
      el.type = 'button';
      el.className = 'bonus-vak is-leeg';
    }
    el.setAttribute('data-plek', String(index + 1));
    return { el: el, index: index, vast: vast, letter: vast ? letter : '', schijf: null };
  }

  function maakSchijf(letter, index) {
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'bonus-schijf';
    el.setAttribute('data-letter', letter);
    el.setAttribute('aria-label', 'Letter ' + letter);
    el.setAttribute('aria-pressed', 'false');
    el.textContent = letter;
    return { el: el, letter: letter, index: index, gebruikt: false };
  }

  function bouw(r) {
    var i;
    var masker = DVL.Bonus.masker(staat, staat.stap);
    var letters = DVL.Bonus.voorraad(staat, staat.stap);

    r.vakken = [];
    r.rij.textContent = '';
    for (i = 0; i < masker.length; i++) {
      var vak = maakVak(i, masker[i]);
      r.vakken.push(vak);
      r.rij.appendChild(vak.el);
    }

    r.schijven = [];
    r.voorraad.textContent = '';
    for (i = 0; i < letters.length; i++) {
      var schijf = maakSchijf(letters[i], i);
      r.schijven.push(schijf);
      r.voorraad.appendChild(schijf.el);
    }

    werkVakkenBij(r);
    zetActief(r, eersteOpen(r, 0));
  }

  /* ------------------------------------------------------------ hulpvragen */

  function eersteOpen(r, vanaf) {
    var i;
    for (i = Math.max(0, vanaf); i < r.vakken.length; i++) {
      if (!r.vakken[i].vast && !r.vakken[i].letter) return i;
    }
    for (i = 0; i < r.vakken.length; i++) {
      if (!r.vakken[i].vast && !r.vakken[i].letter) return i;
    }
    return -1;
  }

  function laatsteGevuld(r, voor) {
    var grens = (voor === undefined || voor < 0) ? r.vakken.length : voor;
    for (var i = grens - 1; i >= 0; i--) {
      if (!r.vakken[i].vast && r.vakken[i].letter) return i;
    }
    for (var j = r.vakken.length - 1; j >= 0; j--) {
      if (!r.vakken[j].vast && r.vakken[j].letter) return j;
    }
    return -1;
  }

  function vrijeSchijf(r, letter) {
    for (var i = 0; i < r.schijven.length; i++) {
      if (!r.schijven[i].gebruikt && r.schijven[i].letter === letter) return r.schijven[i];
    }
    return null;
  }

  function isVol(r) {
    for (var i = 0; i < r.vakken.length; i++) {
      if (!r.vakken[i].vast && !r.vakken[i].letter) return false;
    }
    return true;
  }

  function gevuldWoord(r) {
    var uit = '';
    for (var i = 0; i < r.vakken.length; i++) uit += (r.vakken[i].letter || ' ');
    return uit;
  }

  function vakVanElement(r, el) {
    if (!el || !el.getAttribute) return null;
    var plek = Number(el.getAttribute('data-plek'));
    if (!plek) return null;
    return r.vakken[plek - 1] || null;
  }

  function schijfVanElement(r, el) {
    for (var i = 0; i < r.schijven.length; i++) {
      if (r.schijven[i].el === el) return r.schijven[i];
    }
    return null;
  }

  /* ------------------------------------------------------------ bijwerken */

  function werkVakBij(r, vak) {
    if (vak.vast) {
      vak.el.className = 'bonus-vak is-vrij';
      return;
    }
    var actief = (r.actief === vak.index && !r.afgerond);
    var klassen = 'bonus-vak ' + (vak.letter ? 'is-gevuld' : 'is-leeg');
    if (actief) klassen += ' is-actief';
    vak.el.className = klassen;

    if (vak.letter) {
      vak.el.textContent = vak.letter;
      vak.el.setAttribute('data-letter', vak.letter);
      vak.el.setAttribute('aria-label',
        'Plek ' + (vak.index + 1) + ': ' + vak.letter + '. Klik om de letter terug te nemen.');
    } else {
      vak.el.textContent = '';
      vak.el.removeAttribute('data-letter');
      vak.el.setAttribute('aria-label',
        'Plek ' + (vak.index + 1) + ': leeg' + (actief ? ', hier komt de volgende letter' : ''));
    }
  }

  function werkVakkenBij(r) {
    for (var i = 0; i < r.vakken.length; i++) werkVakBij(r, r.vakken[i]);
  }

  function werkSchijfBij(r, schijf) {
    schijf.el.classList.toggle('is-gebruikt', schijf.gebruikt);
    schijf.el.disabled = schijf.gebruikt;
    schijf.el.setAttribute('aria-pressed', r.gekozen === schijf ? 'true' : 'false');
    schijf.el.classList.toggle('is-opgepakt', r.gekozen === schijf);
    schijf.el.tabIndex = schijf.gebruikt ? -1 : 0;
    schijf.el.setAttribute('aria-label', schijf.gebruikt
      ? 'Letter ' + schijf.letter + ', al geplaatst'
      : 'Letter ' + schijf.letter);
  }

  function werkSchijvenBij(r) {
    for (var i = 0; i < r.schijven.length; i++) werkSchijfBij(r, r.schijven[i]);
  }

  function zetActief(r, index) {
    r.actief = index;
    werkVakkenBij(r);
  }

  function meld(r, tekst, soort) {
    if (!r.melding) return;
    r.melding.textContent = tekst || '';
    r.melding.className = 'bonus-melding' + (soort ? ' ' + soort : '');
  }

  function kies(r, schijf) {
    r.gekozen = (r.gekozen === schijf) ? null : schijf;
    werkSchijvenBij(r);
  }

  function laatLos(r) {
    if (!r.gekozen) return;
    r.gekozen = null;
    werkSchijvenBij(r);
  }

  /* --------------------------------------------------------- letters zetten */

  /* Legt een schijf in een vak. Lag er al een letter, dan gaat die eerst
     terug naar de voorraad — zo kun je een vakje verbeteren zonder eerst te
     wissen. */
  function plaats(r, index, schijf) {
    if (r.afgerond) return false;
    var vak = r.vakken[index];
    if (!vak || vak.vast || !schijf || schijf.gebruikt) return false;

    if (vak.letter && vak.schijf) {
      vak.schijf.gebruikt = false;
      werkSchijfBij(r, vak.schijf);
    }

    vak.letter = schijf.letter;
    vak.schijf = schijf;
    schijf.gebruikt = true;

    if (r.gekozen === schijf) r.gekozen = null;

    werkSchijfBij(r, schijf);
    zetActief(r, eersteOpen(r, index + 1));
    werkSchijvenBij(r);

    klink('letterAanwezig');
    controleerVol(r);
    return true;
  }

  function neemTerug(r, index) {
    if (r.afgerond) return false;
    var vak = r.vakken[index];
    if (!vak || vak.vast || !vak.letter) return false;

    if (vak.schijf) {
      vak.schijf.gebruikt = false;
      werkSchijfBij(r, vak.schijf);
    }
    vak.letter = '';
    vak.schijf = null;

    zetActief(r, index);
    klink('toets');
    meld(r, '', '');
    return true;
  }

  function typLetter(r, letter) {
    var schijf = vrijeSchijf(r, letter);
    if (!schijf) {
      klink('ongeldig');
      meld(r, 'De letter ' + letter + ' ligt er niet (meer).', 'is-hint');
      schud(r.voorraad);
      return false;
    }
    var doel = (r.actief >= 0 && !r.vakken[r.actief].letter) ? r.actief : eersteOpen(r, 0);
    if (doel < 0) {
      meld(r, 'Alle vakjes staan vol. Enter bevestigt.', 'is-hint');
      return false;
    }
    return plaats(r, doel, schijf);
  }

  function neemLaatsteTerug(r) {
    var index = -1;
    if (r.actief >= 0 && r.vakken[r.actief] && r.vakken[r.actief].letter) index = r.actief;
    else index = laatsteGevuld(r, r.actief >= 0 ? r.actief : -1);
    if (index < 0) return false;
    return neemTerug(r, index);
  }

  /* Alles vol? Klopt het woord, dan is het meteen feest: de speler hoeft dan
     niet nog eens op Enter te drukken. Klopt het niet, dan gebeurt er niets —
     zo kost een verkeerde volgorde geen kans, maar alleen tijd. */
  function controleerVol(r) {
    if (!isVol(r)) return;
    var uitslag = DVL.Bonus.raad(staat, gevuldWoord(r));
    if (uitslag.goed) {
      staat = uitslag.staat;
      goedGeraden(r);
    } else {
      meld(r, 'Alles staat vol. Druk op Enter om te bevestigen.', 'is-hint');
    }
  }

  function bevestig(r) {
    if (r.afgerond) return;
    if (!isVol(r)) {
      klink('ongeldig');
      meld(r, 'Vul eerst alle open vakjes.', 'is-hint');
      schud(r.rij);
      return;
    }
    var uitslag = DVL.Bonus.raad(staat, gevuldWoord(r));
    if (uitslag.goed) {
      staat = uitslag.staat;
      goedGeraden(r);
      return;
    }
    klink('woordFout');
    meld(r, 'Nog niet. Probeer een andere volgorde.', 'is-fout');
    schud(r.rij);
  }

  /* ------------------------------------------------------------- de klok */

  function toonKlok(r) {
    var rest = r.restMs / (r.seconden * 1000);
    if (!(rest >= 0)) rest = 0;
    if (rest > 1) rest = 1;

    var seconden = Math.ceil(r.restMs / 1000);
    if (seconden < 0) seconden = 0;

    /* Bij een rustige weergave springt de ring per seconde in plaats van
       vloeiend mee te lopen; het getal blijft leidend. */
    var waarde = r.rustig ? (seconden / r.seconden) : rest;
    r.klok.style.setProperty('--klok-rest', String(Math.round(waarde * 1000) / 1000));

    if (r.klokGetal) r.klokGetal.textContent = String(seconden);
    else r.klok.textContent = String(seconden);
    r.klok.setAttribute('aria-label', 'Nog ' + seconden + ' seconden');

    var kritiek = seconden <= KRITIEK && seconden > 0;
    r.klok.classList.toggle('is-kritiek', kritiek);
    if (kritiek && !r.kritiekGemeld) {
      r.kritiekGemeld = true;
      klink('tijdBijnaOp');
    }
  }

  function tik(r) {
    if (r.afgerond || r.gepauzeerd) return;
    r.restMs = r.eindTijd - Date.now();
    if (r.restMs <= 0) {
      r.restMs = 0;
      toonKlok(r);
      tijdOp(r);
      return;
    }
    toonKlok(r);
    r.raf = window.requestAnimationFrame(function () { tik(r); });
  }

  function startKlok(r) {
    r.eindTijd = Date.now() + r.seconden * 1000;
    r.restMs = r.seconden * 1000;
    r.gepauzeerd = false;
    r.klok.classList.remove('is-loopt', 'is-kritiek');
    toonKlok(r);
    r.raf = window.requestAnimationFrame(function () { tik(r); });
  }

  function stopKlok(r) {
    if (r.raf) { window.cancelAnimationFrame(r.raf); r.raf = null; }
  }

  function pauzeer(r) {
    if (!r || r.afgerond || r.gepauzeerd) return;
    r.restMs = Math.max(0, r.eindTijd - Date.now());
    r.gepauzeerd = true;
    stopKlok(r);
  }

  function hervat(r) {
    if (!r || r.afgerond || !r.gepauzeerd) return;
    r.gepauzeerd = false;
    r.eindTijd = Date.now() + r.restMs;
    r.raf = window.requestAnimationFrame(function () { tik(r); });
  }

  /* ------------------------------------------------------------- afloop */

  /* Het hele woord in beeld: wat de speler zelf neerlegde blijft staan, wat
     ontbreekt of verkeerd staat wordt goedgezet. De cursor en de losse
     letters zijn hier klaar, dus alles staat verder stil. */
  function toonHeleWoord(r) {
    for (var i = 0; i < r.vakken.length; i++) {
      var vak = r.vakken[i];
      if (vak.vast) continue;
      var juist = staat.woord.charAt(i);
      if (vak.letter !== juist) {
        if (vak.schijf) { vak.schijf.gebruikt = false; werkSchijfBij(r, vak.schijf); }
        vak.letter = juist;
        vak.schijf = null;
        vak.el.textContent = juist;
        vak.el.setAttribute('data-letter', juist);
      }
      vak.el.className = 'bonus-vak is-gevuld';
      vak.el.setAttribute('aria-label', 'Plek ' + (i + 1) + ': ' + juist);
    }
  }

  /* Een klein feest: de vakjes kleuren een voor een rood, zoals goede letters
     op het bord, met het bijbehorende tikje geluid. */
  function feest(r) {
    var traag = rustig();
    for (var i = 0; i < r.vakken.length; i++) {
      (function (vak, n) {
        var doen = function () {
          vak.el.className = 'bonus-vak is-vrij';
          klink('letterGoed');
        };
        if (traag) doen();
        else r.wachters.push(window.setTimeout(doen, 70 * n));
      })(r.vakken[i], i);
    }
    r.wachters.push(window.setTimeout(function () { klink('rondeGehaald'); }, traag ? 0 : 900));
  }

  function goedGeraden(r) {
    if (r.afgerond) return;
    r.afgerond = true;
    stopKlok(r);
    r.klok.classList.remove('is-kritiek');

    /* De resterende tijd telt mee, maar nooit meer dan de achttien seconden
       uit de SPEC: een proefpagina die de klok ruimer zet, blaast de score
       anders op. Hoogste score is dus 150 + 18 x 10 = 330. */
    var over = Math.min(SECONDEN, Math.max(0, Math.ceil(r.restMs / 1000)));
    var punten = PUNTEN_BASIS + PUNTEN_SECONDE * over;

    laatLos(r);
    werkSchijvenBij(r);
    toonHeleWoord(r);
    klink('woordGoed');
    feest(r);
    meld(r, 'Goed! ' + staat.woord + ' — ' + punten + ' punten.', 'is-goed');

    r.wachters.push(window.setTimeout(function () {
      klaar(r, { geraden: true, woord: staat.woord, punten: punten });
    }, rustig() ? 900 : WACHT_GOED));
  }

  /* De tijd op is geen fout. Geen rood, geen strafgeluid: het woord komt in
     beeld, de melding is geel en het spel loopt gewoon verder. */
  function tijdOp(r) {
    if (r.afgerond) return;
    r.afgerond = true;
    stopKlok(r);
    r.klok.classList.remove('is-kritiek');
    r.klok.style.setProperty('--klok-rest', '0');

    laatLos(r);
    werkSchijvenBij(r);
    klink('hint');

    /* Het woord blijft over de drie levels hetzelfde en komt straks terug met
       meer letters vrij. Het hier tonen maakt de volgende twee kansen zinloos,
       dus dat gebeurt alleen nog bij de allerlaatste kans. */
    if (r.laatsteKans) {
      toonHeleWoord(r);
      meld(r, 'Tijd voorbij. Het woord was ' + staat.woord + '.', 'is-hint');
    } else {
      meld(r, 'Tijd voorbij. Dit woord komt terug na het volgende level, ' +
              'en dan staan er meer letters voor je klaar.', 'is-hint');
    }

    r.wachters.push(window.setTimeout(function () {
      klaar(r, { geraden: false, woord: staat.woord, punten: 0 });
    }, rustig() ? 900 : WACHT_OP));
  }

  function klaar(r, resultaat) {
    if (r.gemeld) return;
    r.gemeld = true;
    opruimen(r);
    if (ronde === r) ronde = null;
    if (typeof r.opKlaar === 'function') {
      try { r.opKlaar(resultaat); } catch (fout) {
        if (window.console && console.error) console.error('Bonusscherm: opKlaar viel om.', fout);
      }
    }
  }

  /* -------------------------------------------------------------- slepen */

  function stopSleep(r, geplaatst) {
    var s = r.sleep;
    if (!s) return;
    if (s.spook && s.spook.parentNode) s.spook.parentNode.removeChild(s.spook);
    if (s.doel) s.doel.classList.remove('is-over');
    if (s.schijf) {
      s.schijf.el.classList.remove('is-opgepakt');
      s.schijf.el.style.opacity = '';
      try { s.schijf.el.releasePointerCapture(s.id); } catch (fout) { /* al los */ }
    }
    r.sleep = null;
    /* Na een echte sleep komt er nog een click achteraan; die zou de schijf
       alsnog selecteren. Even doof zijn dus. Een tijdstempel en geen vlaggetje:
       die click hoeft niet te komen, en dan blijft een vlaggetje hangen. */
    if (s.bezig) r.doofTot = Date.now() + 260;
    if (!geplaatst && s.bezig) klink('toets');
  }

  function maakSpook(r, schijf, x, y, aanraking) {
    var spook = schijf.el.cloneNode(true);
    spook.classList.add('is-gesleept');
    spook.classList.remove('is-gebruikt');
    spook.disabled = false;
    spook.removeAttribute('id');
    spook.setAttribute('aria-hidden', 'true');
    spook.style.position = 'fixed';
    spook.style.margin = '0';
    spook.style.zIndex = '90';
    spook.style.pointerEvents = 'none';
    spook.style.rotate = '0deg';
    spook.style.translate = aanraking ? '-50% -125%' : '-50% -50%';
    spook.style.left = x + 'px';
    spook.style.top = y + 'px';
    document.body.appendChild(spook);
    return spook;
  }

  function vakOnder(r, x, y) {
    var el = document.elementFromPoint(x, y);
    if (!el || !el.closest) return null;
    var doel = el.closest('.bonus-vak');
    if (!doel) return null;
    var vak = vakVanElement(r, doel);
    if (!vak || vak.vast) return null;
    return vak;
  }

  function opPointerDown(r, e) {
    if (r.afgerond) return;
    if (e.button !== undefined && e.button > 0) return;
    var el = e.target && e.target.closest ? e.target.closest('.bonus-schijf') : null;
    if (!el || el.disabled) return;
    var schijf = schijfVanElement(r, el);
    if (!schijf || schijf.gebruikt) return;

    r.sleep = {
      schijf: schijf, id: e.pointerId, bezig: false, doel: null, spook: null,
      x0: e.clientX, y0: e.clientY, aanraking: e.pointerType === 'touch'
    };
    try { el.setPointerCapture(e.pointerId); } catch (fout) { /* niet erg */ }
  }

  function opPointerMove(r, e) {
    var s = r.sleep;
    if (!s || e.pointerId !== s.id) return;

    if (!s.bezig) {
      var dx = e.clientX - s.x0, dy = e.clientY - s.y0;
      if (dx * dx + dy * dy < SLEEPGRENS * SLEEPGRENS) return;
      s.bezig = true;
      s.spook = maakSpook(r, s.schijf, e.clientX, e.clientY, s.aanraking);
      s.schijf.el.classList.add('is-opgepakt');
      s.schijf.el.style.opacity = '.35';
      if (r.gekozen) laatLos(r);
      meld(r, 'Laat los boven een leeg vakje.', '');
    }

    e.preventDefault();
    s.spook.style.left = e.clientX + 'px';
    s.spook.style.top = e.clientY + 'px';

    var vak = vakOnder(r, e.clientX, e.clientY);
    var doelEl = vak ? vak.el : null;
    if (s.doel !== doelEl) {
      if (s.doel) s.doel.classList.remove('is-over');
      if (doelEl) doelEl.classList.add('is-over');
      s.doel = doelEl;
    }
  }

  function opPointerUp(r, e) {
    var s = r.sleep;
    if (!s || e.pointerId !== s.id) return;
    if (!s.bezig) { stopSleep(r, false); return; }

    var vak = vakOnder(r, e.clientX, e.clientY);
    var schijf = s.schijf;
    stopSleep(r, !!vak);
    if (vak) {
      plaats(r, vak.index, schijf);
      meld(r, '', '');
    }
  }

  /* --------------------------------------------------------------- klikken */

  function opKlikVoorraad(r, e) {
    if (Date.now() < r.doofTot) return;
    var el = e.target && e.target.closest ? e.target.closest('.bonus-schijf') : null;
    if (!el || el.disabled) return;
    var schijf = schijfVanElement(r, el);
    if (!schijf || schijf.gebruikt) return;

    /* Een klik met de muis kiest de schijf; die leg je daarna in een vakje.
       Een druk op de spatiebalk (detail 0) legt hem meteen in het actieve
       vakje neer, want zonder muis is er geen tweede klik. */
    if (e.detail === 0) {
      var doel = (r.actief >= 0) ? r.actief : eersteOpen(r, 0);
      if (doel >= 0) plaats(r, doel, schijf);
      return;
    }
    kies(r, schijf);
    if (r.gekozen) meld(r, 'Klik nu op een leeg vakje.', '');
    else meld(r, '', '');
  }

  function opKlikRij(r, e) {
    if (Date.now() < r.doofTot) return;
    var el = e.target && e.target.closest ? e.target.closest('.bonus-vak') : null;
    if (!el) return;
    var vak = vakVanElement(r, el);
    if (!vak || vak.vast) return;

    if (r.gekozen) {
      plaats(r, vak.index, r.gekozen);
      meld(r, '', '');
      return;
    }
    if (vak.letter) { neemTerug(r, vak.index); return; }
    zetActief(r, vak.index);
  }

  /* ---------------------------------------------------------- toetsenbord */

  function focusSchijf(r, richting, vanaf) {
    var n = r.schijven.length;
    if (!n) return false;
    var start = (vanaf === undefined || vanaf < 0) ? (richting > 0 ? -1 : n) : vanaf;
    for (var i = 1; i <= n; i++) {
      var j = ((start + richting * i) % n + n) % n;
      if (!r.schijven[j].gebruikt) {
        try { r.schijven[j].el.focus({ preventScroll: true }); } catch (fout) { r.schijven[j].el.focus(); }
        return true;
      }
    }
    return false;
  }

  function focusVak(r, richting, vanaf) {
    var n = r.vakken.length;
    var start = (vanaf === undefined || vanaf < 0) ? (richting > 0 ? -1 : n) : vanaf;
    for (var i = 1; i <= n; i++) {
      var j = ((start + richting * i) % n + n) % n;
      if (!r.vakken[j].vast) {
        try { r.vakken[j].el.focus({ preventScroll: true }); } catch (fout) { r.vakken[j].el.focus(); }
        return true;
      }
    }
    return false;
  }

  function opToetsVoorraad(r, e) {
    var el = e.target && e.target.closest ? e.target.closest('.bonus-schijf') : null;
    var schijf = el ? schijfVanElement(r, el) : null;
    var vanaf = schijf ? schijf.index : -1;

    if (e.key === 'ArrowRight') { e.preventDefault(); focusSchijf(r, 1, vanaf); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); focusSchijf(r, -1, vanaf); }
    else if (e.key === 'Home') { e.preventDefault(); focusSchijf(r, 1, -1); }
    else if (e.key === 'End') { e.preventDefault(); focusSchijf(r, -1, -1); }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusVak(r, 1, (r.actief >= 0 ? r.actief - 1 : -1));
    }
  }

  function opToetsRij(r, e) {
    var el = e.target && e.target.closest ? e.target.closest('.bonus-vak') : null;
    var vak = el ? vakVanElement(r, el) : null;
    var vanaf = vak ? vak.index : -1;

    if (e.key === 'ArrowRight') { e.preventDefault(); focusVak(r, 1, vanaf); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); focusVak(r, -1, vanaf); }
    else if (e.key === 'Home') { e.preventDefault(); focusVak(r, 1, -1); }
    else if (e.key === 'End') { e.preventDefault(); focusVak(r, -1, -1); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); focusSchijf(r, 1, -1); }
  }

  function opToets(r, e) {
    if (r.afgerond || e.defaultPrevented) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    var doel = e.target;
    var tag = doel && doel.tagName ? doel.tagName.toUpperCase() : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ||
        (doel && doel.isContentEditable)) return;

    var toets = e.key;

    if (toets === 'Enter') { e.preventDefault(); bevestig(r); return; }

    if (toets === 'Backspace') { e.preventDefault(); neemLaatsteTerug(r); return; }

    if (toets === ' ' || toets === 'Spacebar' || toets === 'Space') {
      /* Staat de focus op een schijf of een vakje, dan doet de knop zelf het
         werk; dat is de gewone werking van een knop en die laten we staan. */
      if (doel && doel.closest && doel.closest('.bonus-schijf,.bonus-vak')) return;
      e.preventDefault();
      if (r.gekozen && r.actief >= 0) plaats(r, r.actief, r.gekozen);
      else focusSchijf(r, 1, -1);
      return;
    }

    if (toets && toets.length === 1 && /[a-zA-Z]/.test(toets)) {
      e.preventDefault();
      typLetter(r, toets.toUpperCase());
      return;
    }

    /* Pijltjes buiten de rij en de voorraad brengen de speler daar naartoe. */
    if (toets === 'ArrowRight' || toets === 'ArrowLeft' ||
        toets === 'ArrowUp' || toets === 'ArrowDown') {
      if (doel && doel.closest && doel.closest('.bonus-rij,.bonus-voorraad')) return;
      e.preventDefault();
      focusSchijf(r, toets === 'ArrowLeft' || toets === 'ArrowUp' ? -1 : 1, -1);
    }
  }

  /* ------------------------------------------------------- aan- en afkoppelen */

  function koppel(r) {
    r.luisteraars = [];

    function aan(el, naam, doe, opties) {
      el.addEventListener(naam, doe, opties);
      r.luisteraars.push([el, naam, doe, opties]);
    }

    aan(r.voorraad, 'click', function (e) { opKlikVoorraad(r, e); });
    aan(r.rij, 'click', function (e) { opKlikRij(r, e); });
    aan(r.voorraad, 'keydown', function (e) { opToetsVoorraad(r, e); });
    aan(r.rij, 'keydown', function (e) { opToetsRij(r, e); });

    aan(r.voorraad, 'pointerdown', function (e) { opPointerDown(r, e); });
    aan(document, 'pointermove', function (e) { opPointerMove(r, e); }, { passive: false });
    aan(document, 'pointerup', function (e) { opPointerUp(r, e); });
    aan(document, 'pointercancel', function () { stopSleep(r, false); });

    aan(document, 'keydown', function (e) { opToets(r, e); });

    /* Een venster dat naar de achtergrond gaat mag geen kans opeten. Alleen
       wat dit zelf stilzette gaat hier weer lopen: een pauze die het spel
       zelf gaf blijft staan. */
    aan(document, 'visibilitychange', function () {
      if (document.hidden) {
        if (!r.gepauzeerd) { r.vensterPauze = true; pauzeer(r); }
      } else if (r.vensterPauze) {
        r.vensterPauze = false;
        hervat(r);
      }
    });
  }

  function opruimen(r) {
    stopKlok(r);
    stopSleep(r, false);
    var i;
    for (i = 0; i < r.wachters.length; i++) window.clearTimeout(r.wachters[i]);
    r.wachters = [];
    if (r.luisteraars) {
      for (i = 0; i < r.luisteraars.length; i++) {
        var l = r.luisteraars[i];
        l[0].removeEventListener(l[1], l[2], l[3]);
      }
      r.luisteraars = [];
    }
  }

  /* ------------------------------------------------------------------ start */

  var UITLEG = {
    1: 'Drie letters staan er al. Vul de rest aan met de losse letters.',
    2: 'Zes letters staan er al. Vul de rest aan met de losse letters.',
    3: 'Acht letters staan er al. Vul de rest aan met de losse letters.'
  };

  function start(opties) {
    opties = opties || {};

    if (!DVL.Bonus) {
      if (window.console && console.error) {
        console.error('Bonusscherm: js/bonuswoord.js ontbreekt.');
      }
      if (typeof opties.opKlaar === 'function') {
        opties.opKlaar({ geraden: false, woord: '', punten: 0 });
      }
      return null;
    }

    /* Een vorige kans die nog liep, netjes afbreken. */
    if (ronde) { opruimen(ronde); ronde = null; }

    var deel = zorgVoorOpmaak();
    if (!deel) {
      if (window.console && console.warn) {
        console.warn('Bonusscherm: #scherm-bonus ontbreekt in de opmaak.');
      }
      if (typeof opties.opKlaar === 'function') {
        opties.opKlaar({ geraden: false, woord: '', punten: 0 });
      }
      return null;
    }

    bepaalStaat(opties);

    var seconden = Number(opties.seconden);
    if (!isFinite(seconden) || seconden <= 0) seconden = SECONDEN;

    var r = {
      scherm: deel.scherm,
      rij: deel.rij,
      voorraad: deel.voorraad,
      klok: deel.klok,
      klokGetal: deel.klokGetal,
      melding: deel.melding,
      seconden: seconden,
      opKlaar: opties.opKlaar,
      /* Alleen bij de allerlaatste kans mag het woord verklapt worden. Het
         blijft namelijk over de levels heen hetzelfde: wie het na level 1 al
         te lezen krijgt, hoeft de twee volgende kansen niet meer te raden. */
      laatsteKans: opties.laatsteKans === true,
      vakken: [],
      schijven: [],
      actief: -1,
      gekozen: null,
      sleep: null,
      doofTot: 0,
      afgerond: false,
      gemeld: false,
      gepauzeerd: false,
      vensterPauze: false,
      kritiekGemeld: false,
      restMs: seconden * 1000,
      raf: null,
      wachters: [],
      rustig: rustig()
    };
    ronde = r;

    if (deel.uitleg) deel.uitleg.textContent = UITLEG[staat.stap] || UITLEG[1];
    r.klok.style.setProperty('--klok-duur', seconden + 's');

    bouw(r);
    werkSchijvenBij(r);
    koppel(r);

    if (opties.toonScherm !== false) toonScherm(r.scherm);
    meld(r, 'Sleep of typ de letters. Enter bevestigt.', '');
    startKlok(r);

    /* Even wachten met de focus: dan is het scherm al binnengeschoven en
       springt de pagina niet. */
    r.wachters.push(window.setTimeout(function () {
      if (!r.afgerond) focusSchijf(r, 1, -1);
    }, 90));

    return r;
  }

  DVL.Bonusscherm = {
    SECONDEN: SECONDEN,

    start: start,

    /* Voor game.js: het pauzescherm mag de klok stilzetten. */
    pauzeer: function () { pauzeer(ronde); },
    hervat: function () { hervat(ronde); },

    /* Breekt de lopende kans af zonder opKlaar aan te roepen. */
    stop: function () {
      if (!ronde) return;
      opruimen(ronde);
      ronde = null;
    },

    /* De staat van DVL.Bonus die over de levels heen blijft bestaan. */
    staat: function () { return staat; },

    /* Een nieuw spel: vergeet het woord van het vorige potje. */
    vergeet: function () { staat = null; stapVerschuiving = 0; }
  };

})(window, document);
