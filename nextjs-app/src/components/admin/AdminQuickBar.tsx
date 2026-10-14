"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Plus,
  BookOpen,
  Download,
  Film,
  Megaphone,
  Settings,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface AdminQuickBarProps {
  onOpenAddModule: () => void;
  onOpenAddResource: () => void;
  onOpenAddType: () => void;
  onOpenAddVideo: () => void;
  onOpenAnnouncement: () => void;
}

export default function AdminQuickBar({
  onOpenAddModule,
  onOpenAddResource,
  onOpenAddType,
  onOpenAddVideo,
  onOpenAnnouncement,
}: AdminQuickBarProps) {
  const [expanded, setExpanded] = useState(true);

  if (!expanded) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-md border border-white/25 shadow-2xl backdrop-blur-xl bg-black/95 text-white hover:border-white hover:bg-neutral-900 active:scale-95 transition-all"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <ShieldCheck size={14} className="text-white" />
          <span className="text-xs font-bold tracking-wide" style={{ fontFamily: "Space Grotesk" }}>
            Admin Studio
          </span>
          <ChevronUp size={13} className="text-neutral-400 ml-1" />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 max-w-[calc(100vw-32px)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card rounded-lg border border-white/20 p-2 shadow-2xl backdrop-blur-xl"
        style={{ background: "rgba(10, 10, 10, 0.96)" }}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/10 mb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <span className="text-xs font-bold tracking-wider uppercase text-white flex items-center gap-1.5" style={{ fontFamily: "Space Grotesk" }}>
              <ShieldCheck size={14} className="text-white" />
              Admin Quick Studio
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Link
              href="/admin"
              className="admin-hub-btn text-[11px] font-bold px-2.5 py-1 rounded bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white transition-all flex items-center gap-1.5"
            >
              <Settings size={12} />
              <span>Admin Hub</span>
            </Link>
            <button
              onClick={() => setExpanded(false)}
              className="text-neutral-400 hover:text-white p-0.5 transition-colors"
              title="Minimize studio bar"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-1.5 px-1 py-1"
            >
              <button
                onClick={onOpenAddModule}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-white text-black hover:bg-neutral-200 border border-white transition-all flex items-center gap-1.5 shadow-sm"
              >
                <BookOpen size={12} />
                Add Module
              </button>

              <button
                onClick={onOpenAddResource}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-neutral-900 hover:bg-white text-white hover:text-black border border-white/25 hover:border-white transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Download size={12} />
                Add Resource
              </button>

              <button
                onClick={onOpenAddType}
                className="px-2.5 py-1.5 rounded text-xs font-medium bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/15 transition-all flex items-center gap-1"
                title="Add a new category/type of resource"
              >
                <Plus size={12} />
                Add Type
              </button>

              <button
                onClick={onOpenAddVideo}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-neutral-900 hover:bg-white text-white hover:text-black border border-white/25 hover:border-white transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Film size={12} />
                Short Video
              </button>

              <button
                onClick={onOpenAnnouncement}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-neutral-900 hover:bg-white text-white hover:text-black border border-white/25 hover:border-white transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Megaphone size={12} />
                Announcement
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
