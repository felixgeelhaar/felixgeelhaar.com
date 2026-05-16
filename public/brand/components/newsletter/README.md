# `<fg-newsletter>`

Email signup with status messaging. Lit-based; uses `form.css` primitives for the input + helper + error states.

## Imports

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3" } }
</script>
<link rel="stylesheet" href="/components/form/form.css">
<link rel="stylesheet" href="/components/newsletter/newsletter.css">
<script type="module" src="/components/icon/icon.element.js"></script>
<script type="module" src="/components/newsletter/newsletter.element.js"></script>
```

## Tag

```html
<fg-newsletter
  action="https://api.example.com/subscribe"
  title="Get the dispatch."
  blurb="One email per essay. Single-click unsubscribe."
></fg-newsletter>
```

## Attributes

| Attribute | Default | Notes |
|---|---|---|
| `action` | `""` | POST endpoint. When empty the form short-circuits to success after ~600 ms (demo mode). |
| `method` | `"POST"` | HTTP method. |
| `field` | `"email"` | Form-encoded field name sent to the endpoint. |
| `title` | `"One quiet email per essay."` | Headline above the input. |
| `blurb` | `"No drip campaigns, no upsells. Unsubscribe in one click."` | Supporting line. |

## Events

| Event | Detail | Notes |
|---|---|---|
| `fg:newsletter-submit` | `{ email }` | fires before the POST so analytics can react |
| `fg:newsletter-success` | — | response ok |
| `fg:newsletter-error` | `{ error }` | network or non-2xx response |

## Anti-dark-pattern guarantees

This component is the FTC click-to-cancel reference for the system. It commits to:

- **No modal on arrival.** Inline only.
- **No pre-checked extra opt-ins** (cross-marketing, partner emails). The form posts a single field.
- **One-click unsubscribe documented in the helper line.** Confirmation copy says the same.
- **Symmetric cancellation.** Subscribe is a single button; unsubscribe must be too. Implementation lives at the email provider; the component carries the promise.

## Endpoint hint

Buttondown, ConvertKit (Kit), Resend Audiences, and EmailOctopus all accept a `POST` with `email` form-encoded. Wire `action` to the provider's URL. For double opt-in, the provider sends the confirmation message and this element shows the "Check your inbox" success state.

## Accessibility

- The email label is visually hidden but present for screen readers (`<label class="visually-hidden">`).
- Status messages announce via `role="status"` (success) and `role="alert"` (error) with `aria-live="polite"`.
- Submit button text changes to "Subscribing…" during the in-flight state and disables the input + button.
- Touch targets ≥ 44 × 44.
