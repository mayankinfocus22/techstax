import { Router } from "express";
import { cvRouter } from "./cv.routes.js";
import { briefRouter } from "./brief.routes.js";

export const apiRouter = Router();

apiRouter.use("/cv", cvRouter);
apiRouter.use("/brief", briefRouter);


