import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, PlayCircle } from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button3D from "../components/Button3D";

export default function ModulePage() {
  const { slug } = useParams();
  const [module, setModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/modules/${slug}`)
      .then((r) => setModule(r.data))
      .catch(() => setError("Module not found."));
  }, [slug]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-mist-dim font-mono">{error}</div>
        <Footer />
      </div>
    );
  }

  if (!module) {
    return <div className="min-h-screen flex items-center justify-center text-mist-dim font-mono">loading module...</div>;
  }

  const lesson = module.lessons[activeLesson];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-6xl mx-auto w-full px-5 md:px-8 py-10 flex-1">
        <Link to="/#modules" className="inline-flex items-center gap-2 text-mist-dim hover:text-mist text-sm font-mono mb-6">
          <ArrowLeft size={16} /> all modules
        </Link>

        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal mb-2">{module.language}</p>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-mist">{module.title}</h1>
          <p className="text-mist-dim mt-2 max-w-2xl">{module.description}</p>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          {/* lesson list - file tree style */}
          <div className="bg-ink-700 border border-white/5 rounded-2xl overflow-hidden h-fit">
            <div className="px-4 py-3 bg-ink-600 font-mono text-xs text-mist-dim border-b border-white/5">
              lessons/
            </div>
            <ul>
              {module.lessons.map((l, i) => (
                <li key={l._id || i}>
                  <button
                    onClick={() => setActiveLesson(i)}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between gap-2 text-sm border-b border-white/5 last:border-0 transition-colors ${
                      activeLesson === i ? "bg-violet/10 text-violet-light" : "text-mist-dim hover:bg-white/5"
                    }`}
                  >
                    <span className="truncate">{l.title}</span>
                    {l.locked && <Lock size={13} className="shrink-0" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* lesson content - terminal window */}
          <motion.div
            key={activeLesson}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-ink-700 border border-white/5 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-ink-600 border-b border-white/5">
              <span className="dot bg-[#FF5F57]" />
              <span className="dot bg-[#FEBC2E]" />
              <span className="dot bg-[#28C840]" />
              <span className="ml-3 font-mono text-xs text-mist-dim truncate">
                ~/gotocodes/{lesson?.filePath}
              </span>
            </div>

            <div className="p-6 min-h-[300px]">
              {lesson?.locked ? (
                <div className="flex flex-col items-center justify-center h-full py-16 gap-4 text-center">
                  <Lock size={32} className="text-amber" />
                  <p className="font-display font-semibold text-lg text-mist">This lesson is locked</p>
                  <p className="text-mist-dim text-sm max-w-sm">
                    Upgrade your plan to unlock "{lesson.title}" and everything else at this tier.
                  </p>
                  <a href="/#pricing">
                    <Button3D variant="amber">View plans</Button3D>
                  </a>
                </div>
              ) : (
                <>
                  {lesson?.videoUrl && (
                    <div className="mb-6 aspect-video bg-ink-800 rounded-xl flex items-center justify-center text-mist-faint">
                      <PlayCircle size={40} />
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap font-mono text-sm text-mist-dim leading-relaxed">
                    {lesson?.content || "No notes added for this lesson yet."}
                  </pre>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
