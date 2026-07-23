import { useEffect } from 'react';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_TITLE,
  SITE_NAME,
  absoluteUrl,
  formatTitle,
  plainText,
} from '../lib/site';

function upsertMeta(attribute, key, content) {
  if (content == null || content === '') return;
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * Updates document title + description + Open Graph / Twitter tags for the current route.
 * Social crawlers that do not execute JS still see index.html defaults for cold shares;
 * Google and in-app browsers that run JS pick up these per-route tags.
 */
export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image,
  imageAlt = DEFAULT_OG_IMAGE_ALT,
  type = 'website',
  noindex = false,
}) {
  useEffect(() => {
    const fullTitle = formatTitle(title) || DEFAULT_TITLE;
    const desc = plainText(description || DEFAULT_DESCRIPTION);
    const url = absoluteUrl(path);
    const ogImage = image ? absoluteUrl(image) : DEFAULT_OG_IMAGE;

    document.title = fullTitle;

    upsertMeta('name', 'description', desc);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    upsertLink('canonical', url);

    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:image:alt', imageAlt);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', ogImage);
    upsertMeta('name', 'twitter:image:alt', imageAlt);
  }, [title, description, path, image, imageAlt, type, noindex]);

  return null;
}
