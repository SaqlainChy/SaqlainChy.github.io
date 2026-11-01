# Codex Portfolio Change Report

## 1. Task Summary

The portfolio was updated without redesigning the existing site. The requested work was limited to applying Poppins as the primary site typeface and rebuilding the Technical Skills presentation as independent, responsive cards with bullet lists and a stronger transform-based hover treatment.

Follow-up changes added visible recommended media dimensions to project placeholders, refreshed the Technical Skills lists from the user's latest set while retaining Verilog and VHDL, set a consistent minimum skill-card height, and presented Experience & Activities as hoverable clickable tiles with inline expansion.

Latest updates: added visible hero portrait dimensions, matched the experience hover scale to the skill cards, and added an Achievements section. The achievement marquee has now been replaced with a center-focused, index-driven sliding carousel.

Project image follow-up: the existing project dialogs remain the primary detail views. Configured images now stay bounded inside their media frames, UAV `gallery-01.jpg` is mapped as the featured image, and empty configured galleries are suppressed.

## 2. Files Modified

### index.html

- Added the official Google Fonts connection and stylesheet links for Poppins.
- Loaded Poppins weights 300, 400, 500, 600, and 700.
- Kept the existing Technical Skills section heading structure and changed its visible title to `Technical Skills`.
- Replaced the former comma-separated skill descriptions with six semantic skill cards.
- Added a heading and a proper unordered bullet list to every skill card.
- Added visible recommended pixel dimensions and aspect ratios to project image placeholders.
- Mapped the existing UAV `assets/images/uav/gallery-01.jpg` as the UAV's featured image inside its existing project dialog and as the optional project-card thumbnail.
- Kept configured project images inside bounded media placeholders in the existing dialogs; empty `gallery` arrays hide only the matching gallery section.
- Added a visible 1200 × 1500 px (4:5 portrait) recommendation beneath the hero/profile image.
- Added an Achievements section immediately after Experience & Activities.
- Added the `assets/images/achievements/` folder and a JavaScript image registration list.
- Updated the three Experience & Activities entries with concise summaries and expandable detail lists.
- Converted the experience entries into interactive tiles that reveal details inline when clicked.
- Updated skill names to the user's latest terminology, merged overlapping categories, and retained Verilog and VHDL.

### styles.css

- Added the central `--font-primary` variable and applied it to the body.
- Removed the obsolete connected table/grid-cell styles for `.skill-group`.
- Added independent `.skill-card` styling with separate borders, backgrounds, rounded corners, and spacing.
- Added compact `.skill-list` bullet styling with accent-colored markers.
- Set skill cards to a common minimum height so all grid tiles align consistently.
- Added readable dimension guidance for main, supporting, and gallery media placeholders.
- Added 1200 × 1500 px (4:5 portrait) guidance beneath the hero/profile image and 1200 × 800 px (3:2 landscape) guidance for achievement images.
- Styled native expandable experience detail summaries and lists.
- Added experience tile hover/focus treatment and inline detail expansion without opening dialogs.
- Matched experience hover scale/translation to skill-card behavior on hover-capable devices.
- Added achievement card, clipped center-focused carousel, responsive sizing, and reduced-motion styles.
- Added the requested transform-only hover animation and subtle border, background, and shadow changes.
- Added a 1100px skills-grid breakpoint and retained the existing 720px mobile breakpoint.
- Extended the existing reduced-motion rule to remove skill-card scaling and translation.

### script.js

- Added a commented `achievementImages` array. Add one `{ src, alt }` entry per image stored in `assets/images/achievements/`.
- Generates accessible clickable cards from the array and removes failed images without leaving broken-image icons.
- Positions each card relative to the active slide index, with progressively smaller neighbor cards; no DOM cloning or marquee loop is used.
- Controls autoplay with a single timer, and supports pointer/focus pause, image selection, outside-click resume, keyboard arrows, touch swipes, and reduced-motion behavior.

### CODEX_CHANGE_REPORT.md

- Updated the change record for the latest hero, experience, and achievement-carousel work.

## 3. Typography Changes

- Primary font: Poppins.
- Source: official Google Fonts stylesheet loaded in `index.html`.
- Loaded weights: 300, 400, 500, 600, and 700.
- CSS variable: `--font-primary: "Poppins", sans-serif`.
- Global application: `body { font-family: var(--font-primary); }`.
- Existing deliberately technical elements retain their monospace font stacks, including project numbers, profile fallback labels, and media-placeholder labels.

## 4. Technical Skills Structure

The section contains six independent `<article class="skill-card">` elements:

1. Embedded Systems & Programming
2. Electronics & Hardware
3. Robotics & Control
4. CAD, Design & Simulation
5. Fabrication & Prototyping
6. Digital Design

Each card contains an `h3` category heading and a semantic `ul.skill-list` with the exact requested skills as list items. The cards sit inside the reusable `.skills-grid`, which supplies responsive columns and gaps without visually connecting the cards.

