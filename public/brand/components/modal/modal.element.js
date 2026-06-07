/**
 * <fg-modal> — behavioural wrapper over a native <dialog>.
 *
 * The host element renders nothing of its own (light DOM, no Lit
 * template). Author the dialog markup as a child of <fg-modal> using
 * the `.fg-modal__*` classes from modal.css. The element wires:
 *
 *   - open / close state via the `open` attribute + open()/close()/toggle()
 *   - [data-fg-close] inside the modal closes it
 *   - Backdrop click closes (clicks outside the dialog content rect)
 *   - Escape key closes (native <dialog> behaviour)
 *   - Scroll lock on body while open
 *   - Focus returns to the trigger button when the modal closes
 *   - External <button data-fg-modal-open="$id"> auto-wired (one-time, on
 *     element-connected — for dynamic triggers call modalEl.open() yourself)
 *
 * Events (bubble + composed):
 *   - `fg:modal-open`   detail = this
 *   - `fg:modal-close`  detail = this
 *
 * Markup contract:
 *   <fg-modal id="m-1" label="Confirm delete">
 *     <dialog class="fg-modal__dialog" aria-labelledby="m-1-title">
 *       …
 *     </dialog>
 *   </fg-modal>
 *
 * Modal stays plain HTML so any framework — vanilla, Vue, Astro, React —
 * can render the markup verbatim. No Lit dependency for this one; the
 * behaviour is imperative, not templated.
 */

const TAG = "fg-modal";
const EVENT_OPEN = "fg:modal-open";
const EVENT_CLOSE = "fg:modal-close";

class Modal extends HTMLElement {
  static get observedAttributes() {
    return ["open"];
  }

  constructor() {
    super();
    this._onDialogClose = this._onDialogClose.bind(this);
    this._onDialogClick = this._onDialogClick.bind(this);
    this._onCloseTriggerClick = this._onCloseTriggerClick.bind(this);
    this._onOpenTriggerClick = this._onOpenTriggerClick.bind(this);
    this._lastFocus = null;
    /** Elements we attached listeners to, so disconnect can detach them. */
    this._closeTriggers = [];
    this._openTriggers = [];
  }

  connectedCallback() {
    this._dialog = this.querySelector("dialog");
    if (!this._dialog) {
      console.warn("<fg-modal> requires a child <dialog>");
      return;
    }
    this._dialog.addEventListener("close", this._onDialogClose);
    this._dialog.addEventListener("click", this._onDialogClick);

    this._closeTriggers = [...this.querySelectorAll("[data-fg-close]")];
    this._closeTriggers.forEach((el) => {
      el.addEventListener("click", this._onCloseTriggerClick);
    });

    // Auto-wire external triggers that reference this modal by id.
    if (this.id) {
      this._openTriggers = [
        ...document.querySelectorAll(`[data-fg-modal-open="${this.id}"]`),
      ];
      this._openTriggers.forEach((trigger) => {
        trigger.addEventListener("click", this._onOpenTriggerClick);
      });
    }
  }

  disconnectedCallback() {
    if (this._dialog) {
      this._dialog.removeEventListener("close", this._onDialogClose);
      this._dialog.removeEventListener("click", this._onDialogClick);
    }
    // Detach every listener we added in connectedCallback — external
    // triggers especially outlive this element, so leaving handlers on
    // them leaks the modal instance.
    this._closeTriggers.forEach((el) => {
      el.removeEventListener("click", this._onCloseTriggerClick);
    });
    this._closeTriggers = [];
    this._openTriggers.forEach((trigger) => {
      trigger.removeEventListener("click", this._onOpenTriggerClick);
    });
    this._openTriggers = [];
    this._unlockScroll();
  }

  _onCloseTriggerClick(event) {
    event.preventDefault();
    this.close();
  }

  _onOpenTriggerClick(event) {
    event.preventDefault();
    this._lastFocus = event.currentTarget;
    this.open();
  }

  attributeChangedCallback(name) {
    if (name !== "open" || !this._dialog) return;
    const shouldBeOpen = this.hasAttribute("open");
    if (shouldBeOpen && !this._dialog.open) {
      this._lockScroll();
      this._dialog.showModal();
      this.dispatchEvent(
        new CustomEvent(EVENT_OPEN, {
          bubbles: true,
          composed: true,
          detail: this,
        }),
      );
    } else if (!shouldBeOpen && this._dialog.open) {
      this._dialog.close();
    }
  }

  open() {
    this.setAttribute("open", "");
  }

  close() {
    this.removeAttribute("open");
  }

  toggle() {
    this.hasAttribute("open") ? this.close() : this.open();
  }

  _onDialogClose() {
    this._unlockScroll();
    this.removeAttribute("open");
    this.dispatchEvent(
      new CustomEvent(EVENT_CLOSE, {
        bubbles: true,
        composed: true,
        detail: this,
      }),
    );
    if (this._lastFocus) {
      this._lastFocus.focus();
      this._lastFocus = null;
    }
  }

  _onDialogClick(event) {
    // Native <dialog> bubbles backdrop clicks to itself, not to its
    // content; comparing the click coordinates against the dialog's
    // bounding rect identifies clicks on the backdrop only.
    if (event.target !== this._dialog) return;
    const r = this._dialog.getBoundingClientRect();
    const inside =
      event.clientX >= r.left &&
      event.clientX <= r.right &&
      event.clientY >= r.top &&
      event.clientY <= r.bottom;
    if (!inside) this.close();
  }

  _lockScroll() {
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty(
      "--fg-scrollbar-comp",
      `${sw}px`,
    );
    document.documentElement.style.overflow = "hidden";
    document.body.style.paddingRight = `${sw}px`;
  }

  _unlockScroll() {
    document.documentElement.style.overflow = "";
    document.body.style.paddingRight = "";
    document.documentElement.style.removeProperty("--fg-scrollbar-comp");
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, Modal);
}
