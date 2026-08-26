// Oud curriculum, hoofdstuk 2. Bewaard om na te kijken, NIET meegeladen:
// de generator leest alleen scripts/seed-structuur/h<n>.mjs, en dit bestand
// staat in _oud. Het nieuwe jaarplan telt acht hoofdstukken en wordt hier
// een map hoger opnieuw opgebouwd.

import { p, checkpoint, media } from '../helpers.mjs';

export default {
  chapter: 2,
  chapterTitle: 'Werken met Microsoft',
  badge: 'Microsoft Maker',
  paragraphs: [
    p('2.1', 'Word: een net schooldocument', ['22A', '21A'], 'net Word-document', 100, 'Opmaakdokter',
      ['Rustige opmaak', 'Een net Word-document is rustig en goed leesbaar. Gebruik een duidelijke titel, korte alinea’s en genoeg witruimte. Maak niet alles vet, groot of gekleurd. Opmaak helpt de lezer, maar mag niet afleiden van de inhoud.'],
      ['Basisfuncties', 'In Word kun je tekst typen, opslaan, kopiëren, afbeeldingen invoegen en bronnen noemen. Een afbeelding maakt je document sterker als die past bij je tekst. Zet er altijd een korte bronregel bij, zodat duidelijk is waar het beeld vandaan komt.'],
      media('https://support.microsoft.com/nl-nl/office/basisbewerkingen-in-microsoft-365-videotraining-396b8d9e-e118-42d0-8a0d-87d1f2f055fb', 'Microsoft Word basis', 'Welke knop maakt het document netter?'),
      ['Wat hoort bovenaan?', 'Waarom sla je bewust op?', 'Wat is een bronregel?'],
      'Maak een Word-document over een hobby of schoolvak met titel, naam, twee alinea’s, één afbeelding, bronregel en correcte bestandsnaam.',
      ['Wat maakt een titel duidelijk?', 'Welke opmaak is rustig?', 'Waarom noem je een bron?', 'Wat is een goede bestandsnaam?', 'Waar sla je op?'],
      'Herstel drukke tekst, ontbrekende titel, verkeerde afbeelding en ontbrekende bron.'),
    p('2.2', 'Word-verslag met koppen en bronnen', ['22A', '21B', '23A'], 'kort verslag met koppen en bronvermelding', 100, 'Plagiaatpolitie',
      ['Koppen geven structuur', 'Koppen helpen de lezer. Ze laten zien waar een nieuw onderdeel begint. In Word kun je stijlen gebruiken zoals Kop 1 en Kop 2. Dat ziet er netter uit en maakt je verslag overzichtelijker. Een verslag zonder koppen wordt snel één lange tekst.'],
      ['Eigen woorden en bronnen', 'Kopiëren zonder bron heet plagiaat. Schrijf informatie in je eigen woorden, alsof je het uitlegt aan een klasgenoot. Gebruik je een website, video of afbeelding? Noem dan de bron. Zo kan iemand controleren waar je informatie vandaan komt.'],
      media('https://schooltv.nl/video-item/wat-is-plagiaat-auteursrecht-betekent-dat-je-de-baas-bent-over-wat-jij-gemaakt-hebt', 'HackShield plagiaat', 'Wanneer is iets kopiëren?'),
      ['Welke kop past bij deze alinea?', 'Is dit eigen woorden of kopie?', 'Welke bronregel is duidelijk?'],
      'Schrijf een kort verslag Drie tips voor veilig internet met titel, drie koppen, drie alinea’s, één afbeelding en twee bronnen.',
      ['Is dit plagiaat?', 'Welke kop is duidelijk?', 'Waarom schrijf je in eigen woorden?', 'Welke bronregel klopt?', 'Wat controleer je bij peerfeedback?'],
      'Label zinnen als eigen woorden, citaat of kopie zonder bron.'),
    p('2.3', 'PowerPoint: duidelijk presenteren', ['22A', '21B'], '3 duidelijke dia’s', 100, 'Dia Dokter',
      ['Een dia is geen werkstuk', 'Een PowerPoint-dia ondersteunt jouw verhaal. Zet er dus niet een heel verslag op. Gebruik weinig tekst, grote letters en één boodschap per dia. Als iemand achter in het lokaal het niet kan lezen, is de dia te druk of te klein.'],
      ['Beeld helpt je verhaal', 'Een afbeelding kan helpen, maar alleen als die past bij wat je uitlegt. Kies rustige kleuren en goed contrast. Vertel zelf de uitleg; de dia geeft steun. Een goede presentatie bestaat uit duidelijke dia’s én iemand die rustig vertelt.'],
      media('https://support.microsoft.com/nl-nl/office/basisbewerkingen-in-microsoft-365-videotraining-396b8d9e-e118-42d0-8a0d-87d1f2f055fb', 'Microsoft PowerPoint basis', 'Welke dia kun je achterin het lokaal lezen?'),
      ['Welke dia is rustiger?', 'Hoeveel tekst is genoeg?', 'Waarvoor gebruik je een titeldia?'],
      'Maak drie dia’s over een schoolapp of digitale vaardigheid: titeldia, wat kun je ermee en drie tips.',
      ['Welke dia is duidelijker?', 'Wat is te veel tekst?', 'Waarom gebruik je contrast?', 'Welke afbeelding past?', 'Wat vertel je zelf?'],
      'Verbeter slechte dia’s met keuzes voor tekst, beeld, contrast en volgorde.'),
    p('2.4', 'PowerPoint: uitleg in 5 dia’s', ['22A', '23B'], 'mini-presentatie', 100, 'Pitchtimer',
      ['Begin, midden en einde', 'Een korte presentatie heeft een duidelijke opbouw. Begin met je onderwerp. Leg daarna drie belangrijke punten uit. Sluit af met een tip, samenvatting of vraag. Daardoor kan de luisteraar je beter volgen.'],
      ['Kort presenteren', 'Lees niet alles voor. Zet kernwoorden op je dia en vertel de rest in je eigen woorden. Oefen hardop. Let op tempo, volume en houding. Een bron hoort ook in je presentatie als je informatie of beeld van internet gebruikt.'],
      media('', 'Presentatietips docentdemo', 'Wat doet de spreker waardoor je blijft luisteren?'),
      ['Welke dia hoort eerst?', 'Welke zin is spreektekst en welke is diatekst?', 'Waar zet je de bron?'],
      'Maak vijf dia’s over veilig internet, Word gebruiken, digitale geletterdheid, favoriete app of bestanden terugvinden. Voeg bronvermelding toe.',
      ['Welke volgorde klopt?', 'Wat is een goede afsluitdia?', 'Wat hoort op de dia en wat vertel je?', 'Waarom oefen je hardop?', 'Waar staat de bron?'],
      'Oefen 45 seconden uitleg zonder alles voor te lezen.'),
    p('2.5', 'Samenwerken via OneDrive en Outlook', ['21A', '22A', '23B'], 'gedeeld bestand en nette mail', 100, 'Deelrechten Duel',
      ['Delen met rechten', 'In OneDrive kun je een bestand delen. Kies bewust wie mag kijken of bewerken. Niet elk bestand moet voor iedereen open staan. Bewerkrechten geef je alleen als iemand echt moet meewerken. Bij twijfel kies je veiliger.'],
      ['Nette mail met link', 'Een goede mail heeft een onderwerp, aanhef, korte uitleg, link en afsluiting. Schrijf vriendelijk en duidelijk. Controleer of de link werkt en of de rechten kloppen. Zo voorkom je dat iemand je bestand niet kan openen of juist te veel kan aanpassen.'],
      media('https://support.microsoft.com/nl-nl/office/basisbewerkingen-in-microsoft-365-videotraining-396b8d9e-e118-42d0-8a0d-87d1f2f055fb', 'OneDrive en Outlook demo', 'Wanneer geef je bewerkrechten?'),
      ['Welke rechten kies je?', 'Wat hoort in een nette mail?', 'Wat doe je als de link niet werkt?'],
      'Werk in duo’s aan een gedeeld Word-bestand met vijf samenwerkingsregels. Stuur daarna een nette Outlook-mail met link aan de docent of oefenadres.',
      ['Welke rechten passen?', 'Wat ontbreekt in deze mail?', 'Waarom geen openbare link?', 'Wat doe je bij foutmelding?', 'Welke afspraak voorkomt chaos?'],
      'Kies per situatie privé, bekijken, bewerken of niet delen.'),
    checkpoint('2.6', 'Checkpoint: Microsoft tools', ['21A', '21B', '22A', '23B'], 'Microsoft mini-portfolio', 120, 'Microsoft Maker Challenge',
      ['Microsoft als gereedschapskist', 'Word, PowerPoint, OneDrive en Outlook zijn verschillende gereedschappen. Word gebruik je voor documenten. PowerPoint gebruik je om iets uit te leggen. OneDrive bewaart en deelt bestanden. Outlook gebruik je om netjes te communiceren.'],
      ['Mini-portfolio', 'In deze checkpoint lever je bewijs in. Je laat zien dat je een document, presentatie, gedeelde link en mail kunt maken. Je schrijft ook kort wat zelfstandig lukte en waarbij je nog hulp nodig had.'],
      null,
      ['Welke tool kies je bij welke taak?', 'Wat maakt je document netjes?', 'Wat maakt je presentatie duidelijk?'],
      'Lever een mini-portfolio in met Word-document, PowerPoint, gedeelde OneDrive-link, nette mail en korte reflectie.',
      ['Welke tool hoort bij een verslag?', 'Welke tool hoort bij presenteren?', 'Wat is een goede deelinstelling?', 'Welke mail is netjes?', 'Waar hoort bronvermelding?', 'Wat maakt een dia duidelijk?', 'Wat is een goede bestandsnaam?', 'Waarom reflecteer je?', 'Wat controleer je bij delen?', 'Wat doe je als link niet werkt?'],
      'Vind fouten in document, dia, mail en deelinstelling.')
  ]
};
