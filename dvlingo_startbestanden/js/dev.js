/* ==========================================================================
   Digitale Vaardigheden Lingo — js/dev.js

   TIJDELIJK HULPMIDDEL OM TE TESTEN.

   Zet een klein knopje "DEV" linksonder in beeld. Staat het aan, dan verschijnt
   er bovenaan een strook met het woord dat geraden moet worden, plus de ronde,
   het aantal pogingen en de uitleg. Zo hoef je niet te gokken om een scherm of
   een animatie te bekijken.

   Weghalen doe je met één regel: haal <script src="js/dev.js"> uit index.html
   en er blijft niets van over. Dit bestand raakt de spellogica niet aan; het
   leest alleen DVL.Game.staat() uit en zet zijn eigen opmaak neer.

   Let op: de strook staat vast over de pagina heen en zit dus niet in de
   indeling van het spel. Dat is met opzet — de schermen zijn met veel moeite
   passend gemaakt en een extra balk in de indeling zou dat breken.
   ========================================================================== */

(function (window, document) {
  'use strict';

  var DVL = window.DVL = window.DVL || {};
  var SLEUTEL = 'dvl.dev';

  var OPMAAK =
    '.dev-knop{position:fixed;left:10px;bottom:10px;z-index:9500;' +
      'font:800 11px/1 "Segoe UI",system-ui,sans-serif;letter-spacing:.14em;' +
      'padding:7px 12px 8px;border:0;border-radius:999px;cursor:pointer;' +
      'background:rgba(34,64,111,.32);color:#fff;opacity:.45;' +
      'transition:opacity 140ms ease,background 140ms ease}' +
    '.dev-knop:hover{opacity:1}' +
    '.dev-knop[aria-pressed="true"]{background:#e8382f;opacity:1;' +
      'box-shadow:0 3px 0 #9d1a13}' +

    '.dev-strook{position:fixed;left:0;right:0;top:0;z-index:9400;' +
      'display:none;align-items:center;justify-content:center;gap:22px;' +
      'padding:7px 14px;' +
      'background:linear-gradient(180deg,#22406f,#16304f);color:#fff;' +
      'font:700 13px/1.2 "Segoe UI",system-ui,sans-serif;' +
      'box-shadow:0 3px 12px rgba(10,26,52,.4)}' +
    'html.dev-aan .dev-strook{display:flex}' +
    /* De strook ligt over de bovenrand; het speelveld schuift een tikje omlaag
       zodat de terugknop en de tijdlijn er niet onder verdwijnen. */
    'html.dev-aan body{padding-top:34px}' +

    '.dev-woord{font:900 19px/1 "Arial Black","Segoe UI Black",system-ui,sans-serif;' +
      'letter-spacing:.16em;color:#ffd23a}' +
    '.dev-label{opacity:.62;font-weight:700;letter-spacing:.06em;' +
      'text-transform:uppercase;font-size:11px}' +
    '.dev-uitleg{opacity:.8;font-weight:400;max-width:44ch;overflow:hidden;' +
      'text-overflow:ellipsis;white-space:nowrap}' +
    '@media (max-width:620px){.dev-strook{gap:10px;font-size:11px}' +
      '.dev-woord{font-size:15px}.dev-uitleg{display:none}}';

  function stijl() {
    var s = document.createElement('style');
    s.id = 'dev-opmaak';
    s.textContent = OPMAAK;
    document.head.appendChild(s);
  }

  function bewaard() {
    try { return window.localStorage.getItem(SLEUTEL) === '1'; } catch (e) { return false; }
  }

  function bewaar(aan) {
    try { window.localStorage.setItem(SLEUTEL, aan ? '1' : '0'); } catch (e) {}
  }

  function start() {
    stijl();

    var strook = document.createElement('div');
    strook.className = 'dev-strook';
    strook.setAttribute('aria-hidden', 'true');
    strook.innerHTML =
      '<span><span class="dev-label">woord</span> <span class="dev-woord">—</span></span>' +
      '<span><span class="dev-label">ronde</span> <span class="dev-ronde">—</span></span>' +
      '<span><span class="dev-label">poging</span> <span class="dev-poging">—</span></span>' +
      '<span class="dev-uitleg"></span>';
    document.body.appendChild(strook);

    var knop = document.createElement('button');
    knop.type = 'button';
    knop.className = 'dev-knop';
    knop.textContent = 'DEV';
    knop.title = 'Toon het te raden woord (alleen om te testen)';
    document.body.appendChild(knop);

    var woordEl = strook.querySelector('.dev-woord');
    var rondeEl = strook.querySelector('.dev-ronde');
    var pogingEl = strook.querySelector('.dev-poging');
    var uitlegEl = strook.querySelector('.dev-uitleg');

    function ververs() {
      if (!document.documentElement.classList.contains('dev-aan')) { return; }
      var kern = DVL.Game && typeof DVL.Game.staat === 'function'
        ? (DVL.Game.staat() || {}).kern : null;

      if (!kern || !kern.doel) {
        woordEl.textContent = '—';
        rondeEl.textContent = '—';
        pogingEl.textContent = '—';
        uitlegEl.textContent = 'nog geen woord: start een level';
        return;
      }

      woordEl.textContent = kern.doel;
      rondeEl.textContent = kern.ronde + (kern.totaal ? ' / ' + kern.totaal : '');
      pogingEl.textContent = (kern.rij + 1) + ' / ' + kern.maxPogingen;
      uitlegEl.textContent = kern.uitleg || '';
    }

    function zet(aan) {
      document.documentElement.classList.toggle('dev-aan', aan);
      knop.setAttribute('aria-pressed', aan ? 'true' : 'false');
      bewaar(aan);
      ververs();
      /* De schermen rekenen met de vensterhoogte; die verandert door de strook. */
      window.dispatchEvent(new Event('resize'));
    }

    knop.addEventListener('click', function () {
      zet(!document.documentElement.classList.contains('dev-aan'));
    });

    /* Ook aan te zetten met ?dev=1 in het adres, handig om een testronde te
       starten zonder eerst te klikken. */
    var viaAdres = /[?&]dev=1\b/.test(window.location.search);
    zet(viaAdres || bewaard());

    /* Tien keer per seconde bijwerken. Dat is grof, maar dit is een hulpmiddel
       en geen onderdeel van het spel; zo hoeft er nergens een haakje in de
       spellogica. */
    window.setInterval(ververs, 100);

    DVL.Dev = { aan: function () { zet(true); }, uit: function () { zet(false); } };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

})(window, document);
