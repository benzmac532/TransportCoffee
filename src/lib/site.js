/** Canonical public site origin (no trailing slash). */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://transport-coffee.vercel.app'
).replace(/\/$/, '');

export const SITE_NAME = 'Transport Coffee Roasters';
export const DEFAULT_TITLE = 'Transport Coffee | Coffee that moves you';
export const DEFAULT_DESCRIPTION =
  'Thoughtful coffee for every journey. Specialty coffee roasted with care by Transport Coffee Roasters.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const DEFAULT_OG_IMAGE_ALT = 'Transport Coffee Roasters — Coffee that moves you.';

/** Build an absolute URL from a path (`/` or `/about`). */
export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized === '/' ? '/' : normalized}`;
}

/** Browser / OG title helper. */
export function formatTitle(pageTitle) {
  if (!pageTitle) return DEFAULT_TITLE;
  if (pageTitle.includes('|')) return pageTitle;
  return `${pageTitle} | Transport Coffee`;
}

/** Collapse HTML / whitespace for meta descriptions. */
export function plainText(value, maxLength = 160) {
  const text = String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}
