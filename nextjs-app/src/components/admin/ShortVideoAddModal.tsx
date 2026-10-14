"use client";

import { useState, useRef } from "react";
import { Play, Upload, Image as ImageIcon, Sparkles, Check, EyeOff, Film } from "lucide-react";
import { Instagram } from "@/components/ui/Icons";
import Modal from "@/components/ui/Modal";
import Button3D from "@/components/ui/Button3D";
import api from "@/lib/api";

export interface ShortVideoData {
  _id?: string;
  title: string;
  description: string;
  bannerUrl?: string;
  instagramLink: string;
  tier?: string;
  order?: number;
}

interface ShortVideoAddModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: (newVideo: any) => void;
}

const PRESET_REEL_COVERS = [
  { name: "Code Speedrun", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80" },
  { name: "Terminal Hack", url: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80" },
  { name: "DSA Trick", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80" },
  { name: "CSS Magic", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80" },
];

export default function ShortVideoAddModal({ open, onClose, onAdded }: ShortVideoAddModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [customBannerUrl, setCustomBannerUrl] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [tier, setTier] = useState("free");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a video headline.");
      return;
    }
    if (!instagramLink.trim()) {
      setError("Please provide the Instagram Reel or video link (this remains hidden to visitors).");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const payload: ShortVideoData = {
      title: title.trim(),
      description: description.trim(),
      bannerUrl: bannerUrl || customBannerUrl || PRESET_REEL_COVERS[0].url,
      instagramLink: instagramLink.trim(),
      tier,
      order: 1,
    };

    try {
      let created;
      try {
        const res = await api.post("/admin/shortvideos", payload);
        created = res.data;
      } catch (err) {
        created = {
          ...payload,
          _id: "vid_" + Date.now(),
          createdAt: new Date().toISOString(),
        };
      }

      onAdded(created);
      setTitle("");
      setDescription("");
      setBannerUrl("");
      setInstagramLink("");
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add short video.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Short Video (Instagram Reel)">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* 1. Banner Cover Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wider uppercase text-white/90 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon size={14} className="text-white" />
              1. Video Banner / Cover (Vertical 9:16)
            </span>
            {bannerUrl && <span className="text-white text-[11px]">✓ Cover selected</span>}
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative h-36 rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group flex flex-col items-center justify-center border-white/20 hover:border-white bg-white/[0.02] hover:bg-white/[0.05]"
          >
            {bannerUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bannerUrl} alt="Video Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-sm backdrop-blur-sm">
                  <Upload size={16} /> Click to change cover pic
                </div>
              </>
            ) : (
              <div className="text-center p-4 space-y-1.5">
                <div className="w-10 h-10 rounded-md mx-auto flex items-center justify-center bg-white/10 text-white group-hover:scale-105 transition-transform">
                  <Film size={18} />
                </div>
                <p className="text-xs font-medium text-white/90">Upload vertical reel cover photo</p>
                <p className="text-[10px] text-neutral-400">9:16 vertical ratio recommended</p>
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

          {/* Preset covers */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {PRESET_REEL_COVERS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setBannerUrl(preset.url)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${
                  bannerUrl === preset.url
                    ? "border-white bg-white/20 text-white"
                    : "border-white/10 hover:border-white/20 bg-white/5 text-neutral-400"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Headline */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wider uppercase text-white/90 flex items-center gap-1.5">
            <Play size={13} className="text-white" />
            2. Video Headline
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 3 Insane JavaScript Array Tricks You Didn't Know"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field text-sm font-semibold"
          />
        </div>

        {/* 3. Brief Intro */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wider uppercase text-white/90 flex items-center gap-1.5">
            <Sparkles size={13} className="text-white" />
            3. Brief Intro
          </label>
          <textarea
            rows={2}
            placeholder="Short 1-liner preview shown on hover/tap..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field text-xs"
          />
        </div>

        {/* 4. Hidden Instagram Link */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold tracking-wider uppercase text-white/90 flex items-center gap-1.5">
              <Instagram size={14} className="text-white" />
              Instagram Reel / Video URL (Hidden Link)
            </label>
            <span className="text-[10px] text-white/80 flex items-center gap-1">
              <EyeOff size={11} /> Hidden to visitors
            </span>
          </div>
          <input
            type="url"
            required
            placeholder="https://www.instagram.com/reel/C3abcXYZ... or https://youtube.com/shorts/..."
            value={instagramLink}
            onChange={(e) => setInstagramLink(e.target.value)}
            className="input-field text-xs font-mono"
          />
          <p className="text-[11px] text-neutral-400">
            Visitors will only see the stylish vertical banner, headline, and play button. Clicking the play button opens this reel directly.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
          >
            Cancel
          </button>
          <Button3D
            type="submit"
            disabled={isSubmitting}
            variant="primary"
          >
            {isSubmitting ? "Adding Video..." : "Add Short Video"}
          </Button3D>
        </div>
      </form>
    </Modal>
  );
}
