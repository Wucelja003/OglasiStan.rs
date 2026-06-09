import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      'Email nije konfigurisan. Postavi EMAIL_USER i EMAIL_PASS u .env (Gmail app password).'
    );
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

export const sendMail = async ({ to, replyTo, subject, text, html }) => {
  const t = getTransporter();
  return t.sendMail({
    from: `"OglasiStan" <${process.env.EMAIL_USER}>`,
    to,
    replyTo,
    subject,
    text,
    html,
  });
};
