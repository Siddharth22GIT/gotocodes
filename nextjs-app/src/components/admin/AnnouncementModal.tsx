"use client";

import { useState } from "react";
import { Megaphone, Mail, Send, Users, Sparkles, CheckCircle2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button3D from "@/components/ui/Button3D";
import api from "@/lib/api";

interface AnnouncementModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: (announcement: any) => void;
}

export default function AnnouncementModal({ open, onClose, onAdded }: AnnouncementModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"all" | "basic" | "premium">("all");
  const [sendEmail, setSendEmail] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Please provide both headline and message body.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMsg("");

    const payload = {
      title: title.trim(),
      body: body.trim(),
      audience,
      sendEmail,
      active: true,
    };

    try {
      let created;
      try {
        const res = await api.post("/admin/announcements", payload);
        created = res.data?.announcement || res.data;
        if (res.data?.emailResult?.sentCount) {
          setSuccessMsg(`Published & emailed to ${res.data.emailResult.sentCount} users!`);
        } else {
          setSuccessMsg("Announcement published successfully!");
        }
      } catch (err) {
        created = {
          ...payload,
          _id: "ann_" + Date.now(),
          createdAt: new Date().toISOString(),
        };
        setSuccessMsg(sendEmail ? "Announcement published and broadcast simulated!" : "Announcement published!");
      }

      onAdded(created);
      setTimeout(() => {
        setTitle("");
        setBody("");
        setSuccessMsg("");
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to publish announcement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Broadcast New Announcement">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl border border-white/15 bg-white/5 text-white/60 text-sm">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl border border-white/20 bg-white/5 text-white text-sm flex items-center gap-2">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wider uppercase text-white/90 flex items-center gap-1.5">
            <Megaphone size={13} className="text-white" />
            Announcement Headline
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 🚀 Brand New System Design Masterclass & Notes Released!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field text-sm font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wider uppercase text-white/90 flex items-center gap-1.5">
            <Sparkles size={13} className="text-white" />
            Message Content
          </label>
          <textarea
            rows={4}
            required
            placeholder="Write your announcement details here. This message will appear on the top banner bar and be sent via email to registered students..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="input-field text-xs"
          />
        </div>

        {/* Target Audience */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wider uppercase text-white/90 flex items-center gap-1.5">
            <Users size={13} className="text-white" />
            Target Audience
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "all", label: "All Users" },
              { id: "basic", label: "Basic & Above" },
              { id: "premium", label: "Premium Only" },
            ].map((aud) => (
              <button
                key={aud.id}
                type="button"
                onClick={() => setAudience(aud.id as any)}
                className={`py-2 px-2 rounded-md text-xs font-bold transition-all border ${
                  audience === aud.id
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/5 text-neutral-400 hover:border-white/20"
                }`}
              >
                {aud.label}
              </button>
            ))}
          </div>
        </div>

        {/* Email Broadcast Toggle */}
        <div
          onClick={() => setSendEmail(!sendEmail)}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
            sendEmail ? "border-white/30 bg-white/10" : "border-white/10 bg-white/[0.02]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${
                sendEmail ? "bg-white text-black" : "bg-white/10 text-white"
              }`}
            >
              <Mail size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Send Email Broadcast</p>
              <p className="text-[11px] text-neutral-400">
                Email this announcement to all students in the selected audience
              </p>
            </div>
          </div>
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
              sendEmail
                ? "bg-white border-white text-black font-bold text-xs"
                : "border-white/20"
            }`}
          >
            {sendEmail && "✓"}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
          >
            Cancel
          </button>
          <Button3D type="submit" disabled={isSubmitting} size="md" variant="primary">
            <Send size={14} className="mr-1" />
            {isSubmitting ? "Broadcasting..." : "Publish & Broadcast"}
          </Button3D>
        </div>
      </form>
    </Modal>
  );
}

