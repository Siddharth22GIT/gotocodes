"use client";

import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "teal" | "amber";
  onClick?: () => void;
  noPadding?: boolean;
}

export default function GlowCard({
  children,
  className = "",
  variant = "default",
  onClick,
  noPadding = false,
}: GlowCardProps) {
  const variantClass = variant === "teal" ? "card-glow-teal" : variant === "amber" ? "card-glow-amber" : "";

  return (
    <div
      className={`card-glow ${variantClass} ${noPadding ? "" : "p-6"} ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
