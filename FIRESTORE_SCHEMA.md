# 🗄️ Firestore Schema - Detailed Specification

**Status:** Ready for implementation  
**Version:** 1.0  
**Last Updated:** 2026-05-11

---

## 📚 Collections & Documents

### 1. `vak/` - Subjects (Wiskunde, Nederlands, etc.)

```
vak/{vakId}/
├── name: string              "Wiskunde"
├── code: string              "WIS"
├── beschrijving: string      "Wiskunde VMBO"
├── icon: string              "📐" (emoji)
├── order: number             1
├── createdAt: timestamp      
├── createdBy: string         "admin@school.nl"
├── updatedAt: timestamp      
└── isActive: boolean         true
```

**Example document:**
```json
{
  "name": "Wiskunde",
  "code": "WIS",
  "beschrijving": "Wiskunde voor VMBO studenten",
  "icon": "📐",
  "order": 1,
  "createdAt": "2026-05-11T10:00:00Z",
  "createdBy": "admin@school.nl",
  "isActive": true
}
```

---

### 2. `leerjaar/` - Grade Levels (Jaar 1, Jaar 2, etc.)

```
leerjaar/{leerjaarId}/
├── vakId: reference          → vak/{vakId}
├── year: number              1 (VMBO year 1)
├── label: string             "VMBO Jaar 1"
├── niveaus: array<string>    ["VMBO-B", "VMBO-GL", "HAVO", "VWO"]
├── createdAt: timestamp      
├── createdBy: string         
└── isActive: boolean         true
```

**Example:**
```json
{
  "vakId": "/vak/wiskunde-2024",
  "year": 1,
  "label": "VMBO Jaar 1",
  "niveaus": ["VMBO-B", "VMBO-GL"],
  "createdAt": "2026-05-11T10:00:00Z",
  "isActive": true
}
```

---

### 3. `niveau/` - Education Levels (VMBO-B, HAVO, etc.)

```
niveau/{niveauId}/
├── vakId: reference          → vak/{vakId}
├── leerjaarId: reference     → leerjaar/{leerjaarId}
├── label: string             "VMBO-B"
├── order: number             1
├── createdAt: timestamp      
└── isActive: boolean         true
```

**Example:**
```json
{
  "vakId": "/vak/wiskunde-2024",
  "leerjaarId": "/leerjaar/vmbo1-2024",
  "label": "VMBO-B",
  "order": 1,
  "createdAt": "2026-05-11T10:00:00Z",
  "isActive": true
}
```

---

### 4. `hoofdstuk/` - Chapters (7. Pythagoras, 2. Lineaire functies)

```
hoofdstuk/{hoofdstukId}/
├── vakId: reference          → vak/{vakId}
├── leerjaarId: reference     → leerjaar/{leerjaarId}
├── niveauId: reference       → niveau/{niveauId}
├── number: number            7
├── title: string             "Pythagoras"
├── beschrijving: string      "Stelling van Pythagoras en toepassingen"
├── order: number             1
├── published: boolean        true
├── createdAt: timestamp      
├── createdBy: string         
├── updatedAt: timestamp      
└── isArchived: boolean       false
```

**Example:**
```json
{
  "vakId": "/vak/wiskunde-2024",
  "leerjaarId": "/leerjaar/vmbo1-2024",
  "niveauId": "/niveau/vmbo-b-2024",
  "number": 7,
  "title": "Pythagoras",
  "beschrijving": "Stelling van Pythagoras en toepassingen",
  "order": 1,
  "published": true,
  "createdAt": "2026-05-11T10:00:00Z",
  "createdBy": "admin@school.nl",
  "updatedAt": "2026-05-11T10:00:00Z",
  "isArchived": false
}
```

---

### 5. `paragraaf/` - Paragraphs (7.1, 7.2, 7.3, etc.)

```
paragraaf/{paragraafId}/
├── vakId: reference          → vak/{vakId}
├── leerjaarId: reference     → leerjaar/{leerjaarId}
├── niveauId: reference       → niveau/{niveauId}
├── hoofdstukId: reference    → hoofdstuk/{hoofdstukId}
├── code: string              "7.3"
├── title: string             "Langste zijde berekenen"
├── beschrijving: string      "Hoe je de langste zijde berekent"
├── order: number             3
├── published: boolean        true
├── createdAt: timestamp      
├── createdBy: string         
├── updatedAt: timestamp      
├── lastCropUpdate: timestamp 
├── pdfPath: string (optional) "/boekafbeeldingen/7.3.pdf"
├── aiCompanionEnabled: boolean true
├── aiCompanionPrompt: string "Je bent een Socratische mentor..."
├── cropCount: number         0
└── isArchived: boolean       false
```

