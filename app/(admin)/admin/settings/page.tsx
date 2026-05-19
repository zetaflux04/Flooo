"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import FormField from "@/components/ui/FormField";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const updatePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both password fields");
      return;
    }
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Settings" />
      <div className="max-w-lg">
        <div className="card space-y-4">
          <h2 className="font-bold text-secondary">Change Admin Password</h2>
          <FormField
            label="Current Password"
            id="current-password"
            type="password"
            placeholder="Enter your current password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <FormField
            label="New Password"
            id="new-password"
            type="password"
            placeholder="Enter a new password (min. 6 characters)"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="button" onClick={updatePassword} disabled={loading} className="btn-primary w-full">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </>
  );
}
