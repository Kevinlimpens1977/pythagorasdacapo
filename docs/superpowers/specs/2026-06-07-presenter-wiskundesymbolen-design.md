# Presenter Wiskundesymbolen Design

Datum: 7 juni 2026

## Doel

Presenter krijgt een rustige wiskundesymbolenoptie binnen de bestaande tekstmodus. Docenten moeten tijdens uitleg snel symbolen kunnen invoegen zonder een volledige formule-editor te openen.

## Scope V1

- Voeg in de bestaande teksttoolbar een compacte symbolenknop toe, bij voorkeur met `Sigma`/`Σ` als herkenbaar symbool.
- De knop opent een klein popover-palet met deze symbolen:

```text
π √ ² ³ × ÷ ≤ ≥ ≈ ≠ ∠ °
```

- Corrigeer de bestaande mojibake-symbolen in `PresenterToolbar.jsx` naar echte Unicode-symbolen.
- Voeg het gekozen symbool in op de cursorpositie van het actieve tekstvak.
- Als er geen actief tekstvak of tekstcursor is, maak dan een nieuw tekstobject met het gekozen symbool.
- Het palet moet touchvriendelijk zijn: grote knoppen, duidelijke focus/hover-state en geen kleine klikdoelen.

## Buiten Scope

- Geen volledige formule-editor.
- Geen breukenfeature in deze wijziging.
- Geen breukenstroken, pizzapunten of visuele breukmodellen.
- Geen Firebase-opslag, export of Presenter-sessie-wijzigingen.

De breukenrichting wordt later een aparte Presenter-tool: een eigen knop met breuken, stroken en pizzapunten als didactische bordobjecten.

## UX-Gedrag

1. Docent kiest `Tekst` in Presenter.
2. Docent klikt op de symbolenknop.
3. Presenter toont het symbolenpalet.
4. Docent kiest een symbool.
5. Als een tekstvak actief is, verschijnt het symbool op de huidige cursorpositie.
6. Als er geen tekstvak actief is, verschijnt er een nieuw tekstvak met dat symbool op de standaard tekstpositie.

Het palet mag open blijven na invoegen als dat technisch stabiel en prettig blijft. Als cursorbehoud daardoor onbetrouwbaar wordt, mag het palet na invoegen sluiten.

## Technische Richting

- Houd de wijziging lokaal bij `src/components/presenter/PresenterToolbar.jsx`, `PresenterShell.jsx` en waar nodig `PresenterObjectLayer.jsx`.
- Breid de tekstobject-editing uit met cursorpositie-invoeging via de bestaande `contentEditable` tekstlaag.
- Gebruik een kleine, expliciete symbolenconstante in plaats van inline arrays.
- Houd undo/redo intact door symboolinvoeging via bestaande Presenter-history updatehelpers te laten lopen.
- Voeg gerichte tests toe als de cursor-/tekstupdate-logica naar een pure helper wordt verplaatst.

## Acceptatiecriteria

- De teksttoolbar toont een compacte symbolenknop, niet alle 12 symbolen direct in de hoofdtoolbar.
- Het palet bevat exact de Projectkompas-set: `π √ ² ³ × ÷ ≤ ≥ ≈ ≠ ∠ °`.
- Symbolen worden correct als Unicode getoond, zonder mojibake.
- Symboolinvoeging gebruikt de cursorpositie in een actief tekstvak.
- Zonder actief tekstvak maakt Presenter een nieuw tekstobject met het symbool.
- Breuken en visuele breukmodellen blijven buiten deze implementatie.

## Verificatieplan

- Gerichte test voor pure tekstinvoeghelper als die wordt toegevoegd.
- Gerichte ESLint op aangepaste Presenter-bestanden.
- Presenter browser-smoke: tekstvak maken, cursor midden in tekst zetten, symbool invoegen, symbool zonder tekstvak laten nieuw tekstvak maken.
- `npm run build` als de React-wijziging klaar is.
