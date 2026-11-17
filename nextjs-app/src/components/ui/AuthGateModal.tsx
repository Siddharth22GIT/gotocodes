"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";

interface AuthGateModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthGateModal({ open, onClose }: AuthGateModalProps) {
  const router = useRouter();

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="text-center space-y-5 py-2">
        <div className="text-4xl">🔐</div>
        <h2
          className="text-xl font-bold text-white leading-snug"
          style={{ fontFamily: "Space Grotesk" }}
        >
          You need to join the gang first to access the riches.
        </h2>
        <p className="text-sm" style={{ color: "var(--mist-dim)" }}>
          Create a free account to unlock all modules, resources, and videos.
        </p>
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              router.push("/register");
            }}
            className="w-full px-5 py-3 rounded-lg font-bold text-sm bg-white text-black hover:bg-neutral-200 transition-all"
            style={{ fontFamily: "Space Grotesk" }}
          >
            Join the Gang 🚀
          </button>
          <button
            onClick={() => {
              onClose();
              router.push("/login");
            }}
            className="text-sm transition-colors py-1.5 hover:text-white"
            style={{ color: "var(--mist-dim)" }}
          >
            Already a member? Log in
          </button>
        </div>
      </div>
    </Modal>
  );
}
