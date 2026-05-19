"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function FooterSubscribe() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex rounded-lg overflow-hidden shadow-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email"
        className="flex-1 min-w-0 px-4 py-3 text-sm text-foreground bg-white focus:outline-none"
        required
      />
      <button
        type="submit"
        className="bg-primary text-secondary px-4 flex items-center justify-center hover:bg-ripple transition-colors shrink-0"
        aria-label="Subscribe"
      >
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );
}
