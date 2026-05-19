"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import ProfileMenu from "@/components/ui/ProfileMenu";
import { useHydrated } from "@/lib/useHydrated";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/stores", label: "Our Stores" },
  { href: "/about", label: "About" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

const accountLinks = [
  { href: "/cart", label: "My Cart" },
  { href: "/orders", label: "Order History" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);
  const hydrated = useHydrated();
  const itemCount = useCartStore((s) => s.getItemCount());
  const { user, isAuthenticated, logout } = useAuthStore();

  const showCartBadge = hydrated && itemCount > 0;
  const authed = hydrated && isAuthenticated();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    window.location.href = "/";
  };

  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      const section = href.slice(href.indexOf("#"));
      return pathname === "/" && hash === section;
    }
    if (href === "/") {
      return pathname === "/" && !hash;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav className="page-container h-16 flex items-center justify-between">
          <BrandLogo size="md" textClassName="text-2xl" />

          <ul className="hidden lg:flex items-center gap-6">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive(l.href) ? "text-primary border-b-2 border-primary pb-0.5" : "text-secondary"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-2 text-secondary hover:text-primary">
              <ShoppingCart className="w-6 h-6" />
              {showCartBadge && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
            {authed ? (
              <ProfileMenu />
            ) : (
              <Link href="/login" className="p-2 text-secondary hover:text-primary" title="Login">
                <User className="w-6 h-6" />
              </Link>
            )}
            <button
              type="button"
              className="lg:hidden p-2"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-secondary" />
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <BrandLogo size="sm" textClassName="text-xl" asLink={false} />
              <button type="button" onClick={() => setOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <ul className="flex flex-col gap-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block py-2 font-medium",
                      isActive(l.href) ? "text-primary" : "text-secondary"
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {hydrated && user && (
              <div className="mt-6 pt-6 border-t space-y-1">
                <p className="text-sm font-semibold text-secondary mb-3">
                  {user.name || user.username || user.email}
                </p>
                {accountLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-sm text-secondary hover:text-primary"
                  >
                    {l.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="block py-2 text-sm text-red-600 font-medium w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
            {hydrated && !user && (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-auto pt-6 text-primary font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
