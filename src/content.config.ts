// Astro content collections.
//
// One collection so far: `writing` — long-form essays under
// src/content/writing/<slug>.md (or .mdx). Astro generates the typed
// `getCollection('writing')` API used by /writing.astro and the dynamic
// /writing/[slug].astro route.
//
// Frontmatter schema is intentionally small. Add fields here as the
// shape of an essay stabilises (tags, hero image, draft flag, etc.).

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    // Estimated reading minutes. Optional; falls back to a word-count
    // derivation at render time when missing.
    readingMins: z.number().int().positive().optional(),
    // Hide-from-index flag for drafts you still want previewable by
    // direct URL. Excluded from the listing + RSS once those land.
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing };
