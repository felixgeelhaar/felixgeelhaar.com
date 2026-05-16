# Long-form reading helpers

> **Deferred to v1.1+**: ships in the system, NOT on the v1.0 launch
> checklist (see `docs/launch-criteria.md`). Reading furniture is built
> for essays > 1500 words; until those essays exist, leave it off the
> live site. The .post-nav prev/next pattern is cheap to keep enabled.

Three reading-experience primitives that ship together: table of contents, reading progress bar, prev/next post nav.

## `<fg-toc target="…">`

Auto-builds a table of contents from a target container's `h2` (and optionally `h3`) headings. Headings must have `id`s (slugified server-side at content build).

```html
<aside class="post-rail">
  <fg-toc target="#article-body" depth="3"></fg-toc>
</aside>

<article id="article-body" class="type-body-prose">
  <h2 id="why-platforms-rot">Why platforms rot</h2>
  …
</article>
```

| Attribute | Default | Notes |
|---|---|---|
| `target` | `""` | Required CSS selector. |
| `depth` | `2` | `2` for h2 only, `3` for h2 + h3. |
| `title` | `"On this page"` | Mono kicker above the list. |

Active heading is detected via `IntersectionObserver` with `rootMargin: "-30% 0px -60% 0px"` (the heading "passes" the upper third of the viewport). `aria-current="true"` reflects this for screen readers.

Events:

| Event | Detail | Notes |
|---|---|---|
| `fg:toc-built` | `{ count }` | bubbles + composed |
| `fg:toc-active` | `{ id }` | fires when the active heading changes |

## `<fg-reading-progress target="…">`

Fixed thin bar at the top of the viewport that fills as the reader scrolls through the target element.

```html
<fg-reading-progress target="#article-body" position="top"></fg-reading-progress>
```

| Attribute | Default | Notes |
|---|---|---|
| `target` | `""` | Required CSS selector. |
| `position` | `"top"` | Or `"bottom"`. |

The bar fills the accent colour, sits at `z-index: var(--z-sticky)`, and updates on every scroll/resize via `requestAnimationFrame`. Includes `role="progressbar"` + `aria-valuenow/min/max` for assistive tech.

## Prev/next post nav

Pure CSS pattern, no JS. Apply `.post-nav` to a container, two `.post-nav__link` anchors inside.

```html
<nav class="post-nav" aria-label="Article navigation">
  <a class="post-nav__link post-nav__link--prev" href="/writing/$prev-slug">
    <span class="post-nav__kicker">
      <fg-icon name="arrow-left" data-size="xs"></fg-icon>
      Previous
    </span>
    <span class="post-nav__title">Previous post title</span>
  </a>
  <a class="post-nav__link post-nav__link--next" href="/writing/$next-slug">
    <span class="post-nav__kicker">
      Next
      <fg-icon name="arrow-right" data-size="xs"></fg-icon>
    </span>
    <span class="post-nav__title">Next post title</span>
  </a>
</nav>
```

Collapses to a single column under 640 px.

## Reading-time

Compute at content build (a 200-word-per-minute heuristic; published in the kicker as `· 12 MIN`). No runtime component required.

## Out of scope

- The actual long-form post page is documented in `docs/page-templates.md` under `/writing/$slug`.
- Inline callouts / asides / pull quotes — `task-component-primitives-expansion` lists these as planned; they arrive with the first essay that needs them, not before.
