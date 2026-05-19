"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import WaterBackground from "@/components/ui/WaterBackground";

function RegisterForm() {
  const { setAuth } = useAuthStore();
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !identifier || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, identifier, password }),
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
      toast.success("Registration successful!");
      window.location.href = "/";
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WaterBackground variant="section" className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <BrandLogo size="lg" className="mb-3" />
          <h1 className="text-2xl font-bold text-primary">Register</h1>
          <p className="text-muted text-sm mt-1">Create a new account</p>
        </div>

        <form onSubmit={handleRegister}>
          <label className="text-sm font-medium text-secondary block mb-2">Name</label>
          <input
            type="text"
            className="input-field w-full mb-4"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login here
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

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
