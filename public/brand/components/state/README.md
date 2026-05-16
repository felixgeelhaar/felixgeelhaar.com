# `state`

Empty, loading, and error templates. Every dead-end on the site answers the same three questions: what happened, what can the user do, where can they go.

## Imports

```html
<link rel="stylesheet" href="/components/state/state.css">
```

## Variants

| Class | Use |
|---|---|
| `state--empty` | filter returned nothing / no data yet |
| `state--loading` | wrapper around `.state-skeleton` |
| `state--404` | route not found |
| `state--500` | server / app crash |

Modifier `.state--compact` shrinks padding for in-card contexts (failed widget, empty list).

## Markup contract

Outer `.state` carries the variant. Slots:

| Element | Purpose |
|---|---|
| `.state__icon` | optional `<fg-icon data-size="lg">` (warning for 404, alert-circle for 500) |
| `.state__kicker` | mono caps, one line |
| `.state__title` | h1 on full-page templates, h2 on in-card use |
| `.state__body` | one or two sentences |
| `.state__actions` | btn row, ≤2 buttons |

## Skeleton

```html
<div class="state-skeleton" aria-busy="true" aria-live="polite">
  <span class="state-skeleton__bar state-skeleton__bar--h1 state-skeleton__bar--w-2/3"></span>
  <span class="state-skeleton__bar state-skeleton__bar--text state-skeleton__bar--w-full"></span>
</div>
```

Bars accept size (`--h1`, `--h2`, `--text`) and width (`--w-1/3`, `--w-1/2`, `--w-2/3`, `--w-full`). The shimmer animation degrades to a static muted bar under `prefers-reduced-motion: reduce` (handled by the global motion safety net in `tokens.css`).

`aria-busy="true"` on the wrapper announces "loading" to assistive tech; `aria-live="polite"` lets screen readers know the region is mutable.

## Copy patterns

The voice guidelines task will lock these properly. Working rules:

- **Kicker**: status name in mono caps. Never "Oops".
- **Title**: state in one sentence, declarative.
- **Body**: one sentence explaining why, one telling the user what to do.
- **Actions**: primary path first, secondary fallback second. Never three buttons.

## Accessibility

- `state` regions land focus when navigated to. For 404/500 pages, server should return matching HTTP status codes (the templates are the visual half; the network status is the rest of the contract).
- Skeleton loading wrapper carries `aria-busy="true"`. Drop the attribute when content replaces it.
- Reduced-motion users see a static muted bar instead of the shimmer animation.
