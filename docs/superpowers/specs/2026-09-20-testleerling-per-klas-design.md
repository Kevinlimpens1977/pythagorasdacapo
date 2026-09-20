# Testen als leerling, per klas

Ontwerp, 20 september 2026. Status: ter review bij Kevin. Nog niet gebouwd.

## 1. Waarom

Kevin kan nu niet zien wat een leerling van een bepaalde klas werkelijk in
HELIX ziet, en niet testen wat er gebeurt ná het maken van een opdracht:
tokens, voortgang, de Digidocent, het nakijken. Hij logt in als admin, en een
admin ziet alles. Een fout in een toewijzing of in de leerroute merkt hij
daardoor pas als een leerling het meldt.

Wat er al is:
- `?preview=draft` op de lespagina: een admin ziet daarmee ook conceptblokken.
- `devAuth.js`: een nepgebruiker, alleen lokaal (`import.meta.env.DEV`), niet
  bruikbaar op de live site.

Geen van beide laat zien wat een klas ziet, en geen van beide slaat iets op.

## 2. Besluiten van Kevin (19-20 september 2026)

| Vraag | Besluit |
| --- | --- |
| Hoe testen | echt inloggen als testleerling, met echte opslag |
| Hoeveel accounts | één testleerling per klas |
| Wat het dashboard toont | wat de leerling echt ziet (route, toewijzing en blokselectie samen) |
| Meetellen | testaccounts overal uitsluiten |
| Terugkeren | balk met "Terug naar beheer" |

## 3. Aanpak in het kort

1. Negen testleerlingaccounts, aangemaakt met een script.
2. Een Cloud Function die alleen voor die accounts een inlogtoken maakt, en
   alleen voor een admin.
3. Een beheerpagina "Testen" met per klas: wat de leerling ziet, een knop om
   de testsessie te starten, en de testdata van die klas.
4. Een balk tijdens de testsessie, met een knop terug naar beheer.
5. Filters zodat testaccounts nergens meetellen.

## 4. De accounts

**Script** `scripts/maak-testleerlingen.mjs` (Admin SDK, dry run standaard,
`--apply` schrijft; `--verwijder` haalt ze weg).

Per klas uit de tabel in `scripts/zet-klas-lesstof-klaar.mjs`:

| Veld | Waarde |
| --- | --- |
| uid | `testleerling-<klasnaam in kleine letters>`, bijvoorbeeld `testleerling-h1k2` |
| e-mail | `<uid>@helix-test.local` (alleen een sleutel voor Firebase Auth) |
| wachtwoord | geen; inloggen kan alleen via de functie uit hoofdstuk 5 |
| `users/{uid}` | `role: 'student'`, `isTestaccount: true`, `klasId`, `displayName: 'Testleerling H1K2'`, `needsNameSetup: false` |

Het script schrijft met de Admin SDK en gaat dus langs de beveiligingsregels
heen; dat is hier terecht, want een testaccount heeft geen schoolmail.

Draait het script opnieuw, dan werkt het bestaande accounts bij. De uid ligt
vast, dus er ontstaat geen tweede testleerling per klas en oude testdata blijft
aan hetzelfde account hangen.

## 5. De Cloud Function

`startTestleerlingSessie`, in `functions/index.js`, regio `europe-west1`, in de
stijl van de bestaande callables (`onCall`, `HttpsError`, kernlogica in een
`...Core`-functie zodat hij te testen is).

Invoer: `{ uid }`.

Controles, in deze volgorde:

1. Is er een ingelogde gebruiker? Zo nee: `unauthenticated`.
2. Is die gebruiker admin of supervisor (zelfde controle als
   `buildNulmetingProfiel`: rol uit `users/{uid}` of het ingestelde
   adminmailadres)? Zo nee: `permission-denied`.
3. Bestaat `users/{doel}` en staat `isTestaccount === true`? Zo nee:
   `permission-denied`, met de melding dat dit alleen voor testaccounts kan.

Daarna: `getAuth().createCustomToken(uid, { testleerling: true })` en dat token
teruggeven, plus `displayName` en `klasId` voor de melding in de app.

De derde controle is het hart van dit ontwerp: een echte leerling kan hiermee
niet geopend worden, ook niet als iemand de aanroep namaakt.

De functie schrijft niets en logt alleen wie welke testsessie startte.

Client: een `startTestleerlingSessie` in `src/lib/api.js`, naast de bestaande
aanroepen, en daarna `signInWithCustomToken(auth, token)`.

## 6. De beheerpagina

`src/pages/AdminTestenPage.jsx`, route `/admin/testen`, achter de bestaande
adminbewaking in `App.jsx`, met een ingang in het beheermenu.

Per klas een kaart:

**Wat de leerling echt ziet.** Berekend met dezelfde functies als de app:
`getStudentEffectiveParagrafen` en `getEffectiveContentBlocks` uit
`src/lib/assignmentUtils.js`, plus `filterLesstofOpKlasRoute` uit
`src/lib/klasRoute.js`. Per paragraaf: code, titel, hoofdstuk, aantal
zichtbare blokken. Daaronder een regel per probleem:

- toegewezen maar onzichtbaar door de leerroute;
- toegewezen maar de paragraaf bestaat niet meer;
- zichtbaar maar zonder publieke snapshot (de leerling ziet dan een leeg blok);
- een blokselectie die blokken buitensluit.

