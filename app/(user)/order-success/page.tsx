"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

interface OrderData {
  orderId: string;
  total: number;
  createdAt: string;
  items: { name: string; size: string; qty: number; price: number }[];
  deliveryAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliveryInstructions?: string;
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("lastOrder");
    if (raw) setOrder(JSON.parse(raw));
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen bg-light-blue flex items-center justify-center">
        <div className="card text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-secondary mb-4">Order Placed!</h1>
          <Link href="/orders" className="btn-primary inline-block mr-2">View Orders</Link>
          <Link href="/products" className="btn-secondary inline-block">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-blue py-12 px-4">
      <div className="page-container">
        <div className="max-w-2xl mx-auto card text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-checkmark">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-secondary mb-2">Order Placed Successfully!</h1>
        <p className="text-muted mb-8">Thank you for choosing LSP Enterprises. We will call you to confirm your order.</p>

        <div className="grid sm:grid-cols-2 gap-6 text-left mb-8">
          <div>
            <p className="text-sm text-muted">Order ID</p>
            <p className="font-bold text-secondary">{order.orderId}</p>
            <p className="text-sm text-muted mt-3">Date</p>
            <p className="font-semibold">{formatDate(order.createdAt)}</p>
            <p className="text-sm text-muted mt-3">Total</p>
            <p className="font-bold text-secondary text-xl">{formatPrice(order.total)}</p>
          </div>
          <div>
            <p className="font-semibold text-secondary mb-2">Shipping To</p>
            <div className="bg-light-blue rounded-lg p-4 text-sm text-left">
              <p className="font-semibold">{order.deliveryAddress.name}</p>
              <p className="text-muted">{order.deliveryAddress.line1}</p>
              {order.deliveryAddress.line2 && <p className="text-muted">{order.deliveryAddress.line2}</p>}
              <p className="text-muted">
                {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
              </p>
              {order.deliveryInstructions && (
                <p className="text-primary mt-2">Instructions: {order.deliveryInstructions}</p>
              )}
            </div>
          </div>
        </div>

        <h3 className="font-bold text-secondary text-left mb-3">Item Summary</h3>
        <div className="space-y-2 mb-8">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm border rounded-lg p-3">
              <span>{item.name} ({item.size}) × {item.qty}</span>
              <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/orders" className="btn-primary">View My Orders</Link>
          <Link href="/products" className="btn-secondary">Continue Shopping</Link>
        </div>
        </div>
      </div>
    </div>
  );
}
