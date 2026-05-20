import { connectDB } from "@/lib/db";
import { Distributor } from "@/models/Distributor";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const distributor = await Distributor.findOne({ _id: params.id, isActive: true })
      .populate({
        path: "availableProducts.productId",
        match: { isActive: true },
      })
      .lean();

    if (!distributor) return jsonError("Distributor not found", 404);

    type PopulatedProduct = {
      _id: { toString(): string };
      name: string;
      size: string;
      price: number;
      category?: string;
    };

    const products = (distributor.availableProducts || [])
      .filter((ap) => ap.isAvailable && ap.productId && typeof ap.productId === "object")
      .map((ap) => {
        const p = ap.productId as unknown as PopulatedProduct;
        return {
          _id: p._id.toString(),
          name: p.name,
          size: p.size,
          price: p.price,
          stock: ap.stock,
          category: p.category,
        };
      });

    const { availableProducts: _, ...distributorData } = distributor;
    return jsonSuccess({ ...distributorData, products });
  } catch (e) {
    console.error("distributor GET:", e);
    return jsonError("Distributor not found", 404);
  }
}
