import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getAdminFromRequest } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

const VALID_CATEGORIES = ["bottle", "apparel", "others"] as const;

function mongooseErrorMessage(e: unknown): string | null {
  const err = e as { errors?: Record<string, { message?: string }> };
  if (!err.errors) return null;
  return Object.values(err.errors)
    .map((x) => x.message)
    .filter(Boolean)
    .join(". ");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);
  try {
    const body = await req.json();
    if (body.imageBase64) {
      body.image = await uploadImage(body.imageBase64);
      delete body.imageBase64;
    }
    if (body.category !== undefined) {
      if (
        typeof body.category !== "string" ||
        !VALID_CATEGORIES.includes(body.category as (typeof VALID_CATEGORIES)[number])
      ) {
        return jsonError("Invalid category. Use bottle, apparel, or others.");
      }
    }
    if (body.size !== undefined) {
      body.size = String(body.size).trim();
      if (!body.size) return jsonError("Size is required");
    }

    await connectDB();
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!product) return jsonError("Product not found", 404);
    return jsonSuccess(product);
  } catch (e: unknown) {
    const err = e as { code?: number };
    if (err.code === 11000) return jsonError("Product slug already exists");
    const validationMsg = mongooseErrorMessage(e);
    if (validationMsg) return jsonError(validationMsg, 400);
    console.error("admin products PATCH:", e);
    return jsonError("Failed to update product", 500);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);
  await connectDB();
  await Product.findByIdAndDelete(params.id);
  return jsonSuccess({ message: "Deleted" });
}