The six-card content reflects the updated list: embedded programming, PCB/electronics, robotics/control, CAD/simulation, fabrication/prototyping, and digital design. Redundant motor-control tools are grouped into their relevant categories, and Verilog and VHDL remain in Digital Design.

## 5. Hover Behaviour

- Scale: `1.06`.
- Vertical translation: `-6px`.
- Transition duration: `350ms` for transform, border, background, and shadow.
- Easing: `ease-out`.
- Hover styling: a brighter accent-tinted border, a slightly stronger surface background, a restrained shadow, and `z-index: 2`.
- Layout stability: the effect uses CSS transforms, so card dimensions and neighboring grid items do not move.
- Pointer behavior: the hover treatment is limited to devices matching `(hover: hover) and (pointer: fine)`.
- Reduced motion: the existing `prefers-reduced-motion: reduce` rule shortens animation durations and explicitly removes the skill-card hover transform.

## 6. Responsive Behaviour

- Desktop above 1100px: three skill cards per row.
- Tablet and smaller laptop at 1100px or below: two skill cards per row.
- Mobile at 720px or below: one skill card per row.
- Browser checks were performed at 1440px, 1024px, 768px, and 390px. The observed column counts were 3, 2, 2, and 1 respectively, with no horizontal document overflow.
- Cards use natural content height because the grid uses `align-items: start`.
- Skill cards share a 370px minimum height for consistent tile sizing; longer headings or content can expand naturally if needed.

## 7. Existing Features Preserved

- Hero section: preserved.
- Profile image: preserved at `assets/images/profile.jpg`.
- Profile hover: preserved at its existing `scale(1.04)` behavior.
- Hero image recommendation: 1200 × 1500 px (4:5 portrait), matching the existing frame ratio.
- GitHub link: preserved and verified.
- LinkedIn link: preserved and verified.
- WhatsApp link: preserved and verified.
- Projects: all five project cards preserved.
- Project overlays: all five overlay elements preserved.
- Project detail scrolling: verified as internally scrollable.
- Close buttons: preserved.
- ESC closing: verified in the browser.
- Resume link: preserved at `assets/Saqlain_Newaz_Chowdhury_Resume.pdf`.
- Navigation: preserved, including the existing mobile navigation behavior.
- Experience: each role is a hoverable, keyboard-activatable tile with a concise summary and inline expanded details.
- Experience tiles use `translateY(-6px) scale(1.06)` on hover-capable devices and preserve inline expansion.
- Achievements appears immediately after Experience & Activities and reads from `assets/images/achievements/` through the `achievementImages` list in `script.js`.
- Achievement image recommendation: 1200 × 800 px (3:2 landscape).
- The carousel uses an explicit active index with the focused card centered and enlarged, neighboring cards progressively smaller, and cards beyond the visible range hidden.

## 8. Testing Performed

- Parsed the updated HTML and verified all six skill-card categories and bullet counts.
- Confirmed the exact Poppins Google Fonts URL and requested weights.
- Confirmed the central font variable and inherited body font in rendered browser styles.
- Confirmed obsolete `.skill-group` markup and CSS were removed.
- Checked JavaScript syntax with `node --check`.
- Checked CSS brace balance.
- Rendered the site in a browser at 1440px, 1024px, 768px, and 390px.
- Verified responsive skill-grid column counts and absence of horizontal overflow.
- Visually inspected desktop and mobile card rendering.
- Verified an existing project overlay opens, scrolls internally, locks body scrolling, and closes with Escape.
- Verified the five project cards and five project dialogs remain present.
- Verified GitHub, LinkedIn, WhatsApp, and résumé paths.
- Checked the browser console for errors and warnings; none were reported.

For this follow-up, source edits were reviewed and the existing behavior remains native HTML/CSS. No new browser checks were performed in this follow-up turn.

For the center-focused carousel update, `node --check script.js` passed, CSS braces were balanced (214 opening / 214 closing), all three configured achievement image files and required section elements were confirmed present, and obsolete marquee/clone code was confirmed absent. Browser testing was attempted at the local preview URL, but the browser could not connect to it; therefore viewport rendering at 1440px, 1024px, 768px, and 390px, live autoplay and input interactions, reduced-motion behavior, and browser console checks remain unverified for this update.

For the project-image follow-up, `node --check script.js` passed, CSS braces were balanced, the configured UAV image file was confirmed to exist, and source checks confirmed the native UAV dialog opener and positioned media frames are present. No browser testing was performed for this follow-up.

## 9. Known Issues / Concerns

The existing `assets/images/profile.jpg` file currently contains a webpage screenshot rather than a portrait photograph. This task preserved that file as instructed; it should be replaced with the intended portrait using the same path.

The Poppins font is served by Google Fonts, so first-load typography depends on network access. The CSS includes a generic sans-serif fallback.

Recommended image dimensions are displayed in each placeholder: main images 1600 × 900 px (16:9), supporting images 1200 × 800 px (3:2), and gallery images 900 × 600 px (3:2). Browser rendering may scale those sources to fit the responsive containers.

