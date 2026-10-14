"use client";

import { useState } from "react";
import { Plus, Tag, Palette, Check } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button3D from "@/components/ui/Button3D";
import api from "@/lib/api";

export interface ResourceTypeItem {
  slug: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

interface ResourceTypeModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: (newType: ResourceTypeItem) => void;
}

const PRESET_COLORS = [
  { name: "Pure White", hex: "#FFFFFF" },
  { name: "Off White", hex: "#E5E5E5" },
  { name: "Silver", hex: "#CCCCCC" },
  { name: "Cool Grey", hex: "#AAAAAA" },
  { name: "Medium Grey", hex: "#888888" },
  { name: "Slate Grey", hex: "#666666" },
  { name: "Dark Charcoal", hex: "#444444" },
];

const PRESET_ICONS = [
  { id: "file-text", label: "Document" },
  { id: "book-open", label: "Book" },
  { id: "pen-tool", label: "Notes" },
  { id: "terminal", label: "Code" },
  { id: "zap", label: "Quick Ref" },
];

export default function ResourceTypeModal({ open, onClose, onAdded }: ResourceTypeModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("file-text");
  const [color, setColor] = useState("#FFFFFF");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a name for the new resource type.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const newType: ResourceTypeItem = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/\s+/g, "-"),
      icon,
      color,
      description: description.trim(),
    };

    try {
      let created;
      try {
        const res = await api.post("/admin/resource-types", newType);
        created = res.data;
      } catch (err) {
        created = newType;
      }
      onAdded(created);
      setName("");
      setSlug("");
      setDescription("");
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add resource type.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New Resource Category / Type">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg border border-white/15 bg-white/5 text-white/60 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/90">
            Category / Type Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Cheat Sheets, Interview Kits, Video Walkthroughs"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="input-field text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/90">
            URL Slug Identifier
          </label>
          <input
            type="text"
            required
            placeholder="e.g. cheat-sheets"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="input-field text-xs font-mono"
          />
        </div>

        {/* Icon & Color selector */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/90">
            Accent Tone
          </label>
          <div className="flex flex-wrap gap-2.5">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setColor(c.hex)}
                className={`w-9 h-9 rounded-md flex items-center justify-center transition-all border border-white/20 ${
                  color === c.hex ? "ring-2 ring-white scale-105 shadow-md" : "opacity-70 hover:opacity-100"
                }`}
                style={{ background: c.hex }}
                title={c.name}
              >
                {color === c.hex && (
                  <Check size={16} className={c.hex === "#FFFFFF" || c.hex === "#E5E5E5" ? "text-black" : "text-white"} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/90">
            Short Description (Optional)
          </label>
          <input
            type="text"
            placeholder="Brief note on what this category includes"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
          >
            Cancel
          </button>
          <Button3D type="submit" disabled={isSubmitting} variant="primary">
            {isSubmitting ? "Adding Type..." : "Add Resource Type"}
          </Button3D>
        </div>
      </form>
    </Modal>
  );
}

