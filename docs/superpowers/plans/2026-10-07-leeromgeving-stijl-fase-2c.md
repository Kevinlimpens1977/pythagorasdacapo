# HELIX Leeromgeving-stijl, fase 2c: implementatieplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** De laatste leerlingpagina's in de leeromgeving-stijl: de pillen in de menubalk, het profiel, de tokenshop (met avatarmaker en privileges), Mijn klas (met stemmen en wedstrijd) en het spellenoverzicht, plus het niveau-moment. Bangers, de gele titelbanden, de dikke zwarte randen en de harde schaduwen verdwijnen van deze pagina's.

**Architecture:** De kleuren liggen al dicht bij de tokens; het werk zit in vorm en letter. Elke pagina gaat over op de bouwstenen (`PaginaKop`, `Kaart`, `KaartKop`, `Label`, `.lo-knop`, `.lo-knop-tweede`, `.lo-keuze`, `.lo-melding`, `.lo-voortgang`, `.lo-invoer`) via JSX-klassen; er is geen gedeelde oude klasse die een scope zinvol maakt. Eén nieuwe bouwsteen: `.lo-pil` voor de menubalk (44px hoog, want een label van 22px is te klein om met een vinger te raken). De werking verandert niet.

**Tech Stack:** React 19, Vite, Tailwind 4 (native cascade layers), lucide-react, node:test, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-07-leeromgeving-stijl-design.md` (paragraaf 3.2, punten Menubalk en "Profiel, tokenshop, spellenoverzicht, Mijn klas"), stijldocument `docs/LEEROMGEVING-STIJL.md`. Inventaris: `exports/leeromgeving/fase-2c-inventaris.md`.

## Global Constraints

- Werk in `C:\Projecten\helix leerplatform` op `codex/digitale-vaardigheden-seed`. Nooit `git add -A`/`git add .`; noem paden. `.claude/launch.json` blijft buiten de commits.
- Commits Nederlands met voorvoegsel, eindigend op exact `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Push, markering en deploy alleen in de laatste taak.
- **Alleen het uiterlijk.** Geen handlers, state, effecten, voorwaarden, services of volgorde van onderdelen veranderen. `aria-*`, `role`, `id`, `htmlFor`, `title`, `key`, `ref`, `onKeyDown`, Escape- en achtergrondklik-afhandeling van vensters blijven.
- **Teksten blijven letterlijk gelijk.** Voeg geen zichtbare tekst toe. Een paginakop krijgt alleen een eyebrow als er nu al een eyebrow-tekst staat.
- **Wat zijn eigen beeld houdt:** `HelixAvatar`, `HelixCompanion`, `GamePlayer` en de spellen, `EmoteMoment`, `CertificaatPage`, `NulmetingProfielKaart` (gedeeld met de docentkant; fase 3). Inline `style`-accenten uit shopitems (randkleur, titelkleur, pinkleur, bannerverloop, bannerafbeelding, kaderafbeelding) en kleurstalen (`style={{ background: optie.kleur }}`) blijven staan.
- **Wrappers die moeten blijven:** elke `overflow-hidden rounded-full` met vaste maat rond een avatar; `relative` op een kaart met een pop-over; de klassen `profile-avatar-badge`, `profile-avatar-popover`, `token-profile-avatar`, `token-header-avatar`, `uitpak-moment`, `niveau-moment` en de `<style>`-blokken die eraan hangen.
- **Cascade.** Ongelaagde klassen in `src/index.css` (`helix-card`, `helix-surface`, `helix-eyebrow`, `helix-heading-xl`, `helix-muted`, `btn-primary`, `btn-secondary`, `helix-btn-solid`, `input-auth`, `input-standard`, `helix-progress-*`, `ds-display`, `ds-anchor`) winnen van Tailwind en van `.lo-*`. Vervang ze; zet geen `.lo-*` ernaast. `helix-page`, `helix-container` en `pad-content` zijn alleen opmaak van de pagina en mogen blijven. Tailwind-utilities winnen wel van `.lo-*`.
- **Vertaaltabel** (geldt voor elke taak):

