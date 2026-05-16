/**
 * <fg-icon name="…"> — vanilla custom element. No Lit dependency.
 *
 * Renders one icon from the shared SVG sprite. Light DOM, currentColor
 * inherits from the parent. The icon is high-traffic across every page
 * and needs to work even when ESM-CDN imports fail (cellular network,
 * iOS Safari timeout, importmap quirks).
 *
 * Markup:
 *   <fg-icon name="arrow-right"></fg-icon>
 *   <fg-icon name="check" data-size="md" label="Saved"></fg-icon>
 *
 * Attributes:
 *   - name (required): symbol id in the sprite (e.g. "arrow-right").
 *   - data-size: "xs" | "sm" | "md" | "lg" (defaults to "sm" via CSS).
 *   - label: accessible name. When present, the icon gets role="img"
 *     + <title>. When absent, the icon is aria-hidden (decorative).
 *   - sprite-url: optional override of the sprite path.
 */

const TAG = "fg-icon";
// Resolve sprite URL relative to THIS module so the element works at
// any host path (root, /brand/ subpath on GitHub Pages, file:// for
// local previews).
const DEFAULT_SPRITE = new URL("./sprite.svg", import.meta.url).href;

class Icon extends HTMLElement {
  static get observedAttributes() {
    return ["name", "label", "sprite-url"];
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }

  _render() {
    const name = this.getAttribute("name");
    if (!name) {
      this.innerHTML = "";
      return;
    }
    const sprite = this.getAttribute("sprite-url") || DEFAULT_SPRITE;
    const label = this.getAttribute("label");
    const labelled = Boolean(label);
    const titleEl = labelled ? `<title>${escapeXml(label)}</title>` : "";
    this.innerHTML = `<svg viewBox="0 0 24 24" role="${labelled ? "img" : "presentation"}" aria-hidden="${labelled ? "false" : "true"}" focusable="false">${titleEl}<use href="${sprite}#${escapeAttr(name)}"></use></svg>`;
  }
}

function escapeAttr(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function escapeXml(value) {
  return escapeAttr(value);
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, Icon);
}
