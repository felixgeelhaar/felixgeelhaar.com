/**
 * <fg-ai-disclosure tier="A|B|C"> — mechanically enforces the three
 * AI content disclosure tiers from docs/ai-disclosure.md. Lit-based,
 * light DOM.
 *
 * Tiers:
 *   A — Light       AI helped, Felix edited
 *   B — Heavy       AI wrote, Felix reviewed
 *   C — Generated   AI wrote, unedited
 *
 * Markup:
 *   <fg-ai-disclosure tier="B" sources="/writing/why-platforms-rot">
 *     This summary is AI-generated. Read the
 *     <a href="/writing/why-platforms-rot" class="link">source essay</a>
 *     to verify.
 *   </fg-ai-disclosure>
 *
 * The element captures children once on connect, then re-renders into
 * a card with kicker + icon + body + optional sources footer. Authors
 * never hand-roll the chrome; the element owns it. Every disclosure
 * carries a link to /policy/ai so a reader can learn what the
 * disclosure means even on first encounter.
 *
 * Attributes:
 *   - tier       "A" | "B" | "C". Required (default B).
 *   - sources    optional space-separated list of source URLs/labels.
 *                Renders as a "Sources:" footer with linked entries.
 */

import { LitElement, html } from "lit";
import { unsafeHTML } from "https://esm.sh/lit@3/directives/unsafe-html.js";

const TAG = "fg-ai-disclosure";

const TIER_COPY = {
  A: {
    kicker: "AI-assisted",
    fallback: "Draft written with AI, edited by Felix.",
    iconName: "info",
  },
  B: {
    kicker: "AI-generated",
    fallback:
      "This content is AI-generated. Verify against the source before quoting.",
    iconName: "info",
  },
  C: {
    kicker: "AI-generated · unverified",
    fallback: "AI-generated. May be wrong — verify before quoting.",
    iconName: "alert-triangle",
  },
};

class AiDisclosure extends LitElement {
  static properties = {
    tier: { type: String },
    sources: { type: String },
    _body: { state: true },
  };

  constructor() {
    super();
    this.tier = "B";
    this.sources = "";
    this._body = "";
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    // Capture children before Lit replaces innerHTML on first render.
    this._body = this.innerHTML.trim();
    super.connectedCallback();
  }

  _renderSources() {
    if (!this.sources) return null;
    const items = this.sources
      .split(/\s+/)
      .filter(Boolean)
      .map((s) => {
        const isUrl = /^https?:\/\//.test(s) || s.startsWith("/");
        return { href: isUrl ? s : null, label: s };
      });
    if (!items.length) return null;
    return html`
      <div class="fg-ai-disclosure__sources">
        <span class="fg-ai-disclosure__sources-label">Sources</span>
        <ul>
          ${items.map(
            (it) =>
              html`<li>
                ${it.href
                  ? html`<a class="link" href=${it.href}>${it.label}</a>`
                  : html`${it.label}`}
              </li>`,
          )}
        </ul>
      </div>
    `;
  }

  render() {
    const tier = TIER_COPY[this.tier] || TIER_COPY.B;
    return html`
      <aside
        class="fg-ai-disclosure fg-ai-disclosure--${this.tier.toLowerCase()}"
        role="note"
        aria-label=${`AI content disclosure (${tier.kicker})`}
      >
        <div class="fg-ai-disclosure__chrome">
          <fg-icon name=${tier.iconName} data-size="sm" class="fg-ai-disclosure__icon"></fg-icon>
          <span class="fg-ai-disclosure__kicker">${tier.kicker}</span>
        </div>
        <div class="fg-ai-disclosure__body">
          ${this._body
            ? unsafeHTML(this._body)
            : html`<p>${tier.fallback}</p>`}
        </div>
        ${this._renderSources()}
        <p class="fg-ai-disclosure__policy">
          <a class="link" href="/policy/ai">What AI disclosure means →</a>
        </p>
      </aside>
    `;
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, AiDisclosure);
}
