// Quizvragen per level, gebaseerd op de theorie-PDF "Digitale Geletterdheid" (Wikiwijs, 20 lessen).
// Per level worden er 3 gesteld (volgorde geschud); extra vragen dienen als reserve.
export const PACO_VRAGEN = {
  1: [
    {
      id: 'hardware',
      vraag: 'Wat is hardware?',
      opties: [
        { id: 'a', tekst: 'De onderdelen van een apparaat die je kunt aanraken', correct: true },
        { id: 'b', tekst: 'De programma’s en apps op je computer' },
        { id: 'c', tekst: 'Een soort wachtwoord' }
      ],
      uitleg: 'Hardware kun je aanraken (toetsenbord, scherm); software zijn de programma’s.'
    },
    {
      id: 'wachtwoord',
      vraag: 'Wat is een sterk wachtwoord?',
      opties: [
        { id: 'a', tekst: 'Minimaal 12 tekens met hoofdletters, cijfers en symbolen', correct: true },
        { id: 'b', tekst: 'Je eigen naam met je geboortejaar' },
        { id: 'c', tekst: 'welkom123' }
      ],
      uitleg: 'Lang en gevarieerd: minimaal 12 tekens met hoofdletters, cijfers en symbolen.'
    },
    {
      id: 'phishing',
      vraag: 'Je krijgt een mail van "je bank": klik snel op deze link! Wat is dit waarschijnlijk?',
      opties: [
        { id: 'a', tekst: 'Phishing: een nepmail om je gegevens te stelen', correct: true },
        { id: 'b', tekst: 'Een echte mail van de bank' },
        { id: 'c', tekst: 'Een gezellige nieuwsbrief' }
      ],
      uitleg: 'Berichten die haast maken en om een klik vragen zijn bijna altijd phishing.'
    },
    {
      id: 'software',
      vraag: 'Wat is software?',
      opties: [
        { id: 'a', tekst: 'De programma’s en apps op je apparaat', correct: true },
        { id: 'b', tekst: 'Het beeldscherm van je laptop' },
        { id: 'c', tekst: 'De oplader van je telefoon' }
      ],
      uitleg: 'Software zijn de programma’s; hardware zijn de onderdelen die je kunt aanraken.'
    }
  ],
  2: [
    {
      id: 'kop1',
      vraag: 'Waarom gebruik je "Kop 1" in Word?',
      opties: [
        { id: 'a', tekst: 'Voor hoofdstuktitels en een automatische inhoudsopgave', correct: true },
        { id: 'b', tekst: 'Om tekst rood te maken' },
        { id: 'c', tekst: 'Om een pagina te verwijderen' }
      ],
      uitleg: 'Met kopstijlen maakt Word vanzelf een kloppende inhoudsopgave.'
    },
    {
      id: 'hoofdstuk',
      vraag: 'Waar begint een nieuw hoofdstuk in een verslag?',
      opties: [
        { id: 'a', tekst: 'Bovenaan een nieuwe pagina', correct: true },
        { id: 'b', tekst: 'Onderaan de vorige pagina' },
        { id: 'c', tekst: 'Dat maakt niet uit' }
      ],
      uitleg: 'Elk hoofdstuk start bovenaan een nieuwe pagina, zonder onnodige witte pagina’s.'
    },
    {
      id: 'dia',
      vraag: 'Wat maakt een goede PowerPoint-dia?',
      opties: [
        { id: 'a', tekst: 'Weinig tekst en duidelijke afbeeldingen', correct: true },
        { id: 'b', tekst: 'Zo veel mogelijk tekst' },
        { id: 'c', tekst: 'Tien lettertypes door elkaar' }
      ],
      uitleg: 'Een dia ondersteunt je verhaal: weinig tekst, duidelijke beelden.'
    },
    {
      id: 'opslaan',
      vraag: 'Waar bewaar je je schoolwerk het slimst?',
      opties: [
        { id: 'a', tekst: 'In de cloud (zoals OneDrive), dan kun je er overal bij', correct: true },
        { id: 'b', tekst: 'Alleen op het bureaublad van één computer' },
        { id: 'c', tekst: 'Nergens, ik onthoud het wel' }
      ],
      uitleg: 'In de cloud staat je werk veilig en kun je er op elk apparaat bij.'
    }
  ],
  3: [
    {
      id: 'algoritme',
      vraag: 'Wat is een algoritme?',
      opties: [
        { id: 'a', tekst: 'Een slimme computerregel die bepaalt welke filmpjes jij ziet', correct: true },
        { id: 'b', tekst: 'Een computervirus' },
        { id: 'c', tekst: 'Een geheim wachtwoord' }
      ],
      uitleg: 'Algoritmes bepalen wat jij te zien krijgt op social media — handig én beïnvloedend.'
    },
    {
      id: 'cyberpesten',
      vraag: 'Wat is cyberpesten?',
      opties: [
        { id: 'a', tekst: 'Pesten via internet, telefoon of andere digitale middelen', correct: true },
        { id: 'b', tekst: 'Een computerspelletje' },
        { id: 'c', tekst: 'Ruzie op het schoolplein' }
      ],
      uitleg: 'Cyberpesten is pesten via digitale middelen. Praat erover en rapporteer het.'
    },
    {
      id: 'nepnieuws',
      vraag: 'Hoe check je of nieuws echt is?',
      opties: [
        { id: 'a', tekst: 'Kijk naar de bron en of betrouwbare sites het ook melden', correct: true },
        { id: 'b', tekst: 'Veel likes betekent dat het waar is' },
        { id: 'c', tekst: 'Delen en kijken wat vrienden zeggen' }
      ],
      uitleg: 'Check altijd de bron en vergelijk met betrouwbare websites.'
    },
    {
      id: 'schermtijd',
      vraag: 'Wat is de 20-20-2-regel?',
      opties: [
        { id: 'a', tekst: 'Na 20 min schermtijd 20 sec in de verte kijken, en 2 uur per dag naar buiten', correct: true },
        { id: 'b', tekst: '20 apps, 20 volgers, 2 telefoons' },
        { id: 'c', tekst: '20 minuten gamen, 20 minuten pauze, 2 snacks' }
      ],
      uitleg: 'Zo bescherm je je ogen en blijf je digitaal gezond.'
    }
  ],
  4: [
    {
      id: 'prompt',
      vraag: 'Wat is een prompt?',
      opties: [
        { id: 'a', tekst: 'Een opdracht die je aan een chatbot geeft', correct: true },
        { id: 'b', tekst: 'Een snelle muisklik' },
        { id: 'c', tekst: 'Een soort virus' }
      ],
      uitleg: 'Hoe duidelijker je prompt, hoe beter het antwoord van de chatbot.'
    },
    {
      id: 'ai-fouten',
      vraag: 'Mag je alles geloven wat een AI-chatbot zegt?',
      opties: [
        { id: 'a', tekst: 'Nee, AI kan fouten maken: controleer belangrijke informatie', correct: true },
        { id: 'b', tekst: 'Ja, AI weet alles' },
        { id: 'c', tekst: 'Alleen bij huiswerk' }
      ],
      uitleg: 'AI klinkt zeker, maar kan er ook zeker naast zitten. Blijf zelf nadenken.'
    },
    {
      id: 'canva',
      vraag: 'Wat kun je met een tool als Canva?',
      opties: [
        { id: 'a', tekst: 'Ontwerpen maken zoals posters en presentaties', correct: true },
        { id: 'b', tekst: 'Virussen verwijderen' },
        { id: 'c', tekst: 'Sneller wifi krijgen' }
      ],
      uitleg: 'Canva is een ontwerptool voor posters, presentaties en meer.'
    }
  ]
};
