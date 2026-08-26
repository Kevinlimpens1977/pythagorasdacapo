// Hoofdstuk 7 - Kunstmatige intelligentie en chatbots (theoretische leerweg).
//
// Bron: het Wikiwijs-arrangement "Digitale Geletterdheid" van DaCapo College.
//   7.1 en 7.2  <- les 16 "Kunstmatige Intelligentie (AI)"
//   7.3 en 7.4  <- les 17 "Een chatbot gebruiken"
//   7.5         <- toegevoegd checkpoint, geen Wikiwijs-bron
//   7.6         <- toegevoegde vrijwillige plusparagraaf, geen Wikiwijs-bron
//
// De lesteksten uit de bron staan hier voor tl zo letterlijk mogelijk in. Alle
// videolinks, opdrachten, afbeeldingen en tussenvragen van les 16 en 17 komen
// terug:
//   - https://www.youtube.com/embed/QJE_ycgR8E8   "Kunstmatige intelligentie voor
//                                                dummies in 2 minuten" (RTL Z) -> media 7.1
//   - https://www.youtube.com/embed/rd-iIfbd07I   "Waarom zegt AI dat je lijm op
//                                                je pizza moet doen?"          -> media 7.2
//   - https://www.thispersondoesnotexist.com/     opdracht foto's   -> opdracht 7.2
//   - https://www.youtube.com/embed/z1O3PPhi9Zc   "Weer een nieuw versie van ChatGPT,
//                                                leerkrachten zien meer fraude"
//                                                (Hart van Nederland, maart 2023)
//                                                                              -> media 7.3
//   - https://talkai.info/                        opdracht 1 t/m 5  -> opdracht 7.3 en 7.4
//   - https://www.youtube.com/embed/kwHKzSek8ws   "Zo verandert kunstmatige
//                                                intelligentie het onderwijs"
//                                                (verdieping les 16)
//                                                                   -> media 7.4, als verdieping gelabeld
//   - de robotafbeelding op pagina 120           -> als <img> in 7.1 theorieblok A
//
// WAT ER IN RONDE 2 IS HERSTELD (met de bronregels erbij)
// ------------------------------------------------------
// * Les 16, regel 29-31. De robotafbeelding bij "Daarom denken mensen bij AI al
//   snel aan dit soort robots:" was verdwenen. Ronde 2 zette er een BESCHRIJVING
//   van het beeld voor in de plaats plus de mededeling dat het beeld in de les
//   stond, en dat was geen herstel maar een nieuwe fout: er stond geen enkele
//   afbeelding in h7. Ronde 9 heeft het beeld er echt in gezet; zie hieronder.
// * Les 16, regel 38. "Zo maakt een chatbot per jaar minder fouten" is terug
//   naar de bronzin: "Zo maakt een chatbot steeds minder fouten."
// * Les 16, regel 39-44 en 72-77. De twee gescoorde bronvragen ("Kan AI zelf
//   denken als het zelf kan leren?" en "Wie kan uit zichzelf leren?") zijn weer
//   echte, nakijkbare vragen; ze staan in de afsluitquiz van 7.1 in
//   scripts/seed-verrijking/tl/h7.mjs. De term "machine learning" uit die vraag
//   wordt nu in theorieblok A van 7.1 uitgelegd in plaats van alleen genoemd.
// * Les 17. De vijf opdrachten staan weer in bronvolgorde in een doorlopend
//   document Chatbot_JouwVoornaam.docx: opdracht 1 en 2 in 7.3, opdracht 3, 4
//   en 5 in 7.4. De slotcontrole ("staan alle vijf de opdrachten erin?") staat
//   dus achter opdracht 5 en niet ervoor.
//
// WAT ER IN RONDE 3 IS HERSTELD
// -----------------------------
// De criticus keurde ronde 2 af omdat het hoofdstuk op paragraafniveau klopte
// maar op HOOFDSTUKniveau niet volgens de blauwdruk gebouwd was. De drie
// hoofdstukonderdelen die h5 en h6 van dezelfde leerweg wel hebben, staan er nu
// ook in. Ze staan hieronder met de plek erbij, zodat ze niet opnieuw stil
// kunnen verdwijnen.
//
// A. VOORKENNISCHECK OVER HOOFDSTUK 6 (blauwdruk, stap Voorkennis, 4-6 vragen;
//    merk: Bewijs). Vier terugblikvragen staan bovenaan de `checks` van 7.1, en
//    dezelfde vier staan als ophaalregels aan het begin van theorieblok A van
//    7.1. Ze gaan over algoritme (6.1), deepfake (6.6), de kenmerken van
//    nepnieuws (6.6) en het controleren van een bron (6.6). Dat zijn precies de
//    vier begrippen waar 7.1, 7.2 en 7.4 op leunen. Het checkblok van 7.1 telt
//    daardoor zeven vragen: vier voorkennis plus drie eigen startvragen.
// B. DEELTOETS OVER 7.1 EN 7.2 (blauwdruk, tussentoets voor de tweede helft).
//    Onder in het oefenblok van 7.2, na de vijf gewone opgaven: een routeregel,
//    ACHT deeltoetsvragen en daarna een steun- en een plusopgave die de route
//    uitvoeren. Geen cijfer; de uitslag bepaalt wie eerst terugleest en wie
//    doorgaat naar 7.3. Bij elke vraag staat in de uitleg welk theorieblok je
//    terugleest als hij misging. Verdeling: vraag 1 t/m 3 en 7 horen bij 7.1,
//    vraag 4 t/m 6 en 8 bij 7.2, dus vier per paragraaf en elk van de zes
//    leerdoelen minstens één keer. Vraag 7 (wanneer een chatbot leert van wat
//    jij typt) en vraag 8 (het gevaar voor beroepen) zijn de twee tweede beurten.
//    WAAROM 7.3 ER NIET IN ZIT, met de blauwdruk erbij. De blauwdruk vraagt een
//    deeltoets van 8 tot 10 vragen over paragraaf 1 tot en met 3. Het aantal is
//    nu gehaald, de dekking van drie paragrafen niet, en dat kan hier ook niet:
//    de deeltoets staat halverwege het hoofdstuk, vóór 7.3, en moet dus juist
//    bepalen wie 7.3 in mag. Vragen over stof die de leerling nog niet gehad
//    heeft, maken de route onbruikbaar. Dit hoofdstuk heeft bovendien vier
//    inhoudsparagrafen, geen zes; de blauwdrukstap "de tweede helft" begint hier
//    bij 7.3. De deeltoets dekt daarom de volledige eerste helft (7.1 en 7.2).
// C. DIAGNOSTISCHE RONDE VOOR DE HERHALING (blauwdruk: alle leerdoelen, een
//    vraag elk, met per gemist doel gericht herhaalmateriaal; merk: Bewijs,
//    want het toetseffect straalt aantoonbaar niet uit naar niet-bevraagde stof,
//    g=0,01 en g=0,04). Onder in het oefenblok van 7.5: veertien diagnosevragen,
//    een per leerdoel van 7.1 t/m 7.5, elk met het bijbehorende herhaalmateriaal
//    in de uitleg. Daarna een herstelspoor en een verdiepingsspoor.
//
// Verder in ronde 3:
// * Les 16, regel 120-121. De bronvraag "AI maakt dus wel eens fouten... Kunnen
//   deze fouten gevaarlijk zijn?" bestond alleen nog als kijkvraag bij het
//   mediablok van 7.2. Hij staat nu ook als nakijkbare open vraag in de
//   afsluitquiz van 7.2, met modelAnswer en nakijkpunten, net als zijn twee
//   buurvragen uit dezelfde les. De kijkvraag bij de video blijft staan.
// * Les 17, regel 195. De prompttip "Vermijd vage woorden zoals doe maar iets
//   of vertel wat" stond wel in 7.3 theorieblok B, maar ontbrak in het rijtje
//   tips bij opdracht 5 in 7.4 - juist op de plek waar de leerling hem toepast.
//   Hij staat er nu bij, precies zoals de bron dat rijtje afsluit.
// * De twee eigen leerdoelen van 7.5 haalden de vier-keer-lat uit PATROON.md
//   niet: ze hadden wel een startvraag en een oefening, maar geen toetsitem.
//   De hoofdstuktoets telt daarom nu 28 vragen in plaats van 24: veertien
//   leerdoelen maal twee. Zie de matrijs in scripts/seed-verrijking/tl/h7.mjs.
// * Taal. "zo een" is overal "zo'n" geworden (8x), net als in h6. Zes idiomen
//   die een leerling van 12 of 13 niet kent zijn vervangen door gewone taal:
//   wegwuiven, een zeldzaam mankement, uit de verf komen, glippen, leunen op en
//   struikelen. Alle zinnen van dertig woorden of meer zijn geknipt.
// * 7.3 theorieblok A neemt de versienamen van de bron letterlijk over
//   (GPT-3.5 gratis, GPT-4 betaald, Gemini voorheen Bard). Die blijven staan,
//   want de bron is leidend, maar er staat nu bij dat versienummers en prijzen
//   bijna elk jaar veranderen en dat de leerling zelf moet kijken welke versie
//   hij voor zich heeft.
//
// WAT ER IN RONDE 4 IS HERSTELD
// -----------------------------
// * Les 16, regel 56. De bron schrijft: "zelfs bij het maken van filmpjes of
//   foto's zie je AI terug, zoals in filters op Instagram of Snapchat". In 7.2
//   theorieblok A was dat versmald tot "in filters op Snapchat zit AI verwerkt".
//   De bronzin staat er nu weer voluit, met Instagram erbij.
// * Les 17, regel 66. Onderdeel 4 van een goede prompt is in de bron
//   "Eventueel: in welke taal of stijl". In 7.3 theorieblok B stond alleen nog
//   "en eventueel de stijl"; de taalkeuze is teruggezet.
// * De plusopgave van 7.2 vroeg waarom AI-beeld "omstreden" is. Dat woord komt
//   niet uit de bron en wordt nergens uitgelegd. Het is nu de bronformulering:
//   "waarom is er veel discussie over of het maken van AI-beeld wel mag"
//   (les 16, regel 97).
// De toetsreparatie van ronde 4 (T27 tegenover T20) en de herstelde matrijs
// staan in de kop van scripts/seed-verrijking/tl/h7.mjs.
//
// WAT ER IN RONDE 5 IS HERSTELD
// -----------------------------
// De criticus keurde ronde 3 af op een tegenspraak in 7.3 over de vier
// promptonderdelen. Ronde 4 zette de bronzin terug maar liet de tegenspraak
// staan: theorieblok B telde "eventueel taal of stijl" als vierde onderdeel,
// terwijl het leerdoel, de startcheck, het voorbeeld, de samenvatting, de
// oefeningen, de diagnoseronde en acht vragen de LENGTE als vierde tellen.
// * 7.3 theorieblok B noemt nu eerst de vier punten van de bron letterlijk
//   (les 17, regel 60-66), zegt daarna in één zin waarom wij van dat vierde
//   punt twee dingen maken, en legt vast welke vier je altijd invult:
//   opdracht, onderwerp, doelgroep en lengte. Taal en stijl zijn een vijfde
//   keuze. De bron verdwijnt dus niet en de tegenspraak is weg.
// * De toetsvraag over de vulkaanprompt (7.5) miste twee onderdelen in plaats
//   van één: er stond geen doelgroep én geen lengte, terwijl het goede antwoord
//   alleen de lengte noemde. De doelgroep staat nu in de prompt, zodat er
//   precies één onderdeel ontbreekt. De afleider "de taal" is vervangen door
//   "de doelgroep", want die denkfout hoort nu bij deze vraag.
//
// WAT ER IN RONDE 6 IS HERSTELD
// -----------------------------
// De criticus keurde ronde 5 af op vier aanwijsbare punten. Alle vier staan
// hieronder met de plek erbij, zodat ze na te meten zijn.
// (a) EEN MISVATTING IN DE VERPLICHTE LEERLIJN. 7.1 theorieblok B nam de bronzin
//     over dat een chatbot leert van wat jij hem schrijft, en liet die staan.
//     De correctie stond alleen in 7.6, en 7.6 is VRIJWILLIG; de plusRegels in
//     jaarplan.json garanderen dat wie hem overslaat niets van de leerlijn mist.
//     De correctie staat nu twee keer in de verplichte leerlijn:
//       - 7.1 theorieblok B, direct achter de bronzin: het leren gebeurt niet
//         tijdens jouw gesprek maar pas in een volgende trainingsronde, en het
//         model verandert tijdens het gesprek niets aan zichzelf;
//       - 7.4 theorieblok A, waar de training toch al ter sprake komt: die
//         training is klaar voordat jij begint.
//     Bovendien is het een nakijkbaar item geworden: deeltoets vraag 7 in het
//     oefenblok van 7.2 vraagt er rechtstreeks naar. De bronzin zelf blijft
//     onaangeraakt staan, want de bron is leidend.
//     7.6 REPAREERT NU NIETS MEER MAAR VERDIEPT: theorieblok A verwijst terug
//     naar 7.1 en 7.4 als bekende stof en legt uit waarom het zo werkt, namelijk
//     dat een trainingsronde weken rekenwerk op duizenden computers kost.
// (b) EEN ONWAARHEID TEGEN DE LEERLING IN 7.5. Theorieblok B zei dat de toets
//     langs de leerdoelen van "7.1 tot en met 7.4" loopt. De hoofdstuktoets
//     bevraagt ook de twee eigen doelen van 7.5, elk twee keer. Er staat nu
//     "7.1 tot en met 7.5". De vraag lager in dat blok over de bewijsstukken
//     blijft wel "7.1 tot en met 7.4", want de bewijsproducten komen uit die
//     vier paragrafen; dat is geen fout maar een ander bereik.
// (c) TELFOUT IN 7.3 THEORIEBLOK A. Er stond "de manier waarop je hem aanstuurt
//     is bij alle vier hetzelfde", terwijl datzelfde blok vijf chatbots noemt
//     (ChatGPT, TalkAI, Google Gemini, Microsoft Copilot, Meta AI). Het is nu
//     "bij allemaal hetzelfde".
// (d) DE KOP VAN DIT BESTAND LOOG OVER ZIJN EIGEN PRODUCT. Zie hieronder bij
//     stap 1: de gemelde afwijking van 15 tokens op het startcheckblok bestond
//     niet meer; in de seed is tokenTotal 0. De melding is vervangen door de
//     gecontroleerde waarde.
// (e) DE ENIGE INHOUDELIJKE BRONOMISSIE. Les 16, alinea "Chatbots": "Dit is een
//     AI die teksten kan schrijven, vragen kan beantwoorden of je kan helpen met
//     ideeën." Het schrijven en het beantwoorden zaten in 7.3, het BEDENKEN van
//     ideeën nergens. 7.3 theorieblok A noemt nu alle drie de toepassingen en
//     zegt erbij dat het derde gebruik op school gewoon mag.
// (f) DE DEELTOETS. Zes vragen is opgehoogd naar acht, de blauwdruknorm.
//     Zie punt B hierboven voor de verdeling en voor de reden dat 7.3 er niet
//     in kan zitten.
//
// WAT ER IN RONDE 7 IS HERSTELD
// -----------------------------
// De criticus keurde ronde 6 af op vijf aanwijsbare fouten in de LEERLINGtekst.
// Twee daarvan zaten in scripts/seed-verrijking/tl/h7.mjs (7.6 quizvraag 6 en
// de weken/maanden-tegenspraak); die staan in de kop van dat bestand. De vier
// hieronder zitten in dit bestand.
// (A) 7.1 THEORIEBLOK A, TELFOUT PLUS VERKEERDE RICHTING. De openingszin zei
//     "twee begrippen daaruit heb je in dit hoofdstuk meteen nodig", waarna er
//     vier voorkennisvragen volgden over vier begrippen. Dat is dezelfde telfout
//     als (c) van ronde 6, nu op een nieuwe plek. Daarbij verwees zin vier naar
//     "het checkblok hieronder", terwijl dv-tl-7-1-question-check in de seed
//     order 2 heeft en dv-tl-7-1-theory-1 order 3: het checkblok staat er dus
//     BOVEN. En de vier vragen stonden er woordelijk voor de tweede keer.
//     Alle drie de fouten zijn met één herschreven opening opgelost. Er staat nu
//     dat de vier terugblikvragen HIERBOVEN in het checkblok stonden, de vier
//     begrippen worden benoemd zonder de vragen te herhalen, en er staat bij
//     waar je terugleest als je er niet uit kwam (6.1 en 6.6). Vier zinnen
//     herhaling zijn zo vier zinnen geworden die iets nieuws doen.
// (B) 7.3 THEORIEBLOK B, EEN REDENERING DIE NIET KLOPTE. Ronde 6 dekte de oude
//     tegenspraak af met "Wij maken van dat laatste punt twee losse dingen,
//     omdat je de lengte bijna altijd nodig hebt". Lengte is geen onderdeel van
//     "taal of stijl" en volgt daar ook niet uit; de bron noemt de lengte pas
//     verderop, in het tipsrijtje bij opdracht 5 (les 17, regel 195 e.v.). Er
//     staat nu wat er werkelijk aan de hand is: het vierde bronpunt is met
//     "eventueel" erbij genoteerd, de lengte komt uit het tipsrijtje verderop in
//     dezelfde les, en daarom telt de lengte hier mee als vast onderdeel en
//     staan taal en stijl als vijfde keuze erachter. Voor tl geldt "leg het
//     waarom uit", dus juist deze zin mocht niet rammelen.
// (C) DE DEELTOETS VAN 7.2 WERD OVER VIER BLOKKEN UITGESMEERD. De generator
//     geeft elke `groep` zijn eigen blok (samen, zelf, steun, plus), en de
//     introzin stond in 'samen' terwijl de acht vragen in 'zelf' stonden. De
//     leerling las de opdracht dus onderaan het ene blok en vond de vragen in
//     het volgende. De intro staat nu zelf in 'zelf', direct boven vraag 1, in
//     hetzelfde blok. Bovendien stond de routeregel ("zes of meer goed: door
//     naar 7.3") alleen in het `antwoord`, en dat paneel gaat pas open na de
//     eigen poging - terwijl de leerling die regel juist vooraf nodig heeft.
//     De routeregel staat nu in het zichtbare `vraag`-veld van de intro, met
//     erbij waar het herstelspoor (blok Extra steun) en het plusspoor (blok
//     Extra plus) te vinden zijn. Vijf blokken zijn met deze generator niet te
//     maken, dus dit is de maximale samenhang die hier haalbaar is.
// (D) DE OMVANG VAN 7.5 WERD NERGENS AANGEKONDIGD. De checkpoint telt drie
//     startvragen, 22 oefenitems, een AI-dossier met vijf bewijsstukken en een
//     hoofdstuktoets van 28 vragen. Dat is geen les van 45 tot 60 minuten. Er
//     staat nu een aangekondigde knip in theorieblok B. De intro van de
//     diagnostische ronde herhaalt die knip op de plek zelf. De omvang is dus
//     niet kleiner geworden - er mag niets uit - maar wel verdeeld en gemeld.
//     LET OP: de knip zoals hij hier in ronde 4 stond beschreven was fout; de
//     juiste, nagemeten knip staat verderop bij BLOKKEREND 1 van deze ronde.
//
// WAT ER IN RONDE 9 IS HERSTELD
// -----------------------------
// De criticus keurde ronde 8 af op twee dingen die een leerling zelf kan zien
// kloppen niet, plus vijf verbeterpunten. Alle zeven zijn hieronder verwerkt.
//
// BLOKKEREND 1. HET PLAATJE DAT ER NIET WAS. 7.1 theorieblok A zei "In de les
//   staat zo'n beeld: een metalen wezen met armen, benen en een gezicht", en
//   stap 1 van de praktijkopdracht van 7.1 zei "zoals de robot in de les".
//   In de gegenereerde seed bevatte h7 tl NUL afbeeldingen. De leerling las dus
//   twee keer over een beeld dat hij nergens kon vinden, en "dit soort robots"
//   wees naar niets. Opgelost door het beeld er echt in te zetten in plaats van
//   de bewering erover: zie FOTO_ROBOT onder de imports. De foto staat als <img>
//   midden in theorieblok A, precies op de bronplek (les 16, regel 29-31,
//   pagina 120), en de vier zinnen eromheen doen nu didactisch werk: ASIMO kon
//   lopen en traplopen maar kon niet bedenken wat hij moest doen. Stap 1 van de
//   praktijkopdracht verwijst naar die foto in theorieblok A en laat de leerling
//   daarnaast een eigen robotafbeelding zoeken en vergelijken. Nagemeten in
//   docs/seeds/digitale-vaardigheden-vmbo1.seed.json: dv-tl-7-1-theory-1 bevat
//   nu één img-tag, en dat is de enige van h7.
// BLOKKEREND 2. DE DERDE TELFOUT. 7.5 theorieblok B zei "Loop daarom de vier
//   paragrafen van dit hoofdstuk langs", terwijl hoofdstuk 7 voor tl er zes
//   heeft (7.1 t/m 7.4, het checkpoint 7.5 en de vrijwillige 7.6). Dit is
//   dezelfde fout als ronde 6 punt (c) en ronde 7 punt (A). Er staat nu "de vier
//   paragrafen vóór deze checkpoint, dus 7.1 tot en met 7.4".
// VERBETERPUNT 1. DEZELFDE VRAAG TWEE KEER BELOOND IN 7.2. Stap 5 van de
//   praktijkopdracht vroeg woordelijk hetzelfde als quizvraag 7 ("waarom dragen
//   betere plaatjes bij aan meer verspreiding van nepnieuws"). De quizvraag
//   blijft staan, want dat is de bronvraag (les 16, regel 103). Stap 5 is een
//   ander meetmoment geworden: zoek een echt geval van een AI-beeld dat als
//   nepnieuws rondging en beschrijf wat er gebeurde. Uitleggen in de quiz,
//   bewijs zoeken in de opdracht.
// VERBETERPUNT 2. VIER KEER DEZELFDE ZIN IN 7.5. Het koepeldoel werd vier keer
//   bijna woordelijk als "leg in x zinnen uit hoe AI werkt" gevraagd. De
//   vier-keer-lat uit PATROON.md vraagt vier meetmomenten, geen vier kopieën.
//   De vier vormen zijn nu: startcheck = kiezen en ordenen (wat vertel je thuis
//   als eerste), oefenopgave = uitleggen aan iemand uit groep 8, diagnose doel
//   13 = drie fouten aanwijzen in de zin van een klasgenoot, T25 = zelf de
//   volledige uitleg schrijven. Hetzelfde is gedaan voor het tweede doel: de
//   startcheck vraagt nu wat je als eerste doet bij acht vlotte zinnen vol
//   jaartallen, terwijl diagnose doel 14 de prompt-plus-controleplan-vorm houdt.
// VERBETERPUNT 3. DE REFLECTIE VAN 7.4 STOND ACHTER DE INLEVERING. De vraag over
//   AI in het onderwijs kwam na "lever het document daarna in", en er stond niet
//   waar het antwoord heen moest. Hij staat nu vóór de slotcontrole, met een
//   eigen kopje in het document (Verdieping - AI in het onderwijs), een eigen
//   nakijkpunt en een plek in het invulveld. Tegelijk is het verdiepingskarakter
//   dat de bron eraan geeft ("Extra opdracht/verdieping VMBO", les 16 regel 172)
//   teruggezet: de opdrachttekst zegt nu zelf dat dit geen zesde opdracht is, en
//   het mediablok heet "Verdieping: de invloed van AI op het onderwijs".
// VERBETERPUNT 4. EEN ONJUISTE BRONCLAIM ZONDER CORRECTIE IN DE VERPLICHTE
//   LEERLIJN. 7.2 theorieblok B nam de bronzin over dat AI foto's "samenvoegt
//   tot een nieuw beeld" (les 16, regel 95-96). Een beeldmodel plakt geen foto's
//   aan elkaar. De correctie stond alleen in 7.6, en 7.6 is VRIJWILLIG - precies
//   de constructie die ronde 6 punt (a) voor de chatbot-leert-claim wel
//   repareerde. De bronzin blijft staan, want de bron is leidend, maar er volgen
//   nu vijf zinnen die zeggen wat er werkelijk gebeurt: geen knip- en plakwerk,
//   maar geleerde patronen waarmee het model vanaf ruis een nieuw beeld opbouwt, en daarom
//   zitten de fouten in details zoals het aantal vingers. Nakijkbaar gemaakt met
//   een eigen oefenopgave in 7.2 ("een AI-plaatje is gewoon een collage - wat
//   klopt hier wel en wat niet?").
// VERBETERPUNT 5. EEN BRONVRAAG DIE PAS IN DE TOETS TERUGKWAM. "Noem een
//   situatie waarin AI een positief effect heeft op ons dagelijks leven" (les 16,
//   regel 79) stond alleen nog in T16 van de hoofdstuktoets, drie paragrafen na
//   de plek waar de bron hem gebruikt om de uitleg te verankeren. Hij staat nu
//   ook als eerste samenoefening van 7.2, dus formatief op de bronplek; T16
//   blijft als summatieve variant met een gevaar erbij.
// TAAL. "intuïtie" en "bewustzijn" (7.1 theorieblok B, uit de bron) werden
//   gebruikt zonder uitleg; er staan nu twee uitlegzinnen bij, in dezelfde vorm
//   als "simuleert" al had. In 7.3 theorieblok B heetten binnen vijf zinnen twee
//   verschillende viertallen "de vier punten"; het bronrijtje heet nu "het
//   lijstje in de les" en het onze "vier vaste onderdelen", uitgeschreven als
//   vier vragen. In 7.6 zijn "identieke sollicitatiebrieven" en "verraderlijk"
//   vervangen door gewone taal.
// STRUCTUUR. De intro van de diagnostische ronde van 7.5 stond in de groep
//   'samen' terwijl de veertien vragen in 'zelf' stonden: de leerling las de
//   opdracht "maak ze eerst zelf" onder een kop die zegt dat de AI mag
//   meedenken. Dat is dezelfde ingreep als ronde 7 punt (C) voor de deeltoets
//   van 7.2: de intro staat nu zelf in 'zelf', als item 3 direct boven de
//   veertien vragen. Om het samenoefenblok niet tot één opgave te laten krimpen
//   is er een verdiepingsvraag bijgekomen die 7.2 en 7.4 aan elkaar knoopt
//   (hallucinatie en de zesde vinger komen uit dezelfde werking).
//
// WAT ER IN RONDE 10 IS HERSTELD
// -----------------------------
// BLOKKEREND 1. HET MEDIABLOK VAN 7.3 DROEG EEN VERZONNEN TITEL EN EEN
//   ONBEANTWOORDBARE KIJKVRAAG. Het blok heette "Zo werkt een AI-chatbot" en
//   vroeg: "Welk onderdeel van een prompt komt in de video terug dat jij zelf
//   nog nooit gebruikt hebt?" De video achter z1O3PPhi9Zc is in werkelijkheid
//   "Weer een nieuw versie van ChatGPT, leerkrachten zien meer fraude | Hart
//   van Nederland": een nieuwsitem uit maart 2023 over de release van GPT-4 en
//   een docent die meer ChatGPT ziet. Er komt geen promptonderdeel in voor, dus
//   de vraag was niet te maken. Titel en kijkvraag zijn vervangen door de echte
//   titel en een vraag die wel uit dit item te beantwoorden is (welk probleem
//   noemt de docent, en wat zegt theorieblok A over versienummers). De kijkvraag
//   veronderstelt nu ook niet meer dat de leerling al prompts geschreven heeft;
//   het blok staat immers voor de eerste praktijkopdracht.
//   Alle vijf de mediatitels zijn hierbij nagelopen en op de echte titel gezet:
//   QJE_ycgR8E8 heet "Kunstmatige intelligentie voor dummies in 2 minuten"
//   (RTL Z, stond hier als "Hoe leert een computer? Machine learning uitgelegd"),
//   rd-iIfbd07I heet "Waarom zegt AI dat je lijm op je pizza moet doen?",
//   kwHKzSek8ws heet "Zo verandert kunstmatige intelligentie het onderwijs" en
//   het Schooltv-item heet "Hoe kan AI vragen beantwoorden of teksten schrijven?
//   - AI is goed in het voorspellen van het volgende woord". Sturen doen we
//   voortaan in de kijkvraag, niet in een zelfbedachte titel.
// BLOKKEREND 2. EEN BEELDMODEL-MECHANISME DAT NIET BESTAAT, VIER KEER GELEERD.
//   7.2 theorieblok B zei dat het model "punt voor punt" een nieuw beeld tekent;
//   de zelf-oefening van 7.2 herhaalde dat, en 7.5 leerde het twee keer als
//   "de waarschijnlijkste volgende punt" en "de waarschijnlijkste volgende
//   pixel". Zo werkt geen enkel beeldmodel dat een leerling tegenkomt: er is
//   geen volgende pixel. Dat mechanisme was geleend van het taalmodel omdat de
//   parallel zo mooi uitkwam, en de leerling moest het in een verdiepingsvraag
//   naschrijven. Op alle vier de plekken staat nu wat er werkelijk gebeurt: het
//   model begint bij ruis en haalt die er in stappen af, waarbij het hele beeld
//   tegelijk scherper wordt naar de geleerde patronen toe. De les eronder (het
//   model kiest het waarschijnlijkste en controleert nooit of het bestaat) is
//   ongewijzigd, want die was juist. Ook het modelantwoord in de verrijking dat
//   over "welke pixels bij elkaar horen" sprak, is meegenomen.
// BLOKKEREND 3. TELFOUT IN 7.5 THEORIEBLOK B, DE VIERDE OP RIJ. Er stond "les 1
//   is de startcheck, de vijf oefenopgaven en het verzamelen van je vijf
//   bewijsstukken", terwijl 7.5 zes gewone oefenopgaven voor de diagnostische
//   ronde telt: twee samen, twee zelf, een steun en een plus. Ronde 9 zette er
//   bewust een samen-opgave bij en vergat de aankondiging mee te tellen. Er
//   staat nu "de zes oefenopgaven die voor de diagnostische ronde staan", zodat
//   de knip tussen les 1 en les 2 klopt. Alle telwoorden in dit hoofdstuk zijn
//   daarna nageteld in de gegenereerde seed: vier terugblikvragen (4), acht
//   vragen in de deeltoets (8), veertien diagnosevragen (14), elk leerdoel twee
//   keer in de toets (28 vragen op 14 doelen), zeven prompttips (7 <li>), vijf
//   bewijsstukken (5), vier paragrafen voor de checkpoint (7.1 t/m 7.4).
// VERBETERPUNT. De uitspraak "Het SLO en Netwerk Mediawijsheid noemen dat een
//   vaardigheid die je net zo goed moet leren als lezen (slo.nl,
//   mediawijsheid.nl)" stond in 7.5 theorieblok A zonder publicatie of jaartal.
//   In een hoofdstuk dat leert een bron na te lopen voordat je hem gelooft is
//   dat de verkeerde voorbeeldhandeling. De zin is afgezwakt tot een uitspraak
//   die het hoofdstuk zelf waar kan maken, en de twee domeinnamen zijn weg.
// VERBETERPUNT. De afsluitquizzen openden met "In het voorbeeld hierboven",
//   terwijl dat voorbeeld negen blokken hoger staat. Dat is nu vier keer "In
//   het uitgewerkte voorbeeld bij theorieblok A".
// VERBETERPUNT. De praktijkopdracht van 7.5 vroeg om "je AI-logboek uit 7.1,
//   inclusief de robotafbeelding" zonder te zeggen welke; dat is nu expliciet
//   de afbeelding die de leerling in stap 1 zelf heeft opgezocht, in lijn met
//   het modelantwoord van 7.1.
// NIVEAU. De uitgewerkte voorbeelden zaten op 10,44 woorden per zin (104 zinnen)
//   en dus ver onder de tl-band van 15 tot 20, terwijl juist die voorbeelden het
//   zware werk moeten doen. Alle twaalf zijn herschreven: 16,44 woorden per zin
//   over dezelfde 104 zinnen, geen zin meer onder de acht of boven de
//   vierentwintig woorden. De labels heten nu "Vraag:" en "Antwoord:" met een
//   dubbele punt, want het zijn kopjes en geen zinnen van een woord. Theorie
//   staat op 16,57 en de samenvattingen op 16,50; het hoofdstuk als geheel op
//   16,52.
// NIVEAU. De praktijkopdracht van 7.4 was bijna vijfhonderd woorden doorlopende
//   opdrachttekst waarin vijf genummerde opdrachten en zeven prompttips door
//   elkaar liepen. Elke opdracht heeft nu een eigen alinea met een vet kopje,
//   de zeven prompttips staan in een <ul> en de drie slotvragen in een <ol>.
// NIVEAU. Het woord "bronles" stond twee keer in leerlingtekst (mediablok en
//   praktijkopdracht van 7.4). Een leerling kent geen bronles; die verantwoording
//   hoort in deze kop en niet op zijn scherm. Beide zinnen zeggen nu gewoon dat
//   het om verdieping gaat.
// NIVEAU. "De diagnostische ronde" werd in 7.5 drie keer gebruikt zonder uitleg.
//   Bij de eerste vermelding staat er nu bij wat het is: een oefenronde zonder
//   cijfer die zichtbaar maakt welk leerdoel nog niet zit.
// NIVEAU. Vraag 3 van de startcheck van 7.5 vroeg naar "je map", twee blokken
//   voordat die map wordt geintroduceerd. De vraag gaat nu over welk werkstuk
//   uit 7.1 tot en met 7.4 al af is.
// BLAUWDRUK. Elk theorieblok was een <p> van 190 tot 335 woorden zonder een
//   enkele alinea-afbreking, en stap 2 van de blauwdruk ("2-4 kernbegrippen
//   vet") werd nergens uitgevoerd. Alle twaalf theorieblokken zijn nu in drie
//   tot vijf alinea's geknipt (langste alinea 122 woorden, de meeste onder de
//   honderd) en dragen hun eigen kernbegrippen als <strong>: 35 in totaal, twee
//   tot vier per blok, gelijk aan het keyTerms-veld in de verrijking. De
//   ASIMO-foto stond inline midden in de lopende tekst en staat nu als eigen
//   figuur tussen twee alinea's, met het bijschrift en de licentie eronder in
//   een eigen alinea.
//
// WAT ER IN RONDE 11 IS HERSTELD
// ------------------------------
// De criticus keurde ronde 10 af op de lesindeling van 7.5. Alle drie de
// blokkerende punten en vier van de vijf verbeterpunten zitten hieronder.
//
// BLOKKEREND 1. DE LESINDELING IN 7.5 THEORIEBLOK B LIEP NIET GELIJK MET DE
//   BLOKVOLGORDE. De tekst zei: les 1 is de startcheck, de zes oefenopgaven
//   vóór de diagnostische ronde, en het verzamelen van je vijf bewijsstukken;
//   les 2 is de ronde plus het spoor. In de seed staat de praktijkopdracht met
//   die vijf bewijsstukken op order 9, dus ACHTER de ronde (order 6) en achter
//   allebei de sporen (order 7 en 8). Wie les 1 volgens de tekst afmaakte moest
//   dus eerst langs alles wat de tekst zelf les 2 noemde. En de intro van de
//   ronde zei "Stop na deze ronde en het spoor dat erbij hoort; de toets is
//   les 3", waarmee de leerling van blok 8 rechtstreeks naar de toets ging en
//   de praktijkopdracht oversloeg: het bewijsproduct van de hele checkpoint.
//   De knip is nu nagemeten in docs/seeds/digitale-vaardigheden-vmbo1.seed.json
//   en volgt de blokvolgorde precies:
//     les 1 = startcheck (order 2), theorie (3 en 4), samen oefenen (5, twee
//             opgaven) en de eerste twee opgaven van zelf oefenen (6);
//             daarbij uitzoeken welke bewijsstukken nog ontbreken;
//     les 2 = de diagnostische ronde (6, items 3 t/m 17), het herstelspoor (7)
//             of het verdiepingsspoor (8), de praktijkopdracht (9) en de
//             samenvatting (10);
//     les 3 = de hoofdstuktoets (11).
//   De intro van de ronde noemt nu dezelfde route, met de praktijkopdracht er
//   expliciet in, en zegt pas daarna "stop hier".
// BLOKKEREND 2. DE VIJFDE TELFOUT, IN DEZELFDE ALINEA. "De zes oefenopgaven die
//   vóór de diagnostische ronde staan" klopte niet: dat zijn er vier (twee in
//   samen oefenen, twee in zelf oefenen). De andere twee gewone opgaven staan in
//   extra steun en extra plus en dus ACHTER de ronde. Nageteld in de seed:
//   samen 2 items, zelf 17 items (2 opgaven + intro + 14 diagnosevragen), steun
//   2 items (1 opgave + het spoor), plus 2 items (1 opgave + het spoor). Ronde
//   10 heeft dit getal juist van vijf naar zes gecorrigeerd; die correctie ging
//   dus de verkeerde kant op. De tekst noemt nu geen totaal meer maar wijst de
//   blokken aan: "de twee opgaven van samen oefenen en de eerste twee van zelf
//   oefenen". Een aanwijzing kan niet verjaren zoals een telwoord.
// BLOKKEREND 3. EEN VERWIJZING NAAR WERK DAT ER NOG NIET WAS. De uitleg bij
//   deeltoetsvraag 5 in 7.2 stuurde de leerling naar "je eigen screenshot uit de
//   praktijkopdracht nog eens", terwijl de deeltoets in blok order 6 zit en die
//   praktijkopdracht in order 10. Verwijst nu naar de samenoefening over de
//   zesde vinger, die in order 5 staat en dus wel gemaakt is.
// VERBETERPUNT 1. HET ROUTEGAT IN 7.2. De routeregel zei "zes of meer goed:
//   door naar 7.3", maar het verdiepingsspoor opende met "Alles goed in de
//   deeltoets?". Wie zes of zeven van de acht had, werd door geen van beide
//   sporen aangesproken. Dat is nu "Zes of meer goed in de deeltoets?", en de
//   uitleg bij de routeregel zegt hetzelfde. Het verdiepingsspoor van 7.5 had
//   dit gat niet: daar is herstel gekoppeld aan "ging er een vraag mis" en
//   verdieping aan "alles goed", en dat dekt samen alle uitslagen.
// VERBETERPUNT 2. HET MEDIABLOK VAN 7.6 BLIJFT EEN LINK. Het is als enige van de
//   zes geen YouTube-embed, dus de leerling verlaat de app in precies de
//   vrijwillige paragraaf waar de drempel het laagst moet zijn. Er is gezocht
//   naar een embedbare Nederlandstalige video over het voorspellen van het
//   volgende woord; de Schooltv-pagina heeft geen YouTube-versie en de
//   alternatieven waren commercieel en niet op VO-niveau te verifiëren. Een
//   werkende, inhoudelijk juiste publieke-omroepbron inruilen voor een
//   ongeverifieerde video is een verslechtering, dus de link blijft staan. Wel
//   is nu gemeld wat er gebeurt (opent in een nieuw tabblad, kom daarna terug)
//   en dat de kern van de uitleg ook in theorieblok A staat, zodat een leerling
//   die de link niet open krijgt niets mist. OPGELOST IN RONDE 12, niet door de
//   Schooltv-pagina te ruilen maar door er een geverifieerde Klokhuis-embed naast
//   te zetten; zie "WAT ER IN RONDE 12 IS HERSTELD" hieronder.
// VERBETERPUNT 3. EEN AFLEIDER DIE OP ZICHZELF WAAR WAS. Afleider 1 bij 7.1
//   quizvraag 1 luidde "De tijdlijn heeft internet nodig en de rekenmachine
//   niet", en dat is als losse bewering gewoon juist. Hij luidt nu "De tijdlijn
//   heeft internet nodig, en alleen programma's met internet zijn AI": dezelfde
//   denkfout, maar als geheel onwaar, dus niet meer te bediscussiëren bij het
//   nakijken. De misconception noemt nu gezichtsherkenning als offline AI.
// VERBETERPUNT 4. DE ZWAARSTE TOETSVRAAG OP PLEK 27 VAN 28. T27 is niet verzet,
//   want de toetsmatrijs in scripts/seed-verrijking/tl/h7.mjs koppelt elk T-
//   nummer aan een leerdoel en verschuiven breekt die verantwoording. Wel is de
//   leeslast geknipt: de opdracht was één doorlopende alinea met twee citaten,
//   een tweeledige aanwijsopdracht en een controleplan met drie eisen, en staat
//   nu als drie genummerde korte vragen onder de twee citaten. Geen eis is
//   vervallen; de nakijkpunten en het modelantwoord zijn ongewijzigd.
// BLAUWDRUK. UITLEG PER ANTWOORDOPTIE BIJ WAAR-NIET-WAAR. Alle tien de
//   waar-niet-waar-vragen van h7 tl gebruikten de korte vorm (waar: true/false),
//   en die vult in de generator lege explanation- en misconception-velden. Er
//   was dus alleen feedback per vraag. Ze staan nu alle tien uitgeschreven als
//   type: 'waar-niet-waar' met de twee opties Waar en Niet waar, met een
//   explanation op de goede knop en de denkfout op de foute. De feedback per
//   vraag is ongewijzigd gebleven.
// BRON. EEN BIJZIN UIT LES 16 TERUGGEZET. 7.2 theorieblok A zei "Sommige mensen
//   vinden dat handig, maar het roept ook vragen op die je serieus moet nemen".
//   De bron geeft er een reden bij: "want het maakt het werk makkelijker". Die
//   reden staat er weer in, als eigen zin voor de tegenwerping.
//
// WAT ER IN RONDE 12 IS HERSTELD
// ------------------------------
// Ronde 11 liet twee dingen open. Allebei zijn ze nu dicht; de rest van het
// hoofdstuk is ongemoeid gelaten, want de validator meldde er niets over.
//
// OPENSTAAND PUNT UIT RONDE 11: HET MEDIABLOK VAN 7.6 WAS EEN KALE LINK.
//   Als enige van de zes stuurde het mediablok van de vrijwillige paragraaf de
//   leerling de app uit, precies daar waar de drempel het laagst moet zijn.
//   Ronde 11 wilde de Schooltv-pagina niet inruilen voor een ongeverifieerde
//   video, en dat blijft juist: die pagina gaat exact over het voorspellen van
//   het volgende woord en hoort bij theorieblok A. De oplossing is daarom niet
//   ruilen maar aanvullen. 7.6 heeft nu een ARRAY van twee mediablokken:
//     1. de Schooltv-pagina, ongewijzigd, gelabeld als hoort bij theorieblok A;
//     2. https://www.youtube.com/embed/YwDFFGYf2kw, "Kun je AI antwoorden
//        vertrouwen? | Het Klokhuis over AI #5" van de NTR, een embed die in
//        HELIX zelf afspeelt en bij theorieblok B hoort.
//   Titel en kanaal van die tweede zijn geverifieerd via het oEmbed-endpoint van
//   YouTube zelf (title "Kun je AI antwoorden vertrouwen? | Het Klokhuis over AI
//   #5", author_name "Het Klokhuis"), dus niet alleen uit een zoekresultaat
//   overgenomen. De kijkvraag hangt aan het derde leerdoel van 7.6: waarom AI
//   zelfverzekerd klinkt terwijl het fout kan zijn. In de seed staat het blok als
//   dv-tl-7-6-media-2 met mediaKind "youtube"; de leerling die de externe link
//   niet open krijgt heeft nu dus wel bewegend beeld binnen de app.
// BLAUWDRUK: DE AFSLUITQUIZ VAN 7.2 HAD MAAR EEN TERUGKEERVRAAG. De blauwdruk
//   vraagt er twee per afsluitquiz; dat is de spreiding op paragraafniveau. In
//   7.1 zitten er twee (allebei naar hoofdstuk 6), in 7.3 twee (naar 7.1 en naar
//   hoofdstuk 4), in 7.4 twee (naar 7.3 en naar 7.2) en in 7.6 drie. Alleen 7.2
//   had er een: de open vraag die teruggrijpt op "AI begrijpt niets" uit 7.1.
//   Er staat nu een tweede bij, als vijfde vraag in
//   scripts/seed-verrijking/tl/h7.mjs onder '7.2'. Hij hangt aan het leerdoel van
//   7.1 over dagelijkse AI en laat de leerling uit vier handelingen die ene
//   aanwijzen die NIET via AI loopt (pinnen bij de kassa). Dat is dezelfde
//   scheidslijn als de samenoefening over de pinautomaat in 7.1, maar in een
//   nieuwe context, dus het is ophalen en geen herkenning van een eerder item.
//   Nagemeten na de wijziging: 715 blokken en 603 vragen voor tl, nog steeds 603
//   unieke feedbackzinnen, en de mechanische controles blijven op 0 bevindingen.
//
// WAT ER IN RONDE 13 IS HERSTELD
// ------------------------------
// Ronde 12 viel op twee verwijzingen. Dat waren de vijfde en de zesde keer dat
// dit hoofdstuk struikelde over een verwijzing of telwoord dat niet tegen de
// GEGENEREERDE seed was nagemeten (eerder: ronde 6 punt c, ronde 7 punt A,
// ronde 9 blokkerend 2, ronde 10 blokkerend 3, ronde 11 blokkerend 2). Het
// patroon zelf is deze ronde aangepakt, niet alleen de twee gevallen; zie
// DE VERWIJZINGSAUDIT onderaan dit blok.
//
// BLOKKEREND 1. EEN ZELF-OEFENING DIE EEN SAMENOEFENING WERD GENOEMD. De uitleg
//   bij deeltoetsvraag 5 in 7.2 stuurde de leerling naar "de samenoefening over
//   de zesde vinger". Nagemeten in de seed: dv-tl-7-2-question-oefenen-samen
//   (order 5) bevat twee opgaven, over een positief effect van AI en over de
//   broodvoorspelling van een supermarkt. De zesde vinger staat in
//   dv-tl-7-2-question-oefenen-zelf (order 6) als item 2. De deeltoets staat in
//   datzelfde blok als item 9, dus de opgave staat er letterlijk boven. De
//   uitleg zegt nu "de opgave over de zesde vinger bij Zelf oefenen hierboven".
//   Let op de herkomst van de fout: ronde 11 voegde deze zin in als reparatie
//   van een ander punt en nam het woord samenoefening over uit het geheugen van
//   die ronde in plaats van uit de seed.
// BLOKKEREND 2. WERK UIT 7.5 GEPRESENTEERD ALS WERK UIT 7.1 TOT EN MET 7.4. Het
//   antwoordpaneel van startcheckvraag 3 in 7.5 noemde het promptlogboek als een
//   van de werkstukken uit 7.1 tot en met 7.4. Nagemeten: het woord promptlogboek
//   komt in de hele h7-tl-seed alleen in 7.5 voor, en de eerste vermelding in
//   leesvolgorde was juist dit paneel (dv-tl-7-5-question-check, order 2), terwijl
//   theorieblok B twee blokken later zegt dat het promptlogboek nieuw is. Het
//   antwoord noemt nu de drie werkstukken die er wel zijn (AI-logboek uit 7.1,
//   screenshot uit 7.2, Chatbot_JouwVoornaam.docx uit 7.3 en 7.4) en zegt er
//   expliciet bij dat het promptlogboek pas in deze checkpoint begint.
// VERBETERPUNT: DE EIGEN AUDIT LIEP ACHTER. De kop telde 77 blokken en 65
//   gevulde, terwijl ronde 12 een tweede mediablok aan 7.6 toevoegde. Het zijn er
//   78 en 66. De telling staat nu met de verdeling per bloktype erbij, zodat een
//   volgende wijziging meteen zichtbaar maakt welk type erbij kwam.
// VERBETERPUNT: DE KIJKVRAAG VAN 7.2 DUBBELDE MET QUIZVRAAG 6. Beide vroegen of
//   zo'n fout gevaarlijk kan zijn, drie blokken uit elkaar. De bronvraag blijft;
//   de kijkvraag vraagt nu wat alleen uit het beeld te halen is: welk advies het
//   zoeksysteem letterlijk gaf en van wat voor soort bron het dat overnam.
// VERBETERPUNT: T24 WAS OP LENGTE TE RADEN. Het goede antwoord was met afstand
//   het langst van de vier. De vier opties liggen nu op 74, 75, 84 en 76 tekens,
//   met het goede antwoord op 76: derde van vier. Suitebreed staat de langste-
//   knop-gok voor tl daarmee op 18 procent (grens 45).
// VERBETERPUNT: T27 VROEG NAAR "DE VORM" ZONDER TE ZEGGEN WAT DAT IS. Wie
//   opdracht en lengte antwoordde had geen slechter argument dan wie lengte en
//   doelgroep antwoordde. De deelvraag vraagt nu welk stuk van de prompt de
//   LENGTE bepaalt en welk stuk de MOEILIJKHEID VAN DE WOORDEN. Modelantwoord,
//   nakijkpunt 1 en de feedback zijn meeveranderd.
// NIVEAU: VIJF WOORDEN DIE HOGER ZATEN DAN NODIG, terwijl de zin ook zonder kon.
//   verdienmodel -> prijs (7.1 quiz 1); portretlens -> scherptetruc van een echte
//   camera (7.2 quiz); maatschappelijk risico -> iets wat schade aanricht (7.5
//   toets); uitsluitsel -> maakt duidelijk wat waar is (7.4 steunopgave);
//   uitbesteden -> uit handen geven (7.4 zelf-oefening). Het zijn geen vakbegrippen
//   die dit hoofdstuk aanleert, dus er gaat geen leerstof verloren.
// NIVEAU: DE INTRO VAN DE DIAGNOSTISCHE RONDE SPRAK ONDERZOEKSTAAL. "oefenen op
//   een deel van de stof straalt aantoonbaar niet uit naar de rest" is niet te
//   raden voor een dertienjarige. Dat is nu: "Oefenen op een deel van de stof
//   neemt de rest niet mee. Wat je niet zelf ophaalt, blijft zwak, ook al ging de
//   rest goed." Drie korte zinnen in plaats van een van 27 woorden.
//
// DE VERWIJZINGSAUDIT (de eigenlijke reparatie van ronde 13)
// ----------------------------------------------------------
// Elk telwoord en elke verwijzing die naar een blok, een groep of een paragraaf
// wijst, is deze ronde MECHANISCH tegen docs/seeds/digitale-vaardigheden-vmbo1.
// seed.json gecontroleerd in plaats van uit het geheugen overgenomen. Drie
// controles, alle drie schoon:
//   1. GROEPSVERWIJZINGEN. Elke tekst die "samenoefening", "samen oefenen",
//      "zelf oefenen", "zelf-oefening", "steunopgave", "extra steun",
//      "plusopgave" of "extra plus" noemt, is opgezocht: bestaat dat blok in de
//      genoemde paragraaf, en staat het genoemde onderwerp daar ook echt in?
//      Alle verwijzingen in het hoofdstuk wijzen nu de juiste groep aan.
//   2. GECLAIMDE AANTALLEN. 78 blokken, 12 placeholders, 66 gevuld, 28
//      toetsvragen over 14 leerdoelen met elk precies 2, deeltoets 8 vragen,
//      diagnostische ronde 14 vragen, 7.5 zelf oefenen 17 items, 7.2 zelf
//      oefenen 12 items. Allemaal nageteld en kloppend.
//   3. TOESCHRIJVING VAN WERKSTUKKEN. AI-logboek hoort bij 7.1, screenshot bij
//      7.2, Chatbot_JouwVoornaam.docx bij 7.4 (opdrachten uit 7.3 en 7.4),
//      promptlogboek bij 7.5. Elke plek waar een van die vier aan een paragraaf
//      wordt toegeschreven, is tegen die tabel gehouden.
// Voor een volgende ronde: doe deze drie controles OPNIEUW na elke wijziging,
// ook als de wijziging klein lijkt. Beide blokkerende punten van ronde 12 zijn
// ontstaan doordat een reparatie van iets anders een verwijzing meebracht die
// niemand daarna nog heeft nagemeten.
//
// STILLE AFWIJKINGEN VAN DE BRON, alsnog gemeld
// ---------------------------------------------
// * Les 17 stelt de vraag "Hoe noemen we de opdracht die je aan een chatbot
//   geeft?" met als goede antwoord "prompt" en als afleider "opdracht". Die
//   vraag is in Wikiwijs onbeantwoordbaar, want "opdracht" is precies wat het
//   woord prompt betekent en staat in dezelfde les als omschrijving. In 7.3 zijn
//   de afleiders daarom "commando" en "zoekopdracht"; de vraag zelf en het goede
//   antwoord zijn ongewijzigd. Dat is een bewuste verbetering, geen omissie.
//
// WAT DIT HOOFDSTUK NIET LEVERT
// -----------------------------
// * De hoofdstukintroductie uit de blauwdruk ("waar gaat dit hoofdstuk over,
//   welke leerdoelen, wat lever je in; één scherm") ontbreekt. De enige
//   hoofdstuktekst is de sjabloonzin "Hoofdstuk 7 van Digitale vaardigheden."
//   Die zin wordt hardgecodeerd in scripts/generate-digitale-vaardigheden-seed.mjs
//   en is niet vanuit dit bestand te vullen. Van de acht hoofdstukonderdelen van
//   de blauwdruk levert dit hoofdstuk er dus zeven. Dit geldt suitebreed voor
//   alle acht hoofdstukken en hoort in de generator opgelost te worden.
// * Van de 78 blokken die de seed voor h7 tl telt, zijn er twaalf nog leeg:
//   zes slidedeckblokken met "Slidedeck-placeholder voor <titel>. De docent vult
//   deze presentatie later." en zes gameblokken met "Deze game wordt later
//   gebouwd." Gevuld zijn er dus 66. Ook die twaalf hulzen komen uit de
//   generator en niet uit dit bestand. (Nageteld in de gegenereerde seed op
//   26-08: 6 slidedeck, 36 question, 12 theory, 6 media, 6 summary, 5 quiz,
//   6 game, 1 toets = 78. Paragraaf 7.6 heeft als enige twee mediablokken.)
// * De tokens staan scheef, precies zoals de blauwdruk waarschuwt ("beloon wat
//   gemeten wordt"). Het Zelf oefenen-blok van 7.5 levert 3 tokens voor zeventien
//   opgaven inclusief de hele diagnoseronde; dat van 7.2 levert 4 tokens voor
//   twaalf opgaven inclusief de achtvragige deeltoets, terwijl de praktijkopdracht
//   van 7.1 er 20 oplevert en de nog lege game 10. Dit is NIET vanuit dit bestand
//   te sturen: p() en checkpoint() nemen alleen een paragraaftotaal, en de
//   verdeling over de blokken is in scripts/generate-digitale-vaardigheden-seed.mjs
//   voor alle paragrafen van alle acht hoofdstukken identiek (5/5/4/4/4/3/5/20/
//   10/30/10, bij een checkpoint 5/5/3/3/2/2/10/10/60/20). Het scheeftrekken
//   hoort dus in de generator opgelost te worden, in een keer voor de hele suite.
// * De deeltoets in 7.2 dekt twee paragrafen (7.1 en 7.2), niet de drie die de
//   blauwdruk noemt. Dat is bewust: de deeltoets moet bepalen wie 7.3 in mag, en
//   7.3 en 7.4 zijn samen een aaneengesloten praktijklijn in een Word-document
//   die je niet halverwege kunt afbreken voor een tussentoets. Het blijft een
//   afwijking van de norm en staat hier daarom als afwijking, niet als oplossing.
//
// BLAUWDRUKSTAPPEN DIE DE GENERATOR ONDERSTEUNT
// ---------------------------------------------
// * Stap 1, startcheck. De `checks` zijn objecten met vraag, antwoord, uitleg
//   en leerdoel. Het blok staat vóór de theorie, de Digidocent staat er uit en
//   de uitleg zit in een dichtgeklapt paneel: eerst zelf antwoorden, dan pas
//   openklappen. Er is precies één startvraag per leerdoel.
//   GECONTROLEERD, geen afwijking meer: de blauwdruk schrijft bij stap 1 "geen
//   cijfer, geen tokens" voor, en dat is precies wat de generator hier doet.
//   In docs/seeds/digitale-vaardigheden-vmbo1.seed.json hebben alle zes de
//   startcheckblokken (dv-tl-7-1-question-check t/m dv-tl-7-6-question-check)
//   tokenTotal 0, tokenConfig.enabled false en settings.allowAiHelp false.
//   Tot ronde 5 stond hier dat dit blok 15 tokens zou opleveren; dat klopte
//   niet meer met de seed en is geschrapt. Meet het na in de seed, niet in
//   deze kop.
// * Stap 4, 5 en 6, oefenen. `oefenen` in het optiesobject bevat per paragraaf
//   vijf uitgewerkte opgaven in de volgorde samen, zelf, zelf, steun, plus.
//   Zo staat er tussen het voordoen en de afsluitquiz echt geoefend werk, en
//   worden steun en plus ook daadwerkelijk gebruikt. In 7.2 staat daarin de
//   deeltoets (B hierboven), in 7.5 de diagnostische ronde (C hierboven).
// * Stap 8, bewijs. De praktijkopdracht is een object met tekst, modelAnswer en
//   nakijkpunten. De nakijkpunten komen als succescriteria bij de leerling in
//   beeld, het modelantwoord blijft docentdata in de nakijkstapel.
//
// 7.5 en 7.6 zijn in eigen woorden geschreven, met de bronnen in de tekst:
// Schooltv ("Hoe kan AI vragen beantwoorden of teksten schrijven?", schooltv.nl),
// en KU Leuven "AI voor iedereen" (aivooriedereen.cs.kuleuven.be). De verwijzing
// naar SLO en Netwerk Mediawijsheid is er in ronde 10 uit gehaald: die stond in
// leerlingtekst zonder publicatie of jaartal, en dat is precies de handeling die
// dit hoofdstuk afkeurt.
//
// 7.6 is de VRIJWILLIGE plusparagraaf van de theoretische leerweg: hij staat na
// het checkpoint, de hoofdstuktoets bevraagt hem niet en hij is geen voorwaarde
// om verder te mogen. Tokens levert hij wel op.
//
// De verrijking (leerdoelen, kernbegrippen, uitgewerkte voorbeelden,
// samenvattingen en alle toetsvragen) staat in scripts/seed-verrijking/tl/h7.mjs.

