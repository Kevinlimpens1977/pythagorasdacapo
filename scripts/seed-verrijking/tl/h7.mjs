// Verrijkingslaag hoofdstuk 7 - Kunstmatige intelligentie en chatbots (tl).
//
// Bron van de lesstof: les 16 en les 17 van het Wikiwijs-arrangement van
// DaCapo College. 7.5 en 7.6 zijn toegevoegd en in eigen woorden geschreven,
// met de bronnen in de theorietekst van scripts/seed-structuur/tl/h7.mjs.
//
// Het patroon van dit bestand staat in scripts/seed-verrijking/PATROON.md.
//
// STARTVRAGEN - waar ze echt staan
// --------------------------------
// De startcheck staat in scripts/seed-structuur/tl/h7.mjs onder `checks`, als
// objecten met vraag, antwoord, uitleg en leerdoel. De generator zet dat blok
// VOOR de twee theorieblokken, zet de Digidocent uit en klapt de uitleg dicht.
// Er is precies één startvraag per leerdoel van de paragraaf: 7.1 t/m 7.4 en
// 7.6 hebben drie leerdoelen en drie startvragen, 7.5 heeft er twee en krijgt
// een derde vraag die de leerling zijn eigen gaten laat opsporen.
// De oefenstap (samen, zelf, steun, plus) staat daar onder `oefenen`.
//
// DE TOETSMATRIJS VAN 7.5 (aangepast in ronde 3, overgetypt hersteld in ronde 4)
// ------------------------------------------------------------------------------
// Hoofdstuk 7 heeft twaalf verplichte leerdoelen in 7.1 t/m 7.4, drie per
// paragraaf, plus de twee eigen koepeldoelen van de checkpoint 7.5. De
// blauwdruk noemt twee dingen over de hoofdstuktoets: een band van 15 tot 20
// vragen (merk: ontwerpkeuze, zonder onderzoek eronder) en de eis dat elk
// leerdoel minstens twee keer bevraagd wordt (merk: bewijs, want het
// toetseffect straalt aantoonbaar niet uit naar niet-bevraagde stof, g=0,01 en
// g=0,04). Die twee kunnen hier niet allebei. De bewezen regel wint, dus de
// toets telt 28 vragen en raakt elk doel precies twee keer:
//
//   7.1  doel 1 -> T1, T13    doel 2 -> T2, T14    doel 3 -> T3, T15
//   7.2  doel 1 -> T4, T16    doel 2 -> T5, T17    doel 3 -> T6, T18
//   7.3  doel 1 -> T7, T19    doel 2 -> T8, T20    doel 3 -> T9, T21
//   7.4  doel 1 -> T10, T22   doel 2 -> T11, T23   doel 3 -> T12, T28
//   7.5  doel 1 -> T24, T25   doel 2 -> T26, T27
//
// De nummering is de volgorde van de `vragen`-lijst van 7.5 hieronder, zoals
// die ook in docs/seeds/digitale-vaardigheden-vmbo1.seed.json terechtkomt.
// Let op de staart: T28 (de drie schoolregels over AI-gebruik) hangt aan het
// derde doel van 7.4 en staat achter de vier vragen van 7.5. In ronde 3 stond
// die staart in deze kop verkeerd overgetypt (T24 t/m T28 een plek opgeschoven);
// dat is hier hersteld. Controleer deze regels tegen de gegenereerde seed, niet
// tegen de vorige versie van deze kop.
//
// In ronde 2 kregen de twee eigen doelen van 7.5 ("uitleggen hoe AI werkt en
// waar je op moet letten", "een prompt schrijven en het antwoord kritisch
// beoordelen") geen toetsvraag; ze werden alleen afgerekend op het AI-dossier.
// De criticus wees er terecht op dat PATROON.md regel 83-84 onomwonden zegt dat
// een leerdoel zonder startvraag, oefening, afsluitvraag en toetsitem niet af
// is. Ze hebben nu alle vier:
//   startvraag  -> `checks` van 7.5 in scripts/seed-structuur/tl/h7.mjs;
//   oefening    -> het oefenblok van 7.5, opgaven samen/zelf/steun/plus;
//   afsluitvraag-> de diagnostische ronde in datzelfde oefenblok, doel 13 en 14;
//   toetsitem   -> T24 t/m T27 hieronder, twee per doel.
// Bij een checkpoint vallen de afsluitquiz en de hoofdstuktoets samen; de
// diagnostische ronde is daarom de ophaalstap die bij een gewone paragraaf de
// afsluitquiz zou zijn.
//
// 7.6 blijft er compleet buiten: geen van de 28 toetsvragen hangt aan een
// leerdoel van de vrijwillige plusparagraaf.
//
// TERUGKEERVRAGEN
// ---------------
// Elke afsluitquiz telt zes vragen (7.2 en 7.6 tellen er zeven, zie hieronder),
// waarvan de laatste terugkeervragen zijn uit eerdere stof, zoals de blauwdruk
// vraagt:
//   7.1 -> hoofdstuk 6 (algoritme, deepfake)*    7.2 -> 7.1 en hoofdstuk 6
//   7.3 -> 7.1 en hoofdstuk 4 (Word-opmaak)      7.4 -> 7.3 en 7.2
//   7.6 -> 7.4 (twee keer) en 7.1
// Let op: de mechanische controle telt een terugkeervraag af aan het veld
// `leerdoel` van de vraag, niet aan de tekst van de prompt. Een vraag die in de
// prompt naar 7.1 verwijst maar op een doel van de eigen paragraaf getagd is,
// telt dus niet mee. Dat was in ronde 7 nog in drie quizzen het geval.
// * 7.1 is de UITZONDERING en telt mechanisch NUL terugkeervragen. Nageteld in
//   de seed: quiz-5 hangt aan "Je kunt voorbeelden geven van AI die je elke dag
//   gebruikt" en quiz-6 aan "Je kunt uitleggen wat kunstmatige intelligentie
//   is", allebei doelen van 7.1 zelf. Alleen de prompt verwijst naar hoofdstuk
//   6. Dat kan hier niet anders: 7.1 is de eerste paragraaf van het hoofdstuk,
//   dus er is geen eerder h7-doel om aan te taggen, en doelen van hoofdstuk 6
//   staan niet in de DOEL-tabel van dit bestand. Voor de leerling klopt de
//   terugkeer; voor de teller niet. Lees de regel hierboven dus als "de prompt
//   grijpt terug op hoofdstuk 6", niet als "de tag wijst naar hoofdstuk 6".
//
// SCAFFOLDINGROLLEN
// -----------------
// In elke afsluitquiz komen alle vijf de rollen voor: ik_doe_voor (bouwt
// rechtstreeks voort op het uitgewerkte voorbeeld erboven), samen_oefenen (de
// vraag wijst de denkstap aan), zelf_proberen, reflecteren en bewijs_leveren.
// De hoofdstuktoets is summatief en gebruikt daarom alleen zelf_proberen,
// reflecteren en bewijs_leveren.
//
// 7.6 is de vrijwillige plusparagraaf. De hoofdstuktoets in 7.5 stelt er geen
// enkele vraag over: geen van de 28 toetsvragen hangt aan een leerdoel van 7.6.
//
// WAT ER IN RONDE 3 IS BIJGEKOMEN
// -------------------------------
// * 7.2 heeft er een zevende vraag bij: de bronvraag uit les 16 regel 120-121
//   ("AI maakt dus wel eens fouten... Kunnen deze fouten gevaarlijk zijn?").
//   Die stond alleen nog als kijkvraag bij het mediablok, dus zonder feedback,
//   zonder tokens en zonder plek in de nakijkstapel. Zijn twee buurvragen uit
//   dezelfde les waren wel bewaard, dus dat was een inconsequente degradatie.
//   Hij staat nu als open vraag met modelAnswer en nakijkpunten, vóór de twee
//   terugkeervragen. De kijkvraag bij de video blijft ongewijzigd staan.
// * 7.5 heeft er vier toetsvragen bij (T24 t/m T27) op zijn eigen twee doelen.
// * Zes idiomen die een brugklasser niet kent zijn uit de feedback, de
//   uitgewerkte voorbeelden en de theorie verdwenen (struikelen, leunen op,
//   glippen, een zeldzaam mankement, uit de verf komen, wegwuiven), en "zo een"
//   is "zo'n" geworden.
//
// WAT ER IN RONDE 4 IS HERSTELD
// -----------------------------
// * T27 vroeg bijna letterlijk hetzelfde als T20: "schrijf een prompt over een
//   onderwerp uit een ander vak en wijs de vier onderdelen aan". Daardoor was
//   het doel "een prompt schrijven en het antwoord kritisch beoordelen" voor
//   tweederde al beantwoord door de vraag ervoor. T27 geeft nu een kant-en-klare
//   prompt van een klasgenoot mét het antwoord erbij; de leerling wijst aan
//   welke twee promptonderdelen de vorm sturen en levert daarna het controleplan.
//   T20 (zelf een prompt schrijven en de vier onderdelen benoemen) blijft staan.
// * De matrijs hierboven stond verkeerd overgetypt: T24 t/m T28 waren een plek
//   opgeschoven ten opzichte van de gegenereerde seed. Hersteld en nagelopen in
//   docs/seeds/digitale-vaardigheden-vmbo1.seed.json.
// * "controleplicht" uit de feedback van 7.4 vraag 5 vervangen door "je moet het
//   antwoord nog steeds controleren"; dat woord werd nergens uitgelegd.
// Drie kleinere herstellingen staan in scripts/seed-structuur/tl/h7.mjs.
//
// WAT ER IN RONDE 6 IS HERSTELD
// -----------------------------
// De vier afkeurpunten van ronde 5 zaten bijna allemaal in het structuurbestand;
// de volledige lijst met bronregels staat in de kop van
// scripts/seed-structuur/tl/h7.mjs onder "WAT ER IN RONDE 6 IS HERSTELD".
// In DIT bestand zijn drie dingen aangepast, alle drie als gevolg daarvan:
// * 7.1 samenvatting. Er stond alleen dat een AI-systeem leert van data die jij
//   achterlaat. Daar staat nu achter wanneer dat leren gebeurt: pas in een
//   volgende trainingsronde, niet tijdens jouw eigen gesprek. Zo herhaalt de
//   samenvatting de correctie uit 7.1 theorieblok B in plaats van alleen de
//   halve bronclaim.
// * 7.3 samenvatting. De bron noemt drie dingen die een chatbot doet: teksten
//   schrijven, vragen beantwoorden en helpen met ideeën (les 16, alinea
//   "Chatbots"). Dat derde ontbrak in het hele hoofdstuk. Het staat nu in 7.3
//   theorieblok A en in deze samenvatting.
// * 7.6, de laatste vraag van de quiz. Die vroeg de leerling de tegenspraak op
//   te lossen tussen "een chatbot leert van wat jij schrijft" (7.1) en "het
//   model leert tijdens jouw gesprek niets". Die tegenspraak bestaat niet meer,
//   want 7.1 en 7.4 vertellen het nu allebei zelf. De vraag is daarom verdieping
//   geworden: leg met de drie trainingsfases uit deze plusparagraaf uit waarom
//   het model tijdens jouw gesprek niets kan bijleren. In ronde 6 stond hier dat
//   modelantwoord, nakijkpunten en feedback "ongewijzigd bruikbaar gebleven"
//   waren. Dat was NIET nagemeten en het klopte ook niet; zie ronde 7 hieronder.
// De toetsmatrijs hierboven is NIET veranderd: de hoofdstuktoets telt nog steeds
// 28 vragen en 7.6 blijft er buiten.
//
// WAT ER IN RONDE 7 IS HERSTELD
// -----------------------------
// (1) 7.6 QUIZVRAAG 6, HET BEWIJS_LEVEREN-ITEM. De prompt was in ronde 6
//     herschreven naar de drie trainingsfases, maar modelantwoord, nakijkpunten
//     en feedback waren die van de geschrapte vraag. Het modelantwoord opende
//     met "Allebei kloppen ze", terwijl er in de nieuwe prompt geen "allebei"
//     meer stond, en noemde geen enkele trainingsfase. Alle drie zijn opnieuw
//     geschreven op de nieuwe prompt: het modelantwoord loopt de voortraining,
//     het leren opvolgen van opdrachten en het beoordelen door mensen langs, de
//     drie nakijkpunten controleren precies die drie stappen, en de feedback
//     gaat over trainen tegenover gebruiken in plaats van over een tegenspraak.
//     Nagemeten tegen de prompt, niet tegen de vorige versie van deze kop.
// (2) 7.4 AFSLUITQUIZ VRAAG 6 hing aan het verkeerde leerdoel. De vraag gaat
//     over persoonlijke gegevens delen en was getagd op "wat je met een chatbot
//     wel en niet mag doen voor schoolwerk". Daardoor telde die quiz dat doel
//     drie keer (q3, q4, q6) en kreeg het 7.2-doel over persoonlijke gegevens
//     geen terugkeercredit. De tag is nu "Je weet waarom je geen persoonlijke
//     gegevens deelt met AI." De vraag zelf is ongewijzigd.
// (3) DE LANGSTE KNOP. Blindgokken op de langste optie leverde 15 van de 33
//     meerkeuzevragen goed op (45,5 procent), tegen 30 procent suitebreed. In
//     zes vragen is dat rechtgezet door de goede optie in te korten of een
//     afleider aan te vullen, zonder inhoud te verliezen: 7.1 q4, 7.3 q1, 7.5
//     q7, 7.5 q11, 7.5 q12 en 7.6 q1. Nagemeten: 9 van de 33, 27,3 procent, met
//     de positieverdeling ongewijzigd op 8/12/7/6.
// (4) WEKEN OF MAANDEN. De feedback bij 7.6 quizvraag 1 zei dat de training
//     maanden duurt, terwijl theorieblok A van diezelfde paragraaf "weken
//     rekenwerk op duizenden computers" zegt. De feedback zegt nu ook weken.
// De vier andere ronde-7-reparaties staan in scripts/seed-structuur/tl/h7.mjs.
//
// WAT ER IN RONDE 8 IS HERSTELD
// -----------------------------
// De validator (mechanische controle 3, terugkeervraag in de afsluitquiz) meldde
// 7.2, 7.3 en 7.6. In alle drie de quizzen STOND de terugkeervraag al - de kop
// hierboven onder TERUGKEERVRAGEN beschreef ze zelfs - maar het veld `leerdoel`
// wees naar een doel van de paragraaf zelf. De controle telt de terugkeer aan
// dat veld af, niet aan de prompt, dus de vraag telde niet mee. Bijgewerkt:
// (1) 7.2 QUIZVRAAG 6 ("in paragraaf 7.1 las je dat AI niets begrijpt maar
//     patronen zoekt") hing aan het 7.2-doel over voordeel en gevaar. De vraag
//     meet vooral of de leerling het 7.1-idee kan gebruiken, dus de tag is nu
//     "Je weet dat AI leert van data en niet denkt zoals een mens." Doel 1 van
//     7.2 houdt twee vragen over (q1 en q5), dus er raakt niets onbevraagd.
// (2) 7.3 QUIZVRAAG 5 ("in paragraaf 7.1 las je dat AI voorspelt in plaats van
//     begrijpt") hing aan het promptdoel van 7.3, terwijl het eerste nakijkpunt
//     letterlijk vraagt of de leerling het idee uit 7.1 gebruikt. Dezelfde tag
//     als hierboven. Het promptdoel houdt q2 en q3 over.
// (3) 7.6 kon niet omgetagd worden: quizvraag 5 was de enige vraag op het doel
//     "waarom AI zelfverzekerd klinkt terwijl het fout kan zijn", en dat doel
//     zou dan zonder afsluitvraag komen te staan. Er is daarom een vraag
//     BIJGEKOMEN, tussen q4 en q5: een meerkeuzevraag op het 7.4-doel "Je kunt
//     controleren of het antwoord van een chatbot klopt." Hij verbindt de
//     controlestap uit 7.4 met wat 7.6 erover toevoegt: de training ligt in het
//     verleden, dus gegevens met een datum eraan verouderen het snelst. De quiz
//     van 7.6 telt daardoor zeven vragen. De goede optie is bewust niet de
//     langste, zodat controle 2 op vier meerkeuzevragen op 0 blijft staan.
// De hoofdstuktoets van 7.5 is NIET aangeraakt: nog steeds 28 vragen, elk
// verplicht leerdoel twee keer, en geen enkele vraag over 7.6.
//
// WAT ER IN RONDE 9 IS HERSTELD
// -----------------------------
// De twee blokkerende punten van ronde 8 zaten allebei in het structuurbestand
// (de robotafbeelding die alleen als bewering bestond, en de telfout "de vier
// paragrafen van dit hoofdstuk" in 7.5). Ze staan met bronregels erbij in de kop
// van scripts/seed-structuur/tl/h7.mjs onder "WAT ER IN RONDE 9 IS HERSTELD",
// samen met de vijf verbeterpunten. In DIT bestand is één ding aangepast:
// * 7.6, het uitgewerkte voorbeeld bij theorieblok B. "identieke
//   sollicitatiebrieven" is vervangen door "sollicitatiebrieven die woord voor
//   woord hetzelfde waren, alleen de naam bovenaan verschilde". De criticus
//   merkte terecht op dat een leerling van 12 het woord identiek niet kent, en
//   dat een vrijwillige plusparagraaf daarvoor geen excuus is als de uitleg
//   zonder dat woord net zo kort kan.
// De toetsmatrijs is NIET veranderd: nog steeds 28 vragen, elk verplicht
// leerdoel twee keer, geen enkele vraag over 7.6. T16 (het positieve effect met
// een gevaar erbij) en T25 (de volledige uitleg van hoe AI werkt) blijven staan;
// de formatieve tegenhangers ervan zijn in het structuurbestand van vorm
// veranderd, zodat de vier meetmomenten per doel vier verschillende vormen
// hebben in plaats van vier keer dezelfde zin.
//
// WAT ER IN RONDE 11 IS HERSTELD
// ------------------------------
// De drie blokkerende punten van ronde 10 zaten alle drie in het
// structuurbestand (de lesindeling van 7.5, de telfout over de oefenopgaven en
// de verwijzing naar een screenshot die er nog niet was). Ze staan met de
// nagemeten blokvolgorde erbij in de kop van scripts/seed-structuur/tl/h7.mjs
// onder "WAT ER IN RONDE 11 IS HERSTELD". In DIT bestand is drie keer iets
// aangepast, alle drie op verbeterpunten van de criticus:
// * ALLE TIEN DE WAAR-NIET-WAAR-VRAGEN HEBBEN NU UITLEG PER OPTIE. Ze stonden
//   in de korte vorm (waar: true/false), en die vult in de generator lege
//   explanation- en misconception-velden; de blauwdruk vraagt juist uitleg per
//   antwoordoptie. Ze zijn nu uitgeschreven als type: 'waar-niet-waar' met de
//   twee opties Waar en Niet waar in die volgorde, met een explanation op de
//   goede knop en de denkfout in misconception op de foute. De feedback per
//   vraag is woordelijk ongewijzigd, dus er is niets verdwenen. Nagemeten in
//   docs/seeds/digitale-vaardigheden-vmbo1.seed.json: 10 waar-niet-waar-items
//   in h7 tl, nul met een lege optie-uitleg.
// * T27 IS LICHTER OM TE LEZEN, NIET LICHTER OM TE MAKEN. De vraag stond als
//   plek 27 van 28 en was één doorlopende alinea met twee citaten, een
//   tweeledige aanwijsopdracht en een controleplan met drie eisen. Hij is NIET
//   verzet: de toetsmatrijs hierboven koppelt elk T-nummer aan een leerdoel, en
//   verschuiven breekt die verantwoording. De opdracht staat nu als drie
//   genummerde korte vragen onder de citaten. Geen eis is vervallen; de drie
//   nakijkpunten en het modelantwoord zijn woordelijk ongewijzigd.
// * AFLEIDER 1 BIJ 7.1 QUIZVRAAG 1 WAS OP ZICHZELF WAAR. "De tijdlijn heeft
//   internet nodig en de rekenmachine niet" klopt als losse bewering, ook al
//   maakt de vraagstelling duidelijk dat hij niet het gevraagde antwoordt. Hij
//   luidt nu "De tijdlijn heeft internet nodig, en alleen programma's met
//   internet zijn AI": dezelfde denkfout, maar als geheel onwaar. De
//   misconception noemt gezichtsherkenning als AI die offline werkt.
// De toetsmatrijs is NIET veranderd: nog steeds 28 vragen, elk verplicht
// leerdoel twee keer, geen enkele vraag over 7.6.
//
// WAT ER IN RONDE 12 IS BIJGEKOMEN
// --------------------------------
// EEN TWEEDE TERUGKEERVRAAG IN DE AFSLUITQUIZ VAN 7.2. De blauwdruk vraagt per
// afsluitquiz twee vragen uit eerdere paragrafen; dat is de spreiding op
// paragraafniveau. Nageteld over het hele hoofdstuk had alleen 7.2 er een:
// 7.1 heeft er twee (allebei terug naar hoofdstuk 6), 7.3 twee (naar 7.1 en naar
// de koppenstijlen uit hoofdstuk 4), 7.4 twee (naar de vage prompt uit 7.3 en
// naar de persoonlijke gegevens uit 7.2) en 7.6 drie. In 7.2 stond alleen de
// open vraag die teruggrijpt op "AI begrijpt niets" uit 7.1.
// De nieuwe vraag staat als vijfde item onder '7.2', direct achter de laatste
// meerkeuzevraag, zodat de meerkeuzevragen bij elkaar blijven staan en de drie
// open vragen de quiz blijven afsluiten. Hij hangt aan het leerdoel van 7.1 over
// dagelijkse AI en vraagt welke van vier handelingen NIET via AI liep. Het goede
// antwoord is pinnen bij de kassa, en dat is bewust dezelfde scheidslijn als de
// samenoefening over de pinautomaat in 7.1: verandert het systeem door wat jij
// doet? Andere handelingen, andere volgorde, dus de leerling moet de regel
// ophalen en niet een eerder item herkennen. De drie afleiders zijn stuk voor
// stuk systemen die de leerling in zijn eigen AI-logboek uit 7.1 heeft staan.
// Positie en lengte nagemeten: het goede antwoord staat op plek 3 (7.2 had
// 2, 4, 2, 1) en is van de vier opties de kortste, dus niet op lengte te raden.
// Nagemeten na de wijziging in docs/seeds/digitale-vaardigheden-vmbo1.seed.json:
// tl telt 715 blokken en 603 vragen, met 603 unieke feedbackzinnen, en de zes
// mechanische controles blijven op 0 bevindingen staan.
//
// De hoofdstukbrede blauwdrukonderdelen (voorkennischeck over hoofdstuk 6,
// deeltoets over 7.1 en 7.2, diagnostische ronde voor de hoofdstuktoets) staan
// in het structuurbestand, in `checks` en `oefenen`. Zie de kop van
// scripts/seed-structuur/tl/h7.mjs, punt A, B en C. De deeltoets is in ronde 6
// van zes naar acht vragen gegaan; die vragen staan in het structuurbestand,
// niet hier.