| Oud | Nieuw |
| --- | --- |
| pagina in een crème kader met `border-[3px] border-[#0B0D0F]` en harde schaduw | geen kader: `helix-page lo-tekst` > `helix-container flex flex-col gap-8 py-10 md:py-12` |
| `ds-anchor`-band met `ds-display`-titel | `<PaginaKop titel=… uitleg=… acties=…/>` (eyebrow alleen als die er al was) |
| `helix-eyebrow` + `helix-heading-xl` | `<PaginaKop eyebrow=… titel=…/>` |
| sectiekop met `ds-display` (26px) of `font-display` | `lo-kaart-titel`, of `<KaartKop titel uitleg/>` bovenin een `Kaart` |
| kaart met `border-2/3 border-[#0B0D0F]` en/of `shadow-[Npx_Npx_0_#0B0D0F]`, `helix-card`, `helix-surface` | `lo-kaart` (of `<Kaart>`); binnenvakken `rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)]` of `bg-[var(--lo-papier)]` zonder rand |
| hoofdhandeling (kopen, opslaan, aanvragen, versturen) | `lo-knop` |
| tweede knop (annuleren, passen, wijzigen), `btn-secondary` | `lo-knop-tweede` |
| kleine knop in een rij of kaart | `lo-knop-start` |
| tabbladen, filters, keuzes met `aria-pressed`/`aria-current` | `lo-keuzes` > `lo-keuze` |
| pil, badge, prijs, zeldzaamheid, status | `<Label kleur=…>` of `lo-label lo-label--…` (blauw info, groen af/gehaald, oranje let op/op slot, rood fout, paars plus/inclusie) |
| melding (succes/fout/info) | `lo-melding` + `lo-melding--fout` / `lo-melding--info`; succes: `lo-melding bg-[var(--lo-groen-zacht)] text-[var(--lo-groen-inkt)]` |
| voortgangsbalk (`helix-progress-*`, eigen `Balk`) | `<span className="lo-voortgang"><i style={{ width: … }} /></span>` |
| invoerveld (`input-auth`, `input-standard`, eigen randen) | `lo-invoer`, label `lo-veldlabel` |
| `uppercase`, `tracking-*` | weg (alleen `lo-eyebrow` is in hoofdletters) |
| `font-black` | `font-extrabold` |
| `#0B0D0F` `#FFD33D` `#FFF0B8` `#FFF7E8` `#FBEBD0` `#E8DCC3` `#5B5648` `#087EB5` `#066A99` `#E1F0F8` `#793AC7` `#5F2C9E` `#ECE3F8` `#2E9D63` `#237A4D` `#DFF2E7` `#B4520E` `#FDE7D6` `#D83A2E` `#B42F25` `#FADDDA` | `var(--lo-inkt)` `--lo-geel` `--lo-geel-zacht` `--lo-papier` `--lo-papier-2` `--lo-lijn` `--lo-grijs` `--lo-blauw` `--lo-blauw-inkt` `--lo-blauw-zacht` `--lo-paars` `--lo-paars-inkt` `--lo-paars-zacht` `--lo-groen` `--lo-groen-inkt` `--lo-groen-zacht` `--lo-oranje-inkt` `--lo-oranje-zacht` `--lo-rood` `--lo-rood-inkt` `--lo-rood-zacht` |
| `var(--helix-navy/muted/border/purple/purple-dark/soft-lavender/surface/surface-soft/bg)`, `var(--color-green-ink/-soft)`, `var(--color-red-ink/-soft)` | `var(--lo-inkt/grijs/lijn/blauw/blauw-inkt/blauw-zacht/kaart/papier/papier)`, `var(--lo-groen-inkt/-zacht)`, `var(--lo-rood-inkt/-zacht)` |
| overige hexwaarden (bijv. `#FFB400` winnaar) | de dichtstbijzijnde token; noem ze in je rapport |
| harde schaduw `shadow-[Npx_Npx_0_…]` | weg; een kaart krijgt de schaduw van `lo-kaart` |
| afgerond `rounded-2xl/3xl` op kaarten, `rounded-xl` op vakken | `rounded-[var(--lo-hoek-xl)]` / `rounded-[var(--lo-hoek-m)]` (of de bouwsteen) |

- Een venster (modal) wordt `lo-kaart` met `max-w-…` en eigen breedte; de donkere achtergrondlaag blijft zoals hij is.
- Na elke taak: `npx eslint <gewijzigde bestanden>`, `node --test src/lib/`, `npm run build`, en `grep -n "ds-display\|ds-anchor\|#0B0D0F\|shadow-\[[0-9]" <bestanden>` in je rapport (verwacht: leeg, behalve wat je met reden noemt).

