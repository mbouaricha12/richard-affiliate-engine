# RAE — Launch Readiness Gate

The engine is considered ready for organic traffic only when all checks below pass.

## Technical
- Production deploy is READY.
- Landing loads on mobile.
- /api/events accepts valid events and rejects invalid payloads.
- /api/summary remains admin-protected.
- /api/business-events remains admin-protected.
- UTM source / medium / campaign / content persist into stored events.
- No duplicate campaign runtime exists in app.js.

## Funnel
- Eligibility gate works.
- Synthetic route exposes Deriv only.
- Forex/Gold route exposes HFM only.
- Undecided route exposes both neutrally.
- Affiliate links open in a new tab with sponsored/noopener/noreferrer.
- Telegram and WhatsApp remain voluntary actions.

## Measurement
- Channel scorecard works.
- Content scorecard works.
- Channel × content breakdown works.
- Funnel drop-off diagnostics work.
- Verified broker outcomes remain separate from click analytics.

## Launch rule
Organic launch may begin after this gate is green. Paid acquisition remains a separate gate requiring applicable partner/platform approval plus enough organic evidence to justify spending.
