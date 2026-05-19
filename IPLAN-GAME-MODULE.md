# IMPLEMENTATIEPLAN - Game Module HELIX

## Summary

We voegen later een nieuwe admin-werkplek **Spellen** toe naast **Lesstof**, **Voortgang**, **Leerlingen** en **Beheer**. V1 is admin/docent-first: een zelfstandige plek om educatieve browsergames te beheren, bekijken en later te testen. De architectuur wordt voorbereid zodat dezelfde games later als 6e CMS-lesbloktype **Game / Gamification** in leerlingroutes kunnen worden ingevoegd.

## Huidige Structuur

- Adminnavigatie staat in `src/lib/adminWorkspaceNav.js`.
- De header rendert adminwerkplekken in `src/components/layout/AppShell.jsx`.
- Routes staan in `src/App.jsx`; adminroutes gebruiken `PrivateRoute requireAdmin`.
- CMS-lesbloktypes staan in `src/lib/contentBlockUtils.js`: `theory`, `example`, `question`, `media`, `summary`.
- CMS-lesblok UI en studio-flow zitten vooral in `src/components/cms/ContentBlockBuilder.jsx`.
- Contentblocks worden via `src/services/cmsService.js` opgeslagen in `contentBlocks`.
- Er is nog geen game registry, game player, game route of resultaatcontract.

## Voorgestelde Architectuur

- Maak later een statische `Game Registry` als eerste bron van waarheid, bijvoorbeeld `src/games/gameRegistry.js`.
- Houd registry-metadata volledig serialiseerbaar; React-componenten komen in een aparte component-map, bijvoorbeeld `src/games/gameComponents.js`.
- Voeg later een generieke `GamePlayer` wrapper toe die games kan draaien in `standalone` modus en later in `cmsBlock` modus.
- Voeg later een adminpagina `/admin/spellen` toe met placeholder-games en lokaal resultaat via callback.
- Tokenlogica wordt alleen voorbereid. De client/game mag nooit tokens toekennen of tokenbalans aanpassen.

## Datatypes / Interfaces

```ts
type GameStatus = 'planned' | 'prototype' | 'active';
type GameMode = 'standalone' | 'cmsBlock';

type GameRegistryItem = {
  gameId: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  level: string;
  learningGoals: string[];
  skills: string[];
  estimatedMinutes: number;
  route: string;
  componentKey: string;
  cmsEmbeddable: boolean;
  supportedModes: GameMode[];
  tokenRewardPotential: {
    min: number;
    max: number;
    basis: 'completion' | 'score' | 'accuracy' | 'score_accuracy_completion';
  };
  status: GameStatus;
};

type GamePlayerContext = {
  mode: GameMode;
  resultHandling: 'localOnly' | 'submitToBackend';
  studentId?: string;
  lessonId?: string;
  blockId?: string;
};

type GameResult = {
  attemptId: string;
  gameId: string;
  studentId?: string;
  lessonId?: string;
  blockId?: string;
  score: number;
  maxScore: number;
  accuracy: number;
  timeSpentSeconds: number;
  startedAt: string;
  completedAt: string;
  suggestedTokenReward: number;
};
```

## Belangrijke Contractregels

- `attemptId` is later nodig voor idempotency, anti-cheat en het voorkomen van dubbel claimen van tokenbeloningen.
- `startedAt` en `completedAt` maken speeltijdcontrole en sessievalidatie later mogelijk.
- In V1 is `GamePlayerContext.resultHandling` altijd `localOnly`.
- In GO 2A en GO 2B worden geen resultaten naar Firebase geschreven.
- `tokenRewardPotential` in de registry is alleen metadata.
- `suggestedTokenReward` in `GameResult` is alleen indicatief.
- Echte tokenuitgifte gebeurt later uitsluitend server-side via Cloud Function of backend-validatie.
- De client/game mag nooit zelf tokens toekennen of tokenbalans aanpassen.

## CMS-Uitbreiding Later

