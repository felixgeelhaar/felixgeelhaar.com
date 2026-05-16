# Wordmark

Two marks, one identity.

## Canonical wordmark

```
FELIX GEELHAAR /
```

- **Type**: Geist Mono, weight 500, uppercase
- **Letter-spacing**: 0.04em (= `--ls-mono`)
- **Accent**: trailing slash in `--color-accent`
- **Format**: rendered as live text by default (matches body type); fallback as `wordmark.svg`

### Decision

The wordmark stays type-set, not custom-drawn. Rationale:

- The brand's voice is the writer; the typography is the writer's voice. A typeset wordmark in Geist Mono reads as "this person ships in plaintext" — which is the point.
- A custom logotype here would compete with the headlines instead of supporting them.
- Renders the same in HTML, SVG, slide titles, OG images, terminal `figlet` outputs.

If a custom logotype ever ships, it can replace `wordmark.svg` without changing any of the consumers — they reference the file or the inline pattern.

### Usage

In HTML the inline form is preferred (renders at body cadence):

```html
<a class="site-header__brand" href="/">
  FELIX GEELHAAR<span class="accent"> /</span>
</a>
```

In environments without Geist Mono (PDF exports, third-party email signatures, slide-deck title slides before fonts load), use `wordmark.svg`. `currentColor` picks up the parent text colour; `--wordmark-accent` defaults to `#0050F5` and can be overridden inline:

```html
<img src="/wordmark/wordmark.svg" alt="Felix Geelhaar" width="220" height="24">
```

### Clearspace

The wordmark needs at least one cap-height of clearspace on every side. Mono caps are roughly square at 14 px (= one `--fs-50` cap-height); in practice this means ≥ `--space-4` (12 px) of breathing room around the mark.

### What never happens to the wordmark

- Italicised, condensed, expanded, or stretched.
- Tilted, skewed, or rotated.
- Filled with a gradient.
- Used on a photographic background without a solid bg under it.
- "FELIX" alone or "GEELHAAR" alone — the full name only.

## Monogram

```
[ FG / ]
```

Used at sizes the wordmark can't survive: favicons, app icons, social profile pictures, GitHub avatar.

- **Format**: `monogram.svg` (64×64 viewBox, scales to 16×16 and 512×512)
- **Build**: ink-filled rounded rect, mono "FG" in white, accent slash bottom-right.
- **Minimum size**: 16×16 (favicon). Don't shrink further.

Generate raster variants at build time:

```bash
# Example using resvg-cli:
resvg wordmark/monogram.svg --width 32 -o static/favicon-32.png
resvg wordmark/monogram.svg --width 192 -o static/icon-192.png
resvg wordmark/monogram.svg --width 512 -o static/icon-512.png
```

A short Node script (`scripts/build-favicons.mjs`) can wrap this when raster outputs become routine. Not shipped in this task — the SVGs are the canonical sources.

## Files

```
wordmark/
├── wordmark.svg   220×24 horizontal mark for body-cadence use
├── monogram.svg   64×64 square mark for icons
└── README.md      this file
```

## Open questions (defer)

- Sticker / merch variant. Probably the monogram printed at 1×1 inch with the accent slash made physical.
- Animated wordmark for the home page hero (the slash draws on first paint). Earns its place only if Felix wants more "brand moment" than the rest of the system carries.
