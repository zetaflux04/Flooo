"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthHydrator() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setAuth(data.user, data.token);
        } else if (useAuthStore.getState().isAuthenticated()) {
          logout();
        }
      })
      .catch(() => {
        if (useAuthStore.getState().isAuthenticated()) {
          logout();
        }
      });
  }, [setAuth, logout]);

  return null;
}
