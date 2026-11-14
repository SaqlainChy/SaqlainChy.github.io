# Codex Portfolio Change Report

## 1. Task Summary

The portfolio was updated without redesigning the existing site. The requested work was limited to applying Poppins as the primary site typeface and rebuilding the Technical Skills presentation as independent, responsive cards with bullet lists and a stronger transform-based hover treatment.

Follow-up changes added visible recommended media dimensions to project placeholders, refreshed the Technical Skills lists from the user's latest set while retaining Verilog and VHDL, set a consistent minimum skill-card height, and presented Experience & Activities as hoverable clickable tiles with inline expansion.

Latest updates: added visible hero portrait dimensions, matched the experience hover scale to the skill cards, and added an Achievements section. The achievement marquee has now been replaced with a center-focused, index-driven sliding carousel.

Project image follow-up: the existing project dialogs remain the primary detail views. Configured images now stay bounded inside their media frames, UAV `gallery-01.jpg` is mapped as the featured image, and empty configured galleries are suppressed.

Project subsection image update: all existing project image placeholders are now connected to project/category arrays in the centralized mapping. CAD, electronics, mechanical, wiring, schematic, and PCB categories support multiple images while empty arrays preserve their original placeholders.

Project video update: added optional `videos[]` arrays to the existing per-project configuration and a renderer for native HTML5 players. Empty arrays hide the entire Video section; no actual video files are present yet, so all projects currently hide it.

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
- Added `data-project-image-slot` markers to all 31 existing project image frames and connected them to each project's centralized configuration.
- Added project-specific arrays for `cad`, `electronics`, `mechanical`, `wiring`, `schematic`, and `pcb`, for the matching subsections already present in the dialogs.
- Preserved labeled placeholders for empty subsection arrays; configured arrays add or remove frames to match their entries and restore a clean fallback when an image fails.
- Updated the image placement guide with the new subsection mappings and exact CAD/Electronics examples.
- Added optional centralized `videos[]` configuration and marked the existing project Video sections for rendering from that data.
- Added native video players with controls, inline playback, metadata preload, no autoplay, extension-based MIME types for MP4/WebM/OGV/OGG, optional posters, titles, and multiple videos per project.
- Hides the complete Video section when no video is configured or all paths are unsupported. Runtime load failures are logged and remove the failed player; the section hides if none remain. A poster failure removes only the poster.
- Updated `IMAGE_PLACEMENT_GUIDE.txt` with video folders, supported formats, `videos[]` examples, optional poster/multiple-video behavior, and missing/invalid-video handling.
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
- Projects: all five cards were preserved at that earlier stage; the latest update below consolidates the two drone subsystem cards into four current cards.
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
- Earlier baseline verification found five project cards and five project dialogs; the latest update below merges the quadcopter and motor-driver views into one card and dialog.
- Verified GitHub, LinkedIn, WhatsApp, and résumé paths.
- Checked the browser console for errors and warnings; none were reported.

For this follow-up, source edits were reviewed and the existing behavior remains native HTML/CSS. No new browser checks were performed in this follow-up turn.

For the center-focused carousel update, `node --check script.js` passed, CSS braces were balanced (214 opening / 214 closing), all three configured achievement image files and required section elements were confirmed present, and obsolete marquee/clone code was confirmed absent. Browser testing was attempted at the local preview URL, but the browser could not connect to it; therefore viewport rendering at 1440px, 1024px, 768px, and 390px, live autoplay and input interactions, reduced-motion behavior, and browser console checks remain unverified for this update.

For the project-image follow-up, `node --check script.js` passed, CSS braces were balanced, the configured UAV image file was confirmed to exist, and source checks confirmed the native UAV dialog opener and positioned media frames are present. No browser testing was performed for this follow-up.

For the project-subsection mapping update, `node --check script.js` passed; CSS brace balance (215/215), all 31 image placeholders matched their 31 slot markers, project keys, subsection group names, and the existing UAV main-image path were checked in source. Browser interaction and responsive rendering were not tested for this update.

