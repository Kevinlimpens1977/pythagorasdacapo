export const ACCOUNT_ESCAPE_SKILL_SUMMARY = [
  'Je weet waar je lesroute staat.',
  'Je bewaart schoolwerk in OneDrive.',
  'Je herkent een duidelijke bestandsnaam.',
  'Je gebruikt Outlook voor schoolmail.',
  'Je deelt je wachtwoord niet en logt veilig uit.'
];

export const ACCOUNT_ESCAPE_MISSIONS = [
  {
    id: 'helix',
    title: 'HELIX vinden',
    lockLabel: 'HELIX',
    scene: 'Je docent zegt: open de lesroute Digitale Vaardigheden.',
    prompt: 'Waar begin je?',
    correctChoiceIds: ['helix-platform'],
    choices: [
      {
        id: 'helix-platform',
        label: 'HELIX Leerplatform',
        helper: 'De plek waar je lesroute staat.',
        feedback: 'Goed. HELIX is de plek waar je lesroute staat.'
      },
      {
        id: 'youtube',
        label: 'YouTube',
        helper: 'Handig voor uitleg, maar niet je startplek.',
        feedback: 'Nog niet. YouTube kan soms helpen, maar je lesroute start in HELIX.'
      },
      {
        id: 'zoeken',
        label: 'Google zoeken',
        helper: 'Zoeken is niet nodig als je de schoolplek al hebt.',
        feedback: 'Nog niet. Als je docent HELIX noemt, start je op het leerplatform.'
      },
      {
        id: 'games',
        label: 'Games',
        helper: 'Niet de plek waar je lesroute begint.',
        feedback: 'Nog niet. Eerst open je de lesroute, daarna kan er een spelblok komen.'
      }
    ]
  },
  {
    id: 'onedrive',
    title: 'OneDrive-map maken',
    lockLabel: 'OneDrive',
    scene: 'Je maakt de map Digitale Vaardigheden voor je schoolwerk.',
    prompt: 'Waar bewaar je die map het beste?',
    correctChoiceIds: ['onedrive'],
    choices: [
      {
        id: 'downloads',
        label: 'Downloads',
        helper: 'Hier komen losse bestanden snel rommelig te staan.',
        feedback: 'Dit kan tijdelijk werken, maar voor schoolwerk is OneDrive overzichtelijker.'
      },
      {
        id: 'bureaublad',
        label: 'Bureaublad',
        helper: 'Snel zichtbaar, maar niet handig als vaste schoolmap.',
        feedback: 'Nog niet. Een bureaublad raakt snel vol en is geen nette schoolmap.'
      },
      {
        id: 'onedrive',
        label: 'OneDrive',
        helper: 'Je schoolwerk staat daar netjes bij elkaar.',
        feedback: 'Slim. OneDrive is handig voor schoolwerk, omdat je bestanden daar beter terugvindt.'
      }
    ]
  },
  {
    id: 'bestand',
    title: 'Bestand terugvinden',
    lockLabel: 'Bestand',
    scene: 'Je moet je bewijsbestand openen voor je docent.',
    prompt: 'Welke bestandsnaam is het duidelijkst?',
    correctChoiceIds: ['les01-schooltas'],
    choices: [
      {
        id: 'document',
        label: 'document.docx',
        helper: 'Te algemeen.',
        feedback: 'Deze naam is niet duidelijk genoeg. Je ziet niet voor welke les het bestand is.'
      },
      {
        id: 'kopie',
        label: 'nieuw bestand kopie.docx',
        helper: 'Je ziet niet wat erin staat.',
        feedback: 'Nog niet. Deze naam helpt jou en je docent niet om het bestand terug te vinden.'
      },
      {
        id: 'les01-schooltas',
        label: 'Les01_DigitaleSchooltas_VoornaamKlas.docx',
        helper: 'Les, onderwerp, naam en klas staan erin.',
        feedback: 'Precies. Een goede bestandsnaam vertelt wat het is, van wie het is en bij welke les het hoort.'
      },
      {
        id: 'laatste-versie',
        label: 'werkstuk echt laatste versie def.docx',
        helper: 'Klinkt bekend, maar blijft onduidelijk.',
        feedback: 'Nog niet. Woorden als laatste en definitief worden snel verwarrend.'
      }
    ]
  },
  {
    id: 'outlook',
    title: 'Outlook-bericht kiezen',
    lockLabel: 'Outlook',
    scene: 'Je ziet drie berichten in je schoolmail.',
    prompt: 'Welke keuze is veilig en bruikbaar voor school?',
    correctChoiceIds: ['docent-mail', 'deel-nooit'],
    choices: [
      {
        id: 'docent-mail',
        label: 'Bericht van docent: zet je Word-bestand in OneDrive.',
        helper: 'Normale schoolinformatie.',
        feedback: 'Goed. Outlook gebruik je voor schoolmail van je docent of school.'
      },
      {
        id: 'vreemde-mail',
        label: 'Onbekende afzender: stuur snel je wachtwoord.',
        helper: 'Druk en wachtwoordvraag zijn rode vlaggen.',
        feedback: 'Niet doen. Een wachtwoordvraag via mail is onveilig.'
      },
      {
        id: 'deel-wachtwoord',
        label: 'Klasgenoot: wat is je wachtwoord?',
        helper: 'Ook vrienden krijgen je wachtwoord niet.',
        feedback: 'Je wachtwoord deel je nooit, ook niet met een klasgenoot of vriend.'
      },
      {
        id: 'deel-nooit',
        label: 'Ik deel mijn wachtwoord nooit.',
        helper: 'Dit is de accountregel.',
        feedback: 'Goed. Je wachtwoord is persoonlijk. Ook vrienden of klasgenoten krijgen het niet.'
      }
    ]
  },
  {
    id: 'uitloggen',
    title: 'Veilig afsluiten',
    lockLabel: 'Uitloggen',
    scene: 'De les is klaar. Je zit op een gedeelde schoollaptop.',
    prompt: 'Wat doe je voordat je wegloopt?',
    correctChoiceIds: ['opslaan-sluiten-uitloggen'],
    choices: [
      {
        id: 'dichtklappen',
        label: 'Laptop dichtklappen en weglopen.',
        helper: 'Je account kan nog open staan.',
        feedback: 'Nog niet. Op een gedeelde laptop moet je zelf veilig afsluiten.'
      },
      {
        id: 'browser-open',
        label: 'Browser open laten staan.',
        helper: 'Dan kan iemand anders bij jouw werk.',
        feedback: 'Onveilig. Sluit je werk af voordat iemand anders de laptop gebruikt.'
      },
      {
        id: 'opslaan-sluiten-uitloggen',
        label: 'Bestand opslaan, vensters sluiten en uitloggen.',
        helper: 'De veilige volgorde.',
        feedback: 'Veilig afgesloten. Zo voorkom je dat iemand anders in jouw account werkt.'
      },
      {
        id: 'briefje',
        label: 'Mijn wachtwoord op een briefje leggen.',
        helper: 'Dit mag nooit.',
        feedback: 'Niet veilig. Schrijf je wachtwoord niet zichtbaar op en deel het niet.'
      }
    ]
  }
];

