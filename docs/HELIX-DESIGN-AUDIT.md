# HELIX Design Audit

Datum: 21 mei 2026  
Scope: analyse van de huidige styling- en UI-opbouw van het bestaande HELIX leerplatform.  
Belangrijk: dit document beschrijft de huidige staat. Er zijn geen styling-, component-, route-, Firebase- of functionele wijzigingen gedaan.

## 1. Projectstructuur

### Frontend stack

- **Framework:** React 19 met Vite.
- **Routing:** `react-router-dom`.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`, aangevuld met gewone CSS in `src/index.css` en `src/App.css`.
- **Iconen:** `lucide-react`.
- **Editor:** Tiptap voor CMS-lesblokcontent.
- **PDF/slides:** `pdfjs-dist` voor PDF/slidedeck-presentatie.
- **Backend/data:** Firebase Auth, Firestore en Storage via services in `src/services`.

### Hoofdmapstructuur

| Pad | Rol |
|---|---|
| `src/App.jsx` | Hoofdrouting, routeguards en AppShell-wrapping. |
| `src/main.jsx` | React entrypoint en globale stylesheet-import. |
| `src/index.css` | Tailwind-import, `@theme`, globale utilities en basisstijlen. |
| `src/App.css` | Oude/losse gewone CSS, lijkt grotendeels legacy of Vite-templateachtig. |
| `src/pages/` | Pagina's/routes voor admin, leerling, CMS, slidedecks, games en profiel. |
| `src/components/` | Herbruikbare en domeinspecifieke componenten. |
| `src/components/layout/` | Algemene app-layout en studentinhoudsnavigatie. |
| `src/components/cms/` | CMS-shell, navigatieboom, lesblokstudio, crop/OCR en editors. |
| `src/components/dashboard/` | Voortgangs- en klasdashboard. |
| `src/components/digibord/` | Digibordpresentatie en PDF-slidedeck-presenter. |
| `src/components/auth/` | Login, auth provider, dev-login en klaskeuze. |
| `src/lib/` | Pure helpers, registries, assignment/progress/contentblock utilities. |
| `src/services/` | Firebase/Firestore/Storage service-laag. |

## 2. Huidige stylingtechniek

### Tailwind

Tailwind wordt duidelijk gebruikt. `src/index.css` bevat:

```css
@import "tailwindcss";
```

en Vite activeert Tailwind via `@tailwindcss/vite` in `vite.config.js`.

De meeste UI is opgebouwd met Tailwind utility-classes direct in JSX, bijvoorbeeld:

- `src/components/layout/AppShell.jsx`
- `src/pages/AdminDashboardPage.jsx`
- `src/pages/AdminLesstofPage.jsx`
- `src/components/cms/CmsShell.jsx`
- `src/components/cms/ContentBlockBuilder.jsx`
- `src/components/dashboard/ClassOverview.jsx`
- `src/pages/StudentLessonPage.jsx`
- `src/components/digibord/DigibordViewer.jsx`
- `src/pages/AdminSlidedecksPage.jsx`

### Gewone CSS

Er zijn twee globale CSS-bestanden:

| Bestand | Gebruik |
|---|---|
| `src/index.css` | Actief en belangrijk: Tailwind theme, globale componentutilities, scrollbar, input/button/card classes, heading utilities. |
| `src/App.css` | Bevat losse selectors zoals `.hero`, `.counter`, `.ticks`, `#center`, `#next-steps`. Lijkt grotendeels legacy of demo-CSS en is niet de primaire designbasis. |

### CSS Modules

Er zijn geen duidelijke CSS Modules aangetroffen. Styling is vooral Tailwind plus globale CSS.

### Inline styling

Inline styles worden vooral gebruikt voor dynamische waarden:

| Bestand | Inline style doel |
|---|---|
| `src/components/cms/NavigationTree.jsx` | Dynamische indentatie per boomniveau. |
| `src/components/cms/DualPanelEditor.jsx` | Dynamische breedtes voor editorpanelen. |
| `src/components/admin/CropSelectionOverlay.jsx` | Cursor, selectiegedrag en drag/resize feedback. |
| `src/components/admin/ImageCanvasEditor.jsx` | Canvas-achtige grid/positionering. |
| `src/pages/TakenToewijzenPage.jsx` | Dynamische kleuren uit `src/lib/paletColors.js`. |
| `src/pages/AdminDigibordPage.jsx` | Dynamische kleuren uit paletstijl. |
| `src/components/dashboard/ClassOverview.jsx` | Progressbarbreedtes en animatievertragingen. |
| `src/pages/StudentLessonPage.jsx` | Progressbarbreedte. |

