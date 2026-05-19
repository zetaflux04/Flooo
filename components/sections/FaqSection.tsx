"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "Is Flooo water BIS certified?", a: "Yes, Flooo is fully BIS certified added mineral water meeting all Indian quality standards." },
  { q: "What sizes are available?", a: "We offer 250ml, 500ml, and 1 Litre packs in boxes of 24 or 12." },
  { q: "How is the water purified?", a: "Multi-stage RO + UV + UF purification with mineral enrichment for optimal taste." },
  { q: "Can I order in bulk?", a: "Yes! Contact your nearest wholesale unit for bulk pricing and delivery." },
  { q: "How long does delivery take?", a: "Same-day delivery is available in serviceable areas. We call to confirm every order." },
  { q: "Where are your stores?", a: "Our units are in Barabanki (UP), Gurugram (Haryana), and Greater Noida (UP)." },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-light-blue">
      <div className="page-container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle mb-10">Everything you need to know about Flooo</p>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="card !p-0 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-secondary"
              >
                {f.q}
                <ChevronDown className={cn("w-5 h-5 shrink-0 transition-transform", open === i && "rotate-180")} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-muted text-sm border-t border-gray-100 pt-3">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
