# Historical prototype verification

Original verification date: 2026-11-11. This records the prototype session; it does not certify the future production implementation.

## Observed results

- Five catalog tests passed with zero failures.
- Syntax checks for app.js and server.mjs passed.
- The localhost preview returned HTTP 200.
- Browser checks covered Thai search, opening the matching film, saved-film persistence after reload, removal and the empty state.
- Local profile edits persisted after reload.
- Empty search results could be reset; combined romance/duration filters selected the matching film.
- The Sintel trailer played with advancing time (about 52 seconds total) and paused when its dialog closed.
- The mobile menu opened, closed and navigated.
- Homepage widths 320, 390, 768, 1024 and 1440 had no measured horizontal document overflow.
- A too-tall mobile detail poster was corrected to preserve natural proportions.
- The generated Shortlist.html was tested over HTTP; no captured console errors were observed in the handoff check.

## Verification limits

Direct file:// navigation was blocked by the test browser policy, so direct opening in the user's Chrome/Edge was not verified. The same generated page was checked over HTTP.

The automated visual gate could not find a Chrome executable (GATE: ERROR). Its consistency/layout checks did not run; browser inspection was used instead. Do not claim the automated gate passed.

The copy checker had zero failures and one warning about decorative menu numbering. Safari and physical devices were not tested. The demonstration trailer does not have reviewed captions in this prototype.

## Publication status

No online deployment was completed. Site creation returned a destination backfill-in-progress error without a project id; creation was not repeated and no id was invented. No paid service was purchased or production database connected.
