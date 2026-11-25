import { site } from '#lib/config.js';

export const prerender = true;

export function GET() {
	const lastmod = new Date().toISOString().slice(0, 10);
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site.url}/</loc><lastmod>${lastmod}</lastmod></url>
</urlset>
`;
	return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
