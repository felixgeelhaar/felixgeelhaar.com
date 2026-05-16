# `<fg-code>`

Code block with chrome (filename + language + copy button) over a monospace surface. Lit-based, light DOM.

## Imports

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3" } }
</script>
<link rel="stylesheet" href="/components/code/code.css">
<script type="module" src="/components/icon/icon.element.js"></script>
<script type="module" src="/components/code/code.element.js"></script>
```

## Tag

```html
<fg-code language="ts" filename="src/index.ts">
const greet = (name: string) =&gt; `Hello, ${name}`;
greet("Felix");
</fg-code>
```

Author plain text content; the element reads it on connect and re-renders.

If you need exact whitespace preservation (leading indentation, multi-line examples), wrap the inner content in `<pre>`:

```html
<fg-code language="bash">
<pre>cd brand
npm install
npm run build</pre>
</fg-code>
```

## Attributes

| Attribute | Default | Notes |
|---|---|---|
| `language` | `""` | Right-side mono tag (e.g. `ts`, `go`, `sql`). |
| `filename` | `""` | Left-side filename label. |
| `lines` | `false` | When set, renders line numbers in a left column. |
| `no-copy` | `false` | Hides the copy button. Use for static reference blocks. |

## Events

| Event | Detail | Notes |
|---|---|---|
| `fg:code-copy` | `{ content }` | bubbles + composed; fires on successful clipboard write |
| `fg:code-copy-error` | `{ error }` | bubbles + composed; fires when `navigator.clipboard` rejects |

## States

- Idle: copy button shows `<fg-icon name="copy">` + "Copy".
- After copy: button swaps to `<fg-icon name="check">` + "Copied" for 1.5 s, then restores. `aria-label` reflects the same so screen readers announce the change.

## Syntax highlighting

`<fg-code>` does **not** syntax-highlight. Treat highlighting as a separate concern — a build-time job for Shiki / Prism / Starry Night runs on the markdown source, then drops the highlighted HTML into the element's slot. The element handles chrome + copy; the toolchain handles colour.

For a runtime-highlighted variant later (`<fg-code highlight>`), see `task-component-primitives-expansion`.

## Accessibility

- `<pre>` is preserved (screen readers announce code blocks correctly).
- Copy button has a stateful `aria-label` ("Copy code" / "Copied").
- Touch target 44 × 44 — meets WCAG 2.2 SC 2.5.8 floor. (Bumped from 32 px after the ux-expert review flagged it as the first mobile failure point.)
- Reduced motion: handled by the global token override in `tokens.css`.
