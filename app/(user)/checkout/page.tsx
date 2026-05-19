"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/lib/utils";
import FormField from "@/components/ui/FormField";
import { MapPin, Package, ClipboardList } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (items.length === 0) router.push("/cart");
    if (user) {
      setAddress((a) => ({
        ...a,
        name: user.name || "",
        phone: user.phone || "",
        line1: user.address?.line1 || "",
        line2: user.address?.line2 || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
      }));
    }
  }, [user, items, router]);

  const total = getTotal();

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            slug: i.slug,
            name: i.name,
            qty: i.qty,
            price: i.price,
            size: i.size,
          })),
          deliveryAddress: { ...address, phone: address.phone || user?.phone },
          deliveryInstructions: instructions,
          total: total
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      sessionStorage.setItem("lastOrder", JSON.stringify(data));
      clearCart();
      toast.success("Booking placed successfully!");
      router.push("/order-success");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to place booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-blue py-8">
      <div className="text-center mb-8">
        <LinkLogo />
        <h1 className="text-2xl font-bold mt-4 text-secondary flex items-center justify-center gap-2">
          <ClipboardList className="w-6 h-6 text-primary" /> Booking Form
        </h1>
        <p className="text-muted mt-2">Fill in your details to book your products. No online payment required.</p>
      </div>

      <div className="page-container grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={placeOrder} className="card ring-2 ring-primary">
            <h2 className="font-bold text-secondary flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" /> Delivery Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {(
                [
                  ["name", "Full Name", "Enter your full name", true],
                  ["phone", "Phone", "10-digit mobile number", true],
                  ["pincode", "Pincode", "e.g. 201310", true],
                  ["line1", "Address Line 1", "House no., street, area", true],
                  ["line2", "Address Line 2", "Landmark (optional)", false],
                  ["city", "City", "e.g. Noida", true],
                  ["state", "State", "e.g. Uttar Pradesh", true],
                ] as const
              ).map(([key, label, placeholder, required]) => (
                <FormField
                  key={key}
                  label={label}
                  id={`checkout-${key}`}
                  placeholder={placeholder}
                  required={required}
                  value={address[key]}
                  onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                />
              ))}
            </div>
            
            <h2 className="font-bold text-secondary flex items-center gap-2 mb-4 mt-8">
              <Package className="w-5 h-5 text-primary" /> Additional Instructions
            </h2>
            <FormField
              label="Delivery Instructions"
              id="checkout-instructions"
              as="textarea"
              placeholder="Any special delivery notes (optional)"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
            
            <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
              {loading ? "Placing Booking..." : "Book Now"}
            </button>
          </form>
        </div>

        <div className="card h-fit sticky top-24">
          <h2 className="font-bold text-secondary mb-4">Booking Summary</h2>
          <div className="space-y-4 mb-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-light-blue rounded flex items-center justify-center shrink-0">
                  <Image src={item.image || ""} alt="" width={32} height={32} className="object-contain" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-secondary">{item.name}</p>
                  <p className="text-muted">{item.size} • Qty: {item.qty}</p>
                </div>
                <p className="font-semibold text-sm">{formatPrice(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm mb-4 border-t pt-4">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Delivery</span>
              <span className="text-green-600">Free</span>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
            </div>
          </div>
          <p className="text-xs text-muted mt-4 bg-light-blue p-3 rounded-lg text-center">
            🔒 Booking only. Admin will review and process your booking.
          </p>
        </div>
      </div>
    </div>
  );
}

function LinkLogo() {
  return (
    <span className="text-3xl font-bold text-primary tracking-tight">LSP Enterprises</span>
  );
}
