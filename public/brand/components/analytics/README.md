# Analytics

Plausible (or self-hosted Umami). Cookieless, GDPR/CCPA-clean, no banner.

## Why Plausible / Umami over GA

- **No cookies.** No consent banner. No "Accept all" dark pattern to design around.
- **No cross-site tracking.** Visitor identity isn't persisted across sessions.
- **Open source.** Umami self-hosts; Plausible is open source with a hosted option.
- **Lightweight.** ~1 KB script vs GA's ~80 KB; doesn't move LCP.

## Install

Drop `analytics.html` snippet into every page `<head>` after the `<title>` and before the heavy stylesheets:

```html
<script defer
  data-domain="felixgeelhaar.com"
  src="https://plausible.io/js/script.outbound-links.file-downloads.js">
</script>
```

`defer` keeps the parser unblocked. Outbound-link + file-download tracking is built into the script variant linked above — no extra wiring needed.

## Custom events

For surfaces where the conversion matters (newsletter signup, Cal.com click, repo open), fire a Plausible event:

```js
// On submit success in <fg-newsletter>:
window.plausible?.('Newsletter Subscribe');

// In a link click handler:
window.plausible?.('Open Repo', { props: { project: 'govee-light-management' }});
```

The defensive `?.` covers ad-blockers + the dev environment where the script isn't loaded.

## Outcome dashboard

Track three core outcomes (Spool's outcome metrics):

| Outcome | Plausible source | Target |
|---|---|---|
| Reach | Unique visitors / week | Trend up; absolute number depends on launch |
| Engagement | Avg time on /writing/$slug | ≥ 3 min for essays >10 min reading-time |
| Conversion | Newsletter Subscribe events / unique visitors | ≥ 2% sustained |

Vanity metrics (page views, sessions) sit below these — read them only when an outcome metric moves.

## Self-hosted Umami substitution

If Plausible's hosted plan ever becomes a constraint, swap the script tag:

```html
<script defer
  src="https://umami.felixgeelhaar.com/script.js"
  data-website-id="$WEBSITE_ID">
</script>
```

Umami exposes the same `window.umami('Event Name')` API. The event-fire sites change one symbol; the rest stays.

## Privacy stance

The site declares its stance in the footer (no consent banner because no cookies are set). When Felix wires this in production, also add a one-line note to `/policy/ai` or a `/policy/privacy` page:

> "I use Plausible to count visits. No cookies, no cross-site tracking, no personal data leaves the page. Opt out by blocking the script — your browser's tracker blocker already does that."

Symmetric prominence — single sentence, plain language, no defensive PR.
