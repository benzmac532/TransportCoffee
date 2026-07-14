import { useState } from 'react';
import {
  CONTACT_EMAIL,
  buildWholesaleEmail,
  openMailto,
} from '../lib/emailDrafts';

const businessTypes = [
  'Café / Coffee Shop',
  'Restaurant',
  'Office / Corporate',
  'Retail / Grocery',
  'Hotel / Hospitality',
  'Other',
];

const volumeOptions = [
  'Under 10 lbs / month',
  '10–25 lbs / month',
  '25–50 lbs / month',
  '50–100 lbs / month',
  '100+ lbs / month',
];

export default function Wholesale() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const draft = buildWholesaleEmail(new FormData(event.currentTarget));
    openMailto(draft);
    setSubmitted(true);
  }

  return (
    <main className="page wholesale-page">
      <div className="wholesale-mosaic">
        <section className="page-hero">
          <p className="eyebrow">Wholesale</p>
          <h1>
            <span>Partnerships that move</span>
            <span>coffee forward.</span>
          </h1>
          <p className="lead">
            Tell us about your business and we&apos;ll be in touch to build a
            wholesale program tailored to your needs.
          </p>
        </section>

        <section className="wholesale-feature">
          <div className="wholesale-photo-col">
            <aside className="wholesale-visual">
              <img
                src="/bean-bins.png"
                alt="Coffee beans in wooden retail bins with tasting notes"
              />
            </aside>
          </div>

          <div className="wholesale-info">
            <p className="eyebrow">Partnerships</p>
            <h2>Who we work with</h2>
            <p>
              We partner with cafés, restaurants, offices, and retailers who care
              about quality, consistency, and the story behind every cup.
            </p>
            <ul className="info-list">
              <li>Freshly roasted, small-batch coffee</li>
              <li>Custom blend and private label options</li>
              <li>Training and brew support for your team</li>
              <li>Flexible delivery schedules</li>
              <li>Competitive wholesale pricing</li>
            </ul>
          </div>
        </section>

        <section className="wholesale-form-band" aria-label="Wholesale inquiry">
          <div className="form-card wholesale-form-card">
            {submitted ? (
              <div className="form-success">
                <h2>Opening email…</h2>
                <p>
                  If your email app didn&apos;t open, reach us directly at{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
              </div>
            ) : (
              <form className="site-form wholesale-inquiry-form" onSubmit={handleSubmit}>
                <h2>Wholesale inquiry</h2>

                <div className="form-row">
                  <label>
                    <span>First name *</span>
                    <input type="text" name="firstName" required />
                  </label>
                  <label>
                    <span>Last name *</span>
                    <input type="text" name="lastName" required />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    <span>Business name *</span>
                    <input type="text" name="businessName" required />
                  </label>
                  <label>
                    <span>City / State *</span>
                    <input type="text" name="location" required />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    <span>Email *</span>
                    <input type="email" name="email" required />
                  </label>
                  <label>
                    <span>Phone</span>
                    <input type="tel" name="phone" />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    <span>Business type *</span>
                    <select name="businessType" required defaultValue="">
                      <option value="" disabled>
                        Select a type
                      </option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Estimated monthly volume *</span>
                    <select name="volume" required defaultValue="">
                      <option value="" disabled>
                        Select volume
                      </option>
                      {volumeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label>
                  <span>Tell us about your needs</span>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Equipment, menu goals, delivery preferences, etc."
                  />
                </label>

                <button type="submit" className="button">
                  Submit inquiry
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
