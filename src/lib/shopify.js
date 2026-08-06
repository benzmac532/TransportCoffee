/**
 * Shopify Storefront API client + public JSON fallback.
 *
 * Env (Vite):
 * - VITE_SHOPIFY_STORE_DOMAIN — e.g. your-store.myshopify.com
 * - VITE_SHOPIFY_STOREFRONT_TOKEN — Storefront API access token
 * - VITE_SHOPIFY_PUBLIC_URL — https://transportcoffeeroasters.com (product JSON fallback)
 */

const API_VERSION = '2025-01';
const CART_ID_KEY = 'tcr_shopify_cart_id';

const storeDomain = (import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
const storefrontToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';
const publicStoreUrl = (import.meta.env.VITE_SHOPIFY_PUBLIC_URL || 'https://transportcoffeeroasters.com').replace(/\/$/, '');

export const FEATURED_HANDLES = [
  'frequent-flyer',
  'ethiopia-danbi-udo',
  'peru-minca-organic',
  'colombia-honey-process',
];

export const SHOP_COLLECTIONS = [
  { label: 'All', to: '/shop' },
  {
    label: 'Coffee',
    to: '/shop/collections/coffee',
    handle: 'coffee',
    blurb: 'Single origins and blends, roasted fresh for the journey ahead.',
  },
  { label: 'Subscribe', to: '/subscriptions' },
  {
    label: 'Merch',
    to: '/shop/collections/merch',
    handle: 'merch',
    blurb: 'Wear the brand — gear for mornings on the move.',
  },
  {
    label: 'Gift Cards',
    to: '/shop/collections/gift-cards',
    handle: 'gift-cards',
    blurb: 'Send great coffee when you can’t be there in person.',
  },
  {
    label: 'Brew Gear',
    to: '/shop/collections/brew-gear',
    handle: 'brew-gear',
    blurb: 'Tools for a better cup at home or on the road.',
  },
];

/**
 * Optional marketing overlays for Shopify selling plan groups (matched by name).
 * Cards themselves are discovered from the Storefront API; overlays only polish known plans.
 */
export const SUBSCRIPTION_PLAN_OVERLAYS = [
  {
    match: /frequent\s*flyer/i,
    name: 'Frequent Flyer',
    quantity: 1,
    preferredHandles: ['frequent-flyer'],
    interval: 'per delivery',
    description: 'Our house blend, as often as you want',
    coffees: ['Built for daily drinkers', 'Pause or skip anytime'],
    featured: true,
    order: 10,
  },
  {
    match: /flight\s*plan/i,
    name: 'The Flight Plan',
    quantity: 1,
    preferredHandles: ['ethiopia-danbi-udo', 'peru-minca-organic'],
    interval: 'per delivery',
    description: 'Rotating single origin of the roasters choice',
    coffees: ['Seasonal origins', 'Pause or skip anytime'],
    order: 20,
  },
  {
    match: /explorer/i,
    name: 'Explorer',
    quantity: 1,
    priceLabel: '$18',
    interval: 'per delivery',
    description: 'One 12oz bag of our rotating single origin.',
    coffees: ['Rotating single origin', 'Freshly roasted weekly'],
    order: 30,
  },
  {
    match: /wanderlust/i,
    name: 'Wanderlust',
    quantity: 1,
    preferredHandles: ['frequent-flyer'],
    interval: 'per delivery',
    description: 'A bag of house coffee on your schedule — subscribe and save.',
    coffees: ['Built for daily drinkers', 'Pause or skip anytime'],
    order: 40,
  },
  {
    match: /roaster'?s?\s*choice|single origin/i,
    name: "Roaster's Choice",
    quantity: 1,
    preferredHandles: ['ethiopia-danbi-udo', 'colombia-honey-process', 'peru-minca-organic'],
    interval: 'per delivery',
    description: 'Rotating single-origin bags, curated by our roasting team.',
    coffees: ['Seasonal origins', 'Freshly roasted for each delivery'],
    order: 50,
  },
  {
    match: /office/i,
    name: 'Office',
    quantity: 5,
    priceLabel: '$72',
    interval: 'per delivery',
    description: 'Five 12oz bags for teams that run on good coffee.',
    coffees: ['Custom blend options', 'Priority roasting schedule'],
    order: 60,
  },
];

/** @deprecated Use SUBSCRIPTION_PLAN_OVERLAYS — kept as alias for older imports. */
export const SUBSCRIPTION_PLAN_DEFS = SUBSCRIPTION_PLAN_OVERLAYS;

export function isStorefrontConfigured() {
  return Boolean(storeDomain && storefrontToken);
}

/** Which Storefront env vars are missing (for UI / deploy debugging). */
export function getMissingStorefrontEnv() {
  const missing = [];
  if (!storeDomain) missing.push('VITE_SHOPIFY_STORE_DOMAIN');
  if (!storefrontToken) missing.push('VITE_SHOPIFY_STOREFRONT_TOKEN');
  return missing;
}

export function storefrontConfigHint() {
  const missing = getMissingStorefrontEnv();
  if (missing.length === 0) return '';
  return `Missing ${missing.join(' and ')}. On Vercel, set them for Production and redeploy without build cache. Domain must be your *.myshopify.com host (e.g. bk6zru-20.myshopify.com), not the custom domain.`;
}

export function formatMoney(amount, currencyCode = 'USD') {
  const value = Number(amount);
  if (Number.isNaN(value)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}

const SHOPIFY_IMAGE_HOST = /(^|\.)(?:shopify\.com|shopifycdn\.com)$/i;

/** True when the URL can be resized via Shopify CDN width params. */
export function isShopifyCdnUrl(url) {
  if (!url) return false;
  try {
    return SHOPIFY_IMAGE_HOST.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

/**
 * Request a resized Shopify CDN image. Non-Shopify URLs are returned unchanged.
 * @see https://shopify.dev/docs/api/liquid/filters/image_url
 */
export function shopifyImageUrl(url, width) {
  if (!url) return '';
  if (!width || !isShopifyCdnUrl(url)) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('width', String(Math.round(width)));
    parsed.searchParams.delete('height');
    return parsed.toString();
  } catch {
    return url;
  }
}

/** Build a srcset string for common display widths. */
export function shopifyImageSrcSet(url, widths = [240, 400, 640, 800, 1200, 1600]) {
  if (!url || !isShopifyCdnUrl(url)) return undefined;
  return widths.map((width) => `${shopifyImageUrl(url, width)} ${width}w`).join(', ');
}

function sortProductsByTitle(products) {
  return [...products].sort((a, b) =>
    String(a?.title || '').localeCompare(String(b?.title || ''), undefined, { sensitivity: 'base' }),
  );
}

function mapStorefrontProduct(node) {
  if (!node) return null;
  const variant = node.selectedOrFirstAvailableVariant || node.variants?.nodes?.[0];
  const image = node.featuredImage || node.images?.nodes?.[0];
  const sellingPlanGroups = (node.sellingPlanGroups?.nodes || []).map((group) => ({
    name: group.name || '',
    sellingPlans: (group.sellingPlans?.nodes || []).map((plan) => ({
      id: plan.id,
      name: plan.name || '',
      description: plan.description || '',
      options: (plan.options || []).map((opt) => ({
        name: opt.name || '',
        value: opt.value || '',
      })),
      discountPercent: (() => {
        const adj = plan.priceAdjustments?.[0]?.adjustmentValue;
        if (adj && typeof adj.adjustmentPercentage === 'number') {
          return adj.adjustmentPercentage;
        }
        return null;
      })(),
    })),
  }));
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description || '',
    descriptionHtml: node.descriptionHtml || '',
    productType: (node.productType || '').trim(),
    availableForSale: Boolean(node.availableForSale ?? variant?.availableForSale),
    image: image
      ? { url: image.url, altText: image.altText || node.title }
      : null,
    price: variant?.price
      ? { amount: variant.price.amount, currencyCode: variant.price.currencyCode }
      : null,
    variants: (node.variants?.nodes || []).map((v) => ({
      id: v.id,
      title: v.title,
      availableForSale: v.availableForSale,
      price: v.price,
      selectedOptions: v.selectedOptions || [],
      sellingPlanAllocations: (v.sellingPlanAllocations?.nodes || []).map((alloc) => ({
        sellingPlanId: alloc.sellingPlan?.id,
        price: alloc.priceAdjustments?.[0]?.price || null,
        compareAtPrice: alloc.priceAdjustments?.[0]?.compareAtPrice || null,
      })),
    })),
    options: node.options || [],
    sellingPlanGroups,
  };
}

function mapAjaxProduct(product) {
  const variant = product.variants?.[0];
  const image = product.images?.[0] || product.image;
  const rawOptions = product.options || [];

  const normalizedOptions = rawOptions.map((opt, index) => {
    const name = typeof opt === 'string' ? opt : String(opt?.name || `Option ${index + 1}`);
    const valuesFromOpt = typeof opt === 'object' && Array.isArray(opt.values) ? opt.values : null;
    const values =
      valuesFromOpt?.map(String) ||
      [...new Set((product.variants || []).map((v) => v[`option${index + 1}`]).filter(Boolean).map(String))];
    return {
      id: typeof opt === 'object' && opt.id != null ? String(opt.id) : `option-${index}`,
      name,
      values,
    };
  });

  return {
    id: `gid://shopify/Product/${product.id}`,
    handle: product.handle,
    title: product.title,
    description: (product.body_html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    descriptionHtml: product.body_html || '',
    productType: String(product.product_type || '').trim(),
    availableForSale: variant ? variant.available !== false && variant.inventory_quantity !== 0 : true,
    image: image
      ? {
          url: typeof image === 'string' ? image : image.src,
          altText: product.title,
        }
      : null,
    price: variant
      ? { amount: String(variant.price), currencyCode: 'USD' }
      : null,
    variants: (product.variants || []).map((v) => ({
      id: `gid://shopify/ProductVariant/${v.id}`,
      title: v.title,
      availableForSale: v.available !== false,
      price: { amount: String(v.price), currencyCode: 'USD' },
      selectedOptions: [
        v.option1 && { name: normalizedOptions[0]?.name || 'Option', value: String(v.option1) },
        v.option2 && { name: normalizedOptions[1]?.name || 'Option', value: String(v.option2) },
        v.option3 && { name: normalizedOptions[2]?.name || 'Option', value: String(v.option3) },
      ].filter(Boolean),
    })),
    options: normalizedOptions,
    sellingPlanGroups: [],
  };
}

function normalizeCheckoutUrl(url) {
  if (!url || !storeDomain) return url || null;
  try {
    const parsed = new URL(url);
    // Shopify may return checkout on the primary/custom domain. That domain now
    // hosts this React app, so rewrite to the myshopify host for real checkout.
    if (/^\/(cart|checkouts?)\b/i.test(parsed.pathname)) {
      parsed.protocol = 'https:';
      parsed.host = storeDomain;
      return parsed.toString();
    }
  } catch {
    /* keep original */
  }
  return url;
}

function mapCart(cart) {
  if (!cart) return null;
  const lines = (cart.lines?.nodes || []).map((line) => ({
    id: line.id,
    quantity: line.quantity,
    attributes: (line.attributes || []).map((attr) => ({
      key: attr.key,
      value: attr.value,
    })),
    sellingPlan: line.sellingPlanAllocation?.sellingPlan
      ? {
          id: line.sellingPlanAllocation.sellingPlan.id,
          name: line.sellingPlanAllocation.sellingPlan.name,
        }
      : null,
    merchandise: {
      id: line.merchandise?.id,
      title: line.merchandise?.title,
      productTitle: line.merchandise?.product?.title,
      image: line.merchandise?.image
        ? { url: line.merchandise.image.url, altText: line.merchandise.image.altText }
        : null,
      price: line.merchandise?.price,
    },
    cost: line.cost?.totalAmount,
  }));

  return {
    id: cart.id,
    checkoutUrl: normalizeCheckoutUrl(cart.checkoutUrl),
    totalQuantity: cart.totalQuantity || 0,
    cost: cart.cost,
    lines,
  };
}

const SELLING_PLAN_FIELDS = `
  sellingPlanGroups(first: 10) {
    nodes {
      name
      sellingPlans(first: 10) {
        nodes {
          id
          name
          description
          options { name value }
          priceAdjustments {
            adjustmentValue {
              ... on SellingPlanPercentagePriceAdjustment {
                adjustmentPercentage
              }
              ... on SellingPlanFixedAmountPriceAdjustment {
                adjustmentAmount { amount currencyCode }
              }
              ... on SellingPlanFixedPriceAdjustment {
                price { amount currencyCode }
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  descriptionHtml
  productType
  availableForSale
  featuredImage { url altText }
  images(first: 6) { nodes { url altText } }
  options { id name values }
  selectedOrFirstAvailableVariant {
    id
    title
    availableForSale
    price { amount currencyCode }
  }
  variants(first: 50) {
    nodes {
      id
      title
      availableForSale
      price { amount currencyCode }
      selectedOptions { name value }
      sellingPlanAllocations(first: 20) {
        nodes {
          sellingPlan { id name }
          priceAdjustments {
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
          }
        }
      }
    }
  }
  ${SELLING_PLAN_FIELDS}
`;

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  lines(first: 50) {
    nodes {
      id
      quantity
      attributes { key value }
      cost { totalAmount { amount currencyCode } }
      sellingPlanAllocation {
        sellingPlan { id name }
      }
      merchandise {
        ... on ProductVariant {
          id
          title
          price { amount currencyCode }
          image { url altText }
          product { title handle }
        }
      }
    }
  }
`;

async function storefrontFetch(query, variables = {}) {
  if (!isStorefrontConfigured()) {
    throw new Error('Shopify Storefront API is not configured. Set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN.');
  }

  const response = await fetch(`https://${storeDomain}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront request failed (${response.status})`);
  }

  const json = await response.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }
  return json.data;
}

