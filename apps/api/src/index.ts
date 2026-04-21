import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./lib/config.js";
import { healthRouter } from "./routes/health.js";
import { logRouter } from "./routes/log.js";
import { errorHandler } from "./middleware/error.js";

const app = express();

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Routes
app.use(healthRouter);
app.use(logRouter);

// Error handler
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`[modelSIGHTS API] Running on port ${config.PORT}`);
});

export { app };
