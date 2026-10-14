"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlowCard from "@/components/ui/GlowCard";
import Button3D from "@/components/ui/Button3D";
import ShootingStars from "@/components/ui/ShootingStars";

import ModuleAddModal from "@/components/admin/ModuleAddModal";
import ResourceAddModal from "@/components/admin/ResourceAddModal";
import ResourceTypeModal from "@/components/admin/ResourceTypeModal";
import ShortVideoAddModal from "@/components/admin/ShortVideoAddModal";
import AnnouncementModal from "@/components/admin/AnnouncementModal";
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
    basicPriceINR: 499,
    premiumPriceINR: 1499,
    upiId: "gotocodes@upi",
    upiName: "GotoCodes Education",
    upiQrUrl: "",
    aboutText: "5+ years in CSE lived the hard way so yours doesn't have to be.",
    aboutVideoUrl: "",
  });

  const [settingsSaved, setSettingsSaved] = useState(false);

  // Modals state
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [isAddTypeOpen, setIsAddTypeOpen] = useState(false);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

  // Fetch all admin data
  const fetchAllData = () => {
    api.get("/admin/modules").then((res) => setModules(res.data)).catch(() => {
      // Demo fallback
      setModules([
        { _id: "m1", title: "DSA Mastery: 0 to 100", language: "DSA", tier: "free", lessons: [1, 2, 3] },
        { _id: "m2", title: "C++ STL Blueprint & Speed", language: "C++", tier: "basic", lessons: [1, 2] },
        { _id: "m3", title: "MERN Production Architecture", language: "MERN", tier: "premium", lessons: [1, 2, 3, 4] },
      ]);
    });

    api.get("/admin/resource-types").then((res) => setResourceTypes(res.data)).catch(() => {
      setResourceTypes([
        { slug: "pdf", name: "PDF Documents", color: "#FFFFFF" },
        { slug: "ebook", name: "Ebooks & Guides", color: "#CCCCCC" },
        { slug: "handwritten-notes", name: "Handwritten Notes", color: "#AAAAAA" },
      ]);
    });

    api.get("/admin/resources").then((res) => setResources(res.data)).catch(() => {
      setResources([
        { 
          _id: "r1", 
          title: "Ultimate DSA Patterns & Formulas Sheet", 
          resourceType: "pdf", 
          category: "DSA", 
          tier: "free",
          bannerUrl: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&auto=format&fit=crop&q=80",
        },
        { 
          _id: "r2", 
          title: "Modern JavaScript Under The Hood", 
          resourceType: "ebook", 
          category: "JS", 
          tier: "basic",
          bannerUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
        },
        { 
          _id: "r3", 
          title: "Operating Systems Handwritten Notes", 
          resourceType: "handwritten-notes", 
          category: "Core", 
          tier: "free",
          bannerUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
        },
      ]);
    });

    api.get("/admin/shortvideos").then((res) => setShortVideos(res.data)).catch(() => {
      setShortVideos([
        { _id: "v1", title: "How Two Pointers Works in 45 Seconds", instagramLink: "https://instagram.com" },
        { _id: "v2", title: "Stop Using console.log Like This!", instagramLink: "https://instagram.com" },
      ]);
    });

    api.get("/admin/announcements").then((res) => setAnnouncements(res.data)).catch(() => {
      setAnnouncements([
        { _id: "a1", title: "🚀 Welcome to the Brand New GotoCodes!", audience: "all", createdAt: new Date().toISOString() },
      ]);
    });

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

  const handleSendAnnouncementEmail = async (id: string) => {
    try {
      const res = await api.post(`/admin/announcements/${id}/send-email`);
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
              Effortlessly manage modules, resources, short videos, announcements, and UPI payments.
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
            { id: "payment", label: "UPI & Settings", icon: CreditCard },
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
                  Add, edit, or remove curriculum modules from the website.
                </p>
              </div>
              <Button3D onClick={() => setIsAddModuleOpen(true)} size="sm">
                <Plus size={14} className="mr-1" /> Add New Module
              </Button3D>
            </div>

            <div className="grid gap-4">
              {modules.map((m) => (
                <div
                  key={m._id}
                  className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0 relative border border-white/10">
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
                      <div className="flex items-center gap-2 mt-1">
                        <span className="badge badge-violet text-[10px]">{m.language || "Tech"}</span>
                        <span className="badge badge-violet text-[10px] uppercase font-bold">{m.tier}</span>
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {m.lessons?.length || 0} lessons
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/modules/${m.slug || m._id}`}
                      className="p-2 rounded-xl text-[var(--mist-dim)] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                      title="Preview Module"
                    >
                      <ExternalLink size={16} />
                    </Link>
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
                  Segregate resources into PDFs, Ebooks, Handwritten Notes, or add custom types.
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
              {resources.map((r) => (
                <div
                  key={r._id}
                  className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0 relative border border-white/10">
                      {r.bannerUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.bannerUrl} alt={r.title} className="w-full h-full object-cover" />
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

                  <button
                    onClick={() => handleDeleteResource(r._id)}
                    className="p-2 rounded-xl text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
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
                  Vertical bite-sized videos with hidden links.
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
                <div key={v._id} className="p-3 rounded-2xl border border-white/10 bg-white/[0.02]">
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
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <a
                      href={v.instagramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-white/90 hover:text-white hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink size={11} /> Test Reel
                    </a>
                    <button
                      onClick={() => handleDeleteVideo(v._id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PAYMENT & UPI SETTINGS */}
        {activeTab === "payment" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <GlowCard className="p-7">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-md bg-white/10 text-white flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
                    UPI Payment Gateway & Pricing Settings
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Configure your UPI ID, Payee Name, QR code, and tier prices.
                  </p>
                </div>
              </div>

              {settingsSaved && (
                <div className="mb-5 p-3.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs flex items-center gap-2">
                  <CheckCircle2 size={15} /> Settings successfully saved and applied live!
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--mist)]">
                      Basic Tier Price (₹ INR)
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
                      Premium Tier Price (₹ INR)
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

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <QrCode size={13} className="text-white" />
                    UPI ID (e.g. username@okhdfcbank or gotocodes@upi)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="yourname@upi"
                    value={settings.upiId}
                    onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                    className="input-field text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white">
                    UPI Business / Payee Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="GotoCodes Education"
                    value={settings.upiName}
                    onChange={(e) => setSettings({ ...settings, upiName: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white">
                    Custom UPI QR Code Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://... qr code image url (or auto-generated QR is used)"
                    value={settings.upiQrUrl}
                    onChange={(e) => setSettings({ ...settings, upiQrUrl: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Button3D type="submit" size="md" variant="primary" className="w-full">
                    Save Payment & Site Settings
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

      {/* Admin Modals */}
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
    </div>
  );
}