async function fetchPublicProducts(limit = 50) {
  const response = await fetch(`${publicStoreUrl}/products.json?limit=${limit}`);
  if (!response.ok) throw new Error('Could not load products from Shopify storefront.');
  const data = await response.json();
  return sortProductsByTitle((data.products || []).map(mapAjaxProduct));
}

async function fetchPublicProductByHandle(handle) {
  const response = await fetch(`${publicStoreUrl}/products/${handle}.json`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Could not load product "${handle}".`);
  }
  const data = await response.json();
  return mapAjaxProduct(data.product);
}

async function fetchPublicCollectionProducts(handle, limit = 50) {
  const response = await fetch(`${publicStoreUrl}/collections/${handle}/products.json?limit=${limit}`);
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Could not load collection "${handle}".`);
  }
  const data = await response.json();
  return sortProductsByTitle((data.products || []).map(mapAjaxProduct));
}

export async function getProducts({ first = 50 } = {}) {
  if (!isStorefrontConfigured()) {
    return fetchPublicProducts(first);
  }

  const data = await storefrontFetch(
    `
    query Products($first: Int!) {
      products(first: $first) {
        nodes { ${PRODUCT_FIELDS} }
      }
    }
  `,
    { first },
  );

  return sortProductsByTitle((data.products?.nodes || []).map(mapStorefrontProduct));
}

