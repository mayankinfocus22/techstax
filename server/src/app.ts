import path from "node:path";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      env.CLIENT_URL,
      /^https:\/\/.*\.vercel\.app$/,
      "https://techstax.com.au",
      "https://www.techstax.com.au",
      "http://localhost:5173",
    ];
    if (!origin) return callback(null, true);
    const isAllowed = allowed.some((pattern) =>
      typeof pattern === "string" ? pattern === origin : pattern.test(origin)
    );
    callback(isAllowed ? null : new Error("Not allowed by CORS"), isAllowed);
  },
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/uploads", express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)));

app.get("/health", (_request, response) => {
  response.status(200).json({
    success: true,
    data: { status: "ok", timestamp: new Date().toISOString() }
  });
});

app.use("/api/v1", apiRouter);
app.use(notFound);
app.use(errorHandler);
