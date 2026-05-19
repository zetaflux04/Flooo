"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import PageContainer from "@/components/ui/PageContainer";
import {
  COMPANY_ADDRESS,
  COMPANY_ADDRESS_LINES,
  COMPANY_EMAIL,
  COMPANY_MAP_DIRECTIONS_URL,
  COMPANY_MAP_EMBED_URL,
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_HREF,
} from "@/lib/company-contact";

const contactFields = [
  { key: "name" as const, label: "Full Name", placeholder: "Your full name", required: true },
  { key: "phone" as const, label: "Phone Number", placeholder: "10-digit mobile number", required: true },
  { key: "email" as const, label: "Email", placeholder: "your@email.com (optional)", required: false, type: "email" },
  { key: "city" as const, label: "City", placeholder: "e.g. Lucknow", required: false },
  { key: "pincode" as const, label: "Pincode", placeholder: "6-digit pincode", required: false },
];

const contactInfo = [
  { icon: Mail, label: "Email", value: COMPANY_EMAIL, href: `mailto:${COMPANY_EMAIL}`, external: false },
  { icon: Phone, label: "Call Us", value: COMPANY_PHONE_DISPLAY, href: COMPANY_PHONE_HREF, external: false },
  {
    icon: MapPin,
    label: "Office Address",
    value: COMPANY_ADDRESS,
    href: COMPANY_MAP_DIRECTIONS_URL,
    external: true,
  },
];

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    pincode: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", phone: "", email: "", city: "", pincode: "", message: "" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <PageContainer>
        <h2 className="section-title">Contact Us or Place an Order</h2>
        <p className="section-subtitle mb-12">We&apos;d love to hear from you</p>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            {contactInfo.map(({ icon: Icon, label, value, href, external }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-light-blue flex items-center justify-center shadow-card shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted">{label}</p>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="font-semibold text-secondary hover:text-primary transition-colors"
                  >
                    {label === "Office Address" ? (
                      <span className="block font-semibold leading-relaxed">
                        {COMPANY_ADDRESS_LINES.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </span>
                    ) : (
                      value
                    )}
                  </a>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <p className="text-sm font-medium text-secondary mb-3">Find us on the map</p>
              <div className="rounded-card overflow-hidden border border-gray-200 shadow-card aspect-[4/3] min-h-[240px]">
                <iframe
                  title={`Flooo office — ${COMPANY_ADDRESS}`}
                  src={COMPANY_MAP_EMBED_URL}
                  className="w-full h-full min-h-[240px] border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={COMPANY_MAP_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm font-medium text-primary hover:text-ripple transition-colors"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card space-y-4 shadow-card">
            {contactFields.map(({ key, label, placeholder, required, type }) => (
              <div key={key} className="space-y-1.5">
                <label htmlFor={`contact-${key}`} className="text-sm font-medium text-secondary block">
                  {label}
                  {required ? " *" : ""}
                </label>
                <input
                  id={`contact-${key}`}
                  className="input-field"
                  type={type || "text"}
                  placeholder={placeholder}
                  required={required}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [key]: key === "pincode" ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value,
                    })
                  }
                  {...(key === "pincode" ? { inputMode: "numeric" as const, maxLength: 6 } : {})}
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <label htmlFor="contact-message" className="text-sm font-medium text-secondary block">
                Message *
              </label>
              <textarea
                id="contact-message"
                className="input-field min-h-[120px]"
                placeholder="How can we help you?"
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-4">
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </PageContainer>
    </section>
  );
}
