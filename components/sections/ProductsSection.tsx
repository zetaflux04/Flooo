"use client";

import { useEffect, useState } from "react";
import ProductCard, { ProductData } from "@/components/ui/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "all", label: "All" },
  { id: "bottle", label: "Bottles" },
  { id: "apparel", label: "Apparel" },
] as const;

export default function ProductsSection() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>("all");

  useEffect(() => {
    const q = tab === "all" ? "" : `?category=${tab}`;
    setLoading(true);
    fetch(`/api/products${q}`)
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <section id="products" className="py-20 bg-white relative">
      <div className="page-container">
        <h2 className="section-title">We Deliver Best Quality Packaging Drinking Water Bottles</h2>
        <p className="section-subtitle mb-4 mt-4">
          <span>☆ LSP Flooo</span>
          <span className="ml-4">☆ LPS Flowers</span>
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium border transition-colors",
                tab === t.id
                  ? "border-primary text-primary bg-light-blue"
                  : "border-gray-200 text-muted hover:border-primary"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/products" className="btn-primary inline-block">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

