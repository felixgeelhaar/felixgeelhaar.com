# `<fg-modal>`

> **Deferred to v1.1+**: no v1.0 page needs a modal. Ships in the system
> ready for the first real consumer (consent banner if cookies ever
> arrive, command palette, destructive-action confirmation). See
> `docs/launch-criteria.md`.

Behavioural wrapper over a native `<dialog>`. Author the markup, the element handles open/close, focus return, scroll lock, backdrop dismiss, and ESC.

## Imports

```html
<link rel="stylesheet" href="/components/modal/modal.css">
<script type="module" src="/components/modal/modal.element.js"></script>
```

`<fg-modal>` is plain HTMLElement (not Lit). It owns behaviour, not template — children stay exactly as authored.

## Markup contract

```html
<fg-modal id="confirm-delete">
  <dialog class="fg-modal__dialog" aria-labelledby="confirm-delete-title">
    <header class="fg-modal__header">
      <h2 id="confirm-delete-title" class="fg-modal__title">Delete project?</h2>
      <button class="fg-modal__close" type="button" data-fg-close aria-label="Close">
        <fg-icon name="x" data-size="sm"></fg-icon>
      </button>
    </header>
    <div class="fg-modal__body">…</div>
    <footer class="fg-modal__actions">
      <button class="btn btn--ghost" data-fg-close>Cancel</button>
      <button class="btn btn--accent">Delete</button>
    </footer>
  </dialog>
</fg-modal>
```

Required:

- `<fg-modal>` carries an `id`.
- Direct child is `<dialog class="fg-modal__dialog" aria-labelledby="…">`. The id pattern conventionally is `${modal-id}-title`.
- Header contains a heading with the matching id and a close button with `data-fg-close`.

## Triggers

```html
<button class="btn btn--accent" data-fg-modal-open="confirm-delete">
  Delete project
</button>
```

`data-fg-modal-open` references the modal's id. Multiple triggers can target the same modal. The element wires them on connect; for dynamically-added triggers, call `modal.open()` directly.

## API

```js
const m = document.getElementById('confirm-delete');
m.open();    // attribute reflection + show + lock scroll
m.close();
m.toggle();
m.hasAttribute('open'); // current state
```

## Events

| Event | Detail | Notes |
|---|---|---|
| `fg:modal-open` | the `<fg-modal>` element | bubbles + composed |
| `fg:modal-close` | the `<fg-modal>` element | bubbles + composed; fires for any reason (ESC, backdrop, button, programmatic) |

## Accessibility

- Native `<dialog>` handles focus trap, ESC, and `inert` for the rest of the page.
- `aria-labelledby` ties the dialog to its title for screen readers — required.
- Close button has `aria-label="Close"` since its visible content is an icon.
- Focus returns to the trigger button when the modal closes.
- Reduced motion: native dialog has no animation by default; if your CSS adds one, wrap it in `@media (prefers-reduced-motion: no-preference)`.
- Forced colours: the backdrop loses its `rgb(0 0 0 / 0.5)` and the OS substitutes a default; the dialog chrome (border, text) still renders correctly.

## Why not Lit

`<fg-modal>` is the system's first vanilla custom element. Its behaviour is imperative (open / close / focus return) and its content is fully author-controlled. Lit's reactive template is overkill — every render would have to dance around the user-provided children. Plain HTMLElement keeps the element ~120 lines and one read away from understandable.
