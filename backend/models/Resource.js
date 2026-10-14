import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, required: true }, // e.g. "DSA", "Resume", "Interview", "Project"
    filePath: { type: String, default: "resource.pdf" }, // shown in terminal-card breadcrumb
    fileUrl: { type: String, default: "" }, // link to actual file / drive link
    tier: { type: String, enum: ["free", "basic", "premium"], default: "free" },
    price: { type: Number, default: 0 }, // for one-off sellable resources, in INR
    isSellable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);
