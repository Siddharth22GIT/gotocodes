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
      password: "admin123",
      role: "admin",
      tier: "premium",
    });
    console.log("Created admin user -> email: admin@gotocodes.dev / password: admin123");
  } else {
    console.log("Admin user already exists.");
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

  const moduleCount = await Module.countDocuments();
  if (moduleCount === 0) {
    await Module.insertMany([
      {
        title: "DSA Roadmap",
        slug: "dsa-roadmap",
        language: "DSA",
        description: "Arrays to graphs, structured the way I wish someone had taught me.",
        tier: "free",
        order: 1,
        lessons: [
          { title: "Arrays & Strings", filePath: "dsa/01_arrays.md", content: "# Arrays\nStart here...", tier: "free" },
          { title: "Recursion & Backtracking", filePath: "dsa/02_recursion.md", content: "# Recursion\n...", tier: "basic" },
          { title: "Graphs & DP", filePath: "dsa/03_graphs_dp.md", content: "# Graphs & DP\n...", tier: "premium" },
        ],
      },
      {
        title: "C++ Fundamentals",
        slug: "cpp-fundamentals",
        language: "C++",
        description: "The C++ every CSE student needs before touching DSA.",
        tier: "free",
        order: 2,
        lessons: [
          { title: "Setup & Syntax", filePath: "cpp/01_setup.md", content: "# Setup\n...", tier: "free" },
          { title: "STL Deep Dive", filePath: "cpp/02_stl.md", content: "# STL\n...", tier: "basic" },
        ],
      },
      {
        title: "MERN Stack Projects",
        slug: "mern-projects",
        language: "MERN",
        description: "Ship full-stack projects that actually belong on your resume.",
        tier: "premium",
        order: 3,
        lessons: [
          { title: "Project Architecture", filePath: "mern/01_architecture.md", content: "# Architecture\n...", tier: "premium" },
        ],
      },
    ]);
    console.log("Seeded sample modules.");
  }

  const resourceCount = await Resource.countDocuments();
  if (resourceCount === 0) {
    await Resource.insertMany([
      { title: "CSE Roadmap Cheat Sheet", category: "Roadmap", filePath: "roadmap.pdf", tier: "free", fileUrl: "#" },
      { title: "Resume Template (ATS-friendly)", category: "Career", filePath: "resume.docx", tier: "basic", fileUrl: "#" },
      { title: "300 DSA Interview Questions", category: "DSA", filePath: "dsa-300.pdf", tier: "premium", fileUrl: "#" },
    ]);
    console.log("Seeded sample resources.");
  }

  const announcementCount = await Announcement.countDocuments();
  if (announcementCount === 0) {
    await Announcement.create({
      title: "Welcome to GotoCodes",
      body: "The platform is live! New DSA lessons drop every week.",
      pinned: true,
      audience: "all",
    });
    console.log("Seeded welcome announcement.");
  }

  console.log("Seeding complete.");
  process.exit(0);
};

run();
