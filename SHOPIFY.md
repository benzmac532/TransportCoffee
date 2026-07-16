# Shopify headless setup

This React site browses Shopify products on-domain and uses Shopify Checkout for payment.

## 1. Create a Storefront API token

1. Open Shopify Admin for Transport Coffee Roasters.
2. **Settings → Apps and sales channels → Develop apps → Create an app**.
3. Name it e.g. `Transport Coffee Web`.
4. **Configure Storefront API scopes** (at minimum):
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts` / cart write scopes shown in Admin for Cart API
5. **Install app** and copy the **Storefront API access token**.
6. Note your shop hostname: `something.myshopify.com` (not the custom domain).

## 2. Local env

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in:

```
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=shpat_or_storefront_token_here
VITE_SHOPIFY_PUBLIC_URL=https://transportcoffeeroasters.com
```

Restart `npm run dev` after changing env vars.

### Behavior without a token

- Product listing / product detail / home featured cards still load via the public storefront JSON API (`/products.json`).
- Add to cart / checkout require the Storefront token.

## 3. Collections for Shop nav

Create (or rename) collections in Shopify Admin so these handles exist:

- `coffee`
- `merch`
- `gift-cards`
- `brew-gear`

If a handle is missing, the shop page falls back to all products.

## 4. Cart + checkout

- Cart ID is stored in `localStorage` (`tcr_shopify_cart_id`).
- Checkout redirects to Shopify’s hosted `checkoutUrl` (PCI-compliant).

## 5. Domain cutover (host this site on transportcoffeeroasters.com)

Goal: this Vite app becomes the public site; Shopify remains the commerce backend.

### Hosting

Deploy `dist` to one of:

- **Vercel** / **Netlify** / **Cloudflare Pages**
  - Build: `npm run build`
  - Output: `dist`
  - Add the same `VITE_SHOPIFY_*` env vars in the host dashboard

### DNS

1. In your domain registrar (or wherever `transportcoffeeroasters.com` DNS lives), point:
   - `A` / `CNAME` for apex + `www` to the static host (follow host docs)
2. In Shopify Admin → **Settings → Domains**:
   - Keep the store connected for checkout / admin
   - You may leave `transportcoffeeroasters.com` on Shopify until cutover day, then move DNS to the new host
3. After DNS points to this app, visitors get the React site; “Checkout” still opens Shopify Checkout.

### Redirects (optional but recommended)

On the static host, add redirects from old theme URLs:

- `/products/:handle` → `/shop/:handle`
- `/collections/:handle` → `/shop/collections/:handle`
- `/collections/all` → `/shop`

### Subscriptions

Live subscription checkout is phase 2 (needs a Shopify subscriptions app + selling plans). Catalog/cart does not depend on that.

## Smoke test checklist

- [ ] `/shop` lists products
- [ ] `/shop/frequent-flyer` shows product + variants
- [ ] Add to cart opens drawer
- [ ] Checkout lands on Shopify checkout with line items
- [ ] Home featured coffees match Shopify prices
