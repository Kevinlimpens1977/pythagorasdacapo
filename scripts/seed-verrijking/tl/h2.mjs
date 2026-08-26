// Verrijkingslaag hoofdstuk 2 - Je device en hoe het werkt. Theoretische leerweg (tl).
//
// Patroon: scripts/seed-verrijking/PATROON.md. De structuur en de lesstof staan
// in scripts/seed-structuur/tl/h2.mjs; daar staat ook waar elke bronregel landt.
//
// ELK GETAL IN DEZE KOP IS GETELD, NIET GESCHAT (ronde 8)
// -------------------------------------------------------
// De criticus betrapte deze kop in ronde 7 op VIJF getallen tegelijk die niet
// meer bij de inhoud pasten: negen quizvragen in 2.1 terwijl het er tien waren,
// 29 en op een andere regel 28 toetsitems terwijl het er 30 waren, 71 quiz- en
// toetsvragen terwijl het er 73 waren, en "elk leerdoel precies twee keer"
// terwijl hardware tegenover software er drie kreeg. Ook de rollentelling liep
// achter. Dat is precies de defectklasse die de kop van het structuurbestand
// beloofde te hebben opgelost, en die kop was toen wel bijgewerkt en deze niet.
// Alle getallen hieronder zijn opnieuw geteld uit dit bestand en uit de
// gegenereerde seed, en de kop van het structuurbestand telt dezelfde getallen.
// Wie hier een vraag toevoegt of weghaalt, telt opnieuw met:
//
//   node -e "import('./scripts/seed-verrijking/tl/h2.mjs').then(m=>{const v=m.default;
//     let t=0;for(const k of Object.keys(v)){if(v[k].vragen){console.log(k,v[k].vragen.length);
//     t+=v[k].vragen.length;}}console.log('totaal',t);});"
//
// DE TELLING VAN RONDE 8
// ----------------------
//   quiz- en toetsvragen  75, verdeeld als 2.1: 11, 2.2: 7, 2.3: 12 (deeltoets),
//                         2.4: 7, 2.5: 30 (hoofdstuktoets), 2.6: 8
//   vraagsoorten          52 meerkeuze, 9 waar-niet-waar, 14 open
//   scaffoldingrollen     6 samen_oefenen, 5 ik_doe_voor, 14 bewijs_leveren,
//                         1 reflecteren, 49 zelf_proberen (samen 75)
//   in het structuurbestand: 23 startvragen, 54 oefenopgaven, 16 mediablokken,
//                         12 uitgewerkte voorbeelden, 88 contentblokken
//
// WAT HIER AANTOONBAAR IS GEREGELD
// --------------------------------
//   - Elk theorieblok heeft een uitgewerkt voorbeeld (vraag plus volledige
//     uitwerking). Dat komt voor het oefenblok, dus voor het zelfstandig oefenen.
//   - Een gewone afsluitquiz heeft zeven vragen: vijf over de eigen paragraaf en
//     TWEE terugkeervragen over een eerdere paragraaf of over hoofdstuk 1. Die
//     twee staan onderaan de lijst en zijn met een comment gemarkeerd. Zo staan
//     2.2 en 2.4 erbij.
//   - UITZONDERING 1: 2.1 heeft er ELF. In ronde 5 gingen drie van de zeven
//     vragen over hoofdstuk 1, zodat er in de openingsparagraaf maar vier vragen
//     over de eigen leerdoelen overbleven en geen enkele open vraag. Er kwamen
//     achtereenvolgens bij: de bronvraag over koeling en een OPEN vergelijkvraag
//     over laptop tegenover vaste computer (ronde 5), een vraag over het rijtje
//     van zeven onderdelen (ronde 7) en in ronde 8 een tweede OPEN vraag waarin
//     de leerling drie onderdelen benoemt, hun taak geeft en het gevolg van
//     uitval beschrijft.
//   - UITZONDERING 2: 2.3 is de DEELTOETS over 2.1 t/m 2.3 en heeft TWAALF
//     vragen. Die twaalf dekken alle NEGEN leerdoelen van die drie paragrafen;
//     ze zijn verdeeld als 6 over 2.3 zelf, 3 over 2.1 en 3 over 2.2. (In ronde 8
//     stond hier "2.3 zelf komt er vier keer in voor", en dat waren er zes: de
//     twee cloudvragen, item 4 en item 12, waren niet meegeteld. Nateltellen doe
//     je met het script bovenaan deze kop plus de leerdoeltoewijzing, niet op het
//     oog.) De blauwdruk noemt 8 tot 10 vragen voor
//     een deeltoets, maar met tien blijft er een leerdoel onbevraagd, en een
//     meting die een doel overslaat kan over dat doel niets zeggen. Dat is
//     dezelfde afweging als bij de 30 toetsvragen hieronder: dekking wint van het
//     ronde getal. Het getal twaalf is bovendien niet vrij: de praktijkopdracht
//     van 2.3 kondigt "twaalf vragen" aan en de routestap in de eerste
//     startvraag van 2.4 rekent met acht en met tien van die twaalf.
//   - UITZONDERING 3: 2.6, de vrijwillige plusparagraaf, heeft er ACHT. In
//     ronde 8 is er een open verdiepingsvraag bij gekomen die de kringloop van
//     2.6 verbindt met de onderdelen uit 2.1; het jaarplan vraagt voor tl
//     expliciet om zulke vragen over paragraafgrenzen heen.
//   - DE HOOFDSTUKTOETS VAN 2.5 heeft DERTIG vragen. Hij bevraagt alle veertien
//     leerdoelen van 2.1 tot en met 2.5, dertien daarvan twee keer en het doel
//     "je kunt het verschil uitleggen tussen hardware en software" DRIE keer,
//     plus een open item over de vier gebruiksregels uit de bronles. Dat maakt
//     13x2 + 3 + 1 = 30. Die derde meting is bewust: hardware tegenover software
//     is het onderscheid dat in elk volgend hoofdstuk terugkomt, en het zijn drie
//     verschillende sporen (de virusvraag, de PowerPoint-vraag en de open vraag
//     met een voorbeeld van het eigen device). 2.5 theorie B vertelt de leerling
//     dit ook zo, dus de aankondiging en de toets zeggen hetzelfde. Geen enkele
//     vraag staat zonder leerdoel. Het gebruiksregelitem hangt aan het
//     hoofdstuk-1-leerdoel over het wachtwoord, want regel 2 zit daar
//     rechtstreeks op; het vraagt in dezelfde vraag ook de andere drie regels
//     uit. De vrijwillige plusparagraaf 2.6 wordt nooit bevraagd.
//   - GEEN LABEL DAT IETS ANDERS MEET DAN HET BELOOFT (ronde 8). Twee items
//     hingen aan hardware tegenover software terwijl ze Office-programmakennis
//     maten: "Welk Office-programma gebruik je voor het maken van presentaties?"
//     in de hoofdstuktoets en "In welk programma zet je getallen in een
//     spreadsheet?" in de afsluitquiz van 2.4. Beide zijn herschreven: ze
//     gebruiken PowerPoint en Excel nog steeds als materiaal, maar vragen nu naar
//     de indeling tastbaar tegenover niet-tastbaar. De Office-stof uit de bron
//     (Word documenten, Excel spreadsheets, PowerPoint presentaties) staat
//     onveranderd in 2.2 theorie B, in de oefenopgave van 2.2 en in de
//     samenvatting van 2.2, dus er verdwijnt niets uit de bron.
//   - Elke open vraag heeft een modelantwoord en nakijkpunten.
//   - OPTIELENGTE (hersteld in ronde 3, sindsdien bewaakt). In ronde 2 was het
//     goede antwoord in 29 van de 45 meerkeuzevragen de langste knop; wie niets
//     las en steeds de langste knop aanklikte, haalde de quiz van 2.1 voor 100
//     procent en de hoofdstuktoets voor tweederde. De oorzaak was systematisch:
//     het goede antwoord kreeg de hele verklarende zin en de afleiders bleven
//     kort. Elke redengevende bijzin staat nu in `explanation`, waar hij pas na
//     het antwoorden te lezen is, en de afleiders zijn op lengte bijgetrokken.
//     Stand nu: 6 van de 42 meerkeuzevragen met een enkele langste knop hebben
//     het goede antwoord als langste (14 procent, toeval is 25 procent), en geen
//     enkel blok is op lengte te raden. De positieverdeling van het goede
//     antwoord over de 52 meerkeuzevragen is 13, 17, 13, 9.
//     scripts/validate-digitale-vaardigheden-seed.mjs bewaakt dit met een blinde
//     proef plus een controle per losse vraag.
//   - AANDEEL OPEN VRAGEN. Het jaarplan vraagt voor tl "meer open vragen waarin
//     de leerling iets moet uitleggen of vergelijken". Van de 75 quiz- en
//     toetsvragen zijn er 14 open (19 procent), verdeeld over alle zes de
//     paragrafen: 2.1 heeft er 2, 2.2 2, 2.3 2, 2.4 1, 2.5 5 en 2.6 2. In ronde 5
//     stond de openingsparagraaf 2.1 nog op nul open vragen, en na ronde 7 waren
//     2.1 en 2.6 de twee blokken die met een enkele open vraag achterbleven.
//
// AFWIJKING VAN DE BLAUWDRUK, BEWUST EN MET REDEN
// -----------------------------------------------
// De blauwdruk noemt 15 tot 20 toetsvragen en "elk doel 2x". Die twee kunnen
// hier niet allebei: dit hoofdstuk heeft veertien leerdoelen, dus elk doel twee
// keer bevragen kost er al 28. Het aantal 15-20 staat in de blauwdruk als
// ONTWERPKEUZE met de redenering "een item per doel is te dun"; die redenering
// zelf weegt zwaarder dan het getal, en de dekkingseis is er wel met bewijs
// onderbouwd. Daarom 28 doelitems, plus de derde meting van hardware tegenover
// software, plus het item over de gebruiksregels: 30.
//
// WAT HIER NIET OP TE LOSSEN IS
// -----------------------------
// 1. De criticus stelde voor die dertig items over twee blokken van vijftien te
//    verdelen, bijvoorbeeld 2.1 t/m 2.3 en 2.4 t/m 2.5. Dat kan niet vanuit een
//    hoofdstukbestand: scripts/generate-digitale-vaardigheden-seed.mjs maakt per
//    paragraaf precies een blok van het type quiz of toets (regel 896 tot 901)
//    en het tokenplan kent een enkele post `assessment`. Twee blokken vragen dus
//    een generatorwijziging, en die raakt alle drie de leerwegen en alle acht de
//    hoofdstukken tegelijk. Dat hoort bij een generatorwijziging en niet bij een
//    hoofdstukbouwer. Wat hier wel kon is de leerling vooraf vertellen wat hem te
//    wachten staat: 2.5 theorie B noemt het aantal metingen per doel en wijst
//    eerst naar de diagnostische ronde van vijftien vragen in het oefenblok.
// 2. De afsluitquiz van een gewone paragraaf staat op allowAiHelp: true, terwijl
//    stap 10 van de blauwdruk een ophaalmoment is. Die schakelaar staat in
//    blockSettings() in dezelfde generator (regel 206: het type 'quiz' krijgt hem
//    onvoorwaardelijk) en niet in dit bestand, en hij raakt opnieuw alle drie de
//    leerwegen. De startcheck, het zelf-oefenblok en de hoofdstuktoets staan wel
//    al op false, dus per blok kan het; alleen niet van hieruit.
// Zie de kop van het structuurbestand voor de rest van de verantwoording.

