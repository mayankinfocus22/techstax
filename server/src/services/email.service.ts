import path from "node:path";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

interface SendEmailParams {
  name: string;
  email: string;
  phone?: string | null;
  expectedDailyRate?: number | null;
  cvFileName: string;
  storageKey: string;
}

export async function sendCandidateEmail(params: SendEmailParams): Promise<void> {
  const { name, email, phone, expectedDailyRate, cvFileName, storageKey } = params;

  // Check if SMTP is configured
  if (!env.SMTP_HOST || !env.SMTP_TO) {
    console.warn(
      "⚠️ SMTP is not configured. Candidate submission received but email not sent:",
      { name, email, phone, expectedDailyRate, cvFileName }
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT || 587,
    secure: (env.SMTP_PORT || 587) === 465,
    auth: env.SMTP_USER && env.SMTP_PASS ? {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    } : undefined,
  });

  const absolutePath = path.resolve(process.cwd(), env.UPLOAD_DIR, storageKey);

  const rateText = expectedDailyRate ? `$${expectedDailyRate} AUD / day` : "Not specified";
  const phoneText = phone || "Not specified";

  const mailOptions = {
    from: env.SMTP_FROM || `"TechStax CV Drop" <noreply@techstax.dev>`,
    to: env.SMTP_TO,
    subject: `New Candidate CV Drop: ${name}`,
    text: `A new candidate has registered interest on TechStax.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phoneText}\nExpected Daily Rate: ${rateText}\nCV File: ${cvFileName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e7eaf1; rounded: 12px;">
        <h2 style="color: #1e40af; border-bottom: 2px solid #edf5ff; padding-bottom: 10px; margin-top: 0;">New Candidate Interest</h2>
        <p>A new candidate has registered interest and uploaded their CV.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 180px; color: #65708a;">Full Name:</td>
            <td style="padding: 8px 0; color: #172033;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #65708a;">Email Address:</td>
            <td style="padding: 8px 0; color: #172033;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #65708a;">Phone Number:</td>
            <td style="padding: 8px 0; color: #172033;">${phoneText}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #65708a;">Expected Daily Rate:</td>
            <td style="padding: 8px 0; color: #172033; font-weight: bold;">${rateText}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #65708a;">CV Filename:</td>
            <td style="padding: 8px 0; color: #172033; font-style: italic;">${cvFileName}</td>
          </tr>
        </table>
        <p style="color: #65708a; font-size: 12px; border-top: 1px solid #e7eaf1; padding-top: 15px; margin-bottom: 0;">
          This submission is attached to this email and saved in the MongoDB database.
        </p>
      </div>
    `,
    attachments: [
      {
        filename: cvFileName,
        path: absolutePath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
  console.log(`✉️ Email successfully sent to ${env.SMTP_TO} for candidate ${name}`);
}
