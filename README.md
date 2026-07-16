# Transport Coffee Roasters

A multi-page coffee roaster website with headless Shopify product browsing and checkout.

## Pages

- **Home** — Editorial layout with featured coffees from Shopify
- **Shop** — Product catalog, collections, and product detail
- **About / Contact / Wholesale / Locations** — Brand and inquiry pages
- **Subscriptions** — Plan selection layout (Shopify selling plans coming later)
- **Policies** — Refund and shipping

## Run Locally

```bash
npm install
cp .env.example .env
npm run dev
```

See [SHOPIFY.md](./SHOPIFY.md) for Storefront API tokens, cart setup, and domain cutover.

## Build For Production

```bash
npm run build
```

Output is in `dist`.

## Deploy

Works with Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_SHOPIFY_STORE_DOMAIN` and `VITE_SHOPIFY_STOREFRONT_TOKEN` in the host env
