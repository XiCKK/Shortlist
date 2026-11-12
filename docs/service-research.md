# Service research and budget

Checked against official documentation on 2026-11-11. Prices below are USD before taxes; they are research, not purchase authorization. Recheck before subscribing.

## Selected budget direction

The user selected a zero-cost pilot with YouTube embeds, Supabase Free and an admin interface. No paid video hosting, domain, production SLA or paid upgrade is included. Cloudflare Workers Static Assets is the proposed frontend host pending design approval.

## Hosting

Cloudflare static asset requests are free and unlimited, and asset storage has no additional charge, within platform limits. Invoking Worker code uses Workers pricing/quotas. This is not unlimited free server computation. Cloudflare recommends Workers rather than Pages for new projects.

Sources: [Static Assets billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/), [Pages guidance](https://developers.cloudflare.com/pages/).

Vercel Hobby is $0/month for non-commercial personal use. Pro starts at $20/month, with plan-dependent usage charges. Do not assume a business prototype qualifies for Hobby solely because visitors do not pay. Vercel remains an alternative, not an approved paid selection.

Sources: [Vercel pricing](https://vercel.com/pricing), [Hobby restrictions](https://vercel.com/docs/plans/hobby).

## Supabase

Free includes a 500 MB database and 1 GB file storage. Free projects can pause after one week of inactivity. Pro starts at $25/month for the included project/compute configuration; larger compute and overages can add cost.

Database backups do not automatically include Storage objects. Plan separate metadata and poster exports within the zero-cost pilot. Client code may use a publishable key with correct access policies; secret and legacy service-role keys must remain server-side.

Sources: [Pricing](https://supabase.com/pricing), [Database overview](https://supabase.com/docs/guides/database/overview), [API keys](https://supabase.com/docs/guides/getting-started/api-keys), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Video

YouTube is the v1 source. Embeds depend on owner settings, video availability and provider restrictions. Do not promise private/paid access control over a public or unlisted YouTube link. No YouTube Data API integration is required by the design.

Source: [Embedded player documentation](https://developers.google.com/youtube/player_parameters).

Cloudflare Stream is deferred. Its standard video storage is purchased in $5/month increments per 1,000 stored minutes, and delivery costs $1 per 1,000 delivered minutes. Preloading/buffering may count as delivery. Optional transformations/features can have separate charges.

Illustrative future estimate only: 20 films x 15 minutes = 300 stored minutes ($5 capacity tier); 10,000 delivered minutes = $10. Stream would be about $15/month. Vercel Pro $20 + Supabase Pro $25 + this Stream example would total about $60/month before taxes, domains or overages. This is neither the selected budget nor a mandatory minimum.

Source: [Stream pricing](https://developers.cloudflare.com/stream/pricing/).
