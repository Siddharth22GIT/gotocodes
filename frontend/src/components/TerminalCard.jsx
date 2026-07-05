import { Lock } from "lucide-react";
import { motion } from "framer-motion";

const tierLabel = { free: "free", basic: "basic", premium: "premium" };
const tierColor = {
  free: "text-teal border-teal/30 bg-teal/10",
  basic: "text-violet-light border-violet/30 bg-violet/10",
  premium: "text-amber border-amber/30 bg-amber/10",
};

export default function TerminalCard({ filePath, title, description, tier, locked, onClick, footer }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden bg-ink-700 border border-white/5 shadow-card cursor-pointer"
    >
      {/* title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-ink-600 border-b border-white/5">
        <span className="dot bg-[#FF5F57]" />
        <span className="dot bg-[#FEBC2E]" />
        <span className="dot bg-[#28C840]" />
        <span className="ml-3 font-mono text-xs text-mist-dim truncate">
          ~/gotocodes/{filePath || "file.md"}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-display font-semibold text-lg text-mist group-hover:text-violet-light transition-colors">
            {title}
          </h3>
          <span
            className={`shrink-0 font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border ${tierColor[tier] || tierColor.free}`}
          >
            {tierLabel[tier] || "free"}
          </span>
        </div>
        {description && <p className="text-sm text-mist-dim leading-relaxed mb-3">{description}</p>}

        {locked ? (
          <div className="flex items-center gap-2 text-xs font-mono text-mist-faint mt-4">
            <Lock size={14} />
            <span>upgrade to unlock this file</span>
          </div>
        ) : (
          footer && <div className="mt-4">{footer}</div>
        )}
      </div>

      {locked && (
        <div className="absolute inset-0 backdrop-blur-[2px] bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-800 border border-amber/30 text-amber font-mono text-xs">
            <Lock size={14} /> Locked — tap to see plans
          </div>
        </div>
      )}
    </motion.div>
  );
}
