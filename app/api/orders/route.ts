import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { getUserFromRequest } from "@/lib/auth";
import { generateOrderId, jsonError, jsonSuccess } from "@/lib/api-helpers";
import { resolveProduct } from "@/lib/resolve-product";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user?.userId) return jsonError("Unauthorized", 401);

    await connectDB();
    const orders = await Order.find({ user: user.userId })
      .sort({ createdAt: -1 })
      .lean();
    return jsonSuccess(orders);
  } catch (e) {
    console.error("orders GET:", e);
    return jsonError("Failed to fetch orders", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user?.userId) return jsonError("Unauthorized", 401);

    const body = await req.json();
    const { items, deliveryAddress, deliveryInstructions } = body;

    if (!items?.length || !deliveryAddress) {
      return jsonError("Items and delivery address are required");
    }

    await connectDB();

    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const product = await resolveProduct(item.productId, {
        slug: item.slug,
        name: item.name,
      });
      if (!product) {
        return jsonError(`Product not available: ${item.name || item.productId}`);
      }
      const lineTotal = product.price * item.qty;
      total += lineTotal;
      orderItems.push({
        product: product._id,
        name: product.name,
        size: product.size,
        qty: item.qty,
        price: product.price,
      });
    }

    const orderId = await generateOrderId();
    const order = await Order.create({
      orderId,
      user: user.userId,
      items: orderItems,
      total,
      deliveryAddress,
      deliveryInstructions,
      status: "Pending",
    });

    return jsonSuccess(order, 201);
  } catch (e) {
    console.error("orders POST:", e);
    return jsonError("Failed to create order", 500);
  }
}
