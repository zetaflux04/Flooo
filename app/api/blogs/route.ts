import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models/BlogPost";
import { jsonSuccess } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const posts = await BlogPost.find({ isPublished: true })
      .select("title slug excerpt image publishedAt createdAt")
      .sort({ publishedAt: -1 })
      .lean();
    return jsonSuccess(posts);
  } catch (e) {
    console.error("blogs GET:", e);
    return jsonSuccess([]);
  }
}