Dit is logisch voor dynamische UI, maar bij een redesign moet onderscheid worden gemaakt tussen functioneel noodzakelijke inline styles en styling die beter naar tokens/components kan.

### Component library

Er is geen complete UI-component-library zoals shadcn/ui, MUI of Chakra. HELIX gebruikt eigen componenten en Tailwind utilities. Lucide wordt alleen voor iconen gebruikt.

### Design tokens / CSS variables

Er is een beginnende tokenlaag in `src/index.css`:

- `--color-primary-*`
- `--color-success-*`
- `--color-error-*`
- `--color-warning-*`
- `--font-sans`

Daarnaast is er een apart pastelpalet in `src/lib/paletColors.js`.

De tokens worden nog niet consequent als enige bron gebruikt. Veel kleuren staan verspreid als Tailwind utility classes in JSX, zoals `bg-blue-600`, `text-slate-900`, `border-slate-200`, `bg-amber-50`, `text-emerald-600`.

## 3. Huidige kleuren

### Centrale tokens in `src/index.css`

| Kleur | Gebruik | Bestand(en) | Opmerking |
|---|---|---|---|
| `#eff6ff` | Primary 50, lichte blauwe achtergronden | `src/index.css` | Centraal beheerd via Tailwind `@theme`. |
| `#dbeafe` | Primary 100, lichte blauwe vlakken | `src/index.css` | Centraal beheerd. |
| `#3b82f6` | Primary 500, accentblauw | `src/index.css` | Centraal beheerd, maar JSX gebruikt vaak ook directe Tailwind blauwklassen. |
| `#2563eb` | Primary 600, primaire knop | `src/index.css` | Centraal beheerd en gebruikt in `.btn-primary`. |
| `#f0fdf4` | Success 50 | `src/index.css` | Centraal beheerd. |
| `#22c55e` | Success 500 | `src/index.css` | Centraal beheerd. |
| `#16a34a` | Success 600 | `src/index.css` | Centraal beheerd. |
| `#fef2f2` | Error 50 | `src/index.css` | Centraal beheerd. |
| `#ef4444` | Error 500 | `src/index.css` | Centraal beheerd. |
| `#dc2626` | Error 600 | `src/index.css` | Centraal beheerd. |
| `#fffbeb` | Warning 50 | `src/index.css` | Centraal beheerd. |
| `#f59e0b` | Warning 500 | `src/index.css` | Centraal beheerd. |
| `#d97706` | Warning 600 | `src/index.css` | Centraal beheerd. |

### Pastelpalet in `src/lib/paletColors.js`

Dit bestand wordt gebruikt voor hiërarchie-items zoals vak, leerjaar, niveau en hoofdstuk.

| Kleur | Gebruik | Bestand(en) | Opmerking |
|---|---|---|---|
| `#F3F4F6`, `#374151`, `#D1D5DB` | Grijs palet, default onderwerpstijl | `src/lib/paletColors.js`, o.a. `src/pages/TakenToewijzenPage.jsx`, `src/pages/AdminDigibordPage.jsx` | Centraal palet, maar los van Tailwind theme. |
| `#DBEAFE`, `#1E40AF`, `#BFDBFE` | Blauw palet | `src/lib/paletColors.js` | Centraal palet. |
| `#E0E7FF`, `#3730A3`, `#C7D2FE` | Indigo palet | `src/lib/paletColors.js` | Centraal palet. |
| `#EDE9FE`, `#5B21B6`, `#DDD6FE` | Purple palet | `src/lib/paletColors.js` | Centraal palet. |
| `#FCE7F3`, `#9D174D`, `#FBCFE8` | Pink palet | `src/lib/paletColors.js` | Centraal palet. |
| `#FEE2E2`, `#991B1B`, `#FCA5A5` | Red palet | `src/lib/paletColors.js` | Centraal palet. |
| `#FFEDD5`, `#9A3412`, `#FED7AA` | Orange palet | `src/lib/paletColors.js` | Centraal palet. |
| `#FEF3C7`, `#92400E`, `#FDE68A` | Amber palet | `src/lib/paletColors.js` | Centraal palet. |
| `#DCFCE7`, `#14532D`, `#BBF7D0` | Green palet | `src/lib/paletColors.js` | Centraal palet. |
| `#CCFBF1`, `#134E4A`, `#99F6E4` | Teal palet | `src/lib/paletColors.js` | Centraal palet. |
| `#CFFAFE`, `#164E63`, `#A5F3FC` | Cyan palet | `src/lib/paletColors.js` | Centraal palet. |
| `#F1F5F9`, `#334155`, `#CBD5E1` | Slate palet | `src/lib/paletColors.js` | Centraal palet. |

