# Explainervideo's per hoofdstuk: de skill explainer-helix-maker

Gebouwd op 2 oktober 2026; de H2-video is gerenderd, plaatsing wacht op Kevin.
(Ontwerp van 2 oktober 2026; waar de bouw afwijkt, zie §18.)
De eerste run is Binask EOA hoofdstuk 2: massa, volume, onderdompelmethode en
dichtheid.

## 1. Waarom

Kevin wil per hoofdstuk een korte, geanimeerde uitlegvideo in het Nederlands.
De video volgt de lesstof die in HELIX staat en de stijl van het
HELIX-designsysteem. Hij moet herhaalbaar zijn: elk hoofdstuk dezelfde
docentenstem, hetzelfde beeld, dezelfde ondertitels en dezelfde aanpak. Daarom
komt er een skill, `/explainer-helix-maker`, met een vaste pijplijn eronder.

De doelgroep is EOA: nieuwkomers die Nederlands leren. Dat bepaalt het tempo,
de taal (A2/B1) en de ondertitels.

## 2. Besluiten van Kevin (2 oktober 2026)

| Vraag | Besluit |
| --- | --- |
| Hoe kijken leerlingen | zelfstandig in HELIX, met pauzeren en terugspoelen |
| Beeldstijl | 3D-comicbeelden plus getekende lijnen voor metingen en formules |
| Stemmen | een docent en een leerling (Sami) |
| Vaste docentenstem | Thomas, ElevenLabs `fIYdULbypRf7uZYX6u0T` |
| Vaste leerlingstem | Mette, ElevenLabs `L8qZJEV989Y3D0xnaVCa`; Sami is een meisje |
| Stemmodel | `eleven_v4` via de ElevenLabs-MCP |
| Ondertitels | los spoor (.vtt), aan en uit te zetten, later te vertalen |
| Rol van Blender | het comic-deel: 3D-scènes met cel-shading en zwarte contouren |
| Sami in beeld | AI-portret in het 3D-comicrecept, niet in 3D |
| Eenheid | één video per hoofdstuk, maximaal 3:00 |
| Plek in HELIX | direct vóór de Samenvatting van de herhalingsparagraaf (H2: 2.4 Herhalingsopdrachten); zie paragraaf 12 voor de regel |
| Gereedschap | Remotion-project in `video/` in de repo |
| Draaiboek H2 | goedgekeurd zoals in paragraaf 9 |
| Stijlbeeld | goedgekeurd: geel titelvak, crème canvas, beeld links, getekend midden, kernwoorden rechts |

## 3. Aanpak in het kort

1. Lesstof van het hoofdstuk uit Firestore lezen.
2. Draaiboek schrijven en de doelparagraaf voorstellen. Kevin keurt beide goed.
3. Kosten bij ElevenLabs opvragen. Kevin keurt het goed.
4. Stemmen opnemen met ElevenLabs, per regel.
5. Comic-shots renderen in Blender.
6. Alles samenvoegen in Remotion: getekende lijnen, HELIX-titelvak, audio.
7. MP4, poster en ondertitels renderen. Controleren. Kevin bekijkt de video.
8. Uploaden en het media-blok vóór de Samenvatting zetten. Eerst als dry run.
9. Controleren als testleerling van de klas.

## 4. Mappen en bestanden

```
video/                                  eigen package.json (Remotion)
  helix-explainer.config.json           vaste stemmen, model, tokens, fonts
  src/                                  Remotion-compositie en onderdelen
  scripts/
    lees-hoofdstuk.mjs                  Firestore -> lesstof.json
    neem-stemmen-op.mjs                 hulp bij downloaden en timing.json
    maak-ondertitels.mjs                draaiboek + timing -> .vtt
  blender/
    bouw-lab.py                         bouwt de labbibliotheek als code (geen binaire .blend in git)
    renderrecept.py                     licht, toon-shader, Freestyle, camera
    shots/<hoofdstuk>/<shot>.py         één script per shot
  public/sami/                          vaste portretten van Sami (4 uitdrukkingen)
  public/hoofdstukken/<hoofdstukId>/    Remotion leest alleen uit public/
    lesstof.json                        in git
    draaiboek.json                      in git
    timing.json                         in git
    audio/<regelId>.mp3                 buiten git
    shots/<shot>/####.png               buiten git

exports/video/<hoofdstukId>/            buiten git, het eindresultaat
  explainer.mp4
  poster.png
  ondertitels.nl.vtt

scripts/plaats-explainer-video.mjs      upload en plaatsing in HELIX
.claude/skills/explainer-helix-maker/   de skill
```

