# Implementatieplan Slidedeckcreator + NotebookLM Workflow

## Summary
Voeg onder **Lesstof** een hybride **Slidedeckcreator** toe waarmee docenten NotebookLM-pakketten maken: een bron-PDF, een kopieerbare prompt-snapshot en later een geüploade NotebookLM-presentatie-PDF. De presentatie-PDF wordt opgeslagen in Firebase Storage en kan daarna via een apart CMS-lesbloktype **Slidedeck** in een lesroute worden geplaatst.

## Key Changes
- Maak een nieuwe adminroute `/admin/slidedecks` onder Lesstof, met ingang vanaf `AdminLesstofPage`.
- Voeg een fullscreen Slidedeckcreator-formulier toe met titel, optionele CMS-koppeling, leerdoelen, brontekst, afbeeldingsuploads en klembord-plakken.
- Voeg een promptbibliotheek toe:
  - templates met naam, omschrijving, prompttekst, actief/gearchiveerd en standaardtemplate;
  - `+ Prompttemplate` om eigen prompts toe te voegen;
  - per slidedeckpakket wordt altijd een prompt-snapshot opgeslagen.
- Genereer in V1 de bron-PDF client-side in de browser en upload PDF plus afbeeldingen naar Firebase Storage.
- Voeg overzichtstabel toe met datum, onderwerp, context, prompt kopiëren, bron-PDF downloaden en NotebookLM PDF uploaden.
- Voeg CMS-lesbloktype **Slidedeck** toe naast Theorie, Voorbeeld, Vraag, Media, Samenvatting en Game.
- Slidedeck-lesblok verwijst naar een bestaand slidedeckpakket met `generatedDeckPdf`; alleen pakketten met geüploade NotebookLM-PDF zijn selecteerbaar.
- Digibord en leerlingroute tonen het Slidedeck-lesblok als PDF-slide-presenter, met eenvoudige PDF-weergave binnen Helix.

## Data / Interfaces
- Nieuwe Firestore-collectie `slidedeckPackages`:
  - `title`, `learningGoals`, `sourceText`, `linkedContext`, `promptTemplateId`, `promptSnapshot`, `sourcePdf`, `generatedDeckPdf`, `status`, `createdBy`, `createdAt`, `updatedAt`.
- Nieuwe Firestore-collectie `promptTemplates`:
  - `name`, `description`, `body`, `isDefault`, `status`, `createdBy`, `createdAt`, `updatedAt`.
- Firebase Storage paden:
  - `slidedecks/{packageId}/source.pdf`
  - `slidedecks/{packageId}/generated-deck.pdf`
  - `slidedecks/{packageId}/assets/{assetId}`
- Nieuw contentblocktype:
  - `type: 'slidedeck'`
  - `content: { slidedeckPackageId, deckTitle, generatedDeckUrl, sourcePdfUrl? }`
- Firestore/Storage rules moeten admin-read/write voor `slidedeckPackages`, `promptTemplates` en `slidedecks/**` toestaan.

## Implementation Plan
- Bouw eerst services/helpers voor prompttemplates, slidedeckpackages, Storage uploads en PDF-generatie.
- Voeg daarna `/admin/slidedecks` toe met formulier, prompt-popup, image upload/paste en overzichtstabel.
- Breid `AdminLesstofPage` uit met kaart **Slidedecks / NotebookLM-bestanden**.
- Breid `contentBlockUtils`, `ContentBlockBuilder`, `NavigationTree` en CMS-statussen uit met `slidedeck`.
- Maak in de CMS-studio voor Slidedeck een selector voor bestaande pakketten met geüploade NotebookLM-PDF.
- Breid Digibord/leerlingpresentatie uit zodat `slidedeck` contentblocks een PDF-presenter tonen.
- Houd Media apart voor losse afbeeldingen, YouTube, externe links en algemene documenten; Slidedeck is specifiek voor presentatie-PDF's.

## Test Plan
- Prompttemplate aanmaken, kiezen, tijdelijk aanpassen en als snapshot bewaren.
- Slidedeckpakket maken met titel, leerdoelen, tekst en geplakte/geüploade afbeeldingen.
- Bron-PDF genereren, uploaden naar Firebase Storage en downloaden vanuit tabel.
- Promptknop kopieert exact de opgeslagen prompt-snapshot.
- NotebookLM gegenereerde PDF uploaden bij dezelfde rij en status verandert naar `deckUploaded`.
- CMS-lesroute kan Slidedeck-lesblok toevoegen en alleen pakketten met `generatedDeckPdf` kiezen.
- Leerlingroute en Digibord tonen Slidedeck-PDF zonder "slides niet gevonden".
- Build, gerichte lint en tests voor PDF-helper, prompt/slidedeck service en contentblocktype draaien schoon.

## Assumptions
- V1 automatiseert NotebookLM zelf niet; docent uploadt handmatig de door NotebookLM gemaakte PDF terug in Helix.
- PDF-bestanden worden niet als binary in Firestore opgeslagen; Firestore bewaart metadata en Storage bewaart bestanden.
- Slidedeckcreator start als eenvoudig formulier, geen blokken-editor.
- Slidedeck-lesblokken zijn herbruikbare routeplaatsingen die verwijzen naar één slidedeckpakket.
