import Link from "next/link";
import { MapPin, FileText, Factory } from "lucide-react";
import { formatPlantLabel } from "@/lib/utils";

export interface DealerData {
  _id: string;
  name: string;
  code: string;
  plantNumber?: number;
  city: string;
  state: string;
  address: string;
  fssaiLicenseNo?: string;
  factoryLicenseNo?: string;
  about?: string;
  pincode?: string;
  capacity?: number;
}

const CAPACITY_MAX = 15000;

export default function DealerCard({ dealer }: { dealer: DealerData }) {
  const capacity = dealer.capacity ?? 0;
  const capacityPct = Math.min(100, Math.round((capacity / CAPACITY_MAX) * 100));
  const plantLabel =
    dealer.plantNumber != null && dealer.plantNumber >= 1
      ? formatPlantLabel(dealer.plantNumber)
      : null;

  return (
    <div className="rounded-card overflow-hidden shadow-[0_10px_40px_-10px_rgba(1,35,122,0.15)] bg-white transition-transform duration-300 hover:-translate-y-1">
      <div className="bg-gradient-to-r from-secondary to-primary px-5 py-4 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {plantLabel && (
              <span className="w-9 h-9 rounded-full bg-white text-secondary font-bold text-sm flex items-center justify-center shrink-0">
                {dealer.plantNumber}
              </span>
            )}
            <div className="min-w-0">
              <h3 className="font-bold text-white text-lg leading-tight truncate">{dealer.name}</h3>
              <p className="text-white/80 text-xs mt-0.5">{dealer.code}</p>
            </div>
          </div>
          {plantLabel && (
            <span className="shrink-0 bg-white rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-secondary">
              {plantLabel}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-2.5 text-sm text-muted">
        <p className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
          <span>{dealer.address}</span>
        </p>
        {dealer.fssaiLicenseNo && (
          <p className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>FSSAI License No: {dealer.fssaiLicenseNo}</span>
          </p>
        )}
        {dealer.factoryLicenseNo && (
          <p className="flex items-center gap-2">
            <Factory className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Factory License No: {dealer.factoryLicenseNo}</span>
          </p>
        )}
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

      <div className="px-5 pb-5">
        <Link
          href={`/stores/${dealer._id}`}
          className="block text-center py-2.5 rounded-btn bg-light-blue text-secondary font-semibold text-sm hover:bg-primary/20 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
