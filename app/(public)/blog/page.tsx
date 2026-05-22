"use client";

import { useEffect, useState } from "react";
import BlogCard, { BlogPostData } from "@/components/ui/BlogCard";
import { BlogCardSkeleton } from "@/components/ui/Skeleton";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="page-container">
        <h1 className="section-title">Our Blog</h1>
        <p className="section-subtitle mb-12 max-w-2xl">
          News, tips, and stories from LSP Enterprises and the Flooo family.
        </p>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-muted text-center py-16">No blog posts published yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
