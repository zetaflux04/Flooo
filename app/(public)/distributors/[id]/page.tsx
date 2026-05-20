"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin,
  Phone,
  Info,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { DistributorData } from "@/components/ui/DistributorCard";
import { formatDistributorFullLocation } from "@/lib/distributor-display";
import { formatPrice } from "@/lib/utils";

interface ProductRow {
  _id: string;
  name: string;
  size: string;
  price: number;
  stock: number;
  category?: string;
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91-${digits.slice(0, 5)}${digits.slice(5)}`;
  return phone;
}

export default function DistributorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [distributor, setDistributor] = useState<DistributorData | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/distributors/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data._id) {
          setDistributor(data);
          const rows = Array.isArray(data.products) ? data.products : [];
          setProducts(
            rows.map((p: ProductRow) => ({
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
        <p className="text-muted">Loading distributor details...</p>
      </div>
    );
  }

  if (!distributor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f0f4f8] gap-4">
        <p className="text-muted">Distributor not found.</p>
        <Link href="/distributors" className="text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to All Distributors
        </Link>
      </div>
    );
  }

  const phoneDigits = distributor.mobileNumber.replace(/\D/g, "").slice(-10);
  const subtitle = formatDistributorFullLocation(distributor);
  const aboutText = distributor.about?.trim();

  return (
    <div className="bg-[#f0f4f8] min-h-screen pb-16">
      <div className="page-container py-8">
        <Link
          href="/distributors"
          className="inline-flex items-center gap-1.5 text-secondary hover:text-primary text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Distributors
        </Link>

        <div className="rounded-card overflow-hidden bg-gradient-to-r from-secondary via-secondary to-primary p-8 md:p-10 mb-8 relative shadow-[0_10px_40px_-10px_rgba(1,35,122,0.2)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white min-w-0">{distributor.name}</h1>
                <span className="shrink-0 bg-white/20 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                  {distributor.code}
                </span>
              </div>
              {subtitle && (
                <p className="text-white/80">{subtitle}</p>
              )}
            </div>
            <span className="bg-white text-green-600 font-bold text-sm px-4 py-1.5 rounded-full shrink-0">
              ACTIVE
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <InfoCard icon={<MapPin className="w-5 h-5 text-red-500" />} title="Location">
            {distributor.area && (
              <p className="font-semibold text-secondary">{distributor.area}</p>
            )}
            <p className={distributor.area ? "text-muted mt-1" : "font-semibold text-secondary"}>
              {distributor.address}
            </p>
            {(distributor.city || distributor.state || distributor.pincode) && (
              <p className="text-muted mt-1">
                {[distributor.city, distributor.state, distributor.pincode].filter(Boolean).join(", ")}
              </p>
            )}
          </InfoCard>

          <InfoCard icon={<Phone className="w-5 h-5 text-pink-500" />} title="Contact">
            <p>
              <span className="text-muted text-sm">Mobile</span>
              <br />
              <a href={`tel:${phoneDigits}`} className="font-bold text-primary text-lg">
                {formatPhone(distributor.mobileNumber)}
              </a>
            </p>
          </InfoCard>

          {distributor.capacity != null && distributor.capacity > 0 && (
            <InfoCard icon={<Info className="w-5 h-5 text-orange-500" />} title="Operations">
              <div>
                <p className="text-muted text-xs uppercase tracking-wide mb-0.5">
                  Water Capacity
                </p>
                <p className="font-bold text-primary text-xl">
                  {distributor.capacity.toLocaleString("en-IN")} Litres
                </p>
              </div>
            </InfoCard>
          )}

          <InfoCard icon={<Info className="w-5 h-5 text-primary" />} title="About">
            <p className="text-secondary leading-relaxed">
              {aboutText || "No description available for this distributor."}
            </p>
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