### Hardcoded / verspreide Tailwind-kleuren

| Kleurfamilie | Gebruik | Bestand(en) | Opmerking |
|---|---|---|---|
| `slate-*` | Basisachtergrond, tekst, borders, panels, dashboardkaarten | Bijna alle pagina's, o.a. `AppShell.jsx`, `AdminDashboardPage.jsx`, `ContentBlockBuilder.jsx`, `ClassOverview.jsx`, `StudentLessonPage.jsx` | Verspreid in JSX, niet als semantische tokenlaag. |
| `blue-*` | Primaire knoppen, actieve navigatie, focusringen, leerlingroute, CMS-acties | Bijna alle UI-bestanden | Dominante accentkleur. Hardcoded via Tailwind classes. |
| `emerald-*` / `green-*` | Success/status, leerlingen, voortgang klaar | `AdminDashboardPage.jsx`, `ClassOverview.jsx`, `ContentBlockBuilder.jsx` | Statuskleur, verspreid. |
| `amber-*` / `yellow-*` | Waarschuwingen, conceptstatus, aandacht nodig | `AdminDashboardPage.jsx`, `ClassOverview.jsx`, `ContentBlockBuilder.jsx` | Statuskleur, verspreid. |
| `red-*` / `rose-*` | Delete, error, archiveren, waarschuwing | CMS, dashboard, modals | Kritieke acties, verspreid. |
| `violet-*`, `indigo-*`, `sky-*` | Werkstroomkaarten en secundaire accenten | `AdminDashboardPage.jsx`, mogelijk games/slides | Decoratief/functioneel gemengd. |
| `#4285F4`, `#34A853`, `#FBBC05`, `#EA4335` | Google login kleuraccenten | `src/components/auth/LoginScreen.jsx` | Externe merk-kleuren, hardcoded. |
| `#0f172a`, `#1d4ed8`, `#cbd5e1`, `#f8fafc`, `#ffffff` | Gamecanvas / Pythagoras trainer | `src/components/games/PythagorasTrainerGame.jsx` | Hardcoded game-styling, deels canvas-gerelateerd. |
| `#047857`, `#10b981`, `#3b82f6` | Cropselectie-overlay | `src/components/admin/CropSelectionOverlay.jsx` | Functionele teken/selectie-kleuren. |
| `#e5e7eb` | Canvas/grid achtergrond | `src/components/admin/ImageCanvasEditor.jsx` | Functioneel canvas. |

## 4. Huidige typografie

### Fonts

In `src/index.css` staat:

```css
--font-sans: 'Inter', system-ui, sans-serif;
```

`index.html` laadt geen externe Inter-font via Google Fonts of een lokale fontfile. De app vraagt dus om Inter, maar valt waarschijnlijk terug op systeemfonts als Inter niet lokaal beschikbaar is.

### Veelgebruikte typografische patronen

- Headings gebruiken vaak `font-black`, `tracking-tight` en grote Tailwind sizes zoals `text-4xl`, `text-3xl`, `text-2xl`.
- Eyebrows gebruiken vaak `text-xs` of `text-sm`, `uppercase`, `tracking-widest` of `tracking-[0.18em]`.
- Bodytekst gebruikt vooral `text-sm`, `text-base`, `text-lg`, `leading-6`, `leading-7`, `leading-8`.
- Tabellen gebruiken `text-sm`, `text-xs`, uppercase headers en slate/gray tekstkleuren.
- Digibordslides gebruiken grotere typografie, zoals `text-4xl`, `text-5xl`, `prose-xl`.

### Centrale typografie

`src/index.css` bevat enkele utility classes:

- `.heading-xl`
- `.heading-lg`
- `.heading-md`
- `.slide-heading`
- `.slide-content`
- `.text-secondary`
- `.text-tertiary`

Deze utilities bestaan, maar veel pagina's gebruiken nog eigen Tailwind-combinaties. Typografie is dus gedeeltelijk gecentraliseerd, maar in de praktijk verspreid.

### Risico's

- `font-black` is zeer dominant. Dat geeft HELIX kracht, maar kan op formulieren, dashboards en dense CMS-schermen zwaar ogen.
- Er is geen expliciete font-loading. Voor consistente merkuitstraling moet het gekozen font later echt geladen worden.
- Typografische schaal is niet volledig als design token vastgelegd.

## 5. Huidige componenten