---

### Task 1: De pillen in de menubalk

**Files:**
- Modify: `src/styles/leeromgeving.css` (nieuwe regels vóór `/* Kleurstalen in de stijlgids */`)
- Modify: `src/lib/leeromgevingStijl.test.js` (één test erbij)
- Modify: `src/components/tokens/TokenBalancePill.jsx`, `src/components/tokens/NiveauPill.jsx`, `src/components/tokens/WeekdoelPill.jsx`, `src/components/klas/KlasDoelPill.jsx`, `src/components/klas/EventPill.jsx`
- Modify: `src/components/layout/AppShell.jsx` (alleen de resten in het leerlingdeel, zie stap 4)
- Modify: `src/pages/AdminStijlgidsPage.jsx` (kaart "Pillen in de menubalk")

**Interfaces:**
- Produces: `.lo-pil`, `.lo-pil--groen`, `.lo-pil--geel`, `.lo-pil-icoon`, `.lo-pil-balk` (met `> i` als vulling, groen) en `.lo-pil-balk--blauw`.

- [ ] **Step 1: Falende test** — voeg onderaan `src/lib/leeromgevingStijl.test.js` toe:

```js
test('de pillen in de menubalk zijn groot genoeg om met een vinger te raken', () => {
  assert.match(regel('.lo-pil'), /min-height:\s*44px/);
  assert.match(regel('.lo-pil'), /border-radius:\s*999px/);
  assert.match(regel('.lo-pil'), /font-size:\s*13px/);
  assert.match(regel('.lo-pil--groen'), /background:\s*var\(--lo-groen-zacht\)/);
  assert.match(regel('.lo-pil--geel'), /background:\s*var\(--lo-geel\)/);
  assert.match(regel('.lo-pil-balk'), /height:\s*6px/);
});
```

Run: `node --test src/lib/leeromgevingStijl.test.js` → FAIL ("regel .lo-pil ontbreekt").

- [ ] **Step 2: CSS** — in `src/styles/leeromgeving.css`, direct boven `  /* Kleurstalen in de stijlgids */`:

```css
  /* Pil in de menubalk (tokens, niveau, weekdoel, klasdoel, event). 44px hoog,
     zoals de knoppen ernaast: een label van 22px is te klein voor een vinger. */
  .lo-pil { display: inline-flex; flex: none; align-items: center; gap: 7px; min-height: 44px; padding: 0 12px; border: 1px solid var(--lo-lijn); border-radius: 999px; background: var(--lo-kaart); color: var(--lo-inkt); font-family: var(--lo-letter); font-size: 13px; line-height: 19.5px; font-weight: 800; white-space: nowrap; font-variant-numeric: tabular-nums; }
  button.lo-pil { cursor: pointer; }
  button.lo-pil:hover { border-color: var(--lo-blauw); }
  .lo-pil--groen { border-color: transparent; background: var(--lo-groen-zacht); color: var(--lo-groen-inkt); }
  .lo-pil--geel { border-color: var(--lo-inkt); background: var(--lo-geel); color: var(--lo-inkt); }
  .lo-pil-icoon { flex: none; color: var(--lo-grijs); }
  .lo-pil-balk { display: block; flex: none; width: 44px; height: 6px; overflow: hidden; border-radius: 999px; background: var(--lo-papier-2); }
  .lo-pil-balk > i { display: block; height: 100%; border-radius: 999px; background: var(--lo-groen); }
  .lo-pil-balk--blauw > i { background: var(--lo-blauw); }
```

Run de test opnieuw → PASS.

- [ ] **Step 3: De vijf pillen** — vervang alleen de klassen en de balkjes; `title`, `onClick`, `aria-hidden`, de voorwaarden en de teksten blijven.

`TokenBalancePill.jsx`, de knop:
```jsx
    <button
      type="button"
      onClick={onOpenShop}
      className="lo-pil"
      title="Open tokenshop"
    >
      <Coins size={17} className="lo-pil-icoon text-[var(--lo-oranje-inkt)]" />
      <span>{Math.max(0, Number(balance) || 0)}</span>
      <ShoppingBag size={15} className="lo-pil-icoon hidden sm:block" />
    </button>
```

