"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, Crown, Star, X, QrCode, Copy, ExternalLink } from "lucide-react";
import Button3D from "@/components/ui/Button3D";
import GlowCard from "@/components/ui/GlowCard";
import Modal from "@/components/ui/Modal";

interface Settings {
  basicPriceINR: number;
  premiumPriceINR: number;
  upiId?: string;
  upiName?: string;
  upiQrUrl?: string;
}

interface PricingPlan {
  name: string;
  tier: string;
  price: number;
  color: string;
  glowColor: string;
  icon: React.ReactNode;
  features: string[];
  isPopular?: boolean;
  cta: string;
}

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  plan: PricingPlan | null;
  settings: Settings | null;
}

function PaymentModal({ open, onClose, plan, settings }: PaymentModalProps) {
  const [copied, setCopied] = useState(false);

  const copyUpi = () => {
    if (settings?.upiId) {
      navigator.clipboard.writeText(settings.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate UPI deep link
  const upiDeepLink = settings?.upiId
    ? `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.upiName || "GotoCodes")}&am=${plan?.price}&cu=INR&tn=${encodeURIComponent(`GotoCodes ${plan?.name} Plan`)}`
    : "#";

  return (
    <Modal open={open} onClose={onClose} title={`Upgrade to ${plan?.name}`} size="md">
      <div className="space-y-6">
        {/* Plan Summary */}
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.04]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg text-white" style={{ fontFamily: "Space Grotesk" }}>
                {plan?.name} Plan
              </p>
              <p className="text-sm mt-0.5" style={{ color: "var(--mist-dim)" }}>Monthly subscription</p>
            </div>
            <p className="text-3xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
              ₹{plan?.price}
              <span className="text-sm font-normal ml-1" style={{ color: "var(--mist-dim)" }}>/mo</span>
            </p>
          </div>
        </div>

        {/* Payment Options */}
        <div>
          <p className="text-sm font-semibold mb-3 text-white/80" style={{ fontFamily: "Space Grotesk" }}>
            Pay via UPI
          </p>

          {settings?.upiQrUrl && (
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl bg-white">
                <img src={settings.upiQrUrl} alt="UPI QR Code" className="w-44 h-44 object-contain" />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.03]">
            <QrCode size={18} className="text-white" />
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-0.5 text-white/50" style={{ fontFamily: "JetBrains Mono" }}>UPI ID</p>
              <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: "JetBrains Mono" }}>
                {settings?.upiId || "Not configured yet"}
              </p>
            </div>
            <button
              onClick={copyUpi}
              className="p-2 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
              title="Copy UPI ID"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          {/* UPI App Deep Link Button */}
          <a href={upiDeepLink} className="block mt-3">
            <Button3D variant="primary" size="md" className="w-full" style={{ justifyContent: "center" }}>
              <ExternalLink size={16} />
              Pay ₹{plan?.price} via UPI App
            </Button3D>
          </a>
        </div>

        <div className="p-4 rounded-xl border border-white/15 bg-white/[0.04]">
          <p className="text-sm text-white/80">
            ⚡ After payment, DM your screenshot to get your account upgraded within 24 hours.
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default function PricingSection({ settings }: { settings: Settings | null }) {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [payModalOpen, setPayModalOpen] = useState(false);

  const plans: PricingPlan[] = [
    {
      name: "Free",
      tier: "free",
      price: 0,
      color: "#FFFFFF",
      glowColor: "#FFFFFF",
      icon: <Star size={20} />,
      cta: "Get started",
      features: [
        "Access to free modules",
        "Basic DSA notes",
        "Community Discord access",
        "Free resources download",
      ],
    },
    {
      name: "Basic",
      tier: "basic",
      price: settings?.basicPriceINR || 149,
      color: "#FFFFFF",
      glowColor: "#FFFFFF",
      icon: <Zap size={20} />,
      cta: "Go Basic",
      isPopular: true,
      features: [
        "Everything in Free",
        "All coding modules",
        "Premium PDF resources",
        "Project guides & templates",
        "Priority support",
        "New content first",
      ],
    },
    {
      name: "Premium",
      tier: "premium",
      price: settings?.premiumPriceINR || 349,
      color: "#FFFFFF",
      glowColor: "#FFFFFF",
      icon: <Crown size={20} />,
      cta: "Go Premium",
      features: [
        "Everything in Basic",
        "1-on-1 mentorship sessions",
        "Resume review",
        "Mock interview prep",
        "Exclusive Discord channel",
        "Lifetime resource access",
        "Early beta features",
      ],
    },
  ];

  const openPayment = (plan: PricingPlan) => {
    if (plan.price === 0) return;
    setSelectedPlan(plan);
    setPayModalOpen(true);
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      <div className="glow-orb w-[500px] h-[400px] top-0 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none"
        style={{ background: "#FFFFFF" }} />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="badge badge-violet mb-4 mx-auto" style={{ display: "inline-flex" }}>
            <Crown size={11} />
            Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4" style={{ fontFamily: "Space Grotesk" }}>
            Invest in your{" "}
            <span className="text-white">future.</span>
          </h2>
          <p className="text-sm sm:text-lg max-w-xl mx-auto" style={{ color: "var(--mist-dim)" }}>
            Start free, scale when ready. No hidden fees, no subscriptions traps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="w-full flex flex-col"
            >
              <div className="card-glow p-7 h-full flex flex-col relative overflow-hidden">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center bg-white/10 text-white">
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white" style={{ fontFamily: "Space Grotesk" }}>{plan.name}</h3>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
                    {plan.price === 0 ? "Free" : `₹${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm ml-2" style={{ color: "var(--mist-dim)" }}>/month</span>
                  )}
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-neutral-300">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-white/15 text-white">
                        <Check size={10} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button3D
                  size="md"
                  variant={plan.tier === "free" ? "ghost" : "primary"}
                  className="w-full"
                  onClick={() => openPayment(plan)}
                  style={{ justifyContent: "center" }}
                >
                  {plan.cta}
                </Button3D>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <PaymentModal
        open={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        plan={selectedPlan}
        settings={settings}
      />
    </section>
  );
}
