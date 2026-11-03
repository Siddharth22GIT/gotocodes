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

import User from "./models/User.js";
import ResourceType from "./models/ResourceType.js";
import ShortVideo from "./models/ShortVideo.js";

// Ensure default admin user exists
const initAdmin = async () => {
  try {
    const adminEmail = "admin@gotocodes.dev";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      await User.create({
        name: "GotoCodes Admin",
        email: adminEmail,
        password: "AdminSid@123",
        role: "admin",
        tier: "premium",
      });
      console.log("Admin account created: admin@gotocodes.dev");
    } else {
      console.log("Admin account ready: admin@gotocodes.dev");
    }
  } catch (e) {
    // DB not connected or network pending
  }
};
setTimeout(initAdmin, 3000);

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "gotocodes-api" }));

// Public Resource Types and Short Videos
app.get("/api/resource-types", async (req, res) => {
  try {
    const types = await ResourceType.find().sort({ createdAt: 1 });
    res.json(types);
  } catch (err) {
    res.json([]);
  }
});

app.get("/api/shortvideos", async (req, res) => {
  try {
    const videos = await ShortVideo.find().sort({ order: 1, createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.json([]);
  }
});

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
