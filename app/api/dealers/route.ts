import { connectDB } from "@/lib/db";
import { Dealer } from "@/models/Dealer";
import { jsonSuccess } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    const dealers = await Dealer.find({ isActive: true }).sort({ plantNumber: 1 }).lean();
    return jsonSuccess(dealers);
  } catch (e) {
    console.error("dealers GET:", e);
    return jsonSuccess([]);
  }
}
