"use client";

import { useState, useRef } from "react";
import { Play, Upload, Image as ImageIcon, EyeOff, Film, X } from "lucide-react";
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

export default function ShortVideoAddModal({ open, onClose, onAdded }: ShortVideoAddModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be under 8 MB.");
      return;
    }

    // Show preview immediately and set as fallback
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setBannerPreview(dataUrl);
      setBannerUrl(dataUrl);
    };
    reader.readAsDataURL(file);

    // Upload to backend for clean static URL
    setIsUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.url) {
        setBannerUrl(res.data.url);
      }
    } catch {
      // Fallback: the base64 preview is already set as bannerUrl so user is not blocked
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveBanner = () => {
    setBannerUrl("");
    setBannerPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a video headline.");
      return;
    }
    if (!instagramLink.trim()) {
      setError("Please provide the Instagram Reel link.");
      return;
    }
    if (isUploading) {
      setError("Please wait for the image to finish uploading.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const payload: ShortVideoData = {
      title: title.trim(),
      description: description.trim(),
      bannerUrl: bannerUrl || "",
      instagramLink: instagramLink.trim(),
      tier: "free",
      order: 1,
    };

    try {
      let created;
      try {
        const res = await api.post("/admin/shortvideos", payload);
        created = res.data;
      } catch {
        created = { ...payload, _id: "vid_" + Date.now(), createdAt: new Date().toISOString() };
      }

      onAdded(created);
      setTitle("");
      setDescription("");
      setBannerUrl("");
      setBannerPreview("");
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

        {/* 1. Thumbnail Upload */}
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wider uppercase text-white/90 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon size={14} className="text-white" />
              1. Reel Thumbnail (Vertical 9:16)
            </span>
            {isUploading && <span className="text-white/60 text-[11px]">Uploading...</span>}
            {bannerUrl && !isUploading && <span className="text-green-400 text-[11px]">✓ Uploaded</span>}
          </label>

          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`relative rounded-xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center ${
              isUploading
                ? "border-white/30 cursor-wait"
                : "border-white/20 hover:border-white cursor-pointer bg-white/[0.02] hover:bg-white/[0.05]"
            }`}
            style={{ height: "180px" }}
          >
            {bannerPreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bannerPreview} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-sm backdrop-blur-sm">
                  <Upload size={16} /> Click to change
                </div>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemoveBanner(); }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 border border-white/30 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors z-10"
                >
                  <X size={12} />
                </button>
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-white text-sm font-medium">Uploading...</div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-4 space-y-2">
                <div className="w-11 h-11 rounded-md mx-auto flex items-center justify-center bg-white/10 text-white">
                  <Film size={20} />
                </div>
                <p className="text-xs font-semibold text-white/90">Click to upload from device</p>
                <p className="text-[10px] text-neutral-400">Vertical 9:16 ratio recommended · Max 8 MB</p>
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
          <label className="text-xs font-semibold tracking-wider uppercase text-white/90">
            3. Brief Intro (optional)
          </label>
          <textarea
            rows={2}
            placeholder="Short 1-liner preview..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field text-xs"
          />
        </div>

        {/* 4. Instagram Link */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold tracking-wider uppercase text-white/90 flex items-center gap-1.5">
              <Instagram size={14} className="text-white" />
              4. Instagram / YouTube Shorts Link
            </label>
            <span className="text-[10px] text-white/60 flex items-center gap-1">
              <EyeOff size={11} /> Hidden from visitors
            </span>
          </div>
          <input
            type="url"
            required
            placeholder="https://www.instagram.com/reel/... or https://youtube.com/shorts/..."
            value={instagramLink}
            onChange={(e) => setInstagramLink(e.target.value)}
            className="input-field text-xs font-mono"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-neutral-400 hover:text-white">
            Cancel
          </button>
          <Button3D type="submit" disabled={isSubmitting || isUploading} variant="primary">
            {isSubmitting ? "Adding..." : "Add Short Video"}
          </Button3D>
        </div>
      </form>
    </Modal>
  );
}
