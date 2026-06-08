# `.rule`

Horizontal separator. Plain `<hr>` picks up the hairline style automatically via `:where(hr)` (specificity 0); use the classes when the rule must be reinforced or sits on a unique surface.

## Imports

```html
<link rel="stylesheet" href="/components/rule/rule.css">
```

## Variants

| Class | Weight | Use |
|---|---|---|
| `hr` / `.rule` | 1px `--color-line` | default in-flow separator |
| `.rule--strong` | 2px `--color-fg` | section breaks — reserve, don't scatter |
| `.rule--accent` | 2px `--color-accent` | single decorative emphasis rule (e.g. above a page kicker) |

```html
<hr>
<hr class="rule--strong">
<div class="rule rule--accent" role="presentation"></div>
```

## States

Static primitive — no hover, focus, or interactive states. Margins are zeroed; spacing belongs to the surrounding layout, not the rule.

## Token dependencies

| Token | Role |
|---|---|
| `--border-hairline`, `--border-strong` | the two sanctioned weights — no third weight, ever |
| `--color-line` | default rule colour |
| `--color-fg` | strong rule colour |
| `--color-accent` | accent rule colour |

## Accessibility

- `<hr>` exposes a `separator` role — use it when the break is meaningful content structure (topic shift in prose).
- Purely decorative rules on non-`hr` elements should carry `role="presentation"` (or be CSS borders on the section instead) so screen readers skip them.
- Forced-colors maps `--color-line`/`--color-fg` to `CanvasText`, so rules stay visible in Windows High Contrast Mode.
