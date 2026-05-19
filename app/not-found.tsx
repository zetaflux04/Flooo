import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-light-blue flex flex-col items-center justify-center p-4 text-center page-container">
      <BrandLogo size="lg" className="mb-4" asLink={false} />
      <h1 className="text-4xl font-bold text-secondary mb-2">404</h1>
      <p className="text-muted mb-8">This page has dried up. Let&apos;s get you back to hydration.</p>
      <Link href="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  );
}
