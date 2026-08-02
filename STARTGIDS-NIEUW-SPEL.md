# Startgids: nieuw spel bouwen in het HELIX leerplatform

> Lees dit document volledig voordat je een nieuw spel bouwt. Het beschrijft de architectuur,
> het verplichte contract tussen spel en platform, de tokenkoppeling en de complete checklist.
> Bron van waarheid voor projectbrede afspraken blijft `PROJECTKOMPAS-HELIX.md`.

## 1. Architectuur in het kort

Stack: Vite + React 19 (JSX, geen TypeScript), Tailwind 4 met HELIX design-tokens (CSS-variabelen),
Firebase (Auth, Firestore, Cloud Functions regio `europe-west1`, Hosting). Tests via `node:test`
(`*.test.js` naast de broncode), lint via ESLint.

Een spel bestaat uit drie lagen die bewust gescheiden zijn:

| Laag | Bestand(en) | Rol |
|---|---|---|
| Metadata (serialiseerbaar) | `src/lib/gameRegistry.js` → `GAME_REGISTRY` | Titel, vak, leerdoelen, route, `componentKey`, `tokenRewardPotential`, status |
| Component (speelbaar) | `src/games/<naam>/<Naam>Game.jsx` + logica | De eigenlijke game-UI en spellogica |
| Koppeling | `src/games/gameComponentKeys.js` + `src/games/GameComponentRenderer.jsx` | Vertaalt `componentKey` uit de registry naar de React-component |

De schil eromheen:

- `src/components/games/GamePlayer.jsx` — universele speler (header, fullscreen, resultaatkaart).
  Wordt gebruikt op `/admin/spellen` (variant `admin`, altijd lokaal) en in de leerlingles (variant `student`).
- `src/pages/AdminSpellenPage.jsx` — admin-werkplek: registry-overzicht, standalone testen én het
  paneel **Tokenbeloning** (tokens per spel instellen).
- `src/pages/StudentLessonPage.jsx` — leerlingroute. Het lesbloktype `game` rendert `GameBlock` →
  `GamePlayer`; bij afronden wordt voortgang opgeslagen en de tokenuitkering aangevraagd.
- `src/components/cms/ContentBlockBuilder.jsx` — docent kiest in het CMS een game uit
  `getCmsEmbeddableGames()` voor een game-lesblok.

## 2. Het verplichte spelcontract

Elke game-component krijgt exact twee props en houdt zich aan dit contract:

```jsx
export default function MijnNieuweGame({ onStart, onComplete }) {
  // 1. Roep bij de eerste speelactie aan:
  //    onStart(new Date().toISOString())
  // 2. Roep bij het einde van het spel PRECIES ÉÉN KEER aan:
  //    onComplete({
  //      score: 7,                                  // behaalde punten (number)
  //      maxScore: 10,                              // maximaal haalbaar (number, > 0!)
  //      startedAt: '2026-07-18T09:00:00.000Z',     // ISO-string van de start
  //      completedAt: new Date().toISOString(),
  //      details: { ... }                           // OPTIONEEL: compacte spelstatistieken
  //    })                                           // (bijv. per level); reist mee naar de
  //                                                 // voortgangsopslag, server negeert het
}
```

Belangrijk:

- `maxScore` moet groter dan 0 zijn: het platform berekent `accuracy = score / maxScore * 100`
  en die accuracy bepaalt (bij basis `score_accuracy_completion`) hoeveel tokens de leerling krijgt.
- Het spel schrijft **zelf nooit** naar Firestore en kent **zelf nooit** tokens toe.
  Alles loopt via `GamePlayer` → `StudentLessonPage` → Cloud Function.
- Geen externe assets/CDN's; alles lokaal. Houd een spel speelbaar in ± 5-6 minuten.
- Splits pure spellogica af in een eigen module met tests, naast de component:
  `src/games/<naam>/<naam>Logic.js` + `<naam>Logic.test.js` naast `<Naam>Game.jsx`.

## 3. Hoe de tokenkoppeling werkt (end-to-end)

1. Leerling speelt het spel uit in een les → `onComplete({score, maxScore, ...})`.
2. `GamePlayer` maakt via `createLocalGameResult()` (in `gameRegistry.js`) een resultaat met
   `accuracy`, `timeSpentSeconds` en `suggestedTokenReward`, en roept `onResult` aan.
