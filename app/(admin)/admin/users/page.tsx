"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { formatDate } from "@/lib/utils";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Array<{
    _id: string;
    name?: string;
    phone: string;
    email?: string;
    orderCount?: number;
    createdAt: string;
  }>>([]);

  useEffect(() => {
    adminFetch("/api/admin/users").then((r) => r.json()).then(setUsers);
  }, []);

  return (
    <>
      <AdminHeader title="Users" />
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-light-blue text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-3">{u.name || "—"}</td>
                <td className="p-3">+91 {u.phone}</td>
                <td className="p-3">{u.email || "—"}</td>
                <td className="p-3">{u.orderCount ?? 0}</td>
                <td className="p-3">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
