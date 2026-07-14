import { useState } from 'react';
import { Mail, MapPin } from 'lucide-react';
import {
  CONTACT_EMAIL,
  buildContactEmail,
  openMailto,
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

  function handleSubmit(event) {
    event.preventDefault();
    const draft = buildContactEmail(new FormData(event.currentTarget));
    openMailto(draft);
    setSubmitted(true);
  }

  return (
    <main className="page contact-page">
      <section className="page-hero">
        <p className="eyebrow">Contact Us</p>
        <h1>Let&apos;s connect.</h1>
        <p className="lead">
          Questions, feedback, or just want to talk coffee? Reach us anytime at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <section className="section contact-layout">
        <div className="contact-info">
          <h2>Get in touch</h2>
          <p>
            Send a note through the form and we&apos;ll get back to you directly.
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

              <button type="submit" className="button">
                Email us
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
