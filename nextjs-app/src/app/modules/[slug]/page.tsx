"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Play,
  FileCode,
  Copy,
  Check,
  Download,
  FileText,
  Film,
  PenTool,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button3D from "@/components/ui/Button3D";
import GlowCard from "@/components/ui/GlowCard";
import ShootingStars from "@/components/ui/ShootingStars";
import api from "@/lib/api";

export default function ModuleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [moduleData, setModuleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLessonIdx, setSelectedLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([0]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"reading" | "videos" | "notes" | "lessons">("reading");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .get(`/modules/${slug}`)
      .then((res) => {
        if (res.data) {
          setModuleData(res.data);
          // Set initial active tab based on what content exists
          if (res.data.readingMaterials?.length > 0) setActiveTab("reading");
          else if (res.data.shortVideos?.length > 0) setActiveTab("videos");
          else if (res.data.handwrittenNotes?.length > 0) setActiveTab("notes");
          else if (res.data.lessons?.length > 0) setActiveTab("lessons");
        }
      })
      .catch(() => {
        setModuleData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const activeLesson = moduleData?.lessons?.[selectedLessonIdx] || null;

  const handleCopyCode = () => {
    if (activeLesson?.code) {
      navigator.clipboard.writeText(activeLesson.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleComplete = (idx: number) => {
    if (completedLessons.includes(idx)) {
      setCompletedLessons((prev) => prev.filter((i) => i !== idx));
    } else {
      setCompletedLessons((prev) => [...prev, idx]);
    }
  };

  const hasReading = moduleData?.readingMaterials && moduleData.readingMaterials.length > 0;
  const hasVideos = moduleData?.shortVideos && moduleData.shortVideos.length > 0;
  const hasNotes = moduleData?.handwrittenNotes && moduleData.handwrittenNotes.length > 0;
  const hasLessons = moduleData?.lessons && moduleData.lessons.length > 0;

  return (
    <div className="min-h-screen bg-[var(--ink-900)] text-[var(--mist)] relative">
      <ShootingStars />
      <Navbar />

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-10 pt-28 relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[var(--mist-dim)] mb-6">
          <Link href="/#modules" className="hover:text-white flex items-center gap-1 transition-colors">
            <ArrowLeft size={13} /> Back to Modules
          </Link>
          {moduleData && (
            <>
              <span>/</span>
              <span className="text-white font-medium truncate max-w-xs">{moduleData.title}</span>
            </>
          )}
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-neutral-400 font-mono">Loading module...</p>
          </div>
        ) : !moduleData ? (
          <div className="p-12 text-center rounded-2xl border border-white/10 bg-white/[0.02]">
            <BookOpen size={40} className="mx-auto text-neutral-500 mb-3 opacity-40" />
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Space Grotesk" }}>
              Module Not Found
            </h2>
            <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6">
              This module may have been removed or is currently being updated.
            </p>
            <Link href="/#modules">
              <Button3D size="sm" variant="primary">
                Return to Modules
              </Button3D>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Hero Banner Card */}
            <div className="rounded-2xl border border-white/10 overflow-hidden relative bg-white/[0.03]">
              <div className="grid md:grid-cols-12 gap-6 p-6 md:p-8 items-center">
                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-violet text-xs font-semibold">{moduleData.language}</span>
                    <span className="badge badge-violet text-xs uppercase font-bold">{moduleData.tier}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "Space Grotesk" }}>
                    {moduleData.title}
                  </h1>
                  <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl">
                    {moduleData.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-neutral-400 font-mono">
                    <span>📄 {moduleData.readingMaterials?.length || 0} Reading Capsules</span>
                    <span>•</span>
                    <span>🎬 {moduleData.shortVideos?.length || 0} Short Videos</span>
                    <span>•</span>
                    <span>✍️ {moduleData.handwrittenNotes?.length || 0} Handwritten Notes</span>
                  </div>
                </div>

                {moduleData.bannerUrl && (
                  <div className="md:col-span-4 h-48 md:h-44 rounded-xl overflow-hidden border border-white/10 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={moduleData.bannerUrl}
                      alt={moduleData.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Tabs for Module Content */}
            <div className="flex flex-wrap gap-2 p-1.5 rounded-lg bg-white/[0.03] border border-white/10">
              <button
                onClick={() => setActiveTab("reading")}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${activeTab === "reading"
                    ? "bg-white text-black shadow-sm"
                    : "text-neutral-400 hover:text-white hover:bg-white/10"
                  }`}
              >
                <FileText size={15} />
                Reading Material ({moduleData.readingMaterials?.length || 0})
              </button>

              <button
                onClick={() => setActiveTab("videos")}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${activeTab === "videos"
                    ? "bg-white text-black shadow-sm"
                    : "text-neutral-400 hover:text-white hover:bg-white/10"
                  }`}
              >
                <Film size={15} />
                Short Videos ({moduleData.shortVideos?.length || 0})
              </button>

              <button
                onClick={() => setActiveTab("notes")}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${activeTab === "notes"
                    ? "bg-white text-black shadow-sm"
                    : "text-neutral-400 hover:text-white hover:bg-white/10"
                  }`}
              >
                <PenTool size={15} />
                Hand-written Notes ({moduleData.handwrittenNotes?.length || 0})
              </button>

              {hasLessons && (
                <button
                  onClick={() => setActiveTab("lessons")}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${activeTab === "lessons"
                      ? "bg-white text-black shadow-sm"
                      : "text-neutral-400 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <BookOpen size={15} />
                  Curriculum Lessons ({moduleData.lessons?.length || 0})
                </button>
              )}
            </div>

            {/* TAB 1: READING MATERIAL (PDFs / Capsules) */}
            {activeTab === "reading" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "Space Grotesk" }}>
                    <FileText size={20} className="text-white" />
                    Reading Material (PDFs & Capsules)
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">
                    {moduleData.readingMaterials?.length || 0} available
                  </span>
                </div>

                {!hasReading ? (
                  <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
                    <FileText size={32} className="mx-auto text-neutral-500 mb-2 opacity-40" />
                    <p className="text-sm font-semibold text-white">No reading capsules added yet</p>
                    <p className="text-xs text-neutral-400 mt-1">Reading materials will be available here once added.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {moduleData.readingMaterials.map((rm: any, idx: number) => (
                      <GlowCard key={idx} className="p-5 flex flex-col justify-between rounded-xl">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="badge badge-violet text-[10px] font-bold">
                              Capsule #{idx + 1}
                            </span>
                            <FileText size={16} className="text-neutral-400" />
                          </div>
                          <h4 className="font-bold text-white text-base mb-1" style={{ fontFamily: "Space Grotesk" }}>
                            {rm.title}
                          </h4>
                          {rm.description && (
                            <p className="text-xs text-neutral-400 line-clamp-2 mb-4">
                              {rm.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-neutral-500">PDF Document</span>
                          <a
                            href={rm.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-black hover:bg-neutral-200 border border-white transition-all flex items-center gap-1.5"
                          >
                            <Download size={13} /> Open / Download
                          </a>
                        </div>
                      </GlowCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SHORT VIDEOS */}
            {activeTab === "videos" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "Space Grotesk" }}>
                    <Film size={20} className="text-white" />
                    Short Videos & Reels
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">
                    {moduleData.shortVideos?.length || 0} clips
                  </span>
                </div>

                {!hasVideos ? (
                  <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
                    <Film size={32} className="mx-auto text-neutral-500 mb-2 opacity-40" />
                    <p className="text-sm font-semibold text-white">No short videos added yet</p>
                    <p className="text-xs text-neutral-400 mt-1">Short video reels for this module will appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {moduleData.shortVideos.map((sv: any, idx: number) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 flex flex-col justify-between hover:border-white/30 transition-all"
                      >
                        <div>
                          <div
                            className="relative rounded-xl overflow-hidden mb-3 bg-neutral-900 border border-white/10"
                            style={{ height: "220px" }}
                          >
                            {sv.bannerUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={sv.bannerUrl} alt={sv.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-white/5">
                                <Play size={28} className="text-white/60" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-2 left-2 right-2">
                              <span className="badge badge-violet text-[9px]">Reel #{idx + 1}</span>
                            </div>
                          </div>

                          <h4 className="font-bold text-white text-xs line-clamp-2 mb-1">
                            {sv.title}
                          </h4>
                          {sv.description && (
                            <p className="text-[11px] text-neutral-400 line-clamp-1 mb-2">
                              {sv.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-white/10 mt-2">
                          <a
                            href={sv.instagramLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-1.5 rounded-md text-xs font-semibold bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Play size={12} fill="currentColor" /> Watch Reel
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: HANDWRITTEN NOTES */}
            {activeTab === "notes" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "Space Grotesk" }}>
                    <PenTool size={20} className="text-white" />
                    Hand-written Notes
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">
                    {moduleData.handwrittenNotes?.length || 0} sheets
                  </span>
                </div>

                {!hasNotes ? (
                  <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
                    <PenTool size={32} className="mx-auto text-neutral-500 mb-2 opacity-40" />
                    <p className="text-sm font-semibold text-white">No hand-written notes added yet</p>
                    <p className="text-xs text-neutral-400 mt-1">Hand-written notes and formulas will be listed here.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {moduleData.handwrittenNotes.map((hn: any, idx: number) => (
                      <GlowCard key={idx} className="p-5 flex flex-col justify-between rounded-xl">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="badge badge-violet text-[10px] font-bold">
                              Notes #{idx + 1}
                            </span>
                            <PenTool size={16} className="text-neutral-400" />
                          </div>
                          <h4 className="font-bold text-white text-base mb-1" style={{ fontFamily: "Space Grotesk" }}>
                            {hn.title}
                          </h4>
                          {hn.description && (
                            <p className="text-xs text-neutral-400 line-clamp-2 mb-4">
                              {hn.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-neutral-500">Handwritten PDF</span>
                          <a
                            href={hn.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-black hover:bg-neutral-200 border border-white transition-all flex items-center gap-1.5"
                          >
                            <Download size={13} /> View Notes
                          </a>
                        </div>
                      </GlowCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: CURRICULUM LESSONS */}
            {activeTab === "lessons" && hasLessons && (
              <div className="grid lg:grid-cols-12 gap-8">
                {/* Sidebar Lesson List */}
                <div className="lg:col-span-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-1">
                    Curriculum Lessons ({moduleData.lessons?.length || 0})
                  </h3>

                  <div className="space-y-2">
                    {moduleData.lessons.map((lesson: any, i: number) => {
                      const isSelected = selectedLessonIdx === i;
                      const isDone = completedLessons.includes(i);
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedLessonIdx(i)}
                          className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${isSelected
                              ? "border-white bg-white/10 shadow-sm"
                              : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleComplete(i);
                              }}
                              className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors cursor-pointer text-xs font-bold ${isDone
                                  ? "bg-white text-black border border-white"
                                  : "border border-white/20 hover:border-white text-transparent"
                                }`}
                              title={isDone ? "Completed" : "Mark as completed"}
                            >
                              ✓
                            </div>
                            <div>
                              <p className={`text-xs font-bold ${isSelected ? "text-white" : "text-neutral-300"}`}>
                                {lesson.title}
                              </p>
                              {lesson.duration && (
                                <span className="text-[11px] text-neutral-500 font-mono">
                                  {lesson.duration}
                                </span>
                              )}
                            </div>
                          </div>

                          <ChevronRight
                            size={14}
                            className={isSelected ? "text-white" : "text-neutral-500"}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lesson Content Area */}
                <div className="lg:col-span-8 space-y-6">
                  {activeLesson && (
                    <GlowCard className="p-6 md:p-8 rounded-xl border border-white/10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
                        <div>
                          <span className="badge badge-violet text-xs mb-2">Lesson #{selectedLessonIdx + 1}</span>
                          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
                            {activeLesson.title}
                          </h2>
                        </div>

                        <button
                          onClick={() => toggleComplete(selectedLessonIdx)}
                          className={`px-4 py-2 rounded-md text-xs font-semibold border transition-all flex items-center gap-2 ${completedLessons.includes(selectedLessonIdx)
                              ? "border-white bg-white text-black"
                              : "border-white/20 hover:border-white text-neutral-300 hover:text-white bg-white/5"
                            }`}
                        >
                          <CheckCircle2 size={15} />
                          {completedLessons.includes(selectedLessonIdx) ? "Completed ✓" : "Mark as Completed"}
                        </button>
                      </div>

                      {/* Lesson Text Explanation */}
                      <div className="text-sm leading-relaxed text-neutral-300 whitespace-pre-line mb-6 font-sans">
                        {activeLesson.content}
                      </div>

                      {/* Code Snippet Box */}
                      {activeLesson.code && (
                        <div className="rounded-xl border border-white/10 bg-black overflow-hidden">
                          <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                              <FileCode size={13} className="text-white" />
                              <span>Code Implementation</span>
                            </div>

                            <button
                              onClick={handleCopyCode}
                              className="px-2.5 py-1 rounded text-xs font-mono text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1.5"
                            >
                              {copied ? (
                                <>
                                  <Check size={12} className="text-white" /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy size={12} /> Copy Code
                                </>
                              )}
                            </button>
                          </div>

                          <pre className="p-4 text-xs font-mono overflow-x-auto text-neutral-200 leading-relaxed selection:bg-white selection:text-black">
                            <code>{activeLesson.code}</code>
                          </pre>
                        </div>
                      )}
                    </GlowCard>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
