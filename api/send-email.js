import nodemailer from 'nodemailer';

const MAX_BODY_LENGTH = 12_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sendJson(response, status, payload) {
  response.status(status).json(payload);
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '');

  if (!gmailUser || !gmailPassword) {
    console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD.');
    return sendJson(response, 500, { error: 'Email service is not configured.' });
  }

  const { subject, body, replyTo, website } = request.body || {};

  // Honeypot: bots commonly fill hidden fields. Return success without sending.
  if (website) return sendJson(response, 200, { ok: true });

  if (
    typeof subject !== 'string' ||
    typeof body !== 'string' ||
    typeof replyTo !== 'string' ||
    !subject.trim() ||
    !body.trim() ||
    !EMAIL_PATTERN.test(replyTo) ||
    body.length > MAX_BODY_LENGTH
  ) {
    return sendJson(response, 400, { error: 'Invalid form submission.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    });

    await transporter.sendMail({
      from: `"Transport Coffee Website" <${gmailUser}>`,
      to: gmailUser,
      replyTo,
      subject: subject.replace(/[\r\n]/g, ' ').slice(0, 180),
      text: body,
    });

    return sendJson(response, 200, { ok: true });
  } catch (error) {
    console.error('Gmail submission failed:', error);
    return sendJson(response, 502, {
      error: 'We could not send your message. Please email us directly.',
    });
  }
}
