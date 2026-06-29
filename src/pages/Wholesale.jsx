import { useState } from 'react';

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
    setSubmitted(true);
  }

  return (
    <main className="page wholesale-page">
      <section className="page-hero">
        <p className="eyebrow">Wholesale</p>
        <h1>Partnerships that move coffee forward.</h1>
        <p className="lead">
          Tell us about your business and we&apos;ll be in touch to build a
          wholesale program tailored to your needs.
        </p>
      </section>

      <section className="section wholesale-layout">
        <div className="wholesale-info">
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

        <div className="form-card">
          {submitted ? (
            <div className="form-success">
              <h2>Thank you!</h2>
              <p>
                Your wholesale inquiry has been received. Our team will review your
                details and get back to you within 2–3 business days.
              </p>
            </div>
          ) : (
            <form className="site-form" onSubmit={handleSubmit}>
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

              <label>
                <span>Business name *</span>
                <input type="text" name="businessName" required />
              </label>

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

              <label>
                <span>City / State *</span>
                <input type="text" name="location" required />
              </label>

              <label>
                <span>Tell us about your needs</span>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Equipment, menu goals, delivery preferences, etc."
                />
              </label>

              <button type="submit" className="button primary">
                Submit inquiry
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
