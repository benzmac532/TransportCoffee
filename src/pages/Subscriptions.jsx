import { useEffect, useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { useCart } from '../components/CartContext';
import { getStaticPageMeta } from '../lib/seoPages';
import { formatMoney, getSubscriptionOffers } from '../lib/shopify';

const pageMeta = getStaticPageMeta('/subscriptions');

const perks = [
  'Free shipping on every subscription order',
  'Save on recurring deliveries',
  'Pause, skip, or cancel anytime',
  'Freshly roasted for every delivery',
];

function pickDefaultFrequency(sellingPlans) {
  if (!sellingPlans?.length) return '';
  const biweekly = sellingPlans.find((plan) => /2\s*week|bi-?weekly|fortnight/i.test(plan.label));
  return (biweekly || sellingPlans[0]).label;
}

function variantLabel(variant) {
  const title = String(variant?.title || '').trim();
  if (!title || /^default title$/i.test(title)) return 'Standard';
  return title;
}

function allocationFor(variant, sellingPlanId) {
  if (!variant || !sellingPlanId) return null;
  return (
    (variant.sellingPlanAllocations || []).find(
      (alloc) => alloc.sellingPlanId === sellingPlanId,
    ) || null
  );
}

function priceDetailsForVariant(plan, variant, sellingPlanId) {
  const allocation = allocationFor(variant, sellingPlanId);
  const subscribeAmount = allocation?.price?.amount;
  const compareAmount =
    allocation?.compareAtPrice?.amount || variant?.price?.amount || null;
  const currency =
    allocation?.price?.currencyCode ||
    allocation?.compareAtPrice?.currencyCode ||
    variant?.price?.currencyCode ||
    'USD';

  let discountPercent =
    typeof plan?.discountPercent === 'number' && plan.discountPercent > 0
      ? Math.round(plan.discountPercent)
      : null;

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

  return {
    price:
      subscribeAmount != null
        ? formatMoney(subscribeAmount, currency)
        : plan?.price || '—',
    compareAtPrice: hasDiscount ? formatMoney(compareAmount, currency) : '',
    discountPercent: hasDiscount ? discountPercent : null,
  };
}

export default function Subscriptions() {
  const { addSubscription, loading: cartLoading } = useCart();
  const [plans, setPlans] = useState([]);
  const [ready, setReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [grindId, setGrindId] = useState('');
  const [frequency, setFrequency] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingOffers(true);
      try {
        const offers = await getSubscriptionOffers();
        if (cancelled) return;
        setPlans(offers.plans);
        setReady(offers.ready);
        setStatusMessage(offers.message || '');
        const preferred =
          offers.plans.find((plan) => plan.featured && plan.available) ||
          offers.plans.find((plan) => plan.available) ||
          offers.plans[0];
        if (preferred) {
          setSelectedPlan(preferred.id);
          setFrequency(pickDefaultFrequency(preferred.sellingPlans));
          const firstVariant =
            preferred.variants?.find((variant) => variant.availableForSale) ||
            preferred.variants?.[0];
          setGrindId(firstVariant?.id || preferred.merchandiseId || '');
        }
      } catch (err) {
        if (!cancelled) {
          setStatusMessage(err.message || 'Could not load subscription plans.');
          setReady(false);
          setPlans([]);
        }
      } finally {
        if (!cancelled) setLoadingOffers(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const activePlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlan) || plans[0],
    [plans, selectedPlan],
  );

  const grindOptions = useMemo(() => {
    const variants = activePlan?.variants || [];
    return variants
      .filter((variant) => variant?.id)
      .map((variant) => ({
        id: variant.id,
        label: variantLabel(variant),
        available: variant.availableForSale !== false,
      }));
  }, [activePlan]);

  const frequencyOptions = useMemo(() => {
    if (activePlan?.sellingPlans?.length) {
      return activePlan.sellingPlans.map((plan) => plan.label);
    }
    return [];
  }, [activePlan]);

  useEffect(() => {
    if (!grindOptions.length) {
      if (grindId) setGrindId('');
      return;
    }
    if (!grindOptions.some((option) => option.id === grindId)) {
      const preferred =
        grindOptions.find((option) => option.available) || grindOptions[0];
      setGrindId(preferred.id);
    }
  }, [grindOptions, grindId]);

  useEffect(() => {
    if (!frequencyOptions.length) {
      if (frequency) setFrequency('');
      return;
    }
    if (!frequencyOptions.includes(frequency)) {
      setFrequency(frequencyOptions[0]);
    }
  }, [frequencyOptions, frequency]);

  const selectedSellingPlan = useMemo(() => {
    if (!activePlan?.sellingPlans?.length) return null;
    return (
      activePlan.sellingPlans.find((plan) => plan.label === frequency) ||
      activePlan.sellingPlans[0]
    );
  }, [activePlan, frequency]);

  const selectedVariant = useMemo(() => {
    const variants = activePlan?.variants || [];
    return (
      variants.find((variant) => variant.id === grindId) ||
      variants.find((variant) => variant.availableForSale) ||
      variants[0] ||
      null
    );
  }, [activePlan, grindId]);

  const canStart =
    ready &&
    Boolean(selectedVariant?.id && selectedSellingPlan?.id && activePlan?.available);

  async function handleStartSubscription() {
    if (!canStart || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      await addSubscription({
        merchandiseId: selectedVariant.id,
        quantity: activePlan.quantity || 1,
        sellingPlanId: selectedSellingPlan.id,
      });
    } catch (err) {
      setError(err.message || 'Could not start subscription.');
    } finally {
      setSubmitting(false);
    }
  }

  function selectPlan(plan) {
    const currentLabel = variantLabel(
      activePlan?.variants?.find((variant) => variant.id === grindId),
    );
    setSelectedPlan(plan.id);
    setFrequency(pickDefaultFrequency(plan.sellingPlans));
    const preferred =
      plan.variants?.find(
        (variant) => variantLabel(variant) === currentLabel && variant.availableForSale,
      ) ||
      plan.variants?.find((variant) => variantLabel(variant) === currentLabel) ||
      plan.variants?.find((variant) => variant.availableForSale) ||
      plan.variants?.[0];
    setGrindId(preferred?.id || plan.merchandiseId || '');
    setError('');
  }

  return (
    <main className="page subscriptions-page">
      <Seo title={pageMeta.title} description={pageMeta.description} path={pageMeta.path} />
      <div className="subscriptions-mosaic">
        <PageHero
          eyebrow="Subscriptions"
          titleLines={['Fresh Coffee', 'on your', 'Schedule']}
        />

        <section className="subs-feature">
          <Reveal className="subs-photo-col" variant="left" delaySteps={1}>
            <aside className="subs-visual">
              <img
                src="/brew-bar.jpg"
                alt="Home brew bar with grinder, kettle, pour-over, and Transport Coffee beans"
                loading="lazy"
                decoding="async"
              />
            </aside>
          </Reveal>
          <Reveal className="subs-perks-panel" variant="up" delaySteps={2}>
            <div className="section-heading">
              <p className="eyebrow">Member perks</p>
              <h2>Why subscribe?</h2>
            </div>
            <ul className="perks-list">
              {perks.map((perk, index) => (
                <Reveal as="li" key={perk} delaySteps={index} variant="soft">
                  <Check size={18} />
                  {perk}
                </Reveal>
              ))}
            </ul>
          </Reveal>
        </section>

        <section className="subs-plans-band" aria-label="Subscription plans">
          {loadingOffers && <p className="subs-status">Loading subscription plans…</p>}
          {!loadingOffers && plans.length === 0 && (
            <p className="subs-status" role="status">
              {statusMessage || 'No subscription plans are available yet.'}
            </p>
          )}
          {plans.length > 0 && (
            <div className="subs-compose">
              <div className="plan-grid">
                {plans.map((plan, index) => {
                  const selectedLabel = variantLabel(selectedVariant);
                  const planVariant =
                    plan.variants?.find(
                      (variant) => variantLabel(variant) === selectedLabel,
                    ) ||
                    plan.variants?.find((variant) => variant.availableForSale) ||
                    plan.variants?.[0] ||
                    null;
                  const planSellingPlan =
                    plan.sellingPlans?.find((item) => item.label === frequency) ||
                    plan.sellingPlans?.[0] ||
                    null;
                  const pricing = priceDetailsForVariant(
                    plan,
                    planVariant,
                    planSellingPlan?.id,
                  );

                  return (
                    <Reveal
                      as="button"
                      key={plan.id}
                      delaySteps={index}
                      variant="up"
                      type="button"
                      className={`plan-card${selectedPlan === plan.id ? ' selected' : ''}`}
                      onClick={() => selectPlan(plan)}
                    >
                      {plan.featured && <span className="plan-badge">Most popular</span>}
                      <h2>{plan.name}</h2>
                      <div className="plan-price">
                        <div className="plan-price-row">
                          <span className="plan-price-current">{pricing.price}</span>
                          {pricing.compareAtPrice && (
                            <span className="plan-price-compare">{pricing.compareAtPrice}</span>
                          )}
                          {pricing.discountPercent > 0 && (
                            <span className="plan-save">Save {pricing.discountPercent}%</span>
                          )}
                        </div>
                        <small>{plan.interval}</small>
                      </div>
                      <p>{plan.description}</p>
                      {(plan.coffees || []).length > 0 && (
                        <ul>
                          {plan.coffees.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </Reveal>
                  );
                })}
              </div>

              <Reveal className="subs-checkout-panel" delaySteps={2} variant="right">
                <div className="subs-checkout-heading">
                  <p className="eyebrow">Customize</p>
                  <h2>Set your delivery</h2>
                  {activePlan?.name && (
                    <p className="subs-checkout-plan">
                      {activePlan.name}
                      {selectedVariant ? ` · ${variantLabel(selectedVariant)}` : ''}
                    </p>
                  )}
                </div>

                <div className="subs-configure-fields">
                  <label className="subs-field">
                    <span>Grind preference</span>
                    <select
                      value={grindId}
                      disabled={loadingOffers || grindOptions.length === 0}
                      onChange={(event) => setGrindId(event.target.value)}
                    >
                      {loadingOffers && <option value="">Loading…</option>}
                      {!loadingOffers && grindOptions.length === 0 && (
                        <option value="">Unavailable</option>
                      )}
                      {grindOptions.map((option) => (
                        <option
                          key={option.id}
                          value={option.id}
                          disabled={!option.available}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="subs-field">
                    <span>Delivery frequency</span>
                    <select
                      value={frequency}
                      disabled={loadingOffers || frequencyOptions.length === 0}
                      onChange={(event) => setFrequency(event.target.value)}
                    >
                      {loadingOffers && <option value="">Loading…</option>}
                      {!loadingOffers && frequencyOptions.length === 0 && (
                        <option value="">Unavailable</option>
                      )}
                      {frequencyOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {error && (
                  <p className="subs-status subs-status-error" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  className="button subs-checkout-cta"
                  disabled={!canStart || submitting || cartLoading || loadingOffers}
                  onClick={handleStartSubscription}
                >
                  {submitting || cartLoading
                    ? 'Adding…'
                    : loadingOffers
                      ? 'Loading plans…'
                      : canStart
                        ? 'Start subscription'
                        : 'Coming soon'}
                </button>
              </Reveal>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
