#!/usr/bin/env node
// Copies the brand repo's CSS + component assets into ./public/brand
// at build time. Idempotent. The brand repo is a sibling on disk
// (../brand/); change BRAND_ROOT if it moves.
//
// Why copy instead of import: the brand repo ships hand-rolled CSS +
// lit-html web components, not an npm package. Vendor-copying keeps
// the site deploy artifact self-contained and lets the brand evolve
// without a publish step.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT  = resolve(here, '..');
const BRAND_ROOT = process.env.BRAND_ROOT || resolve(SITE_ROOT, '..', 'brand');
const OUT        = join(SITE_ROOT, 'public', 'brand');

if (!existsSync(BRAND_ROOT)) {
  console.error(`sync-brand: brand repo not found at ${BRAND_ROOT}`);
  console.error('set BRAND_ROOT to override, e.g. BRAND_ROOT=/path/to/brand npm run sync:brand');
  process.exit(2);
}

const COPY = [
  'tokens.css',
  'type.css',
  'grid.css',
  'responsive.css',
  'components',
  'wordmark',
  'static',
];

// Fresh write each run so stale brand assets don't linger.
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

let bytes = 0;
for (const rel of COPY) {
  const src = join(BRAND_ROOT, rel);
  if (!existsSync(src)) continue;
  const dst = join(OUT, rel);
  cpSync(src, dst, { recursive: true });
  bytes += sizeOf(dst);
}
console.log(`sync-brand: copied ${bytes.toLocaleString()} bytes from ${BRAND_ROOT} → public/brand`);

function sizeOf(p) {
  const st = statSync(p);
  if (st.isFile()) return st.size;
  if (!st.isDirectory()) return 0;
  let total = 0;
  for (const entry of readdirSync(p)) total += sizeOf(join(p, entry));
  return total;
}
