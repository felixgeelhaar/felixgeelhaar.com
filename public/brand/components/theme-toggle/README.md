# `<fg-theme-toggle>`

Toggles document theme between light and dark.

## Tag

```html
<fg-theme-toggle></fg-theme-toggle>
```

## Imports

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3" } }
</script>
<link rel="stylesheet" href="/components/theme-toggle/theme-toggle.css">
<script type="module" src="/components/theme-toggle/theme-toggle.element.js"></script>
```

## Attributes

| Attribute | Values | Default | Notes |
|---|---|---|---|
| `label` | string | `Theme` | Text shown before the value (`Theme: light`) |
| `data-variant` | `compact` | — | Compact variant reduces min-height to 32px |
| `data-theme` | `light` \| `dark` | inherited | Reflects current; not set manually |

## Events

| Event | Detail | Notes |
|---|---|---|
| `fg:theme-change` | `"light"` \| `"dark"` | Bubbles + composed. Fires on toggle. All instances on the page sync via this. |

## State management

- Reads `document.documentElement.dataset.theme` first, falls back to `localStorage["fg.theme"]`, then `prefers-color-scheme`, then `light`.
- Writes the resolved theme back to `documentElement` and `localStorage` on every change.
- Multiple instances on the same page stay in sync automatically — no parent wiring needed.

## Framework usage

### Vanilla HTML

```html
<fg-theme-toggle></fg-theme-toggle>
```

### Vue 3

```vue
<fg-theme-toggle @fg:theme-change="handle" />
```

Add `compilerOptions.isCustomElement: tag => tag.startsWith('fg-')` to Vue config.

### Astro

```astro
---
import "@brand/components/theme-toggle/theme-toggle.element.js";
---
<fg-theme-toggle />
```

### React 19+

```tsx
<fg-theme-toggle onfg:theme-change={handle} />
```

### React 18 (until upgrade)

Thin wrapper required — see `adapters/react/ThemeToggle.tsx`.