**Start testsessie.** Knop die de functie aanroept en daarna doorstuurt naar de
leerlingstartpagina.

**Testdata.** Wat de testleerling van die klas heeft gemaakt: per paragraaf de
voortgang (afgerond, aantal goed, score), de laatste activiteit met datum, en
het tokensaldo. Opvouwbaar, zodat de kaart kort blijft.

De pagina leest alleen; alleen de knop doet iets.

## 7. De testbalk

Een component `TestleerlingBalk`, getoond in de app-schil zodra
`userData.isTestaccount === true`:

> Je test als **Testleerling H1K2**. Wat je hier doet wordt opgeslagen bij dit
> testaccount. — knop **Terug naar beheer**

De knop logt uit en stuurt naar het inlogscherm, waar Kevin weer met Google
inlogt.

Overwogen en niet gedaan: de beheerderssessie bewaren zodat terugkeren één klik
is. Dat vraagt een inlogtoken van het beheerdersaccount in de browser. Twee
klikken zijn dat niet waard.

De balk staat altijd in beeld, zodat niemand per ongeluk denkt dat hij als
zichzelf werkt.

## 8. Testaccounts tellen nergens mee

Eén gedeelde plek: `src/lib/testaccounts.js`, met
`isTestaccount(user)` en `zonderTestaccounts(lijst)`, en tests daarbij.

Toepassen in:

| Plek | Wat er verandert |
| --- | --- |
| `src/services/klasService.js:153` | leerlingen van een klas |
| `src/components/dashboard/ClassOverview.jsx:385` | klasoverzicht en nakijkwerk |
| `src/pages/AdminLeerlingenPage.jsx:56` | leerlingbeheer |
| `src/pages/AdminTokenManagementPage.jsx:82` | tokenbeheer |
| `src/services/voortgangService.js:461,515` | voortgang per klas; filteren op de uid's van testaccounts |
| `functions/index.js`, `buildNulmetingProfielCore` | testleerlingen overslaan bij een klasberekening |

Firestore kan niet filteren op "veld afwezig of ongelijk", dus het filter
gebeurt na het ophalen, in de gedeelde helper. Dat is hier prima: het gaat om
tientallen leerlingen per klas.

## 9. Beveiligingsregels

In `firestore.rules`, bij `match /users/{userId}`: een gebruiker mag zijn eigen
`isTestaccount` niet wijzigen, net zoals hij zijn rol niet mag wijzigen. Dat is
een uitbreiding van de bestaande functie `rolBlijftGelijk()` naar
`rolEnTestvlagBlijvenGelijk()`. Admins mogen het wel.

Verder verandert er niets: een testleerling is voor de regels een gewone
leerling en ziet dus alleen zijn eigen werk.

## 10. Wat er misgaat en wat er dan gebeurt

| Situatie | Gedrag |
| --- | --- |
| De functie geeft een fout | melding op de pagina, de sessie wisselt niet |
| Het token is verlopen of ongeldig | melding "start de testsessie opnieuw" |
| Testaccount bestaat nog niet | de kaart toont "nog geen testleerling; draai het script" |
| Klas zonder toegewezen lesstof | de kaart zegt dat, in plaats van een lege lijst |
| Testleerling staat in een klas die niet meer bestaat | melding op de kaart |

## 11. Testplan

Unit (`node --test src/lib/`):

- `testaccounts.js`: herkent de vlag, laat gewone leerlingen staan, gaat goed om
  met een lege lijst en met een ontbrekend veld.
- de berekening voor "wat de leerling echt ziet": paragraaf zichtbaar,
  paragraaf geblokkeerd door de leerroute, blokselectie die blokken weglaat,
  ontbrekende snapshot.

Functies (`functions/index.test.js`):

- geen inlog: `unauthenticated`;
- leerling die het probeert: `permission-denied`;
- admin met een echte leerling als doel: `permission-denied`;
- admin met een testaccount: geeft een token terug.

Handmatig, na de uitrol:

1. Start de testsessie voor H1K2 en controleer dat je H2 ziet en de nulmeting.
2. Maak quiz 2.1 af en kijk of de tokens en de voortgang kloppen.
3. Ga terug naar beheer en kijk of die voortgang op de testpagina staat.
4. Open het klasoverzicht van H1K2: de testleerling staat er niet tussen.
5. Start de testsessie voor H1i1 en controleer dat H2 daar niet staat.

## 12. Uitrol

1. `node scripts/maak-testleerlingen.mjs` (dry run), daarna `--apply`.
2. `npx firebase deploy --only functions:startTestleerlingSessie`.
3. `npx firebase deploy --only firestore:rules --project pythagoras-eoa`.
4. `npx vercel --prod --yes`.

Opruimen van testdata kan met het bestaande
`scripts/wis-werk-leerling.mjs`; daar komt geen knop voor.

## 13. Niet in scope

- Inloggen als een echte leerling.
- Een knop om testdata te wissen.
- Testaccounts zichtbaar maken in de gewone overzichten met een schakelaar.
- Testen van meerdere klassen tegelijk in één sessie.

## 14. Open punten

1. Mag de testpagina ook voor supervisors, of alleen voor admins?
2. Moet de testleerling meetellen in de tokenshop-voorraad, of moet die voor
   testaccounts ongemoeid blijven?
