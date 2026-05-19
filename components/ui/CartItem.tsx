"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType, useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQty, removeItem } = useCartStore();

  return (
    <div className="card flex flex-col sm:flex-row gap-4">
      <div className="bg-light-blue rounded-lg p-3 w-full sm:w-28 h-28 flex items-center justify-center shrink-0">
        <Image
          src={item.image || "/1.png"}
          alt={item.name}
          width={80}
          height={100}
          className="object-contain h-full"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-secondary">{item.name}</h3>
        <p className="text-muted text-sm">{item.size} • Pack of {item.packQty}</p>
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-3 bg-light-blue rounded-btn px-2 py-1">
            <button
              type="button"
              onClick={() => updateQty(item.productId, item.qty - 1)}
              className="p-1 hover:text-primary"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-semibold w-6 text-center">{item.qty}</span>
            <button
              type="button"
              onClick={() => updateQty(item.productId, item.qty + 1)}
              className="p-1 hover:text-primary"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="text-right">
            <p className="font-bold text-secondary text-lg">{formatPrice(item.price * item.qty)}</p>
            <button
              type="button"
              onClick={() => removeItem(item.productId)}
              className="text-primary text-sm flex items-center gap-1 mt-1 hover:underline"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
