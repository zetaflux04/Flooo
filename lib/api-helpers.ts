import { NextResponse } from "next/server";
import { connectDB } from "./db";
import { Order } from "@/models/Order";

export async function withDB<T>(handler: () => Promise<T>): Promise<T> {
  await connectDB();
  return handler();
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export async function generateOrderId(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `FLO-${year}-`;
  const last = await Order.findOne({ orderId: new RegExp(`^${prefix}`) })
    .sort({ orderId: -1 })
    .lean();
  let num = 1;
  if (last?.orderId) {
    const parts = last.orderId.split("-");
    num = parseInt(parts[2] || "0", 10) + 1;
  }
  return `${prefix}${String(num).padStart(4, "0")}`;
}
