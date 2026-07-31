import { Router } from "express";
import { submitBrief } from "../controllers/brief.controller.js";

const router = Router();

router.post("/submit", submitBrief);

export { router as briefRouter };