For the project-video update, source checks confirm five marked Video sections, five empty `videos` arrays, and MIME mappings for MP4/WebM/OGV/OGG. JavaScript syntax and CSS brace balance were checked. A Node DOM simulation verified hidden empty sections, native player options, multiple-video behavior, individual/all load-error handling, and invalid-extension handling. No actual video file exists in `assets/videos/`, so valid playback and mobile rendering could not be browser-tested.

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

### Project Detail Subsection Image Slots

- Added explicit `data-project-image-slot` markers to all 31 existing project image frames and connected them to `portfolioImages.projects`.
- The UAV `cad[]` maps to its two CAD/Airframe frames; `electronics[]` maps to its Electronics frame.
- Other existing groups are mapped by project: zoom controller `electronics[]` and `mechanical[]`; quadcopter `electronics[]` and `wiring[]`; motor driver `schematic[]` and `pcb[]`; Nabik `cad[]` and `electronics[]`.
- All arrays support multiple images. Additional frames are inserted in the matching group; surplus pre-existing frames are removed when a non-empty array has fewer entries. Empty non-gallery arrays preserve their original labeled placeholders. Empty `gallery[]` hides the empty Media Gallery section.
- Invalid or missing configured files log an error and restore the slot's placeholder/fallback. The project dialog and all non-image content remain intact.
- Updated `IMAGE_PLACEMENT_GUIDE.txt` with exact keys, folder examples, filename patterns, and subsection array examples.
- Status: Main, gallery, CAD, electronics, mechanical, wiring, schematic, and PCB image slots are `[ACTIVE]`. Video rendering is `[ACTIVE]` and optional; all current projects have empty `videos[]` arrays and hide the whole Video section. Testing/results sections remain text-only.

### Project Videos

- Video support is `[ACTIVE]` and configured separately from image arrays using each project's `videos[]` property.
- Files belong in `assets/videos/<project-folder>/`; accepted extensions are MP4, WebM, OGV, and OGG. Each entry may include `src`, `title`, and optional `poster`.
- Multiple videos render as native HTML5 players in the existing project dialog with controls, inline playback, metadata preload, and no autoplay.
- If the array is empty or absent, the entire Video section is hidden. Invalid paths are logged; failed players are removed and the section hides if all fail. Invalid posters are removed without affecting video playback.
- No real project videos are currently present, so each project is configured with `videos: []` and its Video section is hidden.

Example entry for a real UAV file (add only after the file exists):

