# Stem en stijl: vast voor elke explainer

## Stemmen (ElevenLabs-MCP)

| Rol | Naam | voice_id |
| --- | --- | --- |
| Docent | Thomas | `fIYdULbypRf7uZYX6u0T` |
| Sami (leerling, meisje) | Mette | `L8qZJEV989Y3D0xnaVCa` |

- Model `eleven_v4`, altijd `generations_count: 1`. De tool maakt anders
  standaard vier varianten en rekent ze alle vier.
- Eerst `estimate_only: true` voor de langste regel en reken door naar het hele
  draaiboek; dan Kevin; dan pas opnemen.
- Eerst `creative_create_flow`, daarna alle opnames met die `flow_id`.
- `creative_generate_speech`, dan `creative_get_flow_run_status` pollen tot
  `all_completed` (of `has_failures`).
- Downloaden: de status geeft per generatie een `master_url`. Haal die met
  `curl -L -o "video/public/hoofdstukken/<id>/audio/<regelId>.mp3" "<master_url>"`.
  Elke regel apart; controleer daarna met `ffprobe` dat het bestand een duur
  heeft.
- Nooit dezelfde aanroep herhalen als retry (dat start en rekent een tweede
  generatie); lees eerst de status.
- Een regel is mislukt of klinkt fout? Neem alleen die regel opnieuw op. Een
  woord dat verkeerd klinkt los je op in `uitspraak` (IPA tussen schuine
  strepen), niet in `tekst`.
- `uitspraak` is wat de stem zegt (getallen voluit, "kubieke centimeter", "ro",
  "em", "vee"). `tekst` is wat in de ondertitel staat ("106,8", "cm³", "ρ").
- Audio-tags spaarzaam: `[curious]` bij een vraag van Sami, `[warmly]` of
  `[happy]` bij een afsluiter. Ze worden niet uitgesproken en tellen niet mee
  voor de geschatte lengte.
- Zeg nooit "BiNaSk" hardop; gebruik "in de les". De validator keurt het af.
- Tempo: ongeveer 14,6 tekens uitspraak per seconde (H2: 175,9 s echt). Zie
  `draaiboek-formaat.md` voor de lengteregel.
- Een geluidseffect (H2: het plonsje, `audio/plons.mp3`) komt uit een sfx-node
  via `creative_generate_in_flow`, model `eleven_text_to_sound_v2`, op dezelfde
  `flow_id`. Ook eerst `estimate_only`, en noem de kosten bij Kevins akkoord.

## Beeld

- 1920 × 1080, 30 fps. Onderste zone vanaf y = 884 leeg (ondertitels).
- Paper `#FFF7E8`, ink `#0B0D0F`, geel titelvak `#FFD33D` met 8 px zwarte rand.
- Blauw `#087EB5` voor metingen en formules. Groen `#2E9D63` alleen voor het
  juiste antwoord bij CHECK en voor KLAAR.
- Bangers voor koppen (max zes woorden, hoofdletters). Atkinson Hyperlegible
  Next voor al het andere.
- Indelingen: FOCUS (groot beeld), SPLIT (comic links, getekend midden,
  kernwoorden rechts), STATUS (CHECK, KLAAR).
- Sami: vaste portretten in `video/public/sami/` (vragend, verbaasd, blij,
  nadenkend). Nooit opnieuw genereren voor een nieuw hoofdstuk; heb je echt een
  nieuwe uitdrukking nodig, vraag dan eerst Kevin.
- Beeldgeneraties (Sami-portretten, `gemini-3-pro-image`) komen 16:9 terug, ook
  als je vierkant vraagt. In H2 is het midden bijgesneden tot 768 × 768; houd het
  gezicht dus in het midden. Achtergrond weg met `birefnet-v2-bg-removal`.
- Geen muziek.

## Ondertitels

- WebVTT, één of meer cues per regel, hooguit 2 regels van 42 tekens, spreker
  als `<v Docent>` of `<v Sami>`.
- Los spoor naast de video, standaard aan in de HELIX-speler.
- Eén `.vtt` per taal: `ondertitels.nl.vtt` en, uit `vertalingen.json`, een
  `ondertitels.<code>.vtt` voor elke taal van de taalknop (`LES_TALEN`: el, uk,
  ar, tr, pl, ro, es, it, en). De tijden zijn in elke taal gelijk aan het
  Nederlands; alleen de tekst verschilt. De stem blijft Nederlands.
- Keuzeregel van de speler (`kiesOndertitelTaal` in `src/lib/mediaUtils.js`):
  staat de taalknop van de leerling aan (`lesTaal` op zijn gebruikersdocument
  en `helix-lestaal-<uid>` = `aan` in localStorage), dan staat het spoor in zijn
  taal aan, als dat spoor er is. Anders het Nederlands, anders het eerste spoor.
  Beheer en digibord hebben geen `lesTaal` en tonen dus Nederlands; op het
  digibord (`variant="presenter"`) negeert de speler de voorkeur altijd. Via de
  CC-knop kan de leerling altijd wisselen; zet hij de taalknop om, dan wisselt
  het spoor mee.
- Vertaalafspraken (getallen, eenheden en symbolen exact, Nederlands kernwoord
  tussen haakjes, Arabisch met bidi-isolaten) staan in `SKILL.md`, stap 4b.

## QA per still (designsysteem p.23)

- Titelvak met fasekenmerk, kop in Bangers.
- Eén cognitieve opdracht per scène.
- Geen tekst of getal in een comicbeeld.
- Elk getal gelijk aan het draaiboek en de lesstof.
- Onderste zone leeg.
- Groen alleen bij het antwoord en bij KLAAR.
- Lengte ≤ 180 s.
