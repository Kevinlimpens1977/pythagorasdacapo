const { onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");

initializeApp();

const openrouterApiKey = defineSecret("OPENROUTER_API_KEY");

exports.askAiTutor = onCall({
  region: "europe-west1",
  secrets: [openrouterApiKey],
}, async (request) => {
  try {
    const { message, contextHeading, previousMessages } = request.data;

    if (!message) {
      throw new Error("Message is required");
    }

    const apiKey = openrouterApiKey.value();
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is not set");
      throw new Error("Tutor API key is missing");
    }

    const systemPrompt = `Je bent een geduldige en motiverende wiskunde docent (AI Tutor) voor middelbare scholieren.
De leerling is momenteel bezig met een oefening uit het onderdeel: "${contextHeading}".
Geef NOOIT direct het antwoord of de volledige berekening.
In plaats daarvan:
- Moedig de leerling aan.
- Stel een gerichte, open wedervraag.
- Geef eventueel een kleine hint over de eerste of volgende stap.
Houd je antwoorden altijd heel kort en bondig (maximaal 2-3 zinnen).
Spreek de leerling aan in de je-vorm.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(previousMessages || []),
      { role: "user", content: message }
    ];

    console.log(`Calling OpenRouter for context: ${contextHeading}`);
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://stellingvanpythagoras.nl", 
        "X-Title": "Stelling van Pythagoras App"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: messages
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter API Error:", response.status, errText);
      throw new Error("Failed to fetch from OpenRouter");
    }

    const data = await response.json();
    return {
      success: true,
      content: data.choices[0].message.content
    };

  } catch (error) {
    console.error("Error in askAiTutor:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden bij het verbinden met de tutor. Probeer het later opnieuw."
    };
  }
});
