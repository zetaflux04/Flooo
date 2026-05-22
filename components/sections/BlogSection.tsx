"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BlogCard, { BlogPostData } from "@/components/ui/BlogCard";
import { BlogCardSkeleton } from "@/components/ui/Skeleton";

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setPosts(list.slice(0, 3));
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section id="blog" className="py-20 bg-white relative">
      <div className="page-container">
        <h2 className="section-title">Latest From Our Blog</h2>
        <p className="section-subtitle mb-12">
          Insights, updates, and stories from LSP Enterprises and Flooo.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <BlogCardSkeleton key={i} />)
            : posts.map((post) => <BlogCard key={post._id} post={post} />)}
        </div>
        <div className="text-center mt-10">
          <Link href="/blog" className="btn-primary inline-block">
            View All Blogs
          </Link>
        </div>
      </div>
    </section>
  );
}
