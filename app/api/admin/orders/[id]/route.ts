import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Order, ORDER_STATUSES } from "@/models/Order";
import { getAdminFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);
  const { status } = await req.json();
  if (!status) return jsonError("Status is required");
  if (!ORDER_STATUSES.includes(status)) {
    return jsonError(`Invalid status. Allowed: ${ORDER_STATUSES.join(", ")}`);
  }

  await connectDB();
  const order = await Order.findByIdAndUpdate(
    params.id,
    { status },
    { new: true }
  ).populate("user", "name phone email username");

  if (!order) return jsonError("Order not found", 404);
  return jsonSuccess(order);
}
