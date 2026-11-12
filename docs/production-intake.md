# Production requirements and decisions

Reviewed: 2026-11-11. The system design is a draft awaiting approval.

## Observed prototype

Reviewed prototype/README.md, prototype/docs/development-plan.md, prototype/dist/data.js and prototype/dist/app.js.

- Static HTML/CSS/JavaScript, hash routing, 13 film records; no Next.js.
- Some film metadata is illustrative, some transcribed from posters; neither implies verification.
- shortlist.saved.v1 contains prototype film ids in localStorage.
- shortlist.profile.v1 contains a local demonstration profile, not authenticated identity.
- Every film plays the same Sintel trailer.
- Five catalog tests and a historical browser verification record exist.
- No database, real membership, admin UI, file uploads or payments exist.
- There was no Git repository or remote at the start of this preparation round.

## User-confirmed requirements

1. Start with available YouTube links; other sources remain undecided.
2. Free anonymous viewing first; viewer accounts/membership may follow later.
3. The owner adds films; no creator submissions.
4. Zero monthly operating budget.
5. Admin interface immediately, using Supabase Free and admin login.
6. English-first GitHub-facing documentation; keep product UI Thai.
7. No scaffolding, installations or stack migration before design approval.
8. No video files in database tables or browser-exposed secret keys.
9. Separate mock records from reviewed real content and preserve old bookmarks.
10. Prepare README and repository files for GitHub; this is not an instruction to publish publicly or purchase services.

## Approach decision

The user chose a catalog admin form with Supabase Free over editing catalog files manually. Cloudflare Workers Static Assets and Vite are the author's proposed implementation choices, not user-approved infrastructure yet. Vercel was the initial suggestion; Next.js was discussed but never selected.

## Migration constraints

localStorage is origin/browser/device-specific. A new deployment cannot automatically read localhost bookmarks. Export must happen from the original browser/origin before it is lost. A source already erased cannot be guaranteed recoverable.

Preserve old ids through explicit mappings, retain unresolved entries, merge without duplicates, verify persistence by reading back, and never clear old data automatically. Local profile data cannot grant an account or an admin role.

## Next approval

Read [the system design](superpowers/specs/2026-11-11-shortlist-production-design.md). After independent review and user approval, write the detailed task-by-task implementation plan under docs/superpowers/plans/. No implementation plan is approved yet.
