export const para73Slides = [
  // Presentation (optional, can be PDF viewer)
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

  // Introduction & Learning Goals
  {
    id: "p73_01_intro",
    type: "theory",
    heading: "7.3 Langste zijde berekenen",
    content: "**Leerdoel:**\n\nJe leert hoe je de lengte van de **langste zijde** van een rechthoekige driehoek berekent.\n\nIn deze paragraaf gebruiken we de **stelling van Pythagoras** om de onbekende zijde te vinden.\n\nEr zijn drie verschillende leerroutes beschikbaar:\n- **Ondersteunend**: Stap voor stap met veel hulp\n- **Doorlopend**: Zelfstandig met hints\n- **Uitdagend**: Zelfstandig zonder hints"
  },

  // Question 14a: Calculate square areas
  {
    id: "p73_14a",
    type: "exercise",
    heading: "Opdracht 14a: Vierkanten berekenen",
    content: "Bereken de oppervlakte van de drie vierkanten. De zijden zijn gegeven als 4 cm, 5,5 cm en 7 cm.",
    image: "/boekafbeeldingen/cropped/q14_squares.jpg",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q14a_1",
          label: "Oppervlakte van het vierkant met zijde 4 cm =",
          answer: ["16", "16,0"],
          hint: "4 × 4 = 16 cm²"
        },
        {
          id: "q14a_2",
          label: "Oppervlakte van het vierkant met zijde 5,5 cm =",
          answer: ["30,25"],
          hint: "5,5 × 5,5 = 30,25 cm²"
        },
        {
          id: "q14a_3",
          label: "Oppervlakte van het vierkant met zijde 7 cm =",
          answer: ["49", "49,0"],
          hint: "7 × 7 = 49 cm²"
        }
      ]
    }
  },

  // Question 14b: Fill table
  {
    id: "p73_14b",
    type: "exercise",
    heading: "Opdracht 14b: Tabel invullen",
    content: "Vul de tabel in met de zijden en oppervlakten van de vierkanten.",
    image: "/boekafbeeldingen/cropped/q14b_table.jpg",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q14b_1",
          label: "Zijde van het 4e vierkant (cm)",
          answer: ["8", "8,0"],
          hint: "Kijk naar het patroon: 4, 5.5, 7, ..."
        },
        {
          id: "q14b_2",
          label: "Oppervlakte van het 5e vierkant (cm²)",
          answer: ["9", "9,0"],
          hint: "Dit hoort bij zijde 3"
        },
        {
          id: "q14b_3",
          label: "Oppervlakte van het 6e vierkant (cm²)",
          answer: ["36", "36,0"],
          hint: "6 × 6 = 36"
        },
        {
          id: "q14b_4",
          label: "Oppervlakte van het 7e vierkant (cm²)",
          answer: ["42,25"],
          hint: "Dit is het kwadraat van 6,5"
        }
      ]
    }
  },

  // Question 14c: Fill words
  {
    id: "p73_14c",
    type: "exercise",
    heading: "Opdracht 14c: Woorden invullen",
    content: "Vul de woorden **kwadrateren** en **worteltrekken** op de juiste plaats in.",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q14c_1",
          label: "lengste zijde vierkant → oppervlakte vierkant",
          answer: ["kwadrateren"],
          hint: "Van zijde naar oppervlakte: vermenigvuldigen met zichzelf"
        },
        {
          id: "q14c_2",
          label: "oppervlakte vierkant → lengste zijde vierkant",
          answer: ["worteltrekken"],
          hint: "Van oppervlakte terug naar zijde"
        }
      ]
    }
  },

  // Question 15a: Wouter's schema
  {
    id: "p73_15a",
    type: "exercise",
    heading: "Opdracht 15a: Schema van Wouter",
    content: "Wouter en Annemiek rekenen beide de lengte van AC uit. Vul het schema van Wouter in.\n\nGegeven: AC = 16 cm, AB = 30 cm",
    image: "/boekafbeeldingen/cropped/q15_wouter_schema.jpg",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q15a_1",
          label: "Lengste zijde in cm",
          answer: ["AC"],
          hint: "Welke zijde is het langst?"
        },
        {
          id: "q15a_2",
          label: "AC² =",
          answer: ["256"],
          hint: "16 × 16 = 256"
        },
        {
          id: "q15a_3",
          label: "AB² =",
          answer: ["900"],
          hint: "30 × 30 = 900"
        },
        {
          id: "q15a_4",
          label: "BC² = AC² - AB² = (fout!)",
          answer: ["644", "-644"],
          hint: "Dit werkt niet! AC is niet de langste zijde"
        }
      ]
    }
  },

  // Question 15b: Annemiek's schema
  {
    id: "p73_15b",
    type: "exercise",
    heading: "Opdracht 15b: Schema van Annemiek",
    content: "Annemiek vult het Pythagoras-schema juist in. Volg haar stappen.\n\nGegeven: AC = 16 cm, AB = 30 cm",
    image: "/boekafbeeldingen/cropped/q15_annemiek_schema.jpg",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q15b_zijde_1",
          label: "1. Lengste zijde = ",
          answer: ["AB"],
          hint: "30 cm is langer dan 16 cm"
        },
        {
          id: "q15b_kwad_1",
          label: "2a. AC² =",
          answer: ["256"],
          hint: "16 × 16 = 256"
        },
        {
          id: "q15b_kwad_2",
          label: "2b. AC² + BC² =",
          answer: ["900"],
          hint: "Dit moet AB² zijn: 30 × 30 = 900"
        },
        {
          id: "q15b_bc",
          label: "3. BC² = 900 - 256 = ",
          answer: ["644"],
          hint: "900 - 256 = 644"
        },
        {
          id: "q15b_bc_final",
          label: "BC = √644 ≈",
          answer: ["25,4", "25.4"],
          hint: "√644 ≈ 25,4"
        }
      ]
    }
  },

  // Question 15c/d: Compare answers
  {
    id: "p73_15cd",
    type: "exercise",
    heading: "Opdracht 15c en 15d: Vergelijken",
    content: "**Vraag c:** Waarom mag Annemiek het schema op deze manier gebruiken?\n\n**Vraag d:** Wat ging er fout bij Wouter en wat ging goed bij Annemiek?",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q15c",
          label: "Waarom mag je het schema gebruiken?",
          answer: ["pythagoras", "stelling", "schema"],
          hint: "Het is gebaseerd op de stelling van..."
        },
        {
          id: "q15d",
          label: "Wat was Wouter's fout?",
          answer: ["langste", "AB", "AC"],
          hint: "Wouter zette de langste zijde niet onderin"
        }
      ]
    }
  },

  // Theory: Aanpak - How to calculate with Pythagoras
  {
    id: "p73_theory_aanpak",
    type: "theory",
    heading: "Aanpak: Hoe bereken je de langste zijde?",
    content: "**Stap 1:** Maak een schema en vul het **linker gedeelte** in.\n- Schrijf de **langste zijde altijd onderaan**.\n- Schrijf de andere zijden erboven.\n\n**Stap 2:** Bereken de **kwadraten** van de rechthoekszijden en tel ze op.\n\n**Stap 3:** Bereken de **lengte van de langste zijde**.\n- Schrijf onder of naast het schema het antwoord.\n- Rond zo nodig je antwoord af op één decimaal.\n\n**Voorbeeld:**\n\nGegeven: AB = 5 cm, BC = 3 cm, langste zijde = AC\n\nIn het schema:\n```\nzijde    | kwadraat\nAB = 5   | 25\nBC = 3   | 9    +\nAC = ?   | 34\n```\n\nAC = √34 ≈ 5,8 cm"
  },

  // Question 16: Triangle GHI schema
  {
    id: "p73_16",
    type: "exercise",
    heading: "Opdracht 16: Schema voor driehoek GHI",
    content: "Pas de aanpak toe op driehoek GHI. Rechthoekszijdes zijn GH = 15 en GI = 10.",
    image: "/boekafbeeldingen/cropped/q16_triangle_ghi.jpg",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q16_gh2",
          label: "GH² =",
          answer: ["225"],
          hint: "15 × 15 = 225"
        },
        {
          id: "q16_gi2",
          label: "GI² =",
          answer: ["100"],
          hint: "10 × 10 = 100"
        },
        {
          id: "q16_sum",
          label: "GH² + GI² =",
          answer: ["325"],
          hint: "225 + 100 = 325"
        },
        {
          id: "q16_hi",
          label: "HI = √325 ≈",
          answer: ["18", "18,0", "18,03"],
          hint: "√325 ≈ 18"
        }
      ]
    }
  },

  // Question 17: Rectangle diagonal
  {
    id: "p73_17",
    type: "exercise",
    heading: "Opdracht 17: Diagonaal rechthoek",
    content: "Op een rechthoekig plein van 30 m breed en 58 m lang is over de diagonaal een lint gespannen. Bereken met de stelling van Pythagoras hoeveel meter lint daar nodig is.",
    image: "/boekafbeeldingen/cropped/q17_rectangle.jpg",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q17_a2",
          label: "30² =",
          answer: ["900"],
          hint: "30 × 30 = 900"
        },
        {
          id: "q17_b2",
          label: "58² =",
          answer: ["3364"],
          hint: "58 × 58 = 3364"
        },
        {
          id: "q17_sum",
          label: "30² + 58² =",
          answer: ["4264"],
          hint: "900 + 3364 = 4264"
        },
        {
          id: "q17_diag",
          label: "Diagonaal = √4264 ≈",
          answer: ["65", "65,3", "65,30"],
          hint: "√4264 ≈ 65,3 m"
        }
      ]
    }
  },

  // Question 18: Billard table
  {
    id: "p73_18",
    type: "exercise",
    heading: "Opdracht 18: Billardtafel",
    content: "Een billardtafel heeft een breedte van 106 cm en een hoogte van 60 cm. Je berekent de lengte van de diagonaal.\n\na. Maak een schema bij △ABC\nb. Bereken de lengte van de langste zijde\nc. Hoe lang is de diagonaal van de billardtafel?",
    image: "/boekafbeeldingen/cropped/q18_billard_diagram.jpg",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q18_a2",
          label: "106² =",
          answer: ["11236"],
          hint: "106 × 106 = 11236"
        },
        {
          id: "q18_b2",
          label: "60² =",
          answer: ["3600"],
          hint: "60 × 60 = 3600"
        },
        {
          id: "q18_sum",
          label: "106² + 60² =",
          answer: ["14836"],
          hint: "11236 + 3600 = 14836"
        },
        {
          id: "q18_diag",
          label: "Diagonaal = √14836 ≈",
          answer: ["122", "121,8", "121,80"],
          hint: "√14836 ≈ 121,8 cm"
        }
      ]
    }
  },

  // Question 19a: Roof beams - AC
  {
    id: "p73_19a",
    type: "exercise",
    heading: "Opdracht 19a: Dakhout - Zijde AC",
    content: "Julian moet voor het dak drie spanten maken. Een spant bestaat uit AB, BC, AC en CD.\n\nGegeven: AD = 1,5 m, DB = 3 m, CD = 1 m\n\nBereken eerst de lengte van zijde AC.",
    image: "/boekafbeeldingen/cropped/q19_roof_photo.jpg",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q19a_ad2",
          label: "AD² =",
          answer: ["2.25", "2,25"],
          hint: "1,5 × 1,5 = 2,25"
        },
        {
          id: "q19a_cd2",
          label: "CD² =",
          answer: ["1", "1,0"],
          hint: "1 × 1 = 1"
        },
        {
          id: "q19a_sum",
          label: "AD² + CD² =",
          answer: ["3.25", "3,25"],
          hint: "2,25 + 1 = 3,25"
        },
        {
          id: "q19a_ac",
          label: "AC = √3,25 ≈",
          answer: ["1.8", "1,8", "1,80"],
          hint: "√3,25 ≈ 1,8 m"
        }
      ]
    }
  },

  // Question 19b: Roof beams - BC
  {
    id: "p73_19b",
    type: "exercise",
    heading: "Opdracht 19b: Dakhout - Zijde BC",
    content: "Bereken nu de lengte van zijde BC voor driehoek BDC.\n\nGegeven: BD = 3 m, CD = 1 m",
    image: "/boekafbeeldingen/cropped/q19_roof_diagram.jpg",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q19b_bd2",
          label: "BD² =",
          answer: ["9", "9,0"],
          hint: "3 × 3 = 9"
        },
        {
          id: "q19b_cd2",
          label: "CD² =",
          answer: ["1", "1,0"],
          hint: "1 × 1 = 1"
        },
        {
          id: "q19b_sum",
          label: "BD² + CD² =",
          answer: ["10", "10,0"],
          hint: "9 + 1 = 10"
        },
        {
          id: "q19b_bc",
          label: "BC = √10 ≈",
          answer: ["3.16", "3,16"],
          hint: "√10 ≈ 3,16 m"
        }
      ]
    }
  },

  // Question 19c: Total wood
  {
    id: "p73_19c",
    type: "exercise",
    heading: "Opdracht 19c: Totaal dakhout",
    content: "Een spant bestaat uit: AB, BC (≈3,16 m), AC (≈1,8 m), en CD (1 m).\n\nJulian berekent dat hij voor één spant ongeveer 5 m hout nodig heeft (met enig afval van zaagwerk).\n\nHoeveel meter hout is nodig voor drie spanten?",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q19c_per_spant",
          label: "Hout per spant ≈",
          answer: ["5", "5.0", "5,0"],
          hint: "Dit hebben we berekend"
        },
        {
          id: "q19c_total",
          label: "Hout voor drie spanten ≈",
          answer: ["15", "15.0", "15,0"],
          hint: "5 × 3 = 15 m"
        }
      ]
    }
  },

  // Question 20: Triangle PQR
  {
    id: "p73_20",
    type: "exercise",
    heading: "Opdracht 20: Driehoek PQR",
    content: "Bereken de lengte van zijde PQ in driehoek PQR.\n\nGegeven: PR = 11 cm, QR = 60 cm",
    image: "/boekafbeeldingen/cropped/q20_triangle_pqr.jpg",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q20_pr2",
          label: "PR² =",
          answer: ["121"],
          hint: "11 × 11 = 121"
        },
        {
          id: "q20_qr2",
          label: "QR² =",
          answer: ["3600"],
          hint: "60 × 60 = 3600"
        },
        {
          id: "q20_sum",
          label: "PR² + QR² =",
          answer: ["3721"],
          hint: "121 + 3600 = 3721"
        },
        {
          id: "q20_pq",
          label: "PQ = √3721 =",
          answer: ["61", "61.0", "61,0"],
          hint: "61 × 61 = 3721"
        }
      ]
    }
  },

  // Theory: Learning objectives - recap
  {
    id: "p73_leerdoelen",
    type: "theory",
    heading: "Leerdoelen bereikt?",
    content: "**Checkup:** Kun je nu:\n✔️ Het Pythagoras-schema gebruiken?\n✔️ De langste zijde berekenen met de stelling van Pythagoras?\n✔️ Met wortels werken?\n✔️ De stelling toepassen op echte situaties?\n\n**Test jezelf:** Bereken de lengte van zijde DF in driehoek DEF.",
    image: "/boekafbeeldingen/cropped/leerdoelen_triangle_def.jpg"
  },

  // Final check: Calculate DF
  {
    id: "p73_21_final",
    type: "exercise",
    heading: "Leerdoelen check: Driehoek DEF",
    content: "Bereken van △DEF de lengte van zijde DF.\n\nGegeven: DE = 24 cm, EF = 10 cm",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q21_de2",
          label: "DE² =",
          answer: ["576"],
          hint: "24 × 24 = 576"
        },
        {
          id: "q21_ef2",
          label: "EF² =",
          answer: ["100"],
          hint: "10 × 10 = 100"
        },
        {
          id: "q21_sum",
          label: "DE² + EF² =",
          answer: ["676"],
          hint: "576 + 100 = 676"
        },
        {
          id: "q21_df",
          label: "DF = √676 =",
          answer: ["26", "26.0", "26,0"],
          hint: "26 × 26 = 676"
        }
      ]
    }
  },

  // Summary
  {
    id: "p73_summary",
    type: "summary",
    heading: "Samenvatting",
    content: "**Wat heb je geleerd?**\n\n**De stelling van Pythagoras** zegt dat in een rechthoekige driehoek geldt:\n\n**langste zijde² = rechthoekszijde 1² + rechthoekszijde 2²**\n\n**Het Pythagoras-schema** helpt je om stap voor stap te werken:\n1. Maak het schema en schrijf de gegeven zijden op\n2. Bereken de kwadraten\n3. Tel ze op of trek af\n4. Trek de wortels om de langste zijde te vinden\n\nDeze stelling kun je toepassen op:\n- Driehoeken\n- Rechthoeken (diagonalen)\n- Echte situaties (daken, tafels, enz.)"
  },

  // Evaluation intro
  {
    id: "p73_eval_intro",
    type: "theory",
    heading: "Evaluatievragen",
    content: "Je bent klaar met de theorie en oefeningen! Nu gaan we checken wat je hebt geleerd.\n\nMaak de volgende evaluatievragen. Je mag je aantekeningen gebruiken en mag zoveel pogingen doen als je nodig hebt.\n\nSucces! 💪"
  },

  // Evaluation questions
  {
    id: "p73_eval_01",
    type: "evaluation",
    heading: "Evaluatievraag 1",
    content: "Driehoek PQR heeft rechthoekszijdes PQ = 9 cm en QR = 12 cm.\nBereken de langste zijde PR met het Pythagoras-schema.",
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
          answer: ["15", "15.0", "15,0"],
          hint: "15 × 15 = 225"
        }
      ]
    }
  },

  {
    id: "p73_eval_02",
    type: "evaluation",
    heading: "Evaluatievraag 2",
    content: "Vul het Pythagoras-schema in voor driehoek DEF met DE = 5 cm, EF = 12 cm.",
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
          answer: ["13", "13.0", "13,0"],
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
          answer: ["10", "10.0", "10,0"],
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
          answer: ["29", "29.0", "29,0"],
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
