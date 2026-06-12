import { getAllProjects, type Project } from "@/lib/projects";
import { Reveal } from "@/components/motion";
import { ProjectsFilter } from "@/components/projects-filter";

function formatDateRange(project: Project): string | null {
  // If startDate and endDate are provided, use them
  if (project.metadata.startDate) {
    const endDate = project.metadata.endDate || "Present";
    return `${project.metadata.startDate} - ${endDate}`;
  }

  // Fallback to date or period if they exist
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

  const projectsData = projects.map((project) => ({
    slug: project.slug,
    title: project.metadata.title,
    description: project.metadata.description,
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
          <ProjectsFilter projects={projectsData} />
        )}
      </div>

    </div>
  );
}
