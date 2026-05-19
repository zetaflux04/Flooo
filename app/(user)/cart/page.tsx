"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import CartItem from "@/components/ui/CartItem";
import { formatPrice } from "@/lib/utils";
import { useHydrated } from "@/lib/useHydrated";

export default function CartPage() {
  const hydrated = useHydrated();
  const { items, getTotal, getItemCount } = useCartStore();
  const isAuth = useAuthStore((s) => s.isAuthenticated());

  if (!hydrated) {
    return (
      <div className="page-container py-20 text-center text-muted">
        Loading cart...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-container py-20 text-center">
        <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-secondary mb-2">Your cart is empty</h1>
        <p className="text-muted mb-8">Add some Flooo water to get started!</p>
        <Link href="/products" className="btn-primary inline-block">Shop Now</Link>
      </div>
    );
  }

  const total = getTotal();
  const count = getItemCount();

  return (
    <div className="page-container py-12">
      <h1 className="text-3xl font-bold text-secondary mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}
        </div>
        <div className="card h-fit sticky top-24">
          <h2 className="font-bold text-secondary text-lg mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted">Subtotal ({count} items)</span>
            <span className="font-semibold">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-muted">Delivery</span>
            <span className="text-green-600 font-medium">Booking only</span>
          </div>
          <div className="bg-light-blue rounded-lg p-3 text-sm text-muted mb-4">
            No online payment required — place a booking and we will confirm delivery.
          </div>
          <div className="border-t pt-4 flex justify-between items-center mb-6">
            <span className="font-bold text-secondary">Total</span>
            <span className="text-2xl font-bold text-secondary">{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-muted text-center mb-4">Inclusive of all taxes</p>
          <Link
            href={isAuth ? "/checkout" : "/login?redirect=/checkout"}
            className="btn-primary w-full block text-center"
          >
            Proceed to Checkout →
          </Link>
          <p className="text-xs text-muted text-center mt-3">🔒 Secure Checkout</p>
        </div>
      </div>
    </div>
  );
}

