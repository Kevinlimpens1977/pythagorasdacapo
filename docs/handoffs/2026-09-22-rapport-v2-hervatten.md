# Hervatten: MT-rapport versie 2.0

Kevin moest zijn laptop afsluiten terwijl dit liep. Dit bestand beschrijft
precies waar het staat, zodat het thuis in één keer af kan.

## De opdracht

Het bestaande MT-rapport (`exports/curriculum/Digitale-geletterdheid-vmbo-rapport-MT.pdf`)
bijwerken met de actuele nulmeting en opnieuw bouwen als **versie 2.0**:

1. Hoofdstuk 7 bijwerken met de nulmeting van nu, per leerniveau opgeteld:
   basis (H1B1 + H1B2), kader (H1K1-3) en tl (H1TL1-3).
2. Duidelijk vermelden dat de inclusieklas H1i1 niet meedoet in die
   vergelijking. **Let op:** H1i1 heeft wél een nulmeting gemaakt, maar een
   verkorte (twee delen van twintig vragen, 8 van de 9 leerlingen begonnen, 7
   allebei de delen af). In het rapport dus niet schrijven dat zij niets deden;
   wel dat zij een andere, kortere toets maakten en daarom buiten de
   vergelijking blijven. Dit is met Kevin te bespreken.
3. Scores per leerniveau vastleggen en er conclusies uit trekken.
4. Uitleggen hoe een leerling zijn startprofiel in HELIX ziet, met een
   schermafbeelding van een fictieve leerling met wisselende scores.
5. Uitleggen hoe HELIX per leerling op de uitslag inspeelt: extra uitleg, extra
   vragen, en fout beantwoorde vragen die via de Digidocent socratisch een
   tweede kans krijgen.

## Wat al klaar is

- **`docs/curriculum/nulmeting-stand-per-niveau.mjs`** telt de nulmeting op per
  leerniveau, rechtstreeks uit de itemantwoorden. Draaien:
  `node docs/curriculum/nulmeting-stand-per-niveau.mjs` (leesbaar) of `--json`.
- **`docs/curriculum/nulmeting-stand-2026-09-22.json`** is de uitkomst van 22
  september, zodat het rapport ook zonder databaseverbinding te bouwen is.
  Cijfers van die dag:

  | Niveau | Leerlingen | Begonnen | Beide delen af | Goed |
  | --- | --- | --- | --- | --- |
  | Basis (B1, B2) | 27 | 27 | 12 | 56% |
  | Kader (K1-K3) | 53 | 52 | 31 | 61% |
  | TL (TL1-TL3) | 65 | 64 | 43 | 69% |
  | Inclusie (i1, verkorte toets) | 9 | 8 | 7 | 72% |

  Laagste onderdeel in alle drie de niveaus: 22A Digitale producten creëren
  (41%, 41%, 50%). Hoogste: 21C Data (66%, 75%, 80%).

- **Een fictief startprofiel** staat op het testaccount `testleerling-h1k2`
  (`nulmetingProfielen/testleerling-h1k2`, veld `fictiefVoorbeeld: true`), met
  bewust wisselende scores: sterk in data, startniveau bij AI, producten maken
  en samenleving. Gemaakt met `.tmp-diag/fictief-profiel.mjs` (`--verwijder`
  haalt hem weg).

## Wat er nog moet gebeuren

1. **Schermafbeelding maken.** De kaart rendert goed op `/profiel` van dat
   testaccount. Werkwijze die al werkte: tijdelijk wachtwoord zetten met
   `.tmp-diag/testinlog-el.mjs <uid>` (en er daarna met `--verwijder` weer
   afhalen), dev-server starten (`helix-dev-5180`; vite luistert op IPv6, dus
   gebruik `http://[::1]:5180`), inloggen, `/profiel` openen. De kaart-HTML is
   te kopiëren uit de DOM en met de gebouwde CSS (`dist/assets/index-*.css`) via
   Edge headless `--screenshot` naar een PNG in `exports/curriculum/` te zetten.
   Dat laatste was de volgende stap toen het stopte.
2. **Hoofdstuk 7 herschrijven** in `docs/curriculum/rapport/rapport-dv-mt.md`,
   met de tabellen per niveau, de conclusies, de schermafbeelding en de uitleg
   over extra uitleg / extra vragen / socratische tweede kans.
3. **Hoofdstuk 1 (managementsamenvatting) nalopen:** daar staat nu "122 van de
   144 brugklassers" en dat klopt niet meer.
4. **Versienummer naar 2.0** op de titelpagina en in de voettekst van
   `bouw-rapport.py`.
5. **Bouwen:** `python docs/curriculum/rapport/bouw-rapport.py`. De PDF komt in
   `exports/curriculum/` (buiten git).

## Wat er verder nog openstaat van deze dag

- Hoofdstuk 2 staat voor alle acht H1-klassen op slot; alleen de nulmeting is
  open. Terugdraaien kan op `/admin/vrijgeven` met "Alles vrijgeven".
- De twee EOA-klassen zijn bewust niet op slot gezet.
