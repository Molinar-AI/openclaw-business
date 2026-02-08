/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://business.molinar.ai',
  generateRobotsTxt: true,
  exclude: [
    '/twitter-image.*',
    '/opengraph-image.*',
    '/icon.*',
    '/dashboard/*',
    '/api/*',
    '/authenticate',
  ],
  additionalPaths: async () => [
    { loc: '/', changefreq: 'weekly', priority: 1.0, lastmod: new Date().toISOString() },
  ],
};
