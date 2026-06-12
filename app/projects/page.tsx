import Link from "next/link";
import { getAllProjects, type Project } from "@/lib/projects";
import { ChatButton } from "@/components/chat-button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { ArrowRight } from "lucide-react";

function formatDateRange(project: Project) {
  // If startDate and endDate are provided, use them
  if (project.metadata.startDate) {
    const endDate = project.metadata.endDate || "Present";
    return `${project.metadata.startDate} - ${endDate}`;
  }

  // Fallback to date or period if they exist
  if (project.metadata.date) {
    return project.metadata.date;
  }

  if (project.metadata.period) {
    return project.metadata.period;
  }

  return null;
}

export default function ProjectsPage() {
  const projects = getAllProjects();

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
          <RevealGroup className="border-t border-foreground/20">
            {projects.map((project, index) => (
              <RevealItem key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group grid grid-cols-12 gap-4 py-8 border-b border-border items-baseline transition-colors hover:bg-foreground/[0.03] px-2 -mx-2"
                >
                  <span className="label-mono text-muted-foreground col-span-12 sm:col-span-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="col-span-12 sm:col-span-8">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2 group-hover:underline underline-offset-4 decoration-2">
                      {project.metadata.title}
                    </h2>
                    {project.metadata.description && (
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {project.metadata.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {project.metadata.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="label-mono text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-3 flex sm:justify-end items-center gap-3">
                    {formatDateRange(project) && (
                      <span className="label-mono text-muted-foreground whitespace-nowrap">
                        {formatDateRange(project)}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>

      <ChatButton />
    </div>
  );
}
