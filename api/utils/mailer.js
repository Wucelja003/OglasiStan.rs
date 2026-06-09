import { Resend } from 'resend';

let resend = null;

const getResend = () => {
  if (resend) return resend;

  if (!process.env.RESEND_API_KEY) {
    throw new Error(
      'Email nije konfigurisan. Postavi RESEND_API_KEY u .env.'
    );
  }

  resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
};

export const sendMail = async ({ to, replyTo, subject, text, html }) => {
  const client = getResend();
  // EMAIL_FROM mora biti adresa na verifikovanom domenu, npr. "OglasiStan <noreply@oglasistan.com>"
  const from = process.env.EMAIL_FROM || 'OglasiStan <noreply@oglasistan.com>';

  const { data, error } = await client.emails.send({
    from,
    to,
    replyTo,
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message || 'Greška pri slanju mejla.');
  }

  return data;
};
