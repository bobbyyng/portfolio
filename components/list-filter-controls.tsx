"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type TagOption = {
  tag: string;
  count: number;
};

const VISIBLE_TAG_COUNT = 8;

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
          type="button"
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

export function TagPills({
  tags,
  selectedTags,
  onToggle,
  onClear,
}: {
  tags: TagOption[];
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
    const merged: TagOption[] = [];
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
