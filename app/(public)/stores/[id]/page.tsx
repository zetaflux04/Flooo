"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin,
  Clock,
  Info,
  ShoppingBag,
  ArrowLeft,
  FileText,
  Factory,
} from "lucide-react";
import { DealerData } from "@/components/ui/DealerCard";
import { formatPlantLabel, formatPrice } from "@/lib/utils";

interface ProductRow {
  _id: string;
  name: string;
  size: string;
  price: number;
  stock: number;
  category?: string;
}

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [dealer, setDealer] = useState<DealerData | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/dealers/${id}`)
      .then((r) => r.json())
      .then((dealerData) => {
        if (dealerData._id) {
          setDealer(dealerData);
          const storeProducts = Array.isArray(dealerData.products) ? dealerData.products : [];
          setProducts(
            storeProducts.map((p: ProductRow) => ({
              _id: p._id,
              name: p.name,
              size: p.size,
              price: p.price,
              stock: p.stock ?? 0,
            }))
          );
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f0f4f8]">
        <p className="text-muted">Loading store details...</p>
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f0f4f8] gap-4">
        <p className="text-muted">Store not found.</p>
        <Link href="/stores" className="text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to All Stores
        </Link>
      </div>
    );
  }

  const locationLine = [dealer.city, dealer.state, dealer.pincode]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-[#f0f4f8] min-h-screen pb-16">
      <div className="page-container py-8">
        <Link
          href="/stores"
          className="inline-flex items-center gap-1.5 text-secondary hover:text-primary text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Stores
        </Link>

        <div className="rounded-card overflow-hidden bg-gradient-to-r from-secondary via-secondary to-primary p-8 md:p-10 mb-8 relative shadow-[0_10px_40px_-10px_rgba(1,35,122,0.2)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                {dealer.code}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{dealer.name}</h1>
              {dealer.plantNumber != null && dealer.plantNumber >= 1 && (
                <p className="text-white/80">{formatPlantLabel(dealer.plantNumber)}</p>
              )}
            </div>
            <span className="bg-white text-green-600 font-bold text-sm px-4 py-1.5 rounded-full shrink-0">
              OPEN
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <InfoCard icon={<MapPin className="w-5 h-5 text-red-500" />} title="Location">
            <p className="font-semibold text-secondary">{dealer.address}</p>
            {locationLine && <p className="text-muted mt-1">{locationLine}</p>}
          </InfoCard>

          <InfoCard icon={<FileText className="w-5 h-5 text-emerald-500" />} title="Licenses & Contact">
            <div className="space-y-2">
              {dealer.fssaiLicenseNo && (
                <p>
                  <span className="text-muted text-sm">FSSAI License No</span>
                  <br />
                  <span className="font-bold text-primary text-lg">{dealer.fssaiLicenseNo}</span>
                </p>
              )}
              {dealer.factoryLicenseNo && (
                <p>
                  <span className="text-muted text-sm">Factory License No</span>
                  <br />
                  <span className="font-bold text-primary text-lg">{dealer.factoryLicenseNo}</span>
                </p>
              )}
              {dealer.email && (
                <p>
                  <span className="text-muted text-sm">Email</span>
                  <br />
                  <a href={`mailto:${dealer.email}`} className="text-primary font-medium">
                    {dealer.email}
                  </a>
                </p>
              )}
              <p>
                <span className="text-muted text-sm">Manager</span>
                <br />
                <span className="font-medium text-secondary">
                  {dealer.manager}
                  {dealer.managerPhone && (
                    <span className="text-muted"> · {dealer.managerPhone}</span>
                  )}
                </span>
              </p>
            </div>
          </InfoCard>

          <InfoCard icon={<Clock className="w-5 h-5 text-orange-500" />} title="Operations">
            <div className="space-y-3">
              {dealer.timings && (
                <div>
                  <p className="text-muted text-xs uppercase tracking-wide mb-0.5">Hours</p>
                  <p className="font-bold text-primary text-xl">{dealer.timings}</p>
                </div>
              )}
              {dealer.capacity != null && dealer.capacity > 0 && (
                <div>
                  <p className="text-muted text-xs uppercase tracking-wide mb-0.5">
                    Water Capacity
                  </p>
                  <p className="font-bold text-primary text-xl">
                    {dealer.capacity.toLocaleString("en-IN")} Litres
                  </p>
                </div>
              )}
            </div>
          </InfoCard>

          <InfoCard icon={<Info className="w-5 h-5 text-primary" />} title="About">
            <p className="text-secondary leading-relaxed">{dealer.about || dealer.address}</p>
          </InfoCard>
        </div>

        <div className="card shadow-[0_8px_30px_rgba(1,35,122,0.08)] overflow-hidden p-6">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="w-5 h-5 text-secondary" />
            <h2 className="text-lg font-bold text-secondary uppercase tracking-wide">
              Available Products
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Size</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted">
                      No products available at this time.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id} className="border-t border-gray-100">
                      <td className="px-4 py-4 font-medium text-secondary">{p.name}</td>
                      <td className="px-4 py-4 text-muted">{p.size}</td>
                      <td className="px-4 py-4 font-bold text-primary">{formatPrice(p.price)}</td>
                      <td className="px-4 py-4 text-muted">{p.stock} units</td>
                      <td className="px-4 py-4">
                        <span
                          className={
                            p.stock > 0
                              ? "inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full"
                              : "inline-block bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full"
                          }
                        >
                          {p.stock > 0 ? "AVAILABLE" : "OUT OF STOCK"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card shadow-[0_8px_30px_rgba(1,35,122,0.08)]">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</h3>
      </div>
      {children}
    </div>
  );
}
