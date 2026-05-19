"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import Badge from "./Badge";
import { formatPrice } from "@/lib/utils";

export interface ProductData {
  _id: string;
  name: string;
  slug: string;
  category?: string;
  size: string;
  packQty: number;
  price: number;
  description?: string;
  image?: string;
  images?: string[];
}

interface ProductCardProps {
  product: ProductData;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const isApparel = product.category === "apparel";

  const handleAdd = () => {
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      size: product.size,
      packQty: product.packQty,
      price: product.price,
      image: product.image || "",
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="card card-hover flex flex-col shadow-[0_8px_30px_rgba(1,35,122,0.08)]">
      <div className="relative bg-gradient-to-b from-light-blue to-white rounded-lg p-4 mb-4 h-52 flex items-center justify-center overflow-hidden">
        <Badge
          variant={isApparel ? "magenta" : "green"}
          className="absolute top-3 left-3 z-10"
        >
          {isApparel ? "Apparel" : "BIS Certified"}
        </Badge>
        <Image
          src={product.image || "/1.png"}
          alt={product.name}
          width={180}
          height={220}
          className="object-contain h-full w-auto drop-shadow-lg transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-secondary text-lg">{product.name}</h3>
        <span className="font-bold text-primary">{formatPrice(product.price)}</span>
      </div>
      <p className="text-muted text-sm mb-1 line-clamp-2">
        {product.description ||
          (isApparel
            ? "Premium LSP Enterprises branded apparel"
            : `Premium mineral water — ${product.size}`)}
      </p>
      <p className="text-xs font-semibold text-secondary uppercase mb-4">
        {isApparel ? "One Size" : `${product.size} • ${product.packQty} Pack`}
      </p>
      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleAdd}
          className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-2.5"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
        <Link
          href={`/products/${product.slug}`}
          className="btn-secondary flex-1 text-center text-sm py-2.5"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
