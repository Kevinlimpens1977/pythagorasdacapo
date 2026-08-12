/*
 * Digitale Vaardigheden Lingo - js/woorden.js
 * ------------------------------------------------------------------
 * De standaardwoordenlijst (thema: digitale vaardigheden) en het
 * woordenboek waartegen gokken gevalideerd worden.
 *
 * Geen build-stap, geen modules: dit bestand hangt alles aan window.DVL
 * en werkt gewoon door index.html vanaf schijf te openen.
 *
 * Regels voor de woorden:
 *   - uitsluitend de letters A t/m Z, hoofdletters, geen accenten,
 *     geen streepjes en geen spaties (BACK-UP schrijven we als BACKUP);
 *   - de te raden woorden zijn 5, 6 of 7 letters lang, want het spel
 *     speelt rondes in die volgorde;
 *   - elk woord heeft een uitleg van een zin die het spel na het raden toont.
 */
(function (window) {
  "use strict";

  var DVL = (window.DVL = window.DVL || {});

  /* ================================================================
   * 1. STANDAARDWOORDEN - de speellijst over digitale vaardigheden
   * ================================================================ */

  /* --- 5 letters ------------------------------------------------- */
  var VIJF = [
    { woord: "KABEL", uitleg: "Een snoer waarmee je apparaten met elkaar of met de stroom verbindt." },
    { woord: "MODEM", uitleg: "Het kastje dat het signaal van je provider omzet voor je thuisnetwerk." },
    { woord: "VIRUS", uitleg: "Kwaadaardige software die zichzelf verspreidt en je computer beschadigt." },
    { woord: "PIXEL", uitleg: "Het kleinste gekleurde puntje waaruit een beeldscherm een afbeelding opbouwt." },
    { woord: "INLOG", uitleg: "De combinatie van gebruikersnaam en wachtwoord waarmee je toegang krijgt." },
    { woord: "TOETS", uitleg: "Een knop op het toetsenbord waarmee je een teken of een opdracht geeft." },
    { woord: "ROBOT", uitleg: "Een machine of programma dat taken zelfstandig uitvoert." },
    { woord: "LADEN", uitleg: "Het ophalen van gegevens tot een pagina of bestand klaar is voor gebruik." },
    { woord: "MEDIA", uitleg: "Verzamelnaam voor foto, video, geluid en tekst op je apparaat." },
    { woord: "DELEN", uitleg: "Een bestand of een link beschikbaar maken voor iemand anders." },
    { woord: "LOGIN", uitleg: "Het moment waarop je jezelf aanmeldt bij een dienst of apparaat." },
    { woord: "MAPJE", uitleg: "Een kleine map waarin je bestanden bij elkaar bewaart." },
    { woord: "TEKST", uitleg: "Letters en woorden die je typt of leest op het scherm." },
    { woord: "BEELD", uitleg: "Alles wat je ziet op het scherm, van foto tot film." },
    { woord: "VIDEO", uitleg: "Bewegend beeld met geluid dat je bekijkt of zelf opneemt." },
    { woord: "TABEL", uitleg: "Gegevens netjes gerangschikt in rijen en kolommen." },
    { woord: "FORUM", uitleg: "Een online plek waar mensen vragen stellen en antwoorden geven." },
    { woord: "EMAIL", uitleg: "Een bericht dat je digitaal verstuurt naar een adres met een apenstaartje." },
    { woord: "KAART", uitleg: "Een pasje of geheugenkaartje waarmee je betaalt of gegevens bewaart." },
    { woord: "TOKEN", uitleg: "Een tijdelijke code of sleutel die bewijst dat jij het echt bent." },
    { woord: "CACHE", uitleg: "Tijdelijk geheugen waarin je apparaat gegevens bewaart om sneller te werken." },
    { woord: "MACRO", uitleg: "Een opgenomen reeks handelingen die je met een druk op de knop herhaalt." },
    { woord: "PATCH", uitleg: "Een kleine reparatie die een fout of een lek in software dicht." },
    { woord: "PROXY", uitleg: "Een tussenstation dat je internetverkeer doorgeeft en afschermt." },
    { woord: "DRAAD", uitleg: "De metalen kern in een kabel die stroom of signaal vervoert." },
    { woord: "TYPEN", uitleg: "Letters intoetsen op een toetsenbord of op een schermtoetsenbord." },
    { woord: "KOPIE", uitleg: "Een tweede exemplaar van een bestand dat je bewaart of doorgeeft." },
    { woord: "BYTES", uitleg: "De eenheden waarin de grootte van een bestand geteld wordt." },
    { woord: "CLOUD", uitleg: "Opslag op servers van een dienst, zodat je overal bij je bestanden kunt." },
    { woord: "EMOJI", uitleg: "Een klein plaatje waarmee je in een bericht een gevoel laat zien." },
    { woord: "LEZEN", uitleg: "Informatie op het scherm tot je nemen zonder er iets aan te veranderen." },
    { woord: "LINKS", uitleg: "Verwijzingen waarop je klikt om naar een andere pagina te gaan." },
    { woord: "TEGEL", uitleg: "Een vierkant blokje in een menu waarmee je een app opent." },
    { woord: "ICOON", uitleg: "Het kleine plaatje dat een app of een bestand herkenbaar maakt." },
    { woord: "REGEL", uitleg: "Een enkele lijn tekst in een document of in een e-mail." },
    { woord: "PRINT", uitleg: "Een afdruk op papier van wat er op je scherm staat." },
    { woord: "POPUP", uitleg: "Een venstertje dat vanzelf over de pagina heen verschijnt." },
    { woord: "ADRES", uitleg: "De unieke aanduiding van een website of van een e-mailpostbus." },
    { woord: "MODUS", uitleg: "De stand waarin een apparaat werkt, licht of donker." },
    { woord: "TIMER", uitleg: "Een klokje dat aftelt en je waarschuwt zodra de tijd om is." },
    { woord: "ALARM", uitleg: "Een signaal dat je waarschuwt, bijvoorbeeld bij een afspraak." },
    { woord: "APPJE", uitleg: "Een kort berichtje dat je via een chatapp verstuurt." },
    { woord: "SNOER", uitleg: "Een draad waarmee je een apparaat aansluit of oplaadt." },
    { woord: "BLOGS", uitleg: "Persoonlijke stukjes die iemand met enige regelmaat online zet." },
    { woord: "MAILS", uitleg: "Berichten die je via het net naar iemands postbus stuurt." },
    { woord: "CHATS", uitleg: "Gesprekken die je typend voert, vaak in korte berichtjes." },
    { woord: "SCANS", uitleg: "Digitale afbeeldingen van papier, gemaakt met een apparaat." },
    { woord: "SITES", uitleg: "Plekken op het net die je met een browser bezoekt." },
    { woord: "LIKES", uitleg: "Duimpjes die anderen achterlaten bij wat jij plaatst." },
    { woord: "GAMES", uitleg: "Spellen die je op een computer of telefoon speelt." },
    { woord: "TWEET", uitleg: "Een kort openbaar berichtje op een sociaal netwerk." },
    { woord: "INDEX", uitleg: "Een lijst die aangeeft waar iets te vinden is." },
    { woord: "FILMS", uitleg: "Bewegende beelden die je bekijkt of streamt." },
    { woord: "RADIO", uitleg: "Een toestel of dienst waarmee je uitzendingen beluistert." },
    { woord: "LADER", uitleg: "Het apparaatje waarmee je een lege accu weer volmaakt." },
    { woord: "CODES", uitleg: "Reeksen tekens die iets afschermen of laten werken." },
    { woord: "DATUM", uitleg: "De dag waarop een bestand of bericht is gemaakt." }
  ];

  /* --- 6 letters ------------------------------------------------- */
  var ZES = [
    { woord: "SCHERM", uitleg: "Het beeldvlak van je apparaat waarop alles zichtbaar wordt." },
    { woord: "LAPTOP", uitleg: "Een draagbare computer met een vast toetsenbord en een klapscherm." },
    { woord: "TABLET", uitleg: "Een platte computer die je vooral met je vingers bedient." },
    { woord: "SERVER", uitleg: "Een krachtige computer die websites en bestanden aan anderen levert." },
    { woord: "BACKUP", uitleg: "Een reservekopie van je gegevens voor als er iets misgaat." },
    { woord: "ROUTER", uitleg: "Het kastje dat je apparaten met elkaar en met het internet verbindt." },
    { woord: "MOBIEL", uitleg: "Je telefoon, die je overal mee naartoe neemt." },
    { woord: "ONLINE", uitleg: "Verbonden met het internet en dus bereikbaar." },
    { woord: "CURSOR", uitleg: "Het pijltje of streepje dat aangeeft waar je op het scherm bezig bent." },
    { woord: "WIDGET", uitleg: "Een klein blokje op je scherm dat meteen informatie toont." },
    { woord: "ICONEN", uitleg: "De plaatjes waarmee apps en bestanden worden aangeduid." },
    { woord: "UPDATE", uitleg: "Een vernieuwing die fouten herstelt en functies toevoegt." },
    { woord: "VERSIE", uitleg: "De uitgave van een programma, te herkennen aan een nummer." },
    { woord: "UPLOAD", uitleg: "Een bestand vanaf je apparaat naar het internet zetten." },
    { woord: "SLEPEN", uitleg: "Iets vasthouden met muis of vinger en naar een andere plek bewegen." },
    { woord: "WISSEN", uitleg: "Gegevens verwijderen zodat ze niet meer op je apparaat staan." },
    { woord: "OPSLAG", uitleg: "De ruimte waarin je apparaat je bestanden bewaart." },
    { woord: "MAPPEN", uitleg: "Digitale laden waarin je je bestanden geordend bewaart." },
    { woord: "ZOEKEN", uitleg: "Met een zoekterm vinden wat je nodig hebt." },
    { woord: "SCROLL", uitleg: "Het schuiven over een pagina om verder naar beneden te lezen." },
    { woord: "FILTER", uitleg: "Een instelling die alleen doorlaat wat je werkelijk wilt zien." },
    { woord: "COOKIE", uitleg: "Een klein bestandje waarmee een site je bij een volgend bezoek herkent." },
    { woord: "HACKEN", uitleg: "Ongevraagd inbreken in een computer of in een account." },
    { woord: "AVATAR", uitleg: "Het plaatje dat jou voorstelt in een app of in een spel." },
    { woord: "AGENDA", uitleg: "De digitale kalender waarin je je afspraken zet." },
    { woord: "WEBCAM", uitleg: "Het cameraatje waarmee je beeldbelt." },
    { woord: "OPMAAK", uitleg: "De vormgeving van tekst, zoals vet, schuin en kopjes." },
    { woord: "AFDRUK", uitleg: "Wat de printer voor je op papier zet." },
    { woord: "PAPIER", uitleg: "Het vel waarop de printer je document afdrukt." },
    { woord: "SCHIJF", uitleg: "De opslagplaats in je computer waar je bestanden op staan." },
    { woord: "ZIPPEN", uitleg: "Bestanden samenpersen tot een klein pakketje." },
    { woord: "BINAIR", uitleg: "Het talstelsel van enen en nullen waarmee computers rekenen." },
    { woord: "LINKJE", uitleg: "Een kleine verwijzing waarop je klikt om ergens heen te gaan." },
    { woord: "DOMEIN", uitleg: "De naam van een website, zoals het deel voor de punt nl." },
    { woord: "PINNEN", uitleg: "Betalen met je pas en je pincode." },
    { woord: "GELUID", uitleg: "Alles wat je hoort uit de speakers of uit je koptelefoon." },
    { woord: "SLOTJE", uitleg: "Het icoontje dat laat zien dat een verbinding beveiligd is." },
    { woord: "KNOPJE", uitleg: "Een klein vlak waarop je klikt of tikt om iets te laten gebeuren." },
    { woord: "BALKJE", uitleg: "Een streep op het scherm die voortgang of resterende tijd aangeeft." },
    { woord: "PAGINA", uitleg: "Een enkel scherm vol informatie op een website." },
    { woord: "BANNER", uitleg: "Een reclamevlak boven of naast de inhoud van een pagina." },
    { woord: "DRIVER", uitleg: "Het stuurprogramma dat je computer met een apparaat laat praten." },
    { woord: "VOLGER", uitleg: "Iemand die jouw berichten op sociale media meeleest." },
    { woord: "MUZIEK", uitleg: "Liedjes die je streamt of op je eigen apparaat bewaart." },
    { woord: "VELDEN", uitleg: "De vakjes in een formulier die je invult." },
    { woord: "KLOKJE", uitleg: "De tijdsaanduiding in de hoek van je scherm." },
    { woord: "BEAMER", uitleg: "Een apparaat dat een beeld groot op de muur zet." },
    { woord: "KABELS", uitleg: "Draden waarmee apparaten stroom of gegevens doorgeven." },
    { woord: "OPENEN", uitleg: "Een bestand of venster tevoorschijn halen om te bekijken." },
    { woord: "LADERS", uitleg: "Apparaatjes waarmee je lege accu's weer volmaakt." },
    { woord: "MUISJE", uitleg: "Het kleine kastje waarmee je de pijl op je scherm stuurt." },
    { woord: "MAILEN", uitleg: "Een bericht via het net naar iemands postbus sturen." },
    { woord: "BELLEN", uitleg: "Iemand spreken via een telefoon of een videoverbinding." },
    { woord: "CAMERA", uitleg: "Het oogje waarmee je foto's maakt of in beeld komt." },
    { woord: "MODEMS", uitleg: "Kastjes die je huis met het internet verbinden." },
    { woord: "ROBOTS", uitleg: "Machines die zelf taken uitvoeren zonder mens erbij." },
    { woord: "SENSOR", uitleg: "Een onderdeel dat iets meet, zoals licht of beweging." },
    { woord: "ZENDER", uitleg: "Een kanaal of station dat uitzendingen de wereld in stuurt." },
    { woord: "KIJKEN", uitleg: "Met je ogen volgen wat er op een scherm gebeurt." },
    { woord: "MAPJES", uitleg: "Kleine bewaarplekken waarin je bestanden ordent." },
    { woord: "SPELEN", uitleg: "Een spel doen op een computer, tablet of telefoon." }
  ];

  /* --- 7 letters ------------------------------------------------- */
  var ZEVEN = [
    { woord: "BESTAND", uitleg: "Een verzameling gegevens met een naam, zoals een foto of een document." },
    { woord: "BROWSER", uitleg: "Het programma waarmee je websites bekijkt." },
    { woord: "NETWERK", uitleg: "Apparaten die met elkaar verbonden zijn en gegevens uitwisselen." },
    { woord: "PRINTER", uitleg: "Het apparaat dat je bestanden op papier afdrukt." },
    { woord: "SCANNER", uitleg: "Het apparaat dat papier omzet in een digitaal bestand." },
    { woord: "ACCOUNT", uitleg: "Je persoonlijke toegang tot een dienst, met een naam en een wachtwoord." },
    { woord: "WEBSITE", uitleg: "Een plek op het internet die je met een adres in de browser opent." },
    { woord: "MUISPAD", uitleg: "Het aanraakvlak onder het toetsenbord van een laptop." },
    { woord: "TOETSEN", uitleg: "De knoppen van het toetsenbord waarmee je typt." },
    { woord: "KLIKKEN", uitleg: "Kort drukken op de muisknop om iets te kiezen." },
    { woord: "SIGNAAL", uitleg: "De sterkte van je verbinding met het netwerk." },
    { woord: "SYSTEEM", uitleg: "Het besturingsprogramma dat je hele apparaat laat werken." },
    { woord: "VENSTER", uitleg: "Een los kader op je scherm waarin een programma draait." },
    { woord: "TABBLAD", uitleg: "Een extra pagina binnen hetzelfde venster van je browser." },
    { woord: "MALWARE", uitleg: "Verzamelnaam voor software die je apparaat kwaad wil doen." },
    { woord: "SPYWARE", uitleg: "Software die stiekem meekijkt met alles wat jij doet." },
    { woord: "HACKERS", uitleg: "Mensen die proberen binnen te dringen in andermans systemen." },
    { woord: "PRIVACY", uitleg: "Het recht om zelf te bepalen wie jouw gegevens mag zien." },
    { woord: "COOKIES", uitleg: "Kleine bestandjes waarmee sites jouw bezoek onthouden." },
    { woord: "SPAMMAP", uitleg: "De map waarin ongewenste reclamemail vanzelf belandt." },
    { woord: "PINCODE", uitleg: "De geheime cijfercode waarmee je een pas of telefoon opent." },
    { woord: "CODEREN", uitleg: "Instructies schrijven die de computer kan uitvoeren." },
    { woord: "SLEUTEL", uitleg: "De geheime reeks tekens waarmee gegevens versleuteld worden." },
    { woord: "TOEGANG", uitleg: "De rechten die bepalen wat jij mag openen of mag wijzigen." },
    { woord: "PROFIEL", uitleg: "Je persoonlijke pagina met gegevens binnen een dienst." },
    { woord: "BERICHT", uitleg: "Een stukje tekst dat je naar iemand verstuurt." },
    { woord: "MAILBOX", uitleg: "De digitale brievenbus waarin je post binnenkomt." },
    { woord: "BIJLAGE", uitleg: "Een bestand dat je meestuurt met een e-mail." },
    { woord: "HEADSET", uitleg: "Een koptelefoon met microfoon voor bellen en vergaderen." },
    { woord: "CHATTEN", uitleg: "In korte berichten heen en weer praten." },
    { woord: "KNIPPEN", uitleg: "Iets weghalen en tijdelijk bewaren om het elders te plakken." },
    { woord: "PLAKKEN", uitleg: "Wat je geknipt of gekopieerd hebt ergens anders neerzetten." },
    { woord: "SCANNEN", uitleg: "Papier of een code inlezen met een apparaat of met je camera." },
    { woord: "OPSLAAN", uitleg: "Je werk bewaren zodat het niet verloren gaat." },
    { woord: "FORMAAT", uitleg: "De soort van een bestand, te herkennen aan de extensie." },
    { woord: "GROOTTE", uitleg: "Hoeveel ruimte een bestand op je opslag inneemt." },
    { woord: "UPDATEN", uitleg: "Je programma of apparaat bijwerken naar de nieuwste versie." },
    { woord: "MELDING", uitleg: "Een kort bericht van je apparaat dat je aandacht vraagt." },
    { woord: "NOTITIE", uitleg: "Een korte aantekening die je digitaal bewaart." },
    { woord: "CONTACT", uitleg: "Iemand met naam en gegevens in je digitale adresboek." },
    { woord: "OPLADER", uitleg: "Het snoer met stekker waarmee je de accu weer vult." },
    { woord: "STEKKER", uitleg: "Het uiteinde van een snoer dat in een contact of poort gaat." },
    { woord: "STORING", uitleg: "Een tijdelijke fout waardoor iets even niet werkt." },
    { woord: "HERSTEL", uitleg: "Het terugzetten van gegevens of instellingen na een probleem." },
    { woord: "OFFLINE", uitleg: "Zonder verbinding met het internet." },
    { woord: "PODCAST", uitleg: "Een luisterprogramma dat je op je eigen apparaat afspeelt." },
    { woord: "ABONNEE", uitleg: "Iemand die zich heeft aangemeld voor een dienst of een kanaal." },
    { woord: "BETALEN", uitleg: "Geld overmaken voor een aankoop, ook gewoon online." },
    { woord: "ZWENDEL", uitleg: "Oplichterij waarbij iemand je met een smoes geld afhandig maakt." },
    { woord: "NEPMAIL", uitleg: "Een vals bericht dat lijkt te komen van een bekende afzender." },
    { woord: "NEPSITE", uitleg: "Een nagemaakte website die je gegevens wil stelen." },
    { woord: "ANTENNE", uitleg: "Het deel dat draadloze signalen opvangt en verstuurt." },
    { woord: "AKKOORD", uitleg: "De toestemming die je geeft voordat een dienst verdergaat." },
    { woord: "BLOGGER", uitleg: "Iemand die regelmatig stukjes op een eigen site schrijft." },
    { woord: "MAILTJE", uitleg: "Een kort berichtje dat je per e-mail verstuurt." },
    { woord: "ROUTERS", uitleg: "Kastjes die het net door je huis verdelen." },
    { woord: "SENSORS", uitleg: "Onderdelen die iets meten, zoals licht of beweging." },
    { woord: "TABLETS", uitleg: "Platte apparaten met een aanraakscherm, groter dan een telefoon." },
    { woord: "LAPTOPS", uitleg: "Draagbare computers met een klep en een toetsenbord." },
    { woord: "WEBCAMS", uitleg: "Kleine oogjes waarmee je in beeld komt bij videobellen." },
    { woord: "DRIVERS", uitleg: "Kleine programma's die de computer een apparaat laten snappen." },
    { woord: "BEELDEN", uitleg: "Foto's en tekeningen die je op een scherm ziet." }
  ];

  DVL.STANDAARDWOORDEN = VIJF.concat(ZES, ZEVEN);

  /* Handig voor het spel en de quizmaster: opzoeken op lengte. */
  DVL.standaardOpLengte = function (lengte) {
    var uit = [];
    for (var i = 0; i < DVL.STANDAARDWOORDEN.length; i++) {
      if (DVL.STANDAARDWOORDEN[i].woord.length === lengte) uit.push(DVL.STANDAARDWOORDEN[i]);
    }
    return uit;
  };

  /* ================================================================
   * 2. WOORDENBOEK - geldige Nederlandse woorden van 5 t/m 7 letters
   * ================================================================
   * Alleen bedoeld om gokken te keuren. Dit is de kleine basislijst;
   * js/woordenboek.js wordt hierna geladen en vult hem aan tot alle
   * Nederlandse woorden van 5 t/m 7 letters, zodat de speler net als
   * bij de echte Lingo met elk bestaand woord mag gokken. Zonder dat
   * bestand blijft het spel werken, alleen strenger. De te raden
   * woorden worden er onderaan automatisch bij gevoegd, zodat ze er
   * altijd in zitten.
   */

  var RUW_VIJF =
    "AARDE ADRES AGENT AKKER ALARM ALLES ANDER ANGST APPEL APPJE ARENA AVOND " +
    "BAARD BADEN BALEN BANEN BEELD BEIDE BEKER BENEN BESTE BEZIG BIJNA BLAUW " +
    "BLIJF BLOED BLOEM BLOGS BOMEN BONEN BOORD BOSJE BOTER BOVEN BRAAF BRAND " +
    "BREED BREEK BREIN BRIEF BROEK BROER BRUIN BUREN BUURT BYTES CACHE CHATS " +
    "CLOUD DAGEN DAKEN DAMES DEELS DEKEN DELEN DENKT DICHT DIEET DIEPE DOORN " +
    "DOZEN DRAAD DRAAI DRAMA DRANK DRINK DROGE DROOG DROOM DRUIF EERST EIGEN " +
    "EINDE EMAIL EMOJI ENGEL ENKEL ETAGE EXTRA FABEL FEEST FIETS FILMS FLINK " +
    "FORUM FRAAI FRUIT GAMES GATEN GEBAK GEBED GEBIT GEEST GELUK GEMAK GENIE " +
    "GEVAL GEVEL GEVEN GLANS GOEDE GRAAF GRAAG GRENS GROEN GROEP GROND GROOT " +
    "HAARD HALEN HALLO HAMER HAPJE HARDE HAVEN HEDEN HELFT HEMEL HOEVE HOGER " +
    "HOKJE HOOFD HOREN HOTEL HOUDT ICOON IEDER IJSJE IJZER INDEX INLOG INZET " +
    "JAGER JAREN JASJE JEUGD JONGE JUIST KABEL KAARS KAART KADER KAMER KANON " +
    "KAPOT KETEL KEUZE KLAAR KLANK KLEIN KLEUR KLOMP KNAAP KNOOP KOKEN KOMEN " +
    "KOPEN KOPIE KORTE KRANT KRIJG KROON KRUIS KUNST LADEN LANGE LATEN LATER " +
    "LEDEN LEGER LENTE LEREN LEUKE LEVEN LEZEN LICHT LIEVE LIJKT LIJST LIKES " +
    "LINKS LOPEN LUCHT MAAND MACRO MAILS MAKEN MAPJE MARKT MEDIA MEEST METEN " +
    "METER MODEM MODUS MOEST MOLEN MOOIE MUREN NAALD NAAST NACHT NAMEN NEMEN " +
    "NEVEL NIEUW NODIG NOOIT NOTEN OMDAT ONDER ONZIN OUDER PAARD PADEN PAKJE " +
    "PATCH PAUZE PIANO PIXEL PLAAT PLANK PLANT PLEIN PLOEG POORT POPUP POTJE " +
    "PRAAT PRIJS PRIMA PRINT PROEF PROXY RADEN RAMEN RECHT REDEN REGEL REGEN " +
    "RIJST ROBOT ROMAN RONDE ROZEN SAMEN SCANS SCHAT SCHIP SCHOP SITES SLAAN " +
    "SLAAP SLOOT SMAAK SNOEP SPEEL SPIER SPORT SPRAK STAAL STAAN STERK STIJL " +
    "STOEL STORM STRAF STRIK TAART TABEL TAFEL TALEN TASJE TEGEL TEKST TERUG " +
    "THUIS TIMER TOCHT TOETS TOKEN TOREN TRAAG TREIN TROTS TWEET TYPEN VADER " +
    "VAKJE VASTE VIDEO VIRUS VLEES VLIEG VLOER VOGEL VOLGT VREDE VROEG WAGEN " +
    "WATER WEGEN WEIDE WETEN WONEN WOORD ZAKJE ZEKER ZEVEN ZIJDE ZINGT ZOETE " +
    "ZOMER ZUCHT ZUSJE ZWAAR ZWART ZWEEP";

  var RUW_ZES =
    "ACHTER AFDRUK AGENDA ARBEID AVATAR BACKUP BAKKER BALKJE BALLON BANAAN " +
    "BANKJE BANNER BERGEN BEZOEK BIDDEN BINAIR BINNEN BLIJDE BOEKEN BOKAAL " +
    "BUITEN COOKIE CURSOR DANSEN DEUREN DIEPER DIEREN DINGEN DOELEN DOKTER " +
    "DOMEIN DONKER DORPJE DRIVER DUBBEL DUINEN DUIVEL DUIVEN EENDJE EERDER " +
    "EILAND ELDERS ELFTAL ERGENS FILTER FLESJE GANGEN GEDAAN GEDULD GEHEEL " +
    "GELUID GEVOEL GEWEER GEWOON GIETEN GITAAR GLAZEN GOUDEN GRACHT GRAPJE " +
    "HACKEN HANDEL HANDEN HARTJE HEBBEN HELDER HERFST HOEDJE HOEKJE HONDEN " +
    "HONING HOUTEN HUILEN HUIZEN HUMEUR ICONEN IDEAAL INHOUD JURKJE KAASJE " +
    "KANAAL KASTJE KATTEN KELDER KEUKEN KIJKEN KIKKER KINDJE KLOKJE KNOPJE " +
    "KOEIEN KOEKJE KOFFER KOFFIE KORAAL KOSTEN KRACHT KUSSEN LAARSJE LAMPJE " +
    "LANDEN LAPTOP LEKKER LEPELS LETTER LIEDJE LINKJE LOKAAL MANIER MAPPEN " +
    "MEISJE MENEER MENSEN MERKEN MEUBEL MIDDEN MILIEU MINDER MOBIEL MOEDER " +
    "MOETEN MOLENS MORGEN MUNTJE MUZIEK NAAIEN NETJES NUMMER ONLINE OORLOG " +
    "OPENEN OPGAVE OPMAAK OPSLAG PADDEN PAGINA PANNEN PAPIER PARELS PARKJE " +
    "PENNEN PILAAR PINNEN POEZIE PRATEN PUNTJE RANDJE REIZEN RIETJE RIJDEN " +
    "RIVIER ROEPEN ROUTER RUGZAK RUIMTE RUSTIG SCHAAL SCHAAP SCHERM SCHIJF " +
    "SCHOEN SCHOOL SCROLL SERVER SIMPEL SLAGEN SLECHT SLEPEN SLOTEN SLOTJE " +
    "SNEEUW SNELLE SOEPEL SPAREN SPELEN SPOREN STAART STEEDS STENEN STRAAT " +
    "STROOM STUDIE STUKJE SUIKER TABLET TANDEN TELLEN TEMPEL TENTJE TIJDEN " +
    "TOUWEN TRAPJE TRUCJE TUINEN TWAALF TWEEDE UITLEG UPDATE UPLOAD VALLEN " +
    "VARKEN VEILIG VELDEN VERDER VERLOF VERSIE VERVEN VIEREN VIJVER VINDEN " +
    "VISSEN VOGELS VOLGEN VOLGER VOORAL VRAGEN VRIEND VRUCHT WAKKER WANDEL " +
    "WEBCAM WEINIG WEKKER WERELD WERKEN WESTEN WIDGET WIELEN WIJZER WINKEL " +
    "WINNEN WINTER WISSEN WOLKEN WOLKJE WONDER WORDEN ZANGER ZEEPJE ZENDEN " +
    "ZIEKTE ZILVER ZINNEN ZIPPEN ZOEKEN ZOENEN ZONDAG ZONNIG ZORGEN ZUIDEN " +
    "ZWAARD";

  var RUW_ZEVEN =
    "AARDBEI ABONNEE ACCOUNT AKKOORD ANTENNE AVONDJE BEDRIJF BEKENDE BELOFTE " +
    "BENZINE BERICHT BESTAND BETALEN BIJLAGE BLOEMEN BLOGGER BOEKJES BROEDER " +
    "BROWSER BRUGGEN CHATTEN CODEREN CONTACT COOKIES DAGBOEK DOKTERS DRAADJE " +
    "DRINKEN DRUKKEN EERLIJK ENERGIE ETALAGE ETENTJE FABRIEK FAMILIE FIETSEN " +
    "FLESSEN FORMAAT GELDIGE GERECHT GESPREK GEZICHT GRAPPIG GROOTTE HACKERS " +
    "HEADSET HERSTEL HUISJES IJSKOUD INKOMEN JONGENS KAARTEN KANTOOR KETTING " +
    "KEUKENS KIJKERS KLASSEN KLEUREN KLIKKEN KNIPPEN KOMENDE KRANTEN LACHEND " +
    "LAMPJES LOPENDE MAANDAG MACHINE MAILBOX MAILTJE MALWARE MEISJES MELDING " +
    "METHODE MUISPAD NAALDEN NEPMAIL NEPSITE NERGENS NETWERK NOTITIE OCHTEND " +
    "OEFENEN OFFERTE OFFLINE OLIFANT OPENING OPLADER OPSLAAN ORGANEN PASTOOR " +
    "PINCODE PLAKKEN PLANKEN PLANTEN PLEZIER PODCAST PRINTER PRIVACY PROFIEL " +
    "PROJECT RAADSEL RAPPORT REGENEN REKENEN RIJKDOM RONDJES RUSTIGE SCANNEN " +
    "SCANNER SCHADUW SCHOLEN SCHRIJF SEIZOEN SIGNAAL SLEUTEL SOLDAAT SPAMMAP " +
    "SPELLEN SPIEGEL SPORTEN SPYWARE STATION STEKKER STOELEN STORING STUDENT " +
    "SYSTEEM TABBLAD TEKENEN THEATER TOEGANG TOETSEN TREINEN TUINTJE UPDATEN " +
    "VANDAAG VENSTER VERHAAL VERKEER VLAGGEN VLIEGEN VLINDER VOETBAL VUURTJE " +
    "WACHTEN WEBSITE WEEKEND WORTELS ZANDBAK ZEEPBEL ZONNIGE ZWEMBAD ZWEMMEN " +
    "ZWENDEL";

  /**
   * Bouwt het woordenboek: opsplitsen, opschonen, de speelwoorden erbij,
   * dubbelen eruit en netjes op alfabet. Alles wat niet uit 5 t/m 7
   * letters A-Z bestaat valt er stilzwijgend uit, zodat een typefout in
   * de lijst het spel nooit kan breken.
   */
  function bouwWoordenboek() {
    var gezien = Object.create(null);
    var uit = [];

    function voegToe(woord) {
      if (typeof woord !== "string") return;
      var w = woord.toUpperCase().replace(/[^A-Z]/g, "");
      if (w.length < 5 || w.length > 7) return;
      if (gezien[w]) return;
      gezien[w] = true;
      uit.push(w);
    }

    var bronnen = [RUW_VIJF, RUW_ZES, RUW_ZEVEN];
    for (var b = 0; b < bronnen.length; b++) {
      var stukken = bronnen[b].split(/\s+/);
      for (var i = 0; i < stukken.length; i++) voegToe(stukken[i]);
    }
    /* De te raden woorden horen er hoe dan ook in te zitten. */
    for (var s = 0; s < DVL.STANDAARDWOORDEN.length; s++) {
      voegToe(DVL.STANDAARDWOORDEN[s].woord);
    }

    uit.sort();
    return uit;
  }

  DVL.WOORDENBOEK = bouwWoordenboek();

  /* Snelle opzoektabel; core.js gebruikt deze als hij er is. */
  DVL.WOORDENBOEKSET = (function () {
    var set = Object.create(null);
    for (var i = 0; i < DVL.WOORDENBOEK.length; i++) set[DVL.WOORDENBOEK[i]] = true;
    return set;
  })();

  /** Staat dit woord in het woordenboek? Hoofdletterongevoelig. */
  DVL.kentWoord = function (woord) {
    if (typeof woord !== "string") return false;
    return DVL.WOORDENBOEKSET[woord.toUpperCase().replace(/[^A-Z]/g, "")] === true;
  };
})(window);
