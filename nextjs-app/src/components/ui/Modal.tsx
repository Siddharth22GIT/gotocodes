"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({ open, onClose, children, title, size = "md" }: ModalProps) {
  // Close on escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full ${sizeMap[size]} my-auto flex flex-col rounded-2xl border border-white/12 bg-[#0A0A0A] shadow-[0_25px_80px_rgba(0,0,0,0.95)] max-h-[88vh] overflow-hidden relative`}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-[#0A0A0A] z-10">
                <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "Space Grotesk" }}>{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-[var(--mist-dim)] hover:text-white"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="p-6 overflow-y-auto flex-1 custom-modal-scroll" style={{ scrollbarWidth: "thin" }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