**Example:**
```json
{
  "vakId": "/vak/wiskunde-2024",
  "leerjaarId": "/leerjaar/vmbo1-2024",
  "niveauId": "/niveau/vmbo-b-2024",
  "hoofdstukId": "/hoofdstuk/pythagoras-2024",
  "code": "7.3",
  "title": "Langste zijde berekenen",
  "beschrijving": "Hoe je de langste zijde berekent met de stelling van Pythagoras",
  "order": 3,
  "published": true,
  "createdAt": "2026-05-11T10:00:00Z",
  "pdfPath": "/boekafbeeldingen/7.3.pdf",
  "aiCompanionEnabled": true,
  "aiCompanionPrompt": "Je bent een tutor die via vragen helpt, geen antwoorden geeft",
  "cropCount": 3,
  "isArchived": false
}
```

---

### 6. `vraag/` - Questions/Exercises

```
vraag/{vraagId}/
├── vakId: reference          → vak/{vakId}
├── leerjaarId: reference     → leerjaar/{leerjaarId}
├── niveauId: reference       → niveau/{niveauId}
├── hoofdstukId: reference    → hoofdstuk/{hoofdstukId}
├── paragraafId: reference    → paragraaf/{paragraafId}
├── number: string            "14a"
├── title: string             "Vierkanten berekenen"
├── vraagtype: enum           "open" | "meerkeuze" | "numeriek" | "tabel"
├── order: number             1
├── published: boolean        true (draft/published)
├── createdAt: timestamp      
├── createdBy: string         
├── updatedAt: timestamp      
├── lastAnswerAt: timestamp   (laatste student-antwoord)
│
├── content: object
│   ├── text: string (HTML)   "<p>Bereken de oppervlakte...</p>"
│   ├── images: array
│   │   ├── [0]
│   │   │   ├── cropId: string "crop_123_456"
│   │   │   ├── position: enum  "above" | "below" | "left" | "right"
│   │   │   ├── width: number   200 (pixels)
│   │   │   └── caption: string "Figuur 1: Vierkanten"
│   │   └── [1] ...
│   └── tables: array (optional, voor tabel-vragen)
│       ├── [0]
│       │   ├── rows: number    3
│       │   ├── cols: number    3
│       │   ├── data: array     [["Zijde", "4", "5.5"], ...]
│       │   └── editableCells: array [[0,1], [1,1]] (welke cellen invulbaar)
│       └── [1] ...
│
├── vraagMetadata: object
│   ├── difficulty: number    3 (1-5 sterren)
│   ├── hints: array<string>  ["Tip 1", "Tip 2"]
│   ├── showCalculator: boolean true
│   ├── calculatorMode: enum  "standard" | "scientific"
│   ├── estimatedTime: number 120 (seconden)
│   └── keywords: array       ["oppervlakte", "kwadraat"]
│
├── antwoord: object (depends on vraagtype)
│   FOR "meerkeuze":
│   ├── options: array
│   │   ├── [0]
│   │   │   ├── id: string    "opt_a"
│   │   │   ├── text: string  "16 cm²"
│   │   │   ├── correct: boolean true
│   │   │   └── explanation: string "4 × 4 = 16"
│   │   └── [1] ...
│   
│   FOR "numeriek":
│   ├── correctValue: number  16
│   ├── tolerance: number     0.5 (±0.5)
│   ├── unit: string (optional) "cm²"
│   └── explanation: string   "4 × 4 = 16 cm²"
│   
│   FOR "open":
│   ├── modelAnswer: string   "Pythagoras zei dat..."
│   ├── keywords: array       ["Pythagoras", "stelling"]
│   └── rubric: array (scoring)
│       └── [0]
│           ├── points: number 2
│           └── description: string "Student noemt..."
│   
│   FOR "tabel":
│   ├── tableIndex: number    0 (which table in content.tables)
│   ├── correctValues: object  {"0,1": 4, "1,1": 5.5}
│   └── tolerance: number     0.1
│
├── analytics: object (populated during usage)
│   ├── totalAnswers: number  0
│   ├── correctAnswers: number 0
│   ├── avgTimeSpent: number  0 (seconden)
│   ├── avgHintsUsed: number  0
│   └── difficulty_actual: number 0 (berekend op basis van succes)
│
└── isArchived: boolean       false
```

