# Shortlist v1 System Design

Status: DRAFT FOR USER APPROVAL. No production scaffolding, installation, stack migration, service purchase, or deployment is authorized by this document alone.

## Intent and confirmed decisions

Turn the Thai-language Shortlist prototype into a small, usable film-discovery website. Visitors discover films, inspect verified details, watch an embedded YouTube video for free, and save films locally. The owner manages the catalog through an authenticated admin interface.

User-confirmed on 2026-11-11:

- Currently available video sources are YouTube links; other sources are undecided.
- Viewing is free without a viewer account in v1. Viewer accounts/memberships may follow later.
- The owner adds films; no creator submissions in v1.
- Operating budget is USD 0 / THB 0 per month initially. No paid upgrades or domain purchase.
- The user chose an admin interface immediately, using Supabase Free and admin authentication.
- GitHub-facing documentation is primarily English. Product UI remains Thai.
- Do not store video binaries in database tables or expose secret keys to browsers.
- Preserve existing bookmarks through a documented migration path.

Agent proposals requiring approval: Cloudflare Workers Static Assets for the frontend; plain JavaScript with Vite for dependency bundling; Supabase JS SDK for database/auth/storage. Next.js is not proposed for v1. The existing prototype remains intact.

## Scope and non-goals

In scope: public catalog, title/director/category search, category/duration filters, sorting, film details, embedded YouTube playback, local bookmarks, owner login, admin catalog management, poster upload, publication/review states, backup/export and bookmark import.

Out of scope: paid membership, viewer signup, creator portal, video file uploads, Cloudflare Stream, payment processing, comments, AI recommendations, guaranteed uptime, and a promise of access control over public YouTube links.

Do not launch mock metadata or a demonstration trailer as an actual film. Do not introduce a paid dependency to meet the initial scope. A host outage, paused database, or video restriction must produce an honest state rather than a fake success.

## Approaches considered

| Approach | Tradeoff | Decision |
| --- | --- | --- |
| Static site + YouTube; edit catalog files | Smallest free solution; each catalog edit needs a source update/deployment | User chose an admin form instead |
| Static frontend + Supabase Free + YouTube | Admin form and controlled publishing; requires auth/RLS/storage policies and observing free quotas | Selected approach; specific host/tooling still subject to this design approval |
| Next.js + Vercel + Supabase | Integrated server-rendered pages and server endpoints; migration work and Vercel commercial-plan considerations add cost/complexity | Deferred; no current requirement justifies it |

Vercel remains a possible later host, not a dependency for Supabase. Cloudflare currently recommends Workers over Pages for new projects. Workers Static Assets is the hosting mode here; no video streaming subscription or custom Worker backend is required for v1.

## Architecture and repository boundaries

After approval only, create a separate `web/` application using the existing visual design and reusable behavior. Vite builds deployable files into `web/dist/`. Keep `prototype/` as the working reference; its `dist/` directory contains source files and must not be globally ignored. Add scoped ignore rules for the new application's generated output when it exists.

The browser reads public catalog records from Supabase using a publishable key. The admin browser uses Supabase Auth sessions and the same SDK. Database and Storage policies enforce authorization even when requests bypass the UI. There is no browser-held secret/service-role key and no public generic privileged write endpoint.

Public configuration: Supabase project URL and publishable key. Administrator credentials stay in the Auth flow; project secrets stay in provider settings and out of Git. No backend secret is needed in the frontend's build configuration. Dependency versions must be verified and pinned in a committed lockfile during implementation, not installed in this planning round.

Use one free Supabase project initially for the pilot. Local/integration tests use a local Supabase environment during implementation; never run destructive tests against the pilot. Preview builds default to mock/local test configuration; explicitly wire a preview to the pilot only for intentional read-only review, not admin mutation tests.

## Users and authorization

