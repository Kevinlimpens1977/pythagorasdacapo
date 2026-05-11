/**
 * CMS Type Definitions
 * Using JSDoc for runtime documentation + IDE support
 */

/**
 * @typedef {Object} Vak
 * @property {string} id - Unique vak ID (e.g., "wiskunde-2024")
 * @property {string} name - Display name (e.g., "Wiskunde")
 * @property {string} code - Subject code (e.g., "WIS")
 * @property {string} icon - Emoji icon (e.g., "📐")
 * @property {string} beschrijving - Description
 * @property {number} order - Sort order
 * @property {string} createdBy - Admin user ID
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {boolean} isActive - Is this subject active?
 */

/**
 * @typedef {Object} Leerjaar
 * @property {string} id - Unique leerjaar ID
 * @property {string} vakId - Reference to parent vak ID
 * @property {number} year - Year number (1, 2, 3, 4)
 * @property {string} label - Display label (e.g., "VMBO Jaar 1")
 * @property {string[]} niveaus - Array of available levels
 * @property {Date} createdAt
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} Niveau
 * @property {string} id - Unique niveau ID
 * @property {string} vakId - Parent vak ID
 * @property {string} leerjaarId - Parent leerjaar ID
 * @property {string} label - Display label (e.g., "VMBO-B", "HAVO", "VWO")
 * @property {number} order - Sort order
 * @property {Date} createdAt
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} Hoofdstuk
 * @property {string} id - Unique chapter ID
 * @property {string} vakId - Parent vak ID
 * @property {string} leerjaarId - Parent leerjaar ID
 * @property {string} niveauId - Parent niveau ID
 * @property {number} number - Chapter number (e.g., 7)
 * @property {string} title - Chapter title (e.g., "Pythagoras")
 * @property {string} beschrijving - Chapter description
 * @property {number} order - Sort order
 * @property {boolean} published - Is published?
 * @property {string} createdBy - Admin user ID
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {boolean} isArchived - Is archived?
 */

/**
 * @typedef {Object} Paragraaf
 * @property {string} id - Unique paragraph ID
 * @property {string} vakId - Parent vak ID
 * @property {string} leerjaarId - Parent leerjaar ID
 * @property {string} niveauId - Parent niveau ID
 * @property {string} hoofdstukId - Parent chapter ID
 * @property {string} code - Code (e.g., "7.3")
 * @property {string} title - Title (e.g., "Langste zijde berekenen")
 * @property {string} beschrijving - Description
 * @property {number} order - Sort order within chapter
 * @property {boolean} published - Is published?
 * @property {string} createdBy - Admin user ID
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {Date} lastCropUpdate - Last crop modification
 * @property {string} pdfPath - Optional: path to source PDF
 * @property {boolean} aiCompanionEnabled - Enable AI hints?
 * @property {string} aiCompanionPrompt - System prompt for AI
 * @property {number} cropCount - Number of crops attached
 * @property {boolean} isArchived - Is archived?
 */

/**
 * @typedef {Object} VraagContent
 * @property {string} text - Question text (HTML)
 * @property {Array<ImageRef>} images - Attached images
 * @property {Array<TableData>} tables - Attached tables (for tabel questions)
 */

/**
 * @typedef {Object} ImageRef
 * @property {string} cropId - Reference to crop
 * @property {string} position - "above" | "below" | "left" | "right"
 * @property {number} width - Width in pixels
 * @property {string} caption - Optional caption
 */

/**
 * @typedef {Object} TableData
 * @property {number} rows - Number of rows
 * @property {number} cols - Number of columns
 * @property {Array<Array<string>>} data - Table data
 * @property {Array<Array<number>>} editableCells - Which cells are editable [row, col]
 */

/**
 * @typedef {Object} VraagMetadata
 * @property {number} difficulty - Difficulty 1-5 (stars)
 * @property {string[]} hints - Array of hints
 * @property {boolean} showCalculator - Show calculator?
 * @property {string} calculatorMode - "standard" | "scientific"
 * @property {number} estimatedTime - Time in seconds
 * @property {string[]} keywords - Search keywords
 */

/**
 * @typedef {Object} MultiChoiceAntwoord
 * @property {Array<ChoiceOption>} options - Answer options
 */

/**
 * @typedef {Object} ChoiceOption
 * @property {string} id - Option ID (e.g., "opt_a")
 * @property {string} text - Display text
 * @property {boolean} correct - Is this correct?
 * @property {string} explanation - Why is this correct/wrong?
 */

/**
 * @typedef {Object} NumericAntwoord
 * @property {number} correctValue - Correct answer
 * @property {number} tolerance - Tolerance (±)
 * @property {string} unit - Unit (e.g., "cm²")
 * @property {string} explanation - Explanation
 */

