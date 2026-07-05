import { Terminal, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-5 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-display font-bold text-mist">
          <Terminal className="text-violet" size={18} />
          goto<span className="text-violet">codes</span>
        </div>
        <p className="text-mist-faint text-xs font-mono text-center">
          Heaven for Devs · Coding · DSA · AI · Projects · Tech
        </p>
        <a
          href="https://instagram.com/gotocodes"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-mist-dim hover:text-violet-light text-sm transition-colors"
        >
          <Instagram size={16} /> @gotocodes
        </a>
      </div>
      <p className="text-center text-mist-faint text-[11px] font-mono mt-6">
        © {new Date().getFullYear()} GotoCodes. Built for the CSE community.
      </p>
    </footer>
  );
}