`NiveauPill.jsx`, de `div` en zijn inhoud:
```jsx
    <div
      className="lo-pil hidden sm:inline-flex"
      title={xpNodig > 0 ? `Niveau ${niveau}: nog ${xpNodig - xpInNiveau} XP tot niveau ${niveau + 1}` : `Niveau ${niveau}: het hoogste niveau`}
    >
      <Star size={17} className="lo-pil-icoon text-[var(--lo-oranje-inkt)]" aria-hidden="true" />
      <span>Niveau {niveau}</span>
      <span className="lo-pil-balk lo-pil-balk--blauw" aria-hidden="true">
        <i style={{ width: `${procent}%` }} />
      </span>
    </div>
```

`WeekdoelPill.jsx`: gehaald-`div` → `className="lo-pil lo-pil--groen hidden md:inline-flex"` (icoon zonder klasse). Gewone `div` → `className="lo-pil hidden md:inline-flex"`, `Target` → `className="lo-pil-icoon text-[var(--lo-blauw)]"`, balkje → `<span className="lo-pil-balk" aria-hidden="true"><i style={{ width: `${procent}%` }} /></span>`.

`KlasDoelPill.jsx`: gehaald-knop → `className="lo-pil lo-pil--groen hidden md:inline-flex"`. Gewone knop → `className="lo-pil hidden lg:inline-flex"`, `Users` → `className="lo-pil-icoon text-[var(--lo-blauw)]"`, balkje → `<span className="lo-pil-balk lo-pil-balk--blauw" aria-hidden="true"><i style={{ width: `${klasdoelProcent(doel)}%` }} /></span>`.

`EventPill.jsx`: `className="lo-pil lo-pil--geel hidden md:inline-flex"`.

- [ ] **Step 4: Resten in AppShell** (`src/components/layout/AppShell.jsx`, alleen dit):
  - De buitenste `div` (ca. regel 112): `selection:bg-fuchsia-100` → `selection:bg-[var(--lo-geel-zacht)]`.
  - De pins in het profielblok van de leerling (ca. regel 271): haal `uppercase` en `tracking-*` weg, `font-black` → `font-extrabold`; een terugval-kleur `var(--helix-purple)` → `var(--lo-blauw)`. De inline `style` met de pinkleur blijft.
  - Een terugval-accent `var(--helix-purple)` bij de avatar (ca. regel 257) → `var(--lo-blauw)`.
  - De drie regels die `designTokenStyles.test.js` zoekt blijven letterlijk staan. Het beheerdeel niet aanraken (fase 3).

- [ ] **Step 5: Stijlgids** — in `src/pages/AdminStijlgidsPage.jsx` voeg in het raster `data-stijlgids="logo"` een derde kaart toe (de echte pillen lezen Firestore, dus hier alleen de opmaak). Voeg `Sparkles, Star, Target, Users` toe aan de lucide-import (`Coins` staat er al):

```jsx
          <Kaart data-stijlgids="pillen">
            <KaartKop titel="Pillen in de menubalk" uitleg="Tokens, niveau, weekdoel, klasdoel en een event. 44px hoog, net als de knoppen ernaast." />
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="lo-pil"><Coins size={17} className="lo-pil-icoon text-[var(--lo-oranje-inkt)]" /><span>159</span></button>
              <span className="lo-pil"><Star size={17} className="lo-pil-icoon text-[var(--lo-oranje-inkt)]" aria-hidden="true" /><span>Niveau 4</span><span className="lo-pil-balk lo-pil-balk--blauw" aria-hidden="true"><i style={{ width: '60%' }} /></span></span>
              <span className="lo-pil"><Target size={17} className="lo-pil-icoon text-[var(--lo-blauw)]" aria-hidden="true" /><span>Weekdoel 3/7</span><span className="lo-pil-balk" aria-hidden="true"><i style={{ width: '43%' }} /></span></span>
              <span className="lo-pil lo-pil--groen"><Users size={17} aria-hidden="true" /><span>Klasdoel gehaald</span></span>
              <span className="lo-pil lo-pil--geel"><Sparkles size={17} aria-hidden="true" /><span>Dubbele XP</span></span>
            </div>
          </Kaart>
```

