import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    filePath: { type: String, default: "notes.md" }, // shown in the terminal-card breadcrumb
    content: { type: String, default: "" }, // markdown/plain notes or snippet
    videoUrl: { type: String, default: "" },
    tier: { type: String, enum: ["free", "basic", "premium"], default: "free" },
  },
  { timestamps: true }
);

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    language: { type: String, required: true }, // e.g. "C++", "Python", "DSA", "MERN"
    description: { type: String, default: "" },
    icon: { type: String, default: "code" },
    tier: { type: String, enum: ["free", "basic", "premium"], default: "free" }, // default access tier for the module itself
    lessons: [lessonSchema],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Module", moduleSchema);