| Component / gebied | Bestand | Stylingaanpak | Herbruikbaar? | Risico bij restyling |
|---|---|---|---|---|
| AppShell / topbar | `src/components/layout/AppShell.jsx` | Tailwind inline classes, lucide icons, route-active states | Hoog herbruikbaar | Hoog: raakt alle routes en navigatie. |
| Student inhoudsoverzicht | `src/components/layout/TableOfContents.jsx` | Tailwind cards/tree/progress | Domeinspecifiek | Hoog: leerlingstart en toegewezen lesstof. |
| Login | `src/components/auth/LoginScreen.jsx` | Tailwind plus Google-kleuren | Domeinspecifiek | Midden: auth-ervaring, maar styling kan los. |
| Klaskeuze modal | `src/components/auth/ClassSelectionModal.jsx` | Tailwind/modal | Herbruikbaar binnen authflow | Midden: leerling onboarding. |
| Admin Hub / Beheer | `src/pages/AdminDashboardPage.jsx` | Lokale cardconfig, Tailwind grids | Pagina-specifiek | Midden: goed geschikt als eerste restyle na tokens. |
| Lesstof werkplek | `src/pages/AdminLesstofPage.jsx` | Action cards, Tailwind | Pagina-specifiek | Midden. |
| CMS Shell | `src/components/cms/CmsShell.jsx` | Tailwind layout, eigen sidebar, legacy detailpanelen | Zeer domeinspecifiek | Hoog: complex, veel gedrag en oude logica aanwezig. |
| CMS navigatieboom | `src/components/cms/NavigationTree.jsx` | Tailwind plus inline indentatie | Domeinspecifiek | Hoog: veel interactie en informatiehiërarchie. |
| Lesblokbuilder | `src/components/cms/ContentBlockBuilder.jsx` | Tailwind, Tiptap, statusbadges, block cards | Domeinspecifiek | Hoog: kern van contentproductie. |
| Crop/OCR panel | `src/components/cms/CropEditorPanel.jsx`, `src/components/admin/CropSelectionOverlay.jsx`, `src/components/admin/ImageCanvasEditor.jsx` | Tailwind plus functionele inline/canvas styles | Domeinspecifiek | Hoog: precisie en UX zijn belangrijk. |
| DualPanelEditor | `src/components/cms/DualPanelEditor.jsx` | Tailwind en dynamische paneelbreedtes | Domeinspecifiek | Hoog: editorworkflow. |
| Voortgang dashboard | `src/components/dashboard/ClassOverview.jsx` | Tailwind cards/tables/progress | Domeinspecifiek | Hoog: veel datastates en responsive risico. |
| Student lespagina | `src/pages/StudentLessonPage.jsx` | Tailwind lesson shell, stepper, content blocks | Domeinspecifiek | Hoog: belangrijkste leerlingflow. |
| Student profiel | `src/pages/StudentProfilePage.jsx` | Tailwind cards/progress | Pagina-specifiek | Midden. |
| Digibord viewer | `src/components/digibord/DigibordViewer.jsx` | Tailwind fullscreen presenter | Domeinspecifiek | Hoog: digibordpresentatie moet stabiel blijven. |
| PDF slidedeck presenter | `src/components/digibord/PdfSlideDeckPresenter.jsx` | Tailwind fullscreen dark presenter, PDF rendering | Domeinspecifiek | Hoog: recent gebouwd en functioneel gevoelig. |
| Slidedeckcreator | `src/pages/AdminSlidedecksPage.jsx` | Tailwind form, table, modals | Pagina-specifiek | Midden-hoog: Storage/PDF workflow. |
| Game module | `src/pages/AdminSpellenPage.jsx`, `src/components/games/GamePlayer.jsx`, `src/components/games/PythagorasTrainerGame.jsx` | Tailwind plus game-specifieke kleuren | Domeinspecifiek | Midden: visueel losser, maar resultaatcontract behouden. |
| Modals/common | `src/components/common/ImageModal.jsx`, lokale modalfuncties | Tailwind en soms inline fixed positioning | Gedeeltelijk | Midden: modalpatronen zijn niet centraal. |

Er is geen centrale `Button`, `Card`, `Input`, `Badge`, `Modal` componentlaag die overal verplicht gebruikt wordt. Er zijn wel globale utility classes zoals `.btn-primary`, `.input-standard` en `.card-base`, maar componenten gebruiken die niet overal consequent.

## 6. Huidige layout

### AppShell / algemene layout

`src/components/layout/AppShell.jsx` is de algemene wrapper:

