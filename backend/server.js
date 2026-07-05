import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "gotocodes-api" }));

app.use("/api/auth", authRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found." }));

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`GotoCodes API running on http://localhost:${PORT}`));