import { p, checkpoint, media } from '../helpers.mjs';

// DE ROBOTAFBEELDING UIT DE BRON (les 16, pagina 120)
// --------------------------------------------------
// De bron zet bij "Daarom denken mensen bij AI al snel aan dit soort robots:"
// een afbeelding van een menselijk ogende robot. Tot en met ronde 8 stond in
// 7.1 alleen de BEWERING dat dat beeld er was ("in de les staat zo'n beeld"),
// terwijl de gegenereerde seed van h7 nul afbeeldingen bevatte. De leerling las
// dus over een plaatje dat hij nergens kon vinden. Het beeld staat er nu echt,
// als <img> midden in theorieblok A van 7.1, precies op de plek waar de bron
// het zet: vlak voor de alinea die de misvatting onderuit haalt. Dezelfde
// oplossing die h2 gebruikt voor de zes onderdelenfoto's en h6 voor de twee
// houdingsfoto's, dus dit is geen nieuw patroon in deze leerweg.
// Gekozen is een vrij te gebruiken foto van Wikimedia Commons van ASIMO, de
// looprobot van Honda. Die doet inhoudelijk precies wat de bron wil: het is een
// metalen wezen met hoofd, armen en benen dat kón lopen en traplopen, maar niet
// kon bedenken wat het moest doen. Het beeld is dus tegelijk het plaatje uit de
// bron en het tegenvoorbeeld dat de alinea eronder nodig heeft.
const foto = (url, alt) => `<img src="${url}" alt="${alt}">`;