export async function getProductByHandle(handle) {
  if (!isStorefrontConfigured()) {
    return fetchPublicProductByHandle(handle);
  }

  const data = await storefrontFetch(
    `
    query ProductByHandle($handle: String!) {
      product(handle: $handle) { ${PRODUCT_FIELDS} }
    }
  `,
    { handle },
  );

  return mapStorefrontProduct(data.product);
}

export async function getProductsByHandles(handles) {
  const products = await Promise.all(handles.map((handle) => getProductByHandle(handle)));
  return products.filter(Boolean);
}

export async function getCollectionProducts(handle, { first = 50 } = {}) {
  if (!handle || handle === 'all') {
    return getProducts({ first });
  }

  if (!isStorefrontConfigured()) {
    return fetchPublicCollectionProducts(handle, first);
  }

  const data = await storefrontFetch(
    `
    query CollectionProducts($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        id
        title
        handle
        products(first: $first) {
          nodes { ${PRODUCT_FIELDS} }
        }
      }
    }
  `,
    { handle, first },
  );

  // Missing collection → empty list (do not fall back to all products).
  if (!data.collection) return [];

  return sortProductsByTitle((data.collection.products?.nodes || []).map(mapStorefrontProduct));
}

export function getStoredCartId() {
  try {
    return localStorage.getItem(CART_ID_KEY);
  } catch {
    return null;
  }
}

