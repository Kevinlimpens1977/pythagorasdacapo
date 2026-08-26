// Verrijkingslaag hoofdstuk 4 - Werken met Word, Excel en PowerPoint (tl).
//
// Theoretische leerweg: langere theorieblokken mogen, maar elk blok krijgt een
// uitgewerkt voorbeeld ervoor. Er staan meer open vragen in waarin de leerling
// iets uitlegt of vergelijkt, en per paragraaf minstens een vraag die een
// verband legt met een eerdere paragraaf (spreiding).
//
// Per paragraafcode:
//   learningGoals  de drie leerdoelen uit het jaarplan, letterlijk.
//   theorie        exact twee items, in dezelfde volgorde als de twee
//                  theorieblokken in scripts/seed-structuur/tl/h4.mjs.
//     keyTerms     woorden die LETTERLIJK als los woord in die theorietekst
//                  staan; de leesopmaak zet ze vet.
//     exampleHtml  het uitgewerkte voorbeeld: vraag + volledige uitwerking.
//   samenvatting   de laatste leestekst voor de quiz of toets.
//   vragen         de afsluitquiz, of bij 4.7 de hoofdstuktoets.
//
// 4.8 is de vrijwillige plusparagraaf: de hoofdstuktoets (4.7) stelt er geen
// enkele vraag over, zodat wie hem overslaat niets mist dat later getoetst wordt.
//
// ===========================================================================
// HUIDIGE STAND - dit blok is de enige plek met actuele aantallen
// ===========================================================================
// De rondeverslagen hieronder zijn een logboek en worden niet met terugwerkende
// kracht bijgesteld; ze noemen nog 30, 32, 33 en 37 items naast elkaar. Werk bij
// een telbare wijziging ALLEEN dit blok bij. Het structuurbestand heeft een
// gelijknamig blok met dezelfde cijfers.
//
//   Vragen totaal   88 = 50 in de quizzen + 38 in de hoofdstuktoets.
//   Per paragraaf   4.1: 7, 4.2: 7, 4.3: 10 (tussentoets over 4.1 t/m 4.3),
//                   4.4: 6, 4.5: 6, 4.6: 7, 4.7: 38, 4.8: 7.
//   Hoofdstuktoets  38 items tegen de blauwdrukrichtlijn van 15 tot 20. De
//                   verantwoording staat onder "WAT BEWUST BLIJFT ZOALS HET IS"
//                   in het structuurbestand: 20 verplichte leerdoelen plus ruim
//                   tien bronvragen over les 1 t/m 3, die de externe eindtoets
//                   wel stelt en waar dit hoofdstuk geen eigen leerdoel voor
//                   heeft.
//   Langste optie   28 woorden. Drie antwoordopties staan boven de 25; alle
//                   drie zijn koppelrijen met drie of vier definities erin.
//
// ===========================================================================
// RONDE 12 - drie brondefinities die alleen als afleider bestonden
// ===========================================================================
// 1. EEN NIEUW TOETSITEM VOOR BESTURINGSSYSTEEM, UPDATES EN WORD. "Programma
//    dat hardware en software aanstuurt" en "Bijwerken van software en
//    stuurprogramma's" komen uit koppelvraag 3 van bronles 8; "Word is een
//    programma van Microsoft om teksten te schrijven" komt uit invulvraag 35.
//    Alle drie bestonden in de toets alleen als onderdeel van een afleider of
//    van een misconception-tekst; als GOED antwoord stonden ze uitsluitend in
//    het formatieve ophaalblok van 4.7, dat geen cijfer geeft. Hetzelfde
//    patroon dat ronde 5, 6, 8, 10 en 11 al vijf keer voor andere bronvragen
//    repareerden. Bewust een item in plaats van drie: de toets stond al op 37
//    en de drie horen bij elkaar, want ze beantwoorden alle drie de vraag welk
//    stuk software welke taak doet. Toets nu 38 items.
// 2. DE SLEEPVRAAG MET DE VIJF VEILIGHEIDSREGELS KLOPTE NIET. De bron biedt
//    vijf woorden voor vijf lege plekken - linkjes, regelmatig, wachtwoord,
//    persoonlijke informatie, en gevoelige informatie of afbeeldingen - dus
//    elk woord past precies een keer. HELIX gebruikte "wachtwoord" twee keer
//    en liet het vijfde woord vallen, en de optie die de bronmapping wel
//    volgde stond als misvatting in de lijst. Omgedraaid, hier en in
//    ophaalopgave 6 van 4.7 in het structuurbestand. De leerling maakt straks
//    de echte Wikiwijs-toets met precies deze sleepvraag erin.
// 3. TWEE BIJNA IDENTIEKE VRAGEN OVER CREATIVE COMMONS. De tussentoets van 4.3
//    vroeg "In welke volgorde vind je op Google een afbeelding met een Creative
//    Commons-licentie?" en de hoofdstuktoets "Wat is de goede volgorde om op
//    Google een afbeelding met een Creative Commons-licentie te vinden?", met
//    vier grotendeels gelijke opties. Als tweede meetmoment leverde dat niets
//    nieuws op. Het toetsitem is nu een beoordelingssituatie: vier klasgenoten
//    pakken het anders aan en je kiest wie het goed doet. Zelfde leerdoel,
//    ander denkwerk.
// 4. VIJFTIEN ANTWOORDOPTIES BOVEN DE 25 WOORDEN, met uitschieters van 37 en
//    39 in de koppelitems over bureaublad/taakbalk/startmenu/touchpad en over
//    veilig internetten/weerbaarheid/omgangsregel. Vier zulke opties onder
//    elkaar is ruim 130 woorden lezen om een knop te kiezen, zwaarder dan de
//    theorie ervoor. De koppelrijen staan nu in de vorm "Begrip: uitleg." met
//    punten ertussen in plaats van als een lopende zin met komma's. Er zijn er
//    nog drie boven de 25, met 28 als langste. Geen definitie is weggevallen;
//    wat eruit ging (het vastpinnen op de taakbalk) staat nu in de uitleg onder
//    het goede antwoord.
// 5. HET AUTOMATISCHE VOORBLAD. Twee items zeiden dat Word "niet weet hoe jij
//    heet". Op een schoollaptop met een ingelogd Microsoft 365-account is het
//    veld Auteur meestal al gevuld, want dat hangt aan de documenteigenschap
//    Auteur. De antwoordsleutels blijven goed (Cursus wordt nooit ingevuld);
//    de onderbouwing is aangepast. Zie ook punt 3 en 4 van ronde 12 in het
//    structuurbestand.
//
// ===========================================================================
// RONDEGESCHIEDENIS - logboek, niet met terugwerkende kracht bijgewerkt
// ===========================================================================
//
// RONDE 11 - een knopnaam die het hoofdstuk zichzelf liet tegenspreken
// ---------------------------------------------------------------------------
// Het blokkerende punt zat in dit bestand, in de afsluitquiz van 4.6. De
// terugkeervraag over beeldrecht legde onder het GOEDE antwoord uit: "Bij Google
// Afbeeldingen zet je dat filter onder Hulpmiddelen en dan Gebruiksrechten."
// Dat was de enige plek in het hele hoofdstuk waar die knop Hulpmiddelen heette.
// Theorieblok 4.3A zegt drie keer dat Tools in het Nederlands Filter heet, stap 3
// van de opdracht van 4.3 zegt het, stap 5 van 4.5 zegt het, en de diagnostische
// opgave in 4.7 zegt het ook. De Google-hulppagina die 4.3 zelf als mediablok
// aanbiedt (support.google.com/websearch/answer/29508?hl=nl) schrijft eveneens
// Filter. De leerling kreeg dus onder een goed antwoord een knopnaam te lezen die
// zowel het hoofdstuk als de gelinkte bron tegensprak, precies op de stap waar
// leerlingen zonder de juiste naam vastlopen. Punt 4 van ronde 6 schreef deze
// reparatie al op als gedaan; dat ene item was toen niet geraakt. Er staat nu
// "onder Filter (in het Engels Tools) en dan Gebruiksrechten", dezelfde
// formulering als in 4.7. Nul treffers op Hulpmiddelen in de gegenereerde seed.
//
// Daarnaast, uit de verbeterpunten:
//
// 1. VIER BRONVRAGEN UIT LES 8 KREGEN EEN TOETSITEM. De koppelvraag over
//    Outlook, SOMtoday en ItsLearning, "wat betekent digitale geletterdheid",
//    "waarom leer je digitale vaardigheden" en de sleepvraag met de vijf
//    veiligheidsregels leefden alleen in het formatieve ophaalblok van 4.7. Dat
//    blok geeft geen cijfer, dus ze werden nergens gemeten terwijl de externe
//    eindtoets ze wel stelt. Dit is hetzelfde patroon dat ronde 5, 6, 8 en 10
//    vier keer eerder repareerden; dit waren de laatste vier. Ze staan nu bij
//    elkaar achter de andere items van het brede toetsleerdoel. De toets gaat
//    daarmee van 33 naar 37 items (per ronde 12 zijn het er 38); de
//    verantwoording onder punt 4 van ronde 3
//    hierboven geldt onveranderd, en het alternatief - vier bronvragen die de
//    externe toets wel stelt en HELIX niet meet - weegt zwaarder dan vier korte
//    meerkeuze-items extra. De sleepvraag is een meerkeuzevraag geworden, omdat
//    de generator geen sleepitems kent; de vijf regels staan in de bronvolgorde.
//    Alle vier de goede antwoorden staan op een andere plek (2, 3, 1 en 4) en
//    geen ervan is de langste optie; de validator bevestigt dat met 0
//    bevindingen op "goed antwoord te raden op lengte".
// RONDE 6 - een telfout eruit, de samenvattingen op niveau
// ---------------------------------------------------------
//   1. TELFOUT IN 4.2. De afsluitquiz vroeg "welke van deze DRIE handelingen doe
//      je NIET via het tabblad Invoegen" en zette er VIER opties onder. De
//      leerling las een telling die niet klopte met wat hij zag. Het is nu
//      "deze vier". Alle prompts van dit hoofdstuk met een telwoord erin zijn
//      daarna machinaal tegen hun optieaantal gelegd: nul mismatches.
//   2. STOF UIT 4.3 IN EEN HERHALINGSVRAAG OVER 4.1. Diezelfde vraag had als
//      vierde optie "een afbeelding uit een bestand in je verslag zetten",
//      terwijl de leerling 4.3 nog niet gehad heeft; de feedback erkende dat
//      zelfs. De optie is vervangen door een lege pagina toevoegen, en dat is
//      stof uit 4.1 (Ctrl + Enter). De feedback verwijst niet meer vooruit.
//   3. DE SAMENVATTINGEN STONDEN STRUCTUREEL BOVEN DE BAND. Gemeten over alle 8
//      samenvattingen: 24 zinnen, gemiddeld 25,1 woorden, 21 van de 24 boven de
//      20 en 12 boven de 25, langste 32, tegen een band van 15 tot 20. Het is
//      het laatste dat een leerling leest voor hij de quiz in gaat, en het was
//      het enige bloktype dat de band overal overschreed. Alle acht zijn
//      herschreven zonder ook maar een feit te laten vallen: 53 zinnen,
//      gemiddeld 14,4 woorden, GEEN enkele zin boven de 20, langste 18. De
//      hoeveelheid inhoud is gelijk gebleven; de zinnen zijn opgeknipt.
//   4. UITGEWERKTE VOORBEELDEN. 15 zinnen stonden boven de 20 woorden en drie
//      boven de 25, met een uitschieter van 28. De vier langste zijn opgeknipt;
//      er staat nu niets meer boven de 25. Het voorbeeld bij 4.2A was met 19
//      zinnen en 247 woorden twee keer zo lang als alle andere en las als een
//      tweede theorieblok. Het Ctrl+Spatie-verhaal blijft er inhoudelijk
//      helemaal in, maar het staat er nu in 17 zinnen en 213 woorden.
//   5. HARDWARE EN SOFTWARE. De kop van ronde 3 beweerde hieronder dat de
//      bronvraag "wat is het verschil tussen hardware en software" een eigen
//      item was geworden. Dat was niet zo: hij bestond alleen als FOUTE optie in
//      toetsvraag 27 en als feedbackzin, dus de leerling zag het goede antwoord
//      nooit als goed antwoord. Precies de fout die ronde 5 zelf in een LET
//      OP-blok van ronde 3 aanwees, nog een keer. Hij staat nu wel echt in
//      HELIX, samen met drie andere bronvragen die hetzelfde probleem hadden,
//      als vraag EN antwoord in het ophaalblok van 4.7 in het structuurbestand.
//      De zin hieronder die het beloofde blijft staan, als waarschuwing.
//   6. VAKTAAL IN DE LEERLINGTEKST. "Deeltoetsvraag over 4.1" en "deze
//      presentatie is je terugkeermoment" zijn woorden uit de blauwdruk. Er
//      staat nu "vraag uit de tussentoets" en een gewone zin.
//
// De afsluitquizzen tellen 6 of 7 vragen tegen de startwaarde 5 van de
// blauwdruk. Dat is een bewuste keuze en hier de verantwoording: elke paragraaf
// heeft drie leerdoelen, en de blauwdruk vraagt naast een vraag per leerdoel ook
// een terugkeervraag naar een eerdere paragraaf. Drie doelen plus spreiding
// plus een verdiepingsvraag komt op 5 uit; waar een leerdoel twee handelingen
// bevat (opmaken EN paginanummers, dia's EN tekstvakken) staat er een zesde of
// zevende bij, zodat geen halve vaardigheid ongemeten blijft.
//
// RONDE 2 - de hoofdstuktoets 4.7 is herbouwd
// -------------------------------------------
// De vorige versie telde 10 vragen en liet 12 van de 20 verplichte leerdoelen
// van 4.1 t/m 4.7 volledig onbevraagd. Dat was de enige plek waar HELIX armer
// was dan de bron: de eindtoets van les 8 heeft 38 vragen over vier gebieden.
// Nu staan er 43 vragen in, met deze verdeling:
//
//   * alle 20 verplichte leerdoelen worden minstens een keer bevraagd;
//   * de kernleerdoelen (voorblad, opslaan, opmaak, presentatieopbouw en het
//     brede toetsleerdoel) komen twee keer of vaker aan bod;
//   * ongeveer 47 procent gaat over je device, veilig internet, je account en
//     digitale geletterdheid, tegen 20 procent in de vorige versie. Volledige
//     pariteit met de bron (daar is dat ruwweg twee derde) kan niet: de toets
//     moet ook alle 18 Office-leerdoelen van dit hoofdstuk dekken, en de stof
//     van les 1 t/m 3 heeft in HELIX daarnaast eigen checkpoints in h1, h2 en h3.
//
// Bronvragen die er in ronde 1 niet in stonden en nu wel: voorblad via Invoegen
// (stond twee keer in de bron), de volgorde van het maken van een presentatie
// (ook twee keer), sterk wachtwoord, digitale weerbaarheid, identiteitsfraude,
// welke Office-toepassing voor presentaties, Outlook/SOMtoday/ItsLearning,
// waarom OneDrive handig is, touchpad/besturingssysteem/startmenu/updates,
// bureaublad/taakbalk/start, instellingen aanpassen plus rare downloads plus
// updatefrequentie plus de oplader, processor/werkgeheugen/Word, de rijbewijsfoto,
// de WhatsApp-noodoproep, teksten van internet overnemen, alles geloven op
// internet, twee-staps-verificatie, veilig internetten, omgangsregel, digitale
// geletterdheid, waarom je digitale vaardigheden leert, de vijf veiligheidsregels,
// de koppeling cybercrimineel/phishing/twee-staps-verificatie/identiteitsfraude,
// de sneltoetsenkoppeling CTRL+S/B/i/U, de CTRL+S- en OneDrive-stellingen,
// de titeldia en de koppeling dia/tekstvak/overgang.
//
// Twee bronvragen zijn NIET over te nemen omdat HELIX het vraagtype niet kent:
// de twee klikvragen op een afbeelding (waar zie je aan deze ING-mail dat het
// phishing is, en waar kies je de opslaglocatie). Hun inhoud zit wel in de
// toets, maar als meerkeuzevraag in plaats van als klik op een plaatje.
//
// RONDE 3 - de toets afgeslankt, drie bronvragen teruggehaald
// -----------------------------------------------------------
// De hoofdstuktoets van 4.7 telde 43 items in een poging die de leerling maar
// een keer krijgt, en dat naast de externe Wikiwijs-toets van 25 vragen waar
// dezelfde paragraaf naar linkt. Dat waren feitelijk twee eindtoetsen achter
// elkaar. Bovendien hingen 19 van die 43 items aan het ene brede leerdoel, dus
// op dat doel mat de toetsmatrijs niets onderscheidends.
//
// De toets telde toen 30 items (per ronde 12 zijn het er 38):
//   * elk van de 18 verplichte leerdoelen van 4.1 t/m 4.6 wordt precies een
//     keer bevraagd, plus het doel over het delen van je bewijs uit 4.7;
//   * 9 items (30 procent, was 44) hangen aan het brede leerdoel, en die negen
//     dekken samen alle vier de gebieden van de bron. Ze zijn bovendien
//     gespreid over denkniveau (herkennen, begrijpen, toepassen, uitleggen) en
//     over niveau (basis, plus), zodat de matrijs er structuur in ziet;
//   * 6 van de 30 items zijn open (20 procent, was 9). Dat past bij het
//     zwaartepunt van deze leerweg: zelf uitleggen en vergelijken.
// De tweede keer dat elk leerdoel geraakt wordt is het oefenblok van 4.7: dat
// is de diagnostische toets van de blauwdruk en raakt alle 20 doelen, met per
// opgave een herstelroute. Samen komt elk doel dus op twee metingen uit, zoals
// de blauwdruk voor een hoofdstuktoets vraagt.
//
// Wat er UIT de toets ging, is niet uit het hoofdstuk verdwenen. Die stof staat
// nu in de startcheck van 4.7 (zeven items, samen de vier gebieden van bronles
// 8: de systemen, het scherm en het systeem van je device, en veilig internet
// in twee delen) en in de voorkennischeck van 4.1.
//
// Drie bronvragen bestonden alleen nog als feedbackzin of als foute optie en
// zijn nu eigen items:
//   * de belangrijkste reden voor een sterk wachtwoord (stond onder de vraag
//     over sterke wachtwoorden);
//     LET OP - DEZE REGEL KLOPTE NIET. Ronde 3 beweerde dit wel, maar het is
//     toen niet gebeurd: de bronvraag bleef tot en met ronde 4 een feedbackzin
//     onder de vraag over sterke wachtwoorden. Pas in ronde 5 is hij een eigen
//     item geworden, met de drie afleiders van de bron. De regel blijft hier
//     staan omdat een bestandskop die iets belooft wat er niet is, precies de
//     fout is die niemand meer moet kunnen herhalen.
//   * waarom je nadenkt voordat je iets online deelt (stond onder de
//     rijbewijsvraag) - nu een open vraag met eigen voorbeeld;
//   * de sleepvraag videokaart / processor / geluidskaart (bestond alleen als
//     foute optie, dus de goede koppeling zag de leerling nooit als goed
//     antwoord) - nu een eigen item waarin de goede koppeling het juiste
//     antwoord is, samen met hardware/software en processor/werkgeheugen.
// Daar kwamen twee items bij die de bron wel had en HELIX niet:
//   * de phishing-controlevraag: iedereen kan slachtoffer worden, instanties
//     als banken en de overheid vragen nooit per mail om wachtwoorden of
//     pincodes, je vergelijkt de afzender met het e-mailadres op de website van
//     het bedrijf, en je kunt het bedrijf zelf bellen;
//   * een meerkeuzevariant op de klikvraag over de ING-mail: waaraan zie je in
//     een concrete mail dat het phishing is.
//
// Verder in ronde 3:
//   * het uitgewerkte voorbeeld van 4.4 klopte niet. Het beweerde dat
//     =GEMIDDELDE over cellen met "8500 stappen" 0 geeft. Excel geeft daar
//     #DEEL/0!; alleen =SOM geeft 0. Het voorbeeld laat nu beide uitkomsten
//     zien en gebruikt het verschil ertussen als de eigenlijke les.
//   * de afsluitquiz van 4.3 is de DEELTOETS van het hoofdstukmodel geworden:
//     tien vragen over 4.1, 4.2 en 4.3 samen, waarin elk van die negen
//     leerdoelen minstens een keer aan bod komt. De opdracht van 4.3 kondigt
//     hem aan en de eerste startvraag van 4.4 leest de uitslag en stuurt door.
//   * 4.1 heeft er een item bij over de locatiekiezer in het opslaanscherm.
//     Dat was de laatste bronklikvraag zonder opvolger.
//   * de samenvatting van 4.8 noemt sorteren nu met een kleine letter, zodat de
//     vetzetting van dat kernbegrip niet misgaat.
//   * alle meerkeuzevragen van dit hoofdstuk zijn nagelopen op de lengte van de
//     afleiders. Een afleider die maar een stomp was verwoordt nu de hele
//     denkfout, en de redengevende bijzin van het goede antwoord staat in
//     explanation. Blind de langste knop klikken levert over hoofdstuk 4 nog 20
//     van de 48 goed (42 procent).

// RONDE 4 - negen afleiders die het antwoord op lengte weggaven
// -------------------------------------------------------------
// Ronde 3 keek naar de verhouding tussen het goede antwoord en de langste
// afleider (de grens van 1,5x die de validator bewaakt) en kwam daarmee op 42
// procent. Die maat mist echter de vragen waarin het goede antwoord maar net
// het langst is: een leerling die blind de langste knop klikt, heeft daar
// evengoed goed. Per blok gemeten stonden 4.2 en 4.6 daardoor op 67 procent,
// boven de blokgrens van 60, en 4.7 op 50 procent.
//
// Negen afleiders zijn daarom verlengd tot de volle denkfout in plaats van een
// stomp: 4.1 vraag 4 (de drie sneltoetsen), 4.2 vraag 1 en 4, 4.6 vraag 3 en 6,
// en 4.7 vraag 13, 15, 24 en 28. Geen enkel goed antwoord is ingekort, want de
// uitleg hoort er juist in te staan. Hoofdstuk 4 zakte daarmee van 22 op 50
// naar 13 op 50 meerkeuzevragen waarin de langste knop de goede is (26 procent,
// was 44), en elk blok zit nu onder de 45 procent:
//
//   4.1 20%   4.2 0%   4.3 43%   4.4 33%   4.5 0%   4.6 0%   4.7 33%   4.8 0%
//
// Verder gecontroleerd en in orde bevonden: elk verplicht leerdoel heeft een
// startvraag, een oefening, een afsluitvraag en een toetsitem. 4.8 heeft
// terecht geen enkel toetsitem, want een hoofdstuktoets bevraagt een vrijwillige
// plusparagraaf nooit.

