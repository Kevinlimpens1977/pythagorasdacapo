# Spelopzet: fase 3, samen

> Status 23 september 2026: ter review. Er is nog niets van gebouwd.
> Bouwt voort op SPELOPZET-TOKENS-EN-SHOP.md (fase 1 en 2, allebei live) en op
> docs/ONDERZOEK-TOKENSHOP-EN-BELONING.md, "Fase 3: samen".

## 0. Besluiten (23 september 2026)

| Vraag | Besluit |
|---|---|
| Hoe vult de balk van het klasdoel? | **inzet in punten**: 1 punt per afgerond blok met 60% of meer, hooguit 10 per leerling per week |
| Wat mag je geven? | **alleen complimenten** uit een vaste lijst, hooguit 3 per week |
| Wat staat er op je kaart? | **alles staat aan**: avatar, naam, niveau, titel en pins. Titel en pins kun je zelf verbergen |
| Wie stelt het klasdoel in? | **Kevin, per klas**: aantal punten en beloning |

Techniek, anders dan in §2.1: er komen geen aparte vitrine-documenten. De callable `getMijnKlas`
stelt de kaarten op de server samen en geeft alleen de velden terug die zichtbaar mogen zijn.

## 1. Waarom

Tot nu toe speelt een leerling alleen: hij verdient, spaart en koopt voor zichzelf. Onderzoek naar
motivatie laat zien dat erbij horen even zwaar weegt als zelf iets kunnen. Fase 3 geeft de klas een
gezamenlijk doel en een plek om elkaar te zien. Er komt geen ranglijst: een zwakke leerling mag
nooit zichtbaar onderaan staan.

## 2. Drie onderdelen

### 2.1 Mijn klas: de vitrine

- Een nieuwe pagina **Mijn klas** met een kaart per klasgenoot: avatar, naam, niveau, titel en
  maximaal 3 pins.
- De leerling kiest wat er op zijn kaart staat. Een kaart met alleen avatar en naam is altijd goed.
- **Nooit te zien**: saldo, scores, percentages, weekreeks en weekdoel.
- Volgorde: op voornaam. Nooit op niveau of op tokens.
- Techniek: een nieuw document `klasVitrine/{uid}`, leesbaar voor de klas en alleen door de server
  geschreven. De server neemt alleen de velden over die zichtbaar mogen zijn. Zo komen `users` en
  `tokenAccounts` nooit bij klasgenoten.

### 2.2 Het klasdoel

- Jij zet per klas een doel neer met een beloning die je zelf invult, bijvoorbeeld "spelkwartier"
  of "muziek in de les".
- Een balk op de lespagina en op Mijn klas: "Klasdoel: spelkwartier, 64 van 100".
- **Hoe de balk vult (voorstel)**: inzet, geen tokens. Elk lesblok dat een leerling afrondt met
  60% of meer telt 1 punt. Per leerling tellen hooguit 10 punten per week mee. Zo telt een zwakke
  leerling die zijn werk doet evenveel als een sterke, en kan niemand de balk alleen vullen.
- Is het doel gehaald, dan krijg jij een melding en zie je dat in het klasoverzicht. Jij bepaalt
  wanneer het klasmoment is.
- Techniek: `klasDoel/{klasId}` met doel, stand en beloning. De server telt bij elke beloning mee,
  in dezelfde transactie als de tokens.

### 2.3 Iets geven aan een klasgenoot

- **Voorstel: een compliment in plaats van een cadeau.** Een leerling geeft een klasgenoot een
  kaartje uit een vaste lijst, zoals "Goed geholpen" of "Knap volgehouden". Er is geen vrije tekst,
  dus pesten kan niet.
- Hooguit 3 per week. De ontvanger ziet ze op zijn kaart.
- Cadeaus met tokens (een shopitem kopen voor een ander) laten we weg. Dat leidt tot druk
  ("koop jij iets voor mij?") en tot ruilhandel.

## 3. Bewust niet in fase 3

- **Competities en teams.** Die komen later, en dan als keuze.
- **Goed doel.** Later, samen met jou, omdat het aan een echte actie hangt.
- **Ranglijsten van welke soort ook.**

## 4. Wat jij ziet

- Per klas: het doel instellen, de stand zien, een doel afsluiten ("klasmoment gehouden").
- In het klasoverzicht zie je welke leerlingen hun kaart hebben ingevuld.
- Een compliment kun je verbergen, voor als er toch iets misgaat.

## 5. Open vragen

Zie de meerkeuzevragen in de chat. De antwoorden komen in §0 van dit document.
