# Assessment Block Editor Design

## Doel
Maak quiz- en toetsblokken in de CMS bewerkbaar zonder losse legacy `vraag`-documenten aan te maken. Een quiz/toets blijft een zelfstandig contentBlock met `content.items`.

## Scope
- Ondersteun `quiz` en `toets` in `ContentBlockBuilder.jsx`.
- Bewerk bloktitel, status, instructietekst, poginginstellingen, itemlijst en tokens.
- Ondersteun itemtypes `waar-niet-waar`, `meerkeuze` en `open`, passend bij de huidige seed en leerlingweergave.
- Per item: prompt, opties, correct antwoord, feedback en tokens.
- Voeg items toe, dupliceer items, verwijder items en verplaats items omhoog/omlaag.
- Toon tokencontrole: som van itemtokens versus bloktotaal.
- Bewaar in hetzelfde contentBlock-schema zodat bestaande lesroutes en imports blijven werken.

## Buiten Scope
- Geen migratie naar de `vraag`-collectie.
- Geen hotspot/drag-and-drop editor in deze stap.
- Geen volledige leerling-interactie/score-engine; leerlingweergave mag de bestaande eenvoudige lijst blijven gebruiken.

## Architectuur
Nieuwe helperfuncties komen in `src/lib/assessmentBlockUtils.js`, zodat normalisatie, tokenberekening en itemmutaties testbaar blijven buiten React. `ContentBlockBuilder.jsx` krijgt een eigen `AssessmentStudioFields` UI voor `quiz` en `toets`.

## Acceptatie
- Een admin kan een quiz/toetsblok openen en alle items inhoudelijk aanpassen.
- Nieuwe items krijgen stabiele ids, default opties en tokenwaarde.
- Lege/kapotte itemdata wordt genormaliseerd naar bruikbare velden.
- Tests dekken helpergedrag.
- Build en gerichte lint/test slagen.
