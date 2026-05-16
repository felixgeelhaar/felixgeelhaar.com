/**
 * <fg-code> — code block with chrome (language tag + filename + copy
 * button). Lit-based, light DOM.
 *
 * The element reads its text content on connect, stores it, and re-
 * renders the chrome + <pre><code> with that content. Author markup:
 *
 *   <fg-code language="ts" filename="src/index.ts">
 *     const greet = (name: string) =&gt; `Hello, ${name}`;
 *   </fg-code>
 *
 * To preserve whitespace exactly, wrap raw children in a <pre> tag —
 * the element will use its trimmed text but the leading newline
 * convention is intentional (the example above renders without a
 * leading blank line).
 *
 * Attributes:
 *   - language   string label shown in the chrome (e.g. "ts", "go")
 *   - filename   optional file path label
 *   - lines      "true" to show line numbers
 *   - no-copy    disables the copy button (for static reference blocks)
 *
 * Events:
 *   - fg:code-copy  detail = { content } when copy succeeds
 *   - fg:code-copy-error detail = { error } on clipboard failure
 */

import { LitElement, html } from "lit";

const TAG = "fg-code";

class CodeBlock extends LitElement {
  static properties = {
    language: { type: String },
    filename: { type: String },
    lines: { type: Boolean },
    noCopy: { type: Boolean, attribute: "no-copy" },
    _code: { state: true },
    _copied: { state: true },
  };

  constructor() {
    super();
    this.language = "";
    this.filename = "";
    this.lines = false;
    this.noCopy = false;
    this._code = "";
    this._copied = false;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    // Capture text BEFORE Lit replaces innerHTML on first render.
    this._code = this._readCode();
    super.connectedCallback();
  }

  _readCode() {
    // If the author wrapped the code in <pre>, preserve indentation.
    const pre = this.querySelector("pre");
    const raw = pre ? pre.textContent : this.textContent;
    return (raw || "").replace(/^\n/, "").replace(/\n\s*$/, "");
  }

  async _copy() {
    try {
      await navigator.clipboard.writeText(this._code);
      this._copied = true;
      this.dispatchEvent(
        new CustomEvent("fg:code-copy", {
          bubbles: true,
          composed: true,
          detail: { content: this._code },
        }),
      );
      setTimeout(() => {
        this._copied = false;
      }, 1500);
    } catch (err) {
      this.dispatchEvent(
        new CustomEvent("fg:code-copy-error", {
          bubbles: true,
          composed: true,
          detail: { error: err },
        }),
      );
    }
  }

  _renderLines(code) {
    const arr = code.split("\n");
    return html`<table class="fg-code__table" aria-hidden="true">
      <tbody>
        ${arr.map(
          (line, i) => html`
            <tr>
              <td class="fg-code__lineno">${i + 1}</td>
              <td class="fg-code__line">${line || " "}</td>
            </tr>
          `,
        )}
      </tbody>
    </table>`;
  }

  render() {
    const showChrome = this.language || this.filename || !this.noCopy;
    return html`
      <div class="fg-code">
        ${showChrome
          ? html`
              <div class="fg-code__chrome">
                <div class="fg-code__meta">
                  ${this.filename
                    ? html`<span class="fg-code__filename">${this.filename}</span>`
                    : null}
                  ${this.language
                    ? html`<span class="fg-code__lang">${this.language}</span>`
                    : null}
                </div>
                ${this.noCopy
                  ? null
                  : html`
                      <button
                        class="fg-code__copy"
                        type="button"
                        @click=${this._copy}
                        aria-label=${this._copied ? "Copied" : "Copy code"}
                      >
                        <fg-icon
                          name=${this._copied ? "check" : "copy"}
                          data-size="xs"
                        ></fg-icon>
                        <span class="fg-code__copy-label">
                          ${this._copied ? "Copied" : "Copy"}
                        </span>
                      </button>
                    `}
              </div>
            `
          : null}
        <pre class="fg-code__pre"><code class="fg-code__code"
          >${this.lines ? this._renderLines(this._code) : this._code}</code></pre>
      </div>
    `;
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, CodeBlock);
}
