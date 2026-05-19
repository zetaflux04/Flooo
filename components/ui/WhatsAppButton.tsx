"use client";

import { MessageCircle } from "lucide-react";

import { COMPANY_WHATSAPP } from "@/lib/company-contact";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || COMPANY_WHATSAPP;

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600
        text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
