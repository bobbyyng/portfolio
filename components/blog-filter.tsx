"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
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
      <span className="label-mono text-muted-foreground hidden sm:block sm:col-span-1 pt-1">
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
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="label-mono rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 4 && (
            <span className="label-mono px-1 py-1 text-xs text-muted-foreground/70">
              +{post.tags.length - 4}
            </span>
          )}
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

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-border bg-background/60 py-2.5 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/40 focus:shadow-sm [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function BlogFilter({ posts }: { posts: BlogPostData[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.summary?.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [posts, query]);

  if (posts.length === 0) {
    return (
      <div className="border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No posts yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search posts by title or tag…"
      />
      {filtered.length === 0 ? (
        <div className="border-t border-foreground/20 py-16 text-center">
          <p className="text-muted-foreground">
            No posts match &ldquo;{query}&rdquo;
          </p>
        </div>
      ) : (
        <RevealGroup key={query} className="border-t border-foreground/20">
          {filtered.map((post, index) => (
            <RevealItem key={post.slug}>
              <PostCard post={post} index={index} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}
