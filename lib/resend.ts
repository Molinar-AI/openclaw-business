import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export const sendEmail = async ({ to, subject, text, html, replyTo }: SendEmailParams) => {
  const payload: Parameters<typeof resend.emails.send>[0] = {
    from: 'Molinar Business <noreply@business.molinar.ai>',
    to,
    subject,
    html: html || '',
  };

  if (text) payload.text = text;
  if (replyTo) payload.replyTo = replyTo;

  const { data, error } = await resend.emails.send(payload);

  if (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }

  return data;
};
