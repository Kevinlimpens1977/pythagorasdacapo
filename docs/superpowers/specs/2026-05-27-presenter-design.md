# Presenter Design

Date: 2026-05-27
Status: Approved design for phased implementation planning

## Goal

Presenter is a new HELIX module for classroom smartboard use. It should feel like a professional fullscreen digibord tool, inspired by Prowise Presenter and SMART board software, while staying connected to HELIX lesson content over time.

The most important first impression is:

- Writing and drawing feel accurate and smooth on a CTOUCH-style digibord.
- Mathematics explanation feels precise through square grids, snap behavior, shapes, and measurement tools.

HELIX lesson import and interactive questions are important, but they build on top of this board foundation.

## Scope Strategy

Presenter will be built in two phases.

### V1a: Presenter Core

V1a is the usable smartboard foundation. It focuses on board interaction, page management, drawing, grid behavior, geometry, and local recovery.

### V1b: HELIX Content Layer

V1b adds integration with existing HELIX content: paragraph import, lesson blocks, interactive question windows, media inside imported blocks, and rendered page thumbnails.

This phased approach protects the core interaction quality. If pen, touch coordinates, scroll, grid, and measurement tools do not feel right, content import will not save the experience.

## Navigation And Entry

Presenter gets its own main navigation item named `Presenter` in the admin navigation, alongside `Lesstof`, `Voortgang`, `Leerlingen`, `Spellen`, and `Beheer`.

In V1a, clicking `Presenter` opens directly to a blank board within the existing HELIX admin shell. It does not open a separate landing page or source chooser.

Presenter has an optional browser fullscreen button. Browser fullscreen starts only after a user click. If fullscreen fails, Presenter shows a clear message and remains usable in its fullscreen-like app layout.

There is always a small exit action plus a toolbar action to return to HELIX.

## Board Model

Presenter uses pages: `Pagina 1`, `Pagina 2`, `Pagina 3`, and so on.

Each page can scroll vertically. Pages are not fixed 16:9 slides. They behave like a long smartboard page with a fixed internal coordinate model and variable height.

The board is visually responsive, but all drawing and object placement uses an internal coordinate space. Pointer coordinates are translated into that coordinate space so ink appears exactly where the finger or stylus touches, even when the viewport size changes.

The primary design and test basis is a 1920 x 1080 digibord. Laptop use may work, but digibord touch operation is the priority.

## Touch And Scrolling

Presenter is touch-first.

In pen mode:

- One finger or stylus writes.
- Scrolling happens only with two fingers or through a large touch-friendly scrollstrip.
- A normal accidental one-finger drag should not scroll the page while writing.

The scrollstrip is on the right side. It is narrow but easy to grab, with a clear draggable thumb. It appears only when the current page is taller than the viewport.

Zoom is not part of V1a. The only size adjustment related to the view is the grid size setting.

## Toolbar

Presenter uses a classic bottom toolbar direction.

The toolbar is auto-hide by default and can be pinned. It can reappear by hover/mouse at the bottom edge, tapping a small bottom tab, or swiping upward from the bottom on touch.

The fixed toolbar order is:

1. Previous page
2. Page indicator
3. Next page
4. Select
5. Undo
6. Redo
7. Pen
8. Objecten
9. Lesstof
10. Achtergrond
11. Pagina's
12. Fullscreen
13. Terug

`Select`, `Undo`, and `Redo` are always directly available.

The toolbar uses category buttons. Tapping a category opens a large touch-friendly popover above the toolbar. The `Pen` category is open by default when the toolbar appears.

V1a shows `Lesstof` and `Vraag` affordances as disabled or "komt in volgende versie" where relevant, so the future structure is visible without half-working behavior.

## Page Management

V1a supports:

- Previous and next page.
- Add page.
- Delete page, always with confirmation.
- Duplicate page.
- A simple left page overview with page numbers and automatic titles.

V1a does not support page reordering.

V1a does not render live page thumbnails. The page overview is textual. V1b adds real thumbnails that update when the page overview opens or when switching pages.

Undo and redo are per page. Actions on one page do not unexpectedly undo work on another page.

## Backgrounds And Grid

Pages open as a white board without grid.

V1a supports:

- White background.
- Lines overlay.
- Square grid overlay.

The grid must behave like mathematics notebook squares. The default should visually feel like 1 x 1 cm squares on the digibord. Grid squares must always stay square, never rectangular, even when the screen ratio changes.

Grid and lines are overlays. Turning them on or off does not change board content.

