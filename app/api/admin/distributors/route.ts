import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Distributor } from "@/models/Distributor";
import { getAdminFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";
import { distributorValidationMessage, sanitizeDistributorBody } from "@/lib/distributor-payload";

export async function GET(req: Request) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);
  await connectDB();
  const distributors = await Distributor.find().sort({ createdAt: -1 }).lean();
  return jsonSuccess(distributors);
}

export async function POST(req: NextRequest) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);
  try {
    const body = await req.json();
    const payload = sanitizeDistributorBody(body as Record<string, unknown>);

    await connectDB();
    const distributor = await Distributor.create(payload);
    return jsonSuccess(distributor, 201);
  } catch (e: unknown) {
    console.error("admin distributors POST:", e);
    return jsonError(distributorValidationMessage(e), 500);
  }
}
