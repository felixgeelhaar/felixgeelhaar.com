/**
 * <fg-reading-progress target="#article-body"> — fixed thin bar at
 * the top of the viewport that fills as the reader scrolls through
 * the target element. Lit-based, light DOM.
 *
 * Attributes:
 *   - target   CSS selector for the content container (required).
 *   - position "top" (default) | "bottom"
 *
 * Reduced motion is fine here — the bar's transform doesn't move
 * counter to the user's scroll; it tracks it. But we still respect the
 * global motion override by keeping the transition duration tied to
 * --dur-fast.
 */

import { LitElement, html } from "lit";

const TAG = "fg-reading-progress";

class ReadingProgress extends LitElement {
  static properties = {
    target: { type: String },
    position: { type: String },
    _progress: { state: true },
  };

  constructor() {
    super();
    this.target = "";
    this.position = "top";
    this._progress = 0;
    this._onScroll = this._onScroll.bind(this);
    this._raf = null;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("scroll", this._onScroll, { passive: true });
    window.addEventListener("resize", this._onScroll, { passive: true });
    requestAnimationFrame(() => this._onScroll());
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this._onScroll);
    window.removeEventListener("resize", this._onScroll);
    if (this._raf) cancelAnimationFrame(this._raf);
    super.disconnectedCallback();
  }

  _onScroll() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(() => this._compute());
  }

  _compute() {
    const el = this.target ? document.querySelector(this.target) : null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = el.offsetHeight - window.innerHeight;
    const passed = -rect.top;
    const pct = total > 0 ? Math.min(1, Math.max(0, passed / total)) : 0;
    this._progress = pct;
  }

  render() {
    return html`
      <div
        class="fg-reading-progress fg-reading-progress--${this.position}"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${Math.round(this._progress * 100)}
        aria-label="Reading progress"
      >
        <div
          class="fg-reading-progress__bar"
          style=${`transform: scaleX(${this._progress})`}
        ></div>
      </div>
    `;
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, ReadingProgress);
}
