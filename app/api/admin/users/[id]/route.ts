import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
import { getAdminFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);

  try {
    await connectDB();
    const user = await User.findById(params.id);
    if (!user) return jsonError("User not found", 404);

    await Order.deleteMany({ user: params.id });
    await User.findByIdAndDelete(params.id);
    return jsonSuccess({ message: "Deleted" });
  } catch (e) {
    console.error("admin users DELETE:", e);
    return jsonError("Failed to delete user", 500);
  }
}
