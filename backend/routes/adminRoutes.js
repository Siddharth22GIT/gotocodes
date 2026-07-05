import express from "express";
import Module from "../models/Module.js";
import Resource from "../models/Resource.js";
import Announcement from "../models/Announcement.js";
import SiteSettings from "../models/SiteSettings.js";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
router.use(protect, adminOnly);

// ---------- Dashboard summary ----------
router.get("/summary", async (req, res) => {
  const [users, modules, resources, announcements] = await Promise.all([
    User.countDocuments(),
    Module.countDocuments(),
    Resource.countDocuments(),
    Announcement.countDocuments(),
  ]);
  const tierCounts = await User.aggregate([{ $group: { _id: "$tier", count: { $sum: 1 } } }]);
  res.json({ users, modules, resources, announcements, tierCounts });
});

// ---------- Modules CRUD ----------
router.get("/modules", async (req, res) => res.json(await Module.find().sort({ order: 1 })));

router.post("/modules", async (req, res) => {
  try {
    const mod = await Module.create(req.body);
    res.status(201).json(mod);
  } catch (err) {
    res.status(400).json({ message: "Could not create module.", error: err.message });
  }
});

router.put("/modules/:id", async (req, res) => {
  const mod = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!mod) return res.status(404).json({ message: "Module not found." });
  res.json(mod);
});

router.delete("/modules/:id", async (req, res) => {
  await Module.findByIdAndDelete(req.params.id);
  res.json({ message: "Module deleted." });
});

// ---------- Resources CRUD ----------
router.get("/resources", async (req, res) => res.json(await Resource.find().sort({ createdAt: -1 })));

router.post("/resources", async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ message: "Could not create resource.", error: err.message });
  }
});

router.put("/resources/:id", async (req, res) => {
  const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!resource) return res.status(404).json({ message: "Resource not found." });
  res.json(resource);
});

router.delete("/resources/:id", async (req, res) => {
  await Resource.findByIdAndDelete(req.params.id);
  res.json({ message: "Resource deleted." });
});

// ---------- Announcements CRUD ----------
router.get("/announcements", async (req, res) => res.json(await Announcement.find().sort({ createdAt: -1 })));

router.post("/announcements", async (req, res) => {
  const a = await Announcement.create(req.body);
  res.status(201).json(a);
});

router.put("/announcements/:id", async (req, res) => {
  const a = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!a) return res.status(404).json({ message: "Announcement not found." });
  res.json(a);
});

router.delete("/announcements/:id", async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: "Announcement deleted." });
});

// ---------- Site settings ----------
router.put("/settings", async (req, res) => {
  const settings = await SiteSettings.findOneAndUpdate({ key: "main" }, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
  });
  res.json(settings);
});

// ---------- Users (view + manually grant tier) ----------
router.get("/users", async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

router.put("/users/:id/tier", async (req, res) => {
  const { tier, tierExpiresAt } = req.body;
  if (!["free", "basic", "premium"].includes(tier)) {
    return res.status(400).json({ message: "Tier must be free, basic, or premium." });
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { tier, tierExpiresAt: tierExpiresAt || null },
    { new: true }
  ).select("-password");
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json(user);
});

export default router;