(`Kaart` geeft extra attributen door via `...rest`.)

- [ ] **Step 6: Controleren en commit**

Run: `npx eslint` op de acht JSX-bestanden en het testbestand; `node --test src/lib/`; `npm run build`.

```bash
git add src/styles/leeromgeving.css src/lib/leeromgevingStijl.test.js src/components/tokens/TokenBalancePill.jsx src/components/tokens/NiveauPill.jsx src/components/tokens/WeekdoelPill.jsx src/components/klas/KlasDoelPill.jsx src/components/klas/EventPill.jsx src/components/layout/AppShell.jsx src/pages/AdminStijlgidsPage.jsx
git commit -m "style(menubalk): pillen voor tokens, niveau, weekdoel, klasdoel en event in de leeromgeving-stijl

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Het profiel

**Files:**
- Modify: `src/pages/StudentProfilePage.jsx` (581 regels)
- Modify: `src/components/tokens/BadgesPaneel.jsx`, `src/components/avatar/CompanionKaart.jsx`, `src/components/profiel/TaalKeuzeKaart.jsx`
- Niet: `NulmetingProfielKaart.jsx` (gedeeld met de docentkant), `ProfielAvatar.jsx`, `HelixAvatar.jsx`, `HelixCompanion.jsx`.

**Interfaces:** Consumes `Kaart`, `KaartKop`, `PaginaKop`, `Label` uit `src/components/leeromgeving` en de vertaaltabel.

Wat er per plek gebeurt (regelnummers bij benadering):
- Kop (250-255): `helix-eyebrow` + `helix-heading-xl` → `<PaginaKop eyebrow={…} titel={…} />` met dezelfde teksten.
- Startprofielkaart (259-277): `helix-card` → `<Kaart>`; `btn-secondary` → `lo-knop-tweede self-start`. `NulmetingProfielKaart` blijft zoals hij is.
- Avatarkaart (281-366): `helix-card`/eigen randen → `lo-kaart`; de banner met het inline verloop, de avatar-wrapper, de pop-over en de inline accenten blijven. De gele certificaatlink (331-336, vaste hex) → `lo-knop-start` (blijft een link). Pins: geen hoofdletters, `Label`-achtig (`lo-label` met de inline pinkleur als achtergrond mag blijven). E-mail- en klasregels → `lo-lijst` met `lo-rij` en `lo-onderregel`, of een `dl` met `lo-onderregel`-labels; geen hoofdletters.
- "Mijn voortgang" (376-404): `helix-card` → `<Kaart>` met `<KaartKop>`; `ProgressBar` (21) → `lo-voortgang`.
- Hoofdstukkaarten (415-483, slate/blue/green) → een `lo-lijst` met per hoofdstuk een `lo-rij`: titel `lo-rij-titel`, onderregel `lo-onderregel`, voortgang `lo-voortgang` (breedte uit de bestaande berekening), PLUS-label (462) → `<Label kleur="paars">`, "af" → `<Label kleur="groen">`. De `EmptyState` (34) → `lo-melding lo-melding--info`.
- Wachtwoordformulier `StudentPasswordForm` (493-581): `helix-card` → `<Kaart>`, `input-auth` → `lo-invoer`, labels → `lo-veldlabel`, de knop → `lo-knop`, meldingen → `lo-melding`.
- `BadgesPaneel.jsx`: `helix-card` → `<Kaart>`, `helix-eyebrow` → `lo-eyebrow`, de `dt` in hoofdletters → `lo-onderregel`; badges als `lo-label`/`lo-label--…` waar het nu pilletjes zijn; vaste hex → tokens.
- `CompanionKaart.jsx`: `helix-card` → `lo-kaart`; `helix-btn-solid` → `lo-knop`; kleurstalen houden hun inline kleur, de gekozen staat blijft `aria-pressed` met `ring-4` (ringkleur → `ring-[var(--lo-inkt)]`); vaste hex → tokens.
- `TaalKeuzeKaart.jsx`: `helix-card` → `<Kaart>`, `helix-eyebrow` → `lo-eyebrow`, taalknoppen → `lo-keuzes`/`lo-keuze` met de bestaande `aria-pressed`.

- [ ] **Step 1:** Pas de vier bestanden aan volgens de lijst en de vertaaltabel.
- [ ] **Step 2:** `npx eslint` op de vier bestanden; `node --test src/lib/`; `npm run build`; de grep uit de Global Constraints. Controleer met `git diff -U0 | grep '^[-+]' | grep -v className` dat er geen handlers, voorwaarden of teksten veranderden (wel: imports, vervangen elementen zoals `div` → `Kaart`).
- [ ] **Step 3: Commit** `style(profiel): profiel, badges, companion en taalkeuze in de leeromgeving-stijl` met de vier paden.

---

### Task 3: De tokenshop

**Files:**
- Modify: `src/pages/StudentTokenShopPage.jsx` (654 regels; met de onderdelen `SpaardoelKaart`, `ShopKaart`, `ProfielVoorbeeld`, `BevestigVenster`, `UitpakMoment`, `Balk`, `ItemBeeld` in hetzelfde bestand)
- Niet: `AvatarMaker.jsx` en `PrivilegesSectie.jsx` (Task 4), `HelixAvatar.jsx`.

Wat er per plek gebeurt (regelnummers bij benadering):
- Kader (270) en kop (271-276): crème kader met inktrand weg (zie vertaaltabel); `ds-anchor` + `ds-display` "Tokenshop" → `<PaginaKop titel="Tokenshop" acties={saldo}/>`, het saldo als `lo-pil` met `Coins` (zoals de menubalk).
- Meldingen (280-281) → `lo-melding` (succes groen, fout `--fout`).
- `SpaardoelKaart` (459) → `<Kaart>` met `KaartKop`; `Balk` → `lo-voortgang`.
- "Etalage van deze week" (305) en "De hele collectie" (322): `ds-display` → `<KaartKop>` of `lo-kaart-titel` in een `Kaart`; de tabbladen (321-346) → `lo-keuzes`/`lo-keuze` met de bestaande `aria-pressed`/`aria-selected`/`role`.
- Seizoensmelding (298) → `lo-melding lo-melding--info`.
- `ShopKaart` (500): kaart met inktrand en harde schaduw → `lo-kaart` (binnenmarge mag kleiner: `p-4`); naam `lo-rij-titel`; prijs `<Label kleur="oranje" icoon={Coins}>`; zeldzaamheid `Label` (gewoon blauw, zeldzaam paars, episch/legendarisch oranje; noem je keuze); kopen → `lo-knop`, passen/verlanglijst → `lo-knop-tweede`; uitgeschakeld blijft uitgeschakeld (`disabled`). `ItemBeeld` (447) houdt zijn avatar-wrapper.
- Zijkolom: `ProfielVoorbeeld` (557) → `lo-kaart`, de bannerafbeelding, kaderafbeelding en accenten blijven inline. Verlanglijst (352), Mijn spullen (371), Geschiedenis (400) → elk een `<Kaart>` met `KaartKop` en een `lo-lijst` met `lo-rij`; aantallen en data `lo-onderregel`.
- `BevestigVenster` (606): het venster → `lo-kaart` met de bestaande maximale breedte; de `ds-anchor`-band met "Kopen?" (616) → `lo-kaart-titel`; ja → `lo-knop`, nee → `lo-knop-tweede`. Escape en achtergrondklik blijven.
- `UitpakMoment` (633-653): de klasse `uitpak-moment` en het `<style>`-blok blijven; "Nieuw!" (638, `ds-display`) → `text-[34px] font-extrabold leading-tight text-[var(--lo-inkt)]`; de kaart eromheen → `lo-kaart` zonder harde schaduw.

- [ ] **Step 1:** Pas het bestand aan volgens de lijst en de vertaaltabel.
- [ ] **Step 2:** Controles zoals in Task 2, plus de grep; noem in je rapport elke hexwaarde die bleef en waarom.
- [ ] **Step 3: Commit** `style(tokenshop): tokenshop zonder Bangers en inktranden, in de leeromgeving-stijl` met dat ene pad.

---

### Task 4: Avatarmaker en privileges

**Files:**
- Modify: `src/components/avatar/AvatarMaker.jsx` (193 regels), `src/components/shop/PrivilegesSectie.jsx` (134 regels)

- `AvatarMaker`: de gele band (74) met `ds-display` "Mijn avatar" (75) → `<KaartKop titel="Mijn avatar" />` bovenin een `lo-kaart`; onderdeelkeuzes (tabbladen) → `lo-keuzes`/`lo-keuze` met de bestaande `aria-pressed`; kleurstalen houden `style={{ background: optie.kleur }}`, de gekozen staat `ring-4 ring-[var(--lo-inkt)]` plus `aria-pressed`; avatar-wrappers (81, 167) blijven; opslaan → `lo-knop`, ongedaan maken/annuleren → `lo-knop-tweede`; `uppercase` (27) weg; vaste hex → tokens.
- `PrivilegesSectie`: `ds-display` "Privileges" (56) → `<KaartKop>` in een `lo-kaart`; elk privilege als `lo-rij` in een `lo-lijst` of als klein kaartje met `rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)]`; prijs `<Label kleur="oranje" icoon={Coins}>`; status (aangevraagd, toegekend) `Label`; aanvragen → `lo-knop-start` of `lo-knop`; het venster (115-118) met `ds-anchor`/"Aanvragen?" → `lo-kaart` met `lo-kaart-titel`, ja `lo-knop`, nee `lo-knop-tweede`. Escape en achtergrondklik blijven.

- [ ] **Step 1:** Pas beide bestanden aan.
- [ ] **Step 2:** Controles zoals in Task 2.
- [ ] **Step 3: Commit** `style(tokenshop): avatarmaker en privileges in de leeromgeving-stijl` met beide paden.

---

### Task 5: Mijn klas, stemmen en wedstrijd

**Files:**
- Modify: `src/pages/StudentKlasPage.jsx` (300 regels), `src/components/klas/StemEnWedstrijd.jsx` (192 regels)

- `StudentKlasPage`: beheerdersterugval (52-58) mag mee in de stijl (`lo-melding--info`); kader (95) weg; kop (96-101) → `<PaginaKop titel="Mijn klas" acties={complimententeller}/>`, de teller als `<Label kleur="paars">` of `lo-pil` (noem je keuze); meldingen (104-105) → `lo-melding`; `KlasDoelKaart` (182) → `<Kaart>` met `KaartKop` en `lo-voortgang`, gehaald als `<Label kleur="groen">`; "Je klasgenoten" (115, `ds-display`) → `lo-kaart-titel` boven het raster; `LeerlingKaart` (208): `relative` blijft, kaart → `lo-kaart p-4 items-center text-center`, eigen kaart ("Dit ben jij") met `outline outline-2 outline-[var(--lo-blauw)]` en `<Label kleur="blauw">`, niveau als `Label`, de complimentknop → `lo-knop-start`; de pop-over (278) → `lo-kaart` met `p-3` en de bestaande positie; titelkleur en pinkleur uit shopitems blijven inline; vitrine (138) → `<Kaart>` met `KaartKop`, de vinkjes blijven `input type="checkbox"` met `accent-[var(--lo-blauw)]`; "Complimenten voor jou" (157) → `<Kaart>` met een `lo-lijst`; `uppercase` (191, 280) weg.
- `StemEnWedstrijd`: "Stem mee" (52) en "Ontwerpwedstrijd" (134) → elk een `<Kaart>` met `KaartKop`; stemopties → knoppen met `rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)]` en gekozen `border-[var(--lo-inkt)] bg-[var(--lo-geel-zacht)]` (de bestaande voorwaarde blijft); de uitslagbalk (71, absolute `span` met inline breedte) blijft, kleur → `bg-[var(--lo-blauw-zacht)]`; uploaden → `lo-knop-tweede` (verborgen invoer en ref blijven); insturen → `lo-knop`; winnaar (177, `#FFB400`) → `border-[var(--lo-geel)] ring-2 ring-[var(--lo-geel)]` plus `<Label kleur="oranje">` als er een winnaarstekst staat.

