import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface BlogPostData {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  publishedAt?: string | Date | null;
  createdAt?: string | Date;
}

interface BlogCardProps {
  post: BlogPostData;
}

export default function BlogCard({ post }: BlogCardProps) {
  const date = post.publishedAt || post.createdAt;

  return (
    <Link href={`/blog/${post.slug}`} className="card card-hover flex flex-col overflow-hidden group">
      <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden bg-gradient-to-b from-light-blue to-white">
        <Image
          src={post.image || "/1.png"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      {date && (
        <p className="flex items-center gap-1.5 text-xs text-muted mb-2">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(date)}
        </p>
      )}
      <h3 className="font-bold text-secondary text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {post.title}
      </h3>
      <p className="text-muted text-sm line-clamp-3 flex-1 mb-4">
        {post.excerpt || "Read more about Flooo and our hydration journey."}
      </p>
      <span className="text-primary text-sm font-semibold mt-auto">Read More →</span>
    </Link>
  );
}
