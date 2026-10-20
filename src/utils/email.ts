import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export const sendConfirmationEmail = async (to: string, name: string, message: string) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
      <h2>Thanks, ${escapeHtml(name)}!</h2>
      <p>We received your submission:</p>
      <blockquote style="border-left:4px solid #ddd;padding-left:12px;color:#555">${escapeHtml(message)}</blockquote>
      <p>We'll be in touch soon.</p>
    </div>`;
  const text = `Thanks, ${name}!\n\nWe received your submission:\n"${message}"\n\nWe'll be in touch soon.`;

  await transporter.sendMail({ from: env.EMAIL_FROM, to, subject: "We received your submission", html, text });
};
