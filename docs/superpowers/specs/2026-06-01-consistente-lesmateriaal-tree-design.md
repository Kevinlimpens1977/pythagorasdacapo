# Consistente lesmateriaal tree

Datum: 2026-06-01
Status: ontwerp, wacht op review

## Doel

De navigatie voor lesmateriaal moet overal hetzelfde mentale model gebruiken. Docenten zien nu bij aanmaken van lesmateriaal een tree, terwijl "Lesmateriaal klaarzetten" losse kaarten met emoji's toont. Daardoor is niet altijd zichtbaar welk vak, leerjaar of niveau gekozen wordt.

Deze wijziging maakt de CMS-tree en de klaarzet-tree consistent, rustiger en docentvriendelijker.

## Scope

In scope:

- Kleur- en emoji-keuze verwijderen uit het aanmaken van vak, leerjaar, niveau en hoofdstuk.
- Emoji's en kleuraccenten niet meer gebruiken als primaire navigatie in de CMS-tree.
- De linker navigatie in "Lesmateriaal klaarzetten" vervangen door een tree-opmaak die aansluit op de CMS-tree.
- Kunstmatige letterbadges zoals `B`, `J`, `GT` en `N` verwijderen als vaste prefix.
- Namen betrouwbaar tonen met de juiste velden: `name`, `label` en `title`.
- De bestaande klaarzetfunctionaliteit behouden: paragraaf selecteren, heel hoofdstuk aan/uit zetten, lesblokken selecteren, klasbreed en per leerling.

Niet in scope:

- Oude kleur- of emoji-velden verwijderen uit Firestore.
- Datamigraties uitvoeren.
- De inhoudsstructuur van vakken, leerjaren, niveaus, hoofdstukken of paragrafen wijzigen.
- De rechter klaarzetkolom functioneel herontwerpen.

## UX-richting

De tree gebruikt inspringing, pijltjes, typografie en subtiele selectie om de structuur duidelijk te maken. Er zijn geen emoji's nodig en er komen geen afkortingsbadges voor het type item.

Voorbeeld:

```text
Digitale Vaardigheden
  leerjaar 1
    VMBO-GT
      H1 Inleiding
      H2 Hoofdstuk 2
    VMBO
  leerjaar 2
testvak
```

Hoofdstukken mogen hun bestaande nummer in de titel blijven tonen als dat onderdeel is van de naam, bijvoorbeeld `H1 Inleiding`. De UI voegt geen extra `H1`-badge toe als aparte decoratie.

## CMS-tree

De bestaande tree bij lesmateriaal aanmaken blijft de hoofdreferentie, maar wordt opgeschoond:

- De badgekolom toont geen kunstmatige letters meer.
- Het tree-item toont primair de naam.
- De structuur blijft visueel duidelijk door inspringing en expand/collapse controls.
- Actieve selectie blijft zichtbaar met achtergrond, border of tekstgewicht.
- Acties zoals toevoegen, naam wijzigen en verwijderen blijven beschikbaar.

## Lesmateriaal klaarzetten

De huidige kaartnavigatie links wordt vervangen door een tree-achtige browser:

- De docent navigeert in dezelfde volgorde als in de CMS-tree.
- Vakken, leerjaren, niveaus en hoofdstukken zijn uitklapbaar.
- Paragrafen zijn selecteerbaar voor klaarzetten.
- Wanneer een hoofdstuk geselecteerd of opengeklapt is, blijft de bestaande bulkactie "Hoofdstuk aan/uit" beschikbaar.
- Lesblokselectie blijft zichtbaar onder een geselecteerde paragraaf, zoals nu.
- Rechts blijven de tabs "Klaargezet" en "Per leerling" bestaan.

De tree moet geen items met alleen een emoji of lege naam tonen. Fallbacks zijn tekstueel:

- Vak: `Vak zonder naam`
- Leerjaar: `Jaar {year}` of `Leerjaar`
- Niveau: `Niveau`
- Hoofdstuk: `Hoofdstuk zonder naam`
- Paragraaf: `Paragraaf zonder naam`

## Data en compatibiliteit

Bestaande documenten kunnen nog `color` en `emoji` bevatten. De UI negeert die velden in deze flows. Nieuwe content hoeft deze velden niet te vullen, maar services hoeven niet meteen databasevelden te verwijderen. Dat houdt de wijziging veilig en beperkt.

De naam-bug in "Lesmateriaal klaarzetten" komt waarschijnlijk doordat vakken met `name` opgeslagen worden, terwijl het scherm soms `naam` leest. De implementatie gebruikt consistente labelhelpers zodat oude en nieuwe data goed getoond worden.

## Componentrichting

Voorkeur:

- Hergebruik de bestaande tree-logica uit `buildCmsNavigationTree` waar dat praktisch is.
- Deel label- en fallbackfuncties waar mogelijk, zodat CMS en klaarzetten dezelfde namen tonen.
- Houd klaarzet-specifieke selectie apart van CMS-bewerkacties. In klaarzetten hoeft de tree geen create, rename of delete acties te tonen.

## Testaanpak

Minimaal:

- Unit tests voor labelhelpers of navigatiehelpers die `name`, `naam`, `label`, `title` en fallbackteksten afdekken.
- Een test of gerichte buildcheck voor de gewijzigde React-componenten.
- Handmatige browsercontrole van:
  - Nieuw vak aanmaken zonder kleur/emoji-sectie.
  - CMS-tree zonder letterbadges en emoji's.
  - Lesmateriaal klaarzetten met zichtbare namen voor vak, leerjaar, niveau, hoofdstuk en paragraaf.
  - Klasbreed en per leerling klaarzetten werkt nog.

## Openstaande beslissing

Geen. De gekozen richting is: geen emoji's, geen kleurkeuze en geen kunstmatige letterbadges in beide relevante trees.
