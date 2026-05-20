import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import { formatDistributorLocationLine } from "@/lib/distributor-display";

export interface DistributorData {
  _id: string;
  name: string;
  code: string;
  area?: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  capacity?: number;
  about?: string;
  mobileNumber: string;
}

const CAPACITY_MAX = 15000;

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91-${digits.slice(0, 5)}${digits.slice(5)}`;
  return phone;
}

export default function DistributorCard({ distributor }: { distributor: DistributorData }) {
  const phoneDigits = distributor.mobileNumber.replace(/\D/g, "").slice(-10);
  const capacity = distributor.capacity ?? 0;
  const capacityPct = Math.min(100, Math.round((capacity / CAPACITY_MAX) * 100));
  const locationLine = formatDistributorLocationLine(distributor);
  const hasStructuredLocation = Boolean(distributor.area || distributor.city || distributor.state);
  const aboutText = distributor.about?.trim();

  return (
    <div className="rounded-card overflow-hidden shadow-[0_10px_40px_-10px_rgba(1,35,122,0.15)] bg-white transition-transform duration-300 hover:-translate-y-1">
      <div className="bg-gradient-to-r from-secondary to-primary px-5 py-4 relative">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-white text-lg leading-tight truncate min-w-0 flex-1">
            {distributor.name}
          </h3>
          <span className="shrink-0 bg-white/20 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
            {distributor.code}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-2.5 text-sm text-muted">
        <p className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
          <span>
            <span className="text-secondary font-medium">{locationLine}</span>
            {distributor.pincode && (
              <span className="block text-xs mt-0.5">PIN {distributor.pincode}</span>
            )}
            {hasStructuredLocation && distributor.address && (
              <span className="block text-xs mt-0.5 text-muted/80">{distributor.address}</span>
            )}
          </span>
        </p>
        {aboutText && (
          <p className="text-xs text-muted line-clamp-2 leading-relaxed">{aboutText}</p>
        )}
        <p className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-pink-500 shrink-0" />
          <span>{formatPhone(distributor.mobileNumber)}</span>
        </p>
        {capacity > 0 && (
          <div className="pt-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-secondary">Capacity</span>
              <span className="font-semibold text-secondary">
                {capacity.toLocaleString("en-IN")} L
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${capacityPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-5 flex gap-2">
        <Link
          href={`/distributors/${distributor._id}`}
          className="flex-1 text-center py-2.5 rounded-btn bg-light-blue text-secondary font-semibold text-sm hover:bg-primary/20 transition-colors"
        >
          View Details
        </Link>
        <a
          href={`tel:${phoneDigits}`}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-btn bg-green-50 text-green-700 font-semibold text-sm hover:bg-green-100 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call
        </a>
      </div>
    </div>
  );
}
