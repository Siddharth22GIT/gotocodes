import express from "express";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, avatarSeed } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are all required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const isAdmin = normalizedEmail === "admin@gotocodes.dev";
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: isAdmin ? "admin" : "student",
      tier: isAdmin ? "premium" : "free",
      avatarSeed: avatarSeed || (isAdmin ? "admin-crown" : "pixel-wizard"),
    });
    res.status(201).json({ user: user.toSafeObject(), token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: "Could not create account.", error: err.message });
  }
});

// @route POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || "").toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });

    // Auto-create default admin account on first login attempt if missing from database
    if (!user && normalizedEmail === "admin@gotocodes.dev" && (password === "AdminSid@123" || password === "admin123")) {
      user = await User.create({
        name: "GotoCodes Admin",
        email: "admin@gotocodes.dev",
        password: "AdminSid@123",
        role: "admin",
        tier: "premium",
      });
    }

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }
    res.json({ user: user.toSafeObject(), token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
});

// @route GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  res.json({ user: req.user.toSafeObject ? req.user.toSafeObject() : req.user });
});

// @route PUT /api/auth/profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, avatarSeed } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (name && name.trim()) user.name = name.trim();
    if (avatarSeed) user.avatarSeed = avatarSeed;

    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: "Could not update profile.", error: err.message });
  }
});

// @route PUT /api/auth/change-password
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ message: "Current password is required." });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: "Current password does not match." });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Could not update password.", error: err.message });
  }
});

export default router;
