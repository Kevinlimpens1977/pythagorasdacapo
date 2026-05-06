export const para71Slides = [
  {
    id: "p71_01",
    type: "theory",
    heading: "7.1 Rechthoekige driehoeken",
    content: "**Leerdoel:**\nJe weet wat de rechthoekszijden en de langste zijde in een rechthoekige driehoek zijn.\n\nKijk maar eens naar je **geodriehoek**. De hoek bij de 0 is precies 90 graden. Dat is een **rechte hoek**.",
    image: "/images/p71_geodriehoek.svg"
  },
  {
    id: "p71_02",
    type: "theory",
    heading: "Wat is een rechthoekige driehoek?",
    content: "Een rechthoekige driehoek is een driehoek met één hoek van precies **90 graden**.\n\nIn de tekening herken je de rechte hoek altijd aan het speciale **vierkantje** in de hoek.",
    image: "/images/p71_triangle_abc_pqr.svg"
  },
  {
    id: "p71_03",
    type: "exercise",
    heading: "Oefenen: Herken de hoek",
    content: "Bekijk de twee driehoeken ABC en PQR. Welke hoek is de rechte hoek?",
    image: "/images/p71_triangle_abc_pqr.svg",
    exercise: {
      type: "multi_input",
      fields: [
        { id: "h1", label: "Rechte hoek in ABC:", answer: "A", hint: "Kijk naar het vierkantje bij A." },
        { id: "h2", label: "Rechte hoek in PQR:", answer: "P", hint: "Kijk naar het vierkantje bij P." }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p71_03c",
    type: "theory",
    heading: "Zijde, hoek, hoekpunt, diagonaal",
    content: "De randen van een figuur noem je **zijden**. Twee zijden die samen komen, vormen samen een **hoek**.\n\nHet snijpunt van twee zijden noem je een **hoekpunt**. Een hoekpunt geef je aan met een **hoofdletter**.\n\nEen zijde is een **lijnstuk**. Een lijnstuk geef je aan met **twee hoofdletters**.\n\nEen lijnstuk dat twee niet naast elkaar liggende hoekpunten met elkaar verbindt, heet een **diagonaal**.",
    image: "/images/71opg4bijlage1.jpg"
  },
  {
    id: "p71_04",
    type: "theory",
    heading: "Rechthoekszijden & Langste Zijde",
    content: "In een rechthoekige driehoek hebben de zijden speciale namen:\n\n1. **Rechthoekszijden (rz)**: De twee zijden die aan de rechte hoek liggen.\n2. **Langste zijde (lz)**: De zijde die precies *tegenover* de rechte hoek ligt.",
    image: "/images/p71_triangle_abc_pqr.svg"
  },
  {
    id: "p71_05",
    type: "exercise",
    heading: "Driehoeken op het dak",
    content: "Bekijk de driehoek KLM en de dakconstructie PQR. Vul de gegevens in.",
    image: "/images/p71_klm_roof.svg",
    exercise: {
      type: "multi_input",
      fields: [
        { id: "k1", label: "Rechte hoek in KLM:", answer: "M", hint: "Het vierkantje zit bovenaan." },
        { id: "k2", label: "Rechthoekszijden KLM:", answer: "KM en LM", hint: "De twee zijden die de rechte hoek M vormen." },
        { id: "p1", label: "Rechte hoek in PQR:", answer: "R", hint: "De nok van het dak." },
        { id: "p2", label: "Langste zijde PQR:", answer: "PQ", hint: "De basis van de driehoek, tegenover hoek R." }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p71_06",
    type: "theory",
    heading: "Voorbeeld: Diagonaal",
    content: "In een rechthoek kun je een **diagonaal** tekenen. Dit verdeelt de rechthoek in twee rechthoekige driehoeken.\n\nIn EFGH is **FH** de diagonaal. In driehoek EFH is hoek **E** de rechte hoek.",
    image: "/images/p71_rectangle_efgh.svg"
  },
  {
    id: "p71_07",
    type: "exercise",
    heading: "Zijden benoemen",
    content: "Bekijk de diagonaal FH nog eens goed. Vul de namen in voor driehoek **FGH**.",
    image: "/images/p71_rectangle_efgh.svg",
    exercise: {
      type: "multi_input",
      fields: [
        { id: "rh", label: "Rechte hoek:", answer: "G", hint: "Kijk naar de hoek rechtsboven in de rechthoek." },
        { id: "rz", label: "Rechthoekszijden:", answer: "FG en GH", hint: "De zijden die aan G liggen." },
        { id: "lz", label: "Langste zijde:", answer: "FH", hint: "De rode diagonaal tegenover G." }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p71_08",
    type: "exercise",
    heading: "De Grote Driehoek Puzzel",
    content: "Pieter komt bij een puzzel deze tekening tegen. Hoeveel rechthoekige driehoeken tel je in deze figuur?",
    image: "/images/p71_puzzle_triangles.svg",
    exercise: {
      type: "multi_input",
      fields: [
        { id: "aantal", label: "Aantal rechthoekige driehoeken:", answer: ["6", "zes"], hint: "Kijk goed naar de centrale as en de horizontale lijn. Er zijn 4 kleine en 2 grotere driehoeken." }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p71_09",
    type: "exercise",
    heading: "Constructie Check",
    content: "Van driehoek EFG is EF = 4 cm, ∠E = 90° en EG = 3 cm. Welke zijde is de langste?",
    image: "/images/p71_construction_efg.svg",
    exercise: {
      type: "multi_input",
      fields: [
        { id: "lz", label: "De langste zijde is:", answer: "FG", hint: "De zijde tegenover de 90 graden hoek E." },
        { id: "rz", label: "De rechthoekszijden zijn:", answer: "EF en EG", hint: "De zijden die aan hoek E vastzitten." }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p71_08_table",
    type: "exercise",
    heading: "Opdracht 8: Rechthoekige driehoeken herkennen",
    content: "Kijk goed naar de driehoeken in de afbeelding en vul de vragen in.",
    image: "/images/7pun1afbeelding.jpg",
    exercise: {
      type: "multi_input",
      fields: [
        { id: "a1", label: "A) Vierhoek ABCD is een rechthoek. De twee rechthoekige driehoeken die je in rechthoek ABCD kunt zien zijn", answer: ["ABC en ACD", "ACD en ABC"], hint: "Kijk naar de diagonaal in de rechthoek." },
        { id: "b1", label: "B) In △ABC zijn de rechthoekszijden", answer: "AB en BC", hint: "Dit zijn de twee zijden die aan de rechte hoek B liggen." },
        { id: "b2", label: "De langste zijde in △ABC is", answer: "AC", hint: "Dit is de zijde tegenover de rechte hoek." },
        { id: "b3", label: "In △ACD zijn de rechthoekszijden", answer: "AD en DC", hint: "Dit zijn de twee zijden die aan de rechte hoek D liggen." },
        { id: "b4", label: "De langste zijde in △ACD is", answer: "AC", hint: "Dit is de zijde tegenover de rechte hoek." },
        { id: "b5", label: "In △EFG zijn de rechthoekszijden", answer: ["EF en EG", "EG en EF"], hint: "Dit zijn de twee zijden die aan de rechte hoek E liggen." },
        { id: "b6", label: "De langste zijde in △EFG is", answer: "FG", hint: "Dit is de zijde tegenover de rechte hoek." },
        { id: "c1", label: "C) In driehoek HIJ zijn de rechthoekszijden", answer: ["HI en IJ", "IJ en HI"], hint: "Dit zijn de twee zijden die aan de rechte hoek I liggen." },
        { id: "c2", label: "De langste zijde in driehoek HIJ is", answer: "HJ", hint: "Dit is de zijde tegenover de rechte hoek." },
        { id: "c3", label: "In driehoek KLM zijn de rechthoekszijden", answer: ["KM en LM", "LM en KM"], hint: "Dit zijn de twee zijden die aan de rechte hoek M liggen." },
        { id: "c4", label: "De langste zijde in driehoek KLM is", answer: "KL", hint: "Dit is de zijde tegenover de rechte hoek." }
      ],
      maxAttempts: 3
    }
  },
  {
    id: "p71_11",
    type: "summary",
    heading: "Klaar met 7.1!",
    content: "Je bent nu een expert in het herkennen van rechthoekige driehoeken!\n\n**Wat we hebben geleerd:**\n✔️ Een rechte hoek is precies **90 graden**.\n✔️ De **rechthoekszijden** zitten vast aan de rechte hoek.\n✔️ De **langste zijde** ligt er altijd tegenover.\n\nIn de volgende paragraaf gaan we hiermee rekenen!",
    image: "/images/p71_geodriehoek.svg"
  }
];
