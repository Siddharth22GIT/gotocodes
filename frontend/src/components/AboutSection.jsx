import { motion } from "framer-motion";
import { Video } from "lucide-react";

export default function AboutSection({ settings }) {
  return (
    <section id="about" className="relative py-24 px-5 md:px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal mb-4">about-this-website.md</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-mist mb-5">
            Why GotoCodes exists
          </h2>
          <p className="text-mist-dim leading-relaxed text-lg">
            {settings?.aboutText ||
              "GotoCodes is where I turn my CSE learning mistakes into shortcuts for you."}
          </p>
          <p className="text-mist-dim leading-relaxed mt-4">
            Watch the short intro to see what's here today, and what's coming next —
            live cohorts, project reviews, and a lot more.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl overflow-hidden border border-white/10 shadow-glow-violet bg-ink-700 aspect-video"
        >
          {settings?.aboutVideoUrl ? (
            <video
              src={settings.aboutVideoUrl}
              controls
              className="w-full h-full object-cover"
              poster=""
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-mist-faint">
              <Video size={36} />
              <p className="font-mono text-sm">Founder intro video coming soon</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
