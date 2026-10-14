"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Zap, BookOpen } from "lucide-react";
import Button3D from "@/components/ui/Button3D";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 md:px-8 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />

      {/* Monochrome Glow Orbs */}
      <div
        className="glow-orb w-[650px] h-[650px] -top-40 -left-40 opacity-8"
        style={{ background: "#FFFFFF" }}
      />
      <div
        className="glow-orb w-[450px] h-[450px] top-1/3 -right-20 opacity-5"
        style={{ background: "#AAAAAA" }}
      />
      <div
        className="glow-orb w-[350px] h-[350px] bottom-10 left-1/3 opacity-5"
        style={{ background: "#FFFFFF" }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-5xl mx-auto text-center z-10 w-full"
      >
        {/* Live badge */}
        <motion.div variants={item} className="flex justify-center items-center mb-8">
          <div className="badge badge-violet">
            <span
              className="w-1.5 h-1.5 rounded-full animate-blink"
              style={{ background: "#FFFFFF" }}
            />
            11,000+ devs already inside
          </div>
        </motion.div>

        {/* Headline with Plain Tech Logos Orbiting Directly Around It */}
        <div className="relative inline-block max-w-4xl mx-auto w-full">
          {/* Top-Left: LeetCode Plain Logo (Tablet & Desktop only to prevent mobile overlap) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [-6, 6, -6],
              rotate: [-4, 3, -4],
            }}
            transition={{
              opacity: { duration: 0.6 },
              scale: { duration: 0.6 },
              y: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.25, rotate: 10 }}
            className="hidden sm:block absolute top-2 sm:-left-10 md:-left-20 lg:-left-28 sm:w-12 sm:h-12 md:w-16 md:h-16 z-20 cursor-pointer pointer-events-auto"
            title="LeetCode"
          >
            <Image
              src="/icons/leetcode.png"
              alt="LeetCode"
              width={64}
              height={64}
              className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(255,255,255,0.25)]"
            />
          </motion.div>

          {/* Top-Right: Python Plain Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [6, -6, 6],
              rotate: [4, -4, 4],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.2 },
              scale: { duration: 0.6, delay: 0.2 },
              y: { duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
              rotate: { duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
            }}
            whileHover={{ scale: 1.25, rotate: -10 }}
            className="hidden sm:block absolute top-2 sm:-right-10 md:-right-20 lg:-right-28 sm:w-12 sm:h-12 md:w-16 md:h-16 z-20 cursor-pointer pointer-events-auto"
            title="Python"
          >
            <Image
              src="/icons/python.png"
              alt="Python"
              width={64}
              height={64}
              className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(255,255,255,0.25)]"
            />
          </motion.div>

          {/* Bottom-Left: JavaScript Plain Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [8, -5, 8],
              rotate: [-3, 3, -3],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.3 },
              scale: { duration: 0.6, delay: 0.3 },
              y: { duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 1 },
              rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
            }}
            whileHover={{ scale: 1.25, rotate: -8 }}
            className="hidden sm:block absolute bottom-4 sm:-left-10 md:-left-20 lg:-left-28 sm:w-11 sm:h-11 md:w-14 md:h-14 z-20 cursor-pointer pointer-events-auto"
            title="JavaScript"
          >
            <Image
              src="/icons/javascript.png"
              alt="JavaScript"
              width={56}
              height={56}
              className="w-full h-full object-contain rounded-lg filter drop-shadow-[0_8px_20px_rgba(255,255,255,0.25)]"
            />
          </motion.div>

          {/* Bottom-Right: GitHub Plain Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [-7, 5, -7],
              rotate: [3, -3, 3],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.4 },
              scale: { duration: 0.6, delay: 0.4 },
              y: { duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
              rotate: { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
            }}
            whileHover={{ scale: 1.25, rotate: 8 }}
            className="hidden sm:block absolute bottom-4 sm:-right-10 md:-right-20 lg:-right-28 sm:w-11 sm:h-11 md:w-14 md:h-14 z-20 cursor-pointer pointer-events-auto"
            title="GitHub"
          >
            <Image
              src="/icons/github.png"
              alt="GitHub"
              width={56}
              height={56}
              className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(255,255,255,0.4)]"
            />
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="font-bold leading-[1.08] mb-4 sm:mb-6 px-2 sm:px-4 text-center"
            style={{
              fontFamily: "Space Grotesk",
              fontSize: "clamp(32px, 8vw, 84px)",
            }}
          >
            The <span className="text-white">Heaven</span> for
            <br />
            <span>Developers</span>
            <span style={{ color: "#FFFFFF" }}>.</span>
          </motion.h1>
        </div>

        {/* Mobile Tech Logos Row: Dedicated clean row for phones so they never collide */}
        <motion.div
          variants={item}
          className="flex sm:hidden items-center justify-center gap-3.5 my-4"
        >
          <div className="w-10 h-10 p-1.5 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <Image src="/icons/leetcode.png" alt="LeetCode" width={28} height={28} className="object-contain" />
          </div>
          <div className="w-10 h-10 p-1.5 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <Image src="/icons/python.png" alt="Python" width={28} height={28} className="object-contain" />
          </div>
          <div className="w-10 h-10 p-1.5 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <Image src="/icons/javascript.png" alt="JavaScript" width={28} height={28} className="object-contain rounded" />
          </div>
          <div className="w-10 h-10 p-1.5 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <Image src="/icons/github.png" alt="GitHub" width={28} height={28} className="object-contain" />
          </div>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="text-xs sm:text-base tracking-[0.2em] uppercase mb-4 sm:mb-6 font-medium mt-4 sm:mt-8 px-2"
          style={{ fontFamily: "JetBrains Mono", color: "var(--mist-faint)" }}
        >
          Coding · DSA · AI · Projects · Tech
        </motion.p>

        <motion.p
          variants={item}
          className="text-sm sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10 px-4"
          style={{ color: "var(--mist-dim)" }}
        >
          Roadmaps, notes, and code snippets from a 5+ year CSE journey lived the hard way —
          so yours doesn&apos;t have to be. No more DMs for resources. Everything lives here.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row gap-3.5 justify-center px-4 max-w-xs sm:max-w-none mx-auto w-full"
        >
          <Link href="/register" className="w-full sm:w-auto">
            <Button3D size="lg" className="w-full sm:w-auto">
              <Zap size={18} />
              Start Learning Free
            </Button3D>
          </Link>
          <a href="#modules" className="w-full sm:w-auto">
            <Button3D size="lg" variant="ghost" className="w-full sm:w-auto">
              <BookOpen size={18} />
              Explore Modules
            </Button3D>
          </a>
        </motion.div>

        {/* Stats row: Only 11K+ & 5+ Years Experience */}
        <motion.div
          variants={item}
          className="grid grid-cols-2 gap-3 sm:gap-4 mt-12 sm:mt-16 max-w-md mx-auto px-4"
        >
          {[
            { val: "11K+", label: "Active Devs" },
            { val: "5+", label: "Years Experience" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md flex flex-col items-center justify-center transition-transform hover:-translate-y-1 hover:border-white/30"
            >
              <p
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-1"
                style={{ fontFamily: "Space Grotesk" }}
              >
                {stat.val}
              </p>
              <p
                className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-neutral-400 text-center"
                style={{ fontFamily: "JetBrains Mono" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-white" />
        <span className="text-[11px]" style={{ fontFamily: "JetBrains Mono", color: "var(--mist-faint)" }}>
          scroll
        </span>
      </div>
    </section>
  );
}
