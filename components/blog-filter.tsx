"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion";

interface BlogPostData {
  slug: string;
  title: string;
  date?: string;
  tags: string[];
  summary?: string;
  coverImage?: string;
  readTime: number;
}

function formatDate(dateStr: string | undefined): string | null {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function PostCard({ post, index }: { post: BlogPostData; index: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-12 gap-4 py-8 border-b border-border items-start transition-colors hover:bg-foreground/[0.03] px-2 -mx-2"
    >
      <span className="label-mono text-muted-foreground col-span-12 sm:col-span-1 pt-1">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="col-span-12 sm:col-span-8">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2 group-hover:underline underline-offset-4 decoration-2 line-clamp-2">
          {post.title}
        </h2>
        {post.summary && (
          <p className="text-muted-foreground line-clamp-2 mb-3">
            {post.summary}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {post.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="label-mono text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="col-span-12 sm:col-span-3 flex sm:flex-col sm:items-end gap-2 pt-1">
        <div className="flex items-center gap-3 label-mono text-muted-foreground whitespace-nowrap">
          {formatDate(post.date) && <span>{formatDate(post.date)}</span>}
          <span>{post.readTime} min</span>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all sm:mt-2" />
      </div>
    </Link>
  );
}

export function BlogFilter({ posts }: { posts: BlogPostData[] }) {
  if (posts.length === 0) {
    return (
      <div className="border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No posts yet.</p>
      </div>
    );
  }

  return (
    <RevealGroup className="border-t border-foreground/20">
      {posts.map((post, index) => (
        <RevealItem key={post.slug}>
          <PostCard post={post} index={index} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
