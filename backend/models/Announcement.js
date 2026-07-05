import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    pinned: { type: Boolean, default: false },
    audience: { type: String, enum: ["all", "basic", "premium"], default: "all" },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
