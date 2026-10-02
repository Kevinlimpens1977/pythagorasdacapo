# Plaatsing in HELIX

`scripts/plaats-explainer-video.mjs --hoofdstuk <id> --paragraaf <id> [--apply]`

- Leest `exports/video/<id>/explainer.mp4`, `poster.png` en alle
  `ondertitels.<taal>.vtt` (andere map: `--bron <map>`). `ondertitels.nl.vtt` is
  verplicht; verder gaan alleen bestanden mee waarvan de code een taal van
  `LES_TALEN` is (andere worden overgeslagen en gemeld). Ontbreekt er een
  verplicht bestand, dan stopt hij.
- Stopt als `--paragraaf` niet gelijk is aan `doelParagraafId` in het draaiboek.
  Controleert ook dat de paragraaf bij het hoofdstuk hoort en een Samenvatting
  heeft.
- Titel en kijkvraag van het blok komen uit het draaiboek.
- Uploadt naar `explainers/<hoofdstukId>/` met een download-token per bestand.
  Ondertitels komen op `explainers/<hoofdstukId>/ondertitels.<taal>.vtt` met
  `contentType: text/vtt`.
- `content.ondertitels` krijgt per taal `{ taal, label, url, storagePath }`:
  `nl` (label `Nederlands`) eerst, daarna de volgorde van `LES_TALEN`. Het label
  is de naam van de taal in de eigen taal (`taalLabel(code)`).
- Zet blok `block-<hoofdstuk zonder "hoofdstuk-">-explainer-video` (type `media`,
  `status: published`) op de plek van de Samenvatting; de Samenvatting en alles
  erna schuift één plek op, in `contentBlocks` en `publicContentBlocks`.
- Voegt de id toe aan `enabledContentBlocks[paragraafId]` van klassen met een
  eigen blokselectie; anders zien die klassen de video niet. Een klas met een
  lege eigen selectie (bewust alles verborgen) slaat hij over; meld dat aan Kevin.
- Zonder `--apply`: dry run. Met `--apply`: eerst een back-up in
  `exports/reset-backups/`.
- Opnieuw draaien overschrijft het blok en schuift niets dubbel op. Mislukt de
  Firestore-update na de upload, draai dan dezelfde opdracht opnieuw met `--apply`.
- Een taal erbij (nieuwe taal in `LES_TALEN`): `vertalingen.json` aanvullen,
  `maak-ondertitels.mjs` draaien en de plaatsing opnieuw doen. Dat overschrijft
  het blok met één spoor meer en schuift niets op.

## Wat je Kevin bij de dry run laat zien

De blokvolgorde van de paragraaf (met de verschuivingen), de uploads met
grootte (video, poster en één ondertitelbestand per taal), de regel
"Ondertitels in N talen: ..." en per klas of die de video ziet. Staan er in de
bronmap `.vtt`-bestanden die niet meegaan (geen taal van de taalknop), dan
meldt de dry run dat ook. Is een vertaald bestand ouder dan
`ondertitels.nl.vtt`, dan staat er een waarschuwing (ook vóór de writes bij
`--apply`): de timing van die vertaling kan verouderd zijn. Wacht op zijn ja
vóór `--apply`.

Noem ook het gevolg voor de voortgang, dat de dry run als waarschuwing toont: een
nieuw videoblok telt mee als stap, dus leerlingen die de paragraaf al af hadden,
zien hem weer als niet af tot ze de video bevestigd hebben (bij opnieuw plaatsen
van hetzelfde blok verandert er niets).

## Speler

De speler (`src/components/media/MediaRenderer.jsx`) toont het veld
`content.ondertitels` als een `<track>` per taal; de leerlingkopie neemt het mee
(`src/lib/publicContentBlockView.js`). Welk spoor standaard aan staat bepaalt
`kiesOndertitelTaal` (`src/lib/mediaUtils.js`) met de taal uit
`useOndertitelTaal` (`src/hooks/useLesstofTaal.js`): de taal van de leerling als
zijn taalknop aan staat en dat spoor er is, anders Nederlands. De bucket-CORS (`scripts/zet-storage-cors.mjs`)
staat GET al toe voor `dvdacapo.vercel.app` en `localhost:5173`.
