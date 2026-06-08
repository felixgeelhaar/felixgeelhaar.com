# `kbd`

Keyboard shortcut indicator for prose. Native `<kbd>` is styled automatically via `:where(kbd)` (specificity 0); the `.kbd` class applies the same chrome to non-`kbd` elements.

## Imports

```html
<link rel="stylesheet" href="/components/kbd/kbd.css">
```

## Classes

| Selector | Use |
|---|---|
| `kbd` (element) | semantic default — prefer this in prose |
| `.kbd` | same chrome on a non-`kbd` element (rare; e.g. a span inside a tooltip) |

## Usage

```html
Press <kbd>⌘</kbd> + <kbd>K</kbd> to open search.
```

Combos are authored as sibling `<kbd>` elements joined by a literal `+` in the text — one key per element, never `<kbd>⌘K</kbd>`.

## States

Static primitive — no hover, focus, or active states. Not interactive; never make it a click target.

## Token dependencies

| Token | Role |
|---|---|
| `--font-mono`, `--fs-50`, `--fw-medium`, `--ls-mono` | mono metadata voice |
| `--color-fg`, `--color-bg-muted` | key cap surface |
| `--border-hairline`, `--color-line-strong` | cap outline |
| `--radius-1` | cap corner |
| `--space-3` | horizontal padding |

## Accessibility

- `<kbd>` is the correct semantic element for user input; screen readers announce content normally.
- Use real glyphs (`⌘`, `⇧`) with care: pair with text the first time a shortcut is introduced ("Command-K (<kbd>⌘</kbd> + <kbd>K</kbd>)") so the meaning survives unfamiliar symbols.
- Colours come from semantic tokens, so dark mode and forced-colors remap automatically.
