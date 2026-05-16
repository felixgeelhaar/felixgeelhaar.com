/**
 * <fg-chart-line> — full time-series line chart with axes + grid.
 *
 * data is an array of { x, y } where x is a Date-parseable string or
 * number and y is a number. The element resizes to the host's width
 * and uses ResizeObserver to re-render on viewport changes.
 *
 * Attributes:
 *   - data         JSON array of { x, y }
 *   - height       chart height in px (default 240)
 *   - x-label      x-axis label
 *   - y-label      y-axis label
 *   - area         "true" to fill below the line
 */

import { LitElement, html, svg } from "lit";
import * as d3 from "https://esm.sh/d3@7";

const TAG = "fg-chart-line";

class LineChart extends LitElement {
  static properties = {
    data: { type: Array },
    height: { type: Number },
    xLabel: { type: String, attribute: "x-label" },
    yLabel: { type: String, attribute: "y-label" },
    area: { type: Boolean },
    _width: { state: true },
  };

  constructor() {
    super();
    this.data = [];
    this.height = 240;
    this.xLabel = "";
    this.yLabel = "";
    this.area = false;
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

  _parseX(x) {
    if (x instanceof Date) return x;
    const t = typeof x === "string" ? Date.parse(x) : x;
    return Number.isFinite(t) ? new Date(t) : x;
  }

  render() {
    const raw = Array.isArray(this.data) ? this.data : [];
    if (raw.length < 2) return null;

    const data = raw.map((d) => ({ x: this._parseX(d.x), y: +d.y }));
    const isTime = data[0].x instanceof Date;

    const w = this._width;
    const h = this.height;
    const m = { top: 16, right: 16, bottom: 32, left: 40 };
    const iw = w - m.left - m.right;
    const ih = h - m.top - m.bottom;

    const x = (isTime ? d3.scaleTime() : d3.scaleLinear())
      .domain(d3.extent(data, (d) => d.x))
      .range([0, iw]);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) * 1.05])
      .nice()
      .range([ih, 0]);

    const line = d3
      .line()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
      .curve(d3.curveMonotoneX);

    const areaShape = d3
      .area()
      .x((d) => x(d.x))
      .y0(ih)
      .y1((d) => y(d.y))
      .curve(d3.curveMonotoneX);

    const xTicks = x.ticks(Math.min(8, Math.max(2, Math.floor(iw / 80))));
    const yTicks = y.ticks(5);
    const xFmt = isTime
      ? d3.timeFormat("%b %y")
      : d3.format("~s");
    const yFmt = d3.format("~s");

    return html`
      <svg
        class="fg-chart"
        viewBox=${`0 0 ${w} ${h}`}
        role="img"
        aria-label=${`Line chart${this.yLabel ? ` of ${this.yLabel}` : ""}`}
      >
        <g transform=${`translate(${m.left},${m.top})`}>
          <!-- Grid -->
          <g class="fg-chart__grid">
            ${yTicks.map(
              (t) => svg`<line x1="0" x2=${iw} y1=${y(t)} y2=${y(t)}></line>`,
            )}
          </g>

          ${this.area
            ? svg`<path class="fg-chart__area" d=${areaShape(data)}></path>`
            : null}
          <path class="fg-chart__line" d=${line(data)}></path>

          ${data.map(
            (d) => svg`<circle
              class="fg-chart__point"
              cx=${x(d.x)}
              cy=${y(d.y)}
            ></circle>`,
          )}

          <!-- X axis -->
          <g class="fg-chart__axis" transform=${`translate(0,${ih})`}>
            <line x1="0" x2=${iw} y1="0" y2="0"></line>
            ${xTicks.map(
              (t) => svg`<g transform=${`translate(${x(t)},0)`}>
                <line y1="0" y2="6"></line>
                <text y="20" text-anchor="middle">${xFmt(t)}</text>
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
            ? svg`<text class="fg-chart__label" x=${iw / 2} y=${ih + 28} text-anchor="middle">${this.xLabel}</text>`
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
  customElements.define(TAG, LineChart);
}
