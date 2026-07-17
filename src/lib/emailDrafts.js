/**
 * Email payloads for the Contact and Wholesale forms.
 * Submissions are sent through the server-side Gmail endpoint.
 */

export const CONTACT_EMAIL = 'transportcoffeeroasters@gmail.com';

const EMPTY_FIELD = 'Not provided';

export function buildContactEmail(form) {
  const firstName = String(form.get('firstName') || '').trim();
  const lastName = String(form.get('lastName') || '').trim();
  const email = String(form.get('email') || '').trim();
  const subjectLabel = String(form.get('subject') || 'General inquiry').trim();
  const message = String(form.get('message') || '').trim();
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Website visitor';

  const subject = `Website contact: ${subjectLabel}`;

  const body = [
    'New contact form submission',
    '',
    `Name:     ${fullName}`,
    `Email:    ${email}`,
    `Subject:  ${subjectLabel}`,
    '',
    'Message',
    message || '(No message provided)',
    '',
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
  const phone = String(form.get('phone') || '').trim() || EMPTY_FIELD;
  const location = String(form.get('location') || '').trim();
  const businessType = String(form.get('businessType') || '').trim();
  const volume = String(form.get('volume') || '').trim();
  const message = String(form.get('message') || '').trim();
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Website visitor';
  const businessLabel = businessName || 'Unknown business';

  const subject = `Wholesale inquiry: ${businessLabel}`;

  const body = [
    'New wholesale inquiry',
    '',
    'Contact',
    `  Name:           ${fullName}`,
    `  Email:          ${email}`,
    `  Phone:          ${phone}`,
    '',
    'Business',
    `  Business name:  ${businessLabel}`,
    `  Type:           ${businessType || EMPTY_FIELD}`,
    `  Location:       ${location || EMPTY_FIELD}`,
    `  Monthly volume: ${volume || EMPTY_FIELD}`,
    '',
    'Notes',
    message || '(No additional notes)',
    '',
    'Source: Transport Coffee Roasters website · /wholesale',
    `Reply to: ${email || CONTACT_EMAIL}`,
  ].join('\n');

  return { to: CONTACT_EMAIL, subject, body, replyTo: email };
}

export async function sendFormEmail({ subject, body, replyTo }, website = '') {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject, body, replyTo, website }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'We could not send your message. Please try again.');
  }

  return result;
}
