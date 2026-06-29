import { useState } from 'react';
import { Check } from 'lucide-react';

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
    id: 'daily',
    name: 'Daily Driver',
    price: '$34',
    interval: 'per delivery',
    description: 'Two 12oz bags — perfect for households and heavy brewers.',
    coffees: ['Waypoint Blend + rotating origin', 'Best value for daily drinkers'],
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
  'Save 10% on every subscription order',
  'Free shipping on all deliveries',
  'Pause, skip, or cancel anytime',
  'Early access to limited releases',
];

export default function Subscriptions() {
  const [selectedPlan, setSelectedPlan] = useState('daily');
  const [frequency, setFrequency] = useState('Every 2 weeks');
  const [grind, setGrind] = useState('Whole bean');

  return (
    <main className="page subscriptions-page">
      <section className="page-hero">
        <p className="eyebrow">Subscriptions</p>
        <h1>Fresh coffee on your schedule.</h1>
        <p className="lead">
          Choose a plan, set your frequency, and keep the good stuff moving.
          Subscription checkout is coming soon.
        </p>
      </section>

      <section className="section">
        <div className="plan-grid">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              className={`plan-card ${plan.featured ? 'featured' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
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
            </button>
          ))}
        </div>
      </section>

      <section className="section subscription-options">
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
      </section>

      <section className="section perks-section">
        <div className="section-heading">
          <p className="eyebrow">Member perks</p>
          <h2>Why subscribe?</h2>
        </div>
        <ul className="perks-list">
          {perks.map((perk) => (
            <li key={perk}>
              <Check size={18} />
              {perk}
            </li>
          ))}
        </ul>
        <button type="button" className="button" disabled>
          Start subscription (coming soon)
        </button>
      </section>
    </main>
  );
}