- Voeg later `game` toe als 6e type in `CONTENT_BLOCK_TYPES`.
- De CMS mag later alleen games tonen waarvan `supportedModes` `cmsBlock` bevat.
- Gameblok-content kan minimaal bestaan uit:

```ts
type GameContentBlockContent = {
  gameId: string;
  instructions: string;
  config: Record<string, unknown>;
  showResultSummary: boolean;
};
```

- Het gameblok rendert later dezelfde `GamePlayer`, maar dan met `mode: 'cmsBlock'`.

## Fasering En GO-Momenten

### GO 1: Planbestand

- Maak alleen het planbestand.
- Geen code, routes, packages, Firebase of UI-wijzigingen.

### GO 2A: Game Module Foundation

- Voeg navigatieknop **Spellen** toe.
- Voeg route `/admin/spellen` toe.
- Maak registry-structuur.
- Maak `GamePlayer` placeholder.
- Toon placeholder-games.
- Toon lokaal `GameResult` via callback.
- Geen echte game.
- Geen Firebase writes.
- Geen CMS-inbedding.

### GO 2B: Eerste Speelbare Game

- Bouw daarna pas een prototypegame, bijvoorbeeld **Pythagoras Trainer**.
- Game levert een volledig `GameResult` op.
- Resultaat blijft lokaal zichtbaar.
- Geen tokenwrites en geen backend-submit.

### GO 3: CMS Gameblok

- Voeg `game` toe aan contentblock utilities en CMS-builder.
- Gameblok kan een registry-game selecteren.
- Alleen games met `supportedModes` waarin `cmsBlock` voorkomt worden getoond.

### GO 4: Resultaten, Backend En Tokens

- Ontwerp server-side resultaatopslag.
- Voeg Cloud Function/backend-validatie toe.
- Server bepaalt tokenbeloning op basis van gevalideerde resultaten.

## Testplan Later

- Registry bevat alleen serialiseerbare metadata.
- `GamePlayer` werkt zonder Firebase.
- `GameResult` bevat `attemptId`, `startedAt` en `completedAt`.
- `resultHandling` staat in V1 op `localOnly`.
- Er vinden geen tokenwrites plaats.
- CMS-inbedding is nog niet actief in GO 2A.
- `/admin/spellen` markeert later de juiste headerknop actief.
- Build en gerichte lint draaien schoon na implementatie.

## Risico's

- Tokenbeloning is fraudegevoelig als de client direct mag schrijven; daarom blijft token-awarding server-side.
- Registry en componenten moeten gescheiden blijven om metadata herbruikbaar en serialiseerbaar te houden.
- CMS-inbedding kan scope vergroten door leerlingroute-rendering en voortgangsregistratie.
- Resultaatopslag vereist later duidelijke Firestore rules of Cloud Functions.
- Te veel gamification tegelijk kan de rustige HELIX UX verstoren; start klein.

## MVP-Scope

- GO 2A levert alleen de foundation: knop, route, registry, placeholder-player en lokale callback.
- GO 2B levert pas de eerste echte speelbare game.
- Geen Firebase-wijzigingen.
- Geen tokenuitgifte.
- Geen CMS-gameblok tot GO 3.

## Aangepast In Deze Revisie

- `GameResult` uitgebreid met `attemptId`, `startedAt` en `completedAt`.
- `GamePlayerContext` uitgebreid met `resultHandling`.
- `GameRegistryItem` uitgebreid met `learningGoals`, `skills` en `supportedModes`.
- Tokenlogica explicieter afgebakend als metadata/indicatief/client-read-only.
- GO 2 opgesplitst in GO 2A foundation en GO 2B eerste speelbare game.
- Testplan aangevuld met serialiseerbaarheid, Firebase-loos draaien, resultaatvelden, tokenwrites en CMS-scope.

## Klaar Voor GO 2A

Ja. Het plan is inhoudelijk klaar voor GO 2A zodra je expliciet toestemming geeft om de foundation te implementeren.
