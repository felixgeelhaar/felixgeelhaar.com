# Chart components

> **Deferred to v1.1+**: `<fg-chart-line>` and `<fg-chart-bar>` ship in
> the system but are NOT on the v1.0 launch checklist (see
> `docs/launch-criteria.md`). `<fg-chart-sparkline>` may ship in v1.0
> for project cards showing commit/star trends. The other two stay
> available the moment a real page asks for them — code earned its
> place; the launch budget doesn't.

D3-powered Lit web components. Light DOM so tokens cascade into the SVG (the chart styles reference `--color-accent`, `--color-fg`, `--color-line` etc.). D3 loaded from the ESM CDN via the page-level importmap.

## Imports

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3" } }
</script>
<link rel="stylesheet" href="/components/chart/chart.css">
<script type="module" src="/components/chart/sparkline.element.js"></script>
<script type="module" src="/components/chart/line.element.js"></script>
<script type="module" src="/components/chart/bar.element.js"></script>
```

D3 imports itself: each chart element does `import * as d3 from 'https://esm.sh/d3@7'`. One copy is cached after the first chart on the page loads.

## `<fg-chart-sparkline>`

```html
<fg-chart-sparkline data="[12, 18, 17, 22, 30, 28, 35]" area></fg-chart-sparkline>
```

Inline trend line. 96 × 28 px by default; meant to live next to a number ("23 stars ⎯ ⁘⁘⁘").

| Attribute | Default | Notes |
|---|---|---|
| `data` | `[]` | JSON array of numbers. Min 2 points. |
| `area` | `false` | Fill below the line at 8% accent opacity. |
| `last` | `true` | Marker dot on the most recent point. |

## `<fg-chart-line>`

```html
<fg-chart-line
  height="240"
  x-label="Month"
  y-label="Commits"
  area
  data='[
    {"x": "2024-01", "y": 12},
    {"x": "2024-02", "y": 18},
    {"x": "2024-03", "y": 24}
  ]'
></fg-chart-line>
```

| Attribute | Default | Notes |
|---|---|---|
| `data` | `[]` | JSON array of `{ x, y }`. x parses as Date or number. |
| `height` | `240` | Chart height in px. Width follows the host. |
| `x-label` | `""` | Axis title. |
| `y-label` | `""` | Axis title. |
| `area` | `false` | Fill below the line. |

Resizes on viewport change via `ResizeObserver`.

## `<fg-chart-bar>`

```html
<fg-chart-bar
  height="240"
  y-label="Talks"
  data='[
    {"label": "2023", "value": 3},
    {"label": "2024", "value": 5},
    {"label": "2025", "value": 4},
    {"label": "2026", "value": 2}
  ]'
></fg-chart-bar>
```

| Attribute | Default | Notes |
|---|---|---|
| `data` | `[]` | JSON array of `{ label, value }`. |
| `height` | `240` | Chart height. |
| `x-label` | `""` | Axis title. |
| `y-label` | `""` | Axis title. |

## Accessibility

- Every chart renders with `role="img"` and a contextual `aria-label`.
- Charts use `currentColor` and token-driven colours so dark mode + forced-colors + reduced-motion all flow in without component-level branches.
- For dense data, consider a `<details>` companion with the underlying table — the chart visualises, the table speaks.

## What's NOT shipped in v1

- Tooltips on hover (CSS hook `.fg-chart__tooltip` is in `chart.css`; wiring lands when the first chart needs it).
- Stacked bars / multi-series lines.
- `<fg-chart-network>` (concept maps, on-brand for System Diagram) — sketched in the task description; ships when the first content needs it.
- Live data via WebSocket / SSE.

## Performance

D3 v7 minified-and-gzipped is ~50 KB; via esm.sh's smart bundler the actual transfer for a page using only `scaleLinear`, `line`, `area`, `extent` is closer to ~20 KB. Charts opt in per page — they're not in the global stylesheet, and pages without them pay nothing.

For lighthouse perf budget compliance (see `docs/quality.md`), pages with multiple charts should consider importing only the d3 modules they need (`d3-scale`, `d3-shape`, `d3-array`) rather than the full bundle.
