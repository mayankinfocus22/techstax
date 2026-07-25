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

  // 1. Route to Email Inbox (Nodemailer)
  try {
    await sendCandidateEmail({
      name,
      email,
      phone,
      expectedDailyRate,
      cvFileName,
      storageKey: "resumes/" + file.filename
    });
  } catch (emailError) {
    console.error("❌ Failed to send candidate email:", emailError);
  }

  // 2. Populate OneDrive candidate database and cleanup local file
  let oneDriveResult;
  try {
    const fileBuffer = await fs.readFile(file.path);
    oneDriveResult = await uploadFileToOneDrive(fileBuffer, file.originalname);
  } finally {
    try {
      await fs.unlink(file.path);
    } catch (cleanupError) {
      console.error("❌ Failed to clean up local temporary file:", cleanupError);
    }
  }

  return sendSuccess(response, {
    message: "Thank you! Your interest and CV have been successfully registered.",
    id: oneDriveResult?.id || "unknown"
  }, 201);
});
