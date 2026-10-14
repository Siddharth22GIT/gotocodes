import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found. Please log in again." });
      }
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Session expired or invalid. Please log in again." });
    }
  }

  return res.status(401).json({ message: "Not authorized. Please log in." });
};

// Attaches req.user if a valid token is present, but does not block the request otherwise.
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (err) {
      req.user = null;
    }
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Admin access required." });
};

const tierRank = { free: 0, basic: 1, premium: 2 };

// True if a user's tier meets or exceeds the required tier
export const hasTierAccess = (userTier, requiredTier) => {
  return tierRank[userTier || "free"] >= tierRank[requiredTier || "free"];
};
