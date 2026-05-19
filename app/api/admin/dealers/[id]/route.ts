import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Dealer } from "@/models/Dealer";
import { getAdminFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";
import { dealerValidationMessage, sanitizeDealerBody } from "@/lib/dealer-payload";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);

  try {
    const body = await req.json();
    const update = sanitizeDealerBody(body as Record<string, unknown>);

    if (Object.keys(update).length === 0) {
      return jsonError("No valid fields to update", 400);
    }

    await connectDB();
    const dealer = await Dealer.findByIdAndUpdate(params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!dealer) return jsonError("Dealer not found", 404);
    return jsonSuccess(dealer);
  } catch (e: unknown) {
    console.error("admin dealers PATCH:", e);
    return jsonError(dealerValidationMessage(e), 500);
  }
}
