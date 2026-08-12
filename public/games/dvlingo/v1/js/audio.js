/* ==========================================================================
   Digitale Vaardigheden Lingo — js/audio.js
   DVL.Audio: alle geluiden worden hier ter plekke gesynthetiseerd met de
   WebAudio API. Geen audiobestanden, geen externe verzoeken.

   Klankidee: één set, één instrumentarium. Alles staat in D-groot / D-majeur
   pentatoniek, alles loopt door dezelfde toonketen (zachte hoge-tonen-demping,
   milde compressor, een vleugje ruimte). Daardoor klinken negen losse
   effecten als familie van elkaar: kort, helder, en nooit schel.

   De AudioContext wordt bewust pas aangemaakt bij de eerste aanraking van de
   gebruiker (klik, tik of toets), zoals de browser ook eist.
   ========================================================================== */
(function (global) {
  'use strict';

  var DVL = global.DVL = global.DVL || {};

  /* ---- opslagsleutels ---------------------------------------------------- */
  var SLEUTEL_GELUID = 'dvl.geluid';   // demper-knop: 'aan' of 'uit'
  var SLEUTEL_MUZIEK = 'dvl.muziek';   // achtergrondloop: 'aan' of 'uit'

  /* ---- interne staat ----------------------------------------------------- */
  var ctx = null;              // AudioContext, pas na de eerste aanraking
  var meester = null;          // hoofdvolume
  var demping = null;          // hoge tonen temmen zodat niets schel wordt
  var drukker = null;          // compressor
  var ruimte = null;           // convolver (zelfgemaakte galm)
  var ruimteBus = null;        // volume van de galm
  var muziekBus = null;        // aparte bus voor de achtergrondloop
  var ruisBuffer = null;       // eenmalig gemaakte witte ruis
  var geraakt = false;         // heeft de gebruiker de pagina al aangeraakt?

  var gedempt = leesUit(SLEUTEL_GELUID, false);          // standaard: geluid aan
  var muziekAan = !leesUit(SLEUTEL_MUZIEK, true);        // standaard: muziek uit
  var muziekLoopt = false;
  var muziekKlok = null;
  var muziekTijd = 0;
  var muziekStap = 0;
  var netGeschakeld = false;   // tegen dubbel schakelen binnen één klik
  var luisteraars = [];
  var gekoppeld = [];

  /* ==========================================================================
     1. Kleine hulpjes
     ========================================================================== */

  /* Leest een schakelaar uit localStorage en antwoordt op één vraag:
     staat hij UIT? `standaardUit` geldt wanneer er nog niets bewaard is.
     We accepteren ruimhartig 'aan'/'uit', 'true'/'false', '1'/'0' en JSON,
     zodat een oudere of andere schrijfwijze het spel niet stil legt. */
  function leesUit(sleutel, standaardUit) {
    var ruw = null;
    try { ruw = global.localStorage.getItem(sleutel); } catch (e) { ruw = null; }
    if (ruw === null || ruw === '') return !!standaardUit;
    ruw = String(ruw).trim().toLowerCase();
    if (ruw.charAt(0) === '{' || ruw.charAt(0) === '"') {
      try {
        var g = JSON.parse(ruw);
        if (typeof g === 'boolean') ruw = g ? 'aan' : 'uit';
        else if (g && typeof g === 'object') ruw = (g.aan === false || g.gedempt === true) ? 'uit' : 'aan';
        else ruw = String(g).toLowerCase();
      } catch (e) { /* laat de ruwe tekst staan */ }
    }
    return (ruw === 'uit' || ruw === 'false' || ruw === '0' || ruw === 'nee' || ruw === 'gedempt');
  }

  function bewaarSchakelaar(sleutel, waarde) {
    try { global.localStorage.setItem(sleutel, waarde ? 'aan' : 'uit'); } catch (e) { /* privémodus */ }
  }

  /* Toonhoogte uit een MIDI-nummer. 69 = A4 = 440 Hz. */
  function hz(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

  function nu() { return ctx ? ctx.currentTime : 0; }

  function meld() {
    var beeld = staatBeeld();
    for (var i = 0; i < luisteraars.length; i++) {
      try { luisteraars[i](beeld); } catch (e) { /* een luisteraar mag ons niet slopen */ }
    }
    for (var k = 0; k < gekoppeld.length; k++) spiegelKnop(gekoppeld[k]);
  }

  function staatBeeld() {
    return { gedempt: gedempt, geluid: !gedempt, muziek: muziekAan, gereed: !!ctx };
  }

  /* ==========================================================================
     2. De toonketen
     ========================================================================== */

  function maakKeten() {
    meester = ctx.createGain();
    meester.gain.value = gedempt ? 0 : 0.9;

    // Een hoge-tonen-plank die 5 dB van de scherpte afhaalt: helder, niet schel.
    demping = ctx.createBiquadFilter();
    demping.type = 'highshelf';
    demping.frequency.value = 4200;
    demping.gain.value = -5;

    drukker = ctx.createDynamicsCompressor();
    drukker.threshold.value = -14;
    drukker.knee.value = 22;
    drukker.ratio.value = 6;
    drukker.attack.value = 0.004;
    drukker.release.value = 0.25;

    meester.connect(demping);
    demping.connect(drukker);
    drukker.connect(ctx.destination);

    // Zelfgemaakte galm: een korte, donkere staart die alle effecten
    // in dezelfde ruimte zet.
    ruimte = ctx.createConvolver();
    ruimte.buffer = maakGalmBuffer(1.1, 3.2);
    ruimteBus = ctx.createGain();
    ruimteBus.gain.value = 0.85;
    ruimte.connect(ruimteBus);
    ruimteBus.connect(meester);

    muziekBus = ctx.createGain();
    muziekBus.gain.value = 0;
    muziekBus.connect(meester);
  }

  function maakGalmBuffer(duur, verval) {
    var lengte = Math.max(1, Math.floor(ctx.sampleRate * duur));
    var buffer = ctx.createBuffer(2, lengte, ctx.sampleRate);
    for (var kanaal = 0; kanaal < 2; kanaal++) {
      var data = buffer.getChannelData(kanaal);
      for (var i = 0; i < lengte; i++) {
        var val = 1 - i / lengte;
        data[i] = (Math.random() * 2 - 1) * Math.pow(val, verval);
      }
    }
    return buffer;
  }

  function maakRuisBuffer() {
    var lengte = Math.floor(ctx.sampleRate * 2);
    var buffer = ctx.createBuffer(1, lengte, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < lengte; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  /* ==========================================================================
     3. Ontgrendelen na de eerste aanraking
     ========================================================================== */

  function ontgrendel() {
    if (ctx) {
      if (ctx.state === 'suspended' && ctx.resume) { try { ctx.resume(); } catch (e) {} }
      return ctx;
    }
    if (!geraakt) return null;              // vóór de eerste aanraking: niets aanmaken
    var Maker = global.AudioContext || global.webkitAudioContext;
    if (!Maker) return null;
    try { ctx = new Maker(); } catch (e) { return null; }
    maakKeten();
    ruisBuffer = maakRuisBuffer();
    if (ctx.state === 'suspended' && ctx.resume) { try { ctx.resume(); } catch (e) {} }
    if (muziekAan) startMuziek();
    meld();
    return ctx;
  }

  function eersteAanraking() {
    geraakt = true;
    ontgrendel();
  }

  function luisterNaarAanraking() {
    var soorten = ['pointerdown', 'touchstart', 'mousedown', 'keydown'];
    for (var i = 0; i < soorten.length; i++) {
      global.addEventListener(soorten[i], eersteAanraking, { capture: true, passive: true });
    }
  }

  /* ==========================================================================
     4. Bouwstenen voor klank
     ========================================================================== */

  /* Eén stem: oscillator -> (filter) -> omhullende -> bus (+ galmzending). */
  function toon(o) {
    if (!ctx) return;
    var t0 = o.start != null ? o.start : nu();
    var duur = o.duur != null ? o.duur : 0.2;
    var piek = o.volume != null ? o.volume : 0.18;
    var aanslag = o.aanslag != null ? o.aanslag : 0.008;

    var osc = ctx.createOscillator();
    osc.type = o.golf || 'triangle';
    osc.frequency.setValueAtTime(o.van, t0);
    if (o.naar) {
      osc.frequency.exponentialRampToValueAtTime(o.naar, t0 + (o.glijduur != null ? o.glijduur : duur));
    }
    if (o.ontstemming) osc.detune.value = o.ontstemming;

    var laatste = osc;
    if (o.filter) {
      var f = ctx.createBiquadFilter();
      f.type = o.filter;
      f.frequency.value = o.filterHz || 1600;
      f.Q.value = o.filterQ || 0.9;
      laatste.connect(f);
      laatste = f;
    }

    var omhulling = ctx.createGain();
    omhulling.gain.setValueAtTime(0.0001, t0);
    omhulling.gain.exponentialRampToValueAtTime(Math.max(0.0002, piek), t0 + aanslag);
    if (o.houd) omhulling.gain.setValueAtTime(Math.max(0.0002, piek), t0 + aanslag + o.houd);
    omhulling.gain.exponentialRampToValueAtTime(0.0001, t0 + duur);
    laatste.connect(omhulling);

    omhulling.connect(o.bus || meester);
    if (o.ruimte) {
      var zending = ctx.createGain();
      zending.gain.value = o.ruimte;
      omhulling.connect(zending);
      zending.connect(ruimte);
    }

    osc.start(t0);
    osc.stop(t0 + duur + 0.06);
  }

  /* Eén ruisvlaag: witte ruis door een filter met een omhullende. */
  function ruis(o) {
    if (!ctx || !ruisBuffer) return;
    var t0 = o.start != null ? o.start : nu();
    var duur = o.duur != null ? o.duur : 0.2;
    var piek = o.volume != null ? o.volume : 0.1;

    var bron = ctx.createBufferSource();
    bron.buffer = ruisBuffer;
    bron.loop = true;
    bron.playbackRate.value = o.snelheid || 1;

    var f = ctx.createBiquadFilter();
    f.type = o.filter || 'bandpass';
    f.Q.value = o.filterQ || 1.1;
    f.frequency.setValueAtTime(o.filterVan || 900, t0);
    if (o.filterMidden) f.frequency.exponentialRampToValueAtTime(o.filterMidden, t0 + duur * 0.45);
    if (o.filterNaar) f.frequency.exponentialRampToValueAtTime(o.filterNaar, t0 + duur);

    var omhulling = ctx.createGain();
    omhulling.gain.setValueAtTime(0.0001, t0);
    omhulling.gain.exponentialRampToValueAtTime(Math.max(0.0002, piek), t0 + (o.aanslag != null ? o.aanslag : 0.02));
    omhulling.gain.exponentialRampToValueAtTime(0.0001, t0 + duur);

    bron.connect(f);
    f.connect(omhulling);
    omhulling.connect(o.bus || meester);
    if (o.ruimte) {
      var zending = ctx.createGain();
      zending.gain.value = o.ruimte;
      omhulling.connect(zending);
      zending.connect(ruimte);
    }

    bron.start(t0);
    bron.stop(t0 + duur + 0.06);
  }

  /* ==========================================================================
     5. De negen geluiden
     ========================================================================== */

  var geluiden = {

    /* Toets: een zachte, hele korte tik. Mag honderd keer klinken zonder te vermoeien. */
    toets: function (t) {
      toon({ start: t, van: hz(86), naar: hz(74), duur: 0.06, glijduur: 0.05,
             golf: 'triangle', volume: 0.07, aanslag: 0.003, filter: 'lowpass', filterHz: 3000 });
      ruis({ start: t, duur: 0.028, volume: 0.028, filter: 'highpass', filterVan: 2200, aanslag: 0.002 });
    },

    /* Letter goed (rood vak): kort, helder, met een klein opwaarts zwiepje. */
    letterGoed: function (t) {
      toon({ start: t, van: hz(79), naar: hz(83), duur: 0.19, glijduur: 0.06,
             golf: 'triangle', volume: 0.15, ruimte: 0.16 });
      toon({ start: t + 0.005, van: hz(90), duur: 0.14, golf: 'sine', volume: 0.06, ruimte: 0.12 });
    },

    /* Letter aanwezig (gele cirkel): dezelfde familie, maar zachter en donkerder. */
    letterAanwezig: function (t) {
      toon({ start: t, van: hz(76), duur: 0.17, golf: 'triangle', volume: 0.13,
             filter: 'lowpass', filterHz: 1900, ruimte: 0.16 });
      toon({ start: t + 0.004, van: hz(71), duur: 0.13, golf: 'sine', volume: 0.05, ruimte: 0.1 });
    },

    /* Woord fout: laag en zacht dalend. Teleurstelling, geen straf. */
    woordFout: function (t) {
      toon({ start: t, van: hz(57), duur: 0.16, golf: 'sawtooth', volume: 0.13,
             filter: 'lowpass', filterHz: 850, ruimte: 0.12 });
      toon({ start: t + 0.13, van: hz(53), duur: 0.26, golf: 'sawtooth', volume: 0.12,
             filter: 'lowpass', filterHz: 700, ruimte: 0.16 });
      ruis({ start: t, duur: 0.12, volume: 0.04, filter: 'lowpass', filterVan: 500, filterNaar: 180 });
    },

    /* Woord goed: drieklank omhoog, kort en blij. */
    woordGoed: function (t) {
      var noten = [74, 78, 81];
      for (var i = 0; i < noten.length; i++) {
        toon({ start: t + i * 0.075, van: hz(noten[i]), duur: 0.3, golf: 'triangle',
               volume: 0.14, ruimte: 0.2 });
        toon({ start: t + i * 0.075, van: hz(noten[i] + 12), duur: 0.22, golf: 'sine',
               volume: 0.045, ruimte: 0.16 });
      }
    },

    /* Tijd bijna op: twee korte, gedempte pulsen. Spanning zonder pieptoon. */
    tijdBijnaOp: function (t) {
      for (var i = 0; i < 2; i++) {
        toon({ start: t + i * 0.15, van: hz(76), duur: 0.1, golf: 'square', volume: 0.1,
               filter: 'lowpass', filterHz: 1500, ruimte: 0.1 });
        toon({ start: t + i * 0.15, van: hz(64), duur: 0.11, golf: 'triangle', volume: 0.07,
               filter: 'lowpass', filterHz: 900 });
      }
    },

    /* Ronde gehaald: klein fanfaretje met een naklinkend akkoord. */
    rondeGehaald: function (t) {
      var noten = [69, 74, 78, 81];
      for (var i = 0; i < noten.length; i++) {
        toon({ start: t + i * 0.1, van: hz(noten[i]), duur: 0.42, golf: 'triangle',
               volume: 0.14, ruimte: 0.24 });
      }
      var akkoord = [62, 69, 78];
      for (var j = 0; j < akkoord.length; j++) {
        toon({ start: t + 0.34, van: hz(akkoord[j]), duur: 0.95, golf: 'sine',
               volume: 0.07, aanslag: 0.09, houd: 0.2, ruimte: 0.3 });
      }
    },

    /* Bal getrokken: de bal rolt door de goot en plopt in het bakje. */
    balGetrokken: function (t) {
      ruis({ start: t, duur: 0.5, volume: 0.075, filter: 'bandpass', filterQ: 1.4,
             filterVan: 320, filterMidden: 1300, filterNaar: 520, ruimte: 0.14 });
      toon({ start: t + 0.42, van: hz(64), naar: hz(50), duur: 0.16, glijduur: 0.1,
             golf: 'sine', volume: 0.17, ruimte: 0.2 });
      toon({ start: t + 0.44, van: hz(83), duur: 0.1, golf: 'triangle', volume: 0.05,
             filter: 'lowpass', filterHz: 2400 });
    },

    /* Lingo: de grote klap. Loper omhoog, breed akkoord, glinstering erover. */
    lingo: function (t) {
      var loper = [62, 66, 69, 74, 78, 81, 86];
      for (var i = 0; i < loper.length; i++) {
        toon({ start: t + i * 0.062, van: hz(loper[i]), duur: 0.4, golf: 'triangle',
               volume: 0.13, ruimte: 0.22 });
      }
      var akkoord = [50, 62, 66, 69, 74];
      for (var j = 0; j < akkoord.length; j++) {
        toon({ start: t + 0.42, van: hz(akkoord[j]), duur: 1.6, golf: 'sine',
               volume: 0.075, aanslag: 0.11, houd: 0.4, ruimte: 0.34 });
      }
      for (var k = 0; k < 7; k++) {
        toon({ start: t + 0.5 + k * 0.085, van: hz(86 + (k % 3) * 5), duur: 0.24,
               golf: 'sine', volume: 0.035, filter: 'lowpass', filterHz: 5200, ruimte: 0.3 });
      }
    },

    /* Extra's die het spel goed van pas komen, uit dezelfde toonvoorraad. */
    hint: function (t) {
      toon({ start: t, van: hz(83), duur: 0.16, golf: 'triangle', volume: 0.1, ruimte: 0.2 });
      toon({ start: t + 0.09, van: hz(90), duur: 0.28, golf: 'sine', volume: 0.07, ruimte: 0.24 });
    },

    ongeldig: function (t) {
      toon({ start: t, van: hz(58), duur: 0.13, golf: 'square', volume: 0.075,
             filter: 'lowpass', filterHz: 620 });
      toon({ start: t + 0.09, van: hz(56), duur: 0.15, golf: 'square', volume: 0.07,
             filter: 'lowpass', filterHz: 560 });
    },

    start: function (t) {
      toon({ start: t, van: hz(62), duur: 0.28, golf: 'triangle', volume: 0.12, ruimte: 0.22 });
      toon({ start: t + 0.11, van: hz(69), duur: 0.3, golf: 'triangle', volume: 0.12, ruimte: 0.22 });
      toon({ start: t + 0.22, van: hz(74), duur: 0.5, golf: 'triangle', volume: 0.12, ruimte: 0.26 });
    }
  };

  /* Namen mogen los geschreven worden: 'letter-goed', 'letter goed', 'letterGoed'. */
  var aliassen = {
    klik: 'toets', tik: 'toets', toets: 'toets',
    goed: 'letterGoed', lettergoed: 'letterGoed',
    aanwezig: 'letterAanwezig', letteraanwezig: 'letterAanwezig',
    fout: 'woordFout', woordfout: 'woordFout', mislukt: 'woordFout',
    woordgoed: 'woordGoed', gevonden: 'woordGoed',
    tijdbijnaop: 'tijdBijnaOp', tijd: 'tijdBijnaOp', tikkendeklok: 'tijdBijnaOp',
    rondegehaald: 'rondeGehaald', ronde: 'rondeGehaald', winst: 'rondeGehaald',
    balgetrokken: 'balGetrokken', bal: 'balGetrokken',
    lingo: 'lingo', bingo: 'lingo',
    hint: 'hint', ongeldig: 'ongeldig', schud: 'ongeldig', start: 'start'
  };

  function zoekGeluid(naam) {
    if (!naam) return null;
    var sleutel = String(naam).toLowerCase().replace(/[^a-z0-9]/g, '');
    var echt = aliassen[sleutel];
    if (echt && geluiden[echt]) return geluiden[echt];
    return geluiden[naam] || null;
  }

  /* ==========================================================================
     6. Achtergrondloop — zacht, melodisch, standaard uit
     ========================================================================== */

  var STAP_DUUR = 0.35;
  var VOORUIT = 0.4;   // hoeveel seconden we vooruit plannen

  // Vier akkoorden, elk acht stappen: D - Bm - G - A.
  var AKKOORDEN = [
    { bas: 38, tonen: [62, 66, 69] },
    { bas: 35, tonen: [59, 62, 66] },
    { bas: 31, tonen: [55, 59, 62] },
    { bas: 33, tonen: [57, 61, 64] }
  ];

  // Eén rustig wijsje van 32 stappen; null is stilte.
  var WIJSJE = [
    81, null, 78, null, 74, null, 76, null,
    78, null, null, 74, null, 71, null, null,
    76, null, 74, null, 71, null, 69, null,
    71, null, 74, null, 78, null, null, null
  ];

  function startMuziek() {
    if (!ctx || muziekLoopt) return;
    muziekLoopt = true;
    muziekStap = 0;
    muziekTijd = nu() + 0.12;
    muziekBus.gain.cancelScheduledValues(nu());
    muziekBus.gain.setValueAtTime(0.0001, nu());
    muziekBus.gain.exponentialRampToValueAtTime(0.22, nu() + 1.4);
    muziekKlok = global.setInterval(planMuziek, 25);
    planMuziek();
  }

  function stopMuziek(meteen) {
    if (!muziekLoopt) return;
    muziekLoopt = false;
    if (muziekKlok) { global.clearInterval(muziekKlok); muziekKlok = null; }
    if (muziekBus) {
      var t = nu();
      muziekBus.gain.cancelScheduledValues(t);
      muziekBus.gain.setValueAtTime(Math.max(0.0002, muziekBus.gain.value), t);
      muziekBus.gain.exponentialRampToValueAtTime(0.0001, t + (meteen ? 0.06 : 0.9));
    }
  }

  function planMuziek() {
    if (!ctx || !muziekLoopt) return;
    while (muziekTijd < nu() + VOORUIT) {
      speelStap(muziekStap, muziekTijd);
      muziekStap = (muziekStap + 1) % WIJSJE.length;
      muziekTijd += STAP_DUUR;
    }
  }

  function speelStap(stap, t) {
    var akkoord = AKKOORDEN[Math.floor(stap / 8) % AKKOORDEN.length];

    if (stap % 8 === 0) {
      // Zacht kussen: drie sinussen die traag opkomen.
      for (var i = 0; i < akkoord.tonen.length; i++) {
        toon({ start: t, van: hz(akkoord.tonen[i] - 12), duur: STAP_DUUR * 8.2, golf: 'sine',
               volume: 0.05, aanslag: 0.55, houd: STAP_DUUR * 4, bus: muziekBus, ruimte: 0.2 });
      }
      // Bas eronder.
      toon({ start: t, van: hz(akkoord.bas), duur: 2.4, golf: 'triangle', volume: 0.07,
             aanslag: 0.05, filter: 'lowpass', filterHz: 420, bus: muziekBus });
    }

    var noot = WIJSJE[stap];
    if (noot != null) {
      toon({ start: t, van: hz(noot), duur: 0.95, golf: 'triangle', volume: 0.06,
             aanslag: 0.035, filter: 'lowpass', filterHz: 2200, bus: muziekBus, ruimte: 0.3 });
      toon({ start: t, van: hz(noot - 12), duur: 0.7, golf: 'sine', volume: 0.025,
             aanslag: 0.04, bus: muziekBus });
    }
  }

  /* Buiten beeld zetten we de loop stil; bij terugkomst weer aan. */
  function letOpZichtbaarheid() {
    global.document.addEventListener('visibilitychange', function () {
      if (!ctx || !muziekBus) return;
      var t = nu();
      var doel = (global.document.hidden || !muziekLoopt) ? 0.0001 : 0.22;
      muziekBus.gain.cancelScheduledValues(t);
      muziekBus.gain.setValueAtTime(Math.max(0.0002, muziekBus.gain.value), t);
      muziekBus.gain.exponentialRampToValueAtTime(doel, t + 0.5);
    });
  }

  /* ==========================================================================
     7. Demper-knoppen
     ========================================================================== */

  function spiegelKnop(koppeling) {
    var el = koppeling.el;
    if (!el) return;
    var aan = koppeling.soort === 'muziek' ? muziekAan : !gedempt;
    el.setAttribute('aria-pressed', aan ? 'true' : 'false');
    el.setAttribute('data-staat', aan ? 'aan' : 'uit');
    el.classList.toggle('is-uit', !aan);
    el.classList.toggle('is-aan', aan);
    var titel = koppeling.soort === 'muziek'
      ? (aan ? 'Achtergrondmuziek uitzetten' : 'Achtergrondmuziek aanzetten')
      : (aan ? 'Geluid uitzetten' : 'Geluid aanzetten');
    // Wie zelf een label heeft gezet, markeert dat met data-dvl-eigen-label
    // en houdt het dan van ons.
    if (!el.hasAttribute('data-dvl-eigen-label')) el.setAttribute('aria-label', titel);
    el.setAttribute('title', titel);
    if (el.hasAttribute('data-dvl-label')) el.textContent = aan ? 'Aan' : 'Uit';
  }

  function koppelDemper(el, soort) {
    if (!el) return null;
    for (var i = 0; i < gekoppeld.length; i++) {
      if (gekoppeld[i].el === el) return gekoppeld[i];   // nooit dubbel koppelen
    }
    var koppeling = { el: el, soort: soort === 'muziek' ? 'muziek' : 'geluid' };
    koppeling.handler = function () {
      if (koppeling.soort === 'muziek') API.wisselMuziek();
      else API.wisselDemper();
    };
    el.addEventListener('click', koppeling.handler);
    gekoppeld.push(koppeling);
    spiegelKnop(koppeling);
    return koppeling;
  }

  function ontkoppelDemper(el) {
    for (var i = gekoppeld.length - 1; i >= 0; i--) {
      if (gekoppeld[i].el === el) {
        el.removeEventListener('click', gekoppeld[i].handler);
        gekoppeld.splice(i, 1);
      }
    }
  }

  /* Hangt game.js dezelfde knop óók aan DVL.Audio, dan schakelen er twee
     handlers binnen hetzelfde klik-event en draait de knop zichzelf meteen
     terug. We laten de eerste aanroep winnen en negeren wat er in diezelfde
     ronde van de gebeurtenislus nog achteraan komt. Een volgende klik zit in
     een nieuwe ronde en gaat dus gewoon door. */
  function onthoudWissel() {
    netGeschakeld = true;
    global.setTimeout(function () { netGeschakeld = false; }, 0);
  }

  function isHerhaling() { return netGeschakeld; }

  /* Een demper-knop hoort te laten zien dat hij uit staat. De opmaak daarvan
     hoort in de CSS thuis, maar zolang niemand `data-staat` oppakt geven we
     zelf een terugval. Dit blokje gaat bewust vóór alle andere stijlbladen in
     de <head> staan, zodat een echte regel met dezelfde zwaarte altijd wint. */
  function zorgVoorDemperStijl() {
    var d = global.document;
    if (d.querySelector('style[data-dvl-demperstijl]')) return;
    var stijl = d.createElement('style');
    stijl.setAttribute('data-dvl-demperstijl', 'terugval');
    stijl.textContent =
      '[data-staat="uit"] .icoon{opacity:.42;filter:grayscale(1)}' +
      '[data-staat="uit"]{opacity:.72}';
    var hoofd = d.head || d.documentElement;
    hoofd.insertBefore(stijl, hoofd.firstChild);
  }

  function zoekKnoppen() {
    var d = global.document;
    var geluidKnoppen = d.querySelectorAll('[data-dvl-geluid], #geluid, #demper, .knop-geluid');
    var muziekKnoppen = d.querySelectorAll('[data-dvl-muziek], #muziek, .knop-muziek');
    for (var i = 0; i < geluidKnoppen.length; i++) koppelDemper(geluidKnoppen[i], 'geluid');
    for (var j = 0; j < muziekKnoppen.length; j++) koppelDemper(muziekKnoppen[j], 'muziek');
  }

  /* ==========================================================================
     8. Openbare API
     ========================================================================== */

  var API = {

    /* Zet de luisteraars klaar en koppelt gevonden knoppen. Meermaals aanroepen
       mag: alles is idempotent. */
    init: function () {
      zorgVoorDemperStijl();
      zoekKnoppen();
      meld();
      return API;
    },

    /* Speelt een geluid op naam. Vóór de eerste aanraking gebeurt er niets. */
    speel: function (naam, vertraging) {
      if (gedempt) return false;
      if (!ctx) { ontgrendel(); }
      if (!ctx) return false;
      var maker = zoekGeluid(naam);
      if (!maker) return false;
      if (ctx.state === 'suspended' && ctx.resume) { try { ctx.resume(); } catch (e) {} }
      try { maker(nu() + (vertraging || 0.001)); } catch (e) { return false; }
      return true;
    },

    /* Losse namen, prettiger vanuit game.js. */
    toets: function () { return API.speel('toets'); },
    letterGoed: function (i) { return API.speel('letterGoed', (i || 0) * 0.06); },
    letterAanwezig: function (i) { return API.speel('letterAanwezig', (i || 0) * 0.06); },
    woordFout: function () { return API.speel('woordFout'); },
    woordGoed: function () { return API.speel('woordGoed'); },
    tijdBijnaOp: function () { return API.speel('tijdBijnaOp'); },
    rondeGehaald: function () { return API.speel('rondeGehaald'); },
    balGetrokken: function () { return API.speel('balGetrokken'); },
    lingo: function () { return API.speel('lingo'); },
    hint: function () { return API.speel('hint'); },
    ongeldig: function () { return API.speel('ongeldig'); },

    /* --- demper --- */
    gedempt: function () { return gedempt; },
    aan: function () { return !gedempt; },

    zetGedempt: function (waarde) {
      waarde = !!waarde;
      if (isHerhaling()) return gedempt;
      onthoudWissel();
      if (gedempt === waarde) { meld(); return gedempt; }
      gedempt = waarde;
      bewaarSchakelaar(SLEUTEL_GELUID, !gedempt);
      if (meester) {
        var t = nu();
        meester.gain.cancelScheduledValues(t);
        meester.gain.setValueAtTime(Math.max(0.0001, meester.gain.value), t);
        meester.gain.linearRampToValueAtTime(gedempt ? 0 : 0.9, t + 0.12);
      }
      meld();
      if (!gedempt) { ontgrendel(); API.speel('toets'); }
      return gedempt;
    },

    wisselDemper: function () { return API.zetGedempt(!gedempt); },

    /* --- achtergrondmuziek --- */
    muziekStaatAan: function () { return muziekAan; },

    zetMuziek: function (waarde) {
      waarde = !!waarde;
      if (isHerhaling()) return muziekAan;
      onthoudWissel();
      muziekAan = waarde;
      bewaarSchakelaar(SLEUTEL_MUZIEK, muziekAan);
      if (muziekAan) { ontgrendel(); startMuziek(); }
      else { stopMuziek(false); }
      meld();
      return muziekAan;
    },

    wisselMuziek: function () { return API.zetMuziek(!muziekAan); },

    /* --- knoppen en luisteraars --- */
    koppelDemper: koppelDemper,
    koppelMuziekknop: function (el) { return koppelDemper(el, 'muziek'); },
    ontkoppelDemper: ontkoppelDemper,

    luister: function (cb) {
      if (typeof cb !== 'function') return function () {};
      luisteraars.push(cb);
      try { cb(staatBeeld()); } catch (e) {}
      return function () {
        var i = luisteraars.indexOf(cb);
        if (i >= 0) luisteraars.splice(i, 1);
      };
    },

    staat: staatBeeld,
    gereed: function () { return !!ctx; },
    context: function () { return ctx; },

    /* Handmatig ontgrendelen, bijvoorbeeld vanuit een startknop. */
    ontgrendel: function () { geraakt = true; return ontgrendel(); }
  };

  DVL.Audio = API;

  luisterNaarAanraking();
  letOpZichtbaarheid();

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', function () { API.init(); });
  } else {
    API.init();
  }

})(window);
