import type { Request, Response } from "express";
import { z } from "zod";
import { sendBriefEmail } from "../services/email.service.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/response.js";

const submitBriefSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  company: z.string().trim().min(2, "Company must be at least 2 characters"),
  email: z.string().trim().email("Please provide a valid email address"),
  engagementType: z.string().trim().min(1, "Please specify engagement type"),
  role: z.string().trim().min(2, "Please specify role or program hiring for"),
  notes: z.string().trim().optional().nullable()
});

export const submitBrief = asyncHandler(async (request: Request, response: Response) => {
  const validationResult = submitBriefSchema.safeParse(request.body);
  if (!validationResult.success) {
    throw new ApiError(400, validationResult.error.errors[0].message);
  }

  const { name, company, email, engagementType, role, notes } = validationResult.data;

  await sendBriefEmail({
    name,
    company,
    email,
    engagementType,
    role,
    notes
  });

  return sendSuccess(response, {
    message: "Thank you! Your company brief has been successfully registered."
  }, 201);
});
