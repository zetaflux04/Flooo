"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Droplets } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import WaterBackground from "@/components/ui/WaterBackground";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const redirect =
    redirectParam &&
    redirectParam !== "/login" &&
    redirectParam !== "/register" &&
    !redirectParam.startsWith("/admin")
      ? redirectParam
      : "/";
  const { setAuth, logout } = useAuthStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (res) => {
        if (res.ok) {
          window.location.href = redirect;
          return;
        }
        if (useAuthStore.getState().isAuthenticated()) {
          logout();
        }
      })
      .finally(() => setCheckingSession(false));
  }, [redirect, logout]);

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted">
        Loading...
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error("Please enter email/username and password");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAuth(
        {
          _id: data.user._id,
          name: data.user.name,
          username: data.user.username,
          phone: data.user.phone || "",
          email: data.user.email,
          address: data.user.address,
        },
        data.token
      );
      toast.success("Login successful!");
      window.location.href = redirect;
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WaterBackground variant="section" className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <Droplets className="w-12 h-12 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-primary">Flooo</h1>
          <p className="text-muted text-sm mt-1">Login to your account</p>
        </div>

        <form onSubmit={handleLogin}>
          <label className="text-sm font-medium text-secondary block mb-2">Username or Email</label>
          <input
            type="text"
            className="input-field w-full mb-4"
            placeholder="johndoe or john@example.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <label className="text-sm font-medium text-secondary block mb-2">Password</label>
          <input
            type="password"
            className="input-field w-full mb-6"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </p>
        <p className="text-center text-sm text-muted mt-2">
          <Link href="/" className="text-primary hover:underline">
            Back to Home
          </Link>
        </p>
      </div>
    </WaterBackground>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