**Example: Meerkeuze vraag**
```json
{
  "vakId": "/vak/wiskunde-2024",
  "paragraafId": "/paragraaf/73-2024",
  "number": "14a",
  "title": "Vierkanten berekenen",
  "vraagtype": "meerkeuze",
  "order": 1,
  "published": true,
  "content": {
    "text": "<p>Bereken de oppervlakte van een vierkant met zijde 4 cm</p>",
    "images": [
      {
        "cropId": "crop_abc123",
        "position": "above",
        "width": 250,
        "caption": "Figuur 1: Vierkant"
      }
    ]
  },
  "vraagMetadata": {
    "difficulty": 2,
    "hints": ["4 × 4 = ?", "Oppervlakte = zijde × zijde"],
    "showCalculator": true,
    "calculatorMode": "standard"
  },
  "antwoord": {
    "options": [
      {
        "id": "opt_a",
        "text": "16 cm²",
        "correct": true,
        "explanation": "4 × 4 = 16 cm²"
      },
      {
        "id": "opt_b",
        "text": "8 cm²",
        "correct": false,
        "explanation": "Dit is 2 × 4"
      },
      {
        "id": "opt_c",
        "text": "20 cm²",
        "correct": false,
        "explanation": "Dit is omtrek, niet oppervlakte"
      }
    ]
  }
}
```

**Example: Numeriek vraag**
```json
{
  "vraagtype": "numeriek",
  "content": {
    "text": "<p>Bereken: 4² + 3²</p>"
  },
  "antwoord": {
    "correctValue": 25,
    "tolerance": 0.5,
    "unit": "",
    "explanation": "4² = 16, 3² = 9, 16 + 9 = 25"
  }
}
```

**Example: Tabel vraag**
```json
{
  "vraagtype": "tabel",
  "content": {
    "text": "<p>Vul de tabel in met kwadraten</p>",
    "tables": [
      {
        "rows": 3,
        "cols": 3,
        "data": [
          ["Getal", "Kwadraat", "Eenheid"],
          ["4", "?", "cm²"],
          ["5.5", "?", "cm²"]
        ],
        "editableCells": [[1,1], [2,1]]
      }
    ]
  },
  "antwoord": {
    "tableIndex": 0,
    "correctValues": {"1,1": 16, "2,1": 30.25},
    "tolerance": 0.1
  }
}
```

---

### 7. `crop/` - Opgeslagen Crops (per paragraaf)

Substructuur: `paragraaf/{paragraafId}/crops/{cropId}`

```
crop/{cropId}/
├── paragraafId: reference    → paragraaf/{paragraafId}
├── sourceImageId: reference  → sourceImage/{sourceImageId}
├── label: string             "Figuur 1" (admin given name)
├── type: enum                "image" | "text"
├── cropCoordinates: object
│   ├── x: number             100
│   ├── y: number             50
│   ├── width: number         200
│   └── height: number        150
├── originalImageSize: object
│   ├── width: number         1200
│   └── height: number        1600
├── storagePath: string       "crops/paragraaf-73/crop_abc123.jpg"
├── downloadURL: string       "https://firebase-storage-url..."
├── ocrText: string (optional) "De stelling van Pythagoras zegt dat..."
├── ocrConfidence: number (0-1) 0.95
├── createdAt: timestamp      
├── createdBy: string         
└── usedInQuestions: array    ["vraag_14a", "vraag_15b"] (tracking)
```

**Example:**
```json
{
  "paragraafId": "/paragraaf/73-2024",
  "sourceImageId": "/sourceImage/pdf_73_page2",
  "label": "Vierkant ABCD",
  "type": "image",
  "cropCoordinates": {
    "x": 100,
    "y": 50,
    "width": 300,
    "height": 300
  },
  "originalImageSize": {
    "width": 1200,
    "height": 1600
  },
  "storagePath": "crops/paragraaf-73/crop_xyz789.jpg",
  "downloadURL": "https://...",
  "ocrText": "ABCD is een vierkant met zijde 4 cm",
  "ocrConfidence": 0.92,
  "createdAt": "2026-05-11T10:00:00Z",
  "createdBy": "admin@school.nl",
  "usedInQuestions": ["vraag_14a", "vraag_15b"]
}
```

---

### 8. `sourceImage/` - Bron-afbeeldingen (PDF/JPG per paragraaf)

Substructuur: `paragraaf/{paragraafId}/sourceImages/{imageId}`