| Actor | Allowed behavior |
| --- | --- |
| Anonymous visitor | Read published, verified films; play YouTube; save locally |
| Authenticated non-admin | Same public catalog access; no admin reads/writes or draft poster access |
| Owner/admin | Read all real catalog records, create/edit drafts, upload posters, verify and publish/unpublish |

Provision the first owner manually through Supabase's administrative tools after service setup is authorized. Disable public signup for this release. Grant admin membership manually in an `admin_users` table keyed by Auth user id. No client may insert, update, or delete admin membership. Do not use browser-editable profile metadata as proof of an admin role.

Use email/password login for this pilot and an owner-controlled recovery route verified before launch. Document password reset and allowed redirect URLs, test recovery, and do not promise production email delivery without verifying the provider's email limits. Removing admin membership must revoke subsequent database/storage access even if the person still has a session.

## Data model and publication

Proposed minimum tables:

- `films`: immutable UUID; unique slug; title; optional original title/synopsis/year/runtime seconds/director; optional age-rating label; YouTube video id; optional poster object path; provenance (`real` or `mock`); review status (`pending` or `verified`); publication status (`draft`, `published`, `archived`); timestamps; revision number.
- `genres`: UUID and unique display label/slug.
- `film_genres`: unique film/genre pair.
- `admin_users`: Auth user id; administrative access managed outside the public client.
- `legacy_film_ids`: unique prototype id mapped to a real film UUID; admin-controlled.

Use a director text field and a structured credits JSON list of role/name pairs on `films` initially; do not create a people directory without a requirement. Film and genre link policies must be consistent: a public user cannot infer draft film metadata via related tables.

All new admin entries start as real/pending/draft. A database constraint enforces that published records are real and verified with a nonempty title, valid YouTube id, and at least one genre enforced by the publish operation. Runtime/year may remain unknown; show an honest unknown state and exclude unknown runtimes from bounded-duration filters. The admin records permission to display/embed and confirms that metadata has been reviewed. Verification is an explicit step, not a side effect of uploading a poster.

The publish operation is atomic for its database checks. Public RLS permits SELECT only where provenance=real, review=verified, and publication=published. Admin membership is checked on every privileged operation. Use a locked-down membership helper with a fixed search path if needed to avoid recursive RLS. No anonymous or ordinary authenticated catalog writes.

Agent's editing decision for approval: saving any content change to a published film immediately moves it to pending/draft, removing it from the public catalog until explicitly verified and published again. This applies to metadata, video, poster, credits, and categories. There is no parallel published snapshot in v1; the admin form warns about this behavior before saving.

Make content/category changes through transactional database RPCs: save_film_draft, verify_film, publish_film, unpublish_film, archive_film, and save_genre. Block direct client INSERT/UPDATE/DELETE on catalog tables, including film_genres. Each RPC checks auth.uid() against protected admin membership, uses a fixed search path and explicit function execution grants, and enforces the revision predicate. A definer RPC must perform this authorization itself rather than relying on owner-bypassed RLS. save_film_draft updates the film and genre links together; publish_film rechecks the complete record and at least one genre in its transaction. Category deletion is rejected while referenced; renaming a referenced category is rejected until affected films are taken to drafts. No direct relation mutation can bypass the publication requirements. This is Supabase database logic, not a new paid server service.

Use a revision predicate on updates to detect conflicting edits. If the revision changed, preserve the form and offer reload/retry instead of overwriting another update. Prefer unpublish/archive over hard deletion to preserve UUIDs and bookmark mappings. A real film removed from public view becomes unavailable in a bookmark list without exposing draft data.

Mock fixtures remain outside production seed data and outside the deployed public bundle. The existing 13 records are not an approved real catalog. Start the real pilot catalog empty until the owner supplies and verifies links and metadata; show a useful empty state. Never attach a YouTube link to a film merely because a similar title exists.

## Poster storage

Use a private `film-posters` bucket, JPEG/PNG/WebP only, maximum 5 MiB per object; reject SVG/HTML and video files. Use immutable generated object names, validate extension/MIME, and apply bucket size/type restrictions. Metadata editing must not let the client choose another film's object path arbitrarily.

