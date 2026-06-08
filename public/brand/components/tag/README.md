# `.tag`

Pill-shaped label for categories, statuses, and technologies. Standalone primitive; `card__tag` aliases the same shape inside cards.

## Imports

```html
<link rel="stylesheet" href="/components/tag/tag.css">
```

## Variants

| Class | Use |
|---|---|
| `.tag` | default ink-muted pill |
| `.tag--accent` | accent-tinted (active filter, highlighted tech) |
| `.tag--success` / `.tag--warning` / `.tag--danger` / `.tag--info` | status-coloured inline state |
| `.tag--solid` | filled status variant — combine with a status class, use on tinted surfaces where the tinted variant lacks contrast |
| `.tag--pill` | fully rounded corners for technology badges (project cards) |

```html
<span class="tag">Essay</span>
<span class="tag tag--success">Shipped</span>
<span class="tag tag--solid tag--danger">Deprecated</span>
<a class="tag tag--pill" href="/lab?tech=go">Go</a>
```

## States

- Static by default. As an anchor (`a.tag`): text colour shifts to accent on hover (`--dur-fast` / `--ease-out`); focus inherits the global `:where(:focus-visible)` ring.
- No disabled state — remove the tag instead of greying it out.

## Token dependencies

| Token | Role |
|---|---|
| `--font-mono`, `--fs-50`, `--fw-medium`, `--ls-mono` | uppercase mono label voice |
| `--color-bg-muted`, `--color-fg` | default pill |
| `--color-accent`, `--color-accent-muted` | accent variant |
| `--color-{success,warning,danger,info}-{bg,fg,border}` | tinted status variants |
| `--color-{success,warning,danger,info}-solid(-fg)` | solid status variants |
| `--space-2`, `--space-3` | padding + icon gap |
| `--border-hairline`, `--radius-1`, `--radius-pill` | outline + shape |

## Accessibility

- Status meaning must not rely on colour alone — the label text carries it ("Shipped", not a bare green pill).
- Tags are uppercase mono at 12px; never shrink below `--fs-50`, and don't put essential prose in tags.
- Interactive tags must be real `<a>`/`<button>` elements so the 44px-adjacent target and focus ring rules apply; keep tappable tags out of dense inline prose.
- Status colour pairs are APCA-verified via `scripts/check-contrast.mjs`; dark mode and forced-colors remap through the semantic tokens.
