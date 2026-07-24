import { Router } from "express";
import { cvRouter } from "./cv.routes.js";

export const apiRouter = Router();

apiRouter.use("/cv", cvRouter);


