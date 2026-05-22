import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const isValidId = mongoose.isValidObjectId(params.slug);
    const query = isValidId
      ? { $or: [{ slug: params.slug }, { _id: params.slug }], isPublished: true }
      : { slug: params.slug, isPublished: true };

    const post = await BlogPost.findOne(query).lean();
    if (!post) return jsonError("Blog post not found", 404);
    return jsonSuccess(post);
  } catch (e) {
    console.error("blog GET:", e);
    return jsonError("Failed to fetch blog post", 500);
  }
}
