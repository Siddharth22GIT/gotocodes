"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  LogOut,
  ShieldCheck,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import Button3D from "@/components/ui/Button3D";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

export interface PersonaConfig {
  id: string;
  label: string;
  icon: string;
  border: string;
  glow: string;
  bgGradient: string;
  tagColor: string;
}

export const STUDENT_PERSONAS: Record<string, PersonaConfig> = {
  "pixel-wizard": {
    id: "pixel-wizard",
    label: "Pixel Wizard",
    icon: "🧙‍♂️",
    border: "#A855F7",
    glow: "0 0 20px rgba(168, 85, 247, 0.45), inset 0 0 10px rgba(168, 85, 247, 0.25)",
    bgGradient: "radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, rgba(12, 8, 20, 0.95) 75%)",
    tagColor: "border-purple-500/40 bg-purple-500/10 text-purple-300",
  },
  "cyber-ninja": {
    id: "cyber-ninja",
    label: "Cyber Ninja",
    icon: "🥷",
    border: "#EF4444",
    glow: "0 0 20px rgba(239, 68, 68, 0.45), inset 0 0 10px rgba(239, 68, 68, 0.25)",
    bgGradient: "radial-gradient(circle, rgba(239, 68, 68, 0.22) 0%, rgba(20, 8, 8, 0.95) 75%)",
    tagColor: "border-red-500/40 bg-red-500/10 text-red-300",
  },
  "robo-dev": {
    id: "robo-dev",
    label: "Robo Dev",
    icon: "🤖",
    border: "#06B6D4",
    glow: "0 0 20px rgba(6, 182, 212, 0.45), inset 0 0 10px rgba(6, 182, 212, 0.25)",
    bgGradient: "radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, rgba(5, 18, 24, 0.95) 75%)",
    tagColor: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  },
  "space-pilot": {
    id: "space-pilot",
    label: "Space Pilot",
    icon: "🧑‍🚀",
    border: "#3B82F6",
    glow: "0 0 20px rgba(59, 130, 246, 0.45), inset 0 0 10px rgba(59, 130, 246, 0.25)",
    bgGradient: "radial-gradient(circle, rgba(59, 130, 246, 0.22) 0%, rgba(8, 14, 28, 0.95) 75%)",
    tagColor: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  },
};

export const ADMIN_PERSONA: PersonaConfig = {
  id: "admin-crown",
  label: "Administrator",
  icon: "👑",
  border: "#F59E0B",
  glow: "0 0 24px rgba(245, 158, 11, 0.5), inset 0 0 12px rgba(245, 158, 11, 0.3)",
  bgGradient: "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(24, 16, 5, 0.95) 75%)",
  tagColor: "border-amber-500/50 bg-amber-500/15 text-amber-300",
};

export function getPersona(user: any): PersonaConfig {
  if (user?.role === "admin" || user?.email === "admin@gotocodes.dev") {
    return ADMIN_PERSONA;
  }
  const seed = user?.avatarSeed;
  if (seed && STUDENT_PERSONAS[seed]) {
    return STUDENT_PERSONAS[seed];
  }
  return STUDENT_PERSONAS["pixel-wizard"];
}

