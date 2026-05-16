# `.btn`

The system's only button primitive. Three variants, three sizes, structural CSS only.

## Imports

```html
<link rel="stylesheet" href="/components/button/button.css">
```

## Variants

| Class | Use |
|---|---|
| `.btn` | default solid ink button |
| `.btn--ghost` | transparent until hover |
| `.btn--accent` | primary action of the surface |
| `.btn--danger` | destructive actions; pair with modal confirmation |

## Sizes

| Class | Min height |
|---|---|
| _none_ | 44 px (touch target floor) |
| `.btn--sm` | 32 px (dense rows, table actions) |
| `.btn--lg` | 52 px (hero CTAs) |

## States

- Hover: solid → accent; ghost → solid; accent → accent-hover; danger → danger-fg.
- Active: 1 px translate-y nudge.
- Disabled: `[disabled]` or `[aria-disabled="true"]` — 55% opacity, no pointer events.
- Focus: inherits the global `:where(:focus-visible)` ring.

## Rules

- One `.btn--accent` per surface, primary action only.
- Pair `.btn--danger` with a confirmation modal — never trigger destruction directly.
- Touch target: don't shrink under 44 × 44 except for `.btn--sm` in genuinely dense contexts.
