# felixgeelhaar.com

Astro static site. Brand tokens + components vendor-copied from the
`brand` repo (no npm linkage; the brand stays a pure design system).

## Local

```bash
npm install
npm run sync:brand   # copies the brand repo's {tokens,type,grid,responsive}.css + components/ + wordmark/ + static/ + dist/og into public/brand/
npm run dev          # http://localhost:4321
npm run build        # static dist/
```

`sync:brand` is automatic on `dev` and `build`; run it manually after a
brand change if the dev server is already up.

The brand repo is auto-discovered — first existing path wins:

1. `$BRAND_ROOT` (env var override)
2. `../brand` (sibling of this repo)
3. `../../klarlabs/internal/brand` (site in `~/Developer/projects/`,
   brand in `~/Developer/klarlabs/internal/`)

```bash
BRAND_ROOT=/path/to/brand npm run sync:brand
```

## Deploy

Self-hosted on the shared k3s cluster — **felixgeelhaar.de** (Traefik
ingress, cert-manager TLS). See `deploy/k3s/site.yaml`.

Ship a new version:

```bash
npm run build                                   # static dist/ (root base)
docker build --platform linux/amd64 \
  -t ghcr.io/felixgeelhaar/felixgeelhaar-com:vX.Y.Z .
docker push ghcr.io/felixgeelhaar/felixgeelhaar-com:vX.Y.Z
# bump the image tag in deploy/k3s/site.yaml, then:
kubectl apply -f deploy/k3s/site.yaml
kubectl -n website rollout status deployment/site
```

`npm run build` targets the domain root by default; set `PUBLIC_SITE_URL`
to override the canonical origin for a staging/preview build.

## Structure

```
src/
  layouts/BaseLayout.astro     # head, nav, footer
  data/projects.ts             # project shelf shared by / and /work
  pages/
    index.astro                # / (absorbs the old /about + /now)
    work.astro                 # /work (absorbs the old /lab + /talks)
    writing.astro              # /writing
    armada.astro               # /armada (product intro; canonical: armada.run)
    contact.astro              # /contact (footer-linked)
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