- sticky topbar;
- HELIX logo/naam;
- adminwerkpleknavigatie;
- gebruikersblok rechts;
- logout;
- reset-CMS knop voor admins.

De shell gebruikt `min-h-screen bg-slate-50 flex flex-col font-sans`.

### Sidebar

Er is geen globale sidebar voor de hele app. De CMS heeft een eigen zijbalk via:

- `src/components/cms/CmsShell.jsx`
- `src/components/cms/NavigationTree.jsx`

Deze sidebar is inklapbaar en gebruikt `localStorage` voor de open/dicht-stand.

### Dashboard layout

Adminpagina's gebruiken meestal:

- `mx-auto max-w-7xl`
- `px-6 md:px-8`
- gridkaarten met `md:grid-cols-*` en `lg:grid-cols-*`
- witte kaarten met `border-slate-200`, `shadow-sm`, `rounded-lg` of `rounded-xl`.

Voorbeelden:

- `src/pages/AdminDashboardPage.jsx`
- `src/pages/AdminLesstofPage.jsx`
- `src/pages/AdminSlidedecksPage.jsx`
- `src/components/dashboard/ClassOverview.jsx`

### Lesdetail layout

`src/pages/StudentLessonPage.jsx` gebruikt:

- headerkaart met lesinformatie en voortgang;
- links een stappenlijst;
- rechts het actieve lesblok;
- footer met vorige/volgende.

Dit is een duidelijke basis, maar de studentflow kan nog sterker worden door meer leerdoel, status, opdrachtfeedback en rust in de inhoudsweergave.

### AI tutor chat/panel layout

Er zijn slide- en AI-gerelateerde componenten in `src/components/slides/`, waaronder `AITutorChat.jsx`. Deze lijken meer lesson/presentation-specifiek dan onderdeel van een centraal app-designsysteem.

### Digibord layout

`src/components/digibord/DigibordViewer.jsx` gebruikt een fullscreen light presenter. `PdfSlideDeckPresenter.jsx` gebruikt een donker presenterframe voor PDF-slides. Deze twee presentatiewijzen hebben een eigen visuele taal en moeten bij restyling bewust gelijkgetrokken of bewust verschillend gehouden worden.

### Kwetsbaar / inconsistent

- CMS gebruikt nog legacy-detailpanelen in `CmsShell.jsx` met oude emoji-encoding en oude Engelse teksten, ook al staan sommige flows uit.
- Veel pagina's hebben eigen kaart-, knop- en headerpatronen.
- Radius varieert tussen `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`.
- Sommige dashboarddelen gebruiken oudere stijlen (`rounded-3xl`, `shadow-xl`) naast nieuwere rustige adminkaarten.

## 7. Huidige pagina's/routes

| Route | Bestand | Doel | Belangrijkste componenten | Stylingkwaliteit | Restyle prioriteit |
|---|---|---|---|---|---|
| `/login` | `src/components/auth/LoginScreen.jsx` | Login en dev-login | Auth UI, Google knop | Redelijk, maar merkstijl nog generiek | Midden |
| `/` | `src/components/layout/TableOfContents.jsx` | Leerlingoverzicht lesmateriaal | Tree/cards/progress | Functioneel, belangrijk voor leerling UX | Hoog |
| `/profiel` | `src/pages/StudentProfilePage.jsx` | Studentprofiel en voortgang | Cards, progressgroepen | Rustig en recent | Midden |
| `/chapter/:chapterId` | `src/pages/StudentLessonPage.jsx` | Leerling-lesroute | Stepper, contentblocks, games, slidedecks | Sterke basis, maar kernflow | Hoog |
| `/admin` | `src/pages/AdminDashboardPage.jsx` | Beheer/startplek | Statcards, quick actions | Rustig, productief | Midden |
| `/dashboard` | `src/components/dashboard/ClassOverview.jsx` | Voortgang/klasdashboard | KPI cards, tabel, leerlingdetails | Functioneel, deels oudere styling | Hoog |
| `/admin/lesstof` | `src/pages/AdminLesstofPage.jsx` | Lesstof werkplek | Action cards | Helder en recent | Midden |
| `/admin/cms` | `src/pages/AdminCmsPage.jsx` + `src/components/cms/CmsShell.jsx` | CMS contentstudio | NavigationTree, ContentBlockBuilder | Veel verbeterd, maar complex en gemengd | Hoog |
| `/admin/slidedecks` | `src/pages/AdminSlidedecksPage.jsx` | NotebookLM/Slidedeckcreator | Form, table, modals | Functioneel, recent | Midden |
| `/admin/digibord` | `src/pages/AdminDigibordPage.jsx` | Digibord leskeuze | Selectiekaarten/tree | Functioneel | Midden |
| `/admin/klassen` | `src/pages/AdminKlassenPage.jsx` | Klassenbeheer | Forms/tables/cards | Nog beoordelen bij restyle | Midden |
| `/admin/taken-toewijzen` | `src/pages/TakenToewijzenPage.jsx` | Lesstof klaarzetten | Selectorflow, assignment summaries | Recent, maar visueel belangrijk | Hoog |
| `/admin/leerlingen` | `src/pages/AdminLeerlingenPage.jsx` | Leerlingaccounts | Accounttabel/cards | Basis V1 | Midden |
| `/admin/spellen` | `src/pages/AdminSpellenPage.jsx` | Game module | Game registry/player cards | Recent V1/2B | Laag-midden |
| `/admin/crop-tool` | `src/pages/AdminCropToolPage.jsx` | Losse crop tool | Crop/editor components | Waarschijnlijk minder centraal door CMS-studio | Laag |

