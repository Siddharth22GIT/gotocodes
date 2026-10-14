import express from "express";
import Resource from "../models/Resource.js";
import { optionalAuth, hasTierAccess } from "../middleware/auth.js";

const router = express.Router();

// @route GET /api/resources
router.get("/", optionalAuth, async (req, res) => {
  const resources = await Resource.find().sort({ createdAt: -1 });
  const userTier = req.user ? req.user.tier : "free";
  const result = resources.map((r) => {
    const obj = r.toObject();
    const unlocked = hasTierAccess(userTier, obj.tier);
    return { ...obj, fileUrl: unlocked ? obj.fileUrl : "", locked: !unlocked };
  });
  res.json(result);
});

// @route GET /api/resources/:id
router.get("/:id", optionalAuth, async (req, res) => {
  const r = await Resource.findById(req.params.id);
  if (!r) return res.status(404).json({ message: "Resource not found." });
  const userTier = req.user ? req.user.tier : "free";
  const obj = r.toObject();
  const unlocked = hasTierAccess(userTier, obj.tier);
  res.json({ ...obj, fileUrl: unlocked ? obj.fileUrl : "", locked: !unlocked });
});

export default router;
