# Bug Report - Stelling van Pythagoras

## Datum
2026-05-05

## Bugs Gefixt ✅

### Bug #1: Verkeerd Firebase Project in API
**Status:** GEFIXT
**Locatie:** `src/lib/api.js`

**Probleem:**
- De API configuratie wees naar project `willog-b9d9c` in plaats van `pythagoras-eoa`
- Cloud Functions URL: `europe-west1-willog-b9d9c.cloudfunctions.net` (VERKEERD)
- Dit veroorzaakte dat Firestore calls naar het verkeerde project gingen

**Oplossing:**
- ✅ `projectId` gewijzigd: `willog-b9d9c` → `pythagoras-eoa`
- ✅ Cloud Functions URL bijgewerkt: `europe-west1-pythagoras-eoa.cloudfunctions.net`

---

### Bug #2: Infinite Loop in AITutorChat Message Handling
**Status:** GEFIXT
**Locatie:** `src/components/slides/AITutorChat.jsx` (line 33)

**Probleem:**
- `previousMessages = currentMessages.slice(1, -1)` verwijderde ZOWEL eerste message (initiële groet) ALS laatste message (user bericht)
- Dit kon tot dubbel verwijderen van context leiden

**Oplossing:**
- ✅ Gewijzigd naar: `slice(0, -1)` 
- Nu worden alle voorgaande messages + initiële groet meegezonden (alleen huidi

ge user bericht eruit)

---

## Actief Probleem ⚠️

### Bug #3: AITutor Chat Loop - "loading... generating... working..."
**Status:** DIAGNOSE NODIG
**Locatie:** `src/components/slides/AITutorChat.jsx` + `src/lib/api.js`

**Symptomen:**
- Na server start geeft AITutor bericht: "loading... generating... working..." en herhaalt dit
- Blijft in loop hangen, zelfs na computer herstart
- Foutmeldingen verschijnen niet (dus niet de error handling van AITutorChat)

**Mogelijke oorzaken:**

1. **Cloud Function is niet bereikbaar**
   - URL `https://europe-west1-pythagoras-eoa.cloudfunctions.net/askAiTutor` geeft 404 of timeout
   - Fetch request blijft pending

2. **Cloud Function returnt verkeerd formaat**
   - Verwacht: `{ result: { success: true, content: "..." } }`
   - Geeft: iets anders (undefined, error, streaming response)

3. **Cloud Function zelf in loop**
   - Cloud Function code maakt infinite loop
   - Of OpenRouter API call geeft streaming response dat niet correct wordt afgehandeld

4. **OpenRouter Key niet correct ingesteld**
   - Key in Cloud Function environment variables niet beschikbaar
   - Cloud Function faalt silently

5. **CORS issue**
   - Browser blokkeert requests naar Cloud Functions endpoint

---

## Wat Te Checken

### Voor Dev Server Start:
```bash
npm install
npm run dev
```

### In Browser Console (F12):
1. Open DevTools → Network tab
2. Trigger AITutor chat
3. Kijk naar de Cloud Functions call naar: 
   `https://europe-west1-pythagoras-eoa.cloudfunctions.net/askAiTutor`
   - Status code?
   - Response body?
   - CORS errors?

### Cloud Functions Deployment:
1. Check Firebase console: `pythagoras-eoa` project
2. Ga naar Functions → `askAiTutor` function
3. Kijk naar:
   - Is functie gedeployd? (status: "OK" of "ERROR"?)
   - Logs → zijn er runtime errors?
   - Environment variables → is `OPENROUTER_API_KEY` ingesteld?
   - Region: `europe-west1` correct?

### OpenRouter Integration:
1. Is `OPENROUTER_API_KEY` in Cloud Function env vars?
2. Cloud Function code — hoe wordt OpenRouter aanroepen?
   - Direct API call?
   - Of via een library?
3. Geeft OpenRouter streaming response of single response?

---

## Volgende Stappen

### Stap 1: Dev Server Starten
```bash
cd "c:\Projecten\stelling van pythagoras"
npm install        # Dependencies installeren
npm run dev        # Dev server starten
```
- Open http://localhost:5173 in browser
- F12 → Console tab openen

### Stap 2: Test AITutor Chat
1. Login/authenticate
2. Open een chapter
3. Klik AITutor button
4. Verzend een test bericht

### Stap 3: Debug Network Call
1. Browser DevTools → Network tab
2. Filter op XHR/Fetch requests
3. Kijk naar `askAiTutor` request:
   - Status code?
   - Response preview?
   - Console errors?

### Stap 4: Check Cloud Function
1. Firebase Console → pythagoras-eoa project
2. Functions → askAiTutor
3. Kijk naar:
   - Deployment status
   - Recent logs
   - Errors in execution

### Stap 5: Fix Cloud Function
Afhankelijk van diagnose:
- Als `OPENROUTER_API_KEY` ontbreekt → toevoegen in Cloud Function env vars
- Als response formaat fout → Cloud Function code fixen
- Als streaming response → response handling aanpassen

---

## Code Referenties

**Huidsige Response Chain:**

```
AITutorChat (verzendt bericht)
    ↓
askAiTutorCall() in api.js
    ↓
fetch(FUNCTION_URL) naar Cloud Function
    ↓
Cloud Function (asynchroon, geeft antwoord)
    ↓
response.json() → data.result
    ↓
AITutorChat checkt: if (response && response.success)
    ↓
Toont response.content of error message
```

**Verwacht response format:**
```javascript
{
  result: {
    success: true,
    content: "Antwoord van AI Tutor..."
  }
}
```

---

## Notities
- Firebase config is correct: `pythagoras-eoa` project
- Auth is correct in `src/services/firebase.js`
- UI rendering werkt (error message zou tonen als API faalt)
- **Probleem is waarschijnlijk in Cloud Function zelf**

