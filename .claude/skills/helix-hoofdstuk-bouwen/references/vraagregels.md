# Wanneer is een quiz- of toetsvraag goed genoeg?

Dit zijn de regels die `scripts/lib/vraagItems.mjs` afdwingt. Ze staan hier zodat
je vragen kunt schrijven die er in één keer doorheen komen, in plaats van te
raden waarom de build stopt.

De regels stoppen de build bij een fout. Dat is met opzet: een stille nepvraag
kost een leerling zijn tokens en het vertrouwen in het systeem, een mislukte
build kost een minuut.

## Een vraag opschrijven

De veldnamen zijn dezelfde als die de CMS-editor schrijft, zodat een vraag die
in de app gemaakt is hier ongewijzigd in geplakt kan worden.

```json
{
  "prompt": "De vraag of stelling zoals de leerling hem leest.",
  "type": "meerkeuze | waar-niet-waar | open",
  "options": [{ "text": "...", "correct": true, "explanation": "", "misconception": "" }],
  "waar": true,
  "feedback": "Wat de leerling na het antwoorden leest.",
  "modelAnswer": "Wat er in een goed antwoord staat.",
  "nakijkpunten": ["...", "..."],
  "leerdoel": "Je kunt ..."
}
```

`type` mag je weglaten; het wordt afgeleid uit de vraag zelf:

- `waar: true` of `waar: false` → waar-niet-waar
- `options` → meerkeuze
- `modelAnswer` of `nakijkpunten` → open

Kan het niet afgeleid worden, dan stopt de build. Dat is beter dan gokken en de
vraag als het verkeerde type tonen.

## Per vraag

**Elke vraag heeft eigen feedback van minstens twintig tekens.** Feedback is wat
de leerling leest nadat hij geantwoord heeft; "Goed zo" leert hem niets. Twee
vragen in hetzelfde blok mogen niet dezelfde feedbackzin hebben.

**Een waar-niet-waar-vraag is een stelling, geen vraagzin.** Begint de tekst met
wat, waarom, hoe, welke, wanneer, wie, noem, leg, beschrijf, geef, vergelijk,
verklaar of kies, of eindigt hij op een vraagteken, dan wordt hij geweigerd. Een
vraag die om uitleg vraagt is geen ja/nee-knop, ook niet als het toevallig de
eerste vraag van de quiz is.

**Meerkeuze heeft drie of vier opties.** Minstens één goed en minstens één fout,
geen dubbele optieteksten, elke optie met tekst. Alles goed of alles fout is
geen vraag.

**Waar-niet-waar heeft precies twee opties.** Gebruik liever de korte vorm
`waar: true`; dan worden "Waar" en "Niet waar" zelf gemaakt.

**Een open vraag heeft een modelAnswer en twee of drie nakijkpunten.** De
nakijkpunten zijn succescriteria voor de docent. Ze mogen een lijst zijn of een
tekstvak met regels, zoals de editor het opslaat.

## Per blok

**Een quiz heeft minstens drie vragen, een toets minstens zes.** Daaronder meet
je niets.

**Het goede antwoord staat niet elke keer op dezelfde plek.** Staan er drie of
meer gesloten vragen en zit het juiste antwoord telkens op positie 1, dan stopt
de build. Zo'n quiz is te halen zonder de vraag te lezen.

**Niet alleen open vragen.** Een blok met uitsluitend open vragen kan de leerling
niets bevestigen: hij krijgt geen enkel moment te horen of hij het snapt.

## Tokens

Het aantal tokens van het blok wordt zo gelijk mogelijk over de vragen verdeeld;
de eerste vragen krijgen de rest. Je hoeft per vraag niets in te vullen.

## Waar het beleid vandaan komt

Pogingen, tokens en of de Digidocent aan staat komen niet uit de vraag maar uit
het vak; zie `vakken.md`. Met `tokens` op het blok stel je het aantal tokens
bij.
