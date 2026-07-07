"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion";
import { SearchInput } from "@/components/blog-filter";
import { cn } from "@/lib/utils";

export interface ProjectListItem {
  slug: string;
  title: string;
  description?: string;
  tags: string[];
  dateRange: string | null;
}

export interface ProjectTagOption {
  tag: string;
  count: number;
}

const VISIBLE_TAG_COUNT = 8;

function ProjectCard({
  project,
  index,
}: {
  project: ProjectListItem;
  index: number;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group grid grid-cols-12 gap-4 py-8 border-b border-border items-baseline transition-colors hover:bg-foreground/[0.03] px-2 -mx-2"
    >
      <span className="label-mono text-muted-foreground hidden sm:block sm:col-span-1">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="col-span-12 sm:col-span-8">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2 group-hover:underline underline-offset-4 decoration-2">
          {project.title}
        </h2>
        {project.description && (
          <p className="text-muted-foreground mb-3 line-clamp-2">
            {project.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="label-mono rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 6 && (
            <span className="label-mono px-1 py-1 text-xs text-muted-foreground/70">
              +{project.tags.length - 6}
            </span>
          )}
        </div>
      </div>
      <div className="col-span-12 sm:col-span-3 flex sm:justify-end items-center gap-3">
        {project.dateRange && (
          <span className="label-mono text-muted-foreground whitespace-nowrap">
            {project.dateRange}
          </span>
        )}
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

function TagPills({
  tags,
  selectedTags,
  onToggle,
  onClear,
}: {
  tags: ProjectTagOption[];
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
    const merged: ProjectTagOption[] = [];
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

export function ProjectsFilter({
  projects,
  tagOptions,
}: {
  projects: ProjectListItem[];
  tagOptions: ProjectTagOption[];
}) {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = useMemo(() => {
    let result = projects;

    if (selectedTags.length > 0) {
      result = result.filter((project) =>
        selectedTags.some((tag) =>
          project.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
        )
      );
    }

    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(q) ||
          project.description?.toLowerCase().includes(q) ||
          project.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [projects, query, selectedTags]);

  const filterKey = `${query}-${selectedTags.join(",")}`;
  const hasActiveFilters = query.trim().length > 0 || selectedTags.length > 0;

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search projects by title or tag…"
        />
        <TagPills
          tags={tagOptions}
          selectedTags={selectedTags}
          onToggle={toggleTag}
          onClear={() => setSelectedTags([])}
        />
      </div>
      {filtered.length === 0 ? (
        <div className="border-t border-foreground/20 py-16 text-center">
          <p className="text-muted-foreground">
            {hasActiveFilters
              ? "No projects match the current filters."
              : "No projects found."}
          </p>
        </div>
      ) : (
        <RevealGroup key={filterKey} className="border-t border-foreground/20">
          {filtered.map((project, index) => (
            <RevealItem key={project.slug}>
              <ProjectCard project={project} index={index} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}
