# GitHub preparation and publication

The repository root is the top-level Shortlist folder, not prototype/ alone. Keep the existing source layout while the system design is under review.

## Included and excluded files

Include English documentation, the prototype source/assets, package.json, preview/build scripts and tests. prototype/dist contains hand-authored source.

Exclude archives, tmp/, QA screenshots, local checker state, node_modules, environment secrets and generated prototype/dist/Shortlist.html. Do not add an open-source license on behalf of the owner or third-party poster creators. Prefer a private repository until public distribution rights for supplied imagery are confirmed.

## Verify before committing

From the repository root:

~~~sh
npm --prefix prototype test
npm --prefix prototype run build
git status --short
git add README.md .gitignore .gitattributes docs prototype
git diff --cached --stat
git diff --cached --check
~~~

Inspect staged paths and content for credentials and unintended files. Use the Git author identity already configured by the owner; do not invent an identity.

~~~sh
git commit -m "docs: prepare Shortlist prototype and production design"
~~~

## Push only after selecting the destination

Create an empty private GitHub repository without a second README. If the destination already has history, inspect and integrate it; do not force push.

~~~sh
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
~~~

Replace YOUR_REPOSITORY_URL with the selected destination. If origin exists, inspect git remote -v rather than adding it again. Never embed tokens in a remote URL.

No remote URL has been selected or configured by this work. Preparing a local commit does not create a GitHub repository, push source, deploy a website, or authorize a paid service.

## Hosting the current prototype

### Cloudflare Workers through GitHub

The root wrangler.jsonc declares the Worker name, compatibility date and static asset directory. Use these settings together:

| Setting | Value |
| --- | --- |
| Root directory | Repository root (leave empty, or use / if required) |
| Production branch | main |
| Build command | Leave empty |
| Deploy command | npx wrangler deploy |

Commit and push wrangler.jsonc before retrying deployment. Do not set the root directory to prototype with this root-level configuration. The Worker name shortlist must match the selected Cloudflare Worker; update the configuration if choosing a different name.

The compatibility date pins runtime behavior; it is not the deployment date and does not need to change for each release. It uses the date suggested by the reported build failure (2026-11-10).

For a one-time retry before pushing the configuration, the equivalent root-level command is:

~~~sh
npx wrangler deploy --assets ./prototype/dist --name shortlist --compatibility-date 2026-11-10
~~~

This configuration deploys the existing prototype only, not the proposed production application. No Supabase settings are required yet.

### Vercel alternative

If separately choosing Vercel for the existing prototype: Root Directory prototype, Framework Preset Other, Output Directory dist; no build step is needed for static hosting. The current build script only generates the optional direct-open distribution.

Production hosting is subject to design approval. Do not add deployment credentials or automatic publication until the selected destination and access settings have been reviewed.
