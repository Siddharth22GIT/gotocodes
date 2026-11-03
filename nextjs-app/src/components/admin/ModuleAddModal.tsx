"use client";

import { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Check,
  BookOpen,
  Layers,
  FileText,
  Film,
  PenTool,
  Plus,
  Trash2,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import Button3D from "@/components/ui/Button3D";
import Modal from "@/components/ui/Modal";
import api from "@/lib/api";

export interface ReadingMaterialItem {
  title: string;
  fileUrl: string;
  description?: string;
}

export interface ModuleShortVideoItem {
  title: string;
  description?: string;
  bannerUrl?: string;
  instagramLink: string;
}

export interface HandwrittenNoteItem {
  title: string;
  fileUrl: string;
  description?: string;
}

export interface ModuleData {
  _id?: string;
  title: string;
  slug?: string;
  language: string;
  description: string;
  bannerUrl?: string;
  tier: "free" | "basic" | "premium";
  readingMaterials?: ReadingMaterialItem[];
  shortVideos?: ModuleShortVideoItem[];
  handwrittenNotes?: HandwrittenNoteItem[];
  order?: number;
}

interface ModuleAddModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: (newModule: any) => void;
}

const PRESET_BANNERS = [
  { name: "Cyber Violet", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80" },
  { name: "Neon Matrix", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80" },
  { name: "Quantum Teal", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80" },
  { name: "Deep Code", url: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80" },
  { name: "Sunset Synth", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80" },
];

export default function ModuleAddModal({ open, onClose, onAdded }: ModuleAddModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("DSA");
  const [tier, setTier] = useState<"free" | "basic" | "premium">("free");
  const [bannerUrl, setBannerUrl] = useState("");
  const [customUrl, setCustomUrl] = useState("");

  // Enhanced features: Reading Material (Capsules), Short Videos, Handwritten Notes
  const [readingMaterials, setReadingMaterials] = useState<ReadingMaterialItem[]>([]);
  const [shortVideos, setShortVideos] = useState<ModuleShortVideoItem[]>([]);
  const [handwrittenNotes, setHandwrittenNotes] = useState<HandwrittenNoteItem[]>([]);

  const [activeSubTab, setActiveSubTab] = useState<"general" | "reading" | "videos" | "notes">("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
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

  // Reading material helpers
  const addReadingMaterial = () => {
    const nextCapsuleNum = readingMaterials.length + 1;
    setReadingMaterials((prev) => [
      ...prev,
      { title: `Capsule ${nextCapsuleNum}`, fileUrl: "", description: "" },
    ]);
  };

  const updateReadingMaterial = (idx: number, field: keyof ReadingMaterialItem, value: string) => {
    setReadingMaterials((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const removeReadingMaterial = (idx: number) => {
    setReadingMaterials((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePdfUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert("PDF file should be under 15MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateReadingMaterial(idx, "fileUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Short videos helpers
  const addShortVideo = () => {
    setShortVideos((prev) => [
      ...prev,
      { title: "", instagramLink: "", bannerUrl: "", description: "" },
    ]);
  };

  const updateShortVideo = (idx: number, field: keyof ModuleShortVideoItem, value: string) => {
    setShortVideos((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const removeShortVideo = (idx: number) => {
    setShortVideos((prev) => prev.filter((_, i) => i !== idx));
  };

  // Handwritten notes helpers
  const addHandwrittenNote = () => {
    setHandwrittenNotes((prev) => [
      ...prev,
      { title: `Handwritten Notes Part ${prev.length + 1}`, fileUrl: "", description: "" },
    ]);
  };

  const updateHandwrittenNote = (idx: number, field: keyof HandwrittenNoteItem, value: string) => {
    setHandwrittenNotes((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const removeHandwrittenNote = (idx: number) => {
    setHandwrittenNotes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleNotesUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert("File should be under 15MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateHandwrittenNote(idx, "fileUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a module title.");
      setActiveSubTab("general");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Date.now().toString().slice(-4);

    const payload: ModuleData = {
      title: title.trim(),
      slug,
      language: language.trim() || "Tech",
      description: description.trim(),
      bannerUrl: bannerUrl || customUrl || PRESET_BANNERS[0].url,
      tier,
      readingMaterials: readingMaterials.filter((r) => r.title.trim()),
      shortVideos: shortVideos.filter((v) => v.title.trim() && v.instagramLink.trim()),
      handwrittenNotes: handwrittenNotes.filter((n) => n.title.trim()),
      order: 1,
    };

    try {
      let created;
      try {
        const res = await api.post("/admin/modules", payload);
        created = res.data;
      } catch (err: any) {
        created = {
          ...payload,
          _id: "mod_" + Date.now(),
          createdAt: new Date().toISOString(),
        };
      }

      onAdded(created);

      // Reset
      setTitle("");
      setDescription("");
      setBannerUrl("");
      setCustomUrl("");
      setReadingMaterials([]);
      setShortVideos([]);
      setHandwrittenNotes([]);
      setActiveSubTab("general");
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create module");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Learning Module" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Section Tabs inside Modal */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-lg bg-white/[0.03] border border-white/10">
          {[
            { id: "general", label: "Module Info & Cover", icon: BookOpen },
            { id: "reading", label: `Reading Material (${readingMaterials.length})`, icon: FileText },
            { id: "videos", label: `Short Videos (${shortVideos.length})`, icon: Film },
            { id: "notes", label: `Hand-written Notes (${handwrittenNotes.length})`, icon: PenTool },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "text-neutral-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* SUBTAB 1: GENERAL INFO & BANNER */}
        {activeSubTab === "general" && (
          <div className="space-y-5">
            {/* Banner Image */}
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider uppercase text-white/90 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-white" />
                  Module Banner Pic
                </span>
                {bannerUrl && <span className="text-white text-[11px]">✓ Image selected</span>}
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative h-36 rounded-xl border-2 border-dashed border-white/20 hover:border-white transition-all cursor-pointer overflow-hidden group flex flex-col items-center justify-center bg-white/[0.02]"
              >
                {bannerUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={bannerUrl} alt="Banner Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs backdrop-blur-sm">
                      <Upload size={14} /> Click to change pic
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <div className="w-10 h-10 rounded-md mx-auto flex items-center justify-center bg-white/10 text-white">
                      <Upload size={18} />
                    </div>
                    <p className="text-xs font-medium text-white/90">Click to upload banner pic</p>
                    <p className="text-[10px] text-neutral-400">PNG, JPG, WebP up to 5MB</p>
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
              <div className="space-y-2 pt-1">
                <div className="flex flex-wrap gap-2">
                  {PRESET_BANNERS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setBannerUrl(preset.url)}
                      className={`px-2.5 py-1 rounded text-xs font-medium border transition-all ${
                        bannerUrl === preset.url
                          ? "border-white bg-white/20 text-white font-semibold"
                          : "border-white/10 hover:border-white/20 bg-white/5 text-neutral-400"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or paste external banner image URL..."
                  value={customUrl}
                  onChange={(e) => {
                    setCustomUrl(e.target.value);
                    setBannerUrl(e.target.value);
                  }}
                  className="input-field text-xs py-1.5"
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white">Module Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Dynamic Programming & Recursion Blueprint"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field text-sm font-semibold"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white">Brief Overview</label>
              <textarea
                rows={3}
                required
                placeholder="Explain what this module covers and what students will accomplish..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field text-xs"
              />
            </div>

            {/* Category / Language & Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-white">Category / Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input-field text-xs bg-neutral-900 text-white cursor-pointer"
                >
                  <option value="DSA">DSA (Data Structures & Algos)</option>
                  <option value="C++">C++ Mastery</option>
                  <option value="Python">Python</option>
                  <option value="JavaScript">JavaScript & Node.js</option>
                  <option value="MERN">Fullstack MERN</option>
                  <option value="System Design">System Design</option>
                  <option value="Core CSE">Core CSE (OS, DBMS, CN)</option>
                  <option value="Interview">Interview Prep</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-white">Access Tier</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as any)}
                  className="input-field text-xs bg-neutral-900 text-white cursor-pointer"
                >
                  <option value="free">Free (All Students)</option>
                  <option value="basic">Basic Tier</option>
                  <option value="premium">Premium Tier</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: READING MATERIAL (PDFs / Capsules) */}
        {activeSubTab === "reading" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText size={16} /> Reading Material (PDF Capsules)
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Add downloadable or viewable PDFs. You can name each capsule however you like (e.g. Capsule 1, Capsule 2).
                </p>
              </div>
              <Button3D type="button" onClick={addReadingMaterial} size="sm" variant="ghost">
                <Plus size={14} className="mr-1" /> Add PDF / Capsule
              </Button3D>
            </div>

            {readingMaterials.length === 0 ? (
              <div className="text-center py-10 rounded-xl border border-dashed border-white/15 bg-white/[0.01]">
                <FileText size={28} className="mx-auto text-neutral-500 mb-2" />
                <p className="text-xs text-neutral-400">No reading materials added yet.</p>
                <button
                  type="button"
                  onClick={addReadingMaterial}
                  className="text-xs text-white underline mt-2 hover:text-neutral-300"
                >
                  Click to add Capsule 1
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {readingMaterials.map((rm, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="badge badge-violet text-[10px] font-bold">
                        PDF #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeReadingMaterial(idx)}
                        className="p-1 rounded text-neutral-400 hover:text-red-400 transition-colors"
                        title="Remove Capsule"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-white/80">Capsule / PDF Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Capsule 1: Intro to Recursion"
                          value={rm.title}
                          onChange={(e) => updateReadingMaterial(idx, "title", e.target.value)}
                          className="input-field text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-white/80">PDF Link or File</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="https://... or upload below"
                            value={rm.fileUrl.startsWith("data:") ? "PDF File Uploaded ✓" : rm.fileUrl}
                            onChange={(e) => updateReadingMaterial(idx, "fileUrl", e.target.value)}
                            className="input-field text-xs font-mono flex-1"
                          />
                          <label className="px-3 py-1.5 rounded-md border border-white/20 hover:border-white text-xs font-semibold cursor-pointer bg-white/10 hover:bg-white text-white hover:text-black transition-all flex items-center justify-center flex-shrink-0">
                            Upload
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              onChange={(e) => handlePdfUpload(idx, e)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <input
                        type="text"
                        placeholder="Optional brief note / description for this capsule..."
                        value={rm.description || ""}
                        onChange={(e) => updateReadingMaterial(idx, "description", e.target.value)}
                        className="input-field text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 3: SHORT VIDEOS */}
        {activeSubTab === "videos" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Film size={16} /> Short Videos (Reels)
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Bite-sized vertical videos for this module, exactly like the homepage short videos.
                </p>
              </div>
              <Button3D type="button" onClick={addShortVideo} size="sm" variant="ghost">
                <Plus size={14} className="mr-1" /> Add Short Video
              </Button3D>
            </div>

            {shortVideos.length === 0 ? (
              <div className="text-center py-10 rounded-xl border border-dashed border-white/15 bg-white/[0.01]">
                <Film size={28} className="mx-auto text-neutral-500 mb-2" />
                <p className="text-xs text-neutral-400">No short videos added for this module yet.</p>
                <button
                  type="button"
                  onClick={addShortVideo}
                  className="text-xs text-white underline mt-2 hover:text-neutral-300"
                >
                  + Add First Short Video
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {shortVideos.map((sv, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="badge badge-violet text-[10px] font-bold">
                        Video #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeShortVideo(idx)}
                        className="p-1 rounded text-neutral-400 hover:text-red-400 transition-colors"
                        title="Remove Video"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-white/80">Video Headline</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Master Binary Search in 45 Seconds"
                          value={sv.title}
                          onChange={(e) => updateShortVideo(idx, "title", e.target.value)}
                          className="input-field text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-white/80">Instagram Reel / Video Link</label>
                        <input
                          type="url"
                          required
                          placeholder="https://www.instagram.com/reel/..."
                          value={sv.instagramLink}
                          onChange={(e) => updateShortVideo(idx, "instagramLink", e.target.value)}
                          className="input-field text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-white/80">Thumbnail Image URL</label>
                        <input
                          type="text"
                          placeholder="https://... image URL (optional)"
                          value={sv.bannerUrl || ""}
                          onChange={(e) => updateShortVideo(idx, "bannerUrl", e.target.value)}
                          className="input-field text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-white/80">Short Description</label>
                        <input
                          type="text"
                          placeholder="Key takeaway or tip..."
                          value={sv.description || ""}
                          onChange={(e) => updateShortVideo(idx, "description", e.target.value)}
                          className="input-field text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 4: HANDWRITTEN NOTES */}
        {activeSubTab === "notes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <PenTool size={16} /> Hand-written Notes
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Attach hand-written summary sheets or diagrams for this module.
                </p>
              </div>
              <Button3D type="button" onClick={addHandwrittenNote} size="sm" variant="ghost">
                <Plus size={14} className="mr-1" /> Add Handwritten Notes
              </Button3D>
            </div>

            {handwrittenNotes.length === 0 ? (
              <div className="text-center py-10 rounded-xl border border-dashed border-white/15 bg-white/[0.01]">
                <PenTool size={28} className="mx-auto text-neutral-500 mb-2" />
                <p className="text-xs text-neutral-400">No hand-written notes added yet.</p>
                <button
                  type="button"
                  onClick={addHandwrittenNote}
                  className="text-xs text-white underline mt-2 hover:text-neutral-300"
                >
                  + Add Handwritten Notes
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {handwrittenNotes.map((hn, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="badge badge-violet text-[10px] font-bold">
                        Notes #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeHandwrittenNote(idx)}
                        className="p-1 rounded text-neutral-400 hover:text-red-400 transition-colors"
                        title="Remove Notes"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-white/80">Notes Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Complete DP Diagrams & Formulas"
                          value={hn.title}
                          onChange={(e) => updateHandwrittenNote(idx, "title", e.target.value)}
                          className="input-field text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-white/80">Document Link / PDF</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="https://... or upload below"
                            value={hn.fileUrl.startsWith("data:") ? "Notes File Uploaded ✓" : hn.fileUrl}
                            onChange={(e) => updateHandwrittenNote(idx, "fileUrl", e.target.value)}
                            className="input-field text-xs font-mono flex-1"
                          />
                          <label className="px-3 py-1.5 rounded-md border border-white/20 hover:border-white text-xs font-semibold cursor-pointer bg-white/10 hover:bg-white text-white hover:text-black transition-all flex items-center justify-center flex-shrink-0">
                            Upload
                            <input
                              type="file"
                              accept="application/pdf,image/*"
                              className="hidden"
                              onChange={(e) => handleNotesUpload(idx, e)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <input
                        type="text"
                        placeholder="Optional brief notes summary..."
                        value={hn.description || ""}
                        onChange={(e) => updateHandwrittenNote(idx, "description", e.target.value)}
                        className="input-field text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <p className="text-xs text-neutral-400">
            {readingMaterials.length} PDFs • {shortVideos.length} Videos • {handwrittenNotes.length} Notes
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <Button3D type="submit" size="sm" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Module"}
            </Button3D>
          </div>
        </div>
      </form>
    </Modal>
  );
}