The hero/profile image `assets/images/profile.jpg` uses a 4:5 portrait frame; prepare it at 1200 × 1500 px. Achievement images belong in `assets/images/achievements/`, use 1200 × 800 px (3:2), and are registered with one `{ src, alt }` entry in the commented `achievementImages` array in `script.js`.

## Image Management Guide

## Achievement Carousel Behavior

- Achievements now uses a center-focused sliding carousel rather than a continuously moving marquee.
- The active image is larger and centered; the two neighboring positions progressively scale down.
- Autoplay advances one image every 3.6 seconds, with an approximately 850ms transform transition, and wraps the active index to the start without a visual reset.
- Hover and keyboard focus pause autoplay. Selecting an image centers it and keeps autoplay paused. Clicking outside the carousel resumes from the currently focused image.
- Left/right arrow keys navigate while a card is focused; a horizontal touch swipe advances or reverses the carousel.
- Reduced-motion preference disables autoplay and removes slide transitions. A single valid image remains centered; no valid images show the empty-state message.
- Missing or unsupported images are reported to the console and removed from the carousel. Supported extensions remain PNG, JPG, JPEG, and WEBP, case-insensitively.

To add an achievement image, put it in `assets/images/achievements/` (for example, `achievement-06.png`) and add one entry to `portfolioImages.achievements` in `script.js`:

```js
{ src: 'assets/images/achievements/achievement-06.png', alt: 'Describe the certificate, award, or event' },
```

Recommended source dimensions are 1200 × 800 px (3:2 landscape).

### Supported formats

PNG, JPG, JPEG, and WEBP are supported. The extension check is case-insensitive (`.PNG`, `.JPG`, etc.). The path itself must match the actual filename and capitalization, especially on case-sensitive hosting.

### Achievements

- Folder: `assets/images/achievements/`
- Recommended filename: `achievement-01.png`
- Add one entry to `portfolioImages.achievements` in `script.js`:

```js
{ src: 'assets/images/achievements/achievement-01.png', alt: 'Robotics competition award certificate' },
```

The carousel builds its cards from this list, reports failed paths to the browser console, and omits missing images.

### Projects

The existing project folders are retained:

- Fixed-Wing Surveillance UAV: `assets/images/uav/`
- Motorized Zoom / Focus Controller: `assets/images/zoom-controller/`
- Custom Quadcopter Flight Controller: `assets/images/quadcopter/`
- MOSFET Motor Driver PCB: `assets/images/motor-driver/`
- Nabik Emergency Relief Robot: `assets/images/nabik/`

In `portfolioImages.projects`, each project has a `main` object used as the featured image inside its existing detail dialog and as the optional project-card thumbnail. Its `gallery` array maps to the additional image slots in the dialog's Media Gallery section. An empty array hides that section. For example, add another UAV gallery image by placing it in that project's folder, then add:

```js
{ src: 'assets/images/uav/gallery-01.png', alt: 'UAV airframe CAD view' },
```

to `portfolioImages.projects.uav.gallery`. The images are children of their media frames inside the existing dialog; they do not replace the dialog or its project information. Invalid images are logged and only their image frame falls back to its placeholder. Each project maps to its own dialog, so images do not cross into another project's view.

### Project Images

- `main` is the featured image inside the existing project detail view and can also supply its project-card thumbnail.
- `gallery[]` contains additional images shown in the same detail view's Media Gallery section.
- `gallery: []` is valid and hides the empty Media Gallery section while preserving the rest of the detail view.
- Project images never replace the project detail interface. Media frames use a positioned container so their cover-fit images stay inside the frame.

The UAV example is configured as:

```js
uav: {
  main: {
    src: 'assets/images/uav/gallery-01.jpg',
    alt: 'Fixed-wing surveillance UAV',
  },
  gallery: [],
},
```

### Naming

Use lowercase filenames with hyphens, such as `main.png`, `gallery-01.webp`, or `achievement-02.jpg`. Avoid spaces and inconsistent capitalization. Existing filenames do not need to be renamed; use their exact path in the configuration.

### Recommended dimensions

- Hero portrait: 1200 × 1500 px (4:5)
- Project main images: 1600 × 900 px (16:9)
- Achievement images: 1200 × 800 px (3:2)
- Supporting project images: 1200 × 800 px (3:2)
- Gallery images: 900 × 600 px (3:2)

### Practical quick answer

If you have a new PNG achievement image, put it in `assets/images/achievements/`, name it `achievement-01.png` (or the next available number), then add this exact line inside `portfolioImages.achievements` in `script.js`:

```js
{ src: 'assets/images/achievements/achievement-01.png', alt: 'Describe the certificate, award, or event' },
```

For a new project detail image, put it in that project's existing folder and add a `{ src, alt }` object to that project's `gallery` array instead.

## 10. Recommendations for Next Edit

- Replace the current profile image file with the intended portrait.
- Add real project photographs and CAD or PCB imagery to the existing project media folders.
- Add demonstration videos to the prepared HTML5 video locations.
- Expand project overlays with verified engineering case-study content as material becomes available.
