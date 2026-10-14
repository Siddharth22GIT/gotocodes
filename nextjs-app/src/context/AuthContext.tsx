"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  tier: "free" | "basic" | "premium";
  tierExpiresAt: string | null;
  avatarSeed: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("gotocodes_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("gotocodes_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("gotocodes_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    const res = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("gotocodes_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("gotocodes_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
