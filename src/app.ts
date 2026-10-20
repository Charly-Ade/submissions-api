import express from "express";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import submissionsRouter from "./routes/submissions";

const app = express();

app.use(requestLogger);   // 1. global logger, before routes
app.use(express.json());
app.get("/", (_req, res) => {
  res.json({ success: true, message: "Submissions API is running" });
});

app.use("/submissions", submissionsRouter);

app.use(notFound);        // 2. catch-all 404, after routes
app.use(errorHandler);    // 3. centralized error handler, last

export default app;
