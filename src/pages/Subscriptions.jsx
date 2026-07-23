import { useState } from 'react';
import { Check } from 'lucide-react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { getStaticPageMeta } from '../lib/seoPages';

const pageMeta = getStaticPageMeta('/subscriptions');

const plans = [
  {
    id: 'explorer',
    name: 'Explorer',
    price: '$18',
    interval: 'per delivery',
    description: 'One 12oz bag of our rotating single origin.',
    coffees: ['Rotating single origin', 'Freshly roasted weekly'],
  },
  {
    id: 'wanderlust',
    name: 'Wanderlust',
    price: '$34',
    interval: 'per delivery',
    description: 'Two 12oz bags, perfect for households and heavy brewers.',
    coffees: ['Frequent Flyer + rotating origin', 'Best value for daily drinkers'],
    featured: true,
  },
  {
    id: 'office',
    name: 'Office',
    price: '$72',
    interval: 'per delivery',
    description: 'Five 12oz bags for teams that run on good coffee.',
    coffees: ['Custom blend options', 'Priority roasting schedule'],
  },
];

const frequencies = ['Every week', 'Every 2 weeks', 'Every 4 weeks'];

const perks = [
  '$5 flat-rate shipping on every subscription order',
  'Save on recurring deliveries',
  'Pause, skip, or cancel anytime',
  'Shopify subscription checkout coming soon',
];

export default function Subscriptions() {
  const [selectedPlan, setSelectedPlan] = useState('wanderlust');
  const [frequency, setFrequency] = useState('Every 2 weeks');
  const [grind, setGrind] = useState('Whole bean');

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
                src="/roaster-cooling.png"
                alt="Freshly roasted coffee beans cooling in a roasting bin"
                loading="lazy"
                decoding="async"
              />
            </aside>
          </Reveal>
          <Reveal className="subs-shipping" variant="up" delaySteps={2}>
            <div className="subs-shipping-copy">
              <p className="eyebrow">Shipping</p>
              <h2>
                $5 flat-rate
                <span>on every delivery.</span>
              </h2>
              <p>Flat $5 shipping on every refill with no surprise fees.</p>
            </div>

            <div className="subscription-options">
              <div className="option-group">
                <h3>Delivery frequency</h3>
                <div className="option-row">
                  {frequencies.map((item) => (
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

              <div className="option-group">
                <h3>Grind preference</h3>
                <div className="option-row">
                  {['Whole bean', 'Drip', 'Espresso', 'French press'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`option-pill ${grind === item ? 'active' : ''}`}
                      onClick={() => setGrind(item)}
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
          <div className="plan-grid">
            {plans.map((plan, index) => (
              <Reveal
                as="button"
                key={plan.id}
                delaySteps={index}
                variant="up"
                type="button"
                className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.featured && <span className="plan-badge">Most popular</span>}
                <h2>{plan.name}</h2>
                <p className="plan-price">
                  {plan.price} <small>{plan.interval}</small>
                </p>
                <p>{plan.description}</p>
                <ul>
                  {plan.coffees.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
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
            <Reveal delaySteps={perks.length} variant="up">
              <button type="button" className="button" disabled>
                Start subscription (Coming soon)
              </button>
            </Reveal>
          </Reveal>
        </section>
      </div>
    </main>
  );
}
