"use client";

import { useEffect, useState } from "react";
import DealerCard, { DealerData } from "@/components/ui/DealerCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

const types = ["All", "Wholesale", "Retail", "Distribution"];

export default function StoresPage() {
  const [dealers, setDealers] = useState<DealerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  useEffect(() => {
    fetch("/api/dealers", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setDealers(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = dealers.filter((d) => {
    const matchSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase());
    const matchType = type === "All" || d.type === type;
    return matchSearch && matchType;
  });

  return (
    <div className="py-12 bg-[#f0f4f8] min-h-screen">
      <div className="page-container">
        <h1 className="text-4xl font-bold text-secondary mb-2">Our Stores</h1>
        <p className="text-muted mb-8">Find your nearest Flooo dealer — updated live from database</p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            className="input-field flex-1"
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border",
                  type === t ? "border-primary text-primary bg-light-blue" : "border-gray-200 text-muted"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((d, i) => (
              <DealerCard key={d._id} dealer={d} index={i + 1} />
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-muted py-12">No stores found.</p>
        )}
      </div>
    </div>
  );
}

