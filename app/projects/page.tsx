import type { Metadata } from "next";
import {
  getAllProjects,
  getProjectTagsByFrequency,
  getProjectDescription,
  type Project,
} from "@/lib/projects";
import { Reveal } from "@/components/motion";
import { ProjectsFilter } from "@/components/projects-filter";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description:
    "Selected work across AI/RAG agents, admission systems, e-commerce platforms, digital signage, and cloud infrastructure.",
  path: "/projects",
});

function formatDateRange(project: Project): string | null {
  if (project.metadata.startDate) {
    const endDate = project.metadata.endDate || "Present";
    return `${project.metadata.startDate} - ${endDate}`;
  }

  if (typeof project.metadata.date === "string") {
    return project.metadata.date;
  }

  if (typeof project.metadata.period === "string") {
    return project.metadata.period;
  }

  return null;
}

export default function ProjectsPage() {
  const projects = getAllProjects();
  const tagOptions = getProjectTagsByFrequency();

  const projectsData = projects.map((project) => ({
    slug: project.slug,
    title: project.metadata.title,
    description: getProjectDescription(project),
    tags: project.metadata.tags ?? [],
    dateRange: formatDateRange(project),
  }));

  return (
    <div className="min-h-screen py-16 lg:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <header className="mb-16">
            <p className="label-mono text-muted-foreground mb-4">
              Selected work
            </p>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
              Projects.
            </h1>
            <p className="text-muted-foreground max-w-md">
              A collection of my work and projects
            </p>
          </header>
        </Reveal>

        {projects.length === 0 ? (
          <div className="border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              No projects yet. Add MDX files to{" "}
              <code className="bg-muted px-2 py-1 rounded">
                content/projects/
              </code>
            </p>
          </div>
        ) : (
          <ProjectsFilter projects={projectsData} tagOptions={tagOptions} />
        )}
      </div>
    </div>
  );
}
