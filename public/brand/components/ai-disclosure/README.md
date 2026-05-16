# `<fg-ai-disclosure>`

The only way AI-touched content ships on the site. Mechanically enforces the three tiers documented in `docs/ai-disclosure.md`.

## Imports

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3" } }
</script>
<link rel="stylesheet" href="/components/ai-disclosure/ai-disclosure.css">
<script type="module" src="/components/icon/icon.element.js"></script>
<script type="module" src="/components/ai-disclosure/ai-disclosure.element.js"></script>
```

## Tag

```html
<fg-ai-disclosure tier="B" sources="/writing/why-platforms-rot">
  This summary is AI-generated. Read the
  <a href="/writing/why-platforms-rot" class="link">source essay</a>
  to verify.
</fg-ai-disclosure>
```

The body is your own HTML; the element wraps it in the disclosure chrome (icon + tier kicker + your body + sources footer + permanent link to /policy/ai).

## Tiers

| Tier | Meaning | Visual |
|---|---|---|
| `A` | AI helped, Felix edited | info tint, info icon |
| `B` | AI wrote, Felix reviewed (default) | info tint, info icon |
| `C` | AI wrote, unedited | **warning tint**, warning-triangle icon |

C is intentionally the loudest. It's the disclosure that prevents the Misinformed-Use failure mode (Holmes), so it gets the strongest visual treatment.

## Attributes

| Attribute | Default | Notes |
|---|---|---|
| `tier` | `B` | Required in practice. |
| `sources` | `""` | Space-separated URLs or labels. URLs become links; bare labels render as text. |

## Why mechanical enforcement

A docs-only pattern drifts. Every author has slightly different rules in mind; six months later the disclosures look different on every essay. The element guarantees:

1. Every disclosure has a kicker, an icon, and a tier.
2. Every disclosure links to `/policy/ai` so a first-time reader can decode it.
3. Tier C is visually distinct from A/B — over-trust never looks like a routine note.

Hand-rolling the same chrome in markdown drops at least one of those.

## Out of scope (v1)

- Thumbs / regenerate / report-hallucination buttons — track via the implicit signals first (copy rate, regenerate rate via the underlying tool). Add later if the volume justifies a feedback UI.
- A `<fg-citation>` companion element — sources for now are inline; promote to a separate component when footnotes get rich.
