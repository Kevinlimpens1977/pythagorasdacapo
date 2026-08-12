/* ==========================================================================
   Quizmasterpaneel — beheer-UI voor de woordenlijst.
   Hangt aan window.DVL. Geen modules, geen externe verzoeken: werkt vanaf schijf.
   Opslaan gaat uitsluitend via DVL.Opslag (sleutel dvl.lijst.v1).
   ========================================================================== */

(function () {
  'use strict';

  var DVL = (window.DVL = window.DVL || {});

  /* ------------------------------------------------------------------ */
  /* Noodvoorziening: als js/opslag.js (nog) niet geladen is, valt de     */
  /* pagina hierop terug zodat ze nooit stuk staat. Zelfde contract,      */
  /* zelfde sleutel — zodra de echte opslag er is, wordt deze genegeerd.  */
  /* ------------------------------------------------------------------ */

  var SLEUTEL = 'dvl.lijst.v1';

  if (!DVL.Opslag) {
    DVL.Opslag = (function () {
      function leeg() {
        return { gebruikEigenLijst: false, schud: false, woorden: [] };
      }
      function schudKopie(rij) {
        var kopie = rij.slice(), i, j, hulp;
        for (i = kopie.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          hulp = kopie[i]; kopie[i] = kopie[j]; kopie[j] = hulp;
        }
        return kopie;
      }
      return {
        laadLijst: function () {
          try {
            var ruw = window.localStorage.getItem(SLEUTEL);
            if (!ruw) return leeg();
            var o = JSON.parse(ruw) || {};
            return {
              gebruikEigenLijst: !!o.gebruikEigenLijst,
              schud: !!o.schud,
              woorden: Array.isArray(o.woorden) ? o.woorden : []
            };
          } catch (fout) {
            return leeg();
          }
        },
        bewaarLijst: function (lijst) {
          try {
            window.localStorage.setItem(SLEUTEL, JSON.stringify({
              gebruikEigenLijst: !!lijst.gebruikEigenLijst,
              schud: !!lijst.schud,
              woorden: lijst.woorden || []
            }));
          } catch (fout) { /* opslag vol of geblokkeerd: stil verder */ }
        },
        actieveWoorden: function () {
          var lijst = this.laadLijst();
          var bron = (lijst.gebruikEigenLijst && lijst.woorden.length)
            ? lijst.woorden
            : (DVL.STANDAARDWOORDEN || []);
          return lijst.schud ? schudKopie(bron) : bron.slice();
        },
        luister: function (terugroep) {
          var zelf = this;
          window.addEventListener('storage', function (e) {
            if (!e.key || e.key === SLEUTEL) terugroep(zelf.laadLijst());
          });
        }
      };
    }());
  }

  /* Noodlijst zodat "standaardlijst overnemen" ook werkt als js/woorden.js
     nog niet bestaat. De echte lijst wint altijd. */
  if (!Array.isArray(DVL.STANDAARDWOORDEN) || !DVL.STANDAARDWOORDEN.length) {
    DVL.STANDAARDWOORDEN = [
      { woord: 'MUIS', uitleg: 'Het aanwijsapparaat naast je toetsenbord.' },
      { woord: 'BESTAND', uitleg: 'Een document of foto zoals de computer het bewaart.' },
      { woord: 'BROWSER', uitleg: 'Het programma waarmee je websites bekijkt.' },
      { woord: 'PHISHING', uitleg: 'Een nepbericht dat naar je gegevens vist.' },
      { woord: 'BACKUP', uitleg: 'Een reservekopie voor als er iets misgaat.' },
      { woord: 'WACHTWOORD', uitleg: 'Liefst lang, uniek en in een wachtwoordkluis.' }
    ].filter(function (item) { return item.woord.length <= 9; });
  }

  /* ------------------------------------------------------------------ */
  /* Hulpjes                                                             */
  /* ------------------------------------------------------------------ */

  function $(kiezer) { return document.querySelector(kiezer); }
  function $$(kiezer) { return Array.prototype.slice.call(document.querySelectorAll(kiezer)); }

  function veiligeTekst(tekst) {
    return String(tekst == null ? '' : tekst)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* Accenten weghalen en hoofdletters afdwingen. Spaties en streepjes vallen
     weg, net als in js/opslag.js, zodat BACK-UP gewoon BACKUP wordt. Al het
     andere blijft staan, want dat moet de keuring kunnen afkeuren. */
  function normaliseerWoord(ruw) {
    var tekst = String(ruw == null ? '' : ruw);
    if (typeof tekst.normalize === 'function') {
      tekst = tekst.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return tekst.toUpperCase().replace(/[\s\-\u2010-\u2015_]+/g, '');
  }

  function schoneUitleg(ruw) {
    return String(ruw == null ? '' : ruw).replace(/\s+/g, ' ').trim().slice(0, 160);
  }

  var MIN_LENGTE = 3;
  var MAX_LENGTE = 9;

  /* Geeft { ok, woord, reden } terug. */
  function keurWoord(ruw, lijst, negeerIndex) {
    var woord = normaliseerWoord(ruw);
    if (!woord) return { ok: false, woord: '', reden: 'Vul eerst een woord in.' };
    if (!/^[A-Z]+$/.test(woord)) {
      return { ok: false, woord: woord, reden: 'Alleen letters — cijfers en leestekens kunnen niet.' };
    }
    if (woord.length < MIN_LENGTE) {
      return { ok: false, woord: woord, reden: 'Te kort: minstens ' + MIN_LENGTE + ' letters (dit zijn er ' + woord.length + ').' };
    }
    if (woord.length > MAX_LENGTE) {
      return { ok: false, woord: woord, reden: 'Te lang: hoogstens ' + MAX_LENGTE + ' letters (dit zijn er ' + woord.length + ').' };
    }
    if (lijst) {
      for (var i = 0; i < lijst.length; i++) {
        if (i !== negeerIndex && lijst[i].woord === woord) {
          return { ok: false, woord: woord, dubbel: true, reden: woord + ' staat al in de lijst, op plek ' + (i + 1) + '.' };
        }
      }
    }
    return { ok: true, woord: woord, reden: woord.length + ' letters — klaar om toe te voegen.' };
  }

  /* ------------------------------------------------------------------ */
  /* Staat                                                               */
  /* ------------------------------------------------------------------ */

  var staat = {
    lijst: { gebruikEigenLijst: false, schud: false, woorden: [] },
    bewerkIndex: -1,
    laatstVerwijderd: null,
    nieuweIndex: -1,
    zoek: '',
    /* Welke rij op een smal scherm openstaat (−1 = geen). Er staat er hooguit
       één open, zodat de lijst scanbaar blijft. */
    openIndex: -1,
    /* Staat het toevoegformulier op een smal scherm open? null = nog niet
       aangeraakt, dan beslist de lijst zelf: leeg is open, gevuld is dicht. */
    invoerHand: null
  };

  /* Dezelfde grenzen als in css/quizmaster.css, zodat opmaak en gedrag nooit
     iets anders vinden: onder 44rem is de rij compact, onder 62rem staat de
     zijkolom bovenaan en klapt hij dicht. */
  var SMAL = '(max-width: 44rem)';

  function compacteRij() {
    return !!(window.matchMedia && window.matchMedia(SMAL).matches);
  }

  var el = {};

  function laadUitOpslag() {
    var geladen = DVL.Opslag.laadLijst() || {};
    staat.openIndex = -1;
    staat.lijst = {
      gebruikEigenLijst: !!geladen.gebruikEigenLijst,
      schud: !!geladen.schud,
      woorden: (Array.isArray(geladen.woorden) ? geladen.woorden : [])
        .map(function (item) {
          if (typeof item === 'string') return { woord: normaliseerWoord(item), uitleg: '' };
          return { woord: normaliseerWoord(item && item.woord), uitleg: schoneUitleg(item && item.uitleg) };
        })
        .filter(function (item) { return item.woord.length >= MIN_LENGTE; })
    };
  }

  function bewaar() {
    /* De lijst verandert, dus de rij die openstond klopt niet meer met zijn
       nummer. Wie iets verschuift zet hem daarna zelf weer open. */
    staat.openIndex = -1;
    DVL.Opslag.bewaarLijst({
      gebruikEigenLijst: staat.lijst.gebruikEigenLijst,
      schud: staat.lijst.schud,
      woorden: staat.lijst.woorden.map(function (item) {
        return { woord: item.woord, uitleg: item.uitleg || '' };
      })
    });
    /* Voor luisteraars in ditzelfde tabblad (een storage-event vuurt daar niet). */
    document.dispatchEvent(new CustomEvent('dvl:lijst-gewijzigd', { detail: staat.lijst }));
  }

  /* De rijen die op dit moment in beeld staan: eigen lijst of standaardlijst. */
  function zichtbareWoorden() {
    return staat.lijst.gebruikEigenLijst ? staat.lijst.woorden : (DVL.STANDAARDWOORDEN || []);
  }

  function bewerkbaar() {
    return staat.lijst.gebruikEigenLijst;
  }

  /* ------------------------------------------------------------------ */
  /* Zoeken in de lijst                                                  */
  /* ------------------------------------------------------------------ */

  /* Zoekt in het woord én in de uitleg. Het woord wordt op dezelfde manier
     genormaliseerd als bij invoer, zodat "back-up" ook BACKUP vindt. */
  function pastBijZoek(item) {
    var vraag = staat.zoek;
    if (!vraag) return true;
    var alsWoord = normaliseerWoord(vraag);
    if (alsWoord && item.woord.indexOf(alsWoord) !== -1) return true;
    return String(item.uitleg || '').toLowerCase().indexOf(vraag.toLowerCase()) !== -1;
  }

  /* Geeft veilige HTML terug met de treffer in een <mark>. */
  function markeer(tekst, term) {
    var bron = String(tekst == null ? '' : tekst);
    if (!term) return veiligeTekst(bron);
    var plek = bron.toUpperCase().indexOf(String(term).toUpperCase());
    if (plek < 0) return veiligeTekst(bron);
    return veiligeTekst(bron.slice(0, plek)) +
      '<mark class="qm-tref">' + veiligeTekst(bron.slice(plek, plek + term.length)) + '</mark>' +
      veiligeTekst(bron.slice(plek + term.length));
  }

  function zetZoek(tekst) {
    var nieuw = String(tekst == null ? '' : tekst).trim();
    if (nieuw === staat.zoek) return;
    staat.zoek = nieuw;
    staat.bewerkIndex = -1;
    staat.openIndex = -1;
    if (el.zoek && el.zoek.value !== tekst) el.zoek.value = tekst;
    if (el.zoekwis) el.zoekwis.hidden = !nieuw;
    tekenLijst();
  }

  /* ------------------------------------------------------------------ */
  /* Meldingen                                                           */
  /* ------------------------------------------------------------------ */

  var meldingKlok = null;

  function meld(tekst, soort, actie) {
    var vak = el.melding;
    vak.className = 'qm-melding is-zichtbaar qm-melding--' + (soort || 'info');
    vak.textContent = tekst;
    if (actie) {
      var knop = document.createElement('button');
      knop.type = 'button';
      knop.className = 'qm-knop';
      knop.textContent = actie.tekst;
      knop.addEventListener('click', function () { actie.doe(); });
      vak.appendChild(knop);
    }
    window.clearTimeout(meldingKlok);
    meldingKlok = window.setTimeout(function () {
      vak.className = 'qm-melding';
      vak.textContent = '';
    }, actie ? 9000 : 4500);
  }

  function wisMelding() {
    window.clearTimeout(meldingKlok);
    el.melding.className = 'qm-melding';
    el.melding.textContent = '';
  }

  /* ------------------------------------------------------------------ */
  /* Tekenen                                                             */
  /* ------------------------------------------------------------------ */

  function miniHtml(woord) {
    var stukken = [];
    for (var i = 0; i < woord.length; i++) {
      stukken.push(
        '<span class="qm-minitegel' + (i === 0 ? ' qm-minitegel--gegeven' : '') + '">' +
          '<span class="qm-miniletter">' + veiligeTekst(woord.charAt(i)) + '</span>' +
          '<span class="qm-ministip"></span>' +
        '</span>'
      );
    }
    return '<div class="qm-mini" title="Zo begint de rij in het spel: de eerste letter krijgen de spelers cadeau.">' + stukken.join('') + '</div>';
  }

  function icoonHtml(naam) {
    return '<svg class="qm-icoon" aria-hidden="true"><use href="#qm-i-' + naam + '"></use></svg>';
  }

  function telDubbelen(woorden) {
    var telling = {}, i;
    for (i = 0; i < woorden.length; i++) {
      telling[woorden[i].woord] = (telling[woorden[i].woord] || 0) + 1;
    }
    return telling;
  }

  function tekenLijst() {
    var woorden = zichtbareWoorden();
    var kanBewerken = bewerkbaar();
    var dubbelen = telDubbelen(woorden);
    var aantalDubbel = 0;
    var lijstEl = el.woorden;

    /* Zolang er gezocht wordt klopt de zichtbare volgorde niet met de echte
       volgorde. Verslepen en verschuiven gaan dan uit; met een leeg zoekveld
       werken ze gewoon. */
    var zoekterm = staat.zoek;
    var woordTerm = zoekterm ? normaliseerWoord(zoekterm) : '';
    var kanOrdenen = kanBewerken && !zoekterm;
    var ordenUit = 'Zet het zoekveld leeg om de volgorde aan te passen.';
    var getoond = 0;

    lijstEl.innerHTML = '';
    lijstEl.classList.toggle('qm-woorden--alleenlezen', !kanBewerken);
    lijstEl.classList.toggle('qm-woorden--gefilterd', !!zoekterm);

    woorden.forEach(function (item, index) {
      var isDubbel = dubbelen[item.woord] > 1;
      if (isDubbel) aantalDubbel++;
      if (!pastBijZoek(item)) return;
      getoond++;

      var rij = document.createElement('li');
      rij.className = 'qm-rij' + (isDubbel ? ' qm-rij--dubbel' : '');
      rij.dataset.index = String(index);
      if (index === staat.nieuweIndex) rij.classList.add('qm-rij--nieuw');
      var staatOpen = index === staat.openIndex;
      if (staatOpen) rij.classList.add('qm-rij--open');

      if (kanBewerken && index === staat.bewerkIndex) {
        rij.classList.add('qm-rij--bewerkt');
        rij.innerHTML =
          '<span class="qm-greep" aria-hidden="true">' + icoonHtml('greep') + '</span>' +
          '<span class="qm-nummer">' + (index + 1) + '</span>' +
          '<div class="qm-rij-bewerk">' +
            '<div class="qm-veld">' +
              '<label for="qm-bewerk-woord">Woord</label>' +
              '<input type="text" id="qm-bewerk-woord" name="woord" maxlength="9" spellcheck="false" value="' + veiligeTekst(item.woord) + '">' +
            '</div>' +
            '<div class="qm-veld">' +
              '<label for="qm-bewerk-uitleg">Uitleg</label>' +
              '<input type="text" id="qm-bewerk-uitleg" name="uitleg" maxlength="160" value="' + veiligeTekst(item.uitleg || '') + '">' +
            '</div>' +
            '<p class="qm-hint" data-rol="bewerkhint"></p>' +
            '<div class="qm-bewerkknoppen">' +
              '<button class="qm-knop qm-knop--hoofd" type="button" data-rij-actie="bewaren">Bewaren</button>' +
              '<button class="qm-knop" type="button" data-rij-actie="annuleren">Annuleren</button>' +
            '</div>' +
          '</div>';
      } else {
        var buitenRonde = item.woord.length < 5 || item.woord.length > 7;
        /* Op smalle schermen staat "buiten de rondes" niet als pil naast het
           woord maar vóór de uitleg; css/quizmaster.css heeft daar deze
           klasse voor nodig. */
        if (buitenRonde) rij.classList.add('qm-rij--buiten');
        rij.innerHTML =
          (kanOrdenen
            ? '<button class="qm-greep" type="button" data-rij-actie="greep" aria-label="Verplaats ' + veiligeTekst(item.woord) + ': slepen, of pijltjestoetsen">' + icoonHtml('greep') + '</button>'
            : '<span class="qm-greep" aria-hidden="true"' + (zoekterm ? ' title="' + ordenUit + '"' : '') + '>' + icoonHtml('greep') + '</span>') +
          '<span class="qm-nummer">' + (index + 1) + '</span>' +
          '<div class="qm-inhoud">' +
            '<div class="qm-woordregel">' +
              '<span class="qm-woordtekst">' + markeer(item.woord, woordTerm) + '</span>' +
              '<span class="qm-label qm-label--lengte">' + item.woord.length + ' letters</span>' +
              (isDubbel ? '<span class="qm-label qm-label--dubbel">dubbel</span>' : '') +
              (buitenRonde ? '<span class="qm-label qm-label--buiten">buiten de rondes</span>' : '') +
            '</div>' +
            miniHtml(item.woord) +
            /* data-lengte voedt op smalle schermen het "7 letters ·" vóór de
               uitleg; daar staat het woord dan alleen op zijn eigen regel. */
            '<p class="qm-uitleg' + (item.uitleg ? '' : ' qm-uitleg--leeg') + '" data-lengte="' + item.woord.length + '">' +
              (item.uitleg
                ? markeer(item.uitleg, zoekterm)
                : 'Geen uitleg — het spel toont alleen het woord.') +
            '</p>' +
          '</div>' +
          /* Alleen zichtbaar op smalle schermen (css: .qm-rijknop--klap).
             Daar zit het gereedschap erachter; op het bureaublad staat het
             gewoon in de rij en bestaat deze knop niet. */
          '<button class="qm-rijknop qm-rijknop--klap" type="button" data-rij-actie="uitklap"' +
            ' aria-expanded="' + (staatOpen ? 'true' : 'false') + '"' +
            ' aria-label="' + (staatOpen ? 'Gereedschap voor ' + veiligeTekst(item.woord) + ' verbergen' : 'Gereedschap voor ' + veiligeTekst(item.woord) + ' tonen') + '">' +
            icoonHtml('chevron') +
          '</button>' +
          '<div class="qm-acties">' +
            (kanBewerken
              ? '<button class="qm-rijknop" type="button" data-rij-actie="omhoog" title="' + (kanOrdenen ? 'Eén plek omhoog' : ordenUit) + '" aria-label="' + veiligeTekst(item.woord) + ' één plek omhoog"' + (index === 0 || !kanOrdenen ? ' disabled' : '') + '>' + icoonHtml('omhoog') + '</button>' +
                '<button class="qm-rijknop" type="button" data-rij-actie="omlaag" title="' + (kanOrdenen ? 'Eén plek omlaag' : ordenUit) + '" aria-label="' + veiligeTekst(item.woord) + ' één plek omlaag"' + (index === woorden.length - 1 || !kanOrdenen ? ' disabled' : '') + '>' + icoonHtml('omlaag') + '</button>'
              : '') +
            '<button class="qm-rijknop qm-rijknop--test" type="button" data-rij-actie="test" title="Test dit woord in het spel" aria-label="Test ' + veiligeTekst(item.woord) + ' in het spel">' + icoonHtml('speel') + '</button>' +
            (kanBewerken
              ? '<button class="qm-rijknop" type="button" data-rij-actie="wijzig" title="Wijzigen" aria-label="' + veiligeTekst(item.woord) + ' wijzigen">' + icoonHtml('potlood') + '</button>' +
                '<button class="qm-rijknop qm-rijknop--wis" type="button" data-rij-actie="verwijder" title="Verwijderen" aria-label="' + veiligeTekst(item.woord) + ' verwijderen">' + icoonHtml('prullenbak') + '</button>'
              : '') +
          '</div>';
      }

      lijstEl.appendChild(rij);
    });

    staat.nieuweIndex = -1;

    var leegVak = el.leeg;
    var toonLeeg = kanBewerken && woorden.length === 0;
    leegVak.hidden = !toonLeeg;
    if (toonLeeg && !leegVak.querySelector('.qm-leeg-tegels span')) {
      var tegels = leegVak.querySelector('.qm-leeg-tegels');
      tegels.innerHTML = '<span></span><span></span><span></span><span></span><span></span>';
    }

    /* Teller in de balk en de "niets gevonden"-tekst. */
    if (el.balkteller) {
      el.balkteller.textContent = zoekterm
        ? getoond + ' van ' + woorden.length
        : woorden.length + ' ' + (woorden.length === 1 ? 'woord' : 'woorden');
    }
    if (el.geenhit) {
      var geenTreffer = !!zoekterm && getoond === 0 && woorden.length > 0;
      el.geenhit.hidden = !geenTreffer;
      if (geenTreffer) {
        el.geenhit.innerHTML = 'Geen woord of uitleg met <strong>' + veiligeTekst(zoekterm) + '</strong> ' +
          'in deze ' + (kanBewerken ? 'lijst' : 'standaardlijst') + ' van ' + woorden.length + ' woorden. ' +
          '<button class="qm-knop" type="button" data-actie="zoek-wissen">Zoekopdracht wissen</button>';
      }
    }
    if (el.zoeknoot) {
      el.zoeknoot.hidden = !(zoekterm && kanBewerken && getoond > 0);
    }

    el.knopDubbelen.hidden = !(kanBewerken && aantalDubbel > 0);

    if (staat.bewerkIndex > -1) {
      var invoer = lijstEl.querySelector('#qm-bewerk-woord');
      if (invoer) { invoer.focus(); invoer.select(); }
    }
  }

  function tekenTellers() {
    var woorden = zichtbareWoorden();
    var telling = {}, grootste = 0, lengte, i;
    for (i = 0; i < woorden.length; i++) {
      lengte = woorden[i].woord.length;
      telling[lengte] = (telling[lengte] || 0) + 1;
      if (telling[lengte] > grootste) grootste = telling[lengte];
    }

    var html = '';
    for (lengte = MIN_LENGTE; lengte <= MAX_LENGTE; lengte++) {
      var aantal = telling[lengte] || 0;
      if (!aantal) continue;
      var buiten = lengte < 5 || lengte > 7;
      var breedte = grootste ? Math.round((aantal / grootste) * 100) : 0;
      html +=
        '<div class="qm-teller' + (buiten ? ' qm-teller--buiten' : '') + '">' +
          '<span class="qm-teller-naam">' + lengte + ' letters</span>' +
          '<span class="qm-teller-spoor"><span class="qm-teller-vulling" style="width:' + breedte + '%"></span></span>' +
          '<span class="qm-teller-getal">' + aantal + '</span>' +
        '</div>';
    }
    if (!html) {
      html = '<p class="qm-voetnoot" style="margin:0">Nog niets te tellen — voeg eerst een woord toe.</p>';
    } else {
      html +=
        '<div class="qm-teller qm-teller--totaal">' +
          '<span class="qm-teller-naam">Totaal</span>' +
          '<span></span>' +
          '<span class="qm-teller-getal">' + woorden.length + '</span>' +
        '</div>';
    }
    el.tellers.innerHTML = html;
  }

  /* ---- wat speelt elk level? ----------------------------------------
     Deze cijfers komen uit dezelfde kernfunctie als het spel gebruikt
     (DVL.Core.telRondes) en uit dezelfde leveltabel (DVL.Startscherm.LEVELS),
     zodat deze pagina niet iets anders kan beweren dan er straks gespeeld
     wordt — inclusief de terugval "geen enkel woord van deze lengte, dan
     speelt het spel de hele lijst".                                       */

  function levelOverzicht() {
    var Core = DVL.Core;
    var LEVELS = DVL.Startscherm && DVL.Startscherm.LEVELS;
    if (!Core || typeof Core.telRondes !== 'function' || !LEVELS) return null;

    /* Een lege eigen lijst telt niet als eigen lijst: dan speelt het spel de
       standaardlijst, en dat moet hier dus ook doorgerekend worden. */
    var eigen = staat.lijst.gebruikEigenLijst && staat.lijst.woorden.length > 0;
    var woorden = eigen ? staat.lijst.woorden : (DVL.STANDAARDWOORDEN || []);
    var uit = [];
    for (var nummer = 1; nummer <= 3; nummer++) {
      var level = LEVELS[nummer];
      if (!level) continue;
      var passend = 0;
      for (var i = 0; i < woorden.length; i++) {
        if (level.lengtes.indexOf(woorden[i].woord.length) !== -1) passend++;
      }
      var aantal = Core.telRondes(woorden, {
        lengtes: level.lengtes,
        eigenLijst: eigen,
        /* Een eigen lijst wordt helemaal afgespeeld; de standaardlijst
           blijft op het vaste aantal rondes van het level staan. */
        aantalWoorden: eigen ? 0 : level.rondes,
        schud: staat.lijst.schud
      });
      uit.push({
        nummer: nummer,
        lengtes: level.lengtes,
        aantal: aantal,
        passend: passend,
        terugval: passend === 0 && aantal > 0
      });
    }
    return uit;
  }

  function lengteZin(lengtes) {
    if (lengtes.length === 1) return lengtes[0] + ' letters';
    return lengtes.slice(0, -1).join(', ') + ' en ' + lengtes[lengtes.length - 1] + ' letters';
  }

  /* De cijfers die in de dichtgeklapte spelkaart staan (alleen zichtbaar op
     smalle schermen). Zo hoeft niemand iets open te klappen om te zien
     hoeveel rondes elk level straks speelt. */
  function tekenLevelchips(rijen) {
    if (!el.zijchips) return;
    if (!rijen || !rijen.length) { el.zijchips.innerHTML = ''; return; }
    var html = '';
    for (var i = 0; i < rijen.length; i++) {
      html += '<span class="qm-levelchip' + (rijen[i].terugval ? ' qm-levelchip--terugval' : '') + '">' +
        'Level ' + rijen[i].nummer + ' · <b>' + rijen[i].aantal + '</b>' +
        '<span class="visueel-verborgen"> ' + (rijen[i].aantal === 1 ? 'ronde' : 'rondes') + '</span>' +
      '</span>';
    }
    el.zijchips.innerHTML = html;
  }

  function tekenLevels() {
    if (!el.levels) return;
    var rijen = levelOverzicht();
    tekenLevelchips(rijen);
    if (!rijen) {
      el.levels.innerHTML = '<p class="qm-voetnoot" style="margin:0">Het leveloverzicht kon niet berekend worden.</p>';
      el.leveluitleg.textContent = '';
      el.buiten.textContent = '';
      return;
    }

    var grootste = 0, i;
    for (i = 0; i < rijen.length; i++) grootste = Math.max(grootste, rijen[i].aantal);

    var html = '';
    for (i = 0; i < rijen.length; i++) {
      var r = rijen[i];
      var breedte = grootste ? Math.round((r.aantal / grootste) * 100) : 0;
      html +=
        '<div class="qm-teller' + (r.terugval ? ' qm-teller--buiten' : '') + '"' +
          ' title="Level ' + r.nummer + ' speelt woorden van ' + lengteZin(r.lengtes) + '">' +
          '<span class="qm-teller-naam">Level ' + r.nummer + '</span>' +
          '<span class="qm-teller-spoor"><span class="qm-teller-vulling" style="width:' + breedte + '%"></span></span>' +
          '<span class="qm-teller-getal">' + r.aantal + '</span>' +
        '</div>';
    }
    el.levels.innerHTML = html;

    var eigen = staat.lijst.gebruikEigenLijst && staat.lijst.woorden.length > 0;
    var basis = 'Level 1 speelt woorden van 5 letters, level 2 van 5 en 6, level 3 van 5, 6 en 7. ';
    var uitleg = basis + (eigen
      ? 'Je eigen lijst wordt helemaal afgespeeld, in de volgorde hieronder: het aantal rondes is dus het aantal woorden dat bij dat level past.'
      : 'De standaardlijst is te lang om helemaal af te spelen, dus die blijft op 3, 4 en 5 rondes staan.');

    var terugval = [];
    for (i = 0; i < rijen.length; i++) {
      if (rijen[i].terugval) terugval.push('level ' + rijen[i].nummer);
    }
    if (terugval.length) {
      uitleg += ' Bij ' + terugval.join(' en ') + ' past geen enkel woord op lengte; dan speelt het spel ' +
        'liever de hele lijst dan een leeg potje.';
    }
    el.leveluitleg.textContent = uitleg;

    /* Welke rijen vallen buiten alle levels? Dat zijn de woorden die te kort
       of te lang zijn; in de lijst dragen ze het label "buiten de rondes". */
    var woorden = zichtbareWoorden();
    var buiten = [];
    for (i = 0; i < woorden.length; i++) {
      var lengte = woorden[i].woord.length;
      if (lengte < 5 || lengte > 7) buiten.push({ plek: i + 1, woord: woorden[i].woord, lengte: lengte });
    }
    if (!buiten.length) {
      el.buiten.textContent = woorden.length
        ? 'Elk woord in de lijst past bij minstens één level.'
        : '';
      return;
    }
    var namen = [];
    for (i = 0; i < buiten.length && i < 6; i++) {
      namen.push('nr. ' + buiten[i].plek + ' ' + buiten[i].woord + ' (' + buiten[i].lengte + ')');
    }
    var staart = buiten.length > namen.length ? ' en nog ' + (buiten.length - namen.length) + ' andere' : '';
    el.buiten.textContent = 'Buiten alle levels (te kort of te lang, label "buiten de rondes"): ' +
      namen.join(', ') + staart + '. ' +
      (buiten.length === 1 ? 'Dat woord komt' : 'Die woorden komen') + ' in geen enkel level aan de beurt.';
  }

  function tekenBron() {
    el.bronEigen.checked = staat.lijst.gebruikEigenLijst;
    el.bronStandaard.checked = !staat.lijst.gebruikEigenLijst;
    el.schud.checked = staat.lijst.schud;

    var eigenAantal = staat.lijst.woorden.length;
    var standaardAantal = (DVL.STANDAARDWOORDEN || []).length;

    if (staat.lijst.gebruikEigenLijst) {
      el.bronuitleg.textContent = eigenAantal
        ? 'Het spel speelt jouw eigen lijst helemaal af, in deze volgorde: ' + eigenAantal + ' ' +
          (eigenAantal === 1 ? 'woord' : 'woorden') + '. Elk level houdt alleen de woordlengtes over die erbij horen — ' +
          'hieronder staat hoeveel dat er per level zijn.'
        : 'Je eigen lijst is nog leeg. Zolang dat zo is, valt het spel terug op de standaardlijst.';
      el.lijstuitleg.textContent = 'Je eigen lijst. Sleep aan de greep of gebruik de pijlen om de volgorde te bepalen.';
    } else {
      el.bronuitleg.textContent = 'Het spel speelt de standaardlijst over digitale vaardigheden af: ' +
        standaardAantal + ' ' + (standaardAantal === 1 ? 'woord' : 'woorden') + '. Zet de schakelaar op "Eigen lijst" om je eigen woorden te gebruiken.';
      el.lijstuitleg.textContent = 'Je kijkt naar de standaardlijst. Die kun je niet wijzigen — neem hem over om er je eigen lijst van te maken.';
    }

    var actief = staat.lijst.gebruikEigenLijst && eigenAantal ? 'eigen lijst' : 'standaardlijst';
    var aantal = staat.lijst.gebruikEigenLijst && eigenAantal ? eigenAantal : standaardAantal;
    el.actiefchip.textContent = 'Het spel speelt: ' + actief + ' · ' + aantal + ' ' +
      (aantal === 1 ? 'woord' : 'woorden') + (staat.lijst.schud ? ' · geschud' : '');
  }

  function tekenAlles() {
    tekenBron();
    tekenLijst();
    tekenTellers();
    tekenLevels();
    tekenInvoer();
  }

  /* ------------------------------------------------------------------ */
  /* Toevoegformulier op smalle schermen                                 */
  /* ------------------------------------------------------------------ */

  /* Op het bureaublad doet dit niets: css/quizmaster.css zet .qm-invoerknop
     op display:none en laat het formulier altijd staan. Op de telefoon zit
     het formulier erachter, zodat het openingsscherm bij de lijst begint. */
  function zetInvoer(open) {
    if (!el.invoerknop || !el.lijstpaneel) return;
    el.lijstpaneel.classList.toggle('is-invoer-open', open);
    el.invoerknop.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function tekenInvoer() {
    zetInvoer(staat.invoerHand === null
      ? !staat.lijst.woorden.length   /* lege lijst: meteen kunnen typen */
      : staat.invoerHand);
  }

  function openInvoer() {
    staat.invoerHand = true;
    zetInvoer(true);
  }

  /* ------------------------------------------------------------------ */
  /* Bewerkingen                                                         */
  /* ------------------------------------------------------------------ */

  function voegToe(woord, uitleg) {
    staat.lijst.woorden.push({ woord: woord, uitleg: schoneUitleg(uitleg) });
    staat.nieuweIndex = staat.lijst.woorden.length - 1;
    bewaar();
    tekenAlles();
  }

  function verplaats(vanIndex, naarIndex) {
    var woorden = staat.lijst.woorden;
    if (naarIndex < 0 || naarIndex >= woorden.length || vanIndex === naarIndex) return false;
    var item = woorden.splice(vanIndex, 1)[0];
    woorden.splice(naarIndex, 0, item);
    staat.bewerkIndex = -1;
    bewaar();
    return true;
  }

  function verwijder(index) {
    var woorden = staat.lijst.woorden;
    if (index < 0 || index >= woorden.length) return;
    var weg = woorden.splice(index, 1)[0];
    staat.laatstVerwijderd = { item: weg, index: index };
    staat.bewerkIndex = -1;
    bewaar();
    tekenAlles();
    meld(weg.woord + ' is verwijderd.', 'info', {
      tekst: 'Ongedaan maken',
      doe: function () {
        var herstel = staat.laatstVerwijderd;
        if (!herstel) return;
        staat.lijst.woorden.splice(Math.min(herstel.index, staat.lijst.woorden.length), 0, herstel.item);
        staat.nieuweIndex = Math.min(herstel.index, staat.lijst.woorden.length - 1);
        staat.laatstVerwijderd = null;
        bewaar();
        tekenAlles();
        wisMelding();
      }
    });
  }

  function openTest(woord, uitleg) {
    /* js/game.js leest ?woord= en optioneel &uitleg=; js/opslag.js kent
       daarnaast ?test=. Beide meegeven, dan werkt het hoe dan ook. */
    var adres = 'index.html?woord=' + encodeURIComponent(woord) +
      '&test=' + encodeURIComponent(woord) +
      (uitleg ? '&uitleg=' + encodeURIComponent(uitleg) : '');
    var venster = window.open(adres, 'dvl-spel');
    if (venster && typeof venster.focus === 'function') venster.focus();
    meld('Het spel is geopend met ' + woord + '.', 'goed');
  }

  /* ------------------------------------------------------------------ */
  /* Toevoegformulier                                                    */
  /* ------------------------------------------------------------------ */

  function toonInvoerstand() {
    var ruw = el.invoerWoord.value;
    var woord = normaliseerWoord(ruw);
    if (ruw !== woord) {
      /* Hoofdletters afdwingen zonder dat de cursor terugspringt. */
      var pos = (el.invoerWoord.selectionStart || 0) - (ruw.length - woord.length);
      el.invoerWoord.value = woord;
      try { el.invoerWoord.setSelectionRange(pos, pos); } catch (fout) { /* niets */ }
    }

    el.voorbeeld.innerHTML = woord.length >= MIN_LENGTE ? miniHtml(woord) : '';

    if (!woord) {
      el.invoerhint.className = 'qm-hint';
      el.invoerhint.textContent = 'Alleen letters, 3 tot 9 tekens. Hoofdletters gaan vanzelf; spaties en streepjes vervallen.';
      el.invoerWoord.removeAttribute('aria-invalid');
      el.knopToevoegen.classList.remove('qm-knop--onaf');
      return;
    }

    var oordeel = keurWoord(woord, staat.lijst.woorden, -1);
    el.invoerhint.className = 'qm-hint ' + (oordeel.ok ? 'is-goed' : 'is-fout');
    el.invoerhint.textContent = oordeel.reden;
    el.invoerWoord.setAttribute('aria-invalid', oordeel.ok ? 'false' : 'true');
    /* De knop blijft bruikbaar: wie toch drukt, krijgt de reden als melding. */
    el.knopToevoegen.classList.toggle('qm-knop--onaf', !oordeel.ok);
  }

  function verwerkToevoegen(gebeurtenis) {
    gebeurtenis.preventDefault();
    var oordeel = keurWoord(el.invoerWoord.value, staat.lijst.woorden, -1);
    if (!oordeel.ok) {
      meld(oordeel.reden, 'fout');
      el.invoerWoord.focus();
      toonInvoerstand();
      return;
    }
    /* Wie vanuit de standaardlijst iets toevoegt, bedoelt zijn eigen lijst. */
    var omgeschakeld = !bewerkbaar();
    staat.lijst.gebruikEigenLijst = true;
    /* Wie net iets toevoegde, typt zo het volgende woord: het formulier moet
       dus openblijven, ook als de lijst hiermee van leeg naar gevuld gaat. */
    staat.invoerHand = true;
    voegToe(oordeel.woord, el.invoerUitleg.value);
    meld(oordeel.woord + ' toegevoegd.' +
      (omgeschakeld ? ' Het spel speelt vanaf nu je eigen lijst.' : ''), 'goed');
    el.invoerWoord.value = '';
    el.invoerUitleg.value = '';
    toonInvoerstand();
    el.invoerWoord.focus();
  }

  /* ------------------------------------------------------------------ */
  /* Rijknoppen                                                          */
  /* ------------------------------------------------------------------ */

  /* Eén rij open- of dichtklappen op een smal scherm. De DOM is hier de baas
     en niet staat.openIndex: dan kan er nooit een rij openstaan die volgens
     de staat dicht is. */
  function zetRijOpen(rij, open) {
    rij.classList.toggle('qm-rij--open', open);
    var knop = rij.querySelector('.qm-rijknop--klap');
    if (!knop) return;
    var woord = rij.querySelector('.qm-woordtekst');
    var naam = woord ? woord.textContent : 'dit woord';
    knop.setAttribute('aria-expanded', open ? 'true' : 'false');
    knop.setAttribute('aria-label', 'Gereedschap voor ' + naam + (open ? ' verbergen' : ' tonen'));
  }

  function klapRij(rij, index) {
    var open = !rij.classList.contains('qm-rij--open');
    var oud = el.woorden.querySelector('.qm-rij--open');
    if (oud && oud !== rij) zetRijOpen(oud, false);
    zetRijOpen(rij, open);
    staat.openIndex = open ? index : -1;
  }

  function verwerkLijstklik(gebeurtenis) {
    var knop = gebeurtenis.target.closest('[data-rij-actie]');
    if (!knop) {
      /* Op de telefoon is de hele rij een klapvlak: tikken op het woord of de
         uitleg opent hem net zo goed als de chevron ernaast. */
      var raakrij = compacteRij() && gebeurtenis.target.closest('.qm-inhoud');
      if (raakrij) {
        var doelrij = raakrij.closest('.qm-rij');
        if (doelrij && !doelrij.classList.contains('qm-rij--bewerkt')) {
          klapRij(doelrij, Number(doelrij.dataset.index));
        }
      }
      return;
    }
    var rij = knop.closest('.qm-rij');
    if (!rij) return;
    var index = Number(rij.dataset.index);
    var actie = knop.dataset.rijActie;
    var woorden = zichtbareWoorden();

    if (actie === 'uitklap') {
      klapRij(rij, index);
      return;
    }
    if (actie === 'test') {
      openTest(woorden[index].woord, woorden[index].uitleg);
      return;
    }
    if (!bewerkbaar()) return;

    /* Op de telefoon staan de pijlen ín de opengeklapte rij. Die rij moet dus
       mee-verhuizen en open blijven, anders verdwijnt de knop waar je net op
       drukte onder je vinger vandaan. */
    var stondOpen = staat.openIndex === index;

    if (actie === 'omhoog' && verplaats(index, index - 1)) {
      if (stondOpen) staat.openIndex = index - 1;
      tekenAlles();
      richtOpRij(index - 1, '[data-rij-actie="omhoog"]');
    } else if (actie === 'omlaag' && verplaats(index, index + 1)) {
      if (stondOpen) staat.openIndex = index + 1;
      tekenAlles();
      richtOpRij(index + 1, '[data-rij-actie="omlaag"]');
    } else if (actie === 'wijzig') {
      staat.bewerkIndex = index;
      tekenLijst();
    } else if (actie === 'verwijder') {
      verwijder(index);
    } else if (actie === 'annuleren') {
      staat.bewerkIndex = -1;
      tekenLijst();
    } else if (actie === 'bewaren') {
      bewaarBewerking(rij, index);
    }
  }

  function bewaarBewerking(rij, index) {
    var woordVeld = rij.querySelector('input[name="woord"]');
    var uitlegVeld = rij.querySelector('input[name="uitleg"]');
    var hint = rij.querySelector('[data-rol="bewerkhint"]');
    var oordeel = keurWoord(woordVeld.value, staat.lijst.woorden, index);
    if (!oordeel.ok) {
      hint.className = 'qm-hint is-fout';
      hint.textContent = oordeel.reden;
      woordVeld.setAttribute('aria-invalid', 'true');
      woordVeld.focus();
      return;
    }
    staat.lijst.woorden[index] = { woord: oordeel.woord, uitleg: schoneUitleg(uitlegVeld.value) };
    staat.bewerkIndex = -1;
    bewaar();
    tekenAlles();
    meld(oordeel.woord + ' is bijgewerkt.', 'goed');
    richtOpRij(index, '[data-rij-actie="wijzig"]');
  }

  function richtOpRij(index, kiezer) {
    var rij = el.woorden.querySelector('.qm-rij[data-index="' + index + '"]');
    if (!rij) return;
    var doel = rij.querySelector(kiezer);
    if (doel && !doel.disabled) doel.focus();
    else rij.scrollIntoView({ block: 'nearest' });
  }

  /* Toetsenbord binnen het bewerkveld: Enter bewaart, Escape annuleert. */
  function verwerkLijstToets(gebeurtenis) {
    var doel = gebeurtenis.target;
    if (doel.matches && doel.matches('.qm-rij-bewerk input')) {
      if (gebeurtenis.key === 'Enter') {
        gebeurtenis.preventDefault();
        var rij = doel.closest('.qm-rij');
        bewaarBewerking(rij, Number(rij.dataset.index));
      } else if (gebeurtenis.key === 'Escape') {
        gebeurtenis.preventDefault();
        staat.bewerkIndex = -1;
        tekenLijst();
      }
      return;
    }
    /* Verplaatsen met het toetsenbord vanaf de greep. */
    if (doel.matches && doel.matches('.qm-greep')) {
      var richting = gebeurtenis.key === 'ArrowUp' ? -1 : (gebeurtenis.key === 'ArrowDown' ? 1 : 0);
      if (!richting) return;
      gebeurtenis.preventDefault();
      var rijEl = doel.closest('.qm-rij');
      var van = Number(rijEl.dataset.index);
      if (verplaats(van, van + richting)) {
        tekenAlles();
        richtOpRij(van + richting, '.qm-greep');
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* Slepen met de aanwijzer (werkt met muis én vinger)                   */
  /* ------------------------------------------------------------------ */

  var sleep = null;

  function startSleep(gebeurtenis) {
    if (!bewerkbaar() || staat.zoek) return;
    var greep = gebeurtenis.target.closest('.qm-greep');
    if (!greep || greep.tagName !== 'BUTTON') return;
    if (gebeurtenis.button !== undefined && gebeurtenis.button !== 0) return;

    var rij = greep.closest('.qm-rij');
    if (!rij) return;

    gebeurtenis.preventDefault();
    staat.bewerkIndex = -1;

    sleep = {
      rij: rij,
      vanIndex: Number(rij.dataset.index),
      aanwijzer: gebeurtenis.pointerId
    };
    rij.classList.add('qm-rij--sleept');
    document.body.style.userSelect = 'none';
    try { greep.setPointerCapture(gebeurtenis.pointerId); } catch (fout) { /* niets */ }

    greep.addEventListener('pointermove', beweegSleep);
    greep.addEventListener('pointerup', stopSleep);
    greep.addEventListener('pointercancel', stopSleep);
  }

  function beweegSleep(gebeurtenis) {
    if (!sleep) return;
    var lijstEl = el.woorden;
    var andere = Array.prototype.slice.call(lijstEl.querySelectorAll('.qm-rij:not(.qm-rij--sleept)'));
    var y = gebeurtenis.clientY;
    var na = null;
    for (var i = 0; i < andere.length; i++) {
      var vak = andere[i].getBoundingClientRect();
      if (y < vak.top + vak.height / 2) { na = andere[i]; break; }
    }
    if (na) {
      if (na.previousElementSibling !== sleep.rij) lijstEl.insertBefore(sleep.rij, na);
    } else if (lijstEl.lastElementChild !== sleep.rij) {
      lijstEl.appendChild(sleep.rij);
    }
  }

  function stopSleep(gebeurtenis) {
    if (!sleep) return;
    var greep = gebeurtenis.currentTarget;
    greep.removeEventListener('pointermove', beweegSleep);
    greep.removeEventListener('pointerup', stopSleep);
    greep.removeEventListener('pointercancel', stopSleep);
    try { greep.releasePointerCapture(sleep.aanwijzer); } catch (fout) { /* niets */ }

    sleep.rij.classList.remove('qm-rij--sleept');
    document.body.style.userSelect = '';

    var naarIndex = Array.prototype.indexOf.call(el.woorden.children, sleep.rij);
    var vanIndex = sleep.vanIndex;
    var woord = staat.lijst.woorden[vanIndex];
    sleep = null;

    if (naarIndex === vanIndex || naarIndex < 0) {
      tekenLijst();
      return;
    }
    verplaats(vanIndex, naarIndex);
    tekenAlles();
    richtOpRij(naarIndex, '.qm-greep');
    if (woord) meld(woord.woord + ' staat nu op plek ' + (naarIndex + 1) + '.', 'info');
  }

  /* ------------------------------------------------------------------ */
  /* Bulk plakken                                                        */
  /* ------------------------------------------------------------------ */

  /* Knipt één geplakte regel in [woord, uitleg].
     Een streepje telt alleen als scheiding met spaties eromheen, zodat
     "back-up" niet stiekem "BACK" wordt maar netjes als fout wordt gemeld. */
  function splitsRegel(regel) {
    var tekst = String(regel).trim();
    var opPunt = /^([^\s][\s\S]*?)(?:\s+[-–—]\s+|\s*[:;|\t]\s*|,\s+)([\s\S]*)$/.exec(tekst);
    if (opPunt) return [opPunt[1].trim(), opPunt[2].trim()];
    var opSpatie = /^(\S+)\s+([\s\S]+)$/.exec(tekst);
    if (opSpatie && /^[A-Z]{3,9}$/.test(normaliseerWoord(opSpatie[1]))) {
      return [opSpatie[1], opSpatie[2].trim()];
    }
    return [tekst, ''];
  }

  /* Leest tekst of JSON en geeft { rijen, fouten } terug. */
  function ontleedPlaksel(tekst) {
    var rijen = [];
    var fouten = [];
    var ruw = String(tekst || '').trim();
    if (!ruw) return { rijen: rijen, fouten: fouten };

    var uitJson = null;
    if (ruw.charAt(0) === '[' || ruw.charAt(0) === '{') {
      try {
        var ontleed = JSON.parse(ruw);
        uitJson = Array.isArray(ontleed) ? ontleed : ontleed.woorden;
      } catch (fout) { uitJson = null; }
    }

    if (Array.isArray(uitJson)) {
      uitJson.forEach(function (item, i) {
        var woord = typeof item === 'string' ? item : (item && item.woord);
        var uitleg = typeof item === 'string' ? '' : (item && item.uitleg);
        verwerkRegel(String(woord || ''), uitleg, 'regel ' + (i + 1));
      });
      return { rijen: rijen, fouten: fouten };
    }

    ruw.split(/\r?\n/).forEach(function (regel, i) {
      if (!regel.trim()) return;
      var deel = splitsRegel(regel);
      verwerkRegel(deel[0], deel[1], 'regel ' + (i + 1));
    });

    return { rijen: rijen, fouten: fouten };

    function verwerkRegel(woordRuw, uitlegRuw, plek) {
      var oordeel = keurWoord(woordRuw, rijen, -1);
      if (!oordeel.ok) {
        fouten.push(plek + ': ' + (oordeel.woord || String(woordRuw).trim() || '(leeg)') + ' — ' + oordeel.reden.replace(/^.*?staat al/, 'staat al'));
        return;
      }
      rijen.push({ woord: oordeel.woord, uitleg: schoneUitleg(uitlegRuw) });
    }
  }

  function toonPlakverslag() {
    var uitslag = ontleedPlaksel(el.plaktekst.value);
    var html = '';
    if (!uitslag.rijen.length && !uitslag.fouten.length) {
      html = 'Plak hierboven je lijst. Je ziet hier meteen wat er binnenkomt.';
    } else {
      html = '<strong>' + uitslag.rijen.length + '</strong> bruikbaar' +
        (uitslag.fouten.length ? ', <strong>' + uitslag.fouten.length + '</strong> overgeslagen' : '') + '.';
      if (uitslag.fouten.length) {
        html += '<ul>' + uitslag.fouten.slice(0, 8).map(function (regel) {
          return '<li class="is-fout">' + veiligeTekst(regel) + '</li>';
        }).join('') + '</ul>';
        if (uitslag.fouten.length > 8) html += '<p style="margin:.3rem 0 0">…en nog ' + (uitslag.fouten.length - 8) + '.</p>';
      }
    }
    el.plakverslag.innerHTML = html;
    return uitslag;
  }

  function pasPlakselToe(vervangen) {
    var uitslag = ontleedPlaksel(el.plaktekst.value);
    if (!uitslag.rijen.length) {
      meld('Er stond niets bruikbaars in de geplakte tekst.', 'fout');
      return;
    }
    staat.lijst.gebruikEigenLijst = true;
    var toegevoegd = 0;
    var overgeslagen = uitslag.fouten.length;
    if (vervangen) {
      staat.lijst.woorden = uitslag.rijen;
      toegevoegd = uitslag.rijen.length;
    } else {
      var bestaand = {};
      staat.lijst.woorden.forEach(function (item) { bestaand[item.woord] = true; });
      uitslag.rijen.forEach(function (item) {
        if (bestaand[item.woord]) { overgeslagen++; return; }
        bestaand[item.woord] = true;
        staat.lijst.woorden.push(item);
        toegevoegd++;
      });
    }
    staat.bewerkIndex = -1;
    bewaar();
    tekenAlles();
    sluitVenster(el.vensterPlakken);
    el.plaktekst.value = '';
    el.plakverslag.innerHTML = '';
    meld((vervangen
      ? 'Lijst vervangen: ' + toegevoegd + ' ' + (toegevoegd === 1 ? 'woord' : 'woorden') + '.'
      : toegevoegd + ' ' + (toegevoegd === 1 ? 'woord' : 'woorden') + ' toegevoegd.') +
      (overgeslagen ? ' ' + overgeslagen + ' overgeslagen.' : ''), 'goed');
  }

  /* ------------------------------------------------------------------ */
  /* Exporteren                                                          */
  /* ------------------------------------------------------------------ */

  function exportTekst() {
    var soort = ($('input[name="qm-exportsoort"]:checked') || {}).value || 'tekst';
    var woorden = zichtbareWoorden();
    if (soort === 'json') {
      return JSON.stringify({
        gebruikEigenLijst: staat.lijst.gebruikEigenLijst,
        schud: staat.lijst.schud,
        woorden: woorden.map(function (item) { return { woord: item.woord, uitleg: item.uitleg || '' }; })
      }, null, 2);
    }
    return woorden.map(function (item) {
      return item.uitleg ? item.woord + ' - ' + item.uitleg : item.woord;
    }).join('\n');
  }

  function vernieuwExport() {
    el.exporttekst.value = exportTekst();
  }

  function kopieerExport() {
    var tekst = el.exporttekst.value;
    el.exporttekst.focus();
    el.exporttekst.select();
    var gelukt = false;
    try { gelukt = document.execCommand('copy'); } catch (fout) { gelukt = false; }
    if (!gelukt && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(tekst).then(function () {
        meld('Lijst gekopieerd naar het klembord.', 'goed');
      }, function () {
        meld('Kopiëren lukte niet — selecteer de tekst en kopieer zelf.', 'fout');
      });
      return;
    }
    meld(gelukt ? 'Lijst gekopieerd naar het klembord.' : 'Kopiëren lukte niet — selecteer de tekst en kopieer zelf.',
      gelukt ? 'goed' : 'fout');
  }

  function bewaarExportBestand() {
    var soort = ($('input[name="qm-exportsoort"]:checked') || {}).value || 'tekst';
    var naam = 'lingo-woordenlijst.' + (soort === 'json' ? 'json' : 'txt');
    try {
      var blob = new Blob([el.exporttekst.value], { type: 'text/plain;charset=utf-8' });
      var adres = URL.createObjectURL(blob);
      var koppeling = document.createElement('a');
      koppeling.href = adres;
      koppeling.download = naam;
      document.body.appendChild(koppeling);
      koppeling.click();
      document.body.removeChild(koppeling);
      window.setTimeout(function () { URL.revokeObjectURL(adres); }, 1000);
      meld('Bestand ' + naam + ' opgeslagen.', 'goed');
    } catch (fout) {
      meld('Opslaan lukte niet in deze browser — kopieer de tekst handmatig.', 'fout');
    }
  }

  /* ------------------------------------------------------------------ */
  /* Vensters                                                            */
  /* ------------------------------------------------------------------ */

  function openVenster(venster) {
    if (typeof venster.showModal === 'function') venster.showModal();
    else venster.setAttribute('open', '');
  }

  function sluitVenster(venster) {
    if (typeof venster.close === 'function' && venster.open) venster.close();
    else venster.removeAttribute('open');
  }

  /* ------------------------------------------------------------------ */
  /* Gereedschapsmenu in de vaste balk                                   */
  /* ------------------------------------------------------------------ */

  function zetMenu(open) {
    if (!el.menu || !el.menuKnop) return;
    el.menu.hidden = !open;
    el.menuKnop.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function menuOpen() {
    return !!(el.menu && !el.menu.hidden);
  }

  /* ------------------------------------------------------------------ */
  /* Spelkaart: de zijkolom op smalle schermen open- en dichtklappen       */
  /* ------------------------------------------------------------------ */

  /* Op het bureaublad doet deze knop niets: css/quizmaster.css zet hem op
     display:none en laat .qm-zij-inhoud altijd staan. Op smalle schermen
     staat de kolom bovenaan, standaard dicht, met de levelcijfers al in
     beeld. */
  function zetZijkolom(open) {
    if (!el.zijkolom || !el.zijknop) return;
    el.zijkolom.classList.toggle('is-open', open);
    el.zijknop.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function regelZijkolom() {
    if (!el.zijknop) return;
    el.zijknop.addEventListener('click', function () {
      var open = !el.zijkolom.classList.contains('is-open');
      zetZijkolom(open);
      if (open) el.zijkolom.scrollIntoView({ block: 'nearest' });
    });
    zetZijkolom(false);
  }

  /* ------------------------------------------------------------------ */
  /* Hoogte van de vaste balk doorgeven aan de opmaak                     */
  /* ------------------------------------------------------------------ */

  function meetBalk() {
    if (!el.balk) return;
    document.documentElement.style.setProperty('--qm-balk-hoogte', el.balk.offsetHeight + 'px');
  }

  function volgBalk() {
    if (!el.balk) return;
    meetBalk();
    if (window.ResizeObserver) {
      new window.ResizeObserver(meetBalk).observe(el.balk);
    }
    window.addEventListener('resize', meetBalk);
    window.addEventListener('orientationchange', meetBalk);

    /* Randje en schaduw pas zodra de balk echt vastgeplakt zit. Met de positie
       van de balk zelf, niet met een IntersectionObserver: die vuurt niet in
       elke omgeving, en dit is één meting per scrollgebeurtenis. */
    window.addEventListener('scroll', keurBalk, { passive: true });
    keurBalk();
  }

  function keurBalk() {
    if (!el.balk) return;
    el.balk.classList.toggle('is-vast', el.balk.getBoundingClientRect().top <= 0.5);
  }

  /* ------------------------------------------------------------------ */
  /* Gereedschapsknoppen                                                 */
  /* ------------------------------------------------------------------ */

  function verwerkActie(naam) {
    zetMenu(false);
    if (naam === 'naar-invoer') {
      /* Vanaf rij 143 in één stap terug naar het invoerveld; op de telefoon
         moet het formulier daarvoor eerst opengeklapt worden. */
      openInvoer();
      el.invoerWoord.focus({ preventScroll: true });
      el.invoerWoord.scrollIntoView({ block: 'center' });
    } else if (naam === 'zoek-wissen') {
      zetZoek('');
      if (el.zoek) el.zoek.focus();
    } else if (naam === 'plakken-openen') {
      el.plakverslag.innerHTML = '';
      openVenster(el.vensterPlakken);
      el.plaktekst.focus();
    } else if (naam === 'export-openen') {
      vernieuwExport();
      openVenster(el.vensterExport);
    } else if (naam === 'plakken-toevoegen') {
      pasPlakselToe(false);
    } else if (naam === 'plakken-vervangen') {
      pasPlakselToe(true);
    } else if (naam === 'export-kopieren') {
      kopieerExport();
    } else if (naam === 'export-bewaren') {
      bewaarExportBestand();
    } else if (naam === 'standaard-overnemen') {
      neemStandaardOver();
    } else if (naam === 'dubbelen-opruimen') {
      ruimDubbelenOp();
    } else if (naam === 'alles-wissen') {
      wisAlles();
    }
  }

  function neemStandaardOver() {
    var bestaand = {};
    staat.lijst.woorden.forEach(function (item) { bestaand[item.woord] = true; });
    var toegevoegd = 0;
    (DVL.STANDAARDWOORDEN || []).forEach(function (item) {
      var oordeel = keurWoord(item.woord, null, -1);
      if (!oordeel.ok || bestaand[oordeel.woord]) return;
      bestaand[oordeel.woord] = true;
      staat.lijst.woorden.push({ woord: oordeel.woord, uitleg: schoneUitleg(item.uitleg) });
      toegevoegd++;
    });
    staat.lijst.gebruikEigenLijst = true;
    bewaar();
    tekenAlles();
    meld(toegevoegd
      ? toegevoegd + ' ' + (toegevoegd === 1 ? 'woord' : 'woorden') + ' uit de standaardlijst overgenomen.'
      : 'Alle woorden uit de standaardlijst stonden er al in.', toegevoegd ? 'goed' : 'info');
  }

  function ruimDubbelenOp() {
    var gezien = {};
    var voor = staat.lijst.woorden.length;
    staat.lijst.woorden = staat.lijst.woorden.filter(function (item) {
      if (gezien[item.woord]) return false;
      gezien[item.woord] = true;
      return true;
    });
    var weg = voor - staat.lijst.woorden.length;
    staat.bewerkIndex = -1;
    bewaar();
    tekenAlles();
    meld(weg ? weg + ' dubbel(e) woord(en) verwijderd.' : 'Er stonden geen dubbelen in de lijst.', weg ? 'goed' : 'info');
  }

  function wisAlles() {
    if (!staat.lijst.woorden.length) {
      meld('De lijst is al leeg.', 'info');
      return;
    }
    if (!window.confirm('Weet je het zeker? Alle ' + staat.lijst.woorden.length + ' woorden uit je eigen lijst worden gewist.')) return;
    var kopie = staat.lijst.woorden.slice();
    staat.lijst.woorden = [];
    staat.bewerkIndex = -1;
    bewaar();
    tekenAlles();
    meld('Lijst gewist.', 'info', {
      tekst: 'Ongedaan maken',
      doe: function () {
        staat.lijst.woorden = kopie;
        bewaar();
        tekenAlles();
        wisMelding();
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Starten                                                             */
  /* ------------------------------------------------------------------ */

  function start() {
    el.melding = $('#qm-melding');
    el.woorden = $('#qm-woorden');
    el.leeg = $('#qm-leeg');
    el.geenhit = $('#qm-geenhit');
    el.zoeknoot = $('#qm-zoeknoot');
    el.balk = $('#qm-balk');
    el.balkteller = $('#qm-balkteller');
    el.zoek = $('#qm-zoek');
    el.zoekwis = $('#qm-zoekwis');
    el.menu = $('#qm-gereedschapmenu');
    el.menuKnop = $('#qm-gereedschapknop');
    el.tellers = $('#qm-tellers');
    el.zijkolom = $('#qm-zijkolom');
    el.zijknop = $('#qm-zij-knop');
    el.zijchips = $('#qm-zij-chips');
    el.levels = $('#qm-levels');
    el.leveluitleg = $('#qm-leveluitleg');
    el.buiten = $('#qm-buiten');
    el.actiefchip = $('#qm-actiefchip');
    el.lijstuitleg = $('#qm-lijstuitleg');
    el.bronuitleg = $('#qm-bronuitleg');
    el.bronEigen = $('#qm-bron-eigen');
    el.bronStandaard = $('#qm-bron-standaard');
    el.schud = $('#qm-schud');
    el.lijstpaneel = $('.qm-paneel--lijst');
    el.invoerknop = $('#qm-invoerknop');
    el.invoerWoord = $('#qm-invoer-woord');
    el.invoerUitleg = $('#qm-invoer-uitleg');
    el.invoerhint = $('#qm-invoerhint');
    el.voorbeeld = $('#qm-voorbeeld');
    el.knopToevoegen = $('#qm-knop-toevoegen');
    el.knopDubbelen = $('#qm-knop-dubbelen');
    el.vensterPlakken = $('#qm-venster-plakken');
    el.vensterExport = $('#qm-venster-export');
    el.plaktekst = $('#qm-plaktekst');
    el.plakverslag = $('#qm-plakverslag');
    el.exporttekst = $('#qm-exporttekst');

    laadUitOpslag();

    /* Een verse installatie: laat meteen de eigen lijst zien zodat de lege
       staat uitlegt waar deze pagina voor is. */
    if (!staat.lijst.gebruikEigenLijst && !staat.lijst.woorden.length) {
      var ruw = null;
      try { ruw = window.localStorage.getItem(SLEUTEL); } catch (fout) { ruw = null; }
      if (!ruw) staat.lijst.gebruikEigenLijst = true;
    }

    tekenAlles();
    toonInvoerstand();

    if (el.invoerknop) {
      el.invoerknop.addEventListener('click', function () {
        var open = !el.lijstpaneel.classList.contains('is-invoer-open');
        staat.invoerHand = open;
        zetInvoer(open);
        if (open) el.invoerWoord.focus();
      });
    }

    $('#qm-toevoegformulier').addEventListener('submit', verwerkToevoegen);
    el.invoerWoord.addEventListener('input', toonInvoerstand);
    el.invoerWoord.addEventListener('paste', function () {
      window.setTimeout(toonInvoerstand, 0);
    });

    el.woorden.addEventListener('click', verwerkLijstklik);
    el.woorden.addEventListener('keydown', verwerkLijstToets);
    el.woorden.addEventListener('pointerdown', startSleep);

    el.bronEigen.addEventListener('change', function () {
      staat.lijst.gebruikEigenLijst = true;
      staat.bewerkIndex = -1;
      bewaar();
      tekenAlles();
      meld('Het spel speelt nu je eigen lijst.', 'goed');
    });
    el.bronStandaard.addEventListener('change', function () {
      staat.lijst.gebruikEigenLijst = false;
      staat.bewerkIndex = -1;
      bewaar();
      tekenAlles();
      meld('Het spel speelt nu de standaardlijst.', 'info');
    });
    el.schud.addEventListener('change', function () {
      staat.lijst.schud = el.schud.checked;
      bewaar();
      tekenBron();
      meld(staat.lijst.schud
        ? 'De woorden worden voortaan geschud.'
        : 'De woorden worden voortaan in jouw volgorde gespeeld.', 'info');
    });

    /* ---- zoekveld ---- */
    if (el.zoek) {
      el.zoek.addEventListener('input', function () { zetZoek(el.zoek.value); });
      el.zoek.addEventListener('search', function () { zetZoek(el.zoek.value); });
      el.zoek.addEventListener('keydown', function (gebeurtenis) {
        if (gebeurtenis.key === 'Escape' && el.zoek.value) {
          gebeurtenis.preventDefault();
          el.zoek.value = '';
          zetZoek('');
        }
      });
    }
    if (el.zoekwis) {
      el.zoekwis.addEventListener('click', function () {
        el.zoek.value = '';
        zetZoek('');
        el.zoek.focus();
      });
    }

    /* ---- gereedschapsmenu ---- */
    if (el.menuKnop) {
      el.menuKnop.addEventListener('click', function (gebeurtenis) {
        gebeurtenis.stopPropagation();
        zetMenu(!menuOpen());
      });
    }
    document.addEventListener('keydown', function (gebeurtenis) {
      if (gebeurtenis.key === 'Escape' && menuOpen()) {
        zetMenu(false);
        el.menuKnop.focus();
      }
    });

    document.addEventListener('click', function (gebeurtenis) {
      if (menuOpen() && !gebeurtenis.target.closest('.qm-menudoos')) zetMenu(false);
      var knop = gebeurtenis.target.closest('[data-actie]');
      if (!knop) return;
      gebeurtenis.preventDefault();
      verwerkActie(knop.dataset.actie);
    });

    volgBalk();
    regelZijkolom();

    el.plaktekst.addEventListener('input', toonPlakverslag);
    $$('input[name="qm-exportsoort"]').forEach(function (keuze) {
      keuze.addEventListener('change', vernieuwExport);
    });

    /* Wijzigingen uit een ander tabblad (bijvoorbeeld het spel) overnemen. */
    if (typeof DVL.Opslag.luister === 'function') {
      DVL.Opslag.luister(function () {
        if (sleep || staat.bewerkIndex > -1) return;
        laadUitOpslag();
        tekenAlles();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  DVL.Quizmaster = {
    tekenAlles: tekenAlles,
    keurWoord: keurWoord,
    normaliseerWoord: normaliseerWoord
  };
}());
