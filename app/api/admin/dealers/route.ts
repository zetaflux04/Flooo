import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Dealer } from "@/models/Dealer";
import { getAdminFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function GET(req: Request) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);
  await connectDB();
  const dealers = await Dealer.find().sort({ city: 1 }).lean();
  return jsonSuccess(dealers);
}

export async function POST(req: NextRequest) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);
  try {
    const body = await req.json();
    await connectDB();
    const dealer = await Dealer.create(body);
    return jsonSuccess(dealer, 201);
  } catch (e: unknown) {
    const err = e as { code?: number };
    if (err.code === 11000) return jsonError("Dealer code already exists");
    return jsonError("Failed to create dealer", 500);
  }
}
