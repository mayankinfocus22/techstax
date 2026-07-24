import type { Request, Response } from "express";
import { z } from "zod";
import { CandidateSubmission } from "../models/CandidateSubmission.js";
import { sendCandidateEmail } from "../services/email.service.js";
import { addCandidateToNotion } from "../services/notion.service.js";
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
    throw new ApiError(400, validationResult.error.errors[0].message);
  }

  const { name, email, phone, expectedDailyRate } = validationResult.data;
  const cvFileUrl = "/uploads/resumes/" + file.filename;
  const cvFileName = file.originalname;

  // 1. Save locally to MongoDB
  const submission = await CandidateSubmission.create({
    name,
    email,
    phone,
    expectedDailyRate,
    cvFileUrl,
    cvFileName
  });

  // 2. Route to Email Inbox (Nodemailer)
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

  // 3. Populate Notion candidate database
  try {
    const backendBaseUrl = `${request.protocol}://${request.get("host")}`;
    const absoluteCvUrl = backendBaseUrl + cvFileUrl;

    await addCandidateToNotion({
      name,
      email,
      phone,
      expectedDailyRate,
      cvUrl: absoluteCvUrl
    });
  } catch (notionError) {
    console.error("❌ Failed to populate Notion database:", notionError);
  }

  return sendSuccess(response, {
    message: "Thank you! Your interest and CV have been successfully registered.",
    id: submission._id.toString()
  }, 201);
});
