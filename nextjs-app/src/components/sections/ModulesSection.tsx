"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, Lock, Star, Plus } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";

interface Module {
  _id: string;
  title: string;
  slug: string;
  language: string;
  description: string;
  bannerUrl?: string;
  tier: "free" | "basic" | "premium";
  lessons?: { _id?: string }[];
  lessonCount?: number;
  unlockedCount?: number;
  order?: number;
}

const tierColors = {
  free: { badge: "badge-free", text: "Free" },
  basic: { badge: "badge-basic", text: "Basic" },
  premium: { badge: "badge-premium", text: "Premium" },
};

const langGradients: Record<string, string> = {
  "c++": "from-[#333333] to-[#AAAAAA]",
  python: "from-[#222222] to-[#888888]",
  javascript: "from-[#444444] to-[#CCCCCC]",
  dsa: "from-[#111111] to-[#777777]",
  mern: "from-[#333333] to-[#DDDDDD]",
  default: "from-[#1A1A1A] to-[#666666]",
};

function getGradient(lang: string) {
  return langGradients[lang?.toLowerCase()] || langGradients.default;
}

interface ModulesSectionProps {
  modules: Module[];
  onOpenAdd?: () => void;
}

export default function ModulesSection({ modules, onOpenAdd }: ModulesSectionProps) {
  return (
    <section id="modules" className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      {/* Glow */}
      <div className="glow-orb w-[500px] h-[300px] -top-20 left-1/4 opacity-5 pointer-events-none"
        style={{ background: "#FFFFFF" }} />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <div className="badge badge-violet mb-4">
              <BookOpen size={11} />
              Modules
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4" style={{ fontFamily: "Space Grotesk" }}>
              Learn by{" "}
              <span className="text-white">doing.</span>
            </h2>
            <p className="text-sm sm:text-lg max-w-2xl" style={{ color: "var(--mist-dim)" }}>
              Structured modules from zero to hero. Each one packed with notes, code snippets, and roadmaps — built by someone who had to figure it all out the hard way.
            </p>
          </div>

          {onOpenAdd && (
            <button
              onClick={onOpenAdd}
              className="self-start md:self-auto px-4 py-2.5 rounded-md font-semibold text-sm bg-white text-black hover:bg-neutral-200 border border-white transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} />
              Add Module
            </button>
          )}
        </motion.div>

        {/* Module Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <motion.div
              key={mod._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={`/modules/${mod.slug}`}>
                <GlowCard noPadding className="group overflow-hidden">
                  {/* Banner */}
                  <div className="relative h-44 overflow-hidden">
                    {mod.bannerUrl ? (
                      <Image
                        src={mod.bannerUrl}
                        alt={mod.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${getGradient(mod.language)} flex items-center justify-center`}>
                        <BookOpen size={40} className="text-white opacity-30" />
                      </div>
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink-700)] to-transparent" />

                    {/* Tier badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`badge ${tierColors[mod.tier].badge}`}>
                        {mod.tier !== "free" && <Lock size={9} />}
                        {tierColors[mod.tier].text}
                      </span>
                    </div>

                    {/* Language tag */}
                    <div className="absolute bottom-3 left-3">
                      <span className="badge badge-violet text-[10px]">{mod.language}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-white transition-colors"
                      style={{ fontFamily: "Space Grotesk" }}>
                      {mod.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "var(--mist-dim)" }}>
                      {mod.description || "Dive deep into this module to master the concepts."}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ fontFamily: "JetBrains Mono", color: "var(--mist-faint)" }}>
                        {(mod.lessonCount ?? mod.lessons?.length ?? 0)} lesson{(mod.lessonCount ?? mod.lessons?.length ?? 0) !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all text-white/60 group-hover:text-white">
                        Explore <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </GlowCard>
              </Link>
            </motion.div>
          ))}

          {modules.length === 0 && (
            <div className="col-span-full text-center py-20" style={{ color: "var(--mist-dim)" }}>
              <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
              <p style={{ fontFamily: "JetBrains Mono" }}>Modules coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
