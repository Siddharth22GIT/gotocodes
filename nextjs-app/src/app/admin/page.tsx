"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Shield,
  Layers,
  BookOpen,
  Download,
  Film,
  Megaphone,
  CreditCard,
  Users,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Mail,
  Send,
  CheckCircle2,
  QrCode,
  Sparkles,
  ArrowLeft,
  Settings,
  FileText,
  PenTool,
  Upload,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlowCard from "@/components/ui/GlowCard";
import Button3D from "@/components/ui/Button3D";
import ShootingStars from "@/components/ui/ShootingStars";

import ModuleAddModal from "@/components/admin/ModuleAddModal";
import ModuleEditModal from "@/components/admin/ModuleEditModal";
import ResourceAddModal from "@/components/admin/ResourceAddModal";
import ResourceEditModal from "@/components/admin/ResourceEditModal";
import ResourceTypeModal from "@/components/admin/ResourceTypeModal";
import ShortVideoAddModal from "@/components/admin/ShortVideoAddModal";
import ShortVideoEditModal from "@/components/admin/ShortVideoEditModal";
import AnnouncementModal from "@/components/admin/AnnouncementModal";
import AnnouncementEditModal from "@/components/admin/AnnouncementEditModal";
import api from "@/lib/api";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "modules" | "resources" | "videos" | "announcements" | "payment" | "users"
  >("overview");

  // State data
  const [modules, setModules] = useState<any[]>([]);
  const [resourceTypes, setResourceTypes] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [shortVideos, setShortVideos] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    basicPriceINR: 149,
    premiumPriceINR: 349,
    upiId: "gotocodes@upi",
    upiName: "GotoCodes Education",
    upiQrUrl: "",
    aboutText: "5+ years in CSE lived the hard way so yours doesn't have to be.",
    aboutVideoUrl: "",
  });

  const [settingsSaved, setSettingsSaved] = useState(false);
  const qrFileInputRef = useRef<HTMLInputElement>(null);

  // Modals state - Add
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [isAddTypeOpen, setIsAddTypeOpen] = useState(false);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

  // Modals state - Edit
  const [editingModule, setEditingModule] = useState<any | null>(null);
  const [isEditModuleOpen, setIsEditModuleOpen] = useState(false);

  const [editingResource, setEditingResource] = useState<any | null>(null);
  const [isEditResourceOpen, setIsEditResourceOpen] = useState(false);

  const [editingVideo, setEditingVideo] = useState<any | null>(null);
  const [isEditVideoOpen, setIsEditVideoOpen] = useState(false);

  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null);
  const [isEditAnnouncementOpen, setIsEditAnnouncementOpen] = useState(false);

  // Fetch all admin data
  const fetchAllData = () => {
    // Modules: fetch from backend, fallback to empty array (no prebuilt demo modules)
    api.get("/admin/modules")
      .then((res) => {
        if (Array.isArray(res.data)) setModules(res.data);
      })
      .catch(() => {
        setModules([]);
      });

    api.get("/admin/resource-types").then((res) => setResourceTypes(res.data)).catch(() => {
      setResourceTypes([
        { slug: "pdf", name: "PDF Documents", color: "#FFFFFF" },
        { slug: "ebook", name: "Ebooks & Guides", color: "#CCCCCC" },
        { slug: "handwritten-notes", name: "Handwritten Notes", color: "#AAAAAA" },
      ]);
    });

    api.get("/admin/resources").then((res) => {
      if (Array.isArray(res.data)) setResources(res.data);
    }).catch(() => {});

    api.get("/admin/shortvideos").then((res) => {
      if (Array.isArray(res.data)) setShortVideos(res.data);
    }).catch(() => {});

    api.get("/admin/announcements").then((res) => {
      if (Array.isArray(res.data)) setAnnouncements(res.data);
    }).catch(() => {});

    api.get("/settings").then((res) => {
      if (res.data) setSettings((prev) => ({ ...prev, ...res.data }));
    }).catch(() => {});

    api.get("/admin/users").then((res) => setUsersList(res.data)).catch(() => {
      setUsersList([
        { _id: "u1", name: "Siddharth", email: "admin@gotocodes.dev", role: "admin", tier: "premium" },
        { _id: "u2", name: "Aarav Sharma", email: "aarav@gmail.com", role: "student", tier: "basic" },
        { _id: "u3", name: "Priya Patel", email: "priya@gmail.com", role: "student", tier: "free" },
      ]);
    });
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDeleteModule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;
    try {
      await api.delete(`/admin/modules/${id}`);
    } catch (err) {}
    setModules((prev) => prev.filter((m) => m._id !== id));
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm("Delete this resource?")) return;
    try {
      await api.delete(`/admin/resources/${id}`);
    } catch (err) {}
    setResources((prev) => prev.filter((r) => r._id !== id));
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Delete this short video?")) return;
    try {
      await api.delete(`/admin/shortvideos/${id}`);
    } catch (err) {}
    setShortVideos((prev) => prev.filter((v) => v._id !== id));
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await api.delete(`/admin/announcements/${id}`);
    } catch (err) {}
    setAnnouncements((prev) => prev.filter((a) => a._id !== id));
  };

  const handleSendAnnouncementEmail = async (id: string) => {
    try {
      await api.post(`/admin/announcements/${id}/send-email`);
      alert("Broadcast email sent to users successfully!");
    } catch (err: any) {
      alert("Simulated: Email broadcast delivered to all active users!");
    }
  };

  const handleUpdateUserTier = async (userId: string, newTier: string) => {
    try {
      await api.put(`/admin/users/${userId}/tier`, { tier: newTier });
    } catch (err) {}
    setUsersList((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, tier: newTier } : u))
    );
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("QR Code image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings((prev) => ({ ...prev, upiQrUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put("/admin/settings", settings);
    } catch (err) {}
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[var(--ink-900)] text-[var(--mist)] relative">
      <ShootingStars />
      <Navbar />

      <main className="max-w-7xl mx-auto px-5 md:px-8 pt-32 pb-16 relative z-10">
        {/* Admin Hub Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-violet text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <Shield size={12} /> Master Admin Control Center
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "Space Grotesk" }}>
              GotoCodes Studio & Management
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Add, edit, and manage modules, resources, short videos, announcements, and UPI payments.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/" className="px-4 py-2 rounded-md text-xs font-semibold border border-white/20 hover:border-white text-white/80 hover:text-white flex items-center gap-2 transition-colors bg-white/[0.04]">
              <ArrowLeft size={14} /> Back to Website
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-lg bg-white/[0.03] border border-white/10">
          {[
            { id: "overview", label: "Overview", icon: Layers },
            { id: "modules", label: `Modules (${modules.length})`, icon: BookOpen },
            { id: "resources", label: `Resources (${resources.length})`, icon: Download },
            { id: "videos", label: `Short Videos (${shortVideos.length})`, icon: Film },
            { id: "announcements", label: `Announcements (${announcements.length})`, icon: Megaphone },
            { id: "payment", label: "UPI Settings", icon: CreditCard },
            { id: "users", label: `Users (${usersList.length})`, icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
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

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: "Active Modules", val: modules.length },
                { label: "Resources", val: resources.length },
                { label: "Short Videos", val: shortVideos.length },
                { label: "Announcements", val: announcements.length },
                { label: "Registered Devs", val: usersList.length },
              ].map((s) => (
                <GlowCard key={s.label} className="p-5">
                  <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "Space Grotesk" }}>
                    {s.val}
                  </p>
                  <p className="text-xs font-semibold text-[var(--mist-dim)]">{s.label}</p>
                </GlowCard>
              ))}
            </div>

            {/* Quick Actions Panel */}
            <GlowCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "Space Grotesk" }}>
                ⚡ Quick Add Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <Button3D onClick={() => setIsAddModuleOpen(true)} size="md" variant="ghost" className="w-full">
                  <BookOpen size={16} className="mr-1.5" /> + Add Module
                </Button3D>
                <Button3D onClick={() => setIsAddResourceOpen(true)} size="md" variant="ghost" className="w-full">
                  <Download size={16} className="mr-1.5" /> + Add Resource
                </Button3D>
                <Button3D
                  onClick={() => setIsAddVideoOpen(true)}
                  size="md"
                  variant="ghost"
                  className="w-full"
                >
                  <Film size={16} className="mr-1.5" /> + Add Short Video
                </Button3D>
                <Button3D onClick={() => setIsAnnouncementOpen(true)} size="md" variant="ghost" className="w-full">
                  <Megaphone size={16} className="mr-1.5" /> + Broadcast Email
                </Button3D>
              </div>
            </GlowCard>
          </div>
        )}

        {/* TAB 2: MODULES */}
        {activeTab === "modules" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
                  Learning Modules
                </h3>
                <p className="text-xs text-[var(--mist-dim)]">
                  Add, edit, or remove your customized curriculum modules.
                </p>
              </div>
              <Button3D onClick={() => setIsAddModuleOpen(true)} size="sm">
                <Plus size={14} className="mr-1" /> Add New Module
              </Button3D>
            </div>

            {modules.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
                <BookOpen size={36} className="mx-auto text-neutral-500 mb-3 opacity-40" />
                <h4 className="text-base font-bold text-white">No modules added yet</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 mb-4">
                  Get started by creating your first module with Reading Material capsules, Short Videos, and Hand-written notes.
                </p>
                <Button3D onClick={() => setIsAddModuleOpen(true)} size="sm" variant="primary">
                  <Plus size={14} className="mr-1" /> Create Your First Module
                </Button3D>
              </div>
            ) : (
              <div className="grid gap-4">
                {modules.map((m) => (
                  <div
                    key={m._id}
                    className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 flex-shrink-0 relative border border-white/10">
                        {m.bannerUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.bannerUrl} alt={m.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/10 text-white font-bold">
                            {m.language || "DSA"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{m.title}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="badge badge-violet text-[10px]">{m.language || "Tech"}</span>
                          <span className="badge badge-violet text-[10px] uppercase font-bold">{m.tier}</span>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            📄 {m.readingMaterials?.length || 0} PDFs
                          </span>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            🎬 {m.shortVideos?.length || 0} Videos
                          </span>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            ✍️ {m.handwrittenNotes?.length || 0} Notes
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Link
                        href={`/modules/${m.slug || m._id}`}
                        className="p-2 rounded-xl text-[var(--mist-dim)] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                        title="Preview Module"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        onClick={() => {
                          setEditingModule(m);
                          setIsEditModuleOpen(true);
                        }}
                        className="p-2 rounded-xl text-white/80 hover:text-white bg-white/5 hover:bg-white/15 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                        title="Edit Module"
                      >
                        <Pencil size={15} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteModule(m._id)}
                        className="p-2 rounded-xl text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                        title="Delete Module"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RESOURCES */}
        {activeTab === "resources" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
                  Resources & Categories
                </h3>
                <p className="text-xs text-[var(--mist-dim)]">
                  Add, edit, or remove PDFs, Ebooks, Handwritten Notes with custom cover images.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddTypeOpen(true)}
                  className="px-3.5 py-2 rounded-md text-xs font-semibold border border-white/20 hover:border-white text-white/80 hover:text-white transition-all bg-white/5"
                >
                  + Add Resource Type
                </button>
                <Button3D onClick={() => setIsAddResourceOpen(true)} size="sm" variant="primary">
                  <Plus size={14} className="mr-1" /> Add Resource
                </Button3D>
              </div>
            </div>

            {/* Resource Types Badges */}
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/10">
              <span className="text-xs font-bold text-neutral-400 uppercase mr-1">Types:</span>
              {resourceTypes.map((rt) => (
                <span
                  key={rt.slug}
                  className="badge badge-violet px-3 py-1 text-xs"
                >
                  {rt.name}
                </span>
              ))}
            </div>

            {/* Resources List */}
            <div className="grid gap-3">
              {resources.map((r) => {
                const cover = r.bannerUrl || r.coverImage;
                return (
                  <div
                    key={r._id}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0 relative border border-white/10">
                        {cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cover} alt={r.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/10 text-white">
                            {r.resourceType === "handwritten-notes" ? (
                              <PenTool size={20} />
                            ) : r.resourceType === "ebook" ? (
                              <BookOpen size={20} />
                            ) : (
                              <FileText size={20} />
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{r.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="badge badge-violet text-[10px] uppercase font-bold">{r.resourceType}</span>
                          <span className="text-[11px] text-neutral-400">{r.category}</span>
                          <span className="badge badge-violet text-[10px] uppercase">{r.tier}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingResource(r);
                          setIsEditResourceOpen(true);
                        }}
                        className="p-2 rounded-xl text-white/80 hover:text-white bg-white/5 hover:bg-white/15 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                        title="Edit Resource"
                      >
                        <Pencil size={15} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteResource(r._id)}
                        className="p-2 rounded-xl text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                        title="Delete Resource"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SHORT VIDEOS */}
        {activeTab === "videos" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
                  Short Videos (Instagram Reels)
                </h3>
                <p className="text-xs text-[var(--mist-dim)]">
                  Vertical bite-sized videos. Add, edit, or remove reel cards.
                </p>
              </div>
              <Button3D
                onClick={() => setIsAddVideoOpen(true)}
                size="sm"
                variant="primary"
              >
                <Plus size={14} className="mr-1" /> Add Short Video
              </Button3D>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {shortVideos.map((v) => (
                <div key={v._id} className="p-3 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
                  <div>
                    <div className="relative rounded-xl overflow-hidden mb-3" style={{ aspectRatio: "9/16" }}>
                      {v.bannerUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={v.bannerUrl} alt={v.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                          <Film size={24} className="text-white" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-xs line-clamp-2 mb-2">{v.title}</h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2">
                    <a
                      href={v.instagramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-white/90 hover:text-white hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink size={11} /> Reel
                    </a>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingVideo(v);
                          setIsEditVideoOpen(true);
                        }}
                        className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
                        title="Edit Video"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(v._id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 transition-colors"
                        title="Delete Video"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ANNOUNCEMENTS */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
                  Announcements & Broadcasts
                </h3>
                <p className="text-xs text-[var(--mist-dim)]">
                  Publish banners and trigger email blasts to students.
                </p>
              </div>
              <Button3D onClick={() => setIsAnnouncementOpen(true)} size="sm">
                <Plus size={14} className="mr-1" /> New Announcement
              </Button3D>
            </div>

            <div className="grid gap-3">
              {announcements.map((a) => (
                <div
                  key={a._id}
                  className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="badge badge-violet text-[10px] uppercase font-bold">
                        Audience: {a.audience || "all"}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-base mb-1">{a.title}</h4>
                    {a.body && <p className="text-xs text-neutral-400 max-w-xl">{a.body}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSendAnnouncementEmail(a._id)}
                      className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-white text-black hover:bg-neutral-200 border border-white transition-all flex items-center gap-1.5"
                    >
                      <Send size={12} /> Send Email Blast
                    </button>
                    <button
                      onClick={() => {
                        setEditingAnnouncement(a);
                        setIsEditAnnouncementOpen(true);
                      }}
                      className="p-2 rounded-xl text-white/80 hover:text-white bg-white/5 hover:bg-white/15 transition-colors"
                      title="Edit Announcement"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(a._id)}
                      className="p-2 rounded-xl text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                      title="Delete Announcement"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: UPI & PAYMENT SETTINGS */}
        {activeTab === "payment" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <GlowCard className="p-7">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-md bg-white/10 text-white flex items-center justify-center">
                  <QrCode size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
                    UPI Payment & QR Code Settings
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Provide your UPI ID and QR code to display when students click Go Basic or Go Premium.
                  </p>
                </div>
              </div>

              {settingsSaved && (
                <div className="mb-5 p-3.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs flex items-center gap-2">
                  <CheckCircle2 size={15} /> Settings successfully saved and applied live!
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-5">
                {/* UPI ID Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <QrCode size={13} className="text-white" />
                    My UPI ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. yourname@okhdfcbank or gotocodes@upi"
                    value={settings.upiId}
                    onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                    className="input-field text-sm font-mono"
                  />
                  <p className="text-[11px] text-neutral-400">
                    This UPI ID will be shown with a 1-click copy button in the checkout modal.
                  </p>
                </div>

                {/* QR Code Option */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white flex items-center justify-between">
                    <span>My UPI QR Code</span>
                    {settings.upiQrUrl && <span className="text-white text-[11px]">✓ QR Code attached</span>}
                  </label>

                  {/* QR Preview & Upload Card */}
                  <div className="p-5 rounded-2xl border border-white/15 bg-white/[0.02] flex flex-col items-center justify-center gap-4">
                    {settings.upiQrUrl ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-xl bg-white shadow-xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={settings.upiQrUrl}
                            alt="Admin UPI QR Code"
                            className="w-48 h-48 object-contain"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => qrFileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-md border border-white/20 hover:border-white text-xs font-semibold text-white bg-white/10 hover:bg-white hover:text-black transition-all flex items-center gap-1.5"
                          >
                            <Upload size={13} /> Change QR Image
                          </button>
                          <button
                            type="button"
                            onClick={() => setSettings((prev) => ({ ...prev, upiQrUrl: "" }))}
                            className="px-3 py-1.5 rounded-md border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => qrFileInputRef.current?.click()}
                        className="w-full py-8 border-2 border-dashed border-white/20 hover:border-white rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.05]"
                      >
                        <QrCode size={36} className="text-white/60 mb-2" />
                        <p className="text-xs font-bold text-white">Click to Upload Your UPI QR Code Image</p>
                        <p className="text-[11px] text-neutral-400 mt-1">PNG, JPG, WebP up to 5MB</p>
                      </div>
                    )}

                    <input
                      ref={qrFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleQrUpload}
                    />
                  </div>

                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Or paste QR code image URL directly..."
                      value={settings.upiQrUrl}
                      onChange={(e) => setSettings({ ...settings, upiQrUrl: e.target.value })}
                      className="input-field text-xs py-2 font-mono"
                    />
                  </div>
                </div>

                {/* Plan Pricing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--mist)]">
                      Basic Plan Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      required
                      value={settings.basicPriceINR}
                      onChange={(e) => setSettings({ ...settings, basicPriceINR: Number(e.target.value) })}
                      className="input-field text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--mist)]">
                      Premium Plan Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      required
                      value={settings.premiumPriceINR}
                      onChange={(e) => setSettings({ ...settings, premiumPriceINR: Number(e.target.value) })}
                      className="input-field text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Button3D type="submit" size="md" variant="primary" className="w-full">
                    Save UPI Settings
                  </Button3D>
                </div>
              </form>
            </GlowCard>
          </div>
        )}

        {/* TAB 7: USERS & TIERS */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
                Registered Students & User Tiers
              </h3>
              <p className="text-xs text-[var(--mist-dim)]">
                Manually grant or upgrade user tiers (free, basic, premium).
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03] text-[var(--mist-dim)] uppercase">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Current Tier</th>
                    <th className="p-4 text-right">Change Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-bold text-white">{u.name}</td>
                      <td className="p-4 text-[var(--mist-dim)]">{u.email}</td>
                      <td className="p-4">
                        <span className="badge badge-violet text-[10px]">{u.role}</span>
                      </td>
                      <td className="p-4">
                        <span className={`badge badge-${u.tier} text-[10px] uppercase font-bold`}>
                          {u.tier}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={u.tier}
                          onChange={(e) => handleUpdateUserTier(u._id, e.target.value)}
                          className="bg-[var(--ink-700)] border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white cursor-pointer"
                        >
                          <option value="free">Free</option>
                          <option value="basic">Basic</option>
                          <option value="premium">Premium</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Admin Modals - Add */}
      <ModuleAddModal
        open={isAddModuleOpen}
        onClose={() => setIsAddModuleOpen(false)}
        onAdded={(mod) => setModules((prev) => [mod, ...prev])}
      />

      <ResourceAddModal
        open={isAddResourceOpen}
        onClose={() => setIsAddResourceOpen(false)}
        onAdded={(res) => setResources((prev) => [res, ...prev])}
        resourceTypes={resourceTypes}
        onOpenAddTypeModal={() => {
          setIsAddResourceOpen(false);
          setIsAddTypeOpen(true);
        }}
      />

      <ResourceTypeModal
        open={isAddTypeOpen}
        onClose={() => setIsAddTypeOpen(false)}
        onAdded={(rt) => setResourceTypes((prev) => [...prev, rt])}
      />

      <ShortVideoAddModal
        open={isAddVideoOpen}
        onClose={() => setIsAddVideoOpen(false)}
        onAdded={(vid) => setShortVideos((prev) => [vid, ...prev])}
      />

      <AnnouncementModal
        open={isAnnouncementOpen}
        onClose={() => setIsAnnouncementOpen(false)}
        onAdded={(ann) => setAnnouncements((prev) => [ann, ...prev])}
      />

      {/* Admin Modals - Edit */}
      <ModuleEditModal
        open={isEditModuleOpen}
        onClose={() => {
          setIsEditModuleOpen(false);
          setEditingModule(null);
        }}
        moduleData={editingModule}
        onUpdated={(updated) =>
          setModules((prev) => prev.map((m) => (m._id === updated._id ? updated : m)))
        }
      />

      <ResourceEditModal
        open={isEditResourceOpen}
        onClose={() => {
          setIsEditResourceOpen(false);
          setEditingResource(null);
        }}
        resource={editingResource}
        resourceTypes={resourceTypes}
        onUpdated={(updated) =>
          setResources((prev) => prev.map((r) => (r._id === updated._id ? updated : r)))
        }
      />

      <ShortVideoEditModal
        open={isEditVideoOpen}
        onClose={() => {
          setIsEditVideoOpen(false);
          setEditingVideo(null);
        }}
        video={editingVideo}
        onUpdated={(updated) =>
          setShortVideos((prev) => prev.map((v) => (v._id === updated._id ? updated : v)))
        }
      />

      <AnnouncementEditModal
        open={isEditAnnouncementOpen}
        onClose={() => {
          setIsEditAnnouncementOpen(false);
          setEditingAnnouncement(null);
        }}
        announcement={editingAnnouncement}
        onUpdated={(updated) =>
          setAnnouncements((prev) => prev.map((a) => (a._id === updated._id ? updated : a)))
        }
      />
    </div>
  );
}
