import Link from "next/link";
import { Droplets } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-light-blue flex flex-col items-center justify-center p-4 text-center page-container">
      <Droplets className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-4xl font-bold text-secondary mb-2">404</h1>
      <p className="text-muted mb-8">This page has dried up. Let&apos;s get you back to hydration.</p>
      <Link href="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  );
}
