"use client";

import { useState, useEffect } from "react";
import ShootingStars from "@/components/ui/ShootingStars";
import SiteHeader from "@/components/layout/SiteHeader";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ModulesSection from "@/components/sections/ModulesSection";
import ResourcesSection from "@/components/sections/ResourcesSection";
import ShortVideosSection from "@/components/sections/ShortVideosSection";
import PricingSection from "@/components/sections/PricingSection";
import AboutSection from "@/components/sections/AboutSection";

import ModuleAddModal from "@/components/admin/ModuleAddModal";
import ResourceAddModal from "@/components/admin/ResourceAddModal";
import ResourceTypeModal from "@/components/admin/ResourceTypeModal";
import ShortVideoAddModal from "@/components/admin/ShortVideoAddModal";
import AnnouncementModal from "@/components/admin/AnnouncementModal";
import AdminQuickBar from "@/components/admin/AdminQuickBar";
import api from "@/lib/api";

const INITIAL_RESOURCE_TYPES = [
  { slug: "pdf", name: "PDF Documents", icon: "file-text", color: "#FFFFFF" },
  { slug: "ebook", name: "Ebooks & Guides", icon: "book-open", color: "#CCCCCC" },
  { slug: "handwritten-notes", name: "Handwritten Notes", icon: "pen-tool", color: "#AAAAAA" },
];

const INITIAL_MODULES = [
  {
    _id: "mod-1",
    title: "DSA Mastery: 0 to 100",
    slug: "dsa-mastery",
    language: "DSA",
    description: "Arrays, Linked Lists, Trees, Graphs, DP — with pattern breakdowns, visual memory maps and LeetCode problem sets.",
    bannerUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    tier: "free" as const,
    lessons: [{ _id: "l1" }, { _id: "l2" }, { _id: "l3" }, { _id: "l4" }],
    order: 1,
  },
  {
    _id: "mod-2",
    title: "C++ STL Blueprint & Speed",
    slug: "cpp-stl-blueprint",
    language: "C++",
    description: "Write ultra-fast C++ for competitive programming and technical rounds. Vectors, Maps, Sets, Iterators demystified.",
    bannerUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    tier: "basic" as const,
    lessons: [{ _id: "l5" }, { _id: "l6" }],
    order: 2,
  },
  {
    _id: "mod-3",
    title: "MERN Production Architecture",
    slug: "mern-production-architecture",
    language: "MERN",
    description: "Build scalable real-world apps with React 19, Node.js, Express, MongoDB, Redis caching and secure JWT auth.",
    bannerUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    tier: "premium" as const,
    lessons: [{ _id: "l7" }, { _id: "l8" }, { _id: "l9" }],
    order: 3,
  },
];

const INITIAL_RESOURCES = [
  {
    _id: "res-1",
    title: "Ultimate DSA Patterns & Formulas Sheet",
    description: "Top 75 LeetCode patterns with visual algorithmic shortcuts and time-complexity breakdowns.",
    category: "DSA",
    resourceType: "pdf",
    bannerUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80",
    fileUrl: "#",
    tier: "free" as const,
    price: 0,
    isSellable: false,
  },
  {
    _id: "res-2",
    title: "Modern JavaScript Under The Hood (Ebook)",
    description: "Event Loop, Closures, Prototypes, Garbage Collection & Async V8 internals explained with clear visuals.",
    category: "JavaScript",
    resourceType: "ebook",
    bannerUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    fileUrl: "#",
    tier: "basic" as const,
    price: 199,
    isSellable: true,
  },
  {
    _id: "res-3",
    title: "Operating Systems & Concurrency Handwritten Notes",
    description: "Handwritten diagrams on Processes, Threads, Mutex locks, Semaphores, Paging, and Virtual Memory.",
    category: "Core CSE",
    resourceType: "handwritten-notes",
    bannerUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
    fileUrl: "#",
    tier: "free" as const,
    price: 0,
    isSellable: false,
  },
  {
    _id: "res-4",
    title: "System Design Primer & Cheat Sheet",
    description: "CAP theorem, Sharding, Consistent Hashing, Message Queues, Rate Limiters and Real-world Architectures.",
    category: "System Design",
    resourceType: "pdf",
    bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    fileUrl: "#",
    tier: "premium" as const,
    price: 349,
    isSellable: true,
  },
  {
    _id: "res-5",
    title: "The Pragmatic Fullstack Engineer (Ebook)",
    description: "End-to-end guide on building, deploying, monitoring and scaling production web apps in 2026.",
    category: "Fullstack",
    resourceType: "ebook",
    bannerUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    fileUrl: "#",
    tier: "premium" as const,
    price: 499,
    isSellable: true,
  },
  {
    _id: "res-6",
    title: "Computer Networks & Sockets Handwritten Notes",
    description: "OSI vs TCP/IP, Handshakes, DNS Resolution, WebSockets, HTTP/2 & HTTP/3 packet breakdowns in color.",
    category: "Core CSE",
    resourceType: "handwritten-notes",
    bannerUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80",
    fileUrl: "#",
    tier: "free" as const,
    price: 0,
    isSellable: false,
  },
];

