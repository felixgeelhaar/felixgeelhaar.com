# `form`

Single-column form primitives — label, input, textarea, select, checkbox, radio, fieldset, helper, error. Pure structural CSS; no JS in this package.

## Imports

```html
<link rel="stylesheet" href="/components/form/form.css">
```

## Markup contract

Every field follows the same shape:

```html
<div class="form-field">
  <label for="field-id" class="form-label">
    Visible label
    <span class="form-label__required">required</span>
  </label>
  <input id="field-id" class="form-input" aria-describedby="field-id-help" />
  <p id="field-id-help" class="form-helper">Helper text.</p>
</div>
```

Required:
- Unique `id` on the input.
- `<label for="…">` tied to that id.
- `aria-describedby` pointing at the helper or error element.

Error state:

```html
<div class="form-field form-field--error">
  <label for="field-id" class="form-label">Visible label</label>
  <input
    id="field-id"
    class="form-input"
    aria-invalid="true"
    aria-describedby="field-id-error"
  />
  <p id="field-id-error" class="form-error" role="alert">Error message.</p>
</div>
```

`role="alert"` on the error paragraph announces it via screen reader the moment it appears. `aria-invalid="true"` on the input gives assistive tech the same signal programmatically.

## Classes

| Class | Purpose |
|---|---|
| `.form` | flex column container, max-width 480 px |
| `.form-field` | label + input + helper stack |
| `.form-row` | side-by-side fields, wraps below ~440 px |
| `.form-label` | the visible label |
| `.form-label__required` | mono "required" tag |
| `.form-input` | text/email/url/number/password input |
| `.form-textarea` | multi-line input, 4 rows default |
| `.form-select` | select with inline chevron |
| `.form-helper` | secondary line below the input |
| `.form-error` | replaces the helper in error state |
| `.form-check` | wrapping label for checkbox/radio |
| `.form-fieldset` | bordered group |
| `.form-legend` | mono caps heading for fieldset |

## Rules

- Label above the field. Never floating, never inside.
- One column. `.form-row` is the only side-by-side allowed, and only for tight pairs (`First / Last`, `City / Postcode`).
- Validate on `blur`, never on every keystroke.
- Required fields marked in text (`required` tag), never colour-only.
- Touch targets ≥ 44 × 44 (inputs already meet this via `min-height`).
- Use `autocomplete` on every input that takes user-personal data.

## What this package does NOT include

- Client-side validation logic (the next form/component will own it).
- Server submission. Hook the form action up in the consuming page.
- A combobox / multiselect / typeahead. Those land later as dedicated `<fg-*>` elements.
