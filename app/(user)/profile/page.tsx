"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import FormField from "@/components/ui/FormField";

export default function ProfilePage() {
  const { user, token, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: (user.phone || "").replace(/\D/g, "").slice(-10),
        email: user.email || "",
        line1: user.address?.line1 || "",
        line2: user.address?.line2 || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          phone: phoneDigits,
          address: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      updateUser({
        name: data.name,
        phone: data.phone,
        address: data.address,
      });
      toast.success("Profile updated!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const initials = (user?.name || user?.phone || "U").slice(0, 2).toUpperCase();

  return (
    <div className="page-container py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-secondary">{user?.name || "My Profile"}</h1>
          <p className="text-muted">+91 {form.phone || user?.phone}</p>
        </div>
      </div>
      <form onSubmit={handleSave} className="card space-y-4">
        <div>
          <label className="text-sm font-medium text-secondary">Name</label>
          <input
            className="input-field mt-1"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-secondary">Email (used for login — cannot change)</label>
          <input
            className="input-field mt-1 bg-gray-50"
            type="email"
            value={form.email}
            disabled
          />
        </div>
        <div>
          <label className="text-sm font-medium text-secondary">Phone</label>
          <div className="flex mt-1">
            <span className="inline-flex items-center px-3 rounded-l-btn border border-r-0 border-gray-200 bg-gray-50 text-muted text-sm">
              +91
            </span>
            <input
              className="input-field rounded-l-none flex-1"
              placeholder="9876543210"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
              }
              maxLength={10}
            />
          </div>
        </div>
        <h3 className="font-semibold text-secondary pt-2">Default Address</h3>
        {(
          [
            ["line1", "Address Line 1", "House no., street, area"],
            ["line2", "Address Line 2", "Landmark (optional)"],
            ["city", "City", "e.g. Noida"],
            ["state", "State", "e.g. Uttar Pradesh"],
            ["pincode", "Pincode", "e.g. 201310"],
          ] as const
        ).map(([field, label, placeholder]) => (
          <FormField
            key={field}
            label={label}
            id={`profile-${field}`}
            placeholder={placeholder}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
