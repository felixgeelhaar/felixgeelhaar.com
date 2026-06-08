# `.link`

Inline prose link. Underlined via border-bottom; colour lifts to accent on hover. Distinct from `.btn` (actions/CTAs) and from footer link styles. Reserve `.link` for references inside sentences.

## Imports

```html
<link rel="stylesheet" href="/components/link/link.css">
```

## Variants

| Class | Use |
|---|---|
| `a.link` | default — ink text, hairline underline; accent on hover |
| `a.link--external` | adds icon spacing for an inline `fg-icon`/`svg` (arrow-up-right convention) |
| `a.link--accent` | accent colour from the start — when colour itself is the affordance ("Read more →" rows) |

## Usage

```html
<p>See the <a class="link" href="/writing/tokens">tokens essay</a>.</p>

<a class="link link--external" href="https://example.com" target="_blank" rel="noopener">
  example.com <fg-icon name="arrow-up-right" data-size="xs"></fg-icon>
</a>
```

## States

- Hover: text and underline shift to `--color-accent` (`--dur-fast` / `--ease-out`).
- Focus: inherits the global `:where(:focus-visible)` ring from tokens.css.
- `--accent`: underline is transparent at rest, appears on hover.

## Token dependencies

| Token | Role |
|---|---|
| `--color-fg`, `--color-accent` | rest / hover colour |
| `--border-hairline`, `--color-line-strong` | underline |
| `--dur-fast`, `--ease-out` | hover transition |
| `--space-1` | external-icon gap |

## Accessibility

- Underline (border) keeps links distinguishable without relying on colour alone (WCAG 1.4.1). `--accent` drops the rest underline — use it only where surrounding context (an actions row, a card footer) makes the link role obvious.
- External links: keep `rel="noopener"` with `target="_blank"`, and the arrow icon is decorative — give it `aria-hidden="true"` or append visually-hidden "(opens in new tab)" text when the destination change isn't clear from copy.
- Forced-colors: borders and `LinkText` mapping survive via the semantic-token block in tokens.css.
