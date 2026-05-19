"use client";

import { useState, useEffect } from "react";
import { Droplets } from "lucide-react";
import toast from "react-hot-toast";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@flooo.in");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/me")
      .then((res) => {
        if (res.ok) {
          window.location.href = "/admin";
        }
      })
      .finally(() => setCheckingSession(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      toast.success("Welcome back!");
      window.location.href = "/admin";
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center text-muted">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} method="post" action="#" className="card w-full max-w-md">
        <div className="text-center mb-8">
          <Droplets className="w-10 h-10 text-primary mx-auto mb-2" />
          <h1 className="text-xl font-bold text-secondary">LSP Enterprises Admin</h1>
          <p className="text-muted text-sm mt-1">Sign in to manage orders & products</p>
        </div>
        <label className="text-sm font-medium text-secondary block mb-2">Email</label>
        <input
          className="input-field mb-4"
          type="email"
          placeholder="admin@flooo.in"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="text-sm font-medium text-secondary block mb-2">Password</label>
        <input
          className="input-field mb-6"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-center text-sm text-muted mt-4">
          <a href="/" className="text-primary hover:underline">
            Back to website
          </a>
        </p>
      </form>
    </div>
  );
}
