"use client";

import { useEffect, useState } from "react";
import DistributorCard, { DistributorData } from "@/components/ui/DistributorCard";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DistributorsPage() {
  const [distributors, setDistributors] = useState<DistributorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/distributors", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setDistributors(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const q = search.toLowerCase().trim();

  const filtered = distributors.filter((d) => {
    if (!q) return true;
    return (
      d.name.toLowerCase().includes(q) ||
      (d.city?.toLowerCase().includes(q) ?? false) ||
      (d.state?.toLowerCase().includes(q) ?? false) ||
      (d.area?.toLowerCase().includes(q) ?? false) ||
      d.code.toLowerCase().includes(q) ||
      d.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-12 bg-[#f0f4f8] min-h-screen">
      <div className="page-container">
        <h1 className="text-4xl font-bold text-secondary mb-2">Distributors</h1>
        <p className="text-muted mb-8">Find your nearest LSP Enterprises distributor — updated live from database</p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            className="input-field flex-1"
            placeholder="Search by name, city, or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((d) => (
              <DistributorCard key={d._id} distributor={d} />
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-muted py-12">No distributors found.</p>
        )}
      </div>
    </div>
  );
}
