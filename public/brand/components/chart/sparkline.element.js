/**
 * <fg-chart-sparkline data="[12, 18, 17, 22, 30, 28, 35]">
 *
 * Inline trend line. No axes, no labels — meant to live next to a
 * headline number ("23 stars this week ⎯ ⁘⁘⁘"). Lit-based, light DOM.
 *
 * Attributes:
 *   - data    JSON array of numbers
 *   - area    "true" to fill below the line
 *   - last    "true" (default) to mark the last point
 */

import { LitElement, html, svg } from "lit";
import * as d3 from "https://esm.sh/d3@7";

const TAG = "fg-chart-sparkline";

class Sparkline extends LitElement {
  static properties = {
    data: { type: Array },
    area: { type: Boolean },
    last: { type: Boolean },
  };

  constructor() {
    super();
    this.data = [];
    this.area = false;
    this.last = true;
  }

  createRenderRoot() {
    return this;
  }

  render() {
    const data = Array.isArray(this.data) ? this.data : [];
    if (data.length < 2) return null;

    const w = 96;
    const h = 28;
    const pad = 2;
    const x = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([pad, w - pad]);
    const y = d3
      .scaleLinear()
      .domain(d3.extent(data))
      .range([h - pad, pad]);

    const line = d3
      .line()
      .x((_, i) => x(i))
      .y((d) => y(d))
      .curve(d3.curveMonotoneX);

    const area = d3
      .area()
      .x((_, i) => x(i))
      .y0(h - pad)
      .y1((d) => y(d))
      .curve(d3.curveMonotoneX);

    const lastIdx = data.length - 1;

    return html`
      <svg
        class="fg-chart"
        viewBox=${`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Trend sparkline"
      >
        ${this.area
          ? svg`<path class="fg-chart__area" d=${area(data)}></path>`
          : null}
        <path class="fg-chart__line" d=${line(data)}></path>
        ${this.last
          ? svg`<circle
              class="fg-chart__point fg-chart__point--last"
              cx=${x(lastIdx)}
              cy=${y(data[lastIdx])}
            ></circle>`
          : null}
      </svg>
    `;
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, Sparkline);
}
