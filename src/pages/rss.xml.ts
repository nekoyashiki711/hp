import type { APIRoute } from 'astro';
import { getPosts } from '../lib/blog';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getPosts()).filter((p) => !p.data.draft).slice(0, 30);
  const items = posts
    .map((p) => {
      const link = new URL(`/blog/${p.id}/`, site).href;
      return `    <item><title>${esc(p.data.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${p.data.date.toUTCString()}</pubDate><description>${esc(p.data.description)}</description></item>`;
    })
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>nekoyashiki コラム</title>
    <link>${new URL('/blog/', site).href}</link>
    <description>宮城の業務IT化・HP・集客のヒント</description>
    <language>ja</language>
${items}
  </channel>
</rss>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
