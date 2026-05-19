import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function GET(req: Request) {
  const payload = await getUserFromRequest(req);
  if (!payload) return jsonError("Unauthorized", 401);

  const cookieStore = await cookies();
  const token = cookieStore.get("userToken")?.value;
  if (!token) return jsonError("Unauthorized", 401);

  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(payload.userId)) {
      throw new Error("Invalid user id");
    }
    const user = await User.findById(payload.userId).select("-password").lean();
    if (user) {
      return jsonSuccess({
        user: {
          _id: String(user._id),
          name: user.name,
          email: user.email,
          username: user.username,
          phone: user.phone || "",
          address: user.address,
        },
        token,
      });
    }
  } catch {
    // Fall back to JWT claims when DB is unavailable
  }

  return jsonSuccess({
    user: {
      _id: payload.userId,
      name: payload.name || "",
      email: payload.email,
      phone: payload.phone || "",
    },
    token,
  });
}
