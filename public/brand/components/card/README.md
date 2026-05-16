# `card`

Markup-heavy primitive used across writing index, lab index, and home page rows. Whole card is clickable when wrapped in `<a>`; focus ring inherits from the global rule.

## Imports

```html
<link rel="stylesheet" href="/components/card/card.css">
```

## Variants

| Class | Use | Title type |
|---|---|---|
| `card--writing` | writing index entries | sans semibold 24 px |
| `card--project` | lab project entries | **mono** medium 24 px (System-Diagram cue) |
| `card--feature` | home page row | sans semibold 32 px, +padding |

All three share the same skeleton: kicker → title → lede → meta.

## Slots

| Element | Purpose |
|---|---|
| `.card__kicker` | mono caps line, accent rule indicator before |
| `.card__title` | heading-level summary |
| `.card__lede` | 2-line clamped intro (3 lines on `--feature`) |
| `.card__meta` | inline metadata (date · tags · reading-time) |
| `.card__meta-row` | flex row of tag pills |
| `.card__tag` | one pill |

## States

- Anchor cards: hover lifts a hairline-thick shadow + shifts border to `line-strong` + colours the title accent.
- Inactive (non-anchor) cards: no hover state.
- Focus: inherits global `:where(:focus-visible)` ring.

## Framework usage

Drop the canonical markup into any layout. No JS dependency; pure structural CSS. The mono title in `--project` reinforces the lab-vs-writing visual split documented in the upcoming `task-lab-vs-writing-distinction-rules`.
