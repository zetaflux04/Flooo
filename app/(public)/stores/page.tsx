"use client";

import { useEffect, useState } from "react";
import DealerCard, { DealerData } from "@/components/ui/DealerCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn, formatPlantLabel } from "@/lib/utils";

export default function StoresPage() {
  const [dealers, setDealers] = useState<DealerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [plantFilter, setPlantFilter] = useState<number | "all">("all");

  useEffect(() => {
    fetch("/api/dealers", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setDealers(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const plantNumbers = Array.from(
    new Set(
      dealers
        .map((d) => d.plantNumber)
        .filter((n): n is number => n != null && n >= 1)
    )
  ).sort((a, b) => a - b);

  const filtered = dealers
    .filter((d) => {
      const matchSearch =
        !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.city.toLowerCase().includes(search.toLowerCase());
      const matchPlant = plantFilter === "all" || d.plantNumber === plantFilter;
      return matchSearch && matchPlant;
    })
    .sort((a, b) => (a.plantNumber ?? 999) - (b.plantNumber ?? 999));

  return (
    <div className="py-12 bg-[#f0f4f8] min-h-screen">
      <div className="page-container">
        <h1 className="text-4xl font-bold text-secondary mb-2">Our Stores</h1>
        <p className="text-muted mb-8">Find your nearest LSP Enterprises dealer — updated live from database</p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            className="input-field flex-1"
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {plantNumbers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPlantFilter("all")}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border",
                  plantFilter === "all"
                    ? "border-primary text-primary bg-light-blue"
                    : "border-gray-200 text-muted"
                )}
              >
                All
              </button>
              {plantNumbers.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPlantFilter(n)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border",
                    plantFilter === n
                      ? "border-primary text-primary bg-light-blue"
                      : "border-gray-200 text-muted"
                  )}
                >
                  {formatPlantLabel(n)}
                </button>
              ))}
            </div>
          )}
        </div>
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((d) => (
              <DealerCard key={d._id} dealer={d} />
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

