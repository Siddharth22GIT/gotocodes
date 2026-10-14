"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ArrowRight, Sparkles, Check } from "lucide-react";
import Button3D from "@/components/ui/Button3D";
import GlowCard from "@/components/ui/GlowCard";
import ShootingStars from "@/components/ui/ShootingStars";
import { useAuth } from "@/context/AuthContext";

const AVATAR_SEEDS = [
  { id: "pixel-wizard", label: "Wizard", icon: "🧙‍♂️" },
  { id: "cyber-ninja", label: "Ninja", icon: "🥷" },
  { id: "robo-dev", label: "Robo", icon: "🤖" },
  { id: "space-pilot", label: "Astronaut", icon: "🧑‍🚀" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_SEEDS[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register(name, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ink-900)] text-[var(--mist)] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <ShootingStars />

      <div className="glow-orb w-[500px] h-[400px] -top-20 right-1/4 opacity-5 pointer-events-none"
        style={{ background: "#FFFFFF" }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-3 group">
            <span className="font-bold text-3xl text-white group-hover:text-neutral-300 transition-colors" style={{ fontFamily: "Space Grotesk" }}>
              gotocodes
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Space Grotesk" }}>
            Join 11,000+ Developers
          </h1>
          <p className="text-xs text-neutral-400">
            Create an account to track module progress, unlock roadmaps & notes.
          </p>
        </div>

        <GlowCard className="p-7 rounded-xl border border-white/10">
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/90">
                Choose Dev Persona
              </label>
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_SEEDS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`py-2 px-1 rounded-md text-center border transition-all ${
                      selectedAvatar === av.id
                        ? "border-white bg-white/15 shadow-sm scale-105"
                        : "border-white/10 hover:border-white/20 bg-white/5"
                    }`}
                  >
                    <div className="text-2xl mb-1">{av.icon}</div>
                    <span className="text-[10px] font-bold text-neutral-400 block">{av.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/90 flex items-center gap-1.5">
                <User size={13} className="text-white" />
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="Alex Dev"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/90 flex items-center gap-1.5">
                <Mail size={13} className="text-white" />
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="alex@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/90 flex items-center gap-1.5">
                <Lock size={13} className="text-white" />
                Password (min 6 chars)
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field text-sm"
              />
            </div>

            <div className="pt-2">
              <Button3D type="submit" disabled={loading} size="lg" variant="primary" className="w-full">
                {loading ? "Generating Developer Profile..." : "Claim Free Account"}
                <ArrowRight size={16} className="ml-1" />
              </Button3D>
            </div>
          </form>

          <p className="text-center text-xs text-neutral-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-white hover:underline">
              Log in
            </Link>
          </p>
        </GlowCard>
      </div>
    </div>
  );
}