// RONDE 5 - een fout uitgewerkt voorbeeld, drie bronvragen en een matrijsfout
// ---------------------------------------------------------------------------
// 1. HET UITGEWERKTE VOORBEELD VAN 4.2A KLOPTE NIET. Het eindigde met: "Yara
//    selecteert haar titels alsnog en klikt op Start en dan op Kop 1 in het
//    vakje Stijlen; haar eigen opmaak verdwijnt daarbij, en dat is precies de
//    bedoeling." Dat is in Word niet waar. Directe opmaak - handmatig vet,
//    lettergrootte 20, donkerblauw - blijft juist over de alineastijl heen
//    staan. De leerling die dit natypt in het document dat hij in 4.1 gemaakt
//    heeft, ziet zijn opmaak NIET verdwijnen en concludeert dat het stijllabel
//    niet gewerkt heeft, terwijl het label er wel degelijk op zit. Het voorbeeld
//    legt nu precies dat uit: het label werkt, wat Yara zelf zette blijft, en
//    met Ctrl + Spatie wis je alleen je eigen opmaak zonder het label kwijt te
//    raken. De knop Alle opmaak wissen haalt ook het label weg en hoort dus
//    vóór het toekennen van de stijl, niet erna. 4.2 heeft er in het
//    structuurbestand een oefenopgave bij gekregen die deze stap laat oefenen.
//
// 2. DRIE BRONVRAGEN BESTONDEN ALLEEN ALS TOELICHTING. Bronles 8 vraag 1 (de
//    belangrijkste reden voor een veilig wachtwoord, met de afleiders snel
//    inloggen, makkelijk onthouden en delen met anderen), vraag 16 (de laptop
//    niet altijd in de oplader) en vraag 31 (kun je alles geloven wat op
//    internet staat) waren feedbackzin of uitklapuitleg. Alle drie zijn nu een
//    eigen toetsitem met een fout alternatief. Daarnaast eist bronles 7
//    letterlijk dat de eindpresentatie "Plaatjes en een video" bevat en
//    "Overgangen hebben tussen alle dia's"; dat stond in geen nakijkpunt en in
//    geen toetsitem. Er is nu een toetsitem over de volledige eisenlijst, en het
//    structuurbestand heeft er nakijkpunten voor.
//
// 3. LEERDOELKOPPELING IN 4.1 VRAAG 4. Die vraag luidde "Welke combinatie hoort
//    bij elkaar?" met als goed antwoord "CTRL + S slaat je document tussentijds
//    op", terwijl het item aan het opmaakdoel hing. Wie alleen wist dat de S van
//    save komt had hem goed zonder iets over vet, cursief of onderstrepen te
//    weten. Het item is vervangen door een toepassing waarin je alle drie de
//    opmaaktoetsen nodig hebt. De bronkoppelvraag met alle vier de sneltoetsen
//    staat ongewijzigd in de hoofdstuktoets.
//
// 4. DE HOOFDSTUKTOETS. Hij telde toen 32 items in plaats van 30. Elk van de 20
//    verplichte leerdoelen wordt geraakt; 4.1 doel 3, 4.5 doel 1 en 4.6 doel 1
//    krijgen er twee, en 10 items hangen aan het brede toetsleerdoel (31
//    procent, was 30). De tweede meting per leerdoel komt uit het oefenblok van
//    4.7, en dat blok koppelt nu wél: het bestaat uit twintig doelopgaven met
//    elk precies één leerdoelveld, plus vier ophaalopgaven over les 1 tot en met
//    3. In ronde 4 tikten veertien opgaven twintig doelen af met veertien
//    leerdoelvelden, en daardoor bleef er in de toetsmatrijs voor de helft van
//    de doelen een uitspraak op basis van één item staan. Dat is weg.
//
//    Waarom de toets niet naar de 15 tot 20 van de blauwdruk kan: de 20
//    verplichte leerdoelen vragen al 20 items, en bronles 8 levert daarbovenop
//    ruim tien vragen over les 1 tot en met 3 die nergens anders in dit
//    hoofdstuk thuishoren. Kleiner maken betekent bronverlies. De blauwdruk
//    noemt dat getal zelf een ontwerpkeuze met een meetplan, en PATROON.md zegt
//    dat de dekking dan wint. De belasting is daarom in de TIJD opgelost en niet
//    in het aantal: 4.7 is nu expliciet drie momenten over twee lesuren plus een
//    terugkeermoment een week later. Zie de kop van het structuurbestand.
//
// RONDE 8 - SUBTOTAAL erin, en twee vragen die iets anders maten dan ze zeiden
// ----------------------------------------------------------------------------
// De criticus keurde ronde 7 af op drie feitelijke fouten. Twee daarvan zaten
// in het structuurbestand; wat dit bestand ervoor moest leveren staat hier.
//
// 1. HET UITGEWERKTE VOORBEELD DAT 4.8 MISTE. De praktijkopdracht van 4.8 liet
//    de leerling met =SOM en =GEMIDDELDE een gefilterde en een ongefilterde
//    tabel vergelijken. Die functies negeren een filter niet, dus hij zag twee
//    keer hetzelfde getal terwijl het modelantwoord een verschil van 114
//    minuten beloofde. SUBTOTAAL kwam in het hele hoofdstuk niet voor. Dit
//    bestand levert er nu drie dingen voor:
//      - theorieblok 4.8B (dat sinds deze ronde ook over SUBTOTAAL gaat) heeft
//        een tweede uitgewerkt voorbeeld gekregen: Ties leest 154 waar hij 268
//        verwacht en denkt dat zijn filter kapot is. Dat voorbeeld staat VOOR
//        het voorbeeld over grafiektypes, in dezelfde volgorde als de theorie;
//      - de keyTerms van blok 2 zijn SUBTOTAAL, staafdiagram, lijndiagram en
//        cirkeldiagram (grafiektype is eruit; er mogen er maximaal vier zijn en
//        alle vier staan letterlijk in dat blok);
//      - de afsluitquiz van 4.8 heeft er een meerkeuze-item over, met als drie
//        afleiders de manieren waarop leerlingen hier echt de mist in gaan:
//        denken dat een filter het bereik van een formule verandert, denken dat
//        Excel je bedoeling raadt, en delen door het aantal zichtbare rijen
//        terwijl de teller nog over alles gaat. Het goede antwoord is de
//        KORTSTE optie, dus hij is niet op lengte te raden.
//    De keyTerms van blok 1 blijven sorteren, filteren en CTRL + F: SUBTOTAAL
//    staat sinds deze ronde niet meer in dat blok en mag daar dus ook niet als
//    kernbegrip staan.
//
// 2. HET UITGEWERKTE VOORBEELD VAN 4.2A GENERALISEERDE TE VER. Het klopte zelf
//    wel (Yara had vet, lettergrootte 20 EN donkerblauw zelf gezet), maar de
//    zelf-oefenopgave in het structuurbestand trok er de conclusie "het
//    uiterlijk verandert niet" uit voor een geval met maar twee handmatige
//    eigenschappen. Daar veranderen lettertype en kleur wél. Het voorbeeld zegt
//    nu expliciet dat wat Yara niet zelf zette - haar lettertype - door Kop 1
//    juist wel wordt overgenomen. Zie punt 3 in de kop van het structuurbestand.
//
// 3. DE TERUGKEERVRAAG VAN 4.6 MAT NIET WAT ZIJN LEERDOEL ZEI. Die open vraag
//    is de enige terugkeervraag van 4.6 en draagt dus een leerdoel uit een
//    eerdere paragraaf: "Je kunt een automatisch voorblad invoegen en invullen."
//    De vraag ging echter over het terugbrengen van stof tot steekwoorden en
//    raakte het voorblad alleen zijdelings in het modelantwoord. In de
//    toetsmatrijs telde dat als een meting op een doel dat niet bevraagd werd.
//    De vraag vergelijkt nu het automatische voorblad uit 4.1 met de titeldia
//    van 4.6: welke velden komen terug, welk veld laat je weg, en waarom mag een
//    titeldia korter zijn. Daarmee meten vraag en leerdoel weer hetzelfde, en de
//    verdiepingsvraag die 4.1 aan 4.6 knoopt blijft bestaan. De stof over
//    steekwoorden verdwijnt niet: twee andere items van 4.6 hangen aan het doel
//    "Je kunt je tekst kort en goed leesbaar houden", en het meerkeuze-item
//    erachter vraagt nog steeds uit welk hoofdstuk elk onderwerp zijn inhoud
//    haalt.
//
// 4. TWEE NAMEN VOOR HET OPSLAANSCHERM, NU IN DE GOEDE VOLGORDE. De quizvraag
//    van 4.1 noemde eerst "Opslaan als" en daarna "Een kopie opslaan". De
//    huidige Word toont alleen die tweede naam, dus die staat nu voorop.
//
//
// RONDE 9 - het uitgewerkte voorbeeld van Ties zegt er nu bij wat 154 NIET is
// ---------------------------------------------------------------------------
// Het blokkerende punt van deze ronde zat in het structuurbestand: het
// modelantwoord van 4.8 noemde het verschil tussen 268 en 154 "het verschil
// tussen weekend en doordeweeks", terwijl 154 het gemiddelde over ALLE
// eenentwintig dagen is. Zie de kop van scripts/seed-structuur/tl/h4.mjs,
// ronde 9 punt 1, voor de rekensom.
//
// Dit bestand had het goed staan ("268 in het weekend tegen 154 over alle
// dagen"), en juist daarom is het hier bijgewerkt: het voorbeeld van Ties is de
// plek waar die twee getallen voor het eerst naast elkaar komen. Wie daar leert
// hoe hij ze noemt, maakt de fout twee schermen verder niet meer. Het antwoord
// zegt nu expliciet dat Ties' zes weekenddagen zelf ook in die 154 zitten en
// dat hem omhoog trekken, dat doordeweeks dus nog lager ligt, en dat hij een
// tweede keer moet filteren als hij dát wil weten.
//
// De vragenlijst van 4.8 is bewust NIET uitgebreid. De misvatting staat nu op
// vier plekken (dit voorbeeld, het modelantwoord, de plus-oefenopgave en
// nakijkpunt 4 van de opdracht), en 4.8 is een vrijwillige plusparagraaf: de
// hoofdstuktoets mag er geen vraag over stellen, dus een negende item zou
// alleen de afsluitquiz verzwaren zonder ergens mee te tellen.
//
//
// RONDE 10 - de inhoudsopgave heeft jouw paginanummers NIET nodig
// ---------------------------------------------------------------------------
// Het blokkerende punt zat in het structuurbestand (4.1B beweerde dat de
// automatische inhoudsopgave draait op de nummers die je via Invoegen in je
// voettekst zet). Een TOC-veld haalt zijn paginanummers uit de paginering van
// het document zelf, dus die claim is onwaar en botste bovendien met 4.2B en
// met een afleider in de hoofdstuktoets hieronder. Wat dit bestand ervoor
// moest leveren:
//
// 1. DE MISCONCEPTION DIE DE FOUT BEVESTIGDE. Bij de afleider "de schrijver
//    hoeft geen paginanummers meer in te voegen omdat de koppen dat werk
//    overnemen" stond als misvatting "terwijl de inhoudsopgave die nummers
//    juist nodig heeft". Dat is precies de onwaarheid. Er staat nu dat koppen
//    en paginanummers los van elkaar hun werk doen.
// 2. TWEE ZACHTERE PLEKKEN met dezelfde afhankelijkheidssuggestie: het
//    modelantwoord over waarom paginanummers pas bij een lang verslag nuttig
//    worden ("later gebruikt de inhoudsopgave die nummers"), en het
//    modelantwoord van de vergelijkvraag 4.1 tegenover 4.2 ("de nummers uit 4.1
//    krijgen pas nu hun functie"). Allebei herschreven naar wat er echt gebeurt:
//    de inhoudsopgave telt zelf, en jouw voettekstnummers noemen dezelfde
//    bladzijde omdat Word maar op één manier telt. Het nakijkpunt en de feedback
//    eronder zijn meegegaan.
//
// Daarnaast, uit de verbeterpunten en de blauwdrukgaten:
//
// 3. BUREAUBLAD, TAAKBALK, STARTMENU EN TOUCHPAD (koppelvraag bronles 8) leefden
//    alleen nog in het formatieve oefenblok van 4.7 en werden dus nergens echt
//    gemeten, terwijl videokaart, geluidskaart, processor en werkgeheugen die
//    stap wel hadden gemaakt. Er staat nu een koppelitem over de vier in de
//    hoofdstuktoets, direct achter dat hardware-item. Daarmee gaat de toets van
//    32 naar 33 items; de verantwoording onder punt 4 van ronde 3 hierboven
//    geldt onverkort, dit is dekking die de bron vroeg.
// 4. TWEEDE TERUGKEERVRAAG VOOR 4.2 EN 4.6. De blauwdruk wil er twee per
//    afsluitquiz. Beide paragrafen hadden er één die ook echt aan een leerdoel
//    van een eerdere paragraaf hing. 4.2 heeft er nu een over de plek van de
//    inhoudsopgave ten opzichte van het voorblad uit 4.1; 4.6 een over het
//    beeldrecht uit 4.3, op het moment dat de bron (les 7) zegt dat je je
//    verhaal met plaatjes van internet ondersteunt.