Only admins upload/replace/remove. Public Storage SELECT is restricted to objects referenced by a publicly readable film. Admins can preview their drafts through authorized Storage requests. The UI requests signed display URLs with a 300-second lifetime and refreshes expired URLs; do not store them as permanent database fields. This is a UI caching choice, not an enforceable maximum: a caller with SELECT permission may request a different expiry. Unpublishing revokes subsequent catalog/object authorization, but previously issued links and downloaded copies may remain usable. No fixed media-revocation deadline is promised. Do not use this scheme for confidential/embargoed media requiring immediate revocation; that would need a separately approved trusted delivery design.

Upload a replacement to a new object, update the film reference with a revision check, then clean up the old object only when it is no longer referenced. A failed database update keeps the old reference and does not delete the old poster; show the error and allow retry. Orphan cleanup is an explicit admin maintenance action, not an automatic deletion on page load.

## Public and admin flows

Preserve the white/black poster-focused Thai interface, complete poster artwork, mobile layout, keyboard access, and visible empty/loading/error states. Hash routes are acceptable for v1; clean server-rendered SEO pages are a later reconsideration trigger for Next.js.

Public flow: catalog -> filters/search -> film detail -> click to load embedded player -> save/remove bookmark. Fetch only publicly readable records; paginate catalog requests rather than assuming an unlimited full-table response. Show failed catalog loading separately from an empty catalog.

Admin flow: login -> list draft/published/archived films -> create/edit form -> add YouTube URL and poster -> preview -> explicitly verify metadata -> publish. Also support unpublish, archive, and category management. A UI route guard improves navigation but is never the authorization boundary. Errors retain entered fields; expired sessions require login before retrying a write.

## YouTube playback

Store a normalized YouTube id, not arbitrary iframe markup. Accept HTTPS `youtube.com/watch?v=...`, `youtu.be/...`, and `youtube.com/shorts/...` links with an 11-character `[A-Za-z0-9_-]` id. Match exact allowed hosts (including `www.youtube.com` and `m.youtube.com`), reject other schemes, credentials, spoofed suffix hosts, playlists without a video id, and injected HTML. Derive the embed URL from the id in code.

Use YouTube's supported embed/player interface, keep controls/branding behavior consistent with provider requirements, and load the third-party iframe only after a viewer requests playback. Set a player title, preserve at least the documented 200x200 minimum even on small screens, and stop/remove the iframe on close/navigation.

Handle deleted/private/region-restricted or embedding-disabled videos with a visible explanation and an explicit Open on YouTube link; never silently switch to an unrelated film. No Data API key or scraping service is required. The owner checks embeddability before publishing; availability can still change later. Viewers may see YouTube restrictions or advertisements. No paid/private access guarantee is offered.

## Bookmark continuity and future membership

V1 viewing does not require an account. Keep bookmarks browser-local but use stable film UUIDs for real data. A saved list must retain ids for unavailable films and display an unavailable label, rather than silently dropping them. Do not call the prototype's `validSavedIds` on imported real/unknown ids because it discards anything outside the old demo catalog.

Before moving origins, add a bookmark export action to the OLD prototype and keep that origin accessible long enough for the owner/testers to export. Export a versioned JSON file containing legacy ids and available title hints; do not include auth credentials. File-origin/localStorage behavior varies: guide users to export in the browser and origin where their bookmarks actually exist. A new host cannot read localhost's storage automatically.

New site import: validate a maximum 1 MiB JSON file with at most 5,000 entries; reject invalid schemas; map known legacy ids through `legacy_film_ids`; preserve unresolved ids/title hints separately; union resolved ids with current bookmarks; deduplicate; persist; read back and compare; report imported/already-present/unresolved counts. Read failure, quota error, cancellation, or write error must retain both the import file and the previous local state. Never clear old storage automatically. Importing the same file twice is idempotent.

