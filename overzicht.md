# HELIX - Product Requirements Document (PRD)

*Oorspronkelijk project: "Stelling van Pythagoras"*

## 1. Introductie & Filosofie
HELIX is een complete, didactische leeromgeving en presentatieplatform. Wat begon als een specifieke applicatie voor de stelling van Pythagoras, is geëvolueerd naar een modulair systeem waarbinnen studenten theorie kunnen leren, opgaven kunnen maken en docenten via een geïntegreerd CMS de inhoud kunnen beheren.

**Kernfilosofie:**
- **Minimalistisch & Modern:** Een frisse 'light mode' interface die rust uitstraalt, zonder overbodige visuele ruis.
- **Pedagogisch Verantwoord:** Lesmateriaal wordt stapsgewijs aangeboden (Hybrid Dual-Presentation Mode). De theorie wordt direct gekoppeld aan interactieve opdrachten en een AI-tutor.
- **Gamification & Motivatie:** Leren moet leuk zijn en beloond worden. Door middel van een eigen digitaal ecosysteem met beloningen, worden leerlingen gestimuleerd om meer en beter te oefenen.
- **Extreme Schaalbaarheid:** Het platform is vanaf de basis ontworpen om robuust en eenvoudig op te schalen. Het toevoegen van nieuwe vakken, hoofdstukken of klassen moet naadloos en zonder grote codewijzigingen kunnen verlopen.
- **Veilig & Beheersbaar:** Strikte scheiding tussen studenten en docenten/admins. Het platform garandeert data-integriteit via Firebase, waarbij destructieve acties en complexe configuraties altijd bewust en handmatig door de beheerder (docent) worden goedgekeurd.

## 2. Technische Architectuur & Stack
- **Frontend:** React 19, Vite (v8), Tailwind CSS v4, React Router.
- **Backend & Database:** Firebase (Authentication, Firestore, Cloud Functions v2).
- **Rich Text / Content:** Tiptap editor (voor het CMS en opgaven).
- **PDF Integratie:** PDF.js (voor de Hybrid Dual-Presentation mode).
- **AI Integratie:** OpenRouter / Gemini API via beveiligde Firebase Cloud Functions (voor de `AITutorChat` en content generatie).
- **Schaalbare Datastructuur:** Flexibele inrichting voor hiërarchische content (Vakken -> Hoofdstukken -> Paragrafen -> Opgaven) en uitgebreide gebruiker-attributen (waaronder klassenselectie, resultaten per vak en de token-ledger).
- **Werkwijze:** Gebaseerd op de *DaCapo Tools Canonical Standards*, waaronder strikte scheiding van Cloud Functions, Lazy Initialization patronen, en modulaire state-management.

## 3. Reeds Gebouwde Features (Huidige Status)
Tot dusver is de fundering van het platform gebouwd en zijn de primaire workflows operationeel:

*   **Authenticatie & Autorisatie:** 
    *   Google Authentication integratie.
    *   Rollen-gebaseerd systeem (Admins vs. Leerlingen) met bijbehorende Firestore structuur.
*   **Content Management System (CMS):**
    *   `CmsShell` en `CreateContentModal` waarmee docenten lesstof kunnen structureren en aanmaken.
    *   Ondersteuning voor Rich Text editing via Tiptap.
*   **Studenten Dashboard (`TableOfContents`):**
    *   Dynamisch overzicht van actieve en gelockte hoofdstukken en paragrafen.
    *   Visuele voortgangsindicatoren (progress bars, 'completed' vs 'available' status).
*   **Digibord & Slides Systeem:**
    *   Dynamische React-gebaseerde presentatieslides (`WelcomeSlide`, `TheorySlide`, `PythagorasProofSlide`, `DemoSlide`).
    *   Fase 1 van de PDF integratie (Hybrid Dual-Presentation mode).
