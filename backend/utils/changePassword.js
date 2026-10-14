import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();
await connectDB();

const [email, newPassword] = process.argv.slice(2);

if (!email || !newPassword) {
  console.log("Usage: node utils/changePassword.js <email> <newPassword>");
  process.exit(1);
}

try {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.log(`❌ User with email "${email}" not found.`);
    process.exit(1);
  }

  user.password = newPassword;
  await user.save();
  console.log(`✅ Password successfully updated for ${email}`);
  process.exit(0);
} catch (err) {
  console.error("❌ Error updating password:", err.message);
  process.exit(1);
}