3. `StudentLessonPage.saveBlockProgress()` slaat voortgang op (`voortgangService`) en bouwt met
   `buildTokenAwardPayload()` (`src/lib/tokenAwardUtils.js`) een payload met `sourceKind: 'game'`.
4. Cloud Function `awardTokensForActivity` (`functions/index.js`, callable, `europe-west1`):
   - alleen voor rol `student`;
   - bepaalt het bedrag via `getAwardAmountForGame`: eerst Firestore-doc
     `tokenGameRewardRules/{gameId}`, anders `DEFAULT_GAME_TOKEN_REWARD_RULES` in code, anders 0;
   - basis `score_accuracy_completion`: `max × accuracy%` (geklemd tussen min en max);
     basis `completion`: altijd `max`;
   - idempotent via `tokenAwardClaims`: **1x per leerling per game per lesblokversie**
     (claim-id = `uid_game_gameId_blokversie`). Opnieuw spelen levert niets extra op;
     een nieuw gepubliceerde blokversie maakt opnieuw verdienen mogelijk;
   - schrijft transactioneel: `tokenAccounts` (saldo), `tokenTransactions` (grootboek), claim.
5. De leerling ziet de toast "+X tokens verdiend"; saldo in de header (`TokenBalancePill`) is live.

Standalone spelen op `/admin/spellen` blijft bewust `LOCAL_ONLY`: niets naar Firebase, geen tokens.

### Tokens per spel instellen

- **UI (aanrader):** `/admin/spellen` → spel selecteren → paneel **Tokenbeloning** →
  actief/min/max/berekening → "Tokenregel opslaan". Dit schrijft naar `tokenGameRewardRules/{gameId}`
  (admin-only via `firestore.rules`). "Herstel standaard" verwijdert de eigen regel.
- **Code-defaults:** `DEFAULT_GAME_TOKEN_REWARD_RULES` in `functions/index.js`. Houd de spiegel
  `SERVER_DEFAULT_GAME_REWARD_RULES` in `src/lib/gameTokenRewardRules.js` gelijk!
- Richtlijn economie: ± 200 tokens per gewone les totaal; een gewoon spel 0-10, een
  checkpoint/boss/finale-spel 0-20, een grote trainer hooguit 25.
- Zonder regel (UI of default) keert een spel **0 tokens** uit.

## 4. Checklist: nieuw spel toevoegen

Werk in deze volgorde; na elke stap moet lint/tests groen zijn.

1. **Spellogica** — maak `src/games/<naam>/<naam>Logic.js` met pure functies
   (rondes/opdrachten-data, `evaluate...`, `calculate...Score`) en `<naam>Logic.test.js`
   (node:test + `assert/strict`). Geen React in dit bestand.
2. **Component** — maak `src/games/<naam>/<Naam>Game.jsx` volgens het contract uit §2:
   startscherm met doel in 1-2 zinnen, speelrondes met directe feedback, eindscherm met score,
   en een `isFinished`-guard zodat `onComplete` maar één keer vuurt.
3. **componentKey** — voeg toe in `src/games/gameComponentKeys.js` aan `GAME_COMPONENT_KEYS`
   (de key komt daarmee automatisch in `PLAYABLE_GAME_COMPONENT_KEYS`).
4. **Renderer** — voeg een branch toe in `src/games/GameComponentRenderer.jsx`.
5. **Registry** — voeg in `src/lib/gameRegistry.js` een volledig registry-object toe aan
   `GAME_REGISTRY` (het voorbeeldsjabloon staat als commentaar boven de lege array) met
   realistische `tokenRewardPotential` (`min`, `max`, `basis`).
6. **Tokenregel** — kies één van:
   a. default in `functions/index.js` (`DEFAULT_GAME_TOKEN_REWARD_RULES`) + spiegel in
      `src/lib/gameTokenRewardRules.js` (vereist functions-deploy), of
   b. alleen via de UI op `/admin/spellen` instellen (geen deploy van functions nodig).
7. **Tests draaien** — `node --test src/games/<naam>/ src/lib/gameRegistry.test.js` en
   `npx eslint src/games src/lib/gameRegistry.js`.
8. **Admin-test** — start de dev-server, ga naar `/admin/spellen`, speel het spel volledig uit
   (ook fullscreen) en controleer de resultaatkaart (score, accuracy).
