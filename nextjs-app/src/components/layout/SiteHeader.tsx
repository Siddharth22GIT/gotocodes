"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Zap, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button3D from "@/components/ui/Button3D";
import ProfileModal, { getPersona } from "@/components/ui/ProfileModal";

const NAV_LINKS = [
  { label: "Modules", href: "/#modules" },
  { label: "Resources", href: "/#resources" },
  { label: "Videos", href: "/#videos" },
  { label: "About", href: "/#about" },
];

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => { logout(); router.push("/"); setMobileOpen(false); };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-2xl border-b border-white/[0.08] shadow-xl">
      {/* Navbar */}
      <nav
        className="transition-all duration-300"
        style={{
          background: scrolled ? "rgba(0,0,0,0.95)" : "rgba(0,0,0,0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link href="/" className="flex items-center flex-shrink-0 group">
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
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ fontFamily: "JetBrains Mono", color: "var(--mist-dim)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--mist-dim)";
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {(() => {
                  const persona = getPersona(user);
                  const isAdmin = user.role === "admin" || user.email === "admin@gotocodes.dev";
                  return (
                    <button
                      type="button"
                      onClick={() => setProfileOpen(true)}
                      className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all text-sm group"
                      title="Open Profile"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-transform group-hover:scale-110"
                        style={{
                          border: `1.5px solid ${persona.border}`,
                          boxShadow: persona.glow,
                          background: persona.bgGradient,
                        }}
                      >
                        <span>{persona.icon}</span>
                      </div>
                      <span className="text-white font-medium text-xs flex items-center gap-1" style={{ fontFamily: "Space Grotesk" }}>
                        {user.name.split(" ")[0]}
                        {isAdmin && <span className="text-[10px] text-amber-400 font-bold">👑</span>}
                      </span>
                    </button>
                  );
                })()}
                <Button3D size="sm" variant="ghost" onClick={handleLogout}>
                  Log out
                </Button3D>
              </>
            ) : (
              <>
                <Link href="/login">
                  <span
                    className="text-sm px-3 py-2 transition-colors cursor-pointer"
                    style={{ fontFamily: "JetBrains Mono", color: "var(--mist-dim)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--mist-dim)")}
                  >
                    Log in
                  </span>
                </Link>
                <Link href="/register">
                  <Button3D size="sm">
                    <Zap size={14} />
                    Join now
                  </Button3D>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm transition-all"
                    style={{ fontFamily: "JetBrains Mono", color: "var(--mist-dim)" }}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex gap-3 pt-3 mt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {user ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileOpen(false);
                          setProfileOpen(true);
                        }}
                        className="flex-1"
                      >
                        <Button3D size="sm" variant="ghost" className="w-full">
                          {user.role === "admin" ? "👑 Admin Profile" : "👤 My Profile"}
                        </Button3D>
                      </button>
                      <Button3D size="sm" variant="ghost" onClick={handleLogout}>Log out</Button3D>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button3D size="sm" variant="ghost">Log in</Button3D>
                      </Link>
                      <Link href="/register" onClick={() => setMobileOpen(false)}>
                        <Button3D size="sm">Join now</Button3D>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </header>
  );
}
