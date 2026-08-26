// Verrijkingslaag hoofdstuk 3 - Veilig internet en jouw gegevens (tl).
//
// Patroon: scripts/seed-verrijking/PATROON.md. De structuur en de lesstof staan
// in scripts/seed-structuur/tl/h3.mjs, samen met de startcheck (blauwdrukstap
// 1), het oefenblok (stap 4, 5 en 6) en de modelantwoorden bij de
// praktijkopdrachten (stap 8).
//
// Theoretische leerweg: langere theorieblokken mogen, maar elk blok krijgt een
// uitgewerkt voorbeeld vóór het zelfstandig oefenen. In de quizzen staan meer
// open vragen waarin de leerling iets uitlegt of vergelijkt, en per paragraaf
// minstens één verdiepingsvraag die een verband legt met een andere paragraaf.
//
// TOETSMATRIJS VAN DIT HOOFDSTUK
// ------------------------------
// De blauwdruk vraagt per afsluitquiz vijf vragen waarvan twee uit eerdere
// paragrafen, en per hoofdstuktoets elk leerdoel minstens twee keer. Dat is
// hier zo uitgevoerd:
//
//   3.1  7 vragen: 5 over de eigen leerdoelen + 2 terugkeervragen (1.2 en 2.2).
//   3.2  7 vragen: 5 eigen + 2 terugkeervragen over 3.1.
//   3.3  9 vragen: 7 eigen + 2 terugkeervragen over 3.1 en 3.2.
//   3.4  29 vragen: de elf leerdoelen van 3.1 t/m 3.4, elk minstens twee keer.
//   3.5  7 vragen: 5 eigen + 2 terugkeervragen over 3.2 en 3.3.
//
// WAAROM DE QUIZZEN OP 7, 7, 9 EN 7 STAAN EN NIET OP 5
// -----------------------------------------------------
// De blauwdruk noemt 5 vragen per afsluitquiz als startwaarde, waarvan er 2
// terugkijken naar eerdere stof. Dat betekent 3 vragen over de paragraaf zelf.
// Elke paragraaf hier heeft er drie leerdoelen, en een leerdoel dat maar één
// keer bevraagd wordt is niet gemeten maar gepeild: één gokje op één vorm.
// Vandaar 5 eigen vragen bij drie leerdoelen (twee doelen twee keer, in twee
// verschillende vormen) plus de 2 terugkeervragen die de blauwdruk vraagt. De
// 2 terugkeervragen zijn er dus bíj gekomen en gaan niet ten koste van de eigen
// dekking; dat is precies de ruil die de blauwdruk niet wil maken.
//
// 3.3 staat op 9 omdat het derde leerdoel daar drie brononderwerpen draagt die
// niet samen te vatten zijn in één vraag: welke gegevens je over jezelf deelt,
// wat je van een ander niet doorstuurt (cyberpesten) en wat je niet doorstuurt
// omdat het niet klopt (nepnieuws). Vier vragen op dat ene doel, drie op de
// andere twee samen, plus twee terugkeervragen.
//
// MEER OPEN VRAGEN, ZOALS TL VRAAGT
// ---------------------------------
// Het tl-profiel vraagt "meer open vragen waarin de leerling iets uitlegt of
// vergelijkt". In ronde 2 was 17 van de 59 vragen open (29%), tegen 26%
// gemiddeld over de hele seed: geen zwaartepuntverschuiving dus, alleen het
// gemiddelde. Vijf gesloten vragen zijn omgezet naar open vragen waarin echt
// iets uitgelegd of vergeleken moet worden, en niet naar open vragen die om een
// woord vragen: de update-terugblik in 3.1, identiteitsfraude in 3.2, het
// doorsturen met een vraagteken erbij in 3.3, twee redeneringen naast elkaar
// wegen in de hoofdstuktoets, en de twee dingen die tegelijk misgaan in de
// terugblik van 3.5. Nu 22 van de 59 (37%).
//
// UITLEG PER ANTWOORD, NIET ALLEEN PER VRAAG
// -------------------------------------------
// Sectie 06 van de blauwdruk vraagt uitleg per antwoord. In ronde 2 hadden alle
// 33 goede antwoorden een explanation, maar 113 van de 146 opties niet: de
// afleiders hadden alleen misconception, en dat veld is volgens PATROON.md
// docentmateriaal voor de nakijkstapel. Wie de verkeerde knop koos las dus
// alleen de algemene feedback van de vraag. Alle 108 opties in dit hoofdstuk
// hebben nu een eigen explanation, ook de afleiders: die zegt de leerling
// waaróm juist die knop niet klopt, in zijn eigen geval. Het veld misconception
// staat er onveranderd naast en blijft voor de docent.
//
// WAAR CYBERPESTEN EN NEPNIEUWS HANGEN (hersteld in ronde 2)
// ----------------------------------------------------------
// Ronde 1 gaf 3.3 een VIERDE leerdoel voor cyberpesten en nepnieuws. Dat was de
// verkeerde oplossing: het jaarplan geeft 3.3 drie leerdoelen, de blauwdruk
// staat er hooguit drie toe ("bij 4+ wordt de keten te lang voor één les") en
// de validator weigerde het hoofdstuk daarop. Splitsen kan hier niet, want het
// jaarplan legt de vijf paragrafen van hoofdstuk 3 vast. Het vierde doel is dus
// weg en de vragen hangen nu waar ze inhoudelijk thuishoren:
//   - niet doorsturen (een bewerkte foto, een bericht dat niet klopt) onder
//     3.3-3, "welke gegevens je beter niet online deelt";
//   - herkennen en handelen (screenshots, blokkeren, melden) onder 3.4-1,
//     "een verdacht bericht herkennen en zeggen wat je dan doet";
//   - zelf controleren ("kun je alles geloven wat op internet staat") onder
//     3.4-2, "hoe je jezelf en je gegevens online beschermt".
// De prompts zijn daarvoor herschreven, zodat elke vraag het doel waaraan hij
// hangt ook echt meet. De uitleg over cyberpesten en nepnieuws staat onveranderd
// in de theorie van 3.3 en 3.4, met de vooruitwijzing naar hoofdstuk 6, en de
// definities staan in de feedback van de bijbehorende vragen.
//
// De blauwdruk noemt 15 tot 20 vragen als startwaarde voor een hoofdstuktoets,
// maar die startwaarde gaat uit van minder leerdoelen. Dit hoofdstuk heeft er
// elf, en de hardere regel (elk doel minstens twee keer, want het toetseffect
// straalt niet uit naar niet-bevraagde stof) komt daarmee op 29 uit. De
// koppeling staat in het veld leerdoel van elke vraag. Elke vraag is nagelopen
// op de vraag of hij het doel waaraan hij hangt ook echt meet: het woord uit het
// doel moet in de prompt, in het goede antwoord of in het modelantwoord terug te
// vinden zijn.
//
// DE ANTWOORDSLEUTEL VERKLAPT ZICHZELF NIET MEER OP LENGTE
// --------------------------------------------------------
// In ronde 1 had 30 van de 33 meerkeuzevragen het langste antwoord als goede
// antwoord; blind de langste knop klikken leverde 15/17 op de hoofdstuktoets.
// Dat kwam doordat het goede antwoord steeds de redengevende bijzin kreeg
// ("..., want de code komt op jouw telefoon binnen") terwijl de afleiders kort
// bleven. Alle 33 meerkeuzevragen zijn nagelopen. De redengeving staat nu in
// het veld explanation of in de feedback, waar de leerling hem ná zijn antwoord
// leest, en de vier opties zijn even lang gemaakt. Het goede antwoord is nu nog
// in 8 van de 33 vragen het langste, en dat is precies wat toeval oplevert.
//
// 3.5 is de vrijwillige plusparagraaf. De hoofdstuktoets in 3.4 stelt daar geen
// enkele vraag over: wie de plus overslaat mist niets van de leerlijn. Andersom
// mag de quiz van 3.5 wél terugkijken naar 3.2 en 3.3.
//
// DE ANTWOORDSLEUTEL EN DE DRIE WACHTWOORDEISEN (hersteld in ronde 4)
// --------------------------------------------------------------------
// 3.1 vraag 6 en toetsitem 28 raadden allebei een wachtwoord aan zonder
// symbool, terwijl de theorie van 3.1 symbolen als harde eis noemt. Allebei de
// goede antwoorden hebben nu een uitroepteken ("Gele fiets zoekt maandag 9!",
// "Blauwe kaars eet zaterdag 7!") en de explanation bij het goede antwoord van
// vraag 6 telt de drie eisen hardop af in plaats van symbolen weg te laten.
//
// Belangrijker nog: afleider 3 van diezelfde vraag ("Wachtwoord123!, want die
// voldoet aan alle eisen") haalt de drie eisen wél en werd fout gerekend op een
// raadlijst-argument dat nergens in de leerstof stond. Dat argument staat nu in
// theorieblok A van 3.1 en in de samenvatting van 3.1, en de explanation bij
// die afleider verwijst er expliciet naar: eerst de erkenning dat de eisen
// gehaald worden, dan de valkuil die die eisen niet afvangen. Verandert iemand
// later de theorie van 3.1, dan moet deze explanation mee.
//
// TWEE TOETSITEMS DIE HUN EIGEN DOEL NIET MATEN (ronde 4)
// --------------------------------------------------------
// Toetsitem 18 hing aan "wat een cybercrimineel doet" maar vroeg in de praktijk
// de definitie van hacken; toetsitem 17 dekte identiteitsfraude al. Item 18
// vraagt nu waar een cybercrimineel op uit is en hoe hij daaraan komt, met
// hacken, cyberpesten en nepnieuws als afleiders. De definitie van hacken zelf
// blijft in theorieblok B van 3.1 staan en komt in drie andere items terug als
// afleider met uitleg, dus er verdwijnt niets uit de bron.
//
// Toetsitem 21 vroeg "welke stap zet je als eerste" en gaf er in het goede
// antwoord twee, terwijl de steunoefening van 3.3 juist de volgorde leert. Het
// mat bovendien hetzelfde weetje als afsluitvraag 2 van 3.3, met een bijna
// gelijkluidend goed antwoord. Het item vraagt nu wie er ná het op privé zetten
// nog meekijkt. Zelfde leerdoel, ander meetmoment: de leerling moet hier zien
// dat een instelling niet terugwerkt en dat de volgerslijst daarom apart moet.
//
// HET CERTIFICAAT IN 3.5 (hersteld in ronde 3)
// ---------------------------------------------
// Quizvraag 2 van 3.5 rekent de afleider "de eigenaar van een https-site is
// door de overheid gecontroleerd" fout. In ronde 2 had theorieblok A van
// diezelfde paragraaf precies dat beeld opgeroepen: een certificaat als
// "digitaal paspoort" van een "controlerende organisatie". De leerling werd dus
// afgerekend op wat de eigen theorie hem verteld had. De theorie zegt nu wat er
// werkelijk gebeurt: het certificaat hangt aan de domeinnaam, de uitgever
// controleert alleen of de aanvrager dat adres beheert, en over de eigenaar
// wordt bij een gratis certificaat niets gecontroleerd. De explanation bij die
// afleider zegt dat nu ook met zoveel woorden, zodat de leerling die hem koos
// leest waar zijn beeld vandaan kwam en waarom het niet klopt.
//
// GEEN VOORBEELD DAT ALS OEFENOPGAVE TERUGKOMT
// ---------------------------------------------
// De exampleHtml-blokken in dit bestand zijn ongemoeid gelaten; ze staan waar
// de blauwdruk ze wil, vóór het oefenen. Wat veranderd is, staat in het
// structuurbestand: de oefenopgaven die in ronde 2 woordelijk hetzelfde item
// waren als het voorbeeld ervoor, zijn vervangen door een ander geval bij
// hetzelfde leerdoel. Twee vragen in dit bestand hingen daar aan vast en zijn
// meeveranderd: quizvraag 5 van 3.3 blijft staan (de plusopgave ernaast is
// vervangen) en de twee startvragen van 3.4 in het structuurbestand overlappen
// niet meer met toetsitem 26 en 27 hier.
//
// RONDE 3: TOETSITEM 23 REKENDE EEN GOED ANTWOORD FOUT
// ----------------------------------------------------
// De hoofdstuktoets van 3.4 vraagt bij "Welke gegevens horen echt niet op een
// openbaar profiel?" om het criterium dat 3.3 drie keer inhamert en dat in de
// feedback van diezelfde vraag herhaald wordt: zegt dit iets over WAAR je
// bent, WANNEER je er bent, of WIE je officieel bent? Een afleider luidde "Een
// foto van je kat en een selfie met je klasgenoten op het schoolplein na de
// laatste les". Die post zegt waar je bent en wanneer je er bent, voldoet dus
// precies aan het criterium, en werd toch fout gerekend. De explanation
// verving het criterium bovendien zonder iets te zeggen door een ander ("het
// verschil zit tussen een gewone foto en een foto van een document"). Een
// leerling die netjes uit de leerstof redeneert werd zo afgestraft op een
// scorende toets en las daarna een uitleg die de regel van het hoofdstuk
// ondergroef. Het botste ook met de zelf-oefening van 3.3 en met het
// modelantwoord van de praktijkopdracht daar, dat "de plek waar ik sport"
// juist wél als niet-te-delen gegeven opvoert.
//
// De plaats- en tijdbepaling zijn uit de afleider geschrapt ("Een foto van je
// kat en een selfie met je klasgenoten") en de explanation verwijst nu naar
// hetzelfde drie-vragen-criterium in plaats van een nieuw criterium te
// introduceren. Daarmee vervalt meteen de lengtevoorsprong: die afleider was
// met 15 woorden de langste van de vier en tegelijk de enige die het geleerde
// criterium raakte, en dus juist aantrekkelijk voor wie goed leest.
//
// Het goede antwoord is bij die ingreep ook ingekort, van "Je adres, je
// schoolrooster en een foto van een document met je handtekening" naar "Je
// adres, je rooster en een foto van een identiteitsbewijs". Anders was het
// goede antwoord zelf de langste optie geworden en had de vraag op lengte te
// raden zijn. De drie gegevens dekken nu een-op-een de drie vragen: adres =
// waar, rooster = wanneer, identiteitsbewijs = wie je officieel bent.
//
// TOETSITEM 16, AFLEIDER 4
// ------------------------
// De stam zegt "Je probeert bij alle vier eerst na te gaan van wie de actie
// komt". Bij de afleider "Een actie zonder voorwaarden waarbij je alleen je
// mailadres en nummer invult" viel de explanation terug op de voorwaarden,
// terwijl er bij die optie helemaal niet staat wie de afzender is. De
// afwijzing begint nu waar de stam hem belooft: bij de eerste controle.
//
// KERNBEGRIPPEN NA DE VERPLAATSING IN 3.1
// ---------------------------------------
// De bewaarplekken zijn in ronde 3 van theorieblok A naar B verhuisd (zie het
// structuurbestand). "wachtwoordbeheer" is meeverhuisd naar B; blok A kreeg er
// "uniek wachtwoord" en "raadprogramma" voor terug, allebei begrippen die in
// die tekst zelf uitgelegd worden. Let op twee grenzen die hier meteen tegen
// elkaar aan liepen: maximaal 4 kernbegrippen per blok, en een kernbegrip in
// maximaal 2 blokken. "beveiligd document" en "authenticator app" zijn daarom
// geen kernbegrip meer (blok B zat op 6); ze staan gewoon in de theorie en in
// de vragen. "wachtwoordzin" kon niet: dat staat al in 1.2 theorie en in de
// samenvatting van 1.2, en zou hier het derde blok zijn geweest.
//
// VIER RISICO'S, DRIE NOEMEN
// --------------------------
// De bron noemt vier risico's in één adem: wachtwoorden stelen, nepberichten
// sturen, pesten en data misbruiken. Het leerdoel vraagt er drie. Geen enkele
// vraag en geen enkele feedbackzin in dit bestand legt vast dat het er precies
// drie zijn, en pesten telt overal mee als goed antwoord.
//
// DE WIN-ACTIE VAN BOL.COM
// ------------------------
// De bron laat aanklikken dat je data bij een echte actie van een groot bedrijf
// met nette voorwaarden "geen gevaar" loopt, terwijl 3.1 leert dat een hack
// hele lijsten met inloggegevens buitmaakt. Die tegenspraak is opgelost zoals
// die met 1.2 over wachtwoordlengte: nette voorwaarden beschermen tegen
// DOORVERKOPEN van je gegevens, niet tegen een datalek. De vraag in 3.2 en het
// toetsitem hierover vragen daarom niet meer waar je data "geen gevaar" loopt,
// maar waar je je e-mailadres verantwoord invult; de feedback zegt er expliciet
// bij dat nul risico online nergens bestaat.
//
// ZINSLENGTE: EEN BAND, GEEN MAL
// ------------------------------
// De tl-band is 15 tot 20 woorden per zin, en dat is een GEMIDDELDE. In ronde 1
// viel geen enkele van de 257 gemeten zinnen buiten die band, en dat leverde
// tekst op die klinkt als een metronoom. Het gemiddelde zit nu nog steeds in de
// band, maar er staan bewust korte zinnen tussen die iets benadrukken ("Nul
// risico bestaat online nergens.", "Eén letter verschil is al genoeg.") en een
// enkele langere die een verband uitspint. De twee langste theorieblokken zijn
// bovendien in drie alinea's geknipt: 3.2B stond op 327 woorden in één blok van
// 19 gelijkvormige zinnen.
//
// De samenvattingen zijn terug naar 2 of 3 zinnen, zoals PATROON.md en
// blauwdrukstap 9 vragen. In ronde 1 stonden er 4 en 5; juist in het blok waar
// "ophalen boven samenvatten" geldt hoort de tekst kort te blijven.
//
// Bewust kort: de vraagregel en het openingsoordeel van een uitgewerkt
// voorbeeld ("Werkt dit?", "Nee.", "Wat concludeer je?"). Een uitgewerkt
// voorbeeld werkt doordat de vraag kort is en het antwoord meteen stelling
// neemt; daarna volgt de redenering wél in volle zinnen. Stapinstructies in de
// praktijkopdrachten blijven ook kort: "Stap 3: zet je account op privé" hoort
// geen zin van vijftien woorden te worden.
//
// WOORDKEUS
// ---------
// Vakbegrippen mogen bij tl abstract blijven, maar volwassen schrijftaal die
// niets toevoegt niet. Vier woorden die een brugklasser waarschijnlijk niet kent
// stonden in ronde 1 in feedback die de leerling wél leest; ze zijn vervangen:
// mechanisme -> hoe het werkt, stilzwijgend -> zonder iets te zeggen, volstrekt
// -> helemaal, überhaupt -> nog. Vakbegrippen die er wél toe doen worden in de
// tekst zelf uitgelegd op het moment dat ze vallen (instanties, klakkeloos,
// provider, secure, KVK-nummer).

