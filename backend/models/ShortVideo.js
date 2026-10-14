import mongoose from "mongoose";

const shortVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    bannerUrl: { type: String, default: "" },
    instagramLink: { type: String, required: true },
    tier: { type: String, enum: ["free", "basic", "premium"], default: "free" },
    order: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("ShortVideo", shortVideoSchema);
