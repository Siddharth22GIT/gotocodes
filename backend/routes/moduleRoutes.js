import express from "express";
import Module from "../models/Module.js";
import { optionalAuth, hasTierAccess } from "../middleware/auth.js";

const router = express.Router();

// Strip lesson content the user isn't entitled to, but still show it exists (locked).
const sanitizeModule = (moduleDoc, userTier) => {
  const mod = moduleDoc.toObject();
  mod.lessons = mod.lessons.map((lesson) => {
    const unlocked = hasTierAccess(userTier, lesson.tier);
    return {
      ...lesson,
      content: unlocked ? lesson.content : "",
      videoUrl: unlocked ? lesson.videoUrl : "",
      locked: !unlocked,
    };
  });
  return mod;
};

// @route GET /api/modules  (list, lightweight)
router.get("/", optionalAuth, async (req, res) => {
  const modules = await Module.find().sort({ order: 1, createdAt: 1 });
  const userTier = req.user ? req.user.tier : "free";
  const result = modules.map((m) => {
    const obj = m.toObject();
    const lessonCount = obj.lessons.length;
    const unlockedCount = obj.lessons.filter((l) => hasTierAccess(userTier, l.tier)).length;
    delete obj.lessons;
    return { ...obj, lessonCount, unlockedCount };
  });
  res.json(result);
});

// @route GET /api/modules/:slug (full detail, tier-gated content)
router.get("/:slug", optionalAuth, async (req, res) => {
  const mod = await Module.findOne({ slug: req.params.slug });
  if (!mod) return res.status(404).json({ message: "Module not found." });
  const userTier = req.user ? req.user.tier : "free";
  res.json(sanitizeModule(mod, userTier));
});

export default router;
