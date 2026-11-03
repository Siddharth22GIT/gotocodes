import mongoose from "mongoose";

const readingMaterialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // e.g. "Capsule 1", "Capsule 2"
    fileUrl: { type: String, required: true }, // PDF link or data URL
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const moduleShortVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    bannerUrl: { type: String, default: "" },
    instagramLink: { type: String, required: true },
  },
  { timestamps: true }
);

const handwrittenNoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    filePath: { type: String, default: "notes.md" },
    content: { type: String, default: "" },
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
    bannerUrl: { type: String, default: "" },
    icon: { type: String, default: "code" },
    tier: { type: String, enum: ["free", "basic", "premium"], default: "free" },
    readingMaterials: [readingMaterialSchema],
    shortVideos: [moduleShortVideoSchema],
    handwrittenNotes: [handwrittenNoteSchema],
    lessons: [lessonSchema],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Module", moduleSchema);
