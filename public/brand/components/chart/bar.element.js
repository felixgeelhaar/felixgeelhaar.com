/**
 * <fg-chart-bar> — vertical bar chart for categorical data.
 *
 * data is an array of { label, value }. Bars are equal-width with
 * configurable padding. Y-axis labelled, X-axis shows category labels.
 *
 * Attributes:
 *   - data       JSON array of { label, value }
 *   - height     chart height (default 240)
 *   - x-label    optional x-axis title
 *   - y-label    optional y-axis title
 */

import { LitElement, html, svg } from "lit";
import * as d3 from "https://esm.sh/d3@7";

const TAG = "fg-chart-bar";

class BarChart extends LitElement {
  static properties = {
    data: { type: Array },
    height: { type: Number },
    xLabel: { type: String, attribute: "x-label" },
    yLabel: { type: String, attribute: "y-label" },
    _width: { state: true },
  };

  constructor() {
    super();
    this.data = [];
    this.height = 240;
    this.xLabel = "";
    this.yLabel = "";
    this._width = 640;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this._observer = new ResizeObserver((entries) => {
      for (const e of entries) this._width = Math.round(e.contentRect.width);
    });
    this._observer.observe(this);
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    super.disconnectedCallback();
  }

  render() {
    const data = Array.isArray(this.data) ? this.data : [];
    if (data.length === 0) return null;

    const w = this._width;
    const h = this.height;
    const m = { top: 16, right: 16, bottom: 40, left: 40 };
    const iw = w - m.left - m.right;
    const ih = h - m.top - m.bottom;

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, iw])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.value) * 1.1])
      .nice()
      .range([ih, 0]);

    const yTicks = y.ticks(5);
    const yFmt = d3.format("~s");

    return html`
      <svg
        class="fg-chart"
        viewBox=${`0 0 ${w} ${h}`}
        role="img"
        aria-label=${`Bar chart${this.yLabel ? ` of ${this.yLabel}` : ""}`}
      >
        <g transform=${`translate(${m.left},${m.top})`}>
          <!-- Grid -->
          <g class="fg-chart__grid">
            ${yTicks.map(
              (t) => svg`<line x1="0" x2=${iw} y1=${y(t)} y2=${y(t)}></line>`,
            )}
          </g>

          ${data.map(
            (d) => svg`<rect
              class="fg-chart__bar"
              x=${x(d.label)}
              y=${y(+d.value)}
              width=${x.bandwidth()}
              height=${ih - y(+d.value)}
            ></rect>`,
          )}

          <!-- X axis -->
          <g class="fg-chart__axis" transform=${`translate(0,${ih})`}>
            <line x1="0" x2=${iw} y1="0" y2="0"></line>
            ${data.map(
              (d) => svg`<g transform=${`translate(${x(d.label) + x.bandwidth() / 2},0)`}>
                <text y="20" text-anchor="middle">${d.label}</text>
              </g>`,
            )}
          </g>

          <!-- Y axis -->
          <g class="fg-chart__axis">
            <line x1="0" x2="0" y1="0" y2=${ih}></line>
            ${yTicks.map(
              (t) => svg`<g transform=${`translate(0,${y(t)})`}>
                <line x1="-6" x2="0"></line>
                <text x="-10" y="3" text-anchor="end">${yFmt(t)}</text>
              </g>`,
            )}
          </g>

          ${this.xLabel
            ? svg`<text class="fg-chart__label" x=${iw / 2} y=${ih + 36} text-anchor="middle">${this.xLabel}</text>`
            : null}
          ${this.yLabel
            ? svg`<text class="fg-chart__label" x=${-ih / 2} y="-30" transform="rotate(-90)" text-anchor="middle">${this.yLabel}</text>`
            : null}
        </g>
      </svg>
    `;
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, BarChart);
}
