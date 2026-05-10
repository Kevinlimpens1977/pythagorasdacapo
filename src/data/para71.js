export const para71Slides = [
  {
    id: "p71_presentation",
    type: "presentation",
    heading: "7.1 Rechthoekige driehoeken",
    subtitle: "Hoe je rechthoekszijden en langste zijde herkent",
    pdfPath: "/boekafbeeldingen/7.1-slidedeck.pdf",
    totalPages: 12,
    duration: "15-20 minuten",
    notes: "Gegenereerd via NotebookLM op 2026-05-10"
  },
  {
    id: "p71_01_intro",
    type: "theory",
    heading: "7.1 Rechthoekige driehoeken",
    content: "**Leerdoel:**\n\nJe leert:\n- Wat de rechthoekszijden en de langste zijde in een rechthoekige driehoek zijn\n- Hoe je hoekpunten aangeeft (met HOOFDLETTERS: A, B, C)\n- Hoe je zijden aangeeft (met 2 letters: AB, BC, AC - alfabetisch!)"
  },
  {
    id: "p71_theory_01",
    type: "theory",
    heading: "Wat is een rechthoekige driehoek?",
    content: "Een rechthoekige driehoek is een driehoek met één hoek van 90°.\n\nDie rechte hoek herken je aan het **vierkantje** in de hoek.\n\nHoekpunten geef je aan met **HOOFDLETTERS**.\nZijden geef je aan met **2 letters** (alfabetisch: AB niet BA)."
  },
  {
    id: "p71_theory_02",
    type: "theory",
    heading: "Rechthoekszijden en langste zijde",
    content: "**Rechthoekszijden** = de twee zijden die aan de rechte hoek (90°) liggen\n\n**Langste zijde** = de zijde tegenover de rechte hoek"
  },
  {
    id: "p71_q01",
    type: "exercise",
    heading: "Opdracht 1: Geodriehoek herkennen",
    content: "Een geodriehoek is een voorbeeld van een rechthoekige driehoek.",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q1_1",
          label: "Welke hoek is 90°?",
          answer: ["de rechts", "rechts", "rechtse"],
          hint: "Kijk naar de hoeken"
        },
        {
          id: "q1_2",
          label: "Hoe heten de zijden bij de rechte hoek?",
          answer: ["rechthoekszijden"],
          hint: "Deze zijden liggen aan de rechte hoek"
        }
      ]
    }
  },
  {
    id: "p71_q02",
    type: "exercise",
    heading: "Opdracht 2: Twee driehoeken",
    content: "Identificeer welke hoeken recht zijn.",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q2_1",
          label: "Eerste driehoek: welke hoek is recht?",
          answer: ["A"],
          hint: "Let op het vierkantje"
        },
        {
          id: "q2_2",
          label: "Tweede driehoek: welke hoek is recht?",
          answer: ["E"],
          hint: "Let op het vierkantje"
        }
      ]
    }
  },
  {
    id: "p71_q03",
    type: "exercise",
    heading: "Opdracht 3: Driehoek KLM",
    content: "Driehoek KLM met rechte hoek.",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q3_1",
          label: "Welke hoek is recht?",
          answer: ["K"],
          hint: "Zoek het vierkantje"
        },
        {
          id: "q3_2",
          label: "Rechthoekszijden (alfabetisch!)",
          answer: ["KL en KM"],
          hint: "Bij hoek K"
        },
        {
          id: "q3_3",
          label: "Langste zijde",
          answer: ["LM"],
          hint: "Tegenover hoek K"
        }
      ]
    }
  },
  {
    id: "p71_q04",
    type: "exercise",
    heading: "Opdracht 4: Rechthoek met diagonaal",
    content: "Rechthoek EFGH met diagonaal FH.",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q4_1",
          label: "Driehoek EFH: langste zijde?",
          answer: ["FH"],
          hint: "De diagonaal"
        },
        {
          id: "q4_2",
          label: "Driehoek EFH: rechthoekszijden?",
          answer: ["EF en EH"],
          hint: "Van de rechthoek"
        }
      ]
    }
  },
  {
    id: "p71_q05",
    type: "exercise",
    heading: "Opdracht 5: Rechthoekige driehoeken herkennen",
    content: "Welke driehoeken in de figuur zijn rechthoekig?",
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "q5_1",
          label: "Hoeveel rechthoekige driehoeken zie je?",
          answer: ["3", "drie"],
          hint: "Tel alle met vierkantjes"
        }
      ]
    }
  },
  {
    id: "p71_summary",
    type: "summary",
    heading: "Samenvatting",
    content: "✓ Rechthoekige driehoek = 90° hoek\n✓ Hoekpunten = HOOFDLETTERS\n✓ Zijden = 2 letters ALFABETISCH (AB niet BA)\n✓ Rechthoekszijden = bij 90° hoek\n✓ Langste zijde = tegenover 90° hoek"
  },
  {
    id: "p71_eval_intro",
    type: "theory",
    heading: "Evaluatievragen",
    content: "Goed gedaan! Nu testen we wat je hebt geleerd."
  },
  {
    id: "p71_eval_01",
    type: "evaluation",
    heading: "Evaluatievraag 1",
    content: "Driehoek ABC: hoek B = 90°, AB = 6 cm, BC = 8 cm",
    questionNumber: 1,
    totalQuestions: 4,
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "e1_1",
          label: "Rechthoekszijden (alfabetisch)?",
          answer: ["AB en BC"],
          hint: "Bij hoek B"
        },
        {
          id: "e1_2",
          label: "Langste zijde?",
          answer: ["AC"],
          hint: "Tegenover hoek B"
        }
      ]
    }
  },
  {
    id: "p71_eval_02",
    type: "evaluation",
    heading: "Evaluatievraag 2",
    content: "Rechthoek DEFG: diagonaal EG",
    questionNumber: 2,
    totalQuestions: 4,
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "e2_1",
          label: "DEG: hoek recht bij?",
          answer: ["D"],
          hint: "Rechthoek hoek"
        },
        {
          id: "e2_2",
          label: "Langste zijde beide driehoeken?",
          answer: ["EG"],
          hint: "Diagonaal"
        }
      ]
    }
  },
  {
    id: "p71_eval_03",
    type: "evaluation",
    heading: "Evaluatievraag 3",
    content: "Driehoek KLM: hoek L = 90°, KL = 9 cm, LM = 12 cm",
    questionNumber: 3,
    totalQuestions: 4,
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "e3_1",
          label: "Zijde 1 (alfabetisch)?",
          answer: ["KL"],
          hint: "K voor L"
        },
        {
          id: "e3_2",
          label: "Zijde 2 (alfabetisch)?",
          answer: ["LM"],
          hint: "L voor M"
        },
        {
          id: "e3_3",
          label: "Langste zijde?",
          answer: ["KM"],
          hint: "Tegenover L"
        }
      ]
    }
  },
  {
    id: "p71_eval_04",
    type: "evaluation",
    heading: "Evaluatievraag 4",
    content: "Driehoek PQR: hoek R = 90°, PR = 5 cm, QR = 12 cm",
    questionNumber: 4,
    totalQuestions: 4,
    exercise: {
      type: "multi_input",
      fields: [
        {
          id: "e4_1",
          label: "Rechthoekszijde 1?",
          answer: ["PR"],
          hint: "5 cm"
        },
        {
          id: "e4_2",
          label: "Rechthoekszijde 2?",
          answer: ["QR"],
          hint: "12 cm"
        },
        {
          id: "e4_3",
          label: "Langste zijde?",
          answer: ["PQ"],
          hint: "Tegenover R"
        }
      ]
    }
  },
  {
    id: "p71_eval_summary",
    type: "evaluation_summary",
    heading: "Jouw evaluatieresultaat",
    content: "Goed gedaan!"
  }
];
