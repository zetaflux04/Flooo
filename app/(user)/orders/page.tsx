"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

interface Order {
  _id: string;
  orderId: string;
  total: number;
  status: string;
  createdAt: string;
  items: { name: string; size: string; qty: number; price: number }[];
  deliveryAddress: {
    name: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const statusColors: Record<string, string> = {
  Pending: "bg-orange-100 text-orange-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Shipped: "bg-cyan-100 text-cyan-700",
  Delivered: "bg-green-100 text-green-700",
  Completed: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user?._id) return;
    fetch("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [user, token]);

  if (loading) {
    return (
      <div className="page-container py-12 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="page-container py-20 text-center">
        <h1 className="text-2xl font-bold text-secondary mb-2">No orders yet</h1>
        <p className="text-muted">Start shopping to see your orders here.</p>
      </div>
    );
  }

  return (
    <div className="page-container py-12">
      <h1 className="text-3xl font-bold text-secondary mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card">
            <button
              type="button"
              className="w-full flex flex-wrap items-center justify-between gap-4 text-left"
              onClick={() => setExpanded(expanded === order._id ? null : order._id)}
            >
              <div>
                <p className="font-bold text-secondary">{order.orderId}</p>
                <p className="text-sm text-muted">{formatDate(order.createdAt)} • {order.items.length} items</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn("text-xs font-semibold px-3 py-1 rounded-full", statusColors[order.status])}>
                  {order.status}
                </span>
                <span className="font-bold text-secondary">{formatPrice(order.total)}</span>
                <ChevronDown className={cn("w-5 h-5 transition-transform", expanded === order._id && "rotate-180")} />
              </div>
            </button>
            {expanded === order._id && (
              <div className="mt-4 pt-4 border-t space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.name} ({item.size}) × {item.qty}</span>
                    <span>{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
                <p className="text-sm text-muted pt-2">
                  Deliver to: {order.deliveryAddress.name}, {order.deliveryAddress.line1},{" "}
                  {order.deliveryAddress.city}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
