"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import ProductCard, { ProductData } from "@/components/ui/ProductCard";
import Badge from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [related, setRelated] = useState<ProductData[]>([]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((p) => {
        if (p._id) {
          setProduct(p);
          setActiveImage(0);
        }
      });
    fetch("/api/products")
      .then((r) => r.json())
      .then((all: ProductData[]) => {
        if (Array.isArray(all)) setRelated(all.filter((p) => p.slug !== id).slice(0, 3));
      });
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    addItem(
      {
        productId: product._id,
        name: product.name,
        slug: product.slug,
        size: product.size,
        packQty: product.packQty,
        price: product.price,
        image: product.image || "",
      },
      qty
    );
    toast.success("Added to cart!");
  };

  const buyNow = () => {
    addToCart();
    router.push("/checkout");
  };

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted">Loading product...</p>
      </div>
    );
  }

  const isApparel = product.category === "apparel";
  const gallery =
    product.images && product.images.length > 0
      ? product.images
      : [product.image || "/1.png"];
  const tabs = ["description", "specifications", "certifications"] as const;

  return (
    <div className="py-12 bg-light-blue min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="card p-4 relative">
            <Badge variant="green" className="absolute top-6 left-6 z-10">
              {isApparel ? "APPAREL" : "BIS CERTIFIED"}
            </Badge>
            <div className="relative h-96 bg-gradient-to-b from-light-blue to-white rounded-lg flex items-center justify-center">
              <Image
                src={gallery[activeImage]}
                alt={product.name}
                width={320}
                height={400}
                className="object-contain drop-shadow-xl max-h-full"
              />
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-3 mt-4 justify-center">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-lg border-2 overflow-hidden bg-white ${
                      activeImage === i ? "border-primary" : "border-gray-200"
                    }`}
                  >
                    <Image src={src} alt="" fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <Badge variant="magenta">{product.size}</Badge>
            <h1 className="text-3xl font-bold text-secondary mt-3 mb-2">{product.name}</h1>
            <p className="text-muted mb-4">{product.description}</p>
            <p className="text-3xl font-bold text-primary mb-1">
              {formatPrice(product.price)}
              {!isApparel && (
                <span className="text-base text-muted font-normal"> / {product.packQty}-Pack</span>
              )}
            </p>
            <p className="text-sm text-muted mb-6">
              {isApparel ? "Standard size" : `Pack of ${product.packQty} bottles`}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-secondary">Quantity:</span>
              <div className="flex items-center gap-3 bg-white border rounded-btn px-3 py-2">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="font-bold">
                  −
                </button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <button type="button" onClick={() => setQty(qty + 1)} className="font-bold">
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={addToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button onClick={buyNow} className="btn-secondary flex-1">
                Buy Now
              </button>
            </div>
          </div>
        </div>
        <div className="card mb-16">
          <div className="flex gap-6 border-b mb-6">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`pb-3 capitalize font-semibold text-sm border-b-2 -mb-px ${
                  tab === t ? "border-primary text-primary" : "border-transparent text-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "description" && (
            <p className="text-muted leading-relaxed">{product.description}</p>
          )}
          {tab === "specifications" && (
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Type", isApparel ? "Apparel" : "Mineral Water"],
                  ["Size", product.size],
                  isApparel ? null : ["Pack Size", `${product.packQty} bottles`],
                  isApparel ? null : ["Purification", "RO + UV + UF"],
                  ["Brand", "Flooo by LSP Enterprises"],
                ]
                  .filter(Boolean)
                  .map((row) => {
                    const [k, v] = row as [string, string];
                    return (
                      <tr key={k} className="border-b">
                        <td className="py-3 font-semibold text-secondary w-1/3">{k}</td>
                        <td className="py-3 text-muted">{v}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
          {tab === "certifications" && (
            <p className="text-muted">
              {isApparel
                ? "Premium quality cotton blend. Official Flooo branded merchandise."
                : "Flooo is BIS certified added mineral water manufactured under strict quality controls at LSP Enterprises facilities. All products meet IS 14543 standards."}
            </p>
          )}
        </div>
        {related.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-secondary mb-6">You May Also Like</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
