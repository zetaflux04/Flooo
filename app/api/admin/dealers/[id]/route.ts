import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Dealer } from "@/models/Dealer";
import { getAdminFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);
  const body = await req.json();
  await connectDB();
  const dealer = await Dealer.findByIdAndUpdate(params.id, body, { new: true });
  if (!dealer) return jsonError("Dealer not found", 404);
  return jsonSuccess(dealer);
}
