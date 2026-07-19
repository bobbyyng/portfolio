"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion";
import { BlogLangToggle, useBlogLang } from "@/components/blog-lang";
import { pickBilingualTitle } from "@/lib/blog-lang";
import {
  SearchInput,
  TagPills,
  type TagOption,
} from "@/components/list-filter-controls";

interface BlogPostData {
  slug: string;
  title: string;
  date?: string;
  tags: string[];
  summary?: string;
  coverImage?: string;
  readTime: number;
}

export type BlogTagOption = TagOption;

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
  const { lang } = useBlogLang();
  const title = pickBilingualTitle(post.title, lang);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-12 gap-4 py-8 border-b border-border items-start transition-colors hover:bg-foreground/3 px-2 -mx-2"
    >
      <span className="label-mono text-muted-foreground hidden sm:block sm:col-span-1 pt-1">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="col-span-12 sm:col-span-8">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2 group-hover:underline underline-offset-4 decoration-2 line-clamp-2">
          {title}
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

export function BlogFilter({
  posts,
  tagOptions,
}: {
  posts: BlogPostData[];
  tagOptions: TagOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const { lang } = useBlogLang();

  const initialQuery = searchParams.get("q") ?? "";
  const initialTags = searchParams.getAll("tag");

  const [query, setQuery] = useState(initialQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  const pushUrl = useCallback(
    (q: string, tags: string[]) => {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      tags.forEach((t) => params.append("tag", t));
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [router, pathname, startTransition]
  );

  const handleQueryChange = (v: string) => {
    setQuery(v);
    pushUrl(v, selectedTags);
  };

  const handleToggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(next);
    pushUrl(query, next);
  };

  const handleClearTags = () => {
    setSelectedTags([]);
    pushUrl(query, []);
  };

  const filtered = useMemo(() => {
    let result = posts;

    if (selectedTags.length > 0) {
      result = result.filter((post) =>
        selectedTags.some((tag) =>
          post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
        )
      );
    }

    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((post) => {
        const localizedTitle = pickBilingualTitle(post.title, lang).toLowerCase();
        return (
          localizedTitle.includes(q) ||
          post.title.toLowerCase().includes(q) ||
          post.summary?.toLowerCase().includes(q) ||
          post.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      });
    }

    return result;
  }, [posts, query, selectedTags, lang]);

  if (posts.length === 0) {
    return (
      <div className="border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No posts yet.</p>
      </div>
    );
  }

  const filterKey = `${query}-${selectedTags.join(",")}`;
  const hasActiveFilters = query.trim().length > 0 || selectedTags.length > 0;

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={query}
            onChange={handleQueryChange}
            placeholder="Search posts by title or tag…"
          />
          <BlogLangToggle className="self-start sm:self-auto" />
        </div>
        <TagPills
          tags={tagOptions}
          selectedTags={selectedTags}
          onToggle={handleToggleTag}
          onClear={handleClearTags}
        />
      </div>

      <div className="flex items-center justify-between border-t border-foreground/20 pt-6">
        <p className="label-mono text-xs text-muted-foreground">
          Showing{" "}
          <span className="text-foreground font-medium">{filtered.length}</span>{" "}
          of{" "}
          <span className="text-foreground font-medium">{posts.length}</span>{" "}
          posts
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            {hasActiveFilters
              ? "No posts match the current filters."
              : "No posts found."}
          </p>
        </div>
      ) : (
        <RevealGroup key={filterKey} className="mt-0">
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