```
sourceImage/{imageId}/
├── paragraafId: reference    → paragraaf/{paragraafId}
├── originalName: string      "pythagoras-ch7.pdf"
├── format: enum              "pdf" | "jpg" | "png"
├── storagePath: string       "source-images/paragraaf-73/xxxxx"
├── downloadURL: string       "https://..."
├── fileSize: number          2048000 (bytes)
├── pageCount: number (PDF)   14
├── dimensions: object (JPG)
│   ├── width: number         1200
│   └── height: number        1600
├── createdAt: timestamp      
├── uploadedBy: string        "admin@school.nl"
├── cropCount: number         3 (hoeveel crops uit deze image)
└── isActive: boolean         true
```

**Example:**
```json
{
  "paragraafId": "/paragraaf/73-2024",
  "originalName": "pythagoras-textbook-ch7.pdf",
  "format": "pdf",
  "storagePath": "source-images/paragraaf-73/textbook-v2.pdf",
  "pageCount": 14,
  "createdAt": "2026-05-11T10:00:00Z",
  "uploadedBy": "admin@school.nl",
  "cropCount": 5,
  "isActive": true
}
```

---

### 9. `userAnswers/` - Student Antwoorden (Analytics)

Substructuur: `userAnswers/{studentId}/{vraagId}/`

```
userAnswer/{answerId}/
├── studentId: reference      → user/{studentId}
├── vraagId: reference        → vraag/{vraagId}
├── paragraafId: reference    → paragraaf/{paragraafId}
├── vakId: reference          → vak/{vakId}
├── answer: any               "16 cm²" or 16 or {"tabel": {...}}
├── correct: boolean          true
├── hintCount: number         1 (hoeveel hints opgevraa)
├── timeSpent: number         45 (seconden)
├── aiHintCount: number       0 (hoeveel AI-prompts)
├── timestamp: timestamp      
├── sessionId: string         (groeperen meerdere antwoorden)
├── ipAddress: string (optional) voor debugging
└── isRevised: boolean        false (student kwam terug + wijzigde)
```

**Example:**
```json
{
  "studentId": "/user/student123",
  "vraagId": "/vraag/14a",
  "paragraafId": "/paragraaf/73-2024",
  "vakId": "/vak/wiskunde-2024",
  "answer": "16 cm²",
  "correct": true,
  "hintCount": 0,
  "timeSpent": 30,
  "aiHintCount": 0,
  "timestamp": "2026-05-11T14:30:00Z",
  "sessionId": "session_abc123",
  "isRevised": false
}
```

---

### 10. `userBatchImport/` - Batch Import History (voor CSV upload)

```
userBatchImport/{batchId}/
├── paragraafId: reference    → paragraaf/{paragraafId}
├── fileName: string          "vragen_7-3_2024-05-11.csv"
├── totalRows: number         15
├── successCount: number      14
├── failCount: number         1
├── createdAt: timestamp      
├── createdBy: string         
├── errors: array             [{"row": 3, "error": "Invalid format"}]
└── vragenAdded: array        ["vraag_14x", "vraag_14y", ...]
```

---

## 🔗 Firestore Indexes (Required)

```javascript
// Composite indexes nodig:

// 1. Vragen per paragraaf, gesorteerd op order
Index: paragraaf/{paragraafId} + order + published
  Collection: vraag
  Fields: paragraafId (Ascending), order (Ascending), published (Descending)

// 2. Analytics: alle antwoorden per student
Index: Student antwoorden
  Collection: userAnswer
  Fields: studentId (Ascending), timestamp (Descending)

// 3. Analytics: vraag moeilijkheid (actual vs difficulty setting)
Index: Vraag performance
  Collection: vraag
  Fields: paragraafId (Ascending), analytics.correctAnswers (Descending)

// 4. Search by tags/keywords
Index: Vraag zoeken
  Collection: vraag
  Fields: vakId (Ascending), vraagMetadata.keywords (Arrays)
```

---

## 📝 Firestore Security Rules (Later)

```javascript
// Voorbeeldrules (moet uitgewerkt na auth-setup):
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin can write everything
    match /{document=**} {
      allow read, write: if request.auth.token.admin == true;
    }
    
    // Students can only read published vragen
    match /vraag/{vraagId} {
      allow read: if resource.data.published == true;
    }
    
    // Students can write their own answers
    match /userAnswer/{userId}/{document=**} {
      allow write: if request.auth.uid == userId;
    }
  }
}
```

---

## ✅ Schema Validation (TypeScript Types - Next File)

Types zullen gedefinieerd worden in aparte file: `src/types/firestore.types.ts`

