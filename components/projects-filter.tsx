"use client";

import { useMemo, useState, useCallback, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowRight, ArrowUpDown } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion";
import {
  SearchInput,
  TagPills,
  type TagOption,
} from "@/components/list-filter-controls";
import { cn } from "@/lib/utils";

export interface ProjectListItem {
  slug: string;
  title: string;
  description?: string;
  tags: string[];
  dateRange: string | null;
  startDate?: string | null;
  sorting?: number;
  cover?: string | null;
}

type SortOrder = "default" | "newest" | "oldest" | "az";

export type ProjectTagOption = TagOption;

const COVER_GRADIENTS = [
  "from-slate-800 to-slate-700",
  "from-zinc-800 to-zinc-700",
  "from-stone-800 to-stone-700",
  "from-neutral-800 to-neutral-700",
  "from-gray-800 to-gray-700",
];

function CoverPlaceholder({ title }: { title: string }) {
  const initial = title.trim()[0]?.toUpperCase() ?? "P";
  const gradientIndex =
    title.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    COVER_GRADIENTS.length;
  const gradient = COVER_GRADIENTS[gradientIndex];
  return (
    <div
      className={cn(
        "w-full h-full bg-linear-to-br flex items-center justify-center",
        gradient
      )}
    >
      <span className="label-mono text-2xl font-bold text-white/20 select-none">
        {initial}
      </span>
    </div>
  );
}

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
      className="group grid grid-cols-12 gap-6 py-6 border-b border-border items-start transition-colors hover:bg-foreground/3 px-2 -mx-2"
    >
      {/* index number */}
      <span className="label-mono text-muted-foreground hidden sm:block sm:col-span-1 pt-1">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* text content */}
      <div className="col-span-12 sm:col-span-7 flex flex-col gap-2">
        {project.dateRange && (
          <span className="label-mono text-xs text-muted-foreground">
            {project.dateRange}
          </span>
        )}
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground group-hover:underline underline-offset-4 decoration-2">
          {project.title}
        </h2>
        {project.description && (
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {project.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-1">
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

      {/* cover image */}
      <div className="col-span-12 sm:col-span-4 flex flex-col items-end gap-3">
        <div className="w-full aspect-video rounded-md overflow-hidden border border-border">
          {project.cover ? (
            <Image
              src={project.cover}
              alt={project.title}
              width={480}
              height={270}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <CoverPlaceholder title={project.title} />
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0" />
      </div>
    </Link>
  );
}

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "az", label: "A – Z" },
];

function SortControl({
  value,
  onChange,
}: {
  value: SortOrder;
  onChange: (v: SortOrder) => void;
}) {
  const current = SORT_OPTIONS.find((o) => o.value === value)!;
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <div className="flex items-center gap-1">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "label-mono rounded-full border px-3 py-1 text-xs transition-colors cursor-pointer",
              value === opt.value
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background/60 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const initialQuery = searchParams.get("q") ?? "";
  const initialTags = searchParams.getAll("tag");
  const initialSort = (searchParams.get("sort") as SortOrder) ?? "default";

  const [query, setQuery] = useState(initialQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSort);

  const pushUrl = useCallback(
    (q: string, tags: string[], sort: SortOrder) => {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      tags.forEach((t) => params.append("tag", t));
      if (sort !== "default") params.set("sort", sort);
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [router, pathname]
  );

  const handleQueryChange = (v: string) => {
    setQuery(v);
    pushUrl(v, selectedTags, sortOrder);
  };

  const handleToggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(next);
    pushUrl(query, next, sortOrder);
  };

  const handleClearTags = () => {
    setSelectedTags([]);
    pushUrl(query, [], sortOrder);
  };

  const handleSortChange = (v: SortOrder) => {
    setSortOrder(v);
    pushUrl(query, selectedTags, v);
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

    if (sortOrder === "newest") {
      result = [...result].sort((a, b) => {
        const aYear = parseInt(a.startDate ?? "0", 10);
        const bYear = parseInt(b.startDate ?? "0", 10);
        return bYear - aYear;
      });
    } else if (sortOrder === "oldest") {
      result = [...result].sort((a, b) => {
        const aYear = parseInt(a.startDate ?? "0", 10);
        const bYear = parseInt(b.startDate ?? "0", 10);
        return aYear - bYear;
      });
    } else if (sortOrder === "az") {
      result = [...result].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    return result;
  }, [projects, query, selectedTags, sortOrder]);

  const filterKey = `${query}-${selectedTags.join(",")}-${sortOrder}`;
  const hasActiveFilters = query.trim().length > 0 || selectedTags.length > 0;

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <SearchInput
          value={query}
          onChange={handleQueryChange}
          placeholder="Search projects by title or tag…"
        />
        <TagPills
          tags={tagOptions}
          selectedTags={selectedTags}
          onToggle={handleToggleTag}
          onClear={handleClearTags}
        />
        <SortControl value={sortOrder} onChange={handleSortChange} />
      </div>

      <div className="flex items-center justify-between border-t border-foreground/20 pt-6">
        <p className="label-mono text-xs text-muted-foreground">
          Showing{" "}
          <span className="text-foreground font-medium">{filtered.length}</span>{" "}
          of{" "}
          <span className="text-foreground font-medium">{projects.length}</span>{" "}
          projects
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            {hasActiveFilters
              ? "No projects match the current filters."
              : "No projects found."}
          </p>
        </div>
      ) : (
        <RevealGroup key={filterKey} className="mt-0">
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