function setStoredCartId(id) {
  try {
    if (id) localStorage.setItem(CART_ID_KEY, id);
    else localStorage.removeItem(CART_ID_KEY);
  } catch {
    /* ignore */
  }
}

export async function getCart(cartId = getStoredCartId()) {
  if (!cartId || !isStorefrontConfigured()) return null;

  const data = await storefrontFetch(
    `
    query Cart($id: ID!) {
      cart(id: $id) { ${CART_FIELDS} }
    }
  `,
    { id: cartId },
  );

  const cart = mapCart(data.cart);
  if (!cart) setStoredCartId(null);
  return cart;
}

export async function createCart(lines = []) {
  const data = await storefrontFetch(
    `
    mutation CartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `,
    { input: lines.length ? { lines } : {} },
  );

  const errors = data.cartCreate?.userErrors || [];
  if (errors.length) throw new Error(errors.map((e) => e.message).join('; '));

  const cart = mapCart(data.cartCreate.cart);
  if (cart?.id) setStoredCartId(cart.id);
  return cart;
}

function buildCartLineInput(merchandiseId, quantity = 1, options = {}) {
  const line = { merchandiseId, quantity };
  if (options.sellingPlanId) line.sellingPlanId = options.sellingPlanId;
  if (options.attributes?.length) line.attributes = options.attributes;
  return line;
}

