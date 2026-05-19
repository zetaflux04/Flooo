import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Dealer } from "@/models/Dealer";
import { getAdminFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";
import { dealerValidationMessage, sanitizeDealerBody } from "@/lib/dealer-payload";

export async function GET(req: Request) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);
  await connectDB();
  const dealers = await Dealer.find().sort({ plantNumber: 1 }).lean();
  return jsonSuccess(dealers);
}

export async function POST(req: NextRequest) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);
  try {
    const body = await req.json();
    const payload = sanitizeDealerBody(body as Record<string, unknown>);

    if (!payload.plantNumber) {
      return jsonError("Plant number is required (e.g. 1 for Plant 1)", 400);
    }

    await connectDB();
    const dealer = await Dealer.create(payload);
    return jsonSuccess(dealer, 201);
  } catch (e: unknown) {
    console.error("admin dealers POST:", e);
    return jsonError(dealerValidationMessage(e), 500);
  }
}