export default {
  // 4.1 Word: je eerste document met voorblad, opmaak en paginanummers
  '4.1': {
    learningGoals: [
      'Je kunt een Word-document maken, een duidelijke naam geven en op de juiste plek opslaan.',
      'Je kunt een automatisch voorblad invoegen en invullen.',
      'Je kunt tekst dikgedrukt, schuin of onderstreept maken en paginanummers toevoegen.'
    ],
    theorie: [
      {
        keyTerms: ['werkbalk', 'floppy disc', 'locatie', 'CTRL+S'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Noor slaat haar verslag op als Document1 op het bureaublad van een computer in lokaal 12. Thuis wil ze verder werken en ze vindt het bestand nergens. Wat is er precies misgegaan?</p>',
          '<p><strong>Antwoord.</strong> Er zijn twee fouten gemaakt, en ze hebben verschillende gevolgen. De naam Document1 zegt niets, dus zelfs op die ene computer moet ze gaan zoeken. Ernstiger is de plek: het bureaublad hoort bij dat ene apparaat en niet bij haar account. Had ze het bestand Verslag_Oefening_Noor_1B genoemd en in OneDrive opgeslagen, dan had ze het thuis met dezelfde inlog gewoon geopend.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['voorblad', 'opmaak', 'Paginanummer'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sam wil een titelpagina en typt zijn titel daarom zelf in een heel groot lettertype midden op de eerste pagina. Hij zegt: dat ziet er hetzelfde uit als een automatisch voorblad. Klopt dat?</p>',
          '<p><strong>Antwoord.</strong> Het lijkt erop, maar het werkt anders. Bij het automatische voorblad zitten Titel, Subtitel, Auteur, Datum en Cursus al als velden in de pagina. De opmaak blijft netjes terwijl hij ze invult. Bij Sam schuift alles door elkaar zodra hij een regel toevoegt, en hij vergeet bovendien de datum en zijn klas. Hij haalt zijn eigen pagina weg en gaat via Invoegen en Voorblad opnieuw beginnen.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een Word-document begint met twee bewuste keuzes, en die maak je voordat je ook maar iets typt. De eerste is een bestandsnaam waaraan je het bestand later terugkent, zoals Verslag_Oefening_Voornaam_klas. De tweede is een plek waar je er morgen ook bij kunt, en dat is meestal OneDrive. Het automatische voorblad haal je op via Invoegen, waar de knop Voorblad helemaal links staat. Je vult daar zelf de velden Titel, Subtitel, Auteur, Datum en Cursus in. Met CTRL + B, CTRL + i en CTRL + U maak je tekst dik, schuin of onderstreept. Paginanummers zet je er via Invoegen onder, zodat je lezer ziet waar hij aan het lezen is.</p>',
      keyTerms: ['bestandsnaam', 'CTRL + B', 'paginanummers']
    },
    vragen: [
      {
        prompt: 'Waarom maakt het uit waar je je Word-document opslaat?',
        type: 'meerkeuze',
        options: [
          { text: 'Word werkt sneller als een bestand in OneDrive staat.', correct: false, misconception: 'Denken dat de opslagplek iets met de snelheid van het programma te maken heeft.' },
          { text: 'Alleen wat in OneDrive staat, open je op elke computer waarop jij inlogt.', correct: true, explanation: 'OneDrive hoort bij je account en niet bij een apparaat, dus het bestand reist met je mee.' },
          { text: 'Het bureaublad is vol, dus daar past niets meer bij.', correct: false, misconception: 'De opslagplek verwarren met een ruimtegebrek in plaats van met bereikbaarheid.' },
          { text: 'Op het bureaublad kun je geen paginanummers en geen voorblad toevoegen aan je document.', correct: false, misconception: 'Denken dat de opslagplek bepaalt welke functies van Word werken.' }
        ],
        feedback: 'De plek bepaalt de bereikbaarheid, niet de snelheid. Het bureaublad hoort bij een apparaat, OneDrive bij jouw account.',
        leerdoel: 'Je kunt een Word-document maken, een duidelijke naam geven en op de juiste plek opslaan.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Je klikt in Word op Bestand en dan op Opslaan als, dat bij een al opgeslagen bestand Een kopie opslaan heet. Waar in dat scherm wijs je aan waar je bestand terechtkomt?',
        type: 'meerkeuze',
        options: [
          { text: 'In het vak bovenin waar je de bestandsnaam typt; die naam bepaalt ook in welke map het bestand terechtkomt.', correct: false, misconception: 'Denken dat de naam van een bestand ook zijn plek vastlegt, omdat je allebei in hetzelfde scherm invult.' },
          { text: 'In de lijst met plekken ernaast, waar OneDrive en Bladeren staan.', correct: true, explanation: 'Via Bladeren kies je je bureaublad of een eigen map. Het opslaanscherm vraagt twee dingen tegelijk: hoe het bestand heet en waar het komt te staan.' },
          { text: 'Dat kies je niet zelf; Word zet elk bestand automatisch op de goede plek.', correct: false, misconception: 'Aannemen dat het programma de keuze voor je maakt, terwijl juist die keuze bepaalt of je er thuis bij kunt.' },
          { text: 'In het tabblad Invoegen, want daar staat alles wat met je document te maken heeft.', correct: false, misconception: 'De regel over het tabblad Invoegen doortrekken naar het opslaan, dat via Bestand loopt.' }
        ],
        feedback: 'Kijk in dat scherm dus altijd twee keer: eenmaal naar de naam en eenmaal naar de plek. Wie alleen op Opslaan drukt, laat de plek aan het toeval over.',
        leerdoel: 'Je kunt een Word-document maken, een duidelijke naam geven en op de juiste plek opslaan.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Een automatisch voorblad vult je naam, de datum en je klas zelf in, zodat jij alleen nog de titel hoeft te typen.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denken dat het kant-en-klare voorblad ook de inhoud van alle velden levert, omdat de vormgeving al klaarstaat en de auteursnaam er soms al in staat.' },
          { text: 'Niet waar', correct: true, explanation: 'Bij Auteur staat je naam er soms al, want Word haalt die uit je account. Titel, Subtitel, Datum en zeker Cursus vul jij zelf in.' }
        ],
        feedback: 'Het voorblad regelt de vorm, jij levert de inhoud. Je naam kan uit je account komen, maar in welke klas je zit weet Word niet.',
        leerdoel: 'Je kunt een automatisch voorblad invoegen en invullen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen'
      },
      {
        // RONDE 5. Hier stond een vraag "Welke combinatie hoort bij elkaar?"
        // waarvan het GOEDE antwoord luidde: "CTRL + S slaat je document
        // tussentijds op." Het item hing aan het opmaakdoel, maar wie alleen wist
        // dat de S van save komt had hem goed zonder iets van vet, cursief of
        // onderstrepen te weten. De toetsmatrijs meldde dan een opmaakdoel dat in
        // werkelijkheid niet bevraagd was, en het opslagdoel werd gemeten zonder
        // dat het geteld werd. Nu moet je voor het goede antwoord alle DRIE de
        // opmaaktoetsen kennen en is de koppeling eerlijk. De bronkoppelvraag met
        // alle vier de sneltoetsen (CTRL+S, B, i en U) staat ongewijzigd in de
        // hoofdstuktoets van 4.7, dus die bronvraag is er niet mee verdwenen.
        prompt: 'In je verslag wil je de titel onderstrepen, drie kernwoorden dikgedrukt maken en een citaat schuin zetten. Welke drie sneltoetsen gebruik je, in die volgorde?',
        type: 'meerkeuze',
        options: [
          { text: 'CTRL + U voor de titel, CTRL + B voor de kernwoorden en CTRL + i voor het citaat.', correct: true, explanation: 'De letters komen uit het Engels: underline, bold en italic. Je selecteert eerst de tekst en drukt daarna pas de sneltoets in.' },
          { text: 'CTRL + i voor de titel, CTRL + U voor de kernwoorden en CTRL + B voor het citaat.', correct: false, misconception: 'De drie opmaaktoetsen een plek doorschuiven, omdat ze alle drie op dezelfde manier werken.' },
          { text: 'CTRL + S voor de titel, CTRL + B voor de kernwoorden en CTRL + i voor het citaat.', correct: false, misconception: 'De S van save aanzien voor een opmaaktoets, terwijl die alleen je document opslaat.' },
          { text: 'CTRL + B voor de titel, CTRL + i voor de kernwoorden en CTRL + U voor het citaat.', correct: false, misconception: 'De B van bold en de U van underline omdraaien en het citaat onderstrepen in plaats van schuin zetten.' }
        ],
        feedback: 'Onthoud de eerste letters van het Engelse woord: B van bold, i van italic en U van underline. En selecteer altijd eerst je tekst, anders geldt de opmaak pas voor wat je hierna typt.',
        leerdoel: 'Je kunt tekst dikgedrukt, schuin of onderstreept maken en paginanummers toevoegen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Leg uit waarom paginanummers pas echt nuttig worden zodra je verslag langer is dan een paar pagina\'s.',
        type: 'open',
        modelAnswer: 'Bij een kort verslag ziet de lezer alles in één blik, dus verwijzen is niet nodig. Wordt het langer, dan moet iemand kunnen bladeren naar een bepaald deel. Met paginanummers kun je zeggen of opschrijven waar iets staat, en de lezer vindt die plek dan terug. De inhoudsopgave die je later maakt noemt precies dezelfde nummers, omdat Word de pagina\'s op één manier telt.',
        nakijkpunten: [
          'Noemt dat de lezer bij een lang document moet kunnen zoeken of bladeren.',
          'Legt een verband met verwijzen naar een plek, bijvoorbeeld via de inhoudsopgave.',
          'Gebruikt een eigen voorbeeld in plaats van de zin uit de les over te schrijven.'
        ],
        feedback: 'Een goed antwoord noemt niet alleen dat het handig is, maar ook waarvoor: verwijzen naar een plek in een document dat je niet in één blik overziet.',
        leerdoel: 'Je kunt tekst dikgedrukt, schuin of onderstreept maken en paginanummers toevoegen.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'In hoofdstuk 2 leerde je bestanden ordenen in mappen en in OneDrive. Vergelijk dat met het opslaan van je Word-verslag: welke afspraak uit hoofdstuk 2 gebruik je hier opnieuw, en wat komt er in Word bij?',
        type: 'open',
        modelAnswer: 'Uit hoofdstuk 2 gebruik ik dat ik een duidelijke map en een duidelijke bestandsnaam kies en in OneDrive opsla, zodat ik het bestand op elke computer terugvind. In Word komt erbij dat ik tijdens het werken zelf regelmatig opsla met CTRL+S, of automatisch opslaan aanzet, want een document dat ik uren openhoud kan ik anders alsnog kwijtraken.',
        nakijkpunten: [
          'Benoemt minstens één afspraak uit hoofdstuk 2: mappen, duidelijke naam of opslaan in OneDrive.',
          'Noemt iets wat specifiek bij Word hoort, zoals tussentijds opslaan met CTRL+S of automatisch opslaan.',
          'Legt het verband tussen de twee in plaats van twee losse lijstjes te geven.'
        ],
        feedback: 'Deze vraag haalt hoofdstuk 2 terug. Het ordenen blijft hetzelfde; nieuw is dat je in Word ook tijdens het werken zelf verantwoordelijk bent voor opslaan.',
        leerdoel: 'Je kunt een Word-document maken, een duidelijke naam geven en op de juiste plek opslaan.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren'
      },
      {
        prompt: 'In hoofdstuk 2 leerde je de sneltoetsen Ctrl+C, Ctrl+V en Ctrl+Z. Wat hebben die gemeen met CTRL + B, CTRL + i en CTRL + U uit deze paragraaf?',
        type: 'meerkeuze',
        options: [
          { text: 'Het zijn allemaal opdrachten die je met het toetsenbord geeft in plaats van met de muis via een menu.', correct: true, explanation: 'Een sneltoets is een kortere weg naar een knop die ook gewoon in de werkbalk staat; je handen hoeven het toetsenbord niet te verlaten.' },
          { text: 'Ze werken alleen binnen Microsoft Word en nergens anders, want elk programma bedenkt zijn eigen sneltoetsen.', correct: false, misconception: 'Denken dat sneltoetsen bij één programma horen, terwijl Ctrl+C en Ctrl+V bijna overal werken.' },
          { text: 'Ze doen allemaal iets met de opmaak van je tekst.', correct: false, misconception: 'De hele groep sneltoetsen gelijkstellen aan de drie opmaaktoetsen uit deze paragraaf.' },
          { text: 'Ze werken alleen als je bestand in OneDrive staat.', correct: false, misconception: 'Sneltoetsen verwarren met automatisch opslaan, dat inderdaad OneDrive nodig heeft.' }
        ],
        feedback: 'Een sneltoets is steeds hetzelfde idee: dezelfde opdracht als in het menu, alleen sneller. Kopiëren, plakken en terugdraaien werken zo in bijna elk programma.',
        leerdoel: 'Je kunt tekst dikgedrukt, schuin of onderstreept maken en paginanummers toevoegen.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren'
      }
    ]
  },

  // 4.2 Koppen en een automatische inhoudsopgave
  '4.2': {
    learningGoals: [
      'Je kunt tekst opmaken met de stijlen Kop 1 en Kop 2.',
      'Je kunt een automatische inhoudsopgave invoegen en bijwerken.',
      'Je weet waarom koppen je verslag overzichtelijk maken.'
    ],
    theorie: [
      {
        keyTerms: ['tekststijl', 'Stijlen', 'Kop 1', 'Kop 2'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Yara maakt haar hoofdstuktitels zelf op: lettergrootte 20, vet en donkerblauw. Het ziet er precies zo uit als bij haar buurman, die de stijl Kop 1 gebruikte. Toch verschijnt haar hoofdstuk straks niet in de inhoudsopgave. Hoe kan dat?</p>',
          '<p><strong>Antwoord.</strong> Word kijkt niet naar hoe iets eruitziet, maar naar wat het is. Bij Yara staat er gewone tekst die toevallig groot en vet is; bij haar buurman staat er een tekststijl met het label Kop 1. De inhoudsopgave zoekt naar dat label. Yara selecteert haar titels alsnog en klikt op Start en dan op Kop 1 in het vakje Stijlen. Het label zit er nu op, dus haar hoofdstukken komen wel in de inhoudsopgave. Haar lettergrootte 20, haar vet en haar donkerblauw blijven daarbij wel gewoon staan. Opmaak die je zelf met de hand aanzet, gaat in Word namelijk over een stijl heen. Wat ze niet zelf zette, zoals het lettertype, neemt Kop 1 juist wél over. Haar titels zien er dus anders uit dan die van haar buurman, terwijl ze allebei Kop 1 heten. Wil Yara dat verschil ook weg, dan selecteert ze de titel en drukt ze op Ctrl + Spatie. Die sneltoets wist alleen haar eigen opmaak en laat het label Kop 1 gewoon staan. Pas wel op met de knop Alle opmaak wissen, want die haalt het label Kop 1 juist wél weg.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['inhoudsopgave', 'Verwijzingen', 'momentopname'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Tim voegt een inhoudsopgave in, schrijft daarna nog twee hoofdstukken en levert zijn verslag in. Zijn docent ziet in de inhoudsopgave maar twee hoofdstukken staan, terwijl er vier in het document zitten. Wat is de oorzaak, en wat had Tim moeten doen?</p>',
          '<p><strong>Antwoord.</strong> De inhoudsopgave is een momentopname: hij toont hoe je document eruitzag op het moment van invoegen. Nieuwe koppen komen er niet vanzelf bij. Tim had op zijn inhoudsopgave moeten klikken, daarna op Inhoudsopgave bijwerken en dan op Hele inhoudsopgave bijwerken. Twee klikken, en alle vier de hoofdstukken hadden er met de goede paginanummers in gestaan.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Kop 1 is de stijl voor een hoofdstuktitel en Kop 2 voor een titel daaronder. Je kiest ze op het tabblad Start, in het vakje Stijlen rechts in de werkbalk. Word herkent die labels en bouwt er via Verwijzingen een automatische inhoudsopgave mee. In die lijst ziet je lezer meteen op welke bladzijde elk hoofdstuk van jou begint. Verander je later iets aan je verslag, dan moet je de lijst zelf bijwerken. Doe je dat niet, dan wijst je inhoudsopgave naar pagina\'s die allang niet meer kloppen.</p>',
      keyTerms: ['Kop 1', 'inhoudsopgave', 'Verwijzingen']
    },
    vragen: [
      {
        prompt: 'Waarom herkent Word zelf opgemaakte dikke, grote tekst niet als hoofdstuktitel?',
        type: 'meerkeuze',
        options: [
          { text: 'Word kijkt naar het label van de stijl, niet naar hoe de tekst eruitziet.', correct: true, explanation: 'Kop 1 en Kop 2 zijn labels; de inhoudsopgave zoekt naar die labels en niet naar lettergrootte of vet.' },
          { text: 'Word herkent alleen tekst in lettergrootte 20 of groter als titel.', correct: false, misconception: 'Denken dat er een grens in lettergrootte bestaat waarboven iets een kop wordt.' },
          { text: 'Word herkent alleen titels die op een nieuwe pagina beginnen.', correct: false, misconception: 'De regel dat hoofdstukken bovenaan een pagina beginnen verwarren met de kopstijl zelf.' },
          { text: 'Dat komt doordat je de inhoudsopgave nog niet hebt bijgewerkt; na Hele inhoudsopgave bijwerken staat je titel er alsnog gewoon in.', correct: false, misconception: 'Alles wat er niet in staat op het bijwerken schuiven, ook als de stijl er nooit op gezet is.' }
        ],
        feedback: 'Vorm en label zijn twee verschillende dingen. Alleen het label Kop 1 of Kop 2 telt mee voor de inhoudsopgave.',
        leerdoel: 'Je kunt tekst opmaken met de stijlen Kop 1 en Kop 2.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Een inhoudsopgave die je invoegt is een momentopname en verandert niet vanzelf mee.',
        waar: true,
        feedback: 'Precies. Voeg je later koppen toe of verschuiven pagina\'s, dan klopt de lijst pas weer na Hele inhoudsopgave bijwerken.',
        leerdoel: 'Je kunt een automatische inhoudsopgave invoegen en bijwerken.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen'
      },
      {
        prompt: 'Leg uit wat het verschil is tussen Kop 1 en Kop 2, en geef een voorbeeld uit je eigen verslag.',
        type: 'open',
        modelAnswer: 'Kop 1 is de hoofdtitel of het hoofdstuk, bijvoorbeeld Hoofdstuk 1 - Wat is Microsoft Word? Kop 2 is een titel die onder zo een hoofdstuk hangt, dus een subtitel van een paragraaf, bijvoorbeeld Hoe maak je een inhoudsopgave in Word. In de inhoudsopgave staat Kop 2 daardoor iets ingesprongen onder Kop 1, zodat de lezer ziet welk stuk bij welk hoofdstuk hoort.',
        nakijkpunten: [
          'Noemt Kop 1 als hoofdstuk of hoofdtitel en Kop 2 als onderdeel daarvan.',
          'Geeft van minstens één van de twee een eigen voorbeeld uit het verslag.',
          'Legt uit wat je in de inhoudsopgave van dat verschil terugziet.'
        ],
        feedback: 'Het gaat om de rangorde: Kop 2 hangt onder Kop 1, en in de inhoudsopgave zie je dat terug aan de inspringing.',
        leerdoel: 'Je kunt tekst opmaken met de stijlen Kop 1 en Kop 2.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'Via welk tabblad voeg je een automatische inhoudsopgave in?',
        type: 'meerkeuze',
        options: [
          { text: 'Via Start, want daar staan de stijlen Kop 1 en Kop 2 waar de inhoudsopgave naar op zoek gaat.', correct: false, misconception: 'Denken dat alles wat met koppen te maken heeft op hetzelfde tabblad staat.' },
          { text: 'Via Invoegen, want daar zitten voorblad en paginanummers ook.', correct: false, misconception: 'De inhoudsopgave op één hoop gooien met voorblad en paginanummer omdat die ook toegevoegd worden.' },
          { text: 'Via Verwijzingen, en dan Inhoudsopgave met een standaardstijl.', correct: true, explanation: 'De inhoudsopgave verwijst naar plekken in je document, en daarom staat hij op het tabblad Verwijzingen.' },
          { text: 'Via Ontwerpen, want de inhoudsopgave hoort bij de vormgeving.', correct: false, misconception: 'De inhoudsopgave zien als opmaak in plaats van als verwijzing.' }
        ],
        feedback: 'De naam van het tabblad verklapt het: een inhoudsopgave verwijst naar plekken, dus hij staat onder Verwijzingen.',
        leerdoel: 'Je kunt een automatische inhoudsopgave invoegen en bijwerken.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Vergelijk je verslag uit 4.1, dat alleen een voorblad en paginanummers had, met hetzelfde verslag na deze paragraaf. Waarom is de lezer nu sneller op de goede pagina?',
        type: 'open',
        modelAnswer: 'In 4.1 stonden er wel nummers onderaan de pagina\'s, maar nergens stond wat er op welke pagina te vinden was. De lezer moest dus zelf doorbladeren. Nu noemt de inhoudsopgave bij elk hoofdstuk de bladzijde, en onderaan die bladzijde staat hetzelfde nummer. Die twee nummers komen uit dezelfde telling van Word, dus de lezer bladert in één keer goed. De koppen leveren daarnaast structuur op, zodat je ook tijdens het lezen ziet waar een nieuw onderdeel begint.',
        nakijkpunten: [
          'Legt uit dat losse paginanummers de lezer nog niet vertellen wat waar staat.',
          'Noemt dat de kopstijlen de inhoudsopgave voeden.',
          'Benoemt overzicht of structuur als winst voor de lezer.'
        ],
        feedback: 'Mooi verband: de koppen uit 4.2 leveren de lijst, en de nummers uit 4.1 maken die lijst op papier bruikbaar.',
        leerdoel: 'Je weet waarom koppen je verslag overzichtelijk maken.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren'
      },
      {
        prompt: 'Herhaling uit 4.1. Welke van deze vier handelingen doe je NIET via het tabblad Invoegen?',
        type: 'meerkeuze',
        options: [
          { text: 'Een automatisch voorblad op de eerste pagina zetten.', correct: false, misconception: 'Vergeten dat het voorblad juist het schoolvoorbeeld is van iets wat je toevoegt via Invoegen.' },
          { text: 'Een geselecteerde zin dikgedrukt maken.', correct: true, explanation: 'Opmaken doe je op het tabblad Start of met CTRL + B; je voegt niets toe, je verandert alleen hoe bestaande tekst eruitziet.' },
          { text: 'Paginanummers onderaan elke pagina laten verschijnen.', correct: false, misconception: 'Paginanummers bij de opmaak indelen omdat je zelf de plek kiest.' },
          { text: 'Een lege pagina achter je voorblad toevoegen.', correct: false, misconception: 'Denken dat een pagina erbij iets anders is dan iets toevoegen, omdat je hem ook met Ctrl + Enter maakt.' }
        ],
        feedback: 'Hier zit de regel achter: toevoegen gaat via Invoegen, veranderen hoe iets eruitziet gaat via Start.',
        leerdoel: 'Je kunt tekst dikgedrukt, schuin of onderstreept maken en paginanummers toevoegen.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren'
      },
      {
        // RONDE 10. De blauwdruk wil TWEE terugkeervragen per afsluitquiz. 4.2 had
        // er maar een die ook echt aan een leerdoel van een eerdere paragraaf hangt
        // (de vraag hierboven over het tabblad Invoegen). De vergelijkvraag over
        // 4.1 daarvoor telt niet mee, want die hangt aan een doel van 4.2 zelf.
        // Deze tweede haalt het voorblad uit 4.1 terug op het moment waarop de
        // leerling er in de bron ook echt langs moet scrollen.
        prompt: 'Herhaling uit 4.1. Je zet je inhoudsopgave op een nieuwe pagina net na je voorblad. Waarom niet ervoor?',
        type: 'meerkeuze',
        options: [
          { text: 'Omdat Word weigert een inhoudsopgave op pagina 1 van een document te zetten.', correct: false, misconception: 'Een verbod van het programma verzinnen, terwijl het een afspraak over volgorde is.' },
          { text: 'Omdat het voorblad de eerste pagina is die je lezer ziet, met de titel en jouw naam erop.', correct: true, explanation: 'Een voorblad kondigt je verslag aan, dus daar begint het. De inhoudsopgave wijst daarna pas de weg in wat erachter staat.' },
          { text: 'Omdat het voorblad zelf de stijl Kop 1 draagt en dus in de inhoudsopgave hoort te staan.', correct: false, misconception: 'Denken dat de grote letters op een voorblad een kopstijl zijn; het voorblad gebruikt eigen velden.' },
          { text: 'Omdat een inhoudsopgave in Word altijd op een oneven bladzijde moet beginnen.', correct: false, misconception: 'Een drukkersregel uit boeken toepassen op een schoolverslag in Word.' }
        ],
        feedback: 'Denk aan de volgorde waarin je lezer bladert: eerst wie en waarover, dan waar het staat, dan de tekst zelf.',
        leerdoel: 'Je kunt een automatisch voorblad invoegen en invullen.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren'
      }
    ]
  },

  // 4.3 Afbeeldingen invoegen en beeld dat je mag gebruiken
  '4.3': {
    learningGoals: [
      'Je kunt op Google zoeken naar afbeeldingen met een Creative Commons-licentie.',
      'Je kunt een afbeelding invoegen in Word en netjes bij je tekst plaatsen.',
      'Je weet waarom je niet zomaar elke afbeelding van internet mag gebruiken.'
    ],
    theorie: [
      {
        keyTerms: ['licentie', 'Creative Commons', 'usage rights'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Bilal vindt op internet een prachtige foto van een gamesetup en zet hem in zijn verslag. Hij zegt: hij stond gewoon op Google, dus hij is gratis. Waar zit de denkfout?</p>',
          '<p><strong>Antwoord.</strong> Google is geen eigenaar maar een zoekmachine: hij laat plaatjes zien die op websites van anderen staan. De maker van die foto houdt zijn rechten, ook als het plaatje makkelijk te downloaden is. Bilal zoekt opnieuw, maar nu via Tools en usage rights met de optie Creative Commons. Dan kiest hij uit foto\'s waarvan de maker vooraf toestemming gaf, en zet hij er netjes de bron bij.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['Invoegen', 'Afbeelding', 'indelingsopties'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fenna voegt een afbeelding in en haar alinea springt ineens uit elkaar. Er staan drie losse regels naast het plaatje en de rest staat er ver onder. Wat doet ze verkeerd?</p>',
          '<p><strong>Antwoord.</strong> Ze heeft het plaatje wel ingevoegd maar geen indelingsoptie gekozen, dus Word behandelt het als een gigantische letter in haar zin. Ze klikt op de afbeelding en daarna op het icoontje ernaast, dat Afbeelding opmaken of Indelingsopties heet. In dat menu kiest ze een variant waarbij de tekst om het plaatje heen loopt. Daarna sleept ze het plaatje naar de rand en maakt ze het met de witte puntjes kleiner. Nu is haar tekst weer gewoon door te lezen.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een plaatje dat op internet staat is niet vanzelf van jou. De maker houdt zijn rechten, tenzij hij vooraf toestemming geeft om het te gebruiken. Zoek daarom op Google via Images, Tools en usage rights naar beeld met een licentie van Creative Commons. Kies daarbij nooit iets aanstootgevends, want je zoekterm bepaalt zelf wat je te zien krijgt. Je voegt de afbeelding in via Invoegen en Afbeelding, en klikt hem daarna aan. In het menu indelingsopties kies je vervolgens hoe de tekst om je plaatje heen loopt. Zet er tot slot een korte bronregel onder, dan blijft je werk eerlijk.</p>',
      keyTerms: ['Creative Commons', 'indelingsopties', 'bronregel']
    },
    vragen: [
      {
        prompt: 'Waarom maakt het uit welke plek je kiest als je je verslag opslaat?',
        type: 'meerkeuze',
        options: [
          { text: 'Omdat een bestand op het bureaublad na een week vanzelf verdwijnt.', correct: false, misconception: 'Denken dat lokale bestanden een houdbaarheidsdatum hebben, terwijl het probleem is dat ze aan een apparaat vastzitten.' },
          { text: 'Omdat de plek bepaalt of je er op een andere computer bij kunt.', correct: true, explanation: 'Het bureaublad hoort bij dat ene apparaat en OneDrive bij jouw account. Je logt op elke schoolcomputer met hetzelfde account in, en alleen wat in OneDrive staat reist met dat account mee.' },
          { text: 'Omdat je op het bureaublad geen bestandsnaam mag kiezen.', correct: false, misconception: 'De keuze voor de naam en de keuze voor de plek door elkaar halen, omdat je ze in hetzelfde scherm maakt.' },
          { text: 'Omdat Word alleen documenten met een voorblad in OneDrive kan opslaan.', correct: false, misconception: 'Een onderdeel van het document verwarren met de vraag waar het bestand terechtkomt.' }
        ],
        feedback: 'Vraag uit de tussentoets over 4.1. Denk aan het opslaanscherm: bovenin de naam, ernaast de plek, en die tweede keuze bepaalt of je thuis verder kunt werken.',
        leerdoel: 'Je kunt een Word-document maken, een duidelijke naam geven en op de juiste plek opslaan.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Onder welk tabblad staat de knop Voorblad, en wat vul jij daarna zelf in?',
        type: 'meerkeuze',
        options: [
          { text: 'Onder Ontwerpen; Word vult Titel, Auteur en Datum daarna zelf in.', correct: false, misconception: 'Het voorblad voor vormgeving aanzien en denken dat het kant-en-klare blad ook de inhoud levert.' },
          { text: 'Onder Indeling; jij vult alleen de titel in.', correct: false, misconception: 'Denken dat alles wat de opbouw van je pagina raakt onder Indeling staat.' },
          { text: 'Onder Invoegen; jij vult Titel, Subtitel, Auteur, Datum en Cursus zelf in.', correct: true, explanation: 'Je voegt een hele pagina toe, dus dat gaat via Invoegen. De velden wachten op jouw gegevens; alleen bij Auteur staat je naam er soms al, uit je account.' },
          { text: 'Onder Bestand; jij vult niets in, want het voorblad komt uit je account.', correct: false, misconception: 'Aannemen dat Word álle velden uit je inlog haalt; hooguit je naam komt daarvandaan.' }
        ],
        feedback: 'Vraag uit de tussentoets over 4.1. Het voorblad regelt de vorm en jij levert de inhoud; je titel en je klas haalt Word nergens vandaan.',
        leerdoel: 'Je kunt een automatisch voorblad invoegen en invullen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'CTRL + U maakt tekst dikgedrukt en CTRL + B onderstreept hem.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'De sneltoetsen kennen maar de Engelse woorden erachter niet, waardoor B en U verwisselbaar lijken.' },
          { text: 'Niet waar', correct: true, explanation: 'Het is precies andersom: B staat voor bold en maakt dik, U staat voor underline en onderstreept.' }
        ],
        feedback: 'Vraag uit de tussentoets over 4.1. Vertaal de letter en je hebt het antwoord: save, bold, italic en underline. Paginanummers staan daar los van, onder Invoegen.',
        leerdoel: 'Je kunt tekst dikgedrukt, schuin of onderstreept maken en paginanummers toevoegen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen'
      },
      {
        prompt: 'In welke volgorde vind je op Google een afbeelding met een Creative Commons-licentie?',
        type: 'meerkeuze',
        options: [
          { text: 'Zoekopdracht typen, op Tools klikken, daarna pas op Images.', correct: false, misconception: 'De knop Tools zoeken voordat je de resultaten op afbeeldingen hebt gezet, waardoor usage rights er nog niet bij staat.' },
          { text: 'Eerst een mooie afbeelding kiezen en opslaan, en daarna via usage rights controleren of het eigenlijk wel mocht.', correct: false, misconception: 'Achteraf toestemming zoeken bij een plaatje dat je al gekozen hebt.' },
          { text: 'Zoekopdracht typen, op Images klikken, op Tools klikken, bij usage rights Creative Commons kiezen.', correct: true, explanation: 'Pas als je resultaten op afbeeldingen staan, verschijnt onder Tools de optie usage rights.' },
          { text: 'De afbeelding opslaan en er daarna een bronregel onder zetten.', correct: false, misconception: 'Denken dat een bronregel de toestemming vervangt in plaats van hem aanvult.' }
        ],
        feedback: 'De volgorde is niet toevallig: usage rights bestaat alleen binnen de afbeeldingsresultaten, dus Images komt vóór Tools.',
        leerdoel: 'Je kunt op Google zoeken naar afbeeldingen met een Creative Commons-licentie.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Beschrijf wat je doet als een ingevoegde afbeelding je alinea uit elkaar trekt.',
        type: 'open',
        modelAnswer: 'Ik klik op de afbeelding en daarna op het icoontje dat ernaast verschijnt. In het menu indelingsopties kies ik een optie waarbij de tekst om het plaatje heen of erlangs loopt. Daarna verplaats ik het plaatje en kijk ik telkens wat er met mijn tekst gebeurt, en met de witte puntjes maak ik het kleiner tot mijn zinnen weer gewoon leesbaar zijn.',
        nakijkpunten: [
          'Noemt het icoontje naast de afbeelding en het menu indelingsopties.',
          'Beschrijft dat je verplaatst en het effect op de tekst controleert.',
          'Noemt het aanpassen van het formaat met de witte puntjes of het draaien met het pijltjes-icoon.'
        ],
        feedback: 'Het gaat om proberen en kijken: verplaats het plaatje en beoordeel elke keer of je tekst nog te lezen is.',
        leerdoel: 'Je kunt een afbeelding invoegen in Word en netjes bij je tekst plaatsen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'Wat betekent het als een afbeelding een Creative Commons-licentie heeft?',
        type: 'meerkeuze',
        options: [
          { text: 'De maker geeft vooraf toestemming om het werk te gebruiken en te delen, meestal met zijn naam erbij.', correct: true, explanation: 'Creative Commons is een afspraak waarin de maker zelf zegt wat anderen met zijn werk mogen doen.' },
          { text: 'De afbeelding heeft geen maker meer, want die heeft zijn rechten weggegooid.', correct: false, misconception: 'Toestemming geven verwarren met het opgeven van alle rechten.' },
          { text: 'De afbeelding is door Google gemaakt en dus van iedereen.', correct: false, misconception: 'De zoekmachine aanzien voor de maker van de plaatjes die hij toont.' },
          { text: 'Je mag hem alleen bekijken, maar niet opslaan.', correct: false, misconception: 'Een licentie lezen als een verbod in plaats van als een toestemming.' }
        ],
        feedback: 'Een licentie is toestemming vooraf, geen afstand van rechten. Daarom hoort de naam van de maker er meestal wel bij.',
        leerdoel: 'Je weet waarom je niet zomaar elke afbeelding van internet mag gebruiken.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Je maakt de titel Hoofdstuk 1 met de hand groot en vet. Waarom komt hij daarna niet in je automatische inhoudsopgave?',
        type: 'meerkeuze',
        options: [
          { text: 'Omdat de inhoudsopgave alleen titels van een enkele regel oppikt en die van jou over twee regels loopt.', correct: false, misconception: 'Een regel over de lengte verzinnen, terwijl het over de stijl gaat.' },
          { text: 'Omdat de inhoudsopgave zoekt naar de stijlen Kop 1 en Kop 2, en dat label ontbreekt.', correct: true, explanation: 'Zelf opmaken verandert alleen hoe iets eruitziet; de stijl Kop 1 plakt er een label op waar Word later naar zoekt.' },
          { text: 'Omdat je de titel eerst had moeten onderstrepen met CTRL + U.', correct: false, misconception: 'Nog een opmaakhandeling toevoegen, terwijl geen enkele opmaak het label vervangt.' },
          { text: 'Omdat een inhoudsopgave pas werkt vanaf tien bladzijden.', correct: false, misconception: 'Een drempel bedenken die niet bestaat.' }
        ],
        feedback: 'Vraag uit de tussentoets over 4.2. Stijl gaat voor opmaak: pas als er Kop 1 op staat, kan Word je titel vinden en in de lijst zetten.',
        leerdoel: 'Je kunt tekst opmaken met de stijlen Kop 1 en Kop 2.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Wat is de winst van koppen voor de lezer en voor de schrijver samen?',
        type: 'meerkeuze',
        options: [
          { text: 'De lezer ziet waar een onderdeel begint, en de schrijver laat Word de inhoudsopgave met paginanummers zelf opbouwen.', correct: true, explanation: 'Koppen doen twee dingen tegelijk: ze wijzen de lezer de weg en ze geven het programma iets om mee te werken.' },
          { text: 'De lezer leest sneller, en de schrijver hoeft geen paginanummers meer in te voegen omdat de koppen dat werk overnemen.', correct: false, misconception: 'Denken dat koppen het invoegen van paginanummers overbodig maken; die twee dingen staan los van elkaar.' },
          { text: 'Het verslag wordt korter en daardoor makkelijker na te kijken.', correct: false, misconception: 'Structuur verwarren met lengte.' },
          { text: 'Er is geen winst; koppen zijn alleen een kwestie van smaak.', correct: false, misconception: 'Alleen naar het uiterlijk kijken en niet naar wat het programma ermee kan.' }
        ],
        feedback: 'Vraag uit de tussentoets over 4.2. Zonder koppen moet je na elke wijziging alle paginanummers met de hand nalopen; met koppen kost dat twee klikken.',
        leerdoel: 'Je weet waarom koppen je verslag overzichtelijk maken.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'In hoofdstuk 1 leerde je dat je teksten van internet niet zomaar overneemt en dat je de bron noemt. Vergelijk die regel met wat hier over afbeeldingen geldt: wat is hetzelfde en wat is anders?',
        type: 'open',
        modelAnswer: 'Hetzelfde is dat iemand anders het gemaakt heeft en dat je daarom de bron noemt in plaats van te doen alsof het van jou is. Anders is dat je een tekst in je eigen woorden kunt opschrijven, waarmee het probleem grotendeels verdwijnt. Een afbeelding kun je niet in eigen woorden overschrijven: je neemt hem letterlijk over. Daarom moet je vooraf controleren of er toestemming is, bijvoorbeeld via een Creative Commons-licentie.',
        nakijkpunten: [
          'Noemt de overeenkomst: iemand anders is de maker en de bron hoort erbij.',
          'Noemt het verschil: tekst kun je herschrijven, een afbeelding neem je letterlijk over.',
          'Trekt daaruit de conclusie dat je bij beeld vooraf de licentie moet checken.'
        ],
        feedback: 'Scherp gezien: het herschrijven dat bij tekst helpt, bestaat niet bij beeld, en juist daarom is de licentie bij een afbeelding zo belangrijk.',
        leerdoel: 'Je weet waarom je niet zomaar elke afbeelding van internet mag gebruiken.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren'
      },
      {
        // RONDE 7: hier stond "drie dingen" boven een opsomming van er vier
        // (voorblad, paginanummers, inhoudsopgave, afbeelding), terwijl de
        // vraag daarna wel naar "die vier" verwees. Het telwoord is nu gelijk
        // aan de opsomming.
        prompt: 'Je hebt nu vier dingen aan je verslag toegevoegd: in 4.1 een voorblad en paginanummers, in 4.2 een inhoudsopgave en hier een afbeelding. Leg uit welke van die vier NIET onder Invoegen staat en waarom niet.',
        type: 'open',
        modelAnswer: 'De inhoudsopgave staat als enige niet onder Invoegen maar onder Verwijzingen. Voorblad, paginanummer en afbeelding voeg je toe: ze staan er daarna gewoon, los van de rest van je tekst. Een inhoudsopgave doet iets anders; die verwijst naar plekken in je document en haalt daarvoor de koppen en de paginanummers op. Word heeft daar een eigen tabblad voor, en de naam Verwijzingen zegt precies wat het onderscheid is.',
        nakijkpunten: [
          'Wijst de inhoudsopgave aan als de uitzondering en noemt het tabblad Verwijzingen.',
          'Legt uit dat de andere drie iets toevoegen en de inhoudsopgave naar iets verwijst.',
          'Verbindt dat aan wat de inhoudsopgave ophaalt: de koppen en hun paginanummers.'
        ],
        feedback: 'Dit haalt 4.1 en 4.2 allebei terug. Toevoegen en verwijzen zijn twee verschillende dingen, en Word heeft er twee verschillende tabbladen voor.',
        leerdoel: 'Je kunt een automatische inhoudsopgave invoegen en bijwerken.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren'
      }
    ]
  },

  // 4.4 Gegevens in Excel: tabel, formule en grafiek
  '4.4': {
    learningGoals: [
      'Je kunt gegevens netjes in een tabel zetten in Excel.',
      'Je kunt met een eenvoudige formule optellen en een gemiddelde berekenen.',
      'Je kunt van je tabel een grafiek maken en die aflezen.'
    ],
    theorie: [
      {
        keyTerms: ['cel', 'kolom', 'rij', 'kopregel'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Jesse typt in B2, B3 en B4 achter elkaar 8500 stappen, 9200 stappen en 7100 stappen. Daaronder zet hij =SOM(B2:B4) en dat geeft 0. In de cel eronder zet hij =GEMIDDELDE(B2:B4) en daar verschijnt #DEEL/0!. Waarom staan er twee verschillende uitkomsten, en wat gaat er mis?</p>',
          '<p><strong>Antwoord.</strong> Er is één fout, met twee verschillende gevolgen. Door het woord stappen erachter ziet Excel de inhoud van de drie cellen als tekst en niet als getal. SOM slaat tekst gewoon over: er blijft niets over om op te tellen, dus de uitkomst is 0. GEMIDDELDE moet eerst optellen en daarna delen door het aantal getallen, maar het vindt er nul. Delen door nul kan niet, dus verschijnt de foutmelding #DEEL/0!. Jesse haalt het woord uit alle cellen en zet het één keer in de kopregel boven de kolom: Aantal stappen. Nu staan er kale getallen onder een duidelijke kop, en beide formules geven meteen het goede antwoord: 24800 en 8266,67.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['formule', 'SOM', 'GEMIDDELDE', 'celbereik'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Loes wil haar zeven weekcijfers optellen en typt in B9 het volgende: 12+14+11+15+13+16+12. Er verschijnt geen uitkomst, alleen die tekst. En als ze in B4 een getal wijzigt, gebeurt er niets. Wat had ze moeten doen?</p>',
          '<p><strong>Antwoord.</strong> Twee dingen ontbreken. Zonder isgelijkteken vooraan gaat Excel niet rekenen, dus haar rij tekens blijft gewoon tekst. En omdat ze losse getallen intypte in plaats van celadressen, weet Excel niet dat B4 erbij hoort. Ze typt in B9 de formule =SOM(B2:B8). Dat celbereik verwijst naar de cellen zelf, dus zodra ze B4 verandert, past de uitkomst zich vanzelf aan.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>In Excel zet je je gegevens in een tabel, met bovenaan altijd een kopregel. Daaronder komt één meting per regel, met kale getallen en dus zonder eenheid erachter. Een formule begint altijd met een isgelijkteken en verwijst daarna naar de adressen van cellen. Zo telt =SOM(B2:B8) je cijfers op, en geeft =GEMIDDELDE(B2:B8) het gemiddelde dat vanzelf meeverandert. Selecteer je daarna je gegevens inclusief de koppen, dan maakt Invoegen er een grafiek van. In die grafiek zie je in één blik wat tussen de losse cijfers verstopt zat.</p>',
      keyTerms: ['tabel', 'formule', 'grafiek']
    },
    vragen: [
      {
        prompt: 'Wat gebeurt er als je in een cel 3+4 typt zonder isgelijkteken ervoor?',
        type: 'meerkeuze',
        options: [
          { text: 'Excel geeft een foutmelding en de cel wordt rood.', correct: false, misconception: 'Verwachten dat Excel waarschuwt, terwijl er niets fout is aan tekst.' },
          { text: 'Excel rekent het toch uit, want het ziet plus- en mintekens.', correct: false, misconception: 'Denken dat Excel elke rekenopdracht herkent aan de tekens erin.' },
          { text: 'Excel maakt er automatisch =3+4 van.', correct: false, misconception: 'Aannemen dat het programma je bedoeling wel invult.' },
          { text: 'Er blijft gewoon de tekst 3+4 staan.', correct: true, explanation: 'Het isgelijkteken is het signaal om te rekenen; zonder dat teken is de inhoud gewone tekst.' }
        ],
        feedback: 'Het isgelijkteken is de schakelaar tussen tekst en rekenen. Zonder dat teken doet Excel niets met je som.',
        leerdoel: 'Je kunt met een eenvoudige formule optellen en een gemiddelde berekenen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Een formule met celadressen past zijn uitkomst vanzelf aan zodra je een getal in die cellen wijzigt.',
        waar: true,
        feedback: 'Dat is precies de winst van celadressen: je verandert één getal en alle totalen en gemiddelden kloppen weer.',
        leerdoel: 'Je kunt met een eenvoudige formule optellen en een gemiddelde berekenen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen'
      },
      {
        prompt: 'Waarom zet je de eenheid, zoals het woord stappen, in de kopregel en niet achter elk getal?',
        type: 'meerkeuze',
        options: [
          { text: 'Omdat een kopregel anders leeg blijft, en een tabel zonder ingevulde kopregel ziet er slordig uit.', correct: false, misconception: 'De kopregel zien als versiering in plaats van als uitleg bij de kolom.' },
          { text: 'Omdat Excel een getal met een woord erachter als tekst leest en er dan niet mee kan rekenen.', correct: true, explanation: 'Alleen een kaal getal is voor Excel een getal; met tekst kan geen enkele functie rekenen.' },
          { text: 'Omdat de kolom anders te breed wordt voor je scherm.', correct: false, misconception: 'Denken dat het om de weergave gaat in plaats van om wat Excel met de inhoud kan doen.' },
          { text: 'Omdat je anders geen grafiek van je tabel kunt maken.', correct: false, misconception: 'De grafiek als eerste probleem zien, terwijl het rekenen al eerder vastloopt.' }
        ],
        feedback: 'De kopregel is de plek voor uitleg, de cellen eronder zijn de plek voor kale getallen waarmee gerekend kan worden.',
        leerdoel: 'Je kunt gegevens netjes in een tabel zetten in Excel.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Leg uit welke informatie je uit een grafiek haalt die je uit dezelfde kolom losse getallen niet zo snel haalt.',
        type: 'open',
        modelAnswer: 'In een kolom getallen moet ik alle waarden met elkaar vergelijken door ze één voor één te lezen. In een grafiek zie ik de hoogtes naast elkaar, dus ik zie meteen welke dag eruit springt en of het verloop stijgt of daalt. Een uitschieter of een patroon valt daardoor op zonder dat ik hoef te rekenen.',
        nakijkpunten: [
          'Noemt dat een grafiek verhoudingen of hoogtes in één blik zichtbaar maakt.',
          'Geeft een concreet voorbeeld: een uitschieter, een piek, een stijging of een daling.',
          'Verwijst naar de eigen tabel of grafiek uit de praktijkopdracht.'
        ],
        feedback: 'De winst van een grafiek zit in het vergelijken: je oog doet het werk dat je anders rekenend en lezend moet doen.',
        leerdoel: 'Je kunt van je tabel een grafiek maken en die aflezen.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'In 4.2 zorgde de automatische inhoudsopgave ervoor dat je niets met de hand hoefde bij te houden. Leg uit welke overeenkomst je ziet met formules in Excel, en noem ook een verschil.',
        type: 'open',
        modelAnswer: 'De overeenkomst is dat je in beide gevallen een verwijzing maakt in plaats van een uitkomst overtypt. De inhoudsopgave verwijst naar koppen en paginanummers, een formule verwijst naar celadressen, en allebei passen ze zich aan als de inhoud verandert. Het verschil is dat de inhoudsopgave je zelf om een bijwerkopdracht vraagt, terwijl een formule zijn uitkomst meteen zelf herberekent.',
        nakijkpunten: [
          'Benoemt de overeenkomst: verwijzen in plaats van een vaste waarde intypen.',
          'Noemt dat beide meeveranderen als de bron verandert.',
          'Noemt een echt verschil, bijvoorbeeld handmatig bijwerken tegenover automatisch herberekenen.'
        ],
        feedback: 'Sterk verband tussen twee programma\'s: allebei werken met verwijzingen, maar Excel werkt zijn uitkomst zelf bij en Word wacht op jouw klik.',
        leerdoel: 'Je kunt een automatische inhoudsopgave invoegen en bijwerken.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren'
      },
      {
        prompt: 'In 4.1 gaf je je Word-verslag een naam als Verslag_Oefening_Voornaam_klas en sloeg je het in OneDrive op. Waarom geldt precies diezelfde afspraak voor je Excel-bestand?',
        type: 'meerkeuze',
        options: [
          { text: 'Omdat Excel-bestanden alleen in OneDrive geopend kunnen worden.', correct: false, misconception: 'Denken dat een programma zelf eist waar het bestand staat, in plaats van dat het over bereikbaarheid gaat.' },
          { text: 'Omdat de afspraak niet over het programma gaat maar over jouw account.', correct: true, explanation: 'Alleen wat in OneDrive staat open je op elke computer. Word, Excel en PowerPoint maken alle drie bestanden, en een bestand op het bureaublad blijft in alle drie de gevallen bij dat ene apparaat.' },
          { text: 'Omdat formules alleen meeveranderen als het bestand in de cloud staat.', correct: false, misconception: 'Het herberekenen van formules verwarren met de opslagplek van het bestand.' },
          { text: 'Omdat je anders geen grafiek kunt invoegen.', correct: false, misconception: 'Een functie van Excel koppelen aan de opslagplek in plaats van aan het programma zelf.' }
        ],
        feedback: 'Deze afspraak staat los van het programma. Hij gaat over de vraag of je bestand bij een apparaat hoort of bij jou, en dat antwoord verandert niet als je van Word naar Excel gaat.',
        leerdoel: 'Je kunt een Word-document maken, een duidelijke naam geven en op de juiste plek opslaan.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren'
      }
    ]
  },

  // 4.5 PowerPoint: dia's, tekst, ontwerp en overgangen
  '4.5': {
    learningGoals: [
      'Je kunt uitleggen waarvoor je PowerPoint gebruikt.',
      "Je kunt dia's toevoegen met tekstvakken en afbeeldingen.",
      'Je kunt een achtergrond, kleuren en overgangen kiezen die je verhaal ondersteunen.'
    ],
    theorie: [
      {
        keyTerms: ['dia', 'slides', 'publiek'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Ravi moet zijn klas in vijf minuten uitleggen hoe je een sterk wachtwoord kiest. Hij begint een Word-document. Waarom is dat hier de verkeerde keuze?</p>',
          '<p><strong>Antwoord.</strong> Word maak je voor één lezer die rustig doorleest; PowerPoint maak je voor een publiek dat naar jou luistert terwijl er beeld naast staat. Ravi staat straks te praten, dus hij heeft steun nodig in de vorm van korte zinnen en plaatjes op een dia. Kiest hij Word, dan leest hij een lap tekst voor en haakt zijn klas af.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['tekstvak', 'Nieuwe dia', 'Ontwerpen', 'overgang'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Isa zet op elke dia een andere overgang: draaien, exploderen, vliegen. Haar klas zegt achteraf dat ze niets van haar verhaal onthouden heeft. Wat is hier gebeurd?</p>',
          '<p><strong>Antwoord.</strong> De effecten trokken alle aandacht naar zichzelf toe. Een overgang hoort de sprong tussen twee dia\'s rustig te maken, niet de show te stelen. Isa kiest via het tabblad Overgangen één rustig effect en zet dat op alle dia\'s. Zo blijft het beeld voorspelbaar en gaat de aandacht terug naar wat zij vertelt.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>PowerPoint gebruik je als je iets aan een groep laat zien, bijvoorbeeld bij een spreekbeurt. Een reeks dia\'s ondersteunt dan jouw verhaal, maar jij blijft degene die het vertelt. Een dia bouw je met de knop Nieuwe dia en met tekstvakken via Invoegen. Voor afbeeldingen gelden daarbij dezelfde regels over toestemming als in Word, dus zoek met Tools of Filter. Kies via Ontwerpen een rustige achtergrond, hooguit twee lettertypes en één overgang. Een drukke dia leidt namelijk af van wat jij op dat moment staat te vertellen.</p>',
      keyTerms: ['dia', 'overgang', 'lettertypes']
    },
    vragen: [
      {
        prompt: 'Waarvoor gebruik je PowerPoint vooral?',
        type: 'meerkeuze',
        options: [
          { text: 'Om lange teksten te schrijven die iemand thuis in zijn eentje rustig kan doorlezen.', correct: false, misconception: 'PowerPoint verwarren met Word omdat je in allebei tekst kunt typen.' },
          { text: 'Om met formules te rekenen aan een tabel met getallen.', correct: false, misconception: 'PowerPoint verwarren met Excel omdat er ook grafieken in kunnen.' },
          { text: "Om een presentatie met dia's te maken die je verhaal aan een groep ondersteunt.", correct: true, explanation: 'De dia\'s zijn er voor een publiek dat luistert; jij vertelt en het beeld helpt daarbij.' },
          { text: 'Om muziek en video te bewerken tot een filmpje.', correct: false, misconception: 'Denken dat een programma waarin je video kunt plaatsen ook een videobewerker is.' }
        ],
        feedback: 'PowerPoint is er voor een groep die luistert. Word is er voor één lezer, Excel voor getallen.',
        leerdoel: 'Je kunt uitleggen waarvoor je PowerPoint gebruikt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Welke omschrijving hoort bij een overgang?',
        type: 'meerkeuze',
        options: [
          { text: 'Het effect waarmee je van de ene dia naar de volgende gaat.', correct: true, explanation: 'Je stelt hem in via het tabblad Overgangen en hij werkt tussen twee dia\'s in.' },
          { text: 'Het vak waarin je je tekst typt.', correct: false, misconception: 'Overgang verwarren met tekstvak omdat beide begrippen bij de basisfuncties horen.' },
          { text: 'Eén pagina van je presentatie.', correct: false, misconception: 'Overgang verwarren met dia omdat je bij allebei aan een stap in je presentatie denkt.' },
          { text: 'De achtergrondkleur en het lettertype die je samen via het menu Ontwerpen kiest.', correct: false, misconception: 'Alles wat met vormgeving te maken heeft op één hoop gooien.' }
        ],
        feedback: 'Let op de drie begrippen naast elkaar: een dia is een blad, een tekstvak is een plek voor tekst en een overgang zit ertussen.',
        leerdoel: 'Je kunt een achtergrond, kleuren en overgangen kiezen die je verhaal ondersteunen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen'
      },
      {
        prompt: 'Een presentatie met veel foto\'s en veel tekst op elke dia helpt je publiek beter onthouden.',
        waar: false,
        feedback: 'Andersom: een drukke dia leidt af. Je publiek gaat lezen in plaats van luisteren en onthoudt daardoor juist minder.',
        leerdoel: 'Je kunt een achtergrond, kleuren en overgangen kiezen die je verhaal ondersteunen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: "Beschrijf de stappen waarmee je een nieuwe dia met een tekstvak en een afbeelding maakt.",
        type: 'open',
        modelAnswer: 'Ik klik op de knop Nieuwe dia om een blad toe te voegen. Daarna ga ik naar Invoegen en kies Tekstvak, waarna ik het vak op de dia trek en mijn tekst intyp. Voor de afbeelding ga ik opnieuw naar Invoegen en kies Afbeeldingen, en ik gebruik alleen beeld dat ik mag gebruiken, dus gezocht via Tools en usage rights. Tot slot sla ik op, ook in OneDrive.',
        nakijkpunten: [
          'Noemt de knop Nieuwe dia.',
          'Noemt Invoegen met Tekstvak en Invoegen met Afbeeldingen.',
          'Verwijst naar de regel dat je niet zomaar elke afbeelding mag gebruiken.'
        ],
        feedback: 'Goede volgorde: eerst het blad, dan de vakken erop. En de beeldregel uit 4.3 geldt hier onverkort.',
        leerdoel: "Je kunt dia's toevoegen met tekstvakken en afbeeldingen.",
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'In 4.2 gaven Kop 1 en Kop 2 je Word-verslag structuur. Vergelijk dat met de inhoudsdia in PowerPoint: wat doen ze allebei, en waarom kan PowerPoint die dia niet automatisch maken?',
        type: 'open',
        modelAnswer: 'Allebei laten ze de lezer of luisteraar vooraf zien welke onderdelen er komen, zodat hij weet waar hij is. In Word herkent het programma de stijlen Kop 1 en Kop 2 als labels en bouwt het daarmee zelf een inhoudsopgave. In PowerPoint zit zo een label niet aan je dia\'s vast: elke dia is een los blad met een tekstvak erop. Daarom typ ik de opsomming op de inhoudsdia zelf en vul ik hem aan zodra ik dia\'s toevoeg.',
        nakijkpunten: [
          'Noemt de gedeelde functie: vooraf overzicht geven van wat er komt.',
          'Legt uit dat Word met stijllabels werkt en PowerPoint niet.',
          'Trekt de praktische conclusie dat je de inhoudsdia zelf bijhoudt.'
        ],
        feedback: 'Precies het verschil tussen labels en losse bladen: Word kan zoeken naar Kop 1, PowerPoint heeft niets om naar te zoeken.',
        leerdoel: 'Je kunt tekst opmaken met de stijlen Kop 1 en Kop 2.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren'
      },
      {
        prompt: 'De theorie zegt bij het invoegen van een afbeelding: je mag niet zomaar elk plaatje gebruiken, dus zoek op Google met Tools, in het Nederlands Filter. Leg uit waarom die regel uit 4.3 hier onveranderd geldt.',
        type: 'open',
        modelAnswer: 'De regel gaat over de maker van de afbeelding en niet over het programma waarin je hem plakt. Een fotograaf houdt zijn rechten of ik zijn foto nu in Word of in PowerPoint zet. Ik zoek dus op dezelfde manier: zoekopdracht typen, op Images klikken, op Tools klikken en bij usage rights Creative Commons kiezen. In mijn presentatie zet ik de bron erbij, bijvoorbeeld klein onderaan de dia of op de afsluitende dia.',
        nakijkpunten: [
          'Legt uit dat de rechten bij de maker liggen en niet bij het programma.',
          'Noemt de zoekstappen via Images, Tools en usage rights met Creative Commons.',
          'Zegt hoe hij de bron in een presentatie vermeldt.'
        ],
        feedback: 'Goede overdracht: een afspraak die over eigendom gaat verhuist gewoon mee naar het volgende programma. Alleen de plek van je bronvermelding verandert.',
        leerdoel: 'Je weet waarom je niet zomaar elke afbeelding van internet mag gebruiken.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren'
      }
    ]
  },

  // 4.6 Je eigen presentatie maken en presenteren
  '4.6': {
    learningGoals: [
      'Je kunt een presentatie maken met een titeldia, een inhoudsdia en een afsluitende dia.',
      'Je kunt je tekst kort en goed leesbaar houden.',
      'Je kunt je presentatie laten zien en er zelf bij vertellen.'
    ],
    theorie: [
      {
        keyTerms: ['titeldia', 'inhoudsdia', 'afsluitende dia', 'steekwoorden'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Mila levert negen dia\'s in over veilig internet. Ze begint meteen met phishing en eindigt midden in een tip. Haar docent zegt dat de opbouw niet klopt, terwijl de inhoud goed is. Wat mist er?</p>',
          '<p><strong>Antwoord.</strong> Er ontbreken drie dia\'s die niets met inhoud te maken hebben maar wel met richting. Vooraan hoort een titeldia met een korte titel, haar naam en klas en een afbeelding. Daarna komt een inhoudsdia met het overzicht van wat er volgt. En achteraan hoort een afsluitende dia, zodat haar klas hoort dat het verhaal klaar is in plaats van te merken dat het stopt.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['contrast', 'bondig', 'spreker'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Dean zet zijn hele tekst op de dia in donkergrijze letters op een zwarte achtergrond, en leest hem tijdens het presenteren voor. Wat gaat er mis, en wat verandert hij?</p>',
          '<p><strong>Antwoord.</strong> Er gaan twee dingen mis tegelijk. Door het lage contrast leest niemand achterin het lokaal zijn tekst. En omdat hij voorleest wat er al staat, luistert de voorste rij ook niet meer. Dean zet lichte letters op een donkere achtergrond en haalt zijn zinnen weg: hij houdt drie steekwoorden over en vertelt de rest zelf.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Je eindpresentatie heeft een vaste volgorde die je luisteraar houvast geeft. Vooraan staat een titeldia met de titel, je naam, je klas en een afbeelding. Daarna volgen een inhoudsdia, minimaal zeven inhoudelijke dia\'s en tot slot een afsluitende dia. Op die dia\'s zet je steekwoorden en plaatjes in plaats van hele zinnen. Jij vertelt het verhaal namelijk zelf, en het beeld op de dia ondersteunt je daarbij. Zorg voor genoeg contrast tussen je letters en je achtergrond, anders leest niemand mee. Oefen je verhaal een keer hardop en kijk tijdens het presenteren je publiek aan.</p>',
      keyTerms: ['titeldia', 'steekwoorden', 'contrast']
    },
    vragen: [
      {
        prompt: 'Wat hoort er op de titeldia van je eindpresentatie te staan?',
        type: 'meerkeuze',
        options: [
          { text: 'Alleen een mooie afbeelding, want de rest vertel je zelf.', correct: false, misconception: 'De titeldia zien als een sfeerplaatje in plaats van als visitekaartje van je presentatie.' },
          { text: 'Een korte titel, je naam en klas en een afbeelding.', correct: true, explanation: 'Zo weet je publiek meteen waar het over gaat en van wie de presentatie is.' },
          { text: 'De inhoudsopgave van je hele presentatie.', correct: false, misconception: 'Titeldia en inhoudsdia samenvoegen tot één dia.' },
          { text: 'Alleen je naam, want het onderwerp blijkt vanzelf.', correct: false, misconception: 'Denken dat het onderwerp gaandeweg wel duidelijk wordt.' }
        ],
        feedback: 'Titel, naam en klas en een beeld: dat is samen het visitekaartje. Het overzicht komt pas op de dia daarna.',
        leerdoel: 'Je kunt een presentatie maken met een titeldia, een inhoudsdia en een afsluitende dia.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Steekwoorden op je dia werken beter dan hele zinnen, omdat je publiek dan naar jou luistert in plaats van mee te lezen.',
        waar: true,
        feedback: 'Klopt. Mensen kunnen niet tegelijk lezen en luisteren, dus wie hele zinnen op de dia zet, concurreert met zichzelf.',
        leerdoel: 'Je kunt je tekst kort en goed leesbaar houden.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen'
      },
      {
        prompt: 'Waarom is donkere tekst op een donkere achtergrond een probleem, ook al lees jij het op je eigen scherm prima?',
        type: 'meerkeuze',
        options: [
          { text: 'Omdat een beamer donkere kleuren nooit goed weergeeft, dus op een gewoon scherm zou dezelfde dia prima leesbaar zijn.', correct: false, misconception: 'De oorzaak bij de apparatuur leggen in plaats van bij het kleurverschil.' },
          { text: 'Omdat donkere kleuren volgens de les niet mogen in een presentatie, ook niet als jij ze zelf mooi vindt.', correct: false, misconception: 'De regel als een verbod op kleuren lezen in plaats van als eis aan het verschil ertussen.' },
          { text: 'Omdat je dia dan langzamer laadt tijdens het presenteren.', correct: false, misconception: 'Leesbaarheid verwarren met een technisch probleem.' },
          { text: 'Omdat er te weinig contrast is, en op afstand verdwijnt het verschil tussen letter en achtergrond helemaal.', correct: true, explanation: 'Van dichtbij op een klein scherm zie je het verschil nog; achterin het lokaal valt het weg.' }
        ],
        feedback: 'Het gaat om het verschil tussen twee kleuren, niet om de kleuren zelf. Test je dia daarom vanaf de achterste rij.',
        leerdoel: 'Je kunt je tekst kort en goed leesbaar houden.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Je video start niet tijdens je presentatie en de klas kijkt naar je. Beschrijf wat je dan doet en waarom.',
        type: 'open',
        modelAnswer: 'Ik vertel gewoon door en leg in eigen woorden uit wat er in de video te zien zou zijn geweest. Daarna ga ik naar de volgende dia en probeer ik de video eventueel later nog. Dat kan omdat mijn verhaal los staat van de techniek: de dia\'s en de video ondersteunen mij, ik ben zelf de spreker.',
        nakijkpunten: [
          'Geeft een concrete oplossing: doorvertellen of het beeld in eigen woorden beschrijven.',
          'Legt uit dat de presentatie ondersteunend is en het verhaal van de spreker komt.',
          'Blijft rustig en stopt de presentatie niet.'
        ],
        feedback: 'De kern is dat jij het verhaal draagt. De techniek is hulp, en hulp die uitvalt is geen reden om te stoppen.',
        leerdoel: 'Je kunt je presentatie laten zien en er zelf bij vertellen.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren'
      },
      {
        // RONDE 8. Deze vraag is de enige terugkeervraag van 4.6 en draagt dus
        // een leerdoel uit een eerdere paragraaf. Tot en met ronde 7 ging hij
        // over het terugbrengen tot steekwoorden, terwijl zijn leerdoelveld het
        // voorblad van 4.1 noemde; in de toetsmatrijs telde dat als een meting
        // op een doel dat de vraag niet echt bevroeg. Hij gaat nu over de
        // vergelijking tussen het automatische voorblad uit 4.1 en de titeldia
        // van 4.6, zodat vraag en leerdoel weer hetzelfde meten.
        prompt: 'In 4.1 vulde je op een automatisch voorblad vijf velden in: Titel, Subtitel, Auteur, Datum en Cursus. Je titeldia doet in je presentatie ongeveer hetzelfde werk. Leg uit welke van die velden je op je titeldia terugzet, welk veld je weglaat, en waarom een titeldia korter mag zijn dan een voorblad.',
        type: 'open',
        modelAnswer: 'Op mijn voorblad in Word vulde ik Titel, Subtitel, Auteur, Datum en Cursus in. Op mijn titeldia zet ik daarvan de titel, mijn naam en mijn klas, want dat is wat mijn publiek in één blik moet zien. De datum laat ik weg, omdat iedereen die naar mijn presentatie kijkt zelf al weet welke dag het is. Een voorblad wordt gelezen door iemand die het verslag in handen heeft en er de tijd voor neemt. Mijn titeldia hangt maar twintig seconden op het scherm, dus daar horen minder woorden en een afbeelding bij.',
        nakijkpunten: [
          'Noemt de velden van het automatische voorblad uit 4.1 bij naam.',
          'Zegt welke van die velden wel en welke niet op de titeldia terugkomen.',
          'Verklaart het verschil uit de tijd die een lezer en een kijker voor de informatie hebben.'
        ],
        feedback: 'Het voorblad en de titeldia beantwoorden dezelfde twee vragen: wie ben je en waar gaat dit over. Alleen krijgt je kijker daar veel minder tijd voor dan je lezer.',
        leerdoel: 'Je kunt een automatisch voorblad invoegen en invullen.',
        denkniveau: 'maken_controleren',
        niveau: 'verdieping',
        rol: 'reflecteren'
      },
      {
        prompt: 'Uit welk eerder hoofdstuk of welke eerdere paragraaf haal je de inhoud van elk van de vier onderwerpen?',
        type: 'meerkeuze',
        options: [
          { text: 'Alle vier de onderwerpen komen uit hoofdstuk 4, want deze presentatie staat nu eenmaal in hoofdstuk 4.', correct: false, misconception: 'Denken dat een opdracht altijd alleen over het hoofdstuk gaat waarin hij staat.' },
          { text: 'Mijn device komt uit hoofdstuk 2, Veilig internet uit hoofdstuk 3, Word uit 4.1 tot en met 4.3 en Digitale geletterdheid uit hoofdstuk 1.', correct: true, explanation: 'De vier onderwerpen zijn precies de vier grote onderdelen van dit schooljaar; deze presentatie haalt dus alles van dit halfjaar nog een keer op.' },
          { text: 'Je bedenkt de inhoud zelf, want de bron doet er bij een presentatie niet toe.', correct: false, misconception: 'De vrijheid om je onderwerp te kiezen verwarren met vrijheid om de inhoud te verzinnen.' },
          { text: 'Alles komt uit hoofdstuk 1, want daar begon digitale geletterdheid.', correct: false, misconception: 'Digitale geletterdheid als koepelbegrip verwarren met de plek waar de losse stof staat.' }
        ],
        feedback: 'Deze opdracht is niet toevallig de laatste voor de eindtoets: welk onderwerp je ook kiest, je haalt er stof mee op uit een van de vier hoofdstukken van dit jaar.',
        leerdoel: 'Je kunt een presentatie maken met een titeldia, een inhoudsdia en een afsluitende dia.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren'
      },
      {
        // RONDE 10. Tweede terugkeervraag voor 4.6, zoals de blauwdruk er twee per
        // afsluitquiz vraagt. De vergelijkvraag hierboven over het voorblad was de
        // enige die aan een doel van een eerdere paragraaf hing. Deze haakt aan bij
        // de bronzin uit les 7 dat je je verhaal met screenshots of plaatjes van
        // internet ondersteunt: precies het moment waarop het beeldrecht uit 4.3
        // weer gaat gelden, nu in PowerPoint in plaats van in Word.
        prompt: 'Herhaling uit 4.3. Je haalt voor je eindpresentatie plaatjes van internet. Wat doe je voordat je er een op een dia zet?',
        type: 'meerkeuze',
        options: [
          { text: 'Ik kijk of de afbeelding scherp genoeg is en of hij bij de kleuren van mijn ontwerp past.', correct: false, misconception: 'De vraag over toestemming vervangen door een vraag over vormgeving, omdat die in 4.5 aan bod kwam.' },
          { text: 'Ik verklein het plaatje, want een kleine afbeelding valt niet meer onder het auteursrecht van de maker.', correct: false, misconception: 'Denken dat het formaat iets verandert aan wie de eigenaar is.' },
          { text: 'Ik zoek met het filter op Creative Commons-licenties en noteer erbij waar de afbeelding vandaan komt.', correct: true, explanation: 'Bij Google Afbeeldingen zet je dat filter onder Filter (in het Engels Tools) en dan Gebruiksrechten. Zo kies je beeld dat de maker heeft vrijgegeven, en met de bron erbij zie je later nog waar het vandaan kwam.' },
          { text: 'Ik maak er eerst een screenshot van, want een screenshot maak ik zelf en is daarmee van mij.', correct: false, misconception: 'Een screenshot aanzien voor eigen werk, terwijl je de afbeelding van iemand anders overneemt.' }
        ],
        feedback: 'Beeldrecht verhuist met je mee van Word naar PowerPoint. Een dia laat je net zo goed aan anderen zien als een verslag.',
        leerdoel: 'Je weet waarom je niet zomaar elke afbeelding van internet mag gebruiken.',
        denkniveau: 'toepassen',
        niveau: 'verdieping',
        rol: 'reflecteren'
      }
    ]
  },

  // 4.7 Checkpoint: eindtoets basisvaardigheden ICT
  '4.7': {
    learningGoals: [
      'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
      'Je kunt je resultaat opslaan en delen met je docent.'
    ],
    theorie: [
      {
        keyTerms: ['eindtoets', 'willekeurige', 'voldoende'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sem hoort dat er 38 vragen in de toets zitten en gaat alleen de Word-stof leren, want dat zijn er vast maar een paar. Waarom is dat een slechte gok?</p>',
          '<p><strong>Antwoord.</strong> Je krijgt 25 willekeurige vragen uit de hele set, dus je weet vooraf niet welke onderwerpen je treft. Sem kan dus net zo goed 15 vragen over zijn device en veilig internet krijgen. Vanaf 55% goed is het een voldoende, en die haalt hij niet met één onderwerp. Hij loopt daarom alle vier de gebieden kort door met zijn eigen werk erbij.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['bewijs van deelname', 'screenshot', 'bewijsstuk'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Amira maakt de toets, ziet haar resultaat en klikt het scherm weg om naar de volgende les te gaan. Later vraagt haar docent om haar bewijs. Wat is er misgegaan?</p>',
          '<p><strong>Antwoord.</strong> Het bewijs van deelname verschijnt één keer, aan het einde van de toets, en is daarna niet terug te halen. Zonder screenshot heeft haar docent niets om aan te zien dat zij de toets gemaakt heeft. Amira had het scherm meteen moeten vastleggen en die screenshot in haar map in OneDrive moeten zetten, voordat ze wegklikte.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>De eindtoets gaat over les 1 tot en met les 7 van dit schooljaar. Hij bevraagt vier gebieden tegelijk: je account en systemen, je device, veilig internet en Word met PowerPoint. Je krijgt 25 van de 38 vragen te zien en haalt vanaf 55% goed een voldoende. Aan het einde verschijnt je bewijs van deelname met jouw resultaat erop. Maak daar meteen een screenshot van, want na het wegklikken is dat scherm weg. Zet die screenshot in je map in OneDrive en deel hem daarna met je docent.</p>',
      keyTerms: ['eindtoets', 'bewijs van deelname', 'voldoende']
    },
    vragen: [
      {
        prompt: 'Welke van deze zinnen over opslaan klopt?',
        type: 'meerkeuze',
        options: [
          { text: 'Sla je op het bureaublad op, dan open je het bestand ook op elke andere laptop, zolang je maar met hetzelfde account inlogt.', correct: false, misconception: 'Het bureaublad aanzien voor een plek die bij jouw account hoort in plaats van bij dat apparaat.' },
          { text: 'Sla je op in OneDrive, dan kun je automatisch opslaan aanzetten en overal bij je document.', correct: true, explanation: 'OneDrive hoort bij je account, dus je opent je document op elke computer waarop je met hetzelfde account inlogt. Alleen daar bestaat bovendien de schakelaar voor automatisch opslaan; die vind je boven de werkbalk.' },
          { text: 'CTRL + S werkt alleen als je bestand in OneDrive staat.', correct: false, misconception: 'De sneltoets verwarren met automatisch opslaan, dat inderdaad OneDrive nodig heeft.' },
          { text: 'Automatisch opslaan werkt overal, ook als je op je bureaublad opslaat.', correct: false, misconception: 'Aannemen dat een handige functie altijd aanstaat, ongeacht waar je bestand staat.' }
        ],
        feedback: 'CTRL + S is je vangnet overal; automatisch opslaan is een extra dat alleen in OneDrive bestaat. Juist als je niet in OneDrive werkt, is die sneltoets het belangrijkst.',
        leerdoel: 'Je kunt een Word-document maken, een duidelijke naam geven en op de juiste plek opslaan.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Hoe kun je een voorblad invoegen?',
        type: 'meerkeuze',
        options: [
          { text: 'Naar Indeling gaan in de werkbalk, op Voorblad klikken en uit het menu een voorblad kiezen.', correct: false, misconception: 'Denken dat alles wat met de opbouw van je pagina te maken heeft onder Indeling staat.' },
          { text: 'Naar Ontwerpen gaan in de werkbalk, op Voorblad klikken en uit het menu een voorblad kiezen.', correct: false, misconception: 'Het voorblad zien als vormgeving, omdat je een mooie stijl uitkiest.' },
          { text: 'Naar Invoegen gaan in de werkbalk, op Voorblad klikken en uit het menu een voorblad kiezen.', correct: true, explanation: 'De knop Voorblad staat helemaal links op het tabblad Invoegen, want je voegt een hele pagina toe aan je document.' },
          { text: 'Naar Bestand gaan in de werkbalk en daar Nieuw voorblad kiezen.', correct: false, misconception: 'Bestand zien als het menu waarin alles moet staan wat met de hele pagina te maken heeft.' }
        ],
        feedback: 'Indeling en Ontwerpen gaan over de vorm van een pagina die er al is. Een voorblad zet je er juist bij, dus dat gaat via Invoegen.',
        leerdoel: 'Je kunt een automatisch voorblad invoegen en invullen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Waar in de werkbalk van Word vind je de knop om paginanummers toe te voegen?',
        type: 'meerkeuze',
        options: [
          { text: 'Onder Verwijzingen, want die verwijzen naar pagina\'s.', correct: false, misconception: 'Paginanummer verwarren met inhoudsopgave, omdat beide met pagina\'s te maken hebben.' },
          { text: 'Onder Invoegen, en dan Paginanummer met een plek naar keuze.', correct: true, explanation: 'Alles wat je aan je document toevoegt, zoals voorblad, afbeelding en paginanummer, staat onder Invoegen.' },
          { text: 'Onder Bestand, samen met opslaan en afdrukken.', correct: false, misconception: 'Bestand zien als algemeen menu waar alles in zou moeten staan.' },
          { text: 'Onder Ontwerpen, omdat het bij de vormgeving van de pagina hoort.', correct: false, misconception: 'De plek van de nummers verwarren met opmaak in plaats van met toevoegen.' }
        ],
        feedback: 'Onthoud de regel achter het tabblad: voeg je iets toe aan je document, dan sta je onder Invoegen.',
        leerdoel: 'Je kunt tekst dikgedrukt, schuin of onderstreept maken en paginanummers toevoegen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Welke rij koppelt alle vier de sneltoetsen aan de goede handeling?',
        type: 'meerkeuze',
        options: [
          { text: 'CTRL + S onderstreept, CTRL + B slaat op, CTRL + i maakt dik, CTRL + U maakt schuin.', correct: false, misconception: 'De vier sneltoetsen kennen maar de handelingen willekeurig door elkaar halen.' },
          { text: 'CTRL + S slaat op, CTRL + B maakt dik, CTRL + i maakt schuin, CTRL + U onderstreept.', correct: true, explanation: 'Elke letter is de eerste letter van het Engelse woord: save, bold, italic en underline.' },
          { text: 'CTRL + S maakt schuin, CTRL + B onderstreept, CTRL + i slaat op, CTRL + U maakt dik.', correct: false, misconception: 'De S met schuin verbinden omdat beide woorden in het Nederlands met een s beginnen.' },
          { text: 'CTRL + S slaat op, CTRL + B maakt schuin, CTRL + i maakt dik, CTRL + U onderstreept.', correct: false, misconception: 'De B van bold en de i van italic omdraaien.' }
        ],
        feedback: 'Vertaal de letter en je hebt het antwoord: save, bold, italic, underline. De Nederlandse woorden helpen je hier juist niet.',
        leerdoel: 'Je kunt tekst dikgedrukt, schuin of onderstreept maken en paginanummers toevoegen.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Welke stap zorgt ervoor dat een hoofdstuktitel in de automatische inhoudsopgave terechtkomt?',
        type: 'meerkeuze',
        options: [
          { text: 'De titel groot en vet maken met CTRL + B.', correct: false, misconception: 'Denken dat de vormgeving het label vervangt.' },
          { text: 'De titel selecteren en op Start de stijl Kop 1 kiezen.', correct: true, explanation: 'De inhoudsopgave zoekt naar de labels Kop 1 en Kop 2, niet naar hoe iets eruitziet.' },
          { text: 'De titel bovenaan een nieuwe pagina zetten met CTRL + ENTER.', correct: false, misconception: 'De regel over nieuwe pagina\'s verwarren met de kopstijl.' },
          { text: 'Een paginanummer onder de titel invoegen.', correct: false, misconception: 'Denken dat de inhoudsopgave op paginanummers zoekt in plaats van op koppen.' }
        ],
        feedback: 'Stijl vóór opmaak: pas als er Kop 1 op staat, kan Word de titel vinden en in de lijst zetten.',
        leerdoel: 'Je kunt tekst opmaken met de stijlen Kop 1 en Kop 2.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Hoe voeg je een automatische inhoudsopgave in, en hoe zorg je dat hij daarna blijft kloppen?',
        type: 'meerkeuze',
        options: [
          { text: 'Via Verwijzingen en Inhoudsopgave, en na een wijziging via Inhoudsopgave bijwerken met de keuze Hele inhoudsopgave bijwerken.', correct: true, explanation: 'De lijst is een momentopname van het moment van invoegen, dus na elke wijziging geef je zelf de opdracht om hem opnieuw op te bouwen.' },
          { text: 'Via Invoegen en Inhoudsopgave; daarna houdt Word de lijst zelf bij, ook als je later hoofdstukken toevoegt.', correct: false, misconception: 'Denken dat automatisch betekent dat de lijst ook zichzelf blijft bijhouden.' },
          { text: 'Via Start en het vakje Stijlen; Word zet de lijst dan onderaan je document.', correct: false, misconception: 'De plek van de kopstijlen verwarren met de plek van de inhoudsopgave zelf.' },
          { text: 'Via Ontwerpen en Inhoudsopgave; bijwerken hoeft daarna nooit meer.', correct: false, misconception: 'De inhoudsopgave als vormgeving zien in plaats van als verwijzing naar plekken.' }
        ],
        feedback: 'Het woord automatisch slaat op het ophalen van de koppen, niet op het onderhoud. Dat laatste blijft twee klikken van jou.',
        leerdoel: 'Je kunt een automatische inhoudsopgave invoegen en bijwerken.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Leg uit waarom een verslag met koppen overzichtelijker is dan hetzelfde verslag zonder koppen. Noem de winst voor de lezer én voor de schrijver.',
        type: 'open',
        modelAnswer: 'Voor de lezer zijn koppen wegwijzers: hij ziet waar een nieuw onderdeel begint en kan met de inhoudsopgave meteen naar de goede pagina. Zonder koppen moet hij alles doorbladeren. Voor de schrijver is de winst dat Word de kopstijlen herkent en er zelf een inhoudsopgave met paginanummers van maakt. Zonder koppen moet je die lijst met de hand typen en na elke wijziging alle nummers zelf nalopen.',
        nakijkpunten: [
          'Noemt voor de lezer overzicht, structuur of sneller iets terugvinden.',
          'Noemt voor de schrijver dat Word de inhoudsopgave zelf opbouwt uit de kopstijlen.',
          'Legt uit wat er misgaat zonder koppen, bijvoorbeeld alle paginanummers met de hand bijhouden.'
        ],
        feedback: 'Koppen doen twee dingen tegelijk: ze wijzen de lezer de weg en ze geven het programma iets om mee te werken. Alleen vet maken doet geen van beide.',
        leerdoel: 'Je weet waarom koppen je verslag overzichtelijk maken.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren'
      },
      {
        // RONDE 4 (r12). Dit item was bijna woordelijk hetzelfde als de vraag in de
        // tussentoets van 4.3 ("In welke volgorde vind je op Google...") met vier
        // grotendeels gelijke opties. Als tweede meetmoment leverde dat niets
        // nieuws op. Het is nu een beoordelingssituatie: vier klasgenoten pakken
        // het anders aan en je kiest wie het goed doet. Zelfde leerdoel, andere
        // vorm, en de Nederlandse menunamen Filter en Gebruiksrechten in plaats
        // van Tools en usage rights, zoals ze op de Google-hulppagina staan.
        prompt: 'Vier klasgenoten zoeken beeld voor hun verslag. Wie heeft het goed aangepakt?',
        type: 'meerkeuze',
        options: [
          { text: 'Nour typt haar zoekwoord, opent meteen Filter en klikt daarna pas op Afbeeldingen.', correct: false, misconception: 'Filter openen voordat de resultaten op afbeeldingen staan, waardoor Gebruiksrechten er nog niet bij staat.' },
          { text: 'Sam typt zijn zoekwoord, klikt op Afbeeldingen, opent Filter en zet Gebruiksrechten op Creative Commons-licenties.', correct: true, explanation: 'Gebruiksrechten, in het Engels usage rights, bestaat alleen binnen de afbeeldingsresultaten. Afbeeldingen komt dus altijd vóór Filter.' },
          { text: 'Tim kiest het mooiste plaatje uit de gewone zoekresultaten en zet er een bronregel onder.', correct: false, misconception: 'Denken dat een bronregel de toestemming vervangt in plaats van hem aanvult.' },
          { text: 'Iris slaat drie plaatjes op en mailt daarna de makers of het mocht.', correct: false, misconception: 'Toestemming achteraf regelen terwijl je hem vooraf met één filter kunt afdwingen.' }
        ],
        feedback: 'Drie van de vier regelen de toestemming te laat of op de verkeerde plek. Het filter zit niet in de gewone zoekresultaten, alleen bij Afbeeldingen.',
        leerdoel: 'Je kunt op Google zoeken naar afbeeldingen met een Creative Commons-licentie.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Je hebt een afbeelding ingevoegd, maar je alinea valt uit elkaar. Wat is de eerste stap?',
        type: 'meerkeuze',
        options: [
          { text: 'De afbeelding weghalen en op een eigen lege pagina zetten.', correct: false, misconception: 'Het probleem ontwijken in plaats van de instelling gebruiken die er juist voor bedoeld is.' },
          { text: 'Op de afbeelding klikken en in het menu indelingsopties kiezen hoe de tekst eromheen loopt.', correct: true, explanation: 'Zonder indelingsoptie behandelt Word je plaatje als één gigantische letter midden in je zin.' },
          { text: 'De tekst eromheen kleiner maken tot het weer past.', correct: false, misconception: 'De lettergrootte aanpassen om een plaatsingsprobleem op te lossen.' },
          { text: 'De afbeelding met de witte puntjes zo klein maken dat hij tussen twee regels past.', correct: false, misconception: 'Het formaat wel kennen maar denken dat dat ook de plaatsing regelt.' }
        ],
        feedback: 'Eerst de indelingsoptie, dan pas het formaat. Het icoontje dat naast je afbeelding verschijnt is de ingang naar dat menu.',
        leerdoel: 'Je kunt een afbeelding invoegen in Word en netjes bij je tekst plaatsen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Mag je teksten van internet zomaar overnemen in je verslag?',
        type: 'meerkeuze',
        options: [
          { text: 'Ja, alles wat op internet staat is gratis te gebruiken.', correct: false, misconception: 'Vrij te vinden aanzien voor vrij te gebruiken, precies dezelfde denkfout als bij afbeeldingen.' },
          { text: 'Ja, zolang je de tekst maar in een ander lettertype zet.', correct: false, misconception: 'Denken dat een uiterlijke verandering iets aan het eigendom verandert.' },
          { text: 'Nee, je schrijft ze in je eigen woorden over en noemt bij grote stukken de bron.', correct: true, explanation: 'Bij tekst kun je in je eigen woorden herschrijven; bij een afbeelding kan dat niet, en dan heb je vooraf een licentie nodig.' },
          { text: 'Nee, je mag helemaal niets van internet gebruiken voor je schoolwerk, ook niet als je de bron erbij zet.', correct: false, misconception: 'De regel als een totaalverbod lezen in plaats van als een afspraak over hoe je iets overneemt.' }
        ],
        feedback: 'Dezelfde grondregel als bij beeld: iemand anders heeft het gemaakt. Het verschil is dat je een tekst wél kunt herschrijven en een plaatje niet.',
        leerdoel: 'Je weet waarom je niet zomaar elke afbeelding van internet mag gebruiken.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Welke tabel is goed opgezet in Excel?',
        type: 'meerkeuze',
        options: [
          { text: 'Elke rij een dag, achter elk getal het woord stappen, en geen kopregel erboven.', correct: false, misconception: 'De eenheid bij elk getal zetten voor de duidelijkheid, waardoor Excel de cellen als tekst leest.' },
          { text: 'Een kopregel met Dag en Aantal stappen, en tussen de dagen steeds een lege rij voor het overzicht en de rust.', correct: false, misconception: 'Lege rijen gebruiken als witruimte, terwijl Excel daardoor denkt dat je tabel ophoudt.' },
          { text: 'Een kopregel met Dag en Aantal stappen, daaronder per rij één dag en in de tweede kolom kale getallen.', correct: true, explanation: 'Een kopregel legt uit wat de kolom betekent, en kale getallen zijn het enige waarmee elke functie kan rekenen.' },
          { text: 'Alle zeven getallen naast elkaar in één rij, zonder koppen, want dat leest sneller.', correct: false, misconception: 'Denken dat de vorm vrij is, terwijl formules, sorteren en grafieken allemaal op kolommen met een kop rekenen.' }
        ],
        feedback: 'Een tabel is een afspraak: de kop zegt wat de kolom betekent en de cellen eronder bevatten alleen het getal zelf. Lege rijen breken die afspraak.',
        leerdoel: 'Je kunt gegevens netjes in een tabel zetten in Excel.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Wat typ je in Excel om de getallen in B2 tot en met B8 bij elkaar op te tellen?',
        type: 'meerkeuze',
        options: [
          { text: 'SOM B2 B8', correct: false, misconception: 'De functienaam wel kennen maar het isgelijkteken en de haakjes vergeten.' },
          { text: 'B2+B8', correct: false, misconception: 'Denken dat een plusteken tussen twee celadressen ook alle cellen ertussen meetelt, terwijl het er precies twee optelt.' },
          { text: '=SOM(B2:B8)', correct: true, explanation: 'Het isgelijkteken start de berekening en B2:B8 is het celbereik waarover de functie rekent.' },
          { text: '=GEMIDDELDE(B2:B8)', correct: false, misconception: 'De twee functies verwisselen omdat ze er hetzelfde uitzien.' }
        ],
        feedback: 'Drie dingen moeten kloppen: het isgelijkteken, de functienaam en het celbereik tussen haakjes.',
        leerdoel: 'Je kunt met een eenvoudige formule optellen en een gemiddelde berekenen.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Waarom selecteer je bij het maken van een grafiek ook de kopregel en de eerste kolom mee?',
        type: 'meerkeuze',
        options: [
          { text: 'Omdat je grafiek daaruit de namen langs de assen en in de legenda haalt.', correct: true, explanation: 'Zonder die namen staan er alleen nummers langs je as, en dan klopt je grafiek wel maar zegt hij niets.' },
          { text: 'Omdat Excel anders weigert een grafiek te maken en je een foutmelding geeft over je selectie.', correct: false, misconception: 'Denken dat het programma het afdwingt, terwijl het gewoon een grafiek zonder namen maakt.' },
          { text: 'Omdat de grafiek dan mooier gekleurd wordt.', correct: false, misconception: 'Een inhoudelijke reden verwarren met vormgeving.' },
          { text: 'Omdat je formules anders niet meer meeveranderen.', correct: false, misconception: 'De grafiek verwarren met de berekening; die twee staan los van elkaar.' }
        ],
        feedback: 'Een grafiek zonder namen langs de assen is een plaatje zonder betekenis. Kies daarom bewust wat je selecteert voordat je op Invoegen klikt.',
        leerdoel: 'Je kunt van je tabel een grafiek maken en die aflezen.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Welk Microsoft Office-programma gebruik je voor het maken van presentaties?',
        type: 'meerkeuze',
        options: [
          { text: 'Word', correct: false, misconception: 'Word kiezen omdat je daar ook tekst en plaatjes op een pagina kunt zetten.' },
          { text: 'PowerPoint', correct: true, explanation: 'PowerPoint maakt reeksen dia\'s voor een publiek dat luistert terwijl jij vertelt.' },
          { text: 'OneDrive', correct: false, misconception: 'OneDrive voor een programma aanzien, terwijl het de plek is waar je je bestanden bewaart.' },
          { text: 'Excel', correct: false, misconception: 'Excel kiezen omdat je er grafieken mee maakt die ook in presentaties voorkomen.' }
        ],
        feedback: 'Vier namen, vier taken: Word voor tekst, Excel voor getallen, PowerPoint voor presentaties en OneDrive voor opslag.',
        leerdoel: 'Je kunt uitleggen waarvoor je PowerPoint gebruikt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Welke rij koppelt dia, tekstvak en overgang aan de goede uitleg?',
        type: 'meerkeuze',
        options: [
          { text: 'Dia: de plek waar je tekst invoegt. Tekstvak: één pagina. Overgang: de achtergrondkleur van je dia.', correct: false, misconception: 'Dia en tekstvak omdraaien omdat je op allebei tekst ziet staan.' },
          { text: 'Dia: het effect tussen twee bladen. Tekstvak: één pagina van je presentatie. Overgang: de plek waar je je tekst invoegt.', correct: false, misconception: 'De drie begrippen kennen maar ze in een willekeurige volgorde aan de uitleg plakken.' },
          { text: 'Dia: één pagina van je presentatie. Tekstvak: de plek waar je tekst invoegt. Overgang: het effect om van de ene dia naar de andere te gaan.', correct: true, explanation: 'Elk begrip heeft een eigen plek in het programma: Nieuwe dia, Invoegen en Tekstvak, en het tabblad Overgangen.' },
          { text: 'Dia: één pagina. Tekstvak: het effect tussen twee dia\'s. Overgang: de plek waar je tekst invoegt.', correct: false, misconception: 'Tekstvak en overgang verwisselen omdat beide woorden bij de basisfuncties horen.' }
        ],
        feedback: 'Denk aan waar je ze vindt: een dia maak je met Nieuwe dia, een tekstvak via Invoegen en een overgang op een eigen tabblad.',
        leerdoel: "Je kunt dia's toevoegen met tekstvakken en afbeeldingen.",
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Vergelijk twee presentaties. Op de eerste heeft elke dia een ander effect: draaien, exploderen, vliegen. Op de tweede staat op alle dia\'s dezelfde rustige overgang. Leg uit welke keuze het verhaal ondersteunt, en noem de twee plekken waar je achtergrond en overgang instelt.',
        type: 'open',
        modelAnswer: 'De tweede keuze ondersteunt het verhaal. Een overgang hoort de sprong tussen twee dia\'s rustig te maken, zodat de aandacht bij de spreker blijft. Bij een ander effect per dia gaat de aandacht naar het effect zelf en onthoudt het publiek niets van wat er verteld werd. De achtergrond en de kleuren stel ik in via het menu Ontwerpen, en de overgang zet ik op het tabblad Overgangen.',
        nakijkpunten: [
          'Kiest de presentatie met een rustige overgang en legt uit dat de aandacht bij de spreker hoort te blijven.',
          'Benoemt dat wisselende effecten de aandacht naar zichzelf toe trekken.',
          'Noemt Ontwerpen voor achtergrond en kleuren en het tabblad Overgangen voor de overgang.'
        ],
        feedback: 'Een presentatie is ondersteunend: alles wat de aandacht van jouw verhaal aftrekt, werkt tegen je. Kies daarom één achtergrond en één overgang en houd die vast.',
        leerdoel: 'Je kunt een achtergrond, kleuren en overgangen kiezen die je verhaal ondersteunen.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'Wat is de juiste volgorde van de stappen voor het maken van een presentatie?',
        type: 'meerkeuze',
        options: [
          { text: 'Overgangen zetten, lege presentatie kiezen, titeldia maken, inhoudsdia maken, dia\'s toevoegen, opslaan.', correct: false, misconception: 'Beginnen met een effect voordat er iets bestaat om het effect op te zetten.' },
          { text: 'Lege presentatie kiezen, titeldia maken, dia met inhoudsopgave maken, dia\'s toevoegen met informatie, overgangen zetten, presentatie opslaan.', correct: true, explanation: 'Eerst bouw je de presentatie op van voor naar achter, daarna volgt de afwerking en tot slot sla je op.' },
          { text: 'Titeldia maken, lege presentatie kiezen, dia\'s toevoegen, opslaan, inhoudsdia maken, overgangen zetten.', correct: false, misconception: 'Een dia willen maken voordat er een presentatie geopend is.' },
          { text: 'Lege presentatie kiezen, dia\'s toevoegen met informatie, titeldia maken, overgangen zetten, opslaan, inhoudsdia maken.', correct: false, misconception: 'De inhoudsdia aan het eind plakken in plaats van hem vooraan te zetten en gaandeweg aan te vullen.' }
        ],
        feedback: 'De inhoudsdia hoort vooraan te staan, maar je vult hem aan terwijl je dia\'s bedenkt. Zorg dat hij compleet is voor je inlevert.',
        leerdoel: 'Je kunt een presentatie maken met een titeldia, een inhoudsdia en een afsluitende dia.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        // RONDE 5. Hier stond de vraag "Wat zet je op je eerste dia?" - maar die
        // bronvraag staat al als eerste item in de afsluitquiz van 4.6, dus daar
        // mat de toets iets wat vlak ervoor al gemeten was. Op deze plek staat nu
        // de EISENLIJST van bronles 7. Die lijst noemt letterlijk "Plaatjes en
        // een video bevatten" en "Overgangen hebben tussen alle dia's", en die
        // twee eisen stonden in ronde 4 wel in de opdrachttekst van 4.6 maar in
        // geen enkel nakijkpunt en in geen enkel toetsitem. Een broneis die
        // nergens nagekeken wordt, is in de praktijk verdwenen.
        // RONDE 7: de prompt verwees de leerling naar "bronles 7". Dat is
        // bouwersvocabulaire: het Wikiwijs-arrangement van de docent heet in
        // HELIX 4.6, en een leerling kan geen bronles openen om na te gaan
        // welke vier eisen bedoeld worden. De eisen staan gewoon in de
        // opdracht van 4.6, dus daar wijst de prompt nu naartoe.
        prompt: 'De opdracht van 4.6 stelt vier eisen aan je eindpresentatie, naast de dia-indeling. Welke rij noemt ze alle vier goed?',
        type: 'meerkeuze',
        options: [
          { text: 'Korte teksten, goed leesbaar met genoeg contrast, plaatjes en een video, en overgangen tussen alle dia\'s.', correct: true, explanation: 'De video hoort er dus echt bij: bewegend beeld laat iets zien wat je met steekwoorden niet kunt uitleggen. De overgang moet tussen alle dia\'s staan, niet alleen tussen de eerste twee.' },
          { text: 'Korte teksten, goed leesbaar met genoeg contrast, plaatjes, en overgangen tussen alle dia\'s; een video is geen eis maar mag wel.', correct: false, misconception: 'De video als extraatje zien in plaats van als eis, omdat de andere drie makkelijker te maken zijn.' },
          { text: 'Lange teksten zodat je niets vergeet, plaatjes, een video, en een ander overgangseffect per dia.', correct: false, misconception: 'Denken dat volle dia\'s en wisselende effecten een presentatie rijker maken, terwijl ze de aandacht juist wegtrekken van je verhaal.' },
          { text: 'Korte teksten, plaatjes, een video, en minstens twee lettertypes zodat je dia\'s afwisselend blijven.', correct: false, misconception: 'Afwisseling in vormgeving aanzien voor een eis, terwijl de eis over leesbaarheid en contrast gaat.' }
        ],
        feedback: 'Loop je presentatie voor het inleveren nog een keer na langs deze vier eisen. De video en de overgangen worden het vaakst vergeten, en juist die twee staan in je nakijkpunten.',
        leerdoel: 'Je kunt een presentatie maken met een titeldia, een inhoudsdia en een afsluitende dia.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Waarom moet een presentatie kort en bondig zijn qua tekst en genoeg contrast hebben?',
        type: 'meerkeuze',
        options: [
          { text: 'Omdat een beamer maar een beperkt aantal woorden per dia kan weergeven zonder dat de tekst vervaagt.', correct: false, misconception: 'Een didactische regel voor een technische beperking aanzien.' },
          { text: 'Omdat je publiek niet tegelijk kan lezen en luisteren, en donker op donker op afstand wegvalt.', correct: true, explanation: 'Lappen tekst laten je klas meelezen in plaats van luisteren, en te weinig kleurverschil maakt je dia achterin het lokaal onleesbaar.' },
          { text: 'Omdat lange teksten je bestand te groot maken om in te leveren.', correct: false, misconception: 'Een leesbaarheidsprobleem verwarren met een bestandsgrootte.' },
          { text: 'Omdat de docent nu eenmaal liever weinig tekst ziet.', correct: false, misconception: 'De eis opvatten als een smaakvoorkeur in plaats van als iets wat met je publiek te maken heeft.' }
        ],
        feedback: 'Zet steekwoorden op de dia en vertel de hele zin er zelf bij. Controleer je contrast door vanaf de achterste rij naar je eigen dia te kijken.',
        leerdoel: 'Je kunt je tekst kort en goed leesbaar houden.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Noem twee dingen die je tijdens het presenteren zelf doet, los van wat er op je dia\'s staat, en leg per ding uit waarom het helpt.',
        type: 'open',
        modelAnswer: 'Ten eerste oefen ik mijn verhaal een keer hardop. Dan weet ik welke dia waar komt en hoef ik niet voor te lezen, waardoor ik rustiger praat. Ten tweede kijk ik af en toe mijn publiek aan in plaats van naar het scherm. Daardoor merk ik of ze me nog volgen en luisteren ze beter naar mij. Start er iets niet, bijvoorbeeld mijn video, dan vertel ik gewoon door, want ik ben de spreker en de dia is mijn hulpmiddel.',
        nakijkpunten: [
          'Noemt minstens twee concrete dingen, bijvoorbeeld hardop oefenen, publiek aankijken of zelf vertellen in plaats van voorlezen.',
          'Legt bij elk ding uit welk effect het op de spreker of op het publiek heeft.',
          'Laat blijken dat de presentatie ondersteunend is en het verhaal van de spreker komt.'
        ],
        feedback: 'Presenteren is meer dan dia\'s doorklikken. Wie hardop geoefend heeft en zijn publiek aankijkt, heeft de dia nog maar half nodig.',
        leerdoel: 'Je kunt je presentatie laten zien en er zelf bij vertellen.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'Beschrijf stap voor stap wat je doet vanaf het moment dat je je resultaat op het scherm ziet, tot je docent het bewijs heeft.',
        type: 'open',
        modelAnswer: 'Zodra het bewijs van deelname met mijn resultaat verschijnt, maak ik meteen een screenshot, want het scherm komt niet terug. Die screenshot sla ik op in OneDrive in de map Checkpoint hoofdstuk 4, samen met mijn Word-verslag, mijn Excel-bestand en mijn twee presentaties. Daarna schrijf ik er kort bij welke onderwerpen goed gingen en welke ik nog wil oefenen, en deel ik de map met mijn docent via ItsLearning.',
        nakijkpunten: [
          'Noemt het screenshot maken op het moment zelf, voordat het scherm wordt weggeklikt.',
          'Noemt opslaan in OneDrive in een map met een herkenbare naam.',
          'Noemt het delen met de docent, bijvoorbeeld via ItsLearning.'
        ],
        feedback: 'De volgorde is hier de hele opdracht: vastleggen, opbergen, delen. Sla je de eerste stap over, dan is de rest onmogelijk.',
        leerdoel: 'Je kunt je resultaat opslaan en delen met je docent.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren'
      },
      {
        // RONDE 5. De eerste vraag van de bron-eindtoets ("Wat is de belangrijkste
        // reden om een veilig wachtwoord te gebruiken?", met de afleiders snel
        // inloggen, makkelijk onthouden en delen met anderen) bestond in HELIX
        // alleen als FEEDBACKZIN onder de vraag hieronder. De leerling
        // beantwoordde hem dus nooit; hij las het antwoord pas nadat hij een
        // andere vraag had ingevuld. Het is nu een eigen item met de drie
        // afleiders van de bron, en de feedback hieronder gaat weer over de
        // vraag waar hij bij staat.
        prompt: 'Wat is de belangrijkste reden om een veilig wachtwoord te gebruiken?',
        type: 'meerkeuze',
        options: [
          { text: 'Om snel in te kunnen loggen zonder dat je lang hoeft na te denken.', correct: false, misconception: 'Een wachtwoord zien als een drempel die zo laag mogelijk moet zijn, in plaats van als een slot.' },
          { text: 'Om je account te beschermen tegen mensen die er niets te zoeken hebben.', correct: true, explanation: 'Je wachtwoord is het slot op alles wat achter je account zit: je mail, je schoolwerk in OneDrive en je cijfers in SOMtoday.' },
          { text: 'Om je wachtwoord gemakkelijk te kunnen onthouden, want vergeten is het grootste risico.', correct: false, misconception: 'Onthoudbaarheid als het echte probleem zien; daar is juist een wachtwoordkluis voor.' },
          { text: 'Om je wachtwoord veilig met anderen te kunnen delen als dat een keer nodig is.', correct: false, misconception: 'Denken dat een sterk wachtwoord deelbaar wordt, terwijl een gedeeld wachtwoord per definitie geen slot meer is.' }
        ],
        feedback: 'Een wachtwoord doet maar één ding: het houdt anderen buiten. Snel inloggen, makkelijk onthouden en delen werken daar alle drie tegenin.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Wanneer is een wachtwoord een sterk wachtwoord?',
        type: 'meerkeuze',
        options: [
          { text: 'Als het makkelijk te onthouden is, zoals je eigen naam.', correct: false, misconception: 'Onthoudbaarheid als belangrijkste eis nemen, terwijl juist het raden dan makkelijk wordt.' },
          { text: 'Als het hetzelfde is als je andere wachtwoorden, want dan raak je het nooit kwijt.', correct: false, misconception: 'Denken dat één wachtwoord overal veilig is, terwijl één lek dan al je accounts opent.' },
          { text: 'Als het minimaal twaalf tekens heeft met hoofdletters, cijfers en symbolen.', correct: true, explanation: 'Lengte en variatie maken samen het aantal mogelijkheden zo groot dat raden of automatisch proberen niet loont.' },
          { text: 'Als het alleen uit cijfers bestaat, want cijfers zijn moeilijker dan letters.', correct: false, misconception: 'Denken dat één soort teken op zich al veilig is, terwijl het juist om de combinatie gaat.' }
        ],
        feedback: 'Twaalf tekens klinkt lang, maar drie woorden achter elkaar met een cijfer erin haal je die grens al. Verander je wachtwoorden bovendien regelmatig.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Welke zin over phishing klopt helemaal?',
        type: 'meerkeuze',
        options: [
          { text: 'Alleen mensen die weinig van computers weten worden slachtoffer, en je bank vraagt soms toch om je pincode.', correct: false, misconception: 'Denken dat oplichting alleen anderen overkomt, en aannemen dat een echte bank ook weleens naar je pincode vraagt.' },
          { text: 'Iedereen kan slachtoffer worden, instanties als banken vragen nooit per mail om een pincode, en je controleert de afzender of je belt het bedrijf zelf.', correct: true, explanation: 'Dit zijn de drie controles bij elkaar. Ook de overheid stuurt je nooit een mail waarin ze om wachtwoorden of pincodes vraagt. Kijk wie de afzender is en of dat klopt met het e-mailadres dat het bedrijf op zijn eigen website noemt; bellen mag ook.' },
          { text: 'Iedereen kan slachtoffer worden, maar controleren heeft geen zin, want een afzender kun je toch niet nakijken.', correct: false, misconception: 'De eerste regel wel kennen maar denken dat je zelf niets kunt doen, terwijl de afzender juist het makkelijkst te controleren onderdeel is.' },
          { text: 'Je herkent phishing altijd aan spelfouten, dus een nette mail is per definitie echt.', correct: false, misconception: 'Vertrouwen op één kenmerk, terwijl een verzorgde mail even goed nep kan zijn.' }
        ],
        feedback: 'Onthoud de twee vaste controles: vergelijk de afzender met het adres dat het bedrijf zelf op zijn website noemt, en bel het bedrijf als je twijfelt. Een pincode vraagt niemand ooit per mail.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Je krijgt een mail met het logo van je bank. De afzender is service@ing-beveiliging-nl.com, je wordt aangesproken met Beste klant, er staat dat je rekening binnen 24 uur wordt geblokkeerd, en er zit een knop bij om je gegevens te bevestigen. Waaraan zie je dat dit phishing is?',
        type: 'meerkeuze',
        options: [
          { text: 'Alleen aan de aanhef Beste klant; het afzenderadres, de haast en de vraag om gegevens kloppen hier gewoon.', correct: false, misconception: 'Eén signaal aanwijzen en de andere drie over het hoofd zien, terwijl juist de stapeling het beeld maakt.' },
          { text: 'Nergens aan; met een echt logo erbij is een mail te vertrouwen.', correct: false, misconception: 'Een logo aanzien voor een bewijs van echtheid, terwijl iedereen een logo kan kopiëren.' },
          { text: 'Aan de stapeling: een afzenderadres dat niet bij de bank hoort, een onpersoonlijke aanhef, haast met een dreiging, en een vraag om gegevens.', correct: true, explanation: 'Vergelijk het adres met wat de bank op zijn eigen website noemt. Haast, een dreiging en een vraag om gegevens via een knop zijn de drie andere vaste signalen.' },
          { text: 'Aan het feit dat de mail over geld gaat; berichten over geld zijn altijd nep.', correct: false, misconception: 'Een hele categorie berichten verdacht maken in plaats van de kenmerken van dit bericht te lezen.' }
        ],
        feedback: 'Loop bij twijfel altijd dezelfde vier dingen na: het echte afzenderadres, de aanhef, de haast en de vraag om gegevens. Klik niet in de mail zelf, maar ga naar de website die je zelf kent.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Waarom is het belangrijk om goed na te denken voordat je iets online deelt? Leg het uit met een voorbeeld van iets wat jij zelf niet zou posten.',
        type: 'open',
        modelAnswer: 'Alles wat je online zet kan lang blijven bestaan, ook nadat je het zelf verwijderd hebt. Anderen kunnen het intussen al gekopieerd of doorgestuurd hebben, en dan heb jij er geen controle meer over. Ik zou bijvoorbeeld geen foto van mijn rijbewijs of paspoort posten, want daar staan mijn volledige naam, mijn geboortedatum en een documentnummer op. Daarmee kan iemand zich voordoen als mij.',
        nakijkpunten: [
          'Noemt dat wat je online zet lang blijft bestaan, ook na verwijderen.',
          'Legt uit waarom je er daarna geen controle meer over hebt.',
          'Geeft een eigen voorbeeld van iets wat hij niet zou delen, met de reden erbij.'
        ],
        feedback: 'Verwijderen komt te laat: op het moment dat je op verzenden drukt, is het bericht al uit jouw handen. Denken doe je dus vooraf.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'Welke rij koppelt de onderdelen van je device aan de goede taak?',
        type: 'meerkeuze',
        options: [
          { text: 'Videokaart: je beeld. Geluidskaart: je geluid. Processor: zorgt dat taken snel en efficiënt worden uitgevoerd. Werkgeheugen: tijdelijke opslag.', correct: true, explanation: 'De namen verklappen de eerste twee: video hoort bij beeld en geluid bij geluid. De processor rekent, en het werkgeheugen houdt vast waar hij op dit moment mee bezig is.' },
          { text: 'Videokaart: je geluid. Geluidskaart: je beeld. Processor: bewaart je bestanden voor altijd. Werkgeheugen: voert de taken uit.', correct: false, misconception: 'Twee kaarten verwisselen waarvan de naam juist verklapt wat ze doen, en daarna ook processor en werkgeheugen omdraaien.' },
          { text: 'Videokaart: je beeld. Geluidskaart: je geluid. Werkgeheugen: bewaart je bestanden voor altijd. Processor: het programma dat je computer aanstuurt.', correct: false, misconception: 'Werkgeheugen aanzien voor permanente opslag en de processor verwarren met het besturingssysteem.' },
          { text: 'Videokaart, geluidskaart, processor en werkgeheugen zijn alle vier software, net als Word.', correct: false, misconception: 'Hardware en software door elkaar halen; Word is een programma van Microsoft om teksten te schrijven, de andere vier zijn onderdelen die je kunt vastpakken.' }
        ],
        feedback: 'Hardware zijn de onderdelen van je device en software zijn de programma\'s die erop draaien. Alleen het besturingssysteem stuurt beide aan; het startmenu is maar een onderdeel dat je daarin ziet.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        // RONDE 10. Bureaublad, taakbalk, startmenu en touchpad kwamen uit de
        // koppelvraag van bronles 8, maar leefden in HELIX alleen nog in ophaal-
        // opgave 3 van het formatieve oefenblok van 4.7. Dat blok geeft geen cijfer,
        // dus de vier begrippen werden nergens echt gemeten, terwijl videokaart,
        // geluidskaart, processor en werkgeheugen die stap hierboven wel maakten.
        // Het goede antwoord staat hier bewust achteraan en is niet de langste
        // optie: afleider 1 is langer.
        prompt: 'Welke rij koppelt bureaublad, taakbalk, startmenu en touchpad aan de goede omschrijving?',
        type: 'meerkeuze',
        options: [
          { text: 'Bureaublad: de balk onderaan. Taakbalk: je eerste scherm na het opstarten. Startmenu: het vlak dat je muis bedient. Touchpad: de lijst met je programma\'s.', correct: false, misconception: 'De vier omschrijvingen allemaal een plek opschuiven, omdat ze in dezelfde les naast elkaar stonden.' },
          { text: 'Bureaublad: de lijst met je programma\'s. Taakbalk: het vlak dat je muis bedient. Startmenu: je eerste scherm na het opstarten. Touchpad: de balk onderaan.', correct: false, misconception: 'Bureaublad en startmenu verwisselen omdat op allebei snelkoppelingen naar programma\'s staan.' },
          { text: 'Bureaublad, taakbalk en startmenu zijn alle drie hardware die je kunt vastpakken; alleen het touchpad is software.', correct: false, misconception: 'Hardware en software omdraaien: het touchpad is juist het enige van de vier dat je echt kunt aanraken.' },
          { text: 'Bureaublad: je eerste scherm na het opstarten. Taakbalk: de balk onderaan. Startmenu: de lijst met je programma\'s. Touchpad: het vlak dat je muis bedient.', correct: true, explanation: 'Het bureaublad zie je meteen na het opstarten en daar zet je je snelkoppelingen neer. Op de taakbalk onderaan pin je belangrijke programma\'s vast, het startmenu opent vanaf de Startknop, en het touchpad ligt onder je toetsenbord.' }
        ],
        feedback: 'Twee namen verklappen zichzelf: een balk heet taakbalk en een menu heet startmenu. Het touchpad is als enige van de vier iets wat je met je vinger aanraakt.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        // RONDE 4 (r12). Drie brondefinities uit les 8 stonden nergens in de toets
        // als GOED antwoord. "Programma dat hardware en software aanstuurt" en
        // "Bijwerken van software en stuurprogramma's" komen uit koppelvraag 3;
        // "Word is een programma van Microsoft om teksten te schrijven" komt uit
        // invulvraag 35. Ze leefden alleen in het formatieve ophaalblok van 4.7,
        // dat geen cijfer geeft, en verder als afleider of als misvattingtekst.
        // Ronde 10 deed dit al voor bureaublad, taakbalk, startmenu en touchpad.
        // Bewust één item in plaats van drie: de toets telt al 37 items, en deze
        // drie horen bij elkaar omdat ze alle drie de vraag beantwoorden welk
        // stuk software welke taak doet. De opties blijven onder de 25 woorden.
        // Het goede antwoord staat op plek 3 en is niet de langste; optie 3 is
        // even lang als optie 1.
        prompt: 'Welke rij koppelt besturingssysteem, updates en Word alle drie goed?',
        type: 'meerkeuze',
        options: [
          { text: 'Het besturingssysteem zorgt voor tijdelijke opslag, updates maken je device elke keer trager, en Word is een programma van Microsoft om teksten te schrijven.', correct: false, misconception: 'Het besturingssysteem verwarren met het werkgeheugen en updates zien als ballast.' },
          { text: 'Het besturingssysteem is het menu met al je programma\'s, updates zijn apps die je koopt, en Word is de map met je verslagen.', correct: false, misconception: 'Alle drie de begrippen invullen met het dichtstbijzijnde beeld van je scherm: een menu, een winkel en een map.' },
          { text: 'Het besturingssysteem stuurt hardware en software aan, updates zijn het bijwerken van software en stuurprogramma\'s, en Word is van Microsoft om teksten te schrijven.', correct: true, explanation: 'Het besturingssysteem is de brug tussen het apparaat en je programma\'s. Updates houden juist dat systeem en die stuurprogramma\'s bij de tijd, en Word is er een programma bovenop.' },
          { text: 'Het besturingssysteem stuurt hardware en software aan, updates zijn het bijwerken van software, en Word is het besturingssysteem van je laptop.', correct: false, misconception: 'De eerste twee goed hebben maar Word aanzien voor het systeem zelf in plaats van voor een programma erop.' }
        ],
        feedback: 'Eén laag stuurt het apparaat aan, één laag houdt dat systeem bij de tijd, en daar bovenop draaien programma\'s als Word. Updates gaan dus niet over Word alleen.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        // RONDE 5. Dit item beantwoordt nu twee bronvragen tegelijk: het voorbeeld
        // van identiteitsfraude (de naam-en-foto-op-WhatsApp-vraag) en de
        // koppelvraag cybercrimineel / phishing / twee-staps-verificatie /
        // identiteitsfraude. Die koppelvraag stond in ronde 4 alleen in de
        // startcheck, en die is in ronde 5 teruggebracht tot drie items.
        prompt: 'Iemand gebruikt jouw naam en foto op WhatsApp en doet zich voor als jou om geld te stelen. Hoe heet dat, en welke rij koppelt de vier begrippen goed?',
        type: 'meerkeuze',
        options: [
          { text: 'Dat is phishing. Cybercrimineel: een gestolen account. Identiteitsfraude: een nepbericht dat echt lijkt. Twee-staps-verificatie: een extra wachtwoord dat je zelf verzint.', correct: false, misconception: 'Elk begrip een plek opschuiven omdat ze alle vier in dezelfde les langskwamen.' },
          { text: 'Dat is identiteitsfraude. Cybercrimineel: de dader die online je gegevens steelt. Phishing: een manier om die gegevens te stelen. Twee-staps-verificatie: extra bescherming met een app of een sms.', correct: true, explanation: 'Drie van de vier begrippen horen bij de dader; alleen twee-staps-verificatie staat aan jouw kant. Phishing is het middel, identiteitsfraude is wat iemand met de buit doet.' },
          { text: 'Dat is een datalek. Cybercrimineel: een virus op je laptop. Phishing: iemand die meekijkt op je scherm. Twee-staps-verificatie: een tweede wachtwoord bij dezelfde site.', correct: false, misconception: 'De begrippen invullen op gevoel, waarbij elk woord aan het dichtstbijzijnde alledaagse beeld wordt gekoppeld.' },
          { text: 'Dat is identiteitsfraude. Cybercrimineel: de dader. Phishing: een manier om gegevens te stelen. Twee-staps-verificatie: de bevestigingsmail na een bestelling.', correct: false, misconception: 'De eerste drie goed hebben maar twee-staps-verificatie verwarren met elke mail die je na het inloggen of bestellen krijgt.' }
        ],
        feedback: 'Bij identiteitsfraude wordt jouw naam iemands gereedschap. Let bij de laatste twee opties goed op: alleen een extra stap bij het INLOGGEN is twee-staps-verificatie.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        // RONDE 5. Bronvraag 16 uit les 8: "Waarom denk jij dat het niet zo goed is
        // voor je laptop om hem altijd in de oplader te houden?" Die bestond in
        // HELIX alleen als zin in de uitleg onder een startcheckitem, samen met de
        // twee andere gewoontes uit de bron (geen rare programma's downloaden,
        // regelmatig updaten, en niet zomaar diep in je instellingen rommelen).
        // Nu is het een item met de afleider van de bron erbij.
        prompt: 'Welke gewoonte is goed voor je laptop, en welke uitleg klopt daarbij?',
        type: 'meerkeuze',
        options: [
          { text: 'Laat je laptop niet altijd in de oplader hangen, want een apparaat dat constant wordt opgeladen kan oververhit raken.', correct: true, explanation: 'Haal hem er dus af als hij vol is. Update daarnaast regelmatig, download geen rare programma\'s en blijf van instellingen af die je niet kent.' },
          { text: 'Laat je laptop juist altijd in de oplader hangen, want een apparaat dat wordt opgeladen werkt trager en dat is beter voor de accu.', correct: false, misconception: 'De afleider uit de bron: denken dat opladen de snelheid beïnvloedt in plaats van de warmte.' },
          { text: 'Pas gerust diep in je instellingen dingen aan, want daarmee maak je je laptop sneller dan de fabrikant hem heeft ingesteld.', correct: false, misconception: 'Denken dat je zelf altijd meer uit een apparaat kunt halen, terwijl je er juist schade mee kunt doen.' },
          { text: 'Update je laptop hooguit één keer per jaar, want elke update maakt hem trager en vult je opslag verder op.', correct: false, misconception: 'Updates zien als ballast in plaats van als het dichtzetten van gaten die anderen kunnen gebruiken.' }
        ],
        feedback: 'Warmte is de vijand van een accu. De drie andere gewoontes horen erbij: regelmatig updaten, geen rare programma\'s downloaden en van onbekende instellingen afblijven.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        // RONDE 5. Bronvraag 31 uit les 8: "Kun je alles geloven wat op internet
        // staat?" Ook die stond alleen in de uitleg onder een startcheckitem.
        prompt: 'Alles wat op internet staat, kun je geloven.',
        type: 'waar-niet-waar',
        options: [
          { text: 'Waar', correct: false, misconception: 'Denken dat iets wat gepubliceerd is ook gecontroleerd is, omdat het er net zo uitziet als een echt nieuwsbericht.' },
          { text: 'Niet waar', correct: true, explanation: 'Iedereen mag alles op internet zetten en niemand controleert dat vooraf. Je kijkt dus zelf wie het geschreven heeft en of een tweede bron hetzelfde zegt.' }
        ],
        feedback: 'Dit hoort bij digitale weerbaarheid: je gelooft niet zomaar wat je leest, maar zoekt uit wie het zegt. Dezelfde regel gebruik je later bij nepnieuws.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        // RONDE 5. De losse vraag "Wat betekent digitale weerbaarheid?" is in dit
        // item opgegaan, zodat de toets niet groeit terwijl er drie bronvragen
        // bij komen. Alle drie de begrippen van de bron zijn nog steeds nodig om
        // het goede antwoord te kunnen kiezen, en elke afleider zet er precies
        // een fout.
        prompt: 'Wat betekenen veilig internetten, digitale weerbaarheid en een omgangsregel?',
        type: 'meerkeuze',
        options: [
          { text: 'Veilig internetten: alleen op je eigen computer internetten. Weerbaarheid: je device kan tegen een stootje. Omgangsregel: een regel over hoe lang je online mag zijn.', correct: false, misconception: 'Alle drie de begrippen aan een apparaat of aan een tijdslimiet koppelen in plaats van aan je eigen gedrag.' },
          { text: 'Veilig internetten: geen sociale media gebruiken. Weerbaarheid: snel kunnen typen en met elk programma kunnen werken. Omgangsregel: de schoolregel over telefoons.', correct: false, misconception: 'Veiligheid gelijkstellen aan vermijden, weerbaarheid aan handigheid met een computer, en omgangsregels aan het schoolreglement.' },
          { text: 'Veilig internetten: jezelf en je gegevens beschermen tijdens het online zijn. Weerbaarheid: jezelf beschermen tegen wat online niet veilig is. Omgangsregel: hoe je met elkaar omgaat.', correct: true, explanation: 'De eerste twee gaan over jouw gegevens: veilig internetten is wat je doet, weerbaarheid is wat je daardoor kunt. Een omgangsregel gaat over hoe je je gedraagt tegenover anderen en geldt ook op sociale media.' },
          { text: 'Veilig internetten: je wachtwoorden op papier bewaren. Weerbaarheid: zo min mogelijk online komen. Omgangsregel: een afspraak met je provider.', correct: false, misconception: 'Een wachtwoord op papier voor veilig aanzien en weerbaarheid opvatten als wegblijven in plaats van als jezelf kunnen redden.' }
        ],
        feedback: 'Deze drie horen bij elkaar. De eerste twee beschermen jou tegen anderen, de derde beschermt anderen tegen jou.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        // RONDE 11. Vier bronvragen uit de eindtoets van les 8 leefden in
        // hoofdstuk 4 alleen in het ophaalblok van 4.7. Dat blok geeft geen
        // cijfer, dus die vier werden nergens gemeten terwijl de externe
        // eindtoets ze wel stelt. Ronde 5, 6, 8 en 10 repareerden precies dit
        // patroon al vier keer voor andere bronvragen; deze vier waren de laatste.
        // Ze staan hier bij elkaar en achter de andere items van het brede
        // toetsleerdoel, zodat de toets per gebied leesbaar blijft.
        // Dit is bronvraag 1 van les 8, de koppelvraag over de drie schoolsystemen.
        prompt: 'Welke rij koppelt Outlook, SOMtoday en ItsLearning aan de goede beschrijving?',
        type: 'meerkeuze',
        options: [
          { text: 'Outlook is voor je rooster en je cijfers, SOMtoday voor e-mail, en ItsLearning voor opdrachten en lesmateriaal.', correct: false, misconception: 'De eerste twee systemen omdraaien, omdat je in allebei inlogt met hetzelfde schoolaccount.' },
          { text: 'Outlook is voor e-mail, SOMtoday voor je rooster en je cijfers, en ItsLearning voor opdrachten en lesmateriaal.', correct: true, explanation: 'Drie systemen, drie taken: mail, rooster en lesmateriaal. Je bestanden staan daar los van, want die bewaar je in OneDrive.' },
          { text: 'Outlook is voor opdrachten en lesmateriaal, SOMtoday voor e-mail, en ItsLearning voor je rooster en je cijfers.', correct: false, misconception: 'Alle drie de systemen een plek opschuiven, omdat ze op hetzelfde startscherm naast elkaar staan.' },
          { text: 'Outlook is voor e-mail, SOMtoday voor opdrachten en lesmateriaal, en ItsLearning voor je rooster en je cijfers.', correct: false, misconception: 'De leeromgeving en het cijferplatform verwisselen, omdat je in beide iets over school terugvindt.' }
        ],
        feedback: 'Onthoud waar je iets zoekt: een bericht in Outlook, een cijfer in SOMtoday, een opdracht in ItsLearning. Je bestanden zelf staan in OneDrive.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        // Bronvraag 4 van les 8. De drie afleiders van de bron staan er nog,
        // aangevuld met een vierde die digitale geletterdheid verwart met
        // handigheid, want dat is de misvatting die leerlingen zelf noemen.
        prompt: 'Wat betekent digitale geletterdheid?',
        type: 'meerkeuze',
        options: [
          { text: 'Dat je in geheimtaal kunt schrijven, zodat anderen jouw berichten onderweg niet kunnen meelezen.', correct: false, misconception: 'Het woord geletterd letterlijk nemen als iets met letters en codes.' },
          { text: 'Dat je de tijd kunt aflezen van een digitale klok in plaats van van een klok met wijzers.', correct: false, misconception: 'Digitaal opvatten als het tegenovergestelde van analoog, los van wat geletterdheid betekent.' },
          { text: 'Dat je veilig kunt omgaan met het internet op je laptop, telefoon of een ander digitaal device.', correct: true, explanation: 'Het gaat om veilig omgaan, en dat geldt op elk device. Je telefoon valt er dus net zo goed onder als je schoollaptop.' },
          { text: 'Dat je snel kunt typen en met elk programma op je device meteen overweg kunt zonder hulp.', correct: false, misconception: 'Geletterdheid gelijkstellen aan handigheid met een computer in plaats van aan veilig gedrag.' }
        ],
        feedback: 'Let op het woord veilig in het goede antwoord. Snel kunnen typen is handig, maar het houdt je gegevens niet heel.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        // Bronvraag 6 van les 8, met de twee afleiders van de bron erbij.
        prompt: 'Waarom leer je digitale vaardigheden?',
        type: 'meerkeuze',
        options: [
          { text: 'Zodat ik mijzelf en mijn gegevens veilig houd op internet, mijn schoolwerk beter doe en weet wat online echt is.', correct: true, explanation: 'Dat zijn de drie lijnen van dit vak: veiligheid, schoolwerk en kritisch kijken. Ze komen alle drie dit jaar terug.' },
          { text: 'Zodat ik goed kan leren typen en gamen, want daar heb ik later op mijn werk en thuis het meeste aan.', correct: false, misconception: 'De afleider uit de bron: het vak zien als bediening leren in plaats van als veilig en verstandig handelen.' },
          { text: 'Zodat ik precies weet welke laptop het duurst is en welk merk ik het beste kan kopen voor school.', correct: false, misconception: 'Het vak verwarren met productkennis, omdat hoofdstuk 2 over devices gaat.' },
          { text: 'Zodat ik nooit meer hulp hoef te vragen aan een docent of aan iemand thuis als er iets misgaat.', correct: false, misconception: 'Denken dat zelfstandigheid het doel is, terwijl het vak juist zegt: twijfel je, vraag het dan.' }
        ],
        feedback: 'Het goede antwoord noemt drie redenen tegelijk. Sla er een over en je mist een van de drie lijnen waar dit vak op rust.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        // Bronvraag 21 van les 8. In de bron is dit een sleepvraag met vijf lege
        // plekken; in HELIX wordt dat een meerkeuzevraag, omdat de generator geen
        // sleepitems kent. De vijf regels staan letterlijk in de bronvolgorde.
        //
        // RONDE 4 (r12). De bron biedt vijf sleepwoorden voor vijf lege plekken:
        // linkjes, regelmatig, wachtwoord, persoonlijke informatie en gevoelige
        // informatie of afbeeldingen. Elk woord wordt dus precies één keer
        // gebruikt. Tot en met ronde 11 gebruikte HELIX "wachtwoord" twee keer en
        // liet het vijfde woord vallen; de optie die de bronmapping wél volgde
        // stond als misvatting in de lijst. Dat is nu omgedraaid. Dezelfde
        // correctie staat in ophaalopgave 6 van 4.7 in het structuurbestand.
        prompt: 'Vul de vijf veiligheidsregels aan. Deel nooit je ... met iemand die je niet kent. Kies een sterk ... Verander je wachtwoorden ... Zet nooit ... op internet. Klik nooit zomaar op ...',
        type: 'meerkeuze',
        options: [
          { text: 'Persoonlijke informatie, wachtwoord, nooit, gevoelige informatie of afbeeldingen, linkjes.', correct: false, misconception: 'Denken dat een sterk wachtwoord nooit meer hoeft te veranderen.' },
          { text: 'Persoonlijke informatie, wachtwoord, regelmatig, gevoelige informatie of afbeeldingen, linkjes.', correct: true, explanation: 'Er zijn vijf woorden voor vijf lege plekken, dus elk woord past precies één keer. De derde regel is de lastigste: ook een sterk wachtwoord verander je regelmatig, want na een datalek is sterk zijn niet genoeg.' },
          { text: 'Wachtwoord, wachtwoord, regelmatig, gevoelige informatie of afbeeldingen, linkjes.', correct: false, misconception: 'Het woord wachtwoord twee keer gebruiken, waardoor persoonlijke informatie overblijft zonder lege plek.' },
          { text: 'Persoonlijke informatie, wachtwoord, regelmatig, linkjes, gevoelige informatie of afbeeldingen.', correct: false, misconception: 'De laatste twee omdraaien, waardoor je linkjes online zou zetten en op je gegevens zou klikken.' }
        ],
        feedback: 'Elk van de vijf woorden past hier precies één keer: twee gaan over wat je deelt of online zet, een over je wachtwoord, een over hoe vaak je het vervangt en een over aanklikken.',
        leerdoel: 'Je kunt laten zien wat je weet over je device, veilig internet, Word en PowerPoint.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Leg uit waarom je in dit hoofdstuk voor Word, Excel en PowerPoint drie verschillende programma\'s gebruikt in plaats van één.',
        type: 'open',
        modelAnswer: 'Elk programma is gemaakt voor een ander soort werk. Word is er voor lopende tekst die iemand rustig doorleest, met koppen, een inhoudsopgave en paginanummers. Excel is er voor getallen: het rekent met formules en maakt er grafieken van. PowerPoint is er voor een groep die luistert, dus korte steekwoorden en beeld op dia\'s. Zou je alles in één programma doen, dan mis je telkens de functies die je op dat moment nodig hebt.',
        nakijkpunten: [
          'Noemt van alle drie de programma\'s het eigen doel.',
          'Verbindt elk programma aan een concrete functie, bijvoorbeeld inhoudsopgave, formule of dia.',
          'Trekt de conclusie dat je het gereedschap bij de taak kiest.'
        ],
        feedback: 'Deze vraag bindt het hele hoofdstuk samen: tekst, getallen en een verhaal voor een groep vragen elk om ander gereedschap.',
        // RONDE 5. Dit item hing aan het brede toetsleerdoel, waar het niets
        // toevoegde: het gaat niet over je device of veilig internet maar over de
        // vraag waarvoor je welk programma kiest. Dat is letterlijk leerdoel 1 van
        // 4.5, en daar is het nu aan gekoppeld. Dat doel wordt daarmee twee keer
        // in de toets gemeten en het brede doel draagt een item minder.
        leerdoel: 'Je kunt uitleggen waarvoor je PowerPoint gebruikt.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren'
      }
    ]
  },

  // 4.8 Plus: gegevens analyseren met Excel (vrijwillig, alleen tl)
  '4.8': {
    learningGoals: [
      'Je kunt met een functie zoeken, sorteren en filteren in een tabel.',
      'Je kunt kiezen welk soort grafiek bij welke vraag past.',
      'Je kunt uit een grafiek een conclusie trekken en die opschrijven.'
    ],
    theorie: [
      {
        keyTerms: ['sorteren', 'filteren', 'CTRL + F'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Ties wil alleen de weekenddagen uit zijn tabel van eenentwintig dagen bekijken. Hij verwijdert alle doordeweekse rijen. Wat is daar het probleem mee, en wat had hij moeten doen?</p>',
          '<p><strong>Antwoord.</strong> Verwijderen is definitief: zijn gegevens over de doordeweekse dagen zijn nu weg, en zijn gemiddelde over drie weken kan hij nooit meer berekenen. Hij had via Gegevens de knop Filter moeten aanzetten en in het pijltje boven zijn kolom alleen zaterdag en zondag moeten aanvinken. Filteren verbergt rijen tijdelijk, dus met één klik staat alles weer terug.</p>'
        ].join('\n')
      },
      {
        // RONDE 8. Dit blok kreeg er de uitleg over SUBTOTAAL bij, dus ook een
        // uitgewerkt voorbeeld daarover. Het staat VOOR het voorbeeld over
        // grafiektypes, in dezelfde volgorde als de theorietekst erboven, en
        // het is het voorbeeld dat stap 6 van de praktijkopdracht nodig heeft.
        keyTerms: ['SUBTOTAAL', 'staafdiagram', 'lijndiagram', 'cirkeldiagram'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Ties filtert zijn tabel van eenentwintig dagen op zaterdag en zondag en houdt zes rijen over. Hij zet =GEMIDDELDE(B2:B22) onder zijn tabel en leest 154 minuten af, precies hetzelfde getal als vóór het filteren. Werkt zijn filter niet?</p>',
          '<p><strong>Antwoord.</strong> Zijn filter werkt prima; het is zijn formule die er niet naar kijkt. GEMIDDELDE rekent altijd over alle cellen van zijn bereik, dus ook over de vijftien rijen die nu verborgen zijn. Ties typt er daarom =SUBTOTAAL(1;B2:B22) onder, en daar verschijnt 268 minuten. Die functie slaat verborgen rijen wél over, dus dit is het gemiddelde van zijn zes weekenddagen. Zet hij zijn filter uit, dan springt SUBTOTAAL vanzelf terug naar 154. Nu heeft hij twee getallen die hij eerlijk naast elkaar mag leggen: 268 in het weekend tegen 154 over alle dagen. Had hij alleen naar GEMIDDELDE gekeken, dan had hij twee keer 154 gezien en geconcludeerd dat er geen verschil was. Let wel op hoe hij die 154 noemt: het is zijn gemiddelde over álle dagen en niet over zijn doordeweekse dagen. Zijn zes hoge weekenddagen zitten namelijk zelf ook in dat getal en trekken het omhoog. Doordeweeks ligt Ties dus nog lager dan 154, en wil hij dát weten, dan filtert hij een tweede keer.</p>',
          '<p><strong>Vraag.</strong> Noa maakt een lijndiagram van de gemiddelde cijfers voor Nederlands, wiskunde, Engels en biologie. De lijn loopt netjes op. Waarom klopt deze grafiek toch niet?</p>',
          '<p><strong>Antwoord.</strong> Een lijn suggereert een verloop: dat het ene punt in het andere overgaat. Vakken zijn losse categorieën, dus tussen Nederlands en wiskunde zit niets. Haar stijgende lijn is een toevallig gevolg van de volgorde waarin ze de vakken zette. Ze kiest een staafdiagram; dan staan de vier vakken los naast elkaar en vergelijkt haar oog alleen de hoogtes.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Met CTRL + F spring je in je tabel meteen naar een losse waarde toe. Met sorteren zet je je rijen op volgorde, bijvoorbeeld van hoog naar laag of van A naar Z. Met filteren verberg je tijdelijk de rijen die je op dat moment niet nodig hebt. Let op: SOM en GEMIDDELDE tellen die verborgen rijen gewoon mee. Wil je rekenen over alleen wat je ziet, gebruik dan =SUBTOTAAL(9;bereik) of =SUBTOTAAL(1;bereik). Welk grafiektype je kiest, hangt helemaal af van de vraag die je wilt beantwoorden. Een staafdiagram vergelijkt losse dingen en een lijndiagram laat een ontwikkeling in de tijd zien. Een cirkeldiagram toont hoe een geheel over de losse onderdelen verdeeld is. Onder elke grafiek hoort een conclusie van één of twee zinnen met een getal erin. Zonder die conclusie laat je het denkwerk over aan je lezer, en die haakt af.</p>',
      keyTerms: ['sorteren', 'filteren', 'conclusie']
    },
    vragen: [
      {
        prompt: 'Wat is het verschil tussen sorteren en filteren in Excel?',
        type: 'meerkeuze',
        options: [
          { text: 'Sorteren verandert de volgorde van je rijen; filteren verbergt tijdelijk de rijen die je niet zoekt.', correct: true, explanation: 'Bij sorteren blijft alles staan maar in een andere volgorde; bij filteren blijft alles bestaan maar zie je even minder.' },
          { text: 'Sorteren verwijdert de rijen die je niet nodig hebt; filteren schuift ze naar de onderkant van je tabel.', correct: false, misconception: 'Denken dat een van beide gegevens weggooit, wat juist het gevaar is dat filteren voorkomt.' },
          { text: 'Sorteren werkt alleen op getallen; filteren alleen op tekst.', correct: false, misconception: 'Een onderscheid verzinnen op het soort gegevens in plaats van op wat de knop doet.' },
          { text: 'Ze doen hetzelfde, alleen staat filteren op een ander tabblad.', correct: false, misconception: 'Twee gereedschappen gelijkstellen omdat ze naast elkaar staan onder Gegevens.' }
        ],
        feedback: 'Kort samengevat: sorteren verplaatst rijen, filteren verstopt rijen. Geen van beide gooit iets weg.',
        leerdoel: 'Je kunt met een functie zoeken, sorteren en filteren in een tabel.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen'
      },
      {
        // RONDE 8. Tot en met ronde 7 vroeg stap 6 van de opdracht de leerling
        // om met =SOM en =GEMIDDELDE de gefilterde en de ongefilterde tabel te
        // vergelijken. Die twee functies negeren een filter niet, dus hij zag
        // twee keer hetzelfde getal terwijl het modelantwoord een verschil van
        // 114 minuten beloofde. SUBTOTAAL stond nergens in het hoofdstuk. Dit
        // item maakt de misvatting zelf tot toetsstof, net zoals 4.4 dat doet
        // met het verschil tussen 0 en #DEEL/0! bij tekst in een cel.
        prompt: 'Je tabel is gefilterd op alleen de weekenddagen. Welke formule geeft je het gemiddelde van uitsluitend die zichtbare rijen?',
        type: 'meerkeuze',
        options: [
          { text: '=SUBTOTAAL(1;B2:B22), want die functie slaat de rijen over die je filter verbergt.', correct: true, explanation: 'Het eerste getal kiest de bewerking: 1 voor het gemiddelde en 9 voor optellen. Zet je het filter uit, dan rekent SUBTOTAAL vanzelf weer over alles.' },
          { text: '=GEMIDDELDE(B2:B22), want een filter geldt voor je hele werkblad en dus ook voor de formules erin.', correct: false, misconception: 'Denken dat een filter het bereik van een formule verandert, terwijl het alleen verandert wat je op je scherm ziet.' },
          { text: 'Allebei, want zodra er een filter aanstaat rekent Excel automatisch alleen nog over wat er zichtbaar is.', correct: false, misconception: 'Aannemen dat het programma je bedoeling raadt in plaats van precies te doen wat de formule zegt.' },
          { text: '=SOM(B2:B22) delen door het aantal rijen dat na het filteren nog over is, want anders kan het niet.', correct: false, misconception: 'De verborgen rijen wel in de teller laten meetellen maar niet in de noemer, wat een te hoog gemiddelde geeft.' }
        ],
        feedback: 'Een filter verandert wat jij ziet, niet wat een gewone functie meetelt. Alleen SUBTOTAAL kijkt naar wat er zichtbaar is.',
        leerdoel: 'Je kunt met een functie zoeken, sorteren en filteren in een tabel.',
        denkniveau: 'toepassen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren'
      },
      {
        prompt: 'Een cirkeldiagram is de beste keuze zodra je meer dan tien categorieën met elkaar wilt vergelijken.',
        waar: false,
        feedback: 'Andersom: bij veel partjes wordt een cirkel onleesbaar. Hij werkt alleen bij een handvol delen die samen een geheel vormen.',
        leerdoel: 'Je kunt kiezen welk soort grafiek bij welke vraag past.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'samen_oefenen'
      },
      {
        prompt: 'Je wilt laten zien hoe je schermtijd zich over twaalf weken ontwikkeld heeft. Beargumenteer welk grafiektype je kiest en waarom de andere twee hier minder goed werken.',
        type: 'open',
        modelAnswer: 'Ik kies een lijndiagram, want de weken volgen elkaar in de tijd op en de lijn laat de richting zien: stijgt mijn schermtijd, daalt hij of blijft hij vlak. Een staafdiagram zou wel werken maar toont per week een losse staaf, waardoor de trend minder opvalt. Een cirkeldiagram werkt hier niet, want twaalf weken vormen geen verdeling van één geheel en twaalf partjes zijn onleesbaar.',
        nakijkpunten: [
          'Kiest het lijndiagram en koppelt dat aan een ontwikkeling in de tijd.',
          'Legt uit waarom het cirkeldiagram hier niet past.',
          'Weegt het staafdiagram af in plaats van het alleen af te wijzen.'
        ],
        feedback: 'Goed afwegen betekent ook uitleggen waarom een op zich bruikbaar type hier tóch minder vertelt.',
        leerdoel: 'Je kunt kiezen welk soort grafiek bij welke vraag past.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'Wat is het risico als je een conclusie onder je grafiek weglaat?',
        type: 'meerkeuze',
        options: [
          { text: 'De grafiek verdwijnt zodra je het bestand sluit.', correct: false, misconception: 'Een inhoudelijk gebrek verwarren met een technisch probleem.' },
          { text: 'Excel kan de grafiek dan niet bijwerken als je een getal verandert.', correct: false, misconception: 'Denken dat een tekst onder de grafiek invloed heeft op de berekening.' },
          { text: 'Je laat het denkwerk aan je lezer over, en die kan er iets anders in lezen dan jij bedoelde.', correct: true, explanation: 'Een grafiek toont gegevens; wat ze betekenen moet jij in woorden zeggen, liefst met een getal erbij.' },
          { text: 'De lezer ziet de getallen toch al in de grafiek staan, dus een conclusie eronder voegt daar niets meer aan toe.', correct: false, misconception: 'Denken dat gegevens zichzelf uitleggen, terwijl een grafiek alleen laat zien wat er is en niet wat het betekent.' }
        ],
        feedback: 'Cijfers spreken niet voor zich. Zonder jouw zin erbij kan iedereen er zijn eigen verhaal in lezen.',
        leerdoel: 'Je kunt uit een grafiek een conclusie trekken en die opschrijven.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen'
      },
      {
        prompt: 'In 4.4 maakte je een tabel met een kopregel. Leg uit waarom die kopregel juist bij sorteren en filteren nog belangrijker wordt dan bij gewoon rekenen.',
        type: 'open',
        modelAnswer: 'Bij rekenen wijs ik zelf een celbereik aan, dus dan weet ik ook zonder kop welke kolom ik pak. Bij sorteren en filteren gebruikt Excel de kopregel om te weten waarop je sorteert en welk pijltje bij welke kolom hoort. Zonder kopregel sorteert Excel de kop mee als gewone rij, waardoor je bovenste regel ineens midden in je gegevens terechtkomt.',
        nakijkpunten: [
          'Legt uit dat de kopregel de kolom een naam geeft waarop je kunt sorteren of filteren.',
          'Noemt het risico dat de kop meegesorteerd wordt als hij niet als kop herkend wordt.',
          'Maakt het verschil met rekenen duidelijk, waar je zelf het celbereik aanwijst.'
        ],
        feedback: 'Sterke koppeling met 4.4: de kopregel was daar een afspraak voor de lezer, hier is hij ook een aanwijzing voor het programma zelf.',
        leerdoel: 'Je kunt gegevens netjes in een tabel zetten in Excel.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren'
      },
      {
        prompt: 'In 4.3 leerde je een bronregel onder je afbeelding te zetten. Waarom hoort er ook onder een grafiek te staan waar je gegevens vandaan komen?',
        type: 'meerkeuze',
        options: [
          { text: 'Omdat je lezer anders niet kan controleren of je conclusie ergens op steunt.', correct: true, explanation: 'Een getal uit je eigen schermtijdfunctie weegt anders dan een getal dat je ergens hebt overgenomen; zonder bron kan niemand dat onderscheid maken.' },
          { text: 'Omdat Excel anders weigert je grafiek op te slaan.', correct: false, misconception: 'Een afspraak over eerlijkheid verwarren met een eis van het programma.' },
          { text: 'Omdat de bronregel de titel van je grafiek vervangt.', correct: false, misconception: 'Bron en titel door elkaar halen, terwijl de titel zegt waarover de grafiek gaat en de bron waar hij vandaan komt.' },
          { text: 'Omdat een grafiek zonder bronregel volgens Excel niet gesorteerd of gefilterd mag worden.', correct: false, misconception: 'Twee losse handelingen aan elkaar knopen omdat ze in dezelfde paragraaf staan.' }
        ],
        feedback: 'Dezelfde gedachte als bij beeld in 4.3, maar dan voor cijfers: wie zijn herkomst noemt, laat zien dat zijn werk te controleren is.',
        leerdoel: 'Je weet waarom je niet zomaar elke afbeelding van internet mag gebruiken.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'reflecteren'
      }
    ]
  }
};
