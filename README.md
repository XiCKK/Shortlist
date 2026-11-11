# Shortlist

A Thai-language platform for discovering short and independent films.

**Status:** working prototype; production design awaiting user approval. No production scaffolding, dependency installation, service purchase, or deployment has been approved.

## Run the prototype

Use Node.js 22 or newer. No dependency installation is needed for the current prototype. From the repository root:

~~~sh
npm --prefix prototype start
~~~

Open http://127.0.0.1:4173 and keep the terminal running. On Windows, you can also run prototype/Start-Preview.cmd.

~~~sh
npm --prefix prototype test
npm --prefix prototype run build
~~~

The build creates prototype/dist/Shortlist.html, an optional direct-open distribution. It is generated and ignored by Git. Direct file:// opening has not been verified in the user's browser; localhost is the verified path.

## Current functionality

The prototype includes catalog search/filtering, film details, saved films, and a local demonstration profile. Its 13 records include 11 user-supplied poster images. Some metadata is illustrative or unverified. Every playback uses the same Sintel demonstration trailer, not the film shown on the poster.

Bookmarks and profiles currently live in browser localStorage. There are no real accounts, database, admin dashboard, or uploaded film files.

## Confirmed v1 scope

- Existing YouTube links; free viewing without viewer login.
- Owner-managed catalog through an admin interface from the first release.
- Supabase Free and administrator authentication selected by the user.
- Zero monthly operating budget; no paid upgrades or domain purchase.
- English-first repository documentation; Thai product UI.
- No video binaries in database tables and no secret keys in browser code.
- Preserve bookmarks across migration and separate mock/unverified/verified data.

Proposed architecture: Cloudflare Workers Static Assets, plain JavaScript with Vite, and Supabase Auth/Database/Storage. These specific tooling/hosting choices still require approval of the design. Next.js and Cloudflare Stream are deferred.

## Documentation

- [Production system design — approval draft](docs/superpowers/specs/2026-11-11-shortlist-production-design.md)
- [Confirmed requirements and decision log](docs/production-intake.md)
- [Official service research and prices](docs/service-research.md)
- [GitHub preparation and push guide](docs/github.md)
- [Prototype guide](prototype/README.md)
- [Earlier development outline and reusable prompts](prototype/docs/development-plan.md)
- [Historical prototype verification](prototype/docs/verification.md)

The detailed implementation plan will be written after design approval. Do not treat the design milestones or the earlier outline as permission to start implementation.

## Repository layout

~~~text
docs/                         Requirements, service research, design and GitHub guide
prototype/
  dist/                       Hand-authored static source; keep tracked
    index.html                Hosting entry point
    app.js                    UI, routes, browser state
    data.js                   Mock catalog and filtering
    styles.css                Presentation
    assets/                   Posters, photographs and motion assets
  test/                       Catalog behavior checks
  docs/                       Earlier outline and historical verification
  server.mjs                  Local preview server
  build-offline.mjs           Optional direct-open HTML generator
~~~

Unlike a conventional build directory, prototype/dist contains source files. Do not ignore that entire directory. A future web/ application is only a proposal; it has not been created.

## GitHub and asset ownership

Use this top-level folder as the repository root. No GitHub remote has been configured or pushed in this work. See the push guide before publishing.

Use a private repository while public distribution rights for supplied poster/PDF imagery remain unconfirmed. No open-source license has been assigned to this code or to third-party artwork. Sintel attribution and source links are in the prototype guide.

Never commit environment files, provider tokens, private keys, or Supabase secret/service-role keys. The ignore rules exclude common credential files, temporary outputs, QA screenshots, archives and generated direct-open HTML; inspect staged files before each commit.
