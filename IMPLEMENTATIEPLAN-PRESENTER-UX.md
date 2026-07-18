# Implementatieplan Presenter UX — naar een award-winning digibordtool

Datum: 18 juli 2026 · Basis: `exports/presenter-uiux-adviesrapport.html` · Akkoord gebruiker: volledig plan uitvoeren, ZONDER cloudsessies/export (geen Firebase-opslag van borden, geen PDF/PNG-export, geen terugpubliceren naar CMS).

Werkwijze: per werkpakket bouwen → unit-tests voor nieuwe lib-logica → gerichte eslint → `npm run build` → browsercheck in Presenter → commit + push. Dit document is het contextanker; vink secties af bij oplevering.

## Buiten scope (expliciet)

- Cloudsessies (Firebase-opslag van Presenter-borden), hervatten op ander apparaat.
- Export naar PDF/PNG, terugpubliceren van borden naar CMS.

## Werkpakket A — Quick wins (bord laten kloppen)

- [x] **A1 Gum.** Nieuwe toolcategorie `eraser` met borstelgroottes S/M/L (diameter 12/28/56 boardunits). Wist hele pen-/markeerstiftstreken bij raakvlak (stroke-hittest tegen borstelcirkel langs de bewegingslijn); objecten blijven ongemoeid. Lib: `presenterEraser.js` (`findStrokeIdsHitByEraser`) + tests; gebruikt bestaand `removeStrokeFromPresenterPage`-patroon (batch: `removeStrokesFromPresenterPage` toevoegen aan `presenterModel.js`). Cursor: cirkel-outline op borstelgrootte. Undo werkt via bestaande per-pagina history.
- [x] **A2 Eén paginanavigator.** Verwijder de zwevende donkerpaarse navigator (`PresenterShell.jsx:1071-1093`) en de header-navigatie; de toolbar-navigator + pijltjestoetsen blijven. Paginalabel in header blijft als statisch label.
- [x] **A3 Rotatiehandvat.** `SelectionTransformBox` krijgt een rotatiehandvat (boven het selectiekader) voor objecten waar `canRotatePresenterObject` true is; rotatie om het middelpunt, snap op 15° bij Shift/altijd-lichte snap binnen 3°. Lib-helper `getRotationFromPointer` + tests in `presenterGeometry`.
- [x] **A4 Kleurkiezer.** Pen-/markeerstift-/tekstpopover krijgt naast swatches een custom kleur (native `<input type="color">`) en een rij "recent" (max 6, gedeeld per sessie, in recovery-state). Pen en markeerstift onthouden per sessie hun laatste kleur/dikte (bestaat deels; borgen).
- [x] **A5 Betrouwbare recovery.** `presenterStorage.js` van sessionStorage → localStorage (zelfde sleutel v2 + migratie van v1), autosave-indicator in de header ("Opgeslagen HH:MM"), bewerkbare sessienaam in de header (onderdeel van de sessie-state).
- [x] **A6 Toegankelijkheid.** `aria-label` + `title` (met sneltoets waar van toepassing) op alle toolbarknoppen, `aria-pressed` op toggles.
- [x] **A7 Importbevestiging.** `PresenterImportDialog`: na paragraafkeuze eerst een overzicht "Deze import maakt N pagina's" met per blok een checkbox (standaard alles aan), daarna pas importeren.

## Werkpakket B — Tekenervaring (bord laten voelen)

