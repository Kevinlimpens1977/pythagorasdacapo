# Overdracht: KlimBit in HELIX (2 oktober 2026)

Gebouwd in de worktree `C:\Projecten\helix-klimbit`, branch **`feat/klimbit`**, afgetakt
van `codex/digitale-vaardigheden-seed` op `f7798e5`. Niets is gepusht en niets is
uitgerold. De HELIX-sessie merget deze branch en doet één gezamenlijke uitrol, zodat het
werk dat alleen in `C:\Projecten\helix leerplatform` staat (de spelSlot-fix van Binask 2.6
en de DV-H3-plaatjes) live blijft.

## Wat het doet

- KlimBit staat voor **iedereen** op `/spellen`, ook zonder klastoewijzing
  (registry-vlag `voorIedereen: true`). Beheerders zien nu ook de knop Spellen en spelen
  mee, maar verdienen nooit tokens.
- Het spel draait same-origin in een iframe op `/games/klimbit/v1/`, via de bestaande
  `ExternalGameHost`.
- Een poging begint bij **Begin de klim** en eindigt met **Klim beëindigen** (of
  "Opnieuw vanaf de grond"). Pas dan telt de eindscore: de hoogste hoogte in die poging.
- **Tokens (alleen rol `student`)**, op de erkende eindhoogte:
  onder of gelijk aan 400 m: 0. Boven 400 m: 1e keer 300 + (m − 400), 2e keer 200 + (m − 400),
  3e keer 100 + (m − 400), vanaf de 4e keer 0. De teller staat alleen op de server en wordt
  nooit gereset. **Buiten het weekplafond**; `leerlingWeek`, XP en niveau blijven ongemoeid.
  Wel een grootboekregel in `tokenTransactions` (reason `klimbit-height`), dus zichtbaar in
  tokenbeheer.
- **Persoonlijk record** per speler, geen ranglijst (HELIX-beleid).
- KlimbitGame stuurt bewust geen `onComplete` naar de GamePlayer, anders betaalt
  `awardTokensForActivity` uit binnen het weekplafond.

## Commits op `feat/klimbit`

| Commit | Inhoud |
|---|---|
| `4503737` | registry, KlimbitGame, service, callables, regels, tests, voorIedereen, AppShell |
| `2dcea1d` | grenzen op de gemeten klimsnelheid |
| `d2a34ed` | echte KlimBit-build in `public/games/klimbit/v1/` (vervangt de placeholder) |
| (deze) | dit overdrachtsdocument |

In de worktree staan nog `functions/shared/README.md` en `functions/shared/package.json`
als gewijzigd. Dat zijn alleen regeleinden (CRLF), geen inhoud. Niet meenemen.

## Cloud Functions die erbij komen

Beide `onCall`, regio `europe-west1`, codebase `default`, in `functions/index.js`:

- **`startKlimbitPoging`**: maakt `klimbitPogingen/{id}` met servertijd; hooguit één open
  poging per speler (een oudere wordt `verlopen`).
- **`rondKlimbitPogingAf`**: rondt een open poging van deze speler af in één transactie:
  erkende hoogte, record, en bij een leerling de tokens. Idempotent per poging.

Bestaande functies zijn niet gewijzigd. Uitrollen met expliciete namen:

```bash
npx firebase deploy --only functions:startKlimbitPoging,functions:rondKlimbitPogingAf --project pythagoras-eoa
```

`functions/shared/klimbitBeloning.js` is nieuw en staat in `SHARED_ENTRY_POINTS`
(`scripts/sync-functions-shared.mjs`). Draai na het mergen `npm run check:functions-shared`.

## firestore.rules verandert: ja

Drie nieuwe match-blokken na `paragraafCijfers`, verder niets:

```
match /klimbitPogingen/{pogingId} { allow read, write: if false; }
match /klimbitTeller/{studentUid} { allow read, write: if false; }
match /spelRecords/{recordId} {
  allow read: if signedIn() && (
    (recordId.matches('^[a-z0-9-]+_' + request.auth.uid + '$') &&
      (resource == null || resource.data.uid == request.auth.uid)) ||
    isAdmin()
  );
  allow write: if false;
}
```

Maak vóór het uitrollen een back-up van de live ruleset (Rules-API of Firebase-console,
buiten git) en rol daarna alleen de regels uit:
`npx firebase deploy --only firestore:rules --project pythagoras-eoa`.

## Waar de KlimBit-build staat

- In HELIX: **`public/games/klimbit/v1/`**, 81 bestanden, 60 MB (modellen 38 MB,
  texturen 11 MB, audio 6,8 MB). Geen bestand boven 50 MB.
- Bron: KlimBit-repo `C:\Projecten\KlimBit`, branch **`feat/helix-modus`** (`8ff92a1`,
  niet gepusht en niet gemerged; let op: `main` van KlimBit is aan Vercel gekoppeld).
  Opnieuw bouwen: `npm run build:helix` in KlimBit, daarna de inhoud van `dist-helix/`
  naar `public/games/klimbit/v1/` kopiëren. Het bouwscript controleert zelf dat er geen
  Firebase in zit en alle paden onder `/games/klimbit/v1/` vallen.
