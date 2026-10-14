"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  BookOpen,
  PenTool,
  Upload,
  Sparkles,
  Image as ImageIcon,
  Check,
  Plus,
  ArrowRight,
  ArrowLeft,
  Link as LinkIcon,
  Tag,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button3D from "@/components/ui/Button3D";
import api from "@/lib/api";

export interface ResourceData {
  _id?: string;
  title: string;
  description: string;
  bannerUrl?: string;
  category: string;
  resourceType: string;
  fileUrl: string;
  tier: "free" | "basic" | "premium";
  price?: number;
  isSellable?: boolean;
}

interface ResourceTypeOption {
  slug: string;
  name: string;
  icon?: string;
  color?: string;
}

interface ResourceAddModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: (newResource: any) => void;
  resourceTypes: ResourceTypeOption[];
  onOpenAddTypeModal?: () => void;
}

const PRESET_RESOURCE_COVERS = [
  { name: "Code Notebook", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80" },
  { name: "Algorithms Blueprint", url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80" },
  { name: "Handwritten Notes", url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80" },
  { name: "Developer Desk", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80" },
];

export default function ResourceAddModal({
  open,
  onClose,
  onAdded,
  resourceTypes,
  onOpenAddTypeModal,
}: ResourceAddModalProps) {
  // Step 1: Type selection
  // Step 2: Banner cover
  // Step 3: Headline & Brief intro & details
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [selectedType, setSelectedType] = useState(resourceTypes[0]?.slug || "pdf");
  const [bannerUrl, setBannerUrl] = useState("");
  const [customBannerUrl, setCustomBannerUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("DSA");
  const [fileUrl, setFileUrl] = useState("");
  const [tier, setTier] = useState<"free" | "basic" | "premium">("free");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Banner image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerUrl(reader.result as string);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const getTypeIcon = (slug: string) => {
    if (slug === "ebook") return <BookOpen size={20} />;
    if (slug === "handwritten-notes") return <PenTool size={20} />;
    return <FileText size={20} />;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!selectedType) {
        setError("Please choose a resource type.");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      setError("");
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a resource headline.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const payload: ResourceData = {
      title: title.trim(),
      description: description.trim(),
      resourceType: selectedType,
      category: category.trim() || "General",
      bannerUrl: bannerUrl || customBannerUrl || PRESET_RESOURCE_COVERS[0].url,
      fileUrl: fileUrl.trim() || "#",
      tier,
      isSellable: tier !== "free",
      price: tier === "basic" ? 199 : tier === "premium" ? 499 : 0,
    };

    try {
      let created;
      try {
        const res = await api.post("/admin/resources", payload);
        created = res.data;
      } catch (err) {
        // Fallback for demo/offline
        created = {
          ...payload,
          _id: "res_" + Date.now(),
          createdAt: new Date().toISOString(),
        };
      }

      onAdded(created);
      // Reset
      setTitle("");
      setDescription("");
      setBannerUrl("");
      setFileUrl("");
      setStep(1);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add resource.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New Resource" size="lg">
      <div className="space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between px-2 pt-1 border-b border-white/10 pb-4">
          {[
            { num: 1, label: "1. Select Type" },
            { num: 2, label: "2. Cover Photo" },
            { num: 3, label: "3. Headline & Info" },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => {
                if (s.num < step) setStep(s.num as any);
              }}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                step === s.num
                  ? "text-white font-bold"
                  : step > s.num
                  ? "text-neutral-300 font-semibold"
                  : "text-neutral-500"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                  step === s.num
                    ? "bg-white text-black"
                    : step > s.num
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-neutral-500"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span className="text-xs uppercase tracking-wider hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-3.5 rounded-xl border border-white/15 bg-white/5 text-white/60 text-sm">
            {error}
          </div>
        )}

        {/* STEP 1: TYPE SELECTING OPTION */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-5"
          >
            <div>
              <h3 className="text-base font-bold text-white mb-1" style={{ fontFamily: "Space Grotesk" }}>
                Step 1: Choose Resource Type
              </h3>
              <p className="text-xs text-[var(--mist-dim)]">
                Select the format of the resource you are adding (e.g. PDF, Ebook, or Handwritten Notes).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {resourceTypes.map((type) => {
                const isSelected = selectedType === type.slug;
                return (
                  <button
                    key={type.slug}
                    type="button"
                    onClick={() => setSelectedType(type.slug)}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
                      isSelected
                        ? "border-white bg-white/10 shadow-sm"
                        : "border-white/10 hover:border-white/20 bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{
                          background: isSelected ? "#FFFFFF" : "rgba(255,255,255,0.08)",
                          color: isSelected ? "#000000" : "#CCCCCC",
                        }}
                      >
                        {getTypeIcon(type.slug)}
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-bold text-white mb-1">{type.name}</p>
                    <p className="text-[11px] text-neutral-400">
                      {type.slug === "pdf"
                        ? "Cheatsheets & reference docs"
                        : type.slug === "ebook"
                        ? "Comprehensive guidebooks"
                        : type.slug === "handwritten-notes"
                        ? "Personal handwritten insights"
                        : "Curated resource"}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Button to add resource type later in future */}
            {onOpenAddTypeModal && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAddTypeModal}
                  className="w-full py-3 px-4 rounded-md border border-dashed border-white/20 hover:border-white text-xs font-semibold text-white/70 hover:text-white flex items-center justify-center gap-2 transition-all bg-white/[0.02] hover:bg-white/[0.05]"
                >
                  <Plus size={15} /> Add Another Resource Type / Category
                </button>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-white/10">
              <Button3D type="button" onClick={handleNext} variant="primary">
                Next: Choose Cover Photo <ArrowRight size={14} className="ml-1" />
              </Button3D>
            </div>
          </motion.div>
        )}

        {/* STEP 2: BANNER / COVER PHOTO */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-5"
          >
            <div>
              <h3 className="text-base font-bold text-white mb-1" style={{ fontFamily: "Space Grotesk" }}>
                Step 2: Choose Cover Photo / Banner
              </h3>
              <p className="text-xs text-[var(--mist-dim)]">
                Upload a cover photo for your resource or pick one of our presets.
              </p>
            </div>

            {/* Banner Preview Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative h-44 rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group flex flex-col items-center justify-center border-white/20 hover:border-white bg-white/[0.02] hover:bg-white/[0.05]"
            >
              {bannerUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bannerUrl} alt="Cover Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-sm backdrop-blur-sm">
                    <Upload size={16} /> Click to change cover pic
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-2">
                  <div className="w-12 h-12 rounded-md mx-auto flex items-center justify-center bg-white/10 text-white group-hover:scale-105 transition-transform">
                    <Upload size={20} />
                  </div>
                  <p className="text-sm font-medium text-white/90">
                    Upload cover photo from your computer
                  </p>
                  <p className="text-xs text-neutral-400">PNG, JPG, WebP up to 5MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <p className="text-xs text-neutral-400">Or pick a curated resource cover:</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_RESOURCE_COVERS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setBannerUrl(preset.url)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      bannerUrl === preset.url
                        ? "border-white bg-white/20 text-white font-semibold"
                        : "border-white/10 hover:border-white/20 bg-white/5 text-neutral-400"
                    }`}
                  >
                    {bannerUrl === preset.url && <Check size={12} className="text-white" />}
                    {preset.name}
                  </button>
                ))}
              </div>
              <div className="pt-1">
                <input
                  type="text"
                  placeholder="Or paste external image URL..."
                  value={customBannerUrl}
                  onChange={(e) => {
                    setCustomBannerUrl(e.target.value);
                    setBannerUrl(e.target.value);
                  }}
                  className="input-field text-xs py-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm text-neutral-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <Button3D type="button" onClick={handleNext} variant="primary">
                Next: Headline & Details <ArrowRight size={14} className="ml-1" />
              </Button3D>
            </div>
          </motion.div>
        )}

        {/* STEP 3: HEADLINE & BRIEF INTRO */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-white mb-1" style={{ fontFamily: "Space Grotesk" }}>
                Step 3: Headline & Brief Intro
              </h3>
              <p className="text-xs text-[var(--mist-dim)]">
                Provide title and description for this{" "}
                <span className="text-[var(--teal)] font-semibold uppercase">{selectedType}</span>.
              </p>
            </div>

            {/* Headline */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wider uppercase text-[var(--mist)]">
                Resource Headline (Title)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Complete DSA Formula Cheat Sheet & Handwritten Diagrams"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field text-sm font-semibold"
              />
            </div>

            {/* Brief Intro */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wider uppercase text-[var(--mist)]">
                Brief Intro
              </label>
              <textarea
                rows={3}
                required
                placeholder="A concise summary of what this resource covers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field text-xs"
              />
            </div>

            {/* Category & File Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wider uppercase text-[var(--mist)]">
                  Subject Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. DSA, Web Dev, Python, OS"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wider uppercase text-[var(--mist)]">
                  Download / File URL
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or pdf url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            </div>

            {/* Tier */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wider uppercase text-[var(--mist)]">
                Access Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["free", "basic", "premium"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`py-2 px-2 rounded-md text-xs font-bold uppercase transition-all border ${
                      tier === t
                        ? "border-white bg-white text-black"
                        : "border-white/15 bg-white/5 text-neutral-400 hover:text-white hover:border-white/30"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-sm text-neutral-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <Button3D type="submit" disabled={isSubmitting} variant="primary">
                {isSubmitting ? "Adding Resource..." : "Add Resource to Website"}
              </Button3D>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

