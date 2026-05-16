# `site-header`

Global header. Markup-heavy structural component: ships as CSS + HTML reference, no element wrapper.

## Imports

```html
<link rel="stylesheet" href="/components/header/header.css">
<link rel="stylesheet" href="/components/theme-toggle/theme-toggle.css">
<link rel="stylesheet" href="/components/nav-toggle/nav-toggle.css">
<script type="module" src="/components/theme-toggle/theme-toggle.element.js"></script>
<script type="module" src="/components/nav-toggle/nav-toggle.element.js"></script>
```

## Markup contract

See `./header.html`. Required:

- `<a class="skip-link" href="#main">…</a>` — first focusable element on every page.
- A `<main id="main" tabindex="-1">` exists somewhere on the page (skip-link target).
- `<nav class="site-nav" id="primary-nav" data-open="false">…</nav>` — `<fg-nav-toggle for="primary-nav">` controls it.
- `aria-current="page"` on the matching primary nav `<a>` for the current route.
- Primary nav routes match `/docs/ia.md`.

## Framework usage

Drop the canonical markup into any framework's layout. The two interactive bits are `<fg-theme-toggle>` and `<fg-nav-toggle>` — see their component READMEs.
