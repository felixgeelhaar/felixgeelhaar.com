# `<fg-mailto>`

Spam-resistant email link. Assembles the address at runtime so scrapers can't lift it from page source.

## Imports

```html
<script type="module" src="/components/mailto/mailto.element.js"></script>
```

No CSS package — the inner `<a>` inherits from `.link` or the parent context.

## Tag

```html
<fg-mailto user="felix" host="felixgeelhaar.com" label="Email Felix"></fg-mailto>
```

| Attribute | Default | Notes |
|---|---|---|
| `user` | `""` | Local-part of the address. Required. |
| `host` | `""` | Domain. Required. |
| `label` | `Email` | Visible link text. |
| `subject` | — | Optional subject pre-fill. |

## Behaviour

- Click → opens default mail client via `mailto:${user}@${host}` assembled at click time.
- `⌘`/`Ctrl` + click → copies the address to the clipboard, announces "Address copied" via `aria-live="polite"`.

## Why not raw mailto

Public `mailto:` links in source HTML get harvested. Modest obfuscation cuts the harvested-spam volume substantially. The element doesn't expose the full address in the DOM until the user activates the link.

## Footer wiring

The footer references `<fg-mailto user="felix" host="felixgeelhaar.com" label="Email">` instead of an `<a href="mailto:…">`. Same visual result; the address only assembles on click.