const FOTO_ROBOT = foto(
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/ASIMO_4.28.11.jpg/960px-ASIMO_4.28.11.jpg',
  'De looprobot ASIMO van Honda: een wit, metalen wezen ter grootte van een kind, met een helmvormig hoofd, twee armen en twee benen.'
);

const DOEL = {
  ai: 'Je kunt uitleggen wat kunstmatige intelligentie is.',
  data: 'Je weet dat AI leert van data en niet denkt zoals een mens.',
  dagelijks: 'Je kunt voorbeelden geven van AI die je elke dag gebruikt.',
  voordeelGevaar: 'Je kunt een voordeel en een gevaar van AI noemen.',
  beeld: 'Je kunt kenmerken noemen waaraan je een AI-afbeelding kunt herkennen.',
  gegevens: 'Je weet waarom je geen persoonlijke gegevens deelt met AI.',
  chatbot: 'Je kunt uitleggen wat een chatbot is en drie bekende chatbots noemen.',
  prompt: 'Je kunt een duidelijke prompt schrijven met opdracht, onderwerp, doelgroep en lengte.',
  word: 'Je kunt het antwoord van een chatbot netjes verwerken in Word.',
  hallucinatie: 'Je weet wat hallucinatie bij een chatbot betekent.',
  controleren: 'Je kunt controleren of het antwoord van een chatbot klopt.',
  schoolwerk: 'Je weet wat je met een chatbot wel en niet mag doen voor schoolwerk.',
  werking: 'Je kunt uitleggen hoe AI werkt en waar je op moet letten.',
  beoordelen: 'Je kunt een prompt schrijven en het antwoord kritisch beoordelen.',
  taalmodel: 'Je kunt uitleggen dat een taalmodel getraind is op heel veel tekst.',
  bias: 'Je kunt uitleggen wat vooringenomenheid in AI is en hoe die erin komt.',
  zeker: 'Je kunt beredeneren waarom AI zelfverzekerd klinkt terwijl het fout kan zijn.'
};

