"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Zap, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Button3D from "@/components/ui/Button3D";

const NAV_LINKS = [
  { label: "Modules", href: "/#modules" },
  { label: "Resources", href: "/#resources" },
  { label: "Videos", href: "/#videos" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/#about" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
    setOpen(false);
  };

  const tierColor = {
    free: "text-neutral-400",
    basic: "text-neutral-300",
    premium: "text-white font-semibold",
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "navbar-blur shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link
          href="/"
          className="flex items-center group flex-shrink-0"
        >
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-neutral-300 transition-colors" style={{ fontFamily: "Space Grotesk" }}>
            gotocodes
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--mist-dim)] hover:text-[var(--mist)] hover:bg-white/5 transition-all duration-200"
              style={{ fontFamily: "JetBrains Mono" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black"
                  style={{ background: "linear-gradient(135deg, #FFFFFF, #888888)" }}>
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-[var(--mist-dim)]" style={{ fontFamily: "JetBrains Mono", fontSize: "12px" }}>
                  {user.name.split(" ")[0]}
                  <span className={`ml-1.5 ${tierColor[user.tier]}`}>· {user.tier}</span>
                </span>
              </Link>
              <Button3D size="sm" variant="ghost" onClick={handleLogout}>
                Log out
              </Button3D>
            </>
          ) : (
            <>
              <Link href="/login">
                <span className="text-sm text-[var(--mist-dim)] hover:text-[var(--mist)] transition-colors px-3 py-2"
                  style={{ fontFamily: "JetBrains Mono" }}>
                  Log in
                </span>
              </Link>
              <Link href="/register">
                <Button3D size="sm">
                  <Zap size={14} />
                  Join free
                </Button3D>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-[var(--mist-dim)] hover:text-[var(--mist)] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            <motion.div key={open ? "close" : "open"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden navbar-blur border-t border-white/5"
          >
            <div className="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm text-[var(--mist-dim)] hover:text-[var(--mist)] hover:bg-white/5 transition-all"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-3 pt-3 border-t border-white/5 mt-2">
                {user ? (
                  <>
                    <Link href={user.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setOpen(false)}>
                      <Button3D size="sm" variant="ghost">Dashboard</Button3D>
                    </Link>
                    <Button3D size="sm" variant="ghost" onClick={handleLogout}>Log out</Button3D>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button3D size="sm" variant="ghost">Log in</Button3D>
                    </Link>
                    <Link href="/register" onClick={() => setOpen(false)}>
                      <Button3D size="sm">Join free</Button3D>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
