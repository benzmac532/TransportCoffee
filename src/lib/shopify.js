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
];

export const SHOP_COLLECTIONS = [
  { label: 'All', to: '/shop' },
  { label: 'Coffee', to: '/shop/collections/coffee', handle: 'coffee' },
  { label: 'Subscribe', to: '/subscriptions' },
  { label: 'Merch', to: '/shop/collections/merch', handle: 'merch' },
  { label: 'Gift Cards', to: '/shop/collections/gift-cards', handle: 'gift-cards' },
  { label: 'Brew Gear', to: '/shop/collections/brew-gear', handle: 'brew-gear' },
];

export function isStorefrontConfigured() {
  return Boolean(storeDomain && storefrontToken);
}

export function formatMoney(amount, currencyCode = 'USD') {
  const value = Number(amount);
  if (Number.isNaN(value)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}

function mapStorefrontProduct(node) {
  if (!node) return null;
  const variant = node.selectedOrFirstAvailableVariant || node.variants?.nodes?.[0];
  const image = node.featuredImage || node.images?.nodes?.[0];
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description || '',
    descriptionHtml: node.descriptionHtml || '',
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
    })),
    options: node.options || [],
  };
}

function mapAjaxProduct(product) {
  const variant = product.variants?.[0];
  const image = product.images?.[0] || product.image;
  return {
    id: `gid://shopify/Product/${product.id}`,
    handle: product.handle,
    title: product.title,
    description: (product.body_html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    descriptionHtml: product.body_html || '',
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
        v.option1 && { name: product.options?.[0] || 'Option', value: v.option1 },
        v.option2 && { name: product.options?.[1] || 'Option', value: v.option2 },
        v.option3 && { name: product.options?.[2] || 'Option', value: v.option3 },
      ].filter(Boolean),
    })),
    options: (product.options || []).map((name, index) => ({
      id: `option-${index}`,
      name,
      values: [...new Set((product.variants || []).map((v) => v[`option${index + 1}`]).filter(Boolean))],
    })),
  };
}

function mapCart(cart) {
  if (!cart) return null;
  const lines = (cart.lines?.nodes || []).map((line) => ({
    id: line.id,
    quantity: line.quantity,
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
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity || 0,
    cost: cart.cost,
    lines,
  };
}

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  descriptionHtml
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
    }
  }
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
      cost { totalAmount { amount currencyCode } }
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
  return (data.products || []).map(mapAjaxProduct);
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
  return (data.products || []).map(mapAjaxProduct);
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

  return (data.products?.nodes || []).map(mapStorefrontProduct);
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
    const products = await fetchPublicCollectionProducts(handle, first);
    if (products.length) return products;
    // Soft fallback: some stores use different handles; show all coffee-ish catalog
    return getProducts({ first });
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

  if (!data.collection) {
    return getProducts({ first });
  }

  return (data.collection.products?.nodes || []).map(mapStorefrontProduct);
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

export async function addLinesToCart(merchandiseId, quantity = 1) {
  if (!isStorefrontConfigured()) {
    throw new Error(
      'Cart requires Shopify Storefront API credentials. Add VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN to .env.',
    );
  }

  const lines = [{ merchandiseId, quantity }];
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
