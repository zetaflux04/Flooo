"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { User, ShoppingCart, Package, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    window.location.href = "/";
  };

  const menuItems = [
    { href: "/cart", label: "My Cart", icon: ShoppingCart },
    { href: "/orders", label: "Order History", icon: Package },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 p-2 rounded-lg text-secondary hover:text-primary hover:bg-light-blue transition-colors",
          open && "bg-light-blue text-primary"
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        title="Account menu"
      >
        <User className="w-6 h-6" />
        <ChevronDown
          className={cn("w-4 h-4 hidden sm:block transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-card shadow-lg border border-gray-100 py-2 z-50"
        >
          {user && (
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-semibold text-secondary text-sm truncate">
                {user.name || user.username || "Account"}
              </p>
              <p className="text-xs text-muted truncate">{user.email || user.username}</p>
            </div>
          )}
          <ul className="py-1">
            {menuItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-light-blue hover:text-primary transition-colors"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-100 pt-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