- [ ] **Step 1:** Pas beide bestanden aan.
- [ ] **Step 2:** Controles zoals in Task 2.
- [ ] **Step 3: Commit** `style(klas): Mijn klas, stemmen en wedstrijd in de leeromgeving-stijl` met beide paden.

---

### Task 6: Spellenoverzicht en het niveau-moment

**Files:**
- Modify: `src/pages/StudentSpellenPage.jsx` (123 regels), `src/components/tokens/NiveauOmhoogMoment.jsx` (44 regels)
- Niet: `GamePlayer.jsx` (gedeeld met beheer en de lespagina; eigen beeld), `EmoteMoment.jsx`.

- `StudentSpellenPage`: kop (72-76) → `<PaginaKop eyebrow=… titel=… uitleg=…/>` met de bestaande teksten; de groene melding (81) → `lo-melding` met `bg-[var(--lo-groen-zacht)] text-[var(--lo-groen-inkt)]`; lege staat (91) → `<Kaart>` met het icoon in `text-[var(--lo-grijs)]`; per spel (101-116) `helix-surface p-6` → `<Kaart>`; de eigen `h2` + beschrijving blijven als `KaartKop` (`GamePlayer` toont ook een titel; laat die dubbele titel staan en noem het in je rapport).
- `NiveauOmhoogMoment`: de klasse `niveau-moment` en het `<style>`-blok blijven; "Niveau N!" (26, `ds-display text-[44px]`) → `text-[44px] font-extrabold leading-none text-[var(--lo-inkt)]`; de gele kaart blijft geel (`bg-[var(--lo-geel)]`), maar inktrand en harde schaduw → `border-2 border-[var(--lo-inkt)] shadow-[var(--lo-schaduw-kaart)]` en hoek `rounded-[var(--lo-hoek-xl)]`; vaste hex → tokens. Hij staat ook in de bovenbalk van de les; de plaats blijft hetzelfde.