export const getAccountEscapeMissionById = (missionId) => {
  return ACCOUNT_ESCAPE_MISSIONS.find((mission) => mission.id === missionId) || null;
};

export const evaluateAccountEscapeChoice = (missionId, choiceId) => {
  const mission = getAccountEscapeMissionById(missionId);
  const choice = mission?.choices.find((item) => item.id === choiceId);

  if (!mission || !choice) {
    return {
      isCorrect: false,
      feedback: 'Deze keuze hoort niet bij deze missie. Probeer een andere kaart.'
    };
  }

  return {
    isCorrect: mission.correctChoiceIds.includes(choiceId),
    feedback: choice.feedback
  };
};

export const calculateAccountEscapeScore = (progress = {}) => {
  return ACCOUNT_ESCAPE_MISSIONS.filter((mission) => progress[mission.id]?.isCorrect).length;
};

export const createAccountEscapeProgressSummary = (progress = {}) => {
  const remainingMissionIds = ACCOUNT_ESCAPE_MISSIONS
    .filter((mission) => !progress[mission.id]?.isCorrect)
    .map((mission) => mission.id);

  return {
    unlockedCount: ACCOUNT_ESCAPE_MISSIONS.length - remainingMissionIds.length,
    totalCount: ACCOUNT_ESCAPE_MISSIONS.length,
    remainingMissionIds
  };
};
