/* ==========================================================================
   Digitale Vaardigheden Lingo — js/game.js
   De spel-UI: hangt DVL.Core aan het scherm.

   Rolverdeling:
     DVL.Core    kent de regels, de woorden, de score en de hints.
     game.js     tekent het bord, leest het toetsenbord, houdt de klok bij,
                 praat met DVL.Audio, en regelt de volgorde van het potje.

   Een potje loopt vast: level 1, ballenfase, bonuswoord, level 2,
   ballenfase, bonuswoord, level 3, ballenfase, bonuswoord, eindstand. Er is
   geen levelkeuze meer. Een level loopt tot een aantal goede woorden (4, 3
   en 2) en elk woord krijgt 60 seconden. De ballenfase (DVL.Ballenfase) en
   het bonuswoord (DVL.Bonusscherm) doen hun eigen werk en melden zich af
   met een terugroep; de lingokaartsessie wordt hier één keer gemaakt en
   gaat het hele potje mee.

   De klok loopt via requestAnimationFrame en staat stil zodra het tabblad
   naar de achtergrond gaat of de pauzeknop wordt gebruikt.

   Geen modules, geen externe verzoeken: dit werkt door index.html vanaf
   schijf te openen. Alles hangt aan window.DVL.
   ========================================================================== */
(function () {
  'use strict';

  window.DVL = window.DVL || {};

  /* ---------------------------------------------------------------- hulpjes */

  function zoek(kiezer, wortel) { return (wortel || document).querySelector(kiezer); }
  function zoekAlle(kiezer, wortel) {
    return Array.prototype.slice.call((wortel || document).querySelectorAll(kiezer));
  }
  function nu() {
    return (window.performance && performance.now) ? performance.now() : Date.now();
  }
  function magBewegen() {
    if (!window.matchMedia) return true;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function schoonWoord(tekst) {
    return String(tekst == null ? '' : tekst).toUpperCase().replace(/[^A-Z]/g, '');
  }
  /* Leest een tijd-variabele uit de CSS ("560ms" of "0.56s") als getal in ms. */
  function cssTijd(naam, terugval) {
    try {
      if (!window.getComputedStyle) return terugval;
      var ruw = window.getComputedStyle(document.documentElement)
        .getPropertyValue(naam);
      if (!ruw) return terugval;
      ruw = String(ruw).trim();
      var getal = parseFloat(ruw);
      if (!isFinite(getal) || getal <= 0) return terugval;
      if (/ms$/i.test(ruw)) return getal;
      if (/s$/i.test(ruw)) return getal * 1000;
      return getal;
    } catch (fout) { return terugval; }
  }

  /* ----------------------------------------------------------- vaste waarden */

  var MAX_RIJEN = 5;             // vijf pogingen per woord
  var TIJD_PER_WOORD_MS = 60000; // elk woord krijgt 60 seconden, ongeacht de lengte
  var START_HINTS = 3;
  var BONUS_SECONDEN = 18;       // per kans op het bonuswoord
  var LAATSTE_LEVEL = 3;

  /* Timing van de omdraai-animatie. Er is één plek waar het verspringen wordt
     geregeld en dat is de CSS: `--draai-duur` en `--draai-stap` in
     css/base.css, waarmee css/game.css per kolom een `animation-delay` zet.
     JS verspringt zelf niets meer (alle tegels krijgen `.draait` tegelijk) en
     leest die twee waarden hieronder uit, zodat beide bestanden niet meer uit
     elkaar kunnen lopen. De waarden hier zijn alleen de terugval als het
     uitlezen niet lukt, en staan gelijk aan wat de CSS nu zegt. */
  var FLIP_DUUR_MS = 560;     // --draai-duur: hoe lang één tegel draait
  var FLIP_STAP_MS = 105;     // --draai-stap: vertraging per kolom, uit de CSS
  var FLIP_NASLEEP_MS = 20;   // marge zodat de animatie echt klaar is

  /* ------------------------------------------------------------- elementen */

  var el = {};

  function verzamelElementen() {
    el.bord = zoek('#bord');
    el.ronde = zoek('#ronde');
    el.beurt = zoek('#beurt');
    el.score = zoek('#score');
    el.hints = zoek('#hints');
    el.hintAantal = zoek('#hint-aantal');
    el.tijdbalk = zoek('#tijdbalk');
    el.vulling = el.tijdbalk ? zoek('.vulling', el.tijdbalk) : null;
    el.tijdGetal = zoek('#tijd-getal');
    el.invoer = zoek('#invoer');
    el.bevestig = zoek('#bevestig');
    el.melding = zoek('#melding');
    el.pauze = zoek('#pauze');
    el.terug = zoek('#terug');
    el.toetsenbord = zoek('#toetsenbord');
    el.woordkaart = zoek('#woordkaart');
    el.woordkaartKop = zoek('#woordkaart-kop');
    el.woordkaartWoord = zoek('#woordkaart-woord');
    el.woordkaartUitleg = zoek('#woordkaart-uitleg');
    el.woordkaartPunten = zoek('#woordkaart-punten');
    el.pauzescherm = zoek('#pauzescherm');
    el.uitlegscherm = zoek('#uitlegscherm');
    el.uitslagInhoud = zoek('#uitslag-inhoud');
    el.menuBron = zoek('#menu-bron');
    el.knopUitleg = zoek('#knop-uitleg');
  }

  /* ------------------------------------------------------- geluid (DVL.Audio)
     Het spel mag nooit stukgaan omdat de geluidsmodule ontbreekt of anders
     heet, dus alles gaat door deze schil heen.                              */

  var audioOntgrendeld = false;

  function audio() { return window.DVL.Audio; }

  function roepAudio(namen, argumenten) {
    var A = audio();
    if (!A) return false;
    for (var i = 0; i < namen.length; i++) {
      if (typeof A[namen[i]] === 'function') {
        try { A[namen[i]].apply(A, argumenten || []); return true; }
        catch (fout) { return false; }
      }
    }
    return false;
  }

  // Het spel denkt in eigen namen; deze tabel vertaalt ze naar js/audio.js.
  // Een naam op null blijft bewust stil.
  var GELUIDSNAMEN = {
    toets: 'toets',
    klik: 'toets',
    goed: 'letterGoed',
    aanwezig: 'letterAanwezig',
    fout: null,
    ongeldig: 'ongeldig',
    hint: 'hint',
    winst: 'woordGoed',
    ronde: 'rondeGehaald',
    verlies: 'woordFout',
    tik: 'tijdBijnaOp',
    start: 'start',
    lingo: 'lingo'
  };

  function geluid(naam, index) {
    var A = audio();
    if (!A) return;
    var echt = Object.prototype.hasOwnProperty.call(GELUIDSNAMEN, naam) ? GELUIDSNAMEN[naam] : naam;
    if (!echt) return;
    try {
      if (typeof A[echt] === 'function') { A[echt](index || 0); return; }
      if (typeof A.speel === 'function') { A.speel(echt); return; }
      if (typeof A.play === 'function') { A.play(echt); return; }
    } catch (fout) { /* geluid is nooit een reden om te stoppen */ }
  }

  function ontgrendelAudio() {
    if (audioOntgrendeld) return;
    audioOntgrendeld = true;
    roepAudio(['ontgrendel', 'hervat', 'resume']);
  }

  /* -------------------------------------------------------- kern (DVL.Core) */

  function kern() { return window.DVL.Core; }

  function kernAanwezig() {
    var C = kern();
    return !!(C && typeof C.nieuwSpel === 'function' && typeof C.doeZet === 'function');
  }

  /* Elke aanroep van de kern loopt hierlangs: een fout in de logica mag het
     scherm nooit laten vastlopen. */
  function veilig(naam, terugval) {
    var C = kern();
    var rest = Array.prototype.slice.call(arguments, 2);
    if (!C || typeof C[naam] !== 'function') return terugval;
    try { return C[naam].apply(C, rest); }
    catch (fout) {
      melding('Er ging iets mis in de spellogica. Het spel gaat verder.');
      return terugval;
    }
  }

  /* ------------------------------------------------------- woorden (Opslag) */

  function lijstInstellingen() {
    var uit = { gebruikEigenLijst: false, schud: false };
    try {
      if (window.DVL.Opslag && typeof DVL.Opslag.laadLijst === 'function') {
        var gegevens = DVL.Opslag.laadLijst();
        if (gegevens) {
          /* Alleen een eigen lijst met woorden erin telt als eigen lijst:
             staat de schakelaar aan maar is de lijst leeg, dan levert
             DVL.Opslag.actieveWoorden() de standaardlijst en hoort die ook
             als standaardlijst gespeeld te worden. */
          uit.gebruikEigenLijst = !!gegevens.gebruikEigenLijst &&
            !!(gegevens.woorden && gegevens.woorden.length);
          uit.schud = !!gegevens.schud;
        }
      }
    } catch (fout) { /* standaardinstellingen */ }
    return uit;
  }

  function alleWoorden() {
    var lijst = null;
    try {
      if (window.DVL.Opslag && typeof DVL.Opslag.actieveWoorden === 'function') {
        lijst = DVL.Opslag.actieveWoorden();
      }
    } catch (fout) { lijst = null; }
    if (!lijst || !lijst.length) lijst = window.DVL.STANDAARDWOORDEN || [];

    var uit = [], gezien = {};
    for (var i = 0; i < lijst.length; i++) {
      var item = lijst[i];
      var woord = schoonWoord(typeof item === 'string' ? item : (item && item.woord));
      if (woord.length < 3 || woord.length > 9 || gezien[woord]) continue;
      gezien[woord] = true;
      uit.push({
        woord: woord,
        uitleg: (item && typeof item === 'object' && item.uitleg) || ''
      });
    }
    return uit;
  }

  /* ------------------------------------------------------------- spelstaat */

  var spel = {
    spelers: 1,
    niveau: 'makkelijk',
    level: 1,
    deelnemers: [],
    beurt: 0,
    bezig: false,
    testmodus: false,
    /* Eén lingokaartsessie voor het hele spel: hij wordt bij de start van
       een potje gemaakt en overleeft alle drie de levels. */
    sessie: null,
    bonusStap: 1,          // 1, 2 of 3: hoeveel letters er vrijgegeven zijn
    gehad: null,           // woorden die dit potje al langskwamen
    ballenRondes: [],      // wat elke ballenfase opleverde
    bonusRondes: [],       // wat elke bonuskans opleverde
    extraPunten: 0         // punten uit de ballenfases en de bonuswoorden
  };

  /* Level 1, 2 en 3 zijn de moeilijkheidsgraden van de kern. */
  var LEVELNIVEAUS = { 1: 'makkelijk', 2: 'moeilijk', 3: 'expert' };

  /* De leveltabel staat in de kern; hier alleen een terugval zodat het
     scherm niet omvalt als js/core.js ouder is. */
  var LEVELS_TERUGVAL = {
    1: { level: 1, moeilijkheid: 'makkelijk', lengtes: [5], nodig: 4, maxBallen: 4 },
    2: { level: 2, moeilijkheid: 'moeilijk', lengtes: [5, 6], nodig: 3, maxBallen: 5 },
    3: { level: 3, moeilijkheid: 'expert', lengtes: [5, 6, 7], nodig: 2, maxBallen: 5 }
  };

  function levelInfo(nummer) {
    var n = Math.max(1, Math.min(LAATSTE_LEVEL, parseInt(nummer, 10) || 1));
    var C = kern();
    if (C && typeof C.levelInfo === 'function') {
      try { return C.levelInfo(n); } catch (fout) { /* terugval hieronder */ }
    }
    return LEVELS_TERUGVAL[n];
  }

  /* Ballen = maximum van het level min de gemiste woorden, minimaal één. */
  function verdiendeBallen(nummer, gemist) {
    var C = kern();
    if (C && typeof C.verdiendeBallen === 'function') {
      try { return C.verdiendeBallen(nummer, gemist); } catch (fout) { /* terugval */ }
    }
    return Math.max(1, levelInfo(nummer).maxBallen - Math.max(0, gemist | 0));
  }

  // Alles wat alleen het scherm aangaat; de regels staan in de kern.
  var zicht = leegZicht();

  function leegZicht() {
    return {
      lengte: 0,
      invoer: [],
      vergrendeld: [],
      totaalMs: TIJD_PER_WOORD_MS,
      restMs: TIJD_PER_WOORD_MS,
      loopt: false,
      klaar: false,
      animeert: false
    };
  }

  function deelnemer() {
    return spel.deelnemers[spel.beurt % spel.spelers] || spel.deelnemers[0];
  }

  function staat() {
    var d = deelnemer();
    return d ? d.staat : null;
  }

  /* Elk woord krijgt evenveel tijd; de kern is daar de baas over. */
  function tijdPerWoord() {
    var C = kern();
    if (C && C.TIJD_PER_WOORD > 0) return C.TIJD_PER_WOORD;
    return TIJD_PER_WOORD_MS;
  }

  /* -------------------------------------------------------------- schermen */

  function toonScherm(id) {
    zoekAlle('.scherm').forEach(function (s) {
      s.classList.toggle('is-actief', s.id === id);
    });
    if (window.scrollTo) window.scrollTo(0, 0);
    if (id !== 'scherm-spel') {
      var doel = zoek('#' + id);
      var eerste = doel && zoek('button, [href]', doel);
      if (eerste) { try { eerste.focus({ preventScroll: true }); } catch (fout) { /* ok */ } }
    }
  }

  /* --------------------------------------------------------------- overlays
     De drie kaarten (#woordkaart, #pauzescherm, #uitlegscherm) komen op en
     gaan dicht met een beweging uit css/game.css. Alles wat daarbij hoort
     staat hier bij elkaar, zodat er nergens anders nog een kale
     `hidden = false` overblijft.

     De wikkel .overlay-doos wordt hier omheen gehangen en niet in
     index.html gezet: de opmaak blijft daardoor ongemoeid, en de kaart kan
     als één geheel naar voren veren in plaats van kind voor kind.          */

  var OVERLAYS = ['woordkaart', 'pauzescherm', 'uitlegscherm'];

  function overlays() {
    return OVERLAYS.map(function (naam) { return el[naam]; });
  }

  function bouwOverlays() {
    overlays().forEach(function (o) {
      if (!o || zoek('.overlay-doos', o)) return;
      var doos = document.createElement('div');
      doos.className = 'overlay-doos';
      while (o.firstChild) doos.appendChild(o.firstChild);
      o.appendChild(doos);
    });
  }

  /* Een overlay die dichtgaat telt niet meer mee: het spel mag meteen weer
     luisteren naar toetsen, ook al loopt het sluitgebaar nog. */
  function overlayOpen() {
    return overlays().some(function (o) {
      return o && !o.hidden && !o.classList.contains('is-sluit');
    });
  }

  /* Roept `klaar` aan zodra de kaart echt staat. Zonder beweging is dat
     meteen; met beweging pas na de opkomst, zodat de focus niet naar een knop
     springt die nog onderweg is. De aflooptijd komt uit de CSS, met een ruime
     terugval voor het geval een animatie nooit eindigt (tabblad op de
     achtergrond, animatie uitgezet, oude browser). */
  function toonOverlay(node, klaar) {
    if (!node) { if (klaar) klaar(); return; }
    node.classList.remove('is-sluit');
    node.hidden = false;
    if (!klaar) return;
    if (!magBewegen()) { klaar(); return; }

    var gedaan = false;
    function af() {
      if (gedaan) return;
      gedaan = true;
      klaar();
    }
    var doos = zoek('.overlay-doos', node) || node;
    var wacht = cssTijd('--overlay-groot-duur', 460) + 120;
    if (doos.addEventListener) {
      doos.addEventListener('animationend', af, { once: true });
    }
    setTimeout(af, wacht);
  }

  /* Sluit met het korte sluitgebaar; `meteen` slaat dat over (schermwissel,
     spel afbreken) zodat er niets blijft nazwaaien. */
  function sluitOverlay(node, meteen) {
    if (!node || node.hidden) return;
    if (meteen || !magBewegen()) {
      node.classList.remove('is-sluit');
      node.hidden = true;
      return;
    }
    if (node.classList.contains('is-sluit')) return;
    node.classList.add('is-sluit');
    var gedaan = false;
    function weg() {
      if (gedaan) return;
      gedaan = true;
      /* Intussen weer geopend? Dan niets meer wegnemen. */
      if (!node.classList.contains('is-sluit')) return;
      node.classList.remove('is-sluit');
      node.hidden = true;
    }
    node.addEventListener('animationend', weg, { once: true });
    setTimeout(weg, cssTijd('--overlay-af-duur', 170) + 120);
  }

  function sluitAlleOverlays(meteen) {
    overlays().forEach(function (o) { sluitOverlay(o, meteen); });
  }

  /* -------------------------------------------------------------- meldingen */

  var meldingTimer = 0;

  /* soort: '' (neutraal), 'goed', 'fout' of 'hint' */
  function melding(tekst, soort) {
    if (!el.melding) return;
    el.melding.textContent = tekst || '';
    el.melding.classList.remove('is-goed', 'is-fout', 'is-hint');
    if (tekst && soort) el.melding.classList.add('is-' + soort);
    if (meldingTimer) clearTimeout(meldingTimer);
    if (tekst) {
      meldingTimer = setTimeout(function () {
        if (el.melding.textContent === tekst) melding('');
      }, 3400);
    }
  }

  /* -------------------------------------------------------------- het bord */

  function bouwBord(lengte) {
    if (!el.bord) return;
    el.bord.setAttribute('data-lengte', String(lengte));
    el.bord.innerHTML = '';
    for (var r = 0; r < MAX_RIJEN; r++) {
      var rij = document.createElement('div');
      rij.className = 'rij';
      rij.setAttribute('data-rij', String(r));
      rij.setAttribute('role', 'row');
      for (var k = 0; k < lengte; k++) {
        var tegel = document.createElement('div');
        tegel.className = 'tegel is-leeg';
        tegel.setAttribute('data-kolom', String(k));
        tegel.setAttribute('role', 'gridcell');
        rij.appendChild(tegel);
      }
      el.bord.appendChild(rij);
    }
  }

  function rijElement(index) {
    return el.bord ? zoek('.rij[data-rij="' + index + '"]', el.bord) : null;
  }

  function vulTegel(tegel, letter) {
    tegel.innerHTML = '';
    var vak = document.createElement('span');
    if (letter) { vak.className = 'letter'; vak.textContent = letter; }
    else { vak.className = 'stip'; }
    tegel.appendChild(vak);
  }

  /* Tekent alleen de rij waar nu op getypt wordt; de rijen erboven staan al
     goed en de rijen eronder blijven leeg. */
  function tekenActieveRij() {
    var s = staat();
    if (!s) return;
    var rij = rijElement(s.rij);
    if (!rij) return;
    zoekAlle('.rij', el.bord).forEach(function (r) {
      r.classList.toggle('is-huidig', r === rij && !zicht.klaar);
    });
    var vrij = eersteVrijePositie();
    for (var i = 0; i < zicht.lengte; i++) {
      var tegel = rij.children[i];
      if (!tegel) continue;
      var letter = zicht.invoer[i] || '';
      tegel.className = 'tegel';
      if (zicht.vergrendeld[i]) tegel.classList.add('is-goed');
      else if (letter) tegel.classList.add('is-open');
      else tegel.classList.add('is-leeg');
      if (i === vrij && !zicht.klaar) tegel.classList.add('is-actief');
      vulTegel(tegel, letter);
    }
    toonInvoerveld();
  }

  function toonInvoerveld() {
    if (!el.invoer) return;
    var tekst = '';
    for (var i = 0; i < zicht.lengte; i++) tekst += zicht.invoer[i] || '·';
    el.invoer.textContent = tekst;
  }

  function eersteVrijePositie() {
    for (var i = 0; i < zicht.lengte; i++) {
      if (!zicht.vergrendeld[i] && !zicht.invoer[i]) return i;
    }
    return -1;
  }

  function laatsteGevuldePositie() {
    for (var i = zicht.lengte - 1; i >= 0; i--) {
      if (!zicht.vergrendeld[i] && zicht.invoer[i]) return i;
    }
    return -1;
  }

  /* De rij klaarzetten met de letters die al vaststaan (kern: staat.bekend).
     Met bewaarGetypt blijven de letters staan die de speler zelf al intikte;
     dat is wat je wilt na een hint. */
  function bereidRijVoor(bewaarGetypt) {
    var s = staat();
    if (!s) return;
    var oud = bewaarGetypt ? zicht.invoer.slice() : null;
    zicht.lengte = s.lengte;
    zicht.invoer = new Array(s.lengte);
    zicht.vergrendeld = new Array(s.lengte);
    for (var i = 0; i < s.lengte; i++) {
      var bekend = s.bekend && s.bekend[i];
      zicht.invoer[i] = bekend || '';
      zicht.vergrendeld[i] = !!bekend;
      if (oud && !bekend && oud[i]) zicht.invoer[i] = oud[i];
    }
    tekenActieveRij();
  }

  /* --------------------------------------------------------- schermtoetsen */

  function herstelToetsenbord() {
    zoekAlle('.toets[data-letter]', el.toetsenbord).forEach(function (t) {
      t.classList.remove('is-goed', 'is-aanwezig', 'is-fout');
    });
  }

  function werkToetsenbordBij() {
    var s = staat();
    if (!s || !el.toetsenbord) return;
    var stand = veilig('toetsenbordStand', null, s);
    if (!stand) return;
    zoekAlle('.toets[data-letter]', el.toetsenbord).forEach(function (toets) {
      var soort = stand[toets.dataset.letter];
      toets.classList.remove('is-goed', 'is-aanwezig', 'is-fout');
      if (soort) toets.classList.add('is-' + soort);
    });
  }

  /* -------------------------------------------------------------- de klok  */

  var klok = { id: 0, laatst: 0, laatsteWeergave: -1, laatsteTik: -1, staat: '' };

  function startKlok() {
    if (klok.id) return;
    klok.laatst = nu();
    klok.id = window.requestAnimationFrame(klokTik);
  }

  function stopKlok() {
    if (klok.id) { window.cancelAnimationFrame(klok.id); klok.id = 0; }
  }

  function klokTik(tijd) {
    klok.id = window.requestAnimationFrame(klokTik);
    if (!zicht.loopt) { klok.laatst = tijd; return; }
    var verschil = tijd - klok.laatst;
    klok.laatst = tijd;
    if (!(verschil > 0)) verschil = 0;
    if (verschil > 200) verschil = 200;      // veiligheidsrem na een hapering
    zicht.restMs -= verschil;
    if (zicht.restMs <= 0) {
      zicht.restMs = 0;
      tekenTijdbalk(true);
      tijdIsOp();
      return;
    }
    tekenTijdbalk(false);
    var seconden = Math.ceil(zicht.restMs / 1000);
    if (seconden <= 10 && seconden !== klok.laatsteTik) {
      klok.laatsteTik = seconden;
      geluid('tik');
    }
  }

  /* De balk krijgt een vloeiende restwaarde (--rest, 0 t/m 1) en een
     data-staat waar de CSS de kleur en de pulsslag op zet. Tien keer per
     seconde bijwerken is genoeg; de CSS-overgang maakt het vloeiend. */
  function tekenTijdbalk(forceer) {
    if (!el.tijdbalk) return;
    var deel = Math.max(0, zicht.restMs) / zicht.totaalMs;
    var procent = deel * 100;
    var soort = procent > 60 ? 'veel' : procent > 35 ? 'half' : procent > 15 ? 'laag' : 'kritiek';
    var tijdstip = nu();
    if (!forceer && soort === klok.staat && tijdstip - klok.laatsteWeergave < 100) return;
    klok.laatsteWeergave = tijdstip;

    if (el.vulling) el.vulling.style.width = (Math.round(procent * 10) / 10) + '%';
    el.tijdbalk.style.setProperty('--rest', String(Math.round(deel * 100) / 100));
    el.tijdbalk.setAttribute('aria-valuenow', String(Math.round(procent)));
    if (soort !== klok.staat) {
      klok.staat = soort;
      el.tijdbalk.setAttribute('data-staat', soort);
    }
    if (el.tijdGetal) {
      var seconden = Math.ceil(Math.max(0, zicht.restMs) / 1000);
      var rest = seconden % 60;
      var tekst = Math.floor(seconden / 60) + ':' + (rest < 10 ? '0' : '') + rest;
      if (el.tijdGetal.textContent !== tekst) el.tijdGetal.textContent = tekst;
    }
  }

  /* ------------------------------------------------------------ pauzeknop  */

  var gepauzeerd = false;

  function zetPauze(aan) {
    if (!spel.bezig || zicht.klaar) return;
    if (aan === gepauzeerd) return;
    gepauzeerd = aan;
    zicht.loopt = !aan;
    if (aan) werkStopknopBij();
    if (aan) toonOverlay(el.pauzescherm);
    else sluitOverlay(el.pauzescherm);
    if (el.pauze) el.pauze.setAttribute('aria-pressed', aan ? 'true' : 'false');
    if (aan) geluid('klik');
  }

  /* ------------------------------------------------- stoppen zonder verlies
     Een level loopt tot het aantal goede woorden gehaald is; wie het niet
     meer ziet zitten moet kunnen stoppen zonder zijn potje weg te gooien.
     Alles wat al verdiend is telt mee in de eindstand. De knop hoort thuis
     in het pauzescherm, naast "terug naar het menu", en wordt hier gebouwd
     zodat index.html ongemoeid blijft.                                     */

  function bouwStopknop() {
    if (!el.pauzescherm || el.stop) return;
    var knop = document.createElement('button');
    knop.type = 'button';
    knop.className = 'knop knop--wit knop--klein';
    knop.setAttribute('data-actie', 'afronden');
    knop.textContent = 'Stoppen en naar de uitslag';
    var menuKnop = zoek('[data-actie="menu"]', el.pauzescherm);
    if (menuKnop) el.pauzescherm.insertBefore(knop, menuKnop);
    else el.pauzescherm.appendChild(knop);
    el.stop = knop;
  }

  /* Stoppen slaat de rest van het spel over en gaat rechtstreeks naar de
     eindstand; wat er al verdiend is telt gewoon mee. */
  function werkStopknopBij() {
    if (!el.stop) return;
    el.stop.textContent = 'Stoppen en naar de eindstand';
  }

  function stopEnRondAf() {
    if (!spel.bezig) return;
    /* Niet via zetPauze: die weigert dienst zodra een woord al afgelopen is,
       en dit moet altijd werken. */
    gepauzeerd = false;
    zicht.loopt = false;
    if (el.pauze) el.pauze.setAttribute('aria-pressed', 'false');
    sluitAlleOverlays(true);
    for (var i = 0; i < spel.deelnemers.length; i++) {
      var s = spel.deelnemers[i].staat;
      if (s.status === 'bezig') s.status = 'klaar';
      s.afgelopen = true;
    }
    schrijfLevelBij();
    naarUitslag();
  }

  /* ------------------------------------------------------ een spel opzetten */

  /* De opties waarmee de kern de afspeellijst van één level bouwt.

     De schakelaar van de quizmaster is leidend: staat die op de eigen
     lijst, dan speelt de kern precies die woorden af in precies die
     volgorde, alleen gefilterd op de woordlengtes van dit level. Een level
     loopt niet meer tot een aantal rondes maar tot een aantal goede
     woorden, dus de lijst moet ruim genoeg zijn: raakt de lijst van de
     quizmaster op, dan vult de kern hem stil aan met de standaardlijst.
     De speler merkt daar niets van, de quizmaster ziet op de beheerpagina
     of er genoeg klaarstaat voor een heel potje. */
  function levelOpties(woorden, instellingen) {
    var eigen = !!instellingen.gebruikEigenLijst;
    return {
      woorden: woorden,
      aanvulling: window.DVL.STANDAARDWOORDEN || [],
      maxPogingen: MAX_RIJEN,
      hints: START_HINTS,
      schud: !!instellingen.schud,
      eigenLijst: eigen
    };
  }

  function maakLevelStaat(nummer, woorden, instellingen) {
    return veilig('nieuwLevel', null, nummer, levelOpties(woorden, instellingen));
  }

  /* Een woord dat in een eerder level langskwam hoeft niet terug. Blijft er
     te weinig over om een heel level mee te vullen, dan telt een compleet
     potje zwaarder dan de afwisseling en gaat de hele voorraad er weer in;
     de kern vult daarna zo nodig nog aan. */
  function zonderGehad(voorraad) {
    if (!spel.gehad) return voorraad;
    var over = voorraad.filter(function (item) { return !spel.gehad[item.woord]; });
    return over.length >= 12 ? over : voorraad;
  }

  /* Bij twee spelers krijgt elke speler zijn eigen helft van de lijst,
     zodat niemand het antwoord van de ander al gezien heeft. */
  function deelVoorSpeler(voorraad, index) {
    if (spel.spelers !== 2) return voorraad;
    var eigen = voorraad.filter(function (_, plek) { return plek % 2 === index; });
    return eigen.length ? eigen : voorraad;
  }

  /* ------------------------------------------------------- een heel potje
     Een potje is: level 1, ballenfase, bonuswoord, level 2, ballenfase,
     bonuswoord, level 3, ballenfase, bonuswoord, eindstand. Er is geen
     levelkeuze meer; iedereen begint bij level 1.                         */

  /* Eén lingokaartsessie voor het hele potje. Hij wordt hier gemaakt en
     daarna aan elke ballenfase meegegeven; tussen de levels blijft alles
     staan wat op de kaart gebeurd is. */
  function maakSessie() {
    var K = window.DVL.Kaart;
    if (!K || typeof K.nieuweSessie !== 'function') return null;
    try { return K.nieuweSessie(); }
    catch (fout) { return null; }
  }

  function nieuwPotje(spelers) {
    if (!kernAanwezig()) {
      melding('De spellogica (js/core.js) kon niet geladen worden.');
      toonScherm('scherm-menu');
      return;
    }
    spel.spelers = spelers === 2 ? 2 : 1;
    spel.testmodus = false;
    spel.level = 1;
    spel.beurt = 0;
    spel.bonusStap = 1;
    spel.ballenRondes = [];
    spel.bonusRondes = [];
    spel.extraPunten = 0;
    spel.gehad = {};
    spel.deelnemers = [];
    for (var i = 0; i < spel.spelers; i++) {
      spel.deelnemers.push({
        naam: 'Speler ' + (i + 1),
        staat: null,
        woorden: [],
        punten: 0        // de punten van de al gespeelde levels
      });
    }
    spel.sessie = maakSessie();
    /* DVL.Bonusscherm houdt het bonuswoord vast over de drie levels heen.
       Zonder dit vergeten begint een volgend potje met precies hetzelfde
       woord op dezelfde plekken — en dat woord stond aan het eind van het
       vorige potje al helemaal in beeld. */
    vergeetBonuswoord();
    kiesLevel(1);
  }

  /* Wist het bonuswoord van het vorige potje. Ontbreekt het scherm, dan is
     er ook niets te vergeten. */
  function vergeetBonuswoord() {
    var S = window.DVL.Bonusscherm;
    if (!S || typeof S.vergeet !== 'function') return;
    try { S.vergeet(); } catch (fout) { /* opruimen mag nooit in de weg zitten */ }
  }

  /* Elk level begint met zijn eigen startscherm. DVL.Startscherm vult
     #scherm-start en roept ons terug zodra de speler op START drukt.
     Ontbreekt die module, dan beginnen we gewoon meteen. */
  function kiesLevel(nummer) {
    var level = Math.max(1, Math.min(LAATSTE_LEVEL, parseInt(nummer, 10) || 1));
    spel.level = level;
    spel.niveau = LEVELNIVEAUS[level];
    spel.testmodus = false;

    var S = window.DVL.Startscherm;
    if (!S || typeof S.toon !== 'function' || !zoek('#scherm-start')) {
      startLevel(level);
      return;
    }

    toonScherm('scherm-start');
    var gegevens = null;
    try {
      gegevens = S.toon(level, function () {
        geluid('klik');
        startLevel(level);
      }, levelInfo(level).nodig);
    } catch (fout) {
      startLevel(level);
      return;
    }
    if (!gegevens) { startLevel(level); return; }
    zetVoetregel(level);
  }

  /* Het startscherm belooft een aantal rondes; een level loopt nu tot een
     aantal goede woorden. De regel onder de STARTknop zegt dat dus met
     zoveel woorden als het level vraagt. */
  function zetVoetregel(level) {
    var voet = zoek('#scherm-start .start-voet');
    if (!voet) return;
    var nodig = levelInfo(level).nodig;
    voet.textContent = 'Spelen tot ' + nodig + ' goede woord' + (nodig === 1 ? '' : 'en') +
      ' · ' + Math.round(tijdPerWoord() / 1000) + ' seconden en 5 pogingen per woord';
  }

  function startLevel(nummer) {
    if (!kernAanwezig()) {
      melding('De spellogica (js/core.js) kon niet geladen worden.');
      toonScherm('scherm-menu');
      return;
    }
    var level = Math.max(1, Math.min(LAATSTE_LEVEL, parseInt(nummer, 10) || 1));
    spel.level = level;
    spel.niveau = LEVELNIVEAUS[level];
    spel.beurt = 0;

    var instellingen = lijstInstellingen();
    var voorraad = alleWoorden();
    if (!voorraad.length) {
      melding('Er staan geen woorden klaar. Voeg ze toe op de quizmasterpagina.');
      toonScherm('scherm-menu');
      return;
    }
    voorraad = zonderGehad(voorraad);
    if (!spel.deelnemers.length) nieuwPotje(spel.spelers);

    for (var i = 0; i < spel.deelnemers.length; i++) {
      var eigen = deelVoorSpeler(voorraad, i);
      var kernStaat = maakLevelStaat(level, eigen, instellingen);
      if (!kernStaat || !kernStaat.totaal) {
        melding('Geen bruikbare woorden voor dit level.');
        toonScherm('scherm-menu');
        return;
      }
      spel.deelnemers[i].staat = kernStaat;
    }

    spel.bezig = true;
    toonScherm('scherm-spel');
    startBeurt();
  }

  /* De quizmaster test één woord: geen levels, geen ballenfase, meteen de
     eindstand na dat ene woord. */
  function startTestspel(test) {
    spel.testmodus = true;
    spel.testwoord = { woord: test.woord, uitleg: test.uitleg };
    spel.spelers = 1;
    spel.beurt = 0;
    spel.level = test.woord.length >= 7 ? 3 : (test.woord.length === 6 ? 2 : 1);
    spel.niveau = LEVELNIVEAUS[spel.level];
    spel.bonusStap = 1;
    spel.ballenRondes = [];
    spel.bonusRondes = [];
    spel.extraPunten = 0;
    spel.sessie = null;

    var kernStaat = veilig('nieuwSpel', null, {
      woorden: [spel.testwoord], eigenLijst: true, aantalWoorden: 1,
      maxPogingen: MAX_RIJEN, hints: START_HINTS, tijdPerWoord: tijdPerWoord()
    });
    if (!kernStaat || !kernStaat.totaal) {
      melding('Dat testwoord kon niet gespeeld worden.');
      toonScherm('scherm-menu');
      return;
    }
    spel.deelnemers = [{ naam: 'Speler 1', staat: kernStaat, woorden: [], punten: 0 }];
    spel.bezig = true;
    toonScherm('scherm-spel');
    startBeurt();
    melding('Testwoord van de quizmaster.');
  }

  /* ------------------------------------------------------ een woord starten */

  function iedereenKlaar() {
    for (var i = 0; i < spel.deelnemers.length; i++) {
      if (!spel.deelnemers[i].staat.afgelopen) return false;
    }
    return true;
  }

  function startBeurt() {
    if (iedereenKlaar()) { naEindeLevel(); return; }
    // Sla spelers over die hun level al vol hebben.
    var stappen = 0;
    while (staat() && staat().afgelopen && stappen < spel.spelers * 2) {
      spel.beurt++;
      stappen++;
    }
    var s = staat();
    if (!s || s.afgelopen) { naEindeLevel(); return; }

    zicht = leegZicht();
    zicht.lengte = s.lengte;
    zicht.totaalMs = s.tijdPerWoord > 0 ? s.tijdPerWoord : tijdPerWoord();
    zicht.restMs = zicht.totaalMs;

    bouwBord(s.lengte);
    herstelToetsenbord();
    bereidRijVoor();

    /* Het level loopt tot een aantal goede woorden, dus dat is wat er hier
       hoort te staan: hoeveel er al goed zijn en hoeveel er nodig zijn. */
    if (el.ronde) {
      el.ronde.textContent = s.nodig > 0
        ? 'Level ' + spel.level + ' · ' + s.geraden + ' van ' + s.nodig + ' goed'
        : 'Ronde ' + s.ronde;
    }
    if (el.beurt) {
      el.beurt.hidden = spel.spelers < 2;
      el.beurt.textContent = 'Beurt: ' + deelnemer().naam;
    }
    werkPaneelBij();

    klok.staat = '';
    klok.laatsteWeergave = -1;
    klok.laatsteTik = -1;
    tekenTijdbalk(true);
    melding('');

    zicht.loopt = true;
    gepauzeerd = false;
    sluitOverlay(el.pauzescherm, true);
    startKlok();
    geluid('start');
  }

  /* De stand van een speler: de punten van de eerdere levels, die van het
     level dat nu loopt, en de punten uit de ballenfases en de bonuswoorden
     (die spelen ze samen, dus die tellen bij iedereen mee). */
  function totaalVan(speler) {
    if (!speler) return 0;
    return speler.punten + (speler.staat ? speler.staat.score : 0) + spel.extraPunten;
  }

  function werkPaneelBij() {
    var s = staat();
    if (!s) return;
    if (el.score) el.score.textContent = String(totaalVan(deelnemer()));
    if (el.hintAantal) el.hintAantal.textContent = String(s.hints);
    if (el.hints) {
      el.hints.disabled = s.hints <= 0;
      el.hints.setAttribute('data-aantal', String(s.hints));
      el.hints.setAttribute('aria-label', 'Gebruik een hint, je hebt er nog ' + s.hints);
    }
  }

  /* -------------------------------------------------------------- invoeren */

  function magTypen() {
    return spel.bezig && zicht.loopt && !zicht.animeert && !zicht.klaar && !overlayOpen();
  }

  function typLetter(letter) {
    if (!magTypen()) return;
    var positie = eersteVrijePositie();
    if (positie < 0) return;
    zicht.invoer[positie] = letter;
    tekenActieveRij();
    geluid('toets');
  }

  function wisLetter() {
    if (!magTypen()) return;
    var positie = laatsteGevuldePositie();
    if (positie < 0) return;
    zicht.invoer[positie] = '';
    tekenActieveRij();
    geluid('toets');
  }

  function schudRij() {
    var s = staat();
    var rij = s && rijElement(s.rij);
    if (!rij) return;
    rij.classList.remove('schudt');
    void rij.offsetWidth;                    // animatie opnieuw starten
    rij.classList.add('schudt');
    if (el.invoer) el.invoer.classList.add('is-fout');
    setTimeout(function () {
      rij.classList.remove('schudt');
      if (el.invoer) el.invoer.classList.remove('is-fout');
    }, 700);
  }

  /* Laat de bijbehorende schermtoets even indrukken, ook bij typen op een
     echt toetsenbord. */
  function knipperToets(kiezer) {
    var toets = zoek(kiezer, el.toetsenbord);
    if (!toets) return;
    toets.classList.add('is-ingedrukt');
    setTimeout(function () { toets.classList.remove('is-ingedrukt'); }, 120);
  }

  var REDENEN = {
    onbekend: 'Dat woord staat niet in de lijst. Deze poging telt niet mee.',
    lengte: 'Vul eerst alle letters in.',
    'niet-bezig': ''
  };

  function bevestigWoord() {
    if (!magTypen()) return;
    var s = staat();
    if (!s) return;

    if (eersteVrijePositie() >= 0) {
      schudRij();
      melding('Vul eerst alle ' + zicht.lengte + ' letters in.', 'fout');
      geluid('ongeldig');
      return;
    }

    var poging = zicht.invoer.join('');
    var uit = veilig('doeZet', null, s, poging);
    if (!uit) { melding('De poging kon niet verwerkt worden.'); return; }

    if (!uit.geldig) {
      // Een ongeldig woord kost geen poging: de rij schudt, de klok loopt door.
      schudRij();
      melding(REDENEN.hasOwnProperty(uit.reden) ? REDENEN[uit.reden] : REDENEN.onbekend, 'fout');
      geluid('ongeldig');
      return;
    }

    toonBeoordeling(uit);
  }

  /* --------------------------------------------------- tegels laten draaien */

  function toonBeoordeling(uit) {
    var s = staat();
    var res = uit.resultaat;
    // doeZet heeft staat.rij al opgehoogd; de zojuist gespeelde rij is de vorige.
    var rijIndex = Math.max(0, s.rij - 1);
    var rij = rijElement(rijIndex);
    if (!rij) { naBeoordeling(uit); return; }

    zicht.animeert = true;
    var beweegt = magBewegen();
    var poging = uit.woord;

    /* Het verspringen komt volledig uit de CSS (`animation-delay` per kolom),
       dus alle tegels krijgen de klasse op hetzelfde moment. JS rekent zijn
       eigen momenten op precies diezelfde vertraging uit:
         kleurwissel  = kolom * stap + halve draaiduur  (het keerpunt, waar de
                        tegel op zijn kant staat en dvl-onthul omslaat)
         klasse eraf  = kolom * stap + draaiduur + marge
       Zo blijft `.draait` bij elke kolom staan tot de animatie echt klaar is,
       ook bij een woord van zeven letters. */
    var stap = beweegt ? FLIP_STAP_MS : 0;
    var half = beweegt ? Math.round(FLIP_DUUR_MS / 2) : 0;
    var eind = beweegt ? FLIP_DUUR_MS + FLIP_NASLEEP_MS : 0;

    if (beweegt) {
      for (var k = 0; k < res.length; k++) {
        if (rij.children[k]) rij.children[k].classList.add('draait');
      }
    }

    for (var i = 0; i < res.length; i++) {
      (function (index) {
        var tegel = rij.children[index];
        if (!tegel) return;
        setTimeout(function () {
          tegel.classList.remove('is-leeg', 'is-open', 'is-actief');
          tegel.classList.add('is-' + res[index]);
          vulTegel(tegel, poging.charAt(index));
          geluid(res[index], index);
        }, index * stap + half);
        if (beweegt) {
          setTimeout(function () {
            tegel.classList.remove('draait');
          }, index * stap + eind);
        }
      })(i);
    }

    setTimeout(function () {
      zicht.animeert = false;
      naBeoordeling(uit);
    }, beweegt ? (res.length - 1) * stap + eind : 20);
  }

  function naBeoordeling(uit) {
    if (zicht.klaar) return;               // de klok was ons voor
    werkToetsenbordBij();
    if (uit.gewonnen) { rondAf(true, ''); return; }
    if (uit.mislukt) { rondAf(false, 'pogingen'); return; }

    bereidRijVoor();
    var over = MAX_RIJEN - staat().rij;
    melding('Nog ' + over + ' poging' + (over === 1 ? '' : 'en') + '.');
  }

  function tijdIsOp() {
    if (zicht.klaar) return;
    veilig('tijdOp', null, staat());
    rondAf(false, 'tijd');
  }

  /* --------------------------------------------------------- woord afronden */

  function rondAf(gewonnen, reden) {
    zicht.loopt = false;
    zicht.klaar = true;
    stopKlok();

    var s = staat();
    var speler = deelnemer();
    var punten = 0;

    if (gewonnen) {
      punten = veilig('verwerkScore', 0, s, zicht.restMs) || 0;
      laatRijJuichen(Math.max(0, s.rij - 1));
      geluid('winst');
    } else {
      geluid('verlies');
    }

    if (spel.gehad) spel.gehad[s.doel] = true;
    speler.woorden.push({
      level: spel.level,
      woord: s.doel,
      uitleg: s.uitleg,
      gewonnen: !!gewonnen,
      punten: punten,
      pogingen: s.rij
    });

    werkPaneelBij();
    toonWoordkaart(gewonnen, reden, punten, s);
  }

  /* De CSS laat de rij zelf juichen, tegel voor tegel; wij zetten alleen
     de klasse. */
  function laatRijJuichen(rijIndex) {
    var rij = rijElement(rijIndex);
    if (!rij) return;
    rij.classList.remove('is-huidig');
    rij.classList.add('is-gewonnen');
  }

  function toonWoordkaart(gewonnen, reden, punten, s) {
    if (!el.woordkaart) { volgendeBeurt(); return; }
    if (el.woordkaartKop) {
      el.woordkaartKop.textContent = gewonnen
        ? 'Goed geraden!'
        : (reden === 'tijd' ? 'De tijd is op' : 'Vijf pogingen op');
    }
    if (el.woordkaartWoord) el.woordkaartWoord.textContent = s.doel;
    if (el.woordkaartUitleg) {
      el.woordkaartUitleg.textContent = s.uitleg || 'Geen uitleg bij dit woord.';
    }
    if (el.woordkaartPunten) {
      el.woordkaartPunten.textContent = gewonnen
        ? ('+' + punten + ' punten in ' + s.rij + ' poging' + (s.rij === 1 ? '' : 'en'))
        : '';
    }
    setTimeout(function () {
      /* De focus wacht op de kaart: pas als de veerbeweging klaar is springt
         hij naar VERDER, anders zit de ring om een knop die nog beweegt. */
      toonOverlay(el.woordkaart, function () {
        if (el.woordkaart.hidden) return;
        var knop = zoek('[data-actie="volgende"]', el.woordkaart);
        if (knop) { try { knop.focus({ preventScroll: true }); } catch (fout) { /* ok */ } }
      });
    }, gewonnen && magBewegen() ? 1150 : 450);
  }

  /* ---------------------------------------------------------------- hints  */

  var HINTREDENEN = {
    'geen-hints': 'Je hebt geen hints meer.',
    'niets-te-onthullen': 'Alle letters staan er al.',
    'laatste-letter': 'De laatste letter mag je zelf bedenken.',
    'niet-bezig': ''
  };

  function gebruikHint() {
    if (!magTypen()) return;        // niet tijdens pauze, animatie of een overlay
    var uit = veilig('gebruikHint', null, staat());
    if (!uit) return;
    if (!uit.gelukt) {
      melding(HINTREDENEN.hasOwnProperty(uit.reden) ? HINTREDENEN[uit.reden] : 'Deze hint kan niet.');
      return;
    }
    bereidRijVoor(true);
    werkPaneelBij();
    var rij = rijElement(staat().rij);
    var tegel = rij && rij.children[uit.positie];
    if (tegel) {
      tegel.classList.add('springt');
      setTimeout(function () { tegel.classList.remove('springt'); }, 500);
    }
    melding('Hint: letter ' + (uit.positie + 1) + ' is een ' + uit.letter + '.', 'hint');
    geluid('hint');
  }

  /* ------------------------------------------------------------ spelverloop */

  function volgendeBeurt() {
    sluitOverlay(el.woordkaart);
    veilig('volgendWoord', null, staat());
    spel.beurt++;
    if (iedereenKlaar()) { naEindeLevel(); return; }
    startBeurt();
  }

  /* De punten van het level dat net klaar is bijschrijven op de speler,
     zodat de staat van het volgende level weer bij nul mag beginnen. */
  function schrijfLevelBij() {
    for (var i = 0; i < spel.deelnemers.length; i++) {
      var d = spel.deelnemers[i];
      if (!d.staat) continue;
      d.punten += d.staat.score;
      d.staat.score = 0;                 // nooit twee keer meetellen
    }
  }

  /* Wat dit level aan ballen oplevert: per speler het maximum van het
     level min zijn gemiste woorden, met een ondergrens van 1. Spelen ze
     met zijn tweeën, dan trekken ze samen op één kaart en tellen hun
     ballen bij elkaar op. */
  function totaleBallen() {
    var totaal = 0;
    for (var i = 0; i < spel.deelnemers.length; i++) {
      var s = spel.deelnemers[i].staat;
      totaal += verdiendeBallen(spel.level, s ? s.gemist : 0);
    }
    return totaal;
  }

  function naEindeLevel() {
    spel.bezig = false;
    stopKlok();
    sluitAlleOverlays(true);

    var trekkingen = totaleBallen();

    /* De punten van dit level apart houden vóór ze worden bijgeschreven, zodat
       de ballenfase een eerlijke tussenstand kan tonen: wat dit level opleverde
       en waar de speler nu staat. */
    var levelPunten = 0;
    for (var i = 0; i < spel.deelnemers.length; i++) {
      var d = spel.deelnemers[i];
      if (d.staat) levelPunten += d.staat.score;
    }

    schrijfLevelBij();
    var totaalVoor = totaalVan(deelnemer());

    if (spel.testmodus) { naarUitslag(); return; }
    startBallenfase(trekkingen, levelPunten, totaalVoor);
  }

  /* ---------------------------------------------- ballenfase en bonuswoord
     Beide schermen doen hun eigen werk en melden zich af met een terugroep;
     game.js regelt alleen de volgorde. Ontbreekt zo'n scherm, dan gaat het
     spel gewoon door naar het volgende onderdeel.                         */

  var balAfgerond = false;
  var bonusAfgerond = false;

  function startBallenfase(trekkingen, levelPunten, totaalVoor) {
    balAfgerond = false;
    spel.laatsteTrekkingen = trekkingen;

    var B = window.DVL.Ballenfase;
    if (!B || typeof B.start !== 'function' || !zoek('#scherm-ballen')) {
      naBallenfase(null);
      return;
    }
    toonScherm('scherm-ballen');
    try {
      B.start({
        sessie: spel.sessie,
        trekkingen: trekkingen,
        eersteKeer: spel.level === 1,
        levelPunten: typeof levelPunten === 'number' ? levelPunten : 0,
        totaalVoor: typeof totaalVoor === 'number' ? totaalVoor : 0,
        opKlaar: naBallenfase
      });
    } catch (fout) {
      naBallenfase(null);
    }
  }

  function naBallenfase(resultaat) {
    if (balAfgerond) return;
    balAfgerond = true;

    var uit = resultaat && typeof resultaat === 'object' ? resultaat : {};
    var punten = Math.round(uit.punten > 0 ? uit.punten : 0);
    spel.extraPunten += punten;
    spel.ballenRondes.push({
      level: spel.level,
      trekkingen: spel.laatsteTrekkingen || 0,
      lingos: uit.lingos || 0,
      groenVerzameld: uit.groenVerzameld || 0,
      groenBonus: !!uit.groenBonus,
      punten: punten
    });
    if (uit.lingos > 0) geluid('lingo');

    startBonuswoord();
  }

  function startBonuswoord() {
    bonusAfgerond = false;

    var S = window.DVL.Bonusscherm;
    if (!S || typeof S.start !== 'function' || !zoek('#scherm-bonus')) {
      naBonuswoord(null);
      return;
    }
    toonScherm('scherm-bonus');
    try {
      S.start({
        stap: spel.bonusStap,
        seconden: BONUS_SECONDEN,
        /* Alleen na het laatste level mag het woord verklapt worden. Ervoor
           blijft het staan: hetzelfde woord komt terug met meer letters vrij,
           en wie het antwoord al gezien heeft hoeft niet meer te raden. */
        laatsteKans: spel.level >= LAATSTE_LEVEL,
        opKlaar: naBonuswoord
      });
    } catch (fout) {
      naBonuswoord(null);
    }
  }

  function naBonuswoord(resultaat) {
    if (bonusAfgerond) return;
    bonusAfgerond = true;

    var uit = resultaat && typeof resultaat === 'object' ? resultaat : {};
    var punten = Math.round(uit.punten > 0 ? uit.punten : 0);
    spel.extraPunten += punten;
    spel.bonusRondes.push({
      level: spel.level,
      geraden: !!uit.geraden,
      woord: uit.woord || '',
      punten: punten
    });
    /* Geraden? Dan begint er na het volgende level een nieuw bonuswoord,
       weer met drie vrijgegeven letters. Anders komen er letters bij. */
    spel.bonusStap = uit.geraden ? 1 : Math.min(3, spel.bonusStap + 1);

    if (spel.level < LAATSTE_LEVEL) { kiesLevel(spel.level + 1); return; }
    naarUitslag();
  }

  function stopSpel() {
    spel.bezig = false;
    spel.testmodus = false;
    zicht.loopt = false;
    zicht.klaar = true;
    gepauzeerd = false;
    stopKlok();
    sluitAlleOverlays(true);
  }

  function naarMenu() {
    stopSpel();
    stopSchermen();
    toonScherm('scherm-menu');
    toonBron();
  }

  /* De twee nieuwe schermen mogen niet blijven doorlopen als de speler
     tussendoor naar het menu gaat; beide hebben daar een eigen stop voor
     als ze die aanbieden. */
  function stopSchermen() {
    balAfgerond = true;
    bonusAfgerond = true;
    var modules = [window.DVL.Ballenfase, window.DVL.Bonusscherm];
    for (var i = 0; i < modules.length; i++) {
      try {
        if (modules[i] && typeof modules[i].stop === 'function') modules[i].stop();
      } catch (fout) { /* opruimen mag nooit in de weg zitten */ }
    }
  }

  /* ------------------------------------------------------------- eindstand */

  function naarUitslag() {
    stopSpel();
    stopSchermen();
    if (el.uitslagInhoud) {
      el.uitslagInhoud.innerHTML = '';
      if (spel.spelers === 2 && spel.deelnemers.length === 2) {
        var a = spel.deelnemers[0], b = spel.deelnemers[1];
        el.uitslagInhoud.appendChild(tekstVak('p', totaalVan(a) === totaalVan(b)
          ? 'Gelijkspel!'
          : ((totaalVan(a) > totaalVan(b) ? a.naam : b.naam) + ' wint!'), 'titel'));
      }
      for (var i = 0; i < spel.deelnemers.length; i++) {
        el.uitslagInhoud.appendChild(uitslagBlok(spel.deelnemers[i]));
      }
      var bonusblok = bonusBlok();
      if (bonusblok) el.uitslagInhoud.appendChild(bonusblok);
    }
    toonScherm('scherm-uitslag');
  }

  function uitslagBlok(speler) {
    var blok = document.createElement('div');
    blok.className = 'kolom midden';
    var geraden = 0, gemist = 0;
    for (var w = 0; w < speler.woorden.length; w++) {
      if (speler.woorden[w].gewonnen) geraden++; else gemist++;
    }

    if (spel.spelers === 2) blok.appendChild(tekstVak('p', speler.naam, 'kop-klein'));
    blok.appendChild(tekstVak('p', String(totaalVan(speler)), 'eindscore geen-marge'));
    blok.appendChild(tekstVak('p', geraden + ' van ' + (geraden + gemist) +
      ' woorden binnen de tijd', 'kop-klein'));

    var lijst = document.createElement('ul');
    lijst.className = 'uitslaglijst';
    for (var i = 0; i < speler.woorden.length; i++) {
      var item = speler.woorden[i];
      var regel = document.createElement('li');
      regel.className = item.gewonnen ? 'is-goed' : 'is-fout';
      regel.appendChild(tekstVak('span', item.woord, 'woord'));
      regel.appendChild(tekstVak('span',
        item.uitleg || (item.gewonnen ? 'Geraden in ' + item.pogingen + ' pogingen' : 'Niet geraden'),
        'uitleg'));
      lijst.appendChild(regel);
    }
    blok.appendChild(lijst);
    return blok;
  }

  /* Wat de ballenfases en de bonuswoorden opleverden. Die punten zitten al
     in de eindstand hierboven; hier staat waar ze vandaan komen. */
  function bonusBlok() {
    if (!spel.ballenRondes.length && !spel.bonusRondes.length) return null;

    var blok = document.createElement('div');
    blok.className = 'kolom midden';
    var lingos = 0, i;
    for (i = 0; i < spel.ballenRondes.length; i++) lingos += spel.ballenRondes[i].lingos || 0;

    blok.appendChild(tekstVak('p', 'Ballen en bonuswoord', 'kop-klein'));

    var lijst = document.createElement('ul');
    lijst.className = 'uitslaglijst';

    var regel = document.createElement('li');
    regel.className = lingos > 0 ? 'is-goed' : 'is-fout';
    regel.appendChild(tekstVak('span', lingos > 0 ? 'LINGO' : 'Geen lingo', 'woord'));
    regel.appendChild(tekstVak('span', lingos === 1
      ? 'Eén keer vijf op een rij.'
      : (lingos > 1 ? lingos + ' keer vijf op een rij.' : 'De kaart is niet volgelopen.'), 'uitleg'));
    lijst.appendChild(regel);

    for (i = 0; i < spel.bonusRondes.length; i++) {
      var b = spel.bonusRondes[i];
      var rij = document.createElement('li');
      rij.className = b.geraden ? 'is-goed' : 'is-fout';
      rij.appendChild(tekstVak('span', b.woord || '?', 'woord'));
      rij.appendChild(tekstVak('span', b.geraden
        ? ('Bonuswoord na level ' + b.level + ' geraden' + (b.punten ? ', +' + b.punten + ' punten' : ''))
        : ('Bonuswoord na level ' + b.level + ' niet geraden'), 'uitleg'));
      lijst.appendChild(rij);
    }

    blok.appendChild(lijst);
    if (spel.extraPunten > 0) {
      blok.appendChild(tekstVak('p', '+' + spel.extraPunten +
        ' punten uit de ballenfase en het bonuswoord' +
        (spel.spelers === 2 ? ', voor allebei de spelers' : ''), 'kop-klein'));
    }
    return blok;
  }

  function tekstVak(soort, tekst, klasse) {
    var vak = document.createElement(soort);
    if (klasse) vak.className = klasse;
    vak.textContent = tekst;
    return vak;
  }

  /* ------------------------------------------------------------- bediening */

  function verwerkToets(gebeurtenis) {
    if (gebeurtenis.ctrlKey || gebeurtenis.altKey || gebeurtenis.metaKey) return;
    var toets = gebeurtenis.key;

    if (toets === 'Escape') {
      if (el.uitlegscherm && !el.uitlegscherm.hidden) { sluitOverlay(el.uitlegscherm); return; }
      var startActief = zoek('#scherm-start.is-actief');
      if (startActief) { gebeurtenis.preventDefault(); naarMenu(); return; }
      if (spel.bezig && !zicht.klaar) { gebeurtenis.preventDefault(); zetPauze(!gepauzeerd); }
      return;
    }

    if (overlayOpen()) {
      if (toets === 'Enter') {
        var open = [el.woordkaart, el.pauzescherm, el.uitlegscherm].filter(function (o) {
          return o && !o.hidden;
        })[0];
        var knop = open && zoek('.knop', open);
        if (knop) { gebeurtenis.preventDefault(); knop.click(); }
      }
      return;
    }

    if (!spel.bezig) return;

    if (toets === 'Enter') {
      gebeurtenis.preventDefault();
      knipperToets('.toets--enter');
      bevestigWoord();
      return;
    }
    if (toets === 'Backspace') {
      gebeurtenis.preventDefault();
      knipperToets('.toets--wis');
      wisLetter();
      return;
    }
    if (toets && toets.length === 1 && /[a-zA-Z]/.test(toets)) {
      gebeurtenis.preventDefault();
      var letter = toets.toUpperCase();
      knipperToets('.toets[data-letter="' + letter + '"]');
      typLetter(letter);
    }
  }

  function verwerkKlik(gebeurtenis) {
    var doel = gebeurtenis.target;
    if (!doel || !doel.closest) return;

    var toets = doel.closest('.toets');
    if (toets && el.toetsenbord && el.toetsenbord.contains(toets)) {
      gebeurtenis.preventDefault();
      if (toets.dataset.letter) typLetter(toets.dataset.letter);
      else if (toets.dataset.actie === 'wis') wisLetter();
      else if (toets.dataset.actie === 'enter') bevestigWoord();
      return;
    }

    var knop = doel.closest('[data-actie]');
    if (!knop) return;

    switch (knop.dataset.actie) {
      /* Er is geen levelkeuze meer: wie een spelvorm kiest gaat meteen naar
         het startscherm van level 1 en speelt door tot de eindstand. */
      case 'kies-spelers':
        geluid('klik');
        nieuwPotje(knop.dataset.spelers === '2' ? 2 : 1);
        break;
      case 'menu':
        naarMenu();
        break;
      case 'volgende':
        volgendeBeurt();
        break;
      case 'hervat':
        zetPauze(false);
        break;
      case 'afronden':
        geluid('klik');
        stopEnRondAf();
        break;
      case 'opnieuw':
        geluid('klik');
        nieuwPotje(spel.spelers);
        break;
      case 'uitleg':
        toonOverlay(el.uitlegscherm);
        break;
      case 'sluit-uitleg':
        sluitOverlay(el.uitlegscherm);
        break;
      default:
        break;
    }
  }

  /* ------------------------------------------------------------ menu-extra */

  function toonBron() {
    if (!el.menuBron) return;
    var lijst = alleWoorden();
    var eigen = lijstInstellingen().gebruikEigenLijst;
    el.menuBron.textContent = lijst.length
      ? (lijst.length + ' woorden klaar · ' + (eigen ? 'lijst van de quizmaster' : 'standaardlijst'))
      : 'Nog geen woorden. Voeg ze toe op de quizmasterpagina.';
  }

  /* De quizmaster opent een testwoord met index.html?woord=BROWSER&uitleg=... */
  function testWoordUitAdres() {
    var vraag = window.location.search || '';
    if (!vraag && window.location.hash.indexOf('woord=') >= 0) {
      vraag = '?' + window.location.hash.replace(/^#/, '');
    }
    var m = /[?&]woord=([^&]*)/.exec(vraag);
    if (!m) return null;
    var gevonden = schoonWoord(decodeURIComponent(m[1].replace(/\+/g, ' ')));
    if (gevonden.length < 3) return null;
    var u = /[?&]uitleg=([^&]*)/.exec(vraag);
    return {
      woord: gevonden,
      uitleg: u ? decodeURIComponent(u[1].replace(/\+/g, ' ')) : ''
    };
  }

  /* ---------------------------------------------------------------- opstart */

  function start() {
    verzamelElementen();
    bouwStopknop();
    /* Pas na bouwStopknop: die zet zijn knop met insertBefore tussen de
       directe kinderen van #pauzescherm, en die moeten dan nog los staan. */
    bouwOverlays();

    // De CSS is de baas over de draaitijden; haal ze daar op.
    FLIP_DUUR_MS = cssTijd('--draai-duur', FLIP_DUUR_MS);
    FLIP_STAP_MS = cssTijd('--draai-stap', FLIP_STAP_MS);

    document.addEventListener('keydown', verwerkToets);
    document.addEventListener('click', verwerkKlik);
    document.addEventListener('pointerdown', ontgrendelAudio, { once: true });
    document.addEventListener('keydown', ontgrendelAudio, { once: true });

    if (el.bevestig) el.bevestig.addEventListener('click', bevestigWoord);
    if (el.hints) el.hints.addEventListener('click', gebruikHint);
    if (el.pauze) el.pauze.addEventListener('click', function () { zetPauze(!gepauzeerd); });
    if (el.terug) el.terug.addEventListener('click', naarMenu);
    if (el.knopUitleg) {
      el.knopUitleg.addEventListener('click', function () {
        toonOverlay(el.uitlegscherm);
      });
    }

    // De knoppen voor geluid en muziek dragen data-dvl-geluid / data-dvl-muziek;
    // js/audio.js koppelt ze zelf en houdt hun staat bij.
    roepAudio(['init']);

    // De klok stopt zodra het tabblad naar de achtergrond gaat.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && spel.bezig && !zicht.klaar) zetPauze(true);
    });

    // De quizmaster kan de lijst in een ander tabblad wijzigen.
    try {
      if (window.DVL.Opslag && typeof DVL.Opslag.luister === 'function') {
        DVL.Opslag.luister(function () { toonBron(); });
      }
    } catch (fout) { /* zonder opslag speelt het spel gewoon door */ }

    toonBron();
    if (!kernAanwezig() && el.menuBron) {
      el.menuBron.textContent = 'Let op: js/core.js is niet geladen, het spel kan nu niet starten.';
    }

    var test = testWoordUitAdres();
    if (test) startTestspel(test);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  /* Kleine buitenkant, handig voor de quizmaster en om te testen. */
  DVL.Game = {
    start: nieuwPotje,
    nieuwPotje: nieuwPotje,
    kiesLevel: kiesLevel,
    startLevel: startLevel,
    testWoord: startTestspel,
    naarMenu: naarMenu,
    toonScherm: toonScherm,
    staat: function () { return { spel: spel, zicht: zicht, kern: staat() }; }
  };
})();
