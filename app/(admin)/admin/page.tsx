"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, ShoppingBag, Users, Store } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCard from "@/components/admin/StatsCard";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminDashboard() {
  const [data, setData] = useState<{
    stats: {
      totalOrders: number;
      totalUsers: number;
      activeProducts: number;
      activeDealers: number;
      totalRevenue: number;
    };
    recentOrders: Array<{
      _id: string;
      orderId: string;
      total: number;
      status: string;
      user?: { phone?: string; name?: string };
    }>;
    chartData: { date: string; orders: number; revenue: number }[];
  } | null>(null);

  useEffect(() => {
    adminFetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return <AdminHeader title="Dashboard Overview" />;
  }

  const statusClass: Record<string, string> = {
    Pending: "bg-orange-100 text-orange-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Shipped: "bg-cyan-100 text-cyan-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <>
      <AdminHeader title="Dashboard Overview" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Revenue"
          value={formatPrice(data.stats.totalRevenue)}
          change="+12.5% from last month"
          positive
          icon={DollarSign}
          iconBg="bg-light-blue text-primary"
        />
        <StatsCard
          title="Total Orders"
          value={String(data.stats.totalOrders)}
          change="+8.2% from last month"
          positive
          icon={ShoppingBag}
          iconBg="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Total Users"
          value={String(data.stats.totalUsers)}
          icon={Users}
          iconBg="bg-pink-100 text-pink-600"
        />
        <StatsCard
          title="Active Dealers"
          value={String(data.stats.activeDealers)}
          icon={Store}
          iconBg="bg-green-100 text-green-600"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="card lg:col-span-2">
          <h2 className="font-bold text-secondary mb-4">Orders (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#E91E8C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h2 className="font-bold text-secondary mb-4">Quick Actions</h2>
          <Link href="/admin/products" className="btn-primary w-full block text-center mb-3">
            + Add New Product
          </Link>
          <Link href="/admin/orders" className="btn-secondary w-full block text-center">
            View All Orders
          </Link>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-secondary">Recent Orders</h2>
          <Link href="/admin/orders" className="text-primary text-sm font-medium hover:underline">
            View All →
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-light-blue text-left">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.recentOrders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-3 font-medium">{o.orderId}</td>
                <td className="p-3">{o.user?.phone || "—"}</td>
                <td className="p-3">{formatPrice(o.total)}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusClass[o.status]}`}>
                    {o.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