`video` komt in `globalIgnores` van `eslint.config.js`. In `src/index.css` komt
`@source not "../video";`, zodat Tailwind die map niet scant. `exports/` staat
al buiten git.

## 5. Vaste stijl

Bron: `sources/designsysteem/Helix_Slide_Design_System_v2.pdf` en de tekst
daarvan in `designsysteem-tekst.txt`.

- Canvas 1920 × 1080, 30 fps.
- Paper `#FFF7E8` als achtergrond. Ink `#0B0D0F` voor lijnen en tekst.
- Geel titelvak `#FFD33D` bovenaan, 124 px hoog, met een zwarte onderrand van
  8 px. Links het fasekenmerk (KIJK, CHECK, KLAAR). Daarnaast de kop in
  Bangers, hooguit zes woorden, in hoofdletters. Rechts "Binask H2" als
  metadata.
- Twee functionele accenten: blauw `#087EB5` voor metingen en formules, groen
  `#2E9D63` alleen voor het juiste antwoord bij CHECK en voor KLAAR.
- Beeldinhoud mag rijker kleuren, zoals lichtblauw water.
- Twee lettertypen: Bangers voor koppen, Atkinson Hyperlegible Next voor de
  rest. Beide via `@remotion/google-fonts`.
- Indelingen: FOCUS (één groot beeld), SPLIT (beeld links, kernwoordenkaart
  rechts), STATUS (CHECK en KLAAR).
- De onderste 15% (vanaf y = 884) blijft vrij voor de ondertitels van de
  speler.
- Spreekt Sami, dan staat er een zwart naamlabel met haar portret. Bij de
  docent staat er geen label.
- Beweging: de beelden zoomen langzaam in, getekende onderdelen schuiven rustig
  in beeld, water stijgt in ongeveer 1,5 s, het schermpje van de weegschaal
  telt op. Geen explosies en geen snelheidslijnen.
- Geluid: geen muziek. Eén zacht plonsje bij de onderdompelmethode.

## 6. Stemmen en ondertitels

- Model `eleven_v4`. Stemmen vast in `helix-explainer.config.json`.
- Eén opname per regel, met `generations_count: 1`. Een slechte regel wordt
  los opnieuw opgenomen.
