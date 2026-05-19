import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { jsonSuccess } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const fallbackProducts = [
  {
    _id: "flooo-100ml",
    name: "Flooo 100ml",
    slug: "flooo-100ml",
    category: "bottle",
    size: "100ml",
    packQty: 48,
    price: 65,
    description: "Compact 100ml bottles for events and on-the-go hydration.",
    image: "/1.png",
    stock: 100,
    isActive: true,
  },
  {
    _id: "flooo-250ml",
    name: "Flooo 250ml",
    slug: "flooo-250ml",
    category: "bottle",
    size: "250ml",
    packQty: 24,
    price: 85,
    description: "Perfect for quick hydration on the go.",
    image: "/flooo-bottle.png",
    stock: 100,
    isActive: true,
  },
  {
    _id: "flooo-500ml",
    name: "Flooo 500ml",
    slug: "flooo-500ml",
    category: "bottle",
    size: "500ml",
    packQty: 24,
    price: 105,
    description: "Your daily companion for staying hydrated.",
    image: "/2.png",
    stock: 100,
    isActive: true,
  },
  {
    _id: "flooo-1l",
    name: "Flooo 1 Litre",
    slug: "flooo-1l",
    category: "bottle",
    size: "1L",
    packQty: 12,
    price: 120,
    description: "Ideal for sharing or long journeys.",
    image: "/3.png",
    stock: 100,
    isActive: true,
  },
  {
    _id: "flooo-tshirt",
    name: "Flooo T-Shirt",
    slug: "flooo-tshirt",
    category: "apparel",
    size: "Standard",
    packQty: 1,
    price: 499,
    description: "Premium cotton Flooo branded T-shirt.",
    image: "/shirt_front.png",
    images: ["/shirt_front.png", "/shirt_back.png"],
    stock: 100,
    isActive: true,
  },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    await connectDB();
    const filter: Record<string, unknown> = { isActive: true };
    if (category === "bottle" || category === "apparel") {
      filter.category = category;
    }
    const products = await Product.find(filter).sort({ category: 1, price: 1 }).lean();
    if (products.length === 0) {
      const fallback = category
        ? fallbackProducts.filter((p) => p.category === category)
        : fallbackProducts;
      return jsonSuccess(fallback);
    }
    return jsonSuccess(products);
  } catch (e) {
    console.error("products GET:", e);
    return jsonSuccess(fallbackProducts);
  }
}
