import path from "node:path";
import fs from "node:fs/promises";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { getAccessToken } from "./onedrive.service.js";

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

  // 1. Enterprise Microsoft Graph API Email sending (if credentials exist)
  if (env.ONEDRIVE_CLIENT_ID && env.ONEDRIVE_CLIENT_SECRET && env.ONEDRIVE_REFRESH_TOKEN) {
    try {
      console.log(`✉️ Sending candidate email via Microsoft Graph API for ${name}...`);
      const accessToken = await getAccessToken();
      const absolutePath = path.resolve(process.cwd(), env.UPLOAD_DIR, storageKey);
      const fileBuffer = await fs.readFile(absolutePath);
      const base64Content = fileBuffer.toString("base64");

      const rateText = expectedDailyRate ? `$${expectedDailyRate} AUD / day` : "Not specified";
      const phoneText = phone || "Not specified";

      const mailPayload = {
        message: {
          subject: `Latest resume has been dropped: ${name}`,
          body: {
            contentType: "HTML",
            content: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e7eaf1; border-radius: 12px;">
                <h2 style="color: #1e40af; border-bottom: 2px solid #edf5ff; padding-bottom: 10px; margin-top: 0;">Resume Dropped</h2>
                <p>Hi,</p>
                <p>A new resume has been dropped by <strong>${name}</strong>.</p>
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
                  This submission is attached to this email and has been uploaded directly to OneDrive.
                </p>
              </div>
            `
          },
          toRecipients: [
            {
              emailAddress: {
                address: env.SMTP_TO || "contact@techstax.com.au"
              }
            }
          ],
          attachments: [
            {
              "@odata.type": "#microsoft.graph.fileAttachment",
              "name": cvFileName,
              "contentType": "application/octet-stream",
              "contentBytes": base64Content
            }
          ]
        },
        saveToSentItems: "true"
      };

      const sendMailUrl = "https://graph.microsoft.com/v1.0/me/sendMail";
      const response = await fetch(sendMailUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mailPayload),
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error?.message || response.statusText);
      }

      console.log(`✉️ Email successfully sent via Microsoft Graph API to ${env.SMTP_TO} for candidate ${name}`);
      return;
    } catch (graphError: any) {
      console.error("❌ Failed to send email via Microsoft Graph API, falling back to SMTP:", graphError.message);
    }
  }

  // 2. SMTP Legacy Fallback
  if (!env.SMTP_HOST || !env.SMTP_TO) {
    console.warn(
      "⚠️ SMTP is not configured and Microsoft Graph email failed/not set. Candidate submission received but email not sent:",
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
    subject: `Latest resume has been dropped: ${name}`,
    text: `Hi,\n\nA new resume has been dropped by ${name}.\n\nCandidate details:\nName: ${name}\nEmail: ${email}\nPhone: ${phoneText}\nExpected Daily Rate: ${rateText}\nCV File: ${cvFileName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e7eaf1; border-radius: 12px;">
        <h2 style="color: #1e40af; border-bottom: 2px solid #edf5ff; padding-bottom: 10px; margin-top: 0;">Resume Dropped</h2>
        <p>Hi,</p>
        <p>A new resume has been dropped by <strong>${name}</strong>.</p>
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
          This submission is attached to this email and has been uploaded directly to OneDrive.
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
  console.log(`✉️ Email successfully sent via SMTP to ${env.SMTP_TO} for candidate ${name}`);
}

export interface SendBriefParams {
  name: string;
  company: string;
  email: string;
  engagementType: string;
  role: string;
  notes?: string | null;
}

export async function sendBriefEmail(params: SendBriefParams): Promise<void> {
  const { name, company, email, engagementType, role, notes } = params;
  const notesText = notes || "Not specified";

  // 1. Enterprise Microsoft Graph API Email sending (if credentials exist)
  if (env.ONEDRIVE_CLIENT_ID && env.ONEDRIVE_CLIENT_SECRET && env.ONEDRIVE_REFRESH_TOKEN) {
    try {
      console.log(`✉️ Sending company brief email via Microsoft Graph API for ${name} (${company})...`);
      const accessToken = await getAccessToken();

      const mailPayload = {
        message: {
          subject: `New Company Brief Submitted: ${company}`,
          body: {
            contentType: "HTML",
            content: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e7eaf1; border-radius: 12px;">
                <h2 style="color: #d97706; border-bottom: 2px solid #fef3c7; padding-bottom: 10px; margin-top: 0;">Company Brief Received</h2>
                <p>Hi,</p>
                <p>A new client brief has been submitted for <strong>${company}</strong>.</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 180px; color: #65708a;">Contact Name:</td>
                    <td style="padding: 8px 0; color: #172033;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #65708a;">Company:</td>
                    <td style="padding: 8px 0; color: #172033; font-weight: bold;">${company}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #65708a;">Work Email:</td>
                    <td style="padding: 8px 0; color: #172033;"><a href="mailto:${email}" style="color: #d97706; text-decoration: none;">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #65708a;">Engagement Type:</td>
                    <td style="padding: 8px 0; color: #172033;">${engagementType}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #65708a;">Role/Program hiring for:</td>
                    <td style="padding: 8px 0; color: #172033; font-style: italic;">${role}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #65708a; vertical-align: top;">Notes/Context:</td>
                    <td style="padding: 8px 0; color: #172033; white-space: pre-wrap;">${notesText}</td>
                  </tr>
                </table>
              </div>
            `
          },
          toRecipients: [
            {
              emailAddress: {
                address: env.SMTP_TO || "contact@techstax.com.au"
              }
            }
          ]
        },
        saveToSentItems: "true"
      };

      const sendMailUrl = "https://graph.microsoft.com/v1.0/me/sendMail";
      const response = await fetch(sendMailUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mailPayload),
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error?.message || response.statusText);
      }

      console.log(`✉️ Brief Email successfully sent via Microsoft Graph API to ${env.SMTP_TO} for ${company}`);
      return;
    } catch (graphError: any) {
      console.error("❌ Failed to send brief email via Microsoft Graph API, falling back to SMTP:", graphError.message);
    }
  }

  // 2. SMTP Legacy Fallback
  if (!env.SMTP_HOST || !env.SMTP_TO) {
    console.warn(
      "⚠️ SMTP is not configured and Microsoft Graph email failed/not set. Company brief received but email not sent:",
      { name, company, email, engagementType, role, notes }
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

  const mailOptions = {
    from: env.SMTP_FROM || `"TechStax Briefs" <noreply@techstax.dev>`,
    to: env.SMTP_TO,
    subject: `New Company Brief Submitted: ${company}`,
    text: `Hi,\n\nA new client brief has been submitted for ${company}.\n\nDetails:\nContact Name: ${name}\nCompany: ${company}\nWork Email: ${email}\nEngagement Type: ${engagementType}\nRole/Program: ${role}\nNotes: ${notesText}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e7eaf1; border-radius: 12px;">
        <h2 style="color: #d97706; border-bottom: 2px solid #fef3c7; padding-bottom: 10px; margin-top: 0;">Company Brief Received</h2>
        <p>Hi,</p>
        <p>A new client brief has been submitted for <strong>${company}</strong>.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 180px; color: #65708a;">Contact Name:</td>
            <td style="padding: 8px 0; color: #172033;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #65708a;">Company:</td>
            <td style="padding: 8px 0; color: #172033; font-weight: bold;">${company}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #65708a;">Work Email:</td>
            <td style="padding: 8px 0; color: #172033;"><a href="mailto:${email}" style="color: #d97706; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #65708a;">Engagement Type:</td>
            <td style="padding: 8px 0; color: #172033;">${engagementType}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #65708a;">Role/Program hiring for:</td>
            <td style="padding: 8px 0; color: #172033; font-style: italic;">${role}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #65708a; vertical-align: top;">Notes/Context:</td>
            <td style="padding: 8px 0; color: #172033; white-space: pre-wrap;">${notesText}</td>
          </tr>
        </table>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✉️ Brief Email successfully sent via SMTP to ${env.SMTP_TO} for ${company}`);
}

