/**
 * <fg-toc target="#article-body"> — auto-builds a table of contents
 * from the target element's h2 and h3 headings. Lit-based, light DOM.
 *
 * Each heading must have an `id` (slugified server-side at content
 * build, or via a small client-side fallback that runs before this
 * element mounts). The TOC links each entry to `#${id}` and marks
 * the currently-visible heading via IntersectionObserver.
 *
 * Attributes:
 *   - target  CSS selector for the content container (required).
 *   - depth   "2" (default) for h2 only, "3" for h2 + h3.
 *   - title   leading mono kicker (default: "On this page").
 *
 * Events:
 *   - fg:toc-built  detail = { count }
 *   - fg:toc-active detail = { id }
 */

import { LitElement, html } from "lit";

const TAG = "fg-toc";

class Toc extends LitElement {
  static properties = {
    target: { type: String },
    depth: { type: Number },
    title: { type: String },
    _items: { state: true },
    _activeId: { state: true },
  };

  constructor() {
    super();
    this.target = "";
    this.depth = 2;
    this.title = "On this page";
    this._items = [];
    this._activeId = "";
    this._observer = null;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    // Wait until the page settles; headings may be added async.
    requestAnimationFrame(() => this._build());
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    super.disconnectedCallback();
  }

  _build() {
    const container = this.target ? document.querySelector(this.target) : null;
    if (!container) return;
    const sel = this.depth >= 3 ? "h2, h3" : "h2";
    const headings = Array.from(container.querySelectorAll(sel));
    this._items = headings
      .filter((h) => h.id)
      .map((h) => ({
        id: h.id,
        level: h.tagName.toLowerCase(),
        text: h.textContent.trim(),
        el: h,
      }));

    this.dispatchEvent(
      new CustomEvent("fg:toc-built", {
        bubbles: true,
        composed: true,
        detail: { count: this._items.length },
      }),
    );

    // Observe each heading; mark the one nearest the top of the
    // viewport as active.
    if (this._observer) this._observer.disconnect();
    this._observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          this._activeId = visible[0].target.id;
          this.dispatchEvent(
            new CustomEvent("fg:toc-active", {
              bubbles: true,
              composed: true,
              detail: { id: this._activeId },
            }),
          );
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    this._items.forEach((item) => this._observer.observe(item.el));
  }

  render() {
    if (!this._items.length) return null;
    return html`
      <nav class="fg-toc" aria-label="Table of contents">
        <p class="fg-toc__title type-mono-label">${this.title}</p>
        <ol class="fg-toc__list">
          ${this._items.map(
            (i) => html`
              <li class="fg-toc__item fg-toc__item--${i.level}">
                <a
                  class="fg-toc__link ${this._activeId === i.id
                    ? "fg-toc__link--active"
                    : ""}"
                  href="#${i.id}"
                  aria-current=${this._activeId === i.id ? "true" : "false"}
                  >${i.text}</a
                >
              </li>
            `,
          )}
        </ol>
      </nav>
    `;
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, Toc);
}