Grid size can be adjusted larger or smaller. Horizontal and vertical spacing always remain equal.

Snap-to-grid applies only when the square grid is enabled. Lines are visual only and do not snap.

Snap-to-grid affects objects, shapes, straight lines, and geometry tools. Normal free pen remains smooth. The meetkundepen/rechte-lijnpen snaps to the grid.

## Drawing Tools

V1a includes:

- Normal pen.
- Markeerstift.
- Meetkundepen/rechte-lijnpen.
- Gum.

New sessions start with black normal pen at a medium width.

Pen colors use fixed quick swatches plus a custom color picker. Initial swatches should include black, red, blue, green, yellow, and purple.

Drawing uses Pointer Events. If browser/device pressure is available, Presenter may use it subtly. The app must still work perfectly with fixed-width strokes when pressure is unavailable.

The gum only removes pen strokes. It does not remove objects. Objects are removed through selection UI.

## Layering

V1a uses a simple fixed layer order:

1. Background, grid, and lines.
2. Objects, shapes, imported lesson blocks, and question windows.
3. Markeerstift.
4. Loose text objects, once text is added in V1b.
5. Normal pen and meetkundepen strokes.

There is no layers panel in V1a.

Markeerstift appears over objects and shapes, but below loose text and normal pen strokes.

## Selection And Object Controls

V1a uses a dedicated select tool.

Selected objects show:

- Clear scale handles.
- Rotate handles only for object types that support rotation.
- A small red delete circle with an `x` in the top-right of the object. It must be large enough for touch use even if visually compact.
- A compact context toolbar near the object for object-specific actions.

Object deletion is immediate. Undo restores deleted objects.

V1a supports object duplication only for shapes and future text objects. Imported lesson blocks and questions are not duplicated as objects; they are re-imported or re-added in V1b.

Object lock/unlock is not in V1a.

## Shapes

V1a includes all planned visual and mathematical shapes:

- Rectangle.
- Circle/oval.
- Line.
- Arrow.
- Triangle.
- Polygon/free-form shape by tapping points and closing by double tap or tapping the start point.
- Axes object.
- Table/grid object.
- Angle marking.

Shapes support outline and optional fill. Fill transparency is not in V1a.

Mathematical shapes are modeled as distinct object types, even if some are visually simple in V1a. This keeps room for later scale, labels, and richer editing.

Shape labels may show lengths or angles where relevant. Labels should be automatically calculated when possible, but editable/overridable by the teacher.

## Measurement Tools

V1a includes all main mathematics instruments:

- Liniaal.
- Geodriehoek.
- Passer.
- Gradenboog.

These tools are temporary overlays. They help draw and measure, but they do not remain as permanent page objects. The resulting line, circle, arc, angle, or label remains on the board.

The liniaal and geodriehoek can be moved, rotated, and used to draw straight lines along their edges.

The geodriehoek supports angle measurement.

The passer works like a compass: choose a center, set or drag a radius, and draw a circle or arc. Radius and diameter labels can be shown.

The gradenboog supports:

- Moving and rotating.
- Measuring an angle between two lines or points.
- Drawing an angle from a baseline.

## Text Tool

The text tool is not in V1a. It moves to V1b.

The planned V1b text tool supports rich text:

- Bold and italic.
- Lists.
- Alignment.
- Color and size.
- Standard HELIX font.
- Dyslexia-friendly font.
- Handwriting-like font.
- Simple mathematics symbol button for common symbols such as `2`, `sqrt`, `pi`, division, multiplication, less-than-or-equal, and greater-than-or-equal.

Scaling a text object scales the text size with the object.

## Local Recovery

V1a supports temporary local recovery through browser/session storage. Presenter does not save sessions to Firebase in V1a.

If there is recoverable local board state after refresh or returning to Presenter, the user sees a prompt such as: "Vorige Presenter-sessie herstellen?"

If the teacher tries to refresh or leave with unsaved board work, Presenter warns that local work may be lost.

The data model should be export-friendly even though export itself is not included in V1a.

## Keyboard Shortcuts

V1a supports basic shortcuts as a secondary convenience:

- `Ctrl+Z` for undo.
- `Ctrl+Y` for redo.
- `Delete` for selected object deletion.
- Arrow keys for previous/next page.
- `Escape` exits browser fullscreen when active; otherwise it cancels the active tool/action or returns to select mode.

Shortcuts are not the primary interaction model. Touch UI is primary.

## Visual Style

Presenter should visually resemble professional digibord software more than a decorative HELIX marketing screen.

