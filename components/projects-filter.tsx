"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion";
import { SearchInput } from "@/components/blog-filter";

export interface ProjectListItem {
  slug: string;
  title: string;
  description?: string;
  tags: string[];
  dateRange: string | null;
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

export function ProjectsFilter({ projects }: { projects: ProjectListItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(q) ||
        project.description?.toLowerCase().includes(q) ||
        project.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [projects, query]);

  return (
    <div className="space-y-8">
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search projects by title or tag…"
      />
      {filtered.length === 0 ? (
        <div className="border-t border-foreground/20 py-16 text-center">
          <p className="text-muted-foreground">
            No projects match &ldquo;{query}&rdquo;
          </p>
        </div>
      ) : (
        <RevealGroup key={query} className="border-t border-foreground/20">
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
