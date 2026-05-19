"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#1A1A4E",
          color: "#fff",
          borderRadius: "8px",
          fontFamily: "var(--font-poppins)",
        },
        success: { iconTheme: { primary: "#E91E8C", secondary: "#fff" } },
      }}
    />
  );
}
