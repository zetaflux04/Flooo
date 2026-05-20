"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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

  const load = () => adminFetch("/api/admin/users").then((r) => r.json()).then(setUsers);

  useEffect(() => {
    load();
  }, []);

  const remove = async (u: { _id: string; name?: string; phone: string; orderCount?: number }) => {
    const label = u.name || u.phone;
    const orderNote =
      (u.orderCount ?? 0) > 0
        ? ` This will also delete ${u.orderCount} order(s) linked to this user.`
        : "";
    if (!confirm(`Delete user "${label}"?${orderNote} This cannot be undone.`)) return;
    try {
      const res = await adminFetch(`/api/admin/users/${u._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("User deleted");
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

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
              <th className="p-3">Actions</th>
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
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => remove(u)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