- In de helix-modus staan Samen klimmen, de anonieme login en alle Realtime
  Database-records van het project `dvleerplatform` uit. Er gaat geen naam naar buiten.
- Berichtcontract en meetmethode: `docs/HELIX.md` in de KlimBit-repo.

## Grenzen tegen vervalsen (beslispunt voor Kevin)

In `src/lib/klimbitBeloning.js`, gespiegeld naar `functions/shared/`:

- `KLIMBIT_MAX_KLIMSNELHEID_MPS = 2.5` en `KLIMBIT_HOOGTE_MARGE_METER = 10`: de server
  erkent nooit meer dan duur × 2,5 + 10 m. Gemeten in KlimBit: snelste route 1,61 m/s
  gemiddeld, 1,68 m/s in het snelste venster van 30 s; 2,5 is 1,5 × die piek.
- `KLIMBIT_MAX_HOOGTE = 5000`: de route is eindeloos, dus dit is een vaste bovengrens
  (bij 1,6 m/s bijna een uur onafgebroken klimmen). **Voorlopige keuze, door Kevin te
  bevestigen.** Bij 5000 m is één run maximaal 300 + 4600 tokens.
- Wie de callable zelf aanroept en een poging lang open laat staan, krijgt erkend wat in
  die tijd fysiek haalbaar is. Elke poging staat met ingestuurde en erkende hoogte in
  `klimbitPogingen`, dus misbruik is terug te zien.

## Testen

| | Resultaat |
|---|---|
| `node --test src/lib/` | 1112 tests, alle groen |
| `functions`: `node --test` | 149 tests, alle groen |
| `npm run check:functions-shared` | in sync (20 bestanden) |
| `npm run build` | geslaagd, KlimBit (81 bestanden) zit in `dist/games/klimbit/v1/` |
| KlimBit-repo | 435 tests groen, lint, build en build:helix geslaagd |

Rendertest lokaal (dev-server, dev-login "Als leerling"): KlimBit staat op `/spellen`, het
echte spel laadt in het iframe zonder fouten van KlimBit zelf, "Begin de klim" start een
poging, "Klim beëindigen" toont het eindscherm. Opslaan gaf "Je klim kon niet worden
opgeslagen", zoals te verwachten zolang de functies niet uitgerold zijn.

## Handmatige test na de uitrol

1. Log in als **testleerling**, open `/spellen`: KlimBit staat erbij, ook zonder dat het
   spel voor de klas is aangezet. Het record staat op 0 m.
2. Start een klim, klim een stukje en klik **Klim beëindigen**: het uitslagpaneel toont de
   hoogte en het record, zonder foutmelding. In Firestore: `klimbitPogingen/{id}` staat op
   afgerond, `spelRecords/klimbit_{uid}` bestaat.
3. Tokens boven 400 m: het snelst via een poging die echt boven 400 m komt (ongeveer 4 tot
   5 minuten klimmen). Verwacht: "Eerste keer boven 400 m: 300 + X". Controleer
   `tokenAccounts`, de regel `earn_klimbit_{pogingId}` in `tokenTransactions` en dat
   `leerlingWeek` niet is opgehoogd.
4. Log in als **beheerder**: de knop Spellen staat in de balk, KlimBit is speelbaar, en het
   paneel zegt "Als beheerder speel je mee zonder tokens".
5. Toetsenbord: spatie en pijltjes bewegen de klimmer en scrollen de pagina niet. Test ook
   **Fullscreen spelen**.
6. Een tweede tabblad of herladen tijdens een poging: er gaat geen dubbele uitbetaling uit.

## Kleine punten, niet opgelost

- De spellenpagina zegt boven alle spellen "Deze spellen heeft je docent voor jouw klas
  klaargezet". Voor KlimBit (voor iedereen) klopt dat niet helemaal.
- De metadata toont "Speeltijd 10 min"; KlimBit heeft geen vaste speeltijd.
- Het iframe toont op een laag scherm een eigen scrollbalk.
- Aanraakbediening, Safari en Firefox zijn niet getest.
- Bij het eerste starten van een dev-server in deze worktree heeft Vite de cachemap
  `node_modules\.vite\deps` van de HELIX-hoofdmap geleegd (de worktree gebruikt een
  junction naar die `node_modules`). Alleen cache; de volgende `npm run dev` bouwt hem
  opnieuw op.

## Opruimen na het mergen

De worktree gebruikt **junctions** naar `node_modules` en `functions\node_modules` van de
hoofdmap. Verwijder die eerst los, anders kan een opruimcommando de echte `node_modules`
van de hoofdmap meenemen:

```powershell
cmd /c rmdir "C:\Projecten\helix-klimbit\node_modules"
cmd /c rmdir "C:\Projecten\helix-klimbit\functions\node_modules"
git -C "C:\Projecten\helix leerplatform" worktree remove "C:\Projecten\helix-klimbit"
```

`.env.local` in de worktree is een kopie uit de hoofdmap en wordt door git genegeerd.
