"use client";

import { useEffect, useState } from "react";
import ProductCard, { ProductData } from "@/components/ui/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "all", label: "All" },
  { id: "bottle", label: "Bottles" },
  { id: "apparel", label: "Apparel" },
] as const;

const sizeFilters = ["All", "200ml", "250ml", "500ml", "1000ml"] as const;

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>("all");
  const [sizeFilter, setSizeFilter] = useState<string>("All");

  useEffect(() => {
    const q = tab === "all" ? "" : `?category=${tab}`;
    setLoading(true);
    fetch(`/api/products${q}`)
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [tab]);

  const filtered =
    sizeFilter === "All" ? products : products.filter((p) => p.size === sizeFilter);

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="page-container">
        <h1 className="text-4xl font-bold text-secondary mb-2">Our Hydration Essentials</h1>
        <p className="text-muted mb-8 max-w-2xl">
          Premium FSSAI certified water bottles and LSP Enterprises branded apparel.
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setTab(t.id); setSizeFilter("All"); }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                  tab === t.id
                    ? "border-primary text-primary bg-light-blue"
                    : "border-gray-200 text-muted hover:border-primary"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {tab !== "apparel" && (
          <div className="flex flex-wrap gap-2 mb-10">
            {sizeFilters.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSizeFilter(s)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                  sizeFilter === s
                    ? "border-secondary text-secondary bg-light-blue"
                    : "border-gray-200 text-muted hover:border-secondary"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : filtered.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </div>
  );
}

