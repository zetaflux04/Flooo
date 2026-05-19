import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getAdminFromRequest } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

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

    await connectDB();
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true });
    if (!product) return jsonError("Product not found", 404);
    return jsonSuccess(product);
  } catch (e) {
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
