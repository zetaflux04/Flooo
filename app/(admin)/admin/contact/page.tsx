"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { formatDate } from "@/lib/utils";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<Array<{
    _id: string;
    name: string;
    phone: string;
    email?: string;
    city?: string;
    pincode?: string;
    message: string;
    createdAt: string;
  }>>([]);

  useEffect(() => {
    adminFetch("/api/admin/contact").then((r) => r.json()).then(setSubmissions);
  }, []);

  return (
    <>
      <AdminHeader title="Contact Submissions" />
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-light-blue text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">City</th>
              <th className="p-3">Pincode</th>
              <th className="p-3">Message</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.phone}</td>
                <td className="p-3">{s.email || "—"}</td>
                <td className="p-3">{s.city || "—"}</td>
                <td className="p-3">{s.pincode || "—"}</td>
                <td className="p-3 max-w-xs truncate">{s.message}</td>
                <td className="p-3">{formatDate(s.createdAt)}</td>
                <td className="p-3">
                  <a
                    href={`mailto:${s.email || "lspenterpriseslko@gmail.com"}?subject=Re: Your LSP Enterprises enquiry`}
                    className="text-primary hover:underline"
                  >
                    Reply
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