export async function addLinesToCart(merchandiseId, quantity = 1, options = {}) {
  if (!isStorefrontConfigured()) {
    throw new Error(storefrontConfigHint() || 'Cart requires Shopify Storefront API credentials.');
  }

  const lines = [buildCartLineInput(merchandiseId, quantity, options)];
  let cartId = getStoredCartId();

  if (!cartId) {
    return createCart(lines);
  }

  const data = await storefrontFetch(
    `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `,
    { cartId, lines },
  );

  const errors = data.cartLinesAdd?.userErrors || [];
  if (errors.length) {
    // Cart may have expired — create a fresh one
    setStoredCartId(null);
    return createCart(lines);
  }

  const cart = mapCart(data.cartLinesAdd.cart);
  if (cart?.id) setStoredCartId(cart.id);
  return cart;
}

/** Add a subscription line (merchandise + sellingPlanId). */
export async function addSubscriptionToCart({
  merchandiseId,
  quantity = 1,
  sellingPlanId,
} = {}) {
  if (!merchandiseId || !sellingPlanId) {
    throw new Error('Subscription requires a product variant and selling plan.');
  }

  return addLinesToCart(merchandiseId, quantity, { sellingPlanId });
}

export function sellingPlanLabel(plan) {
  const delivery = plan.options?.find((opt) => /delivery|frequency|interval/i.test(opt.name));
  let label = (delivery?.value || plan.name || 'Delivery').trim();
  label = label.replace(/^deliver\s+/i, '');
  if (label) label = label.charAt(0).toUpperCase() + label.slice(1);
  return label;
}

function frequencySortKey(label = '') {
  const weeks = label.match(/(\d+)\s*weeks?/i);
  if (weeks) return Number(weeks[1]);
  if (/every\s+week\b/i.test(label) || /^weekly$/i.test(label)) return 1;
  if (/month/i.test(label)) return 30;
  return 100;
}

function slugifyPlanId(name) {
  const slug = String(name || 'plan')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'plan';
}

function findPlanOverlay(groupName) {
  return SUBSCRIPTION_PLAN_OVERLAYS.find((overlay) => overlay.match.test(groupName || '')) || null;
}

function pickProductForGroup(products, overlay) {
  const preferred = overlay?.preferredHandles || [];
  for (const handle of preferred) {
    const hit = products.find((p) => p.handle === handle);
    if (hit) return hit;
  }
  for (const handle of FEATURED_HANDLES) {
    const hit = products.find((p) => p.handle === handle);
    if (hit) return hit;
  }
  return products[0] || null;
}

/**
 * Discover selling plan groups from Storefront and merge optional marketing overlays.
 * New Shopify groups appear automatically; overlays polish known names.
 */
