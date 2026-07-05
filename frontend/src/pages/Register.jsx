import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button3D from "../components/Button3D";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-ink-700 border border-white/10 rounded-2xl p-8 shadow-card"
      >
        <div className="flex items-center gap-2 font-display font-bold text-xl text-mist mb-1">
          <Terminal className="text-violet" /> goto<span className="text-violet">codes</span>
        </div>
        <p className="font-mono text-xs text-mist-dim mb-8">~/register — starts on the Free plan</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-mist-dim mb-1.5">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-ink-800 border border-white/10 rounded-lg px-4 py-2.5 text-mist focus:border-violet outline-none"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm text-mist-dim mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-ink-800 border border-white/10 rounded-lg px-4 py-2.5 text-mist focus:border-violet outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-mist-dim mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-ink-800 border border-white/10 rounded-lg px-4 py-2.5 text-mist focus:border-violet outline-none"
              placeholder="At least 6 characters"
            />
          </div>
          {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
          <Button3D type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button3D>
        </form>

        <p className="text-sm text-mist-dim mt-6 text-center">
          Already a member?{" "}
          <Link to="/login" className="text-violet-light hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
