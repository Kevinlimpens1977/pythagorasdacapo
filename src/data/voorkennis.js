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
        { id: "q3", label: "12² =", answer: "144", hint: "12 × 12" }
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
    id: "vk_10",
    type: "summary",
    heading: "Klaar voor Pythagoras!",
    content: "✅ Kwadraat = Getal × Zichzelf\n✅ Wortel = De weg terug\n\nJe bent nu een expert in de basis. \n\nLaten we naar de Stelling gaan!"
  }
];