## 8. Responsive / mobiel

### Aanwezige breakpoints

De app gebruikt Tailwind-breakpoints, vooral:

- `sm:`
- `md:`
- `lg:`
- `xl:`
- `2xl:`

Voorbeelden:

- `md:grid-cols-3`, `lg:grid-cols-4`, `xl:grid-cols-[...]`
- `hidden md:inline`
- `px-6 md:px-8`
- `flex-col md:flex-row`

### Mobiele risico's

| Gebied | Risico |
|---|---|
| AppShell topbar | Adminnavigatie met vijf knoppen kan krap worden op tablet/mobiel. |
| CMS | De boomstructuur en lesblokstudio zijn desktop-georiënteerd. Mobiele bediening is waarschijnlijk beperkt bruikbaar. |
| Crop/OCR studio | Precisiecrops zijn vrijwel desktop-first. Mobiele ondersteuning vraagt aparte UX. |
| Tabellen | Voortgang, leerlingen en slidedeckoverzichten gebruiken horizontale overflow of brede tabellen. |
| Digibord/PDF presenter | Fullscreen is vooral digibord/desktop. Op klein scherm is bediening mogelijk kwetsbaar. |
| Student lesroute | Stappenlijst plus content gebruikt responsive grid, maar content met grote afbeeldingen/PDF/game kan alsnog breed worden. |

### Positief

- Veel layout gebruikt al `flex-col` naar `md:flex-row`.
- Tabellen hebben vaak `overflow-x-auto`.
- Hoofdcontainers gebruiken meestal `max-w-7xl` met responsieve padding.

## 9. Design schuld / risico's

1. **Kleuren zijn deels gecentraliseerd, maar vooral verspreid.**  
   `src/index.css` heeft tokens, maar JSX bevat veel directe Tailwind-kleuren.

2. **Geen harde basiscomponentlaag.**  
   Er is geen centrale `Button`, `Card`, `Input`, `Badge`, `Modal`, `Tabs` laag. Daardoor ontstaan variaties per pagina.

3. **`src/App.css` lijkt legacy.**  
   Dit bestand bevat demo-achtige selectors en CSS variables die niet duidelijk onderdeel zijn van het huidige HELIX-design.

4. **Veel pagina-specifieke kaartstijlen.**  
   Borders, shadows, padding en radius verschillen tussen admin, CMS, dashboard en leerlingflow.

5. **Typografie is krachtig maar zwaar.**  
   `font-black` wordt breed ingezet. Dat past bij branding, maar kan in data-intensieve schermen visueel te luid worden.

6. **Font is niet echt geladen.**  
   `Inter` staat in de font stack, maar wordt niet zichtbaar geladen in `index.html` of CSS.

7. **Statuskleuren zijn niet semantisch genoeg.**  
   Success/warning/error bestaan als tokens, maar statusbadges gebruiken verspreide Tailwind-combinaties.

8. **CMS bevat oude/legacy resten.**  
   In `CmsShell.jsx` staan uitgeschakelde legacy panels en oude tekst/emoji-encoding. Niet per se zichtbaar, maar wel kwetsbaar bij onderhoud.

9. **Inline styles zijn gemengd.**  
   Sommige zijn functioneel nodig, andere zouden later via tokens of component props kunnen.

10. **Responsive is aanwezig, maar niet systematisch getest als ontwerpprincipe.**  
   Vooral CMS, cropstudio, voortgangstabellen en PDF-presenter vragen een aparte responsive QA-pass.

