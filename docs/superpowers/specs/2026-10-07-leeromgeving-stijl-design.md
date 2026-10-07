# HELIX Leeromgeving-stijl

> Ontwerp, 7 oktober 2026. Goedgekeurd door Kevin in de sessie: manier 1 (eigen bouwstenen,
> pagina voor pagina), uitrol per fase, en per fase zelf committen, markeren en deployen.

## 1. Waar dit over gaat

De website van HELIX krijgt één eigen uiterlijk voor leerlingen en docenten: de **HELIX
Leeromgeving-stijl**. Het voorbeeld is optie D van de proefpagina "Indeling Testen als leerling"
(https://claude.ai/artifact/LxVArWS3PYLpsLrHw5nHbr): witte kaarten, lijsten met dunne
scheidingslijnen, gele H-blokjes met zwarte letters, het aantal lesblokken per paragraaf, de
knoppen Start en Start hier, en een slotje bij wat nog dicht is.

### Twee stijlen, strikt gescheiden

| | HELIX Leeromgeving-stijl | Helix Slide Design System |
| --- | --- | --- |
| Voor | de website: leerling- en docentenomgeving | slidedecks, NotebookLM-materiaal, explainervideo's |
| Bron | dit document en `docs/LEEROMGEVING-STIJL.md` | `sources/designsysteem/Helix_Slide_Design_System_v2.pdf`, `.claude/skills/helix-hoofdstuk-bouwen/references/slidedeck-designsysteem.md` |
| Code | `src/styles/leeromgeving.css`, `src/components/leeromgeving/` | geen websitecode; alleen prompts en decks |
| Letter | Atkinson Hyperlegible Next, nergens Bangers | Bangers voor koppen, Atkinson voor tekst |
| Kenmerken | witte kaarten, scheidingslijnen, gele H-blokjes, rustig | stripstijl, gele titelband, rasterpunten, snelheidslijnen |

Na dit traject verwijst de website-CSS nergens meer naar het Slide Design System. Wie een deck
maakt, kijkt niet in de website-CSS; wie de website aanpast, kijkt niet in het Slide Design
System. Dezelfde kleurwaarden (geel, blauw, crème) mogen in beide voorkomen: het verschil zit in
eigenaarschap, naamgeving en vormentaal, niet in elke hexwaarde.

### Wat zijn eigen uiterlijk houdt (Kevin, 7 okt 2026)

- de spellen (iframe-spellen KlimBit en DVLingo, en de React-spellen in `src/games/`);
- de presenter en het digibord (alleen de menubalk eromheen gaat mee);
- het printbare certificaat (`CertificaatPage.jsx`).

De inlogpagina's gaan wel mee (Kevin, 7 okt 2026, na eerste review), ook zonder Bangers.

De Tailwind-kleurfamilies die in `src/index.css` naar DS-kleuren zijn omgezet (`@theme`, slate tot
pink) blijven ongemoeid: de spellen leunen erop.

## 2. De stijl

Alle waarden zijn uit de twee bijlagen van Kevin gehaald (de kaarten van optie D).

### 2.1 Kleuren

Eigen namen met voorvoegsel `--lo-` (leeromgeving). Geen naam die een andere kleur beschrijft dan
hij is; de oude namen als `--helix-purple` (blauw) en `--helix-pink` (teal) verdwijnen in fase 4.

| Token | Waarde | Gebruik |
| --- | --- | --- |
| `--lo-papier` | #FFF7E8 | achtergrond van de pagina |
| `--lo-papier-2` | #FBEBD0 | dichte H-blokjes, uitgeschakelde knoppen, rustige vlakken |
| `--lo-kaart` | #FFFFFF | kaarten en lijsten |
| `--lo-lijn` | #E8DCC3 | randen en scheidingslijnen |
| `--lo-inkt` | #0B0D0F | tekst, rand van het H-blokje, gekozen keuzeknop |
| `--lo-grijs` | #5B5648 | onderregels en uitleg |
| `--lo-geel` | #FFD33D | H-blokje |
| `--lo-geel-zacht` | #FFF0B8 | gekozen kaart, aandacht |
| `--lo-blauw` | #087EB5 | hoofdknop, focusrand |
| `--lo-blauw-inkt` | #066A99 | tekst op lichtblauw, hover van de hoofdknop |
| `--lo-blauw-zacht` | #E1F0F8 | Start-knoppen, blauwe labels |
| `--lo-paars` | #793AC7 | kolf-icoon bij een klas |
| `--lo-paars-inkt` | #5F2C9E | tekst van het label inclusie |
| `--lo-paars-zacht` | #ECE3F8 | label inclusie, rand van de inclusiekaart |
| `--lo-groen` / `-inkt` / `-zacht` | #2E9D63 / #237A4D / #DFF2E7 | af, voortgang, label open |
| `--lo-oranje-inkt` / `-zacht` | #B4520E / #FDE7D6 | label op slot |
| `--lo-rood` / `-zacht` | #D83A2E / #FADDDA | fouten en problemen |

### 2.2 Vormen en letter

| Token | Waarde |
| --- | --- |
| `--lo-hoek-s` | 8px: H-blokje, Start-knop |
| `--lo-hoek-m` | 12px: lijst, invoervelden, hoofdknop |
| `--lo-hoek-l` | 16px |
| `--lo-hoek-xl` | 20px: kaart |
| `--lo-schaduw-kaart` | 0 8px 24px rgba(11, 13, 15, 0.07) |
| `--lo-schaduw-knop` | 0 10px 22px rgba(8, 126, 181, 0.28) |
| `--lo-letter` | 'Atkinson Hyperlegible Next Variable', 'Atkinson Hyperlegible', Arial, system-ui, sans-serif |

Typografie, opgemeten in de pagina van Kevins bijlage (optie D, 7 okt 2026, `getComputedStyle`):

| Tekst | Grootte / dikte | Regelhoogte | Kleur |
| --- | --- | --- | --- |
| gewone tekst | 15px / 400 | 1,5 (22,5px) | `--lo-inkt` |
| kaarttitel ("ER3L1A") | 20px / 800 | 30px | `--lo-inkt` |
| uitleg onder de kaarttitel | 14px / 400 | 21px | `--lo-grijs` |
| rijtitel en paragraaftitel ("Stoffen", "2.1 Massa") | 15px / 700 | 22,5px | `--lo-inkt` |
| onderregel ("4 paragrafen · 10 blokken", "7 lesblokken") | 12,5px / 400 | 18,75px | `--lo-grijs` |
| H-blokje ("H2") | 13px / 800 | 19,5px | `--lo-inkt` |
| Start en Start hier | 13px / 800 | 19,5px | `--lo-blauw-inkt` |
| keuzeknop ("H1B1") | 13px / 800 | 19,5px | `--lo-inkt`, gekozen `--lo-papier` |
| label ("23 testrecords") | 12px / 800 | 18px | inkt-variant van de labelkleur |
| paginakop | 28-38px / 800 | 1,15 | `--lo-inkt` |

Cijfers altijd `font-variant-numeric: tabular-nums`. Koppen nooit in hoofdletters, nooit in
Bangers. In de proefpagina had de groepskaart ("Digitale vaardigheden · 8 klassen") per ongeluk
dikte 700; de stijl legt 800 vast voor elke kaarttitel.

### 2.3 Bouwstenen

CSS-klassen in `src/styles/leeromgeving.css` (geïmporteerd vanuit `src/index.css`), met
React-onderdelen in `src/components/leeromgeving/` die die klassen gebruiken.

| Onderdeel | Klasse | Uiterlijk |
| --- | --- | --- |
| Kaart | `.lo-kaart` | wit, hoek 20px, kaartschaduw, binnenmarge 22px (16px op een telefoon), 14px ruimte tussen kop, lijst en voet |
| Lijst | `.lo-lijst` | rand 1px `--lo-lijn`, hoek 12px; kinderen `.lo-rij` met 1px lijn ertussen, rij 10px 12px, 10px ruimte tussen de delen van een rij |
| H-blokje | `.lo-hblok` | 30px hoog, min. 30px breed, padding 0 6px, geel, rand 2px inkt, hoek 8px, 13px/800 ("H2"). Dicht: `.lo-hblok--dicht` crème, rand `--lo-lijn`, grijze letters |
| Hoofdstukrij | `HoofdstukRij` | H-blokje, titel, onderregel ("3 paragrafen · 41 lesblokken"), labels, pijltje 15px rechts/omlaag, Start-knop rechts |
| Paragraafrij | `ParagraafRij` | blok ingesprongen 52px links, 12px rechts, 10px onder; rijen 7px boven en onder met 1px lijn ertussen; "2.3 Dichtheid", onderregel "9 lesblokken", knop Start hier |
| Start-knop | `.lo-knop-start` | lichtblauw vlak, donkerblauwe tekst 13px/800, inlogpijl-icoon 15px, hoek 8px, padding 6px 10px, rand 1px doorzichtig (34px hoog); hover blauwe rand; uitgeschakeld crème met grijze tekst |
| Hoofdknop | `.lo-knop` | blauw vlak, witte tekst 800, hoek 12px, padding 12px 18px, knopschaduw; voor de ene belangrijkste handeling op een scherm |
| Tweede knop | `.lo-knop-tweede` | wit, rand 1px `--lo-lijn`, inkt-tekst 700, hoek 12px |
| Label | `.lo-label` + `--blauw`, `--paars`, `--groen`, `--oranje`, `--rood` | pil, 12px/800, padding 2px 9px, zachte achtergrond met inkt-tekst |
| Slot | `SlotAanduiding` | lucide `Lock` 15px naast de titel, onderregel "op slot", knop uitgeschakeld |
| Keuzeknop | `.lo-keuze` | pil, rand 2px `--lo-lijn`, 13px/800, padding 5px 11px; gekozen: inkt-vlak, crème tekst |
| Kolf-icoon | in de kaarttitel | lucide `FlaskConical` 18px in `--lo-paars`, 8px voor de naam |
| Paginakop | `.lo-paginakop` | eyebrow (12px/800, hoofdletters, blauw-inkt), titel, uitleg in grijs (max 70 tekens breed) |

Iconen: alleen lucide-react, 15-18px, lijndikte 2.

### 2.4 Teksten en gedrag die de stijl vastlegt

- Een rij met iets dichts toont altijd het slotje en een uitgeschakelde knop, nooit een knop die
  pas na klikken zegt dat het niet kan.
- Aantallen staan voluit: "1 paragraaf", "3 paragrafen", "1 lesblok", "9 lesblokken".
- Knoptekst bij een hoofdstuk voor een leerling: Start (nog niets gedaan), Ga verder (bezig),
  Bekijk terug (af). Deze sleutels bestaan al in `src/lib/uiTaal.js`; een nieuwe tekst ("Start
  hier") komt erbij in alle tien de talen.

## 3. Wat er per pagina verandert

### 3.1 Testen als leerling (`/admin/testen`, fase 1)

Optie D: één kaart per groep klassen die precies dezelfde lesstof zien. Vandaag: ER3L1A,
ER3L2A, de acht vmbo-klassen samen, en H1i1.

- Groeperen gebeurt met een pure functie in `src/lib/testleerlingOverzicht.js` op wat de
  leerling ziet (hoofdstuknummer, hoofdstuktitel, paragraaflabel, op slot, aantal blokken), niet op
  id's: de vmbo-klassen hebben elk een eigen nulmeting-id met hetzelfde label.
- Kaart met meer klassen: kop "Digitale vaardigheden · 8 klassen", uitleg, keuzeknoppen "Log in als
  testleerling van". Kaart met één klas: kolf-icoon, naam, vak en leerroute.
- Hoofdstukrijen met Start (naar `/hoofdstuk/<id>`), uitklapbaar tot paragrafen met Start hier
  (naar `/chapter/<paragraafId>`). Voet: testdata-label, tokens, "Start op de startpagina" (naar `/`).
- De starthandeling krijgt een doelroute mee: na `signInWithCustomToken` gaat de app naar die
  route in plaats van naar `/`. Bij het bouwen controleren dat `PrivateRoute` en de
  klaskeuzemodal die route niet overschrijven.
- Problemen ("deze klas ziet paragraaf X niet") blijven zichtbaar als rood label in de kaart.

### 3.2 Leerlingomgeving (fase 2)

- **Inlogpagina's** (`LoginScreen.jsx`, `AdminLoginScreen.jsx`): één `.lo-kaart` op de crème
  achtergrond, paginakop zonder Bangers, invoervelden met hoek 12px en een rand in `--lo-lijn`,
  de hoofdknop voor inloggen. Alle teksten blijven gelijk; de e2e-test zoekt ze op.
- **Menubalk** (`AppShell.jsx`, studentdeel): witte balk, lijn eronder, de pillen (tokens, niveau,
  weekdoel) als `.lo-label`.
- **Startpagina** (`TableOfContents.jsx`): paginakop met taalknop; kaart "Verder waar je was" met
  hoofdknop; daaronder één `.lo-kaart` met een `.lo-lijst` van hoofdstukrijen. Elke rij toont de
  voortgang ("2 van 3 af", groen vinkje bij af) en klapt uit tot paragraafrijen met "Start hier" en
  hun eigen voortgang. Een hoofdstuk op slot: crème H-blokje, slotje, uitgeschakelde knop en de
  bestaande uitleg "Je docent zet dit hoofdstuk open als de les begint." Plusparagrafen krijgen een
  label in plaats van een eigen kaartje.
- **Hoofdstukpagina** (`StudentChapterPage.jsx`, `ChapterDetail.jsx`): dezelfde paragraafrijen, met
  daaronder per paragraaf de stappen; de vergrendelde rijen niet meer gestippeld maar met slotje.
- **Lespagina** (`StudentLessonPage.jsx`, `StudyStepRail.jsx` en de blokken): alleen het uiterlijk.
  De `study-*`-klassen gaan over op de nieuwe tokens: lesblok als witte kaart, de stappenbalk als
  lijst met scheidingslijnen en een geel nummerblokje voor de huidige stap, "Ga verder" als
  hoofdknop. Geen gedragswijziging, geen nieuwe stappen.
- **Profiel, tokenshop, spellenoverzicht, Mijn klas**: kaarten, labels en knoppen in de nieuwe
  stijl; Bangers eruit (in `StudentKlasPage`, `StudentTokenShopPage`, `AvatarMaker`,
  `StemEnWedstrijd`, `PrivilegesSectie`, `NiveauOmhoogMoment`).

### 3.3 Docentenomgeving (fase 3)

- **Menubalk** (`AppShell.jsx`, beheerdeel) en het Help-paneel (zonder gele titelband).
- **Overzichtspagina's** (Lesstof, Leerlingen, Instellingen): kaarten in de nieuwe stijl.
- **Lijsten en formulieren**: Klassen, Vrijgeven (het raster krijgt H-blokjes en slotjes),
  Tokenbeheer, Meldingen, Spellenbeheer, Slidedecks, AI-instellingen, Crop-tool, digibordoverzicht.
- **Grote werktuigen, als laatste**: Klaarzetten (`TakenToewijzenPage`), Voortgang
  (`ClassOverview` en zijn onderdelen), de lesstofeditor (`CmsShell`, `ContentBlockBuilder`).
  Daar verandert het uiterlijk van kaarten, knoppen, labels en lijsten; de werking niet.

### 3.4 Opruimen (fase 4)

- Oude tokens (`--helix-*`) eruit nadat geen bestand ze meer gebruikt; de vaste hexwaarden in
  JSX-bestanden (nu 260 in 25 bestanden) naar tokens.
- Ongebruikte CSS weg: o.a. `helix-heading-lg`, `helix-gradient-text`, `helix-logo-mark`,
  `token-shop-*`, `btn-link`, `card-base`, `src/App.css`.
- `.ds-display` en `.ds-anchor` blijven alleen voor de uitgezonderde onderdelen (certificaat en
  de spellen dichtheid, vloeistoffenlab en volume berekenen), met die uitleg erbij.
- De verouderde stijldocumenten in de root (`DESIGN_SYSTEM.md` en verwanten van 10 mei) naar
  `docs/archief/`; `docs/LEEROMGEVING-STIJL.md` wordt het enige stijldocument van de website.

## 4. Fasen, backup en uitrol

| Fase | Inhoud | Klaar als |
| --- | --- | --- |
| 0 | Backuppunt: markering `leeromgeving-voor` op de live versie, de huidige Vercel-deploy genoteerd | `git tag` staat op origin; deploy-id in `docs/HANDOFF.md` |
| 1 | Tokens, `leeromgeving.css`, bouwstenen, stijlgids (`/admin/stijlgids`), Testen met optie D, `docs/LEEROMGEVING-STIJL.md` | Kevin start vanaf Testen in een hoofdstuk en een paragraaf |
| 2 | Inlogpagina's en leerlingomgeving | Kevin logt in en loopt als testleerling van ER3L1A, een vmbo-klas en H1i1 door startpagina, hoofdstuk en les |
| 3 | Docentenomgeving | elke beheerpagina bekeken; de grote werktuigen werken als voorheen |
| 4 | Opruimen en documenten | geen `--helix-*` meer in JSX; geen verwijzing naar het Slide Design System in de website-CSS |

Per fase: werken op `codex/digitale-vaardigheden-seed` (de productietak), aan het eind lint op de
gewijzigde bestanden, `node --test src/lib/`, `npm run build`, één commit (of een paar logische),
markering `leeromgeving-fase-N`, push, `npx vercel --prod --yes`, en de deploy-id in de handoff.
Terugdraaien kan op twee manieren: de vorige deploy terugzetten in Vercel (direct), of
`git revert` van de fasecommits en opnieuw deployen.

Het werk van vandaag dat nog niet gecommit is (inclusieversie H2, scripts, skill) gaat vóór fase 0
in een eigen commit, zodat het backuppunt precies de live versie is.

## 5. Controle

- **Stijlgids** `/admin/stijlgids`: alle bouwstenen naast elkaar met voorbeelddata, inclusief op
  slot, inclusie, lege lijst en een telefoonbreedte. Werkt zonder Firestore, dus ook met de
  ontwikkelaarslogin; daarmee maak ik per fase schermafbeeldingen. Ik meet de stijlgids op
  dezelfde manier op als de bijlage (`getComputedStyle`) en vergelijk elke waarde met de tabellen
  in 2.2 en 2.3; een afwijking is een fout.
- **Pure functies met tests** (`node --test src/lib/`): groeperen van klassen, de tekst van de
  onderregel ("3 paragrafen · 41 lesblokken · 2 van 3 af"), de knoptekst per voortgang, de
  doelroute van een testsessie.
- **`src/lib/designTokenStyles.test.js`** wordt bijgewerkt: hij controleert nu klassen van de
  oude stijl en moet de nieuwe tokens en klassen bewaken, plus dat de website-CSS niet naar het
  Slide Design System verwijst.
- **`src/lib/uiTaal.test.js`** bewaakt dat elke nieuwe tekst in alle tien de talen staat.
- **De e2e-test** `tests/e2e/auth-admin-smoke.spec.js` zoekt teksten op de inlogpagina's. Die
  pagina's krijgen de nieuwe stijl, maar hun teksten veranderen niet; de test draait na fase 2.
- **Echte pagina's**: per fase een ronde van Kevin als testleerling, omdat de lesstof alleen met
  een echte aanmelding laadt.

## 6. Risico's

- **De lespagina is 5043 regels.** Alleen klassen en tokens vervangen, geen logica. Per blok
  bekijken in de stijlgids of als testleerling.
- **Kleurfamilies van Tailwind.** Niet aanpassen: dan verkleuren de spellen mee.
- **Doelroute na inloggen als testleerling.** De klaskeuzemodal of `PrivateRoute` kan de leerling
  naar `/` sturen; dat moet in fase 1 blijken en worden opgelost.
- **Vertalingen.** Een tekst die alleen in het Nederlands bestaat, laat de test falen; dat is de
  bedoeling.
- **Twee sessies.** Geen andere sessie tegelijk in deze map tijdens een fase (zie `docs/HANDOFF.md`).

## 7. Buiten dit traject

Nieuwe functies, andere navigatie dan in 3.2 beschreven, donkere modus, de spellen, de presenter,
het certificaat en het Slide Design System zelf.
