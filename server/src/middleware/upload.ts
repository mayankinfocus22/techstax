import { mkdirSync } from "node:fs";
import path from "node:path";
import multer from "multer";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

const resumeDirectory = path.resolve(process.cwd(), env.UPLOAD_DIR, "resumes");
mkdirSync(resumeDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => callback(null, resumeDirectory),
  filename: (_request, file, callback) => {
    const safeBaseName = path.basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-z0-9-_]/gi, "-")
      .replace(/-+/g, "-")
      .toLocaleLowerCase();
    callback(null, Date.now() + "-" + safeBaseName + path.extname(file.originalname).toLocaleLowerCase());
  }
});

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

export const resumeUpload = multer({
  storage,
  limits: { fileSize: env.MAX_UPLOAD_BYTES },
  fileFilter: (_request, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new ApiError(415, "Only PDF and DOCX resumes are supported"));
      return;
    }
    callback(null, true);
  }
}).single("resume");
