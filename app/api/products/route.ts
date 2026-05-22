import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { jsonSuccess } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const fallbackProducts = [
  {
    _id: "floo-250ml",
    name: "Floo 250 ml",
    slug: "floo-250ml",
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
    _id: "floo-500ml",
    name: "Floo 500 ml",
    slug: "floo-500ml",
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
    _id: "floo-1l",
    name: "Floo 1000 ml",
    slug: "floo-1l",
    category: "bottle",
    size: "1000 ml",
    packQty: 12,
    price: 120,
    description: "Ideal for sharing or long journeys.",
    image: "/3.png",
    stock: 100,
    isActive: true,
  },
  {
    _id: "flowers-250ml",
    name: "Flowers 250 ml",
    slug: "flowers-250ml",
    category: "bottle",
    size: "250ml",
    packQty: 24,
    price: 80,
    description: "Flowers brand mineral water in convenient 250ml bottles.",
    image: "/flooo-bottle.png",
    stock: 100,
    isActive: true,
  },
  {
    _id: "flowers-500ml",
    name: "Flowers 500 ml",
    slug: "flowers-500ml",
    category: "bottle",
    size: "500ml",
    packQty: 24,
    price: 100,
    description: "Flowers brand 500ml pack.",
    image: "/2.png",
    stock: 100,
    isActive: true,
  },
  {
    _id: "flowers-1l",
    name: "Flowers 1000 ml",
    slug: "flowers-1l",
    category: "bottle",
    size: "1000 ml",
    packQty: 12,
    price: 115,
    description: "Flowers brand 1000 ml bottles.",
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
    if (category === "bottle" || category === "apparel" || category === "others") {
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