9. **CMS-blok** — in `/admin/cms`: maak in de juiste paragraaf een lesblok van type `game`,
   kies je spel, schrijf een korte instructie, publiceer, en geef het blok vrij voor de klas.
10. **Leerling-test** — log in als testleerling, open de les, speel uit en controleer:
    toast "+X tokens verdiend", saldo omhoog, transactie zichtbaar (admin: `/admin/tokenbeheer`).
    Tweede keer spelen: géén extra tokens (claim bestaat al) — dat is correct gedrag.
11. **Deploy** — `npm run build` + `firebase deploy --only hosting`. Alleen nodig bij wijziging:
    `firebase deploy --only firestore:rules` (rules) en `firebase deploy --only functions` (defaults).

## 5. Huisstijl en UI-conventies

- Gebruik de HELIX-klassen en CSS-variabelen uit `src/index.css`:
  `helix-page`, `helix-container`, `helix-surface`, `helix-card`, `helix-eyebrow`,
  `helix-heading-xl/lg`, `helix-muted`, `helix-badge(-success/-warning)`, `helix-alert`,
  `btn-primary`, `btn-secondary`, `input-standard`.
- Kleuren altijd via variabelen: `var(--helix-navy)`, `var(--helix-purple)`, `var(--helix-pink)`,
  `var(--helix-muted)`, `var(--helix-border)`, `var(--helix-soft-lavender)`,
  `var(--helix-surface-soft)`, radius via `var(--helix-radius-md/lg)`.
- Iconen uit `lucide-react`. Teksten in het Nederlands, gericht op VMBO leerjaar 1:
  korte zinnen, directe aanspreekvorm ("Kies...", "Sleep...").
- Toon na afloop altijd een duidelijk eindscherm met score en een positieve boodschap;
  het platform toont daarnaast zelf de groene "Game afgerond!"-kaart en de token-toast.
- Een spel moet zonder uitleg speelbaar zijn: eerste scherm bevat het doel in 1-2 zinnen.

## 6. Valkuilen

- **`maxScore: 0`** → accuracy 0 → bij accuracy-basis 0 tokens. Zet altijd een echte maxScore.
- **`onComplete` meermaals aanroepen** → meerdere resultaten; guard met een `isFinished`-state.
- **componentKey vergeten in renderer of keys-bestand** → leerling ziet "Deze game is nog in
  ontwikkeling", admin ziet de placeholder-player.
- **Spiegel vergeten** — pas je `DEFAULT_GAME_TOKEN_REWARD_RULES` (server) aan, werk dan ook
  `SERVER_DEFAULT_GAME_REWARD_RULES` (client) bij, anders toont de admin-UI verkeerde bedragen.
- **Tokens testen als admin** — kan niet: `awardTokensForActivity` weigert alles behalve rol
  `student`. Gebruik een testleerling-account.
- **Firestore-writes vanuit het spel** — nooit doen. Het spel is een pure component;
  de schil regelt opslag en tokens.
- **Datum/registry-drift** — `GAME_REGISTRY`-items moeten JSON-serialiseerbaar blijven
  (`isSerializableGameRegistryItem`); geen functies of componenten in registry-objecten.

## 7. Relevante bestanden in één oogopslag

```
src/lib/gameRegistry.js                  registry + createLocalGameResult + tokenpotentie
src/lib/gameTokenRewardRules.js          effectieve tokenregel + spiegel serverdefaults
src/lib/tokenAwardUtils.js               payload-bouwer voor awardTokensForActivity
src/games/gameComponentKeys.js           componentKey → speelbaar
src/games/GameComponentRenderer.jsx      componentKey → React-component
src/games/<naam>/...                     jouw spel (component + logica + tests)
src/components/games/GamePlayer.jsx      universele speler-schil
src/pages/AdminSpellenPage.jsx           admin-werkplek + paneel Tokenbeloning
src/pages/StudentLessonPage.jsx          GameBlock + saveBlockProgress (tokenaanvraag)
src/services/tokenService.js             client-API tokens (subscribe/save/award/shop)
functions/index.js                       awardTokensForActivity + DEFAULT_GAME_TOKEN_REWARD_RULES
firestore.rules                          tokenGameRewardRules = admin-only
```
