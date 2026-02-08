import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { db } from "./db/index.js";
import { users } from "./db/schema/index.js";
import userRoutes from "./routes/users.js";
import walletRoutes from "./routes/wallets.js";
import { logger } from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.request(req.method, req.path, res.statusCode, duration);
  });
  next();
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    await db.select().from(users).limit(1);
    res.json({ status: "healthy", database: "connected" });
  } catch (error) {
    logger.error("Health check failed", error);
    res.status(500).json({ status: "unhealthy", database: "disconnected" });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CaaSi Server",
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/wallets", walletRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error("Unhandled error", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
});
