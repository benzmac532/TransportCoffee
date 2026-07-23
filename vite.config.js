import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_SITE_URL = 'https://transport-coffee.vercel.app';

const SITEMAP_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/shop', changefreq: 'daily', priority: '0.9' },
  { path: '/shop/collections/coffee', changefreq: 'daily', priority: '0.8' },
  { path: '/shop/collections/merch', changefreq: 'weekly', priority: '0.6' },
  { path: '/shop/collections/gift-cards', changefreq: 'monthly', priority: '0.6' },
  { path: '/shop/collections/brew-gear', changefreq: 'weekly', priority: '0.6' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/subscriptions', changefreq: 'monthly', priority: '0.8' },
  { path: '/wholesale', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'yearly', priority: '0.6' },
  { path: '/locations', changefreq: 'monthly', priority: '0.7' },
  { path: '/shipping-policy', changefreq: 'yearly', priority: '0.3' },
  { path: '/refund-policy', changefreq: 'yearly', priority: '0.3' },
];

function buildRobotsTxt(siteUrl) {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n');
}

function buildSitemapXml(siteUrl) {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = SITEMAP_ROUTES.map(({ path: routePath, changefreq, priority }) => {
    const loc = routePath === '/' ? `${siteUrl}/` : `${siteUrl}${routePath}`;
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n');
  }).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');
}

function seoStaticFilesPlugin(siteUrl) {
  const writeFiles = (outDir) => {
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'robots.txt'), buildRobotsTxt(siteUrl));
    fs.writeFileSync(path.join(outDir, 'sitemap.xml'), buildSitemapXml(siteUrl));
  };

  return {
    name: 'seo-static-files',
    buildStart() {
      // Keep public/ in sync for local preview + GitHub visibility
      writeFiles(path.resolve(process.cwd(), 'public'));
    },
    closeBundle() {
      writeFiles(path.resolve(process.cwd(), 'dist'));
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');

  return {
    plugins: [
      react(),
      {
        name: 'html-site-url',
        transformIndexHtml(html) {
          return html.replaceAll('%SITE_URL%', siteUrl);
        },
      },
      seoStaticFilesPlugin(siteUrl),
    ],
  };
});
