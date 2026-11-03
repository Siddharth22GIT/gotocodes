"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileText,
  BookOpen,
  PenTool,
  Upload,
  Image as ImageIcon,
  Check,
  Tag,
  Link as LinkIcon,
  X,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button3D from "@/components/ui/Button3D";
import api from "@/lib/api";

export interface ResourceData {
  _id?: string;
  title: string;
  description: string;
  bannerUrl?: string;
  coverImage?: string;
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

interface ResourceEditModalProps {
  open: boolean;
  onClose: () => void;
  resource: ResourceData | null;
  resourceTypes: ResourceTypeOption[];
  onUpdated: (updatedResource: any) => void;
}

const PRESET_RESOURCE_COVERS = [
  { name: "Code Notebook", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80" },
  { name: "Algorithms Blueprint", url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80" },
  { name: "Handwritten Notes", url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80" },
  { name: "Developer Desk", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80" },
];

export default function ResourceEditModal({
  open,
  onClose,
  resource,
  resourceTypes,
  onUpdated,
}: ResourceEditModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resourceType, setResourceType] = useState("pdf");
  const [category, setCategory] = useState("DSA");
  const [bannerUrl, setBannerUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [tier, setTier] = useState<"free" | "basic" | "premium">("free");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (resource) {
      setTitle(resource.title || "");
      setDescription(resource.description || "");
      setResourceType(resource.resourceType || "pdf");
      setCategory(resource.category || "DSA");
      setBannerUrl(resource.bannerUrl || resource.coverImage || "");
      setFileUrl(resource.fileUrl || "");
      setTier(resource.tier || "free");
      setError("");
    }
  }, [resource]);

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
      setError("Please provide a resource title.");
      return;
    }

    if (!resource?._id) return;

    setIsSubmitting(true);
    setError("");

    const payload = {
      title: title.trim(),
      description: description.trim(),
      resourceType,
      category: category.trim() || "General",
      bannerUrl: bannerUrl || PRESET_RESOURCE_COVERS[0].url,
      coverImage: bannerUrl || PRESET_RESOURCE_COVERS[0].url,
      fileUrl: fileUrl.trim() || "#",
      tier,
      isSellable: tier !== "free",
      price: tier === "basic" ? 199 : tier === "premium" ? 499 : 0,
    };

    try {
      let updated;
      try {
        const res = await api.put(`/admin/resources/${resource._id}`, payload);
        updated = res.data;
      } catch (err) {
        updated = { ...payload, _id: resource._id };
      }

      onUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update resource");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Resource" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Cover / Banner Image */}
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wider uppercase text-white/90 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon size={14} className="text-white" /> Cover / Banner Image
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
                <img src={bannerUrl} alt="Cover Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs backdrop-blur-sm">
                  <Upload size={14} /> Click to change cover pic
                </div>
              </>
            ) : (
              <div className="text-center p-4 space-y-1">
                <Upload size={18} className="mx-auto text-white/70" />
                <p className="text-xs font-medium text-white/80">Click to upload cover image</p>
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

          <div className="flex flex-wrap gap-1.5 pt-1">
            {PRESET_RESOURCE_COVERS.map((preset) => (
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
            placeholder="Or paste image URL directly..."
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            className="input-field text-xs py-1.5"
          />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field text-sm font-semibold"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field text-xs"
          />
        </div>

        {/* Resource Type, Category & Tier */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white">Resource Type</label>
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              className="input-field text-xs bg-neutral-900 text-white cursor-pointer"
            >
              {resourceTypes.map((rt) => (
                <option key={rt.slug} value={rt.slug}>
                  {rt.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field text-xs"
              placeholder="e.g. DSA, Resume, System Design"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white">Access Tier</label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as any)}
              className="input-field text-xs bg-neutral-900 text-white cursor-pointer"
            >
              <option value="free">Free (All students)</option>
              <option value="basic">Basic Tier</option>
              <option value="premium">Premium Tier</option>
            </select>
          </div>
        </div>

        {/* File Link / URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
            <LinkIcon size={12} /> Resource File Download Link / Google Drive URL
          </label>
          <input
            type="text"
            required
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="https://drive.google.com/... or direct PDF link"
            className="input-field text-xs font-mono"
          />
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

