"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion";
import { BlogLangToggle, useBlogLang } from "@/components/blog-lang";
import { pickBilingualTitle } from "@/lib/blog-lang";
import { cn } from "@/lib/utils";

interface BlogPostData {
  slug: string;
  title: string;
  date?: string;
  tags: string[];
  summary?: string;
  coverImage?: string;
  readTime: number;
}

export interface BlogTagOption {
  tag: string;
  count: number;
}

const VISIBLE_TAG_COUNT = 8;

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
      className="group grid grid-cols-12 gap-4 py-8 border-b border-border items-start transition-colors hover:bg-foreground/[0.03] px-2 -mx-2"
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
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function TagPills({
  tags,
  selectedTags,
  onToggle,
  onClear,
}: {
  tags: BlogTagOption[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const visibleTags = useMemo(() => {
    if (expanded) return tags;

    const topTagNames = new Set(
      tags.slice(0, VISIBLE_TAG_COUNT).map((item) => item.tag)
    );
    const selectedExtras = tags.filter(
      (item) => selectedTags.includes(item.tag) && !topTagNames.has(item.tag)
    );
    const topTags = tags.filter((item) => topTagNames.has(item.tag));

    const seen = new Set<string>();
    const merged: BlogTagOption[] = [];
    for (const item of [...selectedExtras, ...topTags]) {
      if (!seen.has(item.tag)) {
        seen.add(item.tag);
        merged.push(item);
      }
    }
    return merged;
  }, [tags, expanded, selectedTags]);

  if (tags.length === 0) return null;

  const hiddenCount = expanded ? 0 : tags.length - visibleTags.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <p className="label-mono text-xs text-muted-foreground">Filter by tag</p>
        {selectedTags.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="label-mono text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Clear ({selectedTags.length})
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {visibleTags.map(({ tag }) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(tag)}
              className={cn(
                "label-mono rounded-full border px-3 py-1 text-xs transition-colors cursor-pointer",
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background/60 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              )}
            >
              {tag}
            </button>
          );
        })}

        {!expanded && hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="label-mono rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors cursor-pointer"
          >
            +{hiddenCount} more
          </button>
        )}

        {expanded && tags.length > VISIBLE_TAG_COUNT && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="label-mono text-xs text-muted-foreground hover:text-foreground transition-colors px-2 cursor-pointer"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
}

export function BlogFilter({
  posts,
  tagOptions,
}: {
  posts: BlogPostData[];
  tagOptions: BlogTagOption[];
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
