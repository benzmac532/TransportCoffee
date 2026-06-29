import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

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
    setSubmitted(true);
  }

  return (
    <main className="page contact-page">
      <section className="page-hero">
        <p className="eyebrow">Contact Us</p>
        <h1>Let&apos;s connect.</h1>
        <p className="lead">
          Questions, feedback, or just want to talk coffee? We&apos;d love to hear
          from you.
        </p>
      </section>

      <section className="section contact-layout">
        <div className="contact-info">
          <h2>Get in touch</h2>
          <p>
            Reach out by email, phone, or the form — we typically respond within
            1–2 business days.
          </p>

          <ul className="contact-details">
            <li>
              <Mail size={20} />
              <div>
                <strong>Email</strong>
                <a href="mailto:hello@transportcoffee.com">hello@transportcoffee.com</a>
              </div>
            </li>
            <li>
              <Phone size={20} />
              <div>
                <strong>Phone</strong>
                <a href="tel:+15551234567">(555) 123-4567</a>
              </div>
            </li>
            <li>
              <MapPin size={20} />
              <div>
                <strong>Location</strong>
                <span>Savannah, Georgia</span>
              </div>
            </li>
          </ul>

          <div className="hours-card">
            <h3>Hours</h3>
            <p>Monday – Friday: 8am – 5pm</p>
            <p>Saturday: 9am – 2pm</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        <div className="form-card">
          {submitted ? (
            <div className="form-success">
              <h2>Message sent!</h2>
              <p>
                Thanks for reaching out. We&apos;ll get back to you as soon as we
                can.
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
                Send message
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
