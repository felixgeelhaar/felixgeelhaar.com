# `site-footer`

Global footer. Markup-heavy structural component: ships as CSS + HTML reference.

## Imports

```html
<link rel="stylesheet" href="/components/footer/footer.css">
<link rel="stylesheet" href="/components/theme-toggle/theme-toggle.css">
<script type="module" src="/components/theme-toggle/theme-toggle.element.js"></script>
```

## Markup contract

See `./footer.html`. Required:

- Sits outside `<main>` for correct landmark semantics.
- `<footer class="site-footer" role="contentinfo">`.
- Year rendered server-side or via JS; never hard-coded in the markup.
- `<fg-theme-toggle data-variant="compact">` for the toggle echo.

## Framework usage

Drop the canonical markup into any layout. Year and theme toggle are the only interactive bits; everything else is plain `<a>`.
