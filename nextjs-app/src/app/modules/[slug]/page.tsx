"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Share2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button3D from "@/components/ui/Button3D";
import GlowCard from "@/components/ui/GlowCard";
import ShootingStars from "@/components/ui/ShootingStars";
import api from "@/lib/api";

const SAMPLE_MODULES: Record<string, any> = {
  "dsa-mastery": {
    title: "DSA Mastery: 0 to 100",
    language: "DSA",
    tier: "free",
    bannerUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    description: "Arrays, Linked Lists, Trees, Graphs, DP — with pattern breakdowns, visual memory maps and LeetCode problem sets.",
    lessons: [
      {
        title: "1. Time & Space Complexity Masterclass",
        duration: "18 mins",
        content: `Understanding Big-O isn't about memorizing tables; it's about predicting growth curves.

Key Rules:
1. Drop non-dominant terms: O(N² + N) becomes O(N²).
2. Drop constants: O(2N) becomes O(N).
3. Different inputs mean different variables: traversing Array A and Array B is O(A + B), NOT O(2N).`,
        code: `// Two-Pointer O(N) Time, O(1) Space Example
function twoSumSorted(arr: number[], target: number): [number, number] | null {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }

  return null;
}`,
      },
      {
        title: "2. Sliding Window & Two Pointers",
        duration: "25 mins",
        content: `Whenever a problem asks for maximum/minimum subarray or substring with a given property, think Sliding Window.

Static Window: Window size K is fixed.
Dynamic Window: Window expands right until invariant breaks, then shrinks left.`,
        code: `// Maximum Sum Subarray of Size K
function maxSumSubarray(arr: number[], k: number): number {
  let maxSum = 0;
  let windowSum = 0;

  for (let i = 0; i < arr.length; i++) {
    windowSum += arr[i];
    if (i >= k - 1) {
      maxSum = Math.max(maxSum, windowSum);
      windowSum -= arr[i - (k - 1)];
    }
  }

  return maxSum;
}`,
      },
      {
        title: "3. Fast & Slow Pointers (Floyd's Cycle)",
        duration: "22 mins",
        content: `Floyd's Cycle detection moves slow by 1 step and fast by 2 steps. If there is a loop, fast will inevitably lap slow inside the loop.`,
        code: `function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }

  return false;
}`,
      },
    ],
  },
};

export default function ModuleDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "dsa-mastery";

  const [moduleData, setModuleData] = useState<any>(SAMPLE_MODULES[slug] || SAMPLE_MODULES["dsa-mastery"]);
  const [selectedLessonIdx, setSelectedLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([0]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get(`/modules/${slug}`)
      .then((res) => {
        if (res.data) setModuleData(res.data);
      })
      .catch(() => {});
  }, [slug]);

  const activeLesson = moduleData?.lessons?.[selectedLessonIdx] || {
    title: "Lesson Introduction",
    content: "Lesson content is loading or in progress.",
    code: "// Code snippet coming soon",
  };

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

  return (
    <div className="min-h-screen bg-[var(--ink-900)] text-[var(--mist)] relative">
      <ShootingStars />
      <Navbar />

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-10 relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[var(--mist-dim)] mb-6">
          <Link href="/#modules" className="hover:text-white flex items-center gap-1">
            <ArrowLeft size={13} /> Back to Modules
          </Link>
          <span>/</span>
          <span className="text-white font-medium">{moduleData.title}</span>
        </div>

        {/* Hero Banner Card */}
        <div className="p-6 md:p-8 rounded-2xl border border-white/10 mb-8 relative overflow-hidden bg-white/[0.03]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge badge-violet text-xs font-semibold">{moduleData.language}</span>
                <span className="badge badge-violet text-xs uppercase font-bold">{moduleData.tier}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: "Space Grotesk" }}>
                {moduleData.title}
              </h1>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {moduleData.description}
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
              <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-right w-full sm:w-auto">
                <p className="text-xs text-neutral-400 mb-1">Module Progress</p>
                <p className="text-xl font-bold text-white font-mono">
                  {Math.round((completedLessons.length / (moduleData.lessons?.length || 1)) * 100)}%
                </p>
                <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden mt-1.5">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{
                      width: `${Math.round(
                        (completedLessons.length / (moduleData.lessons?.length || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Lesson Viewer */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar Lesson List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-1">
              Curriculum Lessons ({moduleData.lessons?.length || 0})
            </h3>

            <div className="space-y-2">
              {moduleData.lessons?.map((lesson: any, i: number) => {
                const isSelected = selectedLessonIdx === i;
                const isDone = completedLessons.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedLessonIdx(i)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                      isSelected
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
                        className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors cursor-pointer text-xs font-bold ${
                          isDone
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
                  className={`px-4 py-2 rounded-md text-xs font-semibold border transition-all flex items-center gap-2 ${
                    completedLessons.includes(selectedLessonIdx)
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

              {/* Lesson Footer Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-8">
                <button
                  disabled={selectedLessonIdx === 0}
                  onClick={() => setSelectedLessonIdx((p) => Math.max(0, p - 1))}
                  className="px-4 py-2 rounded-md text-xs font-semibold text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
                >
                  ← Previous Lesson
                </button>

                <Button3D
                  onClick={() => {
                    toggleComplete(selectedLessonIdx);
                    if (selectedLessonIdx < (moduleData.lessons?.length || 1) - 1) {
                      setSelectedLessonIdx((p) => p + 1);
                    }
                  }}
                  size="sm"
                  variant="primary"
                >
                  {selectedLessonIdx < (moduleData.lessons?.length || 1) - 1
                    ? "Next Lesson →"
                    : "Finish Module 🏆"}
                </Button3D>
              </div>
            </GlowCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
