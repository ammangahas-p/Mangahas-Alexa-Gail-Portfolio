# Responsive Portfolio Starter

A framework-free portfolio homepage and project showcase built with semantic HTML, CSS, and plain JavaScript. The visual direction follows the confirmed Soft Blueprint style: pale drafting-paper tones, fine-line details, measured spacing, and IBM Plex Sans.

## Files

- `index.html` — page structure, navigation, hero, profile summary, project section, contact call-to-action, and footer.
- `styles.css` — layout, responsive breakpoints, focus states, and reusable visual components.
- `script.js` — mobile navigation, light/dark mode with a saved browser preference, and data-driven project cards with search, category filters, and carousel navigation.
- `manus-routes.json` — the declared page route for this single-page starter.
- `assets/folio-mark.svg` — the small geometric mark used as the site favicon and project icon.
- `assets/projects/` — local copies of the supplied project previews used as standalone image fallbacks.

## Run locally

Serve this folder with any static web server. For example, from this directory run `python3 -m http.server 3000`; then open `http://localhost:3000`.

## Customize

Replace the remaining bracketed profile placeholders in `index.html`. Update the `projects` array near the top of `script.js` with accurate titles, descriptions, years, roles, status, categories, image alt text, and tool/focus tags. Update the sample email address in the contact section before publishing.

Use the **Dark mode** button in the navigation to switch themes. The selection is stored in browser `localStorage` and restored on a later visit in the same browser.

Browse the project carousel with its previous/next buttons, horizontal swipe/scroll, or arrow keys when the carousel track is focused. Search and category filters reset the carousel to the first matching card.

Project cards now use supplied artwork. They load from WebDev-managed storage and fall back to the local copies in `assets/projects/` when run as a standalone folder. The IBM Plex fonts are loaded from Google Fonts; system fallbacks are included in the CSS.
