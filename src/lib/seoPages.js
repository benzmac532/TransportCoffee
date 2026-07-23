import { DEFAULT_DESCRIPTION } from './site';

/** Static route SEO copy. Paths should match the React Router URLs. */
export const STATIC_PAGES = [
  {
    path: '/',
    title: 'Transport Coffee | Coffee that moves you',
    description: DEFAULT_DESCRIPTION,
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    path: '/shop',
    title: 'Shop',
    description:
      'Shop specialty coffee from Transport Coffee Roasters — freshly roasted beans for every journey.',
    changefreq: 'daily',
    priority: '0.9',
  },
  {
    path: '/shop/collections/coffee',
    title: 'Coffee',
    description: 'Browse our specialty coffee collection — roasted with care in the Shoals.',
    changefreq: 'daily',
    priority: '0.8',
  },
  {
    path: '/shop/collections/merch',
    title: 'Merch',
    description: 'Transport Coffee Roasters merch and apparel.',
    changefreq: 'weekly',
    priority: '0.6',
  },
  {
    path: '/shop/collections/gift-cards',
    title: 'Gift Cards',
    description: 'Give the gift of thoughtful coffee with a Transport Coffee gift card.',
    changefreq: 'monthly',
    priority: '0.6',
  },
  {
    path: '/shop/collections/brew-gear',
    title: 'Brew Gear',
    description: 'Brew gear and accessories to bring café-quality coffee home.',
    changefreq: 'weekly',
    priority: '0.6',
  },
  {
    path: '/about',
    title: 'About',
    description:
      'Meet Transport Coffee Roasters — founded in the Shoals, crafting coffee that moves you.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/subscriptions',
    title: 'Subscriptions',
    description:
      'Subscribe and save on fresh Transport Coffee — delivered on your schedule with flat-rate shipping.',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/wholesale',
    title: 'Wholesale',
    description:
      'Wholesale coffee partnerships for cafés, restaurants, offices, and retailers. Partner with Transport Coffee Roasters.',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/contact',
    title: 'Contact',
    description:
      'Get in touch with Transport Coffee Roasters — questions, feedback, or just coffee talk.',
    changefreq: 'yearly',
    priority: '0.6',
  },
  {
    path: '/locations',
    title: 'Where to find us',
    description:
      'Find Transport Coffee at retail partners in the Shoals, including The Forge Coffeehouse in Muscle Shoals, AL.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/shipping-policy',
    title: 'Shipping Policy',
    description: 'Shipping rates, timelines, and details for Transport Coffee Roasters orders.',
    changefreq: 'yearly',
    priority: '0.3',
  },
  {
    path: '/refund-policy',
    title: 'Refund Policy',
    description: 'Refund and return policy for Transport Coffee Roasters.',
    changefreq: 'yearly',
    priority: '0.3',
  },
];

export function getStaticPageMeta(path) {
  const normalized = path === '' ? '/' : path;
  return STATIC_PAGES.find((page) => page.path === normalized) || null;
}
