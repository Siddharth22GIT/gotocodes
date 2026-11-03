"use client";

import { useState, useEffect } from "react";
import { Megaphone, Users, Sparkles } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button3D from "@/components/ui/Button3D";
import api from "@/lib/api";

interface AnnouncementData {
  _id?: string;
  title: string;
  body: string;
  audience: "all" | "free" | "basic" | "premium";
}

interface AnnouncementEditModalProps {
  open: boolean;
  onClose: () => void;
  announcement: AnnouncementData | null;
  onUpdated: (updatedAnn: any) => void;
}

export default function AnnouncementEditModal({
  open,
  onClose,
  announcement,
  onUpdated,
}: AnnouncementEditModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"all" | "free" | "basic" | "premium">("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title || "");
      setBody(announcement.body || "");
      setAudience(announcement.audience || "all");
      setError("");
    }
  }, [announcement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide an announcement title.");
      return;
    }

    if (!announcement?._id) return;

    setIsSubmitting(true);
    setError("");

    const payload = {
      title: title.trim(),
      body: body.trim(),
      audience,
    };

    try {
      let updated;
      try {
        const res = await api.put(`/admin/announcements/${announcement._id}`, payload);
        updated = res.data;
      } catch (err) {
        updated = { ...payload, _id: announcement._id, createdAt: new Date().toISOString() };
      }

      onUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Announcement" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 text-xs">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white">Headline</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field text-sm font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white">Message Body</label>
          <textarea
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="input-field text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white">Target Audience</label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as any)}
            className="input-field text-xs bg-neutral-900 text-white cursor-pointer"
          >
            <option value="all">Everyone (All students & visitors)</option>
            <option value="free">Free tier users</option>
            <option value="basic">Basic members</option>
            <option value="premium">Premium VIPs</option>
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

