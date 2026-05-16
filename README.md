# felixgeelhaar.com

Astro static site. Brand tokens + components vendor-copied from the
sibling `brand` repo (no npm linkage; the brand stays a pure design
system).

## Local

```bash
npm install
npm run sync:brand   # copies ../brand/{tokens,type,grid,responsive}.css + components/ into public/brand/
npm run dev          # http://localhost:4321
npm run build        # static dist/
```

`sync:brand` is automatic on `dev` and `build`; run it manually after a
brand change if the dev server is already up.

`BRAND_ROOT` overrides the path if the brand repo lives elsewhere:

```bash
BRAND_ROOT=/path/to/brand npm run sync:brand
```

## Deploy

GitHub Actions builds + ships to GitHub Pages on every push to `main`.
See `.github/workflows/pages.yml`. The custom domain is wired via
`public/CNAME`; point `felixgeelhaar.com` A/AAAA records at GitHub
Pages IPs and the site lives there once DNS propagates.

## Structure

```
src/
  layouts/BaseLayout.astro     # head, nav, footer
  pages/
    index.astro                # /
    writing.astro              # /writing
    lab.astro                  # /lab
    talks.astro                # /talks
    work.astro                 # /work
    about.astro                # /about
    contact.astro              # /contact
public/
  site.css                     # site-local CSS (small; brand carries the weight)
  brand/                       # vendor-copied from ../brand (gitignored)
  CNAME                        # felixgeelhaar.com
scripts/
  sync-brand.mjs               # copy brand assets at build time
```

## Voice + IA

Follow `../brand/docs/voice.md` (sharp, specific, first-person
declarative, sentence-case headlines with periods) and
`../brand/docs/ia.md` for URL shapes. Launch checklist:
`../brand/docs/launch-criteria.md`.
