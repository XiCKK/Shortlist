# Shortlist development outline and reusable prompts

Historical prototype outline, updated to point at current decisions. This is not the approved production implementation plan.

Read [confirmed requirements](../../docs/production-intake.md) and [the approval draft](../../docs/superpowers/specs/2026-11-11-shortlist-production-design.md) first.

## Existing prototype

A static Thai-language catalog demonstrates discovery, details, playback, local bookmarks and a local profile. Catalog tests and browser verification are recorded separately. Video playback is illustrative.

## Selected v1 direction

The user now requests free viewing from YouTube links, owner-managed films, an admin interface with Supabase Free/admin authentication, and zero monthly operating cost. English repository documentation is required; Thai UI is retained.

Detailed milestones and acceptance criteria are in the system design. Exact implementation tasks must follow design approval, with a separate task-by-task plan. No stack migration or installation is authorized yet.

## Prompt: revise the prototype

~~~text
Read README.md, prototype/README.md and the source relevant to my feedback.
Preserve the Thai UI, white/black visual direction and complete poster artwork.
Keep existing search, filtering, routes and saved-film behavior.
Change only the requested behavior and verify it with appropriate tests/browser checks.
Do not claim mock data, local profiles or demonstration playback are production integrations.
~~~

## Prompt: plan production implementation after approval

~~~text
Use Superpowers. Read the approved Shortlist design and current decision log.
Confirm the design is explicitly approved before scaffolding or installing anything.
Write a task-by-task implementation plan with exact files, interfaces, tests and acceptance checks.
Preserve the original prototype and zero-cost budget.
Keep video files outside database tables and all secret/service-role keys outside browser bundles.
Keep mock records out of production and implement loss-aware bookmark export/import.
Request review of the plan before starting implementation.
~~~

## Prompt: execute an approved plan

~~~text
Read both the approved design and implementation plan before working.
Implement one approved task at a time and verify its acceptance criteria.
Enforce admin permissions in the data/storage layer, not only in the UI.
Preserve entered data on errors and test interrupted bookmark imports and unknown ids.
Do not add payments, creator submissions, viewer signup or paid services outside the approved scope.
Report completed behavior, verification evidence and remaining limitations accurately.
~~~
