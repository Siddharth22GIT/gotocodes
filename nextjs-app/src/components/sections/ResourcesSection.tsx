"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FileText, BookOpen, PenTool, Download, Lock, Plus, ExternalLink } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";

interface Resource {
  _id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  category: string;
  resourceType: string;
  fileUrl: string;
  tier: "free" | "basic" | "premium";
  price: number;
  isSellable: boolean;
}

interface ResourceType {
  slug: string;
  name: string;
  icon: string;
  color: string;
}

interface ResourcesSectionProps {
  resources: Resource[];
  resourceTypes: ResourceType[];
  onOpenAddResource?: () => void;
  onOpenAddType?: () => void;
}

const DEFAULT_TYPES: ResourceType[] = [
  { slug: "pdf", name: "PDF", icon: "file-text", color: "#FFFFFF" },
  { slug: "ebook", name: "Ebook", icon: "book-open", color: "#CCCCCC" },
  { slug: "handwritten-notes", name: "Handwritten Notes", icon: "pen-tool", color: "#AAAAAA" },
];

const TypeIcon = ({ icon, color, size = 16 }: { icon: string; color: string; size?: number }) => {
  const props = { size, style: { color } };
  if (icon === "book-open") return <BookOpen {...props} />;
  if (icon === "pen-tool") return <PenTool {...props} />;
  return <FileText {...props} />;
};

export default function ResourcesSection({
  resources,
  resourceTypes,
  onOpenAddResource,
  onOpenAddType,
}: ResourcesSectionProps) {
  const types = resourceTypes.length > 0 ? resourceTypes : DEFAULT_TYPES;
  const [activeType, setActiveType] = useState("all");

  const filtered = activeType === "all" ? resources : resources.filter((r) => r.resourceType === activeType);

  return (
    <section id="resources" className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      <div className="glow-orb w-[400px] h-[300px] top-20 right-0 opacity-5 pointer-events-none"
        style={{ background: "#FFFFFF" }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <div className="badge badge-violet mb-4">
              <Download size={11} />
              Resources
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4" style={{ fontFamily: "Space Grotesk" }}>
              Everything you{" "}
              <span className="text-white">need.</span>
            </h2>
            <p className="text-sm sm:text-lg max-w-2xl" style={{ color: "var(--mist-dim)" }}>
              PDFs, eBooks, handwritten notes — segregated by category so you can access what you need in seconds.
            </p>
          </div>

          {onOpenAddResource && (
            <button
              onClick={onOpenAddResource}
              className="self-start md:self-auto px-4 py-2.5 rounded-md font-semibold text-sm bg-white text-black hover:bg-neutral-200 border border-white transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} />
              Add Resource
            </button>
          )}
        </motion.div>

        {/* Type Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10">
          <button
            onClick={() => setActiveType("all")}
            className={`type-chip !rounded-md ${activeType === "all" ? "type-chip-active" : ""}`}
          >
            <span className="text-xs">✨</span>
            All Resources ({resources.length})
          </button>
          {types.map((type) => {
            const count = resources.filter((r) => r.resourceType === type.slug).length;
            return (
              <button
                key={type.slug}
                onClick={() => setActiveType(type.slug)}
                className={`type-chip !rounded-md ${activeType === type.slug ? "type-chip-active" : ""}`}
              >
                <TypeIcon icon={type.icon} color={activeType === type.slug ? "#FFFFFF" : "#888888"} size={14} />
                {type.name} {count > 0 && `(${count})`}
              </button>
            );
          })}

          {onOpenAddType && (
            <button
              onClick={onOpenAddType}
              className="px-3.5 py-2 rounded-md text-xs font-semibold border border-dashed border-white/20 hover:border-white text-white/70 hover:text-white transition-all flex items-center gap-1.5 bg-white/[0.03]"
              title="Add a new category / resource type"
            >
              <Plus size={13} />
              Add Type
            </button>
          )}
        </div>

        {/* Resource Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          >
            {filtered.map((resource, i) => (
              <motion.div
                key={resource._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className="w-full min-w-0 flex flex-col"
              >
                <GlowCard noPadding className="w-full h-full min-w-0 flex flex-col group overflow-hidden rounded-xl border border-white/10 hover:border-white/30 transition-all">
                  {/* Banner */}
                  <div className="relative h-40 w-full overflow-hidden bg-neutral-900 flex-shrink-0">
                    {resource.bannerUrl ? (
                      <Image src={resource.bannerUrl} alt={resource.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                        <TypeIcon icon={types.find(t => t.slug === resource.resourceType)?.icon || "file-text"} color="#CCCCCC" size={36} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink-700)] to-transparent" />
                    <div className="absolute top-3 left-3 max-w-[65%]">
                      <span className="badge badge-violet text-[10px] truncate max-w-full">
                        <TypeIcon icon={types.find(t => t.slug === resource.resourceType)?.icon || "file-text"} color="#FFFFFF" size={9} />
                        <span className="truncate">{types.find(t => t.slug === resource.resourceType)?.name || resource.resourceType}</span>
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex-shrink-0">
                      <span className="badge badge-violet text-[10px]">
                        {resource.tier !== "free" && <Lock size={9} />}
                        {resource.isSellable ? `₹${resource.price}` : resource.tier}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold leading-snug group-hover:text-white transition-colors line-clamp-2 min-w-0"
                          style={{ fontFamily: "Space Grotesk" }}>
                          {resource.title}
                        </h3>
                      </div>
                      <p className="text-sm mb-4 line-clamp-2 min-w-0" style={{ color: "var(--mist-dim)" }}>
                        {resource.description || "A premium resource to boost your learning."}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5 mt-auto">
                      <span className="text-xs px-2 py-1 rounded truncate max-w-[140px]"
                        style={{ fontFamily: "JetBrains Mono", background: "rgba(255,255,255,0.06)", color: "var(--mist-dim)" }}>
                        {resource.category}
                      </span>
                      {resource.fileUrl && resource.tier === "free" && (
                        <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white transition-colors flex-shrink-0">
                          <Download size={12} /> Download
                        </a>
                      )}
                      {resource.tier !== "free" && (
                        <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold flex-shrink-0"
                          style={{ color: "var(--mist-faint)" }}>
                          <Lock size={11} /> {resource.tier}
                        </span>
                      )}
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16" style={{ color: "var(--mist-dim)" }}>
                <FileText size={36} className="mx-auto mb-4 opacity-30" />
                <p style={{ fontFamily: "JetBrains Mono" }}>No {types.find(t => t.slug === activeType)?.name} resources yet</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