const INITIAL_VIDEOS = [
  {
    _id: "vid-1",
    title: "How Two Pointers Works in 45 Seconds",
    description: "Visual intuition for Two Pointers pattern.",
    bannerUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    instagramLink: "https://www.instagram.com",
    tier: "free",
  },
  {
    _id: "vid-2",
    title: "Stop Using console.log Like This!",
    description: "Pro console debugging tricks in DevTools.",
    bannerUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80",
    instagramLink: "https://www.instagram.com",
    tier: "free",
  },
  {
    _id: "vid-3",
    title: "Binary Search Template You Will Never Forget",
    description: "The universal template that solves 99% of BS questions.",
    bannerUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    instagramLink: "https://www.instagram.com",
    tier: "free",
  },
];

export default function Home() {
  const [modules, setModules] = useState<any[]>(INITIAL_MODULES);
  const [resourceTypes, setResourceTypes] = useState<any[]>(INITIAL_RESOURCE_TYPES);
  const [resources, setResources] = useState<any[]>(INITIAL_RESOURCES);
  const [shortVideos, setShortVideos] = useState<any[]>(INITIAL_VIDEOS);
  const [settings, setSettings] = useState({
    basicPriceINR: 499,
    premiumPriceINR: 1499,
    upiId: "gotocodes@upi",
    upiName: "GotoCodes Education",
    aboutText: "5+ years in CSE lived the hard way so yours doesn't have to be.",
  });

  // Admin Modals State
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [isAddTypeOpen, setIsAddTypeOpen] = useState(false);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

  useEffect(() => {
    // Fetch live data from backend if available
    api.get("/modules").then((res) => {
      if (res.data?.length > 0) setModules(res.data);
    }).catch(() => {});

    api.get("/resource-types").then((res) => {
      if (res.data?.length > 0) setResourceTypes(res.data);
    }).catch(() => {});

    api.get("/resources").then((res) => {
      if (res.data?.length > 0) setResources(res.data);
    }).catch(() => {});

    api.get("/shortvideos").then((res) => {
      if (res.data?.length > 0) setShortVideos(res.data);
    }).catch(() => {});

    api.get("/settings").then((res) => {
      if (res.data) setSettings(res.data);
    }).catch(() => {});
  }, []);

  const handleAddModule = (newModule: any) => {
    setModules((prev) => [newModule, ...prev]);
  };

  const handleAddResource = (newResource: any) => {
    setResources((prev) => [newResource, ...prev]);
  };

  const handleAddResourceType = (newType: any) => {
    setResourceTypes((prev) => [...prev, newType]);
  };

  const handleAddVideo = (newVideo: any) => {
    setShortVideos((prev) => [newVideo, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[var(--ink-900)] text-[var(--mist)] selection:bg-white/20 selection:text-white relative">
      {/* Background shooting stars canvas */}
      <ShootingStars />

      {/* Unified Header: Announcement Bar + Navigation */}
      <SiteHeader />

      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />

        <ModulesSection
          modules={modules}
          onOpenAdd={() => setIsAddModuleOpen(true)}
        />

        <ResourcesSection
          resources={resources}
          resourceTypes={resourceTypes}
          onOpenAddResource={() => setIsAddResourceOpen(true)}
          onOpenAddType={() => setIsAddTypeOpen(true)}
        />

        <ShortVideosSection
          videos={shortVideos}
          onOpenAddVideo={() => setIsAddVideoOpen(true)}
        />

        <PricingSection settings={settings} />

        <AboutSection settings={settings} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Admin Floating Quick Studio Bar */}
      <AdminQuickBar
        onOpenAddModule={() => setIsAddModuleOpen(true)}
        onOpenAddResource={() => setIsAddResourceOpen(true)}
        onOpenAddType={() => setIsAddTypeOpen(true)}
        onOpenAddVideo={() => setIsAddVideoOpen(true)}
        onOpenAnnouncement={() => setIsAnnouncementOpen(true)}
      />

      {/* Admin Modals */}
      <ModuleAddModal
        open={isAddModuleOpen}
        onClose={() => setIsAddModuleOpen(false)}
        onAdded={handleAddModule}
      />

      <ResourceAddModal
        open={isAddResourceOpen}
        onClose={() => setIsAddResourceOpen(false)}
        onAdded={handleAddResource}
        resourceTypes={resourceTypes}
        onOpenAddTypeModal={() => {
          setIsAddResourceOpen(false);
          setIsAddTypeOpen(true);
        }}
      />

      <ResourceTypeModal
        open={isAddTypeOpen}
        onClose={() => setIsAddTypeOpen(false)}
        onAdded={handleAddResourceType}
      />

      <ShortVideoAddModal
        open={isAddVideoOpen}
        onClose={() => setIsAddVideoOpen(false)}
        onAdded={handleAddVideo}
      />

      <AnnouncementModal
        open={isAnnouncementOpen}
        onClose={() => setIsAnnouncementOpen(false)}
        onAdded={() => {}}
      />
    </div>
  );
}
