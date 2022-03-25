import nodemailer from 'nodemailer';
import { Logger } from '@milkbox/common-components-backend';
import { SmtpCredentials } from '../types/SmtpCredentials';

const log = Logger(module);

const smtpCreds: SmtpCredentials = {
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT!, 10) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  user: process.env.SMTP_USER || '',
  password: process.env.SMTP_PASS || '',
  name: process.env.SMTP_FROM_NAME || '',
  email: process.env.SMTP_FROM_EMAIL || '',
};

const reqs = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS'];
const mustBeSet = reqs.filter((r) => !process.env[r]);
if (mustBeSet.length > 0) {
  log.warn(`${mustBeSet.join(', ')} must be set`);
}

export async function sendMail(email: string, subject: string, body: string) {
  try {
    if (process.env.NODE_ENV === 'development' && smtpCreds.user === '') {
      log.info(`before email ${process.env.NODE_ENV}`, smtpCreds);
      const testAccount = await nodemailer.createTestAccount();
      smtpCreds.user = testAccount.user;
      smtpCreds.password = testAccount.pass;
    }

    log.info('Creds', smtpCreds);

    const transporter = nodemailer.createTransport({
      host: smtpCreds.host,
      port: smtpCreds.port,
      secure: smtpCreds.secure, // true for 465, false for other ports
      auth: {
        user: smtpCreds.user,
        pass: smtpCreds.password,
      },
    });
    const info = await transporter.sendMail({
      from: `"${smtpCreds.name}" <${smtpCreds.email}>`, // sender address
      to: email, // list of receivers, coma separated
      subject,
      html: body, // html body
    });

    log.info('Message sent: %s', info.messageId);

    log.info('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error: any) {
    log.error(error.message, error.stack);
    throw error;
  }
}
