import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Terminal } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button3D from "./Button3D";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { label: "Modules", to: "/#modules" },
    { label: "Resources", to: "/#resources" },
    { label: "Pricing", to: "/#pricing" },
    { label: "About", to: "/#about" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-ink/70 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-mist">
          <Terminal className="text-violet" size={22} />
          goto<span className="text-violet">codes</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-mono text-sm text-mist-dim">
          {links.map((l) => (
            <a key={l.label} href={l.to} className="hover:text-violet-light transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className="text-sm text-mist-dim hover:text-mist font-mono">
                {user.name.split(" ")[0]} · {user.tier}
              </Link>
              <Button3D size="sm" variant="ghost" onClick={() => { logout(); navigate("/"); }}>
                Log out
              </Button3D>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-mist-dim hover:text-mist font-mono">
                Log in
              </Link>
              <Link to="/register">
                <Button3D size="sm">Join free</Button3D>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-mist" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-5 pb-5 flex flex-col gap-4 font-mono text-sm border-t border-white/5">
          {links.map((l) => (
            <a key={l.label} href={l.to} onClick={() => setOpen(false)} className="text-mist-dim hover:text-mist">
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            {user ? (
              <Button3D size="sm" variant="ghost" onClick={() => { logout(); navigate("/"); }}>
                Log out
              </Button3D>
            ) : (
              <>
                <Link to="/login"><Button3D size="sm" variant="ghost">Log in</Button3D></Link>
                <Link to="/register"><Button3D size="sm">Join free</Button3D></Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