- Elke regel heeft twee teksten:
  - `tekst`: wat in de ondertitel staat ("106,8", "cm³", "ρ").
  - `uitspraak`: wat de stem zegt ("honderdzes komma acht", "kubieke
    centimeter", "rho").
- Geen "BiNaSk" in de gesproken tekst, want de uitspraak is onzeker. Gebruik
  "in de les".
- Tempo: rustig. Tussen twee regels 0,4 tot 0,8 s stilte.
- De duur van elke regel komt uit ffprobe en wordt `timing.json`.
- Ondertitels:
  - WebVTT, één cue per regel. Is een regel langer, dan wordt hij gesplitst.
  - Hooguit 2 regels van 42 tekens.
  - Spreker als voice-tag: `<v Docent>` en `<v Sami>`.
  - Bestand: `ondertitels.nl.vtt`.

## 7. Comic-deel in Blender

- Blender 5.2 staat op de machine. Het renderen loopt zonder scherm vanuit de
  opdrachtregel:
  `blender -b -P video/blender/shots/<hoofdstuk>/<shot>.py`.
  - Elk shotscript laadt eerst `bouw-lab.py` en `renderrecept.py`.
  - De bibliotheek is dus code. Een gebouwde `lab.blend` mag als cache in
    `exports/video/` staan, buiten git.
- De Blender-MCP (`blender-lab`, poort 9876) dient om tijdens het ontwerpen
  live mee te kijken. De add-on moet dan aan staan. Voor het renderen is hij
  niet nodig.
- Het renderrecept (designsysteem p.14):
  - semi-realistische 3D-comic
  - cel-shading
  - zwarte contouren met een omgekeerde schil (Solidify met omgedraaide
    normalen en een zwart materiaal met backface culling). Dat werkt in elke
    Blender-versie. Freestyle mag erbij als het in 5.2 beschikbaar is.
  - warm hooglicht en koel teal invullicht
  - zachte schaduw
  - camera recht voor of iets van boven, geen fisheye
- De labbibliotheek begint met: labtafel, maatcilinder, weegschaal, steen, twee
  blokjes (aluminium en ijzer, even groot) en een pak rijst.
  - Een nieuw voorwerp modelleer ik eenmalig en voeg ik aan de bibliotheek toe.
  - Een nieuw vak (bijvoorbeeld DV) krijgt zo zijn eigen set.
- Shots worden PNG-reeksen, die Remotion afspeelt.
- In een render staat nooit tekst, een getal of een schaalverdeling. Die staan
  in de getekende laag.

## 8. Sami

- Eenmalig vier portretten in het 3D-comicrecept: vragend, verbaasd, blij en
  nadenkend.
- Ongeveer 14 jaar, labjas en veiligheidsbril. Inclusief en zonder
  stereotypen.
- Gemaakt met `gemini-3-pro-image` in de ElevenLabs-werkruimte. Dat model houdt
  hetzelfde personage vast. De achtergrond haal ik weg met
  `birefnet-v2-bg-removal`.
- Kevin keurt het eerste portret goed voordat de andere drie gemaakt worden.
- De portretten liggen vast in `video/assets/sami/` en ik gebruik ze in elk
  hoofdstuk opnieuw.

## 9. Draaiboek hoofdstuk 2 (goedgekeurd)

Ongeveer 350 woorden en ongeveer 2:55. De getallen komen uit de voorbeelden in
de lesstof van 2.1 tot en met 2.3.

**0. Opening (0:00-0:10), KIJK, FOCUS.**
*Beeld:* Blender-scène van een labtafel met twee even grote blokjes. Sami
vragend.
- SAMI: Deze twee blokjes zijn even groot. Toch is dit blokje veel zwaarder.
  Hoe kan dat?
- DOCENT: Dat ontdek je zo. Eerst leer je drie begrippen: massa, volume en
  dichtheid.

**1. Massa (0:10-0:38), KIJK, SPLIT.**
*Beeld:* getekende weegschaal met een pak rijst. Het schermpje telt op tot
750 g. Kernwoorden: m, g, kg, 1 kg = 1000 g.
- DOCENT: Massa is hoeveel gram of kilogram iets is. Je meet massa met een
  weegschaal.
- DOCENT: Dit pak rijst heeft een massa van 750 gram.
- SAMI: Thuis zeggen we: het gewicht.
- DOCENT: Dat zeggen veel mensen. In de les zeggen we massa. De letter is m.
- DOCENT: Kleine voorwerpen meet je in gram, zware in kilogram. 1 kilogram is
  1000 gram.

**2. Volume (0:38-1:00), KIJK, SPLIT.**
*Beeld:* een grote en een kleine doos. Daarna een getekende maatcilinder die
vult tot 35 ml, met een oog op ooghoogte. Groot in beeld: 1 ml = 1 cm³.
- SAMI: En wat is volume?
- DOCENT: Volume is hoeveel ruimte iets inneemt. De letter is V.
- DOCENT: Water meet je met een maatcilinder. Hier staat het water op
  35 milliliter.
- DOCENT: Bij vaste voorwerpen gebruik je kubieke centimeter. Onthoud:
  1 milliliter is 1 kubieke centimeter.

**3. Onderdompelmethode (1:00-1:40), KIJK, SPLIT.**
*Beeld:* Blender-shot van een steen die in de maatcilinder zakt. Getekende
maatcilinder van 15 naar 25 ml. Regel: volume voorwerp = eindvolume −
beginvolume.
- SAMI: Maar een steen heeft geen nette vorm. Hoe meet ik het volume van een
  steen?
- DOCENT: Met de onderdompelmethode. Stap 1: lees het water af. Het staat op
  15 milliliter.
- DOCENT: Stap 2: laat de steen helemaal onder water zakken. Lees opnieuw af:
  25 milliliter.
- DOCENT: Stap 3: reken het verschil uit. 25 min 15 is 10. De steen heeft een
  volume van 10 kubieke centimeter.
- SAMI: Het water stijgt, omdat de steen ruimte inneemt.
- DOCENT: Precies.

**4. Dichtheid (1:40-2:22), KIJK, SPLIT.**
*Beeld:* twee blokjes van 10 cm³ op twee weegschalen: aluminium 27 g en ijzer
79 g. Daarna ρ = m / V met de getallen ingevuld. Daarna de formuledriehoek
met afdekken.
- DOCENT: Terug naar de blokjes. Ze hebben allebei een volume van 10 kubieke
  centimeter.
- DOCENT: Het blokje aluminium heeft een massa van 27 gram. Het blokje ijzer
  79 gram.
- DOCENT: Dat komt door de dichtheid. Dichtheid is hoeveel massa er in
  1 kubieke centimeter van een stof zit.
- DOCENT: Het teken is de Griekse letter rho. De formule: rho is m gedeeld
  door V.
- DOCENT: IJzer: 79 gedeeld door 10 is 7,9 gram per kubieke centimeter.
  Aluminium: 27 gedeeld door 10 is 2,7.
- SAMI: Dus in ijzer zit meer massa in dezelfde ruimte.
- DOCENT: Ja. Dichtheid is een stofeigenschap. Met de formuledriehoek reken je
  ook m of V uit.

**5. Check (2:22-2:45), CHECK, STATUS.**
*Beeld:* de opgave groot in beeld. Een aftelbalk van 4 s, daarna de
uitwerking in groen.
- DOCENT: Nu jij. Een blokje heeft een massa van 106,8 gram en een volume van
  12 kubieke centimeter. Wat is de dichtheid? Zet de video op pauze en reken
  het uit.
- DOCENT: 106,8 gedeeld door 12 is 8,9 gram per kubieke centimeter. Het
  blokje kan van koper zijn.

**6. Klaar (2:45-2:55), KLAAR, STATUS.**
*Beeld:* drie kaarten: massa, volume en dichtheid.
- DOCENT: Massa meet je met een weegschaal. Volume met een maatcilinder.
  Dichtheid is massa gedeeld door volume.
- SAMI: Nu ga ik de herhalingsopdrachten maken.

**Te lang.** Komt de opname boven 2:55, dan vervalt eerst de zin over de
formuledriehoek. De driehoek blijft dan alleen in beeld.

**Rekencontrole:**
- 25 − 15 = 10
- 27 / 10 = 2,7
- 79 / 10 = 7,9
- 106,8 / 12 = 8,9

## 10. Draaiboekformaat

`draaiboek.json` bevat:
- `hoofdstukId`, `vak`, `titel`
- `scenes[]`. Per scène:
  - `id`, `kop` (titelvak), `fase` (KIJK, CHECK of KLAAR), `indeling` (FOCUS,
    SPLIT of STATUS), `kernwoorden[]`
  - `beeld`: Blender-shots en getekende onderdelen, met parameters, zoals
    `{ "type": "maatcilinder", "van": 15, "naar": 25, "eenheid": "ml" }`
  - `regels[]`. Per regel:
    - `id`, `spreker` (`docent` of `sami`), `tekst`, `uitspraak`
    - optioneel `samiUitdrukking`
    - optioneel `momenten[]`: animatiemomenten, gekoppeld aan het begin of
      einde van de regel
    - optioneel `pauzeNa` in seconden; CHECK gebruikt 4 s

Remotion leest dit bestand samen met `timing.json`. De lengte van de video volgt
uit de audio (`calculateMetadata`).

## 11. HELIX: ondertitelspoor

- `src/lib/mediaUtils.js`:
  - `normalizeMediaContent` neemt het nieuwe veld mee:
    `ondertitels: [{ taal, label, url, storagePath }]`.
  - Een lege of ongeldige invoer wordt een lege lijst.
- `src/lib/publicContentBlockView.js`: `sanitizeContent` laat bij
  media-blokken `ondertitels` staan. Zonder deze wijziging valt het veld weg in
  de leerlingkopie.
- `src/components/media/MediaRenderer.jsx`: zijn er ondertitels, dan rendert
  het per item een `<track kind="subtitles" srcLang label src>`.
  - Het eerste item krijgt `default`.
  - De video krijgt dan `crossOrigin="anonymous"`. Zonder ondertitels
    verandert er niets, zodat bestaande video's van andere sites blijven
    werken.
- De CORS-instelling van de bucket (`scripts/zet-storage-cors.mjs`) staat GET
  al toe voor `dvdacapo.vercel.app` en `localhost:5173`. Er hoeft niets te
  veranderen.
- `StudentLessonPage.jsx` blijft onaangeroerd.

## 12. HELIX: plaatsingsscript

`scripts/plaats-explainer-video.mjs --hoofdstuk <id> --paragraaf <id> [--bron <map>] [--apply]`.
Opgezet zoals `plaats-hoofdstuk-slidedecks.mjs` en `lib/slidedeckPlaatsing.mjs`.

1. De paragraaf wordt expliciet meegegeven. In een hoofdstuk kunnen meerdere
   paragrafen een Samenvatting hebben. In H2 hebben 2.1 tot en met 2.5 er een,
   dus "de laatste met een Samenvatting" zou de plusparagraaf zijn.
   - De skill stelt de paragraaf voor bij het draaiboek, en Kevin keurt hem
     samen met het draaiboek goed.
   - Voorstelregel: de herhalingsparagraaf. Ontbreekt die, dan de laatste
     gewone paragraaf met een Samenvatting, dus geen plus- of
     uitdagingsparagraaf.
   - H2: `2.4 Herhalingsopdrachten`.
   - Het script stopt als de paragraaf niet bij het hoofdstuk hoort of geen
     blok van `type: 'summary'` heeft.
2. Upload naar `explainers/<hoofdstukId>/`: `explainer.mp4` (`video/mp4`),
   `ondertitels.nl.vtt` (`text/vtt`) en `poster.png`.
   - Elk bestand krijgt een download-token, zoals `uploadPdf` dat doet.
   - Cache: `public, max-age=86400`.
3. Maak een media-blok:
   - id `block-<hoofdstukId>-explainer-video`, `type: 'media'`,
     `status: 'published'`
   - `title`: "Uitlegvideo: <onderwerp>"
   - `content.html`: een korte kijkvraag
   - `mediaKind: 'video'`, `mediaUrl`, `storagePath`, `thumbnailUrl` (poster),
     `ondertitels`
4. Zet het blok direct vóór de Samenvatting:
   - Het blok krijgt de `order` van de Samenvatting.
   - De Samenvatting en alle blokken daarna krijgen `order + 1`, in
     `contentBlocks` en in `publicContentBlocks`.
5. Schrijf de leerlingkopie met `buildPublicContentBlockSnapshot`.
6. Heeft een klas `enabledContentBlocks[paragraafId]`, voeg de id daaraan toe
   met `arrayUnion`.
7. Zonder `--apply` is het een dry run: het script toont het plan en schrijft
   niets.
   - Met `--apply` maakt het eerst een back-up naar `exports/reset-backups/`.
   - Opnieuw draaien overschrijft het blok en schuift niets dubbel op. Staat
     het blok er al, dan blijft de volgorde gelijk.

## 13. De skill

`.claude/skills/explainer-helix-maker/`, in de repo. Er komt geen kopie in
`~/.claude/skills`.

- `SKILL.md` beschrijft de volgorde uit paragraaf 3. Bij elke stap staat wat er
  misgaat als je hem overslaat. Drie harde akkoordmomenten:
  1. het draaiboek
  2. de kosten
  3. de video, voordat hij naar HELIX gaat
- `references/`:
  - `stem-en-stijl.md`
  - `draaiboek-formaat.md` (met H2 als voorbeeld)
  - `blender-renderrecept.md`
  - `plaatsing.md`
- Ik bouw de skill met de skill-creator. De eerste test is de echte H2-run.
- In `docs/HANDOFF.md` en `scripts/handoff-stand.mjs` komt een verwijzing,
  zodat een volgende sessie de pijplijn vindt.

## 14. Wat er misgaat en wat er dan gebeurt

| Risico | Gevolg | Maatregel |
| --- | --- | --- |
| De ElevenLabs-MCP geeft de audio niet als downloadbare URL | geen lokale bestanden voor Remotion | in de eerste stap testen met één regel; anders de API-sleutel in `.env.local` (Kevin zet die zelf) |
| `eleven_v4` spreekt een woord fout uit | onverstaanbaar voor NT2 | IPA tussen schuine strepen in `uitspraak`; per regel opnieuw opnemen |
| De video wordt langer dan 3:00 | eis gebroken | eerst de formuledriehoekzin schrappen, dan pauzes inkorten |
| De Blender-add-on draait niet | geen live meekijken | renderen werkt zonder; Kevin zet de add-on aan als meekijken nodig is |
| Een AI-portret van Sami bevat fouten (vingers, tekst) | onprofessioneel | alleen portretten zonder handen of tekst; Kevin keurt goed |
| Een render toont een verkeerde hoeveelheid of richting | vakinhoudelijk fout | validatiegate van het designsysteem: stilstaande beelden per scène controleren tegen het draaiboek |
| Een klas met eigen blokselectie ziet het blok niet | video onzichtbaar | `arrayUnion` in stap 12.6; controle met de testleerling |
| De leerlingkopie mist `ondertitels` | geen ondertitels voor leerlingen | test op `sanitizeContent`; controle met de testleerling |
| Remotion-licentie | juridisch | controleren of gebruik door een school onder de gratis licentie valt, vóór de eerste render |

## 15. Testplan

- `node --test src/lib/`:
  - `normalizeMediaContent` met en zonder ondertitels, en met ongeldige
    invoer.
  - `sanitizeContent` houdt `ondertitels` bij media-blokken.
- `video/`:
  - tests voor `maak-ondertitels.mjs`: tijdcodes, splitsen op 42 tekens,
    voice-tags
  - tests voor de opbouw van de timing
- Plaatsingsscript:
  - De dry run tegen het echte H2 met `--paragraaf` van 2.4 toont de juiste
    orderverschuiving en de klassen met een eigen selectie.
  - Een paragraaf zonder Samenvatting of uit een ander hoofdstuk geeft een
    foutmelding.
- Video: een stilstaand beeld per scène, de lengte (`ffprobe`) en het
  rekenwerk tegen het draaiboek.
- `npx eslint` op de gewijzigde bestanden, `npm run build`.
- Na het plaatsen: als testleerling van ER3L1A in `/admin/testen` de video in
  2.4 afspelen met de ondertitels aan en uit.

## 16. Uitrol

1. Code voor het ondertitelspoor, met tests, lint en build.
2. Kevin geeft akkoord. Deploy met `npx vercel --prod --yes`.
3. Video maken volgens de pijplijn. Kevin bekijkt hem.
4. Plaatsingsscript: eerst de dry run, daarna `--apply`.
5. Controle met de testleerling.

Ik commit alleen als Kevin erom vraagt, en ik noem de paden.

## 17. Niet in scope

- Vertaalde ondertitels. Het datamodel is erop voorbereid, de vertaling zelf
  niet.
- Achtergrondmuziek.
- Sami als 3D-figuur.
- Video's per paragraaf.
- Een beheerknop in de CMS om een explainer te maken. Het blijft een skill met
  scripts.

## 18. Wat er anders is gebouwd dan hier staat

Bij verschil gelden de scripts in `video/` en de skill, niet dit ontwerp.

- Geen `helix-explainer.config.json` en geen `neem-stemmen-op.mjs`. De stemmen
  gaan via de ElevenLabs-MCP; stem-id's, model en instellingen staan vast in
  `.claude/skills/explainer-helix-maker/references/stem-en-stijl.md`.
- `video/blender/bouw_lab.py` in plaats van `bouw-lab.py` (Python kan geen
  module met een streepje importeren). Shots staan per hoofdstuk in één bestand,
  `video/blender/shots/<hoofdstukId>.py`, met één functie per shot; renderen
  via `video/blender/render-shot.py`.
- De portretten van Sami staan in `video/public/sami/`, niet in
  `video/assets/sami/`.
- Per hoofdstuk staat alles in `video/public/hoofdstukken/<id>/`: lesstof,
  draaiboek, timing, audio en shots.
- Het blok-id is `block-<hoofdstukId zonder "hoofdstuk-">-explainer-video`, voor
  H2 `block-binask-eoa-1-h2-explainer-video`. De bloktitel maakt alleen de
  eerste letter van de draaiboektitel klein.
- Het draaiboek heeft geen `beeld` en geen `momenten`, maar per scène `shot`,
  `getekend`, `kernwoorden` en `geluiden`; verwijzingen gaan met `bij` naar
  regel-id's. Zie `references/draaiboek-formaat.md` in de skill.
- `driehoek` heeft de draaiboekvelden `boven`, `linksOnder`, `rechtsOnder` en
  `formules`; `maatcilinder` heeft het veld `voorwerp` (alleen `"steen"` laat
  een steen vallen). Er staat geen H2-inhoud meer vast in de onderdelen.
- Contouren: een omgekeerde schil voor vaste voorwerpen, plus Freestyle voor
  glas en water.
- Het 3D-water stijgt natuurkundig met de inhoud van de steen (x1,32 in H2). De
  getekende maatcilinder draagt de getallen (15 naar 25 ml); het shot hoeft daar
  niet mee te kloppen.
- `controleer-draaiboek.mjs` schat de lengte vooraf met 14,5 tekens per seconde
  en de echte pauzes en scène-overgangen (gemeten bij H2: 14,6).
- Plaatsen telt mee in de voortgang: een nieuw videoblok is een extra stap, dus
  wie de paragraaf al af had, ziet hem weer als niet af tot de video bevestigd
  is. De dry run waarschuwt daarvoor.

## 19. Ondertitels in de moedertaal (2 oktober 2026)

Dit vervangt de eerste regel van §17 (vertaalde ondertitels buiten scope). De
stem blijft Nederlands; de ondertitels staan ook in de taal van de leerling.

**Keuzeregel van de speler.**

- Talen: de negen van de taalknop, `LES_TALEN` in `src/lib/lesTaal.js` (el, uk,
  ar, tr, pl, ro, es, it, en), plus `nl`.
- De voorkeurstaal komt uit `useOndertitelTaal()` (`src/hooks/useLesstofTaal.js`):
  `getLesTaal(userData)` als de keuze `helix-lestaal-<uid>` in localStorage op
  `aan` staat, anders leeg. Alleen lezen: geen Firestore-schrijfactie, geen
  callable.
- `kiesOndertitelTaal(ondertitels, voorkeurTaal)` (`src/lib/mediaUtils.js`):
  de voorkeurstaal als dat spoor er is, anders `nl`, anders het eerste spoor,
  bij een lege lijst `''`.
- `MediaRenderer` geeft het gekozen spoor `default`. Een effect op de video zet
  de `mode` van de textTracks (`showing` voor de gekozen taal, `disabled` voor de
  rest), maar alleen als de gekozen taal verandert. Zo wisselt het spoor mee als
  de leerling in de les de taalknop omzet, en zet een gewone re-render een via
  de CC-knop uitgezette ondertitel niet weer aan.
- Beheer en digibord hebben geen `lesTaal`: Nederlands. Op het digibord
  (`variant="presenter"`) negeert `MediaRenderer` de voorkeur altijd.
- Het effect slaat zijn eerste run over: de beginkeuze is het `default`-attribuut.
  Chrome en Edge zetten anders hun eigen automatische keuze erbij (twee sporen
  tegelijk). Bij een wissel na het laden gaan eerst alle sporen op `disabled`,
  daarna pas het gekozen spoor op `showing`.

**Bestandsformaat.**

- Per taal een eigen bestand: `exports/video/<id>/ondertitels.<code>.vtt`, met
  `ondertitels.nl.vtt` altijd erbij. Tijden, splitsing (hooguit 2 regels van 42
  tekens) en voice-tags zijn in elke taal gelijk.
- De vertalingen staan in `video/public/hoofdstukken/<id>/vertalingen.json`, naast
  het draaiboek: `{ hoofdstukId, bron: { <regelId>: <Nederlandse tekst> }, talen:
  { <code>: { <regelId>: <vertaling> } } }`. `bron` is een momentopname van
  `regels[].tekst`; wijkt het draaiboek ervan af, dan is die vertaling verouderd.
- `video/lib/vertalingen.mjs` (`controleerVertalingen`) meldt: een regel zonder
  of met verouderde bron, een ontbrekende taal, een ontbrekende of lege regel,
  een taalcode die niet in `LES_TALEN` staat, emoji en een bidi-isolaat zonder
  sluitteken (of een los sluitteken).
- `video/scripts/maak-ondertitels.mjs` controleert eerst en schrijft pas daarna.
  Bij een fout: melding en exit 1, zonder bestanden. Zonder `vertalingen.json`
  komt alleen `nl`.
- Plaatsing: `explainers/<hoofdstukId>/ondertitels.<taal>.vtt` in Storage met
  `contentType: text/vtt` en een token per bestand. `content.ondertitels` krijgt
  per taal `{ taal, label, url, storagePath }`, `nl` (label `Nederlands`) eerst,
  daarna de volgorde van `LES_TALEN`. Het label is de naam van de taal in de
  eigen taal (`taalLabel(code)`).

**Vertaalafspraken.**

- Claude vertaalt na het goedgekeurde draaiboek en vóór het renderen van de
  ondertitels de `tekst` van elke regel naar alle talen van `LES_TALEN` en
  schrijft `vertalingen.json`.
- Getallen, eenheden en symbolen (g, kg, ml, cm³, ρ, m, V, 7,9 met komma) blijven
  exact zoals op het scherm.
- Een kernbegrip krijgt de eerste keer het Nederlandse woord tussen haakjes,
  zodat de leerling het in de les herkent.
- Arabisch: formules en getal plus eenheid staan tussen bidi-isolaten (LRI
  U+2066, PDI U+2069), zodat ze niet omdraaien. `breekTekst` in
  `video/lib/ondertitels.mjs` breekt nooit binnen zo'n isolaat en `maakVtt`
  schrijft er harde spaties (U+00A0) in, zodat de browser het ook niet doet.
- De plaatsing waarschuwt als een vertaald `.vtt` ouder is dan
  `ondertitels.nl.vtt` (verouderde timing).
- Een nieuwe taal in `LES_TALEN`: `vertalingen.json` aanvullen, ondertitels en
  plaatsing opnieuw draaien. Dat overschrijft het blok en schuift niets op.

**Uitrol.**

- Alleen vanuit de hoofdmap van HELIX, nooit vanuit een worktree: Vercel deployt
  wat in de map staat, niet wat in git staat.
- Live en git moeten na een uitrol gelijk zijn.
- Volgorde: commit, eventueel merge, één deploy, plaatsen met `--apply`,
  testleerling, push.
