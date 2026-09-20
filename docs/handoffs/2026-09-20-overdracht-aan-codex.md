# Overdracht aan Codex, 20 september 2026

Deze sessie liep van 17 tot en met 20 september 2026 in Claude Code. Dit
document beschrijft wat er is gebeurd en wat er klaarligt, zodat Codex verder
kan zonder de chat te hebben gelezen. Wat blijvend geldt, staat in
`docs/HANDOFF.md`; dit bestand beschrijft alleen deze periode.

**Begin zo:**

```bash
git pull
node scripts/handoff-stand.mjs
```

Lees daarna `docs/HANDOFF.md`, paragraaf 2 tot en met 7. Paragraaf 6 is het
werklijstje en paragraaf 7 bevat de lijst met wat er los in de werkmap staat.

## 1. Wat er live is gegaan

### Nulmeting B, vraag 3 is een opzoekvraag (18 september)

Item `nulmeting-digitale-vaardigheden-b-03` vroeg naar "data" en "informatie".
Kevin wilde het antwoord in de vraag zetten, zodat het een opzoekvraag werd, en
iedereen die hem al had gemaakt goed rekenen.

- De vraagtekst begint nu met het antwoord, in de drie routeblokken en in de
  bron `docs/seeds/nulmeting-dv/nulmeting-b.json`.
- 57 leerlingen hadden hem fout; die staan nu goed. Itemrecord, blokstand en
  startprofiel zijn opnieuw berekend.
- Script: `scripts/nulmeting-b03-opzoekvraag.mjs` (dry run standaard).
  Back-up: `exports/reset-backups/nulmeting-b03-opzoekvraag-2026-09-18.json`.

### DV hoofdstuk 2 staat live (19 september)

`hoofdstuk-dv-klas1-h2`, "H2: Wat zit er in je device?", drie paragrafen en 16
blokken inclusief de presentatie in 2.1:

- 2.1 invoer, verwerking, opslag en uitvoer, met de keuken-vergelijking;
- 2.2 software en besturingssysteem;
- 2.3 het storingsplan in zes stappen.

Toegewezen aan H1B1, H1B2, H1K1 tot en met H1K3 en H1TL1 tot en met H1TL3.
**H1i1 niet**, op verzoek van Kevin; die klas houdt haar korte nulmeting.

- Bron: `docs/seeds/dv-h2-device.json`, eigen seed `dv-h2-device.seed.json`.
- Id-voorvoegsel `dv-klas1`, bewust anders dan het oude `dv-kb`, zodat een
  herimport van de grote gegenereerde DV-seed dit hoofdstuk niet overschrijft.
