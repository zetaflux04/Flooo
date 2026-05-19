import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { getAdminFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function GET(req: Request) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);
  await connectDB();

  const status = new URL(req.url).searchParams.get("status");
  const filter = status && status !== "all" ? { status } : {};

  const orders = await Order.find(filter)
    .populate("user", "name phone email username")
    .sort({ createdAt: -1 })
    .lean();

  return jsonSuccess(orders);
}
