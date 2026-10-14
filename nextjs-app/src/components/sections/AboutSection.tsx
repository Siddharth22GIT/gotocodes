"use client";

import { motion } from "framer-motion";
import { Play, User, Code2 } from "lucide-react";

interface Settings {
  aboutVideoUrl?: string;
  aboutText?: string;
}

export default function AboutSection({ settings }: { settings: Settings | null }) {
  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      <div className="glow-orb w-[600px] h-[400px] -bottom-20 -right-40 opacity-5 pointer-events-none"
        style={{ background: "#FFFFFF" }} />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="badge badge-violet mb-6">
              <User size={11} />
              About GotoCodes
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight" style={{ fontFamily: "Space Grotesk" }}>
              Built by a dev,
              <br />
              <span className="text-white">for devs.</span>
            </h2>
            <p className="text-sm sm:text-lg leading-relaxed" style={{ color: "var(--mist-dim)" }}>
              {settings?.aboutText ||
                "GotoCodes is where I turn 5+ years of CSE learning mistakes into shortcuts for you — roadmaps, notes, and code that actually make sense."}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-8 sm:mt-10 max-w-md">
              {[
                { val: "5+", label: "Years of experience" },
                { val: "11K+", label: "Students helped" },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
                    {stat.val}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--mist-dim)" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Video side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative rounded-3xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              {settings?.aboutVideoUrl ? (
                <video
                  src={settings.aboutVideoUrl}
                  controls
                  className="w-full rounded-3xl"
                  style={{ background: "var(--ink-700)" }}
                />
              ) : (
                <div className="aspect-video flex items-center justify-center rounded-3xl"
                  style={{ background: "linear-gradient(135deg, var(--ink-700) 0%, var(--ink-600) 100%)" }}>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)" }}>
                      <Play size={28} style={{ color: "#CCCCCC" }} />
                    </div>
                    <p className="text-sm" style={{ color: "var(--mist-dim)", fontFamily: "JetBrains Mono" }}>
                      Video coming soon
                    </p>
                  </div>
                </div>
              )}
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-30 pointer-events-none"
                style={{ background: "radial-gradient(circle at top right, rgba(255,255,255,0.3), transparent 70%)" }} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
