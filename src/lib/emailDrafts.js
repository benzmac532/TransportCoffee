/**
 * Draft email bodies for site forms.
 * Today: used in mailto: links.
 * Later: same shapes can power a Gmail/SMTP backend that emails transportcoffeeroasters@gmail.com.
 */

export const CONTACT_EMAIL = 'transportcoffeeroasters@gmail.com';

export function buildContactEmail(form) {
  const firstName = String(form.get('firstName') || '').trim();
  const lastName = String(form.get('lastName') || '').trim();
  const email = String(form.get('email') || '').trim();
  const subjectLabel = String(form.get('subject') || 'General inquiry').trim();
  const message = String(form.get('message') || '').trim();
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Website visitor';

  const subject = `Website contact — ${subjectLabel}`;

  const body = [
    'New contact form submission',
    '────────────────────────────────',
    '',
    `Name:     ${fullName}`,
    `Email:    ${email}`,
    `Subject:  ${subjectLabel}`,
    '',
    'Message',
    '────────────────────────────────',
    message || '(No message provided)',
    '',
    '────────────────────────────────',
    'Source: Transport Coffee Roasters website · /contact',
    `Reply to: ${email || CONTACT_EMAIL}`,
  ].join('\n');

  return { to: CONTACT_EMAIL, subject, body, replyTo: email };
}

export function buildWholesaleEmail(form) {
  const firstName = String(form.get('firstName') || '').trim();
  const lastName = String(form.get('lastName') || '').trim();
  const businessName = String(form.get('businessName') || '').trim();
  const email = String(form.get('email') || '').trim();
  const phone = String(form.get('phone') || '').trim() || '—';
  const location = String(form.get('location') || '').trim();
  const businessType = String(form.get('businessType') || '').trim();
  const volume = String(form.get('volume') || '').trim();
  const message = String(form.get('message') || '').trim();
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Website visitor';
  const businessLabel = businessName || 'Unknown business';

  const subject = `Wholesale inquiry — ${businessLabel}`;

  const body = [
    'New wholesale inquiry',
    '────────────────────────────────',
    '',
    'Contact',
    `  Name:           ${fullName}`,
    `  Email:          ${email}`,
    `  Phone:          ${phone}`,
    '',
    'Business',
    `  Business name:  ${businessLabel}`,
    `  Type:           ${businessType || '—'}`,
    `  Location:       ${location || '—'}`,
    `  Monthly volume: ${volume || '—'}`,
    '',
    'Notes',
    '────────────────────────────────',
    message || '(No additional notes)',
    '',
    '────────────────────────────────',
    'Source: Transport Coffee Roasters website · /wholesale',
    `Reply to: ${email || CONTACT_EMAIL}`,
  ].join('\n');

  return { to: CONTACT_EMAIL, subject, body, replyTo: email };
}

export function openMailto({ to, subject, body }) {
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
