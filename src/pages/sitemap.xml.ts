import type { APIRoute } from 'astro';
// 採用情報（/recruit/）は非公開のため載せない
const pages = ['/', '/business/', '/personal/', '/services/', '/works/', '/about/', '/contact/', '/privacy/'];
export const GET: APIRoute = ({ site }) => {
  const urls = pages.map((p) => `  <url><loc>${new URL(p, site)}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
