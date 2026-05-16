/**
 * <fg-nav-toggle for="primary-nav" label="Menu">
 *
 * Vanilla custom element — no Lit dependency. The mobile nav button
 * is high-traffic and needs to work even when ESM CDN imports fail
 * (cellular network, iOS Safari timeout, importmap quirks).
 *
 * Behaviour:
 *   - Click toggles state, reflects in aria-expanded and target dataset.
 *   - Escape closes if focus is anywhere inside the toggle or target.
 *   - Clicking any anchor inside the target closes (dismiss-on-navigate).
 *   - Emits `fg:nav-toggle` (bubbles, composed) with detail = boolean.
 *
 * Markup:
 *   <fg-nav-toggle for="primary-nav" label="Menu"></fg-nav-toggle>
 *   <nav id="primary-nav" data-open="false">…</nav>
 *
 * Light DOM. The element renders a <button> on connect.
 */

const TAG = "fg-nav-toggle";
const EVENT_NAME = "fg:nav-toggle";

class NavToggle extends HTMLElement {
  static get observedAttributes() {
    return ["label", "for", "data-open"];
  }

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKey = this._onKey.bind(this);
    this._onTargetClick = this._onTargetClick.bind(this);
  }

  connectedCallback() {
    this._render();
    this.addEventListener("click", this._onClick);
    document.addEventListener("keydown", this._onKey);

    const target = this._target();
    if (target) {
      if (!target.dataset.open) target.dataset.open = "false";
      target.addEventListener("click", this._onTargetClick);
    }
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
    document.removeEventListener("keydown", this._onKey);
    const target = this._target();
    if (target) target.removeEventListener("click", this._onTargetClick);
  }

  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === "data-open") {
      this._syncTarget();
    } else {
      this._render();
    }
  }

  _target() {
    const id = this.getAttribute("for");
    return id ? document.getElementById(id) : null;
  }

  get open() {
    return this.dataset.open === "true";
  }

  set open(value) {
    const next = Boolean(value);
    this.dataset.open = String(next);
  }

  _syncTarget() {
    const open = this.open;
    const target = this._target();
    if (target) target.dataset.open = String(open);
    const btn = this.querySelector("button");
    if (btn) btn.setAttribute("aria-expanded", String(open));
    this.dispatchEvent(
      new CustomEvent(EVENT_NAME, {
        bubbles: true,
        composed: true,
        detail: open,
      }),
    );
  }

  _onClick(event) {
    event.preventDefault();
    this.open = !this.open;
  }

  _onKey(event) {
    if (event.key !== "Escape" || !this.open) return;
    const target = this._target();
    const within =
      this.contains(event.target) ||
      (target && target.contains(event.target));
    if (!within) return;
    this.open = false;
    this.focus();
  }

  _onTargetClick(event) {
    if (event.target instanceof HTMLAnchorElement) {
      this.open = false;
    }
  }

  _render() {
    const label = this.getAttribute("label") || "Menu";
    const targetId = this.getAttribute("for") || "";
    if (!this._mounted) {
      this.innerHTML = `<button type="button" part="button" aria-expanded="false" aria-controls="${targetId}" aria-label="Toggle navigation menu"></button>`;
      this._mounted = true;
    }
    const btn = this.querySelector("button");
    if (btn) {
      btn.textContent = label;
      btn.setAttribute("aria-controls", targetId);
    }
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, NavToggle);
}