export default function ProfileModal({ open, onClose, isMobile = false }: ProfileModalProps) {
  const router = useRouter();
  const { user, logout, updateProfile } = useAuth();

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const [personaPickerOpen, setPersonaPickerOpen] = useState(false);
  const [personaLoading, setPersonaLoading] = useState(false);

  // Auto detect mobile viewport
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  useEffect(() => {
    const check = () => setIsMobileScreen(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isPositionMobile = isMobile || isMobileScreen;

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !user) return null;

  const isAdmin = user.role === "admin" || user.email === "admin@gotocodes.dev";
  const persona = getPersona(user);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!currentPassword) {
      setPwError("Current password is required.");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }

    setPwLoading(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setPwSuccess("Password changed successfully! ✓");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setIsChangingPassword(false);
        setPwSuccess("");
      }, 1800);
    } catch (err: any) {
      setPwError(err?.response?.data?.message || "Failed to update password.");
    } finally {
      setPwLoading(false);
    }
  };

  const handlePersonaSelect = async (personaId: string) => {
    if (isAdmin) return;
    setPersonaLoading(true);
    try {
      await updateProfile({ avatarSeed: personaId });
      setPersonaPickerOpen(false);
    } catch {
      // Ignored
    } finally {
      setPersonaLoading(false);
    }
  };

  const handleLogoutClick = () => {
    logout();
    onClose();
    router.push("/");
  };

  return (
    <>
      {/* Invisible fixed backdrop: clicking anywhere outside closes the popup */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Small pop up card positioned right over / under the profile button */}
      <div
        className={
          isPositionMobile
            ? "fixed inset-x-4 top-20 mx-auto z-50 w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/15 bg-[#0C0C0C]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-4 text-center overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            : "absolute right-0 top-full mt-2.5 z-50 w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/15 bg-[#0C0C0C]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-4 text-center overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Close button in top right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Close profile popup"
        >
          <X size={15} />
        </button>

        {/* Circular Avatar in Center with Persona-Specific Glowing Border */}
        <div className="flex flex-col items-center justify-center pt-1">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 select-none"
            style={{
              border: `2px solid ${persona.border}`,
              boxShadow: persona.glow,
              background: persona.bgGradient,
            }}
          >
            <span className="text-3xl select-none filter transform hover:scale-110 transition-transform">
              {persona.icon}
            </span>
          </div>

          {/* User Name & Role Right Below Picture */}
          <div className="mt-2.5 space-y-0.5">
            <h3
              className="text-base font-bold text-white tracking-tight leading-tight truncate px-2"
              style={{ fontFamily: "Space Grotesk" }}
              title={user.name}
            >
              {user.name}
            </h3>
            <div className="flex items-center justify-center gap-1.5 pt-0.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${persona.tagColor}`}>
                {isAdmin ? "👑 Admin Account" : `🎓 ${persona.label}`}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono truncate px-2">{user.email}</p>
          </div>

          {/* Persona Switcher Toggle (Student Only) */}
          {!isAdmin && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => setPersonaPickerOpen((p) => !p)}
                className="text-[10px] font-semibold text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10"
              >
                <Sparkles size={10} className="text-amber-400" />
                <span>Change Persona</span>
                {personaPickerOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>

              {personaPickerOpen && (
                <div className="mt-2 p-1.5 rounded-xl border border-white/10 bg-white/[0.04] grid grid-cols-4 gap-1.5 animate-in fade-in duration-100">
                  {Object.values(STUDENT_PERSONAS).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      disabled={personaLoading}
                      onClick={() => handlePersonaSelect(p.id)}
                      className={`py-1.5 px-1 rounded-lg border text-center transition-all flex flex-col items-center ${
                        user.avatarSeed === p.id
                          ? "border-white bg-white/20 scale-105 shadow-sm"
                          : "border-white/10 hover:border-white/20 bg-white/5"
                      }`}
                    >
                      <span className="text-xl">{p.icon}</span>
                      <span className="text-[8px] font-bold text-neutral-300 mt-0.5 truncate max-w-full">
                        {p.label.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Admin Studio Shortcut (Admin Only) */}
          {isAdmin && (
            <div className="mt-2.5 w-full">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/admin");
                }}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/15 text-white hover:border-white/30 transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldCheck size={13} className="text-amber-400" />
                <span>Admin Studio</span>
              </button>
            </div>
          )}
        </div>

        {/* Password Change Option Accordion */}
        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden text-left">
          <button
            type="button"
            onClick={() => {
              setIsChangingPassword((p) => !p);
              setPwError("");
              setPwSuccess("");
            }}
            className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-white/90 hover:text-white hover:bg-white/[0.03] transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Lock size={12} className="text-neutral-400" />
              Change Password
            </span>
            {isChangingPassword ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {isChangingPassword && (
            <form onSubmit={handlePasswordSubmit} className="p-3 pt-1 space-y-2.5 border-t border-white/10">
              {pwError && (
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px]">
                  {pwError}
                </div>
              )}
              {pwSuccess && (
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center gap-1.5">
                  <Check size={12} />
                  <span>{pwSuccess}</span>
                </div>
              )}

              {/* Current Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-300">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    required
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="input-field text-xs py-1.5 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((p) => !p)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showCurrent ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-300">New Password (min 6 chars)</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field text-xs py-1.5 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((p) => !p)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showNew ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-300">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field text-xs py-1.5"
                />
              </div>

              <div className="pt-0.5 flex justify-end">
                <Button3D type="submit" size="sm" variant="primary" disabled={pwLoading} className="w-full text-xs py-1.5">
                  {pwLoading ? "Updating..." : "Save Password"}
                </Button3D>
              </div>
            </form>
          )}
        </div>

        {/* Log Out Option */}
        <div className="mt-3 pt-2.5 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogoutClick}
            className="w-full py-2 rounded-lg text-xs font-bold text-red-400 hover:text-white hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all flex items-center justify-center gap-1.5"
          >
            <LogOut size={13} />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </>
  );
}
