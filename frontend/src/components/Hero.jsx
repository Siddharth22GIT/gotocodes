import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button3D from "./Button3D";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  return (
    <section className="relative pt-24 pb-32 px-5 md:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-grid-faint bg-grid [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-5xl mx-auto text-center"
      >
        <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet/30 bg-violet/10 font-mono text-xs text-violet-light mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-blink" />
          11,000+ devs already inside
        </motion.div>

        <motion.h1 variants={item} className="font-display font-bold text-5xl md:text-7xl leading-[1.05] text-mist">
          Heaven for <span className="text-violet">Devs</span>.
        </motion.h1>

        <motion.p variants={item} className="mt-6 font-mono text-sm md:text-base tracking-[0.2em] text-mist-dim uppercase">
          Coding · DSA · AI · Projects · Tech
        </motion.p>

        <motion.p variants={item} className="mt-6 max-w-2xl mx-auto text-mist-dim text-lg leading-relaxed">
          Roadmaps, notes, and code snippets from a CSE journey lived the hard way —
          so yours doesn't have to be. No more DMs for resources. Everything lives here now.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button3D size="lg">Start learning free</Button3D>
          </Link>
          <a href="#pricing">
            <Button3D size="lg" variant="ghost">See plans</Button3D>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
