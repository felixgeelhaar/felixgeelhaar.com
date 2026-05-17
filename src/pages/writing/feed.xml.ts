import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const entries = await getCollection('writing', ({ data }) => !data.draft);
  entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  // BASE_URL ends with a trailing slash; include it in item links so the
  // RSS reader resolves the correct project-pages path under
  // felixgeelhaar.github.io/felixgeelhaar.com/... as well as the
  // future custom-domain root.
  const BASE = import.meta.env.BASE_URL;

  return rss({
    title: 'Felix Geelhaar — Writing',
    description:
      'Field notes on how teams ship software — operating models, product trade-offs, engineering practices, and the tools that make pairing with AI agents feel less like a sword fight.',
    site: context.site!,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      link: `${BASE}writing/${entry.id}`,
    })),
    customData: '<language>en</language>',
  });
}