export default {
  '2.1': {
    learningGoals: [
      'Je kunt de belangrijkste onderdelen van een computer benoemen: processor, werkgeheugen, geluidskaart, videokaart, opslag, koeling en moederbord.',
      'Je kunt uitleggen wat elk onderdeel doet.',
      'Je kunt het verschil uitleggen tussen een laptop en een vaste computer.'
    ],
    theorie: [
      {
        keyTerms: ['hardware', 'software', 'vast systeem'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sam mag kiezen tussen een laptop en een vaste computer om video mee te bewerken. Wat adviseer je, en waarom?</p>',
          '<p><strong>Antwoord.</strong> Voor videobewerking adviseer je de vaste computer. In die kast is meer ruimte, dus er passen grotere onderdelen en die kunnen hun warmte beter kwijt. Daardoor is een vast systeem bij hetzelfde geld meestal krachtiger. De prijs die Sam betaalt is dat hij op één plek moet werken, want er zit geen batterij in.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['processor', 'werkgeheugen', 'moederbord', 'koeling'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een spel start wel op, maar het beeld schokt en het geluid hapert. Dat gebeurt vooral zodra er veel tegelijk op het scherm te zien is. Welke onderdelen komen als eerste in beeld?</p>',
          '<p><strong>Antwoord.</strong> Het schokkende beeld wijst naar de videokaart, want die berekent alles wat je ziet. Dat het juist misgaat als er veel tegelijk gebeurt, wijst daarnaast op te weinig werkgeheugen. De processor moet dan namelijk steeds wachten tot de gegevens die hij nodig heeft klaarstaan. Blijft het apparaat ook nog warm en luidruchtig, dan is de koeling het derde spoor. De geluidskaart zelf is hier waarschijnlijk niet stuk, want het geluid stopt niet, het loopt achter.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: "<p>Alle onderdelen van een device die je kunt vasthouden en aanwijzen heten samen de hardware. De processor rekent en verwerkt, en het werkgeheugen houdt vast waar jij nu mee bezig bent. Het opslaggeheugen bewaart alles wat jij opslaat, ook nadat de stroom van het apparaat af gaat. De geluidskaart, de videokaart en de koeling hebben elk precies één eigen taak in je device. Op het moederbord zijn al die onderdelen aangesloten, zodat ze kunnen samenwerken en gegevens uitwisselen. Een laptop heeft kleinere onderdelen dan een vaste computer en is daardoor bij hetzelfde geld minder krachtig. Daar staat tegenover dat je een laptop overal mee naartoe kunt nemen, want er zit een accu in.</p>",
      keyTerms: ['hardware', 'processor', 'moederbord']
    },
    vragen: [
      // Het benoem-leerdoel had in ronde 6 in zijn eigen afsluitquiz geen vraag die
      // echt naar de zeven onderdelen vroeg: het item hieronder over opslag tegenover
      // cloud stond op dat label, maar meet iets anders. Dat item is nu gelabeld waar
      // het thuishoort (de taak van het opslaggeheugen) en deze vraag is erbij gezet,
      // zodat stap 3 van de vierslag ook in 2.1 zelf op het benoemen zit.
      {
        prompt: 'In de theorie staan zeven onderdelen van een computer op een rij. Welk van deze vier hoort NIET in dat rijtje?',
        leerdoel: 'Je kunt de belangrijkste onderdelen van een computer benoemen: processor, werkgeheugen, geluidskaart, videokaart, opslag, koeling en moederbord.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Werkgeheugen', correct: false, misconception: 'Denkt dat werkgeheugen iets anders is dan een onderdeel van de computer zelf.' },
          { text: 'Geluidskaart', correct: false, misconception: 'Twijfelt of een kaart voor geluid wel bij de zeven hoofdonderdelen hoort.' },
          { text: 'De oplader', correct: true, explanation: 'De oplader hoort bij de laptop, maar zit niet in het rijtje van zeven onderdelen binnen in de computer.' },
          { text: 'Moederbord', correct: false, misconception: 'Ziet het moederbord als een omhulsel in plaats van als een van de zeven onderdelen.' }
        ],
        feedback: 'De zeven zijn processor, werkgeheugen, geluidskaart, videokaart, opslag, koeling en moederbord. De oplader zit erbuiten.'
      },
      {
        prompt: 'Je slaat een verslag op in het opslaggeheugen van een schoollaptop. De volgende les krijg je een andere laptop. Wat is het gevolg?',
        leerdoel: 'Je kunt uitleggen wat elk onderdeel doet.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Je verslag staat er niet op; het opslaggeheugen zit in dat ene apparaat.', correct: true, explanation: 'Opslaggeheugen zit in het apparaat zelf, dus het bestand blijft daar achter; alleen de cloud reist met jouw account mee.' },
          { text: 'Je verslag staat er wel op, want alle schoollaptops delen hun geheugen.', correct: false, misconception: 'Denkt dat apparaten van school automatisch één gezamenlijk geheugen hebben.' },
          { text: 'Je verslag staat er wel op, want opslaggeheugen is hetzelfde als de cloud.', correct: false, misconception: 'Verwart opslag in het apparaat met opslag op internet.' },
          { text: 'Je verslag staat er alleen op als die laptop evenveel werkgeheugen heeft.', correct: false, misconception: 'Denkt dat het werkgeheugen bepaalt of een bestand bewaard blijft.' }
        ],
        feedback: 'Het opslaggeheugen zit ín het apparaat, dus je bestand blijft achter op die ene laptop. Via de cloud was het meegereisd.'
      },
      {
        prompt: 'Je koptelefoon geeft geen geluid meer, terwijl het beeld gewoon werkt. Welk onderdeel verdenk je als eerste?',
        leerdoel: 'Je kunt uitleggen wat elk onderdeel doet.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'De processor, want die voert in je device alle taken uit.', correct: false, misconception: 'Denkt dat de processor elk probleem veroorzaakt, omdat hij overal bij betrokken is.' },
          { text: 'Het moederbord, want daarop zit ieder onderdeel aangesloten.', correct: false, misconception: 'Kiest het onderdeel dat alles verbindt in plaats van het onderdeel met die ene taak.' },
          { text: 'De koeling, want die zorgt dat het apparaat het volhoudt.', correct: false, misconception: 'Verwart oververhitting met een storing in één specifieke uitgang.' },
          { text: 'De geluidskaart, want die stuurt het geluid naar buiten.', correct: true, explanation: 'De geluidskaart is precies het onderdeel dat geluid aanstuurt en naar je koptelefoon of speakers stuurt.' }
        ],
        feedback: 'Beeld werkt en geluid niet: dan zit de storing in het onderdeel met precies die taak, de geluidskaart.'
      },
      {
        prompt: 'Wat is de taak van het werkgeheugen (RAM)?',
        leerdoel: 'Je kunt uitleggen wat elk onderdeel doet.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Gegevens langdurig bewaren, ook als het apparaat uit staat.', correct: false, misconception: 'Verwart werkgeheugen met opslaggeheugen.' },
          { text: "Programma's tijdelijk ondersteunen zodat alles soepel werkt.", correct: true, explanation: 'RAM houdt tijdelijk vast waar de processor op dit moment mee bezig is, en daardoor blijft je laptop soepel werken.' },
          { text: 'Bestanden klaarzetten en naar de printer doorsturen.', correct: false, misconception: 'Denkt dat geheugen hetzelfde is als het doorgeven van opdrachten.' },
          { text: 'Beelden mooier maken en de kleuren bijstellen.', correct: false, misconception: 'Verwart het werkgeheugen met de videokaart.' }
        ],
        feedback: 'Werkgeheugen is een werkbank en geen kast: het houdt vast waar je nu mee bezig bent en is daarna weer leeg.'
      },
      {
        prompt: 'Een laptop is bijna altijd krachtiger dan een vaste computer, omdat de onderdelen kleiner zijn.',
        waar: false,
        leerdoel: 'Je kunt het verschil uitleggen tussen een laptop en een vaste computer.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        feedback: 'Kleiner is hier juist zwakker. In een vaste computer passen grotere onderdelen, en die kunnen hun warmte beter kwijt.'
      },
      {
        // Bronvraag uit les 2 ("Waarom denk jij dat het niet zo goed is voor je
        // laptop om hem altijd in de oplader te houden?"). Het bronantwoord staat
        // sinds ronde 2 ook in theorie A van 2.1.
        prompt: 'Waarom is het niet goed voor je laptop om hem altijd in de oplader te houden?',
        leerdoel: 'Je kunt het verschil uitleggen tussen een laptop en een vaste computer.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Een apparaat dat aan de oplader hangt werkt merkbaar minder snel.', correct: false, misconception: 'Denkt dat opladen rekenkracht kost en het apparaat vertraagt.' },
          { text: 'Een apparaat dat constant wordt opgeladen kan oververhit raken.', correct: true, explanation: 'Een accu die altijd vol wordt gehouden, wordt warm; in het ergste geval vliegt zo\'n oververhitte accu in de brand.' },
          { text: 'De oplader trekt stroom uit je werkgeheugen en wist je bestanden.', correct: false, misconception: 'Verwart de stroomvoorziening met het geheugen waarin gegevens staan.' },
          { text: 'Het maakt niets uit; een laptop mag er altijd in blijven zitten.', correct: false, misconception: 'Denkt dat de laptop zichzelf zo goed regelt dat er nooit een risico is.' }
        ],
        feedback: 'Het gaat om warmte. Een accu die constant wordt bijgeladen kan oververhit raken, en dat is een echt brandrisico.'
      },
      {
        // Bronvraag uit de verdiepingsset van les 2 ("Waarom heeft een computer
        // koeling nodig?"), met de drie antwoorden die de bron zelf aanbiedt. De
        // twee afleiders zijn een paar woorden langer gemaakt dan in de bron,
        // zodat het goede antwoord hier niet de langste knop is; de inhoud van
        // alle drie de opties is ongewijzigd.
        prompt: 'Waarom heeft een computer koeling nodig?',
        leerdoel: 'Je kunt uitleggen wat elk onderdeel doet.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Om bestanden sneller op te slaan en weer terug te vinden.', correct: false, misconception: 'Verbindt koeling met snelheid van opslaan in plaats van met warmte.' },
          { text: 'Om te voorkomen dat de computer oververhit raakt.', correct: true, explanation: 'Onderdelen die rekenen geven warmte af; zonder ventilatoren en luchtroosters loopt die warmte op tot het apparaat uitvalt.' },
          { text: 'Om geluid af te kunnen spelen via je speakers of koptelefoon.', correct: false, misconception: 'Verwart de koeling met de geluidskaart, omdat je allebei kunt horen.' }
        ],
        feedback: 'Rekenen kost energie en energie komt er als warmte weer uit. De koeling voert precies die warmte af.'
      },
      {
        prompt: 'Je klasgenoot zegt: een laptop en een vaste computer zijn hetzelfde, alleen de vorm verschilt. Leg uit waarom dat niet klopt, en gebruik minstens twee onderdelen in je uitleg.',
        type: 'open',
        leerdoel: 'Je kunt het verschil uitleggen tussen een laptop en een vaste computer.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Het verschil zit in de ruimte, en die ruimte bepaalt hoe krachtig het apparaat kan zijn. In de kast van een vaste computer past een grotere processor en een grotere videokaart, want daar is plaats voor. Er past ook een grotere koeling, dus de warmte van die onderdelen kan er beter uit en het apparaat hoeft zichzelf minder af te remmen. In een laptop moet alles klein en dun blijven, dus de onderdelen zijn kleiner en bij hetzelfde geld is een laptop meestal minder krachtig. Daar staat tegenover dat een laptop een accu en een ingebouwd scherm heeft, en dat je hem dus overal mee naartoe kunt nemen.',
        nakijkpunten: [
          'Noemt minstens twee onderdelen, bijvoorbeeld de processor, de videokaart of de koeling.',
          'Legt uit dat er in een vaste computer meer ruimte is en dat de onderdelen daardoor groter kunnen zijn.',
          'Noemt het voordeel van de laptop, namelijk dat je hem door de accu overal mee naartoe kunt nemen.'
        ],
        feedback: 'Vorm en kracht hangen hier samen: ruimte bepaalt hoe groot de onderdelen en de koeler mogen zijn.'
      },
      {
        // RONDE 8. Het jaarplan vraagt voor tl "meer open vragen waarin de leerling
        // iets moet uitleggen of vergelijken". De openingsparagraaf had er één op tien,
        // het laagste aandeel van het hoofdstuk. Dit tweede open item bevraagt het
        // benoem-leerdoel, dat verder alleen gesloten gemeten werd.
        prompt: 'Kies drie van de zeven onderdelen uit deze paragraaf. Schrijf per onderdeel op hoe het heet, welke taak het heeft en wat jij zou merken als het uitvalt.',
        type: 'open',
        leerdoel: 'Je kunt de belangrijkste onderdelen van een computer benoemen: processor, werkgeheugen, geluidskaart, videokaart, opslag, koeling en moederbord.',
        denkniveau: 'uitleggen',
        niveau: 'kern',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik kies de processor, de videokaart en de koeling. De processor is het rekenhart en voert alle taken uit; werkt hij niet goed, dan wordt alles op mijn laptop traag. De videokaart maakt het beeld en stuurt dat naar het scherm; valt hij weg, dan gaat het beeld schokken of blijft mijn scherm zwart. De koeling voert met ventilatoren de warmte af langs de lamellen; slaat die af, dan wordt mijn laptop heet en remt hij zichzelf af of valt hij uit. De namen van de andere vier zijn werkgeheugen, geluidskaart, opslaggeheugen en moederbord.',
        nakijkpunten: [
          'Drie onderdelen zijn met de juiste naam uit de zeven gekozen, dus geen zelfbedachte namen.',
          'Bij elk onderdeel staat een taak die alleen dat onderdeel heeft, in eigen woorden opgeschreven.',
          'Bij elk onderdeel staat een gevolg dat je als gebruiker zou merken, en dat gevolg past bij die taak.'
        ],
        feedback: 'Een naam zonder taak is nog geen kennis. Koppel elk onderdeel aan het gevolg dat jij zou merken als het wegvalt.'
      },
      // --- Terugkeervragen: spreiding over hoofdstuk 1 ---
      {
        prompt: 'Bij deze opdracht lever je je resultaat in met een screenshot. Wat doe je nadat je het screenshot hebt gemaakt?',
        leerdoel: 'Je kunt een screenshot maken en die inleveren bij je docent.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'Ik laat het staan; mijn docent zoekt het wel op mijn laptop.', correct: false, misconception: 'Denkt dat een bestand op de eigen laptop vanzelf bij de docent terechtkomt.' },
          { text: 'Ik mail het naar mijn docent of ik sla het op in OneDrive.', correct: true, explanation: 'Inleveren betekent dat het bewijs bij je docent terechtkomt, via mail of via OneDrive, precies zoals je docent aangeeft.' },
          { text: 'Ik zet het in een groepsapp, dan hebben klasgenoten het ook.', correct: false, misconception: 'Verwart delen met klasgenoten met inleveren bij de docent.' },
          { text: 'Ik print het en leg de afdruk voor mij op mijn tafel.', correct: false, misconception: 'Denkt dat digitaal werk pas telt als het op papier staat.' }
        ],
        feedback: 'Een screenshot is pas bewijs als je docent erbij kan. Mailen of in OneDrive zetten maakt het inleveren compleet.'
      },
      {
        prompt: 'Waarom geef je je wachtwoord nooit aan iemand anders, ook niet aan je beste vriend of vriendin?',
        leerdoel: 'Je weet waarom je je wachtwoord nooit aan iemand anders geeft.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'reflecteren',
        options: [
          { text: 'Omdat je wachtwoord daarna automatisch komt te vervallen.', correct: false, misconception: 'Denkt dat een systeem merkt dat een wachtwoord gedeeld is en het dan ongeldig maakt.' },
          { text: 'Omdat je zelf niet meer met dat wachtwoord kunt inloggen.', correct: false, misconception: 'Denkt dat een wachtwoord maar door één persoon tegelijk gebruikt kan worden.' },
          { text: 'Omdat alles wat er daarna gebeurt op jouw naam staat.', correct: true, explanation: 'Jij blijft verantwoordelijk voor je account, ook als iemand anders het met jouw wachtwoord gebruikt.' },
          { text: 'Omdat de schoolcomputer daar langzamer van gaat werken.', correct: false, misconception: 'Zoekt een technisch gevolg in plaats van een gevolg voor jouzelf.' }
        ],
        feedback: 'Je account is jouw naam. Wie jouw wachtwoord heeft, handelt onder jouw naam, en daar word jij op aangesproken.'
      }
    ]
  },

  '2.2': {
    learningGoals: [
      'Je kunt het verschil uitleggen tussen hardware en software.',
      'Je weet wat een besturingssysteem doet en welke jij op school gebruikt.',
      'Je weet waarom je je device regelmatig moet updaten.'
    ],
    theorie: [
      {
        keyTerms: ['besturingssysteem', 'bureaublad', 'taakbalk', 'touchpad'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Milan werkt thuis op een MacBook en zoekt daar het Windows-vlaggetje links naast het zoekvak. Hij vindt het niet. Wat is er aan de hand?</p>',
          '<p><strong>Antwoord.</strong> Er is niets stuk. Een MacBook draait een ander besturingssysteem dan Windows, en elk besturingssysteem heeft zijn eigen indeling. De balk met snelkoppelingen heet daar anders en staat bovendien op een heel andere plek. Het startmenu zoals Windows dat kent bestaat op een MacBook helemaal niet in die vorm. Milan zoekt dus niet naar hetzelfde knopje, maar naar dezelfde functie: de plek waar alle programma\'s bij elkaar staan.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['Microsoft Office', 'stuurprogramma', 'bijwerken'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Tijdens het maken van een verslag verschijnt de melding: opnieuw opstarten om updates te voltooien. Je bent nog niet klaar. Wat doe je?</p>',
          '<p><strong>Antwoord.</strong> Eerst opslaan, want bij het opnieuw opstarten gaat alles verloren wat nog niet bewaard is. Daarna stel je het opstarten uit tot het einde van de les en voer je de update alsnog uit. Wegklikken en vergeten is de slechtste keuze, want de fouten die deze update repareert blijven dan openstaan. Juist van zulke bekende gaten in oude software maken virussen dankbaar gebruik.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: "<p>Het besturingssysteem is de software die je hele device aanstuurt en alle andere programma's laat werken. Op school is dat meestal Windows, terwijl een MacBook of een Chromebook een ander systeem gebruikt. Via het startmenu open je Microsoft Office: Word voor documenten, Excel voor spreadsheets en PowerPoint voor presentaties. Bij een update wordt een stuurprogramma of een programma bijgewerkt, en dat haalt bekende fouten eruit. Een update voegt daarnaast nieuwe functies toe, dus uitstellen laat een bekend gat openstaan voor virussen. Op school gelden vier gebruiksregels: niet onbeheerd achterlaten, je wachtwoord voor jezelf houden, veilig downloaden en hulp vragen.</p>",
      keyTerms: ['besturingssysteem', 'software', 'stuurprogramma']
    },
    vragen: [
      {
        prompt: 'Welke van deze vier is software?',
        leerdoel: 'Je kunt het verschil uitleggen tussen hardware en software.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'De koeling die in je laptop zit.', correct: false, misconception: 'Ziet een onderdeel met een eigen taak aan voor een programma.' },
          { text: 'Het touchpad onder je toetsenbord.', correct: false, misconception: 'Denkt dat alles waarmee je bedient software is.' },
          { text: 'Windows, het besturingssysteem.', correct: true, explanation: 'Windows is het programma dat je computer aanstuurt; je kunt het niet vasthouden, dus het is software.' },
          { text: 'Het moederbord in de vaste computer.', correct: false, misconception: 'Kiest het onderdeel dat alles verbindt en noemt dat een programma.' }
        ],
        feedback: 'De test is simpel: kun je het vasthouden, dan is het hardware. Windows kun je niet vasthouden, dus dat is software.'
      },
      {
        prompt: "Zonder besturingssysteem worden de hardware en de programma's van een computer niet aangestuurd.",
        waar: true,
        leerdoel: 'Je weet wat een besturingssysteem doet en welke jij op school gebruikt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Klopt: het besturingssysteem is de laag die alles aanstuurt. Zonder die aansturing heb je niets aan de onderdelen.'
      },
      {
        // Bronvraag uit de opdrachtenset bij les 2, inclusief het bronantwoord.
        prompt: 'Is het verstandig om zomaar, diep in je computer, instellingen van je computer aan te passen?',
        leerdoel: 'Je weet wat een besturingssysteem doet en welke jij op school gebruikt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'Ja hoor, dat is verstandig; zo leer je je device het snelst kennen.', correct: false, misconception: 'Denkt dat rondklikken in systeeminstellingen een onschuldige manier van ontdekken is.' },
          { text: 'Nee, dat is niet verstandig. Je kunt schade doen aan jouw device.', correct: true, explanation: 'Diepe instellingen sturen het besturingssysteem aan; een verkeerde keuze kan je device onbruikbaar maken.' },
          { text: 'Ja, want het besturingssysteem draait alles automatisch terug bij een fout.', correct: false, misconception: 'Denkt dat er altijd een automatische terugweg is na een verkeerde instelling.' },
          { text: 'Dat maakt niet uit, want instellingen zijn hardware en die verandert niet.', correct: false, misconception: 'Ziet instellingen aan voor iets tastbaars in plaats van voor software.' }
        ],
        feedback: 'Diepe instellingen horen bij het besturingssysteem. Weet je niet wat een knop doet, laat hem staan of vraag het na.'
      },
      {
        prompt: 'Wat wordt er bij een update onder andere bijgewerkt?',
        leerdoel: 'Je weet waarom je je device regelmatig moet updaten.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Het moederbord, dat vervangen wordt door een nieuwer model.', correct: false, misconception: 'Denkt dat updaten iets aan de onderdelen zelf verandert.' },
          { text: 'Je wachtwoord, dat automatisch een stuk sterker wordt.', correct: false, misconception: 'Denkt dat een update ook je account beveiligt zonder dat je zelf iets doet.' },
          { text: 'De ventilator, die daarna een stuk harder gaat draaien.', correct: false, misconception: 'Verbindt updaten met de snelheid van de koeling.' },
          { text: 'Het stuurprogramma, de software bij een onderdeel.', correct: true, explanation: 'Een stuurprogramma stuurt één hardware-onderdeel aan; bij een update wordt die software bijgewerkt: fouten eruit, functies erbij.' }
        ],
        feedback: 'Een update verandert software, niet je onderdelen. Het stuurprogramma dat bij een onderdeel hoort wordt bijgewerkt.'
      },
      {
        prompt: 'Leg uit waarom verouderde software en een download van een onbekende site allebei een risico zijn, en wat jij daar zelf tegen doet.',
        type: 'open',
        leerdoel: 'Je weet waarom je je device regelmatig moet updaten.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Verouderde software heeft fouten die nog niet gerepareerd zijn, en virussen maken juist van die fouten gebruik. Een download van een onbekende site kan zelf schadelijke software meesturen, en daar ben ik volgens de regels zelf verantwoordelijk voor. Ik zet updates aan of voer ze meteen uit, en ik download alleen van sites die ik vertrouw. Kom ik er niet uit, dan ga ik naar mijn mentor of naar de ICT-afdeling.',
        nakijkpunten: [
          'Legt uit dat een update fouten repareert waar virussen anders doorheen komen.',
          'Noemt dat een onbekende downloadsite zelf schadelijke software kan meesturen.',
          'Noemt minstens één ding dat de leerling zelf doet, bijvoorbeeld updaten of hulp vragen.'
        ],
        feedback: 'Allebei zijn het openstaande deuren: een oud gat in je software, en een download die je niet kunt vertrouwen.'
      },
      // --- Terugkeervragen: spreiding over 2.1 en hoofdstuk 1 ---
      {
        prompt: 'Waarop zitten alle onderdelen van een computer aangesloten, zodat ze kunnen samenwerken?',
        leerdoel: 'Je kunt uitleggen wat elk onderdeel doet.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        options: [
          { text: 'Op het moederbord.', correct: true, explanation: 'Het moederbord verbindt alle onderdelen en laat ze gegevens uitwisselen.' },
          { text: 'Op de processor.', correct: false, misconception: 'Denkt dat het onderdeel dat rekent ook het onderdeel is dat alles verbindt.' },
          { text: 'Op de videokaart.', correct: false, misconception: 'Kiest het onderdeel dat het meest zichtbaar werk levert.' },
          { text: 'Op het werkgeheugen.', correct: false, misconception: 'Verwart de plek waar gegevens tijdelijk staan met de plek waar alles op vastzit.' }
        ],
        feedback: 'Het moederbord is de plattegrond van je computer: alles zit erop en alles loopt erover.'
      },
      {
        // Open bronvraag uit les 2, gekoppeld aan het bijbehorende leerdoel van
        // hoofdstuk 1: ingelogd weglopen is je account weggeven.
        prompt: 'Kan het kwaad om je laptop onbeheerd achter te laten? Leg uit waarom wel of waarom niet.',
        type: 'open',
        leerdoel: 'Je weet waarom je je wachtwoord nooit aan iemand anders geeft.',
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ja, dat kan kwaad. Mijn laptop staat dan open en ingelogd, dus iedereen kan bij mijn bestanden, mijn mail en mijn account. Alles wat er daarna gebeurt, staat op mijn naam, net zoals wanneer ik mijn wachtwoord zou weggeven. Daarom is de eerste gebruiksregel dat je je computer nooit onbeheerd achterlaat. Loop ik toch even weg, dan vergrendel ik mijn scherm of ik log uit.',
        nakijkpunten: [
          'Zegt duidelijk dat het wél kwaad kan en noemt dat de laptop ingelogd openstaat.',
          'Legt uit dat wat een ander dan doet op jouw naam komt te staan.',
          'Noemt een concrete oplossing, bijvoorbeeld het scherm vergrendelen of uitloggen.'
        ],
        feedback: 'Een open, ingelogde laptop is hetzelfde als je wachtwoord uitdelen. Vergrendelen kost twee toetsen en lost het op.'
      }
    ]
  },

  '2.3': {
    learningGoals: [
      'Je kunt met Windows Verkenner mappen maken, bestanden verplaatsen en terugvinden.',
      'Je weet wat de cloud is en waarom OneDrive handig is.',
      'Je kunt de sneltoetsen Ctrl+C, Ctrl+V en Ctrl+Z gebruiken.'
    ],
    theorie: [
      {
        keyTerms: ['Verkenner', 'map', 'Knippen', 'Kopiëren'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je opdracht staat in Downloads onder de naam document(3). Over twee weken moet je hem terugvinden. Welke drie handelingen doe je nu?</p>',
          '<p><strong>Antwoord.</strong> Eén: maak met de knop Nieuw een map met een duidelijke naam, bijvoorbeeld Hoofdstuk 2. Twee: geef het bestand met Naam wijzigen een naam waaraan je later ziet wat het is, bijvoorbeeld h2-onderdelenkaart-sam-1c. Drie: selecteer het bestand, klik op Knippen en klik in de nieuwe map op Plakken. Nu staat er precies één versie, op een plek die je terugvindt.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['cloud', 'OneDrive', 'sneltoetsen'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fatima wil thuis verder met haar poster, maar het bestand staat op het bureaublad van een computer in het lokaal. Wat kan zij nu nog doen, en wat had zij beter kunnen doen?</p>',
          '<p><strong>Antwoord.</strong> Nu moet ze terug naar diezelfde computer, want een bestand op het bureaublad staat op dat ene apparaat. Beter was geweest: het bestand meteen in haar map in OneDrive zetten. Dan staat het in de cloud, bij haar account, en opent ze thuis en op school hetzelfde bestand.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Met Windows Verkenner maak je mappen, verplaats je bestanden met Knippen en Plakken en vind je alles terug. Sla je je werk op in OneDrive, dan staat het in de cloud bij jouw account. Daardoor open je thuis en op school precies hetzelfde bestand, ook op een andere computer. De sneltoetsen Ctrl+C, Ctrl+V en Ctrl+Z schelen je elke les tijd, omdat twee toetsen klikken vervangen.</p>',
      keyTerms: ['Verkenner', 'Plakken', 'Ctrl+Z']
    },
    vragen: [
      {
        prompt: 'Waarvoor gebruik je Windows Verkenner?',
        leerdoel: 'Je kunt met Windows Verkenner mappen maken, bestanden verplaatsen en terugvinden.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Om spelletjes op te starten en te spelen.', correct: false, misconception: 'Denkt dat elk pictogram in de taakbalk een spel of een app is.' },
          { text: 'Om bestanden en mappen te ordenen.', correct: true, explanation: 'Verkenner is het programma waarin je je bestanden opent, ordent en terugvindt.' },
          { text: 'Om websites te openen en te bekijken.', correct: false, misconception: 'Verwart Verkenner met een browser, omdat je in allebei kunt zoeken.' },
          { text: 'Om e-mails te schrijven en te versturen.', correct: false, misconception: 'Verwart Verkenner met Outlook.' }
        ],
        feedback: 'Verkenner is je archiefkast: mappen maken, bestanden verplaatsen en terugvinden hoort daar allemaal bij.'
      },
      {
        prompt: 'Waar vind je bestanden terug die je van internet hebt gedownload?',
        leerdoel: 'Je kunt met Windows Verkenner mappen maken, bestanden verplaatsen en terugvinden.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        options: [
          { text: 'In de map Documenten.', correct: false, misconception: 'Denkt dat alles wat je binnenhaalt bij je eigen documenten belandt.' },
          { text: 'Op het bureaublad.', correct: false, misconception: 'Denkt dat een nieuw bestand altijd zichtbaar op het beginscherm verschijnt.' },
          { text: 'In de map Muziek.', correct: false, misconception: 'Kiest een mediamap zonder te kijken waar het bestand vandaan komt.' },
          { text: 'In de map Downloads.', correct: true, explanation: 'Alles wat je van internet haalt komt standaard in Downloads terecht.' }
        ],
        feedback: 'Downloads is de standaardplek voor alles wat van internet komt. Verplaats het daarna naar je eigen vakmap.'
      },
      {
        prompt: 'Je wilt een bestand van je bureaublad naar de map Hoofdstuk 2 verplaatsen, zonder dat er twee versies ontstaan. Welke knoppen gebruik je?',
        leerdoel: 'Je kunt met Windows Verkenner mappen maken, bestanden verplaatsen en terugvinden.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Eerst Knippen en daarna Plakken.', correct: true, explanation: 'Knippen haalt het bestand van de oude plek weg, dus er blijft precies één versie over.' },
          { text: 'Eerst Kopiëren en daarna Plakken.', correct: false, misconception: 'Denkt dat kopiëren ook verplaatst, waardoor er ongemerkt twee bestanden ontstaan.' },
          { text: 'Eerst Naam wijzigen en daarna Delen.', correct: false, misconception: 'Verwart het aanpassen van een naam met het verplaatsen van een bestand.' },
          { text: 'Eerst Verwijderen en daarna opnieuw downloaden.', correct: false, misconception: 'Kiest een omweg die het originele bestand eerst weggooit.' }
        ],
        feedback: 'Knippen haalt weg, Kopiëren laat staan. Wil je één versie houden, dan is Knippen plus Plakken de goede route.'
      },
      {
        prompt: 'Je hebt je onderdelenkaart uit paragraaf 2.1 op het bureaublad van een schoollaptop opgeslagen. Waarom is dat een slecht plan?',
        leerdoel: 'Je weet wat de cloud is en waarom OneDrive handig is.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        options: [
          { text: "Omdat het bureaublad alleen afbeeldingen en video's bewaart.", correct: false, misconception: 'Denkt dat het bureaublad een speciale map voor media is.' },
          { text: 'Omdat een bestand op het bureaublad na een week gewist wordt.', correct: false, misconception: 'Denkt dat bestanden op het bureaublad een houdbaarheidsdatum hebben.' },
          { text: 'Omdat het bestand dan in de opslag van dat ene apparaat staat.', correct: true, explanation: 'Wat op het apparaat staat blijft op het apparaat; alleen OneDrive staat in de cloud en reist met je account mee.' },
          { text: 'Omdat je een bestand op het bureaublad niet kunt hernoemen.', correct: false, misconception: 'Denkt dat de knoppen van Verkenner niet gelden voor het bureaublad.' }
        ],
        feedback: 'Het bureaublad hoort bij één laptop. Zet je hetzelfde bestand in OneDrive, dan open je het op elke schoolcomputer.'
      },
      {
        prompt: 'Je hebt net een stuk tekst op de verkeerde plek geplakt. Beschrijf welke sneltoetsen je in welke volgorde gebruikt om dat op te lossen.',
        type: 'open',
        leerdoel: 'Je kunt de sneltoetsen Ctrl+C, Ctrl+V en Ctrl+Z gebruiken.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Eerst maak ik het plakken ongedaan met Ctrl+Z, want dan staat de tekst weer weg op de verkeerde plek. Daarna zet ik mijn cursor op de goede plek en plak ik opnieuw met Ctrl+V. Had ik de tekst nog niet gekopieerd, dan selecteer ik hem eerst en gebruik ik Ctrl+C.',
        nakijkpunten: [
          'Noemt Ctrl+Z als eerste stap om het plakken ongedaan te maken.',
          'Noemt Ctrl+V om op de juiste plek opnieuw te plakken, in de goede volgorde.',
          'Legt per sneltoets in het kort uit wat die doet.'
        ],
        feedback: 'Ctrl+Z is je terugknop: eerst terugdraaien, daarna pas opnieuw plakken. Dat scheelt je een hoop overtypen.'
      },
      // --- DEELTOETS over 2.1, 2.2 en 2.3 ---
      // Dit is geen gewone afsluitquiz met twee terugkeervragen: vanaf hier
      // meet dit blok de drie paragrafen samen. De zes vragen hieronder dekken
      // de zes leerdoelen van 2.1 en 2.2, zodat alle negen leerdoelen van
      // 2.1 t/m 2.3 in dit blok aan bod komen. De praktijkopdracht van 2.3
      // kondigt de deeltoets aan; de eerste startvraag van 2.4 zet de uitslag
      // om in een spoor.
      {
        prompt: 'Welk onderdeel bewaart wat jij opslaat, ook nadat het apparaat uit is gegaan?',
        leerdoel: 'Je kunt de belangrijkste onderdelen van een computer benoemen: processor, werkgeheugen, geluidskaart, videokaart, opslag, koeling en moederbord.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        options: [
          { text: 'Het werkgeheugen.', correct: false, misconception: 'Denkt dat het geheugen waarin je nu werkt ook het geheugen is dat bewaart.' },
          { text: 'De geluidskaart.', correct: false, misconception: 'Kiest een onderdeel met een heel andere taak omdat het woord kaart bekend klinkt.' },
          { text: 'Het opslaggeheugen.', correct: true, explanation: 'Het opslaggeheugen houdt bestanden vast, ook zonder stroom.' },
          { text: 'De ventilatorkoeling.', correct: false, misconception: 'Verbindt bewaren met koel houden.' }
        ],
        feedback: 'Bewaren is het werk van de opslag. Het werkgeheugen is juist leeg zodra de stroom eraf gaat.'
      },
      {
        // De stam vraagt sinds ronde 6 naar de OPLOSKANT en niet meer naar de
        // oorzaakkant. In ronde 5 stond er "is dat een probleem met hardware of
        // met software", en daar was "software, want een zwaar programma maakt
        // het heet" verdedigbaar: het programma zet de warmte inderdaad in gang.
        // Wie goed redeneerde kon dus fout scoren. Warmte er weer uit krijgen is
        // wél eenduidig hardware, want dat is precies de taak van de koeling.
        prompt: 'Je laptop wordt heet en remt zichzelf daardoor af. Waar moet je aan sleutelen om die warmte er weer uit te krijgen?',
        leerdoel: 'Je kunt het verschil uitleggen tussen hardware en software.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        options: [
          { text: 'Aan de software, want een programma kan warmte wegwerken.', correct: false, misconception: 'Denkt dat een programma warmte kan afvoeren, terwijl software niets kan verplaatsen.' },
          { text: 'Aan de hardware, want de koeling voert de warmte af.', correct: true, explanation: 'Warmte afvoeren is het werk van ventilatoren en luchtroosters, en die kun je vasthouden: dat is hardware.' },
          { text: 'Aan geen van beide, want warm worden hoort er nu eenmaal bij.', correct: false, misconception: 'Denkt dat een heet apparaat nooit op een probleem wijst.' },
          { text: 'Aan allebei tegelijk, want hardware en software zijn hetzelfde.', correct: false, misconception: 'Ziet het onderscheid tussen tastbare onderdelen en programma\'s niet.' }
        ],
        feedback: 'Een zwaar programma kan de warmte veroorzaken, maar wegkrijgen doet alleen de koeling. Dat is hardware.'
      },
      {
        // Ook deze stam is in ronde 6 aangescherpt. Er stond "welk onderdeel is
        // dan hard aan het werk"; het gerekende antwoord was de koeling, maar de
        // onderdelen die daar écht hard werken zijn de processor en de
        // videokaart, en die stonden niet tussen de opties. De vraag gaat nu over
        // wat je HOORT, en dat is eenduidig de ventilator van de koeling.
        prompt: 'Je laptop maakt lawaai zodra je een zwaar spel start. Welk onderdeel hoor je op dat moment?',
        leerdoel: 'Je kunt uitleggen wat elk onderdeel doet.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'De geluidskaart, die het geluid van het spel verwerkt.', correct: false, misconception: 'Kiest het onderdeel dat geluid afspeelt in plaats van het onderdeel dat zelf lawaai maakt.' },
          { text: 'Het opslaggeheugen, dat jouw voortgang in het spel bewaart.', correct: false, misconception: 'Denkt dat bewaren hoorbaar werk is dat een apparaat laat brommen.' },
          { text: 'De koeling, waarvan de ventilatoren harder gaan draaien.', correct: true, explanation: 'De processor en de videokaart werken bij een zwaar spel hard en worden warm; wat je hoort zijn de ventilatoren die die warmte wegblazen.' },
          { text: 'Het moederbord, dat bij een zwaar spel gaat trillen.', correct: false, misconception: 'Denkt dat de verbindende plaat zelf beweegt en daardoor geluid maakt.' }
        ],
        feedback: 'Alleen de ventilatoren bewegen, dus alleen die kun je horen. Hard rekenwerk laat ze sneller draaien.'
      },
      {
        prompt: 'Waarom past er in een vaste computer een grotere koeler dan in een laptop?',
        leerdoel: 'Je kunt het verschil uitleggen tussen een laptop en een vaste computer.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Omdat er in de kast van een vaste computer meer ruimte is.', correct: true, explanation: 'Meer ruimte betekent grotere onderdelen én een grotere koeler, en daardoor kan de warmte er beter uit.' },
          { text: 'Omdat een vaste computer minder warm wordt dan een laptop.', correct: false, misconception: 'Denkt dat een krachtiger apparaat juist minder warmte produceert.' },
          { text: 'Omdat een laptop zijn warmte via het scherm kwijt kan.', correct: false, misconception: 'Bedenkt een uitweg voor de warmte die niet bestaat.' },
          { text: 'Omdat een vaste computer geen batterij hoeft te koelen.', correct: false, misconception: 'Ziet de batterij als de enige bron van warmte in een apparaat.' }
        ],
        feedback: 'Ruimte is hier het hele verhaal: grotere onderdelen én een grotere koeler passen alleen in een kast die groot genoeg is.'
      },
      {
        prompt: 'Waaraan zie je op een schoollaptop dat er Windows op draait?',
        leerdoel: 'Je weet wat een besturingssysteem doet en welke jij op school gebruikt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        options: [
          { text: 'Aan de map Downloads, die alleen in Windows bestaat.', correct: false, misconception: 'Denkt dat een gewone map verraadt welk besturingssysteem eronder zit.' },
          { text: 'Aan het programma Word, dat alleen op Windows werkt.', correct: false, misconception: 'Denkt dat Office aan één besturingssysteem vastzit.' },
          { text: 'Aan de muis en het toetsenbord die eraan vastzitten.', correct: false, misconception: 'Kiest hardware terwijl de vraag over de software eronder gaat.' },
          { text: 'Aan de taakbalk onderin met het Windows-vlaggetje.', correct: true, explanation: 'Elk besturingssysteem heeft zijn eigen indeling; de vier blauwe vierkantjes links naast het zoekvak horen bij Windows.' }
        ],
        feedback: 'Op een MacBook of Chromebook staat de balk ergens anders en ontbreekt het vlaggetje. De indeling verraadt het systeem.'
      },
      {
        prompt: 'Je stelt de updates van je laptop drie maanden lang uit. Wat is daarvan het grootste risico?',
        leerdoel: 'Je weet waarom je je device regelmatig moet updaten.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        options: [
          { text: 'Je opslag raakt vol doordat de updates zich opstapelen.', correct: false, misconception: 'Denkt dat een uitgestelde update ruimte inneemt tot je hem installeert.' },
          { text: 'Bekende fouten in je software blijven al die tijd openstaan.', correct: true, explanation: 'Een update repareert fouten die al bekend zijn; sla je hem over, dan blijft precies dat gat open voor virussen.' },
          { text: 'Je device start elke ochtend een half uur langzamer op.', correct: false, misconception: 'Bedenkt een gevolg voor de snelheid in plaats van voor de veiligheid.' },
          { text: 'Je raakt de bestanden kwijt die je in die maanden maakte.', correct: false, misconception: 'Denkt dat het uitstellen van een update je opgeslagen werk aantast.' }
        ],
        feedback: 'Uitstellen laat een deur openstaan waarvan de buitenwereld al weet dat hij bestaat. Dat is het echte risico, niet de traagheid.'
      },
      {
        // Twaalfde en laatste vraag van de deeltoets. De praktijkopdracht van 2.3
        // kondigt "twaalf vragen" aan en de routering rekent met tien van twaalf;
        // dit item maakt die aankondiging waar. Het is bewust een open
        // verdiepingsvraag die 2.1 en 2.3 aan elkaar knoopt, want dat is precies
        // wat het jaarplan voor tl vraagt.
        prompt: 'Fatima zegt: mijn bestand staat op de opslag van deze laptop, dus het staat veilig. Leg uit waarom dat niet betekent dat zij er morgen op een andere schoolcomputer bij kan.',
        type: 'open',
        leerdoel: 'Je weet wat de cloud is en waarom OneDrive handig is.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Het opslaggeheugen is een onderdeel dat in dat ene apparaat zit, zoals ik in 2.1 geleerd heb. Wat daarop staat blijft dus in die laptop, ook al is het netjes bewaard en gaat er niets verloren. Morgen zit Fatima achter een andere computer, en die heeft zijn eigen opslaggeheugen waar haar bestand niet in staat. Zet zij haar bestand in OneDrive, dan staat het in de cloud op een server, en die hoort bij haar schoolaccount in plaats van bij een apparaat. Daardoor opent zij op elke computer hetzelfde bestand, zolang zij met dat account inlogt.',
        nakijkpunten: [
          'Legt uit dat het opslaggeheugen een onderdeel van dat ene apparaat is en dat het bestand daar dus achterblijft.',
          'Maakt onderscheid tussen veilig bewaard zijn en overal bij kunnen.',
          'Noemt OneDrive of de cloud als oplossing, met de reden dat die bij het account hoort en niet bij het apparaat.'
        ],
        feedback: 'Bewaard is niet hetzelfde als bereikbaar. Opslag hoort bij een apparaat, de cloud hoort bij jouw account.'
      }
    ]
  },

  '2.4': {
    learningGoals: [
      'Je kunt uitleggen wat een netwerk en een server zijn.',
      'Je kunt in stappen vertellen wat er gebeurt als je een website opvraagt.',
      'Je weet wat data is en op welke plekken jouw data bewaard wordt.'
    ],
    theorie: [
      {
        keyTerms: ['netwerk', 'server', 'router'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> De wifi op school werkt, want je kunt gewoon YouTube openen. Toch komt de website van je school niet in beeld. Waar zit het probleem dan?</p>',
          '<p><strong>Antwoord.</strong> Niet in het netwerk, want andere sites komen wel binnen; jouw verbinding met het internet doet het dus. Het probleem zit bij de server waarop de schoolwebsite staat: die is uit, overbelast of aan het werk. Zo zie je meteen het verschil tussen de weg (het netwerk en de router) en de bestemming (de server).</p>'
        ].join('\n')
      },
      {
        keyTerms: ['IP-adres', 'informatiepakketjes', 'browser'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een webpagina komt half in beeld: de tekst staat er, maar de foto\'s blijven leeg. Wat zegt dat over de manier waarop een pagina reist?</p>',
          '<p><strong>Antwoord.</strong> Dat een pagina niet in één stuk aankomt. De tekst zit in andere pakketjes dan de foto\'s, en die pakketjes komen los van elkaar binnen. De tekstpakketjes waren er al, de beeldpakketjes nog niet, en de browser tekent alvast wat hij binnen heeft. Zijn de laatste pakketjes binnen, dan is de pagina compleet.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een netwerk is een groep apparaten die met elkaar verbonden zijn om gegevens uit te wisselen. Het internet is het grootste netwerk ter wereld, en een server is een computer die diensten levert. Vraag je een website op, dan zoekt je device eerst het bijbehorende nummer van die server op. Je vraag gaat via de router naar die server, en de pagina komt terug in kleine informatiepakketjes. Alles wat daarbij heen en weer gaat is data, en die data blijft op meerdere plekken staan. Jouw data staat op je eigen device, in de cloud en op de servers van bedrijven.</p>',
      keyTerms: ['netwerk', 'router', 'informatiepakketjes']
    },
    vragen: [
      {
        prompt: 'Wat is een netwerk?',
        leerdoel: 'Je kunt uitleggen wat een netwerk en een server zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Apparaten die verbonden zijn om gegevens uit te wisselen.', correct: true, explanation: 'Zodra twee of meer apparaten verbonden zijn en gegevens delen, is er sprake van een netwerk.' },
          { text: 'Het programma waarmee je websites zoekt, opent en bekijkt.', correct: false, misconception: 'Verwart het netwerk met de browser die je ervoor gebruikt.' },
          { text: 'De kabel die bij jou thuis uit de muur naar binnen komt.', correct: false, misconception: 'Ziet één onderdeel aan voor het geheel.' },
          { text: 'Alle bestanden die je in de cloud bewaart en deelt.', correct: false, misconception: 'Verwart de plek waar data staat met de verbinding ertussen.' }
        ],
        feedback: 'Een netwerk zit hem in de verbinding, niet in één kabel of één programma. Het internet is het grootste netwerk dat er is.'
      },
      {
        prompt: 'Je typt een webadres in en drukt op enter. Wat gebeurt er als eerste?',
        leerdoel: 'Je kunt in stappen vertellen wat er gebeurt als je een website opvraagt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'De server stuurt de pagina meteen in pakketjes terug.', correct: false, misconception: 'Slaat de stap over waarin het adres eerst opgezocht moet worden.' },
          { text: 'Je browser tekent de pagina alvast op je scherm.', correct: false, misconception: 'Denkt dat het beeld er kan zijn voordat de gegevens binnen zijn.' },
          { text: 'Je device zoekt op welk IP-adres bij die naam hoort.', correct: true, explanation: 'Computers werken met nummers, dus de naam moet eerst omgezet worden naar een IP-adres.' },
          { text: 'De router bewaart de pagina alvast voor de hele klas.', correct: false, misconception: 'Denkt dat de router zelf websites opslaat.' }
        ],
        feedback: 'Eerst het adres omzetten naar een nummer, dan pas op reis. Zonder IP-adres weet je vraag niet waarheen.'
      },
      {
        prompt: 'Een server is een computer die dag en nacht aan staat en bestanden of diensten levert aan andere computers.',
        waar: true,
        leerdoel: 'Je kunt uitleggen wat een netwerk en een server zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        feedback: 'Precies: een server heeft een dienstverlenende rol. Jouw laptop is in dat gesprek juist degene die iets vraagt.'
      },
      {
        prompt: 'Op welke plekken staat data van jou, ook als je daar zelf niets voor doet?',
        leerdoel: 'Je weet wat data is en op welke plekken jouw data bewaard wordt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Alleen op mijn eigen telefoon en op mijn eigen laptop.', correct: false, misconception: 'Denkt dat data alleen bestaat op het apparaat dat je vasthoudt.' },
          { text: 'Op mijn device, in de cloud en op de servers van diensten.', correct: true, explanation: 'Je data staat verspreid: lokaal, in de cloud en bij elke dienst waar je een account hebt.' },
          { text: 'Alleen in de cloud, want daar gaat tegenwoordig alles heen.', correct: false, misconception: 'Denkt dat de cloud alle andere bewaarplekken vervangen heeft.' },
          { text: 'Nergens, zolang ik zelf niets deel of online zet.', correct: false, misconception: 'Denkt dat data pas ontstaat op het moment dat je bewust iets deelt.' }
        ],
        feedback: 'Je laat overal sporen na: op je apparaat, in de cloud en in de logboeken van je provider en je school.'
      },
      {
        prompt: 'Beschrijf in vier stappen wat er gebeurt tussen jouw enter-toets en de webpagina op je scherm, en leg uit waarom die pagina in pakketjes komt.',
        type: 'open',
        leerdoel: 'Je kunt in stappen vertellen wat er gebeurt als je een website opvraagt.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Stap 1: ik typ het adres en druk op enter. Stap 2: mijn device zoekt op welk IP-adres bij die naam hoort. Stap 3: mijn vraag gaat via de router en de kabels naar de server waarop de site staat. Stap 4: de server stuurt de pagina terug in kleine informatiepakketjes, en mijn browser zet die weer in de goede volgorde. In pakketjes gaat het sneller en betrouwbaarder, omdat kleine stukjes langs verschillende routes kunnen reizen en een verloren pakketje maar één keer opnieuw hoeft.',
        nakijkpunten: [
          'Noemt de vier stappen in de goede volgorde, met het opzoeken van het IP-adres vóór het versturen.',
          'Noemt de server als de plek waar de pagina vandaan komt.',
          'Legt uit dat de pagina opgeknipt wordt en door de browser weer in elkaar wordt gezet.'
        ],
        feedback: 'Adres opzoeken, versturen, terugkrijgen en weer in elkaar zetten: die vier stappen passen in minder dan een seconde.'
      },
      // --- Terugkeervragen: spreiding over 2.2 en 2.3 ---
      {
        // RONDE 8. Tot ronde 7 stond hier "In welk programma uit Microsoft Office zet je
        // getallen in een spreadsheet?" onder het leerdoel hardware tegenover software.
        // Dat item mat Office-programmakennis en niet het onderscheid tastbaar/niet-tastbaar,
        // dus het label beloofde een meting die er niet was. De Office-stof uit de bron
        // (Word documenten, Excel spreadsheets, PowerPoint presentaties) staat gewoon in
        // 2.2 theorie B, in de oefenopgave van 2.2 en in de samenvatting; die verdwijnt dus
        // niet. Het item hieronder gebruikt Excel nog steeds als materiaal, maar vraagt naar
        // het onderscheid zelf, en meet daarmee wél waar het aan hangt.
        prompt: 'Je zet getallen in een spreadsheet in Excel. Waarom noemen we Excel software en geen hardware?',
        leerdoel: 'Je kunt het verschil uitleggen tussen hardware en software.',
        denkniveau: 'toepassen',
        niveau: 'kern',
        options: [
          { text: 'Omdat Excel alleen op internet werkt en niets op je eigen laptop opslaat.', correct: false, misconception: 'Denkt dat een programma pas software heet als het online draait.' },
          { text: 'Omdat Excel pas hardware wordt op het moment dat je het bestand opslaat op de harde schijf.', correct: false, misconception: 'Verwart het opgeslagen bestand op een tastbare schijf met het programma zelf.' },
          { text: 'Omdat Excel een programma is dat je opent; vastpakken kun je alleen de laptop waarop het draait.', correct: true, explanation: 'Software is de verzameling programma\'s: Excel voor spreadsheets, Word voor documenten, PowerPoint voor presentaties.' },
          { text: 'Omdat Excel met getallen werkt, en alles wat met getallen werkt heet software.', correct: false, misconception: 'Zoekt het verschil in wat het programma doet in plaats van in tastbaar of niet-tastbaar.' }
        ],
        feedback: 'Stel jezelf één vraag: kan ik dit vastpakken? De laptop wel, het programma erop niet, en dus is Excel software.'
      },
      {
        prompt: 'Wat betekent het dat OneDrive een cloud is?',
        leerdoel: 'Je weet wat de cloud is en waarom OneDrive handig is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Dat je bestanden op internet staan, bij jouw account.', correct: true, explanation: 'De cloud is opslag op computers van een bedrijf, bereikbaar via internet; die opslag hoort bij jouw account en niet bij één apparaat.' },
          { text: 'Dat je bestanden op de schijf van de schoollaptop staan.', correct: false, misconception: 'Denkt dat de cloud gewoon een andere naam is voor de opslag in het apparaat.' },
          { text: 'Dat je bestanden alleen bestaan zolang je online bent.', correct: false, misconception: 'Denkt dat gegevens in de cloud verdwijnen zodra de verbinding wegvalt.' },
          { text: 'Dat je bestanden automatisch met je klas gedeeld worden.', correct: false, misconception: 'Verwart opslaan in de cloud met delen met anderen.' }
        ],
        feedback: 'De cloud is opslag op internet die bij jou hoort. Daarom reist je werk mee naar elke computer waarop je inlogt.'
      }
    ]
  },

  '2.5': {
    learningGoals: [
      'Je kunt hardware en software uit elkaar houden en uitleggen wat ze doen.',
      'Je kunt je bestanden zo opslaan dat je ze op elke computer terugvindt.'
    ],
    theorie: [
      {
        keyTerms: ['onderdeel', 'ventilator', 'bureaublad'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> De printer in het lokaal doet niets. Hoe bepaal je of dit een hardware- of een softwareprobleem is?</p>',
          '<p><strong>Antwoord.</strong> Kijk eerst naar wat je kunt vasthouden: staat de printer aan, zit de kabel erin, zit er papier in? Dat is de hardwarekant. Doet de printer het wel bij anderen maar niet bij jou, dan zit het waarschijnlijk in de software. Denk dan aan het stuurprogramma of aan een instelling die op jouw device anders staat. Zo bepaal je met twee vragen welke kant je op moet.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['bestandsnamen', 'controlemoment', 'steunspoor'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een klasgenoot levert een map in met vier bestanden die allemaal document heten. Waarom is dat een probleem, ook al zit alles erin?</p>',
          '<p><strong>Antwoord.</strong> Omdat niemand kan zien wat wat is, ook de leerling zelf niet. Bewijs moet leesbaar zijn zonder dat er iemand bij hoeft te vertellen. Met namen als h2-onderdelenkaart en h2-mappenstructuur ziet je docent meteen welke stap is afgerond. Wat er nog ontbreekt valt dan net zo snel op, want die naam staat er simpelweg niet bij.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Je device is een stapel losse onderdelen die alleen samen doen wat jij ervan verwacht. Jij kunt nu per onderdeel zeggen wat het doet en wat je merkt als het hapert. Hardware kun je vasthouden en software niet, en dat verschil bepaalt hoe je een probleem oplost. Aan hardware moet je sleutelen of vervangen, terwijl je software met een update of scanner aanpakt. Zet je werk in OneDrive en niet in de opslag van één computer, want daar blijft het achter. Dan is jouw bewijs op elke schoolcomputer terug te vinden, zolang je met je account inlogt.</p>',
      keyTerms: ['opslag', 'schoolcomputer']
    },
    // Hoofdstuktoets. 28 vragen, alle veertien leerdoelen van 2.1 tot en met 2.5
    // elk precies twee keer. De vrijwillige plusparagraaf 2.6 blijft er buiten.
    vragen: [
      // --- 2.1 leerdoel 1: onderdelen benoemen (2x) ---
      {
        prompt: 'Welk rijtje bestaat alleen uit onderdelen die je in een computer aantreft?',
        leerdoel: 'Je kunt de belangrijkste onderdelen van een computer benoemen: processor, werkgeheugen, geluidskaart, videokaart, opslag, koeling en moederbord.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Word, Excel en PowerPoint.', correct: false, misconception: 'Noemt de Office-programma\'s en denkt dat die als onderdeel in de computer zitten.' },
          { text: 'Windows, OneDrive en een stuurprogramma.', correct: false, misconception: 'Denkt dat een stuurprogramma hardware is, omdat het bij een onderdeel hoort.' },
          { text: 'Processor, videokaart en moederbord.', correct: true, explanation: 'Dit zijn alle drie onderdelen die je kunt vasthouden.' },
          { text: 'Een browser, een sneltoets en een bestand.', correct: false, misconception: 'Ziet alles wat op het scherm gebeurt als iets tastbaars.' }
        ],
        feedback: 'Hardware kun je vasthouden. Programma\'s en bestanden niet, hoe echt ze op je scherm ook lijken.'
      },
      {
        prompt: 'Welk onderdeel houdt tijdelijk vast waar de processor op dit moment mee bezig is?',
        leerdoel: 'Je kunt de belangrijkste onderdelen van een computer benoemen: processor, werkgeheugen, geluidskaart, videokaart, opslag, koeling en moederbord.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        options: [
          { text: 'Het werkgeheugen.', correct: true, explanation: 'Werkgeheugen, of RAM, houdt kortstondig vast wat er nu nodig is.' },
          { text: 'Het opslaggeheugen.', correct: false, misconception: 'Verwart de langdurige bewaarplek met het snelle, tijdelijke geheugen.' },
          { text: 'De videokaart.', correct: false, misconception: 'Denkt dat het onderdeel dat beeld maakt ook de gegevens vasthoudt.' },
          { text: 'Het moederbord.', correct: false, misconception: 'Verwart de verbindende plaat met een geheugen.' }
        ],
        feedback: 'Het werkgeheugen is de werkbank van de processor: snel, dichtbij en alleen voor wat er nu ligt.'
      },
      // --- 2.1 leerdoel 2: wat elk onderdeel doet (2x) ---
      {
        prompt: 'Wat doet de processor in een computer?',
        leerdoel: 'Je kunt uitleggen wat elk onderdeel doet.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Hij bewaart alles wat je opslaat, ook als het apparaat uit gaat.', correct: false, misconception: 'Verwart de processor met het opslaggeheugen.' },
          { text: 'Hij voert de taken uit, zodat alles snel en efficiënt gebeurt.', correct: true, explanation: 'De processor is het rekenhart: hij verwerkt de opdrachten die binnenkomen.' },
          { text: 'Hij verbindt alle onderdelen met elkaar.', correct: false, misconception: 'Verwart de processor met het moederbord.' },
          { text: 'Hij voert de warmte af, zodat niets oververhit raakt.', correct: false, misconception: 'Verwart de processor met de koeling.' }
        ],
        feedback: 'De processor rekent en verwerkt. Bewaren doet de opslag en verbinden doet het moederbord.'
      },
      {
        prompt: 'Het moederbord verbindt alle onderdelen, zodat ze samen kunnen werken en gegevens kunnen uitwisselen.',
        waar: true,
        leerdoel: 'Je kunt uitleggen wat elk onderdeel doet.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        feedback: 'Klopt. Zonder moederbord liggen er losse onderdelen die niets van elkaar weten.'
      },
      // --- 2.1 leerdoel 3: laptop tegenover vaste computer (2x) ---
      {
        prompt: 'Waarom is een laptop bij hetzelfde geld vaak minder krachtig dan een vaste computer?',
        leerdoel: 'Je kunt het verschil uitleggen tussen een laptop en een vaste computer.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Omdat een laptop op een batterij werkt en die stroom zwakker is.', correct: false, misconception: 'Denkt dat de stroombron de rekenkracht bepaalt.' },
          { text: 'Omdat er in een laptop geen processor past, alleen een chip.', correct: false, misconception: 'Denkt dat een laptop een heel ander soort onderdelen heeft in plaats van kleinere.' },
          { text: 'Omdat het besturingssysteem er minder programma\'s toelaat.', correct: false, misconception: 'Zoekt de verklaring in software terwijl het om ruimte en warmte gaat.' },
          { text: 'Omdat er in een laptop minder ruimte is voor grote onderdelen.', correct: true, explanation: 'Ruimte bepaalt hoe groot de onderdelen mogen zijn en hoe goed ze hun warmte kwijt kunnen.' }
        ],
        feedback: 'Ruimte en warmte zijn hier de sleutel. Grotere onderdelen kunnen meer, mits ze hun warmte kwijt kunnen.'
      },
      {
        prompt: 'Je laptop hangt dag en nacht aan de oplader. Waarom is dat geen goed idee?',
        leerdoel: 'Je kunt het verschil uitleggen tussen een laptop en een vaste computer.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'De accu kan oververhit raken en dat geeft brandgevaar.', correct: true, explanation: 'Een accu die constant wordt bijgeladen wordt warm, en in het ergste geval vliegt hij in de brand.' },
          { text: 'De oplader wist je bestanden zodra de accu helemaal vol is.', correct: false, misconception: 'Verbindt stroom met het bewaren van gegevens.' },
          { text: 'Je videokaart schakelt zichzelf uit bij een volle accu.', correct: false, misconception: 'Bedenkt een gevolg voor een onderdeel dat hier niets mee te maken heeft.' },
          { text: 'Het besturingssysteem installeert dan geen updates meer.', correct: false, misconception: 'Verwart een hardwarerisico met een instelling in de software.' }
        ],
        feedback: 'Een vaste computer heeft geen accu en dit probleem dus niet. Bij een laptop is warmte in de accu het risico.'
      },
      // --- 2.2 leerdoel 1: hardware tegenover software (2x) ---
      {
        prompt: 'Een virus vertraagt je laptop. Is dat een probleem met hardware of met software?',
        leerdoel: 'Je kunt het verschil uitleggen tussen hardware en software.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'Software, want een virus is zelf een programma.', correct: true, explanation: 'Een virus is geschreven code en dus software; je bestrijdt het met software.' },
          { text: 'Hardware, want het virus zit fysiek in je computer.', correct: false, misconception: 'Denkt dat iets binnenin het apparaat daarmee ook een onderdeel is.' },
          { text: 'Hardware, want je laptop wordt er langzaam van.', correct: false, misconception: 'Leidt uit het gevolg af in welke categorie de oorzaak valt.' },
          { text: 'Geen van beide; een virus staat los van je device.', correct: false, misconception: 'Denkt dat een virus alleen op internet bestaat en niet op het apparaat zelf.' }
        ],
        feedback: 'Een virus is code. Daarom help je er geen schroevendraaier tegen, maar een update en een virusscanner.'
      },
      {
        prompt: 'Leg met een voorbeeld van je eigen device uit wat het verschil is tussen hardware en software, en waarom dat verschil uitmaakt bij een probleem.',
        type: 'open',
        leerdoel: 'Je kunt het verschil uitleggen tussen hardware en software.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Hardware zijn de onderdelen die je kunt vasthouden, zoals de processor, het toetsenbord en de koeling van mijn laptop. Software zijn de programma\'s, zoals Windows, Word en ook een virus. Dat verschil maakt uit bij een probleem: is het scherm stuk, dan moet er iemand aan het apparaat sleutelen of het vervangen. Loopt een programma vast, dan help ik het meestal met opnieuw starten of met een update.',
        nakijkpunten: [
          'Geeft minstens één eigen voorbeeld van hardware en één van software.',
          'Noemt dat hardware tastbaar is en software niet.',
          'Legt uit dat de oplossing verschilt: repareren of vervangen tegenover opnieuw starten of bijwerken.'
        ],
        feedback: 'Een goed antwoord noemt niet alleen twee voorbeelden, maar ook wat het verschil betekent voor de oplossing.'
      },
      // --- 2.2 leerdoel 2: besturingssysteem (2x) ---
      {
        // Bronvraag uit de opdrachtenset bij les 2, letterlijk overgenomen.
        // De opties zijn productnamen en dus niet gelijk te maken in lengte;
        // daarom is er een langere afleider bij gezet, zodat de langste knop
        // hier niet het goede antwoord is.
        // RONDE 8. Hier stond "Welk Office-programma gebruik je voor het maken van
        // presentaties?" onder het leerdoel hardware tegenover software. Dat is Office-
        // programmakennis en geen meting van tastbaar tegenover niet-tastbaar, dus de
        // toetsmatrijs toonde voor dat doel drie metingen terwijl er twee echt waren.
        // Het item gebruikt PowerPoint nu als materiaal voor de indeling zelf. Daarmee
        // zijn het er wél drie: de virusvraag (hierboven), deze en de open vraag. Dat is
        // bewust en het staat zo in de kop, in 2.5 theorie B en in de toetsmatrijs.
        prompt: 'Je maakt een presentatie in PowerPoint. Hoort PowerPoint bij de hardware of bij de software van je laptop?',
        leerdoel: 'Je kunt het verschil uitleggen tussen hardware en software.',
        denkniveau: 'toepassen',
        niveau: 'kern',
        options: [
          { text: 'Bij de hardware, want het programma staat op de harde schijf en die kun je gewoon vastpakken.', correct: false, misconception: 'Verwart de tastbare schijf met het niet-tastbare programma dat erop staat.' },
          { text: 'Bij de software: je opent het als programma en je kunt het niet vastpakken.', correct: true, explanation: 'PowerPoint is het presentatieprogramma van Office. Het scherm en het toetsenbord zijn wél hardware.' },
          { text: 'Bij de hardware, want je hebt er een scherm en een toetsenbord bij nodig.', correct: false, misconception: 'Denkt dat een programma hardware wordt zodra je er hardware bij gebruikt.' },
          { text: 'Bij geen van beide, want PowerPoint is het besturingssysteem van de laptop.', correct: false, misconception: 'Haalt een toepassingsprogramma en het besturingssysteem door elkaar.' }
        ],
        feedback: 'De schijf waarop een programma staat is hardware; het programma zelf blijft software, hoe vol die schijf ook is.'
      },
      {
        prompt: 'Op de schoollaptop staan Windows, Word, Excel en PowerPoint. Welke van deze vier is het besturingssysteem?',
        leerdoel: 'Je weet wat een besturingssysteem doet en welke jij op school gebruikt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Word, want dat programma start je bij bijna elke opdracht op.', correct: false, misconception: 'Verwart het programma dat je het vaakst gebruikt met het systeem dat alles aanstuurt.' },
          { text: 'Windows, want dat stuurt de laptop aan en laat de rest werken.', correct: true, explanation: 'Het besturingssysteem stuurt het hele apparaat aan; op de schoollaptop is dat Windows.' },
          { text: 'PowerPoint, want daarmee zet je alles op je scherm.', correct: false, misconception: 'Denkt dat het programma dat beeld vult ook het beeld aanstuurt.' },
          { text: 'Excel, want dat rekent alles voor de laptop uit.', correct: false, misconception: 'Verwart rekenen in een spreadsheet met het rekenwerk van processor en systeem.' }
        ],
        feedback: 'Windows is het besturingssysteem; Word, Excel en PowerPoint zijn programma\'s die er bovenop draaien.'
      },
      {
        prompt: 'Je klasgenoot wil diep in de systeeminstellingen van de schoollaptop dingen omzetten om te zien wat er gebeurt. Wat is het beste advies?',
        leerdoel: 'Je weet wat een besturingssysteem doet en welke jij op school gebruikt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'Gewoon doen; het systeem herstelt elke fout vanzelf.', correct: false, misconception: 'Denkt dat er altijd een automatische terugweg is na een verkeerde instelling.' },
          { text: 'Gewoon doen; instellingen kun je toch niet stukmaken.', correct: false, misconception: 'Ziet instellingen aan voor iets tastbaars in plaats van voor software.' },
          { text: 'Niet doen, want je kunt schade doen aan het device.', correct: true, explanation: 'Diepe instellingen sturen het besturingssysteem aan, en een verkeerde keuze kan het device onbruikbaar maken; vraag het na bij de ICT-afdeling.' },
          { text: 'Niet doen, want de laptop wordt daar erg warm van.', correct: false, misconception: 'Noemt wel de goede keuze maar met een reden die er niets mee te maken heeft.' }
        ],
        feedback: 'Het besturingssysteem is geen speelveld. Weet je niet wat een knop doet, dan is navragen de goedkoopste stap.'
      },
      // --- 2.2 leerdoel 3: updaten (2x) ---
      {
        prompt: 'Wat gebeurt er bij een update van je device?',
        leerdoel: 'Je weet waarom je je device regelmatig moet updaten.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Je opslag wordt leeggemaakt om weer ruimte te winnen.', correct: false, misconception: 'Denkt dat een update vooral bedoeld is om ruimte vrij te maken.' },
          { text: 'De onderdelen worden vervangen door nieuwere versies.', correct: false, misconception: 'Denkt dat updaten iets aan de hardware zelf verandert.' },
          { text: 'Er gaan fouten uit het systeem en er komen functies bij.', correct: true, explanation: 'Een update repareert bekende fouten en voegt nieuwe functies toe; daarom is oude software onveilig.' },
          { text: 'Je account wordt opnieuw ingesteld met een wachtwoord.', correct: false, misconception: 'Verwart een systeemupdate met het beheer van je account.' }
        ],
        feedback: 'Fouten eruit, functies erbij. Sla je een update over, dan blijft een bekend gat gewoon openstaan.'
      },
      {
        prompt: 'Je hoeft je laptop maar één keer per jaar bij te werken.',
        waar: false,
        leerdoel: 'Je weet waarom je je device regelmatig moet updaten.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        feedback: 'Nee: regelmatig bijwerken hoort erbij. Wacht je een jaar, dan staan alle gaten van dat jaar al die tijd open.'
      },
      // --- 2.3 leerdoel 1: Verkenner (2x) ---
      {
        prompt: 'Waarvoor gebruik je Windows Verkenner op school?',
        leerdoel: 'Je kunt met Windows Verkenner mappen maken, bestanden verplaatsen en terugvinden.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        options: [
          { text: 'Om je mail te lezen, te schrijven en te versturen.', correct: false, misconception: 'Verwart Verkenner met Outlook.' },
          { text: 'Om mappen te maken en bestanden terug te vinden.', correct: true, explanation: 'Verkenner is het programma waarmee je je bestanden beheert: aanmaken, ordenen, hernoemen en terugvinden.' },
          { text: 'Om internet op te gaan en websites te openen.', correct: false, misconception: 'Verwart Verkenner met een browser, omdat je in allebei kunt zoeken.' },
          { text: 'Om je device bij te werken met de nieuwste updates.', correct: false, misconception: 'Verwart bestandsbeheer met het onderdeel Windows Update.' }
        ],
        feedback: 'Verkenner gaat over je bestanden: aanmaken, ordenen, hernoemen en terugvinden. Meer doet hij niet, en dat is genoeg.'
      },
      {
        prompt: 'Wat is het verschil tussen Knippen en Kopiëren in Verkenner?',
        leerdoel: 'Je kunt met Windows Verkenner mappen maken, bestanden verplaatsen en terugvinden.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Bij Knippen gaat het bestand weg, bij Kopiëren blijft het staan.', correct: true, explanation: 'Knippen verplaatst het bestand van de oude plek en Kopiëren maakt er een tweede versie bij.' },
          { text: 'Bij Knippen wordt het bestand kleiner, bij Kopiëren niet.', correct: false, misconception: 'Denkt dat knippen iets uit het bestand zelf weghaalt.' },
          { text: 'Bij Knippen gaat het naar de prullenbak, bij Kopiëren naar Downloads.', correct: false, misconception: 'Verwart knippen met verwijderen.' },
          { text: 'Er is geen verschil; het zijn twee namen voor dezelfde knop.', correct: false, misconception: 'Ziet twee knoppen met een verwante functie aan voor één knop.' }
        ],
        feedback: 'Knippen verplaatst en Kopiëren verdubbelt. Wie dat door elkaar haalt, houdt twee versies over en raakt de juiste kwijt.'
      },
      // --- 2.3 leerdoel 2: cloud en OneDrive (2x) ---
      {
        prompt: 'Waarom sla je je schoolwerk op in OneDrive en niet op de harde schijf van de schoollaptop?',
        leerdoel: 'Je weet wat de cloud is en waarom OneDrive handig is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Omdat OneDrive je bestanden automatisch mooier gaat opmaken.', correct: false, misconception: 'Denkt dat een opslagplek ook iets aan de inhoud verandert.' },
          { text: 'Omdat de harde schijf van een schoollaptop weinig bestanden aankan.', correct: false, misconception: 'Bedenkt een technische grens die niet bestaat.' },
          { text: 'Omdat je docent dan automatisch al jouw bestanden kan zien.', correct: false, misconception: 'Verwart opslaan in de cloud met delen met anderen.' },
          { text: 'Omdat je werk dan bij jouw account hoort en niet bij één laptop.', correct: true, explanation: 'De cloud hoort bij jouw account, dus je werk reist mee naar elke computer waarop je inlogt.' }
        ],
        feedback: 'De harde schijf hoort bij het apparaat, de cloud hoort bij jou. Dat is precies waarom je werk dan meereist.'
      },
      {
        prompt: 'Een bestand dat op het bureaublad van een schoollaptop staat, kun je ook op elke andere schoollaptop openen.',
        waar: false,
        leerdoel: 'Je weet wat de cloud is en waarom OneDrive handig is.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        feedback: 'Niet waar: het bureaublad hoort bij één apparaat. Alleen wat in de cloud staat, kun je overal openen.'
      },
      // --- 2.3 leerdoel 3: sneltoetsen (2x) ---
      {
        prompt: 'Welke sneltoets maakt je laatste actie ongedaan?',
        leerdoel: 'Je kunt de sneltoetsen Ctrl+C, Ctrl+V en Ctrl+Z gebruiken.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        options: [
          { text: 'Ctrl+C', correct: false, misconception: 'Kiest de sneltoets waarmee je juist kopieert.' },
          { text: 'Ctrl+V', correct: false, misconception: 'Kiest de sneltoets waarmee je juist plakt.' },
          { text: 'Ctrl+S', correct: false, misconception: 'Denkt dat opslaan hetzelfde is als terugdraaien.' },
          { text: 'Ctrl+Z', correct: true, explanation: 'Ctrl+Z draait je laatste stap terug.' }
        ],
        feedback: 'Ctrl+Z draait terug, Ctrl+C kopieert en Ctrl+V plakt. Die drie samen schelen je in elke les tijd.'
      },
      {
        prompt: 'Je wilt een stuk tekst kopiëren en het ergens anders neerzetten. Welke twee sneltoetsen gebruik je, in deze volgorde?',
        leerdoel: 'Je kunt de sneltoetsen Ctrl+C, Ctrl+V en Ctrl+Z gebruiken.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'Eerst Ctrl+Z en dan Ctrl+C.', correct: false, misconception: 'Begint met terugdraaien in plaats van met kopiëren.' },
          { text: 'Eerst Ctrl+C en dan Ctrl+V.', correct: true, explanation: 'Kopiëren zet de tekst klaar, plakken zet hem op de nieuwe plek.' },
          { text: 'Eerst Ctrl+V en dan Ctrl+C.', correct: false, misconception: 'Draait de volgorde om en plakt iets wat nog niet gekopieerd is.' },
          { text: 'Eerst Ctrl+S en dan Ctrl+V.', correct: false, misconception: 'Verwart opslaan met kopiëren.' }
        ],
        feedback: 'Kopiëren gaat altijd vooraf aan plakken. Ging het toch mis, dan haalt Ctrl+Z je terug naar het beginpunt.'
      },
      // --- 2.4 leerdoel 1: netwerk en server (2x) ---
      {
        prompt: 'Wat is een server?',
        leerdoel: 'Je kunt uitleggen wat een netwerk en een server zijn.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        options: [
          { text: 'Het kastje thuis dat het wifi-signaal uitzendt.', correct: false, misconception: 'Verwart de router met de computer waar de gegevens staan.' },
          { text: 'Het programma waarmee je op je laptop websites bekijkt.', correct: false, misconception: 'Verwart de server met de browser.' },
          { text: 'Een computer die altijd aan staat en diensten levert.', correct: true, explanation: 'Websites, mail en OneDrive draaien dag en nacht op servers die daardoor altijd bereikbaar zijn.' },
          { text: 'De kabel waarmee de school aan het internet hangt.', correct: false, misconception: 'Verwart de weg die gegevens afleggen met de plek waar ze bewaard worden.' }
        ],
        feedback: 'Een server levert, een client vraagt. Jouw laptop is de vrager en de server is de leverancier.'
      },
      {
        prompt: 'Het internet is eigenlijk een netwerk van heel veel kleinere netwerken die aan elkaar geknoopt zijn.',
        waar: true,
        leerdoel: 'Je kunt uitleggen wat een netwerk en een server zijn.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        feedback: 'Klopt. Het netwerk van je school is er één van, en dat hangt weer aan het netwerk van je provider.'
      },
      // --- 2.4 leerdoel 2: stappen bij een website-aanvraag (2x) ---
      {
        prompt: 'Wat gebeurt er meteen nadat jij een webadres hebt ingetypt en op enter drukt?',
        leerdoel: 'Je kunt in stappen vertellen wat er gebeurt als je een website opvraagt.',
        denkniveau: 'begrijpen',
        niveau: 'basis',
        options: [
          { text: 'Je device zoekt uit welk IP-adres bij die naam hoort.', correct: true, explanation: 'Computers werken met nummers, dus de naam moet eerst een IP-adres worden.' },
          { text: 'De pagina staat er, want je browser had hem al klaarstaan.', correct: false, misconception: 'Denkt dat websites vooraf op het eigen apparaat staan.' },
          { text: 'De router maakt zelf een kopie van de website.', correct: false, misconception: 'Denkt dat de router websites bewaart in plaats van doorstuurt.' },
          { text: 'De server belt jouw provider om toestemming te vragen.', correct: false, misconception: 'Denkt dat er per bezoek een menselijke of administratieve stap tussen zit.' }
        ],
        feedback: 'Namen zijn voor mensen, nummers zijn voor computers. Die vertaalstap komt altijd eerst.'
      },
      {
        prompt: 'Leg uit waarom een webpagina in kleine informatiepakketjes wordt verstuurd in plaats van in één groot stuk.',
        type: 'open',
        leerdoel: 'Je kunt in stappen vertellen wat er gebeurt als je een website opvraagt.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'De server knipt de pagina op in kleine pakketjes en stuurt die los van elkaar weg. Kleine pakketjes kunnen langs verschillende routes reizen, dus een drukke route houdt de rest niet tegen. Gaat er onderweg één pakketje verloren, dan hoeft alleen dat ene opnieuw en niet de hele pagina. Mijn browser zet alle pakketjes aan het eind weer in de goede volgorde en tekent de pagina op mijn scherm.',
        nakijkpunten: [
          'Noemt dat de pagina opgeknipt wordt in losse pakketjes.',
          'Noemt minstens één voordeel, bijvoorbeeld verschillende routes of maar één pakketje opnieuw sturen.',
          'Noemt dat de browser de pakketjes weer in de goede volgorde zet.'
        ],
        feedback: 'Klein en los verstuurd is sneller en betrouwbaarder. Daarom zie je soms eerst de tekst en pas daarna de foto\'s.'
      },
      // --- 2.4 leerdoel 3: data en bewaarplekken (2x) ---
      {
        prompt: 'Wat wordt er bedoeld met data?',
        leerdoel: 'Je weet wat data is en op welke plekken jouw data bewaard wordt.',
        denkniveau: 'herkennen',
        niveau: 'basis',
        options: [
          { text: 'Alleen de foto\'s en filmpjes die je zelf op internet zet.', correct: false, misconception: 'Denkt dat alleen bewust gedeelde media meetellen als data.' },
          { text: 'Alle gegevens die jij maakt, verstuurt en achterlaat.', correct: true, explanation: 'Data is elk gegeven: je bestanden, je berichten en de sporen die je achterlaat.' },
          { text: 'De kabels en zendmasten waarover internet loopt.', correct: false, misconception: 'Verwart de infrastructuur met de gegevens die eroverheen gaan.' },
          { text: 'Het bedrag aan internet dat je per maand mag gebruiken.', correct: false, misconception: 'Verwart data als begrip met de databundel van een telefoonabonnement.' }
        ],
        feedback: 'Data is breder dan wat je bewust deelt: ook je zoekopdrachten en je inlogmomenten zijn gegevens.'
      },
      {
        prompt: 'Naast je eigen device en de cloud: wie bewaart er nog meer gegevens over wat jij online doet?',
        leerdoel: 'Je weet wat data is en op welke plekken jouw data bewaard wordt.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        options: [
          { text: 'Niemand, zolang ik netjes uitlog na elk gebruik.', correct: false, misconception: 'Denkt dat uitloggen alle sporen bij anderen wist.' },
          { text: 'Alleen de website die ik op dat moment open heb staan in mijn browser.', correct: false, misconception: 'Denkt dat alleen de eindbestemming iets registreert.' },
          { text: 'Alleen mijn ouders, via de instellingen die thuis aanstaan.', correct: false, misconception: 'Verwart toezicht thuis met technische registratie.' },
          { text: 'Mijn provider en mijn school, die allebei logboeken bijhouden.', correct: true, explanation: 'De provider levert je internet en de school beheert het netwerk; beide leggen vast wat er langskomt.' }
        ],
        feedback: 'Je provider levert de verbinding en je school beheert het netwerk. Allebei houden ze bij wat er langsgaat.'
      },
      // --- 2.5 leerdoel 1: hardware en software uit elkaar houden (2x) ---
      {
        prompt: 'De printer in het lokaal doet niets. Welke vraag helpt je het snelst om te bepalen of dit hardware of software is?',
        leerdoel: 'Je kunt hardware en software uit elkaar houden en uitleggen wat ze doen.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        options: [
          { text: 'Hoe oud is deze printer eigenlijk?', correct: false, misconception: 'Denkt dat leeftijd bepaalt in welke categorie een probleem valt.' },
          { text: 'Welk merk en welk type printer is het?', correct: false, misconception: 'Zoekt naar een kenmerk dat niets zegt over de oorzaak.' },
          { text: 'Werkt de printer wel bij een klasgenoot?', correct: true, explanation: 'Werkt hij bij een ander wel, dan zit het in jouw software; ligt het aan stroom of kabel, dan is het hardware.' },
          { text: 'Hoeveel bladzijden wil ik straks printen?', correct: false, misconception: 'Denkt dat de omvang van de opdracht de oorzaak aanwijst.' }
        ],
        feedback: 'Werkt hij bij een ander wél, dan ligt het aan jouw kant en dus meestal aan software. Anders is het het apparaat.'
      },
      {
        prompt: 'Leg uit waarom je een virus met een update of een virusscanner aanpakt, terwijl je een kapotte ventilator daar niet mee oplost.',
        type: 'open',
        leerdoel: 'Je kunt hardware en software uit elkaar houden en uitleggen wat ze doen.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Een virus is software: het is een programma dat op mijn device draait. Software pak je met software aan, dus met een update die het gat dicht en met een virusscanner die het programma verwijdert. Een ventilator is hardware: dat is een onderdeel dat je kunt vasthouden. Als dat kapot is, moet iemand het vervangen of repareren, en geen enkel programma maakt de ventilator weer heel. Dus eerst bepaal ik welke van de twee het is, want dat bepaalt de oplossing.',
        nakijkpunten: [
          'Zegt dat een virus software is en een ventilator hardware.',
          'Legt uit dat software met software wordt opgelost en hardware met vervangen of repareren.',
          'Trekt de conclusie dat je eerst bepaalt welke van de twee het is.'
        ],
        feedback: 'De categorie bepaalt het gereedschap. Een programma tegen een programma, en een schroevendraaier tegen een onderdeel.'
      },
      // --- 2.5 leerdoel 2: bestanden overal terugvinden (2x) ---
      {
        prompt: 'Je bent morgen op een andere schoolcomputer en je wilt daar verder met je verslag. Wat doe je vandaag?',
        leerdoel: 'Je kunt je bestanden zo opslaan dat je ze op elke computer terugvindt.',
        denkniveau: 'toepassen',
        niveau: 'basis',
        options: [
          { text: 'Ik zet het bestand op het bureaublad, dan zie ik het meteen staan.', correct: false, misconception: 'Denkt dat het bureaublad op elke computer hetzelfde is.' },
          { text: 'Ik sla het bestand op in mijn eigen map in OneDrive.', correct: true, explanation: 'OneDrive staat in de cloud en hoort bij jouw account, niet bij één apparaat.' },
          { text: 'Ik mail het naar een klasgenoot, dan is het in elk geval bewaard.', correct: false, misconception: 'Legt het eigen bewijs bij iemand anders neer en is er dan van afhankelijk.' },
          { text: 'Ik laat het bestand openstaan, dan kan ik er morgen zo weer bij.', correct: false, misconception: 'Denkt dat een openstaand programma het bestand vasthoudt.' }
        ],
        feedback: 'De cloud reist met je account mee. Een bestand op het bureaublad blijft achter bij dat ene apparaat.'
      },
      {
        prompt: 'Beschrijf hoe jij je werk van dit hoofdstuk opslaat en een naam geeft, zodat je docent en jijzelf het over twee maanden nog terugvinden.',
        type: 'open',
        leerdoel: 'Je kunt je bestanden zo opslaan dat je ze op elke computer terugvindt.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik sla alles op in OneDrive, in de map Digitale geletterdheid met daarin een submap per hoofdstuk. Zo staat mijn werk in de cloud en kan ik er op elke schoolcomputer bij, want het hoort bij mijn account. Elk bestand krijgt een naam volgens de afspraak, bijvoorbeeld h2-onderdelenkaart-sam-1c, zodat je aan de naam ziet wat het is en van wie. Ik gebruik Knippen en Plakken om iets te verplaatsen, zodat er geen dubbele versies ontstaan.',
        nakijkpunten: [
          'Noemt OneDrive of de cloud, met de reden dat het bij het account hoort en niet bij één apparaat.',
          'Beschrijft een mappenstructuur, bijvoorbeeld een vakmap met submappen per hoofdstuk.',
          'Geeft een concrete afspraak voor bestandsnamen met een voorbeeld.'
        ],
        feedback: 'Terugvinden is een afspraak, geen geluk: een vaste plek in de cloud plus een naam die zichzelf uitlegt.'
      },
      // --- 29e item: de vier gebruiksregels uit bronles 2 ---
      // Dit is het item dat in ronde 5 ontbrak. Theorieblok B van 2.5 belooft de
      // leerling dat de gebruiksregels in de toets terugkomen, en de bronles
      // noemt ze als eigen lesdoel. Zonder dit item las de leerling een belofte
      // die niet waargemaakt werd, en brak de keten startcheck 2.2 -> oefenopgave
      // 2.2 -> open afsluitvraag 2.2 -> diagnose 15 -> toetsitem bij stap vijf af.
      // Het item hangt aan het hoofdstuk-1-leerdoel over het wachtwoord, omdat
      // regel 2 daar rechtstreeks op zit; de andere drie regels worden in
      // dezelfde vraag uitgevraagd. Dat is toegestaan: de toetsdekking eist dat
      // elk verplicht leerdoel van hoofdstuk 2 bevraagd wordt, en een extra
      // leerdoel uit een eerder hoofdstuk mag erbij.
      {
        prompt: 'Noem de vier gebruiksregels die op school voor je device gelden, en leg bij twee van die regels uit wat er mis kan gaan als je je er niet aan houdt.',
        type: 'open',
        leerdoel: 'Je weet waarom je je wachtwoord nooit aan iemand anders geeft.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Regel een: laat je computer nooit onbeheerd achter. Regel twee: geef je wachtwoord aan niemand, ook niet aan je beste vriend of vriendin. Regel drie: downloaden mag, maar je bent er zelf verantwoordelijk voor, dus gebruik alleen veilige sites. Regel vier: kom je er zelf niet uit, ga dan direct naar je mentor of naar de ICT-afdeling. Bij regel een gaat het mis omdat je laptop ingelogd openstaat en iedereen dan onder mijn naam bij mijn mail en bestanden kan. Bij regel twee blijf ik verantwoordelijk voor alles wat er met mijn account gebeurt, ook als iemand anders het gedaan heeft.',
        nakijkpunten: [
          'Noemt alle vier de regels: niet onbeheerd achterlaten, wachtwoord niet delen, veilig downloaden en hulp vragen bij mentor of ICT.',
          'Legt bij twee regels een concreet gevolg uit, en niet alleen dat het niet mag.',
          'Noemt bij regel een of regel twee dat een ander onder jouw naam verder kan werken.'
        ],
        feedback: 'De vier regels gaan alle vier over hetzelfde: een open deur die jij als enige dicht kunt houden.'
      }
    ]
  },

  '2.6': {
    learningGoals: [
      'Je kunt in stappen uitleggen wat er gebeurt tussen je muisklik en het resultaat op je scherm.',
      'Je weet dat een computer alles opslaat als nullen en enen.',
      'Je kunt uitleggen waarom werkgeheugen en opslag niet hetzelfde zijn.'
    ],
    theorie: [
      {
        keyTerms: ['invoer', 'instructie', 'klokfrequentie'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je dubbelklikt op het Word-icoon en na twee seconden staat het programma op je scherm. Wat is er in die twee seconden gebeurd?</p>',
          '<p><strong>Antwoord.</strong> Je klik ging als invoer via het moederbord naar de processor. Die vroeg het programma op uit de opslag, want daar staat Word bewaard, en liet het naar het werkgeheugen kopiëren. Daarna begon de processor de instructies van Word één voor één uit te voeren. Het beeld dat daaruit volgde ging naar de videokaart en van daar naar je scherm. Die twee seconden zitten vooral in stap twee: de opslag is het traagste onderdeel in deze keten.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['bit', 'byte', 'binair', 'vluchtig'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Reken uit welk getal het binaire 1101 is, en laat zien hoe je het aanpakt.</p>',
          '<p><strong>Antwoord.</strong> Schrijf de plaatswaarden van rechts naar links onder de cijfers: 1, 2, 4 en 8. Onder de vier cijfers van 1101 staan dan achtereenvolgens de plaatswaarden 8, 4, 2 en 1. Op de plaatsen 8, 4 en 1 staat een 1, en alleen op de plaats 2 staat een 0. Tel daarom uitsluitend de plaatsen op waar een 1 boven staat: 8 plus 4 plus 1 is dertien. Het binaire 1101 is dus dertien.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>In een computer herhaalt zich steeds dezelfde kringloop: een instructie ophalen, die uitvoeren en het resultaat wegschrijven. Alles wat daarbij door het apparaat gaat is binair opgeschreven, in bits die alleen 0 of 1 zijn. Het werkgeheugen is razendsnel, maar het is leeg zodra de stroom van je device af gaat. De opslag is trager en bewaart jouw bestanden juist wél nadat je het apparaat hebt uitgezet.</p>',
      keyTerms: ['binair', 'bits', 'opslag']
    },
    vragen: [
      {
        prompt: 'Wat doet de processor telkens opnieuw, miljarden keren per seconde?',
        leerdoel: 'Je kunt in stappen uitleggen wat er gebeurt tussen je muisklik en het resultaat op je scherm.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Hij bewaart al je bestanden op de schijf voor later.', correct: false, misconception: 'Verwart de rekentaak van de processor met de bewaartaak van de opslag.' },
          { text: 'Hij haalt een instructie op, voert die uit en schrijft weg.', correct: true, explanation: 'Ophalen, uitvoeren en het resultaat wegschrijven is de kringloop waarin een processor werkt.' },
          { text: 'Hij koelt de onderdelen die te warm dreigen te worden.', correct: false, misconception: 'Verwart de processor met de ventilator die de warmte afvoert.' },
          { text: 'Hij stuurt jouw gegevens door naar de server van de website.', correct: false, misconception: 'Verwart het rekenwerk in het apparaat met het verkeer over het netwerk.' }
        ],
        feedback: 'Elke afzonderlijke stap van een processor is simpel; de kracht zit in de herhaling, miljarden rondjes per seconde.'
      },
      {
        prompt: 'Hoeveel bits zitten er in één byte?',
        leerdoel: 'Je weet dat een computer alles opslaat als nullen en enen.',
        denkniveau: 'herkennen',
        niveau: 'plus',
        options: [
          { text: 'Twee', correct: false, misconception: 'Verwart het aantal waarden van één bit met het aantal bits in een byte.' },
          { text: 'Vier', correct: false, misconception: 'Gokt op een rond getal zonder het na te rekenen.' },
          { text: 'Zestien', correct: false, misconception: 'Verwart een byte met een groter blok gegevens.' },
          { text: 'Acht', correct: true, explanation: 'Acht bits vormen samen een byte, goed voor 256 verschillende waarden.' }
        ],
        feedback: 'Acht bits maken een byte, en dat zijn 256 mogelijkheden: genoeg voor één letter of één kleurwaarde.'
      },
      {
        prompt: 'Het werkgeheugen houdt jouw bestanden vast, ook als de computer uit staat.',
        waar: false,
        leerdoel: 'Je kunt uitleggen waarom werkgeheugen en opslag niet hetzelfde zijn.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        feedback: 'Werkgeheugen is vluchtig: het is leeg zodra de stroom eraf gaat. Bewaren is het werk van de opslag.'
      },
      {
        // Ronde 9: dit item vroeg naar 1001, en dat is precies het getal dat 2.6
        // theorie B zelf voorrekent ("1001 betekent dus 8 plus 1, en dat is samen
        // negen"). Wie die ene zin onthield had het goed zonder ooit zelf een bit
        // te wegen, terwijl het item op denkniveau 'toepassen' staat. Het getal is
        // nu 1010: dat staat nergens in dit hoofdstuk uitgerekend, terwijl de
        // methode twee keer is voorgedaan (1001 in de theorie, 1101 in het
        // uitgewerkte voorbeeld). Nu meet het item wat het label belooft.
        prompt: 'Welk getal is het binaire 1010?',
        leerdoel: 'Je weet dat een computer alles opslaat als nullen en enen.',
        denkniveau: 'toepassen',
        niveau: 'verdieping',
        options: [
          { text: 'Tien', correct: true, explanation: 'De plaatsen zijn 8, 4, 2 en 1; hier staan de 8 en de 2 aan, en samen is dat tien.' },
          { text: 'Vijf', correct: false, misconception: 'Leest de bits van links naar rechts en rekent daardoor 0101 uit in plaats van 1010.' },
          { text: 'Twaalf', correct: false, misconception: 'Zet de tweede 1 op de plaats 4 in plaats van op de plaats 2 en telt 8 plus 4.' },
          { text: 'Dertien', correct: false, misconception: 'Verwart dit getal met de 1101 uit het uitgewerkte voorbeeld en herhaalt dat antwoord.' }
        ],
        feedback: 'Reken van rechts naar links met 1, 2, 4 en 8. Bij 1010 staan de 8 en de 2 aan, en samen is dat tien.'
      },
      {
        prompt: 'Leg uit waarom een computer met veel vrije opslagruimte toch traag kan zijn, en gebruik daarbij het verschil tussen werkgeheugen en opslag.',
        type: 'open',
        leerdoel: 'Je kunt uitleggen waarom werkgeheugen en opslag niet hetzelfde zijn.',
        denkniveau: 'uitleggen',
        niveau: 'verdieping',
        rol: 'bewijs_leveren',
        modelAnswer: 'Opslag en werkgeheugen doen niet hetzelfde. De opslag bewaart bestanden, ook als het apparaat uit staat, maar hij is traag. Het werkgeheugen houdt alleen vast waar de processor op dit moment mee bezig is, en dat gaat heel snel. Is het werkgeheugen te klein, dan moet de computer steeds gegevens heen en weer schuiven naar de trage opslag. Daardoor voelt alles langzaam, hoeveel opslagruimte er ook vrij is.',
        nakijkpunten: [
          'Noemt dat werkgeheugen snel en tijdelijk is en dat opslag trager maar blijvend is.',
          'Legt uit dat te weinig werkgeheugen de computer dwingt de trage opslag te gebruiken.',
          'Trekt de conclusie dat vrije opslagruimte dit probleem niet oplost.'
        ],
        feedback: 'Een lege kast maakt je bureau niet groter. Te weinig werkgeheugen blijft traag, hoeveel opslag er ook over is.'
      },
      // --- Terugkeervragen: spreiding over 2.2 en 2.4 ---
      {
        prompt: 'Windows is een besturingssysteem en daarmee software, ook al staat het op een schijf die je kunt vasthouden.',
        waar: true,
        leerdoel: 'Je kunt het verschil uitleggen tussen hardware en software.',
        denkniveau: 'begrijpen',
        niveau: 'plus',
        feedback: 'De schijf is hardware, maar wat erop staat is code. De drager en de inhoud zijn twee verschillende dingen.'
      },
      {
        prompt: 'Je opent een website. Waar draait het programma dat die pagina voor jou klaarzet?',
        leerdoel: 'Je kunt uitleggen wat een netwerk en een server zijn.',
        denkniveau: 'toepassen',
        niveau: 'plus',
        options: [
          { text: 'Op de server van die website, die altijd aan staat.', correct: true, explanation: 'De pagina wordt bij de server vandaan gehaald, en jouw browser tekent alleen het resultaat op je scherm.' },
          { text: 'Op mijn eigen processor, want die voert alles uit.', correct: false, misconception: 'Denkt dat alle rekenwerk op het eigen apparaat gebeurt.' },
          { text: 'In de router, die de pagina voor de hele klas klaarzet.', correct: false, misconception: 'Denkt dat de router meer doet dan doorsturen.' },
          { text: 'In mijn werkgeheugen, want daar komt de pagina binnen.', correct: false, misconception: 'Verwart de plek waar het resultaat terechtkomt met de plek waar het gemaakt wordt.' }
        ],
        feedback: 'Twee computers werken samen: de server maakt de pagina en jouw device tekent hem. Het netwerk zit ertussen.'
      },
      {
        // RONDE 8. Ook de plusparagraaf had maar één open vraag op zeven. Dit item is
        // de verdiepingsvraag die het jaarplan voor tl vraagt: het legt het verband
        // tussen de kringloop van 2.6 en de onderdelen uit 2.1. Het hangt aan het
        // stappen-leerdoel van 2.6, dat verder maar één keer bevraagd werd. De
        // hoofdstuktoets blijft er buiten, want 2.6 is vrijwillig.
        prompt: 'Leg uit hoe de kringloop uit deze paragraaf samenhangt met de onderdelen die je in 2.1 hebt leren benoemen. Noem er minstens drie.',
        type: 'open',
        leerdoel: 'Je kunt in stappen uitleggen wat er gebeurt tussen je muisklik en het resultaat op je scherm.',
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Mijn muisklik is invoer en gaat via het moederbord naar de processor, want het moederbord verbindt alle onderdelen. Het programma staat op het opslaggeheugen en wordt eerst naar het werkgeheugen gekopieerd, omdat de processor daar veel sneller bij kan. Daarna haalt de processor telkens één instructie uit dat werkgeheugen, voert hem uit en schrijft het resultaat weg. Moet er beeld komen, dan geeft de processor dat door aan de videokaart, en die stuurt de plaatjes via het moederbord naar mijn scherm. Al dat rekenwerk maakt warmte, dus de koeling draait ondertussen mee om te voorkomen dat het apparaat oververhit raakt.',
        nakijkpunten: [
          'Noemt minstens drie onderdelen uit 2.1 en geeft elk een plek in de keten van muisklik tot beeld.',
          'De volgorde klopt: invoer, dan opslag naar werkgeheugen, dan de processor, en pas daarna de videokaart en het scherm.',
          'Legt bij minstens één onderdeel uit waarom het daar nodig is, en niet alleen dat het er zit.'
        ],
        feedback: 'De keten uit 2.6 loopt dwars door de onderdelenkaart uit 2.1. Elk onderdeel is een station op die route.'
      }
    ]
  }
};
