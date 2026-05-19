"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  CheckCircle,
  Search,
  Package,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  Clock,
  Truck,
  XCircle,
  Loader2,
  User,
  StickyNote,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { adminFetch } from "@/lib/admin-fetch";

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Completed",
  "Cancelled",
] as const;

type OrderStatus = (typeof STATUS_OPTIONS)[number];

const FILTER_TABS = ["all", ...STATUS_OPTIONS] as const;

const statusConfig: Record<
  OrderStatus,
  { badge: string; border: string; icon: typeof Clock }
> = {
  Pending: {
    badge: "bg-amber-50 text-amber-700 ring-amber-200/80",
    border: "border-l-amber-400",
    icon: Clock,
  },
  Confirmed: {
    badge: "bg-blue-50 text-blue-700 ring-blue-200/80",
    border: "border-l-blue-500",
    icon: CheckCircle,
  },
  Shipped: {
    badge: "bg-cyan-50 text-cyan-700 ring-cyan-200/80",
    border: "border-l-cyan-500",
    icon: Truck,
  },
  Delivered: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200/80",
    border: "border-l-emerald-500",
    icon: Package,
  },
  Completed: {
    badge: "bg-green-50 text-green-800 ring-green-200/80",
    border: "border-l-green-600",
    icon: CheckCircle,
  },
  Cancelled: {
    badge: "bg-red-50 text-red-700 ring-red-200/80",
    border: "border-l-red-400",
    icon: XCircle,
  },
};

