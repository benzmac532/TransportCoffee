import { shopifyImageSrcSet, shopifyImageUrl } from '../lib/shopify';

/**
 * Product image that requests appropriately sized Shopify CDN variants.
 * Falls back to the original URL for non-Shopify hosts.
 */
export default function ShopifyImage({
  url,
  alt = '',
  widths = [240, 400, 640, 800, 1200, 1600],
  sizes = '100vw',
  width,
  className,
  style,
  loading = 'lazy',
  decoding = 'async',
  ...rest
}) {
  if (!url) return null;

  const fallbackWidth = width || widths[Math.min(3, widths.length - 1)] || 800;
  const src = shopifyImageUrl(url, fallbackWidth);
  const srcSet = shopifyImageSrcSet(url, widths);

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding={decoding}
      {...rest}
    />
  );
}
