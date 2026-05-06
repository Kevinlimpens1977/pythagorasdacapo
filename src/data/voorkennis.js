export const voorkennisSlides = [
  {
    id: "vk_01",
    type: "theory",
    heading: "Even opfrissen!",
    content: "Voor Pythagoras hebben we twee superkrachten nodig:\n\n1️⃣ Kwadraten [x²]\n2️⃣ Wortels [√]\n\nLaten we kijken hoe dat ook alweer zat!"
  },
  {
    id: "vk_02",
    type: "theory",
    heading: "Alles heeft een tegenovergestelde",
    content: "Vermenigvuldigen ◀──▶ Delen\nOptellen ◀──▶ Aftrekken\n\nKwadraat ◀──▶ **Wortel**"
  },
  {
    id: "vk_04",
    type: "theory",
    heading: "Wat is een kwadraat?",
    image: "/images/vk_kwadraat_grid.png",
    content: "Een kwadraat is een getal keer **zichzelf**.\n\n5² = 5 × 5 = **25**\n3² = 3 × 3 = **9**\n\n💡 Gebruik de **[x²]** knop!"
  },
  {
    id: "vk_05",
    type: "exercise",
    heading: "Oefenen: Kwadraten",
    content: "Bereken de kwadraten.",
    image: "/images/vk_grid_vierkanten.png",
    exercise: {
      type: "multi_input",
      fields: [
        { id: "q1", label: "5² =", answer: "25", hint: "5 × 5" },
        { id: "q2", label: "7² =", answer: "49", hint: "7 × 7" },
        { id: "q3", label: "12² =", answer: "144", hint: "12 × 12" },
        { id: "q4", label: "(-6)² =", answer: "36", hint: "(-6) × (-6) = positief!" },
        { id: "q5", label: "-6² =", answer: "-36", hint: "Dit is -(6²) = -(36)" },
        { id: "q6", label: "0² =", answer: "0", hint: "0 × 0" }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "vk_06",
    type: "theory",
    heading: "De Wortel: De weg terug",
    image: "/images/vk_wortel_machine.png",
    content: "Worteltrekken is de weg terug.\n\n5 ──[²]──▶ 25\n5 ◀──[√]── 25\n\nDus: **√25 = 5**\nWant: 5 × 5 = 25"
  },
  {
    id: "vk_07",
    type: "exercise",
    heading: "Oefenen: Wortels",
    content: "Bereken de wortels. Rond af op 1 decimaal.",
    exercise: {
      type: "multi_input",
      fields: [
        { id: "w1", label: "√25 =", answer: "5", hint: "Welk getal × zichzelf is 25?" },
        { id: "w2", label: "√20 ≈", answer: "4.5", hint: "Gebruik de [√] knop." },
        { id: "w3", label: "√55 ≈", answer: "7.4", hint: "Typ in: √ 55 =" }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "vk_09",
    type: "demo_exercise",
    heading: "De Grote Finale",
    content: "Stap voor stap: √(3² + 4²)",
    exercise: {
      type: "demo",
      steps: [
        "Bereken de kwadraten van de rechthoekszijden: 3² = 9 en 4² = 16",
        "Tel de kwadraten bij elkaar op: 9 + 16 = 25",
        "Neem de wortel van de som: √25",
        "De langste zijde is 5"
      ]
    }
  },
  {
    id: "vk_08",
    type: "exercise",
    heading: "Nu jij! Stapje voor stapje",
    content: "Los dit op stap voor stap: **√(80 + (6² - 4²))**\n\nFollow each step carefully!",
    exercise: {
      type: "multi_input",
      fields: [
        { id: "s1", label: "Stap 1: Bereken 6² =", answer: "36", hint: "6 × 6" },
        { id: "s2", label: "Stap 2: Bereken 4² =", answer: "16", hint: "4 × 4" },
        { id: "s3", label: "Stap 3: Bereken 6² - 4² =", answer: "20", hint: "36 - 16" },
        { id: "s4", label: "Stap 4: Bereken 80 + (antwoord stap 3) =", answer: "100", hint: "80 + 20" },
        { id: "s5", label: "Stap 5: Bereken √100 =", answer: "10", hint: "Welk getal × zichzelf is 100?" }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "vk_09_challenge",
    type: "exercise",
    heading: "Zelf berekenen: De echte test!",
    content: "Los dit volledig zelf op. Geen tussenstappen, alleen het eindantwoord invullen:\n\n**√(5² + 12²) = ?**\n\nReken zelf uit stap voor stap en vul je antwoord in.",
    exercise: {
      type: "multi_input",
      fields: [
        { id: "result", label: "Wat is √(5² + 12²) =", answer: "13", hint: "Bereken eerst de kwadraten, tel ze op, en neem de wortel." }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "vk_10",
    type: "summary",
    heading: "Klaar voor Pythagoras!",
    content: "✅ Kwadraat = Getal × Zichzelf\n✅ Wortel = De weg terug\n✅ Je kunt samengestelde sommen stap voor stap oplossen\n✅ Je kunt sommen ook helemaal zelfstandig uitrekenen\n\nJe bent nu een expert in de basis. \n\nLaten we naar de Stelling gaan!"
  }
];
