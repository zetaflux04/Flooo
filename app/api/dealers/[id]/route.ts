import { connectDB } from "@/lib/db";
import { Dealer } from "@/models/Dealer";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const dealer = await Dealer.findOne({ _id: params.id, isActive: true })
      .populate({
        path: "availableProducts.productId",
        match: { isActive: true },
      })
      .lean();

    if (!dealer) return jsonError("Store not found", 404);

    type PopulatedProduct = {
      _id: { toString(): string };
      name: string;
      size: string;
      price: number;
      category?: string;
    };

    const products = (dealer.availableProducts || [])
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

    const { availableProducts: _, ...dealerData } = dealer;
    return jsonSuccess({ ...dealerData, products });
  } catch (e) {
    console.error("dealer GET:", e);
    return jsonError("Store not found", 404);
  }
}
