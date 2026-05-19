import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const product = await Product.findOne({
      $or: [{ slug: params.id }, { _id: params.id }],
      isActive: true,
    }).lean();

    if (!product) return jsonError("Product not found", 404);
    return jsonSuccess(product);
  } catch (e) {
    console.error("product GET:", e);
    return jsonError("Failed to fetch product", 500);
  }
}
