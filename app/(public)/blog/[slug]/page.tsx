"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import BlogCard, { BlogPostData } from "@/components/ui/BlogCard";
import { formatDate } from "@/lib/utils";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData & { body?: string } | null>(null);
  const [related, setRelated] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/blogs/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data._id) setPost(data);
        else setPost(null);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));

    fetch("/api/blogs")
      .then((r) => r.json())
      .then((all: BlogPostData[]) => {
        if (Array.isArray(all)) {
          setRelated(all.filter((p) => p.slug !== slug).slice(0, 3));
        }
      })
      .catch(() => setRelated([]));
  }, [slug]);

  if (loading) {
    return (
      <div className="py-12 bg-background min-h-screen">
        <div className="page-container animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-8" />
          <div className="h-64 md:h-96 bg-gray-200 rounded-card mb-8" />
          <div className="h-10 w-2/3 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-40 bg-gray-200 rounded mb-8" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-20 bg-background min-h-screen text-center">
        <div className="page-container">
          <h1 className="text-2xl font-bold text-secondary mb-4">Post not found</h1>
          <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const date = post.publishedAt || post.createdAt;

  return (
    <article className="py-12 bg-background min-h-screen">
      <div className="page-container max-w-6xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-muted hover:text-primary text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div className="relative w-full h-64 md:h-96 rounded-card overflow-hidden mb-8 shadow-card">
          <Image
            src={post.image || "/1.png"}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">{post.title}</h1>

        {date && (
          <p className="flex items-center gap-2 text-muted text-sm mb-8">
            <Calendar className="w-4 h-4" />
            {formatDate(date)}
          </p>
        )}

        <div className="prose prose-lg max-w-none text-foreground whitespace-pre-wrap leading-relaxed">
          {post.body || post.excerpt}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 pt-12 border-t border-gray-100">
          <div className="page-container">
            <h2 className="section-title text-2xl mb-8">More Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <BlogCard key={p._id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
