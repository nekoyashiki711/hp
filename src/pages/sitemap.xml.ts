import type { APIRoute } from 'astro';
import { getPosts, isoDate, seriesOf } from '../lib/blog';
import { SERIES, CATEGORIES, type SeriesKey } from '../config/blog';
// 採用情報（/recruit/）とフォームの完了ページは載せない
const pages = ['/', '/business/', '/personal/', '/services/', '/works/', '/about/', '/blog/', '/contact/', '/privacy/'];
export const GET: APIRoute = async ({ site }) => {
  const posts = (await getPosts()).filter((p) => !p.data.draft);
  // 記事のある系統・カテゴリの一覧ページだけ載せる
  const seriesPages = (Object.keys(SERIES) as SeriesKey[]).filter((k) => posts.some((p) => seriesOf(p) === k)).map((k) => SERIES[k].path);
  const catPages = CATEGORIES.filter((c) => posts.some((p) => p.data.category === c.name)).map((c) => `/blog/category/${c.slug}/`);
  const urls = [
    ...[...pages, ...seriesPages, ...catPages].map((p) => `  <url><loc>${new URL(p, site)}</loc></url>`),
    ...posts.map((p) => `  <url><loc>${new URL(`/blog/${p.id}/`, site)}</loc><lastmod>${isoDate(p.data.updated ?? p.data.date)}</lastmod></url>`),
  ].join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