export async function getSubscriptionOffers({ first = 50 } = {}) {
  if (!isStorefrontConfigured()) {
    return {
      configured: false,
      ready: false,
      plans: [],
      message: storefrontConfigHint() || 'Storefront API is not configured.',
    };
  }

  const products = await getProducts({ first });
  const groupsByKey = new Map();

  for (const product of products) {
    for (const group of product.sellingPlanGroups || []) {
      const key = (group.name || '').trim().toLowerCase();
      if (!key) continue;
      const entry = groupsByKey.get(key) || {
        name: group.name,
        sellingPlansById: new Map(),
        products: [],
      };
      entry.products.push(product);
      for (const plan of group.sellingPlans || []) {
        if (plan?.id) entry.sellingPlansById.set(plan.id, plan);
      }
      groupsByKey.set(key, entry);
    }
  }

  const plans = [...groupsByKey.values()]
    .map((entry) => {
      const overlay = findPlanOverlay(entry.name);
      const product = pickProductForGroup(entry.products, overlay);
      const variants = (product?.variants || []).map((v) => ({
        id: v.id,
        title: v.title,
        availableForSale: v.availableForSale !== false,
        price: v.price || null,
        sellingPlanAllocations: v.sellingPlanAllocations || [],
      }));
      const variant =
        variants.find((v) => v.availableForSale) || variants[0] || null;

      const sellingPlans = [...entry.sellingPlansById.values()]
        .map((plan) => ({
          id: plan.id,
          name: plan.name,
          label: sellingPlanLabel(plan),
          discountPercent: plan.discountPercent,
        }))
        .sort((a, b) => frequencySortKey(a.label) - frequencySortKey(b.label));

      // Dedupe labels while keeping stable plan ids (first wins after sort).
      const seenLabels = new Set();
      const uniquePlans = sellingPlans.filter((plan) => {
        if (seenLabels.has(plan.label)) return false;
        seenLabels.add(plan.label);
        return true;
      });

      const planIds = new Set(uniquePlans.map((plan) => plan.id));
      const allocation =
        (variant?.sellingPlanAllocations || []).find((alloc) =>
          planIds.has(alloc.sellingPlanId),
        ) || null;

      const subscribeAmount = allocation?.price?.amount;
      const compareAmount =
        allocation?.compareAtPrice?.amount || variant?.price?.amount || null;
      const currency =
        allocation?.price?.currencyCode ||
        allocation?.compareAtPrice?.currencyCode ||
        variant?.price?.currencyCode ||
        'USD';

      const fromPlanPercent = uniquePlans.find(
        (plan) => typeof plan.discountPercent === 'number' && plan.discountPercent > 0,
      )?.discountPercent;

      let discountPercent =
        typeof fromPlanPercent === 'number' ? Math.round(fromPlanPercent) : null;
      if (
        discountPercent == null &&
        subscribeAmount != null &&
        compareAmount != null &&
        Number(compareAmount) > Number(subscribeAmount)
      ) {
        discountPercent = Math.round(
          ((Number(compareAmount) - Number(subscribeAmount)) / Number(compareAmount)) * 100,
        );
      }

      const hasDiscount =
        Boolean(discountPercent && discountPercent > 0) &&
        subscribeAmount != null &&
        compareAmount != null &&
        Number(compareAmount) > Number(subscribeAmount);

      const liveSubscribePrice =
        subscribeAmount != null ? formatMoney(subscribeAmount, currency) : '';
      const liveComparePrice =
        compareAmount != null ? formatMoney(compareAmount, currency) : '';
      const liveOneTimePrice =
        variant?.price != null
          ? formatMoney(variant.price.amount, variant.price.currencyCode)
          : '';

      return {
        id: slugifyPlanId(overlay?.name || entry.name),
        name: overlay?.name || entry.name,
        groupName: entry.name,
        quantity: overlay?.quantity ?? 1,
        price:
          liveSubscribePrice ||
          overlay?.priceLabel ||
          liveOneTimePrice ||
          '—',
        compareAtPrice: hasDiscount ? liveComparePrice : '',
        discountPercent: hasDiscount ? discountPercent : null,
        interval: overlay?.interval || 'per delivery',
        description:
          overlay?.description ||
          product?.description?.slice(0, 140) ||
          'Fresh coffee delivered on your schedule.',
        coffees: overlay?.coffees || (product?.title ? [product.title, 'Pause or skip anytime'] : []),
        featured: Boolean(overlay?.featured),
        order: overlay?.order ?? 500,
        sellingPlans: uniquePlans,
        variants,
        merchandiseId: variant?.id || null,
        productHandle: product?.handle || null,
        productTitle: product?.title || null,
        available: Boolean(variant?.id && uniquePlans.length),
      };
    })
    .filter((plan) => plan.available)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.order !== b.order) return a.order - b.order;
      return a.name.localeCompare(b.name);
    });

  const ready = plans.length > 0;

  return {
    configured: true,
    ready,
    plans,
    message: ready
      ? ''
      : 'Subscription plans are not linked to products yet. Attach products to selling plans in Shopify Admin → Subscriptions.',
  };
}

export async function updateCartLine(lineId, quantity) {
  const cartId = getStoredCartId();
  if (!cartId) return null;

  const data = await storefrontFetch(
    `
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `,
    { cartId, lines: [{ id: lineId, quantity }] },
  );

  const errors = data.cartLinesUpdate?.userErrors || [];
  if (errors.length) throw new Error(errors.map((e) => e.message).join('; '));
  return mapCart(data.cartLinesUpdate.cart);
}

export async function removeCartLine(lineId) {
  const cartId = getStoredCartId();
  if (!cartId) return null;

  const data = await storefrontFetch(
    `
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `,
    { cartId, lineIds: [lineId] },
  );

  const errors = data.cartLinesRemove?.userErrors || [];
  if (errors.length) throw new Error(errors.map((e) => e.message).join('; '));
  return mapCart(data.cartLinesRemove.cart);
}