11. **Encoding/tekstkwaliteit is niet overal schoon.**  
   In sommige bestanden staan mojibake-karakters zoals `Ã©`, `â†`, `ðŸ“`. Dit is vooral zichtbaar in oudere delen.

12. **Dark/light taal is verdeeld.**  
   De app is meestal light-mode, maar PDF-presenter en sommige dashboarddetailpanelen gebruiken dark surfaces. Dit kan bewust, maar moet in een design system worden vastgelegd.

## 10. Aanbevolen migratiepad

1. **Design tokens centraliseren**  
   Breid `src/index.css` uit met semantische tokens: background, surface, text, border, primary, accent, success, warning, danger, focus, shadow, radius en spacing.

2. **Globale basisstijl instellen**  
   Leg body, font-loading, basiscontrast, focusstijl, scrollbars en prose-styling vast.

3. **Basiscomponenten restylen**  
   Maak of standaardiseer `Button`, `Card`, `Input`, `Select`, `Badge`, `Modal`, `Tabs`, `Progress`, `IconButton`.

4. **AppShell / navigatie restylen**  
   Pas `src/components/layout/AppShell.jsx` als eerste zichtbare laag aan. Dit bepaalt het HELIX-gevoel overal.

5. **Dashboard restylen**  
   Breng `src/pages/AdminDashboardPage.jsx`, `src/pages/AdminLesstofPage.jsx`, `src/pages/AdminLeerlingenPage.jsx` en `src/pages/AdminKlassenPage.jsx` onder dezelfde dashboardtaal.

6. **Lesdetail restylen**  
   Optimaliseer `src/pages/StudentLessonPage.jsx` en `src/components/layout/TableOfContents.jsx` voor leerlingrust, motivatie en voortgang.

7. **AI tutor chat restylen**  
   Breng `src/components/slides/AITutorChat.jsx` en eventuele tutor/panel components onder dezelfde componenttokens.

8. **Voortgang/analytics restylen**  
   Pak `src/components/dashboard/ClassOverview.jsx` en assignment progress visuals aan met consistente tabellen, chips en progressbars.

9. **Responsive pass**  
   Controleer expliciet mobiel/tablet/desktop voor AppShell, CMS, dashboards, studentroute, digibord en slidedecks.

10. **QA / visuele controle**  
   Gebruik browserpreview, screenshots en checklist op contrast, spacing, states, empty states, loading states en error states.

## 11. Bestanden die waarschijnlijk aangepast moeten worden

| Bestand | Waarom aanpassen | Risico | Prioriteit |
|---|---|---|---|
| `src/index.css` | Tokens, globale basisstijl, componentutilities centraliseren | Midden: raakt globale styling | Hoog |
| `src/App.css` | Opschonen of verwijderen als legacy na verificatie | Laag-midden: kan onverwacht nog iets raken | Midden |
| `src/components/layout/AppShell.jsx` | Nieuwe HELIX navigatie, topbar en brandstijl | Hoog: alle routes | Hoog |
| `src/components/layout/TableOfContents.jsx` | Leerling-thuisbasis en lesmateriaaloverzicht | Hoog: leerlingflow | Hoog |
| `src/pages/StudentLessonPage.jsx` | Kern van leerlingervaring | Hoog: voortgang en lesblokken | Hoog |
| `src/pages/StudentProfilePage.jsx` | Profiel en voortgang visueel gelijktrekken | Midden | Midden |
| `src/pages/AdminDashboardPage.jsx` | Beheer/startplek als design referentie | Midden | Hoog |
| `src/pages/AdminLesstofPage.jsx` | Werkplekkaarten en informatiearchitectuur | Midden | Midden |
| `src/pages/AdminLeerlingenPage.jsx` | Accountoverzicht/tabel uniformeren | Midden | Midden |
| `src/pages/AdminKlassenPage.jsx` | Beheerflows uniformeren | Midden | Midden |
| `src/pages/TakenToewijzenPage.jsx` | Belangrijke adminflow voor lesmateriaal klaarzetten | Hoog: assignmentlogica | Hoog |
| `src/components/dashboard/ClassOverview.jsx` | Analytics, tabellen, progress en leerlingdetail | Hoog: datalogica en realtime updates | Hoog |
| `src/pages/AdminCmsPage.jsx` | CMS route wrapper/context | Laag-midden | Midden |
| `src/components/cms/CmsShell.jsx` | CMS layout, sidebar, werkvlak | Hoog: complex | Hoog |
| `src/components/cms/NavigationTree.jsx` | Navigatieboom, statuschips, zoek/actiegedrag | Hoog | Hoog |
| `src/components/cms/ContentBlockBuilder.jsx` | Lesblokstudio, block cards, Tiptap toolbar | Hoog | Hoog |
| `src/components/cms/CropEditorPanel.jsx` | Crop/OCR werkvlak visueel en interactief verfijnen | Hoog: precisie UX | Midden |
| `src/components/admin/CropSelectionOverlay.jsx` | Selectiehandles, cropfeedback, kleuren | Hoog: interactiegevoelig | Midden |
| `src/components/admin/ImageCanvasEditor.jsx` | Canvas editor styling en bediening | Hoog: interactiegevoelig | Midden |
| `src/components/digibord/DigibordViewer.jsx` | Digibordstijl, slidecanvas, controls | Hoog | Midden |
| `src/components/digibord/PdfSlideDeckPresenter.jsx` | Slidedeckpresentatie, fullscreen controls | Hoog: PDF-rendering | Midden |
| `src/pages/AdminSlidedecksPage.jsx` | Slidedeckcreator formulier/tabel/modals | Midden | Midden |
| `src/pages/AdminSpellenPage.jsx` | Game module styling | Midden | Laag-midden |
| `src/components/games/PythagorasTrainerGame.jsx` | Game visual style en theming | Midden | Laag-midden |
| `src/lib/paletColors.js` | Palet harmoniseren met nieuwe HELIX tokens | Midden: gebruikt voor dynamische kleurkeuzes | Midden |

