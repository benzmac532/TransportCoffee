import { useEffect, useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { useCart } from '../components/CartContext';
import { getStaticPageMeta } from '../lib/seoPages';
import { getSubscriptionOffers } from '../lib/shopify';

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

export default function Subscriptions() {
  const { addSubscription, loading: cartLoading } = useCart();
  const [plans, setPlans] = useState([]);
  const [ready, setReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('');
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

  const frequencyOptions = useMemo(() => {
    if (activePlan?.sellingPlans?.length) {
      return activePlan.sellingPlans.map((plan) => plan.label);
    }
    return [];
  }, [activePlan]);

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

  const canStart =
    ready &&
    Boolean(activePlan?.available && activePlan?.merchandiseId && selectedSellingPlan?.id);

  async function handleStartSubscription() {
    if (!canStart || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      await addSubscription({
        merchandiseId: activePlan.merchandiseId,
        quantity: activePlan.quantity || 1,
        sellingPlanId: selectedSellingPlan.id,
      });
    } catch (err) {
      setError(err.message || 'Could not start subscription.');
    } finally {
      setSubmitting(false);
    }
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
          <Reveal className="subs-shipping" variant="up" delaySteps={2}>
            <div className="subs-shipping-copy">
              <p className="eyebrow">Shipping</p>
              <h2>
                Free shipping
                <span>on every delivery.</span>
              </h2>
              <p>Free shipping on every refill. No surprises.</p>
            </div>

            <div className="subscription-options">
              <div className="option-group">
                <h3>Delivery frequency</h3>
                <div className="option-row">
                  {loadingOffers && <p className="subs-freq-empty">Loading frequencies…</p>}
                  {!loadingOffers && frequencyOptions.length === 0 && (
                    <p className="subs-freq-empty">Frequencies appear when a plan is available.</p>
                  )}
                  {frequencyOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`option-pill ${frequency === item ? 'active' : ''}`}
                      onClick={() => setFrequency(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
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
            <div className="plan-grid">
              {plans.map((plan, index) => (
                <Reveal
                  as="button"
                  key={plan.id}
                  delaySteps={index}
                  variant="up"
                  type="button"
                  className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    setFrequency(pickDefaultFrequency(plan.sellingPlans));
                    setError('');
                  }}
                >
                  {plan.featured && <span className="plan-badge">Most popular</span>}
                  <h2>{plan.name}</h2>
                  <div className="plan-price">
                    <div className="plan-price-row">
                      <span className="plan-price-current">{plan.price}</span>
                      {plan.compareAtPrice && (
                        <span className="plan-price-compare">{plan.compareAtPrice}</span>
                      )}
                      {plan.discountPercent > 0 && (
                        <span className="plan-save">Save {plan.discountPercent}%</span>
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
              ))}
            </div>
          )}
        </section>

        <section className="subs-options-band">
          <Reveal className="perks-section" variant="up">
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

            {error && (
              <p className="subs-status subs-status-error" role="alert">
                {error}
              </p>
            )}

            <Reveal delaySteps={perks.length} variant="up">
              <button
                type="button"
                className="button"
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
          </Reveal>
        </section>
      </div>
    </main>
  );
}
