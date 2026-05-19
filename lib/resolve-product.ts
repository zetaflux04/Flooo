import mongoose from "mongoose";
import { Product, type IProduct } from "@/models/Product";

/** Legacy fallback IDs from /api/products when DB was empty */
const LEGACY_ID_TO_SLUG: Record<string, string> = {
  prod_100: "flooo-100ml",
  prod_250: "flooo-250ml",
  prod_500: "flooo-500ml",
  prod_1l: "flooo-1l",
  prod_tshirt: "flooo-tshirt",
};

/** Old index-based IDs (prod_0, prod_1, prod_2, …) from earlier builds */
const LEGACY_INDEX_SLUGS = [
  "flooo-100ml",
  "flooo-250ml",
  "flooo-500ml",
  "flooo-1l",
  "flooo-tshirt",
];

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
}

export async function resolveProduct(
  productId: string,
  opts?: { slug?: string; name?: string }
): Promise<IProduct | null> {
  if (isValidObjectId(productId)) {
    const byId = await Product.findById(productId);
    if (byId?.isActive) return byId;
  }

  let slug = opts?.slug || LEGACY_ID_TO_SLUG[productId];
  if (!slug && productId.startsWith("flooo-")) slug = productId;
  if (!slug) {
    const indexMatch = productId.match(/^prod_(\d+)$/);
    if (indexMatch) {
      const idx = parseInt(indexMatch[1], 10);
      slug = LEGACY_INDEX_SLUGS[idx];
    }
  }

  if (slug) {
    const bySlug = await Product.findOne({ slug, isActive: true });
    if (bySlug) return bySlug;
  }

  if (opts?.name) {
    const byName = await Product.findOne({ name: opts.name, isActive: true });
    if (byName) return byName;
  }

  return null;
}
