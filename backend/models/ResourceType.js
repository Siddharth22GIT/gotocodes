import mongoose from "mongoose";

const resourceTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: "file-text" },
    color: { type: String, default: "#6366F1" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("ResourceType", resourceTypeSchema);