interface OrderRow {
  _id: string;
  orderId: string;
  total: number;
  status: string;
  createdAt: string;
  deliveryInstructions?: string;
  user?: { phone?: string; name?: string; email?: string };
  items: { name: string; size: string; qty: number; price: number }[];
  deliveryAddress?: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
}

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status as OrderStatus] ?? statusConfig.Pending;
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ring-1 ring-inset",
        cfg.badge
      )}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    return adminFetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    for (const s of STATUS_OPTIONS) counts[s] = 0;
    for (const o of orders) {
      if (counts[o.status] !== undefined) counts[o.status]++;
    }
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!q) return true;
      const haystack = [
        o.orderId,
        o.user?.name,
        o.user?.phone,
        o.user?.email,
        o.deliveryAddress?.name,
        o.deliveryAddress?.phone,
        o.deliveryAddress?.city,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [orders, filter, search]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await adminFetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const itemCount = (o: OrderRow) =>
    o.items?.reduce((sum, i) => sum + i.qty, 0) ?? 0;

  return (
    <>
      <AdminHeader title="Orders" />

      {/* Summary strip */}
      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {FILTER_TABS.map((s) => {
          const isActive = filter === s;
          const count = statusCounts[s] ?? 0;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-lg border px-1.5 py-2 text-center transition-all min-w-0",
                isActive
                  ? "border-primary bg-light-blue ring-1 ring-primary/20"
                  : "border-gray-100 bg-white hover:border-gray-200"
              )}
            >
              <p className="text-[10px] text-muted capitalize font-medium truncate leading-tight">
                {s === "all" ? "All" : s}
              </p>
              <p
                className={cn(
                  "text-base font-bold leading-tight mt-0.5",
                  isActive ? "text-primary" : "text-secondary"
                )}
              >
                {count}
              </p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-card shadow-card px-3 py-2.5 mb-4 flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
          <input
            type="search"
            placeholder="Search order ID, name, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-btn pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <p className="text-xs text-muted whitespace-nowrap px-1">
          <span className="font-semibold text-secondary">{filteredOrders.length}</span> / {orders.length}
        </p>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-muted text-xs">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-card shadow-card flex flex-col items-center justify-center py-10 text-center px-4">
          <div className="w-10 h-10 rounded-xl bg-light-blue flex items-center justify-center mb-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-secondary text-sm">No orders found</h3>
          <p className="text-muted text-sm mt-1 max-w-sm">
            {search
              ? "Try a different search term or clear filters."
              : filter !== "all"
                ? `No orders with status "${filter}".`
                : "New bookings will appear here."}
          </p>
          {(search || filter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-4 text-sm text-primary font-medium hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredOrders.map((o) => {
            const isExpanded = expanded === o._id;
            const cfg =
              statusConfig[o.status as OrderStatus] ?? statusConfig.Pending;
            const isUpdating = updatingId === o._id;

            return (
              <article
                key={o._id}
                className={cn(
                  "bg-white rounded-card shadow-card overflow-hidden border-l-[3px] transition-shadow hover:shadow-card-hover",
                  cfg.border
                )}
              >
                <div className="px-3 py-2.5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : o._id)}
                      className="flex items-center gap-2 text-left min-w-0 flex-1 group"
                    >
                      <span
                        className={cn(
                          "p-1 rounded-md bg-light-blue text-primary shrink-0 transition-transform",
                          isExpanded && "rotate-180"
                        )}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-sm font-semibold text-secondary group-hover:text-primary transition-colors">
                            {o.orderId}
                          </span>
                          <StatusBadge status={o.status} />
                        </div>
                        <p className="text-[11px] text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3 shrink-0" />
                          {formatDate(o.createdAt)}
                          <span className="text-gray-300">·</span>
                          {itemCount(o)} item{itemCount(o) !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </button>

                    <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-secondary" />
                        </div>
                        <div className="min-w-0 hidden sm:block">
                          <p className="text-xs font-medium text-secondary truncate max-w-[90px]">
                            {o.user?.name || o.deliveryAddress?.name || "Guest"}
                          </p>
                          <p className="text-[10px] text-muted truncate max-w-[90px]">
                            {o.user?.phone || o.deliveryAddress?.phone || "—"}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm font-bold text-primary tabular-nums">
                        {formatPrice(o.total)}
                      </p>

                      <div className="flex items-center gap-1.5">
                        <select
                          value={o.status}
                          disabled={isUpdating}
                          onChange={(e) => updateStatus(o._id, e.target.value)}
                          className={cn(
                            "text-xs border border-gray-200 rounded-btn px-2 py-1.5 bg-white",
                            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                            "disabled:opacity-50 min-w-[108px]"
                          )}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {isUpdating && (
                          <Loader2 className="w-3.5 h-3.5 text-primary animate-spin shrink-0" />
                        )}
                      </div>

                      {o.status === "Delivered" && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => updateStatus(o._id, "Completed")}
                          className="flex items-center gap-1 text-[10px] font-semibold bg-emerald-600 text-white px-2 py-1 rounded-btn hover:bg-emerald-700 disabled:opacity-50 whitespace-nowrap"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-light-blue/20 px-3 py-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <section className="rounded-lg bg-white border border-gray-100 p-3">
                        <h4 className="flex items-center gap-1.5 text-xs font-semibold text-secondary mb-2">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          Delivery address
                        </h4>
                        {o.deliveryAddress ? (
                          <address className="not-italic text-xs text-muted leading-relaxed space-y-0.5">
                            <p className="font-medium text-secondary">
                              {o.deliveryAddress.name}
                            </p>
                            <p>{o.deliveryAddress.line1}</p>
                            {o.deliveryAddress.line2 && (
                              <p>{o.deliveryAddress.line2}</p>
                            )}
                            <p>
                              {o.deliveryAddress.city}, {o.deliveryAddress.state}{" "}
                              <span className="font-medium text-secondary">
                                {o.deliveryAddress.pincode}
                              </span>
                            </p>
                            <p className="flex items-center gap-1.5 pt-1 text-secondary">
                              <Phone className="w-3.5 h-3.5 text-primary" />
                              {o.deliveryAddress.phone}
                            </p>
                          </address>
                        ) : (
                          <p className="text-sm text-muted">No address on file</p>
                        )}
                        {o.deliveryInstructions && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="flex items-center gap-1.5 text-xs font-semibold text-secondary uppercase tracking-wide mb-1">
                              <StickyNote className="w-3.5 h-3.5" />
                              Instructions
                            </p>
                            <p className="text-sm text-muted">{o.deliveryInstructions}</p>
                          </div>
                        )}
                        {o.user?.email && (
                          <p className="flex items-center gap-1.5 mt-3 text-sm text-muted">
                            <Mail className="w-3.5 h-3.5 text-primary" />
                            {o.user.email}
                          </p>
                        )}
                      </section>

                      <section className="rounded-lg bg-white border border-gray-100 p-3">
                        <h4 className="flex items-center gap-1.5 text-xs font-semibold text-secondary mb-2">
                          <Package className="w-3.5 h-3.5 text-primary" />
                          Order items
                        </h4>
                        <ul className="divide-y divide-gray-100">
                          {o.items?.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-secondary truncate">
                                  {item.name}
                                </p>
                                <p className="text-[10px] text-muted">
                                  {item.size} · Qty {item.qty}
                                </p>
                              </div>
                              <p className="text-xs font-semibold text-primary shrink-0">
                                {formatPrice(item.price * item.qty)}
                              </p>
                            </li>
                          ))}
                        </ul>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                          <span className="text-xs font-semibold text-secondary">Total</span>
                          <span className="text-sm font-bold text-primary">
                            {formatPrice(o.total)}
                          </span>
                        </div>
                      </section>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
