import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    aboutVideoUrl: { type: String, default: "" },
    aboutText: {
      type: String,
      default:
        "GotoCodes is where I turn 8+ years of CSE learning mistakes into shortcuts for you — roadmaps, notes, and code that actually make sense.",
    },
    basicPriceINR: { type: Number, default: 149 },
    premiumPriceINR: { type: Number, default: 349 },
    upiId: { type: String, default: "gotocodes@upi" },
    upiName: { type: String, default: "GotoCodes Education" },
    upiQrUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);
