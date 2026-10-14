"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Zap, Shield, Sparkles } from "lucide-react";
import Button3D from "@/components/ui/Button3D";
import GlowCard from "@/components/ui/GlowCard";
import ShootingStars from "@/components/ui/ShootingStars";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials. Try demo login below.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setEmail("admin@gotocodes.dev");
    setPassword("admin123");
    setLoading(true);
    setError("");
    try {
      await login("admin@gotocodes.dev", "admin123");
      router.push("/admin");
    } catch (err) {
      // In demo mode, bypass for instant access
      localStorage.setItem("gotocodes_token", "demo_admin_jwt");
      window.location.href = "/admin";
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudent = async () => {
    setEmail("student@gotocodes.dev");
    setPassword("student123");
    setLoading(true);
    setError("");
    try {
      await login("student@gotocodes.dev", "student123");
      router.push("/dashboard");
    } catch (err) {
      localStorage.setItem("gotocodes_token", "demo_student_jwt");
      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ink-900)] text-[var(--mist)] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <ShootingStars />

      {/* Glow Orbs */}
      <div className="glow-orb w-[500px] h-[400px] -top-20 left-1/3 opacity-5 pointer-events-none"
        style={{ background: "#FFFFFF" }} />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-3 group">
            <span className="font-bold text-3xl text-white group-hover:text-neutral-300 transition-colors" style={{ fontFamily: "Space Grotesk" }}>
              gotocodes
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Space Grotesk" }}>
            Welcome back, dev.
          </h1>
          <p className="text-xs text-neutral-400">
            Log in to continue your streak and access all notes & roadmaps.
          </p>
        </div>

        {/* Card */}
        <GlowCard className="p-7 rounded-xl border border-white/10">
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/90 flex items-center gap-1.5">
                <Mail size={13} className="text-white" />
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="dev@gotocodes.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/90 flex items-center gap-1.5">
                  <Lock size={13} className="text-white" />
                  Password
                </label>
                <Link href="#" className="text-[11px] text-white/60 hover:text-white hover:underline">
                  Forgot password?
                </Link>
              </div>
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
              <Button3D type="submit" disabled={loading} size="lg" className="w-full">
                {loading ? "Decrypting access..." : "Launch Dashboard"}
                <ArrowRight size={16} className="ml-1" />
              </Button3D>
            </div>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
            <p className="text-[11px] uppercase tracking-wider text-center font-bold text-neutral-500">
              Instant 1-Click Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="py-2 px-3 rounded-md text-xs font-semibold bg-white/5 hover:bg-white text-white hover:text-black border border-white/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Shield size={12} />
                Admin Demo
              </button>
              <button
                type="button"
                onClick={handleDemoStudent}
                className="py-2 px-3 rounded-md text-xs font-semibold bg-white/5 hover:bg-white text-white hover:text-black border border-white/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles size={12} />
                Student Demo
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-neutral-400 mt-6">
            New to GotoCodes?{" "}
            <Link href="/register" className="font-bold text-white hover:underline">
              Create free account
            </Link>
          </p>
        </GlowCard>
      </div>
    </div>
  );
}
