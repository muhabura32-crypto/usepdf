export async function GET() {
  const baseUrl = 'https://usepdf.xyz'

  const routes = [
    '',
    '/merge-pdf',
    '/split-pdf',
    '/compress-pdf',
    '/pdf-to-jpg',
    '/pdf-to-png',
    '/rotate-pdf',
    '/blog',
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
  ${routes
    .map((route) => {
      const priority = route === '' ? '1.0' : route === '/blog' ? '0.8' : '0.9'
      const changefreq = route === '/blog' ? 'weekly' : 'monthly'
      return `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    })
    .join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
