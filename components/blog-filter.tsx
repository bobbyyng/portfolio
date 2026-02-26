"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  ArrowRight,
  Clock,
  BookOpen,
  Search,
  X,
} from "lucide-react";

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

function FeaturedPost({ post }: { post: BlogPostData }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {post.coverImage ? (
        <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
              {post.title}
            </h2>
            {post.summary && (
              <p className="text-white/80 line-clamp-2 text-sm md:text-base">
                {post.summary}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <BookOpen className="w-32 h-32 text-white" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
              {post.title}
            </h2>
            {post.summary && (
              <p className="text-white/80 line-clamp-2 text-sm md:text-base">
                {post.summary}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          {formatDate(post.date) && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.date)}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime} min read
          </span>
        </div>
        <span className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
          Read article <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: BlogPostData }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {post.coverImage ? (
        <div className="relative w-full h-40 sm:h-44 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="relative w-full h-40 sm:h-44 overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <BookOpen className="w-16 h-16 text-zinc-400 dark:text-zinc-500" />
          </div>
        </div>
      )}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <h2 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {post.title}
        </h2>
        {post.summary && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4 flex-1">
            {post.summary}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            {formatDate(post.date) && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(post.date)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime} min
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}

export function BlogFilter({
  posts,
  allTags,
}: {
  posts: BlogPostData[];
  allTags: string[];
}) {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        (post.summary?.toLowerCase().includes(q) ?? false) ||
        post.tags.some((t) => t.toLowerCase().includes(q));

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((st) =>
          post.tags.some((t) => t.toLowerCase() === st.toLowerCase())
        );

      return matchesSearch && matchesTags;
    });
  }, [posts, search, selectedTags]);

  const isFiltering = search !== "" || selectedTags.length > 0;
  const [featured, ...rest] = filtered;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAll = () => {
    setSearch("");
    setSelectedTags([]);
  };

  return (
    <>
      {/* Search + Tags */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts by title, summary, or tag..."
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mr-1">
            Tags:
          </span>
          {allTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {tag}
              </button>
            );
          })}
          {isFiltering && (
            <button
              onClick={clearAll}
              className="text-xs px-3 py-1.5 rounded-full font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-12 text-center">
          <Search className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400 mb-1">
            No posts match your search
          </p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Try a different keyword or clear the filters
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {!isFiltering && featured ? (
            <>
              <FeaturedPost post={featured} />
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rest.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
