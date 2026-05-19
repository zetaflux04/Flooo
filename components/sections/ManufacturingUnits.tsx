"use client";

import { useEffect, useState } from "react";
import DealerCard, { DealerData } from "@/components/ui/DealerCard";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ManufacturingUnits() {
  const [dealers, setDealers] = useState<DealerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dealers")
      .then((r) => r.json())
      .then((d) => setDealers(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="stores" className="py-20 bg-white">
      <div className="page-container">
        <h2 className="section-title">Our Manufacturing Units</h2>
        <p className="section-subtitle mb-12">Find your nearest Flooo dealer</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))
            : dealers.map((d, i) => <DealerCard key={d._id} dealer={d} index={i + 1} />)}
        </div>
      </div>
    </section>
  );
}

