// @ts-check
import { defineConfig } from 'astro/config';

// felixgeelhaar.com — static brand site
// Stack chosen per docs/launch-criteria.md: simple, fast, MDX-friendly,
// minimal client-side JS. Lit-html web components from the brand repo
// are loaded via ESM <script type="module"> when needed; no React/Vue.
// Base + site URL diverge while DNS for felixgeelhaar.com is unset:
//   - GH Pages serves the project at https://<user>.github.io/<repo>/
//   - Once the custom domain lands, both flip to https://felixgeelhaar.com/
// Toggle via env so the same workflow can ship to either target.
const USE_CUSTOM_DOMAIN = process.env.PUBLIC_USE_CUSTOM_DOMAIN === '1';
// PUBLIC_SITE_URL overrides the canonical origin for self-hosted deploys
// (k3s serves the site at https://felixgeelhaar.de — see deploy/k3s/).
const SITE_URL =
  process.env.PUBLIC_SITE_URL ||
  (USE_CUSTOM_DOMAIN ? 'https://felixgeelhaar.com' : 'https://felixgeelhaar.github.io/felixgeelhaar.com');
export default defineConfig({
  site: SITE_URL,
  base: USE_CUSTOM_DOMAIN ? '/' : '/felixgeelhaar.com/',
  // v1 IA cut the sitemap to three surfaces (brand docs/ia.md):
  // Home, Work, Writing. Old top-level routes redirect to their new
  // homes. Static output → Astro emits meta-refresh pages; the nginx
  // config (deploy/nginx.conf) adds real 301s for self-hosted deploys.
  // Destinations carry the base prefix explicitly — Astro passes
  // redirect values through verbatim.
  redirects: {
    '/lab':   USE_CUSTOM_DOMAIN ? '/work' : '/felixgeelhaar.com/work', // lab folds into /work
    '/talks': USE_CUSTOM_DOMAIN ? '/work' : '/felixgeelhaar.com/work', // speaking lives as a /work section
    '/about': USE_CUSTOM_DOMAIN ? '/'     : '/felixgeelhaar.com/',     // narrative bio folds into home
    '/now':   USE_CUSTOM_DOMAIN ? '/'     : '/felixgeelhaar.com/',     // focus snapshot folds into home
    '/uses':  USE_CUSTOM_DOMAIN ? '/'     : '/felixgeelhaar.com/',     // dropped from v1; revisit on demand
  },
  // trailingSlash default 'ignore' keeps BASE_URL as '/felixgeelhaar.com/'
  // so `${BASE}brand/tokens.css` joins correctly. 'never' strips the
  // trailing slash from BASE_URL and breaks asset hrefs.
  build: { format: 'file' },
  prefetch: { defaultStrategy: 'viewport' },
});
