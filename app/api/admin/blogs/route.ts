import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { BlogPost, slugifyTitle, excerptFromBody } from "@/models/BlogPost";
import { getAdminFromRequest } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function GET(req: Request) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);
  try {
    await connectDB();
    const posts = await BlogPost.find().sort({ createdAt: -1 }).lean();
    return jsonSuccess(posts);
  } catch (e) {
    console.warn("blogs admin GET failed", e);
    return jsonSuccess([]);
  }
}

export async function POST(req: NextRequest) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);
  try {
    const body = await req.json();
    const { title, excerpt, body: postBody, slug, image, imageBase64, isPublished } = body;

    if (!title?.trim()) return jsonError("Title is required");

    const finalSlug = (slug || slugifyTitle(title)).trim();
    if (!finalSlug) return jsonError("Valid slug is required");

    let imageUrl = image || "";
    if (imageBase64) {
      imageUrl = await uploadImage(imageBase64, "flooo/blog");
    }

    const published = Boolean(isPublished);
    const excerptText =
      excerpt?.trim() || excerptFromBody(postBody || "");

    await connectDB();
    const post = await BlogPost.create({
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerptText,
      body: postBody || "",
      image: imageUrl,
      isPublished: published,
      publishedAt: published ? new Date() : null,
    });

    return jsonSuccess(post, 201);
  } catch (e: unknown) {
    const err = e as { code?: number };
    if (err.code === 11000) return jsonError("Blog slug already exists");
    return jsonError("Failed to create blog post", 500);
  }
}
