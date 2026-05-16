// @ts-check
import { defineConfig } from 'astro/config';

// felixgeelhaar.com — static brand site
// Stack chosen per docs/launch-criteria.md: simple, fast, MDX-friendly,
// minimal client-side JS. Lit-html web components from the brand repo
// are loaded via ESM <script type="module"> when needed; no React/Vue.
export default defineConfig({
  site: 'https://felixgeelhaar.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  prefetch: { defaultStrategy: 'viewport' },
});
