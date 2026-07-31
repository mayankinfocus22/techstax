import type { Request, Response } from "express";
import { z } from "zod";
import fs from "node:fs/promises";
import { sendCandidateEmail } from "../services/email.service.js";
import { uploadFileToOneDrive } from "../services/onedrive.service.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/response.js";

const submitCvSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please provide a valid email address"),
  phone: z.string().trim().optional().nullable(),
  expectedDailyRate: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() !== "") {
      const parsed = Number.parseInt(val, 10);
      return isNaN(parsed) ? undefined : parsed;
    }
    return val;
  }, z.number().int().positive().optional().nullable())
});

export const submitCv = asyncHandler(async (request: Request, response: Response) => {
  const file = request.file;
  if (!file) {
    throw new ApiError(400, "Please upload your CV (PDF or DOCX format)");
  }

  // Validate fields
  const validationResult = submitCvSchema.safeParse(request.body);
  if (!validationResult.success) {
    try {
      await fs.unlink(file.path);
    } catch (cleanupErr) {
      console.error("❌ Failed to clean up file after validation error:", cleanupErr);
    }
    throw new ApiError(400, validationResult.error.errors[0].message);
  }

  const { name, email, phone, expectedDailyRate } = validationResult.data;
  const cvFileName = file.originalname;

  let emailSent = false;
  let oneDriveUploaded = false;

  // 1. Route to Email Inbox (Nodemailer or Graph API)
  try {
    await sendCandidateEmail({
      name,
      email,
      phone,
      expectedDailyRate,
      cvFileName,
      storageKey: "resumes/" + file.filename
    });
    emailSent = true;
  } catch (emailError) {
    console.error("❌ Failed to send candidate email:", emailError);
  }

  // 2. Populate OneDrive candidate database
  let oneDriveResult;
  try {
    const fileBuffer = await fs.readFile(file.path);
    oneDriveResult = await uploadFileToOneDrive(fileBuffer, file.originalname);
    oneDriveUploaded = true;
  } catch (oneDriveError) {
    console.error("❌ Failed to upload CV to OneDrive due to permission or policy blocks:", oneDriveError);
  }

  // Cleanup: Only delete the local file if it was safely saved in OneDrive or sent via email.
  // Otherwise, keep the local file in the uploads directory as a fallback backup.
  if (oneDriveUploaded || emailSent) {
    try {
      await fs.unlink(file.path);
    } catch (cleanupError) {
      console.error("❌ Failed to clean up local temporary file:", cleanupError);
    }
  } else {
    console.warn(`⚠️ Both email and OneDrive upload failed. Keeping CV local backup at: ${file.path}`);
  }

  return sendSuccess(response, {
    message: "Thank you! Your interest and CV have been successfully registered.",
    id: oneDriveResult?.id || "local-backup"
  }, 201);
});
