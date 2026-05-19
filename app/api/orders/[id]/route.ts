import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { getUserFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return jsonError("Unauthorized", 401);

    await connectDB();
    const order = await Order.findOne({
      $or: [{ orderId: params.id }, { _id: params.id }],
      user: user.userId,
    }).lean();

    if (!order) return jsonError("Order not found", 404);
    return jsonSuccess(order);
  } catch (e) {
    return jsonError("Failed to fetch order", 500);
  }
}
