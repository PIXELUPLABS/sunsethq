# Legal pages

The `/privacy` and `/terms` pages use SunsetHQ's policies as the interim baseline, as requested on September 24, 2026:

- [SunsetHQ Privacy Policy](https://sunsethq.com/privacy), updated July 21, 2026.
- [SunsetHQ Terms of Service](https://sunsethq.com/terms), updated March 18, 2026.

The Replay versions retain Sunsets HQ Corp., the Brooklyn mailing address, and the existing `privacy@sunsethq.com`, `legal@sunsethq.com`, and `support@sunsethq.com` contacts. The terms retain the source's New York governing law, JAMS arbitration, class action waiver, and liability provisions.

Adaptations replace Sunset branding, website references, wind-down services, and fee assumptions with Replay's data evaluation and licensing context. Signed service and licensing agreements govern customer datasets and payment terms; a website valuation request is not a dataset license or payment guarantee.

Website-specific privacy sections describe the existing Cloudflare/Turnstile intake, Attio delivery, Cal.com scheduling and confirmed-booking sync, linked recruiting provider, form failure reporting, consent-gated campaign attribution, and separately consent-gated Cloudflare Web Analytics. They do not carry over SunsetHQ's Google, LinkedIn, RB2B, Datadog, or Cookiebot integrations. Cookie information is included in `/privacy#cookies`, using the current 180-day consent preference, session campaign storage, 24-hour pending-request validation, and Global Privacy Control behavior. The source's wind-down-specific seven-year retention period and Google Analytics retention assumption are omitted.

Content lives in `modules/legal/components/`. The shared date in `modules/legal/lib/constants.ts` drives the visible update date and sitemap entries. Update that date when the policy text changes. The site-wide footer links to both pages, and Cookie settings links to the privacy policy. The production/static-export check covers both routes.
