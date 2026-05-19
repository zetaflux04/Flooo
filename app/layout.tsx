import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/providers/ToastProvider";
import AuthHydrator from "@/components/AuthHydrator";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Flooo — Pure Water. Healthy Life.",
  description: "BIS-certified added mineral water by LSP Enterprises. 250ml, 500ml & 1L packs delivered to your door.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins`}>
        <AuthHydrator />
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
