export const para73Slides = [
  {
    id: "p73_presentation",
    type: "presentation",
    heading: "7.3 Langste zijde berekenen",
    subtitle: "Hoe je de langste zijde berekent met de stelling van Pythagoras",
    pdfPath: "/boekafbeeldingen/7.3-slidedeck.pdf",
    totalPages: 14,
    duration: "15-20 minuten",
    notes: "Gegenereerd via NotebookLM op 2026-05-10"
  },
  {
    id: "p73_01",
    type: "theory",
    heading: "7.3 Langste zijde berekenen",
    content: "**Leerdoel:**\nJe leert hoe je de lengte van de langste zijde van een rechthoekige driehoek berekent.\n\nIn deze paragraaf gebruiken we de **stelling van Pythagoras** om de onbekende zijde te vinden.",
    image: "/images/p73_intro.svg"
  },
  {
    id: "p73_02",
    type: "theory",
    heading: "De drie leerroutes",
    content: "Bij deze paragraaf zijn drie leerroutes beschikbaar:\n\n**Ondersteunend**: Stap voor stap met veel hulp\n**Doorlopend**: Zelfstandig met hints\n**Uitdagend**: Zelfstandig zonder hints\n\nKies de route die bij jou past!",
    image: "/images/p73_routes.svg"
  },
  {
    id: "p73_03",
    type: "exercise",
    heading: "Opdracht 14: Vierkanten berekenen",
    content: "Hieronder zie je drie rechthoekige driehoeken met vierkanten op hun zijden. Bekijk goed de afmetingen.",
    image: "/boekafbeeldingen/7.3.1.jpg",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "sq1",
          label: "Eerste vierkant (zijde 4 cm): oppervlakte =",
          answer: "16",
          hint: "4 × 4 = 16 cm²"
        },
        {
          id: "sq2",
          label: "Tweede vierkant (zijde 5,5 cm): oppervlakte =",
          answer: "30,25",
          hint: "5,5 × 5,5 = 30,25 cm²"
        },
        {
          id: "sq3",
          label: "Derde vierkant (zijde 7 cm): oppervlakte =",
          answer: "49",
          hint: "7 × 7 = 49 cm²"
        }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p73_04",
    type: "exercise",
    heading: "Opdracht 14b: Tabel invullen",
    content: "Vul de tabel in met de zijden en oppervlakten van de vierkanten.",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "row1_side",
          label: "4e kolom: zijde vierkant (cm)",
          answer: ["8", "8,0"],
          hint: "Kijk naar het patroon: 4, 5.5, 7..."
        },
        {
          id: "row2_area",
          label: "5e kolom: oppervlakte (cm²)",
          answer: "9",
          hint: "Dit hoort bij zijde 3"
        },
        {
          id: "row3_area",
          label: "6e kolom: oppervlakte (cm²)",
          answer: "36",
          hint: "6 × 6 = 36"
        },
        {
          id: "row4_area",
          label: "7e kolom: oppervlakte (cm²)",
          answer: "42,25",
          hint: "Dit is het kwadraat van 6,5"
        }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p73_05",
    type: "exercise",
    heading: "Opdracht 14c: Patroon ontdekken",
    content: "Vul de woorden **kwadrateren** en **worteltrekken** in op de juiste plek.",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "pattern1",
          label: "lengte zijde vierkant → _____ → oppervlakte vierkant",
          answer: "kwadrateren",
          hint: "Wat gebeurt er met 4 cm om 16 cm² te krijgen?"
        },
        {
          id: "pattern2",
          label: "oppervlakte vierkant → _____ → lengte zijde vierkant",
          answer: "worteltrekken",
          hint: "Wat gebeurt er met 16 cm² om 4 cm te krijgen?"
        }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p73_06",
    type: "theory",
    heading: "Het Pythagoras-schema gebruiken",
    content: "Met het **Pythagoras-schema** van Wouter en Annemiek kun je stap voor stap de langste zijde berekenen.\n\nVolg altijd deze volgorde:\n1. Schrijf de lengte van de rechthoekszijden op\n2. Bereken de kwadraten van de rechthoekszijden\n3. Tel de kwadraten op\n4. Trek de wortel\n5. Je hebt de langste zijde!",
    image: "/images/schemapythagoras.jpg"
  },
  {
    id: "p73_07",
    type: "exercise",
    heading: "Opdracht 15a: Schema van Wouter",
    content: "Wouter en Annemiek rekenen beide de langste zijde van △ABC uit, waarbij AC = 16 cm en AB = 30 cm.\n\nVul het schema van Wouter in.",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "w1",
          label: "Rechthoekszijde 1 = AC =",
          answer: "16",
          hint: "Dit wordt gegeven"
        },
        {
          id: "w2",
          label: "Rechthoekszijde 2 = AB =",
          answer: "30",
          hint: "Dit wordt gegeven"
        },
        {
          id: "w3",
          label: "AC² =",
          answer: "256",
          hint: "16 × 16 = 256"
        },
        {
          id: "w4",
          label: "AB² =",
          answer: "900",
          hint: "30 × 30 = 900"
        },
        {
          id: "w5",
          label: "AC² + AB² =",
          answer: "1156",
          hint: "256 + 900 = 1156"
        },
        {
          id: "w6",
          label: "BC = √1156 =",
          answer: "34",
          hint: "Welk getal keer zichzelf is 1156? → 34 × 34 = 1156"
        }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p73_08",
    type: "exercise",
    heading: "Opdracht 15b: Schema van Annemiek",
    content: "Annemiek rekent het anders uit. Vul haar schema in.",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "a1",
          label: "zijde",
          answer: ["AC", "ac"],
          hint: "Dit is de eerste rechthoekszijde"
        },
        {
          id: "a2",
          label: "kwadraaat",
          answer: "256",
          hint: "AC² = 16² = 256"
        },
        {
          id: "a3",
          label: "zijde",
          answer: ["AB", "ab"],
          hint: "Dit is de tweede rechthoekszijde"
        },
        {
          id: "a4",
          label: "kwadraaat",
          answer: "900",
          hint: "AB² = 30² = 900"
        },
        {
          id: "a5",
          label: "BC =",
          answer: "34",
          hint: "√(256 + 900) = √1156 = 34"
        }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p73_09",
    type: "exercise",
    heading: "Opdracht 15c: Vergelijk de antwoorden",
    content: "Wat valt je op? Zoek naar de overeenkomsten en verschillen tussen de twee methodes.",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "compare",
          label: "Beide krijgen dezelfde langste zijde: BC =",
          answer: "34",
          hint: "Beiden berekenen hetzelfde!"
        },
        {
          id: "diff",
          label: "Het verschil zit in de:",
          answer: ["manier van opschrijven", "opzet", "presentatie"],
          hint: "Wouter en Annemiek schrijven het anders op, maar het antwoord is hetzelfde!"
        }
      ],
      maxAttempts: 2
    }
  },
  {
    id: "p73_10",
    type: "theory",
    heading: "Aanpak: Hoe bereken je de langste zijde?",
    content: "**Stap 1**: Maak een schema en vul de linker gedeelte in\n- Schrijf de längste zijde altijd **onder**\n\n**Stap 2**: Bereken de kwadraten van de rechthoekszijden en tel ze op\n\n**Stap 3**: Bereken onder of naast het schema het antwoord\n- Rond zo nodig je antwoord af op één decimaal",
    image: "/boekafbeeldingen/7.3.2.jpg"
  },
  {
    id: "p73_11",
    type: "exercise",
    heading: "Opdracht 16: Schema bij rechthoekige driehoek GHI",
    content: "Het schema hoort bij de rechthoekige driehoek GHI. GH = 10 (de hoogte van de linkerkolom), GI = 15 (de basis).",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "gh",
          label: "GH (rechthoekszijde 1) =",
          answer: "10",
          hint: "Dit staat in de tekening gegeven"
        },
        {
          id: "gi",
          label: "GI (rechthoekszijde 2) =",
          answer: "15",
          hint: "Dit staat in de tekening gegeven"
        },
        {
          id: "gh_sq",
          label: "GH² =",
          answer: "100",
          hint: "10 × 10 = 100"
        },
        {
          id: "gi_sq",
          label: "GI² =",
          answer: "225",
          hint: "15 × 15 = 225"
        },
        {
          id: "sum",
          label: "GH² + GI² =",
          answer: "325",
          hint: "100 + 225 = 325"
        },
        {
          id: "hi",
          label: "HI = √325 ≈",
          answer: ["18", "18,0", "18,03"],
          hint: "√325 ≈ 18,03 cm (afgerond: 18,0)"
        }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p73_12",
    type: "exercise",
    heading: "Opdracht 17: Diagonaal in rechthoek",
    content: "Op een rechthoekig plein van 30 m breed en 58 m lang is over de diagonaal een lint gespannen.\n\nBereken met de stelling van Pythagoras hoeveel meter lint er nodig is.",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "breedte",
          label: "Breedte =",
          answer: "30",
          hint: "Dit staat in de opgave"
        },
        {
          id: "lengte",
          label: "Lengte =",
          answer: "58",
          hint: "Dit staat in de opgave"
        },
        {
          id: "breedte_sq",
          label: "30² =",
          answer: "900",
          hint: "30 × 30 = 900"
        },
        {
          id: "lengte_sq",
          label: "58² =",
          answer: "3364",
          hint: "58 × 58 = 3364"
        },
        {
          id: "sum2",
          label: "900 + 3364 =",
          answer: "4264",
          hint: "Tel de twee getallen bij elkaar op"
        },
        {
          id: "diag",
          label: "Diagonaal = √4264 ≈",
          answer: ["65", "65,3", "65,29"],
          hint: "√4264 ≈ 65,3 m"
        },
        {
          id: "lintlengte",
          label: "Lint nodig (m) ≈",
          answer: ["65", "65,3", "65,29"],
          hint: "De diagonaal is ongeveer 65,3 meter"
        }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p73_13",
    type: "exercise",
    heading: "Opdracht 18a: Beeldscherm",
    content: "Het beeldscherm heeft een breedte van 106 cm en een hoogte van 60 cm.\n\nMaak een schema bij △ABC.",
    image: "/boekafbeeldingen/7.3.3.jpg",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "screen_w",
          label: "AB (breedte) =",
          answer: "106",
          hint: "Dit is de onderste zijde"
        },
        {
          id: "screen_h",
          label: "AC (hoogte) =",
          answer: "60",
          hint: "Dit is de linkerzijde"
        },
        {
          id: "screen_w_sq",
          label: "AB² =",
          answer: "11236",
          hint: "106 × 106 = 11.236"
        },
        {
          id: "screen_h_sq",
          label: "AC² =",
          answer: "3600",
          hint: "60 × 60 = 3.600"
        },
        {
          id: "screen_sum",
          label: "AB² + AC² =",
          answer: "14836",
          hint: "11.236 + 3.600 = 14.836"
        }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p73_14",
    type: "exercise",
    heading: "Opdracht 18b: Diagonaal beeldscherm",
    content: "Bereken nu de diagonaal BC van het beeldscherm.",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "screen_diag",
          label: "BC = √14836 ≈",
          answer: ["122", "121,8", "121,81"],
          hint: "√14836 ≈ 121,8 cm"
        },
        {
          id: "screen_answer",
          label: "Hoe lang is de diagonaal van het beeldscherm (cm)?",
          answer: ["122", "121,8", "121,81"],
          hint: "Ongeveer 122 cm"
        }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p73_15",
    type: "exercise",
    heading: "Opdracht 19: Dakspanten",
    content: "Julian maakt voor het dak drie spanten. Van de spanten weet hij dat ze een werktekening met AB, BC, AC en CD gemaakt.\n\nEen spant bestaat uit AB, BC, AC en CD.\n\nHieronder zie je de afmetingen:\n- A tot D: 1,5 m\n- D tot B: 3 m\n- Hoogte (CD): 1 m",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "span_ad",
          label: "AD =",
          answer: "1,5",
          hint: "Dit is gegeven"
        },
        {
          id: "span_db",
          label: "DB =",
          answer: "3",
          hint: "Dit is gegeven"
        },
        {
          id: "span_cd",
          label: "CD =",
          answer: "1",
          hint: "Dit is gegeven"
        },
        {
          id: "span_ac_sq",
          label: "AC² (voor driehoek ADC) =",
          answer: "2,25",
          hint: "1,5² = 2,25"
        },
        {
          id: "span_cd_sq",
          label: "CD² =",
          answer: "1",
          hint: "1 × 1 = 1"
        },
        {
          id: "span_ac",
          label: "AC = √(2,25 + 1) =",
          answer: ["1,8", "1,80"],
          hint: "AC = √3,25 ≈ 1,80 m"
        },
        {
          id: "span_bc",
          label: "BC (voor driehoek BDC) = √(3² + 1²) =",
          answer: ["3,2", "3,16"],
          hint: "BC = √(9 + 1) = √10 ≈ 3,16 m"
        },
        {
          id: "span_total",
          label: "Totaal hout nodig voor één spant (AC + BC) ≈",
          answer: ["5", "5,0", "4,96"],
          hint: "1,80 + 3,16 ≈ 5,0 m"
        }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p73_16",
    type: "exercise",
    heading: "Opdracht 19b: Drie spanten",
    content: "Julian moet minimaal veel meter hout voor drie spanten hebben. Hoeveel meter hout is dat in totaal?",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "span_hout_per",
          label: "Hout per spant ≈",
          answer: ["5", "5,0"],
          hint: "Dit hebben we net berekend"
        },
        {
          id: "span_hout_totaal",
          label: "Hout voor drie spanten ≈",
          answer: ["15", "15,0"],
          hint: "5,0 × 3 = 15,0 m"
        }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p73_17",
    type: "exercise",
    heading: "Opdracht 19c: Hoeveel meer hout?",
    content: "Maar er is meer hout nodig voor drie spanten. Waarom mag Julian dit doen?",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "span_reden",
          label: "Waarom mag Julian dit doen?",
          answer: ["afval", "spaanders", "restjes", "snijverlies"],
          hint: "Bij het zagen ontstaat er verlies door..."
        }
      ],
      maxAttempts: 2
    }
  },
  {
    id: "p73_18",
    type: "exercise",
    heading: "Opdracht 20: Driehoek PQR",
    content: "Bereken in △PQR de lengte van zijde PQ.",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "pq_pr",
          label: "PR (rechthoekszijde 1) =",
          answer: "11",
          hint: "Dit staat in de tekening"
        },
        {
          id: "pq_qr",
          label: "QR (rechthoekszijde 2) =",
          answer: "60",
          hint: "Dit staat in de tekening"
        },
        {
          id: "pq_pr_sq",
          label: "PR² =",
          answer: "121",
          hint: "11 × 11 = 121"
        },
        {
          id: "pq_qr_sq",
          label: "QR² =",
          answer: "3600",
          hint: "60 × 60 = 3600"
        },
        {
          id: "pq_sum",
          label: "PR² + QR² =",
          answer: "3721",
          hint: "121 + 3600 = 3721"
        },
        {
          id: "pq_pq",
          label: "PQ = √3721 =",
          answer: "61",
          hint: "61 × 61 = 3721"
        }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p73_19",
    type: "theory",
    heading: "Leerdoelen bereikt?",
    content: "**Checkup:** Kun je nu:\n✔️ Het Pythagoras-schema gebruiken?\n✔️ De langste zijde berekenen?\n✔️ Met wortels werken?\n\nAls je op ja antwoord, ben je klaar voor de volgende paragraaf!\n\nZo niet? Maak dan extra oefeningen of vraag om hulp.",
    image: "/images/p73_done.svg"
  },
  {
    id: "p73_20",
    type: "exercise",
    heading: "Leerdoelen bereikt: Driehoek DEF",
    content: "Bereken van △DEF de lengte van zijde DF.\n\nGegeven: DE = 24 cm, EF = 10 cm",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "def_de",
          label: "DE (rechthoekszijde) =",
          answer: "24",
          hint: "Dit is gegeven"
        },
        {
          id: "def_ef",
          label: "EF (rechthoekszijde) =",
          answer: "10",
          hint: "Dit is gegeven"
        },
        {
          id: "def_de_sq",
          label: "DE² =",
          answer: "576",
          hint: "24 × 24 = 576"
        },
        {
          id: "def_ef_sq",
          label: "EF² =",
          answer: "100",
          hint: "10 × 10 = 100"
        },
        {
          id: "def_sum",
          label: "DE² + EF² =",
          answer: "676",
          hint: "576 + 100 = 676"
        },
        {
          id: "def_df",
          label: "DF = √676 =",
          answer: "26",
          hint: "26 × 26 = 676"
        }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p73_21",
    type: "summary",
    heading: "Klaar met 7.3!",
    content: "Je hebt nu:\n✔️ De lengte van de langste zijde berekend in verschillende situaties\n✔️ Het Pythagoras-schema gebruikt\n✔️ Met wortels en kwadraten gewerkt\n\nJe bent nu klaar voor paragraaf 7.4!",
    image: "/images/p73_done.svg"
  },
  // Evaluation questions section
  {
    id: "p73_eval_intro",
    type: "theory",
    heading: "📋 Evaluatie",
    content: "Je hebt veel geleerd! Laten we checken of je het begrepen hebt.\n\nBeantwoord de volgende 4 vragen. Je hebt per vraag één poging. Succes!"
  },
  {
    id: "p73_eval_01",
    type: "evaluation",
    heading: "Evaluatievraag 1",
    content: "Driehoek PQR heeft rechthoekszijdes PQ = 9 cm en QR = 12 cm.\nVul het Pythagoras-schema in om PR te berekenen.",
    questionNumber: 1,
    totalQuestions: 4,
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "eval01_pq2",
          label: "PQ² =",
          answer: ["81"],
          hint: "9 × 9 = 81"
        },
        {
          id: "eval01_qr2",
          label: "QR² =",
          answer: ["144"],
          hint: "12 × 12 = 144"
        },
        {
          id: "eval01_sum",
          label: "PQ² + QR² =",
          answer: ["225"],
          hint: "81 + 144 = 225"
        },
        {
          id: "eval01_pr",
          label: "PR = √225 =",
          answer: ["15", "15,0"],
          hint: "15 × 15 = 225"
        }
      ]
    }
  },
  {
    id: "p73_eval_02",
    type: "evaluation",
    heading: "Evaluatievraag 2",
    content: "Driehoek DEF heeft rechthoekszijdes DE = 5 cm en EF = 12 cm.\nVul het schema in om DF te berekenen.",
    questionNumber: 2,
    totalQuestions: 4,
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "eval02_de2",
          label: "DE² =",
          answer: ["25"],
          hint: "5 × 5 = 25"
        },
        {
          id: "eval02_ef2",
          label: "EF² =",
          answer: ["144"],
          hint: "12 × 12 = 144"
        },
        {
          id: "eval02_sum",
          label: "DE² + EF² =",
          answer: ["169"],
          hint: "25 + 144 = 169"
        },
        {
          id: "eval02_df",
          label: "DF = √169 =",
          answer: ["13", "13,0"],
          hint: "13 × 13 = 169"
        }
      ]
    }
  },
  {
    id: "p73_eval_03",
    type: "evaluation",
    heading: "Evaluatievraag 3",
    content: "Een rechthoek is 6 m lang en 8 m breed.\nGebruik het Pythagoras-schema om de diagonaal te berekenen.",
    questionNumber: 3,
    totalQuestions: 4,
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "eval03_a2",
          label: "6² =",
          answer: ["36"],
          hint: "6 × 6 = 36"
        },
        {
          id: "eval03_b2",
          label: "8² =",
          answer: ["64"],
          hint: "8 × 8 = 64"
        },
        {
          id: "eval03_sum",
          label: "6² + 8² =",
          answer: ["100"],
          hint: "36 + 64 = 100"
        },
        {
          id: "eval03_diag",
          label: "Diagonaal = √100 =",
          answer: ["10", "10,0"],
          hint: "10 × 10 = 100"
        }
      ]
    }
  },
  {
    id: "p73_eval_04",
    type: "evaluation",
    heading: "Evaluatievraag 4",
    content: "Driehoek ABC heeft rechthoekszijdes AB = 20 cm en BC = 21 cm.\nBereken de langste zijde AC via het schema.",
    questionNumber: 4,
    totalQuestions: 4,
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "eval04_ab2",
          label: "AB² =",
          answer: ["400"],
          hint: "20 × 20 = 400"
        },
        {
          id: "eval04_bc2",
          label: "BC² =",
          answer: ["441"],
          hint: "21 × 21 = 441"
        },
        {
          id: "eval04_sum",
          label: "AB² + BC² =",
          answer: ["841"],
          hint: "400 + 441 = 841"
        },
        {
          id: "eval04_ac",
          label: "AC = √841 =",
          answer: ["29", "29,0"],
          hint: "29 × 29 = 841"
        }
      ]
    }
  },
  {
    id: "p73_eval_summary",
    type: "evaluation_summary",
    heading: "Jouw evaluatieresultaat",
    content: "Hieronder zie je je totaalscore voor de evaluatievragen."
  }
];