/**
 * @typedef {Object} OpenAntwoord
 * @property {string} modelAnswer - Model answer text
 * @property {string[]} keywords - Expected keywords
 * @property {Array<RubricPoint>} rubric - Scoring rubric
 */

/**
 * @typedef {Object} RubricPoint
 * @property {number} points - Points for this criterion
 * @property {string} description - What must student show?
 */

/**
 * @typedef {Object} TableAntwoord
 * @property {number} tableIndex - Which table in content.tables
 * @property {Object<string, number>} correctValues - e.g. {"1,1": 16, "2,1": 30.25}
 * @property {number} tolerance - Tolerance for numeric cells
 */

/**
 * @typedef {Object} Vraag
 * @property {string} id - Unique question ID
 * @property {string} vakId - Parent vak ID
 * @property {string} leerjaarId - Parent leerjaar ID
 * @property {string} niveauId - Parent niveau ID
 * @property {string} hoofdstukId - Parent chapter ID
 * @property {string} paragraafId - Parent paragraph ID
 * @property {string} number - Question number (e.g., "14a")
 * @property {string} title - Question title
 * @property {"open"|"meerkeuze"|"numeriek"|"tabel"} vraagtype - Question type
 * @property {VraagContent} content - Question content
 * @property {VraagMetadata} vraagMetadata - Question metadata
 * @property {Object} antwoord - Answer (varies by type)
 * @property {number} order - Sort order within paragraph
 * @property {"draft"|"published"|"archived"} status - Publication status
 * @property {string} createdBy - Admin user ID
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {Date} lastAnswerAt - Last student answer time
 * @property {Object} analytics - Performance analytics
 * @property {boolean} isArchived - Is archived?
 */

/**
 * @typedef {Object} Crop
 * @property {string} id - Unique crop ID
 * @property {string} paragraafId - Parent paragraph ID
 * @property {string} sourceImageId - Reference to source image
 * @property {string} label - Display name (e.g., "Figuur 1")
 * @property {"image"|"text"} type - Crop type
 * @property {Object} cropCoordinates - { x, y, width, height }
 * @property {Object} originalImageSize - Original image dimensions
 * @property {string} storagePath - Firebase Storage path
 * @property {string} downloadURL - Public download URL
 * @property {string} ocrText - OCR-extracted text (if any)
 * @property {number} ocrConfidence - OCR confidence 0-1
 * @property {string[]} usedInQuestions - Which questions use this crop
 * @property {string} createdBy - Admin user ID
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} SourceImage
 * @property {string} id - Unique image ID
 * @property {string} paragraafId - Parent paragraph ID
 * @property {string} originalName - Original filename
 * @property {"pdf"|"jpg"|"png"} format - File format
 * @property {string} storagePath - Storage path
 * @property {string} downloadURL - Download URL
 * @property {number} fileSize - File size in bytes
 * @property {number} pageCount - Page count (for PDFs)
 * @property {Object} dimensions - Image dimensions {width, height}
 * @property {number} cropCount - How many crops from this image
 * @property {string} uploadedBy - Admin user ID
 * @property {Date} createdAt
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} UserAnswer
 * @property {string} id - Answer ID
 * @property {string} studentId - Student user ID
 * @property {string} vraagId - Question ID
 * @property {string} paragraafId - Paragraph ID
 * @property {string} vakId - Subject ID
 * @property {any} answer - The actual answer (varies by type)
 * @property {boolean} correct - Is correct?
 * @property {number} hintCount - How many hints used
 * @property {number} timeSpent - Time in seconds
 * @property {number} aiHintCount - How many AI hints used
 * @property {Date} timestamp - When answered
 * @property {string} sessionId - Session ID for grouping
 * @property {boolean} isRevised - Did student revise?
 */

/**
 * CMS State - For useCms hook
 * @typedef {Object} CmsState
 * @property {Vak[]} vakken - All subjects
 * @property {Leerjaar[]} leerjaren - Available years
 * @property {Niveau[]} niveaus - Available levels
 * @property {Hoofdstuk[]} hoofdstukken - Available chapters
 * @property {Paragraaf[]} paragrafen - Available paragraphs
 * @property {Vraag[]} vragen - Available questions
 *
 * @property {string|null} selectedVakId - Currently selected vak
 * @property {string|null} selectedLeerjaarId - Currently selected year
 * @property {string|null} selectedNiveauId - Currently selected level
 * @property {string|null} selectedHoofdstukId - Currently selected chapter
 * @property {string|null} selectedParagraafId - Currently selected paragraph
 * @property {string|null} selectedVraagId - Currently selected question
 *
 * @property {boolean} loading - Is loading?
 * @property {string|null} error - Error message if any
 */

// Export for use in components
export default {
  // Type hints are in JSDoc above
};
