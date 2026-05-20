import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getAdminFromRequest } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

async function requireAdmin(req: Request) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return null;
  return admin;
}

export async function GET(req: Request) {
  if (!(await requireAdmin(req))) return jsonError("Unauthorized", 401);
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return jsonSuccess(products);
  } catch (e) {
    console.warn("DB connection failed, returning empty products list", e);
    return jsonSuccess([]);
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return jsonError("Unauthorized", 401);
  try {
    const body = await req.json();
    const { name, size, packQty, price, description, stock, image, imageBase64, category } = body;

    if (!name?.trim() || !size?.trim() || price == null || price === "") {
      return jsonError("Name, size, and price are required");
    }

    const slug =
      body.slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    let imageUrl = image || "";
    if (imageBase64) {
      imageUrl = await uploadImage(imageBase64);
    }

    await connectDB();
    const product = await Product.create({
      name,
      slug,
      category: category || "bottle",
      size,
      packQty: packQty ?? 1,
      price,
      description: description || "",
      image: imageUrl,
      stock: stock ?? 100,
      isActive: true,
    });

    return jsonSuccess(product, 201);
  } catch (e: unknown) {
    const err = e as { code?: number };
    if (err.code === 11000) return jsonError("Product slug already exists");
    return jsonError("Failed to create product", 500);
  }
}
