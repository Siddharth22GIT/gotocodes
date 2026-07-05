import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    tier: { type: String, enum: ["free", "basic", "premium"], default: "free" },
    tierExpiresAt: { type: Date, default: null },
    avatarSeed: { type: String, default: () => Math.random().toString(36).slice(2, 10) },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    tier: this.tier,
    tierExpiresAt: this.tierExpiresAt,
    avatarSeed: this.avatarSeed,
    createdAt: this.createdAt,
  };
};

export default mongoose.model("User", userSchema);
