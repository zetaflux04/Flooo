import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { BlogPost, excerptFromBody } from "@/models/BlogPost";
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
      body.image = await uploadImage(body.imageBase64, "flooo/blog");
      delete body.imageBase64;
    }

    await connectDB();
    const existing = await BlogPost.findById(params.id);
    if (!existing) return jsonError("Blog post not found", 404);

    const updates: Record<string, unknown> = {};
    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.slug !== undefined) updates.slug = String(body.slug).trim();
    if (body.excerpt !== undefined) updates.excerpt = String(body.excerpt).trim();
    if (body.body !== undefined) {
      updates.body = body.body;
      if (!body.excerpt && !existing.excerpt) {
        updates.excerpt = excerptFromBody(body.body);
      }
    }
    if (body.image !== undefined) updates.image = body.image;
    if (body.isPublished !== undefined) {
      const published = Boolean(body.isPublished);
      updates.isPublished = published;
      if (published && !existing.publishedAt) {
        updates.publishedAt = new Date();
      }
      if (!published) {
        updates.publishedAt = null;
      }
    }

    const post = await BlogPost.findByIdAndUpdate(params.id, updates, { new: true });
    if (!post) return jsonError("Blog post not found", 404);
    return jsonSuccess(post);
  } catch (e: unknown) {
    const err = e as { code?: number };
    if (err.code === 11000) return jsonError("Blog slug already exists");
    return jsonError("Failed to update blog post", 500);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);
  await connectDB();
  await BlogPost.findByIdAndDelete(params.id);
  return jsonSuccess({ message: "Deleted" });
}