The board is central. Tool chrome is neutral, restrained, and functional. HELIX identity may appear through subtle accents and navigation, but the working mode should stay calm.

There is no UI theme switch in V1a. Background choice is limited to white, lines, and grid.

No first-time tour is included. Tools in large popovers use clear icon-plus-short-label presentation instead of relying on hover tooltips.

## V1b HELIX Content Layer

V1b adds HELIX content integration.

### Import Flow

The `Lesstof` toolbar category opens a large fullscreen chooser.

The chooser follows the existing lesson structure:

1. Chapter.
2. Paragraph.
3. Import.

Only published blocks are imported. Concept blocks are not imported.

Before import, Presenter shows a short confirmation such as: "Deze paragraaf maakt 8 Presenter-pagina's."

If a paragraph has no published blocks, Presenter shows a clear message and imports nothing.

Import appends new pages after the existing Presenter pages. It does not replace current pages.

Imported content is a snapshot. Later CMS changes do not automatically update Presenter pages.

Long blocks offer a teacher choice during import: keep as one scrollable page or split across pages.

### Imported Lesson Blocks

Each imported lesson block creates a Presenter page by default.

Theory and example blocks render as large readable board content, not as heavy web cards.

Imported lesson blocks are movable and scalable with the select tool. Scaling also scales the text/content. Lesson blocks stay upright and are not rotatable.

Media inside imported lesson blocks can play in place. Audio/video controls should be large and digibord-friendly.

### Question Windows

Questions appear as free movable and scalable question windows on the page. They do not have a permanent title bar.

The teacher can fill in the question as an overlay/demonstration. This does not modify the original question data.

Pen annotations over questions stay on the page layer and do not move with the question if the question is moved later.

Question windows can be selected and controlled through the object context toolbar. A fullscreen action may be available from the context toolbar.

The `Controleer` button appears only after the teacher has entered or selected an answer.

After checking, the whole question window receives a subtle green or red border. For fill-blank questions with multiple gaps, incorrect fields are also marked red.

There is a `Reset antwoord` action after checking.

There is no `Toon antwoord` action in V1b.

Tokens are not shown or used in Presenter.

### Supported Question Types

V1b supports all existing question types:

- Open.
- Meerkeuze.
- Numeriek.
- Koppelen.
- Invullen.
- Volgorde.

Open questions are not automatically checked.

Meerkeuze follows question data. If one answer is correct, the UI behaves as single-select. If multiple answers are correct, it behaves as multi-select.

Koppelvragen are answered by drawing lines between items.

Volgordevragen use tap order. The teacher taps items in sequence and they fill an answer row.

Numerieke vragen reuse the existing smart answer control logic.

Invulvragen reuse the existing smart spelling/equivalence logic.

### Page Thumbnails

V1b adds real page thumbnails in the left page overview. They update when switching page or opening the overview, not live while drawing.

## Explicitly Out Of Scope

V1a excludes:

- Firebase-saved Presenter sessions.
- Student device participation.
- Live student response collection.
- Lesson import.
- Interactive question windows.
- Text tool.
- Page thumbnails.
- Export.
- Timer.
- Spotlight.
- Screen curtain.
- Lock/unlock.
- Page reordering.
- Upload from computer.

V1b still excludes:

- Firebase-saved reusable Presenter sessions unless separately designed.
- Student live participation.
- Full export implementation unless separately designed.
- Timer, spotlight, and screen curtain unless promoted into a later phase.

## Testing And Verification Expectations

Implementation plans should include automated tests for pure board/state logic:

- Page add/delete/duplicate.
- Undo/redo per page.
- Grid square calculations.
- Snap-to-grid behavior.
- Shape data models.
- Local recovery serialization.
- Question state logic in V1b.

Manual/browser verification is required for:

- Pointer coordinate accuracy.
- Touch drawing behavior.
- Two-finger scroll versus one-finger drawing.
- Scrollstrip usability.
- Toolbar auto-hide and pin behavior.
- Fullscreen behavior and failure message.
- Digibord-size layout at 1920 x 1080.

## Open Implementation Notes

The implementation plan should decide the rendering engine after inspecting the existing React structure. The likely direction is a focused Presenter state layer plus canvas/SVG/HTML overlay rendering split by responsibility:

- Canvas or SVG for pen strokes and geometry.
- HTML overlays for toolbar and future interactive question windows.
- Structured serializable page state for recovery and future export.

The design requires exact coordinate translation. That should be treated as core infrastructure, not a visual afterthought.
