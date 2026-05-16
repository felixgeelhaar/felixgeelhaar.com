/**
 * <fg-theme-toggle> — switches the document theme between light + dark.
 *
 * Behaviour:
 *   - Writes data-theme="light|dark" on documentElement.
 *   - Persists choice in localStorage under "fg.theme".
 *   - Honors prefers-color-scheme as the initial value when storage is empty.
 *   - Emits `fg:theme-change` (bubbles, composed) with detail = "light"|"dark".
 *   - Multiple instances on a page stay in sync via that event.
 *
 * Markup:
 *   <fg-theme-toggle></fg-theme-toggle>
 *
 * Lit-based. Light DOM (tokens cascade). No build step required —
 * imported from the ESM CDN via the page-level importmap.
 */

import { LitElement, html } from "lit";

const TAG = "fg-theme-toggle";
const STORAGE_KEY = "fg.theme";
const EVENT_NAME = "fg:theme-change";

function resolveInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* storage may be blocked — fall through */
  }
  if (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

class ThemeToggle extends LitElement {
  static properties = {
    label: { type: String },
    theme: { type: String, reflect: true, attribute: "data-theme" },
  };

  constructor() {
    super();
    this.label = "Theme";
    this.theme = "light";
    this._onExternalChange = this._onExternalChange.bind(this);
  }

  // Render into light DOM so tokens.css cascades naturally.
  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    const initial =
      document.documentElement.dataset.theme || resolveInitialTheme();
    document.documentElement.dataset.theme = initial;
    this.theme = initial;
    document.addEventListener(EVENT_NAME, this._onExternalChange);
  }

  disconnectedCallback() {
    document.removeEventListener(EVENT_NAME, this._onExternalChange);
    super.disconnectedCallback();
  }

  _toggle() {
    const next = this.theme === "dark" ? "light" : "dark";
    this._apply(next, true);
  }

  _apply(value, broadcast) {
    if (value !== "light" && value !== "dark") return;
    if (this.theme === value) return;
    this.theme = value;
    document.documentElement.dataset.theme = value;
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    if (broadcast) {
      this.dispatchEvent(
        new CustomEvent(EVENT_NAME, {
          bubbles: true,
          composed: true,
          detail: value,
        }),
      );
    }
  }

  _onExternalChange(event) {
    if (event.target === this) return;
    this._apply(event.detail, false);
  }

  render() {
    return html`
      <button
        type="button"
        part="button"
        aria-label="Toggle colour theme"
        @click=${this._toggle}
      >
        <span class="fg-theme-toggle__label">${this.label}:</span>
        <span class="fg-theme-toggle__value">${this.theme}</span>
      </button>
    `;
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, ThemeToggle);
}
