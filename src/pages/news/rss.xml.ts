// RSS 2.0 feed for /news
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import site from '../../data/site.json';

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(context: APIContext) {
  const baseUrl = (context.site ?? new URL(`https://${site.domain.primary}`)).toString().replace(/\/$/, '');
  const posts = (await getCollection('news', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, 50);

  const items = posts.map((post) => `
    <item>
      <title>${escape(post.data.title)}</title>
      <link>${baseUrl}/news/${post.slug}/</link>
      <guid isPermaLink="true">${baseUrl}/news/${post.slug}/</guid>
      <pubDate>${new Date(post.data.date).toUTCString()}</pubDate>
      <description>${escape(post.data.excerpt)}</description>
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)} — News</title>
    <link>${baseUrl}/news/</link>
    <atom:link href="${baseUrl}/news/rss.xml" rel="self" type="application/rss+xml" />
    <description>News and announcements from the ${escape(site.name)}.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
    },
  });
}
