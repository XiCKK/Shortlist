# Shortlist prototype

See [the repository README](../README.md) for root-level commands and current production decisions. This document describes the existing prototype.

## Run

Use Node.js 22 or newer. From this prototype directory:

~~~sh
npm start
npm test
npm run build
~~~

No dependencies need to be installed for this prototype. Open http://127.0.0.1:4173 while the preview terminal remains running. Windows users can run Start-Preview.cmd.

The build creates dist/Shortlist.html and requires assets/ alongside it. Direct file:// behavior has not been verified in the user's browser; localhost is the verified method. Browser storage for direct-open files can vary.

## Features and limits

- Thai catalog, poster grid, category/duration filtering, search and sorting.
- Thirteen example records, including eleven supplied poster images.
- Details pages and a Sintel trailer demonstration player.
- Saved films and a demonstration profile stored only in browser localStorage.
- Hash routes supporting browser back/forward navigation.

No real user accounts, database, admin dashboard, payments or uploaded film files exist. Metadata may be illustrative or transcribed without verification, especially the Thai title on the supplied poster numbered 13. Every film uses the same clearly labeled demonstration trailer.

Internet access is required for the trailer and Google Fonts. System fonts provide a fallback. Clearing browser storage removes local profile/bookmark data.

## Source and hosting

dist/ contains source, not a disposable generated build. Keep index.html, app.js, data.js, styles.css and assets/ tracked. Only dist/Shortlist.html is generated.

Static hosting does not need server.mjs; this file is only for local previews. Hash routing avoids a server rewrite requirement for internal pages.

See [the earlier outline](docs/development-plan.md), [historical verification](docs/verification.md), and [current design](../docs/superpowers/specs/2026-11-11-shortlist-production-design.md).

## Credits and asset use

- Posters and photographs: supplied shortlist.pdf and LINE_ALBUM images, used for prototype review. No public redistribution license has been established.
- Sintel trailer: copyright Blender Foundation, CC BY 3.0; [license and attribution](https://durian.blender.org/sharing/).
- Demonstration media: https://media.w3.org/2010/05/sintel/trailer.mp4
- Fonts: DM Sans and Noto Sans Thai via Google Fonts.
