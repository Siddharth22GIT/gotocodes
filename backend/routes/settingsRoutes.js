import express from "express";
import SiteSettings from "../models/SiteSettings.js";

const router = express.Router();

// @route GET /api/settings
router.get("/", async (req, res) => {
  let settings = await SiteSettings.findOne({ key: "main" });
  if (!settings) settings = await SiteSettings.create({ key: "main" });
  res.json(settings);
});

export default router;