export default {
  chapter: 7,
  chapterTitle: 'Kunstmatige intelligentie en chatbots',
  badge: 'AI-Verkenner',
  paragraphs: [
    p('7.1', 'Wat is kunstmatige intelligentie?', ['21D'], 'AI-logboek van één dag met jouw eigen uitleg erbij', 100, 'Mens of Machine',
      ['Kunstmatige intelligentie: een programma dat leert van ervaring',
        'Hierboven, in het checkblok, stonden vier terugblikvragen over hoofdstuk 6. Ze gingen over het algoritme, de deepfake, de kenmerken van nepnieuws en het controleren van een bron. Precies die vier begrippen heb je in dit hoofdstuk meteen weer nodig. Kwam je er bij een vraag niet uit, lees paragraaf 6.1 en 6.6 dan even terug voor je verdergaat.</p><p>Misschien heb je er al van gehoord: <strong>kunstmatige intelligentie</strong>, in het Engels Artificial Intelligence, of kort gezegd AI. Dit is technologie waarmee computers taken kunnen uitvoeren die normaal alleen mensen kunnen, zoals leren, plannen of beslissingen nemen. Denk aan hoe je telefoon je herkent met gezichtsherkenning, of hoe TikTok precies weet welke filmpjes jij leuk vindt. Dat komt doordat er een algoritme achter zit: een slimme volgorde van stappen die de computer volgt om keuzes te maken. Hoe vaker je iets leuk vindt of bekijkt, hoe beter dat algoritme jou begrijpt, en dat leren van voorbeelden heet <strong>machine learning</strong>.</p><p>Wat AI bijzonder maakt is dat het kan leren van ervaringen, net zoals een mens leert van fouten. Maakt een zelfrijdende auto een fout, dan wordt die opgeslagen zodat het de volgende keer beter gaat. Zo lijkt het alsof de computer denkt, en daarom denken mensen bij AI al snel aan een robot als deze.</p>' + FOTO_ROBOT + '<p><em>Bijschrift bij de foto. Op deze foto zie je ASIMO, een looprobot die het bedrijf Honda in 2011 liet zien. Het is precies het beeld dat mensen voor zich zien: een metalen wezen met een hoofd, twee armen en twee benen. ASIMO kon lopen, traplopen en een blikje aangeven, maar zelf bedenken wat hij moest doen kon hij niet. Deze foto komt van Wikimedia Commons, is gemaakt door Vanillase en mag gebruikt worden onder de licentie CC BY-SA 3.0.</em></p><p>In werkelijkheid is kunstmatige intelligentie gewoon een <strong>computerprogramma</strong> zonder lichaam, hoe menselijk zo\'n robot ook overkomt. We kunnen dat programma wel in robots stoppen en ze leren hoe ze zich menselijk moeten gedragen. Een robot is dus de verpakking, en de kunstmatige intelligentie zit erin als software.'],
      ['AI leert van data, denkt niet, en zit in alles wat je gebruikt',
        'AI gebruikt <strong>data</strong> (gegevens) om te leren: schrijf jij iets naar een chatbot, dan gebruikt hij wat jij schrijft om te leren. Zo maakt een chatbot steeds minder fouten, want elke nieuwe zin is weer een voorbeeld. Let wel op wanneer dat leren gebeurt: niet tijdens jouw gesprek, maar pas in een volgende trainingsronde. Tijdens het gesprek zelf verandert het model niets aan zichzelf, ook al lijkt het alsof hij jou beter snapt.</p><p>Maar kan AI dan ook zelf denken, nu het zelf kan leren? Nee, AI denkt niet zoals mensen dat doen, want mensen hebben gevoelens, bewustzijn en intuïtie. Bewustzijn betekent dat jij weet dat je er bent en dat je merkt wat er met je gebeurt. Intuïtie is het gevoel dat er iets niet klopt, nog voordat je kunt uitleggen waaraan je dat merkt. Zulke ervaringen heeft een computerprogramma niet, hoe menselijk zijn antwoorden ook klinken. Mensen kunnen creatief of emotioneel reageren, terwijl AI niets begrijpt: het <strong>simuleert</strong>, het doet menselijk gedrag alleen maar na.</p><p>Precies daarom kom je AI overal tegen zonder dat het op een mens lijkt. Siri, Google Home en Alexa zijn <strong>spraakassistenten</strong>, en ook ChatGPT en de zoekbalk van Google gebruiken kunstmatige intelligentie. Je muziek-app, de aanbevelingen op YouTube en de filters op Instagram of Snapchat werken op precies dezelfde manier.</p><p>Al die systemen verzamelen gegevens over wat jij doet en berekenen daarmee wat jij waarschijnlijk wilt zien of horen. Ze begrijpen jou dus niet, ze rekenen: elk antwoord dat je krijgt is een <strong>voorspelling</strong> en geen zekerheid. Juist daarom maken ze ook fouten, en die fouten kunnen soms behoorlijk gevaarlijk uitpakken. De bedrijven achter deze systemen zijn dagelijks bezig hun AI te verbeteren, want elke gemelde fout is nieuwe data.</p><p>Voor jou betekent dit twee dingen. Ten eerste gebruik je AI veel vaker dan je denkt, meestal zonder dat je daar bewust voor kiest. Ten tweede beslis jij nog steeds wat je met zo\'n antwoord doet, want jij snapt waar het echt over gaat.'],
      media('https://www.youtube.com/embed/QJE_ycgR8E8', 'Kunstmatige intelligentie voor dummies in 2 minuten', 'Deze video van RTL Z legt in twee minuten uit wat kunstmatige intelligentie is. Welk soort systeem kan er volgens de video uit zichzelf leren, en aan welk voorbeeld uit het filmpje zie je dat het duidelijkst?'),
      [
        {
          vraag: 'Voorkennis hoofdstuk 6, vraag 1. Wat is een algoritme op social media, en waarvan leert het?',
          antwoord: 'Een computerregel die uitrekent welke berichten jij ziet. Hij leert van je klikken, je kijktijd en wat je opzoekt.',
          uitleg: 'Je hebt dit woord hier meteen weer nodig, want achter bijna elke AI zit zo\'n rekenregel die uit gedrag leert.',
          leerdoel: 'Je kunt uitleggen wat een algoritme op social media is.'
        },
        {
          vraag: 'Voorkennis hoofdstuk 6, vraag 2. Wat is een deepfake, en hoe wordt zulk beeld gemaakt?',
          antwoord: 'Een filmpje of foto die echt lijkt maar door een computer gemaakt is, met beeld van een bestaand gezicht.',
          uitleg: 'In paragraaf 7.2 komt de deepfake terug als gevaar van AI. Daar zie je ook waarom die twee bij elkaar horen.',
          leerdoel: 'Je weet wat een deepfake is en hoe die gemaakt wordt.'
        },
        {
          vraag: 'Voorkennis hoofdstuk 6, vraag 3. Noem drie kenmerken waaraan je nepnieuws kunt herkennen.',
          antwoord: 'Een schreeuwende kop, geen bron of auteur, en een bericht dat vooral op je gevoel inspeelt.',
          uitleg: 'Precies die kenmerken heb je straks nodig bij AI-beeld, want dat wordt vaak voor nepnieuws gebruikt.',
          leerdoel: 'Je kunt drie kenmerken van nepnieuws noemen.'
        },
        {
          vraag: 'Voorkennis hoofdstuk 6, vraag 4. Hoe controleer je of een bericht en zijn bron te vertrouwen zijn?',
          antwoord: 'Je zoekt hetzelfde nieuws bij een tweede, onafhankelijke bron en je kijkt wie het geschreven heeft en wanneer.',
          uitleg: 'Dit is dezelfde handeling die je in 7.4 bij een chatbotantwoord doet. Alleen de bron verandert, de stap niet.',
          leerdoel: 'Je kunt zelf controleren of een bericht en zijn bron betrouwbaar zijn.'
        },
        {
          vraag: 'Wat is kunstmatige intelligentie volgens jou? Schrijf het op in één zin.',
          antwoord: 'Technologie waarmee computers taken doen die normaal alleen mensen kunnen, zoals leren en beslissen.',
          uitleg: 'Het kenmerk is niet snelheid maar leren: een AI-systeem past zijn keuzes aan op grond van voorbeelden.',
          leerdoel: DOEL.ai
        },
        {
          vraag: 'Leert een computer op dezelfde manier als jij? Leg je antwoord uit.',
          antwoord: 'Nee. Een computer leert van data en patronen, maar begrijpt niets en heeft geen gevoel of bewustzijn.',
          uitleg: 'AI doet menselijk gedrag na. Dat heet simuleren, en het is iets anders dan snappen waar iets over gaat.',
          leerdoel: DOEL.data
        },
        {
          vraag: 'Welk apparaat koos vandaag iets voor jou zonder dat je erom vroeg?',
          antwoord: 'Bijvoorbeeld je telefoon bij het ontgrendelen, je tijdlijn, je muziek-app of de aanvulling in je zoekbalk.',
          uitleg: 'In al die gevallen voorspelt een systeem wat jij waarschijnlijk wilt, op grond van wat je eerder deed.',
          leerdoel: DOEL.dagelijks
        }
      ],
      {
        tekst: 'Maak een AI-logboek van één dag. Stap 1: kijk nog een keer naar de foto van de looprobot ASIMO in theorieblok A hierboven. Zoek daarnaast zelf een afbeelding van een robot die mensen met kunstmatige intelligentie in verband brengen. Plak jouw eigen afbeelding bovenaan je document en schrijf in drie zinnen waarom zulke beelden het verkeerde idee geven. Stap 2: schrijf van het opstaan tot het slapengaan elke keer op dat er iets voor jou gekozen of herkend werd. Denk aan gezichtsherkenning bij het ontgrendelen, de volgorde van je tijdlijn en een aanbevolen nummer. Denk ook aan een filter, een spraakassistent en de aanvulling in je zoekbalk. Stap 3: zet je lijst in Word in een tabel met drie kolommen: het systeem, wat de AI daar doet, en welke gegevens hij van jou nodig had. Stap 4: kies twee regels uit je tabel en schrijf er per regel drie zinnen bij over hoe dat systeem geleerd heeft wat jij leuk vindt. Stap 5: beantwoord de vraag uit de les: gebruik jij zelf AI, denk je? Waar merk je dat aan? Stap 6: sluit af met vijf zinnen waarin je uitlegt waarom AI wel kan leren, maar niet kan denken zoals jij. Sla het bestand op als AI-logboek_JouwVoornaam.docx en lever het in bij je docent.',
        label: 'Lever AI-logboek_JouwVoornaam.docx in en schrijf hier in twee zinnen wat je het meest verbaasde.',
        modelAnswer: 'Een voldoende logboek opent met een zelf gezochte robotafbeelding en drie zinnen die uitleggen dat AI meestal geen lichaam heeft maar software is. Die drie zinnen mogen naar ASIMO uit theorieblok A verwijzen: die robot kon wel lopen, maar de kunstmatige intelligentie zit in het programma en niet in het metaal. De tabel telt minstens acht regels, met per regel echte gegevens zoals kijkgedrag, locatie, gezichtskenmerken of zoekgeschiedenis. Bij de twee uitgewerkte regels staat dat het systeem leert van gedrag en niet van uitleg: het ziet wat je aanklikt en hoe lang je kijkt. De slotalinea gebruikt woorden als voorspellen of nadoen en zegt erbij dat AI geen gevoel, bewustzijn of intuïtie heeft.',
        nakijkpunten: [
          'Bovenaan staat een afbeelding die jij zelf gezocht hebt, met drie zinnen erbij over waarom dat beeld misleidt.',
          'De tabel noemt per systeem welke gegevens de AI van jou gebruikt.',
          'De twee uitgewerkte regels leggen uit dat het systeem leert van gedrag en niet van uitleg.',
          'De slotalinea gebruikt de woorden voorspellen of nadoen in plaats van denken.'
        ]
      },
      ['Wat betekent AI?', 'Wat doet een algoritme?', 'Waarvan leert AI?', 'Denkt AI zoals een mens?', 'Noem drie systemen met AI erin.'],
      'Sorteer voorbeelden op de vraag: leert dit systeem zelf, of volgt het alleen een vaste regel?',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Een pinautomaat en een muziek-app geven allebei antwoord op wat jij doet. Welke van de twee gebruikt AI?',
            antwoord: 'De muziek-app.',
            uitleg: 'De pinautomaat volgt vaste regels: dezelfde pas en dezelfde code geven altijd hetzelfde scherm. De muziek-app verandert zijn aanbevelingen doordat hij leert van wat jij beluistert en overslaat.',
            leerdoel: DOEL.ai
          },
          {
            groep: 'zelf',
            vraag: 'Je zus zegt dat haar telefoon "haar gezicht kent". Leg in twee zinnen uit wat er technisch echt gebeurt.',
            antwoord: 'Het systeem vergelijkt een gemeten patroon van haar gezicht met een patroon dat eerder is opgeslagen.',
            uitleg: 'Kennen is het verkeerde woord: er wordt niets herinnerd of begrepen. Het systeem is getraind op heel veel gezichten en berekent hoe waarschijnlijk het is dat dit patroon bij de opgeslagen eigenaar hoort.',
            leerdoel: DOEL.data
          },
          {
            groep: 'zelf',
            vraag: 'Noem drie systemen die jij vandaag gebruikt hebt waar AI in zit, en schrijf per systeem op wat de AI daar doet.',
            antwoord: 'Bijvoorbeeld: gezichtsherkenning bij het ontgrendelen, de aanbevelingen in je muziek-app, en de woordsuggesties op je toetsenbord.',
            uitleg: 'Zet er telkens een werkwoord bij: herkennen, aanbevelen of voorspellen. Zo zie je meteen dat het bij alle drie om voorspellen op grond van jouw gegevens gaat.',
            leerdoel: DOEL.dagelijks
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: AI leert van ..., maar het ... niets.',
            antwoord: 'AI leert van data (gegevens), maar het begrijpt niets.',
            uitleg: 'Deze twee woorden zijn de kern van de hele paragraaf. Leren gaat over voorbeelden verwerken; begrijpen gaat over snappen waar iets over gaat, en dat laatste kan een computer niet.',
            leerdoel: DOEL.data
          },
          {
            groep: 'plus',
            vraag: 'Twee klasgenoten openen dezelfde app en zien iets anders. Leg uit hoe dat kan als er maar één programma draait.',
            antwoord: 'Het programma is hetzelfde, maar de gegevens waarmee het rekent verschillen per persoon.',
            uitleg: 'Een AI-systeem heeft naast het programma ook een profiel per gebruiker: wat jij aanklikte, hoe lang je keek en wat je oversloeg. Dezelfde rekenregel op andere gegevens geeft daarom een andere uitkomst.',
            leerdoel: DOEL.dagelijks
          }
        ]
      }),

    p('7.2', 'Voordelen, gevaren en AI-beeld', ['21D', '23A', '23C'], 'onderzoekje naar AI-gezichten met twee bewijskenmerken', 100, 'Echt of Gegenereerd',
      ['Wat AI oplevert en wat het kost',
        'AI kan erg handig zijn, want computers met kunstmatige intelligentie verwerken veel sneller informatie dan mensen. Dat maakt ze goed in het zoeken naar <strong>patronen</strong>, en artsen gebruiken AI soms om een ziekte in een scan op te sporen. Dat kan levens redden, en ook in het dagelijks leven helpt AI ons op allerlei manieren. Je muziek-app leert wat jij leuk vindt en zoekmachines geven snel het juiste antwoord. Zelfs bij het maken van filmpjes of foto\'s zie je AI terug, zoals in filters op Instagram of Snapchat. Omdat AI vaak preciezer en sneller werkt, gebruiken steeds meer bedrijven het.</p><p>Sommige mensen vinden dat handig, want het maakt het werk makkelijker. Toch roept het ook vragen op die je serieus moet nemen. Want wat gebeurt er als een computer meer over jou weet dan je zelf doorhebt? AI-systemen verzamelen vaak persoonlijke gegevens, soms zonder dat je weet wat ermee gebeurt, en dat noemen we een <strong>privacyprobleem</strong>. Ook kunnen er misleidende dingen ontstaan, zoals <strong>deepfakes</strong>: filmpjes of foto\'s die er echt uitzien, maar helemaal nep zijn. Daar heb je in hoofdstuk 6 al over geleerd, toen het over nepnieuws en betrouwbare bronnen ging.</p><p>Ten slotte heeft AI invloed op werk: doordat computers steeds meer kunnen, verdwijnen sommige beroepen en ontstaat er onrust. Voordeel en gevaar zijn hier dus geen aparte lijstjes, maar twee kanten van dezelfde techniek.'],
      ['AI-beeld herkennen en je gegevens beschermen',
        'Je kunt tegenwoordig met een paar woorden een <strong>AI-afbeelding</strong> laten maken door zo\'n programma. Je zegt bijvoorbeeld: maak een foto van een draak op een skateboard in New York. Een paar seconden later zie je een plaatje dat eruitziet alsof iemand het echt gefotografeerd heeft. Maar die draak heeft nooit bestaan, en dat skateboard ook niet. Het lastige is dat zulke beelden moeilijk van echt te onderscheiden zijn, ook voor volwassenen. Soms zie je dat iets niet klopt: een hand met zes vingers, rare ogen, of kleding die vreemd overloopt. Maar vaak zijn ze zó goed gemaakt dat je het niet meteen ziet.</p><p>Hoe komt zo\'n beeld eigenlijk tot stand? AI gebruikt foto\'s die het aangeleverd kreeg of zelf op internet zocht, en voegt die samen tot een nieuw beeld. Zo staat het in de les, en de kern daarvan klopt: het beeld bestaat dankzij het werk van andere mensen. Toch is het geen knip- en plakwerk, want in het resultaat zit geen enkel stukje van een bestaande foto.</p><p>Het programma heeft uit miljoenen voorbeelden patronen geleerd, bijvoorbeeld hoe een hand eruitziet of hoe licht op water valt. Met die geleerde patronen bouwt het elke keer een compleet nieuw beeld op, en dat gaat anders dan je zou denken. Het begint namelijk met ruis: een vlek willekeurige kleurpunten waar nog helemaal niets in te herkennen valt. Daarna haalt het die ruis er in stappen weer af, en bij elke stap wordt het hele beeld tegelijk een beetje scherper. Wat er tevoorschijn komt, is telkens het beeld dat het beste bij de geleerde patronen en bij jouw opdracht past. Precies daarom gaan de fouten over details. Van een hand kent het model de vorm wel, maar de regel over vijf vingers niet.</p><p>Zulke beelden zijn dus gebaseerd op het werk van iemand anders, en daarom is er veel discussie over of dit wel mag. Plaatjes kloppen soms niet, maar omdat AI steeds meer leert, zien ze er ook steeds echter uit. Dat draagt weer bij aan meer nepnieuws, en daarom moet je juist nu leren kritisch te kijken. Stel dat iemand een <strong>gegenereerd</strong> beeld verspreidt dat iets schokkends laat zien, dan kan dat grote gevolgen hebben.</p><p>Let ten slotte ook op wat jij zelf weggeeft aan zo\'n systeem. Is het verstandig om al jouw <strong>persoonlijke gegevens</strong> te delen met AI? Nee, want die gegevens kunnen onbedoeld in verkeerde handen terechtkomen.'],
      media('https://www.youtube.com/embed/rd-iIfbd07I', 'Waarom zegt AI dat je lijm op je pizza moet doen?', 'Welk advies geeft het zoeksysteem in de video letterlijk, en wat voor soort bron had het dat advies van overgenomen?'),
      [
        {
          vraag: 'Noem één ding dat AI beter maakt en één ding dat het erger maakt.',
          antwoord: 'Beter: AI spoort een ziekte op in een scan. Erger: AI verzamelt persoonlijke gegevens of maakt deepfakes.',
          uitleg: 'Let op dat een gevaar over gevolgen voor mensen gaat, en niet over iets wat AI nog niet zo goed kan.',
          leerdoel: DOEL.voordeelGevaar
        },
        {
          vraag: 'Waaraan zou jij zien dat een foto door een computer gemaakt is?',
          antwoord: 'Aan kleine details: handen met te veel vingers, rare ogen, tanden, oren of kleding die vreemd overloopt.',
          uitleg: 'Het model is sterk in het grote geheel en zwak in details, dus daar zie je de fouten het eerst.',
          leerdoel: DOEL.beeld
        },
        {
          vraag: 'Wat kan er misgaan als je je adres aan een chatbot geeft?',
          antwoord: 'Je gegevens komen bij een bedrijf terecht dat ze kan opslaan, en je krijgt ze nooit meer terug.',
          uitleg: 'Losse gegevens lijken onschuldig, maar samen vormen ze een profiel waarmee iemand jou kan vinden.',
          leerdoel: DOEL.gegevens
        }
      ],
      {
        tekst: 'Opdracht: foto\'s. Ga naar de website This Person Does Not Exist: https://www.thispersondoesnotexist.com/. Elke keer dat je de pagina ververst, zie je een nieuwe foto. Toch bestaat geen enkele persoon op deze foto\'s echt; ze zijn door AI gegenereerd. Stap 1: kijk goed naar de gezichten, je mag zo vaak verversen als je wil. Stap 2: zoek een foto waarop iets niet klopt aan het gezicht en maak er een screenshot van. Stap 3: schrijf bij die screenshot twee kenmerken op waaraan je kunt zien dat het beeld niet echt is. Denk aan iets aan de oren, de ogen, de achtergrond, de tanden of de rand van een bril. Stap 4: laat je screenshot aan een klasgenoot zien zonder je kenmerken erbij, en noteer of hij of zij dezelfde dingen ziet. Stap 5: zoek op een controlesite zoals nieuwscheckers.nl of in het nieuws één AI-beeld dat echt als nepnieuws rondging. Schrijf in vijf zinnen op wat er te zien was, waarom mensen het geloofden en hoe het uiteindelijk uitkwam. Stap 6: schrijf in drie zinnen op wat jij het grootste voordeel van AI vindt en waarom. Zet alles onder elkaar in één Word-document en lever het in bij je docent.',
        label: 'Lever je Word-document in en schrijf hier de twee kenmerken op die je bij je eigen screenshot gevonden hebt.',
        modelAnswer: 'Een voldoende inzending toont één screenshot met twee kenmerken die echt op dat beeld te zien zijn. Denk aan twee verschillende oorbellen, een oor dat in het haar overloopt of tanden die in elkaar schuiven. Ook een bril met twee verschillende monturen telt, of tekst op de achtergrond die geen woord vormt. Bij stap 4 staat of de klasgenoot dezelfde dingen zag. Bij stap 5 hoort een echt geval met een aanwijsbare bron, bijvoorbeeld de gegenereerde foto van een explosie bij het Pentagon uit 2023 of de nepfoto van de paus in een witte jas. De vijf zinnen vertellen wat er te zien was, waarom mensen het geloofden en hoe het uitkwam, met de link erbij. Stap 6 noemt een voordeel met een reden erbij.',
        nakijkpunten: [
          'De twee kenmerken staan echt op jouw eigen screenshot en zijn geen algemeen lijstje.',
          'Het voorbeeld bij stap 5 is een echt geval met een link erbij, en je vertelt hoe het uitkwam.',
          'Het voordeel van AI dat je noemt is onderbouwd met een reden.'
        ]
      },
      ['Noem een voordeel van AI.', 'Noem een gevaar van AI.', 'Wat is een deepfake?', 'Waaraan herken je een AI-afbeelding?', 'Welke gegevens deel je nooit met AI?'],
      'Beoordeel twintig gezichten en verzamel punten voor elk kenmerk dat je goed aanwijst.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Noem een situatie waarin AI een positief effect heeft op ons dagelijks leven, en leg uit waarom dat een verbetering is.',
            antwoord: 'Bijvoorbeeld een arts die met AI een ziekte in een scan opspoort: de computer ziet patronen in duizenden beelden sneller dan een mens.',
            uitleg: 'Een goed antwoord noemt niet alleen wat AI doet, maar ook voor wie het beter wordt. Zeg dus niet "het gaat sneller", maar "de arts vindt de ziekte eerder, en daardoor kan de behandeling eerder beginnen".',
            leerdoel: DOEL.voordeelGevaar
          },
          {
            groep: 'zelf',
            vraag: 'Een klasgenoot zegt: een AI-plaatje is gewoon een collage, want de computer plakt bestaande foto\'s aan elkaar. Wat klopt hier wel en wat niet?',
            antwoord: 'Wel: het model is getraind op het werk van anderen. Niet: er zit geen stukje van een bestaande foto in het nieuwe beeld.',
            uitleg: 'Het programma heeft patronen geleerd, bijvoorbeeld hoe een hand of een schaduw eruitziet, en werkt vanaf een vlek ruis naar het beeld dat het beste bij die patronen past. Daarom kun je het origineel nergens terugvinden, en daarom zitten de fouten juist in details zoals het aantal vingers.',
            leerdoel: DOEL.beeld
          },
          {
            groep: 'samen',
            vraag: 'Een supermarkt gebruikt AI om te voorspellen hoeveel brood er morgen nodig is. Noem hier het voordeel en het gevaar bij.',
            antwoord: 'Voordeel: minder brood dat weggegooid wordt. Gevaar: de AI verzamelt gegevens over wie wat koopt.',
            uitleg: 'Zoek het voordeel altijd bij de taak zelf en het gevaar bij de gegevens of de gevolgen voor mensen. Een verkeerde voorspelling kost hier ook werk: er zijn minder handen nodig om de bestelling te doen.',
            leerdoel: DOEL.voordeelGevaar
          },
          {
            groep: 'zelf',
            vraag: 'Je krijgt een foto van een klasgenoot met een zesde vinger en een oorbel die halverwege ophoudt. Wat concludeer je, en wat doe je daarna?',
            antwoord: 'Waarschijnlijk een AI-afbeelding; ik stuur hem niet door en zoek eerst waar het beeld vandaan komt.',
            uitleg: 'Twee losse fouten aan details zijn samen een sterk signaal. Doorsturen is precies wat de maker wil, dus de eerste stap is stoppen en de herkomst zoeken, niet oordelen op het beeld alleen.',
            leerdoel: DOEL.beeld
          },
          {
            groep: 'zelf',
            vraag: 'Een chatbot vraagt: hoe heet je en op welke school zit je? Wat antwoord jij, en waarom?',
            antwoord: 'Niets persoonlijks; ik geef geen naam en geen schoolnaam, want die gegevens komen bij een bedrijf terecht.',
            uitleg: 'Je hoeft niet onbeleefd te zijn: je kunt gewoon doorgaan met je vraag. Naam plus school plus leeftijd is samen al genoeg om iemand te vinden, ook als elk gegeven los onschuldig lijkt.',
            leerdoel: DOEL.gegevens
          },
          {
            groep: 'steun',
            vraag: 'Zet deze drie in de goede kolom, voordeel of gevaar: sneller een ziekte vinden, deepfakes, beroepen die verdwijnen.',
            antwoord: 'Voordeel: sneller een ziekte vinden. Gevaar: deepfakes en beroepen die verdwijnen.',
            uitleg: 'Vraag jezelf per woord af wie er beter of slechter van wordt. Wordt een mens geholpen, dan is het een voordeel; raakt een mens iets kwijt, zoals zijn werk of de waarheid, dan is het een gevaar.',
            leerdoel: DOEL.voordeelGevaar
          },
          {
            groep: 'plus',
            vraag: 'Waarom is er veel discussie over of het maken van AI-beeld wel mag, ook als het beeld zelf niemand schaadt?',
            antwoord: 'Omdat het model getraind is op werk van makers die daar geen toestemming voor gaven en er niets voor kregen.',
            uitleg: 'Elk gegenereerd beeld is samengesteld uit patronen die uit bestaande foto\'s en tekeningen komen. De discussie gaat dus niet alleen over wat er op het plaatje staat, maar over wiens werk erin verwerkt zit.',
            leerdoel: DOEL.beeld
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets 7.1 en 7.2, lees dit eerst. Hieronder staan acht vragen; maak ze zelf, zonder terug te lezen. De routeregel is: zes of meer goed betekent door naar 7.3, vijf of minder goed betekent eerst teruglezen. Hoeveel denk je er goed te hebben?',
            antwoord: 'Je hoeft dit niet te raden: tel na vraag 8 hoeveel er goed waren en volg dan de routeregel die hierboven staat.',
            uitleg: 'Deze deeltoets levert geen cijfer op maar een route. Hij laat halverwege het hoofdstuk zien welk leerdoel nog niet zit, zodat je dat kunt herstellen voordat de hoofdstuktoets komt. Had je vijf of minder goed, ga dan naar het blok Extra steun; had je zes of meer goed, dan staat er een verdiepingsopgave in het blok Extra plus.',
            leerdoel: DOEL.ai
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 1. Wat is kunstmatige intelligentie? Geef de omschrijving in een zin.',
            antwoord: 'Technologie waarmee computers taken uitvoeren die normaal alleen mensen kunnen, zoals leren, plannen en beslissen.',
            uitleg: 'Ging deze mis, lees dan theorieblok A van 7.1 terug. Let op het werkwoord: het gaat om leren en beslissen, niet om snel rekenen.',
            leerdoel: DOEL.ai
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 2. Waarvan leert AI, en waarom is leren iets anders dan denken?',
            antwoord: 'AI leert van data. Denken is snappen waar iets over gaat, en dat kan AI niet: het simuleert, het doet gedrag na.',
            uitleg: 'Ging deze mis, lees dan theorieblok B van 7.1 terug en maak de steunopgave over leren en begrijpen opnieuw.',
            leerdoel: DOEL.data
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 3. Noem drie systemen met AI die je bijna elke dag gebruikt.',
            antwoord: 'Bijvoorbeeld gezichtsherkenning op je telefoon, de aanbevelingen in je muziek-app en de zoekbalk van Google.',
            uitleg: 'Ging deze mis, kijk dan naar je AI-logboek uit 7.1. Daar staan je eigen voorbeelden al in.',
            leerdoel: DOEL.dagelijks
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 4. Noem een voordeel en een gevaar van AI, en zeg erbij voor wie.',
            antwoord: 'Voordeel: een arts vindt sneller een ziekte in een scan. Gevaar: jouw persoonlijke gegevens komen bij een bedrijf terecht.',
            uitleg: 'Ging deze mis, lees dan theorieblok A van 7.2 terug. Zoek het voordeel bij de taak en het gevaar bij de gevolgen voor mensen.',
            leerdoel: DOEL.voordeelGevaar
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 5. Noem twee kenmerken waaraan je een AI-afbeelding kunt herkennen.',
            antwoord: 'Bijvoorbeeld een hand met zes vingers en kleding die vreemd overloopt. Ook oren, tanden en letters gaan vaak mis.',
            uitleg: 'Ging deze mis, lees dan theorieblok B van 7.2 terug en maak de opgave over de zesde vinger bij Zelf oefenen hierboven opnieuw.',
            leerdoel: DOEL.beeld
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 6. Waarom deel je geen persoonlijke gegevens met AI?',
            antwoord: 'Omdat die gegevens bij een bedrijf terechtkomen en onbedoeld in verkeerde handen kunnen komen.',
            uitleg: 'Ging deze mis, lees dan het slot van theorieblok B van 7.2 terug. Losse gegevens vormen samen een profiel waarmee iemand jou kan vinden.',
            leerdoel: DOEL.gegevens
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 7. Wanneer leert een chatbot iets van wat jij hem schrijft: tijdens jouw gesprek of later?',
            antwoord: 'Later. Tijdens het gesprek verandert het model niets aan zichzelf; jouw tekst kan pas meegaan in een volgende trainingsronde.',
            uitleg: 'Ging deze mis, lees dan theorieblok B van 7.1 terug. Veel mensen denken dat ze een chatbot al pratend zitten te trainen, maar het model staat tijdens jouw gesprek vast.',
            leerdoel: DOEL.data
          },
          {
            groep: 'zelf',
            vraag: 'Deeltoets vraag 8. Noem een gevaar van AI voor mensen die werken, en leg uit hoe dat gevaar ontstaat.',
            antwoord: 'Sommige beroepen verdwijnen, doordat een machine die taken sneller en goedkoper doet dan een mens dat kan.',
            uitleg: 'Ging deze mis, lees dan theorieblok A van 7.2 terug. Het gevaar zit niet in de techniek zelf, maar in het gevolg voor de mensen die dat werk deden.',
            leerdoel: DOEL.voordeelGevaar
          },
          {
            groep: 'steun',
            vraag: 'Vijf of minder goed in de deeltoets? Begin hier. Schrijf per gemiste vraag op welk leerdoel het was en bij welke paragraaf het hoort.',
            antwoord: 'Vraag 1, 2, 3 en 7 horen bij 7.1; vraag 4, 5, 6 en 8 horen bij 7.2. Lees precies die theorieblokken terug.',
            uitleg: 'Terugbladeren op gevoel kost veel tijd en levert weinig op. Door eerst het gemiste doel op te schrijven, weet je precies welk stuk tekst je nodig hebt.',
            leerdoel: DOEL.data
          },
          {
            groep: 'plus',
            vraag: 'Zes of meer goed in de deeltoets? Leg in vijf zinnen uit hoe het algoritme uit hoofdstuk 6 en de AI uit 7.1 met elkaar samenhangen.',
            antwoord: 'Allebei rekenen ze met jouw gegevens en voorspellen ze wat waarschijnlijk bij je past; het algoritme kiest berichten, de AI kiest antwoorden.',
            uitleg: 'Een algoritme is de stappenvolgorde, machine learning is de manier waarop die stappen zichzelf bijstellen. Wie dat verband ziet, snapt ook waarom twee mensen bij dezelfde app iets anders krijgen.',
            leerdoel: DOEL.ai
          }
        ]
      }),

    p('7.3', 'Een chatbot gebruiken: een goede prompt schrijven', ['21D', '22A'], 'Word-document met opdracht 1 en 2 uit de chatbotles', 100, 'Prompt Bouwer',
      ['Wat een chatbot is en welke er bestaan',
        'Een <strong>chatbot</strong> is een computerprogramma waarmee je kunt praten via tekst: je stelt een vraag of geeft een opdracht. De chatbot antwoordt of voert iets uit, en gebruikt kunstmatige intelligentie om te begrijpen wat je bedoelt. Zo\'n bot doet drie dingen voor je: teksten schrijven, vragen beantwoorden, en je helpen met ideeën. Dat derde vergeten leerlingen vaak, terwijl het juist mag: laat hem ideeën voor je spreekbeurt bedenken en kies zelf.</p><p>Ze reageren alsof je met een echt persoon praat, maar het zijn slimme programma\'s die het beste antwoord voorspellen. Er zijn twee soorten: sommige zijn heel simpel en geven vaste antwoorden, zoals de klantenservice van een webshop. Andere kunnen echt met je meedenken, zoals ChatGPT, TalkAI, Google Gemini of Microsoft Copilot. De bekendste is <strong>ChatGPT</strong>, gemaakt door het bedrijf OpenAI, dat een model gebruikt dat GPT heet. GPT-3.5 is gratis en kan al veel, terwijl GPT-4 nog slimmer is maar meestal alleen tegen betaling beschikbaar.</p><p>Ook andere bedrijven maken chatbots, zoals Google Gemini (voorheen Bard) en Microsoft Copilot in Word en Edge. Meta AI zit in Facebook en Instagram, en <strong>TalkAI</strong> is een gratis, eenvoudige chatbot speciaal voor leerlingen. Let op: deze versienummers en prijzen veranderen bijna elk jaar, dus wat hier staat kan alweer verouderd zijn.</p><p>Kijk daarom altijd zelf even welke versie je op dat moment voor je hebt. Sommige zijn goed in uitleg geven, andere maken plaatjes of vatten hele websites voor je samen. Ze verschillen vooral in snelheid, taalgebruik en in wat ze wel of niet mogen zeggen. Welke je ook kiest, de manier waarop je hem aanstuurt is bij allemaal hetzelfde.'],
      ['Een prompt die werkt',
        'Je stelt de chatbot een vraag of geeft een opdracht, en dat noemen we een <strong>prompt</strong>. Hoe duidelijker je prompt, hoe beter het antwoord dat je terugkrijgt. Het lijstje in de les noemt vier dingen. Wat je wil, waar het over moet gaan, voor wie het bedoeld is, en eventueel in welke taal of stijl. Bij dat laatste staat niet voor niets het woord eventueel, want de toon doet er lang niet altijd toe.</p><p>Verderop in dezelfde les staat een rijtje tips, en daar komt iets bij dat je juist bijna altijd nodig hebt: de lengte. Onthoud daarom vier vaste onderdelen als vier vragen. Wat moet de bot doen, waarover gaat het, voor wie is het bedoeld, en hoe lang mag het worden? Kort gezegd: opdracht, onderwerp, <strong>doelgroep</strong> en lengte. Taal en stijl zijn geen vast onderdeel maar een extra keuze, die je erbij zet als de toon uitmaakt.</p><p>Een voorbeeld: leg in makkelijke taal uit wat het verschil is tussen een hart en longen, in 5 zinnen, voor een leerling van 12 jaar. De chatbot zoekt dan de beste manier om dat uit te leggen, in eenvoudige woorden. Is het antwoord niet wat je zocht, dan ligt dat bijna altijd aan je prompt en niet aan de bot. Deze zeven tips uit de les helpen je daarbij, en ze staan hieronder allemaal op een rij.</p><ul><li>Voeg toe wat er nog ontbreekt, en wees duidelijk over wat je precies van de bot wil.</li><li>Geef <strong>context</strong> en leg kort uit waar het over gaat, zodat de bot je vraag kan plaatsen.</li><li>Geef een vorm en vraag om een lijstje, een uitleg, een verslag of een stappenplan.</li><li>Kies je doelgroep en zeg voor wie het bedoeld is, bijvoorbeeld voor een leerling van 12 jaar.</li><li>Geef ook aan hoe lang het moet worden, bijvoorbeeld kort, 5 zinnen of 100 woorden.</li><li>Leg uit welke rol de bot moet aannemen, bijvoorbeeld: schrijf alsof je mijn docent bent.</li><li>Vermijd vage woorden zoals doe maar iets of vertel wat, want daar kan niemand mee vooruit.</li></ul><p>Het antwoord zet je daarna netjes in Word, met een kop erboven en een leesbaar lettertype.'],
      media('https://www.youtube.com/embed/z1O3PPhi9Zc', 'Wéér een nieuw versie van ChatGPT, leerkrachten zien meer fraude | Hart van Nederland', 'Dit nieuwsitem is van maart 2023 en gaat over de toen splinternieuwe versie GPT-4 en over een docent die meer ChatGPT ziet bij zijn leerlingen. Welk probleem op school noemt die docent, en wat zegt theorieblok A hierboven over versienummers die snel verouderen?'),
      [
        {
          vraag: 'Wat is een chatbot, en welke drie ken jij bij naam?',
          antwoord: 'Een programma waarmee je via tekst praat. Bekende voorbeelden zijn ChatGPT, Google Gemini en TalkAI.',
          uitleg: 'Er zijn twee soorten: eentje met vaste antwoorden uit een lijstje, en eentje die met AI zelf een antwoord vormt.',
          leerdoel: DOEL.chatbot
        },
        {
          vraag: 'Welke onderdelen horen er in een goede opdracht aan een chatbot?',
          antwoord: 'Wat je wil, waar het over gaat, voor wie het bedoeld is, en hoe lang het moet zijn.',
          uitleg: 'Die opdracht heet een prompt. Ontbreekt er een onderdeel, dan vult de chatbot dat zelf in.',
          leerdoel: DOEL.prompt
        },
        {
          vraag: 'Hoe zorg je dat het antwoord daarna netjes in je eigen Word-document staat?',
          antwoord: 'Zet er een kop boven, kies één leesbaar lettertype in grootte 11 of 12 en druk de begrippen dik.',
          uitleg: 'Geplakte tekst neemt de opmaak van de website mee, dus die trek je eerst recht; zie hoofdstuk 4.',
          leerdoel: DOEL.word
        }
      ],
      {
        tekst: 'Je begint hier één Word-document dat je in paragraaf 7.4 afmaakt. Open eerst https://talkai.info/ en kies de Nederlandstalige chatbot; je hoeft geen account aan te maken. Opdracht 1 - Eerste prompt in TalkAI. Typ deze prompt: Leg kort uit wat een chatbot is en noem 3 voorbeelden. Lees het antwoord goed door, kopieer het en plak het in een nieuw Word-document. Zet erboven: Opdracht 1 - Wat is een chatbot? Sla het document op als Chatbot_JouwVoornaam.docx. Opdracht 2 - Zelf een goede prompt maken. Bedenk een onderwerp dat je interessant vindt, bijvoorbeeld voetbal, gamen, muziek, gezondheid, eten of dieren. Typ een duidelijke prompt waarin je vraagt om een korte uitleg over dat onderwerp, voor iemand van 12 jaar. Een voorbeeld: leg uit hoe de VAR werkt bij voetbal, in begrijpelijke taal. Kopieer ook dit antwoord naar Word, onder je eerste opdracht. Zet erboven: Opdracht 2 - Mijn eigen prompt. Gebruik de Word-opmaak uit hoofdstuk 4: een kop boven elke opdracht, een leesbaar lettertype in grootte 11 of 12, en geen vreemde kleuren uit de chatbot.',
        label: 'Plak hier de prompt die je bij opdracht 2 zelf bedacht hebt, en zeg erbij welke vier onderdelen erin staan.',
        modelAnswer: 'Het document heet Chatbot_JouwVoornaam.docx en bevat twee genummerde kopjes met daaronder het geplakte antwoord. De prompt bij opdracht 2 bevat minstens opdracht, onderwerp en doelgroep. Een voorbeeld: leg in 5 zinnen uit hoe een gitaar geluid maakt, voor een leerling van 12 jaar, in makkelijke woorden. In het invulveld wijst de leerling de onderdelen aan. Leg uit is de opdracht en hoe een gitaar geluid maakt is het onderwerp. Een leerling van 12 jaar is de doelgroep en 5 zinnen is de lengte.',
        nakijkpunten: [
          'Het bestand heet Chatbot_JouwVoornaam.docx en beide kopjes staan boven het juiste antwoord.',
          'Je zelfbedachte prompt noemt een doelgroep en is geen los trefwoord.',
          'De geplakte tekst staat in het lettertype van je document en niet in dat van de website.'
        ]
      },
      ['Wat is een chatbot?', 'Noem drie bekende chatbots.', 'Hoe heet de opdracht die je een chatbot geeft?', 'Welke vier onderdelen horen in een goede prompt?', 'Waarom is doe maar iets een slechte prompt?'],
      'Bouw prompts uit losse onderdelen en zie per prompt hoe bruikbaar het antwoord wordt.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Je typt bij een webshopbot: mijn pakket is kwijt en ik wil weten of ik geld terugkrijg. Wat gebeurt er waarschijnlijk?',
            antwoord: 'Hij geeft een vast antwoord over bezorging of vraagt je een keuze uit zijn menu.',
            uitleg: 'Deze bot kan alleen uit een lijstje kiezen dat iemand vooraf heeft ingevuld. Een AI-chatbot zoals ChatGPT of TalkAI vormt wel een eigen antwoord, ook op een vraag die niemand had voorzien.',
            leerdoel: DOEL.chatbot
          },
          {
            groep: 'zelf',
            vraag: 'Verbeter deze prompt: vertel wat over gamen. Schrijf de nieuwe prompt op en zeg wat je toegevoegd hebt.',
            antwoord: 'Bijvoorbeeld: leg in 6 zinnen uit welke gevolgen laat gamen heeft voor je slaap, voor een leerling van 12 jaar.',
            uitleg: 'Toegevoegd zijn: de opdracht (leg uit), een smaller onderwerp (gevolgen voor slaap), de doelgroep (12 jaar) en de lengte (6 zinnen). Het onderwerp smaller maken helpt het meest, want gamen is te groot voor zes zinnen.',
            leerdoel: DOEL.prompt
          },
          {
            groep: 'zelf',
            vraag: 'Je plakt een chatbotantwoord in Word en het staat opeens in een grijs kader met een raar lettertype. Wat doe je?',
            antwoord: 'Plakken zonder opmaak gebruiken, of de tekst selecteren en het lettertype en de opmaak gelijktrekken.',
            uitleg: 'De browser stuurt kleur, achtergrond en regelafstand mee. Trek dat eerst recht naar één lettertype in grootte 11 of 12; pas daarna zet je een kop erboven en druk je de begrippen dik.',
            leerdoel: DOEL.word
          },
          {
            groep: 'steun',
            vraag: 'Streep door wat niet in een prompt hoort: opdracht, onderwerp, doelgroep, lengte, jouw adres.',
            antwoord: 'Jouw adres hoort er niet in; de andere vier wel.',
            uitleg: 'De vier onderdelen maken je vraag duidelijker. Persoonlijke gegevens maken je vraag niet beter, en ze komen wel bij het bedrijf achter de chatbot terecht.',
            leerdoel: DOEL.prompt
          },
          {
            groep: 'plus',
            vraag: 'Waarom werkt de toevoeging "schrijf alsof je mijn docent bent" vaak beter dan "maak het makkelijker"?',
            antwoord: 'Omdat een rol een hele schrijfstijl meebrengt, terwijl makkelijker niets vastlegt over toon of opbouw.',
            uitleg: 'Het model voorspelt woorden die passen bij wat je vraagt. Bij een rol past een heel patroon van uitleggen, voorbeelden geven en samenvatten; bij het woord makkelijker past alleen kortere woordkeuze.',
            leerdoel: DOEL.prompt
          }
        ]
      }),

    p('7.4', 'Kritisch met chatbots: hallucinatie en veilig gebruik', ['21D', '23A'], 'gecontroleerd chatbotverslag in je eigen woorden', 100, 'Klopt Dat Wel',
      ['Hoe een chatbot aan zijn antwoorden komt, en waar het misgaat',
        'Een chatbot leest geen internetpagina\'s op het moment dat jij iets vraagt, tenzij hij daar speciaal toestemming voor heeft. Chatbots zijn <strong>getraind</strong> op enorme hoeveelheden tekst uit boeken, websites en artikelen, en leren daaruit wat waarschijnlijk een goed antwoord is. Die training is klaar voordat jij begint: wat jij typt gaat hooguit mee in een volgende trainingsronde. Maar zo\'n model kan ook fouten maken, oude informatie gebruiken of dingen erbij verzinnen als het iets niet zeker weet. Dat verzinnen noemen we <strong>hallucinatie</strong>, en het is geen storing maar een gevolg van de werking.</p><p>Het vervelende is dat een hallucinatie er precies hetzelfde uitziet als een goed antwoord. De bot schrijft hem namelijk in dezelfde rustige, zekere zinnen als alle andere antwoorden. Daarom moet je altijd kritisch blijven en zelf <strong>controleren</strong> wat er staat, met drie vaste vragen. Klopt dit helemaal, hoe weet je dat, en kun je dit controleren op een andere website?</p><p>Zoek dus een tweede bron die los staat van de chatbot, bijvoorbeeld een encyclopedie, een nieuwssite of je schoolboek. Spreken je twee bronnen elkaar tegen, dan weet je nog niet wie gelijk heeft, maar wel dat je verder moet zoeken. Getallen, jaartallen en namen zijn de plekken waar een model het snelst iets invult. Een chatbot is handig maar niet perfect, en jij blijft verantwoordelijk voor wat je inlevert.'],
      ['Veilig gebruik en de regels voor schoolwerk',
        'Deel nooit je <strong>persoonlijke informatie</strong> met een chatbot, want achter die chatbot zit een bedrijf met mensen. Zij hebben mogelijk toegang tot alles wat jij in het gesprek typt of uploadt. Je echte naam, je adres, je telefoonnummer of gegevens van anderen geef je dus niet door. Je weet namelijk nooit wie er aan de andere kant van de techniek zit, of hoe die gegevens worden opgeslagen.</p><p>Deel ook de gegevens van iemand anders niet, en upload geen foto\'s waar jij of andere mensen op staan. De chatbot kan die beelden namelijk gebruiken om er nieuwe beelden mee te maken. Je voedt hem dan met gegevens die van jou of van andere mensen zijn.</p><p>Voor schoolwerk gelden aparte afspraken, want docenten kunnen controleren of je AI gebruikt hebt. Dat komt doordat AI vaak een manier van schrijven gebruikt die minder menselijk aanvoelt. Er wordt bovendien steeds meer nagedacht over systemen om dit te kunnen herkennen. Dat betekent niet dat je AI helemaal niet mag gebruiken, alleen niet om je schoolwerk voor je te maken. Om hulp vragen mag wel: laat iets uitleggen, of laat de moeilijke begrippen uit een tekst halen. Neem het daarna over in je <strong>eigen woorden</strong>, want een <strong>werkstuk</strong> schrijf je altijd zelf. Juist van dat herschrijven leer je het meest, en dat merk je later bij je toets.'],
      media('https://www.youtube.com/embed/kwHKzSek8ws', 'Zo verandert kunstmatige intelligentie het onderwijs', 'Dit filmpje hoort bij de verdieping en niet bij de vijf gewone opdrachten. Welke verandering in het onderwijs laat de video zien, en vind jij die verandering vooral goed nieuws of juist zorgelijk?'),
      [
        {
          vraag: 'Wat betekent het als iemand zegt dat een chatbot hallucineert?',
          antwoord: 'Dat de chatbot informatie verzint als hij het niet zeker weet, en die opschrijft alsof het waar is.',
          uitleg: 'Het is geen storing maar een gevolg van de werking: het model kiest steeds het waarschijnlijkste antwoord.',
          leerdoel: DOEL.hallucinatie
        },
        {
          vraag: 'Hoe zou jij nagaan of een antwoord van een chatbot echt klopt?',
          antwoord: 'Het feit opzoeken bij een bron buiten de chatbot, bijvoorbeeld een encyclopedie of een nieuwssite.',
          uitleg: 'Dezelfde vraag nog eens stellen is geen controle, want dat is hetzelfde model met dezelfde trainingsteksten.',
          leerdoel: DOEL.controleren
        },
        {
          vraag: 'Wat mag je een chatbot wel en niet laten doen bij een werkstuk?',
          antwoord: 'Wel: uitleg vragen of begrippen laten aanwijzen. Niet: je tekst laten schrijven en die inleveren.',
          uitleg: 'De grens ligt bij wie het denkwerk doet. Jij schrijft de tekst die je inlevert, in je eigen woorden.',
          leerdoel: DOEL.schoolwerk
        }
      ],
      {
        tekst: 'Werk verder in Chatbot_JouwVoornaam.docx uit paragraaf 7.3, zodat de vijf opdrachten op volgorde in een document komen. Hieronder staat elke opdracht in een eigen alinea, zodat je ze een voor een kunt afvinken. </p><p><strong>Opdracht 3 - Fout zoeken en verbeteren.</strong> Vraag TalkAI: wat is het verschil tussen een dolfijn en een haai? Let goed op of het antwoord klopt en of je ergens een fout ziet staan. Plak het antwoord daarna in je document. Schrijf eronder het antwoord op deze drie vragen: klopt dit helemaal, hoe weet je dat, en kun je dit controleren op een andere website? Noem daarbij de tweede bron die je gebruikt hebt, met de link erbij. </p><p><strong>Opdracht 4 - Hulp van de chatbot.</strong> Stel dat je een werkstuk moet maken over gezond eten. Het is niet de bedoeling dat je de informatie letterlijk kopieert, want een werkstuk schrijf je altijd zelf. Geef in TalkAI deze prompt: maak een kort verslag over gezond eten voor een leerling van de eerste klas vmbo, in maximaal 8 zinnen, gebruik makkelijke woorden. Zet die tekst daarna in je eigen woorden in Word, ook in ongeveer 8 zinnen, met erboven het kopje: Opdracht 4 - Verslag gezond eten. Gebruik de opmaak die je eerder geleerd hebt: een titel bovenaan, een duidelijk lettertype zoals Arial of Calibri, tekstgrootte 11 of 12, en de begrippen dikgedrukt. Begrippen zijn de moeilijke woorden die met het onderwerp te maken hebben; je mag de chatbot vragen die begrippen voor je uit de tekst te halen. </p><p><strong>Opdracht 5 - Zelf denken.</strong> Ook al schrijft de chatbot iets voor je uit, jij moet het zelf vragen, en heel duidelijk ook. Bedenk nu een eigen prompt en loop daarbij alle zeven tips uit paragraaf 7.3 langs. </p><ul> <li>Wees duidelijk en zeg precies wat je wil dat de chatbot doet.</li> <li>Geef context en leg kort uit waar het onderwerp over gaat.</li> <li>Geef een vorm en vraag om een lijstje, een uitleg, een verslag of een stappenplan.</li> <li>Kies je doelgroep en zeg voor wie de tekst bedoeld is.</li> <li>Geef een lengte en zet in je prompt dat er maximaal 300 woorden geschreven worden.</li> <li>Geef de bot een rol, bijvoorbeeld: schrijf alsof je mijn docent bent.</li> <li>Vermijd vage woorden zoals doe maar iets of vertel wat.</li> </ul><p>Schrijf in je document het kopje Opdracht 5 - zelf denken, daaronder Prompt: met je eigen prompt, en daaronder Antwoord: met het antwoord van de chatbot. Neem daarna deze drie vragen over en beantwoord ze in je document. </p><ol> <li>Heeft de chatbot fouten gemaakt? Zo ja, welke fouten waren dat precies?</li> <li>Heeft de chatbot goed naar je prompt geluisterd? Leg uit waarom wel of waarom niet.</li> <li>Wat zou je vragen als je nog iets wil laten aanpassen? Vraag dat ook echt en plak het aangepaste antwoord eronder.</li> </ol><p><strong>Extra opdracht - verdieping: AI in het onderwijs.</strong> Deze opdracht is verdieping en telt daarom niet mee als zesde opdracht. Bekijk het filmpje over AI in het onderwijs hierboven en zet onderaan je document het kopje Verdieping - AI in het onderwijs. Schrijf daaronder in een paar zinnen hoe jij vindt dat het onderwijs met AI om moet gaan. Moeten we het toelaten of juist verbieden, en leer je er minder of juist meer van? </p><p><strong>Slotcontrole.</strong> Controleer nu je document: staan alle vijf de opdrachten erin, staat je verdieping eronder, en is alles makkelijk te lezen? Pas de fouten aan die je tegenkomt en lever het document daarna in; je docent vertelt je hoe dat gaat.',
        label: 'Lever Chatbot_JouwVoornaam.docx in. Schrijf hier welke tweede bron je bij opdracht 3 gebruikt hebt met de link, en zet er in één zin je standpunt uit de verdiepingsopdracht achter.',
        modelAnswer: 'Bij opdracht 3 hoort een aanwijsbare tweede bron met link, en de conclusie dat een dolfijn een zoogdier is dat lucht ademt en een haai een vis met kieuwen. Opdracht 4 is voldoende als de acht zinnen aantoonbaar anders geformuleerd zijn dan het chatbotantwoord erboven, met een titel en drie tot vijf dikgedrukte begrippen. Bij opdracht 5 bevat de eigen prompt minstens vier van de zeven tips en de lengte-eis van 300 woorden. De leerling benoemt daarbij één concrete aanpassing die hij daarna heeft laten doorvoeren. Het document telt vijf kopjes in de volgorde 1 tot en met 5, met daaronder het aparte kopje Verdieping - AI in het onderwijs. Onder dat kopje staat een standpunt met minstens één argument, bijvoorbeeld: niet verbieden maar leren gebruiken, want later werkt iedereen ermee en dan moet je weten wanneer een antwoord verzonnen is.',
        nakijkpunten: [
          'De vijf opdrachten staan op volgorde in één document, met de juiste kopjes erboven.',
          'Bij opdracht 3 staat een tweede bron met link, niet alleen jouw eigen mening.',
          'De herschreven tekst bij opdracht 4 is geen kopie van het chatbotantwoord.',
          'Onder het kopje Verdieping staat jouw standpunt over AI op school, met een argument erbij.'
        ]
      },
      ['Wat is hallucinatie?', 'Waarop is een chatbot getraind?', 'Hoe controleer je een antwoord?', 'Welke informatie deel je nooit met een chatbot?', 'Mag je een werkstuk door AI laten schrijven?'],
      'Beoordeel chatbotantwoorden: klopt het, is het verzonnen, of moet je het eerst controleren?',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Een chatbot schrijft: de Rijn is 1320 kilometer lang en stroomt door zeven landen. Waar zit hier het risico?',
            antwoord: 'In de getallen: 1320 en zeven zijn precies het soort details dat een model invult zonder zekerheid.',
            uitleg: 'De zin klinkt kloppend omdat hij vlot en precies is, en juist die precisie is verdacht. Zoek het getal op bij een encyclopedie of een atlas voordat je het overneemt in je werkstuk.',
            leerdoel: DOEL.hallucinatie
          },
          {
            groep: 'zelf',
            vraag: 'Beschrijf in drie stappen hoe je controleert of een chatbotantwoord over dolfijnen en haaien klopt.',
            antwoord: 'Stap 1: haal er de feiten uit. Stap 2: zoek die op bij een bron buiten de chatbot. Stap 3: vergelijk en noteer de link.',
            uitleg: 'Het gaat om onafhankelijkheid: een tweede antwoord van dezelfde bot telt niet. Komen de bronnen niet overeen, dan weet je nog niet wie gelijk heeft, maar wel dat je verder moet zoeken.',
            leerdoel: DOEL.controleren
          },
          {
            groep: 'zelf',
            vraag: 'Noem één ding dat je bij een werkstuk wel met een chatbot mag doen en één ding dat niet mag.',
            antwoord: 'Wel: een moeilijk stuk laten uitleggen. Niet: de bot de tekst laten schrijven die jij inlevert.',
            uitleg: 'De vuistregel is: wie deed het denkwerk? Uitleg vragen, voorbeelden vragen of begrippen laten aanwijzen is hulp; het eindproduct laten maken is het werk uit handen geven.',
            leerdoel: DOEL.schoolwerk
          },
          {
            groep: 'steun',
            vraag: 'Waar of niet waar: als het antwoord er netjes uitziet, klopt het ook.',
            antwoord: 'Niet waar.',
            uitleg: 'Een verzonnen antwoord komt in precies dezelfde nette zinnen binnen als een goed antwoord. Aan de vorm kun je dus niets zien; alleen een tweede bron maakt duidelijk wat waar is.',
            leerdoel: DOEL.hallucinatie
          },
          {
            groep: 'plus',
            vraag: 'Waarom zegt een chatbot zelden "dat weet ik niet", terwijl een mens dat wel doet?',
            antwoord: 'Omdat hij altijd het waarschijnlijkste vervolg kiest en niet kan meten hoe zeker hij ergens over is.',
            uitleg: 'Het model heeft geen ingebouwde twijfelmeter en is bovendien getraind op antwoorden die mensen prettig vinden. Antwoorden waarin het model toegeeft dat het iets niet weet, kregen in die training lagere beoordelingen.',
            leerdoel: DOEL.controleren
          }
        ]
      }),

    checkpoint('7.5', 'Checkpoint: slim en veilig met AI', ['21D', '23A', '23C'], 'AI-dossier met bewijs uit het hele hoofdstuk', 120, 'AI Challenge',
      ['Wat je nu over AI weet',
        'In dit hoofdstuk heb je AI van twee kanten bekeken: hoe het werkt en hoe je er verstandig mee omgaat. Je weet nu dat AI leert van data en patronen zoekt, en dat het daarbij niets begrijpt. Het doet menselijk gedrag alleen maar na, hoe overtuigend een antwoord ook op je overkomt. Dezelfde techniek heeft voordelen en gevaren, en dat is geen toeval maar één en hetzelfde vermogen. De patroonherkenning die een ziekte in een scan vindt, maakt ook deepfakes en gezichten die niet bestaan.</p><p>Bij een chatbot komt de prompt daarbij: hoe scherper jij je opdracht formuleert, hoe bruikbaarder het antwoord. En hoe kritischer jij dat antwoord leest, hoe kleiner de kans dat een verzonnen zin in je werk belandt. Die twee kanten horen bij elkaar, en samen heet dat <strong>AI-geletterdheid</strong>. Steeds meer scholen behandelen die vaardigheid net zo serieus als lezen, en daar is een goede reden voor. AI komt namelijk in bijna elk systeem te zitten dat jij later gaat gebruiken.</p><p><strong>Kritisch</strong> zijn is daarbij geen wantrouwen tegen techniek, maar een gewoonte die je jezelf aanleert. Die gewoonte is kort samen te vatten: eerst controleren, en dan pas geloven.'],
      ['Zo lever je je bewijs in',
        'In deze checkpoint verzamel je <strong>bewijs</strong>, en bewijs is alles waaraan je docent kan zien dat je iets echt gedaan hebt. Denk aan een screenshot, een ingeleverd bestand, of een prompt met het antwoord eronder. Loop daarom de vier paragrafen vóór deze checkpoint langs, dus 7.1 tot en met 7.4, met een controlelijst in je hand. Vink af wat je al hebt liggen, en doe de ontbrekende stappen alsnog voordat je verdergaat. Maak in OneDrive één map met de naam AI-dossier hoofdstuk 7 en zet daar alles in.</p><p>Nieuw ten opzichte van eerdere hoofdstukken is je <strong>promptlogboek</strong>, dat je vanaf nu bijhoudt. Daarin bewaar je van elke prompt de opdracht die je gaf en het antwoord dat je kreeg. Je schrijft er ook bij wat je daarna met dat antwoord gedaan hebt: overgenomen, herschreven of weggegooid. Zo kan iedereen zien waar jouw werk ophoudt en waar de machine begonnen is. Dat is precies wat eerlijk AI-gebruik op school betekent, en het kost je maar drie regels per prompt.</p><p>Deze checkpoint is veel groter dan een gewone paragraaf en past daarom niet in één lesuur. Reken op drie lessen, en volg gewoon de blokken van boven naar beneden. In les 1 doe je de startcheck, lees je deze twee theorieblokken en maak je de vier oefenopgaven daarna. Dat zijn de twee opgaven van samen oefenen en de eerste twee van zelf oefenen. Zoek in die les ook alvast uit welke van je vijf bewijsstukken nog ontbreken. In les 2 maak je de diagnostische ronde van veertien vragen, verderop in datzelfde blok zelf oefenen. Een diagnostische ronde is een oefenronde zonder cijfer die alleen maar zichtbaar maakt welk leerdoel bij jou nog niet zit. Daarna volgt het herstelspoor of het verdiepingsspoor, en daarna lever je bij de praktijkopdracht je AI-dossier in. Sluit les 2 af met de samenvatting die daaronder staat. Les 3 is de hoofdstuktoets, en die maak je in één keer af. Sla na les 1 en na les 2 je werk op en stop daar echt; doorwerken levert bij deze omvang weinig meer op.</p><p>De toets aan het eind maak je zelfstandig, want die moet laten zien wat jij zelf al weet. De Digidocent staat daarbij uit, en je krijgt er maar één poging voor. De toets loopt langs alle leerdoelen van 7.1 tot en met 7.5, en raakt elk doel twee keer.'],
      null,
      [
        {
          vraag: 'Je moet thuis vertellen wat je dit hoofdstuk geleerd hebt. Welke twee dingen vertel je zeker, en waarom juist die twee?',
          antwoord: 'Bijvoorbeeld: AI voorspelt en begrijpt niets, en daarom moet je feiten controleren bij een bron buiten de AI.',
          uitleg: 'Wie moet kiezen, moet ordenen. Wat je als eerste noemt, laat zien wat volgens jou de kern van dit hoofdstuk is.',
          leerdoel: DOEL.werking
        },
        {
          vraag: 'Een chatbot geeft jou acht vlotte zinnen vol jaartallen en namen. Wat doe je als eerste voordat je er iets van overneemt?',
          antwoord: 'Ik streep de jaartallen en de namen aan en zoek er minstens één op bij een bron buiten de chatbot.',
          uitleg: 'Beoordelen begint bij aanwijzen. Zolang je niet weet welk stukje bewijs nodig heeft, controleer je alles of niets.',
          leerdoel: DOEL.beoordelen
        },
        {
          vraag: 'Welk werkstuk uit paragraaf 7.1 tot en met 7.4 heb jij al af, en welk moet je straks nog afmaken?',
          antwoord: 'Uit 7.1 tot en met 7.4 zijn er drie: het AI-logboek, de screenshot met twee kenmerken en het document Chatbot_JouwVoornaam.docx. Het promptlogboek hoort er niet bij, want daarmee begin je pas in deze checkpoint.',
          uitleg: 'Deze startcheck is bedoeld om gaten te vinden voordat je de toets maakt, niet nadat je de uitslag ziet.',
          leerdoel: DOEL.werking
        }
      ],
      {
        tekst: 'Maak in OneDrive de map AI-dossier hoofdstuk 7 en zet daar vijf bewijsstukken in. 1. Je AI-logboek uit paragraaf 7.1, inclusief de robotafbeelding die je in stap 1 zelf hebt opgezocht, en je uitleg erbij. 2. Je screenshot van een AI-gezicht met de twee kenmerken uit paragraaf 7.2. 3. Je document Chatbot_JouwVoornaam.docx met de vijf opdrachten uit paragraaf 7.3 en 7.4. 4. Een promptlogboek: minstens drie prompts met per prompt het antwoord en wat je ermee gedaan hebt. 5. Eén antwoord van een chatbot dat aantoonbaar fout was, met daaronder de tweede bron waarmee je dat bewezen hebt en de link erbij. Schrijf er in een Word-bestand acht regels bij. Beschrijf wat AI voor jou kan doen en waar jij zelf op let. Noem ook welke afspraak jij zou maken over AI-gebruik in jouw klas.',
        label: 'Lever de map AI-dossier hoofdstuk 7 in via ItsLearning en noem hier het foute chatbotantwoord en je tweede bron.',
        modelAnswer: 'Een compleet dossier bevat vijf losse bestanden met herkenbare namen. Het promptlogboek toont per prompt drie regels (prompt, antwoord, wat ik ermee deed) en minstens één keer de keuze om iets niet over te nemen. Het foute chatbotantwoord is voorzien van een link naar een bron buiten de chatbot, met erbij welk woord of getal precies fout was. De acht slotregels noemen een eigen klassenafspraak, bijvoorbeeld: we schrijven altijd onder ons werk welke prompt we gebruikt hebben.',
        nakijkpunten: [
          'Alle vijf de bewijsstukken zitten in de map en zijn van jou zelf.',
          'Je promptlogboek laat zien wat jij met het antwoord gedaan hebt, niet alleen dat je het kreeg.',
          'Het foute antwoord is weerlegd met een aanwijsbare bron buiten de chatbot.'
        ]
      },
      ['Wat is AI en waarvan leert het?', 'Denkt AI zoals een mens?', 'Noem een voordeel en een gevaar.', 'Waaraan herken je een AI-afbeelding?', 'Welke gegevens deel je nooit?', 'Wat is een chatbot en noem er drie.', 'Wat is een prompt en wat hoort erin?', 'Hoe maak je het antwoord netjes op in Word?', 'Wat is hallucinatie?', 'Hoe controleer je een chatbotantwoord?', 'Wat mag je met AI wel voor schoolwerk?', 'Noem drie systemen met AI die je elke dag gebruikt.'],
      'Vijf kamers, elke kamer één bewijsactie uit hoofdstuk 7.',
      false,
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Loop je map na. Welk bewijsstuk hoort bij paragraaf 7.2, en waaraan zie je dat het compleet is?',
            antwoord: 'De screenshot van een AI-gezicht; hij is compleet als er twee kenmerken bij staan die op dat beeld te zien zijn.',
            uitleg: 'Compleet betekent niet dat het bestand bestaat, maar dat iemand anders er iets aan kan aflezen. Twee algemene kenmerken zonder screenshot tellen dus niet mee als bewijs.',
            leerdoel: DOEL.werking
          },
          {
            groep: 'samen',
            vraag: 'Wat heeft het hallucineren van een chatbot uit 7.4 te maken met de zesde vinger op een AI-plaatje uit 7.2?',
            antwoord: 'Allebei ontstaan ze doordat het model kiest wat het waarschijnlijkst is, zonder ergens te controleren of dat ook echt klopt.',
            uitleg: 'Een beeldmodel maakt het beeld dat het beste bij de geleerde patronen past, een taalmodel schrijft het woord dat er waarschijnlijk op volgt. Geen van beide heeft een regel die zegt hoeveel vingers een hand heeft of dat een jaartal gecontroleerd moet worden. Dezelfde werking veroorzaakt dus twee fouten die er heel verschillend uitzien.',
            leerdoel: DOEL.werking
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf drie regels van je promptlogboek uit voor een prompt die je vandaag gebruikt hebt.',
            antwoord: 'Regel 1 de prompt, regel 2 het antwoord in het kort, regel 3 wat je ermee deed: overnemen, herschrijven of weggooien.',
            uitleg: 'De derde regel is de belangrijkste, want daar staat jouw keuze. Een logboek zonder die regel laat alleen zien dat je iets gevraagd hebt, niet dat je erover nagedacht hebt.',
            leerdoel: DOEL.beoordelen
          },
          {
            groep: 'zelf',
            vraag: 'Leg in drie zinnen uit hoe AI werkt, alsof je het aan iemand uit groep 8 vertelt.',
            antwoord: 'AI krijgt heel veel voorbeelden, zoekt daar patronen in en raadt daarmee wat er waarschijnlijk bij past.',
            uitleg: 'Vermijd het woord denken. Wie het in drie zinnen kan uitleggen zonder dat woord, heeft het verschil tussen rekenen en begrijpen echt te pakken.',
            leerdoel: DOEL.werking
          },
          {
            groep: 'steun',
            vraag: 'Vul de vier onderdelen van een prompt in: ..., ..., ... en ... .',
            antwoord: 'Opdracht, onderwerp, doelgroep en lengte.',
            uitleg: 'Onthoud ze als vier vragen: wat moet de bot doen, waarover, voor wie, en hoe lang. Loop dit rijtje af voordat je op enter drukt.',
            leerdoel: DOEL.beoordelen
          },
          {
            groep: 'plus',
            vraag: 'Je docent ziet twee dossiers met hetzelfde chatbotantwoord erin. Bij welke leerling is dat geen probleem?',
            antwoord: 'Bij de leerling die in zijn promptlogboek laat zien wat hij met dat antwoord gedaan heeft.',
            uitleg: 'Hetzelfde antwoord krijgen kan toeval zijn, want twee gelijke prompts geven vaak vergelijkbare tekst. Het verschil zit in wat er daarna gebeurde: overgenomen zonder nadenken, of gecontroleerd en herschreven.',
            leerdoel: DOEL.beoordelen
          },
          {
            groep: 'zelf',
            vraag: 'Hier begint les 2 van deze checkpoint: de diagnostische ronde voor de hoofdstuktoets. Hieronder in dit blok staan veertien korte vragen, een per leerdoel van dit hoofdstuk. Maak ze eerst zelf en streep aan wat je niet wist. Loop na deze ronde eerst je spoor af, lever daarna je AI-dossier in bij de praktijkopdracht, en lees de samenvatting. Stop daar; de hoofdstuktoets is les 3.',
            antwoord: 'Elke gemiste vraag wijst naar een paragraaf. Lees precies die paragraaf terug en maak de oefeningen daar opnieuw, voordat je de toets maakt.',
            uitleg: 'Deze ronde geeft geen cijfer. Oefenen op een deel van de stof neemt de rest niet mee. Wat je niet zelf ophaalt, blijft zwak, ook al ging de rest goed. Daarom komt elk leerdoel hier nog een keer langs.',
            leerdoel: DOEL.werking
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose doel 1 (7.1). Wat is kunstmatige intelligentie? Lukt dat niet vlot, lees dan theorieblok A van 7.1 terug.',
            antwoord: 'Technologie waarmee computers taken uitvoeren die normaal alleen mensen kunnen, zoals leren, plannen en beslissen.',
            uitleg: 'Herhaalmateriaal bij dit doel: 7.1 theorieblok A en de samenoefening over de pinautomaat en de muziek-app.',
            leerdoel: DOEL.ai
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose doel 2 (7.1). Waarvan leert AI, en waarom is dat iets anders dan denken?',
            antwoord: 'AI leert van data en zoekt patronen. Het begrijpt niets: het simuleert menselijk gedrag en doet dat alleen maar na.',
            uitleg: 'Herhaalmateriaal bij dit doel: 7.1 theorieblok B en de steunopgave AI leert van ..., maar het ... niets.',
            leerdoel: DOEL.data
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose doel 3 (7.1). Noem drie systemen met AI die je elke dag gebruikt.',
            antwoord: 'Bijvoorbeeld gezichtsherkenning bij het ontgrendelen, de aanbevelingen in je muziek-app en de woordsuggesties op je toetsenbord.',
            uitleg: 'Herhaalmateriaal bij dit doel: je eigen AI-logboek uit 7.1 en de plusopgave over twee klasgenoten met dezelfde app.',
            leerdoel: DOEL.dagelijks
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose doel 4 (7.2). Noem een voordeel en een gevaar van AI.',
            antwoord: 'Voordeel: sneller een ziekte vinden in een scan. Gevaar: een privacyprobleem, deepfakes of beroepen die verdwijnen.',
            uitleg: 'Herhaalmateriaal bij dit doel: 7.2 theorieblok A en de steunopgave met de drie woorden in de goede kolom.',
            leerdoel: DOEL.voordeelGevaar
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose doel 5 (7.2). Waaraan herken je een AI-afbeelding? Noem twee kenmerken.',
            antwoord: 'Aan details: handen met te veel vingers, rare ogen, tanden, oren, of kleding die vreemd overloopt.',
            uitleg: 'Herhaalmateriaal bij dit doel: 7.2 theorieblok B, je eigen screenshot en de oefening over de zesde vinger.',
            leerdoel: DOEL.beeld
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose doel 6 (7.2). Waarom deel je geen persoonlijke gegevens met AI?',
            antwoord: 'Omdat ze bij een bedrijf terechtkomen en onbedoeld in verkeerde handen kunnen komen; je krijgt ze nooit meer terug.',
            uitleg: 'Herhaalmateriaal bij dit doel: het slot van 7.2 theorieblok B en de oefening waarin de chatbot naar je school vraagt.',
            leerdoel: DOEL.gegevens
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose doel 7 (7.3). Wat is een chatbot, en welke drie ken je bij naam?',
            antwoord: 'Een programma waarmee je via tekst praat. Bijvoorbeeld ChatGPT, Google Gemini en TalkAI.',
            uitleg: 'Herhaalmateriaal bij dit doel: 7.3 theorieblok A en de samenoefening over de bot van de webshop.',
            leerdoel: DOEL.chatbot
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose doel 8 (7.3). Welke vier onderdelen horen in een goede prompt?',
            antwoord: 'De opdracht, het onderwerp, de doelgroep en de lengte. Een rol en een stijl mogen er nog bij.',
            uitleg: 'Herhaalmateriaal bij dit doel: 7.3 theorieblok B en de oefening waarin je vertel wat over gamen verbetert.',
            leerdoel: DOEL.prompt
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose doel 9 (7.3). Hoe zet je een chatbotantwoord netjes in Word?',
            antwoord: 'Plakken zonder opmaak, een kop erboven, een leesbaar lettertype in grootte 11 of 12, en de begrippen dikgedrukt.',
            uitleg: 'Herhaalmateriaal bij dit doel: 7.3 theorieblok B, de oefening over het grijze kader, en paragraaf 4.1 uit hoofdstuk 4.',
            leerdoel: DOEL.word
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose doel 10 (7.4). Wat betekent hallucinatie bij een chatbot?',
            antwoord: 'Dat de chatbot informatie verzint als hij het niet zeker weet, en die opschrijft alsof ze klopt.',
            uitleg: 'Herhaalmateriaal bij dit doel: 7.4 theorieblok A en de samenoefening over de lengte van de Rijn.',
            leerdoel: DOEL.hallucinatie
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose doel 11 (7.4). Hoe controleer je of een chatbotantwoord klopt? Noem de drie stappen.',
            antwoord: 'Haal de feiten eruit, zoek ze op bij een bron buiten de chatbot, en vergelijk; noteer daarna de link.',
            uitleg: 'Herhaalmateriaal bij dit doel: 7.4 theorieblok A en de oefening over dolfijnen en haaien.',
            leerdoel: DOEL.controleren
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose doel 12 (7.4). Wat mag je met een chatbot wel en niet doen voor schoolwerk?',
            antwoord: 'Wel: uitleg vragen of begrippen laten aanwijzen. Niet: de bot de tekst laten schrijven die jij inlevert.',
            uitleg: 'Herhaalmateriaal bij dit doel: 7.4 theorieblok B en de oefening over wie het denkwerk doet.',
            leerdoel: DOEL.schoolwerk
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose doel 13 (7.5). Een leerling schrijft: AI weet alles, want hij heeft het hele internet gelezen en onthoudt wat ik hem vertel. Wijs de drie fouten in die zin aan en verbeter ze.',
            antwoord: 'Fout 1: AI weet niets, het voorspelt. Fout 2: het leest niet het hele internet, maar is getraind op een vaste verzameling tekst. Fout 3: het onthoudt jouw gesprek niet, want leren gebeurt pas in een volgende trainingsronde.',
            uitleg: 'Herhaalmateriaal bij dit doel: theorieblok A van deze checkpoint en het uitgewerkte voorbeeld over AI-geletterdheid.',
            leerdoel: DOEL.werking
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose doel 14 (7.5). Schrijf een prompt en zeg er meteen bij hoe je het antwoord gaat controleren.',
            antwoord: 'Een prompt met opdracht, onderwerp, doelgroep en lengte, plus een tweede bron waarmee je de feiten nakijkt.',
            uitleg: 'Herhaalmateriaal bij dit doel: theorieblok B van deze checkpoint en je eigen promptlogboek uit het AI-dossier.',
            leerdoel: DOEL.beoordelen
          },
          {
            groep: 'steun',
            vraag: 'Herstelspoor. Ging er een diagnosevraag mis? Schrijf op welk doel dat was, lees de genoemde paragraaf terug en lever een nieuw bewijsje in.',
            antwoord: 'Een bewijsje is klein en concreet: drie zinnen uitleg, een verbeterde prompt of een gecontroleerd feit met de link erbij.',
            uitleg: 'Bij elke diagnosevraag staat in de uitleg precies welk herhaalmateriaal erbij hoort. Zo hoef je niet het hele hoofdstuk over te lezen, alleen het stuk dat nog niet zit.',
            leerdoel: DOEL.werking
          },
          {
            groep: 'plus',
            vraag: 'Verdiepingsspoor. Alles goed in de diagnose? Leg in vijf zinnen uit hoe het AI-beeld uit 7.2 en de hallucinatie uit 7.4 dezelfde oorzaak hebben.',
            antwoord: 'Allebei ontstaan ze doordat het model kiest wat het waarschijnlijkst is en nooit nakijkt of dat waar is.',
            uitleg: 'Een beeldmodel kiest het beeld dat het meest op zijn geleerde patronen lijkt, een taalmodel kiest het woord dat er het waarschijnlijkst op volgt. Ze werken van binnen niet hetzelfde, maar ze delen wel dit: geen van beide heeft een lijst waarin het nakijkt of het resultaat echt bestaat. Wie dat verband ziet, snapt ook waarom controleren bij allebei nodig is.',
            leerdoel: DOEL.beoordelen
          }
        ]
      }),

    p('7.6', 'Plus: waar haalt AI zijn antwoorden vandaan?', ['21D', '23C'], 'onderzoekje naar het volgende woord en naar vooringenomenheid', 100, 'Volgend Woord',
      ['Een taalmodel voorspelt het volgende woord',
        'Een chatbot als ChatGPT draait op een <strong>taalmodel</strong>, en dat is iets heel anders dan een zoekmachine. Een zoekmachine zoekt een bestaande pagina op, maar een taalmodel maakt zijn antwoord ter plekke, woord voor woord. De basis daarvan is één simpele opdracht, eindeloos herhaald: voorspel welk woord waarschijnlijk volgt. In de eerste fase, de <strong>voortraining</strong>, leest het model miljarden zinnen uit boeken, artikelen en websites. Daarna volgen twee fases waarin het opdrachten leert opvolgen en mensen beoordelen welke antwoorden prettig overkomen.</p><p>Schooltv legt het zo uit: er gaan heel veel teksten in de computer, en daarna voorspelt hij welke woorden na elkaar komen (schooltv.nl). Op AI voor iedereen van de KU Leuven staat dezelfde uitleg met de drie trainingsfases erbij (aivooriedereen.cs.kuleuven.be).</p><p>In paragraaf 7.1 en 7.4 las je al dat jouw gesprekstekst pas in een volgende trainingsronde meegaat. Hier zie je waarom dat zo is: zo\'n trainingsronde kost weken rekenwerk op duizenden computers tegelijk. Onthoud daarom dit: het model kiest woorden die goed passen, niet woorden waarvan het weet dat ze waar zijn. Waarheid is geen doel van de training, <strong>waarschijnlijkheid</strong> wel, en dat verklaart bijna alles wat er misgaat.'],
      ['Vooringenomenheid, en waarom AI altijd even zeker klinkt',
        'Omdat een taalmodel leert van teksten die mensen geschreven hebben, leert het ook de scheve beelden die daarin zitten. Dat noemen we <strong>vooringenomenheid</strong>, in het Engels bias, en dat gebeurt vaker dan je denkt. Onderzoekers legden taalmodellen sollicitatiebrieven voor die woord voor woord hetzelfde waren, op de naam bovenaan na. Ze kregen verschillende beoordelingen terug: dezelfde kwaliteiten, maar een ander oordeel (aivooriedereen.cs.kuleuven.be). Die vooringenomenheid zat niet in het programma, maar in de <strong>trainingsdata</strong>, en dus in ons eigen taalgebruik. Je ziet het ook kleiner terug als je om plaatjes vraagt van een directeur en een verpleegkundige. Let dan op wie het model afbeeldt, want die keuze maakt het zonder dat jij erom gevraagd hebt.</p><p>Precies daarom is de tweede eigenschap van taalmodellen zo lastig: je trapt er makkelijk in als je snel leest. Het model klinkt namelijk altijd <strong>zelfverzekerd</strong>, want het is getraind op antwoorden die mensen prettig vinden. En een aarzelend antwoord vinden mensen nu eenmaal minder prettig dan een stellig antwoord. De toon van een antwoord zegt dus helemaal niets over de juistheid ervan. Een mens die twijfelt hoor je twijfelen, maar een taalmodel dat het niet weet schrijft gewoon door. Het gebruikt daarbij precies dezelfde rustige zinnen als wanneer het antwoord wel klopt. Wie dat verband begrijpt, snapt ook waarom controleren geen extra stap is maar onderdeel van het gebruik.'],
      [
        media('https://schooltv.nl/video-item/hoe-kan-ai-vragen-beantwoorden-of-teksten-schrijven-ai-is-goed-in-het-voorspellen-van-het-volgende-woord', 'Hoe kan AI vragen beantwoorden of teksten schrijven? - AI is goed in het voorspellen van het volgende woord (Schooltv, opent in een nieuw tabblad)', 'Deze uitleg hoort bij theorieblok A en staat bij Schooltv, dus hij opent buiten HELIX; kom daarna gewoon terug naar deze pagina. Welke woorden uit de video zou jij gebruiken om aan een leerling uit groep 8 uit te leggen dat AI het volgende woord voorspelt? Lukt openen niet, dan staat de kern van de uitleg ook al in theorieblok A hierboven, en speelt de video hieronder wel gewoon in HELIX zelf af.'),
        media('https://www.youtube.com/embed/YwDFFGYf2kw', 'Kun je AI antwoorden vertrouwen? (Het Klokhuis over AI #5, NTR)', 'Deze video hoort bij theorieblok B en speelt hier in HELIX zelf af, dus je hoeft er niets voor te openen. Let op de toon waarop de chatbot in de video antwoord geeft: is aan die toon te horen of hij het zeker weet? Schrijf daarna in twee zinnen op wat je volgens deze video wel en niet uit een zelfverzekerd antwoord mag afleiden.')
      ],
      [
        {
          vraag: 'Waar zou een chatbot al zijn kennis vandaan halen?',
          antwoord: 'Uit miljarden zinnen uit boeken, artikelen en websites, waarop het model vooraf getraind is.',
          uitleg: 'Het model zoekt tijdens jouw vraag niets op; het rekent met wat het in de training geleerd heeft.',
          leerdoel: DOEL.taalmodel
        },
        {
          vraag: 'Kan een computerprogramma vooroordelen hebben, en waar zouden die dan vandaan komen?',
          antwoord: 'Ja. Ze komen uit de trainingsdata, want die teksten zijn door mensen met vooroordelen geschreven.',
          uitleg: 'Niemand programmeert dat erin, dus je haalt het er ook niet met één technische ingreep weer uit.',
          leerdoel: DOEL.bias
        },
        {
          vraag: 'Waarom klinkt een chatbot eigenlijk nooit onzeker, ook niet als hij het fout heeft?',
          antwoord: 'Omdat hij elk antwoord op dezelfde manier vormt en getraind is op reacties die mensen prettig vinden.',
          uitleg: 'De toon is dus geen bewijs. Aan de zinnen kun je niet zien of het model het onderwerp echt kent.',
          leerdoel: DOEL.zeker
        }
      ],
      {
        tekst: 'Onderzoekje in drie delen. Deel 1 - het volgende woord. Typ in je telefoon of in Word de zin: vandaag ga ik na school. Kies daarna tien keer achter elkaar de eerste suggestie die je toetsenbord of Word je geeft, zonder zelf te kiezen. Schrijf de zin op die zo ontstaat en leg in drie zinnen uit wat dit laat zien over hoe een taalmodel werkt. Deel 2 - vooringenomenheid opsporen. Vraag een chatbot om drie korte beschrijvingen: een directeur van een groot bedrijf, een verpleegkundige en een profvoetballer. Noteer per beschrijving welk geslacht, welke leeftijd en welke achtergrond het model kiest zonder dat jij daarom gevraagd hebt. Schrijf op wat je opvalt en leg uit hoe die keuzes in de trainingsdata terecht zijn gekomen. Deel 3 - zelfverzekerd en toch fout. Vraag de chatbot iets waarvan jij het antwoord zeker weet en dat weinig op internet staat, bijvoorbeeld hoeveel lokalen jouw school heeft of wie vorig jaar het schoolvoetbaltoernooi won. Plak het antwoord in je document en schrijf eronder: klopt het, en aan welke woorden kon je NIET zien dat het onzeker was? Sluit af met vijf zinnen over wat jij vanaf nu anders doet als je een chatbot gebruikt. Bronnen die je mag gebruiken: schooltv.nl en aivooriedereen.cs.kuleuven.be.',
        label: 'Lever je onderzoekje in en schrijf hier de zin uit deel 1 op die je toetsenbord voor je bedacht heeft.',
        modelAnswer: 'Deel 1 levert een zin op die grammaticaal loopt maar inhoudelijk nergens over gaat, en de uitleg benoemt dat het toetsenbord het waarschijnlijkste woord kiest zonder bedoeling. In deel 2 noemt de leerling minstens één ongevraagde keuze per beschrijving, bijvoorbeeld een mannelijke directeur en een vrouwelijke verpleegkundige. Die keuzes verbindt hij met de teksten waarop het model getraind is. In deel 3 staat een aanwijsbaar fout antwoord over de eigen school, met de constatering dat er geen enkel twijfelwoord in stond. De slotzinnen noemen een concrete gedragsverandering, bijvoorbeeld altijd getallen nazoeken.',
        nakijkpunten: [
          'Deel 1 bevat de echte gegenereerde zin, niet alleen een beschrijving ervan.',
          'In deel 2 wijs je ongevraagde keuzes aan en leg je de herkomst uit met het woord trainingsdata.',
          'De slotzinnen noemen een concrete gedragsverandering, niet alleen dat AI soms fout is.'
        ]
      },
      ['Waarop is een taalmodel getraind?', 'Wat voorspelt een taalmodel?', 'Wat is vooringenomenheid in AI?', 'Waar komt die vooringenomenheid vandaan?', 'Waarom klinkt AI altijd zeker?'],
      'Raad zelf het volgende woord en neem het op tegen het model; zie hoe vaak jullie hetzelfde kiezen.',
      {
        optioneel: true,
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Waarom kan een taalmodel een boektitel noemen die niet bestaat, terwijl een zoekmachine dat nooit doet?',
            antwoord: 'Omdat het model titels vormt uit waarschijnlijke woorden, terwijl een zoekmachine bestaande pagina\'s opzoekt.',
            uitleg: 'Voor het model is "De geschiedenis van de Rijn, deel 2" gewoon een reeks woorden die vaak zo achter elkaar staan. Er is geen lijst waarin het nakijkt of dat boek echt bestaat.',
            leerdoel: DOEL.taalmodel
          },
          {
            groep: 'zelf',
            vraag: 'Leg uit hoe vooringenomenheid in een taalmodel terechtkomt zonder dat iemand het erin programmeert.',
            antwoord: 'Via de trainingsdata: het model leert patronen uit teksten van mensen, inclusief de scheve beelden daarin.',
            uitleg: 'Staat in duizenden teksten vaker "hij, de directeur" dan "zij, de directeur", dan wordt dat patroon meegeleerd. Het model kopieert dus onze taal, en daarmee ook onze aannames.',
            leerdoel: DOEL.bias
          },
          {
            groep: 'zelf',
            vraag: 'Je krijgt twee antwoorden die allebei even stellig klinken, maar elkaar tegenspreken. Wat zegt de toon je?',
            antwoord: 'Niets. De toon is bij een taalmodel geen teken van zekerheid, dus je moet allebei de antwoorden controleren.',
            uitleg: 'Bij mensen hoor je twijfel in de formulering, en dat gebruik je onbewust als signaal. Dat signaal ontbreekt hier volledig, want elk antwoord komt uit dezelfde rustige woordkeuze rollen.',
            leerdoel: DOEL.zeker
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: een taalmodel voorspelt telkens het volgende ... .',
            antwoord: 'Woord.',
            uitleg: 'Dat is echt de hele truc, alleen dan miljarden keren geoefend. Alles wat een chatbot kan, komt voort uit die ene herhaalde voorspelling.',
            leerdoel: DOEL.taalmodel
          },
          {
            groep: 'plus',
            vraag: 'Zou je vooringenomenheid uit een model kunnen halen door alle problematische teksten weg te laten?',
            antwoord: 'Niet helemaal, want dan verlies je ook taal die het model nodig heeft en kies je zelf wat problematisch is.',
            uitleg: 'Wie beslist welke teksten weg mogen? Die keuze is zelf een standpunt. Bedrijven werken daarom eerder met bijsturen en testen achteraf dan met het schoonvegen van de trainingsdata vooraf.',
            leerdoel: DOEL.bias
          }
        ]
      })
  ]
};
