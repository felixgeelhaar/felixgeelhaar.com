// @ts-check
import { defineConfig } from 'astro/config';

// felixgeelhaar.de — static brand site, self-hosted on k3s (see deploy/k3s/).
// Stack chosen per docs/launch-criteria.md: simple, fast, MDX-friendly,
// minimal client-side JS. Lit-html web components from the brand repo
// are loaded via ESM <script type="module"> when needed; no React/Vue.
//
// The site serves from the domain root. PUBLIC_SITE_URL overrides the
// canonical origin if ever needed (staging, preview); defaults to the
// production domain.
const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://felixgeelhaar.de';
export default defineConfig({
  site: SITE_URL,
  base: '/',
  // v1 IA cut the sitemap to three surfaces (brand docs/ia.md):
  // Home, Work, Writing. Old top-level routes redirect to their new
  // homes. Static output → Astro emits meta-refresh pages; the nginx
  // config (deploy/nginx.conf) adds real 301s for self-hosted deploys.
  redirects: {
    '/lab':   '/work', // lab folds into /work
    '/talks': '/work', // speaking lives as a /work section
    '/about': '/',     // narrative bio folds into home
    '/now':   '/',     // focus snapshot folds into home
    '/uses':  '/',     // dropped from v1; revisit on demand
  },
  build: { format: 'file' },
  prefetch: { defaultStrategy: 'viewport' },
});
