# `<fg-nav-toggle>`

Mobile hamburger that opens and closes a target navigation element.

## Tag

```html
<fg-nav-toggle for="primary-nav" label="Menu"></fg-nav-toggle>
<nav id="primary-nav" data-open="false">…</nav>
```

## Imports

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3" } }
</script>
<link rel="stylesheet" href="/components/nav-toggle/nav-toggle.css">
<script type="module" src="/components/nav-toggle/nav-toggle.element.js"></script>
```

## Attributes

| Attribute | Values | Default | Notes |
|---|---|---|---|
| `for` | element id | — | Required. Target receives `data-open` and `aria-controls` link. |
| `label` | string | `Menu` | Button text. |
| `data-open` | `true` \| `false` | `false` | Reflects current state. |

## Events

| Event | Detail | Notes |
|---|---|---|
| `fg:nav-toggle` | `boolean` | Bubbles + composed. `true` = open, `false` = closed. |

## Behaviour

- Hidden above 768px via CSS — header keeps the inline nav at that size.
- Click toggles `open` state, mirrors it onto the target's `data-open`.
- `Escape` closes when focus is inside the toggle or the target.
- Clicking any anchor inside the target closes (drawer dismiss-on-navigate).
- Header CSS animates the target on `data-open="true"`.

## Framework usage

Same import + tag in every framework. Vue/React 19/Astro all treat it as native HTML. React 18 needs a thin wrapper (see `adapters/react/`).