*   **AI Integratie:**
    *   `AITutorChat` interface voor leerlingen om gerichte hulp te vragen zonder direct het antwoord te krijgen.
    *   Backend logica om prompts veilig te serveren.
*   **Rebranding voltooid:**
    *   Naamswijziging van "Stelling van Pythagoras" naar **HELIX** over de hele linie.

## 4. Roadmap & Nog te implementeren Features
Om HELIX volledig productie-klaar te maken voor grootschalig klaslokaal gebruik (en als schaalbaar platform voor elk denkbaar vak), moeten de volgende functionaliteiten nog worden ontwikkeld:

*   **Student Profielpagina:**
    *   Een specifieke UI-pagina waar de leerling de eigen voornaam en achternaam ziet.
    *   **Klas Selectie:** Leerlingen kunnen hun klas kiezen uit een vooraf gedefinieerde, door de administrator aangemaakte lijst.
    *   **Vakken & Resultaten:** Een helder dashboard dat toont aan welke vakken de leerling heeft gewerkt en welke resultaten (voortgang/scores) per vak behaald zijn.
*   **DaCapo Token Economie ($DaCapo):**
    *   Leerlingen verdienen `$DaCapo` (DaCapo lestokens) tijdens het werken aan opdrachten of het spelen van educatieve minigames tussendoor.
    *   Het actuele saldo van de gespaarde tokens is prominent zichtbaar op de Profielpagina.
*   **Digitale Avatar Shop (Gamification Module):**
    *   Een in-app 'winkel' waar leerlingen hun gespaarde `$DaCapo` tokens kunnen spenderen.
    *   Startaanbod: circa 10 avatars (5 mannelijke, 5 vrouwelijke).
    *   Uitbreidingen: cosmetische extra's (features) om de avatar of het profiel mee aan te kleden. Denk aan een hoed, een toverstaf, exclusieve profiel-backgrounds of andere 'hebbedingetjes'.
    *   *Doel:* Maximale stimulans van extrinsieke motivatie, leergierigheid en prestatiemotivatie.
*   **Volledig Schaalbare Content Architectuur:**
    *   Het CMS en de databasestructuur moeten de abstractielaag "Vakken" feilloos integreren (Vak -> Hoofdstuk -> Paragraaf), zodat HELIX direct inzetbaar is voor alles van Wiskunde tot Geschiedenis.
*   **Toetsing (Oefentoets & Eindtoets):**
    *   Achterliggende logica (tijdsregistratie, automatische nakijk-algoritmes, definitieve scores opslaan) toevoegen aan de momenteel gelockte UI-elementen.
*   **Docenten Dashboard & Analytics:**
    *   Een "DaCapo-stijl" klas-dashboard waar de docent realtime voortgang, klas-gemiddelden, actieve vakken en knelpunten kan inzien.
*   **PDF Integratie Fase 2 & 3:**
    *   Uitbreiden van de PDF module met annotaties, in-slide vragen en direct gekoppelde evaluatie.

## 5. Ontwikkelingsrichtlijnen & Best Practices
Voor de ontwikkelaar die dit project oppakt, gelden strikte regels om de integriteit van HELIX te waarborgen:

1.  **Geen automatische grote refactors:** Veranderingen aan routing of de kernarchitectuur (vooral bij de overgang naar multi-vak schaalbaarheid) vereisen altijd overleg en een incrementele aanpak.
2.  **Firestore Security:** Beveiligingsregels worden uitsluitend via tekst voorgesteld, maar **nooit** geautomatiseerd gedeployed door AI of scripts.
3.  **Destructieve acties:** Geen massale verwijdering van documenten of database resets zonder expliciete toestemming van de hoofdbeheerder.
4.  **Lokale Commando's:** Normale build/dev workflows (`npm run dev`, `npm run build`, linting) kunnen veilig en geautomatiseerd uitgevoerd worden.
5.  **Hergebruik van componenten:** Controleer altijd of een UI patroon of utility functie al bestaat voordat je nieuwe logica schrijft.
