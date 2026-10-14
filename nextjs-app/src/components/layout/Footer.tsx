"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Github, Instagram, Youtube, Twitter, Linkedin } from "@/components/ui/Icons";

export default function Footer() {
  const links = {
    Platform: [
      { label: "Modules", href: "/#modules" },
      { label: "Resources", href: "/#resources" },
      { label: "Short Videos", href: "/#videos" },
      { label: "Pricing", href: "/#pricing" },
    ],
    Account: [
      { label: "Log in", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  };

  return (
    <footer className="border-t border-white/6 mt-16 sm:mt-20 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2">
            <Link href="/" className="inline-flex items-center mb-4 group">
              <span className="font-bold text-2xl tracking-tight text-white group-hover:text-neutral-300 transition-colors" style={{ fontFamily: "Space Grotesk" }}>
                gotocodes
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--mist-dim)" }}>
              5+ years of CSE learning mistakes turned into shortcuts for you. No DMs needed — everything lives here.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { href: "#", icon: Instagram },
                { href: "#", icon: Youtube },
                { href: "#", icon: Twitter },
                { href: "#", icon: Linkedin },
                { href: "#", icon: Github },
              ].map(({ href, icon: Icon }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    borderColor: "rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    color: "var(--mist-dim)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)";
                    (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLElement).style.color = "var(--mist-dim)";
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ fontFamily: "JetBrains Mono", color: "var(--mist-faint)" }}>
                {section}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "var(--mist-dim)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#FFFFFF"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--mist-dim)"; }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ fontFamily: "JetBrains Mono", color: "var(--mist-faint)" }}>
            © {new Date().getFullYear()} GotoCodes. All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--mist-faint)" }}>
            Made with <Heart size={12} className="text-white" fill="currentColor" /> for devs
          </p>
        </div>
      </div>
    </footer>
  );
}
