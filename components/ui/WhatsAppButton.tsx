"use client";

import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { COMPANY_WHATSAPP } from "@/lib/company-contact";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || COMPANY_WHATSAPP;

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-2 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A]
        text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="w-8 h-8" />
    </a>
  );
}
