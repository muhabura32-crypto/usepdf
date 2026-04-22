/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://usepdf.xyz',
  generateRobotsTxt: true,
  outDir: './public',
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
    ],
  },
}