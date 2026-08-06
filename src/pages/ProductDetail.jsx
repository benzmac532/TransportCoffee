import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import ShopifyImage from '../components/ShopifyImage';
import { DEFAULT_DESCRIPTION } from '../lib/site';
import {
  formatMoney,
  getProductByHandle,
  sellingPlanLabel,
  storefrontConfigHint,
} from '../lib/shopify';
import NotFound from './NotFound';

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function frequencySortKey(label = '') {
  const weeks = label.match(/(\d+)\s*weeks?/i);
  if (weeks) return Number(weeks[1]);
  if (/every\s+week\b/i.test(label) || /^weekly$/i.test(label)) return 1;
  if (/month/i.test(label)) return 30;
  return 100;
}

function pickDefaultSellingPlanId(plans) {
  if (!plans?.length) return '';
  const biweekly = plans.find((plan) => /2\s*week|bi-?weekly|fortnight/i.test(plan.label));
  return (biweekly || plans[0]).id;
}

export default function ProductDetail() {
  const { handle } = useParams();
  const { addItem, loading: cartLoading, configured } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [purchaseMode, setPurchaseMode] = useState('onetime');
  const [sellingPlanId, setSellingPlanId] = useState('');
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState('');
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const mediaRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      setPurchaseMode('onetime');
      setSellingPlanId('');
      try {
        const next = await getProductByHandle(handle);
        if (cancelled) return;
        if (!next) {
          setError('Product not found.');
          setProduct(null);
          return;
        }
        setProduct(next);
        const initial = {};
        (next.options || []).forEach((option) => {
          const name = typeof option.name === 'string' ? option.name : String(option.name || '');
          const firstValue = option.values?.[0];
          if (name && firstValue != null && typeof firstValue !== 'object') {
            initial[name] = String(firstValue);
          }
        });
        setSelectedOptions(initial);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load product.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [handle]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    if (!product.options?.length) return product.variants[0];

    return (
      product.variants.find((variant) =>
        (variant.selectedOptions || []).every(
          (opt) => selectedOptions[opt.name] === opt.value,
        ),
      ) || product.variants[0]
    );
  }, [product, selectedOptions]);

  const subscriptionPlans = useMemo(() => {
    if (!product || !selectedVariant) return [];

    const allocationByPlanId = new Map(
      (selectedVariant.sellingPlanAllocations || []).map((alloc) => [
        alloc.sellingPlanId,
        alloc,
      ]),
    );

    const plans = [];
    for (const group of product.sellingPlanGroups || []) {
      for (const plan of group.sellingPlans || []) {
        const allocation = allocationByPlanId.get(plan.id);
        if (!allocation) continue;
        plans.push({
          id: plan.id,
          name: plan.name,
          label: sellingPlanLabel(plan),
          discountPercent: plan.discountPercent,
          price: allocation.price,
          compareAtPrice: allocation.compareAtPrice,
        });
      }
    }

    const seen = new Set();
    return plans
      .filter((plan) => {
        if (seen.has(plan.label)) return false;
        seen.add(plan.label);
        return true;
      })
      .sort((a, b) => frequencySortKey(a.label) - frequencySortKey(b.label));
  }, [product, selectedVariant]);

  const hasSubscription = subscriptionPlans.length > 0;
  const isSubscribe = hasSubscription && purchaseMode === 'subscribe';

  useEffect(() => {
    if (!hasSubscription) {
      setPurchaseMode('onetime');
      setSellingPlanId('');
      return;
    }

    setSellingPlanId((current) => {
      if (current && subscriptionPlans.some((plan) => plan.id === current)) {
        return current;
      }
      return pickDefaultSellingPlanId(subscriptionPlans);
    });
  }, [hasSubscription, subscriptionPlans]);

  const selectedPlan = useMemo(
    () => subscriptionPlans.find((plan) => plan.id === sellingPlanId) || subscriptionPlans[0] || null,
    [subscriptionPlans, sellingPlanId],
  );

  const oneTimePrice = useMemo(() => {
    if (!selectedVariant?.price) return '';
    return formatMoney(selectedVariant.price.amount, selectedVariant.price.currencyCode);
  }, [selectedVariant]);

  const subscribePrice = useMemo(() => {
    if (!selectedPlan?.price) return oneTimePrice;
    return formatMoney(selectedPlan.price.amount, selectedPlan.price.currencyCode);
  }, [selectedPlan, oneTimePrice]);

  const compareAtPrice = useMemo(() => {
    if (!selectedPlan) return '';
    const compare = selectedPlan.compareAtPrice || selectedVariant?.price;
    if (!compare) return '';
    if (
      selectedPlan.price &&
      Number(compare.amount) > Number(selectedPlan.price.amount)
    ) {
      return formatMoney(compare.amount, compare.currencyCode);
    }
    return '';
  }, [selectedPlan, selectedVariant]);

  const savePercent = useMemo(() => {
    if (!selectedPlan) return null;
    if (typeof selectedPlan.discountPercent === 'number' && selectedPlan.discountPercent > 0) {
      return Math.round(selectedPlan.discountPercent);
    }
    const compare = selectedPlan.compareAtPrice || selectedVariant?.price;
    if (!compare || !selectedPlan.price) return null;
    const compareAmt = Number(compare.amount);
    const priceAmt = Number(selectedPlan.price.amount);
    if (!(compareAmt > priceAmt)) return null;
    return Math.round(((compareAmt - priceAmt) / compareAmt) * 100);
  }, [selectedPlan, selectedVariant]);

  const maxSavePercent = useMemo(() => {
    const percents = subscriptionPlans
      .map((plan) => {
        if (typeof plan.discountPercent === 'number' && plan.discountPercent > 0) {
          return Math.round(plan.discountPercent);
        }
        const compare = plan.compareAtPrice || selectedVariant?.price;
        if (!compare || !plan.price) return null;
        const compareAmt = Number(compare.amount);
        const priceAmt = Number(plan.price.amount);
        if (!(compareAmt > priceAmt)) return null;
        return Math.round(((compareAmt - priceAmt) / compareAmt) * 100);
      })
      .filter((value) => typeof value === 'number' && value > 0);
    return percents.length ? Math.max(...percents) : null;
  }, [subscriptionPlans, selectedVariant]);

  function updateZoomOrigin(event) {
    const node = mediaRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  }

  function handleMediaEnter(event) {
    if (prefersReducedMotion()) return;
    setZoomActive(true);
    updateZoomOrigin(event);
  }

  function handleMediaMove(event) {
    if (!zoomActive || prefersReducedMotion()) return;
    updateZoomOrigin(event);
  }

  function handleMediaLeave() {
    setZoomActive(false);
    setZoomOrigin({ x: 50, y: 50 });
  }

  async function handleAddToCart() {
    if (!selectedVariant?.id) return;
    if (isSubscribe && !selectedPlan?.id) {
      setNotice('Choose a delivery frequency to subscribe.');
      return;
    }
    setNotice('');
    setAdding(true);
    try {
      await addItem(
        selectedVariant.id,
        quantity,
        isSubscribe ? { sellingPlanId: selectedPlan.id } : {},
      );
      setNotice(isSubscribe ? 'Subscription added to cart.' : 'Added to cart.');
    } catch (err) {
      setNotice(err.message || 'Could not add to cart.');
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <main className="page shop-page product-detail-page">
        <Seo
          title="Loading product"
          description={DEFAULT_DESCRIPTION}
          path={`/shop/${handle}`}
          noindex
        />
        <section className="section">
          <p className="shop-status">Loading product…</p>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <NotFound
        title="Product not found"
        message={
          error && error !== 'Product not found.'
            ? error
            : "We couldn't find that product (or it may have left the catalog). Browse the shop for what's available now."
        }
        primaryTo="/shop"
        primaryLabel="Back to shop"
        secondaryTo="/"
        secondaryLabel="Back home"
        path={`/shop/${handle}`}
      />
    );
  }

  const optionFields = (product.options || []).filter(
    (option) => Array.isArray(option.values) && option.values.length > 1,
  );

  const successNotice =
    notice === 'Added to cart.' || notice === 'Subscription added to cart.';

  return (
    <main className="page shop-page product-detail-page">
      <Seo
        title={product.title}
        description={product.description || DEFAULT_DESCRIPTION}
        path={`/shop/${product.handle || handle}`}
        image={product.image?.url}
        imageAlt={product.image?.altText || product.title}
        type="product"
      />
      <section className="section product-detail">
        <Reveal className="product-detail-shell" variant="up">
          <Link className="text-link product-back" to="/shop">
            ← Back to shop
          </Link>

          <div className="product-detail-panel">
            <div
              className={`product-detail-media${zoomActive ? ' is-zooming' : ''}`}
              ref={mediaRef}
              onMouseEnter={handleMediaEnter}
              onMouseMove={handleMediaMove}
              onMouseLeave={handleMediaLeave}
            >
              {product.image?.url ? (
                <ShopifyImage
                  url={product.image.url}
                  alt={product.image.altText || product.title}
                  widths={[400, 640, 800, 1200, 1600]}
                  sizes="(max-width: 1040px) 100vw, 50vw"
                  width={1200}
                  loading="eager"
                  fetchPriority="high"
                  style={{
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  }}
                />
              ) : (
                <div className="product-art-placeholder" />
              )}
            </div>

            <div className="product-detail-copy">
              <div className="product-detail-intro">
                <p className="eyebrow">{product.productType || 'Product'}</p>
                <h1>{product.title}</h1>

                {hasSubscription && (
                  <div
                    className="purchase-mode"
                    role="tablist"
                    aria-label="Purchase type"
                  >
                    <button
                      type="button"
                      role="tab"
                      id="purchase-tab-onetime"
                      aria-selected={purchaseMode === 'onetime'}
                      className={`purchase-mode-tab${purchaseMode === 'onetime' ? ' is-active' : ''}`}
                      onClick={() => setPurchaseMode('onetime')}
                    >
                      One-time purchase
                    </button>
                    <button
                      type="button"
                      role="tab"
                      id="purchase-tab-subscribe"
                      aria-selected={purchaseMode === 'subscribe'}
                      className={`purchase-mode-tab${purchaseMode === 'subscribe' ? ' is-active' : ''}`}
                      onClick={() => setPurchaseMode('subscribe')}
                    >
                      <span>Subscribe &amp; save</span>
                      {maxSavePercent != null && (
                        <span className="purchase-mode-save">Save {maxSavePercent}%</span>
                      )}
                    </button>
                  </div>
                )}

                {(oneTimePrice || subscribePrice) && (
                  <div className="product-detail-price-stack">
                    <div
                      className={`product-detail-price-state${!isSubscribe ? ' is-active' : ''}`}
                      aria-hidden={isSubscribe}
                    >
                      {oneTimePrice && (
                        <div className="product-detail-price-row">
                          <p className="product-detail-price">{oneTimePrice}</p>
                        </div>
                      )}
                    </div>
                    <div
                      className={`product-detail-price-state${isSubscribe ? ' is-active' : ''}`}
                      aria-hidden={!isSubscribe}
                    >
                      {subscribePrice && (
                        <div className="product-detail-price-row">
                          <p className="product-detail-price">{subscribePrice}</p>
                          {compareAtPrice && (
                            <p className="product-detail-price-compare">{compareAtPrice}</p>
                          )}
                          {savePercent != null && (
                            <span className="product-detail-save">Save {savePercent}%</span>
                          )}
                        </div>
                      )}
                      <p className="product-detail-price-note">
                        Per delivery · pause or skip anytime
                      </p>
                    </div>
                  </div>
                )}
                {product.description && (
                  <p className="product-detail-desc">{product.description}</p>
                )}
              </div>

              <div className="product-detail-buybox">
                <div className="product-option-row">
                  {optionFields.map((option) => {
                    const optionName =
                      typeof option.name === 'string'
                        ? option.name
                        : String(option.name || 'Option');
                    return (
                      <label key={option.id || optionName} className="product-option">
                        <span>{optionName}</span>
                        <select
                          value={selectedOptions[optionName] || ''}
                          onChange={(event) =>
                            setSelectedOptions((prev) => ({
                              ...prev,
                              [optionName]: event.target.value,
                            }))
                          }
                        >
                          {option.values.map((value) => {
                            const label = typeof value === 'string' ? value : String(value);
                            return (
                              <option key={label} value={label}>
                                {label}
                              </option>
                            );
                          })}
                        </select>
                      </label>
                    );
                  })}

                  <label className="product-option product-option-qty">
                    <span>Quantity</span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={quantity}
                      onChange={(event) =>
                        setQuantity(Math.max(1, Number(event.target.value) || 1))
                      }
                    />
                  </label>
                </div>

                {hasSubscription && (
                  <div
                    className={`product-option-row product-option-frequency-row${
                      isSubscribe ? '' : ' is-reserved'
                    }`}
                    aria-hidden={!isSubscribe}
                  >
                    <label className="product-option product-option-frequency">
                      <span>Delivery frequency</span>
                      <select
                        value={selectedPlan?.id || ''}
                        tabIndex={isSubscribe ? 0 : -1}
                        disabled={!isSubscribe}
                        onChange={(event) => setSellingPlanId(event.target.value)}
                      >
                        {subscriptionPlans.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}

                <button
                  type="button"
                  className="button product-detail-cta"
                  disabled={
                    adding ||
                    cartLoading ||
                    !selectedVariant?.availableForSale ||
                    (isSubscribe && !selectedPlan?.id)
                  }
                  onClick={handleAddToCart}
                >
                  {!selectedVariant?.availableForSale
                    ? 'Sold out'
                    : adding
                      ? 'Adding…'
                      : isSubscribe
                        ? 'Subscribe'
                        : 'Add to cart'}
                </button>

                {!configured && (
                  <p className="shop-status">{storefrontConfigHint()}</p>
                )}
                {notice && (
                  <p
                    className={`shop-status${successNotice ? '' : ' shop-status-error'}`}
                    role={successNotice ? 'status' : 'alert'}
                  >
                    {notice}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
