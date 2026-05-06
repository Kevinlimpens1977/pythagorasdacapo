export const para72Slides = [
  {
    id: "p72_01",
    type: "theory",
    heading: "7.2 Het Pythagoras-schema",
    content: "**Leerdoel:**\nJe leert dat in een rechthoekige driehoek een bijzonder verband bestaat tussen de zijden.\n\nDit verband heet de **stelling van Pythagoras**. Dit is één van de beroemdste formules in de wiskunde!",
    image: "/images/p72_intro.svg"
  },
  {
    id: "p72_02",
    type: "theory",
    heading: "De stelling ontdekken",
    content: "In deze paragraaf gaan we samen de stelling van Pythagoras **ontdekken** door zelf te meten en te berekenen.\n\nJe gaat stap voor stap een rechthoekige driehoek tekenen met AB = 3 cm en AC = 4 cm, dan BC opmeten, en kijken wat het verband is.",
    image: "/images/p72_teaser.svg"
  },
  {
    id: "p72_03",
    type: "exercise",
    heading: "Stelling van Pythagoras Bewijzen",
    content: "Volg de stappen op het scherm. Je hebt nodig: ruitjespapier, lineaal en potlood.",
    exercise: {
      type: "pythagoras_proof",
      steps: [
        {
          id: "step1_draw_ab",
          type: "instruction",
          heading: "Stap 1: Teken zijde AB",
          instruction: "Teken op ruitjespapier een **horizontale** lijn van **exact 3 cm**.\nLet op: dit moet op de millimeter nauwkeurig zijn!\n\nLabel het begin van de lijn als **A** en het einde als **B**.\n\nDruk OK wanneer je klaar bent.",
          image: "/images/p72_step1.svg"
        },
        {
          id: "step2_draw_ac",
          type: "instruction",
          heading: "Stap 2: Teken zijde AC",
          instruction: "Teken vanuit punt **A** een **verticale** lijn van **exact 4 cm** omhoog (90 graden).\nZorg dat dit ook op de millimeter nauwkeurig is!\n\nLabel het einde van deze lijn als **C**.\n\nDruk OK wanneer je klaar bent.",
          image: "/images/p72_step2.svg"
        },
        {
          id: "step3_measure_bc",
          type: "input",
          heading: "Stap 3: Meet BC",
          instruction: "Teken nu een **recht lijnstuk** van **B** naar **C**.\n\nMeet dit lijnstuk **nauwkeurig** met je lineaal en vul de lengte in (in cm, bijvoorbeeld 5.0):",
          inputLabel: "Lengte BC (cm):",
          answer: "5", // Theoretical value is √(3² + 4²) = √25 = 5
          tolerance: 0.2, // Accept answers within ±0.2 cm
          hint: "Meet voorzichtig! BC zou precies 5 cm moeten zijn."
        },
        {
          id: "step4_squares",
          type: "instruction",
          heading: "Stap 4: Kwadraten van de zijden",
          instruction: "Zet nu bij elke zijde het **kwadraat** van de lengte:\n\n• **AB² = 3² = 9**\n• **AC² = 4² = 16**\n• **BC² = ?** (dit gaan we berekenen)\n\nDruk OK wanneer je dit hebt opgeschreven.",
          image: "/images/p72_step4.svg"
        },
        {
          id: "step5_add",
          type: "input",
          heading: "Stap 5: Tel op!",
          instruction: "Tel de kwadraten van **AB** en **AC** bij elkaar op:\n\n**AB² + AC² = 9 + 16 = ?**",
          inputLabel: "AB² + AC² =",
          answer: "25",
          hint: "9 + 16 = ?"
        },
        {
          id: "step6_compare",
          type: "instruction",
          heading: "Stap 6: Vergelijk!",
          instruction: "Kijk eens naar je antwoorden!\n\n• Je gemeten BC was **5 cm**\n• BC² zou dus zijn: **5² = 25**\n• En AB² + AC² = **25**\n\n**Ze zijn gelijk!** Dit is de stelling van Pythagoras! 🎉",
          image: "/images/p72_step6.svg"
        }
      ]
    }
  },
  {
    id: "p72_04",
    type: "theory",
    heading: "Het Pythagoras-schema",
    content: "Met het **Pythagoras-schema** kun je makkelijk zien hoe de zijden en hun kwadraten met elkaar samenhangen.",
    image: "/images/schemapythagoras.jpg"
  },
  {
    id: "p72_05",
    type: "exercise",
    heading: "Oefenen: Pas het toe",
    content: "In driehoek ABC is ∠A = 90°, AB = 5 cm en AC = 12 cm.\n\nGebruik de stelling van Pythagoras: a² + b² = c²",
    exercise: {
      type: "multi_input",
      fields: [
        { id: "ab_sq", label: "AB² =", answer: "25", hint: "5 × 5 = ?" },
        { id: "ac_sq", label: "AC² =", answer: "144", hint: "12 × 12 = ?" },
        { id: "sum", label: "AB² + AC² =", answer: "169", hint: "25 + 144 = ?" },
        { id: "bc", label: "BC = √169 =", answer: "13", hint: "Welk getal keer zichzelf is 169?" }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p72_06",
    type: "exercise",
    heading: "Bereken de hypotenusa",
    content: "In rechthoekige driehoek PQR zijn PQ = 6 cm en QR = 8 cm. Bereken PR (de hypotenusa).",
    exercise: {
      type: "multi_input",
      fields: [
        { id: "pq_sq", label: "PQ² =", answer: "36", hint: "6² = 6 × 6 = ?" },
        { id: "qr_sq", label: "QR² =", answer: "64", hint: "8² = 8 × 8 = ?" },
        { id: "sum2", label: "PQ² + QR² =", answer: "100", hint: "36 + 64 = ?" },
        { id: "pr", label: "PR = √100 =", answer: "10", hint: "Welk getal keer zichzelf is 100?" }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p72_07",
    type: "exercise",
    heading: "3-4-5 Driehoek",
    content: "Een beroemde rechthoekige driehoek heeft zijden van 3, 4 en 5 cm. Bewijs met Pythagoras dat dit klopt.",
    exercise: {
      type: "multi_input",
      fields: [
        { id: "a_sq", label: "3² =", answer: "9" },
        { id: "b_sq", label: "4² =", answer: "16" },
        { id: "c_sq", label: "5² =", answer: "25" },
        { id: "check", label: "9 + 16 = 25?", answer: ["ja", "yes", "Ja", "JA", "Yes"], hint: "Is dit waar?" }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p72_08",
    type: "summary",
    heading: "Klaar met 7.2!",
    content: "Je hebt nu:\n✔️ De stelling van Pythagoras **zelf ontdekt**\n✔️ Geleerd dat **a² + b² = c²**\n✔️ De stelling in praktijk **toegepast**\n\nIn paragraaf 7.3 gaan we dit gebruiken om de schuine zijde te berekenen!",
    image: "/images/p72_done.svg"
  }
];