## 12. Bestanden die we beter niet aanraken tijdens stylingwerk

Deze bestanden zijn functioneel gevoelig. Alleen aanpassen als de taak daar expliciet om vraagt.

| Bestand / pad | Waarom voorzichtig |
|---|---|
| `src/services/firebase.js` | Firebase initialisatie. Stylingwerk hoort dit niet te raken. |
| `src/services/cmsService.js` | CMS data-operaties en contentstructuur. |
| `src/services/klasService.js` | Klassen, toewijzingen en studentoverrides. |
| `src/services/voortgangService.js` | Voortgangsregistratie. |
| `src/services/slidedeckService.js` | Firestore/Storage voor slidedecks. |
| `src/services/storageService.js` | Uploads, crops en Storage paths. |
| `src/components/auth/AuthProvider.jsx` | Auth, dev-login, rollen en klasdata. |
| `src/components/auth/devAuth.js` | Lokale dev-login bypass. |
| `src/components/auth/RequireAuth.jsx` | Routebeveiliging. |
| `src/App.jsx` | Routes en routeguards. Alleen aanpassen als navigatiestructuur echt verandert. |
| `src/lib/assignmentUtils.js` | Toewijzingslogica voor klas/leerling/lesblok. |
| `src/lib/studentLessonProgress.js` | Leerlingvoortgang en resume-logica. |
| `src/lib/contentBlockUtils.js` | Contentblocktypes, defaults, previews en normalisatie. |
| `src/lib/gameRegistry.js` | Game registry en resultaatcontract. |
| `src/lib/digibordSlideUtils.js` | Conversie van lesblokken naar digibordslides. |
| `src/lib/sourcePdfGenerator.js` | PDF-generatie voor NotebookLM bronbestand. |
| `firestore.rules`, `storage.rules` of Firebase console rules | Niet onderdeel van styling. |
| `functions/` | Cloud Functions/back-end logica, indien aanwezig. |

## 13. Conclusie

HELIX heeft inmiddels een duidelijke productrichting: een licht, rustig leerplatform met sterke adminwerkplekken, CMS-lesblokken, digibordpresentatie, leerlingroutes, games en slidedecks. De stylingbasis is functioneel en grotendeels Tailwind-gebaseerd, maar nog niet volledig als design system georganiseerd.

Het belangrijkste probleem is dat visuele keuzes verspreid zitten in pagina- en componentbestanden. Er zijn wel eerste tokens en utilities in `src/index.css`, maar knoppen, kaarten, badges, modals, tabellen, progressbars en statuskleuren zijn nog niet consequent gecentraliseerd.

De veiligste eerste stap is daarom niet meteen pagina's restylen, maar eerst een klein HELIX design-tokenplan en componentbasis ontwerpen. Daarna kan AppShell/navigatie als eerste echte visuele laag worden aangepakt, gevolgd door dashboard, leerlingroute en CMS.

Advies voor de volgende Codex-prompt:

> Gebruik `docs/HELIX-DESIGN-AUDIT.md` als uitgangspunt. Maak eerst een concreet HELIX design-system voorstel met kleuren, typografie, radius, spacing, shadows, componenttokens en migratievolgorde. Pas nog geen code aan.