export default {
  '7.1': {
    learningGoals: [
      'Je kunt uitleggen wat kunstmatige intelligentie is.',
      'Je weet dat AI leert van data en niet denkt zoals een mens.',
      'Je kunt voorbeelden geven van AI die je elke dag gebruikt.'
    ],
    theorie: [
      {
        keyTerms: ['kunstmatige intelligentie', 'machine learning', 'computerprogramma'],
        exampleHtml: [
          '<p><strong>Vraag:</strong> Op je telefoon staan twee programma\'s die er allebei simpel uitzien, maar die heel verschillend werken. De rekenmachine geeft altijd 12 als je 7 + 5 intypt, hoe vaak je het ook probeert. De tijdlijn van TikTok laat vandaag heel andere filmpjes zien dan vorige week, zonder dat jij iets instelde. Welke van de twee gebruikt kunstmatige intelligentie, en waaraan kun jij dat verschil precies aflezen?</p>',
          '<p><strong>Antwoord:</strong> Dat is de tijdlijn, en het verschil zit hem in wat er bij herhaling gebeurt. De rekenmachine volgt een vaste regel die iemand er ooit in zette, dus dezelfde invoer geeft altijd hetzelfde. De tijdlijn verandert juist omdat het systeem leert van wat jij bekijkt, weglegt of opnieuw aanklikt. Dat leren van voorbeelden heet machine learning, en het onderscheidt AI van een programma met vaste regels. Let ook op wat er niet gebeurt: de app begrijpt niet waarom jij die filmpjes leuk vindt. Hij ziet alleen een patroon en rekent uit wat jij waarschijnlijk nog een keer bekijkt.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['data', 'simuleert', 'voorspelling', 'spraakassistenten'],
        exampleHtml: [
          '<p><strong>Vraag:</strong> Sam zegt stellig: ik gebruik helemaal geen AI, want ik heb ChatGPT nog nooit geopend. Klopt die bewering, en hoe zou jij hem van het tegendeel overtuigen?</p>',
          '<p><strong>Antwoord:</strong> Nee, want Sam gebruikt AI de hele dag door zonder dat hij daar ooit bewust voor kiest. Hij ontgrendelt zijn telefoon met zijn gezicht, krijgt aanbevelingen in Spotify en in YouTube, en typt met woordsuggesties. Daar komt het filter bij dat hij op Snapchat over zijn gezicht legt voor een grappige foto. Dat zijn vijf AI-systemen op een gewone ochtend, en geen enkele daarvan is een chatbot. Het verschil met ChatGPT is alleen dat jij daar zelf een vraag intypt en om antwoord vraagt. Bij de rest levert de AI ongevraagd een voorspelling, en juist daarom valt het gebruik niemand op.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Met kunstmatige intelligentie doen computers taken die normaal alleen mensen kunnen, zoals leren en beslissen. Een AI-systeem leert van data die jij achterlaat, maar begrijpt niets: elk antwoord is een voorspelling. Dat leren gebeurt pas in een volgende trainingsronde, niet tijdens jouw eigen gesprek. Je gebruikt AI elke dag in gezichtsherkenning, in je tijdlijn, in je muziek-app en in Google.</p>',
      keyTerms: ['kunstmatige intelligentie', 'data', 'voorspelling']
    },
    vragen: [
      {
        prompt: 'In het uitgewerkte voorbeeld bij theorieblok A stonden een rekenmachine en een tijdlijn naast elkaar. Waaraan zie je dat alleen de tijdlijn AI gebruikt?',
        leerdoel: 'Je kunt uitleggen wat kunstmatige intelligentie is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'De tijdlijn heeft internet nodig, en alleen programma\'s met internet zijn AI.', correct: false, misconception: 'Verwart online zijn met slim zijn; gezichtsherkenning werkt offline op je telefoon en is toch AI.' },
          { text: 'De tijdlijn verandert door wat jij bekijkt.', correct: true, explanation: 'De rekenmachine geeft bij dezelfde invoer altijd hetzelfde. Leren van voorbeelden is precies wat AI onderscheidt van een programma met vaste regels.' },
          { text: 'De tijdlijn kost geld en de rekenmachine is gratis.', correct: false, misconception: 'Zoekt het verschil bij de prijs in plaats van bij de werking.' },
          { text: 'De tijdlijn staat op een server en de rekenmachine op je telefoon.', correct: false, misconception: 'Denkt dat de plek van het programma bepaalt of het AI is.' }
        ],
        feedback: 'Het kenmerk van AI is leren, niet snelheid, prijs of een internetverbinding. Een vast programma geeft bij dezelfde invoer altijd hetzelfde antwoord.'
      },
      {
        prompt: 'Wie kan uit zichzelf leren?',
        leerdoel: 'Je weet dat AI leert van data en niet denkt zoals een mens.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Elk apparaat met een scherm, dus ook een tv of een telefoon.', correct: false, misconception: 'Denkt dat elk apparaat met een scherm ook leert.' },
          { text: 'Een systeem dat aan machine learning kan doen.', correct: true, explanation: 'Machine learning is precies dat: uit heel veel voorbeelden zelf een patroon halen.' },
          { text: 'Alleen mensen kunnen dat.', correct: false, misconception: 'Zet leren gelijk aan denken, terwijl een systeem kan leren zonder te begrijpen.' }
        ],
        feedback: 'Denkstap: vraag jezelf af of het apparaat verandert door wat het meemaakt. Een tv doet dat niet, een systeem met machine learning wel.'
      },
      {
        prompt: 'AI kan zelf denken, want om te kunnen leren moet je kunnen denken zoals een mens.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denkt dat leren zonder denken onmogelijk is; een systeem kan patronen bijstellen zonder iets te begrijpen.' },
          { text: 'Niet waar', correct: true, explanation: 'AI leert van data door zijn patronen bij te stellen. Denken vraagt bewustzijn en begrip, en dat heeft een model niet.' }
        ],
        leerdoel: 'Je weet dat AI leert van data en niet denkt zoals een mens.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Leren en denken zijn niet hetzelfde. Mensen hebben gevoelens, bewustzijn en intuïtie; AI begrijpt niets en doet menselijk gedrag alleen maar na.'
      },
      {
        prompt: 'Je zoekbalk vult je zin al aan voordat je klaar bent met typen. Wat doet de AI daar precies?',
        leerdoel: 'Je kunt voorbeelden geven van AI die je elke dag gebruikt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Hij zoekt in een groot woordenboek naar woorden die op jouw letters lijken.', correct: false, misconception: 'Ziet woordsuggesties als opzoeken in een lijst in plaats van als voorspelling.' },
          { text: 'Hij leest jouw gedachten via de camera van je telefoon.', correct: false, misconception: 'Kent AI een vermogen toe dat geen enkel systeem heeft.' },
          { text: 'Hij voorspelt uit eerder zoekgedrag welke woorden waarschijnlijk volgen.', correct: true, explanation: 'Uit heel veel eerdere zoekopdrachten leert het systeem welke woorden vaak achter elkaar staan.' },
          { text: 'Hij wacht tot een medewerker jouw zoekopdracht afmaakt.', correct: false, misconception: 'Denkt dat er mensen achter de schermen meelezen.' }
        ],
        feedback: 'Aanvullen is voorspellen. Het systeem weet niet waar je naar zoekt, het rekent uit wat mensen na zulke letters meestal typen.'
      },
      {
        prompt: 'In hoofdstuk 6 leerde je over het algoritme van social media. Wat heeft dat te maken met de AI uit deze paragraaf?',
        leerdoel: 'Je kunt voorbeelden geven van AI die je elke dag gebruikt.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        options: [
          { text: 'Allebei verzamelen ze gegevens over jouw gedrag en voorspellen daarmee wat jij wilt zien.', correct: true, explanation: 'Een aanbevelingsalgoritme is gewoon een vorm van AI: leren van jouw gedrag om te voorspellen.' },
          { text: 'Allebei zijn ze door dezelfde vier bedrijven gemaakt.', correct: false, misconception: 'Zoekt de overeenkomst bij de makers in plaats van bij de werking.' },
          { text: 'Er is geen overeenkomst: een algoritme volgt regels en AI denkt zelf.', correct: false, misconception: 'Zet algoritme en AI tegenover elkaar, terwijl AI juist met algoritmes werkt.' }
        ],
        feedback: 'Je tijdlijn uit hoofdstuk 6 en de AI van dit hoofdstuk zijn niet twee dingen maar één ding: leren van jouw gegevens om te voorspellen.'
      },
      {
        prompt: 'In hoofdstuk 6 leerde je hoe een deepfake gemaakt wordt. Leg met dat voorbeeld uit waarom mensen zeggen dat AI "denkt", en waarom dat toch niet klopt.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat kunstmatige intelligentie is.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een deepfake ziet er zo echt uit dat het lijkt alsof de computer snapt hoe een gezicht werkt. Mensen zeggen daarom dat AI denkt: het systeem leert van heel veel voorbeelden en wordt na elke fout beter. Toch klopt dat niet. De AI heeft geen gevoelens, geen bewustzijn en geen intuïtie, en weet niet wie de persoon op het beeld is. Hij rekent met patronen die hij uit duizenden foto\'s geleerd heeft, en maakt daarmee het beeld dat daar het beste bij past. AI simuleert menselijk gedrag; het doet het na zonder iets te begrijpen.',
        nakijkpunten: [
          'Gebruikt de deepfake uit hoofdstuk 6 als concreet voorbeeld en niet alleen als woord.',
          'Legt uit dat AI leert van heel veel voorbeelden of van fouten, en daardoor slim lijkt.',
          'Noemt het verschil tussen nadoen of berekenen en echt begrijpen.'
        ],
        feedback: 'De kern is het verschil tussen nadoen en begrijpen. Wie dat verschil kan uitleggen, snapt ook waarom je een AI-resultaat altijd zelf nakijkt.'
      }
    ]
  },

  '7.2': {
    learningGoals: [
      'Je kunt een voordeel en een gevaar van AI noemen.',
      'Je kunt kenmerken noemen waaraan je een AI-afbeelding kunt herkennen.',
      'Je weet waarom je geen persoonlijke gegevens deelt met AI.'
    ],
    theorie: [
      {
        keyTerms: ['patronen', 'privacyprobleem', 'deepfakes'],
        exampleHtml: [
          '<p><strong>Vraag:</strong> Een ziekenhuis laat AI meekijken met duizenden scans en vindt daardoor tumoren die een arts bijna nooit ziet. Precies diezelfde techniek is ook het gereedschap waarmee mensen deepfakes van bekende personen maken. Hoe kan een en dezelfde techniek zo\'n groot voordeel en zo\'n groot gevaar tegelijk opleveren?</p>',
          '<p><strong>Antwoord:</strong> Omdat beide op hetzelfde neerkomen: het herkennen van patronen in enorme hoeveelheden beeldmateriaal. Wie patronen in gezichten kan herkennen, kan diezelfde patronen ook gebruiken om een gezicht na te maken. Voordeel en gevaar zijn hier dus geen twee losse lijstjes, maar twee kanten van precies dezelfde vaardigheid. Daarom is de zinnige vraag nooit of AI goed of slecht is, maar wie het gebruikt en waarvoor. Daar hoort meteen een derde vraag bij, namelijk met wiens gegevens dat systeem getraind of gevoed is.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['AI-afbeelding', 'gegenereerd', 'persoonlijke gegevens'],
        exampleHtml: [
          '<p><strong>Vraag:</strong> Je ziet op een tijdlijn een foto van een bekende voetballer die iets heel schokkends doet. De foto is haarscherp, de kleuren kloppen en het account erachter heeft veertigduizend volgers. Wat doe je voordat je die foto gelooft of hem doorstuurt naar je groepsapp?</p>',
          '<p><strong>Antwoord:</strong> Je zoomt eerst in op de details die AI-beeld vaak fout weergeeft, want daar zitten de verraders. Kijk naar handen en vingers, naar oren en tanden, en naar tekst op shirts of op borden. Let ook op de rand tussen het haar en de achtergrond, want die loopt vaak vreemd over. Daarna zoek je dezelfde gebeurtenis op bij een nieuwssite die los staat van dit account. Vind je hem nergens anders terug, dan is doorsturen precies wat de maker van dat beeld wil. Onthoud dat een scherp beeld en veel volgers helemaal niets zeggen over de echtheid ervan.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>AI vindt sneller patronen dan mensen en helpt daarmee bijvoorbeeld artsen, maar levert ook een privacyprobleem op. Aan een AI-afbeelding zie je het soms nog aan handen met zes vingers of aan kleding die vreemd overloopt. Je persoonlijke gegevens deel je nooit met AI, want je weet niet waar ze terechtkomen.</p>',
      keyTerms: ['privacyprobleem', 'AI-afbeelding', 'persoonlijke gegevens']
    },
    vragen: [
      {
        prompt: 'In het uitgewerkte voorbeeld bij theorieblok A vond AI een tumor in een scan en maakte AI ook deepfakes. Wat is de gemeenschappelijke oorzaak?',
        leerdoel: 'Je kunt een voordeel en een gevaar van AI noemen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Allebei komen ze van hetzelfde bedrijf.', correct: false, misconception: 'Zoekt de verklaring bij de maker in plaats van bij de techniek.' },
          { text: 'Allebei draaien ze op het herkennen van patronen in heel veel beeld.', correct: true, explanation: 'Wie patronen in gezichten kan herkennen, kan die patronen ook namaken.' },
          { text: 'Allebei zijn ze per ongeluk ontstaan uit een fout in de code.', correct: false, misconception: 'Denkt dat het gevaar een programmeerfout is in plaats van dezelfde vaardigheid.' },
          { text: 'Allebei gebruiken ze het internet van het ziekenhuis.', correct: false, misconception: 'Verwart de plek waar iets draait met de manier waarop het werkt.' }
        ],
        feedback: 'Voordeel en gevaar komen hier uit dezelfde bron. Patroonherkenning die iets kan vinden, kan datzelfde ook namaken.'
      },
      {
        prompt: 'Welk detail verraadt het vaakst dat een foto door AI gemaakt is?',
        leerdoel: 'Je kunt kenmerken noemen waaraan je een AI-afbeelding kunt herkennen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'De foto is zwart-wit.', correct: false, misconception: 'Verwart een oude of artistieke foto met een nepfoto.' },
          { text: 'Het bestand is klein.', correct: false, misconception: 'Denkt dat bestandsgrootte iets zegt over de herkomst van een beeld.' },
          { text: 'De achtergrond is onscherp terwijl de persoon wel scherp is.', correct: false, misconception: 'Ziet een gewone scherptetruc van een echte camera aan voor een AI-fout.' },
          { text: 'Een hand met zes vingers of rare ogen.', correct: true, explanation: 'Ook kleding die vreemd overloopt hoort in dit rijtje. Juist bij details die het model zelden goed geleerd heeft, gaat het mis.' }
        ],
        feedback: 'Denkstap: kijk niet naar het geheel maar naar de randen en de kleine dingen. Vingers, oren, tanden, brilmonturen en letters zijn de zwakke plekken.'
      },
      {
        prompt: 'Is het verstandig om al jouw persoonlijke gegevens te delen met AI?',
        leerdoel: 'Je weet waarom je geen persoonlijke gegevens deelt met AI.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ja, dan weet de AI hoe je heet en waar je woont, en dat praat makkelijker.', correct: false, misconception: 'Ziet de chatbot als een vriend in plaats van als een dienst van een bedrijf.' },
          { text: 'Nee, want die gegevens kunnen onbedoeld in verkeerde handen terechtkomen.', correct: true, explanation: 'Alles wat je intypt komt bij een bedrijf terecht, en je weet niet hoe lang het bewaard wordt of wie het leest.' },
          { text: 'Alleen je adres is gevaarlijk, de rest mag gewoon.', correct: false, misconception: 'Denkt dat losse gegevens ongevaarlijk zijn, terwijl ze samen een compleet profiel vormen.' }
        ],
        feedback: 'Achter elke chatbot zit een bedrijf met medewerkers en servers. Wat jij typt is geen gesprek onder vier ogen, ook al voelt het zo.'
      },
      {
        prompt: 'Waarom moet je voorzichtig zijn met het gebruik van AI?',
        leerdoel: 'Je weet waarom je geen persoonlijke gegevens deelt met AI.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat je nooit weet waar jouw informatie terechtkomt.', correct: true, explanation: 'De mensen achter het systeem kun je ook niet altijd vertrouwen: je geeft je gegevens aan een bedrijf waarvan je niet weet hoe het ze opslaat of gebruikt.' },
          { text: 'Omdat AI dan weet waar je woont en langskomt om je fiets te stelen.', correct: false, misconception: 'Ziet AI als een persoon die zelf de deur uit kan, in plaats van als een programma.' },
          { text: 'Omdat je klasgenoten jou dan via een chatbot kunnen opzoeken.', correct: false, misconception: 'Denkt dat een chatbot een zoekmachine met profielen is.' }
        ],
        feedback: 'Het risico is niet dat de AI zelf iets doet, maar dat jouw gegevens ergens opgeslagen worden waar jij geen zicht op hebt.'
      },
      {
        prompt: 'In paragraaf 7.1 zette je in je AI-logboek welke systemen die dag iets voor jou kozen of herkenden. Welk van deze vier dingen liep NIET via AI?',
        leerdoel: 'Je kunt voorbeelden geven van AI die je elke dag gebruikt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'De volgorde van de filmpjes op je tijdlijn, die er elke dag anders uitziet.', correct: false, misconception: 'Denkt dat een vaste redactie die volgorde bepaalt; juist het wisselen verraadt een systeem dat van jouw kijkgedrag leert.' },
          { text: 'De woordsuggesties die boven je toetsenbord verschijnen tijdens het appen.', correct: false, misconception: 'Ziet aanvullen als opzoeken in een woordenlijst, terwijl het een voorspelling uit eerder taalgebruik is.' },
          { text: 'Pinnen bij de kassa met je pas en je pincode.', correct: true, explanation: 'De betaalautomaat volgt een vaste regel: dezelfde pas met dezelfde code geeft altijd hetzelfde resultaat, en er wordt niets geleerd.' },
          { text: 'Het ontgrendelen van je telefoon met je gezicht.', correct: false, misconception: 'Denkt dat gezichtsherkenning geen AI is omdat het offline werkt.' }
        ],
        feedback: 'De vraag uit je logboek werkt ook hier: verandert dit systeem door wat jij doet? Een betaalautomaat doet dat niet, de andere drie wel.'
      },
      {
        prompt: 'AI maakt dus wel eens fouten, zoals je gezien hebt in de video. Kunnen deze fouten gevaarlijk zijn? Leg je antwoord uit met een voorbeeld.',
        type: 'open',
        leerdoel: 'Je kunt een voordeel en een gevaar van AI noemen.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        modelAnswer: 'Ja, die fouten kunnen gevaarlijk zijn. Systemen als Siri, Google Home, Alexa, ChatGPT en de zoekbalk van Google gebruiken allemaal AI, en ze maken allemaal fouten. Hoe erg dat is, hangt af van waar het systeem voor gebruikt wordt. Een verkeerd aanbevolen liedje kost je niets, maar een verkeerd advies over medicijnen of een zelfrijdende auto die een bord verkeerd leest, kan iemand echt schade doen. Het gevaar zit er ook in dat het antwoord er net zo betrouwbaar uitziet als een goed antwoord, zodat mensen het geloven zonder te controleren. Daarom werken de bedrijven achter deze systemen er dagelijks aan om ze te verbeteren.',
        nakijkpunten: [
          'Het antwoord is ja, met een reden erbij en niet alleen een mening.',
          'Er staat een concreet voorbeeld in van een situatie waarin een AI-fout schade doet.',
          'Er wordt benoemd dat je aan het antwoord zelf niet ziet dat het fout is, of dat de gevolgen per systeem verschillen.'
        ],
        feedback: 'Het hangt af van de inzet. Dezelfde soort fout is onschuldig in een muziek-app en gevaarlijk in een auto, een ziekenhuis of een advies over gezondheid.'
      },
      {
        prompt: 'In paragraaf 7.1 las je dat AI niets begrijpt maar patronen zoekt. Leg uit waarom juist dat verklaart dat dezelfde techniek levens redt én mensen misleidt.',
        type: 'open',
        leerdoel: 'Je weet dat AI leert van data en niet denkt zoals een mens.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'AI zoekt patronen in heel veel gegevens en snapt niet waar die gegevens over gaan. Bij scans is dat een voordeel: het systeem ziet een patroon dat op een ziekte wijst en waarschuwt de arts, en dat kan een leven redden. Maar hetzelfde systeem kan die patronen ook nabouwen. Dan ontstaat er een deepfake of een gezicht dat niet bestaat. De techniek maakt geen onderscheid tussen goed en slecht gebruik, want die keuze ligt bij de mens die hem inzet.',
        nakijkpunten: [
          'Legt uit dat AI patronen zoekt zonder de betekenis ervan te begrijpen.',
          'Geeft één voorbeeld van nuttig gebruik en één van misleidend gebruik.',
          'Trekt de conclusie dat de keuze bij de gebruiker ligt en niet bij de techniek.'
        ],
        feedback: 'Het verband uit 7.1 doet hier het werk: herkennen en namaken zijn dezelfde rekentruc, alleen in een andere richting gebruikt.'
      },
      {
        prompt: 'Waarom dragen steeds betere AI-plaatjes bij aan meer verspreiding van nepnieuws? Leg je antwoord uit en gebruik daarbij wat je in hoofdstuk 6 over betrouwbare bronnen leerde.',
        type: 'open',
        leerdoel: 'Je kunt kenmerken noemen waaraan je een AI-afbeelding kunt herkennen.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Vroeger kon je aan een nepfoto vaak zien dat er iets niet klopte, bijvoorbeeld aan de handen of het licht. Omdat AI steeds meer leert, zien de plaatjes er nu bijna echt uit en zie je die fouten niet meer. Mensen geloven wat ze zien en sturen het door zonder te controleren. Daardoor verspreidt nepnieuws zich sneller en verder. Je moet dus niet meer op het beeld zelf afgaan, maar op de bron: staat hetzelfde nieuws ook bij een betrouwbare nieuwssite?',
        nakijkpunten: [
          'Legt uit dat AI-beeld steeds echter wordt en zichtbare fouten verdwijnen.',
          'Legt het verband met doorsturen of geloven zonder controleren.',
          'Noemt het controleren van de bron als oplossing, niet het beter bekijken van het plaatje.'
        ],
        feedback: 'De verschuiving is de kern: je kunt het niet meer aan het beeld zien, dus moet je het aan de bron zien. Dat is precies de vaardigheid uit hoofdstuk 6.'
      }
    ]
  },

  '7.3': {
    learningGoals: [
      'Je kunt uitleggen wat een chatbot is en drie bekende chatbots noemen.',
      'Je kunt een duidelijke prompt schrijven met opdracht, onderwerp, doelgroep en lengte.',
      'Je kunt het antwoord van een chatbot netjes verwerken in Word.'
    ],
    theorie: [
      {
        keyTerms: ['chatbot', 'ChatGPT', 'TalkAI'],
        exampleHtml: [
          '<p><strong>Vraag:</strong> Op een webshop opent een venster met de tekst: hoi, kies je vraag, retour, bezorging of betaling. Is dit dezelfde soort chatbot als ChatGPT, en waaraan zou jij dat in de praktijk merken?</p>',
          '<p><strong>Antwoord:</strong> Nee, dit is de simpele soort chatbot die vaste antwoorden geeft bij een paar vaste keuzes. Vraag je iets wat niet in dat lijstje staat, dan komt hij er niet uit en herhaalt hij het menu. ChatGPT, Google Gemini, Microsoft Copilot en TalkAI werken anders, want die vormen zelf een antwoord op jouw tekst. Ze kunnen dus ook reageren op een vraag die niemand van tevoren had bedacht of ingevoerd. Je herkent het verschil het snelst aan wat er gebeurt zodra je iets onverwachts vraagt.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['prompt', 'doelgroep', 'context'],
        exampleHtml: [
          '<p><strong>Vraag:</strong> Vergelijk twee prompts over hetzelfde onderwerp en let goed op wat er in de eerste allemaal ontbreekt. Prompt A is kort en vaag en luidt in zijn geheel: vertel wat over de VAR. Prompt B luidt: leg uit hoe de VAR bij voetbal werkt, in vijf zinnen, voor een leerling van twaalf jaar. Aan die tweede prompt is nog een eis over de stijl toegevoegd, namelijk gebruik geen Engelse woorden. Waarom levert prompt B bijna altijd een bruikbaarder antwoord op dan prompt A?</p>',
          '<p><strong>Antwoord:</strong> In prompt A ontbreekt alles behalve het onderwerp, dus moet de bot zelf gokken hoe lang het wordt. Hij weet ook niet hoe moeilijk het mag zijn of voor wie het bedoeld is. In prompt B staan alle vier de vaste onderdelen keurig bij elkaar in een enkele zin. Dat zijn de opdracht (leg uit), het onderwerp (de VAR), de doelgroep en de lengte. De eis over de stijl komt daar als extra keuze bovenop en is geen vast onderdeel. Krijg je toch niet wat je zocht, kijk dan welk onderdeel ontbreekt en voeg dat alsnog toe.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een chatbot is een programma waarmee je via tekst praat; ChatGPT, Google Gemini en TalkAI zijn bekende voorbeelden. Hij schrijft teksten, beantwoordt vragen en helpt je met het bedenken van ideeën. Je geeft je opdracht in een prompt, met vier onderdelen: wat je wil, waarover, voor welke doelgroep en hoe lang. Het antwoord verwerk je in Word met een titel, een leesbaar lettertype en de begrippen dikgedrukt.</p>',
      keyTerms: ['chatbot', 'prompt', 'doelgroep']
    },
    vragen: [
      {
        prompt: 'In het uitgewerkte voorbeeld bij theorieblok A stond een webshopvenster naast ChatGPT. Waaraan merk je in de praktijk het verschil?',
        leerdoel: 'Je kunt uitleggen wat een chatbot is en drie bekende chatbots noemen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Aan de kleur van het chatvenster op het scherm.', correct: false, misconception: 'Beoordeelt een chatbot op zijn uiterlijk in plaats van op wat hij kan.' },
          { text: 'Aan de snelheid: een AI-chatbot antwoordt altijd trager.', correct: false, misconception: 'Denkt dat rekenwerk altijd zichtbaar wordt in wachttijd.' },
          { text: 'Aan wat er gebeurt bij een vraag buiten het lijstje.', correct: true, explanation: 'De simpele soort loopt vast zodra je iets vraagt dat er niet in staat; een AI-chatbot vormt ook dan een antwoord.' },
          { text: 'Aan het aantal knoppen onder in beeld.', correct: false, misconception: 'Ziet de knoppen als het verschil in plaats van het antwoordvermogen erachter.' }
        ],
        feedback: 'Stel altijd een onverwachte vraag als test. Een keuzemenu geeft dan niets bruikbaars terug, een AI-chatbot wel.'
      },
      {
        prompt: 'Hoe noemen we de opdracht die je aan een chatbot geeft?',
        leerdoel: 'Je kunt een duidelijke prompt schrijven met opdracht, onderwerp, doelgroep en lengte.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Een taak.', correct: false, misconception: 'Kiest een gewoon Nederlands woord in plaats van de vakterm.' },
          { text: 'Een prompt.', correct: true, explanation: 'Prompt is de vakterm voor de vraag of opdracht die je aan een chatbot geeft.' },
          { text: 'Een commando.', correct: false, misconception: 'Verwart de vakterm met de term uit programmeertaal.' },
          { text: 'Een zoekopdracht.', correct: false, misconception: 'Denkt dat een chatbot hetzelfde doet als een zoekmachine.' }
        ],
        feedback: 'Denkstap: het woord slaat op wat jij intypt, niet op wat de bot teruggeeft. Prompt is het woord dat je overal terugziet, ook in het Engels.'
      },
      {
        prompt: 'Welke prompt levert het bruikbaarste antwoord op voor een werkstuk over slaap?',
        leerdoel: 'Je kunt een duidelijke prompt schrijven met opdracht, onderwerp, doelgroep en lengte.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Vertel wat over slaap, want ik moet er morgen iets over inleveren voor school.', correct: false, misconception: 'Denkt dat de bot zelf wel bedenkt wat je nodig hebt.' },
          { text: 'Slaap.', correct: false, misconception: 'Denkt dat een trefwoord genoeg is, zoals bij een zoekmachine.' },
          { text: 'Doe maar iets nuttigs over slapen, zo lang als je wil, dan zoek ik er zelf wel iets bruikbaars uit voor mijn werkstuk.', correct: false, misconception: 'Gebruikt vage woorden en verwacht toch een gericht antwoord.' },
          { text: 'Leg in 8 zinnen uit waarom tieners meer slaap nodig hebben dan volwassenen, voor een leerling van 12 jaar, in makkelijke woorden.', correct: true, explanation: 'Hier staan opdracht, onderwerp, doelgroep en lengte allemaal in, plus een eis over de stijl.' }
        ],
        feedback: 'Tel de onderdelen: opdracht, onderwerp, doelgroep en lengte. Ontbreekt er één, dan vult de chatbot dat zelf in.'
      },
      {
        prompt: 'Je plakt het antwoord van een chatbot in Word voor je opdracht. Wat doe je daarna?',
        leerdoel: 'Je kunt het antwoord van een chatbot netjes verwerken in Word.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Niets, want de chatbot maakt de opmaak al goed.', correct: false, misconception: 'Denkt dat geplakte tekst automatisch de opmaak van je document overneemt.' },
          { text: 'Alles in hoofdletters zetten zodat het opvalt.', correct: false, misconception: 'Verwart opvallen met leesbaar en verzorgd.' },
          { text: 'Het lettertype wijzigen in iets grappigs zodat het van jou lijkt.', correct: false, misconception: 'Denkt dat een ander lettertype van geleende tekst eigen werk maakt.' },
          { text: 'Een titel erboven zetten en een leesbaar lettertype kiezen.', correct: true, explanation: 'Neem grootte 11 of 12 en maak de begrippen dikgedrukt; dat is precies de opmaak die je in hoofdstuk 4 bij Word geleerd hebt.' }
        ],
        feedback: 'Geplakte tekst neemt vaak een vreemd lettertype en rare regelafstand mee uit de browser. Ruim dat altijd eerst op.'
      },
      {
        prompt: 'In paragraaf 7.1 las je dat AI voorspelt in plaats van begrijpt. Leg uit waarom een vage prompt daardoor bijna altijd een onbruikbaar antwoord oplevert.',
        type: 'open',
        leerdoel: 'Je weet dat AI leert van data en niet denkt zoals een mens.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'reflecteren',
        modelAnswer: 'Een chatbot begrijpt mijn vraag niet, hij voorspelt welk antwoord waarschijnlijk past. Als ik alleen "vertel wat over gamen" typ, is er geen enkele aanwijzing over lengte, doelgroep of onderwerp. Het model kiest dan het meest gemiddelde antwoord dat bij dat woord hoort, en dat is voor mij meestal onbruikbaar. Zet ik er wel opdracht, onderwerp, doelgroep en lengte bij, dan wordt de groep mogelijke antwoorden veel kleiner. Ik stuur het model dus niet met mijn bedoeling, maar met mijn woorden.',
        nakijkpunten: [
          'Gebruikt het idee uit 7.1 dat AI voorspelt in plaats van begrijpt.',
          'Legt uit dat een vage prompt te veel mogelijke antwoorden openlaat.',
          'Noemt minstens twee onderdelen die de prompt scherper maken.'
        ],
        feedback: 'Dit is de brug tussen 7.1 en 7.3: omdat het model voorspelt, bepaalt jouw formulering hoeveel ruimte er is om iets anders te kiezen.'
      },
      {
        prompt: 'In hoofdstuk 4 leerde je werken met Kop 1 en een automatische inhoudsopgave. Hoe helpt dat bij je document met chatbotopdrachten?',
        leerdoel: 'Je kunt het antwoord van een chatbot netjes verwerken in Word.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        options: [
          { text: 'Door elke opdracht een kop te geven, kun je later automatisch een inhoudsopgave laten maken.', correct: true, explanation: 'Kop 1 is niet alleen groter maar ook een label, en daar bouwt Word de inhoudsopgave mee op.' },
          { text: 'Door de tekst groter te maken herkent de docent dat het chatbottekst is.', correct: false, misconception: 'Denkt dat lettergrootte iets zegt over de herkomst van tekst.' },
          { text: 'Door koppen te gebruiken haalt Word de fouten uit het chatbotantwoord.', correct: false, misconception: 'Verwacht dat opmaak de inhoud controleert.' }
        ],
        feedback: 'Koppen zijn labels, geen versiering. Daarom kan Word er een inhoudsopgave uit bouwen en jij snel naar opdracht 4 springen.'
      }
    ]
  },

  '7.4': {
    learningGoals: [
      'Je weet wat hallucinatie bij een chatbot betekent.',
      'Je kunt controleren of het antwoord van een chatbot klopt.',
      'Je weet wat je met een chatbot wel en niet mag doen voor schoolwerk.'
    ],
    theorie: [
      {
        keyTerms: ['getraind', 'hallucinatie', 'controleren'],
        exampleHtml: [
          '<p><strong>Vraag:</strong> Je vraagt een chatbot naar het verschil tussen een dolfijn en een haai, en krijgt een vlot antwoord. De bot noemt er zelfs een boektitel en een bladzijdenummer bij, alsof hij het net heeft opgezocht. Waarom is juist die keurige bronvermelding een reden om extra goed op te letten?</p>',
          '<p><strong>Antwoord:</strong> Omdat een chatbot geen bronnenlijst raadpleegt op het moment dat jij je vraag intypt. Hij is getraind op enorme hoeveelheden tekst en schrijft daarna het woord dat waarschijnlijk volgt. Een titel die er echt uitziet is voor zo\'n model gewoon een waarschijnlijke reeks woorden en cijfers. Verzonnen boeken en bladzijdenummers zijn daarom een klassiek voorbeeld van hallucinatie bij een chatbot. Controleren doe je dus nooit door dezelfde vraag nog een keer aan diezelfde bot te stellen. Je zoekt de titel of het feit op bij een bron die helemaal los van de chatbot staat.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['persoonlijke informatie', 'eigen woorden', 'werkstuk'],
        exampleHtml: [
          '<p><strong>Vraag:</strong> Twee leerlingen gebruiken een chatbot voor hetzelfde werkstuk, maar ze doen dat op een heel andere manier. Jamal laat de bot acht zinnen schrijven en plakt die zinnen ongewijzigd in zijn eigen document. Iris laat de bot de moeilijke begrippen uit haar tekst halen en schrijft die begrippen daarna zelf uit. Wie van de twee werkt volgens de afspraken die op school gelden, en waarom precies?</p>',
          '<p><strong>Antwoord:</strong> Iris werkt volgens de afspraken, want zij gebruikt de chatbot als hulp en levert daarna eigen werk in. Jamal levert het werk van de bot in, en dat is precies wat bij een werkstuk niet mag. Docenten herkennen zulke tekst bovendien vaak, omdat AI-tekst gladder en onpersoonlijker leest dan leerlingtekst. Voor allebei geldt daarnaast dezelfde regel over privacy, en die staat los van de vraag wie mocht helpen. Zet geen persoonlijke informatie in de chat, dus ook geen namen, adressen of foto\'s van klasgenoten.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een chatbot is getraind op enorm veel tekst en voorspelt daaruit een waarschijnlijk antwoord. Verzint hij daarbij iets, dan heet dat hallucinatie, en dat ontdek je alleen door te controleren met een tweede bron. Voor school geldt: hulp vragen mag, je werkstuk laten schrijven niet, en je schrijft alles in je eigen woorden.</p>',
      keyTerms: ['hallucinatie', 'controleren', 'eigen woorden']
    },
    vragen: [
      {
        prompt: 'Maken chatbots fouten?',
        leerdoel: 'Je weet wat hallucinatie bij een chatbot betekent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Nee, chatbots kunnen alles opzoeken, dus ze hebben altijd gelijk.', correct: false, misconception: 'Denkt dat een chatbot live op internet zoekt en dus altijd klopt.' },
          { text: 'Ja, en dat noemen we hallucinatie: de chatbot verzint informatie als hij het niet zeker weet.', correct: true, explanation: 'Het model kiest het meest waarschijnlijke antwoord, ook als er geen juist antwoord bestaat.' },
          { text: 'Het kan wel, maar het gebeurt bijna nooit.', correct: false, misconception: 'Onderschat hoe vaak een vlot geformuleerd antwoord toch verzonnen is.' }
        ],
        feedback: 'Hallucinatie is geen storing maar een gevolg van de werking: het model maakt een waarschijnlijk antwoord, en waarschijnlijk is niet hetzelfde als waar.'
      },
      {
        prompt: 'Je twijfelt of een antwoord van een chatbot klopt. Wat is de beste manier om dat te controleren?',
        leerdoel: 'Je kunt controleren of het antwoord van een chatbot klopt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Dezelfde vraag nog een keer aan dezelfde chatbot stellen.', correct: false, misconception: 'Denkt dat een tweede poging van dezelfde bron een onafhankelijke controle is.' },
          { text: 'De chatbot vragen of hij het zeker weet.', correct: false, misconception: 'Vertrouwt op het zelfoordeel van een systeem dat altijd zeker klinkt.' },
          { text: 'Het feit opzoeken bij een onafhankelijke bron.', correct: true, explanation: 'Denk aan een nieuwssite, een encyclopedie of je schoolboek. Alleen een bron buiten de chatbot kan bevestigen of tegenspreken wat de chatbot zegt.' },
          { text: 'Kijken of het antwoord er netjes en professioneel uitziet.', correct: false, misconception: 'Ziet vorm aan voor bewijs; juist hallucinaties zien er verzorgd uit.' }
        ],
        feedback: 'Denkstap: vraag jezelf af wie er antwoordt. Een tweede mening van dezelfde bron is geen controle, want dat is hetzelfde model met dezelfde trainingsteksten.'
      },
      {
        prompt: 'Je mag een chatbot je werkstuk laten schrijven zolang je de tekst daarna nog een beetje aanpast.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denkt dat bijschaven achteraf de tekst tot eigen werk maakt, terwijl het denkwerk bij de bot bleef liggen.' },
          { text: 'Niet waar', correct: true, explanation: 'De vraag is steeds wie het werk deed. Een tekst die je alleen bijschaaft, blijft de tekst van de chatbot.' }
        ],
        leerdoel: 'Je weet wat je met een chatbot wel en niet mag doen voor schoolwerk.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Een werkstuk schrijf je zelf. Om hulp vragen of uitleg laten geven mag wel, maar de tekst die je inlevert is jouw tekst in jouw woorden.'
      },
      {
        prompt: 'Welk gebruik van een chatbot mag wel bij een werkstuk?',
        leerdoel: 'Je weet wat je met een chatbot wel en niet mag doen voor schoolwerk.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De hele inleiding laten schrijven en er je naam boven zetten.', correct: false, misconception: 'Denkt dat het alleen om het aantal overgenomen woorden gaat.' },
          { text: 'Een moeilijk stuk laten uitleggen en het daarna in je eigen woorden opschrijven.', correct: true, explanation: 'Zo gebruik je de bot als uitlegger, terwijl de tekst die je inlevert van jou blijft.' },
          { text: 'De bot je hele werkstuk laten nakijken en de tekst laten vervangen door zijn eigen versie.', correct: false, misconception: 'Ziet "laten nakijken" en "laten herschrijven" als hetzelfde.' },
          { text: 'De namen en cijfers van je klasgenoten invoeren zodat de bot een groepsverslag maakt.', correct: false, misconception: 'Vergeet dat je ook de gegevens van anderen niet deelt met een chatbot.' }
        ],
        feedback: 'De grens ligt bij wie de tekst schrijft. Laat de bot uitleggen, voorbeelden geven of begrippen aanwijzen, en typ daarna zelf.'
      },
      {
        prompt: 'Leg uit hoe een vage prompt uit paragraaf 7.3 de kans op een hallucinatie groter maakt.',
        type: 'open',
        leerdoel: 'Je weet wat hallucinatie bij een chatbot betekent.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Een vage prompt geeft de chatbot bijna geen houvast: er staat niet bij waar het precies over gaat, voor wie het is of hoe lang het moet zijn. Het model moet dan zelf invullen wat ik waarschijnlijk bedoel, en dat invullen is precies het moment waarop het dingen verzint. Hoe scherper mijn prompt, hoe minder ruimte er is om iets aan te vullen wat niet klopt. Toch blijf ik ook bij een goede prompt controleren met een tweede bron, want een scherpe vraag garandeert geen juist antwoord.',
        nakijkpunten: [
          'Legt uit dat een vage prompt de bot dwingt zelf in te vullen of te gokken.',
          'Verbindt dat invullen met het verzinnen van informatie, oftewel hallucinatie.',
          'Zegt erbij dat controleren ook bij een goede prompt nodig blijft.'
        ],
        feedback: 'Dit is het verband tussen 7.3 en 7.4: een scherpe prompt verkleint de gokruimte, maar je moet het antwoord nog steeds controleren.'
      },
      {
        prompt: 'Waarom mag je je persoonlijke gegevens niet delen met de chatbot? Gebruik in je antwoord wat je in paragraaf 7.2 over AI-systemen en gegevens geleerd hebt.',
        type: 'open',
        leerdoel: 'Je weet waarom je geen persoonlijke gegevens deelt met AI.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Achter de chatbot zit een bedrijf met mensen die bij het gesprek kunnen komen. In 7.2 leerde ik dat AI-systemen persoonlijke gegevens verzamelen zonder dat je precies weet wat ermee gebeurt; dat heet een privacyprobleem. Alles wat ik typ wordt opgeslagen op servers die ik niet ken, en ik weet niet hoe lang. Losse gegevens lijken onschuldig, maar samen vormen ze een profiel van mij. Ook de naam of foto van een klasgenoot hoort er niet in, want daar mag ik niet namens iemand anders over beslissen.',
        nakijkpunten: [
          'Noemt dat er een bedrijf met mensen achter de chatbot zit.',
          'Verwijst naar het privacyprobleem uit 7.2: gegevens worden verzameld zonder dat je weet wat ermee gebeurt.',
          'Zegt erbij dat je ook de gegevens van anderen niet mag delen.'
        ],
        feedback: 'Je verbindt hier twee paragrafen: het privacyprobleem uit 7.2 verklaart precies waarom de regel in 7.4 zo streng is.'
      }
    ]
  },

  '7.5': {
    learningGoals: [
      'Je kunt uitleggen hoe AI werkt en waar je op moet letten.',
      'Je kunt een prompt schrijven en het antwoord kritisch beoordelen.'
    ],
    theorie: [
      {
        keyTerms: ['AI-geletterdheid', 'kritisch'],
        exampleHtml: [
          '<p><strong>Vraag:</strong> In deze checkpoint komt alles samen onder een naam die je in het nieuws steeds vaker hoort. Waarom zou je AI-geletterdheid net zo serieus moeten leren als lezen en rekenen?</p>',
          '<p><strong>Antwoord:</strong> Omdat AI geen losse app is die je kunt overslaan, maar een laag die in bijna alles zit. Denk aan je tijdlijn, aan je zoekbalk, aan je toetsenbord en straks aan je bank en je zorgafspraken. Wie niet weet dat zulke systemen voorspellen in plaats van begrijpen, gelooft de uitkomst zonder verder te kijken. Kritisch zijn betekent hier niet dat je techniek wantrouwt of dat je AI uit de weg gaat. Het betekent dat je bij elk antwoord twee vragen stelt: waar komt dit vandaan, en waarmee controleer ik het?</p>'
        ].join('\n')
      },
      {
        keyTerms: ['bewijs', 'promptlogboek'],
        exampleHtml: [
          '<p><strong>Vraag:</strong> Je docent kijkt naar je werkstuk en vraagt rechtstreeks: heb jij dit zelf gemaakt of de AI? Hoe laat je op dat moment zien dat jouw antwoord daarop ook echt eerlijk is?</p>',
          '<p><strong>Antwoord:</strong> Dat laat je zien met je promptlogboek, en daarom is dat logboek meer dan een extra klusje. Daarin staat per prompt wat je precies vroeg, wat je terugkreeg en wat je daarna met dat antwoord deed. Dat laatste schrijf je in een enkel woord op: overgenomen, herschreven of weggegooid. Zo\'n logboek is bewijs, en het werkt eigenlijk twee kanten op zonder dat je daar moeite voor doet. Het laat aan je docent zien dat jij het denkwerk hebt gedaan bij dit werkstuk. En het dwingt jou onderweg om te benoemen waar jouw werk ophoudt en de machine begint.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>AI-geletterdheid is weten hoe AI werkt en weten waar je op moet letten als je het gebruikt. In dit hoofdstuk leverde je daar bewijs voor: een logboek, een AI-gezicht, vijf chatbotopdrachten en een promptlogboek. Dat promptlogboek laat per prompt zien wat je vroeg, wat je kreeg en wat jij er daarna mee deed.</p>',
      keyTerms: ['AI-geletterdheid', 'promptlogboek']
    },
    vragen: [
      {
        prompt: 'Welke omschrijving past het beste bij kunstmatige intelligentie?',
        leerdoel: 'Je kunt uitleggen wat kunstmatige intelligentie is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Technologie waarmee computers taken doen die normaal alleen mensen kunnen.', correct: true, explanation: 'Dat is de omschrijving uit de les: leren, plannen en beslissen door een machine.' },
          { text: 'Een computer die zo snel rekent dat hij geen fouten meer maakt.', correct: false, misconception: 'Denkt dat snelheid en foutloosheid het kenmerk van AI zijn.' },
          { text: 'Een robot met armen en benen die op een mens lijkt.', correct: false, misconception: 'Verwart het robotbeeld uit de les met de techniek zelf.' },
          { text: 'Een website die jouw antwoorden opzoekt in een grote database.', correct: false, misconception: 'Ziet AI als een zoeksysteem in plaats van als een lerend systeem.' }
        ],
        feedback: 'Kijk bij zo\'n omschrijving altijd naar het werkwoord. Bij AI gaat het om leren en beslissen, niet om opzoeken of snel rekenen.'
      },
      {
        prompt: 'AI heeft gevoelens en bewustzijn nodig om te kunnen leren van zijn fouten.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Verwart leren met ergens spijt van hebben; leren van fouten is bij AI puur rekenen aan gegevens.' },
          { text: 'Niet waar', correct: true, explanation: 'Een fout wordt opgeslagen als gegevens, waarna het model zijn berekening bijstelt. Voelen komt er niet aan te pas.' }
        ],
        leerdoel: 'Je weet dat AI leert van data en niet denkt zoals een mens.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Een zelfrijdende auto slaat een fout op als gegevens en rekent de volgende keer anders, zonder ook maar iets te voelen.'
      },
      {
        prompt: 'In welke van deze vier situaties zit géén kunstmatige intelligentie?',
        leerdoel: 'Je kunt voorbeelden geven van AI die je elke dag gebruikt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je telefoon ontgrendelt als hij jouw gezicht herkent.', correct: false, misconception: 'Ziet gezichtsherkenning als een simpele fotovergelijking in plaats van een getraind systeem.' },
          { text: 'Spotify zet een lijst klaar met nummers die jij waarschijnlijk leuk vindt.', correct: false, misconception: 'Denkt dat aanbevelingen door medewerkers samengesteld worden.' },
          { text: 'Je wekker gaat af om 7 uur omdat jij die tijd hebt ingesteld.', correct: true, explanation: 'De wekker voert alleen jouw instelling uit; er wordt niets geleerd en niets voorspeld.' },
          { text: 'Je toetsenbord stelt het volgende woord voor terwijl je typt.', correct: false, misconception: 'Ziet woordsuggesties als een lijstje uit een woordenboek in plaats van een voorspelling.' }
        ],
        feedback: 'Een wekker doet exact wat jij instelt. De andere drie systemen voorspellen iets over jou op basis van gegevens.'
      },
      {
        prompt: 'Welk paar noemt zowel een echt voordeel als een echt gevaar van AI?',
        leerdoel: 'Je kunt een voordeel en een gevaar van AI noemen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'AI werkt ook op zondag gewoon door, maar heeft daarvoor veel stroom nodig.', correct: false, misconception: 'Noemt wel twee eigenschappen, maar niet de voordelen en gevaren uit de les.' },
          { text: 'AI spoort ziektes op in scans, maar verzamelt persoonlijke gegevens.', correct: true, explanation: 'Dit zijn precies het voorbeeld van winst en het privacyprobleem uit de les.' },
          { text: 'AI kan tekenen, maar kan geen muziek maken.', correct: false, misconception: 'Denkt dat de grenzen van wat AI kan hetzelfde zijn als gevaren.' },
          { text: 'AI praat Nederlands, maar niet elke taal even goed.', correct: false, misconception: 'Verwart iets wat AI technisch minder goed kan met iets wat schade aanricht.' }
        ],
        feedback: 'Een gevaar gaat over gevolgen voor mensen, zoals privacy, misleiding of werk. Iets wat AI nog niet kan is geen gevaar.'
      },
      {
        prompt: 'Waar kijk je het eerst als je wil weten of een foto door AI gemaakt is?',
        leerdoel: 'Je kunt kenmerken noemen waaraan je een AI-afbeelding kunt herkennen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Naar de hoeveelheid likes onder de foto.', correct: false, misconception: 'Ziet populariteit aan voor echtheid.' },
          { text: 'Naar de kleuren van de lucht en de wolken op de achtergrond.', correct: false, misconception: 'Zoekt bij het grote geheel, terwijl AI daar juist sterk is.' },
          { text: 'Naar de datum waarop de foto geplaatst is.', correct: false, misconception: 'Denkt dat een recente datum iets zegt over de herkomst van het beeld.' },
          { text: 'Naar de kleine details: handen, oren en tanden.', correct: true, explanation: 'Kijk ook naar letters op borden of shirts. Precies daar heeft het model te weinig geoefend, dus daar zie je de fouten het eerst.' }
        ],
        feedback: 'Zoom altijd in voordat je oordeelt. Een AI-beeld klopt meestal op afstand en pas van dichtbij zie je waar het misgaat.'
      },
      {
        prompt: 'Wat gebeurt er met de gegevens die jij in een chatbot typt?',
        leerdoel: 'Je weet waarom je geen persoonlijke gegevens deelt met AI.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ze komen terecht bij het bedrijf achter de chatbot.', correct: true, explanation: 'Dat bedrijf kan ze opslaan en bekijken. Een chatgesprek is geen gesprek onder vier ogen; er zit een bedrijf met servers tussen.' },
          { text: 'Ze blijven alleen op jouw eigen telefoon staan.', correct: false, misconception: 'Denkt dat een chat lokaal blijft, zoals een notitie-app.' },
          { text: 'Ze worden meteen na afloop van je gesprek automatisch vernietigd.', correct: false, misconception: 'Gaat ervan uit dat een gesprek vanzelf verdwijnt.' }
        ],
        feedback: 'Typ niets in een chatbot wat je niet ook op een prikbord in de aula zou hangen. Dat is een simpele maar bruikbare vuistregel.'
      },
      {
        prompt: 'Welk rijtje bestaat alleen uit AI-chatbots?',
        leerdoel: 'Je kunt uitleggen wat een chatbot is en drie bekende chatbots noemen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Word, Excel en PowerPoint.', correct: false, misconception: 'Verwart kantoorprogramma\'s met chatbots.' },
          { text: 'Instagram, Snapchat en TikTok.', correct: false, misconception: 'Denkt dat elke app met AI erin een chatbot is.' },
          { text: 'ChatGPT, Google Gemini en TalkAI.', correct: true, explanation: 'Dit zijn alle drie AI-chatbots waarmee je via tekst een gesprek voert.' },
          { text: 'OneDrive, Outlook en ItsLearning van school.', correct: false, misconception: 'Noemt schoolsystemen in plaats van chatbots.' }
        ],
        feedback: 'Een chatbot herken je hieraan: je typt iets in gewone taal en krijgt een geschreven antwoord terug.'
      },
      {
        prompt: 'Deze prompt is: leg uit hoe een vulkaan werkt, voor een leerling van 12 jaar, in makkelijke woorden. Welk onderdeel ontbreekt er nog?',
        leerdoel: 'Je kunt een duidelijke prompt schrijven met opdracht, onderwerp, doelgroep en lengte.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het onderwerp, want dat staat er niet in.', correct: false, misconception: 'Ziet het onderwerp over het hoofd terwijl het er wel staat.' },
          { text: 'De lengte, bijvoorbeeld in 6 zinnen of in 100 woorden.', correct: true, explanation: 'Opdracht, onderwerp en doelgroep staan erin, plus de stijl; alleen de lengte ontbreekt nog.' },
          { text: 'De doelgroep, want je zegt niet voor wie het bedoeld is.', correct: false, misconception: 'Leest "voor een leerling van 12 jaar" niet als de doelgroep.' },
          { text: 'De opdracht, want er staat niet wat de bot moet doen.', correct: false, misconception: 'Herkent "leg uit" niet als de opdracht in de prompt.' }
        ],
        feedback: 'Loop de vier onderdelen af als een checklist. Hier zijn er drie ingevuld en blijft er precies één over.'
      },
      {
        prompt: 'Je hebt een chatbotantwoord in Word geplakt. Wat is de eerste stap om er jouw eigen nette werk van te maken?',
        leerdoel: 'Je kunt het antwoord van een chatbot netjes verwerken in Word.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De tekst kleuren zodat de docent ziet welk deel van de bot komt.', correct: false, misconception: 'Denkt dat markeren hetzelfde is als verwerken.' },
          { text: 'De tekst uitrekken tot de bladzijde precies vol is.', correct: false, misconception: 'Richt zich op de hoeveelheid in plaats van op de leesbaarheid.' },
          { text: 'Alle alinea\'s samenvoegen tot één blok zodat het compact is.', correct: false, misconception: 'Denkt dat compact hetzelfde is als verzorgd.' },
          { text: 'De opmaak gelijktrekken: één lettertype in grootte 11 of 12, met een kop erboven.', correct: true, explanation: 'Geplakte tekst brengt vaak een vreemd lettertype mee; dat trek je eerst recht.' }
        ],
        feedback: 'Begin altijd met de opmaak gelijktrekken. Daarna pas ga je begrippen dikdrukken en de tekst herschrijven.'
      },
      {
        prompt: 'Wat betekent hallucinatie bij een chatbot?',
        leerdoel: 'Je weet wat hallucinatie bij een chatbot betekent.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De chatbot valt uit en geeft geen antwoord meer.', correct: false, misconception: 'Verwart een inhoudelijke fout met een technische storing.' },
          { text: 'De chatbot verzint informatie en geeft die alsof het waar is.', correct: true, explanation: 'Het model vult de meest waarschijnlijke woorden in, ook als er geen juist antwoord bestaat.' },
          { text: 'De chatbot herhaalt steeds hetzelfde antwoord.', correct: false, misconception: 'Denkt aan een zichtbaar mankement in plaats van aan onzichtbaar verzinnen.' },
          { text: 'De chatbot weigert te antwoorden omdat de vraag te moeilijk is.', correct: false, misconception: 'Denkt dat een bot aangeeft wanneer hij het niet weet.' }
        ],
        feedback: 'Het gevaarlijke van een hallucinatie is dat er niets aan te zien is: hij komt in dezelfde nette zinnen binnen als een goed antwoord.'
      },
      {
        prompt: 'Je leest in een chatbotantwoord dat er in Nederland 340 vulkanen liggen. Wat doe je?',
        leerdoel: 'Je kunt controleren of het antwoord van een chatbot klopt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het gewoon overnemen, want getallen verzint een chatbot nooit uit zichzelf.', correct: false, misconception: 'Denkt dat cijfers betrouwbaarder zijn dan tekst.' },
          { text: 'De chatbot vragen om het nog eens netter op te schrijven.', correct: false, misconception: 'Verwart een mooiere formulering met een juister antwoord.' },
          { text: 'Het getal opzoeken in je aardrijkskundeboek of bij een encyclopedie.', correct: true, explanation: 'Een bron buiten de chatbot is de enige echte controle op een getal.' },
          { text: 'Het weglaten en de rest van het antwoord gewoon overnemen.', correct: false, misconception: 'Lost het probleem op door het te verbergen in plaats van te controleren.' }
        ],
        feedback: 'Getallen en namen zijn juist de plekken waar het model het snelst iets invult. Controleer die altijd als eerste.'
      },
      {
        prompt: 'Welk gebruik van AI is bij schoolwerk toegestaan?',
        leerdoel: 'Je weet wat je met een chatbot wel en niet mag doen voor schoolwerk.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Uitleg vragen, begrippen laten aanwijzen en daarna zelf schrijven.', correct: true, explanation: 'De bot helpt je de moeilijke begrippen begrijpen, maar de tekst die je inlevert schrijf jij.' },
          { text: 'Je hele verslag door de chatbot laten schrijven en er zelf een titel boven zetten.', correct: false, misconception: 'Denkt dat een eigen titel het werk tot eigen werk maakt.' },
          { text: 'De opdracht kopiëren, het antwoord kopiëren en beide inleveren.', correct: false, misconception: 'Ziet openheid als vervanging van eigen werk.' }
        ],
        feedback: 'Vraag jezelf af wie het denkwerk deed. Is dat de bot, dan lever je het werk van de bot in en niet dat van jou.'
      },
      {
        prompt: 'Een klasgenoot zegt: mijn rekenmachine is ook AI, want hij geeft antwoorden. Leg uit waarom dat niet klopt.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat kunstmatige intelligentie is.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'reflecteren',
        modelAnswer: 'Een rekenmachine volgt regels die iemand er van tevoren in heeft gezet. Als ik 7 + 5 intyp, krijg ik altijd 12, vandaag en over een jaar. Er verandert dus niets door wat het apparaat meemaakt. Kunstmatige intelligentie leert juist wel van voorbeelden: het systeem past zijn keuzes aan op grond van gegevens die het krijgt. Daarom kan mijn tijdlijn wel veranderen en mijn rekenmachine niet. Antwoorden geven is dus niet het kenmerk van AI; leren van ervaring is dat wel.',
        nakijkpunten: [
          'Legt uit dat een rekenmachine vaste regels volgt en altijd hetzelfde antwoord geeft.',
          'Zegt dat AI leert van voorbeelden of gegevens en daardoor verandert.',
          'Benoemt dat antwoorden geven op zich nog geen AI is.'
        ],
        feedback: 'Deze vergelijking is de kortste manier om AI uit te leggen: hetzelfde antwoord altijd, of een antwoord dat meegroeit met de gegevens.'
      },
      {
        prompt: 'Waarvan leert een AI-systeem?',
        leerdoel: 'Je weet dat AI leert van data en niet denkt zoals een mens.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Van data: voorbeelden en gegevens over wat mensen doen en schrijven.', correct: true, explanation: 'Zonder voorbeelden valt er niets te leren; gegevens zijn de brandstof van elk AI-systeem.' },
          { text: 'Van de regels die de programmeur er van tevoren allemaal in gezet heeft.', correct: false, misconception: 'Verwart AI met een klassiek programma waarin elke regel vooraf bedacht is.' },
          { text: 'Van zijn eigen gevoel en ervaring, net als een mens.', correct: false, misconception: 'Kent AI menselijke eigenschappen toe die het niet heeft.' }
        ],
        feedback: 'Gegevens zijn het startpunt van alles in dit hoofdstuk, van je tijdlijn tot de chatbot. Geen gegevens, geen AI.'
      },
      {
        prompt: 'Ook zonder ooit een chatbot te openen gebruik je op een gewone schooldag meerdere AI-systemen.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: true, explanation: 'Gezichtsherkenning, woordsuggesties, muziekaanbevelingen en de zoekbalk zijn alle vier AI die je dagelijks gebruikt.' },
          { text: 'Niet waar', correct: false, misconception: 'Zet AI gelijk aan chatbots, terwijl de meeste AI onzichtbaar in gewone apps verwerkt zit.' }
        ],
        leerdoel: 'Je kunt voorbeelden geven van AI die je elke dag gebruikt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Denk aan ontgrendelen met je gezicht, woordsuggesties, je muziekaanbevelingen en de zoekbalk van Google. Vier systemen voor de eerste les.'
      },
      {
        prompt: 'Noem een situatie waarin AI een positief effect heeft op ons dagelijks leven, en zet er één gevaar naast. Leg bij allebei uit waarom.',
        type: 'open',
        leerdoel: 'Je kunt een voordeel en een gevaar van AI noemen.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een positief effect is dat artsen AI gebruiken om een ziekte in een scan op te sporen. De computer kijkt sneller naar duizenden beelden dan een mens en ziet patronen die anders gemist worden, en dat kan levens redden. Een gevaar is dat AI-systemen persoonlijke gegevens verzamelen zonder dat je precies weet wat ermee gebeurt. Dat heet een privacyprobleem, want je kunt gegevens niet terughalen als ze eenmaal ergens staan. Een tweede gevaar is dat AI beroepen laat verdwijnen, omdat machines werk overnemen dat mensen deden.',
        nakijkpunten: [
          'Noemt een concreet voordeel uit het dagelijks leven met een reden erbij.',
          'Noemt een gevaar uit de les: privacy, misleiding of verdwijnend werk.',
          'Legt bij allebei uit waarom het een voordeel of gevaar is, en noemt niet alleen het woord.'
        ],
        feedback: 'Let bij deze vraag op de uitleg. Een lijstje met twee woorden laat nog niet zien dat je snapt waarom iets winst of risico is.'
      },
      {
        prompt: 'Een scherpe foto van goede kwaliteit kan onmogelijk door AI gemaakt zijn.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denkt dat AI-beeld altijd wazig of rommelig is; juist de scherpste beelden zijn het moeilijkst te betrappen.' },
          { text: 'Niet waar', correct: true, explanation: 'Kwaliteit zegt niets over de herkomst. Je zoekt naar fouten in details, zoals handen en oren, en naar de bron.' }
        ],
        leerdoel: 'Je kunt kenmerken noemen waaraan je een AI-afbeelding kunt herkennen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Juist de scherpste AI-beelden zijn het lastigst te betrappen. Kwaliteit zegt niets, details en bron zeggen alles.'
      },
      {
        prompt: 'Ook de naam en de foto van een klasgenoot horen niet thuis in een chatbotgesprek.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: true, explanation: 'Over de gegevens van iemand anders mag jij niet beslissen. Ze komen bij een bedrijf terecht en zijn niet terug te halen.' },
          { text: 'Niet waar', correct: false, misconception: 'Denkt dat de privacyregel alleen over je eigen gegevens gaat, terwijl je die van een ander net zo goed weggeeft.' }
        ],
        leerdoel: 'Je weet waarom je geen persoonlijke gegevens deelt met AI.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Over jouw eigen gegevens beslis jij, maar over die van een ander niet. Vragen kost twee seconden, terughalen lukt niet meer.'
      },
      {
        prompt: 'De chatbot van een webshop en ChatGPT werken allebei op precies dezelfde manier.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Ziet elk chatvenster als hetzelfde, terwijl vaste antwoorden iets anders zijn dan antwoorden die ter plekke ontstaan.' },
          { text: 'Niet waar', correct: true, explanation: 'Een webshopbot kiest uit vaste antwoorden die iemand heeft ingevoerd. ChatGPT vormt elk antwoord opnieuw met AI.' }
        ],
        leerdoel: 'Je kunt uitleggen wat een chatbot is en drie bekende chatbots noemen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'De eerste geeft vaste antwoorden uit een lijstje dat iemand heeft ingevoerd. De tweede vormt elk antwoord opnieuw met AI.'
      },
      {
        prompt: 'Schrijf een prompt over een onderwerp uit een ander vak, met alle vier de onderdelen erin, en zet er per onderdeel bij wat je gekozen hebt.',
        type: 'open',
        leerdoel: 'Je kunt een duidelijke prompt schrijven met opdracht, onderwerp, doelgroep en lengte.',
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Mijn prompt: "Leg in 6 zinnen uit hoe een vulkaanuitbarsting ontstaat, voor een leerling van 12 jaar, in makkelijke woorden en zonder Engelse termen." De opdracht is: leg uit. Het onderwerp is: hoe een vulkaanuitbarsting ontstaat. De doelgroep is: een leerling van 12 jaar. De lengte is: 6 zinnen. Als extra eis heb ik de stijl toegevoegd, namelijk makkelijke woorden zonder Engelse termen, want anders krijg ik zinnen die ik zelf niet begrijp.',
        nakijkpunten: [
          'De prompt bevat opdracht, onderwerp, doelgroep en lengte.',
          'De leerling benoemt per onderdeel welk stukje van de prompt dat is.',
          'Het onderwerp is smal genoeg om in de gevraagde lengte te passen.'
        ],
        feedback: 'Wie de vier onderdelen kan aanwijzen in zijn eigen prompt, kan ook zien wat er ontbreekt als het antwoord tegenvalt.'
      },
      {
        prompt: 'Geplakte tekst uit een chatbot neemt vanzelf het lettertype van jouw Word-document over.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denkt dat Word geplakte tekst altijd zelf rechttrekt, terwijl de opmaak van de bron standaard gewoon meekomt.' },
          { text: 'Niet waar', correct: true, explanation: 'Meestal komen kleur, lettertype en regelafstand mee. Plakken zonder opmaak lost dat in één klik voor je op.' }
        ],
        leerdoel: 'Je kunt het antwoord van een chatbot netjes verwerken in Word.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Meestal komt de opmaak van de website mee, inclusief kleur en regelafstand. Gebruik plakken zonder opmaak of trek het daarna recht.'
      },
      {
        prompt: 'Leg uit waarom een hallucinatie van een chatbot moeilijker te betrappen is dan een spelfout.',
        type: 'open',
        leerdoel: 'Je weet wat hallucinatie bij een chatbot betekent.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Een spelfout zie je meteen, want het woord staat er verkeerd en dat valt op. Een hallucinatie ziet er juist perfect uit: de zin loopt, de spelling klopt en de bot schrijft hem net zo rustig op als een goed antwoord. Er is dus geen enkel signaal in de tekst zelf dat er iets mis is. Daardoor kun je het alleen ontdekken door de inhoud te vergelijken met een andere bron. De vorm helpt je niet, alleen de controle helpt.',
        nakijkpunten: [
          'Zegt dat een spelfout zichtbaar is in de tekst zelf.',
          'Legt uit dat een hallucinatie er precies zo uitziet als een goed antwoord.',
          'Trekt de conclusie dat je alleen met een tweede bron kunt controleren.'
        ],
        feedback: 'Dit is de reden dat controleren geen extra werk is maar vast onderdeel: aan de tekst zelf valt niets af te lezen.'
      },
      {
        prompt: 'Als een chatbot een boektitel en een bladzijdenummer noemt, weet je zeker dat het antwoord klopt.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Ziet een bronvermelding aan voor bewijs, terwijl een model een titel net zo goed kan verzinnen als een feit.' },
          { text: 'Niet waar', correct: true, explanation: 'Verzonnen bronnen zijn een klassieke hallucinatie. Controleer de titel zelf bij een bron buiten de chatbot.' }
        ],
        leerdoel: 'Je kunt controleren of het antwoord van een chatbot klopt.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        feedback: 'Verzonnen bronnen zijn een klassieke hallucinatie. Een titel die echt klinkt, is voor het model gewoon een waarschijnlijke woordenreeks.'
      },
      {
        prompt: 'Iemand zegt: "Ik hoef niets van AI te weten, want ik gebruik het toch niet." Welke reactie klopt het beste met wat je in dit hoofdstuk geleerd hebt?',
        leerdoel: 'Je kunt uitleggen hoe AI werkt en waar je op moet letten.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat klopt, want zolang je zelf geen chatbot opent, gebruik je ook geen AI.', correct: false, misconception: 'Denkt dat AI alleen in een chatbot zit en niet in gewone apps.' },
          { text: 'Dat klopt, want AI zit alleen in dure programma\'s waarvoor je moet betalen.', correct: false, misconception: 'Verwart betaalde chatbotversies met de vraag waar AI in zit.' },
          { text: 'Dat klopt niet, maar het maakt verder niet uit, want AI beslist nooit iets voor jou.', correct: false, misconception: 'Ziet niet dat een systeem dat kiest wat je te zien krijgt wel degelijk voor je beslist.' },
          { text: 'Dat klopt niet: je tijdlijn, je zoekbalk en je toetsenbord draaien al op AI.', correct: true, explanation: 'AI is geen losse app maar een laag die in bijna elk systeem zit dat jij dagelijks aanzet.' }
        ],
        feedback: 'Je kunt AI niet vermijden door hem niet te openen. Juist daarom moet je weten dat zulke systemen voorspellen en niet begrijpen.'
      },
      {
        prompt: 'Leg in vijf zinnen uit hoe AI werkt en noem twee dingen waar je bij het gebruik altijd op moet letten.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen hoe AI werkt en waar je op moet letten.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'AI krijgt heel veel voorbeelden en zoekt daarin patronen. Op grond van die patronen voorspelt het wat waarschijnlijk het beste antwoord of de beste keuze is. Het begrijpt de inhoud niet: het rekent, en het doet menselijk gedrag alleen maar na. Daarom let ik op twee dingen. Ten eerste controleer ik feiten, getallen en namen bij een bron buiten de AI, want een fout ziet er precies zo uit als een goed antwoord. Ten tweede geef ik geen persoonlijke gegevens, want alles wat ik intyp komt bij een bedrijf terecht.',
        nakijkpunten: [
          'De uitleg noemt leren van voorbeelden, patronen zoeken en voorspellen.',
          'Er staat expliciet bij dat AI niets begrijpt en dus niet denkt zoals een mens.',
          'Er worden twee concrete aandachtspunten genoemd, waarvan minstens een over controleren of over persoonlijke gegevens gaat.'
        ],
        feedback: 'De werking en het gedrag horen bij elkaar: omdat het systeem voorspelt in plaats van weet, is controleren geen extra stap maar onderdeel van gebruiken.'
      },
      {
        prompt: 'Je schrijft de prompt: "Leg in 6 zinnen uit hoe een sluis werkt, voor een leerling van 12 jaar." Het antwoord noemt een sluis in Maastricht met een bouwjaar erbij. Wat doe je?',
        leerdoel: 'Je kunt een prompt schrijven en het antwoord kritisch beoordelen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ik neem het over, want mijn prompt was duidelijk genoeg.', correct: false, misconception: 'Denkt dat een goede prompt garandeert dat het antwoord ook klopt.' },
          { text: 'Ik zoek het bouwjaar en de naam op bij een bron buiten de chatbot voordat ik iets overneem.', correct: true, explanation: 'Namen en jaartallen zijn precies de details die een model invult zonder zekerheid.' },
          { text: 'Ik vraag dezelfde bot of het antwoord klopt en geloof wat hij dan zegt.', correct: false, misconception: 'Ziet een tweede antwoord van hetzelfde model aan voor een onafhankelijke controle.' },
          { text: 'Ik haal het bouwjaar weg en lever de rest zo in.', correct: false, misconception: 'Verbergt het probleem in plaats van het te controleren; de rest kan net zo goed verzonnen zijn.' }
        ],
        feedback: 'Een scherpe prompt en een gecontroleerd antwoord zijn twee aparte stappen. De eerste bepaalt de vorm, de tweede bepaalt of het klopt.'
      },
      {
        prompt: 'Lees deze prompt van een klasgenoot: "Leg in 8 zinnen uit hoe een boom de winter overleeft, voor een leerling van 12 jaar, in makkelijke woorden." De chatbot schreef onder andere: "De oudste boom van Nederland staat in Assen en werd in 1476 geplant." Beantwoord nu drie korte vragen. 1. Welk stuk van de prompt bepaalt hoe lang het antwoord wordt, en welk stuk bepaalt hoe moeilijk de woorden mogen zijn? 2. Welk feit controleer je als eerste, en bij welke bron buiten de chatbot? 3. Wat doe je als twee bronnen elkaar tegenspreken?',
        type: 'open',
        leerdoel: 'Je kunt een prompt schrijven en het antwoord kritisch beoordelen.',
        denkniveau: 'maken_controleren',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Hoe lang het antwoord wordt, staat in "in 8 zinnen". Hoe moeilijk de woorden mogen zijn, staat in "voor een leerling van 12 jaar, in makkelijke woorden". Ik controleer als eerste de zin over Assen en het jaartal 1476, want een plaatsnaam met een jaartal erbij is precies het soort detail dat een model invult zonder zekerheid. Dat zoek ik op bij een bron buiten de chatbot, bijvoorbeeld de site van de gemeente, een natuurorganisatie of mijn biologieboek. Spreken twee bronnen elkaar tegen, dan neem ik de zin niet over; ik schrijf op wat ik wel zeker weet en zet de link van de bron erachter.',
        nakijkpunten: [
          'De leerling wijst "in 8 zinnen" aan voor de lengte en de doelgroep met "in makkelijke woorden" voor de woordkeus.',
          'Het controleplan begint bij het feit met een naam of een jaartal erin, en noemt een bron buiten de chatbot.',
          'Er staat bij wat de leerling doet als twee bronnen elkaar tegenspreken.'
        ],
        feedback: 'Hier schrijf je geen nieuwe prompt, maar lees je die van een ander. Wie kan aanwijzen welk stukje prompt de lengte en de woordkeus stuurt, ziet ook eerder welk stukje antwoord nog bewijs nodig heeft.'
      },
      {
        prompt: 'Jouw school maakt een nieuwe afspraak over AI-gebruik. Schrijf drie regels op die volgens jou in die afspraak horen, met bij elke regel een reden.',
        type: 'open',
        leerdoel: 'Je weet wat je met een chatbot wel en niet mag doen voor schoolwerk.',
        denkniveau: 'maken_controleren',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Regel 1: je mag een chatbot om uitleg vragen, maar je schrijft je werkstuk zelf. Reden: van herschrijven leer je het meest, en de docent beoordeelt jouw begrip. Regel 2: je zet onder je werk welke prompts je gebruikt hebt. Reden: dan is zichtbaar waar jouw werk ophoudt en de machine begon, en dat voorkomt gedoe achteraf. Regel 3: je typt geen namen, adressen of foto\'s van jezelf of van anderen in een chatbot. Reden: die gegevens komen bij een bedrijf terecht en je krijgt ze nooit meer terug.',
        nakijkpunten: [
          'Noemt drie regels die echt over AI-gebruik op school gaan.',
          'Geeft bij elke regel een reden die verder gaat dan "dat mag niet".',
          'Minstens één regel gaat over eigen werk en minstens één over persoonlijke gegevens.'
        ],
        feedback: 'Een goede schoolafspraak legt niet alleen vast wat niet mag, maar ook hoe je laat zien wat je wél zelf gedaan hebt.'
      }
    ]
  },

  '7.6': {
    learningGoals: [
      'Je kunt uitleggen dat een taalmodel getraind is op heel veel tekst.',
      'Je kunt uitleggen wat vooringenomenheid in AI is en hoe die erin komt.',
      'Je kunt beredeneren waarom AI zelfverzekerd klinkt terwijl het fout kan zijn.'
    ],
    theorie: [
      {
        keyTerms: ['taalmodel', 'voortraining', 'waarschijnlijkheid'],
        exampleHtml: [
          '<p><strong>Vraag:</strong> Typ in je telefoon de woorden vandaag ga ik na school en kies daarna tien keer de eerste woordsuggestie. Lees de zin die zo ontstaat daarna hardop aan jezelf terug. Wat heeft dit kleine experiment te maken met de werking van een taalmodel als ChatGPT?</p>',
          '<p><strong>Antwoord:</strong> Het heeft er alles mee te maken, alleen gebeurt bij een taalmodel hetzelfde op veel grotere schaal. Je toetsenbord doet namelijk wat een taalmodel in zijn voortraining leert: voorspellen welk woord waarschijnlijk volgt. De zin die zo ontstaat loopt vaak keurig, maar gaat nergens over, want er zat geen bedoeling achter. Een chatbot doet hetzelfde met veel meer tekst, veel meer rekenkracht en veel meer trainingsrondes. Daardoor komt er wel iets zinnigs uit, maar het mechanisme eronder blijft waarschijnlijkheid en geen waarheid.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['vooringenomenheid', 'trainingsdata', 'zelfverzekerd'],
        exampleHtml: [
          '<p><strong>Vraag:</strong> Onderzoekers gaven een taalmodel een stapel sollicitatiebrieven die woord voor woord precies hetzelfde waren. Alleen de naam bovenaan de brief verschilde per exemplaar, verder was er geen enkel verschil. Toch liepen de beoordelingen die het model teruggaf duidelijk uiteen, en dat was geen toeval. Waar zat de fout dan, en wie had die vooringenomenheid er eigenlijk in gezet?</p>',
          '<p><strong>Antwoord:</strong> De fout zat niet in de code van het model, maar in de trainingsdata waarop het geleerd heeft. Het model is getraind op teksten die mensen schreven, en in die teksten zitten scheve beelden over namen en afkomst. Zo komt vooringenomenheid het model binnen zonder dat iemand die er bewust in geprogrammeerd heeft. Niemand hoeft dus kwaad te willen; het volstaat dat de gebruikte voorbeelden zelf al scheef stonden. Waarom valt zoiets bij het lezen zo weinig op, denk je? Omdat de uitkomst even zelfverzekerd geformuleerd wordt als elk ander antwoord, en de toon dus niets verraadt.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een taalmodel is getraind op miljarden zinnen en leert daaruit welk woord waarschijnlijk volgt. Omdat die zinnen door mensen geschreven zijn, leert het ook onze scheve beelden mee, en dat heet vooringenomenheid. Elk antwoord klinkt even zelfverzekerd, want de toon zegt niets over de juistheid ervan.</p>',
      keyTerms: ['taalmodel', 'vooringenomenheid', 'zelfverzekerd']
    },
    vragen: [
      {
        prompt: 'In het uitgewerkte voorbeeld bij theorieblok A koos je tien keer de eerste woordsuggestie van je toetsenbord. Waarop is een taalmodel als ChatGPT getraind?',
        leerdoel: 'Je kunt uitleggen dat een taalmodel getraind is op heel veel tekst.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Op een lijst met vragen en goedgekeurde antwoorden die medewerkers hebben ingetypt.', correct: false, misconception: 'Denkt aan een groot vraag-en-antwoordboek in plaats van aan getrainde voorspelling.' },
          { text: 'Op miljarden zinnen uit boeken, artikelen en websites van internet.', correct: true, explanation: 'Op al die zinnen oefent het model eindeloos op één ding: voorspellen welk woord waarschijnlijk volgt.' },
          { text: 'Op de zoekresultaten die het per vraag live ophaalt bij Google.', correct: false, misconception: 'Verwart een taalmodel met een zoekmachine.' },
          { text: 'Op de gesprekken die jij op dit moment met de chatbot voert, terwijl je typt.', correct: false, misconception: 'Denkt dat het model tijdens jouw eigen gesprek opnieuw getraind wordt.' }
        ],
        feedback: 'De training gebeurt vooraf en kost weken rekenwerk. Wat gebruikers typen kan later meegaan in een volgende trainingsronde, maar niet tijdens je gesprek.'
      },
      {
        prompt: 'Een taalmodel is getraind om antwoorden te geven waarvan het weet dat ze waar zijn.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denkt dat waarheid een doel van de training is, terwijl het model beloond werd op woorden die goed passen.' },
          { text: 'Niet waar', correct: true, explanation: 'De training beloont woorden die goed passen, niet woorden die waar zijn. Waarschijnlijkheid is het doel, waarheid niet.' }
        ],
        leerdoel: 'Je kunt uitleggen dat een taalmodel getraind is op heel veel tekst.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'samen_oefenen',
        feedback: 'Denkstap: vraag jezelf af waarop het model beloond werd tijdens de training. Op passende woorden, niet op ware woorden.'
      },
      {
        prompt: 'Hoe komt vooringenomenheid in een taalmodel terecht?',
        leerdoel: 'Je kunt uitleggen wat vooringenomenheid in AI is en hoe die erin komt.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Via de trainingsdata: het model leert van teksten die mensen schreven.', correct: true, explanation: 'Alle scheve beelden die in die teksten zitten, leert het model mee. Het neemt de patronen uit onze eigen taal over, ook de patronen die we liever kwijt zouden zijn.' },
          { text: 'Via een instelling die de gebruiker zelf per ongeluk aanzet.', correct: false, misconception: 'Denkt dat vooringenomenheid een knop of een foutmelding is.' },
          { text: 'Via de programmeurs, die hun eigen mening met de hand in de code schrijven.', correct: false, misconception: 'Zoekt een schuldige in de code, terwijl niemand deze regels expliciet programmeert.' }
        ],
        feedback: 'Niemand programmeert het erin; het komt mee met de teksten waarop het model getraind is. Daarom is bias ook niet met één technische ingreep op te lossen.'
      },
      {
        prompt: 'Je vraagt een chatbot om drie beschrijvingen: een directeur, een verpleegkundige en een profvoetballer. Waar let je op om vooringenomenheid te betrappen?',
        leerdoel: 'Je kunt uitleggen wat vooringenomenheid in AI is en hoe die erin komt.',
        denkniveau: 'toepassen',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        options: [
          { text: 'Op de lengte van de drie antwoorden.', correct: false, misconception: 'Zoekt naar een meetbaar verschil dat niets met scheve beelden te maken heeft.' },
          { text: 'Op spelfouten in de beschrijvingen.', correct: false, misconception: 'Verwart taalfouten met vooringenomenheid.' },
          { text: 'Op welk geslacht en welke leeftijd het model er zelf bij kiest.', correct: true, explanation: 'Kijk ook naar de achtergrond die het model invult zonder dat jij daarom gevraagd hebt. Juist die ongevraagde keuzes laten zien welke patronen in de trainingsdata zaten.' },
          { text: 'Op de vraag of het model bij elk antwoord netjes zijn bronnen noemt.', correct: false, misconception: 'Denkt dat een bronvermelding iets zegt over scheve beelden in de tekst.' }
        ],
        feedback: 'Vooringenomenheid zit in wat het model invult zonder dat je erom vroeg. Die ongevraagde details zijn je bewijsmateriaal.'
      },
      {
        prompt: 'In 7.4 oefende je het narekenen van een chatbotantwoord. Nu weet je ook dat een model voorspelt op teksten van vóór zijn training. Welke controle wint daardoor aan gewicht?',
        leerdoel: 'Je kunt controleren of het antwoord van een chatbot klopt.',
        denkniveau: 'toepassen',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        options: [
          { text: 'Nagaan of de tekst in nette, foutloze zinnen geschreven staat.', correct: false, misconception: 'Neemt verzorgde taal als bewijs, terwijl het model elke tekst even vlot formuleert.' },
          { text: 'Jaartallen, prijzen en regels bij een actuele bron narekenen.', correct: true, explanation: 'Alles wat sinds de training veranderd is, kan het model niet weten. Juist die gegevens verouderen het snelst.' },
          { text: 'Beoordelen of het antwoord lang genoeg is voor jouw opdracht.', correct: false, misconception: 'Verwart de omvang van een antwoord met de juistheid ervan.' },
          { text: 'Dezelfde vraag nog eens aan dezelfde chatbot stellen tot er twee keer hetzelfde antwoord uit komt.', correct: false, misconception: 'Ziet herhaling door hetzelfde model als een tweede mening, terwijl het dezelfde trainingsdata is.' }
        ],
        feedback: 'De training ligt in het verleden, dus alles met een datum eraan is verdacht. Vergelijk zulke gegevens met een bron van vandaag.'
      },
      {
        prompt: 'In paragraaf 7.4 leerde je wat hallucinatie is. Leg uit waarom een chatbot precies even zeker klinkt als hij iets verzint als wanneer hij gelijk heeft.',
        type: 'open',
        leerdoel: 'Je kunt beredeneren waarom AI zelfverzekerd klinkt terwijl het fout kan zijn.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Een chatbot maakt elk antwoord op dezelfde manier: hij kiest steeds het woord dat het beste past. Of het onderwerp nu goed of slecht in zijn trainingsdata zit, het proces verandert niet, dus de zinnen komen er even vlot uit. Daar komt bij dat het model in een latere trainingsfase geleerd heeft welke antwoorden mensen prettig vinden, en een aarzelend antwoord vinden mensen minder prettig. Zo wordt zelfverzekerd praten beloond. Bij een mens hoor je twijfel in de formulering, bij een taalmodel niet. Daarom kun je nooit aan de toon zien of een antwoord klopt.',
        nakijkpunten: [
          'Legt uit dat het model elk antwoord op dezelfde manier vormt, ongeacht of het klopt.',
          'Noemt dat het model getraind is op antwoorden die mensen prettig vinden, waardoor zekerheid beloond wordt.',
          'Trekt de conclusie dat de toon geen bewijs is en dat controleren nodig blijft.'
        ],
        feedback: 'Dit verklaart waarom de hallucinaties uit 7.4 zo lastig te betrappen zijn: het systeem kan twijfel niet laten horen en is erop getraind die niet te tonen.'
      },
      {
        prompt: 'In 7.1 en 7.4 las je al dat jouw gesprekstekst pas in een volgende trainingsronde meegaat. Leg met de drie trainingsfases uit deze paragraaf uit waarom het model tijdens jouw gesprek niets kan bijleren.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen dat een taalmodel getraind is op heel veel tekst.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Het model doorloopt drie trainingsfases, en die zijn alle drie klaar voordat ik mijn eerste vraag intyp. In de voortraining leest het miljarden zinnen en oefent het op het voorspellen van het volgende woord. In de tweede fase leert het opdrachten opvolgen, en in de derde beoordelen mensen welke antwoorden prettig overkomen. Na die drie fases ligt het model vast, en tijdens mijn gesprek rekent het alleen nog met wat erin zit. Er verandert op dat moment dus niets aan het model zelf, hoe goed het mij ook lijkt te volgen. Wat ik typ kan het bedrijf wel bewaren, zodat het bij een volgende trainingsronde als voorbeeld meegaat. Zo\'n ronde kost weken rekenwerk op duizenden computers, dus dat past nooit binnen één gesprek. Daarom is het leren van een chatbot iets van later, en niet van mijn eigen chatvenster.',
        nakijkpunten: [
          'Noemt de drie fases: de voortraining, het leren opvolgen van opdrachten en het beoordelen door mensen.',
          'Zegt erbij dat die drie fases klaar zijn voordat het gesprek begint, zodat het model tijdens het gesprek vastligt.',
          'Legt uit dat jouw tekst pas in een volgende trainingsronde mee kan, en dat zo\'n ronde weken rekenwerk kost.'
        ],
        feedback: 'Trainen en gebruiken zijn twee losse momenten, en dat verklaart het hele verschil. Wie dat ziet, snapt ook waarom je chats niet zomaar verdwijnen.'
      }
    ]
  }
};
