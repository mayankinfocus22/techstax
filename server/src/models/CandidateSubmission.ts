import mongoose, { Schema, Document } from "mongoose";

export interface ICandidateSubmission extends Document {
  name: string;
  email: string;
  phone?: string | null;
  expectedDailyRate?: number | null;
  cvFileUrl: string;
  cvFileName: string;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSubmissionSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: null, trim: true },
    expectedDailyRate: { type: Number, default: null },
    cvFileUrl: { type: String, required: true },
    cvFileName: { type: String, required: true }
  },
  { timestamps: true }
);

export const CandidateSubmission =
  mongoose.models.CandidateSubmission as mongoose.Model<ICandidateSubmission> ||
  mongoose.model<ICandidateSubmission>("CandidateSubmission", CandidateSubmissionSchema);
