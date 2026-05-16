# `<fg-icon>`

One icon from the shared SVG sprite. Lit-based, light DOM, `currentColor` inherits from the parent.

## Imports

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3" } }
</script>
<link rel="stylesheet" href="/components/icon/icon.css">
<script type="module" src="/components/icon/icon.element.js"></script>
```

## Tag

```html
<fg-icon name="arrow-right"></fg-icon>
<fg-icon name="check" data-size="md" label="Saved"></fg-icon>
```

## Attributes

| Attribute | Values | Default | Notes |
|---|---|---|---|
| `name` | sprite symbol id | — | Required. See sprite.svg for the catalogue. |
| `data-size` | `xs` `sm` `md` `lg` | `sm` (20 px) | xs 16, sm 20, md 24, lg 32. |
| `label` | string | — | If present, icon gets `role="img"` + `<title>`. If absent, it's aria-hidden. |
| `sprite-url` | url | `/components/icon/sprite.svg` | Override when serving from a CDN or subpath. |

## Plain `<svg>` fallback

When the element script isn't loaded (SSR initial paint, build-time emails, etc.), use raw SVG with the same sprite:

```html
<svg class="fg-icon" aria-hidden="true" viewBox="0 0 24 24" focusable="false">
  <use href="/components/icon/sprite.svg#arrow-right"></use>
</svg>
```

`fg-icon.css` styles `.fg-icon` to match the component baseline.

## Catalogue (v0)

Navigation: `arrow-right`, `arrow-left`, `arrow-up-right`, `chevron-down`, `chevron-right`, `menu`, `x`
Status: `check`, `alert-triangle`, `alert-circle`, `info`
Actions: `copy`, `external-link`
Theme: `moon`, `sun`
Social / surfaces: `github`, `rss`

Sources: paths derived from [Lucide](https://lucide.dev) (ISC). Add an icon by appending a `<symbol id="…">` to `sprite.svg`; viewBox stays `0 0 24 24`, stroke-width `1.5`.

## Accessibility

- Decorative icons (no `label`) get `aria-hidden="true"` so screen readers skip them.
- Meaningful icons (`label="…"`) get `role="img"` and a `<title>` child so screen readers announce them.
- `currentColor` means contrast checks happen at the parent. The parent must pass APCA, not the icon.
