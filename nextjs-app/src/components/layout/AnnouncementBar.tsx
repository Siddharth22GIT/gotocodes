"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, X, ChevronRight } from "lucide-react";

interface Announcement {
  _id: string;
  title: string;
  body: string;
  pinned: boolean;
}

interface AnnouncementBarProps {
  announcements?: Announcement[];
}

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    _id: "welcome-1",
    title: "🚀 Welcome to GotoCodes! New System Design & DSA Mastery Modules Live.",
    body: "",
    pinned: true,
  },
  {
    _id: "welcome-2",
    title: "⚡ Free Handwritten Notes & LeetCode Pattern Cheatsheets available now.",
    body: "",
    pinned: true,
  },
];

export default function AnnouncementBar({ announcements = DEFAULT_ANNOUNCEMENTS }: AnnouncementBarProps) {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const activeAnnouncements = announcements && announcements.length > 0 ? announcements : DEFAULT_ANNOUNCEMENTS;
  const pinned = activeAnnouncements.filter((a) => a.pinned);
  const items = pinned.length > 0 ? pinned : activeAnnouncements;

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);

  if (dismissed || items.length === 0) return null;

  return (
    <div className="announcement-bar relative z-40 px-5 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255, 255, 255, 0.1)" }}>
          <Megaphone size={12} className="text-white" />
        </div>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={current}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-sm truncate"
              style={{ fontFamily: "JetBrains Mono", color: "var(--mist-dim)" }}
            >
              <span className="font-semibold mr-2" style={{ color: "var(--mist)" }}>{items[current]?.title}</span>
              {items[current]?.body}
            </motion.p>
          </AnimatePresence>
        </div>

        {items.length > 1 && (
          <span className="text-xs flex-shrink-0" style={{ color: "var(--mist-faint)", fontFamily: "JetBrains Mono" }}>
            {current + 1}/{items.length}
          </span>
        )}

        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
          style={{ color: "var(--mist-faint)" }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