- [ ] **Step 1:** Pas beide bestanden aan.
- [ ] **Step 2:** Controles zoals in Task 2.
- [ ] **Step 3: Commit** `style(spellen): spellenoverzicht en niveau-moment in de leeromgeving-stijl` met beide paden.

---

### Task 7: Fase 2c afronden en live zetten (controller)

- [ ] **Step 1:** `npx eslint` op alle gewijzigde bestanden, `node --test src/lib/`, `npm run build`, `npx playwright test --reporter=line` → groen. `grep -rn "ds-display\|ds-anchor" src --include=*.jsx` → alleen nog `HelpPaneel` (fase 3), het certificaat en de spellen.
- [ ] **Step 2:** Stijlgids bekijken op desktop en 375px (pillen); als ontwikkelaar-leerling `/profiel`, `/tokenshop`, `/spellen`, `/klas` openen (zonder Firestore-data tonen ze hun lege of laadstaat); schermafbeeldingen naar `exports/leeromgeving/fase-2c-*.jpg`.
- [ ] **Step 3:** `docs/LEEROMGEVING-STIJL.md`: `.lo-pil` bij de bouwstenen; regel "Bangers staat alleen nog in de spellen en het certificaat". `docs/HANDOFF.md` paragraaf 5: alinea fase 2c live met markering en deploy-id; paragraaf 6: fase 3 is het volgende (docentomgeving, met de knoppenbalken), testronde van Kevin voor 2c.
- [ ] **Step 4:** Commit de documenten; `git tag -a leeromgeving-fase-2c -m "HELIX Leeromgeving-stijl fase 2c: menubalk, profiel, tokenshop, Mijn klas, spellen"`; `git push origin codex/digitale-vaardigheden-seed --follow-tags`; `npx vercel --prod --yes`; live CSS controleren op `lo-pil`; deploy-id in de handoff, commit en push.

---

## Self-review

- **Spec 3.2 gedekt:** menubalk met pillen (Task 1, met een gemotiveerde afwijking: `.lo-pil` in plaats van `.lo-label`, voor de 44px-raakmaat); profiel (Task 2); tokenshop (Task 3 en 4); spellenoverzicht (Task 6); Mijn klas (Task 5); Bangers eruit in `StudentKlasPage`, `StudentTokenShopPage`, `AvatarMaker`, `StemEnWedstrijd`, `PrivilegesSectie`, `NiveauOmhoogMoment` (Task 3-6).
- **Gedeeld en dus niet aangeraakt:** `NulmetingProfielKaart`, `GamePlayer`, `HelixAvatar`, `HelixCompanion`, `EmoteMoment`, `CertificaatPage`.
- **Namen:** `.lo-pil`, `.lo-pil--groen`, `.lo-pil--geel`, `.lo-pil-icoon`, `.lo-pil-balk`, `.lo-pil-balk--blauw` in Task 1 gedefinieerd en in Task 1 en 3 gebruikt.
