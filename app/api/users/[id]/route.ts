import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getUserFromRequest(req);
    if (!auth || auth.userId !== params.id) return jsonError("Unauthorized", 401);

    await connectDB();
    const user = await User.findById(params.id).select("-__v").lean();
    if (!user) return jsonError("User not found", 404);
    return jsonSuccess(user);
  } catch (e) {
    return jsonError("Failed to fetch user", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getUserFromRequest(req);
    if (!auth || auth.userId !== params.id) return jsonError("Unauthorized", 401);

    const { name, phone, address } = await req.json();
    await connectDB();

    const phoneDigits = phone ? String(phone).replace(/\D/g, "").slice(-10) : undefined;
    if (phoneDigits && phoneDigits.length !== 10) {
      return jsonError("Phone must be a valid 10-digit number", 400);
    }

    const update: Record<string, unknown> = { name, address };
    if (phoneDigits) update.phone = phoneDigits;

    const user = await User.findByIdAndUpdate(params.id, update, { new: true }).select("-__v");

    if (!user) return jsonError("User not found", 404);
    return jsonSuccess(user);
  } catch (e) {
    return jsonError("Failed to update profile", 500);
  }
}
