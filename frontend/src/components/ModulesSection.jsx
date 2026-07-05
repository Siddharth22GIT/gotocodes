import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import TerminalCard from "./TerminalCard";

export default function ModulesSection({ modules }) {
  return (
    <section id="modules" className="relative py-24 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal mb-3">$ ls ./modules</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-mist">Learning modules</h2>
          <p className="text-mist-dim mt-3 max-w-xl">
            Structured notes and snippets by language and technology. Free lessons to get started, more unlocked as you go up a plan.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m, i) => (
            <motion.div
              key={m._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link to={`/modules/${m.slug}`}>
                <TerminalCard
                  filePath={`${m.language.toLowerCase()}/${m.slug}.md`}
                  title={m.title}
                  description={m.description}
                  tier={m.tier}
                  footer={
                    <span className="font-mono text-xs text-mist-faint">
                      {m.unlockedCount}/{m.lessonCount} lessons unlocked
                    </span>
                  }
                />
              </Link>
            </motion.div>
          ))}
          {modules.length === 0 && (
            <p className="text-mist-dim font-mono text-sm">No modules published yet. Check back soon.</p>
          )}
        </div>
      </div>
    </section>
  );
}
