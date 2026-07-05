import express from "express";
import Announcement from "../models/Announcement.js";
import { optionalAuth, hasTierAccess } from "../middleware/auth.js";

const router = express.Router();

// @route GET /api/announcements
router.get("/", optionalAuth, async (req, res) => {
  const userTier = req.user ? req.user.tier : "free";
  const all = await Announcement.find().sort({ pinned: -1, createdAt: -1 });
  const visible = all.filter((a) => hasTierAccess(userTier, a.audience === "all" ? "free" : a.audience));
  res.json(visible);
});

export default router;
