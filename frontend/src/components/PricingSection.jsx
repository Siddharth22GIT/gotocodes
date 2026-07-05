import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Button3D from "./Button3D";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function PricingSection({ settings }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      key: "free",
      name: "Free",
      price: 0,
      tagline: "Get a feel for the roadmap.",
      features: ["Core roadmap lessons", "Public resources", "Community announcements"],
      variant: "ghost",
    },
    {
      key: "basic",
      name: "Basic",
      price: settings?.basicPriceINR ?? 149,
      tagline: "For consistent, self-paced learners.",
      features: ["Everything in Free", "Full DSA + language modules", "Career resource templates", "Priority announcements"],
      variant: "violet",
      highlighted: true,
    },
    {
      key: "premium",
      name: "Premium",
      price: settings?.premiumPriceINR ?? 349,
      tagline: "For students building real projects.",
      features: ["Everything in Basic", "MERN & project-based modules", "Full interview question banks", "Early access to new drops"],
      variant: "amber",
    },
  ];

  const handleSelect = (plan) => {
    if (plan.key === "free") {
      navigate(user ? "/dashboard" : "/register");
      return;
    }
    if (!user) {
      navigate("/register");
      return;
    }
    navigate("/dashboard?upgrade=" + plan.key);
  };

  return (
    <section id="pricing" className="relative py-24 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal mb-3">$ choose --plan</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-mist">Simple, student-friendly pricing</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 border flex flex-col ${
                plan.highlighted
                  ? "border-violet/50 bg-violet/[0.06] shadow-glow-violet md:-translate-y-3"
                  : "border-white/10 bg-ink-700"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet text-white text-xs font-mono px-3 py-1 rounded-full">
                  most popular
                </span>
              )}
              <h3 className="font-display font-bold text-xl text-mist">{plan.name}</h3>
              <p className="text-mist-dim text-sm mt-1">{plan.tagline}</p>
              <div className="mt-6 mb-6">
                <span className="font-display font-bold text-4xl text-mist">
                  {plan.price === 0 ? "₹0" : `₹${plan.price}`}
                </span>
                {plan.price !== 0 && <span className="text-mist-dim">/month</span>}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-mist-dim">
                    <Check size={16} className="text-teal mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button3D variant={plan.variant} className="w-full" onClick={() => handleSelect(plan)}>
                {plan.key === "free" ? "Start free" : `Get ${plan.name}`}
              </Button3D>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-mist-faint text-xs font-mono mt-10">
          Payments are processed securely. Upgrades reflect on your account within moments.
        </p>
      </div>
    </section>
  );
}