- Deck: gemaakt in NotebookLM, gecomprimeerd naar
  `sources/dv-jpeg/dv-h2-device.pdf` (2,3 MB, 15 dia's). Eén dia had een
  onleesbare regel; die is met de hand weggehaald.
- Controle: `controleer-hoofdstuk.mjs` gaf "alles in orde". Bestaande
  hoofdstukken en de 428 voortgangsrecords zijn niet veranderd.
- Back-up van de klassen: `exports/reset-backups/klassen-voor-dv-h1-2026-09-19.json`.

## 2. Wat er in de code is veranderd, nog niet gecommit

| Bestand | Waarom |
| --- | --- |
| `scripts/zet-klas-lesstof-klaar.mjs` | kan nu per klas één hoofdstuk toewijzen via `lesstofHoofdstukken`. Zonder dat filter zouden ook de lessen 1.1 tot en met 1.5 zichtbaar worden. Een volgend hoofdstuk voeg je toe aan de lijst `H2_EN_VERDER`. |
| `src/lib/contentReadiness.js` + test | een vraagblok met eigen invulvelden (`content.exercise`) is geldig zonder gekoppelde vraag. De leerlingroute toont zo'n blok gewoon; alleen de controle dacht van niet. Nog niet gedeployd, dus de CMS meldt tot die tijd "Koppel eerst een vraag" bij de plusopdracht van 2.1. |
| `.claude/skills/helix-hoofdstuk-bouwen/SKILL.md` + `references/slidedeck-designsysteem.md` | elk deck volgt voortaan het Helix Slide Design System, zowel als tweede bron in NotebookLM als in de prompt. |

Alle tests draaien groen (1025) en `npm run build` lukt.

## 3. Het curriculum digitale vaardigheden

Een onderzoek in vijf fasen, alles op papier. Er is niets van gebouwd behalve
hoofdstuk 2 hierboven. Alles staat in `docs/curriculum/`.

| Bestand | Inhoud |
| --- | --- |
| `dv-leerlijn-fase1-onderzoek.md` | SLO-status, de 45 vmbo-onderdelen, audit van het bestaande aanbod, analyse van de nulmeting, keuzekaart, beslisvragen |
| `dv-klas1-curriculum.json` | **de enige bron**: 22 lessen met leerdoelen, SLO-onderdelen en de rol per onderdeel |
| `dv-leerlijn-fase2-curriculum-klas1.md` | de lessen, de dekkingsmatrix, de controle op alle 45 onderdelen |
| `dv-scenarios.json` | 18 extra lessen (40-lessenscenario) en 16 vakmomenten (hybride) |
| `dv-leerlijn-fase3-scenarios.md` | zeven scenario's met cijfers, voor- en nadelen, beslispunten voor het MT |
| `dv-leerlijn-fase4-klas1-4.md` | lijn klas 1 tot 4, profielen, routines met docentkaarten, projecten, AI-ladder, toekomstscenario's |
| `rapport/rapport-dv-mt.md` + `bouw-rapport.py` | het MT-rapport en het bouwscript |
| `rapport/hoe-dit-rapport-gemaakt-is.md` | hoe het rapport tot stand kwam, met bronnen en een reproduceerbare opdracht |
| `genereer-fase2.mjs`, `genereer-fase3.mjs` | de generatoren voor alle tabellen |

**De werkwijze die je moet aanhouden.** De cijfers in alle documenten komen uit
de twee JSON-bestanden. Verander je een les of een vakmoment, draai dan:

```bash
node docs/curriculum/genereer-fase2.mjs <uit.md>
node docs/curriculum/genereer-fase3.mjs <uit.md>
python docs/curriculum/rapport/bouw-rapport.py
```

`genereer-fase2.mjs` stopt met een foutmelding als een SLO-onderdeel nergens
wordt geïntroduceerd. Dat is opzet: het curriculum mag niet stilletjes uit de
pas lopen met de tabellen.

Het rapport als PDF staat in `exports/curriculum/`, buiten git.

### Kevins besluiten over het curriculum

- 22 lessen in klas 1, binnen de DIF-uren (20 tot 24 beschikbaar).
- Alle 45 vmbo-onderdelen in klas 1; klas 2 krijgt dit jaar geen DV, volgend
  jaar wel een plan.
- Eén les is één HELIX-hoofdstuk met zijn paragrafen.
- Geen Office-lessen; software alleen als middel.
- Programmeren introduceren in klas 1, verdiepen in klas 2.
- AI: geen model trainen, wel een sorteerexperiment; generatieve AI als
  kennismaking; Copilot als socratisch studiemaatje; animatie met storyboard.
- Eén leerlijn voor alle niveaus; elke leerling ziet bij de start van een les
  zijn eigen score uit de nulmeting (nog te bouwen, fase 6).
- AI-ladder eerst in DV uitproberen, daarna voorstellen aan de school.
- Vier vakoverstijgende projecten, verdeeld over klas 2 en 3.

## 4. Wat als eerste klaarligt: testen als leerling

`docs/superpowers/specs/2026-09-20-testleerling-per-klas-design.md` is af en
wacht op Kevins review. Kern:

- negen testleerlingaccounts, één per klas, met `isTestaccount: true`;
- een callable `startTestleerlingSessie` die alleen voor zulke accounts een
  inlogtoken maakt, en alleen voor een admin;
- een beheerpagina "Testen" met per klas wat de leerling echt ziet, een
  startknop en de testdata;
- een balk tijdens het testen met "Terug naar beheer";
- filters op zes plekken zodat testaccounts nergens meetellen;
- één regel erbij in `firestore.rules`.

Twee open punten staan onderaan die spec. Na Kevins akkoord: eerst een
implementatieplan, dan pas bouwen.

## 5. Wat je moet weten voordat je iets aanraakt

- **Niets committen of pushen zonder dat Kevin het vraagt.** De werkmap staat
  daardoor vol; de lijst staat in `docs/HANDOFF.md`, paragraaf 7.
- **Hoofdstuk 1 van DV nooit verwijderen.** De nulmeting zit erin, met de
  resultaten van ruim honderd leerlingen.
- **Elk schrijvend script eerst zonder `--apply`.**
- **Leg de beginstand vast** voordat je aan Firestore komt, en vergelijk
  achteraf. Zo kun je aantonen dat je niets anders hebt geraakt.
- **De decks volgen het design system.** Zie
  `.claude/skills/helix-hoofdstuk-bouwen/references/slidedeck-designsysteem.md`.
  Het document zelf staat in `sources/designsysteem/`.
- **NotebookLM heet nu Gemini Notebook.** Bestanden uploaden lukt niet via
  automatisering (dat opent een Windows-venster); plak de bron als
  "Gekopieerde tekst". Loop AI-dia's altijd zelf na: het is beeld zonder
  tekstlaag, dus fouten zie je alleen met je ogen.

## 6. Terug naar Claude Code

Als Kevin later hier verdergaat, is dit bestand plus `docs/HANDOFF.md` genoeg
om de draad op te pakken. Houd ze daarom bij:

1. Werk `docs/HANDOFF.md` paragraaf 5 bij zodra je iets in Firestore, Storage
   of een skill verandert.
2. Werk paragraaf 6 bij: wat af is gaat eraf, wat je tegenkomt komt erbij.
3. Werk de lijst "Los in de werkmap" bij zodra je commit of iets nieuws
   achterlaat.
4. Schrijf een nieuw bestand in `docs/handoffs/` als een periode is afgerond,
   en noem het in het archief onderaan `docs/HANDOFF.md`.
