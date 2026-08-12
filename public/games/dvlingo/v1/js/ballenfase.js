/* ==========================================================================
   Digitale Vaardigheden Lingo — js/ballenfase.js
   DVL.Ballenfase: het scherm waarop de verdiende ballen getrokken worden.

   Dit bestand is uitsluitend beeld en bediening. Alle regels — welke ballen
   er in de bak liggen, wat een trekking oplevert, wanneer er LINGO is en
   wanneer de fase stopt — staan in js/lingokaart.js (DVL.Kaart). Er wordt
   hier dus géén tweede kopie van de stand bijgehouden: de sessie die
   binnenkomt is de enige waarheid, en het scherm tekent wat daarin staat.

   Opmaak:
     css/ballenfase.css  het scherm zelf (kaart, vakjes, teller, stippen)
     css/finale.css      de trommel, de goot, het uitvak en de rollende bal

   De machine wordt opgebouwd met de `finale-`klassen uit css/finale.css. Die
   opmaak komt van de oude bingofinale; die finale is vervallen, maar de
   machine is gebleven, zodat er één ballenmachine in het spel bestaat.

   Gebruik (zie SPEC, "API van de twee nieuwe schermen"):

     DVL.Ballenfase.start({
       sessie,        // uit DVL.Kaart.nieuweSessie(), leeft het hele spel
       trekkingen,    // hoeveel ballen dit level verdiend zijn
       eersteKeer,    // true na level 1: de uitgebreide introductie
       opKlaar        // functie(resultaat) zodra de fase voorbij is
     });

   Het resultaat:

     {
       lingos,          hoeveel LINGO's er in DEZE fase vielen
       lingosTotaal,    hoeveel er in de hele sessie zijn gevallen
       groenVerzameld,  stand van de groene teller (0 t/m 3)
       groenBonus,      viel de groene bonus in deze fase?
       punten,          250 per LINGO en 150 voor drie groene ballen. Een
                        weggestreept vakje levert niets op: in de ballenfase
                        zijn alleen LINGO en de groene bonus punten waard.
       getrokken,       hoeveel ballen er uit de bak kwamen
       weggestreept,    hoeveel vakjes er in deze fase dichtgingen
       gestopt          true als een rode bal de fase afbrak
     }

   Extra opties, alleen voor de proefpagina en voor tests; het spel heeft ze
   niet nodig: `zaad` of `rng` (vaste toevalsbron), `scherm` (waar het scherm
   staat), `tempo` (alle wachttijden maal deze factor) en `stapelbaar`.

   DVL.Audio wordt gebruikt als hij er is, en het scherm werkt door als hij
   ontbreekt. Geen build-stap, geen modules, geen externe verzoeken.
   ========================================================================== */
