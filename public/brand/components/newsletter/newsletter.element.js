/**
 * <fg-newsletter> — email signup with status messaging.
 *
 * Lit-based. Light DOM (form primitive styles cascade in).
 *
 * Attributes:
 *   - action    POST endpoint that receives `email` form-encoded.
 *   - method    HTTP method, defaults to "POST".
 *   - field     form-field name for the email, defaults to "email".
 *   - title     headline copy (default: "Subscribe to the newsletter.")
 *   - blurb     supporting copy below the headline.
 *
 * Events:
 *   - fg:newsletter-submit  detail = { email }
 *   - fg:newsletter-success
 *   - fg:newsletter-error   detail = { error }
 *
 * Anti-dark-pattern guarantees:
 *   - No modal on arrival; the element is inline.
 *   - Confirmation copy includes the explicit one-click unsubscribe.
 *   - No pre-checked extra opt-ins (cross-marketing, partner emails).
 *
 * The component owns the network call; the consuming page tells it
 * where to send the email. For local-only demos, omit `action` and the
 * form short-circuits to success after a fake 600 ms latency.
 */

import { LitElement, html } from "lit";

const TAG = "fg-newsletter";

class Newsletter extends LitElement {
  static properties = {
    action: { type: String },
    method: { type: String },
    field: { type: String },
    title: { type: String },
    blurb: { type: String },
    _state: { state: true },
    _error: { state: true },
  };

  constructor() {
    super();
    this.action = "";
    this.method = "POST";
    this.field = "email";
    this.title = "One quiet email per essay.";
    this.blurb =
      "No drip campaigns, no upsells. Unsubscribe in one click.";
    this._state = "idle"; // idle | submitting | success | error
    this._error = "";
  }

  createRenderRoot() {
    return this;
  }

  async _onSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const email = String(data.get(this.field) || "").trim();
    if (!email) {
      this._state = "error";
      this._error = "Enter an email address.";
      return;
    }

    this.dispatchEvent(
      new CustomEvent("fg:newsletter-submit", {
        bubbles: true,
        composed: true,
        detail: { email },
      }),
    );
    this._state = "submitting";
    this._error = "";

    try {
      if (this.action) {
        const res = await fetch(this.action, {
          method: this.method,
          headers: { Accept: "application/json" },
          body: data,
        });
        if (!res.ok) {
          throw new Error(
            `Subscribe failed (${res.status}). Try again in a minute.`,
          );
        }
      } else {
        // No endpoint configured — short-circuit for demos.
        await new Promise((r) => setTimeout(r, 600));
      }
      this._state = "success";
      this.dispatchEvent(
        new CustomEvent("fg:newsletter-success", {
          bubbles: true,
          composed: true,
        }),
      );
      // Plausible conversion event; harmless when the script isn't loaded.
      if (typeof window !== "undefined" && typeof window.plausible === "function") {
        window.plausible("Newsletter Subscribe");
      }
    } catch (err) {
      this._state = "error";
      this._error = err.message || "Something went wrong. Try again.";
      this.dispatchEvent(
        new CustomEvent("fg:newsletter-error", {
          bubbles: true,
          composed: true,
          detail: { error: this._error },
        }),
      );
    }
  }

  render() {
    if (this._state === "success") {
      return html`
        <div class="fg-newsletter fg-newsletter--success" role="status" aria-live="polite">
          <fg-icon name="check" data-size="lg" class="fg-newsletter__icon"></fg-icon>
          <h3 class="fg-newsletter__title">Subscribed.</h3>
          <p class="fg-newsletter__blurb">
            Check your inbox for a confirmation. Every email includes a
            single-click unsubscribe link in the footer — no forms, no
            "wait we'll miss you" detours.
          </p>
        </div>
      `;
    }

    return html`
      <div class="fg-newsletter">
        <div class="fg-newsletter__copy">
          <h3 class="fg-newsletter__title">${this.title}</h3>
          <p class="fg-newsletter__blurb">${this.blurb}</p>
        </div>
        <form
          class="fg-newsletter__form"
          @submit=${this._onSubmit}
          novalidate
        >
          <div class="form-field fg-newsletter__field ${this._state === "error" ? "form-field--error" : ""}">
            <label for="fg-newsletter-email" class="form-label visually-hidden">
              Email address
            </label>
            <input
              id="fg-newsletter-email"
              class="form-input"
              type="email"
              name="${this.field}"
              autocomplete="email"
              placeholder="you@domain.com"
              required
              ?aria-invalid=${this._state === "error"}
              aria-describedby="fg-newsletter-status"
              ?disabled=${this._state === "submitting"}
            />
            <button
              type="submit"
              class="btn btn--accent fg-newsletter__submit"
              ?disabled=${this._state === "submitting"}
            >
              ${this._state === "submitting" ? "Subscribing…" : "Subscribe"}
            </button>
          </div>
          <p
            id="fg-newsletter-status"
            class="${this._state === "error" ? "form-error" : "form-helper"}"
            role=${this._state === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            ${this._state === "error"
              ? this._error
              : "We won't share your email. One-click unsubscribe in every message."}
          </p>
        </form>
      </div>
    `;
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, Newsletter);
}