export default {
  '3.1': {
    learningGoals: [
      "Je kunt drie risico's van internetgebruik noemen.",
      'Je weet wat twee-staps-verificatie is en waarom die je account beter beschermt.',
      'Je kunt uitleggen wat digitale weerbaarheid betekent.'
    ],
    theorie: [
      {
        keyTerms: ['veilig internetten', 'uniek wachtwoord', 'raadprogramma'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Milan gebruikt op zijn game-account, zijn mail en een webshop hetzelfde wachtwoord: Milan2013!. Die webshop wordt gehackt. Welk risico loopt Milan nu precies?</p>',
          '<p><strong>Antwoord.</strong> Twee risico’s tegelijk. Ten eerste ligt zijn wachtwoord op straat, want bij een hack worden hele lijsten met inloggegevens buitgemaakt. Ten tweede proberen de daders dat ene wachtwoord meteen bij zijn mail en zijn game-account, want mensen hergebruiken vaak. En zijn mailadres is de sleutel tot al zijn andere accounts: wie daarin kan, vraagt overal een nieuw wachtwoord aan. De naam plus een jaartal maakt het nog erger, want dat is precies wat een raadprogramma als eerste probeert.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['wachtwoordbeheer', 'hacken', 'twee-staps-verificatie', 'digitale weerbaarheid'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sara krijgt om half twaalf ’s nachts een sms met een inlogcode voor Instagram, terwijl zij helemaal niet inlogt. Wat betekent dat, en wat doet ze?</p>',
          '<p><strong>Antwoord.</strong> Het betekent dat iemand haar wachtwoord al heeft en op dit moment probeert in te loggen. De tweede stap houdt hem tegen, want die code komt op háár telefoon binnen. Ze geeft die code dus aan niemand door, ook niet als er meteen een appje achteraan komt met een smoes. Daarna verandert ze direct haar wachtwoord, en kiest ze er een die ze nergens anders gebruikt. Dat nieuwe wachtwoord onthoudt ze niet uit haar hoofd: ze zet het in haar wachtwoordbeheer, achter één hoofdwachtwoord. Een beveiligd document op haar telefoon had ook gemogen; een briefje in haar etui niet. Dat is digitale weerbaarheid in de praktijk: ze ziet het signaal en zet zelf de goede stap.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: "<p>Veilig internetten begint bij vier risico's: diefstal van je wachtwoord, nepberichten, online gepest worden en misbruik van je data. Daartegen helpt een lang en uniek wachtwoord van minstens twaalf tekens met een hoofdletter, een cijfer en een leesteken erin, want lengte weegt het zwaarst. Bouw het nooit op een bekend woord als wachtwoord of welkom, want die staan bovenaan de lijst die een raadprogramma als eerste probeert. Twee-staps-verificatie zet er een tweede slot op.</p>",
      keyTerms: ['veilig internetten', 'twee-staps-verificatie']
    },
    vragen: [
      {
        prompt: "Welke rij noemt alleen dingen die de les een risico van internetgebruik noemt?",
        leerdoel: "Je kunt drie risico's van internetgebruik noemen.",
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Je batterij loopt leeg, je scherm krast en je wifi is traag.', correct: false, explanation: 'Dit is alle drie pech met je apparaat. Er is niemand die er beter van wordt en niemand die jou ermee wil raken, en dat heeft een risico juist wel.', misconception: 'Verwart ongemak met het apparaat met risico voor jou en je gegevens.' },
          { text: 'Je krijgt veel reclame, je telefoon wordt warm en je abonnement is duur.', correct: false, explanation: 'Vervelend en duur, maar je gegevens blijven waar ze horen. Een risico gaat erover wat een ander met jou of met jouw gegevens wil doen.', misconception: 'Denkt bij risico aan geld en gemak in plaats van aan veiligheid.' },
          { text: 'Iemand steelt je wachtwoord, iemand pest je en je data wordt misbruikt.', correct: true, explanation: 'De les noemt er vier: wachtwoorden stelen, nepberichten sturen, pesten en data misbruiken. Dit zijn er drie van, en dat is genoeg.' },
          { text: 'Je vergeet je oplader, je app crasht en je opslag zit vol.', correct: false, explanation: 'Alle drie overkomen ze je zonder dat er iemand achter zit. De les noemt juist de dingen die iemand anders met opzet doet.', misconception: 'Ziet technische pech aan voor een risico dat iemand anders veroorzaakt.' }
        ],
        feedback: 'Een risico gaat over wat een ander met jou of met jouw gegevens wil doen. Pesten hoort er daarom net zo goed bij als diefstal, nepberichten en misbruik van data. Bij pech met je apparaat wordt niemand er beter van.'
      },
      {
        prompt: 'Een cybercrimineel heeft jouw wachtwoord van Instagram, maar jij hebt twee-staps-verificatie aanstaan. Wat gebeurt er als hij probeert in te loggen?',
        leerdoel: 'Je weet wat twee-staps-verificatie is en waarom die je account beter beschermt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Hij komt gewoon binnen, want het wachtwoord dat hij heeft klopt.', correct: false, explanation: 'Met de tweede stap aan is het wachtwoord niet meer genoeg. Er volgt daarna nog een code, en die komt op jouw telefoon binnen.', misconception: 'Denkt dat het wachtwoord de enige controle is die er plaatsvindt.' },
          { text: 'Hij komt binnen, maar mag daar alleen kijken en niets plaatsen.', correct: false, explanation: 'Zo werkt inloggen niet: je bent binnen of je bent het niet. Een halve toegang bestaat er niet.', misconception: 'Denkt dat een gestolen wachtwoord maar een halve toegang geeft.' },
          { text: 'Instagram verwijdert jouw account meteen uit voorzorg.', correct: false, explanation: 'De app ruimt niets voor je op. Hij vraagt alleen om de tweede stap, en precies daar loopt de inbreker vast.', misconception: 'Denkt dat de app het probleem oplost door je account op te ruimen.' },
          { text: 'Hij blijft steken bij de tweede stap van het inloggen.', correct: true, explanation: 'De tweede stap vraagt iets wat jij hebt: de code komt binnen op jouw telefoon en die ligt niet bij hem op tafel.' }
        ],
        feedback: 'De tweede stap vraagt iets wat jij bezit, en niet nog een keer iets wat je weet. Een gestolen wachtwoord loopt daar vast. De code komt namelijk binnen op jouw eigen telefoon, en die ligt gewoon in jouw zak.'
      },
      {
        prompt: 'Als je wachtwoord maar ingewikkeld genoeg is, heb je twee-staps-verificatie niet meer nodig.',
        waar: false,
        leerdoel: 'Je weet wat twee-staps-verificatie is en waarom die je account beter beschermt.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        feedback: 'Hoe ingewikkeld je wachtwoord ook is, bij een lek of bij phishing ligt hij er alsnog uit. Moeilijkheid beschermt namelijk alleen tegen raden, en juist raden is bijna nooit hoe het misgaat. De tweede stap dekt precies dat gat af, want daarvoor is jouw eigen telefoon nodig.'
      },
      {
        prompt: 'Leg uit wat digitale weerbaarheid betekent en geef één voorbeeld waaraan iemand kan zien dat jij weerbaar bent.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat digitale weerbaarheid betekent.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'reflecteren',
        modelAnswer: 'Digitale weerbaarheid betekent dat je jezelf kunt beschermen tegen dingen die niet veilig of eerlijk zijn op internet. Je merkt zelf dat er iets niet klopt en je zet dan de goede stap. Een voorbeeld: ik heb twee-staps-verificatie aangezet op mijn mail, en als ik een vreemd appje krijg dat om geld vraagt, bel ik die persoon eerst op het nummer dat ik al had.',
        nakijkpunten: [
          'Noemt dat het gaat om jezelf beschermen tegen onveilige of oneerlijke dingen online.',
          'Geeft een concreet voorbeeld van eigen gedrag, niet alleen een definitie.',
          'Laat zien dat weerbaarheid een keuze van de leerling zelf is.'
        ],
        feedback: 'Weerbaarheid zit in wat je doet, niet in wat je kunt opnoemen. Een tweede stap die echt aanstaat is daarom beter bewijs dan de mooiste definitie op papier.'
      },
      {
        prompt: "Welk risico uit deze paragraaf loop je wél bij een briefje in je etui en niet bij een beveiligd document op je telefoon? Leg je antwoord uit.",
        type: 'open',
        leerdoel: "Je kunt drie risico's van internetgebruik noemen.",
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Het risico dat iemand je wachtwoord steelt. Een briefje kan iedereen die je etui openmaakt zomaar lezen en fotograferen, en je merkt niet eens dat het gebeurd is. Een beveiligd document zit achter een code of je vingerafdruk, dus alleen jij kunt erbij. Datzelfde geldt voor wachtwoordbeheer, waar één sterk hoofdwachtwoord de kluis dichthoudt. Het risico dat overblijft bij die twee is dat je je code of hoofdwachtwoord zwak maakt of vergeet.',
        nakijkpunten: [
          'Benoemt diefstal van je wachtwoord als het risico waar het om gaat.',
          'Noemt bij het briefje dat anderen het ongemerkt kunnen lezen of kopiëren.',
          'Noemt bij het beveiligde document of de kluis het slot dat de leerling zelf bewaakt.'
        ],
        feedback: 'Het verschil zit in wie erbij kan zonder dat jij er ooit iets van merkt. Een beveiligd bestand heeft één deur die jij bewaakt, terwijl een briefje er geen enkele heeft.'
      },
      // Terugkeervraag 1: leerdoel uit hoofdstuk 1, paragraaf 1.2.
      {
        prompt: 'Terugblik op 1.2: welk wachtwoord beschermt je schoolaccount het best?',
        leerdoel: 'Je weet waaraan een sterk wachtwoord voldoet.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Zw!7q, want er zitten een hoofdletter, een cijfer en een symbool in.', correct: false, explanation: 'Een hoofdletter, een cijfer en een symbool vullen samen maar één van de drie eisen in. De eerste eis is minimaal twaalf tekens, en dit zijn er vijf.', misconception: 'Denkt dat vreemde tekens genoeg zijn en vergeet dat lengte de eerste eis is.' },
          { text: 'Gele fiets zoekt maandag 9!, en alleen op dit ene account gebruikt.', correct: true, explanation: 'Alle drie de eisen: 27 tekens, een hoofdletter met een cijfer en een uitroepteken, en nergens anders in gebruik. En hij is op niets bekends gebouwd.' },
          { text: 'Wachtwoord123!, want die voldoet aan alle eisen en onthoud je makkelijk.', correct: false, explanation: 'Op papier klopt het: veertien tekens, een hoofdletter, cijfers en een symbool. Maar 3.1 noemt ook de valkuil die deze drie eisen niet afvangen: dit is een bekend woord met een cijferreeks erachter, en juist zulke wachtwoorden staan bovenaan de lijst die een raadprogramma als eerste probeert.', misconception: 'Vinkt de drie eisen af en slaat de valkuil over: een bekend woord met een reeks erachter staat op elke raadlijst.' },
          { text: 'Je achternaam met je geboortejaar en een uitroepteken erachter.', correct: false, explanation: 'Je achternaam en je geboortejaar zijn van jou online zo op te zoeken. Wat een ander kan vinden, hoort niet in je wachtwoord.', misconception: 'Kiest gegevens die van jou online gewoon te vinden zijn.' }
        ],
        feedback: 'In 3.1 staat het zo: van de drie eisen weegt de lengte het zwaarst, met twaalf tekens als minimum. Vier losse woorden met een cijfer en een uitroepteken erbij halen alle drie de eisen en zijn ruim langer dan een kort geval als Zw!7q. Let daarnaast op de valkuil uit 3.1: een wachtwoord dat op een bekend woord gebouwd is, haalt de eisen wel maar staat op de raadlijst.'
      },
      // Terugkeervraag 2: leerdoel uit hoofdstuk 2, paragraaf 2.2.
      {
        prompt: 'Terugblik op hoofdstuk 2: leg uit waarom een telefoon die nooit geüpdatet wordt jou ook op internet onveiliger maakt, en waarom dat juist erger wordt naarmate een lek langer bekend is.',
        type: 'open',
        leerdoel: 'Je weet waarom je je device regelmatig moet updaten.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'samen_oefenen',
        modelAnswer: 'Een update repareert fouten in het besturingssysteem, en sommige van die fouten zijn gaten in de beveiliging. Langs zo\'n gat kan iemand bij mijn gegevens komen zonder dat hij mijn wachtwoord nodig heeft. Zodra een lek gerepareerd is, wordt het ook openbaar gemaakt, en dan weten aanvallers precies waar ze moeten zoeken. Voor toestellen die niet geüpdatet zijn wordt zo\'n bekend lek dus juist makkelijker te misbruiken naarmate de tijd verstrijkt.',
        nakijkpunten: [
          'Legt uit dat een update gaten in de beveiliging dichtmaakt en niet alleen de snelheid verbetert.',
          'Koppelt het lek aan toegang tot gegevens of tot het account van de leerling.',
          'Verklaart waarom een ouder, bekend lek gevaarlijker is dan een onbekend lek.'
        ],
        feedback: 'Een bekend lek in je besturingssysteem is voor een aanvaller gratis gereedschap dat overal rondslingert. Zolang jij niet updatet blijft dat gereedschap op jouw toestel werken, ook al is de fout allang gerepareerd voor iedereen die wel updatet.'
      }
    ]
  },

  '3.2': {
    learningGoals: [
      'Je kunt uitleggen wat phishing is.',
      'Je kunt aan een bericht of e-mail zien of het phishing kan zijn.',
      'Je weet wat identiteitsfraude is en wat een cybercrimineel doet.'
    ],
    theorie: [
      {
        keyTerms: ['phishing', 'win-actie', 'nepbericht'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een mail die van je bank lijkt te komen zegt dat je binnenkort een nieuwe pas krijgt. Hij vraagt je daarom om je oude pas op te sturen, met je pincode erbij. Waarom werkt juist deze smoes zo goed?</p>',
          '<p><strong>Antwoord.</strong> Omdat een nieuwe pas krijgen iets heel gewoons is: dat gebeurt echt om de paar jaar. De mail sluit dus aan bij iets wat je herkent, en dat maakt hem geloofwaardig. Daardoor let je op de smoes en niet meer op de vraag zelf. En die vraag is het echte alarmsignaal, want een bank vraagt nooit om je pincode. Ook je pas hoeft nooit terug, ook niet als je inderdaad een nieuwe pas krijgt. Herken je dat patroon, dan werkt het bij een pakketmail of bij een winactie net zo. Steeds staat er een gewoon klinkende reden, en daarachter een vraag die nooit gesteld hoort te worden.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['cybercrimineel', 'identiteitsfraude', 'afzender', 'voorwaarden'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je krijgt een mail die van ING lijkt te komen, met service@ing-klantcheck.nl als afzender erboven. In het bericht staat: "Uw rekening wordt binnen 24 uur geblokkeerd, log direct in via onderstaande link". Waaraan kun je aan dit bericht zien dat het om phishing gaat, en niet om echte post?</p>',
          '<p><strong>Antwoord.</strong> Aan drie dingen tegelijk. Ten eerste klopt het adres van de afzender niet: de echte bank mailt vanaf ing.nl en niet vanaf ing-klantcheck.nl. Ten tweede zit er haast in het bericht, en haast is er om je te laten klikken vóór je nadenkt. Ten derde vraagt een bank nooit per mail om inloggen of om je pincode. Je klikt dus niet, maar je zoekt het telefoonnummer op de officiële website op en belt dat. Bij de zes voorbeelden van de Consumentenbond verderop in deze paragraaf schat je per mail eerst zelf in of hij echt is. Het zijn steeds dezelfde drie signalen waarop je dat oordeel baseert, en dat maakt oefenen zinvol.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Bij phishing stuurt een cybercrimineel een nepbericht dat op een echte mail of app lijkt. Je herkent het aan de afzender die niet klopt, aan de haast, aan de smoes en aan de vraag om een wachtwoord of pincode. Lukt het hem, dan gebruikt hij jouw naam en foto om ook je vrienden op te lichten: dat heet identiteitsfraude.</p>',
      keyTerms: ['phishing', 'identiteitsfraude']
    },
    vragen: [
      {
        prompt: 'Wat is phishing?',
        leerdoel: 'Je kunt uitleggen wat phishing is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Vissen op een plek waar dat eigenlijk niet mag.', correct: false, explanation: 'Het woord komt inderdaad van fishing, maar er wordt gevist naar jouw gegevens en niet in het water.', misconception: 'Vertaalt het woord letterlijk en zoekt geen digitale betekenis.' },
          { text: 'Met een nepbericht iemand geld of gegevens laten afstaan.', correct: true, explanation: 'De les zegt het zo: met een nepbericht iemand op een link laten klikken, geld afhandig maken of data stelen. Het nepbericht is het lokaas; de link, het geld of de gegevens zijn de vangst.' },
          { text: 'Iemands wachtwoord raden door heel vaak achter elkaar te proberen.', correct: false, explanation: 'Dat is hacken. Bij phishing wordt er niets geraden of gekraakt, want het slachtoffer geeft zijn gegevens zelf.', misconception: 'Denkt dat phishing hetzelfde is als het kraken van een wachtwoord.' }
        ],
        feedback: 'Bij phishing hoeft niemand iets te kraken: het slachtoffer geeft zijn gegevens zelf, omdat het bericht echt lijkt. Klikken op een link, geld overmaken of een formulier invullen zijn daarvan de drie bekendste vormen.'
      },
      {
        prompt: 'Een bank of de overheid stuurt je soms een mail waarin ze om je pincode vragen, en dan mag je die invullen.',
        waar: false,
        leerdoel: 'Je kunt aan een bericht of e-mail zien of het phishing kan zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Instanties als banken en de overheid vragen je nooit per mail om een wachtwoord of een pincode. Wie dat toch doet, is nep. Hoe echt de rest van die mail er ook uitziet en hoeveel haast er ook in staat, aan die ene regel verandert niets.'
      },
      {
        prompt: 'Leg uit wat identiteitsfraude is en waarom je bij identiteitsfraude wél schade oploopt terwijl jij niet degene bent die bestolen wordt.',
        type: 'open',
        leerdoel: 'Je weet wat identiteitsfraude is en wat een cybercrimineel doet.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        modelAnswer: 'Identiteitsfraude is dat iemand met mijn naam en mijn foto doet alsof hij mij is, om daarmee iemand anders te bestelen. Meestal vraagt hij mijn vrienden om geld via WhatsApp of via een nagemaakt profiel. Het geld verdwijnt bij mijn vrienden, dus zij zijn de bestolen partij. Ik loop toch schade op, want mijn vrienden zijn opgelicht in mijn naam en vertrouwen mijn berichten daarna minder. Ik ben in dit geval niet het doelwit maar het masker.',
        nakijkpunten: [
          'Geeft een correcte omschrijving met naam en foto van de leerling en een ander als slachtoffer.',
          'Maakt onderscheid tussen wie het geld kwijtraakt en wie de identiteit levert.',
          'Noemt schade voor de leerling zelf, bijvoorbeeld aan vertrouwen of aan zijn goede naam.'
        ],
        feedback: 'Bij identiteitsfraude ben jij niet het doelwit maar het masker. Iemand anders wordt opgelicht in jouw naam, en die persoon vertrouwt het bericht juist omdat hij denkt dat het van jou komt.'
      },
      {
        prompt: 'Je krijgt een mail van "ING" met de vraag om binnen 24 uur in te loggen via een link. Beschrijf stap voor stap hoe jij controleert of dit phishing is.',
        type: 'open',
        leerdoel: 'Je kunt aan een bericht of e-mail zien of het phishing kan zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        modelAnswer: 'Ik klik nergens op en open geen bijlage. Ik kijk eerst naar de afzender en vergelijk dat adres met het adres dat op de officiële website van ING staat. Daarna let ik op de haast en op de vraag om in te loggen, want een bank vraagt dat nooit per mail. Ik let ook op de smoes: klinkt de reden gewoon, dan is dat juist het gereedschap van de oplichter. Bij twijfel zoek ik het telefoonnummer op de officiële site op en bel ik ING zelf. Ten slotte meld ik de mail en gooi ik hem weg.',
        nakijkpunten: [
          'Begint met niet klikken en niets invullen.',
          'Controleert de afzender tegen het adres op de officiële website.',
          'Belt of controleert via een nummer dat niet uit de mail zelf komt.'
        ],
        feedback: 'De volgorde is hier de kern: eerst niets doen, dan controleren via een kanaal dat je zelf opzoekt. Melden en blokkeren komen pas daarna, want anders klik je al voordat je iets weet.'
      },
      {
        prompt: 'In 3.1 heb je twee-staps-verificatie aangezet. Leg uit waarom phishing toch gevaarlijk blijft, ook met die tweede stap aan.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat phishing is.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: 'Twee-staps-verificatie beschermt tegen iemand die alleen je wachtwoord heeft. Bij phishing geef je je gegevens echter zelf, omdat je denkt dat het bericht echt is. Een goede nepsite vraagt daarna gewoon ook om de code uit je app, en de oplichter gebruikt die code binnen een paar seconden. De tweede stap sluit dus een deur, maar phishing werkt door mij zover te krijgen dat ik die deur zelf openzet.',
        nakijkpunten: [
          'Legt uit dat de tweede stap alleen een gestolen wachtwoord tegenhoudt.',
          'Noemt dat het slachtoffer bij phishing zelf gegevens of codes afstaat.',
          'Trekt een conclusie over waar de zwakke plek dan zit.'
        ],
        feedback: 'Techniek beschermt je tegen inbrekers, maar niet tegen bezoek dat jij zelf de deur opendoet. Daarom blijft het controleren van de afzender nodig, ook als er een tweede inlogstap aanstaat.'
      },
      // Terugkeervraag 1: leerdoel uit 3.1.
      {
        prompt: "Terugblik op 3.1: welk risico uit die paragraaf gebruikt een phishingmail als eerste?",
        leerdoel: "Je kunt drie risico's van internetgebruik noemen.",
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'samen_oefenen',
        options: [
          { text: 'Misleiding met een nepbericht, want je moet de mail eerst geloven.', correct: true, explanation: 'Zonder die misleiding klikt niemand, en pas daarna volgen diefstal of misbruik.' },
          { text: 'Diefstal van je wachtwoord, want de mail neemt dat meteen mee.', correct: false, explanation: 'Een mail kan zelf niets meenemen. Je wachtwoord komt pas los als jij het invult, en daarvoor moet je de mail eerst geloven.', misconception: 'Denkt dat de mail zelf al iets steelt, in plaats van jou eerst te overtuigen.' },
          { text: 'Misbruik van je data, want je gegevens staan al in de mail.', correct: false, explanation: 'Misbruik staat aan het eind van de keten en niet aan het begin. Eerst moet de mail geloofd worden, pas daarna heeft de dader iets in handen.', misconception: 'Denkt dat de oplichter jouw gegevens al heeft voordat je iets invult.' },
          { text: 'Online gepest worden, want de mail is onaardig bedoeld.', correct: false, explanation: 'Pesten is wel een risico uit 3.1, maar bij phishing is de dader op winst uit en niet op kwetsen. Hij kent jou niet eens.', misconception: 'Herkent pesten wel als risico uit de les, maar niet dat phishing op winst uit is en niet op kwetsen.' }
        ],
        feedback: "De risico's uit 3.1 zitten in phishing achter elkaar: eerst misleiden, daarna stelen en dan misbruiken. Misleiding met een nepbericht is de eerste schakel, want zonder die stap komt de dader nergens."
      },
      // Terugkeervraag 2: leerdoel uit 3.1.
      {
        prompt: 'Terugblik op 3.1: bij twee-staps-verificatie heeft een dief naast jouw wachtwoord ook jouw telefoon nodig.',
        waar: true,
        leerdoel: 'Je weet wat twee-staps-verificatie is en waarom die je account beter beschermt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Iets weten en iets bezitten zijn twee heel verschillende soorten bewijs dat jij het echt bent. Precies dat verschil maakt de tweede stap zo lastig te omzeilen, want stelen op afstand lukt daar niet.'
      }
    ]
  },

  '3.3': {
    learningGoals: [
      'Je weet dat wat je online zet veel langer blijft bestaan dan je denkt.',
      'Je kunt je privacy-instellingen zo zetten dat alleen mensen die je kent je profiel zien.',
      'Je kunt uitleggen welke gegevens je beter niet online deelt.'
    ],
    theorie: [
      {
        keyTerms: ['digitale voetafdruk', 'gevoelige informatie'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Yara plaatst een grappige foto in haar verhaal en haalt hem na tien minuten weg. Waarom is die foto daarmee nog niet uit haar digitale voetafdruk verdwenen?</p>',
          '<p><strong>Antwoord.</strong> In die tien minuten kan iedereen die het zag een screenshot van de foto maken. Zo’n kopie staat niet meer onder haar beheer, en zij weet niet eens dat hij bestaat. Die kopie kan doorgestuurd worden naar mensen die het verhaal nooit gezien hebben. Daarnaast bewaart de app zelf ook nog een tijd gegevens op zijn servers. Verwijderen haalt dus alleen jouw exemplaar weg, niet de exemplaren van anderen.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['privacy-instellingen', 'cyberpesten', 'nepnieuws', 'spreekwoord'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Jesse zet in zijn bio: "Alleen voor vrienden, onbekenden wegblijven." Zijn account staat verder gewoon openbaar. Werkt dit?</p>',
          '<p><strong>Antwoord.</strong> Nee. Een zin in je bio is een verzoek, geen instelling: de app doet er niets mee. Alleen de knop bij de privacy-instellingen bepaalt wie je berichten kan zien. En ook daarna moet Jesse zijn volgerslijst nalopen, want honderd onbekende volgers die hij ooit heeft geaccepteerd blijven gewoon meekijken. Wie hem daarna toch lastigvalt kan hij blokkeren en melden bij een docent of ouder. Dat is precies wat jij ook doet als je ergens in een groepschat cyberpesten ziet.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Alles wat je post telt mee in je digitale voetafdruk. Verwijderen wist die voetafdruk niet. Met je privacy-instellingen bepaal je wie je profiel ziet, je adres en je rooster horen er niet op, en een bewerkte foto stuur je nooit door.</p>',
      keyTerms: ['digitale voetafdruk', 'privacy-instellingen']
    },
    vragen: [
      {
        prompt: 'Je bent geslaagd voor je rijbewijs en wilt een foto van dat rijbewijs posten. Wat is hier het probleem?',
        leerdoel: 'Je kunt uitleggen welke gegevens je beter niet online deelt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je naam, geboortedatum en handtekening staan er voor iedereen op.', correct: true, explanation: 'Dat zijn precies de gegevens waarmee iemand zich voor jou kan uitgeven; een rijbewijs is een identiteitsbewijs.' },
          { text: 'De foto neemt te veel opslagruimte in beslag bij de app.', correct: false, explanation: 'Opslagruimte is het probleem van de app en niet van jou. Het gevaar zit in de gegevens die op dat rijbewijs staan.', misconception: 'Denkt aan een technisch bezwaar in plaats van aan een gevaar voor de leerling.' },
          { text: 'Het mag wettelijk niet, want je bent nog geen achttien jaar.', correct: false, explanation: 'Er is geen verbod op zo\'n foto. Het is geen regel maar een risico, en dat risico loop je zelf.', misconception: 'Denkt dat er een verbod bestaat, terwijl het om een risico gaat dat je zelf loopt.' },
          { text: 'Er is geen probleem, want je verwijdert de foto later gewoon.', correct: false, explanation: 'Verwijderen haalt alleen jouw eigen exemplaar weg. Wie in de tussentijd een screenshot maakte, heeft je gegevens nog steeds.', misconception: 'Denkt dat verwijderen een post echt uit de wereld haalt.' }
        ],
        feedback: "Een rijbewijs is een verzameling gegevens waarmee een ander jouw identiteit vrij eenvoudig kan nabootsen. Daarom hoort zo'n foto nergens online, ook niet in een verhaal dat na een dag verdwijnt."
      },
      {
        prompt: 'Hoe zorg je dat alleen mensen die je kent je profiel kunnen zien?',
        leerdoel: 'Je kunt je privacy-instellingen zo zetten dat alleen mensen die je kent je profiel zien.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Je zet in je bio dat onbekenden niet mogen meekijken.', correct: false, explanation: 'De app leest je bio niet en doet er dus niets mee. Alleen de schakelaar bij je instellingen sluit mensen echt buiten.', misconception: 'Denkt dat een tekst hetzelfde effect heeft als een instelling in de app.' },
          { text: 'Je post alleen nog berichten die na 24 uur vanzelf verdwijnen.', correct: false, explanation: 'In die 24 uur kan iedereen die het ziet een screenshot maken, en die kopie verdwijnt niet vanzelf.', misconception: 'Denkt dat tijdelijke berichten niet gekopieerd kunnen worden.' },
          { text: 'Je zet je account op privé en schoont je volgerslijst op.', correct: true, explanation: 'De instelling sluit onbekenden buiten en het opschonen haalt de onbekenden weg die er al in zaten.' }
        ],
        feedback: 'Deze twee horen bij elkaar. Je account op privé zetten sluit nieuwe onbekenden buiten, maar zonder je volgerslijst op te schonen kijken de onbekenden die er al in zaten gewoon door.'
      },
      {
        prompt: 'Een bericht dat jij verwijdert, kan door het screenshot van iemand anders toch bewaard blijven.',
        waar: true,
        leerdoel: 'Je weet dat wat je online zet veel langer blijft bestaan dan je denkt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Zodra iemand anders er een kopie van heeft gemaakt, gaat jouw verwijderknop daar niet meer over. Dat is de kern van deze paragraaf: je beheert alleen je eigen exemplaar en niet dat van anderen.'
      },
      {
        prompt: 'Leg uit wat een digitale voetafdruk is en waarom die groter is dan de berichten die nu nog op je profiel staan.',
        type: 'open',
        leerdoel: 'Je weet dat wat je online zet veel langer blijft bestaan dan je denkt.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'reflecteren',
        modelAnswer: 'Je digitale voetafdruk is het spoor van alles wat jij online achterlaat: berichten, foto’s, reacties, accounts en zoekopdrachten. Die is groter dan je profiel, omdat anderen screenshots gemaakt en berichten doorgestuurd kunnen hebben. Ook apps en zoekmachines bewaren nog kopieën nadat jij iets hebt weggehaald. Wat weg is van jouw scherm, is dus niet weg van internet.',
        nakijkpunten: [
          'Beschrijft de voetafdruk als het spoor van alles wat je online achterlaat.',
          'Noemt kopieën van anderen of van diensten als reden dat het spoor groter is.',
          'Maakt het onderscheid tussen jouw profiel en wat er verder nog bestaat.'
        ],
        feedback: 'Je profiel is de etalage die je zelf inricht, maar je voetafdruk is het magazijn erachter. Dat magazijn beheer jij maar voor een klein deel, want screenshots en zoekmachines vullen het ook.'
      },
      {
        prompt: 'Leg uit hoe een cybercrimineel uit paragraaf 3.2 de gegevens van jouw openbare profiel kan gebruiken om een geloofwaardig phishingbericht te maken.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen welke gegevens je beter niet online deelt.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'reflecteren',
        modelAnswer: "Op een openbaar profiel staan vaak mijn naam, mijn school, mijn sportclub en de namen van vrienden. Daarmee kan iemand een bericht schrijven dat precies bij mijn leven past, bijvoorbeeld over de contributie van mijn club of over een schoolopdracht. Zo'n bericht lijkt echt omdat het klopt met wat ik ken, en dan klik ik veel eerder. Hoe minder persoonlijke informatie er openbaar staat, hoe algemener en dus verdachter zo'n nepbericht moet zijn.",
        nakijkpunten: [
          'Noemt concrete gegevens die op een openbaar profiel te vinden zijn.',
          'Legt uit dat die gegevens het nepbericht persoonlijk en dus geloofwaardig maken.',
          'Verbindt daaraan een conclusie over wat je beter niet openbaar zet.'
        ],
        feedback: 'Persoonlijke details op je profiel zijn het gereedschap waarmee een oplichter zijn bericht geloofwaardig maakt. Wie minder openbaar deelt, dwingt hem tot algemene tekst en die is veel makkelijker te doorzien.'
      },
      // Terugkeervraag 1: leerdoel uit 3.2.
      {
        prompt: 'Terugblik op 3.2: waarom noemen we een nepbericht dat om je gegevens vraagt phishing?',
        leerdoel: 'Je kunt uitleggen wat phishing is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Omdat de dader een hengel uitgooit en wacht tot iemand hapt.', correct: true, explanation: 'Het Engelse fishing zit erin: veel lokaas uitgooien naar duizenden mensen en afwachten wie toehapt.' },
          { text: 'Omdat de dader eerst je wachtwoord kraakt en pas daarna een bericht stuurt.', correct: false, explanation: 'Bij phishing wordt er niets gekraakt. Het bericht komt juist eerst, en jij vult daarna zelf iets in.', misconception: 'Denkt dat er techniek aan te pas komt, terwijl het slachtoffer alles zelf geeft.' },
          { text: 'Omdat het bericht altijd over geld gaat en nooit over gegevens.', correct: false, explanation: 'Gegevens zijn net zo vaak de buit als geld. Je mailadres en je telefoonnummer worden gewoon doorverkocht.', misconception: 'Beperkt phishing tot geld en vergeet dat gegevens net zo goed de buit zijn.' }
        ],
        feedback: 'De naam komt van vissen. Eén bericht gaat naar duizend adressen, en één beet is voor de dader al genoeg.'
      },
      // Leerdoel 3.3-3, deel twee: niet alleen wat je over jezelf online zet,
      // ook wat je over een ander doorstuurt. Hier het cyberpestgeval.
      {
        prompt: 'Welk bericht stuur jij nooit door, omdat je dan meedoet aan cyberpesten?',
        leerdoel: 'Je kunt uitleggen welke gegevens je beter niet online deelt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een screenshot van dat gemene bericht dat je naar je mentor stuurt.', correct: false, explanation: 'Dat is juist de eerste stap van wat je hoort te doen: bewijs bewaren en het melden bij een volwassene.', misconception: 'Denkt dat bewijs bewaren en melden ook meepesten is, terwijl dat juist de goede stap is.' },
          { text: 'Een berichtje waarin je vraagt of het wel goed met iemand gaat.', correct: false, explanation: 'Steun sturen is het tegenovergestelde van meepesten. Voor het slachtoffer maakt juist zo\'n bericht verschil.', misconception: 'Ziet elk bericht over het slachtoffer als meedoen, ook steun.' },
          { text: 'Een oproep in de klassenapp om er nu echt mee te stoppen.', correct: false, explanation: 'Iets zeggen is beter dan wegkijken. Wie zwijgt maakt de groep die meepest ongemerkt groter.', misconception: 'Denkt dat je je er beter helemaal buiten kunt houden dan iets te zeggen.' },
          { text: 'Een bewerkte foto van een klasgenoot met een gemeen bijschrift.', correct: true, explanation: 'Cyberpesten is online pesten met gemene berichten, bewerkte foto’s of buitensluiten uit een groepschat. Doorsturen maakt de groep die meepest groter.' }
        ],
        feedback: 'Bij cyberpesten is er één persoon het doelwit en gaat het om kwetsen, niet om geld of gegevens. Wat jij doet ligt vast in drie stappen: screenshots maken als bewijs, de pester blokkeren en het melden bij een docent of je ouders.'
      },
      // Leerdoel 3.3-3, deel twee: hetzelfde, maar dan voor een bericht dat
      // niet klopt. De bron zet die vraag ook bij het delen: "Kan dit schade
      // doen aan mij of iemand anders? Is het waar wat ik schrijf?"
      {
        prompt: 'Op TikTok gaat een bericht rond dat te gek klinkt om waar te zijn. Iemand stuurt het door met "klopt dit?" erbij. Leg uit waarom dat vraagteken het doorsturen niet onschuldig maakt.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen welke gegevens je beter niet online deelt.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        modelAnswer: 'Nepnieuws is nieuws dat niet klopt, en de schade ontstaat doordat mensen het lezen en geloven. Wie het bericht van mij krijgt, ziet vooral het bericht en niet mijn vraagteken. Bovendien komt het nu van iemand die hij kent, en daardoor gelooft hij het juist eerder dan wanneer hij het van een onbekende zou zien. Ik vergroot dus het bereik van iets waarvan ik zelf al twijfel of het waar is. Beter is het om het niet door te sturen en eerst zelf te controleren of een betrouwbare bron het ook meldt.',
        nakijkpunten: [
          'Noemt dat nepnieuws schade doet zodra mensen het geloven en verder delen.',
          'Legt uit dat het vraagteken wegvalt en dat het bericht zelf blijft rondgaan.',
          'Noemt een alternatief: eerst zelf controleren bij een bron die je vertrouwt.'
        ],
        feedback: 'Is iets te mooi of te gek om waar te zijn, dan is dat meestal ook zo. Ook als je nepnieuws alleen doorstuurt om het te checken, geef je het een duw naar de volgende honderd mensen.'
      },
      // Terugkeervraag 2: leerdoel uit 3.1, en tegelijk een verdiepingsvraag die
      // het opruimen van je profiel verbindt met wat weerbaarheid betekent.
      {
        prompt: 'Terugblik op 3.1: leg uit waarom het nalopen van je privacy-instellingen een vorm van digitale weerbaarheid is.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat digitale weerbaarheid betekent.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'reflecteren',
        modelAnswer: 'Digitale weerbaarheid betekent dat je jezelf kunt beschermen tegen dingen die online niet veilig of niet eerlijk zijn. Je instellingen nalopen is precies dat: je wacht niet af tot er iets misgaat, maar je zet de deur zelf dicht voordat een onbekende binnen is. Je ziet het risico dus aankomen en zet er uit jezelf een maatregel tegenover. Dat is het verschil met alleen weten dat er risico bestaat, want weerbaarheid zit in wat je daarna doet.',
        nakijkpunten: [
          'Noemt de betekenis van digitale weerbaarheid: jezelf beschermen tegen wat online niet veilig of eerlijk is.',
          'Legt uit dat de instellingen nalopen een maatregel vooraf is en geen reactie achteraf.',
          'Maakt het onderscheid tussen het risico kennen en er zelf iets tegen doen.'
        ],
        feedback: 'Weerbaarheid zit niet in het kennen van de begrippen maar in de stap die je uit jezelf zet. Je instellingen nalopen is zo\'n stap: je doet de deur dicht voordat er iemand aanbelt. Dat is heel iets anders dan pas gaan opruimen als er al iets misgegaan is.'
      }
    ]
  },

  '3.4': {
    learningGoals: [
      'Je kunt een verdacht bericht herkennen en zeggen wat je dan doet.',
      'Je kunt uitleggen hoe je jezelf en je gegevens online beschermt.'
    ],
    theorie: [
      {
        keyTerms: ['sterk wachtwoord', 'weerbaar', 'onveiligheid'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Noor kan alle begrippen uit dit hoofdstuk foutloos opnoemen, maar klikte vorige week toch op een link in een nepmail. Wat ontbreekt er bij haar?</p>',
          '<p><strong>Antwoord.</strong> Niet de kennis, maar de gewoonte. Weerbaar zijn betekent dat je in het moment zelf even stopt, ook als een bericht haast suggereert. Noor kende de kenmerken wel, maar paste ze niet toe omdat ze het bericht niet als verdacht érvoer. Daarom oefen je in deze checkpoint met echte berichten en met een vast stappenplan, in plaats van met losse definities.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['afzender', 'bewijs'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Voor je dossier lever je één screenshot in waarop alleen het woord "gelukt" staat. Is dat bruikbaar bewijs?</p>',
          '<p><strong>Antwoord.</strong> Nee. Bewijs is pas bewijs als iemand anders het kan controleren zonder jou erbij. Op het screenshot moet dus te zien zijn wát er bij jou precies gelukt is. Denk aan het instellingenscherm waarin de tweede stap aanstaat, of aan de privacypagina van je account. Een woord op een leeg scherm laat alleen zien dat je iets hebt getypt.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Digitaal weerbaar zijn is een gewoonte. Niet klikken, eerst controleren, bellen bij de minste twijfel, en daarna een screenshot maken, het bericht melden en de afzender blokkeren. Je laat dat zien met bewijs waaraan je docent kan zien wat er gelukt is, bijvoorbeeld een screenshot van je tweede inlogstap of van je privacy-instellingen.</p>',
      keyTerms: ['weerbaar', 'melden']
    },
    // Hoofdstuktoets: 29 vragen over de elf leerdoelen van 3.1 t/m 3.4, elk
    // minstens twee keer, en elke vraag toetst het doel waaraan hij hangt ook
    // echt. Over de vrijwillige plusparagraaf 3.5 staat hier bewust geen enkele
    // vraag.
    //
    // De vier items over cyberpesten en nepnieuws hingen eerst onder het
    // weerbaarheidsdoel van 3.1 en daarna onder een zelf toegevoegd vierde
    // leerdoel van 3.3. Allebei fout. Ze hangen nu onder de doelen die ze ook
    // echt meten: drie onder 3.4-1 (herkennen en dan handelen) en één onder
    // 3.4-2 (zelf controleren voor je iets gelooft). Het weerbaarheidsdoel van
    // 3.1 heeft twee eigen items waarin het woord weerbaarheid in de vraag en
    // in het antwoord staat.
    //
    // De opties zijn in ronde 2 op lengte gelijkgetrokken. De redengevende
    // bijzin staat nu in explanation of in de feedback; blind de langste knop
    // klikken levert hier nog 6 van de 17 meerkeuzevragen op.
    vragen: [
      // --- leerdoel 3.1-1 (1 van 3) ---
      {
        prompt: "Welke van deze vier is géén risico dat de les bij internetgebruik noemt?",
        leerdoel: "Je kunt drie risico's van internetgebruik noemen.",
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Iemand steelt je wachtwoorden en logt in op je account.', correct: false, explanation: 'Dit is het eerste risico dat de les noemt. Hier wil iemand anders iets van jou hebben, dus het telt gewoon mee.', misconception: 'Ziet diefstal van inloggegevens niet als een van de genoemde risico’s.' },
          { text: 'Iemand probeert jou online te pesten in de groepschat.', correct: false, explanation: 'Pesten staat in de les in een adem met de andere drie. Er wordt niets gestolen, maar iemand wil jou wel raken.', misconception: 'Denkt dat pesten er niet bij hoort omdat er geen gegevens gestolen worden.' },
          { text: 'Je opslag zit vol en je telefoon wordt traag.', correct: true, explanation: 'Dit is pech met je apparaat: er is niemand die er beter van wordt of die jou wil raken.' },
          { text: 'Iemand misbruikt jouw data en verkoopt je nummer door.', correct: false, explanation: 'Misbruik van data is in de les een apart risico naast diefstal, en het levert de dader een lijst op die hij kan doorverkopen.', misconception: 'Ziet misbruik van gegevens niet als apart risico naast diefstal.' }
        ],
        feedback: 'De les noemt er vier: je wachtwoorden stelen, nepberichten sturen, jou pesten en je data misbruiken. Bij alle vier heeft iemand anders er belang bij, en dat maakt ze tot een echt risico.'
      },
      // --- leerdoel 3.1-1 (2 van 3) ---
      {
        prompt: "Noem drie risico's van internetgebruik en schrijf bij elk risico op wat jij daardoor kunt kwijtraken.",
        type: 'open',
        leerdoel: "Je kunt drie risico's van internetgebruik noemen.",
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ten eerste dat iemand mijn wachtwoord steelt; dan raak ik de toegang tot mijn account kwijt en kan hij bij alles wat erachter zit. Ten tweede dat iemand mij een nepbericht stuurt; dan raak ik geld of gegevens kwijt omdat ik denk dat het bericht echt is. Ten derde dat iemand mij online pest; dan raak ik mijn rust en mijn veilige gevoel kwijt. Een vierde is dat mijn data misbruikt wordt: mijn nummer wordt doorverkocht en ik word gebeld door onbekenden.',
        nakijkpunten: [
          "Noemt drie verschillende risico's uit de les, waarbij pesten net zo goed telt als diefstal.",
          'Schrijft bij elk risico op wat de leerling zelf kwijtraakt.',
          'Houdt pech met het apparaat buiten het antwoord.'
        ],
        feedback: 'Wie bij een risico kan zeggen wat je kwijtraakt, snapt waarom de maatregel eruit later de moeite waard is.'
      },
      // --- leerdoel 3.1-1 (3 van 3) ---
      // In ronde 2 stond hier een tweede vraag over "pech is geen risico",
      // waardoor dat ene onderscheid vijf keer in het hoofdstuk gemeten werd.
      // Deze stelling meet nu de andere kant van hetzelfde leerdoel: dat pesten
      // wél meetelt, ook al verdient de dader er niets aan.
      {
        prompt: "Online gepest worden telt in deze les net zo goed mee als een risico van internetgebruik.",
        waar: true,
        leerdoel: "Je kunt drie risico's van internetgebruik noemen.",
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: "De les noemt pesten in één adem met wachtwoorden stelen, nepberichten sturen en data misbruiken. Bij de eerste drie wil iemand iets van jou hebben; bij pesten wil iemand jou raken. Allebei maken ze het een risico, en pesten telt dus gewoon mee als je er drie moet noemen."
      },
      // --- leerdoel 3.1-2 (1 van 2) ---
      {
        prompt: 'Waarom is een account met twee-staps-verificatie moeilijker over te nemen dan een account met alleen een wachtwoord?',
        leerdoel: 'Je weet wat twee-staps-verificatie is en waarom die je account beter beschermt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat de app dan automatisch een sterker wachtwoord voor je maakt.', correct: false, explanation: 'De tweede stap laat je wachtwoord ongemoeid. Er komt alleen een tweede controle bij, na dat wachtwoord.', misconception: 'Denkt dat de tweede stap het wachtwoord zelf verandert.' },
          { text: 'Omdat je account dan door de app extra in de gaten wordt gehouden.', correct: false, explanation: 'Er kijkt niemand mee. Het enige verschil is dat er bij het inloggen ook nog een code gevraagd wordt.', misconception: 'Verwacht bewaking door de dienst in plaats van een extra controle bij het inloggen.' },
          { text: 'Omdat je dan minder vaak hoeft in te loggen en dus minder risico loopt.', correct: false, explanation: 'Je logt er eerder vaker mee in dan minder. Hoe vaak je inlogt zegt bovendien niets over hoe goed je account op slot zit.', misconception: 'Denkt dat minder inloggen hetzelfde is als beter beveiligd zijn.' },
          { text: 'Omdat een dief naast je wachtwoord ook je telefoon nodig heeft.', correct: true, explanation: 'Hij moet dan iets weten én iets bezitten: het wachtwoord én de telefoon waar de codes op binnenkomen. Dat tweede ligt gewoon bij jou in je zak.' }
        ],
        feedback: 'Eén slot vraagt alleen iets wat je weet, en dat kan gelekt of afgekeken worden. Twee sloten vragen daarnaast iets wat je in je hand hebt, en dat maakt inbreken bijna onmogelijk.'
      },
      // --- leerdoel 3.1-2 (2 van 2) ---
      {
        prompt: 'Je zet twee-staps-verificatie aan op je mail. Leg uit welk risico daarmee kleiner wordt en welk risico gewoon blijft bestaan.',
        type: 'open',
        leerdoel: 'Je weet wat twee-staps-verificatie is en waarom die je account beter beschermt.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Kleiner wordt het risico dat iemand met alleen mijn wachtwoord binnenkomt, bijvoorbeeld na een lek bij een website waar ik hetzelfde wachtwoord gebruikte. Hij mist dan de code die op mijn telefoon binnenkomt. Blijven bestaan doet het risico van phishing: als een nepsite mij vraagt om de code en ik geef die, dan zet ik de deur zelf open. Ook het risico van gegevens die ik zelf openbaar deel, verandert er niet door.',
        nakijkpunten: [
          'Noemt het gestolen of gelekte wachtwoord als het risico dat kleiner wordt.',
          'Noemt phishing of het zelf afstaan van de code als risico dat blijft.',
          'Maakt duidelijk dat techniek niet alles afdekt.'
        ],
        feedback: 'Een tweede slot houdt inbrekers buiten, maar het doet niets tegen een bewoner die zelf opendoet. Bij phishing geef je de code namelijk zelf weg, en dan is elke techniek machteloos.'
      },
      // --- leerdoel 3.1-3 (1 van 2) ---
      {
        prompt: 'Wat betekent digitale weerbaarheid?',
        leerdoel: 'Je kunt uitleggen wat digitale weerbaarheid betekent.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Dat je apparaat zo goed beveiligd is dat jou online eigenlijk niets meer kan overkomen.', correct: false, explanation: 'Weerbaarheid zit bij jou en niet bij je apparaat. Geen enkele instelling houdt tegen dat jij zelf een code weggeeft.', misconception: 'Legt weerbaarheid bij de techniek in plaats van bij het eigen gedrag.' },
          { text: 'Dat je alle instellingen en knoppen van je telefoon uit je hoofd kent.', correct: false, explanation: 'De knoppen kennen is kennis. Weerbaarheid is wat je op het moment zelf met die kennis doet.', misconception: 'Verwart kennis van knoppen met de gewoonte om jezelf te beschermen.' },
          { text: 'Dat je jezelf kunt beschermen tegen dingen die op internet niet veilig of niet eerlijk zijn.', correct: true, explanation: 'Dat is de omschrijving uit de les: het gaat om jezelf beschermen, en dus om wat jij zelf doet.' },
          { text: 'Dat je zoveel online bent dat je elke nieuwe app en elke trend meteen herkent.', correct: false, explanation: 'Veel online zijn maakt je niet veiliger. Wie het meest gebruikt, krijgt juist de meeste nepberichten te zien.', misconception: 'Denkt dat veel gebruiken hetzelfde is als veilig gebruiken.' }
        ],
        feedback: 'Weerbaarheid gaat over jou en niet over je apparaat, want jij bent degene die de stap zet. Je merkt zelf dat er iets niet klopt en zet dan uit jezelf de goede stap. Niet klikken, eerst controleren en bij twijfel bellen zijn precies zulke stappen, en die kun je aanleren.'
      },
      // --- leerdoel 3.1-3 (2 van 2) ---
      {
        prompt: 'Twee klasgenoten weten allebei precies wat phishing is. De één klikt toch op de link, de ander niet. Leg met het begrip digitale weerbaarheid uit waar het verschil zit.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat digitale weerbaarheid betekent.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Digitale weerbaarheid betekent dat je jezelf kunt beschermen tegen dingen die online niet veilig of niet eerlijk zijn. Het verschil zit dus niet in de kennis, want die hebben ze allebei, maar in het gedrag op het moment zelf. De één laat zich meeslepen door de haast in het bericht en klikt voordat hij nadenkt. De ander heeft er een gewoonte van gemaakt: eerst niets aanklikken, dan de afzender controleren en bij twijfel bellen op een nummer dat hij al kende. Die gewoonte is precies wat weerbaarheid betekent, en daarom oefen je met echte berichten en niet alleen met definities.',
        nakijkpunten: [
          'Noemt de betekenis van digitale weerbaarheid in eigen woorden: jezelf beschermen tegen wat online niet veilig of eerlijk is.',
          'Maakt duidelijk dat de kennis bij allebei gelijk is en dat het verschil in het gedrag op het moment zelf zit.',
          'Noemt minstens één concrete gewoonte, bijvoorbeeld niet klikken, de afzender controleren of bellen bij twijfel.'
        ],
        feedback: 'Kennis en weerbaarheid zijn niet hetzelfde, en juist dat verschil wordt in deze vraag gemeten. Iedereen die dit hoofdstuk gemaakt heeft weet wat phishing is, en toch klikt een deel van hen. Wat het verschil maakt is een vaste gewoonte die ook werkt op het moment dat je even niet nadenkt.'
      },
      // --- leerdoel 3.4-1 (cyberpesten: herkennen en dan handelen) ---
      {
        prompt: 'In de klassenapp zet iemand een bewerkte foto van een klasgenoot met een gemeen bijschrift. Wat doe je?',
        leerdoel: 'Je kunt een verdacht bericht herkennen en zeggen wat je dan doet.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je stuurt de foto door naar een andere groep om te waarschuwen.', correct: false, explanation: 'Hoe goed bedoeld ook: de foto komt zo bij nog meer mensen onder ogen, en dat is precies wat de pester wilde.', misconception: 'Denkt te waarschuwen, maar laat de foto daarmee bij nog meer mensen belanden.' },
          { text: 'Je zet er een lachende emoji onder, dan blijft het onschuldig.', correct: false, explanation: 'Meelachen is meedoen. Voor het slachtoffer telt elke reactie mee als bijval.', misconception: 'Denkt dat meelachen niet meetelt als meedoen.' },
          { text: 'Je verlaat de groepschat en zegt er verder niets meer over.', correct: false, explanation: 'Weglopen stopt niets en laat het slachtoffer alleen achter. Je bewijs ben je er bovendien mee kwijt.', misconception: 'Denkt dat wegkijken hetzelfde is als je er niet mee bemoeien.' },
          { text: 'Je maakt een screenshot, blokkeert de plaatser en meldt het.', correct: true, explanation: 'Dit zijn de drie stappen uit de les: bewijs bewaren, blokkeren en het melden bij een docent of je ouders.' }
        ],
        feedback: 'Een bewerkte foto met een gemeen bijschrift is cyberpesten: online pesten met gemene berichten, bewerkte foto’s of iemand buitensluiten uit een groepschat. Er is één persoon het doelwit en het doel is kwetsen, niet stelen. Screenshots, blokkeren en melden zijn dan de drie stappen.'
      },
      // --- leerdoel 3.4-1 (nepnieuws: herkennen en dan niet doorsturen) ---
      {
        prompt: 'Waarom stuur je een bericht dat niet klopt beter niet door, ook als jij er zelf niet in gelooft?',
        leerdoel: 'Je kunt een verdacht bericht herkennen en zeggen wat je dan doet.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat je telefoon er langzamer van wordt zodra je het bericht opent.', correct: false, explanation: 'Een bericht dat niet klopt doet niets met je telefoon. De schade ontstaat in de hoofden van de mensen die het lezen.', misconception: 'Zoekt de schade in de techniek in plaats van in wat mensen ermee doen.' },
          { text: 'Omdat anderen het wél geloven en er schade van ondervinden.', correct: true, explanation: 'Nepnieuws is nieuws dat niet klopt, en juist het doorsturen richt de schade aan bij jou of bij een ander.' },
          { text: 'Omdat het altijd over beroemde mensen gaat die zich niet verdedigen.', correct: false, explanation: 'Nepnieuws gaat net zo goed over jouw school of je eigen buurt, en juist dan raakt het mensen die je kent.', misconception: 'Denkt dat nepnieuws alleen over bekende personen gaat.' },
          { text: 'Omdat je een boete kunt krijgen zodra je zulk nieuws leest.', correct: false, explanation: 'Lezen is nooit strafbaar. Het gaat hier om de schade die verspreiden aanricht en niet om een straf.', misconception: 'Denkt dat lezen strafbaar is in plaats van dat verspreiden schade doet.' }
        ],
        feedback: 'Ook als jij het zelf verzint of alleen doorstuurt, doe je schade aan jou of aan een ander. Daarom controleer je eerst of een bericht waar is, en pas daarna beslis je of je het doorstuurt.'
      },
      // --- leerdoel 3.4-2 (zelf controleren voor je iets gelooft) ---
      {
        prompt: 'Twee klasgenoten geloven een bericht om een verschillende reden: de één omdat het duizend keer gedeeld is, de ander omdat de site er professioneel uitziet. Leg uit waarom geen van beide redenen deugt, en beschrijf hoe jij dat bericht wél zou controleren.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen hoe je jezelf en je gegevens online beschermt.',
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        rol: 'zelf_proberen',
        modelAnswer: 'Veel gedeeld worden zegt alleen dat veel mensen het interessant vonden, niet dat het klopt; juist onwaar nieuws wordt vaak het snelst gedeeld. Een professioneel uitziende site zegt evenmin iets, want iedereen kan een nette pagina bouwen en er staat geen enkele controle achter. Ik zou zelf kijken wie het bericht als eerste geplaatst heeft en of een bron die ik vertrouw, bijvoorbeeld de NOS of de school zelf, het ook meldt. Vind ik het nergens anders terug, dan geloof ik het niet en stuur ik het ook niet door.',
        nakijkpunten: [
          'Weerlegt allebei de redenen apart: populariteit en vormgeving zeggen niets over juistheid.',
          'Noemt een concrete controle, bijvoorbeeld de oorspronkelijke bron opzoeken of een betrouwbare bron ernaast leggen.',
          'Verbindt er een besluit aan over geloven en doorsturen.'
        ],
        feedback: 'Niet alles wat op internet staat is gecontroleerd, en veel berichten zijn door iedereen zomaar geplaatst. Zelf even nakijken bij een bron die je vertrouwt kost een halve minuut, en dat is de goedkoopste bescherming die er is.'
      },
      // --- leerdoel 3.4-1 (cyberpesten: het geval waarin niemand iets stuurt) ---
      {
        prompt: 'In een groepschat wordt een klasgenoot buitengesloten en uitgelachen. Beschrijf wat jij doet en waarom dat helpt.',
        type: 'open',
        leerdoel: 'Je kunt een verdacht bericht herkennen en zeggen wat je dan doet.',
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        rol: 'reflecteren',
        modelAnswer: 'Ik doe niet mee en ik lach niet mee, want ook meelachen is meedoen. Ik maak een screenshot als bewijs en meld het bij een docent of mentor, en ik zeg tegen degene die begon dat het niet oké is. Daarna laat ik het slachtoffer weten dat ik het gezien heb en dat ik het gemeld heb, zodat diegene niet alleen staat.',
        nakijkpunten: [
          'Doet zelf niet mee en lacht niet mee.',
          'Noemt bewijs bewaren en melden bij een volwassene.',
          'Denkt aan het slachtoffer, niet alleen aan de regels.'
        ],
        feedback: 'Buitensluiten uit een groepschat is een van de drie voorbeelden van cyberpesten uit de les. Wie het ziet en zonder iets te zeggen wegkijkt, maakt de groep die meepest juist groter. Melden bij een volwassene en het slachtoffer opzoeken zijn de twee stappen die echt verschil maken.'
      },
      // --- leerdoel 3.2-1 (1 van 2) ---
      {
        prompt: 'Een oplichter stuurt duizenden mensen dezelfde nepmail en wacht af wie erop klikt. Hoe heet die manier van werken?',
        leerdoel: 'Je kunt uitleggen wat phishing is.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Cyberpesten, want hij valt duizenden mensen tegelijk lastig.', correct: false, explanation: 'Bij cyberpesten is er een doelwit dat de dader kent en dat hij wil kwetsen. Hier kent hij niemand van die duizend.', misconception: 'Denkt dat elk ongewenst bericht onder pesten valt, terwijl het bij pesten om één doelwit gaat.' },
          { text: 'Phishing, want hij gooit een hengel uit en wacht tot iemand hapt.', correct: true, explanation: 'Veel lokaas uitgooien en afwachten wie toehapt: dat is precies het beeld achter het woord.' },
          { text: 'Identiteitsfraude, want hij doet zich voor als een bedrijf.', correct: false, explanation: 'Identiteitsfraude gaat over de identiteit van een persoon die daarmee bestolen wordt. Een bedrijfsnaam namaken is hier alleen het lokaas.', misconception: 'Verwart het nabootsen van een afzender met het misbruiken van iemands identiteit.' },
          { text: 'Hacken, want hij probeert bij de gegevens van anderen te komen.', correct: false, explanation: 'Bij hacken wordt een wachtwoord achterhaald. Hier wordt niets gekraakt, want de dader wacht tot iemand zelf klikt.', misconception: 'Denkt dat er een wachtwoord gekraakt wordt, terwijl het slachtoffer zelf klikt.' }
        ],
        feedback: 'Eén bericht naar duizend adressen versturen kost de dader bijna niets aan tijd of geld. Trapt er daarna één iemand in, dan is hij al uit de kosten en heeft hij winst.'
      },
      // --- leerdoel 3.2-1 (2 van 2) ---
      {
        prompt: 'Leg uit wat phishing is en waarom een oplichter er duizenden berichten tegelijk voor verstuurt.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat phishing is.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Phishing is het sturen van een nepbericht waarmee iemand je op een link laat klikken, geld afhandig maakt of je gegevens steelt. Het bericht lijkt van een bekend bedrijf of van een bekende persoon te komen, zodat je het vertrouwt. De dader stuurt duizenden berichten tegelijk omdat versturen hem bijna niets kost. Trapt er maar één op de duizend mensen in, dan heeft hij al winst gemaakt.',
        nakijkpunten: [
          'Geeft een correcte definitie met nepbericht en link, geld of gegevens erin.',
          'Legt uit dat het bericht echt moet lijken om te werken.',
          'Verklaart de grote aantallen uit de lage kosten en de kleine kans die genoeg is.'
        ],
        feedback: 'Phishing is een rekensom voor de dader: massaal versturen kost niets, en één beet betaalt de hele actie.'
      },
      // --- leerdoel 3.2-2 (1 van 3) ---
      {
        prompt: 'Waaraan zie je in een e-mail het snelst dat het om phishing kan gaan?',
        leerdoel: 'Je kunt aan een bericht of e-mail zien of het phishing kan zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Aan het adres van de afzender, dat net iets anders is.', correct: true, explanation: 'Vergelijk dat adres letter voor letter met het echte adres van het bedrijf: dat is het eerste wat een oplichter moet vervalsen en waar hij het vaakst de mist in gaat.' },
          { text: 'Aan het logo, want oplichters kunnen geen logo in een mail zetten.', correct: false, explanation: 'Een logo is een plaatje dat je met een klik kopieert. Juist het logo is in een nepmail meestal perfect nagemaakt.', misconception: 'Denkt dat een echt uitziend logo niet te kopiëren is.' },
          { text: 'Aan de lengte van de mail, want echte mails zijn altijd kort.', correct: false, explanation: 'Echte mails zijn soms lang en nepmails soms kort. De lengte zegt niets, het afzenderadres wel.', misconception: 'Zoekt een kenmerk in de vorm in plaats van in de inhoud.' },
          { text: 'Aan de tijd waarop de mail binnenkomt, want bedrijven mailen alleen overdag.', correct: false, explanation: 'Mail wordt automatisch verstuurd, ook midden in de nacht, en dat geldt voor echte bedrijven net zo goed.', misconception: 'Denkt dat het tijdstip iets zegt over de echtheid van een bericht.' }
        ],
        feedback: 'Het afzenderadres is de makkelijkste controle die je hebt, en hij kost je maar een paar seconden. Vergelijk dat adres letter voor letter met het adres dat op de officiële website staat.'
      },
      // --- leerdoel 3.2-2 (2 van 3) ---
      {
        prompt: 'Je krijgt een appje van een onbekend nummer: "Gefeliciteerd, jij wint een iPhone! Vul hier je e-mailadres en telefoonnummer in." Wat is hier aan de hand?',
        leerdoel: 'Je kunt aan een bericht of e-mail zien of het phishing kan zijn.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Niets bijzonders: een win-actie mag je altijd invullen, want je geeft geen wachtwoord.', correct: false, explanation: 'Je mailadres en je nummer zijn hier juist de buit. Ze worden doorverkocht, en daarna word je gebeld en gemaild door onbekenden.', misconception: 'Denkt dat alleen een wachtwoord gevoelig is en dat contactgegevens vrij te geven zijn.' },
          { text: 'Het is echt, want de afzender kent jouw telefoonnummer al.', correct: false, explanation: 'Nummers worden per lijst verhandeld. Dat iemand jouw nummer heeft, bewijst alleen dat je op zo\'n lijst staat.', misconception: 'Ziet het kennen van je nummer aan voor een bewijs van betrouwbaarheid.' },
          { text: 'Jouw gegevens zijn hier de prijs: je mailadres en nummer worden doorverkocht.', correct: true, explanation: 'Je kunt niet nagaan van wie deze actie is en er zijn geen voorwaarden; dan is de lijst met gegevens de echte opbrengst, die daarna doorverkocht en misbruikt wordt.' },
          { text: 'Het is nep, maar invullen kan geen kwaad zolang je niets aanklikt.', correct: false, explanation: 'Het invullen is hier het probleem en niet het klikken. Zodra je op verzenden drukt, staan je gegevens bij de dader.', misconception: 'Denkt dat invullen zonder klikken veilig is, terwijl juist het invullen de buit is.' }
        ],
        feedback: 'Bij een appje van een onbekend nummer kun je niet nagaan van wie de actie is. Zonder een controleerbare afzender en zonder leesbare voorwaarden vul je dus helemaal niets in, ook geen mailadres.'
      },
      // --- leerdoel 3.2-2 (3 van 3) ---
      {
        prompt: 'Je probeert bij alle vier eerst na te gaan van wie de actie komt. Bij welke van deze win-acties kun jij daarna je e-mailadres verantwoord invullen?',
        leerdoel: 'Je kunt aan een bericht of e-mail zien of het phishing kan zijn.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een actie die je op bol.com zelf hebt teruggevonden, met nette voorwaarden.', correct: true, explanation: 'De eerste controle is hier geslaagd: de actie staat op bol.com zelf, dus niet alleen in een post die dat beweert. Pas daarna krijgen de voorwaarden betekenis, en die houden je gegevens binnen deze ene actie.' },
          { text: 'Een appje van een onbekend nummer waarin je honderd iPhones kunt winnen.', correct: false, explanation: 'Bij een onbekend nummer loopt de eerste controle meteen dood: je kunt nergens nagaan van wie deze actie komt.', misconception: 'Let op de prijs en niet op de vraag van wie de actie eigenlijk komt.' },
          { text: 'Een pop-up op een filmsite die zegt dat je de miljoenste bezoeker bent.', correct: false, explanation: 'Zo\'n pop-up hoort meestal niet eens bij de site zelf, maar bij een advertentie die eroverheen valt.', misconception: 'Denkt dat een gelikte pop-up bij de site hoort die je aan het bekijken bent.' },
          { text: 'Een actie zonder voorwaarden waarbij je alleen je mailadres en nummer invult.', correct: false, explanation: 'Hier staat helemaal niet wie de actie uitschrijft, dus de eerste controle loopt al dood. Dat er verder weinig gevraagd wordt, maakt dat niet goed.', misconception: 'Kijkt naar hoeveel er gevraagd wordt en niet eerst naar wie het vraagt.' }
        ],
        feedback: 'Niet elke win-actie is nep, en dat maakt deze vraag lastiger dan hij op het eerste gezicht lijkt. De volgorde beslist: eerst nagaan van wie de actie echt is, en pas daarna lezen wat de voorwaarden over jouw gegevens zeggen. Bij drie van de vier loopt die eerste controle dood, en dan doen de voorwaarden er niet meer toe. Nette voorwaarden houden je gegevens binnen die ene actie, maar nul risico bestaat online nergens: ook een groot bedrijf kan gehackt worden. Vul daarom overal nooit meer in dan er gevraagd wordt.'
      },
      // --- leerdoel 3.2-3 (1 van 2) ---
      {
        prompt: 'Iemand maakt een account met jouw naam en jouw profielfoto en vraagt daarmee jouw vrienden om geld. Hoe heet dat?',
        leerdoel: 'Je weet wat identiteitsfraude is en wat een cybercrimineel doet.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Cyberpesten, want hij valt jouw vrienden lastig met berichten.', correct: false, explanation: 'Hij wil je vrienden niet kwetsen maar bestelen, en hij gebruikt jouw naam daarbij als vermomming.', misconception: 'Ziet het lastigvallen en niet het misbruiken van de identiteit.' },
          { text: 'Nepnieuws, want hij verspreidt iets wat gewoon niet waar is.', correct: false, explanation: 'Nepnieuws gaat over berichten die zich voordoen als nieuws. Hier wordt een persoon nagebootst en geen nieuwsbericht.', misconception: 'Denkt dat elk onwaar bericht onder nepnieuws valt.' },
          { text: 'Identiteitsfraude, want hij steelt met jouw naam en foto.', correct: true, explanation: 'Jouw identiteit wordt gebruikt als vermomming om iemand anders te bestelen.' },
          { text: 'Hacken, want hij is in jouw eigen account binnengekomen.', correct: false, explanation: 'Er is niets gekraakt en er is niemand in jouw account geweest. Een nagemaakt profiel met jouw naam en foto is al genoeg.', misconception: 'Denkt dat er ingebroken moet zijn, terwijl een nagemaakt account genoeg is.' }
        ],
        feedback: 'Er hoeft hiervoor helemaal niets gehackt te worden, en juist dat maakt het zo makkelijk. Een nagemaakt profiel met jouw naam en foto is al genoeg om anderen te misleiden.'
      },
      // --- leerdoel 3.2-3 (2 van 2) ---
      {
        prompt: 'Waar is een cybercrimineel op uit, en hoe komt hij daaraan?',
        leerdoel: 'Je weet wat identiteitsfraude is en wat een cybercrimineel doet.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Op jouw gegevens, die hij steelt en daarna doorverkoopt of misbruikt.', correct: true, explanation: 'Dat is de omschrijving uit 3.2: gegevens buitmaken en er geld mee verdienen of er iemand anders mee bestelen.' },
          { text: 'Op wachtwoorden alleen, en die kraakt hij altijd met een raadprogramma.', correct: false, explanation: 'Kraken is hacken, en dat is maar een van zijn manieren. Bij phishing wordt er niets gekraakt en geeft het slachtoffer zijn gegevens zelf.', misconception: 'Zet cybercrimineel gelijk aan hacker en ziet phishing en doorverkoop niet.' },
          { text: 'Op aandacht, die hij haalt door mensen gemene berichten te sturen.', correct: false, explanation: 'Dat is cyberpesten, en dat draait om kwetsen. Een cybercrimineel is uit op gegevens of op geld.', misconception: 'Schaart elk online kwaad onder pesten.' },
          { text: 'Op onrust, die hij zaait door nieuws te verzinnen dat niet gebeurd is.', correct: false, explanation: 'Dat is nepnieuws. Dat kan veel schade doen, maar er wordt niets van jou gestolen.', misconception: 'Verwart schade door onwaarheid met diefstal van gegevens.' }
        ],
        feedback: 'Cybercrimineel is het woord voor de dader en niet voor een van zijn trucs. Hacken en phishing zijn twee van zijn manieren, en jouw gegevens zijn allebei de keren de buit. Wat hij daarna met die gegevens kan doen, stond in de vorige vraag: iemand anders bestelen onder jouw naam.'
      },
      // --- leerdoel 3.3-1 (1 van 2) ---
      {
        prompt: 'Alles wat jij online zet, kan ook na het verwijderen nog jarenlang ergens bestaan.',
        waar: true,
        leerdoel: 'Je weet dat wat je online zet veel langer blijft bestaan dan je denkt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Kopieën bij andere mensen en op de servers van de app zelf blijven gewoon bestaan. Daarom is nadenken vóór het plaatsen de enige bescherming die je echt in eigen hand hebt.'
      },
      // --- leerdoel 3.3-1 (2 van 2) ---
      {
        prompt: 'Waarom is een bericht dat jij van je profiel verwijdert toch niet uit de wereld?',
        leerdoel: 'Je weet dat wat je online zet veel langer blijft bestaan dan je denkt.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat verwijderen pas na dertig dagen echt gebeurt en je zolang moet wachten.', correct: false, explanation: 'Ook na dertig dagen bestaan de kopieën van anderen nog. Het is geen kwestie van wachten maar van wie er intussen iets bewaard heeft.', misconception: 'Denkt dat het een kwestie van tijd is in plaats van van kopieën.' },
          { text: 'Omdat je het bericht ook nog uit je eigen prullenbak moet halen.', correct: false, explanation: 'Je eigen prullenbak leegmaken verandert niets aan wat er bij anderen en op de servers van de app staat.', misconception: 'Denkt aan de opslag op het eigen toestel in plaats van aan wat anderen hebben.' },
          { text: 'Omdat je volgers een melding hebben gehad die niet meer weg kan.', correct: false, explanation: 'De melding is het probleem niet. Wat blijft is de inhoud zelf: screenshots bij anderen en kopieën bij de dienst.', misconception: 'Denkt dat alleen de melding blijft en niet de inhoud zelf.' },
          { text: 'Omdat anderen al een screenshot hebben en diensten kopieën bewaren.', correct: true, explanation: 'Kopieën bij anderen en op servers vallen buiten jouw verwijderknop; jij wist alleen je eigen exemplaar.' }
        ],
        feedback: 'Een bericht verwijderen haalt alleen jouw eigen exemplaar weg en verder niets uit de wereld. Over de kopieën die anderen intussen gemaakt hebben heb jij helemaal niets meer te zeggen.'
      },
      // --- leerdoel 3.3-2 (1 van 2) ---
      {
        prompt: 'Fatima heeft haar account zojuist op privé gezet. Wie kan haar foto\'s daarna nog steeds zien?',
        leerdoel: 'Je kunt je privacy-instellingen zo zetten dat alleen mensen die je kent je profiel zien.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Iedereen die zij eerder had geaccepteerd, onbekenden daartussen dus ook.', correct: true, explanation: 'De instelling houdt tegen wie er nog buiten staat, maar verandert niets aan wie er al binnen was.' },
          { text: 'Niemand meer, want de instelling geldt vanaf nu ook voor al haar oude volgers.', correct: false, explanation: 'Privé zetten betekent dat nieuwe mensen toestemming moeten vragen. Wie die toestemming ooit al kreeg, houdt hem gewoon.', misconception: 'Denkt dat de instelling met terugwerkende kracht volgers verwijdert.' },
          { text: 'Alleen mensen die haar gebruikersnaam precies weten en die zelf intypen.', correct: false, explanation: 'Zoeken en zien zijn twee verschillende dingen. Haar naam blijft vindbaar, maar haar foto\'s zijn dat alleen nog voor haar volgers.', misconception: 'Verwart vindbaar zijn met zichtbaar zijn.' },
          { text: 'Alleen mensen die eerder al een foto van haar geliket of bewaard hebben.', correct: false, explanation: 'Wat iemand ooit gelikt heeft, bepaalt niets. Wat telt is of hij op dit moment in haar volgerslijst staat.', misconception: 'Denkt dat eerdere interactie de toegang bepaalt in plaats van de volgerslijst.' }
        ],
        feedback: 'Dit is precies de reden dat er een stap achteraan komt. Na het omzetten loop je je volgerslijst na en verwijder je iedereen die je niet kent, want anders kijkt die groep gewoon door.'
      },
      // --- leerdoel 3.3-2 (2 van 2) ---
      {
        prompt: 'Een zin in je bio waarin je onbekenden vraagt weg te blijven, werkt net zo goed als je account op privé zetten.',
        waar: false,
        leerdoel: 'Je kunt je privacy-instellingen zo zetten dat alleen mensen die je kent je profiel zien.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Een zin in je bio is een verzoek, terwijl een instelling een slot is dat echt sluit. De app leest jouw bio helemaal niet, maar voert de schakelaar bij je instellingen wel uit.'
      },
      // --- leerdoel 3.3-3 (1 van 2) ---
      {
        prompt: 'Welke gegevens horen echt niet op een openbaar profiel?',
        leerdoel: 'Je kunt uitleggen welke gegevens je beter niet online deelt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De naam van je favoriete band en de film die je gisteren zag.', correct: false, explanation: 'Voorkeuren zeggen niets over waar je bent of wie je officieel bent. Die mogen gerust op je profiel staan.', misconception: 'Denkt dat elke persoonlijke voorkeur gevoelig is.' },
          { text: 'Een foto van je kat en een selfie met je klasgenoten.', correct: false, explanation: 'Leg ook deze foto\'s langs de drie vragen: ze zeggen niet waar je bent, niet wanneer je er bent en niet wie je officieel bent.', misconception: 'Denkt dat elke foto gevoelig is, zonder hem langs de drie vragen te leggen.' },
          { text: 'Je adres, je rooster en een foto van een identiteitsbewijs.', correct: true, explanation: 'Hiermee weet een ander waar je bent, wanneer je er bent en hoe hij zich voor jou kan uitgeven.' },
          { text: 'Je gebruikersnaam en het aantal volgers dat je hebt.', correct: false, explanation: 'Die staan op elk profiel sowieso al zichtbaar, en er valt voor een ander niets mee te beginnen.', misconception: 'Ziet zichtbare accountgegevens aan voor gevoelige gegevens.' }
        ],
        feedback: 'Kijk of gegevens iets zeggen over waar je bent, wanneer je er bent of wie je officieel bent. Juist die drie soorten gegevens horen niet openbaar, want zij maken misbruik pas echt mogelijk.'
      },
      // --- leerdoel 3.3-3 (2 van 2) ---
      {
        prompt: 'Noem drie soorten gegevens die jij niet online zet en leg per soort uit wat een cybercrimineel ermee zou kunnen doen.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen welke gegevens je beter niet online deelt.',
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ten eerste mijn adres: daarmee weet iemand waar ik woon en kan hij mij thuis opzoeken of pakketjes op mijn naam laten bezorgen. Ten tweede mijn schoolrooster of mijn sporttijden: daarmee weet hij precies wanneer ik niet thuis ben. Ten derde een foto van een document met mijn naam, geboortedatum en handtekening: daarmee kan hij zich voordoen als mij, en dat is identiteitsfraude.',
        nakijkpunten: [
          'Noemt drie verschillende soorten gegevens, geen drie voorbeelden van hetzelfde.',
          'Koppelt aan elke soort een concreet misbruik.',
          'Gebruikt minstens één begrip uit het hoofdstuk correct.'
        ],
        feedback: 'Losse gegevens lijken stuk voor stuk onschuldig, maar samen vormen ze een compleet profiel van jou. Juist die combinatie maakt misbruik mogelijk, want een oplichter heeft er genoeg aan om overtuigend te klinken.'
      },
      // --- leerdoel 3.4-1 (1 van 2) ---
      {
        prompt: 'Een mail die haast maakt en dreigt met een geblokkeerde rekening is juist een teken dat het bericht echt is.',
        waar: false,
        leerdoel: 'Je kunt een verdacht bericht herkennen en zeggen wat je dan doet.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Haast en dreiging zijn gereedschap van de dader: ze moeten voorkomen dat jij nog even nadenkt. Echte organisaties geven je juist de tijd om te controleren en bellen je desnoods zelf.'
      },
      // --- leerdoel 3.4-1 (2 van 2) ---
      {
        prompt: 'Je krijgt een appje van een onbekend nummer: "Hoi, dit is mama, nieuwe telefoon. Kun jij snel 250 euro overmaken?" Beschrijf wat je precies doet en waarom.',
        type: 'open',
        leerdoel: 'Je kunt een verdacht bericht herkennen en zeggen wat je dan doet.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        modelAnswer: 'Ik maak niets over en klik nergens op. Ik bel mijn moeder op het nummer dat ik al had, of ik zoek haar thuis op, want alleen zo weet ik zeker dat zij het is. Ik antwoord niet op het onbekende nummer, want dan weet de oplichter dat mijn nummer actief is. Daarna maak ik een screenshot, meld ik het thuis en blokkeer ik het nummer.',
        nakijkpunten: [
          'Maakt geen geld over en gaat niet in op de haast in het bericht.',
          'Controleert via het bekende nummer of in het echt, niet via het bericht zelf.',
          'Noemt melden, blokkeren of bewaren van bewijs.'
        ],
        feedback: 'Terugbellen op het oude nummer is de hele truc: de oplichter heeft juist nodig dat je het nieuwe nummer gelooft.'
      },
      // --- leerdoel 3.4-2 (1 van 3) ---
      {
        prompt: 'Leg uit hoe jij jezelf en je gegevens online beschermt. Noem drie maatregelen en zet er bij elke maatregel het risico bij dat je daarmee kleiner maakt.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen hoe je jezelf en je gegevens online beschermt.',
        denkniveau: 'maken_controleren',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ten eerste gebruik ik per account een lang en uniek wachtwoord; daarmee voorkom ik dat één lek al mijn accounts opent. Ten tweede heb ik twee-staps-verificatie aanstaan op mijn mail; daarmee komt iemand met alleen mijn wachtwoord er nog niet in. Ten derde staat mijn profiel op privé en deel ik geen documenten of adressen; daarmee maak ik het moeilijker om een geloofwaardig nepbericht over mij te schrijven of mijn identiteit te misbruiken.',
        nakijkpunten: [
          'Noemt drie verschillende maatregelen uit dit hoofdstuk.',
          'Koppelt aan elke maatregel het risico dat kleiner wordt.',
          'Gebruikt de begrippen van het hoofdstuk correct.'
        ],
        feedback: 'Een maatregel zonder het bijbehorende risico blijft een regeltje dat je net zo goed vergeet. Wie het risico erbij kan noemen, weet ook op welk moment die maatregel echt telt.'
      },
      // --- leerdoel 3.4-2 (2 van 3) ---
      {
        prompt: 'Welke keuze beschermt je account het best?',
        leerdoel: 'Je kunt uitleggen hoe je jezelf en je gegevens online beschermt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ajax2012! op al je accounts, want er zitten cijfers en een teken in.', correct: false, explanation: 'Negen tekens is te kort, en doordat het overal hetzelfde is opent een lek bij een site meteen al je accounts.', misconception: 'Kijkt alleen naar de vreemde tekens en telt de lengte en het hergebruik niet mee.' },
          { text: 'Je eigen naam met je geboortejaar erachter, want dat vergeet je nooit.', correct: false, explanation: 'Precies deze combinatie staat vooraan in elk raadprogramma, want allebei die gegevens zijn van jou op te zoeken.', misconception: 'Kiest gemak en vergeet dat juist deze gegevens overal te vinden zijn.' },
          { text: 'Eén heel moeilijk wachtwoord dat je op al je accounts gebruikt.', correct: false, explanation: 'Moeilijkheid helpt niet als het wachtwoord ergens uitlekt. Dan ligt het bij al je accounts tegelijk op straat.', misconception: 'Denkt dat moeilijkheid het hergebruik goedmaakt.' },
          { text: 'Blauwe kaars eet zaterdag 7!, alleen hier, plus een tweede stap.', correct: true, explanation: 'Lang, compleet en uniek, en op geen bekend woord gebouwd. De tweede stap dekt bovendien af wat er overblijft als het wachtwoord toch uitlekt.' }
        ],
        feedback: 'Bescherming werkt als een stapel lagen: lengte, per account een uniek wachtwoord en een tweede stap. Elke laag apart is met genoeg moeite te omzeilen, maar alle drie tegelijk bijna niet.'
      },
      // --- leerdoel 3.4-2 (3 van 3) ---
      {
        prompt: 'Wat doe je nadat je een phishingbericht hebt herkend en niets hebt aangeklikt?',
        leerdoel: 'Je kunt uitleggen hoe je jezelf en je gegevens online beschermt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je stuurt het bericht door naar je vrienden, zodat zij gewaarschuwd zijn.', correct: false, explanation: 'De link gaat dan naar meer mensen, en een van hen klikt er misschien wel op. Waarschuw ze liever in je eigen woorden.', misconception: 'Denkt te waarschuwen, maar verspreidt de link naar meer mensen.' },
          { text: 'Je antwoordt de afzender dat je er niet in trapt.', correct: false, explanation: 'Elk antwoord laat de dader weten dat dit adres of nummer actief is, en dan krijg je er juist meer.', misconception: 'Weet niet dat elk antwoord bevestigt dat het adres of nummer actief is.' },
          { text: 'Je laat het staan, want een bericht dat je niet opent kan geen kwaad.', correct: false, explanation: 'Voor jou misschien niet, maar door te melden kan een nepadres geblokkeerd worden voor iedereen die het daarna zou krijgen.', misconception: 'Denkt dat negeren genoeg is en ziet melden als overbodig.' },
          { text: 'Je maakt een screenshot, meldt het en blokkeert de afzender.', correct: true, explanation: 'Bewijs bewaren, melden bij een docent of bij de organisatie zelf, en blokkeren zijn samen de laatste stap van het stappenplan.' }
        ],
        feedback: 'Melden helpt niet alleen jou: een organisatie kan een nepadres laten blokkeren zodra iemand het doorgeeft.'
      }
    ]
  },

  '3.5': {
    learningGoals: [
      'Je kunt uitleggen wat versleuteling is met een voorbeeld.',
      'Je kunt uitleggen waarom https veiliger is dan http.',
      'Je kunt beredeneren waarom het slotje geen garantie is dat een webshop eerlijk is.'
    ],
    theorie: [
      {
        keyTerms: ['versleuteling', 'sleutel', 'certificaat', 'provider'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Versleutel het woord HELIX door elke letter drie plaatsen op te schuiven. Wat komt eruit, en wat heeft de ontvanger nodig?</p>',
          '<p><strong>Antwoord.</strong> H wordt K, E wordt H, L wordt O, I wordt L en X wordt A: samen KHOLA. De ontvanger heeft maar één ding nodig, namelijk de sleutel "drie plaatsen terug". Zonder die sleutel is KHOLA betekenisloos, ook al staat het gewoon leesbaar op papier. Op internet werkt het net zo, alleen is de sleutel daar zo groot dat hem raden miljarden jaren zou kosten.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['https', 'slotje', 'domeinnaam', 'KVK-nummer'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een webshop heet bol-com-outlet.net, heeft https, een slotje en verkoopt AirPods voor 29 euro. Wat concludeer je?</p>',
          '<p><strong>Antwoord.</strong> Dat het slotje hier niets bewijst. Het zegt alleen dat mijn gegevens versleuteld naar deze partij gaan, en verder eigenlijk niets. Dat deze partij te vertrouwen is bewijst het niet, want iedereen kan een certificaat aanvragen. De domeinnaam klopt bovendien niet: de echte winkel is bol.com, en bol-com-outlet.net is een andere eigenaar met een gelijkende naam. De prijs is het derde signaal. Ik bestel hier niet en check de winkel bij de Fraudehelpdesk of via Check de verkoper van de politie.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Versleuteling zet je gegevens met een sleutel om in tekens waar niemand onderweg iets van begrijpt. Https gebruikt die versleuteling, http niet. Het slotje zegt dus alleen iets over de verbinding; of de winkel eerlijk is lees je af aan de domeinnaam, het KVK-nummer en checksites.</p>',
      keyTerms: ['versleuteling', 'domeinnaam']
    },
    vragen: [
      {
        prompt: 'Wat gebeurt er precies bij versleuteling?',
        leerdoel: 'Je kunt uitleggen wat versleuteling is met een voorbeeld.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'samen_oefenen',
        options: [
          { text: 'Je bestand wordt kleiner gemaakt zodat het sneller verstuurd kan worden.', correct: false, explanation: 'Dat is inpakken. Bij versleutelen verandert de leesbaarheid en niet de grootte.', misconception: 'Verwart versleutelen met inpakken of comprimeren.' },
          { text: 'Je gegevens worden verstopt in een map die niemand kan vinden.', correct: false, explanation: 'Er wordt niets verstopt. Het bericht komt gewoon zichtbaar voorbij, maar het betekent niets zonder de sleutel.', misconception: 'Denkt dat verbergen hetzelfde is als onleesbaar maken.' },
          { text: 'Je gegevens worden met een sleutel omgezet in onleesbare tekens.', correct: true, explanation: 'Het bericht blijft gewoon zichtbaar, maar het betekent niets meer voor wie de sleutel niet heeft.' },
          { text: 'Je gegevens worden gewist zodra iemand anders ze probeert te openen.', correct: false, explanation: 'Er wordt niets gewist. Wie de sleutel niet heeft ziet alleen tekens die hij niet kan terugdraaien.', misconception: 'Denkt aan een zelfvernietiging in plaats van aan een geheimschrift.' }
        ],
        feedback: 'Versleutelde gegevens zijn niet verborgen maar onbegrijpelijk gemaakt, en dat is hier een belangrijk verschil. Wie meeleest ziet de tekens gewoon voorbijkomen, maar zonder de sleutel heeft hij er niets aan.'
      },
      {
        prompt: 'Waarom is een pagina met https veiliger dan dezelfde pagina met http?',
        leerdoel: 'Je kunt uitleggen waarom https veiliger is dan http.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        options: [
          { text: 'Omdat alles wat je verstuurt onderweg versleuteld wordt.', correct: true, explanation: 'De s van secure staat precies voor die versleutelde verbinding, zodat niemand onderweg kan meelezen.' },
          { text: 'Omdat de pagina met https sneller laadt en er dus minder mis kan gaan.', correct: false, explanation: 'Snelheid en veiligheid staan hier los van elkaar. De s van secure gaat over versleutelen en niet over laadtijd.', misconception: 'Verwart snelheid met beveiliging.' },
          { text: 'Omdat de eigenaar van een https-site door de overheid is gecontroleerd.', correct: false, explanation: 'Zo\'n keuring bestaat niet. Er wordt alleen gecontroleerd of de aanvrager dat webadres beheert; wie hij is blijft ongecontroleerd.', misconception: 'Denkt dat er een keuring van de eigenaar achter zit in plaats van een certificaat voor de verbinding.' }
        ],
        feedback: 'Met http reist je wachtwoord leesbaar langs elke router en elk netwerk dat onderweg ligt. Met https gaat er alleen onleesbare tekst over de lijn, ook al is het dezelfde route.'
      },
      {
        prompt: 'Een webshop met een slotje in de adresbalk is daarmee een betrouwbare winkel.',
        waar: false,
        leerdoel: 'Je kunt beredeneren waarom het slotje geen garantie is dat een webshop eerlijk is.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        feedback: 'Het slotje gaat over de weg ernaartoe, niet over de winkel aan het eind. Een oplichter vraagt net zo goed een certificaat aan. Dat gebeurt tegenwoordig bijna altijd.'
      },
      {
        prompt: 'Leg met een zelfbedacht geheimschrift uit wat versleuteling is en welke rol de sleutel daarbij speelt.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen wat versleuteling is met een voorbeeld.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik schuif elke letter vijf plaatsen op in het alfabet, dus PIZZA wordt UNEEF. Voor iedereen die de regel niet kent is UNEEF onzin. De sleutel is hier "vijf plaatsen terug", en alleen wie die kent leest het bericht weer. Versleuteling is dus het omzetten van leesbare tekst in onleesbare tekens, waarbij de sleutel bepaalt wie het kan terugdraaien.',
        nakijkpunten: [
          'Geeft een eigen voorbeeld waarin een woord echt omgezet wordt.',
          'Benoemt de sleutel als de regel die het terugdraaien mogelijk maakt.',
          'Legt uit dat het bericht zonder sleutel betekenisloos is.'
        ],
        feedback: 'Een eigen voorbeeld laat zien dat je echt snapt hoe het werkt en het niet alleen kunt navertellen. Zonder de regel erbij is de omgezette tekst helemaal waardeloos, ook voor iemand die meeleest.'
      },
      {
        prompt: 'Twee klasgenoten spreken elkaar tegen. Jaïr zegt: zonder slotje is een site altijd oplichterij. Fenna zegt: mét een slotje is een site altijd te vertrouwen. Leg uit waarom ze allebei iets missen, en noem twee controles die wél iets over betrouwbaarheid zeggen.',
        type: 'open',
        leerdoel: 'Je kunt beredeneren waarom het slotje geen garantie is dat een webshop eerlijk is.',
        denkniveau: 'maken_controleren',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ze verwarren allebei de weg met de bestemming. Het slotje gaat alleen over de verbinding: het zegt dat mijn gegevens versleuteld bij die partij aankomen, en niets over wie die partij is. Fenna mist dat een oplichter net zo goed een certificaat kan aanvragen, dus versleuteld gestolen blijft gestolen. Jaïr mist dat een site zonder slotje ook gewoon een oude of slecht onderhouden site kan zijn, bijvoorbeeld van een sportclub die niets van mij vraagt. Ontbrekende versleuteling is een reden om daar niets in te vullen, geen bewijs van oplichting. Wat wel iets zegt: de domeinnaam letter voor letter vergelijken met de echte naam, en de winkel opzoeken via Check de verkoper van de politie of het KVK-nummer natrekken bij de Kamer van Koophandel.',
        nakijkpunten: [
          'Legt uit dat het slotje over de verbinding gaat en niet over de eigenaar.',
          'Weerlegt beide klasgenoten afzonderlijk en niet alleen de een.',
          'Noemt twee concrete controles buiten de website zelf om.'
        ],
        feedback: 'Het slotje is geen stempel van goedkeuring en het ontbreken ervan is geen bewijs van kwade wil. Het zegt allebei alleen iets over de verbinding, en betrouwbaarheid controleer je altijd buiten de site om.'
      },
      // Terugkeervraag 1: leerdoel uit 3.2.
      {
        prompt: 'Terugblik op 3.2: welke controle uit die paragraaf lijkt het meest op het letter voor letter nalopen van een domeinnaam?',
        leerdoel: 'Je kunt aan een bericht of e-mail zien of het phishing kan zijn.',
        denkniveau: 'begrijpen',
        niveau: 'verdieping',
        rol: 'samen_oefenen',
        options: [
          { text: 'Het adres van de afzender vergelijken met het echte adres.', correct: true, explanation: 'In beide gevallen kijk je of een naam die bijna klopt ook echt van die organisatie is; je vergelijkt met de officiële website.' },
          { text: 'Het letten op de haast en de dreiging die in het bericht zitten.', correct: false, explanation: 'Dat is wel een phishingsignaal, maar het gaat over de toon van het bericht en niet over een naam die je letter voor letter naleest.', misconception: 'Herkent wel een phishingsignaal, maar niet de controle die over een naam gaat.' },
          { text: 'Het openen van de bijlage om te zien wat er precies in staat.', correct: false, explanation: 'Een bijlage open je juist nooit. Je kunt allang oordelen zonder het bericht verder open te klappen.', misconception: 'Denkt dat je pas kunt oordelen als je het bericht helemaal opengeklapt hebt.' },
          { text: 'Het tellen van de spelfouten die in het bericht gemaakt zijn.', correct: false, explanation: 'Spelfouten zijn meegenomen, maar veel nepberichten zitten inmiddels foutloos in elkaar. Het afzenderadres blijft de harde controle.', misconception: 'Rekent op slordigheid van de dader in plaats van op een harde controle.' }
        ],
        feedback: 'Een naam die bijna klopt is het oudste trucje van internet. In een webadres werkt het net zo goed als in het mailadres van een phishingbericht, en in allebei de gevallen zie je het alleen als je letter voor letter leest.'
      },
      // Terugkeervraag 2: leerdoel uit 3.3.
      {
        prompt: 'Terugblik op 3.3: op een webshop zonder slotje vraagt het bestelformulier om je geboortedatum en een kopie van je ID. Leg uit welke twee dingen hier tegelijk misgaan, en waarom elk van die twee op zichzelf al genoeg is om te stoppen.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen welke gegevens je beter niet online deelt.',
        denkniveau: 'maken_controleren',
        niveau: 'verdieping',
        rol: 'zelf_proberen',
        modelAnswer: 'Het eerste dat misgaat is de verbinding: zonder https en zonder slotje reist alles wat ik intyp leesbaar over het netwerk, dus ook mijn geboortedatum en mijn kopie. Het tweede dat misgaat is de vraag zelf: een webshop heeft mijn identiteitsbewijs helemaal niet nodig om een pakje te bezorgen, en met een naam, geboortedatum en handtekening bij elkaar kan iemand zich voordoen als mij. Elk van die twee is op zichzelf al genoeg. Zou de shop wél https hebben, dan bleef de vraag om een ID onterecht, en zou hij alleen mijn adres vragen, dan bleef de open verbinding een probleem.',
        nakijkpunten: [
          'Benoemt het ontbreken van https als een probleem van de verbinding: alles reist leesbaar.',
          'Benoemt de kopie van het identiteitsbewijs als gegevens die je nooit deelt, met het risico van identiteitsfraude erbij.',
          'Laat zien dat de twee onafhankelijk van elkaar al reden zijn om te stoppen.'
        ],
        feedback: 'Hier gaan twee alarmbellen tegelijk af, en het is de moeite waard om ze uit elkaar te houden. De ene gaat over de weg waarlangs je gegevens reizen, de andere over welke gegevens je in dit vakje eigenlijk afgeeft. Een echte winkel heeft je identiteitsbewijs niet nodig om een pakje te bezorgen.'
      }
    ]
  }
};