(function (global) {
  'use strict';

  var DVL = (global.DVL = global.DVL || {});
  var doc = global.document;

  /* ==========================================================================
     1. Maten en wachttijden

     Alle wachttijden staan hier bij elkaar in milliseconden. `tempo` in de
     opties schaalt ze allemaal tegelijk, zodat een proefpagina de fase snel
     kan afdraaien zonder dat er ergens anders een getal verstopt zit.
     ========================================================================== */

  var ROLDUUR = 1000;          /* gelijk aan @keyframes finale-rollen in css/finale.css */
  var ROL_NALOOP = 140;        /* de bal ploft in het bakje voordat de kaart reageert */

  var T = {
    introKaart: 1500,          /* de volle kaart even laten staan */
    introMelding: 2100,        /* "we strepen er acht voor je door" */
    introStapLang: 460,        /* per startvakje, de eerste keer */
    introStapKort: 190,        /* per startvakje, bij een nieuwe kaart */
    introSlot: 1100,           /* na de acht, voordat de knop aangaat */
    naBal: 620,                /* van bal in het bakje naar de volgende trekking */
    lingoFeest: 2400,          /* de winnende lijn blijft staan */
    naLingo: 700,              /* stilte voordat de nieuwe kaart komt */
    eind: 700                  /* van de laatste bal naar het slot */
  };

  /* De acht startvakjes worden nooit trager onthuld dan dit; anders zit de
     speler bij een traag tempo minutenlang naar een kaart te kijken. */
  var INTRO_MAX = 8000;

  var lopend = null;           /* de fase die nu op het scherm staat */

  /* ==========================================================================
     2. Kleine hulpjes
     ========================================================================== */

  function maak(tag, klasse, tekst) {
    var el = doc.createElement(tag);
    if (klasse) el.className = klasse;
    if (tekst != null) el.textContent = tekst;
    return el;
  }

  function zoek(keuze, binnen) {
    return (binnen || doc).querySelector(keuze);
  }

  function rustigeWeergave() {
    return !!(global.matchMedia &&
              global.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* Onder 760px legt css/finale.css de kast plat; dan rolt de bal zijwaarts
     de goot in. Die keyframes hangen in css/finale.css aan `.finale ...`, en
     dat element staat hier niet omheen — daarom kiezen we de animatie zelf. */
  function liggendeKast() {
    return !!(global.matchMedia && global.matchMedia('(max-width: 760px)').matches);
  }

  function klank(naam) {
    if (DVL.Audio && typeof DVL.Audio.speel === 'function') {
      try { DVL.Audio.speel(naam); } catch (fout) { /* geluid mag nooit het spel slopen */ }
    }
  }

  /* Wachten met een timer die bij stop() weer netjes wordt opgeruimd. */
  function na(s, ms, doen) {
    var wacht = Math.max(0, Math.round(ms * s.tempo));
    var id = global.setTimeout(function () {
      var plek = s.timers.indexOf(id);
      if (plek !== -1) s.timers.splice(plek, 1);
      if (!s.gestaakt) doen();
    }, wacht);
    s.timers.push(id);
    return id;
  }

  function enkelvoud(aantal, een, meer) {
    return aantal === 1 ? een : meer;
  }

  /* ==========================================================================
     3. Het scherm opzoeken en waar nodig aanvullen

     De opmaak staat al in index.html. We zoeken hem op en vullen alleen aan
     wat ontbreekt, zodat de module ook werkt in een kaal `<section>` op een
     proefpagina.
     ========================================================================== */

  function kiesScherm(opgegeven) {
    if (opgegeven && opgegeven.nodeType === 1) return opgegeven;
    if (typeof opgegeven === 'string') {
      var gezocht = zoek(opgegeven);
      if (gezocht) return gezocht;
    }
    var scherm = doc.getElementById('scherm-ballen');
    if (scherm) return scherm;
    scherm = maak('section', 'scherm is-actief');
    scherm.id = 'scherm-ballen';
    doc.body.appendChild(scherm);
    return scherm;
  }

  /* Zoekt een onderdeel op; is het er niet, dan wordt het bijgemaakt. */
  function deel(scherm, keuze, bouw) {
    var el = zoek(keuze, scherm);
    if (el) return el;
    el = bouw();
    scherm.appendChild(el);
    return el;
  }

  /* De teller, de stippen en de meldingsregel horen onder het veld en over de
     volle breedte. Staan ze in index.html binnen `.bal-veld`, dan komen ze in
     de tweekolomsopmaak van dat veld terecht — naast en onder elkaar in plaats
     van netjes gecentreerd. Daarom worden ze hier één keer buiten het veld
     gezet; css/ballenfase.css geeft alles wat rechtstreeks in het scherm hangt
     de volle breedte. */
  function haalUitHetVeld(scherm, elementen) {
    var veld = zoek('.bal-veld', scherm);
    if (!veld) return;
    for (var i = 0; i < elementen.length; i++) {
      var el = elementen[i];
      if (el && el.parentNode === veld) scherm.appendChild(el);
    }
  }

  function bouwGroenpil() {
    var pil = maak('p', 'bal-groen');
    pil.appendChild(maak('span', 'bal-groen-label', 'Groen'));
    for (var i = 0; i < 3; i++) pil.appendChild(maak('span', 'bal-groen-stip'));
    return pil;
  }

  function bouwTeller() {
    var pil = maak('p', 'bal-teller');
    pil.appendChild(doc.createTextNode('Ballen te gaan '));
    var getal = maak('span', 'bal-teller-getal', '0');
    getal.id = 'bal-teller';
    pil.appendChild(getal);
    return pil;
  }

  function bouwMelding() {
    var regel = maak('p', 'bal-melding');
    regel.id = 'bal-melding';
    regel.setAttribute('role', 'status');
    regel.setAttribute('aria-live', 'polite');
    return regel;
  }

  function vindOnderdelen(s) {
    var scherm = s.scherm;

    s.machineEl = deel(scherm, '.bal-machine', function () {
      return maak('div', 'bal-machine');
    });
    s.kaartEl = deel(scherm, '.bal-kaart', function () {
      return maak('div', 'bal-kaart');
    });
    s.tellerEl = deel(scherm, '.bal-teller', bouwTeller);
    s.groenEl = deel(scherm, '.bal-groen', bouwGroenpil);
    s.meldingEl = deel(scherm, '.bal-melding', bouwMelding);

    /* Het getal in de teller: eerst het afgesproken id, dan de klasse, dan
       een vetgedrukt stuk — css/ballenfase.css blaast ze alle drie op. */
    s.tellerGetalEl = zoek('#bal-teller', scherm) ||
                      zoek('.bal-teller-getal', s.tellerEl) ||
                      zoek('strong, b', s.tellerEl);
    if (!s.tellerGetalEl) {
      s.tellerGetalEl = maak('span', 'bal-teller-getal', '0');
      s.tellerEl.appendChild(s.tellerGetalEl);
    }

    /* Drie losse stippen zonder opschrift zeggen niets. Staat er nog geen
       woord bij, dan zetten we er zelf een voor; css/ballenfase.css heeft de
       pil al op tekst plus stippen staan. */
    if (!s.groenEl.textContent.trim()) {
      s.groenEl.insertBefore(maak('span', 'bal-groen-label', 'Groen'),
                             s.groenEl.firstChild);
    }

    s.stippen = [];
    var gevonden = s.groenEl.querySelectorAll('.bal-groen-stip');
    for (var i = 0; i < gevonden.length; i++) s.stippen.push(gevonden[i]);
    while (s.stippen.length < 3) {
      var stip = maak('span', 'bal-groen-stip');
      s.groenEl.appendChild(stip);
      s.stippen.push(stip);
    }

    haalUitHetVeld(scherm, [s.tellerEl, s.groenEl, s.meldingEl]);

    /* De knop staat er niet in de opmaak; die hoort bij de bediening en dus
       bij dit bestand. Hij komt vlak boven de meldingsregel te staan. */
    s.knop = maak('button', 'knop knop--geel knop--breed', 'Trek een bal');
    s.knop.type = 'button';
    s.knop.id = 'bal-trek';
    s.eigenNodes.push(s.knop);
    scherm.insertBefore(s.knop, s.meldingEl);

    /* De LINGO-vlag uit css/finale.css: één groot moment midden op het
       scherm. `.scherm` staat op position:relative, dus hij landt goed. */
    s.vlag = maak('div', 'finale-vlag', 'LINGO!');
    s.vlag.hidden = true;
    s.vlag.setAttribute('aria-hidden', 'true');
    s.eigenNodes.push(s.vlag);
    scherm.appendChild(s.vlag);
  }

  /* ==========================================================================
     4. De ballenmachine (trommel, goot, uitvak, rollende bal)

     Precies de opbouw die css/finale.css verwacht. Dat blad hing zijn kleuren
     eerst aan de wrapper `.finale` van de oude bingofinale; die wrapper is er
     niet meer, dus css/ballenfase.css zet dezelfde variabelen op
     `.bal-machine` en klopt de kast ook zonder `.finale` eromheen.
     ========================================================================== */

  /* De losse bolletjes achter het glas. 0 = rood, 1 = blauw, 3 = groen;
     2 (geel) gebruiken we niet meer. */
  var DECORKLEUREN = [1, 1, 0, 1, 3, 1, 1, 0, 1, 3, 1, 0];

  function bouwBal(kleur) {
    var bal = maak('div', 'finale-bal finale-bal--' + (kleur || 'leeg'));
    var schijf = maak('span', 'finale-bal-schijf');
    var getal = maak('span', 'finale-bal-getal', '');
    schijf.appendChild(getal);
    bal.appendChild(schijf);
    bal.getalEl = getal;
    return bal;
  }

  var BALKLEUREN = ['leeg', 'rood', 'blauw', 'geel', 'groen'];

  /* De kleur van een bal zegt hier wát hij is, niet in welk bereik zijn getal
     valt: nummers en het vraagteken zijn blauw, en rood en groen houden hun
     eigen betekenis. Een nummerbal in het rood zou "je beurt is voorbij"
     schreeuwen terwijl er niets aan de hand is. */
  function balBeeld(antwoord) {
    if (!antwoord) return { kleur: 'leeg', teken: '' };
    if (antwoord.soort === DVL.Kaart.BAL_ROOD) return { kleur: 'rood', teken: '!' };
    if (antwoord.soort === DVL.Kaart.BAL_GROEN) return { kleur: 'groen', teken: '+' };
    if (antwoord.soort === DVL.Kaart.BAL_VRAAG) return { kleur: 'blauw', teken: '?' };
    return { kleur: 'blauw', teken: String(antwoord.getal) };
  }

  function vulBal(bal, beeld) {
    bal.getalEl.textContent = beeld.teken;
    for (var i = 0; i < BALKLEUREN.length; i++) {
      bal.classList.remove('finale-bal--' + BALKLEUREN[i]);
    }
    bal.classList.add('finale-bal--' + beeld.kleur);
  }

  function bouwMachine(s) {
    s.machineEl.innerHTML = '';

    var machine = maak('div', 'finale-machine');
    s.machine = machine;

    var kast = maak('div', 'finale-kast');

    var plaat = maak('div', 'finale-kastplaat');
    plaat.setAttribute('aria-hidden', 'true');
    plaat.appendChild(maak('span', 'finale-kastplaat-tekst', 'Ballentrommel'));
    plaat.appendChild(maak('span', 'finale-kastplaat-schroef'));
    kast.appendChild(plaat);

    var lijf = maak('div', 'finale-kastlijf');

    var nis = maak('div', 'finale-nis');
    nis.setAttribute('aria-hidden', 'true');
    var bol = maak('div', 'finale-bol');
    bol.appendChild(maak('span', 'finale-bol-glans'));
    for (var b = 0; b < 14; b++) {
      /* Alleen de kleuren die in de bak echt bestaan: blauw voor de nummers
         en het vraagteken, rood voor de stopbal, groen voor de bonusbal.
         Geel zat er wel in maar betekende niets, en dat verwart. */
      var bolletje = maak('span', 'finale-bolletje finale-bolletje--' + DECORKLEUREN[b % DECORKLEUREN.length]);
      bolletje.style.setProperty('--x', (10 + s.beeldToeval() * 72).toFixed(1) + '%');
      bolletje.style.setProperty('--y', (18 + s.beeldToeval() * 62).toFixed(1) + '%');
      bolletje.style.setProperty('--vertraging', (s.beeldToeval() * 2.6).toFixed(2) + 's');
      bol.appendChild(bolletje);
    }
    nis.appendChild(bol);
    nis.appendChild(maak('span', 'finale-nis-beugel'));
    lijf.appendChild(nis);

    /* De tellerruit telt hier de ballen die nog in de trommel liggen; de
       trekkingen die de speler nog heeft staan groot onder de kaart. */
    var zij = maak('div', 'finale-zijpaneel');
    zij.setAttribute('aria-hidden', 'true');
    zij.appendChild(maak('span', 'finale-lampje'));
    var teller = maak('div', 'finale-teller');
    s.trommelTellerEl = maak('span', 'finale-teller-getal', '0');
    teller.appendChild(s.trommelTellerEl);
    /* De ruit is maar veertig pixels breed. Met een gewone spatie tussen "in"
       en "de" viel het opschrift uiteen in drie regels; een vaste spatie houdt
       die twee bij elkaar, zodat er netjes "in de" boven "trommel" staat. */
    teller.appendChild(maak('span', 'finale-teller-label', 'in de trommel'));
    zij.appendChild(teller);
    zij.appendChild(maak('span', 'finale-rooster'));
    lijf.appendChild(zij);

    kast.appendChild(lijf);

    var goot = maak('div', 'finale-goot');
    goot.setAttribute('aria-hidden', 'true');
    goot.appendChild(maak('span', 'finale-goot-mond'));
    goot.appendChild(maak('span', 'finale-goot-baan'));
    s.rolbal = bouwBal('leeg');
    s.rolbal.classList.add('finale-rolbal');
    s.rolbal.hidden = true;
    goot.appendChild(s.rolbal);
    goot.appendChild(maak('span', 'finale-goot-lijst'));
    goot.appendChild(maak('span', 'finale-goot-uit'));
    kast.appendChild(goot);

    var bodem = maak('div', 'finale-bodem');
    bodem.setAttribute('aria-hidden', 'true');
    bodem.appendChild(maak('span', 'finale-bodem-plaat', 'Uitvak'));
    var uitvak = maak('div', 'finale-uitvak');
    uitvak.appendChild(maak('span', 'finale-uitvak-kuil'));
    s.laatsteBal = bouwBal('leeg');
    s.laatsteBal.classList.add('finale-laatste');
    s.laatsteBal.setAttribute('aria-hidden', 'true');
    s.laatsteBal.hidden = true;             /* het bakje blijft leeg tot de eerste bal */
    uitvak.appendChild(s.laatsteBal);
    bodem.appendChild(uitvak);
    kast.appendChild(bodem);

    machine.appendChild(kast);
    s.machineEl.appendChild(machine);
  }

  /* De bal rolt van de trommel door de goot naar het bakje. */
  function rolBal(s, beeld, klaar) {
    var bal = s.rolbal;
    vulBal(bal, beeld);
    bal.hidden = false;
    bal.classList.remove('is-rolt');
    bal.style.animationName = '';
    void bal.offsetWidth;                    /* de animatie opnieuw laten beginnen */

    var duur = s.rustig ? 0 : ROLDUUR;
    if (duur) {
      /* Ligt de kast plat, dan komt de bal van links binnen in plaats van van
         boven. Beide reeksen staan in css/finale.css. */
      if (liggendeKast()) bal.style.animationName = 'finale-rollen-liggend';
      bal.classList.add('is-rolt');
    }
    if (s.machine) s.machine.classList.add('is-draait');

    var afgehandeld = false;
    function eind() {
      if (afgehandeld) return;
      afgehandeld = true;
      bal.removeEventListener('animationend', eind);
      bal.classList.remove('is-rolt');
      bal.style.animationName = '';
      bal.hidden = true;
      if (s.machine) s.machine.classList.remove('is-draait');
      klaar();
    }
    bal.addEventListener('animationend', eind);
    na(s, (duur + ROL_NALOOP) / s.tempo, eind);   /* /tempo: na() schaalt zelf al */
  }

  /* De bal komt in het uitvak te liggen en blijft daar tot de volgende. */
  function legInBakje(s, beeld) {
    vulBal(s.laatsteBal, beeld);
    s.laatsteBal.hidden = false;
    s.laatsteBal.classList.remove('is-nieuw');
    void s.laatsteBal.offsetWidth;
    s.laatsteBal.classList.add('is-nieuw');
  }

  /* ==========================================================================
     5. De kaart tekenen

     De vakjes zijn knoppen: bij de vraagbal moet er met de muis én met het
     toetsenbord op te wijzen zijn. Buiten dat moment staan ze op tabindex -1,
     zodat de speler niet door 25 vakjes hoeft te tabben om bij de knop te
     komen. Het getal komt uit `data-getal` (`.bal-vak:empty::before`).
     ========================================================================== */

  function bouwKaart(s) {
    s.kaartEl.innerHTML = '';
    s.vakken = [];
    /* role="grid" belooft rijen die er in een 5x5 CSS-raster niet als element
       zijn; een groep met een naam is hier eerlijker en leest net zo goed. */
    s.kaartEl.setAttribute('role', 'group');
    if (!s.kaartEl.getAttribute('aria-label')) {
      s.kaartEl.setAttribute('aria-label', 'Lingokaart');
    }

    for (var i = 0; i < DVL.Kaart.AANTAL_VAKJES; i++) {
      var vak = maak('button', 'bal-vak');
      vak.type = 'button';
      vak.tabIndex = -1;
      vak.setAttribute('data-vak', String(i));
      s.kaartEl.appendChild(vak);
      s.vakken.push(vak);
    }
    s.kaartEl.addEventListener('click', s.opKaartKlik);
    s.kaartEl.addEventListener('keydown', s.opKaartToets);
  }

  function vakLabel(s, i, kiesbaar) {
    var getal = s.sessie.kaart.getallen[i];
    var rij = Math.floor(i / DVL.Kaart.ZIJDE) + 1;
    var kolom = (i % DVL.Kaart.ZIJDE) + 1;
    var stand = s.sessie.kaart.doorgestreept[i] ? 'doorgestreept' : 'open';
    if (kiesbaar) stand = 'open, kies dit vakje';
    return 'Nummer ' + getal + ', rij ' + rij + ', kolom ' + kolom + ', ' + stand;
  }

  /**
   * Zet alle 25 vakjes gelijk aan de sessie.
   * opties.allesOpen  toont de kaart alsof er nog niets doorgestreept is
   *                   (dat is de eerste blik bij de introductie)
   */
  function toonKaart(s, opties) {
    var allesOpen = !!(opties && opties.allesOpen);
    for (var i = 0; i < s.vakken.length; i++) {
      var vak = s.vakken[i];
      var weg = !allesOpen && !!s.sessie.kaart.doorgestreept[i];
      vak.setAttribute('data-getal', String(s.sessie.kaart.getallen[i]));
      vak.classList.remove('is-nieuw', 'is-lingo', 'is-kiesbaar');
      vak.classList.toggle('is-weg', weg);
      vak.classList.toggle('is-open', !weg);
      vak.tabIndex = -1;
      vak.setAttribute('aria-label', allesOpen
        ? 'Nummer ' + s.sessie.kaart.getallen[i]
        : vakLabel(s, i, false));
    }
    s.nieuwVak = -1;
  }

  /* Het net getrokken vakje krijgt de witte ring; het vorige raakt hem kwijt. */
  function wijsAan(s, i) {
    if (s.nieuwVak >= 0 && s.vakken[s.nieuwVak]) {
      s.vakken[s.nieuwVak].classList.remove('is-nieuw');
    }
    s.nieuwVak = -1;
    if (i == null || i < 0 || !s.vakken[i]) return;
    var vak = s.vakken[i];
    vak.classList.remove('is-nieuw');
    void vak.offsetWidth;
    vak.classList.add('is-nieuw');
    s.nieuwVak = i;
  }

  /* Loopt het beeld uit de pas met de sessie, dan wint de sessie. Dat kan
     alleen als er buiten dit scherm om iets is doorgestreept — bijvoorbeeld
     op de proefpagina, die een LINGO klaarlegt. De ring van het laatst
     getrokken vakje en een winnende lijn blijven staan. */
  function synchroniseerKaart(s) {
    for (var i = 0; i < s.vakken.length; i++) {
      var weg = !!s.sessie.kaart.doorgestreept[i];
      if (weg === s.vakken[i].classList.contains('is-weg')) continue;
      s.vakken[i].classList.toggle('is-weg', weg);
      s.vakken[i].classList.toggle('is-open', !weg);
      s.vakken[i].setAttribute('aria-label', vakLabel(s, i, false));
    }
  }

  /* Eén vakje dichtstrepen in beeld. De stand zelf zit al in de sessie. */
  function streepAf(s, i, metRing) {
    var vak = s.vakken[i];
    if (!vak) return;
    vak.classList.remove('is-open');
    vak.classList.add('is-weg');
    vak.setAttribute('aria-label', vakLabel(s, i, false));
    if (metRing) wijsAan(s, i);
  }

  /* ==========================================================================
     6. Teller, stippen en meldingen
     ========================================================================== */

  function werkTellerBij(s) {
    var over = Math.max(0, s.sessie.trekkingenOver);
    s.tellerGetalEl.textContent = String(over);
    s.tellerEl.setAttribute('data-aantal', String(over));
    s.tellerEl.classList.toggle('is-laatste', over === 1);
    s.tellerEl.classList.toggle('is-leeg', over === 0);
    s.tellerEl.setAttribute('aria-label',
      over === 0 ? 'Geen trekkingen meer'
                 : 'Nog ' + over + ' ' + enkelvoud(over, 'trekking', 'trekkingen'));
    if (s.trommelTellerEl) {
      s.trommelTellerEl.textContent = String(s.sessie.kaart.ballen.length);
    }
  }

  function werkGroenBij(s, feest) {
    var aantal = Math.min(s.stippen.length, s.sessie.groenVerzameld);
    for (var i = 0; i < s.stippen.length; i++) {
      var aan = i < aantal;
      /* De klasse alleen zetten als hij verandert, anders herstart de
         stempelanimatie bij elke verversing. */
      if (aan !== s.stippen[i].classList.contains('is-aan')) {
        s.stippen[i].classList.toggle('is-aan', aan);
      }
    }
    s.groenEl.setAttribute('data-aantal', String(aantal));
    s.groenEl.classList.toggle('is-vol', aantal >= DVL.Kaart.GROEN_NODIG);
    s.groenEl.setAttribute('aria-label',
      'Groene ballen: ' + aantal + ' van ' + DVL.Kaart.GROEN_NODIG);
    if (feest) {
      s.groenEl.classList.remove('is-vol');
      void s.groenEl.offsetWidth;
      s.groenEl.classList.add('is-vol');
    }
  }

  var MELDINGSOORTEN = ['is-goed', 'is-fout', 'is-rood', 'is-hint', 'is-lingo'];

  function meld(s, tekst, soort) {
    for (var i = 0; i < MELDINGSOORTEN.length; i++) {
      s.meldingEl.classList.remove(MELDINGSOORTEN[i]);
    }
    if (soort) s.meldingEl.classList.add(soort);
    s.meldingEl.textContent = tekst || '';
  }

  function werkKnopBij(s) {
    var over = Math.max(0, s.sessie.trekkingenOver);
    if (s.afgelopen) {
      s.knop.textContent = 'Verder';
      s.knop.className = 'knop knop--groen knop--breed';
      s.knop.disabled = false;
      return;
    }
    s.knop.className = 'knop knop--geel knop--breed';
    s.knop.textContent = over === 1 ? 'Trek je laatste bal' : 'Trek een bal';
    s.knop.disabled = s.intro || s.bezig || s.kiest || over <= 0;
  }

  function richtFocus(s, el) {
    if (!el) return;
    try { el.focus({ preventScroll: true }); } catch (fout) {
      try { el.focus(); } catch (nogFout) { /* focus is mooi meegenomen */ }
    }
  }

  /* ==========================================================================
     7. De introductie

     De eerste keer (na level 1) het hele verhaal: eerst de volle kaart met 25
     nummers, dan de aankondiging, dan de acht vakjes één voor één zichtbaar
     dicht. Bij een nieuwe kaart na LINGO gaat hetzelfde in het kort — de
     speler moet nog steeds kunnen zien wélke acht het zijn, maar hoeft het
     verhaal niet nog eens te horen.
     ========================================================================== */

  function streepStartvakjesAf(s, stapMs, klaar) {
    var lijst = s.sessie.kaart.startvakjes.slice();
    var stap = Math.min(stapMs, INTRO_MAX / Math.max(1, lijst.length));
    var n = 0;

    function volgende() {
      if (n >= lijst.length) { synchroniseerKaart(s); klaar(); return; }
      var i = lijst[n];
      n++;
      streepAf(s, i, true);
      klank('toets');
      meld(s, 'Nummer ' + s.sessie.kaart.getallen[i] + ' gaat door. ' +
              n + ' van de ' + lijst.length + '.', 'is-hint');
      na(s, stap, volgende);
    }

    volgende();
  }

  function speelIntro(s, klaar) {
    var kaart = s.sessie.kaart;

    /* Al een keer vertoond? Dan staat de kaart gewoon zoals hij staat. Deze
       vlag hangt aan de kaart en niet aan de sessie, zodat een nieuwe kaart na
       LINGO zijn eigen acht vakjes wél weer laat zien. */
    if (kaart.introGetoond) {
      toonKaart(s);
      klaar();
      return;
    }
    kaart.introGetoond = true;

    /* Het lange verhaal komt één keer per spel. Valt er in dezelfde fase een
       LINGO, dan krijgt de nieuwe kaart de korte versie. */
    var lang = s.eersteKeer;
    s.eersteKeer = false;

    var open = DVL.Kaart.AANTAL_VAKJES - DVL.Kaart.AANTAL_STARTVAKJES;
    toonKaart(s, { allesOpen: true });

    if (!lang) {
      /* Kort: even de volle kaart, dan de acht vlot achter elkaar dicht. */
      meld(s, 'Een nieuwe kaart met 25 nummers.', 'is-hint');
      na(s, T.introKaart * 0.55, function () {
        meld(s, 'Acht nummers gaan er alvast door.', 'is-hint');
        na(s, T.introMelding * 0.35, function () {
          streepStartvakjesAf(s, T.introStapKort, function () {
            meld(s, 'Nog ' + open + ' nummers open op de nieuwe kaart.', 'is-hint');
            na(s, T.introSlot * 0.5, klaar);
          });
        });
      });
      return;
    }

    /* De uitgebreide versie, één keer per spel. */
    meld(s, 'Dit is jouw lingokaart: 25 nummers.', 'is-hint');
    klank('start');
    na(s, T.introKaart, function () {
      meld(s, 'Je krijgt acht nummers cadeau: die strepen we nu voor je door.', 'is-hint');
      klank('hint');
      na(s, T.introMelding, function () {
        streepStartvakjesAf(s, T.introStapLang, function () {
          meld(s, 'Nog ' + open + ' nummers open. Vijf op een rij is LINGO.', 'is-hint');
          na(s, T.introSlot, klaar);
        });
      });
    });
  }

  /* ==========================================================================
     8. Een bal trekken en verwerken
     ========================================================================== */

  function klaarVoorTrekking(s) {
    s.bezig = false;
    werkTellerBij(s);
    werkKnopBij(s);
    if (!s.afgelopen && !s.kiest && s.sessie.trekkingenOver > 0) richtFocus(s, s.knop);
  }

  function trekBal(s) {
    /* `intro` hoort er ook bij: de knop staat dan wel uit, maar
       DVL.Ballenfase.trek() zou anders dwars door de introductie heen
       trekken. */
    if (!s || s.gestaakt || s.intro || s.bezig || s.kiest || s.afgelopen) return;
    if (!DVL.Kaart.faseLoopt(s.sessie)) { eindig(s); return; }

    s.bezig = true;
    werkKnopBij(s);

    var antwoord = DVL.Kaart.trek(s.sessie, s.rng);
    if (!antwoord.ok) { eindig(s); return; }

    s.getrokken++;
    meld(s, 'De bal rolt…', null);
    klank('balGetrokken');

    var beeld = balBeeld(antwoord);
    rolBal(s, beeld, function () {
      legInBakje(s, beeld);
      verwerk(s, antwoord);
    });
  }

  /* Wat de getrokken bal op het scherm betekent. De sessie is op dit moment
     al bijgewerkt door DVL.Kaart.trek; hier gebeurt alleen het vertellen. */
  function verwerk(s, antwoord) {
    werkTellerBij(s);

    if (antwoord.soort === DVL.Kaart.BAL_ROOD) {
      klank('woordFout');
      meld(s, 'Rode bal! Je beurt stopt hier.', 'is-rood');
      s.gestopt = true;
      na(s, T.eind, function () { eindig(s); });
      return;
    }

    if (antwoord.soort === DVL.Kaart.BAL_GROEN) {
      var stand = s.sessie.groenVerzameld;
      werkGroenBij(s, antwoord.groenBonus);
      klank(antwoord.groenBonus ? 'rondeGehaald' : 'letterGoed');
      if (antwoord.groenBonus) {
        s.groenBonus = true;
        meld(s, 'Drie groene ballen! Je verdient de groene bonus.', 'is-goed');
      } else {
        meld(s, 'Groene bal: ' + stand + ' van de ' + DVL.Kaart.GROEN_NODIG +
                '. Dit kost je geen trekking.', 'is-goed');
      }
      na(s, T.naBal, function () { volgendeStap(s); });
      return;
    }

    if (antwoord.soort === DVL.Kaart.BAL_VRAAG) {
      klank('hint');
      meld(s, 'Het vraagteken! Kies zelf welk vakje er doorgaat.', 'is-hint');
      na(s, T.naBal * 0.5, function () { startKeuze(s); });
      return;
    }

    /* Een nummerbal. */
    if (antwoord.geraakt) {
      streepAf(s, antwoord.vak, true);
      s.weggestreept++;
      klank('letterGoed');
      meld(s, 'Nummer ' + antwoord.getal + ' gaat door.', 'is-goed');
    } else if (antwoord.alDoorgestreept) {
      wijsAan(s, antwoord.vak);
      klank('letterAanwezig');
      meld(s, 'Nummer ' + antwoord.getal + ' stond al door. Deze trekking is weg.',
           'is-fout');
    } else {
      klank('letterAanwezig');
      meld(s, 'Nummer ' + antwoord.getal + ' staat niet op je kaart.', 'is-fout');
    }

    if (antwoord.lingo) { vierLingo(s, antwoord); return; }
    na(s, T.naBal, function () { volgendeStap(s); });
  }

  /* Na elke afgeronde bal: doorgaan of afsluiten. */
  function volgendeStap(s) {
    if (s.gestaakt || s.afgelopen) return;
    if (s.sessie.faseGestopt || s.sessie.trekkingenOver <= 0 ||
        !s.sessie.kaart.ballen.length) {
      eindig(s);
      return;
    }
    klaarVoorTrekking(s);
  }

  /* ==========================================================================
     9. De vraagbal: zelf een vakje aanwijzen
     ========================================================================== */

  function startKeuze(s) {
    if (s.gestaakt || !s.sessie.keuzeOpen) { volgendeStap(s); return; }

    s.kiest = true;
    s.bezig = false;
    werkKnopBij(s);

    var open = DVL.Kaart.openVakjes(s.sessie);
    if (!open.length) {                       /* kan niet, maar dan blijft niets hangen */
      s.sessie.keuzeOpen = false;
      s.kiest = false;
      volgendeStap(s);
      return;
    }

    for (var i = 0; i < open.length; i++) {
      var vak = s.vakken[open[i]];
      vak.classList.add('is-kiesbaar');
      vak.tabIndex = i === 0 ? 0 : -1;
      vak.setAttribute('aria-label', vakLabel(s, open[i], true));
    }
    s.kiesbaar = open.slice();
    meld(s, 'Het vraagteken! Kies een vakje: klik erop, of loop met de pijltjes en druk op Enter.',
         'is-hint');
    richtFocus(s, s.vakken[open[0]]);
  }

  function stopKeuze(s) {
    for (var i = 0; i < s.kiesbaar.length; i++) {
      var vak = s.vakken[s.kiesbaar[i]];
      if (!vak) continue;
      vak.classList.remove('is-kiesbaar');
      vak.tabIndex = -1;
      vak.setAttribute('aria-label', vakLabel(s, s.kiesbaar[i], false));
    }
    s.kiesbaar = [];
    s.kiest = false;
  }

  function kiesVak(s, i) {
    if (!s.kiest || s.gestaakt) return;
    if (s.kiesbaar.indexOf(i) === -1) {
      klank('ongeldig');
      meld(s, 'Dat vakje staat al door. Kies een vakje dat nog open is.', 'is-fout');
      return;
    }

    var antwoord = DVL.Kaart.kiesVak(s.sessie, i);
    if (!antwoord.ok) {
      klank('ongeldig');
      meld(s, 'Dat vakje kan niet. Kies een vakje dat nog open is.', 'is-fout');
      return;
    }

    stopKeuze(s);
    streepAf(s, i, true);
    s.weggestreept++;
    klank('letterGoed');
    meld(s, 'Je koos nummer ' + antwoord.getal + '. Dat vakje gaat door.', 'is-goed');
    werkTellerBij(s);
    richtFocus(s, s.knop);

    if (antwoord.lingo) { vierLingo(s, antwoord); return; }
    na(s, T.naBal, function () { volgendeStap(s); });
  }

  /* Pijltjes lopen over de kaart, maar alleen langs vakjes die echt gekozen
     mogen worden. Springt de stap buiten de kaart, dan blijft de focus staan. */
  function verplaatsKeuze(s, vanaf, dr, dk) {
    var zijde = DVL.Kaart.ZIJDE;
    var rij = Math.floor(vanaf / zijde);
    var kolom = vanaf % zijde;
    for (var stap = 0; stap < zijde; stap++) {
      rij += dr;
      kolom += dk;
      if (rij < 0 || rij >= zijde || kolom < 0 || kolom >= zijde) return;
      var doel = rij * zijde + kolom;
      if (s.kiesbaar.indexOf(doel) !== -1) {
        s.vakken[vanaf].tabIndex = -1;
        s.vakken[doel].tabIndex = 0;
        richtFocus(s, s.vakken[doel]);
        return;
      }
    }
  }

  /* ==========================================================================
     10. LINGO
     ========================================================================== */

  function vierLingo(s, antwoord) {
    s.lingos++;
    s.bezig = true;
    werkKnopBij(s);

    var lijn = antwoord.lijn ? antwoord.lijn.vakjes : [];
    for (var i = 0; i < lijn.length; i++) {
      if (s.vakken[lijn[i]]) s.vakken[lijn[i]].classList.add('is-lingo');
    }
    meld(s, 'LINGO! Vijf op een rij.', 'is-lingo');
    klank('lingo');

    s.vlag.hidden = false;
    if (s.rustig) {
      s.vlag.style.opacity = '1';
    } else {
      s.vlag.classList.remove('is-op');
      void s.vlag.offsetWidth;
      s.vlag.classList.add('is-op');
    }

    na(s, T.lingoFeest, function () {
      s.vlag.hidden = true;
      s.vlag.style.opacity = '';
      s.vlag.classList.remove('is-op');

      /* Zijn de trekkingen op, dan is dit meteen het einde van de fase en
         hoeft er geen nieuwe kaart meer op tafel. */
      if (s.sessie.faseGestopt || s.sessie.trekkingenOver <= 0) { eindig(s); return; }

      meld(s, 'Je krijgt een nieuwe kaart.', 'is-hint');
      na(s, T.naLingo, function () {
        DVL.Kaart.nieuweKaart(s.sessie, s.rng);
        werkTellerBij(s);
        speelIntro(s, function () {
          meld(s, 'Verder met ' + s.sessie.trekkingenOver + ' ' +
                  enkelvoud(s.sessie.trekkingenOver, 'trekking', 'trekkingen') + '.', null);
          klaarVoorTrekking(s);
        });
      });
    });
  }

  /* ==========================================================================
     11. Afsluiten
     ========================================================================== */

  function eindig(s) {
    if (s.afgelopen || s.gestaakt) return;
    s.afgelopen = true;
    s.bezig = false;
    if (s.kiest) stopKeuze(s);

    /* Een vakje wegstrepen levert géén punten op. Alleen LINGO en de bonus
       voor drie groene ballen tellen; anders leest "rood, dat levert 50 punten
       op" alsof je beloond wordt voor het einde van je beurt. */
    s.punten = s.lingos * 250 + (s.groenBonus ? 150 : 0);

    var slot;
    if (s.gestopt) {
      slot = 'Rood: de ballenfase is voorbij.';
    } else if (s.lingos > 0) {
      slot = s.lingos === 1 ? 'Eén LINGO deze ronde!' : s.lingos + ' keer LINGO deze ronde!';
    } else if (s.weggestreept > 0) {
      slot = s.weggestreept + ' ' + enkelvoud(s.weggestreept, 'vakje', 'vakjes') +
             ' weggestreept.';
    } else {
      slot = 'Deze keer ging er geen vakje door.';
    }

    /* Waar de punten van deze fase vandaan komen, zodat niemand denkt dat een
       weggestreept vakje of een rode bal geld waard is. */
    var bron = [];
    if (s.lingos > 0) bron.push('LINGO ' + (s.lingos * 250));
    if (s.groenBonus) bron.push('drie groene ballen 150');
    if (bron.length) slot += ' Bonus: ' + bron.join(' en ') + ' punten.';

    /* De tussenstand: wat dit level opleverde en waar de speler nu staat. */
    if (s.levelPunten !== null || s.totaalVoor !== null) {
      var totaal = (s.totaalVoor || 0) + s.punten;
      slot += ' Dit level: ' + (s.levelPunten || 0) + ' punten. Totaal: ' + totaal + '.';
    }

    meld(s, slot, s.gestopt ? 'is-rood' : 'is-goed');
    if (!s.gestopt) klank('rondeGehaald');

    werkTellerBij(s);
    werkKnopBij(s);
    richtFocus(s, s.knop);
  }

  function resultaat(s) {
    return {
      lingos: s.lingos,
      lingosTotaal: s.sessie.lingos,
      groenVerzameld: s.sessie.groenVerzameld,
      groenBonus: !!s.groenBonus,
      punten: s.punten || 0,
      getrokken: s.getrokken,
      weggestreept: s.weggestreept,
      gestopt: !!s.gestopt
    };
  }

  function afsluiten(s) {
    if (s.gemeld) return;
    s.gemeld = true;
    var uit = resultaat(s);
    if (typeof s.opKlaar === 'function') {
      try { s.opKlaar(uit); } catch (fout) { /* de aanroeper mag ons niet slopen */ }
    }
  }

  function ruimOp(s) {
    if (!s) return;
    s.gestaakt = true;
    for (var i = 0; i < s.timers.length; i++) global.clearTimeout(s.timers[i]);
    s.timers.length = 0;
    if (s.kaartEl) {
      s.kaartEl.removeEventListener('click', s.opKaartKlik);
      s.kaartEl.removeEventListener('keydown', s.opKaartToets);
      s.kaartEl.innerHTML = '';
    }
    if (s.machineEl) s.machineEl.innerHTML = '';
    for (var n = 0; n < s.eigenNodes.length; n++) {
      var el = s.eigenNodes[n];
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }
    s.eigenNodes.length = 0;
  }

  /* ==========================================================================
     12. Openbare API
     ========================================================================== */

  var API = {

    VERSIE: '1.0',

    /**
     * Start de ballenfase. Zie de kop van dit bestand voor alle opties en
     * voor het resultaat dat opKlaar meekrijgt.
     */
    start: function (opties) {
      opties = opties || {};

      if (!DVL.Kaart) {
        throw new Error('DVL.Ballenfase heeft js/lingokaart.js nodig.');
      }
      var sessie = opties.sessie;
      if (!sessie || !sessie.kaart) {
        throw new Error('DVL.Ballenfase.start: geef een sessie uit DVL.Kaart.nieuweSessie().');
      }

      API.stop();

      var tempo = typeof opties.tempo === 'number' && opties.tempo > 0 ? opties.tempo : 1;
      var toeval = typeof opties.rng === 'function'
        ? opties.rng
        : DVL.Kaart.maakWillekeur(opties.zaad);

      var s = {
        sessie: sessie,
        rng: toeval,
        /* De trommel mag er bij een vast zaad ook elke keer hetzelfde uitzien;
           daarom loopt de sier over dezelfde bron. */
        beeldToeval: toeval,
        eersteKeer: !!opties.eersteKeer,
        /* Voor de tussenstand aan het eind van de fase. Laat je ze weg, dan
           toont het slot alleen wat er in de ballenfase zelf gebeurd is. */
        levelPunten: typeof opties.levelPunten === 'number' ? opties.levelPunten : null,
        totaalVoor: typeof opties.totaalVoor === 'number' ? opties.totaalVoor : null,
        opKlaar: typeof opties.opKlaar === 'function' ? opties.opKlaar : null,
        tempo: tempo,
        rustig: rustigeWeergave(),

        scherm: kiesScherm(opties.scherm || opties.houder),
        eigenNodes: [],
        vakken: [],
        kiesbaar: [],
        timers: [],

        nieuwVak: -1,
        intro: true,          /* zolang de introductie loopt blijft de knop uit */
        bezig: false,
        kiest: false,
        afgelopen: false,
        gemeld: false,
        gestaakt: false,
        gestopt: false,

        lingos: 0,
        getrokken: 0,
        weggestreept: 0,
        groenBonus: false,
        punten: 0
      };

      s.opKnop = function () {
        if (s.afgelopen) { afsluiten(s); return; }
        trekBal(s);
      };

      s.opKaartKlik = function (gebeurtenis) {
        var vak = gebeurtenis.target.closest
          ? gebeurtenis.target.closest('.bal-vak')
          : null;
        if (!vak || !s.kiest) return;
        kiesVak(s, parseInt(vak.getAttribute('data-vak'), 10));
      };

      s.opKaartToets = function (gebeurtenis) {
        if (!s.kiest) return;
        var vak = gebeurtenis.target.closest
          ? gebeurtenis.target.closest('.bal-vak')
          : null;
        if (!vak) return;
        var i = parseInt(vak.getAttribute('data-vak'), 10);
        var toets = gebeurtenis.key;

        if (toets === 'ArrowRight')      { gebeurtenis.preventDefault(); verplaatsKeuze(s, i, 0, 1); }
        else if (toets === 'ArrowLeft')  { gebeurtenis.preventDefault(); verplaatsKeuze(s, i, 0, -1); }
        else if (toets === 'ArrowDown')  { gebeurtenis.preventDefault(); verplaatsKeuze(s, i, 1, 0); }
        else if (toets === 'ArrowUp')    { gebeurtenis.preventDefault(); verplaatsKeuze(s, i, -1, 0); }
        else if (toets === 'Home')       { gebeurtenis.preventDefault(); springNaar(s, i, s.kiesbaar[0]); }
        else if (toets === 'End')        { gebeurtenis.preventDefault(); springNaar(s, i, s.kiesbaar[s.kiesbaar.length - 1]); }
        else if (toets === 'Enter' || toets === ' ' || toets === 'Spacebar') {
          gebeurtenis.preventDefault();
          kiesVak(s, i);
        }
      };

      lopend = s;

      vindOnderdelen(s);
      bouwMachine(s);
      bouwKaart(s);
      s.knop.addEventListener('click', s.opKnop);

      DVL.Kaart.startFase(sessie, Math.max(0, opties.trekkingen | 0));

      toonKaart(s);
      werkTellerBij(s);
      werkGroenBij(s, false);
      werkKnopBij(s);
      meld(s, '', null);

      speelIntro(s, function () {
        s.intro = false;
        var over = s.sessie.trekkingenOver;
        if (over <= 0) { eindig(s); return; }
        meld(s, 'Je verdiende ' + over + ' ' + enkelvoud(over, 'bal', 'ballen') +
                '. Trek ze en maak er LINGO van.', null);
        klaarVoorTrekking(s);
      });

      return API;
    },

    /* Trekt een bal alsof er op de knop geklikt is (handig voor tests). */
    trek: function () { if (lopend) trekBal(lopend); return API; },

    /* Kiest na een vraagbal een vakje op nummer 0..24. */
    kies: function (vak) { if (lopend) kiesVak(lopend, vak); return API; },

    /* Ruimt de fase op zonder opKlaar te melden. */
    stop: function () {
      if (!lopend) return API;
      ruimOp(lopend);
      lopend = null;
      return API;
    },

    /* Een leesbare momentopname. */
    staat: function () {
      if (!lopend) return null;
      var s = lopend;
      var beeld = resultaat(s);
      beeld.trekkingenOver = s.sessie.trekkingenOver;
      beeld.ballenInBak = s.sessie.kaart.ballen.length;
      beeld.intro = s.intro;
      beeld.kiest = s.kiest;
      beeld.bezig = s.bezig;
      beeld.afgelopen = s.afgelopen;
      return beeld;
    },

    bezig: function () { return !!lopend && !lopend.gemeld; }
  };

  /* Home en End springen naar het eerste of laatste kiesbare vakje. */
  function springNaar(s, vanaf, doel) {
    if (doel == null || doel === vanaf) return;
    s.vakken[vanaf].tabIndex = -1;
    s.vakken[doel].tabIndex = 0;
    richtFocus(s, s.vakken[doel]);
  }

  DVL.Ballenfase = API;

})(window);
