import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Distributor } from "@/models/Distributor";
import { getAdminFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";
import { distributorValidationMessage, sanitizeDistributorBody } from "@/lib/distributor-payload";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);

  try {
    const body = await req.json();
    const update = sanitizeDistributorBody(body as Record<string, unknown>);

    if (Object.keys(update).length === 0) {
      return jsonError("No valid fields to update", 400);
    }

    await connectDB();
    const distributor = await Distributor.findByIdAndUpdate(params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!distributor) return jsonError("Distributor not found", 404);
    return jsonSuccess(distributor);
  } catch (e: unknown) {
    console.error("admin distributors PATCH:", e);
    return jsonError(distributorValidationMessage(e), 500);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);

  try {
    await connectDB();
    const distributor = await Distributor.findByIdAndDelete(params.id);
    if (!distributor) return jsonError("Distributor not found", 404);
    return jsonSuccess({ message: "Deleted" });
  } catch (e: unknown) {
    console.error("admin distributors DELETE:", e);
    return jsonError("Failed to delete distributor", 500);
  }
}
