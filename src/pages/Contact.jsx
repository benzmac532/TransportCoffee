import { useState } from 'react';
import { Mail, MapPin } from 'lucide-react';
import {
  CONTACT_EMAIL,
  buildContactEmail,
  sendFormEmail,
} from '../lib/emailDrafts';

const subjects = [
  'General inquiry',
  'Order support',
  'Subscriptions',
  'Wholesale',
  'Press / Media',
  'Other',
];

export default function Contact() {
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
      await sendFormEmail(buildContactEmail(formData), String(formData.get('website') || ''));
      setSubmitted(true);
      form.reset();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="page contact-page">
      <div className="contact-mosaic">
        <section className="page-hero">
          <p className="eyebrow">Contact Us</p>
          <h1>Let&apos;s connect.</h1>
        </section>

        <section className="contact-layout">
          <div className="contact-info">
            <h2>Get in touch</h2>
            <p>
              Drop us a line anytime — questions, feedback, or just coffee talk.
              We love hearing from you and we&apos;ll reply soon.
            </p>

            <ul className="contact-details">
              <li>
                <Mail size={20} />
                <div>
                  <strong>Email</strong>
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </div>
              </li>
              <li>
                <MapPin size={20} />
                <div>
                  <strong>Location</strong>
                  <span>The Shoals, AL</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="form-card">
            {submitted ? (
              <div className="form-success">
                <h2>Thanks!</h2>
                <p>
                  We&apos;ll review your message and reply soon. Prefer email?
                  Reach us at{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
              </div>
            ) : (
              <form className="site-form" onSubmit={handleSubmit}>
                <h2>Send a message</h2>

                <label className="form-honeypot" aria-hidden="true">
                  <span>Website</span>
                  <input type="text" name="website" tabIndex="-1" autoComplete="off" />
                </label>

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
                  <span>Email *</span>
                  <input type="email" name="email" required />
                </label>

                <label>
                  <span>Subject *</span>
                  <select name="subject" required defaultValue="">
                    <option value="" disabled>
                      Select a subject
                    </option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Message *</span>
                  <textarea name="message" rows={6} required placeholder="How can we help?" />
                </label>

                {error && <p className="form-error" role="alert">{error}</p>}

                <button type="submit" className="button" disabled={sending}>
                  {sending ? 'Sending…' : 'Email us'}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
