import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '*',
      disallow: '/admin',
    },
    sitemap: 'https://yakustay.online/sitemap.xml',
  };
}