```js
videos: [
  {
    src: 'assets/videos/uav/demo.mp4',
    title: 'Fixed-Wing UAV Demonstration',
    poster: 'assets/images/uav/video-poster.jpg',
  },
],
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

## Lightbox Interaction Boundary Update

- Project overview card images no longer open the lightbox. Their click events continue to the existing project-card handler, so clicking anywhere on a card opens its project dialog.
- Configured images inside project detail dialogs still open the shared full-size lightbox. This includes images inserted dynamically through the existing project image configuration and carousel images placed inside a project dialog.
- Achievement carousel and profile images retain their existing lightbox behavior. Carousel clicks continue to reach the carousel's own selection handler.
- No image paths, project image arrays, project dialog markup, or hover styling were changed for this update.
- Validation: `node --check script.js` and `git diff --check` passed. Source inspection confirmed the project-card click handler and skill-card hover selector remain present. Browser interaction testing was not available in this run.

## Drone Project Merge and 3D Design Showcase

### Files updated

- `index.html`: replaced the separate Custom Quadcopter Flight Controller and MOSFET Motor Driver PCB cards with one **Custom Drone Control System** card. Combined their existing detail content in the same `quad-dialog`, with separate Flight Controller and Motor Driver subsections. The existing media-slot keys remain `quadcopter` and `motorDriver`, so their image arrays still attach to their original subsystem. The project grid now has four cards and four project dialogs. Added the 3D Design Showcase section after Projects and before Technical Skills; it sits before Achievements in the page flow.
- `script.js`: the shared image and video mount code now maps both drone subsystem keys into `quad-dialog`. Added the centralized `portfolioImages.designShowcase` array and a data-driven focused carousel that reuses the Achievements card styling, position/scale treatment, slide timing, pause behavior, keyboard and touch navigation, reduced-motion handling, and two-step click/lightbox interaction. Empty and missing-image behavior follows the existing carousel conventions.
- `styles.css`: added only subtle subsystem separation and matching understated image-dimension guidance for the new showcase.
- `IMAGE_PLACEMENT_GUIDE.txt`: updated the former dialog references and documented the new showcase folder and registration pattern.
- `assets/images/3d-designs/.gitkeep`: created the dedicated empty showcase folder. No design images were fabricated or added.

### Adding a 3D design

Place the image in `assets/images/3d-designs/` and add one `{ src, alt }` entry to `portfolioImages.designShowcase` in `script.js`. An existing entry is:

```js
{ src: 'assets/images/3d-designs/pixieb.png', alt: 'Base For Pixie Bot' },
```

Recommended image size is **1200 × 800 px (3:2 landscape)**. Each entry generates a carousel tile automatically. The first click on a side tile focuses it; clicking the focused tile opens that image in the shared full-size lightbox. No project dialog is created for showcase images.

### Validation performed

- `node --check script.js` passed.
- `git diff --check` passed; Git displayed line-ending conversion notices for edited files.
- Python's HTML parser completed without exceptions; source checks found 32 unique IDs, four main project cards, four detail dialogs, exactly one Custom Drone Control System card, no remaining `pcb-dialog` reference in the site code, both subsystem media-slot groups in the combined dialog, both subsystem video sections, and the showcase section before Achievements.
- CSS brace counts balance (241 opening / 241 closing). Four local HTML asset references and 24 configured image paths were confirmed to exist.
- At initial setup, verified the new showcase folder and empty `designShowcase` list displayed the empty-state message without fake media. The subsequent tile update below reflects the design files now present in that folder.
- Browser-based interaction, console, and desktop/tablet/mobile rendering were not run in this update. The combined-dialog image/video mounting, carousel autoplay/touch behavior, lightbox layering, and viewport appearance therefore still need live-browser verification.

## Miscellaneous Design Carousel Tiles

- Kept the showcase as the existing horizontally moving, center-focused carousel. Each tile now contains its image and a visible headline generated directly from the same descriptive `alt` value used on the image.
- Added showcase-only card styling that follows the main Projects surface, border, typography, and spacing language while preserving the shared carousel positioning, focus enlargement, slide transition, responsive sizing, and reduced-motion behavior. Achievements styling and its content were not changed.
- Clicking a background tile continues to focus it first. Clicking the active tile or its headline opens the existing global lightbox; the two-step routing does not assign the showcase tile a project dialog. The lightbox continues restoring its captured scroll position and focus target on close.
- Corrected the rotor image path capitalization to match `assets/images/3d-designs/helo-rotor.png` for case-sensitive hosting.
- Updated `IMAGE_PLACEMENT_GUIDE.txt` to document that `alt` is the visible headline and to show an existing real design entry as the configuration pattern.
- Current `portfolioImages.designShowcase` contains five entries: Pixie Bot base, Pixie Bot connector, RC helicopter swashplate concept, claw, and conceptual autonomous passenger-carrier design. Each source path was checked against the folder.
- Validation: `node --check script.js` and `git diff --check` passed; CSS braces balance. Source inspection verified title generation from `alt`, design-only active-image routing, separate carousel roots, and no project-dialog association. A local Brave preview showed all five image/title tiles; clicking a background tile selected it without opening a dialog, clicking a focused tile opened the shared lightbox, and closing returned to the showcase scroll region. The carousel continued advancing during preview, so persistence of the exact slide under pause was not verified. Browser console inspection and 1440/1024/768/390 viewport checks were not performed.
