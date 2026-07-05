import { motion } from "framer-motion";
import { Download, Lock } from "lucide-react";
import TerminalCard from "./TerminalCard";
import { useNavigate } from "react-router-dom";

export default function ResourcesSection({ resources }) {
  const navigate = useNavigate();

  return (
    <section id="resources" className="relative py-24 px-5 md:px-8 bg-ink-800/40">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal mb-3">$ ls ./resources</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-mist">Resources</h2>
          <p className="text-mist-dim mt-3 max-w-xl">
            Cheat sheets, templates, and question banks — the same things that used to live behind an auto-DM, now organized properly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((r, i) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <TerminalCard
                filePath={`${r.category.toLowerCase()}/${r.filePath}`}
                title={r.title}
                description={r.description}
                tier={r.tier}
                locked={r.locked}
                onClick={() => {
                  if (r.locked) {
                    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                  } else if (r.fileUrl && r.fileUrl !== "#") {
                    window.open(r.fileUrl, "_blank");
                  }
                }}
                footer={
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-teal">
                    <Download size={13} /> download
                  </span>
                }
              />
            </motion.div>
          ))}
          {resources.length === 0 && (
            <p className="text-mist-dim font-mono text-sm">No resources published yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
