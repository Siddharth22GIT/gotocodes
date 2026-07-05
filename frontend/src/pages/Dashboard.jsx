import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, BookOpen, Download, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button3D from "../components/Button3D";
import api from "../api/axios";

const tierInfo = {
  free: { label: "Free", color: "text-teal", icon: BookOpen },
  basic: { label: "Basic", color: "text-violet-light", icon: Download },
  premium: { label: "Premium", color: "text-amber", icon: Crown },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const requestedUpgrade = params.get("upgrade");
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    api.get("/announcements").then((r) => setAnnouncements(r.data)).catch(() => {});
  }, []);

  const info = tierInfo[user?.tier] || tierInfo.free;
  const Icon = info.icon;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto w-full px-5 md:px-8 py-12 flex-1">
        <h1 className="font-display font-bold text-3xl text-mist mb-1">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="text-mist-dim font-mono text-sm mb-10">~/dashboard</p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-1 bg-ink-700 border border-white/10 rounded-2xl p-6">
            <Icon className={`${info.color} mb-3`} size={28} />
            <p className="text-mist-dim text-sm">Current plan</p>
            <p className={`font-display font-bold text-2xl ${info.color}`}>{info.label}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="md:col-span-2 bg-ink-700 border border-white/10 rounded-2xl p-6">
            <p className="font-display font-semibold text-mist mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-amber" /> Ready to upgrade?
            </p>
            {requestedUpgrade && requestedUpgrade !== user?.tier ? (
              <p className="text-mist-dim text-sm leading-relaxed">
                You selected the <span className="text-mist capitalize">{requestedUpgrade}</span> plan. Payments aren't wired
                up on this build yet — connect a gateway like Razorpay or Stripe in the backend, or as the admin, grant
                yourself and other users a tier directly from the Admin panel.
              </p>
            ) : (
              <p className="text-mist-dim text-sm leading-relaxed">
                Browse plans and pick the one that fits. On this starter build, upgrades are granted by the admin
                until a payment gateway is connected.
              </p>
            )}
            <a href="/#pricing"><Button3D className="mt-4" size="sm">View plans</Button3D></a>
          </motion.div>
        </div>

        <div className="bg-ink-700 border border-white/10 rounded-2xl p-6">
          <p className="font-display font-semibold text-mist mb-4">Latest announcements</p>
          <div className="space-y-4">
            {announcements.length === 0 && <p className="text-mist-dim text-sm font-mono">Nothing new right now.</p>}
            {announcements.map((a) => (
              <div key={a._id} className="border-l-2 border-violet/40 pl-4">
                <p className="text-mist font-medium text-sm">{a.title}</p>
                <p className="text-mist-dim text-sm">{a.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link to="/#modules"><Button3D variant="ghost">Browse modules</Button3D></Link>
          <Link to="/#resources"><Button3D variant="ghost">Browse resources</Button3D></Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
