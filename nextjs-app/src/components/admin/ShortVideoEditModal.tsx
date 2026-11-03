"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Upload, Image as ImageIcon, Link as LinkIcon, Check } from "lucide-react";
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

interface ShortVideoEditModalProps {
  open: boolean;
  onClose: () => void;
  video: ShortVideoData | null;
  onUpdated: (updatedVideo: any) => void;
}

const PRESET_REEL_COVERS = [
  { name: "Code Speedrun", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80" },
  { name: "Terminal Hack", url: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80" },
  { name: "DSA Trick", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80" },
  { name: "CSS Magic", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80" },
];

export default function ShortVideoEditModal({
  open,
  onClose,
  video,
  onUpdated,
}: ShortVideoEditModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [tier, setTier] = useState("free");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (video) {
      setTitle(video.title || "");
      setDescription(video.description || "");
      setBannerUrl(video.bannerUrl || "");
      setInstagramLink(video.instagramLink || "");
      setTier(video.tier || "free");
      setError("");
    }
  }, [video]);

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
      setError("Please provide the Instagram Reel or video link.");
      return;
    }

    if (!video?._id) return;

    setIsSubmitting(true);
    setError("");

    const payload = {
      title: title.trim(),
      description: description.trim(),
      bannerUrl: bannerUrl || PRESET_REEL_COVERS[0].url,
      instagramLink: instagramLink.trim(),
      tier,
    };

    try {
      let updated;
      try {
        const res = await api.put(`/admin/shortvideos/${video._id}`, payload);
        updated = res.data;
      } catch (err) {
        updated = { ...payload, _id: video._id };
      }

      onUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update short video");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Short Video" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Banner Cover */}
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wider uppercase text-white/90 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon size={14} className="text-white" /> Reel Thumbnail / Banner
            </span>
            {bannerUrl && <span className="text-white text-[11px]">✓ Image attached</span>}
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative h-32 rounded-xl border-2 border-dashed border-white/20 hover:border-white transition-all cursor-pointer overflow-hidden group flex flex-col items-center justify-center bg-white/[0.02]"
          >
            {bannerUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bannerUrl} alt="Thumbnail Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs backdrop-blur-sm">
                  <Upload size={14} /> Click to change thumbnail
                </div>
              </>
            ) : (
              <div className="text-center p-4 space-y-1">
                <Play size={20} className="mx-auto text-white/70" />
                <p className="text-xs font-medium text-white/80">Click to upload thumbnail</p>
                <p className="text-[10px] text-neutral-400">Vertical 9:16 aspect ratio recommended</p>
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

          <div className="flex flex-wrap gap-1.5 pt-1">
            {PRESET_REEL_COVERS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setBannerUrl(preset.url)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${
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
            placeholder="Or paste thumbnail URL directly..."
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            className="input-field text-xs py-1.5"
          />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white">Video Headline</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field text-sm font-semibold"
          />
        </div>

        {/* Instagram Link */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
            <LinkIcon size={12} /> Instagram Reel / Video Link
          </label>
          <input
            type="url"
            required
            placeholder="https://www.instagram.com/reel/..."
            value={instagramLink}
            onChange={(e) => setInstagramLink(e.target.value)}
            className="input-field text-xs font-mono"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white">Brief Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field text-xs"
          />
        </div>

        {/* Tier */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white">Access Tier</label>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="input-field text-xs bg-neutral-900 text-white cursor-pointer"
          >
            <option value="free">Free (Visible to Everyone)</option>
            <option value="basic">Basic Tier</option>
            <option value="premium">Premium Tier</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <Button3D type="submit" size="sm" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button3D>
        </div>
      </form>
    </Modal>
  );
}

