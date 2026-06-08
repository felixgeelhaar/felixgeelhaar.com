#!/usr/bin/env node
/**
 * Generate OG images for every writing post.
 *
 * For each markdown file in src/content/writing/, parse the frontmatter
 * (title, date, kind, project, readingMins, draft), build a kicker
 * string, shell out to the brand's og.mjs CLI, and copy the resulting
 * PNGs into public/og/ so Astro serves them at /og/<slug>.{light,dark}.png.
 *
 * BaseLayout reads the slug-matched OG image at render time. The
 * fallback ("home") is still served from public/brand/dist/og/.
 *
 * Run:
 *   npm run og:writing
 *
 * Wired into `dev` and `build` so OG images stay in sync with content
 * without a separate step.
 */

import { readdir, readFile, copyFile, mkdir, access } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const exec = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot  = resolve(__dirname, '..');
// Brand repo auto-discovery — same candidate order as sync-brand.mjs:
// BRAND_ROOT env var, then ../brand (sibling), then
// ../../klarlabs/internal/brand. First existing wins.
const brandCandidates = [
  process.env.BRAND_ROOT && resolve(process.env.BRAND_ROOT),
  resolve(siteRoot, '../brand'),
  resolve(siteRoot, '../../klarlabs/internal/brand'),
].filter(Boolean);
const brandRoot = brandCandidates.find((p) => existsSync(p)) ?? brandCandidates[0];
const writingDir = resolve(siteRoot, 'src/content/writing');
const ogOutDir   = resolve(siteRoot, 'public/og');
const brandOgDir = resolve(brandRoot, 'dist/og');

/**
 * Tiny frontmatter parser. Handles the limited shape this collection
 * uses: scalar key: value pairs, optionally double-quoted. Returns null
 * if the file has no frontmatter block.
 *
 * @param {string} content
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const out = {};
  for (const line of match[1].split('\n')) {
    // Strip CR if file came from a Windows checkout.
    const clean = line.replace(/\r$/, '');
    const m = clean.match(/^(\w+):\s*"?(.*?)"?\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

/**
 * Build the kicker line that appears above the title on the OG image.
 * Project posts get the project name in caps; essays get "ESSAY".
 *
 * @param {Record<string, string>} fm
 */
function buildKicker(fm) {
  const date = new Date(fm.date).toISOString().slice(0, 10);
  const label = fm.kind === 'project' && fm.project
    ? fm.project.toUpperCase()
    : 'ESSAY';
  const mins = fm.readingMins ? ` · ${fm.readingMins} MIN` : '';
  return `${label} · ${date}${mins}`;
}

/**
 * Static landing/index pages get hand-curated kickers. Keep this list
 * short — only pages that are realistic share targets (homepage, the
 * indexes, Armada). The writing posts and one-off pages don't need
 * entries here.
 */
const STATIC_PAGES = [
  {
    slug: 'home',
    kicker: 'FIELD NOTES · 2026',
    title: 'Felix Geelhaar — shipping software, building agent tools.',
    footer: 'FELIXGEELHAAR.COM',
  },
  {
    slug: 'writing',
    kicker: 'WRITING · INDEX',
    title: 'Field notes on how teams ship software with AI agents.',
    footer: 'FELIXGEELHAAR.COM / WRITING',
  },
  {
    // v1 IA: /lab + /talks folded into /work (brand docs/ia.md).
    slug: 'work',
    kicker: 'WORK · INDEX',
    title: 'Open-source Go libraries + AI-agent tooling.',
    footer: 'FELIXGEELHAAR.COM / WORK',
  },
  {
    slug: 'armada',
    kicker: 'ARMADA · ATLASSIAN MARKETPLACE',
    title: 'Campaign orchestration for Jira. The defaults can’t.',
    footer: 'ARMADA.RUN · MARKETPLACE',
  },
  {
    slug: 'contact',
    kicker: 'CONTACT',
    title: 'Email, GitHub, LinkedIn. No web form.',
    footer: 'FELIXGEELHAAR.COM / CONTACT',
  },
];

async function brandHasOgScript() {
  try {
    await access(resolve(brandRoot, 'scripts/og.mjs'));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await brandHasOgScript())) {
    console.warn(`generate-og: brand og.mjs not found at ${brandRoot}/scripts/og.mjs — skipping.`);
    return;
  }

  await mkdir(ogOutDir, { recursive: true });
  const files = (await readdir(writingDir)).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

  let generated = 0;
  for (const file of files) {
    const slug = file.replace(/\.(md|mdx)$/, '');
    const content = await readFile(resolve(writingDir, file), 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm) {
      console.warn(`generate-og: ${file} has no frontmatter, skipped`);
      continue;
    }
    if (fm.draft === 'true') continue;
    if (!fm.title) {
      console.warn(`generate-og: ${file} missing title, skipped`);
      continue;
    }

    const kicker = buildKicker(fm);
    const footer = 'FELIXGEELHAAR.COM / WRITING';

    process.stdout.write(`OG: ${slug} ... `);
    await exec(
      'node',
      [
        'scripts/og.mjs',
        '--kicker', kicker,
        '--title', fm.title,
        '--slug', slug,
        '--footer', footer,
      ],
      { cwd: brandRoot },
    );

    for (const theme of ['light', 'dark']) {
      await copyFile(
        resolve(brandOgDir, `${slug}.${theme}.png`),
        resolve(ogOutDir, `${slug}.${theme}.png`),
      );
    }
    generated++;
    process.stdout.write('ok\n');
  }

  // Static pages — same template, hand-curated kicker/title.
  let staticGenerated = 0;
  for (const page of STATIC_PAGES) {
    process.stdout.write(`OG: ${page.slug} (static) ... `);
    await exec(
      'node',
      [
        'scripts/og.mjs',
        '--kicker', page.kicker,
        '--title', page.title,
        '--slug', page.slug,
        '--footer', page.footer,
      ],
      { cwd: brandRoot },
    );
    for (const theme of ['light', 'dark']) {
      await copyFile(
        resolve(brandOgDir, `${page.slug}.${theme}.png`),
        resolve(ogOutDir, `${page.slug}.${theme}.png`),
      );
    }
    staticGenerated++;
    process.stdout.write('ok\n');
  }

  console.log(`generate-og: ${generated} post(s) + ${staticGenerated} static page(s) → public/og/`);
}

main().catch((err) => {
  console.error('generate-og failed:', err);
  process.exit(1);
});
