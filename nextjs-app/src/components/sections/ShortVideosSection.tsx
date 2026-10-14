"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Plus } from "lucide-react";
import { Instagram } from "@/components/ui/Icons";

interface ShortVideo {
  _id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  instagramLink: string;
  tier?: string;
}

interface ShortVideosSectionProps {
  videos: ShortVideo[];
  onOpenAddVideo?: () => void;
}

export default function ShortVideosSection({ videos, onOpenAddVideo }: ShortVideosSectionProps) {
  if (videos.length === 0 && !onOpenAddVideo) return null;

  return (
    <section id="videos" className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      <div
        className="absolute top-0 left-1/3 w-[400px] h-[300px] rounded-full opacity-5 pointer-events-none"
        style={{ background: "#FFFFFF", filter: "blur(80px)" }}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <div className="badge badge-violet mb-4">
              <Play size={11} fill="currentColor" />
              Short Videos
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4" style={{ fontFamily: "Space Grotesk" }}>
              Bite-sized{" "}
              <span className="text-white">brilliance.</span>
            </h2>
            <p className="text-sm sm:text-lg max-w-2xl" style={{ color: "var(--mist-dim)" }}>
              Quick reels to sharpen your skills on the go. Tap to watch on Instagram.
            </p>
          </div>

          {onOpenAddVideo && (
            <button
              onClick={onOpenAddVideo}
              className="self-start md:self-auto px-4 py-2.5 rounded-md font-semibold text-sm bg-white text-black hover:bg-neutral-200 border border-white transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} />
              Add Short Video
            </button>
          )}
        </motion.div>

        {/* Grid — 3 cols on tablet, 5 on large; cards capped at 280px tall */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {videos.map((video, i) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              <a
                href={video.instagramLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {/* Card: fixed height so they don't stretch the page */}
                <div
                  className="video-card relative overflow-hidden rounded-xl border border-white/10 hover:border-white/30"
                  style={{ height: "280px" }}
                >
                  {video.bannerUrl ? (
                    <Image src={video.bannerUrl} alt={video.title} fill className="object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center bg-neutral-900"
                    >
                      <Play size={32} className="text-white/60" />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 55%)" }}
                  />

                  {/* Play overlay on hover */}
                  <div className="play-overlay">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white"
                    >
                      <Play size={18} fill="white" />
                    </div>
                  </div>

                  {/* Instagram badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/20 text-white"
                    >
                      <Instagram size={13} />
                    </div>
                  </div>

                  {/* Title at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                    <h3
                      className="text-xs font-bold leading-tight line-clamp-2 text-white"
                      style={{ fontFamily: "Space Grotesk" }}
                    >
                      {video.title}
                    </h3>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}

          {/* Admin add card */}
          {onOpenAddVideo && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: videos.length * 0.06, duration: 0.5 }}
            >
              <button
                type="button"
                onClick={onOpenAddVideo}
                className="w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 hover:border-white bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-300 group"
                style={{ height: "280px" }}
              >
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center mb-2 bg-white/10 text-white group-hover:bg-white group-hover:text-black transition-all"
                >
                  <Plus size={20} />
                </div>
                <span className="text-xs font-bold text-white/80 group-hover:text-white" style={{ fontFamily: "Space Grotesk" }}>
                  Add Reel
                </span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
