import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Module from "../models/Module.js";
import Resource from "../models/Resource.js";
import Announcement from "../models/Announcement.js";
import SiteSettings from "../models/SiteSettings.js";

dotenv.config();
await connectDB();

const run = async () => {
  const adminEmail = "admin@gotocodes.dev";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: "GotoCodes Admin",
      email: adminEmail,
      password: "AdminSid@123",
      role: "admin",
      tier: "premium",
    });
    console.log("Created admin user -> email: admin@gotocodes.dev / password: admin123");
  } else {
    console.log("Admin user already exists -> email: admin@gotocodes.dev / password: admin123");
  }

  await SiteSettings.findOneAndUpdate(
    { key: "main" },
    {
      key: "main",
      aboutText:
        "GotoCodes is a heaven for devs — I turned my own CSE journey, the mistakes and the shortcuts, into roadmaps, notes, and code you can actually follow.",
    },
    { upsert: true }
  );

  const announcementCount = await Announcement.countDocuments();
  if (announcementCount === 0) {
    await Announcement.create({
      title: "Welcome to GotoCodes",
      body: "The platform is live! New lessons drop every week.",
      pinned: true,
      audience: "all",
    });
    console.log("Seeded welcome announcement.");
  }

  console.log("Seed complete. Exiting.");
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
