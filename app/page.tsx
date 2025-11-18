import Link from "next/link";
import { getAllProjects } from "@/lib/projects";

export default function Home() {
  const projects = getAllProjects();

  console.log(projects);


  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="max-w-4xl mx-auto py-16 px-4 sm:px-8">
        <header className="mb-12 text-center sm:text-left">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50 mb-4">
            Portfolio
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A collection of my projects and work
          </p>
        </header>

        {projects.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-8 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              No projects yet. Add MDX files to{" "}
              <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm">
                content/projects/
              </code>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="block bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-zinc-200 dark:border-zinc-800"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
                      {project.metadata.title}
                    </h2>
                    {project.metadata.description && (
                      <p className="text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
                        {project.metadata.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3">
                      {project.metadata.tags && project.metadata.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.metadata.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-700 dark:text-zinc-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-zinc-400 dark:text-zinc-600 sm:ml-4">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
