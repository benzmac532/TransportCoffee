import { useState } from 'react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { getStaticPageMeta } from '../lib/seoPages';
import {
  CONTACT_EMAIL,
  buildWholesaleEmail,
  sendFormEmail,
} from '../lib/emailDrafts';

const pageMeta = getStaticPageMeta('/wholesale');

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
  '10-25 lbs / month',
  '25-50 lbs / month',
  '50-100 lbs / month',
  '100+ lbs / month',
];

export default function Wholesale() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSending(true);
    setError('');

    try {
      await sendFormEmail(buildWholesaleEmail(formData), String(formData.get('website') || ''));
      setSubmitted(true);
      form.reset();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="page wholesale-page">
      <Seo title={pageMeta.title} description={pageMeta.description} path={pageMeta.path} />
      <div className="wholesale-mosaic">
        <PageHero
          eyebrow="Wholesale"
          titleLines={['Partnerships that move', 'coffee forward']}
        />

        <section className="wholesale-feature">
          <Reveal className="wholesale-photo-col" variant="left" delaySteps={1}>
            <aside className="wholesale-visual">
              <img
                src="/bean-bins.png"
                alt="Coffee beans in wooden retail bins with tasting notes"
                loading="lazy"
                decoding="async"
              />
            </aside>
          </Reveal>

          <Reveal className="wholesale-info" variant="up" delaySteps={2}>
            <div className="wholesale-info-copy">
              <p className="eyebrow">Partnerships</p>
              <h2>Who we work with</h2>
              <p>
                We partner with cafés, restaurants, offices, and retailers who care
                about quality, consistency, and the story behind every cup.
              </p>
            </div>
            <ul className="info-list">
              <li>Freshly roasted, small-batch coffee</li>
              <li>Custom blend and private label options</li>
              <li>Training and brew support for your team</li>
              <li>Flexible delivery schedules</li>
              <li>Competitive wholesale pricing</li>
            </ul>
          </Reveal>
        </section>

        <section className="wholesale-form-band" aria-label="Wholesale inquiry">
          <Reveal className="form-card wholesale-form-card" variant="up">
            {submitted ? (
              <div className="form-success">
                <h2>Thanks!</h2>
                <p>
                  We&apos;ll review your inquiry and reply soon. Prefer email?
                  Reach us at{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
              </div>
            ) : (
              <form className="site-form wholesale-inquiry-form" onSubmit={handleSubmit}>
                <h2>Wholesale inquiry</h2>

                <label className="form-honeypot" aria-hidden="true">
                  <span>Website</span>
                  <input type="text" name="website" tabIndex="-1" autoComplete="off" />
                </label>

                <div className="form-row">
                  <label>
                    <span>First name *</span>
                    <input type="text" name="firstName" autoComplete="given-name" required />
                  </label>
                  <label>
                    <span>Last name *</span>
                    <input type="text" name="lastName" autoComplete="family-name" required />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    <span>Business name *</span>
                    <input type="text" name="businessName" autoComplete="organization" required />
                  </label>
                  <label>
                    <span>City / State *</span>
                    <input
                      type="text"
                      name="location"
                      autoComplete="address-level2"
                      required
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    <span>Email *</span>
                    <input type="email" name="email" autoComplete="email" required />
                  </label>
                  <label>
                    <span>Phone</span>
                    <input type="tel" name="phone" autoComplete="tel" />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    <span>Business type *</span>
                    <select name="businessType" autoComplete="off" required defaultValue="">
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
                    <select name="volume" autoComplete="off" required defaultValue="">
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
                    autoComplete="off"
                  />
                </label>

                {error && <p className="form-error" role="alert">{error}</p>}

                <button type="submit" className="button" disabled={sending}>
                  {sending ? 'Sending…' : 'Submit inquiry'}
                </button>
              </form>
            )}
          </Reveal>
        </section>
      </div>
    </main>
  );
}
