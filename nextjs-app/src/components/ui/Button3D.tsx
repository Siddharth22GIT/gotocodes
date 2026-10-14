"use client";

import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";

type Variant = "primary" | "ghost" | "teal";
type Size = "sm" | "md" | "lg";

interface Button3DProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  href?: string;
}

export const Button3D = forwardRef<HTMLButtonElement, Button3DProps>(
  ({ variant = "primary", size = "md", children, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`btn-3d btn-3d-${variant} btn-${size} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button3D.displayName = "Button3D";

export default Button3D;
