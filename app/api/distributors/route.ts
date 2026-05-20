import { connectDB } from "@/lib/db";
import { Distributor } from "@/models/Distributor";
import { jsonSuccess } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    const distributors = await Distributor.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    return jsonSuccess(distributors);
  } catch (e) {
    console.error("distributors GET:", e);
    return jsonSuccess([]);
  }
}
