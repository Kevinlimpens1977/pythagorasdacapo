// Oud curriculum, hoofdstuk 4. Bewaard om na te kijken, NIET meegeladen:
// de generator leest alleen scripts/seed-structuur/h<n>.mjs, en dit bestand
// staat in _oud. Het nieuwe jaarplan telt acht hoofdstukken en wordt hier
// een map hoger opnieuw opgebouwd.

import { p, checkpoint, media } from '../helpers.mjs';

export default {
  chapter: 4,
  chapterTitle: 'Data en Bronnen',
  badge: 'Data & Bron Detective',
  paragraphs: [
    p('4.1', 'Excel: tabellen maken', ['21C', '21A', '22A'], 'Excel-tabel', 100, 'Tabel Tetris',
      ['Data netjes verzamelen', 'Data zijn losse gegevens, zoals namen, tijden, aantallen of keuzes. In Excel zet je die overzichtelijk in rijen en kolommen. Daardoor kun je later sorteren, tellen of een grafiek maken. Rommelige data geven sneller fouten.'],
      ['Rij, kolom en cel', 'Een cel is één vakje. Een rij loopt horizontaal en een kolom verticaal. Kolomtitels moeten kort en duidelijk zijn. Schrijf bijvoorbeeld Reistijd in minuten in plaats van alleen Tijd. Dan weet je later nog wat de gegevens betekenen.'],
      media('', 'Docentdemo Excel-tabel', 'Wat maakt deze tabel makkelijk of juist lastig te lezen?'),
      ['Wat is het verschil tussen rij en kolom?', 'Waarom geef je een kolom een titel?', 'Wat is een cel?'],
      'Maak een Excel-tabel met minimaal vijf rijen en vier kolommen over weekplanning, kantineverkoop of reistijd.',
      ['Wijs cel B3 aan.', 'Kies een goede kolomtitel.', 'Verbeter rommelige data.', 'Wat is een rij?', 'Waarom sorteer je?'],
      'Sleep datakaartjes naar de juiste kolom.'),
    p('4.2', 'Excel: rekenen met formules', ['21C', '21A'], 'Excel-sheet met formules', 100, 'Formule Fixer',
      ['Excel rekent, jij controleert', 'Formules helpen snel totalen, gemiddelden en procenten te berekenen. Toch moet jij controleren of Excel de juiste cellen gebruikt. Een uitkomst kan er netjes uitzien en toch fout zijn als het bereik verkeerd gekozen is.'],
      ['Formules lezen', 'Een formule begint met =. `=SOM(B2:B6)` betekent: tel alles van B2 tot en met B6 bij elkaar op. Bij `=GEMIDDELDE(B2:B6)` berekent Excel het gemiddelde. Leer niet alleen klikken, maar ook begrijpen wat de formule doet.'],
      media('', 'Docentdemo foute formule', 'Waarom lijkt het antwoord goed, maar klopt het toch niet?'),
      ['Wat betekent het =-teken?', 'Wanneer gebruik je gemiddelde?', 'Waarom controleer je celbereik?'],
      'Voeg aan je tabel totaal, gemiddelde en korte conclusie toe.',
      ['Kies de juiste SOM-formule.', 'Herken fout celbereik.', 'Wat is gemiddelde?', 'Waarom controleren?', 'Welke formule past?'],
      'Repareer kapotte formules en leg uit wat fout was.'),
    p('4.3', 'Grafieken die iets vertellen', ['21C', '22A', '21B'], 'grafiek met uitleg', 100, 'Grafiek Judge',
      ['Van tabel naar verhaal', 'Een grafiek maakt data sneller zichtbaar. Je ziet bijvoorbeeld wat het meeste voorkomt of wat verandert. Een grafiek heeft een duidelijke titel, labels en een korte conclusie nodig. Zonder uitleg weet de lezer niet wat belangrijk is.'],
      ['Eerlijk kijken', 'Grafieken kunnen misleiden door een rare schaal, ontbrekende labels of verkeerde grafieksoort. Een staafdiagram is handig voor vergelijken. Een lijngrafiek past bij verandering in tijd. Kies wat helpt bij je vraag, niet alleen wat er mooi uitziet.'],
      media('https://www.terzake-excel.nl/grafiek-maken-in-excel/', 'Excel grafiek maken', 'Welke grafiek helpt eerlijker begrijpen wat er gebeurt?'),
      ['Waarom heeft een grafiek labels nodig?', 'Wat kan misleidend zijn aan een schaal?', 'Welke grafiek past bij vergelijken?'],
      'Maak een grafiek bij je dataset met titel, labels en conclusie van drie zinnen.',
      ['Welke grafiek past?', 'Wat mist aan deze grafiek?', 'Is de schaal eerlijk?', 'Schrijf een conclusie.', 'Wat betekent label?'],
      'Beoordeel grafieken met stoplicht en bewijszin.'),
    p('4.4', 'Data om je heen en data/privacy', ['21C', '21D', '23A', '23C'], 'datastroomkaart', 100, 'Data Spoorzoeker',
      ['Jouw dataspuren', 'Apps, websites en schoolsystemen bewaren gegevens zoals klikgedrag, locatie, inlogtijd of zoekwoorden. Dat kan handig zijn, bijvoorbeeld om je rooster te tonen. Maar data zegt ook iets over jou en kan verkeerd gebruikt worden.'],
      ['Privacykeuzes', 'Privacy betekent dat je nadenkt wie iets mag weten, waarom en wat er kan gebeuren als data wordt gedeeld. Niet alle data is geheim, maar veel data is persoonlijk. Daarom kies je bewust instellingen en deel je niet meer dan nodig.'],
      media('https://schooltv.nl/video-item/wat-doet-een-tracker-volgt-jouw-internetgedrag', 'HackShield tracker', 'Welke data wordt verzameld zonder dat je het meteen merkt?'),
      ['Noem één dataspur op school.', 'Wat is een privacyrisico?', 'Waarom is doel belangrijk?'],
      'Teken een datastroomkaart op papier of digitaal: activiteit, data, wie gebruikt het, doel, risico en veilige keuze.',
      ['Welke data wordt verzameld?', 'Wie gebruikt het?', 'Wat is het doel?', 'Wat is risico?', 'Welke instelling is veiliger?'],
      'Volg dataspuren door een schooldag en benoem gebruiker, doel en risico.'),
    p('4.5', 'Bronnen beoordelen met data en bewijs', ['21B', '21C', '23C'], 'bewijskaart bij claim', 100, 'Claim Checker',
      ['Een claim is nog geen bewijs', '“9 van de 10 jongeren...” klinkt sterk, maar je moet weten wie dit zegt, hoeveel mensen zijn onderzocht en of de bron betrouwbaar is. Een claim is een bewering. Bewijs laat zien waarom je die bewering wel of niet kunt geloven.'],
      ['Data controleren', 'Kijk naar datum, afzender, grafiek, steekproef en wat er ontbreekt. Soms gebruikt iemand cijfers om iets groter of kleiner te laten lijken. Controleer daarom niet alleen de uitkomst, maar ook hoe de data is verzameld.'],
      media('', 'Misleidende grafiek voorbeeld', 'Welke informatie mis je om dit te geloven?'),
      ['Wat is een claim?', 'Waarom is de afzender belangrijk?', 'Wat is ontbrekende data?'],
      'Onderzoek een aangeboden claim. Vul in: wie zegt dit, welke data, wat ontbreekt, welke bron bevestigt en wat is jouw conclusie?',
      ['Sterk bewijs of twijfel?', 'Welke bron is beter?', 'Wat ontbreekt?', 'Waarom datum checken?', 'Schrijf conclusie.'],
      'Sorteer claims in sterk bewijs, twijfel of zwak bewijs.'),
    checkpoint('4.6', 'Checkpoint: data-dashboard en bronkeuze', ['21B', '21C', '22A', '23A'], 'mini-dashboard met bronkeuze', 120, 'Dashboard Dash',
      ['Mini-dashboard', 'Een dashboard laat in één overzicht tabel, formule, grafiek en conclusie zien. Het doel is niet vooral mooi maken, maar duidelijk antwoord geven op een vraag. Je lezer moet snel begrijpen wat de data laat zien.'],
      ['Bronkeuze uitleggen', 'Je vertelt waar je data vandaan komt en waarom die bruikbaar is. Je schrijft ook een privacyzin: welke data is persoonlijk en hoe ga je daar netjes mee om? Zo combineer je Excel, bronnen en veiligheid.'],
      null,
      ['Wat moet minimaal in je dashboard?', 'Waarom noem je je bron?', 'Wat is een privacyzin?'],
      'Maak een mini-dashboard met tabel, formule, grafiek, conclusie en privacyzin. Voeg toe welke bron/data je gebruikt hebt en waarom die bruikbaar is.',
      ['Excelbegrippen', 'Formule kiezen', 'Grafiek beoordelen', 'Privacycasus', 'Bronkeuze', 'Dashboardonderdeel', 'Conclusie', 'Datafout', 'Steekproef', 'Reflectie'],
      'Kies per onderzoeksvraag de beste visualisatie en plaats die op een dashboard.')
  ]
};