- [x] **B1 Inkt-pipeline.** (1) Live preview-stroke naar een canvas-laag met rAF-batching i.p.v. React-state per pointer-sample. (2) Stroke-smoothing: quadratic midpoint-curves bij render (`buildSmoothedStrokePath` in nieuw `presenterInk.js`, + tests), toegepast op zowel definitieve strokes (SVG) als preview (canvas). (3) Drukgevoeligheid: `pressure` per punt opslaan; breedte moduleert licht mee (clamp 0.65–1.35× basisbreedte), outline-render via variabele-breedte pad wanneer druk beschikbaar; fallback vaste breedte.
- [x] **B2 Pen/vinger-scheiding.** `pointerType === 'pen'` tekent altijd; touch tekent alleen als instelling "Tekenen met vinger" aan staat (default aan, toggle in pen-popover). Tweede touch-pointer tijdens tekenen → huidige stroke annuleren en overschakelen op two-finger pan (verticale scroll van het bord). Palm rejection: tijdens actieve pen-pointer worden touch-pointers genegeerd.
- [x] **B3 Meetkundepen.** Penvariant "Rechte lijn" in de pen-popover (`variant: 'geometry-pen'`): tekent rechte segmenten van startpunt naar huidige positie, gebruikt bestaande snap-to-grid (`presenterGeometry.js`) op ruitjesachtergrond; Shift = hoeksnap 0/45/90°.
- [x] **B4 Functionele liniaal & geodriehoek (v1) + gradenboog-waarde.** Instrumenten worden sleepbaar en roteerbaar (drag-vlak + rotatiehandvat, zelfde interactie als objecten). Edge-snap: een penstreek die binnen 24 units van de liniaal-/geodriehoek-tekenrand start, wordt geprojecteerd op die rand (rechte lijn langs het instrument). Gradenboog toont live de rotatiehoek als label. Lib: `presenterInstruments.js` (edge-projectie, hoekberekening) + tests. Passer blijft in dit pakket decoratief maar wél sleepbaar/roteerbaar.
- [x] **B5 Smart guides & objectbewerking.** Uitlijnhulplijnen (midden/randen t.o.v. andere objecten, tolerantie 6 units) tijdens slepen incl. lichte snap; Ctrl/Cmd+D dupliceert selectie (offset +24,+24); contextacties "Naar voren/Naar achteren" in de selectiebox. Lib-helpers + tests (`presenterAlignment.js`, z-order in `presenterModel.js`).
- [x] **B6 History-verlichting (pragmatisch).** Alleen de aangeraakte pagina klonen (is al zo) maar `structuredClone` van strokes vermijden waar mutaties append-only zijn; minimaal: geen sessie-brede kloon meer bij acties die één pagina raken. Geen volledige refactor; meetbaar doel is soepel tekenen bij 200+ strokes.

## Werkpakket C — Award-features (zonder cloud/export)

- [ ] **C1 Klassikale vraagregie.** Op geïmporteerde vraagkaarten: presentatieknoppen "Antwoord verbergen/onthullen" (verbergt feedback/controle tot onthuld) en een timerknop (1/2/5 min countdown groot in beeld). Nieuw boordgereedschap "Leerlingkiezer": overlay die een willekeurige leerling uit een gekozen klas toont (naam + foto via bestaande `StudentAvatar`/klasservice; werkt alleen met echte admin-login, nette melding zonder data).
- [ ] **C2 Focus-gereedschap.** Drie overlay-tools in een nieuwe toolbarcategorie "Focus": Spotlight (donkere overlay met sleepbaar cirkelgat, radius instelbaar), Schermgordijn (paneel dat vanaf boven/zijkant open schuift), Laserpointer (rode stip met vervagend spoor op canvas, geen permanente inkt). Alles client-side, per pagina uit te zetten.
- [ ] **C3 Meetinstrumenten volwaardig (v2).** Passer: straal instelbaar door de beenpunt te slepen; plaatst cirkel- of boogobject op bevestiging. Meetlabels: lijn- en pijlobjecten kunnen optioneel hun lengte in ruitjes-eenheden tonen (toggle in selectie); geodriehoek toont hoek t.o.v. horizontaal.
- [ ] **C4 Echte bordmodus.** In fullscreen verdwijnt de adminchrome volledig (bord edge-to-edge, `100dvh`); toolbar kan gedockt worden onder/links/rechts (voorkeur in sessie-state); linkshandig/rechtshandig spiegelt de knopvolgorde.
- [ ] **C5 Sfeer & identiteit.** Donkere bordmodus (donker bordvlak, lichte inktkleuren automatisch aangepast), extra achtergronden: millimeterpapier en assenstelsel; subtiele paginawissel-animatie (fade/slide 150ms) en zachte inkt-start (geen harde dot).

## Testaanpak

1. Unit: elke nieuwe lib (`presenterEraser`, `presenterInk`, `presenterInstruments`, `presenterAlignment`, geometry/model-uitbreidingen) krijgt `node --test`-dekking.
2. Statisch: `npx eslint <gewijzigde bestanden>` + `npm run build` per werkpakket.
3. Browser: na elk werkpakket handmatige flow in `/admin/presenter` (dev-adminlogin volstaat; import/leerlingkiezer vereisen echte login): tekenen/gummen/undo, navigator, rotatie, kleuren, recovery na reload, instrumenten, focus-tools, bordmodus.
4. Regressie: bestaande presenter-tests blijven groen: `node --test src/lib/presenterModel.test.js src/lib/presenterHistory.test.js src/lib/presenterGeometry.test.js src/lib/presenterObjects.test.js src/lib/presenterStorage.test.js`.

## Volgorde & commits

A1→A7 (commit per 2-3 items), dan B1→B6, dan C1→C5. Elke commit bevat werkende, geteste toestand; push naar `codex/digitale-vaardigheden-seed`. Kompas bijwerken na afronding van elk werkpakket.
