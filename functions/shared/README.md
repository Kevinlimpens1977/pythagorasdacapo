# functions/shared (gegenereerd)

Deze map is een byte-identieke kopie van de gedeelde beoordelingslaag uit
`src/lib`. Bewerk hier niets: pas `src/lib/questionGrading.js` (of een module
die daaruit volgt) aan en draai daarna:

    node scripts/sync-functions-shared.mjs

De tests `src/lib/functionsSharedGrading.test.js` en
`functions/sharedGrading.test.js` falen zodra kopie en bron uit elkaar lopen.
