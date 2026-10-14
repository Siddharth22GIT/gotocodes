"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Flame,
  Zap,
  Trophy,
  BookOpen,
  Download,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  Shield,
  Layers,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlowCard from "@/components/ui/GlowCard";
import Button3D from "@/components/ui/Button3D";
import ShootingStars from "@/components/ui/ShootingStars";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"modules" | "resources" | "achievements">("modules");

  const enrolledModules = [
    {
      id: "mod-1",
      slug: "dsa-mastery",
      title: "DSA Mastery: 0 to 100",
      progress: 68,
      lessonsDone: 12,
      totalLessons: 18,
      lastActive: "Today",
      category: "DSA",
    },
    {
      id: "mod-2",
      slug: "cpp-stl-blueprint",
      title: "C++ STL Blueprint & Speed",
      progress: 35,
      lessonsDone: 4,
      totalLessons: 11,
      lastActive: "Yesterday",
      category: "C++",
    },
  ];

  const badges = [
    { title: "Bug Hunter", icon: "🐛", desc: "Completed 5 debugging exercises", unlocked: true },
    { title: "Syntax Sorcerer", icon: "🧙‍♂️", desc: "Maintained a 7-day study streak", unlocked: true },
    { title: "DSA Pioneer", icon: "⚡", desc: "Mastered 20 LeetCode patterns", unlocked: true },
    { title: "MERN Architect", icon: "🏗️", desc: "Built fullstack production repo", unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-[var(--ink-900)] text-[var(--mist)] relative">
      <ShootingStars />
      <Navbar />

      <main className="max-w-7xl mx-auto px-5 md:px-8 pt-32 pb-16 relative z-10">
        {/* Welcome & Gamified Stats Header */}
        <div className="mb-10 p-6 md:p-8 rounded-2xl border border-white/10 relative overflow-hidden bg-white/[0.03]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-violet text-xs">
                  {user?.role === "admin" ? "🛡️ Master Admin" : "🧑‍💻 Student"}
                </span>
                <span className="badge badge-violet text-xs uppercase font-bold">
                  {user?.tier || "Free"} Member
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "Space Grotesk" }}>
                Welcome back, {user?.name || "Fellow Dev"}! 🚀
              </h1>
              <p className="text-sm text-neutral-400 max-w-xl">
                Ready to write some code? You&apos;re 320 XP away from leveling up to <strong>Grandmaster Dev</strong>.
              </p>
            </div>

            {/* Gamification Stats: Streak, XP, Level */}
            <div className="flex flex-wrap items-center gap-4 self-stretch sm:self-auto">
              {/* Daily Streak */}
              <div className="flex-1 sm:flex-initial p-4 rounded-xl border border-white/10 bg-white/[0.03] text-center min-w-[120px]">
                <div className="flex items-center justify-center gap-1.5 text-white font-bold text-xl mb-0.5">
                  <Flame size={20} className="animate-pulse" />
                  <span>5 Days</span>
                </div>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Active Streak
                </p>
              </div>

              {/* XP */}
              <div className="flex-1 sm:flex-initial p-4 rounded-xl border border-white/10 bg-white/[0.03] text-center min-w-[120px]">
                <div className="flex items-center justify-center gap-1 text-white font-bold text-xl mb-0.5">
                  <Zap size={20} />
                  <span>1,680 XP</span>
                </div>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Level 4 Wizard
                </p>
              </div>

              {/* Badges Count */}
              <div className="flex-1 sm:flex-initial p-4 rounded-xl border border-white/10 bg-white/[0.03] text-center min-w-[120px]">
                <div className="flex items-center justify-center gap-1.5 text-white font-bold text-xl mb-0.5">
                  <Trophy size={18} />
                  <span>3 / 4</span>
                </div>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Badges Earned
                </p>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-neutral-400">Level 4: Syntax Sorcerer</span>
              <span className="text-white">1,680 / 2,000 XP</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 bg-white"
                style={{ width: "84%" }}
              />
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("modules")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "modules"
                ? "bg-white text-black shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <BookOpen size={16} /> My Modules ({enrolledModules.length})
          </button>

          <button
            onClick={() => setActiveTab("achievements")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "achievements"
                ? "bg-white text-black shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Trophy size={16} /> Badges & XP
          </button>
        </div>

        {/* Tab 1: Enrolled Modules */}
        {activeTab === "modules" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {enrolledModules.map((mod) => (
                <GlowCard key={mod.id} className="p-6 rounded-xl border border-white/10 hover:border-white/30">
                  <div className="flex items-start justify-between mb-4">
                    <span className="badge badge-violet text-xs">{mod.category}</span>
                    <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                      <Clock size={12} /> {mod.lastActive}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "Space Grotesk" }}>
                    {mod.title}
                  </h3>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs font-semibold text-neutral-400">
                      <span>Progress</span>
                      <span>{mod.progress}% ({mod.lessonsDone}/{mod.totalLessons} lessons)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-white"
                        style={{ width: `${mod.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-xs text-white/80 flex items-center gap-1">
                      <CheckCircle2 size={13} /> On track
                    </span>
                    <Link href={`/modules/${mod.slug}`}>
                      <Button3D size="sm">
                        Continue Learning <ArrowRight size={14} className="ml-1" />
                      </Button3D>
                    </Link>
                  </div>
                </GlowCard>
              ))}
            </div>

            {/* Quick Explore CTA */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white mb-1">Looking for more roadmaps & notes?</h4>
                <p className="text-xs text-neutral-400">
                  Explore full library of DSA, System Design, and MERN notes.
                </p>
              </div>
              <Link href="/#modules">
                <Button3D variant="ghost" size="sm">
                  Browse All Modules
                </Button3D>
              </Link>
            </div>
          </div>
        )}

        {/* Tab 2: Achievements / Badges */}
        {activeTab === "achievements" && (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((b) => (
              <GlowCard
                key={b.title}
                className={`p-6 text-center rounded-xl border border-white/10 ${!b.unlocked ? "opacity-50 grayscale" : ""}`}
              >
                <div className="text-4xl mb-3">{b.icon}</div>
                <h4 className="font-bold text-white text-base mb-1" style={{ fontFamily: "Space Grotesk" }}>
                  {b.title}
                </h4>
                <p className="text-xs text-neutral-400 mb-4">{b.desc}</p>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded uppercase ${
                    b.unlocked
                      ? "bg-white/15 text-white border border-white/30"
                      : "bg-white/5 text-neutral-500 border border-white/10"
                  }`}
                >
                  {b.unlocked ? "Unlocked ✓" : "Locked 🔒"}
                </span>
              </GlowCard>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