No cloud watchlist sync is included in v1. When viewer accounts are later approved, an explicit signed-in import can merge local bookmarks into a table unique on `(user_id, film_id)` with owner-only RLS. Confirm by reading back before marking migration complete. Preserve unresolved ids for later mapping and never import the local profile as identity or admin privilege. A user who already erased original storage cannot be guaranteed recovery.

## Budget, hosting, and operations

Target: no recurring paid services. Cloudflare's static asset requests/storage are free within platform limits; Supabase Free has quotas and can pause after inactivity. YouTube supplies video delivery. No custom domain, paid email, Stream, Workers compute feature, or paid database upgrade is required by this design. Do not enable paid upgrades automatically.

Check quota usage before importing a larger catalog; start with a small verified pilot batch and optimized images under the bucket limit. If free limits are reached, show unavailability or stop new uploads and ask the owner to reduce usage or revisit scope. There is no production SLA under the zero-budget requirement.

Track schema migrations in Git. Before data migrations, export catalog metadata and download original poster objects to an owner-controlled backup; database export alone does not back up Storage objects. Test restoration to a local environment. YouTube originals remain with their owners; Shortlist does not back them up.

## Delivery milestones and acceptance gates

These are design-level work packages, not an approved implementation plan. Exact files, interfaces, tests, and commit steps will be written after approval.

1. **Repository and demo continuity:** English README/docs, clean ignore rules, testable original prototype, no credentials or generated archives in Git. Source remains available locally until a GitHub destination is selected.
2. **Data and permissions:** schema/migrations and private poster bucket. Automated anonymous/non-admin/admin tests prove all table/object privileges, blocked role escalation, and draft confidentiality. No demo seed data in the pilot.
3. **Admin catalog:** login/recovery, create/edit, poster replacement, verify/publish/unpublish/archive, category management. Tests cover expired login, conflicting edits, failed uploads/updates, unmet publication checks, RPC role enforcement, and direct-table write denial. Editing any published content must atomically reset pending/draft; category changes cannot remove the last genre or mutate a published record through a relation endpoint.
4. **Public viewing:** real catalog, existing filtering behavior, correct-film YouTube playback, provider-error fallback, loading/empty states, pagination, keyboard use and 320/390/768/1024/1440 layouts. No demo trailer substitution.
5. **Bookmark migration:** export old origin, validated import, explicit mapping, preserved unresolved ids, idempotent merge and read-back verification. Test corrupt files, duplicate ids, oversized files, interrupted writes, and unavailable films.
6. **Zero-budget pilot:** confirm provider plan/redirect settings, restore backups locally, verify free-tier limitations, deploy only after implementation checks and requested authorization. Content acceptance requires actual owner-approved YouTube links and metadata. No public launch with mock records.

## Builder discretion and approval boundary

The implementer may choose small file/module boundaries, test tooling, and accessible control details consistent with this design. They may not add a paid tier, change actor permissions, add viewer signup, change video hosting, or replace the proposed stack without revisiting the design.

The design is ready for approval only after an independent builder check. Approval covers scope and proposed architecture, not a paid service purchase. After approval, write the detailed implementation plan using Superpowers writing-plans; do not start implementation in the same step.

## Official references (checked 2026-11-11)

Independent builder check completed on 2026-11-11. It identified ambiguity about signed-URL revocation and editing published content. Both were resolved explicitly above; the reviewer reported no important remaining planning questions. This review is not user approval.

- [Cloudflare: new projects use Workers](https://developers.cloudflare.com/pages/)
- [Static asset billing and limitations](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
- [Supabase Free quotas and pause policy](https://supabase.com/pricing)
- [Supabase keys](https://supabase.com/docs/guides/getting-started/api-keys) and [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Storage access control](https://supabase.com/docs/guides/storage/security/access-control) and [private asset delivery](https://supabase.com/docs/guides/storage/serving/downloads)
- [YouTube embedded player requirements](https://developers.google.com/youtube/player_parameters)
- [localStorage origin behavior](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
