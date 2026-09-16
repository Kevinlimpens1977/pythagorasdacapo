# HELIX - leeswijzer voor Claude Code

HELIX is het leerplatform van Kevin Limpens: React 19, Vite, Tailwind 4, met
Firebase (`pythagoras-eoa`) als database en Vercel als hosting. De site staat op
https://dvdacapo.vercel.app.

**Begin met `docs/HANDOFF.md`.** Daar staat de werkwijze, wat er buiten git
leeft, en de stand per vak. Dit bestand is alleen de leeswijzer.

Eerste twee commando's van een sessie:

```bash
git pull
node scripts/handoff-stand.mjs
```

## Wat je moet weten voordat je iets doet

- **Het meeste werk staat niet in git.** Lesstof, klassen, toewijzingen en
  voortgang leven in Firestore; presentaties in Firebase Storage. Een `git log`
  vertelt de helft. `handoff-stand.mjs` vertelt de andere helft.
- **Niets committen of pushen zonder dat Kevin het vraagt.**
- De productietak is `codex/digitale-vaardigheden-seed`, niet `main`.
- **Nooit `git add -A`.** Noem de paden. Buiten git blijven: `exports/`,
  `badges/`, `.firebase/`, `.superpowers/`, `.tmp*`, `sources/`.
- Deployen alleen met `npx vercel --prod --yes`. Nooit
  `firebase deploy --only hosting`.
- Elk schrijvend script eerst als dry run, pas daarna `--apply`.
- Werk niet tegelijk met een andere sessie in deze map.

## Lesmateriaal van Kevin

Levert Kevin een hoofdstuk aan (PDF, tekst, presentaties), gebruik dan de skill
`/helix-hoofdstuk-bouwen`. Die kent de vaste volgorde en de valkuilen. De weg
staat ook in `docs/HANDOFF.md`, paragraaf 4, voor het geval de skill er niet is.

## Na een wijziging

```bash
npx eslint <gewijzigde bestanden>
node --test src/lib/
npm run build
```

## Taal

Nederlands, korte zinnen, geen emoji. Iconen zijn lucide of SVG. Dat geldt voor
de app, voor commits en voor wat je aan Kevin schrijft.
