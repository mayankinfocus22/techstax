import { Router } from "express";
import { submitCv } from "../controllers/cv.controller.js";
import { resumeUpload } from "../middleware/upload.js";

const router = Router();

router.post("/submit", resumeUpload, submitCv);

export { router as cvRouter };
